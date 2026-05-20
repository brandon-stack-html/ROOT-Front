// bo-b1-dashboard.jsx — Dashboard principal del backoffice

const VENTAS_7D = [
  { l:'Lun', v:820000 },
  { l:'Mar', v:945000 },
  { l:'Mié', v:780000 },
  { l:'Jue', v:1120000 },
  { l:'Vie', v:1380000 },
  { l:'Sáb', v:1620000 },
  { l:'Dom', v:1234000 },
];

const TOP_PRODUCTOS = [
  { rank:1, nombre:'Bandeja Paisa',     unidades:23, total:736000 },
  { rank:2, nombre:'Ajiaco Bogotano',   unidades:18, total:504000 },
  { rank:3, nombre:'Limonada Natural',  unidades:45, total:270000 },
  { rank:4, nombre:'Café Americano',    unidades:31, total:155000 },
  { rank:5, nombre:'Agua con gas',      unidades:28, total:84000 },
];

const CANALES = [
  { l:'Mesa',      v:68, color:'#4F46E5' },
  { l:'Mostrador', v:22, color:'#10B981' },
  { l:'Delivery',  v:8,  color:'#F59E0B' },
  { l:'Online',    v:2,  color:'#3B82F6' },
];

const MINI_MESAS = [
  'ocupada','ocupada','libre',
  'cocina', 'lista',  'ocupada',
  'libre',  'cocina', 'libre',
];

const MESA_COLORS = (t) => {
  const isLight = t === DST.light;
  return {
    libre:   { bg:t.alt, border:`1px solid ${t.border}` },
    ocupada: { bg: isLight ? '#EFF6FF' : 'rgba(59,130,246,.18)', border:`1px solid ${isLight ? '#BFDBFE' : '#1E3A8A'}` },
    cocina:  { bg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)', border:`1px solid ${isLight ? '#FDE68A' : '#78350F'}` },
    lista:   { bg: isLight ? '#D1FAE5' : 'rgba(16,185,129,.18)', border:`1px solid ${DST.success}` },
  };
};

// Alertas críticas para Versión B (solo aparecen si el dashboard se renderiza con `alertas`)
const ALERTAS_DEFAULT = [
  {
    title: '1 remisión lleva 32 días sin facturar',
    detail: 'REM-00023 · $320.000 · Si no la regularizas hoy puede generarte una multa',
    actions: [
      { label: 'Facturarla ahora', primary: true },
      { label: 'Registrar devolución' },
    ],
  },
  {
    title: '1 factura fue rechazada',
    detail: 'Factura al cliente · $210.000 · El número de identidad no es válido',
    actions: [
      { label: 'Ver cómo corregirlo', primary: true },
      { label: 'Cambiar a consumidor final' },
    ],
  },
];

