// PWA — Service Worker registration + update notification
'use strict';

var _pwaNewWorker = null;

function _pwaGetText() {
    try {
        if (typeof t === 'function') {
            return {
                msg:     t('pwaUpdateAvailable') || 'Update available',
                update:  t('pwaUpdate')          || 'Update',
                dismiss: '✕'
            };
        }
    } catch(e) {}
    return { msg: 'Update available', update: 'Update', dismiss: '✕' };
}

// Создаём тост-баннер об обновлении
function _pwaCreateToast() {
    if (document.getElementById('pwaUpdateToast')) return;
    var txt = _pwaGetText();
    var toast = document.createElement('div');
    toast.id = 'pwaUpdateToast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML =
        '<span id="pwaToastText">' + txt.msg + '</span>' +
        '<button id="pwaToastUpdate">' + txt.update + '</button>' +
        '<button id="pwaToastDismiss">' + txt.dismiss + '</button>';
    document.body.appendChild(toast);

    document.getElementById('pwaToastUpdate').addEventListener('click', function() {
        if (_pwaNewWorker) _pwaNewWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    });

    document.getElementById('pwaToastDismiss').addEventListener('click', function() {
        var t = document.getElementById('pwaUpdateToast');
        if (t) t.classList.remove('pwa-toast-visible');
    });
}

function _pwaShowUpdateToast() {
    _pwaCreateToast();
    setTimeout(function() {
        var toast = document.getElementById('pwaUpdateToast');
        if (toast) toast.classList.add('pwa-toast-visible');
    }, 300);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                registration.update();

                registration.addEventListener('updatefound', function() {
                    var newWorker = registration.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed') {
                            _pwaNewWorker = newWorker;
                            // Show toast whether or not there's an existing controller
                            // (controller is null on first install — skip toast then)
                            if (navigator.serviceWorker.controller) {
                                _pwaShowUpdateToast();
                            }
                        }
                    });
                });

                // Если SW уже ожидает (страница была открыта раньше) — показываем тост
                if (registration.waiting && navigator.serviceWorker.controller) {
                    _pwaNewWorker = registration.waiting;
                    _pwaShowUpdateToast();
                }

                navigator.serviceWorker.ready.then(function(reg) {
                    if (reg.active) {
                        reg.active.postMessage({ type: 'PRECACHE_ALL' });
                    }
                });
            })
            .catch(function(error) {
                console.warn('Service Worker registration failed:', error);
            });

        navigator.serviceWorker.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'PRECACHE_DONE') {
                console.log('[PWA] All static files cached for offline use');
            }
        });

        // Если SW активировался пока страница была открыта — перезагружаем
        // Флаг предотвращает повторный reload если controllerchange сработает несколько раз
        var _reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            if (_reloading) return;
            _reloading = true;
            window.location.reload();
        });
    });
}
