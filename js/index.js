/**
 * Local Notes - Main Application
 * Based on original code, TinyMCE replaced with LocalNotesEditor
 */

// ============================================================================
// RESPONSIVE MANAGER
// ============================================================================
class ResponsiveManager {
    constructor() {
        this.breakpoints = { mobile: 768, tablet: 1024, largeTablet: 1366, desktop: 1200 };
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMobile = this.currentBreakpoint === 'mobile';
        this.isTablet = this.currentBreakpoint === 'tablet';
        this.isLargeTablet = this.currentBreakpoint === 'largeTablet';
        this.isDesktop = this.currentBreakpoint === 'desktop';
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isTabletDevice = this.isTablet || this.isLargeTablet;
        this.init();
    }
    getCurrentBreakpoint() {
        const w = window.innerWidth;
        if (w < 768) return 'mobile';
        if (w < 1024) return 'tablet';
        if (w < 1366) return 'largeTablet';
        return 'desktop';
    }
    init() {
        document.documentElement.classList.add(`${this.currentBreakpoint}-device`);
        if (this.isTouch) document.documentElement.classList.add('touch-device');
        if (this.isTabletDevice) document.documentElement.classList.add('tablet-device');
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', () => setTimeout(() => this.handleResize(), 100));
        if (this.isTabletDevice) this.initTabletOptimizations();
    }
    handleResize() {
        const nb = this.getCurrentBreakpoint();
        if (nb !== this.currentBreakpoint) {
            document.documentElement.classList.remove(`${this.currentBreakpoint}-device`);
            this.currentBreakpoint = nb;
            this.isMobile = nb === 'mobile'; this.isTablet = nb === 'tablet';
            this.isLargeTablet = nb === 'largeTablet'; this.isDesktop = nb === 'desktop';
            this.isTabletDevice = this.isTablet || this.isLargeTablet;
            document.documentElement.classList.add(`${nb}-device`);
        }
    }
    initTabletOptimizations() {
        document.querySelectorAll('button, input, select, textarea, .note, .modal-buttons-container button').forEach(t => {
            t.style.minHeight = '44px'; t.style.touchAction = 'manipulation';
        });
        const obs = new MutationObserver(muts => muts.forEach(m => {
            if (m.type === 'attributes' && m.attributeName === 'style') {
                const modal = m.target;
                if (modal.classList.contains('modal') && modal.style.display === 'block') this.applyFullscreenModal(modal);
            }
        }));
        document.querySelectorAll('.modal').forEach(m => obs.observe(m, { attributes: true, attributeFilter: ['style'] }));
    }
    applyFullscreenModal(modal) {
        if (!this.isTabletDevice) return;
        const mc = modal.querySelector('.modal-content');
        if (mc) mc.style.cssText = 'width:100vw!important;height:100vh!important;margin:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;border-radius:0!important;position:fixed!important;transform:none!important;display:flex!important;flex-direction:column!important;background:var(--modal-bg)!important;border:none!important;box-shadow:none!important;z-index:10000!important;';
    }
    optimizeScrolling() {
        if (this.isTabletDevice) {
            document.documentElement.style.scrollBehavior = 'smooth';
            const nc = document.getElementById('notesContainer');
            if (nc) { nc.style.webkitOverflowScrolling = 'touch'; nc.style.overscrollBehavior = 'contain'; }
        }
    }
    resetEditorStyles() {
        const ec = document.getElementById('editorContainer');
        if (ec) { ec.style.height = ''; ec.style.minHeight = ''; }
    }
}

// ============================================================================
// POINTER EVENT MANAGER
// ============================================================================
class PointerEventManager {
    constructor() {
        this.pointerType = 'mouse'; this.isTouchDevice = false; this.isPenDevice = false;
        this.init();
    }
    init() {
        if (window.PointerEvent) {
            ['pointerdown','pointermove','pointerup'].forEach(ev =>
                document.addEventListener(ev, e => this.updatePointerType(e), { passive: true }));
        } else {
            this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (this.isTouchDevice) this.pointerType = 'touch';
        }
    }
    updatePointerType(e) {
        if (e.pointerType) { this.pointerType = e.pointerType; this.isTouchDevice = e.pointerType === 'touch'; this.isPenDevice = e.pointerType === 'pen'; }
    }
    getEventType() { return this.isTouchDevice ? 'touchstart' : this.isPenDevice ? 'pointerdown' : 'click'; }
    isTouch() { return this.isTouchDevice; }
    isPen() { return this.isPenDevice; }
    isMouse() { return this.pointerType === 'mouse'; }
    getPointerType() { return this.pointerType; }
}

function isSupportedFileExtension(filename) {
    return ['.note','.html','.md'].includes('.' + filename.split('.').pop().toLowerCase());
}

const pointerManager = new PointerEventManager();
const responsiveManager = new ResponsiveManager();

// ============================================================================
// GLOBALS
// ============================================================================
// localNotesEditorInstance declared in editor-integration.js
let currentNoteId = null;
let quickEditActive = false;
const getCurrentLang = () => (window.currentLang || navigator.language || 'en').split('-')[0];
let currentLang = getCurrentLang();

// ============================================================================
// NOTES DATABASE (from backup)
// ============================================================================
class NotesDatabase {
    constructor() { this.dbName = 'LocalNotesDB'; this.dbVersion = 1; this.db = null; }
    async init() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, this.dbVersion);
            req.onerror = () => reject(new Error('Failed to open database'));
            req.onsuccess = () => { this.db = req.result; resolve(this.db); };
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('notes')) {
                    const s = db.createObjectStore('notes', { keyPath: 'id' });
                    s.createIndex('creationTime', 'creationTime', { unique: false });
                    s.createIndex('lastModified', 'lastModified', { unique: false });
                    s.createIndex('title', 'title', { unique: false });
                }
                if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
            };
        });
    }
    async saveNote(note) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notes'], 'readwrite');
            const req = tx.objectStore('notes').put(note);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async getAllNotes() {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notes'], 'readonly');
            const req = tx.objectStore('notes').getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async getNote(id) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notes'], 'readonly');
            const req = tx.objectStore('notes').get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async deleteNote(id) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['notes'], 'readwrite');
            const req = tx.objectStore('notes').delete(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    async saveSetting(key, value) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['settings'], 'readwrite');
            const req = tx.objectStore('settings').put({ key, value });
            req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
        });
    }
    async getSetting(key) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['settings'], 'readonly');
            const req = tx.objectStore('settings').get(key);
            req.onsuccess = () => resolve(req.result ? req.result.value : null);
            req.onerror = () => reject(req.error);
        });
    }
    async migrateFromLocalStorage() {
        try {
            const existing = await this.getAllNotes();
            if (existing.length > 0) return;
            const keys = Object.keys(localStorage).filter(k => k.startsWith('note_'));
            for (const key of keys) {
                try {
                    const d = JSON.parse(localStorage.getItem(key));
                    await this.saveNote({ id: key, content: d.content, creationTime: d.creationTime, lastModified: d.lastModified, title: this.extractTitle(d.content) });
                } catch (e) { console.error(`Migration error for ${key}:`, e); }
            }
        } catch (e) { console.error('Migration error:', e); }
    }
    extractTitle(content) {
        const d = document.createElement('div');
        d.innerHTML = content || '';
        const h = d.querySelector('h1,h2,h3,h4,h5,h6');
        if (h) return h.textContent.trim();
        const p = d.querySelector('p');
        if (p) { const t = p.textContent.trim(); return t.length > 50 ? t.substring(0, 50) + '...' : t; }
        return 'Untitled';
    }
}

const notesDB = new NotesDatabase();

// ============================================================================
// ENCRYPTION
// ============================================================================
class AdvancedEncryption {
    constructor() { this.failedAttempts = {}; this.lockoutDuration = 15 * 60 * 1000; }
    generateRandomBytes(n) { const a = new Uint8Array(n); crypto.getRandomValues(a); return a; }
    arrayBufferToBase64(buf) {
        const bytes = new Uint8Array(buf); let b = '';
        for (let i = 0; i < bytes.byteLength; i++) b += String.fromCharCode(bytes[i]);
        return btoa(b);
    }
    base64ToArrayBuffer(b64) {
        const b = atob(b64), bytes = new Uint8Array(b.length);
        for (let i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i);
        return bytes.buffer;
    }
    async deriveKey(password, salt) {
        const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, km, 256);
        return crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['encrypt', 'decrypt']);
    }
    async encrypt(text, password) {
        const salt = this.generateRandomBytes(16), iv = this.generateRandomBytes(12);
        const key = await this.deriveKey(password, salt);
        const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
        const combined = new Uint8Array(28 + enc.byteLength);
        combined.set(salt, 0); combined.set(iv, 16); combined.set(new Uint8Array(enc), 28);
        return this.arrayBufferToBase64(combined.buffer);
    }
    async decrypt(encData, password) {
        const combined = new Uint8Array(this.base64ToArrayBuffer(encData));
        const key = await this.deriveKey(password, combined.slice(0, 16));
        const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: combined.slice(16, 28) }, key, combined.slice(28));
        return new TextDecoder().decode(dec);
    }
    isLocked(id) {
        const li = this.failedAttempts[id]; if (!li) return false;
        if (Date.now() - li.timestamp > this.lockoutDuration) { delete this.failedAttempts[id]; return false; }
        return li.attempts >= 5;
    }
    recordFailedAttempt(id) {
        if (!this.failedAttempts[id]) this.failedAttempts[id] = { attempts: 0, timestamp: Date.now() };
        this.failedAttempts[id].attempts++;
    }
    resetAttempts(id) { delete this.failedAttempts[id]; }
}
const encryption = new AdvancedEncryption();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function transliterate(text) {
    const m = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
    return text.toLowerCase().split('').map(c => m[c] || c).join('');
}

function isEncryptedFile(content) {
    return content && (content.startsWith('{"encrypted":') || content.includes('"format":"encrypted"') || /^[A-Za-z0-9+/]{100,}={0,2}$/.test(content.trim()));
}

