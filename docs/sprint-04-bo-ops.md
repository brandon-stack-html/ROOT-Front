# Sprint 04 — Backoffice Operaciones (4 pantallas)

> **Objetivo:** categorías y modificadores, conteo de inventario, fichas técnicas, clientes con drawer.
> **Estimado:** 5–6 horas.
> **Pantallas:** B10 (categorías), B12 (conteo), B13 (fichas técnicas), B14 (clientes).
> **Dependencias:** Sprint 0, 2 y 3 (todo el shell del BO ya validado).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| B10 Categorías | `design-system/backoffice/bo-b10-categorias.jsx` (179 líneas) |
| B12 Conteo | `design-system/backoffice/bo-b12-conteo.jsx` (223 líneas) |
| B13 Fichas técnicas | `design-system/backoffice/bo-b13-fichas.jsx` (234 líneas) |
| B14 Clientes | `design-system/backoffice/bo-b14-clientes.jsx` (272 líneas) |

Host de referencia: `design-system/06-finanzas-backoffice.html`.

---

## Sección 4.1 — Categorías y modificadores B10

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b10-categorias.jsx.

Crear backoffice/categorias.html partiendo de _layout.html.
Sidebar activo: catalogo (mismo grupo que catálogo).
Breadcrumb: ["Inicio", "Catálogo", "Categorías"].

ESTRUCTURA:

1) BOPageHeader: "Categorías y modificadores" + subtítulo "8 categorías · 47 productos · 12 modificadores".
   Actions: btn ghost "Reordenar (mock)", btn primary "+ Nueva categoría" → abre modal "modalCategoria".

2) Toolbar:
   Search "Buscar categoría..."
   Tabs: Categorías (activa) / Modificadores.
     Click en "Modificadores" muestra otra vista (sección extra abajo).
   Spacer
   btn ghost "Expandir todo" / "Contraer todo" (toggle).

3) Tabla anidada de categorías:
   .table-tree
   Columnas: [drag-handle] / Nombre / # Productos / # Modificadores / Estado / Acciones.

   Cada fila tiene un drag handle visual (⋮⋮ o lucide grip-vertical) NON-FUNCIONAL.
   Las categorías padre tienen un toggle expand (▶ ▼) que muestra/oculta hijos.
   Subcategorías con padding-left 32 + connector visual (línea o └).

   Datos del JSX (8 categorías):
     ▼ Alimentos  (15 productos, 3 modificadores)
       └ Entradas (4 productos)
       └ Platos fuertes (8 productos)
       └ Postres (3 productos)
     ▼ Bebidas (24 productos, 5 modificadores)
       └ Calientes (6 productos)
       └ Frías (12 productos)
       └ Alcohólicas (6 productos)
     ▶ Insumos (8 productos, 0 modificadores)

   Estado: badge-success "Activa" / badge-muted "Inactiva".
   Acciones: botón ghost ⋮ que despliega menu mock (Editar, Duplicar, Eliminar — solo visual).

   JS:
     Click en toggle ▶/▼ alterna visibility de subcategorías:
       const tr = e.currentTarget.closest('tr');
       const parentId = tr.dataset.id;
       document.querySelectorAll(`[data-parent="${parentId}"]`).forEach(r =>
         r.hidden = !r.hidden
       );
       Actualizar el ícono.

4) MODAL "Nueva categoría" (data-open-modal="modalCategoria"):
   Form:
     Nombre
     Categoría padre (select: ninguna / Alimentos / Bebidas / Insumos)
     Descripción (textarea)
     Color (palette de 6 chips de colores)
     Switch "Activa"
   Footer: Cancelar / Crear.
   Click crear → toast + cerrar modal + (opcional) agregar fila visual.

5) Cuando tab "Modificadores" está activo (NO es página nueva, es panel intercambiable):
   Lista plana de grupos de modificadores en cards:
     Card "Tamaño" — 3 opciones (Pequeño / Mediano +$2.000 / Grande +$4.000) — Tipo: Radio (1 selección)
     Card "Adiciones" — 5 opciones — Tipo: Checkbox (máx 3)
     Card "Punto de cocción" — 4 opciones — Tipo: Radio
     etc según JSX.
   Cada card editable visualmente (no funcional).
   Botón "+ Nuevo grupo" arriba.

JS:
  UI.tabs aplicado al toolbar para alternar paneles "Categorías" y "Modificadores".

