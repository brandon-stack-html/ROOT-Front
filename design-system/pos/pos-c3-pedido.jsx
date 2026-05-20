// pos-c3-pedido.jsx — Toma de pedido (mesa 6) + modal de modificadores

const PRODUCTOS = [
  { id:1, nombre:'Bandeja Paisa',       precio:32000, color:'#FED7AA' },
  { id:2, nombre:'Ajiaco Bogotano',     precio:28000, color:'#FECACA' },
  { id:3, nombre:'Sancocho de Gallina', precio:25000, color:'#FEF3C7' },
  { id:4, nombre:'Lomo al Trapo',       precio:45000, color:'#FCA5A5', highlight:true },
  { id:5, nombre:'Pollo a la Plancha',  precio:22000, color:'#D9F99D' },
  { id:6, nombre:'Trucha en Salsa',     precio:38000, color:'#A5F3FC', sinStock:true },
];

const ITEMS_COMANDA = [
  { id:1, nombre:'Bandeja Paisa',   qty:2, precio:32000, obs:'Sin chicharrón' },
  { id:2, nombre:'Ajiaco Bogotano', qty:1, precio:28000, mod:'Extra aguacate +$3.000', extra:3000 },
  { id:3, nombre:'Limonada Natural', qty:2, precio:9000 },
];

