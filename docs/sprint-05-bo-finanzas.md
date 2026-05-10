# Sprint 05 — Backoffice Finanzas (5 pantallas)

> **Objetivo:** gastos, facturación DIAN, caja, reportes, integraciones.
> **Estimado:** 5 horas.
> **Pantallas:** B16 (gastos), B17 (DIAN), B18 (reportes), B20 (caja), B22 (integraciones).
> **Dependencias:** Sprint 0-4 (todo el backoffice ya consolidado).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| B16 Gastos | `design-system/backoffice/bo-b16-gastos.jsx` (147 líneas) |
| B17 DIAN | `design-system/backoffice/bo-b17-dian.jsx` (278 líneas) |
| B18 Reportes | `design-system/backoffice/bo-b18-reportes.jsx` (134 líneas) |
| B20 Caja | `design-system/backoffice/bo-b20-caja.jsx` (280 líneas) |
| B22 Integraciones | `design-system/backoffice/bo-b22-integraciones.jsx` (182 líneas) |

---

## Sección 5.1 — Gastos del mes B16

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b16-gastos.jsx.

Crear backoffice/gastos.html partiendo de _layout.html.
Sidebar activo: gastos.
Breadcrumb: ["Inicio", "Gastos"].

ESTRUCTURA:

1) BOPageHeader: "Gastos" + subtítulo "Marzo 2025 · 24 gastos registrados".
   Actions:
     btn ghost "[ícono calendar] Mar 2025"
     btn ghost "Exportar"
     btn primary "+ Nuevo gasto" (data-open-modal="modalGasto").

2) Grid 3 KPIs:
   Total del mes: $X.XXX.XXX, helper "vs feb: -8%", tone-muted.
   Pendiente de pago: $XXX.XXX (3 facturas), tone-warning.
   Vencidos: $XXX.XXX (1 factura), tone-error.

3) Toolbar:
   Search "Buscar proveedor o concepto..."
   Select Categoría (Alimentos / Insumos / Servicios / Renta / Nómina / Otros).
   Select Estado (Todos / Pagado / Pendiente / Vencido).
   Select Mes (default Marzo 2025).
   Spacer.
   Toggle "Vista mensual / Lista".

4) Tabla:
   Columnas: Fecha / Proveedor / Concepto / Categoría / Monto / Estado pago / Vence / Acciones.

   8-10 filas exactas del JSX, datos colombianos:
     Coltejer S.A.S — Servicios — $450.000 — Pagado (verde) — vencía 05/03
     Restaurante Insumos del Valle — Alimentos — $1.230.000 — Pendiente (amarillo) — vence 18/03
     Renta Local Chapinero — Renta — $2.800.000 — Vencido (rojo) — venció 01/03 (✗ destacado)
     ... (mantener mix realista de estados)

   Estado: badge-success / badge-warning / badge-error.
   Acciones: botón ghost ⋮ con menu (Pagar, Editar, Eliminar — mock).

5) Paginación.

6) MODAL "Nuevo gasto" (modalGasto):
   Form:
     Proveedor (input con autocomplete mock)
     Concepto (input)
     Categoría (select)
     Monto (input con prefijo $)
     Fecha del gasto (input date)
     Vencimiento (input date)
     Método de pago (select)
     Adjuntar factura (uploader placeholder)
     Notas (textarea)
   Footer: Cancelar / Guardar.
   Click guardar: toast + cierra modal + agrega fila visual.

RESPONSIVE:
  Tabla → cards apiladas en < 768px (mismo patrón anterior).
  KPIs grid 1 col en < 480px.
