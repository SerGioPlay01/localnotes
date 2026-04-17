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

        console.log('✅ LocalNotesEditor initialized successfully');
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