function validateAndFixImages(content) {
    if (!content) return content;
    try {
        const d = document.createElement('div'); d.innerHTML = content;
        d.querySelectorAll('img').forEach(img => {
            if (!img.src) { img.remove(); return; }
            if (img.src.startsWith('blob:')) img.remove();
        });
        return d.innerHTML;
    } catch (e) { return content; }
}

function fixChecklistStructure(content) {
    if (!content) return content;
    const d = document.createElement('div'); d.innerHTML = content;
    d.querySelectorAll('.checklist-item-wrapper').forEach(wrapper => {
        let cb = wrapper.querySelector('.checklist-checkbox-ios');
        let span = wrapper.querySelector('.checklist-text-content');
        let text = '';
        wrapper.childNodes.forEach(node => {
            if (node.nodeType === 3) text += node.textContent;
            else if (node !== cb && node !== span && !node.classList?.contains('checklist-checkbox-ios') && !node.classList?.contains('checklist-text-content'))
                text += node.textContent;
        });
        if (!cb) { cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'checklist-checkbox-ios'; cb.setAttribute('data-checked', 'false'); }
        if (!span) { span = document.createElement('span'); span.className = 'checklist-text-content checklist-text-ios'; }
        if (text.trim() && !span.textContent) span.textContent = text.trim();
        wrapper.innerHTML = ''; wrapper.appendChild(cb); wrapper.appendChild(span);
    });
    return d.innerHTML;
}

function getChecklistProgress(content) {
    if (!content) return null;
    const d = document.createElement('div'); d.innerHTML = content;
    const all = d.querySelectorAll('.checklist-checkbox-ios, input[type="checkbox"]');
    if (all.length === 0) return null;
    const checked = [...all].filter(cb => cb.checked || cb.getAttribute('data-checked') === 'true').length;
    return { total: all.length, checked };
}

function blobToBase64(blob) {
    return new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(blob); });
}

async function processMediaContent(content) {
    if (!content) return content;
    const d = document.createElement('div'); d.innerHTML = content;
    const imgs = d.querySelectorAll('img[src^="blob:"]');
    for (const img of imgs) {
        try { const resp = await fetch(img.src); const blob = await resp.blob(); img.src = await blobToBase64(blob); }
        catch (e) { img.remove(); }
    }
    return d.innerHTML;
}

// Strip inline styles added by hljs from code blocks inside lne-code-wrapper
// so our CSS dark theme always wins
function fixCodeBlockStyles(container) {
    const root = container || document;
    root.querySelectorAll('.lne-code-wrapper pre, .lne-code-wrapper .lne-code').forEach(pre => {
        // Remove inline background/color set by hljs
        pre.style.removeProperty('background');
        pre.style.removeProperty('background-color');
        pre.style.removeProperty('color');
        pre.style.removeProperty('border');
        pre.style.removeProperty('box-shadow');
        pre.style.removeProperty('padding');
        pre.style.removeProperty('border-radius');
        pre.style.removeProperty('font-size');
        pre.style.removeProperty('line-height');
        pre.style.removeProperty('overflow-x');
        pre.style.removeProperty('margin');
    });
}

// Add copy buttons to code blocks in note cards
function initCodeBlockCopyButtons(container) {
    if (!container) return;
    container.querySelectorAll('pre, .lne-code').forEach(pre => {
        // Skip if already wrapped
        if (pre.parentElement && pre.parentElement.classList.contains('lne-code-wrapper')) return;
        // Skip inside editor itself
        if (pre.closest('.lne-editor') || pre.closest('.lne-modal-ov')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'lne-code-wrapper';

        const header = document.createElement('div');
        header.className = 'lne-code-header';

        const langSpan = document.createElement('span');
        // Try to detect language from hljs class
        const codeEl = pre.querySelector('code');
        const langClass = codeEl && [...codeEl.classList].find(c => c.startsWith('language-'));
        langSpan.textContent = langClass ? langClass.replace('language-', '') : 'code';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'lne-copy-btn';
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> ' + (typeof t === 'function' ? t('copy') || 'Copy' : 'Copy');
        copyBtn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            // Get only code text, not the header
            const codeEl = pre.querySelector('code');
            const text = (codeEl ? codeEl.innerText : pre.innerText) || pre.textContent || '';
            const copyLabel = '<i class="bi bi-clipboard"></i> ' + (typeof t === 'function' ? t('copy') || 'Copy' : 'Copy');
            const copiedLabel = '<i class="bi bi-check-lg"></i> ' + (typeof t === 'function' ? t('copied') || 'Copied!' : 'Copied!');
            const doFeedback = () => {
                copyBtn.innerHTML = copiedLabel;
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = copyLabel;
                    copyBtn.classList.remove('copied');
                }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
                    // Fallback
                    try {
                        const ta = document.createElement('textarea');
                        ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                        document.body.appendChild(ta); ta.select();
                        document.execCommand('copy'); document.body.removeChild(ta);
                    } catch(ex) {}
                    doFeedback();
                });
            } else {
                try {
                    const ta = document.createElement('textarea');
                    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                    document.body.appendChild(ta); ta.select();
                    document.execCommand('copy'); document.body.removeChild(ta);
                } catch(ex) {}
                doFeedback();
            }
        });

        header.appendChild(langSpan);
        header.appendChild(copyBtn);

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });
}

function processTablesForResponsiveness(container) {
    container.querySelectorAll('table').forEach(table => {
        if (!table.parentElement.classList.contains('table-responsive')) {
            const w = document.createElement('div'); w.className = 'table-responsive';
            table.parentNode.insertBefore(w, table); w.appendChild(table);
        }
    });
}

function generateFileVersion() { return Date.now().toString(36); }

function downloadFile(blob, filename, mimeType) {
    if (!(blob instanceof Blob)) blob = new Blob([blob], { type: mimeType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function isValidImageUrl(url) {
    try {
        const u = new URL(url);
        if (!['http:','https:'].includes(u.protocol)) return false;
        return ['.jpg','.jpeg','.png','.gif','.webp','.svg','.bmp'].some(e => u.pathname.toLowerCase().endsWith(e)) || url.includes('data:image/');
    } catch { return false; }
}

function isValidBase64Image(b64) {
    if (!b64?.startsWith('data:image/')) return false;
    try {
        const part = b64.split(',')[1];
        if (!part || part.length < 100 || part.length > 10000000) return false;
        return /^[A-Za-z0-9+/]*={0,2}$/.test(part);
    } catch { return false; }
}

function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes';
    const k = 1024, sizes = ['Bytes','KB','MB','GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file);
    });
}


// ============================================================================
// MODAL SYSTEM (from backup, adapted for LocalNotesEditor)
// ============================================================================
function showCustomAlert(title, message, type = 'info') {
    const iconMap = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const colorMap = { info: '#007bff', success: '#28a745', warning: '#ffc107', error: '#dc3545' };
    const alertModal = document.createElement('div');
    alertModal.className = 'modal';
    alertModal.id = 'customAlertModal';
    alertModal.innerHTML = `
        <div class="modal-content-error">
            <h3 style="display:flex;align-items:center;gap:10px;color:${colorMap[type]};">
                <span style="font-size:24px;">${iconMap[type]}</span>${title}
            </h3>
            <p style="margin:15px 0;line-height:1.5;">${message}</p>
            <div style="display:flex;justify-content:center;margin-top:20px;">
                <button id="customAlertOk" style="background:${colorMap[type]};color:white;border:none;padding:10px 30px;border-radius:5px;cursor:pointer;font-size:16px;">OK</button>
            </div>
        </div>`;
    document.body.appendChild(alertModal);
    alertModal.style.display = 'block';
    const ok = alertModal.querySelector('#customAlertOk');
    const close = () => { if (alertModal.parentNode) document.body.removeChild(alertModal); };
    ok.addEventListener('click', close);
    document.addEventListener('keydown', function kh(e) { if (e.key === 'Enter' || e.key === 'Escape') { document.removeEventListener('keydown', kh); close(); } });
    alertModal.addEventListener('pointerdown', e => { if (e.target === alertModal) close(); });
    alertModal.addEventListener('click', e => { if (e.target === alertModal) close(); });
}

function showCustomPrompt(title, message, placeholder = '', defaultValue = '', callback, isPassword = false) {
    const modal = document.createElement('div');
    modal.className = 'modal'; modal.id = 'customPromptModal';
    const inputType = isPassword ? 'password' : 'text';
    modal.innerHTML = `<div class="modal-content-error">
        <div class="modal-content-inner"><h3>${title}</h3><p>${message}</p>
        <input type="${inputType}" id="customPromptInput" placeholder="${placeholder}" value="${isPassword ? '' : escapeHtml(defaultValue)}"></div>
        <div class="modal-buttons-container">
            <button id="customPromptOk" class="btn"><i class="fas fa-check"></i> ${(typeof t === 'function' ? t('ok') : 'OK')}</button>
            <button id="customPromptCancel" class="btn cancel"><i class="fas fa-times"></i> ${(typeof t === 'function' ? t('cancel') : 'Cancel')}</button>
        </div></div>`;
    document.body.appendChild(modal); modal.style.display = 'block';
    const inp = modal.querySelector('#customPromptInput');
    setTimeout(() => { inp.focus(); if (!isPassword) inp.select(); }, 100);
    const ok = () => { const v = inp.value.trim(); if (modal.parentNode) document.body.removeChild(modal); callback?.(v); };
    const cancel = () => { if (modal.parentNode) document.body.removeChild(modal); callback?.(null); };
    modal.querySelector('#customPromptOk').addEventListener('click', ok);
    modal.querySelector('#customPromptCancel').addEventListener('click', cancel);
    inp.addEventListener('keypress', e => { if (e.key === 'Enter') ok(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); cancel(); } });
    modal.addEventListener('click', e => { if (e.target === modal) cancel(); });
}

function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text || ''; return d.innerHTML; }

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) { if (confirm(message)) onConfirm?.(); return; }
    const msgEl = document.getElementById('confirmMessage'); if (msgEl) msgEl.textContent = message;
    document.getElementById('confirmYes').onclick = () => { modal.style.display = 'none'; onConfirm?.(); };
    document.getElementById('confirmNo').onclick = () => { modal.style.display = 'none'; };
    modal.style.display = 'block';
}

