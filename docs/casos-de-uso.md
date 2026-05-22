# Casos de Uso — ROOT (Inventario POS)

> Documento de especificación funcional de la aplicación ROOT, un SaaS para
> restaurantes en Colombia. Casos de uso extraídos del design system
> (`design-system/`) y de los docs de sprint (`docs/sprint-*.md`).
>
> **Fecha:** 2026-05-20
> **Versión:** 1.0
> **Cobertura:** 7 módulos, 50 pantallas, 66 casos de uso.

---

## 1. Convenciones

### 1.1 Formato de cada caso de uso

```
### CU-XXX-NN: Nombre del caso

| Campo            | Valor                                          |
|------------------|------------------------------------------------|
| Actor primario   | Quién ejecuta                                  |
| Actor secundario | Sistemas/terceros que participan               |
| Pantalla(s)      | Archivo(s) HTML donde ocurre                   |
| Permiso          | Permiso requerido (formato `recurso:accion`)   |

**Precondiciones:** Estado del sistema antes de iniciar.

**Flujo principal:**
1. Paso a paso del happy path.

**Flujos alternativos:**
- A1. Variación válida.

**Excepciones:**
- E1. Error o condición no válida.

**Postcondiciones:** Estado del sistema al terminar.

**Reglas de negocio asociadas:** RN-XX (ver §3).
```

### 1.2 Prefijos de ID

| Prefijo    | Módulo              |
|------------|---------------------|
| `CU-AUTH`  | Autenticación       |
| `CU-BO`    | Backoffice          |
| `CU-POS`   | POS Web             |
| `CU-MES`   | App Mesero          |
| `CU-KDS`   | KDS (cocina)        |
| `CU-SF`    | Storefront          |
| `CU-SYS`   | Transversales       |

---

## 2. Actores del sistema

Tomados de `assets/js/auth.js` y `docs/auth-roles.md`.

### 2.1 Actores humanos (roles)

| Rol         | Descripción                                                                                              | Acceso resumido                                                              |
|-------------|----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Admin**   | Dueño o socio. Control total del SaaS para su negocio.                                                   | Todo: Backoffice + POS + KDS + Mesero                                        |
| **Gerente** | Encargado operativo de una sucursal. No toca usuarios/roles/billing/integraciones.                       | Backoffice (sin Usuarios, Roles, Integraciones, DIAN) + POS + KDS            |
| **Cajero**  | Encargado de caja. Cobra, ve dashboard y reportes en read-only.                                          | POS + Dashboard, Caja, Reportes (read-only)                                  |
| **Mesero**  | Personal de sala. Levanta pedidos y consulta su nómina.                                                  | Solo App Mesero (redirigido fuera del backoffice)                            |
| **Cocina**  | Personal de cocina. Solo ve y atiende comandas.                                                          | Solo KDS                                                                     |
| **Cliente** | Comensal final que pide por carta QR o tienda online. No requiere cuenta.                                | Storefront                                                                   |

> Usuarios demo (`DEMO_USERS` en `auth.js`): Juan Camilo (admin), Ana Lucía (gerente), Miguel R. (cajero), Camila V. (mesero), Carlos F. (cocina).

### 2.2 Actores no humanos (sistemas externos)

| Sistema             | Rol en el caso                                            |
|---------------------|-----------------------------------------------------------|
| **MATIAS API**      | Facturación electrónica DIAN homologada                   |
| **Wompi / ePayco**  | Pasarelas de pago (tarjeta, Nequi, PSE)                   |
| **Rappi / Uber / Didi / PedidosYa** | Canales de delivery integrables                  |
| **WhatsApp Business / Mailgun** | Notificaciones al cliente                       |
| **Web Speech API**  | Reconocimiento de voz (locale `es-CO`) para dictado       |
| **jsPDF (CDN)**     | Generación de comprobantes de adelanto y reportes         |
| **LocalStorage / SessionStorage** | Persistencia local del estado de la demo    |

---

## 3. Reglas de negocio transversales

| ID    | Regla                                                                                                                                  |
|-------|----------------------------------------------------------------------------------------------------------------------------------------|
| RN-01 | Toda factura debe pasar por MATIAS API (homologado DIAN) antes de entregarse al cliente.                                               |
| RN-02 | Salario base mínimo permitido = SMMLV Colombia 2026 = `$1.623.500`. El sistema rechaza valores menores.                                |
| RN-03 | Monto máximo solicitable de adelanto = `% tope configurado × devengado actual del empleado`.                                           |
| RN-04 | Un mesero no puede tener más de **una** solicitud de adelanto en estado `pendiente` simultáneamente.                                   |
| RN-05 | Estados válidos de adelanto: `borrador → pendiente → aprobada → pagada → descontada`. Rama lateral: `pendiente → rechazada`.           |
| RN-06 | Estados válidos de mesa: `libre`, `ocupada`, `por-cobrar`, `reservada`, `limpieza`.                                                    |
| RN-07 | Una mesa `libre` puede transicionar a `ocupada` o `reservada`. Una `ocupada` solo a `por-cobrar` o `libre` (cancelación).              |
| RN-08 | El sistema es multi-sucursal: toda operación ocurre en el contexto de **una** sucursal activa (seleccionada en A5 post-login).         |
| RN-09 | El mesero accede con PIN numérico (4 dígitos). En la demo el PIN es `1234` y el usuario es Camila Rojas.                               |
| RN-10 | El turno de caja debe estar **abierto** para tomar pedidos o cobrar en POS. Se cierra con conteo final y diferencia visible.           |
| RN-11 | Los precios y descuentos siempre se muestran en COP, formato `$X.XXX` (locale `es-CO`).                                                |
| RN-12 | El KDS solo recibe comandas con al menos un ítem válido enviado desde POS, App Mesero o pedido por voz confirmado.                     |
| RN-13 | El carrito del storefront persiste entre pestañas (`sf-cart-v1`) y se vacía sólo al confirmar el pedido o explícitamente.              |
| RN-14 | Un pedido por voz no se envía a cocina si no contiene al menos un ítem reconocido con confianza ≥ `0.6`.                               |
| RN-15 | Toda observación del cliente (alergias, "sin cebolla", etc.) viaja en texto plano hasta el KDS; no se conserva el audio original.      |

---

# Módulo 1 — Auth (Acceso al sistema)

> Sprint 1. Shell con split panel (formulario + visual). 5 pantallas + selector de sucursal.

### CU-AUTH-01: Iniciar sesión

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente, Cajero                                         |
| Pantalla         | `auth/login.html` (A1)                                         |
| Permiso          | Público                                                        |

**Precondiciones:** El usuario tiene credenciales válidas (email + contraseña).

**Flujo principal:**
1. El actor abre `auth/login.html`.
2. Ingresa email y contraseña.
3. (Opcional) Marca el checkbox "Mantener sesión iniciada".
4. Pulsa "Iniciar sesión".
5. El sistema valida las credenciales y persiste la sesión en `localStorage:root:auth:v1`.
6. Si el negocio tiene **más de una** sucursal, redirige a `auth/selector-sucursal.html` (→ CU-AUTH-05).
7. Si tiene una sola sucursal, redirige al dashboard del Backoffice (→ CU-BO-01).

**Flujos alternativos:**
- A1. El usuario hace clic en "¿Olvidaste tu contraseña?" → CU-AUTH-03.
- A2. El usuario hace clic en "Registra tu negocio" → CU-AUTH-02.

**Excepciones:**
- E1. Credenciales inválidas → muestra toast `error` "Email o contraseña incorrectos" y deja el formulario.
- E2. Cuenta deshabilitada → toast `error` "Cuenta inactiva. Contactá al administrador".

**Postcondiciones:** `root:auth:v1` contiene `{userId, name, initials, role, permissions}`.

**Reglas asociadas:** RN-08.

---

### CU-AUTH-02: Registrar un negocio nuevo

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin (dueño/representante legal)                              |
| Pantalla         | `auth/registro.html` (A2)                                      |
| Permiso          | Público                                                        |

