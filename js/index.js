// Адаптивная система определения устройств
class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            largeTablet: 1366,
            desktop: 1200
        };
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMobile = this.currentBreakpoint === 'mobile';
        this.isTablet = this.currentBreakpoint === 'tablet';
        this.isLargeTablet = this.currentBreakpoint === 'largeTablet';
        this.isDesktop = this.currentBreakpoint === 'desktop';
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isTabletDevice = this.isTablet || this.isLargeTablet;
        
        this.init();
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        if (width < this.breakpoints.largeTablet) return 'largeTablet';
        return 'desktop';
    }
    
    init() {
        // Добавляем классы для устройств
        document.documentElement.classList.add(`${this.currentBreakpoint}-device`);
        if (this.isTouch) {
            document.documentElement.classList.add('touch-device');
        }
        if (this.isTabletDevice) {
            document.documentElement.classList.add('tablet-device');
        }

        // Слушаем изменения размера окна
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Слушаем изменения ориентации
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        
        // Инициализируем touch-улучшения для планшетов
        if (this.isTabletDevice) {
            this.initTabletOptimizations();
        }
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
            this.isLargeTablet = this.currentBreakpoint === 'largeTablet';
            this.isDesktop = this.currentBreakpoint === 'desktop';
            this.isTabletDevice = this.isTablet || this.isLargeTablet;
            
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
            try {
                // Перезагружаем редактор с новыми настройками
                const currentContent = tinymceEditor.getContent();
                tinymceEditor.destroy();
                
                setTimeout(async () => {
                    await initTinyMCE();
                    if (tinymceEditor && currentContent) {
                        tinymceEditor.setContent(currentContent);
                    }
                }, 100);
            } catch (error) {
                console.warn('Error updating editor layout:', error);
                // Просто перезагружаем редактор без сохранения контента
                setTimeout(async () => {
                    await initTinyMCE();
                }, 100);
            }
        }
    }
    
    initTabletOptimizations() {
        // Улучшения для планшетов
        this.optimizeTouchTargets();
        this.optimizeScrolling();
        this.optimizeKeyboard();
        this.optimizeGestures();
    }
    
    optimizeTouchTargets() {
        // Увеличиваем размеры touch-целей для планшетов
        const touchTargets = document.querySelectorAll('button, input, select, textarea, .note, .modal-buttons-container button');
        
        touchTargets.forEach(target => {
            if (this.isTabletDevice) {
                target.style.minHeight = '44px';
                target.style.touchAction = 'manipulation';
                target.style.webkitTapHighlightColor = 'transparent';
            }
        });
        
        // Принудительно применяем полноэкранный режим для модальных окон на планшетах
        if (this.isTabletDevice) {
            this.forceFullscreenModal();
        }
    }
    
    forceFullscreenModal() {
        // Наблюдаем за появлением модальных окон
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const modal = mutation.target;
                    if (modal.classList.contains('modal') && modal.style.display === 'block') {
                        this.applyFullscreenModal(modal);
                    }
                }
            });
        });
        
        // Наблюдаем за всеми модальными окнами
        document.querySelectorAll('.modal').forEach(modal => {
            observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
        });
    }
    
    applyFullscreenModal(modal) {
        if (!this.isTabletDevice) return;
        
        // Принудительно применяем полноэкранные стили
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                border-radius: 0 !important;
                position: fixed !important;
                transform: none !important;
                display: flex !important;
                flex-direction: column !important;
                background: var(--modal-bg) !important;
                border: none !important;
                box-shadow: none !important;
                z-index: 10000 !important;
            `;
            
            // Применяем стили к TinyMCE
            const tinymceContainer = modalContent.querySelector('.tinymce');
            if (tinymceContainer) {
                tinymceContainer.style.cssText = `
                    flex: 1 !important;
                    height: calc(100vh - 120px) !important;
                    min-height: calc(100vh - 120px) !important;
                    width: 100% !important;
                `;
            }
            
            const toxTinymce = modalContent.querySelector('.tox-tinymce');
            if (toxTinymce) {
                toxTinymce.style.cssText = `
                    height: calc(100vh - 120px) !important;
                    width: 100% !important;
                    border: none !important;
                    border-radius: 0 !important;
                `;
            }
        }
    }
    
    optimizeScrolling() {
        // Улучшаем скроллинг для планшетов
        if (this.isTabletDevice) {
            // Добавляем плавный скроллинг
            document.documentElement.style.scrollBehavior = 'smooth';
            
            // Оптимизируем скроллинг для заметок
            const notesContainer = document.getElementById('notesContainer');
            if (notesContainer) {
                notesContainer.style.webkitOverflowScrolling = 'touch';
                notesContainer.style.overscrollBehavior = 'contain';
            }
        }
    }
    
    optimizeKeyboard() {
        // Улучшения для виртуальной клавиатуры на планшетах
        if (this.isTabletDevice) {
            // Предотвращаем зум при фокусе на input
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (this.isTabletDevice) {
                        input.style.fontSize = '16px'; // Предотвращает зум на iOS
                    }
                });
            });
        }
    }
    
    optimizeGestures() {
        // Оптимизация жестов для планшетов
        if (this.isTabletDevice) {
            // Предотвращаем случайные жесты
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault(); // Предотвращаем зум
                }
            }, { passive: false });
            
            // Улучшаем обработку свайпов
            let startY = 0;
            document.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const diffY = startY - currentY;
                
                // Предотвращаем pull-to-refresh на планшетах
                if (diffY < 0 && window.scrollY === 0) {
                    e.preventDefault();
                }
            }, { passive: false, cancelable: true });
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

// Функция для проверки поддерживаемых расширений файлов
function isSupportedFileExtension(filename) {
    const supportedExtensions = [
        '.note',  // зашифрованные заметки
        '.html',  // HTML файлы
        '.md'     // Markdown файлы
    ];
    
    const fileExtension = '.' + filename.split('.').pop().toLowerCase();
    return supportedExtensions.includes(fileExtension);
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
    } else {
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
    }
    
    // Обработчик для поля импорта
    const importInput = document.getElementById("importInput");
    if (importInput) {
        importInput.addEventListener("change", importNotesWithFormat);
    }
    
        // Обработчик для поля поиска
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                filterNotes();
            });
        
        // Добавляем обработчик для клавиши Escape (очистка поиска)
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                searchInput.value = "";
                filterNotes();
                searchInput.blur(); // Убираем фокус с поля поиска
            }
        });
        
        // Добавляем обработчик для клавиши Enter (фокус на первую найденную заметку)
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const firstVisibleNote = document.querySelector(".note:not(.hidden)");
                if (firstVisibleNote) {
                    firstVisibleNote.scrollIntoView({ behavior: "smooth", block: "center" });
                    firstVisibleNote.focus();
                }
            }
        });
        }
    
    // Обработчик для кнопки очистки всех заметок
    const clearAllButton = document.getElementById("clearAllButton");
    if (clearAllButton) {
        clearAllButton.addEventListener("click", () => {
            showClearAllConfirmationModal();
        });
    }
    
}

// Функция для показа модалки подтверждения очистки всех заметок
function showClearAllConfirmationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content modal-content-warning">
            <div class="modal-content-inner">
                <h3><i class="fas fa-exclamation-triangle"></i> ${t("confirmDeleteAllTitle")}</h3>
                <p>${t("confirmDeleteAll")}</p>
                <div class="warning-details">
                    <p><strong>⚠️ ${t("warning")}:</strong> ${t("clearAllWarning")}</p>
                    <ul>
                        <li>${t("clearAllWarning1")}</li>
                        <li>${t("clearAllWarning2")}</li>
                        <li>${t("clearAllWarning3")}</li>
                    </ul>
                </div>
            </div>
            <div class="modal-buttons-container">
                <button id="confirmClearAllBtn" class="btn cancel">
                    <i class="fas fa-trash"></i> ${t("deleteAll")}
                </button>
                <button id="cancelClearAllBtn" class="btn save">
                    <i class="fas fa-times"></i> ${t("cancel")}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
    // Обработчики кнопок
    document.getElementById('confirmClearAllBtn').addEventListener('click', () => {
                        clearAllNotes();
        closeModal();
    });
    
    document.getElementById('cancelClearAllBtn').addEventListener('click', () => {
        closeModal();
    });
    
    // Закрытие по клику вне модалки
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.classList.remove('modal-open');
    }
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
        showCustomAlert(
            t("error"),
            t("errorClearingNotes"),
            "error"
        );
    }
}

// Получаем текущий язык системы (предполагаем, что это en или ru)
const getCurrentLang = () => {
    const lang = window.currentLang || navigator.language || navigator.userLanguage || 'en';
    return lang.split('-')[0]; // Извлекаем короткий код языка
};
const currentLang = getCurrentLang();

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
    const lang = window.currentLang || navigator.language || 'en';
    const currentLang = lang.split('-')[0]; // Извлекаем короткий код языка
    const langMap = {
        'ru': 'ru',
        'ua': 'ua', 
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
    
    const result = langMap[currentLang] || 'en';
    return result;
}

// Функция для загрузки файлов переводов TinyMCE
async function loadTinyMCETranslations() {
    const lang = getTinyMCELanguage();
    
    // Если язык английский, переводы не нужны
    if (lang === 'en') {
        return Promise.resolve();
    }
    
    const translationUrl = `/editor_news/langs/${lang}.js`;
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = translationUrl;
        script.onload = () => {
            resolve();
        };
        script.onerror = (error) => {
            resolve(); // Не отклоняем промис, просто используем английский
        };
        document.head.appendChild(script);
    });
}

// Функция для настройки переводов выпадающих меню стилей
function setupStyleMenuTranslations(editor) {
    // Получаем текущий язык
    const lang = window.currentLang || navigator.language || 'en';
    const langCode = lang.split('-')[0];
    
    // Словарь переводов для элементов стилей для всех языков
    const styleTranslations = {
        'en': {
            'Paragraph': 'Paragraph',
            'Heading 1': 'Heading 1',
            'Heading 2': 'Heading 2', 
            'Heading 3': 'Heading 3',
            'Heading 4': 'Heading 4',
            'Heading 5': 'Heading 5',
            'Heading 6': 'Heading 6',
            'Preformatted': 'Preformatted',
            'Blockquote': 'Blockquote',
            'Address': 'Address',
            'Code': 'Code',
            'Div': 'Div'
        },
        'ru': {
            'Paragraph': 'Абзац',
            'Heading 1': 'Заголовок 1',
            'Heading 2': 'Заголовок 2', 
            'Heading 3': 'Заголовок 3',
            'Heading 4': 'Заголовок 4',
            'Heading 5': 'Заголовок 5',
            'Heading 6': 'Заголовок 6',
            'Preformatted': 'Предварительно отформатированный',
            'Blockquote': 'Блок цитирования',
            'Address': 'Адрес',
            'Code': 'Код',
            'Div': 'Div'
        },
        'ua': {
            'Paragraph': 'Параграф',
            'Heading 1': 'Заголовок 1',
            'Heading 2': 'Заголовок 2', 
            'Heading 3': 'Заголовок 3',
            'Heading 4': 'Заголовок 4',
            'Heading 5': 'Заголовок 5',
            'Heading 6': 'Заголовок 6',
            'Preformatted': 'Попередньо відформатований',
            'Blockquote': 'Блок цитування',
            'Address': 'Адреса',
            'Code': 'Код',
            'Div': 'Div'
        },
        'pl': {
            'Paragraph': 'Akapit',
            'Heading 1': 'Nagłówek 1',
            'Heading 2': 'Nagłówek 2', 
            'Heading 3': 'Nagłówek 3',
            'Heading 4': 'Nagłówek 4',
            'Heading 5': 'Nagłówek 5',
            'Heading 6': 'Nagłówek 6',
            'Preformatted': 'Wstępnie sformatowany',
            'Blockquote': 'Cytat blokowy',
            'Address': 'Adres',
            'Code': 'Kod',
            'Div': 'Div'
        },
        'cs': {
            'Paragraph': 'Odstavec',
            'Heading 1': 'Nadpis 1',
            'Heading 2': 'Nadpis 2', 
            'Heading 3': 'Nadpis 3',
            'Heading 4': 'Nadpis 4',
            'Heading 5': 'Nadpis 5',
            'Heading 6': 'Nadpis 6',
            'Preformatted': 'Předformátovaný',
            'Blockquote': 'Bloková citace',
            'Address': 'Adresa',
            'Code': 'Kód',
            'Div': 'Div'
        },
        'bg': {
            'Paragraph': 'Параграф',
            'Heading 1': 'Заглавие 1',
            'Heading 2': 'Заглавие 2', 
            'Heading 3': 'Заглавие 3',
            'Heading 4': 'Заглавие 4',
            'Heading 5': 'Заглавие 5',
            'Heading 6': 'Заглавие 6',
            'Preformatted': 'Предварително форматиран',
            'Blockquote': 'Блок цитат',
            'Address': 'Адрес',
            'Code': 'Код',
            'Div': 'Div'
        },
        'hr': {
            'Paragraph': 'Paragraf',
            'Heading 1': 'Naslov 1',
            'Heading 2': 'Naslov 2', 
            'Heading 3': 'Naslov 3',
            'Heading 4': 'Naslov 4',
            'Heading 5': 'Naslov 5',
            'Heading 6': 'Naslov 6',
            'Preformatted': 'Unaprijed formatiran',
            'Blockquote': 'Blok citat',
            'Address': 'Adresa',
            'Code': 'Kod',
            'Div': 'Div'
        },
        'sr': {
            'Paragraph': 'Параграф',
            'Heading 1': 'Наслов 1',
            'Heading 2': 'Наслов 2', 
            'Heading 3': 'Наслов 3',
            'Heading 4': 'Наслов 4',
            'Heading 5': 'Наслов 5',
            'Heading 6': 'Наслов 6',
            'Preformatted': 'Унапред форматиран',
            'Blockquote': 'Блок цитат',
            'Address': 'Адреса',
            'Code': 'Код',
            'Div': 'Div'
        },
        'bs': {
            'Paragraph': 'Paragraf',
            'Heading 1': 'Naslov 1',
            'Heading 2': 'Naslov 2', 
            'Heading 3': 'Naslov 3',
            'Heading 4': 'Naslov 4',
            'Heading 5': 'Naslov 5',
            'Heading 6': 'Naslov 6',
            'Preformatted': 'Unaprijed formatiran',
            'Blockquote': 'Blok citat',
            'Address': 'Adresa',
            'Code': 'Kod',
            'Div': 'Div'
        },
        'mk': {
            'Paragraph': 'Параграф',
            'Heading 1': 'Наслов 1',
            'Heading 2': 'Наслов 2', 
            'Heading 3': 'Наслов 3',
            'Heading 4': 'Наслов 4',
            'Heading 5': 'Наслов 5',
            'Heading 6': 'Наслов 6',
            'Preformatted': 'Претходно форматиран',
            'Blockquote': 'Блок цитат',
            'Address': 'Адреса',
            'Code': 'Код',
            'Div': 'Div'
        },
        'sl': {
            'Paragraph': 'Odstavek',
            'Heading 1': 'Naslov 1',
            'Heading 2': 'Naslov 2', 
            'Heading 3': 'Naslov 3',
            'Heading 4': 'Naslov 4',
            'Heading 5': 'Naslov 5',
            'Heading 6': 'Naslov 6',
            'Preformatted': 'Vnaprej oblikovan',
            'Blockquote': 'Blok citat',
            'Address': 'Naslov',
            'Code': 'Koda',
            'Div': 'Div'
        },
        'sk': {
            'Paragraph': 'Odstavec',
            'Heading 1': 'Nadpis 1',
            'Heading 2': 'Nadpis 2', 
            'Heading 3': 'Nadpis 3',
            'Heading 4': 'Nadpis 4',
            'Heading 5': 'Nadpis 5',
            'Heading 6': 'Nadpis 6',
            'Preformatted': 'Predformátovaný',
            'Blockquote': 'Bloková citácia',
            'Address': 'Adresa',
            'Code': 'Kód',
            'Div': 'Div'
        }
    };
    
    // Получаем переводы для текущего языка
    const currentTranslations = styleTranslations[langCode] || styleTranslations['en'];
    
    // Функция для перевода элементов в выпадающих меню
    function translateStyleMenuItems() {
        // Ищем все выпадающие меню стилей
        const styleMenus = document.querySelectorAll('.tox-menu, .tox-collection');
        
        styleMenus.forEach(menu => {
            // Ищем элементы с текстом стилей
            const items = menu.querySelectorAll('.tox-collection__item-label p, .tox-collection__item-label h1, .tox-collection__item-label h2, .tox-collection__item-label h3, .tox-collection__item-label h4, .tox-collection__item-label h5, .tox-collection__item-label h6, .tox-collection__item-label pre, .tox-collection__item-label blockquote, .tox-collection__item-label address, .tox-collection__item-label code, .tox-collection__item-label div');
            
            items.forEach(item => {
                const text = item.textContent.trim();
                if (currentTranslations[text]) {
                    item.textContent = currentTranslations[text];
                }
            });
        });
    }
    
    // Наблюдатель за изменениями DOM для отслеживания появления новых меню
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (
                            node.classList.contains('tox-menu') ||
                            node.classList.contains('tox-collection') ||
                            node.querySelector('.tox-menu') ||
                            node.querySelector('.tox-collection')
                        )) {
                            // Небольшая задержка для полной загрузки содержимого
                            setTimeout(translateStyleMenuItems, 50);
                        }
                    }
                });
            }
        });
    });
    
    // Начинаем наблюдение за изменениями в документе
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Также переводим при открытии редактора
    setTimeout(translateStyleMenuItems, 200);
    
    // Переводим при изменении выделения (когда могут появляться новые меню)
    editor.on('selectionchange', function() {
        setTimeout(translateStyleMenuItems, 100);
    });
}

// Функция для настройки обработчиков скрытия всех всплывающих панелей
function setupPopupCloseHandlers(editor) {
    let isMouseOverPopup = false;
    let isMouseOverToolbar = false;
    
    // Обработчик клика вне области редактора
    document.addEventListener('click', function(e) {
        const editorContainer = editor.getContainer();
        const isClickInsideEditor = editorContainer && editorContainer.contains(e.target);
        
        if (!isClickInsideEditor && !isMouseOverPopup) {
            hideAllPopups();
        }
    });
    
    // Обработчик движения мыши для отслеживания нахождения над всплывающими панелями
    document.addEventListener('mouseover', function(e) {
        const target = e.target;
        const popup = target.closest('.tox-pop, .tox-tooltip, .tox-collection, .tox-menu, .tox-swatches');
        
        if (popup) {
            isMouseOverPopup = true;
        } else {
            isMouseOverPopup = false;
        }
    });
    
    // Обработчик движения мыши для отслеживания нахождения над тулбаром
    document.addEventListener('mouseover', function(e) {
        const target = e.target;
        const toolbar = target.closest('.tox-toolbar');
        
        if (toolbar) {
            isMouseOverToolbar = true;
        } else {
            isMouseOverToolbar = false;
        }
    });
    
    // Обработчик потери фокуса редактора
    editor.on('blur', function() {
        setTimeout(() => {
            if (!isMouseOverPopup && !isMouseOverToolbar) {
                hideAllPopups();
            }
        }, 100);
    });
    
    // Обработчик изменения выделения в редакторе
    editor.on('selectionchange', function() {
        setTimeout(() => {
            if (!isMouseOverPopup && !isMouseOverToolbar) {
                hideAllPopups();
            }
        }, 50);
    });
    
    // Обработчик клика внутри редактора
    editor.on('click', function(e) {
        const target = e.target;
        const isClickOnTable = target.closest('table');
        const isClickOnToolbar = target.closest('.tox-toolbar');
        const isClickOnPopup = target.closest('.tox-pop, .tox-tooltip, .tox-collection, .tox-menu, .tox-swatches');
        
        // Если клик не на таблице, тулбаре или всплывающей панели, скрываем только нежелательные панели
        if (!isClickOnTable && !isClickOnToolbar && !isClickOnPopup) {
            hideAllPopups();
        }
    });
    
    // Обработчик нажатия клавиш
    document.addEventListener('keydown', function(e) {
        // ESC - скрыть все всплывающие панели
        if (e.key === 'Escape') {
            hideAllPopups();
        }
    });
}

// Функция для скрытия всех всплывающих панелей
function hideAllPopups() {
    // Скрываем только нежелательные всплывающие панели, но не контекстные панели таблиц
    const unwantedPopups = document.querySelectorAll('.tox-tooltip:not(.tox-pop__dialog), .tox-collection:not(.tox-pop__dialog), .tox-menu:not(.tox-pop__dialog), .tox-swatches');
    unwantedPopups.forEach(popup => {
        // Не скрываем контекстные панели таблиц
        if (!popup.closest('.tox-pop[data-alloy-placement]')) {
            popup.style.display = 'none';
            popup.style.visibility = 'hidden';
            popup.style.opacity = '0';
            popup.classList.add('tox-pop__dialog--hidden');
        }
    });
}

// Функция для настройки обработчиков всплывающих панелей таблицы
function setupTableToolbarHandlers(editor) {
    // Скрываем всплывающие панели при клике вне таблицы
    editor.on('click', function(e) {
        const target = e.target;
        const isTableElement = target.closest('table') || target.closest('.tox-pop__dialog');
        
        if (!isTableElement) {
            // Скрываем все всплывающие панели
            const popups = document.querySelectorAll('.tox-pop__dialog');
            popups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('tox-pop__dialog--active');
                popup.classList.add('tox-pop__dialog--hidden');
            });
        }
    });
    
    // Скрываем панели при изменении позиции курсора
    editor.on('SelectionChange', function(e) {
        const selection = editor.selection;
        const node = selection.getNode();
        const isTableElement = node.closest('table');
        
        if (!isTableElement) {
            // Скрываем все всплывающие панели
            const popups = document.querySelectorAll('.tox-pop__dialog');
            popups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('tox-pop__dialog--active');
                popup.classList.add('tox-pop__dialog--hidden');
            });
        }
    });
    
    // Скрываем только нежелательные панели при потере фокуса
    editor.on('Blur', function() {
        const unwantedPopups = document.querySelectorAll('.tox-pop__dialog:not(.tox-pop[data-alloy-placement] .tox-pop__dialog)');
        unwantedPopups.forEach(popup => {
            popup.style.display = 'none';
            popup.classList.remove('tox-pop__dialog--active');
            popup.classList.add('tox-pop__dialog--hidden');
        });
    });
    
    // Скрываем только нежелательные панели при нажатии Escape
    editor.on('keydown', function(e) {
        if (e.key === 'Escape') {
            const unwantedPopups = document.querySelectorAll('.tox-pop__dialog:not(.tox-pop[data-alloy-placement] .tox-pop__dialog)');
            unwantedPopups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('tox-pop__dialog--active');
                popup.classList.add('tox-pop__dialog--hidden');
            });
        }
    });
    
    // Глобальный обработчик клика для скрытия нежелательных панелей при клике вне редактора
    document.addEventListener('click', function(e) {
        const isInsideEditor = e.target.closest('.tox-tinymce') || e.target.closest('.tox-pop__dialog');
        
        if (!isInsideEditor) {
            const unwantedPopups = document.querySelectorAll('.tox-pop__dialog:not(.tox-pop[data-alloy-placement] .tox-pop__dialog)');
            unwantedPopups.forEach(popup => {
                popup.style.display = 'none';
                popup.classList.remove('tox-pop__dialog--active');
                popup.classList.add('tox-pop__dialog--hidden');
            });
        }
    });
}

// Функция для отключения нежелательных всплывающих подсказок
function disableAllTooltips(editor) {
    // Отключаем всплывающие подсказки только для основных кнопок, но не для контекстных панелей
    editor.on('init', function() {
        const mainToolbar = editor.getContainer().querySelector('.tox-toolbar:not(.tox-pop__dialog .tox-toolbar)');
        if (mainToolbar) {
            const buttons = mainToolbar.querySelectorAll('.tox-tbtn');
            buttons.forEach(button => {
                button.removeAttribute('title');
                button.removeAttribute('aria-label');
            });
        }
    });
    
    // Скрываем только нежелательные всплывающие подсказки при их появлении
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && (
                            node.classList.contains('tox-tooltip') ||
                            node.classList.contains('tox-collection') ||
                            node.classList.contains('tox-menu') ||
                            node.classList.contains('tox-swatches')
                        )) {
                            // Не скрываем контекстные панели таблиц
                            if (!node.closest('.tox-pop[data-alloy-placement]')) {
                                // Агрессивное скрытие только нежелательных элементов
                                node.style.display = 'none';
                                node.style.visibility = 'hidden';
                                node.style.opacity = '0';
                                node.style.pointerEvents = 'none';
                                node.style.position = 'absolute';
                                node.style.left = '-9999px';
                                node.style.top = '-9999px';
                                node.style.width = '0';
                                node.style.height = '0';
                                node.style.overflow = 'hidden';
                                node.style.zIndex = '-1';
                                node.remove();
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Наблюдаем за изменениями в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Скрываем только нежелательные существующие подсказки
    const unwantedTooltips = document.querySelectorAll('.tox-tooltip:not(.tox-pop__dialog), .tox-collection:not(.tox-pop__dialog), .tox-menu:not(.tox-pop__dialog), .tox-swatches');
    unwantedTooltips.forEach(tooltip => {
        // Не скрываем контекстные панели таблиц
        if (!tooltip.closest('.tox-pop[data-alloy-placement]')) {
            tooltip.style.display = 'none';
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.position = 'absolute';
            tooltip.style.left = '-9999px';
            tooltip.style.top = '-9999px';
            tooltip.style.width = '0';
            tooltip.style.height = '0';
            tooltip.style.overflow = 'hidden';
            tooltip.style.zIndex = '-1';
            tooltip.remove();
        }
    });
    
    // Дополнительная проверка каждые 100мс - только для нежелательных элементов
    setInterval(function() {
        const unwantedElements = document.querySelectorAll('.tox-tooltip:not(.tox-pop__dialog), .tox-collection:not(.tox-pop__dialog), .tox-menu:not(.tox-pop__dialog)');
        unwantedElements.forEach(element => {
            // Скрываем только нежелательные элементы, но не контекстные панели таблиц
            if (!element.closest('.tox-pop[data-alloy-placement]')) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.style.pointerEvents = 'none';
                element.style.position = 'absolute';
                element.style.left = '-9999px';
                element.style.top = '-9999px';
                element.style.width = '0';
                element.style.height = '0';
                element.style.overflow = 'hidden';
                element.style.zIndex = '-1';
                element.remove();
            }
        });
    }, 100);
}

function getTinyMCETranslation(key) {
    const lang = window.currentLang || navigator.language || 'en';
    const currentLang = lang.split('-')[0];
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
            };
            img.onerror = () => {
            };
            img.src = url;
        });
        
    } catch (error) {
    }
}

// Инициализация приложения
window.onload = async () => {
    try {
        
        // Инициализируем IndexedDB
        if (typeof notesDB !== 'undefined') {
            await notesDB.init();
        } else {
            throw new Error('notesDB is not defined');
        }
        
        // Инициализируем TinyMCE
        if (typeof tinymce !== 'undefined') {
            try {
                await initTinyMCE();
                
                // Применяем сохраненную тему после инициализации
                setTimeout(() => {
                    const savedTheme = localStorage.getItem('editorTheme');
                }, 500);
                
            } catch (error) {
            }
        } else {
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



// Функция для настройки высоты редактора
function adjustEditorHeight() {
    const editorContainer = document.querySelector('.tinymce');
    const tinyMCEContainer = document.querySelector('.tox-tinymce');
    const editArea = document.querySelector('.tox .tox-edit-area');
    const iframe = document.querySelector('.tox .tox-edit-area iframe');
    
    // Скрываем оригинальный textarea
    const originalTextarea = document.getElementById('editorContainer');
    if (originalTextarea) {
        originalTextarea.style.display = 'none';
    }
    
    if (editorContainer && tinyMCEContainer && editArea) {
        // Устанавливаем высоту контейнера
        editorContainer.style.height = 'auto';
        editorContainer.style.minHeight = '0';
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        
        // Устанавливаем высоту TinyMCE
        tinyMCEContainer.style.height = '100%';
        tinyMCEContainer.style.display = 'flex';
        tinyMCEContainer.style.flexDirection = 'column';
        
        // Устанавливаем высоту области редактирования
        editArea.style.flex = '1';
        editArea.style.height = 'auto';
        editArea.style.minHeight = '0';
        editArea.style.display = 'flex';
        editArea.style.flexDirection = 'column';
        
        // Устанавливаем высоту iframe
        if (iframe) {
            iframe.style.height = '100%';
            iframe.style.minHeight = '300px';
        }
        
        // Принудительно обновляем размеры
        setTimeout(() => {
            if (window.tinymce && window.tinymce.activeEditor) {
                const body = window.tinymce.activeEditor.getBody();
                // Убираем все inline стили, которые мешают
                body.style.minHeight = '';
                body.style.color = '';
                body.style.background = '';
                body.style.fontFamily = '';
                body.style.fontSize = '';
                body.style.lineHeight = '';
                body.style.margin = '';
                body.style.padding = '';
            }
        }, 200);
    }
}

// Функция для периодической очистки inline стилей TinyMCE
function startInlineStyleCleanup() {
    // Очищаем inline стили каждые 100ms для более агрессивной очистки
    setInterval(() => {
        if (window.tinymce && window.tinymce.activeEditor) {
            const body = window.tinymce.activeEditor.getBody();
            if (body) {
                // Убираем все inline стили из body
                body.style.minHeight = '';
                body.style.color = '';
                body.style.backgroundColor = '';
                body.style.background = '';
                body.style.fontFamily = '';
                body.style.fontSize = '';
                body.style.lineHeight = '';
                body.style.margin = '';
                body.style.padding = '';
                body.style.overflowWrap = '';
                body.style.wordWrap = '';
                
                // Убираем inline стили из всех элементов внутри body
                const allElements = body.querySelectorAll('*');
                allElements.forEach(element => {
                    element.style.color = '';
                    element.style.backgroundColor = '';
                    element.style.background = '';
                    element.style.fontFamily = '';
                    element.style.fontSize = '';
                    element.style.lineHeight = '';
                    element.style.margin = '';
                    element.style.padding = '';
                    element.style.overflowWrap = '';
                    element.style.wordWrap = '';
                });
                
                // Дополнительно принудительно устанавливаем правильные стили
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    body.style.color = '#ffffff';
                    body.style.backgroundColor = 'transparent';
                    allElements.forEach(element => {
                        if (element.tagName === 'H1' || element.tagName === 'H2') {
                            element.style.color = '#aefc6e';
                        } else if (element.tagName === 'A') {
                            element.style.color = '#aefc6e';
                        } else {
                            element.style.color = '#ffffff';
                        }
                    });
                } else {
                    body.style.color = '#212529';
                    body.style.backgroundColor = 'transparent';
                    allElements.forEach(element => {
                        if (element.tagName === 'H1' || element.tagName === 'H2') {
                            element.style.color = '#28a745';
                        } else if (element.tagName === 'A') {
                            element.style.color = '#28a745';
                        } else {
                            element.style.color = '#212529';
                        }
                    });
                }
            }
        }
    }, 100);
}

// Функция для принудительного применения стилей темы к TinyMCE
function applyThemeToTinyMCE() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Применяем стили ко всем элементам TinyMCE
    const allTinyMCEElements = document.querySelectorAll('.tox *');
    
    allTinyMCEElements.forEach(element => {
        // Убираем все фоны и границы
        element.style.background = 'transparent';
        element.style.border = 'none';
        element.style.boxShadow = 'none';
        
        // Применяем цвета в зависимости от темы
        if (element.classList.contains('tox-tbtn') || element.classList.contains('tox-toolbar')) {
            if (currentTheme === 'dark') {
                element.style.color = '#ffffff';
            } else {
                element.style.color = '#212529';
            }
        }
        
        // Специальная обработка для SVG иконок
        if (element.tagName === 'svg' || element.classList.contains('tox-icon')) {
            if (currentTheme === 'dark') {
                element.style.fill = '#ffffff';
                element.style.color = '#ffffff';
            } else {
                element.style.fill = '#212529';
                element.style.color = '#212529';
            }
        }
    });
    
    // Очищаем inline стили из содержимого TinyMCE
    setTimeout(() => {
        if (window.tinymce && window.tinymce.activeEditor) {
            const body = window.tinymce.activeEditor.getBody();
            if (body) {
                // Убираем все inline стили из body
                body.style.minHeight = '';
                body.style.color = '';
                body.style.background = '';
                body.style.fontFamily = '';
                body.style.fontSize = '';
                body.style.lineHeight = '';
                body.style.margin = '';
                body.style.padding = '';
                
                // Убираем inline стили из всех элементов внутри body
                const allElements = body.querySelectorAll('*');
                allElements.forEach(element => {
                    element.style.color = '';
                    element.style.backgroundColor = '';
                    element.style.background = '';
                    element.style.fontFamily = '';
                    element.style.fontSize = '';
                    element.style.lineHeight = '';
                    element.style.margin = '';
                    element.style.padding = '';
                    element.style.overflowWrap = '';
                    element.style.wordWrap = '';
                });
                
                // Принудительно устанавливаем правильные стили
                if (currentTheme === 'dark') {
                    body.style.color = '#ffffff';
                    body.style.backgroundColor = 'transparent';
                    allElements.forEach(element => {
                        if (element.tagName === 'H1' || element.tagName === 'H2') {
                            element.style.color = '#aefc6e';
                        } else if (element.tagName === 'A') {
                            element.style.color = '#aefc6e';
                        } else {
                            element.style.color = '#ffffff';
                        }
                    });
                } else {
                    body.style.color = '#212529';
                    body.style.backgroundColor = 'transparent';
                    allElements.forEach(element => {
                        if (element.tagName === 'H1' || element.tagName === 'H2') {
                            element.style.color = '#28a745';
                        } else if (element.tagName === 'A') {
                            element.style.color = '#28a745';
                        } else {
                            element.style.color = '#212529';
                        }
                    });
                }
            }
        }
    }, 100);

    // Дополнительная обработка для кнопок
    const buttons = document.querySelectorAll('.tox .tox-tbtn');
    buttons.forEach(button => {
        button.style.background = 'transparent';
        button.style.border = 'none';
        
        if (currentTheme === 'dark') {
            button.style.color = '#ffffff';
        } else {
            button.style.color = '#212529';
        }
        
        // Обработка иконок внутри кнопок
        const icons = button.querySelectorAll('svg, .tox-icon');
        icons.forEach(icon => {
            if (currentTheme === 'dark') {
                icon.style.fill = '#ffffff';
                icon.style.color = '#ffffff';
            } else {
                icon.style.fill = '#212529';
                icon.style.color = '#212529';
            }
        });
    });
    
    // Принудительное обновление через CSS переменные
    const style = document.createElement('style');
    style.textContent = `
        [data-theme="${currentTheme}"] .tox .tox-tbtn {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        [data-theme="${currentTheme}"] .tox .tox-tbtn svg,
        [data-theme="${currentTheme}"] .tox .tox-icon {
            fill: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        /* Стили для содержимого редактора */
        [data-theme="${currentTheme}"] .tox-edit-area iframe body {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
            background: transparent !important;
        }
        
        [data-theme="${currentTheme}"] .tox-edit-area iframe body p,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h1,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h2,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h3,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h4,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h5,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body h6,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body li,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body td,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body th {
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox-edit-area iframe body a {
            color: #28a745 !important;
        }
        
        [data-theme="${currentTheme}"] .tox-edit-area iframe body code,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body pre {
            background: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox-edit-area iframe body table td,
        [data-theme="${currentTheme}"] .tox-edit-area iframe body table th {
            border-color: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox-edit-area iframe body hr {
            border-color: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
        }
        
        /* Стили для цветовых палитр */
        [data-theme="${currentTheme}"] .tox .tox-dialog,
        [data-theme="${currentTheme}"] .tox .tox-dialog__header,
        [data-theme="${currentTheme}"] .tox .tox-dialog__body,
        [data-theme="${currentTheme}"] .tox .tox-dialog__footer {
            background: ${currentTheme === 'dark' ? '#2d2d2d' : '#ffffff'} !important;
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-collection,
        [data-theme="${currentTheme}"] .tox .tox-pop__dialog {
            background: ${currentTheme === 'dark' ? '#2d2d2d' : '#ffffff'} !important;
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-collection__item {
            background: ${currentTheme === 'dark' ? '#2d2d2d' : '#ffffff'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-collection__item:hover {
            background: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-swatch__grid {
            background: ${currentTheme === 'dark' ? '#2d2d2d' : '#ffffff'} !important;
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-swatch {
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-swatch__select-btn {
            background: transparent !important;
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
        
        [data-theme="${currentTheme}"] .tox .tox-textfield,
        [data-theme="${currentTheme}"] .tox .tox-textarea {
            background: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
            border: 1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} !important;
            color: ${currentTheme === 'dark' ? '#ffffff' : '#212529'} !important;
        }
    `;
    document.head.appendChild(style);
    
    // Удаляем старый стиль если есть
    const oldStyle = document.querySelector('#tinymce-theme-style');
    if (oldStyle) {
        oldStyle.remove();
    }
    style.id = 'tinymce-theme-style';
    
    // Принудительно обновляем стили цветовых палитр
    updateColorPickerStyles(currentTheme);
    
                // Принудительно обновляем стили split button
                forceUpdateSplitButtonStyles(currentTheme);
                
                // Добавляем обработчики кликов для split button
                addSplitButtonClickHandlers();
}

// Функция для принудительного обновления стилей split button
function forceUpdateSplitButtonStyles(theme) {
    // Ждем немного, чтобы TinyMCE успел отрендерить элементы
    setTimeout(() => {
        const splitButtons = document.querySelectorAll('.tox .tox-split-button__chevron');
        splitButtons.forEach(button => {
            // Принудительно удаляем все inline стили
            button.removeAttribute('style');
            
            // Применяем новые стили
            if (theme === 'dark') {
                button.style.setProperty('color', '#ffffff', 'important');
                button.style.setProperty('background', 'transparent', 'important');
                button.style.setProperty('border', 'none', 'important');
                button.style.setProperty('box-shadow', 'none', 'important');
            } else {
                button.style.setProperty('color', '#212529', 'important');
                button.style.setProperty('background', 'transparent', 'important');
                button.style.setProperty('border', 'none', 'important');
                button.style.setProperty('box-shadow', 'none', 'important');
            }
            
            // Обновляем все дочерние элементы
            const allChildren = button.querySelectorAll('*');
            allChildren.forEach(child => {
                child.removeAttribute('style');
                if (theme === 'dark') {
                    child.style.setProperty('color', '#ffffff', 'important');
                    child.style.setProperty('fill', '#ffffff', 'important');
                } else {
                    child.style.setProperty('color', '#212529', 'important');
                    child.style.setProperty('fill', '#212529', 'important');
                }
            });
        });
    }, 100);
}

// Функция для добавления обработчиков кликов на split button
function addSplitButtonClickHandlers() {
    // Ждем немного, чтобы TinyMCE успел отрендерить элементы
    setTimeout(() => {
        // Находим все split button для цветов
        const splitButtons = document.querySelectorAll('.tox .tox-split-button[data-mce-name="forecolor"], .tox .tox-split-button[data-mce-name="backcolor"]');
        
        splitButtons.forEach(splitButton => {
            // Находим основную кнопку (первую кнопку в split button)
            const mainButton = splitButton.querySelector('.tox-tbtn:first-child');
            
            if (mainButton && !mainButton.hasAttribute('data-click-handler-added')) {
                // Добавляем обработчик клика
                mainButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Определяем тип кнопки (цвет текста или фона)
                    const isForeColor = splitButton.getAttribute('data-mce-name') === 'forecolor';
                    
                    // Открываем цветовую палитру
                    if (tinymceEditor) {
                        if (isForeColor) {
                            // Открываем диалог выбора цвета текста
                            tinymceEditor.windowManager.open({
                                title: 'Выбор цвета текста',
                                body: {
                                    type: 'panel',
                                    items: [
                                        {
                                            type: 'colorinput',
                                            name: 'color',
                                            label: 'Цвет текста',
                                            value: '#000000'
                                        }
                                    ]
                                },
                                buttons: [
                                    {
                                        type: 'submit',
                                        text: 'Применить'
                                    },
                                    {
                                        type: 'cancel',
                                        text: 'Отмена'
                                    }
                                ],
                                onSubmit: function(api) {
                                    const color = api.getData().color;
                                    tinymceEditor.execCommand('ForeColor', false, color);
                                    api.close();
                                }
                            });
                        } else {
                            // Открываем диалог выбора цвета фона
                            tinymceEditor.windowManager.open({
                                title: 'Выбор цвета фона',
                                body: {
                                    type: 'panel',
                                    items: [
                                        {
                                            type: 'colorinput',
                                            name: 'color',
                                            label: 'Цвет фона',
                                            value: '#ffffff'
                                        }
                                    ]
                                },
                                buttons: [
                                    {
                                        type: 'submit',
                                        text: 'Применить'
                                    },
                                    {
                                        type: 'cancel',
                                        text: 'Отмена'
                                    }
                                ],
                                onSubmit: function(api) {
                                    const color = api.getData().color;
                                    tinymceEditor.execCommand('HiliteColor', false, color);
                                    api.close();
                                }
                            });
                        }
                    }
                });
                
                // Помечаем, что обработчик уже добавлен
                mainButton.setAttribute('data-click-handler-added', 'true');
            }
        });
    }, 200);
}

// Функция для обновления стилей цветовых палитр
function updateColorPickerStyles(theme) {
    // Обновляем стили всех диалогов
    const dialogs = document.querySelectorAll('.tox .tox-dialog');
    dialogs.forEach(dialog => {
        if (theme === 'dark') {
            dialog.style.setProperty('--text-color', '#ffffff');
            dialog.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
            dialog.style.setProperty('--button-hover', 'rgba(255, 255, 255, 0.1)');
        } else {
            dialog.style.setProperty('--text-color', '#212529');
            dialog.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.2)');
            dialog.style.setProperty('--button-hover', 'rgba(0, 0, 0, 0.05)');
        }
    });
    
    // Обновляем стили заголовков диалогов
    const headers = document.querySelectorAll('.tox .tox-dialog__header');
    headers.forEach(header => {
        if (theme === 'dark') {
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            header.style.borderBottomColor = 'rgba(0, 0, 0, 0.2)';
        }
    });
    
    // Обновляем стили футеров диалогов
    const footers = document.querySelectorAll('.tox .tox-dialog__footer');
    footers.forEach(footer => {
        if (theme === 'dark') {
            footer.style.borderTopColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            footer.style.borderTopColor = 'rgba(0, 0, 0, 0.2)';
        }
    });
    
    // Обновляем стили текста в диалогах
    const dialogTexts = document.querySelectorAll('.tox .tox-dialog p, .tox .tox-dialog label, .tox .tox-dialog span, .tox .tox-dialog h1, .tox .tox-dialog h2, .tox .tox-dialog h3, .tox .tox-dialog h4, .tox .tox-dialog h5, .tox .tox-dialog h6');
    dialogTexts.forEach(text => {
        text.style.color = theme === 'dark' ? '#ffffff' : '#212529';
    });
    
    // Обновляем стили кнопок в диалогах
    const dialogButtons = document.querySelectorAll('.tox .tox-dialog .tox-button');
    dialogButtons.forEach(button => {
        if (theme === 'dark') {
            button.style.color = '#ffffff';
            button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            button.style.color = '#212529';
            button.style.borderColor = 'rgba(0, 0, 0, 0.2)';
        }
    });
    
    // Обновляем стили полей ввода в диалогах
    const dialogInputs = document.querySelectorAll('.tox .tox-dialog .tox-textfield, .tox .tox-dialog .tox-textarea, .tox .tox-dialog .tox-selectfield select');
    dialogInputs.forEach(input => {
        if (theme === 'dark') {
            input.style.color = '#ffffff';
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            input.style.color = '#212529';
            input.style.borderColor = 'rgba(0, 0, 0, 0.2)';
        }
    });
    
    // Обновляем стили цветовых палитр
    const colorGrids = document.querySelectorAll('.tox .tox-swatch__grid');
    colorGrids.forEach(grid => {
        if (theme === 'dark') {
            grid.style.background = '#2d2d2d';
            grid.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            grid.style.background = '#ffffff';
            grid.style.border = '1px solid rgba(0, 0, 0, 0.2)';
        }
    });
    
    // Обновляем стили кнопок цветовой палитры
    const colorButtons = document.querySelectorAll('.tox .tox-swatch__select-btn');
    colorButtons.forEach(button => {
        if (theme === 'dark') {
            button.style.background = 'transparent';
            button.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            button.style.color = '#ffffff';
        } else {
            button.style.background = 'transparent';
            button.style.border = '1px solid rgba(0, 0, 0, 0.2)';
            button.style.color = '#212529';
        }
        
        // Обновляем стили для стрелок в кнопках
        const svg = button.querySelector('svg');
        const icon = button.querySelector('.tox-icon');
        if (svg) {
            svg.style.fill = theme === 'dark' ? '#ffffff' : '#212529';
        }
        if (icon) {
            icon.style.color = theme === 'dark' ? '#ffffff' : '#212529';
        }
    });
    
    // Обновляем стили для стрелок в кнопках цветов в тулбаре
    const toolbarColorButtons = document.querySelectorAll('.tox .tox-tbtn[aria-label*="color"], .tox .tox-tbtn[aria-label*="Color"], .tox .tox-tbtn[title*="color"], .tox .tox-tbtn[title*="Color"]');
    toolbarColorButtons.forEach(button => {
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.fill = theme === 'dark' ? '#ffffff' : '#212529';
        }
    });
    
    // Обновляем стили для split-кнопок
    const splitButtons = document.querySelectorAll('.tox .tox-split-button__chevron');
    splitButtons.forEach(button => {
        if (theme === 'dark') {
            button.style.setProperty('color', '#ffffff', 'important');
            button.style.setProperty('background', 'transparent', 'important');
            button.style.setProperty('border', 'none', 'important');
            button.style.setProperty('box-shadow', 'none', 'important');
        } else {
            button.style.setProperty('color', '#212529', 'important');
            button.style.setProperty('background', 'transparent', 'important');
            button.style.setProperty('border', 'none', 'important');
            button.style.setProperty('box-shadow', 'none', 'important');
        }
        
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.setProperty('fill', theme === 'dark' ? '#ffffff' : '#212529', 'important');
            svg.style.setProperty('color', theme === 'dark' ? '#ffffff' : '#212529', 'important');
            svg.style.setProperty('background', 'transparent', 'important');
            svg.style.setProperty('border', 'none', 'important');
            svg.style.setProperty('box-shadow', 'none', 'important');
            
            const path = svg.querySelector('path');
            if (path) {
                path.style.setProperty('fill', theme === 'dark' ? '#ffffff' : '#212529', 'important');
                path.style.setProperty('background', 'transparent', 'important');
                path.style.setProperty('border', 'none', 'important');
                path.style.setProperty('box-shadow', 'none', 'important');
            }
        }
        
        // Принудительно обновляем все дочерние элементы
        const allChildren = button.querySelectorAll('*');
        allChildren.forEach(child => {
            if (theme === 'dark') {
                child.style.setProperty('color', '#ffffff', 'important');
                child.style.setProperty('fill', '#ffffff', 'important');
            } else {
                child.style.setProperty('color', '#212529', 'important');
                child.style.setProperty('fill', '#212529', 'important');
            }
        });
    });
    
    // Обновляем стили для всех SVG в кнопках
    const allButtonSvgs = document.querySelectorAll('.tox .tox-tbtn svg');
    allButtonSvgs.forEach(svg => {
        svg.style.setProperty('fill', theme === 'dark' ? '#ffffff' : '#212529', 'important');
        svg.style.setProperty('color', theme === 'dark' ? '#ffffff' : '#212529', 'important');
        
        const path = svg.querySelector('path');
        if (path) {
            path.style.setProperty('fill', theme === 'dark' ? '#ffffff' : '#212529', 'important');
        }
    });
    
    // Обновляем стили полей ввода
    const textFields = document.querySelectorAll('.tox .tox-textfield, .tox .tox-textarea');
    textFields.forEach(field => {
        if (theme === 'dark') {
            field.style.background = 'rgba(255, 255, 255, 0.1)';
            field.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            field.style.color = '#ffffff';
        } else {
            field.style.background = 'rgba(0, 0, 0, 0.05)';
            field.style.border = '1px solid rgba(0, 0, 0, 0.2)';
            field.style.color = '#212529';
        }
    });
}

// Инициализация редактора TinyMCE с улучшенной обработкой ошибок
async function initTinyMCE() {
    if (typeof tinymce === 'undefined') {
        return false;
    }
    
    // Проверяем, не инициализирован ли уже редактор
    if (tinymceEditor && !tinymceEditor.destroyed) {
        return true;
    }
    
    // Проверяем наличие контейнера
    const container = document.querySelector('.tinymce');
    if (!container) {
        return false;
    }
    
    try {
        const lang = getTinyMCELanguage();
        
    tinymce.init({
        selector: '.tinymce',
        base_url: '/editor_news',
        suffix: '.min',
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'codesample', 'pagebreak', 'nonbreaking', 'quickbars', 'accordion',
            'autosave', 'directionality', 'visualchars'
        ],
        // Настройки для автосоздания ссылок
        autolink_pattern: /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+-]+@)(.+)$/i,
        autolink_url_filter: function(url, node) {
            // Разрешаем все стандартные протоколы
            return true;
        },
        toolbar: [
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough superscript subscript | ' +
            'alignleft aligncenter alignright alignjustify | outdent indent | ' +
            'numlist bullist | forecolor backcolor removeformat | ' +
            'link image media iframe | table | charmap emoticons | ' +
            'code | preview | insertfile anchor codesample | ' +
            'ltr rtl | pagebreak | visualblocks visualchars | searchreplace | wordcount | help'
        ],
        toolbar_mode: 'sliding',
            toolbar_sticky: responsiveManager.isDesktop,
        language: lang,
        language_url: lang !== 'en' ? `/editor_news/langs/${lang}.js` : undefined,
        license_key: 'gpl',
        branding: false,
        promotion: false,
        tooltip: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        quickbars_image_toolbar: 'alignleft aligncenter alignright | imageoptions',
            resize: false,
            height: '100%',
            min_height: responsiveManager.isTabletDevice ? 450 : 400,
            elementpath: responsiveManager.isDesktop,
        statusbar: false,
            quickbars_insert_toolbar: 'quickimage quicktable',
            contextmenu: (responsiveManager.isTouch || pointerManager.isTouch()) ? 'link image imagetools table' : 'link image imagetools table',
            mobile: responsiveManager.isMobile,
            touch: responsiveManager.isTouch || pointerManager.isTouch(),
        menubar: false,
        
        // Улучшения для планшетов
        skin: responsiveManager.isTabletDevice ? 'oxide-dark' : 'oxide',
        content_css: responsiveManager.isTabletDevice ? 'dark' : 'default',
        
        // Настройки для планшетов - убираем toolbar_groups для совместимости
        
        // Улучшенные настройки для touch-устройств
        touch_ui: responsiveManager.isTabletDevice,
        touch_ui_scale: responsiveManager.isTabletDevice ? 1.2 : 1,
        
        // Настройки для виртуальной клавиатуры
        virtual_keyboard: responsiveManager.isTabletDevice,
        
        // Улучшенные настройки для планшетов
        content_style: responsiveManager.isTabletDevice ? `
            body { 
                font-size: 16px !important; 
                line-height: 1.7 !important; 
                padding: 20px !important;
                font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            h1, h2, h3, h4, h5, h6 { 
                margin: 20px 0 15px 0 !important; 
                line-height: 1.3 !important;
            }
            p { 
                margin-bottom: 16px !important; 
                line-height: 1.7 !important;
            }
            table { 
                border-collapse: collapse !important; 
                width: 100% !important; 
                margin: 16px 0 !important;
            }
            th, td { 
                padding: 12px 16px !important; 
                border: 1px solid #ddd !important;
            }
            blockquote { 
                padding: 20px 24px !important; 
                margin: 20px 0 !important; 
                border-left: 4px solid #aefc6e !important;
            }
            pre { 
                padding: 20px !important; 
                margin: 16px 0 !important; 
                border-radius: 8px !important;
            }
        ` : undefined,
            // Настройки для таблиц
            table_default_attributes: {
                border: '1'
            },
            table_default_styles: {
                'border-collapse': 'collapse',
                'width': '100%'
            },
            table_cell_advtab: true,
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
            table_clone_elements: 'strong em b i span font h1 h2 h3 h4 h5 h6 p div',
            table_cell_advtab: true,
            table_row_advtab: true,
            table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            table_context_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            
            // Настройки для изображений
            image_advtab: true,
            image_caption: true,
            image_description: true,
            image_title: true,
            image_uploadtab: true,
            
            // Настройки для ссылок
            link_assume_external_targets: true,
            link_context_toolbar: true,
            link_default_protocol: 'https',
            
            // Настройки для текста
            textpattern_patterns: [
                {start: '*', end: '*', format: 'italic'},
                {start: '**', end: '**', format: 'bold'},
                {start: '#', format: 'h1'},
                {start: '##', format: 'h2'},
                {start: '###', format: 'h3'},
                {start: '####', format: 'h4'},
                {start: '#####', format: 'h5'},
                {start: '######', format: 'h6'},
                {start: '1. ', cmd: 'InsertOrderedList'},
                {start: '* ', cmd: 'InsertUnorderedList'},
                {start: '- ', cmd: 'InsertUnorderedList'}
            ],
            // Настройки выравнивания по умолчанию
            block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
            // Устанавливаем выравнивание по умолчанию на left
            default_paragraph_separator: 'p',
            forced_root_block: 'p',
            forced_root_block_attrs: {
                'style': 'text-align: left;'
            },
            
            // Настройки для пасты (базовые)
            paste_data_images: true,
            paste_as_text: false,
            
            // Настройки для автосохранения
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_retention: '2m',
            autosave_restore_when_empty: false,
            
            // Настройки для кода
            codesample_languages: [
                {text: 'HTML/XML', value: 'markup'},
                {text: 'JavaScript', value: 'javascript'},
                {text: 'CSS', value: 'css'},
                {text: 'PHP', value: 'php'},
                {text: 'Ruby', value: 'ruby'},
                {text: 'Python', value: 'python'},
                {text: 'Java', value: 'java'},
                {text: 'C', value: 'c'},
                {text: 'C#', value: 'csharp'},
                {text: 'C++', value: 'cpp'}
            ],
            
            // Настройки для медиа
            media_live_embeds: true,
            media_url_resolver: function (data, resolve) {
                let url = data.url;
                
                // YouTube
                if (url.indexOf('youtube.com/watch') > 0 || url.indexOf('youtu.be/') > 0) {
                    let videoId = '';
                    if (url.indexOf('youtu.be/') > 0) {
                        videoId = url.split('youtu.be/')[1].split('?')[0];
                    } else if (url.indexOf('youtube.com/watch') > 0) {
                        videoId = url.split('v=')[1].split('&')[0];
                    }
                    resolve({
                        html: '<iframe src="https://www.youtube.com/embed/' + videoId + '" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
                    });
                }
                // Vimeo
                else if (url.indexOf('vimeo.com/') > 0) {
                    let videoId = url.split('vimeo.com/')[1].split('?')[0];
                    resolve({
                        html: '<iframe src="https://player.vimeo.com/video/' + videoId + '" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
                    });
                }
                // Общие iframe
                else if (url.indexOf('iframe') > 0 || url.indexOf('embed') > 0) {
                    resolve({
                        html: '<iframe src="' + url + '" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
                    });
                }
                else {
                    resolve({html: ''});
                }
            },
            
            // Кастомные стили для содержимого редактора
            content_style: `
                body {
                    background: transparent !important;
                    font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-size: 16px !important;
                    line-height: 1.6 !important;
                    margin: 0 !important;
                    padding: 16px !important;
                    min-height: 300px !important;
                    text-align: left !important;
                }
                
                /* Выравнивание по умолчанию для элементов без явного выравнивания */
                p:not([style*="text-align"]), 
                div:not([style*="text-align"]), 
                span:not([style*="text-align"]), 
                h1:not([style*="text-align"]), 
                h2:not([style*="text-align"]), 
                h3:not([style*="text-align"]), 
                h4:not([style*="text-align"]), 
                h5:not([style*="text-align"]), 
                h6:not([style*="text-align"]) {
                    text-align: left;
                }
                
                /* Темная тема */
                [data-theme="dark"] body {
                    color: #ffffff !important;
                }
                
                [data-theme="dark"] body * {
                    color: #ffffff !important;
                }
                
                /* Светлая тема */
                [data-theme="light"] body {
                    color: #212529 !important;
                }
                
                [data-theme="light"] body * {
                    color: #212529 !important;
                }
                
                /* Заголовки в темной теме */
                [data-theme="dark"] body h1,
                [data-theme="dark"] body h2 {
                    color: #aefc6e !important;
                }
                
                [data-theme="dark"] body h3,
                [data-theme="dark"] body h4,
                [data-theme="dark"] body h5,
                [data-theme="dark"] body h6 {
                    color: #ffffff !important;
                }
                
                /* Заголовки в светлой теме */
                [data-theme="light"] body h1,
                [data-theme="light"] body h2 {
                    color: #28a745 !important;
                }
                
                [data-theme="light"] body h3,
                [data-theme="light"] body h4,
                [data-theme="light"] body h5,
                [data-theme="light"] body h6 {
                    color: #212529 !important;
                }
                
                /* Ссылки */
                [data-theme="dark"] body a {
                    color: #aefc6e !important;
                }
                
                [data-theme="light"] body a {
                    color: #28a745 !important;
                }
                
                /* Параграфы */
                body p {
                    margin: 0 0 12px 0 !important;
                }
                
                /* Заголовки */
                body h1, body h2, body h3, body h4, body h5, body h6 {
                    margin: 16px 0 8px 0 !important;
                }
                
                /* Списки */
                body ul, body ol {
                    margin: 12px 0 !important;
                    padding-left: 24px !important;
                }
                
                body li {
                    margin: 4px 0 !important;
                }
                
                /* Таблицы */
                body table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin: 16px 0 !important;
                }
                
                body table td, body table th {
                    border: 1px solid rgba(0, 0, 0, 0.2) !important;
                    padding: 8px 12px !important;
                }
                
                [data-theme="dark"] body table td,
                [data-theme="dark"] body table th {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                    color: #ffffff !important;
                }
                
                [data-theme="light"] body table td,
                [data-theme="light"] body table th {
                    border-color: rgba(0, 0, 0, 0.2) !important;
                    color: #212529 !important;
                }
                
                /* Код */
                body code {
                    background: rgba(0, 0, 0, 0.1) !important;
                    padding: 2px 4px !important;
                    border-radius: 3px !important;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
                }
                
                [data-theme="dark"] body code {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }
                
                [data-theme="light"] body code {
                    background: rgba(0, 0, 0, 0.1) !important;
                    color: #212529 !important;
                }
                
                /* Блоки кода */
                body pre {
                    background: rgba(0, 0, 0, 0.1) !important;
                    padding: 12px !important;
                    border-radius: 4px !important;
                    overflow-x: auto !important;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
                }
                
                [data-theme="dark"] body pre {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }
                
                [data-theme="light"] body pre {
                    background: rgba(0, 0, 0, 0.1) !important;
                    color: #212529 !important;
                }
            `,
            
            // Добавляем обработку ошибок
            init_instance_callback: function (editor) {
                
                // Принудительно применяем стили темы
                setTimeout(() => {
                    applyThemeToTinyMCE();
                    adjustEditorHeight();
                    
                    // Запускаем периодическую очистку inline стилей
                    startInlineStyleCleanup();
                    
                    // Скрываем оригинальный textarea
                    const originalTextarea = document.getElementById('editorContainer');
                    if (originalTextarea) {
                        originalTextarea.style.display = 'none';
                    }
                    
                    // Добавляем обработчики для скрытия всплывающих панелей
                    setupTableToolbarHandlers(editor);
                    
                    // Добавляем обработчики для скрытия всех всплывающих панелей при клике/фокусе вне области
                    setupPopupCloseHandlers(editor);
                    
                    // Добавляем переводы для выпадающих меню стилей
                    setupStyleMenuTranslations(editor);
                    
                    // Отключаем все всплывающие подсказки
                    // disableAllTooltips(editor); // Закомментировано для восстановления подсказок
                }, 100);
                
                // Добавляем обработчики для диалогов
                editor.on('OpenDialog', function(e) {
                    setTimeout(() => {
                        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                        updateColorPickerStyles(currentTheme);
                    }, 50);
                });
                
                editor.on('CloseDialog', function(e) {
                    setTimeout(() => {
                        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                        updateColorPickerStyles(currentTheme);
                    }, 50);
                });
                
                // Добавляем обработчики для принудительной очистки inline стилей
                editor.on('input', function(e) {
                    // Очищаем стили при вводе текста
                    setTimeout(() => {
                        const body = editor.getBody();
                        if (body) {
                            const currentTheme = document.documentElement.getAttribute('data-theme');
                            if (currentTheme === 'dark') {
                                body.style.color = '#ffffff';
                                body.style.backgroundColor = 'transparent';
                                const allElements = body.querySelectorAll('*');
                                allElements.forEach(element => {
                                    if (element.tagName === 'H1' || element.tagName === 'H2') {
                                        element.style.color = '#aefc6e';
                                    } else if (element.tagName === 'A') {
                                        element.style.color = '#aefc6e';
                                    } else {
                                        element.style.color = '#ffffff';
                                    }
                                });
                            } else {
                                body.style.color = '#212529';
                                body.style.backgroundColor = 'transparent';
                                const allElements = body.querySelectorAll('*');
                                allElements.forEach(element => {
                                    if (element.tagName === 'H1' || element.tagName === 'H2') {
                                        element.style.color = '#28a745';
                                    } else if (element.tagName === 'A') {
                                        element.style.color = '#28a745';
                                    } else {
                                        element.style.color = '#212529';
                                    }
                                });
                            }
                        }
                    }, 10);
                });
                
                editor.on('keyup', function(e) {
                    // Очищаем стили при нажатии клавиш
                    setTimeout(() => {
                        const body = editor.getBody();
                        if (body) {
                            const currentTheme = document.documentElement.getAttribute('data-theme');
                            if (currentTheme === 'dark') {
                                body.style.color = '#ffffff';
                                body.style.backgroundColor = 'transparent';
                            } else {
                                body.style.color = '#212529';
                                body.style.backgroundColor = 'transparent';
                            }
                        }
                    }, 10);
                });
                
                // Добавляем обработчик для конвертации blob URL при изменении контента
                editor.on('Change', async function(e) {
                    // Конвертируем blob URL в base64 при изменении контента
                    const body = editor.getBody();
                    await convertBlobUrlsToBase64InElement(body);
                });
                
                // Обработчик для конвертации blob URL при изменении контента
                editor.on('Change', async function(e) {
                    await convertBlobUrlsToBase64InElement(editor.getBody());
                });
                
                
                
                // Добавляем обработчики для кнопок
                
                editor.addCommand('mceInsertImage', function() {
                    insertImage();
                });
                
                editor.addCommand('mceInsertLink', function() {
                    insertLink();
                });
                
                editor.addCommand('mceInsertMedia', function() {
                    insertMedia();
                });
                
                editor.addCommand('mceInsertIframe', function() {
                    insertIframe();
                });
                
                editor.addCommand('mceInsertAnchor', function() {
                    insertAnchor();
                });
                
                editor.addCommand('mceInsertCode', function() {
                    insertCode();
                });
            },
        setup: function (editor) {
                // Добавляем кастомную иконку для iframe
                editor.ui.registry.addIcon('iframe', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="6" y="6" width="12" height="8" rx="1" fill="currentColor" opacity="0.3"/><path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>');
                
                // Регистрируем кнопку iframe
                editor.ui.registry.addButton('iframe', {
                    icon: 'iframe',
                    tooltip: currentLang.startsWith("ru") ? 'Вставить видео' : 'Insert Video',
                    onAction: function() {
                        insertIframe();
                    }
                });
                
                // Обработка ошибок инициализации
            editor.on('init', function() {
                    
                    // Проверяем доступность редактора
                    if (!editor.getContainer()) {
                        return;
                    }
                    
                
                
                
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
                    }, 300);
                    
                    // Добавляем обработчик для изменения системной темы
                    if (window.matchMedia) {
                        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
                        mediaQuery.addEventListener('change', function(e) {
                            // Reapply theme when system theme changes
                            if (document.documentElement.getAttribute('data-theme') === 'auto') {
                                applyThemeToTinyMCE();
                            }
                        });
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
    
    const tryInitTinyMCE = async () => {
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
            const result = await initTinyMCE();
            if (!result) {
                // Повторная попытка через 500мс
                setTimeout(tryInitTinyMCE, 500);
                return false;
            }
        }
        
        return true;
    };
    
    tryInitTinyMCE().then(result => {
        if (!result) {
        return;
    }
    });

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
    
    // Принудительно применяем полноэкранные стили для планшетов
    if (responsiveManager && responsiveManager.isTabletDevice) {
        setTimeout(() => {
            responsiveManager.applyFullscreenModal(modal);
        }, 100);
    }

    // Ждем инициализации редактора и устанавливаем контент
    waitForEditor()
        .then(() => {
            try {
                if (noteId && noteContent) {
        // Валидируем и исправляем изображения перед загрузкой в редактор
        const validatedContent = validateAndFixImages(noteContent);
        tinymceEditor.setContent(validatedContent);
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
        
        // Конвертируем все blob URL в base64 перед сохранением
        content = await convertBlobUrlsToBase64InContent(content);
        
        // Проверяем и исправляем поврежденные изображения
        content = validateAndFixImages(content);

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
        
        // Скрываем приветственное сообщение после создания первой заметки
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            dismissWelcomeMessage();
        }
        
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
        
        // Валидируем и исправляем изображения в каждой заметке
        notes.forEach(note => {
            if (note.content) {
                note.content = validateAndFixImages(note.content);
            }
        });

    // Если массив заметок пуст, показываем приветственное сообщение
        if (notes.length === 0) {
        showWelcomeMessage();
        viewer.style.display = "none";
        return; // Выходим из функции, так как заметок нет
    }

        notes.forEach((note) => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");

            // Создаем хедер заметки
            const footer = document.createElement("div");
            footer.classList.add("note-footer");

            // Используем новую систему форматирования дат с fallback
            let creationTime, lastModified;
            
            if (typeof formatDate === 'function') {
                // Используем новую систему форматирования дат
                // Получаем актуальный язык из getCurrentLanguage() вместо статической переменной
                const actualLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
                creationTime = formatDate(note.creationTime, 'medium', actualLang);
                lastModified = formatDate(note.lastModified, 'medium', actualLang);
            } else {
                // Fallback на стандартное форматирование
                // Получаем актуальный язык из getCurrentLanguage() вместо статической переменной
                const actualLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
                const locale = actualLang === 'ru' ? 'ru-RU' : 
                              actualLang === 'ua' ? 'uk-UA' : 
                              actualLang === 'pl' ? 'pl-PL' : 
                              actualLang === 'cs' ? 'cs-CZ' : 
                              actualLang === 'sk' ? 'sk-SK' : 
                              actualLang === 'bg' ? 'bg-BG' : 
                              actualLang === 'hr' ? 'hr-HR' : 
                              actualLang === 'sr' ? 'sr-RS' : 
                              actualLang === 'bs' ? 'bs-BA' : 
                              actualLang === 'mk' ? 'mk-MK' : 
                              actualLang === 'sl' ? 'sl-SI' : 'en-US';
                
                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                
                creationTime = new Date(note.creationTime).toLocaleString(locale, options);
                lastModified = new Date(note.lastModified).toLocaleString(locale, options);
            }

            // Получаем переводы для "Создано" и "Изменено"
            // Используем актуальный язык
            const actualLang = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : currentLang;
            const createdText = window.langData?.[actualLang]?.created || 'Created';
            const modifiedText = window.langData?.[actualLang]?.modified || 'Modified';

            // Формируем текст с переводами
            footer.textContent = `${createdText}: ${creationTime} | ${modifiedText}: ${lastModified}`;
            noteElement.appendChild(footer);

            // Создаем контент заметки
        const notePreview = document.createElement("div");
        notePreview.classList.add("noteContent");
            notePreview.innerHTML = note.content;
            
            // Обрабатываем таблицы для адаптивности
            setTimeout(() => {
                processTablesForResponsiveness(notePreview);
            }, 100);
            
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

// Функция для обработки медиа-контента перед экспортом
async function processMediaContent(content) {
    try {
        // Находим все изображения в контенте
        const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
        const images = [];
        let match;
        
        while ((match = imgRegex.exec(content)) !== null) {
            images.push(match[1]);
        }
        
        // Находим все видео в контенте
        const videoRegex = /<video[^>]+src="([^"]+)"[^>]*>/gi;
        const videos = [];
        
        while ((match = videoRegex.exec(content)) !== null) {
            videos.push(match[1]);
        }
        
        // Находим все аудио в контенте
        const audioRegex = /<audio[^>]+src="([^"]+)"[^>]*>/gi;
        const audios = [];
        
        while ((match = audioRegex.exec(content)) !== null) {
            audios.push(match[1]);
        }
        
        let processedContent = content;
        
        // Обрабатываем изображения
        for (const imgSrc of images) {
            if (imgSrc.startsWith('data:')) {
                // Изображение уже в base64, оставляем как есть
                continue;
            } else if (imgSrc.startsWith('blob:')) {
                // Конвертируем blob в base64
                try {
                    const response = await fetch(imgSrc);
                    const blob = await response.blob();
                    const base64 = await blobToBase64(blob);
                    processedContent = processedContent.replace(imgSrc, base64);
                } catch (error) {
                    console.warn('Failed to convert blob to base64:', error);
                }
            }
        }
        
        // Обрабатываем видео
        for (const videoSrc of videos) {
            if (videoSrc.startsWith('data:')) {
                continue;
            } else if (videoSrc.startsWith('blob:')) {
                try {
                    const response = await fetch(videoSrc);
                    const blob = await response.blob();
                    const base64 = await blobToBase64(blob);
                    processedContent = processedContent.replace(videoSrc, base64);
                } catch (error) {
                    console.warn('Failed to convert video blob to base64:', error);
                }
            }
        }
        
        // Обрабатываем аудио
        for (const audioSrc of audios) {
            if (audioSrc.startsWith('data:')) {
                continue;
            } else if (audioSrc.startsWith('blob:')) {
                try {
                    const response = await fetch(audioSrc);
                    const blob = await response.blob();
                    const base64 = await blobToBase64(blob);
                    processedContent = processedContent.replace(audioSrc, base64);
                } catch (error) {
                    console.warn('Failed to convert audio blob to base64:', error);
                }
            }
        }
        
        return processedContent;
    } catch (error) {
        console.error('Error processing media content:', error);
        return content; // Возвращаем оригинальный контент в случае ошибки
    }
}

// Функция для конвертации blob в base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        if (!blob || blob.size === 0) {
            reject(new Error('Empty or invalid blob'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result && reader.result.length > 0) {
                resolve(reader.result);
            } else {
                reject(new Error('Empty result from FileReader'));
            }
        };
        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(error);
        };
        reader.onabort = () => {
            reject(new Error('FileReader aborted'));
        };
        
        try {
            reader.readAsDataURL(blob);
        } catch (error) {
            reject(error);
        }
    });
}

// Функция для конвертации blob URL в base64 в элементе
async function convertBlobUrlsToBase64InElement(element) {
    if (!element) return;
    
    // Обрабатываем изображения
    const images = element.querySelectorAll('img[src^="blob:"]');
    for (const img of images) {
        try {
            // Проверяем, что изображение еще не конвертировано
            if (img.src.startsWith('data:')) continue;
            
            const response = await fetch(img.src);
            if (!response.ok) {
                console.warn('Failed to fetch image blob:', response.status);
                continue;
            }
            
            const blob = await response.blob();
            if (blob.size === 0) {
                console.warn('Empty blob for image:', img.src);
                continue;
            }
            
            // Проверяем тип файла
            if (!blob.type.startsWith('image/')) {
                console.warn('Invalid image type:', blob.type);
                continue;
            }
            
            const base64 = await blobToBase64(blob);
            if (base64 && base64.length > 0) {
                img.src = base64;
                console.log('Successfully converted image blob to base64');
            } else {
                console.warn('Failed to convert image to base64 - empty result');
            }
        } catch (error) {
            console.warn('Failed to convert image blob to base64:', error);
            // Добавляем placeholder для поврежденного изображения
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
            img.alt = 'Image Error';
        }
    }
    
    // Обрабатываем видео
    const videos = element.querySelectorAll('video source[src^="blob:"], video[src^="blob:"]');
    for (const video of videos) {
        try {
            if (video.src.startsWith('data:')) continue;
            
            const response = await fetch(video.src);
            if (!response.ok) continue;
            
            const blob = await response.blob();
            if (blob.size === 0) continue;
            
            if (!blob.type.startsWith('video/')) continue;
            
            const base64 = await blobToBase64(blob);
            if (base64 && base64.length > 0) {
                video.src = base64;
                console.log('Successfully converted video blob to base64');
            }
        } catch (error) {
            console.warn('Failed to convert video blob to base64:', error);
        }
    }
    
    // Обрабатываем аудио
    const audios = element.querySelectorAll('audio source[src^="blob:"], audio[src^="blob:"]');
    for (const audio of audios) {
        try {
            if (audio.src.startsWith('data:')) continue;
            
            const response = await fetch(audio.src);
            if (!response.ok) continue;
            
            const blob = await response.blob();
            if (blob.size === 0) continue;
            
            if (!blob.type.startsWith('audio/')) continue;
            
            const base64 = await blobToBase64(blob);
            if (base64 && base64.length > 0) {
                audio.src = base64;
                console.log('Successfully converted audio blob to base64');
            }
        } catch (error) {
            console.warn('Failed to convert audio blob to base64:', error);
        }
    }
}

// Функция для конвертации всех blob URL в base64 в контенте
async function convertBlobUrlsToBase64InContent(content) {
    if (!content) return content;
    
    // Создаем временный элемент для парсинга HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Конвертируем все blob URL
    await convertBlobUrlsToBase64InElement(tempDiv);
    
    return tempDiv.innerHTML;
}

// Функция для проверки и восстановления поврежденных изображений
function validateAndFixImages(content) {
    if (!content) return content;
    
    // Создаем временный элемент для парсинга HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Находим все изображения
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
        // Проверяем, что изображение имеет корректный src
        if (!img.src || img.src === '' || img.src === 'undefined') {
            // Заменяем на placeholder
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
            img.alt = 'Image Error';
        }
        
        // Проверяем, что base64 изображение корректно
        if (img.src.startsWith('data:image/')) {
            // Проверяем, что base64 строка не повреждена
            const base64Part = img.src.split(',')[1];
            if (!base64Part || base64Part.length < 100) {
                // Заменяем на placeholder
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
                img.alt = 'Image Error';
            }
        }
    });
    
    return tempDiv.innerHTML;
}

// Функция для сжатия данных экспорта
function compressExportData(exportData) {
    const jsonString = JSON.stringify(exportData);
    
    // Простая компрессия: заменяем часто встречающиеся строки на короткие коды
    const commonStrings = [
        'data:image/',
        'data:video/',
        'data:audio/',
        'base64,',
        '<!-- Exported on',
        '-->',
        'src="',
        'alt="',
        'class="',
        'style="',
        'width="',
        'height="'
    ];
    
    let compressed = jsonString;
    const replacements = {};
    
    // Создаем словарь замен
    commonStrings.forEach((str, index) => {
        const code = `__${index.toString(36)}__`;
        replacements[code] = str;
        compressed = compressed.replace(new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), code);
    });
    
    // Создаем финальный объект с компрессией
    const compressedData = {
        compressed: true,
        replacements: replacements,
        data: compressed
    };
    
    return JSON.stringify(compressedData);
}

// Универсальная функция для скачивания файлов с поддержкой мобильных устройств
function downloadFile(blob, filename, mimeType = "application/octet-stream") {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Создаем ссылку для скачивания
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Настраиваем MIME-тип для лучшей совместимости
    if (mimeType) {
        blob = new Blob([blob], { type: mimeType });
        link.href = URL.createObjectURL(blob);
    }
    
    if (isMobile) {
        // На мобильных устройствах добавляем дополнительные атрибуты для принудительного скачивания
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
        link.setAttribute('download', filename); // Явно указываем атрибут download
        
        // Для мобильных устройств принудительно устанавливаем MIME-тип как octet-stream
        if (mimeType === "application/json") {
            const mobileBlob = new Blob([blob], { type: "application/octet-stream" });
            link.href = URL.createObjectURL(mobileBlob);
        }
        
        if (isIOS) {
            // iOS требует специальной обработки
            const tempLink = document.createElement('a');
            tempLink.href = link.href;
            tempLink.download = link.download;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            
            // Имитируем клик пользователя
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            tempLink.dispatchEvent(clickEvent);
            
            // Удаляем временную ссылку
            setTimeout(() => {
                if (document.body.contains(tempLink)) {
                    document.body.removeChild(tempLink);
                }
            }, 100);
        } else if (isAndroid) {
            // Android - добавляем дополнительные атрибуты для принудительного скачивания
            link.setAttribute('target', '_self');
            link.click();
        } else {
            // Другие мобильные браузеры
            link.click();
        }
    } else {
        // Десктоп - стандартный подход
        link.click();
    }
    
    // Очищаем URL после скачивания
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
    }, 1000);
}

// Функция для декомпрессии данных импорта
function decompressImportData(compressedString) {
    try {
        const compressedData = JSON.parse(compressedString);
        
        if (!compressedData.compressed) {
            return compressedString; // Не сжатые данные
        }
        
        let decompressed = compressedData.data;
        
        // Восстанавливаем замененные строки
        Object.entries(compressedData.replacements).forEach(([code, original]) => {
            decompressed = decompressed.replace(new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), original);
        });
        
        return decompressed;
    } catch (error) {
        console.warn('Decompression failed:', error);
        return compressedString; // Возвращаем исходные данные
    }
}

async function exportNote(noteContent, password) {
    try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueTag = `<!-- Exported on ${timestamp} -->\n`;
        
        // Обрабатываем медиа-контент перед экспортом
        const processedContent = await processMediaContent(noteContent);
        const contentWithTag = uniqueTag + processedContent;

        // Дополнительная обфускация файла
        const obfuscatedContent = advancedEncryption.obfuscateFile(contentWithTag);
        
        // Улучшенное шифрование с обфускацией
        const encrypted = await advancedEncryption.encrypt(obfuscatedContent, password);
        
        // Создаем метаданные для экспорта
        const exportMetadata = {
            version: "2.0",
            timestamp: timestamp,
            hasMedia: processedContent !== noteContent,
            encryption: "AES-GCM-256",
            compression: "gzip",
            mediaCount: {
                images: (processedContent.match(/<img[^>]+>/gi) || []).length,
                videos: (processedContent.match(/<video[^>]+>/gi) || []).length,
                audios: (processedContent.match(/<audio[^>]+>/gi) || []).length
            },
            contentSize: processedContent.length,
            encryptedSize: encrypted.length
        };
        
        // Создаем архив с зашифрованным контентом и метаданными
        const exportData = {
            metadata: exportMetadata,
            content: encrypted
        };
        
        // Сжимаем данные если они большие
        let finalData;
        if (JSON.stringify(exportData).length > 1024 * 1024) { // Больше 1MB
            try {
                // Используем простую компрессию через замену повторяющихся строк
                finalData = compressExportData(exportData);
                exportData.metadata.compression = "custom";
            } catch (compressionError) {
                console.warn('Compression failed, using uncompressed data:', compressionError);
                finalData = JSON.stringify(exportData);
            }
        } else {
            finalData = JSON.stringify(exportData);
        }
        
        // Всегда используем расширение .note для зашифрованных файлов
        const filename = `encrypted_note_${timestamp}.note`;
        
        // Используем универсальную функцию скачивания
        // На мобильных устройствах используем application/octet-stream для принудительного скачивания
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const mimeType = isMobile ? "application/octet-stream" : "application/json";
        const blob = new Blob([finalData], { type: mimeType });
        downloadFile(blob, filename, mimeType);
        
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
            <div class="modal-content-inner">
                <h3>${title}</h3>
                <p>${message}</p>
                <input type="text" id="customPromptInput" placeholder="${placeholder}" value="${defaultValue}">
            </div>
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
        // Удаляем модальное окно
        if (promptModal && promptModal.parentNode) {
            promptModal.parentNode.removeChild(promptModal);
        }
        if (callback) callback(value);
    };
    
    const handleCancel = () => {
        // Удаляем модальное окно
        if (promptModal && promptModal.parentNode) {
            promptModal.parentNode.removeChild(promptModal);
        }
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
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Закрытие по клику вне модального окна
    const handleBackdropClick = (e) => {
        if (e.target === promptModal) {
            handleCancel();
        }
    };
    promptModal.addEventListener('click', handleBackdropClick);
    
    
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

// Функция для создания модального окна iframe
function showCustomIframeDialog(editor) {
    const iframeModal = document.createElement('div');
    iframeModal.className = 'modal';
    iframeModal.id = 'customIframeModal';
    iframeModal.innerHTML = `
        <div class="modal-content-error">
            <h3>${currentLang.startsWith("ru") ? "Вставка видео" : "Insert Video"}</h3>
            <p>${currentLang.startsWith("ru") ? "Выберите платформу:" : "Select platform:"}</p>
            <select id="platformSelect">
                <option value="youtube">YouTube</option>
                <option value="rutube">Rutube</option>
                <option value="vk">VK Video</option>
                <option value="vimeo">Vimeo</option>
            </select>
            <p>${currentLang.startsWith("ru") ? "Введите URL видео:" : "Enter video URL:"}</p>
            <input type="url" id="videoUrlInput" placeholder="https://www.youtube.com/watch?v=...">
            <div class="modal-buttons-container">
                <button id="iframeInsertBtn" class="btn"><i class="fas fa-check"></i> ${currentLang.startsWith("ru") ? "Вставить" : "Insert"}</button>
                <button id="iframeCancelBtn" class="btn cancel"><i class="fas fa-times"></i> ${currentLang.startsWith("ru") ? "Отмена" : "Cancel"}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(iframeModal);
    iframeModal.style.display = "block";
    
    const platformSelect = document.getElementById('platformSelect');
    const urlInput = document.getElementById('videoUrlInput');
    const insertBtn = document.getElementById('iframeInsertBtn');
    const cancelBtn = document.getElementById('iframeCancelBtn');
    
    // Обновляем placeholder при изменении платформы
    platformSelect.addEventListener('change', function() {
        const platform = this.value;
        const placeholders = {
            youtube: 'https://www.youtube.com/watch?v=...',
            rutube: 'https://rutube.ru/video/...',
            vk: 'https://vk.com/video...',
            vimeo: 'https://vimeo.com/...'
        };
        urlInput.placeholder = placeholders[platform];
    });
    
    setTimeout(() => urlInput.focus(), 100);
    
    const handleInsert = () => {
        const url = urlInput.value.trim();
        const platform = platformSelect.value;
        
        if (url) {
            const iframeCode = generateIframeCode(url, platform);
            if (iframeCode) {
                editor.insertContent(iframeCode);
            } else {
                showCustomAlert(
                    t("error"),
                    currentLang.startsWith("ru") ? "Неверный URL для выбранной платформы" : "Invalid URL for selected platform",
                    "error"
                );
            }
        }
        document.body.removeChild(iframeModal);
    };
    
    const handleCancel = () => {
        document.body.removeChild(iframeModal);
    };
    
    insertBtn.addEventListener('click', handleInsert);
    cancelBtn.addEventListener('click', handleCancel);
    
    // Закрытие по Enter
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInsert();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && iframeModal.parentNode) {
            handleCancel();
        }
    });
    
    // Закрытие по клику вне модального окна
    const handleBackdropClick = (e) => {
        if (e.target === iframeModal) {
            handleCancel();
        }
    };
    iframeModal.addEventListener('click', handleBackdropClick);
}

// Функция для генерации iframe кода
function generateIframeCode(url, platform) {
    try {
        let embedUrl = '';
        let width = '560';
        let height = '315';
        
        switch (platform) {
            case 'youtube':
                const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                if (youtubeMatch) {
                    embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
                }
                break;
                
            case 'rutube':
                const rutubeMatch = url.match(/rutube\.ru\/video\/([^\/\?]+)/);
                if (rutubeMatch) {
                    embedUrl = `https://rutube.ru/play/embed/${rutubeMatch[1]}`;
                }
                break;
                
            case 'vk':
                const vkMatch = url.match(/vk\.com\/video(-?\d+_\d+)/);
                if (vkMatch) {
                    embedUrl = `https://vk.com/video_ext.php?oid=${vkMatch[1].split('_')[0]}&id=${vkMatch[1].split('_')[1]}&hd=2`;
                }
                break;
                
            case 'vimeo':
                const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                if (vimeoMatch) {
                    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                }
                break;
        }
        
        if (embedUrl) {
            return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" style="border-radius: 6px; box-shadow: 0 2px 8px var(--shadow-color); max-width: 100%;"></iframe>`;
        }
        
        return null;
    } catch (error) {
        console.error('Error generating iframe code:', error);
        return null;
    }
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
    if (!files || files.length === 0) {
        return;
    }
    
    // Сбрасываем значение input для возможности повторного импорта
    event.target.value = '';

    // Обрабатываем файлы последовательно с запросом пароля для каждого
    
    let importedCount = 0;
    let errorCount = 0;
    
    // Обрабатываем каждый файл отдельно
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверяем расширение файла
        if (!isSupportedFileExtension(file.name)) {
            errorCount++;
            showCustomAlert(t("error"), t("errorInvalidFile", { filename: file.name }), "error");
            continue;
        }
        
        // Запрашиваем пароль для каждого файла
        const password = await new Promise((resolve) => {
            const message = `${t("enterPasswordForFile")}:<br><strong>${file.name}</strong>`;
            showPasswordPromptWithValidation(
                t("decryptNote"),
                message,
                file,
                (password) => {
                    resolve(password ? password.trim() : null);
                }
            );
        });
        
        if (!password) {
            errorCount++;
            continue;
        }
        
        // Обрабатываем файл
        try {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = async function (e) {
                    try {
                        const fileContent = e.target.result;
                        let encryptedText;
                        let finalText;
                        
                        // Проверяем, является ли файл новым форматом (JSON с метаданными)
                        try {
                            const decompressedContent = decompressImportData(fileContent);
                            const exportData = JSON.parse(decompressedContent);
                            
                            if (exportData.metadata && exportData.content) {
                                encryptedText = exportData.content;
                            } else {
                                throw new Error('Invalid new format');
                            }
                        } catch (jsonError) {
                            // Старый формат - просто зашифрованный текст
                            encryptedText = fileContent;
                        }
                        
                        // Расшифровываем
                        const decryptedText = await advancedEncryption.decrypt(encryptedText, password);
                        
                        // Проверяем, нужно ли удалять обфускацию
                        finalText = decryptedText;
                        try {
                            finalText = advancedEncryption.deobfuscateFile(decryptedText);
                        } catch (obfuscationError) {
                            // Если обфускация не удалась, используем исходный текст
                            finalText = decryptedText;
                        }
                        
                        // Создаем новую заметку
                        const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        const noteObj = {
                            id: newId,
                            content: finalText,
                            creationTime: Date.now(),
                            lastModified: Date.now(),
                            title: notesDB.extractTitle(finalText)
                        };
                        
                        await notesDB.saveNote(noteObj);
                        importedCount++;
                        
                    } catch (error) {
                        errorCount++;
                        showCustomAlert(
                            t("error"),
                            t("errorImport", { filename: file.name, message: error.message }),
                            "error"
                        );
                    }
                    
                    resolve(true);
                };
                
                reader.readAsText(file);
            });
            
        } catch (error) {
            errorCount++;
        }
    }
    
    // Показываем результат
    if (importedCount > 0) {
        showCustomAlert(
            t("success"),
            t("importCompleted", { count: importedCount }),
            "success"
        );
        
        // Перезагружаем заметки
        await loadNotes();
    }
    
    if (errorCount > 0) {
        showCustomAlert(
            t("warning"),
            t("importWithErrors", { imported: importedCount, errors: errorCount }),
            "warning"
        );
    }
    
}

// Новая функция для импорта с индивидуальными паролями для каждого файла
async function importNotesWithIndividualPasswords(files) {
    console.log("Importing multiple files with individual passwords:", files.length);
    let importedCount = 0;
    let errorCount = 0;
    let totalFiles = files.length;
    let processedFiles = 0;

    // Функция для обработки одного файла
    const processFile = (file) => {
        return new Promise((resolve) => {
        if (!isSupportedFileExtension(file.name)) {
            errorCount++;
                showCustomAlert(t("error"), t("errorInvalidFile", { filename: file.name }), "error");
                resolve();
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                // Читаем данные как текст
                const fileContent = e.target.result;
                
                let encryptedText;
                let finalText;
                
                // Проверяем, является ли файл новым форматом (JSON с метаданными)
                try {
                    // Сначала пробуем декомпрессию
                    const decompressedContent = decompressImportData(fileContent);
                    const exportData = JSON.parse(decompressedContent);
                    
                    if (exportData.metadata && exportData.content) {
                        // Новый формат с метаданными
                        encryptedText = exportData.content;
                        console.log('Importing new format with metadata:', exportData.metadata);
                        
                        // Показываем информацию о медиа-контенте
                        if (exportData.metadata.hasMedia) {
                            const mediaInfo = exportData.metadata.mediaCount;
                            console.log('Media content detected:', mediaInfo);
                        }
                    } else {
                        throw new Error('Invalid new format');
                    }
                } catch (jsonError) {
                    // Старый формат - просто зашифрованный текст
                    encryptedText = fileContent;
                }
                
                // Расшифровываем с помощью улучшенного шифрования (с поддержкой старых файлов)
                const decryptedText = await advancedEncryption.decrypt(encryptedText, password);
                
                // Проверяем, нужно ли удалять обфускацию (только для новых файлов)
                finalText = decryptedText;
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

// Новая функция для импорта с индивидуальными паролями для каждого файла
async function importNotesWithIndividualPasswords(files) {
    console.log("Importing multiple files with individual passwords:", files.length);
    let importedCount = 0;
    let errorCount = 0;
    let totalFiles = files.length;
    let processedFiles = 0;
    
    // Показываем прогресс-бар
    const progressModal = document.createElement('div');
    progressModal.className = 'progress-modal';
    progressModal.innerHTML = `
        <div class="progress-modal-content">
            <h3>${t("importingFiles")}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p class="progress-text">${t("processingFile")} 1 ${t("of")} ${totalFiles}</p>
            <p class="progress-details">${t("imported")}: ${importedCount}, ${t("errors")}: ${errorCount}</p>
        </div>
    `;
    document.body.appendChild(progressModal);
    
    const progressFill = progressModal.querySelector('.progress-fill');
    const progressText = progressModal.querySelector('.progress-text');
    const progressDetails = progressModal.querySelector('.progress-details');
    
    // Функция для обновления прогресса
    const updateProgress = () => {
        const percentage = (processedFiles / totalFiles) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${t("processingFile")} ${processedFiles + 1} ${t("of")} ${totalFiles}`;
        progressDetails.textContent = `${t("imported")}: ${importedCount}, ${t("errors")}: ${errorCount}`;
    };
    
    // Обрабатываем файлы последовательно для запроса паролей
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        updateProgress();
        
        // Проверяем расширение файла
        if (!isSupportedFileExtension(file.name)) {
            errorCount++;
            showCustomAlert(t("error"), t("errorInvalidFile", { filename: file.name }), "error");
            processedFiles++;
            continue;
        }
        
        // Запрашиваем пароль для каждого файла
        const password = await new Promise((resolve) => {
            const message = `${t("enterPasswordForFile")}:<br><strong>${file.name}</strong>`;
            console.log("Message:", message);
            showPasswordPromptWithValidation(
                t("decryptNote"),
                message,
                file,
                (password) => {
                    resolve(password ? password.trim() : null);
                }
            );
        });
        
        if (!password) {
            errorCount++;
            processedFiles++;
            continue;
        }
        
        // Обрабатываем файл
        try {
            const reader = new FileReader();
            const fileProcessed = await new Promise((resolve) => {
                reader.onload = async function (e) {
                    try {
                        const fileContent = e.target.result;
                        let encryptedText;
                        let finalText;
                        
                        // Проверяем, является ли файл новым форматом (JSON с метаданными)
                        try {
                            const decompressedContent = decompressImportData(fileContent);
                            const exportData = JSON.parse(decompressedContent);
                            
                            if (exportData.metadata && exportData.content) {
                                encryptedText = exportData.content;
                            } else {
                                throw new Error('Invalid new format');
                            }
                        } catch (jsonError) {
                            // Старый формат - просто зашифрованный текст
                            encryptedText = fileContent;
                        }
                        
                        // Расшифровываем
                        const decryptedText = await advancedEncryption.decrypt(encryptedText, password);
                        
                        // Проверяем, нужно ли удалять обфускацию
                        finalText = decryptedText;
                        try {
                            finalText = advancedEncryption.deobfuscateFile(decryptedText);
                        } catch (obfuscationError) {
                            // Если обфускация не удалась, используем исходный текст
                            finalText = decryptedText;
                        }
                        
                        // Создаем новую заметку
                        const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        const noteObj = {
                            id: newId,
                            content: finalText,
                            creationTime: Date.now(),
                            lastModified: Date.now(),
                            title: notesDB.extractTitle(finalText)
                        };
                        
                        await notesDB.saveNote(noteObj);
                        importedCount++;
                        
                    } catch (error) {
                        errorCount++;
                        showCustomAlert(
                            t("error"),
                            t("errorImport", { filename: file.name, message: error.message }),
                            "error"
                        );
                    }
                    
                    processedFiles++;
                    resolve(true);
                };
                
                reader.readAsText(file);
            });
            
        } catch (error) {
            errorCount++;
            processedFiles++;
        }
    }
    
    // Удаляем прогресс-бар
    document.body.removeChild(progressModal);
    
    // Показываем результат
    if (importedCount > 0) {
        showCustomAlert(
            t("success"),
            t("importCompleted", { count: importedCount }),
            "success"
        );
        
        // Перезагружаем заметки
        await loadNotes();
    }
    
    if (errorCount > 0) {
        showCustomAlert(
            t("warning"),
            t("importWithErrors", { imported: importedCount, errors: errorCount }),
            "warning"
        );
    }
}

// Функция для показа диалога ввода пароля с валидацией
function showPasswordPromptWithValidation(title, message, file, callback) {
    const promptModal = document.createElement('div');
    promptModal.className = 'modal';
    promptModal.id = 'passwordPromptModal';
    promptModal.innerHTML = `
        <div class="modal-content-error">
            <div class="modal-content-inner">
                <h3>${title}</h3>
                <p>${message}</p>
                <input type="password" id="passwordInput" placeholder="${t("password")}" autocomplete="off">
                <div id="passwordValidation" class="password-validation" style="display: none;">
                    <div class="validation-message"></div>
                    <div class="validation-actions">
                        <button id="validatePassword" class="btn validate-btn" style="display: none;">
                            <i class="fas fa-check"></i> ${t("validatePassword")}
                        </button>
                        <button id="skipFile" class="btn skip-btn">
                            <i class="fas fa-forward"></i> ${t("skipFile")}
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-buttons-container">
                <button id="passwordOk" class="btn" disabled><i class="fas fa-check"></i> ${t("ok")}</button>
                <button id="passwordCancel" class="btn cancel"><i class="fas fa-times"></i> ${t("cancel")}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(promptModal);
    promptModal.style.display = "block";
    
    const input = document.getElementById('passwordInput');
    const okButton = document.getElementById('passwordOk');
    const cancelButton = document.getElementById('passwordCancel');
    const validationDiv = document.getElementById('passwordValidation');
    const validationMessage = validationDiv.querySelector('.validation-message');
    const validateButton = document.getElementById('validatePassword');
    const skipButton = document.getElementById('skipFile');
    
    let isValidPassword = false;
    let validationInProgress = false;
    
    // Фокус на поле ввода
    setTimeout(() => input.focus(), 100);
    
    // Debounce для валидации
    let validationTimeout;
    
    // Обработчик ввода пароля
    input.addEventListener('input', async (e) => {
        const password = e.target.value.trim();
        
        if (password.length === 0) {
            validationDiv.style.display = 'none';
            okButton.disabled = true;
            isValidPassword = false;
            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }
            return;
        }
        
        if (validationInProgress) return;
        
        // Очищаем предыдущий таймер
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }
        
        // Устанавливаем задержку 500мс для валидации
        validationTimeout = setTimeout(async () => {
        
        validationInProgress = true;
        validationDiv.style.display = 'block';
        validationMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + t("validatingPassword");
        validateButton.style.display = 'none';
        okButton.disabled = true;
        
        try {
            // Читаем файл для валидации
            const reader = new FileReader();
            const validationResult = await new Promise((resolve) => {
                reader.onload = async function (e) {
                    try {
                        const fileContent = e.target.result;
                        let encryptedText;
                        
                        // Проверяем формат файла
                        try {
                            const decompressedContent = decompressImportData(fileContent);
                            const exportData = JSON.parse(decompressedContent);
                            
                            if (exportData.metadata && exportData.content) {
                                encryptedText = exportData.content;
                            } else {
                                throw new Error('Invalid new format');
                            }
                        } catch (jsonError) {
                            encryptedText = fileContent;
                        }
                        
                        // Пробуем расшифровать для валидации
                        const decryptedText = await advancedEncryption.validatePassword(encryptedText, password);
                        
                        // Сбрасываем попытки при успешной валидации
                        advancedEncryption.resetAttempts('validation_' + file.name);
                        
                        // Если дошли до сюда, пароль правильный
                        resolve({ success: true, decryptedText });
                    } catch (error) {
                        resolve({ success: false, error: error.message });
                    }
                };
                
                reader.readAsText(file);
            });
            
            if (validationResult.success) {
                validationMessage.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ' + t("passwordValid");
                validationMessage.style.color = '#4CAF50';
                okButton.disabled = false;
                isValidPassword = true;
            } else {
                validationMessage.innerHTML = '<i class="fas fa-times-circle" style="color: #f44336;"></i> ' + t("passwordInvalid");
                validationMessage.style.color = '#f44336';
                validateButton.style.display = 'inline-block';
                okButton.disabled = true;
                isValidPassword = false;
            }
            
        } catch (error) {
            validationMessage.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> ' + t("validationError");
            validationMessage.style.color = '#ff9800';
            validateButton.style.display = 'inline-block';
            okButton.disabled = true;
            isValidPassword = false;
        }
        
        validationInProgress = false;
        }, 500); // Задержка 500мс
    });
    
    // Обработчики кнопок
    okButton.addEventListener('click', () => {
        if (isValidPassword) {
            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }
            document.body.removeChild(promptModal);
            callback(input.value.trim());
        }
    });
    
    cancelButton.addEventListener('click', () => {
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }
        document.body.removeChild(promptModal);
        callback(null);
    });
    
    skipButton.addEventListener('click', () => {
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }
        document.body.removeChild(promptModal);
        callback('SKIP');
    });
    
    validateButton.addEventListener('click', () => {
        input.dispatchEvent(new Event('input'));
    });
    
    // Обработка Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && isValidPassword) {
            okButton.click();
        }
    });
    
    // Закрытие по клику вне модального окна
    promptModal.addEventListener('click', (e) => {
        if (e.target === promptModal) {
            document.body.removeChild(promptModal);
            callback(null);
        }
    });
}

// Функция для импорта файлов с индивидуальными паролями
async function importNotesWithFiles(files) {
    
    let importedCount = 0;
    let errorCount = 0;
    let cancelledCount = 0;
    let wrongPasswordCount = 0;
    let invalidFileCount = 0;
    let processingErrorCount = 0;
    
    // Обрабатываем каждый файл отдельно
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Проверяем расширение файла
        if (!isSupportedFileExtension(file.name)) {
            invalidFileCount++;
            continue;
        }
        
        // Запрашиваем пароль для каждого файла
        const password = await new Promise((resolve) => {
            const message = `${t("enterPasswordForFile")}:<br><strong>${file.name}</strong>`;
            showPasswordPromptWithValidation(
                t("decryptNote"),
                message,
                file,
                (password) => {
                    resolve(password ? password.trim() : null);
                }
            );
        });
        
        if (password === 'SKIP') {
            cancelledCount++;
            continue;
        }
        
        if (!password) {
            cancelledCount++;
            continue;
        }
        
        // Обрабатываем файл
        try {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = async function (e) {
                    try {
                        const fileContent = e.target.result;
                        let encryptedText;
                        let finalText;
                        
                        // Проверяем, является ли файл новым форматом (JSON с метаданными)
                        try {
                            const decompressedContent = decompressImportData(fileContent);
                            const exportData = JSON.parse(decompressedContent);
                            
                            if (exportData.metadata && exportData.content) {
                                encryptedText = exportData.content;
                            } else {
                                throw new Error('Invalid new format');
                            }
                        } catch (jsonError) {
                            // Старый формат - просто зашифрованный текст
                            encryptedText = fileContent;
                        }
                        
                        // Расшифровываем
                        const decryptedText = await advancedEncryption.decrypt(encryptedText, password);
                        
                        // Проверяем, нужно ли удалять обфускацию
                        finalText = decryptedText;
                        try {
                            finalText = advancedEncryption.deobfuscateFile(decryptedText);
                        } catch (obfuscationError) {
                            // Если обфускация не удалась, используем исходный текст
                            finalText = decryptedText;
                        }
                        
                        // Создаем новую заметку
                        const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        const noteObj = {
                            id: newId,
                            content: finalText,
                            creationTime: Date.now(),
                            lastModified: Date.now(),
                            title: notesDB.extractTitle(finalText)
                        };
                        
                        await notesDB.saveNote(noteObj);
                        importedCount++;
                        
                    } catch (error) {
                        
                        // Определяем тип ошибки
                        if (error.message.includes('Invalid password') || error.message.includes('Too many failed attempts')) {
                            wrongPasswordCount++;
                        } else {
                            processingErrorCount++;
                        }
                    }
                    
                    resolve(true);
                };
                
                reader.readAsText(file);
            });
            
        } catch (error) {
            processingErrorCount++;
        }
    }
    
    // Показываем результат
    const totalErrors = cancelledCount + wrongPasswordCount + invalidFileCount + processingErrorCount;
    
    if (importedCount > 0 && totalErrors === 0) {
        // Все файлы успешно импортированы
        showCustomAlert(
            t("success"),
            `${t("imported")}: ${importedCount} ${t("of")} ${files.length}`,
            "success"
        );
        
        // Перезагружаем заметки
        await loadNotes();
    } else if (importedCount > 0 && totalErrors > 0) {
        // Частично успешный импорт
        let details = `${t("imported")}: ${importedCount} ${t("of")} ${files.length}`;
        
        if (cancelledCount > 0) details += `<br>Отменено: ${cancelledCount}`;
        if (wrongPasswordCount > 0) details += `<br>Неправильный пароль: ${wrongPasswordCount}`;
        if (invalidFileCount > 0) details += `<br>Неверный формат: ${invalidFileCount}`;
        if (processingErrorCount > 0) details += `<br>Ошибки обработки: ${processingErrorCount}`;
        
        showCustomAlert(
            t("warning"),
            details,
            "warning"
        );
        
        // Перезагружаем заметки
        await loadNotes();
    } else if (importedCount === 0 && totalErrors > 0) {
        // Все файлы не удалось импортировать
        let details = `Всего ошибок: ${totalErrors} ${t("of")} ${files.length}`;
        
        if (cancelledCount > 0) details += `<br>Отменено: ${cancelledCount}`;
        if (wrongPasswordCount > 0) details += `<br>Неправильный пароль: ${wrongPasswordCount}`;
        if (invalidFileCount > 0) details += `<br>Неверный формат: ${invalidFileCount}`;
        if (processingErrorCount > 0) details += `<br>Ошибки обработки: ${processingErrorCount}`;
        
        showCustomAlert(
            t("error"),
            details,
            "error"
        );
    }
}

function transliterate(text) {
    // Расширенная карта транслитерации для всех поддерживаемых языков
    const translitMap = {
        // Русский язык
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        
        // Украинский язык
        'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g',
        
        // Польский язык
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        
        // Чешский и словацкий языки
        'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u', 'ž': 'z',
        'ý': 'y', 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        
        // Болгарский язык
        'ъ': '', 'ь': '',
        
        // Хорватский, сербский, боснийский языки
        'đ': 'd', 'ć': 'c', 'č': 'c', 'š': 's', 'ž': 'z',
        
        // Македонский язык
        'ѓ': 'g', 'ѕ': 'z', 'ј': 'j', 'љ': 'lj', 'њ': 'nj', 'ќ': 'k', 'џ': 'dz',
        
        // Словенский язык
        'č': 'c', 'š': 's', 'ž': 'z',
        
        // Немецкий язык
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
        
        // Французский язык
        'à': 'a', 'â': 'a', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'î': 'i', 'ï': 'i',
        'ô': 'o', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y',
        
        // Испанский язык
        'ñ': 'n', 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        
        // Итальянский язык
        'à': 'a', 'è': 'e', 'é': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
        
        // Португальский язык
        'ã': 'a', 'õ': 'o', 'ç': 'c', 'á': 'a', 'à': 'a', 'â': 'a', 'é': 'e', 'ê': 'e', 'í': 'i',
        'ó': 'o', 'ô': 'o', 'ú': 'u',
        
        // Скандинавские языки
        'å': 'a', 'æ': 'ae', 'ø': 'o', 'ö': 'o', 'ä': 'a',
        
        // Турецкий язык
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        
        // Греческий язык
        'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th', 'ι': 'i',
        'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's',
        'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
        
        // Заглавные буквы для всех языков
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        'І': 'I', 'Ї': 'Yi', 'Є': 'Ye', 'Ґ': 'G',
        'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
        'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U', 'Ž': 'Z',
        'Ý': 'Y', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'Đ': 'D', 'Ђ': 'D', 'Ћ': 'C', 'Џ': 'Dz',
        'Ѓ': 'G', 'Ѕ': 'Z', 'Ј': 'J', 'Љ': 'Lj', 'Њ': 'Nj', 'Ќ': 'K', 'Џ': 'Dz',
        'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue', 'ß': 'Ss',
        'À': 'A', 'Â': 'A', 'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Î': 'I', 'Ï': 'I',
        'Ô': 'O', 'Ù': 'U', 'Û': 'U', 'Ü': 'U', 'Ÿ': 'Y',
        'Ñ': 'N', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'À': 'A', 'È': 'E', 'É': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
        'Ã': 'A', 'Õ': 'O', 'Ç': 'C', 'Á': 'A', 'À': 'A', 'Â': 'A', 'É': 'E', 'Ê': 'E', 'Í': 'I',
        'Ó': 'O', 'Ô': 'O', 'Ú': 'U',
        'Å': 'A', 'Æ': 'Ae', 'Ø': 'O', 'Ö': 'O', 'Ä': 'A',
        'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
        'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I', 'Θ': 'Th', 'Ι': 'I',
        'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S',
        'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O'
    };
    
    // Транслитерация с поддержкой всех кириллических и латинских символов
    return text.replace(/[а-яёА-ЯЁіїєґІЇЄҐąćęłńóśźżĄĆĘŁŃÓŚŹŻčďěňřšťůžýáéíóúČĎĚŇŘŠŤŮŽÝÁÉÍÓÚđćčšžĐЂЋЏѓѕјљњќџЃЅЈЉЊЌЏäöüßÄÖÜàâçèéêëîïôùûüÿÀÂÇÈÉÊËÎÏÔÙÛÜŸñáéíóúÑÁÉÍÓÚàèéìòùÀÈÉÌÒÙãõçáàâéêíóôúÃÕÇÁÀÂÉÊÍÓÔÚåæøöäÅÆØÖÄçğıöşüÇĞIÖŞÜαβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]/g, char => translitMap[char] || char);
}


function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Упрощенная функция для подсветки найденного текста
function highlightSearchResults(searchQuery) {
    if (!searchQuery) {
        // Убираем все подсветки
        document.querySelectorAll(".search-highlight").forEach(highlight => {
            const parent = highlight.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            }
        });
        return;
    }
    
        // Подсветка отключена для стабильности
}

