# Sprint 06 — POS Web (5 pantallas)

> **Objetivo:** punto de venta web para mesero/cajero — apertura de turno, mapa de mesas, toma de pedido, cobro, histórico.
> **Estimado:** 5 horas.
> **Pantallas:** C1–C5.
> **Dependencias:** Sprint 0 (componentes y overlays).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| Shell POS | `design-system/pos/pos-shared.jsx` (175 líneas) |
| C1 Apertura | `design-system/pos/pos-c1-apertura.jsx` (134 líneas) |
| C2 Mapa de mesas | `design-system/pos/pos-c2-mapa.jsx` (164 líneas) |
| C3 Toma de pedido | `design-system/pos/pos-c3-pedido.jsx` (280 líneas — la más densa del POS) |
| C4 Modal de cobro | `design-system/pos/pos-c4-cobro.jsx` (172 líneas) |
| C5 Histórico | `design-system/pos/pos-c5-historico.jsx` (178 líneas) |

Host de referencia: `design-system/02-pos-web.html`.

---

## Sección 6.1 — Shell POS + Apertura de turno C1

### Prompt para Claude Code

```
Leé:
  - design-system/pos/pos-shared.jsx (175 líneas) — el shell del POS
  - design-system/pos/pos-c1-apertura.jsx

A diferencia del backoffice, el POS tiene un shell distinto: más denso, sin sidebar grande,
con header fino y footer/bottom-bar de usuario.

Crear assets/css/pos-shell.css:

LAYOUT:
  .pos-shell {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    bg var(--bg);
  }
  .pos-topbar {
    height: 52;
    flex-shrink: 0;
    bg var(--alt);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 18;
    gap: 14;
  }
  .pos-topbar-logo (display flex items-center gap 8: cuadrado bg accent "I" + "Inventario")
  .pos-topbar-info (display flex items-center gap 16, font-size 12, color muted):
    chips: "Sede Norte", "Caja 1", "Turno #047", "09:32 AM" (reloj actualizado con JS).
  .pos-topbar-spacer (flex 1)
  .pos-topbar-actions: search, notificaciones, avatar.

  .pos-content {
    flex: 1;
    overflow: hidden;  /* el contenido específico maneja su propio overflow */
    display: flex;
  }

  .pos-bottombar (opcional, alguna pantalla puede usarla):
    height: 56, flex-shrink 0, bg alt, border-top, display flex items-center px 18 gap 12.
    Botones grandes para acciones contextuales.

JS para reloj en topbar:
  setInterval(() => {
    document.querySelector('[data-clock]').textContent = new Date().toLocaleTimeString('es-CO');
  }, 1000);

CREAR pos/_layout.html como plantilla del shell POS.

PANTALLA C1 - Apertura de turno:
  pos/apertura.html partiendo de _layout.html.

  El panel principal (pos-content) tiene UN MODAL CENTRADO sobre un fondo del POS dimmed.
  Para simplicidad: bg var(--alt) con texto blur "Mapa de mesas (próximamente disponible)" detrás,
  y encima un overlay+modal grande:

    .pos-blocker (position absolute inset 0, bg rgba(0,0,0,.4))
    .pos-modal-card (centered, max-width 560, bg, border-radius xl, padding 28)

  Contenido del modal:
    Header con ícono lock + título "Apertura de turno" + subtítulo "Caja 1 · Sede Norte".
    Form en 2 cols:
      Caja (select) — Caja 1
      Cajero (read-only "Juan Camilo Ruiz")
    Monto inicial:
      Input grande con prefijo $, valor "200.000" (font-size 26).
    Sección "Denominaciones (opcional)" colapsable:
      Click en header expande/contrae.
      Tabla compacta: Billete/Moneda × Cantidad → Subtotal.
      Filas:
        $50.000  — input qty (3)  → $150.000
        $20.000  — input qty (2)  → $40.000
        $10.000  — input qty (1)  → $10.000
        $5.000   — qty (0)        → $0
        $2.000   — qty (0)        → $0
        $1.000   — qty (0)        → $0
        Monedas — qty (0)         → $0
      Footer: "Total denominaciones: $X.XXX" (sumatoria en vivo, debe igualar monto inicial).
    Observaciones (textarea opcional).
    Footer botones:
      btn-secondary "Salir" → /index.html
      btn-primary "Abrir turno" (full width o destacado).
        Click → location.href = '/pos/mapa.html'.

  En mobile el modal ocupa 100% del viewport con padding mínimo.
```