**Precondiciones:** El usuario no tiene cuenta previa en ROOT.

**Flujo principal:**
1. Abre `auth/registro.html`.
2. **Paso 1 — Datos del negocio:** ingresa nombre comercial, NIT (con hint "Sin dígito de verificación"), dirección, ciudad. Pulsa "Continuar".
3. **Paso 2 — Datos del admin:** nombre completo, email, contraseña, confirmación. Pulsa "Continuar".
4. **Paso 3 — Tipo de negocio:** selecciona vertical (restaurante / cafetería / bar / food truck). Pulsa "Crear cuenta".
5. El sistema crea el tenant, el usuario admin y una sucursal por defecto. Persiste y redirige al dashboard.

**Flujos alternativos:**
- A1. El usuario navega entre pasos con el stepper sin perder los datos ya ingresados.
- A2. "Ya tengo cuenta, iniciar sesión" → vuelve a A1.

**Excepciones:**
- E1. NIT ya registrado → toast `error` "Este NIT ya tiene cuenta en ROOT".
- E2. Email ya registrado → toast `error` "Este email ya está en uso".
- E3. Contraseñas no coinciden → marca el campo en rojo, no avanza.

**Postcondiciones:** Tenant creado, sesión iniciada como admin, sucursal por defecto generada.

---

### CU-AUTH-03: Solicitar recuperación de contraseña

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cualquier usuario con cuenta                                   |
| Actor secundario | Mailgun (envío del email)                                      |
| Pantalla         | `auth/recuperar.html` (A3)                                     |
| Permiso          | Público                                                        |

**Precondiciones:** El usuario olvidó su contraseña pero recuerda el email.

**Flujo principal:**
1. Abre `auth/recuperar.html` (vía link en A1).
2. Ingresa el email asociado.
3. Pulsa "Enviar link".
4. Sistema valida email, genera token de un solo uso y dispara correo a Mailgun.
5. Muestra confirmación: "Si el email existe, recibirás un link".

**Excepciones:**
- E1. Email vacío o con formato inválido → marca el campo y no envía.

**Postcondiciones:** Token de recuperación generado con TTL. Email enviado.

---

### CU-AUTH-04: Restablecer contraseña

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Usuario con token de recuperación válido                       |
| Pantalla         | `auth/restablecer.html` (A4)                                   |
| Permiso          | Público (con token)                                            |

**Precondiciones:** El usuario llegó por el link enviado en CU-AUTH-03 con token válido.

**Flujo principal:**
1. Abre `auth/restablecer.html?token=...`.
2. Ingresa nueva contraseña + confirmación.
3. Pulsa "Restablecer".
4. Sistema valida token, actualiza la contraseña, invalida el token y redirige a A1 con toast `success`.

**Excepciones:**
- E1. Token expirado → "Este link ya no es válido. Solicitá uno nuevo".
- E2. Contraseñas distintas → marca en rojo.
- E3. Contraseña débil (menos de 8 chars) → bloquea submit.

**Postcondiciones:** Contraseña actualizada, sesiones previas invalidadas.

---

### CU-AUTH-05: Seleccionar sucursal post-login

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente, Cajero (con acceso multi-sucursal)             |
| Pantalla         | `auth/selector-sucursal.html` (A5)                             |
| Permiso          | Sesión iniciada                                                |

**Precondiciones:** El usuario inició sesión y su negocio tiene ≥ 2 sucursales asignadas a él.

**Flujo principal:**
1. Sistema muestra la lista de sucursales disponibles para el usuario.
2. El actor selecciona una (ej. "Sede Norte").
3. Sistema fija la sucursal activa en la sesión y redirige al dashboard.

**Flujos alternativos:**
- A1. El usuario cambia de sucursal más tarde desde la topbar.

**Postcondiciones:** Sucursal activa fijada. Todas las consultas posteriores se filtran por ella.

**Reglas asociadas:** RN-08.

---

### CU-AUTH-06: Iniciar sesión como mesero (PIN)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/login.html` (E1)                                       |
| Permiso          | Público (con PIN)                                              |

**Precondiciones:** El mesero está registrado en el negocio y tiene PIN asignado.

**Flujo principal:**
1. Abre la app móvil del mesero (`mesero/login.html`).
2. Teclea su PIN de 4 dígitos en el teclado en pantalla.
3. Sistema valida y, si la sucursal tiene una sola sala, redirige a `mesero/mapa.html`. Si tiene varias, va a `mesero/sala.html` (→ CU-MES-01).

**Excepciones:**
- E1. PIN inválido → vibra el teclado, borra los dígitos.
- E2. 5 intentos fallidos → bloquea el dispositivo por 60 segundos.

**Postcondiciones:** Sesión de mesero activa.

**Reglas asociadas:** RN-09.

---

### CU-AUTH-07: Cerrar sesión y cambiar de rol (DEMO_MODE)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cualquier usuario                                              |
| Pantalla         | Dropdown del avatar (topbar global)                            |
| Permiso          | Sesión iniciada                                                |

**Precondiciones:** Hay un usuario logueado y `DEMO_MODE = true`.

**Flujo principal:**
1. El actor hace clic en su avatar en la topbar.
2. Se despliega el dropdown con los 5 roles demo + "Cerrar sesión".
3. Si elige un rol → `Auth.switchRole(role)` loguea como ese usuario demo y recarga.
4. Si elige "Cerrar sesión" → `Auth.logout()` limpia `root:auth:v1` y redirige a A1.

---

### CU-AUTH-08: Confirmar alta de negocio (post-registro)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin recién registrado                                        |
| Pantalla         | `auth/registro-ok.html`                                        |
| Permiso          | Sesión recién creada                                           |

**Precondiciones:** El registro de CU-AUTH-02 terminó con éxito.

**Flujo principal:**
1. Sistema muestra card de bienvenida con ícono de éxito y mensaje personalizado "¡Tu negocio ya está en ROOT! Hola, [nombre]".
2. Muestra dos CTAs:
   - **Primario:** "Ir al dashboard" → redirige a `backoffice/dashboard.html` (CU-BO-01).
   - **Ghost:** "Configurar mi negocio" → redirige a `backoffice/configuracion.html` (CU-BO-19) para completar logo, NIT y datos fiscales antes de operar.

**Postcondiciones:** El usuario entra al backoffice ya logueado como Admin.

---

# Módulo 2 — Backoffice (Administración)

> Sprints 2, 3, 4, 5 y 13. Shell con sidebar agrupado en Operación / Gestión / Nómina / Finanzas / Config + topbar con buscador y campana. 24 pantallas.

## 2.1 Operación

### CU-BO-01: Visualizar dashboard del negocio

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente, Cajero                                         |
| Pantalla         | `backoffice/dashboard.html` (B1)                               |
| Permiso          | `dashboard:read`                                               |

**Precondiciones:** Sesión iniciada con sucursal seleccionada.

**Flujo principal:**
1. Sistema muestra saludo dinámico ("Buenos días, [nombre]") y contexto ("Lunes, 15 de noviembre · Sede Norte").
2. Renderiza KPIs principales: ventas del día, ticket promedio, pedidos atendidos, mesas activas.
3. Muestra accesos rápidos a POS, KDS y Caja.

**Flujos alternativos:**
- A1. Cambia el rango de fecha (hoy / semana / mes).
- A2. Cambia de sucursal desde la topbar (recarga los KPIs).

**Postcondiciones:** Solo lectura. Sin cambios de estado.

---

### CU-BO-02: Consultar estado de caja y arqueos

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente, Cajero                                         |
| Pantalla         | `backoffice/caja.html` (B20)                                   |
| Permiso          | `cash:read`                                                    |

**Precondiciones:** Sesión activa.

**Flujo principal:**
1. Sistema lista turnos abiertos y cerrados de la sucursal.
2. Muestra para cada turno: cajero responsable, hora de apertura/cierre, conteo inicial/final, diferencia.
3. Permite ver el detalle de cualquier arqueo (entradas/salidas, denominaciones).

