# Sprint 09 — Storefront (6 pantallas)

> **Objetivo:** cara al cliente — carta digital QR (móvil), tienda online (desktop), checkout y confirmación.
> **Estimado:** 5–6 horas.
> **Pantallas:** F1 (carta QR mobile), F2 (detalle producto mobile), F3 (tienda home desktop), F4 (catálogo tienda desktop), F5 (checkout desktop), F6 (confirmación mobile + desktop).
> **Dependencias:** Sprint 0 (tokens, overlays).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| Shell storefront | `design-system/storefront/sf-shared.jsx` (224 líneas) |
| F1 Carta QR | `design-system/storefront/sf-f1-carta-qr.jsx` (219 líneas, mobile) |
| F2 Detalle producto | `design-system/storefront/sf-f2-detalle-producto.jsx` (232 líneas, mobile) |
| F3 Tienda home | `design-system/storefront/sf-f3-tienda-home.jsx` (260 líneas, desktop) |
| F4 Catálogo | `design-system/storefront/sf-f4-tienda-catalogo.jsx` (269 líneas, desktop) |
| F5 Checkout | `design-system/storefront/sf-f5-checkout.jsx` (377 líneas, desktop) |
| F6 Confirmación | `design-system/storefront/sf-f6-confirmacion.jsx` (291 líneas, mobile + desktop) |

---

## Sección 9.1 — Shell storefront + Carta QR F1 (mobile)

### Prompt para Claude Code

```
Leé:
  - design-system/storefront/sf-shared.jsx (224 líneas) — header público, branding del restaurante
  - design-system/storefront/sf-f1-carta-qr.jsx (219 líneas)

El storefront es la cara pública. Tiene dos shells distintos:
  - F1, F2, F6 → MOBILE (la gente abre desde su celular escaneando un QR)
  - F3, F4, F5 → DESKTOP (e-commerce, pedido online a domicilio)

Para F1 (mobile-first, sin frame iPhone esta vez — es una página web real abierta en el celular):

Crear assets/css/storefront.css:

SHELL F1 (carta QR mobile):
  .sf-mobile-shell {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    bg var(--bg);
  }

  .sf-header (sticky top 0, z-index 30, bg, border-bottom):
    height 60, padding 0 16, display flex items-center gap 12.
    Logo del restaurante (placeholder con "EB" sobre bg accent o naranja).
    Nombre "El Buen Sabor" + sub "Sede Norte · Mesa 5".
    Spacer.
    Botón ícono "search".

  .sf-content (flex 1, padding 16, padding-bottom 100):
    Sección hero compacta:
      Banner pequeño (height 120) con foto del restaurante (gradiente como placeholder).
      Info superpuesta:
        "El Buen Sabor" (font-size 20, font-weight 700, color #fff, text-shadow).
        Chips: "⭐ 4.8 (240)" / "🕒 Abierto" / "📍 Sede Norte".

  Crear storefront/carta.html.

  Tabs categorías horizontales scroll-x sticky (debajo del header):
    .sf-cat-tabs (display flex gap 6, overflow-x auto, padding 12 16,
                   position sticky top 60, bg, z-index 25, border-bottom)
    Cada tab: padding 8 14, border-radius 20, bg alt, font-size 13.
    Activa: bg accent, color #fff.
    Tabs: Entradas / Platos fuertes / Hamburguesas / Bebidas / Postres / Combos.

  Lista de productos en sections por categoría (cada sección con header):
    <h2 class="sf-cat-header">Entradas</h2>
    .sf-product-card:
      Card horizontal, display flex gap 12, padding 12,
      border-bottom 1px solid border (no border-radius — feed continuo).
      Izq: foto 80x80 border-radius 10.
      Centro:
        Nombre (font-weight 600).
        Descripción 2 líneas (font-size 12, color muted, line-clamp 2).
        Precio destacado (font-weight 700, color text).
        Si tiene badges: "Más pedido", "Picante 🌶", "Vegano 🌱".
      Der: botón "+" circular grande (40x40, bg accent, color #fff).
      Click en card → /storefront/producto.html?id=X
      Click en + → animación + agrega a carrito (toast pequeño).
    20+ productos distribuidos en 5 categorías.

  Bottom bar CARRITO (sticky bottom, oculto si carrito vacío):
    .sf-cart-bar (position fixed bottom 0, left 0, right 0,
                   bg accent, color #fff, padding 14 18,
                   display flex justify-between items-center, z-index 40,
                   box-shadow 0 -4px 20px rgba(0,0,0,.15)):
      Izq: ícono shopping-bag + chip "3" + texto "Ver pedido".
      Der: total "$42.000" → click va a "/storefront/checkout.html" (o muestra modal).

  JS:
    Estado window.cart = [].
    addToCart(productId) → push, actualiza counter + bar visible.
    Click "+" en producto: addToCart(id), micro-animación bounce en bar, toast pequeño.

  Click tab categoría → scrollIntoView de la sección correspondiente.
  IntersectionObserver opcional para marcar tab activa según scroll.

RESPONSIVE:
  Esta pantalla es mobile-first. En desktop NO mostrar frame iPhone (es una página web real
  que se ve en cualquier ancho).
  En desktop, contenedor max-width 480 centrado, lo demás bg neutral.
    @media (min-width: 768px) {
      .sf-mobile-shell { max-width: 480px; margin: 0 auto; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
      body { background: var(--alt); }
    }
```

