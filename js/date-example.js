// Пример использования функций форматирования дат
// Этот файл демонстрирует, как использовать новые утилиты для работы с датами

// Пример использования после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные переводов из lang.json
    if (typeof langData !== 'undefined') {
        window.langData = langData;
    }
    
    // Примеры форматирования дат
    const exampleDate = new Date('2025-10-12T21:20:00');
    
    // Пример для русского языка
    window.currentLang = 'ru';
    console.log('Русский язык:');
    console.log('Полная дата:', formatDate(exampleDate, 'long')); // "12 октября 2025 г. в 21:20"
    console.log('Средняя дата:', formatDate(exampleDate, 'medium')); // "12 окт 2025 21:20"
    console.log('Короткая дата:', formatDate(exampleDate, 'short')); // "12.10.2025 21:20"
    console.log('Только дата:', formatDate(exampleDate, 'dateOnly')); // "12 октября 2025 г."
    console.log('Только время:', formatDate(exampleDate, 'timeOnly')); // "21:20"
    
    // Пример для украинского языка
    window.currentLang = 'ua';
    console.log('\nУкраинский язык:');
    console.log('Полная дата:', formatDate(exampleDate, 'long')); // "12 жовтня 2025 р. о 21:20"
    console.log('Средняя дата:', formatDate(exampleDate, 'medium')); // "12 жов 2025 21:20"
    
    // Пример для английского языка
    window.currentLang = 'en';
    console.log('\nАнглийский язык:');
    console.log('Полная дата:', formatDate(exampleDate, 'long')); // "October 12, 2025 at 21:20"
    console.log('Средняя дата:', formatDate(exampleDate, 'medium')); // "Oct 12, 2025 21:20"
    
    // Пример создания полного перевода с "Создано" и "Изменено"
    const fullDate = formatFullDate(exampleDate);
    console.log('\nПолные переводы:');
    console.log('Создано:', fullDate.created);
    console.log('Изменено:', fullDate.modified);
    
    // Пример относительного времени
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    window.currentLang = 'ru';
    console.log('\nОтносительное время (русский):');
    console.log('1 час назад:', formatRelativeTime(oneHourAgo)); // "час назад"
    console.log('1 день назад:', formatRelativeTime(oneDayAgo)); // "день назад"
    
    window.currentLang = 'en';
    console.log('\nОтносительное время (английский):');
    console.log('1 hour ago:', formatRelativeTime(oneHourAgo)); // "hour ago"
    console.log('1 day ago:', formatRelativeTime(oneDayAgo)); // "day ago"
    
    // Пример парсинга даты
    const parsedDate1 = parseDate('12.10.2025 21:20');
    const parsedDate2 = parseDate('10/12/2025 21:20');
    const parsedDate3 = parseDate('2025-10-12 21:20');
    
    console.log('\nПарсинг дат:');
    console.log('12.10.2025 21:20:', parsedDate1);
    console.log('10/12/2025 21:20:', parsedDate2);
    console.log('2025-10-12 21:20:', parsedDate3);
});

// Функция для демонстрации в HTML
function demonstrateDateFormatting() {
    const date = new Date();
    const languages = ['en', 'ru', 'ua', 'pl', 'cs', 'sk', 'bg', 'hr', 'sr', 'bs', 'mk', 'sl'];
    
    let output = '<h3>Примеры форматирования дат на разных языках:</h3>';
    
    languages.forEach(lang => {
        window.currentLang = lang;
        const formattedDate = formatDate(date, 'long');
        const fullDate = formatFullDate(date);
        
        output += `<div style="margin: 10px 0; padding: 10px; border: 1px solid #ccc;">`;
        output += `<strong>${lang.toUpperCase()}:</strong><br>`;
        output += `Полная дата: ${formattedDate}<br>`;
        output += `Создано: ${fullDate.created}<br>`;
        output += `Изменено: ${fullDate.modified}`;
        output += `</div>`;
    });
    
    return output;
}

// Функция для обновления отображения дат в интерфейсе
function updateDateDisplay() {
    const currentLang = getCurrentLanguage();
    
    // Обновляем все элементы с классом 'date-display'
    document.querySelectorAll('.date-display').forEach(element => {
        const dateString = element.getAttribute('data-date');
        const format = element.getAttribute('data-format') || 'long';
        
        if (dateString) {
            const formattedDate = formatDate(dateString, format, currentLang);
            element.textContent = formattedDate;
        }
    });
    
    // Обновляем все элементы с классом 'relative-time'
    document.querySelectorAll('.relative-time').forEach(element => {
        const dateString = element.getAttribute('data-date');
        
        if (dateString) {
            const relativeTime = formatRelativeTime(dateString, currentLang);
            element.textContent = relativeTime;
        }
    });
}

// Экспортируем функции для использования в других скриптах
window.demonstrateDateFormatting = demonstrateDateFormatting;
window.updateDateDisplay = updateDateDisplay;
