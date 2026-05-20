// sf-f4-tienda-catalogo.jsx — Tienda online catálogo (desktop)

const SF_CAT_FILTROS = [
  { id:'entradas', label:'Entradas',       count:12 },
  { id:'platos',   label:'Platos fuertes', count:18, active:true },
  { id:'bebidas',  label:'Bebidas',        count:24 },
  { id:'postres',  label:'Postres',        count:8 },
  { id:'combos',   label:'Combos',         count:6 },
];

const SF_DISP_FILTROS = [
  { id:'hoy',      label:'Solo disponibles hoy' },
  { id:'gluten',   label:'Sin gluten' },
  { id:'veg',      label:'Vegetariano' },
  { id:'picante',  label:'No picante' },
];

const CATALOGO_PRODS = [
  { id:1, nombre:'Bandeja Paisa',       desc:'Frijoles, arroz, carne molida, chicharrón, huevo, plátano y aguacate.', precio:32000, grad:PRODUCT_GRADIENTS.paisa,    icon:'beef',     popular:true },
  { id:2, nombre:'Ajiaco Bogotano',     desc:'Sopa con tres papas, mazorca, pollo, crema y alcaparras.',              precio:28000, grad:PRODUCT_GRADIENTS.ajiaco,   icon:'soup' },
  { id:3, nombre:'Sancocho de Gallina', desc:'Caldo robusto con yuca, plátano y mazorca.',                            precio:25000, grad:PRODUCT_GRADIENTS.sancocho, icon:'soup' },
  { id:4, nombre:'Lomo al Trapo',       desc:'Lomo de res con sal, envuelto en trapo y cocido a las brasas.',         precio:45000, grad:PRODUCT_GRADIENTS.lomo,     icon:'beef' },
  { id:5, nombre:'Cazuela de Mariscos', desc:'Camarones, calamares, almejas y pescado en salsa de coco.',             precio:42000, grad:PRODUCT_GRADIENTS.cazuela,  icon:'shell',    popular:true },
  { id:6, nombre:'Trucha en Salsa',     desc:'Trucha fresca en salsa criolla con arroz blanco.',                      precio:38000, grad:PRODUCT_GRADIENTS.trucha,   icon:'fish' },
  { id:7, nombre:'Mojarra Frita',       desc:'Mojarra entera frita con patacones y ensalada.',                        precio:35000, grad:PRODUCT_GRADIENTS.mojarra,  icon:'fish' },
  { id:8, nombre:'Sobrebarriga',        desc:'Sobrebarriga al horno con papas chorreadas.',                           precio:30000, grad:PRODUCT_GRADIENTS.paisa,    icon:'beef',     sinStock:true },
  { id:9, nombre:'Pollo a la Plancha',  desc:'Pechuga marinada con limón y especias colombianas.',                    precio:22000, grad:PRODUCT_GRADIENTS.sancocho, icon:'beef' },
];

