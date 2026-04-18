/**
 * Network Mode — offline/online toggle
 * localStorage key: 'ln_network_mode' = 'offline' | 'online'
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'ln_network_mode';
  const TOGGLE_ID   = 'lnNetworkToggle';

  /* ── helpers ─────────────────────────────────────────── */
  function getMode() {
    return localStorage.getItem(STORAGE_KEY) || 'online';
  }

  function setMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyMode(mode);
    notifySW(mode);
    updateToggleUI(mode);
  }

  function applyMode(mode) {
    document.documentElement.setAttribute('data-network-mode', mode);
  }

  function notifySW(mode) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SET_NETWORK_MODE', mode });
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
  };

  /* ── init ─────────────────────────────────────────────── */
  function init() {
    var mode = getMode();
    applyMode(mode);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        buildToggle();
        updateToggleUI(mode);
      });
    } else {
      buildToggle();
      updateToggleUI(mode);
    }

    // Уведомляем SW после его активации
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function () {
        notifySW(mode);
      });
    }
  }

  init();
})();