### Hecho cuando

- Shell POS con topbar reloj.
- Modal apertura abre solo con monto inicial visible y denominaciones colapsadas.
- Sumatoria de denominaciones en vivo.
- Click "Abrir turno" navega al mapa.

---

## Sección 6.2 — Mapa de mesas C2

### Prompt para Claude Code

```
Leé design-system/pos/pos-c2-mapa.jsx (164 líneas).

Crear pos/mapa.html partiendo de _layout.html.

ESTRUCTURA del pos-content:

1) Header secundario (debajo del topbar):
   .pos-section-header (height 52, flex-shrink 0, bg, border-bottom,
                        display flex items-center px 18 gap 16)

   Tabs zona: Salón (activo · 12 mesas) / Terraza (4) / Barra (2).
     Cada tab .pos-zone-tab: padding 8 14, border-radius 8.
     Activa: bg accent, color #fff.
   Spacer.
   3 KPIs compactos inline:
     "Ocupación: 68%" + barra mini.
     "Ventas turno: $1.245.000".
     "Tiempo promedio: 42 min".
   Spacer.
   btn primary "+ Nueva venta directa" (sin mesa, ej take-away).

2) Body principal: canvas del mapa o grid de mesas.
   .pos-mapa {
     flex: 1;
     overflow: auto;
     padding: 24;
     position: relative;
     bg de cuadrícula sutil (background gradient o image)
   }

   Mesas como botones grandes posicionados:
     .mesa-pos {
       width: 110;
       height: 110;
       border-radius: 16;
       border: 2px solid;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       cursor: pointer;
       gap: 4;
       position: absolute;  /* opcionalmente static en grid si layout simple */
       transition: transform 100ms;
     }
     .mesa-pos:hover { transform: scale(1.04); }

     .mesa-pos-number (font-size 28, font-weight 700)
     .mesa-pos-status (font-size 11, font-weight 500, uppercase)
     .mesa-pos-meta (font-size 10, color muted)

     ESTADOS (replicar del JSX):
     - Libre: border var(--border), bg, color muted. Texto "Libre".
     - Ocupada: border var(--success), bg success suave, color text. 
       Mostrar timer "32 min", número de comensales "4 pers", ticket "$87.400".
     - Reservada: border var(--info), bg info suave. Texto "Reservada · 13:30 · Sra. Pérez".
     - En cobro: border var(--warning), bg warning suave, animación pulse.
       Texto "Cobrando · $145.000".

   18 mesas distribuidas. Si el JSX tiene posiciones, copiarlas. Sino:
     Grid flexible 4-5 cols en desktop con auto-fill.

   Click en mesa LIBRE: location.href = '/pos/pedido.html?mesa=' + n + '&nuevo=1'
   Click en mesa OCUPADA: location.href = '/pos/pedido.html?mesa=' + n
   Click en RESERVADA: modal con detalles de la reserva (mock simple).
   Click en EN COBRO: location.href = '/pos/pedido.html?mesa=' + n + '&cobro=1'.

3) Bottom bar fina (.pos-bottombar):
   Izq: avatar usuario + nombre "Juan Camilo · Mesero".
   Centro: botones rápidos "Mapa" (activo) / "Comandas" / "Histórico".
   Der: btn-ghost "Cerrar turno" (data-open-modal="modalCerrarTurno").

JS modal cerrar turno: confirmación → location.href = '/pos/historico.html'.

RESPONSIVE:
  @media (max-width: 1024px) — tablet:
    Mesas más pequeñas (90x90), mantener canvas.
  @media (max-width: 768px) — mobile:
    Convertir a grid simple 2 cols, no canvas posicionado.
    Cada mesa full width o medio, alta de 100px, info en línea horizontal.
    Topbar: ocultar info chips (sede/caja/turno/hora) o colapsar en menú.
    Tabs zona: scroll-x.
```

### Hecho cuando

- 18 mesas con 4 estados distintos visualmente claros.
- Click navega correctamente según estado.
- Tabs zona alternan visibilidad (mock — pueden ser las mismas mesas).
- KPIs en header.
- Mobile: grid simple legible.

---

## Sección 6.3 — Toma de pedido C3

### Prompt para Claude Code

