// Современный прелоадер с анимированным замком и шифром

class ModernPreloader {
    constructor() {
        this.preloader = null;
        this.particles = [];
        // Инициализируем сразу без задержки
        this.init();
    }

    init() {
        this.createPreloaderHTML();
        this.startLoading();
    }

    createPreloaderHTML() {
        const preloaderHTML = `
            <style>
                @keyframes progressComplete {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0.3); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
                @keyframes progressPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
            </style>
            <div class="preloader" id="modernPreloader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background: #0a0a0a; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity 0.3s ease;">
                <div class="preloader-content" style="text-align: center; color: #ffffff;">
                    <div class="lottie-container" id="lottieContainer" style="width: 120px; height: 120px; margin: 0 auto 20px;">
                        <!-- Lottie animation will be loaded here -->
                    </div>
                    <div class="loading-text" style="font-size: 18px; margin-bottom: 20px;">
                        <span id="preloaderText">Loading<span class="loading-dots">...</span></span>
                    </div>
                    <div class="progress-container" style="width: 200px; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; margin: 0 auto; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);">
                        <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #4CAF50, #66bb6a, #81c784); border-radius: 3px; transition: width 0.3s ease; animation: progressPulse 2s ease-in-out infinite; box-shadow: 0 1px 3px rgba(76, 175, 80, 0.3); display: block; visibility: visible; opacity: 1;"></div>
                    </div>
                    <div class="progress-percentage" style="font-size: 14px; margin-top: 8px; font-weight: 500; color: #66bb6a; text-align: center; transition: transform 0.1s ease;">
                        <span id="progressText">0%</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
        this.preloader = document.getElementById('modernPreloader');
        
        
        // Загружаем Lottie анимацию
        this.loadLottieAnimation();
        
        // Обновляем текст прелоадера в зависимости от языка
        this.updatePreloaderText();
    }

    loadLottieAnimation() {
        
        // Проверяем, доступна ли библиотека Lottie
        if (typeof lottie === 'undefined') {
            console.warn('Preloader: Lottie library not loaded, using fallback');
            this.showFallbackAnimation();
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
        
        
        try {
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
            });
            
            this.lottieAnimation.addEventListener('loopComplete', () => {
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
            // Создаем простую CSS анимацию как fallback
            lottieContainer.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
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
        
        
        // Получаем переводы из системы переводов
        if (window.t && typeof window.t === 'function' && window.translations) {
            const texts = [
                window.t('preloaderInit') || 'Initializing encryption...',
                window.t('preloaderModules') || 'Loading modules...',
                window.t('preloaderSecurity') || 'Security check...',
                window.t('preloaderInterface') || 'Preparing interface...',
                window.t('preloaderComplete') || 'Loading complete...'
            ];
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
            return result;
        }
    }


    startLoading() {
        // Оптимизированное время показа анимации
        let progress = 0;
        const totalDuration = 3000; // 3 секунды для более плавной анимации
        const updateInterval = 16; // обновляем каждые 16мс (60fps)
        
        // Используем easing функцию для более реалистичного прогресса
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        const startTime = Date.now();
        
        const loadingInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const normalizedTime = Math.min(elapsed / totalDuration, 1);
            
            // Применяем easing для более реалистичного прогресса
            progress = easeOutQuart(normalizedTime) * 100;
            
            if (normalizedTime >= 1) {
                progress = 100;
                clearInterval(loadingInterval);
                // Небольшая задержка перед скрытием для завершения анимации
                setTimeout(() => {
                    this.hidePreloader();
                }, 200);
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
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            // Плавное обновление ширины с анимацией
            progressBar.style.width = `${progress}%`;
            
            // Принудительно применяем стили для гарантии отображения
            progressBar.style.display = 'block';
            progressBar.style.visibility = 'visible';
            progressBar.style.opacity = '1';
            
            // Добавляем пульсацию при достижении 100%
            if (progress >= 100) {
                progressBar.style.animation = 'progressComplete 0.5s ease-in-out';
                progressBar.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
            }
        }
        
        if (progressText) {
            // Обновляем текст процентов
            progressText.textContent = `${Math.round(progress)}%`;
            
            // Добавляем анимацию для процентов
            progressText.style.transform = 'scale(1.1)';
            setTimeout(() => {
                progressText.style.transform = 'scale(1)';
            }, 100);
        }
    }

    updateLoadingText(text) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            // Убираем анимацию opacity, обновляем текст сразу
            loadingText.innerHTML = `${text}<span class="loading-dots">...</span>`;
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
    
    // Проверяем, нужно ли показывать прелоадер
    // Показываем прелоадер если:
    // 1. Это первая загрузка в сессии ИЛИ
    // 2. Прошло больше 5 минут с последнего показа ИЛИ
    // 3. Это обновление страницы (Ctrl+F5 или hard refresh)
    const lastShown = sessionStorage.getItem('preloaderLastShown');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    const shouldShowPreloader = !lastShown || 
                               (now - parseInt(lastShown)) > fiveMinutes ||
                               performance.navigation.type === 1; // TYPE_RELOAD
    
    if (shouldShowPreloader) {
        new ModernPreloader();
        sessionStorage.setItem('preloaderLastShown', now.toString());
    }
});

// Функция для принудительного сброса прелойдера (для тестирования)
window.resetPreloader = function() {
    sessionStorage.removeItem('preloaderLastShown');
};

// Функция для принудительного показа прелойдера
window.showPreloader = function() {
    new ModernPreloader();
};

// Экспорт для использования в других модулях
window.ModernPreloader = ModernPreloader;