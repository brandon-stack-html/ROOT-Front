# UI kit — Backoffice

Recreación de la administración web de ROOT: shell con **sidebar agrupado**
(Operación / Gestión / Nómina / Finanzas / Config), **topbar** con breadcrumb +
selector de sucursal + acciones, y la pantalla **Dashboard** (saludo dinámico,
toggle de periodo, 4 KPIs incluyendo Estado DIAN, gráfico de área de ventas y
top productos).

- `index.html` — monta la app (React + `_ds_bundle.js` + Lucide).
- `app.jsx` — sidebar, topbar, dashboard. Usa `KpiCard`, `Card`, `Button` del DS.
- `kit.css` — estilos del shell (subset token-driven de `shells.css`).

Interactivo: navegación del sidebar, toggle de periodo y toggle de tema.
Las vistas no-Dashboard muestran un placeholder (este kit demuestra el Dashboard).