RESPONSIVE:
  @media (max-width: 768px):
    Tabla → cards apiladas con jerarquía clara (subcategorías indentadas con padding).
    O: solo mostrar categorías padre con badge "+3 subcat" que abre detalle.
```

### Hecho cuando

- 8 categorías visibles con expand/collapse funcional.
- Tab "Modificadores" cambia a vista de cards.
- Modal "Nueva categoría" abre y cierra.
- Mobile: jerarquía legible con padding o cards.

---

## Sección 4.2 — Conteo de inventario B12

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b12-conteo.jsx (223 líneas).

Crear backoffice/conteo.html partiendo de _layout.html.
Sidebar activo: inventario.
Breadcrumb: ["Inicio", "Inventario", "Conteo"].

ESTRUCTURA:

1) BOPageHeader:
   Título "Conteo en curso"
   Subtítulo "Sede Norte · Iniciado 14 mar 2025 09:32 por Juan Camilo"
   Actions:
     btn ghost "Pausar"
     btn destructive "Cancelar conteo"

2) Banner informativo arriba:
   .conteo-info-bar (display flex justify-between items-center, padding 14 18,
                     bg accent suave, border-radius lg)
   Izq: switch "Modo ciego" en posición ON + texto "Modo ciego activo: no verás el stock teórico mientras contás".
   Der: contador "28 / 45 productos contados".

3) Barra de progreso .progress (height 8, bg alt, border-radius 4, overflow hidden):
   .progress-fill (height 100%, bg accent, width: 60%, transition width 300ms).
   Margen abajo 24.

4) Toolbar:
   Search "Buscar producto o SKU..."
   Select "Todos" (filtros: Todos / Pendientes / Contados / Con diferencia)
   Spacer
   btn ghost "Vista compacta" (toggle visual, no implementar).

5) Tabla de conteo:
   Columnas: # / Producto (avatar + nombre + SKU) / Unidad / Stock teórico / Stock real / Diferencia / Estado.

   Si modo ciego ON: la columna "Stock teórico" muestra "—" (oculto).
   Cuando se hace click en switch, mostrar/ocultar valores.

   Stock real: <input type="number" class="field-input field-input-sm" data-product-id="X">.
     Algunos pre-llenados (los 28 ya contados — datos del JSX).
     Otros vacíos (placeholder "—").

   Diferencia: calculada en vivo. Mostrar:
     0 → texto "—" en color muted
     positivo → texto verde con flecha up "+3"
     negativo → texto rojo con flecha down "-2"

   Estado:
     vacío → badge-muted "Pendiente"
     real == teórico → badge-success "OK"
     real != teórico → badge-warning "Con diferencia"

6) Footer sticky:
   Izq: stats "28 contados · 17 pendientes · 4 con diferencia (−$XX.XXX)"
   Der: btn-secondary "Guardar borrador" + btn-primary "Finalizar conteo"
     Click finalizar → modal de confirmación:
       "Vas a aplicar los ajustes al inventario. Esta acción no se puede deshacer."
       Cancelar / Confirmar.
       Confirmar: toast success + redirect a inventario.html.

JS:
  Listener en cada input stock real:
    Recalcular diferencia y estado de la fila en vivo.
    Actualizar contador del header (X/45).
    Actualizar barra de progreso.
    Actualizar stats del footer.

  Switch modo ciego: toggle clase .modo-ciego en la tabla, CSS oculta columna teórico:
    .conteo-table.modo-ciego .col-teorico { display: none; }

RESPONSIVE:
  @media (max-width: 768px):
    Tabla → cards. Cada producto:
      Header: nombre + SKU + estado.
      Body: input stock real grande (font-size 18, padding 12, full width).
      Footer: teórico (si modo ciego off) + diferencia.
    Inputs grandes para tactil.
```

### Hecho cuando

- Switch modo ciego oculta/muestra columna teórico.
- Tipear en stock real recalcula diferencia y badge en vivo.
- Barra de progreso y contador se actualizan.
- Modal de confirmación al finalizar funciona.
- Mobile: cards con inputs grandes.

---

## Sección 4.3 — Fichas técnicas B13

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b13-fichas.jsx (234 líneas).

Crear backoffice/fichas.html partiendo de _layout.html.
Sidebar activo: catalogo.
Breadcrumb: ["Inicio", "Catálogo", "Fichas técnicas"].

ESTRUCTURA:

1) BOPageHeader: "Fichas técnicas" + subtítulo "12 productos con receta · 8 sin definir".
   Actions: btn primary "+ Nueva ficha".

