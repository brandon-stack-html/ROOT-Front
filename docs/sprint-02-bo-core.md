# Sprint 02 — Backoffice Core (5 pantallas)

> **Objetivo:** dashboard, catálogo, inventario y gestión de productos del backoffice.
> **Estimado:** 6–8 horas.
> **Pantallas:** B1 (dashboard A y B), B8 (catálogo), B9 (producto), B11 (inventario).
> **Dependencias:** Sprint 0 (shell, KPI cards, alert banner, drawer) + Sprint 1 (login redirige acá).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| Shell BO + helpers (KPICard, AlertBanner, BOPageHeader, Pagination, BOToolbar) | `design-system/backoffice/bo-shared.jsx` |
| B1 Dashboard | `design-system/backoffice/bo-b1-dashboard.jsx` (248 líneas) |
| B8 Catálogo | `design-system/backoffice/bo-b8-catalogo.jsx` (184 líneas) |
| B9 Producto | `design-system/backoffice/bo-b9-producto.jsx` (296 líneas) |
| B11 Inventario | `design-system/backoffice/bo-b11-inventario.jsx` (192 líneas) |

Host de referencia: `design-system/04-kds-backoffice.html`.

---

## Sección 2.1 — Dashboard B1 (versión normal)

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b1-dashboard.jsx completo.

Crear backoffice/dashboard.html partiendo de backoffice/_layout.html (Sprint 0.6).

En el sidebar, marcá .bo-sidebar-item con id="dashboard" como .is-active.
En el topbar, breadcrumb ["Inicio", "Dashboard"].

Dentro de <main class="bo-content"> renderizá:

1) BOPageHeader replicado en HTML:
   <header class="bo-page-header">
     <div>
       <h1>Dashboard</h1>
       <p class="bo-page-subtitle">14 de marzo, 2025 · Sede Norte</p>
     </div>
     <div class="bo-page-actions">
       <button class="btn btn-secondary">[ícono calendar] Hoy</button>
       <button class="btn btn-secondary">[ícono download] Exportar</button>
     </div>
   </header>

   CSS .bo-page-header en shells.css:
     display flex justify-between items-flex-end, margin-bottom 18.
     h1: font-size 22, font-weight 700, letter-spacing -.01em.
     .bo-page-subtitle: font-size 12, color muted, margin-top 3.
     .bo-page-actions: display flex gap 8.

2) Grid 4 KPIs (sección.kpi-grid con grid-template-columns repeat(auto-fit, minmax(220px, 1fr))):
   Replicar EXACTAMENTE los 4 KPIs del JSX:
   - Ventas hoy: $X.XXX.XXX, delta up
   - Transacciones: 128, delta up
   - Ticket promedio: $XX.XXX, delta down
   - Clientes nuevos: 12, delta up
   Datos exactos del JSX.

3) Sección 2 columnas (8/4): chart izq + top productos der.
   En mobile (< 1024px), stack vertical.

   Chart "Ventas últimos 7 días":
     Card con header "Ventas últimos 7 días" + tabs "7 días" / "30 días" / "90 días".
     Body: SVG inline replicando AreaChart de bo-shared.jsx (línea ~530).
       Copiá la lógica matemática del path Catmull-Rom y los gradientes.
       Datos exactos del JSX (array de {l: 'Lun', v: número}).
       Width 100% del card (recalcular o usar viewBox responsive: viewBox="0 0 600 220" preserveAspectRatio).

   Card "Top productos":
     Header "Top 5 productos · hoy".
     Lista (no tabla) de 5 productos con:
       avatar/inicial, nombre, "X vendidos", precio total. 
     Última fila link "Ver todos →" → /backoffice/reportes.html

4) Sección "Estado DIAN" (full width):
   Card horizontal:
     Ícono check-circle verde grande
     Texto "DIAN Conectado · Resolución vigente hasta 31/12/2026"
     Datos: "Última factura enviada: hace 12 minutos · Próximo cierre: 28 días"
     Botón ghost "Ver detalle →" → /backoffice/dian.html

RESPONSIVE:
  @media (max-width: 1280px): KPIs grid 2 cols.
  @media (max-width: 768px):  KPIs 1 col, chart full, top productos abajo.

