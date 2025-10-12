// Функция для загрузки текста из lang.json и обновления интерфейса
function changeLanguage(language) {
    fetch('/json/lang.json')  // Убедитесь, что путь к файлу lang.json правильный
        .then(response => response.json())
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
        .catch(err => console.error("Error loading language file:", err));
}

// Функция для обновления интерфейса
function updateInterface(langData, language) {
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

    // Обновление текста в preloader
    const preloaderText = document.getElementById('preloaderText');
    if (preloaderText) {
        preloaderText.innerHTML = langData.preloaderText;
    }

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
}

// Глобальная переменная для хранения текущего языка
window.currentLang = null;

// Функция для определения языка браузера пользователя
function getCurrentLanguage() {
    const userLang = navigator.language || navigator.userLanguage;  // Получаем язык пользователя
    const lang = userLang.startsWith('ru') ? 'ru' : 'en';  // Если язык "ru", используем русский, иначе английский
    window.currentLang = lang;  // Сохраняем в глобальной переменной
    return lang;
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

// Запуск проверки языка при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем небольшую задержку для полной загрузки DOM
    setTimeout(() => {
        try {
            checkAndUpdateLanguage();  // Начальная проверка языка при загрузке
            const currentLang = getCurrentLanguage();
            setPageLanguage(currentLang);
        } catch (error) {
            console.error('Error initializing language:', error);
        }
    }, 100);
});
