# LocalNotesEditor - Quick Start Guide

## Installation

The editor is already integrated into the Local Notes application. No additional installation is needed.

## Basic Usage

### For End Users

1. **Open a note** - Click on any note to edit it
2. **Format text** - Use toolbar buttons or keyboard shortcuts
3. **Insert media** - Click image or video buttons
4. **Create lists** - Click list buttons
5. **Add checklists** - Click checklist button
6. **Save** - Click Save button

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+U | Underline |

## For Developers

### Initialize Editor

```javascript
const editor = new LocalNotesEditor('editorContainer', {
    height: '500px',
    placeholder: 'Start typing...',
    toolbar: true,
    statusbar: true
});
```

### Get Content

```javascript
// Get HTML
const html = editor.getContent();

// Get plain text
const text = editor.getText();
```

### Set Content

```javascript
editor.setContent('<p>Hello <strong>World</strong></p>');
```

### Insert Elements

```javascript
// Image
editor.insertImage();

// Video
editor.insertVideo();

// Checklist
editor.insertChecklistItem();
```

### Undo/Redo

```javascript
editor.undo();
editor.redo();
```

## File Structure

```
localnoteseditor/
├── core.js              # Main editor (include this)
└── styles.css           # Styles (include this)

js/
├── editor-integration.js # Integration (auto-loaded)
└── tinymce-compat.js    # Compatibility (auto-loaded)

css/
└── editor-modal.css     # Modal styles (auto-loaded)
```

## Common Tasks

### Add Custom Button

```javascript
const btn = document.createElement('button');
btn.className = 'lne-btn';
btn.innerHTML = '⭐';
btn.addEventListener('click', () => {
    // Your action here
});
editor.toolbar.appendChild(btn);
```

### Handle Content Changes

```javascript
editor.editorElement.addEventListener('input', () => {
    console.log('Content changed');
    console.log(editor.getContent());
});
```

### Save Content

```javascript
function saveNote() {
    const content = editor.getContent();
    const text = editor.getText();
    
    // Send to server
    fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: content, text: text })
    });
}
```

### Load Content

```javascript
function loadNote(noteId) {
    fetch(`/api/notes/${noteId}`)
        .then(r => r.json())
        .then(data => {
            editor.setContent(data.html);
        });
}
```

## Troubleshooting

### Editor Not Appearing
- Check that container element exists
- Verify CSS is loaded
- Check browser console for errors

### Content Not Saving
- Use `getContent()` to retrieve HTML
- Verify content is being sent to server
- Check network tab in DevTools

### Styling Issues
- Check that styles.css is loaded
- Verify no conflicting CSS
- Use browser DevTools to inspect

### Performance Issues
- Reduce undo history: `editor.maxUndoLevels = 50`
- Debounce save operations
- Check for large images

## Browser Compatibility

Works on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Next Steps

1. **Read** - Check README.md for features
2. **Learn** - Review EXAMPLES.md for code samples
3. **Migrate** - Follow MIGRATION_GUIDE.md if upgrading
4. **Customize** - Modify styles and add features
5. **Deploy** - Test and deploy to production

## Support

For detailed information:
- **Features** - See README.md
- **Examples** - See EXAMPLES.md
- **Migration** - See MIGRATION_GUIDE.md
- **Architecture** - See PROJECT_STRUCTURE.md
- **Changes** - See CHANGELOG.md

## Tips & Tricks

### Keyboard Shortcuts
- Use Ctrl+Z/Y for undo/redo
- Use Ctrl+B/I/U for formatting
- Press Tab to indent lists

### Formatting
- Select text then click format button
- Use toolbar for quick formatting
- Paste content is automatically cleaned

### Media
- Drag images directly into editor
- Paste images from clipboard
- Support for YouTube, Vimeo, direct URLs

### Checklists
- Click checklist button to add item
- Click checkbox to mark complete
- Delete item by clearing text

## Performance Tips

1. **Limit undo levels** for large documents
2. **Debounce saves** to avoid excessive requests
3. **Use text content** for search operations
4. **Lazy load images** for better performance

## Customization

### Change Colors
```css
.lne-btn:hover {
    background: #your-color;
}
```

### Change Fonts
```css
.lne-editor {
    font-family: 'Your Font', sans-serif;
}
```

### Add Custom Styles
```css
.lne-editor blockquote {
    border-left: 4px solid #your-color;
}
```

## Common Issues

### Issue: Text color not changing
**Solution**: Use the font color picker in toolbar

### Issue: Undo not working
**Solution**: Make sure to use Ctrl+Z (not Cmd+Z on Mac)

### Issue: Video not embedding
**Solution**: Use direct URL or YouTube/Vimeo link

### Issue: Images not showing
**Solution**: Ensure images are properly uploaded and accessible

## Getting Help

1. Check documentation files
2. Review code examples
3. Check browser console for errors
4. Test in different browser
5. Clear browser cache

---

**Ready to use!** Start editing notes with LocalNotesEditor.

For more information, see the other documentation files in the localnoteseditor folder.