// ============================================================================
// CLEAR ALL (from backup)
// ============================================================================
function showClearAllConfirmationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal'; modal.style.display = 'block';
    modal.innerHTML = `<div class="modal-content modal-content-warning">
        <div class="modal-content-inner">
            <h3><i class="fas fa-exclamation-triangle"></i> ${(typeof t === 'function' ? t('confirmDeleteAllTitle') : 'Delete All Notes')}</h3>
            <p>${(typeof t === 'function' ? t('confirmDeleteAll') : 'Delete ALL notes?')}</p>
            <div class="warning-details">
                <p><strong>⚠️ ${(typeof t === 'function' ? t('warning') : 'Warning')}:</strong> ${(typeof t === 'function' ? t('clearAllWarning') : 'This action is irreversible!')}</p>
                <ul>
                    <li>${(typeof t === 'function' ? t('clearAllWarning1') : 'All notes will be deleted permanently')}</li>
                    <li>${(typeof t === 'function' ? t('clearAllWarning2') : 'Recovery will be impossible')}</li>
                    <li>${(typeof t === 'function' ? t('clearAllWarning3') : 'Make a backup before deleting')}</li>
                </ul>
            </div>
        </div>
        <div class="modal-buttons-container">
            <button id="confirmClearAllBtn" class="btn cancel"><i class="fas fa-trash"></i> ${(typeof t === 'function' ? t('deleteAll') : 'Delete All')}</button>
            <button id="cancelClearAllBtn" class="btn save"><i class="fas fa-times"></i> ${(typeof t === 'function' ? t('cancel') : 'Cancel')}</button>
        </div></div>`;
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    const close = () => { if (modal.parentNode) document.body.removeChild(modal); document.body.classList.remove('modal-open'); };
    document.getElementById('confirmClearAllBtn').addEventListener('click', () => { clearAllNotes(); close(); });
    document.getElementById('cancelClearAllBtn').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); close(); } });
}

async function clearAllNotes() {
    try {
        const notes = await notesDB.getAllNotes();
        for (const n of notes) await notesDB.deleteNote(n.id);
        await loadNotes();
        showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('allNotesDeleted') : 'All notes deleted!', 'success');
    } catch (e) {
        showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorClearingNotes') : 'Error clearing notes!', 'error');
    }
}

// ============================================================================
// NOTE SETTINGS MODAL  (Tags / Due date / Color / Pin)
// ============================================================================

// In-memory settings while editing — persisted only on Save
window._noteMeta = { tags: [], dueDate: null, color: '', pinned: false };

function openNoteSettings(noteId) {
    const meta = window._noteMeta;

    // Build tags HTML
    const buildTagsHTML = (allTags) => {
        const noteTags = meta.tags || [];
        const pills = noteTags.map(tid => {
            const tag = allTags.find(t => t.id === tid);
            if (!tag) return '';
            const c = (typeof TAG_COLORS !== 'undefined' ? TAG_COLORS : []).find(c => c.id === tag.colorId);
            const hex = c ? c.hex : '#aefc6e';
            return `<span class="nsm-tag-pill" data-tid="${tid}" style="--tag-color:${hex}">${escapeHtml(tag.name)}<button class="nsm-tag-remove" data-tid="${tid}"><i class="bi bi-x"></i></button></span>`;
        }).join('');

        const available = allTags.filter(t => !noteTags.includes(t.id));
        const opts = available.map(t => {
            const c = (typeof TAG_COLORS !== 'undefined' ? TAG_COLORS : []).find(c => c.id === t.colorId);
            const hex = c ? c.hex : '#aefc6e';
            return `<button class="nsm-tag-add-item" data-tid="${t.id}" style="--tag-color:${hex}"><span class="nsm-dot"></span>${escapeHtml(t.name)}</button>`;
        }).join('');

        return `<div class="nsm-tags-row" id="nsm-tags-row">${pills}</div>
            <div class="nsm-tags-add">${opts}
                <button class="nsm-new-tag-btn" id="nsm-new-tag"><i class="bi bi-plus-circle"></i> ${window.t ? window.t('newTag') : 'New tag'}</button>
            </div>`;
    };

    const dateVal = meta.dueDate ? new Date(meta.dueDate).toISOString().slice(0, 16) : '';
    const colorSwatches = ['', '#aefc6e', '#4ec9b0', '#c586c0', '#f1c40f', '#e74c3c', '#4a86e8', '#ff7eb3'].map(c =>
        `<button class="nsm-color-sw${meta.color === c ? ' active' : ''}" data-c="${c}" style="background:${c || 'transparent'}" title="${c || 'Default'}"></button>`
    ).join('');

    // Build modal
    const ov = document.createElement('div');
    ov.id = 'noteSettingsModal';
    ov.className = 'nsm-overlay';

    const render = (allTags) => {
        ov.innerHTML = `
            <div class="nsm-panel">
                <div class="nsm-header">
                    <h3><i class="bi bi-sliders2"></i> ${window.t ? window.t('noteSettings') : 'Note Settings'}</h3>
                    <button class="nsm-close" id="nsm-close"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="nsm-body">
                    <section class="nsm-section">
                        <div class="nsm-section-title"><i class="bi bi-tags"></i> ${window.t ? window.t('tags') : 'Tags'}</div>
                        ${buildTagsHTML(allTags)}
                    </section>
                    <section class="nsm-section">
                        <div class="nsm-section-title"><i class="bi bi-calendar-event"></i> ${window.t ? window.t('dueDate') : 'Due date'}</div>
                        <input type="datetime-local" id="nsm-due" class="nsm-input" value="${dateVal}">
                        ${meta.dueDate ? `<button class="nsm-clear-date" id="nsm-clear-date"><i class="bi bi-x"></i> ${window.t ? window.t('clear') : 'Clear'}</button>` : ''}
                    </section>
                    <section class="nsm-section">
                        <div class="nsm-section-title"><i class="bi bi-palette"></i> ${window.t ? window.t('color') : 'Color'}</div>
                        <div class="nsm-colors">${colorSwatches}</div>
                    </section>
                    <section class="nsm-section nsm-pin-section">
                        <div class="nsm-section-title"><i class="bi bi-pin-angle"></i> ${window.t ? window.t('pinNote') : 'Pin note'}</div>
                        <button class="nsm-pin-btn${meta.pinned ? ' active' : ''}" id="nsm-pin">
                            <i class="bi bi-pin-angle${meta.pinned ? '-fill' : ''}"></i>
                            ${meta.pinned ? (window.t ? window.t('pinned') : 'Pinned') : (window.t ? window.t('pin') : 'Pin')}
                        </button>
                    </section>
                </div>
                <div class="nsm-footer">
                    <button class="nsm-btn nsm-btn-sec" id="nsm-cancel"><i class="bi bi-x-lg"></i> ${window.t ? window.t('cancel') : 'Cancel'}</button>
                    <button class="nsm-btn nsm-btn-pri" id="nsm-apply"><i class="bi bi-check-lg"></i> ${window.t ? window.t('apply') : 'Apply'}</button>
                </div>
            </div>`;

        // Wire close/cancel
        const closeOv = () => { if (ov.parentNode) document.body.removeChild(ov); };
        ov.querySelector('#nsm-close').addEventListener('click', closeOv);
        ov.querySelector('#nsm-cancel').addEventListener('click', closeOv);
        ov.addEventListener('click', e => { if (e.target === ov) closeOv(); });

        // Remove tag
        ov.querySelectorAll('.nsm-tag-remove').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                meta.tags = meta.tags.filter(t => t !== btn.dataset.tid);
                render(allTags);
            });
        });

        // Add tag
        ov.querySelectorAll('.nsm-tag-add-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!meta.tags.includes(btn.dataset.tid)) meta.tags.push(btn.dataset.tid);
                render(allTags);
            });
        });

        // New tag
        ov.querySelector('#nsm-new-tag')?.addEventListener('click', () => {
            closeOv();
            if (typeof showTagEditModal === 'function') showTagEditModal(null);
        });

        // Due date clear
        ov.querySelector('#nsm-clear-date')?.addEventListener('click', () => {
            meta.dueDate = null;
            ov.querySelector('#nsm-due').value = '';
            ov.querySelector('#nsm-clear-date')?.remove();
        });

        // Color
        ov.querySelectorAll('.nsm-color-sw').forEach(sw => {
            sw.addEventListener('click', () => {
                ov.querySelectorAll('.nsm-color-sw').forEach(s => s.classList.remove('active'));
                sw.classList.add('active');
                meta.color = sw.dataset.c;
            });
        });

        // Pin
        ov.querySelector('#nsm-pin').addEventListener('click', () => {
            meta.pinned = !meta.pinned;
            const btn = ov.querySelector('#nsm-pin');
            btn.classList.toggle('active', meta.pinned);
            btn.innerHTML = `<i class="bi bi-pin-angle${meta.pinned ? '-fill' : ''}"></i> ${meta.pinned ? (window.t ? window.t('pinned') : 'Pinned') : (window.t ? window.t('pin') : 'Pin')}`;
        });

        // Apply
        ov.querySelector('#nsm-apply').addEventListener('click', () => {
            const dueVal = ov.querySelector('#nsm-due').value;
            meta.dueDate = dueVal ? new Date(dueVal).getTime() : null;
            closeOv();
        });
    };

    document.body.appendChild(ov);
    const allTags = typeof getTags === 'function' ? getTags() : Promise.resolve([]);
    Promise.resolve(allTags).then(tags => render(tags));
}

