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
    { name: 'Registro exitoso',          path: '/auth/registro-ok.html',            module: 'Auth' },
    { name: 'Nómina · Comprobante imprimible', path: '/backoffice/nomina-imprimible.html', module: 'Backoffice' },
    { name: 'Notificaciones',                  path: '/backoffice/notificaciones.html',    module: 'Backoffice' },

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
  let homeEl  = null;
  let selectedIdx = 0;
  let currentResults = PAGES.slice();

  // ── Recientes via localStorage ──────────────────────────────────
  const RECIENTES_KEY = 'root:nav:recientes';
  const ACCIONES = [
    { name: 'Crear producto',  icon: 'plus',         path: '/backoffice/producto.html?nuevo=1' },
    { name: 'Abrir turno POS', icon: 'dollar-sign',  path: '/pos/apertura.html' },
    { name: 'Ver adelantos',   icon: 'clock',        path: '/backoffice/adelantos.html' },
    { name: 'Reportes',        icon: 'bar-chart-3',  path: '/backoffice/reportes.html' },
    { name: 'Inventario',      icon: 'archive',      path: '/backoffice/inventario.html' },
    { name: 'Nómina',          icon: 'wallet',       path: '/backoffice/nomina.html' },
  ];
  const FRECUENTES = [
    '/backoffice/dashboard.html', '/backoffice/catalogo.html',
    '/pos/mapa.html', '/backoffice/nomina.html',
    '/backoffice/caja.html', '/backoffice/clientes.html',
    '/backoffice/adelantos.html', '/backoffice/reportes.html',
  ];

  function getRecientes() {
    try { return JSON.parse(localStorage.getItem(RECIENTES_KEY) || '[]'); } catch(e) { return []; }
  }
  function pushReciente(page) {
    var list = getRecientes().filter(function(p) { return p.path !== page.path; });
    list.unshift({ name: page.name, path: page.path, module: page.module });
    if (list.length > 5) list = list.slice(0, 5);
    localStorage.setItem(RECIENTES_KEY, JSON.stringify(list));
  }

  function buildModal() {
    if (document.getElementById('navJumpModal')) return;
    const backdrop = document.createElement('div');
    backdrop.id = 'navJumpModal';
    backdrop.className = 'modal-backdrop nav-jump-modal';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'navJumpInput');
    backdrop.innerHTML =
      '<div class="modal modal-md">' +
        '<div class="modal-header">' +
          '<i data-lucide="search" style="width:16px;height:16px;color:var(--muted);"></i>' +
          '<input id="navJumpInput" type="text" class="nav-jump-input" placeholder="Buscar pantalla o acción..." autocomplete="off" spellcheck="false" aria-label="Buscar pantalla">' +
          '<button class="modal-close" data-close aria-label="Cerrar buscador">×</button>' +
        '</div>' +
        '<div class="modal-body" style="padding:0; max-height:60vh; overflow-y:auto;">' +
          '<div id="navJumpHome" style="padding:8px 4px;"></div>' +
          '<ul class="nav-jump-list" role="listbox" style="display:none;"></ul>' +
          '<div class="nav-jump-empty" hidden>Sin resultados.</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<span class="nav-jump-hint"><kbd>↑</kbd><kbd>↓</kbd> navegar · <kbd>Enter</kbd> ir · <kbd>Esc</kbd> cerrar</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
    modalEl = backdrop;
    inputEl = backdrop.querySelector('.nav-jump-input');
    listEl  = backdrop.querySelector('.nav-jump-list');
    emptyEl = backdrop.querySelector('.nav-jump-empty');
    homeEl  = backdrop.querySelector('#navJumpHome');

    inputEl.addEventListener('input', function () {
      selectedIdx = 0;
      var q = inputEl.value.trim();
      if (!q) {
        listEl.style.display  = 'none';
        emptyEl.hidden = true;
        renderHome();
      } else {
        homeEl.style.display = 'none';
        listEl.style.display = '';
        renderList(q);
      }
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
          pushReciente(currentResults[selectedIdx]);
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
        pushReciente(currentResults[i]);
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

  // ── Home del Ctrl+K: 3 secciones ────────────────────────────────
  function renderHome() {
    if (!homeEl) return;
    var recientes = getRecientes();
    var frecPage  = FRECUENTES.map(function(path) {
      return PAGES.find(function(p) { return p.path === path; });
    }).filter(Boolean);

    var html = '';

    // Sección Recientes
    if (recientes.length > 0) {
      html += navSection('Recientes', recientes.map(function(p) {
        return navItem(p.name, p.module || '', p.path, 'history', true);
      }).join(''));
    }

    // Sección Acciones rápidas
    html += navSection('Acciones rápidas', ACCIONES.map(function(a) {
      return '<button type="button" class="nav-jump-item" data-path="' + a.path + '" style="gap:8px;">' +
        '<span class="nav-jump-item-icon" style="display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent);">' +
          '<i data-lucide="' + a.icon + '" style="width:13px;height:13px;"></i>' +
        '</span>' +
        '<span class="nav-jump-item-name">' + a.name + '</span>' +
        '<span class="nav-jump-module">Acción</span>' +
      '</button>';
    }).join(''));

    // Sección Frecuentes
    if (frecPage.length > 0) {
      html += navSection('Páginas frecuentes', frecPage.map(function(p) {
        return navItem(p.name, p.module, p.path, 'layout-grid', false);
      }).join(''));
    }

    homeEl.innerHTML = html;
    homeEl.style.display = 'block';

    homeEl.querySelectorAll('.nav-jump-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var path = btn.dataset.path;
        var page = PAGES.find(function(p) { return p.path === path; });
        if (page) pushReciente(page);
        window.location.href = path;
        closeJump();
      });
      btn.addEventListener('mouseenter', function() {
        homeEl.querySelectorAll('.nav-jump-item').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
      });
    });

    refreshLucide();
  }

  function navSection(title, itemsHtml) {
    return '<div style="padding:8px 12px 4px;font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;">' + title + '</div>' +
      '<div>' + itemsHtml + '</div>';
  }

  function navItem(name, module, path, icon, highlight) {
    return '<button type="button" class="nav-jump-item" data-path="' + path + '" style="gap:8px;">' +
      '<span class="nav-jump-item-icon" style="display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;flex-shrink:0;color:' + (highlight ? 'var(--accent)' : 'var(--muted)') + ';">' +
        '<i data-lucide="' + icon + '" style="width:13px;height:13px;"></i>' +
      '</span>' +
      '<span class="nav-jump-item-name">' + name + '</span>' +
      '<span class="nav-jump-module">' + module + '</span>' +
    '</button>';
  }

  function closeJump() {
    if (window.UI && typeof window.UI.closeModal === 'function') {
      window.UI.closeModal('navJumpModal');
    } else if (modalEl) {
      modalEl.classList.remove('is-open');
    }
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
    // Mostrar home en lugar de todos los resultados
    if (listEl)  listEl.style.display  = 'none';
    if (emptyEl) emptyEl.hidden = true;
    renderHome();
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
