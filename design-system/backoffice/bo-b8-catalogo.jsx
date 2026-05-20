// bo-b8-catalogo.jsx — Catálogo de productos (backoffice)

const CATEGORIAS_BO = [
  { id:'entradas',  label:'Entradas',       count:12, icon:'salad' },
  { id:'platos',    label:'Platos fuertes', count:18, icon:'utensils-crossed', active:true },
  { id:'bebidas',   label:'Bebidas',        count:24, icon:'glass-water' },
  { id:'postres',   label:'Postres',        count:8,  icon:'cake' },
  { id:'combos',    label:'Combos',         count:6,  icon:'package' },
];

const PRODUCTOS_BO = [
  { id:1, nombre:'Bandeja Paisa',      cat:'Plato fuerte', precio:32000, stock:'high',   color:'#FED7AA' },
  { id:2, nombre:'Ajiaco Bogotano',    cat:'Plato fuerte', precio:28000, stock:'high',   color:'#FECACA', badge:{ l:'Popular', tone:'warning' } },
  { id:3, nombre:'Sancocho de Gallina',cat:'Plato fuerte', precio:25000, stock:'mid',    color:'#FEF3C7' },
  { id:4, nombre:'Lomo al Trapo',      cat:'Plato fuerte', precio:45000, stock:'high',   color:'#FCA5A5', badge:{ l:'Nuevo', tone:'info' } },
  { id:5, nombre:'Pollo a la Plancha', cat:'Plato fuerte', precio:22000, stock:'high',   color:'#D9F99D' },
  { id:6, nombre:'Trucha en Salsa',    cat:'Plato fuerte', precio:38000, stock:'low',    color:'#A5F3FC' },
  { id:7, nombre:'Cazuela de Mariscos',cat:'Plato fuerte', precio:42000, stock:'out',    color:'#BFDBFE', badge:{ l:'Sin stock', tone:'error' } },
  { id:8, nombre:'Mojarra Frita',      cat:'Plato fuerte', precio:35000, stock:'high',   color:'#DDD6FE' },
  { id:9, nombre:'Sobrebarriga',       cat:'Plato fuerte', precio:30000, stock:'mid',    color:'#FBCFE8' },
];

const STOCK_DOT = (s) => ({
  high: { color:DST.success, label:'Stock alto' },
  mid:  { color:DST.warning, label:'Stock medio' },
  low:  { color:DST.warning, label:'Stock bajo' },
  out:  { color:DST.error,   label:'Sin stock' },
})[s];

