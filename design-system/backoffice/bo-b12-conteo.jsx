// bo-b12-conteo.jsx — Conteo de inventario en curso

const CONTEO_ITEMS = [
  { ingrediente:'Papa criolla',   cat:'Vegetal',  contado:'12.5 kg',  unidad:'kg',   estado:'contado' },
  { ingrediente:'Pollo entero',   cat:'Proteína', contado:'8 unid',   unidad:'unid', estado:'contado' },
  { ingrediente:'Guascas',        cat:'Especia',  contado:'0.2 kg',   unidad:'kg',   estado:'contado' },
  { ingrediente:'Crema de leche', cat:'Lácteo',   contado:'6 lt',     unidad:'lt',   estado:'contado' },
  { ingrediente:'Mazorca',        cat:'Vegetal',  contado:'',         unidad:'unid', estado:'pendiente' },
  { ingrediente:'Cilantro',       cat:'Especia',  contado:'',         unidad:'kg',   estado:'pendiente' },
  { ingrediente:'Aguacate Hass',  cat:'Vegetal',  contado:'14 unid',  unidad:'unid', estado:'contado' },
  { ingrediente:'Limón Tahití',   cat:'Fruta',    contado:'3.2 kg',   unidad:'kg',   estado:'contado' },
];

function CatChip({ t, cat }) {
  const palette = {
    'Vegetal':  { l:'#DCFCE7', d:'rgba(16,185,129,.18)', txtL:'#14532D', txtD:'#86EFAC' },
    'Proteína': { l:'#FECACA', d:'rgba(239,68,68,.18)',  txtL:'#7F1D1D', txtD:'#FCA5A5' },
    'Especia':  { l:'#FEF3C7', d:'rgba(245,158,11,.18)', txtL:'#92400E', txtD:'#FDE68A' },
    'Lácteo':   { l:'#DBEAFE', d:'rgba(59,130,246,.18)', txtL:'#1E40AF', txtD:'#93C5FD' },
    'Fruta':    { l:'#FCE7F3', d:'rgba(236,72,153,.18)', txtL:'#9D174D', txtD:'#FBCFE8' },
  };
  const p = palette[cat] || palette['Vegetal'];
  const isLight = t === DST.light;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'2px 8px', borderRadius:9,
      fontSize:11, fontWeight:600,
      background: isLight ? p.l : p.d,
      color: isLight ? p.txtL : p.txtD,
    }}>{cat}</span>
  );
}

