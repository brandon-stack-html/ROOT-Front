# Sprint 10 — Pulido y QA

> **Objetivo:** dejar la demo lista para presentar — navegación global, estados vacíos, accesibilidad, performance, cross-browser y README final.
> **Estimado:** 3 horas.
> **Es un sprint cross-cutting:** toca todos los archivos del repo, no genera pantallas nuevas.
> **Dependencias:** Sprints 0–9 completos.

## Por qué este sprint existe

Hasta acá tenés 46 pantallas funcionales. Pero hay cosas transversales que ningún sprint
anterior cubrió completamente:
- Volver fácil al index desde cualquier pantalla.
- Atajo Ctrl+K para saltar entre pantallas (esencial para presentar).
- Estados vacíos donde hace falta (tablas, listas).
- Verificación de accesibilidad básica (contraste, focus, labels).
- Smoke test cross-browser.
- README para que alguien que no sos vos pueda correr la demo.

---

## Sección 10.1 — Navegación global (`assets/js/nav.js`)

### Prompt para Claude Code

```
Crear assets/js/nav.js que se incluya en TODOS los HTML del proyecto.

CONTENIDO:

1) Botón flotante "Volver al index" (visible en todas las pantallas excepto index.html y las
   pantallas full-screen tipo login/PIN):
   El script inyecta al final del body (si no es index):
     <a href="/index.html" class="nav-back-home" aria-label="Volver al demo">
       <i data-lucide="layout-grid"></i>
     </a>

   CSS .nav-back-home (agregar a utilities.css):
     position: fixed; bottom: 16; left: 16; z-index: 200;
     width: 44; height: 44; border-radius: 50%;
     bg: var(--accent); color: #fff;
     display: flex; align-items: center; justify-content: center;
     box-shadow: 0 4px 12px rgba(0,0,0,.2);
     cursor: pointer; transition: transform 150ms;
     text-decoration: none;
   .nav-back-home:hover { transform: scale(1.1); }
   .nav-back-home:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

   JS:
     if (location.pathname !== '/index.html' && !location.pathname.includes('/index')) {
       // No mostrar en login/PIN (pantallas full-screen pre-auth) — opcional.
       // Inyectar el botón al body.
     }

2) Atajo "Ir a..." con Ctrl+K (o Cmd+K en Mac):
   Inyectar modal en el body al cargar (oculto):
   <div id="navJumpModal" class="modal-backdrop">
     <div class="modal modal-md">
       <div class="modal-header">
         <input class="field-input nav-jump-input" placeholder="Saltar a pantalla...">
         <button class="modal-close" data-close>×</button>
       </div>
       <div class="modal-body" style="padding: 0; max-height: 60vh; overflow-y: auto;">
         <ul class="nav-jump-list">
           <!-- Items inyectados con JS -->
         </ul>
       </div>
       <div class="modal-footer">
         <span class="hint">↑↓ navegar · Enter ir · Esc cerrar</span>
       </div>
     </div>
   </div>

   Array PAGES con todas las pantallas:
   const PAGES = [
     { name: 'Inicio del demo', path: '/index.html', module: 'General' },
     // Auth
     { name: 'Login', path: '/auth/login.html', module: 'Auth' },
     { name: 'Registro', path: '/auth/registro.html', module: 'Auth' },
     { name: 'Recuperar contraseña', path: '/auth/recuperar.html', module: 'Auth' },
     { name: 'Restablecer contraseña', path: '/auth/restablecer.html', module: 'Auth' },
     { name: 'Selector de sucursal', path: '/auth/selector-sucursal.html', module: 'Auth' },
     // Backoffice
     { name: 'Dashboard', path: '/backoffice/dashboard.html', module: 'Backoffice' },
     { name: 'Usuarios', path: '/backoffice/usuarios.html', module: 'Backoffice' },
     { name: 'Roles y permisos', path: '/backoffice/roles.html', module: 'Backoffice' },
     { name: 'Configuración general', path: '/backoffice/configuracion.html', module: 'Backoffice' },
     { name: 'Sucursales', path: '/backoffice/sucursales.html', module: 'Backoffice' },
     { name: 'Mesas', path: '/backoffice/mesas.html', module: 'Backoffice' },
     { name: 'Catálogo', path: '/backoffice/catalogo.html', module: 'Backoffice' },
     { name: 'Producto', path: '/backoffice/producto.html', module: 'Backoffice' },
     { name: 'Inventario', path: '/backoffice/inventario.html', module: 'Backoffice' },
     { name: 'Categorías', path: '/backoffice/categorias.html', module: 'Backoffice' },
     { name: 'Conteo inventario', path: '/backoffice/conteo.html', module: 'Backoffice' },
     { name: 'Fichas técnicas', path: '/backoffice/fichas.html', module: 'Backoffice' },
     { name: 'Clientes', path: '/backoffice/clientes.html', module: 'Backoffice' },
     { name: 'Gastos', path: '/backoffice/gastos.html', module: 'Backoffice' },
     { name: 'Facturación DIAN', path: '/backoffice/dian.html', module: 'Backoffice' },
     { name: 'Reportes', path: '/backoffice/reportes.html', module: 'Backoffice' },
     { name: 'Caja', path: '/backoffice/caja.html', module: 'Backoffice' },
     { name: 'Integraciones', path: '/backoffice/integraciones.html', module: 'Backoffice' },
     // POS
     { name: 'POS · Apertura', path: '/pos/apertura.html', module: 'POS' },
     { name: 'POS · Mapa de mesas', path: '/pos/mapa.html', module: 'POS' },
     { name: 'POS · Toma de pedido', path: '/pos/pedido.html', module: 'POS' },
     { name: 'POS · Histórico', path: '/pos/historico.html', module: 'POS' },
     // Mesero
     { name: 'Mesero · Login PIN', path: '/mesero/login.html', module: 'Mesero' },
     { name: 'Mesero · Sala', path: '/mesero/sala.html', module: 'Mesero' },
     { name: 'Mesero · Mapa', path: '/mesero/mapa.html', module: 'Mesero' },
     { name: 'Mesero · Detalle mesa', path: '/mesero/detalle.html', module: 'Mesero' },
     { name: 'Mesero · Catálogo', path: '/mesero/catalogo.html', module: 'Mesero' },
     { name: 'Mesero · Comandas', path: '/mesero/comandas.html', module: 'Mesero' },
     { name: 'Mesero · Cobro', path: '/mesero/cobro.html', module: 'Mesero' },
     { name: 'Mesero · Perfil', path: '/mesero/perfil.html', module: 'Mesero' },
     // KDS
     { name: 'KDS · Pantalla cocina', path: '/kds/main.html', module: 'KDS' },
     { name: 'KDS · Configuración', path: '/kds/config.html', module: 'KDS' },
     // Storefront
     { name: 'Storefront · Carta QR', path: '/storefront/carta.html', module: 'Storefront' },
     { name: 'Storefront · Producto', path: '/storefront/producto.html', module: 'Storefront' },
     { name: 'Storefront · Tienda', path: '/storefront/tienda.html', module: 'Storefront' },
     { name: 'Storefront · Catálogo', path: '/storefront/tienda-catalogo.html', module: 'Storefront' },
     { name: 'Storefront · Checkout', path: '/storefront/checkout.html', module: 'Storefront' },
     { name: 'Storefront · Confirmación', path: '/storefront/confirmacion.html', module: 'Storefront' },
   ];

   Comportamiento:
   - Ctrl+K (o Cmd+K) abre el modal con input enfocado.
   - Tipear filtra la lista: matching simple por name + module (case insensitive).
   - Cada item con: módulo chip + nombre.
   - Flecha abajo/arriba navega items (selected: bg accent suave).
   - Enter va al path del item seleccionado.
   - Esc cierra.

   CSS .nav-jump-list:
     list-style: none.
     li (.nav-jump-item):
       padding 10 18, display flex justify-between items-center, cursor pointer.
       :hover, .is-selected: bg alt.
     .nav-jump-module (font-size 11, color muted, text-transform uppercase).

3) Inyectar nav.js en TODOS los HTML:
   En vez de modificar cada HTML manualmente, agregar al final del body:
     <script src="/assets/js/nav.js"></script>
   Y antes <script src="https://unpkg.com/lucide@latest"></script> para que el ícono de
   layout-grid renderice.

4) Compatibilidad con Mac:
   const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
   const cmdKey = isMac ? 'metaKey' : 'ctrlKey';
   document.addEventListener('keydown', (e) => {
     if (e[cmdKey] && e.key === 'k') {
       e.preventDefault();
       UI.openModal('navJumpModal');
       document.querySelector('.nav-jump-input').focus();
     }
   });
```

