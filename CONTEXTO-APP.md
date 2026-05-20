# Contexto de app — {ROOT}

> Documento extraído del código de este repo (`front-demo`) para reutilizar
> textos, copy y estructura en una landing aparte. Solo información real
> presente en el código — donde no existe data en la app, se indica
> explícitamente en vez de inventar.

---

## Nombre de la app

- **Nombre comercial:** {ROOT} *(el logo se renderiza como texto puro `[ROOT]` con la clase CSS `.root-wordmark`: Inter 800, color `#4F46E5` (var(--accent)), letter-spacing 0.10em. No hay imagen — es un wordmark tipográfico en morado.)*
- **Nombre técnico / interno (en docs):** Inventario POS
- **Tagline corto (hero del landing actual):** "ROOT — Demo del sistema · 7 módulos · ~62 pantallas · navegación completa"
- **Tagline largo (docs):** "SaaS multi-tenant para restaurantes en Colombia"

---

## Qué hace / descripción

{ROOT} es un **SaaS para restaurantes en Colombia** que unifica en una sola
plataforma la operación de punto de venta, cocina, sala, administración y
canal de ventas digital. Está pensado para restaurantes con una o varias
sucursales que necesitan facturar electrónicamente ante la DIAN, controlar
inventario en tiempo real y recibir pedidos por múltiples canales sin tener
que coser sistemas distintos.

La plataforma cubre **siete superficies funcionales** que conectan a todo el
personal del negocio: el mesero levanta el pedido en su móvil, la cocina lo
ve en el KDS en tiempo real, el cajero cobra desde el POS web, el dueño
vigila ventas e inventario desde el Backoffice y el cliente final ordena
desde la tienda online o el QR de la mesa. Incluye además un módulo completo
de **nómina y adelantos salariales** para gestionar pagos de empleados
directamente desde la plataforma. Todo con cumplimiento DIAN y pasarelas de
pago colombianas como ciudadanos de primera clase.

Va dirigida a **dueños y administradores de restaurantes en Colombia** que
hoy combinan POS legacy + Excel + integraciones manuales con apps de
delivery, y que quieren un sistema único, multi-sucursal, con facturación
electrónica homologada y operación offline-first donde importa.

---

## Servicios o funcionalidades principales

{ROOT} se compone de 7 módulos navegables. Cada uno es una "superficie" del
sistema con su propio shell y su rol dentro del negocio.

### 1. Auth — Acceso al sistema
Onboarding y autenticación multi-rol para el negocio y sus sucursales.
- Login con email + contraseña y opción "Mantener sesión iniciada"
- Registro guiado por stepper en 3 pasos: datos del negocio → admin → tipo de negocio
- Recuperación y restablecimiento de contraseña + selector de sucursal post-login

### 2. POS Web — Punto de venta para mesero/cajero
POS de caja/tablet para tomar pedidos y cobrar en sala.
- Apertura de turno con conteo de caja
- Mapa de mesas con estado en vivo y toma de pedido
- Modal de cobro multi-método e histórico del turno

### 3. App Mesero — App móvil para meseros
App optimizada para mobile (PIN `1234` en la demo) con la operación de sala.
- Login por PIN, mapa de mesas y vista por sala
- Catálogo con detalle de producto y comandas activas
- Flujo de cobro y perfil del mesero
- Módulo de nómina: consulta de devengado, solicitud de adelantos y historial de pagos *(Sprint 13)*

### 4. KDS — Pantalla de cocina
Pantalla tipo tablet/TV para la cocina, con actualizaciones en tiempo real.
- Tablero de comandas entrantes
- Configuración de estaciones y temporizadores
- Vista pensada para uso continuo en pared/contador

### 5. Backoffice — Administración del negocio
Web admin con ~24 pantallas para correr el negocio de punta a punta.
- Operación: Dashboard con KPIs, POS, KDS y Caja
- Gestión: Catálogo, Inventario, Clientes, Proveedores, Gastos
- Nómina: Dashboard de nómina, Adelantos, Detalle por empleado *(Sprint 13)*
- Finanzas y Config: Facturación DIAN, Contabilidad, Reportes, Sucursales, Usuarios, Roles, Integraciones

### 6. Storefront — Cara al cliente (carta + tienda)
Sitio público y carta QR para que el cliente final pida sin app.
- Tienda home y catálogo con búsqueda
- Detalle de producto, checkout y confirmación de pedido
- Carta QR para consulta en mesa, sin checkout

### 7. Design System — Sistema base
Tokens, componentes atómicos y compuestos, overlays y shells que sostienen
todas las superficies. Light/dark, accesibilidad, mobile-first 360 → 1920px.

---

## Planes o precios

**No hay planes ni precios definidos en el código de la app.**

La demo no incluye página de pricing, modal de suscripción ni tabla de
planes. Los únicos precios que aparecen en pantalla son montos de productos
mock del restaurante demo "El Buen Sabor" (Bandeja Paisa, Ajiaco, Limonada
Natural, etc.), que no representan tarifas del SaaS.

