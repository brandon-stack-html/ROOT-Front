# Sprint 07 — App Mesero móvil (9 pantallas)

> **Objetivo:** app mobile-first para meseros — login con PIN, mapa de mesas, toma de pedido, comandas activas, cobro rápido y perfil.
> **Estimado:** 5 horas.
> **Pantallas:** E1–E9 (mobile only, 390px ancho de referencia).
> **Dependencias:** Sprint 0.

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| Shell mesero | `design-system/mesero/mesero-shared.jsx` (209 líneas) |
| E1 Login PIN | `design-system/mesero/mesero-e1-login.jsx` (77 líneas) |
| E2 Sala (lista) | `design-system/mesero/mesero-e2-sala.jsx` (100 líneas) |
| E3 Mapa de mesas | `design-system/mesero/mesero-e3-mapa.jsx` (134 líneas) |
| E4 Detalle de mesa | `design-system/mesero/mesero-e4-detalle.jsx` (147 líneas) |
| E5 Catálogo | `design-system/mesero/mesero-e5-catalogo.jsx` (128 líneas) |
| E6 Bottom-sheet modificadores | `design-system/mesero/mesero-e6-bottomsheet.jsx` (127 líneas) |
| E7 Comandas activas | `design-system/mesero/mesero-e7-comandas.jsx` (147 líneas) |
| E8 Cobro rápido | `design-system/mesero/mesero-e8-cobro.jsx` (135 líneas) |
| E9 Perfil | `design-system/mesero/mesero-e9-perfil.jsx` (135 líneas) |

Host de referencia: `design-system/03-mesero-mobile.html`.

---

## Sección 7.1 — Frame mobile y shell del mesero

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-shared.jsx (209 líneas) — shell completo de la app mobile.

Esta app es 100% mobile (390px viewport). En desktop la mostramos dentro de un FRAME tipo
iPhone centrado, para que se vea como una app real.

Crear assets/css/mesero.css:

FRAME DESKTOP (solo visible en pantallas >= 768px):
  En desktop, la página renderiza:
    body { background: var(--alt); display: flex; align-items: center; justify-content: center;
           min-height: 100vh; padding: 24; }
    .mesero-frame {
      width: 390px;
      height: 844px;  /* tamaño iPhone 14 */
      border: 12px solid #1f1f1f;
      border-radius: 48px;
      box-shadow: 0 20px 50px rgba(0,0,0,.3);
      overflow: hidden;
      position: relative;
      background: var(--bg);
    }
    .mesero-frame::before {
      /* notch */
      content: '';
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 120px; height: 28px;
      background: #1f1f1f;
      border-radius: 0 0 16px 16px;
      z-index: 50;
    }
  En mobile (< 768px):
    .mesero-frame { width: 100%; height: 100vh; border: none; border-radius: 0; }
    .mesero-frame::before { display: none; }
    body { background: var(--bg); padding: 0; }

SHELL INTERNO (.mesero-app):
  display: flex; flex-direction: column; height: 100%; overflow: hidden;

  TOPBAR (.mesero-topbar):
    height 56, flex-shrink 0, bg, border-bottom, padding 0 16.
    display flex items-center gap 12.
    Botón back (← lucide arrow-left) si aplica.
    Título central font-weight 600.
    Acción derecha (ícono ej bell, search).

  CONTENT (.mesero-content):
    flex: 1; overflow-y: auto; padding: 16; padding-bottom: 80;  /* espacio para bottom-tab */

  BOTTOM TAB (.mesero-bottom-tab):
    height 64, flex-shrink 0, bg alt, border-top.
    display: grid; grid-template-columns: repeat(3, 1fr).
    Cada tab .tab-item: cursor pointer, color muted, display flex flex-col items-center justify-center gap 2.
      Ícono lucide 22x22.
      Label font-size 10.
    Tab activa: color accent, font-weight 600.

    3 tabs: Mapa (map), Comandas (clipboard-list), Perfil (user).