```

### Hecho cuando

- 3 KPIs con tonos correctos.
- Tabla con badges de estado correctos (pagado/pendiente/vencido).
- Modal nuevo gasto abre y al guardar muestra toast.

---

## Sección 5.2 — Facturación electrónica DIAN B17

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b17-dian.jsx (278 líneas — la más densa de finanzas).

Crear backoffice/dian.html partiendo de _layout.html.
Sidebar activo: facturacion.
Breadcrumb: ["Inicio", "Facturación DIAN"].

ESTRUCTURA:

1) BOPageHeader: "Facturación electrónica" + subtítulo "Estado: Conectado · Resolución 18760000003148".
   Actions: btn ghost "Configuración DIAN", btn primary "Generar factura manual".

2) BANNER de estado de conexión (siempre visible arriba):
   .dian-status-banner (display flex items-center gap 14, padding 14 18,
                        bg success suave, border-left 4px solid --success,
                        border-radius 10, margin-bottom 18)
   Ícono check-circle grande verde animado (CSS keyframe sutil).
   Texto:
     Header: "DIAN Conectado" (font-weight 600, color verde oscuro)
     Sub: "Resolución vigente hasta 31/12/2026 · Rango: 1 a 5.000.000 · Consumido: 1.842"
   Der: btn-ghost "Sincronizar" + last sync "hace 2 min".

3) Si hay rechazadas → AlertBanner del Sprint 0:
   "Requieren tu atención (3 facturas con error DIAN)"
   Items con detalles del JSX, ej:
     "Factura #FE-1842 — código error B0049 — DIAN no reconoce el régimen tributario del cliente"
     Actions: [Reintentar (primary), Ver detalle, Descargar XML]

4) Grid 4 KPIs:
   Facturas del mes: 487, helper "+18% vs feb", delta up.
   Aceptadas: 472 (97%), tone-success.
   Rechazadas: 12, tone-error.
   En cola: 3, tone-warning, ICONO CON CLASE PULSE (animación CSS).

   Animación pulse del ícono "En cola" (replicar del JSX):
     CSS:
       .dian-pulse { animation: dianPulse 1.6s infinite; }
       @keyframes dianPulse {
         0%, 100% { transform: scale(1); opacity: 1; }
         50%      { transform: scale(1.1); opacity: 0.7; }
       }

5) Toolbar:
   Search "Buscar # consecutivo o cliente..."
   Select Estado DIAN (Todos / Aceptada / Rechazada / En cola / Error)
   Select Tipo (Facturas / Notas crédito / Notas débito)
   Select Rango fechas
   Spacer
   btn ghost "Reportar contingencia" (link).

6) Tabla:
   Columnas: # / Fecha / Cliente / Total / Estado DIAN (badge) / CUFE (truncado con ...) /
              Acciones (ver, descargar, reintentar si error).

   10-12 filas con mix de estados. Datos exactos del JSX si existen, sino completar:
     #FE-1842 — 14/03 09:32 — Distribuidora El Mayor — $245.000 — Aceptada — abc...xyz — [👁][📄]
     #FE-1841 — 14/03 09:28 — Carlos Ramírez — $87.000 — En cola (con pulse) — — [👁]
     #FE-1830 — 13/03 18:14 — Natalia Suárez — $156.000 — Rechazada — abc...xyz — [👁][🔄][⚠]
     ...

   CUFE: <code style="font-family: monospace; font-size: 10; color: muted;">
   Botón retry con tooltip "Reintentar envío DIAN".

7) Paginación.

JS:
  Click en botón retry de fila rechazada:
    Cambiar estado de la fila a "En cola" con pulse + toast info "Reenviando a DIAN...".
    Después de 2-3s, toast success "Factura aceptada" y cambiar badge a Aceptada.

RESPONSIVE:
  Tabla → cards en < 768px.
  KPIs 2x2 en tablet, 1 col en móvil.
  Banner conexión: ícono más pequeño, texto wrap.
```

### Hecho cuando

- Banner verde de estado DIAN visible y animado.
- KPI "En cola" con animación pulse.
- AlertBanner con 3 facturas rechazadas si aplica.
- Click retry simula reintento (toast + cambio de estado).

---

## Sección 5.3 — Caja B20

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b20-caja.jsx (280 líneas).

Crear backoffice/caja.html partiendo de _layout.html.
Sidebar activo: caja.
Breadcrumb: ["Inicio", "Caja"].

ESTRUCTURA:

1) BOPageHeader: "Caja" + subtítulo "Sede Norte · Turno actual: 09:00 - 17:00".
   Actions: btn-ghost "Ver histórico" → tab Histórico.

2) Tabs: Apertura / Cierre / Histórico de turnos.
   Tab default depende de estado:
     Sin turno abierto → Apertura activa
     Turno abierto → Cierre activa
   Para la demo, default: Cierre activo (más interesante visualmente).

3) Panel APERTURA:
   Card centrado (max-width 600):
     Header "Apertura de turno"
     Form:
       Caja (select: Caja 1 / Caja 2 / Caja 3) — default Caja 1
       Cajero asignado (select usuarios) — pre-llenado "Juan Camilo Ruiz"
       Monto inicial (input con prefijo $) — pre-llenado "$200.000"
       Sección "Denominaciones (opcional)":
         Tabla pequeña: billete/moneda × cantidad × subtotal.
         Filas: $50.000 × 3 = $150.000, $20.000 × 2 = $40.000, $10.000 × 1 = $10.000.
         (Suman al monto inicial — vinculados o solo display).
       Observaciones (textarea)
     Footer: btn-secondary "Cancelar" / btn-primary "Abrir turno".
       Click abrir → toast + cambia tab a Cierre.

