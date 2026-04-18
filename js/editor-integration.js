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
 * Mobile keyboard handler — two jobs:
 *  1. Resize modal-content to the visual viewport height so lne-body
 *     stays fully scrollable above the keyboard.
 *     - iOS: dvh does NOT shrink when keyboard opens → JS must set height
 *     - Android: dvh DOES shrink, but JS override is harmless and ensures
 *       consistent behaviour across both platforms.
 *  2. Compensate for iOS layout-viewport scroll (vv.offsetTop > 0) so the
 *     toolbar doesn't disappear above the top of the screen.
 */
(function () {
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;
    if (!window.visualViewport) return;

    var modal = null;
    var rafId = null;

    function getModal() {
        if (!modal) modal = document.getElementById('editModal');
        return modal;
    }

    function isOpen(m) {
        return m && m.style.display !== 'none' && m.style.display !== '';
    }

    function apply() {
        var m = getModal();
        if (!isOpen(m)) return;
        if (window.innerWidth > 768) return;

        var vv      = window.visualViewport;
        var content = m.querySelector('.modal-content');
        if (!content) return;

        // Set exact visible height — works on both iOS and Android
        content.style.height    = vv.height + 'px';
        content.style.maxHeight = vv.height + 'px';

        // iOS only: offsetTop > 0 means layout viewport was scrolled up by
        // the browser when keyboard opened — shift content down to compensate
        content.style.marginTop = (vv.offsetTop || 0) + 'px';
    }

    function reset() {
        var m = getModal();
        if (!m) return;
        var content = m.querySelector('.modal-content');
        if (!content) return;
        content.style.height    = '';
        content.style.maxHeight = '';
        content.style.marginTop = '';
    }

    function onVpChange() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(apply);
    }

    window.visualViewport.addEventListener('resize', onVpChange);
    window.visualViewport.addEventListener('scroll', onVpChange);

    document.addEventListener('DOMContentLoaded', function () {
        modal = document.getElementById('editModal');
        if (!modal) return;
        new MutationObserver(function () {
            if (isOpen(modal)) {
                // Apply immediately and again after layout settles
                apply();
                setTimeout(apply, 100);
            } else {
                reset();
            }
        }).observe(modal, { attributes: true, attributeFilter: ['style'] });
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

    var PADDING       = 24;    // px gap between caret and bottom of visible area
    var rafId         = null;
    var timers        = [];
    var userScrolling = false; // true while user is manually scrolling
    var scrollEndTimer = null;

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
        // Don't fight the user while they're manually scrolling
        if (userScrolling) return;

        var modal = document.getElementById('editModal');
        if (!modal || modal.style.display === 'none' || modal.style.display === '') return;

        var body = modal.querySelector('.lne-body');
        if (!body) return;

        var caretRect = getCaretRect();
        if (!caretRect) return;

        var vv       = window.visualViewport;
        var vvBottom = vv ? vv.offsetTop + vv.height : window.innerHeight;

        var toolbar       = modal.querySelector('.lne-toolbar');
        var toolbarBottom = toolbar ? toolbar.getBoundingClientRect().bottom : 0;

        var caretBottom = caretRect.bottom;
        var caretTop    = caretRect.top;

        // Caret hidden under keyboard
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

    // Re-check after keyboard animation completes
    function scheduleScrollDelayed() {
        clearTimers();
        [80, 200, 400].forEach(function (ms) {
            timers.push(setTimeout(scrollCaretIntoView, ms));
        });
    }

    // Detect manual scroll — suppress caret-scroll while user is scrolling
    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('editModal');
        if (!modal) return;
        var body = modal.querySelector('.lne-body');
        if (!body) return;

        body.addEventListener('touchstart', function () {
            userScrolling = true;
            clearTimeout(scrollEndTimer);
        }, { passive: true });

        body.addEventListener('touchend', function () {
            // Resume caret-scroll shortly after finger lifts
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(function () {
                userScrolling = false;
            }, 300);
        }, { passive: true });
    });

    // input = user typed → always scroll to caret
    document.addEventListener('input', function () {
        userScrolling = false;
        scheduleScroll();
    }, true);

    // selectionchange = tap to place cursor → scroll only if not manually scrolling
    document.addEventListener('selectionchange', scheduleScroll);

    // KEY FIX: keyboard opens → visualViewport shrinks → scroll caret into view
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleScrollDelayed);
    }
})();
