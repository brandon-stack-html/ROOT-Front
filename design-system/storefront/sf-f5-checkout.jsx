// sf-f5-checkout.jsx — Tienda online checkout (paso 2: entrega)

const CHECKOUT_STEPS = [
  { n:1, label:'Datos',    done:true },
  { n:2, label:'Entrega',  active:true },
  { n:3, label:'Pago',     pending:true },
];

const CHECKOUT_ITEMS = [
  { nombre:'Bandeja Paisa',    qty:1, precio:32000 },
  { nombre:'Ajiaco Bogotano',  qty:2, precio:28000 },
  { nombre:'Limonada Natural', qty:2, precio:9000 },
];

function StepperHorizontal({ t }) {
  const isLight = t === DST.light;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:32 }}>
      {CHECKOUT_STEPS.map((s, i) => {
        const isLast = i === CHECKOUT_STEPS.length - 1;
        let bg, color, dotBg, dotColor;
        if (s.done) { bg = DST.success; color = '#fff'; dotBg = DST.success; dotColor = '#fff'; }
        else if (s.active) { bg = t.accent; color = '#fff'; dotBg = t.accent; dotColor = '#fff'; }
        else { bg = 'transparent'; color = t.muted; dotBg = t.alt; dotColor = t.muted; }

        return (
          <React.Fragment key={s.n}>
            <div style={{ display:'flex', alignItems:'center', gap:11, flexShrink:0 }}>
              <div style={{
                width:34, height:34, borderRadius:17,
                background: dotBg, color: dotColor,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700,
                boxShadow: s.active ? `0 0 0 4px ${isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)'}` : 'none',
              }}>
                {s.done ? <Icon name="check" size={15} color="#fff" strokeWidth={3}/> : s.n}
              </div>
              <div>
                <div style={{ fontSize:11, color:t.muted, lineHeight:1.1 }}>Paso {s.n}</div>
                <div style={{ fontSize:13, fontWeight:600, color: s.pending ? t.muted : t.text, lineHeight:1.2 }}>{s.label}</div>
              </div>
            </div>
            {!isLast && (
              <div style={{
                flex:1, height:2, background: s.done ? DST.success : t.border, margin:'0 14px', borderRadius:1,
              }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function EntregaRadio({ t, opt, selected }) {
  const isLight = t === DST.light;
  return (
    <label style={{
      flex:1, padding:'18px 20px', borderRadius:12,
      background: selected ? (isLight ? '#EEF2FF' : 'rgba(99,102,241,.12)') : t.bg,
      border:`1px solid ${selected ? t.accent : t.border}`,
      cursor:'pointer', fontFamily:ff,
      display:'flex', alignItems:'center', gap:14,
      boxShadow: selected ? `0 0 0 3px ${isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)'}` : 'none',
    }}>
      <span style={{
        width:20, height:20, borderRadius:10,
        background: selected ? t.accent : 'transparent',
        border: selected ? 'none' : `1.5px solid ${t.border}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        flexShrink:0,
      }}>
        {selected && <span style={{ width:8, height:8, borderRadius:4, background:'#fff' }}/>}
      </span>
      <div style={{
        width:46, height:46, borderRadius:11,
        background: isLight ? `${opt.color}1A` : `${opt.color}33`,
        color:opt.color,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={opt.icon} size={22} color={opt.color}/>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:3 }}>{opt.label}</div>
        <div style={{ fontSize:12, color:t.muted, lineHeight:1.4 }}>{opt.desc}</div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div style={{ fontSize:12, fontWeight:700, color: opt.precio === 0 ? DST.success : t.text }}>
          {opt.precio === 0 ? 'Gratis' : fmtCOP(opt.precio)}
        </div>
        <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{opt.tiempo}</div>
      </div>
    </label>
  );
}

function CheckoutInput({ t, label, value, suffix, helper }) {
  return (
    <div>
      <label style={{ fontSize:12, fontWeight:600, color:t.text, display:'block', marginBottom:6 }}>{label}</label>
      <div style={{
        display:'flex', alignItems:'center',
        background:t.bg, border:`1px solid ${t.border}`, borderRadius:9,
        padding:'0 14px', height:42, gap:8,
      }}>
        <input readOnly value={value || ''} style={{
          flex:1, border:'none', outline:'none', background:'transparent',
          fontSize:13, fontFamily:ff, color: value ? t.text : t.muted, fontWeight:500,
        }}/>
        {suffix}
      </div>
      {helper && <div style={{ fontSize:11, color:t.muted, marginTop:5 }}>{helper}</div>}
    </div>
  );
}

function SFF5Checkout({ t }) {
  const isLight = t === DST.light;
  const subtotal = CHECKOUT_ITEMS.reduce((acc, i) => acc + i.qty * i.precio, 0);
  const domicilio = 8000;
  const total = subtotal + domicilio;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', overflow:'auto', background:t.bg, fontFamily:ff }}>
      <StorefrontNavbar t={t} simplified/>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:30, padding:'32px 80px 40px', flex:1, alignItems:'flex-start' }}>
        {/* Columna izquierda */}
        <div>
          {/* Header */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:6 }}>Checkout</div>
            <div style={{ fontSize:26, fontWeight:800, color:t.text, letterSpacing:'-.02em' }}>Finaliza tu pedido</div>
          </div>

          <StepperHorizontal t={t}/>

          {/* Paso 2 contenido */}
          <div style={{
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:13,
            padding:'24px 26px', marginBottom:18,
          }}>
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:18, fontWeight:700, color:t.text, marginBottom:4, letterSpacing:'-.01em' }}>¿Cómo quieres recibir tu pedido?</div>
              <div style={{ fontSize:12, color:t.muted }}>Elige cómo te gustaría que llegue tu comida.</div>
            </div>

            {/* Radio cards */}
            <div style={{ display:'flex', gap:12, marginBottom:24 }}>
              <EntregaRadio t={t} selected
                opt={{ label:'Domicilio', desc:'Te lo llevamos a tu dirección', icon:'home', color:'#4F46E5', precio:8000, tiempo:'30-45 min' }}
              />
              <EntregaRadio t={t}
                opt={{ label:'Recoger en tienda', desc:'Pasa por la sucursal cuando esté listo', icon:'store', color:'#10B981', precio:0, tiempo:'15-20 min' }}
              />
            </div>

            {/* Form domicilio */}
            <div style={{
              padding:'18px 20px', borderRadius:11,
              background:t.alt, border:`1px solid ${t.border}`,
            }}>
              <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:14, display:'flex', alignItems:'center', gap:7 }}>
                <Icon name="map-pin" size={14} color={t.accent}/>
                Detalles del domicilio
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
                <CheckoutInput t={t} label="Dirección de entrega" value="Cra. 15 #80-32, Apto 401"
                  suffix={<Icon name="search" size={14} color={t.muted}/>}/>
                <CheckoutInput t={t} label="Ciudad" value="Bogotá"/>
              </div>
              <CheckoutInput t={t} label="Referencias / indicaciones" value="Edificio azul, portería sur" helper="Esto ayuda a nuestro repartidor a encontrarte más rápido."/>

              {/* Mini map */}
              <div style={{
                marginTop:18, height:180, borderRadius:11, overflow:'hidden',
                border:`1px solid ${t.border}`, position:'relative',
                background: isLight
                  ? 'linear-gradient(135deg, #DCFCE7 0%, #DBEAFE 100%)'
                  : 'linear-gradient(135deg, #052E16 0%, #1E3A8A 100%)',
              }}>
                {/* Grid líneas estilo mapa */}
                <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width:'100%', height:'100%', display:'block' }}>
                  <defs>
                    <pattern id={`map-${isLight ? 'l' : 'd'}`} width="80" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 40" fill="none" stroke={isLight ? '#94A3B8' : '#475569'} strokeWidth="1" opacity=".4"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="200" fill={`url(#map-${isLight ? 'l' : 'd'})`}/>
                  {/* Calles principales */}
                  <line x1="0" y1="100" x2="800" y2="100" stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="14"/>
                  <line x1="400" y1="0" x2="400" y2="200" stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="14"/>
                  <line x1="0" y1="50" x2="800" y2="50" stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeWidth="6"/>
                  <line x1="0" y1="160" x2="800" y2="160" stroke={isLight ? '#e2e8f0' : '#1e293b'} strokeWidth="6"/>
                </svg>

                {/* Pin */}
                <div style={{
                  position:'absolute', left:'50%', top:'48%',
                  transform:'translate(-50%, -100%)',
                }}>
                  <div style={{
                    width:34, height:34, borderRadius:17,
                    background:DST.error, color:'#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 4px 12px rgba(0,0,0,.32)',
                  }}>
                    <Icon name="map-pin" size={18} color="#fff" strokeWidth={2.4}/>
                  </div>
                  <div style={{
                    width:8, height:8, borderRadius:4,
                    background:DST.error, margin:'0 auto', marginTop:-3,
                  }}/>
                </div>

                {/* Address pill */}
                <div style={{
                  position:'absolute', bottom:12, left:12, right:12,
                  padding:'8px 12px', borderRadius:9,
                  background: isLight ? 'rgba(255,255,255,.95)' : 'rgba(10,10,10,.85)',
                  backdropFilter:'blur(8px)',
                  display:'flex', alignItems:'center', gap:8,
                  fontSize:11,
                }}>
                  <Icon name="navigation" size={12} color={t.accent}/>
                  <span style={{ color:t.text, fontWeight:600 }}>Cra. 15 #80-32</span>
                  <span style={{ color:t.muted }}>· 1.2 km de El Buen Sabor</span>
                </div>
              </div>

              {/* Info de cobertura */}
              <div style={{ display:'flex', gap:10, marginTop:14 }}>
                <div style={{
                  flex:1, padding:'10px 14px', borderRadius:10,
                  background: isLight ? '#F0FDF4' : 'rgba(16,185,129,.10)',
                  border:`1px solid ${isLight ? '#BBF7D0' : 'rgba(16,185,129,.4)'}`,
                  display:'flex', alignItems:'center', gap:10,
                }}>
                  <Icon name="check-circle" size={16} color={DST.success}/>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color: isLight ? '#14532D' : '#86EFAC' }}>Cobertura confirmada</div>
                    <div style={{ fontSize:10, color: isLight ? '#166534' : '#86EFAC', opacity:.85, marginTop:1 }}>Hacemos domicilios a tu zona</div>
                  </div>
                </div>
                <div style={{
                  flex:1, padding:'10px 14px', borderRadius:10,
                  background: isLight ? '#EFF6FF' : 'rgba(59,130,246,.10)',
                  border:`1px solid ${isLight ? '#BFDBFE' : 'rgba(59,130,246,.4)'}`,
                  display:'flex', alignItems:'center', gap:10,
                }}>
                  <Icon name="clock" size={16} color={DST.info}/>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color: isLight ? '#1E40AF' : '#93C5FD' }}>Tiempo estimado</div>
                    <div style={{ fontSize:10, color: isLight ? '#1E3A8A' : '#93C5FD', opacity:.85, marginTop:1 }}>30-45 minutos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones navegación */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <a style={{ fontSize:13, color:t.muted, cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
              <Icon name="arrow-left" size={13} color={t.muted}/>
              Volver a mis datos
            </a>
            <button style={{
              padding:'13px 22px', borderRadius:10,
              background:t.accent, color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
              fontSize:14, fontWeight:700,
              display:'flex', alignItems:'center', gap:8,
            }}>
              Continuar al pago
              <Icon name="arrow-right" size={14} color="#fff" strokeWidth={2.4}/>
            </button>
          </div>
        </div>

        {/* Resumen sticky */}
        <aside style={{ position:'sticky', top:24 }}>
          <div style={{
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:13,
            overflow:'hidden',
          }}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.text }}>Tu pedido</span>
              <a style={{ fontSize:11, color:t.accent, cursor:'pointer', fontWeight:600 }}>Editar</a>
            </div>

            {/* Items */}
            <div style={{ padding:'14px 20px' }}>
              {CHECKOUT_ITEMS.map((it, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:11,
                  padding:'10px 0',
                  borderBottom: i < CHECKOUT_ITEMS.length - 1 ? `1px solid ${t.border}` : 'none',
                }}>
                  <div style={{
                    width:32, height:32, borderRadius:7,
                    background:t.alt, color:t.muted,
                    fontSize:11, fontWeight:700, fontVariantNumeric:'tabular-nums',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>×{it.qty}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:t.text, lineHeight:1.3 }}>{it.nombre}</div>
                    <div style={{ fontSize:10, color:t.muted, fontVariantNumeric:'tabular-nums', marginTop:2 }}>{fmtCOP(it.precio)} c/u</div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(it.qty * it.precio)}</span>
                </div>
              ))}
            </div>

            {/* Cupón */}
            <div style={{ padding:'10px 20px 14px' }}>
              <div style={{
                display:'flex', alignItems:'center',
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:8,
                padding:'8px 10px', gap:8,
              }}>
                <Icon name="tag" size={13} color={t.muted}/>
                <input readOnly placeholder="¿Tienes un cupón?" style={{
                  flex:1, border:'none', outline:'none', background:'transparent',
                  fontSize:12, fontFamily:ff, color:t.muted,
                }}/>
                <button style={{
                  padding:'4px 10px', borderRadius:6,
                  background:t.text, color:t.bg, border:'none', cursor:'pointer', fontFamily:ff,
                  fontSize:11, fontWeight:600,
                }}>Aplicar</button>
              </div>
            </div>

            {/* Totales */}
            <div style={{ padding:'14px 20px', borderTop:`1px solid ${t.border}`, background:t.alt }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, color:t.muted }}>Subtotal</span>
                <span style={{ fontSize:13, color:t.text, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(subtotal)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, color:t.muted }}>Domicilio</span>
                <span style={{ fontSize:13, color:t.text, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(domicilio)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, paddingBottom:14, borderBottom:`1px dashed ${t.border}` }}>
                <span style={{ fontSize:12, color:DST.success, fontWeight:600 }}>
                  <Icon name="tag" size={11} color={DST.success} style={{ verticalAlign:'middle', marginRight:4 }}/>
                  Cupón "BIENVENIDO"
                </span>
                <span style={{ fontSize:13, color:DST.success, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>− {fmtCOP(0)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ fontSize:14, color:t.text, fontWeight:700 }}>Total</span>
                <span style={{ fontSize:24, color:t.text, fontWeight:800, fontVariantNumeric:'tabular-nums', letterSpacing:'-.02em' }}>{fmtCOP(total)}</span>
              </div>
              <button style={{
                width:'100%', padding:'13px 16px', borderRadius:10,
                background:t.accent, color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
                fontSize:14, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              }}>
                <Icon name="lock" size={13} color="#fff"/>
                Pagar {fmtCOP(total)}
              </button>
              <div style={{ fontSize:10, color:t.muted, textAlign:'center', marginTop:8 }}>
                Pago seguro procesado por Wompi
              </div>
            </div>
          </div>
        </aside>
      </div>

      <StorefrontFooter t={t} minimal/>
    </div>
  );
}

Object.assign(window, { SFF5Checkout, StepperHorizontal });