```
Leé design-system/pos/pos-c3-pedido.jsx (280 líneas — la más compleja del POS).

Crear pos/pedido.html partiendo de _layout.html.
JS al cargar:
  const params = new URLSearchParams(location.search);
  const mesa = params.get('mesa') || '5';
  Mostrar mesa # en el header.

ESTRUCTURA del pos-content:

Layout principal:
  .pos-pedido-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);  /* aprox 60/40 */
    height: 100%;
    overflow: hidden;
  }

IZQ — catálogo (.pos-catalog):
  display flex flex-col, overflow hidden.

  Header:
    Tabs categorías horizontales scroll-x: Entradas / Platos / Bebidas / Postres / Combos / Adicionales.
    Search compacto a la derecha "Buscar producto..."

  Grid de productos (overflow-y: auto, padding 16):
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)).
    gap: 12.

    Card .pos-product:
      bg, border, border-radius lg, padding 12, cursor pointer.
      Hover: translateY(-1px), border accent.
      Foto placeholder (full width, aspect 1:1, gradient sutil).
      Nombre (font-size 13, font-weight 600, line-clamp 2).
      Precio (font-size 14, font-weight 700, color accent).
      Si producto inactivo/sin stock: opacity .5, cursor not-allowed.

    18-24 productos exactos del JSX.

    Click en producto:
      Si tiene modificadores (ej hamburguesa): UI.openModal('modalModificadores')
        con datos del producto (nombre, foto, modificadores requeridos).
      Si no: agregar directo a comanda con cantidad 1.

DER — comanda (.pos-comanda):
  bg alt, border-left, display flex flex-col, overflow hidden.

  Header (.comanda-header):
    Padding 16, border-bottom.
    Línea 1: "Mesa 5" (font-size 18, font-weight 700) + chip "Salón".
    Línea 2 (font-size 12, color muted):
      "Mesero: Juan Camilo · Comensales: 4 [editable]" (input qty inline pequeño).
    Botón ghost arriba-der: ⋯ (menú con: Cambiar mesero, Cambiar mesa, Anular comanda).

  Lista de items (.comanda-items):
    flex 1, overflow-y auto, padding 14.
    Cada item:
      .comanda-item (display flex gap 10, padding-bottom 10, border-bottom dashed)
      Izq: cantidad con +/- (botones 28x28, número entre).
      Centro:
        Nombre (font-weight 600).
        Modificadores debajo (font-size 11, color muted): "Sin cebolla, Extra queso (+$2.500)".
        Si tiene observación: "👤 Sin sal" (font-size 11, italic, color warning).
      Der: precio total del item (font-weight 600), botón × eliminar.

    Datos mock iniciales (ej):
      2× Hamburguesa clásica — Sin cebolla, Extra queso — $42.000
      1× Limonada de coco — Sin azúcar — $9.000
      3× Arepas de queso — $18.000

  Footer (.comanda-footer):
    border-top, padding 14, bg.
    Subtotal: $69.000
    Descuento: $0 [+ aplicar] (link)
    Selector PROPINA chips: 0% / 10% / 15% (activa, default) / 20% / Otra.
      Activa: bg accent, color #fff.
      Click activa esa, deselecciona otras, recalcula total.
      "Otra" abre input pequeño inline.
    Propina: $10.350 (calculada).
    Total: $79.350 (font-size 22, font-weight 700, destacado).

    Botones grandes (display grid 2 cols, gap 8):
      btn-secondary "Enviar a cocina" (no cobra, manda comanda al KDS — toast info).
      btn-primary "Cobrar" → UI.openModal('modalCobro').

JS:
  Estado global de la comanda en window.comanda = { items: [...], propinaPct: 15, ... }.
  Funciones:
    addItem(productId, modificadores=[], obs='')
    removeItem(itemId)
    setQty(itemId, qty)
    setPropina(pct)
    render() — repinta lista y totales.

  Listeners en botones +/-, ×, chips propina.

  Click en producto del catálogo (sin modificadores):
    addItem(id) + render().

  Modal modificadores: ver siguiente sección.

MODAL MODIFICADORES:
  Dentro de pedido.html:
  <div id="modalModificadores" class="modal-backdrop">
    <div class="modal modal-md">
      <div class="modal-header">
        Foto + nombre del producto + descripción + precio base.
        ×
      </div>
      <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
        Grupos de modificadores (ej hamburguesa):
          Grupo "Tamaño" (Obligatorio · 1 selección):
            Radio: Pequeña / Mediana (+$2.000) / Grande (+$4.000)
          Grupo "Adiciones" (Opcional · máx 3):
            Checkbox: Queso extra (+$2.500), Tocineta (+$3.000), Aguacate (+$2.000),
                      Cebolla caramelizada (+$1.500), Champiñones (+$2.000)
          Grupo "Punto de cocción" (Obligatorio · 1):
            Radio: 3/4 / Término medio / Bien cocida.
          Selector cantidad (-1 / 1 / +1) grande.
          Observación: textarea "Ej: sin sal, sin gluten..."

      <div class="modal-footer">
        Resumen del precio actualizado en vivo en izq:
          "$22.000 base + $4.500 adiciones × 1 = $26.500"
        Botón btn-primary "Agregar — $26.500".
          Click: agrega a comanda, cierra modal.

RESPONSIVE:
  @media (max-width: 1024px) — tablet:
    Mantener layout 2 cols pero ajustar proporciones (50/50).

  @media (max-width: 768px) — móvil:
    Tabs ARRIBA: "Catálogo" / "Comanda (3) · $79.350".
    .pos-pedido-layout { grid-template-columns: 1fr; }
    Solo se ve uno a la vez.
    Switcher con badges activos.

  Click "Enviar a cocina" desde catálogo en mobile: toast "Comanda enviada al KDS".
```