### Hecho cuando

- Header del restaurante con info de mesa.
- Tabs categorías scroll-x sticky.
- 20+ productos en 5 categorías visibles.
- Click "+" agrega y muestra bar inferior.
- En desktop, layout centrado max-480.

---

## Sección 9.2 — Detalle de producto F2 (mobile)

### Prompt para Claude Code

```
Leé design-system/storefront/sf-f2-detalle-producto.jsx (232 líneas).

Crear storefront/producto.html (mobile, mismo shell que carta).

ESTRUCTURA:

Header con back arrow + título corto producto + ícono share/heart.

Body:
  Hero foto grande (full width, height 240, foto placeholder con gradient).
  Card principal (margen-top negativo -24 para overlap con hero, bg, border-radius xl, padding 18):
    Header: nombre grande (font-size 24, font-weight 700) + chip "Más pedido".
    Línea info: ⭐ 4.8 (124 reseñas) · 🕒 18 min preparación.
    Descripción larga (font-size 14, color muted, line-height 1.6).
    Precio destacado abajo (font-size 22, font-weight 700, color accent).

  Sección "Información nutricional" (chips horizontales):
    Calorías 420 kcal / Proteínas 25g / Grasas 18g / Carbohidratos 32g.

  Sección "Alergenos":
    Chips: Gluten, Lactosa (con ícono ⚠).

  Sección modificadores (cada grupo card separado):
    Card "Tamaño · Obligatorio":
      Radio list grande:
        ○ Mediana — $0.00
        ◉ Grande — +$4.000  (seleccionada)
    Card "Adiciones · Opcional, máx 3":
      Checkbox list:
        ☐ Queso extra — +$2.500
        ☐ Tocineta — +$3.000
        ☐ Aguacate — +$2.000

  Sección "Observaciones":
    Textarea grande "Ej: sin sal, sin gluten...".

  Selector cantidad grande:
    Display flex justify-center, padding 16.
    Botón − (44x44) / número grande / botón + (44x44).

Footer sticky bottom:
  .sf-footer-bar (sticky bottom 0, bg, border-top, padding 14 18,
                   display flex gap 12, align-items center, z-index 40):
    Izq (40%): precio total actualizado "Total: $42.500" (recalcula al cambiar modifs).
    Der (60%): btn-primary full-width grande "Agregar al pedido".
      Click: addToCart + UI.toast({type:'success', title:'Agregado al pedido'});
        setTimeout(() => history.back(), 800);

JS:
  Listeners en radios/checkboxes/cantidad: recalcular precio total en vivo.

RESPONSIVE:
  Mismo patrón del 9.1: en desktop max-width 480 centrado.
```

### Hecho cuando

- Hero foto + card overlap.
- Grupos de modificadores con radio/checkbox.
- Total recalcula en vivo.
- Footer "Agregar al pedido" funciona.

---

## Sección 9.3 — Tienda home F3 (desktop)

### Prompt para Claude Code

