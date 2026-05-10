# Sprint 00 — Fundación

> **Objetivo:** preparar todo lo transversal antes de tocar pantallas. Sin este sprint, ningún otro funciona visualmente.
> **Estimado:** 4–6 horas.
> **Pantallas creadas:** 0 (es infraestructura) + el `index.html` landing del demo.

## Archivos JSX de referencia (leer antes de codear)

| Sección | Archivo |
|---|---|
| 0.1 Tokens | `design-system/ds-tokens.jsx` |
| 0.2 Atómicos | `design-system/ds-components.jsx` (paneles ButtonsPanel, InputsPanel, BadgesPanel) |
| 0.3 Compuestos | `design-system/ds-components.jsx` (CardsPanel, TablePanel) + `design-system/backoffice/bo-shared.jsx` (KPICard, AlertBanner) |
| 0.4 Overlays | `design-system/ds-components.jsx` (ModalPanel, DrawerPanel, ToastsPanel) + `design-system/backoffice/bo-shared.jsx` (DrawerOverlay) |
| 0.5 Tema | (no requiere JSX, es funcionalidad nueva) |
| 0.6 Backoffice Shell | `design-system/backoffice/bo-shared.jsx` (BackofficeSidebar, BackofficeTopbar, BackofficeShell) |
| 0.7 Landing | `design-system/ds-identity.jsx` (logo) |

---

## Sección 0.1 — Tokens de diseño (`assets/css/tokens.css`)

### Prompt para Claude Code

```
Leé design-system/ds-tokens.jsx (175 líneas). En él hay un objeto DST con dos modos
(light, dark) y estados (success, error, warning, info), más una escala tipográfica.

Crear assets/css/tokens.css con variables CSS bajo dos selectores:
  :root                  → modo claro (DST.light + estados)
  [data-theme="dark"]    → modo oscuro (DST.dark + estados)

Variables a crear (mantener los nombres):
  --bg, --alt, --text, --muted, --accent, --accent-hover, --border
  --success, --error, --warning, --info

Incluí también:
- Escala tipográfica de TypographyPanel (display, h1, h2, h3, body-l, body, body-s, caption, overline).
  Por cada nivel: --fs-display, --fw-display, --lh-display, --ls-display, etc.
- Font-family: --ff-base con 'Inter' + fallbacks.
- Importar Inter desde Google Fonts (en el CSS con @import o esperar a que cada HTML lo importe).
- Escala de espaciado:
    --space-1: 4px;   --space-2: 8px;   --space-3: 12px; --space-4: 16px;
    --space-5: 20px;  --space-6: 24px;  --space-8: 32px; --space-10: 40px;
- Radios:
    --radius-sm: 6px;  --radius-md: 8px;  --radius-lg: 11px; --radius-xl: 14px;
- Sombras (basadas en boxShadow del modal y drawer en ds-components.jsx):
    --shadow-sm, --shadow-md, --shadow-lg

Reset minimal al inicio del archivo: *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html,body { font-family: var(--ff-base); background: var(--bg); color: var(--text); }
```

### Hecho cuando

Creás un HTML de prueba con `<div style="background:var(--accent);width:100px;height:100px"></div>`
y se ve `#4F46E5`. Setear `<html data-theme="dark">` cambia `--bg` a `#0A0A0A`.

---

## Sección 0.2 — Componentes atómicos (`assets/css/components.css`)

### Prompt para Claude Code

```
Leé design-system/ds-components.jsx — paneles ButtonsPanel (línea ~21), InputsPanel (~72),
BadgesPanel (~109).

En assets/css/components.css definí clases reutilizables que repliquen los estilos exactos.
TODO debe usar variables CSS de tokens.css — cero hardcoded.

BOTONES:
  .btn (base — padding, border-radius, font-size 13, cursor pointer, transición suave)
  .btn-primary    → bg accent, color #fff
  .btn-secondary  → bg transparent, border 1px solid border, color text
  .btn-ghost      → bg transparent, color accent
  .btn-destructive → bg #EF4444 (--error), color #fff
  Estados: :hover y :disabled para cada uno (ver hover en el panel: aHover para primary,
  alt bg para secondary, etc.)
  Tamaños: .btn-sm (padding más chico), .btn-lg (más grande).

INPUTS:
  .field (wrapper div con margin-bottom)
  .field-label (font-size 12, font-weight 500, color text)
  .field-input (width 100%, padding 8px 12px, border-radius 8, border 1px solid border, bg bg)
  .field-input.is-error → border --error
  .field-input:disabled → opacity .5, cursor not-allowed
  .field-hint (font-size 11, color muted, margin-top 4)
  .field-error (mismo .field-hint pero color --error, prefijar con ⚠ via ::before)
  .field-required-mark (asterisco visual)

BADGES:
  .badge (base inline-flex, gap 6, padding 4px 10px, border-radius 20, font-size 12, font-weight 500)
  .badge .dot → width 6, height 6, border-radius 50%
  .badge-success, .badge-error, .badge-warning, .badge-muted, .badge-info
  Colores en MODO CLARO + variantes en MODO OSCURO usando [data-theme="dark"] .badge-* (ver el
  array `badges` del JSX — cada uno tiene bg/color/dot diferente por modo).
  Tamaños: .badge-sm, .badge-md, .badge-lg
```

