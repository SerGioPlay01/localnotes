# LocalNotesEditor - Usage Examples

## Basic Initialization

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="localnoteseditor/styles.css">
</head>
<body>
    <div id="editor"></div>
    
    <script src="localnoteseditor/core.js"></script>
    <script>
        const editor = new LocalNotesEditor('editor', {
            height: '500px',
            placeholder: 'Start typing...'
        });
    </script>
</body>
</html>
```

## Getting and Setting Content

```javascript
// Initialize editor
const editor = new LocalNotesEditor('editor');

// Get HTML content
const html = editor.getContent();
console.log(html);

// Get plain text
const text = editor.getText();
console.log(text);

// Set content
editor.setContent('<p>Hello <strong>World</strong></p>');

// Clear editor
editor.clear();
```

## Working with Formatting

```javascript
// The editor automatically handles formatting through the toolbar
// Users can click buttons or use keyboard shortcuts:
// Ctrl+B - Bold
// Ctrl+I - Italic
// Ctrl+U - Underline
// Ctrl+Z - Undo
// Ctrl+Y - Redo

// Programmatically apply formatting
editor.execCommand('bold');
editor.execCommand('italic');
editor.execCommand('underline');
```

## Inserting Media

```javascript
// Insert image
editor.insertImage();
// Opens file picker for image selection

// Insert video
editor.insertVideo();
// Prompts for video URL (YouTube, Vimeo, or direct URL)

// Insert checklist item
editor.insertChecklistItem();
// Adds interactive checklist item with checkbox
```

## Undo/Redo Operations

```javascript
// Undo last action
editor.undo();

// Redo last undone action
editor.redo();

// Check undo/redo stack
console.log(editor.undoStack.length);
console.log(editor.redoStack.length);

// Configure max undo levels
editor.maxUndoLevels = 100; // Default is 200
```

## Working with Selections

```javascript
// Get current selection
const selection = window.getSelection();

// Get selected text
const selectedText = selection.toString();

// Get selected HTML
const range = selection.getRangeAt(0);
const selectedHTML = range.extractContents();
```

## Custom Toolbar Buttons

```javascript
// Add custom button to toolbar
const customBtn = document.createElement('button');
customBtn.className = 'lne-btn';
customBtn.title = 'Custom Action';
customBtn.innerHTML = '⭐';
customBtn.addEventListener('click', () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.color = 'gold';
        span.textContent = '⭐ ';
        range.insertNode(span);
    }
    editor.editorElement.focus();
});

editor.toolbar.appendChild(customBtn);
```

## Event Handling

```javascript
// Listen for input changes
editor.editorElement.addEventListener('input', () => {
    console.log('Content changed');
    console.log(editor.getContent());
});

// Listen for paste events
editor.editorElement.addEventListener('paste', (e) => {
    console.log('Content pasted');
});

// Listen for key events
editor.editorElement.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        console.log('Save shortcut pressed');
    }
});
```

## Styling Content

```javascript
// Set font size
editor.setFontSize('18px');

// Set font family
editor.setFontFamily('Georgia, serif');

// Apply formatting
editor.execCommand('bold');
editor.execCommand('italic');
editor.execCommand('underline');

// Create link
editor.createLink();
// Prompts for URL

// Format as blockquote
editor.formatBlock('blockquote');

// Format as code block
editor.formatBlock('pre');
```

## Cleanup and Destruction

```javascript
// Focus editor
editor.editorElement.focus();

// Check if editor is destroyed
if (editor.isDestroyed) {
    console.log('Editor has been destroyed');
}

// Destroy editor and clean up
editor.destroy();
```

## Integration with Forms

```html
<form id="noteForm">
    <div id="editor"></div>
    <button type="submit">Save Note</button>
</form>

<script>
    const editor = new LocalNotesEditor('editor');
    
    document.getElementById('noteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const content = editor.getContent();
        const text = editor.getText();
        
        // Send to server
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: content,
                text: text
            })
        });
    });
</script>
```

## Responsive Editor

```javascript
// Editor automatically adapts to container size
// Adjust height based on viewport
const editor = new LocalNotesEditor('editor', {
    height: window.innerWidth < 768 ? '300px' : '500px'
});

// Update on resize
window.addEventListener('resize', () => {
    const newHeight = window.innerWidth < 768 ? '300px' : '500px';
    editor.editorElement.style.minHeight = newHeight;
});
```

## Dark Mode Support

```css
/* Automatically applies dark mode based on system preference */
@media (prefers-color-scheme: dark) {
    .lne-wrapper {
        background: #1e1e1e;
        color: #e0e0e0;
    }
}

/* Or force dark mode */
.lne-wrapper.dark-mode {
    background: #1e1e1e;
    color: #e0e0e0;
}
```

## Paste Handling

```javascript
// Editor automatically cleans up pasted content
// Removes excessive styles and formatting

// Custom paste handler
editor.editorElement.addEventListener('paste', (e) => {
    e.preventDefault();
    
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
    }
});
```

## Drag and Drop

```javascript
// Editor supports drag and drop for images
editor.editorElement.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.insertNode(img);
                }
            };
            reader.readAsDataURL(file);
        }
    }
});
```

## Status Bar Information

```javascript
// Editor automatically updates status bar with:
// - Word count
// - Character count

// Access status bar
const statusbar = editor.statusbar;

// Update status bar manually
editor.updateStatusbar();
```

## Advanced: Custom Editor Instance

```javascript
class CustomNotesEditor extends LocalNotesEditor {
    constructor(containerId, options) {
        super(containerId, options);
        this.setupCustomFeatures();
    }
    
    setupCustomFeatures() {
        // Add custom features
        this.addCustomButton('highlight', () => {
            this.execCommand('backColor', false, 'yellow');
        });
    }
    
    addCustomButton(name, callback) {
        const btn = document.createElement('button');
        btn.className = 'lne-btn';
        btn.textContent = name;
        btn.addEventListener('click', callback);
        this.toolbar.appendChild(btn);
    }
}

// Use custom editor
const customEditor = new CustomNotesEditor('editor');
```

## Performance Tips

1. **Limit undo levels** for large documents:
   ```javascript
   editor.maxUndoLevels = 50;
   ```

2. **Debounce save operations**:
   ```javascript
   let saveTimeout;
   editor.editorElement.addEventListener('input', () => {
       clearTimeout(saveTimeout);
       saveTimeout = setTimeout(() => {
           saveContent(editor.getContent());
       }, 1000);
   });
   ```

3. **Use text content for search**:
   ```javascript
   const searchText = editor.getText().toLowerCase();
   ```

4. **Lazy load images**:
   ```javascript
   const images = editor.editorElement.querySelectorAll('img');
   images.forEach(img => {
       img.loading = 'lazy';
   });
   ```
