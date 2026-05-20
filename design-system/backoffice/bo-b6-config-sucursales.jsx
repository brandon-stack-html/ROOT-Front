// bo-b6-config-sucursales.jsx — Configuración: Sucursales

const SUCURSALES_DATA = [
  { id:'norte',  nombre:'Sede Norte',  direccion:'Cra. 15 #80-32, Bogotá', cajas:3, mesas:12, activa:true,  principal:true,  color:'#FED7AA', colorTxt:'#9A3412' },
  { id:'centro', nombre:'Sede Centro', direccion:'Cl. 13 #6-55, Bogotá',   cajas:2, mesas:8,  activa:true,  principal:false, color:'#BBF7D0', colorTxt:'#14532D' },
  { id:'sur',    nombre:'Sede Sur',    direccion:'Av. 68 #3-12, Bogotá',   cajas:1, mesas:6,  activa:false, principal:false, color:'#E4E4E7', colorTxt:'#71717A' },
];

function SucursalCard({ t, s }) {
  return (
    <div style={{
      background:t.bg, border:`1px solid ${s.principal ? t.accent : t.border}`, borderRadius:11,
      overflow:'hidden', display:'flex', flexDirection:'column',
      opacity: s.activa ? 1 : 0.7,
      boxShadow: s.principal ? `0 0 0 3px ${t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)'}` : 'none',
    }}>
      {/* Banner color de la sucursal */}
      <div style={{
        height:64, background:s.color, position:'relative',
        display:'flex', alignItems:'center', justifyContent:'flex-start', padding:'0 16px',
      }}>
        <div style={{
          width:40, height:40, borderRadius:10,
          background:'rgba(255,255,255,.7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:s.colorTxt, fontWeight:700, fontSize:14,
        }}>
          <Icon name="store" size={18} color={s.colorTxt} strokeWidth={2}/>
        </div>
        {s.principal && (
          <span style={{
            position:'absolute', top:10, right:10,
            padding:'3px 9px', borderRadius:11,
            background:t.accent, color:'#fff',
            fontSize:10, fontWeight:700, letterSpacing:'.03em',
            display:'flex', alignItems:'center', gap:4,
          }}>
            <Icon name="star" size={10} color="#fff" strokeWidth={2.4}/>
            Principal
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div style={{ padding:'14px 16px 12px', display:'flex', flexDirection:'column', gap:10 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:4 }}>{s.nombre}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:t.muted }}>
            <Icon name="map-pin" size={12} color={t.muted}/>
            {s.direccion}
          </div>
        </div>

        <div style={{
          display:'flex', gap:14, padding:'10px 0',
          borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="calculator" size={13} color={t.muted}/>
            <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{s.cajas} {s.cajas === 1 ? 'caja' : 'cajas'}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="armchair" size={13} color={t.muted}/>
            <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{s.mesas} mesas</span>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:t.text }}>
            <span style={{
              width:8, height:8, borderRadius:4,
              background: s.activa ? DST.success : t.muted,
            }}/>
            {s.activa ? 'Activa' : 'Inactiva'}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{
              padding:'6px 12px', borderRadius:7, background:t.bg,
              border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff,
              fontSize:12, color:t.text, fontWeight:500,
              display:'flex', alignItems:'center', gap:5,
            }}>
              <Icon name="pencil" size={11} color={t.muted}/>
              Editar
            </button>
            <button style={{
              width:30, height:28, borderRadius:7, background:t.bg,
              border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="more-horizontal" size={13} color={t.muted}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SucursalAddCard({ t }) {
  return (
    <button style={{
      background:'transparent', border:`1.5px dashed ${t.border}`, borderRadius:11,
      cursor:'pointer', fontFamily:ff,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
      padding:'40px 20px', minHeight:280,
    }}>
      <div style={{
        width:50, height:50, borderRadius:25,
        background:t.alt,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="plus" size={22} color={t.muted} strokeWidth={2}/>
      </div>
      <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Agregar sucursal</div>
      <div style={{ fontSize:11, color:t.muted, textAlign:'center', maxWidth:180, lineHeight:1.4 }}>
        Expande tu negocio a una nueva ubicación.
      </div>
    </button>
  );
}

function BOB6ConfigSucursales({ t }) {
  return (
    <BackofficeShell t={t} active="config" breadcrumb={['Configuración', 'Sucursales']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Configuración</div>
          <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>3 sucursales registradas · 2 activas</div>
        </div>

        <ConfigTabs t={t} active="sucursales"/>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ fontSize:13, color:t.muted }}>
            Configura cada punto de venta físico de tu negocio.
          </div>
          <button style={{
            padding:'8px 14px', borderRadius:8, background:t.accent,
            color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
            fontSize:13, fontWeight:600,
            display:'flex', alignItems:'center', gap:6,
          }}>
            <Icon name="plus" size={14} color="#fff" strokeWidth={2.4}/>
            Agregar sucursal
          </button>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
          {SUCURSALES_DATA.map(s => <SucursalCard key={s.id} t={t} s={s}/>)}
          <SucursalAddCard t={t}/>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB6ConfigSucursales, SUCURSALES_DATA });
