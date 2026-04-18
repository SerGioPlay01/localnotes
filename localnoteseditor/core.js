/**
 * LocalNotesEditor — Professional Rich Text Editor
 * Features: Full formatting, tables, media, code highlighting, 
 *   find/replace, word count, templates, emoji, special chars,
 *   drag-drop, floating toolbar on selection, history, i18n
 */
class LocalNotesEditor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error('Container "' + containerId + '" not found');
        this.options = {
            height: options.height || '500px',
            placeholder: options.placeholder || 'Start typing...',
            toolbar: options.toolbar !== false,
            statusbar: options.statusbar !== false,
            ...options
        };
        this.editorId = 'lne-' + Date.now();
        this.isDestroyed = false;
        this.undoStack = []; this.redoStack = [];
        this.maxUndo = 300; this.lastSnap = null;
        this.isRec = false; this._range = null;
        this._foreColor = '#e74c3c'; this._hiliteColor = '#f1c40f';
        this._findMatches = []; this._findIdx = 0;
        this.init();
    }

    _ (key, fb) {
        try { if (typeof t === 'function') { var v = t(key); return (v && v !== key) ? v : fb; } return fb; }
        catch (e) { return fb; }
    }

    init() {
        this._buildDOM();
        this._buildToolbar();
        this._wireEditor();
        // Start with clean history
        this.undoStack = []; this.redoStack = []; this.lastSnap = null;
        this._saveSnap();
    }

    // ── DOM ──────────────────────────────────────────────────────────────

    _buildDOM() {
        this.container.innerHTML =
            '<div class="lne-wrapper" id="' + this.editorId + '">' +
            (this.options.toolbar ? '<div class="lne-toolbar" role="toolbar"></div>' : '') +
            '<div class="lne-body">' +
            '<div class="lne-editor" contenteditable="true" role="textbox" aria-multiline="true" spellcheck="true" autocorrect="on"></div>' +
            '</div>' +
            (this.options.statusbar ? '<div class="lne-statusbar"></div>' : '') +
            '</div>';
        this.wrapper   = this.container.querySelector('.lne-wrapper');
        this.toolbar   = this.container.querySelector('.lne-toolbar');
        this.body      = this.container.querySelector('.lne-body');
        this.ed        = this.container.querySelector('.lne-editor');
        this.statusbar = this.container.querySelector('.lne-statusbar');
        this.ed.style.minHeight = this.options.height;
        this.ed.dataset.placeholder = this.options.placeholder;
    }

    // ── Toolbar ──────────────────────────────────────────────────────────

    _buildToolbar() {
        if (!this.toolbar) return;
        var _ = this._.bind(this);
        var B = function(cmd, icon, title, extra) {
            return '<button class="lne-btn" data-cmd="' + cmd + '" title="' + title + '"' + (extra||'') + '><i class="' + icon + '"></i></button>';
        };
        var SEP = '<div class="lne-sep"></div>';
        var GS = '<div class="lne-grp">'; var GE = '</div>';

        this.toolbar.innerHTML =
        /* Row 1 */
        '<div class="lne-toolbar-row">' +
        GS + B('undo','bi bi-arrow-counterclockwise',_('undo','Undo')+'  Ctrl+Z') + B('redo','bi bi-arrow-clockwise',_('redo','Redo')+'  Ctrl+Y') + GE + SEP +
        GS +
        '<select class="lne-sel lne-sel-heading" title="' + _('paragraphStyle','Style') + '">' +
        '<option value="">' + _('paragraphStyle','Style') + '</option>' +
        '<option value="p">' + _('paragraph','Paragraph') + '</option>' +
        '<option value="h1">' + _('heading1','Heading 1') + '</option><option value="h2">' + _('heading2','Heading 2') + '</option>' +
        '<option value="h3">' + _('heading3','Heading 3') + '</option><option value="h4">' + _('heading4','Heading 4') + '</option>' +
        '<option value="h5">' + _('heading5','Heading 5') + '</option><option value="h6">' + _('heading6','Heading 6') + '</option>' +
        '<option value="pre">' + _('preformatted','Preformatted') + '</option><option value="blockquote">' + _('blockquote','Blockquote') + '</option>' +
        '<option value="div">Div</option>' +
        '</select>' +
        '<select class="lne-sel lne-sel-font" title="' + _('fontFamily','Font') + '">' +
        '<option value="">' + _('fontFamily','Font') + '</option>' +
        '<option value="Montserrat,sans-serif">Montserrat</option>' +
        '<option value="Arial,sans-serif">Arial</option>' +
        '<option value="Times New Roman,serif">Times New Roman</option>' +
        '<option value="Courier New,monospace">Courier New</option>' +
        '<option value="Georgia,serif">Georgia</option>' +
        '<option value="Verdana,sans-serif">Verdana</option>' +
        '<option value="Roboto,sans-serif">Roboto</option>' +
        '<option value="Open Sans,sans-serif">Open Sans</option>' +
        '<option value="Lato,sans-serif">Lato</option>' +
        '<option value="Trebuchet MS,sans-serif">Trebuchet MS</option>' +
        '<option value="Impact,sans-serif">Impact</option>' +
        '</select>' +
        '<select class="lne-sel lne-sel-size" title="' + _('fontSize','Size') + '">' +
        '<option value="">' + _('fontSize','Size') + '</option>' +
        '<option value="8">8</option><option value="9">9</option><option value="10">10</option>' +
        '<option value="11">11</option><option value="12">12</option><option value="13">13</option>' +
        '<option value="14">14</option><option value="16">16</option><option value="18">18</option>' +
        '<option value="20">20</option><option value="22">22</option><option value="24">24</option>' +
        '<option value="26">26</option><option value="28">28</option><option value="32">32</option>' +
        '<option value="36">36</option><option value="40">40</option><option value="48">48</option>' +
        '<option value="60">60</option><option value="72">72</option><option value="96">96</option>' +
        '</select>' +
        GE + SEP +
        GS +
        B('bold','bi bi-type-bold',_('bold','Bold')+'  Ctrl+B') +
        B('italic','bi bi-type-italic',_('italic','Italic')+'  Ctrl+I') +
        B('underline','bi bi-type-underline',_('underline','Underline')+'  Ctrl+U') +
        B('strikeThrough','bi bi-type-strikethrough',_('strikethrough','Strikethrough')) +
        B('superscript','bi bi-superscript',_('superscript','Superscript')) +
        B('subscript','bi bi-subscript',_('subscript','Subscript')) +
        GE + SEP +
        GS +
        '<button class="lne-btn lne-color-btn" data-cmd="foreColor" title="' + _('textColor','Text color') + '"><i class="bi bi-fonts"></i><span class="lne-cbar lne-cbar-fg"></span></button>' +
        '<button class="lne-btn lne-color-btn" data-cmd="hiliteColor" title="' + _('highlightColor','Highlight') + '"><i class="bi bi-highlighter"></i><span class="lne-cbar lne-cbar-bg"></span></button>' +
        B('removeFormat','bi bi-eraser',_('clearFormat','Clear formatting')) +
        GE +
        '</div>' +

        /* Row 2 */
        '<div class="lne-toolbar-row">' +
        GS +
        B('justifyLeft','bi bi-text-left',_('alignLeft','Align left')+'  Ctrl+L') +
        B('justifyCenter','bi bi-text-center',_('alignCenter','Center')+'  Ctrl+E') +
        B('justifyRight','bi bi-text-right',_('alignRight','Align right')+'  Ctrl+R') +
        B('justifyFull','bi bi-justify',_('alignJustify','Justify')+'  Ctrl+J') +
        GE + SEP +
        GS +
        B('insertUnorderedList','bi bi-list-ul',_('bulletList','Bullet list')) +
        B('insertOrderedList','bi bi-list-ol',_('numberedList','Numbered list')) +
        B('insertChecklist','bi bi-check2-square',_('checklist','Checklist')) +
        B('indent','bi bi-text-indent-left',_('indent','Indent')) +
        B('outdent','bi bi-text-indent-right',_('outdent','Outdent')) +
        GE + SEP +
        GS +
        B('insertLink','bi bi-link-45deg',_('insertLink','Insert link')+'  Ctrl+K') +
        B('insertImage','bi bi-image',_('insertImage','Insert image')) +
        B('insertVideo','bi bi-play-circle',_('insertVideo','Insert video')) +
        B('insertTable','bi bi-table',_('createTable','Insert table')) +
        B('insertHorizontalRule','bi bi-dash-lg',_('horizontalLine','Horizontal rule')) +
        GE + SEP +
        GS +
        B('insertCode','bi bi-code-slash',_('codeBlock','Code block')) +
        B('insertBlockquote','bi bi-chat-quote',_('blockquote','Blockquote')) +
        B('insertEmoji','bi bi-emoji-smile',_('emoji','Emoji')) +
        B('insertSpecialChar','bi bi-alphabet',_('specialChars','Special characters')) +
        GE + SEP +
        GS +
        B('findReplace','bi bi-search',_('findReplace','Find & Replace')+'  Ctrl+H') +
        B('wordCount','bi bi-bar-chart-line',_('wordCount','Word count')) +
        B('fullscreen','bi bi-fullscreen',_('fullscreen','Fullscreen')+'  F11') +
        GE +
        '</div>';

        this._colorBars();
        this._wireToolbar();
    }

    _colorBars() {
        var fg = this.toolbar ? this.toolbar.querySelector('.lne-cbar-fg') : null;
        var bg = this.toolbar ? this.toolbar.querySelector('.lne-cbar-bg') : null;
        if (fg) fg.style.background = this._foreColor;
        if (bg) {
            bg.style.background = this._hiliteColor;
            bg.style.border = (this._hiliteColor && this._hiliteColor !== 'transparent' && this._hiliteColor !== 'rgba(0, 0, 0, 0)') ? '' : '1px dashed var(--border-color, #444)';
        }
        // Sync caret color with current text color
        if (this.ed) this.ed.style.caretColor = this._foreColor;
    }

    _wireToolbar() {
        var self = this;
        // Buttons
        this.toolbar.querySelectorAll('.lne-btn[data-cmd]').forEach(function(btn) {
            btn.addEventListener('mousedown', function(e) { e.preventDefault(); self._saveRange(); });
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                self._exec(btn.dataset.cmd, btn);
            });
        });
        // Selects
        var selH = this.toolbar.querySelector('.lne-sel-heading');
        var selF = this.toolbar.querySelector('.lne-sel-font');
        var selS = this.toolbar.querySelector('.lne-sel-size');
        if (selH) { selH.addEventListener('mousedown', function() { self._saveRange(); }); selH.addEventListener('change', function(e) { if (!e.target.value) return; self._restoreRange(); self._saveSnap(); document.execCommand('formatBlock', false, e.target.value); e.target.value = ''; self._syncState(); }); }
        if (selF) { selF.addEventListener('mousedown', function() { self._saveRange(); }); selF.addEventListener('change', function(e) { if (!e.target.value) return; self._restoreRange(); self._saveSnap(); document.execCommand('fontName', false, e.target.value); e.target.value = ''; var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (!isTouch) self.ed.focus(); }); }
        if (selS) { selS.addEventListener('mousedown', function() { self._saveRange(); }); selS.addEventListener('change', function(e) { if (!e.target.value) return; self._restoreRange(); self._applySize(e.target.value + 'px'); e.target.value = ''; var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (!isTouch) self.ed.focus(); }); }
    }

    _exec(cmd, btn) {
        this._restoreRange();
        // Commands that open a modal — don't refocus editor after
        var modalCmds = {
            insertLink:        function() { this._modalLink(); },
            insertImage:       function() { this._modalImage(); },
            insertVideo:       function() { this._modalVideo(); },
            insertTable:       function() { this._modalTable(); },
            insertEmoji:       function() { this._modalEmoji(); },
            insertSpecialChar: function() { this._modalSpecialChars(); },
            findReplace:       function() { this._modalFindReplace(); },
            wordCount:         function() { this._modalWordCount(); },
            foreColor:         function() { this._modalColor('foreColor', btn); },
            hiliteColor:       function() { this._modalColor('hiliteColor', btn); }
        };
        if (modalCmds[cmd]) { modalCmds[cmd].call(this); return; }
        // Non-modal commands
        var map = {
            undo:             function() { this.undo(); },
            redo:             function() { this.redo(); },
            insertChecklist:  function() { this._insertChecklist(); },
            insertCode:       function() { this._insertCodeBlock(); },
            insertBlockquote: function() { this._insertBlockquote(); },
            fullscreen:       function() { this._toggleFullscreen(); }
        };
        if (map[cmd]) { map[cmd].call(this); return; }
        this._saveSnap();
        document.execCommand(cmd, false, null);
        this._syncState();
        // On touch devices don't refocus — avoids keyboard popping up
        var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (!isTouchDevice) this.ed.focus();
    }

    // ── State sync ───────────────────────────────────────────────────────

    _syncState() {
        if (!this.toolbar) return;
        var self = this;
        var fmt = ['bold','italic','underline','strikeThrough','superscript','subscript',
                   'insertUnorderedList','insertOrderedList',
                   'justifyLeft','justifyCenter','justifyRight','justifyFull'];
        fmt.forEach(function(cmd) {
            var btn = self.toolbar.querySelector('[data-cmd="' + cmd + '"]');
            if (btn) { try { btn.classList.toggle('active', document.queryCommandState(cmd)); } catch(e){} }
        });
        // Heading
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            var node = sel.anchorNode;
            if (node && node.nodeType === 3) node = node.parentNode;
            // block element
            var blockTags = 'P,H1,H2,H3,H4,H5,H6,PRE,BLOCKQUOTE,DIV'.split(',');
            var headingSel = self.toolbar.querySelector('.lne-sel-heading');
            if (headingSel) {
                var cur = node;
                while (cur && cur !== self.ed) {
                    if (blockTags.indexOf(cur.tagName) !== -1) { headingSel.value = cur.tagName.toLowerCase(); break; }
                    cur = cur.parentNode;
                }
            }
            // Font / size from computed
            if (node && node.nodeType === 1) {
                var cs = window.getComputedStyle(node);
                var fSel = self.toolbar.querySelector('.lne-sel-font');
                if (fSel) {
                    var fam = cs.fontFamily.split(',')[0].replace(/['"]/g,'').trim();
                    var matched = false;
                    for (var i = 0; i < fSel.options.length; i++) {
                        var ov = fSel.options[i].value.split(',')[0].replace(/['"]/g,'').trim();
                        if (ov.toLowerCase() === fam.toLowerCase()) { fSel.value = fSel.options[i].value; matched = true; break; }
                    }
                    if (!matched) fSel.value = '';
                }
                var sSel = self.toolbar.querySelector('.lne-sel-size');
                if (sSel) {
                    var px = parseInt(cs.fontSize);
                    var sMatched = false;
                    for (var i = 0; i < sSel.options.length; i++) {
                        if (parseInt(sSel.options[i].value) === px) { sSel.value = sSel.options[i].value; sMatched = true; break; }
                    }
                    if (!sMatched) sSel.value = '';
                }
            }

            // Sync color bars — always, regardless of node type
            var fgBar = self.toolbar.querySelector('.lne-cbar-fg');
            var bgBar = self.toolbar.querySelector('.lne-cbar-bg');
            var colorNode = node;
            var foundFg = null, foundBg = null;
            while (colorNode && colorNode !== self.ed) {
                if (colorNode.style) {
                    if (colorNode.style.color && !foundFg) foundFg = colorNode.style.color;
                    var bc = colorNode.style.backgroundColor;
                    if (bc && bc !== 'rgba(0, 0, 0, 0)' && bc !== 'transparent' && !foundBg) foundBg = bc;
                }
                // <font color="..."> fallback (some browsers use this)
                if (!foundFg && colorNode.tagName === 'FONT' && colorNode.getAttribute('color')) {
                    foundFg = colorNode.getAttribute('color');
                }
                colorNode = colorNode.parentNode;
            }
            // If still no explicit color found, use getComputedStyle on the node
            if (!foundFg && node && node.nodeType === 1) {
                var cs2 = window.getComputedStyle(node);
                var cc = cs2.color;
                // Only use if it differs from the editor's default text color
                var edCs = window.getComputedStyle(self.ed);
                if (cc && cc !== edCs.color) foundFg = cc;
            }
            var defaultFg = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#e0e0e0';
            if (fgBar) fgBar.style.background = foundFg || defaultFg;
            if (bgBar) {
                bgBar.style.background = foundBg || 'transparent';
                bgBar.style.border = foundBg ? '' : '1px dashed var(--border-color, #444)';
            }
            // Update caret color to match current text color
            if (self.ed) self.ed.style.caretColor = foundFg || defaultFg;
        }
        this._updateStatusbar();
    }

    // ── Range ────────────────────────────────────────────────────────────

    _saveRange() {
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && this.ed.contains(sel.anchorNode))
            this._range = sel.getRangeAt(0).cloneRange();
    }

    _restoreRange() {
        if (!this._range) return;
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this._range);
    }

    _insertNode(node) {
        this._restoreRange();
        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) { this.ed.appendChild(node); return; }
        var r = sel.getRangeAt(0);
        r.deleteContents(); r.insertNode(node);
        r.setStartAfter(node); r.collapse(true);
        sel.removeAllRanges(); sel.addRange(r);
    }

    /* Insert a block-level element AFTER the current block (not inside <p>) */
    _insertBlockNode(node, focusInside) {
        this._restoreRange();
        var sel = window.getSelection();
        // Find direct child of editor that contains the cursor
        var anchor = sel && sel.anchorNode;
        if (anchor && anchor.nodeType === 3) anchor = anchor.parentNode;
        var blockEl = anchor;
        while (blockEl && blockEl.parentNode !== this.ed) {
            blockEl = blockEl.parentNode;
        }

        if (blockEl && blockEl !== this.ed) {
            this.ed.insertBefore(node, blockEl.nextSibling);
        } else {
            this.ed.appendChild(node);
        }

        // Add empty paragraph after the block for continued typing
        var p = document.createElement('p');
        p.innerHTML = '<br>';
        this.ed.insertBefore(p, node.nextSibling);

        // Focus: if focusInside is a specific element, use it;
        // otherwise look for first contenteditable inside the node
        var target = focusInside || node.querySelector('[contenteditable]');
        if (target) {
            target.focus();
            // Place cursor at start of the target
            var r = document.createRange();
            r.setStart(target, 0);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
        }
    }

    _insertHTML(html) {
        this._saveSnap();
        this._restoreRange();
        // execCommand strips iframes — use direct DOM insertion when html contains iframe/video
        if (/<iframe|<video/i.test(html)) {
            var sel = window.getSelection();
            if (sel && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.deleteContents();
                var tmp = document.createElement('div');
                tmp.innerHTML = html;
                var frag = document.createDocumentFragment();
                while (tmp.firstChild) frag.appendChild(tmp.firstChild);
                range.insertNode(frag);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                this.ed.insertAdjacentHTML('beforeend', html);
            }
        } else {
            document.execCommand('insertHTML', false, html);
        }
        this._syncState();
    }

    // ── Undo/Redo ────────────────────────────────────────────────────────

    // Браузер теряет src у iframe при innerHTML сериализации — сохраняем в data-src
    _snapEncode() {
        this.ed.querySelectorAll('iframe').forEach(function(f) {
            if (f.src && f.src !== 'about:blank') f.setAttribute('data-src', f.src);
        });
    }
    _snapDecode(container) {
        (container || this.ed).querySelectorAll('iframe[data-src]').forEach(function(f) {
            f.src = f.getAttribute('data-src');
        });
    }

    _saveSnap() {
        if (this.isRec) return;
        this._snapEncode();
        var s = { c: this.ed.innerHTML, t: Date.now() };
        if (this.lastSnap && this.lastSnap.c === s.c) return;
        this.undoStack.push(s);
        if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
        this.redoStack = []; this.lastSnap = s;
    }

    undo() {
        if (this.undoStack.length <= 1) return;
        this.isRec = true;
        this._snapEncode();
        this.redoStack.push({ c: this.ed.innerHTML, t: Date.now() });
        this.undoStack.pop();
        var p = this.undoStack[this.undoStack.length - 1];
        if (p) { this.ed.innerHTML = p.c; this._snapDecode(); this.lastSnap = p; }
        this.isRec = false; this._syncState();
    }

    redo() {
        if (!this.redoStack.length) return;
        this.isRec = true;
        var s = this.redoStack.pop();
        this.undoStack.push(s); this.ed.innerHTML = s.c; this._snapDecode(); this.lastSnap = s;
        this.isRec = false; this._syncState();
    }

    // ── Font size ────────────────────────────────────────────────────────

    _applySize(px) {
        this._saveSnap();
        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        var r = sel.getRangeAt(0);
        if (r.collapsed) {
            var sp = document.createElement('span');
            sp.style.fontSize = px; sp.innerHTML = '\u200B';
            r.insertNode(sp); r.setStart(sp.firstChild, 1); r.collapse(true);
            sel.removeAllRanges(); sel.addRange(r); return;
        }
        var sp = document.createElement('span');
        sp.style.fontSize = px;
        try { r.surroundContents(sp); }
        catch (e) { var f = r.extractContents(); sp.appendChild(f); r.insertNode(sp); }
        var nr = document.createRange();
        nr.selectNodeContents(sp); sel.removeAllRanges(); sel.addRange(nr);
    }

    // ── Editor wiring ────────────────────────────────────────────────────

    _wireEditor() {
        var self = this;
        this.ed.addEventListener('paste',     function(e) { self._onPaste(e); });
        this.ed.addEventListener('drop',      function(e) { self._onDrop(e); });
        this.ed.addEventListener('keydown',   function(e) { self._onKey(e); });
        this.ed.addEventListener('mouseup',   function() { self._saveRange(); self._syncState(); });
        this.ed.addEventListener('keyup',     function() { self._saveRange(); self._syncState(); });
        this.ed.addEventListener('click',     function() { self._saveRange(); self._syncState(); });
        this.ed.addEventListener('input',     function() { self._saveSnap(); self._updateStatusbar(); });
        this.ed.addEventListener('focus',     function() { if (!self.ed.innerHTML) self.ed.innerHTML = '<p><br></p>'; });
    }

    _onKey(e) {
        var c = e.key.toLowerCase();
        // Hide context toolbar on any keypress
        if (this._removeCtx) this._removeCtx();
        if (e.ctrlKey || e.metaKey) {
            if (!e.shiftKey && c === 'z') { e.preventDefault(); this.undo(); return; }
            if ((e.shiftKey && c === 'z') || c === 'y') { e.preventDefault(); this.redo(); return; }
            if (c === 'b') { e.preventDefault(); this._saveSnap(); document.execCommand('bold'); this._syncState(); return; }
            if (c === 'i') { e.preventDefault(); this._saveSnap(); document.execCommand('italic'); this._syncState(); return; }
            if (c === 'u') { e.preventDefault(); this._saveSnap(); document.execCommand('underline'); this._syncState(); return; }
            if (c === 'k') { e.preventDefault(); this._modalLink(); return; }
            if (c === 'h') { e.preventDefault(); this._modalFindReplace(); return; }
        }
        if (e.key === 'F11') { e.preventDefault(); this._toggleFullscreen(); return; }
        if (e.key === 'Enter' && !e.shiftKey) {
            var sel = window.getSelection();
            var n = sel && sel.anchorNode;
            if (n && n.nodeType === 3) n = n.parentNode;
            // Exit video-wrapper: insert <p> after it
            if (n && n.closest && n.closest('.lne-video-wrapper, .video-embed-wrapper')) {
                e.preventDefault();
                var vw = n.closest('.lne-video-wrapper, .video-embed-wrapper');
                var p = document.createElement('p');
                p.innerHTML = '<br>';
                vw.parentNode.insertBefore(p, vw.nextSibling);
                var range = document.createRange();
                range.setStart(p, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return;
            }
            // Enter before video-wrapper: insert <p> before it instead of inside
            if (n && n.closest) {
                var parentBlock = n.closest('p, div, h1, h2, h3, h4, h5, h6, li');
                if (parentBlock) {
                    var next = parentBlock.nextElementSibling;
                    if (next && (next.classList.contains('lne-video-wrapper') || next.classList.contains('video-embed-wrapper'))) {
                        // Normal Enter — browser handles it, just make sure ctx is gone
                        if (this._removeCtx) this._removeCtx();
                    }
                }
            }
            if (n && n.closest && n.closest('.checklist-item-wrapper')) { e.preventDefault(); this._insertChecklist(); return; }
        }
        // Backspace/Delete inside checklist item — remove wrapper if text is empty
        if (e.key === 'Backspace' || e.key === 'Delete') {
            var sel2 = window.getSelection();
            var n2 = sel2 && sel2.anchorNode;
            if (n2 && n2.nodeType === 3) n2 = n2.parentNode;
            var clWrapper = n2 && n2.closest && n2.closest('.checklist-item-wrapper');
            if (clWrapper) {
                var textSpan2 = clWrapper.querySelector('.checklist-text-content');
                var descArea2 = clWrapper.querySelector('.checklist-desc');
                var textEmpty = !textSpan2 || textSpan2.textContent.trim() === '';
                var descEmpty = !descArea2 || descArea2.textContent.trim() === '';
                if (textEmpty && descEmpty) {
                    e.preventDefault();
                    this._saveSnap();
                    var next2 = clWrapper.nextElementSibling || clWrapper.previousElementSibling;
                    clWrapper.remove();
                    if (next2) {
                        var focusTarget = next2.querySelector('.checklist-text-content') || next2;
                        var range2 = document.createRange();
                        range2.selectNodeContents(focusTarget);
                        range2.collapse(false);
                        sel2.removeAllRanges();
                        sel2.addRange(range2);
                    }
                    return;
                }
            }
        }
        // Tab inside editor → indent
        if (e.key === 'Tab') { e.preventDefault(); this._saveSnap(); document.execCommand(e.shiftKey ? 'outdent' : 'indent'); }
    }

    _onPaste(e) {
        e.preventDefault();
        this._saveSnap();
        var html = e.clipboardData.getData('text/html');
        var text = e.clipboardData.getData('text/plain');
        if (html) {
            var d = document.createElement('div'); d.innerHTML = html;
            d.querySelectorAll('[style]').forEach(function(el) {
                var s = el.style;
                var keep = { fontSize:s.fontSize, fontFamily:s.fontFamily, fontWeight:s.fontWeight,
                    fontStyle:s.fontStyle, textDecoration:s.textDecoration, textAlign:s.textAlign, color:s.color };
                el.removeAttribute('style');
                Object.keys(keep).forEach(function(k) { if (keep[k]) el.style[k] = keep[k]; });
            });
            d.querySelectorAll('[class]').forEach(function(el) {
                if (!/^(lne-|checklist)/.test(el.className)) el.removeAttribute('class');
            });
            ['script','style','meta','link'].forEach(function(tag) { d.querySelectorAll(tag).forEach(function(el) { el.remove(); }); });
            document.execCommand('insertHTML', false, d.innerHTML);
        } else if (text) {
            document.execCommand('insertHTML', false, text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'));
        }
        this._syncState();
    }

    _onDrop(e) {
        e.preventDefault();
        var self = this;
        Array.from(e.dataTransfer.files).forEach(function(file) {
            if (file.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.onload = function(ev) {
                    self._saveSnap();
                    self._insertHTML('<img src="' + ev.target.result + '" alt="' + file.name + '" style="max-width:100%;height:auto;">');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ── Checklist ────────────────────────────────────────────────────────

    _insertChecklist() {
        this._saveSnap();
        var wrapper = this._makeChecklistItem('');
        this._insertBlockNode(wrapper, wrapper.querySelector('.checklist-text-content'));
    }

    _makeChecklistItem(text, description, checked) {
        var self = this;
        var wrapper = document.createElement('div');
        wrapper.className = 'checklist-item-wrapper';
        if (description) wrapper.classList.add('checklist-has-desc');

        // Checkbox
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'checklist-checkbox-ios';
        cb.setAttribute('data-checked', checked ? 'true' : 'false');
        if (checked) cb.checked = true;

        // Main text
        var textSpan = document.createElement('span');
        textSpan.className = 'checklist-text-content checklist-text-ios';
        textSpan.contentEditable = 'true';
        textSpan.textContent = text || '';
        if (checked) textSpan.classList.add('checklist-done');

        // Add description button
        var addDescBtn = document.createElement('button');
        addDescBtn.className = 'checklist-add-desc';
        addDescBtn.contentEditable = 'false';
        addDescBtn.title = 'Add description';
        addDescBtn.innerHTML = '<i class="bi bi-text-wrap"></i>';

        // Description area (hidden by default if no description)
        var descWrap = document.createElement('div');
        descWrap.className = 'checklist-desc-wrap';
        if (description) descWrap.classList.add('checklist-desc-open');

        var descArea = document.createElement('div');
        descArea.className = 'checklist-desc';
        descArea.contentEditable = 'true';
        descArea.dataset.placeholder = 'Add description...';
        descArea.textContent = description || '';
        descWrap.appendChild(descArea);

        // Toggle description
        var toggleDescNew = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = descWrap.classList.toggle('checklist-desc-open');
            addDescBtn.classList.toggle('active', isOpen);
            if (isOpen) setTimeout(function() { descArea.focus(); }, 50);
        };
        addDescBtn.addEventListener('mousedown', toggleDescNew);
        addDescBtn.addEventListener('touchend', toggleDescNew, { passive: false });
        if (description) addDescBtn.classList.add('active');

        // Checkbox toggle — iOS Safari needs touchend fallback
        var toggleCheckNew = function() {
            cb.setAttribute('data-checked', cb.checked ? 'true' : 'false');
            textSpan.classList.toggle('checklist-done', cb.checked);
            wrapper.classList.toggle('checklist-item-done', cb.checked);
        };
        cb.addEventListener('change', toggleCheckNew);
        cb.addEventListener('touchend', function() {
            cb.checked = !cb.checked;
            toggleCheckNew();
        }, { passive: true });

        wrapper.appendChild(addDescBtn);  // ← dropdown arrow FIRST
        wrapper.appendChild(cb);
        wrapper.appendChild(textSpan);
        wrapper.appendChild(descWrap);
        return wrapper;
    }

    // ── Code block ───────────────────────────────────────────────────────

    _insertCodeBlock() {
        this._saveSnap();
        var sel = window.getSelection();
        var selected = (sel && !sel.isCollapsed) ? sel.toString() : '';
        var wrapper = this._makeCodeWrapper(selected || '// code here');
        // Make the code element editable (not pre, which causes issues)
        var code = wrapper.querySelector('code');
        if (code) code.contentEditable = 'true';
        this._insertBlockNode(wrapper, code || wrapper.querySelector('pre'));
    }

    _makeCodeWrapper(codeText, lang) {
        var wrapper = document.createElement('div');
        wrapper.className = 'lne-code-wrapper';

        var header = document.createElement('div');
        header.className = 'lne-code-header';
        header.contentEditable = 'false';

        var langSpan = document.createElement('span');
        langSpan.textContent = lang || 'code';

        var copyBtn = document.createElement('button');
        copyBtn.className = 'lne-copy-btn';
        copyBtn.contentEditable = 'false';
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> ' + (this._('copy','Copy'));
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var prEl = wrapper.querySelector('pre');
            var codeEl = prEl ? prEl.querySelector('code') : null;
            var text = codeEl ? (codeEl.innerText || codeEl.textContent) : (prEl ? (prEl.innerText || prEl.textContent) : '');
            var copyLabel = '<i class="bi bi-clipboard"></i> Copy';
            var copiedLabel = '<i class="bi bi-check-lg"></i> Copied!';
            var doFeedback = function() {
                copyBtn.innerHTML = copiedLabel;
                copyBtn.classList.add('copied');
                setTimeout(function() {
                    copyBtn.innerHTML = copyLabel;
                    copyBtn.classList.remove('copied');
                }, 2000);
            };
            navigator.clipboard.writeText(text).then(doFeedback).catch(function() {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                doFeedback();
            });
        });

        header.appendChild(langSpan);
        header.appendChild(copyBtn);

        var pre = document.createElement('pre');
        pre.className = 'lne-code';
        var code = document.createElement('code');
        code.textContent = codeText;
        pre.appendChild(code);

        wrapper.appendChild(header);
        wrapper.appendChild(pre);
        return wrapper;
    }

    // ── Blockquote ───────────────────────────────────────────────────────

    _insertBlockquote() {
        this._saveSnap();
        document.execCommand('formatBlock', false, 'blockquote');
        this._syncState();
    }

    // ── Fullscreen ───────────────────────────────────────────────────────

    _toggleFullscreen() {
        this.wrapper.classList.toggle('lne-fullscreen');
        var btn = this.toolbar ? this.toolbar.querySelector('[data-cmd="fullscreen"]') : null;
        if (btn) {
            var isFs = this.wrapper.classList.contains('lne-fullscreen');
            btn.classList.toggle('active', isFs);
            btn.querySelector('i').className = isFs ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen';
        }
    }

    // ── Modal factory ────────────────────────────────────────────────────

    _modal(title, icon, body, onOk, wide) {
        var self = this;
        var ov = document.createElement('div');
        ov.className = 'lne-modal-ov' + (wide ? ' lne-modal-wide' : '');
        ov.innerHTML =
            '<div class="lne-modal">' +
            '<div class="lne-mhd"><h3><i class="' + icon + '"></i> ' + title + '</h3>' +
            '<button class="lne-mclose"><i class="bi bi-x-lg"></i></button></div>' +
            '<div class="lne-mbody">' + body + '</div>' +
            '<div class="lne-mft">' +
            '<button class="lne-mbtn lne-mbtn-sec lne-mcancel"><i class="bi bi-x-lg"></i> ' + this._('cancel','Cancel') + '</button>' +
            '<button class="lne-mbtn lne-mbtn-pri lne-mok"><i class="bi bi-check-lg"></i> ' + this._('ok','OK') + '</button>' +
            '</div></div>';
        document.body.appendChild(ov);
        // Blur editor before modal opens — prevents iOS keyboard from staying open
        if (self.ed) self.ed.blur();
        if (document.activeElement && document.activeElement !== document.body) {
            document.activeElement.blur();
        }
        var modal = ov.querySelector('.lne-modal');
        var close = function() {
            if (window.visualViewport) window.visualViewport.removeEventListener('resize', onVpResize);
            if (ov.parentNode) document.body.removeChild(ov);
        };

        // ── visualViewport: push modal above keyboard on iOS/Android ──
        var onVpResize = function() {
            var vv = window.visualViewport;
            if (!vv || !modal) return;
            var keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
            if (keyboardHeight > 50) {
                // Keyboard is open — shift modal up
                modal.style.marginBottom = keyboardHeight + 'px';
                modal.style.maxHeight = (vv.height * 0.92) + 'px';
            } else {
                modal.style.marginBottom = '';
                modal.style.maxHeight = '';
            }
        };
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onVpResize);
        }
        ov.querySelector('.lne-mclose').addEventListener('click', close);
        ov.querySelector('.lne-mcancel').addEventListener('click', close);
        ov.addEventListener('click', function(e) { if (e.target === ov) close(); });
        ov.querySelector('.lne-mok').addEventListener('click', function() { onOk(ov, close); });
        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') { document.removeEventListener('keydown', esc); close(); }
        });
        // Auto-focus first input only on non-touch devices
        var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (!isTouchDevice) {
            setTimeout(function() { var inp = ov.querySelector('input,textarea'); if (inp) inp.focus(); }, 60);
        }

        // ── Swipe-down to close on touch devices ──────────────────────
        if (isTouchDevice) {
            var startY = 0;
            var currentY = 0;
            var isDragging = false;

            var onTouchStart = function(e) {
                startY = e.touches[0].clientY;
                currentY = startY;
                isDragging = true;
                modal.style.transition = 'none';
            };

            var onTouchMove = function(e) {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                var delta = currentY - startY;
                if (delta > 0) {
                    // Only allow downward drag
                    modal.style.transform = 'translateY(' + delta + 'px)';
                    modal.style.opacity = String(1 - delta / 300);
                    e.preventDefault();
                }
            };

            var onTouchEnd = function() {
                if (!isDragging) return;
                isDragging = false;
                var delta = currentY - startY;
                modal.style.transition = '';
                if (delta > 80) {
                    // Swiped down enough — close
                    modal.style.transform = 'translateY(100%)';
                    modal.style.opacity = '0';
                    setTimeout(close, 200);
                } else {
                    // Snap back
                    modal.style.transform = '';
                    modal.style.opacity = '';
                }
            };

            // Attach to header and the ::before handle area (top of modal)
            var header = ov.querySelector('.lne-mhd');
            if (header) {
                header.addEventListener('touchstart', onTouchStart, { passive: true });
                header.addEventListener('touchmove', onTouchMove, { passive: false });
                header.addEventListener('touchend', onTouchEnd, { passive: true });
            }
            // Also attach to top 40px of modal (covers ::before handle)
            modal.addEventListener('touchstart', function(e) {
                var rect = modal.getBoundingClientRect();
                if (e.touches[0].clientY - rect.top < 40) {
                    onTouchStart(e);
                }
            }, { passive: true });
            modal.addEventListener('touchmove', onTouchMove, { passive: false });
            modal.addEventListener('touchend', onTouchEnd, { passive: true });
        }

        return { ov: ov, close: close };
    }

    // ── Link modal ───────────────────────────────────────────────────────

    _modalLink() {
        var self = this;
        var sel = window.getSelection();
        var txt = (sel && !sel.isCollapsed) ? sel.toString() : '';
        var r = this._modal(this._('insertLink','Insert Link'), 'bi bi-link-45deg',
            '<div class="lne-fg"><label>' + this._('linkUrl','URL') + '</label>' +
            '<input type="url" id="lnk-url" class="lne-inp" placeholder="https://example.com"></div>' +
            '<div class="lne-fg"><label>' + this._('linkText','Text') + '</label>' +
            '<input type="text" id="lnk-txt" class="lne-inp" value="' + txt.replace(/"/g,'&quot;') + '"></div>' +
            '<div class="lne-fg"><label>' + this._('linkTitle','Title (tooltip)') + '</label>' +
            '<input type="text" id="lnk-ttl" class="lne-inp" placeholder="Optional"></div>' +
            '<div class="lne-row">' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('linkTarget','Open in') + '</label>' +
            '<select id="lnk-tgt" class="lne-inp"><option value="_blank">New tab</option><option value="_self">Same tab</option></select></div>' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('linkRel','Relation') + '</label>' +
            '<select id="lnk-rel" class="lne-inp"><option value="">None</option><option value="nofollow">nofollow</option><option value="noopener">noopener</option></select></div>' +
            '</div>',
        function(ov, close) {
            var url = ov.querySelector('#lnk-url').value.trim();
            if (!url) return;
            var text = ov.querySelector('#lnk-txt').value.trim() || url;
            var title = ov.querySelector('#lnk-ttl').value.trim();
            var tgt = ov.querySelector('#lnk-tgt').value;
            var rel = ov.querySelector('#lnk-rel').value;
            var attrs = ' href="' + url + '" target="' + tgt + '"';
            if (title) attrs += ' title="' + title + '"';
            if (rel) attrs += ' rel="' + rel + '"';
            self._insertHTML('<a' + attrs + '>' + text + '</a>');
            close();
        });
    }

    // ── Image modal ──────────────────────────────────────────────────────

    _modalImage() {
        var self = this;
        var r = this._modal(this._('insertImage','Insert Image'), 'bi bi-image',
            '<div class="lne-tabs">' +
            '<button class="lne-tab lne-tab-a" data-t="up"><i class="bi bi-cloud-upload"></i>' + this._('uploadFile','Upload') + '</button>' +
            '<button class="lne-tab" data-t="url"><i class="bi bi-link-45deg"></i>URL</button>' +
            '</div>' +
            '<div class="lne-tp" id="lne-tp-up">' +
            '<div class="lne-dropzone" id="lne-imgdrop"><i class="bi bi-cloud-upload"></i><p>' + this._('dropImage','Drop image here or click') + '</p><input type="file" id="lne-imgfile" accept="image/*" style="position:absolute;opacity:0;inset:0;cursor:pointer;"></div></div>' +
            '<div class="lne-tp" id="lne-tp-url" style="display:none"><div class="lne-fg"><label>URL</label><input type="url" id="lne-imgurl" class="lne-inp" placeholder="https://example.com/image.jpg"></div></div>' +
            '<div class="lne-fg"><label>' + this._('altText','Alt text') + '</label><input type="text" id="lne-imgalt" class="lne-inp"></div>' +
            '<div class="lne-row">' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('imageWidth','Width') + '</label><input type="text" id="lne-imgw" class="lne-inp" placeholder="auto"></div>' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('alignment','Alignment') + '</label>' +
            '<select id="lne-imgalign" class="lne-inp"><option value="">None</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>' +
            '</div>' +
            '<div class="lne-fg"><label>' + this._('imageBorderRadius','Border radius') + '</label><input type="text" id="lne-imgbr" class="lne-inp" placeholder="4px"></div>',
        function(ov, close) {
            var alt = ov.querySelector('#lne-imgalt').value.trim();
            var w   = ov.querySelector('#lne-imgw').value.trim() || '100%';
            var align = ov.querySelector('#lne-imgalign').value;
            var br  = ov.querySelector('#lne-imgbr').value.trim() || '4px';
            var style = 'max-width:' + w + ';height:auto;border-radius:' + br + ';';
            if (align === 'center') style += 'display:block;margin:8px auto;';
            else if (align === 'left') style += 'float:left;margin:0 12px 8px 0;';
            else if (align === 'right') style += 'float:right;margin:0 0 8px 12px;';
            else style += 'display:block;margin:8px 0;';

            var isUp = ov.querySelector('#lne-tp-up').style.display !== 'none';
            var ins = function(src) {
                self._insertHTML('<img src="' + src + '" alt="' + alt + '" style="' + style + '">');
                close();
            };
            var fi = ov.querySelector('#lne-imgfile');
            if (isUp && fi.files[0]) {
                var rd = new FileReader(); rd.onload = function(ev) { ins(ev.target.result); }; rd.readAsDataURL(fi.files[0]);
            } else {
                var url = ov.querySelector('#lne-imgurl').value.trim();
                if (url) ins(url);
            }
        });
        // Tab switching
        setTimeout(function() {
            r.ov.querySelectorAll('.lne-tab').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    r.ov.querySelectorAll('.lne-tab').forEach(function(b) { b.classList.remove('lne-tab-a'); });
                    btn.classList.add('lne-tab-a');
                    r.ov.querySelectorAll('.lne-tp').forEach(function(p) { p.style.display='none'; });
                    r.ov.querySelector('#lne-tp-' + btn.dataset.t).style.display = '';
                });
            });
            // Dropzone click
            var dz = r.ov.querySelector('#lne-imgdrop');
            dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('drag-over'); });
            dz.addEventListener('dragleave', function() { dz.classList.remove('drag-over'); });
            dz.addEventListener('drop', function(e) {
                e.preventDefault(); dz.classList.remove('drag-over');
                var f = e.dataTransfer.files[0];
                if (f && f.type.startsWith('image/')) { r.ov.querySelector('#lne-imgfile').files; dz.querySelector('p').textContent = f.name; }
            });
            r.ov.querySelector('#lne-imgfile').addEventListener('change', function(e) {
                if (e.target.files[0]) dz.querySelector('p').textContent = e.target.files[0].name;
            });
        }, 0);
    }

    // ── Video modal ──────────────────────────────────────────────────────

    _modalVideo() {
        var self = this;
        var r = this._modal(this._('videoInsert','Insert Video'), 'bi bi-play-circle',
            '<div class="lne-tabs">' +
            '<button class="lne-tab lne-tab-a" data-t="plat"><i class="bi bi-globe"></i>' + this._('videoPlatform','Platform') + '</button>' +
            '<button class="lne-tab" data-t="dir"><i class="bi bi-link-45deg"></i>' + this._('videoDirectLink','Direct link') + '</button>' +
            '<button class="lne-tab" data-t="ifr"><i class="bi bi-code-slash"></i>' + this._('videoCustomIframe','Custom iframe') + '</button>' +
            '</div>' +
            /* Platform */
            '<div class="lne-tp" id="lne-tp-plat">' +
            '<div class="lne-fg"><label>' + this._('videoPlatformSelect','Platform') + '</label>' +
            '<select id="lne-vplat" class="lne-inp"><option value="youtube">YouTube</option><option value="rutube">Rutube</option><option value="vk">VK Video</option><option value="vimeo">Vimeo</option><option value="dailymotion">Dailymotion</option><option value="twitch">Twitch</option></select></div>' +
            '<div class="lne-fg"><label>' + this._('videoUrl','Video URL') + '</label><input type="url" id="lne-vurl" class="lne-inp" placeholder="https://www.youtube.com/watch?v=..."></div>' +
            '<div class="lne-fg"><label>' + this._('videoPlaybackSettings','Playback') + '</label>' +
            '<div class="lne-checks">' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vauto"><span>' + this._('videoAutoplay','Autoplay') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vloop"><span>' + this._('videoLoop','Loop') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vmute"><span>' + this._('videoMute','Mute') + '</span></label>' +
            '</div></div>' +
            '<div id="lne-vprev" style="display:none;margin-top:8px;border-radius:6px;overflow:hidden;background:#000;max-height:160px;"></div>' +
            '</div>' +
            /* Direct */
            '<div class="lne-tp" id="lne-tp-dir" style="display:none">' +
            '<div class="lne-fg"><label>' + this._('videoDirectUrl','Direct URL (mp4/webm/ogg)') + '</label><input type="url" id="lne-vdir" class="lne-inp" placeholder="https://example.com/video.mp4"></div>' +
            '<div class="lne-row">' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('videoWidth','Width') + '</label><input type="number" id="lne-vdw" class="lne-inp" value="560"></div>' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('videoHeight','Height') + '</label><input type="number" id="lne-vdh" class="lne-inp" value="315"></div></div>' +
            '<div class="lne-checks">' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vdauto"><span>' + this._('videoAutoplay','Autoplay') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vdloop"><span>' + this._('videoLoop','Loop') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-vdmute"><span>' + this._('videoMute','Mute') + '</span></label>' +
            '</div></div>' +
            /* Custom iframe */
            '<div class="lne-tp" id="lne-tp-ifr" style="display:none">' +
            '<div class="lne-fg"><label>' + this._('videoIframeCode','Embed / iframe code') + '</label>' +
            '<textarea id="lne-vifr" class="lne-inp" rows="4" style="font-family:monospace;font-size:12px;resize:vertical;" placeholder="<iframe src=\'...\'>"></textarea></div>' +
            '<p class="lne-hint">' + this._('videoIframeHint','Paste any embed code — it will be inserted as-is.') + '</p></div>',
        function(ov, close) {
            var active = ov.querySelector('.lne-tab-a').dataset.t;
            if (active === 'plat') {
                var url = ov.querySelector('#lne-vurl').value.trim(); if (!url) return;
                var embed = self._buildEmbed(url, ov.querySelector('#lne-vplat').value,
                    ov.querySelector('#lne-vauto').checked ? 1:0,
                    ov.querySelector('#lne-vloop').checked ? 1:0,
                    ov.querySelector('#lne-vmute').checked ? 1:0);
                if (embed) { self._insertHTML('<div class="lne-video-wrapper" style="' + self._arStyle(embed) + '">' + embed + '</div>'); close(); }
            } else if (active === 'dir') {
                var dUrl = ov.querySelector('#lne-vdir').value.trim(); if (!dUrl) return;
                var vw = ov.querySelector('#lne-vdw').value || '560', vh = ov.querySelector('#lne-vdh').value || '315';
                var ap = ov.querySelector('#lne-vdauto').checked, lp = ov.querySelector('#lne-vdloop').checked, mu = ov.querySelector('#lne-vdmute').checked;
                var videoHtml = '<video width="' + vw + '" height="' + vh + '" controls style="max-width:100%"' +
                    (ap?' autoplay':'') + (lp?' loop':'') + (mu?' muted':'') + '><source src="' + dUrl + '"></video>';
                self._insertHTML('<div class="lne-video-wrapper" style="aspect-ratio:' + vw + '/' + vh + ';max-width:' + vw + 'px">' + videoHtml + '</div>');
                close();
            } else {
                var code = ov.querySelector('#lne-vifr').value.trim(); if (!code) return;
                self._insertHTML('<div class="lne-video-wrapper" style="' + self._arStyle(code) + '">' + code + '</div>'); close();
            }
        }, true);

        // Wire tabs + live preview
        setTimeout(function() {
            r.ov.querySelectorAll('.lne-tab').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    r.ov.querySelectorAll('.lne-tab').forEach(function(b) { b.classList.remove('lne-tab-a'); });
                    btn.classList.add('lne-tab-a');
                    r.ov.querySelectorAll('.lne-tp').forEach(function(p) { p.style.display='none'; });
                    r.ov.querySelector('#lne-tp-' + btn.dataset.t).style.display = '';
                });
            });
            var urlI = r.ov.querySelector('#lne-vurl');
            var platI = r.ov.querySelector('#lne-vplat');
            var prev = r.ov.querySelector('#lne-vprev');
            function updPrev() {
                var url = urlI.value.trim();
                if (!url) { prev.style.display='none'; prev.innerHTML=''; return; }
                var embed = self._buildEmbed(url, platI.value, 0, 0, 0);
                if (embed) {
                    prev.innerHTML = embed; prev.style.display='';
                    var el = prev.querySelector('iframe,video');
                    if (el) { el.style.width='100%'; el.style.height='155px'; el.style.pointerEvents='none'; }
                } else { prev.innerHTML=''; prev.style.display='none'; }
            }
            urlI.addEventListener('input', updPrev);
            platI.addEventListener('change', function() {
                var ph = {
                    youtube: 'https://www.youtube.com/watch?v=...',
                    rutube: 'https://rutube.ru/video/...',
                    vk: 'https://vkvideo.ru/video-123_456 или live.vkvideo.ru/channel',
                    vimeo: 'https://vimeo.com/...',
                    dailymotion: 'https://www.dailymotion.com/video/...',
                    twitch: 'https://www.twitch.tv/channel или /videos/123456'
                };
                urlI.placeholder = ph[platI.value] || 'https://...';
                updPrev();
            });
        }, 0);
    }

    // Вычисляет aspect-ratio и max-width из width/height атрибутов iframe/video в html-строке
    _arStyle(html) {
        var w = html.match(/width=["']?(\d+)/i);
        var h = html.match(/height=["']?(\d+)/i);
        if (w && h) {
            return 'aspect-ratio:' + w[1] + '/' + h[1] + ';max-width:' + w[1] + 'px';
        }
        return 'aspect-ratio:16/9';
    }

    _buildEmbed(url, platform, ap, lp, mu) {
        var yt = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/)|youtu\.be\/)([^&?\s#]+)/);
        if (yt) {
            var p = 'rel=0&modestbranding=1' + (ap?'&autoplay=1':'') + (mu?'&mute=1':'') + (lp?'&loop=1&playlist='+yt[1]:'');
            return '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + yt[1] + '?' + p + '" frameborder="0" allowfullscreen allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"></iframe>';
        }
        var ru = url.match(/rutube\.ru\/video\/([a-f0-9]+)/);
        if (ru) return '<iframe width="560" height="315" src="https://rutube.ru/play/embed/' + ru[1] + '" frameborder="0" allowfullscreen></iframe>';
        var vi = url.match(/vimeo\.com\/(\d+)/);
        if (vi) { var vp=(ap?'autoplay=1':'')+(mu?'&muted=1':'')+(lp?'&loop=1':''); return '<iframe src="https://player.vimeo.com/video/'+vi[1]+(vp?'?'+vp:'')+'" width="560" height="315" frameborder="0" allowfullscreen></iframe>'; }
        var dm = url.match(/dailymotion\.com\/video\/([a-z0-9]+)/i);
        if (dm) return '<iframe src="https://www.dailymotion.com/embed/video/' + dm[1] + '" width="560" height="315" frameborder="0" allowfullscreen></iframe>';

        // Twitch VOD: twitch.tv/videos/123456
        var twV = url.match(/twitch\.tv\/videos\/(\d+)/);
        if (twV) return '<iframe src="https://player.twitch.tv/?video=v' + twV[1] + '&parent=' + window.location.hostname + (ap?'&autoplay=true':'&autoplay=false') + (mu?'&muted=true':'') + '" width="560" height="315" frameborder="0" allowfullscreen allow="autoplay"></iframe>';
        // Twitch clip: clips.twitch.tv/SlugName or twitch.tv/channel/clip/SlugName
        var twCl = url.match(/clips\.twitch\.tv\/([^/?#]+)/) || url.match(/twitch\.tv\/[^/]+\/clip\/([^/?#]+)/);
        if (twCl) return '<iframe src="https://clips.twitch.tv/embed?clip=' + twCl[1] + '&parent=' + window.location.hostname + '" width="560" height="315" frameborder="0" allowfullscreen allow="autoplay"></iframe>';
        // Twitch live channel: twitch.tv/channelname
        var twC = url.match(/twitch\.tv\/([^/?#]+)/);
        if (twC) return '<iframe src="https://player.twitch.tv/?channel=' + twC[1] + '&parent=' + window.location.hostname + (ap?'&autoplay=true':'&autoplay=false') + (mu?'&muted=true':'') + '" width="560" height="315" frameborder="0" allowfullscreen allow="autoplay"></iframe>';

        // VK Video / VK Live — поддержка vk.com, vkvideo.ru, vk.ru
        // Форматы: vk.com/video-123_456, vkvideo.ru/video-123_456, vk.com/video?z=video-123_456
        var vkM = url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/video(-?\d+_\d+)/) ||
                  url.match(/(?:vk\.com|vkvideo\.ru|vk\.ru)\/video\?z=video(-?\d+_\d+)/);
        if (vkM) {
            var parts = vkM[1].split('_');
            return '<iframe src="https://vkvideo.ru/video_ext.php?oid=' + parts[0] + '&id=' + parts[1] + '&hd=2' + (ap?'&autoplay=1':'') + '" width="560" height="315" frameborder="0" allowfullscreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>';
        }
        // VK Live stream: vk.com/live или vkvideo.ru/live (трансляции сообществ/пользователей)
        var vkLive = url.match(/(?:vk\.com|vkvideo\.ru)\/(?:live\?z=video|live\/)(-?\d+_\d+)/) ||
                     url.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+_\d+).*live/);
        if (vkLive) {
            var lparts = vkLive[1].split('_');
            return '<iframe src="https://vkvideo.ru/video_ext.php?oid=' + lparts[0] + '&id=' + lparts[1] + '&hd=2' + (ap?'&autoplay=1':'') + '" width="560" height="315" frameborder="0" allowfullscreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>';
        }
        // live.vkvideo.ru/channelname — VK Live стриминговая платформа
        // embed URL: https://live.vkvideo.ru/app/embed/{channelname}
        var vkLiveCh = url.match(/live\.vkvideo\.ru\/(?!app\/)([^/?#]+)/);
        if (vkLiveCh) {
            return '<iframe src="https://live.vkvideo.ru/app/embed/' + vkLiveCh[1] + '" width="620" height="378" frameborder="0" allowfullscreen scrolling="no" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>';
        }

        if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return '<video width="560" height="315" controls' + (ap?' autoplay':'') + (mu?' muted':'') + (lp?' loop':'') + ' style="max-width:100%"><source src="' + url + '"></video>';
        return null;
    }

    // ── Table modal ──────────────────────────────────────────────────────

    _modalTable() {
        var self = this;
        var r = this._modal(this._('createTable','Insert Table'), 'bi bi-table',
            '<div class="lne-row">' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('numberOfRows','Rows') + '</label><input type="number" id="lne-trows" class="lne-inp" value="3" min="1" max="30"></div>' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('numberOfColumns','Columns') + '</label><input type="number" id="lne-tcols" class="lne-inp" value="3" min="1" max="15"></div>' +
            '</div>' +
            '<div class="lne-checks">' +
            '<label class="lne-chk"><input type="checkbox" id="lne-thdr" checked><span>' + this._('tableHeaderRow','Header row') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-tzebra"><span>' + this._('tableZebra','Zebra striping') + '</span></label>' +
            '</div>' +
            '<div class="lne-fg"><label>' + this._('tableWidth','Width') + '</label>' +
            '<select id="lne-twid" class="lne-inp"><option value="100%">Full width (100%)</option><option value="auto">Auto</option><option value="50%">50%</option><option value="75%">75%</option></select></div>',
        function(ov, close) {
            var rows = parseInt(ov.querySelector('#lne-trows').value)||3;
            var cols = parseInt(ov.querySelector('#lne-tcols').value)||3;
            var hdr = ov.querySelector('#lne-thdr').checked;
            var zebra = ov.querySelector('#lne-tzebra').checked;
            var wid = ov.querySelector('#lne-twid').value;
            var hdLbl = self._('tableHeader','Header');
            var html = '<table style="border-collapse:collapse;width:' + wid + ';margin:12px 0;">';
            if (hdr) {
                html += '<thead><tr>';
                for (var c=0;c<cols;c++) html += '<th style="border:1px solid var(--border-color,#272727);padding:8px 12px;background:var(--bg-secondary,#111);font-weight:600;">' + hdLbl + ' ' + (c+1) + '</th>';
                html += '</tr></thead>';
            }
            html += '<tbody>';
            for (var row=0;row<rows;row++) {
                var rowStyle = (zebra && row%2===1) ? 'background:rgba(255,255,255,0.03);' : '';
                html += '<tr style="' + rowStyle + '">';
                for (var c=0;c<cols;c++) html += '<td style="border:1px solid var(--border-color,#272727);padding:8px 12px;">&nbsp;</td>';
                html += '</tr>';
            }
            html += '</tbody></table><p><br></p>';
            self._insertHTML(html);
            self._initContextToolbars();
            close();
        });
    }

    // ── Color modal ──────────────────────────────────────────────────────

    _modalColor(cmd, btn) {
        var self = this;
        var colors = ['#000000','#434343','#666666','#999999','#b7b7b7','#cccccc','#d9d9d9','#ffffff',
            '#ff0000','#ff4500','#ff9900','#ffff00','#00ff00','#00ffff','#4a86e8','#0000ff',
            '#9900ff','#ff00ff','#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db',
            '#9b59b6','#34495e','#aefc6e','#28a745','#007bff','#dc3545','#ffc107','#17a2b8',
            '#ffffff00'];
        var swatches = colors.map(function(c) {
            return c === '#ffffff00'
                ? '<button class="lne-sw lne-sw-none" data-c="none" title="Remove color"><i class="bi bi-x-lg"></i></button>'
                : '<button class="lne-sw" data-c="' + c + '" style="background:' + c + '" title="' + c + '"></button>';
        }).join('');
        var title = cmd === 'foreColor' ? this._('textColor','Text color') : this._('highlightColor','Highlight color');
        var icon  = cmd === 'foreColor' ? 'bi bi-fonts' : 'bi bi-highlighter';
        var r = this._modal(title, icon,
            '<div class="lne-swgrid">' + swatches + '</div>' +
            '<div class="lne-row" style="margin-top:10px;align-items:center;gap:8px;">' +
            '<label style="font-size:12px;color:var(--text-secondary);">' + this._('customColor','Custom:') + '</label>' +
            '<input type="color" id="lne-cpick" value="' + (cmd==='foreColor'?this._foreColor:this._hiliteColor) + '" style="width:36px;height:30px;padding:2px;border:1px solid var(--border-color);border-radius:4px;background:transparent;cursor:pointer;">' +
            '<button class="lne-mbtn lne-mbtn-pri" id="lne-capply" style="padding:5px 12px;font-size:13px;">' + this._('apply','Apply') + '</button>' +
            '</div>', function() {});
        // Hide default OK
        r.ov.querySelector('.lne-mok').style.display = 'none';
        var apply = function(color) {
            self._restoreRange(); self._saveSnap();
            if (color === 'none') { document.execCommand(cmd, false, cmd==='foreColor'?'inherit':'rgba(0,0,0,0)'); }
            else { document.execCommand(cmd, false, color); if (cmd==='foreColor') self._foreColor=color; else self._hiliteColor=color; self._colorBars(); }
            r.close(); self._syncState();
        };
        r.ov.querySelectorAll('.lne-sw').forEach(function(sw) { sw.addEventListener('click', function() { apply(sw.dataset.c); }); });
        r.ov.querySelector('#lne-capply').addEventListener('click', function() { apply(r.ov.querySelector('#lne-cpick').value); });
    }

    // ── Emoji modal ──────────────────────────────────────────────────────

    _modalEmoji() {
        var self = this;
        var categories = {
            '😀 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
            '👍 Gestures': ['👍','👎','👊','✊','🤛','🤜','🤞','✌️','🤘','👌','🤏','👈','👉','👆','👇','☝️','👋','🤚','🖐️','✋','🖖','👏','🙌','🤲','🙏','✍️','💪','🦾','🦶','👂','🦻','👃','🦷','🦴','👀','👁️','👅','👄','💋','👶','👦','👧','👨','👩','🧓','👴','👵'],
            '❤️ Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎'],
            '🎉 Celebrate': ['🎉','🎊','🎈','🎁','🎀','🎗️','🎟️','🎫','🎖️','🏆','🥇','🥈','🥉','🎆','🎇','✨','🌟','⭐','🌠','🎑','🧨','🎃','🎄','🎋','🎍','🎎','🎏','🎐','🎠','🎡','🎢','🎪','🤹','🎭','🎨','🖼️','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻'],
            '🌍 Nature': ['🌍','🌎','🌏','🌐','🌱','🌿','🍀','🌲','🌳','🌴','🌵','🌾','🌺','🌸','🌼','🌻','🌷','🌹','🥀','💐','🍁','🍂','🍃','☀️','🌤️','⛅','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','🌊','🌀','🌈','🌂','☂️','🌡️','⛱️','⚡','🔥','💧','🌊','🦁','🐯','🐻','🐼','🐨','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿️','🦔'],
            '🍕 Food': ['🍕','🍔','🍟','🌭','🍿','🧂','🥓','🥚','🍳','🧇','🥞','🧈','🍞','🥐','🥨','🥯','🧀','🥗','🥘','🍲','🍛','🍜','🍝','🍠','🥟','🍱','🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍩','🍪','🌰','🥜','🍯','🍼','🥛','☕','🍵','🧃','🥤','🧋','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽️','🥢','🧆','🥙','🧇','🥗','🥫'],
            '⚡ Symbols': ['⚡','🔥','💧','⭐','🌟','✨','💥','❄️','🌈','☀️','🌙','⚙️','🔑','🗝️','🔒','🔓','💡','🔔','🔕','🎵','🎶','🎼','📌','📍','✅','❌','❓','❗','💯','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔲','🔳','▪️','▫️','◾','◽','◼️','◻️','⬛','⬜','🔈','🔉','🔊','📢','📣','🔇','🔔','🔕','📳','📴','📵','📶','📳','🚫','⛔','📛','🔞','🔃','🔄','🔙','🔚','🔛','🔜','🔝','🛐','⚛️','🉑','☑️','✔️','✖️','🔱','📛','🔰','♻️','✅','🈴','🈺','🈷️','✴️','🆚','💟','🆘','❎','🆔','🆕','🆙','🆒','🆓','🆖','🅰️','🅱️','🆎','🆑','🅾️','🆗','🅿️','🆙','🆒']
        };
        var tabs = '', panels = '';
        var first = true;
        Object.keys(categories).forEach(function(cat) {
            var id = cat.replace(/[^a-z]/gi,'');
            tabs += '<button class="lne-etab' + (first?' lne-etab-a':'') + '" data-ep="' + id + '">' + cat + '</button>';
            panels += '<div class="lne-epanel' + (first?'':' lne-ehide') + '" id="lne-ep-' + id + '">' +
                categories[cat].map(function(em) { return '<button class="lne-em" data-em="' + em + '">' + em + '</button>'; }).join('') + '</div>';
            first = false;
        });
        var r = this._modal(this._('emoji','Emoji'), 'bi bi-emoji-smile',
            '<div class="lne-etabs">' + tabs + '</div>' +
            '<div class="lne-epanels">' + panels + '</div>', function() {}, true);
        r.ov.querySelector('.lne-mok').style.display = 'none';
        r.ov.querySelectorAll('.lne-em').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self._saveSnap(); self._restoreRange();
                document.execCommand('insertHTML', false, btn.dataset.em);
                r.close();
            });
        });
        r.ov.querySelectorAll('.lne-etab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                r.ov.querySelectorAll('.lne-etab').forEach(function(t) { t.classList.remove('lne-etab-a'); });
                r.ov.querySelectorAll('.lne-epanel').forEach(function(p) { p.classList.add('lne-ehide'); });
                tab.classList.add('lne-etab-a');
                r.ov.querySelector('#lne-ep-' + tab.dataset.ep).classList.remove('lne-ehide');
            });
        });
    }

    // ── Special chars ────────────────────────────────────────────────────

    _modalSpecialChars() {
        var self = this;
        var chars = ['©','®','™','€','£','¥','¢','₽','₴','§','¶','†','‡','•','…','‰','′','″','‴',
            '←','→','↑','↓','↔','↕','⇒','⇔','⟹','⟺','∞','≈','≠','≤','≥','±','×','÷','√','∑',
            'π','Ω','μ','α','β','γ','δ','ε','ζ','θ','λ','σ','φ','ψ','ω',
            'À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ð','Ñ',
            '½','¼','¾','⅓','⅔','⅛','⅜','⅝','⅞',
            '★','☆','♥','♦','♣','♠','♪','♫','☑','☒','✓','✗','✘','⌘','⌥','⌃','⇧'];
        var grid = chars.map(function(c) {
            return '<button class="lne-sc" title="' + c + '">' + c + '</button>';
        }).join('');
        var r = this._modal(this._('specialChars','Special Characters'), 'bi bi-alphabet',
            '<div class="lne-scgrid">' + grid + '</div>', function() {}, true);
        r.ov.querySelector('.lne-mok').style.display = 'none';
        r.ov.querySelectorAll('.lne-sc').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self._saveSnap(); self._restoreRange();
                document.execCommand('insertHTML', false, btn.textContent);
                r.close();
            });
        });
    }

    // ── Find & Replace ───────────────────────────────────────────────────

    _modalFindReplace() {
        var self = this;
        var r = this._modal(this._('findReplace','Find & Replace'), 'bi bi-search',
            '<div class="lne-fg"><label>' + this._('findText','Find') + '</label>' +
            '<div class="lne-row" style="gap:6px;">' +
            '<input type="text" id="lne-find" class="lne-inp" style="flex:1;" placeholder="' + this._('findText','Search text') + '">' +
            '<button class="lne-mbtn lne-mbtn-sec" id="lne-findprev" title="Previous"><i class="bi bi-arrow-up"></i></button>' +
            '<button class="lne-mbtn lne-mbtn-sec" id="lne-findnext" title="Next"><i class="bi bi-arrow-down"></i></button>' +
            '</div></div>' +
            '<div class="lne-fg" style="font-size:12px;color:var(--text-muted);" id="lne-findinfo"></div>' +
            '<div class="lne-fg"><label>' + this._('replaceWith','Replace with') + '</label>' +
            '<input type="text" id="lne-repl" class="lne-inp" placeholder="' + this._('replaceWith','Replacement') + '"></div>' +
            '<div class="lne-checks">' +
            '<label class="lne-chk"><input type="checkbox" id="lne-fcase"><span>' + this._('caseSensitive','Case sensitive') + '</span></label>' +
            '<label class="lne-chk"><input type="checkbox" id="lne-fword"><span>' + this._('wholeWord','Whole word') + '</span></label>' +
            '</div>',
        function(ov, close) {
            // Replace current match
            var find = ov.querySelector('#lne-find').value;
            var repl = ov.querySelector('#lne-repl').value;
            if (!find) return;
            var flags = ov.querySelector('#lne-fcase').checked ? 'g' : 'gi';
            var pattern = ov.querySelector('#lne-fword').checked ? '\\b' + find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b' : find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
            var re = new RegExp(pattern, flags);
            self._saveSnap();
            self.ed.innerHTML = self.ed.innerHTML.replace(re, repl);
            self._syncState(); close();
        });
        // Live search highlight
        var findI = r.ov.querySelector('#lne-find');
        var info = r.ov.querySelector('#lne-findinfo');
        var caseI = r.ov.querySelector('#lne-fcase');
        var wordI = r.ov.querySelector('#lne-fword');
        var highlight = function() {
            self.ed.querySelectorAll('.lne-find-mark').forEach(function(el) {
                var p = el.parentNode; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el); p.normalize();
            });
            var q = findI.value; if (!q) { info.textContent = ''; return; }
            var flags = caseI.checked ? 'g' : 'gi';
            var re = new RegExp((wordI.checked ? '\\b' : '') + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + (wordI.checked ? '\\b' : ''), flags);
            var count = 0;
            var walk = function(node) {
                if (node.nodeType === 3) {
                    var m = node.textContent.match(re);
                    if (m) {
                        var frag = document.createDocumentFragment();
                        var last = 0, text = node.textContent, match;
                        re.lastIndex = 0;
                        while ((match = re.exec(text)) !== null) {
                            if (match.index > last) frag.appendChild(document.createTextNode(text.slice(last, match.index)));
                            var mark = document.createElement('mark'); mark.className='lne-find-mark'; mark.textContent = match[0]; frag.appendChild(mark);
                            last = match.index + match[0].length; count++;
                        }
                        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
                        node.parentNode.replaceChild(frag, node);
                    }
                } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                    Array.from(node.childNodes).forEach(walk);
                }
            };
            walk(self.ed);
            info.textContent = count + ' ' + (count === 1 ? 'match' : 'matches');
        };
        findI.addEventListener('input', highlight);
        caseI.addEventListener('change', highlight);
        wordI.addEventListener('change', highlight);
        r.ov.querySelector('#lne-findnext').addEventListener('click', function() {
            var marks = r.ov.ownerDocument.querySelectorAll('.lne-find-mark');
            // Re-focus next mark
            var all = self.ed.querySelectorAll('.lne-find-mark'); if (!all.length) return;
            var cur = self.ed.querySelector('.lne-find-mark.lne-find-cur');
            var idx = cur ? (Array.from(all).indexOf(cur) + 1) % all.length : 0;
            all.forEach(function(m) { m.classList.remove('lne-find-cur'); });
            all[idx].classList.add('lne-find-cur');
            all[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
        r.ov.querySelector('#lne-findprev').addEventListener('click', function() {
            var all = self.ed.querySelectorAll('.lne-find-mark'); if (!all.length) return;
            var cur = self.ed.querySelector('.lne-find-mark.lne-find-cur');
            var idx = cur ? (Array.from(all).indexOf(cur) - 1 + all.length) % all.length : all.length - 1;
            all.forEach(function(m) { m.classList.remove('lne-find-cur'); });
            all[idx].classList.add('lne-find-cur');
            all[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
        // Cleanup marks on close
        var origClose = r.close;
        r.close = function() {
            self.ed.querySelectorAll('.lne-find-mark').forEach(function(el) {
                var p = el.parentNode; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el); p.normalize();
            });
            origClose();
        };
    }

    // ── Word count modal ─────────────────────────────────────────────────

    _modalWordCount() {
        var text  = this.ed.innerText || '';
        var html  = this.ed.innerHTML || '';
        var words = text.trim() ? text.trim().split(/\s+/).length : 0;
        var chars = text.length;
        var noSp  = text.replace(/\s/g,'').length;
        var lines = text.split('\n').length;
        var imgs  = this.ed.querySelectorAll('img').length;
        var links = this.ed.querySelectorAll('a').length;
        var bytes = new Blob([html]).size;
        this._modal(this._('wordCount','Statistics'), 'bi bi-bar-chart-line',
            '<table class="lne-stat-table">' +
            '<tr><td>' + this._('words','Words') + '</td><td><strong>' + words + '</strong></td></tr>' +
            '<tr><td>' + this._('characters','Characters') + '</td><td><strong>' + chars + '</strong></td></tr>' +
            '<tr><td>' + this._('charsNoSpaces','Characters (no spaces)') + '</td><td><strong>' + noSp + '</strong></td></tr>' +
            '<tr><td>' + this._('lines','Lines') + '</td><td><strong>' + lines + '</strong></td></tr>' +
            '<tr><td>' + this._('images','Images') + '</td><td><strong>' + imgs + '</strong></td></tr>' +
            '<tr><td>' + this._('links','Links') + '</td><td><strong>' + links + '</strong></td></tr>' +
            '<tr><td>HTML size</td><td><strong>' + (bytes > 1024 ? Math.round(bytes/1024) + ' KB' : bytes + ' B') + '</strong></td></tr>' +
            '</table>', function(ov, close) { close(); });
    }

    // ── Statusbar ────────────────────────────────────────────────────────

    _updateStatusbar() {
        if (!this.statusbar) return;
        var raw  = this.ed.innerText || '';
        var text = raw.replace(/\u200B/g, '').trim();
        var words = text.length ? text.split(/\s+/).filter(function(w){ return w.length > 0; }).length : 0;
        var chars = text.length;
        this.statusbar.innerHTML =
            '<span>' + this._('words','Words') + ': <b>' + words + '</b></span>' +
            '<span>' + this._('characters','Chars') + ': <b>' + chars + '</b></span>';
    }

    // ── Make checklists interactive after setContent ──────────────────

    _initChecklists() {
        var self = this;
        this.ed.querySelectorAll('.checklist-item-wrapper').forEach(function(wrapper) {
            if (wrapper.dataset.clBound) return;
            wrapper.dataset.clBound = '1';

            var cb       = wrapper.querySelector('.checklist-checkbox-ios');
            var textSpan = wrapper.querySelector('.checklist-text-content');
            var descWrap = wrapper.querySelector('.checklist-desc-wrap');
            var descArea = wrapper.querySelector('.checklist-desc');
            var addDescBtn = wrapper.querySelector('.checklist-add-desc');

            if (!cb) return;

            // Restore checked state
            if (cb.getAttribute('data-checked') === 'true') {
                cb.checked = true;
                if (textSpan) textSpan.classList.add('checklist-done');
                wrapper.classList.add('checklist-item-done');
            }

            // If no add-desc button, add it (legacy items)
            if (!addDescBtn && textSpan) {
                addDescBtn = document.createElement('button');
                addDescBtn.className = 'checklist-add-desc';
                addDescBtn.contentEditable = 'false';
                addDescBtn.title = 'Add description';
                addDescBtn.innerHTML = '<i class="bi bi-text-wrap"></i>';
                // Insert BEFORE checkbox
                wrapper.insertBefore(addDescBtn, cb);
            }

            // If no desc wrap, add it (legacy items)
            if (!descWrap) {
                descWrap = document.createElement('div');
                descWrap.className = 'checklist-desc-wrap';
                descArea = document.createElement('div');
                descArea.className = 'checklist-desc';
                descArea.contentEditable = 'true';
                descArea.dataset.placeholder = 'Add description...';
                descWrap.appendChild(descArea);
                wrapper.appendChild(descWrap);
            }

            // Wire add-desc button
            if (addDescBtn) {
                // Check if already open
                if (descArea && descArea.textContent.trim()) {
                    descWrap.classList.add('checklist-desc-open');
                    addDescBtn.classList.add('active');
                    wrapper.classList.add('checklist-has-desc');
                }
                var toggleDesc = function(e) {
                    e.preventDefault(); e.stopPropagation();
                    var isOpen = descWrap.classList.toggle('checklist-desc-open');
                    addDescBtn.classList.toggle('active', isOpen);
                    wrapper.classList.toggle('checklist-has-desc', isOpen);
                    if (isOpen && descArea) setTimeout(function() { descArea.focus(); }, 50);
                };
                addDescBtn.addEventListener('mousedown', toggleDesc);
                addDescBtn.addEventListener('touchend', toggleDesc, { passive: false });
            }

            // Wire checkbox — iOS Safari needs touchend fallback
            var toggleCheck = function() {
                cb.setAttribute('data-checked', cb.checked ? 'true' : 'false');
                if (textSpan) textSpan.classList.toggle('checklist-done', cb.checked);
                wrapper.classList.toggle('checklist-item-done', cb.checked);
            };
            cb.addEventListener('change', toggleCheck);
            // iOS Safari sometimes doesn't fire 'change' on contentEditable parent
            cb.addEventListener('touchend', function(e) {
                // Only toggle if the touch didn't move (tap)
                cb.checked = !cb.checked;
                toggleCheck();
            }, { passive: true });
        });
    }

    // ── Restore code block copy buttons ──────────────────────────────

    _initCodeBlocks() {
        var self = this;
        this.ed.querySelectorAll('pre, .lne-code').forEach(function(pre) {
            if (pre.closest('.lne-code-wrapper')) return;
            var wrapper = self._makeCodeWrapper('');
            var newPre = wrapper.querySelector('pre');
            // Move original pre content into the wrapper's pre
            newPre.innerHTML = pre.innerHTML;
            newPre.contentEditable = 'true';
            newPre.className = pre.className || 'lne-code';
            pre.parentNode.replaceChild(wrapper, pre);
        });
    }

    // ── Context toolbars for images, tables, videos ───────────────────

    _initContextToolbars() {
        var self = this;

        // Состояние — на экземпляре, чтобы все вызовы _initContextToolbars
        // работали с одним и тем же hoverTimer/activeBar
        if (!this._ctxHoverTimer) this._ctxHoverTimer = null;
        if (!this._ctxActiveBar)  this._ctxActiveBar  = null;

        var removeCtx = function() {
            clearTimeout(self._ctxHoverTimer);
            if (self._ctxActiveBar && self._ctxActiveBar.parentNode)
                self._ctxActiveBar.parentNode.removeChild(self._ctxActiveBar);
            self._ctxActiveBar = null;
        };
        // Сохраняем removeCtx на экземпляре для вызова извне
        this._removeCtx = removeCtx;

        // Close bar when clicking outside — attach once per editor instance
        // NOTE: не вешаем на touchend — это ломает таблицы (тулбар открывается с задержкой)
        if (!this._ctxDocListener) {
            this._ctxDocListener = true; // просто маркер что уже инициализировано
        }

        var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        var bindHoverCtx = function(el, showFn) {
            // Снимаем старый флаг — перепривязываем при каждом _initAll
            // но используем _lneHandler чтобы не дублировать
            if (el._lneCtxBound) return;
            el._lneCtxBound = true;

            if (!isTouchDevice) {
                el.addEventListener('mouseenter', function() {
                    clearTimeout(self._ctxHoverTimer);
                    self._ctxHoverTimer = setTimeout(function() {
                        removeCtx();
                        self._ctxActiveBar = showFn(el);
                        if (self._ctxActiveBar) {
                            self._ctxActiveBar.addEventListener('mouseenter', function() {
                                clearTimeout(self._ctxHoverTimer);
                            });
                            self._ctxActiveBar.addEventListener('mouseleave', function() {
                                self._ctxHoverTimer = setTimeout(removeCtx, 350);
                            });
                        }
                    }, 180);
                });
                el.addEventListener('mouseleave', function() {
                    self._ctxHoverTimer = setTimeout(removeCtx, 350);
                });
            }

            // Click / tap
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                clearTimeout(self._ctxHoverTimer);
                if (self._ctxActiveBar && self._ctxActiveBar._forEl === el) { removeCtx(); return; }
                removeCtx();
                self._ctxActiveBar = showFn(el);
                if (self._ctxActiveBar) {
                    self._ctxActiveBar._forEl = el;
                    if (!isTouchDevice) {
                        self._ctxActiveBar.addEventListener('mouseenter', function() { clearTimeout(self._ctxHoverTimer); });
                        self._ctxActiveBar.addEventListener('mouseleave', function() { self._ctxHoverTimer = setTimeout(removeCtx, 350); });
                    }
                }
            });

            // Тач: ловим touchend на элементе (img, video-wrapper, code-wrapper и т.д.)
            if (isTouchDevice) {
                el.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    clearTimeout(self._ctxHoverTimer);
                    if (self._ctxActiveBar && self._ctxActiveBar._forEl === el) { removeCtx(); return; }
                    removeCtx();
                    self._ctxActiveBar = showFn(el);
                    if (self._ctxActiveBar) self._ctxActiveBar._forEl = el;
                }, { passive: false });
            }
        };

        // IMAGE
        this.ed.querySelectorAll('img').forEach(function(img) {
            bindHoverCtx(img, function(el) { return self._showImageCtx(el); });
        });

        // TABLE — показываем тулбар только по клику на ячейку, не по hover
        this.ed.querySelectorAll('table').forEach(function(table) {
            if (table._lneCtxBound) return;
            table._lneCtxBound = true;

            var handleTableActivate = function(e) {
                var cell = e.target.closest('td, th');
                if (!cell) return;
                e.stopPropagation();
                clearTimeout(self._ctxHoverTimer);
                if (self._ctxActiveBar && self._ctxActiveBar._forEl === cell) {
                    removeCtx();
                    return;
                }
                removeCtx();
                self._ctxActiveBar = self._showTableCtx(table, cell);
                if (self._ctxActiveBar) {
                    self._ctxActiveBar._forEl = cell;
                    if (!isTouchDevice) {
                        self._ctxActiveBar.addEventListener('mouseenter', function() { clearTimeout(self._ctxHoverTimer); });
                        self._ctxActiveBar.addEventListener('mouseleave', function() { self._ctxHoverTimer = setTimeout(removeCtx, 350); });
                    }
                }
            };

            table.addEventListener('click', handleTableActivate);
        });

        // VIDEO
        this.ed.querySelectorAll('.lne-video-wrapper, .video-embed-wrapper').forEach(function(vw) {
            // ── Touch overlay: remove all duplicates first ──
            var isTouchOnly = isTouchDevice && !window.matchMedia('(pointer: fine)').matches;
            vw.querySelectorAll('.lne-video-touch-overlay').forEach(function(ov) {
                ov.parentNode.removeChild(ov);
            });
            vw._lneTouchOverlay = null;

            if (isTouchOnly) {
                var iframe = vw.querySelector('iframe');
                if (iframe) {
                    var overlay = document.createElement('div');
                    overlay.className = 'lne-video-touch-overlay';
                    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:3;cursor:pointer;';
                    if (getComputedStyle(vw).position === 'static') vw.style.position = 'relative';
                    vw.appendChild(overlay);
                    vw._lneTouchOverlay = overlay;

                    overlay.addEventListener('touchend', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        clearTimeout(self._ctxHoverTimer);
                        if (self._ctxActiveBar && self._ctxActiveBar._forEl === vw) {
                            removeCtx();
                            return;
                        }
                        removeCtx();
                        self._ctxActiveBar = self._showVideoCtx(vw);
                        if (self._ctxActiveBar) self._ctxActiveBar._forEl = vw;
                    }, { passive: false });
                }
            }
            bindHoverCtx(vw, function(el) { return self._showVideoCtx(el); });
        });

        // CODE BLOCK
        this.ed.querySelectorAll('.lne-code-wrapper').forEach(function(cw) {
            bindHoverCtx(cw, function(el) { return self._showCodeCtx(el); });
        });

        // Click outside → remove (вешаем один раз на экземпляр)
        if (!this._ctxDocClickBound) {
            this._ctxDocClickBound = true;
            // Bubble фаза — stopPropagation из обработчиков элементов работает
            document.addEventListener('click', function(e) {
                if (self._ctxActiveBar && !self._ctxActiveBar.contains(e.target)) {
                    clearTimeout(self._ctxHoverTimer);
                    if (self._removeCtx) self._removeCtx();
                }
            }, false);
        }
    }

    _ctxBar(items) {
        var bar = document.createElement('div');
        bar.className = 'lne-ctx-toolbar-float';
        items.forEach(function(item) {
            var btn = document.createElement('button');
            btn.className = 'lne-ctx-btn';
            btn.innerHTML = '<i class="' + item.icon + '"></i>';
            btn.title = item.label;
            var handler = function(e) { e.preventDefault(); e.stopPropagation(); item.action(); };
            btn.addEventListener('mousedown', handler);
            // Touch devices: use touchend so buttons respond to taps
            btn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                item.action();
            }, { passive: false });
            bar.appendChild(btn);
        });
        return bar;
    }

    _positionCtx(bar, el) {
        bar.style.visibility = 'hidden';
        bar.style.width = 'fit-content';
        document.body.appendChild(bar);
        var rect = el.getBoundingClientRect();
        var isMobile = window.innerWidth <= 768;

        if (isMobile) {
            bar.style.position = 'fixed';
            bar.style.zIndex = '99999';
            var bh = bar.offsetHeight || 44;
            var top = rect.top - bh - 6;
            if (top < 4) top = rect.bottom + 6;
            if (top + bh > window.innerHeight) top = Math.max(4, window.innerHeight - bh - 4);
            bar.style.top = top + 'px';
            var bw = bar.offsetWidth || 80;
            var left = rect.left;
            if (left + bw > window.innerWidth) left = window.innerWidth - bw - 8;
            if (left < 4) left = 4;
            bar.style.left = left + 'px';
        } else {
            var scrollY = window.scrollY || document.documentElement.scrollTop;
            var scrollX = window.scrollX || document.documentElement.scrollLeft;
            bar.style.position = 'absolute';
            var bh = bar.offsetHeight || 0;
            var bw = bar.offsetWidth || 0;
            bar.style.top  = (rect.top + scrollY - bh - 6) + 'px';
            bar.style.left = (rect.left + scrollX) + 'px';
            if (rect.left + bw > window.innerWidth) bar.style.left = (window.innerWidth - bw - 8 + scrollX) + 'px';
            if (rect.top - bh < 0) bar.style.top = (rect.bottom + scrollY + 6) + 'px';
        }
        bar.style.visibility = '';
    }

    _showImageCtx(img) {
        var self = this;
        var bar = this._ctxBar([
            {
                icon: 'bi bi-pencil', label: this._('imageWidth','Edit image'),
                action: function() { if (self._removeCtx) self._removeCtx(); self._modalImageEdit(img); }
            },
            {
                icon: 'bi bi-text-left', label: this._('alignLeft','Align left'),
                action: function() { self._saveSnap(); img.style.cssText = 'max-width:100%;height:auto;float:left;margin:4px 14px 8px 0;display:block;border-radius:' + (img.style.borderRadius||'4px'); }
            },
            {
                icon: 'bi bi-text-center', label: this._('alignCenter','Center'),
                action: function() { self._saveSnap(); img.style.cssText = 'max-width:100%;height:auto;display:block;margin:10px auto;border-radius:' + (img.style.borderRadius||'4px'); }
            },
            {
                icon: 'bi bi-text-right', label: this._('alignRight','Align right'),
                action: function() { self._saveSnap(); img.style.cssText = 'max-width:100%;height:auto;float:right;margin:4px 0 8px 14px;display:block;border-radius:' + (img.style.borderRadius||'4px'); }
            },
            {
                icon: 'bi bi-image', label: this._('insertImage','Replace'),
                action: function() { self._showImageCtxReplace(img); }
            },
            {
                icon: 'bi bi-trash', label: this._('delete','Delete'),
                action: function() { self._saveSnap(); img.remove(); self._syncState(); }
            }
        ]);
        this._positionCtx(bar, img);
        return bar;
    }

    _modalImageEdit(img) {
        var self = this;
        // Read current values from the element
        var cs = window.getComputedStyle(img);
        var curW = img.style.maxWidth || img.getAttribute('width') || '100%';
        var curBR = img.style.borderRadius || '4px';
        var curAlt = img.getAttribute('alt') || '';
        var curAlign = img.style.float === 'left' ? 'left'
                     : img.style.float === 'right' ? 'right'
                     : (img.style.margin || '').includes('auto') ? 'center' : '';

        this._modal(this._('insertImage','Edit Image'), 'bi bi-image',
            '<div class="lne-fg"><label>' + this._('imageWidth','Width') + '</label>' +
            '<input type="text" id="lne-ei-w" class="lne-inp" value="' + curW + '" placeholder="100%, 400px, auto"></div>' +
            '<div class="lne-fg"><label>' + this._('imageBorderRadius','Border radius') + '</label>' +
            '<input type="text" id="lne-ei-br" class="lne-inp" value="' + curBR + '" placeholder="4px, 50%"></div>' +
            '<div class="lne-fg"><label>' + this._('altText','Alt text') + '</label>' +
            '<input type="text" id="lne-ei-alt" class="lne-inp" value="' + curAlt.replace(/"/g,'&quot;') + '"></div>' +
            '<div class="lne-fg"><label>' + this._('alignment','Alignment') + '</label>' +
            '<select id="lne-ei-align" class="lne-inp">' +
            '<option value=""' + (!curAlign?' selected':'') + '>None</option>' +
            '<option value="left"' + (curAlign==='left'?' selected':'') + '>' + this._('alignLeft','Left') + '</option>' +
            '<option value="center"' + (curAlign==='center'?' selected':'') + '>' + this._('alignCenter','Center') + '</option>' +
            '<option value="right"' + (curAlign==='right'?' selected':'') + '>' + this._('alignRight','Right') + '</option>' +
            '</select></div>',
        function(ov, close) {
            var w     = ov.querySelector('#lne-ei-w').value.trim() || '100%';
            var br    = ov.querySelector('#lne-ei-br').value.trim() || '4px';
            var alt   = ov.querySelector('#lne-ei-alt').value.trim();
            var align = ov.querySelector('#lne-ei-align').value;
            self._saveSnap();
            img.setAttribute('alt', alt);
            img.style.maxWidth = w;
            img.style.borderRadius = br;
            img.style.height = 'auto';
            if (align === 'left')   { img.style.float = 'left'; img.style.margin = '4px 14px 8px 0'; img.style.display = 'block'; }
            else if (align === 'right') { img.style.float = 'right'; img.style.margin = '4px 0 8px 14px'; img.style.display = 'block'; }
            else if (align === 'center') { img.style.float = ''; img.style.margin = '10px auto'; img.style.display = 'block'; }
            else { img.style.float = ''; img.style.margin = '10px 0'; img.style.display = 'block'; }
            close();
        });
    }

    _showImageCtxReplace(img) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) { self._saveSnap(); img.src = ev.target.result; };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    _showTableCtx(table, cell) {
        var self = this;
        var bar = this._ctxBar([
            {
                icon: 'bi bi-table', label: this._('tableHeader','Header row toggle'),
                action: function() {
                    self._saveSnap();
                    var thead = table.querySelector('thead');
                    if (thead) { thead.remove(); }
                    else {
                        var firstRow = table.querySelector('tr');
                        if (!firstRow) return;
                        var newThead = document.createElement('thead');
                        var newTr = document.createElement('tr');
                        firstRow.querySelectorAll('td').forEach(function(td) {
                            var th = document.createElement('th');
                            th.style.cssText = 'border:1px solid var(--border-color,#272727);padding:8px 12px;background:var(--primary-color,#28a745);font-weight:600;';
                            th.innerHTML = td.innerHTML;
                            newTr.appendChild(th);
                        });
                        newThead.appendChild(newTr);
                        firstRow.remove();
                        table.insertBefore(newThead, table.firstChild);
                    }
                }
            },
            {
                icon: 'bi bi-plus-square', label: this._('numberOfRows','Add row below'),
                action: function() {
                    self._saveSnap();
                    var row = cell.closest('tr');
                    var cols = table.querySelectorAll('tr')[0].children.length;
                    var newRow = document.createElement('tr');
                    for (var i = 0; i < cols; i++) {
                        var td = document.createElement('td');
                        td.style.cssText = 'border:1px solid var(--border-color,#272727);padding:8px 12px;';
                        td.innerHTML = '&nbsp;';
                        newRow.appendChild(td);
                    }
                    row.parentNode.insertBefore(newRow, row.nextSibling);
                }
            },
            {
                icon: 'bi bi-plus-lg', label: this._('numberOfColumns','Add column right'),
                action: function() {
                    self._saveSnap();
                    var colIdx = Array.from(cell.closest('tr').children).indexOf(cell);
                    table.querySelectorAll('tr').forEach(function(row) {
                        var refCell = row.children[colIdx];
                        var newCell = document.createElement(refCell && refCell.tagName === 'TH' ? 'th' : 'td');
                        newCell.style.cssText = refCell ? refCell.style.cssText : 'border:1px solid var(--border-color,#272727);padding:8px 12px;';
                        newCell.innerHTML = refCell && refCell.tagName === 'TH' ? 'Header' : '&nbsp;';
                        if (refCell) refCell.parentNode.insertBefore(newCell, refCell.nextSibling);
                        else row.appendChild(newCell);
                    });
                }
            },
            {
                icon: 'bi bi-dash-square', label: this._('deleteRow','Delete row'),
                action: function() {
                    self._saveSnap();
                    var row = cell.closest('tr');
                    if (table.querySelectorAll('tr').length > 1) row.remove();
                    else table.remove();
                }
            },
            {
                icon: 'bi bi-dash-lg', label: this._('deleteColumn','Delete column'),
                action: function() {
                    self._saveSnap();
                    var colIdx = Array.from(cell.closest('tr').children).indexOf(cell);
                    var cols = table.querySelectorAll('tr')[0].children.length;
                    if (cols <= 1) { table.remove(); return; }
                    table.querySelectorAll('tr').forEach(function(row) {
                        if (row.children[colIdx]) row.children[colIdx].remove();
                    });
                }
            },
            {
                icon: 'bi bi-gear', label: this._('tableProperties','Table properties'),
                action: function() { if (self._removeCtx) self._removeCtx(); self._modalTableEdit(table); }
            },
            {
                icon: 'bi bi-trash', label: this._('delete','Delete table'),
                action: function() {
                    self._saveSnap();
                    var wrap = table.closest('.table-responsive');
                    if (wrap) wrap.remove(); else table.remove();
                    self._syncState();
                }
            }
        ]);
        this._positionCtx(bar, cell);
        return bar;
    }

    _modalTableEdit(table) {
        var self = this;
        var curW = table.style.width || '100%';
        var hasBorder = table.style.borderCollapse === 'collapse' || !!table.querySelector('td[style*="border"]');
        var hasZebra = !!table.querySelector('tr:nth-child(even) td');

        this._modal(this._('createTable','Table Properties'), 'bi bi-table',
            '<div class="lne-fg"><label>' + this._('tableWidth','Width') + '</label>' +
            '<select id="lne-mt-w" class="lne-inp">' +
            '<option value="100%"' + (curW==='100%'?' selected':'') + '>Full (100%)</option>' +
            '<option value="75%"' + (curW==='75%'?' selected':'') + '>75%</option>' +
            '<option value="50%"' + (curW==='50%'?' selected':'') + '>50%</option>' +
            '<option value="auto"' + (curW==='auto'?' selected':'') + '>Auto</option>' +
            '</select></div>' +
            '<div class="lne-checks">' +
            '<label class="lne-chk"><input type="checkbox" id="lne-mt-zebra"' + (hasZebra?' checked':'') + '>' +
            '<span>' + this._('tableZebra','Zebra striping') + '</span></label>' +
            '</div>',
        function(ov, close) {
            var w = ov.querySelector('#lne-mt-w').value;
            self._saveSnap();
            table.style.width = w;
            var zebra = ov.querySelector('#lne-mt-zebra').checked;
            Array.from(table.querySelectorAll('tbody tr')).forEach(function(row, i) {
                Array.from(row.querySelectorAll('td')).forEach(function(td) {
                    td.style.background = (zebra && i % 2 === 1) ? 'rgba(255,255,255,0.03)' : '';
                });
            });
            close();
        });
    }

    _showVideoCtx(vw) {
        var self = this;
        var bar = this._ctxBar([
            {
                icon: 'bi bi-pencil', label: this._('videoInsert','Edit video'),
                action: function() { if (self._removeCtx) self._removeCtx(); self._modalVideoEdit(vw); }
            },
            {
                icon: 'bi bi-trash', label: this._('delete','Delete'),
                action: function() { self._saveSnap(); vw.remove(); self._syncState(); }
            }
        ]);
        this._positionCtx(bar, vw);
        return bar;
    }

    _showCodeCtx(cw) {
        var self = this;
        var bar = this._ctxBar([
            {
                icon: 'bi bi-clipboard', label: this._('copy','Copy code'),
                action: function() {
                    var codeEl = cw.querySelector('code');
                    var text = codeEl ? (codeEl.innerText || codeEl.textContent) : (cw.innerText || '');
                    navigator.clipboard.writeText(text).then(function() {}).catch(function() {
                        var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                    });
                }
            },
            {
                icon: 'bi bi-trash', label: this._('delete','Delete'),
                action: function() { self._saveSnap(); cw.remove(); self._syncState(); }
            }
        ]);
        this._positionCtx(bar, cw);
        return bar;
    }

    _modalVideoEdit(vw) {
        var self = this;
        var el = vw.querySelector('iframe, video');
        var curSrc = '';
        if (el) {
            curSrc = el.src || (el.tagName === 'VIDEO' && el.querySelector('source') ? el.querySelector('source').src : '') || '';
        }
        var curW = el ? (el.getAttribute('width') || el.style.width || '560') : '560';
        var curH = el ? (el.getAttribute('height') || el.style.height || '315') : '315';
        // Strip px
        curW = curW.replace('px','');
        curH = curH.replace('px','');

        this._modal(this._('videoInsert','Edit Video'), 'bi bi-play-circle',
            '<div class="lne-fg"><label>' + this._('videoUrl','URL / Embed src') + '</label>' +
            '<input type="url" id="lne-ve-url" class="lne-inp" value="' + curSrc.replace(/"/g,'&quot;') + '" placeholder="https://..."></div>' +
            '<div class="lne-row">' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('videoWidth','Width (px)') + '</label>' +
            '<input type="number" id="lne-ve-w" class="lne-inp" value="' + curW + '"></div>' +
            '<div class="lne-fg" style="flex:1"><label>' + this._('videoHeight','Height (px)') + '</label>' +
            '<input type="number" id="lne-ve-h" class="lne-inp" value="' + curH + '"></div>' +
            '</div>' +
            '<div class="lne-fg"><label>' + this._('videoIframeCode','Or paste full iframe/embed code') + '</label>' +
            '<textarea id="lne-ve-code" class="lne-inp" rows="3" style="font-family:monospace;font-size:12px;resize:vertical;" placeholder="<iframe ...></iframe>"></textarea></div>',
        function(ov, close) {
            var code = ov.querySelector('#lne-ve-code').value.trim();
            var w = ov.querySelector('#lne-ve-w').value;
            var h = ov.querySelector('#lne-ve-h').value;
            self._saveSnap();
            if (code) {
                // Replace entire wrapper content and recalculate wrapper style
                vw.innerHTML = code;
                var newEl = vw.querySelector('iframe, video');
                var nw = newEl && (newEl.getAttribute('width') || newEl.width);
                var nh = newEl && (newEl.getAttribute('height') || newEl.height);
                if (nw && nh && parseInt(nw) && parseInt(nh)) {
                    vw.style.aspectRatio = nw + '/' + nh;
                    vw.style.maxWidth = nw + 'px';
                } else {
                    vw.style.aspectRatio = '16/9';
                    vw.style.maxWidth = '';
                }
            } else {
                var url = ov.querySelector('#lne-ve-url').value.trim();
                if (url && el) {
                    if (el.tagName === 'IFRAME') { el.src = url; }
                    else if (el.tagName === 'VIDEO') {
                        var src = el.querySelector('source');
                        if (src) src.src = url; else el.src = url;
                    }
                }
                if (el && w) { el.setAttribute('width', w); el.style.width = w + 'px'; }
                if (el && h) { el.setAttribute('height', h); el.style.height = h + 'px'; }
                // Обновить aspect-ratio и max-width враппера
                if (w && h && parseInt(w) && parseInt(h)) {
                    vw.style.aspectRatio = w + '/' + h;
                    vw.style.maxWidth = w + 'px';
                }
            }
            self._syncState();
            // Перепривязать тулбар к враперу (на случай если vw.innerHTML был заменён)
            vw._lneCtxBound = false;
            self._initContextToolbars();
            close();
        });
    }

    // ── Public API ───────────────────────────────────────────────────────

    getContent() {
        this._snapEncode();
        return this.ed.innerHTML;
    }
    getText()     { return this.ed.innerText; }

    setContent(html) {
        this.ed.innerHTML = html || '';
        this._snapDecode();
        this._initAll();
        // Reset history — loading new content is not undoable
        this.undoStack = []; this.redoStack = []; this.lastSnap = null;
        this._saveSnap(); this._updateStatusbar();
        if (this.toolbar) this._syncState();
        // Remove inline styles hljs may have added to code blocks
        if (typeof fixCodeBlockStyles === 'function') fixCodeBlockStyles(this.ed);
    }

    _initAll() {
        this._initChecklists();
        this._initCodeBlocks();
        this._initContextToolbars();
    }

    focus()  { this.ed.focus(); }

    clear()  {
        this.ed.innerHTML = ''; this.undoStack = []; this.redoStack = [];
        this._saveSnap(); this._updateStatusbar();
    }

    destroy() { this.isDestroyed = true; this.container.innerHTML = ''; }

    // compat aliases
    undo()  { if (this.undoStack.length <= 1) return; this.isRec=true; this.redoStack.push({c:this.ed.innerHTML,t:Date.now()}); this.undoStack.pop(); var p=this.undoStack[this.undoStack.length-1]; if(p){this.ed.innerHTML=p.c;this.lastSnap=p;} this.isRec=false; this._syncState(); }
    redo()  { if (!this.redoStack.length) return; this.isRec=true; var s=this.redoStack.pop(); this.undoStack.push(s); this.ed.innerHTML=s.c; this.lastSnap=s; this.isRec=false; this._syncState(); }
    insertImage()       { this._modalImage(); }
    insertVideo()       { this._modalVideo(); }
    insertChecklistItem(){ this._insertChecklist(); }
    execCommand(cmd,ui,val){ this._saveSnap(); document.execCommand(cmd, ui!==undefined?ui:false, val||null); }
}

if (typeof module !== 'undefined' && module.exports) module.exports = LocalNotesEditor;

