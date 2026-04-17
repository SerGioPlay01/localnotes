// Preloader controller — manages the inline #app-preloader element

(function () {
    const el = document.getElementById('app-preloader');
    if (!el) return;

    const lang = (() => {
        // 1. From URL path: /ru/, /ua/, etc.
        const m = window.location.pathname.match(/^\/([a-z]{2})\//);
        if (m) return m[1];
        // 2. From localStorage (saved preference)
        const saved = localStorage.getItem('preferredLanguage');
        if (saved) return saved;
        // 3. From browser language
        return (navigator.language || 'en').split('-')[0];
    })();
    const loadingTexts = {
        en: ['Initializing...', 'Loading modules...', 'Security check...', 'Preparing interface...', 'Almost ready...'],
        ru: ['Инициализация...', 'Загрузка модулей...', 'Проверка безопасности...', 'Подготовка интерфейса...', 'Почти готово...'],
        ua: ['Ініціалізація...', 'Завантаження модулів...', 'Перевірка безпеки...', 'Підготовка інтерфейсу...', 'Майже готово...'],
        pl: ['Inicjalizacja...', 'Ładowanie modułów...', 'Sprawdzanie...', 'Przygotowanie...', 'Prawie gotowe...'],
        cs: ['Inicializace...', 'Načítání modulů...', 'Kontrola...', 'Příprava...', 'Téměř hotovo...'],
        sk: ['Inicializácia...', 'Načítavanie...', 'Kontrola...', 'Príprava...', 'Takmer hotovo...'],
        bg: ['Инициализация...', 'Зареждане...', 'Проверка...', 'Подготовка...', 'Почти готово...'],
        hr: ['Inicijalizacija...', 'Učitavanje...', 'Provjera...', 'Priprema...', 'Gotovo...'],
        sr: ['Иницијализација...', 'Учитавање...', 'Провера...', 'Припрема...', 'Скоро готово...'],
        bs: ['Inicijalizacija...', 'Učitavanje...', 'Provjera...', 'Priprema...', 'Gotovo...'],
        mk: ['Иницијализација...', 'Вчитување...', 'Проверка...', 'Подготовка...', 'Речиси готово...'],
        sl: ['Inicializacija...', 'Nalaganje...', 'Preverjanje...', 'Priprava...', 'Skoraj pripravljeno...'],
    };
    const texts = loadingTexts[lang] || loadingTexts.en;

    el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div id="app-preloader-spinner"></div>
            <div id="app-preloader-text">Local Notes</div>
            <div style="width:220px;height:3px;background:rgba(174,252,110,0.15);border-radius:3px;overflow:hidden;margin-top:4px;">
                <div id="app-preloader-bar" style="height:100%;width:0%;background:#aefc6e;border-radius:3px;transition:width 0.3s cubic-bezier(0.4,0,0.2,1);"></div>
            </div>
            <div id="app-preloader-status" style="font-family:sans-serif;font-size:12px;color:rgba(255,255,255,0.45);min-height:18px;">${texts[0]}</div>
        </div>
    `;

    const bar = document.getElementById('app-preloader-bar');
    const status = document.getElementById('app-preloader-status');
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    let hidden = false;

    // Rotate status texts
    let textIndex = 0;
    const textInterval = setInterval(() => {
        textIndex = Math.min(textIndex + 1, texts.length - 1);
        if (status) status.textContent = texts[textIndex];
    }, 600);

    // Progress fills to 90% over 3s, then polls window.appReady flag
    const startTime = Date.now();
    const tick = () => {
        if (hidden) return;
        const t = Math.min((Date.now() - startTime) / 3000, 1);
        if (bar) bar.style.width = (easeOut(t) * 90) + '%';

        if (window.appReady) {
            hidePreloader();
        } else {
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);

    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        clearInterval(textInterval);
        if (bar) bar.style.width = '100%';
        if (status) status.textContent = texts[texts.length - 1];
        setTimeout(() => {
            el.style.transition = 'opacity 0.35s ease';
            el.style.opacity = '0';
            setTimeout(() => {
                el.remove();
                if (window.onPreloaderDone) window.onPreloaderDone();
            }, 350);
        }, 200);
    }

    // Safety fallback — hide after 10s no matter what
    setTimeout(() => { window.appReady = true; }, 10000);

    window.resetPreloader = function () { sessionStorage.removeItem('preloaderLastShown'); };
})();
