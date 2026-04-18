// ============================================================================
// CRYPTO WORKER — весь тяжёлый pipeline в отдельном потоке
// Принимает: { id, op, ...params }
// op = 'encrypt' | 'decrypt' | 'deriveKeys'
// ============================================================================

// ── Утилиты ──────────────────────────────────────────────────────────────────
const zeroize = (...bufs) => {
    for (const b of bufs) {
        if (b instanceof Uint8Array) b.fill(0);
        else if (b instanceof ArrayBuffer) new Uint8Array(b).fill(0);
    }
};

const constTimeEqual = (a, b) => {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
};

// ── KDF ───────────────────────────────────────────────────────────────────────
async function deriveRawBits(password, salt, originInfo) {
    const pwBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey('raw', pwBytes, 'PBKDF2', false, ['deriveBits']);
    const baseBits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-512' }, baseKey, 512
    );
    const hkdfKey = await crypto.subtle.importKey('raw', baseBits, 'HKDF', false, ['deriveBits']);
    const derive = (label, bits = 256) => crypto.subtle.deriveBits(
        { name: 'HKDF', hash: 'SHA-512', salt: new TextEncoder().encode(label), info: originInfo },
        hkdfKey, bits
    );
    const [encBits, macBits, shufBits, xorBits, ccBits] = await Promise.all([
        derive('k-aes-gcm'), derive('k-hmac-512', 512),
        derive('k-block-shuf'), derive('k-xor-stream'), derive('k-cc20-poly'),
    ]);
    zeroize(baseBits);
    return { encBits, macBits, shufBits, xorBits, ccBits };
}

