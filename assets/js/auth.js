/* ============================================================================
   auth.js — Sistema de autenticación y roles
   Sprint 14 — ROOT POS demo
   ============================================================================ */
(function () {
  'use strict';

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
      'cash:read', 'cash:write',
      'clients:read', 'clients:write', 'clients:delete',
      'suppliers:read', 'suppliers:write',
      'expenses:read', 'expenses:write',
      'payroll:read', 'payroll:write',
      'integrations:read', 'integrations:write',
      'tables:read', 'tables:write',
      'orders:read', 'orders:write',
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
      'orders:read', 'orders:write',
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

  // Ítems de nav restringidos por rol
  const SIDEBAR_RESTRICTIONS = {
    gerente:  ['usuarios.html', 'roles.html', 'integraciones.html', 'facturacion-dian.html'],
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
      window.location.href = '/auth/login.html';
    },

    requireRole: function (role) {
      var user = Auth.current();
      if (user.role !== role) window.location.href = '/index.html';
      return user;
    },

    switchRole: function (role) {
      if (!DEMO_MODE) return;
      var demo = DEMO_USERS[role];
      if (!demo) return;
      Auth.login(demo);
      var roleLabels = { admin:'Administrador', gerente:'Gerente', cajero:'Cajero', mesero:'Mesero', cocina:'Cocina' };
      var label = roleLabels[role] || role;
      var home = ROLE_HOMES[role] || '/backoffice/dashboard.html';
      if (window.UI && typeof window.UI.toast === 'function') {
        window.UI.toast({ type: 'success', title: 'Cambiado a ' + label, sub: 'Redirigiendo al módulo…' });
      }
      setTimeout(function () { window.location.href = home; }, 900);
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
        var target = rule.replace('__redirect__', '');
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

    // ── Init general ──
    init: function () {
      Auth.applySidebar();
      Auth.applyRequires();
      Auth.injectRoleSwitcher();
      Auth._wireSidebarLogout();
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
