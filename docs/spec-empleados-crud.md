# Spec: Gestión completa de empleados — Backoffice ROOT

> **Para:** Claude Code  
> **Sprint:** 14 (puede ejecutarse en paralelo a los refactors visuales)  
> **Archivos principales:** `backoffice/usuarios.html`, `backoffice/nomina.html`, `assets/js/empleados.js` (nuevo)  
> **Stack:** HTML + CSS + JS vanilla, sin build, lucide CDN, Inter, tokens del DS ROOT  
> **Persistencia:** `localStorage` — keys `root:users:v1` y `root:nomina:v1`  
> **Accent:** `#4F46E5` (var(--accent))

---

## Contexto y problema

Hoy existen dos islas desconectadas:

| Isla | Archivo | Qué tiene |
|------|---------|-----------|
| Usuarios (B2) | `backoffice/usuarios.html` | "12 usuarios · 5 roles asignados" — tiene drawer crear/editar (B3) pero sin persistencia real ni conexión a nómina |
| Nómina (B9) | `backoffice/nomina.html` | 8 empleados hardcodeados: Camila Rojas, Andrés Martínez, Valentina Torres, Carlos Pedraza, Luisa Herrera, Diego Suárez, Mariana Ospina, Sebastián Castro |

**El problema:** crear un empleado en B2 no lo hace existir en nómina. Borrarlo en B2 no lo elimina de nómina. La configuración salarial (salario base, periodicidad, tope adelanto) vive hardcodeada en el HTML de nómina y no hay pantalla para editarla.

**Lo que falta:**
1. Un store unificado de empleados (`root:employees:v1`) que sea la fuente de verdad.
2. CRUD completo desde B2: agregar, editar, borrar empleado + generarle usuario en el sistema automáticamente.
3. Configuración de pago editable por empleado (salario base, periodicidad, sucursal, tope adelanto, método de pago).
4. B2 y B9 leen del mismo store — dejan de ser islas.

---

## Modelo de datos

### Store principal: `root:employees:v1`

```js
// Array de objetos. Este es el seed con los 8 empleados del Sprint 13.
[
  {
    // Identidad
    id: "emp-001",               // string, único, nunca reutilizar
    nombre: "Camila Rojas",
    email: "camila@buen-sabor.co",
    telefono: "+57 312 000 0001",
    documento: "1.234.567",      // CC o NIT
    fechaIngreso: "2023-03-15",  // ISO date string

    // Rol en el sistema
    rol: "mesero",               // admin | gerente | cajero | mesero | cocina
    pin: "1234",                 // Solo para roles mesero y cocina
    sucursales: ["sede-norte"],  // array de IDs de sucursal
    estado: "activo",            // activo | inactivo

    // Config de nómina
    nomina: {
      salarioBase: 1623500,       // número, en COP, mínimo SMMLV 2026
      periodicidad: "quincenal",  // quincenal | mensual
      metodoPago: "transferencia",// transferencia | efectivo | nequi
      topesAdelanto: 50,          // porcentaje del devengado, max 80
      banco: "Bancolombia",       // string libre, opcional
      numeroCuenta: "xxxx-1234",  // string libre, opcional
    },

    // Metadata
    creadoEn: "2024-01-10T10:00:00Z",
    actualizadoEn: "2025-11-01T09:30:00Z",
  },
  // ... 7 empleados más (ver seed completo al final)
]
```

### Store de usuario del sistema: `root:users:v1`

Sigue existiendo pero se genera automáticamente al crear un empleado. Contiene solo los datos de acceso, no los de nómina:

```js
[
  {
    userId: "usr-001",
    empleadoId: "emp-001",    // FK al store de empleados
    nombre: "Camila Rojas",
    email: "camila@buen-sabor.co",
    rol: "mesero",
    pin: "1234",
    sucursales: ["sede-norte"],
    estado: "activo",
  }
]
```

**Regla:** `root:users:v1` se deriva de `root:employees:v1`. Nunca editar users directamente — siempre a través del CRUD de empleados.

---

## Módulo JS nuevo: `assets/js/empleados.js`

Crear este archivo como el API central para gestión de empleados. Lo importan `usuarios.html` y `nomina.html`.