function ProductCard({ p, t, highlight }) {
  return (
    <div style={{
      background:t.bg, border: highlight ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
      borderRadius:10, overflow:'hidden', position:'relative',
      opacity: p.sinStock ? 0.55 : 1,
      cursor: p.sinStock ? 'not-allowed' : 'pointer',
      display:'flex', flexDirection:'column',
    }}>
      {/* Imagen placeholder */}
      <div style={{
        height:88, background: p.color,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative',
      }}>
        <Icon name="utensils" size={26} color="rgba(0,0,0,.35)"/>
        {p.sinStock && (
          <span style={{
            position:'absolute', top:6, right:6, fontSize:9, fontWeight:600, color:'#fff',
            background:'rgba(0,0,0,.6)', padding:'3px 7px', borderRadius:5, letterSpacing:'.04em',
          }}>SIN STOCK</span>
        )}
      </div>
      <div style={{ padding:'8px 10px', display:'flex', flexDirection:'column', gap:4, flex:1 }}>
        <div style={{ fontSize:12, fontWeight:600, color:t.text, lineHeight:1.25 }}>{p.nombre}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
          <span style={{ fontSize:13, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(p.precio)}</span>
          <button disabled={p.sinStock} style={{
            width:24, height:24, borderRadius:6, border:'none',
            background: p.sinStock ? t.alt : t.accent, color:'#fff', cursor: p.sinStock ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14,
          }}><Icon name="plus" size={13} color="#fff" strokeWidth={2.4}/></button>
        </div>
      </div>
    </div>
  );
}

function POSC3TomaPedido({ t }) {
  const subtotal = ITEMS_COMANDA.reduce((acc, i) => acc + (i.qty * i.precio) + (i.extra || 0), 0);
  const iva = Math.round(subtotal * 0.08);
  const total = subtotal + iva;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:t.bg, fontFamily:ff, overflow:'hidden', position:'relative' }}>
      {/* Topbar simplificado para esta pantalla */}
      <div style={{ height:48, background:t.bg, borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', padding:'0 18px', gap:12, flexShrink:0 }}>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', background:'transparent', border:`1px solid ${t.border}`, borderRadius:7, fontFamily:ff, fontSize:12, color:t.text, cursor:'pointer' }}>
          <Icon name="arrow-left" size={13} color={t.text}/> Volver
        </button>
        <div style={{ fontSize:12, color:t.muted, display:'flex', alignItems:'center', gap:6 }}>
          Mapa de mesas <Icon name="chevron-right" size={11} color={t.muted}/> <span style={{ color:t.text, fontWeight:500 }}>Mesa 6</span>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:11, color:t.muted }}>Mesero: <span style={{ color:t.text, fontWeight:500 }}>Andrea García</span></div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Columna izquierda: catálogo (60%) */}
        <div style={{ flex:'0 0 60%', display:'flex', flexDirection:'column', borderRight:`1px solid ${t.border}`, overflow:'hidden' }}>
          {/* Search */}
          <div style={{ padding:'14px 18px 10px' }}>
            <div style={{ position:'relative' }}>
              <Icon name="search" size={14} color={t.muted} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
              <input readOnly placeholder="Buscar productos..." style={{
                width:'100%', padding:'9px 38px 9px 34px', fontSize:12, fontFamily:ff,
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, outline:'none', boxSizing:'border-box',
              }}/>
              <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', padding:'5px', borderRadius:5, background:t.bg, border:`1px solid ${t.border}` }}>
                <Icon name="scan-line" size={13} color={t.muted}/>
              </div>
            </div>
          </div>

          {/* Tabs categorías */}
          <div style={{ padding:'0 18px 10px', display:'flex', gap:6, overflowX:'auto' }}>
            {[
              { l:'Entradas',       n:14, active:false },
              { l:'Platos fuertes', n:22, active:true },
              { l:'Bebidas',        n:18, active:false },
              { l:'Postres',        n:9,  active:false },
              { l:'Combos',         n:6,  active:false },
            ].map(cat => (
              <button key={cat.l} style={{
                padding:'7px 13px', borderRadius:7, border:'none', cursor:'pointer', whiteSpace:'nowrap',
                background: cat.active ? t.accent : t.alt,
                color: cat.active ? '#fff' : t.text,
                fontFamily:ff, fontSize:12, fontWeight:500,
                display:'flex', alignItems:'center', gap:6,
              }}>
                {cat.l}
                <span style={{ fontSize:10, opacity:.7, fontVariantNumeric:'tabular-nums' }}>{cat.n}</span>
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          <div style={{ flex:1, padding:'0 18px 18px', overflow:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
              {PRODUCTOS.map(p => <ProductCard key={p.id} p={p} t={t} highlight={p.highlight}/>)}
            </div>
          </div>
        </div>

        {/* Columna derecha: comanda (40%) */}
        <div style={{ flex:'0 0 40%', display:'flex', flexDirection:'column', background:t.alt, overflow:'hidden' }}>
          {/* Header mesa */}
          <div style={{ padding:'14px 18px 12px', borderBottom:`1px solid ${t.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:18, fontWeight:700, color:t.text }}>Mesa 6</span>
              <span style={{ fontSize:10, fontWeight:600, color:t.muted, background:t.bg, border:`1px solid ${t.border}`, padding:'2px 8px', borderRadius:10 }}>SALÓN PRINCIPAL</span>
            </div>
            <div style={{ fontSize:11, color:t.muted, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:14, height:14, borderRadius:7, background:'#FCA5A5', color:'#7F1D1D', fontSize:7, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>AG</div>
                Andrea García
              </span>
              <span>·</span>
              <span style={{ display:'flex', alignItems:'center', gap:3 }}><Icon name="clock" size={10} color={t.muted}/> Abierta hace 00:14</span>
            </div>
            <button style={{ marginTop:6, fontSize:11, color:t.accent, background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:ff }}>+ Asignar cliente</button>
          </div>

          {/* Items */}
          <div style={{ flex:1, padding:'10px 18px', overflow:'auto' }}>
            {ITEMS_COMANDA.map((item, i) => (
              <div key={item.id} style={{
                padding:'8px 0', borderBottom: i < ITEMS_COMANDA.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:t.muted, fontVariantNumeric:'tabular-nums', marginTop:1 }}>×{item.qty}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:t.text }}>{item.nombre}</div>
                    {item.obs && <div style={{ fontSize:10, color:t.muted, marginTop:2, fontStyle:'italic' }}>↳ {item.obs}</div>}
                    {item.mod && <div style={{ fontSize:10, color:DST.success, marginTop:2 }}>↳ {item.mod}</div>}
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(item.qty * item.precio + (item.extra || 0))}</div>
                  <button style={{ width:20, height:20, borderRadius:5, border:'none', background:'transparent', cursor:'pointer', color:t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="x" size={12} color={t.muted}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div style={{ padding:'12px 18px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:t.muted, marginBottom:4 }}>
              <span>Subtotal</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(subtotal)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:t.muted, marginBottom:6 }}>
              <span>IVA (8%)</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(iva)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, color:t.text, paddingTop:6, borderTop:`1px solid ${t.border}` }}>
              <span>Total</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{fmtCOP(total)}</span>
            </div>
          </div>

          {/* Footer botones */}
          <div style={{ padding:'12px 18px', borderTop:`1px solid ${t.border}`, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, background:t.bg }}>
            <POSBtn t={t} variant="primary" size="md" icon="chef-hat">Cocina</POSBtn>
            <POSBtn t={t} variant="secondary" size="md" icon="receipt">Pre-cuenta</POSBtn>
            <POSBtn t={t} variant="success" size="md" icon="credit-card">Cobrar</POSBtn>
          </div>
        </div>
      </div>

      {/* Modal de modificadores (Lomo al Trapo) */}
      <div style={{ position:'absolute', inset:0, background:'rgba(10,10,10,.55)', backdropFilter:'blur(2px)' }}/>
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width:420, background:t.bg, borderRadius:14, border:`1px solid ${t.border}`,
        boxShadow:'0 24px 80px rgba(0,0,0,.4)', display:'flex', flexDirection:'column', overflow:'hidden',
      }}>
        {/* Foto producto */}
        <div style={{ height:120, background:'#FCA5A5', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <Icon name="utensils" size={36} color="rgba(0,0,0,.35)"/>
          <button style={{
            position:'absolute', top:10, right:10, width:28, height:28, borderRadius:14, border:'none',
            background:'rgba(255,255,255,.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          }}><Icon name="x" size={14} color="#0A0A0A"/></button>
        </div>

        <div style={{ padding:'16px 20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:t.text }}>Lomo al Trapo</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Plato fuerte · 350g</div>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(45000)}</div>
          </div>

          {/* Cantidad */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:t.alt, borderRadius:8, marginBottom:14 }}>
            <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>Cantidad</span>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button style={{ width:26, height:26, borderRadius:6, border:`1px solid ${t.border}`, background:t.bg, color:t.text, cursor:'pointer', fontSize:14, fontWeight:600 }}>−</button>
              <span style={{ fontSize:14, fontWeight:600, color:t.text, minWidth:18, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>1</span>
              <button style={{ width:26, height:26, borderRadius:6, border:'none', background:t.accent, color:'#fff', cursor:'pointer', fontSize:14, fontWeight:600 }}>+</button>
            </div>
          </div>

          {/* Modificadores */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:6 }}>Término</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[
                { l:'3/4', sel:true },
                { l:'Bien cocido' },
                { l:'A punto' },
              ].map(c => (
                <button key={c.l} style={{
                  padding:'5px 12px', borderRadius:14, fontSize:11, fontWeight:500, fontFamily:ff, cursor:'pointer',
                  background: c.sel ? t.accent : 'transparent',
                  color: c.sel ? '#fff' : t.text,
                  border: `1px solid ${c.sel ? t.accent : t.border}`,
                }}>{c.sel ? '✓ ' : ''}{c.l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:6 }}>Acompañamiento</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[
                { l:'Papa criolla', sel:true },
                { l:'Yuca' },
                { l:'Ensalada' },
              ].map(c => (
                <button key={c.l} style={{
                  padding:'5px 12px', borderRadius:14, fontSize:11, fontWeight:500, fontFamily:ff, cursor:'pointer',
                  background: c.sel ? t.accent : 'transparent',
                  color: c.sel ? '#fff' : t.text,
                  border: `1px solid ${c.sel ? t.accent : t.border}`,
                }}>{c.sel ? '✓ ' : ''}{c.l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:6 }}>Observación</div>
            <textarea readOnly placeholder="Ej: sin sal, término extra…" style={{
              width:'100%', minHeight:42, padding:'8px 10px', fontSize:12, fontFamily:ff,
              background:t.alt, border:`1px solid ${t.border}`, borderRadius:7, color:t.text, outline:'none', resize:'none', boxSizing:'border-box',
            }}/>
          </div>

          {/* Total + botones */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0 14px', borderTop:`1px solid ${t.border}` }}>
            <span style={{ fontSize:12, color:t.muted }}>Total</span>
            <span style={{ fontSize:18, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(45000)}</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <POSBtn t={t} variant="secondary" size="md" full>Cancelar</POSBtn>
            <POSBtn t={t} variant="primary" size="md" full icon="arrow-right">Agregar a la mesa</POSBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { POSC3TomaPedido });
