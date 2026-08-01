export function Input({
  label,
  hint,
  error,
  required = false,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const fieldId = id || React.useId();
  const borderColor = error ? 'var(--error)' : focus ? 'var(--accent)' : 'var(--border)';
  const ring = focus
    ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.15)' : 'var(--accent-ring)'}`
    : 'none';

  return (
    <div style={{ display: 'block', marginBottom: 'var(--space-4)', ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 6, fontFamily: 'var(--ff-base)' }}>
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: disabled ? 'var(--alt)' : 'var(--bg)',
          color: 'var(--text)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--ff-base)',
          fontSize: 13,
          lineHeight: 1.4,
          outline: 'none',
          opacity: disabled ? 0.6 : 1,
          boxShadow: ring,
          transition: 'border-color .15s ease, box-shadow .15s ease',
        }}
        {...rest}
      />
      {error
        ? <div style={{ fontSize: 11, color: 'var(--error)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span aria-hidden="true">⚠</span>{error}</div>
        : hint
        ? <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{hint}</div>
        : null}
    </div>
  );
}
