// auth-a4-restablecer.jsx — Restablecer contraseña (A4)

function StrengthBar({ t, level = 3 }) {
  // 1=débil, 2=regular, 3=fuerte, 4=muy fuerte
  const labels = { 1:'Débil', 2:'Regular', 3:'Fuerte', 4:'Muy fuerte' };
  const colors = { 1:DST.error, 2:DST.warning, 3:DST.success, 4:DST.success };
  const c = colors[level];
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:'flex', gap:4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex:1, height:4, borderRadius:2,
            background: i <= level ? c : t.alt,
            transition:'background .15s',
          }}/>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11 }}>
        <span style={{ color:t.muted }}>Fuerza de la contraseña</span>
        <span style={{ color:c, fontWeight:600 }}>{labels[level]}</span>
      </div>
    </div>
  );
}

function ReqRow({ t, ok, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color: ok ? t.text : t.muted }}>
      <span style={{
        width:16, height:16, borderRadius:8,
        background: ok ? DST.success : 'transparent',
        border: ok ? 'none' : `1px solid ${t.border}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        {ok && <Icon name="check" size={10} color="#fff" strokeWidth={3}/>}
      </span>
      <span>{label}</span>
    </div>
  );
}

function AuthA4Restablecer({ t }) {
  return (
    <AuthLayout t={t}>
      <AuthCard t={t} width={400}>
        {/* Icono candado abierto */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div style={{
            width:54, height:54, borderRadius:14,
            background: t === DST.light ? 'rgba(16,185,129,.08)' : 'rgba(16,185,129,.18)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: DST.success,
          }}>
            <Icon name="lock-open" size={24} color={DST.success} strokeWidth={1.7}/>
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ fontSize:19, fontWeight:600, color:t.text, letterSpacing:'-.01em', marginBottom:6 }}>
            Crea una nueva contraseña
          </div>
          <div style={{ fontSize:12, color:t.muted }}>
            Debe ser diferente a las últimas 3 contraseñas usadas
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <AuthLabel t={t}>Nueva contraseña</AuthLabel>
          <AuthInput
            t={t}
            type="password"
            value="••••••••••"
            focused={true}
            suffix={
              <button style={{ background:'transparent', border:'none', padding:'4px 4px', cursor:'pointer', color:t.muted, display:'flex' }}>
                <Icon name="eye-off" size={15} color={t.muted}/>
              </button>
            }
          />
          <StrengthBar t={t} level={3}/>
        </div>

        <div style={{ marginBottom:18 }}>
          <AuthLabel t={t}>Confirmar contraseña</AuthLabel>
          <AuthInput
            t={t}
            type="password"
            value="••••••••••"
            suffix={
              <button style={{ background:'transparent', border:'none', padding:'4px 4px', cursor:'pointer', color:t.muted, display:'flex' }}>
                <Icon name="eye" size={15} color={t.muted}/>
              </button>
            }
          />
        </div>

        {/* Requisitos */}
        <div style={{ background:t.alt, borderRadius:9, padding:'12px 14px', marginBottom:18, display:'flex', flexDirection:'column', gap:7 }}>
          <ReqRow t={t} ok={true}  label="Al menos 8 caracteres"/>
          <ReqRow t={t} ok={true}  label="Una letra mayúscula"/>
          <ReqRow t={t} ok={true}  label="Un número"/>
          <ReqRow t={t} ok={false} label="Un carácter especial"/>
        </div>

        <AuthBtn t={t} variant="primary" size="lg" full icon="check">
          Restablecer contraseña
        </AuthBtn>
      </AuthCard>
    </AuthLayout>
  );
}

Object.assign(window, { AuthA4Restablecer });