// Функция для экранирования специальных символов в регулярных выражениях
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Упрощенная и исправленная функция поиска
function filterNotes() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        return;
    }
    
    const searchQuery = searchInput.value.toLowerCase().trim();
    
    // Если поисковый запрос пустой, показываем все заметки
    if (!searchQuery) {
        document.querySelectorAll(".note").forEach(note => {
            note.classList.remove("hidden");
        });
        highlightSearchResults(""); // Убираем подсветку
        return;
    }
    
    // Транслитерируем поисковый запрос
    const transliteratedQuery = transliterate(searchQuery);
    
    // Получаем все заметки
    const notes = document.querySelectorAll(".note");
    let visibleCount = 0;
    
    notes.forEach((note, index) => {
        // Получаем содержимое заметки - ищем основной контент, а не метаданные
        const contentDiv = note.querySelector(".noteContent");
        if (!contentDiv) {
            note.classList.add("hidden");
            return;
        }
        
        const content = contentDiv.textContent.toLowerCase();
        const transliteratedContent = transliterate(content);
        
        // Также получаем метаданные для поиска
        const footerDiv = note.querySelector(".note-footer");
        const footerContent = footerDiv ? footerDiv.textContent.toLowerCase() : "";
        const transliteratedFooter = footerContent ? transliterate(footerContent) : "";
        
        // Получаем заголовок заметки (если есть)
        const titleElement = note.querySelector("h1, h2, h3, h4, h5, h6, .note-title");
        const title = titleElement ? titleElement.textContent.toLowerCase() : "";
        const transliteratedTitle = title ? transliterate(title) : "";
        
        // Простой и эффективный поиск
        const isMatch = (() => {
            // Объединяем весь текст для поиска
            const allText = (content + " " + footerContent + " " + title).toLowerCase();
            const allTransliterated = transliterate(allText);
            
            // 1. Точное совпадение в оригинальном тексте
            if (allText.includes(searchQuery)) {
                return true;
            }
            
            // 2. Точное совпадение в транслитерированном тексте
            if (allTransliterated.includes(transliteratedQuery)) {
                return true;
            }
            
            // 3. Поиск по словам (каждое слово должно быть найдено)
            const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
            if (searchWords.length > 1) {
                const allWordsFound = searchWords.every(searchWord => {
                    const transliteratedWord = transliterate(searchWord);
                    return allText.includes(searchWord) || allTransliterated.includes(transliteratedWord);
                });
                if (allWordsFound) return true;
            }
            
            // 4. Поиск по первым буквам слов
            const words = allText.split(/\s+/);
            const transliteratedWords = allTransliterated.split(/\s+/);
            
            if (words.some(word => word.startsWith(searchQuery)) || 
                transliteratedWords.some(word => word.startsWith(transliteratedQuery))) {
                return true;
            }
            
            // 5. Нечеткий поиск (опускаем последнюю букву для слов длиннее 2 символов)
            if (searchQuery.length > 2) {
                const fuzzyQuery = searchQuery.substring(0, searchQuery.length - 1);
                const transliteratedFuzzy = transliterate(fuzzyQuery);
                
                if (allText.includes(fuzzyQuery) || allTransliterated.includes(transliteratedFuzzy)) {
                    return true;
                }
            }
            
            return false;
        })();
        
        if (isMatch) {
            note.classList.remove("hidden");
            visibleCount++;
        } else {
            note.classList.add("hidden");
        }
    });
    
    // Подсвечиваем найденный текст
    highlightSearchResults(searchQuery);
    
}