**Reglas asociadas:** RN-10.

---

### CU-BO-25: Centro de notificaciones

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/notificaciones.html`                               |
| Permiso          | Sesión activa                                                  |

**Precondiciones:** Existen eventos del sistema generados por otros módulos (adelantos solicitados, bajo stock, fallas de integración, etc.). El ícono de campana en la topbar también ofrece preview rápido desde cualquier pantalla.

**Flujo principal:**
1. El actor pulsa el ícono de notificaciones en la topbar o navega directo a `backoffice/notificaciones.html`.
2. Sistema muestra lista de notificaciones con tipo (info / warning / error / success), título, descripción, fecha relativa y estado leída/no leída.
3. El actor filtra con los chips: **Todas / No leídas / [por tipo]** (usa atributo `data-f` para cambiar `filtroActivo`).
4. Click en una notificación → la marca como leída y (si aplica) navega al detalle del evento (ej. solicitud de adelanto → CU-BO-14).
5. (Opcional) Pulsa **"Marcar todas como leídas"** → actualiza todas en una operación.

**Flujos alternativos:**
- A1. Si no hay notificaciones que cumplan el filtro, muestra empty state: "🔔 No hay notificaciones en esta categoría".

**Postcondiciones:** El contador de no leídas se actualiza en el ícono de la topbar.

---

## 2.2 Gestión

### CU-BO-03: Gestionar catálogo de productos (CRUD)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/catalogo.html` (B8), `backoffice/producto.html` (B9) |
| Permiso          | `catalog:*`                                                    |

**Precondiciones:** Existen categorías creadas (→ CU-BO-04).

**Flujo principal:**
1. En B8 el actor ve el grid de productos ("68 productos · 5 categorías").
2. Filtra por categoría o busca por nombre/SKU.
3. Pulsa "Nuevo producto" → abre B9.
4. Completa: nombre, SKU (ej. `AJB-001`), precio en COP, categoría, foto, descripción, modificadores.
5. Pulsa "Guardar". Sistema persiste y vuelve a B8 con toast `success`.

**Flujos alternativos:**
- A1. Click en producto existente → edita.
- A2. Acción "Duplicar" → crea copia con sufijo "(copia)".
- A3. Acción "Desactivar" → producto deja de aparecer en POS/storefront pero conserva histórico.

**Excepciones:**
- E1. SKU duplicado → toast `error` "El SKU ya existe".
- E2. Precio ≤ 0 → marca el campo en rojo.

**Reglas asociadas:** RN-11.

---

### CU-BO-04: Gestionar categorías

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/categorias.html` (B10)                             |
| Permiso          | `catalog:*`                                                    |

**Flujo principal:**
1. Lista categorías existentes.
2. Pulsa "Nueva categoría" → abre modal.
3. Ingresa nombre, color/ícono identificador.
4. Guarda. Sistema persiste y refresca la lista.

**Flujos alternativos:**
- A1. Editar nombre/orden por drag-and-drop.
- A2. Eliminar (solo si no tiene productos asignados).

---

### CU-BO-05: Controlar inventario de ingredientes

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/inventario.html` (B11)                             |
| Permiso          | `inventory:*`                                                  |

**Precondiciones:** Bodegas configuradas.

**Flujo principal:**
1. Sistema lista ingredientes con stock actual por bodega.
2. Marca en color de advertencia los ingredientes bajo stock mínimo.
3. El actor puede registrar entradas (compra a proveedor) o salidas (merma, ajuste).
4. Sistema actualiza el stock y registra movimiento auditado.

---

### CU-BO-06: Realizar conteo físico de inventario

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/conteo.html` (B12)                                 |
| Permiso          | `inventory:*`                                                  |

**Flujo principal:**
1. El actor pulsa "Nuevo conteo".
2. Sistema genera planilla con todos los ingredientes y stock teórico.
3. El actor digita el stock físico observado.
4. Pulsa "Confirmar conteo" → modal muestra diferencias por ingrediente.
5. Confirma → sistema ajusta stock y registra el conteo como ajuste auditado.

**Excepciones:**
- E1. Diferencias > 10% en cualquier ingrediente → requiere comentario obligatorio.

---

### CU-BO-07: Editar ficha técnica (receta) de un producto

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/fichas.html` (B13)                                 |
| Permiso          | `catalog:*`, `inventory:read`                                  |

**Precondiciones:** Producto e ingredientes existen.

**Flujo principal:**
1. Selecciona producto en la lista.
2. Drawer "Agregar ingrediente" muestra cantidad, unidad, merma (%) y costo unitario.
3. Repite por cada ingrediente.
4. Sistema calcula costo total del producto y margen vs. precio de venta.
5. Guarda.

**Flujos alternativos:**
- A1. Editar cantidad o merma de ingrediente existente.
- A2. Eliminar ingrediente de la ficha.

---

### CU-BO-08: Gestionar base de clientes

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/clientes.html` (B14)                               |
| Permiso          | `clients:*`                                                    |

**Flujo principal:**
1. Sistema lista clientes registrados.
2. Click en cliente → abre drawer detalle con tabs: **Datos** / **Pedidos** / **Fidelidad**.
3. El actor puede editar datos, ver histórico de pedidos y nivel de fidelidad.

**Flujos alternativos:**
- A1. "Nuevo cliente" → form de alta.
- A2. Eliminar (solo Admin; Gerente no puede).

---

### CU-BO-09: Gestionar proveedores

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/proveedores.html`                                  |
| Permiso          | `suppliers:*`                                                  |

**Flujo principal:**
1. Lista proveedores con NIT, contacto, categoría.
2. CRUD básico.

---

### CU-BO-10: Registrar y consultar gastos operativos

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/gastos.html` (B16)                                 |
| Permiso          | `expenses:*`                                                   |

**Flujo principal:**
1. Lista gastos con filtros por fecha y categoría.
2. Pulsa "Nuevo gasto" → modal con: fecha, categoría, proveedor (opcional), monto, comprobante (foto).
3. Guarda → impacta P&G de la sucursal.

---

## 2.3 Nómina (Sprint 13)

> Persistencia en `root:nomina:v1`. SMMLV Colombia 2026 = `$1.623.500`.

### CU-BO-11: Visualizar dashboard de nómina

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/nomina.html` (B23)                                 |
| Permiso          | `payroll:read`                                                 |

**Flujo principal:**
1. Sistema muestra 4 KPIs: total a pagar, adelantos pendientes, empleados activos, próximo corte.
2. Filtros por sucursal y periodicidad (quincenal/mensual).
3. Tabla con 8 empleados: salario base, devengado actual, adelantos del periodo, neto a pagar.

**Flujos alternativos:**
- A1. Pulsar "Registrar pago" → modal para cerrar la nómina del periodo manualmente (→ CU-BO-12).
- A2. Click en empleado → CU-BO-13.

---

### CU-BO-12: Registrar pago de nómina del periodo

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | Modal "Registrar pago" sobre B23                               |
| Permiso          | `payroll:write`                                                |

**Flujo principal:**
1. El actor abre el modal desde B23.
2. Selecciona periodo y método de pago.
3. Sistema calcula bruto, descuentos, adelantos del periodo y neto.
4. El actor confirma. Sistema persiste el pago y descuenta adelantos asociados (transiciones `aprobada → pagada` o `descontada` según corresponda).

**Excepciones:**
- E1. Hay adelantos pendientes sin resolver → advierte pero permite continuar.

**Reglas asociadas:** RN-05.

---

### CU-BO-13: Ver y editar detalle de empleado (nómina)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/nomina-empleado.html` (B24)                        |
| Permiso          | `payroll:write`                                                |

