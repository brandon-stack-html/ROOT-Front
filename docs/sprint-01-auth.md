# Sprint 01 — Auth (5 pantallas)

> **Objetivo:** flujo completo de autenticación: login, registro, recuperar/restablecer contraseña, selector de sucursal.
> **Estimado:** 4–6 horas.
> **Pantallas:** 5 (A1–A5).
> **Dependencias:** Sprint 0 completo.

## Archivos JSX de referencia

| Pantalla | Archivo | Notas |
|---|---|---|
| Shell de auth | `design-system/auth/auth-shared.jsx` | 198 líneas — split panel, branding lateral |
| A1 Login | `design-system/auth/auth-a1-login.jsx` | 82 líneas — 4 versiones (desktop/mobile × light/dark) |
| A2 Registro | `design-system/auth/auth-a2-registro.jsx` | 88 líneas — stepper paso 1 |
| A3 Recuperar | `design-system/auth/auth-a3-recuperar.jsx` | 48 líneas — card 380px |
| A4 Restablecer | `design-system/auth/auth-a4-restablecer.jsx` | 114 líneas — barra de fuerza + checklist |
| A5 Selector sucursal | `design-system/auth/auth-a5-selector.jsx` | 166 líneas — grid 3 cards |

Host de referencia: `design-system/01-auth.html` (muestra cómo se renderizan los artboards).

---

## Sección 1.1 — Shell de auth + Login (A1)

### Prompt para Claude Code

```
Leé:
  - design-system/auth/auth-shared.jsx (entero)
  - design-system/auth/auth-a1-login.jsx (entero)

Antes de codear, mostrame:
1. Qué clases CSS vas a definir en auth/_shared.css.
2. Qué estructura HTML va a tener auth/login.html.

Luego crear:

assets/css/auth.css (NUEVO archivo, no toques shells.css):
  .auth-page (min-height 100vh, display flex, font-family base)
  .auth-side-panel (width 50%, bg accent o gradiente, padding 48, color #fff,
                    display flex flex-col justify-between)
    El panel izquierdo del JSX tiene:
      - Logo arriba (replicar de ds-identity.jsx)
      - Bloque central con título grande tipo "Gestiona tu negocio en un solo lugar"
        + subtítulo + 3 features con ícono check
      - Footer con frase legal o testimonial mock
  .auth-side-panel-feature (display flex items-start gap 12, margin-bottom 16)
  .auth-content (flex 1, padding 32, display flex items-center justify-center, bg)
  .auth-card (width 100%, max-width 400, display flex flex-col gap 24)
  .auth-card-header (text-center)
  .auth-card-title (font-size 26, font-weight 700)
  .auth-card-subtitle (font-size 14, color muted, margin-top 6)
  .auth-card-form (display flex flex-col gap 16)
  .auth-divider (display flex items-center gap 12, color muted)
    line antes y después con border-top
  .auth-social (display flex gap 8)
  .auth-card-footer (text-center, font-size 13, color muted)

  RESPONSIVE:
  @media (max-width: 768px) {
    .auth-side-panel { display: none; }
    .auth-content { width: 100%; padding: 24; }
  }

auth/login.html:
  <head> con tokens.css, components.css, auth.css, theme.js, lucide CDN
  <body>:
    <div class="auth-page">
      <aside class="auth-side-panel">[branding según JSX]</aside>
      <main class="auth-content">
        <div class="auth-card">
          <div class="auth-card-header">
            Logo pequeño
            <h1 class="auth-card-title">Bienvenido de vuelta</h1>
            <p class="auth-card-subtitle">Ingresá a tu cuenta de Inventario</p>
          </div>
          <form class="auth-card-form" onsubmit="event.preventDefault(); window.location='/backoffice/dashboard.html'">
            field email + field password con toggle ojo (botón con lucide eye/eye-off
              que togglea type='password'/'text')
            div con checkbox "Recordarme" + link "¿Olvidaste tu contraseña?" → /auth/recuperar.html
            button btn btn-primary type=submit "Iniciar sesión"
            div .auth-divider con texto "o continúa con"
            div .auth-social: 2 botones secundarios con íconos Google y Microsoft
          </form>
          <div class="auth-card-footer">
            ¿No tenés cuenta? <a href="/auth/registro.html">Registrate</a>
          </div>
          <div class="text-center" style="margin-top:8px"><toggle-tema></div>
        </div>
      </main>
    </div>
    <script src="/assets/js/ui.js"></script>
    <script>lucide.createIcons();</script>

JS inline para toggle ojo del password:
  Botón con data-toggle-password="passwordInputId".
  Al click cambiá type=password ↔ text y cambiá ícono eye/eye-off.

NO IMPLEMENTES validación real. El submit solo hace window.location y listo.
```

