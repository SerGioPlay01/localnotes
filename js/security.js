// Security utilities and checks
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupXSSProtection();
        this.setupClickjackingProtection();
        this.setupSecureHeaders();
        this.monitorSecurityEvents();
    }

    // Content Security Policy validation
    setupCSP() {
        // Check if CSP is properly configured
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!metaCSP) {
            console.warn('CSP not found - security risk');
        } else {
        }
    }

    // XSS Protection
    setupXSSProtection() {
        // Sanitize user input
        this.sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            // Remove potentially dangerous characters
            return input
                .replace(/[<>]/g, '') // Remove < and >
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+=/gi, '') // Remove event handlers
                .trim();
        };

        // Override innerHTML to prevent XSS
        this.secureInnerHTML = (element, content) => {
            if (element && content) {
                element.textContent = content; // Use textContent instead of innerHTML
            }
        };
    }

    // Clickjacking protection
    setupClickjackingProtection() {
        // Check for frame busting
        if (window.top !== window.self) {
            console.warn('Page is being framed - potential clickjacking attack');
            // Optionally redirect to top frame
            // window.top.location = window.self.location;
        }
    }

    // Secure headers validation
    setupSecureHeaders() {
        // Check for secure headers (this would normally be done server-side)
        const secureHeaders = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Strict-Transport-Security'
        ];

        // Log missing headers (for development)
    }

    // Monitor security events
    monitorSecurityEvents() {
        // Monitor for suspicious activity
        let suspiciousActivity = 0;
        
        // Monitor rapid clicks (potential bot activity)
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 100) { // Less than 100ms between clicks
                clickCount++;
                if (clickCount > 10) {
                    console.warn('Suspicious rapid clicking detected');
                    suspiciousActivity++;
                }
            } else {
                clickCount = 0;
            }
            lastClickTime = now;
        });

        // Monitor for console access attempts (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
            const originalConsole = window.console;
            window.console = new Proxy(originalConsole, {
                get(target, prop) {
                    if (prop === 'log' || prop === 'warn' || prop === 'error') {
                        return function(...args) {
                            // Log console access for security monitoring
                            if (args.some(arg => typeof arg === 'string' && 
                                (arg.includes('password') || arg.includes('token') || arg.includes('key')))) {
                                console.warn('Potential sensitive data in console');
                            }
                            return target[prop].apply(target, args);
                        };
                    }
                    return target[prop];
                }
            });
        }
    }

    // Validate file uploads
    validateFileUpload(file) {
        const allowedTypes = [
            'application/json',  // для .note файлов (зашифрованные заметки)
            'text/html',         // для .html файлов
            'text/markdown'      // для .md файлов
        ];
        
        const maxSize = 50 * 1024 * 1024; // 50MB (увеличено для поддержки большего количества типов файлов)
        
        // Проверяем расширение файла как дополнительную меру безопасности
        const allowedExtensions = [
            '.note',  // зашифрованные заметки
            '.html',  // HTML файлы
            '.md'     // Markdown файлы
        ];
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('File extension not allowed');
        }
        
        if (file.size > maxSize) {
            throw new Error('File too large');
        }
        
        return true;
    }

    // ── Secure Storage MAX-2026 ───────────────────────────────────────────────
    // Двойное шифрование: AES-256-GCM (сессионный ключ) + HMAC-SHA-256 integrity.
    // Сессионный ключ живёт только в памяти. Seed хранится в sessionStorage
    // (умирает при закрытии вкладки). Поддерживает ротацию ключей.
    // Ключи привязаны к домену localnotes-three.vercel.app через HKDF info.
    secureStorage = (() => {
        let _encKey = null;
        let _macKey = null;
        const SS_KEY  = '__ss_seed_v4__';
        const VERSION = 0x04;
        const ALLOWED = 'https://localnotes-three.vercel.app';

        // Проверка домена — бросает если запущено не на разрешённом origin
        const _assertOrigin = () => {
            const cur = window.location.origin;
            if (cur !== ALLOWED)
                throw new Error(`SecureStorage: not allowed on ${cur}`);
        };

        const _init = async () => {
            if (_encKey && _macKey) return;
            _assertOrigin();

            let seedBytes;
            const stored = sessionStorage.getItem(SS_KEY);
            if (stored) {
                try {
                    const raw = atob(stored);
                    seedBytes = new Uint8Array(raw.length);
                    for (let i = 0; i < raw.length; i++) seedBytes[i] = raw.charCodeAt(i);
                } catch { seedBytes = null; }
            }

            if (!seedBytes || seedBytes.length !== 64) {
                seedBytes = new Uint8Array(64);
                crypto.getRandomValues(seedBytes);
                let s = '';
                seedBytes.forEach(b => s += String.fromCharCode(b));
                try { sessionStorage.setItem(SS_KEY, btoa(s)); } catch {}
            }

            // HKDF: seed → K_enc + K_mac, info содержит origin-binding
            const originInfo = new TextEncoder().encode(`origin-binding::${ALLOWED}::ss-v4`);
            const baseKey = await crypto.subtle.importKey('raw', seedBytes, 'HKDF', false, ['deriveBits']);
            const [encBits, macBits] = await Promise.all([
                crypto.subtle.deriveBits(
                    { name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('ss-enc-v4'), info: originInfo },
                    baseKey, 256
                ),
                crypto.subtle.deriveBits(
                    { name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('ss-mac-v4'), info: originInfo },
                    baseKey, 256
                ),
            ]);

            _encKey = await crypto.subtle.importKey('raw', encBits, 'AES-GCM', false, ['encrypt', 'decrypt']);
            _macKey = await crypto.subtle.importKey('raw', macBits, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

            seedBytes.fill(0);
        };

        const _encrypt = async (plaintext) => {
            await _init();
            const iv  = new Uint8Array(12);
            crypto.getRandomValues(iv);
            const enc = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                _encKey,
                new TextEncoder().encode(plaintext)
            );
            const cipher = new Uint8Array(enc);

            // HMAC-SHA-256(iv ‖ cipher) — integrity tag
            const macInput = new Uint8Array(12 + cipher.length);
            macInput.set(iv, 0); macInput.set(cipher, 12);
            const tag = new Uint8Array(await crypto.subtle.sign('HMAC', _macKey, macInput));

            // Формат: version(1) + iv(12) + hmac(32) + cipher
            const out = new Uint8Array(1 + 12 + 32 + cipher.length);
            out[0] = VERSION;
            out.set(iv,     1);
            out.set(tag,    13);
            out.set(cipher, 45);

            let b = '';
            out.forEach(byte => b += String.fromCharCode(byte));
            return btoa(b);
        };

        const _decrypt = async (b64) => {
            await _init();
            const raw = atob(b64);
            const buf = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);

            // Проверяем версию
            if (buf[0] !== VERSION) {
                // Fallback: старый формат (просто iv+cipher без HMAC)
                const iv     = buf.slice(0, 12);
                const cipher = buf.slice(12);
                const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, _encKey, cipher);
                return new TextDecoder().decode(dec);
            }

            const iv     = buf.slice(1,  13);
            const tag    = buf.slice(13, 45);
            const cipher = buf.slice(45);

            // Проверяем HMAC перед дешифровкой
            const macInput = new Uint8Array(12 + cipher.length);
            macInput.set(iv, 0); macInput.set(cipher, 12);
            const valid = await crypto.subtle.verify('HMAC', _macKey, tag, macInput);
            if (!valid) throw new Error('SecureStorage: integrity check failed');

            const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, _encKey, cipher);
            return new TextDecoder().decode(dec);
        };

        // Ротация ключей: перешифровывает все данные с новым seed
        const rotate = async (keys) => {
            const backup = {};
            for (const key of keys) {
                try {
                    const raw = localStorage.getItem(key);
                    if (raw) backup[key] = await _decrypt(raw);
                } catch {}
            }
            // Сбрасываем ключи
            _encKey = null; _macKey = null;
            sessionStorage.removeItem(SS_KEY);
            // Перешифровываем
            for (const [key, val] of Object.entries(backup)) {
                try { localStorage.setItem(key, await _encrypt(val)); } catch {}
            }
        };

        return {
            setItem: async (key, value) => {
                try {
                    const enc = await _encrypt(JSON.stringify(value));
                    localStorage.setItem(key, enc);
                } catch (err) {
                    console.error('SecureStorage.setItem failed:', err.message);
                }
            },
            getItem: async (key) => {
                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) return null;
                    try {
                        return JSON.parse(await _decrypt(raw));
                    } catch {
                        // Fallback: старый btoa-формат (v1)
                        try { return JSON.parse(atob(raw)); } catch { return null; }
                    }
                } catch (err) {
                    console.error('SecureStorage.getItem failed:', err.message);
                    return null;
                }
            },
            removeItem: (key) => localStorage.removeItem(key),
            rotate,
        };
    })();

    // Generate secure random strings
    generateSecureId(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        
        return result;
    }

    // Check for HTTPS
    checkHTTPS() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            console.warn('Not using HTTPS - security risk');
            return false;
        }
        return true;
    }

    // Validate URLs
    validateURL(url) {
        try {
            const urlObj = new URL(url);
            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get security report
    getSecurityReport() {
        return {
            https: this.checkHTTPS(),
            csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            frameBusting: window.top === window.self,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize security manager
let securityManager;

document.addEventListener('DOMContentLoaded', function() {
    securityManager = new SecurityManager();
    
    // Log security report
});

// Export for use in other modules
window.SecurityManager = SecurityManager;
