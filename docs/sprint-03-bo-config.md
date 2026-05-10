# Sprint 03 — Backoffice Config (5 pantallas)

> **Objetivo:** gestión de usuarios, roles, configuración general, sucursales y mesas.
> **Estimado:** 6 horas.
> **Pantallas:** B2 (usuarios), B3 (drawer crear usuario), B4 (roles), B5 (config general), B6 (sucursales), B7 (mesas).
> **Dependencias:** Sprint 0 + Sprint 2 (shell ya validado).

## Archivos JSX de referencia

| Pantalla | Archivo |
|---|---|
| B2 Usuarios | `design-system/backoffice/bo-b2-usuarios.jsx` (186 líneas) |
| B3 Drawer crear usuario | `design-system/backoffice/bo-b3-drawer-usuario.jsx` (219 líneas) |
| B4 Roles y permisos | `design-system/backoffice/bo-b4-roles.jsx` (225 líneas) |
| B5 Configuración general | `design-system/backoffice/bo-b5-config-general.jsx` (197 líneas) |
| B6 Sucursales | `design-system/backoffice/bo-b6-config-sucursales.jsx` (161 líneas) |
| B7 Mesas | `design-system/backoffice/bo-b7-config-mesas.jsx` (377 líneas) |
| Componente CONFIG_TABS | `design-system/backoffice/bo-shared.jsx` (líneas ~180-210) |

Host de referencia: `design-system/05-config-backoffice.html`.

---

## Sección 3.1 — Usuarios B2 + Drawer crear B3

### Prompt para Claude Code

```
Leé:
  - design-system/backoffice/bo-b2-usuarios.jsx
  - design-system/backoffice/bo-b3-drawer-usuario.jsx

Crear backoffice/usuarios.html partiendo de _layout.html.
Sidebar activo: usuarios.
Breadcrumb: ["Inicio", "Usuarios"].

ESTRUCTURA:

1) BOPageHeader: "Usuarios" + subtítulo "5 usuarios activos".
   Actions: btn primary "+ Crear usuario" (data-open-drawer="crearUsuario").

2) Toolbar:
   Search "Buscar por nombre o cédula..."
   Select "Todos los roles"
   Select "Activos"
   Spacer
   btn ghost "Exportar"

3) Tabla con columnas:
   Usuario (avatar inicial + nombre + email debajo)
   Cédula (formato 1.012.345.678)
   Rol (badge: Administrador, Mesero, Cajero, Cocinero, Inventario)
   Sucursales asignadas (chips pequeños)
   Último acceso (relativo: "hace 2 horas", "ayer", etc.)
   Estado (badge-success "Activo" o badge-muted "Inactivo")
   Acciones (botón ghost con ícono ⋮ o "Editar")

   5 filas EXACTAS del JSX (datos colombianos: Juan Camilo Ruiz, María Fernanda López, etc.).
   Si el JSX tiene los nombres exactos, usalos. Mantené las cédulas, emails, roles del JSX.

4) Paginación inferior.

5) DRAWER "Crear usuario" (replicar B3 EXACTO):
   <div id="crearUsuario" class="drawer-backdrop">
     <div class="drawer">
       <div class="drawer-header">
         <div>
           <div class="drawer-title">Crear usuario</div>
           <div class="drawer-subtitle">Agregá un nuevo miembro al equipo</div>
         </div>
         <button class="drawer-close" data-close>×</button>
       </div>
       <div class="drawer-body">
         Form con:
           Tipo de documento (select: CC, CE, PA, NIT)
           Número de documento (input pre-llenado "1.012.345.678" del JSX)
           Grid 2 cols: Nombres / Apellidos
           Email
           Teléfono (con prefijo +57)
           Rol (select)
           Sucursales asignadas: lista de checkboxes (Sede Norte, Sede Centro, Sede Sur)
           Switch "Enviar credenciales por email"
       </div>
       <div class="drawer-footer">
         <button class="btn btn-secondary" data-close>Cancelar</button>
         <button class="btn btn-primary" id="btnCrearUsuario">Crear usuario</button>
       </div>
     </div>
   </div>

   JS:
     btnCrearUsuario.onclick = () => {
       UI.closeDrawer('crearUsuario');
       UI.toast({ type:'success', title:'Usuario creado', sub:'Se enviaron las credenciales por correo' });
       // Mock: agregar fila al final de la tabla con los datos del form (tomar valores con .value).
     };

RESPONSIVE:
  Tabla → cards apiladas en < 768px (mismo patrón del Sprint 2.4).
  Drawer full-width en mobile.
```