**Flujo principal:**
1. Sistema muestra tabs: **Datos** / **Adelantos** / **Pagos**.
2. **Datos:** form editable con salario base (validación ≥ SMMLV), periodicidad, % tope de adelanto (slider).
3. **Adelantos:** historial completo con badges de estado.
4. **Pagos:** historial cronológico.
5. Al guardar en **Datos** persiste y emite toast `success`.

**Excepciones:**
- E1. Salario base < SMMLV → bloquea guardar, toast `error` "El salario no puede ser menor al SMMLV ($1.623.500)".

**Reglas asociadas:** RN-02, RN-03.

---

### CU-BO-14: Aprobar o rechazar solicitud de adelanto

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/adelantos.html` (B25)                              |
| Permiso          | `payroll:write`                                                |

**Precondiciones:** Existe al menos una solicitud en estado `pendiente`.

**Flujo principal:**
1. Sistema muestra tabs por estado (Pendientes / Aprobadas / Pagadas / Rechazadas / Todas) con contadores.
2. El actor selecciona "Aprobar" en una fila → modal con monto editable (≤ tope) + nota.
3. Confirma → estado `pendiente → aprobada`. Toast `success` "Adelanto aprobado y notificado".

**Flujos alternativos:**
- A1. "Rechazar" → modal con motivo obligatorio. Estado `pendiente → rechazada`.

**Excepciones:**
- E1. Monto solicitado > tope dinámico → bloquea, muestra el máximo permitido.

**Reglas asociadas:** RN-03, RN-04, RN-05.

---

### CU-BO-15: Gestionar el ciclo de vida de un adelanto

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/adelanto-detalle.html` (B26)                       |
| Permiso          | `payroll:write`                                                |

**Flujo principal:**
1. Layout de dos columnas: timeline de transiciones (izquierda) + drawer con datos del empleado, contexto del periodo y acciones (derecha).
2. Según estado, las acciones disponibles son:
   - `aprobada` → "Marcar como pagada", "Descargar comprobante".
   - `pagada` → "Marcar como descontada".
   - cualquier estado final → solo "Descargar comprobante".
3. El comprobante se genera con jsPDF como `comprobante-adv-XXX.pdf`.

**Reglas asociadas:** RN-05.

---

### CU-BO-26: Generar comprobante imprimible de nómina

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Actor secundario | API del navegador `window.print()`                             |
| Pantalla         | `backoffice/nomina-imprimible.html`                            |
| Permiso          | `payroll:read`                                                 |

**Precondiciones:** Existe un pago de nómina registrado para un empleado en un periodo determinado (generado en CU-BO-12).

**Flujo principal:**
1. Desde B23 o B24, el actor pulsa "Ver comprobante" de un pago específico.
2. Se abre `nomina-imprimible.html` con los datos del pago precargados: empleado, periodo, conceptos (salario devengado, horas extra, etc.), deducciones, adelantos descontados, neto a pagar.
3. Si hubo adelantos en el periodo, el documento agrega la nota "Se descontaron adelantos aprobados por $X del devengado del periodo".
4. El actor pulsa "🖨 Imprimir / Guardar PDF" → dispara `window.print()` del navegador.
5. El usuario elige impresora física o "Guardar como PDF" desde el diálogo del navegador.

**Flujos alternativos:**
- A1. Layout ajustado con CSS `@media print` para evitar headers/sidebars en la salida final.

**Postcondiciones:** Comprobante generado para entrega al empleado.

**Reglas asociadas:** RN-02, RN-05.

---

## 2.4 Finanzas

### CU-BO-16: Consultar estado de facturación electrónica DIAN

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Actor secundario | MATIAS API                                                     |
| Pantalla         | `backoffice/facturacion-dian.html` (B17)                       |
| Permiso          | `billing:*`                                                    |

**Flujo principal:**
1. Sistema muestra estado de la integración con MATIAS API (Homologado).
2. Lista series y rangos de numeración autorizados.
3. Muestra contadores: facturadas, anuladas, rechazadas.
4. Permite ver el detalle de cualquier factura electrónica emitida.

**Reglas asociadas:** RN-01.

---

### CU-BO-17: Consultar reportes operativos

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente, Cajero                                         |
| Pantalla         | `backoffice/reportes.html` (B18)                               |
| Permiso          | `reports:read`                                                 |

**Flujo principal:**
1. Sistema muestra reportes predefinidos: ventas por categoría, top productos, performance de meseros, etc.
2. El actor pulsa "Generar reporte" → modal con filtros (rango, sucursal, categoría) y formato (PDF / Excel / CSV).
3. Sistema genera el archivo y dispara descarga.

**Flujos alternativos:**
- A1. Solo Admin y Gerente tienen `reports:export`; Cajero solo lectura.

---

### CU-BO-18: Consultar contabilidad

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Pantalla         | `backoffice/contabilidad.html`                                 |
| Permiso          | `billing:*`                                                    |

**Flujo principal:**
1. Sistema muestra estado contable: ingresos, gastos, P&G, libro de ventas, libro de compras.
2. Filtros por periodo.

---

## 2.5 Configuración

### CU-BO-19: Editar configuración general del negocio

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Pantalla         | `backoffice/configuracion.html` (B5)                           |
| Permiso          | `users:write`                                                  |

**Flujo principal:**
1. Form con: razón social, NIT, dirección fiscal, logo del negocio (PNG/JPG cuadrado mín 256×256), datos de contacto.
2. "Guardar cambios" persiste y muestra toast `success`.

**Reglas asociadas:** Los datos aparecen en las facturas electrónicas.

---

### CU-BO-20: Gestionar sucursales

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Pantalla         | `backoffice/sucursales.html` (B6)                              |
| Permiso          | `users:write`                                                  |

**Flujo principal:**
1. Lista sucursales del negocio con estado activo/inactivo.
2. CRUD: crear, editar, desactivar (no se eliminan para conservar histórico).

**Reglas asociadas:** RN-08.

---

### CU-BO-21: Configurar salas y mesas

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `backoffice/mesas.html` (B7)                                   |
| Permiso          | `tables:*`                                                     |

**Flujo principal:**
1. Sistema muestra las salas configuradas (ej. Salón Principal, Terraza, VIP).
2. El actor agrega/edita salas y dibuja el mapa lógico de mesas con capacidad por mesa.
3. Guarda → impacta POS Web (C2) y App Mesero (E3).

---

### CU-BO-22: Gestionar usuarios del negocio (CRUD)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Pantalla         | `backoffice/usuarios.html` (B2), drawer (B3)                   |
| Permiso          | `users:*`                                                      |

**Precondiciones:** Roles definidos (→ CU-BO-23).

**Flujo principal:**
1. Lista usuarios ("12 usuarios · 5 roles asignados") con avatar, rol, sucursales asignadas.
2. Pulsa "Nuevo usuario" → drawer B3 con: nombre, email, rol, sucursales, PIN (si rol = mesero).
3. Guarda → sistema persiste en `root:users:v1`, sincroniza con `root:employees:v1` y envía invitación.

**Flujos alternativos:**
- A1. Click en usuario → drawer en modo edición (pre-cargado).
- A2. "Eliminar" → modal de confirmación; solo visible con `users:delete`. Si el empleado tiene adelantos pendientes, bloquea.

---

### CU-BO-23: Editar matriz de roles y permisos

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Pantalla         | `backoffice/roles.html` (B4)                                   |
| Permiso          | `roles:write`                                                  |

**Flujo principal:**
1. Sistema muestra matriz: filas = recursos, columnas = roles.
2. Cada celda tiene 3 estados: `check` (permitido), `eye` (solo lectura), `x` (bloqueado).
3. Click en celda cicla entre estados y persiste en `root:roles:v1`.
4. "Nuevo rol personalizado" abre drawer para crear un rol custom.

**Postcondiciones:** Cambios surten efecto en el próximo `Auth.init()` del usuario afectado.

---

### CU-BO-24: Conectar/desconectar integraciones externas

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin                                                          |
| Actor secundario | Wompi, ePayco, Rappi, Uber Eats, Didi Food, PedidosYa, MATIAS API, WhatsApp Business, Mailgun |
| Pantalla         | `backoffice/integraciones.html` (B22)                          |
| Permiso          | `integrations:*`                                               |