// Estado DIAN card (sustituye al card "Propinas")
function EstadoDIANCard({ t, hayError = false }) {
  const isLight = t === DST.light;
  const tone = hayError
    ? { bg: isLight ? '#FEF2F2' : 'rgba(239,68,68,.10)',  border: isLight ? '#FECACA' : 'rgba(239,68,68,.4)', iconBg: isLight ? '#FEE2E2' : 'rgba(239,68,68,.20)', iconColor: DST.error }
    : { bg: isLight ? '#F0FDF4' : 'rgba(16,185,129,.10)', border: isLight ? '#BBF7D0' : 'rgba(16,185,129,.4)', iconBg: isLight ? '#DCFCE7' : 'rgba(16,185,129,.20)', iconColor: DST.success };

  return (
    <div style={{
      padding:'16px 18px', background:tone.bg, border:`1px solid ${tone.border}`, borderRadius:11,
      display:'flex', flexDirection:'column', gap:8,
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, fontWeight:500, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Estado DIAN</span>
        <div style={{ width:30, height:30, borderRadius:8, background:tone.iconBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name={hayError ? 'alert-circle' : 'shield-check'} size={15} color={tone.iconColor}/>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:18, fontWeight:700, color:t.text, letterSpacing:'-.01em', lineHeight:1.15 }}>
        <Icon name={hayError ? 'x-circle' : 'check-circle'} size={18} color={tone.iconColor} strokeWidth={2.4}/>
        {hayError ? 'Hay errores' : 'Todo enviado'}
      </div>
      {hayError ? (
        <div style={{ fontSize:11, fontWeight:500, color:DST.error, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:6, height:6, borderRadius:3, background:DST.error }}/>
          1 con error · <a style={{ color:DST.error, fontWeight:600, cursor:'pointer' }}>Ver →</a>
        </div>
      ) : (
        <div style={{ fontSize:11, color:t.muted, fontWeight:500 }}>24 enviadas · 0 con error</div>
      )}
    </div>
  );
}

function BOB1Dashboard({ t, alertas }) {
  const colors = MESA_COLORS(t);
  const items = alertas === true ? ALERTAS_DEFAULT : (Array.isArray(alertas) ? alertas : null);
  const hayError = !!items;

  return (
    <BackofficeShell t={t} active="dashboard" breadcrumb={['Dashboard']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Saludo */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Buenos días, Juan Camilo</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>Lunes, 15 de noviembre · Sede Norte</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', gap:4, padding:3, background:t.alt, borderRadius:8 }}>
              {[
                { l:'Hoy',    active:true },
                { l:'Semana', active:false },
                { l:'Mes',    active:false },
              ].map(p => (
                <button key={p.l} style={{
                  padding:'6px 14px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
                  background: p.active ? t.bg : 'transparent',
                  color: p.active ? t.text : t.muted,
                  boxShadow: p.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                }}>{p.l}</button>
              ))}
            </div>
            <button style={{
              padding:'7px 12px', borderRadius:7, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:12, color:t.text,
            }}>
              <Icon name="calendar" size={13} color={t.muted}/>
              15 nov 2026
            </button>
          </div>
        </div>

        {/* Banner de alertas críticas (solo en versión B) */}
        {items && (
          <AlertBanner
            t={t}
            title="Requiere tu atención"
            icon="alert-triangle"
            items={items}
          />
        )}

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:18 }}>
          <KPICard t={t} label="Ventas hoy"      value={fmtCOP(1234000)} delta="↑ 12% vs ayer" deltaTone="up"   icon="dollar-sign" iconColor={DST.success}/>
          <KPICard t={t} label="Transacciones"   value="47"              delta="↑ 8%"          deltaTone="up"   icon="receipt"     iconColor={DST.info}/>
          <KPICard t={t} label="Ticket promedio" value={fmtCOP(26255)}   delta="↓ 3%"          deltaTone="down" icon="trending-up" iconColor={t.accent}/>
          <EstadoDIANCard t={t} hayError={hayError}/>
        </div>

        {/* Fila 2: chart + top productos */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:18 }}>
          {/* Área chart */}
          <div style={{ padding:'18px 20px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Ventas últimos 7 días</div>
                <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Total: <span style={{ color:t.text, fontWeight:600 }}>{fmtCOP(7901000)}</span> · Promedio diario: {fmtCOP(1128714)}</div>
              </div>
              <button style={{
                padding:'5px 10px', borderRadius:6, background:'transparent', border:`1px solid ${t.border}`, cursor:'pointer',
                display:'flex', alignItems:'center', gap:5, fontFamily:ff, fontSize:11, color:t.muted,
              }}>
                <Icon name="download" size={11} color={t.muted}/>
                Exportar
              </button>
            </div>
            <AreaChart t={t} width={680} height={210} data={VENTAS_7D}/>
          </div>

          {/* Top productos */}
          <div style={{ padding:'18px 20px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Top 5 productos hoy</div>
              <a style={{ fontSize:11, color:t.accent, cursor:'pointer', fontWeight:500 }}>Ver todos →</a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {TOP_PRODUCTOS.map(p => (
                <div key={p.rank} style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <div style={{
                    width:24, height:24, borderRadius:12,
                    background: p.rank === 1 ? DST.warning : t.alt,
                    color: p.rank === 1 ? '#fff' : t.muted,
                    fontWeight:700, fontSize:11,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0,
                  }}>{p.rank}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:t.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nombre}</div>
                    <div style={{ fontSize:10, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{p.unidades} unidades</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fila 3: donut + mesas activas */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {/* Donut */}
          <div style={{ padding:'18px 20px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:14 }}>Ventas por canal</div>
            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              <DonutChart t={t} size={170} data={CANALES} label="100%" sublabel={fmtCOP(1234000)}/>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                {CANALES.map(c => (
                  <div key={c.l} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ width:9, height:9, borderRadius:3, background:c.color, flexShrink:0 }}/>
                    <span style={{ flex:1, fontSize:12, color:t.text, fontWeight:500 }}>{c.l}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{c.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mesas activas */}
          <div style={{ padding:'18px 20px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Mesas activas ahora</div>
              <a style={{ fontSize:11, color:t.accent, cursor:'pointer', fontWeight:500 }}>Ir al POS →</a>
            </div>
            <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>8 de 12 mesas activas</div>
            <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridTemplateRows:'repeat(3, 1fr)', gap:8, maxHeight:200 }}>
              {MINI_MESAS.map((est, i) => {
                const c = colors[est];
                return (
                  <div key={i} style={{
                    background:c.bg, border:c.border, borderRadius:8,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums',
                  }}>{i+1}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB1Dashboard, EstadoDIANCard });
