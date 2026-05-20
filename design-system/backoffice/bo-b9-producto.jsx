// bo-b9-producto.jsx — Crear / Editar producto

const PRECIOS_PRODUCTO = [
  { lista:'Carta',      defaultLabel:'(default)', precio:25000, iva:8, final:27000 },
  { lista:'Happy Hour', defaultLabel:'',          precio:20000, iva:8, final:21600 },
  { lista:'Delivery',   defaultLabel:'',          precio:28000, iva:8, final:30240 },
];

const CANALES_VISIBLE = [
  { l:'POS (mostrador y mesas)',   on:true,  icon:'shopping-bag' },
  { l:'Carta QR',                  on:true,  icon:'qr-code' },
  { l:'Tienda online',             on:true,  icon:'globe' },
  { l:'Delivery (Rappi, UE, etc.)',on:false, icon:'bike' },
];

const SUCURSALES_DISP = [
  { l:'Sede Norte',  on:true },
  { l:'Sede Centro', on:true },
  { l:'Sede Sur',    on:false },
];

function CheckRow({ t, label, on, icon }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'9px 0',
    }}>
      {icon && <Icon name={icon} size={14} color={on ? t.text : t.muted}/>}
      <span style={{ flex:1, fontSize:12, color:on ? t.text : t.muted, fontWeight: on ? 500 : 400 }}>{label}</span>
      <Switch t={t} on={on}/>
    </div>
  );
}

