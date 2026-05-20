// bo-b10-categorias.jsx — Categorías y modificadores

const CATALOGO_TABS = [
  { id:'categorias',    label:'Categorías',         count:5,  active:true },
  { id:'modificadores', label:'Modificadores',      count:8 },
  { id:'listas',        label:'Listas de precios',  count:3 },
];

const CATEGORIAS_TREE = [
  { id:1, color:'#F97316', nombre:'Entradas',       productos:12, hijos:[
    { id:11, nombre:'Sopas',      productos:4 },
    { id:12, nombre:'Ensaladas',  productos:8 },
  ]},
  { id:2, color:'#3B82F6', nombre:'Platos fuertes', productos:18, hijos:[
    { id:21, nombre:'Carnes',     productos:8 },
    { id:22, nombre:'Aves',       productos:6 },
    { id:23, nombre:'Mariscos',   productos:4 },
  ]},
  { id:3, color:'#10B981', nombre:'Bebidas',        productos:24, hijos:[] },
  { id:4, color:'#8B5CF6', nombre:'Postres',        productos:8,  hijos:[] },
  { id:5, color:'#EC4899', nombre:'Combos',         productos:6,  hijos:[] },
];

function ColorDot({ color, size = 12 }) {
  return <span style={{ width:size, height:size, borderRadius:size/2, background:color, flexShrink:0, display:'inline-block' }}/>;
}

function CatalogoTabs({ t }) {
  return (
    <div style={{
      display:'flex', gap:2, borderBottom:`1px solid ${t.border}`,
      marginBottom:18, fontFamily:ff,
    }}>
      {CATALOGO_TABS.map(tab => {
        const isActive = tab.active;
        return (
          <button key={tab.id} style={{
            padding:'10px 16px', border:'none', background:'transparent', cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight: isActive ? 600 : 500,
            color: isActive ? t.text : t.muted,
            borderBottom:`2px solid ${isActive ? t.accent : 'transparent'}`,
            marginBottom:-1, display:'flex', alignItems:'center', gap:7,
          }}>
            {tab.label}
            <span style={{
              padding:'1px 7px', borderRadius:8,
              background: isActive ? (t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)') : t.alt,
              color: isActive ? t.accent : t.muted,
              fontSize:10, fontWeight:600, fontVariantNumeric:'tabular-nums',
            }}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function BOB10Categorias({ t }) {
  return (
    <BackofficeShell t={t} active="catalogo" breadcrumb={['Gestión', 'Catálogo', 'Categorías']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Catálogo"
          subtitle="Organiza productos en categorías y subcategorías"
          actions={<BOPrimaryBtn t={t} icon="plus">Nueva categoría</BOPrimaryBtn>}
        />

        <CatalogoTabs t={t}/>

        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          {/* Header */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'40px 30px 1.4fr 100px 90px 90px',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
            alignItems:'center',
          }}>
            <div></div>
            <div></div>
            <div>Nombre</div>
            <div style={{ textAlign:'right' }}>Productos</div>
            <div style={{ textAlign:'center' }}>Visible</div>
            <div></div>
          </div>

          {CATEGORIAS_TREE.map((cat, i) => (
            <React.Fragment key={cat.id}>
              {/* Fila padre */}
              <div style={{
                display:'grid',
                gridTemplateColumns:'40px 30px 1.4fr 100px 90px 90px',
                padding:'13px 18px', alignItems:'center',
                borderBottom: cat.hijos.length === 0 && i === CATEGORIAS_TREE.length - 1 ? 'none' : `1px solid ${t.border}`,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', cursor:'grab', color:t.muted }}>
                  <Icon name="grip-vertical" size={14} color={t.muted}/>
                </div>
                <div><ColorDot color={cat.color} size={14}/></div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{cat.nombre}</span>
                  {cat.hijos.length > 0 && (
                    <span style={{
                      fontSize:10, color:t.muted, fontWeight:500,
                      padding:'1px 6px', borderRadius:5, background:t.alt,
                    }}>{cat.hijos.length} subcategorías</span>
                  )}
                </div>
                <div style={{ textAlign:'right', fontSize:13, color:t.text, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{cat.productos}</div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <Switch t={t} on={true}/>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:6 }}>
                  <button style={{ width:28, height:28, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="pencil" size={13} color={t.muted}/>
                  </button>
                  <button style={{ width:28, height:28, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="trash-2" size={13} color={t.muted}/>
                  </button>
                </div>
              </div>

              {/* Hijos */}
              {cat.hijos.map((h, hi) => (
                <div key={h.id} style={{
                  display:'grid',
                  gridTemplateColumns:'40px 30px 1.4fr 100px 90px 90px',
                  padding:'10px 18px', alignItems:'center',
                  background: t === DST.light ? 'rgba(244,244,245,.4)' : 'rgba(24,24,27,.4)',
                  borderBottom:
                    hi === cat.hijos.length - 1 && i === CATEGORIAS_TREE.length - 1
                      ? 'none'
                      : `1px solid ${t.border}`,
                }}>
                  <div></div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', cursor:'grab' }}>
                    <Icon name="grip-vertical" size={12} color={t.muted}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, paddingLeft:18 }}>
                    <Icon name="corner-down-right" size={12} color={t.muted}/>
                    <ColorDot color={cat.color} size={9}/>
                    <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>{h.nombre}</span>
                  </div>
                  <div style={{ textAlign:'right', fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{h.productos}</div>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <Switch t={t} on={true}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'flex-end', gap:6 }}>
                    <button style={{ width:26, height:26, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon name="pencil" size={11} color={t.muted}/>
                    </button>
                    <button style={{ width:26, height:26, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon name="trash-2" size={11} color={t.muted}/>
                    </button>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Hint */}
        <div style={{
          marginTop:14, padding:'10px 14px', borderRadius:8,
          background: t === DST.light ? '#EFF6FF' : 'rgba(59,130,246,.10)',
          border:`1px solid ${t === DST.light ? '#BFDBFE' : 'rgba(59,130,246,.4)'}`,
          display:'flex', alignItems:'center', gap:10, fontFamily:ff,
        }}>
          <Icon name="info" size={14} color={DST.info}/>
          <span style={{ fontSize:12, color: t === DST.light ? '#1E40AF' : '#93C5FD' }}>
            Arrastra los íconos <Icon name="grip-vertical" size={11} color={t === DST.light ? '#1E40AF' : '#93C5FD'} style={{ verticalAlign:'middle' }}/> para reordenar categorías y subcategorías.
          </span>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB10Categorias, CatalogoTabs });