**Flujo principal:**
1. Sistema muestra tarjetas de integraciones agrupadas por tipo (Pagos / Delivery / Fiscal / Comunicación) con estado "Conectado / Desconectado / Homologado".
2. El actor pulsa "Conectar" en una integración → drawer con credenciales requeridas.
3. Ingresa keys/tokens y guarda.
4. Sistema valida la conexión y persiste el estado.

**Flujos alternativos:**
- A1. "Configurar" en integración ya conectada → drawer de edición.
- A2. "Desconectar" → modal de confirmación.

---

# Módulo 3 — POS Web (Punto de venta)

> Sprint 6. Shell tablet/desktop con topbar y bottombar fijos. 4 pantallas + modal de cobro.

### CU-POS-01: Abrir turno de caja

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Pantalla         | `pos/apertura.html` (C1)                                       |
| Permiso          | `cash:*`                                                       |

**Precondiciones:** No hay turno abierto en la sucursal actual para ese cajero.

**Flujo principal:**
1. Sistema muestra "Abrir turno" con denominaciones de billetes y monedas COP.
2. El cajero digita la cantidad por denominación. Sistema suma total automáticamente.
3. (Opcional) agrega observaciones.
4. Pulsa "Abrir turno" → persiste, registra hora y monto inicial, redirige a C2.

**Excepciones:**
- E1. Ya hay turno abierto del mismo cajero → bloquea.

**Postcondiciones:** Turno activo. Operaciones de cobro habilitadas.

**Reglas asociadas:** RN-10.

---

### CU-POS-02: Visualizar mapa de mesas y abrir mesa

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Pantalla         | `pos/mapa.html` (C2)                                           |
| Permiso          | `pos:*`                                                        |

**Precondiciones:** Turno abierto.

**Flujo principal:**
1. Sistema muestra mapa en vivo con colores por estado (libre / ocupada / por cobrar / reservada / limpieza).
2. El actor pulsa una mesa libre → modal "Abrir mesa" para asignar mesero y comensales.
3. Confirma → mesa pasa a `ocupada` y abre C3.

**Flujos alternativos:**
- A1. Click en mesa `ocupada` → abre C3 directo en la cuenta existente.
- A2. Toggle Mapa/Lista en topbar para alternar vista.
- A3. FAB bottom-right para acciones rápidas.
- A4. "Cerrar turno" desde la topbar → modal con conteo final y diferencia.

**Reglas asociadas:** RN-06, RN-07, RN-10.

---

### CU-POS-03: Tomar pedido de una mesa

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Pantalla         | `pos/pedido.html` (C3)                                         |
| Permiso          | `orders:write`                                                 |

**Precondiciones:** Mesa abierta o se está abriendo.

**Flujo principal:**
1. Sistema muestra split layout: catálogo (izquierda) + cuenta de la mesa (derecha).
2. El actor busca producto o filtra por categoría.
3. Click en producto → si tiene modificadores, abre modal "Modificadores"; sino, se agrega directo a la cuenta.
4. En el modal el actor elige variantes/extras y observaciones, pulsa "Agregar".
5. La cuenta se actualiza con subtotal, impuestos, total.
6. Pulsa "Enviar a cocina" → comanda viaja al KDS (→ CU-KDS-01).

**Flujos alternativos:**
- A1. Editar cantidad o eliminar ítem desde la cuenta.
- A2. Pulsa "Cobrar" → abre modal de cobro (→ CU-POS-04).

**Reglas asociadas:** RN-12.

---

### CU-POS-04: Cobrar una cuenta (multi-método)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Actor secundario | Wompi / ePayco / MATIAS API                                    |
| Pantalla         | Modal C4 dentro de `pos/pedido.html`                           |
| Permiso          | `cash:*`, `billing:*`                                          |

**Precondiciones:** Hay al menos un ítem facturable en la cuenta.

**Flujo principal:**
1. Modal de cobro abre con total a pagar.
2. El actor selecciona método: efectivo / tarjeta / transferencia / mixto.
3. (Opcional) registra propina (% o monto fijo).
4. (Opcional) divide la cuenta entre comensales.
5. Si elige tarjeta → integra con Wompi/ePayco; si efectivo → calcula vuelto.
6. Pulsa "Cobrar" → sistema valida, factura vía MATIAS API y dispara impresión del ticket.
7. La mesa transiciona a `libre`. El cajón registra el ingreso.

**Excepciones:**
- E1. Falla pasarela de pago → muestra `error` y permite reintentar o cambiar método.
- E2. Falla MATIAS API → registra venta como "pendiente de homologar" y permite reintentar.

**Postcondiciones:** Mesa libre. Factura electrónica emitida. Movimiento de caja registrado.

**Reglas asociadas:** RN-01, RN-07, RN-10, RN-11.

---

### CU-POS-05: Consultar histórico de tickets del turno

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Pantalla         | `pos/historico.html` (C5)                                      |
| Permiso          | `cash:read`                                                    |

**Flujo principal:**
1. Sistema lista los tickets del turno actual con folio, mesa, mesero, total, método de pago.
2. Click en un ticket → modal "Detalle de ticket" con ítems, impuestos, factura electrónica.

**Flujos alternativos:**
- A1. Reimprimir ticket.
- A2. Generar nota crédito (solo Admin/Gerente).

---

### CU-POS-06: Cerrar turno

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Pantalla         | Modal "Cerrar turno" sobre C2                                  |
| Permiso          | `cash:*`                                                       |

**Precondiciones:** Turno abierto. Todas las mesas cerradas.

**Flujo principal:**
1. El actor abre el modal desde la topbar.
2. Sistema muestra resumen del turno: ventas, ingresos por método, propinas, descuentos.
3. El actor digita conteo final por denominaciones.
4. Sistema calcula diferencia vs. esperado.
5. Confirma cierre → turno pasa a cerrado, queda visible en B20.

**Excepciones:**
- E1. Hay mesas con estado distinto a `libre` → bloquea cierre, lista mesas pendientes.

**Reglas asociadas:** RN-10.

---

### CU-POS-07: Generar Z-Report (cierre fiscal del turno)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cajero, Gerente, Admin                                         |
| Actor secundario | `window.print()` (impresión / PDF), conciliación contable      |
| Pantalla         | `pos/z-report.html`                                            |
| Permiso          | `cash:*`                                                       |

**Precondiciones:** El turno se cerró correctamente con CU-POS-06 (existe consecutivo de cierre, ej. `#T-042`).

**Flujo principal:**
1. Al cerrar el turno, el sistema genera un consecutivo único de cierre y abre `pos/z-report.html` con todos los datos del turno cargados.
2. La pantalla muestra:
   - **Encabezado fiscal:** consecutivo, sucursal, cajero, fecha/hora de apertura y cierre, duración del turno.
   - **KPIs:** total bruto, total neto, número de tickets, propinas.
   - **Desglose por método de pago:** efectivo, tarjeta, transferencia, mixto.
   - **Arqueo:** ventas en efectivo + ingresos – salidas vs. conteo físico → diferencia.
   - **Sección de firmas de cierre** para cajero y supervisor.
   - **Footer:** "Consecutivo de cierre: #T-XXX · Para conciliación contable use este número."
3. El actor pulsa **"Imprimir Z-Report"** → `window.print()` dispara el diálogo del navegador.
4. Se imprime físicamente o se guarda como PDF para el archivo contable.

**Flujos alternativos:**
- A1. La pantalla puede reabrirse en cualquier momento desde B20 (Caja) consultando un turno cerrado, sin generar un nuevo consecutivo.

**Postcondiciones:** El Z-Report queda como evidencia fiscal del cierre del turno. El consecutivo es referenciable desde contabilidad.

**Reglas asociadas:** RN-01, RN-10, RN-11.

---

# Módulo 4 — App Mesero (Mobile)

