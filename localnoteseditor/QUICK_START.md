# LocalNotesEditor — Quick Start

## For End Users

1. Click any note to open the editor
2. Use toolbar buttons or keyboard shortcuts to format text
3. Drag images directly into the editor
4. Click the checklist button to add interactive tasks
5. Click Save when done

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+U | Underline |
| Ctrl+K | Insert link |
| Ctrl+H | Find & Replace |

---

## For Developers

### Initialize

```javascript
const editor = new LocalNotesEditor('containerId', {
    height: '500px',
    placeholder: 'Start typing...',
    toolbar: true,
    statusbar: true
});
```

### Get / Set Content

```javascript
const html = editor.getContent();
editor.setContent('<p>Hello <strong>World</strong></p>');
// setContent() resets undo history
```

### Insert Elements

```javascript
editor.insertImage();
editor.insertVideo();
editor.insertChecklistItem();
```

### Listen for Changes

```javascript
editor.ed.addEventListener('input', () => {
    console.log(editor.getContent());
});
```

### Add Custom Toolbar Button

```javascript
const btn = document.createElement('button');
btn.className = 'lne-btn';
btn.title = 'My action';
btn.innerHTML = '<i class="bi bi-star"></i>';
btn.addEventListener('click', () => { /* your action */ });
editor.toolbar.querySelector('.lne-toolbar-row').appendChild(btn);
```

---

## File Structure

```
localnoteseditor/
├── core.js          # Editor engine — include this
├── styles.css       # Editor styles — include this
└── bootstrap-icons/ # Icons (bundled)

css/
└── editor-modal.css # Modal layout styles

js/
└── editor-integration.js # App integration
```

---

## Troubleshooting

**Editor not appearing** — check container ID exists, CSS loaded, no console errors.

**Content not saving** — use `editor.getContent()` to retrieve HTML before saving.

**Styling conflicts** — check that `styles.css` loads before your overrides.

**Color bar not updating** — cursor must be inside a colored `<span>` or `<font>` element.
