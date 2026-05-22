# Mejoras UX — App Mesero

> **Estado:** propuesta · pendiente de aprobación por sección.
> **Alcance:** amplia (colores de mesas + claridad de flujo + jerarquía visual por pantalla).
> **Principio:** lo que ya funciona se mantiene. Estos son ajustes sobre lo existente, no rediseño.
> **Stack:** sigue siendo HTML + CSS + JS vanilla (sin frameworks ni build).

---

## Resumen de problemas detectados

### 1. Colores de mesas poco diferenciables
Hoy todos los estados de mesa usan fondos **translúcidos al 6–8%** sobre la misma superficie. En pantallas pequeñas y con luz exterior (caso real del mesero en piso) **una mesa "ocupada" y una "por cobrar" se ven casi iguales**. La señal de color queda confiada al texto del número, que es pequeño.

Hallazgos concretos en `assets/css/mesas.css`:
- `--mesa-libre-bg` = blanco puro → no se distingue del fondo del frame.
- `--mesa-ocupada-bg` = rgba(239,68,68,**0.06**) → fondo casi invisible.
- `--mesa-por-cobrar-bg` = rgba(245,158,11,**0.07**) → idem.
- No hay un **acento lateral** (barra de color) que dé lectura instantánea.
- "Reservada" y "ocupada" usan el mismo patrón visual (solo cambia el tinte) → riesgo de confusión en mesas con poca capacidad.

### 2. Flujo entre pantallas sin "rastro de migas"
El mesero entra a una mesa y atraviesa hasta 4 pantallas (`mapa → detalle → catálogo → bottom-sheet → detalle → cobro`). Hoy:
- El topbar muestra solo "Mesa #5" sin indicar **en qué paso del flujo estoy**.
- Al volver de cobro al mapa no hay confirmación visual de qué pasó (toast desaparece en 2s).
- El bottom-tab "Mesas" queda activo durante todo el flujo de pedido — visualmente correcto, pero no comunica progreso.
- El usuario nuevo se pregunta "¿este botón me lleva a cobrar o agregar más?" porque ambos botones del footer de `detalle.html` tienen peso visual parecido.

### 3. Jerarquía visual irregular entre pantallas
- `mapa.html`: bien jerarquizado (saludo + sede + tabs + chips resumen + grid).
- `detalle.html`: el banner verde "¡Listo!" compite con el total de la mesa.
- `catalogo.html`: la card de producto tiene foto de 96px pero ícono SVG genérico al 35% de opacidad → se ve "vacía".
- `cobro.html`: el monto total no es lo primero que se ve (queda compitiendo con tabs de método).
- `comandas.html`: cards muy similares entre sí independientemente del estado.

---

## Sección 1 — Nueva paleta de estados de mesa

### 1.1 Objetivos
- **Subir contraste** sin perder la estética Vercel/translúcida.
- Agregar **barra/acento lateral** de 4px en cada card (línea de color saturada al 100%) como señal primaria de estado, manteniendo el fondo translúcido como señal secundaria.
- **Separar visualmente "reservada"** de "ocupada" — hoy ambas son tintes cálidos.
- Mantener compatibilidad con dark mode (Vercel-style).

### 1.2 Paleta propuesta — modo claro

Reemplaza el bloque `:root` en `assets/css/mesas.css` (líneas 10–30):

```css
:root {
  /* LIBRE — superficie neutra con borde sutil teñido */
  --mesa-libre-bg:      #FFFFFF;
  --mesa-libre-border:  #E4E4E7;
  --mesa-libre-text:    #52525B;
  --mesa-libre-accent:  #A1A1AA;    /* gris medio para barra lateral */

  /* OCUPADA — rojo coral, más saturado pero translúcido */
  --mesa-ocupada-bg:     rgba(239, 68, 68, 0.10);
  --mesa-ocupada-border: rgba(239, 68, 68, 0.30);
  --mesa-ocupada-text:   #991B1B;
  --mesa-ocupada-accent: #EF4444;   /* barra lateral 100% */

  /* POR COBRAR — ámbar destacado (acción pendiente) */
  --mesa-por-cobrar-bg:     rgba(245, 158, 11, 0.12);
  --mesa-por-cobrar-border: rgba(245, 158, 11, 0.35);
  --mesa-por-cobrar-text:   #92400E;
  --mesa-por-cobrar-accent: #F59E0B;

  /* RESERVADA — púrpura suave (separa visualmente de cálidos) */
  --mesa-reservada-bg:     rgba(139, 92, 246, 0.10);
  --mesa-reservada-border: rgba(139, 92, 246, 0.30);
  --mesa-reservada-text:   #5B21B6;
  --mesa-reservada-accent: #8B5CF6;

  /* LIMPIEZA — gris diagonal (sin tinte, transmite "fuera de servicio") */
  --mesa-limpieza-bg:     rgba(113, 113, 122, 0.08);
  --mesa-limpieza-border: rgba(113, 113, 122, 0.22);
  --mesa-limpieza-text:   #52525B;
  --mesa-limpieza-accent: #71717A;
}
```

