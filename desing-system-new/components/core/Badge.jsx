export function Badge({ tone = 'muted', dot = false, size = 'md', children, style = {}, ...rest }) {
  const tones = {
    success: { background: 'var(--state-success-bg)', borderColor: 'var(--state-success-border)', color: 'var(--state-success)', dot: 'var(--state-success)' },
    warning: { background: 'var(--state-warning-bg)', borderColor: 'var(--state-warning-border)', color: 'var(--state-warning)', dot: 'var(--state-warning)' },
    danger:  { background: 'var(--state-danger-bg)',  borderColor: 'var(--state-danger-border)',  color: 'var(--state-danger)',  dot: 'var(--state-danger)' },
    info:    { background: 'var(--state-info-bg)',    borderColor: 'var(--state-info-border)',    color: 'var(--state-info)',    dot: 'var(--state-info)' },
    muted:   { background: 'var(--alt)',              borderColor: 'var(--border-default)',       color: 'var(--muted)',         dot: 'var(--muted)' },
    accent:  { background: 'var(--accent-soft)',      borderColor: 'transparent',                 color: 'var(--accent)',        dot: 'var(--accent)' },
  };
  const t = tones[tone] || tones.muted;
  const sz = size === 'sm'
    ? { padding: '3px 8px', fontSize: 11 }
    : size === 'lg'
    ? { padding: '5px 12px', fontSize: 13 }
    : { padding: '4px 10px', fontSize: 12 };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 'var(--radius-full)',
        border: '1px solid',
        fontFamily: 'var(--ff-base)',
        fontWeight: 500,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        background: t.background,
        borderColor: t.borderColor,
        color: t.color,
        ...sz,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
