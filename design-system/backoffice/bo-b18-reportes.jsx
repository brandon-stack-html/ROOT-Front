// bo-b18-reportes.jsx — Hub central de reportes

const REPORTES_GRUPOS = [
  { grupo:'Ventas', icon:'trending-up', color:'#4F46E5', items:[
    { icon:'calendar',     titulo:'Ventas por período',     desc:'Ingresos diarios, semanales o mensuales',     popular:true },
    { icon:'user',         titulo:'Ventas por mesero',      desc:'Performance individual de tu equipo' },
    { icon:'radio',        titulo:'Ventas por canal',       desc:'Mesa, mostrador, delivery y tienda online' },
    { icon:'flame',        titulo:'Productos más vendidos', desc:'Ranking de productos por cantidad e ingresos', popular:true },
  ]},
  { grupo:'Financiero', icon:'banknote', color:'#10B981', items:[
    { icon:'scale',        titulo:'Balance',                desc:'Ingresos vs gastos por período' },
    { icon:'clipboard-list',titulo:'Estado de resultados',  desc:'Rentabilidad neta del negocio' },
    { icon:'users',        titulo:'Cuentas por cobrar',     desc:'Saldos pendientes de clientes' },
    { icon:'percent',      titulo:'Impuestos y retenciones',desc:'IVA, retefuente, ICA' },
  ]},
  { grupo:'Inventario', icon:'package', color:'#F59E0B', items:[
    { icon:'arrow-left-right', titulo:'Movimientos',        desc:'Entradas y salidas de ingredientes' },
    { icon:'trending-down',titulo:'Mermas y pérdidas',      desc:'Diferencias en conteos físicos' },
    { icon:'history',      titulo:'Historial de costos',    desc:'Variación de precios de proveedores' },
  ]},
  { grupo:'Operación', icon:'activity', color:'#EC4899', items:[
    { icon:'archive',      titulo:'Cuadre de cajas',        desc:'Arqueos y cierres por turno' },
    { icon:'map',          titulo:'Mapa de calor de mesas', desc:'Qué mesas generan más ingresos' },
    { icon:'sparkles',     titulo:'Propinas',               desc:'Total de propinas por período y mesero' },
    { icon:'timer',        titulo:'Tiempos de servicio',    desc:'Tiempo desde orden hasta entrega' },
  ]},
];

function ReporteCard({ t, item, color }) {
  const isLight = t === DST.light;
  return (
    <button style={{
      width:'100%', padding:'16px 18px',
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
      cursor:'pointer', fontFamily:ff, textAlign:'left',
      display:'flex', alignItems:'flex-start', gap:14,
      transition:'border-color .15s, transform .15s',
      position:'relative',
    }}>
      <div style={{
        width:40, height:40, borderRadius:10,
        background: isLight ? `${color}1A` : `${color}33`,
        color: color,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={item.icon} size={19} color={color} strokeWidth={2}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
          <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{item.titulo}</span>
          {item.popular && (
            <span style={{
              padding:'1px 6px', borderRadius:5,
              background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)',
              color: isLight ? '#92400E' : '#FDE68A',
              fontSize:9, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
            }}>Popular</span>
          )}
        </div>
        <div style={{ fontSize:11, color:t.muted, lineHeight:1.4 }}>{item.desc}</div>
        <div style={{ fontSize:11, color:t.accent, fontWeight:600, marginTop:8, display:'flex', alignItems:'center', gap:4 }}>
          Ver reporte
          <Icon name="arrow-right" size={11} color={t.accent} strokeWidth={2.2}/>
        </div>
      </div>
    </button>
  );
}

function BOB18Reportes({ t }) {
  return (
    <BackofficeShell t={t} active="reportes" breadcrumb={['Finanzas', 'Reportes']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Reportes"
          subtitle="Selecciona el reporte que necesitas analizar"
          actions={
            <>
              <BOGhostBtn t={t} icon="bookmark">Mis reportes</BOGhostBtn>
              <BOGhostBtn t={t} icon="clock">Programados</BOGhostBtn>
            </>
          }
        />

        {/* Hint shortcut */}
        <div style={{
          padding:'14px 18px', borderRadius:11, marginBottom:22,
          background: t === DST.light ? 'linear-gradient(90deg, #EEF2FF, #FAFAFA)' : 'linear-gradient(90deg, rgba(99,102,241,.16), transparent)',
          border:`1px solid ${t === DST.light ? '#E0E7FF' : 'rgba(99,102,241,.3)'}`,
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{
            width:42, height:42, borderRadius:10, background:t.accent,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <Icon name="zap" size={20} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text }}>¿Necesitas algo personalizado?</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Crea reportes a medida combinando filtros, agrupaciones y métricas.</div>
          </div>
          <BOPrimaryBtn t={t} icon="sparkles">Reporte personalizado</BOPrimaryBtn>
        </div>

        {/* Grupos */}
        {REPORTES_GRUPOS.map(grupo => (
          <div key={grupo.grupo} style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{
                width:24, height:24, borderRadius:6,
                background: t === DST.light ? `${grupo.color}1A` : `${grupo.color}33`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name={grupo.icon} size={13} color={grupo.color}/>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>
                {grupo.grupo}
              </div>
              <div style={{ flex:1, height:1, background:t.border }}/>
              <span style={{ fontSize:10, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{grupo.items.length} reportes</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
              {grupo.items.map((item, i) => (
                <ReporteCard key={i} t={t} item={item} color={grupo.color}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB18Reportes });
