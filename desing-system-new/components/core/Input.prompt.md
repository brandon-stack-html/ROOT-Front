**Input** — campo de formulario con label, hint y error. Úsalo en auth, configuración, drawers de creación. El hint da contexto concreto ("Esta información aparecerá en tus facturas electrónicas").

```jsx
<Input label="Correo" type="email" placeholder="tu@correo.co" required />
<Input label="NIT" hint="Sin dígito de verificación" />
<Input label="Salario base" error="Debe ser ≥ al salario mínimo ($1.623.500)" />
```

Props: `label`, `hint`, `error` (oculta el hint y pinta rojo), `required`, `disabled`, `type`, `value`/`onChange`. El focus aplica el glow morado del sistema automáticamente.
