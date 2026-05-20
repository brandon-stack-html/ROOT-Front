// pos-c1-apertura.jsx — Apertura de turno (modal sobre overlay)

function POSC1AperturaTurno({ t }) {
  const datos = [
    { lbl:'Sucursal',    val:'Sede Norte' },
    { lbl:'Caja',        val:'Caja 1 - Mostrador' },
    { lbl:'Turno',       val:'Turno tarde (12:00 - 20:00)' },
    { lbl:'Responsable', val:'Juan Camilo Restrepo' },
  ];
  const denom = [50000, 20000, 10000, 5000, 2000, 1000];

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background:t.bg, fontFamily:ff,
    }}>
      {/* Background del POS opaco (apenas se ve) */}
      <div style={{ position:'absolute', inset:0, opacity:.4 }}>
        <POSTopbar t={t} screenName="POS"/>
        <div style={{ padding:24, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ height:90, background:t.alt, borderRadius:10, border:`1px solid ${t.border}` }}/>
          ))}
        </div>
      </div>

      {/* Overlay oscuro */}
      <div style={{ position:'absolute', inset:0, background:'rgba(10,10,10,.55)', backdropFilter:'blur(2px)' }}/>

      {/* Modal centrado */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width:480, maxHeight:'92%', overflowY:'auto',
        background:t.bg, borderRadius:14, border:`1px solid ${t.border}`,
        boxShadow:'0 24px 80px rgba(0,0,0,.4), 0 0 0 1px rgba(0,0,0,.05)',
        display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{ padding:'22px 24px 18px', borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <div style={{ width:36, height:36, borderRadius:9, background: t === DST.light ? 'rgba(79,70,229,.1)' : 'rgba(79,70,229,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:t.accent }}>
              <Icon name="calculator" size={18} color={t.accent}/>
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:600, color:t.text, lineHeight:1.2 }}>Abrir turno</div>
              <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>Ingresa el efectivo inicial en la caja antes de comenzar</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'18px 24px 22px' }}>
          {/* Datos del turno */}
          <div style={{ background:t.alt, border:`1px solid ${t.border}`, borderRadius:9, padding:'10px 14px', marginBottom:18 }}>
            {datos.map((d, i) => (
              <div key={d.lbl} style={{
                display:'flex', justifyContent:'space-between', padding:'6px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${t.border}`,
              }}>
                <span style={{ fontSize:12, color:t.muted }}>{d.lbl}</span>
                <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{d.val}</span>
              </div>
            ))}
          </div>

          {/* Input grande */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:13, fontWeight:600, color:t.text, display:'block', marginBottom:8 }}>
              Efectivo inicial en caja
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', fontSize:28, fontWeight:600, color:t.muted }}>$</span>
              <input readOnly value="150.000" style={{
                width:'100%', padding:'14px 16px 14px 40px', fontSize:32, fontWeight:600, fontFamily:ff,
                background:t.bg, border:`1.5px solid ${t.accent}`, borderRadius:10,
                color:t.text, outline:'none', boxSizing:'border-box', fontVariantNumeric:'tabular-nums',
              }}/>
            </div>
            <div style={{ fontSize:11, color:t.muted, marginTop:6 }}>Este valor queda registrado en el arqueo</div>
          </div>

          {/* Toggle calculadora */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:t.alt, borderRadius:8, marginBottom:14 }}>
            <span style={{ fontSize:12, color:t.text, fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
              <Icon name="calculator" size={13} color={t.muted}/> Usar calculadora de denominaciones
            </span>
            <div style={{
              width:32, height:18, borderRadius:9, background:t.accent, position:'relative',
            }}>
              <div style={{ position:'absolute', top:2, right:2, width:14, height:14, borderRadius:7, background:'#fff' }}/>
            </div>
          </div>

          {/* Calculadora — grid 3x2 */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:14 }}>
            {denom.map((v, i) => (
              <div key={v} style={{
                padding:'8px 10px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:7,
                display:'flex', flexDirection:'column', gap:4,
              }}>
                <div style={{ fontSize:10, fontWeight:600, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(v)}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <input readOnly value={i < 2 ? (i === 0 ? '2' : '2') : '1'} style={{
                    width:36, padding:'4px 6px', fontSize:12, fontFamily:ff, textAlign:'center',
                    background:t.alt, border:`1px solid ${t.border}`, borderRadius:5, color:t.text, outline:'none',
                  }}/>
                  <span style={{ fontSize:11, color:t.text, fontWeight:500, marginLeft:'auto', fontVariantNumeric:'tabular-nums' }}>
                    {fmtCOP(v * (i === 0 ? 2 : i === 1 ? 2 : 1))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Observaciones */}
          <label style={{ fontSize:12, fontWeight:500, color:t.text, display:'block', marginBottom:6 }}>Observaciones del turno <span style={{ color:t.muted, fontWeight:400 }}>(opcional)</span></label>
          <textarea readOnly placeholder="Notas para el cierre…" style={{
            width:'100%', minHeight:54, padding:'8px 12px', fontSize:12, fontFamily:ff,
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:7,
            color:t.text, outline:'none', boxSizing:'border-box', resize:'none',
          }}/>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 24px', borderTop:`1px solid ${t.border}`, display:'flex', justifyContent:'flex-end', gap:10 }}>
          <POSBtn t={t} variant="ghost">Cancelar</POSBtn>
          <POSBtn t={t} variant="primary" size="lg" icon="unlock">Abrir caja</POSBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { POSC1AperturaTurno });
