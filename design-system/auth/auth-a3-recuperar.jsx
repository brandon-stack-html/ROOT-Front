// auth-a3-recuperar.jsx — Recuperar contraseña (A3)

function AuthA3Recuperar({ t }) {
  return (
    <AuthLayout t={t}>
      <AuthCard t={t} width={380}>
        {/* Icono grande arriba */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
          <div style={{
            width:56, height:56, borderRadius:14,
            background: t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: t.accent,
          }}>
            <Icon name="mail" size={26} color={t.accent} strokeWidth={1.6}/>
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ fontSize:19, fontWeight:600, color:t.text, letterSpacing:'-.01em', marginBottom:8 }}>
            ¿Olvidaste tu contraseña?
          </div>
          <div style={{ fontSize:12, color:t.muted, lineHeight:1.55 }}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <AuthLabel t={t}>Correo electrónico</AuthLabel>
          <AuthInput t={t} value="" placeholder="tu@correo.com"/>
        </div>

        <AuthBtn t={t} variant="primary" size="lg" full icon="send">
          Enviar instrucciones
        </AuthBtn>

        <div style={{ textAlign:'center', marginTop:18 }}>
          <a style={{ fontSize:12, color:t.muted, cursor:'pointer', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
            <Icon name="arrow-left" size={12} color={t.muted}/>
            Volver al inicio de sesión
          </a>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

Object.assign(window, { AuthA3Recuperar });
