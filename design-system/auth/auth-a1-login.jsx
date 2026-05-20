// auth-a1-login.jsx — Login (A1)

function AuthA1Login({ t, mobile = false }) {
  return (
    <AuthLayout t={t} mobile={mobile}>
      <AuthCard t={t} width={400} mobile={mobile}>
        {/* Logo */}
        <AuthLogo t={t}/>

        {/* Título */}
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <div style={{ fontSize:22, fontWeight:600, color:t.text, letterSpacing:'-.01em', marginBottom:6 }}>
            Inicia sesión en tu cuenta
          </div>
          <div style={{ fontSize:13, color:t.muted }}>Bienvenido de vuelta</div>
        </div>

        {/* Email */}
        <div style={{ marginBottom:14 }}>
          <AuthLabel t={t}>Correo electrónico</AuthLabel>
          <AuthInput t={t} value="andrea.gomez@restaurante.com" placeholder="tu@correo.com"/>
        </div>

        {/* Password */}
        <div style={{ marginBottom:14 }}>
          <AuthLabel t={t}>Contraseña</AuthLabel>
          <AuthInput
            t={t}
            type="password"
            value="••••••••••"
            placeholder="••••••••"
            focused={true}
            suffix={
              <button style={{ background:'transparent', border:'none', padding:'4px 4px', cursor:'pointer', color:t.muted, display:'flex' }}>
                <Icon name="eye" size={15} color={t.muted}/>
              </button>
            }
          />
        </div>

        {/* Fila: checkbox + olvidaste */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <AuthCheckbox t={t} checked={true} label="Mantener sesión iniciada"/>
          <a style={{ fontSize:12, color:t.accent, textDecoration:'none', cursor:'pointer', fontWeight:500 }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Botón principal */}
        <AuthBtn t={t} variant="primary" size="lg" full icon="arrow-right">
          Iniciar sesión
        </AuthBtn>

        {/* Divider */}
        <AuthDivider t={t}/>

        {/* Link registro */}
        <div style={{ textAlign:'center', fontSize:12, color:t.muted }}>
          ¿Aún no tienes cuenta?{' '}
          <a style={{ color:t.accent, fontWeight:500, cursor:'pointer', textDecoration:'none' }}>
            Registra tu negocio
          </a>
        </div>
      </AuthCard>

      {/* Footer legal mínimo */}
      {!mobile && (
        <div style={{ textAlign:'center', marginTop:20, fontSize:11, color:t.muted, display:'flex', justifyContent:'center', gap:14 }}>
          <span>© 2026 Inventario</span>
          <span>·</span>
          <a style={{ color:t.muted, textDecoration:'none', cursor:'pointer' }}>Términos</a>
          <span>·</span>
          <a style={{ color:t.muted, textDecoration:'none', cursor:'pointer' }}>Privacidad</a>
          <span>·</span>
          <a style={{ color:t.muted, textDecoration:'none', cursor:'pointer' }}>Soporte</a>
        </div>
      )}
    </AuthLayout>
  );
}

Object.assign(window, { AuthA1Login });