### Hecho cuando

- Login se ve idéntico al JSX en desktop y mobile, en light y dark.
- Click "Iniciar sesión" lleva al dashboard (que aún no existe — error 404 está bien por ahora).
- Toggle del ojo en password funciona.
- Toggle de tema funciona.

---

## Sección 1.2 — Registro (A2)

### Prompt para Claude Code

```
Leé design-system/auth/auth-a2-registro.jsx.

Crear auth/registro.html reusando auth.css del 1.1.

Diferencias respecto al login:
- Sigue siendo split panel (mismo aside).
- En el card derecho, ANTES del título, un stepper visible:
    .auth-stepper (display flex items-center gap 8, font-size 12, color muted)
    Paso 1 activo (bg accent, color #fff, círculo 24x24), Paso 2-N en muted.
    Texto "Paso 1 de 3" o similar.
- Form de registro:
    Nombre del negocio (input)
    NIT (input)
    Sector (select: Restaurante, Bar, Cafetería, Heladería, Otro)
    Departamento (select con departamentos colombianos hardcoded en el JSX)
    Ciudad (select que se "popula" según depto — mock, lista estática)
    Email (input)
    Password (input con toggle ojo)
    Checkbox "Acepto términos y condiciones"
    Botón "Continuar" → /auth/selector-sucursal.html (saltamos pasos por simplicidad)
- Card footer: "Ya tengo cuenta. <a>Iniciar sesión</a>" → /auth/login.html

Importar lista de departamentos/ciudades del JSX. Si está hardcoded, copiala tal cual.
```

### Hecho cuando

- Registro se ve correcto, stepper marca paso 1 activo.
- Selects departamento/ciudad muestran opciones colombianas del JSX.
- Botón continúa al selector de sucursal.

---

## Sección 1.3 — Recuperar contraseña (A3)

### Prompt para Claude Code

```
Leé design-system/auth/auth-a3-recuperar.jsx (48 líneas, simple).

Crear auth/recuperar.html.

Diferencias:
- Card más angosto (380px max-width).
- SIN side panel (centrado en pantalla, fondo neutral var(--alt) o gradiente sutil).
  Usar variante .auth-page-centered en lugar de la clase con side-panel:
    .auth-page-centered (min-height 100vh, display flex items-center justify-center,
                          padding 24, bg alt)
- Card header: ícono mail-question (lucide) en círculo grande arriba + título
  "Recuperar contraseña" + subtítulo "Te enviaremos un enlace al correo".
- Form: solo input email + botón "Enviar enlace de recuperación" (full width primary).
- Footer del card: link "← Volver a iniciar sesión" → /auth/login.html

Al submit:
  event.preventDefault();
  UI.toast({ type:'success', title:'Enlace enviado', sub:'Revisa tu correo en los próximos minutos' });
  Deshabilitar botón 3 segundos + cambiar texto a "Enviado ✓".
  Después de 3s reactivar.
```

### Hecho cuando

- Card centrado, no hay panel lateral.
- Submit muestra toast verde y botón se deshabilita 3s.
- Link "Volver" funciona.

---

## Sección 1.4 — Restablecer contraseña (A4)

### Prompt para Claude Code