CREAR mesero/_layout.html como plantilla del frame + shell.
Cada pantalla del mesero (excepto login E1) debe partir de este layout.
```

### Hecho cuando

- En desktop la app se ve dentro del frame iPhone con notch.
- En mobile ocupa toda la pantalla sin frame.
- Bottom tab con 3 items (Mapa/Comandas/Perfil) funciona visualmente (los links hacen `location.href`).

---

## Sección 7.2 — Login PIN E1

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e1-login.jsx (77 líneas).

Crear mesero/login.html.

Esta pantalla NO usa el bottom-tab (es pre-login). Solo el frame y un layout custom centrado.

ESTRUCTURA dentro del frame:
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  padding: 32 20;

  TOP: vacío o logo pequeño.

  CENTER:
    Avatar grande (80x80, círculo con bg accent suave, inicial grande "JC" o ícono user).
    Nombre del mesero "Juan Camilo Ruiz" (font-size 20, font-weight 700, margin-top 14).
    Subtítulo "Sede Norte · Mesero" (font-size 13, color muted, margin-top 4).
    Margen abajo 32.

    Display de PIN (4 dots):
      .pin-display { display: flex; gap: 16; }
      .pin-dot { width: 16; height: 16; border-radius: 50%; border: 2px solid var(--border); }
      .pin-dot.is-filled { background: var(--accent); border-color: var(--accent); }
    Margen abajo 32.

    Texto error (oculto por default, se muestra en error): "PIN incorrecto" en rojo.

  BOTTOM — teclado numérico 3x4:
    .pin-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12;
      width: 100%;
      max-width: 280px;
    }
    .pin-key {
      height: 60;
      border-radius: 50%;
      bg alt;
      border: none;
      font-size: 24;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pin-key:active { transform: scale(0.96); }
    Botones 1-9, luego: vacío / 0 / borrar (ícono delete o ⌫).

JS:
  let pin = '';
  function update() {
    document.querySelectorAll('.pin-dot').forEach((d, i) => {
      d.classList.toggle('is-filled', i < pin.length);
    });
    if (pin.length === 4) {
      // Mock: 1234 = correcto
      setTimeout(() => {
        if (pin === '1234') {
          location.href = '/mesero/mapa.html';
        } else {
          document.querySelector('.pin-error').hidden = false;
          // shake animation
          document.querySelector('.pin-display').classList.add('shake');
          setTimeout(() => {
            document.querySelector('.pin-display').classList.remove('shake');
            pin = '';
            update();
          }, 600);
        }
      }, 200);
    }
  }
  document.querySelectorAll('.pin-key[data-key]').forEach(k => {
    k.onclick = () => { if (pin.length < 4) { pin += k.dataset.key; update(); } };
  });
  document.querySelector('.pin-key-del').onclick = () => { pin = pin.slice(0, -1); update(); };

CSS animación shake:
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%, 75% { transform: translateX(-6px); }
    50% { transform: translateX(6px); }
  }
  .shake { animation: shake 0.4s; }

Hint debajo del teclado: "PIN demo: 1234" (font-size 11, color muted, italic, margen-top 16).
```

### Hecho cuando

- Frame visible en desktop con avatar, nombre y teclado.
- Tipear 1234 navega a mapa.html.
- Cualquier otro PIN hace shake + texto error + reset.

---

## Sección 7.3 — Sala lista E2 (alternativa al mapa)

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e2-sala.jsx (100 líneas).

Crear mesero/sala.html (vista alternativa más simple del mapa, en formato lista).

Topbar: título "Sala · Sede Norte". Acción der: ícono refresh.

Contenido:
  Tabs scroll-x: Salón (act) / Terraza / Barra.

  Toolbar mini:
    Botones toggle vista: [grid] | [list] (default list en E2).
    Filtro: "Todas" / "Mías" / "Libres".

  Lista de mesas (.mesa-list-item):
    padding 14, bg, border-radius lg, margin-bottom 10.
    display flex items-center gap 14.
    Izq: número grande 44x44 dentro de círculo bg alt.
    Centro:
      Línea 1: "Mesa 5" (font-weight 600) + chip estado pequeño.
      Línea 2 (font-size 11, color muted):
        Si ocupada: "4 pers · 32 min · $87.400 · 5 ítems"
        Si libre: "4 sillas · Sin cliente"
        Si reservada: "Reserva 13:30 · Sra. Pérez · 6 pers"
    Der: chevron right.

    Click → /mesero/detalle.html?mesa=5

