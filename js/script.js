const easymde = new EasyMDE({
    element: document.getElementById('EditBlock'),
    toolbar: ["bold", "italic", 
        "heading", "|", "quote", 
        "unordered-list", "ordered-list" , "|" , 
        "link", "image", "|" , "table", "code", 
        "|", "fullscreen", "side-by-side"],
});

// Функция для добавления заметки
function addBlock() {
    const contentDiv = document.getElementById('content');
    const noteContent = easymde.value();

    if (noteContent) {
        // Сохраняем заметку в LocalStorage
        saveToLocalStorage(noteContent);


        // Создаем новый элемент для заметки
        const noteBlock = document.createElement('div');
        noteBlock.className = 'note-block';
        noteBlock.innerHTML = marked(noteContent);  // Используем marked для отображения Markdown

        // Добавляем заметку в контент
        contentDiv.insertBefore(noteBlock, contentDiv.firstChild); // Добавляем заметку в начало

        // Call the function to apply the change
        makeLinksOpenInNewTab();

        // Очищаем текстовое поле
        easymde.value('');
    } else {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Текст заметки отсутствует! <br> Введите вашу заметку в редакторе.</p>
                <button class="modal-button" id="modal-close">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        const modalClose = document.getElementById('modal-close');
        modalClose.addEventListener('click', () => {
            modal.remove();
        });
    }
}


// Функция для очистки локального хранилища
function deletenotesall() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>Вы уверены, что хотите очистить все заметки?</p>
            <button class="modal-button" id="modal-confirm">Да</button>
            <button class="modal-button" id="modal-cancel">Нет</button>
        </div>
    `;
    document.body.appendChild(modal);
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    modalConfirm.addEventListener('click', () => {
        localStorage.removeItem('notes');
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '';
        modal.remove();
    });
    modalCancel.addEventListener('click', () => {
        modal.remove();
    });
}


// Функция для сохранения в LocalStorage
function saveToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Функция для экспорта данных
function exportData() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>Выберите заметки для экспорта:</p>
            <ul class="export-list">
                ${notes.slice().reverse().map((note, i) => `<div class="vote_note_export"><li><input class="export-checkbox" type="checkbox" id="export-note-${i}" name="export-notes" value="${notes.length - i - 1}"> ${marked(note)}</li></div>`).join('')}
            </ul>
            <button class="modal-button" id="modal-export" ${notes.length === 0 ? 'disabled' : ''}>Экспортировать</button>
            <button class="modal-button" id="modal-cancel">Отмена</button>
        </div>
    `;
    document.body.appendChild(modal);
    const modalExport = document.getElementById('modal-export');
    const modalCancel = document.getElementById('modal-cancel');
    modalExport.addEventListener('click', () => {
        const selectedNotes = [];
        const checkboxes = document.querySelectorAll('input[name="export-notes"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedNotes.push(notes[checkbox.value]);
            }
        });
        const blob = new Blob([JSON.stringify(selectedNotes)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.notes';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        modal.remove();
    });
    modalCancel.addEventListener('click', () => {
        modal.remove();
    });
}

// Функция для импорта данных
function importData() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        if (file.type !== 'text/plain' && file.name.split('.').pop() !== 'notes') {
            alert('Файл должен иметь расширение .notes');
            return;
        }
        reader.onload = function(event) {
            const notes = JSON.parse(event.target.result);
            const contentDiv = document.getElementById('content');

            // Сохраняем заметки в LocalStorage
            const oldNotes = JSON.parse(localStorage.getItem('notes')) || [];
            const newNotes = oldNotes.concat(notes);
            localStorage.setItem('notes', JSON.stringify(newNotes));
        
        notes.forEach(note => {
            const noteBlock = document.createElement('div');
            noteBlock.className = 'note-block';
            noteBlock.innerHTML = marked(note); // Используем marked для отображения Markdown
            contentDiv.insertBefore(noteBlock, contentDiv.firstChild); // Добавляем заметку в начало
            // Call the function to apply the change
            makeLinksOpenInNewTab();
        });
    };
    reader.readAsText(file);
}

}

// Загружаем заметки из LocalStorage при загрузке страницы
window.onload = function() {
const notes = JSON.parse(localStorage.getItem('notes')) || [];
const contentDiv = document.getElementById('content');
notes.forEach(note => {
    const noteBlock = document.createElement('div');
    noteBlock.className = 'note-block';
    noteBlock.innerHTML = marked(note); // Используем marked для отображения Markdown
    contentDiv.insertBefore(noteBlock, contentDiv.firstChild); // Добавляем заметку в начало
    // Call the function to apply the change
    makeLinksOpenInNewTab();
});
};

function makeLinksOpenInNewTab() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
    });
}

function DrawNote() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <iframe src="DrawDesk/index.html" frameborder="0" width="100%" height="600px"></iframe>
            <button class="modal-button" id="modal-save">Сохранить</button>
            <button class="modal-button" id="modal-close">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);

    const modalClose = document.getElementById('modal-close');
    modalClose.addEventListener('click', () => {
        // Remove the modal
        modal.remove();
    });

    const modalSave = document.getElementById('modal-save');
    modalSave.addEventListener('click', () => {
        const iframe = document.querySelector('iframe');
        const canvas = iframe.contentWindow.document.querySelector('canvas');
        const canvasData = canvas.toDataURL();

        // Save to local storage
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        let addNote = `<p>Графическая заметка:</p><br><img class="note-canvas" src="${canvasData}" alt="note image" />`;
        notes.push(addNote);
        localStorage.setItem('notes', JSON.stringify(notes));

        // Add to notes in the content div
        const contentDiv = document.getElementById('content');
        const noteBlock = document.createElement('div');
        noteBlock.className = 'note-block';
        noteBlock.innerHTML = addNote;
        contentDiv.insertBefore(noteBlock, contentDiv.firstChild);

        modal.remove();
    });
}

window.addEventListener('load', () => {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Hide the button if the device is mobile
    if (isMobile) {
        const drawNotesButton = document.querySelector('.draw-notes');
        if (drawNotesButton) {
            drawNotesButton.style.display = 'none';
        }
    }
});