// Улучшенные функции экспорта и импорта

// Функция экспорта заметки в HTML (без шифрования)
function exportNoteHTML(noteContent) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueTag = `<!-- Exported on ${timestamp} -->\n`;
    const contentWithTag = uniqueTag + noteContent;

    const filename = `note_${timestamp}.html`;
    const blob = new Blob([contentWithTag], { type: "text/html" });
    downloadFile(blob, filename, "text/html");
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
async function importNotesHTML(files) {
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

                // Проверяем, не является ли файл зашифрованным
                if (isEncryptedFile(importedText)) {
                    errorCount++;
                    showCustomAlert(
                        t("warning"), 
                        t("encryptedFileDetected", { filename: file.name }) + "<br><br>" + t("pleaseSelectEncryptedFormat"), 
                        "warning"
                    );
                    resolve();
                    return;
                }

                // Для HTML файлов не требуется уникальный тег
                // Проверяем, есть ли тег (для совместимости с экспортированными файлами)
                const tagPattern = /<!-- Exported on [\d-T:.Z]+ -->/;
                let cleanedText = importedText;
                
                if (tagPattern.test(importedText)) {
                    // Если есть тег, удаляем его и разделяем заметки
                    cleanedText = importedText.replace(tagPattern, "").trim();
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
                } else {
                    // Если нет тега, импортируем как одну заметку
                    const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    const noteObj = {
                        id: newId,
                        content: importedText,
                        creationTime: Date.now(),
                        lastModified: Date.now(),
                        title: notesDB.extractTitle(importedText)
                    };
                    await notesDB.saveNote(noteObj);
                    importedCount++;
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

// Функция импорта Markdown файлов
async function importNotesMarkdown(files) {
    if (!files || files.length === 0) return;
    
    let importedCount = 0;
    let errorCount = 0;
    let totalFiles = files.length;
    let processedFiles = 0;

    const processFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async function (e) {
                try {
                    const markdownContent = e.target.result;

                    // Проверяем, не является ли файл зашифрованным
                    if (isEncryptedFile(markdownContent)) {
                        errorCount++;
                        showCustomAlert(
                            t("warning"), 
                            t("encryptedFileDetected", { filename: file.name }) + "<br><br>" + t("pleaseSelectEncryptedFormat"), 
                            "warning"
                        );
                        resolve();
                        return;
                    }

                    // Обрабатываем изображения в Markdown
                    const processedMarkdown = await processMarkdownImages(markdownContent, file);
                    
                    // Преобразуем Markdown в HTML с полной поддержкой всех функций
                    const htmlContent = convertMarkdownToHTML(processedMarkdown);
                    
                    // Извлекаем заголовок из Markdown
                    const title = extractMarkdownTitle(markdownContent) || file.name.replace(/\.[^/.]+$/, "");
                    
                    const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    const noteObj = {
                        id: newId,
                        content: htmlContent,
                        creationTime: Date.now(),
                        lastModified: Date.now(),
                        title: title,
                        tags: ['imported', 'markdown']
                    };
                    await notesDB.saveNote(noteObj);
                    importedCount++;
                    
                } catch (error) {
                    errorCount++;
                    console.error('Markdown import error:', error);
                    showCustomAlert(t("error"), t("errorImport", { filename: file.name, message: error.message }), "error");
                }
                
                processedFiles++;
                if (processedFiles === totalFiles) {
                    showImportResult(importedCount, errorCount, totalFiles);
                }
                resolve();
            };
            reader.readAsText(file);
        });
    };

    const promises = Array.from(files).map(file => processFile(file));
    await Promise.all(promises);
}



