# Migration from TinyMCE to LocalNotesEditor

LocalNotesEditor replaced TinyMCE in Local Notes v1.1.0. Migration is complete — this document is kept for reference.

## What Changed

### Files

| Old (TinyMCE) | New (LocalNotesEditor) |
|---------------|----------------------|
| `/editor_news/tinymce.min.js` | `/localnoteseditor/core.js` |
| `/css/tinymce-custom.css` | `/localnoteseditor/styles.css` |
| `/js/tinymce-translations.js` | `js/translations.js` (unified) |

### HTML

```html
<!-- Old -->
<textarea id="editorContainer" class="tinymce"></textarea>

<!-- New -->
<div id="editorContainer" class="lne-editor-wrapper"></div>
```

### JavaScript API

```javascript
// Old
tinymce.get('editorContainer').getContent()
tinymce.get('editorContainer').setContent(html)

// New
localNotesEditorInstance.getContent()
localNotesEditorInstance.setContent(html)
// or via compat layer:
getEditorContent()
setEditorContent(html)
```

### Compatibility Layer

`js/editor-integration.js` exposes the old function names so existing code continues to work:

```javascript
getEditorContent()     // → editor.getContent()
setEditorContent(html) // → editor.setContent(html)
clearEditor()          // → editor.clear()
focusEditor()          // → editor.ed.focus()
insertImage()          // → editor.insertImage()
insertChecklistItem()  // → editor.insertChecklistItem()
```

## Feature Comparison

| Feature | TinyMCE | LocalNotesEditor |
|---------|---------|-----------------|
| Rich formatting | ✓ | ✓ |
| Lists & checklists | ✓ | ✓ |
| Images & videos | ✓ | ✓ |
| Tables | ✓ | ✓ |
| Links | ✓ | ✓ |
| Code blocks | ✓ | ✓ |
| Find & Replace | ✓ | ✓ |
| Undo/Redo | ✓ | ✓ |
| Dark mode | ✓ | ✓ |
| i18n | External files | Built-in via `window.t()` |
| Color sync with cursor | ✗ | ✓ |
| File size | ~500KB | ~15KB |
| Dependencies | Multiple | None |