```
Leé design-system/storefront/sf-f3-tienda-home.jsx (260 líneas).

Crear storefront/tienda.html.

Esta es la versión "delivery" o "pedido online" — pensada para desktop principalmente
(pero responsive a mobile también).

Crear shell distinto del de F1:

  .sf-desktop-shell {
    width: 100%;
    min-height: 100vh;
    bg var(--bg);
  }

  .sf-public-header (sticky top 0, z-index 30, bg, border-bottom, padding 0 32):
    height 72, max-width 1280, margin 0 auto, display flex items-center gap 24.
    Logo grande del restaurante (con texto "El Buen Sabor").
    Nav links: Inicio (activo) / Carta / Sucursales / Sobre nosotros / Contacto.
    Spacer.
    Search bar compacto (placeholder "Buscar productos...").
    Selector sucursal (chip con dropdown).
    Botón "Iniciar sesión" ghost.
    Botón "Carrito (0) — $0" primary (cambia número/total con JS).

  En mobile: hamburguesa + logo + carrito chip. Nav links se ocultan en drawer izq.

  .sf-content max-width 1280, margin 0 auto, padding 24.

CONTENIDO de tienda.html:

1) Hero principal (carrousel mock o estático):
   .sf-hero (height 360, border-radius xl, position relative, overflow hidden,
              background linear-gradient + foto placeholder):
     Bg con gradiente colorido (warm orange-red).
     Content centered (color #fff):
       Eyebrow "Pide y disfruta" (font-size 12 uppercase).
       Title "La auténtica comida colombiana, ahora a tu puerta" (font-size 38, font-weight 700).
       Subtitle "Bandeja paisa, ajiaco, arepas y mucho más" (font-size 16).
       Botón "Ver carta →" grande blanco-sobre-transparente con border.
     En la esquina derecha: chips "Envío gratis +$30k" / "🚀 Promedio 35 min" / "⭐ 4.8".

2) Categorías destacadas (scroll horizontal):
   Header "Categorías" + link "Ver todas →".
   Display flex gap 14, overflow-x auto.
   Cada categoría card 200x140:
     Foto placeholder con gradient.
     Overlay con título grande (color #fff).
     6 categorías mínimo.

3) Combo del día (banner destacado):
   .sf-combo-banner (display grid grid-template-columns 1fr 1fr, gap 18,
                      bg accent suave, border-radius xl, padding 32, align-items center):
     IZQ:
       Eyebrow "COMBO DEL DÍA" en accent.
       Title "Bandeja paisa familiar" (font-size 28).
       Description.
       Stats inline: "Antes: $89.000 (tachado) Ahora: $69.000".
       COUNTDOWN destacado:
         "Termina en: 02:34:18" (formato HH:MM:SS, actualiza cada segundo con JS).
         CSS .countdown { font-variant-numeric: tabular-nums; font-weight: 700; }
       Botón "Pedir ahora →" primary grande.
     DER:
       Foto del combo (placeholder).

   JS countdown:
     const end = new Date(Date.now() + 1000*60*60*3); // 3 horas desde ahora
     setInterval(() => {
       const diff = end - Date.now();
       const h = Math.floor(diff/3600000).toString().padStart(2,'0');
       const m = Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
       const s = Math.floor((diff%60000)/1000).toString().padStart(2,'0');
       document.querySelector('.countdown').textContent = `${h}:${m}:${s}`;
     }, 1000);

4) Sección "Lo más pedido":
   Grid 4 cols (responsive: 4 → 3 → 2 → 1).
   Cards estilo e-commerce (.sf-product-card-grid):
     Foto cuadrada arriba.
     Body: nombre, descripción 2 líneas, precio, botón "+ Agregar".
     Badge "Más pedido" o "Sin stock" arriba-izq.
   8 productos.

5) Testimonios (sección):
   3 cards horizontal con avatar + nombre + estrellas + comentario corto.

6) FAQ rápido (acordeón):
   3-4 preguntas con expand: ¿Cuánto tarda la entrega? / ¿Aceptan tarjeta? / ¿Hacen catering? / ...
   Click en header expande respuesta.

7) Footer público (.sf-footer):
   bg alt, padding 40 32, max-width 1280, margin 0 auto.
   Grid 4 cols: marca / enlaces / sucursales / newsletter.
   Copyright bottom + redes sociales.

RESPONSIVE:
  Hero: en mobile, layout vertical, font sizes más chicos.
  Categorías: scroll-x ya funciona.
  Combo: 1 col en mobile (foto arriba o abajo).
  Productos: grid auto-fit.
  FAQ: full width, mantener.
  Footer: 4 cols → 2 → 1.
```

### Hecho cuando

- Hero con call-to-action grande.
- Categorías scroll-x.
- Combo del día con countdown actualizando cada segundo.
- Productos grid responsive.
- FAQ funcional.
- Footer completo.

---

## Sección 9.4 — Catálogo tienda F4 (desktop)

### Prompt para Claude Code

