// pos-c2-mapa.jsx — Mapa de mesas (pantalla principal POS)

// 12 mesas con posiciones "orgánicas" tipo plano real
const MESAS_LAYOUT = [
  { num:1,  x:60,  y:50,  estado:'libre' },
  { num:2,  x:200, y:50,  estado:'ocupada', mesero:'JC', tiempo:'00:23', total:45000 },
  { num:3,  x:340, y:50,  estado:'ocupada', mesero:'AG', tiempo:'00:18', total:38000 },
  { num:4,  x:60,  y:180, estado:'cocina',  mesero:'JC', tiempo:'00:42', total:92000 },
  { num:5,  x:200, y:180, estado:'cocina',  mesero:'SR', tiempo:'00:35', total:67000 },
  { num:6,  x:340, y:180, estado:'lista',   mesero:'AG', tiempo:'00:14', total:78000 },
  { num:7,  x:480, y:50,  estado:'libre' },
  { num:8,  x:480, y:180, estado:'libre' },
  { num:9,  x:60,  y:310, estado:'libre' },
  { num:10, x:200, y:310, estado:'libre' },
  { num:11, x:340, y:310, estado:'ocupada', mesero:'SR', tiempo:'1h 20m', total:128000, warn:true },
  { num:12, x:480, y:310, estado:'libre' },
];

const ESTADO_STYLE = (estado, t, mode) => {
  const isLight = t === DST.light;
  switch (estado) {
    case 'libre':
      return { bg:t.alt, border:`1px solid ${t.border}`, accent:t.muted, label:'Libre' };
    case 'ocupada':
      return { bg: isLight ? '#EFF6FF' : '#172554', border:`1px solid ${isLight ? '#BFDBFE' : '#1E3A8A'}`, accent:DST.info, label:'Ocupada' };
    case 'cocina':
      return { bg: isLight ? '#FEF3C7' : '#451A03', border:`1px solid ${isLight ? '#FDE68A' : '#78350F'}`, accent:DST.warning, label:'En cocina' };
    case 'lista':
      return { bg: isLight ? '#D1FAE5' : '#064E3B', border:`1.5px solid ${DST.success}`, accent:DST.success, label:'Listo' };
  }
};

