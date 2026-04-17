# LocalNotesEditor — Project Structure

## Directory

```
localnoteseditor/
├── core.js                  # Main editor engine
├── styles.css               # Editor styles
├── bootstrap-icons/         # Bundled icon font
├── README.md
├── CHANGELOG.md
├── QUICK_START.md
├── PROJECT_STRUCTURE.md     # This file
├── MIGRATION_GUIDE.md
├── IMPLEMENTATION_SUMMARY.md
├── INDEX.md
├── package.json
└── LICENSE
```

## core.js — Key Methods

| Method | Description |
|--------|-------------|
| `constructor(id, opts)` | Init editor in container |
| `init()` | Build DOM, toolbar, wire events, reset history |
| `setContent(html)` | Set content, reset undo stack |
| `getContent()` | Get HTML |
| `getText()` | Get plain text |
| `clear()` | Clear editor |
| `undo() / redo()` | History navigation |
| `insertImage()` | Open image modal |
| `insertVideo()` | Open video modal |
| `insertChecklistItem()` | Insert checklist |
| `destroy()` | Clean up |
| `_syncState()` | Sync toolbar state with cursor (colors, formats, selects) |
| `_colorBars()` | Update color bar elements + caret color |
| `_updateStatusbar()` | Update word/char count |
| `_saveSnap()` | Save undo snapshot |
| `_(key, fallback)` | i18n via `window.t()` |

## styles.css — Key Sections

| Selector | Purpose |
|----------|---------|
| `.lne-wrapper` | Outer container |
| `.lne-toolbar` | Toolbar background, padding |
| `.lne-toolbar-row` | Flex row of buttons/selects |
| `.lne-btn` | Toolbar button |
| `.lne-sel` | Dropdown select (auto-width) |
| `.lne-sel-heading` | Paragraph style select |
| `.lne-sel-font` | Font family select |
| `.lne-sel-size` | Font size select |
| `.lne-color-btn` | Color button with bar |
| `.lne-cbar` | Color indicator bar |
| `.lne-body` | Scrollable editor area |
| `.lne-editor` | Contenteditable element |
| `.lne-statusbar` | Word/char count bar |
| `@media (max-width: 768px)` | Mobile: scrollable toolbar |
| `@media (max-width: 480px)` | Small mobile |

## Integration Files

**`js/editor-integration.js`** — initializes `LocalNotesEditor` on page load, exposes `window.localNotesEditorInstance` and `window.localNotesEditorAPI`.

**`css/editor-modal.css`** — makes `.modal-content` a flex column so the editor fills all available height. Handles mobile (100dvh), tablet (94dvh / 92dvh) breakpoints.

## CSS Custom Properties Used

```css
--primary-color      /* accent / active color */
--border-color       /* borders */
--modal-bg           /* editor background */
--bg-secondary       /* toolbar background */
--text-color         /* text */
--text-secondary     /* muted text */
--button-hover       /* button hover bg */
```

## Performance

| Metric | Value |
|--------|-------|
| core.js | ~15KB minified |
| styles.css | ~8KB minified |
| Init time | ~10ms |
| Memory | ~2MB |
| Max undo levels | 300 |