> Para la landing nueva: dejar la sección de precios como "TBD" o
> sustituirla por un CTA tipo "Solicitar demo" / "Hablar con ventas",
> consistente con el estado actual del producto.

---

## Contacto

**No hay datos de contacto del SaaS {ROOT} en el código.**

Lo que sí existe son datos de contacto del **restaurante demo "El Buen
Sabor"** que se usan como mock dentro de la app — no son del SaaS:

- Email demo (negocio mock): `contacto@buen-sabor.co`
- Teléfono demo (negocio mock): +57 601 234 5678
- Dirección demo (negocio mock): Cra. 15 #80-32, Bogotá
- NIT demo (negocio mock): 900.123.456-7

Enlaces legales presentes en el footer de Auth (sin destino real, `href="#"`):

- Términos
- Privacidad
- Soporte

Redes sociales presentes en el footer del Storefront (también sin URLs):
Instagram, Facebook, YouTube, Twitter.

> Para la landing nueva: completar email/teléfono/redes reales del SaaS
> {ROOT} antes de publicar.

---

## Textos de UI reutilizables

### CTAs principales (botones y headlines)

**Hero / landing:**
- "Empezar por el Backoffice" → CTA principal del index
- "Ver tokens" → CTA secundario del design system

**Auth:**
- "Iniciar sesión"
- "Inicia sesión en tu cuenta" · "Bienvenido de vuelta"
- "Registra tu negocio"
- "¿Aún no tienes cuenta? Registra tu negocio"
- "Ya tengo cuenta, iniciar sesión"
- "¿Olvidaste tu contraseña?"
- "Mantener sesión iniciada"
- "Continuar"
- "Cuéntanos sobre tu negocio"
- "Esta información aparecerá en tus facturas electrónicas"

**Backoffice (acción y headers):**
- "Buenos días, [nombre]" — saludo del dashboard
- "Guardar cambios" / "Descartar"
- "Ver documentación"
- "Configurar"
- "Conectar" / "Desconectado" / "Conectado"
- "Conecta ROOT con los servicios que ya usas"
- "Recibe pedidos de delivery, factura electrónicamente y procesa pagos sin salir de aquí."
- "Registrar pago" — CTA del dashboard de nómina
- "Aprobar y notificar" — CTA del modal de aprobación de adelantos
- "Rechazar solicitud" — CTA del modal de rechazo
- "Marcar como pagada" / "Marcar como descontada" — acciones en detalle de adelanto (B26)
- "Descargar comprobante" — genera PDF con jsPDF

**Storefront (cara al cliente):**
- "Pedir ahora"
- "Inicio · Carta · Sucursales · Nosotros · Contacto"

### Headlines de secciones

- "Módulos" — sección del grid de módulos en el index
- "Sistema base" — sección del design system
- "Operación" / "Gestión" / "Nómina" / "Finanzas" / "Config" — grupos del sidebar Backoffice
- "Conecta ROOT con los servicios que ya usas" — intro de Integraciones
- "Mi nómina" — topbar pantalla E10 mesero
- "Solicitar adelanto" — topbar pantalla E11 mesero
- "Mis adelantos" — topbar pantalla E12 mesero
- "Historial de pagos" — topbar pantalla E13 mesero
- "Próximo pago" — label del hero card de nómina
- "Nómina" — ítem del bottom-tab de la app mesero (ícono: wallet)

### Mensajes de éxito (toasts)

- `success` "Configuración guardada — [Servicio] actualizado correctamente."
- `success` "Cambios guardados — La configuración fue actualizada correctamente."

> La API global expone `UI.toast({ type, title, sub, duration })` con tipos
> `success | error | warning | info`. No hay mensajes de error específicos
> hardcodeados en la demo (no hay backend que falle).

### Badges, microcopy y notas al pie

- "Demo" — badge azul que aparece en cards de placeholder
- "Homologado" — badge en MATIAS API (DIAN)
- "Conectado" / "Desconectado" — estado de integraciones
- "Sin dígito de verificación" — hint del campo NIT
- "Mobile-first. 360px → 1920px." — promesa transversal del DS
- "PNG o JPG · cuadrado · mínimo 256×256px" — hint para el logo del negocio

### Footers

- Landing: `ROOT · Demo v1.0 · 2026`
- Auth: `© 2026 ROOT · Términos · Privacidad · Soporte`

### A11y / utilidades

- "Saltar al contenido principal" — skip link presente en todas las pantallas
- "Cambiar tema" — aria-label del toggle light/dark
- "Abrir menú" — aria-label del hamburger del sidebar
- Atajo **Ctrl/Cmd + K**: buscador global de pantallas

---

## Integraciones soportadas (cara al cliente)

Material útil para una sección "Funciona con" en la landing. Tomado de
`backoffice/integraciones.html`:

- **Pagos:** Wompi (tarjeta, Nequi, PSE), ePayco
- **Delivery:** Rappi, Uber Eats, Didi Food, PedidosYa
- **Fiscal:** MATIAS API (facturación electrónica DIAN — homologado)
- **Comunicación:** WhatsApp Business, Mailgun