### Hecho cuando

- Catálogo con 18+ productos, click los agrega o abre modificadores.
- Comanda con +/- de cantidad, propina chips, totales recalculados en vivo.
- Modal modificadores con resumen de precio en vivo.
- En mobile: tabs Catálogo/Comanda.

---

## Sección 6.4 — Modal de cobro C4

### Prompt para Claude Code

```
Leé design-system/pos/pos-c4-cobro.jsx (172 líneas).

Crear el modal C4 dentro de pos/pedido.html (NO archivo separado — es modal).

Estructura:

<div id="modalCobro" class="modal-backdrop">
  <div class="modal modal-lg" style="max-width: 720px">
    <div class="modal-header">
      Título "Cobrar mesa 5" + subtítulo "Total a cobrar: $79.350"
      Botón × close.
    </div>

    <div class="modal-body" style="display: grid; grid-template-columns: 1fr 280px; gap: 20;">

      IZQ — método de pago:
        Tabs grandes: Efectivo (activo) / Tarjeta / Transferencia / Mixto.

        Panel EFECTIVO:
          Input grande "Monto recibido" con prefijo $, font-size 28.
          Quick chips: $80.000, $100.000, $150.000, "Exacto" (auto-llena).
            Click en chip: rellena input.
          Cálculo en vivo:
            "Vuelto a entregar: $X.XXX" (verde si positivo, rojo si negativo).
          Selector PROPINA (igual al de la comanda): 0/10/15/20/Otra.
            Si en la comanda ya estaba en 15%, default mantiene 15%.

        Panel TARJETA:
          Selector tipo: Crédito / Débito.
          Selector franquicia: Visa / MC / Amex / Diners / otra (radios visuales con logos).
          Cuotas (1, 3, 6, 12, 24, 36).
          Datalogic input "Últimos 4 dígitos (opcional)".

        Panel TRANSFERENCIA:
          Selector banco: Bancolombia / Davivienda / BBVA / etc (lista mock).
          Referencia: input.
          Comprobante: uploader placeholder.

        Panel MIXTO:
          2 inputs: monto efectivo + monto tarjeta. Total debe sumar el grand total.
          Campos según método.

      DER — datos del cliente (opcional):
        Card "Datos del cliente":
          Toggle "Identificar cliente" (switch).
          Si on:
            Tipo doc + número (input con autocomplete mock).
            Nombre.
            Email (para enviar factura).
          Si off: solo "Consumidor final".
        Card "Resumen":
          Subtotal: $69.000
          Propina (15%): $10.350
          Total: $79.350 (destacado).

    </div>

    <div class="modal-footer">
      btn-secondary "Cancelar" (data-close)
      btn-primary "Confirmar cobro — $79.350"
        Click:
          UI.toast({ type: 'success', title: 'Venta #4821 registrada', sub: 'Imprimiendo factura...' });
          UI.closeModal('modalCobro');
          // Reset comanda + redirect mapa después de 1s:
          setTimeout(() => location.href = '/pos/mapa.html', 1200);
    </div>
  </div>
</div>

JS:
  Tab efectivo: input listener actualiza vuelto en vivo.
  Quick chips: rellenan input.
  Tabs UI.tabs.
  Switch identificar cliente: muestra/oculta campos.

RESPONSIVE:
  @media (max-width: 768px):
    Modal full-screen.
    Layout: 1 col, datos cliente al final.
```