Tema dark debe seguir funcionando — todo via tokens.
```

### Hecho cuando

- 4 KPIs muestran datos del JSX con sus deltas correctos.
- Chart SVG renderiza la curva con gradiente y tooltip en último punto.
- Top productos lista 5 items.
- Estado DIAN card visible.
- En mobile todo se stackea sin romperse.

---

## Sección 2.2 — Dashboard B1 (versión B con alertas)

### Prompt para Claude Code

```
Misma página backoffice/dashboard.html. NO crear archivo nuevo.

Agregar al header un toggle:
  <div class="bo-view-toggle">
    <button data-view="normal" class="is-active">Vista normal</button>
    <button data-view="alertas">Vista con alertas</button>
  </div>

CSS .bo-view-toggle:
  display inline-flex, bg alt, border-radius 8, padding 4, gap 4.
  button: padding 6 12, border-radius 6, border none, bg transparent, font-size 12.
  .is-active: bg, box-shadow sm, font-weight 600.

Justo debajo del toggle (antes de los KPIs), agregar el AlertBanner OCULTO por default:
  <section class="alert-banner" hidden id="dashboardAlerts">...</section>

Items del banner según JSX bo-b1-dashboard.jsx (replicar exactos):
  1. "Caja sin cierre desde ayer" — meta "Sede Norte · 22:48", actions: [Cerrar caja (primary), Ver detalle]
  2. "Factura #FE-1842 rechazada por DIAN" — meta "Hace 2 horas", detail "Código error: B0049 — DIAN no reconoce el régimen tributario", actions: [Reintentar (primary), Ver factura]
  3. "Stock crítico: 4 productos por debajo del mínimo" — actions: [Ver inventario]

JS:
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('is-active', b === btn));
      document.getElementById('dashboardAlerts').hidden = btn.dataset.view === 'normal';
    });
  });

Cuando vista = alertas, el banner aparece arriba de los KPIs y los KPIs siguen igual.
```

### Hecho cuando

- Toggle "Vista normal / Vista alertas" cambia visibilidad del banner.
- Banner muestra los 3 items con borde rojo izquierdo, ícono triángulo y botones.
- Funciona en ambos temas.

---

## Sección 2.3 — Catálogo B8

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b8-catalogo.jsx (184 líneas).

Crear backoffice/catalogo.html partiendo de _layout.html.
Sidebar item activo: catalogo.
Breadcrumb: ["Inicio", "Catálogo"].

Layout interno DESKTOP:
  .catalogo-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24;
    height: 100%;
  }

  Izq: .catalogo-tree (sidebar interno con árbol de categorías):
    Card con header "Categorías" + botón "+" pequeño.
    Lista de categorías padre/hijo con expand/collapse.
    Replicar las 6-8 categorías del JSX:
      Alimentos
        ├ Entradas
        ├ Platos fuertes
        └ Postres
      Bebidas
        ├ Calientes
        ├ Frías
        └ Alcohólicas
      Insumos
    Cada item: ícono triangular para expand, texto, contador (5).
    Item activo: bg accent suave, color text, font-weight 600.

  Der: contenido principal:
    Toolbar (.bo-toolbar):
      Search input (con ícono lucide search) ancho ~280
      Filtros: select Categoría, select Estado (Todos/Activos/Inactivos)
      Spacer
      Botón "+ Nuevo producto" → href="/backoffice/producto.html?nuevo=1"

    Grid 3 cols de productos (.product-grid):
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))
      9 cards de productos (datos del JSX):
        Card .product-card:
          Foto: <div class="product-img" style="background: linear-gradient(...)"> (placeholder svg)
            Aspect ratio 1:1 o 4:3.
          Body con padding 14:
            Nombre (font-weight 600)
            Categoría (font-size 11, color muted)
            Precio (font-weight 700, font-size 16, color text) 
            Footer del card: badge estado + stock chip
          Hover: translateY(-2px), shadow.
          onclick: location.href = '/backoffice/producto.html?id=' + productId

    Paginación abajo (componente Pagination del Sprint 0 / bo-shared.jsx).

RESPONSIVE:
  @media (max-width: 1024px):
    .catalogo-layout { grid-template-columns: 1fr; }
    El árbol se mueve a un drawer izquierdo. En la toolbar, agregar botón "[ícono filter] Categorías"
    que abre el drawer (data-open-drawer="categoriasTree").
    El árbol vive dentro de un .drawer especial 280px.
  @media (max-width: 640px):
    .product-grid { grid-template-columns: 1fr 1fr; gap: 12; }
  @media (max-width: 420px):
    .product-grid { grid-template-columns: 1fr; }

Datos mock: copiá los 9 productos exactos del JSX (nombres, precios, categorías, stocks).
Si el JSX tiene menos productos, completá hasta 9 manteniendo el patrón colombiano.
```

