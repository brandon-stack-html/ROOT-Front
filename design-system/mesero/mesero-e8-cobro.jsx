// mesero-e8-cobro.jsx — Cobro rápido móvil

const MEDIOS_M = [
  { id:'efectivo', l:'Efectivo', icon:'banknote',     sel:true },
  { id:'debito',   l:'Débito',   icon:'credit-card' },
  { id:'credito',  l:'Crédito',  icon:'credit-card' },
  { id:'multiple', l:'Múltiple', icon:'shuffle' },
];

function MeseroE8Cobro({ t }) {
  const total = 116000;
  const recibido = 150000;
  const propinaPct = 5;
  const propina = Math.round(total * propinaPct / 100);
  const cambio = recibido - total - propina;

  return (
    <MobileShell t={t}>
      <MobileTopbar t={t}
        left={
          <button style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="arrow-left" size={18} color={t.text}/>
          </button>
        }
        center={
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:600, color:t.text, lineHeight:1.2 }}>Mesa 4</div>
            <div style={{ fontSize:10, color:t.muted, lineHeight:1.2 }}>Cobro</div>
          </div>
        }
        right={<div style={{ width:34 }}/>}
      />

      <div style={{ flex:1, overflow:'auto', padding:'18px 16px 12px' }}>
        {/* Total enorme */}
        <div style={{ textAlign:'center', marginBottom:18 }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:4 }}>Total a cobrar</div>
          <div style={{ fontSize:46, fontWeight:700, color:t.accent, fontVariantNumeric:'tabular-nums', lineHeight:1.05, letterSpacing:'-.02em' }}>{fmtCOP(total)}</div>
          <div style={{ fontSize:11, color:t.muted, marginTop:4 }}>4 items · Mesa 4 · Andrea García</div>
        </div>

        {/* Medios de pago */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Medio de pago</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {MEDIOS_M.map(m => (
              <button key={m.id} style={{
                padding:'14px 10px', borderRadius:11, cursor:'pointer', fontFamily:ff,
                background: m.sel ? (t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)') : t.alt,
                border: m.sel ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                color: m.sel ? t.accent : t.text,
                display:'flex', alignItems:'center', gap:10, position:'relative',
                minHeight:64,
              }}>
                {m.sel && <div style={{ position:'absolute', top:6, right:6, width:14, height:14, borderRadius:7, background:t.accent, color:'#fff', fontSize:9, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✓</div>}
                <Icon name={m.icon} size={20} color={m.sel ? t.accent : t.muted}/>
                <span style={{ fontSize:13, fontWeight:600 }}>{m.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recibido */}
        <div style={{ marginBottom:16, padding:'14px', background:t.alt, borderRadius:11 }}>
          <div style={{ fontSize:12, fontWeight:500, color:t.text, marginBottom:8 }}>Recibido</div>
          <div style={{ position:'relative', marginBottom:10 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:22, fontWeight:600, color:t.muted }}>$</span>
            <input readOnly value="150.000" style={{
              width:'100%', padding:'12px 14px 12px 32px', fontSize:24, fontWeight:600, fontFamily:ff,
              background:t.bg, border:`1.5px solid ${t.accent}`, borderRadius:9, color:t.text, outline:'none', boxSizing:'border-box', fontVariantNumeric:'tabular-nums',
            }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.18)', borderRadius:7 }}>
            <span style={{ fontSize:12, color: t === DST.light ? '#065F46' : DST.success, fontWeight:600 }}>Cambio</span>
            <span style={{ fontSize:18, color: t === DST.light ? '#065F46' : DST.success, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(cambio)}</span>
          </div>
        </div>

        {/* Propina */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8 }}>Propina</div>
          <div style={{ display:'flex', gap:6 }}>
            {[
              { pct:5,  val:5800, sel:true },
              { pct:10, val:11600 },
              { pct:0,  label:'Otro' },
            ].map(p => (
              <button key={p.label || p.pct} style={{
                flex:1, padding:'10px 8px', borderRadius:10, cursor:'pointer', fontFamily:ff,
                background: p.sel ? (t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.18)') : t.alt,
                border: p.sel ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                color: p.sel ? t.accent : t.text,
                display:'flex', flexDirection:'column', alignItems:'center', gap:1,
              }}>
                <span style={{ fontSize:13, fontWeight:700 }}>{p.label || (p.pct + '%')}</span>
                {!p.label && <span style={{ fontSize:10, color: p.sel ? t.accent : t.muted, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.val)}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Switch FE */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:t.alt, borderRadius:10, marginBottom:14 }}>
          <div>
            <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>Factura electrónica</div>
            <div style={{ fontSize:10, color:t.muted, marginTop:1 }}>Solicitar al cliente</div>
          </div>
          <div style={{ width:36, height:20, borderRadius:10, background:t.border, position:'relative', cursor:'pointer' }}>
            <div style={{ position:'absolute', top:2, left:2, width:16, height:16, borderRadius:8, background:'#fff' }}/>
          </div>
        </div>

        {/* Total final destacado */}
        <div style={{
          padding:'12px 14px', borderRadius:11,
          background: t === DST.light ? 'rgba(79,70,229,.06)' : 'rgba(79,70,229,.15)',
          border: `1px solid ${t.accent}33`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <span style={{ fontSize:12, color:t.text, fontWeight:600 }}>Total con propina</span>
          <span style={{ fontSize:20, color:t.accent, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(total + propina)}</span>
        </div>
      </div>

      {/* Footer sticky */}
      <div style={{ padding:'10px 16px 14px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <MobileBtn t={t} variant="success" height={56} icon="check" style={{ fontSize:15 }}>
          Confirmar cobro
        </MobileBtn>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE8Cobro });
