// Адаптивная система определения устройств
class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMobile = this.currentBreakpoint === 'mobile';
        this.isTablet = this.currentBreakpoint === 'tablet';
        this.isDesktop = this.currentBreakpoint === 'desktop';
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.init();
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        return 'desktop';
    }
    
    init() {
        // Добавляем классы для устройств
        document.documentElement.classList.add(`${this.currentBreakpoint}-device`);
        if (this.isTouch) {
    document.documentElement.classList.add('touch-device');
}

        // Слушаем изменения размера окна
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Слушаем изменения ориентации
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }
    
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        if (newBreakpoint !== this.currentBreakpoint) {
            // Удаляем старый класс
            document.documentElement.classList.remove(`${this.currentBreakpoint}-device`);
            
            // Обновляем переменные
            this.currentBreakpoint = newBreakpoint;
            this.isMobile = this.currentBreakpoint === 'mobile';
            this.isTablet = this.currentBreakpoint === 'tablet';
            this.isDesktop = this.currentBreakpoint === 'desktop';
            
            // Добавляем новый класс
            document.documentElement.classList.add(`${this.currentBreakpoint}-device`);
            
            // Обновляем редактор при изменении размера
            this.updateEditorLayout();
        }
    }
    
    handleOrientationChange() {
        // Небольшая задержка для корректного определения размеров
        setTimeout(() => {
            this.handleResize();
        }, 100);
    }
    
    updateEditorLayout() {
        if (tinymceEditor && !tinymceEditor.destroyed) {
            // Обновляем настройки редактора в зависимости от размера экрана
            const newToolbar = this.getToolbarForBreakpoint();
            const newToolbarMode = this.getToolbarModeForBreakpoint();
            const newMenubar = this.getMenubarForBreakpoint();
            const fullscreenSettings = this.getFullscreenSettings();
            
            // Проверяем, что TinyMCE редактор существует
            if (tinymceEditor && tinymceEditor.settings) {
                tinymceEditor.settings.toolbar = newToolbar;
                tinymceEditor.settings.toolbar_mode = newToolbarMode;
                tinymceEditor.settings.menubar = newMenubar;
                tinymceEditor.settings.resize = this.isDesktop;
                tinymceEditor.settings.elementpath = this.isDesktop;
                tinymceEditor.settings.height = fullscreenSettings.height;
                tinymceEditor.settings.width = fullscreenSettings.width;
                tinymceEditor.settings.menubar_height = fullscreenSettings.menubar_height;
                tinymceEditor.settings.toolbar_height = fullscreenSettings.toolbar_height;
            }
            
            // Применяем адаптивные стили меню
            this.applyMenuStyles();
            
            // Применяем полноэкранные стили
            this.applyFullscreenStyles();
            
            // Перезагружаем редактор с новыми настройками
            const currentContent = tinymceEditor.getContent();
            tinymceEditor.destroy();
            
            setTimeout(() => {
                initTinyMCE();
                if (tinymceEditor && currentContent) {
                    tinymceEditor.setContent(currentContent);
                }
                // Повторно применяем стили после перезагрузки
                setTimeout(() => {
                    this.applyMenuStyles();
                    this.applyFullscreenStyles();
                }, 200);
            }, 100);
        }
    }
    
    getToolbarForBreakpoint() {
        if (this.isMobile || this.isTouch) {
            // Для touch-устройств создаем одну длинную строку с прокруткой - ВСЕ функции
            return 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough superscript subscript | ' +
                   'alignleft aligncenter alignright alignjustify | outdent indent | ' +
                   'numlist bullist | forecolor backcolor removeformat | charmap emoticons | ' +
                   'link image media table | mceInsertTableSimple | mceInsertTableCustom | code | help | fullscreen preview | insertfile anchor codesample | ' +
                   'ltr rtl | pagebreak | visualblocks visualchars | searchreplace | wordcount';
        } else if (this.isTablet) {
            return 'undo redo | blocks fontfamily fontsize | bold italic underline | alignleft aligncenter alignright | numlist bullist | forecolor backcolor | charmap emoticons | link image media table | mceInsertTableSimple | mceInsertTableCustom | code | help';
        } else {
            return 'undo redo | blocks fontfamily fontsize | ' +
                   'bold italic underline strikethrough superscript subscript | ' +
                   'alignleft aligncenter alignright alignjustify | ' +
                   'outdent indent | numlist bullist | ' +
                   'forecolor backcolor removeformat | ' +
                   'pagebreak | charmap emoticons | ' +
                   'fullscreen preview | insertfile image media link anchor codesample table | mceInsertTableSimple | mceInsertTableCustom | ' +
                   'ltr rtl | code | help';
        }
    }
    
    getToolbarModeForBreakpoint() {
        if (this.isMobile || this.isTouch) {
            return 'wrap'; // Для touch-устройств используем wrap для горизонтальной прокрутки
        } else if (this.isTablet) {
            return 'wrap';
        } else {
            return 'floating';
        }
    }
    
    getEventType() {
        // Используем современный Pointer Events API
        if (pointerManager) {
            return pointerManager.getEventType();
        }
        // Fallback для старых браузеров
        return this.isTouch ? 'touchstart' : 'click';
    }
    
    getMenubarForBreakpoint() {
        if (this.isMobile) {
            return 'file edit view insert format tools'; // Показываем упрощенное меню на мобильных
        } else if (this.isTablet) {
            return 'file edit view insert format tools'; // Упрощенное меню для планшетов
        } else {
            return 'file edit view insert format tools table help'; // Полное меню для десктопа
        }
    }
    
    getFullscreenSettings() {
        // Вычисляем общую высоту хедера и навигации с дополнительным отступом
        const headerHeight = 100; // .info-app height
        const navHeight = 80; // .center_nav approximate height (20px padding * 2 + content)
        const extraMargin = 40; // Дополнительный отступ для предотвращения перекрытия
        const totalHeaderHeight = headerHeight + navHeight + extraMargin;
        
        return {
            height: `calc(100vh - ${totalHeaderHeight}px)`,
            width: '100vw',
            menubar_height: 40,
            toolbar_height: 50,
            statusbar_height: 30,
            header_offset: totalHeaderHeight
        };
    }
    
    applyMenuStyles() {
        // Применяем адаптивные стили к меню
        const menubar = document.querySelector('.tox .tox-menubar');
        if (menubar) {
            // Добавляем классы для адаптивности
            menubar.classList.remove('mobile-menu', 'tablet-menu', 'desktop-menu');
            
            if (this.isMobile) {
                menubar.classList.add('mobile-menu');
            } else if (this.isTablet) {
                menubar.classList.add('tablet-menu');
            } else {
                menubar.classList.add('desktop-menu');
            }
            
            // Применяем стили в зависимости от темы
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            this.updateMenuTheme(menubar, currentTheme);
        }
    }
    
    updateMenuTheme(menubar, theme) {
        if (!menubar) return;
        
        if (theme === 'light') {
            menubar.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
            menubar.style.borderBottom = '1px solid #dee2e6';
        } else {
            menubar.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)';
            menubar.style.borderBottom = '1px solid #404040';
        }
        
        // Обновляем стили пунктов меню
        const menuItems = menubar.querySelectorAll('.tox-mbtn');
        menuItems.forEach(item => {
            if (theme === 'light') {
                item.style.color = '#212529';
                item.style.borderRadius = '4px';
                item.style.transition = 'all 0.2s ease';
            } else {
                item.style.color = '#ffffff';
                item.style.borderRadius = '4px';
                item.style.transition = 'all 0.2s ease';
            }
            
            // Добавляем hover эффекты с поддержкой Pointer Events
            item.addEventListener('pointerenter', () => {
                if (theme === 'light') {
                    item.style.background = 'rgba(0, 0, 0, 0.05)';
                } else {
                    item.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            item.addEventListener('pointerleave', () => {
                item.style.background = 'transparent';
            });
            
            // Fallback для старых браузеров
            item.addEventListener('mouseenter', () => {
                if (theme === 'light') {
                    item.style.background = 'rgba(0, 0, 0, 0.05)';
                } else {
                    item.style.background = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
        });
    }
    
    applyFullscreenStyles() {
        // Применяем полноэкранные стили к редактору
        const editorContainer = document.querySelector('.tox-tinymce');
        if (editorContainer) {
            // Добавляем класс для полноэкранного режима
            editorContainer.classList.add('fullscreen-editor');
            
            // Применяем стили в зависимости от размера экрана
            if (this.isMobile) {
                editorContainer.style.setProperty('--menubar-height', '50px'); // Показываем меню на мобильных
                editorContainer.style.setProperty('--toolbar-height', '60px');
                editorContainer.style.setProperty('--statusbar-height', '30px');
                editorContainer.style.setProperty('--header-offset', '200px');
            } else if (this.isTablet) {
                editorContainer.style.setProperty('--menubar-height', '35px');
                editorContainer.style.setProperty('--toolbar-height', '45px');
                editorContainer.style.setProperty('--statusbar-height', '30px');
                editorContainer.style.setProperty('--header-offset', '190px');
            } else {
                editorContainer.style.setProperty('--menubar-height', '40px');
                editorContainer.style.setProperty('--toolbar-height', '50px');
                editorContainer.style.setProperty('--statusbar-height', '30px');
                editorContainer.style.setProperty('--header-offset', '180px');
            }
        }
        
        // Применяем стили к контейнеру TinyMCE
        const tinymceContainer = document.querySelector('.tinymce');
        if (tinymceContainer) {
            tinymceContainer.classList.add('fullscreen-container');
            
            // Применяем отступы в зависимости от размера экрана
            if (this.isMobile) {
                tinymceContainer.style.marginTop = '240px';
                tinymceContainer.style.height = 'calc(100vh - 240px)';
            } else if (this.isTablet) {
                tinymceContainer.style.marginTop = '230px';
                tinymceContainer.style.height = 'calc(100vh - 230px)';
            } else {
                tinymceContainer.style.marginTop = '220px';
                tinymceContainer.style.height = 'calc(100vh - 220px)';
            }
        }
    }
    
    resetEditorStyles() {
        // Сбрасываем стили редактора для исправления проблем
        const editorContainer = document.querySelector('.tox-tinymce');
        if (editorContainer) {
            editorContainer.style.position = '';
            editorContainer.style.top = '';
            editorContainer.style.left = '';
            editorContainer.style.width = '';
            editorContainer.style.height = '';
            editorContainer.style.zIndex = '';
        }
        
        const tinymceContainer = document.querySelector('.tinymce');
        if (tinymceContainer) {
            tinymceContainer.style.position = '';
            tinymceContainer.style.top = '';
            tinymceContainer.style.left = '';
            tinymceContainer.style.width = '';
            tinymceContainer.style.height = '';
            tinymceContainer.style.zIndex = '';
        }
    }
}

// Утилита для работы с современными Pointer Events
class PointerEventManager {
    constructor() {
        this.pointerType = 'mouse'; // По умолчанию
        this.isTouchDevice = false;
        this.isPenDevice = false;
        this.init();
    }
    
    init() {
        // Определяем тип устройства при первом взаимодействии
        this.setupPointerEventListeners();
        
        // Fallback для старых браузеров
        this.setupLegacyDetection();
    }
    
    setupPointerEventListeners() {
        // Используем современный Pointer Events API
        const events = ['pointerdown', 'pointermove', 'pointerup'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                this.updatePointerType(event);
            }, { passive: true, once: false });
        });
    }
    
    updatePointerType(event) {
        if (event.pointerType) {
            this.pointerType = event.pointerType;
            this.isTouchDevice = event.pointerType === 'touch';
            this.isPenDevice = event.pointerType === 'pen';
        }
    }
    
    setupLegacyDetection() {
        // Fallback для браузеров без поддержки Pointer Events
        if (!window.PointerEvent) {
            // Проверяем поддержку touch
            this.isTouchDevice = 'ontouchstart' in window || 
                                navigator.maxTouchPoints > 0 || 
                                navigator.msMaxTouchPoints > 0;
            
            if (this.isTouchDevice) {
                this.pointerType = 'touch';
            }
        }
    }
    
    getEventType() {
        // Возвращаем оптимальный тип события для текущего устройства
        if (this.isTouchDevice) {
            return 'touchstart';
        } else if (this.isPenDevice) {
            return 'pointerdown';
        } else {
            return 'click';
        }
    }
    
    isTouch() {
        return this.isTouchDevice;
    }
    
    isPen() {
        return this.isPenDevice;
    }
    
    isMouse() {
        return this.pointerType === 'mouse';
    }
    
    getPointerType() {
        return this.pointerType;
    }
}

// Создаем экземпляр менеджера Pointer Events
const pointerManager = new PointerEventManager();

// Создаем экземпляр адаптивного менеджера
const responsiveManager = new ResponsiveManager();

// Обратная совместимость
const isMobile = responsiveManager.isMobile;
const isTouch = responsiveManager.isTouch || pointerManager.isTouch();

// Функция для инициализации обработчиков событий
function initializeEventListeners() {
    const eventType = pointerManager.getEventType();
    
    // Обработчик для кнопки добавления заметки
    const addNoteButton = document.getElementById("addNoteButton");
    if (addNoteButton) {
        addNoteButton.addEventListener(eventType, (e) => {
    e.preventDefault();
    openModal();
});
        console.log('addNoteButton event listener added');
    } else {
        console.error('addNoteButton element not found');
    }
    
    // Обработчик для кнопки импорта
    const importButton = document.getElementById("importButton");
    if (importButton) {
        importButton.addEventListener(eventType, (e) => {
    e.preventDefault();
            const importInput = document.getElementById("importInput");
            if (importInput) {
                importInput.click();
            }
        });
    } else {
        console.error('importButton element not found');
    }
    
    // Обработчик для поля импорта
    const importInput = document.getElementById("importInput");
    if (importInput) {
        importInput.addEventListener("change", importNotesWithFormat);
    }
    
    // Обработчик для поля поиска
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", debounce(filterNotes, 300));
    }
    
    // Обработчик для кнопки очистки всех заметок
    const clearAllButton = document.getElementById("clearAllButton");
    if (clearAllButton) {
        clearAllButton.addEventListener("click", () => {
            // Определяем сообщение подтверждения
            const confirmationMessage = t("confirmDeleteAll");
            
            showCustomPrompt(
                t("confirmDeleteAllTitle"),
                confirmationMessage,
                t("confirmDeleteAllPlaceholder"),
                (password) => {
                    if (password === "DELETE ALL") {
                        clearAllNotes();
                    } else {
                        showCustomAlert(t("error"), t("invalidPassword"), "error");
                    }
                }
            );
        });
    }
    
    console.log('All event listeners initialized');
}

