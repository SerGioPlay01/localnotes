// Система управления темами
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    // Инициализация системы тем
    init() {
        console.log('ThemeManager: Initializing with theme:', this.currentTheme);
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.createThemeModal();
        this.setupEventListeners();
    }

    // Получение сохраненной темы
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    // Получение системной темы
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }

    // Применение темы
    applyTheme(theme) {
        console.log('ThemeManager: Applying theme:', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Для автоматической темы определяем актуальную тему
        let actualTheme = theme;
        if (theme === 'auto') {
            actualTheme = this.getSystemTheme();
            console.log('ThemeManager: Auto theme resolved to:', actualTheme);
        }
        
        document.documentElement.setAttribute('data-theme', actualTheme);
        console.log('ThemeManager: Set data-theme to:', actualTheme);
        
        // Обновление иконки переключателя
        this.updateThemeIcon();
        
        // Обновление активной опции в модальном окне
        this.updateActiveThemeOption();
        
        // Обновление темы TinyMCE редактора
        if (typeof updateTinyMCETheme === 'function') {
            setTimeout(() => {
                updateTinyMCETheme();
            }, 100);
        }
    }

    // Создание кнопки переключения тем
    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.id = 'themeToggle';
        toggle.innerHTML = '<span class="theme-icon">🌙</span>';
        toggle.title = 'Переключить тему';
        
        document.body.appendChild(toggle);
    }

    // Создание модального окна выбора темы
    createThemeModal() {
        const modal = document.createElement('div');
        modal.className = 'theme-modal';
        modal.id = 'themeModal';
        
        modal.innerHTML = `
            <div class="theme-modal-content">
                <h3 style="margin-bottom: 20px; color: var(--text-color);">Выберите тему</h3>
                <div class="theme-option" data-theme="light">
                    <div>
                        <div class="theme-name">Светлая</div>
                        <div class="theme-description">Классическая светлая тема</div>
                    </div>
                    <span class="theme-icon">☀️</span>
                </div>
                <div class="theme-option" data-theme="dark">
                    <div>
                        <div class="theme-name">Темная</div>
                        <div class="theme-description">Современная темная тема</div>
                    </div>
                    <span class="theme-icon">🌙</span>
                </div>
                <div class="theme-option" data-theme="auto">
                    <div>
                        <div class="theme-name">Авто</div>
                        <div class="theme-description">Следует системным настройкам</div>
                    </div>
                    <span class="theme-icon">🔄</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Клик по кнопке переключения
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.showThemeModal();
        });

        // Клик по опциям темы
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.hideThemeModal();
            });
        });

        // Клик вне модального окна для закрытия с поддержкой Pointer Events
        document.getElementById('themeModal').addEventListener('pointerdown', (e) => {
            if (e.target.id === 'themeModal') {
                this.hideThemeModal();
            }
        });
        
        // Fallback для старых браузеров
        document.getElementById('themeModal').addEventListener('click', (e) => {
            if (e.target.id === 'themeModal') {
                this.hideThemeModal();
            }
        });

        // Отслеживание изменений системной темы
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    // Принудительно обновляем тему при изменении системных настроек
                    const actualTheme = this.getSystemTheme();
                    document.documentElement.setAttribute('data-theme', actualTheme);
                }
            });
        }

        // Обработка клавиши Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideThemeModal();
            }
        });
    }

    // Показать модальное окно выбора темы
    showThemeModal() {
        document.getElementById('themeModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Скрыть модальное окно выбора темы
    hideThemeModal() {
        document.getElementById('themeModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Обновление иконки переключателя
    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle .theme-icon');
        if (!icon) return;

        switch (this.currentTheme) {
            case 'light':
                icon.textContent = '☀️';
                break;
            case 'dark':
                icon.textContent = '🌙';
                break;
            case 'auto':
                icon.textContent = '🔄';
                break;
        }
    }

    // Обновление активной опции в модальном окне
    updateActiveThemeOption() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    // Переключение на следующую тему
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.applyTheme(themes[nextIndex]);
    }

    // Получение текущей темы
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Проверка, является ли тема темной
    isDarkTheme() {
        if (this.currentTheme === 'dark') return true;
        if (this.currentTheme === 'light') return false;
        if (this.currentTheme === 'auto') {
            return !window.matchMedia('(prefers-color-scheme: light)').matches;
        }
        return true; // по умолчанию темная
    }

    // Проверка, является ли тема светлой
    isLightTheme() {
        if (this.currentTheme === 'light') return true;
        if (this.currentTheme === 'dark') return false;
        if (this.currentTheme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: light)').matches;
        }
        return false; // по умолчанию не светлая
    }
}

// Инициализация системы тем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
