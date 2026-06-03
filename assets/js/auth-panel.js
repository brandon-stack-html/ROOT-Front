/* ============================================================================
   auth-panel.js — Inyecta el panel marketing derecho del shell auth split
   Monta en <aside id="auth-panel-mount"> presente en cada pantalla de /auth/.
   Vanilla JS. Sin dependencias salvo Lucide (CDN) para refrescar íconos.
   ============================================================================ */

(function () {
  'use strict';

  var PANEL_HTML = [
    '<div class="auth-panel-content">',
      '<div class="auth-panel-brand">',
        '<span class="root-wordmark" style="font-size:34px">',
          '<span class="rw-root">',
            '<span class="rw-fill">RO</span><span class="rw-stroke">OT</span>',
          '</span>',
          '<span class="rw-pos">POS</span>',
        '</span>',
      '</div>',
      '<h2 class="auth-panel-tagline">POS para restaurantes en Colombia</h2>',
      '<p class="auth-panel-sub">Operación simple, datos al instante. Para cocinas y barras que se mueven rápido.</p>',
      '<ul class="auth-panel-features">',
        '<li class="auth-feature-row">',
          '<span class="auth-feature-icon"><i data-lucide="package"></i></span>',
          '<div class="auth-feature-text">',
            '<div class="auth-feature-title">Inventario en tiempo real</div>',
            '<div class="auth-feature-desc">Stock, mermas y conteos siempre sincronizados.</div>',
          '</div>',
        '</li>',
        '<li class="auth-feature-row">',
          '<span class="auth-feature-icon"><i data-lucide="monitor"></i></span>',
          '<div class="auth-feature-text">',
            '<div class="auth-feature-title">KDS y comandas en vivo</div>',
            '<div class="auth-feature-desc">La cocina ve cada pedido al segundo.</div>',
          '</div>',
        '</li>',
        '<li class="auth-feature-row">',
          '<span class="auth-feature-icon"><i data-lucide="receipt"></i></span>',
          '<div class="auth-feature-text">',
            '<div class="auth-feature-title">Reportes y facturación DIAN</div>',
            '<div class="auth-feature-desc">Cierres de caja y documentos listos para tu contador.</div>',
          '</div>',
        '</li>',
      '</ul>',
    '</div>',
    '<div class="auth-panel-footer">© 2026 ROOT · Hecho en Colombia</div>'
  ].join('');

  function mount() {
    var slot = document.getElementById('auth-panel-mount');
    if (!slot) return;
    slot.innerHTML = PANEL_HTML;
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