```
Leé design-system/storefront/sf-f4-tienda-catalogo.jsx (269 líneas).

Crear storefront/tienda-catalogo.html (mismo shell desktop que tienda home).

ESTRUCTURA:

1) Breadcrumb mini: Inicio › Catálogo › Hamburguesas.

2) Page header:
   Título "Hamburguesas" (font-size 28).
   Subtítulo "18 productos".

3) Layout split:
   .sf-catalog-layout {
     display: grid;
     grid-template-columns: 240px 1fr;
     gap: 24;
   }

   IZQ — sidebar filtros (.sf-filters):
     Card sticky (top 90):
       Header "Filtros" + botón "Limpiar (3)".

       Sección "Categorías":
         Checkbox list (con contadores):
           ☐ Entradas (8)
           ☐ Platos fuertes (12)
           ☑ Hamburguesas (18)
           ☐ Bebidas (24)
           ☐ Postres (6)

       Sección "Precio":
         Range slider doble (visual mock):
           Min $5.000 — Max $50.000.
         Inputs min/max debajo.

       Sección "Restricciones dietarias":
         Chips toggleables:
           Vegetariano / Vegano / Sin gluten / Sin lactosa / Picante.

       Sección "Calificación":
         Chips: ⭐ 4+ / ⭐ 3+ / Sin filtro.

       Sección "Tiempo de preparación":
         Radio: Cualquiera / <15 min / 15-30 min / >30 min.

   DER — contenido:
     Toolbar (.sf-catalog-toolbar):
       Izq: chips de filtros activos (con × para quitar).
       Spacer.
       Selector ordenar: "Relevancia" / "Precio: menor a mayor" / "Precio: mayor a menor" / "Más vendidos" / "Mejor calificados".
       Toggle vista: [grid] | [list].

     Grid productos:
       grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)).
       gap: 16.

       12-18 cards (más densas que en home):
         Foto cuadrada.
         Badges flotantes (top-left): "Más pedido", "Nuevo", "Sin stock" (gris).
         Botón heart top-right (favorito mock).
         Body:
           Categoría chip pequeño.
           Nombre (font-weight 600).
           Descripción 2 líneas.
           Stats: ⭐ 4.7 · 🕒 18 min.
           Precio + botón "+ Agregar".
         Card "Sin stock": opacity .5, botón deshabilitado "Sin disponibilidad".

     Paginación abajo (1 - 18 de 24 productos).

JS:
  Filtros checkbox: agregar/quitar chip de filtros activos arriba, ocultar productos que
    no matcheen (data-categoria, data-precio).
  Selector ordenar: reordenar productos (mock simple por precio asc/desc).
  Click + en producto: addToCart + toast + bounce en counter del carrito.

RESPONSIVE:
  @media (max-width: 1024px):
    .sf-catalog-layout { grid-template-columns: 1fr; }
    Filtros → drawer izquierdo, botón "Filtros (3)" arriba abre drawer.
  @media (max-width: 640px):
    Grid 2 cols. Toolbar wrap.
```

### Hecho cuando

- Sidebar filtros sticky con varios tipos.
- Chips de filtros activos arriba (removibles).
- Grid de productos con badges y stock.
- Mobile: filtros en drawer.

---

## Sección 9.5 — Checkout F5 (desktop)

### Prompt para Claude Code