function BOB12Conteo({ t }) {
  const isLight = t === DST.light;
  const totalItems = 86;
  const contados = 52;
  const pct = Math.round((contados / totalItems) * 100);

  return (
    <BackofficeShell t={t} active="inventario" breadcrumb={['Gestión', 'Inventario', 'Conteo #003']}>
      <div style={{ padding:'22px 24px 28px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, gap:24 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{
                padding:'3px 9px', borderRadius:5, background:DST.warning, color:'#fff',
                fontSize:10, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase',
              }}>EN CURSO</span>
              <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Conteo #003</div>
            </div>
            <div style={{ fontSize:12, color:t.muted }}>Iniciado el 15 nov 2026 a las 08:00 · por Juan Camilo Restrepo · Sede Norte</div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            {/* Switch modo ciego */}
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'8px 14px', borderRadius:9,
              background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.12)',
              border:`1px solid ${isLight ? '#FDE68A' : 'rgba(245,158,11,.4)'}`,
            }}>
              <Icon name="eye-off" size={14} color={DST.warning}/>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color: isLight ? '#92400E' : '#FDE68A' }}>Modo ciego</div>
                <div style={{ fontSize:10, color: isLight ? '#92400E' : '#FCD34D', opacity:.85 }}>Stock teórico oculto</div>
              </div>
              <Switch t={t} on={true}/>
            </div>

            <BOGhostBtn t={t} icon="pause">Pausar</BOGhostBtn>
            <BOPrimaryBtn t={t} icon="check">Finalizar conteo</BOPrimaryBtn>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
          padding:'14px 18px', marginBottom:16,
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text }}>
              {contados} de {totalItems} ingredientes contados
            </div>
            <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>
              <span style={{ color:t.text, fontWeight:600 }}>{pct}%</span> · faltan {totalItems - contados}
            </div>
          </div>
          <div style={{
            height:8, borderRadius:4, background:t.alt, overflow:'hidden',
          }}>
            <div style={{
              height:'100%', width:`${pct}%`,
              background:`linear-gradient(90deg, ${DST.success}, ${t.accent})`,
              borderRadius:4, transition:'width .3s',
            }}/>
          </div>
        </div>

        {/* Toolbar */}
        <BOToolbar t={t}
          search="Buscar ingrediente..."
          filters={[
            { label:'Categoría', value:'Todos' },
            { label:'Estado',    value:'Pendientes' },
          ]}
          right={
            <BOGhostBtn t={t} icon="download">Exportar plantilla</BOGhostBtn>
          }
        />

        {/* Tabla */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1.6fr 0.9fr 1fr 1.3fr 0.9fr 1.2fr',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Ingrediente</div>
            <div>Categoría</div>
            <div>Stock teórico</div>
            <div>Stock contado</div>
            <div style={{ textAlign:'center' }}>Estado</div>
            <div>Notas</div>
          </div>

          {CONTEO_ITEMS.map((it, i) => {
            const isPending = it.estado === 'pendiente';
            return (
              <div key={i} style={{
                display:'grid',
                gridTemplateColumns:'1.6fr 0.9fr 1fr 1.3fr 0.9fr 1.2fr',
                padding:'13px 18px', alignItems:'center',
                borderBottom: i < CONTEO_ITEMS.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Icon name="package" size={14} color={t.muted}/>
                  <span style={{ fontSize:13, fontWeight:500, color:t.text }}>{it.ingrediente}</span>
                </div>
                <div><CatChip t={t} cat={it.cat}/></div>
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  fontSize:12, color:t.muted, fontStyle:'italic',
                }}>
                  <Icon name="eye-off" size={12} color={t.muted}/>
                  Oculto
                </div>
                {/* Input contado */}
                <div>
                  <div style={{
                    display:'flex', alignItems:'center',
                    background: isPending ? (isLight ? '#FFFBEB' : 'rgba(245,158,11,.08)') : t.bg,
                    border:`1px solid ${isPending ? (isLight ? '#FCD34D' : 'rgba(245,158,11,.5)') : t.border}`,
                    borderRadius:7, padding:'0 10px', height:32, gap:6, maxWidth:160,
                  }}>
                    <input readOnly value={it.contado} placeholder={`Ingresa ${it.unidad}`} style={{
                      flex:1, border:'none', outline:'none', background:'transparent',
                      fontSize:13, fontFamily:ff, color: it.contado ? t.text : t.muted,
                      fontWeight:500, fontVariantNumeric:'tabular-nums', minWidth:0,
                    }}/>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  {isPending ? (
                    <span style={{
                      padding:'3px 9px', borderRadius:11,
                      background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)',
                      color: isLight ? '#92400E' : '#FDE68A',
                      fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5,
                    }}>
                      <Icon name="clock" size={10} color={isLight ? '#92400E' : '#FDE68A'}/>
                      Pendiente
                    </span>
                  ) : (
                    <span style={{
                      padding:'3px 9px', borderRadius:11,
                      background: isLight ? '#DCFCE7' : 'rgba(16,185,129,.18)',
                      color: isLight ? '#14532D' : '#86EFAC',
                      fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5,
                    }}>
                      <Icon name="check" size={10} color={isLight ? '#14532D' : '#86EFAC'} strokeWidth={3}/>
                      Contado
                    </span>
                  )}
                </div>
                <div>
                  <button style={{
                    padding:'5px 9px', borderRadius:6,
                    background:'transparent', border:`1px dashed ${t.border}`,
                    color:t.muted, cursor:'pointer', fontFamily:ff,
                    fontSize:11, fontWeight:500,
                    display:'flex', alignItems:'center', gap:5,
                  }}>
                    <Icon name="message-square" size={11} color={t.muted}/>
                    Agregar nota
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div style={{
          marginTop:14, padding:'10px 14px', borderRadius:8,
          background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.10)',
          border:`1px solid ${isLight ? '#FDE68A' : 'rgba(245,158,11,.4)'}`,
          display:'flex', alignItems:'center', gap:10, fontFamily:ff,
        }}>
          <Icon name="eye-off" size={14} color={DST.warning}/>
          <span style={{ fontSize:12, color: isLight ? '#92400E' : '#FDE68A' }}>
            Modo ciego activo: el stock teórico se ocultará hasta finalizar el conteo. Las diferencias se calcularán al cerrar.
          </span>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB12Conteo });
