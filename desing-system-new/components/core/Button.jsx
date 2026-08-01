export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  onClick,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '5px 10px', fontSize: 11, borderRadius: 'var(--radius-sm)' },
    md: { padding: '8px 16px', fontSize: 13, borderRadius: 'var(--radius-md)' },
    lg: { padding: '10px 18px', fontSize: 14, borderRadius: 'var(--radius-md)' },
    touch: { padding: '14px 18px', fontSize: 15, borderRadius: 'var(--radius-lg)', minHeight: 48 },
  };

  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
    secondary: { background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' },
    ghost: { background: 'transparent', color: 'var(--accent)', borderColor: 'transparent' },
    destructive: { background: 'var(--error)', color: '#fff', borderColor: 'var(--error)' },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    border: '1px solid transparent',
    fontFamily: 'var(--ff-base)',
    fontWeight: 500,
    lineHeight: 1.2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'background-color .15s ease, color .15s ease, border-color .15s ease, transform .05s ease',
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const [hover, setHover] = React.useState(false);
  const hoverBg = {
    primary: 'var(--accent-hover)',
    secondary: 'var(--alt)',
    ghost: 'var(--accent-soft)',
    destructive: '#DC2626',
  };
  const hovered = hover && !disabled
    ? {
        background: hoverBg[variant],
        borderColor: variant === 'secondary' || variant === 'ghost' ? base.borderColor : hoverBg[variant],
        color: variant === 'ghost' ? 'var(--accent)' : base.color,
      }
    : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...hovered }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