```js
// assets/js/empleados.js
// Fuente de verdad de empleados del sistema ROOT

const SMMLV_2026 = 1623500;

const Empleados = {

  // ── Lectura ─────────────────────────────────────────────────────────────
  getAll() {
    const raw = localStorage.getItem('root:employees:v1');
    if (!raw) { this._seed(); return this.getAll(); }
    return JSON.parse(raw);
  },

  getById(id) {
    return this.getAll().find(e => e.id === id) || null;
  },

  getActivos() {
    return this.getAll().filter(e => e.estado === 'activo');
  },

  // ── Escritura ────────────────────────────────────────────────────────────
  crear(datos) {
    const empleados = this.getAll();
    const nuevo = {
      id: `emp-${Date.now()}`,
      ...datos,
      estado: 'activo',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    // Validar salario mínimo
    if (nuevo.nomina.salarioBase < SMMLV_2026) {
      throw new Error(`El salario mínimo es $${SMMLV_2026.toLocaleString('es-CO')}`);
    }
    empleados.push(nuevo);
    this._save(empleados);
    this._syncUsers();
    return nuevo;
  },

  actualizar(id, cambios) {
    const empleados = this.getAll();
    const idx = empleados.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Empleado no encontrado');
    if (cambios.nomina?.salarioBase < SMMLV_2026) {
      throw new Error(`El salario mínimo es $${SMMLV_2026.toLocaleString('es-CO')}`);
    }
    empleados[idx] = {
      ...empleados[idx],
      ...cambios,
      nomina: { ...empleados[idx].nomina, ...(cambios.nomina || {}) },
      actualizadoEn: new Date().toISOString(),
    };
    this._save(empleados);
    this._syncUsers();
    return empleados[idx];
  },

  desactivar(id) {
    // Soft delete: marca como inactivo, nunca borra el historial de nómina
    return this.actualizar(id, { estado: 'inactivo' });
  },

  eliminarPermanente(id) {
    // Hard delete: solo si el empleado no tiene pagos ni adelantos registrados
    const nomina = JSON.parse(localStorage.getItem('root:nomina:v1') || '{}');
    const tienePagos = (nomina.pagos || []).some(p => p.empleadoId === id);
    const tieneAdelantos = (nomina.adelantos || []).some(a => a.empleadoId === id);
    if (tienePagos || tieneAdelantos) {
      throw new Error('Este empleado tiene historial de pagos. Usa "Desactivar" en su lugar.');
    }
    const empleados = this.getAll().filter(e => e.id !== id);
    this._save(empleados);
    this._syncUsers();
  },

  // ── Sync con root:users:v1 ───────────────────────────────────────────────
  _syncUsers() {
    const empleados = this.getAll();
    const users = empleados.map((e, i) => ({
      userId: `usr-${String(i + 1).padStart(3, '0')}`,
      empleadoId: e.id,
      nombre: e.nombre,
      email: e.email,
      rol: e.rol,
      pin: e.pin || null,
      sucursales: e.sucursales,
      estado: e.estado,
    }));
    localStorage.setItem('root:users:v1', JSON.stringify(users));
  },

  // ── Persistencia ─────────────────────────────────────────────────────────
  _save(empleados) {
    localStorage.setItem('root:employees:v1', JSON.stringify(empleados));
  },

  // ── Seed inicial ─────────────────────────────────────────────────────────
  _seed() {
    const seed = [
      {
        id: 'emp-001', nombre: 'Camila Rojas', email: 'camila@buen-sabor.co',
        telefono: '+57 312 000 0001', documento: '1.234.567',
        fechaIngreso: '2023-03-15', rol: 'mesero', pin: '1234',
        sucursales: ['sede-norte'], estado: 'activo',
        nomina: { salarioBase: 1623500, periodicidad: 'quincenal', metodoPago: 'transferencia', topesAdelanto: 50, banco: 'Bancolombia', numeroCuenta: 'xxxx-1234' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-002', nombre: 'Andrés Martínez', email: 'andres@buen-sabor.co',
        telefono: '+57 312 000 0002', documento: '2.345.678',
        fechaIngreso: '2022-07-01', rol: 'mesero', pin: '2345',
        sucursales: ['sede-norte'], estado: 'activo',
        nomina: { salarioBase: 1800000, periodicidad: 'mensual', metodoPago: 'nequi', topesAdelanto: 40, banco: '', numeroCuenta: '' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-003', nombre: 'Valentina Torres', email: 'valentina@buen-sabor.co',
        telefono: '+57 312 000 0003', documento: '3.456.789',
        fechaIngreso: '2023-10-01', rol: 'mesero', pin: '3456',
        sucursales: ['sede-sur'], estado: 'activo',
        nomina: { salarioBase: 1623500, periodicidad: 'quincenal', metodoPago: 'efectivo', topesAdelanto: 50, banco: '', numeroCuenta: '' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-004', nombre: 'Carlos Pedraza', email: 'carlos@buen-sabor.co',
        telefono: '+57 312 000 0004', documento: '4.567.890',
        fechaIngreso: '2021-05-15', rol: 'cajero', pin: null,
        sucursales: ['sede-norte', 'sede-sur'], estado: 'activo',
        nomina: { salarioBase: 2200000, periodicidad: 'mensual', metodoPago: 'transferencia', topesAdelanto: 30, banco: 'Davivienda', numeroCuenta: 'xxxx-5678' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-005', nombre: 'Luisa Herrera', email: 'luisa@buen-sabor.co',
        telefono: '+57 312 000 0005', documento: '5.678.901',
        fechaIngreso: '2023-01-10', rol: 'cocina', pin: '5678',
        sucursales: ['sede-norte'], estado: 'activo',
        nomina: { salarioBase: 1700000, periodicidad: 'quincenal', metodoPago: 'transferencia', topesAdelanto: 50, banco: 'Nequi', numeroCuenta: '' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-006', nombre: 'Diego Suárez', email: 'diego@buen-sabor.co',
        telefono: '+57 312 000 0006', documento: '6.789.012',
        fechaIngreso: '2022-09-20', rol: 'cocina', pin: '6789',
        sucursales: ['sede-sur'], estado: 'activo',
        nomina: { salarioBase: 1750000, periodicidad: 'mensual', metodoPago: 'efectivo', topesAdelanto: 45, banco: '', numeroCuenta: '' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-007', nombre: 'Mariana Ospina', email: 'mariana@buen-sabor.co',
        telefono: '+57 312 000 0007', documento: '7.890.123',
        fechaIngreso: '2024-02-01', rol: 'mesero', pin: '7890',
        sucursales: ['sede-sur'], estado: 'activo',
        nomina: { salarioBase: 1623500, periodicidad: 'quincenal', metodoPago: 'nequi', topesAdelanto: 50, banco: '', numeroCuenta: '' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
      {
        id: 'emp-008', nombre: 'Sebastián Castro', email: 'sebastian@buen-sabor.co',
        telefono: '+57 312 000 0008', documento: '8.901.234',
        fechaIngreso: '2020-11-03', rol: 'gerente', pin: null,
        sucursales: ['sede-norte', 'sede-sur'], estado: 'activo',
        nomina: { salarioBase: 3500000, periodicidad: 'mensual', metodoPago: 'transferencia', topesAdelanto: 20, banco: 'BBVA', numeroCuenta: 'xxxx-9012' },
        creadoEn: '2024-01-10T10:00:00Z', actualizadoEn: '2025-11-01T09:30:00Z',
      },
    ];
    this._save(seed);
    this._syncUsers();
  },
};
```