### Hecho cuando

- Botón flotante "Volver al demo" visible en todas las páginas (esquina inferior izq).
- Ctrl+K (Cmd+K en Mac) abre buscador con TODAS las pantallas.
- Tipear filtra, flechas navegan, Enter va a la pantalla.
- Esc cierra.

---

## Sección 10.2 — Estados vacíos y de error

### Prompt para Claude Code

```
Recorrer las páginas con tablas o listas y agregar/verificar EMPTY STATES claros.

Crear componente reusable .empty-state (agregar a components.css):
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60 24; text-align: center; color: var(--muted);
  .empty-state-icon { width: 80; height: 80; border-radius: 50%; bg: var(--alt);
                      display: flex; align-items: center; justify-content: center;
                      margin-bottom: 18; color: var(--muted); }
  .empty-state-icon i { width: 36; height: 36; }
  .empty-state-title { font-size: 16; font-weight: 600; color: var(--text); margin-bottom: 6; }
  .empty-state-text { font-size: 13; color: var(--muted); max-width: 320; line-height: 1.5;
                      margin-bottom: 18; }
  .empty-state-action { margin-top: 8; }

REVISAR estas páginas y agregar estado vacío si la búsqueda/filtro no da resultados:

1. backoffice/usuarios.html:
   Si search no matchea, ocultar la tabla y mostrar:
     Ícono users
     "No encontramos usuarios"
     "Probá con otro nombre o cédula, o limpiá los filtros."
     Botón "Limpiar filtros".

2. backoffice/inventario.html: mismo patrón con ícono boxes.
3. backoffice/catalogo.html: ícono package.
4. backoffice/clientes.html: ícono user-x.
5. backoffice/gastos.html: ícono receipt.
6. backoffice/dian.html: ícono file-text.
7. backoffice/caja.html (tab histórico): ícono archive.
8. mesero/comandas.html: ícono clipboard.
9. pos/historico.html: ícono history.
10. storefront/tienda-catalogo.html: ícono search-x.

JS reusable:
  Crear función global en ui.js:
    UI.toggleEmpty = (tableSelector, hasResults) => {
      const table = document.querySelector(tableSelector);
      const empty = table.parentElement.querySelector('.empty-state');
      table.hidden = !hasResults;
      if (empty) empty.hidden = hasResults;
    };
  Llamar desde los listeners de search/filtros existentes.

TOASTS de error en botones destructivos:
  Verificar que botones "Eliminar" (en tablas, en drawers) muestren confirmación antes de
  hacer mock-eliminación. Patrón:
    Click "Eliminar X":
      UI.openModal('modalConfirmar') con mensaje "¿Eliminar definitivamente X?"
      Confirmar → toast error suave + remove visual.
      Cancelar → cierra modal.

ESTADOS DE CARGA (opcional pero suma):
  Crear .skeleton (utilities.css):
    bg: linear-gradient(90deg, var(--alt) 0%, var(--bg) 50%, var(--alt) 100%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.4s infinite;
    border-radius: 6;
  @keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  No es obligatorio agregarlos en toda la app — la demo es estática. Pero documentar la clase
  para que sepas que existe.
```