> Sprints 7, 12, 13 y 14. Shell con frame mobile, bottom-tab de 4 ítems (Mesas / Comandas / Nómina / Perfil). Login por PIN. 14 pantallas + bottom-sheets.

### CU-MES-01: Seleccionar sala de trabajo

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/sala.html` (E2)                                        |
| Permiso          | `tables:*`                                                     |

**Precondiciones:** Login PIN exitoso (→ CU-AUTH-06) y sucursal con ≥ 2 salas.

**Flujo principal:**
1. Sistema muestra lista de salas disponibles (Salón Principal, Terraza, VIP).
2. Mesero selecciona una → redirige a E3 (mapa filtrado por esa sala).

**Flujos alternativos:**
- A1. Si solo hay una sala, salta esta pantalla y va directo a E3.

---

### CU-MES-02: Visualizar mapa de mesas (mobile)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/mapa.html` (E3)                                        |
| Permiso          | `tables:*`                                                     |

**Flujo principal:**
1. Sistema muestra el mapa táctil de la sala seleccionada.
2. Cada mesa muestra estado, número y (si aplica) nombre del mesero responsable.
3. Header sticky con sala activa; tabs sticky para alternar entre salas.
4. Click en mesa → action sheet con "Mesa #N · Mesero" y acciones (Abrir / Ver cuenta / Cobrar).

**Reglas asociadas:** RN-06.

---

### CU-MES-03: Consultar detalle y cuenta de una mesa

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/detalle.html` (E4)                                     |
| Permiso          | `tables:*`, `orders:write`                                     |

**Flujo principal:**
1. Sistema muestra cuenta actual: ítems, cantidad, modificadores, observaciones, total.
2. Sección "Comensales" con conteo y opción de editar.
3. Acciones: Agregar ítems (→ CU-MES-04), Cobrar (→ CU-MES-07), Editar observación de ítem.

**Flujos alternativos:**
- A1. Click en lápiz de un ítem → bottom-sheet `#sheetEditObs` para editar observación con textarea + botón mic (voz mock, → CU-MES-10).

---

### CU-MES-04: Agregar productos a una mesa (catálogo)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/catalogo.html` (E5)                                    |
| Permiso          | `orders:write`                                                 |

**Flujo principal:**
1. Sistema muestra catálogo con búsqueda y filtro por categoría.
2. Mesero selecciona producto.
3. Si tiene modificadores → bottom-sheet E6 (cantidad, variantes, observación con botón mic).
4. Confirma "Agregar" → ítem se agrega a la mesa (vía `StoreMesas.addItemsAMesa()`).
5. Mesero puede seguir agregando o pulsar "Enviar a cocina" para mandar la comanda al KDS.

**Flujos alternativos:**
- A1. Modo voz: `mesero/catalogo.html?mode=voice` activa grabador (→ CU-MES-05).

**Reglas asociadas:** RN-12.

---

### CU-MES-05: Tomar pedido por voz (dictado)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Actor secundario | Web Speech API (`SpeechRecognition`, locale `es-CO`)           |
| Pantalla         | `mesero/catalogo.html?mode=voice` → `mesero/audio-confirmar.html` (E14) |
| Permiso          | `orders:write`                                                 |

**Precondiciones:** Mesa abierta. Navegador soporta Web Speech API. Usuario otorgó permiso al micrófono.

**Flujo principal:**
1. Mesero activa el modo voz y dicta su comanda en español natural (ej. "dos bandejas paisas y una limonada sin azúcar").
2. `VoiceRecorder` graba en tiempo real (`continuous = true`, `interimResults = true`).
3. Mesero detiene grabación. Transcripción se guarda en `sessionStorage:root:voice:last-transcript`.
4. Redirige a E14 (`audio-confirmar.html`).
5. `VoiceParser.parse()` extrae ítems del catálogo (fuzzy match + Levenshtein, umbral `0.6`).
6. Sistema muestra:
   - Card colapsable con transcripción cruda.
   - Lista de ítems detectados con cantidad editable (+/-), precio y botón eliminar.
   - Ítems no reconocidos con badge amarillo "No encontrado" y link "Buscar en catálogo".
7. Mesero ajusta y pulsa "Enviar a cocina" → `StoreMesas.addItemsAMesa()` y redirige a E4.

**Flujos alternativos:**
- A1. "Volver a grabar" → descarta y reabre el grabador.
- A2. "Agregar ítem manual" → redirige a `catalogo.html`.

**Excepciones:**
- E1. Navegador no soporta Web Speech API → muestra fallback con campo de texto manual.
- E2. Permiso de micrófono denegado → guarda flag `root:voice:permission-denied` y muestra instrucciones.
- E3. Ningún ítem reconocido → "Enviar a cocina" deshabilitado.

**Postcondiciones:** Comanda agregada a la mesa. `sessionStorage:root:voice:last-transcript` borrada.

**Reglas asociadas:** RN-12, RN-14, RN-15.

---

### CU-MES-06: Consultar comandas activas

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/comandas.html` (E7)                                    |
| Permiso          | `orders:write`                                                 |

**Flujo principal:**
1. Sistema lista comandas del mesero actualmente en cocina/barra con estado y tiempo transcurrido.
2. Click en una comanda → detalle de ítems.

---

### CU-MES-07: Cobrar una mesa desde la app del mesero

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero (con autorización)                                      |
| Pantalla         | `mesero/cobro.html` (E8)                                       |
| Permiso          | `orders:write`                                                 |

**Flujo principal:**
1. Mesero pulsa "Cobrar" desde E4.
2. Sistema muestra resumen + selector de método de pago.
3. Confirma cobro.
4. Sistema delega el cobro real al POS (cajero finaliza el ticket) o cierra directamente según configuración del negocio.

**Reglas asociadas:** RN-01, RN-07.

---

### CU-MES-08: Consultar perfil del mesero

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/perfil.html` (E9)                                      |
| Permiso          | Sesión mesero                                                  |

**Flujo principal:**
1. Sistema muestra datos del mesero (nombre, iniciales, sucursal), propinas acumuladas del turno y opción de cerrar sesión.

---

### CU-MES-09: Consultar "Mi nómina"

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/nomina.html` (E10)                                     |
| Permiso          | `payroll:self`                                                 |

**Flujo principal:**
1. Sistema muestra hero card con countdown "Próximo pago en X días + fecha".
2. Salario base, devengado a la fecha, barra de progreso del periodo, periodicidad.
3. Botones: "Solicitar adelanto" y "Ver mis adelantos".

**Flujos alternativos:**
- A1. Si hay una solicitud `pendiente`, el botón "Solicitar adelanto" se bloquea con tooltip.

**Reglas asociadas:** RN-04.

---

### CU-MES-10: Solicitar un adelanto salarial

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/adelanto-solicitar.html` (E11)                         |
| Permiso          | `payroll:self`                                                 |

**Precondiciones:** No hay solicitud `pendiente` activa del mesero.

**Flujo principal:**
1. Sistema muestra slider de monto con tope dinámico (`% configurado × devengado actual`).
2. Preview "Te quedará $X disponible" se actualiza en vivo.
3. Mesero opcionalmente escribe motivo (textarea, 200 chars).
4. Pulsa "Enviar solicitud" → sistema valida, persiste como estado `pendiente` en `root:nomina:v1`, redirige a E10 con toast `success` "Solicitud enviada".

**Excepciones:**
- E1. Monto > tope → bloquea botón.
- E2. Hay solicitud pendiente → impide entrar a E11.

**Postcondiciones:** Solicitud queda en bandeja del admin/gerente (→ CU-BO-14).

**Reglas asociadas:** RN-03, RN-04, RN-05.

---

### CU-MES-11: Consultar mis adelantos y descargar comprobante

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Actor secundario | jsPDF                                                          |
| Pantalla         | `mesero/adelantos-historial.html` (E12)                        |
| Permiso          | `payroll:self`                                                 |