Pagos aceptados que aparecen en el footer del Storefront: **Visa, Mastercard,
PSE, Wompi**.

---

## Inventario completo de pantallas y funcionalidades

> Fuente: `docs/pantallas-auditoria.md` + títulos reales de cada `.html`.
> Total: **48 archivos HTML** (46 pantallas del DS + 2 extras: Proveedores y
> Contabilidad). Se incluyen además ~15 modales/drawers/bottom-sheets
> embebidos dentro de pantallas.

### Estructura general

| Módulo       | Ruta base        | Pantallas  | Shell / layout        | Target de uso                  |
|--------------|------------------|------------|------------------------|--------------------------------|
| Landing      | `/`              | 2          | header simple          | navegación hub                 |
| Auth         | `/auth/`         | 5          | split panel centrado   | web responsive                 |
| Backoffice   | `/backoffice/`   | 24         | sidebar + topbar       | desktop/tablet                 |
| POS Web      | `/pos/`          | 4 + modal  | topbar + bottombar     | tablet/desktop (cajero)        |
| App Mesero   | `/mesero/`       | 14 + sheet | frame mobile + tab bar | mobile (PIN `1234`)            |
| KDS          | `/kds/`          | 2          | dark default, grid     | TV/tablet cocina               |
| Storefront   | `/storefront/`   | 6          | público mobile+desktop | cliente final                  |

---

### 1. Landing / Hub (2)

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Index | `index.html` | Hub de módulos: hero "ROOT — Demo del sistema · 7 módulos · ~46 pantallas · navegación completa", grid de 6 módulos con conteo de pantallas, card del Design System, toggle dark/light, atajo Ctrl/Cmd+K (buscador global). |
| Test DS | `test-ds.html` | Página de prueba/showcase del design system (tokens, componentes atómicos y compuestos). |

---

### 2. Auth — Acceso (5 pantallas, Sprint 1)

Shell de auth con panel split (form + visual). Footer legal `© 2026 ROOT · Términos · Privacidad · Soporte`.

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Login (A1) | `auth/login.html` | Email + contraseña, checkbox "Mantener sesión iniciada", link "¿Olvidaste tu contraseña?", CTA secundario "Registra tu negocio". |
| Registro (A2) | `auth/registro.html` | Stepper 3 pasos: (1) datos del negocio — NIT con hint "Sin dígito de verificación", (2) datos del admin, (3) tipo de negocio. |
| Recuperar (A3) | `auth/recuperar.html` | Solicitud de link de recuperación por email. |
| Restablecer (A4) | `auth/restablecer.html` | Nueva contraseña + confirmación, retorno a login. |
| Selector sucursal (A5) | `auth/selector-sucursal.html` | Lista de sucursales del negocio para elegir contexto post-login. |

---

### 3. Backoffice — Administración (24 pantallas, Sprints 2–5 + 13)

Shell con sidebar agrupado en **Operación / Gestión / Nómina / Finanzas / Config** + topbar con buscador y campana. Saludo dinámico ("Buenos días, [nombre]") en dashboard.

#### Operación

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Dashboard (B1) | `backoffice/dashboard.html` | KPIs principales (ventas, ticket promedio, etc.), saludo "Buenos días, Juan Camilo", contexto "Lunes, 15 de noviembre · Sede Norte". |
| POS *(acceso)* | enlace al módulo `/pos/` | Atajo al punto de venta desde el sidebar. |
| KDS *(acceso)* | enlace al módulo `/kds/` | Atajo a la pantalla de cocina. |
| Caja (B20) | `backoffice/caja.html` | Estado de caja: turnos abiertos/cerrados, conteos, arqueo. |

#### Gestión

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Catálogo (B8) | `backoffice/catalogo.html` | Listado de productos ("68 productos · 5 categorías"), filtros por categoría, CTA crear producto. |
| Producto (B9) | `backoffice/producto.html` | Crear/editar producto: nombre, SKU (ej. "Ajiaco Bogotano · AJB-001"), precio, categoría, foto, modificadores. |
| Categorías (B10) | `backoffice/categorias.html` | CRUD de categorías; modal "Nueva categoría". |
| Inventario (B11) | `backoffice/inventario.html` | "Control de ingredientes y bodegas": stock por ingrediente, alertas de bajo stock. |
| Conteo (B12) | `backoffice/conteo.html` | Conteo físico de inventario, modal "Confirmar conteo" con diferencias. |
| Fichas técnicas (B13) | `backoffice/fichas.html` | Receta de cada producto: drawer "Agregar ingrediente" con costos y mermas. |
| Clientes (B14) | `backoffice/clientes.html` | Base de clientes; drawer detalle con tabs (datos / pedidos / fidelidad). |
| Proveedores *(extra)* | `backoffice/proveedores.html` | CRUD de proveedores; sin JSX dedicado en el DS pero registrado en sidebar/nav. |
| Gastos (B16) | `backoffice/gastos.html` | Registro de gastos operativos; modal "Nuevo gasto". |

#### Nómina *(Sprint 13)*

