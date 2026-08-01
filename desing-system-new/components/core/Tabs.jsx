export function Tabs({ tabs = [], value, defaultValue, onChange, style = {}, ...rest }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;
  const select = (id) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', gap: 2, fontFamily: 'var(--ff-base)', ...style }} role="tablist" {...rest}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => select(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 14px',
              fontFamily: 'var(--ff-base)',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              borderBottom: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              transition: 'color .12s ease, border-color .12s ease',
            }}
          >
            {t.label}
            {t.count != null && (
              <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--muted)', background: isActive ? 'var(--accent-soft)' : 'var(--alt)', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
