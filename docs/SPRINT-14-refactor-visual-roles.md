# Sprint 14 — Refactor visual + capa de roles

> **Contexto:** ROOT (SaaS multi-tenant restaurantes Colombia). Stack: HTML + CSS + JS vanilla, sin build. Íconos lucide CDN, Inter, accent `#4F46E5`. Persistencia `localStorage`.
> **Sprint anterior:** Sprint 13 — Nómina y adelantos.
> **Duración estimada:** 2 semanas (10 días hábiles).
> **Objetivo:** elevar la calidad visual a nivel Vercel (oscuro minimal con morado de identidad), arreglar deuda visual acumulada en 6 pantallas, y agregar la capa de roles que falta (CRUD empleados + filtrado real de UI por rol logueado).

---

## 1. Objetivos del sprint

### Objetivo 1 — Refactor de tokens base (estética Vercel)
Bajar la saturación general, dar más respiro, jerarquía tipográfica más marcada, sombras menos planas, superficies más diferenciadas. Mantener identidad **negro + morado `#4F46E5`** pero subiendo el listón visual.

### Objetivo 2 — Capa de roles real (no solo cosmética)
- CRUD completo de empleados en B2 (Usuarios) con drawer agregar/editar/borrar.
- Matriz visible en B4 (Roles) que muestre qué puede hacer cada rol en cada pantalla.
- Filtrado real de UI: el sidebar, los CTAs y los modales se ocultan/muestran según el rol del usuario logueado en `localStorage`.

### Objetivo 3 — Fixes de las 6 pantallas marcadas
Aplicar los nuevos tokens + arreglos puntuales sin tocar la lógica funcional (los flujos te gustan, solo cambia el visual).

---

## 2. Out of scope (explícito para no desbordar)

- ❌ Refactor de Storefront, Auth (excepto registro), Backoffice (excepto Usuarios + Roles), POS (excepto mapa), Mesero (excepto mapa), KDS (excepto saturación de bordes).
- ❌ Cambios funcionales en flujos (cobro, comandas, nómina). Solo visual + roles.
- ❌ Migración a framework. Sigue siendo vanilla.
- ❌ Cambio de paleta principal (sigue siendo negro + morado `#4F46E5`).

---

## 3. Decisiones técnicas tomadas

### 3.1 Sistema de roles

**Roles definidos** (basado en lo que ya existe en la app):
| Rol | Puede acceder a |
|------|----------------|
| `admin` | Todo el Backoffice + POS + KDS + Mesero |
| `gerente` | Backoffice (sin Usuarios, Roles, Integraciones, Facturación DIAN) + POS + KDS |
| `cajero` | POS + Backoffice (solo Dashboard, Caja, Reportes en read-only) |
| `mesero` | Solo App Mesero |
| `cocina` | Solo KDS |

**Persistencia:**
```js
// localStorage key: root:auth:v1
{
  userId: "usr-001",
  name: "Juan Camilo",
  role: "admin",
  permissions: ["users:read", "users:write", "users:delete", ...]
}
```

**API global nueva:** `Auth.can("users:write")` → boolean. Se usa en todas las pantallas para mostrar/ocultar elementos.

### 3.2 Refactor de tokens (estética Vercel)

**Tipografía:**
- Mantener Inter pero subir escala: usar también Inter Display 600/700 para hero numbers.
- Tabular nums (`font-variant-numeric: tabular-nums`) para todos los montos. Tip extra: añade `font-feature-settings: "tnum", "cv11"` para que los dígitos no bailen al actualizar montos en vivo (esto se ve mucho en el POS).

**Escala de superficies (negro → menos negro):**
```
--bg-base:     #0A0A0A   /* background página */
--bg-surface:  #111111   /* cards nivel 1 */
--bg-elevated: #161616   /* cards sobre cards (modales, drawers) */
--bg-overlay:  #1C1C1C   /* hover states */
```