### Hecho cuando

- Búsqueda en usuarios/inventario/catálogo/clientes muestra empty state cuando no hay match.
- Botones eliminar pasan por modal confirmación.
- Skeleton class disponible (no necesariamente aplicada en todos lados).

---

## Sección 10.3 — Accesibilidad

### Prompt para Claude Code

```
Auditoría rápida de a11y en todas las páginas.

Aplicar en el orden:

1) FOCUS VISIBLE (utilities.css):
   :focus { outline: none; }  /* quitar el default ugly */
   :focus-visible {
     outline: 3px solid var(--accent);
     outline-offset: 2px;
     border-radius: 4;
   }
   Override más fuerte para botones y inputs que ya tienen border:
     button:focus-visible, a:focus-visible, [role="button"]:focus-visible {
       outline: 3px solid var(--accent);
       outline-offset: 2px;
     }
     .field-input:focus-visible {
       outline: 2px solid var(--accent);
       outline-offset: 0;
       border-color: var(--accent);
     }

2) LABELS de inputs:
   Recorrer las páginas y verificar:
   - Todo <input> tiene <label> asociado (label[for] + input[id]).
   - Si visualmente no querés label, usar aria-label="Texto" en el input.
   Especialmente importante en:
   - Search inputs (suelen no tener label visible) → aria-label="Buscar".
   - Toggles tipo switch → label + aria-checked.

3) ARIA-LABEL en botones ícono:
   Botones que son SOLO ícono (sin texto) DEBEN tener aria-label:
     <button aria-label="Cerrar modal" data-close><i data-lucide="x"></i></button>
     <button aria-label="Toggle tema" data-toggle-theme>...</button>
     <button aria-label="Notificaciones"><i data-lucide="bell"></i></button>
   Auditá:
   - Todos los .modal-close, .drawer-close.
   - Todos los .btn-icon.
   - Toggle de tema.
   - Botones ⋮ de menús.
   - Hamburguesa.

4) CONTRASTE DE COLOR (revisar manualmente):
   Verificar pares principales:
   - --text sobre --bg en light: debe ser >= 4.5:1.
   - --muted sobre --bg: >= 3:1 (es texto secundario).
   - Botones primary: texto blanco sobre #4F46E5 (cumple).
   - Badges: cada par fg/bg debe pasar 4.5:1.
   Si algún token no cumple, ajustar valores en tokens.css.

5) HEADINGS jerárquicos:
   Cada página tiene UN <h1> (el título principal — generalmente en BOPageHeader).
   Secciones usan <h2>, sub-secciones <h3>.
   No saltar niveles (h1 → h3 sin h2 entre medias).

6) SKIP LINK (opcional, recomendado):
   Primer elemento del <body> en cada HTML:
     <a href="#main" class="skip-link">Saltar al contenido principal</a>
   CSS:
     .skip-link {
       position: absolute;
       top: -40px; left: 0;
       background: var(--accent);
       color: #fff;
       padding: 8 16;
       z-index: 1000;
       transition: top 150ms;
     }
     .skip-link:focus { top: 0; }
   Y agregar id="main" al elemento principal de cada página (main.bo-content, .pos-content, etc.).

7) ROLE Y ARIA en componentes custom:
   - Modales: <div role="dialog" aria-modal="true" aria-labelledby="modalTitle">
     y <h2 id="modalTitle">Título</h2>.
   - Tabs: ul[role="tablist"], button[role="tab"][aria-selected="true/false"][aria-controls],
           div[role="tabpanel"][aria-labelledby].
   - Drawers: igual que modales.
   - Toasts: role="status" aria-live="polite".

8) KEYBOARD NAVIGATION:
   Verificar manualmente:
   - Tab recorre todos los elementos interactivos en orden lógico.
   - Shift+Tab los recorre en reversa.
   - Enter activa botones.
   - Space activa checkboxes/switches.
   - Esc cierra modales/drawers.
   - Flechas dentro de tabs (opcional pero estándar).

9) PREFERS-REDUCED-MOTION:
   Agregar al final de utilities.css:
     @media (prefers-reduced-motion: reduce) {
       *, *::before, *::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
         scroll-behavior: auto !important;
       }
     }
   Esto desactiva animaciones para usuarios con sensibilidad.
```

