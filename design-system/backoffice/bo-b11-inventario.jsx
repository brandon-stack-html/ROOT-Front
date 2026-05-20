// bo-b11-inventario.jsx — Inventario (backoffice)

const INGREDIENTES = [
  { nombre:'Papa criolla',   cat:'Vegetal',  stock:12.5, unidad:'kg',   stockMin:5,  estado:'ok',   bodega:'Principal'    },
  { nombre:'Pollo entero',   cat:'Proteína', stock:8,    unidad:'unid', stockMin:10, estado:'low',  bodega:'Refrigerador' },
  { nombre:'Guascas',        cat:'Especia',  stock:0.2,  unidad:'kg',   stockMin:0.5,estado:'out',  bodega:'Seco'         },
  { nombre:'Crema de leche', cat:'Lácteo',   stock:6,    unidad:'lt',   stockMin:2,  estado:'ok',   bodega:'Refrigerador' },
  { nombre:'Mazorca',        cat:'Vegetal',  stock:25,   unidad:'unid', stockMin:20, estado:'ok',   bodega:'Principal'    },
  { nombre:'Carne molida',   cat:'Proteína', stock:14,   unidad:'kg',   stockMin:8,  estado:'ok',   bodega:'Refrigerador' },
  { nombre:'Aguacate',       cat:'Vegetal',  stock:3,    unidad:'unid', stockMin:12, estado:'low',  bodega:'Principal'    },
  { nombre:'Arroz blanco',   cat:'Grano',    stock:38,   unidad:'kg',   stockMin:15, estado:'ok',   bodega:'Seco'         },
];

const ESTADO_INV = (e, t) => {
  const isLight = t === DST.light;
  return ({
    ok:  { label:'Disponible', icon:'check-circle-2', color:DST.success, rowBg:'transparent' },
    low: { label:'Stock bajo', icon:'alert-triangle', color:DST.warning, rowBg: isLight ? 'rgba(245,158,11,.05)' : 'rgba(245,158,11,.08)' },
    out: { label:'Sin stock',  icon:'x-circle',       color:DST.error,   rowBg: isLight ? 'rgba(239,68,68,.05)'   : 'rgba(239,68,68,.08)' },
  })[e];
};