### Hecho cuando

- Árbol de categorías izq con expand funciona (al menos visualmente).
- Grid de 9 productos visibles en desktop, 2 cols en tablet, 1 en mobile.
- En mobile, botón abre drawer con árbol.
- Click en producto va a producto.html.
- Paginación visible.

---

## Sección 2.4 — Inventario B11

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b11-inventario.jsx (192 líneas).

Crear backoffice/inventario.html partiendo de _layout.html.
Sidebar activo: inventario.
Breadcrumb: ["Inicio", "Inventario"].

Estructura:
1) BOPageHeader: título "Inventario" + subtítulo "Sede Norte · 47 ítems".
   Actions: btn ghost "Importar", btn ghost "Exportar", btn primary "Iniciar conteo" → /backoffice/conteo.html

2) Grid 4 KPIs (con tonos):
   - Total ítems: 47, helper "en stock", tone-muted (sin tone)
   - Valor inventario: $X.XXX.XXX, helper "costo", tone-muted
   - Bajo mínimo: 4, helper "requieren reposición", tone-warning
   - Sin stock: 1, helper "agotados", tone-error
   Datos exactos del JSX.

3) Toolbar:
   Search (ícono y placeholder "Buscar producto, SKU...")
   Select "Todas las categorías"
   Toggle/checkbox "Solo bajo mínimo"
   Spacer
   Btn ghost "[ícono settings] Columnas" (mock, no funcional)

4) Tabla:
   Columnas: Producto (con avatar inicial), SKU, Categoría, Stock actual,
              Stock mín, Costo unit, Valor total, Estado.
   Estado badges:
     >= mínimo + buffer → badge-success "OK"
     entre mínimo y buffer → badge-warning "Bajo"
     <= 0 → badge-error "Agotado"
   8-10 filas exactas del JSX. Si el JSX tiene 6, completá hasta 10 con productos coherentes
   colombianos (Arepa de maíz, Gaseosa 2L, Pan tajado, etc.).

   Columna Stock actual: número grande + flecha pequeña (verde up / rojo down según delta).
   Última columna: botón ghost "Editar" → producto.html?id=X

5) Paginación inferior.

RESPONSIVE:
  @media (max-width: 768px):
    Convertir tabla en cards apiladas:
    .table-stack tr -> display block, mb 12, padding 14, border, border-radius lg, bg.
    Cada td -> display flex justify-between con label antes.
    Para esto, en cada <td> agregar atributo data-label="Producto", data-label="SKU", etc.,
    y CSS :before { content: attr(data-label); color: muted; }
    Ocultar <thead> en mobile.

JS opcional (mejor experiencia):
  Search filtra filas en vivo (toLowerCase + includes).
  Toggle "Solo bajo mínimo" agrega/quita data-filter="bajo" y CSS oculta filas que no matcheen.
