// mesero-e6-bottomsheet.jsx — Bottom sheet de configurar producto

function MeseroE6BottomSheet({ t }) {
  return (
    <MobileShell t={t} bg={t.bg}>
      {/* Pantalla de fondo: catálogo atenuado */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        <div style={{ opacity:.32, height:'100%', display:'flex', flexDirection:'column' }}>
          <MobileTopbar t={t}
            left={<div style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}` }}/>}
            center={<div style={{ width:80, height:14, background:t.alt, borderRadius:4 }}/>}
            right={<div style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}` }}/>}
          />
          <div style={{ padding:'12px 12px 10px', display:'flex', gap:6, overflow:'hidden' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height:32, width:90, background:t.alt, borderRadius:9, flexShrink:0 }}/>)}
          </div>
          <div style={{ flex:1, padding:'4px 12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, alignContent:'flex-start' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height:172, background:t.alt, borderRadius:12, border:`1px solid ${t.border}` }}/>)}
          </div>
        </div>

        {/* Overlay oscuro */}
        <div style={{ position:'absolute', inset:0, background:'rgba(10,10,10,.55)', backdropFilter:'blur(2px)' }}/>

        {/* Bottom sheet (75% de la pantalla) */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:'78%', background:t.bg, borderRadius:'18px 18px 0 0',
          boxShadow:'0 -16px 40px rgba(0,0,0,.3)',
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}>
          {/* Handle bar */}
          <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 4px', flexShrink:0 }}>
            <div style={{ width:42, height:4, borderRadius:2, background:t.border }}/>
          </div>

          {/* Foto del producto */}
          <div style={{ height:140, background:'#FECACA', position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="utensils" size={40} color="rgba(0,0,0,.35)"/>
          </div>

          {/* Contenido scrolleable */}
          <div style={{ flex:1, overflow:'auto', padding:'14px 18px 12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Ajiaco Bogotano</div>
                <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Plato fuerte tradicional</div>
              </div>
              <div style={{ fontSize:17, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(28000)}</div>
            </div>

            {/* Cantidad */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Cantidad</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, padding:'10px', background:t.alt, borderRadius:12 }}>
                <button style={{
                  width:42, height:42, borderRadius:21, border:`1px solid ${t.border}`,
                  background:t.bg, color:t.text, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}><Icon name="minus" size={18} color={t.text} strokeWidth={2.4}/></button>
                <span style={{ fontSize:24, fontWeight:700, color:t.text, minWidth:36, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>1</span>
                <button style={{
                  width:42, height:42, borderRadius:21, border:'none',
                  background:t.accent, color:'#fff', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 4px 12px ${t.accent}55`,
                }}><Icon name="plus" size={18} color="#fff" strokeWidth={2.4}/></button>
              </div>
            </div>

            {/* Modificadores */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Personaliza tu pedido</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {[
                  { l:'Extra papa',   delta:'+$2.000', sel:true },
                  { l:'Sin guascas',  delta:null },
                  { l:'Doble pollo',  delta:'+$5.000' },
                  { l:'Extra crema',  delta:null },
                ].map(c => (
                  <button key={c.l} style={{
                    padding:'8px 14px', borderRadius:18, fontSize:12, fontWeight:500, fontFamily:ff, cursor:'pointer',
                    background: c.sel ? t.accent : 'transparent',
                    color: c.sel ? '#fff' : t.text,
                    border: `1px solid ${c.sel ? t.accent : t.border}`,
                    display:'inline-flex', alignItems:'center', gap:5,
                  }}>
                    {c.sel && <Icon name="check" size={11} color="#fff" strokeWidth={3}/>}
                    {c.l}
                    {c.delta && <span style={{ fontSize:10, opacity: c.sel ? 0.85 : 0.6 }}>{c.delta}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Observación */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Observación</div>
              <textarea readOnly placeholder="Alguna indicación especial..." style={{
                width:'100%', minHeight:54, padding:'10px 12px', fontSize:13, fontFamily:ff,
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:10, color:t.text, outline:'none', resize:'none', boxSizing:'border-box',
              }}/>
            </div>

            {/* Total calculado */}
            <div style={{
              padding:'10px 12px', background:t.alt, borderRadius:9,
              fontSize:12, color:t.muted, display:'flex', justifyContent:'space-between',
            }}>
              <span>1 × Ajiaco + Extra papa</span>
              <span style={{ color:t.text, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(30000)}</span>
            </div>
          </div>

          {/* Botón sticky */}
          <div style={{ padding:'10px 18px 14px', borderTop:`1px solid ${t.border}`, background:t.bg, flexShrink:0 }}>
            <MobileBtn t={t} variant="primary" height={56} style={{ fontSize:15 }}>
              Agregar a Mesa 4 — {fmtCOP(30000)}
            </MobileBtn>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE6BottomSheet });