Nuevo grupo de sidebar agregado entre Gestión y Finanzas. Persistencia en `localStorage` bajo la key `root:nomina:v1`. Salario mínimo Colombia 2026: `$1.623.500`.

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Nómina dashboard (B23) | `backoffice/nomina.html` | 4 KPIs (total a pagar, adelantos pendientes, empleados activos, próximo corte). Filtros por sucursal y periodicidad. Tabla de 8 empleados con salario base, devengado actual, adelantos del periodo y neto. Modal "Registrar pago" para cerrar nómina manualmente. |
| Detalle empleado (B24) | `backoffice/nomina-empleado.html` | Tabs: **Datos** (form editable: salario base con validación ≥ SMMLV, periodicidad, % tope de adelanto en slider), **Adelantos** (historial completo con badges de estado), **Pagos** (historial cronológico). |
| Adelantos (B25) | `backoffice/adelantos.html` | Bandeja con tabs por estado (Pendientes / Aprobadas / Pagadas / Rechazadas / Todas) y contadores. Acciones inline "Aprobar" (modal con monto editable + nota) y "Rechazar" (motivo obligatorio). |
| Detalle adelanto (B26) | `backoffice/adelanto-detalle.html` | Layout de dos columnas: timeline de transiciones (izquierda) + drawer con datos del empleado, contexto del periodo y botones según estado ("Marcar como pagada", "Marcar como descontada", "Descargar comprobante"). |

#### Finanzas

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Facturación DIAN (B17) | `backoffice/facturacion-dian.html` | Estado de facturación electrónica (homologado vía MATIAS API), serie, numeración. |
| Contabilidad *(extra)* | `backoffice/contabilidad.html` | Pantalla más extensa del BO; sin JSX dedicado pero registrada en sidebar. |
| Reportes (B18) | `backoffice/reportes.html` | Reportes operativos y de ventas; modal "Generar reporte" con filtros y formato. |

#### Configuración

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Configuración general (B5) | `backoffice/configuracion.html` | Datos del negocio, logo ("PNG o JPG · cuadrado · mínimo 256×256px"), aparece en facturas. |
| Sucursales (B6) | `backoffice/sucursales.html` | CRUD de sucursales del negocio. |
| Mesas (B7) | `backoffice/mesas.html` | "Salas y mesas": diseño de salas y mapa lógico de mesas. |
| Usuarios (B2) | `backoffice/usuarios.html` | "12 usuarios · 5 roles asignados"; drawer crear/editar usuario (B3). |
| Roles (B4) | `backoffice/roles.html` | "5 roles definidos · 13 usuarios asignados"; matriz de permisos. |
| Integraciones (B22) | `backoffice/integraciones.html` | Conexión con Wompi, ePayco, Rappi, Uber Eats, Didi Food, PedidosYa, MATIAS API (DIAN), WhatsApp Business, Mailgun. Estados "Conectado / Desconectado / Homologado"; drawer de configuración. |

---

### 4. POS Web — Punto de venta (4 pantallas + modal, Sprint 6)

Shell de tablet/desktop con topbar y bottombar fijos.

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Apertura turno (C1) | `pos/apertura.html` | "Abrir turno": conteo inicial de caja por denominaciones, observaciones. |
| Mapa de mesas (C2) | `pos/mapa.html` | Mapa en vivo con estado de mesas (libre/ocupada/por cobrar), incluye modal "Cerrar turno". |
| Pedido (C3) | `pos/pedido.html` | Toma de pedido: catálogo + cuenta de la mesa; modal "Modificadores"; modal de Cobro multi-método (C4). |
| Cobro (C4, modal) | dentro de `pedido.html` | Selección de método (efectivo, tarjeta, transferencia, mixto), propina, división de cuenta, impresión. |
| Histórico (C5) | `pos/historico.html` | Tickets del turno actual; modal "Detalle de ticket". |

---

### 5. App Mesero — Mobile (14 pantallas + bottom-sheet, Sprints 7 + 12 + 13 + 14)

