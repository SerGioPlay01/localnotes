/**
 * LocalNotesEditor Integration
 * Integrates LocalNotesEditor with the Local Notes application
 */

let localNotesEditorInstance = null;

/**
 * Initialize the editor
 */
function initializeLocalNotesEditor() {
    const container = document.getElementById('editorContainer');
    if (!container) {
        console.error('❌ Editor container not found');
        return false;
    }

    try {
        // Check if LocalNotesEditor class is available
        if (typeof LocalNotesEditor === 'undefined') {
            console.warn('⚠️ LocalNotesEditor class not yet loaded, retrying...');
            setTimeout(initializeLocalNotesEditor, 100);
            return false;
        }

        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 480;
        const placeholder = (typeof t === 'function' ? t('editorPlaceholder') : null) || 'Start typing...';
        
        localNotesEditorInstance = new LocalNotesEditor('editorContainer', {
            height: isTablet ? 'calc(var(--vh, 1vh) * 100 - 200px)' : '500px',
            placeholder: placeholder,
            toolbar: true,
            statusbar: true
        });
        return true;
    } catch (error) {
        console.error('❌ Error initializing LocalNotesEditor:', error);
        return false;
    }
}

/**
 * Get editor content
 */
function getEditorContent() {
    if (!localNotesEditorInstance) {
        console.warn('⚠️ Editor not initialized');
        return '';
    }
    return localNotesEditorInstance.getContent();
}

/**
 * Set editor content
 */
function setEditorContent(html) {
    if (!localNotesEditorInstance) {
        console.warn('⚠️ Editor not initialized');
        return;
    }
    localNotesEditorInstance.setContent(html);
}

/**
 * Get editor text
 */
function getEditorText() {
    if (!localNotesEditorInstance) {
        console.warn('⚠️ Editor not initialized');
        return '';
    }
    return localNotesEditorInstance.getText();
}

/**
 * Clear editor
 */
function clearEditor() {
    if (!localNotesEditorInstance) {
        console.warn('⚠️ Editor not initialized');
        return;
    }
    localNotesEditorInstance.clear();
}

/**
 * Destroy editor
 */
function destroyEditor() {
    if (localNotesEditorInstance) {
        localNotesEditorInstance.destroy();
        localNotesEditorInstance = null;
    }
}

/**
 * Check if editor is initialized
 */
function isEditorInitialized() {
    return localNotesEditorInstance !== null && !localNotesEditorInstance.isDestroyed;
}

/**
 * Focus editor
 */
function focusEditor() {
    if (localNotesEditorInstance && localNotesEditorInstance.editorElement) {
        localNotesEditorInstance.editorElement.focus();
    }
}

/**
 * Undo
 */
function editorUndo() {
    if (localNotesEditorInstance) {
        localNotesEditorInstance.undo();
    }
}

/**
 * Redo
 */
function editorRedo() {
    if (localNotesEditorInstance) {
        localNotesEditorInstance.redo();
    }
}

// Initialize editor when LocalNotesEditor class is available
function waitForEditorClass() {
    if (typeof LocalNotesEditor === 'undefined') {
        setTimeout(waitForEditorClass, 50);
        return;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeLocalNotesEditor, 100);
        });
    } else {
        setTimeout(initializeLocalNotesEditor, 100);
    }
}

// Start waiting for editor class
waitForEditorClass();

// Export for use in other modules
window.localNotesEditorAPI = {
    getContent: getEditorContent,
    setContent: setEditorContent,
    getText: getEditorText,
    clear: clearEditor,
    destroy: destroyEditor,
    isInitialized: isEditorInitialized,
    focus: focusEditor,
    undo: editorUndo,
    redo: editorRedo,
    getInstance: () => localNotesEditorInstance
};

/**
 * Visual Viewport handler — keeps toolbar visible when keyboard opens on mobile
 */
