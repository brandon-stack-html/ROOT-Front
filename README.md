# Inventario POS — Demo

Demo navegable del sistema **Inventario POS**, un SaaS para restaurantes en Colombia.
HTML + CSS + JavaScript vanilla, sin build, sin backend.

## Qué hay acá

7 módulos, ~48 pantallas, todas conectadas:

| Módulo | Pantallas | Entrar por |
|---|---|---|
| Auth | 5 | [auth/login.html](auth/login.html) |
| Backoffice | 18 | [backoffice/dashboard.html](backoffice/dashboard.html) |
| POS Web | 4 | [pos/apertura.html](pos/apertura.html) |
| App Mesero | 8 | [mesero/login.html](mesero/login.html) (PIN: `1234`) |
| KDS | 2 | [kds/main.html](kds/main.html) |
| Storefront | 6 | [storefront/tienda.html](storefront/tienda.html) |

O abrí [`index.html`](index.html) para ver todos los módulos en un grid.

## Cómo correrla

Doble-click a `index.html` puede funcionar, pero algunos navegadores bloquean fetch
de archivos locales. Mejor servirla desde un servidor estático:

```bash
# Opción 1: Python (viene con Mac/Linux)
python3 -m http.server 8000

# Opción 2: Node (si lo tenés instalado)
npx serve .

# Opción 3: VS Code
# Instalá la extensión "Live Server" y click derecho en index.html → Open with Live Server
```

Después abrí `http://localhost:8000` en tu navegador.

> Importante: los HTMLs del módulo `auth/` y los links del Ctrl+K usan paths
> **absolutos** (`/assets/...`, `/backoffice/...`). Necesitás el servidor para
> que resuelvan bien — no abras esos archivos con doble-click.

## Atajos útiles

- **Ctrl + K** (o **Cmd + K** en Mac): buscador de pantallas — saltar a cualquiera.
- **Botón flotante abajo-izquierda**: volver al index desde cualquier pantalla.
- **Toggle de tema**: ☀️ / 🌙 en el topbar de cada módulo (persiste en localStorage).
- **Tab**: navegar por elementos enfocables; el foco se resalta con un anillo violeta.
- **PIN de mesero**: `1234`.

## Estructura del repo

```
.
├── index.html              ← landing con grid de módulos
├── README.md               ← este archivo
├── CLAUDE.md               ← convenciones del proyecto (solo si editás con Claude Code)
├── design-system/          ← JSX mockups originales (referencia visual, no se ejecutan)
├── docs/                   ← documentación de los 11 sprints (humano + AI)
├── assets/
│   ├── css/                ← tokens, components, shells, utilities + per-módulo
│   ├── js/                 ← theme, ui (modales/drawers/toasts/tabs), nav (Ctrl+K), storefront
│   └── icons/              ← opcional
├── auth/                   ← 5 pantallas de autenticación
├── backoffice/             ← 20 pantallas de administración
├── pos/                    ← 4 pantallas de POS web
├── mesero/                 ← 8 pantallas de app mesero (mobile)
├── kds/                    ← 2 pantallas de cocina (tablet)
└── storefront/             ← 6 pantallas cara al cliente
```

## Cómo agregar una pantalla nueva

1. Copiar la plantilla del módulo (`backoffice/_layout.html`, `pos/_layout.html`, etc.).
2. Cambiar el sidebar item activo y el breadcrumb.
3. Llenar `<main>` con el contenido específico.
4. Agregar la pantalla al array `PAGES` en `assets/js/nav.js` para que aparezca en Ctrl+K.
5. Si es un módulo nuevo, agregar la card al `index.html`.

## Tokens disponibles

Definidos en `assets/css/tokens.css`:

```css
/* Colores principales */
--bg, --alt, --text, --muted, --accent, --accent-hover, --border

/* Estados */
--success, --error, --warning, --info

/* Tipografía */
--ff-base               /* Inter, sans-serif */
--fs-display, --fs-h1, --fs-h2, --fs-h3, --fs-body, --fs-body-s, --fs-caption
--fw-* y --lh-*

/* Espaciado */
--space-1 a --space-10 (4 a 40px)

/* Radios */
--radius-sm, --radius-md, --radius-lg, --radius-xl

/* Sombras */
--shadow-sm, --shadow-md, --shadow-lg
```

Todos cambian automáticamente cuando `[data-theme="dark"]` está en `<html>`.

## Componentes disponibles

Definidos en `assets/css/components.css`:

- Botones: `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-destructive`
- Inputs: `.field`, `.field-input`, `.field-label`, `.field-hint`, `.field-error`
- Badges: `.badge` + `.badge-success` / `.badge-error` / `.badge-warning` / `.badge-info` / `.badge-muted`
- Cards: `.card`, `.card-header`, `.card-body`, `.card-footer`
- Tablas: `.table` con stack en mobile
- KPIs: `.kpi-card` + tonos `.tone-success` / `.tone-warning` / `.tone-error` / `.tone-muted`
- Alert banner: `.alert-banner`
- Modal, Drawer, Toast, Bottom Sheet: ver `assets/js/ui.js`
- Tabs: `data-tabs="id"` + `data-tab="key"` + `data-panel="key"`
- Empty state: `.empty-state` + `.empty-state-icon` / `.empty-state-title` / `.empty-state-text`

Utilidades globales en `assets/css/utilities.css`:

- `:focus-visible` con anillo violeta para a11y
- `.skip-link` para saltar al contenido principal
- `.skeleton` para placeholders de carga
- `@media (prefers-reduced-motion: reduce)` desactiva animaciones

## API de JS global

```javascript
UI.openModal('id')              // abre modal con ese id
UI.closeModal('id')
UI.openDrawer('id')
UI.closeDrawer('id')
UI.openBottomSheet('id')        // mesero / storefront
UI.closeBottomSheet('id')
UI.toast({ type, title, sub, duration })  // type: success | error | warning | info
UI.tabs(containerSelector)
UI.toggleEmpty(targetSelector, hasResults) // muestra/oculta empty state

toggleTheme()                   // alterna light/dark, persiste en localStorage
```

## Datos mock

Los datos en las pantallas (nombres de productos, precios, clientes, sucursales) son
ficticios pero realistas para Colombia: cédulas formato `1.012.345.678`, NIT, sedes,
integraciones Mercado Pago / Wompi / Rappi / Siigo, etc. Todo es estático — no hay
BD ni backend.

## Tecnologías

- HTML5
- CSS3 (variables, grid, flexbox)
- JavaScript ES2020+ (sin frameworks)
- [Inter](https://fonts.google.com/specimen/Inter) desde Google Fonts
- [Lucide](https://lucide.dev) desde CDN para íconos

## Licencia

Demo interna. No es código de producción.

## Créditos

Sistema de diseño: equipo Inventario POS, 2026.
Implementación de la demo: hecha con Claude Code siguiendo los specs en `/docs/`.
