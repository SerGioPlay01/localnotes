// Функция для загрузки текста из lang.json и обновления интерфейса
function changeLanguage(language) {
    fetch('/json/lang.json')  // Убедитесь, что путь к файлу lang.json правильный
        .then(response => response.json())
        .then(data => {
            const langData = data[language];

            // Устанавливаем атрибут data-lang на body для переключения языков
            document.body.setAttribute('data-lang', language);

            // Обновление заголовка страницы (title)
            document.title = langData.pageTitle;

            // Обновление метатегов
            document.querySelector('meta[name="description"]').setAttribute('content', langData.metaDescription);
            document.querySelector('meta[name="keywords"]').setAttribute('content', langData.metaKeywords);
            document.querySelector('meta[property="og:description"]').setAttribute('content', langData.metaOgDescript);
            document.querySelector('meta[property="og:title"]').setAttribute('content', langData.metaOgtitle);

            // Обновление текста в preloader
            document.getElementById('preloaderText').innerHTML = langData.preloaderText;

            // Обновление других элементов интерфейса
            document.querySelector('.name-app').textContent = langData.appName;
            document.getElementById('addNoteButton').textContent = langData.addNoteButton;
            document.getElementById('importButton').textContent = langData.importButton;
            document.getElementById('clearAllButton').textContent = langData.clearAllButton;
            document.getElementById('searchInput').placeholder = langData.searchPlaceholder;
            document.querySelector('.modal_h2').textContent = langData.editModalTitle;
            document.getElementById('saveNoteButton').textContent = langData.saveNoteButton;
            document.getElementById('cancelNoteButton').textContent = langData.cancelNoteButton;
            document.querySelector('.info-about-project p').textContent = langData.footerText;
            document.querySelector('.footerCopyRight').textContent = langData.footerCopyRight;
            document.querySelector('.Usage_Policy').textContent = langData.Usage_Policy;
            document.querySelector('.Privacy_Policy').textContent = langData.Privacy_Policy;
            document.querySelector('.Cookie_Policy').textContent = langData.Cookie_Policy;
            document.getElementById('cookie').textContent = langData.cookie;
            document.querySelector('.author').textContent = langData.author;

        })
        .catch(err => console.error("Error loading language file:", err));
}

// Функция для определения языка браузера пользователя
function getCurrentLanguage() {
    const userLang = navigator.language || navigator.userLanguage;  // Получаем язык пользователя
    return userLang.startsWith('ru') ? 'ru' : 'en';  // Если язык "ru", используем русский, иначе английский
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
    checkAndUpdateLanguage();  // Начальная проверка языка при загрузке
    const currentLang = getCurrentLanguage();
    setPageLanguage(currentLang);
});