// Улучшенная функция для преобразования Markdown в HTML с полной поддержкой всех функций
function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Обрабатываем блоки кода с языком (должно быть первым)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${language}>${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Обрабатываем инлайн код
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Обрабатываем заголовки (от H6 до H1)
    html = html.replace(/^#{6}\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#{5}\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#{4}\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^#{3}\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#{2}\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#{1}\s+(.*)$/gm, '<h1>$1</h1>');
    
    // Обрабатываем горизонтальные линии
    html = html.replace(/^[-*_]{3,}$/gm, '<hr>');
    
    // Обрабатываем цитаты
    html = html.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');
    
    // Обрабатываем упорядоченные списки
    html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li>$2</li>');
    
    // Обрабатываем неупорядоченные списки
    html = html.replace(/^[-*+]\s+(.*)$/gm, '<li>$1</li>');
    
    // Оборачиваем последовательные <li> в <ol> или <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
        const lines = match.split('\n');
        let result = '';
        let inList = false;
        let listType = 'ul';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('<li>')) {
                if (!inList) {
                    // Определяем тип списка по первому элементу
                    const prevLine = i > 0 ? lines[i-1] : '';
                    if (prevLine.match(/^\d+\./)) {
                        listType = 'ol';
                    }
                    result += `<${listType}>`;
                    inList = true;
                }
                result += line + '\n';
            } else {
                if (inList) {
                    result += `</${listType}>`;
                    inList = false;
                }
                result += line + '\n';
            }
        }
        
        if (inList) {
            result += `</${listType}>`;
        }
        
        return result;
    });
    
    // Обрабатываем изображения с поддержкой title
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g, (match, alt, src, title) => {
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${titleAttr} style="max-width: 100%; height: auto;">`;
    });
    
    // Обрабатываем ссылки с поддержкой title
    html = html.replace(/\[([^\]]+)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g, (match, text, href, title) => {
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    });
    
    // Обрабатываем автолинки
    html = html.replace(/(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Обрабатываем жирный текст
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Обрабатываем курсив
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Обрабатываем зачеркнутый текст
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    
    // Обрабатываем подчеркнутый текст
    html = html.replace(/<u>([^<]+)<\/u>/g, '<u>$1</u>');
    
    // Обрабатываем таблицы
    html = html.replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
        const headerCells = header.split('|').map(cell => `<th>${cell.trim()}</th>`).join('');
        const tableRows = rows.split('\n').filter(row => row.trim()).map(row => {
            const cells = row.split('|').map(cell => `<td>${cell.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        
        return `<table><thead><tr>${headerCells}</tr></thead><tbody>${tableRows}</tbody></table>`;
    });
    
    // Обрабатываем переносы строк
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Оборачиваем в параграфы
    html = '<p>' + html + '</p>';
    
    // Очищаем пустые параграфы и лишние теги
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    
    return html;
}