### Hecho cuando

- Tab navega correctamente, focus visible en todos los elementos.
- Todos los botones ícono tienen aria-label.
- Skip link funciona (visible al hacer Tab).
- Esc cierra todo modal/drawer abierto.
- prefers-reduced-motion respetado.

---

## Sección 10.4 — Cross-browser y performance

### Prompt para Claude Code

```
Smoke test manual + verificaciones de performance.

CROSS-BROWSER (pruebas manuales):
  Abrir el demo en:
  - Chrome (desktop) — referencia.
  - Firefox (desktop) — verificar que SVGs, gradientes y CSS grid se ven igual.
  - Safari (desktop) — especialmente backdrop-filter, transitions, custom properties.
  - Chrome Android o Safari iOS (mobile) — tactil, viewport, font sizes.

  Issues comunes a verificar:
  - SVG fill currentColor en Firefox.
  - Bottom-sheet animation suave en Safari.
  - Inputs zoom en iOS (font-size del input debe ser >= 16px o no hay zoom).
  - 100vh en iOS: usar 100dvh donde sea posible, o JS para corregir.

PERFORMANCE:
  Lighthouse (Chrome DevTools):
    Performance: objetivo >= 90.
    Accesibilidad: objetivo >= 90.
    Best Practices: objetivo >= 90.
    SEO: no aplica (es demo, no público).

  Cosas que matan performance en demos:
  - Imágenes grandes: NO usamos imágenes reales, solo gradientes — OK.
  - Fonts: Inter desde Google Fonts con preconnect:
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    Agregar a TODOS los HTML.
  - Lucide CDN: 1 sola carga por página, lucide.createIcons() al final.
  - CSS: minificar opcional. Sin minificar está bien si la demo es local.

NO FLASH DE TEMA AL CARGAR:
  Verificar que theme.js se carga SINCRÓNICAMENTE en <head> ANTES del CSS principal:
    <head>
      <script>
        // Setea data-theme INMEDIATAMENTE para evitar flash
        const t = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', t);
      </script>
      <link rel="stylesheet" href="/assets/css/tokens.css">
      ...
    </head>

  Si hay flash, mover el script inline al inicio de <head>.

VIEWPORT META:
  TODOS los HTML deben tener:
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  El viewport-fit=cover es para iOS notch.

PRELOAD DE FUENTES CRÍTICAS (opcional avanzado):
  <link rel="preload" href="https://fonts.gstatic.com/s/inter/..." as="font" type="font/woff2" crossorigin>

CONSOLE LIMPIA:
  No debe haber errores rojos en la consola en ninguna pantalla.
  Warnings amarillos sobre deprecaciones de lucide o similar son aceptables.

LINKS ROTOS:
  Verificar que todos los href= apunten a archivos existentes:
  - Botones "Volver", "Cancelar", links del nav, breadcrumbs.
  - Click en cada link del index.html debe abrir la pantalla correcta.
  Si encontrás un link roto, fijarlo en el archivo origen.
```