### 1.3 Paleta propuesta — modo oscuro

```css
[data-theme="dark"] {
  --mesa-libre-bg:      #111111;
  --mesa-libre-border:  rgba(255,255,255,0.10);
  --mesa-libre-text:    #A1A1AA;
  --mesa-libre-accent:  #52525B;

  --mesa-ocupada-bg:     rgba(244, 63, 94, 0.14);
  --mesa-ocupada-border: rgba(244, 63, 94, 0.35);
  --mesa-ocupada-text:   #FDA4AF;
  --mesa-ocupada-accent: #F43F5E;

  --mesa-por-cobrar-bg:     rgba(234, 179, 8, 0.14);
  --mesa-por-cobrar-border: rgba(234, 179, 8, 0.35);
  --mesa-por-cobrar-text:   #FDE047;
  --mesa-por-cobrar-accent: #EAB308;

  --mesa-reservada-bg:     rgba(167, 139, 250, 0.14);
  --mesa-reservada-border: rgba(167, 139, 250, 0.32);
  --mesa-reservada-text:   #C4B5FD;
  --mesa-reservada-accent: #A78BFA;

  --mesa-limpieza-bg:     rgba(161, 161, 170, 0.08);
  --mesa-limpieza-border: rgba(161, 161, 170, 0.22);
  --mesa-limpieza-text:   #A1A1AA;
  --mesa-limpieza-accent: #71717A;
}
```

### 1.4 Barra lateral de acento (4px)

Agregar al `.mesa-card`:

```css
.mesa-card {
  position: relative;
  padding-left: 14px;   /* deja espacio para la barra */
}
.mesa-card::before {
  content: '';
  position: absolute;
  top: 8px; bottom: 8px; left: 0;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: var(--mesa-libre-accent);
}
.mesa-card[data-estado="ocupada"]::before    { background: var(--mesa-ocupada-accent); }
.mesa-card[data-estado="por-cobrar"]::before { background: var(--mesa-por-cobrar-accent); }
.mesa-card[data-estado="reservada"]::before  { background: var(--mesa-reservada-accent); }
.mesa-card[data-estado="limpieza"]::before   { background: var(--mesa-limpieza-accent); }
```

### 1.5 Pulse sutil en "por cobrar"

Hoy no hay indicación temporal. Propuesta: animación de la barra lateral en estado "por cobrar" para llamar la atención sin ser intrusiva.

```css
@keyframes mesa-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
}
.mesa-card[data-estado="por-cobrar"]::before {
  animation: mesa-pulse 1.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .mesa-card[data-estado="por-cobrar"]::before { animation: none; }
}
```

### 1.6 Hecho cuando
- Las 4 estados son distinguibles a 1 metro de distancia.
- "Reservada" no se confunde con "ocupada" (cálido vs frío).
- Barra lateral visible en grid y vista lista.
- Pulse "por cobrar" funciona y respeta `prefers-reduced-motion`.

---

## Sección 2 — Claridad del flujo entre pantallas

### 2.1 Stepper de progreso en el topbar (flujo de pedido)

Cuando el mesero está dentro del flujo de una mesa, mostrar un mini-stepper bajo el título que indique en qué paso está.

**Pantallas que llevan stepper:** `detalle.html`, `catalogo.html`, `cobro.html`.

```html
<div class="mesero-flow-stepper" data-step="2">
  <span class="step is-done">Mesa</span>
  <span class="step is-current">Pedido</span>
  <span class="step">Cobro</span>
</div>
```

```css
.mesero-flow-stepper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg);
}
.mesero-flow-stepper .step { display: inline-flex; align-items: center; gap: 6px; }
.mesero-flow-stepper .step + .step::before {
  content: '›';
  margin-right: 6px;
  color: var(--border-strong);
}
.mesero-flow-stepper .step.is-done    { color: var(--success); }
.mesero-flow-stepper .step.is-current { color: var(--accent); font-weight: 600; }
```

**Por qué:** el mesero nuevo entiende "estoy en el paso 2 de 3" sin tener que pensar. No reemplaza el topbar — lo acompaña.

### 2.2 Botón primario único por pantalla