### Hecho cuando

- Tabla con 5 usuarios colombianos del JSX.
- Click "+ Crear usuario" abre drawer derecho.
- Click "Crear usuario" en drawer cierra, muestra toast y agrega fila visual.
- Mobile: tabla → cards, drawer full screen.

---

## Sección 3.2 — Roles y permisos B4

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b4-roles.jsx.

Crear backoffice/roles.html partiendo de _layout.html.
Sidebar activo: roles.
Breadcrumb: ["Inicio", "Roles y permisos"].

LAYOUT split desktop:
  .roles-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24;
    align-items: flex-start;
  }

IZQ — lista de roles:
  Card con header "Roles" + botón "+ Nuevo rol".
  Lista clickable de roles. Cada item:
    .role-item (padding 12 14, border-bottom, cursor pointer)
    Nombre del rol (font-weight 600)
    "X usuarios" (font-size 11, color muted)
    Item activo: bg accent suave, color text, borde izq accent.

  Roles del JSX:
    Administrador (1 usuario) — activo por default
    Mesero (8 usuarios)
    Cajero (3 usuarios)
    Cocinero (4 usuarios)
    Inventario (1 usuario)

DER — detalle del rol seleccionado:
  Card "Permisos del rol Mesero" (cambia según rol activo):
    Header con botón "Editar rol" + "Duplicar".
    Body: matriz de permisos.
      Filas = módulos: Dashboard, POS, KDS, Catálogo, Inventario, Clientes,
                       Proveedores, Gastos, Facturación, Reportes, Configuración, Usuarios.
      Columnas (header sticky): Ver / Crear / Editar / Eliminar.
      Cada celda: checkbox visual (cuadrado 16x16, check si activo).

      Replicar EXACTAMENTE los permisos del rol Mesero del JSX:
        Dashboard: solo Ver
        POS: Ver, Crear (no editar/eliminar)
        KDS: Ver
        Catálogo: Ver
        Resto: nada
      (Ajustar según lo que diga el JSX exactamente).

      Headers de columnas con ícono:
        Ver = ícono eye
        Crear = ícono plus
        Editar = ícono pencil
        Eliminar = ícono trash

JS:
  Click en item de rol izq:
    Quita .is-active de todos, lo agrega al clickeado.
    Actualiza el título del card der ("Permisos del rol X").
    Mock: cambiá el set de checkboxes según rol (definí un objeto con permisos por rol).

RESPONSIVE:
  @media (max-width: 1024px):
    .roles-layout { grid-template-columns: 1fr; }
    Lista de roles arriba como dropdown <select> en lugar de lista.
    O: arriba grid de chips, click en uno carga sus permisos abajo.
  @media (max-width: 640px):
    Matriz: scroll-x horizontal con sticky first column.
```

### Hecho cuando

- 5 roles a la izq, click cambia el contenido de la matriz.
- Matriz muestra permisos correctos según rol activo.
- En mobile la matriz hace scroll horizontal con la primera columna sticky.

---

## Sección 3.3 — Configuración general B5

### Prompt para Claude Code

```
Leé:
  - design-system/backoffice/bo-b5-config-general.jsx
  - design-system/backoffice/bo-shared.jsx (CONFIG_TABS y ConfigTabs, líneas ~180-210)

Crear backoffice/configuracion.html partiendo de _layout.html.
Sidebar activo: config.
Breadcrumb: ["Inicio", "Configuración"].

ESTRUCTURA:

1) BOPageHeader: "Configuración" + subtítulo "Parámetros del negocio y sistema".

2) Tabs del componente CONFIG_TABS (replicar del JSX):
   General (activo) | Sucursales | Mesas | Impuestos | Integraciones | Avanzado

   CSS .config-tabs en components.css:
     display flex border-bottom 1px solid border, gap 4, margin-bottom 24, overflow-x auto.
     button: padding 10 16, border none, bg transparent, color muted, font-size 13,
             border-bottom 2px solid transparent, margin-bottom -1.
     button.is-active: color text, font-weight 600, border-bottom 2px solid accent.

   Click en tab cambia el panel visible (UI.tabs del Sprint 0).
   Tab "Sucursales" navega a sucursales.html (location.href).
   Tab "Mesas" → mesas.html.
   Tab "Integraciones" → integraciones.html.
   Tabs "Impuestos" y "Avanzado" muestran un panel "Próximamente" simple.

