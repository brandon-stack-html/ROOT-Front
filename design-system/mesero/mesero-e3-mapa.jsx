// mesero-e3-mapa.jsx — Mapa de mesas (mesero móvil)

const MESAS_MOBILE = [
  { num:1, estado:'libre' },
  { num:2, estado:'ocupada', tiempo:'00:34', total:45000 },
  { num:3, estado:'cocina',  tiempo:'00:18', total:62000 },
  { num:4, estado:'lista',   tiempo:'00:14', total:78000 },
  { num:5, estado:'ocupada', tiempo:'1h 20m', total:128000, warn:true },
  { num:6, estado:'libre' },
  { num:7, estado:'cocina',  tiempo:'00:08', total:24000 },
  { num:8, estado:'libre' },
];

function MesaMobileCard({ t, mesa }) {
  const isLight = t === DST.light;
  const STYLES = {
    libre:   { bg:t.alt, border:`1px solid ${t.border}`, accent:t.muted, label:'Libre' },
    ocupada: { bg: isLight ? '#EFF6FF' : 'rgba(59,130,246,.15)', border:`1px solid ${isLight ? '#BFDBFE' : '#1E3A8A'}`, accent:DST.info, label:'Ocupada' },
    cocina:  { bg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)', border:`1px solid ${isLight ? '#FDE68A' : '#78350F'}`, accent:DST.warning, label:'En cocina' },
    lista:   { bg: isLight ? '#D1FAE5' : 'rgba(16,185,129,.18)', border:`1.5px solid ${DST.success}`, accent:DST.success, label:'Listo' },
  };
  const s = STYLES[mesa.estado];
  return (
    <div style={{
      borderRadius:13, padding:'14px 14px',
      background: s.bg,
      border: mesa.warn ? `1.5px solid ${DST.error}` : s.border,
      minHeight:140,
      display:'flex', flexDirection:'column', gap:6, cursor:'pointer',
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <span style={{ fontSize:30, fontWeight:700, color:t.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{mesa.num}</span>
        {mesa.estado === 'lista' && (
          <span className="pos-pulse-ring" style={{
            fontSize:10, fontWeight:700, color:'#fff', background:DST.success,
            padding:'4px 9px', borderRadius:11, letterSpacing:'.04em',
          }}>¡LISTO!</span>
        )}
        {mesa.warn && (
          <span style={{
            fontSize:9, fontWeight:700, color:'#fff', background:DST.error,
            padding:'4px 7px', borderRadius:5, letterSpacing:'.04em',
            display:'flex', alignItems:'center', gap:3,
          }}>
            <Icon name="alert-triangle" size={9} color="#fff" strokeWidth={2.5}/>
            {mesa.tiempo}
          </span>
        )}
        {(mesa.estado === 'cocina' || (mesa.estado === 'ocupada' && !mesa.warn)) && (
          <span style={{
            fontSize:9, fontWeight:600, padding:'3px 7px', borderRadius:10,
            background: isLight ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.1)',
            color: s.accent, letterSpacing:'.03em', textTransform:'uppercase',
          }}>{s.label}</span>
        )}
      </div>
      <div style={{ flex:1 }}/>
      {mesa.estado === 'libre' ? (
        <span style={{ fontSize:11, color:t.muted, fontWeight:500, letterSpacing:'.04em' }}>LIBRE</span>
      ) : (
        <>
          {!mesa.warn && (
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:t.muted }}>
              <Icon name="clock" size={11} color={t.muted}/>
              {mesa.tiempo}
            </div>
          )}
          <div style={{ fontSize:15, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(mesa.total)}</div>
        </>
      )}
    </div>
  );
}

function MeseroE3Mapa({ t }) {
  return (
    <MobileShell t={t}>
      <MobileTopbar t={t}
        left={
          <div>
            <div style={{ fontSize:11, color:t.muted, lineHeight:1.2 }}>Hola,</div>
            <div style={{ fontSize:14, fontWeight:600, color:t.text, lineHeight:1.2 }}>Andrea 👋</div>
          </div>
        }
        center={
          <button style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'7px 11px', background:t.alt, border:`1px solid ${t.border}`, borderRadius:8,
            cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500, color:t.text,
          }}>
            Salón Principal
            <Icon name="chevron-down" size={13} color={t.muted}/>
          </button>
        }
        right={
          <button style={{ position:'relative', padding:'8px', borderRadius:8, background:'transparent', border:'none', cursor:'pointer', display:'flex' }}>
            <Icon name="bell" size={20} color={t.text}/>
            <span style={{
              position:'absolute', top:4, right:4, minWidth:16, height:16, borderRadius:8, padding:'0 4px',
              background:DST.error, color:'#fff', fontSize:10, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>2</span>
          </button>
        }
      />

      <div style={{ flex:1, overflow:'auto', padding:'14px 14px 18px', position:'relative' }}>
        {/* KPIs compactos */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[
            { l:'Mis mesas',  v:'4' },
            { l:'Activas',    v:'3' },
            { l:'Mis ventas', v:'$313K' },
          ].map((k, i) => (
            <div key={i} style={{ flex:1, padding:'8px 10px', background:t.alt, borderRadius:9, border:`1px solid ${t.border}` }}>
              <div style={{ fontSize:9, color:t.muted, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>{k.l}</div>
              <div style={{ fontSize:14, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{k.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {MESAS_MOBILE.map(m => <MesaMobileCard key={m.num} t={t} mesa={m}/>)}
        </div>

        <MobileFAB t={t} icon="plus" color={DST.success}/>
      </div>

      <MobileBottomNav t={t} active="mesas"/>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE3Mapa });
