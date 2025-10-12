// Современный прелоадер с анимированным замком и шифром

class ModernPreloader {
    constructor() {
        this.preloader = null;
        this.particles = [];
        this.cipherChars = ['A', 'E', 'S', '2', '5', '6'];
        this.init();
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
            const currentLang = window.currentLang || 'en';
            let text = 'Loading';
            
            if (currentLang === 'ru') {
                text = 'Загрузка';
            } else if (currentLang === 'ua') {
                text = 'Завантаження';
            } else if (currentLang === 'pl') {
                text = 'Ładowanie';
            } else if (currentLang === 'cs') {
                text = 'Načítání';
            } else if (currentLang === 'sk') {
                text = 'Načítanie';
            } else if (currentLang === 'bg') {
                text = 'Зареждане';
            } else if (currentLang === 'hr') {
                text = 'Učitavanje';
            } else if (currentLang === 'sr') {
                text = 'Учитавање';
            } else if (currentLang === 'bs') {
                text = 'Učitavanje';
            } else if (currentLang === 'mk') {
                text = 'Вчитување';
            } else if (currentLang === 'sl') {
                text = 'Nalaganje';
            }
            
            preloaderText.innerHTML = `${text}<span class="loading-dots">...</span>`;
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
        const loadingTexts = [
            'Инициализация шифрования...',
            'Загрузка модулей...',
            'Проверка безопасности...',
            'Подготовка интерфейса...',
            'Завершение загрузки...'
        ];

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