// sf-shared.jsx — Helpers compartidos del storefront público

// ── Foto/placeholder cálido para producto o banner ────────────────────────────
function FoodPhoto({ height = 120, gradient, icon = 'utensils', iconSize, radius = 12, overlay, badge }) {
  const grad = gradient || 'linear-gradient(135deg, #FECACA 0%, #FED7AA 100%)';
  const iSize = iconSize || Math.round(height * 0.35);
  return (
    <div style={{
      height, width:'100%', borderRadius:radius,
      background:grad, position:'relative', overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <Icon name={icon} size={iSize} color="rgba(154,52,18,.32)"/>
      {badge}
      {overlay}
    </div>
  );
}

// Paleta de gradientes cálidos para productos
const PRODUCT_GRADIENTS = {
  paisa:    'linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)',
  ajiaco:   'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)',
  sancocho: 'linear-gradient(135deg, #BBF7D0 0%, #86EFAC 100%)',
  lomo:     'linear-gradient(135deg, #FCA5A5 0%, #DC2626 100%)',
  trucha:   'linear-gradient(135deg, #BFDBFE 0%, #60A5FA 100%)',
  cazuela:  'linear-gradient(135deg, #DDD6FE 0%, #A78BFA 100%)',
  mojarra:  'linear-gradient(135deg, #FBCFE8 0%, #F472B6 100%)',
  limonada: 'linear-gradient(135deg, #D9F99D 0%, #84CC16 100%)',
  cafe:     'linear-gradient(135deg, #D6D3D1 0%, #92400E 100%)',
  postre:   'linear-gradient(135deg, #FCE7F3 0%, #EC4899 100%)',
};

// ── Logo circular del negocio ─────────────────────────────────────────────────
function BSLogo({ size = 44, ring = false }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:size/2,
      background:'#FED7AA', color:'#9A3412',
      fontWeight:700, fontSize: Math.round(size * 0.36),
      display:'flex', alignItems:'center', justifyContent:'center',
      flexShrink:0,
      boxShadow: ring ? '0 0 0 3px rgba(255,255,255,.85)' : '0 1px 4px rgba(0,0,0,.18)',
    }}>BS</div>
  );
}