function MesaCard({ mesa, t, size = 'md' }) {
  const s = ESTADO_STYLE(mesa.estado, t);
  const W = size === 'sm' ? 110 : 120;
  const H = size === 'sm' ? 110 : 120;
  return (
    <div style={{
      position:'absolute', left:mesa.x, top:mesa.y,
      width:W, height:H, borderRadius:10,
      background:s.bg, border: mesa.warn ? `1.5px solid ${DST.error}` : s.border,
      padding:10, display:'flex', flexDirection:'column', boxSizing:'border-box',
      cursor:'pointer',
    }}>
      {/* Top: número + badge */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:24, fontWeight:700, color:t.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{mesa.num}</span>
        {mesa.estado === 'lista' ? (
          <span className="pos-pulse-ring" style={{
            fontSize:9, fontWeight:600, color:'#fff', background:DST.success,
            padding:'3px 7px', borderRadius:10, letterSpacing:'.04em',
          }}>¡LISTO!</span>
        ) : mesa.estado !== 'libre' && (
          <span style={{
            fontSize:9, fontWeight:600, color:s.accent, background:'rgba(255,255,255,.5)',
            padding:'3px 7px', borderRadius:10, letterSpacing:'.04em',
            border: t === DST.light ? 'none' : `1px solid ${s.accent}55`,
            backgroundColor: t === DST.light ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.08)',
          }}>{s.label.toUpperCase()}</span>
        )}
      </div>

      {/* Estado libre: solo número grande centrado */}
      {mesa.estado === 'libre' && (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', marginTop:-12 }}>
          <span style={{ fontSize:10, color:t.muted, fontWeight:500, letterSpacing:'.05em' }}>LIBRE</span>
        </div>
      )}

      {/* Mesa con datos */}
      {mesa.estado !== 'libre' && (
        <>
          <div style={{ flex:1 }}/>
          {mesa.warn && (
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <Icon name="alert-triangle" size={10} color={DST.error}/>
              <span style={{ fontSize:9, color:DST.error, fontWeight:600 }}>1h 20m</span>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <div style={{ width:18, height:18, borderRadius:9, background:'#FCA5A5', color:'#7F1D1D', fontSize:9, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>{mesa.mesero}</div>
            {!mesa.warn && (
              <span style={{ fontSize:10, color:t.muted, fontWeight:500 }}>
                <Icon name="clock" size={9} color={t.muted} style={{ marginRight:3, verticalAlign:'-1px' }}/>{mesa.tiempo}
              </span>
            )}
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(mesa.total)}</div>
        </>
      )}
    </div>
  );
}

function POSC2MapaMesas({ t, tablet = false }) {
  // Dot pattern background
  const dotColor = t === DST.light ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.06)';
  const dotBg = `radial-gradient(${dotColor} 1px, transparent 1px)`;

  // Para tablet: scale a layout más compacto
  const scale = tablet ? 0.78 : 1;

  return (
    <div style={{
      width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background:t.alt, fontFamily:ff, overflow:'hidden',
    }}>
      <POSTopbar t={t} screenName="POS"/>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Área principal */}
        <div style={{
          flex:1, position:'relative',
          background:`${dotBg} ${t.alt}`, backgroundSize:'18px 18px',
        }}>
          {/* Header del área */}
          <div style={{ padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:11, color:t.muted, fontWeight:500, marginBottom:2 }}>Salón Principal</div>
              <div style={{ fontSize:18, fontWeight:600, color:t.text }}>Mapa de mesas <span style={{ fontSize:12, color:t.muted, fontWeight:400, marginLeft:6 }}>· 12 mesas · 5 ocupadas</span></div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <POSBtn t={t} variant="secondary" size="sm" icon="filter">Filtrar</POSBtn>
              <POSBtn t={t} variant="secondary" size="sm" icon="layout-grid">Vista lista</POSBtn>
            </div>
          </div>

          {/* Grid orgánico de mesas */}
          <div style={{ position:'relative', height:480, transform:`scale(${scale})`, transformOrigin:'top left', width: tablet ? `${100/scale}%` : 'auto' }}>
            {/* Líneas decorativas del salón */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:.35 }}>
              <line x1="40" y1="155" x2="600" y2="155" stroke={t.border} strokeWidth="1" strokeDasharray="3,4"/>
              <line x1="40" y1="285" x2="600" y2="285" stroke={t.border} strokeWidth="1" strokeDasharray="3,4"/>
              <line x1="160" y1="20" x2="160" y2="430" stroke={t.border} strokeWidth="1" strokeDasharray="3,4"/>
              <line x1="300" y1="20" x2="300" y2="430" stroke={t.border} strokeWidth="1" strokeDasharray="3,4"/>
              <line x1="440" y1="20" x2="440" y2="430" stroke={t.border} strokeWidth="1" strokeDasharray="3,4"/>
            </svg>
            {MESAS_LAYOUT.map(m => (
              <MesaCard key={m.num} mesa={m} t={t}/>
            ))}
          </div>

          {/* FAB venta mostrador */}
          <div style={{ position:'absolute', bottom:24, right:24 }}>
            <button style={{
              padding:'12px 18px', borderRadius:12, border:'none', cursor:'pointer',
              background:t.accent, color:'#fff', fontFamily:ff, fontSize:13, fontWeight:600,
              display:'flex', alignItems:'center', gap:8,
              boxShadow:'0 8px 24px rgba(79,70,229,.4)',
            }}>
              <Icon name="plus" size={16} color="#fff" strokeWidth={2.2}/>
              Venta mostrador
            </button>
          </div>
        </div>

        {/* Sidebar derecho */}
        {!tablet && <POSTurnoSidebar t={t}/>}
      </div>
    </div>
  );
}

Object.assign(window, { POSC2MapaMesas });