---

## Pantalla B2 — Usuarios (`backoffice/usuarios.html`)

### Layout actual vs layout nuevo

**Actual:** tabla estática con 12 filas hardcodeadas, drawer B3 no funcional, sin filtros reales, sin botón de eliminar.

**Nuevo:**

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: "Usuarios"  [Buscador]  [Filtro rol ▼]  [+ Nuevo empleado] │
├─────────────────────────────────────────────────────────────────┤
│ TABS: Activos (8) | Inactivos (0)                                │
├─────────────────────────────────────────────────────────────────┤
│ TABLA DE EMPLEADOS                                               │
│ Nombre + avatar iniciales | Rol badge | Sucursal | Salario | Acciones │
│ ──────────────────────────────────────────────────────────────── │
│ [Camila Rojas]  [mesero]  Sede Norte  $1.623.500  [Editar] [···] │
│ [Andrés M.]     [mesero]  Sede Norte  $1.800.000  [Editar] [···] │
│ ...                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Comportamiento del menú `[···]` (tres puntos) por fila

- **Ver detalle:** abre drawer de solo lectura con todos los campos.
- **Editar:** abre drawer editable.
- **Desactivar:** modal de confirmación → cambia `estado` a `inactivo`, lo mueve al tab "Inactivos". Siempre disponible.
- **Eliminar permanentemente:** solo aparece si el empleado NO tiene historial de pagos/adelantos. Modal de confirmación con texto: *"¿Eliminar a [nombre]? No podrá deshacerse. El historial de comandas y ventas se conserva."*

### Drawer "Nuevo empleado / Editar empleado"

Un solo drawer (B3) con tres secciones en tabs internos:

