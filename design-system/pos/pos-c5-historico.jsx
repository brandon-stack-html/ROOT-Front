// pos-c5-historico.jsx — Histórico de ventas del turno

const VENTAS = [
  { n:1, hora:'12:15', mesa:'Mesa 3',     cliente:'—',             items:4, total:88000,  pago:'Efectivo', fact:'POS' },
  { n:2, hora:'12:43', mesa:'Mesa 7',     cliente:'Juan Restrepo', items:6, total:134000, pago:'Tarjeta',  fact:'FE ✓' },
  { n:3, hora:'13:10', mesa:'Mostrador',  cliente:'—',             items:2, total:24000,  pago:'Efectivo', fact:'—' },
  { n:4, hora:'13:55', mesa:'Mesa 2',     cliente:'—',             items:8, total:210000, pago:'Múltiple', fact:'—' },
  { n:5, hora:'14:20', mesa:'Mesa 1',     cliente:'—',             items:3, total:67000,  pago:'—',        fact:'—', anulada:true },
];

function POSC5Historico({ t }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:t.bg, fontFamily:ff, overflow:'hidden' }}>
      <POSTopbar t={t} screenName="POS"/>

      <div style={{ flex:1, overflow:'auto', padding:'18px 28px' }}>
        {/* Header con KPIs */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, color:t.muted, display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <button style={{ background:'none', border:'none', color:t.muted, cursor:'pointer', padding:0, display:'flex', alignItems:'center', gap:4, fontFamily:ff, fontSize:11 }}>
              <Icon name="arrow-left" size={11} color={t.muted}/> Volver al mapa
            </button>
            <span>·</span>
            <span>POS</span>
            <Icon name="chevron-right" size={11} color={t.muted}/>
            <span style={{ color:t.text, fontWeight:500 }}>Ventas del turno</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:700, color:t.text, lineHeight:1.2 }}>Turno tarde</div>
              <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>12:03 a 19:47 · Caja 1 · Juan Camilo Restrepo</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <POSBtn t={t} variant="secondary" size="sm" icon="download">Exportar</POSBtn>
              <POSBtn t={t} variant="secondary" size="sm" icon="printer">Imprimir Z</POSBtn>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
            {[
              { l:'Total ventas',   v:fmtCOP(1234000), icon:'dollar-sign', color:DST.success },
              { l:'Transacciones',  v:'18',            icon:'receipt',     color:DST.info },
              { l:'Ticket prom.',   v:fmtCOP(68555),   icon:'trending-up', color:t.accent },
              { l:'Anuladas',       v:'2',             icon:'x-circle',    color:DST.error },
            ].map(k => (
              <div key={k.l} style={{
                padding:'12px 14px', background:t.alt, border:`1px solid ${t.border}`, borderRadius:9,
                display:'flex', alignItems:'center', gap:10,
              }}>
                <div style={{ width:34, height:34, borderRadius:8, background:t.bg, color:k.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name={k.icon} size={16} color={k.color}/>
                </div>
                <div>
                  <div style={{ fontSize:10, color:t.muted, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>{k.l}</div>
                  <div style={{ fontSize:16, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{k.v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, gap:12 }}>
          <div style={{ display:'flex', gap:4, padding:3, background:t.alt, borderRadius:8 }}>
            {[
              { l:'Todas',    n:18, active:true },
              { l:'Cerradas', n:16 },
              { l:'Anuladas', n:2 },
            ].map(tab => (
              <button key={tab.l} style={{
                padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
                background: tab.active ? t.bg : 'transparent',
                color: tab.active ? t.text : t.muted,
                display:'flex', alignItems:'center', gap:6,
                boxShadow: tab.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
              }}>
                {tab.l}
                <span style={{ fontSize:10, opacity:.7, fontVariantNumeric:'tabular-nums' }}>{tab.n}</span>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flex:1, justifyContent:'flex-end' }}>
            <div style={{ position:'relative', width:240 }}>
              <Icon name="search" size={13} color={t.muted} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
              <input readOnly placeholder="Buscar por mesa o cliente" style={{
                width:'100%', padding:'7px 12px 7px 30px', fontSize:12, fontFamily:ff,
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, outline:'none', boxSizing:'border-box',
              }}/>
            </div>
            <button style={{
              padding:'7px 12px', background:t.alt, border:`1px solid ${t.border}`, borderRadius:7,
              fontSize:12, color:t.text, cursor:'pointer', fontFamily:ff,
              display:'flex', alignItems:'center', gap:6,
            }}>
              <Icon name="filter" size={12} color={t.muted}/>
              Medio de pago
              <Icon name="chevron-down" size={11} color={t.muted}/>
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:10, overflow:'hidden' }}>
          {/* Header */}
          <div style={{
            display:'grid', gridTemplateColumns:'40px 70px 1.4fr 1.3fr 60px 1.1fr 1.1fr 80px 60px',
            padding:'10px 16px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:10, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>#</div><div>Hora</div><div>Mesa / Tipo</div><div>Cliente</div>
            <div style={{ textAlign:'center' }}>Items</div>
            <div style={{ textAlign:'right' }}>Total</div>
            <div>Pago</div><div>Factura</div><div/>
          </div>
          {/* Filas */}
          {VENTAS.map((v, i) => (
            <div key={v.n} style={{
              display:'grid', gridTemplateColumns:'40px 70px 1.4fr 1.3fr 60px 1.1fr 1.1fr 80px 60px',
              padding:'12px 16px', alignItems:'center',
              borderBottom: i < VENTAS.length - 1 ? `1px solid ${t.border}` : 'none',
              fontSize:12, color: v.anulada ? t.muted : t.text,
              opacity: v.anulada ? 0.6 : 1,
              cursor:'pointer',
            }}>
              <div style={{ color:t.muted, fontVariantNumeric:'tabular-nums' }}>{v.n}</div>
              <div style={{ fontVariantNumeric:'tabular-nums', color:t.muted }}>{v.hora}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontWeight:500, textDecoration: v.anulada ? 'line-through' : 'none' }}>{v.mesa}</span>
                {v.anulada && (
                  <span style={{ fontSize:9, fontWeight:600, color:DST.error, background: t === DST.light ? '#FEE2E2' : 'rgba(239,68,68,.18)', padding:'2px 6px', borderRadius:4, letterSpacing:'.04em' }}>ANULADA</span>
                )}
              </div>
              <div style={{ color: v.cliente === '—' ? t.muted : t.text }}>{v.cliente}</div>
              <div style={{ textAlign:'center', fontVariantNumeric:'tabular-nums' }}>{v.items}</div>
              <div style={{ textAlign:'right', fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(v.total)}</div>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                {v.pago !== '—' && <Icon name={v.pago === 'Efectivo' ? 'banknote' : v.pago === 'Tarjeta' ? 'credit-card' : 'shuffle'} size={12} color={t.muted}/>}
                <span>{v.pago}</span>
              </div>
              <div>
                {v.fact === 'FE ✓' ? (
                  <span style={{ fontSize:10, fontWeight:600, color:DST.success, background: t === DST.light ? '#D1FAE5' : 'rgba(16,185,129,.18)', padding:'2px 7px', borderRadius:4 }}>FE ✓</span>
                ) : v.fact === 'POS' ? (
                  <span style={{ fontSize:10, fontWeight:600, color:t.muted, background:t.alt, padding:'2px 7px', borderRadius:4 }}>POS</span>
                ) : (
                  <span style={{ color:t.muted }}>—</span>
                )}
              </div>
              <div style={{ textAlign:'right' }}>
                <button style={{ width:24, height:24, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:t.muted, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name="more-horizontal" size={14} color={t.muted}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
          <div style={{ fontSize:11, color:t.muted }}>Mostrando 1–5 de 18 ventas</div>
          <div style={{ display:'flex', gap:4 }}>
            {['<', '1', '2', '3', '4', '>'].map((p, i) => (
              <button key={i} style={{
                width:28, height:28, borderRadius:6, cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
                background: p === '1' ? t.accent : 'transparent',
                color: p === '1' ? '#fff' : t.text,
                border: p === '1' ? 'none' : `1px solid ${t.border}`,
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { POSC5Historico });