4) Panel CIERRE:
   Header con info del turno:
     "Turno #047 · Iniciado 09:00 por Juan Camilo · 6h 32min"
     Botón "Detener turno (cerrar)" destructive.

   Grid 3 KPIs:
     Apertura: $200.000 (helper "monto inicial").
     Ventas: $1.245.000 (helper "47 transacciones").
     Esperado en caja: $1.445.000 (apertura + ventas efectivo).

   Layout 2 cols:
     IZQ — Movimientos del turno (tabla):
       Columnas: Hora / Tipo / Documento / Monto / Método / Usuario.
       Tipos: Venta / Ingreso / Egreso / Devolución.
       Métodos: Efectivo / Tarjeta / Transferencia.
       12 filas mock.

     DER — Arqueo de cierre (card):
       Header "Arqueo".
       Form:
         "Conteo en caja" — input grande con prefijo $.
         JS: al tipear, calcula diferencia automática:
           expected = $1.445.000 (mock).
           diff = real - expected.
           Mostrar abajo:
             diff > 0 → texto verde "Sobrante: $XX.XXX"
             diff < 0 → texto rojo "Faltante: $XX.XXX"
             diff == 0 → texto verde "Cuadrado ✓"
       Sección desglose:
         "Efectivo en caja: $1.420.000 (input)
          Tarjetas: $1.180.000 (auto)
          Transferencias: $310.000 (auto)
          Total: $2.910.000"
       Observaciones (textarea).
       Footer:
         btn-secondary "Imprimir Z" + btn-primary "Cerrar turno".
         Click cerrar → modal confirmación "¿Cerrar turno con diferencia de -$2.000?" → toast.

5) Panel HISTÓRICO:
   Toolbar: filtros fecha, usuario, sede.
   Tabla:
     Columnas: # Turno / Fecha / Cajero / Apertura / Ventas / Diferencia / Estado / Acciones.
     8 filas de turnos pasados.
     Estado: badge-success "Cuadrado" / badge-warning "Diferencia" / badge-muted "Cerrado".
     Diferencia: en verde si 0, rojo si negativa, sutil.
     Acciones: "Ver detalle" → modal con info del turno (mock).

JS:
  UI.tabs.
  En arqueo: input listener recalcula diferencia.

RESPONSIVE:
  Tabs scroll-x.
  En cierre: layout 2 cols → 1 col en < 1024.
  Tabla histórico → cards en < 768.
```

### Hecho cuando

- 3 tabs funcionando.
- Panel apertura: form completo, abrir cambia tab.
- Panel cierre: tabla movimientos + arqueo con cálculo automático de diferencia.
- Panel histórico: tabla con badges.

---

## Sección 5.4 — Hub de reportes B18

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b18-reportes.jsx.

Crear backoffice/reportes.html partiendo de _layout.html.
Sidebar activo: reportes.
Breadcrumb: ["Inicio", "Reportes"].

ESTRUCTURA:

1) BOPageHeader: "Reportes" + subtítulo "Generá informes de tu operación".
   Actions: btn-ghost "Reportes guardados", btn-ghost "Mis suscripciones".

2) Search bar prominente:
   Input grande con ícono search "Buscar reporte..." (ancho ~520, centrado).

3) Filtros chips horizontales:
   "Todos" (activo) / "Ventas" / "Financiero" / "Inventario" / "Operación" / "Clientes".
   Click filtra cards visibles (data-category).

4) Secciones de cards agrupadas (mostrar todas en vista "Todos"):

   Sección "Ventas":
     Cards (replicar del JSX, ej):
       - Ventas por hora del día — descripción 1 línea — ícono bar-chart
       - Ventas por producto — ícono package
       - Ventas por mesero — ícono users
       - Top productos — ícono trending-up
       - Comparativa diaria/semanal/mensual — ícono calendar
       - Tickets anulados — ícono x-circle

   Sección "Financiero":
       - Estado de resultados (P&L) — ícono dollar-sign
       - Flujo de caja — ícono activity
       - Cuentas por cobrar — ícono receipt
       - Cuentas por pagar — ícono credit-card
       - Impuestos — ícono percent
       - Margen por producto — ícono trending-up

   Sección "Inventario":
       - Movimientos de inventario — ícono boxes
       - Bajo mínimo — ícono alert-triangle
       - Valoración stock — ícono dollar-sign
       - Rotación — ícono refresh-cw
       - Mermas — ícono trending-down

   Sección "Operación":
       - Tiempos de servicio — ícono clock
       - Ocupación de mesas — ícono layout-grid
       - Productividad meseros — ícono user-check
       - Cierre Z/X de caja — ícono archive

   Sección "Clientes":
       - Ranking de clientes — ícono award
       - Frecuencia de compra — ícono repeat
       - Análisis RFM — ícono pie-chart
       - Cumpleaños del mes — ícono cake (si existe el ícono)

   CSS .reporte-card:
     padding 18, border-radius lg, border, bg, cursor pointer, transición.
     Display flex flex-col gap 10.
     Hover: translateY(-2px), shadow.
     Header: ícono 36x36 en círculo bg accent suave.
     Title (font-weight 600).
     Description (font-size 12, color muted, line-clamp 2).
     Footer: btn-ghost "Generar →" o link sutil.

   Click "Generar" → modal con opciones (rango fechas, formato PDF/Excel/CSV) + botón "Descargar".
     Botón descargar → toast "Reporte generado · Descargando...".

5) Sección lateral (opcional):
   "Reportes recientes" — lista de últimos 5 reportes generados con fecha.

JS:
  Filtros chips: agregar/quitar .is-active, mostrar/ocultar cards por data-category.

RESPONSIVE:
  Grid auto-fit minmax(280px, 1fr).
  Filtros: scroll-x en mobile.
```