**Bordes (clave para el look Vercel):**
```
--border-subtle:   rgba(255,255,255,0.06)   /* divisores */
--border-default:  rgba(255,255,255,0.10)   /* cards */
--border-strong:   rgba(255,255,255,0.16)   /* hover/focus */
```

**Radius (más grande, más moderno):**
```
--radius-sm:  6px   (era 4px)
--radius-md:  10px  (era 8px)
--radius-lg:  14px  (era 12px)
--radius-xl:  20px  (cards grandes, hero)
```

**Sombras (sutiles, no dramáticas):**
```
--shadow-sm:  0 1px 2px rgba(0,0,0,0.4)
--shadow-md:  0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)
--shadow-lg:  0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)
```

**Color de estado (bajar saturación, esto es el cambio más visible):**
```
/* ANTES (saturado, gritón) → AHORA (sutil, Vercel-style) */
--state-success: #10B981 → #22C55E con fondo rgba(34,197,94,0.10)
--state-warning: #F59E0B → #EAB308 con fondo rgba(234,179,8,0.10)
--state-danger:  #EF4444 → #F43F5E con fondo rgba(244,63,94,0.10)
--state-info:    #3B82F6 → #60A5FA con fondo rgba(96,165,250,0.10)
```

**Regla clave:** los badges de estado NO usan color sólido. Usan:
- `background: rgba(color, 0.10)` (fondo translúcido)
- `border: 1px solid rgba(color, 0.25)`
- `color: color` (texto en el color, no en blanco)

Esto es lo que hace que Vercel se vea "limpio" — los colores comunican sin gritar.

---

## 4. Tasks ordenadas (con dependencias)

> Convención: `T-XX` formato compatible con SpecKit. Cada task tiene criterios de aceptación claros para que un agente (o tú) pueda marcarla como done sin ambigüedad.

### Fase A — Fundación (días 1-2)

#### T-01 — Refactor de tokens en `assets/css/tokens.css`
**Depende de:** nada (es el primer paso, todo lo demás se apoya en esto).
**Archivo:** `assets/css/tokens.css`
**Qué hacer:**
- Reemplazar variables de color/superficie/borde/radius/sombra según la sección 3.2.
- Mantener nombres de tokens existentes para no romper consumidores.
- Agregar variables nuevas: `--bg-elevated`, `--bg-overlay`, `--border-subtle`, `--shadow-lg`.
- Light mode: invertir lógicamente (no es prioridad, pero no debe romperse).

**Criterios de aceptación:**
- [ ] Todas las pantallas siguen renderizando sin elementos invisibles ni contraste roto.
- [ ] El "smoke test" pasa: abrir las 48 pantallas y verificar que no hay cards sin borde, texto sobre texto, ni badges ilegibles.
- [ ] Documentar el cambio en `docs/design-system.md`.

---

#### T-02 — Sistema de autenticación con roles en `assets/js/auth.js`
**Depende de:** nada (paralelo a T-01).
**Archivo nuevo:** `assets/js/auth.js`
**Qué hacer:**
```js
// API pública
Auth.current()          // {userId, name, role, permissions}
Auth.can(permission)    // boolean
Auth.login(user)        // guarda en localStorage:root:auth:v1
Auth.logout()           // limpia y redirige
Auth.requireRole(role)  // si no cumple, redirige
```

- Definir constantes de permisos en `auth.js` (no en cada pantalla):
```js
const PERMISSIONS = {
  admin:   ["users:*", "roles:*", "billing:*", "reports:*", "pos:*", "kds:*", ...],
  gerente: ["catalog:*", "inventory:*", "reports:read", "pos:*", "kds:*", ...],
  cajero:  ["pos:*", "dashboard:read", "cash:*", "reports:read"],
  mesero:  ["tables:*", "orders:write", "payroll:self"],
  cocina:  ["kds:*"]
}
```

- Helper para sidebar: `Auth.filterNavItems(items)` filtra items según `permissions`.

