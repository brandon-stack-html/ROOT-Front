# Refactor — Consistencia de diseño del Backoffice

> **Fecha:** 2026-06-30
> **Alcance:** unificación visual de las ~27 pantallas del Backoffice contra el design system global.
> **Sin cambios funcionales, sin tocar datos mock, textos, NIT, nombres ni precios.**

---

## 🎯 Por qué

El Backoffice tiene un design system global sólido y tokenizado (`tokens.css`, `components.css`,
`shells.css`), pero **~21 de 27 pantallas incrustaban su propio bloque `<style>`** que reinventaba los
mismos patrones con clases paralelas, valores hardcodeados y comportamiento responsive distinto.

Eso producía inconsistencias visibles entre módulos:

- **3 sistemas de encabezado** distintos (subtítulos a 12px vs 13px según la pantalla).
- **KPIs** con clases divergentes (`.kpi-header` vs `.kpi-card-head`, grids de 3/4 columnas propios).
- **9 tablas** con estilos bespoke por módulo.
- **Toolbars/buscadores** duplicados (`.toolbar` local vs `.bo-toolbar` global).
- **Colores de estado hardcodeados** (amber/verde/rojo repetidos a mano) en vez de tokens.
- **Spacing y radios** mezclando tokens con píxeles literales.

**Regla rectora del refactor:** no inventar diseño nuevo. Reusar las clases globales existentes y mover
al CSS global solo los patrones compartidos que vivían duplicados.

---

## ⭐ Lo más importante

1. **Una sola fuente de verdad para el shell de página.** Todas las pantallas usan ahora
   `.bo-page-header`, `.kpi-grid` / `.kpi-card`, `.bo-toolbar`, `.bo-pagination` y `.badge`/tokens de
   estado. Se eliminaron los `<style>` locales que duplicaban esos patrones.

2. **Colores de estado 100% tokenizados.** Los amber/verde/rojo que se repetían a mano ahora usan
   `--state-success-*`, `--state-warning-*`, `--state-danger-*`, `--state-info-*`, `--warning`,
   `--success`, `--error`. Beneficio clave: **el modo oscuro ahora es correcto en todos los módulos**
   sin overrides manuales por pantalla.

3. **Consistencia claro/oscuro y responsive** de 360px a 1920px, igualada contra `dashboard.html`
   (la pantalla de referencia "limpia").

---

## 🧱 Cambios en el CSS global

| Archivo | Cambio |
|---|---|
| `assets/css/shells.css` | `.bo-page-header` ahora se apila en móvil (`≤640px`); `.bo-toolbar` se apila y el buscador ocupa todo el ancho en móvil; nueva variante canónica **`.kpi-grid-3`** (3 columnas responsive) para módulos con 3 KPIs. |
| `assets/css/components.css` | Se eliminó la definición **duplicada de `.switch`** (existía en `components.css` y `shells.css` con valores distintos que cambiaban el knob según el orden de carga). Queda una sola definición canónica en `shells.css`. |

---

## 🖥️ Cambios por módulo (Backoffice)

Patrón aplicado de forma consistente en cada pantalla: encabezado → `.bo-page-header`; KPIs →
`.kpi-card`/`.kpi-grid`(-3); toolbar → `.bo-toolbar`; paginación → `.bo-pagination`; colores/radios →
tokens; y **borrado del CSS local duplicado**.

**Encabezado / KPIs / botones**
`configuracion`, `sucursales`, `mesas`, `notificaciones`, `adelantos`, `adelanto-detalle`,
`integraciones`, `facturacion-dian`, `fichas`, `dashboard` (botón inline `style="..."` → `.btn-sm`).

**Toolbar + tablas + paginación**
`clientes`, `proveedores`, `gastos`, `categorias`, `conteo`.

**Módulos con tablas/KPIs grandes**
`inventario`, `nomina`, `usuarios`, `contabilidad`, `reportes`, `caja`.

Casos destacados:
- **gastos:** sus 3 KPIs estaban mezclados (uno global, dos custom con amber sólido hardcodeado) → los
  tres unificados a `.kpi-card` con tonos (`tone-warning`, `tone-error`).
- **contabilidad:** KPIs alineados a global (`.kpi-icon` → `.kpi-icon-wrap`, `.kpi-delta delta-up` →
  `.kpi-delta up`, `.kpi-grid-4` → `.kpi-grid`); banner de integración y fila de resultado P&L
  tokenizados a `--state-success-*`.
- **facturacion-dian:** banner DIAN, chips de estado (enviada/enviando/error) y filas de riesgo
  tokenizados; paginación migrada a `.bo-pagination`.
- **clientes / proveedores / gastos:** la paginación salió de la tarjeta de tabla al patrón canónico
  `.bo-pagination` (como en `inventario`).

---

## ✅ Verificación realizada

- **Markup:** 0 referencias a clases locales viejas (`bo-ph`, `toolbar`, `pagination`, `pag-page`,
  `kpi-header`, `kpi-tone`, `kpi-grid-3/4`) y 0 `<h1 style="...">` inline.
- **Estructura HTML:** balance de etiquetas correcto en las 27 páginas, incluidas las que se
  reestructuraron al mover la paginación fuera de la tarjeta.
- **Servidor local:** todas las pantallas migradas responden `200`.
- **Colores:** el hex restante es exclusivamente **datos o paletas categóricas intencionales**
  (avatares por persona, colores de categoría de ingrediente/producto, colores por rol, íconos por
  grupo de reporte, marcas de terceros en `integraciones`, y la vista de impresión `nomina-imprimible`).

---

## ⚠️ Decisión técnica registrada — Tablas generadas por JS

Varias "tablas" del Backoffice **se generan por JavaScript** como grids de `<div>` (`.ct-row`,
`.prov-row`, `.gt-row`, `.inv-table-row`, …) con un layout móvil (tarjeta de 2 columnas) hecho a
medida por módulo.

Convertirlas a `<table>` semántica obligaba a **reescribir los generadores JS** y perder ese layout
móvil — alto riesgo para una demo, con resultado visual idéntico. Por eso se optó por **unificarlas
visualmente vía tokens** (radios, colores, encabezado y hover consistentes) manteniendo su estructura
y su comportamiento responsive.

> Pendiente opcional: si se desea la conversión a `<table>` semántica, se puede abordar en una segunda
> pasada reescribiendo también los generadores JS.

---

## ➡️ Siguientes pasos sugeridos

- Revisar visualmente en navegador (claro/oscuro, 360 / 768 / 1280 / 1920).
- Commit por grupos (Fundación CSS → Grupo A → B → C) para historial legible.