Shell con frame de iPhone, bottom-tab de 4 ítems (Mesas / Comandas / Nómina / Perfil). Login por PIN `1234` en la demo. El mesero logueado en la demo es **Camila Rojas** (`emp-001`, Sede Norte, quincenal, $1.623.500).

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Login PIN (E1) | `mesero/login.html` | Teclado PIN para acceso del mesero. |
| Sala (E2) | `mesero/sala.html` | Selector de sala (lista) cuando el local tiene varias. |
| Mapa mesas (E3) | `mesero/mapa.html` | Mapa de mesas táctil para mobile. |
| Detalle mesa (E4) | `mesero/detalle.html` | Cuenta actual de la mesa, comensales, acciones (agregar, cobrar). |
| Catálogo (E5) | `mesero/catalogo.html` | Catálogo de productos con búsqueda; bottom-sheet (E6) "Modificadores". |
| Bottom-sheet modificadores (E6) | dentro de `catalogo.html` | Selección de variantes/extras antes de agregar a la mesa. |
| Comandas (E7) | `mesero/comandas.html` | Comandas activas del mesero en cocina/barra. |
| Cobro rápido (E8) | `mesero/cobro.html` | Cierre de cuenta desde la mesa, métodos de pago. |
| Perfil (E9) | `mesero/perfil.html` | Datos del mesero, propinas, sesión. |
| Mi nómina (E10) | `mesero/nomina.html` | Hero card: countdown "Próximo pago en X días + fecha", salario base, devengado a la fecha, barra de progreso del periodo, periodicidad. Botones: "Solicitar adelanto" (se bloquea si hay solicitud pendiente) y "Ver mis adelantos". |
| Solicitar adelanto (E11) | `mesero/adelanto-solicitar.html` | Slider de monto con tope dinámico (% del devengado configurado por admin), preview "Te quedará $X disponible", textarea motivo (opcional, 200 chars), validaciones, CTA "Enviar solicitud" → guarda en `localStorage` y redirige con toast. |
| Mis adelantos (E12) | `mesero/adelantos-historial.html` | Lista cronológica descendente con badges de estado por color. Bottom-sheet con detalle completo + timeline de transiciones + botón "Descargar comprobante" (PDF via jsPDF) si estado es `pagada` o `descontada`. |
| Historial de pagos (E13) | `mesero/pagos-historial.html` | Resumen acumulado (pagos, bruto total, neto total) + lista agrupada por mes con headers sticky. Cada item: etiqueta, fecha, método y neto destacado. Bottom-sheet con desglose bruto / descuentos / neto. |
| Confirmar pedido por voz (E14) | `mesero/audio-confirmar.html` | Pantalla de revisión post-dictado. Card colapsable con la transcripción cruda. Lista de ítems detectados por `VoiceParser.parse()` con qty editable (+/-), precio y botón eliminar. Ítems no reconocidos en badge amarillo "No encontrado" con link "Buscar en catálogo". CTA "Agregar ítem manual" → `catalogo.html`. Footer sticky: subtotal + "Volver a grabar" / "Enviar a cocina" (deshabilitado sin ítems válidos). Al confirmar llama a `StoreMesas.addItemsAMesa()` y redirige a `detalle.html`. Lee transcripción de `sessionStorage: root:voice:last-transcript`. |

---

### 6. KDS — Cocina (2 pantallas, Sprint 8)

Shell dark por defecto, layout pensado para TV/tablet de pared.

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Pantalla cocina (D1) | `kds/main.html` | Tablero de comandas entrantes en tiempo real, temporizadores por ticket, columnas/estaciones, acciones (en preparación, listo). |
| Configuración (D2) | `kds/config.html` | Modal overlay: estaciones, alertas de tiempo, layout de columnas. |

---

### 7. Storefront — Cara al cliente (6 pantallas, Sprint 9)

Carta QR (mobile) + tienda online (mobile y desktop). Marca demo "El Buen Sabor". Pagos en footer: Visa, Mastercard, PSE, Wompi. Redes en footer: Instagram, Facebook, YouTube, Twitter.

| Pantalla | Archivo | Funcionalidad |
|----------|---------|----------------|
| Carta QR (F1) | `storefront/carta.html` | Carta para escaneo en mesa (mobile-only, sin checkout). |
| Detalle producto QR (F2) | `storefront/producto.html` | Ficha de producto desde la carta QR (ej. "Ajiaco Bogotano"). |
| Tienda home (F3) | `storefront/tienda.html` | Home pública del restaurante con hero + categorías destacadas; nav "Inicio · Carta · Sucursales · Nosotros · Contacto"; CTA "Pedir ahora". |
| Tienda catálogo (F4) | `storefront/tienda-catalogo.html` | Catálogo con búsqueda, filtros y carrito lateral. |
| Checkout (F5) | `storefront/checkout.html` | Datos del cliente, dirección, método de pago, resumen del pedido. |
| Confirmación (F6) | `storefront/confirmacion.html` | "¡Pedido confirmado!": número de orden, tracking, tiempos. |

---

### Modales / drawers / overlays embebidos

| Overlay | En qué pantalla vive |
|---------|----------------------|
| Drawer crear usuario (B3) | `backoffice/usuarios.html` |
| Modal nueva categoría | `backoffice/categorias.html` |
| Drawer agregar ingrediente | `backoffice/fichas.html` |
| Drawer detalle cliente (con tabs) | `backoffice/clientes.html` |
| Modal nuevo gasto | `backoffice/gastos.html` |
| Modal confirmar conteo | `backoffice/conteo.html` |
| Modal generar reporte | `backoffice/reportes.html` |
| Drawer configurar integración | `backoffice/integraciones.html` |
| Modal modificadores (POS) | `pos/pedido.html` |
| Modal cobro (C4) | `pos/pedido.html` |
| Modal detalle ticket | `pos/historico.html` |
| Modal cerrar turno | `pos/mapa.html` |
| Bottom-sheet modificadores (E6) | `mesero/catalogo.html` |
| Bottom-sheet editar observación (voz) | `mesero/detalle.html` |
| Bottom-sheet detalle adelanto | `mesero/adelantos-historial.html` |
| Bottom-sheet desglose pago | `mesero/pagos-historial.html` |
| Modal registrar pago (nómina) | `backoffice/nomina.html` |
| Modal aprobar adelanto | `backoffice/adelantos.html` |
| Modal rechazar adelanto | `backoffice/adelantos.html` |
| Modal Ctrl/Cmd+K (buscador global) | todas (vía `assets/js/nav.js`) |