// Функция для экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для обработки изображений в Markdown
async function processMarkdownImages(markdownContent, file) {
    // Находим все изображения в Markdown
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let processedMarkdown = markdownContent;
    let match;
    
    while ((match = imageRegex.exec(markdownContent)) !== null) {
        const [fullMatch, alt, src] = match;
        
        // Если это относительный путь, пытаемся найти изображение рядом с файлом
        if (!src.startsWith('http') && !src.startsWith('data:')) {
            try {
                // Создаем новый input для выбора изображения
                const imageInput = document.createElement('input');
                imageInput.type = 'file';
                imageInput.accept = 'image/*';
                imageInput.style.display = 'none';
                
                // Показываем диалог для выбора изображения
                const imageDataUrl = await new Promise((resolve) => {
                    imageInput.addEventListener('change', (e) => {
                        const imageFile = e.target.files[0];
                        if (imageFile) {
                            const reader = new FileReader();
                            reader.onload = (e) => resolve(e.target.result);
                            reader.readAsDataURL(imageFile);
                        } else {
                            resolve(null);
                        }
                    });
                    
                    // Показываем диалог выбора изображения
                    showCustomAlert(
                        t("imageNotFound") || "Image not found", 
                        (t("imageNotFoundMessage") || "Image not found: {src}").replace('{src}', src) + "<br><br>" + (t("selectImageFile") || "Please select the image file"),
                        "info"
                    );
                    
                    setTimeout(() => {
                        imageInput.click();
                    }, 1000);
                });
                
                if (imageDataUrl) {
                    // Заменяем путь на data URL
                    processedMarkdown = processedMarkdown.replace(fullMatch, `![${alt}](${imageDataUrl})`);
                }
            } catch (error) {
                console.warn('Could not process image:', src, error);
            }
        }
    }
    
    return processedMarkdown;
}