3) Tab General (panel default visible):
   Layout 2 cols (form izq + preview factura der):
     .config-layout {
       display: grid;
       grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
       gap: 24;
     }

   IZQ — form en cards:
     Card "Información del negocio":
       Logo: cuadrado 80x80 con uploader (placeholder).
       Razón social
       NIT (input)
       Régimen tributario (select: Común, Simple, etc.)
       Sector (select)

     Card "Contacto":
       Email principal, Teléfono, Dirección, Departamento, Ciudad

     Card "Operación":
       Moneda (select: COP, USD)
       Zona horaria (select: America/Bogota)
       Formato hora (radio: 12h / 24h)
       Idioma (select: Español)

     Card "Facturación":
       Numeración: prefijo + consecutivo + sufijo
       Pie de página de factura (textarea)
       Switch "Mostrar logo en factura"
       Switch "Mostrar dirección"

   DER — preview live de la factura (sticky):
     Card .preview-card (position sticky, top 24):
       Simulación de un ticket/factura POS en ~280px ancho:
         Logo placeholder arriba
         Razón social grande
         NIT, dirección
         Línea horizontal
         "FACTURA #FE-1842"
         Items mock (3 líneas)
         Subtotal, IVA, Total
         Pie de página

       Update en vivo: al cambiar inputs del form izq, reflejarse en el preview
       (event listener input en cada campo).

4) Footer fijo de la página:
   Sticky bottom: izq "Última modificación: hace 2 días por Juan Camilo" (color muted),
   der: btn-secondary "Descartar cambios", btn-primary "Guardar cambios".
   Click guardar: toast success.

RESPONSIVE:
  @media (max-width: 1024px):
    .config-layout { grid-template-columns: 1fr; }
    .preview-card { position: static; }
  @media (max-width: 640px):
    Tabs scroll horizontal.
```

### Hecho cuando

- Tabs visibles, click en "Sucursales" lleva a /backoffice/sucursales.html.
- Tab "General" activo muestra form con 4 cards.
- Preview de factura sticky a la derecha y se actualiza al tipear.
- Mobile: form en columna única, preview al final.

---

## Sección 3.4 — Sucursales B6

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b6-config-sucursales.jsx.

Crear backoffice/sucursales.html partiendo de _layout.html.
Sidebar activo: config.
Breadcrumb: ["Inicio", "Configuración", "Sucursales"].

ESTRUCTURA:

1) BOPageHeader: "Sucursales" + subtítulo "3 sucursales · 1 inactiva".
   Actions: btn primary "+ Nueva sucursal".

2) Tabs (mismas del 3.3 con "Sucursales" activa).
   Click en "General" → /backoffice/configuracion.html.

3) Grid de sucursales (.sucursal-grid):
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)).
   gap: 18.

   Cards (datos exactos del JSX):

   Card 1 — Sede Norte:
     Header: avatar/ícono store color naranja "EB" + nombre "Sede Norte" + badge "Principal" (azul).
     Body:
       Dirección (con ícono map-pin): "Cra 7 # 82-15, Chapinero"
       Ciudad: "Bogotá D.C."
       Teléfono (ícono phone): "+57 312 4567890"
       Horario (ícono clock): "Lun-Sáb 7:00 AM - 11:00 PM"
       Stats compactas: "5 mesas · 3 usuarios · 47 productos"
     Footer:
       badge-success "Activa"
       botón ghost "Editar →"

   Card 2 — Sede Centro:
     Igual estructura, datos del JSX. Sin badge "Principal".

   Card 3 — Sede Sur:
     Igual estructura PERO:
       opacity .65
       badge-muted "Inactiva" en lugar de "Activa"
       Avatar/ícono en grayscale.

   Card 4 — "+ Agregar sucursal":
     Card con border dashed, contenido centrado:
     Ícono plus grande circular bg accent suave, "Nueva sucursal", subtítulo "Hasta 5 sucursales en tu plan".
     Cursor pointer, hover translateY(-2px).
     Click: UI.toast({ type:'info', title:'Funcionalidad próximamente' }).

RESPONSIVE:
  Grid se ajusta automáticamente con auto-fit.
  @media (max-width: 640px):
    .sucursal-grid { grid-template-columns: 1fr; }
```

### Hecho cuando

- 3 sucursales + card "+ Agregar".
- Sede Sur visualmente apagada.
- Click "Editar" no hace nada (mock) o abre modal placeholder.
- Click "+ Agregar sucursal" muestra toast "Próximamente".

---

## Sección 3.5 — Mesas B7

### Prompt para Claude Code