---

## Capacidades transversales del producto

> Tomadas del código real (`assets/`, shells y `nav.js`). Útiles para argumentar la propuesta de valor en un landing.

- **Multi-tenant / multi-sucursal:** selector de sucursal post-login (A5) y CRUD de sucursales (B6).
- **Multi-rol:** Auth con 1 contraseña por usuario + Mesero con PIN; matriz de roles y permisos (B4).
- **Facturación electrónica DIAN homologada** vía MATIAS API (B17 + Integraciones).
- **Pasarelas locales:** Wompi (tarjeta, Nequi, PSE) y ePayco listadas en Integraciones.
- **Canales de delivery:** Rappi, Uber Eats, Didi Food, PedidosYa integrables desde el BO.
- **Comunicación al cliente:** WhatsApp Business y Mailgun.
- **Cocina en tiempo real:** KDS con temporizadores y estaciones.
- **Operación de sala:** POS web + App mesero con mapa de mesas compartido.
- **Cara al cliente sin app:** Storefront público + Carta QR para la mesa.
- **Nómina y adelantos salariales:** módulo completo para gestionar pagos quincenal/mensual, solicitar y aprobar adelantos con flujo de estados (`borrador → pendiente → aprobada → pagada → descontada`), comprobante PDF descargable. Salario mínimo Colombia 2026 (`$1.623.500`) como tope inferior siempre validado.
- **Pedido por voz (voice ordering):** el mesero dicta la comanda en voz natural desde `catalogo.html?mode=voice` usando `VoiceRecorder` (Web Speech API real, locale `es-CO`). La transcripción se guarda en `sessionStorage: root:voice:last-transcript` y se parsea con `VoiceParser` (fuzzy match + Levenshtein contra catálogo de 18 productos). La pantalla `audio-confirmar.html` (E14) muestra los ítems detectados para revisión antes de enviar a cocina.
- **Observaciones por voz (voice input mock):** en E6 (bottom-sheet modificadores) y E4 (editar observación de ítem en comanda), un botón de micrófono usa `VoiceInput` en modo simulado (array de 20 frases mock colombianas). Soporta tap-to-toggle y hold-to-record. Feature flag `USE_REAL_AUDIO = false` para upgrade futuro a MediaRecorder.
- **Diseño:** dark/light con toggle persistente (`localStorage`), mobile-first 360 → 1920px, accesibilidad (skip link, focus visibles, atajos de teclado).
- **Stack de la demo:** HTML + CSS + JS vanilla, sin build, sin frameworks. Íconos `lucide` por CDN, fuente `Inter`. PDF via `jsPDF` por CDN. Wordmark `[ROOT]` renderizado como texto CSS (`.root-wordmark` en `utilities.css`), sin imagen.

---

## Datos mock del restaurante demo

Para mantener consistencia si la landing muestra screenshots, el restaurante demo dentro de la app es **"El Buen Sabor"** (Bogotá):

- NIT mock: `900.123.456-7`
- Email mock: `contacto@buen-sabor.co`
- Teléfono mock: `+57 601 234 5678`
- Dirección mock: `Cra. 15 #80-32, Bogotá`
- Sede ejemplo: `Sede Norte`
- Productos ejemplo: Bandeja Paisa, Ajiaco Bogotano (SKU `AJB-001`), Limonada Natural
- Admin ejemplo: `Juan Camilo` (aparece en el saludo del dashboard)
- Personal de catálogo (BO): "68 productos · 5 categorías"; "12 usuarios · 5 roles asignados"; "5 roles definidos · 13 usuarios asignados"

**Datos del módulo de nómina (Sprint 13, todos ficticios):**
- 8 empleados: Camila Rojas, Andrés Martínez, Valentina Torres, Carlos Pedraza, Luisa Herrera, Diego Suárez, Mariana Ospina, Sebastián Castro
- 2 sucursales: Sede Norte (`suc-norte`), Sede Sur (`suc-sur`)
- Mesero logueado en la app: Camila Rojas (`emp-001`, quincenal, salario base $1.623.500, tope adelanto 50%)
- Salario mínimo de referencia: SMMLV Colombia 2026 = `$1.623.500`
- Persistencia: `localStorage` key `root:nomina:v1`
- Comprobante PDF: se genera con jsPDF, nombre `comprobante-adv-XXX.pdf`
- Estados de adelanto posibles: `borrador → pendiente → aprobada → pagada → descontada` (+ rama `rechazada` desde `pendiente`)

