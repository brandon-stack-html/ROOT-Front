// bo-b4-roles.jsx — Roles y permisos

const ROLES_LIST = [
  { id:'admin',     label:'Administrador', desc:'Acceso total',                icon:'shield',     count:1 },
  { id:'encargado', label:'Encargado',     desc:'Acceso operativo ampliado',   icon:'briefcase',  count:2 },
  { id:'cajero',    label:'Cajero',        desc:'Ventas y caja',               icon:'banknote',   count:3 },
  { id:'mesero',    label:'Mesero',        desc:'Atención de mesas',           icon:'utensils',   count:5, active:true },
  { id:'repartidor',label:'Repartidor',    desc:'Gestión de entregas',         icon:'bike',       count:2 },
];

const PERMISOS_MESERO = [
  { group:'VENTAS', items:[
    { label:'Ver ventas propias',    perms:[true,  true,  true,  false, false] },
    { label:'Ver todas las ventas',  perms:[false, false, false, false, false] },
    { label:'Aplicar descuento',     perms:[true,  null,  null,  null,  null] },
    { label:'Cobrar venta',          perms:[true,  null,  null,  null,  null] },
    { label:'Anular venta',          perms:[false, null,  null,  null,  null] },
  ]},
  { group:'CATÁLOGO', items:[
    { label:'Ver productos',         perms:[true,  false, false, false, false] },
  ]},
  { group:'INVENTARIO', items:[
    { label:'Ver stock',             perms:[true,  false, false, false, false] },
  ]},
  { group:'CAJA', items:[
    { label:'Operar caja propia',    perms:[true,  true,  null,  null,  null] },
    { label:'Ver movimientos',       perms:[true,  false, false, false, false] },
  ]},
  { group:'CLIENTES', items:[
    { label:'Ver clientes',          perms:[true,  true,  false, false, false] },
  ]},
  { group:'REPORTES', items:[
    { label:'Ver reportes',          perms:[false, false, false, false, false] },
  ]},
  { group:'CONFIG', items:[
    { label:'Acceso a configuración',perms:[false, false, false, false, false] },
  ]},
];

const PERM_HEADERS = ['Listar', 'Crear', 'Actualizar', 'Eliminar', 'Exportar'];