// Функция для извлечения заголовка из Markdown
function extractMarkdownTitle(markdownContent) {
    const lines = markdownContent.split('\n');
    
    // Ищем первый заголовок H1
    for (const line of lines) {
        const h1Match = line.match(/^#\s+(.+)$/);
        if (h1Match) {
            return h1Match[1].trim();
        }
    }
    
    // Если H1 не найден, ищем H2
    for (const line of lines) {
        const h2Match = line.match(/^##\s+(.+)$/);
        if (h2Match) {
            return h2Match[1].trim();
        }
    }
    
    // Если заголовки не найдены, берем первую непустую строку
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('>') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
            return trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed;
        }
    }
    
    return null;
}

// Функция для показа результата импорта
function showImportResult(importedCount, errorCount, totalFiles) {
    if (importedCount > 0 && errorCount === 0) {
        showCustomAlert(
            t("success"),
            `${t("imported")}: ${importedCount} ${t("of")} ${totalFiles}`,
            "success"
        );
        loadNotes();
    } else if (importedCount > 0 && errorCount > 0) {
        showCustomAlert(
            t("warning"),
            `${t("imported")}: ${importedCount} ${t("of")} ${totalFiles}<br>${t("errors")}: ${errorCount}`,
            "warning"
        );
        loadNotes();
    } else if (importedCount === 0 && errorCount > 0) {
        showCustomAlert(
            t("error"),
            `${t("errors")}: ${errorCount} ${t("of")} ${totalFiles}`,
            "error"
        );
    }
}

