// mesero-e1-login.jsx — Login del mesero (split 40/60)

function MeseroE1Login({ t }) {
  return (
    <MobileShell t={t} bg={t.bg}>
      {/* Top 40% — fondo acento */}
      <div style={{
        height:'40%', flexShrink:0,
        background: `linear-gradient(135deg, ${t.accent} 0%, #6366F1 100%)`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:24, gap:14, position:'relative', overflow:'hidden',
      }}>
        {/* Decoración: círculos sutiles */}
        <div style={{ position:'absolute', top:-60, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
        <div style={{ position:'absolute', bottom:-40, left:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>

        <div style={{ display:'flex', alignItems:'center', gap:11, position:'relative' }}>
          <div style={{
            width:46, height:46, borderRadius:11, background:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:t.accent, fontWeight:700, fontSize:20,
          }}>I</div>
          <span style={{ fontSize:24, fontWeight:700, color:'#fff', letterSpacing:'-.02em' }}>Inventario</span>
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.85)', position:'relative', textAlign:'center' }}>
          Toma pedidos al instante
        </div>
      </div>

      {/* Bottom 60% — form */}
      <div style={{ flex:1, padding:'28px 24px 14px', display:'flex', flexDirection:'column', overflow:'auto' }}>
        <div style={{ fontSize:24, fontWeight:700, color:t.text, letterSpacing:'-.02em', marginBottom:6 }}>Bienvenido</div>
        <div style={{ fontSize:13, color:t.muted, marginBottom:24 }}>Inicia sesión para empezar tu turno</div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:500, color:t.text, marginBottom:6 }}>Correo</div>
          <input readOnly value="andrea.gomez@elbuensabor.co" style={{
            width:'100%', padding:'14px 14px', fontSize:14, fontFamily:ff,
            background:t.alt, border:`1px solid ${t.border}`, borderRadius:11,
            color:t.text, outline:'none', boxSizing:'border-box',
          }}/>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:500, color:t.text, marginBottom:6 }}>Contraseña</div>
          <div style={{
            display:'flex', alignItems:'center',
            background:t.alt, border:`1.5px solid ${t.accent}`, borderRadius:11, padding:'0 14px',
            boxShadow:`0 0 0 4px ${t.accent}22`,
          }}>
            <input readOnly type="password" value="••••••••••" style={{
              flex:1, padding:'14px 0', fontSize:14, fontFamily:ff,
              background:'transparent', border:'none', outline:'none', color:t.text,
            }}/>
            <button style={{ background:'transparent', border:'none', padding:'4px', cursor:'pointer', color:t.muted, display:'flex' }}>
              <Icon name="eye" size={18} color={t.muted}/>
            </button>
          </div>
        </div>

        <MobileBtn t={t} variant="primary" iconRight="arrow-right">Iniciar sesión</MobileBtn>

        <div style={{ textAlign:'center', marginTop:16 }}>
          <a style={{ fontSize:13, color:t.accent, fontWeight:500, cursor:'pointer', textDecoration:'none' }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div style={{ flex:1 }}/>

        <ConnStatus t={t} ok={true} version="v1.0.0"/>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE1Login });