// Функция для очистки всех заметок
async function clearAllNotes() {
    try {
        // Получаем все заметки и удаляем их
        const notes = await notesDB.getAllNotes();
        for (const note of notes) {
            await notesDB.deleteNote(note.id);
        }
        await loadNotes(); // Обновляет отображение заметок
        showCustomAlert(t("success"), t("allNotesDeleted"), "success");
    } catch (error) {
        console.error('Error clearing notes:', error);
        showCustomAlert(
            t("error"),
            t("errorClearingNotes"),
            "error"
        );
    }
}

// Получаем текущий язык системы (предполагаем, что это en или ru)
const currentLang = window.currentLang || navigator.language || navigator.userLanguage || 'en';

// Определяем параметры локализации для форматирования даты и времени
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};

// Получаем текущую локализацию
const locale = currentLang.startsWith("ru") ? "ru-RU" : "en-US"; // Русский или английский

// Функции для TinyMCE (определяем в начале для избежания ошибок)
function getTinyMCELanguage() {
    const currentLang = window.currentLang || navigator.language || 'en';
    const langMap = {
        'ru': 'ru',
        'ua': 'uk', 
        'pl': 'pl',
        'cs': 'cs',
        'bg': 'bg',
        'sr': 'sr',
        'hr': 'hr',
        'mk': 'mk',
        'bs': 'bs',
        'sl': 'sl',
        'sk': 'sk'
    };
    
    return langMap[currentLang] || 'en';
}

function getTinyMCETranslation(key) {
    const currentLang = window.currentLang || navigator.language || 'en';
    const translations = {
        'en': {
            'File': 'File',
            'Edit': 'Edit',
            'View': 'View',
            'Insert': 'Insert',
            'Format': 'Format',
            'Tools': 'Tools',
            'Table': 'Table',
            'Help': 'Help'
        },
        'ru': {
            'File': 'Файл',
            'Edit': 'Правка',
            'View': 'Вид',
            'Insert': 'Вставка',
            'Format': 'Формат',
            'Tools': 'Инструменты',
            'Table': 'Таблица',
            'Help': 'Справка'
        },
        'ua': {
            'File': 'Файл',
            'Edit': 'Правка',
            'View': 'Вид',
            'Insert': 'Вставка',
            'Format': 'Формат',
            'Tools': 'Інструменти',
            'Table': 'Таблиця',
            'Help': 'Довідка'
        },
        'pl': {
            'File': 'Plik',
            'Edit': 'Edycja',
            'View': 'Widok',
            'Insert': 'Wstaw',
            'Format': 'Format',
            'Tools': 'Narzędzia',
            'Table': 'Tabela',
            'Help': 'Pomoc'
        },
        'cs': {
            'File': 'Soubor',
            'Edit': 'Upravit',
            'View': 'Zobrazit',
            'Insert': 'Vložit',
            'Format': 'Formát',
            'Tools': 'Nástroje',
            'Table': 'Tabulka',
            'Help': 'Nápověda'
        },
        'bg': {
            'File': 'Файл',
            'Edit': 'Редактиране',
            'View': 'Изглед',
            'Insert': 'Вмъкване',
            'Format': 'Формат',
            'Tools': 'Инструменти',
            'Table': 'Таблица',
            'Help': 'Помощ'
        },
        'sr': {
            'File': 'Фајл',
            'Edit': 'Уређивање',
            'View': 'Приказ',
            'Insert': 'Уметање',
            'Format': 'Формат',
            'Tools': 'Алати',
            'Table': 'Табела',
            'Help': 'Помоћ'
        },
        'hr': {
            'File': 'Datoteka',
            'Edit': 'Uredi',
            'View': 'Prikaz',
            'Insert': 'Umetni',
            'Format': 'Format',
            'Tools': 'Alati',
            'Table': 'Tablica',
            'Help': 'Pomoć'
        },
        'mk': {
            'File': 'Датотека',
            'Edit': 'Уредување',
            'View': 'Приказ',
            'Insert': 'Вметнување',
            'Format': 'Формат',
            'Tools': 'Алатки',
            'Table': 'Табела',
            'Help': 'Помош'
        },
        'bs': {
            'File': 'Datoteka',
            'Edit': 'Uredi',
            'View': 'Prikaz',
            'Insert': 'Umetni',
            'Format': 'Format',
            'Tools': 'Alati',
            'Table': 'Tabela',
            'Help': 'Pomoć'
        },
        'sl': {
            'File': 'Datoteka',
            'Edit': 'Uredi',
            'View': 'Prikaz',
            'Insert': 'Vstavi',
            'Format': 'Oblika',
            'Tools': 'Orodja',
            'Table': 'Tabela',
            'Help': 'Pomoč'
        },
        'sk': {
            'File': 'Súbor',
            'Edit': 'Upraviť',
            'View': 'Zobraziť',
            'Insert': 'Vložiť',
            'Format': 'Formát',
            'Tools': 'Nástroje',
            'Table': 'Tabuľka',
            'Help': 'Pomocník'
        }
    };
    
    const langCode = currentLang.split('-')[0];
    return translations[langCode]?.[key] || translations['en'][key] || key;
}

function getTinyMCESkin() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    return currentTheme === 'light' ? 'oxide' : 'oxide-dark';
}

function getTinyMCEContentCSS() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    return currentTheme === 'light' ? 'default' : 'dark';
}

function getTinyMCEContentStyle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (currentTheme === 'light') {
        return `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; 
                font-size: 14px; 
                line-height: 1.6; 
                margin: 0; 
                padding: 20px; 
                background-color: #ffffff;
                color: #212529;
            }
            h1, h2, h3, h4, h5, h6 { color: #212529; }
            p { color: #212529; }
            a { color: #007bff; }
            blockquote { 
                border-left: 4px solid #007bff; 
                background-color: #f8f9fa; 
                color: #212529; 
                padding: 16px 20px; 
                margin: 16px 0; 
            }
            code { 
                background-color: #f8f9fa; 
                color: #e83e8c; 
                padding: 2px 4px; 
                border-radius: 3px; 
            }
            pre { 
                background-color: #f8f9fa; 
                color: #212529; 
                padding: 16px; 
                border-radius: 6px; 
                border: 1px solid #dee2e6; 
            }
        `;
    } else {
        return `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; 
                font-size: 14px; 
                line-height: 1.6; 
                margin: 0; 
                padding: 20px; 
                background-color: #1e1e1e;
                color: #ffffff;
            }
            h1, h2, h3, h4, h5, h6 { color: #ffffff; }
            p { color: #ffffff; }
            a { color: #58a6ff; }
            blockquote { 
                border-left: 4px solid #58a6ff; 
                background-color: #161b22; 
                color: #e6edf3; 
                padding: 16px 20px; 
                margin: 16px 0; 
            }
            code { 
                background-color: #0d1117; 
                color: #e6edf3; 
                padding: 2px 4px; 
                border-radius: 3px; 
                border: 1px solid #30363d; 
            }
            pre { 
                background-color: #0d1117; 
                color: #e6edf3; 
                padding: 16px; 
                border-radius: 6px; 
                border: 1px solid #30363d; 
            }
        `;
    }
}

// Улучшенная функция для мгновенного обновления темы TinyMCE
function updateTinyMCETheme() {
    if (tinymceEditor && !tinymceEditor.destroyed) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        try {
            // Мгновенное обновление CSS переменных в редакторе
            const editorContainer = tinymceEditor.getContainer();
            if (editorContainer) {
                // Обновляем стили контейнера
                editorContainer.style.setProperty('--editor-bg', currentTheme === 'light' ? '#ffffff' : '#1e1e1e');
                editorContainer.style.setProperty('--editor-text', currentTheme === 'light' ? '#212529' : '#ffffff');
                editorContainer.style.setProperty('--editor-toolbar-bg', currentTheme === 'light' ? '#f8f9fa' : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)');
                editorContainer.style.setProperty('--editor-toolbar-border', currentTheme === 'light' ? '#dee2e6' : '#404040');
            }
            
            // Обновляем iframe редактора
            const editorIframe = editorContainer?.querySelector('iframe');
            if (editorIframe && editorIframe.contentDocument) {
                const editorDoc = editorIframe.contentDocument;
                const editorBody = editorDoc.body;
                
                if (editorBody) {
                    // Применяем новые стили к телу редактора
                    editorBody.style.backgroundColor = currentTheme === 'light' ? '#ffffff' : '#1e1e1e';
                    editorBody.style.color = currentTheme === 'light' ? '#212529' : '#ffffff';
                    
                    // Обновляем стили для различных элементов
                    const style = editorDoc.createElement('style');
                    style.textContent = getTinyMCEContentStyle();
                    
                    // Удаляем старые стили
                    const oldStyle = editorDoc.querySelector('style[data-theme]');
                    if (oldStyle) {
                        oldStyle.remove();
                    }
                    
                    // Добавляем новые стили
                    style.setAttribute('data-theme', currentTheme);
                    editorDoc.head.appendChild(style);
                }
            }
            
            // Обновляем панель инструментов
            updateToolbarTheme(currentTheme);
            
            // Обновляем стили меню
            const menubar = document.querySelector('.tox .tox-menubar');
            if (menubar && responsiveManager) {
                responsiveManager.updateMenuTheme(menubar, currentTheme);
            }
            
            // Сохраняем тему в localStorage для восстановления после перезагрузки
            localStorage.setItem('editorTheme', currentTheme);
            
            console.log('TinyMCE theme updated instantly to:', currentTheme);
            
        } catch (error) {
            console.error('Error updating TinyMCE theme:', error);
            // Fallback к перезагрузке редактора
            fallbackThemeUpdate();
        }
    }
}

// Функция для обновления темы панели инструментов
function updateToolbarTheme(theme) {
    const toolbar = document.querySelector('.tox .tox-toolbar');
    if (toolbar) {
        if (theme === 'light') {
            toolbar.style.background = '#f8f9fa';
            toolbar.style.borderBottom = '1px solid #dee2e6';
        } else {
            toolbar.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
            toolbar.style.borderBottom = '1px solid #404040';
        }
    }
    
    // Обновляем кнопки
    const buttons = document.querySelectorAll('.tox .tox-tbtn');
    buttons.forEach(button => {
        if (theme === 'light') {
            button.style.color = '#212529';
        } else {
            button.style.color = '#ffffff';
        }
    });
}

// Fallback функция для перезагрузки редактора
function fallbackThemeUpdate() {
    if (tinymceEditor && !tinymceEditor.destroyed) {
        const currentContent = tinymceEditor.getContent();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        // Обновляем настройки
        tinymceEditor.settings.skin = getTinyMCESkin();
        tinymceEditor.settings.content_css = getTinyMCEContentCSS();
        tinymceEditor.settings.content_style = getTinyMCEContentStyle();
        
        // Перезагружаем редактор
        tinymceEditor.destroy();
        setTimeout(() => {
            initTinyMCE();
            if (tinymceEditor && currentContent) {
                tinymceEditor.setContent(currentContent);
            }
        }, 100);
    }
}

// Функция для принудительного обновления темы TinyMCE
function forceUpdateTinyMCETheme() {
    if (tinymceEditor) {
        // Принудительно обновляем CSS переменные в редакторе
        const editorIframe = tinymceEditor.getContainer().querySelector('iframe');
        if (editorIframe && editorIframe.contentDocument) {
            const editorDoc = editorIframe.contentDocument;
            const editorBody = editorDoc.body;
            
            // Обновляем стили в iframe
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            if (currentTheme === 'light') {
                editorBody.style.backgroundColor = '#ffffff';
                editorBody.style.color = '#212529';
            } else {
                editorBody.style.backgroundColor = '#1e1e1e';
                editorBody.style.color = '#ffffff';
            }
        }
    }
}

// Функция для восстановления темы редактора после перезагрузки
function restoreEditorTheme() {
    const savedTheme = localStorage.getItem('editorTheme');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    if (savedTheme && savedTheme !== currentTheme) {
        // Если сохраненная тема отличается от текущей, обновляем
        document.documentElement.setAttribute('data-theme', savedTheme);
        console.log('Restored editor theme from localStorage:', savedTheme);
    }
}

