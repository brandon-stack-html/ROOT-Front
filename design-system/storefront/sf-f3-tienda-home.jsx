// sf-f3-tienda-home.jsx — Tienda online home (desktop)

const SF_CATEGORIAS_DESTACADAS = [
  { id:'entradas', label:'Entradas',       icon:'salad',          color:'#10B981', count:12 },
  { id:'platos',   label:'Platos fuertes', icon:'utensils-crossed',color:'#F59E0B', count:18 },
  { id:'bebidas',  label:'Bebidas',        icon:'glass-water',    color:'#3B82F6', count:24 },
  { id:'postres',  label:'Postres',        icon:'cake',           color:'#EC4899', count:8 },
  { id:'combos',   label:'Combos',         icon:'package',        color:'#8B5CF6', count:6 },
];

const LO_MAS_PEDIDO = [
  { id:1, nombre:'Bandeja Paisa',     desc:'La clásica colombiana completa',     precio:32000, grad:PRODUCT_GRADIENTS.paisa,    icon:'beef',     popular:true },
  { id:2, nombre:'Ajiaco Bogotano',   desc:'Sopa tradicional con papa y pollo',  precio:28000, grad:PRODUCT_GRADIENTS.ajiaco,   icon:'soup' },
  { id:3, nombre:'Trucha en Salsa',   desc:'Fresca del día, criolla',            precio:38000, grad:PRODUCT_GRADIENTS.trucha,   icon:'fish' },
  { id:4, nombre:'Limonada Natural',  desc:'Hierbabuena, jengibre o tradicional',precio:9000,  grad:PRODUCT_GRADIENTS.limonada, icon:'glass-water' },
];