```
Leé design-system/storefront/sf-f5-checkout.jsx (377 líneas — la más densa del storefront).

Crear storefront/checkout.html (mismo shell desktop).

ESTRUCTURA:

1) Header con stepper 3 pasos arriba:
   .sf-stepper (display flex justify-center gap 8, padding 24, border-bottom):
     Cada paso .sf-step:
       Círculo numerado (28x28).
       Label debajo.
       Línea horizontal entre pasos.
     Paso 1 "Entrega" — activo (bg accent, color #fff).
     Paso 2 "Pago" — pendiente.
     Paso 3 "Confirmación" — pendiente.

2) Layout split:
   .sf-checkout-layout {
     display: grid;
     grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
     gap: 32;
     max-width: 1100;
     margin: 0 auto;
     padding: 24 32;
   }

   IZQ — formulario:
     PASO 1 (visible default — sección "Entrega"):
       Card "Información de contacto":
         Grid 2 cols: Nombre / Apellido.
         Email.
         Teléfono (+57).

       Card "Tipo de entrega":
         3 radio cards horizontales (.sf-radio-card):
           ◉ A domicilio — 30-45 min — $5.000
           ○ Recoger en local — 15 min — Gratis
           ○ Para comer aquí — 10 min — Gratis
         CSS .sf-radio-card:
           padding 14 18, border 2px solid border, border-radius lg, cursor pointer,
           display flex items-center gap 12.
         .sf-radio-card.is-selected: border accent, bg accent suave.

       Card "Dirección de entrega" (visible si "A domicilio"):
         Dirección (input grande).
         Detalles (apto/torre/referencia).
         Ciudad + Barrio (selects).
         Mapa placeholder (gradient con pin en el centro):
           .sf-map-placeholder (height 200, border-radius lg, bg lineal con marker SVG centrado).
           Botón overlay "Confirmar ubicación".

       Card "Recoger en sucursal" (visible si "Recoger en local"):
         Lista de sucursales radio:
           Sede Norte — Chapinero (activa)
           Sede Centro — Centro Internacional
           Sede Sur — Restrepo (inactiva)

       Footer del paso:
         btn-secondary "Seguir comprando" (← link a catálogo)
         btn-primary "Continuar al pago →" (avanza al paso 2).

     PASO 2 (oculto inicial, mostrar al click):
       Card "Método de pago":
         3 radio cards:
           ◉ Tarjeta crédito/débito
           ○ PSE
           ○ Pago contra entrega (efectivo / datafono)
         Si tarjeta: inputs Número tarjeta / Titular / Vencimiento / CVV.
       Card "Cupón":
         Input + botón "Aplicar".
         Si aplica un cupón mock "BUENSABOR10" → toast "Descuento 10% aplicado", recalcula resumen.
       Card "Notas para el restaurante" (opcional textarea).
       Footer:
         btn-secondary "← Volver"
         btn-primary "Confirmar pedido →" (avanza al paso 3).

     PASO 3:
       Redirigir a /storefront/confirmacion.html (F6).
       O mostrar el contenido de F6 inline.

   DER — resumen sticky del pedido:
     Card .sf-order-summary (position sticky, top 90):
       Header "Tu pedido" + chip "5 ítems".
       Lista de items (cada uno):
         Foto pequeña + cantidad × nombre + precio.
         Modificadores debajo (compactos, color muted).
         Botón × pequeño para quitar.
       6 items mock.
       Divider.
       Resumen:
         Subtotal: $XX.XXX
         Descuento (si cupón): -$X.XXX (verde).
         Envío: $5.000.
         IVA incluido: (info).
         TOTAL: $XX.XXX (font-size 22, font-weight 700).
       Tiempo estimado: "Entrega 35-45 min" (info).

JS:
  Stepper: función goToStep(n) muestra/oculta paso, actualiza visual del stepper.
  Botones radio cards: agregar/quitar .is-selected.
  Tipo entrega "A domicilio" → muestra card dirección, esconde sucursales. Y viceversa.
  Aplicar cupón "BUENSABOR10" → recalcular resumen + toast success.
  "Confirmar pedido" → location.href = '/storefront/confirmacion.html'.

RESPONSIVE:
  @media (max-width: 1024px):
    .sf-checkout-layout { grid-template-columns: 1fr; }
    Resumen va arriba del form (o como accordion collapsable).
  @media (max-width: 768px):
    Stepper compactado, mostrar solo número del paso activo.
    Radio cards stack vertical.
```

### Hecho cuando

- Stepper 3 pasos visible.
- Paso 1: tipo entrega cambia el contenido (dirección/sucursal).
- Paso 2: métodos de pago, cupón aplicable.
- Resumen sticky a la derecha actualiza con cupón.
- "Confirmar pedido" navega a confirmación.

---

## Sección 9.6 — Confirmación F6 (mobile + desktop)

### Prompt para Claude Code

