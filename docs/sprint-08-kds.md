# Sprint 08 — KDS (2 pantallas tablet)

> **Objetivo:** pantalla de cocina (Kitchen Display System) — tickets en tiempo real con códigos de color por urgencia, y página de configuración de tiempos/estaciones/sonido.
> **Estimado:** 3 horas.
> **Pantallas:** D1 (main) y D2 (config).
> **Plataforma:** tablet horizontal preferente, dark mode por default.
> **Dependencias:** Sprint 0.

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| Shell KDS | `design-system/kds/kds-shared.jsx` (202 líneas) |
| D1 Pantalla cocina | `design-system/kds/kds-d1-main.jsx` (55 líneas) |
| D2 Configuración | `design-system/kds/kds-d2-config.jsx` (204 líneas) |

Host de referencia: `design-system/04-kds-backoffice.html`.

---

## Sección 8.1 — Shell KDS + Pantalla principal D1

### Prompt para Claude Code

```
Leé:
  - design-system/kds/kds-shared.jsx (202 líneas)
  - design-system/kds/kds-d1-main.jsx (55 líneas)

El KDS es una pantalla pensada para tablet horizontal en la cocina, idealmente en dark mode
permanente (luz cocina = mucha grasa/vapor, las pantallas oscuras son estándar).

IMPORTANTE: forzar dark mode al cargar:
  <script>document.documentElement.setAttribute('data-theme', 'dark');</script>
  ANTES de cargar tokens.css.
  En el toggle, permitir cambiar pero default = dark.

Crear assets/css/kds.css:

LAYOUT:
  .kds-shell {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    bg var(--bg);
  }

  .kds-topbar {
    height: 56;
    flex-shrink: 0;
    bg var(--alt);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 18;
    gap: 16;
  }
  .kds-topbar-logo (mismo patrón que pos: cuadrado accent + "Inventario · KDS").
  .kds-topbar-station (chip select grande "Estación: Caliente ▼").
  .kds-topbar-spacer (flex 1).
  .kds-topbar-stats (display flex gap 14, font-size 13):
    "Pendientes: 12" / "En prep: 8" / "Listos: 3" / "Tiempo prom: 8 min".
  .kds-topbar-actions: ícono settings → /kds/config.html, toggle tema, fullscreen.

  .kds-content {
    flex: 1;
    overflow: hidden;
    padding: 18;
  }

CREAR kds/main.html:

Sidebar activo: kds (en BO_NAV).
Topbar con stats correctos.

Body principal — grid de tickets:
  .kds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14;
    height: 100%;
    overflow-y: auto;
  }

TICKET CARD (.kds-ticket):
  bg, border 2px solid (color según urgencia), border-radius lg,
  display flex flex-col, overflow hidden.
  Min-height 240, max-height 480.

  Estados de urgencia (basado en minutos transcurridos):
    < 5 min  → border var(--success), header bg suave verde.
    5-10 min → border var(--warning), header bg suave amarillo.
    10-15 min → border #F97316 (naranja), header bg suave naranja.
    > 15 min → border var(--error), header bg suave rojo, ANIMACIÓN PULSE en el header.

  CSS para pulse del crítico:
    @keyframes ticket-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .kds-ticket.is-critical .kds-ticket-header { animation: ticket-pulse 1.2s infinite; }

  Header del ticket:
    Padding 12, display flex justify-between items-center, font-size 14.
    Izq: # ticket grande "#4821" (font-weight 700) + chip mesa "Mesa 5".
    Der: timer "08:34" (font-variant-numeric tabular-nums, font-weight 700, font-size 16).

  Body (flex 1, overflow-y auto, padding 12):
    Lista de items:
      Cada item:
        Header: cantidad × nombre (font-weight 600).
        Modificadores debajo (font-size 11, color muted): "Sin cebolla, Extra queso".
        Observación (si hay): "👤 Sin sal" (italic, color warning).
        Estado del item: checkbox grande (24x24) que toggle "listo".
          Sin marcar: cuadrado vacío.
          Marcado: bg success + check blanco + nombre tachado.
        Display flex items-start gap 10, padding 8 0, border-bottom dashed.

  Footer:
    Padding 12, border-top, display flex gap 8.
    btn-secondary "Marcar todo listo" (compact).
    btn-primary "Servir →" (deshabilitado hasta que todos los items estén listos).
      Click "Servir": fade-out + remove ticket del grid (mock — quitar elemento).

12-15 tickets mock con datos variados. Distribuir urgencias:
  ~6 verdes (recientes), ~4 amarillos, ~3 naranjas, ~2 rojos críticos.

JS:
  Timer cada segundo: actualiza el "08:34" de cada ticket sumando segundos.
    Cambia clase de urgencia cuando cruza umbrales (5, 10, 15 min).
    Mock simple: cada ticket tiene un atributo data-start con timestamp inicial,
    se calcula diff con Date.now().

  Click checkbox de item: toggle .is-done en el item, tachar nombre.
    Si todos los items del ticket están done → habilitar botón "Servir".

  Click "Servir":
    UI.toast({type:'success', title:'Ticket #X servido'});
    Animación fade-out + remove del DOM.

  Selector de estación arriba (filtro mock):
    "Caliente" → muestra todos.
    "Fría" → muestra solo tickets con bebidas/postres (data-station).
    "Bar" → solo bebidas alcohólicas.
    Filtro visual por display none.

  Sonido al recibir nuevo ticket (mock — no implementar audio real, solo console.log):
    Cada 30s simular nuevo ticket (opcional, no prioritario).

RESPONSIVE:
  Diseñado para tablet horizontal (>= 768).
  En portrait/mobile (< 768):
    Grid 1 col, tickets full-width.
    Topbar stats: ocultar o colapsar en menú.
```