### Hecho cuando

Podés escribir `<button class="btn btn-primary">Confirmar</button>` y se ve idéntico al panel
del JSX. Igual con `<input class="field-input is-error">` y badges.

---

## Sección 0.3 — Componentes compuestos (extender `components.css`)

### Prompt para Claude Code

```
Leé:
- design-system/ds-components.jsx → CardsPanel y TablePanel
- design-system/backoffice/bo-shared.jsx → KPICard (línea ~477) y AlertBanner (línea ~406)

Agregar a assets/css/components.css:

CARDS:
  .card (bg, border 1px solid border, border-radius lg, overflow hidden)
  .card-header (padding 16 20, border-bottom)
  .card-body (padding 16 20)
  .card-footer (padding 12 20, border-top, display flex justify-end gap 8)
  .card-title, .card-meta

TABLA:
  .table (width 100%, border-collapse, font-family base)
  .table th (padding 11 14, text-align left, font-size 11, font-weight 600,
             color muted, text-transform uppercase, letter-spacing .04em, border-bottom)
  .table td (padding 13 14, font-size 13, border-bottom 1px solid border)
  .table-row:hover (bg alt)
  .table-row.is-active (bg de tinte accent)
  Versión mobile: .table-stack — convierte filas en cards apiladas con label-value
    (usar @media (max-width: 768px) y data attributes para los labels)

KPI CARD (de bo-shared.jsx):
  .kpi-card (padding 16 18, bg, border, border-radius lg, display flex flex-col gap 8)
  .kpi-label (font-size 11, font-weight 500, color muted, uppercase, letter-spacing .04em)
  .kpi-value (font-size 26, font-weight 700, color text, font-variant-numeric tabular-nums)
  .kpi-delta (font-size 11, color según tone, display flex items-center gap 4)
    .kpi-delta.up   → color --success
    .kpi-delta.down → color --error
    .kpi-delta.flat → color --muted
  .kpi-icon-wrap (width 30, height 30, border-radius 8, bg alt, display flex center)
  Tonos del card completo:
    .kpi-card.tone-success → bg #F0FDF4 (light) / rgba(16,185,129,.10) (dark), border verde claro
    .kpi-card.tone-warning → mismo patrón con #FFFBEB / amarillo
    .kpi-card.tone-error   → #FEF2F2 / rojo
    .kpi-card.tone-muted   → #F9FAFB / gris

ALERT BANNER (de bo-shared.jsx, usado en B1 y B17):
  .alert-banner (border-left 4px solid --error, bg #FEF2F2 light / rgba(239,68,68,.08) dark,
                 border-radius 10, padding 14 18, margin-bottom 18)
  .alert-banner-title (display flex items-center gap 9, font-size 13, font-weight 600,
                        color #7F1D1D light / #FCA5A5 dark)
  .alert-banner-icon-wrap (width 26, height 26, border-radius 7, bg #FEE2E2)
  .alert-banner-item (padding-top 14 si no es primero, border-top entre items)
  .alert-banner-item .meta (font-size 11, color muted)
  .alert-banner-item .title (font-size 13, font-weight 600)
  .alert-banner-item .detail (font-size 12, color muted, line-height 1.5)
  .alert-banner-actions (display flex gap 8, flex-wrap)
```

### Hecho cuando

Card simple, tabla con 5 filas, KPI card con delta, y alert banner con 2 items se ven idénticos
a los paneles del DS en ambos temas.

---

## Sección 0.4 — Overlays (`assets/js/ui.js` + extender `components.css`)

### Prompt para Claude Code

