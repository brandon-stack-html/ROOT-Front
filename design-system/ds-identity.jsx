// ds-identity.jsx — Logotipo e identidad visual de Inventario

// ── Símbolo base ───────────────────────────────────────────────────────────────
function LogoMark({ size = 40, bg = '#4F46E5', barColor = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display:'block', flexShrink:0 }}>
      <rect width="40" height="40" rx="10" fill={bg}/>
      <rect x="9"  y="24" width="6" height="9"  rx="1.8" fill={barColor}/>
      <rect x="17" y="18" width="6" height="15" rx="1.8" fill={barColor} opacity=".72"/>
      <rect x="25" y="11" width="6" height="22" rx="1.8" fill={barColor}/>
    </svg>
  );
}

// ── Wordmark ───────────────────────────────────────────────────────────────────
function Wordmark({ size = 22, color = '#0A0A0A' }) {
  return (
    <span style={{ fontFamily:'Inter, "Helvetica Neue", sans-serif', fontSize:size, fontWeight:700, color, letterSpacing:'-.025em', lineHeight:1 }}>
      inventario
    </span>
  );
}

// ── Variante horizontal ────────────────────────────────────────────────────────
function LogoHorizontal({ markBg, markBar, wordColor, markSize = 38 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:11 }}>
      <LogoMark size={markSize} bg={markBg} barColor={markBar}/>
      <Wordmark size={markSize * 0.55} color={wordColor}/>
    </div>
  );
}

// ── Variante vertical ──────────────────────────────────────────────────────────
function LogoVertical({ markBg, markBar, wordColor, markSize = 44 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <LogoMark size={markSize} bg={markBg} barColor={markBar}/>
      <Wordmark size={markSize * 0.44} color={wordColor}/>
    </div>
  );
}

// ── Panel principal ────────────────────────────────────────────────────────────
function LogoPanel() {
  const ff = 'Inter, "Helvetica Neue", sans-serif';

  const variants = [
    { id:'horizontal', label:'Horizontal', component: (markBg, markBar, wordColor) => <LogoHorizontal markBg={markBg} markBar={markBar} wordColor={wordColor}/> },
    { id:'vertical',   label:'Vertical',   component: (markBg, markBar, wordColor) => <LogoVertical   markBg={markBg} markBar={markBar} wordColor={wordColor}/> },
    { id:'symbol',     label:'Símbolo',    component: (markBg, markBar)            => <LogoMark size={48} bg={markBg} barColor={markBar}/> },
  ];

  const backgrounds = [
    { label:'Fondo claro',   bg:'#FAFAFA', border:'1px solid #E4E4E7', markBg:'#4F46E5', markBar:'#ffffff', wordColor:'#0A0A0A', labelColor:'#71717A' },
    { label:'Fondo oscuro',  bg:'#0A0A0A', border:'none',              markBg:'#4F46E5', markBar:'#ffffff', wordColor:'#FAFAFA', labelColor:'#A1A1AA' },
    { label:'Sobre acento',  bg:'#4F46E5', border:'none',              markBg:'#ffffff', markBar:'#4F46E5', wordColor:'#ffffff', labelColor:'rgba(255,255,255,.6)' },
  ];

  return (
    <div style={{ height:'100%', background:'#F4F4F5', fontFamily:ff, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ padding:'24px 32px 16px', borderBottom:'1px solid #E4E4E7' }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.08em', color:'#71717A', textTransform:'uppercase', marginBottom:6 }}>Identidad visual</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ fontSize:22, fontWeight:700, color:'#0A0A0A', letterSpacing:'-.02em' }}>inventario</span>
          <span style={{ fontSize:12, color:'#71717A' }}>POS SaaS · Colombia</span>
        </div>
      </div>

      {/* Grilla de variantes × fondos */}
      <div style={{ flex:1, padding:'20px 32px', overflow:'hidden' }}>
        {/* Column headers */}
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr 1fr', gap:12, marginBottom:12 }}>
          <div/>
          {variants.map(v => (
            <div key={v.id} style={{ fontSize:10, fontWeight:600, color:'#71717A', textTransform:'uppercase', letterSpacing:'.06em', textAlign:'center' }}>{v.label}</div>
          ))}
        </div>

        {/* Rows */}
        {backgrounds.map(bg => (
          <div key={bg.label} style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr 1fr', gap:12, marginBottom:12 }}>
            {/* Row label */}
            <div style={{ display:'flex', alignItems:'center' }}>
              <span style={{ fontSize:11, color:'#71717A', fontWeight:500 }}>{bg.label}</span>
            </div>
            {/* Variant cells */}
            {variants.map(v => (
              <div key={v.id} style={{ background:bg.bg, border:bg.border, borderRadius:12, height:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {v.id === 'symbol'
                  ? v.component(bg.markBg, bg.markBar)
                  : v.component(bg.markBg, bg.markBar, bg.wordColor)
                }
              </div>
            ))}
          </div>
        ))}

        {/* Color accent strip */}
        <div style={{ marginTop:8, display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:10, fontWeight:600, color:'#71717A', textTransform:'uppercase', letterSpacing:'.06em', marginRight:4 }}>Colores de marca</span>
          {[
            { color:'#4F46E5', name:'Índigo', hex:'#4F46E5' },
            { color:'#4338CA', name:'Índigo oscuro', hex:'#4338CA' },
            { color:'#6366F1', name:'Índigo claro', hex:'#6366F1' },
            { color:'#0A0A0A', name:'Negro', hex:'#0A0A0A' },
            { color:'#FAFAFA', name:'Blanco', hex:'#FAFAFA', border:'1px solid #E4E4E7' },
          ].map(c => (
            <div key={c.hex} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:20, height:20, borderRadius:5, background:c.color, border:c.border||'none', flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:10, fontWeight:500, color:'#0A0A0A', lineHeight:1.2 }}>{c.name}</div>
                <div style={{ fontSize:9, color:'#71717A', fontFamily:'monospace' }}>{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LogoMark, LogoPanel });
