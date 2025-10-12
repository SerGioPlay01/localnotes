// Функция для инициализации языка при загрузке страницы
function initializeLanguage() {
    // Если язык уже установлен (например, на языковых страницах)
    if (window.currentLang) {
        console.log('Initializing language:', window.currentLang);
        changeLanguage(window.currentLang);
    }
}

// Функция для загрузки текста из lang.json и обновления интерфейса
function changeLanguage(language) {
    // Определяем правильный путь к lang.json в зависимости от текущего URL
    const isLanguagePage = window.location.pathname.match(/^\/([a-z]{2})\//);
    const langJsonPath = isLanguagePage ? '../json/lang.json' : '/json/lang.json';
    
    
    fetch(langJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const langData = data[language];
            
            // Проверяем, что данные для языка существуют
            if (!langData) {
                console.warn(`Language data for '${language}' not found, falling back to 'en'`);
                const fallbackLangData = data['en'];
                if (!fallbackLangData) {
                    console.error('Fallback language data not found');
                    return;
                }
                return updateInterface(fallbackLangData, language);
            }

            // Устанавливаем атрибут data-lang на body для переключения языков
            document.body.setAttribute('data-lang', language);
            
            updateInterface(langData, language);
        })
        .catch(err => {
            console.error("Error loading language file:", err);
            console.error("Attempted to load from:", langJsonPath);
        });
}

// Функция для обновления интерфейса
function updateInterface(langData, language) {
    // Сохраняем данные языка в глобальной переменной
    window.langData = window.langData || {};
    window.langData[language] = langData;
    window.currentLang = language;
    
    
    // Обновление заголовка страницы (title)
    document.title = langData.pageTitle;

    // Обновление метатегов
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', langData.metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', langData.metaKeywords);
    }

    const metaOgDescription = document.querySelector('meta[property="og:description"]');
    if (metaOgDescription) {
        metaOgDescription.setAttribute('content', langData.metaOgDescript);
    }

    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (metaOgTitle) {
        metaOgTitle.setAttribute('content', langData.metaOgtitle);
    }

    // Обновление текста в preloader (если элемент существует)
    const preloaderText = document.getElementById('preloaderText');
    if (preloaderText) {
        preloaderText.innerHTML = langData.preloaderText;
    }
    // Примечание: прелойдер сам управляет своим текстом через updatePreloaderText()

    // Обновление других элементов интерфейса
    const nameApp = document.querySelector('.name-app');
    if (nameApp) {
        nameApp.textContent = langData.appName;
    }

    const addNoteButton = document.getElementById('addNoteButton');
    if (addNoteButton) {
        addNoteButton.textContent = langData.addNoteButton;
    }

    const importButton = document.getElementById('importButton');
    if (importButton) {
        importButton.textContent = langData.importButton;
    }

    const clearAllButton = document.getElementById('clearAllButton');
    if (clearAllButton) {
        clearAllButton.textContent = langData.clearAllButton;
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = langData.searchPlaceholder;
    }

    const modalH2 = document.querySelector('.modal_h2');
    if (modalH2) {
        modalH2.textContent = langData.editModalTitle;
    }

    const saveNoteButton = document.getElementById('saveNoteButton');
    if (saveNoteButton) {
        saveNoteButton.textContent = langData.saveNoteButton;
    }

    const cancelNoteButton = document.getElementById('cancelNoteButton');
    if (cancelNoteButton) {
        cancelNoteButton.textContent = langData.cancelNoteButton;
    }

    const footerText = document.querySelector('.info-about-project p');
    if (footerText) {
        footerText.textContent = langData.footerText;
    }

    const footerCopyRight = document.querySelector('.footerCopyRight');
    if (footerCopyRight) {
        footerCopyRight.textContent = langData.footerCopyRight;
    }

    const usagePolicy = document.querySelector('.Usage_Policy');
    if (usagePolicy) {
        usagePolicy.textContent = langData.Usage_Policy;
    }

    const privacyPolicy = document.querySelector('.Privacy_Policy');
    if (privacyPolicy) {
        privacyPolicy.textContent = langData.Privacy_Policy;
    }

    const cookiePolicy = document.querySelector('.Cookie_Policy');
    if (cookiePolicy) {
        cookiePolicy.textContent = langData.Cookie_Policy;
    }

    const cookie = document.getElementById('cookie');
    if (cookie) {
        cookie.textContent = langData.cookie;
    }

    const author = document.querySelector('.author');
    if (author) {
        author.textContent = langData.author;
    }

    // Обновляем текст кнопок с иконками
    updateButtonTexts();
    
    // Обновляем отображение дат при смене языка
    if (typeof refreshAllDates === 'function') {
        // Добавляем задержку, чтобы убедиться, что все скрипты загружены и langData обновлен
        setTimeout(() => {
            // Проверяем, что langData обновлен для текущего языка
            if (window.langData && window.langData[language]) {
                refreshAllDates();
            } else {
                // Если langData еще не готов, ждем еще немного
                setTimeout(() => {
                    refreshAllDates();
                }, 200);
            }
        }, 150);
    }
}

