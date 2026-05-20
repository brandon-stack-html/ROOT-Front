# Autenticación y roles — `assets/js/auth.js`

> Sprint 14. Sistema mínimo de roles para que la demo se comporte como un SaaS real: el rol activo filtra el sidebar, los CTAs y redirige a la sección correcta.

## 1. Roles definidos

| Rol | Acceso resumido |
|---|---|
| `admin` | Todo el Backoffice + POS + KDS + Mesero |
| `gerente` | Backoffice (sin Usuarios, Roles, Integraciones, Facturación DIAN) + POS + KDS |
| `cajero` | POS + Dashboard, Caja y Reportes del Backoffice (read-only) |
| `mesero` | Solo la app del Mesero (redirige fuera del backoffice) |
| `cocina` | Solo el KDS (redirige fuera del backoffice) |

Usuarios demo por rol (`DEMO_USERS` en `auth.js`):

| Rol | userId | Nombre | Iniciales |
|---|---|---|---|
| admin | `usr-001` | Juan Camilo | JC |
| gerente | `usr-002` | Ana Lucía | AL |
| cajero | `usr-003` | Miguel R. | MR |
| mesero | `usr-004` | Camila V. | CV |
| cocina | `usr-005` | Carlos F. | CF |

## 2. Matriz de permisos

Los permisos siguen el formato `recurso:acción`. El comodín `*` aplica tanto al recurso como a la acción.

| Recurso | admin | gerente | cajero | mesero | cocina |
|---|:---:|:---:|:---:|:---:|:---:|
| `users:read` | ✓ | – | – | – | – |
| `users:write` | ✓ | – | – | – | – |
| `users:delete` | ✓ | – | – | – | – |
| `roles:read` | ✓ | – | – | – | – |
| `roles:write` | ✓ | – | – | – | – |
| `billing:*` | ✓ | – | – | – | – |
| `integrations:*` | ✓ | – | – | – | – |
| `dashboard:read` | ✓ | ✓ | ✓ | – | – |
| `reports:read` | ✓ | ✓ | ✓ | – | – |
| `reports:export` | ✓ | ✓ | – | – | – |
| `pos:*` | ✓ | ✓ | ✓ | – | – |
| `kds:*` | ✓ | ✓ | – | – | ✓ |
| `cash:*` | ✓ | ✓ | ✓ | – | – |
| `catalog:*` | ✓ | ✓ | – | – | – |
| `inventory:*` | ✓ | ✓ | – | – | – |
| `clients:*` | ✓ | ✓ (sin delete) | – | – | – |
| `suppliers:*` | ✓ | ✓ | – | – | – |
| `expenses:*` | ✓ | ✓ | – | – | – |
| `payroll:read/write` | ✓ | ✓ | – | – | – |
| `payroll:self` | – | – | – | ✓ | – |
| `tables:*` | ✓ | ✓ | – | ✓ | – |
| `orders:write` | ✓ | ✓ | – | ✓ | – |

> La fuente de verdad es la constante `PERMISSIONS` en `auth.js`. Esta tabla es el reflejo legible para QA y stakeholders.

## 3. API pública (`window.Auth`)

```js
Auth.current()          // {userId, name, role, permissions, ...}
Auth.can(permission)    // boolean — soporta wildcard (p.ej. "users:*")
Auth.login(userData)    // persiste en localStorage:root:auth:v1 y devuelve el user con permisos hidratados
Auth.logout()           // limpia y redirige a /auth/login.html
Auth.requireRole(role)  // redirige a /index.html si el rol no coincide
Auth.switchRole(role)   // solo si DEMO_MODE; loguea como el usuario demo de ese rol y recarga
Auth.filterNavItems(items)  // filtra arreglo de items {permission, ...} con can()
```

Helpers internos que corren en cada página vía `Auth.init()`:

- `Auth.applySidebar()` — oculta los items del sidebar según `SIDEBAR_RESTRICTIONS[rol]`. Si el rol es `mesero` o `cocina`, redirige fuera del Backoffice/POS al área correspondiente.
- `Auth.applyRequires()` — recorre `[data-requires="permission"]` y oculta los elementos que no cumplen.
- `Auth.injectRoleSwitcher()` — inyecta el dropdown del avatar en la topbar (solo en `DEMO_MODE`).

## 4. Persistencia

| Key | Contenido | Generado por |
|---|---|---|
| `root:auth:v1` | usuario logueado `{userId, name, initials, role, permissions}` | `Auth.login()` / auto-init en `Auth.current()` |
| `root:users:v1` | lista de usuarios del negocio (seed 12) | `backoffice/usuarios.html` |
| `root:roles:v1` | matriz de overrides de permisos | `backoffice/roles.html` |

Si `root:auth:v1` no existe, `Auth.current()` auto-inicializa como admin demo para que la demo arranque sin necesidad de login.

## 5. Cómo usar en una pantalla nueva

### 5.1 Ocultar un botón por permiso

```html
<button class="btn btn-danger" data-requires="users:delete">
  Eliminar usuario
</button>
```

Se oculta automáticamente cuando `Auth.init()` corre (todas las páginas que cargan `nav.js` lo hacen, porque `nav.js` carga `auth.js` dinámicamente).

### 5.2 Chequeo programático

```js
if (Auth.can('reports:export')) {
  renderExportButton();
}
```

### 5.3 Forzar un rol (página exclusiva)

```js
// En la cabecera de un script de página
Auth.requireRole('mesero');
```

## 6. Switcher de rol (DEMO_MODE)

Para demostrar el sistema sin login real:

- Click en el avatar de la topbar → dropdown con los 5 roles demo + "Cerrar sesión".
- Al elegir un rol, `Auth.switchRole(role)` loguea como ese usuario y recarga la página.
- Bandera `DEMO_MODE = true` en `auth.js`. Pasarla a `false` desactiva el switcher (modo "producción").

## 7. Decisiones tomadas

- **No hay login real ni hashing**: es una demo. La key `root:auth:v1` se puede editar a mano en DevTools.
- **Los permisos viven en `auth.js`**, no en cada pantalla, para evitar duplicación. La matriz UI en `backoffice/roles.html` permite overrides que se guardan en `root:roles:v1` pero por ahora no se leen de vuelta — son cambios visuales para mostrar la capacidad del sistema.
- **El sidebar se filtra ocultando items**, no re-renderizando, porque el shell es HTML estático. Si en algún momento migramos a render dinámico, `Auth.filterNavItems()` ya está listo.
