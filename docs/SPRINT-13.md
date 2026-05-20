# Sprint 10 — Nómina y Adelantos

> Extensión de ROOT: pantallas de **nómina y adelantos** en App Mesero (vista empleado) y Backoffice (vista admin), con historial de pagos por sucursal.
> Stack: HTML + CSS + JS vanilla, sin build, sin frameworks. Mismos tokens, mismas shells, dark/light, mobile-first 360 → 1920px.

---

## 0. Decisiones de producto (congeladas)

| # | Decisión | Valor |
|---|---|---|
| D1 | Periodicidad de pago | **Ambas** — quincenal o mensual. Admin asigna por empleado; mesero solo la ve. |
| D2 | Tope de adelanto | **Configurable por admin** por empleado/sucursal (% del devengado del periodo en curso). Default sugerido: 50%. |
| D3 | Flujo de estados | `borrador → pendiente → aprobada → pagada → descontada` + rama `rechazada` desde `pendiente`. |
| D4 | Comprobante PDF (mock) | Sí — botón "Descargar comprobante" en cada adelanto pagado. Genera PDF con jsPDF vía CDN (o HTML imprimible si jsPDF da problemas). |
| D5 | Historial por empleado | Sí — vista dedicada en Backoffice con todos los pagos hechos a un mesero específico (no solo adelantos: nómina completa). |
| D6 | Referencia legal | Salario mínimo Colombia 2026 = `$1.623.500` COP (constante en `assets/js/constants.js`). Tope inferior de cualquier salario configurado. |
| D7 | Cálculo de devengado | `(salario_base / días_periodo) × días_trabajados_a_la_fecha`. Mock — se simula con `Date.now()` vs fecha de inicio de periodo. |
| D8 | Multi-sucursal | Todo registro de nómina/adelanto lleva `sucursal_id`. Admin puede filtrar por sucursal o ver consolidado. |

---

## 1. Pantallas nuevas

### 1.1 App Mesero — `/mesero/` (vista empleado)

| ID | Archivo | Pantalla | Descripción |
|---|---|---|---|
| **E10** | `mesero/nomina.html` | Mi nómina | Card grande con "Próximo pago en X días", salario base, devengado a la fecha, periodicidad asignada, botón "Solicitar adelanto" y botón "Ver historial". |
| **E11** | `mesero/adelanto-solicitar.html` | Solicitar adelanto | Form: monto (con slider hasta el tope configurado por admin), motivo (opcional, textarea), preview "Te quedará X disponible este periodo". CTA "Enviar solicitud" → estado `pendiente`. |
| **E12** | `mesero/adelantos-historial.html` | Mis adelantos | Lista de solicitudes propias con badge de estado. Tap → bottom-sheet con detalle + botón "Descargar comprobante" si `pagada` o `descontada`. |
| **E13** | `mesero/pagos-historial.html` | Historial de pagos | Lista cronológica de TODOS los pagos recibidos (nómina + adelantos), agrupada por mes. Tap → detalle. |

**Bottom-tab del mesero:** agregar ítem **"Nómina"** (ícono `lucide:wallet`) entre "Comandas" y "Perfil". O dejarla colgando de "Perfil" si ya está lleno el tab — confirmar al implementar viendo `mesero/perfil.html`.

### 1.2 Backoffice — `/backoffice/` (vista admin)

Nuevo grupo de sidebar: **Nómina** (entre **Gestión** y **Finanzas**), con 4 ítems.

| ID | Archivo | Pantalla | Descripción |
|---|---|---|---|
| **B23** | `backoffice/nomina.html` | Nómina (dashboard) | KPIs: total a pagar este periodo, adelantos pendientes (badge), próximo corte. Tabla de empleados con: nombre, sucursal, salario base, periodicidad, devengado actual, adelantos del periodo, neto a pagar. Filtro por sucursal + búsqueda. |
| **B24** | `backoffice/nomina-empleado.html` | Detalle empleado | Drawer o página completa con tabs: **Datos** (salario base, periodicidad, % tope de adelanto editable), **Adelantos** (historial), **Pagos** (historial completo de nómina). |
| **B25** | `backoffice/adelantos.html` | Adelantos | Bandeja de solicitudes con tabs por estado: **Pendientes** (badge con contador), **Aprobadas**, **Pagadas**, **Rechazadas**, **Todas**. Cada fila: empleado, sucursal, monto, % del devengado, fecha. Acciones inline: **Aprobar** / **Rechazar** (con modal de confirmación + campo nota). |
| **B26** | `backoffice/adelanto-detalle.html` | Detalle adelanto | Drawer con: empleado, sucursal, monto solicitado, motivo, devengado al momento, historial de transiciones de estado, botones según estado actual. |