// ============================================================================
// OPEN/CLOSE MODAL (adapted for LocalNotesEditor, no TinyMCE)
// ============================================================================
function openModal(noteId, noteContent, noteCreationTime) {
    const modal = document.getElementById('editModal');
    if (!modal) { console.error('Modal not found'); return; }

    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    if (responsiveManager?.isTabletDevice) {
        setTimeout(() => responsiveManager.applyFullscreenModal(modal), 100);
    }

    currentNoteId = noteId || null;

    // Init meta from existing note
    if (noteId) {
        notesDB.getNote(noteId).then(note => {
            if (note) {
                window._noteMeta = {
                    tags:   note.tags   || [],
                    dueDate: note.dueDate || null,
                    color:  note.color  || '',
                    pinned: note.pinned || false
                };
            }
        }).catch(() => {});
    } else {
        window._noteMeta = { tags: [], dueDate: window._currentNoteDueDate || null, color: '', pinned: false };
        window._currentNoteDueDate = null;
    }

    // Wire settings button
    const settingsBtn = document.getElementById('noteSettingsBtn');
    if (settingsBtn) {
        settingsBtn.onclick = () => openNoteSettings(currentNoteId);
    }

    // Wait for LocalNotesEditor
    const waitForEditor = () => new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance && !localNotesEditorInstance.isDestroyed) {
                resolve();
            } else if (attempts >= 50) {
                reject(new Error('Editor initialization timeout'));
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });

    waitForEditor()
        .then(() => {
            try {
                if (noteId && noteContent) {
                    let content = validateAndFixImages(noteContent);
                    content = fixChecklistStructure(content);
                    localNotesEditorInstance.setContent(content);
                    currentNoteId = noteId;
                } else {
                    localNotesEditorInstance.setContent('');
                    currentNoteId = null;
                }
                localNotesEditorInstance.focus();
                setTimeout(() => { if (typeof hljs !== 'undefined') hljs.highlightAll(); fixCodeBlockStyles(); }, 100);
            } catch (e) {
                console.error('Error setting content:', e);
            }
        })
        .catch(e => {
            console.error('Editor wait error:', e);
            showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorEditorTimeout') : 'Editor initialization timeout!', 'error');
        });

    const saveBtn = document.getElementById('saveNoteButton');
    if (saveBtn) saveBtn.onclick = async () => {
        let content = '';
        if (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance) {
            content = localNotesEditorInstance.getContent().trim();
        }
        if (!content || content === '<p></p>' || content === '<p><br></p>') {
            showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorEmptyNote') : 'Note cannot be empty!', 'error');
            return;
        }
        try {
            const processedContent = await processMediaContent(content);
            const timestamp = Date.now();
            const noteId2 = currentNoteId || 'note_' + timestamp + '_' + Math.random().toString(36).substr(2, 9);
            const meta = window._noteMeta || {};
            const note = {
                id: noteId2,
                content: processedContent,
                creationTime: noteCreationTime || timestamp,
                lastModified: timestamp,
                title: notesDB.extractTitle(processedContent),
                tags:    meta.tags    || [],
                dueDate: meta.dueDate || null,
                color:   meta.color   || '',
                pinned:  meta.pinned  || false
            };
            await notesDB.saveNote(note);
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            currentNoteId = null;
            if (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance) localNotesEditorInstance.setContent('');
            window._noteMeta = { tags: [], dueDate: null, color: '', pinned: false };
            await loadNotes();
        } catch (e) {
            console.error('Save error:', e);
            showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorSavingNote') : 'Error saving note!', 'error');
        }
    };
}

function closeModal() {
    const errorModal = document.getElementById('error');
    if (errorModal) errorModal.style.display = 'none';
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.style.display = 'none';
    document.body.classList.remove('modal-open');
    currentNoteId = null;
    if (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance) localNotesEditorInstance.setContent('');
}

// ============================================================================
// LOAD NOTES (from backup, adapted - using notesDB not notesDatabase)
// ============================================================================
async function loadNotes() {
    const viewer = document.querySelector('.btn_view_div');
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer) return;
    notesContainer.innerHTML = '';

    try {
        const allNotes = await notesDB.getAllNotes();
        // Apply tag filter
        const notes = typeof applyTagFilter === 'function' ? applyTagFilter(allNotes) : allNotes;
        // Sort: pinned first, then by lastModified
        notes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.lastModified - a.lastModified;
        });
        notes.forEach(note => { if (note.content) note.content = validateAndFixImages(note.content); });

        if (notes.length === 0) {
            if (viewer) viewer.style.display = 'none';
            showWelcomeMessage();
            return;
        }

        if (viewer) viewer.style.display = '';
        const existingWelcome = document.querySelector('.welcome-message');
        if (existingWelcome) existingWelcome.remove();

        // Get all tags for rendering
        const allTags = typeof getTags === 'function' ? await getTags() : [];

        notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.classList.add('note');
            noteEl.dataset.noteId = note.id;
            noteEl.dataset.noteCreationTime = note.creationTime;
            // Color accent
            if (note.color) { noteEl.style.setProperty('--note-accent', note.color); noteEl.dataset.color = note.color; }
            if (note.pinned) noteEl.classList.add('pinned');

            // Footer with dates + inline pin + inline due badge
            const footer = document.createElement('div');
            footer.classList.add('note-footer');

            const actualLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
            const localeMap = { ru:'ru-RU', ua:'uk-UA', pl:'pl-PL', cs:'cs-CZ', sk:'sk-SK', bg:'bg-BG', hr:'hr-HR', sr:'sr-RS', bs:'bs-BA', mk:'mk-MK', sl:'sl-SI' };
            const locale = localeMap[actualLang] || 'en-US';
            const opts = { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' };
            const creationTime = typeof formatDate === 'function' ? formatDate(note.creationTime, 'medium', actualLang) : new Date(note.creationTime).toLocaleString(locale, opts);
            const lastModified = typeof formatDate === 'function' ? formatDate(note.lastModified, 'medium', actualLang) : new Date(note.lastModified).toLocaleString(locale, opts);
            const createdText = window.langData?.[actualLang]?.created || (typeof t === 'function' ? t('created') : 'Created');
            const modifiedText = window.langData?.[actualLang]?.modified || (typeof t === 'function' ? t('modified') : 'Modified');

            // Footer content: date text
            const dateSpan = document.createElement('span');
            dateSpan.className = 'note-footer-date';
            dateSpan.textContent = `${createdText}: ${creationTime} | ${modifiedText}: ${lastModified}`;
            footer.appendChild(dateSpan);

            // Pin indicator inline in footer
            if (note.pinned) {
                const pinEl = document.createElement('span');
                pinEl.className = 'note-pin-indicator';
                pinEl.innerHTML = '<i class="bi bi-pin-angle-fill"></i>';
                footer.appendChild(pinEl);
            }

            // Due date badge inline in footer
            if (note.dueDate) {
                const due = new Date(note.dueDate);
                let cls = 'due-normal', icon = 'bi-clock';
                if (typeof isOverdue === 'function' && isOverdue(note.dueDate)) {
                    cls = 'due-overdue'; icon = 'bi-exclamation-circle';
                    noteEl.classList.add('note-overdue');
                } else if (typeof isDueToday === 'function' && isDueToday(note.dueDate)) {
                    cls = 'due-today'; icon = 'bi-alarm';
                    noteEl.classList.add('note-due-today');
                } else if (typeof isDueSoon === 'function' && isDueSoon(note.dueDate)) {
                    cls = 'due-soon'; icon = 'bi-clock-history';
                    noteEl.classList.add('note-due-soon');
                }
                const badge = document.createElement('span');
                badge.className = `note-due-badge ${cls}`;
                const lang = window.currentLang || 'en';
                const localeMap = { ru:'ru-RU', ua:'uk-UA', pl:'pl-PL', cs:'cs-CZ', sk:'sk-SK', bg:'bg-BG', hr:'hr-HR', sr:'sr-RS', bs:'bs-BA', mk:'mk-MK', sl:'sl-SI', en:'en-US' };
                const locale = localeMap[lang] || lang;
                badge.innerHTML = `<i class="bi ${icon}"></i>${due.toLocaleDateString(locale, {month:'short', day:'numeric'})}`;
                footer.appendChild(badge);
            }

            noteEl.appendChild(footer);

            // Checklist progress
            const progress = getChecklistProgress(note.content);
            if (progress) {
                const pct = Math.round(progress.checked / progress.total * 100);
                const doneLbl = window.translations?.[actualLang]?.checklistDone || 'done';
                const pc = document.createElement('div');
                pc.classList.add('checklist-progress');
                pc.innerHTML = `<div class="checklist-progress-header"><span class="checklist-progress-label">☑ ${progress.checked}/${progress.total} ${doneLbl}</span><span class="checklist-progress-pct">${pct}%</span></div><div class="checklist-progress-bar-track"><div class="checklist-progress-bar-fill" style="width:${pct}%"></div></div>`;
                noteEl.appendChild(pc);
            }

            // Content
            const notePreview = document.createElement('div');
            notePreview.classList.add('noteContent');
            notePreview.innerHTML = note.content;

            // Remove contenteditable from all elements in note cards (not in editor)
            notePreview.querySelectorAll('[contenteditable]').forEach(el => {
                el.removeAttribute('contenteditable');
            });
            // Hide add-desc buttons in card view
            notePreview.querySelectorAll('.checklist-add-desc').forEach(btn => {
                btn.style.display = 'none';
            });

            // Interactive checkboxes
            notePreview.querySelectorAll('.checklist-checkbox-ios, input[type="checkbox"]').forEach(cb => {
                if (cb.getAttribute('data-checked') === 'true') {
                    cb.checked = true;
                    // Apply strikethrough to text span
                    const textSpan = cb.closest('.checklist-item-wrapper')?.querySelector('.checklist-text-content, .checklist-text-ios');
                    if (textSpan) textSpan.classList.add('checklist-done');
                    cb.closest('.checklist-item-wrapper')?.classList.add('checklist-item-done');
                }
                cb.addEventListener('change', async () => {
                    const isChecked = cb.checked;
                    cb.setAttribute('data-checked', isChecked ? 'true' : 'false');
                    const textSpan = cb.closest('.checklist-item-wrapper')?.querySelector('.checklist-text-content, .checklist-text-ios');
                    if (textSpan) textSpan.classList.toggle('checklist-done', isChecked);
                    cb.closest('.checklist-item-wrapper')?.classList.toggle('checklist-item-done', isChecked);
                    const updContent = notePreview.innerHTML;
                    const ts = Date.now();
                    try {
                        await notesDB.saveNote({ id: note.id, content: updContent, creationTime: note.creationTime, lastModified: ts, title: notesDB.extractTitle(updContent) });
                        const np = getChecklistProgress(updContent);
                        if (np) {
                            const pctNew = Math.round(np.checked / np.total * 100);
                            const fill = noteEl.querySelector('.checklist-progress-bar-fill');
                            const pctEl = noteEl.querySelector('.checklist-progress-pct');
                            const lblEl = noteEl.querySelector('.checklist-progress-label');
                            const actLng = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
                            const doneLbl2 = window.translations?.[actLng]?.checklistDone || 'done';
                            if (fill) fill.style.width = pctNew + '%';
                            if (pctEl) pctEl.textContent = pctNew + '%';
                            if (lblEl) lblEl.textContent = `☑ ${np.checked}/${np.total} ${doneLbl2}`;
                        }
                    } catch (err) { console.error('Checklist save error:', err); }
                });
            });

            setTimeout(() => { processTablesForResponsiveness(notePreview); }, 100);

            // Image handlers
            notePreview.querySelectorAll('img').forEach(img => {
                img.addEventListener('load', () => img.classList.add('loaded'));
                img.addEventListener('error', () => { img.classList.add('error'); img.alt = 'Image load error'; });
                if (img.complete && img.naturalHeight) img.classList.add('loaded');
                img.addEventListener('click', handleImageClick);
            });

            noteEl.appendChild(notePreview);

            // Buttons
            const btns = document.createElement('div'); btns.classList.add('note-buttons');

            // Tags inside footer
            if (note.tags && note.tags.length && allTags.length) {
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'note-tags';
                for (const tagId of note.tags) {
                    const tag = allTags.find(t => t.id === tagId);
                    if (!tag) continue;
                    const colorObj = (typeof TAG_COLORS !== 'undefined' ? TAG_COLORS : []).find(c => c.id === tag.colorId);
                    const hex = colorObj ? colorObj.hex : '#aefc6e';
                    const pill = document.createElement('span');
                    pill.className = 'note-tag-pill';
                    pill.style.setProperty('--tag-color', hex);
                    pill.textContent = tag.name;
                    tagsDiv.appendChild(pill);
                }
                btns.appendChild(tagsDiv);
            }

            const btnRow = document.createElement('div'); btnRow.className = 'note-btn-row';
            const editBtn = document.createElement('button'); editBtn.classList.add('editBtn');
            editBtn.innerHTML = typeof t === 'function' ? t('edit') : 'Edit';
            editBtn.onclick = () => openModal(note.id, note.content, note.creationTime);
            const delBtn = document.createElement('button'); delBtn.classList.add('deleteBtn');
            delBtn.innerHTML = typeof t === 'function' ? t('delete') : 'Delete';
            delBtn.onclick = () => {
                noteEl.classList.add('removing');
                setTimeout(async () => {
                    try { await notesDB.deleteNote(note.id); await loadNotes(); }
                    catch (e) { showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorDeletingNote') : 'Error deleting!', 'error'); }
                }, 500);
            };
            const expBtn = document.createElement('button'); expBtn.classList.add('exportBtn');
            expBtn.innerHTML = typeof t === 'function' ? t('export') : 'Export';
            expBtn.onclick = () => showExportOptions(note.content);
            btnRow.appendChild(editBtn); btnRow.appendChild(delBtn); btnRow.appendChild(expBtn);
            btns.appendChild(btnRow);
            noteEl.appendChild(btns);

            if (quickEditActive) enableQuickEditOnNote(noteEl);
            notesContainer.appendChild(noteEl);
        });

        setTimeout(() => { if (typeof hljs !== 'undefined') hljs.highlightAll(); initCodeBlockCopyButtons(notesContainer); fixCodeBlockStyles(notesContainer); }, 200);
    } catch (e) {
        console.error('Error loading notes:', e);
        showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorLoadingNotes') : 'Error loading notes!', 'error');
    }
}