// Функция для генерации версии файлов (cache busting)
function generateFileVersion() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Функция для обновления ссылок на файлы с версией
function updateFileVersions() {
    const version = generateFileVersion();
    
    // Обновляем CSS файлы
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('?') && !href.includes('tinymce') && !href.includes('google')) {
            link.setAttribute('href', href + '?v=' + version);
        }
    });
    
    // Обновляем JS файлы
    const jsScripts = document.querySelectorAll('script[src]');
    jsScripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && !src.includes('?') && !src.includes('tinymce') && !src.includes('google')) {
            script.setAttribute('src', src + '?v=' + version);
        }
    });
    
    console.log('File versions updated with version:', version);
}

// Функция для очистки кеша браузера
function clearBrowserCache() {
    // Очищаем localStorage от устаревших данных
    const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('cache_') || key.startsWith('temp_')
    );
    cacheKeys.forEach(key => localStorage.removeItem(key));
    
    // Очищаем sessionStorage
    sessionStorage.clear();
    
    // Принудительно обновляем страницу без кеша
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                if (cacheName.includes('app-cache') || cacheName.includes('static-cache')) {
                    caches.delete(cacheName);
                }
            });
        });
    }
    
    console.log('Browser cache cleared');
}

// Функция для принудительного обновления ресурсов
function forceRefreshResources() {
    // Обновляем изображения
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.includes('?')) {
            img.setAttribute('src', src + '?v=' + generateFileVersion());
        }
    });
    
    // Обновляем фоновые изображения в CSS
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(element => {
        const style = element.getAttribute('style');
        if (style && style.includes('url(') && !style.includes('?')) {
            const newStyle = style.replace(/url\(([^)]+)\)/g, (match, url) => {
                return `url(${url}?v=${generateFileVersion()})`;
            });
            element.setAttribute('style', newStyle);
        }
    });
    
    console.log('Resources force refreshed');
}

// Функция для предзагрузки изображений
function preloadImages() {
    try {
        const notes = document.querySelectorAll('.note img');
        const imageUrls = new Set();
        
        // Собираем все уникальные URL изображений
        notes.forEach(img => {
            if (img.src && !imageUrls.has(img.src)) {
                imageUrls.add(img.src);
            }
        });
        
        // Предзагружаем изображения
        imageUrls.forEach(url => {
            const img = new Image();
            img.onload = () => {
                console.log(`Image preloaded: ${url}`);
            };
            img.onerror = () => {
                console.warn(`Failed to preload image: ${url}`);
            };
            img.src = url;
        });
        
        console.log(`Preloading ${imageUrls.size} images`);
    } catch (error) {
        console.error('Error preloading images:', error);
    }
}

// Инициализация приложения
window.onload = async () => {
    try {
        // Восстанавливаем тему редактора
        restoreEditorTheme();
        
        // Инициализируем IndexedDB
        if (typeof notesDB !== 'undefined') {
            await notesDB.init();
        } else {
            console.error('notesDB is not defined');
            throw new Error('notesDB is not defined');
        }
        
        // Инициализируем TinyMCE
        if (typeof tinymce !== 'undefined') {
            try {
                initTinyMCE();
                console.log('TinyMCE initialized successfully');
                
                // Применяем сохраненную тему после инициализации
                setTimeout(() => {
                    const savedTheme = localStorage.getItem('editorTheme');
                    if (savedTheme) {
                        updateTinyMCETheme();
                    }
                }, 500);
                
            } catch (error) {
                console.error('Error initializing TinyMCE:', error);
            }
        } else {
            console.warn('TinyMCE library not loaded');
        }
        
        // Мигрируем данные из localStorage
        await notesDB.migrateFromLocalStorage();
        
        // Загружаем заметки
        await loadNotes();
        
        // Предзагружаем изображения для лучшей производительности
        preloadImages();
        
        // Обновляем текст кнопок
        if (typeof updateButtonTexts === 'function') {
            updateButtonTexts();
        }
        
        // Обновляем текст футера
        if (typeof updateFooterTexts === 'function') {
            updateFooterTexts();
        }
        
        // Инициализируем обработчики событий
        initializeEventListeners();
        
        // Обновляем версии файлов для очистки кеша
        updateFileVersions();
        
        // Очищаем кеш браузера
        clearBrowserCache();
        
        // Принудительно обновляем ресурсы
        forceRefreshResources();
    } catch (error) {
        console.error('Error initializing application:', error);
        console.error('Error stack:', error.stack);
        
        // Проверяем доступность функций для показа ошибки
        if (typeof showCustomAlert === 'function' && typeof t === 'function') {
            showCustomAlert(
                t("error"),
                t("errorInitializingApp"),
                "error"
            );
        } else {
            alert('Error initializing application: ' + error.message);
        }
    }
};

let currentNoteId = null;
let tinymceEditor;

// Функция для показа эмодзи пикера
function showEmojiPicker() {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
    
    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    picker.innerHTML = `
        <div class="emoji-picker-content">
            <div class="emoji-grid">
                ${emojis.map(emoji => `<span class="emoji-item" data-emoji="${emoji}">${emoji}</span>`).join('')}
            </div>
            <button class="emoji-close">${t("emojiClose")}</button>
        </div>
    `;
    
    document.body.appendChild(picker);
    
    picker.querySelectorAll('.emoji-item').forEach(item => {
        item.addEventListener('click', () => {
            if (tinymceEditor) {
                tinymceEditor.insertContent(item.dataset.emoji);
            }
            document.body.removeChild(picker);
        });
    });
    
    picker.querySelector('.emoji-close').addEventListener('click', () => {
        document.body.removeChild(picker);
    });
}

// Функция для закрытия всех плавающих панелей TinyMCE
function closeAllFloatingPanels() {
    const floatingPanels = document.querySelectorAll('.tox-pop:not(.tox-pop--hidden)');
    floatingPanels.forEach(panel => {
        panel.classList.add('tox-pop--hidden');
        panel.style.display = 'none';
    });
    
    // Также закрываем все диалоги
    const dialogs = document.querySelectorAll('.tox-dialog');
    dialogs.forEach(dialog => {
        dialog.style.display = 'none';
    });
    
    // Закрываем все коллекции
    const collections = document.querySelectorAll('.tox-collection');
    collections.forEach(collection => {
        collection.style.display = 'none';
    });
}

// Функция для добавления обработчиков событий с поддержкой Pointer Events
function addPointerEventListeners() {
    // Обработчик для закрытия плавающих панелей
    const handlePanelClose = function(e) {
        // Если клик не по плавающей панели, закрываем все панели
        if (!e.target.closest('.tox-pop') && !e.target.closest('.tox-toolbar')) {
            closeAllFloatingPanels();
        }
    };
    
    // Добавляем обработчики с поддержкой Pointer Events
    document.addEventListener('pointerdown', handlePanelClose);
    
    // Fallback для старых браузеров
    document.addEventListener('click', handlePanelClose);
    
    // Обработчик для кнопок закрытия
    const handleCloseButtons = function(e) {
        if (e.target.closest('.tox-button[aria-label*="close"]') || 
            e.target.closest('.tox-button[title*="close"]')) {
            closeAllFloatingPanels();
        }
    };
    
    document.addEventListener('pointerdown', handleCloseButtons);
    document.addEventListener('click', handleCloseButtons);
}

// Инициализация редактора TinyMCE с улучшенной обработкой ошибок
function initTinyMCE() {
    if (typeof tinymce === 'undefined') {
        console.error('TinyMCE library is not loaded');
        return false;
    }
    
    // Проверяем, не инициализирован ли уже редактор
    if (tinymceEditor && !tinymceEditor.destroyed) {
        console.log('TinyMCE already initialized');
        return true;
    }
    
    // Проверяем наличие контейнера
    const container = document.querySelector('.tinymce');
    if (!container) {
        console.error('TinyMCE container not found');
        return false;
    }
    
    try {
    tinymce.init({
        selector: '.tinymce',
        base_url: '/editor_news',
        suffix: '.min',
            height: responsiveManager.getFullscreenSettings().height,
            width: responsiveManager.getFullscreenSettings().width,
            menubar: responsiveManager.getMenubarForBreakpoint(),
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'codesample', 'pagebreak', 'nonbreaking', 'quickbars', 'accordion',
            'autosave', 'directionality', 'visualchars'
        ],
            toolbar: responsiveManager.getToolbarForBreakpoint(),
            toolbar_mode: responsiveManager.getToolbarModeForBreakpoint(),
            toolbar_sticky: responsiveManager.isDesktop,
        language: getTinyMCELanguage(),
        license_key: 'gpl',
        branding: false,
        promotion: false,
            resize: responsiveManager.isDesktop,
            elementpath: responsiveManager.isDesktop,
        statusbar: false,
            quickbars_selection_toolbar: (responsiveManager.isTouch || pointerManager.isTouch()) ? 'bold italic | quicklink h2 h3 blockquote quickimage quicktable' : false,
            quickbars_insert_toolbar: (responsiveManager.isTouch || pointerManager.isTouch()) ? 'quickimage quicktable' : false,
            contextmenu: (responsiveManager.isTouch || pointerManager.isTouch()) ? 'link image imagetools table' : 'link image imagetools table',
            mobile: responsiveManager.isMobile,
            touch: responsiveManager.isTouch || pointerManager.isTouch(),
            menubar_height: responsiveManager.getFullscreenSettings().menubar_height,
            toolbar_height: responsiveManager.getFullscreenSettings().toolbar_height,
        menu: {
            file: { title: getTinyMCETranslation('File'), items: 'newdocument restoredraft | preview | export | deleteallconversations' },
            edit: { title: getTinyMCETranslation('Edit'), items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: getTinyMCETranslation('View'), items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: getTinyMCETranslation('Insert'), items: 'image link media codesample inserttable | charmap emoticons | pagebreak nonbreaking anchor | insertdatetime' },
            format: { title: getTinyMCETranslation('Format'), items: 'bold italic underline strikethrough superscript subscript codeformat | blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat' },
            tools: { title: getTinyMCETranslation('Tools'), items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                table: { title: getTinyMCETranslation('Table'), items: 'inserttable | mceInsertTableSimple | mceInsertTableCustom | cell row column | advtablesort | tableprops deletetable' },
            help: { title: getTinyMCETranslation('Help'), items: 'help' }
        },
        content_style: getTinyMCEContentStyle(),
        skin: getTinyMCESkin(),
        content_css: getTinyMCEContentCSS(),
            // Настройки для таблиц
            table_default_attributes: {
                border: '1'
            },
            table_default_styles: {
                'border-collapse': 'collapse',
                'width': '100%'
            },
            table_cell_advtab: false,
            table_cell_class_list: [
                {title: 'None', value: ''},
                {title: 'Header', value: 'header'},
                {title: 'Highlighted', value: 'highlighted'}
            ],
            table_row_class_list: [
                {title: 'None', value: ''},
                {title: 'Header', value: 'header'},
                {title: 'Highlighted', value: 'highlighted'}
            ],
            table_appearance_options: true,
            table_grid: true,
            table_tab_navigation: true,
            // Добавляем обработку ошибок
            init_instance_callback: function (editor) {
                console.log('TinyMCE instance initialized successfully');
                
                // Проверяем, что меню создано
                setTimeout(() => {
                    const menubar = document.querySelector('.tox .tox-menubar');
                    if (menubar) {
                        console.log('Menubar found:', menubar);
                        menubar.style.display = 'flex';
                        menubar.style.visibility = 'visible';
                        menubar.style.opacity = '1';
                    } else {
                        console.warn('Menubar not found');
                    }
                }, 100);
                
                // Заменяем стандартные диалоги на кастомные
                editor.on('BeforeOpenDialog', function(e) {
                    e.preventDefault();
                    
                    if (e.dialogName === 'image') {
                        showCustomImageDialog(editor);
                    } else if (e.dialogName === 'link') {
                        showCustomLinkDialog(editor);
                    } else if (e.dialogName === 'table') {
                        showCustomTableDialog(editor);
                    } else if (e.dialogName === 'media') {
                        showCustomMediaDialog(editor);
                    } else if (e.dialogName === 'anchor') {
                        showCustomAnchorDialog(editor);
                    } else if (e.dialogName === 'codesample') {
                        showCustomCodeDialog(editor);
                    }
                });
                
                // Добавляем обработчики для кнопок
                editor.addCommand('mcePageBreak', function() {
                    insertPageBreak();
                });
                
                editor.addCommand('mceInsertTable', function() {
                    insertTable();
                });
                
                editor.addCommand('mceInsertTableSimple', function() {
                    insertTableAlternative();
                });
                
                editor.addCommand('mceInsertTableCustom', function() {
                    insertTableWithSize();
                });
                
                editor.addCommand('mceInsertImage', function() {
                    insertImage();
                });
                
                editor.addCommand('mceInsertLink', function() {
                    insertLink();
                });
                
                editor.addCommand('mceInsertMedia', function() {
                    insertMedia();
                });
                
                editor.addCommand('mceInsertAnchor', function() {
                    insertAnchor();
                });
                
                editor.addCommand('mceInsertCode', function() {
                    insertCode();
                });
            },
        setup: function (editor) {
                // Обработка ошибок инициализации
            editor.on('init', function() {
                    console.log('TinyMCE editor initialized');
                    
                    // Проверяем доступность редактора
                    if (!editor.getContainer()) {
                        console.error('TinyMCE container not found');
                        return;
                    }
                    
                // Добавляем обработчики событий с поддержкой Pointer Events
                addPointerEventListeners();
                
                // Добавляем обработчики для меню
                editor.on('init', function() {
                    console.log('Editor init event fired');
                    
                    // Принудительно показываем меню
                    setTimeout(() => {
                        const menubar = document.querySelector('.tox .tox-menubar');
                        if (menubar) {
                            menubar.style.display = 'flex !important';
                            menubar.style.visibility = 'visible !important';
                            menubar.style.opacity = '1 !important';
                            
                            // Добавляем обработчики кликов для пунктов меню
                            const menuItems = menubar.querySelectorAll('.tox-mbtn');
                            menuItems.forEach(item => {
                                item.style.pointerEvents = 'auto';
                                item.style.cursor = 'pointer';
                            });
                        }
                    }, 200);
                });
                
                // Закрываем панели при нажатии Escape
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeAllFloatingPanels();
                    }
                });
                
                // Добавляем обработчик для кнопок закрытия
                document.addEventListener('click', function(e) {
                    if (e.target.closest('.tox-button[aria-label*="close"]') || 
                        e.target.closest('.tox-button[title*="close"]')) {
                        const panel = e.target.closest('.tox-pop');
                        if (panel) {
                            panel.classList.add('tox-pop--hidden');
            }
        }
    });
                
                // Исправляем z-index для всех плавающих элементов
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // Element node
                                    if (node.classList && node.classList.contains('tox-pop')) {
                                        node.style.zIndex = '10000';
                                    }
                                    // Проверяем дочерние элементы
                                    const floatingElements = node.querySelectorAll('.tox-pop, .tox-collection, .tox-dialog');
                                    floatingElements.forEach(el => {
                                        el.style.zIndex = '10000';
                                    });
                                }
                            });
                        }
                    });
                });
                
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    
                    // Применяем адаптивные стили меню после инициализации
                    setTimeout(() => {
                        if (responsiveManager) {
                            responsiveManager.applyMenuStyles();
                            responsiveManager.applyFullscreenStyles();
                        }
                    }, 300);
                    
                    // Добавляем обработчик для изменения системной темы
                    if (window.matchMedia) {
                        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
                        mediaQuery.addEventListener('change', function(e) {
                            const currentTheme = document.documentElement.getAttribute('data-theme');
                            if (currentTheme === 'auto') {
            setTimeout(() => {
                                    updateTinyMCETheme();
                                }, 200);
                            }
                        });
                    }
                });
                
                // Обработка ошибок
                editor.on('error', function(e) {
                    console.error('TinyMCE error:', e);
                });
                
                editor.on('change', function () {
                    try {
                        editor.save();
                    } catch (error) {
                        console.error('Error saving TinyMCE content:', error);
                    }
                });
                
                // Сохраняем ссылку на редактор
                tinymceEditor = editor;
            }
        });
    
    return true;
    } catch (error) {
        console.error('Error initializing TinyMCE:', error);
        return false;
    }
}

