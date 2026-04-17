// PWA — Service Worker registration + update notification
'use strict';

var _pwaNewWorker = null;

// Создаём тост-баннер об обновлении
function _pwaCreateToast() {
    if (document.getElementById('pwaUpdateToast')) return;

    var toast = document.createElement('div');
    toast.id = 'pwaUpdateToast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
        '<span id="pwaToastText">Update available</span>' +
        '<button id="pwaToastUpdate">Update</button>' +
        '<button id="pwaToastDismiss">✕</button>';
    document.body.appendChild(toast);

    document.getElementById('pwaToastUpdate').addEventListener('click', function() {
        if (_pwaNewWorker) _pwaNewWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    });

    document.getElementById('pwaToastDismiss').addEventListener('click', function() {
        toast.classList.remove('pwa-toast-visible');
    });
}

function _pwaShowUpdateToast() {
    _pwaCreateToast();
    // Небольшая задержка чтобы CSS transition сработал
    setTimeout(function() {
        var toast = document.getElementById('pwaUpdateToast');
        if (toast) toast.classList.add('pwa-toast-visible');
    }, 300);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js?v=1.1.0')
            .then(function(registration) {
                registration.update();
                registration.addEventListener('updatefound', function() {
                    var newWorker = registration.installing;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            _pwaNewWorker = newWorker;
                            _pwaShowUpdateToast();
                        }
                    });
                });
            })
            .catch(function(error) {
                console.warn('Service Worker registration failed:', error);
            });
    });
}
