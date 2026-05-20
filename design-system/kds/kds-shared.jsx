// kds-shared.jsx — Helpers del KDS (Kitchen Display System)
// Pantalla tablet 1024×768, oscuro por defecto. Texto grande, alto contraste.

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

// Inyectar animaciones del KDS si no están
if (typeof document !== 'undefined' && !document.getElementById('pos-anim')) {
  const s = document.createElement('style');
  s.id = 'pos-anim';
  s.textContent = `
    @keyframes pos-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.65;transform:scale(.96)} }
    @keyframes pos-pulse-ring { 0%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 70%{box-shadow:0 0 0 10px rgba(59,130,246,0)} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} }
    .pos-pulse { animation: pos-pulse 1.6s ease-in-out infinite; }
    .pos-pulse-ring { animation: pos-pulse-ring 1.6s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

// Urgency tokens — el KDS necesita 4 niveles de urgencia
const KDS_URGENCY = {
  urgent: { color:'#EF4444', bg:'rgba(239,68,68,0.18)', label:'URGENTE' },   // >12 min
  warn:   { color:'#F59E0B', bg:'rgba(245,158,11,0.18)', label:'ATENCIÓN' }, // 8-12 min
  normal: { color:null,      bg:null,                    label:null      }, // <8 min
  nuevo:  { color:'#3B82F6', bg:'rgba(59,130,246,0.18)', label:'NUEVO'   }, // <1 min
};

// ── KDS Topbar ────────────────────────────────────────────────────────────────
function KDSTopbar({ t, estacion = 'Cocina Caliente', tabs }) {
  const isDark = t === DST.dark;
  const tabsDefault = tabs || [
    { l:'Pendientes',     n:4, active:true },
    { l:'En preparación', n:3, active:false },
    { l:'Listos',         n:2, active:false },
  ];
  return (
    <div style={{
      height:46, flexShrink:0,
      background: isDark ? '#000' : '#F4F4F5',
      borderBottom: `1px solid ${t.border}`,
      display:'flex', alignItems:'center', padding:'0 18px', gap:18,
      fontFamily:ff, color:t.text,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:200 }}>
        <Icon name="chef-hat" size={20} color={t.accent}/>
        <span style={{ fontSize:15, fontWeight:600 }}>{estacion}</span>
      </div>

      <div style={{ flex:1, textAlign:'center', fontSize:18, fontWeight:600, fontVariantNumeric:'tabular-nums', color:t.text, letterSpacing:'.02em' }}>
        19:34:22
      </div>

      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        {tabsDefault.map(tab => (
          <button key={tab.l} style={{
            padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:ff, fontSize:13, fontWeight:600,
            background: tab.active ? t.accent : (isDark ? '#1F1F23' : '#E4E4E7'),
            color: tab.active ? '#fff' : t.muted,
            display:'flex', alignItems:'center', gap:6,
          }}>
            {tab.l}
            <span style={{
              minWidth:18, padding:'1px 5px', borderRadius:9, fontSize:11,
              background: tab.active ? 'rgba(255,255,255,.25)' : (isDark ? '#000' : '#FAFAFA'),
              color: tab.active ? '#fff' : t.muted,
              fontVariantNumeric:'tabular-nums',
            }}>{tab.n}</span>
          </button>
        ))}
        <button style={{
          width:34, height:34, borderRadius:8, border:'none',
          background: isDark ? '#1F1F23' : '#E4E4E7', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', marginLeft:8, color:t.muted,
        }}>
          <Icon name="settings" size={16} color={t.muted}/>
        </button>
      </div>
    </div>
  );
}

// ── ComandaItem — fila grande de un item dentro de la comanda ────────────────
function KDSItem({ t, qty, nombre, mod }) {
  return (
    <div style={{ padding:'7px 0', borderBottom:`1px solid ${t.border}`, fontFamily:ff }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
        <span style={{
          fontSize:18, fontWeight:700, color:t.accent,
          minWidth:36, fontVariantNumeric:'tabular-nums',
        }}>×{qty}</span>
        <span style={{ fontSize:16, fontWeight:500, color:t.text, lineHeight:1.3 }}>{nombre}</span>
      </div>
      {mod && (
        <div style={{ fontSize:13, color: mod.kind === 'plus' ? DST.success : t.muted, marginLeft:46, marginTop:2 }}>
          → {mod.text}
        </div>
      )}
    </div>
  );
}

// ── KDS ComandaCard ───────────────────────────────────────────────────────────
function KDSComandaCard({ t, mesa, num, tiempo, items, urgency = 'normal', tiempoColor }) {
  const u = KDS_URGENCY[urgency];
  const isDark = t === DST.dark;
  const cardBg = isDark ? '#18181B' : '#FAFAFA';

  return (
    <div style={{
      borderRadius:11, overflow:'hidden',
      background: cardBg,
      border: u.color ? `2px solid ${u.color}` : `1px solid ${t.border}`,
      display:'flex', flexDirection:'column',
      boxShadow: urgency === 'urgent' ? `0 0 0 4px ${u.color}22` : 'none',
      animation: urgency === 'urgent' ? 'pos-pulse 2.6s ease-in-out infinite' : 'none',
    }}>
      {/* Header */}
      <div style={{
        padding:'11px 14px',
        background: u.bg || (isDark ? '#27272A' : '#F4F4F5'),
        borderBottom: u.color ? `1px solid ${u.color}` : `1px solid ${t.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:1 }}>
            <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{mesa}</span>
            {urgency === 'nuevo' && (
              <span className="pos-pulse-ring" style={{
                fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4,
                background:u.color, color:'#fff', letterSpacing:'.06em',
              }}>NUEVO</span>
            )}
          </div>
          <div style={{ fontSize:11, color:t.muted, fontFamily:'monospace' }}>#{num}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5,
          color: u.color || t.text,
          fontWeight:700, fontSize:18, fontVariantNumeric:'tabular-nums' }}>
          <Icon name="timer" size={16} color={u.color || t.text}/>
          {tiempo}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding:'4px 14px 8px', flex:1 }}>
        {items.map((it, i) => <KDSItem key={i} t={t} {...it}/>)}
      </div>

      {/* Botones */}
      <div style={{ padding:'10px 12px', display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:8, borderTop:`1px solid ${t.border}` }}>
        <button style={{
          padding:'10px 8px', borderRadius:8, border:`1px solid ${t.border}`,
          background:'transparent', color:t.text, cursor:'pointer',
          fontFamily:ff, fontSize:12, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:5,
        }}>
          <Icon name="flame" size={14} color={t.text}/>
          Preparando
        </button>
        <button style={{
          padding:'10px 8px', borderRadius:8, border:'none',
          background:DST.success, color:'#fff', cursor:'pointer',
          fontFamily:ff, fontSize:13, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center', gap:5,
          boxShadow:`0 4px 12px ${DST.success}55`,
        }}>
          <Icon name="check" size={15} color="#fff" strokeWidth={2.6}/>
          Listo
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { KDSTopbar, KDSItem, KDSComandaCard, KDS_URGENCY });