**Flujo principal:**
1. Sistema muestra lista cronológica descendente de adelantos con badges de estado por color.
2. Click en un adelanto → bottom-sheet con detalle + timeline de transiciones.
3. Si el estado es `pagada` o `descontada` → botón "Descargar comprobante" genera PDF `comprobante-adv-XXX.pdf` con jsPDF.

**Reglas asociadas:** RN-05.

---

### CU-MES-12: Consultar historial de pagos

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | `mesero/pagos-historial.html` (E13)                            |
| Permiso          | `payroll:self`                                                 |

**Flujo principal:**
1. Sistema muestra resumen acumulado (cantidad de pagos, bruto total, neto total).
2. Lista agrupada por mes con headers sticky.
3. Cada ítem: etiqueta del periodo, fecha, método y neto destacado.
4. Click en un pago → bottom-sheet con desglose bruto / descuentos / neto.

---

### CU-MES-13: Dictar observación por voz (en modificadores o edición)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Mesero                                                         |
| Pantalla         | Bottom-sheet E6 (`catalogo.html`) o sheet edit obs (`detalle.html`) |
| Permiso          | `orders:write`                                                 |

**Flujo principal:**
1. Mesero tiene un textarea de observación abierto.
2. Pulsa o mantiene el botón de mic (hold-to-record ≥ 200ms o tap-to-toggle).
3. Sistema graba (modo mock con `USE_REAL_AUDIO = false`).
4. Al terminar, spinner 400ms y appendea texto random (de 20 frases mock) al textarea.
5. Toast `success` "Transcripción agregada".

**Flujos alternativos:**
- A1. Grabación < 0.6s → aborta sin transcribir, toast `info` "Mantené presionado o tocá de nuevo para grabar".
- A2. Tap-to-toggle: primer tap inicia, segundo tap detiene.

**Reglas asociadas:** RN-15.

---

# Módulo 5 — KDS (Cocina)

> Sprint 8. Shell dark por defecto, layout pensado para TV/tablet de pared. 2 pantallas.

### CU-KDS-01: Atender tablero de comandas

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cocina (cocinero, barista)                                     |
| Pantalla         | `kds/main.html` (D1)                                           |
| Permiso          | `kds:*`                                                        |

**Precondiciones:** Hay comandas enviadas desde POS o App Mesero.

**Flujo principal:**
1. Sistema muestra tickets en columnas por estación con temporizador desde envío.
2. Tickets nuevos aparecen con badge "NUEVO" y resaltado.
3. Cocinero toca un ticket para marcarlo "en preparación" → color cambia.
4. Toca de nuevo para marcarlo "listo" → ticket sale del tablero y notifica al mesero.

**Flujos alternativos:**
- A1. Filtrar por estación.
- A2. Reabrir un ticket cerrado por error.

**Excepciones:**
- E1. Ticket excede tiempo de alerta configurado → cambia a color de urgencia.

**Reglas asociadas:** RN-12.

---

### CU-KDS-02: Configurar KDS (estaciones y alertas)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Admin, Gerente                                                 |
| Pantalla         | `kds/config.html` (D2)                                         |
| Permiso          | `kds:*`                                                        |

**Flujo principal:**
1. Modal overlay con configuración: estaciones (Cocina caliente / Cocina fría / Barra), tiempos de alerta amarillo/rojo, layout de columnas.
2. Guarda → se aplica en D1 inmediatamente.

---

# Módulo 6 — Storefront (Cliente final)

> Sprint 9. Carta QR (mobile) + tienda online (mobile y desktop). Marca demo "El Buen Sabor". 6 pantallas.

### CU-SF-01: Consultar carta vía QR en mesa

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Pantalla         | `storefront/carta.html` (F1)                                   |
| Permiso          | Público                                                        |

**Precondiciones:** El cliente escaneó el QR de su mesa.

**Flujo principal:**
1. Sistema muestra carta filtrada por sucursal/sala/mesa con categorías y productos.
2. Cliente navega y consulta precios. **No hay checkout** desde la carta QR (es solo informativa).
3. Click en producto → detalle (F2).

**Flujos alternativos:**
- A1. Click en CTA "Pedir ahora" lleva al storefront online (F3).

---

### CU-SF-02: Ver detalle de producto desde la carta QR

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Pantalla         | `storefront/producto.html` (F2)                                |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Sistema muestra foto, descripción, precio, alérgenos, modificadores del producto (ej. "Ajiaco Bogotano").

---

### CU-SF-03: Navegar la tienda online (home)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Pantalla         | `storefront/tienda.html` (F3)                                  |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Sistema muestra home pública del restaurante: hero, categorías destacadas, nav "Inicio · Carta · Sucursales · Nosotros · Contacto".
2. CTA "Pedir ahora" lleva al catálogo (F4).

---

### CU-SF-04: Agregar productos al carrito

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Pantalla         | `storefront/tienda-catalogo.html` (F4)                         |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Sistema muestra catálogo con búsqueda, filtros y carrito lateral.
2. Cliente busca producto y pulsa "Agregar" → `SF.addToCart()` persiste en `sf-cart-v1`.
3. Carrito flotante / barra muestra cantidad y total.
4. Carrito se sincroniza entre pestañas vía evento `storage`.

**Flujos alternativos:**
- A1. Editar cantidad o eliminar ítem desde el carrito.
- A2. "Ir a pagar" → checkout (F5).

**Reglas asociadas:** RN-11, RN-13.

---

### CU-SF-05: Finalizar compra (checkout)

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Actor secundario | Wompi / ePayco, MATIAS API                                     |
| Pantalla         | `storefront/checkout.html` (F5)                                |
| Permiso          | Público                                                        |

**Precondiciones:** Carrito con al menos un ítem.

**Flujo principal:**
1. Sistema muestra: datos del cliente (nombre, teléfono, email), dirección de entrega, tipo (delivery / recoger en sucursal), método de pago, resumen del pedido.
2. Cliente completa los datos.
3. Pulsa "Confirmar pedido" → sistema valida, cobra vía pasarela, factura vía MATIAS API.
4. Redirige a F6.

**Excepciones:**
- E1. Falla pasarela → permite reintentar.
- E2. Dirección fuera de zona de cobertura → bloquea con mensaje.

**Postcondiciones:** Carrito vaciado. Pedido visible en BO y comanda enviada al KDS.

**Reglas asociadas:** RN-01, RN-11, RN-12, RN-13.

---

### CU-SF-06: Confirmar pedido y consultar tracking

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cliente                                                        |
| Pantalla         | `storefront/confirmacion.html` (F6)                            |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Sistema muestra "¡Pedido confirmado!" con número de orden, tiempos estimados y estado actual.
2. (Opcional) link de tracking del pedido.

---

# Módulo 7 — Capacidades transversales

### CU-SYS-01: Buscar pantallas con atajo global

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cualquier usuario autenticado                                  |
| Pantalla         | Modal global (cualquier pantalla con `nav.js`)                 |
| Permiso          | Sesión activa                                                  |

**Flujo principal:**
1. Usuario presiona `Ctrl+K` (Windows/Linux) o `Cmd+K` (Mac).
2. Sistema abre modal de búsqueda global de pantallas.
3. Usuario escribe nombre y selecciona resultado → navega.

---

### CU-SYS-02: Alternar tema claro/oscuro

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Cualquier usuario                                              |
| Pantalla         | Toggle en topbar (todas)                                       |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Usuario pulsa el toggle.
2. Sistema persiste preferencia en `localStorage` y aplica al `<html>`.

---

### CU-SYS-03: Skip link de accesibilidad

| Campo            | Valor                                                          |
|------------------|----------------------------------------------------------------|
| Actor primario   | Usuario con tecnología asistiva                                |
| Pantalla         | Todas                                                          |
| Permiso          | Público                                                        |

**Flujo principal:**
1. Usuario navega con Tab.
2. Aparece link "Saltar al contenido principal".
3. Activarlo coloca el foco en el `<main>` saltando navegación.