### Hecho cuando

- ~25 cards de reportes agrupados por categoría.
- Filtros chips funcionan (filtra cards).
- Click "Generar" abre modal con opciones.

---

## Sección 5.5 — Integraciones B22

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b22-integraciones.jsx.

Crear backoffice/integraciones.html partiendo de _layout.html.
Sidebar activo: config (es subsección).
Breadcrumb: ["Inicio", "Configuración", "Integraciones"].

ESTRUCTURA:

1) BOPageHeader: "Integraciones" + subtítulo "Conectá tu negocio con servicios externos".

2) Tabs de config (con "Integraciones" activa).

3) Filtro por categoría chips:
   Todas / Pagos / Delivery / Marketing / Contabilidad / Otros

4) Grid de cards de integraciones:
   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)), gap 16.

   Cards (replicar del JSX, mínimo estos):

   PAGOS:
     - Mercado Pago (logo placeholder amarillo) — Pagos online — Conectado (verde) — botón "Configurar"
     - Wompi (placeholder) — Conectado — "Configurar"
     - ePayco — Disponible — "Conectar"
     - PSE — Conectado — "Configurar"
     - Nequi — Disponible — "Conectar"
     - Daviplata — Disponible — "Conectar"

   DELIVERY:
     - Rappi — Conectado — "Configurar"
     - iFood — Disponible — "Conectar"
     - Didi Food — Disponible — "Conectar"
     - Domicilios.com — Disponible — "Conectar"

   MARKETING:
     - Google Maps — Conectado — "Configurar"
     - Meta Pixel — Conectado — "Configurar"
     - Mailchimp — Disponible — "Conectar"
     - WhatsApp Business — Conectado — "Configurar"

   CONTABILIDAD:
     - Siigo — Disponible — "Conectar"
     - Alegra — Disponible — "Conectar"
     - World Office — Disponible — "Conectar"

   OTROS:
     - Google Calendar — Disponible — "Conectar"
     - Slack — Disponible — "Conectar"
     - Zapier — Disponible — "Conectar"

   Card:
     padding 18, border, border-radius lg, bg.
     Header: logo 48x48 (svg placeholder con color de marca) + nombre + categoría chip.
     Body: descripción 1 línea en muted.
     Footer:
       Estado: badge-success "Conectado" / badge-muted "Disponible".
       Botón "Configurar" (ghost si conectado, primary si disponible "Conectar").
     Si conectado, en una esquina ícono check-circle verde pequeño.

5) Click en "Configurar" o "Conectar" → DRAWER con campos:
   Header: nombre + logo del provider.
   Body:
     Si pagos: API Key (input con toggle visibility), Secret Key, Webhook URL (read-only con copy),
              Modo (radio: Sandbox / Producción), Switch "Habilitado".
     Si delivery: Token de integración, Modo, Comisión configurada.
     Si marketing: API Key específica, eventos a trackear.
   Footer: Cancelar / Guardar / (si conectado) Desconectar.

JS:
  Click en card → UI.openDrawer('drawerIntegracion') con datos según provider clickeado.
  (Mock: usar un objeto integraciones con ids).

RESPONSIVE:
  Grid auto-fit ya responsive.
  Drawer full-width mobile.
```

### Hecho cuando

- Grid con ~20 integraciones.
- Filtros de categoría funcionan.
- Click abre drawer con form específico (mock).

---

## Checklist final del Sprint 5

- [ ] gastos.html: 3 KPIs, tabla con badges de estado, modal nuevo gasto.
- [ ] dian.html: banner conectado, KPIs (con pulse en "En cola"), tabla con CUFE, retry simulado.
- [ ] caja.html: 3 tabs, panel cierre con arqueo automático, histórico.
- [ ] reportes.html: ~25 cards agrupadas, filtros chips, modal generar.
- [ ] integraciones.html: ~20 cards, filtros, drawer config.
- [ ] Tema dark perfecto en las 5.
- [ ] Mobile: las 5 se adaptan bien.

Commit: `feat: sprint 5 backoffice finanzas completo`.

**Backoffice 100% terminado.** Pasamos al Sprint 6 (POS Web).