function CatalogoCard({ t, p }) {
  const isLight = t === DST.light;
  const sin = p.sinStock;
  return (
    <div style={{
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:13,
      overflow:'hidden', position:'relative', cursor: sin ? 'not-allowed' : 'pointer',
      opacity: sin ? 0.55 : 1,
      display:'flex', flexDirection:'column',
    }}>
      <FoodPhoto height={180} gradient={p.grad} icon={p.icon} radius={0}
        badge={
          <>
            {p.popular && (
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
            )}
            {sin && (
              <span style={{
                position:'absolute', top:10, left:10,
                padding:'4px 9px', borderRadius:9,
                background:'rgba(0,0,0,.7)', color:'#fff',
                fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
              }}>Sin stock</span>
            )}
            <button style={{
              position:'absolute', top:10, right:10,
              width:32, height:32, borderRadius:16, border:'none',
              background:'rgba(255,255,255,.9)', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="heart" size={14} color="#0A0A0A"/>
            </button>
          </>
        }
      />
      <div style={{ padding:'14px 16px 16px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <span style={{ fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Platos fuertes</span>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:3, lineHeight:1.3 }}>{p.nombre}</div>
          <div style={{ fontSize:12, color:t.muted, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</div>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <PriceTag t={t} value={p.precio} accent/>
          <button disabled={sin} style={{
            padding:'8px 14px', borderRadius:8,
            background: sin ? t.alt : t.text,
            color: sin ? t.muted : t.bg,
            border:'none', cursor: sin ? 'not-allowed' : 'pointer', fontFamily:ff,
            fontSize:11, fontWeight:600,
            display:'flex', alignItems:'center', gap:5,
          }}>
            <Icon name={sin ? 'x' : 'shopping-cart'} size={11} color={sin ? t.muted : t.bg} strokeWidth={2}/>
            {sin ? 'No disponible' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterCheckbox({ t, label, count, checked }) {
  return (
    <label style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'8px 4px', cursor:'pointer', fontFamily:ff,
    }}>
      <span style={{
        width:16, height:16, borderRadius:5,
        background: checked ? t.accent : 'transparent',
        border: `1.5px solid ${checked ? t.accent : t.border}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        flexShrink:0,
      }}>
        {checked && <Icon name="check" size={11} color="#fff" strokeWidth={3}/>}
      </span>
      <span style={{ flex:1, fontSize:13, color: checked ? t.text : t.muted, fontWeight: checked ? 600 : 500 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{count}</span>}
    </label>
  );
}

function FilterSection({ t, title, children, action }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

function SFF4TiendaCatalogo({ t }) {
  const isLight = t === DST.light;
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', overflow:'auto', background:t.bg, fontFamily:ff }}>
      <StorefrontNavbar t={t} cartCount={3}/>

      {/* Title bar */}
      <div style={{
        padding:'28px 80px 18px', borderBottom:`1px solid ${t.border}`,
        display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      }}>
        <div>
          <div style={{ fontSize:12, color:t.muted, marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
            <span>Inicio</span>
            <Icon name="chevron-right" size={11} color={t.muted}/>
            <span>Menú</span>
            <Icon name="chevron-right" size={11} color={t.muted}/>
            <span style={{ color:t.text, fontWeight:600 }}>Platos fuertes</span>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:t.text, letterSpacing:'-.02em' }}>Platos fuertes</div>
          <div style={{ fontSize:13, color:t.muted, marginTop:4 }}>Lo mejor de la cocina colombiana, hecho con receta de abuela.</div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display:'flex', gap:30, padding:'24px 80px 40px', flex:1 }}>
        {/* Filtros */}
        <aside style={{ width:260, flexShrink:0 }}>
          <div style={{
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:13,
            padding:'18px 20px', position:'sticky', top:24,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.text }}>Filtros</span>
              <a style={{ fontSize:11, color:t.accent, cursor:'pointer', fontWeight:600 }}>Limpiar</a>
            </div>

            <FilterSection t={t} title="Categorías">
              {SF_CAT_FILTROS.map(c => (
                <FilterCheckbox key={c.id} t={t} label={c.label} count={c.count} checked={c.active}/>
              ))}
            </FilterSection>

            <FilterSection t={t} title="Precio" action={<span style={{ fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(0)} – {fmtCOP(60000)}</span>}>
              <div style={{ padding:'10px 4px' }}>
                <div style={{
                  position:'relative', height:6, borderRadius:3, background:t.alt,
                }}>
                  <div style={{
                    position:'absolute', left:'8%', right:'25%', height:'100%',
                    background:t.accent, borderRadius:3,
                  }}/>
                  <span style={{
                    position:'absolute', left:'8%', top:'50%', transform:'translate(-50%, -50%)',
                    width:18, height:18, borderRadius:9, background:t.bg,
                    border:`2px solid ${t.accent}`, boxShadow:'0 1px 3px rgba(0,0,0,.18)',
                  }}/>
                  <span style={{
                    position:'absolute', left:'75%', top:'50%', transform:'translate(-50%, -50%)',
                    width:18, height:18, borderRadius:9, background:t.bg,
                    border:`2px solid ${t.accent}`, boxShadow:'0 1px 3px rgba(0,0,0,.18)',
                  }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>
                  <span>{fmtCOP(8000)}</span>
                  <span>{fmtCOP(45000)}</span>
                </div>
              </div>
            </FilterSection>

            <FilterSection t={t} title="Disponibilidad">
              {SF_DISP_FILTROS.map(d => (
                <FilterCheckbox key={d.id} t={t} label={d.label} checked={false}/>
              ))}
            </FilterSection>

            {/* Aplicar */}
            <button style={{
              width:'100%', padding:'10px 14px', borderRadius:9,
              background:t.text, color:t.bg, border:'none', cursor:'pointer', fontFamily:ff,
              fontSize:12, fontWeight:700, marginTop:6,
            }}>
              Aplicar filtros
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Toolbar */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'4px 0 18px',
          }}>
            <div style={{ fontSize:13, color:t.muted }}>
              <span style={{ color:t.text, fontWeight:600 }}>{CATALOGO_PRODS.length} platos</span> en Platos fuertes
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button style={{
                padding:'8px 12px', borderRadius:8, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
                display:'flex', alignItems:'center', gap:7, fontFamily:ff, fontSize:12, color:t.text,
              }}>
                <span style={{ color:t.muted }}>Ordenar:</span>
                <span style={{ fontWeight:600 }}>Más populares</span>
                <Icon name="chevron-down" size={11} color={t.muted}/>
              </button>
              <div style={{ display:'flex', gap:2, padding:3, background:t.alt, borderRadius:7 }}>
                {[
                  { l:'Lista', icon:'list' },
                  { l:'Grid',  icon:'layout-grid', active:true },
                ].map(v => (
                  <button key={v.l} style={{
                    padding:'5px 9px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff,
                    background: v.active ? t.bg : 'transparent',
                    color: v.active ? t.accent : t.muted,
                    display:'flex', alignItems:'center', boxShadow: v.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                  }}>
                    <Icon name={v.icon} size={13} color={v.active ? t.accent : t.muted}/>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
            {CATALOGO_PRODS.map(p => <CatalogoCard key={p.id} t={t} p={p}/>)}
          </div>
        </div>
      </div>

      <StorefrontFooter t={t}/>
    </div>
  );
}

Object.assign(window, { SFF4TiendaCatalogo, CatalogoCard, FilterCheckbox, FilterSection });