---

## 4. Trazabilidad — Pantalla ↔ Caso de uso

| Pantalla                                            | Caso(s) de uso                          |
|-----------------------------------------------------|-----------------------------------------|
| `auth/login.html` (A1)                              | CU-AUTH-01                              |
| `auth/registro.html` (A2)                           | CU-AUTH-02                              |
| `auth/registro-ok.html`                             | CU-AUTH-08                              |
| `auth/recuperar.html` (A3)                          | CU-AUTH-03                              |
| `auth/restablecer.html` (A4)                        | CU-AUTH-04                              |
| `auth/selector-sucursal.html` (A5)                  | CU-AUTH-05                              |
| `mesero/login.html` (E1)                            | CU-AUTH-06                              |
| `backoffice/dashboard.html` (B1)                    | CU-BO-01                                |
| `backoffice/caja.html` (B20)                        | CU-BO-02                                |
| `backoffice/notificaciones.html`                    | CU-BO-25                                |
| `backoffice/catalogo.html` (B8), `producto.html` (B9) | CU-BO-03                              |
| `backoffice/categorias.html` (B10)                  | CU-BO-04                                |
| `backoffice/inventario.html` (B11)                  | CU-BO-05                                |
| `backoffice/conteo.html` (B12)                      | CU-BO-06                                |
| `backoffice/fichas.html` (B13)                      | CU-BO-07                                |
| `backoffice/clientes.html` (B14)                    | CU-BO-08                                |
| `backoffice/proveedores.html`                       | CU-BO-09                                |
| `backoffice/gastos.html` (B16)                      | CU-BO-10                                |
| `backoffice/nomina.html` (B23)                      | CU-BO-11, CU-BO-12                      |
| `backoffice/nomina-empleado.html` (B24)             | CU-BO-13                                |
| `backoffice/nomina-imprimible.html`                 | CU-BO-26                                |
| `backoffice/adelantos.html` (B25)                   | CU-BO-14                                |
| `backoffice/adelanto-detalle.html` (B26)            | CU-BO-15                                |
| `backoffice/facturacion-dian.html` (B17)            | CU-BO-16                                |
| `backoffice/reportes.html` (B18)                    | CU-BO-17                                |
| `backoffice/contabilidad.html`                      | CU-BO-18                                |
| `backoffice/configuracion.html` (B5)                | CU-BO-19                                |
| `backoffice/sucursales.html` (B6)                   | CU-BO-20                                |
| `backoffice/mesas.html` (B7)                        | CU-BO-21                                |
| `backoffice/usuarios.html` (B2, B3)                 | CU-BO-22                                |
| `backoffice/roles.html` (B4)                        | CU-BO-23                                |
| `backoffice/integraciones.html` (B22)               | CU-BO-24                                |
| `pos/apertura.html` (C1)                            | CU-POS-01                               |
| `pos/mapa.html` (C2)                                | CU-POS-02, CU-POS-06                    |
| `pos/pedido.html` (C3, C4)                          | CU-POS-03, CU-POS-04                    |
| `pos/historico.html` (C5)                           | CU-POS-05                               |
| `pos/z-report.html`                                 | CU-POS-07                               |
| `mesero/sala.html` (E2)                             | CU-MES-01                               |
| `mesero/mapa.html` (E3)                             | CU-MES-02                               |
| `mesero/detalle.html` (E4)                          | CU-MES-03, CU-MES-13                    |
| `mesero/catalogo.html` (E5, E6)                     | CU-MES-04, CU-MES-13                    |
| `mesero/audio-confirmar.html` (E14)                 | CU-MES-05                               |
| `mesero/comandas.html` (E7)                         | CU-MES-06                               |
| `mesero/cobro.html` (E8)                            | CU-MES-07                               |
| `mesero/perfil.html` (E9)                           | CU-MES-08                               |
| `mesero/nomina.html` (E10)                          | CU-MES-09                               |
| `mesero/adelanto-solicitar.html` (E11)              | CU-MES-10                               |
| `mesero/adelantos-historial.html` (E12)             | CU-MES-11                               |
| `mesero/pagos-historial.html` (E13)                 | CU-MES-12                               |
| `kds/main.html` (D1)                                | CU-KDS-01                               |
| `kds/config.html` (D2)                              | CU-KDS-02                               |
| `storefront/carta.html` (F1)                        | CU-SF-01                                |
| `storefront/producto.html` (F2)                     | CU-SF-02                                |
| `storefront/tienda.html` (F3)                       | CU-SF-03                                |
| `storefront/tienda-catalogo.html` (F4)              | CU-SF-04                                |
| `storefront/checkout.html` (F5)                     | CU-SF-05                                |
| `storefront/confirmacion.html` (F6)                 | CU-SF-06                                |
| Global (nav.js)                                     | CU-AUTH-07, CU-SYS-01, CU-SYS-02, CU-SYS-03 |

---

## 5. Trazabilidad — Rol ↔ Casos de uso accesibles

| Rol          | Casos de uso accesibles                                                                                                       |
|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Admin**    | Todos los CU-AUTH (excepto CU-AUTH-06), todos los CU-BO (incluye CU-BO-25/26), todos los CU-POS (incluye CU-POS-07), todos los CU-KDS, todos los CU-SYS |
| **Gerente**  | CU-AUTH-01/03/04/05/07, CU-BO-01 a CU-BO-15, CU-BO-17, CU-BO-20/21, CU-BO-25, CU-BO-26, todos los CU-POS, todos los CU-KDS, CU-SYS-* |
| **Cajero**   | CU-AUTH-01/03/04/05/07, CU-BO-01, CU-BO-02, CU-BO-17 (read), todos los CU-POS (incluye CU-POS-07), CU-SYS-*                  |
| **Mesero**   | CU-AUTH-06, CU-AUTH-07, todos los CU-MES, CU-SYS-*                                                                            |
| **Cocina**   | CU-AUTH-01 (limitado), CU-AUTH-07, todos los CU-KDS, CU-SYS-*                                                                 |
| **Cliente**  | Todos los CU-SF (no requiere login)                                                                                           |

---

## 6. Anexo — Diagrama de estados clave

### 6.1 Estados de una mesa (RN-06, RN-07)

```
        ┌────────────┐
        │   libre    │◄──────────────┐
        └─────┬──────┘               │
              │ abrir mesa            │ cobrar
              ▼                       │
        ┌────────────┐         ┌──────┴──────┐
        │  ocupada   │────────►│ por-cobrar  │
        └─────┬──────┘         └─────────────┘
              │ reservar
              ▼
        ┌────────────┐
        │ reservada  │
        └────────────┘
```

(Estado `limpieza` aplicable entre `por-cobrar → libre` en flujos de limpieza profunda.)

### 6.2 Estados de un adelanto salarial (RN-05)

```
              ┌──────────┐
              │ borrador │
              └────┬─────┘
                   │ enviar
                   ▼
              ┌──────────┐  rechazar  ┌────────────┐
              │ pendiente├───────────►│ rechazada  │
              └────┬─────┘            └────────────┘
                   │ aprobar
                   ▼
              ┌──────────┐
              │ aprobada │
              └────┬─────┘
                   │ pagar
                   ▼
              ┌──────────┐
              │  pagada  │
              └────┬─────┘
                   │ descontar
                   ▼
              ┌────────────┐
              │ descontada │
              └────────────┘
```

### 6.3 Estados del turno de caja (RN-10)

```
   ┌─────────┐ apertura ┌─────────┐ cierre ┌─────────┐
   │ cerrado ├─────────►│ abierto ├───────►│ cerrado │
   └─────────┘          └─────────┘        └─────────┘
                                                 │
                                                 ▼
                                          visible en B20
```

---

> **Mantenimiento:** este documento debe actualizarse cuando:
> - Se agregue/elimine una pantalla en `design-system/`.
> - Cambien permisos en `assets/js/auth.js`.
> - Se modifique una regla de negocio listada en §3.