// Функция для определения зашифрованных файлов
function isEncryptedFile(content) {
    // Проверяем признаки зашифрованного файла
    const encryptedPatterns = [
        // Базовый зашифрованный контент (обычно содержит base64 и специальные символы)
        /^[A-Za-z0-9+/=]{100,}$/, // Длинные base64 строки
        // JSON формат с метаданными (новый формат)
        /^\s*\{.*"metadata".*"content".*\}\s*$/s,
        // Обфусцированный контент
        /^\s*[A-Za-z0-9+/=]{50,}\s*$/,
        // Зашифрованный контент с префиксами
        /^(encrypted|enc|secure):/i
    ];
    
    // Проверяем, не является ли это обычным HTML
    const htmlPatterns = [
        /^\s*<!DOCTYPE\s+html/i,
        /^\s*<html/i,
        /^\s*<head/i,
        /^\s*<body/i,
        /^\s*<div/i,
        /^\s*<p/i,
        /^\s*<h[1-6]/i
    ];
    
    // Если это явно HTML, то не зашифрованный
    if (htmlPatterns.some(pattern => pattern.test(content))) {
        return false;
    }
    
    // Если это короткий текст, скорее всего не зашифрованный
    if (content.length < 50) {
        return false;
    }
    
    // Проверяем паттерны зашифрованного контента
    return encryptedPatterns.some(pattern => pattern.test(content));
}

