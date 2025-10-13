// Функция для улучшенной обработки загрузки изображений
function handleImageLoad(img) {
    img.classList.add('loaded');
    img.classList.remove('error');
}

// Функция для обработки ошибок загрузки изображений
function handleImageError(img) {
    img.classList.add('error');
    img.classList.remove('loaded');
    console.warn('Failed to load image:', img.src);
}

// Инициализация обработчиков для всех изображений в заметках
function initializeImageHandlers() {
    const images = document.querySelectorAll('.note img');
    images.forEach(img => {
        // Добавляем обработчики только если их еще нет
        if (!img.hasAttribute('data-handlers-added')) {
            img.addEventListener('load', () => handleImageLoad(img));
            img.addEventListener('error', () => handleImageError(img));
            img.setAttribute('data-handlers-added', 'true');
            
            // Если изображение уже загружено
            if (img.complete && img.naturalHeight !== 0) {
                handleImageLoad(img);
            } else if (img.complete && img.naturalHeight === 0) {
                handleImageError(img);
            }
        }
    });
}

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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initializeImageHandlers);

// Наблюдатель за изменениями DOM для новых изображений
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                if (node.matches && node.matches('.note img')) {
                    // Новое изображение добавлено
                    const img = node;
                    img.addEventListener('load', () => handleImageLoad(img));
                    img.addEventListener('error', () => handleImageError(img));
                    img.setAttribute('data-handlers-added', 'true');
                } else if (node.querySelectorAll) {
                    // Проверяем дочерние элементы
                    const newImages = node.querySelectorAll('.note img');
                    newImages.forEach(img => {
                        if (!img.hasAttribute('data-handlers-added')) {
                            img.addEventListener('load', () => handleImageLoad(img));
                            img.addEventListener('error', () => handleImageError(img));
                            img.setAttribute('data-handlers-added', 'true');
                        }
                    });
                }
            }
        });
    });
});

// Запускаем наблюдение
observer.observe(document.body, {
    childList: true,
    subtree: true
});

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
