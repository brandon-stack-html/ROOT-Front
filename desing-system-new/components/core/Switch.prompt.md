**Switch** — toggle on/off. Úsalo para conectar integraciones, settings y feature flags. Activo = accent.

```jsx
<Switch defaultChecked label="Mantener sesión iniciada" />
<Switch checked={wompi} onChange={setWompi} label="Wompi" />
<Switch disabled label="Próximamente" />
```

Props: `checked`/`onChange` (controlado) o `defaultChecked`, `label`, `disabled`. Todo el conjunto label+switch es clickeable.