**Modales/drawers asociados:**
- Modal "Aprobar adelanto" (en B25) — confirmación + monto a entregar (editable, ≤ solicitado) + nota.
- Modal "Rechazar adelanto" (en B25) — campo obligatorio "Motivo del rechazo".
- Drawer "Configurar empleado" (en B24) — editar salario base, periodicidad, % tope de adelanto.
- Modal "Registrar pago" (en B23) — para marcar nómina como pagada manualmente.

---

## 2. Estructura de datos mock

Crear `assets/js/data/nomina-mock.js` con:

```js
// Constantes
export const SMMLV_2026 = 1_623_500;
export const PERIODICIDADES = { QUINCENAL: 'quincenal', MENSUAL: 'mensual' };
export const ESTADOS_ADELANTO = {
  BORRADOR: 'borrador',
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  PAGADA: 'pagada',
  DESCONTADA: 'descontada',
};

// Empleados (mock — 8 meseros entre 2 sucursales)
export const empleados = [
  {
    id: 'emp-001',
    nombre: 'Camila Rojas',
    rol: 'mesero',
    sucursal_id: 'suc-norte',
    salario_base: 1_623_500,
    periodicidad: 'quincenal',
    tope_adelanto_pct: 50,
    fecha_ingreso: '2024-03-15',
  },
  // ... 7 más
];

// Periodos de nómina
export const periodos = [
  {
    id: 'per-2026-05-q2',
    empleado_id: 'emp-001',
    inicio: '2026-05-01',
    fin: '2026-05-15',
    estado: 'en_curso', // en_curso | cerrado | pagado
    devengado: 811_750, // calculado
  },
];

// Solicitudes de adelanto
export const adelantos = [
  {
    id: 'adv-001',
    empleado_id: 'emp-001',
    periodo_id: 'per-2026-05-q2',
    sucursal_id: 'suc-norte',
    monto_solicitado: 300_000,
    monto_aprobado: null,
    motivo: 'Imprevisto médico',
    estado: 'pendiente',
    fecha_solicitud: '2026-05-12T14:30:00Z',
    transiciones: [
      { de: null, a: 'borrador', fecha: '...', actor: 'emp-001' },
      { de: 'borrador', a: 'pendiente', fecha: '...', actor: 'emp-001' },
    ],
    nota_admin: null,
  },
];

// Historial de pagos (nómina ya pagada)
export const pagos = [
  {
    id: 'pay-001',
    empleado_id: 'emp-001',
    sucursal_id: 'suc-norte',
    periodo_id: 'per-2026-04-q2',
    bruto: 1_623_500,
    adelantos_descontados: 200_000,
    neto: 1_423_500,
    fecha_pago: '2026-04-30',
    metodo: 'transferencia',
  },
];

// Helpers
export function calcularDevengado(empleado, periodo) { /* ... */ }
export function montoMaximoAdelanto(empleado, periodo, adelantosPrevios) { /* ... */ }
export function diasHastaProximoPago(empleado) { /* ... */ }
```

Persistencia: `localStorage` con key `root:nomina:v1` para que las acciones del admin (aprobar, rechazar) se reflejen al volver a la app mesero en la misma sesión del navegador.

---

## 3. Tickets ordenados por dependencia

> Cada ticket es ejecutable en aislado por Claude Code. El orden respeta dependencias.

### Fase 1 — Cimientos (sin UI todavía)

**T1 · Datos mock + helpers**
- Crear `assets/js/data/nomina-mock.js` con la estructura del punto 2.
- Sembrar 8 empleados, 2 sucursales, ~15 adelantos en distintos estados, ~20 pagos históricos.
- Implementar `calcularDevengado`, `montoMaximoAdelanto`, `diasHastaProximoPago`, `transicionarAdelanto`.
- Setup de `localStorage` con `loadState()` / `saveState()` que rehidrate al cargar.
- **Aceptación:** consola del navegador puede importar el módulo y `calcularDevengado(empleados[0], periodos[0])` retorna número válido.

