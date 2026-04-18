/**
 * Network Mode — offline/online toggle + real connectivity indicator
 * localStorage key: 'ln_network_mode' = 'offline' | 'online'
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ln_network_mode';
  const TOGGLE_ID   = 'lnNetworkToggle';
  const BANNER_ID   = 'lnOfflineBanner';

  /* ── helpers ─────────────────────────────────────────── */
  function getMode() {
    return localStorage.getItem(STORAGE_KEY) || 'online';
  }

  function setMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyMode(mode);
    notifySW(mode);
    updateToggleUI(mode);
    updateBanner();
  }

  function applyMode(mode) {
    document.documentElement.setAttribute('data-network-mode', mode);
  }

  function notifySW(mode) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SET_NETWORK_MODE', mode });
    }
  }

  /* ── offline banner (реальный статус сети) ───────────── */
  function createBanner() {
    if (document.getElementById(BANNER_ID)) return;
    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<line x1="1" y1="1" x2="23" y2="23"/>' +
        '<path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>' +
        '<path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>' +
        '<path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>' +
        '<path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>' +
        '<path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>' +
        '<line x1="12" y1="20" x2="12.01" y2="20"/>' +
      '</svg>' +
      '<span id="lnOfflineBannerText">You are offline</span>';
    document.body.appendChild(banner);
  }

  // Track real connectivity state independently of navigator.onLine
  var _isReallyOffline = false;

  function isModalOpen() {
    var modal = document.getElementById('editModal');
    return modal && modal.style.display !== 'none' && modal.style.display !== '';
  }

  function showBanner() {
    _isReallyOffline = true;
    createBanner();
    var b = document.getElementById(BANNER_ID);
    if (b) {
      var t = (window.t && window.t('offlineBannerText')) || 'You are offline — app works from cache';
      var el = document.getElementById('lnOfflineBannerText');
      if (el) el.textContent = t;
      if (!isModalOpen()) {
        b.classList.add('ln-offline-banner--visible');
      }
    }
  }

  function hideBanner() {
    _isReallyOffline = false;
    var b = document.getElementById(BANNER_ID);
    if (b) b.classList.remove('ln-offline-banner--visible');
  }

  function updateBanner() {
    // Banner reflects REAL connectivity only, not the manual mode toggle
    if (!navigator.onLine) {
      showBanner();
    } else {
      hideBanner();
    }
  }

  /* ── build toggle widget ──────────────────────────────── */
  function buildToggle() {
    if (document.getElementById(TOGGLE_ID)) return;

    var t = function(key, fb) { return (window.t ? window.t(key) || fb : fb); };

    var wrap = document.createElement('div');
    wrap.id = TOGGLE_ID;
    wrap.className = 'ln-net-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', t('networkModeLabel', 'Network mode'));

    wrap.innerHTML =
      '<span class="ln-net-label ln-net-label--offline" id="lnNetLabelOffline">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' +
        '<span id="lnNetOfflineText">' + t('offlineMode', 'Offline') + '</span>' +
      '</span>' +
      '<button class="ln-net-switch" id="lnNetSwitch" type="button" aria-checked="false" role="switch" aria-label="' + t('networkModeLabel', 'Network mode') + '">' +
        '<span class="ln-net-thumb"></span>' +
      '</button>' +
      '<span class="ln-net-label ln-net-label--online" id="lnNetLabelOnline">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' +
        '<span id="lnNetOnlineText">' + t('onlineMode', 'Online') + '</span>' +
      '</span>';

    var footer = document.querySelector('footer .footer-content');
    if (footer) {
      footer.appendChild(document.createElement('br'));
      footer.appendChild(wrap);
    }

    document.getElementById('lnNetSwitch').addEventListener('click', function () {
      var current = getMode();
      setMode(current === 'online' ? 'offline' : 'online');
    });
  }

  function updateToggleUI(mode) {
    var btn = document.getElementById('lnNetSwitch');
    if (!btn) return;
    var isOnline = mode === 'online';
    btn.setAttribute('aria-checked', String(isOnline));
    var wrap = btn.closest ? btn.closest('.ln-net-toggle') : btn.parentNode;
    if (wrap) wrap.setAttribute('data-mode', mode);
  }

  /* ── i18n refresh ─────────────────────────────────────── */
  window.lnNetworkModeRefreshLabels = function () {
    var t = function(key, fb) { return (window.t ? window.t(key) || fb : fb); };
    var el = function(id) { return document.getElementById(id); };
    if (el('lnNetOfflineText')) el('lnNetOfflineText').textContent = t('offlineMode', 'Offline');
    if (el('lnNetOnlineText'))  el('lnNetOnlineText').textContent  = t('onlineMode',  'Online');
    var btn = el('lnNetSwitch');
    if (btn) btn.setAttribute('aria-label', t('networkModeLabel', 'Network mode'));
    if (el('lnOfflineBannerText') && _isReallyOffline) {
      el('lnOfflineBannerText').textContent = t('offlineBannerText', 'You are offline — app works from cache');
    }
  };

  function setupModalObserver() {
    var modal = document.getElementById('editModal');
    if (!modal) return;
    var observer = new MutationObserver(function() {
      if (modal.style.display !== 'none' && modal.style.display !== '') {
        hideBanner();
      } else if (_isReallyOffline) {
        showBanner();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
  }

  /* ── init ─────────────────────────────────────────────── */
  function init() {
    var mode = getMode();
    applyMode(mode);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        buildToggle();
        updateToggleUI(mode);
        updateBanner();
        setupModalObserver();
      });
    } else {
      buildToggle();
      updateToggleUI(mode);
      updateBanner();
      setupModalObserver();
    }

    // Слушаем реальные события сети
    window.addEventListener('online',  function() { hideBanner(); });
    window.addEventListener('offline', function() { showBanner(); });

    // Уведомляем SW после его активации
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function () {
        notifySW(mode);
      });
    }
  }

  init();
})();