#### Tab 1 — Datos personales
```
Nombre completo *
Email *
Teléfono
Número de documento (CC)
Fecha de ingreso *
```

#### Tab 2 — Acceso al sistema
```
Rol *  [select: admin | gerente | cajero | mesero | cocina]
Sucursales asignadas  [multi-select: Sede Norte | Sede Sur]
PIN de acceso  [solo visible si rol = mesero o cocina]
  → input numérico de 4 dígitos
  → Helper: "El mesero usa este PIN para entrar a la app"
Estado  [toggle: Activo / Inactivo]
```

**Nota para Code:** cuando el rol sea `mesero` o `cocina`, mostrar el campo PIN. Para otros roles, ocultarlo con `display:none` — el acceso es por email+contraseña gestionado por el admin.

#### Tab 3 — Configuración de nómina
```
Salario base mensual *
  → Mínimo: $1.623.500 (SMMLV 2026), validado en tiempo real
  → Helper si está en mínimo: "Corresponde al SMMLV 2026"

Periodicidad de pago *  [segmented: Quincenal | Mensual]

Tope de adelanto  [slider 10%–80%, default 50%]
  → Preview: "Puede solicitar hasta $X de adelanto"

Método de pago  [select: Transferencia | Efectivo | Nequi]

Banco  [input texto, opcional, solo si método = Transferencia]
Número de cuenta  [input texto, opcional, solo si método = Transferencia]
```

### Acciones del drawer (footer)

**Creando:**
```
[Cancelar]                    [Crear empleado →]
```

**Editando:**
```
[Desactivar empleado]         [Guardar cambios →]
```

**Al guardar:**
1. Llama a `Empleados.crear(datos)` o `Empleados.actualizar(id, cambios)`.
2. `Empleados._syncUsers()` sincroniza `root:users:v1` automáticamente.
3. Toast: `UI.toast({ type: 'success', title: 'Empleado creado', subtitle: 'Ya aparece en nómina' })`.
4. Cierra drawer, actualiza tabla sin reload.

---

## Pantalla B9 — Nómina (`backoffice/nomina.html`)

### Cambio necesario

Hoy usa datos hardcodeados en el HTML. Migrar a leer de `Empleados.getActivos()` al inicializar.

```js
// Al inicio del script de nomina.html
document.addEventListener('DOMContentLoaded', () => {
  const empleados = Empleados.getActivos();
  renderTablaEmpleados(empleados);
  renderKPIs(empleados);
});

function renderTablaEmpleados(empleados) {
  // Reconstruir las filas de la tabla con datos reales del store
  // Misma estructura visual que hoy, solo fuente de datos cambia
}
```

### Link al detalle de empleado

Cada fila de nómina debe tener un link "Configurar" que abre el drawer de edición del empleado (Tab 3 de nómina). Esto reemplaza los datos hardcodeados por los del store.

---

## Pantalla de detalle por empleado (nueva — B9-detalle)

> Esta pantalla ya existe como `backoffice/nomina-empleado.html`. Si no existe, crearla.

### Qué muestra

```
┌────────────────────────────────────────────────┐
│ ← Volver a Nómina                              │
│                                                │
│  [Avatar]  Camila Rojas · Mesero               │
│            Sede Norte · Desde mar. 2023         │
│                                                │
│  RESUMEN DEL PERIODO                           │
│  ┌────────────┐ ┌───────────────┐ ┌──────────┐ │
│  │ Salario    │ │ Devengado     │ │ Próximo  │ │
│  │ $1.623.500 │ │ $811.750      │ │ 30 jun   │ │
│  └────────────┘ └───────────────┘ └──────────┘ │
│  Progreso del periodo: ████████░░ 62%           │
│                                                │
│  CONFIGURACIÓN DE PAGO                  [Editar]│
│  Periodicidad: Quincenal                        │
│  Método: Transferencia · Bancolombia xxxx-1234  │
│  Tope adelanto: 50% → hasta $405.875            │
│                                                │
│  ADELANTOS ACTIVOS                              │
│  [tabla de adelantos del empleado]              │
│                                                │
│  HISTORIAL DE PAGOS                             │
│  [tabla de pagos del empleado]                  │
└────────────────────────────────────────────────┘
```

El botón `[Editar]` en "Configuración de pago" abre el drawer del empleado directo en Tab 3 (nómina), sin pasar por B2.

---

## Estados vacíos

