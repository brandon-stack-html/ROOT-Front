# Flujos de la app — por rol de usuario

> Documento descriptivo, **alto nivel**. Refleja únicamente lo que está implementado hoy en HTML.
> Para ver los diagramas, ver [`diagramas-flujos.md`](./diagramas-flujos.md).

La demo tiene **7 módulos** y **~46 pantallas** repartidas entre 6 roles:

| Rol | Módulo | Punto de entrada |
|---|---|---|
| Cliente / Comensal | `storefront/` | `storefront/tienda.html` o `storefront/carta.html` |
| Cualquier empleado | `auth/` | `auth/login.html` |
| Cajero | `pos/` | `pos/apertura.html` |
| Mesero | `mesero/` | `mesero/login.html` |
| Cocinero | `kds/` | `kds/main.html` |
| Administrador / Dueño | `backoffice/` | `backoffice/dashboard.html` |

Además existe una **landing** (`index.html`) que sirve solo como índice de la demo: muestra los 7 módulos en grid para que el evaluador entre a cualquiera. No es parte de un flujo real de usuario.

---

## 1. Cliente / Comensal (público, sin login)

**Módulo:** `storefront/`
**Contexto:** Vista cara al cliente. Dos caminos: la **tienda online** (e-commerce con checkout) y la **carta digital** (lectura, sin compra, típicamente al escanear un QR en la mesa).

### 1.1 Flujo tienda online (compra)

```
tienda.html  →  tienda-catalogo.html  →  producto.html  →  checkout.html  →  confirmacion.html
```

- **`tienda.html`** — Landing comercial del restaurante (hero, secciones nosotros, sucursales, contacto).
- **`tienda-catalogo.html`** — Catálogo de productos para llevar/domicilio.
- **`producto.html`** — Detalle del producto y agregar al carrito.
- **`checkout.html`** — Datos del pedido y pago.
- **`confirmacion.html`** — Comprobante post-compra.

### 1.2 Flujo carta digital (lectura)

```
carta.html  →  producto.html?from=qr
```

- **`carta.html`** — Menú del local (acceso típico vía QR en mesa).
- **`producto.html`** — Detalle del plato (lectura, sin acción de compra desde QR).

---

## 2. Autenticación (transversal a todos los empleados)

**Módulo:** `auth/`
**Contexto:** Toda persona empleada entra por aquí. Una vez autenticada, según su rol cae en POS, Mesero, KDS o Backoffice.

```
login.html  ─┬─►  selector-sucursal.html  ─►  (módulo según rol)
             ├─►  recuperar.html  ─►  restablecer.html  ─►  login.html
             └─►  registro.html   ─►  registro-ok.html   ─►  login.html
```

- **`login.html`** — Entrada principal (email + contraseña).
- **`selector-sucursal.html`** — Si el usuario pertenece a varias sucursales, elige una antes de continuar.
- **`recuperar.html`** — Solicitar reset de contraseña.
- **`restablecer.html`** — Definir nueva contraseña.
- **`registro.html`** — Alta de cuenta nueva (típicamente solo admin/dueño).
- **`registro-ok.html`** — Confirmación de registro.

---

## 3. Cajero — POS Web

**Módulo:** `pos/`
**Contexto:** Punto de venta de escritorio para cajero. Maneja el turno (apertura/cierre), toma de pedidos por mesa, y reportes del día.

```
apertura.html  →  mapa.html  →  pedido.html?mesa=N  →  (cobro, vuelve al mapa)
                       │
                       └─►  historico.html  →  z-report.html
```

- **`apertura.html`** — Apertura de caja del turno (declaración de monto inicial).
- **`mapa.html`** — Mapa de mesas del local. Pantalla central del POS.
- **`pedido.html?mesa=N`** — Toma del pedido para una mesa específica (catálogo + carrito + cobro).
- **`historico.html`** — Pedidos del turno actual.
- **`z-report.html`** — Cierre de turno / informe Z.

---

## 4. Mesero — App móvil

**Módulo:** `mesero/`
**Contexto:** App móvil para meseros en piso. Es el módulo más extenso (13 pantallas) porque cubre toma de pedido (incluyendo dictado por voz), seguimiento, cobro, y gestión personal (nómina, adelantos, perfil).

### 4.1 Flujo principal: tomar y cobrar un pedido

```
login.html  →  sala.html  →  mapa.html  ─┬─►  detalle.html?mesa=N  ─►  catalogo.html?mesa=N  ─►  detalle.html
                                          │                                       │
                                          │                                       └─►  (modo voz) audio-confirmar.html
                                          │
                                          └─►  cobro.html?mesa=N  →  mapa.html
```

- **`login.html`** — Acceso del mesero.
- **`sala.html`** — Selector de sala antes del mapa (terraza, salón, etc.).
- **`mapa.html`** — Mapa de mesas de la sala elegida.
- **`detalle.html?mesa=N`** — Detalle del pedido activo en esa mesa.
- **`catalogo.html?mesa=N`** — Catálogo para agregar productos. Acepta query `mode=voice` o `mode=voice-add` para dictado.
- **`audio-confirmar.html`** — Confirmación de lo dictado por voz antes de agregarlo al pedido.
- **`cobro.html?mesa=N`** — Pantalla de cobro de la mesa.
- **`comandas.html`** — Listado de comandas en curso (vista alternativa al mapa).