```
Leé design-system/backoffice/bo-b7-config-mesas.jsx (377 líneas — la más extensa de la sesión config).

Crear backoffice/mesas.html partiendo de _layout.html.
Sidebar activo: config.
Breadcrumb: ["Inicio", "Configuración", "Mesas"].

ESTRUCTURA:

1) BOPageHeader: "Mesas y zonas" + subtítulo "Sede Norte · 3 zonas · 18 mesas".
   Actions: btn ghost "Importar layout", btn primary "Guardar cambios".

2) Tabs (con "Mesas" activa).

3) Toolbar especial del editor:
   Tabs de zona: Salón (activo) / Terraza / Barra
   Spacer
   Botones de acción del editor:
     btn-secondary "[ícono undo] Deshacer"
     btn-secondary "[ícono redo] Rehacer"
     btn-secondary "[ícono trash] Eliminar"
     btn-primary "+ Mesa"
     btn-secondary "+ Zona"

4) Layout 2 cols editor + propiedades:
   .mesas-layout {
     display: grid;
     grid-template-columns: 1fr 280px;
     gap: 18;
     height: calc(100vh - 250px);
   }

   IZQ — canvas del editor (.mesa-canvas):
     Card con bg cuadriculada (background-image gradient para simular grid).
     position relative, overflow hidden.

     Mesas posicionadas absolutamente. Cada mesa:
       .mesa { position: absolute; width: 80; height: 80; background: var(--bg);
               border: 2px solid var(--border); border-radius: 12; display: flex;
               flex-direction: column; align-items: center; justify-content: center;
               cursor: pointer; user-select: none; }
       .mesa.is-selected { border-color: accent; box-shadow: 0 0 0 4px rgba(79,70,229,.15); }
       .mesa-number { font-size: 20; font-weight: 700; }
       .mesa-capacity { font-size: 11; color: muted; }

     Mesas del JSX (replicar exactas posiciones top/left + número + capacidad):
       18 mesas distribuidas, ejemplo:
         M1 (top:40, left:60, cap 4)
         M2 (top:40, left:160, cap 4)
         M3 (top:40, left:260, cap 2)
         ... etc según JSX.

     Click en mesa → marcarla selected, popular panel der con sus props.
     (Drag NO se implementa — solo selección visual.)

   DER — panel de propiedades:
     Card con header "Propiedades" o "Mesa M1".
     Si hay mesa seleccionada:
       Form:
         Nombre/Número (input)
         Capacidad (input number)
         Zona (select: Salón / Terraza / Barra)
         Forma (radio: Cuadrada / Redonda / Rectangular)
         Estado (toggle: Activa / Inactiva)
       Footer:
         btn-destructive "Eliminar mesa"
         btn-secondary "Duplicar"
     Si no hay selección:
       Empty state: "Seleccioná una mesa o agregá una nueva."

JS:
  Click en mesa → toggle selected, update panel.
  Click en "+ Mesa" → crea una mesa nueva (incrementa contador) en posición random,
    le hace selected automático.
  Click en "Eliminar mesa" → quita el elemento del DOM, vacía panel.

RESPONSIVE:
  @media (max-width: 1024px):
    .mesas-layout { grid-template-columns: 1fr; height: auto; }
    Panel propiedades arriba o como drawer (recomendado: drawer derecho).
    Botón en toolbar "Propiedades" abre el drawer (data-open-drawer="propMesa").
  @media (max-width: 768px):
    Canvas: convertir mesas a una LISTA plana en lugar de canvas posicionado.
    Cada item: número grande, info, click selecciona.
```

### Hecho cuando

- Editor con 18 mesas posicionadas en canvas.
- Click en mesa la selecciona y popula panel der.
- Click "+ Mesa" crea mesa nueva.
- En mobile las mesas son una lista, no canvas.
- Tabs de zona alternan visibilidad de mesas (mock — pueden mostrar siempre las mismas).

---

## Checklist final del Sprint 3

- [ ] usuarios.html: tabla 5 usuarios, drawer crear funciona, agregar fila visual al crear.
- [ ] roles.html: lista roles izq, matriz permisos der, click en rol cambia contenido.
- [ ] configuracion.html: tabs visibles, panel General con form 4 cards + preview live de factura.
- [ ] sucursales.html: 3 cards (1 inactiva visualmente apagada) + card "Agregar".
- [ ] mesas.html: editor canvas con mesas posicionadas, panel props, "+ Mesa" funciona.
- [ ] Tabs de configuración navegan correctamente entre las 3 páginas (general/sucursales/mesas).
- [ ] Toda la sección responsive en mobile.

Commit: `feat: sprint 3 backoffice config completo`. Pasamos al Sprint 4.