function handleImageClick(e) {
    if (e.target.tagName !== 'IMG') return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    const img = document.createElement('img');
    img.src = e.target.src; img.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;';
    overlay.appendChild(img);
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.body.appendChild(overlay);
}

// ============================================================================
// WELCOME MESSAGE (from backup)
// ============================================================================
function showWelcomeMessage() {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer || document.querySelector('.welcome-message')) return;

    function gt(key, fb) {
        try { if (typeof t === 'function') { const v = t(key); return (v && v !== key) ? v : fb; } return fb; } catch { return fb; }
    }

    const wc = document.createElement('div');
    wc.classList.add('welcome-message');
    wc.innerHTML = `<div class="welcome-content">
        <div class="welcome-header">
            <h1 class="welcome-title">${gt('welcomeTitle','Welcome to Local Notes')}</h1>
            <p class="welcome-subtitle">${gt('welcomeSubtitle','Secure, private note-taking in your browser')}</p>
        </div>
        <div class="welcome-section"><h2 class="welcome-section-title">${gt('welcomeAbout','About Local Notes')}</h2>
            <p class="welcome-description">${gt('welcomeDescription','Local Notes is a secure web application for creating and storing notes directly in your browser.')}</p></div>
        <div class="welcome-section"><h2 class="welcome-section-title">${gt('welcomeFeatures','Key Features')}</h2>
            <ul class="welcome-features">
                <li>${gt('welcomeFeature1','Military-grade AES-256 encryption')}</li>
                <li>${gt('welcomeFeature2','12 languages supported')}</li>
                <li>${gt('welcomeFeature3','PWA support - install as app')}</li>
                <li>${gt('welcomeFeature4','Optimized performance')}</li>
                <li>${gt('welcomeFeature5','Enhanced security protection')}</li>
                <li>${gt('welcomeFeature6','Modern responsive design')}</li>
                <li>${gt('welcomeFeature7','Offline operation support')}</li>
            </ul></div>
        <div class="welcome-section"><h2 class="welcome-section-title">${gt('welcomeGoals','Project Goals')}</h2>
            <ul class="welcome-goals">
                <li>${gt('welcomeGoal1','Maximum privacy - data stays local')}</li>
                <li>${gt('welcomeGoal2','Security - military-grade encryption')}</li>
                <li>${gt('welcomeGoal3','Accessibility - 12 languages')}</li>
                <li>${gt('welcomeGoal4','Universality - works everywhere')}</li>
                <li>${gt('welcomeGoal5','Performance - fast operation')}</li>
                <li>${gt('welcomeGoal6','Convenience - intuitive interface')}</li>
            </ul></div>
        <div class="welcome-section"><h2 class="welcome-section-title">${gt('welcomeDeveloper','Developer')}</h2>
            <p class="welcome-developer-info">${gt('welcomeDeveloperInfo','Developed by SerGio Play. Open source project focused on privacy and security.')}</p></div>
        <div class="welcome-section"><h2 class="welcome-section-title">${gt('welcomeGetStarted','Get Started')}</h2>
            <p class="welcome-get-started">${gt('welcomeGetStartedText','Click Add Note to create your first note.')}</p></div>
        <div class="welcome-actions">
            <button class="welcome-dismiss-btn" onclick="showWelcomeInstructions()">${gt('welcomeDismiss','Show instructions')}</button>
        </div></div>`;
    notesContainer.appendChild(wc);
    setTimeout(() => updateWelcomeTranslations(), 100);
}

function showWelcomeInstructions() {
    showCustomAlert(
        typeof t === 'function' ? t('welcomeInstructionsTitle') || 'How to get started' : 'How to get started',
        typeof t === 'function' ? t('welcomeInstructions') || "Click 'Add Note' to create your first note." : "Click 'Add Note' to create your first note.",
        'info'
    );
}

function updateWelcomeTranslations() {
    const wm = document.querySelector('.welcome-message');
    if (!wm || typeof t !== 'function') return;
    try {
        const map = {'.welcome-title':'welcomeTitle','.welcome-subtitle':'welcomeSubtitle'};
        Object.entries(map).forEach(([sel, key]) => { const el = wm.querySelector(sel); if (el) el.textContent = t(key) || el.textContent; });
        [['welcomeFeature1','welcomeFeature2','welcomeFeature3','welcomeFeature4','welcomeFeature5','welcomeFeature6','welcomeFeature7'],
         ['welcomeGoal1','welcomeGoal2','welcomeGoal3','welcomeGoal4','welcomeGoal5','welcomeGoal6']].forEach((keys, i) => {
            const items = wm.querySelectorAll(i === 0 ? '.welcome-features li' : '.welcome-goals li');
            items.forEach((item, idx) => { if (keys[idx]) item.textContent = t(keys[idx]) || item.textContent; });
        });
    } catch (e) { console.warn('Translation update error:', e); }
}

// ============================================================================
// SEARCH (from backup)
// ============================================================================
function filterNotes() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        document.querySelectorAll('.note').forEach(n => n.classList.remove('hidden'));
        highlightSearchResults(''); return;
    }
    const tq = transliterate(query);
    document.querySelectorAll('.note').forEach(note => {
        const content = note.querySelector('.noteContent');
        if (!content) { note.classList.add('hidden'); return; }
        const allText = content.textContent.toLowerCase() + ' ' + (note.querySelector('.note-footer')?.textContent.toLowerCase() || '');
        const allTr = transliterate(allText);
        const match = allText.includes(query) || allTr.includes(tq) ||
            (() => { const words = query.split(/\s+/).filter(w => w.length > 0); return words.length > 1 && words.every(w => allText.includes(w) || allTr.includes(transliterate(w))); })() ||
            allText.split(/\s+/).some(w => w.startsWith(query)) || allTr.split(/\s+/).some(w => w.startsWith(tq)) ||
            (query.length > 2 && (allText.includes(query.slice(0,-1)) || allTr.includes(transliterate(query.slice(0,-1)))));
        note.classList.toggle('hidden', !match);
    });
    highlightSearchResults(query);
}

function highlightSearchResults(query) {
    // Visual search highlight – minimal implementation
    document.querySelectorAll('.note').forEach(note => {
        note.classList.toggle('search-highlight', query.length > 0 && !note.classList.contains('hidden'));
    });
}

