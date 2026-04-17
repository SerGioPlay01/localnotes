# LocalNotesEditor — Changelog

## v1.1.0 (current)

### New Features
- **Text color sync** — toolbar color bar updates when cursor moves into colored text
- **Highlight color sync** — same for background color
- **Caret color sync** — `caret-color` updates to match current text color
- **Paragraph styles i18n** — Paragraph, Heading 1–6, Preformatted, Blockquote translated via `window.t()`
- **Font/size placeholder i18n** — Font and Size selects use translated placeholders
- **Select auto-width** — selects use `min-width`/`max-width` instead of fixed width, fits translated labels

### Fixes
- **History on new note** — `setContent()` now resets undo/redo stack; statusbar shows 0 on open
- **History removed from statusbar** — only Words and Characters shown
- **Editor modal full height** — flex layout fills modal, no empty space at bottom
- **Green border position** — `position: relative` on `.modal-content` fixes `::before` floating to page top
- **`t()` array crash** — translation function returns arrays as-is (months, weekdays)

### Improvements
- Toolbar color bars have smooth CSS transition
- Highlight bar shows dashed border when no color set
- `_colorBars()` correctly manages border on highlight bar

---

## v1.0.0 (initial release)

### Features
- Rich text formatting (bold, italic, underline, strikethrough)
- Font size and font family selection
- Ordered and unordered lists
- Interactive checklists with checkboxes
- Image insertion and drag-drop
- Video embedding (YouTube, Vimeo, direct URLs)
- Hyperlink creation
- Blockquotes and code blocks
- Text alignment
- Undo/redo with keyboard shortcuts
- Smart paste handling
- Word and character count statusbar
- Responsive design
- Dark mode support
- Find & Replace
- Emoji and special characters pickers
- Tables with context toolbar
- Floating selection toolbar
- Fullscreen mode
- i18n via `window.t(key)` with fallback

### Architecture
- Single class `LocalNotesEditor`
- No external dependencies
- Bootstrap Icons (bundled)
- CSS custom properties for theming
- Modular methods, easy to extend