### Hecho cuando

- Lighthouse >= 90 en Performance y Accesibilidad en al menos 5 páginas claves
  (dashboard, catalogo, pos/mapa, mesero/mapa, storefront/tienda).
- Cero errores en consola en todas las pantallas.
- No hay flash de tema al cargar.
- Demo funciona idéntico en Chrome, Firefox y Safari.
- Todos los links del index llevan a la pantalla correcta.

---

## Sección 10.5 — README.md raíz

### Prompt para Claude Code

```
Crear README.md en la raíz del proyecto (NO confundir con docs/00-overview.md, que es para
Claude Code; el README es para humanos que abren el repo).

CONTENIDO:

# Inventario POS — Demo

Demo navegable del sistema **Inventario POS**, un SaaS para restaurantes en Colombia.
HTML + CSS + JavaScript vanilla, sin build, sin backend. 

## Qué hay acá

7 módulos, ~46 pantallas, todas conectadas:

| Módulo | Pantallas | Entrar por |
|---|---|---|
| Auth | 5 | [auth/login.html](auth/login.html) |
| Backoffice | 20 | [backoffice/dashboard.html](backoffice/dashboard.html) |
| POS Web | 5 | [pos/apertura.html](pos/apertura.html) |
| App Mesero | 9 | [mesero/login.html](mesero/login.html) (PIN: `1234`) |
| KDS | 2 | [kds/main.html](kds/main.html) |
| Storefront | 6 | [storefront/tienda.html](storefront/tienda.html) |

O abrí [`index.html`](index.html) para ver todos los módulos en grid.

## Cómo correrla

Doble-click a `index.html` funciona pero algunos navegadores bloquean fetch de archivos
locales. Mejor:

```bash
# Opción 1: Python (viene con Mac/Linux)
python3 -m http.server 8000

# Opción 2: Node (si tenés Node instalado)
npx serve .

# Opción 3: VS Code
# Instalá la extensión "Live Server" y click derecho en index.html → Open with Live Server
```

Después abrí `http://localhost:8000` en tu navegador.

## Atajos útiles

- **Ctrl + K** (o **Cmd + K** en Mac): buscador de pantallas (saltar a cualquiera).
- **Botón flotante abajo-izq**: volver al index desde cualquier pantalla.
- **Toggle de tema**: ☀️/🌙 en cada topbar.
- **PIN del mesero**: `1234`.

