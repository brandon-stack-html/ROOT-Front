# Design System — ROOT POS demo

> Referencia viva de los tokens, escalas y reglas visuales del proyecto.
> Última actualización: **Sprint 14 — Refactor estética Vercel (2026-05-17).**

Stack: HTML + CSS + JS vanilla. Sin build, sin frameworks. Íconos `lucide` CDN, fuente `Inter` Google Fonts. Identidad **negro + morado `#4F46E5`**.

---

## 1. Filosofía visual

- **Vercel-style**: superficies muy oscuras pero diferenciadas, bordes sutiles, badges translúcidos, sombras con ring de 1px en lugar de blur dramático.
- **Identidad**: negro `#0A0A0A` + morado `#4F46E5`. No se introducen colores fuera de esta paleta sin justificación.
- **Mobile-first**: cada pantalla debe verse bien de 360px a 1920px.
- **Tabular nums obligatorios** para montos: `font-variant-numeric: tabular-nums; font-feature-settings: "tnum", "cv11";`.

---

## 2. Tokens base — `assets/css/tokens.css`

### 2.1 Paleta y superficies

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAFAFA` | `#0A0A0A` |
| `--alt` | `#F4F4F5` | `#111111` |
| `--text` | `#0A0A0A` | `#FAFAFA` |
| `--muted` | `#71717A` | `#A1A1AA` |
| `--accent` | `#4F46E5` | `#4F46E5` |
| `--accent-hover` | `#4338CA` | `#4338CA` |
| `--border` | `#E4E4E7` | `#1F1F1F` |

**Escala de superficies (Sprint 14 — Vercel):**

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--bg-base` | `#FAFAFA` | `#0A0A0A` | Fondo de la página |
| `--bg-surface` | `#FFFFFF` | `#111111` | Cards de nivel 1 |
| `--bg-elevated` | `#F4F4F5` | `#161616` | Modales, drawers, cards sobre cards |
| `--bg-overlay` | `#EBEBEB` | `#1C1C1C` | Hover states |

### 2.2 Bordes semánticos (Sprint 14)

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--border-subtle` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` | Divisores, separadores internos |
| `--border-default` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` | Borde estándar de cards e inputs |
| `--border-strong` | `rgba(0,0,0,0.14)` | `rgba(255,255,255,0.16)` | Hover, focus |

### 2.3 Estados

```css
/* Light mode (saturado) */
--state-success: #10B981
--state-warning: #F59E0B
--state-danger:  #EF4444
--state-info:    #3B82F6

/* Dark mode (menos saturado, Vercel-style) */
--state-success: #22C55E
--state-warning: #EAB308
--state-danger:  #F43F5E
--state-info:    #60A5FA
```

**Regla clave de badges:** los badges de estado NO usan fondo sólido. Usan triplete fondo translúcido + borde translúcido + texto en el color:

```css
.badge-success {
  background: var(--state-success-bg);     /* rgba(color, 0.10) */
  border: 1px solid var(--state-success-border); /* rgba(color, 0.25) */
  color: var(--state-success);
}
```

### 2.4 Tipografía

Fuente: `Inter` (400, 500, 600, 700) vía Google Fonts.

| Token | Tamaño | Peso | Line-height | Letter-spacing |
|---|---|---|---|---|
| `--fs-display` | 36px | 700 | 1.15 | -0.02em |
| `--fs-h1` | 28px | 700 | 1.2 | -0.015em |
| `--fs-h2` | 22px | 600 | 1.25 | -0.01em |
| `--fs-h3` | 18px | 600 | 1.3 | -0.005em |
| `--fs-body-l` | 16px | 400 | 1.55 | 0 |
| `--fs-body` | 14px | 400 | 1.5 | 0 |
| `--fs-body-s` | 13px | 400 | 1.5 | 0 |
| `--fs-caption` | 12px | 500 | 1.4 | 0 |
| `--fs-overline` | 11px | 600 | 1.4 | 0.06em |

### 2.5 Espaciado

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-5` 20px · `--space-6` 24px · `--space-8` 32px · `--space-10` 40px.