// ============================================================================
// WORD COUNT (adapted – works with LocalNotesEditor)
// ============================================================================
function showWordCount() {
    const text = (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance) ? localNotesEditorInstance.getText() : '';
    if (!text) return;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length, charsNoSpaces = text.replace(/\s/g, '').length;
    showCustomAlert(typeof t === 'function' ? t('info') : 'Info', typeof t === 'function' ? t('wordCount', { words, chars, charsNoSpaces }) : `Words: ${words} | Chars: ${chars} | No spaces: ${charsNoSpaces}`, 'info');
}

// ============================================================================
// QUICK EDIT (from backup)
// ============================================================================
function toggleQuickEditMode() {
    quickEditActive = !quickEditActive;
    localStorage.setItem('quickEditMode', quickEditActive ? '1' : '0');
    applyQuickEditMode();
}

function applyQuickEditMode() {
    const btn = document.getElementById('quickEditToggle');
    if (quickEditActive) {
        document.body.classList.add('quick-edit-active');
        if (btn) { btn.classList.add('active'); btn.innerHTML = typeof t === 'function' ? t('quickEditOff') || 'Quick Edit: ON' : 'Quick Edit: ON'; btn.title = typeof t === 'function' ? t('quickEditOffTitle') || 'Disable quick edit mode' : 'Disable quick edit mode'; }
        document.getElementById('notesContainer')?.querySelectorAll('.note').forEach(el => enableQuickEditOnNote(el));
    } else {
        document.body.classList.remove('quick-edit-active');
        if (btn) { btn.classList.remove('active'); btn.innerHTML = typeof t === 'function' ? t('quickEditOn') || 'Quick Edit' : 'Quick Edit'; btn.title = typeof t === 'function' ? t('quickEditOnTitle') || 'Enable quick edit mode' : 'Enable quick edit mode'; }
        document.getElementById('notesContainer')?.querySelectorAll('.note').forEach(el => disableQuickEditOnNote(el));
    }
}

function enableQuickEditOnNote(noteEl) {
    const content = noteEl.querySelector('.noteContent');
    if (!content || content.getAttribute('contenteditable') === 'true') return;
    content.setAttribute('contenteditable', 'true'); content.setAttribute('spellcheck', 'true');
    noteEl.classList.add('quick-edit-note');
    if (noteEl.querySelector('.quick-edit-bar')) return;
    const bar = document.createElement('div'); bar.className = 'quick-edit-bar';
    bar.innerHTML = `<span class="quick-edit-hint">${typeof t === 'function' ? t('quickEditHint') || 'Quick edit' : 'Quick edit'}</span>
        <div class="quick-edit-actions">
            <button class="quick-edit-save">${typeof t === 'function' ? t('save') || 'Save' : 'Save'}</button>
            <button class="quick-edit-cancel">${typeof t === 'function' ? t('cancel') || 'Cancel' : 'Cancel'}</button>
        </div>`;
    noteEl.appendChild(bar);
    const noteId = noteEl.dataset.noteId, noteCreationTime = parseInt(noteEl.dataset.noteCreationTime, 10);
    let originalContent = content.innerHTML;
    bar.querySelector('.quick-edit-save').addEventListener('click', async e => {
        e.stopPropagation();
        await saveQuickEdit(noteEl, content, noteId, noteCreationTime);
        originalContent = content.innerHTML; noteEl.classList.remove('quick-edit-dirty');
    });
    bar.querySelector('.quick-edit-cancel').addEventListener('click', e => {
        e.stopPropagation(); content.innerHTML = originalContent; noteEl.classList.remove('quick-edit-dirty');
        disableQuickEditOnNote(noteEl);
        if (!document.querySelector('#notesContainer .note.quick-edit-note')) { quickEditActive = false; localStorage.setItem('quickEditMode','0'); applyQuickEditMode(); }
        showQuickEditNotification(typeof t === 'function' ? t('quickEditCancelled') || 'Changes cancelled' : 'Changes cancelled', 'info');
    });
    content.addEventListener('input', () => noteEl.classList.add('quick-edit-dirty'));
    let blurTimer;
    content.addEventListener('blur', () => { blurTimer = setTimeout(async () => { if (noteEl.classList.contains('quick-edit-dirty')) { await saveQuickEdit(noteEl, content, noteId, noteCreationTime); originalContent = content.innerHTML; noteEl.classList.remove('quick-edit-dirty'); } }, 400); });
    content.addEventListener('focus', () => clearTimeout(blurTimer));
}

async function saveQuickEdit(noteEl, content, noteId, noteCreationTime) {
    const updatedContent = content.innerHTML;
    const timestamp = Date.now();
    try {
        await notesDB.saveNote({ id: noteId, content: updatedContent, creationTime: noteCreationTime, lastModified: timestamp, title: notesDB.extractTitle(updatedContent) });
        noteEl.dataset.noteCreationTime = noteCreationTime;
        const footer = noteEl.querySelector('.note-footer');
        if (footer) {
            const actLng = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
            const localeMap = { ru:'ru-RU', ua:'uk-UA', pl:'pl-PL', cs:'cs-CZ', sk:'sk-SK', bg:'bg-BG', hr:'hr-HR', sr:'sr-RS', bs:'bs-BA', mk:'mk-MK', sl:'sl-SI' };
            const locale = localeMap[actLng] || 'en-US';
            const opts = { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' };
            const modifiedText = window.langData?.[actLng]?.modified || (typeof t === 'function' ? t('modified') : 'Modified');
            const createdText = window.langData?.[actLng]?.created || (typeof t === 'function' ? t('created') : 'Created');
            footer.textContent = `${createdText}: ${new Date(noteCreationTime).toLocaleString(locale, opts)} | ${modifiedText}: ${new Date(timestamp).toLocaleString(locale, opts)}`;
        }
        showQuickEditNotification(typeof t === 'function' ? t('noteSaved') || 'Note saved!' : 'Note saved!', 'success');
    } catch (e) {
        console.error('Quick edit save error:', e);
        showQuickEditNotification(typeof t === 'function' ? t('errorSavingNote') || 'Error saving!' : 'Error saving!', 'error');
    }
}

function disableQuickEditOnNote(noteEl) {
    const content = noteEl.querySelector('.noteContent');
    if (content) { content.setAttribute('contenteditable', 'false'); content.removeAttribute('spellcheck'); }
    noteEl.classList.remove('quick-edit-note', 'quick-edit-dirty');
    const bar = noteEl.querySelector('.quick-edit-bar'); if (bar) noteEl.removeChild(bar);
}

function showQuickEditNotification(message, type = 'success') {
    const n = document.createElement('div');
    const colors = { success: '#28a745', error: '#dc3545', info: '#007bff' };
    n.style.cssText = `position:fixed;bottom:20px;right:20px;background:${colors[type]||colors.info};color:white;padding:12px 20px;border-radius:8px;z-index:99999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:opacity 0.3s;`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(() => { if (n.parentNode) document.body.removeChild(n); }, 300); }, 2000);
}

function restoreQuickEditMode() {
    quickEditActive = localStorage.getItem('quickEditMode') === '1';
    applyQuickEditMode();
}

// ============================================================================
// VIEW MODE
// ============================================================================
function toggleViewMode() {
    const container = document.getElementById('notesContainer');
    if (!container) return;
    const isFull = container.classList.contains('full-width-view');
    container.classList.toggle('full-width-view', !isFull);
    container.classList.toggle('default-view', isFull);
    localStorage.setItem('viewMode', isFull ? 'grid' : 'list');
    if (window.appUtils) window.appUtils.updateToggleViewButton();
}

function restoreViewMode() {
    const saved = localStorage.getItem('viewMode');
    const container = document.getElementById('notesContainer');
    if (!container) return;
    if (saved === 'list') { container.classList.add('full-width-view'); container.classList.remove('default-view'); }
    else { container.classList.add('default-view'); container.classList.remove('full-width-view'); }
    if (window.appUtils) window.appUtils.updateToggleViewButton();
}

// ============================================================================
// FOOTER TEXTS
// ============================================================================
function updateFooterTexts() {
    if (typeof t === 'undefined' && typeof window.t === 'undefined') return;
    const fn = typeof t === 'function' ? t : window.t;
    if (typeof fn !== 'function') return;
    try {
        [['footerDescription','footerDescription'],['cookiePolicyLink','cookiePolicy'],['termsOfUseLink','termsOfUse'],['privacyPolicyLink','privacyPolicy'],['byAuthorLink','byAuthor'],['allRightsReserved','allRightsReserved']].forEach(([id, key]) => {
            const el = document.getElementById(id); if (el) el.textContent = fn(key) || el.textContent;
        });
        const yearEl = document.getElementById('currentYear'); if (yearEl) yearEl.textContent = new Date().getFullYear();
        if (typeof updateWelcomeTranslations === 'function') updateWelcomeTranslations();
    } catch (e) { console.error('Footer update error:', e); }
}

function updateButtonTexts() {
    if (typeof t !== 'function' && typeof window.t !== 'function') return;
    const fn = typeof t === 'function' ? t : window.t;
    if (typeof fn !== 'function') return;
    [
        ['addNoteButton', `<i class="fas fa-plus"></i> ${fn('addNote') || 'Add a note'}`],
        ['importButton', `<i class="fas fa-upload"></i> ${fn('importNotes') || 'Import notes'}`],
        ['clearAllButton', `<i class="fas fa-trash-alt"></i> ${fn('clearAllNotes') || 'Clear all notes'}`],
        ['saveNoteButton', `<i class="fas fa-save"></i> ${fn('saveNote') || 'Save note'}`],
        ['cancelNoteButton', `<i class="fas fa-times"></i> ${fn('cancel') || 'Cancel'}`],
        ['confirmYes', `<i class="fas fa-check"></i> ${fn('confirmYes') || 'Yes'}`],
        ['confirmNo', `<i class="fas fa-times"></i> ${fn('confirmNo') || 'No'}`],
        ['ok', `<i class="fas fa-check"></i> ${fn('ok') || 'OK'}`],
        ['calendarBtn', `<i class="bi bi-calendar3"></i> ${fn('calendar') || 'Calendar'}`]
    ].forEach(([id, html]) => { const el = document.getElementById(id); if (el) el.innerHTML = html; });
    if (window.appUtils) window.appUtils.updateToggleViewButton();
}
window.updateButtonTexts = updateButtonTexts;