function openModal(noteId, noteContent, noteCreationTime) {
    const modal = document.getElementById("editModal");

    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    // Проверяем и инициализируем TinyMCE с повторными попытками
    let initAttempts = 0;
    const maxInitAttempts = 3;
    
    const tryInitTinyMCE = () => {
        if (initAttempts >= maxInitAttempts) {
            console.error('Failed to initialize TinyMCE after multiple attempts');
            showCustomAlert(
                t("error"),
                t("errorEditorInitialization"),
                "error"
            );
            return false;
        }
        
        initAttempts++;
        
        if (!tinymceEditor || tinymceEditor.destroyed) {
            if (!initTinyMCE()) {
                // Повторная попытка через 500мс
                setTimeout(tryInitTinyMCE, 500);
                return false;
            }
        }
        
        return true;
    };
    
    if (!tryInitTinyMCE()) {
        return;
    }

    // Ждем полной инициализации редактора
    const waitForEditor = () => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 секунд максимум
            
            const checkEditor = () => {
                attempts++;
                
                if (tinymceEditor && !tinymceEditor.destroyed && tinymceEditor.getContainer()) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Editor initialization timeout'));
                } else {
                    setTimeout(checkEditor, 100);
                }
            };
            
            checkEditor();
        });
    };

    // Открываем модальное окно
    modal.style.display = "block";
    document.body.classList.add('modal-open');

    // Ждем инициализации редактора и устанавливаем контент
    waitForEditor()
        .then(() => {
            try {
                if (noteId && noteContent) {
        tinymceEditor.setContent(noteContent);
        currentNoteId = noteId;
    } else {
        tinymceEditor.setContent("");
        currentNoteId = null;
    }

                // Фокусируемся на редакторе
                tinymceEditor.focus();

    // Применяем подсветку синтаксиса к блокам кода
    setTimeout(() => {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }, 100);
                
            } catch (error) {
                console.error('Error setting content in TinyMCE:', error);
            }
        })
        .catch((error) => {
            console.error('Error waiting for editor:', error);
            showCustomAlert(
                t("error"),
                t("errorEditorTimeout"),
                "error"
            );
        });

    document.getElementById("saveNoteButton").onclick = async function () {
        // Закрываем все плавающие панели перед сохранением
        closeAllFloatingPanels();
        
        let content;
        if (tinymceEditor) {
            content = tinymceEditor.getContent().trim();
        } else {
            // Fallback для простого textarea
            const editorContainer = document.getElementById('editorContainer');
            content = editorContainer ? editorContainer.value.trim() : '';
        }
        
        if (!content || content === "<p><br></p>") {
            // Сообщение об ошибке
            showCustomAlert(t("error"), t("errorEmptyNote"), "error");

            return;
        }

        const timestamp = Date.now();

        try {
            const noteId = currentNoteId || 'note_' + timestamp;
            const note = {
                id: noteId,
            content: content,
            creationTime: noteCreationTime || timestamp,
                lastModified: timestamp,
                title: notesDB.extractTitle(content)
            };

            await notesDB.saveNote(note);

        modal.style.display = "none";
        document.body.classList.remove('modal-open');
        await loadNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            showCustomAlert(
                t("error"),
                t("errorSavingNote"),
                "error"
            );
        }
    };

    // Отмена редактирования/добавления
    document.getElementById("cancelNoteButton").onclick = function () {
        // Закрываем все плавающие панели TinyMCE
        closeAllFloatingPanels();
        
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
        currentNoteId = null;
        if (tinymceEditor) {
            tinymceEditor.setContent(""); // Очищаем содержимое редактора
        } else {
            // Fallback для простого textarea
            const editorContainer = document.getElementById('editorContainer');
            if (editorContainer) {
                editorContainer.value = "";
            }
        }
    };
}


function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById("confirmModal");
    const messageContainer = document.getElementById("confirmMessage");
    const yesButton = document.getElementById("confirmYes");
    const noButton = document.getElementById("confirmNo");

    messageContainer.innerText = message;
    modal.style.display = "block";
    document.body.classList.add('modal-open');

    yesButton.innerText = t("yes");
    noButton.innerText = t("cancel");

    yesButton.onclick = () => {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
        onConfirm();
    };

    noButton.onclick = () => {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    };
}

async function loadNotes() {
    const viewer = document.querySelector(".btn_view_div");
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    try {
        // Получаем все заметки из IndexedDB
        const notes = await notesDB.getAllNotes();
        
        // Сортируем по времени последнего изменения
        notes.sort((a, b) => b.lastModified - a.lastModified);

    // Если массив заметок пуст, выводим соответствующее сообщение
        if (notes.length === 0) {
        const noNotesMessage = document.createElement("p");
        noNotesMessage.classList.add("noNotes");

        // Устанавливаем текст в зависимости от языка
        noNotesMessage.textContent = t("noNotesToDisplay");
        viewer.style.display = "none";
        notesContainer.appendChild(noNotesMessage);
    }

        notes.forEach((note) => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");

            // Создаем хедер заметки
            const footer = document.createElement("div");
            footer.classList.add("note-footer");

            // Форматируем строки в зависимости от языка
            const creationTime = new Date(note.creationTime).toLocaleString(locale, options);
            const lastModified = new Date(note.lastModified).toLocaleString(locale, options);

            // Формируем текст в зависимости от языка
            if (currentLang.startsWith("ru")) {
                footer.textContent = `Создано: ${creationTime} | Изменено: ${lastModified}`;
            } else {
                footer.textContent = `Created: ${creationTime} | Changed: ${lastModified}`;
            }
            noteElement.appendChild(footer);

            // Создаем контент заметки
        const notePreview = document.createElement("div");
        notePreview.classList.add("noteContent");
            notePreview.innerHTML = note.content;
            
            // Улучшаем загрузку изображений
            setTimeout(() => {
                const images = notePreview.querySelectorAll('img');
                images.forEach(img => {
                    // Добавляем обработчики для изображений
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        img.classList.remove('error');
                    });
                    
                    img.addEventListener('error', () => {
                        img.classList.add('error');
                        img.classList.remove('loaded');
                        img.alt = currentLang.startsWith("ru") ? "Ошибка загрузки изображения" : "Image load error";
                        img.title = currentLang.startsWith("ru") ? "Не удалось загрузить изображение" : "Failed to load image";
                    });
                    
                    // Если изображение уже загружено
                    if (img.complete && img.naturalHeight !== 0) {
                        img.classList.add('loaded');
                    }
                    
                    // Добавляем обработчик клика для полноэкранного просмотра
                    img.addEventListener('click', handleImageClick);
                    
                    // Предзагружаем изображение если оно еще не загружено
                    if (!img.complete) {
                        const newImg = new Image();
                        newImg.onload = () => {
                            img.classList.add('loaded');
                        };
                        newImg.onerror = () => {
                            img.classList.add('error');
                        };
                        newImg.src = img.src;
                    }
                });
            }, 100);
            
            noteElement.appendChild(notePreview);

            // Создаем контейнер для кнопок
            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("note-buttons");

            // Создаем кнопки
        const editButton = document.createElement("button");
        editButton.innerHTML = `<i class="fas fa-edit"></i> ${t("edit")}`;
        editButton.classList.add("editBtn");
            editButton.onclick = () => openModal(note.id, note.content, note.creationTime);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteBtn");
        deleteButton.innerHTML = `<i class="fas fa-trash"></i> ${t("delete")}`;
            deleteButton.onclick = async () => {
                noteElement.classList.add("removing");
                setTimeout(async () => {
                    try {
                        await notesDB.deleteNote(note.id);
                        await loadNotes();
                    } catch (error) {
                        console.error('Error deleting note:', error);
                        showCustomAlert(
                            t("error"),
                            t("errorDeletingNote"),
                            "error"
                        );
                    }
            }, 500);
        };

        const exportButton = document.createElement("button");
        exportButton.classList.add("exportBtn");
        exportButton.innerHTML = `<i class="fas fa-download"></i> ${t("export")}`;
            exportButton.onclick = () => showExportOptions(note.content);

            // Добавляем кнопки в контейнер
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
            buttonsContainer.appendChild(exportButton);

            // Добавляем контейнер кнопок в заметку
            noteElement.appendChild(buttonsContainer);
            notesContainer.appendChild(noteElement);
        viewer.style.display = "";
    });
    } catch (error) {
        console.error('Error loading notes:', error);
        showCustomAlert(
            t("error"),
            t("errorLoadingNotes"),
            "error"
        );
    }
}

async function exportNote(noteContent, password) {
    try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueTag = `<!-- Exported on ${timestamp} -->\n`;
    const contentWithTag = uniqueTag + noteContent;

        // Дополнительная обфускация файла
        const obfuscatedContent = advancedEncryption.obfuscateFile(contentWithTag);
        
        // Улучшенное шифрование с обфускацией
        const encrypted = await advancedEncryption.encrypt(obfuscatedContent, password);
        
        const blob = new Blob([encrypted], { type: "application/octet-stream" });
    const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
    link.download = `encrypted_note_${timestamp}.note`;
    link.click();
        
        // Показываем уведомление об успехе
        showCustomAlert(
            t("success"),
            t("noteExported"),
            "success"
        );
    } catch (error) {
        showCustomAlert(
            t("error"),
            t("errorEncryption", { message: error.message }),
            "error"
        );
    }
}



function closeModal() {
    document.getElementById("error").style.display = "none";
}

// Собственная система модальных окон
function showCustomPrompt(title, message, placeholder = "", defaultValue = "", callback) {
    const promptModal = document.createElement('div');
    promptModal.className = 'modal';
    promptModal.id = 'customPromptModal';
    promptModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${title}</h3>
            <p>${message}</p>
            <input type="text" id="customPromptInput" placeholder="${placeholder}" value="${defaultValue}">
            <div class="modal-buttons-container">
                <button id="customPromptOk" class="btn"><i class="fas fa-check"></i> ${t("ok")}</button>
                <button id="customPromptCancel" class="btn cancel"><i class="fas fa-times"></i> ${t("cancel")}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(promptModal);
    promptModal.style.display = "block";
    
    const input = document.getElementById('customPromptInput');
    const okButton = document.getElementById('customPromptOk');
    const cancelButton = document.getElementById('customPromptCancel');
    
    // Фокус на поле ввода
    setTimeout(() => input.focus(), 100);
    
    // Выделяем весь текст по умолчанию
    input.select();
    
    // Обработчики событий
    const handleOk = () => {
        const value = input.value.trim();
        document.body.removeChild(promptModal);
        if (callback) callback(value);
    };
    
    const handleCancel = () => {
        document.body.removeChild(promptModal);
        if (callback) callback(null);
    };
    
    okButton.addEventListener('click', handleOk);
    cancelButton.addEventListener('click', handleCancel);
    
    // Закрытие по Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleOk();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', escapeHandler);
            handleCancel();
        }
    });
    
    // Закрытие по клику вне модального окна с поддержкой Pointer Events
    promptModal.addEventListener('pointerdown', (e) => {
        if (e.target === promptModal) {
            handleCancel();
        }
    });
    
    // Fallback для старых браузеров
    promptModal.addEventListener('click', (e) => {
        if (e.target === promptModal) {
            handleCancel();
        }
    });
}

