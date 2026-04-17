# Migration from TinyMCE to LocalNotesEditor

## Overview

LocalNotesEditor is a lightweight, custom-built rich text editor designed specifically for the Local Notes application. It replaces TinyMCE while maintaining all essential functionality and improving performance.

## Key Changes

### 1. File Structure

**Old (TinyMCE):**
- `/editor_news/tinymce.min.js` - TinyMCE library
- `/css/tinymce-custom.css` - TinyMCE custom styles

**New (LocalNotesEditor):**
- `/localnoteseditor/core.js` - Editor core
- `/localnoteseditor/styles.css` - Editor styles
- `/js/editor-integration.js` - Integration with app
- `/js/tinymce-compat.js` - Compatibility layer
- `/css/editor-modal.css` - Modal-specific styles

### 2. HTML Changes

**Old:**
```html
<textarea id="editorContainer" class="tinymce"></textarea>
```

**New:**
```html
<div id="editorContainer" class="lne-editor-wrapper"></div>
```

### 3. JavaScript API

#### Getting Content
```javascript
// Old
const content = tinymceEditor.getContent();

// New
const content = localNotesEditorInstance.getContent();
// or
const content = window.localNotesEditorAPI.getContent();
```

#### Setting Content
```javascript
// Old
tinymceEditor.setContent(html);

// New
localNotesEditorInstance.setContent(html);
// or
window.localNotesEditorAPI.setContent(html);
```

#### Inserting Elements
```javascript
// Old
tinymceEditor.execCommand('mceInsertContent', false, html);

// New
localNotesEditorInstance.insertImage();
localNotesEditorInstance.insertVideo();
localNotesEditorInstance.insertChecklistItem();
```

### 4. Compatibility Layer

A compatibility layer (`tinymce-compat.js`) is provided to maintain backward compatibility with existing code:

```javascript
// These functions still work
initTinyMCE();
insertImage();
insertIframe();
insertChecklistItem();
getEditorContent();
setEditorContent(html);
clearEditor();
focusEditor();
```

### 5. Features Comparison

| Feature | TinyMCE | LocalNotesEditor |
|---------|---------|------------------|
| Rich text formatting | ✓ | ✓ |
| Lists (ordered/unordered) | ✓ | ✓ |
| Checklists | ✓ | ✓ |
| Images | ✓ | ✓ |
| Videos | ✓ | ✓ |
| Links | ✓ | ✓ |
| Blockquotes | ✓ | ✓ |
| Code blocks | ✓ | ✓ |
| Undo/Redo | ✓ | ✓ |
| Keyboard shortcuts | ✓ | ✓ |
| Responsive design | ✓ | ✓ |
| Dark mode | ✓ | ✓ |
| File size | ~500KB | ~15KB |
| Dependencies | Multiple | None |

### 6. Performance Improvements

- **Smaller bundle size**: 15KB vs 500KB+
- **Faster initialization**: No external library loading
- **Better mobile performance**: Optimized for touch devices
- **Reduced memory usage**: Lightweight implementation

### 7. Customization

LocalNotesEditor is designed to be easily customizable:

```javascript
// Create custom editor instance
const editor = new LocalNotesEditor('containerId', {
    height: '500px',
    placeholder: 'Start typing...',
    toolbar: true,
    statusbar: true
});

// Access editor element
editor.editorElement

// Access toolbar
editor.toolbar

// Access statusbar
editor.statusbar
```

### 8. Extending Functionality

To add custom buttons or functionality:

```javascript
// Add custom button to toolbar
const customBtn = document.createElement('button');
customBtn.className = 'lne-btn';
customBtn.innerHTML = 'Custom';
customBtn.addEventListener('click', () => {
    // Custom action
});
editor.toolbar.appendChild(customBtn);
```

### 9. Styling

Override default styles using CSS:

```css
.lne-wrapper {
    /* Custom wrapper styles */
}

.lne-editor {
    /* Custom editor styles */
}

.lne-btn {
    /* Custom button styles */
}
```

### 10. Troubleshooting

**Editor not appearing:**
- Ensure `editor-integration.js` is loaded
- Check that container element exists
- Verify CSS is loaded

**Content not saving:**
- Use `getContent()` method to retrieve HTML
- Ensure `setContent()` is called with valid HTML

**Styling issues:**
- Check that `styles.css` is loaded
- Verify no conflicting CSS rules
- Use browser DevTools to inspect elements

## Migration Checklist

- [ ] Replace TinyMCE script with LocalNotesEditor
- [ ] Update HTML container from textarea to div
- [ ] Update CSS imports
- [ ] Test all editor features
- [ ] Verify undo/redo functionality
- [ ] Test on mobile devices
- [ ] Check dark mode support
- [ ] Verify keyboard shortcuts
- [ ] Test image/video insertion
- [ ] Test checklist functionality

## Support

For issues or questions, refer to:
- `/localnoteseditor/README.md` - Feature documentation
- `/js/editor-integration.js` - Integration examples
- `/js/tinymce-compat.js` - Compatibility functions
