**Card** — superficie contenedora. Úsala para agrupar contenido en cualquier vista; header opcional con título, overline (`meta`) y un nodo a la derecha; footer para acciones. `interactive` para cards clickeables (productos, integraciones).

```jsx
<Card title="Resumen de nómina" meta="Operación" headerRight={<Badge tone="warning" dot>3 pendientes</Badge>}>
  Contenido…
</Card>

<Card interactive title="Wompi" footer={<Button variant="secondary" size="sm">Configurar</Button>}>
  Tarjeta, Nequi y PSE.
</Card>
```

Slots: `title`, `meta`, `headerRight`, `footer`, `interactive`. Si no pasas título/meta/headerRight no se renderiza el header.
