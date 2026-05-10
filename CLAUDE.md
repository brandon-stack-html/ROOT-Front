# CLAUDE.md — Convenciones del proyecto

> Este archivo define las reglas de juego para todo Claude Code que trabaje en este repo.
> Léelo antes de cada sesión.

## Qué estamos construyendo

Una **demo HTML funcional** del sistema **Inventario POS** (SaaS para restaurantes en Colombia).
La demo replica visualmente todas las pantallas del design system del zip — sin backend, sin BD.
La idea es mostrarla a stakeholders y que se sienta navegable.

## Stack

- **HTML + CSS + JavaScript vanilla**. Cero frameworks (sin React, sin Tailwind, sin Vue, sin nada).
- Sin build step. Cada HTML se abre directo en el navegador.
- Para íconos: `lucide` desde CDN o SVG inline.
- Fuente: `Inter` desde Google Fonts.

## Cómo trabajar

1. Cada sprint vive en un archivo `docs/sprint-XX-*.md`.
2. Cada sprint tiene secciones numeradas (0.1, 0.2, ...). **Trabaja una sección a la vez.**
3. Antes de codear una sección:
   - Lee el `.jsx` de referencia que indica el sprint.
   - Mostrame qué archivos vas a crear/modificar.
   - Si algo no está claro, **pregúntame antes de codear**, no asumas.
4. Después de codear:
   - Mostrame el resultado.
   - Validamos abriendo el HTML en el navegador.
   - Commit antes de seguir a la siguiente sección.

## Reglas inviolables

1. **NUNCA inventes diseños.** Si una pantalla no está en el zip `design-system/`, no existe.
2. **Copiá textos, datos mock (nombres, precios, fechas) tal cual aparecen en los `.jsx`.**
   Los datos colombianos (nombres, NIT, ciudades) están elegidos a propósito — no los cambies.
3. **Usá variables CSS** definidas en `assets/css/tokens.css` (Sprint 0). Nunca hardcodees colores
   en componentes individuales.
4. **Mobile-first.** Cada pantalla debe verse bien desde 360px hasta 1920px. Si el JSX original es
   solo desktop (Backoffice/POS), adaptalo para móvil/tablet siguiendo las indicaciones del sprint.
5. **Sin librerías JS externas** salvo `lucide` para íconos. Nada de jQuery, Alpine, htmx, etc.
6. **Los `.jsx` del zip NO son código ejecutable.** Son la spec visual. Tu trabajo es leerlos como
   referencia y reconstruir con HTML/CSS/JS limpio. No transpiles JSX a JS — interpretá el diseño.

## Estructura del repo

```
.
├── CLAUDE.md                    # este archivo
├── README.md                    # instrucciones de uso (Sprint 10)
├── design-system/               # JSX de referencia (NO TOCAR — es la fuente de verdad)
├── docs/
│   ├── 00-overview.md
│   ├── sprint-00-fundacion.md
│   ├── sprint-01-auth.md
│   ├── ...
│   └── sprint-10-pulido.md
├── index.html                   # landing con grid de módulos (Sprint 0.7)
├── assets/
│   ├── css/
│   │   ├── tokens.css           # variables CSS (Sprint 0.1)
│   │   ├── components.css       # botones, inputs, badges, etc. (Sprint 0.2-0.4)
│   │   ├── shells.css           # sidebar/topbar backoffice, headers (Sprint 0.6)
│   │   └── utilities.css
│   ├── js/
│   │   ├── theme.js             # toggle dark/light (Sprint 0.5)
│   │   ├── nav.js               # router minimal (Sprint 10.1)
│   │   └── ui.js                # modales, drawers, tabs, toasts (Sprint 0.4)
│   └── icons/                   # opcional si no usás CDN
├── auth/                        # 5 pantallas (Sprint 1)
├── pos/                         # 5 pantallas (Sprint 6)
├── mesero/                      # 9 pantallas (Sprint 7)
├── kds/                         # 2 pantallas (Sprint 8)
├── backoffice/                  # ~20 pantallas (Sprints 2-5)
└── storefront/                  # 6 pantallas (Sprint 9)
```

## Cómo correr

```bash
# Opción 1: doble-click a index.html
# Opción 2: servidor local (recomendado para evitar issues de CORS con SVG)
python3 -m http.server 8000
# o
npx serve .
```

## Naming

- HTML: `kebab-case.html` (ej: `selector-sucursal.html`).
- Clases CSS: `kebab-case` con prefijos por contexto (`.bo-sidebar`, `.kpi-card`, `.btn-primary`).
- IDs JS: `camelCase`.
- Atributos data: `data-kebab-case` (ej: `data-open-modal="confirmar-venta"`).

## Comportamiento esperado de Claude Code

- **No saltes secciones.** Si te pido la 2.3, no me adelantes la 2.4.
- **No inventes "mejoras" no pedidas.** Si el JSX dice botón gris, no lo hagas degradado morado.
- **No instales paquetes** (no npm, no pip). Esto es vanilla.
- **No crees archivos fuera de la estructura definida** sin avisarme primero.
- **Si encontrás contradicciones** entre el sprint actual y otro previo (ej: el Sprint 0 definió
  `.btn-primary` y el Sprint 5 te pide algo distinto), **paralo y preguntame**.
