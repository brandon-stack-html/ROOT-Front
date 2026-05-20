// mesero-e5-catalogo.jsx — Catálogo / Agregar productos

const PRODUCTOS_M = [
  { id:1, nombre:'Bandeja Paisa',       precio:32000, color:'#FED7AA', selected:1 },
  { id:2, nombre:'Ajiaco Bogotano',     precio:28000, color:'#FECACA', popular:true, selected:1 },
  { id:3, nombre:'Sancocho',            precio:25000, color:'#FEF3C7' },
  { id:4, nombre:'Lomo al Trapo',       precio:45000, color:'#FCA5A5', selected:1 },
  { id:5, nombre:'Cazuela de Mariscos', precio:42000, color:'#A5F3FC', sinStock:true },
  { id:6, nombre:'Trucha en Salsa',     precio:38000, color:'#D9F99D' },
];

function ProductMobileCard({ t, p }) {
  return (
    <div style={{
      borderRadius:12, overflow:'hidden',
      background:t.bg, border:`1px solid ${t.border}`,
      opacity: p.sinStock ? 0.55 : 1, position:'relative',
      cursor: p.sinStock ? 'not-allowed' : 'pointer',
      display:'flex', flexDirection:'column',
    }}>
      {/* Imagen */}
      <div style={{
        height:96, background:p.color, position:'relative',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name="utensils" size={28} color="rgba(0,0,0,.35)"/>
        {p.popular && (
          <span style={{
            position:'absolute', top:8, left:8, fontSize:9, fontWeight:700, color:'#fff',
            background:DST.error, padding:'3px 7px', borderRadius:5, letterSpacing:'.04em',
            display:'inline-flex', alignItems:'center', gap:3,
          }}>🔥 POPULAR</span>
        )}
        {p.sinStock && (
          <span style={{
            position:'absolute', top:8, left:8, fontSize:9, fontWeight:700, color:'#fff',
            background:'rgba(0,0,0,.65)', padding:'3px 7px', borderRadius:5, letterSpacing:'.04em',
          }}>SIN STOCK</span>
        )}
        {p.selected && (
          <div style={{
            position:'absolute', top:8, right:8, minWidth:22, height:22, borderRadius:11, padding:'0 6px',
            background:t.accent, color:'#fff', fontSize:11, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ff,
          }}>{p.selected}</div>
        )}
      </div>
      <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:6, flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:t.text, lineHeight:1.25, minHeight:32 }}>{p.nombre}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
          <span style={{ fontSize:14, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.precio)}</span>
          <button disabled={p.sinStock} style={{
            width:30, height:30, borderRadius:8, border:'none',
            background: p.sinStock ? t.alt : t.accent, color:'#fff',
            cursor: p.sinStock ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: p.sinStock ? 'none' : `0 4px 10px ${t.accent}40`,
          }}><Icon name="plus" size={16} color="#fff" strokeWidth={2.4}/></button>
        </div>
      </div>
    </div>
  );
}

function MeseroE5Catalogo({ t }) {
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
            <div style={{ fontSize:10, color:t.muted, lineHeight:1.2 }}>Agregar productos</div>
          </div>
        }
        right={
          <button style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="search" size={17} color={t.text}/>
          </button>
        }
      />

      {/* Tabs categorías */}
      <div style={{ padding:'12px 12px 10px', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
        {[
          { l:'Entradas',       active:false },
          { l:'Platos fuertes', active:true },
          { l:'Bebidas',        active:false },
          { l:'Postres',        active:false },
          { l:'Combos',         active:false },
          { l:'Todo',           active:false },
        ].map(c => (
          <button key={c.l} style={{
            padding:'8px 14px', borderRadius:9, border:'none', cursor:'pointer', whiteSpace:'nowrap',
            background: c.active ? t.accent : t.alt,
            color: c.active ? '#fff' : t.text,
            fontFamily:ff, fontSize:12, fontWeight:600, flexShrink:0,
          }}>{c.l}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex:1, padding:'4px 12px 12px', overflow:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {PRODUCTOS_M.map(p => <ProductMobileCard key={p.id} t={p ? t : null} p={p} t={t}/>)}
        </div>
      </div>

      {/* Footer sticky con resumen */}
      <div style={{
        padding:'12px 16px', background:t.bg, borderTop:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:t.muted }}>3 items · Mesa 4</div>
          <div style={{ fontSize:18, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', marginTop:2 }}>{fmtCOP(105000)}</div>
        </div>
        <MobileBtn t={t} variant="primary" iconRight="arrow-right" full={false} height={48} style={{ padding:'0 18px' }}>Ver pedido</MobileBtn>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE5Catalogo });