2) Layout split:
   .fichas-layout {
     display: grid;
     grid-template-columns: 320px 1fr;
     gap: 18;
     height: calc(100vh - 240px);
   }

   IZQ — lista de productos con ficha:
     Card sticky con header "Productos" + search.
     Lista scrolleable (.fichas-list):
       Cada item:
         .ficha-list-item (padding 12 14, border-bottom, cursor pointer,
                           display flex items-center gap 10)
         Avatar inicial / foto pequeña (40x40 border-radius 8)
         Info:
           Nombre (font-weight 600)
           Foodcost: "32%" o "Sin definir" (en muted)
       Item activo: bg accent suave, borde izq accent.

       12 items del JSX (ej: Arepa de maíz, Hamburguesa, Bandeja paisa, etc.)

   DER — detalle de la ficha (.ficha-detail):
     Header con foto grande (200x150) + info:
       Nombre del producto (h2)
       Categoría
       Precio venta destacado
       Botones: btn-ghost "Ver producto", btn-secondary "Editar".

     Grid 3 cards de KPIs (sin tono):
       Costo total: $X.XXX
       Margen: 68%
       Foodcost: 32%

     Card "Ingredientes":
       Header con título + botón "+ Agregar ingrediente" (abre drawer "drawerIngrediente").
       Tabla:
         Columnas: Ingrediente / Cantidad / Unidad / Costo unit / Costo total / % del costo / Acciones.
         Filas (datos del JSX, ej para Arepa de maíz):
           Maíz precocido — 80 — g — $4/g — $320 — 35.6% — [editar][eliminar]
           Sal — 2 — g — $1.5/g — $3 — 0.3% — ...
           Aceite — 5 — ml — $20/ml — $100 — 11.1% — ...
           etc.
       Footer: "Costo total: $X.XXX" en bold, derecha.

     Card "Información nutricional" (opcional):
       Grid 2 cols con: Calorías, Proteínas, Grasas, Carbohidratos, Fibra, Sodio.
       Inputs editables.

     Card "Alergenos / Restricciones":
       Chips toggleables: Gluten, Lactosa, Frutos secos, Picante, Vegetariano, Vegano, Sin azúcar.

3) DRAWER "Agregar ingrediente":
   Form:
     Buscar ingrediente (input con autocompletar mock — datalist).
     Cantidad / Unidad (g, ml, u).
     Botón "Agregar".
   Click agregar → cierra drawer + agrega fila a la tabla + recalcula totales (mock).

JS:
  Click en item de la lista izq → marca selected + actualiza el detalle.
    (Definir un objeto fichas con datos por id, copiar del JSX.)

RESPONSIVE:
  @media (max-width: 1024px):
    .fichas-layout { grid-template-columns: 1fr; height: auto; }
    Mostrar lista o detalle, no ambos.
    Estado: .show-list (default) o .show-detail.
    Click en item → location.hash = '#detail' + .show-detail visible.
    Botón "← Volver" en el detalle vuelve a lista.
