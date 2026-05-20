// pos-c4-cobro.jsx — Modal de cobro

const MEDIOS_PAGO = [
  { id:'efectivo',  l:'Efectivo',     icon:'banknote',         sel:true },
  { id:'debito',    l:'Débito',       icon:'credit-card' },
  { id:'credito',   l:'Crédito',      icon:'credit-card' },
  { id:'transfer',  l:'Transferencia',icon:'smartphone' },
  { id:'cuenta',    l:'Cta. corriente',icon:'book-open' },
  { id:'multiple',  l:'Múltiple',     icon:'shuffle' },
];

function POSC4Cobro({ t }) {
  const subtotal = 113000, iva = 9040, total = 122040;
  const recibido = 150000;
  const propinaPct = 5;
  const propina = Math.round(total * (propinaPct/100));
  const totalCobrado = total + propina;
  const cambio = recibido - totalCobrado;

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', background:t.bg, fontFamily:ff }}>
      {/* Background del POS atenuado */}
      <div style={{ position:'absolute', inset:0, opacity:.3 }}>
        <POSTopbar t={t} screenName="POS"/>
        <div style={{ padding:24, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height:90, background:t.alt, borderRadius:10, border:`1px solid ${t.border}` }}/>)}
        </div>
      </div>
      <div style={{ position:'absolute', inset:0, background:'rgba(10,10,10,.6)', backdropFilter:'blur(2px)' }}/>

      {/* Modal */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width:640, maxHeight:'94%', overflowY:'auto',
        background:t.bg, borderRadius:14, border:`1px solid ${t.border}`,
        boxShadow:'0 24px 80px rgba(0,0,0,.4)',
        display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{ padding:'18px 24px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:3 }}>Cobrar mesa 6</div>
            <div style={{ fontSize:11, color:t.muted }}>Total a pagar</div>
            <div style={{ fontSize:30, fontWeight:700, color:t.accent, fontVariantNumeric:'tabular-nums', lineHeight:1.1, marginTop:2 }}>{fmtCOP(total)}</div>
          </div>
          <button style={{ width:32, height:32, borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', color:t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="x" size={16} color={t.muted}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'18px 24px', display:'flex', flexDirection:'column', gap:18 }}>
          {/* Medio de pago */}
          <div>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Medio de pago</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
              {MEDIOS_PAGO.map(m => (
                <button key={m.id} style={{
                  padding:'12px 10px', borderRadius:9, cursor:'pointer', fontFamily:ff,
                  background: m.sel ? (t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)') : t.alt,
                  border: m.sel ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                  color: m.sel ? t.accent : t.text,
                  display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                  position:'relative',
                }}>
                  {m.sel && <div style={{ position:'absolute', top:6, right:6, width:14, height:14, borderRadius:7, background:t.accent, color:'#fff', fontSize:9, display:'flex', alignItems:'center', justifyContent:'center' }}>✓</div>}
                  <Icon name={m.icon} size={20} color={m.sel ? t.accent : t.muted}/>
                  <span style={{ fontSize:12, fontWeight:500 }}>{m.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sección efectivo */}
          <div style={{ background:t.alt, border:`1px solid ${t.border}`, borderRadius:9, padding:14 }}>
            <label style={{ fontSize:12, fontWeight:500, color:t.text, display:'block', marginBottom:8 }}>Valor recibido</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:22, fontWeight:600, color:t.muted }}>$</span>
              <input readOnly value="150.000" style={{
                width:'100%', padding:'10px 14px 10px 32px', fontSize:24, fontWeight:600, fontFamily:ff,
                background:t.bg, border:`1.5px solid ${t.accent}`, borderRadius:8,
                color:t.text, outline:'none', boxSizing:'border-box', fontVariantNumeric:'tabular-nums',
              }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, padding:'8px 12px', background: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.15)', borderRadius:7 }}>
              <span style={{ fontSize:12, color: t === DST.light ? '#065F46' : DST.success, fontWeight:600 }}>Cambio</span>
              <span style={{ fontSize:18, color: t === DST.light ? '#065F46' : DST.success, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(cambio)}</span>
            </div>

            {/* Quick cash buttons */}
            <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
              {[150000, 130000, 200000, 'Otro'].map((v, i) => (
                <button key={i} style={{
                  padding:'5px 12px', borderRadius:6, fontSize:11, fontFamily:ff, fontWeight:500, cursor:'pointer',
                  background: i === 0 ? t.accent : t.bg,
                  color: i === 0 ? '#fff' : t.text,
                  border: i === 0 ? 'none' : `1px solid ${t.border}`,
                }}>{typeof v === 'number' ? fmtCOP(v) : v}</button>
              ))}
            </div>
          </div>

          {/* Propina */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>Propina</div>
              <Icon name="chevron-up" size={14} color={t.muted}/>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[
                { pct:5,  val:6102, sel:true },
                { pct:10, val:12204 },
                { pct:15, val:18306 },
                { pct:0,  val:0, label:'Otro' },
              ].map(p => (
                <button key={p.pct} style={{
                  padding:'8px 12px', borderRadius:8, cursor:'pointer', fontFamily:ff,
                  background: p.sel ? (t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)') : t.alt,
                  border: p.sel ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                  color: p.sel ? t.accent : t.text,
                  display:'flex', flexDirection:'column', alignItems:'center', minWidth:74,
                }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{p.label || (p.pct + '%')}</span>
                  {!p.label && <span style={{ fontSize:10, color: p.sel ? t.accent : t.muted, marginTop:1, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.val)}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Switch factura */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:t.alt, borderRadius:8 }}>
            <div>
              <div style={{ fontSize:12, color:t.text, fontWeight:500 }}>Generar factura electrónica</div>
              <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>DIAN · NIT o cédula del cliente</div>
            </div>
            <div style={{ width:32, height:18, borderRadius:9, background:t.border, position:'relative' }}>
              <div style={{ position:'absolute', top:2, left:2, width:14, height:14, borderRadius:7, background:'#fff' }}/>
            </div>
          </div>

          {/* Resumen final */}
          <div style={{ background:t.alt, border:`1px solid ${t.border}`, borderRadius:9, padding:14 }}>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Resumen</div>
            {[
              { l:'Subtotal', v:subtotal },
              { l:'IVA', v:iva },
              { l:`Propina (${propinaPct}%)`, v:propina, accent:true },
            ].map(r => (
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', fontSize:12, color: r.accent ? t.accent : t.muted, marginBottom:4 }}>
                <span>{r.l}</span><span style={{ fontVariantNumeric:'tabular-nums', fontWeight: r.accent ? 600 : 400 }}>{fmtCOP(r.v)}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700, color:t.text, paddingTop:8, marginTop:6, borderTop:`1px solid ${t.border}` }}>
              <span>Total cobrado</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(totalCobrado)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:600, color:DST.success, marginTop:4 }}>
              <span>Cambio</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(cambio)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 24px', borderTop:`1px solid ${t.border}`, display:'flex', justifyContent:'flex-end', gap:10 }}>
          <POSBtn t={t} variant="secondary">Cancelar</POSBtn>
          <POSBtn t={t} variant="success" size="lg" icon="check">Confirmar cobro</POSBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { POSC4Cobro });
