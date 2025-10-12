document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("currentYear");
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
});

const Btn = document.getElementById("toggleViewButton");

// Проверяем текущий язык и выбираем текст
if (currentLang.startsWith("ru")) {
    Btn.innerHTML = '<i class="fas fa-th"></i> Изменение способа отображения заметок';
} else {
    Btn.innerHTML = '<i class="fas fa-th"></i> Changing the way notes are displayed';
}

Btn.addEventListener("click", function () {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.classList.toggle("full-width-view");
    notesContainer.classList.toggle("default-view");
});
