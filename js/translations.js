// Система переводов для динамического текста
if (typeof translations === 'undefined') {
const translations = {
    en: {
        // Общие сообщения
        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Info",
        ok: "OK",
        yes: "Yes",
        no: "No",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        change: "Change",
        close: "Close",
        
        // Ошибки
        errorInitializingApp: "Error initializing application!",
        errorSavingNote: "Error saving note!",
        errorDeletingNote: "Error deleting note!",
        errorLoadingNotes: "Error loading notes!",
        errorClearingNotes: "Error clearing notes!",
        errorEditorInitialization: "Error initializing editor!",
        errorEditorTimeout: "Editor initialization timeout!",
        errorEncryption: "Encryption error: {message}",
        errorDecryption: "Unable to decrypt file \"{filename}\". Incorrect password or corrupted file.",
        errorImport: "Error importing file \"{filename}\": {message}",
        errorNoFilesImported: "No files could be imported.",
        importPartialSuccess: "Import completed with warnings: {imported} files imported, {errors} errors occurred.",
        errorEmptyPassword: "Password cannot be empty!",
        errorEmptyNote: "Note cannot be empty!",
        errorInvalidFile: "File \"{filename}\" is not a .note file.",
        errorNoUniqueTag: "File \"{filename}\" does not contain a unique tag.",
        encryptedFileDetected: "Encrypted file detected: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Please select \"Encrypted\" format for this file type.",
        
        // Успешные операции
        noteExported: "Note successfully encrypted and exported!",
        importCompleted: "The import has been successfully completed. Number of notes added: {count}",
        allNotesDeleted: "All notes have been successfully deleted!",
        
        // Подтверждения
        confirmDeleteAll: "Do you really want to delete ALL notes?",
        confirmDeleteAllTitle: "Delete All Notes",
        confirmDeleteAllPlaceholder: "Type 'DELETE ALL' to confirm",
        deleteAll: "Delete All",
        clearAllWarning: "This action is irreversible!",
        clearAllWarning1: "All your notes will be permanently deleted",
        clearAllWarning2: "Data recovery will be impossible",
        clearAllWarning3: "It is recommended to create a backup before deletion",
        invalidPassword: "Invalid password. Please try again.",
        
        // Интерфейс
        noNotesMessage: "No notes to display",
        chooseImportFormat: "Choose import format",
        encryptedFiles: "Encrypted files (.note)",
        htmlFiles: "HTML files",
        markdownFiles: "Markdown files (.md)",
        imageNotFound: "Image not found",
        imageNotFoundMessage: "Image not found: {src}",
        selectImageFile: "Please select the image file",
        decryptNote: "Decrypt Note",
        enterPassword: "Enter password for decryption:",
        enterPasswordForFile: "Enter password for file",
        password: "Password",
        importingFiles: "Importing files",
        processingFile: "Processing file",
        of: "of",
        imported: "Imported",
        errors: "Errors",
        importWithErrors: "Import completed with errors. Imported: {imported}, errors: {errors}",
        validatePassword: "Validate Password",
        skipFile: "Skip File",
        validatingPassword: "Validating password...",
        passwordValid: "Password is correct",
        passwordInvalid: "Password is incorrect",
        validationError: "Validation error",
        
        // Счетчик слов
        wordCount: "Words: {words} | Characters: {chars} | Characters (no spaces): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Close",
        specialCharsClose: "Close",
        
        // Таблицы
        createTable: "Create Table",
        enterRows: "Enter number of rows:",
        numberOfRows: "Number of rows",
        enterColumns: "Enter number of columns:",
        numberOfColumns: "Number of columns",
        
        // Кнопки
        addNote: "Add a note",
        importNotes: "Import notes",
        clearAllNotes: "Clear all notes",
        toggleView: "Toggle View",
        saveNote: "Save note",
        cancel: "Cancel",
        confirmYes: "Yes",
        confirmNo: "No",
        ok: "OK",
        export: "Export",
        exportClose: "Close",
        exportEncrypted: "Encrypted",
        exportHtml: "HTML",
        exportEncryptedDesc: "Encrypted files (.note)",
        exportHtmlDesc: "HTML files",
        
        // Футер
        footerDescription: "Local Notes is a simple and convenient tool for creating notes right in your browser. All notes are saved in your browser. Save your thoughts, ideas, and stories, structuring them with headings, text formatting, lists, and more. Export notes to an file and share them with friends anonymously - just send the file, and they can open it by importing it into the web application. With Local Notes, your notes are always at hand, organized, and secure.",
        cookiePolicy: "Cookie Policy",
        termsOfUse: "Terms of Use",
        privacyPolicy: "Privacy Policy",
        allRightsReserved: "All rights reserved. Local Notes",
        byAuthor: "By SerGio Play",
        
        // Прелоадер
        preloaderText: "Wait! <br> Getting ready to record.",
        preloaderInit: "Initializing encryption...",
        preloaderModules: "Loading modules...",
        preloaderSecurity: "Security check...",
        preloaderInterface: "Preparing interface...",
        preloaderComplete: "Loading complete...",
        
        // Временные метки
        created: "Created",
        modified: "Modified",
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        
        // Приветственное сообщение
        welcomeTitle: "Welcome to Local Notes",
        welcomeSubtitle: "Secure, private note-taking in your browser",
        welcomeAbout: "About Local Notes",
        welcomeDescription: "Local Notes is a secure web application for creating and storing notes directly in your browser. All data remains on your device with military-grade encryption.",
        welcomeFeatures: "Key Features",
        welcomeFeature1: "Military-grade AES-256 encryption",
        welcomeFeature2: "12 languages supported",
        welcomeFeature3: "PWA support - install as app",
        welcomeFeature4: "Optimized performance",
        welcomeFeature5: "Enhanced security protection",
        welcomeFeature6: "Modern responsive design",
        welcomeFeature7: "Offline operation support",
        welcomeGoals: "Project Goals",
        welcomeGoal1: "Maximum privacy - data stays local",
        welcomeGoal2: "Security - military-grade encryption",
        welcomeGoal3: "Accessibility - 12 languages",
        welcomeGoal4: "Universality - works everywhere",
        welcomeGoal5: "Performance - fast operation",
        welcomeGoal6: "Convenience - intuitive interface",
        welcomeDeveloper: "Developer",
        welcomeDeveloperInfo: "Developed by SerGio Play. Open source project focused on privacy and security.",
        welcomeGetStarted: "Get Started",
        welcomeGetStartedText: "Click 'Add Note' to create your first note and start organizing your information securely.",
        welcomeDismiss: "Show instructions",
        welcomeInstructions: "To create your first note, click the 'Add Note' button in the top panel. You can then write your content and save it securely.",
        welcomeInstructionsTitle: "How to get started",
        viewModeGrid: "Grid",
        viewModeList: "List"
    },
    
    ru: {
        // Общие сообщения
        error: "Ошибка",
        success: "Успех",
        warning: "Предупреждение",
        info: "Информация",
        ok: "ОК",
        yes: "Да",
        no: "Нет",
        cancel: "Отмена",
        save: "Сохранить",
        delete: "Удалить",
        edit: "Изменить",
        change: "Изменить",
        close: "Закрыть",
        
        // Ошибки
        errorInitializingApp: "Ошибка при инициализации приложения!",
        errorSavingNote: "Ошибка при сохранении заметки!",
        errorDeletingNote: "Ошибка при удалении заметки!",
        errorLoadingNotes: "Ошибка при загрузке заметок!",
        errorClearingNotes: "Ошибка при очистке заметок!",
        errorEditorInitialization: "Ошибка инициализации редактора!",
        errorEditorTimeout: "Таймаут инициализации редактора!",
        errorEncryption: "Ошибка при шифровании: {message}",
        errorDecryption: "Невозможно расшифровать файл \"{filename}\". Неверный пароль или поврежденный файл.",
        errorImport: "Ошибка при импорте файла \"{filename}\": {message}",
        errorNoFilesImported: "Ни один файл не удалось импортировать.",
        importPartialSuccess: "Импорт завершен с предупреждениями: импортировано {imported} файлов, произошло {errors} ошибок.",
        errorEmptyPassword: "Пароль не может быть пустым!",
        errorEmptyNote: "Заметка не может быть пустой!",
        errorInvalidFile: "Файл \"{filename}\" не является файлом с расширением .note.",
        errorNoUniqueTag: "Файл \"{filename}\" не содержит уникального тега.",
        encryptedFileDetected: "Обнаружен зашифрованный файл: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Пожалуйста, выберите формат \"Зашифрованный\" для этого типа файла.",
        
        // Успешные операции
        noteExported: "Заметка успешно зашифрована и экспортирована!",
        importCompleted: "Импорт успешно завершен. Количество добавленных заметок: {count}",
        allNotesDeleted: "Все заметки успешно удалены!",
        
        // Подтверждения
        confirmDeleteAll: "Вы действительно хотите удалить ВСЕ заметки?",
        confirmDeleteAllTitle: "Удалить все заметки",
        confirmDeleteAllPlaceholder: "Введите 'DELETE ALL' для подтверждения",
        deleteAll: "Удалить все",
        clearAllWarning: "Это действие необратимо!",
        clearAllWarning1: "Все ваши заметки будут безвозвратно удалены",
        clearAllWarning2: "Восстановление данных будет невозможно",
        clearAllWarning3: "Рекомендуется создать резервную копию перед удалением",
        invalidPassword: "Неверный пароль. Попробуйте еще раз.",
        
        // Интерфейс
        noNotesMessage: "Нет заметок для отображения",
        chooseImportFormat: "Выберите формат импорта",
        encryptedFiles: "Зашифрованные файлы (.note)",
        htmlFiles: "HTML файлы",
        markdownFiles: "Markdown файлы (.md)",
        imageNotFound: "Изображение не найдено",
        imageNotFoundMessage: "Изображение не найдено: {src}",
        selectImageFile: "Пожалуйста, выберите файл изображения",
        decryptNote: "Расшифровка заметки",
        enterPassword: "Введите пароль для расшифровки:",
        enterPasswordForFile: "Введите пароль для файла",
        password: "Пароль",
        importingFiles: "Импорт файлов",
        processingFile: "Обработка файла",
        of: "из",
        imported: "Импортировано",
        errors: "Ошибки",
        importWithErrors: "Импорт завершен с ошибками. Импортировано: {imported}, ошибок: {errors}",
        validatePassword: "Проверить пароль",
        skipFile: "Пропустить файл",
        validatingPassword: "Проверка пароля...",
        passwordValid: "Пароль правильный",
        passwordInvalid: "Пароль неправильный",
        validationError: "Ошибка проверки",
        
        // Счетчик слов
        wordCount: "Слов: {words} | Символов: {chars} | Символов (без пробелов): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Закрыть",
        specialCharsClose: "Закрыть",
        
        // Таблицы
        createTable: "Создание таблицы",
        enterRows: "Введите количество строк:",
        numberOfRows: "Количество строк",
        enterColumns: "Введите количество столбцов:",
        numberOfColumns: "Количество столбцов",
        
        // Кнопки
        addNote: "Добавить заметку",
        importNotes: "Импортировать заметки",
        clearAllNotes: "Очистить все заметки",
        toggleView: "Переключить вид",
        saveNote: "Сохранить заметку",
        cancel: "Отмена",
        confirmYes: "Да",
        confirmNo: "Нет",
        ok: "ОК",
        export: "Экспорт",
        exportClose: "Закрыть",
        exportEncrypted: "Зашифрованный",
        exportHtml: "HTML",
        exportEncryptedDesc: "Зашифрованные файлы (.note)",
        exportHtmlDesc: "HTML файлы",
        
        // Футер
        footerDescription: "Local Notes — это простое и удобное средство для создания заметок прямо в браузере. Все заметки сохраняются в вашем браузере. Сохраняйте свои мысли, идеи и истории, структурируя их с помощью заголовков, форматирования текста, списков и многого другого. Экспортируйте заметки в файл и делитесь ими с друзьями анонимно — просто отправьте файл, и они смогут открыть его, импортировав в веб-приложение. С Local Notes ваши заметки всегда под рукой, организованы и защищены.",
        cookiePolicy: "Политика Cookie",
        termsOfUse: "Условия использования",
        privacyPolicy: "Политика конфиденциальности",
        allRightsReserved: "Все права защищены. Local Notes",
        byAuthor: "Автор: SerGio Play",
        
        // Дополнительные переводы для lang.json
        pageTitle: "Локальные заметки (Local Notes)",
        metaDescription: "Локальные заметки (Local Notes) - это приложение для создания и хранения заметок в браузере.",
        metaKeywords: "локальные заметки, заметки, заметки в браузере, приложение для заметок, заметки онлайн, Local Notes",
        metaOgtitle: "Локальные заметки - сохраняйте важные заметки прямо в вашем браузере",
        metaOgDescript: "Локальные заметки - это приложение для создания и хранения заметок в браузере.",
        appName: "Локальные заметки",
        searchPlaceholder: "Поиск по заметкам...",
        editModalTitle: "Редактор",
        preloaderText: "Подождите! <br> Подготавливаемся к вашим заметкам.",
        preloaderInit: "Инициализация шифрования...",
        preloaderModules: "Загрузка модулей...",
        preloaderSecurity: "Проверка безопасности...",
        preloaderInterface: "Подготовка интерфейса...",
        preloaderComplete: "Завершение загрузки...",
        
        // Временные метки
        created: "Создано",
        modified: "Изменено",
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        
        // Приветственное сообщение
        welcomeTitle: "Добро пожаловать в Local Notes",
        welcomeSubtitle: "Безопасные приватные заметки в браузере",
        welcomeAbout: "О Local Notes",
        welcomeDescription: "Local Notes — это безопасное веб-приложение для создания и хранения заметок прямо в браузере. Все данные остаются на вашем устройстве с военным шифрованием.",
        welcomeFeatures: "Ключевые особенности",
        welcomeFeature1: "Военное шифрование AES-256",
        welcomeFeature2: "Поддержка 12 языков",
        welcomeFeature3: "PWA поддержка — установка как приложение",
        welcomeFeature4: "Оптимизированная производительность",
        welcomeFeature5: "Усиленная защита безопасности",
        welcomeFeature6: "Современный адаптивный дизайн",
        welcomeFeature7: "Поддержка офлайн работы",
        welcomeGoals: "Цели проекта",
        welcomeGoal1: "Максимальная приватность — данные остаются локально",
        welcomeGoal2: "Безопасность — военное шифрование",
        welcomeGoal3: "Доступность — 12 языков",
        welcomeGoal4: "Универсальность — работает везде",
        welcomeGoal5: "Производительность — быстрая работа",
        welcomeGoal6: "Удобство — интуитивный интерфейс",
        welcomeDeveloper: "Разработчик",
        welcomeDeveloperInfo: "Разработано SerGio Play. Открытый проект с фокусом на приватность и безопасность.",
        welcomeGetStarted: "Начать работу",
        welcomeGetStartedText: "Нажмите 'Добавить заметку', чтобы создать первую заметку и начать безопасно организовывать информацию.",
        welcomeDismiss: "Показать инструкции",
        welcomeInstructions: "Чтобы создать первую заметку, нажмите кнопку 'Добавить заметку' в верхней панели. Затем вы сможете написать содержимое и сохранить его безопасно.",
        welcomeInstructionsTitle: "Как начать работу",
        viewModeGrid: "Сетка",
        viewModeList: "Список"
    },
    
    ua: {
        // Общие сообщения
        error: "Помилка",
        success: "Успіх",
        warning: "Попередження",
        info: "Інформація",
        ok: "ОК",
        yes: "Так",
        no: "Ні",
        cancel: "Скасувати",
        save: "Зберегти",
        delete: "Видалити",
        edit: "Редагувати",
        change: "Змінити",
        close: "Закрити",
        
        // Ошибки
        errorInitializingApp: "Помилка при ініціалізації додатку!",
        errorSavingNote: "Помилка при збереженні нотатки!",
        errorDeletingNote: "Помилка при видаленні нотатки!",
        errorLoadingNotes: "Помилка при завантаженні нотаток!",
        errorClearingNotes: "Помилка при очищенні нотаток!",
        errorEditorInitialization: "Помилка ініціалізації редактора!",
        errorEditorTimeout: "Таймаут ініціалізації редактора!",
        errorEncryption: "Помилка при шифруванні: {message}",
        errorDecryption: "Неможливо розшифрувати файл \"{filename}\". Невірний пароль або пошкоджений файл.",
        errorImport: "Помилка при імпорті файлу \"{filename}\": {message}",
        errorNoFilesImported: "Жоден файл не вдалося імпортувати.",
        importPartialSuccess: "Імпорт завершено з попередженнями: {imported} файлів імпортовано, {errors} помилок сталося.",
        errorEmptyPassword: "Пароль не може бути порожнім!",
        errorEmptyNote: "Нотатка не може бути порожньою!",
        errorInvalidFile: "Файл \"{filename}\" не є файлом з розширенням .note.",
        errorNoUniqueTag: "Файл \"{filename}\" не містить унікального тегу.",
        encryptedFileDetected: "Виявлено зашифрований файл: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Будь ласка, виберіть формат \"Зашифрований\" для цього типу файлу.",
        
        // Успешные операции
        noteExported: "Нотатку успішно зашифровано та експортовано!",
        importCompleted: "Імпорт успішно завершено. Кількість доданих нотаток: {count}",
        allNotesDeleted: "Всі нотатки успішно видалені!",
        
        // Подтверждения
        confirmDeleteAll: "Ви впевнені, що хочете видалити всі нотатки?",
        confirmDeleteAllTitle: "Видалити всі нотатки",
        confirmDeleteAllPlaceholder: "Введіть 'DELETE ALL' для підтвердження",
        deleteAll: "Видалити все",
        clearAllWarning: "Ця дія незворотна!",
        clearAllWarning1: "Всі ваші нотатки будуть безповоротно видалені",
        clearAllWarning2: "Відновлення даних буде неможливим",
        clearAllWarning3: "Рекомендується створити резервну копію перед видаленням",
        invalidPassword: "Невірний пароль. Спробуйте ще раз.",
        
        // Интерфейс
        noNotesMessage: "Немає нотаток для відображення",
        chooseImportFormat: "Виберіть формат імпорту",
        encryptedFiles: "Зашифровані файли (.note)",
        htmlFiles: "HTML файли",
        markdownFiles: "Markdown файли (.md)",
        imageNotFound: "Зображення не знайдено",
        imageNotFoundMessage: "Зображення не знайдено: {src}",
        selectImageFile: "Будь ласка, виберіть файл зображення",
        decryptNote: "Розшифрування нотатки",
        enterPassword: "Введіть пароль для розшифрування:",
        password: "Пароль",
        
        // Счетчик слов
        wordCount: "Слів: {words} | Символів: {chars} | Символів (без пробілів): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Закрити",
        specialCharsClose: "Закрити",
        
        // Таблицы
        createTable: "Створення таблиці",
        enterRows: "Введіть кількість рядків:",
        numberOfRows: "Кількість рядків",
        enterColumns: "Введіть кількість стовпців:",
        numberOfColumns: "Кількість стовпців",
        
        // Кнопки
        addNote: "Додати нотатку",
        importNotes: "Імпортувати нотатки",
        clearAllNotes: "Очистити всі нотатки",
        toggleView: "Перемкнути вид",
        saveNote: "Зберегти нотатку",
        cancel: "Скасувати",
        confirmYes: "Так",
        confirmNo: "Ні",
        ok: "ОК",
        export: "Експорт",
        exportClose: "Закрити",
        exportEncrypted: "Зашифрований",
        exportHtml: "HTML",
        exportEncryptedDesc: "Зашифровані файли (.note)",
        exportHtmlDesc: "HTML файли",
        
        // Футер
        footerDescription: "Local Notes — це простий і зручний інструмент для створення нотаток прямо в браузері. Всі нотатки зберігаються у вашому браузері. Зберігайте свої думки, ідеї та історії, структуруючи їх за допомогою заголовків, форматування тексту, списків та багато іншого. Експортуйте нотатки у файл і діліться ними з друзями анонімно — просто надішліть файл, і вони зможуть відкрити його, імпортувавши в веб-додаток. З Local Notes ваші нотатки завжди під рукою, організовані та захищені.",
        cookiePolicy: "Політика Cookie",
        termsOfUse: "Умови використання",
        privacyPolicy: "Політика конфіденційності",
        allRightsReserved: "Всі права захищені. Local Notes",
        byAuthor: "Автор: SerGio Play",
        
        // Прелоадер
        preloaderText: "Зачекайте! <br> Підготовлюємося до ваших нотаток.",
        preloaderInit: "Ініціалізація шифрування...",
        preloaderModules: "Завантаження модулів...",
        preloaderSecurity: "Перевірка безпеки...",
        preloaderInterface: "Підготовка інтерфейсу...",
        preloaderComplete: "Завершення завантаження...",
        
        // Временные метки
        created: "Створено",
        modified: "Змінено",
        months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
        weekdays: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
        weekdaysShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        
        // Приветственное сообщение
        welcomeTitle: "Ласкаво просимо до Local Notes",
        welcomeSubtitle: "Безпечні приватні нотатки в браузері",
        welcomeAbout: "Про Local Notes",
        welcomeDescription: "Local Notes — це безпечний веб-додаток для створення та зберігання нотаток прямо в браузері. Всі дані залишаються на вашому пристрої з військовим шифруванням.",
        welcomeFeatures: "Ключові особливості",
        welcomeFeature1: "Військове шифрування AES-256",
        welcomeFeature2: "Підтримка 12 мов",
        welcomeFeature3: "PWA підтримка — встановлення як додаток",
        welcomeFeature4: "Оптимізована продуктивність",
        welcomeFeature5: "Підвищена захист безпеки",
        welcomeFeature6: "Сучасний адаптивний дизайн",
        welcomeFeature7: "Підтримка офлайн роботи",
        welcomeGoals: "Цілі проекту",
        welcomeGoal1: "Максимальна приватність — дані залишаються локально",
        welcomeGoal2: "Безпека — військове шифрування",
        welcomeGoal3: "Доступність — 12 мов",
        welcomeGoal4: "Універсальність — працює скрізь",
        welcomeGoal5: "Продуктивність — швидка робота",
        welcomeGoal6: "Зручність — інтуїтивний інтерфейс",
        welcomeDeveloper: "Розробник",
        welcomeDeveloperInfo: "Розроблено SerGio Play. Відкритий проект з фокусом на приватність та безпеку.",
        welcomeGetStarted: "Почати роботу",
        welcomeGetStartedText: "Натисніть 'Додати нотатку', щоб створити першу нотатку і почати безпечно організовувати інформацію.",
        welcomeDismiss: "Показати інструкції",
        welcomeInstructions: "Щоб створити першу нотатку, натисніть кнопку 'Додати нотатку' у верхній панелі. Потім ви зможете написати вміст і зберегти його безпечно.",
        welcomeInstructionsTitle: "Як почати роботу",
        viewModeGrid: "Сітка",
        viewModeList: "Список",
        enterPasswordForFile: "Введіть пароль для файлу",
        importingFiles: "Імпорт файлів",
        processingFile: "Обробка файлу",
        of: "з",
        imported: "Імпортовано",
        errors: "Помилки",
        importWithErrors: "Імпорт завершено з помилками. Імпортовано: {imported}, помилок: {errors}",
        validatePassword: "Перевірити пароль",
        skipFile: "Пропустити файл",
        validatingPassword: "Перевірка пароля...",
        passwordValid: "Пароль правильний",
        passwordInvalid: "Пароль неправильний",
        validationError: "Помилка перевірки"
    },
    
    pl: {
        // Общие сообщения
        error: "Błąd",
        success: "Sukces",
        warning: "Ostrzeżenie",
        info: "Informacja",
        ok: "OK",
        yes: "Tak",
        no: "Nie",
        cancel: "Anuluj",
        save: "Zapisz",
        delete: "Usuń",
        edit: "Edytuj",
        change: "Zmień",
        close: "Zamknij",
        
        // Ошибки
        errorInitializingApp: "Błąd podczas inicjalizacji aplikacji!",
        errorSavingNote: "Błąd podczas zapisywania notatki!",
        errorDeletingNote: "Błąd podczas usuwania notatki!",
        errorLoadingNotes: "Błąd podczas ładowania notatek!",
        errorClearingNotes: "Błąd podczas czyszczenia notatek!",
        errorEditorInitialization: "Błąd inicjalizacji edytora!",
        errorEditorTimeout: "Timeout inicjalizacji edytora!",
        errorEncryption: "Błąd szyfrowania: {message}",
        errorDecryption: "Nie można odszyfrować pliku \"{filename}\". Nieprawidłowe hasło lub uszkodzony plik.",
        errorImport: "Błąd podczas importu pliku \"{filename}\": {message}",
        errorNoFilesImported: "Nie udało się zaimportować żadnego pliku.",
        importPartialSuccess: "Import zakończony z ostrzeżeniami: {imported} plików zaimportowanych, {errors} błędów wystąpiło.",
        errorEmptyPassword: "Hasło nie może być puste!",
        errorEmptyNote: "Notatka nie może być pusta!",
        errorInvalidFile: "Plik \"{filename}\" nie jest plikiem .note.",
        errorNoUniqueTag: "Plik \"{filename}\" nie zawiera unikalnego tagu.",
        encryptedFileDetected: "Wykryto zaszyfrowany plik: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Proszę wybrać format \"Zaszyfrowany\" dla tego typu pliku.",
        
        // Успешные операции
        noteExported: "Notatka została pomyślnie zaszyfrowana i wyeksportowana!",
        importCompleted: "Import został pomyślnie zakończony. Liczba dodanych notatek: {count}",
        allNotesDeleted: "Wszystkie notatki zostały pomyślnie usunięte!",
        
        // Подтверждения
        confirmDeleteAll: "Czy na pewno chcesz usunąć wszystkie notatki?",
        confirmDeleteAllTitle: "Usuń wszystkie notatki",
        confirmDeleteAllPlaceholder: "Wpisz 'DELETE ALL' aby potwierdzić",
        deleteAll: "Usuń wszystko",
        clearAllWarning: "Ta akcja jest nieodwracalna!",
        clearAllWarning1: "Wszystkie notatki zostaną trwale usunięte",
        clearAllWarning2: "Odzyskanie danych będzie niemożliwe",
        clearAllWarning3: "Zaleca się utworzenie kopii zapasowej przed usunięciem",
        invalidPassword: "Nieprawidłowe hasło. Spróbuj ponownie.",
        
        // Интерфейс
        noNotesMessage: "Brak notatek do wyświetlenia",
        chooseImportFormat: "Wybierz format importu",
        encryptedFiles: "Zaszyfrowane pliki (.note)",
        htmlFiles: "Pliki HTML",
        markdownFiles: "Pliki Markdown (.md)",
        imageNotFound: "Obraz nie znaleziony",
        imageNotFoundMessage: "Obraz nie znaleziony: {src}",
        selectImageFile: "Proszę wybrać plik obrazu",
        decryptNote: "Odszyfruj notatkę",
        enterPassword: "Wprowadź hasło do odszyfrowania:",
        password: "Hasło",
        
        // Счетчик слов
        wordCount: "Słowa: {words} | Znaki: {chars} | Znaki (bez spacji): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zamknij",
        specialCharsClose: "Zamknij",
        
        // Таблицы
        createTable: "Tworzenie tabeli",
        enterRows: "Wprowadź liczbę wierszy:",
        numberOfRows: "Liczba wierszy",
        enterColumns: "Wprowadź liczbę kolumn:",
        numberOfColumns: "Liczba kolumn",
        
        // Кнопки
        addNote: "Dodaj notatkę",
        importNotes: "Importuj notatki",
        clearAllNotes: "Wyczyść wszystkie notatki",
        toggleView: "Przełącz widok",
        saveNote: "Zapisz notatkę",
        cancel: "Anuluj",
        confirmYes: "Tak",
        confirmNo: "Nie",
        ok: "OK",
        export: "Eksportuj",
        exportClose: "Zamknij",
        exportEncrypted: "Zaszyfrowany",
        exportHtml: "HTML",
        exportEncryptedDesc: "Zaszyfrowane pliki (.note)",
        exportHtmlDesc: "Pliki HTML",
        
        // Футер
        footerDescription: "Local Notes to proste i wygodne narzędzie do tworzenia notatek bezpośrednio w przeglądarce. Wszystkie notatki są zapisywane w Twojej przeglądarce. Zapisuj swoje myśli, pomysły i historie, strukturyzując je za pomocą nagłówków, formatowania tekstu, list i wiele więcej. Eksportuj notatki do pliku i dziel się nimi z przyjaciółmi anonimowo — po prostu wyślij plik, a oni będą mogli go otworzyć, importując do aplikacji internetowej. Z Local Notes Twoje notatki są zawsze pod ręką, zorganizowane i bezpieczne.",
        cookiePolicy: "Polityka Cookie",
        termsOfUse: "Warunki użytkowania",
        privacyPolicy: "Polityka prywatności",
        allRightsReserved: "Wszystkie prawa zastrzeżone. Local Notes",
        byAuthor: "Autor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Czekaj! <br> Przygotowujemy się do Twoich notatek.",
        preloaderInit: "Inicjalizacja szyfrowania...",
        preloaderModules: "Ładowanie modułów...",
        preloaderSecurity: "Sprawdzanie bezpieczeństwa...",
        preloaderInterface: "Przygotowywanie interfejsu...",
        preloaderComplete: "Kończenie ładowania...",
        
        // Временные метки
        created: "Utworzono",
        modified: "Zmodyfikowano",
        months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        monthsShort: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
        weekdays: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
        weekdaysShort: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
        
        // Приветственное сообщение
        welcomeTitle: "Witamy w Local Notes",
        welcomeSubtitle: "Bezpieczne prywatne notatki w przeglądarce",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes to bezpieczna aplikacja internetowa do tworzenia i przechowywania notatek bezpośrednio w przeglądarce. Wszystkie dane pozostają na Twoim urządzeniu z wojskowym szyfrowaniem.",
        welcomeFeatures: "Kluczowe funkcje",
        welcomeFeature1: "Wojskowe szyfrowanie AES-256",
        welcomeFeature2: "Wsparcie dla 12 języków",
        welcomeFeature3: "Wsparcie PWA — instalacja jako aplikacja",
        welcomeFeature4: "Zoptymalizowana wydajność",
        welcomeFeature5: "Wzmocniona ochrona bezpieczeństwa",
        welcomeFeature6: "Nowoczesny responsywny design",
        welcomeFeature7: "Wsparcie pracy offline",
        welcomeGoals: "Cele projektu",
        welcomeGoal1: "Maksymalna prywatność — dane pozostają lokalnie",
        welcomeGoal2: "Bezpieczeństwo — wojskowe szyfrowanie",
        welcomeGoal3: "Dostępność — 12 języków",
        welcomeGoal4: "Uniwersalność — działa wszędzie",
        welcomeGoal5: "Wydajność — szybka praca",
        welcomeGoal6: "Wygoda — intuicyjny interfejs",
        welcomeDeveloper: "Deweloper",
        welcomeDeveloperInfo: "Opracowany przez SerGio Play. Projekt open source skupiony na prywatności i bezpieczeństwie.",
        welcomeGetStarted: "Zacznij",
        welcomeGetStartedText: "Kliknij 'Dodaj notatkę', aby utworzyć pierwszą notatkę i zacząć bezpiecznie organizować informacje.",
        welcomeDismiss: "Pokaż instrukcje",
        welcomeInstructions: "Aby utworzyć pierwszą notatkę, kliknij przycisk 'Dodaj notatkę' w górnym panelu. Następnie możesz napisać treść i bezpiecznie ją zapisać.",
        welcomeInstructionsTitle: "Jak zacząć",
        viewModeGrid: "Siatka",
        viewModeList: "Lista",
        enterPasswordForFile: "Wprowadź hasło dla pliku",
        importingFiles: "Importowanie plików",
        processingFile: "Przetwarzanie pliku",
        of: "z",
        imported: "Zaimportowano",
        errors: "Błędy",
        importWithErrors: "Import zakończony z błędami. Zaimportowano: {imported}, błędów: {errors}",
        validatePassword: "Sprawdź hasło",
        skipFile: "Pomiń plik",
        validatingPassword: "Sprawdzanie hasła...",
        passwordValid: "Hasło jest poprawne",
        passwordInvalid: "Hasło jest niepoprawne",
        validationError: "Błąd walidacji"
    },
    
    cs: {
        // Общие сообщения
        error: "Chyba",
        success: "Úspěch",
        warning: "Varování",
        info: "Informace",
        ok: "OK",
        yes: "Ano",
        no: "Ne",
        cancel: "Zrušit",
        save: "Uložit",
        delete: "Smazat",
        edit: "Upravit",
        change: "Změnit",
        close: "Zavřít",
        
        // Ошибки
        errorInitializingApp: "Chyba při inicializaci aplikace!",
        errorSavingNote: "Chyba při ukládání poznámky!",
        errorDeletingNote: "Chyba při mazání poznámky!",
        errorLoadingNotes: "Chyba při načítání poznámek!",
        errorClearingNotes: "Chyba při čištění poznámek!",
        errorEditorInitialization: "Chyba inicializace editoru!",
        errorEditorTimeout: "Timeout inicializace editoru!",
        errorEncryption: "Chyba šifrování: {message}",
        errorDecryption: "Nelze dešifrovat soubor \"{filename}\". Nesprávné heslo nebo poškozený soubor.",
        errorImport: "Chyba při importu souboru \"{filename}\": {message}",
        errorNoFilesImported: "Žádný soubor se nepodařilo importovat.",
        importPartialSuccess: "Import dokončen s varováními: {imported} souborů importováno, {errors} chyb nastalo.",
        errorEmptyPassword: "Heslo nemůže být prázdné!",
        errorEmptyNote: "Poznámka nemůže být prázdná!",
        errorInvalidFile: "Soubor \"{filename}\" není soubor .note.",
        errorNoUniqueTag: "Soubor \"{filename}\" neobsahuje jedinečný tag.",
        encryptedFileDetected: "Detekován šifrovaný soubor: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Prosím vyberte formát \"Šifrovaný\" pro tento typ souboru.",
        
        // Успешные операции
        noteExported: "Poznámka byla úspěšně zašifrována a exportována!",
        importCompleted: "Import byl úspěšně dokončen. Počet přidaných poznámek: {count}",
        allNotesDeleted: "Všechny poznámky byly úspěšně smazány!",
        
        // Подтверждения
        confirmDeleteAll: "Jste si jisti, že chcete smazat všechny poznámky?",
        confirmDeleteAllTitle: "Smazat všechny poznámky",
        confirmDeleteAllPlaceholder: "Zadejte 'DELETE ALL' pro potvrzení",
        deleteAll: "Smazat vše",
        clearAllWarning: "Tato akce je nevratná!",
        clearAllWarning1: "Všechny poznámky budou trvale smazány",
        clearAllWarning2: "Obnovení dat bude nemožné",
        clearAllWarning3: "Doporučuje se vytvořit zálohu před smazáním",
        invalidPassword: "Neplatné heslo. Zkuste to znovu.",
        
        // Интерфейс
        noNotesMessage: "Žádné poznámky k zobrazení",
        chooseImportFormat: "Vyberte formát importu",
        encryptedFiles: "Šifrované soubory (.note)",
        htmlFiles: "HTML soubory",
        markdownFiles: "Markdown soubory (.md)",
        imageNotFound: "Obrázek nenalezen",
        imageNotFoundMessage: "Obrázek nenalezen: {src}",
        selectImageFile: "Prosím vyberte soubor obrázku",
        decryptNote: "Dešifrovat poznámku",
        enterPassword: "Zadejte heslo pro dešifrování:",
        password: "Heslo",
        
        // Счетчик слов
        wordCount: "Slova: {words} | Znaky: {chars} | Znaky (bez mezer): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zavřít",
        specialCharsClose: "Zavřít",
        
        // Таблицы
        createTable: "Vytvoření tabulky",
        enterRows: "Zadejte počet řádků:",
        numberOfRows: "Počet řádků",
        enterColumns: "Zadejte počet sloupců:",
        numberOfColumns: "Počet sloupců",
        
        // Кнопки
        addNote: "Přidat poznámku",
        importNotes: "Importovat poznámky",
        clearAllNotes: "Vymazat všechny poznámky",
        toggleView: "Přepnout zobrazení",
        saveNote: "Uložit poznámku",
        cancel: "Zrušit",
        confirmYes: "Ano",
        confirmNo: "Ne",
        ok: "OK",
        export: "Exportovat",
        exportClose: "Zavřít",
        exportEncrypted: "Šifrovaný",
        exportHtml: "HTML",
        exportEncryptedDesc: "Šifrované soubory (.note)",
        exportHtmlDesc: "HTML soubory",
        
        // Футер
        footerDescription: "Local Notes je jednoduchý a pohodlný nástroj pro vytváření poznámek přímo v prohlížeči. Všechny poznámky jsou uloženy ve vašem prohlížeči. Ukládejte své myšlenky, nápady a příběhy, strukturované pomocí nadpisů, formátování textu, seznamů a mnoho dalšího. Exportujte poznámky do souboru a sdílejte je s přáteli anonymně — prostě pošlete soubor a oni ho mohou otevřít importem do webové aplikace. S Local Notes jsou vaše poznámky vždy po ruce, organizované a bezpečné.",
        cookiePolicy: "Zásady Cookie",
        termsOfUse: "Podmínky použití",
        privacyPolicy: "Zásady ochrany osobních údajů",
        allRightsReserved: "Všechna práva vyhrazena. Local Notes",
        byAuthor: "Autor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Počkejte! <br> Připravujeme se na vaše poznámky.",
        preloaderInit: "Inicializace šifrování...",
        preloaderModules: "Načítání modulů...",
        preloaderSecurity: "Kontrola bezpečnosti...",
        preloaderInterface: "Příprava rozhraní...",
        preloaderComplete: "Dokončování načítání...",
        
        // Временные метки
        created: "Vytvořeno",
        modified: "Upraveno",
        months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
        monthsShort: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"],
        weekdays: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
        weekdaysShort: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        
        // Приветственное сообщение
        welcomeTitle: "Vítejte v Local Notes",
        welcomeSubtitle: "Bezpečné soukromé poznámky v prohlížeči",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes je bezpečná webová aplikace pro vytváření a ukládání poznámek přímo v prohlížeči. Všechna data zůstávají na vašem zařízení s vojenským šifrováním.",
        welcomeFeatures: "Klíčové funkce",
        welcomeFeature1: "Vojenské šifrování AES-256",
        welcomeFeature2: "Podpora 12 jazyků",
        welcomeFeature3: "PWA podpora — instalace jako aplikace",
        welcomeFeature4: "Optimalizovaný výkon",
        welcomeFeature5: "Vylepšená ochrana bezpečnosti",
        welcomeFeature6: "Moderní responzivní design",
        welcomeFeature7: "Podpora offline práce",
        welcomeGoals: "Cíle projektu",
        welcomeGoal1: "Maximální soukromí — data zůstávají lokálně",
        welcomeGoal2: "Bezpečnost — vojenské šifrování",
        welcomeGoal3: "Dostupnost — 12 jazyků",
        welcomeGoal4: "Univerzálnost — funguje všude",
        welcomeGoal5: "Výkon — rychlá práce",
        welcomeGoal6: "Pohodlí — intuitivní rozhraní",
        welcomeDeveloper: "Vývojář",
        welcomeDeveloperInfo: "Vyvinuto SerGio Play. Open source projekt zaměřený na soukromí a bezpečnost.",
        welcomeGetStarted: "Začít",
        welcomeGetStartedText: "Klikněte na 'Přidat poznámku' pro vytvoření první poznámky a začněte bezpečně organizovat informace.",
        welcomeDismiss: "Zobrazit pokyny",
        welcomeInstructions: "Pro vytvoření první poznámky klikněte na tlačítko 'Přidat poznámku' v horním panelu. Poté můžete napsat obsah a bezpečně ho uložit.",
        welcomeInstructionsTitle: "Jak začít",
        viewModeGrid: "Mřížka",
        viewModeList: "Seznam",
        enterPasswordForFile: "Zadejte heslo pro soubor",
        importingFiles: "Importování souborů",
        processingFile: "Zpracování souboru",
        of: "z",
        imported: "Importováno",
        errors: "Chyby",
        importWithErrors: "Import dokončen s chybami. Importováno: {imported}, chyb: {errors}",
        validatePassword: "Ověřit heslo",
        skipFile: "Přeskočit soubor",
        validatingPassword: "Ověřování hesla...",
        passwordValid: "Heslo je správné",
        passwordInvalid: "Heslo je nesprávné",
        validationError: "Chyba ověření"
    },
    
    sk: {
        // Общие сообщения
        error: "Chyba",
        success: "Úspech",
        warning: "Varovanie",
        info: "Informácia",
        ok: "OK",
        yes: "Áno",
        no: "Nie",
        cancel: "Zrušiť",
        save: "Uložiť",
        delete: "Zmazať",
        edit: "Upraviť",
        change: "Zmeniť",
        close: "Zavrieť",
        
        // Ошибки
        errorInitializingApp: "Chyba pri inicializácii aplikácie!",
        errorSavingNote: "Chyba pri ukladaní poznámky!",
        errorDeletingNote: "Chyba pri mazaní poznámky!",
        errorLoadingNotes: "Chyba pri načítavaní poznámok!",
        errorClearingNotes: "Chyba pri čistení poznámok!",
        errorEditorInitialization: "Chyba inicializácie editora!",
        errorEditorTimeout: "Timeout inicializácie editora!",
        errorEncryption: "Chyba šifrovania: {message}",
        errorDecryption: "Nie je možné dešifrovať súbor \"{filename}\". Nesprávne heslo alebo poškodený súbor.",
        errorImport: "Chyba pri importe súboru \"{filename}\": {message}",
        errorNoFilesImported: "Žiadny súbor sa nepodarilo importovať.",
        importPartialSuccess: "Import dokončený s varovaniami: {imported} súborov importovaných, {errors} chýb nastalo.",
        errorEmptyPassword: "Heslo nemôže byť prázdne!",
        errorEmptyNote: "Poznámka nemôže byť prázdna!",
        errorInvalidFile: "Súbor \"{filename}\" nie je súbor .note.",
        errorNoUniqueTag: "Súbor \"{filename}\" neobsahuje jedinečný tag.",
        encryptedFileDetected: "Detekovaný šifrovaný súbor: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Prosím vyberte formát \"Šifrovaný\" pre tento typ súboru.",
        
        // Успешные операции
        noteExported: "Poznámka bola úspešne zašifrovaná a exportovaná!",
        importCompleted: "Import bol úspešne dokončený. Počet pridaných poznámok: {count}",
        allNotesDeleted: "Všetky poznámky boli úspešne zmazané!",
        
        // Подтверждения
        confirmDeleteAll: "Ste si istí, že chcete zmazať všetky poznámky?",
        confirmDeleteAllTitle: "Zmazať všetky poznámky",
        confirmDeleteAllPlaceholder: "Zadajte 'DELETE ALL' pre potvrdenie",
        deleteAll: "Zmazať všetko",
        clearAllWarning: "Táto akcia je nevratná!",
        clearAllWarning1: "Všetky poznámky budú trvalo zmazané",
        clearAllWarning2: "Obnovenie dát bude nemožné",
        clearAllWarning3: "Odporúča sa vytvoriť zálohu pred zmazaním",
        invalidPassword: "Neplatné heslo. Skúste to znovu.",
        
        // Интерфейс
        noNotesMessage: "Žiadne poznámky na zobrazenie",
        chooseImportFormat: "Vyberte formát importu",
        encryptedFiles: "Šifrované súbory (.note)",
        htmlFiles: "HTML súbory",
        markdownFiles: "Markdown súbory (.md)",
        imageNotFound: "Obrázok nenájdený",
        imageNotFoundMessage: "Obrázok nenájdený: {src}",
        selectImageFile: "Prosím vyberte súbor obrázka",
        decryptNote: "Dešifrovať poznámku",
        enterPassword: "Zadajte heslo pre dešifrovanie:",
        password: "Heslo",
        
        // Счетчик слов
        wordCount: "Slová: {words} | Znaky: {chars} | Znaky (bez medzier): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zavrieť",
        specialCharsClose: "Zavrieť",
        
        // Таблицы
        createTable: "Vytvorenie tabuľky",
        enterRows: "Zadajte počet riadkov:",
        numberOfRows: "Počet riadkov",
        enterColumns: "Zadajte počet stĺpcov:",
        numberOfColumns: "Počet stĺpcov",
        
        // Кнопки
        addNote: "Pridať poznámku",
        importNotes: "Importovať poznámky",
        clearAllNotes: "Vymazať všetky poznámky",
        toggleView: "Prepnúť zobrazenie",
        saveNote: "Uložiť poznámku",
        cancel: "Zrušiť",
        confirmYes: "Áno",
        confirmNo: "Nie",
        ok: "OK",
        export: "Exportovať",
        exportClose: "Zavrieť",
        exportEncrypted: "Šifrovaný",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes je jednoduchý a pohodlný nástroj na vytváranie poznámok priamo v prehliadači. Všetky poznámky sú uložené vo vašom prehliadači. Ukladajte svoje myšlienky, nápady a príbehy, štruktúrované pomocou nadpisov, formátovania textu, zoznamov a mnoho ďalšieho. Exportujte poznámky do súboru a zdieľajte ich s priateľmi anonymne — jednoducho pošlite súbor a oni ho môžu otvoriť importom do webovej aplikácie. S Local Notes sú vaše poznámky vždy po ruke, organizované a bezpečné.",
        cookiePolicy: "Zásady Cookie",
        termsOfUse: "Podmienky použitia",
        privacyPolicy: "Zásady ochrany osobných údajov",
        allRightsReserved: "Všetky práva vyhradené. Local Notes",
        byAuthor: "Autor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Počkajte! <br> Pripravujeme sa na vaše poznámky.",
        preloaderInit: "Inicializácia šifrovania...",
        preloaderModules: "Načítavanie modulov...",
        preloaderSecurity: "Kontrola bezpečnosti...",
        preloaderInterface: "Príprava rozhrania...",
        preloaderComplete: "Dokončovanie načítavania...",
        
        // Временные метки
        created: "Vytvorené",
        modified: "Upravené",
        months: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
        weekdays: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
        weekdaysShort: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"],
        
        // Приветственное сообщение
        welcomeTitle: "Vitajte v Local Notes",
        welcomeSubtitle: "Bezpečné súkromné poznámky v prehliadači",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes je bezpečná webová aplikácia na vytváranie a ukladanie poznámok priamo v prehliadači. Všetky dáta zostávajú na vašom zariadení s vojným šifrovaním.",
        welcomeFeatures: "Kľúčové funkcie",
        welcomeFeature1: "Vojenské šifrovanie AES-256",
        welcomeFeature2: "Podpora 12 jazykov",
        welcomeFeature3: "PWA podpora — inštalácia ako aplikácia",
        welcomeFeature4: "Optimalizovaný výkon",
        welcomeFeature5: "Vylepšená ochrana bezpečnosti",
        welcomeFeature6: "Moderný responzívny dizajn",
        welcomeFeature7: "Podpora offline práce",
        welcomeGoals: "Ciele projektu",
        welcomeGoal1: "Maximálne súkromie — dáta zostávajú lokálne",
        welcomeGoal2: "Bezpečnosť — vojenské šifrovanie",
        welcomeGoal3: "Dostupnosť — 12 jazykov",
        welcomeGoal4: "Univerzálnosť — funguje všade",
        welcomeGoal5: "Výkon — rýchla práca",
        welcomeGoal6: "Pohodlie — intuitívne rozhranie",
        welcomeDeveloper: "Vývojár",
        welcomeDeveloperInfo: "Vyvinuté SerGio Play. Open source projekt zameraný na súkromie a bezpečnosť.",
        welcomeGetStarted: "Začať",
        welcomeGetStartedText: "Kliknite na 'Pridať poznámku' pre vytvorenie prvej poznámky a začnite bezpečne organizovať informácie.",
        welcomeDismiss: "Zobraziť pokyny",
        welcomeInstructions: "Pre vytvorenie prvej poznámky kliknite na tlačidlo 'Pridať poznámku' v hornom paneli. Potom môžete napísať obsah a bezpečne ho uložiť.",
        welcomeInstructionsTitle: "Ako začať",
        viewModeGrid: "Mriežka",
        viewModeList: "Zoznam",
        enterPasswordForFile: "Zadajte heslo pre súbor",
        importingFiles: "Importovanie súborov",
        processingFile: "Spracovanie súboru",
        of: "z",
        imported: "Importované",
        errors: "Chyby",
        importWithErrors: "Import dokončený s chybami. Importované: {imported}, chýb: {errors}",
        validatePassword: "Overiť heslo",
        skipFile: "Preskočiť súbor",
        validatingPassword: "Overovanie hesla...",
        passwordValid: "Heslo je správne",
        passwordInvalid: "Heslo je nesprávne",
        validationError: "Chyba overenia"
    },
    
    bg: {
        // Общие сообщения
        error: "Грешка",
        success: "Успех",
        warning: "Предупреждение",
        info: "Информация",
        ok: "ОК",
        yes: "Да",
        no: "Не",
        cancel: "Отказ",
        save: "Запази",
        delete: "Изтрий",
        edit: "Редактирай",
        change: "Промени",
        close: "Затвори",
        
        // Ошибки
        errorInitializingApp: "Грешка при инициализиране на приложението!",
        errorSavingNote: "Грешка при запазване на бележката!",
        errorDeletingNote: "Грешка при изтриване на бележката!",
        errorLoadingNotes: "Грешка при зареждане на бележките!",
        errorClearingNotes: "Грешка при изчистване на бележките!",
        errorEditorInitialization: "Грешка при инициализиране на редактора!",
        errorEditorTimeout: "Таймаут при инициализиране на редактора!",
        errorEncryption: "Грешка при криптиране: {message}",
        errorDecryption: "Не може да се декриптира файл \"{filename}\". Неправилна парола или повреден файл.",
        errorImport: "Грешка при импортиране на файл \"{filename}\": {message}",
        errorNoFilesImported: "Нито един файл не може да бъде импортиран.",
        importPartialSuccess: "Импортът е завършен с предупреждения: {imported} файла импортирани, {errors} грешки са възникнали.",
        errorEmptyPassword: "Паролата не може да бъде празна!",
        errorEmptyNote: "Бележката не може да бъде празна!",
        errorInvalidFile: "Файл \"{filename}\" не е .note файл.",
        errorNoUniqueTag: "Файл \"{filename}\" не съдържа уникален таг.",
        
        // Успешные операции
        noteExported: "Бележката е успешно криптирана и експортирана!",
        importCompleted: "Импортът е успешно завършен. Брой добавени бележки: {count}",
        allNotesDeleted: "Всички бележки са успешно изтрити!",
        
        // Подтверждения
        confirmDeleteAll: "Сигурни ли сте, че искате да изтриете всички бележки?",
        confirmDeleteAllTitle: "Изтрий всички бележки",
        confirmDeleteAllPlaceholder: "Въведете 'DELETE ALL' за потвърждение",
        deleteAll: "Изтрий всичко",
        clearAllWarning: "Това действие е необратимо!",
        clearAllWarning1: "Всички ваши бележки ще бъдат безвъзвратно изтрити",
        clearAllWarning2: "Възстановяването на данните ще бъде невъзможно",
        clearAllWarning3: "Препоръчва се да създадете резервно копие преди изтриване",
        invalidPassword: "Невалидна парола. Опитайте отново.",
        
        // Интерфейс
        noNotesMessage: "Няма бележки за показване",
        chooseImportFormat: "Изберете формат за импорт",
        encryptedFiles: "Криптирани файлове (.note)",
        htmlFiles: "HTML файлове",
        markdownFiles: "Markdown файлове (.md)",
        imageNotFound: "Изображението не е намерено",
        imageNotFoundMessage: "Изображението не е намерено: {src}",
        selectImageFile: "Моля, изберете файл с изображение",
        decryptNote: "Декриптиране на бележка",
        enterPassword: "Въведете парола за декриптиране:",
        password: "Парола",
        
        // Счетчик слов
        wordCount: "Думи: {words} | Символи: {chars} | Символи (без интервали): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Затвори",
        specialCharsClose: "Затвори",
        
        // Таблицы
        createTable: "Създаване на таблица",
        enterRows: "Въведете брой редове:",
        numberOfRows: "Брой редове",
        enterColumns: "Въведете брой колони:",
        numberOfColumns: "Брой колони",
        
        // Кнопки
        addNote: "Добави бележка",
        importNotes: "Импортирай бележки",
        clearAllNotes: "Изчисти всички бележки",
        toggleView: "Превключи изглед",
        saveNote: "Запази бележка",
        cancel: "Отказ",
        confirmYes: "Да",
        confirmNo: "Не",
        ok: "ОК",
        export: "Експорт",
        exportClose: "Затвори",
        exportEncrypted: "Криптиран",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes е прост и удобен инструмент за създаване на бележки директно в браузъра. Всички бележки се запазват във вашия браузър. Запазвайте мислите, идеите и историите си, структурирани с помощта на заглавия, форматиране на текст, списъци и много други. Експортирайте бележките във файл и споделяйте ги с приятели анонимно — просто изпратете файла и те ще могат да го отворят чрез импортиране в уеб приложението. С Local Notes бележките ви са винаги под ръка, организирани и сигурни.",
        cookiePolicy: "Политика за Cookie",
        termsOfUse: "Условия за ползване",
        privacyPolicy: "Политика за поверителност",
        allRightsReserved: "Всички права запазени. Local Notes",
        byAuthor: "Автор: SerGio Play",
        
        // Прелоадер
        preloaderText: "Изчакайте! <br> Подготвяме се за вашите бележки.",
        preloaderInit: "Инициализиране на криптирането...",
        preloaderModules: "Зареждане на модули...",
        preloaderSecurity: "Проверка на сигурността...",
        preloaderInterface: "Подготовка на интерфейса...",
        preloaderComplete: "Завършване на зареждането...",
        
        // Временные метки
        created: "Създадено",
        modified: "Променено",
        months: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
        monthsShort: ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"],
        weekdays: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"],
        weekdaysShort: ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"],
        
        // Приветственное сообщение
        welcomeTitle: "Добре дошли в Local Notes",
        welcomeSubtitle: "Сигурни лични бележки в браузъра",
        welcomeAbout: "За Local Notes",
        welcomeDescription: "Local Notes е сигурно уеб приложение за създаване и съхраняване на бележки директно в браузъра. Всички данни остават на вашето устройство с военно криптиране.",
        welcomeFeatures: "Ключови функции",
        welcomeFeature1: "Военно криптиране AES-256",
        welcomeFeature2: "Поддръжка на 12 езика",
        welcomeFeature3: "PWA поддръжка — инсталиране като приложение",
        welcomeFeature4: "Оптимизирана производителност",
        welcomeFeature5: "Подобрена защита на сигурността",
        welcomeFeature6: "Модерен адаптивен дизайн",
        welcomeFeature7: "Поддръжка на офлайн работа",
        welcomeGoals: "Цели на проекта",
        welcomeGoal1: "Максимална поверителност — данните остават локално",
        welcomeGoal2: "Сигурност — военно криптиране",
        welcomeGoal3: "Достъпност — 12 езика",
        welcomeGoal4: "Универсалност — работи навсякъде",
        welcomeGoal5: "Производителност — бърза работа",
        welcomeGoal6: "Удобство — интуитивен интерфейс",
        welcomeDeveloper: "Разработчик",
        welcomeDeveloperInfo: "Разработено от SerGio Play. Отворен проект с фокус върху поверителност и сигурност.",
        welcomeGetStarted: "Започнете",
        welcomeGetStartedText: "Щракнете върху 'Добави бележка', за да създадете първата бележка и започнете да организирате сигурно информацията.",
        welcomeDismiss: "Покажи инструкции",
        welcomeInstructions: "За да създадете първата си бележка, щракнете върху бутона 'Добави бележка' в горния панел. След това можете да напишете съдържанието и да го запазите сигурно.",
        welcomeInstructionsTitle: "Как да започнете",
        viewModeGrid: "Мрежа",
        viewModeList: "Списък",
        enterPasswordForFile: "Въведете парола за файл",
        importingFiles: "Импортиране на файлове",
        processingFile: "Обработка на файл",
        of: "от",
        imported: "Импортирани",
        errors: "Грешки",
        importWithErrors: "Импортът завърши с грешки. Импортирани: {imported}, грешки: {errors}",
        validatePassword: "Провери парола",
        skipFile: "Пропусни файл",
        validatingPassword: "Проверка на парола...",
        passwordValid: "Паролата е правилна",
        passwordInvalid: "Паролата е неправилна",
        validationError: "Грешка при проверка"
    },
    
    hr: {
        // Общие сообщения
        error: "Greška",
        success: "Uspjeh",
        warning: "Upozorenje",
        info: "Informacija",
        ok: "OK",
        yes: "Da",
        no: "Ne",
        cancel: "Odustani",
        save: "Spremi",
        delete: "Obriši",
        edit: "Uredi",
        change: "Promijeni",
        close: "Zatvori",
        
        // Ошибки
        errorInitializingApp: "Greška pri inicijalizaciji aplikacije!",
        errorSavingNote: "Greška pri spremanju bilješke!",
        errorDeletingNote: "Greška pri brisanju bilješke!",
        errorLoadingNotes: "Greška pri učitavanju bilješki!",
        errorClearingNotes: "Greška pri čišćenju bilješki!",
        errorEditorInitialization: "Greška pri inicijalizaciji editora!",
        errorEditorTimeout: "Timeout pri inicijalizaciji editora!",
        errorEncryption: "Greška šifriranja: {message}",
        errorDecryption: "Nije moguće dešifrirati datoteku \"{filename}\". Netočna lozinka ili oštećena datoteka.",
        errorImport: "Greška pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nijedna datoteka se nije mogla uvesti.",
        importPartialSuccess: "Uvoz je završen s upozorenjima: {imported} datoteka uvezeno, {errors} grešaka se dogodilo.",
        errorEmptyPassword: "Lozinka ne može biti prazna!",
        errorEmptyNote: "Bilješka ne može biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" nije .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne sadrži jedinstveni tag.",
        encryptedFileDetected: "Otkrivena šifrirana datoteka: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Molimo odaberite format \"Šifrirano\" za ovaj tip datoteke.",
        
        // Успешные операции
        noteExported: "Bilješka je uspješno šifrirana i izvezena!",
        importCompleted: "Uvoz je uspješno završen. Broj dodanih bilješki: {count}",
        allNotesDeleted: "Sve bilješke su uspješno obrisane!",
        
        // Подтверждения
        confirmDeleteAll: "Jeste li sigurni da želite obrisati sve bilješke?",
        
        // Интерфейс
        noNotesMessage: "Nema bilješki za prikaz",
        chooseImportFormat: "Odaberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
        markdownFiles: "Markdown datoteke (.md)",
        imageNotFound: "Slika nije pronađena",
        imageNotFoundMessage: "Slika nije pronađena: {src}",
        selectImageFile: "Molimo odaberite datoteku slike",
        decryptNote: "Dešifriraj bilješku",
        enterPassword: "Unesite lozinku za dešifriranje:",
        password: "Lozinka",
        
        // Счетчик слов
        wordCount: "Riječi: {words} | Znakovi: {chars} | Znakovi (bez razmaka): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zatvori",
        specialCharsClose: "Zatvori",
        
        // Таблицы
        createTable: "Stvaranje tablice",
        enterRows: "Unesite broj redaka:",
        numberOfRows: "Broj redaka",
        enterColumns: "Unesite broj stupaca:",
        numberOfColumns: "Broj stupaca",
        
        // Кнопки
        addNote: "Dodaj bilješku",
        importNotes: "Importiraj bilješke",
        clearAllNotes: "Obriši sve bilješke",
        toggleView: "Prebaci prikaz",
        saveNote: "Spremi bilješku",
        cancel: "Odustani",
        confirmYes: "Da",
        confirmNo: "Ne",
        ok: "OK",
        export: "Izvezi",
        exportClose: "Zatvori",
        exportEncrypted: "Šifriran",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes je jednostavan i prikladan alat za stvaranje bilješki izravno u pregledniku. Sve bilješke se spremaju u vašem pregledniku. Spremajte svoje misli, ideje i priče, strukturirane pomoću naslova, formatiranja teksta, popisa i mnogo više. Izvezite bilješke u datoteku i podijelite ih s prijateljima anonimno — jednostavno pošaljite datoteku i oni je mogu otvoriti uvozom u web aplikaciju. S Local Notes vaše bilješke su uvijek pri ruci, organizirane i sigurne.",
        cookiePolicy: "Politika Cookie",
        termsOfUse: "Uvjeti korištenja",
        privacyPolicy: "Politika privatnosti",
        allRightsReserved: "Sva prava pridržana. Local Notes",
        byAuthor: "Autor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Pričekajte! <br> Pripremamo se za vaše bilješke.",
        preloaderInit: "Inicijalizacija šifriranja...",
        preloaderModules: "Učitavanje modula...",
        preloaderSecurity: "Provjera sigurnosti...",
        preloaderInterface: "Priprema sučelja...",
        preloaderComplete: "Završavanje učitavanja...",
        
        // Временные метки
        created: "Stvoreno",
        modified: "Promijenjeno",
        months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
        monthsShort: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
        weekdays: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
        weekdaysShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        
        // Приветственное сообщение
        welcomeTitle: "Dobrodošli u Local Notes",
        welcomeSubtitle: "Sigurne privatne bilješke u pregledniku",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes je sigurna web aplikacija za stvaranje i pohranjivanje bilješki izravno u pregledniku. Svi podaci ostaju na vašem uređaju s vojnim šifriranjem.",
        welcomeFeatures: "Ključne značajke",
        welcomeFeature1: "Vojno šifriranje AES-256",
        welcomeFeature2: "Podrška za 12 jezika",
        welcomeFeature3: "PWA podrška — instalacija kao aplikacija",
        welcomeFeature4: "Optimizirana izvedba",
        welcomeFeature5: "Poboljšana zaštita sigurnosti",
        welcomeFeature6: "Moderno responzivni dizajn",
        welcomeFeature7: "Podrška offline rada",
        welcomeGoals: "Ciljevi projekta",
        welcomeGoal1: "Maksimalna privatnost — podaci ostaju lokalno",
        welcomeGoal2: "Sigurnost — vojno šifriranje",
        welcomeGoal3: "Dostupnost — 12 jezika",
        welcomeGoal4: "Univerzalnost — radi svugdje",
        welcomeGoal5: "Izvedba — brz rad",
        welcomeGoal6: "Udobnost — intuitivno sučelje",
        welcomeDeveloper: "Razvijatelj",
        welcomeDeveloperInfo: "Razvio SerGio Play. Otvoren projekt usredotočen na privatnost i sigurnost.",
        welcomeGetStarted: "Počnite",
        welcomeGetStartedText: "Kliknite 'Dodaj bilješku' da stvorite prvu bilješku i počnite sigurno organizirati informacije.",
        welcomeDismiss: "Prikaži upute",
        welcomeInstructions: "Da biste stvorili prvu bilješku, kliknite gumb 'Dodaj bilješku' u gornjem panelu. Zatim možete napisati sadržaj i sigurno ga spremiti.",
        welcomeInstructionsTitle: "Kako početi",
        viewModeGrid: "Mreža",
        viewModeList: "Lista",
        enterPasswordForFile: "Unesite lozinku za datoteku",
        importingFiles: "Uvoz datoteka",
        processingFile: "Obrada datoteke",
        of: "od",
        imported: "Uvezeno",
        errors: "Greške",
        importWithErrors: "Uvoz završen s greškama. Uvezeno: {imported}, grešaka: {errors}",
        validatePassword: "Provjeri lozinku",
        skipFile: "Preskoči datoteku",
        validatingPassword: "Provjera lozinke...",
        passwordValid: "Lozinka je ispravna",
        passwordInvalid: "Lozinka je neispravna",
        validationError: "Greška provjere"
    },
    
    sr: {
        // Общие сообщения
        error: "Грешка",
        success: "Успех",
        warning: "Упозорење",
        info: "Информација",
        ok: "ОК",
        yes: "Да",
        no: "Не",
        cancel: "Откажи",
        save: "Сачувај",
        delete: "Обриши",
        edit: "Уреди",
        change: "Промени",
        close: "Затвори",
        
        // Ошибки
        errorInitializingApp: "Грешка при иницијализацији апликације!",
        errorSavingNote: "Грешка при чувању белешке!",
        errorDeletingNote: "Грешка при брисању белешке!",
        errorLoadingNotes: "Грешка при учитавању белешки!",
        errorClearingNotes: "Грешка при чишћењу белешки!",
        errorEditorInitialization: "Грешка при иницијализацији едитора!",
        errorEditorTimeout: "Таймаут при иницијализацији едитора!",
        errorEncryption: "Грешка шифровања: {message}",
        errorDecryption: "Није могуће дешифровати датотеку \"{filename}\". Нетачна лозинка или оштећена датотека.",
        errorImport: "Грешка при увозу датотеке \"{filename}\": {message}",
        errorNoFilesImported: "Ниједна датотека се није могла увести.",
        importPartialSuccess: "Увоз је завршен са упозорењима: {imported} датотека увезено, {errors} грешака се догодило.",
        errorEmptyPassword: "Лозинка не може бити празна!",
        errorEmptyNote: "Белешка не може бити празна!",
        errorInvalidFile: "Датотека \"{filename}\" није .note датотека.",
        errorNoUniqueTag: "Датотека \"{filename}\" не садржи јединствени таг.",
        encryptedFileDetected: "Откривена шифрована датотека: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Молимо изаберите формат \"Шифровано\" за овај тип датотеке.",
        
        // Успешные операции
        noteExported: "Белешка је успешно шифрована и извезена!",
        importCompleted: "Увоз је успешно завршен. Број додатих белешки: {count}",
        allNotesDeleted: "Све белешке су успешно обрисане!",
        
        // Подтверждения
        confirmDeleteAll: "Да ли сте сигурни да желите обрисати све белешке?",
        
        // Интерфейс
        noNotesMessage: "Нема белешки за приказ",
        chooseImportFormat: "Изаберите формат увоза",
        encryptedFiles: "Шифроване датотеке (.note)",
        htmlFiles: "HTML датотеке",
        markdownFiles: "Markdown датотеке (.md)",
        decryptNote: "Дешифруј белешку",
        enterPassword: "Унесите лозинку за дешифровање:",
        password: "Лозинка",
        
        // Счетчик слов
        wordCount: "Речи: {words} | Знакови: {chars} | Знакови (без размака): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Затвори",
        specialCharsClose: "Затвори",
        
        // Таблицы
        createTable: "Стварање табеле",
        enterRows: "Унесите број редова:",
        numberOfRows: "Број редова",
        enterColumns: "Унесите број колона:",
        numberOfColumns: "Број колона",
        
        // Кнопки
        addNote: "Додај белешку",
        importNotes: "Увези белешке",
        clearAllNotes: "Обриши све белешке",
        toggleView: "Пребаци приказ",
        saveNote: "Сачувај белешку",
        cancel: "Откажи",
        confirmYes: "Да",
        confirmNo: "Не",
        ok: "ОК",
        export: "Извези",
        exportClose: "Затвори",
        exportEncrypted: "Шифрован",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes је једноставан и прикладан алат за стварање бележака директно у прегледачу. Све белешке се чувају у вашем прегледачу. Чувајте своје мисли, идеје и приче, структуриране помоћу наслова, форматирања текста, листа и много више. Извезите белешке у фајл и поделите их са пријатељима анонимно — једноставно пошаљите фајл и они га могу отворити увозом у веб апликацију. Са Local Notes ваше белешке су увек при руци, организоване и сигурне.",
        cookiePolicy: "Политика Cookie",
        termsOfUse: "Услови коришћења",
        privacyPolicy: "Политика приватности",
        allRightsReserved: "Сва права задржана. Local Notes",
        byAuthor: "Аутор: SerGio Play",
        
        // Прелоадер
        preloaderText: "Сачекајте! <br> Припремамо се за ваше белешке.",
        preloaderInit: "Иницијализација шифровања...",
        preloaderModules: "Учитавање модула...",
        preloaderSecurity: "Провера безбедности...",
        preloaderInterface: "Припрема интерфејса...",
        preloaderComplete: "Завршавање учитавања...",
        
        // Временные метки
        created: "Створено",
        modified: "Промењено",
        months: ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"],
        monthsShort: ["Јан", "Феб", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Нов", "Дец"],
        weekdays: ["Недеља", "Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота"],
        weekdaysShort: ["Нед", "Пон", "Уто", "Сре", "Чет", "Пет", "Суб"],
        
        // Приветственное сообщение
        welcomeTitle: "Добродошли у Local Notes",
        welcomeSubtitle: "Сигурне приватне белешке у прегледачу",
        welcomeAbout: "О Local Notes",
        welcomeDescription: "Local Notes је сигурна веб апликација за креирање и чување бележака директно у прегледачу. Сви подаци остају на вашем уређају са војним шифровањем.",
        welcomeFeatures: "Кључне карактеристике",
        welcomeFeature1: "Војно шифровање AES-256",
        welcomeFeature2: "Подршка за 12 језика",
        welcomeFeature3: "PWA подршка — инсталација као апликација",
        welcomeFeature4: "Оптимизована перформанса",
        welcomeFeature5: "Побољшана заштита сигурности",
        welcomeFeature6: "Модерни респонзивни дизајн",
        welcomeFeature7: "Подршка офлајн рада",
        welcomeGoals: "Циљеви пројекта",
        welcomeGoal1: "Максимална приватност — подаци остају локално",
        welcomeGoal2: "Сигурност — војно шифровање",
        welcomeGoal3: "Доступност — 12 језика",
        welcomeGoal4: "Универзалност — ради свуда",
        welcomeGoal5: "Перформанса — брз рад",
        welcomeGoal6: "Удобност — интуитивни интерфејс",
        welcomeDeveloper: "Развијалац",
        welcomeDeveloperInfo: "Развио SerGio Play. Отворен пројекат усредсређен на приватност и сигурност.",
        welcomeGetStarted: "Почните",
        welcomeGetStartedText: "Кликните 'Додај белешку' да направите прву белешку и почните сигурно да организујете информације.",
        welcomeDismiss: "Прикажи упутства",
        welcomeInstructions: "Да бисте направили прву белешку, кликните на дугме 'Додај белешку' у горњем панелу. Затим можете написати садржај и сигурно га сачувати.",
        welcomeInstructionsTitle: "Како почети",
        viewModeGrid: "Мрежа",
        viewModeList: "Листа",
        enterPasswordForFile: "Унесите лозинку за фајл",
        importingFiles: "Увоз фајлова",
        processingFile: "Обрада фајла",
        of: "од",
        imported: "Увезено",
        errors: "Грешке",
        importWithErrors: "Увоз завршен са грешкама. Увезено: {imported}, грешака: {errors}",
        validatePassword: "Провери лозинку",
        skipFile: "Прескочи фајл",
        validatingPassword: "Провера лозинке...",
        passwordValid: "Лозинка је исправна",
        passwordInvalid: "Лозинка је неисправна",
        validationError: "Грешка провере"
    },
    
    bs: {
        // Общие сообщения
        error: "Greška",
        success: "Uspjeh",
        warning: "Upozorenje",
        info: "Informacija",
        ok: "OK",
        yes: "Da",
        no: "Ne",
        cancel: "Odustani",
        save: "Sačuvaj",
        delete: "Obriši",
        edit: "Uredi",
        change: "Promijeni",
        close: "Zatvori",
        
        // Ошибки
        errorInitializingApp: "Greška pri inicijalizaciji aplikacije!",
        errorSavingNote: "Greška pri čuvanju bilješke!",
        errorDeletingNote: "Greška pri brisanju bilješke!",
        errorLoadingNotes: "Greška pri učitavanju bilješki!",
        errorClearingNotes: "Greška pri čišćenju bilješki!",
        errorEditorInitialization: "Greška pri inicijalizaciji editora!",
        errorEditorTimeout: "Timeout pri inicijalizaciji editora!",
        errorEncryption: "Greška šifriranja: {message}",
        errorDecryption: "Nije moguće dešifrirati datoteku \"{filename}\". Netočna lozinka ili oštećena datoteka.",
        errorImport: "Greška pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nijedna datoteka se nije mogla uvesti.",
        importPartialSuccess: "Uvoz je završen s upozorenjima: {imported} datoteka uvezeno, {errors} grešaka se dogodilo.",
        errorEmptyPassword: "Lozinka ne može biti prazna!",
        errorEmptyNote: "Bilješka ne može biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" nije .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne sadrži jedinstveni tag.",
        encryptedFileDetected: "Otkrivena šifrirana datoteka: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Molimo odaberite format \"Šifrirano\" za ovaj tip datoteke.",
        
        // Успешные операции
        noteExported: "Bilješka je uspješno šifrirana i izvezena!",
        importCompleted: "Uvoz je uspješno završen. Broj dodanih bilješki: {count}",
        allNotesDeleted: "Sve bilješke su uspješno obrisane!",
        
        // Подтверждения
        confirmDeleteAll: "Jeste li sigurni da želite obrisati sve bilješke?",
        
        // Интерфейс
        noNotesMessage: "Nema bilješki za prikaz",
        chooseImportFormat: "Odaberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
        markdownFiles: "Markdown datoteke (.md)",
        imageNotFound: "Slika nije pronađena",
        imageNotFoundMessage: "Slika nije pronađena: {src}",
        selectImageFile: "Molimo odaberite datoteku slike",
        decryptNote: "Dešifriraj bilješku",
        enterPassword: "Unesite lozinku za dešifriranje:",
        password: "Lozinka",
        
        // Счетчик слов
        wordCount: "Riječi: {words} | Znakovi: {chars} | Znakovi (bez razmaka): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zatvori",
        specialCharsClose: "Zatvori",
        
        // Таблицы
        createTable: "Stvaranje tabele",
        enterRows: "Unesite broj redaka:",
        numberOfRows: "Broj redaka",
        enterColumns: "Unesite broj stupaca:",
        numberOfColumns: "Broj stupaca",
        
        // Кнопки
        addNote: "Dodaj bilješku",
        importNotes: "Importiraj bilješke",
        clearAllNotes: "Obriši sve bilješke",
        toggleView: "Prebaci prikaz",
        saveNote: "Sačuvaj bilješku",
        cancel: "Odustani",
        confirmYes: "Da",
        confirmNo: "Ne",
        ok: "OK",
        export: "Izvezi",
        exportClose: "Zatvori",
        exportEncrypted: "Šifriran",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes je jednostavan i prikladan alat za stvaranje bilješki izravno u pregledniku. Sve bilješke se spremaju u vašem pregledniku. Spremajte svoje misli, ideje i priče, strukturirane pomoću naslova, formatiranja teksta, popisa i mnogo više. Izvezite bilješke u datoteku i podijelite ih s prijateljima anonimno — jednostavno pošaljite datoteku i oni je mogu otvoriti uvozom u web aplikaciju. S Local Notes vaše bilješke su uvijek pri ruci, organizirane i sigurne.",
        cookiePolicy: "Politika Cookie",
        termsOfUse: "Uvjeti korištenja",
        privacyPolicy: "Politika privatnosti",
        allRightsReserved: "Sva prava pridržana. Local Notes",
        byAuthor: "Autor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Pričekajte! <br> Pripremamo se za vaše bilješke.",
        preloaderInit: "Inicijalizacija šifriranja...",
        preloaderModules: "Učitavanje modula...",
        preloaderSecurity: "Provjera sigurnosti...",
        preloaderInterface: "Priprema sučelja...",
        preloaderComplete: "Završavanje učitavanja...",
        
        // Временные метки
        created: "Kreirano",
        modified: "Promijenjeno",
        months: ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
        weekdays: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
        weekdaysShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        
        // Приветственное сообщение
        welcomeTitle: "Dobrodošli u Local Notes",
        welcomeSubtitle: "Sigurne privatne bilješke u pregledniku",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes je sigurna web aplikacija za kreiranje i čuvanje bilješki direktno u pregledniku. Svi podaci ostaju na vašem uređaju s vojnim šifriranjem.",
        welcomeFeatures: "Ključne karakteristike",
        welcomeFeature1: "Vojno šifriranje AES-256",
        welcomeFeature2: "Podrška za 12 jezika",
        welcomeFeature3: "PWA podrška — instalacija kao aplikacija",
        welcomeFeature4: "Optimizirana izvedba",
        welcomeFeature5: "Poboljšana zaštita sigurnosti",
        welcomeFeature6: "Moderno responzivni dizajn",
        welcomeFeature7: "Podrška offline rada",
        welcomeGoals: "Ciljevi projekta",
        welcomeGoal1: "Maksimalna privatnost — podaci ostaju lokalno",
        welcomeGoal2: "Sigurnost — vojno šifriranje",
        welcomeGoal3: "Dostupnost — 12 jezika",
        welcomeGoal4: "Univerzalnost — radi svugdje",
        welcomeGoal5: "Izvedba — brz rad",
        welcomeGoal6: "Udobnost — intuitivno sučelje",
        welcomeDeveloper: "Razvijatelj",
        welcomeDeveloperInfo: "Razvio SerGio Play. Otvoren projekt usredotočen na privatnost i sigurnost.",
        welcomeGetStarted: "Počnite",
        welcomeGetStartedText: "Kliknite 'Dodaj bilješku' da kreirate prvu bilješku i počnite sigurno organizirati informacije.",
        welcomeDismiss: "Prikaži upute",
        welcomeInstructions: "Da kreirate prvu bilješku, kliknite dugme 'Dodaj bilješku' u gornjem panelu. Zatim možete napisati sadržaj i sigurno ga sačuvati.",
        welcomeInstructionsTitle: "Kako početi",
        viewModeGrid: "Mreža",
        viewModeList: "Lista",
        enterPasswordForFile: "Unesite lozinku za datoteku",
        importingFiles: "Uvoz datoteka",
        processingFile: "Obrada datoteke",
        of: "od",
        imported: "Uvezeno",
        errors: "Greške",
        importWithErrors: "Uvoz završen s greškama. Uvezeno: {imported}, grešaka: {errors}",
        validatePassword: "Provjeri lozinku",
        skipFile: "Preskoči datoteku",
        validatingPassword: "Provjera lozinke...",
        passwordValid: "Lozinka je ispravna",
        passwordInvalid: "Lozinka je neispravna",
        validationError: "Greška provjere"
    },
    
    mk: {
        // Общие сообщения
        error: "Грешка",
        success: "Успех",
        warning: "Предупредување",
        info: "Информација",
        ok: "ОК",
        yes: "Да",
        no: "Не",
        cancel: "Откажи",
        save: "Зачувај",
        delete: "Избриши",
        edit: "Уреди",
        change: "Промени",
        close: "Затвори",
        
        // Ошибки
        errorInitializingApp: "Грешка при иницијализација на апликацијата!",
        errorSavingNote: "Грешка при зачувување на белешката!",
        errorDeletingNote: "Грешка при бришење на белешката!",
        errorLoadingNotes: "Грешка при вчитување на белешките!",
        errorClearingNotes: "Грешка при чистење на белешките!",
        errorEditorInitialization: "Грешка при иницијализација на едиторот!",
        errorEditorTimeout: "Таймаут при иницијализација на едиторот!",
        errorEncryption: "Грешка при шифрирање: {message}",
        errorDecryption: "Не може да се дешифрира датотека \"{filename}\". Неточна лозинка или оштетена датотека.",
        errorImport: "Грешка при увоз на датотека \"{filename}\": {message}",
        errorNoFilesImported: "Ниту една датотека не може да се увезе.",
        importPartialSuccess: "Увозот е завршен со предупредувања: {imported} датотеки увезени, {errors} грешки се случија.",
        errorEmptyPassword: "Лозинката не може да биде празна!",
        errorEmptyNote: "Белешката не може да биде празна!",
        errorInvalidFile: "Датотека \"{filename}\" не е .note датотека.",
        errorNoUniqueTag: "Датотека \"{filename}\" не содржи единствен таг.",
        encryptedFileDetected: "Откриена шифрирана датотека: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Ве молиме изберете формат \"Шифрирано\" за овој тип датотека.",
        
        // Успешные операции
        noteExported: "Белешката е успешно шифрирана и извезена!",
        importCompleted: "Увозот е успешно завршен. Број на додадени белешки: {count}",
        allNotesDeleted: "Сите белешки се успешно избришани!",
        
        // Подтверждения
        confirmDeleteAll: "Дали сте сигурни дека сакате да ги избришете сите белешки?",
        confirmDeleteAllTitle: "Избриши ги сите белешки",
        confirmDeleteAllPlaceholder: "Внесете 'ИЗБРИШИ СИТЕ' за потврда",
        deleteAll: "Избриши сите",
        clearAllWarning: "Оваа акција е неповратна!",
        clearAllWarning1: "Сите ваши белешки ќе бидат трајно избришани",
        clearAllWarning2: "Восстановувањето на податоците ќе биде невозможно",
        clearAllWarning3: "Се препорачува да направите резервна копија пред бришење",
        invalidPassword: "Неточна лозинка. Обидете се повторно.",
        
        // Интерфейс
        noNotesMessage: "Нема белешки за приказ",
        chooseImportFormat: "Изберете формат за увоз",
        encryptedFiles: "Шифрирани датотеки (.note)",
        htmlFiles: "HTML датотеки",
        markdownFiles: "Markdown датотеки (.md)",
        decryptNote: "Дешифрирај белешка",
        enterPassword: "Внесете лозинка за дешифрирање:",
        password: "Лозинка",
        
        // Счетчик слов
        wordCount: "Зборови: {words} | Знаци: {chars} | Знаци (без празни места): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Затвори",
        specialCharsClose: "Затвори",
        
        // Таблицы
        createTable: "Создавање табела",
        enterRows: "Внесете број на редови:",
        numberOfRows: "Број на редови",
        enterColumns: "Внесете број на колони:",
        numberOfColumns: "Број на колони",
        
        // Кнопки
        addNote: "Додај белешка",
        importNotes: "Импортирај белешки",
        clearAllNotes: "Избриши сите белешки",
        toggleView: "Префрли приказ",
        saveNote: "Зачувај белешка",
        cancel: "Откажи",
        confirmYes: "Да",
        confirmNo: "Не",
        ok: "ОК",
        export: "Извези",
        exportClose: "Затвори",
        exportEncrypted: "Шифриран",
        exportHtml: "HTML",
        exportEncryptedDesc: "Шифрирани датотеки (.note)",
        exportHtmlDesc: "HTML датотеки",
        
        // Футер
        footerDescription: "Local Notes е едноставен и погоден алат за создавање на белешки директно во прелистувачот. Сите белешки се зачувани во вашиот прелистувач. Зачувајте ги вашите мисли, идеи и приказни, структурирани со помош на наслови, форматирање на текст, листи и многу повеќе. Извезите ги белешките во датотека и споделете ги со пријателите анонимно — едноставно испратете ја датотеката и тие ќе можат да ја отворат со увоз во веб апликацијата. Со Local Notes вашите белешки се секогаш при рака, организирани и безбедни.",
        cookiePolicy: "Политика за Cookie",
        termsOfUse: "Услови за користење",
        privacyPolicy: "Политика за приватност",
        allRightsReserved: "Сите права задржани. Local Notes",
        byAuthor: "Автор: SerGio Play",
        
        // Прелоадер
        preloaderText: "Почекајте! <br> Подготвуваме се за вашите белешки.",
        preloaderInit: "Иницијализација на шифрирање...",
        preloaderModules: "Вчитување модули...",
        preloaderSecurity: "Проверка на безбедност...",
        preloaderInterface: "Подготовка на интерфејс...",
        preloaderComplete: "Завршување на вчитување...",
        
        // Временные метки
        created: "Создадено",
        modified: "Променето",
        months: ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"],
        monthsShort: ["Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек"],
        weekdays: ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"],
        weekdaysShort: ["Нед", "Пон", "Вто", "Сре", "Чет", "Пет", "Саб"],
        
        // Приветственное сообщение
        welcomeTitle: "Добредојдовте во Local Notes",
        welcomeSubtitle: "Сигурни приватни белешки во прелистувачот",
        welcomeAbout: "За Local Notes",
        welcomeDescription: "Local Notes е сигурна веб апликација за креирање и чување на белешки директно во прелистувачот. Сите податоци остануваат на вашиот уред со воено шифрирање.",
        welcomeFeatures: "Клучни карактеристики",
        welcomeFeature1: "Воено шифрирање AES-256",
        welcomeFeature2: "Поддршка за 12 јазици",
        welcomeFeature3: "PWA поддршка — инсталирање како апликација",
        welcomeFeature4: "Оптимизирани перформанси",
        welcomeFeature5: "Подобрена заштита на сигурноста",
        welcomeFeature6: "Модерен респонзивен дизајн",
        welcomeFeature7: "Поддршка на офлајн работа",
        welcomeGoals: "Цели на проектот",
        welcomeGoal1: "Максимална приватност — податоците остануваат локално",
        welcomeGoal2: "Сигурност — воено шифрирање",
        welcomeGoal3: "Достапност — 12 јазици",
        welcomeGoal4: "Универзалност — работи насекаде",
        welcomeGoal5: "Перформанси — брза работа",
        welcomeGoal6: "Удобност — интуитивен интерфејс",
        welcomeDeveloper: "Развивач",
        welcomeDeveloperInfo: "Развиено од SerGio Play. Отворен проект со фокус на приватност и сигурност.",
        welcomeGetStarted: "Започнете",
        welcomeGetStartedText: "Кликнете 'Додај белешка' за да ја креирате првата белешка и започнете сигурно да ги организирате информациите.",
        welcomeDismiss: "Прикажи упатства",
        welcomeInstructions: "За да ја креирате првата белешка, кликнете на копчето 'Додај белешка' во горниот панел. Потоа можете да го напишете содржината и сигурно да го зачувате.",
        welcomeInstructionsTitle: "Како да започнете",
        viewModeGrid: "Мрежа",
        viewModeList: "Листа",
        enterPasswordForFile: "Внесете лозинка за датотека",
        importingFiles: "Увоз на датотеки",
        processingFile: "Обработка на датотека",
        of: "од",
        imported: "Увезени",
        errors: "Грешки",
        importWithErrors: "Увозот заврши со грешки. Увезени: {imported}, грешки: {errors}",
        validatePassword: "Провери лозинка",
        skipFile: "Прескокни датотека",
        validatingPassword: "Проверка на лозинка...",
        passwordValid: "Лозинката е правилна",
        passwordInvalid: "Лозинката е неправилна",
        validationError: "Грешка при проверка"
    },
    
    sl: {
        // Общие сообщения
        error: "Napaka",
        success: "Uspeh",
        warning: "Opozorilo",
        info: "Informacija",
        ok: "OK",
        yes: "Da",
        no: "Ne",
        cancel: "Prekliči",
        save: "Shrani",
        delete: "Izbriši",
        edit: "Uredi",
        change: "Spremeni",
        close: "Zapri",
        
        // Ошибки
        errorInitializingApp: "Napaka pri inicializaciji aplikacije!",
        errorSavingNote: "Napaka pri shranjevanju opombe!",
        errorDeletingNote: "Napaka pri brisanju opombe!",
        errorLoadingNotes: "Napaka pri nalaganju opomb!",
        errorClearingNotes: "Napaka pri čiščenju opomb!",
        errorEditorInitialization: "Napaka pri inicializaciji urejevalnika!",
        errorEditorTimeout: "Timeout pri inicializaciji urejevalnika!",
        errorEncryption: "Napaka šifriranja: {message}",
        errorDecryption: "Ni mogoče dešifrirati datoteko \"{filename}\". Napačno geslo ali poškodovana datoteka.",
        errorImport: "Napaka pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nobena datoteka se ni mogla uvesti.",
        importPartialSuccess: "Uvoz je bil dokončan z opozorili: {imported} datotek uvoženih, {errors} napak se je zgodilo.",
        errorEmptyPassword: "Geslo ne more biti prazno!",
        errorEmptyNote: "Opomba ne more biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" ni .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne vsebuje edinstvenega označevalca.",
        encryptedFileDetected: "Zaznan šifriran datoteka: \"{filename}\"",
        pleaseSelectEncryptedFormat: "Prosimo izberite format \"Šifrirano\" za to vrsto datoteke.",
        
        // Успешные операции
        noteExported: "Opomba je bila uspešno šifrirana in izvožena!",
        importCompleted: "Uvoz je bil uspešno dokončan. Število dodanih opomb: {count}",
        allNotesDeleted: "Vse opombe so bile uspešno izbrisane!",
        
        // Подтверждения
        confirmDeleteAll: "Ali ste prepričani, da želite izbrisati vse opombe?",
        
        // Интерфейс
        noNotesMessage: "Ni opomb za prikaz",
        chooseImportFormat: "Izberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
        markdownFiles: "Markdown datoteke (.md)",
        decryptNote: "Dešifriraj opombo",
        enterPassword: "Vnesite geslo za dešifriranje:",
        password: "Geslo",
        
        // Счетчик слов
        wordCount: "Besede: {words} | Znaki: {chars} | Znaki (brez presledkov): {charsNoSpaces}",
        
        // Эмодзи и специальные символы
        emojiClose: "Zapri",
        specialCharsClose: "Zapri",
        
        // Таблицы
        createTable: "Ustvarjanje tabele",
        enterRows: "Vnesite število vrstic:",
        numberOfRows: "Število vrstic",
        enterColumns: "Vnesite število stolpcev:",
        numberOfColumns: "Število stolpcev",
        
        // Кнопки
        addNote: "Dodaj opombo",
        importNotes: "Uvozi opombe",
        clearAllNotes: "Počisti vse opombe",
        toggleView: "Preklopi prikaz",
        saveNote: "Shrani opombo",
        cancel: "Prekliči",
        confirmYes: "Da",
        confirmNo: "Ne",
        ok: "OK",
        export: "Izvozi",
        exportClose: "Zapri",
        exportEncrypted: "Šifriran",
        exportHtml: "HTML",
        
        // Футер
        footerDescription: "Local Notes je preprosto in priročno orodje za ustvarjanje zapiskov neposredno v brskalniku. Vsi zapiski so shranjeni v vašem brskalniku. Shranjujte svoje misli, ideje in zgodbe, strukturirane z naslovi, oblikovanjem besedila, seznami in veliko več. Izvozite zapiske v datoteko in jih delite s prijatelji anonimno — preprosto pošljite datoteko in jo bodo lahko odprli z uvozom v spletno aplikacijo. Z Local Notes so vaši zapiski vedno pri roki, organizirani in varni.",
        cookiePolicy: "Pravilnik o Cookie",
        termsOfUse: "Pogoji uporabe",
        privacyPolicy: "Pravilnik o zasebnosti",
        allRightsReserved: "Vse pravice pridržane. Local Notes",
        byAuthor: "Avtor: SerGio Play",
        
        // Прелоадер
        preloaderText: "Počakajte! <br> Pripravljamo se za vaše opombe.",
        preloaderInit: "Inicializacija šifriranja...",
        preloaderModules: "Nalaganje modulov...",
        preloaderSecurity: "Preverjanje varnosti...",
        preloaderInterface: "Priprava vmesnika...",
        preloaderComplete: "Zaključevanje nalaganja...",
        
        // Временные метки
        created: "Ustvarjeno",
        modified: "Spremenjeno",
        months: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
        weekdays: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
        weekdaysShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
        
        // Приветственное сообщение
        welcomeTitle: "Dobrodošli v Local Notes",
        welcomeSubtitle: "Varne zasebne opombe v brskalniku",
        welcomeAbout: "O Local Notes",
        welcomeDescription: "Local Notes je varna spletna aplikacija za ustvarjanje in shranjevanje opomb neposredno v brskalniku. Vsi podatki ostanejo na vaši napravi z vojaškim šifriranjem.",
        welcomeFeatures: "Ključne funkcije",
        welcomeFeature1: "Vojaško šifriranje AES-256",
        welcomeFeature2: "Podpora za 12 jezikov",
        welcomeFeature3: "PWA podpora — namestitev kot aplikacija",
        welcomeFeature4: "Optimizirana zmogljivost",
        welcomeFeature5: "Izboljšana zaščita varnosti",
        welcomeFeature6: "Sodoben odziven dizajn",
        welcomeFeature7: "Podpora offline dela",
        welcomeGoals: "Cilji projekta",
        welcomeGoal1: "Maksimalna zasebnost — podatki ostanejo lokalno",
        welcomeGoal2: "Varnost — vojaško šifriranje",
        welcomeGoal3: "Dostopnost — 12 jezikov",
        welcomeGoal4: "Univerzalnost — deluje povsod",
        welcomeGoal5: "Zmogljivost — hitro delo",
        welcomeGoal6: "Udobnost — intuitiven vmesnik",
        welcomeDeveloper: "Razvijalec",
        welcomeDeveloperInfo: "Razvil SerGio Play. Odprtokoden projekt osredotočen na zasebnost in varnost.",
        welcomeGetStarted: "Začnite",
        welcomeGetStartedText: "Kliknite 'Dodaj opombo', da ustvarite prvo opombo in začnite varno organizirati informacije.",
        welcomeDismiss: "Prikaži navodila",
        welcomeInstructions: "Če želite ustvariti prvo opombo, kliknite gumb 'Dodaj opombo' v zgornjem panelu. Nato lahko napišete vsebino in jo varno shranite.",
        welcomeInstructionsTitle: "Kako začeti",
        viewModeGrid: "Mreža",
        viewModeList: "Seznam",
        enterPasswordForFile: "Vnesite geslo za datoteko",
        importingFiles: "Uvoz datotek",
        processingFile: "Obdelava datoteke",
        of: "od",
        imported: "Uvoženo",
        errors: "Napake",
        importWithErrors: "Uvoz končan z napakami. Uvoženo: {imported}, napak: {errors}",
        validatePassword: "Preveri geslo",
        skipFile: "Preskoči datoteko",
        validatingPassword: "Preverjanje gesla...",
        passwordValid: "Geslo je pravilno",
        passwordInvalid: "Geslo je nepravilno",
        validationError: "Napaka preverjanja"
    }
};

// Функция для получения перевода
function t(key, params = {}) {
    const lang = window.currentLang || 'en';
    const translation = translations[lang]?.[key] || translations['en'][key] || key;
    
    // Заменяем параметры в тексте
    return translation.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
}

// Экспортируем функцию и объект переводов в глобальную область
window.t = t;
window.translations = translations;

// Функция для получения текущего языка
function getCurrentLanguage() {
    return window.currentLang || 'en';
}

// Функция для обновления текста кнопок в HTML
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
        addNoteButton.innerHTML = `<i class="fas fa-plus"></i> ${t("addNote")}`;
    }
    if (importButton) {
        importButton.innerHTML = `<i class="fas fa-upload"></i> ${t("importNotes")}`;
    }
    if (clearAllButton) {
        clearAllButton.innerHTML = `<i class="fas fa-trash-alt"></i> ${t("clearAllNotes")}`;
    }
    if (toggleViewButton) {
        // Обновляем кнопку переключения вида с правильными переводами
        const notesContainer = document.getElementById("notesContainer");
        const isFullWidth = notesContainer && notesContainer.classList.contains("full-width-view");
        
        if (isFullWidth) {
            toggleViewButton.innerHTML = `<i class="fas fa-th"></i> ${t("viewModeGrid")}`;
        } else {
            toggleViewButton.innerHTML = `<i class="fas fa-list"></i> ${t("viewModeList")}`;
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
        saveNoteButton.innerHTML = `<i class="fas fa-save"></i> ${t("saveNote")}`;
    }
    if (cancelNoteButton) {
        cancelNoteButton.innerHTML = `<i class="fas fa-times"></i> ${t("cancel")}`;
    }
    if (confirmYesButton) {
        confirmYesButton.innerHTML = `<i class="fas fa-check"></i> ${t("confirmYes")}`;
    }
    if (confirmNoButton) {
        confirmNoButton.innerHTML = `<i class="fas fa-times"></i> ${t("confirmNo")}`;
    }
    if (okButton) {
        okButton.innerHTML = `<i class="fas fa-check"></i> ${t("ok")}`;
    }
}
} // Закрываем блок if (typeof translations === 'undefined')