Hoy `detalle.html` tiene **dos botones de igual peso** en el footer: "+ Agregar productos" y "Cobrar". Ambos primarios, mismo tamaño, lado a lado → el mesero duda.

**Propuesta:**
- "+ Agregar productos" pasa a `btn-secondary` (ghost con borde).
- "Cobrar — $87.400" se queda `btn-primary` y ocupa 60% del ancho (en vez de 50/50).
- En estado "por cobrar", "Cobrar" toma 100% del ancho y "+ Agregar" se mueve a un menú `⋮` del topbar.

### 2.3 Transiciones suaves entre pantallas (View Transitions)

Sin tocar JS de navegación, agregar en `tokens.css`:

```css
@view-transition { navigation: auto; }

@media (prefers-reduced-motion: reduce) {
  @view-transition { navigation: none; }
}
```

Y nombrar elementos clave para que la transición los conecte (el número de mesa "vuela" del mapa al detalle):

```css
.mesa-card-num                { view-transition-name: mesa-titulo; }
.mesero-topbar .titulo-mesa   { view-transition-name: mesa-titulo; }
```

**Por qué:** el mesero ve continuidad entre pantallas, no cortes bruscos. Soportado en Chromium 111+, Safari 18. Degrada gracefully en navegadores viejos (navegación normal).

### 2.4 Toast persistente al volver de cobro

Hoy `cobro.html` redirige a `mapa.html` con un toast que dura 2 segundos. Propuesta:
- Después del cobro, redirigir a `mapa.html?cobrada=5` (query param).
- En el mapa, si llega ese param, mostrar un **banner sticky verde** arriba del grid (no toast) con:
  > ✓ Mesa #5 cobrada · $87.400 · Lista para nuevo turno

  Botón "Cerrar" para dismissar. Si el mesero no lo cierra, se va solo en 8s. Da tiempo a leer y entender qué pasó.

### 2.5 Empty states con call-to-action claro

Hoy `mapa.html` con sala vacía muestra solo el texto "No hay mesas en esta sala". Propuesta:

```html
<div class="mm-empty">
  <i data-lucide="layout-grid"></i>
  <p class="mm-empty-title">Sala sin mesas configuradas</p>
  <p class="mm-empty-sub">Pedile al admin que agregue mesas desde Backoffice → Mesas.</p>
</div>
```

Igual para `comandas.html` vacío y `detalle.html` cuando la mesa está libre.

### 2.6 Hecho cuando
- Stepper visible en detalle/catálogo/cobro y refleja el paso correcto.
- Solo un botón primario por pantalla.
- Transiciones entre `mapa → detalle` se sienten conectadas.
- Volver de cobro deja un banner legible, no un toast fugaz.
- Empty states tienen ícono + título + sub + acción.

---

## Sección 3 — Jerarquía visual por pantalla

### 3.1 `mapa.html` — está bien, ajustes menores

- Subir el `font-size` del número de mesa de **22px → 24px** en mobile.
- Mover el chip de mesero (texto pequeño "Camila R.") debajo del total, no encima → el total es el dato más importante.
- En cards `libre`, centrar verticalmente el label "Libre" en vez de tenerlo flotando arriba.

### 3.2 `detalle.html` — bajar peso del banner "¡Listo!"

- El banner verde compite con la información de la mesa. Propuesta: convertirlo en un **chip compacto** sobre el header (con ícono + tiempo), no un banner full-width.
- Mover el **total de la mesa** al header de la pantalla (debajo del título "Mesa #5"), no al footer.
- Items por ronda: subir el separador de ronda de borde 1px a 2px y agregarle un punto de color (`var(--accent)`).

### 3.3 `catalogo.html` — productos más "ricos" visualmente

- Si no hay foto: en vez de un ícono SVG genérico al 35%, usar un **gradiente suave** con la inicial del producto (estilo Notion/Linear avatars). Ejemplo: "Hamburguesa Clásica" → fondo gradient + letra "H" grande.
- Subir altura de la card de 96 → 120px.
- Agregar badge "🔥 Top" en el top-3 más pedidos (mock).
- El footer sticky con "3 ítems · $42.000" debería tener fondo `var(--accent)` con texto blanco, no acento suave. Es el CTA y debe destacar.

### 3.4 `cobro.html` — total como protagonista absoluto

- El total `$87.400` debe ser **lo primero y más grande** de la pantalla: `font-size: 44px`, sin nada compitiendo arriba.
- Tabs de método de pago: pasar de 4 columnas a **2x2 grid de cards más grandes** con íconos de 32px (más fáciles de tocar con dedo).
- Quick amounts: subir tamaño de botón a `min-height: 48px` (target táctil iOS HIG).
- Vuelto: cuando es 0 o negativo (monto insuficiente), mostrar **rojo + ícono warning** ("Falta $12.600"). Hoy solo muestra el monto sin contexto.