// Кастомные диалоги для TinyMCE
function showCustomImageDialog(editor) {
    const imageModal = document.createElement('div');
    imageModal.className = 'modal';
    imageModal.id = 'customImageModal';
    imageModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка изображения" : "Insert Image"}</h3>
            <p>${currentLang.startsWith("ru") ? "Введите URL изображения:" : "Enter image URL:"}</p>
            <input type="url" id="imageUrlInput" placeholder="https://example.com/image.jpg">
            <div class="modal-buttons-container">
                <button id="imageInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="imageCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    imageModal.style.display = "block";
    
    const urlInput = document.getElementById('imageUrlInput');
    const insertBtn = document.getElementById('imageInsertBtn');
    const cancelBtn = document.getElementById('imageCancelBtn');
    
    setTimeout(() => urlInput.focus(), 100);
    
    const handleInsert = () => {
        const url = urlInput.value.trim();
        if (url) {
            editor.insertContent(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px var(--shadow-color);">`);
        }
        document.body.removeChild(imageModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(imageModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInsert();
    });
    
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) handleCancel();
    });
}

function showCustomLinkDialog(editor) {
    const linkModal = document.createElement('div');
    linkModal.className = 'modal';
    linkModal.id = 'customLinkModal';
    linkModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка ссылки" : "Insert Link"}</h3>
            <p>${currentLang.startsWith("ru") ? "Введите URL ссылки:" : "Enter link URL:"}</p>
            <input type="url" id="linkUrlInput" placeholder="https://example.com">
            <p>${currentLang.startsWith("ru") ? "Текст ссылки (необязательно):" : "Link text (optional):"}</p>
            <input type="text" id="linkTextInput" placeholder="${currentLang.startsWith("ru") ? "Текст ссылки" : "Link text"}">
            <div class="modal-buttons-container">
                <button id="linkInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="linkCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(linkModal);
    linkModal.style.display = "block";
    
    const urlInput = document.getElementById('linkUrlInput');
    const textInput = document.getElementById('linkTextInput');
    const insertBtn = document.getElementById('linkInsertBtn');
    const cancelBtn = document.getElementById('linkCancelBtn');
    
    setTimeout(() => urlInput.focus(), 100);
    
    const handleInsert = () => {
        const url = urlInput.value.trim();
        const text = textInput.value.trim() || url;
        if (url) {
            editor.insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);
        }
        document.body.removeChild(linkModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(linkModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInsert();
    });
    
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) handleCancel();
    });
}