```
Leé design-system/auth/auth-a4-restablecer.jsx (114 líneas).

Crear auth/restablecer.html. Misma estructura que recuperar.html (centrado, sin panel).

Form:
- Input "Nueva contraseña" con toggle ojo.
- Input "Confirmar nueva contraseña" con toggle ojo.
- Barra de fuerza de password (4 niveles: débil/regular/buena/fuerte):
    HTML: <div class="pwd-strength"><span></span><span></span><span></span><span></span></div>
    CSS:  cada span flex 1, height 4, border-radius 2, bg muted; .is-active toma color
    según nivel (débil rojo, regular naranja, buena amarillo, fuerte verde).
    Texto debajo: "Fuerza: <span id='pwdLabel'>—</span>"
- Checklist visual debajo, items que se tildan al cumplirse:
    [ ] Al menos 8 caracteres
    [ ] Una mayúscula
    [ ] Un número
    [ ] Un símbolo especial
  Cada item: ícono circle (vacío) que pasa a check-circle (verde) cuando cumple.

JS inline:
  Listener input en password:
    val = input.value
    checks = {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      digit: /\d/.test(val),
      symbol: /[^A-Za-z0-9]/.test(val)
    }
    Tilda los items según checks.
    Calcula score = Object.values(checks).filter(Boolean).length;
    Activa los primeros `score` spans de la barra con color según score.
    Actualiza label.

- Botón "Cambiar contraseña" (deshabilitado hasta que score === 4 y los dos passwords coincidan).
- Al submit: UI.toast success + setTimeout(() => location.href = '/auth/login.html', 1500).
```

### Hecho cuando

- Tipear en password actualiza barra y checklist en vivo.
- Botón se habilita solo con todos los checks + match de contraseñas.
- Submit muestra toast y redirige a login.

---

## Sección 1.5 — Selector de sucursal (A5)

### Prompt para Claude Code

```
Leé design-system/auth/auth-a5-selector.jsx (166 líneas).

Crear auth/selector-sucursal.html.

Layout:
- Página centrada similar a recuperar/restablecer pero con CARD MÁS ANCHO (max-width 880).
- Header con logo + saludo "Hola, Juan Camilo" (mock) + texto "Elegí la sucursal con la que vas a trabajar".
- Grid 3 columnas (responsive: 3 → 2 → 1):
    Card 1: Sede Norte
      Badge "Principal" (top-right)
      Ícono store grande (60x60 con bg accent suave)
      Nombre, dirección, teléfono, horario, badge estado (verde "Activa")
      Cursor pointer, hover translateY(-2px)
    Card 2: Sede Centro (sin badge "Principal")
    Card 3: Sede Sur (badge "Inactiva" gris, opacity .6, NO clickable)
  Datos exactos del JSX. Si en el JSX hay 3 sucursales con datos colombianos específicos
  (direcciones reales o mock detalladas), copialas tal cual.

- Footer del card grande: link "Cerrar sesión" → /auth/login.html

JS:
  Cada card clickable (excepto inactiva) tiene onclick:
    localStorage.setItem('sucursal', cardId);
    location.href = '/backoffice/dashboard.html';

Responsive:
  @media (max-width: 1024px) { grid 2 cols }
  @media (max-width: 640px)  { grid 1 col, cada card full width }
```

### Hecho cuando

- 3 sucursales se muestran con datos exactos del JSX.
- Click en activas guarda localStorage('sucursal') y va al dashboard.
- Click en "Sede Sur" inactiva no hace nada (cursor not-allowed).
- Link "Cerrar sesión" vuelve al login.

---

## Checklist final del Sprint 1

- [ ] auth/login.html — funciona toggle ojo, submit redirige a dashboard.
- [ ] auth/registro.html — stepper paso 1 visible, selects con datos colombianos.
- [ ] auth/recuperar.html — submit muestra toast y deshabilita botón 3s.
- [ ] auth/restablecer.html — barra y checklist en vivo, submit con redirect.
- [ ] auth/selector-sucursal.html — 3 cards, una inactiva, click guarda localStorage.
- [ ] Toggle de tema visible y funcional en las 5 pantallas.
- [ ] Las 5 pantallas se ven bien en mobile (panel lateral oculto en login/registro).
- [ ] Navegación entre las 5 pantallas funciona correctamente.

Commit: `feat: sprint 1 auth completo`. Pasamos al Sprint 2.