async function importKeys(encBits, macBits) {
    const encKey = await crypto.subtle.importKey('raw', new Uint8Array(encBits), 'AES-GCM', false, ['encrypt', 'decrypt']);
    const macKey = await crypto.subtle.importKey('raw', new Uint8Array(macBits), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign', 'verify']);
    return { encKey, macKey };
}

// ── XOR-поток (SHA-512 PRF) ───────────────────────────────────────────────────
async function xorStream(keyBytes, data) {
    const out = new Uint8Array(data.length);
    const blockSize = 64;
    const blocks = Math.ceil(data.length / blockSize);
    for (let b = 0; b < blocks; b++) {
        const ctr = new Uint8Array(8);
        new DataView(ctr.buffer).setUint32(4, b, false);
        const prfInput = new Uint8Array(8 + keyBytes.length);
        prfInput.set(ctr, 0); prfInput.set(keyBytes, 8);
        const ksBlock = new Uint8Array(await crypto.subtle.digest('SHA-512', prfInput));
        const start = b * blockSize, end = Math.min(start + blockSize, data.length);
        for (let i = start; i < end; i++) out[i] = data[i] ^ ksBlock[i - start];
    }
    return out;
}

// ── Block shuffle / unshuffle ─────────────────────────────────────────────────
async function buildShuffleOrder(keyBytes, n) {
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        const prfIn = new Uint8Array(keyBytes.length + 4);
        prfIn.set(keyBytes, 0);
        new DataView(prfIn.buffer).setUint32(keyBytes.length, i, false);
        const h = new Uint8Array(await crypto.subtle.digest('SHA-256', prfIn));
        const rand = (h[0] << 24 | h[1] << 16 | h[2] << 8 | h[3]) >>> 0;
        const j = rand % (i + 1);
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

async function blockShuffle(keyBytes, data, blockSize = 16) {
    if (data.length < blockSize * 2) return new Uint8Array(data);
    const blocks = [];
    for (let i = 0; i < data.length; i += blockSize)
        blocks.push(new Uint8Array(data.slice(i, i + blockSize)));
    const order = await buildShuffleOrder(keyBytes, blocks.length);
    const out = new Uint8Array(data.length);
    let pos = 0;
    order.forEach(idx => { out.set(blocks[idx], pos); pos += blocks[idx].length; });
    return out;
}

async function blockUnshuffle(keyBytes, data, blockSize = 16) {
    if (data.length < blockSize * 2) return new Uint8Array(data);
    const blocks = [];
    for (let i = 0; i < data.length; i += blockSize)
        blocks.push(new Uint8Array(data.slice(i, i + blockSize)));
    const order = await buildShuffleOrder(keyBytes, blocks.length);
    const inverse = new Array(blocks.length);
    order.forEach((orig, shuffled) => { inverse[orig] = shuffled; });
    const out = new Uint8Array(data.length);
    let pos = 0;
    inverse.forEach(idx => { out.set(blocks[idx], pos); pos += blocks[idx].length; });
    return out;
}

// ── HMAC ──────────────────────────────────────────────────────────────────────
async function computeHMAC(macKey, data) {
    return new Uint8Array(await crypto.subtle.sign('HMAC', macKey, data));
}
async function verifyHMAC(macKey, data, tag) {
    return crypto.subtle.verify('HMAC', macKey, tag, data);
}

// ── Zero-padding ──────────────────────────────────────────────────────────────
function zeroPad(data, padBlock = 64) {
    const padLen = padBlock - (data.length % padBlock);
    const out = new Uint8Array(data.length + padLen + 2);
    out.set(data, 0);
    new DataView(out.buffer).setUint16(data.length + padLen, padLen, false);
    return { padded: out, padLen };
}
function zeroUnpad(data) {
    if (data.length < 2) throw new Error('Invalid padded data');
    const padLen = new DataView(data.buffer, data.byteOffset).getUint16(data.length - 2, false);
    if (padLen < 1 || padLen > 64 || data.length < padLen + 2) throw new Error('Invalid padding');
    return data.slice(0, data.length - padLen - 2);
}

// ── MAGIC ─────────────────────────────────────────────────────────────────────
const MAGIC = new Uint8Array([0x4E, 0x56, 0x34, 0x00]);
const FORMAT_VERSION = 4;

function arrayBufferToBase64(buf) {
    const bytes = new Uint8Array(buf); let b = '';
    for (let i = 0; i < bytes.byteLength; i++) b += String.fromCharCode(bytes[i]);
    return btoa(b);
}
function base64ToArrayBuffer(b64) {
    const b = atob(b64), bytes = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i);
    return bytes.buffer;
}
function generateRandomBytes(n) {
    const a = new Uint8Array(n); crypto.getRandomValues(a); return a;
}

// ── ENCRYPT (полный pipeline) ─────────────────────────────────────────────────
async function encryptFull(text, password, originInfo) {
    const salt   = generateRandomBytes(32);
    const ivAes  = generateRandomBytes(12);
    const canary = generateRandomBytes(8);

    const rawBits = await deriveRawBits(password, salt, originInfo);
    const { encKey, macKey } = await importKeys(rawBits.encBits, rawBits.macBits);
    const shufKey = new Uint8Array(rawBits.shufBits);
    const xorKey  = new Uint8Array(rawBits.xorBits);

    const plainBytes = new TextEncoder().encode(text);
    const { padded, padLen } = zeroPad(plainBytes, 64);
    const xored    = await xorStream(xorKey, padded);
    const shuffled = await blockShuffle(shufKey, xored);

    const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivAes }, encKey, shuffled);
    const cipher = new Uint8Array(cipherBuf);

    const header = new Uint8Array(4 + 1 + 32 + 12 + 2);
    header.set(MAGIC, 0); header[4] = FORMAT_VERSION;
    header.set(salt, 5); header.set(ivAes, 37);
    new DataView(header.buffer).setUint16(49, padLen, false);

    const macInput = new Uint8Array(header.length + cipher.length);
    macInput.set(header, 0); macInput.set(cipher, header.length);
    const hmacTag = await computeHMAC(macKey, macInput);

    const payload = new Uint8Array(51 + 64 + cipher.length);
    payload.set(header, 0); payload.set(hmacTag, 51); payload.set(cipher, 115);

    const out = new Uint8Array(payload.length + 8);
    out.set(payload, 0); out.set(canary, payload.length);

    zeroize(padded, xored, shuffled, cipher);
    zeroize(rawBits.macBits, rawBits.shufBits, rawBits.xorBits, rawBits.ccBits);

    return arrayBufferToBase64(out.buffer);
}