Bottom-tab con "Mapa" activa (la sala es parte del mapa).
```

### Hecho cuando

- Lista de mesas con info compacta legible en pantalla pequeña.
- Click navega a detalle.

---

## Sección 7.4 — Mapa de mesas E3

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e3-mapa.jsx (134 líneas).

Crear mesero/mapa.html partiendo de _layout.html.

Topbar: título "Mapa · Salón". Acción izq: hamburguesa (menú con Sede/Caja/Cerrar sesión).
Acción der: ícono notification bell con badge.

Contenido:
  Tabs scroll-x: Salón (12) / Terraza (4) / Barra (2).

  Mini KPIs horizontales chips:
    "Mías: 3" / "Libres: 5" / "$425.000 turno".

  Grid 2 cols mesas (en 390px):
    grid-template-columns: 1fr 1fr; gap: 10.
    Cada mesa: card 100% width, height 100, similar al POS web pero más compacta:
      Número grande arriba.
      Estado debajo + meta (timer si ocupada, "Libre" si libre, etc.).
      Borde de color según estado (igual paleta que pos: libre=border, ocupada=success,
        reservada=info, en cobro=warning con pulse).
    Click → /mesero/detalle.html?mesa=N

Bottom-tab con "Mapa" activa.
```

### Hecho cuando

- 12 mesas en grid 2 cols con estados de color.
- Tabs scroll-x cambian zona.
- Click navega a detalle.

---

## Sección 7.5 — Detalle de mesa E4

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e4-detalle.jsx (147 líneas).

Crear mesero/detalle.html partiendo de _layout.html.

Topbar: back + título "Mesa 5 · Salón" + ícono ⋯ (menú: Cambiar mesa, Anular).

Contenido:
  Header info compacta:
    Chip estado "Ocupada" verde + "32 min" + "4 pers" + total destacado "$87.400".
    Botón ghost completo "Editar comensales / mesa".

  Sección "Comanda actual" (lista de items igual al POS pero compacta):
    .comanda-item-mobile:
      Display flex gap 10, padding 10 0, border-bottom dashed.
      Cantidad badge circular bg alt.
      Centro: nombre + modificadores (font-size 11 muted) + obs (font-size 11 italic).
      Der: precio + botón ⋮ pequeño (menú: editar, eliminar).
    5-6 items mock.

  Footer sticky bottom (encima del bottom-tab):
    .detalle-actions {
      position: absolute;
      bottom: 64; /* encima del bottom-tab */
      left: 0; right: 0;
      bg, border-top, padding 12, display grid grid-template-columns: 1fr 1fr; gap 8;
    }
    btn-secondary "+ Agregar productos" → /mesero/catalogo.html?mesa=5
    btn-primary "Cobrar — $87.400" → /mesero/cobro.html?mesa=5

Si la mesa está LIBRE (parámetro ?nuevo=1):
  No mostrar comanda. Mostrar empty state:
    Ícono utensils grande circular.
    Texto "Mesa libre · Sin pedido activo".
    Botón "+ Iniciar pedido" → catálogo.

Bottom-tab "Mapa" activa.
```

### Hecho cuando

- Mesa con comanda muestra items y total.
- Botón "Agregar productos" navega al catálogo.
- Botón "Cobrar" navega a cobro.
- Mesa libre muestra empty state.

---

## Sección 7.6 — Catálogo E5

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e5-catalogo.jsx (128 líneas).

Crear mesero/catalogo.html partiendo de _layout.html.

Topbar: back + título "Mesa 5 · Pedido" + chip pequeño con total comanda actual "3 ítems · $42.000".

Contenido:
  Search ancho completo: "Buscar producto..."
  Tabs scroll-x: Entradas / Platos / Bebidas / Postres / Combos.
  Grid 2 cols productos:
    Card .pos-product compacto:
      Foto cuadrada full width.
      Nombre + precio.
      Padding 10.
      Click → abre bottom-sheet E6 con modificadores.
    12+ productos mock.

Footer sticky con resumen + acción:
  Bg accent suave, padding 12.
  Izq: "3 ítems · $42.000".
  Der: btn-primary compacto "Ver comanda →" → /mesero/detalle.html?mesa=5.

Bottom-tab "Mapa" activa (sigue siendo el flujo de la mesa).
```

### Hecho cuando

- Grid 2 cols con productos.
- Tabs filtran por categoría.
- Click producto abre bottom-sheet (siguiente sección).

---

## Sección 7.7 — Bottom-sheet modificadores E6

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e6-bottomsheet.jsx (127 líneas).

Implementar dentro de catalogo.html un BOTTOM-SHEET que sube desde abajo.

Diferencia con modal: en mobile, el modal se ve mejor como sheet anclado al fondo
con animación slide-up.