**Criterios de aceptación:**
- [ ] `Auth.can("users:write")` retorna correctamente para los 5 roles.
- [ ] La key `root:auth:v1` se inicializa con un admin demo si no existe (para que la demo no requiera login).
- [ ] Documentado en `docs/auth-roles.md`.

---

### Fase B — Pantallas con tokens nuevos (días 3-6)

#### T-03 — Auth Registro (A2): arreglar paddings del stepper
**Depende de:** T-01.
**Archivo:** `auth/registro.html`
**Qué hacer:**
- Auditar el stepper de 3 pasos: alinear paddings de cada step (probablemente `padding-block` inconsistente entre paso 1, 2 y 3).
- Aplicar nuevos tokens de superficie (`--bg-surface` para el panel, `--bg-elevated` para inputs activos).
- Verificar que el hint "Sin dígito de verificación" del NIT use el nuevo `--text-muted`.

**Criterios de aceptación:**
- [ ] Los 3 pasos tienen exactamente el mismo padding (medir con DevTools).
- [ ] Inputs usan radius `--radius-md` y border `--border-default`.
- [ ] Focus state visible con `--border-strong` + glow morado sutil (no outline azul del browser).

---

#### T-04 — KDS: bajar saturación de bordes de alerta
**Depende de:** T-01.
**Archivo:** `kds/main.html` + estilos
**Qué hacer:**
- Cards con borde rojo intenso → cambiar a `border: 1px solid rgba(244, 63, 94, 0.35)` + `box-shadow: inset 0 0 0 1px rgba(244, 63, 94, 0.15)` para sutileza.
- Cards "NUEVO" (azul intenso): mismo tratamiento con `--state-info`.
- Cards "amarillas" (warning): mismo tratamiento con `--state-warning`.
- El timer en rojo dentro de la card sigue rojo (es la alerta real), pero el borde de la card se atenúa.

**Criterios de aceptación:**
- [ ] A 2 metros de distancia se sigue distinguiendo qué card está en alerta (test de usabilidad real para cocina).
- [ ] El borde no genera "vibración visual" cuando hay 12 cards con alerta.
- [ ] El badge "NUEVO" ahora usa fondo translúcido + texto azul, no fondo sólido.

---

#### T-05 — App Mesero mapa (E3): fix overflow + reducir intensidad
**Depende de:** T-01.
**Archivo:** `mesero/mapa.html`
**Qué hacer:**

**Bug crítico (overflow del header):**
- El header con "Hola, Camila" + selector de sede se desplaza al hacer scroll, dejando las cards #3 y #4 cortadas arriba. **Causa probable:** el container del scroll no respeta el `safe-area` del frame de iPhone, o falta `position: sticky` con `top` correcto.
- Fix: header con `position: sticky; top: 0; z-index: 10; background: var(--bg-base);` y padding-top correcto en el contenedor scroll.

**Reducir intensidad:**
- Cards de mesa: bordes con color sólido → fondos translúcidos:
  - Ocupada: `background: rgba(244, 63, 94, 0.06); border: 1px solid rgba(244, 63, 94, 0.20);`
  - Por cobrar: igual con amarillo.
  - Libre: `background: var(--bg-surface); border: 1px solid var(--border-default);`
  - Reservada: igual con azul.
- Quitar los dots de comensales si la card ya muestra el icono de personas (👤 4) — es info duplicada.
- Nombre del mesero: pasar a `--text-muted` (no necesita gritar).
- Monto: ese sí destacado, con `font-weight: 600` y tabular-nums.

**Action sheet ("MESA —"):**
- Cambiar header de "MESA —" a "**Mesa #8 · Andrés M.**" (contexto real).
- Usar `--bg-elevated` para el sheet, divisores con `--border-subtle`.

