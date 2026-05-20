// bo-b3-drawer-usuario.jsx — Drawer "Nuevo usuario" sobre B2

function FormLabel({ t, children, helper }) {
  return (
    <div style={{ marginBottom:6 }}>
      <label style={{ fontSize:12, fontWeight:600, color:t.text }}>{children}</label>
      {helper && <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{helper}</div>}
    </div>
  );
}

function FormInput({ t, value, placeholder, password, suffix, prefix }) {
  return (
    <div style={{
      display:'flex', alignItems:'center',
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:8,
      padding:'0 10px', gap:8, height:38,
    }}>
      {prefix}
      <input
        readOnly
        type={password ? 'text' : 'text'}
        value={value || ''}
        placeholder={placeholder}
        style={{
          flex:1, border:'none', outline:'none', background:'transparent',
          fontSize:13, fontFamily: password ? 'monospace' : ff,
          color: value ? t.text : t.muted,
          letterSpacing: password ? '.06em' : 'normal',
        }}
      />
      {suffix}
    </div>
  );
}

function FormSection({ t, title, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{
        fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.08em',
        textTransform:'uppercase', marginBottom:12,
        paddingBottom:6, borderBottom:`1px solid ${t.border}`,
      }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>{children}</div>
    </div>
  );
}

function Switch({ t, on }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      width:34, height:20, borderRadius:10,
      background: on ? t.accent : (t === DST.light ? '#D4D4D8' : '#3F3F46'),
      padding:2, transition:'background .15s', flexShrink:0,
    }}>
      <span style={{
        width:16, height:16, borderRadius:8, background:'#fff',
        transform: on ? 'translateX(14px)' : 'translateX(0)',
        boxShadow:'0 1px 2px rgba(0,0,0,.18)', transition:'transform .15s',
      }}/>
    </span>
  );
}

function Chip({ t, label, removable = true }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 4px 5px 10px',
      background: t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)',
      color: t === DST.light ? '#3730A3' : '#C7D2FE',
      borderRadius:7, fontSize:12, fontWeight:500,
    }}>
      {label}
      {removable && (
        <button style={{
          width:18, height:18, borderRadius:4, border:'none',
          background:'transparent', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="x" size={11} color={t === DST.light ? '#3730A3' : '#C7D2FE'}/>
        </button>
      )}
    </span>
  );
}

function BOB3DrawerUsuario({ t }) {
  const drawerContent = (
    <DrawerOverlay
      t={t}
      title="Nuevo usuario"
      subtitle="Completa los datos para crear el acceso"
      width={480}
      footer={[
        <button key="cancel" style={{
          padding:'9px 16px', borderRadius:8, background:'transparent',
          border:`1px solid ${t.border}`, color:t.text, cursor:'pointer',
          fontFamily:ff, fontSize:13, fontWeight:500,
        }}>Cancelar</button>,
        <button key="save" style={{
          padding:'9px 18px', borderRadius:8, background:t.accent,
          border:'none', color:'#fff', cursor:'pointer',
          fontFamily:ff, fontSize:13, fontWeight:600,
          display:'flex', alignItems:'center', gap:6,
        }}>
          <Icon name="user-plus" size={13} color="#fff" strokeWidth={2.4}/>
          Crear usuario
        </button>,
      ]}
    >
      {/* Datos personales */}
      <FormSection t={t} title="Datos personales">
        <div>
          <FormLabel t={t}>Nombre completo</FormLabel>
          <FormInput t={t} value="Sara Vélez Quintero" placeholder="Nombre y apellido"/>
        </div>
        <div>
          <FormLabel t={t}>Email</FormLabel>
          <FormInput t={t} value="s.velez@buen-sabor.co" placeholder="correo@ejemplo.com"/>
        </div>
        <div>
          <FormLabel t={t}>Contraseña inicial</FormLabel>
          <FormInput
            t={t}
            password
            value="Xk9$mPq2"
            suffix={
              <button style={{
                padding:'4px 8px', borderRadius:5, border:'none',
                background:'transparent', cursor:'pointer',
                color:t.accent, fontSize:11, fontWeight:600, fontFamily:ff,
                display:'flex', alignItems:'center', gap:4,
              }}>
                <Icon name="dices" size={12} color={t.accent}/>
                Generar
              </button>
            }
          />
          <div style={{ fontSize:10, color:t.muted, marginTop:5 }}>Le pediremos cambiarla en su primer ingreso.</div>
        </div>
      </FormSection>

      {/* Rol y acceso */}
      <FormSection t={t} title="Rol y acceso">
        <div>
          <FormLabel t={t}>Rol</FormLabel>
          <FormInput
            t={t}
            value="Mesero"
            suffix={<Icon name="chevron-down" size={12} color={t.muted}/>}
          />
        </div>
        <div>
          <FormLabel t={t}>Sucursales asignadas</FormLabel>
          <div style={{
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:8,
            padding:8, display:'flex', flexWrap:'wrap', gap:6, alignItems:'center',
            minHeight:38,
          }}>
            <Chip t={t} label="Sede Norte"/>
            <Chip t={t} label="Sede Sur"/>
            <span style={{ fontSize:12, color:t.muted, padding:'0 4px' }}>+ Agregar sucursal</span>
          </div>
        </div>
        <div>
          <FormLabel t={t}>Caja asignada</FormLabel>
          <FormInput
            t={t}
            placeholder="Selecciona una caja"
            suffix={<Icon name="chevron-down" size={12} color={t.muted}/>}
          />
        </div>
      </FormSection>

      {/* Opciones adicionales */}
      <FormSection t={t} title="Opciones adicionales">
        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
          <Switch t={t} on={true}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Es mesero</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Aparece en el selector de asignación de mesas.</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
          <Switch t={t} on={false}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Es repartidor</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Recibe pedidos para entregas a domicilio.</div>
          </div>
        </div>
        <div>
          <FormLabel t={t} helper="Protege sus mesas de intervención de otros usuarios.">PIN de autorización de mesa</FormLabel>
          <div style={{ display:'flex', gap:8 }}>
            {['●','●','●','●'].map((d, i) => (
              <div key={i} style={{
                width:42, height:46, borderRadius:8,
                background:t.bg, border:`1px solid ${t.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:18, color:t.text, fontFamily:'monospace',
              }}>{d}</div>
            ))}
          </div>
        </div>
      </FormSection>
    </DrawerOverlay>
  );

  return (
    <BackofficeShell t={t} active="usuarios" breadcrumb={['Configuración', 'Usuarios']} overlay={drawerContent}>
      {/* Reusa la pantalla B2 al fondo */}
      <BOB2UsuariosBody t={t}/>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB3DrawerUsuario, FormLabel, FormInput, FormSection, Switch, Chip });