```
Leé:
- design-system/ds-components.jsx → ModalPanel (línea ~349), DrawerPanel (~386), ToastsPanel (~323)
- design-system/backoffice/bo-shared.jsx → DrawerOverlay (línea ~213)

CSS en components.css:

MODAL:
  .modal-backdrop (position fixed, inset 0, bg rgba(0,0,0,.42), z-index 50,
                   display flex items-center justify-center, opacity 0 hidden, transition opacity)
  .modal-backdrop.is-open (opacity 1)
  .modal (width 320 default, max-width calc(100vw - 32px) en mobile, bg, border-radius 14,
          border, box-shadow xl, overflow hidden)
  .modal-header (padding 16 20, border-bottom, display flex justify-between items-center,
                 font-size 15 font-weight 700)
  .modal-body (padding 16 20)
  .modal-footer (padding 12 20, border-top, display flex justify-end gap 8)
  .modal-close (botón × con cursor pointer, font-size 18, color muted)
  Tamaños: .modal-sm (320), .modal-md (480), .modal-lg (640)

DRAWER (right-side, 480px desktop, full-width móvil):
  .drawer-backdrop (igual al modal pero justify-end)
  .drawer (width 480, height 100%, bg, border-left, display flex flex-col,
           transform translateX(100%) hidden, transition transform 240ms)
  .drawer.is-open (transform translateX(0))
  @media (max-width: 768px) .drawer { width: 100%; }
  .drawer-header, .drawer-body (overflow auto), .drawer-footer

TOASTS:
  .toast-container (position fixed, top 16, right 16, z-index 100, display flex flex-col gap 10,
                    max-width 400)
  .toast (display flex items-start gap 10, bg específico por tipo, border-left 1px solid type,
          border-radius 10, padding 11 14, animation slide-in)
  .toast-success → bg #ECFDF5 light / #0a2218 dark, border --success
  .toast-error   → bg #FEF2F2 / #2c0a0a, border --error
  .toast-warning → bg #FFFBEB / #271a00, border --warning
  .toast-icon (width 20, height 20, border-radius 50%, bg del color del toast,
               display flex center, color #fff, font-size 10, font-weight 700)
  .toast-title (font-size 13, font-weight 600)
  .toast-sub (font-size 11, color muted)
  Animación @keyframes slide-in (translateX(100%) → 0)

JS en assets/js/ui.js:
  Crear un objeto global UI con métodos:

    UI.openModal(id)       → busca [id], le agrega .is-open al backdrop padre,
                              añade listener ESC y click en backdrop para cerrar
    UI.closeModal(id)      → quita .is-open
    UI.openDrawer(id), UI.closeDrawer(id) → idéntico
    UI.toast({ type, title, sub, duration = 4000 }) → crea elemento, lo agrega a
                              .toast-container (crea el container si no existe), auto-quitar tras duration
    UI.tabs(containerSelector) → busca [data-tab] y [data-panel] dentro;
                              click en tab activa el panel correspondiente
    UI.bindAutoTriggers()  → busca todos los [data-open-modal="id"], [data-open-drawer="id"],
                              [data-close] y les agrega listeners. Llamar al final del archivo.

  Llamar UI.bindAutoTriggers() en DOMContentLoaded.
  Cerrar con ESC, click en backdrop o cualquier elemento [data-close] dentro del overlay.
```

### Hecho cuando

```html
<button data-open-modal="confirm">Abrir</button>
<div id="confirm" class="modal-backdrop">
  <div class="modal modal-sm">
    <div class="modal-header">Confirmar <button class="modal-close" data-close>×</button></div>
    <div class="modal-body">¿Estás seguro?</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-close>Cancelar</button>
      <button class="btn btn-primary">Confirmar</button>
    </div>
  </div>
</div>
```

abre, cierra con ESC/backdrop/×. Igual con drawer y toasts.

---

## Sección 0.5 — Sistema de tema (`assets/js/theme.js`)

### Prompt para Claude Code

```
Crear assets/js/theme.js que se ejecute ANTES del CSS para evitar flash:

(función IIFE en el <head> de cada HTML, antes de cargar tokens.css):
  const stored = localStorage.getItem('theme');
  const theme = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

Después definir window.toggleTheme():
  - lee data-theme actual del <html>
  - alterna y guarda en localStorage
  - dispara evento custom 'themechange'

Listener delegado para [data-toggle-theme]:
  - click ejecuta toggleTheme()
  - actualiza el ícono del botón (sol/luna lucide) según estado

Componente reutilizable (no es un componente real, es un snippet HTML estándar a incluir):
  <button class="btn-icon" data-toggle-theme aria-label="Cambiar tema">
    <i data-lucide="sun" class="theme-icon-light"></i>
    <i data-lucide="moon" class="theme-icon-dark"></i>
  </button>

CSS asociado (agregar a components.css):
  [data-theme="light"] .theme-icon-dark  { display: none; }
  [data-theme="dark"]  .theme-icon-light { display: none; }
  .btn-icon (width 34, height 34, border-radius 8, bg alt, border, cursor pointer, display flex center)

IMPORTANTE: este script se carga en TODOS los HTML del proyecto. Incluirlo como
<script src="/assets/js/theme.js"></script> en el <head> antes del CSS.
```

