# NOVA — Design System

> Sistema de diseño para **NOVA**, un SaaS POS multi-sucursal para restaurantes
> en Colombia. Este folder es la fuente de verdad visual y de marca: tokens,
> fuentes, logo/branding, iconografía, componentes reutilizables y UI kits de
> las superficies reales del producto.
>
> **Heritage:** este sistema evolucionó del proyecto interno ROOT (índigo +
> Inter + Bebas Neue). El namespace del bundle (`window.ROOTDesignSystem_27eeaa`)
> y las clases alias `.root-*` se conservan para retro-compatibilidad durante
> la migración. Para código nuevo, usa siempre `.nova-*`.

---

## 1. Qué es NOVA

NOVA unifica en una sola plataforma toda la operación de un restaurante: punto
de venta, cocina, sala, administración y canal de ventas digital. Está pensado
para negocios de una o varias sucursales que necesitan **facturar
electrónicamente ante la DIAN**, controlar inventario en tiempo real y recibir
pedidos por múltiples canales sin coser sistemas distintos.

El producto se compone de **siete superficies** que conectan a todo el personal:

| Superficie | Para quién | Shell / forma |
|---|---|---|
| **Auth** | Negocio + sucursales | Split panel centrado, web responsive |
| **Backoffice** | Dueño / admin (~24 pantallas) | Sidebar 240px + topbar 56px, desktop/tablet |
| **POS Web** | Cajero / mesero | Topbar + bottombar fijos, tablet/desktop |
| **App Mesero** | Meseros | Frame mobile + bottom-tab, PIN `1234` |
| **KDS** | Cocina | Dark por defecto, grid para TV/tablet de pared |
| **Storefront** | Cliente final | Tienda online + carta QR, público |
| **Design System** | Base | Tokens, componentes, shells |

Capacidades transversales: multi-tenant/multi-sucursal, multi-rol (5 roles),
facturación DIAN homologada (MATIAS API), pasarelas locales (Wompi, ePayco),
canales de delivery (Rappi, Uber Eats, Didi Food, PedidosYa), KDS en tiempo
real, nómina y adelantos salariales, y **pedido por voz** (Web Speech API,
locale `es-CO`). Light/dark con toggle persistente, mobile-first 360 → 1920px.

> Restaurante demo dentro del producto: **"El Buen Sabor"** (Bogotá). Sus datos
> (NIT `900.123.456-7`, Bandeja Paisa, Sede Norte, etc.) son mock del demo —
> **no** son datos del SaaS NOVA.

---

## 2. Fuentes (de dónde sale este sistema)

Construido leyendo el código real del producto. Si tienes acceso, explóralos
para profundizar:

- **Codebase:** `ROOT-Front/` (demo HTML+CSS+JS vanilla, sin build). Tokens
  reales en `assets/css/tokens.css`; componentes en `components.css`; shells en
  `shells.css`. Documentación viva en `docs/design-system.md`,
  `docs/colores-sistema.md` y `CONTEXTO-APP.md`.
- **GitHub:** <https://github.com/brandon-stack-html/ROOT-Front> — repo del
  front-demo. Útil para reconstruir cualquier pantalla con fidelidad: lee el
  `.html` + `assets/css/*` antes de recrear.

> El stack original es **vanilla** (sin frameworks). Este design system
> re-expresa esos mismos tokens y patrones como CSS + componentes React para
> que agentes de diseño construyan rápido. Los valores son idénticos al código.

---

## 3. Branding

ROOT nació con un wordmark tipográfico (`[ROOT]`). NOVA continúa esa idea pero
actualiza la identidad por completo:

- **Símbolo:** una **chispa de 4 puntas (sparkle)** — nova = estrella nueva
  que destella. Geométrica, premium, conecta con "chispa de cocina" sin ser
  literal. `assets/brand/nova-mark.svg` (color, con gradiente saffron),
  `nova-mark-mono.svg` (monocromo `currentColor`, para tamaños chicos y
  favicons), `nova-tile.svg` (sparkle blanco crema sobre gradiente dorado,
  para app icon).
- **Wordmark:** `[NOVA]` en **DM Sans 700**, mayúsculas, tracking `0.14em`,
  con corchetes en color accent (`--accent`). Clase `.nova-wordmark`
  (variantes `.is-solid` = corchetes del color del texto, `.is-hero` =
  ExtraBold 800 con gradiente dorado en el texto).
- **Lockups:** `.nova-lockup` (símbolo + wordmark horizontal), `.is-compact`
  (sidebar/topbar ~14px) y `.is-stack` (apilado, para hero/splash). Todo
  escala vía `em` desde el `font-size` del contexto.
