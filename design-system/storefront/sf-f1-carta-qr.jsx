// sf-f1-carta-qr.jsx — Carta QR home (mobile)

const QR_CATEGORIAS = [
  { id:'entradas', label:'Entradas',       icon:'salad' },
  { id:'platos',   label:'Platos fuertes', icon:'utensils-crossed', active:true },
  { id:'bebidas',  label:'Bebidas',        icon:'glass-water' },
  { id:'postres',  label:'Postres',        icon:'cake' },
  { id:'combos',   label:'Combos',         icon:'package' },
];

const QR_PRODUCTOS = [
  { id:1, nombre:'Bandeja Paisa',       desc:'La clásica colombiana completa',           precio:32000, grad:PRODUCT_GRADIENTS.paisa,    icon:'beef' },
  { id:2, nombre:'Ajiaco Bogotano',     desc:'Sopa tradicional con papa y pollo',        precio:28000, grad:PRODUCT_GRADIENTS.ajiaco,   icon:'soup',     popular:true },
  { id:3, nombre:'Sancocho de Gallina', desc:'Receta de abuela, sabor de hogar',         precio:25000, grad:PRODUCT_GRADIENTS.sancocho, icon:'soup' },
  { id:4, nombre:'Lomo al Trapo',       desc:'Carne envuelta en trapo a las brasas',     precio:45000, grad:PRODUCT_GRADIENTS.lomo,     icon:'beef',     premium:true },
  { id:5, nombre:'Cazuela de Mariscos', desc:'Mar en tu mesa',                           precio:42000, grad:PRODUCT_GRADIENTS.cazuela,  icon:'shell' },
  { id:6, nombre:'Trucha en Salsa',     desc:'Fresca del día, criolla',                  precio:38000, grad:PRODUCT_GRADIENTS.trucha,   icon:'fish' },
];

