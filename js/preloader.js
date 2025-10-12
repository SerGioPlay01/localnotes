// Современный прелоадер с анимированным замком и шифром

class ModernPreloader {
    constructor() {
        this.preloader = null;
        this.particles = [];
        this.cipherChars = ['A', 'E', 'S', '2', '5', '6'];
        // Задержка для инициализации, чтобы система переводов успела загрузиться
        setTimeout(() => {
            this.init();
        }, 100);
    }

    init() {
        this.createPreloaderHTML();
        this.createParticles();
        this.startLoading();
    }

    createPreloaderHTML() {
        const preloaderHTML = `
            <div class="preloader" id="modernPreloader">
                <div class="particles" id="particles"></div>
                <div class="preloader-content">
                    <div class="lock-container">
                        <div class="lock-body">
                            <div class="lock-shackle"></div>
                            <div class="lock-keyhole"></div>
                        </div>
                    </div>
                    <div class="cipher-container" id="cipherContainer">
                        ${this.cipherChars.map((char, index) => 
                            `<div class="cipher-char" style="--delay: ${index}">${char}</div>`
                        ).join('')}
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
        
        // Обновляем текст прелоадера в зависимости от языка
        this.updatePreloaderText();
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

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        
        for (let i = 0; i < 9; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particlesContainer.appendChild(particle);
        }
    }

    startLoading() {
        // Симуляция загрузки
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                this.hidePreloader();
            }
            
            this.updateProgress(progress);
        }, 200);

        // Обновление текста загрузки
        const loadingTexts = this.getLoadingTexts();

        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < loadingTexts.length) {
                this.updateLoadingText(loadingTexts[textIndex]);
                textIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 800);
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
            setTimeout(() => {
                loadingText.innerHTML = `${text}<span class="loading-dots">...</span>`;
                loadingText.style.opacity = '1';
            }, 200);
        }
    }

    hidePreloader() {
        if (this.preloader) {
            this.preloader.classList.add('fade-out');
            
            setTimeout(() => {
                this.preloader.remove();
                this.onComplete();
            }, 500);
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
    const shouldShowPreloader = !sessionStorage.getItem('preloaderShown');
    
    if (shouldShowPreloader) {
        new ModernPreloader();
        sessionStorage.setItem('preloaderShown', 'true');
    }
});

// Экспорт для использования в других модулях
window.ModernPreloader = ModernPreloader;