CSS .bottom-sheet:
  position: absolute;  /* dentro del frame */
  bottom: 0; left: 0; right: 0;
  max-height: 85%;
  bg, border-radius: 20 20 0 0;
  box-shadow: 0 -10px 30px rgba(0,0,0,.15);
  transform: translateY(100%);
  transition: transform 280ms cubic-bezier(.4,0,.2,1);
  z-index: 60;
  display: flex; flex-direction: column;
.bottom-sheet.is-open { transform: translateY(0); }

.bottom-sheet-handle:
  width: 40, height: 4, bg muted, border-radius: 2,
  margin: 10 auto 6.

.bottom-sheet-header:
  padding 0 18 14, border-bottom.
  Foto producto pequeña (60x60) + info: nombre, descripción, precio base.

.bottom-sheet-body:
  flex 1, overflow-y auto, padding 18.
  Grupos de modificadores:
    Header del grupo: nombre + chip "Obligatorio" o "Opcional · máx N".
    Items: cards horizontales:
      Radio o checkbox visual a la izq.
      Nombre + precio +$ a la der.
      padding 12, border-radius 10, border, click toggle.
      Activo: border accent + bg accent suave.
  Cantidad selector grande: −  3  + (botones 40x40).
  Observación: textarea compacta.

.bottom-sheet-footer:
  border-top, padding 14, sticky bottom.
  Btn-primary full-width grande "Agregar — $26.500" (precio actualiza en vivo).

JS:
  Función UI.openBottomSheet(id) y UI.closeBottomSheet(id).
  En este caso: la función es la misma que openModal pero usa la clase bottom-sheet.
  Ampliar UI.bindAutoTriggers para soportar [data-open-sheet="id"].
  Backdrop opcional o swipe-down (no implementar swipe — tap fuera o handle bar para cerrar).

  Click en producto del catálogo:
    Llenar el contenido del sheet con datos del producto (mock objeto productos[id]).
    UI.openBottomSheet('sheetModificadores').
  Click "Agregar":
    UI.toast({ type: 'success', title: 'Agregado a la comanda' });
    UI.closeBottomSheet('sheetModificadores');
    // Update header counter "3 ítems → 4 ítems".
```

### Hecho cuando

- Click producto abre sheet desde abajo con animación suave.
- Selección de modificadores actualiza precio en vivo.
- Tap fuera o handle cierra el sheet.
- "Agregar" muestra toast y cierra.

---

## Sección 7.8 — Comandas activas E7

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e7-comandas.jsx (147 líneas).

Crear mesero/comandas.html partiendo de _layout.html.

Topbar: título "Comandas activas" + acción der search.

Contenido:
  Tabs scroll-x: Mías (8) / Todas (24) / Por cobrar (3).
  Filtros chips: Recientes / Más antiguas / Por mesa.

  Lista de comandas (cards verticales):
    Card .comanda-card-mobile:
      padding 14, border, border-radius lg, bg, margin-bottom 10.
      Header: Mesa # grande + estado chip + tiempo "32 min" en der.
      Body: lista compacta de 2-3 items con cantidad (resto "+3 más").
      Footer:
        Izq: total destacado.
        Der: botones inline:
          Si no enviada: "Enviar a cocina" (ghost).
          Si enviada y no cobrada: "Cobrar" (primary).
          Si cobrada: badge success "Pagada" (sin botón).
      Click en card (no botones) → /mesero/detalle.html?mesa=X

  10-12 comandas mock con mix de estados.

Bottom-tab "Comandas" activa.

JS:
  Click "Enviar a cocina" en card: UI.toast({type:'info', title:'Comanda #X enviada al KDS'});
    cambiar estado visual del card (badge "En preparación").
  Click "Cobrar": location.href = '/mesero/cobro.html?mesa=X'.
```

### Hecho cuando

- Tabs alternan filtros.
- 10+ comandas con diferentes estados.
- Botones según estado funcionan (toast o navegación).

---

## Sección 7.9 — Cobro rápido E8

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e8-cobro.jsx (135 líneas).

Crear mesero/cobro.html partiendo de _layout.html.

Topbar: back + título "Cobrar Mesa 5" + ícono close.

