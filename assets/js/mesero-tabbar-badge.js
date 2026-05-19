/* ============================================================================
   mesero-tabbar-badge.js — Dot badge dinámico en tab "Comandas" (S16)
   Cargado en todas las páginas mesero con bottom-nav.
   Lee StoreComandas.countNoVistas() y pinta/borra el badge.
   Reacciona a 'comanda-lista' (in-window) y 'storage' (cross-tab).
   ============================================================================ */
(function () {
  'use strict';

  function paintBadge() {
    var count = window.StoreComandas ? StoreComandas.countNoVistas() : 0;
    document.querySelectorAll('.mesero-bottom-nav-tab').forEach(function (tab) {
      var href = tab.getAttribute('href') || '';
      if (href.indexOf('comandas.html') === -1) return;
      var wrap  = tab.querySelector('.mesero-bottom-nav-tab-icon-wrap');
      if (!wrap) return;
      var badge = wrap.querySelector('.mesero-bottom-nav-tab-badge');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'mesero-bottom-nav-tab-badge';
          wrap.appendChild(badge);
        }
        badge.textContent = count > 9 ? '9+' : String(count);
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function init() {
    paintBadge();
    window.addEventListener('comanda-lista',       paintBadge);
    window.addEventListener('comanda-lista-vista', paintBadge);
    window.addEventListener('storage', function (e) {
      if (e.key === 'root:comandas-listas:v1') paintBadge();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