function PermCell({ t, value }) {
  if (value === null) {
    return <span style={{ color:t.muted, fontSize:13 }}>—</span>;
  }
  if (value === true) {
    return (
      <div style={{
        width:22, height:22, borderRadius:6,
        background:DST.success,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="check" size={13} color="#fff" strokeWidth={3}/>
      </div>
    );
  }
  return (
    <div style={{
      width:22, height:22, borderRadius:6,
      background: t === DST.light ? '#F4F4F5' : '#27272A',
      border:`1px solid ${t.border}`,
    }}/>
  );
}

function RoleCard({ t, rol }) {
  const isActive = rol.active;
  return (
    <button style={{
      width:'100%', padding:'12px 14px',
      background: isActive ? t.bg : 'transparent',
      border: `1px solid ${isActive ? t.accent : t.border}`,
      borderRadius:10, cursor:'pointer', fontFamily:ff, textAlign:'left',
      display:'flex', alignItems:'center', gap:12, marginBottom:8,
      boxShadow: isActive ? `0 0 0 3px ${t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)'}` : 'none',
      position:'relative',
    }}>
      <div style={{
        width:36, height:36, borderRadius:9,
        background: isActive ? t.accent : t.alt,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={rol.icon} size={17} color={isActive ? '#fff' : t.muted} strokeWidth={2}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{rol.label}</span>
          {isActive && <Icon name="check" size={11} color={t.accent} strokeWidth={3}/>}
        </div>
        <div style={{ fontSize:11, color:t.muted, marginTop:2, lineHeight:1.3 }}>{rol.desc}</div>
      </div>
      <div style={{
        padding:'2px 8px', borderRadius:8,
        background: t.alt,
        fontSize:10, fontWeight:600, color:t.muted, fontVariantNumeric:'tabular-nums',
        flexShrink:0,
      }}>{rol.count}</div>
    </button>
  );
}

function BOB4Roles({ t }) {
  return (
    <BackofficeShell t={t} active="roles" breadcrumb={['Configuración', 'Roles']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Roles y permisos</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>5 roles definidos · 13 usuarios asignados</div>
          </div>
        </div>

        {/* Layout 2 columnas */}
        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
          {/* Columna izquierda — lista de roles */}
          <div style={{ width:280, flexShrink:0 }}>
            <div style={{
              fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em',
              textTransform:'uppercase', marginBottom:10, padding:'0 4px',
            }}>Roles del sistema</div>
            {ROLES_LIST.map(r => <RoleCard key={r.id} t={t} rol={r}/>)}
            <button style={{
              width:'100%', padding:'14px',
              background:'transparent', border:`1px dashed ${t.border}`,
              borderRadius:10, cursor:'pointer', fontFamily:ff,
              color:t.muted, fontSize:12, fontWeight:500,
              display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              marginTop:4,
            }}>
              <Icon name="plus" size={13} color={t.muted}/>
              Crear rol personalizado
            </button>
          </div>

          {/* Columna derecha — detalle */}
          <div style={{
            flex:1, background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
            overflow:'hidden',
          }}>
            {/* Header detalle */}
            <div style={{
              padding:'16px 22px', borderBottom:`1px solid ${t.border}`,
              display:'flex', alignItems:'center', gap:14,
            }}>
              <div style={{
                width:38, height:38, borderRadius:9, background:t.accent,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <Icon name="utensils" size={18} color="#fff" strokeWidth={2}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16, fontWeight:700, color:t.text }}>Rol: Mesero</span>
                  <button style={{
                    padding:'3px 8px', borderRadius:6, border:`1px solid ${t.border}`,
                    background:t.bg, cursor:'pointer', fontFamily:ff,
                    fontSize:11, color:t.muted, fontWeight:500,
                    display:'flex', alignItems:'center', gap:4,
                  }}>
                    <Icon name="pencil" size={11} color={t.muted}/>
                    Editar nombre
                  </button>
                </div>
                <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>5 usuarios activos con este rol</div>
              </div>
              <button style={{
                padding:'8px 14px', borderRadius:8, background:t.accent,
                color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
                fontSize:13, fontWeight:600,
                display:'flex', alignItems:'center', gap:6,
              }}>
                <Icon name="save" size={13} color="#fff" strokeWidth={2.2}/>
                Guardar cambios
              </button>
            </div>

            {/* Tabla de permisos */}
            <div>
              {/* Header columnas */}
              <div style={{
                display:'grid',
                gridTemplateColumns:'1.6fr repeat(5, 1fr)',
                padding:'10px 22px', background:t.alt, borderBottom:`1px solid ${t.border}`,
                fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase',
                position:'sticky', top:0,
              }}>
                <div>Permiso</div>
                {PERM_HEADERS.map(h => <div key={h} style={{ textAlign:'center' }}>{h}</div>)}
              </div>

              {/* Filas */}
              {PERMISOS_MESERO.map(grupo => (
                <div key={grupo.group}>
                  <div style={{
                    padding:'10px 22px 6px', fontSize:10, fontWeight:700, color:t.muted,
                    letterSpacing:'.08em', textTransform:'uppercase',
                    background: t === DST.light ? 'rgba(244,244,245,.5)' : 'rgba(24,24,27,.5)',
                  }}>{grupo.group}</div>
                  {grupo.items.map((row, ri) => (
                    <div key={ri} style={{
                      display:'grid',
                      gridTemplateColumns:'1.6fr repeat(5, 1fr)',
                      padding:'10px 22px', alignItems:'center',
                      borderTop:`1px solid ${t.border}`,
                    }}>
                      <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{row.label}</div>
                      {row.perms.map((v, ci) => (
                        <div key={ci} style={{ display:'flex', justifyContent:'center' }}>
                          <PermCell t={t} value={v}/>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB4Roles, ROLES_LIST });