### Hecho cuando

- Modal abre desde el botón "Cobrar" del C3.
- Tabs método cambian panel.
- Cálculo de vuelto en vivo.
- Click "Confirmar cobro" muestra toast y redirect a mapa.

---

## Sección 6.5 — Histórico C5

### Prompt para Claude Code

```
Leé design-system/pos/pos-c5-historico.jsx (178 líneas).

Crear pos/historico.html partiendo de _layout.html.

ESTRUCTURA del pos-content:

1) Header secundario:
   Título "Histórico del turno" + chip "Turno #047".
   Selector: "Hoy" / "Turno actual" (default activo).
   Botón "Cerrar turno" destructive a la derecha.

2) 4 KPIs:
   Ventas turno: $1.245.000, helper "47 transacciones".
   Tickets: 47, helper "ticket promedio $26.490".
   Anulaciones: 2 ($45.000), tone-warning.
   Productos vendidos: 184 unidades.

3) Toolbar:
   Search "Buscar # ticket o cliente..."
   Select rango horario.
   Select mesero.
   Select método de pago.
   Spacer.
   btn-ghost "Imprimir reporte X".

4) Tabla:
   Columnas: Hora / Ticket # / Mesa / Mesero / Items / Método / Total / Estado.
   Estado: badge-success "Pagado" / badge-warning "Anulado" / badge-info "Devuelto".
   Filas (12-15 mock):
     09:34 — #4821 — M5 — Juan Camilo — 6 ítems — Efectivo — $79.350 — Pagado
     09:42 — #4822 — M2 — María F. — 3 ítems — Tarjeta — $48.000 — Pagado
     09:55 — #4823 — Take-away — Juan Camilo — 2 ítems — Transferencia — $24.000 — Pagado
     10:12 — #4824 — M8 — Carlos R. — 4 ítems — Tarjeta — $87.500 — Anulado (rojo)
     ...
   Acciones por fila: ⋯ menu con: Ver detalle, Reimprimir, Anular (si pagado), Reembolsar.

5) Click en fila → MODAL "Detalle del ticket":
   Header: # + fecha + mesero.
   Body:
     Items con cantidad, nombre, modificadores, precio.
     Subtotal, propina, total.
     Método de pago + información (vuelto si efectivo, últimos 4 dígitos si tarjeta).
     Cliente (si identificado).
     CUFE / consecutivo DIAN.
   Footer:
     btn-ghost "Reimprimir factura"
     btn-ghost "Enviar por email"
     btn-destructive "Anular" (si está pagado).
     Cerrar.

6) Bottom bar fina con totales del turno:
   "Apertura $200.000 · Ventas $1.245.000 · Esperado $1.445.000"
   Botón "Cerrar turno" → modal confirmación → toast → /index.html

JS:
  Click en fila → UI.openModal('modalDetalleTicket') con datos del ticket (mock por id).
  Search filtra filas en vivo.

RESPONSIVE:
  Tabla → cards en < 768. Cada card: ticket #, hora grande, info clave (mesa/mesero/método/total).
```

### Hecho cuando

- 4 KPIs del turno.
- Tabla con 12+ tickets, badges de estado.
- Click en fila abre modal con detalle completo.
- "Cerrar turno" muestra confirmación y vuelve al index.

---

## Checklist final del Sprint 6

- [ ] apertura.html: shell POS + modal apertura con denominaciones.
- [ ] mapa.html: 18 mesas con 4 estados, click navega correctamente, KPIs visibles.
- [ ] pedido.html: catálogo + comanda funcionando, modificadores, propina, total en vivo.
- [ ] Modal cobro: 4 métodos, vuelto en vivo, datos cliente.
- [ ] historico.html: KPIs turno, tabla tickets, modal detalle.
- [ ] Navegación completa: apertura → mapa → pedido → cobro (modal) → mapa → histórico.
- [ ] Tema dark perfecto.
- [ ] Mobile: pedido tab Catálogo/Comanda, mapa grid 2 cols.

Commit: `feat: sprint 6 pos web completo`. Pasamos al Sprint 7 (Mesero móvil).