Contenido (sin bottom-tab — es flujo modal — ocultar bottom-tab agregando clase .no-tab):
  
  Card resumen sticky arriba:
    Total destacado: "$87.400" (font-size 32, font-weight 700).
    Sub: "Mesa 5 · 6 ítems · 4 pers".
    Botón ghost "Ver detalle de la cuenta" → modal con items.

  Sección método de pago:
    Tabs grandes inline (cards):
      .method-card (each padding 14, border-radius lg, border, display flex flex-col items-center gap 6)
      Ícono grande, label.
      Activo: border accent, bg accent suave.
    4 opciones: Efectivo / Tarjeta / Transferencia / Mixto.

  Panel EFECTIVO (default):
    Input grande monto recibido (font-size 28, text-align center).
    Quick amounts grid 4: $90.000, $100.000, $150.000, "Exacto".
    Vuelto auto: card destacado "Vuelto: $12.600" verde grande.

  Panel TARJETA (al cambiar tab):
    Selector tipo: Crédito / Débito chips.
    Selector cuotas: 1 / 3 / 6 / 12 chips.
    Mensaje "Pasá la tarjeta por el datafono cuando esté listo".

  Panel TRANSFERENCIA:
    Selector banco lista (Bancolombia, Davivienda, etc).
    Referencia input.

  Panel MIXTO:
    2 inputs efectivo + tarjeta (mismas con cálculos).

  Selector PROPINA chips: 0/10/15/20/Otra (ya viene del pedido pero editable).
  Switch "Identificar cliente": muestra/oculta inputs (cédula, nombre, email).

Footer sticky bottom:
  Btn-primary full-width grande "Cobrar — $87.400" (con propina ya incluida).
    Click:
      UI.toast({type:'success', title:'Venta #4821 registrada'});
      setTimeout(() => location.href = '/mesero/mapa.html', 1200);
```

### Hecho cuando

- Total destacado arriba.
- Tabs método cambian panel.
- Vuelto se calcula en vivo al tipear.
- "Cobrar" muestra toast y vuelve al mapa.
- Sin bottom-tab visible.

---

## Sección 7.10 — Perfil E9

### Prompt para Claude Code

```
Leé design-system/mesero/mesero-e9-perfil.jsx (135 líneas).

Crear mesero/perfil.html partiendo de _layout.html.

Topbar: título "Perfil" + ícono settings (gear).

Contenido:
  Header card grande:
    Avatar 80x80 + nombre + "Mesero · Sede Norte" + badge "Turno activo".

  Stats del turno (3 KPIs apilados o grid 3):
    Mesas atendidas: 8
    Ventas: $1.245.000
    Propinas: $124.500

  Lista de opciones (cada item: ícono + texto + chevron):
    .menu-item (padding 14, border-bottom, display flex items-center gap 12, cursor pointer)
    
    - Mi turno (ícono clock) → modal con detalles del turno.
    - Mis comandas del día (ícono list) → comandas.html.
    - Estadísticas (ícono bar-chart) → modal stats mock.
    - Cambiar PIN (ícono lock) → modal cambio PIN (no funcional, mock).
    - Tema (ícono moon/sun) → toggle tema directo.
    - Notificaciones (ícono bell) → toggle switch.
    - Idioma (ícono globe) → "Español" como subtexto.
    - Soporte (ícono life-buoy) → modal contacto.
    - Cerrar sesión (ícono log-out, color error) → confirma → /mesero/login.html.

Bottom-tab "Perfil" activa.
```

### Hecho cuando

- Avatar + stats + lista de opciones legible.
- Toggle tema funciona desde la lista.
- Cerrar sesión vuelve a login.

---

## Checklist final del Sprint 7

- [ ] Frame iPhone visible en desktop, fullscreen en mobile.
- [ ] login.html: PIN 1234 navega, otro PIN hace shake.
- [ ] sala.html: lista compacta de mesas.
- [ ] mapa.html: grid 2 cols con estados.
- [ ] detalle.html: comanda actual + acciones agregar/cobrar.
- [ ] catalogo.html: grid 2 cols + bottom-sheet animado.
- [ ] comandas.html: 3 tabs, cards con estados, botones según estado.
- [ ] cobro.html: 4 métodos, vuelto en vivo, propina chips.
- [ ] perfil.html: stats + lista opciones, cerrar sesión vuelve a login.
- [ ] Bottom-tab navega entre Mapa/Comandas/Perfil.
- [ ] Tema dark perfecto en todas.

Commit: `feat: sprint 7 app mesero móvil completa`. Pasamos al Sprint 8 (KDS).