### 2.6 Radius (actualizado Sprint 14)

| Token | Valor | Antes |
|---|---|---|
| `--radius-sm` | `6px` | 4px |
| `--radius-md` | `10px` | 8px |
| `--radius-lg` | `14px` | 12px |
| `--radius-xl` | `20px` | (nuevo) |

`--radius-xl` se reserva para cards grandes / hero / superficies destacadas.

### 2.7 Sombras

```css
/* Light mode */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 12px rgba(0,0,0,0.06)
--shadow-lg: 0 12px 32px rgba(0,0,0,0.10)

/* Dark mode (con ring sutil) */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.40)
--shadow-md: 0 4px 12px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.04)
--shadow-lg: 0 12px 32px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.06)
```

El `0 0 0 1px rgba(255,255,255,0.04)` es el "ring" típico Vercel — da definición a los bordes sin parecer dramático.

---

## 3. Reglas de aplicación

### 3.1 Cards y superficies

- Cards de página: `background: var(--bg-surface)` + `border: 1px solid var(--border-default)` + `border-radius: var(--radius-lg)`.
- Cards anidadas (sub-cards dentro de una card): `background: var(--bg-elevated)`.
- Modales y drawers: `background: var(--bg-elevated)` + `box-shadow: var(--shadow-lg)`.
- Hover de cards interactivas: subir a `var(--bg-overlay)` y `var(--border-strong)`.

### 3.2 Botones (`components.css`)

- Primario: fondo `var(--accent)`, texto blanco, hover `var(--accent-hover)`.
- Secundario / ghost: fondo transparente, borde `var(--border-default)`, texto `var(--text)`.
- Danger ghost: fondo transparente, borde `rgba(244,63,94,0.20)`, texto `var(--state-danger)`. (Cerrar caja en POS usa este patrón.)

### 3.3 Inputs

- `border-radius: var(--radius-md)`.
- `border: 1px solid var(--border-default)`.
- Focus: `border-color: var(--border-strong)` + `box-shadow: 0 0 0 3px rgba(79,70,229,0.18)` (glow morado), **no** el outline azul del browser.

### 3.4 Estados de mesa (`mesas.css`)

Fondos translúcidos por estado, no sólidos:

```css
.mesa-card.ocupada    { background: rgba(244,63,94,0.06);  border: 1px solid rgba(244,63,94,0.20); }
.mesa-card.por-cobrar { background: rgba(234,179,8,0.06);  border: 1px solid rgba(234,179,8,0.20); }
.mesa-card.reservada  { background: rgba(96,165,250,0.06); border: 1px solid rgba(96,165,250,0.20); }
.mesa-card.libre      { background: var(--bg-surface);     border: 1px solid var(--border-default); }
```

### 3.5 KDS (`kds.css`)

Bordes de alerta con baja saturación:

```css
.kds-ticket.urgente  { border: 1px solid rgba(244,63,94,0.35); box-shadow: inset 0 0 0 1px rgba(244,63,94,0.15); }
.kds-ticket.nuevo    { border: 1px solid rgba(96,165,250,0.35); }
.kds-ticket.warning  { border: 1px solid rgba(234,179,8,0.35); }
```

El timer interno de la card sigue rojo intenso porque es la alerta real; lo que se atenúa es el contorno.

---

## 4. Recursos

- `test-tokens.html` — referencia visual rápida: superficies, estados, radius, sombras, tipografía, badges, botones y cards en una sola pantalla. Útil para QA y debugging visual.
- `test-ds.html` — extensión legacy con más componentes.

## 5. Reglas inviolables

1. **Nunca hardcodear colores** en componentes. Siempre vía tokens.
2. **Badges de estado no usan fondos sólidos.** Triplete translúcido (bg + border + text).
3. **Tabular nums obligatorios** en montos y dígitos que cambian en vivo.
4. **Focus visible siempre.** El glow morado reemplaza al outline azul del browser.
5. **Mobile-first.** Diseñar para 360px y escalar.