function BOB9Producto({ t }) {
  const isLight = t === DST.light;
  return (
    <BackofficeShell t={t} active="catalogo" breadcrumb={['Gestión', 'Catálogo', 'Editar producto']}>
      <div style={{ padding:'22px 24px 90px', position:'relative' }}>
        <BOPageHeader t={t}
          title="Editar producto"
          subtitle="Ajiaco Bogotano · SKU AJB-001"
          actions={
            <button style={{
              padding:'8px 14px', borderRadius:8, background:'transparent',
              border:`1px solid ${t.border}`, color:t.text, cursor:'pointer',
              fontFamily:ff, fontSize:13, fontWeight:500,
              display:'flex', alignItems:'center', gap:6,
            }}>
              <Icon name="external-link" size={13} color={t.muted}/>
              Ver en POS
            </button>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, alignItems:'flex-start' }}>
          {/* Columna izquierda */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Imagen */}
            <div style={{
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
              padding:'18px 20px',
            }}>
              <div style={{
                fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em',
                textTransform:'uppercase', marginBottom:10,
              }}>Imagen del producto</div>
              <div style={{
                height:240, borderRadius:10,
                background:'linear-gradient(135deg, #FECACA 0%, #FED7AA 100%)',
                position:'relative',
                display:'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden',
              }}>
                <Icon name="utensils" size={56} color="rgba(154,52,18,.32)"/>
                <div style={{
                  position:'absolute', top:12, right:12, display:'flex', gap:6,
                }}>
                  <button style={{
                    padding:'6px 10px', borderRadius:7,
                    background:'rgba(255,255,255,.92)', border:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:5, fontSize:11,
                    color:'#0A0A0A', fontWeight:500, fontFamily:ff,
                  }}>
                    <Icon name="upload" size={11} color="#0A0A0A"/>
                    Cambiar
                  </button>
                  <button style={{
                    padding:'6px 10px', borderRadius:7,
                    background:'rgba(255,255,255,.92)', border:'none', cursor:'pointer',
                    color:DST.error, fontSize:11, fontWeight:500, fontFamily:ff,
                  }}>
                    Eliminar
                  </button>
                </div>
                <div style={{
                  position:'absolute', bottom:12, left:12,
                  padding:'4px 9px', borderRadius:6,
                  background:'rgba(0,0,0,.55)', color:'#fff',
                  fontSize:10, fontWeight:600, letterSpacing:'.04em',
                }}>1280 × 1024 · 124 KB</div>
              </div>
            </div>

            {/* Datos básicos */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'18px 20px' }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:14 }}>Información básica</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <ConfigField t={t} label="Nombre del producto" value="Ajiaco Bogotano"/>
                <ConfigField t={t} label="Categoría" value="Platos fuertes" isSelect/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:t.text, display:'block', marginBottom:6 }}>Descripción</label>
                <div style={{
                  background:t.bg, border:`1px solid ${t.border}`, borderRadius:8,
                  padding:'10px 12px', fontSize:13, color:t.text, lineHeight:1.5,
                  minHeight:60,
                }}>
                  Sopa tradicional colombiana con papa, mazorca y pollo. Servida con crema, alcaparras y aguacate.
                </div>
              </div>
              <ConfigField t={t} label="Código de barras (opcional)" value=""
                suffix={<Icon name="scan-line" size={13} color={t.muted}/>}
                placeholder="Escanea o ingresa el código"/>
            </div>

            {/* Precios */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Precios</div>
                <button style={{
                  padding:'5px 10px', borderRadius:6, background:'transparent',
                  border:`1px solid ${t.border}`, color:t.text, cursor:'pointer',
                  fontFamily:ff, fontSize:11, fontWeight:500,
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <Icon name="plus" size={11} color={t.muted}/>
                  Agregar lista
                </button>
              </div>
              <div style={{
                border:`1px solid ${t.border}`, borderRadius:9, overflow:'hidden',
              }}>
                <div style={{
                  display:'grid', gridTemplateColumns:'1.5fr 1fr 0.7fr 1fr 36px',
                  padding:'9px 14px', background:t.alt, borderBottom:`1px solid ${t.border}`,
                  fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase',
                }}>
                  <div>Lista de precios</div>
                  <div style={{ textAlign:'right' }}>Precio</div>
                  <div style={{ textAlign:'center' }}>IVA</div>
                  <div style={{ textAlign:'right' }}>Precio final</div>
                  <div></div>
                </div>
                {PRECIOS_PRODUCTO.map((p, i) => (
                  <div key={p.lista} style={{
                    display:'grid', gridTemplateColumns:'1.5fr 1fr 0.7fr 1fr 36px',
                    padding:'10px 14px', alignItems:'center',
                    borderBottom: i < PRECIOS_PRODUCTO.length - 1 ? `1px solid ${t.border}` : 'none',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{p.lista}</span>
                      {p.defaultLabel && <span style={{
                        fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:4,
                        background:isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)',
                        color:isLight ? '#3730A3' : '#C7D2FE', letterSpacing:'.04em', textTransform:'uppercase',
                      }}>DEFAULT</span>}
                    </div>
                    <div style={{ textAlign:'right', fontSize:13, color:t.text, fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{fmtCOP(p.precio)}</div>
                    <div style={{ textAlign:'center', fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{p.iva}%</div>
                    <div style={{ textAlign:'right', fontSize:13, color:t.text, fontVariantNumeric:'tabular-nums', fontWeight:600 }}>{fmtCOP(p.final)}</div>
                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                      <Icon name="more-horizontal" size={14} color={t.muted}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modificadores */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'18px 20px' }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:6 }}>Modificadores vinculados</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Permiten al cliente personalizar este producto al ordenar.</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                <Chip t={t} label="Término de cocción"/>
                <Chip t={t} label="Acompañamiento"/>
                <button style={{
                  padding:'5px 10px', borderRadius:7,
                  background:'transparent', border:`1px dashed ${t.border}`,
                  color:t.muted, cursor:'pointer', fontFamily:ff,
                  fontSize:12, fontWeight:500,
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <Icon name="plus" size={11} color={t.muted}/>
                  Agregar modificador
                </button>
              </div>
            </div>

            {/* Inventario */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                <Switch t={t} on={true}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Vincular ficha técnica</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Descuenta automáticamente los ingredientes al vender.</div>
                </div>
              </div>
              {/* Preview ficha */}
              <div style={{
                padding:'12px 14px', borderRadius:9,
                background: isLight ? '#F0FDF4' : 'rgba(16,185,129,.10)',
                border:`1px solid ${isLight ? '#BBF7D0' : 'rgba(16,185,129,.4)'}`,
                display:'flex', alignItems:'center', gap:12,
              }}>
                <div style={{
                  width:36, height:36, borderRadius:9,
                  background:DST.success, color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <Icon name="clipboard-list" size={17} color="#fff"/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:t.text }}>Ficha: Ajiaco Bogotano</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>
                    Costo: <span style={{ color:t.text, fontWeight:600 }}>{fmtCOP(6200)}</span> · Margen: <span style={{ color:DST.success, fontWeight:600 }}>77%</span>
                  </div>
                </div>
                <button style={{
                  padding:'5px 10px', borderRadius:6, background:t.bg,
                  border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff,
                  fontSize:11, color:t.text, fontWeight:500,
                  display:'flex', alignItems:'center', gap:4,
                }}>
                  Editar ficha
                  <Icon name="arrow-right" size={11} color={t.muted}/>
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha — sticky */}
          <div style={{ position:'sticky', top:22, display:'flex', flexDirection:'column', gap:14 }}>
            {/* Estado */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'16px 18px' }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:12 }}>Estado</div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Switch t={t} on={true}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Producto activo</div>
                  <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Visible para vender</div>
                </div>
                <span style={{
                  padding:'2px 8px', borderRadius:11,
                  background:DST.success, color:'#fff',
                  fontSize:10, fontWeight:700, letterSpacing:'.03em',
                }}>EN VENTA</span>
              </div>
            </div>

            {/* Visible en canales */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'16px 18px' }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:6 }}>Visible en canales</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:8 }}>Selecciona dónde se muestra este producto.</div>
              {CANALES_VISIBLE.map(c => <CheckRow key={c.l} t={t} label={c.l} on={c.on} icon={c.icon}/>)}
            </div>

            {/* Disponibilidad por sucursal */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'16px 18px' }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:6 }}>Disponibilidad</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:8 }}>Por sucursal.</div>
              {SUCURSALES_DISP.map(s => <CheckRow key={s.l} t={t} label={s.l} on={s.on} icon="store"/>)}
            </div>
          </div>
        </div>

        {/* Footer sticky */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'14px 24px', background:t.bg, borderTop:`1px solid ${t.border}`,
          display:'flex', alignItems:'center', gap:12,
        }}>
          <span style={{ fontSize:11, color:t.muted, fontFamily:ff }}>
            <Icon name="circle" size={7} color={DST.warning} style={{ marginRight:5 }}/>
            Cambios sin guardar
          </span>
          <div style={{ flex:1 }}/>
          <BOGhostBtn t={t}>Descartar</BOGhostBtn>
          <BOPrimaryBtn t={t} icon="save">Guardar producto</BOPrimaryBtn>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB9Producto });
