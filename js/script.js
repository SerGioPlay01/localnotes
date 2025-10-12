document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("currentYear");
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
});

document.addEventListener("DOMContentLoaded", function () {
    const Btn = document.getElementById("toggleViewButton");
    
    // Проверяем, что кнопка существует
    if (!Btn) {
        console.error("toggleViewButton not found!");
        return;
    }
    
    // Получаем текущий язык с проверкой
    const currentLang = window.currentLang || navigator.language || 'en';
    console.log("Current language:", currentLang);
    
    // Проверяем текущий язык и выбираем текст
    if (currentLang.startsWith("ru")) {
        Btn.innerHTML = '<i class="fas fa-th"></i> Изменение способа отображения заметок';
    } else {
        Btn.innerHTML = '<i class="fas fa-th"></i> Changing the way notes are displayed';
    }
    
    // Добавляем обработчики с поддержкой Pointer Events
    Btn.addEventListener("pointerdown", function () {
        const notesContainer = document.getElementById("notesContainer");
        if (notesContainer) {
            const isFullWidth = notesContainer.classList.contains("full-width-view");
            notesContainer.classList.toggle("full-width-view");
            notesContainer.classList.toggle("default-view");
            
            // Обновляем текст кнопки (после переключения)
            const newIsFullWidth = notesContainer.classList.contains("full-width-view");
            if (newIsFullWidth) {
                if (currentLang.startsWith("ru")) {
                    Btn.innerHTML = '<i class="fas fa-list"></i> Переключить на сетку';
                } else {
                    Btn.innerHTML = '<i class="fas fa-list"></i> Switch to grid view';
                }
            } else {
                if (currentLang.startsWith("ru")) {
                    Btn.innerHTML = '<i class="fas fa-th"></i> Изменение способа отображения заметок';
                } else {
                    Btn.innerHTML = '<i class="fas fa-th"></i> Changing the way notes are displayed';
                }
            }
            
            console.log("Toggle view clicked - classes toggled, was:", isFullWidth, "now:", newIsFullWidth);
        } else {
            console.error("notesContainer not found!");
        }
    });
    
    // Fallback для старых браузеров
    Btn.addEventListener("click", function () {
        const notesContainer = document.getElementById("notesContainer");
        if (notesContainer) {
            const isFullWidth = notesContainer.classList.contains("full-width-view");
            notesContainer.classList.toggle("full-width-view");
            notesContainer.classList.toggle("default-view");
            
            // Обновляем текст кнопки (после переключения)
            const newIsFullWidth = notesContainer.classList.contains("full-width-view");
            if (newIsFullWidth) {
                if (currentLang.startsWith("ru")) {
                    Btn.innerHTML = '<i class="fas fa-list"></i> Переключить на сетку';
                } else {
                    Btn.innerHTML = '<i class="fas fa-list"></i> Switch to grid view';
                }
            } else {
                if (currentLang.startsWith("ru")) {
                    Btn.innerHTML = '<i class="fas fa-th"></i> Изменение способа отображения заметок';
                } else {
                    Btn.innerHTML = '<i class="fas fa-th"></i> Changing the way notes are displayed';
                }
            }
            
            console.log("Toggle view clicked (fallback) - classes toggled, was:", isFullWidth, "now:", newIsFullWidth);
        } else {
            console.error("notesContainer not found!");
        }
    });
    
    console.log("Toggle view button initialized successfully");
    
    // Дополнительная проверка состояния
    const notesContainer = document.getElementById("notesContainer");
    if (notesContainer) {
        console.log("Initial notesContainer classes:", notesContainer.className);
        console.log("Initial view state:", notesContainer.classList.contains("full-width-view") ? "full-width" : "default");
    }
});
