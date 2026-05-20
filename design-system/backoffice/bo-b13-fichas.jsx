// bo-b13-fichas.jsx — Fichas técnicas (recetas)

const FICHAS = [
  { id:'paisa',    color:'#F97316', nombre:'Bandeja Paisa',       costo:8400,  precio:32000, ingredientes:9 },
  { id:'ajiaco',   color:'#FBBF24', nombre:'Ajiaco Bogotano',     costo:6200,  precio:28000, ingredientes:6, active:true },
  { id:'sancocho', color:'#10B981', nombre:'Sancocho de Gallina', costo:7100,  precio:25000, ingredientes:8 },
  { id:'lomo',     color:'#3B82F6', nombre:'Lomo al Trapo',       costo:15300, precio:45000, ingredientes:5 },
  { id:'trucha',   color:'#EF4444', nombre:'Trucha en Salsa',     costo:9800,  precio:38000, ingredientes:7 },
  { id:'mojarra',  color:'#A855F7', nombre:'Mojarra Frita',       costo:11200, precio:35000, ingredientes:5 },
];

const INGREDIENTES_AJIACO = [
  { ing:'Pollo entero',   cat:'Proteína', cant:0.3,  unidad:'kg',  costoUnit:12000, costoTotal:3600 },
  { ing:'Papa criolla',   cat:'Vegetal',  cant:0.2,  unidad:'kg',  costoUnit:3000,  costoTotal:600 },
  { ing:'Mazorca',        cat:'Vegetal',  cant:0.5,  unidad:'unid',costoUnit:800,   costoTotal:400 },
  { ing:'Guascas',        cat:'Especia',  cant:0.01, unidad:'kg',  costoUnit:50000, costoTotal:500 },
  { ing:'Crema de leche', cat:'Lácteo',   cant:0.05, unidad:'lt',  costoUnit:8000,  costoTotal:400 },
  { ing:'Cilantro',       cat:'Especia',  cant:0.02, unidad:'kg',  costoUnit:5000,  costoTotal:100 },
];

