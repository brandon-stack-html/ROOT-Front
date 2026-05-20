// auth-shared.jsx — Helpers para las 5 pantallas de auth
// Requiere: ds-tokens.jsx + Lucide UMD + Icon (de pos-shared) o helper local.

// Si pos-shared.jsx no se carga (ej. mocks de auth aislados), definimos un Icon
// mínimo aquí. Es el mismo patrón: lee window.lucide.icons[Pascal] y construye SVG.
if (typeof window !== 'undefined' && !window.Icon) {
  window.Icon = function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.75, style = {} }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current) return;
      const lib = (window.lucide && (window.lucide.icons || window.lucide)) || {};
      const pascal = name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const ic = lib[pascal];
      if (!ic) { ref.current.innerHTML = ''; return; }
      const [tag, attrs, children] = ic;
      const NS = 'http://www.w3.org/2000/svg';
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      node.setAttribute('width', size);
      node.setAttribute('height', size);
      node.setAttribute('stroke', color);
      node.setAttribute('stroke-width', strokeWidth);
      (children || []).forEach((child) => {
        const ctag = child[0]; const cattrs = child[1] || {};
        const c = document.createElementNS(NS, ctag);
        Object.entries(cattrs).forEach(([k, v]) => c.setAttribute(k, v));
        node.appendChild(c);
      });
      ref.current.innerHTML = '';
      ref.current.appendChild(node);
    }, [name, size, color, strokeWidth]);
    return <span ref={ref} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', lineHeight:0, ...style }}/>;
  };
}

// ── AuthLayout ─────────────────────────────────────────────────────────────────
// Fondo con dot pattern sutil + slot central. Soporta desktop y mobile.
function AuthLayout({ t, mobile = false, children, fullWidth = false }) {
  const dotColor = t === DST.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)';
  return (
    <div style={{
      width:'100%', height:'100%',
      background: t.bg,
      backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      fontFamily: ff,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding: mobile ? '24px 24px' : '40px',
      overflow:'auto',
      position:'relative',
    }}>
      {/* Halo radial muy sutil detrás del card */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width:680, height:680, borderRadius:'50%',
        background: t === DST.light
          ? 'radial-gradient(circle, rgba(79,70,229,.06) 0%, rgba(79,70,229,0) 60%)'
          : 'radial-gradient(circle, rgba(79,70,229,.12) 0%, rgba(79,70,229,0) 60%)',
        pointerEvents:'none',
      }}/>
      <div style={{ position:'relative', zIndex:1, width: fullWidth ? '100%' : 'auto', maxWidth:'100%' }}>
        {children}
      </div>
    </div>
  );
}

// ── AuthCard ───────────────────────────────────────────────────────────────────
function AuthCard({ t, width = 400, mobile = false, children, style = {} }) {
  return (
    <div style={{
      width: mobile ? '100%' : width,
      maxWidth:'100%',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      padding: mobile ? '28px 24px' : '36px 38px',
      boxShadow: t === DST.light
        ? '0 1px 3px rgba(0,0,0,.04), 0 16px 48px rgba(0,0,0,.06)'
        : '0 1px 3px rgba(0,0,0,.4), 0 16px 48px rgba(0,0,0,.3)',
      fontFamily: ff,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── AuthLogo ───────────────────────────────────────────────────────────────────
function AuthLogo({ t, size = 'md' }) {
  const dim = size === 'sm' ? { box:32, font:14, name:14 } : { box:38, font:16, name:17 };
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:24 }}>
      <div style={{
        width:dim.box, height:dim.box, borderRadius:9,
        background: t.accent,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'#fff', fontWeight:700, fontSize:dim.font,
        boxShadow:'0 4px 12px rgba(79,70,229,.3)',
      }}>I</div>
      <span style={{ fontSize:dim.name, fontWeight:600, color:t.text, letterSpacing:'-.01em' }}>Inventario</span>
    </div>
  );
}

// ── AuthLabel ──────────────────────────────────────────────────────────────────
function AuthLabel({ t, children, hint, error }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
      <span style={{ fontSize:12, fontWeight:500, color:t.text }}>{children}</span>
      {error && <span style={{ fontSize:11, color:DST.error }}>{error}</span>}
      {hint && !error && <span style={{ fontSize:10, color:t.muted }}>{hint}</span>}
    </div>
  );
}

// ── AuthInput ──────────────────────────────────────────────────────────────────
function AuthInput({ t, value = '', placeholder, prefix, suffix, type = 'text', error, focused = false, disabled }) {
  return (
    <div style={{
      display:'flex', alignItems:'center',
      background: t.bg,
      border: `1px solid ${error ? DST.error : focused ? t.accent : t.border}`,
      borderRadius: 9,
      padding: '0 12px',
      transition:'border-color .15s',
      boxShadow: focused ? `0 0 0 3px ${t.accent}22` : 'none',
      opacity: disabled ? 0.5 : 1,
    }}>
      {prefix && <span style={{ fontSize:13, color:t.muted, marginRight:8 }}>{prefix}</span>}
      <input
        readOnly
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flex:1, padding:'10px 0', fontSize:13, fontFamily:ff,
          background:'transparent', border:'none', outline:'none', color:t.text,
          minWidth:0,
        }}
      />
      {suffix && <span style={{ marginLeft:8, color:t.muted, display:'flex', alignItems:'center' }}>{suffix}</span>}
    </div>
  );
}

// ── AuthDivider ────────────────────────────────────────────────────────────────
function AuthDivider({ t, label = 'o' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0', color:t.muted, fontSize:11 }}>
      <div style={{ flex:1, height:1, background:t.border }}/>
      <span style={{ textTransform:'uppercase', letterSpacing:'.08em', fontWeight:500 }}>{label}</span>
      <div style={{ flex:1, height:1, background:t.border }}/>
    </div>
  );
}

// ── AuthBtn ────────────────────────────────────────────────────────────────────
function AuthBtn({ t, children, variant = 'primary', full = false, icon, size = 'md', style = {} }) {
  const sizes = { md: { padding:'10px 16px', fontSize:13 }, lg: { padding:'12px 18px', fontSize:14 } };
  const variants = {
    primary:  { background:t.accent, color:'#fff', border:'1px solid transparent' },
    ghost:    { background:'transparent', color:t.text, border:`1px solid ${t.border}` },
    link:     { background:'transparent', color:t.accent, border:'1px solid transparent', padding:0 },
  };
  return (
    <button style={{
      ...sizes[size], ...variants[variant],
      borderRadius:9, fontFamily:ff, fontWeight:500, cursor:'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      width: full ? '100%' : 'auto', whiteSpace:'nowrap',
      ...style,
    }}>
      {children}
      {icon && <Icon name={icon} size={14} color="currentColor"/>}
    </button>
  );
}

// ── Checkbox simple ────────────────────────────────────────────────────────────
function AuthCheckbox({ t, checked = false, label }) {
  return (
    <label style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:12, color:t.text }}>
      <span style={{
        width:15, height:15, borderRadius:4,
        background: checked ? t.accent : t.bg,
        border: `1px solid ${checked ? t.accent : t.border}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        {checked && <Icon name="check" size={10} color="#fff" strokeWidth={3}/>}
      </span>
      {label}
    </label>
  );
}

Object.assign(window, { AuthLayout, AuthCard, AuthLogo, AuthLabel, AuthInput, AuthDivider, AuthBtn, AuthCheckbox });