// Улучшенная функция импорта с поддержкой разных форматов
async function importNotesWithFormat(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        return;
    }
    
    // Сохраняем файлы в переменную перед сбросом input
    const filesArray = Array.from(files);
    
    // Сбрасываем значение input для возможности повторного импорта
    event.target.value = '';

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
                <button class="export-option" data-format="markdown">
                    <span class="export-icon">📝</span>
                    <span class="export-text">Markdown</span>
                    <span class="export-desc">${t("markdownFiles")}</span>
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
                // Для зашифрованных файлов используем новую логику с индивидуальными паролями
                importNotesWithFiles(filesArray);
            } else if (format === 'html') {
                importNotesHTML(filesArray);
            } else if (format === 'markdown') {
                importNotesMarkdown(filesArray);
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

// Функция для вставки iframe
function insertIframe() {
    if (tinymceEditor) {
        showCustomIframeDialog(tinymceEditor);
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
        { name: 'Iframe', func: insertIframe },
        { name: 'Anchor', func: insertAnchor },
        { name: 'Code', func: insertCode },
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


// Делаем функции доступными в глобальной области для тестирования
window.testModals = testModals;
window.insertImage = insertImage;
window.insertLink = insertLink;
window.insertMedia = insertMedia;
window.insertIframe = insertIframe;
window.insertAnchor = insertAnchor;
window.insertCode = insertCode;

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

    // Функция для валидации пароля без блокировки
    async validatePassword(encryptedText, password) {
        try {
            
            // Используем ту же логику, что и в основной функции decrypt
            try {
                // Сначала пробуем новый алгоритм
                // Декодируем из base64
                const obfuscated = new Uint8Array(
                    atob(encryptedText).split('').map(char => char.charCodeAt(0))
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
                
                const decoder = new TextDecoder();
                const decryptedText = decoder.decode(decrypted);
                return decryptedText;
                
            } catch (newAlgorithmError) {
                
                // Пробуем старый алгоритм
                const encryptedData = JSON.parse(encryptedText);
                
                if (!encryptedData.iv || !encryptedData.ciphertext || !encryptedData.salt || !encryptedData.tag) {
                    throw new Error('Invalid encrypted data format');
                }
                
                // Конвертируем данные из base64
                const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
                const ciphertext = Uint8Array.from(atob(encryptedData.ciphertext), c => c.charCodeAt(0));
                const salt = Uint8Array.from(atob(encryptedData.salt), c => c.charCodeAt(0));
                const tag = Uint8Array.from(atob(encryptedData.tag), c => c.charCodeAt(0));
                
                // Генерируем ключ из пароля
                const keyMaterial = await crypto.subtle.importKey(
                    'raw',
                    new TextEncoder().encode(password),
                    'PBKDF2',
                    false,
                    ['deriveBits', 'deriveKey']
                );
                
                const key = await crypto.subtle.deriveKey(
                    {
                        name: 'PBKDF2',
                        salt: salt,
                        iterations: 200000,
                        hash: 'SHA-256'
                    },
                    keyMaterial,
                    { name: 'AES-GCM', length: 256 },
                    false,
                    ['decrypt']
                );
                
                // Пробуем расшифровать
                const decryptedData = await crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: iv,
                        tagLength: 128
                    },
                    key,
                    new Uint8Array([...ciphertext, ...tag])
                );
                
                // Конвертируем в строку
                const decryptedText = new TextDecoder().decode(decryptedData);
                return decryptedText;
            }
            
        } catch (error) {
            throw new Error('Invalid password');
        }
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
    async encryptMedia(file, password) {
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

    // Поиск заметок с поддержкой транслитерации
        async searchNotes(query) {
            if (!this.db) await this.init();
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['notes'], 'readonly');
                const store = transaction.objectStore('notes');
                const request = store.getAll();

                request.onsuccess = () => {
                    const notes = request.result;
                    const searchQuery = query.toLowerCase().trim();
                    const transliteratedQuery = transliterate(searchQuery);
                    
                    const filteredNotes = notes.filter(note => {
                        const content = note.content.toLowerCase();
                        const title = (note.title || '').toLowerCase();
                        
                        // Объединяем весь текст для поиска
                        const allText = (content + " " + title).toLowerCase();
                        const allTransliterated = transliterate(allText);
                        
                        // 1. Точное совпадение в оригинальном тексте
                        if (allText.includes(searchQuery)) {
                            return true;
                        }
                        
                        // 2. Точное совпадение в транслитерированном тексте
                        if (allTransliterated.includes(transliteratedQuery)) {
                            return true;
                        }
                        
                        // 3. Поиск по словам (каждое слово должно быть найдено)
                        const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
                        if (searchWords.length > 1) {
                            const allWordsFound = searchWords.every(searchWord => {
                                const transliteratedWord = transliterate(searchWord);
                                return allText.includes(searchWord) || allTransliterated.includes(transliteratedWord);
                            });
                            if (allWordsFound) return true;
                        }
                        
                        // 4. Поиск по первым буквам слов
                        const words = allText.split(/\s+/);
                        const transliteratedWords = allTransliterated.split(/\s+/);
                        
                        if (words.some(word => word.startsWith(searchQuery)) || 
                            transliteratedWords.some(word => word.startsWith(transliteratedQuery))) {
                            return true;
                        }
                        
                        // 5. Нечеткий поиск (опускаем последнюю букву для слов длиннее 2 символов)
                        if (searchQuery.length > 2) {
                            const fuzzyQuery = searchQuery.substring(0, searchQuery.length - 1);
                            const transliteratedFuzzy = transliterate(fuzzyQuery);
                            
                            if (allText.includes(fuzzyQuery) || allTransliterated.includes(transliteratedFuzzy)) {
                                return true;
                            }
                        }
                        
                        return false;
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
    const filename = `note_${timestamp}.md`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    downloadFile(blob, filename, "text/markdown");
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
        
        
        // Обновляем переводы в приветственном сообщении, если оно отображается
        if (typeof updateWelcomeTranslations === 'function') {
            updateWelcomeTranslations();
        }
    } catch (error) {
        console.error('Error updating footer texts:', error);
    }
}

// Функция для показа приветственного сообщения
function showWelcomeMessage() {
    const notesContainer = document.getElementById("notesContainer");
    if (!notesContainer) {
        return;
    }
    
    // Проверяем, не показано ли уже приветственное сообщение
    const existingWelcome = document.querySelector('.welcome-message');
    if (existingWelcome) {
        return; // Приветственное сообщение уже показано
    }

    // Функция для безопасного получения перевода
    function getTranslation(key, fallback = key) {
        try {
            if (typeof t === 'function') {
                const translation = t(key);
                return translation && translation !== key ? translation : fallback;
            }
            return fallback;
        } catch (error) {
            return fallback;
        }
    }

    // Создаем контейнер для приветственного сообщения
    const welcomeContainer = document.createElement("div");
    welcomeContainer.classList.add("welcome-message");
    welcomeContainer.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-header">
                <h1 class="welcome-title">${getTranslation('welcomeTitle', 'Welcome to Local Notes')}</h1>
                <p class="welcome-subtitle">${getTranslation('welcomeSubtitle', 'Secure, private note-taking in your browser')}</p>
            </div>
            
            <div class="welcome-section">
                <h2 class="welcome-section-title">${getTranslation('welcomeAbout', 'About Local Notes')}</h2>
                <p class="welcome-description">${getTranslation('welcomeDescription', 'Local Notes is a secure web application for creating and storing notes directly in your browser. All data remains on your device with military-grade encryption.')}</p>
            </div>
            
            <div class="welcome-section">
                <h2 class="welcome-section-title">${getTranslation('welcomeFeatures', 'Key Features')}</h2>
                <ul class="welcome-features">
                    <li>${getTranslation('welcomeFeature1', 'Military-grade AES-256 encryption')}</li>
                    <li>${getTranslation('welcomeFeature2', '12 languages supported')}</li>
                    <li>${getTranslation('welcomeFeature3', 'PWA support - install as app')}</li>
                    <li>${getTranslation('welcomeFeature4', 'Optimized performance')}</li>
                    <li>${getTranslation('welcomeFeature5', 'Enhanced security protection')}</li>
                    <li>${getTranslation('welcomeFeature6', 'Modern responsive design')}</li>
                    <li>${getTranslation('welcomeFeature7', 'Offline operation support')}</li>
                </ul>
            </div>
            
            <div class="welcome-section">
                <h2 class="welcome-section-title">${getTranslation('welcomeGoals', 'Project Goals')}</h2>
                <ul class="welcome-goals">
                    <li>${getTranslation('welcomeGoal1', 'Maximum privacy - data stays local')}</li>
                    <li>${getTranslation('welcomeGoal2', 'Security - military-grade encryption')}</li>
                    <li>${getTranslation('welcomeGoal3', 'Accessibility - 12 languages')}</li>
                    <li>${getTranslation('welcomeGoal4', 'Universality - works everywhere')}</li>
                    <li>${getTranslation('welcomeGoal5', 'Performance - fast operation')}</li>
                    <li>${getTranslation('welcomeGoal6', 'Convenience - intuitive interface')}</li>
                </ul>
            </div>
            
            <div class="welcome-section">
                <h2 class="welcome-section-title">${getTranslation('welcomeDeveloper', 'Developer')}</h2>
                <p class="welcome-developer-info">${getTranslation('welcomeDeveloperInfo', 'Developed by SerGio Play. Open source project focused on privacy and security.')}</p>
            </div>
            
            <div class="welcome-section">
                <h2 class="welcome-section-title">${getTranslation('welcomeGetStarted', 'Get Started')}</h2>
                <p class="welcome-get-started">${getTranslation('welcomeGetStartedText', 'Click \'Add Note\' to create your first note and start organizing your information securely.')}</p>
            </div>
            
            <div class="welcome-actions">
                <button class="welcome-dismiss-btn" onclick="showWelcomeInstructions()">
                    ${getTranslation('welcomeDismiss', 'Show instructions')}
                </button>
            </div>
        </div>
    `;

    notesContainer.appendChild(welcomeContainer);
    
    // Принудительно запускаем анимации после добавления в DOM
    setTimeout(() => {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            // Сбрасываем анимации и запускаем заново
            const animatedElements = welcomeMessage.querySelectorAll('.welcome-header, .welcome-title, .welcome-subtitle, .welcome-section, .welcome-actions');
            animatedElements.forEach((element, index) => {
                element.style.animation = 'none';
                element.offsetHeight; // Принудительный reflow
                element.style.animation = null;
            });
        }
    }, 50);
    
    // Обновляем переводы через небольшую задержку, если система переводов загрузится позже
    setTimeout(() => {
        updateWelcomeTranslations();
    }, 100);
}

// Функция для обновления переводов в приветственном сообщении
function updateWelcomeTranslations() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (!welcomeMessage || typeof t !== 'function') return;
    
    try {
        // Обновляем все тексты
        const titleElement = welcomeMessage.querySelector('.welcome-title');
        if (titleElement) titleElement.textContent = t('welcomeTitle') || 'Welcome to Local Notes';
        
        const subtitleElement = welcomeMessage.querySelector('.welcome-subtitle');
        if (subtitleElement) subtitleElement.textContent = t('welcomeSubtitle') || 'Secure, private note-taking in your browser';
        
        const aboutTitle = welcomeMessage.querySelector('.welcome-section:nth-child(2) .welcome-section-title');
        if (aboutTitle) aboutTitle.textContent = t('welcomeAbout') || 'About Local Notes';
        
        const aboutDesc = welcomeMessage.querySelector('.welcome-section:nth-child(2) .welcome-description');
        if (aboutDesc) aboutDesc.textContent = t('welcomeDescription') || 'Local Notes is a secure web application for creating and storing notes directly in your browser. All data remains on your device with military-grade encryption.';
        
        const featuresTitle = welcomeMessage.querySelector('.welcome-section:nth-child(3) .welcome-section-title');
        if (featuresTitle) featuresTitle.textContent = t('welcomeFeatures') || 'Key Features';
        
        const featuresList = welcomeMessage.querySelectorAll('.welcome-features li');
        const featureKeys = ['welcomeFeature1', 'welcomeFeature2', 'welcomeFeature3', 'welcomeFeature4', 'welcomeFeature5', 'welcomeFeature6', 'welcomeFeature7'];
        featuresList.forEach((item, index) => {
            if (featureKeys[index]) {
                item.textContent = t(featureKeys[index]) || item.textContent;
            }
        });
        
        const goalsTitle = welcomeMessage.querySelector('.welcome-section:nth-child(4) .welcome-section-title');
        if (goalsTitle) goalsTitle.textContent = t('welcomeGoals') || 'Project Goals';
        
        const goalsList = welcomeMessage.querySelectorAll('.welcome-goals li');
        const goalKeys = ['welcomeGoal1', 'welcomeGoal2', 'welcomeGoal3', 'welcomeGoal4', 'welcomeGoal5', 'welcomeGoal6'];
        goalsList.forEach((item, index) => {
            if (goalKeys[index]) {
                item.textContent = t(goalKeys[index]) || item.textContent;
            }
        });
        
        const developerTitle = welcomeMessage.querySelector('.welcome-section:nth-child(5) .welcome-section-title');
        if (developerTitle) developerTitle.textContent = t('welcomeDeveloper') || 'Developer';
        
        const developerInfo = welcomeMessage.querySelector('.welcome-section:nth-child(5) .welcome-developer-info');
        if (developerInfo) developerInfo.textContent = t('welcomeDeveloperInfo') || 'Developed by SerGio Play. Open source project focused on privacy and security.';
        
        const getStartedTitle = welcomeMessage.querySelector('.welcome-section:nth-child(6) .welcome-section-title');
        if (getStartedTitle) getStartedTitle.textContent = t('welcomeGetStarted') || 'Get Started';
        
        const getStartedText = welcomeMessage.querySelector('.welcome-section:nth-child(6) .welcome-get-started');
        if (getStartedText) getStartedText.textContent = t('welcomeGetStartedText') || 'Click \'Add Note\' to create your first note and start organizing your information securely.';
        
        const dismissBtn = welcomeMessage.querySelector('.welcome-dismiss-btn');
        if (dismissBtn) dismissBtn.textContent = t('welcomeDismiss') || 'Show instructions';
        
    } catch (error) {
        // Игнорируем ошибки обновления переводов
    }
}

// Функция для показа инструкций в модальном окне
function showWelcomeInstructions() {
    const title = t('welcomeInstructionsTitle') || 'How to get started';
    const message = t('welcomeInstructions') || 'To create your first note, click the \'Add Note\' button in the top panel. You can then write your content and save it securely.';
    
    if (typeof showCustomAlert === 'function') {
        showCustomAlert(title, message, 'info');
    } else {
        alert(`${title}\n\n${message}`);
    }
}

// Функция для скрытия приветственного сообщения (вызывается после создания первой заметки)
function dismissWelcomeMessage() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        // Добавляем класс для анимации исчезновения
        welcomeMessage.style.animation = 'welcomeFadeOut 0.3s ease-in-out forwards';
        
        setTimeout(() => {
            welcomeMessage.remove();
        }, 300);
    }
}

// ===== ФУНКЦИИ ДЛЯ ОБРАБОТКИ ТАБЛИЦ =====

/**
 * Обрабатывает таблицы для адаптивности и добавляет прокрутку
 * @param {HTMLElement} container - Контейнер с контентом заметки
 */
function processTablesForResponsiveness(container) {
    const tables = container.querySelectorAll('table');
    
    tables.forEach(table => {
        // Проверяем, не обернута ли уже таблица в контейнер
        if (table.parentElement.classList.contains('table-container')) {
            return;
        }
        
        // Создаем контейнер для таблицы
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        
        // Определяем тип таблицы и добавляем соответствующие классы
        const tableClasses = determineTableClasses(table);
        table.classList.add(...tableClasses);
        
        // Вставляем контейнер перед таблицей
        table.parentNode.insertBefore(tableContainer, table);
        
        // Перемещаем таблицу в контейнер
        tableContainer.appendChild(table);
        
        // Добавляем обработчики для индикатора прокрутки
        addScrollIndicators(tableContainer);
        
        // Оптимизируем таблицу для мобильных устройств
        optimizeTableForMobile(table);
    });
}

/**
 * Определяет классы для таблицы на основе её содержимого
 * @param {HTMLTableElement} table - Таблица
 * @returns {string[]} Массив классов
 */
function determineTableClasses(table) {
    const classes = [];
    
    // Подсчитываем количество колонок
    const columnCount = table.querySelectorAll('th, td').length / table.querySelectorAll('tr').length;
    
    // Определяем тип таблицы
    if (columnCount > 6) {
        classes.push('large-table');
    } else if (columnCount <= 3) {
        classes.push('compact-table');
    }
    
    // Проверяем, содержит ли таблица числовые данные
    const hasNumericData = Array.from(table.querySelectorAll('td')).some(td => {
        const text = td.textContent.trim();
        return /^\d+([.,]\d+)?$/.test(text) || /^\d+([.,]\d+)?%$/.test(text);
    });
    
    if (hasNumericData) {
        classes.push('numeric-table');
    }
    
    // Проверяем, нужна ли фиксация первой колонки
    if (columnCount > 4) {
        classes.push('fixed-columns');
    }
    
    return classes;
}

/**
 * Добавляет индикаторы прокрутки для мобильных устройств
 * @param {HTMLElement} container - Контейнер таблицы
 */
function addScrollIndicators(container) {
    let isScrolling = false;
    let scrollTimeout;
    
    // Обработчик прокрутки
    const handleScroll = () => {
        if (!isScrolling) {
            container.classList.add('scrolled');
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Проверяем, находится ли таблица в начальной позиции
            if (container.scrollLeft === 0) {
                container.classList.remove('scrolled');
                isScrolling = false;
            }
        }, 150);
    };
    
    // Добавляем обработчики событий
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleScroll, { passive: true });
    container.addEventListener('touchmove', handleScroll, { passive: true });
}

/**
 * Оптимизирует таблицу для мобильных устройств
 * @param {HTMLTableElement} table - Таблица
 */
function optimizeTableForMobile(table) {
    // Добавляем атрибуты для лучшей производительности
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Таблица данных');
    
    // Оптимизируем заголовки
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.setAttribute('scope', 'col');
        header.setAttribute('aria-label', `Колонка ${index + 1}`);
    });
    
    // Оптимизируем ячейки
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        // Добавляем атрибуты для доступности
        cell.setAttribute('role', 'cell');
        
        // Оптимизируем длинный текст
        const text = cell.textContent;
        if (text.length > 50) {
            cell.setAttribute('title', text);
            cell.style.maxWidth = '200px';
        }
    });
    
    // Добавляем обработчики для touch-событий
    table.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    table.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: true });
}

// ===== ОБРАБОТЧИКИ ДЛЯ ПЕРЕКЛЮЧЕНИЯ РЕЖИМОВ ОТОБРАЖЕНИЯ =====

// Инициализация обработчиков после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопки переключения режимов
    const toggleViewButton = document.getElementById('toggleViewButton');
    if (toggleViewButton) {
        toggleViewButton.addEventListener('click', toggleViewMode);
    }
});

/**
 * Переключает режим отображения заметок между сеткой и списком
 */
function toggleViewMode() {
    const notesContainer = document.getElementById('notesContainer');
    const toggleButton = document.getElementById('toggleViewButton');
    
    if (!notesContainer || !toggleButton) return;
    
    // Переключаем классы
    if (notesContainer.classList.contains('default-view')) {
        // Переключаемся на режим списка
        notesContainer.classList.remove('default-view');
        notesContainer.classList.add('full-width-view');
        
        // Обновляем иконку и текст кнопки
        toggleButton.innerHTML = '<i class="fas fa-th"></i> Grid View';
        toggleButton.title = 'Переключить на сеточный вид';
        
        // Сохраняем предпочтение пользователя
        localStorage.setItem('notesViewMode', 'list');
    } else {
        // Переключаемся на режим сетки
        notesContainer.classList.remove('full-width-view');
        notesContainer.classList.add('default-view');
        
        // Обновляем иконку и текст кнопки
        toggleButton.innerHTML = '<i class="fas fa-list"></i> List View';
        toggleButton.title = 'Переключить на список';
        
        // Сохраняем предпочтение пользователя
        localStorage.setItem('notesViewMode', 'grid');
    }
    
    // Перезагружаем заметки для применения новых стилей
    loadNotes();
}

/**
 * Восстанавливает сохраненный режим отображения при загрузке страницы
 */
function restoreViewMode() {
    const savedMode = localStorage.getItem('notesViewMode');
    const notesContainer = document.getElementById('notesContainer');
    const toggleButton = document.getElementById('toggleViewButton');
    
    if (!notesContainer || !toggleButton) return;
    
    if (savedMode === 'list') {
        // Устанавливаем режим списка
        notesContainer.classList.remove('default-view');
        notesContainer.classList.add('full-width-view');
        toggleButton.innerHTML = '<i class="fas fa-th"></i> Grid View';
        toggleButton.title = 'Переключить на сеточный вид';
    } else {
        // Устанавливаем режим сетки (по умолчанию)
        notesContainer.classList.remove('full-width-view');
        notesContainer.classList.add('default-view');
        toggleButton.innerHTML = '<i class="fas fa-list"></i> List View';
        toggleButton.title = 'Переключить на список';
    }
}

// Вызываем восстановление режима при загрузке
document.addEventListener('DOMContentLoaded', restoreViewMode);

