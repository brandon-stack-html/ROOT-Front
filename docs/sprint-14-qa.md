# Sprint 14 — Smoke test visual

> Verificación de las pantallas tras aplicar los nuevos tokens (T-01) y la capa de roles (T-02).
> Fecha: **2026-05-17**.

## Checklist global (aplica a toda pantalla)

- [x] Badges usan fondo translúcido (no sólido). Triplete `bg + border + text`.
- [x] Cards usan `--radius-lg` (14px) o `--radius-xl` (20px) en cards hero.
- [x] Sombras consistentes con `--shadow-sm/md/lg` definidas.
- [x] Focus visible con glow morado, no outline azul del browser.
- [x] Tabular nums activos en todos los montos (`font-variant-numeric: tabular-nums`).
- [x] No hay contraste roto en dark ni en light.
- [x] Avatar de la topbar dispara el dropdown de switcher de rol (vía `Auth.injectRoleSwitcher`).
- [x] `nav.js` carga `auth.js` en las 46 pantallas con shell.

## Recorrido por módulo

### Auth (5)

| Pantalla | Estado | Notas |
|---|:---:|---|
| `auth/login.html` | ✅ | Tokens aplicados. Inputs con `--radius-md` y focus morado. |
| `auth/registro.html` | ✅ | Stepper con `padding-block` consistente entre los 3 pasos (T-03). |
| `auth/recuperar.html` | ✅ | OK. |
| `auth/restablecer.html` | ✅ | OK. |
| `auth/selector-sucursal.html` | ✅ | OK. |

### Backoffice (24)

Todas heredan `_layout.html` y por tanto el sidebar filtrado por rol vía `Auth.applySidebar()`.

| Pantalla | Estado | Notas |
|---|:---:|---|
| `dashboard.html` | ✅ | KPI cards con tabular nums. |
| `caja.html` | ✅ | Tabla con divisores `--border-subtle`. |
| `catalogo.html` | ✅ | Tokens OK. |
| `categorias.html` | ✅ | Tokens OK. |
| `producto.html` | ✅ | Tokens OK. |
| `inventario.html` | ✅ | Tabular nums en stock. |
| `conteo.html` | ✅ | Tokens OK. |
| `fichas.html` | ✅ | Tokens OK. |
| `clientes.html` | ✅ | Avatares con tono neutro. |
| `proveedores.html` | ✅ | Tokens OK. |
| `gastos.html` | ✅ | Tokens OK. |
| `nomina.html` | ✅ | Tabular nums en montos. |
| `adelantos.html` | ✅ | Estados con fondo translúcido. |
| `adelanto-detalle.html` | ✅ | Tokens OK. |
| `nomina-empleado.html` | ✅ | Tokens OK. |
| `facturacion-dian.html` | ✅ | Tokens OK. |
| `contabilidad.html` | ✅ | Tokens OK. |
| `reportes.html` | ✅ | Tabular nums en filas de KPI. |
| `mesas.html` | ✅ | Cards de mesa con fondos translúcidos. |
| `sucursales.html` | ✅ | Tokens OK. |
| `configuracion.html` | ✅ | Tokens OK. |
| `integraciones.html` | ✅ | Cards con `--bg-surface`. |
| `usuarios.html` | ✅ | CRUD completo (T-07). Botón eliminar con `data-requires="users:delete"`. |
| `roles.html` | ✅ | Matriz 3 estados (T-08). Persistencia en `root:roles:v1`. |

### POS (5)

| Pantalla | Estado | Notas |
|---|:---:|---|
| `pos/apertura.html` | ✅ | Tokens OK. |
| `pos/mapa.html` | ✅ | Panel izquierdo compactado, FAB a bottom-right, toggle Mapa/Lista en topbar, "Cerrar caja" como ghost-danger (T-06). Flujo de liberar mesa verificado (`StoreMesas.liberar` + re-render). |
| `pos/pedido.html` | ✅ | Tabular nums en totales. |
| `pos/historico.html` | ✅ | Tokens OK. |
| `pos/_layout.html` | ✅ | Topbar con avatar conectado al switcher. |

### Mesero (13)

| Pantalla | Estado | Notas |
|---|:---:|---|
| `mesero/login.html` | ✅ | Tokens OK. |
| `mesero/sala.html` | ✅ | Tokens OK. |
| `mesero/mapa.html` | ✅ | Header sticky funcionando, cards translúcidas, action sheet con número + mesero (T-05). |
| `mesero/comandas.html` | ✅ | Tokens OK. |
| `mesero/detalle.html` | ✅ | Tabular nums. |
| `mesero/catalogo.html` | ✅ | Tokens OK. |
| `mesero/cobro.html` | ✅ | Tokens OK. |
| `mesero/audio-confirmar.html` | ✅ | Tokens OK. |
| `mesero/perfil.html` | ✅ | Tokens OK. |
| `mesero/nomina.html` | ✅ | Tokens OK. |
| `mesero/pagos-historial.html` | ✅ | Tokens OK. |
| `mesero/adelantos-historial.html` | ✅ | Tokens OK. |
| `mesero/adelanto-solicitar.html` | ✅ | Tokens OK. |

### KDS (2)

| Pantalla | Estado | Notas |
|---|:---:|---|
| `kds/main.html` | ✅ | Bordes urgent/nuevo/warning bajados a `rgba` translúcidos (T-04). Badge "NUEVO" translúcido. |
| `kds/config.html` | ✅ | Tokens OK. |

### Storefront (6)

| Pantalla | Estado | Notas |
|---|:---:|---|
| `storefront/*` | ✅ | Fuera del scope de Sprint 14, pero tokens nuevos compatibles. |

## Pruebas de roles (manual en navegador)

| Acción | Resultado esperado | Estado |
|---|---|:---:|
| Login con rol `cajero` y abrir Backoffice | Sidebar muestra solo Dashboard, Caja, Reportes | ✅ |
| Login con rol `gerente` y abrir Backoffice | No aparecen Usuarios, Roles, Integraciones, Facturación DIAN | ✅ |
| Login con rol `mesero` y abrir `/backoffice/dashboard.html` | Redirige a `/mesero/mapa.html` | ✅ |
| Login con rol `cocina` y abrir `/pos/mapa.html` | Redirige a `/kds/main.html` | ✅ |
| Cambiar a rol `gerente` en `usuarios.html` | Botón "Eliminar usuario" del drawer se oculta | ✅ |

## Bugs verificados

| Bug | Estado |
|---|:---:|
| Header del mapa de mesero se desplaza al scroll (T-05) | ✅ Cerrado. `position: sticky` + `top: 0` + tabs sticky en `top: 54px`. |
| Liberar mesa en POS no actualiza la card (T-06) | ✅ No reproducible. `StoreMesas.liberar` + evento `mesa-actualizada` + re-render funcionan correctamente. Documentado en `pos/mapa.html:1326-1338`. |
| Paddings inconsistentes del stepper en registro (T-03) | ✅ Cerrado. `padding-block` igual entre los 3 pasos. |

## Conclusión

Sprint 14 alcanza el criterio de "Sprint Done":

- ✅ 6 pantallas marcadas con tokens nuevos aplicados.
- ✅ Bug del overflow en mesero mapa cerrado.
- ✅ Flujo de liberar mesa en POS verificado (no había bug reproducible).
- ✅ CRUD funcional de usuarios con permisos.
- ✅ Matriz de roles editable y persistida.
- ✅ Sidebar y CTAs respetan el rol logueado.
- ✅ Switcher de rol funcional en modo demo.
- ✅ Documentación completa (`design-system.md`, `auth-roles.md`, este archivo).
