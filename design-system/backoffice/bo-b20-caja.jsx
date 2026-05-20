// bo-b20-caja.jsx — Estado de caja (turno en curso)

const MOVIMIENTOS_CAJA = [
  { hora:'19:34', tipo:'ingreso', concepto:'Venta Mesa 6',           medio:'Efectivo', monto:122040 },
  { hora:'19:28', tipo:'ingreso', concepto:'Venta Mostrador #88',    medio:'Débito',   monto:45000 },
  { hora:'18:55', tipo:'ingreso', concepto:'Venta Mesa 2',           medio:'Cta. cte.',monto:210000 },
  { hora:'18:30', tipo:'egreso',  concepto:'Pago domicilio',         medio:'Efectivo', monto:15000 },
  { hora:'17:45', tipo:'ingreso', concepto:'Venta Mesa 8',           medio:'Efectivo', monto:88000 },
  { hora:'16:20', tipo:'ingreso', concepto:'Venta Mostrador #87',    medio:'Crédito',  monto:67000 },
  { hora:'15:50', tipo:'egreso',  concepto:'Compra hielo extra',     medio:'Efectivo', monto:30000 },
  { hora:'14:30', tipo:'ingreso', concepto:'Venta Mesa 4',           medio:'Nequi',    monto:134000 },
  { hora:'13:12', tipo:'ingreso', concepto:'Venta Mostrador #85',    medio:'Efectivo', monto:88000 },
];

function MedioPago({ t, medio }) {
  const isLight = t === DST.light;
  const map = {
    'Efectivo':   { bg: isLight ? '#DCFCE7' : 'rgba(16,185,129,.18)', color: isLight ? '#14532D' : '#86EFAC', icon:'banknote' },
    'Débito':     { bg: isLight ? '#DBEAFE' : 'rgba(59,130,246,.18)', color: isLight ? '#1E40AF' : '#93C5FD', icon:'credit-card' },
    'Crédito':    { bg: isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)', color: isLight ? '#3730A3' : '#C7D2FE', icon:'credit-card' },
    'Cta. cte.':  { bg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)', color: isLight ? '#92400E' : '#FDE68A', icon:'clipboard' },
    'Nequi':      { bg: isLight ? '#FCE7F3' : 'rgba(236,72,153,.18)', color: isLight ? '#9D174D' : '#FBCFE8', icon:'smartphone' },
  };
  const m = map[medio] || map['Efectivo'];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'2px 8px', borderRadius:9,
      background:m.bg, color:m.color,
      fontSize:11, fontWeight:600,
    }}>
      <Icon name={m.icon} size={11} color={m.color}/>
      {medio}
    </span>
  );
}

