# Release Checklist — Local Notes v1.1.0

## ✅ Editor
- [x] Replaced TinyMCE with LocalNotesEditor (~15KB, no deps)
- [x] Text color & highlight color sync with cursor position
- [x] Caret color syncs with selected text color
- [x] Paragraph styles, font, size selects — all translated
- [x] Editor modal fills full height (flex layout, no empty space)
- [x] History reset on setContent (shows 0 on new note)
- [x] History counter removed from statusbar

## ✅ i18n — All 12 Languages
- [x] Calendar: Month, Week, Agenda, Today, No notes — translated
- [x] Decrypt Note modal — all strings translated
- [x] Note Settings modal — Tags, Due date, Color, Pin, New tag — translated
- [x] Calendar button in header — translated and updated on language switch
- [x] Due date badge in note footer — uses app locale for date formatting
- [x] Editor selects: Paragraph, Heading 1–6, Preformatted, Font, Size — translated
- [x] `t()` function handles arrays (months, weekdays) without crashing

## ✅ Tags & Calendar
- [x] Color tags with filtering
- [x] Due date with overdue/today/soon indicators
- [x] Calendar: month/week/agenda views
- [x] Calendar uses translated month names and weekday abbreviations
- [x] Note Settings modal fully translated

## ✅ Import UX
- [x] Loading overlay shown immediately after file selection
- [x] Overlay uses pure CSS spinner (no icon font dependency)
- [x] Format selection modal has slide-up animation
- [x] Encrypted files read lazily (one at a time, not all upfront)

## ✅ Responsive
- [x] Horizontal scroll for toolbar buttons on 769–1366px (tablets)
- [x] Editor modal: 98% width on 769–1024px, 96% on 1025–1366px
- [x] Editor select widths use min-width/max-width (auto-fit content)

## ✅ Service Worker
- [x] Version bumped to v1.1.0
- [x] Removed TinyMCE files from cache list
- [x] Added all current CSS/JS files to static cache
- [x] Added localnoteseditor/core.js and styles.css

## ✅ Bug Fixes
- [x] Green border on editor modal no longer floats to top of page (position: relative added)
- [x] `t('months')` no longer throws — t() returns arrays as-is
- [x] Calendar Today button translated
- [x] No notes in week view translated

## 🔄 Pre-Release
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari and Android Chrome
- [ ] Test PWA install flow
- [ ] Test import/export encrypted notes
- [ ] Test all 12 language versions
- [ ] Verify calendar on all three views
- [ ] Check offline mode after SW install
- [ ] Update version in manifest.json

## 📊 Performance Targets
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle < 1MB

## 🔒 Security
- [x] AES-256-GCM encryption
- [x] PBKDF2 key derivation (100,000 iterations)
- [x] Lockout after 5 failed decrypt attempts
- [x] CSP configured
- [x] XSS sanitization

## 🌐 Languages
- [x] EN, RU, UA, PL, CS, SK, BG, HR, SR, BS, MK, SL
- [x] Auto language detection from URL/browser
- [x] All new features translated in all 12 languages

---

**Status**: Ready for testing ✅
