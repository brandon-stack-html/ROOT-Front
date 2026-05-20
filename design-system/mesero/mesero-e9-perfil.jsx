// mesero-e9-perfil.jsx — Perfil del mesero

function SettingRow({ t, icon, label, right, last }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'14px 0',
      borderBottom: last ? 'none' : `1px solid ${t.border}`,
      cursor:'pointer',
    }}>
      <div style={{
        width:34, height:34, borderRadius:9, background:t.alt,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={icon} size={16} color={t.text}/>
      </div>
      <span style={{ flex:1, fontSize:14, color:t.text, fontWeight:500 }}>{label}</span>
      {right}
    </div>
  );
}

function Switch({ t, on }) {
  return (
    <div style={{
      width:38, height:22, borderRadius:11,
      background: on ? t.accent : t.border,
      position:'relative', cursor:'pointer', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:2,
        left: on ? 18 : 2,
        width:18, height:18, borderRadius:9, background:'#fff',
        boxShadow:'0 1px 2px rgba(0,0,0,.2)',
        transition:'left .15s',
      }}/>
    </div>
  );
}

function MeseroE9Perfil({ t }) {
  return (
    <MobileShell t={t}>
      <MobileTopbar t={t}
        left={<div style={{ width:34 }}/>}
        center={<div style={{ fontSize:15, fontWeight:600, color:t.text }}>Mi perfil</div>}
        right={
          <button style={{ width:34, height:34, borderRadius:8, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="more-vertical" size={18} color={t.text}/>
          </button>
        }
        border={false}
      />

      <div style={{ flex:1, overflow:'auto' }}>
        {/* Header con fondo acento */}
        <div style={{
          padding:'16px 18px 22px',
          background: t === DST.light
            ? `linear-gradient(180deg, rgba(79,70,229,.08) 0%, rgba(79,70,229,0) 100%)`
            : `linear-gradient(180deg, rgba(79,70,229,.18) 0%, rgba(79,70,229,0) 100%)`,
          textAlign:'center',
        }}>
          <div style={{
            width:80, height:80, borderRadius:40,
            background: t.accent, margin:'0 auto 12px',
            color:'#fff', fontSize:28, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 8px 24px ${t.accent}55`,
          }}>AG</div>
          <div style={{ fontSize:18, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Andrea García</div>
          <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>Mesera · Sede Norte</div>
          <div style={{
            marginTop:8, display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:11,
            background: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.18)',
            color: t === DST.light ? '#065F46' : DST.success,
            fontSize:11, fontWeight:600,
          }}>
            <span style={{ width:6, height:6, borderRadius:3, background:DST.success }}/>
            Turno activo desde las 12:00
          </div>
        </div>

        {/* KPIs */}
        <div style={{ padding:'4px 16px 16px' }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Resumen del turno</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[
              { l:'Mesas',    v:'12',         icon:'layout-grid',  color:DST.info },
              { l:'Ventas',   v:'$1.234K',    icon:'trending-up',  color:DST.success },
              { l:'Propinas', v:'$45K',       icon:'sparkles',     color:DST.warning },
            ].map(k => (
              <div key={k.l} style={{
                padding:'12px 10px', background:t.alt, border:`1px solid ${t.border}`, borderRadius:10,
                textAlign:'center',
              }}>
                <div style={{ marginBottom:4, color:k.color, display:'flex', justifyContent:'center' }}>
                  <Icon name={k.icon} size={16} color={k.color}/>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{k.v}</div>
                <div style={{ fontSize:10, color:t.muted, fontWeight:500, marginTop:1 }}>{k.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ajustes */}
        <div style={{ padding:'4px 16px 16px' }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Ajustes</div>
          <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'0 14px' }}>
            <SettingRow t={t} icon="moon"   label="Tema oscuro"          right={<Switch t={t} on={t === DST.dark}/>}/>
            <SettingRow t={t} icon="bell"   label="Notificaciones"       right={<Switch t={t} on={true}/>}/>
            <SettingRow t={t} icon="lock"   label="Cambiar contraseña"   right={<Icon name="chevron-right" size={16} color={t.muted}/>}/>
            <SettingRow t={t} icon="info"   label="Sobre la app"         right={<Icon name="chevron-right" size={16} color={t.muted}/>} last/>
          </div>
        </div>

        {/* Cerrar sesión */}
        <div style={{ padding:'4px 16px 16px' }}>
          <MobileBtn t={t} variant="danger" icon="log-out" height={50}>
            Cerrar sesión
          </MobileBtn>
        </div>

        <div style={{ textAlign:'center', fontSize:10, color:t.muted, padding:'4px 16px 16px', opacity:.7 }}>
          Inventario v1.0.0 · Build 2026.05
        </div>
      </div>

      <MobileBottomNav t={t} active="perfil"/>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE9Perfil });