```
Leé design-system/storefront/sf-f6-confirmacion.jsx (291 líneas).

Crear storefront/confirmacion.html.

Esta pantalla DEBE verse bien en mobile (la mayoría revisa el pedido desde el celular) Y
en desktop. Usar shell desktop con max-width 720 centrado.

ESTRUCTURA:

1) Hero centrado:
   Padding 48 24, text-align center.
   Checkmark animado SVG (círculo verde con tick que dibuja):
     <svg viewBox="0 0 80 80" width="80" height="80">
       <circle cx="40" cy="40" r="36" stroke="var(--success)" stroke-width="3" fill="none"
               stroke-dasharray="226" stroke-dashoffset="226"
               style="animation: dash-circle 0.6s ease-out forwards"/>
       <path d="M 24 42 L 36 54 L 56 30" stroke="var(--success)" stroke-width="4" fill="none"
             stroke-linecap="round" stroke-linejoin="round"
             stroke-dasharray="60" stroke-dashoffset="60"
             style="animation: dash-tick 0.4s ease-out 0.6s forwards"/>
     </svg>
     CSS:
       @keyframes dash-circle { to { stroke-dashoffset: 0; } }
       @keyframes dash-tick { to { stroke-dashoffset: 0; } }

   Título "¡Pedido confirmado!" (font-size 28, font-weight 700, margin-top 24).
   Subtítulo "Tu pedido #ORD-4821 está en camino" (color muted).
   Estimado prominente: "Llega entre 13:45 — 14:00" (font-size 18, font-weight 600).

2) Tracker timeline (componente clave):
   .sf-tracker (display flex flex-col gap 0, padding 24, max-width 480, margin 0 auto):
     4 etapas, cada una .sf-tracker-step:
       display flex gap 14, padding 12 0.
       Izq:
         Círculo 32x32 con ícono + línea vertical hacia el siguiente paso.
         Estados:
           done → bg success, ícono check #fff, línea verde.
           current → bg accent, ícono específico, ANIMACIÓN PULSE, línea gris.
           pending → bg alt, ícono outline gris, línea gris.
       Centro:
         Título del paso (font-weight 600).
         Hora estimada o real (font-size 12, color muted).

     4 etapas:
       1. "Pedido recibido" — 13:12 — done (check).
       2. "En preparación" — 13:18 — current (chef-hat con pulse).
       3. "Listo para entrega" — pendiente — pending.
       4. "Entregado" — pendiente — pending.

     CSS pulse del current:
       .sf-tracker-step.current .sf-tracker-icon { animation: tracker-pulse 1.5s infinite; }
       @keyframes tracker-pulse {
         0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,.4); }
         50% { box-shadow: 0 0 0 8px rgba(79,70,229,0); }
       }

3) Card "Detalles del pedido":
   Pedido #ORD-4821
   Fecha: 14 mar 2025, 13:12
   Sucursal: Sede Norte
   Tipo: Entrega a domicilio

4) Card "Items del pedido":
   Lista compacta de items con cantidades.
   Divider.
   Subtotal, Descuento (si aplica), Envío, Total destacado.

5) Card "Dirección de entrega":
   Avenida Calle 100 #15-23, Apto 502, Bogotá.
   "Llamar a 31X-XXX-XXXX al llegar".
   Mapa pequeño placeholder con pin.

6) Card "Método de pago":
   Tarjeta Visa terminada en •••• 4521.
   Total pagado: $XX.XXX.

7) Acciones bottom:
   Btn-primary full-width "Hacer otro pedido →" → /storefront/tienda.html
   Btn-ghost full-width "Ver mis pedidos" (mock).
   Btn-ghost full-width "Cancelar pedido" (color error, mock — abre modal confirma).

8) JS opcional:
   Simular avance del tracker después de N segundos:
     setTimeout(() => {
       cambiar paso 2 a done, paso 3 a current con pulse.
     }, 30000); // 30s en demo
   No prioritario pero suma mucho a la sensación de "vivo".

RESPONSIVE:
  Funciona en mobile naturalmente (max-width 720 ya es chico).
  En mobile real, padding reducido, tracker más compacto.
```

### Hecho cuando

- Checkmark SVG dibujándose al cargar (animación).
- Tracker con 4 pasos, current con pulse.
- Detalles del pedido + dirección + método pago visibles.
- Botones funcionan: "Hacer otro pedido" vuelve a tienda.
- Se ve bien en mobile y desktop.

---

## Checklist final del Sprint 9

- [ ] carta.html: header restaurante, tabs categorías scroll-x, lista productos, cart bar inferior.
- [ ] producto.html: hero foto, modificadores, total en vivo, sticky footer.
- [ ] tienda.html: hero grande, combo con countdown, productos grid, FAQ acordeón.
- [ ] tienda-catalogo.html: filtros sidebar, chips activos, grid con badges.
- [ ] checkout.html: stepper 3 pasos, tipo entrega cambia campos, cupón aplicable, resumen sticky.
- [ ] confirmacion.html: checkmark animado, tracker con pulse en current, detalles completos.
- [ ] Carrito persiste entre páginas (localStorage opcional).
- [ ] Tema dark perfecto.
- [ ] Mobile: shell mobile en F1/F2/F6, desktop responsive en F3/F4/F5.

Commit: `feat: sprint 9 storefront completo`. Pasamos al Sprint 10 (Pulido y QA).