// ============================================================================
// EXPORT / IMPORT (from backup)
// ============================================================================
function exportNoteHTML(noteContent) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([`<!-- Exported on ${ts} -->\n` + noteContent], { type: 'text/html' });
    downloadFile(blob, `note_${ts}.html`, 'text/html');
}

async function exportToMarkdown(noteContent) {
    try {
        const pc = await processMediaContent(noteContent);
        const md = pc
            .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (m, n, t) => '#'.repeat(+n) + ' ' + t + '\n\n')
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi,'**$1**').replace(/<b[^>]*>(.*?)<\/b>/gi,'**$1**')
            .replace(/<em[^>]*>(.*?)<\/em>/gi,'*$1*').replace(/<i[^>]*>(.*?)<\/i>/gi,'*$1*')
            .replace(/<s[^>]*>(.*?)<\/s>/gi,'~~$1~~').replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi,'> $1\n')
            .replace(/<code[^>]*>(.*?)<\/code>/gi,'`$1`').replace(/<pre[^>]*>(.*?)<\/pre>/gi,'```\n$1\n```\n')
            .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (m, c) => c.replace(/<li[^>]*>(.*?)<\/li>/gi,'- $1\n') + '\n')
            .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (m, c) => { let i=1; return c.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${i++}. $1\n`) + '\n'; })
            .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,'[$2]($1)')
            .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi,'![$2]($1)')
            .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi,'![]($1)')
            .replace(/<br\s*\/?>/gi,'\n').replace(/<p[^>]*>(.*?)<\/p>/gi,'$1\n\n')
            .replace(/<[^>]*>/g,'').replace(/\n\s*\n\s*\n/g,'\n\n').trim();
        const ts = new Date().toISOString().replace(/[:.]/g,'-');
        const blob = new Blob([`# Exported Note\n*Exported ${new Date().toLocaleString()}*\n\n---\n\n${md}`], { type: 'text/markdown' });
        downloadFile(blob, `note_${ts}.md`, 'text/markdown');
        showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('noteExported') : 'Note exported!', 'success');
    } catch (e) { showCustomAlert(typeof t === 'function' ? t('error') : 'Error', e.message, 'error'); }
}

async function exportToHTML(noteContent) {
    try {
        const pc = await processMediaContent(noteContent);
        const ts = new Date().toISOString().replace(/[:.]/g,'-');
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Note</title><style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px;line-height:1.6}img{max-width:100%}</style></head><body>${pc}</body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        downloadFile(blob, `note_${ts}.html`, 'text/html');
        showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('noteExported') : 'Exported!', 'success');
    } catch (e) { showCustomAlert(typeof t === 'function' ? t('error') : 'Error', e.message, 'error'); }
}

