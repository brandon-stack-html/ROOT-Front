// mesero-e4-detalle.jsx — Detalle Mesa 4 con notificación de listo

const RONDA_1 = [
  { nombre:'Bandeja Paisa',    qty:2, precio:32000, estado:'listo', obs:'Sin chicharrón' },
  { nombre:'Limonada Natural', qty:2, precio:9000,  estado:'listo' },
];
const RONDA_2 = [
  { nombre:'Ajiaco Bogotano', qty:1, precio:28000, estado:'preparando' },
  { nombre:'Agua con gas',    qty:1, precio:6000,  estado:'preparando' },
];

function ItemRow({ t, item }) {
  const STATES = {
    listo:      { color:DST.success, icon:'check-circle-2',  label:'Listo' },
    preparando: { color:DST.warning, icon:'flame',           label:'Preparando' },
    enviado:    { color:DST.info,    icon:'send',            label:'Enviado' },
  };
  const s = STATES[item.estado];
  return (
    <div style={{ padding:'10px 0', display:'flex', alignItems:'flex-start', gap:10 }}>
      <div style={{
        width:24, height:24, borderRadius:12,
        background: t === DST.light ? `${s.color}15` : `${s.color}30`,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={s.icon} size={14} color={s.color} strokeWidth={2}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
          <div style={{ fontSize:14, color:t.text, fontWeight:500 }}>
            <span style={{ color:t.muted, fontWeight:600, marginRight:6, fontVariantNumeric:'tabular-nums' }}>×{item.qty}</span>
            {item.nombre}
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums', flexShrink:0 }}>{fmtCOP(item.qty * item.precio)}</div>
        </div>
        {item.obs && <div style={{ fontSize:11, color:t.muted, marginTop:3, fontStyle:'italic' }}>↳ {item.obs}</div>}
      </div>
    </div>
  );
}

function RondaSection({ t, num, hora, items }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{
        fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase',
        padding:'8px 0', display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ flex:'0 0 auto' }}>Ronda {num}</span>
        <span style={{ flex:1, height:1, background:t.border }}/>
        <span style={{ flex:'0 0 auto', fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{hora}</span>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <ItemRow t={t} item={item}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeseroE4Detalle({ t }) {
  const total = 116000;
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
            <div style={{ fontSize:10, color:t.muted, lineHeight:1.2 }}>Salón Principal</div>
          </div>
        }
        right={
          <button style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="user-plus" size={17} color={t.text}/>
          </button>
        }
      />

      {/* Banner verde "Pedido listo" */}
      <div style={{
        margin:'12px 14px 0',
        padding:'12px 14px', borderRadius:11,
        background: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.18)',
        border: `1px solid ${DST.success}55`,
        display:'flex', alignItems:'center', gap:11,
      }}>
        <div className="pos-pulse-ring" style={{
          width:36, height:36, borderRadius:18, background:DST.success,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Icon name="bell-ring" size={18} color="#fff" strokeWidth={2}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color: t === DST.light ? '#065F46' : '#A7F3D0' }}>¡Pedido listo para entregar!</div>
          <div style={{ fontSize:11, color: t === DST.light ? '#047857' : '#6EE7B7', marginTop:1 }}>Ronda 1 · Hace 3 min</div>
        </div>
      </div>

      {/* Info compacta */}
      <div style={{ padding:'12px 18px 6px', display:'flex', alignItems:'center', gap:10, fontSize:11, color:t.muted, flexWrap:'wrap' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
          <Icon name="clock" size={11} color={t.muted}/> Abierta hace 00:45
        </span>
        <span>·</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
          <Icon name="user" size={11} color={t.muted}/> Mesero: Tú
        </span>
      </div>

      {/* Items */}
      <div style={{ flex:1, overflow:'auto', padding:'4px 18px 12px' }}>
        <RondaSection t={t} num={1} hora="18:23" items={RONDA_1}/>
        <RondaSection t={t} num={2} hora="18:41" items={RONDA_2}/>

        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:t.muted, padding:'10px 0 6px', borderTop:`1px solid ${t.border}` }}>
          <span>Subtotal</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(107000)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:t.muted, paddingBottom:6 }}>
          <span>IVA (8%)</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(9000)}</span>
        </div>
      </div>

      {/* Footer sticky */}
      <div style={{ padding:'12px 16px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
          <span style={{ fontSize:11, color:t.muted, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Total</span>
          <span style={{ fontSize:24, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(total)}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.3fr', gap:8 }}>
          <MobileBtn t={t} variant="secondary" icon="plus" height={48} style={{ fontSize:12, fontWeight:500 }}>Agregar</MobileBtn>
          <MobileBtn t={t} variant="secondary" icon="receipt" height={48} style={{ fontSize:12, fontWeight:500 }}>Pre-cuenta</MobileBtn>
          <MobileBtn t={t} variant="success" icon="credit-card" height={48} style={{ fontSize:13, fontWeight:600 }}>Cobrar</MobileBtn>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE4Detalle });
