**KpiCard** — métrica destacada para dashboards. Úsala en grids de KPIs (Backoffice dashboard, nómina). Valor con tabular-nums; delta coloreado por dirección.

```jsx
<KpiCard label="Ventas de hoy" value="$2.480.500" delta="+12% vs ayer" deltaDir="up" />
<KpiCard label="Adelantos pendientes" value="3" tone="warning" />
<KpiCard label="Ticket promedio" value="$38.900" delta="-4%" deltaDir="down" />
```

Props: `label`, `value`, `delta`, `deltaDir` (up/down/flat), `icon`, `tone` (default/success/warning/error/muted). Colócalas en un grid de 4 columnas (`repeat(4,1fr)`, gap 14px).
