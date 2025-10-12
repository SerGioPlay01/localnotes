// Управление селекторами языка и темы в футере
class FooterSelectors {
    constructor() {
        this.languages = {
            'en': { name: 'English', flag: '🇺🇸' },
            'ru': { name: 'Русский', flag: '🇷🇺' },
            'ua': { name: 'Українська', flag: '🇺🇦' },
            'pl': { name: 'Polski', flag: '🇵🇱' },
            'cs': { name: 'Čeština', flag: '🇨🇿' },
            'sk': { name: 'Slovenčina', flag: '🇸🇰' },
            'bg': { name: 'Български', flag: '🇧🇬' },
            'hr': { name: 'Hrvatski', flag: '🇭🇷' },
            'sr': { name: 'Српски', flag: '🇷🇸' },
            'bs': { name: 'Bosanski', flag: '🇧🇦' },
            'mk': { name: 'Македонски', flag: '🇲🇰' },
            'sl': { name: 'Slovenščina', flag: '🇸🇮' }
        };
        
        this.themes = {
            'light': { name: 'Light', icon: '☀️' },
            'dark': { name: 'Dark', icon: '🌙' },
            'auto': { name: 'Auto', icon: '🔄' }
        };
        
        this.init();
    }
    
    init() {
        this.createLanguageSelector();
        this.createThemeSelector();
        this.setupEventListeners();
    }
    
    // Создание селектора языка
    createLanguageSelector() {
        const currentLang = this.getCurrentLanguage();
        const selector = document.createElement('div');
        selector.className = 'footer-selector language-selector';
        selector.innerHTML = `
            <select id="languageSelect" title="Select Language">
                ${Object.entries(this.languages).map(([code, lang]) => 
                    `<option value="${code}" ${code === currentLang ? 'selected' : ''}>
                        ${lang.flag} ${lang.name}
                    </option>`
                ).join('')}
            </select>
        `;
        
        // Добавляем в футер
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.appendChild(selector);
        }
    }
    
    // Создание селектора темы
    createThemeSelector() {
        const currentTheme = this.getCurrentTheme();
        const selector = document.createElement('div');
        selector.className = 'footer-selector theme-selector';
        selector.innerHTML = `
            <select id="themeSelect" title="Select Theme">
                ${Object.entries(this.themes).map(([code, theme]) => 
                    `<option value="${code}" ${code === currentTheme ? 'selected' : ''}>
                        ${theme.icon} ${theme.name}
                    </option>`
                ).join('')}
            </select>
        `;
        
        // Добавляем в футер
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.appendChild(selector);
        }
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Селектор языка
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Селектор темы
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }
    }
    
    // Получение текущего языка
    getCurrentLanguage() {
        const path = window.location.pathname;
        const langMatch = path.match(/\/([a-z]{2})\//);
        return langMatch ? langMatch[1] : 'en';
    }
    
    // Получение текущей темы
    getCurrentTheme() {
        return localStorage.getItem('theme') || 'auto';
    }
    
    // Смена языка
    changeLanguage(langCode) {
        if (langCode === 'en') {
            window.location.href = '/';
        } else {
            window.location.href = `/${langCode}/`;
        }
    }
    
    // Смена темы
    changeTheme(themeCode) {
        if (window.themeManager) {
            window.themeManager.applyTheme(themeCode);
        } else {
            // Fallback если themeManager не доступен
            localStorage.setItem('theme', themeCode);
            document.documentElement.setAttribute('data-theme', themeCode);
        }
    }
    
    // Обновление селекторов (для динамического обновления)
    updateSelectors() {
        const currentLang = this.getCurrentLanguage();
        const currentTheme = this.getCurrentTheme();
        
        const languageSelect = document.getElementById('languageSelect');
        const themeSelect = document.getElementById('themeSelect');
        
        if (languageSelect) {
            languageSelect.value = currentLang;
        }
        
        if (themeSelect) {
            themeSelect.value = currentTheme;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.footerSelectors = new FooterSelectors();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterSelectors;
}