```

### Hecho cuando

- Lista izq con 12 productos, click cambia el detalle.
- Detalle muestra KPIs, tabla ingredientes, alergenos.
- Drawer "Agregar ingrediente" abre.
- Mobile: navegación tipo master-detail con hash.

---

## Sección 4.4 — Clientes B14 + drawer detalle

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b14-clientes.jsx (272 líneas — densa, tiene drawer con tabs).

Crear backoffice/clientes.html partiendo de _layout.html.
Sidebar activo: clientes.
Breadcrumb: ["Inicio", "Clientes"].

ESTRUCTURA:

1) BOPageHeader: "Clientes" + subtítulo "342 clientes · 18 con saldo pendiente".
   Actions: btn ghost "Importar", btn primary "+ Nuevo cliente".

2) Toolbar:
   Search "Buscar por nombre, cédula o email..."
   Select "Todos los estados" (Activos / Inactivos / Con saldo)
   Toggle "Solo con saldo pendiente"
   Spacer
   btn ghost "Exportar"

3) 4 KPIs:
   Total clientes: 342, helper "92 nuevos este mes" (delta up)
   Con saldo: 18, helper "$2.450.000 pendiente", tone-warning
   Top compradores: 12, helper "facturan +$1M/mes"
   Inactivos: 47, helper "hace 90+ días"

4) Tabla:
   Columnas: Cliente (avatar + nombre + email) / Cédula/NIT / Teléfono /
              Última compra (fecha relativa) / Total compras / Saldo / Estado / Acciones.

   8 filas exactas del JSX. Datos colombianos.

   Saldo:
     0 → "—" en muted
     > 0 → texto rojo bold (ej "$450.000")
   Estado: badge-success "Activo" / badge-muted "Inactivo".
   Acciones: ghost "Ver detalle" → abre drawer "drawerCliente" con id del cliente.

5) Paginación.

6) DRAWER "Detalle cliente" (drawer derecho 480px desktop, full-width mobile):
   <div id="drawerCliente" class="drawer-backdrop">
     <div class="drawer drawer-lg" style="width: 560px">  /* drawer más ancho */
       <div class="drawer-header">
         Avatar grande (60x60) + info:
           Nombre (h3)
           Email · Teléfono
           Badges: Estado, "Cliente VIP" (si aplica), "Saldo pendiente $X.XXX".
         Botones: btn-ghost "Editar", btn-icon × close.
       </div>
       <div class="drawer-body" style="padding: 0">
         <!-- TABS -->
         <div class="config-tabs" data-tabs="cliente">
           <button data-tab="info" class="is-active">Info</button>
           <button data-tab="movimientos">Movimientos</button>
           <button data-tab="documentos">Documentos</button>
           <button data-tab="notas">Notas</button>
         </div>
         <div class="drawer-tab-content" style="padding: 18 22">

           <!-- Panel info -->
           <div data-panel="info">
             Card "Datos personales":
               Tipo doc: CC
               Número: 1.012.345.678
               Fecha nac: ...
               Género: ...
             Card "Contacto":
               Email, Teléfono, Dirección, Ciudad
             Card "Comercial":
               Tipo cliente (select: Particular / Empresa)
               Lista de precios asignada
               Vendedor asignado
               Crédito habilitado: switch
               Cupo de crédito: $500.000
           </div>

           <!-- Panel movimientos (cuenta corriente) -->
           <div data-panel="movimientos" hidden>
             Header con stats:
               Saldo actual: $450.000 (rojo)
               Total ventas: $4.250.000
               Ticket promedio: $87.000
             Tabla:
               Columnas: Fecha / Tipo (Factura/Pago/Nota crédito) / Documento / Monto /
                         Saldo running.
               6-8 filas de movimientos (datos del JSX).
             Botones abajo: "Registrar pago", "Generar estado de cuenta".
           </div>

           <!-- Panel documentos -->
           <div data-panel="documentos" hidden>
             Lista de documentos del cliente: facturas con estado, descargables (mock).
             Empty state si no hay.
           </div>

           <!-- Panel notas -->
           <div data-panel="notas" hidden>
             Textarea grande "Agregar nota..." + botón "Guardar nota".
             Lista de notas previas con autor + fecha.
           </div>

         </div>
       </div>
       <div class="drawer-footer">
         <button class="btn btn-secondary" data-close>Cerrar</button>
         <button class="btn btn-destructive">Desactivar cliente</button>
       </div>
     </div>
   </div>

JS:
  UI.tabs('[data-tabs="cliente"]') para alternar paneles.
  Click en fila de tabla → UI.openDrawer('drawerCliente').
    Opcional: actualizar el drawer con datos del cliente clickeado (mock con un objeto clientes[id]).

RESPONSIVE:
  @media (max-width: 768px):
    Drawer full-width.
    Tabs scroll-x.
    Tablas dentro del drawer scroll-x o cards.
    KPIs grid 2x2.
```

### Hecho cuando

- Tabla con 8 clientes, saldos rojos donde corresponde.
- Click "Ver detalle" abre drawer con tabs.
- Tabs Info/Movimientos/Documentos/Notas alternan paneles.
- Mobile: drawer full-width, tabs scrollables.

---

## Checklist final del Sprint 4

- [ ] categorias.html: árbol con expand/collapse, modal nueva, tab modificadores.
- [ ] conteo.html: switch modo ciego, inputs en vivo recalculan diferencia y barra, finalizar funciona.
- [ ] fichas.html: lista izq, detalle der con KPIs y tabla ingredientes, drawer agregar.
- [ ] clientes.html: tabla con saldos, drawer detalle con 4 tabs funcionales.
- [ ] Tema dark funciona en las 4.
- [ ] Mobile: las 4 se adaptan correctamente.

Commit: `feat: sprint 4 backoffice operaciones completo`. Pasamos al Sprint 5.