// ── Storefront Navbar (desktop) ───────────────────────────────────────────────
function StorefrontNavbar({ t, simplified = false, cartCount = 0, active }) {
  const items = ['Menú', 'Nosotros', '¿Cómo funciona?'];
  return (
    <div style={{
      height:64, flexShrink:0, width:'100%',
      background:t.bg, borderBottom:`1px solid ${t.border}`,
      display:'flex', alignItems:'center', padding:'0 40px', gap:24, fontFamily:ff,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <BSLogo size={36}/>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:t.text, lineHeight:1.1, letterSpacing:'-.01em' }}>El Buen Sabor</div>
          <div style={{ fontSize:10, color:t.muted, lineHeight:1.1, marginTop:1 }}>Restaurante · Bogotá</div>
        </div>
      </div>

      {!simplified && (
        <>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:24, marginLeft:32 }}>
            {items.map((it, i) => (
              <a key={it} style={{
                fontSize:14, fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? t.text : t.muted,
                cursor:'pointer', position:'relative',
                paddingBottom:4,
                borderBottom: i === 0 ? `2px solid ${t.accent}` : '2px solid transparent',
              }}>{it}</a>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button style={{
              width:38, height:38, borderRadius:9, background:t.alt, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="search" size={15} color={t.muted}/>
            </button>
            <a style={{ fontSize:13, color:t.text, fontWeight:500, cursor:'pointer' }}>Iniciar sesión</a>
            <button style={{
              padding:'8px 14px', borderRadius:9, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
              display:'flex', alignItems:'center', gap:7, fontFamily:ff, position:'relative',
            }}>
              <Icon name="shopping-cart" size={15} color={t.text}/>
              <span style={{ fontSize:13, color:t.text, fontWeight:600 }}>Carrito</span>
              {cartCount > 0 && (
                <span style={{
                  position:'absolute', top:-6, right:-6,
                  width:20, height:20, borderRadius:10,
                  background:t.accent, color:'#fff',
                  fontSize:10, fontWeight:700, fontVariantNumeric:'tabular-nums',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:`2px solid ${t.bg}`,
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </>
      )}

      {simplified && (
        <>
          <div style={{ flex:1 }}/>
          <a style={{ fontSize:13, color:t.muted, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="arrow-left" size={13} color={t.muted}/>
            Volver al menú
          </a>
        </>
      )}
    </div>
  );
}

// ── Storefront Footer ─────────────────────────────────────────────────────────
function StorefrontFooter({ t, minimal = false }) {
  if (minimal) {
    return (
      <div style={{
        padding:'18px 40px', background:t.alt, borderTop:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontFamily:ff, flexShrink:0,
      }}>
        <div style={{ fontSize:11, color:t.muted }}>© 2026 El Buen Sabor SAS · NIT 900.123.456-7</div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:t.muted }}>
          <Icon name="shield-check" size={12} color={DST.success}/>
          Pago 100% seguro · Wompi
        </div>
      </div>
    );
  }
  return (
    <div style={{
      padding:'32px 40px 22px', background:t.alt, borderTop:`1px solid ${t.border}`,
      fontFamily:ff, flexShrink:0,
    }}>
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr 1fr', gap:30, marginBottom:24 }}>
        {/* Logo */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <BSLogo size={36}/>
            <div style={{ fontSize:14, fontWeight:700, color:t.text }}>El Buen Sabor</div>
          </div>
          <div style={{ fontSize:12, color:t.muted, lineHeight:1.6 }}>
            Sabor casero hecho con receta de abuela.<br/>
            Cra. 15 #80-32, Bogotá<br/>
            Lun a Dom · 11:00 — 22:00
          </div>
        </div>
        {/* Links */}
        {[
          { titulo:'Tienda', items:['Menú', 'Lo más pedido', 'Combos del día', 'Domicilios'] },
          { titulo:'Negocio', items:['Nosotros', 'Sucursales', 'Trabaja con nosotros', 'Reservas'] },
          { titulo:'Soporte', items:['Contacto', 'Estado del pedido', 'Términos y condiciones', 'Privacidad'] },
        ].map(g => (
          <div key={g.titulo}>
            <div style={{ fontSize:11, fontWeight:700, color:t.text, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:10 }}>{g.titulo}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {g.items.map(it => (
                <a key={it} style={{ fontSize:12, color:t.muted, cursor:'pointer' }}>{it}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        paddingTop:18, borderTop:`1px solid ${t.border}`,
      }}>
        <div style={{ fontSize:11, color:t.muted }}>
          © 2026 El Buen Sabor SAS · NIT 900.123.456-7 · Hecho con
          <Icon name="heart" size={11} color={DST.error} style={{ verticalAlign:'middle', margin:'0 4px' }}/>
          en Bogotá
        </div>
        {/* Redes + pagos */}
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ display:'flex', gap:7 }}>
            {['instagram', 'facebook', 'youtube', 'twitter'].map(s => (
              <button key={s} style={{
                width:30, height:30, borderRadius:7, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name={s} size={13} color={t.muted}/>
              </button>
            ))}
          </div>
          <div style={{ width:1, height:22, background:t.border }}/>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:10, color:t.muted, marginRight:4 }}>Pagos:</span>
            {['Visa', 'MC', 'PSE', 'Wompi'].map(p => (
              <span key={p} style={{
                padding:'3px 8px', borderRadius:5, background:t.bg, border:`1px solid ${t.border}`,
                fontSize:10, color:t.text, fontWeight:600, letterSpacing:'.04em',
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PriceTag ──────────────────────────────────────────────────────────────────
function PriceTag({ t, value, big, accent }) {
  const size = big ? 22 : 14;
  const color = accent ? t.accent : t.text;
  return (
    <span style={{
      fontSize:size, fontWeight:700, color,
      fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em',
    }}>{fmtCOP(value)}</span>
  );
}

Object.assign(window, { FoodPhoto, PRODUCT_GRADIENTS, BSLogo, StorefrontNavbar, StorefrontFooter, PriceTag });
