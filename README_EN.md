# 📝 Local Notes

![Local Notes Screenshot](https://github.com/SerGioPlay01/localnotes/blob/main/sccc.png?raw=true)

[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)](https://github.com/SerGioPlay01/localnotes/releases)
[![Security](https://img.shields.io/badge/Security-AES--256%20Encrypted-blue.svg)](https://github.com/SerGioPlay01/localnotes)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple.svg)](https://github.com/SerGioPlay01/localnotes)
[![Offline](https://img.shields.io/badge/Offline-Supported-orange.svg)](https://github.com/SerGioPlay01/localnotes)
[![Languages](https://img.shields.io/badge/Languages-12-yellow.svg)](https://github.com/SerGioPlay01/localnotes)

### 🌍 Choose Language

[![EN](https://img.shields.io/badge/🇺🇸_English-blue)](https://localnotes-three.vercel.app/)
[![RU](https://img.shields.io/badge/🇷🇺_Русский-red)](https://localnotes-three.vercel.app/ru/)
[![UA](https://img.shields.io/badge/🇺🇦_Українська-yellow)](https://localnotes-three.vercel.app/ua/)
[![PL](https://img.shields.io/badge/🇵🇱_Polski-green)](https://localnotes-three.vercel.app/pl/)
[![CS](https://img.shields.io/badge/🇨🇿_Čeština-orange)](https://localnotes-three.vercel.app/cs/)
[![SK](https://img.shields.io/badge/🇸🇰_Slovenčina-pink)](https://localnotes-three.vercel.app/sk/)
[![BG](https://img.shields.io/badge/🇧🇬_Български-purple)](https://localnotes-three.vercel.app/bg/)
[![HR](https://img.shields.io/badge/🇭🇷_Hrvatski-lightblue)](https://localnotes-three.vercel.app/hr/)
[![SR](https://img.shields.io/badge/🇷🇸_Српски-darkred)](https://localnotes-three.vercel.app/sr/)
[![BS](https://img.shields.io/badge/🇧🇦_Bosanski-teal)](https://localnotes-three.vercel.app/bs/)
[![MK](https://img.shields.io/badge/🇲🇰_Македонски-gold)](https://localnotes-three.vercel.app/mk/)
[![SL](https://img.shields.io/badge/🇸🇮_Slovenščina-lime)](https://localnotes-three.vercel.app/sl/)

[![README EN](https://img.shields.io/badge/📖_README_English-blue)](README_EN.md)
[![README RU](https://img.shields.io/badge/📖_README_Русский-red)](README.md)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-brightgreen)](https://localnotes-three.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/SerGioPlay01/localnotes)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🎯 About

**Local Notes** is a modern, secure web application for creating and organizing notes directly in your browser. All data stays on your device — no server, no tracking.

### Key Features

- **🔒 AES-256 encryption** — military-grade data protection
- **🌍 12 languages** — full UI localization including all modals and buttons
- **📱 PWA** — install as a native app
- **⚡ LocalNotesEditor** — custom lightweight editor, no external dependencies
- **🏷️ Tags & colors** — organize notes by topic
- **� Calendar** — view notes by date (month / week / agenda)
- **🔐 Decrypt modal** — live password check with full i18n
- **🛡️ CSP, HTTPS, XSS protection**
- **🔄 Offline** — Service Worker caching

---

##  Features

### 📝 Editor (LocalNotesEditor)
- ~15KB, zero dependencies — replaced TinyMCE (was 500KB+)
- Rich formatting: headings, lists, tables, links, blockquotes, code blocks
- Media: images (drag & drop), videos (YouTube, Vimeo, direct URL)
- Interactive checklists, emoji picker, special characters
- Find & Replace, word/character count
- Text color & highlight with live caret color sync
- Paragraph styles, font family, font size — all translated
- Fullscreen mode, Undo/Redo (Ctrl+Z / Ctrl+Y)
- Quick Edit mode directly in the notes list

###  Tags & Organization
- Color tags — create, edit, delete with color picker
- Filter notes by tag
- Due date with overdue/today/soon visual indicators
- Note Settings modal — tags, due date, color, pin — fully translated

###  Calendar
- Three views: Month, Week, Agenda
- Navigation with Today button
- Notes linked to creation date and due date
- Full i18n: month names, weekday abbreviations, all labels

### 🔍 Search
- Instant search through note content
- Transliteration support (Cyrillic ↔ Latin)
- Grid and list view modes

### 💾 Export & Import
- Encrypted `.note` files (AES-256-GCM + PBKDF2)
- HTML and Markdown export/import
- Decrypt modal with live password validation — fully translated
- Loading overlay shown immediately after file selection

### 🛡️ Security
- AES-256-GCM with PBKDF2 (100,000 iterations)
- Lockout after 5 failed attempts
- All data local — nothing sent to server

---

##  Translation System

All 12 languages (EN, RU, UA, PL, CS, SK, BG, HR, SR, BS, MK, SL) have complete translations for:

- Main UI (buttons, titles, messages)
- Decrypt Note modal (title, password label, buttons, status messages)
- Calendar (Month/Week/Agenda buttons, Today, month names, weekdays)
- Note Settings modal (Tags, Due date, Color, Pin, New tag, Clear, Apply)
- Editor toolbar (paragraph styles, font, size selects)
- All policy pages

Translations live in `js/translations.js`, applied via `window.t(key)`.

---

## 🏗️ Architecture

### File Structure

```
localnotes/
├── index.html                    # Main page (EN)
├── manifest.json                 # PWA manifest
├── sw.js                         # Service Worker (v1.1.0)
├── robots.txt / sitemap.xml
│
├── css/
│   ├── index.css                 # Main styles
│   ├── editor-modal.css          # Editor modal (flex, full-height)
│   ├── tags-calendar.css         # Tags, calendar, decrypt modal
│   ├── img.css / preloader.css / highlight.css / print.css / page.css
│
├── js/
│   ├── index.js                  # App logic, import/export, note rendering
│   ├── translations.js           # 12 languages, 250+ keys
│   ├── translate.js              # Language detection & switching
│   ├── tags-calendar.js          # Tags system + calendar
│   ├── themes.js / utils.js / selectors.js
│   ├── performance.js / security.js
│   ├── editor-integration.js     # Editor init
│   ├── date-utils.js / img.js / preloader.js / magicurl.js / pwa.js
│
├── json/lang.json                # Static UI translations
│
├── localnoteseditor/
│   ├── core.js                   # Editor engine
│   ├── styles.css                # Editor styles
│   └── bootstrap-icons/
│
├── fonts/ favicon/ resources/
├── cookies_banner_universal/     # GDPR cookie banner
│
└── [lang]/                       # ru, ua, pl, cs, sk, bg, hr, sr, bs, mk, sl
    ├── index.html
    ├── privacy_policy.html
    ├── usage_policy.html
    └── cookie_policy.html
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS ES6+, HTML5, CSS3 |
| Editor | LocalNotesEditor (custom, no deps) |
| Storage | IndexedDB |
| Encryption | Web Crypto API (AES-256-GCM + PBKDF2) |
| PWA | Service Worker + Web App Manifest |
| Icons | Bootstrap Icons |

---

## 🚀 Quick Start

### Online
Visit [localnotes-three.vercel.app](https://localnotes-three.vercel.app/) — ready to use instantly.

### Local

```bash
git clone https://github.com/SerGioPlay01/localnotes.git
cd localnotes
python -m http.server 8000
# or: npx serve .
```

Open `http://localhost:8000`.

### Install as PWA
Click the install icon in Chrome/Edge address bar and confirm.

---

## 🆕 Changelog

### v1.1.0 (current)
- **LocalNotesEditor** — replaced TinyMCE: 97% smaller, 50× faster init
- **Tags system** — color tags, filtering, due dates
- **Calendar** — month/week/agenda views, full i18n
- **Full i18n** — Calendar, Decrypt modal, Note Settings, editor selects — all 12 languages
- **Import UX** — loading overlay on file select, animated format modal
- **Editor fixes** — text/highlight color sync with cursor position, caret color sync
- **Responsive** — horizontal scroll for toolbar buttons on tablets (769–1366px)
- **Editor modal** — flex layout, no empty space at bottom
- **Service Worker** — updated to v1.1.0, removed TinyMCE references

### v1.0.3
- Full Markdown import with images
- Performance monitoring (Core Web Vitals)
- Enhanced security (CSP, XSS)
- Added UA, BS, MK, SR languages

---

## ❓ FAQ

**Where are notes stored?**
Locally in IndexedDB. Nothing is ever sent to a server.

**How secure is the encryption?**
AES-256-GCM with PBKDF2 (100,000 iterations) — military standard.

**How to move notes to another browser?**
Export to `.note` file, then import in the new browser.

**How to add a new language?**
Add a language block in `js/translations.js`, create a `[lang]/` folder with HTML pages, add the language to `js/translate.js`.

**Does it work offline?**
Yes — Service Worker caches all resources after first load.

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Make changes and test
4. Open a Pull Request

Especially welcome: new language translations, accessibility improvements, tests.

---

##  License

MIT — see [LICENSE](LICENSE).

---

## 👨‍💻 Author

**SerGio Play** — [GitHub](https://github.com/SerGioPlay01) | [Website](https://sergioplay-dev.vercel.app/)

---

<div align="center">

**⭐ If you like the project, give it a star! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/SerGioPlay01/localnotes?style=social)](https://github.com/SerGioPlay01/localnotes)

**🌐 [Try Local Notes now!](https://localnotes-three.vercel.app/)**

</div>
