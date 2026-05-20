# Sprints de cierre de pantallas — ROOT

> Auditoría de **transiciones, estados y outputs** sobre las pantallas que ya existen en la demo.
> No incluye módulos nuevos ni features de negocio adicionales — solo cerrar los loops visuales de lo que ya está construido.
>
> **Fuente:** `CONTEXTO-APP.md` (46 pantallas + ~15 overlays, Sprints 1–14)
> **Fecha:** 2026-05-18
> **Total de gaps:** 120 *(122 originales − 2 invalidados por auditoría 2026-05-18: ver [Notas de auditoría](#auditoria))*

---

<a id="auditoria"></a>
## Notas de auditoría (2026-05-18)

Antes de ejecutar el plan se contrastaron las 46 pantallas contra el repo:

1. **B.16 Proveedores → invalidado.** `backoffice/proveedores.html` ya existe (639 líneas) con drawer de detalle (tabs Info / Compras / Productos / Documentos) y modal "Nuevo proveedor". Se reemplaza el gap por un pulido menor en S18.
2. **B.29 Contabilidad → invalidado.** `backoffice/contabilidad.html` ya existe (830 líneas) con tabs Resumen / Plan de cuentas / Libros auxiliares / Centro de costos. Se reemplaza el gap por un pulido menor en S20.
3. **C4 Cobro POS no es archivo, es modal.** El cobro del POS Web vive como `#modalCobro` dentro de `pos/pedido.html` (línea 258). Las tareas de S15 sobre C4 (división, mixto, impresión, post-cobro) se construyen como bottom-sheets / pasos dentro de ese modal, **no** crean un `pos/cobro.html` nuevo.
4. **Sin librerías JS externas.** `CLAUDE.md` prohíbe libs externas (solo `lucide`). Donde el plan original decía "PDF generador (jsPDF)", se cambia por **HTML imprimible + `window.print()`** apoyándose en el patrón ya existente en `assets/js/comprobante.js`.

---

## Tabla de contenidos

- [Resumen ejecutivo](#resumen)
- [Inventario de gaps por flujo](#gaps)
  - [Auth (A1–A5)](#auth)
  - [Backoffice — Operación](#bo-operacion)
  - [Backoffice — Gestión](#bo-gestion)
  - [Backoffice — Nómina](#bo-nomina)
  - [Backoffice — Finanzas y Config](#bo-config)
  - [POS Web](#pos)
  - [App Mesero](#mesero)
  - [KDS](#kds)
  - [Storefront](#storefront)
  - [Transversales](#transversales)
- [Plan de sprints](#sprints)
  - [S15 — Caja & POS](#s15)
  - [S16 — App Mesero](#s16)
  - [S17 — Auth & Onboarding](#s17)
  - [S18 — Backoffice Gestión](#s18)
  - [S19 — Backoffice Nómina](#s19)
  - [S20 — Backoffice Config](#s20)
  - [S21 — KDS](#s21)
  - [S22 — Storefront](#s22)
  - [S23 — Transversales](#s23)
- [Camino crítico recomendado](#critico)

---

<a id="resumen"></a>
## Resumen ejecutivo

**Tipo de análisis:** auditoría de cierre visual. Para cada pantalla del inventario, se respondieron preguntas como:

- ¿A dónde te lleva esta acción después de confirmarla?
- ¿Qué se muestra cuando no hay datos (estado vacío)?
- ¿Qué se ve cuando algo falla (estado de error / validación)?
- ¿La pantalla genera un output (PDF, toast, redirección)?
- ¿Las acciones cross-app (BO → KDS → Mesero) se reflejan visualmente?

**Distribución por tipo de gap:**

| Tipo | Cantidad |
|---|---|
| Transición / navegación entre pantallas existentes | 38 |
| Estado post-acción (toast, redirige, se queda) | 22 |
| Estados de error / validación | 18 |
| UI no definida dentro de pantalla existente | 15 |
| Estados vacíos | 12 |
| Acciones faltantes en pantallas existentes | 9 |
| Comunicación cross-app | 8 |
| **Total** | **122** |

**Duración total estimada:** ~6 semanas (9 sprints, de 2 días a 1 semana cada uno).
**Camino crítico:** S15 + S16 + S19 (~2.5 semanas) cubren los flujos más usados a diario.

---

<a id="gaps"></a>
## Inventario de gaps por flujo

<a id="auth"></a>
### 🟦 Auth (A1–A5)

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| A.1 | A1 Login | Al login exitoso, ¿va directo a B1 Dashboard o pasa siempre por A5 Selector sucursal? Regla no clara. | Transición |
| A.2 | A1 Login | Estado de error "credenciales inválidas" — ¿toast, mensaje inline, shake del input? | Estado de error |
| A.3 | A2 Registro | Al terminar el step 3, ¿a dónde lleva? ¿auto-login → A5 → B1? ¿pantalla de bienvenida? | Transición |
| A.4 | A3 Recuperar | Tras enviar el link, ¿confirma en la misma pantalla o redirige? Falta pantalla "Revisa tu correo". | Pantalla intermedia |
| A.5 | A4 Restablecer | Al guardar nueva contraseña, ¿auto-login o vuelve a A1? | Transición |
| A.6 | A5 Selector sucursal | Si el usuario solo tiene 1 sucursal, ¿se salta o aparece igual? | Lógica condicional |
| A.7 | Todas | Logout — ¿desde dónde? El switcher de rol está en el avatar dropdown pero "Cerrar sesión" no se menciona. | Acción faltante |

---

<a id="bo-operacion"></a>
### 🟫 Backoffice — Operación

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| B.1 | B1 Dashboard | Los KPIs (ventas, ticket promedio), ¿son clickeables? ¿llevan a B18 Reportes filtrado? | Navegación |
| B.2 | B1 Dashboard | "Buenos días, [nombre]" — ¿cambia según hora del día? | Lógica de copy |
| B.3 | B20 Caja | Click en turno cerrado/abierto, ¿abre detalle? ¿drawer? ¿navega a C5? | Navegación |
| B.4 | B20 Caja | "Arqueo" — ¿es un botón? ¿pestaña? ¿el mismo modal de cerrar turno de C2? Relación con POS no clara. | Conexión entre módulos |

---

<a id="bo-gestion"></a>
### 🟫 Backoffice — Gestión

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| B.5 | B8 Catálogo | "CTA crear producto" — ¿abre B9 en modo nuevo o drawer inline? | Transición |
| B.6 | B9 Producto | Al guardar producto nuevo, ¿toast + vuelve a B8? ¿se queda en B9 en modo edición? | Transición |
| B.7 | B9 Producto | Modificadores — no claro si abren sub-drawer o son inline. | UI ambigua |
| B.8 | B10 Categorías | Modal "Nueva categoría" al guardar, ¿la categoría aparece en la lista al instante? | Estado post-acción |
| B.9 | B10 Categorías | Eliminar categoría con productos asociados — ¿qué pasa? ¿modal de advertencia? | Edge case |
| B.10 | B11 Inventario | "Alertas de bajo stock" — ¿dónde se ven? ¿badge en sidebar, banner, columna roja? | UI no definida |
| B.11 | B11 Inventario | Click en un ingrediente, ¿abre detalle? ¿edita inline? ¿drawer? | Interacción faltante |
| B.12 | B12 Conteo | Modal "Confirmar conteo" con diferencias — ¿genera reporte? ¿toast? ¿redirige? | Output + transición |
| B.13 | B12 Conteo | ¿Qué pasa si cierro el navegador a mitad de conteo? ¿hay borrador? | Estado intermedio |
| B.14 | B13 Fichas | Drawer "Agregar ingrediente" al guardar, ¿se queda abierto para añadir otro o cierra? | UX flow |
| B.15 | B14 Clientes | Tab "pedidos" del drawer detalle — los pedidos, ¿son clickeables? ¿llevan a detalle? | Navegación |
| ~~B.16~~ | ~~Proveedores~~ | ~~No tiene mockup dedicado pero está en sidebar — falta definir layout.~~ **Invalidado 2026-05-18:** `proveedores.html` ya existe con drawer + modal. Ver pulido en S18. | — |
| B.17 | B16 Gastos | Modal "Nuevo gasto" — ¿se asocia a proveedor existente o se puede crear desde ahí? | Conexión entre pantallas |

---

<a id="bo-nomina"></a>
### 🟫 Backoffice — Nómina

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| B.18 | B23 Nómina | Modal "Registrar pago" al confirmar, ¿genera PDF de nómina cerrada? ¿toast? ¿redirige? | Output + transición |
| B.19 | B23 Nómina | Click en fila de empleado, ¿lleva a B24? Implícito pero no explícito. | Navegación |
| B.20 | B23 Nómina | Si hay adelantos pendientes en el periodo, ¿se puede cerrar nómina igual? ¿modal de advertencia? | Validación faltante |
| B.21 | B24 Detalle empleado | Tab "Adelantos" — los items, ¿son clickeables? ¿llevan a B26? | Navegación |
| B.22 | B24 Detalle empleado | Editar salario base con validación ≥ SMMLV — ¿qué muestra si está por debajo? ¿mensaje inline? ¿botón deshabilitado? | Estado de validación |
| B.23 | B25 Adelantos | Modal "Aprobar" al confirmar, ¿toast + sigue en B25? ¿navega a B26 del adelanto aprobado? | Transición |
| B.24 | B25 Adelantos | Modal "Rechazar" — ¿queda visible en tab "Rechazadas"? ¿se notifica al mesero (E10–E12)? | Comunicación cross-app |
| B.25 | B26 Detalle adelanto | "Descargar comprobante" PDF — ¿qué pasa después? ¿toast? ¿se queda? | Estado post-acción |
| B.26 | B26 Detalle adelanto | Timeline de transiciones — ¿cada nodo es clickeable? ¿muestra quién/cuándo en hover? | Interacción faltante |

---

<a id="bo-config"></a>
### 🟫 Backoffice — Finanzas y Config

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| B.27 | B17 Facturación DIAN | Estado "Homologado" — si hay error con MATIAS, ¿qué se muestra? Solo está el estado feliz. | Estado de error |
| B.28 | B18 Reportes | Modal "Generar reporte" al confirmar, ¿descarga PDF/Excel? ¿abre vista previa? ¿manda por email? | Output |
| ~~B.29~~ | ~~Contabilidad~~ | ~~"Sin JSX dedicado" — gap conocido, falta layout completo.~~ **Invalidado 2026-05-18:** `contabilidad.html` ya existe con tabs Resumen / Plan de cuentas / Libros / Centro de costos. Ver pulido en S20. | — |
| B.30 | B5 Configuración general | "Guardar cambios" y "Descartar" — ¿dónde están? ¿sticky abajo? ¿topbar? | UI ambigua |
| B.31 | B5 Configuración general | Si tocas algo y navegas sin guardar, ¿modal "tienes cambios sin guardar"? | Validación faltante |
| B.32 | B6 Sucursales | Eliminar una sucursal con datos (mesas, ventas, empleados asignados) — ¿qué pasa? | Edge case |
| B.33 | B7 Mesas | Al crear/editar mesa, ¿drawer? ¿modal? ¿inline? | UI no definida |
| B.34 | B7 Mesas | Si cambio la sala de la mesa 5 aquí, ¿se refleja en E3/C2 inmediatamente o requiere recarga? | Sincronización |
| B.35 | B2 Usuarios | Drawer crear/editar — al guardar, ¿la lista se actualiza en vivo? ¿toast? | Estado post-acción |
| B.36 | B2 Usuarios | El usuario creado, ¿recibe email/link de invitación o credencial manual? Sin feedback. | Output faltante |
| B.37 | B4 Roles | Click en celda cicla 3 estados — ¿se guarda automático o requiere botón "Guardar"? | Persistencia ambigua |
| B.38 | B4 Roles | Drawer "Nuevo rol personalizado" — al crear, ¿queda como columna nueva inmediatamente? | Estado post-acción |
| B.39 | B22 Integraciones | Drawer "Configurar" al guardar credenciales, ¿valida la conexión? ¿solo guarda? | Acción ambigua |
| B.40 | B22 Integraciones | "Desconectar" — ¿pide confirmación? ¿qué pasa con datos en curso? | Confirmación faltante |

---

<a id="pos"></a>
### 🟪 POS Web

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| P.1 | C1 Apertura | Al confirmar apertura, ¿navega directo a C2 Mapa? ¿muestra resumen primero? | Transición |
| P.2 | C1 Apertura | Si ya hay turno abierto y entras a C1, ¿qué pasa? ¿redirige? ¿advierte? | Estado condicional |
| P.3 | C2 Mapa POS | Modal "Cerrar turno" — al confirmar, ¿resumen? ¿PDF Z-report? ¿redirige a C1 o A1? | Output + transición |
| P.4 | C2 Mapa POS | Toggle Mapa/Lista — ¿la lista qué muestra exactamente? | Vista alterna sin detalle |
| P.5 | C3 Pedido | Modal "Modificadores" — al confirmar, ¿el ítem se agrega al instante a la cuenta visible? | Estado post-acción |
| P.6 | C4 Cobro | "División de cuenta" mencionada — ¿modal? ¿pantalla? ¿bottom-sheet? | UI no definida |
| P.7 | C4 Cobro | "Impresión" — ¿botón antes o después de confirmar pago? ¿modal de selección de impresora? | UI no definida |
| P.8 | C4 Cobro | Al completar cobro, ¿navega a C5 con ticket destacado? ¿vuelve a C2 con mesa liberada? | Transición |
| P.9 | C4 Cobro | Cobro mixto — si paga parte efectivo / parte tarjeta, ¿cómo se ingresa visualmente? | UI no definida |
| P.10 | C5 Histórico | Modal "Detalle de ticket" — ¿tiene re-imprimir, anular, enviar por email? | Acciones faltantes |

---

<a id="mesero"></a>
### 🟧 App Mesero

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| M.1 | E1 Login PIN | PIN incorrecto — ¿shake? ¿toast? ¿contador de intentos visible? | Estado de error |
| M.2 | E2 Sala | Si solo hay 1 sala, ¿se salta esta pantalla? | Lógica condicional |
| M.3 | E3 Mapa mesas | Click en mesa libre, ¿abre E4 directo o pregunta # de comensales primero? | Flujo intermedio |
| M.4 | E3 Mapa mesas | Estado `por-cobrar` — ¿lleva directo a E8 Cobro o a E4? | Navegación condicional |
| M.5 | E4 Detalle mesa | Botón "agregar" — ¿lleva a E5 Catálogo? Implícito pero no confirmado. | Transición |
| M.6 | E4 Detalle mesa | Botón lápiz abre `#sheetEditObs` — al guardar, ¿toast? ¿solo cierra? | Feedback faltante |
| M.7 | E5 Catálogo | Al agregar ítem desde E6, ¿vuelve al catálogo o cierra y vuelve a E4? | Transición |
| M.8 | E5 Catálogo | Búsqueda sin resultados — estado vacío no definido. | Estado vacío |
| M.9 | E7 Comandas | Click en comanda activa — ¿abre detalle? ¿lleva a la mesa correspondiente? | Navegación |
| M.10 | E7 Comandas | Sin comandas activas — estado vacío no definido. | Estado vacío |
| M.11 | E8 Cobro rápido | Mismas dudas que C4 (división, impresión, mixto, post-cobro). | UI no definida |
| M.12 | E9 Perfil | "Sesión" mencionada — ¿botón de logout? ¿cambio de PIN? | Acciones faltantes |
| M.13 | E10 Mi nómina | Botón "Solicitar adelanto" bloqueado si hay pendiente — ¿qué muestra? ¿tooltip? ¿texto explicativo? | Estado bloqueado |
| M.14 | E10 Mi nómina | El hero card, ¿es clickeable? | Interacción ambigua |
| M.15 | E11 Solicitar adelanto | Validaciones (monto excede tope) — ¿mensaje inline en slider? ¿toast? ¿botón deshabilitado? | Estado de error |
| M.16 | E11 Solicitar adelanto | Después de "Enviar solicitud", ¿redirige a E12 con la nueva destacada o vuelve a E10? | Transición |
| M.17 | E12 Mis adelantos | Sin adelantos — estado vacío no definido. | Estado vacío |
| M.18 | E12 Mis adelantos | Bottom-sheet detalle — "Descargar comprobante" abre PDF, ¿después? ¿queda abierto el sheet? | Estado post-acción |
| M.19 | E13 Historial pagos | Empleado nuevo sin pagos — estado vacío no definido. | Estado vacío |
| M.20 | E14 Confirmar por voz | 0 ítems detectados — ¿qué muestra? Lista vacía + CTA "Volver a grabar" no documentado. | Estado vacío |
| M.21 | E14 Confirmar por voz | "Buscar en catálogo" en ítem no reconocido — ¿abre E5 con búsqueda pre-rellenada? | Navegación con contexto |
| M.22 | E14 Confirmar por voz | "Agregar ítem manual" lleva a E5 — ¿el ítem regresa a E14 o va directo a E4? | Flujo de retorno |
| M.23 | E14 Confirmar por voz | "Enviar a cocina" — ¿qué ve el cocinero en KDS? ¿llega normal o con badge "por voz"? | Conexión cross-app |

---

<a id="kds"></a>
### ⬛ KDS

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| K.1 | D1 KDS | Al marcar "listo", ¿qué pasa visualmente? ¿desaparece? ¿pasa a columna "listos"? ¿se notifica al mesero? | Estado post-acción + comunicación |
| K.2 | D1 KDS | Sin comandas — estado vacío no definido. | Estado vacío |
| K.3 | D1 KDS | Ticket urgente (badge translúcido) — ¿qué dispara que sea urgente? ¿tiempo? ¿prioridad manual? | Lógica de estado |
| K.4 | D2 Config | Modal overlay — al guardar, ¿toast + cierra? ¿se aplica en vivo a D1? | Estado post-acción |
| K.5 | D1 KDS | Acceso a D2 — ¿botón en topbar? ¿gesto? | Navegación |

---

<a id="storefront"></a>
### 🟥 Storefront

| # | Pantalla | Gap | Tipo |
|---|---|---|---|
| S.1 | F1 Carta QR | Click en producto — ¿lleva a F2? Implícito pero no explícito. | Navegación |
| S.2 | F1 Carta QR | "Sin checkout" — ¿qué CTAs hay en F2 desde F1? ¿solo info? | Flujo |
| S.3 | F2 Detalle producto | Si viene de F1 (QR) vs F4 (tienda), ¿cambian los CTAs? | UI condicional |
| S.4 | F3 Tienda home | Nav "Inicio · Carta · Sucursales · Nosotros · Contacto" — ¿Sucursales/Nosotros/Contacto tienen pantalla o son `href="#"`? | Pantallas no listadas |
| S.5 | F4 Tienda catálogo | Carrito lateral — en mobile, ¿drawer? ¿barra flotante (que sí existe en `renderCartBar`)? Inconsistencia. | UI no definida |
| S.6 | F4 Tienda catálogo | Búsqueda sin resultados — estado vacío no definido. | Estado vacío |
| S.7 | F5 Checkout | "Método de pago" — ¿abre pasarela en modal? ¿redirige? ¿inline? | Integración visual |
| S.8 | F5 Checkout | Validaciones (dirección, email, teléfono) — mensajes inline no definidos. | Estado de validación |
| S.9 | F5 Checkout | Si el pago falla — ¿redirige a F5 con error? ¿pantalla aparte? | Flujo de error |
| S.10 | F6 Confirmación | "Tracking, tiempos" — ¿se actualiza solo? ¿link para refrescar? ¿llega por WhatsApp con link a F6? | Estado dinámico |
| S.11 | F6 Confirmación | "Número de orden" — ¿clickeable? ¿copia al portapapeles con toast? | Microinteracción |

---

<a id="transversales"></a>
### ⚪ Transversales

| # | Elemento | Gap | Tipo |
|---|---|---|---|
| T.1 | Campana / notificaciones (topbar) | Existe el ícono pero ¿qué pasa al click? ¿dropdown? ¿pantalla? ¿marcar leído? | Pantalla/overlay faltante |
| T.2 | Buscador Ctrl/Cmd+K | ¿Qué muestra al inicio (sin query)? ¿pantallas recientes? ¿sugerencias? | Estado inicial |
| T.3 | Switcher de rol (avatar dropdown) | Cambiar de rol — ¿recarga la página? ¿toast? ¿redirige al home del rol nuevo? | Estado post-acción |
| T.4 | Toggle dark/light | ¿Animación de transición o cambio seco? | Microinteracción |
| T.5 | Topbar campana + avatar | En mobile (app mesero), ¿existen estos elementos? ¿dónde se ubican? | Adaptación responsive |

---

<a id="sprints"></a>
## Plan de sprints

Sprints chicos y enfocados. Cada uno cierra los loops visuales de un flujo o pantalla. **Ningún sprint inventa módulos nuevos.**

| Sprint | Flujo | Duración | Gaps | Crítico |
|---|---|---|---|---|
| S15 | Caja & POS | 1 sem | 10 | ⭐ |
| S16 | App Mesero | 1 sem | 13 | ⭐ |
| S17 | Auth & Onboarding | 3 días | 8 | |
| S18 | Backoffice Gestión | 1 sem | 14 | |
| S19 | Backoffice Nómina | 4 días | 9 | ⭐ |
| S20 | Backoffice Config | 1 sem | 14 | |
| S21 | KDS | 2 días | 5 | |
| S22 | Storefront | 1 sem | 11 | |
| S23 | Transversales | 4 días | 7 | |

**Total: ~6 semanas.**

---

<a id="s15"></a>
### 🚀 S15 — Caja & POS

**Objetivo:** cerrar todos los loops del flujo de cobro y manejo de turno.

**Pantallas tocadas:** C1 (`pos/apertura.html`), C2 (`pos/mapa.html`), C3 (`pos/pedido.html`), **C4 (`#modalCobro` dentro de `pos/pedido.html` — no es archivo aparte)**, C5 (`pos/historico.html`), B20 (`backoffice/caja.html`).

**Tareas:**
- [ ] **C1 → C2:** definir transición de apertura confirmada (¿splash de bienvenida + auto-redirect a C2 en 1.5s?)
- [ ] **C1 estado condicional:** si ya hay turno abierto al entrar a C1, mostrar banner "Ya tienes turno abierto" + CTA "Ir al mapa"
- [ ] **C2 modal "Cerrar turno"** (P.3): rediseñar a flujo de 2 pasos
  1. Resumen del turno (ventas, métodos, tiempo abierto)
  2. Confirmar → abre vista imprimible del Z-report en nueva pestaña (HTML + `window.print()`, patrón `comprobante.js`) + toast con link "Volver a imprimir" → redirige a A1
- [ ] **C2 toggle Mapa/Lista:** definir la vista "Lista" (¿tabla con # mesa, estado, mesero, tiempo abierto, total?)
- [ ] **C3 modal Modificadores:** al confirmar, ítem aparece animado en cuenta lateral con badge "+1" momentáneo
- [ ] **C4 División de cuenta** (P.6) — *paso nuevo dentro de `#modalCobro`*: bottom-sheet con 3 modos:
  - Equitativo (slider de # personas)
  - Por ítems (checkboxes)
  - Manual (montos libres)
- [ ] **C4 Cobro mixto** (P.9) — *dentro de `#modalCobro`*: UI de cards apilables — añadir métodos uno a uno hasta cubrir total, con barra de progreso (hoy el modal solo soporta 1 método)
- [ ] **C4 Impresión** (P.7) — *footer de `#modalCobro`*: botón "Imprimir y cobrar" vs "Solo cobrar" → si hay >1 impresora configurada, selector inline
- [ ] **C4 Post-cobro** (P.8): toast verde + animación de mesa liberándose en C2 (color → libre) + auto-redirect a C2 en 2s
- [ ] **C5 Modal "Detalle de ticket"** (P.10): añadir 3 botones al footer del modal — "Re-imprimir", "Enviar por email", "Anular" (esta última solo visible si `Auth.can("tickets:void")`)
- [ ] **B20 Caja:** click en turno abre drawer lateral con resumen + link "Ver tickets" → C5 filtrado por ese turno
- [ ] **B20 Caja vs C2 arqueo:** documentar en `docs/decision-arqueo.md` que el arqueo se hace en C2 (cierre) y B20 es solo consulta histórica

**Entregables:** 5 pantallas modificadas, 1 vista HTML imprimible Z-report (`pos/z-report.html` + `window.print()`), 2 bottom-sheets nuevos dentro de `#modalCobro`, 1 doc de decisión.

**Restricciones técnicas:**
- **Sin librerías JS externas** (regla `CLAUDE.md`). El Z-report es HTML/CSS imprimible, no PDF binario. Apoyarse en el patrón existente `assets/js/comprobante.js`.

---

<a id="s16"></a>
### 🚀 S16 — App Mesero

**Objetivo:** completar estados vacíos, validaciones y flujos de retorno en toda la app móvil.

**Pantallas tocadas:** E1, E3, E4, E5, E6, E7, E8, E9, E10, E11, E12, E13, E14.

**Tareas:**
- [ ] **E1 PIN incorrecto:** shake animation + toast "PIN incorrecto" + contador "intentos restantes: X" después del 3er fallo
- [ ] **E3 Click en mesa libre:** mini bottom-sheet "¿Cuántos comensales?" con stepper antes de ir a E4
- [ ] **E3 Click en mesa `por-cobrar`:** ir directo a E8 con la cuenta cargada (no a E4)
- [ ] **E4 Botón "agregar"** → confirmar transición a E5 con back stack que conserva la mesa
- [ ] **E4 `#sheetEditObs`:** al guardar, toast "Observación actualizada" + cerrar sheet + scroll al ítem editado
- [ ] **E5 Búsqueda sin resultados:** ilustración + texto "Ningún producto coincide con '{query}'" + CTA "Limpiar búsqueda"
- [ ] **E5 Retorno desde E6:** quedarse en catálogo con toast "Agregado a la mesa" (no volver a E4 automáticamente — esto es flujo en lote)
- [ ] **E7 Sin comandas activas:** estado vacío con ilustración + texto "No tienes comandas activas" + CTA "Tomar pedido" → E3
- [ ] **E7 Click en comanda:** abre bottom-sheet con detalle + CTA "Ir a la mesa" → E4 de esa mesa
- [ ] **E8 Cobro:** replicar misma UI de C4 (división, mixto, impresión) adaptada a mobile — bottom-sheets en cascada
- [ ] **E9 Perfil:** añadir sección "Sesión" con dos botones — "Cambiar PIN" (bottom-sheet con PIN actual + nuevo + confirmar) y "Cerrar sesión" (modal de confirmación)
- [ ] **E10 Botón "Solicitar adelanto" bloqueado:** mostrar tooltip-card debajo "Ya tienes una solicitud {estado}. Espera la respuesta." + link "Ver solicitud" → E12
- [ ] **E11 Validaciones:** mensaje inline rojo debajo del slider cuando monto > tope. Botón "Enviar" deshabilitado hasta que sea válido.
- [ ] **E11 Post-envío:** toast verde + redirect a E12 con la nueva solicitud destacada (animación de entrada + highlight 2s)
- [ ] **E12 Sin adelantos:** estado vacío "No tienes adelantos aún" + CTA "Solicitar tu primero" → E11
- [ ] **E12 Post-descarga PDF:** toast "Comprobante descargado" + el sheet sigue abierto
- [ ] **E13 Sin pagos:** estado vacío "Tu historial aparecerá aquí cuando tengas tu primer pago"
- [ ] **E14 Con 0 ítems detectados:** estado vacío "No pudimos identificar productos en tu audio" + transcripción colapsada + CTA destacado "Volver a grabar" + secundario "Agregar manual"
- [ ] **E14 "Buscar en catálogo":** abrir E5 con query pre-rellenada del texto crudo del ítem no reconocido
- [ ] **E14 "Agregar ítem manual":** abrir E5; al agregar, volver a E14 con el ítem añadido a la lista
- [ ] **E14 → KDS:** los pedidos que llegan por voz traen badge "🎙 Voz" en el ticket de KDS para que el cocinero sepa que vino dictado

**Entregables:** 13 pantallas con estados completos, ~10 bottom-sheets ajustados, badge "voz" en KDS.

---

<a id="s17"></a>
### 🚀 S17 — Auth & Onboarding

**Objetivo:** dejar claras todas las transiciones del flujo de entrada al sistema.

**Pantallas tocadas:** A1, A2, A3, A4, A5, topbar avatar.

**Tareas:**
- [ ] **A1 Login exitoso:** regla definida — si el usuario tiene >1 sucursal, ir a A5; si tiene 1 sola, ir directo a B1
- [ ] **A1 Credenciales inválidas:** mensaje inline rojo bajo los inputs + shake suave (200ms)
- [ ] **A2 Post-registro:** pantalla intermedia "¡Listo, [nombre]! Tu cuenta fue creada" + 2 CTAs: "Empezar tour" (lleva a B1 con tooltips) o "Saltar al dashboard"
- [ ] **A3 Post-envío link:** misma pantalla cambia a estado de éxito (no nueva pantalla) — ícono verde + texto "Revisa tu correo {email}. Si no llega en 5 min, [reenviar]"
- [ ] **A4 Post-cambio:** auto-login + toast "Contraseña actualizada" + redirect según regla de A1
- [ ] **A5 1 sola sucursal:** se salta automáticamente — no se llega a renderizar
- [ ] **Logout:** añadir ítem "Cerrar sesión" al dropdown del avatar (todas las pantallas) con modal de confirmación
- [ ] **Switcher de rol:** al cambiar, toast "Cambiado a rol [X]" + reload soft + redirect al home del rol nuevo

**Entregables:** 1 pantalla intermedia nueva (post-registro), 3 estados de error definidos, logout funcional.

---

<a id="s18"></a>
### 🚀 S18 — Backoffice Gestión

**Objetivo:** estados post-acción, advertencias al borrar y consistencia de navegación en el grupo Gestión.

**Pantallas tocadas:** B1, B8, B9, B10, B11, B12, B13, B14, B16, Proveedores.

**Tareas:**
- [ ] **B1 KPIs clickeables:** los 4 KPIs principales abren B18 Reportes con filtro pre-aplicado
- [ ] **B1 Saludo dinámico:** "Buenos días" (< 12), "Buenas tardes" (12–18), "Buenas noches" (≥ 18)
- [ ] **B8 → B9:** "Crear producto" abre B9 en `?mode=new` (pantalla completa, no drawer)
- [ ] **B9 Guardar producto:** toast "Producto creado" + vuelve a B8 con el nuevo destacado
- [ ] **B9 Modificadores:** sub-drawer lateral con CRUD de modificadores del producto
- [ ] **B10 Nueva categoría:** modal cierra + nueva fila animada al tope con highlight 2s
- [ ] **B10 Eliminar categoría con productos:** modal advertencia "Esta categoría tiene N productos. ¿Reasignar a otra categoría o eliminar todos?" con 3 opciones
- [ ] **B11 Bajo stock:** banner amarillo arriba "N ingredientes en stock bajo" + columna "Estado" con badges color
- [ ] **B11 Click en ingrediente:** drawer lateral con detalle + tabs (info / kardex / configuración de alertas)
- [ ] **B12 Confirmar conteo:** post-confirmación, toast + descarga PDF del reporte de diferencias + redirige a B11
- [ ] **B12 Borrador:** auto-save cada 30s con indicador "Guardado hace X segundos" en topbar
- [ ] **B13 Drawer ingrediente:** al guardar, queda abierto con form limpio para añadir otro + toast "Ingrediente agregado"; botón "Listo" cierra y vuelve a B13
- [ ] **B14 Pedidos del cliente:** clickeables → modal de detalle del ticket (similar a C5)
- [ ] **B16 Nuevo gasto:** select de proveedor con opción "+ Crear nuevo" inline (modal anidado)
- [ ] **Proveedores (pulido):** `proveedores.html` ya tiene layout completo (tabla + drawer con tabs Info/Compras/Productos/Documentos + modal "Nuevo proveedor"). Revisar loops de cierre: ¿al guardar nuevo proveedor, fila animada al tope + toast? ¿Eliminar pide confirmación? ¿Tab "Compras" lleva a detalle de orden de compra?

**Entregables:** 10 pantallas con loops cerrados, pulido de Proveedores (no nuevo layout), 2 drawers nuevos.

---

<a id="s19"></a>
### 🚀 S19 — Backoffice Nómina

**Objetivo:** cerrar transiciones entre B23 ↔ B24 ↔ B25 ↔ B26 y completar comunicación con la app mesero.

**Pantallas tocadas:** B23, B24, B25, B26, E10–E12.

**Tareas:**
- [ ] **B23 Modal "Registrar pago"** al confirmar:
  - Abre vista HTML imprimible de la nómina cerrada (resumen + desprendibles por empleado) en nueva pestaña, vía `window.print()` — patrón `comprobante.js`. **Sin jsPDF ni libs externas.**
  - Toast "Nómina pagada · Volver a imprimir"
  - Se queda en B23 con el periodo marcado como "Cerrado"
- [ ] **B23 Fila empleado:** todo el row es clickeable → B24 de ese empleado
- [ ] **B23 Cerrar con adelantos pendientes:** modal "Hay N adelantos pendientes de aprobación. ¿Cerrar igual?" con CTA "Revisar adelantos" → B25
- [ ] **B24 Tab Adelantos:** cada item lleva a B26
- [ ] **B24 Validación salario:** mensaje inline rojo "El salario no puede ser menor al SMMLV ($1.623.500)" + botón "Guardar" deshabilitado
- [ ] **B25 Modal "Aprobar":** al confirmar, toast + sigue en B25 (el adelanto desaparece de "Pendientes" y aparece en "Aprobadas") + dispara notificación al mesero (E10 muestra badge en próxima carga)
- [ ] **B25 Modal "Rechazar":** mismo patrón → tab "Rechazadas" + notifica al mesero
- [ ] **B26 Post-descarga comprobante:** toast "Comprobante descargado" + queda en B26
- [ ] **B26 Timeline:** cada nodo muestra tooltip al hover con `quien · cuando · nota` (si hay)
- [ ] **E10 Indicador de novedad:** badge "•" rojo en el bottom-tab Nómina cuando hay cambio de estado en algún adelanto sin ver

**Entregables:** 4 pantallas BO con loops completos, 1 vista HTML imprimible de nómina cerrada (`backoffice/nomina-imprimible.html` + `window.print()`), badge de notificaciones en app mesero.

**Restricciones técnicas:**
- Sin librerías JS externas (regla `CLAUDE.md`). Reutilizar patrón `assets/js/comprobante.js` para el desprendible.

---

<a id="s20"></a>
### 🚀 S20 — Backoffice Config

**Objetivo:** definir comportamiento de guardado, advertencias y sincronización de toda la sección Config.

**Pantallas tocadas:** B17, B18, B5, B6, B7, B2, B3, B4, B22, Contabilidad.

**Tareas:**
- [ ] **B17 Estado de error MATIAS:** banner rojo si la conexión falla + CTA "Reintentar" + link a B22
- [ ] **B18 Generar reporte:** dropdown en botón confirmar — "Descargar PDF", "Descargar Excel", "Enviar por email" (con input)
- [ ] **B5 Sticky save bar:** barra inferior fija que aparece al detectar cambios — "Tienes cambios sin guardar" + botones "Descartar" y "Guardar cambios"
- [ ] **B5 Navegación con cambios sin guardar:** modal interceptor "Tienes cambios sin guardar. ¿Salir igual?"
- [ ] **B6 Eliminar sucursal con datos:** modal advertencia con tabs por tipo de dato afectado + opción "transferir a otra sucursal" antes de eliminar
- [ ] **B7 Crear/editar mesa:** drawer lateral con form (número, capacidad, sala, posición XY si hay mapa visual)
- [ ] **B7 Sincronización con `StoreMesas`:** custom event `mesa-actualizada` ya existe — asegurar que E3/C2 escuchan y re-renderizan sin reload
- [ ] **B2 Guardar usuario:** drawer cierra + fila se actualiza en vivo (animación) + toast
- [ ] **B3 Crear usuario:** opción "Enviar invitación por email" (checkbox) con preview del email que se enviará
- [ ] **B4 Click en celda:** auto-save inmediato + toast sutil "Permiso actualizado" (no requiere botón guardar global)
- [ ] **B4 Nuevo rol:** al crear, queda como nueva columna animada al final de la matriz
- [ ] **B22 Configurar integración:** drawer con dos botones — "Validar conexión" (test) y "Guardar"; validar muestra checkmark verde o error inline
- [ ] **B22 Desconectar:** modal "Vas a desconectar [Servicio]. Los pedidos en curso se procesarán pero no entrarán nuevos. ¿Confirmar?"
- [ ] **Contabilidad (pulido):** `contabilidad.html` ya tiene layout completo (tabs Resumen / Plan de cuentas / Libros auxiliares / Centro de costos). Revisar loops: ¿exportación por tab? ¿filtros de fecha persistidos? ¿click en cuenta del plan abre libro auxiliar filtrado?

**Entregables:** 9 pantallas con loops cerrados, pulido de Contabilidad (no nuevo layout), 1 patrón sticky save bar reutilizable.

---

<a id="s21"></a>
### 🚀 S21 — KDS

**Objetivo:** cerrar acciones, estados vacíos y comunicación cross-app desde cocina.

**Pantallas tocadas:** D1, D2.

**Tareas:**
- [ ] **D1 Marcar "listo":** ticket se mueve animado a columna "Listos" (no desaparece) con badge tiempo total; se notifica al mesero (E7 muestra badge "Comanda lista")
- [ ] **D1 Sin comandas:** estado vacío central "Sin comandas en este momento" + reloj grande con hora actual (para uso en pared)
- [ ] **D1 Lógica de urgencia:** documentar + UI — un ticket pasa a "urgente" después de X minutos (configurable en D2)
- [ ] **D2 Guardar config:** toast + cierra modal + cambios se aplican en vivo a D1 (sin reload)
- [ ] **D1 Acceso a D2:** ícono engranaje en topbar derecha

**Entregables:** 2 pantallas pulidas + comunicación KDS ↔ App Mesero.

---

<a id="s22"></a>
### 🚀 S22 — Storefront

**Objetivo:** estados vacíos, validaciones, flujo de error de pago, microinteracciones.

**Pantallas tocadas:** F1, F2, F3, F4, F5, F6.

**Tareas:**
- [ ] **F1 → F2:** confirmar navegación (click en card de producto)
- [ ] **F2 CTAs condicionales:** si viene de F1 (QR), CTA "Llamar al mesero" (sin checkout); si viene de F4, "Agregar al carrito"
- [ ] **F3 Nav:** definir pantallas o ocultar los links que sean placeholder (no dejar `href="#"`)
- [ ] **F4 Carrito en mobile:** confirmar — barra flotante de `renderCartBar` es lo único; quitar mención de "carrito lateral" en docs
- [ ] **F4 Búsqueda sin resultados:** estado vacío "No encontramos productos para '{query}'" + sugerencias de categorías
- [ ] **F5 Método de pago:** redirige a pasarela externa de Wompi en nueva pestaña; pantalla F5 queda en estado "Procesando..." con spinner; al volver, ir a F6 si éxito o quedarse en F5 con error
- [ ] **F5 Validaciones inline:** mensajes rojos bajo cada input fallido + scroll automático al primer error al intentar continuar
- [ ] **F5 Pago fallido:** banner rojo arriba "El pago no se completó: {motivo}" + CTA "Reintentar" o "Cambiar método"
- [ ] **F6 Tracking:** auto-refresh cada 30s + indicador "Actualizado hace X seg" + link "Ver en tiempo real"
- [ ] **F6 Confirmación por canal:** badge "Te enviamos confirmación por WhatsApp/email" según lo configurado por el cliente
- [ ] **F6 Número de orden clickeable:** click → copia al portapapeles + toast "Copiado"

**Entregables:** 6 pantallas pulidas + 2 estados vacíos + 3 microinteracciones.

---

<a id="s23"></a>
### 🚀 S23 — Transversales

**Objetivo:** cerrar comportamiento de componentes globales (campana, Ctrl+K, tema, responsive).

**Tareas:**
- [ ] **Campana topbar:** click abre dropdown lateral con últimas 10 notificaciones, badge con count, "Marcar todas como leídas", "Ver todas" → pantalla `/backoffice/notificaciones.html` (nueva, simple, lista cronológica)
- [ ] **Ctrl+K estado inicial:** sin query — mostrar 3 secciones: "Recientes" (últimas 5 pantallas visitadas, vía localStorage), "Acciones rápidas" (crear producto, abrir turno, etc.), "Pantallas frecuentes"
- [ ] **Switcher de rol:** al cambiar, toast + animación de fade + redirect al home del rol nuevo (admin → B1, mesero → E3, etc.)
- [ ] **Toggle dark/light:** transición CSS de 200ms en `background-color` y `color` del `<html>`
- [ ] **Topbar mobile (app mesero):** define qué se conserva — solo avatar + título; sin campana ni search (ya hay bottom-tab)

**Entregables:** 1 pantalla nueva (notificaciones), 1 dropdown nuevo (campana), 1 vista inicial Ctrl+K, microinteracciones de tema.

---

<a id="critico"></a>
## Camino crítico recomendado

Si solo puedes hacer una parte del plan, este es el orden de mayor impacto operativo:

1. **S15 — Caja & POS** (1 sem) — desbloquea el flujo de cobro diario y el cierre de turno con documento
2. **S16 — App Mesero** (1 sem) — cierra todos los flujos del personal que más usa la app
3. **S19 — Backoffice Nómina** (4 días) — cierra el loop de adelantos y notifica al mesero

**Total camino crítico: ~2.5 semanas** y tienes los tres flujos más usados a diario completos.

Los demás sprints son pulido importante pero no bloqueante para operar el día a día.

---

## Notas finales

- Cada gap individual está numerado para poder referenciarlo en Jira/GitHub issues (`A.1`, `B.18`, `M.20`, etc.)
- Los sprints están dimensionados asumiendo 1 dev full-time sobre frontend vanilla
- Donde se mencione "comunicación cross-app", asegurarse de usar `CustomEvent` + listeners en `StoreMesas`, `Empleados` y nuevos stores que se requieran, manteniendo el patrón actual del sprint 14
- Las decisiones de UX que aparezcan durante la implementación se documentan en `docs/decisions/`