**T2 · Constantes y formateadores COP**
- Agregar `assets/js/constants.js` (si no existe) con `SMMLV_2026`.
- Helper `formatCOP(num)` que devuelva `$1.623.500` (separador miles `.`, símbolo al inicio, sin decimales).
- **Aceptación:** `formatCOP(1623500) === '$1.623.500'`.

### Fase 2 — App Mesero (vista empleado)

**T3 · E10 Mi nómina** (`mesero/nomina.html`)
- Hero card con próximo pago (días + fecha), salario base, devengado a la fecha, periodicidad.
- Progress bar visual del periodo (qué % llevado).
- Botones grandes táctiles: "Solicitar adelanto" (primario) y "Ver historial" (secundario).
- Agregar entry en bottom-tab.
- **Aceptación:** se ve bien en frame iPhone, dark/light OK, datos vienen del mock.

**T4 · E11 Solicitar adelanto** (`mesero/adelanto-solicitar.html`)
- Slider de monto con tope dinámico = `montoMaximoAdelanto(...)`.
- Display "Disponible: $X" actualizado en vivo.
- Textarea motivo (opcional, max 200 char).
- Validaciones: monto > 0, monto ≤ tope, no permitir si ya hay solicitud `pendiente` del mismo periodo.
- CTA "Enviar solicitud" → crea adelanto con estado `pendiente` + guarda en localStorage + redirige a E12 con toast "Solicitud enviada".
- **Aceptación:** flujo completo funciona, recargar página mantiene la solicitud.

**T5 · E12 Mis adelantos** (`mesero/adelantos-historial.html`)
- Lista cronológica descendente.
- Cada item: monto, fecha, badge de estado (colores por estado, usar tokens semánticos).
- Tap → bottom-sheet con detalle + transiciones (timeline) + botón "Descargar comprobante" si aplica.
- **Aceptación:** estados se ven con color consistente, bottom-sheet funciona.

**T6 · E13 Historial de pagos** (`mesero/pagos-historial.html`)
- Agrupación por mes con header sticky.
- Cada item de pago: fecha, bruto, descuentos, neto destacado.
- Tap → bottom-sheet con desglose completo.
- **Aceptación:** scroll suave, agrupación correcta.

### Fase 3 — Backoffice (vista admin)

**T7 · Sidebar group "Nómina"**
- Agregar grupo nuevo entre "Gestión" y "Finanzas" en el shell del Backoffice.
- 4 ítems: Nómina (B23), Adelantos (B25), Empleados (B24 — entry point), Reportes nómina *(stub, no en este sprint)*.
- Badge numérico en "Adelantos" mostrando pendientes.
- **Aceptación:** sidebar se ve consistente, navegación funciona.

**T8 · B23 Nómina dashboard** (`backoffice/nomina.html`)
- 4 KPIs arriba: total a pagar este periodo, adelantos pendientes, empleados activos, próximo corte.
- Filtro sucursal (dropdown) + búsqueda por nombre.
- Tabla con columnas del punto 1.2.
- Fila clickeable → navega a B24.
- **Aceptación:** filtro funciona, KPIs se recalculan al cambiar sucursal.

**T9 · B24 Detalle empleado** (`backoffice/nomina-empleado.html`)
- Header con foto avatar (placeholder), nombre, sucursal, rol.
- Tabs: Datos / Adelantos / Pagos.
- Tab Datos: form editable (salario base con validación ≥ SMMLV_2026, periodicidad select, % tope adelanto slider 0-100).
- Tab Adelantos: tabla con todos los adelantos del empleado.
- Tab Pagos: tabla con todo el historial de pagos al empleado.
- **Aceptación:** guardar cambios persiste, tabs preservan estado al cambiar.

**T10 · B25 Bandeja de adelantos** (`backoffice/adelantos.html`)
- Tabs por estado con contadores.
- Tabla con acciones inline Aprobar/Rechazar para `pendiente`.
- Modal aprobar: confirma monto (editable, ≤ solicitado), nota opcional, botón "Aprobar y notificar".
- Modal rechazar: motivo obligatorio.
- Al aprobar/rechazar: transiciona estado, persiste, actualiza badges.
- **Aceptación:** flujo completo aprobar y rechazar funciona, contadores se actualizan.