function SFProductCard({ t, p, large = false }) {
  const isLight = t === DST.light;
  return (
    <div style={{
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:13,
      overflow:'hidden', position:'relative', cursor:'pointer',
      transition:'transform .15s, box-shadow .15s',
      display:'flex', flexDirection:'column',
    }}>
      <FoodPhoto height={large ? 200 : 170} gradient={p.grad} icon={p.icon} radius={0}
        badge={p.popular ? (
          <span style={{
            position:'absolute', top:10, left:10,
            padding:'4px 9px', borderRadius:9,
            background:'rgba(255,255,255,.95)', color:'#9A3412',
            fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
            display:'inline-flex', alignItems:'center', gap:4,
          }}>
            <Icon name="flame" size={10} color="#9A3412"/>
            Más pedido
          </span>
        ) : null}
      />
      <div style={{ padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:3, lineHeight:1.3 }}>{p.nombre}</div>
          <div style={{ fontSize:12, color:t.muted, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</div>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <PriceTag t={t} value={p.precio} accent/>
          <button style={{
            padding:'7px 12px', borderRadius:8,
            background:t.text, color:t.bg, border:'none', cursor:'pointer', fontFamily:ff,
            fontSize:11, fontWeight:600,
            display:'flex', alignItems:'center', gap:5,
          }}>
            <Icon name="plus" size={11} color={t.bg} strokeWidth={2.4}/>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function SFF3TiendaHome({ t }) {
  const isLight = t === DST.light;
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', overflow:'auto', background:t.bg, fontFamily:ff }}>
      <StorefrontNavbar t={t} cartCount={3}/>

      {/* Hero */}
      <div style={{
        position:'relative', height:380, overflow:'hidden', flexShrink:0,
        background: isLight
          ? 'linear-gradient(135deg, #DC2626 0%, #7C2D12 100%)'
          : 'linear-gradient(135deg, #450A0A 0%, #1C0707 100%)',
      }}>
        {/* Pattern */}
        <div style={{
          position:'absolute', inset:0, opacity:.10,
          display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gridTemplateRows:'repeat(5, 1fr)',
        }}>
          {Array.from({ length:50 }).map((_, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name={['utensils', 'soup', 'beef', 'fish', 'cake', 'glass-water'][i % 6]} size={36} color="#fff"/>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{
          position:'relative', height:'100%',
          padding:'60px 80px',
          display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:720,
        }}>
          <div style={{
            display:'inline-flex', alignSelf:'flex-start', alignItems:'center', gap:6,
            padding:'5px 12px', borderRadius:14,
            background:'rgba(255,255,255,.16)', backdropFilter:'blur(8px)',
            color:'#fff', fontSize:11, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
            marginBottom:18,
          }}>
            <Icon name="map-pin" size={12} color="#fff"/>
            Bogotá · Domicilios y para llevar
          </div>
          <div style={{
            fontSize:48, fontWeight:800, color:'#fff', lineHeight:1.05,
            letterSpacing:'-.02em', marginBottom:14,
          }}>
            El sabor de Colombia<br/>en tu puerta
          </div>
          <div style={{ fontSize:16, color:'rgba(255,255,255,.85)', marginBottom:28, maxWidth:520, lineHeight:1.5 }}>
            Pedidos a domicilio sin comisiones, hechos directamente por nosotros. Recibe tu comida fresca y caliente en 30-45 minutos.
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:18 }}>
            <button style={{
              padding:'14px 24px', borderRadius:11,
              background:'#fff', color:'#0A0A0A', border:'none', cursor:'pointer', fontFamily:ff,
              fontSize:15, fontWeight:700,
              display:'flex', alignItems:'center', gap:8,
              boxShadow:'0 8px 24px rgba(0,0,0,.25)',
            }}>
              Pedir ahora
              <Icon name="arrow-right" size={15} color="#0A0A0A" strokeWidth={2.4}/>
            </button>
            <button style={{
              padding:'14px 24px', borderRadius:11,
              background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,.4)', cursor:'pointer', fontFamily:ff,
              fontSize:15, fontWeight:600,
            }}>
              Ver el menú
            </button>
          </div>

          {/* Delivery badge */}
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'rgba(255,255,255,.85)', fontSize:13 }}>
              <Icon name="clock" size={14} color="rgba(255,255,255,.85)"/>
              <span style={{ fontWeight:600 }}>30-45 min</span>
            </div>
            <div style={{ width:4, height:4, borderRadius:2, background:'rgba(255,255,255,.4)' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'rgba(255,255,255,.85)', fontSize:13 }}>
              <Icon name="bike" size={14} color="rgba(255,255,255,.85)"/>
              <span style={{ fontWeight:600 }}>Domicilio desde {fmtCOP(8000)}</span>
            </div>
            <div style={{ width:4, height:4, borderRadius:2, background:'rgba(255,255,255,.4)' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'rgba(255,255,255,.85)', fontSize:13 }}>
              <Icon name="shield-check" size={14} color="rgba(255,255,255,.85)"/>
              <span style={{ fontWeight:600 }}>Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías destacadas */}
      <div style={{ padding:'40px 80px 28px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>Explora</div>
            <div style={{ fontSize:24, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Categorías destacadas</div>
          </div>
          <a style={{ fontSize:13, color:t.accent, cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
            Ver todas
            <Icon name="arrow-right" size={13} color={t.accent}/>
          </a>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14 }}>
          {SF_CATEGORIAS_DESTACADAS.map(c => (
            <button key={c.id} style={{
              padding:'24px 18px', borderRadius:13,
              background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff,
              display:'flex', flexDirection:'column', alignItems:'center', gap:10,
              transition:'border-color .15s',
            }}>
              <div style={{
                width:60, height:60, borderRadius:30,
                background: isLight ? `${c.color}1A` : `${c.color}33`,
                color: c.color,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name={c.icon} size={26} color={c.color}/>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:t.text }}>{c.label}</div>
              <div style={{ fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{c.count} platos</div>
            </button>
          ))}
        </div>
      </div>

      {/* Lo más pedido */}
      <div style={{ padding:'14px 80px 40px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>Recomendados</div>
            <div style={{ fontSize:24, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Lo más pedido esta semana</div>
          </div>
          <a style={{ fontSize:13, color:t.accent, cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
            Ver todo
            <Icon name="arrow-right" size={13} color={t.accent}/>
          </a>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
          {LO_MAS_PEDIDO.map(p => <SFProductCard key={p.id} t={t} p={p}/>)}
        </div>
      </div>

      {/* Banner de combos */}
      <div style={{ padding:'0 80px 40px' }}>
        <div style={{
          padding:'32px 40px', borderRadius:16,
          background: isLight
            ? 'linear-gradient(90deg, #FEF3C7 0%, #FED7AA 100%)'
            : 'linear-gradient(90deg, #44403C 0%, #292524 100%)',
          display:'flex', alignItems:'center', gap:24,
        }}>
          <div style={{
            width:80, height:80, borderRadius:20,
            background:'#fff', color:'#9A3412',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <Icon name="package" size={40} color="#9A3412"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{
              display:'inline-block',
              padding:'3px 9px', borderRadius:6,
              background:'rgba(0,0,0,.12)', color: isLight ? '#78350F' : '#FED7AA',
              fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
              marginBottom:8,
            }}>Combos del día</div>
            <div style={{ fontSize:22, fontWeight:700, color: isLight ? '#7C2D12' : '#FEF3C7', letterSpacing:'-.01em', marginBottom:4 }}>
              Almuerzo ejecutivo · Lun a Vie
            </div>
            <div style={{ fontSize:13, color: isLight ? '#9A3412' : '#FDE68A', lineHeight:1.5 }}>
              Sopa + plato fuerte + jugo natural + postre del día
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color: isLight ? '#9A3412' : '#FDE68A', marginBottom:2 }}>Desde</div>
            <div style={{ fontSize:32, fontWeight:800, color: isLight ? '#7C2D12' : '#FEF3C7', fontVariantNumeric:'tabular-nums', letterSpacing:'-.02em' }}>{fmtCOP(18000)}</div>
            <button style={{
              marginTop:10, padding:'8px 16px', borderRadius:9,
              background:'#0A0A0A', color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
              fontSize:12, fontWeight:700,
              display:'inline-flex', alignItems:'center', gap:5,
            }}>
              Pedir combo
              <Icon name="arrow-right" size={12} color="#fff" strokeWidth={2.4}/>
            </button>
          </div>
        </div>
      </div>

      <StorefrontFooter t={t}/>
    </div>
  );
}

Object.assign(window, { SFF3TiendaHome, SFProductCard, LO_MAS_PEDIDO, SF_CATEGORIAS_DESTACADAS });
