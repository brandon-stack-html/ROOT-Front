/* ============================================================================
   nav.js — Sprint 11
   Navegación global del demo:
     - Botón flotante "Volver al index" (abajo izq, oculto en index).
     - Modal Ctrl+K (Cmd+K en Mac) para saltar entre pantallas.
   Depende de: ui.js (UI.openModal/closeModal), lucide (íconos).
   ============================================================================ */
(function () {
  'use strict';

  const PAGES = [
    { name: 'Inicio del demo',           path: '/index.html',                       module: 'General' },

    { name: 'Login',                     path: '/auth/login.html',                  module: 'Auth' },
    { name: 'Registro',                  path: '/auth/registro.html',               module: 'Auth' },
    { name: 'Recuperar contraseña',      path: '/auth/recuperar.html',              module: 'Auth' },
    { name: 'Restablecer contraseña',    path: '/auth/restablecer.html',            module: 'Auth' },
    { name: 'Selector de sucursal',      path: '/auth/selector-sucursal.html',      module: 'Auth' },

    { name: 'Dashboard',                 path: '/backoffice/dashboard.html',        module: 'Backoffice' },
    { name: 'Usuarios',                  path: '/backoffice/usuarios.html',         module: 'Backoffice' },
    { name: 'Roles y permisos',          path: '/backoffice/roles.html',            module: 'Backoffice' },
    { name: 'Configuración general',     path: '/backoffice/configuracion.html',    module: 'Backoffice' },
    { name: 'Sucursales',                path: '/backoffice/sucursales.html',       module: 'Backoffice' },
    { name: 'Mesas',                     path: '/backoffice/mesas.html',            module: 'Backoffice' },
    { name: 'Catálogo',                  path: '/backoffice/catalogo.html',         module: 'Backoffice' },
    { name: 'Producto',                  path: '/backoffice/producto.html',         module: 'Backoffice' },
    { name: 'Inventario',                path: '/backoffice/inventario.html',       module: 'Backoffice' },
    { name: 'Categorías',                path: '/backoffice/categorias.html',       module: 'Backoffice' },
    { name: 'Conteo inventario',         path: '/backoffice/conteo.html',           module: 'Backoffice' },
    { name: 'Fichas técnicas',           path: '/backoffice/fichas.html',           module: 'Backoffice' },
    { name: 'Clientes',                  path: '/backoffice/clientes.html',         module: 'Backoffice' },
    { name: 'Proveedores',               path: '/backoffice/proveedores.html',      module: 'Backoffice' },
    { name: 'Gastos',                    path: '/backoffice/gastos.html',           module: 'Backoffice' },
    { name: 'Facturación DIAN',          path: '/backoffice/facturacion-dian.html', module: 'Backoffice' },
    { name: 'Contabilidad',              path: '/backoffice/contabilidad.html',     module: 'Backoffice' },
    { name: 'Reportes',                  path: '/backoffice/reportes.html',         module: 'Backoffice' },
    { name: 'Caja',                      path: '/backoffice/caja.html',             module: 'Backoffice' },
    { name: 'Integraciones',             path: '/backoffice/integraciones.html',    module: 'Backoffice' },

    { name: 'POS · Apertura',            path: '/pos/apertura.html',                module: 'POS' },
    { name: 'POS · Mapa de mesas',       path: '/pos/mapa.html',                    module: 'POS' },
    { name: 'POS · Toma de pedido',      path: '/pos/pedido.html',                  module: 'POS' },
    { name: 'POS · Histórico',           path: '/pos/historico.html',               module: 'POS' },

    { name: 'Mesero · Login PIN',        path: '/mesero/login.html',                module: 'Mesero' },
    { name: 'Mesero · Sala',             path: '/mesero/sala.html',                 module: 'Mesero' },
    { name: 'Mesero · Mapa',             path: '/mesero/mapa.html',                 module: 'Mesero' },
    { name: 'Mesero · Detalle mesa',     path: '/mesero/detalle.html',              module: 'Mesero' },
    { name: 'Mesero · Catálogo',         path: '/mesero/catalogo.html',             module: 'Mesero' },
    { name: 'Mesero · Comandas',         path: '/mesero/comandas.html',             module: 'Mesero' },
    { name: 'Mesero · Cobro',            path: '/mesero/cobro.html',                module: 'Mesero' },
    { name: 'Mesero · Audio Confirmar',  path: '/mesero/audio-confirmar.html',      module: 'Mesero' },
    { name: 'Mesero · Perfil',           path: '/mesero/perfil.html',               module: 'Mesero' },

    { name: 'KDS · Pantalla cocina',     path: '/kds/main.html',                    module: 'KDS' },
    { name: 'KDS · Configuración',       path: '/kds/config.html',                  module: 'KDS' },

    { name: 'Storefront · Carta QR',     path: '/storefront/carta.html',            module: 'Storefront' },
    { name: 'Storefront · Producto',     path: '/storefront/producto.html',         module: 'Storefront' },
    { name: 'Storefront · Tienda',       path: '/storefront/tienda.html',           module: 'Storefront' },
    { name: 'Storefront · Catálogo',     path: '/storefront/tienda-catalogo.html',  module: 'Storefront' },
    { name: 'Storefront · Checkout',     path: '/storefront/checkout.html',         module: 'Storefront' },
    { name: 'Storefront · Confirmación', path: '/storefront/confirmacion.html',     module: 'Storefront' },
  ];

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function isIndexPage() {
    const p = location.pathname;
    return p === '/' || p === '/index.html' || p.endsWith('/index.html');
  }

  function refreshLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // --------------------------------------------------------------------------
  // Botón flotante "Volver al demo"
  // --------------------------------------------------------------------------
  function injectBackHome() {
    if (isIndexPage()) return;
    if (document.querySelector('.nav-back-home')) return;
    const a = document.createElement('a');
    a.href = '/index.html';
    a.className = 'nav-back-home';
    a.setAttribute('aria-label', 'Volver al demo');
    a.setAttribute('title', 'Volver al demo');
    a.innerHTML = '<i data-lucide="layout-grid"></i>';
    document.body.appendChild(a);
  }

  // --------------------------------------------------------------------------
  // Modal Ctrl+K — Jump to page
  // --------------------------------------------------------------------------
  let modalEl = null;
  let inputEl = null;
  let listEl = null;
  let emptyEl = null;
  let selectedIdx = 0;
  let currentResults = PAGES.slice();

  function buildModal() {
    if (document.getElementById('navJumpModal')) return;
    const backdrop = document.createElement('div');
    backdrop.id = 'navJumpModal';
    backdrop.className = 'modal-backdrop nav-jump-modal';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'navJumpInput');
    backdrop.innerHTML = `
      <div class="modal modal-md">
        <div class="modal-header">
          <i data-lucide="search" style="width:16px;height:16px;color:var(--muted);"></i>
          <input
            id="navJumpInput"
            type="text"
            class="nav-jump-input"
            placeholder="Saltar a pantalla..."
            autocomplete="off"
            spellcheck="false"
            aria-label="Buscar pantalla"
          >
          <button class="modal-close" data-close aria-label="Cerrar buscador">×</button>
        </div>
        <div class="modal-body" style="padding:0; max-height:60vh; overflow-y:auto;">
          <ul class="nav-jump-list" role="listbox"></ul>
          <div class="nav-jump-empty" hidden>Sin resultados.</div>
        </div>
        <div class="modal-footer">
          <span class="nav-jump-hint">
            <kbd>↑</kbd><kbd>↓</kbd> navegar · <kbd>Enter</kbd> ir · <kbd>Esc</kbd> cerrar
          </span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    modalEl = backdrop;
    inputEl = backdrop.querySelector('.nav-jump-input');
    listEl = backdrop.querySelector('.nav-jump-list');
    emptyEl = backdrop.querySelector('.nav-jump-empty');

    inputEl.addEventListener('input', function () {
      selectedIdx = 0;
      renderList(inputEl.value);
    });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, currentResults.length - 1);
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentResults.length > 0 && currentResults[selectedIdx]) {
          location.href = currentResults[selectedIdx].path;
        }
      }
    });
  }

  function renderList(query) {
    const q = (query || '').trim().toLowerCase();
    currentResults = q
      ? PAGES.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.module.toLowerCase().includes(q)
        )
      : PAGES.slice();

    if (currentResults.length === 0) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const html = currentResults.map(function (p, i) {
      return (
        '<li>' +
          '<button type="button" class="nav-jump-item' + (i === selectedIdx ? ' is-selected' : '') + '"' +
            ' data-path="' + p.path + '" data-idx="' + i + '" role="option">' +
            '<span class="nav-jump-item-name"></span>' +
            '<span class="nav-jump-module"></span>' +
          '</button>' +
        '</li>'
      );
    }).join('');
    listEl.innerHTML = html;

    // Setear textos vía textContent (evitar HTML injection)
    const items = listEl.querySelectorAll('.nav-jump-item');
    items.forEach(function (btn, i) {
      btn.querySelector('.nav-jump-item-name').textContent = currentResults[i].name;
      btn.querySelector('.nav-jump-module').textContent = currentResults[i].module;
      btn.addEventListener('mouseenter', function () {
        selectedIdx = i;
        updateSelection();
      });
      btn.addEventListener('click', function () {
        location.href = currentResults[i].path;
      });
    });
  }

  function updateSelection() {
    const items = listEl.querySelectorAll('.nav-jump-item');
    items.forEach(function (it, i) {
      it.classList.toggle('is-selected', i === selectedIdx);
      if (i === selectedIdx) {
        it.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function openJump() {
    if (!modalEl) buildModal();
    if (window.UI && typeof window.UI.openModal === 'function') {
      window.UI.openModal('navJumpModal');
    } else {
      modalEl.classList.add('is-open');
    }
    inputEl.value = '';
    selectedIdx = 0;
    renderList('');
    setTimeout(function () { inputEl.focus(); }, 50);
    refreshLucide();
  }

  // --------------------------------------------------------------------------
  // Atajo de teclado: Ctrl+K (Cmd+K en Mac)
  // --------------------------------------------------------------------------
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  document.addEventListener('keydown', function (e) {
    const cmd = isMac ? e.metaKey : e.ctrlKey;
    if (cmd && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openJump();
    }
  });

  // --------------------------------------------------------------------------
  // Cargar auth.js dinámicamente si no está presente
  // --------------------------------------------------------------------------
  function loadAuth() {
    if (window.Auth) { window.Auth.init(); return; }
    var s = document.createElement('script');
    // Ruta relativa a /assets/js/ desde cualquier profundidad
    var depth = location.pathname.split('/').length - 2;
    var prefix = depth <= 1 ? '' : '../'.repeat(depth - 1);
    s.src = prefix + 'assets/js/auth.js';
    s.onload = function () { if (window.Auth) window.Auth.init(); };
    document.head.appendChild(s);
  }

  // --------------------------------------------------------------------------
  // Bootstrap
  // --------------------------------------------------------------------------
  function init() {
    buildModal();
    injectBackHome();
    loadAuth();
    refreshLucide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
