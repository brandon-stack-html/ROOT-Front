**Button** — la acción del sistema. Úsalo para cualquier CTA; `primary` para la acción principal de la vista (una sola por pantalla), `secondary` para acciones de apoyo, `ghost` para acciones terciarias o de barra, `destructive` para borrar/rechazar.

```jsx
<Button variant="primary" onClick={save}>Guardar cambios</Button>
<Button variant="secondary">Descartar</Button>
<Button variant="ghost" size="sm">Ver documentación</Button>
<Button variant="destructive">Rechazar solicitud</Button>
<Button variant="primary" size="touch" fullWidth>Enviar a cocina</Button>
```

Variantes: `variant` (primary/secondary/ghost/destructive), `size` (sm/md/lg/touch), `fullWidth`, `disabled`, `iconLeft`/`iconRight`. Usa `size="touch"` en POS y app mesero. Nunca dos primarios juntos.