### Hecho cuando

Cualquier botón con `data-toggle-theme` cambia el tema globalmente y persiste al recargar.
No hay flash de tema incorrecto al cargar.

---

## Sección 0.6 — Backoffice Shell (`assets/css/shells.css` + plantilla)

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-shared.jsx líneas 264 a 400:
- BO_NAV (array de grupos y items para el sidebar)
- BackofficeSidebar (línea 265)
- BackofficeTopbar (línea 338)
- BackofficeShell (línea 388)

Crear assets/css/shells.css con:

LAYOUT:
  .bo-shell (width 100%, height 100vh, display flex, bg, overflow hidden)
  .bo-content-wrap (flex 1, display flex flex-col, overflow hidden)
  .bo-content (flex 1, overflow auto, padding 24)

SIDEBAR (240px):
  .bo-sidebar (width 240, flex-shrink 0, height 100%, bg alt, border-right, display flex flex-col)
  .bo-sidebar-header (padding 14, border-bottom)
    Logo cuadrado 30x30 con "I" blanca sobre accent + texto "Inventario"
    Botón selector negocio: avatar "EB" + label "Negocio: El Buen Sabor" + chevron
  .bo-sidebar-nav (flex 1, overflow auto, padding 12 8)
  .bo-sidebar-group (margin-bottom 14)
  .bo-sidebar-group-title (font-size 10, font-weight 600, color muted, uppercase,
                            letter-spacing .06em, padding 4 8 6)
  .bo-sidebar-item (width 100%, padding 7 10, border-radius 7, border none, cursor pointer,
                     bg transparent, color muted, display flex items-center gap 10,
                     font-size 12, font-weight 500, position relative)
  .bo-sidebar-item:hover (bg suave)
  .bo-sidebar-item.is-active (bg, color text, font-weight 600, box-shadow sm)
    ::before pseudo: barra vertical 3x18 izquierda color accent
  .bo-sidebar-footer (padding 10 12, border-top, display flex items-center gap 10)
    avatar 30x30 + nombre/rol + botón logout

TOPBAR (56px):
  .bo-topbar (height 56, flex-shrink 0, bg, border-bottom,
              display flex items-center px 22, gap 18)
  .bo-breadcrumb (display flex items-center gap 6, font-size 13, color muted)
    Item activo (último): color text, font-weight 600
    Separador: chevron-right
  .bo-topbar-spacer (flex 1)
  .bo-topbar-sucursal (button: padding 7 12, border-radius 7, bg alt, border, ícono store)
  .bo-topbar-actions (display flex items-center gap 8)
    Botones search, bell (con dot rojo), avatar
    Botón hamburguesa visible solo en mobile

GRUPOS Y ITEMS DEL SIDEBAR (replicar EXACTO BO_NAV del JSX):
  Operación: Dashboard, POS, KDS, Caja
  Gestión: Catálogo, Inventario, Clientes, Proveedores, Gastos
  Finanzas: Facturación DIAN, Contabilidad, Reportes
  Config: Configuración, Usuarios, Roles
  Cada item con su ícono lucide del array.

RESPONSIVE:
  >= 1024px: sidebar fijo 240px.
  768-1023px: sidebar oculto por default, se desliza desde izq con backdrop al togglear.
              Botón hamburguesa visible en topbar izq.
  < 768px: igual, pero el contenido ocupa 100% siempre.

  CSS para mobile sidebar:
    .bo-sidebar { transform: translateX(-100%); transition: transform 240ms; position: fixed; z-index: 60; }
    .bo-sidebar.is-open { transform: translateX(0); }
    + backdrop .bo-sidebar-backdrop visible cuando is-open
  En desktop (>= 1024px), sidebar siempre visible:
    @media (min-width: 1024px) {
      .bo-sidebar { transform: none; position: static; }
      .bo-hamburguer { display: none; }
    }

JS en ui.js (agregar):
  Listener para .bo-hamburguer → toggle .is-open en .bo-sidebar y backdrop.
  Click en backdrop o resize >= 1024 → quita is-open.

