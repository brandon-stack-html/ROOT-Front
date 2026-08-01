export function Switch({ checked, defaultChecked = false, onChange, disabled = false, label, id, style = {}, ...rest }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const fieldId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!on);
    onChange && onChange(!on);
  };

  const sw = (
    <button
      role="switch"
      aria-checked={on}
      id={fieldId}
      onClick={toggle}
      disabled={disabled}
      style={{
        width: 38,
        height: 22,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        padding: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: on ? 'var(--accent)' : 'var(--border)',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color .15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
      {...rest}
    >
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transform: on ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .15s ease' }} />
    </button>
  );

  if (!label) return sw;
  return (
    <label htmlFor={fieldId} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--ff-base)', fontSize: 13, color: 'var(--text)', ...style }}>
      {sw}
      {label}
    </label>
  );
}
