// bo-b16-gastos.jsx — Gastos del mes

const GASTOS = [
  { fecha:'15 nov', proveedor:'Dist. La Cosecha',  cat:'Insumos cocina', desc:'Papa, mazorca, yuca',           monto:340000, venc:'22 nov',   estado:'pendiente' },
  { fecha:'14 nov', proveedor:'Gas Natural SA',    cat:'Servicios',      desc:'Gas noviembre',                  monto:180000, venc:'20 nov',   estado:'pagado' },
  { fecha:'13 nov', proveedor:'Lácteos del Valle', cat:'Insumos cocina', desc:'Crema, queso, leche',            monto:220000, venc:'13 nov',   estado:'vencido' },
  { fecha:'12 nov', proveedor:'Dist. La Cosecha',  cat:'Insumos cocina', desc:'Pollo x10kg',                    monto:150000, venc:'Contado',  estado:'pagado' },
  { fecha:'10 nov', proveedor:'Acueducto Bogotá',  cat:'Servicios',      desc:'Agua octubre',                   monto:95000,  venc:'25 nov',   estado:'pendiente' },
  { fecha:'8 nov',  proveedor:'Codensa',           cat:'Servicios',      desc:'Energía octubre',                monto:285000, venc:'18 nov',   estado:'pagado' },
  { fecha:'5 nov',  proveedor:'Distrihogar',       cat:'Aseo',           desc:'Productos de limpieza',          monto:78000,  venc:'Contado',  estado:'pagado' },
];

function EstadoChip({ t, estado }) {
  const isLight = t === DST.light;
  const map = {
    pagado:    { bg: isLight ? '#DCFCE7' : 'rgba(16,185,129,.18)', color: isLight ? '#14532D' : '#86EFAC', icon:'check',  label:'Pagado' },
    pendiente: { bg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)', color: isLight ? '#92400E' : '#FDE68A', icon:'clock',  label:'Pendiente' },
    vencido:   { bg: isLight ? '#FEE2E2' : 'rgba(239,68,68,.18)',  color: isLight ? '#7F1D1D' : '#FCA5A5', icon:'alert-circle', label:'Vencido' },
  };
  const e = map[estado];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:11,
      fontSize:11, fontWeight:600,
      background: e.bg, color: e.color,
    }}>
      <Icon name={e.icon} size={10} color={e.color} strokeWidth={e.icon === 'check' ? 3 : 2}/>
      {e.label}
    </span>
  );
}

function BOB16Gastos({ t }) {
  const isLight = t === DST.light;

  return (
    <BackofficeShell t={t} active="gastos" breadcrumb={['Gestión', 'Gastos']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Gastos"
          subtitle="Noviembre 2026 · Sede Norte"
          actions={
            <>
              <BOGhostBtn t={t} icon="download">Exportar</BOGhostBtn>
              <BOPrimaryBtn t={t} icon="plus">Registrar gasto</BOPrimaryBtn>
            </>
          }
        />

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:18 }}>
          <KPICard t={t} label="Total del mes"     value={fmtCOP(3420000)} delta="↑ 8% vs octubre" deltaTone="up" icon="receipt"  iconColor={t.accent}/>
          {/* Pendiente */}
          <div style={{
            padding:'16px 18px',
            background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.08)',
            border:`1px solid ${isLight ? '#FDE68A' : 'rgba(245,158,11,.4)'}`,
            borderRadius:11, display:'flex', flexDirection:'column', gap:8,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:11, fontWeight:500, color: isLight ? '#92400E' : '#FDE68A', letterSpacing:'.04em', textTransform:'uppercase' }}>Pendiente de pago</span>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(245,158,11,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="clock" size={15} color={DST.warning}/>
              </div>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color: isLight ? '#78350F' : '#FDE68A', fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em', lineHeight:1.1 }}>{fmtCOP(890000)}</div>
            <div style={{ fontSize:11, color: isLight ? '#92400E' : '#FCD34D', fontWeight:500 }}>5 facturas · próximo vencimiento 18 nov</div>
          </div>
          {/* Vencido */}
          <div style={{
            padding:'16px 18px',
            background: isLight ? '#FEE2E2' : 'rgba(239,68,68,.08)',
            border:`1px solid ${isLight ? '#FECACA' : 'rgba(239,68,68,.4)'}`,
            borderRadius:11, display:'flex', flexDirection:'column', gap:8,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:11, fontWeight:500, color: isLight ? '#7F1D1D' : '#FCA5A5', letterSpacing:'.04em', textTransform:'uppercase' }}>Vencidos</span>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(239,68,68,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name="alert-triangle" size={15} color={DST.error}/>
              </div>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color: isLight ? '#7F1D1D' : '#FCA5A5', fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em', lineHeight:1.1 }}>{fmtCOP(120000)}</div>
            <div style={{ fontSize:11, color:DST.error, fontWeight:500 }}>1 factura · acción inmediata</div>
          </div>
        </div>

        {/* Toolbar */}
        <BOToolbar t={t}
          filters={[
            { label:'Período',   value:'01 nov — 15 nov' },
            { label:'Categoría', value:'Todas' },
            { label:'Proveedor', value:'Todos' },
            { label:'Estado',    value:'Todos' },
          ]}
        />

        {/* Tabla */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'70px 1.3fr 1fr 1.4fr 0.9fr 0.9fr 1fr 50px',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Fecha</div>
            <div>Proveedor</div>
            <div>Categoría</div>
            <div>Descripción</div>
            <div style={{ textAlign:'right' }}>Monto</div>
            <div>Vencimiento</div>
            <div>Estado</div>
            <div></div>
          </div>

          {GASTOS.map((g, i) => {
            const vencido = g.estado === 'vencido';
            return (
              <div key={i} style={{
                display:'grid',
                gridTemplateColumns:'70px 1.3fr 1fr 1.4fr 0.9fr 0.9fr 1fr 50px',
                padding:'13px 18px', alignItems:'center',
                borderBottom: i < GASTOS.length - 1 ? `1px solid ${t.border}` : 'none',
                background: vencido ? (isLight ? 'rgba(254,226,226,.4)' : 'rgba(239,68,68,.06)') : 'transparent',
              }}>
                <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{g.fecha}</div>
                <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{g.proveedor}</div>
                <div style={{ fontSize:12, color:t.muted }}>{g.cat}</div>
                <div style={{ fontSize:12, color:t.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{g.desc}</div>
                <div style={{ textAlign:'right', fontSize:13, color:t.text, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(g.monto)}</div>
                <div style={{ fontSize:12, color: vencido ? DST.error : t.text, fontWeight: vencido ? 600 : 500, fontVariantNumeric:'tabular-nums' }}>{g.venc}</div>
                <div><EstadoChip t={t} estado={g.estado}/></div>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <Icon name="more-horizontal" size={15} color={t.muted}/>
                </div>
              </div>
            );
          })}

          <Pagination t={t} current={1} totalPages={4} label={`Mostrando 1–7 de 28 gastos · Total ${fmtCOP(3420000)}`}/>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB16Gastos, EstadoChip });