CREAR PLANTILLA backoffice/_layout.html:
  HTML completo con:
    <head> con tokens.css, components.css, shells.css, lucide CDN, theme.js
    <body> con la estructura .bo-shell completa, sidebar con todos los grupos,
    topbar con breadcrumb placeholder ["Módulo", "Página"], <main class="bo-content"> vacío
    para que cada página real lo copie y rellene.
    Comentario al inicio: "<!-- Plantilla de referencia. Copiar a [pagina].html y rellenar -->"
```

### Hecho cuando

Copiás `_layout.html` como `dashboard.html`, cambiás el `is-active` a `dashboard`, ajustás
breadcrumb a `["Inicio", "Dashboard"]`, y se ve perfecto en mobile/tablet/desktop con el
toggle de tema funcionando.

---

## Sección 0.7 — Landing del demo (`index.html`)

### Prompt para Claude Code

```
Leé design-system/ds-identity.jsx (124 líneas) para ver las variantes del logo.

Crear /index.html: landing simple del demo.

Estructura:
  <header> con logo "Inventario" + toggle tema + link "GitHub" (mock).
  <main>:
    Hero: título "Inventario POS — Demo del sistema",
          subtítulo "7 módulos · ~46 pantallas · navegación completa",
          botón "Empezar por el Backoffice →" lleva a /backoffice/dashboard.html
    Grid responsive (3-2-1 cols según viewport) de cards de módulos:
      1. Auth          — "Acceso al sistema"           — 5 pantallas — link /auth/login.html       — ícono lock
      2. POS Web       — "Punto de venta para mesero/cajero" — 5 pantallas — /pos/mapa.html           — ícono shopping-bag
      3. App Mesero    — "App móvil para meseros"      — 9 pantallas — /mesero/login.html         — ícono utensils
      4. KDS           — "Pantalla de cocina"          — 2 pantallas — /kds/main.html             — ícono chef-hat
      5. Backoffice    — "Administración del negocio"  — 20 pantallas — /backoffice/dashboard.html — ícono layout-dashboard
      6. Storefront    — "Cara al cliente (carta + tienda)" — 6 pantallas — /storefront/carta.html — ícono store
    Sección "Sistema base":
      Card especial que linkea a /design-system/00-sistema-base.html (si querés mostrar el DS original)
      o sección con tokens (paleta, tipografía) inline.
  <footer> minimal: "Inventario POS · Demo v1.0 · 2026" + créditos.

CSS:
  Cada card de módulo: padding 24, border-radius lg, border, bg, hover translateY(-2px) + shadow,
  ícono grande arriba (40x40 con bg accent suave), nombre h3, descripción p, contador chip.
  Grid: grid-template-columns repeat(auto-fit, minmax(280px, 1fr)).

Mobile-first. Cards stack en 1 columna < 640px, 2 cols hasta 1024, 3 cols arriba.
```

### Hecho cuando

Abrís `index.html`, ves los 7 módulos en grid responsive, clickás cualquiera y vas a su pantalla
principal. Toggle de tema funciona. Funciona desde 360px hasta 1920px sin scroll horizontal.

---

## Checklist final del Sprint 0

Antes de pasar al Sprint 1, validá:

- [ ] `tokens.css` define las 13+ variables principales y la escala tipográfica.
- [ ] Cambiar `data-theme` en `<html>` cambia colores en toda la página.
- [ ] `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-destructive` se ven idénticos al JSX.
- [ ] `.field-input` con estados error y disabled funcionan visualmente.
- [ ] `.badge-success`, `.badge-error`, etc. con dot.
- [ ] `.card`, `.table`, `.kpi-card` con tonos y delta.
- [ ] `.alert-banner` con borde rojo izquierdo y items.
- [ ] Modal abre con `data-open-modal`, cierra con ESC/×/backdrop.
- [ ] Drawer derecho 480px desktop, full móvil.
- [ ] Toasts desde `UI.toast({...})` se apilan top-right y se auto-cierran.
- [ ] Tema persiste en localStorage, no hay flash al cargar.
- [ ] Backoffice shell completo (sidebar 240px desktop, drawer en mobile, topbar con breadcrumb).
- [ ] `_layout.html` se puede copiar como punto de partida de cualquier página BO.
- [ ] `index.html` tiene los 7 módulos en grid responsive con links válidos (aunque los destinos
      aún no existan — se crearán en sprints siguientes).

Si todo lo anterior pasa, **commit con mensaje** `feat: sprint 0 fundación completa` y arrancá el Sprint 1.