**T11 · B26 Detalle adelanto** (`backoffice/adelanto-detalle.html`)
- Drawer lateral que abre desde B25.
- Timeline de transiciones con fecha y actor.
- Datos del empleado + contexto del periodo (devengado al momento de solicitud).
- Botón "Marcar como pagada" si estado = `aprobada` → transiciona a `pagada` + genera registro en `pagos`.
- Botón "Marcar como descontada" si estado = `pagada` → cierra el ciclo cuando el próximo pago de nómina ya incluyó el descuento.
- **Aceptación:** todas las transiciones del flujo funcionan.

### Fase 4 — Comprobante PDF + pulido

**T12 · Comprobante PDF mock**
- Cargar `jspdf` por CDN (`https://cdnjs.cloudflare.com/ajax/libs/jspdf/...`).
- Función `generarComprobante(adelantoId)` que produzca un PDF con: logo ROOT, datos del negocio mock ("El Buen Sabor"), datos del empleado, monto, fecha, firma admin (mock), número de comprobante.
- Disponible desde: bottom-sheet de E12 y desde B26.
- **Aceptación:** PDF descarga con nombre `comprobante-adv-001.pdf`, abre legible.

**T13 · QA pass + dark/light + responsive**
- Recorrer las 4 pantallas mesero en frame iPhone (360px).
- Recorrer las 4 pantallas backoffice en desktop (1280px) y tablet (768px).
- Toggle dark/light en cada una.
- Verificar accesibilidad: foco visible, tab order, ARIA en modales.
- **Aceptación:** sin overflow horizontal, contrastes OK, modales atrapan foco.

---

## 4. Criterios de aceptación globales del sprint

- [ ] Mesero puede solicitar un adelanto respetando el tope configurado.
- [ ] Admin puede aprobar o rechazar y el mesero ve el cambio al refrescar.
- [ ] Salario base nunca puede guardarse por debajo de SMMLV 2026.
- [ ] Todos los registros llevan `sucursal_id` y el dashboard se puede filtrar por sucursal.
- [ ] Historial de pagos del empleado es accesible desde mesero (propio) y desde admin (de cualquier empleado).
- [ ] Comprobante PDF descarga para adelantos `pagada` y `descontada`.
- [ ] Estado persiste en localStorage entre recargas.
- [ ] Dark/light y mobile-first respetados.

---

## 5. Fuera de alcance (NO hacer en este sprint)

- Backend real / API.
- Cálculo de prestaciones sociales, parafiscales, retenciones (solo bruto y descuento por adelantos).
- Integración con PSE / pasarelas para pagar adelantos de verdad.
- Firma electrónica del comprobante.
- Notificaciones push o email reales (solo toast in-app al aprobar/rechazar).
- Reportes exportables a Excel (queda para sprint siguiente).
- Roles más allá de `mesero` y `admin` (cocinero, cajero, etc. — usan la misma estructura, se extiende después).

---

## 6. Prompt sugerido para Claude Code

> Copia esto y pégaselo a Claude Code apuntando a la raíz de `front-demo`:

```
Implementa el Sprint 10 — Nómina y Adelantos siguiendo SPRINT-NOMINA-ADELANTOS.md
al pie de la letra.

Reglas:
- Stack vanilla, mismo que el resto del repo (HTML + CSS + JS, sin build).
- Reutiliza tokens, shells y componentes existentes. NO crees un sistema nuevo.
- Mismo patrón de archivos: una pantalla = un .html con su <script> al final
  o módulo en assets/js/screens/ según convención del repo.
- Persistencia con localStorage bajo la key root:nomina:v1.
- Ejecuta los tickets T1 → T13 EN ORDEN. Después de cada ticket, marca su
  checkbox de aceptación y haz commit con mensaje convencional
  (feat(nomina): ... / feat(mesero): ... / feat(backoffice): ...).
- Antes de empezar T3, lee mesero/perfil.html y mesero/comandas.html para
  copiar exactamente el patrón de shell y bottom-tab.
- Antes de empezar T8, lee backoffice/dashboard.html y backoffice/usuarios.html
  para copiar el patrón de página y de tabla con filtros.
- Si encuentras una decisión no documentada en el spec, PARA y pregunta antes
  de inventar.

Empieza por T1.
```