### 3.5 `comandas.html` — más diferenciación por estado

- Cards de comanda con la **barra lateral de color** de la sección 1.4 (reutilizar la misma señal del mapa para consistencia).
- Header de card más prominente: "Mesa #5" en `font-size: 18px` + chip de tiempo más visible.
- Botón inline de la card: si está "lista para cobrar", el botón "Cobrar" debe ser `btn-primary` saturado, no ghost.

### 3.6 `sala.html` — alternativa al mapa

- Hoy es un selector de sala. Está OK pero la card seleccionada tiene `border: 2px` que cambia el padding (1px) → se nota un "jump" sutil. Solución: usar `box-shadow: inset 0 0 0 2px var(--accent)` en lugar de `border-width`.

### 3.7 `perfil.html`, `nomina.html`, `adelantos-historial.html`

Tienen menor prioridad (flujo lateral). Cambios sugeridos:
- Avatar del perfil 80px → 96px.
- KPIs del turno con fondo de card (no inline en texto).
- Lista de opciones del perfil: agregar grupos con headers (`OPERACIÓN`, `MI CUENTA`, `AJUSTES`).

### 3.8 Hecho cuando
- Cada pantalla tiene un único punto focal visual claro.
- El total/monto es siempre lo más grande cuando aplica.
- Cards de comanda y mesa comparten lenguaje visual (barra lateral).

---

## Sección 4 — Microinteracciones

### 4.1 Skeleton loaders en grid de mesas

Al entrar a `mapa.html` o cambiar de sala, mostrar 6 cards "fantasma" mientras el render JS completa. Hoy aparece todo de golpe (fine en dev, raro en prod con datos reales).

```css
.mesa-card.is-skeleton {
  background: linear-gradient(90deg, var(--alt) 0%, var(--bg) 50%, var(--alt) 100%);
  background-size: 200% 100%;
  animation: skeleton 1.4s linear infinite;
}
@keyframes skeleton {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 4.2 Haptic feedback en long-press de mesa (mobile)

En `mapa.html`, cuando se confirma el long-press (sheet de acciones), disparar:
```js
if (navigator.vibrate) navigator.vibrate(20);
```

Solo en dispositivos que lo soportan. Mejora drásticamente la sensación de "respuesta" en mobile real.

### 4.3 Animación de check al agregar al pedido

En el bottom-sheet de modificadores, cuando se toca "Agregar al pedido":
- El botón se queda 200ms con ícono check + texto "Agregado".
- Luego cierra el sheet.

Hoy cierra inmediatamente con toast. La confirmación visual en el botón es más inmediata que el toast.

---

## Plan de implementación sugerido

Trabajamos sección por sección, en este orden, **una a la vez con commit y validación visual entre cada una**:

1. **Sección 1** (colores de mesas) — toca solo `assets/css/mesas.css`. Riesgo: bajo. Impacto: alto.
2. **Sección 2.1 + 2.2** (stepper + botón primario único) — toca `detalle.html`, `catalogo.html`, `cobro.html` y `assets/css/mesero.css`.
3. **Sección 2.4** (banner post-cobro) — toca `cobro.html` y `mapa.html`.
4. **Sección 3.4** (cobro como protagonista) — solo `cobro.html`.
5. **Sección 3.2** (detalle limpio) — solo `detalle.html`.
6. **Sección 3.3** (catálogo más rico) — solo `catalogo.html`.
7. **Sección 3.5** (comandas con barra lateral) — `comandas.html`.
8. **Sección 2.3** (View Transitions) — `tokens.css` + nombres en mapa/detalle.
9. **Sección 4** (microinteracciones) — opcional, polish final.

**Fuera de scope de este doc:** rediseño de `audio-confirmar.html` (es un flujo experimental separado) y cambios al login PIN.

---

## Checklist de validación final

- [ ] Mesa libre, ocupada, por cobrar, reservada y limpieza se distinguen a primera vista.
- [ ] Barra lateral consistente entre `mapa.html` y `comandas.html`.
- [ ] Stepper visible y correcto en detalle/catálogo/cobro.
- [ ] Total grande y dominante en `cobro.html`.
- [ ] Footer del catálogo destaca como CTA, no como info.
- [ ] Banner post-cobro persiste lo suficiente para leerse.
- [ ] Modo oscuro coherente en todos los cambios.
- [ ] Sin librerías nuevas, sin build step, sin tocar la estructura de archivos.