function QRProductCard({ t, p }) {
  return (
    <div style={{
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:14,
      overflow:'hidden', display:'flex', flexDirection:'column',
      position:'relative',
    }}>
      <FoodPhoto height={104} gradient={p.grad} icon={p.icon} radius={0}
        badge={
          <>
            {p.popular && (
              <span style={{
                position:'absolute', top:8, left:8,
                padding:'3px 8px', borderRadius:9,
                background:'rgba(255,255,255,.95)', color:'#9A3412',
                fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
                display:'inline-flex', alignItems:'center', gap:4,
              }}>
                <Icon name="flame" size={9} color="#9A3412"/>
                Popular
              </span>
            )}
            {p.premium && (
              <span style={{
                position:'absolute', top:8, left:8,
                padding:'3px 8px', borderRadius:9,
                background:'rgba(0,0,0,.7)', color:'#fff',
                fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
              }}>Premium</span>
            )}
          </>
        }
      />
      <div style={{ padding:'10px 11px 12px', display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ fontSize:13, fontWeight:700, color:t.text, lineHeight:1.2 }}>{p.nombre}</div>
        <div style={{
          fontSize:11, color:t.muted, lineHeight:1.4,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>{p.desc}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:2 }}>
          <PriceTag t={t} value={p.precio} accent/>
          <button style={{
            width:30, height:30, borderRadius:15, border:'none',
            background:t.text, color:t.bg, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 2px 6px rgba(0,0,0,.2)',
          }}>
            <Icon name="plus" size={15} color={t.bg} strokeWidth={2.6}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function SFF1CartaQR({ t }) {
  const isLight = t === DST.light;
  return (
    <MobileShell t={t}>
      <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column', background:t.bg }}>
        {/* Banner */}
        <div style={{
          height:200, position:'relative', flexShrink:0,
          background: isLight
            ? 'linear-gradient(135deg, #FB923C 0%, #DC2626 100%)'
            : 'linear-gradient(135deg, #7C2D12 0%, #450A0A 100%)',
          overflow:'hidden',
        }}>
          {/* Patrón culinario sutil */}
          <div style={{
            position:'absolute', inset:0, display:'grid',
            gridTemplateColumns:'repeat(6, 1fr)', gridTemplateRows:'repeat(4, 1fr)',
            opacity:.12,
          }}>
            {Array.from({ length:24 }).map((_, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name={['utensils', 'soup', 'beef', 'fish', 'cake'][i % 5]} size={28} color="#fff"/>
              </div>
            ))}
          </div>

          {/* Badge volver */}
          <button style={{
            position:'absolute', top:14, right:14,
            width:36, height:36, borderRadius:18,
            background:'rgba(0,0,0,.4)', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(8px)',
          }}>
            <Icon name="info" size={16} color="#fff"/>
          </button>

          {/* Overlay info */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            padding:'18px 16px 14px',
            background:'linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 100%)',
            display:'flex', alignItems:'flex-end', gap:12,
          }}>
            <BSLogo size={50} ring/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff', lineHeight:1.2, letterSpacing:'-.01em' }}>El Buen Sabor</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.85)', marginTop:2, display:'flex', alignItems:'center', gap:5 }}>
                <Icon name="map-pin" size={11} color="rgba(255,255,255,.85)"/>
                Cra. 15 #80-32 · Mesa 6
              </div>
              <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:5,
                padding:'3px 9px', borderRadius:11, background:'rgba(255,255,255,.95)',
                fontSize:10, fontWeight:700, color:'#14532D', letterSpacing:'.03em',
              }}>
                <span className="qr-pulse" style={{ width:6, height:6, borderRadius:3, background:DST.success }}/>
                Abierto · Cierra a las 22:00
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div style={{ padding:'14px 16px 0', flexShrink:0 }}>
          <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>
            Hola Mesa 6 👋
          </div>
          <div style={{ fontSize:18, fontWeight:700, color:t.text, lineHeight:1.25, letterSpacing:'-.01em' }}>
            ¿Qué se te antoja hoy?
          </div>
        </div>

        {/* Tabs categorías */}
        <div style={{
          padding:'14px 0 0', flexShrink:0,
          overflowX:'auto', whiteSpace:'nowrap',
        }}>
          <div style={{ display:'inline-flex', gap:8, padding:'0 16px' }}>
            {QR_CATEGORIAS.map(c => {
              const isActive = c.active;
              return (
                <button key={c.id} style={{
                  padding:'8px 14px', borderRadius:18,
                  background: isActive ? t.text : t.alt,
                  color: isActive ? t.bg : t.muted,
                  border:'none', cursor:'pointer', fontFamily:ff,
                  fontSize:12, fontWeight: isActive ? 600 : 500,
                  display:'inline-flex', alignItems:'center', gap:6,
                  flexShrink:0,
                }}>
                  <Icon name={c.icon} size={13} color={isActive ? t.bg : t.muted}/>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section title */}
        <div style={{ padding:'18px 16px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:t.text }}>Platos fuertes</div>
          <div style={{ fontSize:11, color:t.muted }}>18 platos</div>
        </div>

        {/* Grid 2 cols */}
        <div style={{
          padding:'0 16px 100px',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:12,
        }}>
          {QR_PRODUCTOS.map(p => <QRProductCard key={p.id} t={t} p={p}/>)}
        </div>

        {/* Footer sticky carrito */}
        <div style={{
          position:'absolute', bottom:34, left:0, right:0,
          padding:'10px 16px',
        }}>
          <button style={{
            width:'100%', padding:'14px 18px', borderRadius:14,
            background:t.text, color:t.bg, border:'none', cursor:'pointer', fontFamily:ff,
            display:'flex', alignItems:'center', gap:14,
            boxShadow:'0 6px 20px rgba(0,0,0,.18)',
          }}>
            <div style={{
              width:32, height:32, borderRadius:9,
              background:t.bg, color:t.text,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              fontSize:12, fontWeight:700,
            }}>2</div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontSize:13, fontWeight:600, color:t.bg }}>Tu pedido</div>
              <div style={{ fontSize:11, color:t.bg, opacity:.75, marginTop:1 }}>Bandeja Paisa + Limonada</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.bg, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(60000)}</span>
              <Icon name="arrow-right" size={15} color={t.bg} strokeWidth={2.4}/>
            </div>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { SFF1CartaQR, QRProductCard, QR_PRODUCTOS, QR_CATEGORIAS });
