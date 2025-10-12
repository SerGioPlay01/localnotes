// Современный прелоадер с анимированным замком и шифром

class ModernPreloader {
    constructor() {
        console.log('Preloader: Constructor called');
        this.preloader = null;
        this.particles = [];
        // Инициализируем сразу без задержки
        console.log('Preloader: Starting initialization');
        this.init();
    }

    init() {
        console.log('Preloader: init() called');
        this.createPreloaderHTML();
        this.startLoading();
    }

    createPreloaderHTML() {
        console.log('Preloader: createPreloaderHTML() called');
        const preloaderHTML = `
            <div class="preloader" id="modernPreloader">
                <div class="preloader-content">
                    <div class="lottie-container" id="lottieContainer">
                        <!-- Lottie animation will be loaded here -->
                    </div>
                    <div class="loading-text">
                        <span id="preloaderText">Loading<span class="loading-dots">...</span></span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        this.preloader = document.getElementById('modernPreloader');
        
        console.log('Preloader: HTML created, preloader element:', this.preloader);
        
        // Показываем прелойдер сразу
        if (this.preloader) {
            this.preloader.style.display = 'flex';
            this.preloader.style.opacity = '1';
        }
        
        // Загружаем Lottie анимацию
        this.loadLottieAnimation();
        
        // Обновляем текст прелоадера в зависимости от языка
        this.updatePreloaderText();
    }

    loadLottieAnimation() {
        console.log('Preloader: Loading Lottie animation');
        
        // Проверяем, доступна ли библиотека Lottie
        if (typeof lottie === 'undefined') {
            console.error('Preloader: Lottie library not loaded');
            return;
        }
        
        const lottieContainer = document.getElementById('lottieContainer');
        if (!lottieContainer) {
            console.error('Preloader: Lottie container not found');
            return;
        }
        
        // Определяем путь к анимации в зависимости от текущей страницы
        const isLanguagePage = window.location.pathname.match(/^\/([a-z]{2})\//);
        const animationPath = isLanguagePage ? '../lottiesnimstion/password_security.json' : '/lottiesnimstion/password_security.json';
        
        console.log('Preloader: Loading animation from:', animationPath);
        
        // Загружаем и запускаем анимацию
        this.lottieAnimation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationPath
        });
        
        // Обработчики событий анимации
        this.lottieAnimation.addEventListener('complete', () => {
            console.log('Preloader: Lottie animation completed');
        });
        
        this.lottieAnimation.addEventListener('loopComplete', () => {
            console.log('Preloader: Lottie animation loop completed');
        });
        
        console.log('Preloader: Lottie animation loaded successfully');
    }

    updatePreloaderText() {
        const preloaderText = document.getElementById('preloaderText');
        if (preloaderText) {
            // Определяем язык из URL или глобальной переменной
            let currentLang = window.currentLang;
            if (!currentLang) {
                const path = window.location.pathname;
                const langMatch = path.match(/\/([a-z]{2})\//);
                currentLang = langMatch ? langMatch[1] : 'en';
            }
            
            let text = 'Loading';
            
            // Получаем перевод из системы переводов
            if (window.t && typeof window.t === 'function' && window.translations) {
                text = window.t('preloaderText') || 'Loading';
                console.log('Preloader: Using t() for main text:', text);
            } else {
                // Fallback для случаев, когда система переводов еще не загружена
                const translations = {
                    'en': 'Loading',
                    'ru': 'Загрузка',
                    'ua': 'Завантаження',
                    'pl': 'Ładowanie',
                    'cs': 'Načítání',
                    'sk': 'Načítanie',
                    'bg': 'Зареждане',
                    'hr': 'Učitavanje',
                    'sr': 'Учитавање',
                    'bs': 'Učitavanje',
                    'mk': 'Вчитување',
                    'sl': 'Nalaganje'
                };
                text = translations[currentLang] || 'Loading';
                console.log('Preloader: Using fallback for main text:', text, 'for language:', currentLang);
            }
            
            preloaderText.innerHTML = `${text}<span class="loading-dots">...</span>`;
        }
    }

    getLoadingTexts() {
        // Определяем язык из URL или глобальной переменной
        let currentLang = window.currentLang;
        if (!currentLang) {
            const path = window.location.pathname;
            const langMatch = path.match(/\/([a-z]{2})\//);
            currentLang = langMatch ? langMatch[1] : 'en';
        }
        
        console.log('Preloader: Current language:', currentLang);
        
        // Получаем переводы из системы переводов
        if (window.t && typeof window.t === 'function' && window.translations) {
            const texts = [
                window.t('preloaderInit') || 'Initializing encryption...',
                window.t('preloaderModules') || 'Loading modules...',
                window.t('preloaderSecurity') || 'Security check...',
                window.t('preloaderInterface') || 'Preparing interface...',
                window.t('preloaderComplete') || 'Loading complete...'
            ];
            console.log('Preloader: Using t() function, texts:', texts);
            return texts;
        } else {
            // Fallback переводы для каждого языка
            const translations = {
                'en': [
                    'Initializing encryption...',
                    'Loading modules...',
                    'Security check...',
                    'Preparing interface...',
                    'Loading complete...'
                ],
                'ru': [
                    'Инициализация шифрования...',
                    'Загрузка модулей...',
                    'Проверка безопасности...',
                    'Подготовка интерфейса...',
                    'Завершение загрузки...'
                ],
                'ua': [
                    'Ініціалізація шифрування...',
                    'Завантаження модулів...',
                    'Перевірка безпеки...',
                    'Підготовка інтерфейсу...',
                    'Завершення завантаження...'
                ],
                'pl': [
                    'Inicjalizacja szyfrowania...',
                    'Ładowanie modułów...',
                    'Sprawdzanie bezpieczeństwa...',
                    'Przygotowywanie interfejsu...',
                    'Kończenie ładowania...'
                ],
                'cs': [
                    'Inicializace šifrování...',
                    'Načítání modulů...',
                    'Kontrola bezpečnosti...',
                    'Příprava rozhraní...',
                    'Dokončování načítání...'
                ],
                'sk': [
                    'Inicializácia šifrovania...',
                    'Načítavanie modulov...',
                    'Kontrola bezpečnosti...',
                    'Príprava rozhrania...',
                    'Dokončovanie načítavania...'
                ],
                'bg': [
                    'Инициализиране на криптирането...',
                    'Зареждане на модули...',
                    'Проверка на сигурността...',
                    'Подготовка на интерфейса...',
                    'Завършване на зареждането...'
                ],
                'hr': [
                    'Inicijalizacija šifriranja...',
                    'Učitavanje modula...',
                    'Provjera sigurnosti...',
                    'Priprema sučelja...',
                    'Završavanje učitavanja...'
                ],
                'sr': [
                    'Иницијализација шифровања...',
                    'Учитавање модула...',
                    'Провера безбедности...',
                    'Припрема интерфејса...',
                    'Завршавање учитавања...'
                ],
                'bs': [
                    'Inicijalizacija šifriranja...',
                    'Učitavanje modula...',
                    'Provjera sigurnosti...',
                    'Priprema sučelja...',
                    'Završavanje učitavanja...'
                ],
                'mk': [
                    'Иницијализација на шифрирање...',
                    'Вчитување модули...',
                    'Проверка на безбедност...',
                    'Подготовка на интерфејс...',
                    'Завршување на вчитување...'
                ],
                'sl': [
                    'Inicializacija šifriranja...',
                    'Nalaganje modulov...',
                    'Preverjanje varnosti...',
                    'Priprava vmesnika...',
                    'Zaključevanje nalaganja...'
                ]
            };
            
            const result = translations[currentLang] || translations['en'];
            console.log('Preloader: Using fallback translations for', currentLang, ':', result);
            return result;
        }
    }


    startLoading() {
        // Увеличенное время показа анимации
        let progress = 0;
        const totalDuration = 4000; // 4 секунды
        const updateInterval = 16; // обновляем каждые 16мс (60fps)
        const progressStep = (100 / totalDuration) * updateInterval;
        
        const loadingInterval = setInterval(() => {
            progress += progressStep;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                // Скрываем прелойдер сразу без задержки
                this.hidePreloader();
            }
            
            this.updateProgress(progress);
        }, updateInterval);

        // Обновление текста загрузки
        const loadingTexts = this.getLoadingTexts();
        const textUpdateInterval = totalDuration / loadingTexts.length;

        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < loadingTexts.length) {
                this.updateLoadingText(loadingTexts[textIndex]);
                textIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, textUpdateInterval);
    }

    updateProgress(progress) {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    updateLoadingText(text) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.style.opacity = '0';
            // Убираем задержку, обновляем сразу
            setTimeout(() => {
                loadingText.innerHTML = `${text}<span class="loading-dots">...</span>`;
                loadingText.style.opacity = '1';
            }, 50);
        }
    }

    hidePreloader() {
        if (this.preloader) {
            // Останавливаем Lottie анимацию
            if (this.lottieAnimation) {
                this.lottieAnimation.destroy();
                this.lottieAnimation = null;
            }
            
            this.preloader.classList.add('fade-out');
            
            // Убираем задержку, скрываем сразу
            setTimeout(() => {
                this.preloader.remove();
                this.onComplete();
            }, 200);
        }
    }

    onComplete() {
        // Событие завершения загрузки
        const event = new CustomEvent('preloaderComplete');
        document.dispatchEvent(event);
    }
}

// Инициализация прелоадера
document.addEventListener('DOMContentLoaded', () => {
    console.log('Preloader: DOMContentLoaded event fired');
    
    // Проверяем, нужно ли показывать прелоадер
    const shouldShowPreloader = !sessionStorage.getItem('preloaderShown');
    
    console.log('Preloader: shouldShowPreloader =', shouldShowPreloader);
    console.log('Preloader: sessionStorage preloaderShown =', sessionStorage.getItem('preloaderShown'));
    
    if (shouldShowPreloader) {
        console.log('Preloader: Creating new ModernPreloader instance');
        new ModernPreloader();
        sessionStorage.setItem('preloaderShown', 'true');
    } else {
        console.log('Preloader: Skipping preloader (already shown in this session)');
    }
});

// Функция для принудительного сброса прелойдера (для тестирования)
window.resetPreloader = function() {
    console.log('Preloader: Resetting preloader');
    sessionStorage.removeItem('preloaderShown');
    console.log('Preloader: sessionStorage cleared, preloader will show on next page load');
};

// Функция для принудительного показа прелойдера
window.showPreloader = function() {
    console.log('Preloader: Manually showing preloader');
    new ModernPreloader();
};

// Экспорт для использования в других модулях
window.ModernPreloader = ModernPreloader;