function BOB11Inventario({ t }) {
  return (
    <BackofficeShell t={t} active="inventario" breadcrumb={['Gestión', 'Inventario']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Inventario</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>Control de ingredientes y bodegas</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{
              padding:'8px 14px', borderRadius:8, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:13, color:t.text, fontWeight:500,
            }}>
              <Icon name="clipboard-check" size={14} color={t.muted}/>
              Iniciar conteo físico
            </button>
            <button style={{
              padding:'8px 14px', borderRadius:8, background:t.accent, color:'#fff', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:13, fontWeight:600,
            }}>
              <Icon name="plus" size={14} color="#fff" strokeWidth={2.4}/>
              Nuevo ingrediente
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:18 }}>
          <div style={{ padding:'16px 18px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:500, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Total ingredientes</span>
              <Icon name="boxes" size={14} color={t.muted}/>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', lineHeight:1.1 }}>86</div>
          </div>

          <div style={{
            padding:'16px 18px',
            background: t === DST.light ? '#FEF3C7' : 'rgba(245,158,11,.12)',
            border:`1px solid ${DST.warning}55`, borderRadius:11,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:600, color:DST.warning, letterSpacing:'.04em', textTransform:'uppercase' }}>Stock bajo</span>
              <Icon name="alert-triangle" size={14} color={DST.warning}/>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', lineHeight:1.1 }}>5</div>
            <div style={{ fontSize:10, color: t === DST.light ? '#92400E' : '#FDE68A', fontWeight:500, marginTop:3 }}>Requieren atención</div>
          </div>

          <div style={{
            padding:'16px 18px',
            background: t === DST.light ? '#FEE2E2' : 'rgba(239,68,68,.12)',
            border:`1px solid ${DST.error}55`, borderRadius:11,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:600, color:DST.error, letterSpacing:'.04em', textTransform:'uppercase' }}>Sin stock</span>
              <Icon name="x-circle" size={14} color={DST.error}/>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', lineHeight:1.1 }}>2</div>
            <div style={{ fontSize:10, color: t === DST.light ? '#991B1B' : '#FCA5A5', fontWeight:500, marginTop:3 }}>Reabastecer urgente</div>
          </div>

          <div style={{ padding:'16px 18px', background:t.bg, border:`1px solid ${t.border}`, borderRadius:11 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:500, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Valor inventario</span>
              <Icon name="dollar-sign" size={14} color={DST.success}/>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', lineHeight:1.1 }}>{fmtCOP(2340000)}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ position:'relative', width:280 }}>
            <Icon name="search" size={14} color={t.muted} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
            <input readOnly placeholder="Buscar ingrediente..." style={{
              width:'100%', padding:'8px 12px 8px 32px', fontSize:12, fontFamily:ff,
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, outline:'none', boxSizing:'border-box',
            }}/>
          </div>
          {[
            { l:'Categoría', v:'Todas' },
            { l:'Estado',    v:'Todos' },
            { l:'Bodega',    v:'Todas' },
          ].map(f => (
            <button key={f.l} style={{
              padding:'8px 12px', borderRadius:7, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:7, fontFamily:ff, fontSize:12, color:t.text,
            }}>
              <span style={{ color:t.muted }}>{f.l}:</span>
              <span style={{ fontWeight:500 }}>{f.v}</span>
              <Icon name="chevron-down" size={11} color={t.muted}/>
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          <div style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.2fr 1.2fr 1fr 60px',
            padding:'10px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:10, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Nombre</div>
            <div>Categoría</div>
            <div style={{ textAlign:'right' }}>Stock actual</div>
            <div>Stock mín.</div>
            <div>Estado</div>
            <div>Bodega</div>
            <div/>
          </div>
          {INGREDIENTES.map((ing, i) => {
            const e = ESTADO_INV(ing.estado, t);
            return (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.2fr 1.2fr 1fr 60px',
                padding:'12px 18px', alignItems:'center',
                borderBottom: i < INGREDIENTES.length - 1 ? `1px solid ${t.border}` : 'none',
                background: e.rowBg, fontSize:12, color:t.text, cursor:'pointer',
              }}>
                <div style={{ fontWeight:500 }}>{ing.nombre}</div>
                <div style={{ color:t.muted }}>{ing.cat}</div>
                <div style={{ textAlign:'right', fontWeight:600, fontVariantNumeric:'tabular-nums' }}>
                  {ing.stock} <span style={{ fontSize:10, color:t.muted, fontWeight:500 }}>{ing.unidad}</span>
                </div>
                <div style={{ color:t.muted, fontVariantNumeric:'tabular-nums' }}>{ing.stockMin} {ing.unidad}</div>
                <div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600,
                    padding:'3px 8px', borderRadius:5,
                    background: t === DST.light ? `${e.color}18` : `${e.color}30`,
                    color: e.color,
                  }}>
                    <Icon name={e.icon} size={11} color={e.color}/>
                    {e.label}
                  </span>
                </div>
                <div style={{ color:t.muted }}>{ing.bodega}</div>
                <div style={{ textAlign:'right' }}>
                  <button style={{ width:24, height:24, borderRadius:5, border:'none', background:'transparent', cursor:'pointer', color:t.muted, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="more-horizontal" size={14} color={t.muted}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
          <div style={{ fontSize:11, color:t.muted }}>Mostrando 1–8 de 86 ingredientes</div>
          <div style={{ display:'flex', gap:4 }}>
            {['<', '1', '2', '3', '...', '11', '>'].map((p, i) => (
              <button key={i} style={{
                minWidth:28, height:28, padding:'0 8px', borderRadius:6, cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:500,
                background: p === '1' ? t.accent : 'transparent',
                color: p === '1' ? '#fff' : t.text,
                border: p === '1' ? 'none' : `1px solid ${t.border}`,
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB11Inventario });