function showCustomTableDialog(editor) {
    const tableModal = document.createElement('div');
    tableModal.className = 'modal';
    tableModal.id = 'customTableModal';
    tableModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка таблицы" : "Insert Table"}</h3>
            <p>${currentLang.startsWith("ru") ? "Выберите размер таблицы:" : "Select table size:"}</p>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin: 20px 0;">
                ${Array.from({length: 25}, (_, i) => {
                    const row = Math.floor(i / 5) + 1;
                    const col = (i % 5) + 1;
                    return `<div class="table-cell" data-rows="${row}" data-cols="${col}" style="width: 30px; height: 30px; border: 1px solid var(--border-color); cursor: pointer; background: var(--input-bg);"></div>`;
                }).join('')}
            </div>
            <div class="modal-buttons-container">
                <button id="tableInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="tableCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(tableModal);
    tableModal.style.display = "block";
    
    let selectedRows = 3, selectedCols = 3;
    const cells = tableModal.querySelectorAll('.table-cell');
    const insertBtn = document.getElementById('tableInsertBtn');
    const cancelBtn = document.getElementById('tableCancelBtn');
    
    // Обновляем выделение
    const updateSelection = () => {
        cells.forEach(cell => {
            const cellRow = parseInt(cell.dataset.rows);
            const cellCol = parseInt(cell.dataset.cols);
            if (cellRow <= selectedRows && cellCol <= selectedCols) {
                cell.style.background = 'var(--primary-color)';
            } else {
                cell.style.background = 'var(--input-bg)';
            }
        });
    };
    
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            selectedRows = parseInt(cell.dataset.rows);
            selectedCols = parseInt(cell.dataset.cols);
            updateSelection();
        });
        
        cell.addEventListener('mouseenter', () => {
            const hoverRows = parseInt(cell.dataset.rows);
            const hoverCols = parseInt(cell.dataset.cols);
            cells.forEach(c => {
                const cRow = parseInt(c.dataset.rows);
                const cCol = parseInt(c.dataset.cols);
                if (cRow <= hoverRows && cCol <= hoverCols) {
                    c.style.background = 'var(--button-hover)';
                } else {
                    c.style.background = 'var(--input-bg)';
                }
            });
        });
        
        cell.addEventListener('mouseleave', updateSelection);
    });
    
    updateSelection();
    
    const handleInsert = () => {
        let tableHtml = '<table style="border-collapse: collapse; width: 100%; border: 1px solid var(--border-color);">';
        for (let i = 0; i < selectedRows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < selectedCols; j++) {
                tableHtml += '<td style="border: 1px solid var(--border-color); padding: 8px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</table>';
        editor.insertContent(tableHtml);
        document.body.removeChild(tableModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(tableModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    tableModal.addEventListener('click', (e) => {
        if (e.target === tableModal) handleCancel();
    });
}

// Дополнительные кастомные диалоги
function showCustomMediaDialog(editor) {
    const mediaModal = document.createElement('div');
    mediaModal.className = 'modal';
    mediaModal.id = 'customMediaModal';
    mediaModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка медиа" : "Insert Media"}</h3>
            <p>${currentLang.startsWith("ru") ? "Введите URL медиа файла:" : "Enter media file URL:"}</p>
            <input type="url" id="mediaUrlInput" placeholder="https://example.com/video.mp4">
            <p>${currentLang.startsWith("ru") ? "Тип медиа:" : "Media type:"}</p>
            <select id="mediaTypeSelect">
                <option value="video">${currentLang.startsWith("ru") ? "Видео" : "Video"}</option>
                <option value="audio">${currentLang.startsWith("ru") ? "Аудио" : "Audio"}</option>
            </select>
            <div class="modal-buttons-container">
                <button id="mediaInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="mediaCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(mediaModal);
    mediaModal.style.display = "block";
    
    const urlInput = document.getElementById('mediaUrlInput');
    const typeSelect = document.getElementById('mediaTypeSelect');
    const insertBtn = document.getElementById('mediaInsertBtn');
    const cancelBtn = document.getElementById('mediaCancelBtn');
    
    setTimeout(() => urlInput.focus(), 100);
    
    const handleInsert = () => {
        const url = urlInput.value.trim();
        const type = typeSelect.value;
        if (url) {
            if (type === 'video') {
                editor.insertContent(`<video controls style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px var(--shadow-color);"><source src="${url}" type="video/mp4">${currentLang.startsWith("ru") ? "Ваш браузер не поддерживает видео тег." : "Your browser does not support the video tag."}</video>`);
            } else if (type === 'audio') {
                editor.insertContent(`<audio controls style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px var(--shadow-color);"><source src="${url}" type="audio/mpeg">${currentLang.startsWith("ru") ? "Ваш браузер не поддерживает аудио тег." : "Your browser does not support the audio tag."}</audio>`);
            }
        }
        document.body.removeChild(mediaModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(mediaModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInsert();
    });
    
    mediaModal.addEventListener('click', (e) => {
        if (e.target === mediaModal) handleCancel();
    });
}

function showCustomAnchorDialog(editor) {
    const anchorModal = document.createElement('div');
    anchorModal.className = 'modal';
    anchorModal.id = 'customAnchorModal';
    anchorModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка якоря" : "Insert Anchor"}</h3>
            <p>${currentLang.startsWith("ru") ? "Введите имя якоря:" : "Enter anchor name:"}</p>
            <input type="text" id="anchorNameInput" placeholder="anchor-name">
            <div class="modal-buttons-container">
                <button id="anchorInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="anchorCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(anchorModal);
    anchorModal.style.display = "block";
    
    const nameInput = document.getElementById('anchorNameInput');
    const insertBtn = document.getElementById('anchorInsertBtn');
    const cancelBtn = document.getElementById('anchorCancelBtn');
    
    setTimeout(() => nameInput.focus(), 100);
    
    const handleInsert = () => {
        const name = nameInput.value.trim();
        if (name) {
            editor.insertContent(`<a id="${name}" style="display: block; height: 0; visibility: hidden;"></a>`);
        }
        document.body.removeChild(anchorModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(anchorModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInsert();
    });
    
    anchorModal.addEventListener('click', (e) => {
        if (e.target === anchorModal) handleCancel();
    });
}

function showCustomCodeDialog(editor) {
    const codeModal = document.createElement('div');
    codeModal.className = 'modal';
    codeModal.id = 'customCodeModal';
    codeModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка кода" : "Insert Code"}</h3>
            <p>${currentLang.startsWith("ru") ? "Выберите тип кода:" : "Select code type:"}</p>
            <select id="codeTypeSelect">
                <option value="inline">${currentLang.startsWith("ru") ? "Встроенный код" : "Inline code"}</option>
                <option value="block">${currentLang.startsWith("ru") ? "Блок кода" : "Code block"}</option>
            </select>
            <p>${currentLang.startsWith("ru") ? "Введите код:" : "Enter code:"}</p>
            <textarea id="codeInput" placeholder="${currentLang.startsWith("ru") ? "Введите ваш код здесь..." : "Enter your code here..."}" rows="6"></textarea>
            <div class="modal-buttons-container">
                <button id="codeInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="codeCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(codeModal);
    codeModal.style.display = "block";
    
    const typeSelect = document.getElementById('codeTypeSelect');
    const codeInput = document.getElementById('codeInput');
    const insertBtn = document.getElementById('codeInsertBtn');
    const cancelBtn = document.getElementById('codeCancelBtn');
    
    setTimeout(() => codeInput.focus(), 100);
    
    const handleInsert = () => {
        const code = codeInput.value.trim();
        const type = typeSelect.value;
        if (code) {
            if (type === 'inline') {
                editor.insertContent(`<code style="background: var(--input-bg); padding: 2px 6px; border-radius: 3px; font-family: monospace; border: 1px solid var(--border-color);">${code}</code>`);
            } else {
                editor.insertContent(`<pre style="background: var(--input-bg); padding: 15px; border-radius: 6px; border: 1px solid var(--border-color); overflow-x: auto; font-family: monospace; white-space: pre-wrap;"><code>${code}</code></pre>`);
            }
        }
        document.body.removeChild(codeModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(codeModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) handleInsert();
    });
    
    codeModal.addEventListener('click', (e) => {
        if (e.target === codeModal) handleCancel();
    });
}

// Собственная система уведомлений
function showCustomAlert(title, message, type = 'info') {
    const alertModal = document.createElement('div');
    alertModal.className = 'modal';
    alertModal.id = 'customAlertModal';
    
    const iconMap = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌'
    };
    
    const colorMap = {
        'info': '#007bff',
        'success': '#28a745',
        'warning': '#ffc107',
        'error': '#dc3545'
    };
    
    alertModal.innerHTML = `
        <div class="modal-content-error">
            <h3 style="display: flex; align-items: center; gap: 10px; color: ${colorMap[type]};">
                <span style="font-size: 24px;">${iconMap[type]}</span>
                ${title}
            </h3>
            <p style="margin: 15px 0; line-height: 1.5;">${message}</p>
            <div style="display: flex; justify-content: center; margin-top: 20px;">
                <button id="customAlertOk" style="background: ${colorMap[type]}; color: white; border: none; padding: 10px 30px; border-radius: 5px; cursor: pointer; font-size: 16px;">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertModal);
    alertModal.style.display = "block";
    
    const okButton = document.getElementById('customAlertOk');
    
    const handleOk = () => {
        if (alertModal && alertModal.parentNode) {
            document.body.removeChild(alertModal);
        }
    };
    
    okButton.addEventListener('click', handleOk);
    
    // Закрытие по Enter или Escape
    document.addEventListener('keydown', function keyHandler(e) {
        if (e.key === 'Enter' || e.key === 'Escape') {
            document.removeEventListener('keydown', keyHandler);
            handleOk();
        }
    });
    
    // Закрытие по клику вне модального окна с поддержкой Pointer Events
    alertModal.addEventListener('pointerdown', (e) => {
        if (e.target === alertModal) {
            handleOk();
        }
    });
    
    // Fallback для старых браузеров
    alertModal.addEventListener('click', (e) => {
        if (e.target === alertModal) {
            handleOk();
        }
    });
}

async function importNotes(event, password) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let importedCount = 0;
    let errorCount = 0;
    let totalFiles = files.length;
    let processedFiles = 0;

    // Функция для обработки одного файла
    const processFile = (file) => {
        return new Promise((resolve) => {
        if (!file.name.endsWith('.note')) {
            errorCount++;
                showCustomAlert(t("error"), t("errorInvalidFile", { filename: file.name }), "error");
                resolve();
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                // Читаем зашифрованные данные как текст
                const encryptedText = e.target.result;
                
                // Расшифровываем с помощью улучшенного шифрования (с поддержкой старых файлов)
                const decryptedText = await advancedEncryption.decrypt(encryptedText, password);
                
                // Проверяем, нужно ли удалять обфускацию (только для новых файлов)
                let finalText = decryptedText;
                try {
                    // Пробуем удалить обфускацию
                    finalText = advancedEncryption.deobfuscateFile(decryptedText);
                } catch (obfuscationError) {
                    // Если не удалось, используем исходный текст (старый формат)
                    finalText = decryptedText;
                }
                
                const tagPattern = /<!-- Exported on [\d-T:.Z]+ -->/;
                if (!tagPattern.test(finalText)) {
                    errorCount++;
                    showCustomAlert(t("error"), t("errorNoUniqueTag", { filename: file.name }), "error");
                        resolve();
                    return;
                }

                const cleanedText = finalText.replace(tagPattern, "").trim();
                const notes = cleanedText.split("\n\n---\n\n");

                for (const note of notes) {
                    if (note.trim()) {
                        const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        const noteObj = {
                            id: newId,
                            content: note,
                            creationTime: Date.now(),
                            lastModified: Date.now(),
                            title: notesDB.extractTitle(note)
                        };
                        await notesDB.saveNote(noteObj);
                        importedCount++;
                    }
                    }
                } catch (err) {
                    errorCount++;
                    showCustomAlert(t("error"), t("errorDecryption", { filename: file.name }), "error");
                }

                processedFiles++;
                
                // Проверяем, обработаны ли все файлы
                if (processedFiles === totalFiles) {
                if (importedCount > 0) {
                    showCustomAlert(t("success"), t("importCompleted", { count: importedCount }), "success");
                    await loadNotes();
                    } else if (errorCount === totalFiles) {
                        showCustomAlert(t("error"), t("errorNoFilesImported"), "error");
                    } else {
                        showCustomAlert(t("warning"), t("importPartialSuccess", { imported: importedCount, errors: errorCount }), "warning");
                        await loadNotes();
                }
            }
                
                resolve();
        };
        reader.readAsText(file);
        });
    };

    // Обрабатываем все файлы параллельно
    const promises = Array.from(files).map(file => processFile(file));
    await Promise.all(promises);
}


function transliterate(text) {
    const translitMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        // Добавляем заглавные буквы
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };
    return text.replace(/[а-яёА-ЯЁ]/g, char => translitMap[char] || char);
}


function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function filterNotes() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase().trim();
    if (!searchQuery) {
        document.querySelectorAll(".note").forEach(note => note.classList.remove("hidden"));
        return;
    }
    const transliteratedQuery = transliterate(searchQuery);
    document.querySelectorAll(".note").forEach(note => {
        const content = note.querySelector("div").textContent.toLowerCase();
        const transliteratedContent = transliterate(content);
        if (content.includes(searchQuery) || transliteratedContent.includes(transliteratedQuery)) {
            note.classList.remove("hidden");
        } else {
            note.classList.add("hidden");
        }
    });
}


// Улучшенные функции экспорта и импорта

// Функция экспорта заметки в HTML (без шифрования)
function exportNoteHTML(noteContent) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueTag = `<!-- Exported on ${timestamp} -->\n`;
    const contentWithTag = uniqueTag + noteContent;

    const blob = new Blob([contentWithTag], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `note_${timestamp}.html`;
    link.click();
    
    // Очищаем URL после скачивания
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

// function showCustomAlert(message) {

//     const modal = document.getElementById("error");
//     const modalContent = modal.querySelector(".modal-content-error");
//     const okButton = modal.querySelector("#ok");

//     // Очищаем содержимое перед добавлением нового сообщения
//     modalContent.innerHTML = `<p>${message}</p>`;
//     modalContent.appendChild(okButton); // Добавляем кнопку обратно после изменения содержимого

//     // Настройка кнопки закрытия
//     okButton.innerText = "OK";
//     okButton.onclick = closeModal;

//     // Показ модального окна
//     modal.style.display = "block";
// }

// function closeModal() {
//     document.getElementById("error").style.display = "none";
// }

// Улучшенная функция импорта заметок (без шифрования)
async function importNotesHTML(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let importedCount = 0;
    let errorCount = 0;
    let totalFiles = files.length;
    let processedFiles = 0;

    // Функция для обработки одного файла
    const processFile = (file) => {
        return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const importedText = e.target.result;

                // Проверяем наличие уникального тега
                const tagPattern = /<!-- Exported on [\d-T:.Z]+ -->/;
                if (!tagPattern.test(importedText)) {
                    errorCount++;
                    showCustomAlert(t("error"), t("errorNoUniqueTag", { filename: file.name }), "error");
                        resolve();
                    return;
                }

                // Удаляем тег и разделяем заметки
                const cleanedText = importedText.replace(tagPattern, "").trim();
                const notes = cleanedText.split("\n\n---\n\n");

                for (const note of notes) {
                    if (note.trim()) {
                        const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        const noteObj = {
                            id: newId,
                            content: note,
                            creationTime: Date.now(),
                            lastModified: Date.now(),
                            title: notesDB.extractTitle(note)
                        };
                        await notesDB.saveNote(noteObj);
                        importedCount++;
                    }
                    }
                } catch (error) {
                    errorCount++;
                    console.error('Import error:', error);
                    showCustomAlert(t("error"), t("errorImport", { filename: file.name, message: error.message }), "error");
                }
                
                processedFiles++;

                // Проверяем, обработаны ли все файлы
                if (processedFiles === totalFiles) {
                    if (importedCount > 0) {
                        showCustomAlert(t("success"), t("importCompleted", { count: importedCount }), "success");
                        await loadNotes();
                    } else if (errorCount === totalFiles) {
                        showCustomAlert(t("error"), t("errorNoFilesImported"), "error");
                    } else {
                        showCustomAlert(t("warning"), t("importPartialSuccess", { imported: importedCount, errors: errorCount }), "warning");
                        await loadNotes();
                    }
                }
                
                resolve();
        };
        reader.readAsText(file);
        });
    };

    // Обрабатываем все файлы параллельно
    const promises = Array.from(files).map(file => processFile(file));
    await Promise.all(promises);
}

// Улучшенная функция импорта с поддержкой разных форматов
async function importNotesWithFormat(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Показываем диалог выбора формата импорта
    const importModal = document.createElement('div');
    importModal.className = 'export-modal';
    importModal.innerHTML = `
        <div class="export-modal-content">
            <h3>${t("chooseImportFormat")}</h3>
            <div class="export-options">
                <button class="export-option" data-format="encrypted">
                    <span class="export-icon">🔒</span>
                    <span class="export-text">Encrypted</span>
                    <span class="export-desc">${t("encryptedFiles")}</span>
                </button>
                <button class="export-option" data-format="html">
                    <span class="export-icon">🌐</span>
                    <span class="export-text">HTML</span>
                    <span class="export-desc">${t("htmlFiles")}</span>
                </button>
            </div>
            <button class="export-close">${t("cancel")}</button>
        </div>
    `;
    
    document.body.appendChild(importModal);
    
    importModal.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', () => {
            const format = option.dataset.format;
            document.body.removeChild(importModal);
            
            if (format === 'encrypted') {
                // Запрашиваем пароль для расшифровки
                showCustomPrompt(
                    t("decryptNote"),
                    t("enterPassword"),
                    t("password"),
                    "",
                    (password) => {
                        if (password && password.trim()) {
                            importNotes(event, password.trim());
                        } else if (password !== null) {
                            showCustomAlert(
                                t("error"),
                                t("errorEmptyPassword"),
                                "error"
                            );
                        }
                    }
                );
            } else if (format === 'html') {
                importNotesHTML(event);
            }
        });
    });
    
    importModal.querySelector('.export-close').addEventListener('click', () => {
        document.body.removeChild(importModal);
    });
    
    // Закрытие по клику вне модального окна с поддержкой Pointer Events
    importModal.addEventListener('pointerdown', (e) => {
        if (e.target === importModal) {
            document.body.removeChild(importModal);
        }
    });
    
    // Fallback для старых браузеров
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
            document.body.removeChild(importModal);
        }
    });
}

// With Encrypt

// Новые функции редактора


// Функция для показа специальных символов
function showSpecialCharsPicker() {
    const specialChars = ['©', '®', '™', '€', '£', '¥', '¢', '§', '¶', '†', '‡', '•', '…', '‰', '′', '″', '‴', '※', '‼', '‽', '⁇', '⁈', '⁉', '⁏', '⁐', '⁑', '⁒', '⁓', '⁔', '⁕', '⁖', '⁗', '⁘', '⁙', '⁚', '⁛', '⁜', '⁝', '⁞', '⁰', 'ⁱ', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻', '⁼', '⁽', '⁾', 'ⁿ', '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₊', '₋', '₌', '₍', '₎', 'ₐ', 'ₑ', 'ₒ', 'ₓ', 'ₔ', 'ₕ', 'ₖ', 'ₗ', 'ₘ', 'ₙ', 'ₚ', 'ₛ', 'ₜ', '₝', '₞', '₟', '₠', '₡', '₢', '₣', '₤', '₥', '₦', '₧', '₨', '₩', '₪', '₫', '€', '₭', '₮', '₯', '₰', '₱', '₲', '₳', '₴', '₵', '₶', '₷', '₸', '₹', '₺', '₻', '₼', '₽', '₾', '₿'];
    
    const picker = document.createElement('div');
    picker.className = 'special-chars-picker';
    picker.innerHTML = `
        <div class="special-chars-picker-content">
            <div class="special-chars-grid">
                ${specialChars.map(char => `<span class="char-item" data-char="${char}">${char}</span>`).join('')}
            </div>
            <button class="chars-close">${t("specialCharsClose")}</button>
        </div>
    `;
    
    document.body.appendChild(picker);
    
    picker.querySelectorAll('.char-item').forEach(item => {
        item.addEventListener('click', () => {
            if (tinymceEditor) {
                tinymceEditor.insertContent(item.dataset.char);
            }
            document.body.removeChild(picker);
        });
    });
    
    picker.querySelector('.chars-close').addEventListener('click', () => {
        document.body.removeChild(picker);
    });
}

// Функция для показа счетчика слов
function showWordCount() {
    if (!tinymceEditor) return;
    
    const text = tinymceEditor.getContent({format: 'text'});
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    
    const message = t("wordCount", { words, chars, charsNoSpaces });
    
    showCustomAlert(t("info"), message, "info");
}

// Функция для полноэкранного режима
function toggleFullscreen() {
    const modal = document.getElementById("editModal");
    const modalContent = modal.querySelector(".modal-content");
    
    if (modalContent.classList.contains('fullscreen')) {
        modalContent.classList.remove('fullscreen');
        modalContent.style.width = '95%';
        modalContent.style.height = '88.5%';
        modalContent.style.margin = '1% auto';
    } else {
        modalContent.classList.add('fullscreen');
        modalContent.style.width = '100%';
        modalContent.style.height = '100%';
        modalContent.style.margin = '0';
    }
}

// Функция для вставки разрыва страницы
function insertPageBreak() {
    if (tinymceEditor) {
        tinymceEditor.insertContent('<div class="page-break"></div>');
    }
}

// Функция для вставки изображения
function insertImage() {
    if (tinymceEditor) {
        showCustomImageDialog(tinymceEditor);
    }
}

// Функция для вставки ссылки
function insertLink() {
    if (tinymceEditor) {
        showCustomLinkDialog(tinymceEditor);
    }
}

// Функция для вставки медиа
function insertMedia() {
    if (tinymceEditor) {
        showCustomMediaDialog(tinymceEditor);
    }
}

// Функция для вставки якоря
function insertAnchor() {
    if (tinymceEditor) {
        showCustomAnchorDialog(tinymceEditor);
    }
}

// Функция для вставки кода
function insertCode() {
    if (tinymceEditor) {
        showCustomCodeDialog(tinymceEditor);
    }
}

// Функция для вставки таблицы
function insertTable() {
    if (tinymceEditor) {
        showCustomTableDialog(tinymceEditor);
    }
}

// Альтернативный способ вставки таблицы
function insertTableAlternative() {
    if (tinymceEditor) {
        showCustomTableDialog(tinymceEditor);
    }
}

// Способ 3: Создание таблицы с выбором размера
function insertTableWithSize() {
    if (tinymceEditor) {
        showCustomTableDialog(tinymceEditor);
    }
}

// Функция создания таблицы с заданными размерами
function createTable(rows, cols) {
    if (tinymceEditor) {
        let tableHtml = '<table style="border-collapse: collapse; width: 100%;"><tbody>';
        
        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHtml += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        
        tableHtml += '</tbody></table>';
        tinymceEditor.insertContent(tableHtml);
    }
}

// Функция для тестирования модальных окон
function testModals() {
    console.log('Testing TinyMCE modals...');
    
    if (!tinymceEditor) {
        console.error('TinyMCE editor not initialized');
        return;
    }
    
    // Тестируем каждую функцию вставки
    const testFunctions = [
        { name: 'Image', func: insertImage },
        { name: 'Link', func: insertLink },
        { name: 'Media', func: insertMedia },
        { name: 'Anchor', func: insertAnchor },
        { name: 'Code', func: insertCode },
        { name: 'Table', func: insertTable },
        { name: 'Table Simple', func: insertTableAlternative },
        { name: 'Table Custom', func: insertTableWithSize }
    ];
    
    testFunctions.forEach((test, index) => {
        setTimeout(() => {
            console.log(`Testing ${test.name}...`);
            try {
                test.func();
                console.log(`✓ ${test.name} modal opened successfully`);
            } catch (error) {
                console.error(`✗ ${test.name} modal failed:`, error);
            }
        }, index * 1000); // Задержка между тестами
    });
}

// Функция для проверки состояния TinyMCE
function checkTinyMCEStatus() {
    console.log('TinyMCE Status Check:');
    console.log('- Editor initialized:', !!tinymceEditor);
    console.log('- Editor destroyed:', tinymceEditor ? tinymceEditor.destroyed : 'N/A');
    console.log('- TinyMCE version:', typeof tinymce !== 'undefined' ? tinymce.majorVersion : 'Not loaded');
    
    if (tinymceEditor) {
        console.log('- Editor container:', tinymceEditor.getContainer());
        console.log('- Editor content:', tinymceEditor.getContent().length > 0 ? 'Has content' : 'Empty');
        console.log('- Available commands:', Object.keys(tinymceEditor.commands || {}));
    }
}

// Делаем функции доступными в глобальной области для тестирования
window.testModals = testModals;
window.checkTinyMCEStatus = checkTinyMCEStatus;
window.insertImage = insertImage;
window.insertLink = insertLink;
window.insertMedia = insertMedia;
window.insertAnchor = insertAnchor;
window.insertCode = insertCode;
window.insertTable = insertTable;
window.insertTableAlternative = insertTableAlternative;
window.insertTableWithSize = insertTableWithSize;

// Улучшенная система шифрования с обфускацией и поддержкой медиа
class AdvancedEncryption {
    constructor() {
        this.saltLength = 32;
        this.ivLength = 16;
        this.keyLength = 32;
        this.iterations = 200000; // Увеличили количество итераций
        this.tagLength = 128; // Длина тега аутентификации
        this.maxAttempts = 3; // Максимальное количество попыток
        this.lockoutTime = 30000; // Время блокировки в мс (30 сек)
        this.attempts = new Map(); // Отслеживание попыток
        this.mediaTypes = ['image', 'video', 'audio']; // Поддерживаемые типы медиа
        this.maxMediaSize = 50 * 1024 * 1024; // Максимальный размер медиа файла (50MB)
    }

    // Генерация случайных байтов
    generateRandomBytes(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return array;
    }

    // Проверка блокировки
    isLocked(identifier) {
        const attempt = this.attempts.get(identifier);
        if (attempt && attempt.count >= this.maxAttempts) {
            const timeSinceLastAttempt = Date.now() - attempt.lastAttempt;
            if (timeSinceLastAttempt < this.lockoutTime) {
                return true;
            } else {
                // Сброс попыток после истечения времени блокировки
                this.attempts.delete(identifier);
            }
        }
        return false;
    }

    // Запись неудачной попытки
    recordFailedAttempt(identifier) {
        const attempt = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 };
        attempt.count++;
        attempt.lastAttempt = Date.now();
        this.attempts.set(identifier, attempt);
    }

    // Сброс попыток при успешной операции
    resetAttempts(identifier) {
        this.attempts.delete(identifier);
    }

    // Улучшенная обфускация данных
    obfuscateData(data) {
        // Добавляем случайные данные в начале, середине и конце
        const prefix = this.generateRandomBytes(128);
        const middle = this.generateRandomBytes(64);
        const suffix = this.generateRandomBytes(128);
        
        // Разделяем данные на части
        const midPoint = Math.floor(data.length / 2);
        const firstPart = data.slice(0, midPoint);
        const secondPart = data.slice(midPoint);
        
        // Создаем обфусцированный массив
        const obfuscated = new Uint8Array(
            prefix.length + 
            firstPart.length + 
            middle.length + 
            secondPart.length + 
            suffix.length
        );
        
        let offset = 0;
        obfuscated.set(prefix, offset);
        offset += prefix.length;
        obfuscated.set(firstPart, offset);
        offset += firstPart.length;
        obfuscated.set(middle, offset);
        offset += middle.length;
        obfuscated.set(secondPart, offset);
        offset += secondPart.length;
        obfuscated.set(suffix, offset);
        
        return obfuscated;
    }

    // Улучшенная деобфускация данных
    deobfuscateData(obfuscatedData) {
        const prefixLength = 128;
        const middleLength = 64;
        const suffixLength = 128;
        
        // Извлекаем части данных
        const firstPart = obfuscatedData.slice(prefixLength, prefixLength + Math.floor((obfuscatedData.length - prefixLength - middleLength - suffixLength) / 2));
        const secondPart = obfuscatedData.slice(prefixLength + firstPart.length + middleLength, obfuscatedData.length - suffixLength);
        
        // Объединяем части
        const deobfuscated = new Uint8Array(firstPart.length + secondPart.length);
        deobfuscated.set(firstPart, 0);
        deobfuscated.set(secondPart, firstPart.length);
        
        return deobfuscated;
    }

    // Генерация ключа из пароля
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Шифрование с обфускацией и защитой от брутфорса
    async encrypt(text, password, identifier = 'default') {
        try {
            // Проверяем блокировку
            if (this.isLocked(identifier)) {
                const remainingTime = Math.ceil((this.lockoutTime - (Date.now() - this.attempts.get(identifier).lastAttempt)) / 1000);
                throw new Error(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
            }

            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            
            // Генерируем соль и IV
            const salt = this.generateRandomBytes(this.saltLength);
            const iv = this.generateRandomBytes(this.ivLength);
            
            // Получаем ключ
            const key = await this.deriveKey(password, salt);
            
            // Шифруем данные с увеличенной длиной тега
            const encrypted = await crypto.subtle.encrypt(
                { 
                    name: 'AES-GCM', 
                    iv: iv,
                    tagLength: this.tagLength
                },
                key,
                data
            );
            
            // Объединяем соль, IV и зашифрованные данные
            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);
            
            // Обфускация
            const obfuscated = this.obfuscateData(combined);
            
            // Сброс попыток при успешном шифровании
            this.resetAttempts(identifier);
            
            // Кодируем в base64
            return btoa(String.fromCharCode(...obfuscated));
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message);
        }
    }

    // Расшифровка с деобфускацией и защитой от брутфорса
    async decrypt(encryptedData, password, identifier = 'default') {
        try {
            // Проверяем блокировку
            if (this.isLocked(identifier)) {
                const remainingTime = Math.ceil((this.lockoutTime - (Date.now() - this.attempts.get(identifier).lastAttempt)) / 1000);
                throw new Error(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
            }

            // Сначала пробуем новый алгоритм
            try {
                // Декодируем из base64
                const obfuscated = new Uint8Array(
                    atob(encryptedData).split('').map(char => char.charCodeAt(0))
                );
                
                // Деобфускация
                const combined = this.deobfuscateData(obfuscated);
                
                // Извлекаем соль, IV и зашифрованные данные
                const salt = combined.slice(0, this.saltLength);
                const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
                const encrypted = combined.slice(this.saltLength + this.ivLength);
                
                // Получаем ключ
                const key = await this.deriveKey(password, salt);
                
                // Расшифровываем с увеличенной длиной тега
                const decrypted = await crypto.subtle.decrypt(
                    { 
                        name: 'AES-GCM', 
                        iv: iv,
                        tagLength: this.tagLength
                    },
                    key,
                    encrypted
                );
                
                // Сброс попыток при успешном дешифровании
                this.resetAttempts(identifier);
                
                const decoder = new TextDecoder();
                return decoder.decode(decrypted);
            } catch (newError) {
                // Записываем неудачную попытку
                this.recordFailedAttempt(identifier);
                
                // Если новый алгоритм не сработал, пробуем старый
                console.log('Trying legacy decryption...');
                return await this.decryptLegacy(encryptedData, password, identifier);
            }
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    }

    // Старый алгоритм расшифровки для совместимости
    async decryptLegacy(encryptedData, password, identifier = 'default') {
        try {
            // Проверяем, является ли данные строкой или ArrayBuffer
            let encryptedBuffer;
            if (typeof encryptedData === 'string') {
                // Если это строка, декодируем из base64
                encryptedBuffer = new Uint8Array(
                    atob(encryptedData).split('').map(char => char.charCodeAt(0))
                );
            } else {
                // Если это ArrayBuffer, используем как есть
                encryptedBuffer = new Uint8Array(encryptedData);
            }
            
            // Извлекаем IV и зашифрованные данные (старый формат)
            const iv = encryptedBuffer.slice(0, 12);
            const encrypted = encryptedBuffer.slice(12);
            
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                encoder.encode(password),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: iv,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );

            const decryptedData = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: new Uint8Array(iv) },
                key,
                new Uint8Array(encrypted)
            );

            // Сброс попыток при успешном дешифровании
            this.resetAttempts(identifier);
            
            const decoder = new TextDecoder();
            return decoder.decode(decryptedData);
        } catch (error) {
            // Записываем неудачную попытку
            this.recordFailedAttempt(identifier);
            throw new Error('Legacy decryption failed: ' + error.message);
        }
    }

    // Дополнительная обфускация файла (добавление ложных данных)
    obfuscateFile(content) {
        const fakeHeaders = [
            '<!-- This is a fake HTML comment -->',
            '/* This is a fake CSS comment */',
            '// This is a fake JavaScript comment',
            '# This is a fake Python comment',
            '<!-- Fake XML declaration -->',
            '/* Fake license header */'
        ];
        
        const fakeContent = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa.'
        ];
        
        // Добавляем случайные ложные данные
        const randomHeader = fakeHeaders[Math.floor(Math.random() * fakeHeaders.length)];
        const randomContent = fakeContent[Math.floor(Math.random() * fakeContent.length)];
        
        return `${randomHeader}\n${randomContent}\n\n${content}\n\n${randomContent}`;
    }

    // Удаление обфускации файла
    deobfuscateFile(obfuscatedContent) {
        // Улучшенное удаление ложных данных
        const lines = obfuscatedContent.split('\n');
        const realContent = [];
        let inRealContent = false;
        let foundStartTag = false;
        
        // Список фраз Lorem ipsum для фильтрации
        const loremPhrases = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa.'
        ];
        
        for (const line of lines) {
            // Проверяем, является ли строка Lorem ipsum
            const isLoremIpsum = loremPhrases.some(phrase => line.trim() === phrase);
            
            // Проверяем, является ли строка fake заголовком
            const isFakeHeader = line.includes('<!-- This is a fake') || 
                                line.includes('# This is a fake') || 
                                line.includes('/* Fake license header */') ||
                                line.includes('<!-- Fake XML declaration -->');
            
            // Находим начало реального контента
            if (line.includes('<!-- Exported on') || line.includes('<!DOCTYPE html>') || line.includes('<html')) {
                inRealContent = true;
                foundStartTag = true;
            }
            
            // Добавляем строку только если это реальный контент и не Lorem ipsum
            if (inRealContent && !isLoremIpsum && !isFakeHeader && !line.includes('fake')) {
                realContent.push(line);
            }
        }
        
        return realContent.join('\n');
    }

    // Проверка типа медиа файла
    isMediaFile(filename) {
        const extension = filename.toLowerCase().split('.').pop();
        const mediaExtensions = {
            'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'],
            'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
            'audio': ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma']
        };
        
        for (const [type, extensions] of Object.entries(mediaExtensions)) {
            if (extensions.includes(extension)) {
                return type;
            }
        }
        return null;
    }

    // Оптимизированное шифрование для медиа файлов
    async encryptMedia(file, password, identifier = 'media') {
        try {
            // Проверяем размер файла
            if (file.size > this.maxMediaSize) {
                throw new Error(`File size exceeds maximum allowed size of ${this.maxMediaSize / (1024 * 1024)}MB`);
            }

            // Проверяем тип файла
            const mediaType = this.isMediaFile(file.name);
            if (!mediaType) {
                throw new Error('Unsupported media file type');
            }

            // Читаем файл как ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            
            // Генерируем соль и IV
            const salt = this.generateRandomBytes(this.saltLength);
            const iv = this.generateRandomBytes(this.ivLength);
            
            // Получаем ключ
            const key = await this.deriveKey(password, salt);
            
            // Шифруем данные
            const encrypted = await crypto.subtle.encrypt(
                { 
                    name: 'AES-GCM', 
                    iv: iv,
                    tagLength: this.tagLength
                },
                key,
                data
            );
            
            // Создаем метаданные
            const metadata = {
                filename: file.name,
                type: file.type,
                size: file.size,
                mediaType: mediaType,
                timestamp: Date.now(),
                version: '2.0'
            };
            
            // Объединяем метаданные, соль, IV и зашифрованные данные
            const metadataJson = JSON.stringify(metadata);
            const metadataBytes = new TextEncoder().encode(metadataJson);
            const metadataLength = new Uint8Array(4);
            new DataView(metadataLength.buffer).setUint32(0, metadataBytes.length, false);
            
            const combined = new Uint8Array(
                metadataLength.length + 
                metadataBytes.length + 
                salt.length + 
                iv.length + 
                encrypted.byteLength
            );
            
            let offset = 0;
            combined.set(metadataLength, offset);
            offset += metadataLength.length;
            combined.set(metadataBytes, offset);
            offset += metadataBytes.length;
            combined.set(salt, offset);
            offset += salt.length;
            combined.set(iv, offset);
            offset += iv.length;
            combined.set(new Uint8Array(encrypted), offset);
            
            // Обфускация для медиа файлов (более агрессивная)
            const obfuscated = this.obfuscateMediaData(combined);
            
            return btoa(String.fromCharCode(...obfuscated));
        } catch (error) {
            throw new Error('Media encryption failed: ' + error.message);
        }
    }

    // Расшифровка медиа файлов
    async decryptMedia(encryptedData, password, identifier = 'media') {
        try {
            // Проверяем блокировку
            if (this.isLocked(identifier)) {
                const remainingTime = Math.ceil((this.lockoutTime - (Date.now() - this.attempts.get(identifier).lastAttempt)) / 1000);
                throw new Error(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
            }

            // Декодируем из base64
            const obfuscated = new Uint8Array(
                atob(encryptedData).split('').map(char => char.charCodeAt(0))
            );
            
            // Деобфускация
            const combined = this.deobfuscateMediaData(obfuscated);
            
            // Извлекаем метаданные
            const metadataLength = new DataView(combined.buffer, 0, 4).getUint32(0, false);
            const metadataBytes = combined.slice(4, 4 + metadataLength);
            const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));
            
            // Извлекаем соль, IV и зашифрованные данные
            const saltOffset = 4 + metadataLength;
            const salt = combined.slice(saltOffset, saltOffset + this.saltLength);
            const ivOffset = saltOffset + this.saltLength;
            const iv = combined.slice(ivOffset, ivOffset + this.ivLength);
            const encryptedOffset = ivOffset + this.ivLength;
            const encrypted = combined.slice(encryptedOffset);
            
            // Получаем ключ
            const key = await this.deriveKey(password, salt);
            
            // Расшифровываем
            const decrypted = await crypto.subtle.decrypt(
                { 
                    name: 'AES-GCM', 
                    iv: iv,
                    tagLength: this.tagLength
                },
                key,
                encrypted
            );
            
            // Сброс попыток при успешном дешифровании
            this.resetAttempts(identifier);
            
            return {
                data: new Uint8Array(decrypted),
                metadata: metadata
            };
        } catch (error) {
            this.recordFailedAttempt(identifier);
            throw new Error('Media decryption failed: ' + error.message);
        }
    }

    // Специальная обфускация для медиа данных
    obfuscateMediaData(data) {
        // Для медиа файлов используем более сложную обфускацию
        const chunks = [];
        const chunkSize = 1024; // 1KB чанки
        
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const randomPadding = this.generateRandomBytes(64);
            
            // Перемешиваем чанк с случайными данными
            const mixedChunk = new Uint8Array(chunk.length + randomPadding.length);
            mixedChunk.set(randomPadding, 0);
            mixedChunk.set(chunk, randomPadding.length);
            
            chunks.push(mixedChunk);
        }
        
        // Объединяем все чанки
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }

    // Деобфускация медиа данных
    deobfuscateMediaData(obfuscatedData) {
        const chunks = [];
        let offset = 0;
        
        while (offset < obfuscatedData.length) {
            // Пропускаем случайные данные (64 байта)
            offset += 64;
            
            // Извлекаем реальные данные (до 1024 байт)
            const chunkSize = Math.min(1024, obfuscatedData.length - offset);
            if (chunkSize > 0) {
                const chunk = obfuscatedData.slice(offset, offset + chunkSize);
                chunks.push(chunk);
                offset += chunkSize;
            }
        }
        
        // Объединяем все чанки
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        offset = 0;
        
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }
}

// Создаем экземпляр улучшенного шифрования
const advancedEncryption = new AdvancedEncryption();

// Система IndexedDB для хранения заметок
class NotesDatabase {
    constructor() {
        this.dbName = 'LocalNotesDB';
        this.dbVersion = 1;
        this.db = null;
    }

    // Инициализация базы данных
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Создаем хранилище для заметок
                if (!db.objectStoreNames.contains('notes')) {
                    const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
                    notesStore.createIndex('creationTime', 'creationTime', { unique: false });
                    notesStore.createIndex('lastModified', 'lastModified', { unique: false });
                    notesStore.createIndex('title', 'title', { unique: false });
                }

                // Создаем хранилище для настроек
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    // Сохранение заметки
    async saveNote(note) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['notes'], 'readwrite');
            const store = transaction.objectStore('notes');
            const request = store.put(note);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Получение всех заметок
    async getAllNotes() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['notes'], 'readonly');
            const store = transaction.objectStore('notes');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Получение заметки по ID
    async getNote(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['notes'], 'readonly');
            const store = transaction.objectStore('notes');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Удаление заметки
    async deleteNote(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['notes'], 'readwrite');
            const store = transaction.objectStore('notes');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Поиск заметок
    async searchNotes(query) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['notes'], 'readonly');
            const store = transaction.objectStore('notes');
            const request = store.getAll();

            request.onsuccess = () => {
                const notes = request.result;
                const filteredNotes = notes.filter(note => {
                    const content = note.content.toLowerCase();
                    const title = (note.title || '').toLowerCase();
                    const searchQuery = query.toLowerCase();
                    
                    return content.includes(searchQuery) || title.includes(searchQuery);
                });
                resolve(filteredNotes);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Сохранение настроек
    async saveSetting(key, value) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Получение настройки
    async getSetting(key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => reject(request.error);
        });
    }

    // Миграция данных из localStorage
    async migrateFromLocalStorage() {
        try {
            const existingNotes = await this.getAllNotes();
            if (existingNotes.length > 0) {
                console.log('Data already migrated to IndexedDB');
                return;
            }

            // Получаем все заметки из localStorage
            const localStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('note_'));
            
            for (const key of localStorageKeys) {
                try {
                    const noteData = JSON.parse(localStorage.getItem(key));
                    const note = {
                        id: key,
                        content: noteData.content,
                        creationTime: noteData.creationTime,
                        lastModified: noteData.lastModified,
                        title: this.extractTitle(noteData.content)
                    };
                    await this.saveNote(note);
                } catch (error) {
                    console.error(`Error migrating note ${key}:`, error);
                }
            }

            console.log(`Migrated ${localStorageKeys.length} notes to IndexedDB`);
        } catch (error) {
            console.error('Migration error:', error);
        }
    }

    // Извлечение заголовка из содержимого заметки
    extractTitle(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
        if (firstHeading) {
            return firstHeading.textContent.trim();
        }
        
        const firstParagraph = tempDiv.querySelector('p');
        if (firstParagraph) {
            const text = firstParagraph.textContent.trim();
            return text.length > 50 ? text.substring(0, 50) + '...' : text;
        }
        
        return 'Без названия';
    }
}

// Создаем экземпляр базы данных
const notesDB = new NotesDatabase();

// Функции для экспорта в различные форматы
function exportToMarkdown(noteContent) {
    // Простое преобразование HTML в Markdown
    let markdown = noteContent
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>')
        .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n')
        .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
        })
        .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
            let counter = 1;
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
        })
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
        .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
        .replace(/<table[^>]*>(.*?)<\/table>/gi, (match, content) => {
            // Простое преобразование таблиц
            let table = content
                .replace(/<tr[^>]*>(.*?)<\/tr>/gi, (trMatch, trContent) => {
                    return trContent.replace(/<td[^>]*>(.*?)<\/td>/gi, '| $1 ') + '|\n';
                })
                .replace(/<th[^>]*>(.*?)<\/th>/gi, '| $1 ');
            return '\n' + table + '\n';
        })
        .replace(/<[^>]*>/g, '') // Удаляем оставшиеся HTML теги
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Убираем лишние переносы строк
        .trim();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `note_${timestamp}.md`;
    link.click();
}

function exportToHTML(noteContent) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Note</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #1e1e1e;
            color: #ffffff;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff;
            margin-top: 24px;
            margin-bottom: 16px;
        }
        p {
            margin-bottom: 16px;
        }
        blockquote {
            border-left: 4px solid #58a6ff;
            background: #161b22;
            padding: 16px 20px;
            margin: 16px 0;
            border-radius: 0 6px 6px 0;
            font-style: italic;
        }
        code {
            background: #0d1117;
            color: #e6edf3;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        pre {
            background: #0d1117;
            color: #e6edf3;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        table td, table th {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background-color: #f5f5f5;
            color: #000;
            font-weight: bold;
        }
        a {
            color: #58a6ff;
            text-decoration: none;
        }
        a:hover {
            color: #79c0ff;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
    </style>
</head>
<body>
    ${noteContent}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `note_${timestamp}.html`;
    link.click();
}

function exportToPDF(noteContent) {
    // Для экспорта в PDF используем window.print() с CSS для печати
    const printWindow = window.open('', '_blank');
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Note</title>
    <style>
        @media print {
            @page {
                margin: 1in;
                size: A4;
            }
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #000;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #000;
            margin-top: 24px;
            margin-bottom: 16px;
        }
        p {
            margin-bottom: 16px;
        }
        blockquote {
            border-left: 4px solid #007acc;
            background: #f5f5f5;
            padding: 16px 20px;
            margin: 16px 0;
            border-radius: 0 6px 6px 0;
            font-style: italic;
        }
        code {
            background: #f5f5f5;
            color: #d63384;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        pre {
            background: #f5f5f5;
            color: #000;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        table td, table th {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        a {
            color: #007acc;
            text-decoration: none;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    ${noteContent}
</body>
</html>`;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Ждем загрузки контента и затем печатаем
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Обновляем функцию exportNote для поддержки различных форматов
function exportNoteWithFormat(noteContent, format = 'html') {
    switch (format) {
        case 'markdown':
            exportToMarkdown(noteContent);
            break;
        case 'html':
            exportToHTML(noteContent);
            break;
        case 'pdf':
            exportToPDF(noteContent);
            break;
        default:
            exportToHTML(noteContent);
    }
}

// Улучшенная функция для показа опций экспорта
function showExportOptions(noteContent) {
    const exportModal = document.createElement('div');
    exportModal.className = 'export-modal';
    exportModal.innerHTML = `
        <div class="export-modal-content">
            <h3>${currentLang.startsWith("ru") ? "Выберите формат экспорта" : "Choose export format"}</h3>
            <div class="export-options">
                <button class="export-option" data-format="html">
                    <span class="export-icon">🌐</span>
                    <span class="export-text">HTML</span>
                    <span class="export-desc">${currentLang.startsWith("ru") ? "Веб-страница (без шифрования)" : "Web page (unencrypted)"}</span>
                </button>
                <button class="export-option" data-format="encrypted">
                    <span class="export-icon">🔒</span>
                    <span class="export-text">Encrypted</span>
                    <span class="export-desc">${currentLang.startsWith("ru") ? "Зашифрованный файл" : "Encrypted file"}</span>
                </button>
                <button class="export-option" data-format="markdown">
                    <span class="export-icon">📝</span>
                    <span class="export-text">Markdown</span>
                    <span class="export-desc">${currentLang.startsWith("ru") ? "Текстовый формат" : "Text format"}</span>
                </button>
                <button class="export-option" data-format="pdf">
                    <span class="export-icon">📄</span>
                    <span class="export-text">PDF</span>
                    <span class="export-desc">${currentLang.startsWith("ru") ? "Документ для печати" : "Print document"}</span>
                </button>
            </div>
            <button class="export-close">${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
        </div>
    `;
    
    document.body.appendChild(exportModal);
    
    exportModal.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', () => {
            const format = option.dataset.format;
            
            if (format === 'encrypted') {
                // Запрашиваем пароль для шифрования
                showCustomPrompt(
                    currentLang.startsWith("ru") ? "Шифрование заметки" : "Encrypt Note",
                    currentLang.startsWith("ru") ? "Введите пароль для шифрования:" : "Enter password for encryption:",
                    currentLang.startsWith("ru") ? "Пароль" : "Password",
                    "",
                    (password) => {
                        if (password && password.trim()) {
                            exportNote(noteContent, password.trim());
                        } else if (password !== null) {
                            showCustomAlert(
                                t("error"),
                                t("errorEmptyPassword"),
                                "error"
                            );
                        }
                    }
                );
            } else if (format === 'html') {
                exportNoteHTML(noteContent);
            } else {
            exportNoteWithFormat(noteContent, format);
            }
            
            document.body.removeChild(exportModal);
        });
    });
    
    exportModal.querySelector('.export-close').addEventListener('click', () => {
        document.body.removeChild(exportModal);
    });
    
    // Закрытие по клику вне модального окна с поддержкой Pointer Events
    exportModal.addEventListener('pointerdown', (e) => {
        if (e.target === exportModal) {
            document.body.removeChild(exportModal);
        }
    });
    
    // Fallback для старых браузеров
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            document.body.removeChild(exportModal);
        }
    });
}

