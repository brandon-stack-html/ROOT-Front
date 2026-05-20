// auth-a5-selector.jsx — Selector de sucursal (A5)

const SUCURSALES = [
  {
    id:'norte',
    nombre:'Sede Norte',
    direccion:'Cra. 15 #80-32, Bogotá',
    badge:{ label:'Caja abierta', tone:'success' },
    meta:'3 cajas activas · 12 mesas',
    icon:'building-2',
  },
  {
    id:'centro',
    nombre:'Sede Centro',
    direccion:'Cl. 13 #6-55, Bogotá',
    badge:{ label:'Caja cerrada', tone:'muted' },
    meta:'2 cajas · 8 mesas',
    icon:'building',
  },
  {
    id:'sur',
    nombre:'Sede Sur',
    direccion:'Av. 68 #3-12, Bogotá',
    badge:{ label:'Tu sucursal habitual', tone:'warning' },
    meta:'2 cajas activas · 10 mesas',
    icon:'star',
    selected:true,
  },
];

function SucursalCard({ t, sucursal, mobile = false }) {
  const s = sucursal;
  const tones = {
    success: { bg: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.18)', color:'#065F46' },
    muted:   { bg: t.alt, color:t.muted },
    warning: { bg: t === DST.light ? '#FEF3C7' : 'rgba(245,158,11,.18)', color:'#92400E' },
  };
  const badge = tones[s.badge.tone];
  const isSelected = s.selected;

  return (
    <div style={{
      padding: mobile ? '18px' : '22px',
      background: t.bg,
      borderRadius: 12,
      border: isSelected ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
      boxShadow: isSelected
        ? `0 8px 24px ${t.accent}22, 0 0 0 4px ${t.accent}11`
        : t === DST.light ? '0 1px 3px rgba(0,0,0,.04)' : '0 1px 3px rgba(0,0,0,.3)',
      cursor:'pointer', position:'relative',
      display:'flex', flexDirection:'column', gap:14,
      transition:'all .15s',
    }}>
      {isSelected && (
        <div style={{
          position:'absolute', top:14, right:14,
          width:22, height:22, borderRadius:11, background:t.accent,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="check" size={13} color="#fff" strokeWidth={3}/>
        </div>
      )}

      {/* Ícono */}
      <div style={{
        width:42, height:42, borderRadius:10,
        background: t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: t.accent,
      }}>
        <Icon name={s.icon} size={20} color={t.accent} strokeWidth={1.7}/>
      </div>

      {/* Info */}
      <div>
        <div style={{ fontSize:16, fontWeight:600, color:t.text, marginBottom:3 }}>{s.nombre}</div>
        <div style={{ fontSize:12, color:t.muted, display:'flex', alignItems:'center', gap:5 }}>
          <Icon name="map-pin" size={11} color={t.muted}/>
          {s.direccion}
        </div>
      </div>

      {/* Badge */}
      <div>
        <span style={{
          fontSize:10, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
          padding:'4px 9px', borderRadius:5,
          background: badge.bg, color: badge.color,
          display:'inline-flex', alignItems:'center', gap:5,
        }}>
          {s.badge.tone === 'success' && <span style={{ width:6, height:6, borderRadius:3, background:DST.success }}/>}
          {s.badge.label}
        </span>
      </div>

      {/* Meta */}
      <div style={{ fontSize:11, color:t.muted, paddingTop:10, borderTop:`1px solid ${t.border}` }}>
        {s.meta}
      </div>
    </div>
  );
}

function AuthA5Selector({ t, mobile = false }) {
  const dotColor = t === DST.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)';
  return (
    <div style={{
      width:'100%', height:'100%', overflow:'auto',
      background: t.bg,
      backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      fontFamily: ff,
      display:'flex', flexDirection:'column',
    }}>
      {/* Topbar mínima */}
      <div style={{
        height: mobile ? 56 : 64,
        padding: mobile ? '0 18px' : '0 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:`1px solid ${t.border}`, background:t.bg,
        flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>I</div>
          <span style={{ fontSize:14, fontWeight:600, color:t.text }}>Inventario</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{!mobile && 'Juan Camilo Restrepo'}</span>
          <div style={{ width:32, height:32, borderRadius:16, background:'#FCA5A5', display:'flex', alignItems:'center', justifyContent:'center', color:'#7F1D1D', fontWeight:600, fontSize:12 }}>JC</div>
        </div>
      </div>

      {/* Centro */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding: mobile ? '32px 20px' : '60px 40px',
        gap: mobile ? 28 : 40,
      }}>
        <div style={{ textAlign:'center', maxWidth:560 }}>
          <div style={{ fontSize: mobile ? 24 : 32, fontWeight:700, color:t.text, letterSpacing:'-.02em', marginBottom:8 }}>
            Hola, Juan Camilo <span style={{ display:'inline-block', transform:'translateY(-2px)' }}>👋</span>
          </div>
          <div style={{ fontSize:14, color:t.muted, lineHeight:1.5 }}>
            Selecciona la sucursal donde vas a trabajar hoy
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 280px)',
          gap: mobile ? 12 : 18,
          width:'100%', maxWidth: mobile ? 420 : 'none', justifyContent:'center',
        }}>
          {SUCURSALES.map(s => <SucursalCard key={s.id} t={t} sucursal={s} mobile={mobile}/>)}
        </div>

        <a style={{ fontSize:12, color:t.muted, cursor:'pointer', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:5 }}>
          Solo gestionar configuración
          <Icon name="arrow-right" size={12} color={t.muted}/>
        </a>
      </div>
    </div>
  );
}

Object.assign(window, { AuthA5Selector });
