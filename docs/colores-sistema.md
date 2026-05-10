# Sesión 0 — Sistema de Diseño Base
> ⚡ Haz esta sesión PRIMERO antes de cualquier pantalla  
> Herramienta: Claude Design o AI Studio (elige una y úsala para todas las sesiones)  
> Resultado esperado: tu "biblia visual" que antepones a todos los prompts futuros

---

## ¿Qué hacer en esta sesión?

No generas pantallas todavía. El objetivo es que la IA defina y fije el sistema de diseño completo de tu app. Cuando tengas el resultado, guarda una captura y anota los valores exactos que generó (colores HEX, tamaños, etc.).

---

## Prompt 0.1 — Sistema de diseño completo

```
Crea un sistema de diseño completo para una aplicación SaaS llamada "Inventario" 
— un POS híbrido para retail y restaurantes en Colombia.

No diseñes una pantalla completa. Solo muestra los componentes del sistema en un 
panel de referencia visual (como un Figma component sheet).

ESTILO VISUAL:
- Minimalista, limpio, fácil de entender a primera vista
- Inspiración: Linear, Notion, Stripe Dashboard
- Tipografía: Inter o Geist (sans-serif moderna)
- Espaciado generoso, jerarquía visual clara
- Esquinas redondeadas suaves (8-12px)
- Sombras sutiles, no dramáticas

PALETA DE COLORES A MOSTRAR:
Modo claro:
  - Fondo principal: #FAFAFA
  - Fondo secundario: #F4F4F5
  - Texto principal: #0A0A0A
  - Texto secundario: #71717A
  - Acento primario: #4F46E5 (azul-índigo)
  - Acento hover: #4338CA
  - Borde sutil: #E4E4E7

Modo oscuro:
  - Fondo principal: #0A0A0A
  - Fondo secundario: #18181B
  - Texto principal: #FAFAFA
  - Texto secundario: #A1A1AA
  - Acento primario: #4F46E5
  - Borde sutil: #27272A

Estados:
  - Éxito: #10B981
  - Error: #EF4444
  - Alerta: #F59E0B
  - Info: #3B82F6

COMPONENTES A MOSTRAR (en modo claro Y oscuro lado a lado):
1. Botones: primario, secundario, ghost, destructivo — normal y hover
2. Inputs: vacío, con valor, con error, deshabilitado
3. Badges/Tags: éxito, error, alerta, neutro, info
4. Cards: simple, con header, con borde
5. Tabla: header + 3 filas de ejemplo con hover
6. Sidebar de navegación: con grupos, iconos e item activo seleccionado
7. Topbar: con breadcrumb, selector de sucursal, notificación, avatar
8. Toast/notificación: éxito y error
9. Modal: header, contenido, footer con botones
10. Drawer lateral: header, form, footer

IDIOMA: español de Colombia
```

---

## Prompt 0.2 — Logo e identidad (opcional pero recomendado)

```
Diseña el logotipo y la identidad visual para "Inventario" — una app POS SaaS 
para restaurantes y tiendas en Colombia.

Muestra 3 variantes del logo:
1. Símbolo + nombre horizontal
2. Símbolo + nombre vertical  
3. Solo símbolo (para favicon e icono de app)

El símbolo debe evocar: orden, gestión, agilidad. Puede ser abstracto o literal 
(una cuadrícula, un inventario, una factura estilizada, etc.)

Fuente del nombre: sans-serif moderna, peso medium o semibold
Colores: usa el acento #4F46E5 como base

También muestra las versiones:
- Sobre fondo claro
- Sobre fondo oscuro
- En blanco puro (para fondos de color)
```

---

## ✅ Checklist de esta sesión

Antes de pasar a la Sesión 1, verifica que tienes:

- [ ] Panel del sistema de diseño generado (modo claro + oscuro)
- [ ] Colores HEX exactos anotados (puede que la IA ajuste ligeramente)
- [ ] Captura guardada en `/design-system/00-sistema-base.png`
- [ ] Logo generado y guardado
- [ ] Decidiste qué herramienta usarás (Claude Design o AI Studio) — la misma para todas las sesiones

---

## 📋 Plantilla de "Prompt base global" finalizada

Una vez tengas el sistema de diseño aprobado, este es el prompt que **antepones a TODAS las pantallas de las sesiones siguientes**:

```
Diseña una pantalla para "Inventario" — app POS SaaS para restaurantes 
y tiendas en Colombia.

SISTEMA DE DISEÑO (mantén coherencia estricta con esto):
- Tipografía: Inter / Geist, sans-serif
- Modo claro: fondo #FAFAFA, texto #0A0A0A, acento #4F46E5
- Modo oscuro: fondo #0A0A0A, texto #FAFAFA, acento #4F46E5
- Estados: éxito #10B981, error #EF4444, alerta #F59E0B
- Bordes: #E4E4E7 (claro) / #27272A (oscuro)
- Esquinas: 8-12px, sombras sutiles
- Componentes: estilo shadcn/ui (botones, inputs, cards, tablas)
- Estilo: minimalista, moderno, Linear/Stripe Dashboard
- Idioma: español de Colombia

DISPOSITIVO: [DESKTOP 1440x900 / MOBILE 390x844]
MODO: [CLARO / OSCURO]

--- PANTALLA ESPECÍFICA ---
```

> ⚠️ Reemplaza `[DESKTOP/MOBILE]` y `[CLARO/OSCURO]` cada vez que uses este prompt.