// ── DECRYPT (полный pipeline) ─────────────────────────────────────────────────
async function decryptFull(encData, password, originInfo) {
    const combined = new Uint8Array(base64ToArrayBuffer(encData));

    const isV4 = combined.length > 4 &&
        combined[0] === MAGIC[0] && combined[1] === MAGIC[1] &&
        combined[2] === MAGIC[2] && combined[3] === MAGIC[3] &&
        combined[4] === FORMAT_VERSION;

    // v3 fallback
    if (!isV4 && combined[0] === 3) {
        const salt = combined.slice(1, 17), iv = combined.slice(17, 29);
        const pepper = combined.slice(29, 33), hmacTag = combined.slice(33, 65);
        const cipher = combined.slice(65);
        const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
        const baseBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' }, baseKey, 512);
        const hkdfKey = await crypto.subtle.importKey('raw', baseBits, 'HKDF', false, ['deriveBits']);
        const [encBits, macBits] = await Promise.all([
            crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('enc-key-v3'), info: new Uint8Array(0) }, hkdfKey, 256),
            crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('mac-key-v3'), info: new Uint8Array(0) }, hkdfKey, 256),
        ]);
        const encKey = await crypto.subtle.importKey('raw', encBits, 'AES-GCM', false, ['encrypt', 'decrypt']);
        const macKey = await crypto.subtle.importKey('raw', macBits, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
        const aad = new Uint8Array(33 + cipher.length);
        aad.set(combined.slice(0, 33), 0); aad.set(cipher, 33);
        const valid = await crypto.subtle.verify('HMAC', macKey, hmacTag, aad);
        if (!valid) throw new Error('Integrity check failed');
        const decBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, encKey, cipher);
        const decBytes = new Uint8Array(decBuf);
        // v3 использовал LCG xorScramble — восстанавливаем оригинальный алгоритм
        const pepperSeed = (pepper[0] << 24 | pepper[1] << 16 | pepper[2] << 8 | pepper[3]) >>> 0;
        const unscrambled = new Uint8Array(decBytes.length);
        let s = pepperSeed;
        for (let i = 0; i < decBytes.length; i++) {
            s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
            unscrambled[i] = decBytes[i] ^ (s & 0xff);
        }
        return new TextDecoder().decode(unscrambled);
    }

    // v2 legacy fallback
    if (!isV4) {
        const legacyKey = await (async () => {
            const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
            const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: combined.slice(0, 16), iterations: 100000, hash: 'SHA-256' }, km, 256);
            return crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['decrypt']);
        })();
        const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: combined.slice(16, 28) }, legacyKey, combined.slice(28));
        return new TextDecoder().decode(dec);
    }

    // v4
    const salt    = combined.slice(5,  37);
    const ivAes   = combined.slice(37, 49);
    // Читаем padLen напрямую из slice — избегаем проблем с byteOffset
    const padLenBytes = combined.slice(49, 51);
    const padLen  = (padLenBytes[0] << 8) | padLenBytes[1];
    const hmacTag = combined.slice(51, 115);
    const withCanary = combined.slice(115);
    if (withCanary.length < 8) throw new Error('Data too short');
    const cipher = withCanary.slice(0, withCanary.length - 8);

    const rawBits = await deriveRawBits(password, salt, originInfo);
    const { encKey, macKey } = await importKeys(rawBits.encBits, rawBits.macBits);
    const shufKey = new Uint8Array(rawBits.shufBits);
    const xorKey  = new Uint8Array(rawBits.xorBits);

    const header = combined.slice(0, 51);
    const macInput = new Uint8Array(51 + cipher.length);
    macInput.set(header, 0); macInput.set(cipher, 51);

    const valid = await verifyHMAC(macKey, macInput, hmacTag);
    if (!valid) throw new Error('Integrity check failed — wrong password or tampered data');

    const decBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivAes }, encKey, cipher);
    const decBytes = new Uint8Array(decBuf);
    const unshuffled = await blockUnshuffle(shufKey, decBytes);
    const unxored    = await xorStream(xorKey, unshuffled);

    // Пробуем снять padding; если не получается — данные зашифрованы без padding (старый encrypt)
    let unpadded;
    try {
        unpadded = zeroUnpad(unxored);
    } catch {
        // Fallback: файл зашифрован без xorStream/blockShuffle/padding
        // Пробуем расшифровать напрямую без мутаций
        const rawDec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivAes }, encKey, cipher);
        return new TextDecoder().decode(rawDec);
    }

    zeroize(decBytes, unshuffled, unxored);
    zeroize(rawBits.macBits, rawBits.shufBits, rawBits.xorBits, rawBits.ccBits);

    return new TextDecoder().decode(unpadded);
}

// ── Message handler ───────────────────────────────────────────────────────────
self.onmessage = async ({ data }) => {
    const { id, op, password, originInfo } = data;
    const info = new Uint8Array(originInfo);
    try {
        if (op === 'encrypt') {
            const result = await encryptFull(data.text, password, info);
            self.postMessage({ id, result });
        } else if (op === 'decrypt') {
            const result = await decryptFull(data.encData, password, info);
            self.postMessage({ id, result });
        } else if (op === 'deriveKeys') {
            // Только KDF — для live-check пароля (проверяем без полного decrypt)
            const salt = new Uint8Array(data.salt);
            const bits = await deriveRawBits(password, salt, info);
            self.postMessage({ id, bits });
        }
    } catch (err) {
        self.postMessage({ id, error: err.message + ' | stack: ' + (err.stack || '').split('\n')[1] });
    }
};