function FichaListItem({ t, f }) {
  const isActive = f.active;
  return (
    <button style={{
      width:'100%', padding:'10px 12px', borderRadius:9,
      background: isActive ? (t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)') : 'transparent',
      border:`1px solid ${isActive ? t.accent : 'transparent'}`,
      cursor:'pointer', fontFamily:ff, textAlign:'left',
      display:'flex', alignItems:'center', gap:11, marginBottom:4,
      position:'relative',
    }}>
      <div style={{
        width:32, height:32, borderRadius:7,
        background:f.color, color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name="utensils" size={15} color="#fff"/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:13, fontWeight:600, color:t.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.nombre}</span>
          {isActive && <Icon name="check" size={11} color={t.accent} strokeWidth={3}/>}
        </div>
        <div style={{ fontSize:11, color:t.muted, marginTop:2, fontVariantNumeric:'tabular-nums' }}>
          Costo: <span style={{ color:t.text, fontWeight:500 }}>{fmtCOP(f.costo)}</span> · {f.ingredientes} ing.
        </div>
      </div>
    </button>
  );
}

function MetricCard({ t, label, value, color, sub }) {
  return (
    <div style={{
      flex:1, padding:'14px 16px',
      background:t.bg, border:`1px solid ${t.border}`, borderRadius:10,
    }}>
      <div style={{ fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700, color: color || t.text, fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function BOB13Fichas({ t }) {
  const isLight = t === DST.light;
  const totalCosto = INGREDIENTES_AJIACO.reduce((acc, i) => acc + i.costoTotal, 0);
  const precio = 28000;
  const margen = ((precio - totalCosto) / precio * 100).toFixed(1);

  return (
    <BackofficeShell t={t} active="inventario" breadcrumb={['Gestión', 'Inventario', 'Fichas técnicas']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Fichas técnicas"
          subtitle="Recetas que descuentan ingredientes automáticamente al vender"
          actions={<BOPrimaryBtn t={t} icon="plus">Nueva ficha</BOPrimaryBtn>}
        />

        <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
          {/* Lista izq */}
          <div style={{ width:300, flexShrink:0 }}>
            <BOToolbar t={t} search="Buscar receta..."/>
            <div style={{
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
              padding:'8px 8px',
            }}>
              {FICHAS.map(f => <FichaListItem key={f.id} t={t} f={f}/>)}
              <button style={{
                width:'100%', padding:'12px',
                background:'transparent', border:`1px dashed ${t.border}`,
                borderRadius:9, cursor:'pointer', fontFamily:ff,
                color:t.muted, fontSize:12, fontWeight:500,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                marginTop:4,
              }}>
                <Icon name="plus" size={12} color={t.muted}/>
                Nueva ficha técnica
              </button>
            </div>
          </div>

          {/* Detalle der */}
          <div style={{
            flex:1, background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
            overflow:'hidden',
          }}>
            {/* Header */}
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14, marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{
                    width:48, height:48, borderRadius:11,
                    background:'#FBBF24', color:'#fff',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    <Icon name="utensils" size={22} color="#fff"/>
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:18, fontWeight:700, color:t.text }}>Ajiaco Bogotano</span>
                      <span style={{
                        padding:'2px 8px', borderRadius:11,
                        background: isLight ? '#DBEAFE' : 'rgba(59,130,246,.18)',
                        color: isLight ? '#1E40AF' : '#93C5FD',
                        fontSize:10, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
                      }}>Platos fuertes</span>
                    </div>
                    <div style={{ fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>
                      <Icon name="link" size={11} color={t.muted} style={{ verticalAlign:'middle', marginRight:4 }}/>
                      Vinculado a producto · SKU AJB-001
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <BOGhostBtn t={t} icon="pencil">Editar</BOGhostBtn>
                  <BOPrimaryBtn t={t} icon="save">Guardar ficha</BOPrimaryBtn>
                </div>
              </div>

              {/* Métricas */}
              <div style={{ display:'flex', gap:12, marginBottom:12 }}>
                <MetricCard t={t} label="Costo total"   value={fmtCOP(totalCosto)} sub={`${INGREDIENTES_AJIACO.length} ingredientes`}/>
                <MetricCard t={t} label="Precio venta"  value={fmtCOP(precio)} sub="Lista Carta · IVA incluido"/>
                <MetricCard t={t} label="Margen bruto"  value={`${margen}%`} color={DST.success} sub={`Ganancia ${fmtCOP(precio - totalCosto)}`}/>
              </div>

              {/* Barra margen */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Composición del precio</span>
                  <span style={{ fontSize:11, color:t.muted }}>Costo {Math.round(totalCosto/precio*100)}% · Margen {margen}%</span>
                </div>
                <div style={{
                  height:10, borderRadius:5, background:t.alt, overflow:'hidden', display:'flex',
                }}>
                  <div style={{
                    height:'100%', width:`${totalCosto/precio*100}%`,
                    background:DST.error,
                  }}/>
                  <div style={{
                    height:'100%', flex:1,
                    background:DST.success,
                  }}/>
                </div>
              </div>
            </div>

            {/* Tabla ingredientes */}
            <div>
              <div style={{
                display:'grid',
                gridTemplateColumns:'30px 1.6fr 0.8fr 0.7fr 1fr 1fr 30px',
                padding:'11px 22px', background:t.alt, borderBottom:`1px solid ${t.border}`,
                fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase',
              }}>
                <div></div>
                <div>Ingrediente</div>
                <div style={{ textAlign:'right' }}>Cantidad</div>
                <div>Unidad</div>
                <div style={{ textAlign:'right' }}>Costo unit.</div>
                <div style={{ textAlign:'right' }}>Costo total</div>
                <div></div>
              </div>
              {INGREDIENTES_AJIACO.map((it, i) => (
                <div key={i} style={{
                  display:'grid',
                  gridTemplateColumns:'30px 1.6fr 0.8fr 0.7fr 1fr 1fr 30px',
                  padding:'11px 22px', alignItems:'center',
                  borderBottom: `1px solid ${t.border}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', cursor:'grab' }}>
                    <Icon name="grip-vertical" size={13} color={t.muted}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{it.ing}</span>
                    <CatChip t={t} cat={it.cat}/>
                  </div>
                  <div style={{ textAlign:'right', fontSize:13, color:t.text, fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{it.cant}</div>
                  <div style={{ fontSize:12, color:t.muted }}>{it.unidad}</div>
                  <div style={{ textAlign:'right', fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(it.costoUnit)}/{it.unidad}</div>
                  <div style={{ textAlign:'right', fontSize:13, color:t.text, fontVariantNumeric:'tabular-nums', fontWeight:600 }}>{fmtCOP(it.costoTotal)}</div>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <Icon name="x" size={13} color={t.muted}/>
                  </div>
                </div>
              ))}
              {/* Fila agregar */}
              <div style={{
                padding:'12px 22px', display:'flex', alignItems:'center', gap:10,
                background: isLight ? 'rgba(244,244,245,.4)' : 'rgba(24,24,27,.4)',
                color:t.muted, fontSize:12, cursor:'pointer', fontFamily:ff,
                borderBottom:`1px solid ${t.border}`,
              }}>
                <Icon name="plus" size={13} color={t.muted}/>
                Agregar ingrediente
              </div>
              {/* Total */}
              <div style={{
                padding:'14px 22px', display:'flex', alignItems:'center', justifyContent:'space-between',
                background:t.alt,
              }}>
                <span style={{ fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>Total ficha</span>
                <span style={{ fontSize:18, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(totalCosto)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB13Fichas, MetricCard });
