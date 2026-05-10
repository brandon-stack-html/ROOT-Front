# 00 — Overview del proyecto

## Qué es esto

Una demo navegable en HTML del sistema **Inventario POS**, un SaaS para restaurantes en Colombia.
La demo cubre **7 módulos** y **~46 pantallas** únicas, todas tomadas del design system que vive
en la carpeta `design-system/` del repo.

## Por qué existe

Para mostrar a stakeholders, inversionistas o el equipo cómo se ve y se siente la app completa,
sin tener que construir el backend, base de datos ni la lógica real. Es una **demo visual y
navegable**, no una app funcional.

## Los 7 módulos

| # | Módulo | Pantallas | Plataforma | Sprint |
|---|---|---|---|---|
| 1 | **Auth** (A1–A5) | Login, registro, recuperar contraseña, restablecer, selector sucursal | Desktop + móvil | 1 |
| 2 | **POS Web** (C1–C5) | Apertura turno, mapa mesas, pedido, cobro, histórico | Desktop / tablet | 6 |
| 3 | **App Mesero** (E1–E9) | Login, sala, mapa, catálogo, detalle, comandas, cobro, perfil | Móvil only | 7 |
| 4 | **KDS** (D1–D2) | Pantalla cocina + config | Tablet | 8 |
| 5 | **Backoffice Core** (B1, B8, B9, B11) | Dashboard, catálogo, producto, inventario | Desktop | 2 |
| 6 | **Backoffice Config** (B2–B7) | Usuarios, roles, configuración general, sucursales, mesas | Desktop | 3 |
| 7 | **Backoffice Operaciones** (B10, B12–B14) | Categorías, conteo, fichas técnicas, clientes | Desktop | 4 |
| 8 | **Backoffice Finanzas** (B16–B22) | Gastos, DIAN, caja, reportes, integraciones | Desktop | 5 |
| 9 | **Storefront** (F1–F6) | Carta QR, tienda online, checkout, confirmación | Móvil + desktop | 9 |

## Plan de sprints

| Sprint | Foco | Pantallas | Horas |
|---|---|---|---|
| 0 | Fundación (tokens, componentes, shells) | 0 (infra) | 4–6 |
| 1 | Auth | 5 | 4–6 |
| 2 | Backoffice Core | 5 | 6–8 |
| 3 | Backoffice Config | 5 | 6 |
| 4 | Backoffice Operaciones | 4 | 5–6 |
| 5 | Backoffice Finanzas | 5 | 5 |
| 6 | POS Web | 5 | 5 |
| 7 | App Mesero | 9 | 5 |
| 8 | KDS | 2 | 3 |
| 9 | Storefront | 6 | 5–6 |
| 10 | Pulido y QA | 0 (cross-cutting) | 3 |
| **Total** | | **~46** | **~51–64h** |

## Orden recomendado

1. **Sprint 0 obligatorio primero.** Define tokens, componentes y shells. Todo lo demás depende.
2. **Sprint 1 (Auth)** para tener un punto de entrada navegable.
3. Después podés ir en cualquier orden, aunque recomiendo:
   - **Sprints 2 → 3 → 4 → 5** (todo el backoffice junto, comparte shell y patrones).
   - **Sprint 6 (POS)** después porque su shell es distinto.
   - **Sprint 7 (Mesero)** y **Sprint 8 (KDS)** son mobile/tablet — bloque aparte.
   - **Sprint 9 (Storefront)** al final porque tiene el shell público propio.
4. **Sprint 10 (Pulido)** al cierre — toca todo el repo.

## Cómo usar este repo con Claude Code

### Para empezar un sprint nuevo

Sesión nueva con contexto limpio. Primer mensaje:

```
Vamos a trabajar el Sprint X.
1. Leé CLAUDE.md
2. Leé docs/sprint-XX-nombre.md
3. Antes de codear nada, dime qué entendiste del sprint y qué dudas tenés.

Vamos sección por sección. No me adelantes nada.
```

### Para cada sección

```
Hagamos la sección X.Y.
1. Leé el .jsx de referencia que indica esa sección.
2. Mostrame qué archivos vas a crear y un resumen de su contenido.
3. Cuando confirme, codeás.
4. Validamos visualmente y commit.
```

### Para retomar después de una pausa

```
Acabamos de terminar el Sprint X sección Y. Lo que sigue es la sección Z.
Leé CLAUDE.md y docs/sprint-XX-*.md secciones Y y Z.
Hagamos Z.
```

## Fuente de verdad: el design system

La carpeta `design-system/` contiene **~50 archivos JSX** que son los mockups visuales del sistema.
Son la spec — no se ejecutan, no se importan, no se transpilan. Se **leen** como referencia.

Estructura:
- `ds-tokens.jsx` → colores, tipografía, espaciados base.
- `ds-components.jsx` → botones, inputs, badges, cards, tablas, overlays.
- `ds-identity.jsx` → logo y variantes.
- `auth/`, `pos/`, `mesero/`, `kds/`, `backoffice/`, `storefront/` → las pantallas.
- `*-shared.jsx` (uno por módulo) → componentes compartidos del módulo (sidebar del backoffice,
  header del storefront, bottom-tab del mesero, etc.).

Cada sprint te dice exactamente qué archivos JSX leer.

## Tips operacionales

- **No agregues `package.json`, `node_modules`, etc.** Esto es vanilla — abrí el HTML y listo.
- **Para validar:** abrí cada HTML en navegador, probá ambos temas (toggle), redimensioná a 360px,
  768px y 1280px.
- **Si Claude Code se desvía:** mostrale el JSX exacto y decile "ajustá para que coincida con esto".
- **Commits frecuentes.** Uno por sección al menos. Si el sprint es largo, varios.
- **Branch por sprint** opcional pero recomendado: `sprint-00-fundacion`, `sprint-01-auth`, etc.
