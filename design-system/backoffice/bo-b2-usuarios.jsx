// bo-b2-usuarios.jsx — Gestión de usuarios

const USUARIOS = [
  { iniciales:'JC', avBg:'#FCA5A5', avFg:'#7F1D1D',
    nombre:'Juan Camilo R.',  email:'jcamilo@buen-sabor.co',     rol:'Admin',     sucursales:'Todas',         conexion:'Hace 2 min',  estado:'activo' },
  { iniciales:'AG', avBg:'#FCA5A5', avFg:'#7F1D1D',
    nombre:'Andrea García',   email:'andrea.garcia@buen-sabor.co',rol:'Mesera',    sucursales:'Sede Norte',   conexion:'Hace 15 min', estado:'activo' },
  { iniciales:'MR', avBg:'#86EFAC', avFg:'#14532D',
    nombre:'Miguel Rodríguez',email:'m.rodriguez@buen-sabor.co', rol:'Cajero',    sucursales:'Sede Norte',   conexion:'Ayer 20:34',  estado:'activo' },
  { iniciales:'LP', avBg:'#E4E4E7', avFg:'#71717A',
    nombre:'Laura Pérez',     email:'l.perez@buen-sabor.co',     rol:'Encargada', sucursales:'Sede Centro',  conexion:'Hace 3 días', estado:'inactivo' },
  { iniciales:'CF', avBg:'#93C5FD', avFg:'#1E3A8A',
    nombre:'Carlos Forero',   email:'c.forero@buen-sabor.co',    rol:'Mesero',    sucursales:'Sede Sur',     conexion:'Hace 1 hora', estado:'activo' },
];

function RolChip({ t, label }) {
  const palette = {
    'Admin':     { l:'#EDE9FE', d:'rgba(139,92,246,.18)', txtL:'#5B21B6', txtD:'#C4B5FD' },
    'Mesera':    { l:'#FCE7F3', d:'rgba(236,72,153,.18)', txtL:'#9D174D', txtD:'#FBCFE8' },
    'Mesero':    { l:'#FCE7F3', d:'rgba(236,72,153,.18)', txtL:'#9D174D', txtD:'#FBCFE8' },
    'Cajero':    { l:'#DCFCE7', d:'rgba(16,185,129,.18)', txtL:'#14532D', txtD:'#86EFAC' },
    'Encargada': { l:'#DBEAFE', d:'rgba(59,130,246,.18)', txtL:'#1E40AF', txtD:'#93C5FD' },
    'Repartidor':{ l:'#FFEDD5', d:'rgba(249,115,22,.18)', txtL:'#9A3412', txtD:'#FED7AA' },
  };
  const p = palette[label] || palette['Admin'];
  const isLight = t === DST.light;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'3px 9px', borderRadius:11,
      fontSize:11, fontWeight:600,
      background: isLight ? p.l : p.d,
      color: isLight ? p.txtL : p.txtD,
    }}>{label}</span>
  );
}

function BOB2UsuariosBody({ t }) {
  return (
    <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Usuarios</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>12 usuarios · 5 roles asignados</div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ position:'relative', width:280 }}>
            <Icon name="search" size={14} color={t.muted} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
            <input readOnly placeholder="Buscar usuario..." style={{
              width:'100%', padding:'8px 12px 8px 32px', fontSize:12, fontFamily:ff,
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, outline:'none', boxSizing:'border-box',
            }}/>
          </div>
          {[
            { l:'Rol',    v:'Todos' },
            { l:'Estado', v:'Todos' },
          ].map(f => (
            <button key={f.l} style={{
              padding:'8px 12px', borderRadius:7, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:7, fontFamily:ff, fontSize:12, color:t.text,
            }}>
              <span style={{ color:t.muted }}>{f.l}:</span>
              <span style={{ fontWeight:500 }}>{f.v}</span>
              <Icon name="chevron-down" size={11} color={t.muted}/>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <button style={{
            padding:'8px 14px', borderRadius:8, background:t.accent, color:'#fff', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:13, fontWeight:600,
          }}>
            <Icon name="plus" size={14} color="#fff" strokeWidth={2.4}/>
            Nuevo usuario
          </button>
        </div>

        {/* Tabla */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          {/* Header tabla */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'1.6fr 1.7fr 0.9fr 1fr 1fr 0.8fr 50px',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Usuario</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Sucursales</div>
            <div>Última conexión</div>
            <div>Estado</div>
            <div></div>
          </div>

          {USUARIOS.map((u, i) => {
            const isInactive = u.estado === 'inactivo';
            return (
              <div key={u.iniciales} style={{
                display:'grid',
                gridTemplateColumns:'1.6fr 1.7fr 0.9fr 1fr 1fr 0.8fr 50px',
                padding:'13px 18px', alignItems:'center',
                borderBottom: i < USUARIOS.length - 1 ? `1px solid ${t.border}` : 'none',
                background: isInactive ? t.alt : 'transparent',
                opacity: isInactive ? 0.65 : 1,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                  <div style={{
                    width:32, height:32, borderRadius:16,
                    background:u.avBg, color:u.avFg,
                    fontWeight:600, fontSize:12,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>{u.iniciales}</div>
                  <span style={{ fontSize:13, fontWeight:500, color:t.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.nombre}</span>
                </div>
                <div style={{ fontSize:12, color:t.muted, fontFamily:'monospace', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                <div><RolChip t={t} label={u.rol}/></div>
                <div style={{ fontSize:12, color:t.text }}>{u.sucursales}</div>
                <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{u.conexion}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:t.text }}>
                  <span style={{
                    width:7, height:7, borderRadius:4,
                    background: isInactive ? t.muted : DST.success,
                  }}/>
                  {isInactive ? 'Inactiva' : 'Activo'}
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button style={{
                    width:28, height:28, borderRadius:6, border:'none',
                    background:'transparent', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon name="more-horizontal" size={15} color={t.muted}/>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer paginación */}
          <div style={{
            padding:'12px 18px', borderTop:`1px solid ${t.border}`, background:t.alt,
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <span style={{ fontSize:11, color:t.muted }}>Mostrando 1–5 de 12 usuarios</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <button style={{
                width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.bg, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="chevron-left" size={13} color={t.muted}/>
              </button>
              {['1','2','3'].map((p, idx) => (
                <button key={p} style={{
                  width:28, height:28, borderRadius:6,
                  border:`1px solid ${idx === 0 ? t.accent : t.border}`,
                  background: idx === 0 ? t.accent : t.bg,
                  color: idx === 0 ? '#fff' : t.text,
                  fontWeight:600, fontSize:11, cursor:'pointer', fontFamily:ff,
                }}>{p}</button>
              ))}
              <button style={{
                width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.bg, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="chevron-right" size={13} color={t.muted}/>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

function BOB2Usuarios({ t }) {
  return (
    <BackofficeShell t={t} active="usuarios" breadcrumb={['Configuración', 'Usuarios']}>
      <BOB2UsuariosBody t={t}/>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB2Usuarios, BOB2UsuariosBody, USUARIOS, RolChip });
