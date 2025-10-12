// Общие утилиты для приложения
class AppUtils {
    constructor() {
        this.currentLang = this.getCurrentLanguage();
    }
    
    // Получение текущего языка
    getCurrentLanguage() {
        if (window.currentLang) {
            return window.currentLang;
        }
        
        const path = window.location.pathname;
        const langMatch = path.match(/\/([a-z]{2})\//);
        return langMatch ? langMatch[1] : 'en';
    }
    
    // Установка года в футере
    setCurrentYear() {
        const yearSpan = document.getElementById("currentYear");
        if (yearSpan) {
            const currentYear = new Date().getFullYear();
            yearSpan.textContent = currentYear;
        }
    }
    
    // Обновление текста кнопки переключения вида
    updateToggleViewButton() {
        const btn = document.getElementById("toggleViewButton");
        if (!btn) return;
        
        const currentLang = this.getCurrentLanguage();
        const notesContainer = document.getElementById("notesContainer");
        const isFullWidth = notesContainer && notesContainer.classList.contains("full-width-view");
        
        if (isFullWidth) {
            if (currentLang.startsWith("ru")) {
                btn.innerHTML = '<i class="fas fa-list"></i> Переключить на сетку';
            } else {
                btn.innerHTML = '<i class="fas fa-list"></i> Switch to grid view';
            }
        } else {
            if (currentLang.startsWith("ru")) {
                btn.innerHTML = '<i class="fas fa-th"></i> Изменение способа отображения заметок';
            } else {
                btn.innerHTML = '<i class="fas fa-th"></i> Changing the way notes are displayed';
            }
        }
    }
    
    // Переключение вида заметок
    toggleNotesView() {
        const notesContainer = document.getElementById("notesContainer");
        if (!notesContainer) return;
        
        const isFullWidth = notesContainer.classList.contains("full-width-view");
        notesContainer.classList.toggle("full-width-view");
        notesContainer.classList.toggle("default-view");
        
        // Обновляем текст кнопки
        this.updateToggleViewButton();
        
        console.log("Toggle view clicked - classes toggled, was:", isFullWidth, "now:", !isFullWidth);
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Обработчик для кнопки переключения вида
        const toggleBtn = document.getElementById("toggleViewButton");
        if (toggleBtn) {
            // Основной обработчик с поддержкой Pointer Events
            toggleBtn.addEventListener("pointerdown", () => {
                this.toggleNotesView();
            });
            
            // Fallback для старых браузеров
            toggleBtn.addEventListener("click", () => {
                this.toggleNotesView();
            });
        }
    }
    
    // Инициализация при загрузке страницы
    init() {
        this.setCurrentYear();
        this.updateToggleViewButton();
        this.initEventListeners();
        
        console.log("AppUtils initialized with language:", this.currentLang);
    }
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", function() {
    window.appUtils = new AppUtils();
    window.appUtils.init();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppUtils;
}
