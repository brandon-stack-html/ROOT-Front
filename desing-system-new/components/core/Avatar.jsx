export function Avatar({ name = '', src, size = 32, color, role, style = {}, ...rest }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const box = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--ff-base)',
    fontWeight: 700,
    fontSize: Math.round(size * 0.36),
    color: '#fff',
    background: color || 'var(--accent)',
    flexShrink: 0,
    overflow: 'hidden',
    userSelect: 'none',
    ...style,
  };

  const avatar = src
    ? <span style={box} {...rest}><img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span>
    : <span style={box} aria-label={name} {...rest}>{initials}</span>;

  if (!role) return avatar;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {avatar}
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--ff-base)' }}>{name}</span>
        <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--ff-base)' }}>{role}</span>
      </span>
    </span>
  );
}
