/* ============================================================================
   auth.js — Sistema de autenticación y roles
   Sprint 14 — ROOT POS demo
   ============================================================================ */
(function () {
  'use strict';

  // Detect base path for GitHub Pages (e.g. /ROOT-Front) vs localhost (empty)
  const BASE = (function () {
    var seg = location.pathname.split('/').filter(Boolean);
    var knownFolders = ['auth', 'backoffice', 'pos', 'mesero', 'kds', 'storefront', 'assets', 'design-system'];
    if (seg.length > 0 && knownFolders.indexOf(seg[0]) === -1 && seg[0].indexOf('.html') === -1) {
      return '/' + seg[0];
    }
    return '';
  })();

  const DEMO_MODE = true;
  const STORAGE_KEY = 'root:auth:v1';

  // ──────────────────────────────────────────────────────────────
  // Mapa de permisos por rol
  // ──────────────────────────────────────────────────────────────
  const PERMISSIONS = {
    admin: [
      'users:read', 'users:write', 'users:delete',
      'roles:read', 'roles:write',
      'billing:read', 'billing:write',
      'reports:read', 'reports:export',
      'pos:read', 'pos:write',
      'kds:read', 'kds:write',
      'dashboard:read',
      'catalog:read', 'catalog:write', 'catalog:delete',
      'inventory:read', 'inventory:write',
      'cash:read', 'cash:write', 'cash:delete',
      'clients:read', 'clients:write', 'clients:delete',
      'suppliers:read', 'suppliers:write',
      'expenses:read', 'expenses:write',
      'payroll:read', 'payroll:write',
      'integrations:read', 'integrations:write',
      'tables:read', 'tables:write',
      'orders:read', 'orders:write', 'orders:delete',
    ],
    gerente: [
      'catalog:read', 'catalog:write', 'catalog:delete',
      'inventory:read', 'inventory:write',
      'reports:read', 'reports:export',
      'pos:read', 'pos:write',
      'kds:read', 'kds:write',
      'dashboard:read',
      'cash:read', 'cash:write',
      'clients:read', 'clients:write',
      'suppliers:read', 'suppliers:write',
      'expenses:read', 'expenses:write',
      'payroll:read', 'payroll:write',
      'tables:read', 'tables:write',
      'orders:read', 'orders:write', 'orders:delete',
    ],
    cajero: [
      'pos:read', 'pos:write',
      'dashboard:read',
      'cash:read', 'cash:write',
      'reports:read',
    ],
    mesero: [
      'tables:read', 'tables:write',
      'orders:write',
      'payroll:self',
    ],
    cocina: [
      'kds:read', 'kds:write',
    ],
  };

  // Home URL por rol (para redirección tras switch)
  const ROLE_HOMES = {
    admin:   '/backoffice/dashboard.html',
    gerente: '/backoffice/dashboard.html',
    cajero:  '/pos/apertura.html',
    mesero:  '/mesero/mapa.html',
    cocina:  '/kds/main.html',
  };

  // Usuarios demo para el switcher de rol
  const DEMO_USERS = {
    admin:   { userId: 'usr-001', name: 'Juan Camilo', initials: 'JC', role: 'admin' },
    gerente: { userId: 'usr-002', name: 'Ana Lucía',   initials: 'AL', role: 'gerente' },
    cajero:  { userId: 'usr-003', name: 'Miguel R.',   initials: 'MR', role: 'cajero' },
    mesero:  { userId: 'usr-004', name: 'Camila V.',   initials: 'CV', role: 'mesero' },
    cocina:  { userId: 'usr-005', name: 'Carlos F.',   initials: 'CF', role: 'cocina' },
  };

  // Usuarios con múltiples roles asignados (demo)
  const MULTI_ROLE_USERS = {
    'andrea.gomez@restaurante.com': {
      userId: 'usr-006',
      name: 'Andrea Gómez',
      initials: 'AG',
      roles: ['gerente', 'cajero'],
    },
  };

  // Etiquetas legibles de cada rol (para sidebar footer)
  var ROLE_LABELS = {
    admin: 'Administrador', gerente: 'Encargado',
    cajero: 'Cajero', mesero: 'Mesero', cocina: 'Cocina',
  };

  // Ítems de nav restringidos por rol
  const SIDEBAR_RESTRICTIONS = {
    gerente:  ['usuarios.html', 'roles.html', 'integraciones.html', 'facturacion-dian.html',
               'sucursales.html', 'configuracion.html', 'contabilidad.html'],
    cajero:   ['usuarios.html', 'roles.html', 'integraciones.html', 'facturacion-dian.html',
               'contabilidad.html', 'proveedores.html', 'clientes.html', 'catalogo.html',
               'inventario.html', 'categorias.html', 'conteo.html', 'fichas.html',
               'producto.html', 'gastos.html', 'nomina.html', 'adelantos.html',
               'nomina-empleado.html', 'mesas.html', 'sucursales.html', 'configuracion.html'],
    mesero:   '__redirect__/mesero/mapa.html',
    cocina:   '__redirect__/kds/main.html',
  };

  // ──────────────────────────────────────────────────────────────
  // Helper: match de permisos
  // ──────────────────────────────────────────────────────────────
  function matchPerm(userPerms, required) {
    if (!required) return true;
    const [res, act] = required.split(':');
    return userPerms.some(function (p) {
      const [r, a] = p.split(':');
      if (r !== res) return false;
      return a === '*' || a === act || act === '*';
    });
  }

  // ──────────────────────────────────────────────────────────────
  // API pública
  // ──────────────────────────────────────────────────────────────
  var Auth = {

    getAvailableRoles: function (email) {
      var key = (email || '').toLowerCase().trim();
      return MULTI_ROLE_USERS[key] || null;
    },

    current: function () {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) {}
      }
      // Auto-inicializar con admin demo
      var user = Object.assign({}, DEMO_USERS.admin, { permissions: PERMISSIONS.admin });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    },

    can: function (permission) {
      var user = Auth.current();
      var perms = PERMISSIONS[user.role] || [];
      return matchPerm(perms, permission);
    },

    login: function (userData) {
      var perms = PERMISSIONS[userData.role] || [];
      var data = Object.assign({}, userData, { permissions: perms });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },

    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = BASE + '/auth/login.html';
    },

    requireRole: function (role) {
      var user = Auth.current();
      if (user.role !== role) window.location.href = BASE + '/index.html';
      return user;
    },

    switchRole: function (role) {
      if (!DEMO_MODE) return;
      var demo = DEMO_USERS[role];
      if (!demo) return;
      Auth.login(demo);
      var label = ROLE_LABELS[role] || role;
      var home = BASE + (ROLE_HOMES[role] || '/backoffice/dashboard.html');
      if (window.UI && typeof window.UI.toast === 'function') {
        window.UI.toast({ type: 'success', title: 'Cambiado a ' + label, sub: 'Redirigiendo al módulo…' });
      }
      // Fade-out antes de navegar
      setTimeout(function () {
        document.body.style.transition = 'opacity .2s ease';
        document.body.style.opacity = '0';
        setTimeout(function () { window.location.href = home; }, 220);
      }, 700);
    },

    filterNavItems: function (items) {
      return items.filter(function (item) {
        return !item.permission || Auth.can(item.permission);
      });
    },

    // ── Aplicar filtrado de sidebar por rol ──
    applySidebar: function () {
      var user = Auth.current();
      var rule = SIDEBAR_RESTRICTIONS[user.role];
      if (!rule) return; // admin: todo visible

      if (typeof rule === 'string' && rule.startsWith('__redirect__')) {
        var target = BASE + rule.replace('__redirect__', '');
        var path = window.location.pathname;
        if (path.indexOf('/backoffice/') !== -1 || path.indexOf('/pos/') !== -1) {
          window.location.href = target;
        }
        return;
      }

      document.querySelectorAll('.bo-sidebar-item').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var file = href.split('/').pop();
        if (rule.indexOf(file) !== -1) {
          a.style.display = 'none';
        }
      });
    },

    // ── Ocultar elementos con data-requires ──
    applyRequires: function () {
      document.querySelectorAll('[data-requires]').forEach(function (el) {
        if (!Auth.can(el.dataset.requires)) {
          el.hidden = true;
        }
      });
    },

    // ── Modal de confirmación de logout ──
    _injectLogoutModal: function () {
      if (document.getElementById('authLogoutModal')) return;
      var el = document.createElement('div');
      el.id = 'authLogoutModal';
      el.className = 'modal-backdrop';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.innerHTML = [
        '<div class="modal modal-sm" style="max-width:360px;">',
          '<div class="modal-header" style="border-bottom:1px solid var(--border);">',
            '<div class="modal-title">Cerrar sesión</div>',
            '<button class="modal-close" data-close-logout aria-label="Cancelar">×</button>',
          '</div>',
          '<div class="modal-body" style="padding:20px 22px 8px;">',
            '<p style="font-size:13px;color:var(--muted);line-height:1.6;margin:0;">',
              '¿Seguro que quieres cerrar sesión? Volverás a la pantalla de inicio.',
            '</p>',
          '</div>',
          '<div class="modal-footer" style="justify-content:flex-end;gap:8px;">',
            '<button type="button" id="authLogoutCancel" class="btn btn-ghost btn-sm">Cancelar</button>',
            '<button type="button" id="authLogoutConfirm" class="btn btn-destructive btn-sm">Cerrar sesión</button>',
          '</div>',
        '</div>',
      ].join('');
      document.body.appendChild(el);

      el.querySelector('[data-close-logout]').addEventListener('click', function () {
        Auth._closeLogoutModal();
      });
      el.querySelector('#authLogoutCancel').addEventListener('click', function () {
        Auth._closeLogoutModal();
      });
      el.querySelector('#authLogoutConfirm').addEventListener('click', function () {
        Auth._closeLogoutModal();
        Auth.logout();
      });
      el.addEventListener('click', function (e) {
        if (e.target === el) Auth._closeLogoutModal();
      });
    },

    _openLogoutModal: function () {
      Auth._injectLogoutModal();
      var m = document.getElementById('authLogoutModal');
      if (m) m.classList.add('is-open');
    },

    _closeLogoutModal: function () {
      var m = document.getElementById('authLogoutModal');
      if (m) m.classList.remove('is-open');
    },

    // ── Wire botones de logout del sidebar ──
    _wireSidebarLogout: function () {
      document.querySelectorAll('.bo-logout').forEach(function (btn) {
        if (btn.dataset.logoutAttached) return;
        btn.dataset.logoutAttached = 'true';
        btn.addEventListener('click', function () {
          Auth._openLogoutModal();
        });
      });
    },

    // ── Switcher de rol en topbar (solo demo) ──
    injectRoleSwitcher: function () {
      if (!DEMO_MODE) return;

      var avatarBtns = document.querySelectorAll('.bo-topbar-avatar, .pos-topbar-avatar');
      if (!avatarBtns.length) return;

      var user = Auth.current();

      // Crear dropdown (único en el DOM)
      if (!document.getElementById('authRoleDropdown')) {
        var dd = document.createElement('div');
        dd.id = 'authRoleDropdown';
        dd.style.cssText = [
          'display:none;position:fixed;z-index:9000;',
          'background:var(--bg-elevated,var(--alt));',
          'border:1px solid var(--border-default,var(--border));',
          'border-radius:12px;padding:6px;min-width:200px;',
          'box-shadow:var(--shadow-lg);',
        ].join('');
        document.body.appendChild(dd);
      }

      var dropdown = document.getElementById('authRoleDropdown');

      avatarBtns.forEach(function (btn) {
        if (btn.dataset.authAttached) return;
        btn.dataset.authAttached = 'true';
        btn.title = user.name + ' · ' + user.role;
        btn.textContent = user.initials || 'JC';

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var rect = btn.getBoundingClientRect();
          Auth._renderDropdown(dropdown, user);
          var isVisible = dropdown.style.display === 'block';
          dropdown.style.display = isVisible ? 'none' : 'block';
          dropdown.style.top  = (rect.bottom + 8) + 'px';
          dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        });
      });

      document.addEventListener('click', function () {
        dropdown.style.display = 'none';
      });
      dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
    },

    _renderDropdown: function (dd, user) {
      var html = [
        '<div style="font-size:10px;font-weight:700;color:var(--muted);',
        'letter-spacing:.06em;text-transform:uppercase;padding:4px 10px 8px;">',
        'Cambiar rol <span style="opacity:.5;">(demo)</span></div>',
      ].join('');

      Object.keys(DEMO_USERS).forEach(function (role) {
        var u = DEMO_USERS[role];
        var isActive = user.role === role;
        html += [
          '<button type="button" data-switch-role="', role, '" ',
          'style="width:100%;text-align:left;padding:8px 10px;border-radius:8px;',
          'background:', isActive ? 'var(--accent)' : 'transparent', ';',
          'color:', isActive ? '#fff' : 'var(--text)', ';',
          'border:none;cursor:pointer;font-size:13px;',
          'font-family:var(--ff-base);font-weight:500;',
          'display:flex;align-items:center;justify-content:space-between;gap:8px;">',
          '<span>', u.name, '</span>',
          '<span style="font-size:11px;opacity:.65;">', role, '</span>',
          '</button>',
        ].join('');
      });

      html += [
        '<div style="border-top:1px solid var(--border-subtle,var(--border));margin:6px 0;"></div>',
        '<button id="authLogoutBtn" type="button" ',
        'style="width:100%;text-align:left;padding:8px 10px;border-radius:8px;',
        'background:transparent;color:var(--error);border:none;cursor:pointer;',
        'font-size:13px;font-family:var(--ff-base);font-weight:500;">',
        'Cerrar sesión</button>',
      ].join('');

      dd.innerHTML = html;

      dd.querySelectorAll('[data-switch-role]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          dd.style.display = 'none';
          Auth.switchRole(btn.dataset.switchRole);
        });
      });

      var logoutBtn = dd.querySelector('#authLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          dd.style.display = 'none';
          Auth._openLogoutModal();
        });
      }
    },

    // ── Notificaciones ────────────────────────────────────────────
    _NOTIF_DEFAULTS: [
      { id:'n1', titulo:'Camila V. solicitó un adelanto',      meta:'$120.000 · Hace 5 min',  icon:'clock',          href:'/backoffice/adelantos.html',       leida:false },
      { id:'n2', titulo:'Nuevo pedido #901 · Mesa 8',          meta:'3 ítems · Hace 8 min',   icon:'shopping-bag',   href:'/pos/pedido.html',                  leida:false },
      { id:'n3', titulo:'Papa criolla en stock bajo',          meta:'12.5 kg · Hace 15 min',  icon:'alert-triangle', href:'/backoffice/inventario.html',        leida:false },
      { id:'n4', titulo:'Factura FE-0234 enviada a DIAN',      meta:'$45.000 · Hace 22 min',  icon:'file-text',      href:'/backoffice/facturacion-dian.html', leida:true  },
      { id:'n5', titulo:'Nómina mayo registrada',              meta:'$1.623.500 · Hace 1 h',  icon:'wallet',         href:'/backoffice/nomina.html',            leida:true  },
      { id:'n6', titulo:'Comanda Mesa 3 completada por KDS',   meta:'Hace 1 h',               icon:'check-circle-2', href:'/kds/main.html',                    leida:true  },
      { id:'n7', titulo:'Guascas sin stock — reabastecer',     meta:'Hace 2 h',               icon:'alert-circle',   href:'/backoffice/inventario.html',        leida:true  },
      { id:'n8', titulo:'Turno cerrado · $1.234.000',          meta:'Sede Norte · Hace 3 h',  icon:'dollar-sign',    href:'/backoffice/caja.html',              leida:true  },
      { id:'n9', titulo:'Camila V. solicitó adelanto aprobado',meta:'$80.000 · Ayer',         icon:'check',          href:'/backoffice/adelantos.html',         leida:true  },
      { id:'n10',titulo:'Integración Uber Eats actualizada',   meta:'Ayer 18:30',             icon:'plug',           href:'/backoffice/integraciones.html',     leida:true  },
    ],

    _getNotifs: function () {
      var raw = localStorage.getItem('root:notifs:v1');
      if (raw) { try { return JSON.parse(raw); } catch(e) {} }
      localStorage.setItem('root:notifs:v1', JSON.stringify(Auth._NOTIF_DEFAULTS));
      return Auth._NOTIF_DEFAULTS.slice();
    },

    _saveNotifs: function (notifs) {
      localStorage.setItem('root:notifs:v1', JSON.stringify(notifs));
    },

    _injectNotifDropdown: function () {
      if (!DEMO_MODE) return;
      var bells = document.querySelectorAll('.bo-topbar-icon[aria-label="Notificaciones"]');
      if (!bells.length) return;

      if (!document.getElementById('notifDropdown')) {
        var dd = document.createElement('div');
        dd.id = 'notifDropdown';
        dd.style.cssText = [
          'display:none;position:fixed;z-index:9000;',
          'background:var(--bg-elevated,var(--alt));',
          'border:1px solid var(--border);border-radius:12px;',
          'width:340px;max-height:480px;overflow:hidden;display:none;',
          'flex-direction:column;box-shadow:var(--shadow-lg,0 16px 40px rgba(0,0,0,.2));',
        ].join('');
        document.body.appendChild(dd);
      }
      var dropdown = document.getElementById('notifDropdown');

      bells.forEach(function (bell) {
        if (bell.dataset.notifAttached) return;
        bell.dataset.notifAttached = 'true';
        bell.addEventListener('click', function (e) {
          e.stopPropagation();
          var rect = bell.getBoundingClientRect();
          var isVisible = dropdown.style.display === 'flex';
          if (isVisible) { dropdown.style.display = 'none'; return; }
          Auth._renderNotifDropdown(dropdown);
          dropdown.style.display = 'flex';
          dropdown.style.top  = (rect.bottom + 8) + 'px';
          dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        });
      });

      document.addEventListener('click', function () { if (dropdown) dropdown.style.display = 'none'; });
      dropdown.addEventListener('click', function (e) { e.stopPropagation(); });

      Auth._updateNotifBadge();
    },

    _renderNotifDropdown: function (dd) {
      var notifs = Auth._getNotifs();
      var unread  = notifs.filter(function (n) { return !n.leida; }).length;

      var header = '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid var(--border);flex-shrink:0;">' +
        '<div style="font-size:13px;font-weight:700;color:var(--text);">Notificaciones' + (unread > 0 ? ' <span style="font-size:10px;background:var(--accent);color:#fff;border-radius:8px;padding:1px 6px;margin-left:4px;">' + unread + '</span>' : '') + '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          (unread > 0 ? '<button id="notifMarkAll" style="font-size:11px;color:var(--accent);background:none;border:none;cursor:pointer;font-family:var(--ff-base);font-weight:500;">Marcar leídas</button>' : '') +
          '<a href="' + BASE + '/backoffice/notificaciones.html" style="font-size:11px;color:var(--muted);text-decoration:none;" onclick="document.getElementById(\'notifDropdown\').style.display=\'none\'">Ver todas →</a>' +
        '</div>' +
      '</div>';

      var rows = notifs.map(function (n) {
        return '<a href="' + BASE + n.href + '" onclick="Auth._markRead(\'' + n.id + '\');document.getElementById(\'notifDropdown\').style.display=\'none\'" style="display:flex;align-items:flex-start;gap:10px;padding:11px 16px;text-decoration:none;background:' + (n.leida ? 'transparent' : 'rgba(79,70,229,.04)') + ';border-bottom:1px solid var(--border-subtle,var(--border));transition:background .12s;">' +
          '<div style="width:28px;height:28px;border-radius:7px;background:' + (n.leida ? 'var(--alt)' : 'rgba(79,70,229,.1)') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">' +
            '<i data-lucide="' + n.icon + '" style="width:12px;height:12px;color:' + (n.leida ? 'var(--muted)' : 'var(--accent)') + ';"></i>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:12px;font-weight:' + (n.leida ? '400' : '600') + ';color:var(--text);line-height:1.4;">' + n.titulo + '</div>' +
            '<div style="font-size:11px;color:var(--muted);margin-top:2px;">' + n.meta + '</div>' +
          '</div>' +
          (!n.leida ? '<div style="width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:5px;"></div>' : '') +
        '</a>';
      }).join('');

      dd.innerHTML = header + '<div style="overflow-y:auto;flex:1;">' + rows + '</div>';

      var markAllBtn = dd.querySelector('#notifMarkAll');
      if (markAllBtn) {
        markAllBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var ns = Auth._getNotifs();
          ns.forEach(function (n) { n.leida = true; });
          Auth._saveNotifs(ns);
          Auth._renderNotifDropdown(dd);
          Auth._updateNotifBadge();
        });
      }

      if (window.lucide) window.lucide.createIcons({ nodes: [dd] });
    },

    _markRead: function (id) {
      var ns = Auth._getNotifs();
      var n  = ns.find(function (x) { return x.id === id; });
      if (n) n.leida = true;
      Auth._saveNotifs(ns);
      Auth._updateNotifBadge();
    },

    _updateNotifBadge: function () {
      var notifs = Auth._getNotifs();
      var count  = notifs.filter(function (n) { return !n.leida; }).length;
      document.querySelectorAll('.bo-topbar-icon[aria-label="Notificaciones"]').forEach(function (bell) {
        var dot = bell.querySelector('.notification-dot');
        if (count > 0) {
          if (dot) {
            dot.textContent = count > 9 ? '9+' : String(count);
            dot.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;border-radius:8px;background:var(--error);color:#fff;font-size:9px;font-weight:700;padding:0 3px;';
          }
        } else {
          if (dot) dot.style.display = 'none';
        }
      });
    },

    // ── Actualizar footer del sidebar con datos del usuario actual ──
    _applyUserInfo: function () {
      var s = Auth.current();
      if (!s) return;
      var avatarEl = document.querySelector('.bo-sidebar-footer .bo-user-avatar');
      var nameEl   = document.querySelector('.bo-sidebar-footer .bo-user-info .name');
      var roleEl   = document.querySelector('.bo-sidebar-footer .bo-user-info .role');
      if (avatarEl) avatarEl.textContent = s.initials || (s.name || '').slice(0, 2).toUpperCase();
      if (nameEl)   nameEl.textContent   = s.name || '';
      if (roleEl)   roleEl.textContent   = ROLE_LABELS[s.role] || s.role || '';
    },

    // ── Init general ──
    init: function () {
      Auth.applySidebar();
      Auth.applyRequires();
      Auth._applyUserInfo();
      Auth.injectRoleSwitcher();
      Auth._wireSidebarLogout();
      Auth._injectNotifDropdown();
    },
  };

  window.Auth = Auth;

  // Auto-init cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { Auth.init(); });
  } else {
    Auth.init();
  }
})();
