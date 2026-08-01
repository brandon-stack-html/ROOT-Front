**Tabs** — navegación por pestañas con subrayado. Úsala para bandejas filtradas por estado y para detalle con secciones.

```jsx
<Tabs
  defaultValue="pend"
  tabs={[
    { id: 'pend', label: 'Pendientes', count: 3 },
    { id: 'aprob', label: 'Aprobadas', count: 5 },
    { id: 'pag', label: 'Pagadas' },
    { id: 'todas', label: 'Todas' },
  ]}
  onChange={setTab}
/>
```

Cada tab: `{ id, label, count? }`. Controlado con `value`/`onChange` o no controlado con `defaultValue`. La activa se pinta en accent con subrayado.
