// Современная функция для обработки событий с поддержкой Pointer Events
function handleImageClick(event) {
    const target = event.target;

    // Проверяем, что событие произошло на изображении внутри заметки
    if (target.matches(".note img")) {
        // Создаём затемнённый фон
        const overlay = document.createElement("div");
        overlay.classList.add("fullscreen-overlay");

        // Создаём изображение для полноэкранного просмотра
        const fullscreenImage = document.createElement("img");
        fullscreenImage.classList.add("fullscreen-image");
        fullscreenImage.src = target.src; // Копируем ссылку на изображение
        overlay.appendChild(fullscreenImage);

        // Функция для закрытия оверлея
        const closeOverlay = () => {
            fullscreenImage.classList.add("closing"); // Добавляем класс для исчезновения
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay); // Удаляем оверлей после завершения анимации
                }
            }, 400); // Тайм-аут соответствует времени анимации
        };

        // Добавляем обработчики закрытия с поддержкой Pointer Events
        overlay.addEventListener("pointerdown", closeOverlay);
        overlay.addEventListener("click", closeOverlay);
        overlay.addEventListener("touchend", closeOverlay);
        
        // Закрытие по клавише Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeOverlay();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Добавляем затемнённый фон в тело документа
        document.body.appendChild(overlay);
    }
}

// Используем современные Pointer Events с fallback
if (window.PointerEvent) {
    // Современные браузеры с поддержкой Pointer Events
    document.addEventListener("pointerdown", handleImageClick);
} else {
    // Fallback для старых браузеров
    document.addEventListener("click", handleImageClick);
    
    // Дополнительная поддержка touch для старых браузеров
    if ('ontouchstart' in window) {
        document.addEventListener("touchend", handleImageClick);
    }
}