## Estructura del repo

```
.
├── index.html              ← landing
├── README.md
├── CLAUDE.md               ← convenciones (solo si vas a editar con Claude Code)
├── design-system/          ← JSX mockups originales (referencia, no se ejecutan)
├── docs/                   ← documentación de los 11 sprints (para humanos y AI)
├── assets/
│   ├── css/                ← tokens, components, shells, utilities
│   ├── js/                 ← theme, nav, ui (modales/drawers/toasts/tabs)
│   └── icons/              ← opcional
├── auth/                   ← 5 pantallas de autenticación
├── backoffice/             ← 20 pantallas de administración
├── pos/                    ← 5 pantallas de POS web
├── mesero/                 ← 9 pantallas de app mesero (mobile)
├── kds/                    ← 2 pantallas de cocina (tablet)
└── storefront/             ← 6 pantallas cara al cliente
```

## Cómo agregar una pantalla nueva

1. Copiar la plantilla del módulo (`backoffice/_layout.html`, `pos/_layout.html`, etc.).
2. Cambiar el sidebar item activo y el breadcrumb.
3. Llenar el `<main>` con el contenido específico.
4. Agregar la pantalla al array `PAGES` en `/assets/js/nav.js` para que aparezca en Ctrl+K.
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

Todos cambian automáticamente con `[data-theme="dark"]`.

## Componentes disponibles

Definidos en `assets/css/components.css`:

- Botones: `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-destructive`
- Inputs: `.field`, `.field-input`, `.field-label`, `.field-hint`, `.field-error`
- Badges: `.badge` + `.badge-success` / `.badge-error` / `.badge-warning` / `.badge-info` / `.badge-muted`
- Cards: `.card`, `.card-header`, `.card-body`, `.card-footer`
- Tablas: `.table` con stack en mobile
- KPIs: `.kpi-card` + tonos
- Alert banner: `.alert-banner`
- Modal, Drawer, Toast: ver `assets/js/ui.js`
- Tabs: `data-tabs="id"` + `data-tab="key"` + `data-panel="key"`
- Switch: `.switch` + `.switch.is-on`
- Empty state: `.empty-state`

## API de JS global

```javascript
UI.openModal('id')         // abre modal/backdrop con ese id
UI.closeModal('id')
UI.openDrawer('id')
UI.closeDrawer('id')
UI.openBottomSheet('id')   // mesero/storefront
UI.toast({ type, title, sub, duration })
UI.tabs(containerSelector)
UI.toggleEmpty(tableSelector, hasResults)

toggleTheme()              // alterna light/dark, persiste en localStorage
```

## Datos mock

Los datos en las pantallas (nombres de productos, precios, clientes, sucursales) son ficticios
pero realistas para Colombia (formato cédula 1.012.345.678, NIT, sedes, integraciones Mercado
Pago/Wompi/Rappi/Siigo, etc.). Todo es estático — no hay BD ni backend.

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
```

Después de crear el README, eliminá cualquier README placeholder previo si existe.
```

### Hecho cuando

- README.md en raíz tiene toda la info de uso.
- Links a las pantallas funcionan desde GitHub o local.
- Estructura del repo documentada.
- Atajos Ctrl+K + PIN mesero mencionados.

---

## Checklist final del Sprint 10

- [ ] `assets/js/nav.js` carga en todas las páginas.
- [ ] Botón flotante "Volver al demo" visible.
- [ ] Ctrl+K abre buscador con las ~46 pantallas.
- [ ] Empty states en tablas con búsqueda sin resultados.
- [ ] Focus visible en todos los elementos interactivos.
- [ ] Aria-labels en todos los botones ícono.
- [ ] Skip link funciona.
- [ ] prefers-reduced-motion respetado.
- [ ] Sin flash de tema al cargar.
- [ ] Sin errores en consola.
- [ ] Lighthouse >= 90 Performance y Accesibilidad.
- [ ] Cross-browser (Chrome, Firefox, Safari).
- [ ] README.md raíz completo con instrucciones de uso.

Commit final: `feat: sprint 10 pulido y QA — demo lista para presentar`.

🎉 **Demo completa.** ~46 pantallas, 7 módulos, navegación global, accesible y responsive.