function BOB20Caja({ t }) {
  const isLight = t === DST.light;
  const saldoInicial = 150000;
  const totalIngresos = 1234000;
  const totalEgresos = 45000;
  const saldoTeorico = saldoInicial + totalIngresos - totalEgresos;

  return (
    <BackofficeShell t={t} active="caja" breadcrumb={['Operación', 'Caja', 'Turno en curso']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Estado de caja"
          subtitle="Caja 1 - Mostrador · Sede Norte"
          actions={
            <>
              <BOGhostBtn t={t} icon="printer">Imprimir resumen</BOGhostBtn>
              <BOGhostBtn t={t} icon="download">Exportar PDF</BOGhostBtn>
            </>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:18, alignItems:'flex-start' }}>
          {/* Card estado izq */}
          <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:12, overflow:'hidden' }}>
            {/* Badge estado animado */}
            <div style={{
              padding:'18px 20px',
              background: isLight
                ? 'linear-gradient(135deg, #DCFCE7, #F0FDF4)'
                : 'linear-gradient(135deg, rgba(16,185,129,.18), rgba(16,185,129,.06))',
              borderBottom:`1px solid ${t.border}`,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <span className="caja-pulse" style={{
                  position:'relative', width:14, height:14, borderRadius:7, background:DST.success, flexShrink:0,
                }}/>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color: isLight ? '#14532D' : '#86EFAC', letterSpacing:'.01em' }}>CAJA ABIERTA</div>
                  <div style={{ fontSize:11, color: isLight ? '#166534' : '#86EFAC', opacity:.85, marginTop:2 }}>Turno en curso · 7h 44min</div>
                </div>
              </div>

              {/* Info turno */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { l:'Apertura',   v:'Hoy 12:03',                         icon:'play-circle' },
                  { l:'Cajero',     v:'Juan Camilo Restrepo',              icon:'user' },
                  { l:'Caja',       v:'Caja 1 - Mostrador',                icon:'archive' },
                ].map(d => (
                  <div key={d.l} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Icon name={d.icon} size={13} color={t.muted}/>
                    <span style={{ fontSize:11, color:t.muted, width:64 }}>{d.l}</span>
                    <span style={{ fontSize:12, color:t.text, fontWeight:600, flex:1 }}>{d.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen financiero */}
            <div style={{ padding:'18px 20px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:12 }}>Resumen financiero</div>
              <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:t.muted }}>Saldo inicial</span>
                  <span style={{ fontSize:13, color:t.text, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(saldoInicial)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:DST.success, display:'flex', alignItems:'center', gap:5 }}>
                    <Icon name="arrow-down-right" size={11} color={DST.success}/>
                    Ingresos
                  </span>
                  <span style={{ fontSize:13, color:DST.success, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>+ {fmtCOP(totalIngresos)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:DST.error, display:'flex', alignItems:'center', gap:5 }}>
                    <Icon name="arrow-up-right" size={11} color={DST.error}/>
                    Egresos
                  </span>
                  <span style={{ fontSize:13, color:DST.error, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>− {fmtCOP(totalEgresos)}</span>
                </div>
                <div style={{ height:1, background:t.border, margin:'4px 0' }}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, color:t.text, fontWeight:600 }}>Saldo teórico</span>
                  <span style={{ fontSize:18, color:t.text, fontWeight:700, fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em' }}>{fmtCOP(saldoTeorico)}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div style={{
              padding:'14px 20px', borderTop:`1px solid ${t.border}`,
              display:'flex', flexDirection:'column', gap:8,
            }}>
              <button style={{
                width:'100%', padding:'9px 14px', borderRadius:8,
                background:'transparent', border:`1px solid ${t.border}`,
                color:t.text, cursor:'pointer', fontFamily:ff,
                fontSize:13, fontWeight:500,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              }}>
                <Icon name="plus-circle" size={13} color={DST.success}/>
                Registrar ingreso
              </button>
              <button style={{
                width:'100%', padding:'9px 14px', borderRadius:8,
                background:'transparent', border:`1px solid ${t.border}`,
                color:t.text, cursor:'pointer', fontFamily:ff,
                fontSize:13, fontWeight:500,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              }}>
                <Icon name="minus-circle" size={13} color={DST.error}/>
                Registrar egreso
              </button>
              <button style={{
                width:'100%', padding:'10px 14px', borderRadius:8,
                background:DST.error, border:'none',
                color:'#fff', cursor:'pointer', fontFamily:ff,
                fontSize:13, fontWeight:600,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                marginTop:4,
              }}>
                <Icon name="lock" size={13} color="#fff" strokeWidth={2.4}/>
                Cerrar caja y arquear
              </button>
            </div>
          </div>

          {/* Movimientos der */}
          <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:12, overflow:'hidden' }}>
            {/* Header con tabs */}
            <div style={{
              padding:'12px 18px', borderBottom:`1px solid ${t.border}`,
              display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
            }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginRight:4 }}>Movimientos del turno</div>
              <div style={{ display:'flex', gap:2, padding:3, background:t.alt, borderRadius:7 }}>
                {[
                  { l:'Todos',    n:9, active:true },
                  { l:'Ingresos', n:7 },
                  { l:'Egresos',  n:2 },
                ].map(tab => (
                  <button key={tab.l} style={{
                    padding:'5px 11px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff,
                    background: tab.active ? t.bg : 'transparent',
                    color: tab.active ? t.text : t.muted,
                    fontSize:11, fontWeight: tab.active ? 600 : 500,
                    boxShadow: tab.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                    display:'flex', alignItems:'center', gap:5,
                  }}>
                    {tab.l}
                    <span style={{ fontSize:10, color:t.muted, fontWeight:600 }}>{tab.n}</span>
                  </button>
                ))}
              </div>
              <div style={{ flex:1 }}/>
              <div style={{ position:'relative', width:200 }}>
                <Icon name="search" size={13} color={t.muted} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
                <input readOnly placeholder="Buscar movimiento..." style={{
                  width:'100%', padding:'6px 10px 6px 28px', fontSize:11, fontFamily:ff,
                  background:t.bg, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, outline:'none', boxSizing:'border-box',
                }}/>
              </div>
            </div>

            {/* Tabla */}
            <div>
              <div style={{
                display:'grid',
                gridTemplateColumns:'70px 90px 1.6fr 1fr 1fr',
                padding:'11px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
                fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
              }}>
                <div>Hora</div>
                <div>Tipo</div>
                <div>Concepto</div>
                <div>Medio</div>
                <div style={{ textAlign:'right' }}>Monto</div>
              </div>
              {MOVIMIENTOS_CAJA.map((m, i) => {
                const isIngreso = m.tipo === 'ingreso';
                const tint = isIngreso
                  ? (isLight ? 'rgba(220,252,231,.4)' : 'rgba(16,185,129,.06)')
                  : (isLight ? 'rgba(254,226,226,.4)' : 'rgba(239,68,68,.06)');
                return (
                  <div key={i} style={{
                    display:'grid',
                    gridTemplateColumns:'70px 90px 1.6fr 1fr 1fr',
                    padding:'11px 18px', alignItems:'center',
                    borderBottom: i < MOVIMIENTOS_CAJA.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: tint,
                  }}>
                    <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{m.hora}</div>
                    <div>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap:4,
                        padding:'2px 7px', borderRadius:9,
                        background: isIngreso ? DST.success : DST.error,
                        color:'#fff', fontSize:10, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
                      }}>
                        <Icon name={isIngreso ? 'arrow-down' : 'arrow-up'} size={9} color="#fff" strokeWidth={3}/>
                        {m.tipo}
                      </span>
                    </div>
                    <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{m.concepto}</div>
                    <div><MedioPago t={t} medio={m.medio}/></div>
                    <div style={{
                      textAlign:'right', fontSize:13, fontWeight:600,
                      color: isIngreso ? DST.success : DST.error,
                      fontVariantNumeric:'tabular-nums',
                    }}>
                      {isIngreso ? '+ ' : '− '}{fmtCOP(m.monto)}
                    </div>
                  </div>
                );
              })}

              {/* Totals row */}
              <div style={{
                display:'grid',
                gridTemplateColumns:'70px 90px 1.6fr 1fr 1fr',
                padding:'14px 18px', alignItems:'center',
                background:t.alt, borderTop:`2px solid ${t.border}`,
              }}>
                <div></div>
                <div></div>
                <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>Total del período</div>
                <div style={{ fontSize:11, color:t.muted }}>9 movimientos</div>
                <div style={{
                  textAlign:'right', fontSize:15, fontWeight:700,
                  color:t.text, fontVariantNumeric:'tabular-nums',
                }}>
                  + {fmtCOP(totalIngresos - totalEgresos)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB20Caja, MedioPago });