// Функция для обновления текста кнопок с иконками
function updateButtonTexts() {
    const addNoteButton = document.getElementById("addNoteButton");
    const importButton = document.getElementById("importButton");
    const clearAllButton = document.getElementById("clearAllButton");
    const toggleViewButton = document.getElementById("toggleViewButton");
    const saveNoteButton = document.getElementById("saveNoteButton");
    const cancelNoteButton = document.getElementById("cancelNoteButton");
    const confirmYesButton = document.getElementById("confirmYes");
    const confirmNoButton = document.getElementById("confirmNo");
    const okButton = document.getElementById("ok");
    
    if (addNoteButton) {
        addNoteButton.innerHTML = `<i class="fas fa-plus"></i> ${addNoteButton.textContent}`;
    }
    if (importButton) {
        importButton.innerHTML = `<i class="fas fa-upload"></i> ${importButton.textContent}`;
    }
    if (clearAllButton) {
        clearAllButton.innerHTML = `<i class="fas fa-trash-alt"></i> ${clearAllButton.textContent}`;
    }
    if (toggleViewButton) {
        // Обновляем кнопку переключения вида с правильными переводами
        const notesContainer = document.getElementById("notesContainer");
        const isFullWidth = notesContainer && notesContainer.classList.contains("full-width-view");
        
        if (isFullWidth) {
            toggleViewButton.innerHTML = `<i class="fas fa-th"></i> ${toggleViewButton.textContent}`;
        } else {
            toggleViewButton.innerHTML = `<i class="fas fa-list"></i> ${toggleViewButton.textContent}`;
        }
        
        // Принудительно обновляем кнопку через AppUtils, если он доступен
        if (window.appUtils && typeof window.appUtils.forceUpdateToggleButton === 'function') {
            // Добавляем небольшую задержку, чтобы избежать ошибок
            setTimeout(() => {
                try {
                    window.appUtils.forceUpdateToggleButton();
                } catch (error) {
                    console.log("Error updating toggle button:", error);
                }
            }, 50);
        }
    }
    if (saveNoteButton) {
        saveNoteButton.innerHTML = `<i class="fas fa-save"></i> ${saveNoteButton.textContent}`;
    }
    if (cancelNoteButton) {
        cancelNoteButton.innerHTML = `<i class="fas fa-times"></i> ${cancelNoteButton.textContent}`;
    }
    if (confirmYesButton) {
        confirmYesButton.innerHTML = `<i class="fas fa-check"></i> ${confirmYesButton.textContent}`;
    }
    if (confirmNoButton) {
        confirmNoButton.innerHTML = `<i class="fas fa-times"></i> ${confirmNoButton.textContent}`;
    }
    if (okButton) {
        okButton.innerHTML = `<i class="fas fa-check"></i> ${okButton.textContent}`;
    }
}

// Глобальная переменная для хранения текущего языка
window.currentLang = null;

// Функция для определения языка браузера пользователя
function getCurrentLanguage() {
    // Проверяем, установлен ли язык в window.currentLang (для языковых версий)
    if (window.currentLang) {
        return window.currentLang;
    }
    
    // Проверяем URL параметр
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam) {
        window.currentLang = langParam;
        return langParam;
    }
    
    // Проверяем localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        window.currentLang = savedLang;
        return savedLang;
    }
    
    // Определяем язык по браузеру
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.split('-')[0].toLowerCase();
    
    // Поддерживаемые языки
    const supportedLanguages = ['en', 'ru', 'ua', 'pl', 'cs', 'sk', 'bg', 'hr', 'sr', 'bs', 'mk', 'sl'];
    
    if (supportedLanguages.includes(langCode)) {
        window.currentLang = langCode;
        return langCode;
    }
    
    // Проверяем для специальных случаев
    const countryCode = userLang.split('-')[1]?.toLowerCase();
    if (countryCode) {
        if (countryCode === 'ua') {
            window.currentLang = 'ua';
            return 'ua';
        }
        if (['by', 'kz', 'md'].includes(countryCode)) {
            window.currentLang = 'ru';
            return 'ru';
        }
    }
    
    // По умолчанию английский
    window.currentLang = 'en';
    return 'en';
}

// Функция для периодической проверки языка
function checkAndUpdateLanguage() {
    const currentLang = getCurrentLanguage();
    changeLanguage(currentLang);
}

// Функция для установки атрибута lang в <html>
function setPageLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
}

// Экспортируем функцию changeLanguage в глобальную область
window.changeLanguage = changeLanguage;

// Запуск проверки языка при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем небольшую задержку для полной загрузки DOM
    setTimeout(() => {
        try {
            // Проверяем, не находимся ли мы на языковой версии страницы
            const currentPath = window.location.pathname;
            const isLanguagePage = currentPath.match(/^\/([a-z]{2})\//);
            
            if (isLanguagePage) {
                // Если мы на языковой странице, устанавливаем язык из URL
                const langFromPath = isLanguagePage[1];
                
                // Проверяем, не установлен ли уже язык в HTML
                if (!window.currentLang) {
                    window.currentLang = langFromPath;
                }
                
                setPageLanguage(window.currentLang);
                // Обновляем интерфейс для языковой версии
                changeLanguage(window.currentLang);
            } else {
                // Если мы на главной странице, используем стандартную логику
                checkAndUpdateLanguage();
                const currentLang = getCurrentLanguage();
                setPageLanguage(currentLang);
            }
        } catch (error) {
            console.error('Error initializing language:', error);
            // Fallback на английский
            window.currentLang = 'en';
            setPageLanguage('en');
        }
    }, 100);
});
