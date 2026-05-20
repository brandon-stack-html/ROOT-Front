// pos-shared.jsx — Helpers y componentes compartidos del POS Web
// Requiere: ds-tokens.jsx + Lucide UMD cargados antes

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtCOP = (n) => '$' + Number(n).toLocaleString('es-CO');

// Lucide icon — crea SVG vía lucide.icons[Name] (PascalCase). El UMD expone
// cada ícono como [tag, attrs, [[childTag, childAttrs], ...]].
function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.75, style = {} }) {
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
}

// ── Topbar del POS ─────────────────────────────────────────────────────────────
function POSTopbar({ t, sala = 'Salón Principal', monto = 1234000, screenName = 'POS' }) {
  const salas = ['Salón Principal', 'Terraza', 'Barra'];
  return (
    <div style={{
      height:56, background:t.bg, borderBottom:`1px solid ${t.border}`,
      display:'flex', alignItems:'center', padding:'0 18px', gap:18, fontFamily:ff, flexShrink:0,
    }}>
      {/* Izq: logo + badge */}
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:160 }}>
        <div style={{ width:24, height:24, borderRadius:6, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>I</div>
        <span style={{ fontWeight:600, fontSize:14, color:t.text }}>Inventario</span>
        <span style={{ fontSize:10, fontWeight:600, color:t.accent, background: t === DST.light ? 'rgba(79,70,229,.1)' : 'rgba(79,70,229,.2)', padding:'3px 8px', borderRadius:4, letterSpacing:'.04em' }}>{screenName}</span>
      </div>
      {/* Centro: tabs de sala */}
      <div style={{ display:'flex', gap:4, flex:1, justifyContent:'center' }}>
        {salas.map(s => (
          <button key={s} style={{
            padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:ff, fontSize:13, fontWeight:500,
            background: s === sala ? t.alt : 'transparent',
            color: s === sala ? t.text : t.muted,
          }}>{s}</button>
        ))}
      </div>
      {/* Der: monto + notif + avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:160, justifyContent:'flex-end' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', background:t.alt, borderRadius:7 }}>
          <Icon name="banknote" size={14} color={DST.success}/>
          <span style={{ fontSize:12, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(monto)}</span>
        </div>
        <button style={{ position:'relative', width:32, height:32, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', color:t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="bell" size={16} color={t.muted}/>
          <span style={{ position:'absolute', top:6, right:6, width:6, height:6, borderRadius:3, background:DST.error }}/>
        </button>
        <div style={{ width:30, height:30, borderRadius:15, background:'#FCA5A5', display:'flex', alignItems:'center', justifyContent:'center', color:'#7F1D1D', fontWeight:600, fontSize:11 }}>AG</div>
      </div>
    </div>
  );
}

// ── Sidebar resumen del turno (260px) ──────────────────────────────────────────
function POSTurnoSidebar({ t }) {
  const KPI = ({ label, value }) => (
    <div style={{ padding:'10px 0' }}>
      <div style={{ fontSize:10, color:t.muted, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{value}</div>
    </div>
  );
  const mesasActivas = [
    { num:6, total:78000, mesero:'Andrea G.', tiempo:'14m' },
    { num:2, total:45000, mesero:'Juan C.', tiempo:'23m' },
    { num:11, total:128000, mesero:'Sofía R.', tiempo:'1h 20m', warn:true },
  ];
  return (
    <div style={{ width:260, background:t.bg, borderLeft:`1px solid ${t.border}`, padding:'18px 18px 16px', display:'flex', flexDirection:'column', gap:0, fontFamily:ff, flexShrink:0 }}>
      <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:6 }}>Turno actual</div>
      <KPI label="Ventas" value={fmtCOP(1234000)}/>
      <div style={{ borderTop:`1px solid ${t.border}` }}/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
        <KPI label="Mesas atendidas" value="8"/>
        <KPI label="Ticket prom." value={fmtCOP(68555)}/>
      </div>
      <div style={{ borderTop:`1px solid ${t.border}`, margin:'8px 0' }}/>
      <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:8 }}>Mesas activas</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {mesasActivas.map(m => (
          <div key={m.num} style={{
            padding:'8px 10px', borderRadius:7, background:t.alt,
            border: m.warn ? `1px solid ${DST.error}` : `1px solid ${t.border}`,
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{ width:28, height:28, borderRadius:6, background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:t.text }}>{m.num}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, color:t.text, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.mesero}</div>
              <div style={{ fontSize:10, color: m.warn ? DST.error : t.muted, fontWeight: m.warn ? 600 : 400 }}>{m.tiempo}</div>
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(m.total)}</div>
          </div>
        ))}
      </div>
      <button style={{
        marginTop:10, padding:'8px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
        background:'transparent', color:t.accent,
      }}>Ver todas las ventas →</button>
      <div style={{ flex:1 }}/>
      <button style={{
        padding:'9px', borderRadius:7, border:`1px solid ${DST.error}33`, cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
        background:'transparent', color:DST.error,
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      }}>
        <Icon name="lock" size={13} color={DST.error}/> Cerrar caja
      </button>
    </div>
  );
}

// ── Botón POS estandarizado ────────────────────────────────────────────────────
function POSBtn({ children, variant = 'primary', t, size = 'md', icon, full = false, onClick, style = {} }) {
  const sizes = {
    sm: { padding:'6px 12px', fontSize:12 },
    md: { padding:'9px 16px', fontSize:13 },
    lg: { padding:'12px 20px', fontSize:14 },
  };
  const variants = {
    primary:    { background:t.accent, color:'#fff', border:'1px solid transparent' },
    secondary:  { background:'transparent', color:t.text, border:`1px solid ${t.border}` },
    ghost:      { background:'transparent', color:t.accent, border:'1px solid transparent' },
    success:    { background:DST.success, color:'#fff', border:'1px solid transparent' },
    danger:     { background:DST.error, color:'#fff', border:'1px solid transparent' },
    dangerOutline:{ background:'transparent', color:DST.error, border:`1px solid ${DST.error}55` },
  };
  return (
    <button onClick={onClick} style={{
      ...sizes[size], ...variants[variant],
      borderRadius:8, fontFamily:ff, fontWeight:500, cursor:'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      width: full ? '100%' : 'auto', whiteSpace:'nowrap',
      ...style,
    }}>
      {icon && <Icon name={icon} size={size === 'lg' ? 16 : 14} color="currentColor"/>}
      {children}
    </button>
  );
}

// ── Inyectar keyframes globales para badges pulsantes ──────────────────────────
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

Object.assign(window, { fmtCOP, Icon, POSTopbar, POSTurnoSidebar, POSBtn });
