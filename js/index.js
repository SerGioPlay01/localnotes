// Оптимизация для мобильных устройств
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Добавляем классы для мобильных устройств
if (isMobile) {
    document.documentElement.classList.add('mobile-device');
}
if (isTouch) {
    document.documentElement.classList.add('touch-device');
}

// Оптимизация событий для touch-устройств
const eventType = isTouch ? 'touchstart' : 'click';

document.getElementById("addNoteButton").addEventListener(eventType, (e) => {
    e.preventDefault();
    openModal();
});
document.getElementById("importButton").addEventListener(eventType, (e) => {
    e.preventDefault();
    document.getElementById("importInput").click();
});
document.getElementById("importInput").addEventListener("change", importNotesWithFormat);
document.getElementById("searchInput").addEventListener("input", filterNotes);

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

// Функция для обновления темы TinyMCE при смене темы сайта
function updateTinyMCETheme() {
    if (tinymceEditor && tinymceEditor.settings) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        // Сохраняем текущее содержимое
        const currentContent = tinymceEditor.getContent();
        
        // Обновляем настройки
        tinymceEditor.settings.skin = getTinyMCESkin();
        tinymceEditor.settings.content_css = getTinyMCEContentCSS();
        tinymceEditor.settings.content_style = getTinyMCEContentStyle();
        
        // Перезагружаем редактор с новой темой
        tinymceEditor.destroy();
        setTimeout(() => {
            initTinyMCE();
            // Восстанавливаем содержимое после инициализации
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

// Инициализация приложения
window.onload = async () => {
    try {
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
        
        // Обновляем текст кнопок
        if (typeof updateButtonTexts === 'function') {
            updateButtonTexts();
        }
        
        // Обновляем текст футера
        if (typeof updateFooterTexts === 'function') {
            updateFooterTexts();
        }
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

// Инициализация редактора TinyMCE
function initTinyMCE() {
    if (typeof tinymce === 'undefined') {
        console.error('TinyMCE library is not loaded');
        return false;
    }
    
    tinymce.init({
        selector: '.tinymce',
        base_url: '/editor_news',
        suffix: '.min',
        height: '100%',
        width: '100%',
        menubar: !isMobile,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'codesample', 'pagebreak', 'nonbreaking', 'quickbars', 'accordion',
            'autosave', 'directionality', 'visualchars'
        ],
        toolbar: isMobile ? 
            'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | numlist bullist | forecolor backcolor | charmap emoticons | link image | code' :
            'undo redo | blocks fontfamily fontsize | ' +
            'bold italic underline strikethrough superscript subscript | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'outdent indent | numlist bullist | ' +
            'forecolor backcolor removeformat | ' +
            'pagebreak | charmap emoticons | ' +
            'fullscreen preview | insertfile image media link anchor codesample | ' +
            'ltr rtl | code | help',
        toolbar_mode: isMobile ? 'sliding' : 'wrap',
        toolbar_sticky: !isMobile,
        language: getTinyMCELanguage(),
        license_key: 'gpl',
        branding: false,
        promotion: false,
        resize: !isMobile,
        elementpath: !isMobile,
        statusbar: false,
        quickbars_selection_toolbar: isTouch ? 'bold italic | quicklink h2 h3 blockquote quickimage quicktable' : false,
        quickbars_insert_toolbar: isTouch ? 'quickimage quicktable' : false,
        contextmenu: isTouch ? 'link image imagetools table' : 'link image imagetools table',
        mobile: isMobile,
        touch: isTouch,
        menubar: 'file edit view insert format tools table help',
        menu: {
            file: { title: getTinyMCETranslation('File'), items: 'newdocument restoredraft | preview | export | deleteallconversations' },
            edit: { title: getTinyMCETranslation('Edit'), items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
            view: { title: getTinyMCETranslation('View'), items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
            insert: { title: getTinyMCETranslation('Insert'), items: 'image link media codesample inserttable | charmap emoticons | pagebreak nonbreaking anchor | insertdatetime' },
            format: { title: getTinyMCETranslation('Format'), items: 'bold italic underline strikethrough superscript subscript codeformat | blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat' },
            tools: { title: getTinyMCETranslation('Tools'), items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
            table: { title: getTinyMCETranslation('Table'), items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
            help: { title: getTinyMCETranslation('Help'), items: 'help' }
        },
        content_style: getTinyMCEContentStyle(),
        skin: getTinyMCESkin(),
        content_css: getTinyMCEContentCSS(),
        setup: function (editor) {
            editor.on('change', function () {
                editor.save();
            });
            
            // Сохраняем ссылку на редактор
            tinymceEditor = editor;
            
            // Исправляем отображение и закрытие плавающих панелей
            editor.on('init', function() {
                // Добавляем обработчики для закрытия плавающих панелей
                document.addEventListener('click', function(e) {
                    // Если клик не по плавающей панели, закрываем все панели
                    if (!e.target.closest('.tox-pop') && !e.target.closest('.tox-toolbar')) {
                        const floatingPanels = document.querySelectorAll('.tox-pop:not(.tox-pop--hidden)');
                        floatingPanels.forEach(panel => {
                            panel.classList.add('tox-pop--hidden');
                        });
                    }
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
            }
        });
    
    return true;
}

function openModal(noteId, noteContent, noteCreationTime) {
    const modal = document.getElementById("editModal");

    if (!tinymceEditor) {
        if (!initTinyMCE()) return; // Exit if TinyMCE failed to initialize
    }

    if (noteId) {
        tinymceEditor.setContent(noteContent);
        currentNoteId = noteId;
    } else {
        tinymceEditor.setContent("");
        currentNoteId = null;
    }

    modal.style.display = "block";
    document.body.classList.add('modal-open');

    // Применяем подсветку синтаксиса к блокам кода
    setTimeout(() => {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }, 100);

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

document.getElementById("clearAllButton").addEventListener("click", () => {
    // Определяем сообщение подтверждения
    const confirmationMessage = t("confirmDeleteAll");

    showConfirmModal(confirmationMessage, async () => {
        try {
            // Получаем все заметки и удаляем их
            const notes = await notesDB.getAllNotes();
            for (const note of notes) {
                await notesDB.deleteNote(note.id);
            }
            await loadNotes(); // Обновляет отображение заметок
        } catch (error) {
            console.error('Error clearing notes:', error);
            showCustomAlert(
                t("error"),
                t("errorClearingNotes"),
                "error"
            );
        }
    });
});

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

        const notePreview = document.createElement("div");
        notePreview.classList.add("noteContent");
            notePreview.innerHTML = note.content;
            noteElement.appendChild(notePreview);

        const editButton = document.createElement("button");
        // Устанавливаем текст на кнопке
        editButton.innerHTML = `<i class="fas fa-edit"></i> ${t("edit")}`;
        editButton.classList.add("editBtn");
            editButton.onclick = () => openModal(note.id, note.content, note.creationTime);
            noteElement.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteBtn");
        // Устанавливаем текст на кнопке
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
            noteElement.appendChild(deleteButton);

        const exportButton = document.createElement("button");
        exportButton.classList.add("exportBtn");
        // Устанавливаем текст на кнопке
        exportButton.innerHTML = `<i class="fas fa-download"></i> ${t("export")}`;
            exportButton.onclick = () => showExportOptions(note.content);
            noteElement.appendChild(exportButton);

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
        
        const blob = new Blob([encrypted], { type: "text/plain" });
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
            <input type="text" id="customPromptInput" placeholder="${placeholder}" value="${defaultValue}" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #404040; background: #2a2a2a; color: #ffffff; border-radius: 5px; font-size: 14px;">
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button id="customPromptOk" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">${t("ok")}</button>
                <button id="customPromptCancel" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">${t("cancel")}</button>
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
    
    // Закрытие по клику вне модального окна
    promptModal.addEventListener('click', (e) => {
        if (e.target === promptModal) {
            handleCancel();
        }
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
    
    // Закрытие по клику вне модального окна
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

    for (const file of Array.from(files)) {
        if (!file.name.endsWith('.note')) {
            // Формируем текст в зависимости от языка
            showCustomAlert(t("error"), t("errorInvalidFile", { filename: file.name }), "error");
            errorCount++;
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
                    // Формируем текст в зависимости от языка
                    showCustomAlert(t("error"), t("errorNoUniqueTag", { filename: file.name }), "error");
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

                if (importedCount > 0) {
                    showCustomAlert(t("success"), t("importCompleted", { count: importedCount }), "success");
                    await loadNotes();
                }
            } catch (err) {
                errorCount++;
                // Формируем текст в зависимости от языка
                showCustomAlert(t("error"), t("errorDecryption", { filename: file.name }), "error");
            }
        };
        reader.readAsText(file);
    }
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

document.getElementById("searchInput").addEventListener("input", debounce(filterNotes, 300));

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

    for (const [index, file] of Array.from(files).entries()) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const importedText = e.target.result;

                // Проверяем наличие уникального тега
                const tagPattern = /<!-- Exported on [\d-T:.Z]+ -->/;
                if (!tagPattern.test(importedText)) {
                    errorCount++;
                    showCustomAlert(t("error"), t("errorNoUniqueTag", { filename: file.name }), "error");
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

                // Проверяем, обработаны ли все файлы
                if (index === totalFiles - 1) {
                    if (importedCount > 0) {
                        showCustomAlert(t("success"), t("importCompleted", { count: importedCount }), "success");
                        await loadNotes();
                    } else if (errorCount === totalFiles) {
                        showCustomAlert(t("error"), t("errorNoFilesImported"), "error");
                    }
                }
            } catch (error) {
                errorCount++;
                console.error('Import error:', error);
                showCustomAlert(t("error"), t("errorImport", { filename: file.name, message: error.message }), "error");
            }
        };
        reader.readAsText(file);
    }
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
    
    // Закрытие по клику вне модального окна
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

// Функция для вставки таблицы
function insertTable() {
    showCustomPrompt(
        t("createTable"),
        t("enterRows"),
        t("numberOfRows"),
        "3",
        (rows) => {
            if (rows && !isNaN(rows) && parseInt(rows) > 0) {
                showCustomPrompt(
                    t("createTable"),
                    t("enterColumns"),
                    t("numberOfColumns"),
                    "3",
                    (cols) => {
                        if (cols && !isNaN(cols) && parseInt(cols) > 0) {
            if (tinymceEditor) {
            let tableHtml = '<table><tbody>';
            for (let i = 0; i < parseInt(rows); i++) {
                tableHtml += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHtml += '<td></td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table>';
            
                tinymceEditor.insertContent(tableHtml);
            }
                        } else if (cols !== null) {
                            showCustomAlert(
                                t("error"),
                                currentLang.startsWith("ru") ? "Пожалуйста, введите корректное количество столбцов!" : "Please enter a valid number of columns!",
                                "error"
                            );
                        }
                    }
                );
            } else if (rows !== null) {
                showCustomAlert(
                    t("error"),
                    currentLang.startsWith("ru") ? "Пожалуйста, введите корректное количество строк!" : "Please enter a valid number of rows!",
                    "error"
                );
            }
        }
    );
}

// Улучшенная система шифрования с обфускацией
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
    
    // Закрытие по клику вне модального окна
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