### Hecho cuando

- Dark mode default al cargar.
- Grid de 12+ tickets con 4 estados de urgencia visualmente claros.
- Tickets críticos (rojos) con animación pulse.
- Timer actualiza cada segundo.
- Checkboxes en items toggle done/no done.
- "Servir" elimina el ticket con animación.
- En tablet: grid de 3-4 cols. En mobile: 1 col.

---

## Sección 8.2 — Configuración del KDS D2

### Prompt para Claude Code

```
Leé design-system/kds/kds-d2-config.jsx (204 líneas).

Crear kds/config.html.

Esta puede ser una página completa o un modal. Recomendación: PÁGINA completa con sidebar
de navegación interna (más espacio para configurar todo).

Topbar: igual al D1 + back arrow al inicio.
Título central: "Configuración del KDS".
Acción der: "Guardar cambios" btn-primary.

Body — layout 2 cols:
  .kds-config-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 18;
    height: 100%;
    padding: 18;
  }

IZQ — sidebar interno:
  Card con lista de secciones (clickeables, scroll-into-view o tabs):
    - General
    - Tiempos y alertas
    - Estaciones
    - Sonido
    - Vista
    - Operadores

DER — panel de la sección activa (cards apiladas con scroll):

  Sección "General":
    Card "Sede y estación":
      Sede: select.
      Estación principal de este KDS: select (Caliente / Fría / Bar / Combo).
      Modo: radio (Servicio en sala / Take-away / Delivery / Mixto).
    Card "Idioma y formato":
      Idioma de la pantalla.
      Formato de hora 12h/24h.

  Sección "Tiempos y alertas" (la más importante):
    Card "Umbrales de urgencia":
      Card horizontal con 4 slots:
        Verde (normal):       0 min – __ min   [input number 5]
        Amarillo (atención):  5 min – __ min   [input number 10]
        Naranja (urgente):    10 min – __ min  [input number 15]
        Rojo (crítico):       __ min en adelante  [input number 15]
        (los inputs son cascada: cambiar uno actualiza los siguientes).
      Switch "Animar tickets críticos".
      Switch "Mostrar tiempo total grande".

    Card "Tiempos esperados por categoría":
      Tabla:
        Categoría / Tiempo esperado / Acciones
        Entradas — 5 min — [editar]
        Platos — 12 min — [editar]
        Bebidas — 2 min — [editar]
        Postres — 4 min — [editar]
      Botón "+ Agregar categoría".

  Sección "Estaciones":
    Card "Estaciones de la cocina":
      Lista de estaciones:
        Caliente — 12 productos asignados — [editar][eliminar]
        Fría — 8 productos asignados — [editar][eliminar]
        Bar — 24 productos asignados — [editar][eliminar]
      Botón "+ Nueva estación".

    Card "Asignación de productos":
      Tabla:
        Producto / Estación actual / Cambiar
        Hamburguesa — Caliente — [select]
        ... etc.

  Sección "Sonido":
    Card "Alertas sonoras":
      Switch master "Habilitar sonidos".
      Switch "Sonido al recibir nuevo ticket".
      Switch "Alerta cuando un ticket cruza el umbral crítico".
      Selector de sonido: dropdown con 5 opciones (chime, bell, ding, etc).
        Botón "▶ Probar" al lado.
      Slider de volumen 0-100.

  Sección "Vista":
    Card "Diseño":
      Cantidad de columnas: select (Auto / 2 / 3 / 4 / 5).
      Tamaño de fuente: select (Compacta / Normal / Grande).
      Mostrar foto del producto en cada item: switch.
      Mostrar # de mesa grande: switch.
      Mostrar mesero: switch.

  Sección "Operadores":
    Lista de cocineros que pueden marcar tickets:
      Cards con avatar + nombre + chip rol + switch activar.
      4 mock: Cocinero 1, 2, Sous chef, Chef.

Footer sticky:
  btn-secondary "Cancelar" / btn-primary "Guardar cambios".
  Click guardar → toast + redirect a /kds/main.html.

JS:
  Click en sección del sidebar izq: scrollIntoView del card correspondiente, marcar activa.
  Cambios en inputs son visuales (no persisten — es demo).
  Inputs de umbrales tienen lógica de cascada simple (cada input mínimo es el anterior + 1).

RESPONSIVE:
  @media (max-width: 1024px):
    Sidebar interno → tabs horizontales scroll-x arriba.
    .kds-config-layout { grid-template-columns: 1fr; }
  @media (max-width: 768px):
    Cards full width, controls stack vertical.
```

### Hecho cuando

- 6 secciones navegables con sidebar interno.
- Umbrales de tiempo editables con cascada.
- Lista de estaciones y operadores.
- Footer sticky guarda con toast y vuelve a main.
- Mobile: tabs horizontales en lugar de sidebar.

---

## Checklist final del Sprint 8

- [ ] kds/main.html: dark mode default, grid responsive, 4 niveles urgencia, pulse en críticos.
- [ ] Timer actualiza cada segundo, urgencia cambia al cruzar umbrales.
- [ ] Checkbox marca items listos, "Servir" elimina ticket.
- [ ] Selector de estación filtra tickets visualmente.
- [ ] kds/config.html: 6 secciones con sidebar interno, todos los controles visibles.
- [ ] "Guardar" muestra toast y vuelve a main.
- [ ] Tablet horizontal optimizada.
- [ ] Toggle de tema funciona aunque default sea dark.

Commit: `feat: sprint 8 kds completo`. Pasamos al Sprint 9 (Storefront).