function exportToPDF(noteContent) {
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@media print{@page{margin:1in;size:A4}}body{font-family:sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px}img{max-width:100%}</style></head><body>${noteContent}</body></html>`);
    win.document.close(); win.focus(); setTimeout(() => { win.print(); win.close(); }, 500);
}

async function exportNote(noteContent, password) {
    try {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const pc = await processMediaContent(noteContent);
        const contentWithTag = `<!-- Exported on ${ts} -->\n${pc}`;
        const encrypted = await encryption.encrypt(contentWithTag, password);
        const exportData = JSON.stringify({ version: '2.0', format: 'encrypted', data: encrypted, timestamp: Date.now() });
        const blob = new Blob([exportData], { type: 'application/json' });
        downloadFile(blob, `note_${ts}.note`, 'application/json');
        showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('noteExported') : 'Note encrypted and exported!', 'success');
    } catch (e) {
        console.error('Export error:', e);
        showCustomAlert(typeof t === 'function' ? t('error') : 'Error', e.message, 'error');
    }
}

function exportNoteWithFormat(noteContent, format = 'html') {
    switch (format) {
        case 'markdown': exportToMarkdown(noteContent); break;
        case 'pdf': exportToPDF(noteContent); break;
        default: exportToHTML(noteContent); break;
    }
}

function showExportOptions(noteContent) {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `<div class="export-modal-content">
        <h3>${typeof t === 'function' ? t('chooseImportFormat') || 'Choose export format' : 'Choose export format'}</h3>
        <div class="export-options">
            <button class="export-option" data-format="html"><span class="export-icon">🌐</span><span class="export-text">HTML</span><span class="export-desc">Web page</span></button>
            <button class="export-option" data-format="encrypted"><span class="export-icon">🔒</span><span class="export-text">Encrypted</span><span class="export-desc">Password protected</span></button>
            <button class="export-option" data-format="markdown"><span class="export-icon">📝</span><span class="export-text">Markdown</span><span class="export-desc">Text format</span></button>
            <button class="export-option" data-format="pdf"><span class="export-icon">📄</span><span class="export-text">PDF</span><span class="export-desc">Print document</span></button>
        </div>
        <button class="export-close">${typeof t === 'function' ? t('cancel') : 'Cancel'}</button></div>`;
    document.body.appendChild(modal);
    const close = () => { if (modal.parentNode) document.body.removeChild(modal); };
    modal.querySelectorAll('.export-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const fmt = opt.dataset.format; close();
            if (fmt === 'encrypted') {
                showCustomPrompt(typeof t === 'function' ? t('encryptNote') || 'Encrypt Note' : 'Encrypt Note', typeof t === 'function' ? t('enterPasswordForFile') || 'Enter password:' : 'Enter password:', typeof t === 'function' ? t('password') || 'Password' : 'Password', '', pw => {
                    if (pw?.trim()) exportNote(noteContent, pw.trim());
                    else if (pw !== null) showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorEmptyPassword') : 'Password cannot be empty!', 'error');
                });
            } else if (fmt === 'html') { exportNoteHTML(noteContent); }
            else { exportNoteWithFormat(noteContent, fmt); }
        });
    });
    modal.querySelector('.export-close').addEventListener('click', close);
    modal.addEventListener('pointerdown', e => { if (e.target === modal) close(); });
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
}

async function importNotesWithFormat(event) {
    const files = event.target.files;
    if (!files?.length) return;
    const filesArray = Array.from(files);
    event.target.value = '';

    // Show fullscreen loading overlay immediately
    const loadingOv = document.createElement('div');
    loadingOv.id = 'import-loading-ov';
    loadingOv.innerHTML = '<div class="import-loading-spinner"><i class="bi bi-hourglass-split"></i></div>';
    document.body.appendChild(loadingOv);

    // Force browser to paint the overlay before continuing
    await new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(resolve, 10); // Extra 10ms to ensure visibility
            });
        });
    });

    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `<div class="export-modal-content">
        <h3>${typeof t === 'function' ? t('chooseImportFormat') || 'Choose import format' : 'Choose import format'}</h3>
        <div class="export-options">
            <button class="export-option" data-format="encrypted"><span class="export-icon">🔒</span><span class="export-text">Encrypted</span><span class="export-desc">.note files</span></button>
            <button class="export-option" data-format="html"><span class="export-icon">🌐</span><span class="export-text">HTML</span><span class="export-desc">HTML files</span></button>
            <button class="export-option" data-format="markdown"><span class="export-icon">📝</span><span class="export-text">Markdown</span><span class="export-desc">.md files</span></button>
        </div>
        <button class="export-close">${typeof t === 'function' ? t('cancel') : 'Cancel'}</button></div>`;

    // Remove loading overlay, show format modal
    if (loadingOv.parentNode) document.body.removeChild(loadingOv);
    document.body.appendChild(modal);

    const close = () => { if (modal.parentNode) document.body.removeChild(modal); };
    modal.querySelectorAll('.export-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const fmt = opt.dataset.format; close();
            if (fmt === 'encrypted') importNotesFiles(filesArray);
            else if (fmt === 'html') importNotesHTML(filesArray);
            else importNotesMarkdown(filesArray);
        });
    });
    modal.querySelector('.export-close').addEventListener('click', () => { close(); });
    modal.addEventListener('pointerdown', e => { if (e.target === modal) close(); });
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
}

async function importNotesHTML(files) {
    let imported = 0, errors = 0;
    for (const file of files) {
        try {
            const text = await file.text();
            if (isEncryptedFile(text)) { errors++; showCustomAlert(typeof t === 'function' ? t('warning') : 'Warning', file.name + ' is encrypted, use Encrypted format', 'warning'); continue; }
            const tag = /<!-- Exported on [\d-T:.Z]+ -->/;
            let content = text;
            if (tag.test(text)) {
                const notes = text.replace(tag,'').trim().split('\n\n---\n\n');
                for (const n of notes) if (n.trim()) { await notesDB.saveNote({ id: 'note_'+Date.now()+'_'+Math.random().toString(36).substr(2,9), content: n, creationTime: Date.now(), lastModified: Date.now(), title: notesDB.extractTitle(n) }); imported++; }
            } else { await notesDB.saveNote({ id: 'note_'+Date.now()+'_'+Math.random().toString(36).substr(2,9), content, creationTime: Date.now(), lastModified: Date.now(), title: notesDB.extractTitle(content) }); imported++; }
        } catch (e) { errors++; showCustomAlert(typeof t === 'function' ? t('error') : 'Error', file.name + ': ' + e.message, 'error'); }
    }
    if (imported > 0) { showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('importCompleted', { count: imported }) : `Imported ${imported} notes`, 'success'); await loadNotes(); }
    else if (errors) showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorNoFilesImported') : 'No files imported', 'error');
}

async function importNotesMarkdown(files) {
    let imported = 0;
    for (const file of files) {
        try {
            const text = await file.text();
            const html = text.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/\n\n+/g,'</p><p>').replace(/^/,'<p>').replace(/$/, '</p>');
            await notesDB.saveNote({ id: 'note_'+Date.now()+'_'+Math.random().toString(36).substr(2,9), content: html, creationTime: Date.now(), lastModified: Date.now(), title: notesDB.extractTitle(html) });
            imported++;
        } catch (e) { showCustomAlert(typeof t === 'function' ? t('error') : 'Error', file.name + ': ' + e.message, 'error'); }
    }
    if (imported > 0) { showCustomAlert(typeof t === 'function' ? t('success') : 'Success', typeof t === 'function' ? t('importCompleted', { count: imported }) : `Imported ${imported} notes`, 'success'); await loadNotes(); }
}

async function importNotesFiles(files) {
    let imported = 0, errors = 0, skipped = 0;
    const fileList = Array.from(files);

    function showDecryptModal(file, fileText, index, total, onSubmit, onSkip) {
        const ov = document.createElement('div');
        ov.className = 'dcm-overlay';
        ov.innerHTML = `
            <div class="dcm-panel">
                <div class="dcm-header">
                    <div class="dcm-icon"><i class="bi bi-lock-fill"></i></div>
                    <div class="dcm-info">
                        <div class="dcm-title">${window.t ? window.t('decryptNote') : 'Decrypt Note'}</div>
                        <div class="dcm-file">${escapeHtml(file.name)}</div>
                        ${total > 1 ? `<div class="dcm-progress">${index + 1} ${window.t ? window.t('of') : 'of'} ${total}</div>` : ''}
                    </div>
                </div>
                <div class="dcm-body">
                    <div class="dcm-field">
                        <label class="dcm-label">${window.t ? window.t('password') : 'Password'}</label>
                        <div class="dcm-input-wrap">
                            <input type="password" id="dcm-pw" class="dcm-input" placeholder="${window.t ? window.t('dcmEnterPasswordPlaceholder') : 'Enter password...'}" autocomplete="current-password">
                            <button type="button" class="dcm-toggle-pw" id="dcm-toggle-pw" title="Show/hide password">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="dcm-status" id="dcm-status"></div>
                </div>
                <div class="dcm-footer">
                    <button class="dcm-btn dcm-skip" id="dcm-skip"><i class="bi bi-skip-forward"></i> ${window.t ? window.t('dcmSkipFile') : 'Skip file'}</button>
                    <button class="dcm-btn dcm-primary" id="dcm-ok"><i class="bi bi-unlock"></i> ${window.t ? window.t('dcmDecrypt') : 'Decrypt'}</button>
                </div>
            </div>`;
        document.body.appendChild(ov);

        const pwInput = ov.querySelector('#dcm-pw');
        const status  = ov.querySelector('#dcm-status');
        const okBtn   = ov.querySelector('#dcm-ok');
        const skipBtn = ov.querySelector('#dcm-skip');
        const toggleBtn = ov.querySelector('#dcm-toggle-pw');

        // Focus immediately — no delay
        pwInput.focus();

        // Toggle password visibility
        toggleBtn.addEventListener('click', () => {
            const isHidden = pwInput.type === 'password';
            pwInput.type = isHidden ? 'text' : 'password';
            toggleBtn.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
        });

        let checkTimer = null;

        // Live password check with debounce
        pwInput.addEventListener('input', () => {
            clearTimeout(checkTimer);
            const pw = pwInput.value;
            if (!pw) { status.innerHTML = ''; okBtn.disabled = false; return; }

            status.innerHTML = '<span class="dcm-checking"><i class="bi bi-hourglass-split"></i> ' + (window.t ? window.t('dcmChecking') : 'Checking...') + '</span>';
            checkTimer = setTimeout(async () => {
                try {
                    let parsed;
                    try { parsed = JSON.parse(fileText); } catch { parsed = null; }
                    const data = parsed ? (parsed.data || fileText) : fileText;
                    await encryption.decrypt(data, pw.trim());
                    status.innerHTML = '<span class="dcm-valid"><i class="bi bi-check-circle-fill"></i> ' + (window.t ? window.t('dcmPasswordCorrect') : 'Password correct!') + '</span>';
                    okBtn.classList.add('dcm-ready');
                } catch {
                    status.innerHTML = '<span class="dcm-invalid"><i class="bi bi-x-circle-fill"></i> ' + (window.t ? window.t('dcmWrongPassword') : 'Wrong password') + '</span>';
                    okBtn.classList.remove('dcm-ready');
                }
            }, 600);
        });

        const close = () => { if (ov.parentNode) document.body.removeChild(ov); };

        okBtn.addEventListener('click', async () => {
            const pw = pwInput.value.trim();
            if (!pw) { status.innerHTML = '<span class="dcm-invalid"><i class="bi bi-exclamation-circle"></i> ' + (window.t ? window.t('dcmEnterPassword') : 'Enter a password') + '</span>'; pwInput.focus(); return; }
            okBtn.disabled = true;
            okBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> ' + (window.t ? window.t('dcmDecrypting') : 'Decrypting...');
            try {
                let parsed;
                try { parsed = JSON.parse(fileText); } catch { parsed = null; }
                const data = parsed ? (parsed.data || fileText) : fileText;
                const content = (await encryption.decrypt(data, pw)).replace(/<!-- Exported on [\d-T:.Z]+ -->\n?/, '').trim();
                close();
                onSubmit(content);
            } catch {
                okBtn.disabled = false;
                okBtn.innerHTML = '<i class="bi bi-unlock"></i> ' + (window.t ? window.t('dcmDecrypt') : 'Decrypt');
                status.innerHTML = '<span class="dcm-invalid"><i class="bi bi-x-circle-fill"></i> ' + (window.t ? window.t('dcmWrongPasswordRetry') : 'Wrong password — try again') + '</span>';
                pwInput.select(); pwInput.focus();
            }
        });

        skipBtn.addEventListener('click', () => { close(); onSkip(); });

        // Enter key submits
        pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') okBtn.click(); });
    }

    async function processNext(index) {
        if (index >= fileList.length) {
            await loadNotes();
            const msg = [`Imported: ${imported}`];
            if (skipped > 0) msg.push(`Skipped: ${skipped}`);
            if (errors > 0)  msg.push(`Errors: ${errors}`);
            if (imported > 0) {
                showCustomAlert(typeof t === 'function' ? t('success') : 'Success',
                    typeof t === 'function' ? t('importCompleted', { count: imported }) : `Imported ${imported} notes`, 'success');
            } else {
                showCustomAlert(typeof t === 'function' ? t('error') : 'Error',
                    typeof t === 'function' ? t('errorNoFilesImported') : 'No files imported', 'error');
            }
            return;
        }

        const file     = fileList[index];
        const fileText = await file.text();

        showDecryptModal(file, fileText, index, fileList.length,
            async (content) => {
                try {
                    await notesDB.saveNote({
                        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        content, creationTime: Date.now(), lastModified: Date.now(),
                        title: notesDB.extractTitle(content)
                    });
                    imported++;
                } catch (e) { errors++; }
                await processNext(index + 1);
            },
            async () => { skipped++; await processNext(index + 1); }
        );
    }

    await processNext(0);
}

// ============================================================================
// EVENT LISTENERS + INITIALIZATION (from backup)
// ============================================================================
function initializeEventListeners() {
    const eventType = pointerManager.getEventType();

    const addBtn = document.getElementById('addNoteButton');
    if (addBtn) addBtn.addEventListener(eventType, e => { e.preventDefault(); openModal(); });

    const importBtn = document.getElementById('importButton');
    const importInput = document.getElementById('importInput');
    if (importBtn && importInput) importBtn.addEventListener(eventType, e => { e.preventDefault(); importInput.click(); });
    if (importInput) importInput.addEventListener('change', importNotesWithFormat);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterNotes);
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Escape') { searchInput.value = ''; filterNotes(); searchInput.blur(); }
            if (e.key === 'Enter') { e.preventDefault(); const first = document.querySelector('.note:not(.hidden)'); if (first) { first.scrollIntoView({ behavior:'smooth', block:'center' }); first.focus(); } }
        });
    }

    const clearBtn = document.getElementById('clearAllButton');
    if (clearBtn) clearBtn.addEventListener('click', showClearAllConfirmationModal);

    const quickEditBtn = document.getElementById('quickEditToggle');
    if (quickEditBtn) quickEditBtn.addEventListener('click', toggleQuickEditMode);

    // Calendar button
    const calBtn = document.getElementById('calendarBtn');
    if (calBtn) calBtn.addEventListener('click', () => {
        if (typeof openCalendar === 'function') openCalendar();
    });

    const cancelBtn = document.getElementById('cancelNoteButton');
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        const modal = document.getElementById('editModal');
        if (modal) modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        currentNoteId = null;
        if (typeof localNotesEditorInstance !== 'undefined' && localNotesEditorInstance) localNotesEditorInstance.setContent('');
    });

    // Close modal on backdrop click
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.addEventListener('click', e => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            currentNoteId = null;
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const m = document.getElementById('editModal'); if (m?.style.display === 'block') closeModal();
        }
    });
}

// ============================================================================
// APP INIT
// ============================================================================
window.onload = async () => {
    try {
        await notesDB.init();
        await notesDB.migrateFromLocalStorage();
        await loadNotes();
        restoreViewMode();
        restoreQuickEditMode();
        initializeEventListeners();
        updateFooterTexts();
        updateButtonTexts();
    } catch (e) {
        console.error('❌ Init error:', e);
        if (typeof showCustomAlert === 'function') showCustomAlert(typeof t === 'function' ? t('error') : 'Error', typeof t === 'function' ? t('errorInitializingApp') : 'Error initializing app!', 'error');
    }
};

// Export for compatibility
window.loadNotes = loadNotes;
window.openModal = openModal;
window.closeModal = closeModal;
window.showCustomAlert = showCustomAlert;
window.showCustomPrompt = showCustomPrompt;
window.showExportOptions = showExportOptions;
window.showWordCount = showWordCount;
window.toggleQuickEditMode = toggleQuickEditMode;
window.filterNotes = filterNotes;
window.showWelcomeMessage = showWelcomeMessage;
window.updateWelcomeTranslations = updateWelcomeTranslations;
window.updateFooterTexts = updateFooterTexts;
window.showWelcomeInstructions = showWelcomeInstructions;
window.notesDB = notesDB;
window.encryption = encryption;
window.exportNote = exportNote;
window.importNotesWithFormat = importNotesWithFormat;