function ProductBOCard({ t, p }) {
  const dot = STOCK_DOT(p.stock);
  const isOut = p.stock === 'out';
  const badgeTones = {
    info:    { bg: t === DST.light ? '#DBEAFE' : 'rgba(59,130,246,.18)',  color: t === DST.light ? '#1E40AF' : '#93C5FD' },
    warning: { bg: t === DST.light ? '#FEF3C7' : 'rgba(245,158,11,.18)', color: t === DST.light ? '#92400E' : '#FDE68A' },
    error:   { bg: t === DST.light ? '#FEE2E2' : 'rgba(239,68,68,.18)',  color: t === DST.light ? '#991B1B' : '#FCA5A5' },
  };
  return (
    <div style={{
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden',
      opacity: isOut ? 0.7 : 1,
      cursor:'pointer', position:'relative',
      transition:'box-shadow .15s',
    }}>
      <div style={{ height:120, background:p.color, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="utensils" size={32} color="rgba(0,0,0,.3)"/>
        {p.badge && (
          <span style={{
            position:'absolute', top:8, left:8, fontSize:10, fontWeight:700,
            padding:'3px 8px', borderRadius:5, letterSpacing:'.04em',
            background:badgeTones[p.badge.tone].bg, color:badgeTones[p.badge.tone].color,
          }}>{p.badge.l}</span>
        )}
        <button style={{
          position:'absolute', top:8, right:8, width:26, height:26, borderRadius:6, border:'none',
          background:'rgba(255,255,255,.9)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="more-horizontal" size={14} color="#0A0A0A"/>
        </button>
      </div>
      <div style={{ padding:'12px 14px' }}>
        <div style={{ fontSize:10, color:t.muted, fontWeight:500, letterSpacing:'.03em', textTransform:'uppercase', marginBottom:4 }}>{p.cat}</div>
        <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:6, lineHeight:1.3 }}>{p.nombre}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:14, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.precio)}</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10, color:t.muted }}>
            <span style={{ width:7, height:7, borderRadius:4, background:dot.color }}/>
            {dot.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function BOB8Catalogo({ t }) {
  return (
    <BackofficeShell t={t} active="catalogo" breadcrumb={['Gestión', 'Catálogo']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Catálogo</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>68 productos · 5 categorías</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{
              padding:'8px 14px', borderRadius:8, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:13, color:t.text, fontWeight:500,
            }}>
              <Icon name="upload" size={14} color={t.muted}/>
              Importar
            </button>
            <button style={{
              padding:'8px 14px', borderRadius:8, background:t.accent, color:'#fff', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, fontFamily:ff, fontSize:13, fontWeight:600,
            }}>
              <Icon name="plus" size={14} color="#fff" strokeWidth={2.4}/>
              Nuevo producto
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
          <div style={{ position:'relative', width:280 }}>
            <Icon name="search" size={14} color={t.muted} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
            <input readOnly placeholder="Buscar producto..." style={{
              width:'100%', padding:'8px 12px 8px 32px', fontSize:12, fontFamily:ff,
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, outline:'none', boxSizing:'border-box',
            }}/>
          </div>
          {[
            { l:'Categoría', v:'Platos fuertes' },
            { l:'Estado',    v:'Todos' },
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
          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', gap:2, padding:3, background:t.alt, borderRadius:7 }}>
            {[
              { l:'Lista', icon:'list',         active:false },
              { l:'Grid',  icon:'layout-grid',  active:true },
            ].map(v => (
              <button key={v.l} style={{
                padding:'5px 9px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff,
                background: v.active ? t.bg : 'transparent',
                color: v.active ? t.accent : t.muted,
                display:'flex', alignItems:'center', gap:5, fontSize:12,
                boxShadow: v.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
              }}>
                <Icon name={v.icon} size={12} color={v.active ? t.accent : t.muted}/>
              </button>
            ))}
          </div>
        </div>

        {/* Layout: árbol + grid */}
        <div style={{ display:'flex', gap:18 }}>
          {/* Árbol categorías */}
          <div style={{ width:200, flexShrink:0 }}>
            <div style={{ fontSize:10, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:8, padding:'0 8px' }}>Categorías</div>
            {CATEGORIAS_BO.map(c => (
              <button key={c.id} style={{
                width:'100%', padding:'8px 10px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:ff,
                background: c.active ? t.alt : 'transparent',
                color: c.active ? t.text : t.muted,
                display:'flex', alignItems:'center', gap:9, marginBottom:1,
                fontSize:12, fontWeight: c.active ? 600 : 500,
              }}>
                <Icon name={c.icon} size={14} color={c.active ? t.accent : t.muted}/>
                <span style={{ flex:1, textAlign:'left' }}>{c.label}</span>
                <span style={{ fontSize:10, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{c.count}</span>
              </button>
            ))}
            <button style={{
              width:'100%', padding:'8px 10px', borderRadius:7, border:`1px dashed ${t.border}`, cursor:'pointer', fontFamily:ff,
              background:'transparent', color:t.muted, fontSize:12,
              display:'flex', alignItems:'center', gap:7, marginTop:6,
            }}>
              <Icon name="plus" size={12} color={t.muted}/>
              Nueva categoría
            </button>
          </div>

          {/* Grid productos */}
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
            {PRODUCTOS_BO.map(p => <ProductBOCard key={p.id} t={t} p={p}/>)}
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB8Catalogo });
