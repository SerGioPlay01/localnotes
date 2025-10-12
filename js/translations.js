// Система переводов для динамического текста
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
        errorEncryption: "Encryption error: {message}",
        errorDecryption: "Unable to decrypt file \"{filename}\". Incorrect password or corrupted file.",
        errorImport: "Error importing file \"{filename}\": {message}",
        errorNoFilesImported: "No files could be imported.",
        errorEmptyPassword: "Password cannot be empty!",
        errorEmptyNote: "Note cannot be empty!",
        errorInvalidFile: "File \"{filename}\" is not a .note file.",
        errorNoUniqueTag: "File \"{filename}\" does not contain a unique tag.",
        
        // Успешные операции
        noteExported: "Note successfully encrypted and exported!",
        importCompleted: "The import has been successfully completed. Number of notes added: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Are you sure you want to delete all notes?",
        
        // Интерфейс
        noNotesToDisplay: "No notes to display",
        chooseImportFormat: "Choose import format",
        encryptedFiles: "Encrypted files (.note)",
        htmlFiles: "HTML files",
        decryptNote: "Decrypt Note",
        enterPassword: "Enter password for decryption:",
        password: "Password",
        
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
        byAuthor: "By SerGio Play"
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
        errorEncryption: "Ошибка при шифровании: {message}",
        errorDecryption: "Невозможно расшифровать файл \"{filename}\". Неверный пароль или поврежденный файл.",
        errorImport: "Ошибка при импорте файла \"{filename}\": {message}",
        errorNoFilesImported: "Ни один файл не удалось импортировать.",
        errorEmptyPassword: "Пароль не может быть пустым!",
        errorEmptyNote: "Заметка не может быть пустой!",
        errorInvalidFile: "Файл \"{filename}\" не является файлом с расширением .note.",
        errorNoUniqueTag: "Файл \"{filename}\" не содержит уникального тега.",
        
        // Успешные операции
        noteExported: "Заметка успешно зашифрована и экспортирована!",
        importCompleted: "Импорт успешно завершен. Количество добавленных заметок: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Вы уверены, что хотите удалить все заметки?",
        
        // Интерфейс
        noNotesToDisplay: "Нет заметок для отображения",
        chooseImportFormat: "Выберите формат импорта",
        encryptedFiles: "Зашифрованные файлы (.note)",
        htmlFiles: "HTML файлы",
        decryptNote: "Расшифровка заметки",
        enterPassword: "Введите пароль для расшифровки:",
        password: "Пароль",
        
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
        byAuthor: "Автор: SerGio Play"
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
        errorEncryption: "Помилка при шифруванні: {message}",
        errorDecryption: "Неможливо розшифрувати файл \"{filename}\". Невірний пароль або пошкоджений файл.",
        errorImport: "Помилка при імпорті файлу \"{filename}\": {message}",
        errorNoFilesImported: "Жоден файл не вдалося імпортувати.",
        errorEmptyPassword: "Пароль не може бути порожнім!",
        errorEmptyNote: "Нотатка не може бути порожньою!",
        errorInvalidFile: "Файл \"{filename}\" не є файлом з розширенням .note.",
        errorNoUniqueTag: "Файл \"{filename}\" не містить унікального тегу.",
        
        // Успешные операции
        noteExported: "Нотатку успішно зашифровано та експортовано!",
        importCompleted: "Імпорт успішно завершено. Кількість доданих нотаток: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Ви впевнені, що хочете видалити всі нотатки?",
        
        // Интерфейс
        noNotesToDisplay: "Немає нотаток для відображення",
        chooseImportFormat: "Виберіть формат імпорту",
        encryptedFiles: "Зашифровані файли (.note)",
        htmlFiles: "HTML файли",
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
        byAuthor: "Автор: SerGio Play"
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
        errorEncryption: "Błąd szyfrowania: {message}",
        errorDecryption: "Nie można odszyfrować pliku \"{filename}\". Nieprawidłowe hasło lub uszkodzony plik.",
        errorImport: "Błąd podczas importu pliku \"{filename}\": {message}",
        errorNoFilesImported: "Nie udało się zaimportować żadnego pliku.",
        errorEmptyPassword: "Hasło nie może być puste!",
        errorEmptyNote: "Notatka nie może być pusta!",
        errorInvalidFile: "Plik \"{filename}\" nie jest plikiem .note.",
        errorNoUniqueTag: "Plik \"{filename}\" nie zawiera unikalnego tagu.",
        
        // Успешные операции
        noteExported: "Notatka została pomyślnie zaszyfrowana i wyeksportowana!",
        importCompleted: "Import został pomyślnie zakończony. Liczba dodanych notatek: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Czy na pewno chcesz usunąć wszystkie notatki?",
        
        // Интерфейс
        noNotesToDisplay: "Brak notatek do wyświetlenia",
        chooseImportFormat: "Wybierz format importu",
        encryptedFiles: "Zaszyfrowane pliki (.note)",
        htmlFiles: "Pliki HTML",
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
        byAuthor: "Autor: SerGio Play"
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
        errorEncryption: "Chyba šifrování: {message}",
        errorDecryption: "Nelze dešifrovat soubor \"{filename}\". Nesprávné heslo nebo poškozený soubor.",
        errorImport: "Chyba při importu souboru \"{filename}\": {message}",
        errorNoFilesImported: "Žádný soubor se nepodařilo importovat.",
        errorEmptyPassword: "Heslo nemůže být prázdné!",
        errorEmptyNote: "Poznámka nemůže být prázdná!",
        errorInvalidFile: "Soubor \"{filename}\" není soubor .note.",
        errorNoUniqueTag: "Soubor \"{filename}\" neobsahuje jedinečný tag.",
        
        // Успешные операции
        noteExported: "Poznámka byla úspěšně zašifrována a exportována!",
        importCompleted: "Import byl úspěšně dokončen. Počet přidaných poznámek: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Jste si jisti, že chcete smazat všechny poznámky?",
        
        // Интерфейс
        noNotesToDisplay: "Žádné poznámky k zobrazení",
        chooseImportFormat: "Vyberte formát importu",
        encryptedFiles: "Šifrované soubory (.note)",
        htmlFiles: "HTML soubory",
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
        byAuthor: "Autor: SerGio Play"
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
        errorEncryption: "Chyba šifrovania: {message}",
        errorDecryption: "Nie je možné dešifrovať súbor \"{filename}\". Nesprávne heslo alebo poškodený súbor.",
        errorImport: "Chyba pri importe súboru \"{filename}\": {message}",
        errorNoFilesImported: "Žiadny súbor sa nepodarilo importovať.",
        errorEmptyPassword: "Heslo nemôže byť prázdne!",
        errorEmptyNote: "Poznámka nemôže byť prázdna!",
        errorInvalidFile: "Súbor \"{filename}\" nie je súbor .note.",
        errorNoUniqueTag: "Súbor \"{filename}\" neobsahuje jedinečný tag.",
        
        // Успешные операции
        noteExported: "Poznámka bola úspešne zašifrovaná a exportovaná!",
        importCompleted: "Import bol úspešne dokončený. Počet pridaných poznámok: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Ste si istí, že chcete zmazať všetky poznámky?",
        
        // Интерфейс
        noNotesToDisplay: "Žiadne poznámky na zobrazenie",
        chooseImportFormat: "Vyberte formát importu",
        encryptedFiles: "Šifrované súbory (.note)",
        htmlFiles: "HTML súbory",
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
        byAuthor: "Autor: SerGio Play"
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
        errorEncryption: "Грешка при криптиране: {message}",
        errorDecryption: "Не може да се декриптира файл \"{filename}\". Неправилна парола или повреден файл.",
        errorImport: "Грешка при импортиране на файл \"{filename}\": {message}",
        errorNoFilesImported: "Нито един файл не може да бъде импортиран.",
        errorEmptyPassword: "Паролата не може да бъде празна!",
        errorEmptyNote: "Бележката не може да бъде празна!",
        errorInvalidFile: "Файл \"{filename}\" не е .note файл.",
        errorNoUniqueTag: "Файл \"{filename}\" не съдържа уникален таг.",
        
        // Успешные операции
        noteExported: "Бележката е успешно криптирана и експортирана!",
        importCompleted: "Импортът е успешно завършен. Брой добавени бележки: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Сигурни ли сте, че искате да изтриете всички бележки?",
        
        // Интерфейс
        noNotesToDisplay: "Няма бележки за показване",
        chooseImportFormat: "Изберете формат за импорт",
        encryptedFiles: "Криптирани файлове (.note)",
        htmlFiles: "HTML файлове",
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
        byAuthor: "Автор: SerGio Play"
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
        errorEncryption: "Greška šifriranja: {message}",
        errorDecryption: "Nije moguće dešifrirati datoteku \"{filename}\". Netočna lozinka ili oštećena datoteka.",
        errorImport: "Greška pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nijedna datoteka se nije mogla uvesti.",
        errorEmptyPassword: "Lozinka ne može biti prazna!",
        errorEmptyNote: "Bilješka ne može biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" nije .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne sadrži jedinstveni tag.",
        
        // Успешные операции
        noteExported: "Bilješka je uspješno šifrirana i izvezena!",
        importCompleted: "Uvoz je uspješno završen. Broj dodanih bilješki: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Jeste li sigurni da želite obrisati sve bilješke?",
        
        // Интерфейс
        noNotesToDisplay: "Nema bilješki za prikaz",
        chooseImportFormat: "Odaberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
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
        byAuthor: "Autor: SerGio Play"
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
        errorEncryption: "Грешка шифровања: {message}",
        errorDecryption: "Није могуће дешифровати датотеку \"{filename}\". Нетачна лозинка или оштећена датотека.",
        errorImport: "Грешка при увозу датотеке \"{filename}\": {message}",
        errorNoFilesImported: "Ниједна датотека се није могла увести.",
        errorEmptyPassword: "Лозинка не може бити празна!",
        errorEmptyNote: "Белешка не може бити празна!",
        errorInvalidFile: "Датотека \"{filename}\" није .note датотека.",
        errorNoUniqueTag: "Датотека \"{filename}\" не садржи јединствени таг.",
        
        // Успешные операции
        noteExported: "Белешка је успешно шифрована и извезена!",
        importCompleted: "Увоз је успешно завршен. Број додатих белешки: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Да ли сте сигурни да желите обрисати све белешке?",
        
        // Интерфейс
        noNotesToDisplay: "Нема белешки за приказ",
        chooseImportFormat: "Изаберите формат увоза",
        encryptedFiles: "Шифроване датотеке (.note)",
        htmlFiles: "HTML датотеке",
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
        byAuthor: "Аутор: SerGio Play"
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
        errorEncryption: "Greška šifriranja: {message}",
        errorDecryption: "Nije moguće dešifrirati datoteku \"{filename}\". Netočna lozinka ili oštećena datoteka.",
        errorImport: "Greška pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nijedna datoteka se nije mogla uvesti.",
        errorEmptyPassword: "Lozinka ne može biti prazna!",
        errorEmptyNote: "Bilješka ne može biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" nije .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne sadrži jedinstveni tag.",
        
        // Успешные операции
        noteExported: "Bilješka je uspješno šifrirana i izvezena!",
        importCompleted: "Uvoz je uspješno završen. Broj dodanih bilješki: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Jeste li sigurni da želite obrisati sve bilješke?",
        
        // Интерфейс
        noNotesToDisplay: "Nema bilješki za prikaz",
        chooseImportFormat: "Odaberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
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
        byAuthor: "Autor: SerGio Play"
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
        errorEncryption: "Грешка при шифрирање: {message}",
        errorDecryption: "Не може да се дешифрира датотека \"{filename}\". Неточна лозинка или оштетена датотека.",
        errorImport: "Грешка при увоз на датотека \"{filename}\": {message}",
        errorNoFilesImported: "Ниту една датотека не може да се увезе.",
        errorEmptyPassword: "Лозинката не може да биде празна!",
        errorEmptyNote: "Белешката не може да биде празна!",
        errorInvalidFile: "Датотека \"{filename}\" не е .note датотека.",
        errorNoUniqueTag: "Датотека \"{filename}\" не содржи единствен таг.",
        
        // Успешные операции
        noteExported: "Белешката е успешно шифрирана и извезена!",
        importCompleted: "Увозот е успешно завршен. Број на додадени белешки: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Дали сте сигурни дека сакате да ги избришете сите белешки?",
        
        // Интерфейс
        noNotesToDisplay: "Нема белешки за приказ",
        chooseImportFormat: "Изберете формат за увоз",
        encryptedFiles: "Шифрирани датотеки (.note)",
        htmlFiles: "HTML датотеки",
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
        
        // Футер
        footerDescription: "Local Notes е едноставен и погоден алат за создавање на белешки директно во прелистувачот. Сите белешки се зачувани во вашиот прелистувач. Зачувајте ги вашите мисли, идеи и приказни, структурирани со помош на наслови, форматирање на текст, листи и многу повеќе. Извезите ги белешките во датотека и споделете ги со пријателите анонимно — едноставно испратете ја датотеката и тие ќе можат да ја отворат со увоз во веб апликацијата. Со Local Notes вашите белешки се секогаш при рака, организирани и безбедни.",
        cookiePolicy: "Политика за Cookie",
        termsOfUse: "Услови за користење",
        privacyPolicy: "Политика за приватност",
        allRightsReserved: "Сите права задржани. Local Notes",
        byAuthor: "Автор: SerGio Play"
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
        errorEncryption: "Napaka šifriranja: {message}",
        errorDecryption: "Ni mogoče dešifrirati datoteko \"{filename}\". Napačno geslo ali poškodovana datoteka.",
        errorImport: "Napaka pri uvozu datoteke \"{filename}\": {message}",
        errorNoFilesImported: "Nobena datoteka se ni mogla uvesti.",
        errorEmptyPassword: "Geslo ne more biti prazno!",
        errorEmptyNote: "Opomba ne more biti prazna!",
        errorInvalidFile: "Datoteka \"{filename}\" ni .note datoteka.",
        errorNoUniqueTag: "Datoteka \"{filename}\" ne vsebuje edinstvenega označevalca.",
        
        // Успешные операции
        noteExported: "Opomba je bila uspešno šifrirana in izvožena!",
        importCompleted: "Uvoz je bil uspešno dokončan. Število dodanih opomb: {count}",
        
        // Подтверждения
        confirmDeleteAll: "Ali ste prepričani, da želite izbrisati vse opombe?",
        
        // Интерфейс
        noNotesToDisplay: "Ni opomb za prikaz",
        chooseImportFormat: "Izberite format uvoza",
        encryptedFiles: "Šifrirane datoteke (.note)",
        htmlFiles: "HTML datoteke",
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
        byAuthor: "Avtor: SerGio Play"
    }
};

// Функция для получения перевода
function t(key, params = {}) {
    const lang = window.currentLang || 'en';
    const translation = translations[lang]?.[key] || translations['en'][key] || key;
    
    // Заменяем параметры в тексте
    return translation.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
}

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
        toggleViewButton.innerHTML = `<i class="fas fa-th"></i> ${t("toggleView")}`;
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