**Criterios de aceptación:**
- [ ] Al hacer scroll, el header queda fijo y NO hay cards cortadas.
- [ ] Las cards ocupadas se ven, a ojo, ~60% menos saturadas que ahora.
- [ ] El action sheet muestra el número y mesero de la mesa seleccionada.
- [ ] Probar en frame de iPhone 13 (390px) y SE (375px).

---

#### T-06 — POS Mapa de mesas (C2): quitar sobrecarga
**Depende de:** T-01.
**Archivo:** `pos/mapa.html`
**Qué hacer:**

**Panel izquierdo (el más sobrecargado):**
- Hoy tiene: Resumen turno + 3 contadores + Ventas + Ticket prom + Filtros con 5 checkboxes + Mesa seleccionada (placeholder).
- **Propuesta:** colapsar a 2 secciones máximo:
  1. **Turno** — un solo bloque compacto con: badge "Turno abierto", ventas, ticket promedio. Sin "resumen del turno" como título redundante.
  2. **Filtros** — segmented control horizontal (no checkboxes verticales). Opciones: "Todas · Libres · Ocupadas · Por cobrar · Reservadas". Default "Todas".
- Quitar el placeholder "Hacé click en una mesa para ver el detalle" — el sidebar se reemplaza por drawer cuando hay mesa seleccionada (más limpio).

**Cards de mesa:**
- Mismo tratamiento que mesero (translúcido en vez de borde sólido).
- Mantener todos los datos pero con jerarquía: número grande, monto medio, mesero + tiempo en `--text-muted` chico.

**Bug "liberar mesa":**
- Auditar el flujo: probablemente la card no se actualiza visualmente al liberar, o el modal de confirmación se queda abierto. Reproducir y arreglar.

**FAB descolgado:**
- El FAB morado abajo-izquierda con grid icon: cambiar icono a `lucide:layout-grid` o `lucide:table-2`. Mejor aún: si es "ir al home/dashboard", usar `lucide:home`. Y reposicionar a abajo-derecha (convención de FABs).

**Cerrar caja en rojo:**
- Bajar a botón secundario tipo "ghost danger": fondo transparente, borde `rgba(244,63,94,0.20)`, texto en `--state-danger`. NO compite con el FAB.

**Toggle Mapa/Lista/Normal/Compact (abajo):**
- Mover este toggle al header superior derecho (junto al cajero/hora). Ocupar el espacio inferior solo con el FAB.

**Criterios de aceptación:**
- [ ] El panel izquierdo tiene máximo 2 bloques visuales (turno + filtros).
- [ ] El bug de liberar mesa está reproducido y arreglado (documentar el caso).
- [ ] El FAB tiene icono semántico y está abajo-derecha.
- [ ] "Cerrar caja" ya no compite visualmente con el FAB.
- [ ] El toggle de vista (Mapa/Lista) está en el header, no en el footer.

---

### Fase C — Capa de roles (días 7-9)

#### T-07 — Backoffice Usuarios (B2): CRUD completo de empleados
**Depende de:** T-01, T-02.
**Archivo:** `backoffice/usuarios.html`
**Qué hacer:**

**Estado actual:** "12 usuarios · 5 roles asignados" + drawer crear/editar (B3). Falta el botón de **agregar** visible y el flujo de **eliminar**.

**Agregar:**
- CTA "Nuevo usuario" arriba a la derecha (botón primario morado). Solo visible si `Auth.can("users:write")`.
- Abre drawer existente (B3) con form: nombre, email, rol (select), sucursales (multi-select), PIN (si rol = mesero), estado (activo/inactivo).

**Editar:**
- Click en fila → drawer con datos pre-cargados.
- Botón "Guardar cambios" + "Descartar".

**Eliminar:**
- Botón "Eliminar usuario" en el drawer (parte inferior, rojo ghost).
- Modal de confirmación: "¿Eliminar a [nombre]? Esta acción no se puede deshacer. Sus comandas históricas se conservan."
- Solo visible si `Auth.can("users:delete")`.

