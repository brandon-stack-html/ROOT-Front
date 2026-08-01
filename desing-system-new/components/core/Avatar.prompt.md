**Avatar** — iniciales sobre color (o imagen). Úsalo en topbars, footer de sidebar, listas de usuarios y empleados.

```jsx
<Avatar name="Juan Camilo" />
<Avatar name="Camila Rojas" role="Mesero · Sede Norte" size={30} />
<Avatar name="El Buen Sabor" src="/logo.png" size={40} />
```

Props: `name` (deriva iniciales), `src`, `size`, `color`, `role` (muestra nombre + rol al lado). Usa color por-id para distinguir empleados; accent por defecto para usuarios.