- **Color de marca:** saffron gold `#B98521` (claro) / `#D9A445` (oscuro)
  sobre tostado `#FBFAF7` / `#0C0A06`. Sin segundo color de marca: los demás
  colores son neutrales tostados o de estado.
- **Alias legacy:** las clases `.root-wordmark`, `.root-lockup` apuntan a los
  mismos estilos para no romper HTML/JSX heredado durante la migración.

**Reglas de uso del logo:** mantén aire alrededor del símbolo ≥ a la altura
de una punta de la chispa; no la rotes, no le cambies el gradiente, no pongas
el wordmark a color sobre fondos que compitan. Sobre fondos de color usa el
mono en cream (`#F4EFE0`) o blanco.

---

## 4. Content fundamentals — cómo se escribe

- **Idioma:** español de Colombia. Tono **cercano pero profesional**, sin
  jerga corporativa. Mezcla **"tú"** (auth, dashboard: "¿Olvidaste tu
  contraseña?", "Conecta NOVA con los servicios que ya usas") con imperativos
  directos en botones.
- **Botones = verbo en infinitivo o imperativo, corto:** "Iniciar sesión",
  "Guardar cambios", "Registrar pago", "Aprobar y notificar", "Marcar como
  pagada", "Pedir ahora", "Enviar a cocina". Nada de "Click aquí".
- **Saludos dinámicos y humanos:** "Buenos días, Juan Camilo" + contexto
  "Lunes, 15 de noviembre · Sede Norte".
- **Microcopy de ayuda concreta:** hints bajo los campos explican el porqué —
  "Esta información aparecerá en tus facturas electrónicas", "Sin dígito de
  verificación", "PNG o JPG · cuadrado · mínimo 256×256px".
- **Toasts:** título + subtítulo. Patrón "[Qué pasó] — [detalle]":
  "Configuración guardada — Wompi actualizado correctamente."
- **Badges/estado:** una palabra, capitalizada: "Conectado", "Homologado",
  "Pendiente", "Pagada", "Demo".
- **Números:** formato colombiano con puntos de miles y `$` antepuesto:
  `$1.623.500`. Fechas largas en español: "Lunes, 15 de noviembre".
- **Sin emoji.** La voz es sobria y operativa. La personalidad viene del color
  y la tipografía, no de iconos decorativos ni signos de exclamación.
- **Separadores con punto medio** `·` para metadatos: "7 módulos · ~62
  pantallas · navegación completa".

---

## 5. Visual foundations

**Filosofía: "Premium tostado + saffron gold".** Superficies con calidez
(cálidas, no neutrales frías), bordes sutiles, badges translúcidos, sombras
con ring de 1px en vez de blur dramático. Minimalismo tipo Linear / Stripe
Dashboard pero con personalidad LATAM — nada de frío corporativo.

- **Color & vibe:** monocromo tostado (toast) + un solo acento saffron gold.
  Las imágenes de producto son fotos de comida cálidas, y ahora el chrome
  también es cálido y consistente con ellas. Gradientes solo en logo hero,
  CTA primario y fondos decorativos sutiles (`--grad-soft`). El gold se usa
  con moderación: acciones primarias, estado activo, focus.
- **Superficies:** escala de 4 niveles (`--bg-base` → `surface` → `elevated` →
  `overlay`). Cards de página en `surface`; sub-cards en `elevated`; modales y
  drawers en `elevated` con `--shadow-lg`; hover sube a `overlay`.
- **Bordes:** translúcidos y semánticos — `--border-subtle` (divisores),
  `--border-default` (cards/inputs), `--border-strong` (hover/focus). 1px
  siempre.
- **Tipografía:** **DM Sans** para todo (UI, body, headings, display) +
  **JetBrains Mono** para datos tabulares y código. Títulos con tracking
  negativo (`-0.02em` a `-0.005em`); overlines con tracking positivo y
  mayúsculas. **Tabular-nums obligatorio** en montos, KPIs y timers.
- **Radios:** suaves — sm 6 / md 10 / lg 14 / xl 20. Cards 14px, botones e
  inputs 10px, modales 20px, pills/badges full.
- **Sombras:** sutiles en claro; en oscuro llevan `0 0 0 1px rgba(244,239,224,.04–.06)`
  (el "ring") que define el borde sin parecer dramático. `--gold-glow` es la
  sombra de marca: úsala solo para el CTA primario del turno y el logo hero.
- **Cards:** `background: surface` + `border 1px default` + `radius-lg`.
  Interactivas: hover sube fondo a `overlay`, borde a `strong`, y suben 2px
  (`translateY(-2px)`) con `--shadow-md`.
- **Badges de estado (firma del sistema):** **nunca relleno sólido.** Triplete
  fondo translúcido (`rgba(color,.10)`) + borde translúcido (`rgba(color,.25)`)
  + texto en el color. Igual para estados de mesa y tickets del KDS (fondos
  `rgba(color,.06)`, bordes `rgba(color,.20)`).
- **Animación:** discreta y rápida. Transiciones 120–180ms `ease` en color,
  fondo, borde, transform. Botones: `:active` baja 1px (o `scale(0.98)` en
  táctil). Toasts entran con slide-in de 250ms. Sin bounce, sin loops
  decorativos. Skeletons con shimmer 1.4s. View Transitions nativas entre
  pantallas. `prefers-reduced-motion` respetado en todo.
- **Estados interactivos:** hover = cambio de fondo (sutil, hacia alt/overlay)
  o de color (accent → accent-hover); press = baja/encoge; focus = **glow
  dorado** `0 0 0 3px var(--accent-ring)`, nunca el outline azul del browser.
- **Layout:** sidebar fijo 240px; topbar 56px; FAB "volver al demo" 44px
  bottom-left; bottom-tabs y action-bars sticky. Mobile-first: tablas se
  vuelven cards apiladas < 768px.
- **Transparencia/blur:** backdrops de modal/drawer en `rgba(12,10,6,.50)`.
  Poco blur; la profundidad la dan superficie + borde + sombra, no glass.

---

## 6. Iconografía

- **Sistema:** **[Lucide](https://lucide.dev)** — la librería de íconos del
  producto, cargada desde CDN (`lucide@latest`). Stroke de 2px, esquinas
  redondeadas, geometría limpia; encaja con la estética minimal. En el código
  vanilla se usan como `<i data-lucide="nombre"></i>` + `lucide.createIcons()`.
- **En este design system** (React/HTML) referencia Lucide desde CDN. Para
  HTML estático: `<script src="https://unpkg.com/lucide@latest"></script>` y
  `<i data-lucide="wallet"></i>`; o usa `lucide-react` en componentes. Tamaños
  típicos: 14–16px en UI densa (sidebar, botones, inputs), 20px en FABs/topbar,
  15px en items de sidebar.
- **Íconos frecuentes por contexto:** `wallet` (nómina), `table-2` (mesas),
  `search` (Ctrl/Cmd+K), `bell` (notificaciones), `chevron-right`
  (breadcrumb/selector), `plus` (crear), `pencil`/`trash-2` (acciones de fila),
  `check`/`eye`/`x` (matriz de roles), `mic` (input por voz), `log-out`.
- **No** se usa emoji como icono. Se permiten unicode puntuales: `·` (punto
  medio separador), `⚠` (prefijo de error de campo), `[` `]` (corchetes del
  wordmark). Los "dots" de estado son círculos de 6–7px coloreados, no glifos.
- **Avatares:** iniciales sobre color sólido (accent para usuarios; color
  derivado del id para empleados). Logo de negocio en cuadro redondeado.

---

## 7. Índice del folder

```
styles.css                  ← entry point (solo @imports). Consumidores enlazan esto.
tokens/
  fonts.css                 DM Sans + JetBrains Mono (Google Fonts)
  colors.css                paleta, superficies, bordes, estados, light/dark
  typography.css            escala + clases .t-*
  spacing.css               espaciado, radios, sombras (+ --gold-glow), z-index
  brand.css                 .nova-wordmark, .nova-lockup, .nova-tile (+ aliases .root-*)
  base.css                  reset + body + a11y (focus, reduced-motion)
assets/brand/               nova-mark · nova-mark-mono · nova-tile (SVGs)
guidelines/                 specimen cards del Design System tab (colores, tipo, spacing, marca)
components/                 primitivos React (ver §8)
ui_kits/                    recreaciones de pantallas reales (ver §9)
proposals/                  rounds de brand exploration (HTMLs vivos)
SKILL.md                    skill descargable (Agent Skills)
```

### 8. Componentes
`components/core/` — Button, Badge, Input, Card, KpiCard, StatusBadge, Toast,
Tabs, Avatar, Switch (cada uno con `.jsx`, `.d.ts`, `.prompt.md` y un card).

### 9. UI kits
- `ui_kits/backoffice/` — dashboard admin (sidebar + topbar + KPIs + tablas).
- `ui_kits/mesero/` — app móvil del mesero (mapa de mesas, comanda, nómina).
- `ui_kits/storefront/` — tienda pública del restaurante.

---

## 8. Reglas inviolables

1. **Nunca hardcodear color** en componentes — siempre vía token.
2. **Badges de estado sin relleno sólido** — triplete translúcido.
3. **Tabular-nums** en todo monto/dígito que cambie en vivo.
4. **Focus visible siempre** — glow dorado, no el outline del browser.
5. **Mobile-first** — diseña para 360px y escala a 1920.
6. **Sin emoji.** Personalidad por color + tipografía.
