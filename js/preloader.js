// Современный прелоадер с анимированным замком и шифром

class ModernPreloader {
    constructor() {
        this.preloader = null;
        this.lottieAnimation = null;
        this.progressInterval = null;
        this.textInterval = null;
        this.isHidden = false;
        this.init();
    }

    init() {
        this.createPreloaderHTML();
        this.startLoading();
        this.createParticles();
    }

    createPreloaderHTML() {
        if (document.getElementById('modernPreloader')) {
            console.warn('Preloader already exists');
            return;
        }

        const preloaderHTML = `
            <div class="preloader" id="modernPreloader">
                <div class="preloader-content">
                    <div class="lottie-container" id="lottieContainer"></div>
                    <div class="loading-text">
                        <span id="preloaderText">Loading<span class="loading-dots">...</span></span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" id="preloaderProgressBar"></div>
                    </div>
                    <div class="progress-percentage">
                        <span id="progressText">0%</span>
                    </div>
                    <div class="loading-status" id="loadingStatus">
                        <span>Initializing...</span>
                    </div>
                </div>
                <div class="preloader-particles" id="preloaderParticles"></div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        this.preloader = document.getElementById('modernPreloader');
        
        this.loadLottieAnimation();
        this.updatePreloaderText();
    }

    createParticles() {
        const particlesContainer = document.getElementById('preloaderParticles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = 2 + Math.random() * 3 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    loadLottieAnimation() {
        const lottieContainer = document.getElementById('lottieContainer');
        if (!lottieContainer) return;
        
        // Уменьшаем размер контейнера Lottie
        lottieContainer.style.width = '180px';
        lottieContainer.style.height = '180px';
        
        if (typeof lottie === 'undefined') {
            console.warn('Preloader: Lottie library not loaded, using fallback');
            this.showFallbackAnimation();
            return;
        }
        
        const isLanguagePage = window.location.pathname.match(/^\/([a-z]{2})\//);
        const animationPath = isLanguagePage ? '../lottiesnimstion/password_security.json' : '/lottiesnimstion/password_security.json';
        
        try {
            this.lottieAnimation = lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: animationPath
            });
            
            this.lottieAnimation.addEventListener('error', (error) => {
                console.warn('Preloader: Lottie animation error:', error);
                this.showFallbackAnimation();
            });
            
        } catch (error) {
            console.warn('Preloader: Failed to load Lottie animation:', error);
            this.showFallbackAnimation();
        }
    }

    showFallbackAnimation() {
        const lottieContainer = document.getElementById('lottieContainer');
        if (lottieContainer) {
            lottieContainer.innerHTML = `
                <div class="fallback-animation">
                    <svg width="80" height="80" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary-color)" stroke-width="3" stroke-dasharray="200" stroke-dashoffset="0">
                            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <path d="M50 30 L50 50 L65 60" stroke="var(--primary-color)" stroke-width="3" fill="none" stroke-linecap="round">
                            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            `;
        }
    }

    updatePreloaderText() {
        const preloaderText = document.getElementById('preloaderText');
        if (!preloaderText) return;
        
        let currentLang = window.currentLang;
        if (!currentLang) {
            const path = window.location.pathname;
            const langMatch = path.match(/\/([a-z]{2})\//);
            currentLang = langMatch ? langMatch[1] : 'en';
        }
        
        let text = 'Loading';
        
        if (window.t && typeof window.t === 'function') {
            text = window.t('preloaderText') || 'Loading';
        } else {
            const translations = {
                'en': 'Loading', 'ru': 'Загрузка', 'ua': 'Завантаження',
                'pl': 'Ładowanie', 'cs': 'Načítání', 'sk': 'Načítanie',
                'bg': 'Зареждане', 'hr': 'Učitavanje', 'sr': 'Учитавање',
                'bs': 'Učitavanje', 'mk': 'Вчитување', 'sl': 'Nalaganje'
            };
            text = translations[currentLang] || 'Loading';
        }
        
        preloaderText.innerHTML = `${text}<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>`;
    }

    getLoadingTexts() {
        let currentLang = window.currentLang;
        if (!currentLang) {
            const path = window.location.pathname;
            const langMatch = path.match(/\/([a-z]{2})\//);
            currentLang = langMatch ? langMatch[1] : 'en';
        }
        
        const translations = {
            'en': ['Initializing...', 'Loading modules...', 'Security check...', 'Preparing interface...', 'Almost ready...'],
            'ru': ['Инициализация...', 'Загрузка модулей...', 'Проверка безопасности...', 'Подготовка интерфейса...', 'Почти готово...'],
            'ua': ['Ініціалізація...', 'Завантаження модулів...', 'Перевірка безпеки...', 'Підготовка інтерфейсу...', 'Майже готово...'],
            'pl': ['Inicjalizacja...', 'Ładowanie modułów...', 'Sprawdzanie bezpieczeństwa...', 'Przygotowanie interfejsu...', 'Prawie gotowe...'],
            'cs': ['Inicializace...', 'Načítání modulů...', 'Kontrola zabezpečení...', 'Příprava rozhraní...', 'Téměř hotovo...'],
            'sk': ['Inicializácia...', 'Načítavanie modulov...', 'Kontrola zabezpečenia...', 'Príprava rozhrania...', 'Takmer hotovo...'],
            'bg': ['Инициализация...', 'Зареждане на модули...', 'Проверка за сигурност...', 'Подготовка на интерфейс...', 'Почти готово...'],
            'hr': ['Inicijalizacija...', 'Učitavanje modula...', 'Sigurnosna provjera...', 'Priprema sučelja...', 'Gotovo spremno...'],
            'sr': ['Иницијализација...', 'Учитавање модула...', 'Безбедносна провера...', 'Припрема интерфејса...', 'Скоро готово...'],
            'bs': ['Inicijalizacija...', 'Učitavanje modula...', 'Sigurnosna provjera...', 'Priprema sučelja...', 'Gotovo spremno...'],
            'mk': ['Иницијализација...', 'Вчитување модули...', 'Безбедносна проверка...', 'Подготовка на интерфејс...', 'Речиси готово...'],
            'sl': ['Inicializacija...', 'Nalaganje modulov...', 'Varnostno preverjanje...', 'Priprava vmesnika...', 'Skoraj pripravljeno...']
        };
        
        return translations[currentLang] || translations['en'];
    }

    startLoading() {
        let progress = 0;
        const totalDuration = 2500;
        const updateInterval = 16;
        
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        const startTime = Date.now();
        
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.textInterval) clearInterval(this.textInterval);
        
        this.progressInterval = setInterval(() => {
            if (this.isHidden) return;
            
            const elapsed = Date.now() - startTime;
            const normalizedTime = Math.min(elapsed / totalDuration, 1);
            progress = easeOutQuart(normalizedTime) * 100;
            
            if (normalizedTime >= 1) {
                progress = 100;
                clearInterval(this.progressInterval);
                this.progressInterval = null;
                
                setTimeout(() => {
                    this.hidePreloader();
                }, 300);
            }
            
            this.updateProgress(progress);
        }, updateInterval);

        const loadingTexts = this.getLoadingTexts();
        const textUpdateInterval = totalDuration / loadingTexts.length;

        let textIndex = 0;
        this.textInterval = setInterval(() => {
            if (this.isHidden) {
                clearInterval(this.textInterval);
                return;
            }
            
            if (textIndex < loadingTexts.length) {
                this.updateStatusText(loadingTexts[textIndex]);
                textIndex++;
            } else {
                clearInterval(this.textInterval);
                this.textInterval = null;
            }
        }, textUpdateInterval);
    }

    updateProgress(progress) {
        const progressBar = document.getElementById('preloaderProgressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar && !this.isHidden) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText && !this.isHidden) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }

    updateStatusText(text) {
        const statusElement = document.getElementById('loadingStatus');
        if (statusElement && !this.isHidden) {
            statusElement.innerHTML = `<span>${text}</span>`;
        }
    }

    hidePreloader() {
        if (this.isHidden || !this.preloader) return;
        
        this.isHidden = true;
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        if (this.textInterval) {
            clearInterval(this.textInterval);
            this.textInterval = null;
        }
        
        if (this.lottieAnimation) {
            this.lottieAnimation.destroy();
            this.lottieAnimation = null;
        }
        
        this.preloader.classList.add('fade-out');
        
        setTimeout(() => {
            if (this.preloader && this.preloader.remove) {
                this.preloader.remove();
            }
            this.onComplete();
        }, 400);
    }

    onComplete() {
        const event = new CustomEvent('preloaderComplete');
        document.dispatchEvent(event);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const lastShown = sessionStorage.getItem('preloaderLastShown');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    const shouldShowPreloader = !lastShown || (now - parseInt(lastShown)) > fiveMinutes;
    
    if (shouldShowPreloader) {
        window.modernPreloader = new ModernPreloader();
        sessionStorage.setItem('preloaderLastShown', now.toString());
    }
});

window.resetPreloader = function() {
    sessionStorage.removeItem('preloaderLastShown');
    if (window.modernPreloader && window.modernPreloader.preloader) {
        window.modernPreloader.hidePreloader();
    }
};

window.showPreloader = function() {
    if (window.modernPreloader && window.modernPreloader.preloader) {
        window.modernPreloader.hidePreloader();
    }
    window.modernPreloader = new ModernPreloader();
};

window.ModernPreloader = ModernPreloader;