**Datos del store de mesas (`StoreMesas`, Sprint 14, `root:mesas:v1`):**
- 18 mesas en 3 salas: Salón Principal (mesas 1–10), Terraza (mesas 11–16), VIP (mesas 17–18)
- Estados posibles: `libre`, `ocupada`, `por-cobrar`, `reservada`, `limpieza`
- Meseros de referencia: Camila Rojas (`emp-001`), Andrés Moreno (`emp-002`), Valentina Cruz (`emp-003`)
- Seed incluye ítems de comanda reales (Bandeja Paisa, Ajiaco Bogotano, Limonada Natural, etc.)

**Persistencia completa de la demo (localStorage y sessionStorage):**
| Key | Storage | Módulo |
|-----|---------|--------|
| `root:auth:v1` | local | usuario logueado y rol activo |
| `root:users:v1` | local | lista de usuarios del negocio (derivada de `root:employees:v1`) |
| `root:roles:v1` | local | matriz de permisos por rol (overrides) |
| `root:nomina:v1` | local | nómina: empleados, adelantos, pagos |
| `root:employees:v1` | local | store unificado de empleados (fuente de verdad) |
| `root:mesas:v1` | local | estado de las 18 mesas y sus comandas |
| `sf-cart-v1` | local | carrito del storefront (sincroniza entre pestañas) |
| `root:voice:last-transcript` | session | última transcripción de voz (borrada al confirmar pedido) |
| `root:voice:permission-denied` | session | flag si el usuario denegó acceso al micrófono |

> Estos datos NO son del SaaS ROOT — son del negocio ficticio que vive dentro de la demo.

---

## Sprint 14 — Refactor visual + capa de roles (2026-05-17)

### Cambios visuales (Vercel aesthetic)
- **Tokens nuevos** en `tokens.css`: escala de superficies (`--bg-base/surface/elevated/overlay`), bordes Vercel (`--border-subtle/default/strong`), alias semánticos de estado (`--state-success/warning/danger/info`), fondos y bordes de badge translúcidos.
- **Radius actualizado**: `--radius-md: 10px`, `--radius-lg: 14px`, `--radius-xl: 20px`.
- **Dark mode**: colores de estado con menor saturación (`--success: #22C55E`, `--error: #F43F5E`, `--warning: #EAB308`, `--info: #60A5FA`).
- **KDS** (`kds.css`): bordes de tickets urgentes/nuevos/warn cambiados a `rgba` translúcidos (1px). Badge "NUEVO" con fondo translúcido.
- **Mesas** (`mesas.css`): fondos de cards de estado (ocupada, por cobrar, reservada) pasados a `rgba` translúcidos en ambos modos.
- **Auth** (`auth.css`): inputs usan `--radius-md`, focus state con glow morado, stepper con `padding-block` consistente.
- **Mesero mapa**: header sticky, tabs sticky en `top: 54px`, action sheet muestra "Mesa #N · Mesero".
- **POS mapa**: toggle Mapa/Lista movido al topbar, FAB reposicionado a bottom-right con ícono `table-2`.

### Sistema de autenticación y roles (`assets/js/auth.js`)
- **API**: `Auth.current()`, `Auth.can(perm)`, `Auth.login(user)`, `Auth.logout()`, `Auth.requireRole(role)`, `Auth.switchRole(role)`.
- **5 roles**: `admin`, `gerente`, `cajero`, `mesero`, `cocina` con permisos granulares.
- **Auto-inicialización**: si no existe `root:auth:v1` en localStorage, se inicia con usuario admin demo.
- **Switcher de rol** (DEMO_MODE): aparece en el dropdown del avatar de la topbar en todas las páginas (inyectado por `nav.js`).
- **Filtrado de sidebar**: rutas restringidas por rol se ocultan automáticamente. Rol `mesero` y `cocina` redirigen fuera del backoffice.
- **`data-requires`**: elementos con este atributo se ocultan si el rol no tiene el permiso.

### CRUD de usuarios (`backoffice/usuarios.html`)
- Persistencia en `root:users:v1` con seed de 12 usuarios.
- Drawer de editar (pre-cargado con datos del usuario seleccionado).
- Modal de confirmación para eliminar.
- Botón "Eliminar" solo visible si `Auth.can("users:delete")`.

### Matriz de roles (`backoffice/roles.html`)
- Celdas de permiso ahora tienen 3 estados: `check` (permitido), `eye` (solo lectura), `x` (bloqueado).
- Click en celda cicla entre estados y persiste en `root:roles:v1`.
- Drawer "Nuevo rol personalizado".

### Páginas de smoke test
- `test-tokens.html`: página de referencia que muestra todos los tokens (superficies, bordes, radius, sombras, badges, tipografía, botones y cards) en una sola pantalla.

### Documentación generada en Sprint 14
- `docs/design-system.md` — tokens Vercel completos (superficies, bordes, radius, sombras, estados) + reglas de aplicación.
- `docs/auth-roles.md` — API de `window.Auth`, matriz de permisos por rol, guía de uso y decisiones técnicas.
- `docs/sprint-14-qa.md` — smoke test de las 49 pantallas + pruebas de roles + bugs verificados.