| Situación | Qué mostrar |
|-----------|-------------|
| Sin empleados activos en B2 | Ilustración + "Aún no tienes empleados. Crea el primero." + CTA "Nuevo empleado" |
| Sin empleados en tab Inactivos | "No hay empleados inactivos" (sin CTA) |
| Búsqueda sin resultados | "No encontramos empleados con ese nombre o email" |

---

## Validaciones y reglas de negocio

```
CREAR EMPLEADO:
- Nombre, email, rol, sucursal, fechaIngreso, salarioBase: requeridos
- Email: único en el sistema (verificar contra root:employees:v1)
- Salario base: >= SMMLV 2026 ($1.623.500)
- PIN: exactamente 4 dígitos numéricos (solo mesero/cocina)
- Tope adelanto: entre 10% y 80%

DESACTIVAR vs ELIMINAR:
- Desactivar: siempre disponible, reversible (toggle estado activo/inactivo)
- Eliminar permanente: solo si getHistorial(id) === vacío en root:nomina:v1
- Un empleado con adelantos en estado pendiente/aprobada NO puede desactivarse sin warning
  → Modal: "Este empleado tiene un adelanto pendiente de $X. ¿Quieres continuar?"

SINCRONIZACIÓN:
- Cualquier cambio en root:employees:v1 → triggerea _syncUsers() inmediatamente
- B9 Nómina siempre lee de Empleados.getActivos() al montar, nunca de datos hardcodeados
```

---

## Permisos por rol (aplicar con `Auth.can()` del Sprint 14 general)

| Acción | admin | gerente | cajero | mesero | cocina |
|--------|-------|---------|--------|--------|--------|
| Ver lista empleados | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear empleado | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar datos personales | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar config nómina | ✅ | ❌ | ❌ | ❌ | ❌ |
| Desactivar empleado | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar permanente | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver detalle nómina (todos) | ✅ | ✅ | ❌ | ❌ | ❌ |

Implementar con el atributo `data-requires`:
```html
<button data-requires="users:write" id="btn-nuevo-empleado">+ Nuevo empleado</button>
```

---

## Archivos a crear / modificar

| Acción | Archivo |
|--------|---------|
| **CREAR** | `assets/js/empleados.js` — store central |
| **MODIFICAR** | `backoffice/usuarios.html` — CRUD funcional con tabs, filtros, drawer completo |
| **MODIFICAR** | `backoffice/nomina.html` — leer de `Empleados.getActivos()`, agregar link "Configurar" por fila |
| **CREAR o verificar** | `backoffice/nomina-empleado.html` — detalle de empleado con config de pago editable |

---

## Orden de ejecución recomendado para Code

```
1. Crear empleados.js con el seed completo y todos los métodos
2. Modificar usuarios.html: tabla dinámica + tabs activos/inactivos + búsqueda + filtro
3. Construir el drawer B3 completo con los 3 tabs (datos / acceso / nómina)
4. Conectar botones: crear, editar, desactivar, eliminar con sus modales de confirmación
5. Modificar nomina.html para leer de Empleados.getActivos()
6. Crear o completar nomina-empleado.html con el detalle + configuración editable
7. Smoke test: crear empleado → verificar que aparece en nómina; desactivar → desaparece de activos
```

---

## Criterios de aceptación (Definition of Done)

- [ ] `Empleados.crear()` genera un empleado en `root:employees:v1` y su usuario en `root:users:v1` en el mismo call.
- [ ] El drawer de B2 tiene los 3 tabs (datos / acceso / nómina) y todos los campos validados.
- [ ] Un empleado creado aparece inmediatamente en la tabla de nómina sin reload.
- [ ] Desactivar un empleado lo mueve al tab "Inactivos" y desaparece de la tabla de nómina.
- [ ] Eliminar permanente solo funciona si el empleado no tiene historial. Si tiene, el botón muestra un tooltip explicativo y está deshabilitado.
- [ ] El slider de tope de adelanto calcula y muestra el monto en pesos en tiempo real (ej. "hasta $405.875").
- [ ] La validación del SMMLV es inline (no al submit): el campo se pone en error si el valor es menor.
- [ ] El PIN solo aparece si el rol seleccionado es mesero o cocina.
- [ ] `Auth.can("users:write")` controla visibilidad del botón "Nuevo empleado" y los menús de acción.
- [ ] Toast de confirmación al crear, editar y desactivar.
- [ ] Empty states funcionan en los tres casos descritos.
- [ ] No hay datos hardcodeados en `nomina.html` — todo viene de `Empleados.getActivos()`.
