/* ============================================================================
   mesero-tabbar-badge.js — Dot badges dinámicos en tabs del bottom-nav
   - Tab "Comandas" (S16): lee StoreComandas.countNoVistas()
   - Tab "Nómina"   (S19): lee root:nomina-novedad:v1 de localStorage
   ============================================================================ */
(function () {
  'use strict';

  // ── Comandas badge ──────────────────────────────────────────────────────────
  function paintComandaBadge() {
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

  // ── Nómina badge ────────────────────────────────────────────────────────────
  function paintNominaBadge() {
    var hasNovedad = !!localStorage.getItem('root:nomina-novedad:v1');
    document.querySelectorAll('.mesero-bottom-nav-tab').forEach(function (tab) {
      var href = tab.getAttribute('href') || '';
      if (href.indexOf('nomina.html') === -1) return;
      var wrap  = tab.querySelector('.mesero-bottom-nav-tab-icon-wrap');
      if (!wrap) return;
      var badge = wrap.querySelector('.mesero-nomina-badge');
      if (hasNovedad) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'mesero-nomina-badge';
          badge.style.cssText = [
            'position:absolute;top:0;right:0;',
            'width:8px;height:8px;border-radius:50%;',
            'background:var(--error,#ef4444);',
            'border:1.5px solid var(--bg,#fff);',
          ].join('');
          wrap.style.position = 'relative';
          wrap.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function init() {
    paintComandaBadge();
    paintNominaBadge();

    window.addEventListener('comanda-lista',       paintComandaBadge);
    window.addEventListener('comanda-lista-vista', paintComandaBadge);
    window.addEventListener('nomina-novedad',      paintNominaBadge);

    window.addEventListener('storage', function (e) {
      if (e.key === 'root:comandas-listas:v1')  paintComandaBadge();
      if (e.key === 'root:nomina-novedad:v1')   paintNominaBadge();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