### Módulos JS nuevos en Sprint 14
- **`assets/js/voice-parser.js`** — `window.VoiceParser`. Parsea una transcripción de voz a ítems del catálogo. Flujo: normalización → tokenización de números en palabras → segmentación por separadores (`y`, `,`, `con`, etc.) → extracción de cantidad → extracción de modificadores (`sin`, `extra`, `doble`, `con`) → fuzzy match con Levenshtein contra catálogo de 18 productos. Umbral de confianza: `0.6`. API: `VoiceParser.parse(transcripcion)` → `[{ sku, nombre, cantidad, precio, mods, confianza, noEncontrado, textoOriginal }]`.
- **`assets/js/voice-recorder.js`** — `window.VoiceRecorder`. Wrapper de la Web Speech API real (`SpeechRecognition`, locale `es-CO`, `continuous = true`, `interimResults = true`). Estados: `idle → requesting-permission → recording → processing → error`. Guarda flag de permiso denegado en `sessionStorage: root:voice:permission-denied`. API: `VoiceRecorder.isSupported()`, `start(opts)`, `stop()`, `cancel()`, `wasPermissionDenied()`.
- **`assets/js/store-mesas.js`** — `window.StoreMesas`. Store compartido de mesas, persistido en `root:mesas:v1`. Seed de 18 mesas (Salón Principal 1–10, Terraza 11–16, VIP 17–18). Emite Custom Events: `mesa-actualizada`, `comanda-creada`. API: `listMesas({ sala? })`, `getMesa(id)`, `addItemsAMesa(mesaId, items)`, `cambiarEstado(mesaId, estado)`, `liberar(mesaId)`, `_reset()`.
- **`assets/js/empleados.js`** — `window.Empleados`. Store unificado de empleados (`root:employees:v1`) que sincroniza automáticamente con `root:users:v1` y la sección `empleados` de `root:nomina:v1`. Valida salario ≥ SMMLV. API: `getAll()`, `getById()`, `getActivos()`, `crear()`, `actualizar()`, `desactivar()`, `activar()`, `eliminarPermanente()`, `puedeEliminar()`, `adelantosPendientes()`, `forceSyncNomina()`. Utilidades: `iniciales(nombre)`, `avatarColor(id)`.
- **`assets/js/storefront.js`** — `window.SF`. Carrito del storefront persistido en `sf-cart-v1`. Sincroniza entre pestañas vía evento `storage`. API: `addToCart()`, `removeFromCart()`, `clearCart()`, `totalItems()`, `totalPrice()`, `fmtCOP()`. Helpers de UI: `renderCartBar()` (barra flotante F1), `renderCartBtn()` (botón nav desktop F3/F4), `bounceCartBar()`.

### Persistencia usada en Sprint 14
- `root:auth:v1` — usuario logueado y rol activo
- `root:users:v1` — lista de usuarios del negocio (derivada de `root:employees:v1`)
- `root:roles:v1` — matriz de permisos por rol (overrides del default)
- `root:employees:v1` — store unificado de empleados (fuente de verdad)
- `root:mesas:v1` — estado de las 18 mesas y sus comandas

---

## Sprint 12 — Input por voz en observaciones (2026-05)

> Doc de referencia: `docs/sprint-12-audio-obs.md`

### Concepto clave
El audio es **solo un input alternativo al textarea** — no se conserva. El resultado es siempre texto plano que viaja como observación normal del ítem a la comanda y al KDS.

### Módulo JS: `assets/js/voice-input.js` (`window.VoiceInput`)
- **Modos:** hold-to-record (≥ 200ms) y tap-to-toggle (< 200ms inicia, segundo tap detiene).
- **Grabación corta (< 0.6s):** aborta sin transcribir, muestra toast `"Mantené presionado o tocá de nuevo para grabar"`.
- **Grabación válida:** spinner 400ms de "procesando", luego apenda texto random al textarea (separador `. ` si ya había texto). Toast `"Transcripción agregada"`.
- **20 frases mock** en español colombiano de restaurante (sin cebolla, bien cocido, para llevar, etc.).
- **Feature flag `USE_REAL_AUDIO = false`** — preparado para upgrade a MediaRecorder + API de transcripción sin cambiar la interfaz.
- **A11y:** `aria-pressed` y `aria-label` cambian dinámicamente. Timer con `role="timer"`. `prefers-reduced-motion` desactiva animaciones.
- **Mobile:** usa `PointerEvent` si está disponible; fallback a touch/mouse con `preventDefault()` para evitar doble disparo iOS.
- **API:** `attach(buttonEl, targetTextarea)`, `startRecording()`, `stopRecording()`, `cancelAll()`, `bindAll()`. Auto-inicialización via `[data-voice-input="textareaId"]`.

### Pantallas afectadas (Sprint 12)
- **`mesero/catalogo.html` (E6):** botón mic encima del textarea de observación en el bottom-sheet de modificadores. Id del textarea: `sheetObservacion`.
- **`mesero/detalle.html` (E4):** botón lápiz en cada ítem de la comanda abre un bottom-sheet `#sheetEditObs` con textarea `editObsTextarea` + botón mic. Pre-carga la observación actual, "Guardar" la actualiza y llama a `renderComanda()`.