**Persistencia:**
- `localStorage` key `root:users:v1`.
- Seed con los 8 empleados de nómina + 4 admins/gerentes para llegar a los "12 usuarios" actuales.

**Filtros y búsqueda:**
- Buscador por nombre/email.
- Filtro por rol (segmented control).
- Filtro por estado (toggle "Mostrar inactivos").

**Criterios de aceptación:**
- [ ] CRUD funcional: crear, editar, eliminar persiste en localStorage.
- [ ] Botones de agregar/eliminar respetan permisos (probar con `role: "gerente"` que no debería ver el botón eliminar).
- [ ] Empty state si no hay usuarios.
- [ ] Toast `UI.toast({type: "success", title: "Usuario creado"})` al guardar.

---

#### T-08 — Backoffice Roles (B4): matriz de permisos visible
**Depende de:** T-02, T-07.
**Archivo:** `backoffice/roles.html`
**Qué hacer:**

**Estado actual:** "5 roles definidos · 13 usuarios asignados" + matriz de permisos. Mejorar la matriz para que sea **visualmente legible** y editable.

**Layout propuesto:**
- Tabla con filas = pantallas/secciones, columnas = roles.
- Celdas con icono lucide:
  - `check` verde → permitido
  - `eye` gris → solo lectura
  - `x` rojo translúcido → bloqueado
- Header sticky al hacer scroll horizontal.
- Agrupar filas por módulo: Operación, Gestión, Nómina, Finanzas, Config.

**Editar permisos:**
- Click en celda → dropdown con las 3 opciones (permitido / solo lectura / bloqueado).
- Solo si `Auth.can("roles:write")`.
- Guardar en `root:roles:v1`.

**Crear rol custom:**
- CTA "Nuevo rol" arriba a la derecha.
- Drawer: nombre del rol + checkboxes de permisos agrupados.

**Criterios de aceptación:**
- [ ] Matriz scrolleable horizontalmente en mobile.
- [ ] Cambios persisten en localStorage.
- [ ] La matriz refleja correctamente los 5 roles definidos en `auth.js` (consistencia).

---

#### T-09 — Aplicar filtrado real de UI por rol en todas las pantallas
**Depende de:** T-02, T-07, T-08.
**Archivos:** todos los shells (sidebar, topbar, FABs).
**Qué hacer:**

**Sidebar del Backoffice:**
- Hoy se renderiza estático. Cambiar a render dinámico desde `nav.js`:
```js
const items = NAV_ITEMS.filter(item => Auth.can(item.permission));
```
- Si el usuario es `cajero`, solo ve: Dashboard, Caja, Reportes (read-only).
- Si es `gerente`, no ve Usuarios, Roles, Integraciones, Facturación DIAN.

**CTAs y botones:**
- Patrón global: cualquier botón con `data-requires="permission:string"` se oculta si no cumple.
```html
<button data-requires="users:delete">Eliminar</button>
```
- En `nav.js`: `document.querySelectorAll('[data-requires]').forEach(el => { if (!Auth.can(el.dataset.requires)) el.hidden = true; })`.

**Switcher de rol (solo para la demo):**
- En el dropdown del avatar (topbar): agregar "Cambiar rol (demo)" con las 5 opciones.
- Al cambiar, recarga la pantalla y aplica los filtros.
- Esto NO existe en producción real, es solo para demostrar el sistema en la demo.

**Criterios de aceptación:**
- [ ] Cambiar a `role: "cajero"` y verificar que el sidebar muestra solo 3 items.
- [ ] Cambiar a `role: "mesero"` y verificar que la URL del backoffice redirige a `/mesero/`.
- [ ] El switcher de rol funciona y es accesible solo en modo demo (flag `DEMO_MODE` en `auth.js`).

---

### Fase D — QA y consistencia (día 10)

