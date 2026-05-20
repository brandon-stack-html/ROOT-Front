// sf-f2-detalle-producto.jsx — Carta QR detalle producto (mobile)

const MOD_TERMINO = [
  { id:'desmechado', label:'Desmechado', extra:0,    selected:true },
  { id:'entero',     label:'Entero',     extra:0 },
  { id:'extra',      label:'Extra pollo',extra:5000 },
];

const MOD_ACOMP = [
  { id:'sin-arroz',  label:'Sin arroz',     extra:0 },
  { id:'arroz',      label:'Con arroz',     extra:0,    selected:true },
  { id:'aguacate',   label:'Extra aguacate',extra:2000 },
];

function ModRadio({ t, opt, group }) {
  const isLight = t === DST.light;
  const sel = opt.selected;
  return (
    <label style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'11px 12px', borderRadius:11,
      background: sel ? (isLight ? '#FEF3C7' : 'rgba(245,158,11,.12)') : t.bg,
      border:`1px solid ${sel ? (isLight ? '#F59E0B' : 'rgba(245,158,11,.5)') : t.border}`,
      cursor:'pointer', fontFamily:ff, marginBottom:6,
    }}>
      <span style={{
        width:18, height:18, borderRadius:9,
        background: sel ? '#F59E0B' : t.alt,
        border: sel ? `none` : `1.5px solid ${t.border}`,
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        {sel && <span style={{ width:7, height:7, borderRadius:4, background:'#fff' }}/>}
      </span>
      <span style={{ flex:1, fontSize:13, fontWeight: sel ? 600 : 500, color:t.text }}>{opt.label}</span>
      {opt.extra > 0 && (
        <span style={{ fontSize:12, color: sel ? '#92400E' : t.muted, fontVariantNumeric:'tabular-nums', fontWeight:600 }}>
          + {fmtCOP(opt.extra)}
        </span>
      )}
    </label>
  );
}

function SFF2DetalleProducto({ t }) {
  const isLight = t === DST.light;
  const precioBase = 28000;
  const cantidad = 1;
  const total = precioBase * cantidad + 2000; // ejemplo: extra aguacate

  return (
    <MobileShell t={t}>
      <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column', background:t.bg }}>
        {/* Foto */}
        <div style={{
          height:260, position:'relative', flexShrink:0,
          background:PRODUCT_GRADIENTS.ajiaco,
          overflow:'hidden',
        }}>
          {/* Pattern */}
          <div style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="soup" size={120} color="rgba(154,52,18,.32)"/>
          </div>

          {/* Volver */}
          <button style={{
            position:'absolute', top:14, left:14,
            width:38, height:38, borderRadius:19,
            background:'rgba(255,255,255,.92)', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            backdropFilter:'blur(8px)',
          }}>
            <Icon name="arrow-left" size={16} color="#0A0A0A"/>
          </button>

          {/* Acciones */}
          <div style={{ position:'absolute', top:14, right:14, display:'flex', gap:8 }}>
            <button style={{
              width:38, height:38, borderRadius:19,
              background:'rgba(255,255,255,.92)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="heart" size={15} color="#0A0A0A"/>
            </button>
            <button style={{
              width:38, height:38, borderRadius:19,
              background:'rgba(255,255,255,.92)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon name="share-2" size={15} color="#0A0A0A"/>
            </button>
          </div>

          {/* Badge esquina */}
          <div style={{
            position:'absolute', bottom:14, left:14,
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:11,
            background:'rgba(0,0,0,.6)', color:'#fff',
            backdropFilter:'blur(6px)',
            fontSize:11, fontWeight:600,
          }}>
            <Icon name="flame" size={11} color="#FBBF24"/>
            Popular esta semana
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding:'18px 18px 100px', flex:1 }}>
          {/* Header */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>
              Platos fuertes · Plato del día
            </div>
            <div style={{ fontSize:24, fontWeight:700, color:t.text, lineHeight:1.2, letterSpacing:'-.01em', marginBottom:8 }}>
              Ajiaco Bogotano
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ fontSize:24, fontWeight:700, color:t.accent, fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em' }}>{fmtCOP(precioBase)}</span>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:t.muted }}>
                <Icon name="clock" size={11} color={t.muted}/>
                15-20 min
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:t.muted }}>
                <Icon name="flame" size={11} color={t.muted}/>
                420 kcal
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div style={{
            fontSize:13, color:t.muted, lineHeight:1.6, marginBottom:18,
            paddingBottom:18, borderBottom:`1px solid ${t.border}`,
          }}>
            Nuestra versión del ajiaco santafereño, preparado con tres tipos de papa, mazorca tierna, pollo desmechado y crema de leche. Servido con arroz blanco y aguacate.
          </div>

          {/* Personaliza */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:14, fontWeight:700, color:t.text, marginBottom:4 }}>Personaliza tu pedido</div>
            <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Algunos ajustes pueden tener costo adicional.</div>

            {/* Grupo 1 */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:t.text }}>Término del pollo</span>
                <span style={{ fontSize:10, color:t.muted, fontWeight:600, padding:'2px 7px', borderRadius:4, background:t.alt }}>Obligatorio</span>
              </div>
              {MOD_TERMINO.map(o => <ModRadio key={o.id} t={t} opt={o}/>)}
            </div>

            {/* Grupo 2 */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:t.text }}>Acompañamiento</span>
                <span style={{ fontSize:10, color:t.muted }}>Opcional</span>
              </div>
              {MOD_ACOMP.map(o => <ModRadio key={o.id} t={t} opt={o}/>)}
            </div>
          </div>

          {/* Cantidad */}
          <div style={{
            padding:'14px 16px', borderRadius:11,
            background:t.alt, border:`1px solid ${t.border}`,
            display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18,
          }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:t.muted }}>Cantidad</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Selecciona cuántos quieres</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button style={{
                width:38, height:38, borderRadius:19, border:`1px solid ${t.border}`,
                background:t.bg, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="minus" size={14} color={t.text} strokeWidth={2.4}/>
              </button>
              <span style={{ fontSize:18, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', minWidth:28, textAlign:'center' }}>{cantidad}</span>
              <button style={{
                width:38, height:38, borderRadius:19, border:'none',
                background:t.text, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="plus" size={14} color={t.bg} strokeWidth={2.4}/>
              </button>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:t.text, display:'block', marginBottom:6 }}>Notas especiales</label>
            <div style={{
              padding:'10px 12px', borderRadius:10,
              background:t.bg, border:`1px solid ${t.border}`,
              fontSize:12, color:t.muted, lineHeight:1.5,
              minHeight:60,
            }}>
              Alguna alergia o preferencia que el chef deba saber...
            </div>
            <div style={{ fontSize:10, color:t.muted, marginTop:4, textAlign:'right' }}>0 / 200</div>
          </div>
        </div>

        {/* Footer sticky CTA */}
        <div style={{
          position:'absolute', bottom:34, left:0, right:0,
          padding:'10px 16px',
        }}>
          <button style={{
            width:'100%', padding:'15px 18px', borderRadius:14,
            background:t.accent, color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            boxShadow:'0 6px 20px rgba(79,70,229,.32)',
          }}>
            <span style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Icon name="plus" size={16} color="#fff" strokeWidth={2.6}/>
              <span style={{ fontSize:14, fontWeight:700 }}>Agregar al pedido</span>
            </span>
            <span style={{ fontSize:15, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(total)}</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { SFF2DetalleProducto });