(function () {
    if (!window.visualViewport) return;

    var modal = null;
    var rafId = null;

    function getModal() {
        if (!modal) modal = document.getElementById('editModal');
        return modal;
    }

    function applyViewport() {
        var m = getModal();
        if (!m || m.style.display === 'none' || m.style.display === '') return;

        var vv = window.visualViewport;
        var content = m.querySelector('.modal-content');
        if (!content) return;

        // On mobile: set modal-content height to visual viewport height
        // so the toolbar stays pinned at top and doesn't scroll off screen
        if (window.innerWidth <= 768) {
            var h = vv.height;
            content.style.height = h + 'px';
            content.style.maxHeight = h + 'px';
            // Offset for viewport position (handles iOS scroll-to-top on focus)
            m.style.top = vv.offsetTop + 'px';
            m.style.height = vv.height + 'px';
        }
    }

    function onViewportChange() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyViewport);
    }

    function resetViewport() {
        var m = getModal();
        if (!m) return;
        var content = m.querySelector('.modal-content');
        if (content) {
            content.style.height = '';
            content.style.maxHeight = '';
        }
        m.style.top = '';
        m.style.height = '';
    }

    window.visualViewport.addEventListener('resize', onViewportChange);
    // NOTE: не слушаем 'scroll' — на iOS это срабатывает при скролле lne-body
    // и сбрасывает m.style.top, заставляя модал прыгать

    // Hook into modal open/close
    document.addEventListener('DOMContentLoaded', function () {
        var m = document.getElementById('editModal');
        if (!m) return;
        modal = m;

        var observer = new MutationObserver(function () {
            if (m.style.display !== 'none' && m.style.display !== '') {
                // Modal opened — apply immediately
                setTimeout(applyViewport, 50);
            } else {
                resetViewport();
            }
        });
        observer.observe(m, { attributes: true, attributeFilter: ['style'] });
    });
})();

/**
 * Cursor scroll — keeps the caret visible above the keyboard on mobile.
 *
 * The tricky case: user scrolls lne-body to the bottom of a long note,
 * taps somewhere — keyboard opens, shrinks the viewport, and the caret
 * ends up hidden under the keyboard.  We must re-scroll lne-body AFTER
 * the keyboard has finished animating (visualViewport resize settles).
 */
(function () {
    // Only on touch devices
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;

    var PADDING = 24; // px gap between caret and bottom of visible area
    var rafId   = null;
    var timers  = [];

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    function getCaretRect() {
        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        var range = sel.getRangeAt(0).cloneRange();
        range.collapse(true);
        var rects = range.getClientRects();
        if (rects.length > 0) return rects[0];
        var node = range.startContainer;
        if (node.nodeType === 3) node = node.parentElement;
        return node ? node.getBoundingClientRect() : null;
    }

    function scrollCaretIntoView() {
        var modal = document.getElementById('editModal');
        if (!modal || modal.style.display === 'none' || modal.style.display === '') return;

        var body = modal.querySelector('.lne-body');
        if (!body) return;

        var caretRect = getCaretRect();
        if (!caretRect) return;

        // Use visualViewport when available — it reflects the area above the keyboard
        var vv = window.visualViewport;
        var vvTop    = vv ? vv.offsetTop            : 0;
        var vvBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;

        var toolbar       = modal.querySelector('.lne-toolbar');
        var toolbarBottom = toolbar ? toolbar.getBoundingClientRect().bottom : 0;

        var caretBottom = caretRect.bottom;
        var caretTop    = caretRect.top;

        // Caret hidden under keyboard (or too close to bottom)
        if (caretBottom + PADDING > vvBottom) {
            body.scrollTop += (caretBottom + PADDING - vvBottom);
        }
        // Caret scrolled above toolbar
        else if (caretTop < toolbarBottom + PADDING) {
            body.scrollTop -= (toolbarBottom + PADDING - caretTop);
        }
    }

    function scheduleScroll() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(scrollCaretIntoView);
    }

    // Re-check after keyboard animation completes (fires at multiple points
    // because different devices animate the keyboard at different speeds)
    function scheduleScrollDelayed() {
        clearTimers();
        [80, 200, 400].forEach(function (ms) {
            timers.push(setTimeout(scrollCaretIntoView, ms));
        });
    }

    document.addEventListener('selectionchange', scheduleScroll);
    document.addEventListener('input', scheduleScroll, true);

    // KEY FIX: keyboard opens → visualViewport shrinks → scroll caret into view
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleScrollDelayed);
    }
})();