#### T-10 — Smoke test visual de las 48 pantallas
**Depende de:** todas las anteriores.
**Qué hacer:**
- Recorrer las 48 pantallas con los nuevos tokens aplicados.
- Checklist por pantalla:
  - [ ] Badges usan fondo translúcido (no sólido)
  - [ ] Cards tienen radius `--radius-lg` o mayor
  - [ ] Sombras consistentes con la escala definida
  - [ ] Hover states funcionan
  - [ ] Focus visible con glow morado
  - [ ] Tabular nums en todos los montos
  - [ ] No hay contraste roto (texto sobre fondo del mismo tono)
- Documentar hallazgos en `docs/sprint-14-qa.md`.
- **Tip:** levanta una página `/test-tokens.html` que muestre las 5 superficies + las 4 estados + los 4 radius + las 3 sombras + tipografía en una sola pantalla. Te ahorra horas de recorrer las 48 a ciegas.

#### T-11 — Documentación final
**Depende de:** T-10.
- Actualizar `docs/design-system.md` con los nuevos tokens.
- Crear `docs/auth-roles.md` con la matriz completa y la API de `Auth`.
- Actualizar `CONTEXTO-APP.md` con los cambios visuales.
- Git commits siguiendo convencional (`feat(ds): refactor tokens to Vercel style`, `feat(auth): add roles system`, etc.) ligados a las issues de Jira.

---

## 5. Ruta crítica

```
T-01 (tokens) ──┬─→ T-03 (registro)
                ├─→ T-04 (KDS)
                ├─→ T-05 (mesero)
                └─→ T-06 (POS)

T-02 (auth) ────┬─→ T-07 (usuarios) ──→ T-08 (roles) ──→ T-09 (filtrado UI)
                └─→ T-09

Todas ──→ T-10 (QA) ──→ T-11 (docs)
```

**Paralelización:** T-01 y T-02 pueden ir el mismo día por dos desarrolladores (o por ti en sesiones distintas). T-03 a T-06 son independientes entre sí una vez T-01 esté listo.

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---------|------------|
| Cambiar tokens rompe pantallas no contempladas | T-10 (smoke test) obligatorio antes de cerrar el sprint |
| El bug "liberar mesa" del POS no se puede reproducir | Pedirle al QA/cliente el caso exacto antes de empezar T-06 |
| Light mode se rompe al refactorizar tokens | Definir explícitamente los 4 fondos en light mode al hacer T-01 |
| El sistema de roles agrega complejidad a flujos existentes | Empezar con `Auth.can()` siempre retornando `true` si `DEMO_MODE`, así no rompe nada hasta que se active |
| Sobrecarga de tareas en 10 días | Si vas justo de tiempo, mover T-09 (filtrado real UI) a Sprint 15 — la matriz + CRUD ya entregan valor visible |

---

## 7. Criterios de "Sprint Done"

- [ ] Las 6 pantallas marcadas tienen los nuevos tokens aplicados.
- [ ] El bug del overflow en mesero mapa está cerrado.
- [ ] El bug de liberar mesa en POS está cerrado.
- [ ] Existe CRUD funcional de usuarios con permisos.
- [ ] La matriz de roles es editable y persiste.
- [ ] El sidebar y CTAs respetan el rol logueado.
- [ ] Existe el switcher de rol en modo demo.
- [ ] Documentación actualizada.
- [ ] Git history limpio con conventional commits.

---

## 8. Para alimentar SpecKit

Si vas a usar `/specify` y `/plan` de SpecKit, te recomiendo dividir este sprint en **3 specs separadas** (no una sola gigante):

1. `spec-14a-design-tokens-refactor.md` — Solo T-01 + T-03 a T-06 + T-10.
2. `spec-14b-roles-system.md` — Solo T-02 + T-07 + T-08 + T-09.
3. `spec-14c-bug-fixes.md` — Bugs específicos: overflow mesero, liberar mesa POS, paddings registro.

Esto te permite que cada spec sea autocontenida y un agente pueda trabajar en una sin necesitar contexto de las otras. Es el mismo patrón que usaste para el Sprint 13 de nómina.
