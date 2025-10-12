document.addEventListener("click", (event) => {
    const target = event.target;

    // Проверяем, что клик произошёл на изображении внутри заметки
    if (target.matches(".note img")) {
        // Создаём затемнённый фон
        const overlay = document.createElement("div");
        overlay.classList.add("fullscreen-overlay");

        // Создаём изображение для полноэкранного просмотра
        const fullscreenImage = document.createElement("img");
        fullscreenImage.classList.add("fullscreen-image");
        fullscreenImage.src = target.src; // Копируем ссылку на изображение
        overlay.appendChild(fullscreenImage);

        // Добавляем обработчик закрытия при клике на затемнённый фон
        overlay.addEventListener("click", () => {
            fullscreenImage.classList.add("closing"); // Добавляем класс для исчезновения
            setTimeout(() => {
                document.body.removeChild(overlay); // Удаляем оверлей после завершения анимации
            }, 400); // Тайм-аут соответствует времени анимации
        });

        // Добавляем затемнённый фон в тело документа
        document.body.appendChild(overlay);
    }
});
