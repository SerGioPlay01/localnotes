# LocalNotesEditor

A lightweight, feature-rich rich text editor built specifically for the Local Notes application. No external dependencies required.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Text Styling**: Font size and font family selection
- **Lists**: Ordered and unordered lists
- **Checklists**: Interactive checklist items with checkboxes
- **Media**: Insert images and videos (YouTube, Vimeo, direct URLs)
- **Links**: Create and manage hyperlinks
- **Blocks**: Blockquotes and code blocks
- **Alignment**: Left, center, and right text alignment
- **Undo/Redo**: Full undo/redo support with keyboard shortcuts
- **Paste Handling**: Smart paste with style cleanup
- **Drag & Drop**: Drop images directly into the editor
- **Status Bar**: Word and character count
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Automatic dark theme support
- **Bootstrap Icons**: Professional icon set
- **Montserrat Font**: Beautiful default typography

## Installation

1. Include the CSS file in your HTML:
```html
<link rel="stylesheet" href="localnoteseditor/styles.css">
```

2. Include the JavaScript file:
```html
<script src="localnoteseditor/core.js"></script>
```

## Usage

### Basic Setup

```html
<div id="editor"></div>

<script>
    const editor = new LocalNotesEditor('editor', {
        height: '500px',
        placeholder: 'Start typing...',
        toolbar: true,
        statusbar: true
    });
</script>
```

### Options

- `height` (string): Editor height (default: '400px')
- `placeholder` (string): Placeholder text (default: 'Enter text...')
- `toolbar` (boolean): Show toolbar (default: true)
- `statusbar` (boolean): Show status bar (default: true)

### API Methods

#### Getting Content
```javascript
// Get HTML content
const html = editor.getContent();

// Get plain text
const text = editor.getText();
```

#### Setting Content
```javascript
editor.setContent('<p>Hello <strong>World</strong></p>');
```

#### Clearing Content
```javascript
editor.clear();
```

#### Undo/Redo
```javascript
editor.undo();
editor.redo();
```

#### Inserting Elements
```javascript
// Insert checklist item
editor.insertChecklistItem();

// Insert image
editor.insertImage();

// Insert video
editor.insertVideo();

// Create link
editor.createLink();
```

#### Cleanup
```javascript
editor.destroy();
```

## Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y`: Redo
- `Ctrl+B` / `Cmd+B`: Bold
- `Ctrl+I` / `Cmd+I`: Italic
- `Ctrl+U` / `Cmd+U`: Underline

## Styling

The editor uses CSS custom properties for easy theming. Override these in your CSS:

```css
:root {
    --lne-primary-color: #0066cc;
    --lne-border-color: #ddd;
    --lne-background: #fff;
    --lne-text-color: #333;
}
```

## Typography

The editor uses **Montserrat** font by default for a modern, clean appearance. You can customize the font by modifying the CSS:

```css
.lne-wrapper,
.lne-editor {
    font-family: 'Your Font', sans-serif;
}
```

## Icons

The editor uses **Bootstrap Icons** for a professional, consistent icon set. Icons are automatically loaded from `/localnoteseditor/bootstrap-icons/`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight: ~15KB minified
- No external dependencies
- Efficient undo/redo with configurable history limit
- Optimized for mobile devices

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.
