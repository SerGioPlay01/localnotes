// Image load/error handlers
function handleImageLoad(img) {
    img.classList.add('loaded');
    img.classList.remove('error');
}

function handleImageError(img) {
    img.classList.add('error');
    img.classList.remove('loaded');
    console.warn('Failed to load image:', img.src);
}

function initializeImageHandlers() {
    document.querySelectorAll('.note img').forEach(img => {
        if (!img.hasAttribute('data-handlers-added')) {
            img.addEventListener('load', () => handleImageLoad(img));
            img.addEventListener('error', () => handleImageError(img));
            img.setAttribute('data-handlers-added', 'true');
            if (img.complete && img.naturalHeight !== 0) handleImageLoad(img);
            else if (img.complete && img.naturalHeight === 0) handleImageError(img);
        }
    });
}

// ── Fullscreen image viewer ──────────────────────────────────────────────────

function handleImageClick(event) {
    const target = event.target;
    if (!target.matches('.note img')) return;

    // Prevent the opening event from immediately closing the overlay
    event.stopPropagation();
    event.preventDefault();

    const overlay = document.createElement('div');
    overlay.classList.add('fullscreen-overlay');

    const fullscreenImage = document.createElement('img');
    fullscreenImage.classList.add('fullscreen-image');
    fullscreenImage.src = target.src;
    // pointer-events:none so taps pass to overlay, not the image
    fullscreenImage.style.pointerEvents = 'none';
    overlay.appendChild(fullscreenImage);

    // Guard: only allow closing after overlay is fully open
    let canClose = false;
    setTimeout(() => { canClose = true; }, 450);

    const closeOverlay = (e) => {
        if (!canClose) return;
        e.stopPropagation();
        fullscreenImage.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
        }, 400);
        document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
        if (e.key === 'Escape') closeOverlay(e);
    };

    // Single pointer-agnostic handler — use 'pointerup' only,
    // which fires once per tap on both iOS and Android
    overlay.addEventListener('pointerup', closeOverlay);

    // Fallback for browsers without PointerEvent (old iOS Safari)
    if (!window.PointerEvent) {
        overlay.addEventListener('touchend', closeOverlay, { passive: true });
    }

    document.addEventListener('keydown', handleEscape);
    document.body.appendChild(overlay);
}

// Single global listener — 'click' fires after touch sequence ends,
// avoiding duplicate events from pointerdown+touchend+click
document.addEventListener('click', handleImageClick);

// DOM observer for dynamically added note images
document.addEventListener('DOMContentLoaded', initializeImageHandlers);

const imgObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            const imgs = node.matches?.('.note img')
                ? [node]
                : [...(node.querySelectorAll?.('.note img') || [])];
            imgs.forEach(img => {
                if (!img.hasAttribute('data-handlers-added')) {
                    img.addEventListener('load', () => handleImageLoad(img));
                    img.addEventListener('error', () => handleImageError(img));
                    img.setAttribute('data-handlers-added', 'true');
                }
            });
        });
    });
});

imgObserver.observe(document.body, { childList: true, subtree: true });