// Функция для обновления текста футера
function updateFooterTexts() {
    if (typeof t === 'undefined') {
        console.log('Translation function not available');
        return;
    }
    
    try {
        // Обновляем описание проекта
        const footerDescription = document.getElementById('footerDescription');
        if (footerDescription) {
            footerDescription.textContent = t('footerDescription');
        }
        
        // Обновляем ссылки
        const cookiePolicyLink = document.getElementById('cookiePolicyLink');
        if (cookiePolicyLink) {
            cookiePolicyLink.textContent = t('cookiePolicy');
        }
        
        const termsOfUseLink = document.getElementById('termsOfUseLink');
        if (termsOfUseLink) {
            termsOfUseLink.textContent = t('termsOfUse');
        }
        
        const privacyPolicyLink = document.getElementById('privacyPolicyLink');
        if (privacyPolicyLink) {
            privacyPolicyLink.textContent = t('privacyPolicy');
        }
        
        const byAuthorLink = document.getElementById('byAuthorLink');
        if (byAuthorLink) {
            byAuthorLink.textContent = t('byAuthor');
        }
        
        const allRightsReserved = document.getElementById('allRightsReserved');
        if (allRightsReserved) {
            allRightsReserved.textContent = t('allRightsReserved');
        }
        
        console.log('Footer texts updated successfully');
    } catch (error) {
        console.error('Error updating footer texts:', error);
    }
}

