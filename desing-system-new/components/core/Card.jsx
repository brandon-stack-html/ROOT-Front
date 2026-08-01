export function Card({ title, meta, headerRight, footer, interactive = false, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${interactive && hover ? 'var(--border-strong)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--ff-base)',
        color: 'var(--text)',
        cursor: interactive ? 'pointer' : 'default',
        transform: interactive && hover ? 'translateY(-2px)' : 'none',
        boxShadow: interactive && hover ? 'var(--shadow-md)' : 'none',
        transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
        ...style,
      }}
      {...rest}
    >
      {(title || headerRight || meta) && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <div>
            {meta && <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{meta}</div>}
            {title && <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{title}</div>}
          </div>
          {headerRight}
        </div>
      )}
      <div style={{ padding: '16px 20px' }}>{children}</div>
      {footer && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>{footer}</div>
      )}
    </div>
  );
}
