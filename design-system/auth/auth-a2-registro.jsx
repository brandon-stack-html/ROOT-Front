// auth-a2-registro.jsx — Registro de negocio (A2)

function StepperA2({ t, current = 1 }) {
  const steps = [
    { n:1, label:'Datos del negocio' },
    { n:2, label:'Datos del admin' },
    { n:3, label:'Tipo de negocio' },
  ];
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:22, padding:'0 8px' }}>
      {steps.map((s, i) => {
        const isActive = s.n === current;
        const isDone   = s.n < current;
        return (
          <React.Fragment key={s.n}>
            <div style={{ display:'flex', alignItems:'center', gap:9, opacity: !isActive && !isDone ? 0.55 : 1 }}>
              <div style={{
                width:26, height:26, borderRadius:13,
                background: isActive ? t.accent : isDone ? DST.success : t.alt,
                color: isActive || isDone ? '#fff' : t.muted,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:600,
                border: !isActive && !isDone ? `1px solid ${t.border}` : 'none',
                boxShadow: isActive ? `0 0 0 4px ${t.accent}22` : 'none',
              }}>
                {isDone ? <Icon name="check" size={12} color="#fff" strokeWidth={3}/> : s.n}
              </div>
              <span style={{ fontSize:12, fontWeight: isActive ? 600 : 500, color: isActive ? t.text : t.muted, whiteSpace:'nowrap' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex:'0 0 32px', height:1, background:t.border, margin:'0 14px' }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function AuthA2Registro({ t }) {
  return (
    <AuthLayout t={t}>
      <AuthCard t={t} width={520}>
        <AuthLogo t={t}/>

        <StepperA2 t={t} current={1}/>

        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:20, fontWeight:600, color:t.text, letterSpacing:'-.01em', marginBottom:6 }}>
            Cuéntanos sobre tu negocio
          </div>
          <div style={{ fontSize:12, color:t.muted }}>Esta información aparecerá en tus facturas electrónicas</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <AuthLabel t={t} hint="Sin dígito de verificación">NIT</AuthLabel>
            <AuthInput t={t} value="900.123.456" placeholder="123.456.789"/>
          </div>

          <div>
            <AuthLabel t={t}>Razón social</AuthLabel>
            <AuthInput t={t} value="Restaurante El Buen Sabor SAS" placeholder="Nombre legal de tu empresa"/>
          </div>

          <div>
            <AuthLabel t={t}>Nombre comercial</AuthLabel>
            <AuthInput t={t} value="El Buen Sabor" placeholder="¿Cómo te conocen tus clientes?"/>
          </div>

          <div>
            <AuthLabel t={t}>Teléfono</AuthLabel>
            <AuthInput t={t} value="312 456 7890" placeholder="312 345 6789" prefix="+57"/>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', gap:10, marginTop:24, alignItems:'center' }}>
          <a style={{ fontSize:12, color:t.muted, cursor:'pointer', textDecoration:'none' }}>
            Ya tengo cuenta, <span style={{ color:t.accent, fontWeight:500 }}>iniciar sesión</span>
          </a>
          <AuthBtn t={t} variant="primary" size="lg" icon="arrow-right">Continuar</AuthBtn>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

Object.assign(window, { AuthA2Registro });