### 4.2 Flujo lateral: gestión personal del mesero

Accesible desde el menú/tab del mesero:

```
perfil.html  ─┬─►  nomina.html
              ├─►  adelantos-historial.html  →  adelanto-solicitar.html
              └─►  pagos-historial.html
```

- **`perfil.html`** — Perfil del mesero.
- **`nomina.html`** — Nómina propia (vista mesero).
- **`adelantos-historial.html`** — Historial de adelantos solicitados.
- **`adelanto-solicitar.html`** — Solicitar un nuevo adelanto.
- **`pagos-historial.html`** — Historial de pagos recibidos.

---

## 5. Cocinero — KDS (Kitchen Display System)

**Módulo:** `kds/`
**Contexto:** Pantalla fija en cocina que muestra las comandas en tiempo real. Solo 2 pantallas: la principal y su configuración.

```
main.html  ⇄  config.html
```

- **`main.html`** — Cola de comandas activas, agrupadas por estado (en preparación / listas).
- **`config.html`** — Ajustes de la pantalla (estaciones, columnas, alertas).

---

## 6. Administrador / Dueño — Backoffice

**Módulo:** `backoffice/`
**Contexto:** Panel de administración (24 pantallas). Punto de entrada `dashboard.html`. Toda la navegación interna se hace por el sidebar definido en `backoffice/_layout.html`, así que las pantallas no son un flujo lineal sino áreas independientes agrupadas por función.

### 6.1 Hub

- **`dashboard.html`** — KPIs y accesos rápidos. Punto de entrada del rol admin tras login.

### 6.2 Catálogo de productos

```
catalogo.html  →  producto.html?nuevo=1  (o producto existente)
catalogo.html  →  categorias.html
catalogo.html  →  fichas.html
```

- **`catalogo.html`** — Listado de productos.
- **`producto.html`** — Alta/edición de producto.
- **`categorias.html`** — Gestión de categorías.
- **`fichas.html`** — Fichas técnicas / recetas.

### 6.3 Inventario y proveedores

```
inventario.html  →  conteo.html
proveedores.html
```

- **`inventario.html`** — Stock por sucursal.
- **`conteo.html`** — Conteo físico de inventario.
- **`proveedores.html`** — Listado y alta de proveedores.

### 6.4 Operación diaria

```
caja.html  →  (POS) historico.html?turno=T-NNN
mesas.html
sucursales.html
```

- **`caja.html`** — Cierres de caja por turno. Enlaza a `pos/historico.html?turno=…` para ver el detalle.
- **`mesas.html`** — Configuración del mapa de mesas del local.
- **`sucursales.html`** — Gestión de sucursales.

### 6.5 CRM y usuarios

```
clientes.html
usuarios.html  →  usuarios.html?edit=ID&tab=nomina
roles.html
```

- **`clientes.html`** — Base de clientes.
- **`usuarios.html`** — Usuarios del sistema (empleados).
- **`roles.html`** — Definición de roles y permisos.

### 6.6 Finanzas y contabilidad

```
gastos.html
contabilidad.html
reportes.html
facturacion-dian.html
```

- **`gastos.html`** — Registro de gastos.
- **`contabilidad.html`** — Vista contable.
- **`reportes.html`** — Reportes operativos y financieros.
- **`facturacion-dian.html`** — Facturación electrónica DIAN (Colombia).

### 6.7 Nómina y adelantos

```
nomina.html  ─┬─►  nomina-empleado.html  →  nomina-imprimible.html
              └─►  adelantos.html  →  adelanto-detalle.html?id=ID
```

- **`nomina.html`** — Liquidación de nómina del periodo.
- **`nomina-empleado.html`** — Nómina detallada de un empleado.
- **`nomina-imprimible.html`** — Versión imprimible del desprendible.
- **`adelantos.html`** — Solicitudes de adelanto (las que solicita el mesero en 4.2).
- **`adelanto-detalle.html`** — Aprobar / rechazar un adelanto.

### 6.8 Sistema

```
integraciones.html
configuracion.html
notificaciones.html
```

- **`integraciones.html`** — Conexiones con servicios externos.
- **`configuracion.html`** — Ajustes globales del negocio.
- **`notificaciones.html`** — Centro de notificaciones.

### 6.9 Saltos a otros módulos desde Backoffice

El admin tiene accesos directos a otros módulos para validar operación:

- `backoffice/*` → `pos/mapa.html` (ver POS)
- `backoffice/*` → `kds/main.html` (ver cocina)
- `backoffice/caja.html` → `pos/historico.html?turno=…` (auditar turno)

---

## Resumen de roles vs. módulos

| Rol | Módulos a los que entra |
|---|---|
| Cliente | `storefront/` |
| Cajero | `auth/` → `pos/` |
| Mesero | `auth/` → `mesero/` |
| Cocinero | `auth/` → `kds/` |
| Admin/Dueño | `auth/` → `backoffice/` (+ accesos a `pos/` y `kds/`) |
