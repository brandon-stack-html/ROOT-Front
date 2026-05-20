// mesero-shared.jsx — Helpers compartidos de la App Mesero (mobile)
// Requiere: ds-tokens.jsx + Lucide UMD + Icon (de pos-shared o auth-shared)

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

// Reuso fmtCOP de pos-shared si está; fallback local.
if (typeof window !== 'undefined' && !window.fmtCOP) {
  window.fmtCOP = (n) => '$' + Number(n).toLocaleString('es-CO');
}

// ── MobileShell ────────────────────────────────────────────────────────────────
// Marco 390×844 con status bar simulada arriba (notch + hora) y home indicator abajo.
function MobileShell({ t, children, statusBar = true, homeIndicator = true, bg }) {
  return (
    <div style={{
      width:'100%', height:'100%', background: bg || t.bg,
      fontFamily: ff, display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {statusBar && (
        <div style={{
          height:44, padding:'0 22px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          color: t === DST.light ? '#0A0A0A' : '#FAFAFA',
          fontSize:14, fontWeight:600,
        }}>
          <span>9:41</span>
          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
            <Icon name="signal" size={14} color="currentColor" strokeWidth={2}/>
            <Icon name="wifi" size={14} color="currentColor" strokeWidth={2}/>
            <Icon name="battery-full" size={20} color="currentColor" strokeWidth={1.5}/>
          </div>
        </div>
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0 }}>
        {children}
      </div>
      {homeIndicator && (
        <div style={{ height:24, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <div style={{ width:120, height:4, borderRadius:2, background: t === DST.light ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,.85)' }}/>
        </div>
      )}
    </div>
  );
}

// ── MobileTopbar ───────────────────────────────────────────────────────────────
function MobileTopbar({ t, left, center, right, border = true, bg, padding = '14px 16px' }) {
  return (
    <div style={{
      padding, flexShrink:0,
      background: bg || t.bg,
      borderBottom: border ? `1px solid ${t.border}` : 'none',
      display:'flex', alignItems:'center', gap:10, minHeight:54,
    }}>
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', gap:8 }}>{left}</div>
      <div style={{ flex:1, minWidth:0, display:'flex', justifyContent:'center', alignItems:'center' }}>{center}</div>
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', gap:8 }}>{right}</div>
    </div>
  );
}

// ── MobileBottomNav ────────────────────────────────────────────────────────────
function MobileBottomNav({ t, active = 'mesas', badges = {} }) {
  const tabs = [
    { id:'mesas',    label:'Mesas',    icon:'layout-grid' },
    { id:'comandas', label:'Comandas', icon:'clipboard-list' },
    { id:'perfil',   label:'Mi perfil',icon:'user' },
  ];
  return (
    <div style={{
      borderTop:`1px solid ${t.border}`, background:t.bg, flexShrink:0,
      padding:'8px 0 4px', display:'flex',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        const badge = badges[tab.id];
        return (
          <button key={tab.id} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            background:'transparent', border:'none', cursor:'pointer', padding:'6px 4px', position:'relative',
            color: isActive ? t.accent : t.muted,
          }}>
            <div style={{ position:'relative' }}>
              <Icon name={tab.icon} size={22} color={isActive ? t.accent : t.muted} strokeWidth={isActive ? 2 : 1.6}/>
              {badge && (
                <span style={{
                  position:'absolute', top:-4, right:-8,
                  minWidth:16, height:16, borderRadius:8, padding:'0 4px',
                  background:DST.error, color:'#fff', fontSize:10, fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ff,
                }}>{badge}</span>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight: isActive ? 600 : 500, fontFamily:ff }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── MobileFAB ──────────────────────────────────────────────────────────────────
function MobileFAB({ t, icon = 'plus', color = DST.success, bottom = 76, right = 18 }) {
  return (
    <button style={{
      position:'absolute', bottom, right, width:54, height:54, borderRadius:27,
      background:color, border:'none', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:`0 8px 24px ${color}55, 0 2px 6px rgba(0,0,0,.15)`,
      zIndex:10,
    }}>
      <Icon name={icon} size={24} color="#fff" strokeWidth={2.4}/>
    </button>
  );
}

// ── MobileBtn — botón touch-friendly mínimo 44px ──────────────────────────────
function MobileBtn({ t, children, variant = 'primary', icon, iconRight, full = true, height = 52, style = {} }) {
  const variants = {
    primary:    { background:t.accent, color:'#fff', border:'1px solid transparent' },
    secondary:  { background:'transparent', color:t.text, border:`1px solid ${t.border}` },
    success:    { background:DST.success, color:'#fff', border:'1px solid transparent' },
    danger:     { background:'transparent', color:DST.error, border:`1px solid ${DST.error}55` },
    ghost:      { background:'transparent', color:t.accent, border:'1px solid transparent' },
  };
  return (
    <button style={{
      ...variants[variant],
      height, padding:'0 16px',
      borderRadius:11, fontFamily:ff, fontSize:14, fontWeight:600, cursor:'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      width: full ? '100%' : 'auto',
      ...style,
    }}>
      {icon && <Icon name={icon} size={16} color="currentColor" strokeWidth={2}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={16} color="currentColor" strokeWidth={2}/>}
    </button>
  );
}

// ── Status pill (conexión) ────────────────────────────────────────────────────
function ConnStatus({ t, ok = true, version = 'v1.0.0' }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:11, color:t.muted, padding:'6px 0' }}>
      <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
        <span style={{ width:7, height:7, borderRadius:4, background: ok ? DST.success : DST.error }}/>
        {ok ? 'Conectado' : 'Sin conexión'}
      </span>
      <span style={{ opacity:.6 }}>·</span>
      <span style={{ opacity:.7 }}>{version}</span>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function MobileAvatar({ initials = 'AG', size = 32, bg = '#FCA5A5', color = '#7F1D1D' }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:size/2,
      background:bg, color, fontWeight:600, fontSize: Math.round(size * 0.36),
      display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ff,
      flexShrink:0,
    }}>{initials}</div>
  );
}

// ── Inyectar CSS de animaciones (si pos-shared no se cargó) ───────────────────
if (typeof document !== 'undefined' && !document.getElementById('pos-anim')) {
  const s = document.createElement('style');
  s.id = 'pos-anim';
  s.textContent = `
    @keyframes pos-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.65;transform:scale(.96)} }
    @keyframes pos-pulse-ring { 0%{box-shadow:0 0 0 0 rgba(16,185,129,.5)} 70%{box-shadow:0 0 0 8px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
    .pos-pulse { animation: pos-pulse 1.6s ease-in-out infinite; }
    .pos-pulse-ring { animation: pos-pulse-ring 1.6s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, { MobileShell, MobileTopbar, MobileBottomNav, MobileFAB, MobileBtn, ConnStatus, MobileAvatar });
