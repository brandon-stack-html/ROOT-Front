export function KpiCard({ label, value, delta, deltaDir = 'flat', icon = null, tone = 'default', style = {}, ...rest }) {
  const tones = {
    default: { background: 'var(--bg-surface)', borderColor: 'var(--border-default)' },
    success: { background: 'var(--state-success-bg)', borderColor: 'var(--state-success-border)' },
    warning: { background: 'var(--state-warning-bg)', borderColor: 'var(--state-warning-border)' },
    error:   { background: 'var(--state-danger-bg)',  borderColor: 'var(--state-danger-border)' },
    muted:   { background: 'var(--alt)', borderColor: 'var(--border-default)' },
  };
  const deltaColor = { up: 'var(--success)', down: 'var(--error)', flat: 'var(--muted)' }[deltaDir];
  const t = tones[tone] || tones.default;

  return (
    <div
      style={{
        padding: '16px 18px',
        background: t.background,
        border: `1px solid ${t.borderColor}`,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        fontFamily: 'var(--ff-base)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        {icon && (
          <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--alt)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', flexShrink: 0 }}>{icon}</span>
        )}
      </div>
      <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {delta && (
        <span style={{ fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4, color: deltaColor }}>
          {deltaDir === 'up' ? '▲' : deltaDir === 'down' ? '▼' : '•'} {delta}
        </span>
      )}
    </div>
  );
}