```

### Hecho cuando

- 4 KPIs con sus tonos correctos (muted, muted, warning, error).
- Tabla con 10 filas, badges de estado correctos.
- Search filtra filas en vivo.
- En mobile la tabla se vuelve cards apiladas legibles.

---

## Sección 2.5 — Producto B9 (crear/editar)

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b9-producto.jsx (296 líneas — la más densa).

Crear backoffice/producto.html partiendo de _layout.html.
Sidebar activo: catalogo.
Breadcrumb dinámico: ["Inicio", "Catálogo", "Nuevo producto" o "Editar Arepa de maíz"].

JS al cargar:
  const params = new URLSearchParams(location.search);
  const isNew = params.has('nuevo');
  const id = params.get('id');
  Cambiar título y breadcrumb según.

Layout: grid 8/4 desktop:
  .producto-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 24;
    align-items: flex-start;
  }

IZQ (form):
  Card "Información básica":
    Uploader de foto: rectángulo con dashed border, ícono image grande, "Arrastrá una foto o hacé click",
                      tamaño 400x300. Click no hace nada (mock) — opcional: input file con preview.
    Grid 2 cols:
      Nombre (input)
      SKU (input, prefijo "P-")
    Descripción (textarea)
    Grid 2 cols:
      Código de barras (input + botón "📷" placeholder)
      Categoría (select)

  Card "Precios y costos":
    Grid 3 cols:
      Precio venta (input con prefijo $)
      Precio costo (input con prefijo $)
      Margen (input read-only, calcula auto: ((venta-costo)/venta*100).toFixed(1) + '%')
    JS para recalcular margen al cambiar venta o costo.
    Switch "IVA incluido en precio venta" (toggle visual).

  Card "Inventario":
    Grid 2 cols:
      Stock inicial (input number)
      Stock mínimo (input number)
    Switch "Controlar inventario para este producto"

  Card "Modificadores":
    Header con botón "+ Agregar grupo de modificadores".
    Lista de grupos (mock):
      Grupo 1: "Tamaño" — radio (obligatorio) — items: Pequeño, Mediano (+$2.000), Grande (+$4.000)
      Grupo 2: "Adiciones" — checkbox (opcional, máx 3) — items: Queso (+$1.500), Tocineta (+$2.500), Aguacate (+$2.000)
    Cada item editable visualmente.

  Card "Ficha técnica":
    Tabla pequeña con columnas: Ingrediente, Cantidad, Unidad, Costo unitario, Costo total.
    3 filas mock (Maíz, Aceite, Sal o lo que tenga el JSX).
    Botón "+ Agregar ingrediente" abajo.
    Footer: "Costo total receta: $X.XXX" en negrita.

DER (preview live):
  Card sticky en desktop (.preview-card { position: sticky; top: 24; }):
    Header "Vista previa".
    Body: simula cómo se ve el producto en el catálogo (carta digital):
      Foto placeholder, nombre, descripción truncada, precio, badge categoría.
    Update en vivo si el form cambia (JS listener input).

FOOTER FIJO de la página:
  .producto-footer (sticky bottom 0, bg, border-top, padding 12 24,
                    display flex justify-between items-center, z-index 10):
    Izq: estado del producto (toggle .switch con label "Activo" / "Inactivo")
    Der: botones "Cancelar" → catalogo.html, "Guardar producto" (primary)
      Click guardar: UI.toast({ type: 'success', title: 'Producto guardado', sub: '...'});
      setTimeout(() => location.href = '/backoffice/catalogo.html', 1200);

RESPONSIVE:
  @media (max-width: 1024px):
    .producto-layout { grid-template-columns: 1fr; }
    .preview-card { position: static; margin-top: 24; }

CSS .switch (toggle visual):
  Width 36, height 20, bg alt, border-radius 10, position relative, cursor pointer.
  ::after círculo 16x16, bg #fff o accent, transición.
  .switch.is-on { bg: accent; } .switch.is-on::after { transform: translateX(16px); }
```

### Hecho cuando

- Form completo con todas las cards visibles.
- Margen se recalcula automáticamente al cambiar precios.
- Preview live actualiza al tipear en el form.
- Switch toggles funcionan visualmente.
- Footer sticky con botones funciona.
- Click "Guardar producto" muestra toast y vuelve al catálogo.
- Responsive: en mobile el preview va al final.

---

## Checklist final del Sprint 2

- [ ] dashboard.html: 4 KPIs, chart SVG, top productos, estado DIAN, toggle vista normal/alertas.
- [ ] catalogo.html: árbol de categorías, grid 9 productos, drawer en mobile, paginación.
- [ ] inventario.html: 4 KPIs con tonos, tabla con badges, search filtra en vivo, mobile como cards.
- [ ] producto.html: form completo 8/4, preview live, margen auto-calculado, footer sticky.
- [ ] Navegación: dashboard → catálogo → producto → volver a catálogo, todo funciona.
- [ ] Tema dark funciona en las 4 páginas.
- [ ] Mobile: las 4 páginas se ven legibles desde 360px.

Commit: `feat: sprint 2 backoffice core completo`. Pasamos al Sprint 3.
