**Badge** — etiqueta de estado translúcida (la firma visual de NOVA). Úsala para estados de adelantos, integraciones, mesas, tickets KDS y cualquier chip de estado. Una palabra, capitalizada.

```jsx
<Badge tone="success" dot>Pagada</Badge>
<Badge tone="warning" dot>Pendiente</Badge>
<Badge tone="danger" dot>Rechazada</Badge>
<Badge tone="info" dot>Reservada</Badge>
<Badge tone="muted">Demo</Badge>
<Badge tone="accent">Homologado</Badge>
```

Tonos: success/warning/danger/info/muted/accent. `dot` añade el punto de color. `size` sm/md/lg. Nunca uses relleno sólido para estados — este componente ya aplica el triplete correcto.
