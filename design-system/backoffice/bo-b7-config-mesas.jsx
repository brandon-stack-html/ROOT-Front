// bo-b7-config-mesas.jsx — Configuración: editor visual de salas y mesas

const SALAS = [
  { id:'salon',   icon:'home',   label:'Salón Principal', count:12, suffix:'mesas',   active:true },
  { id:'terraza', icon:'leaf',   label:'Terraza',         count:8,  suffix:'mesas' },
  { id:'barra',   icon:'beer',   label:'Barra',           count:6,  suffix:'puestos' },
];

// Mesas del Salón Principal — coordenadas en el viewBox 600x540
const MESAS = [
  { id:1,  shape:'square', x:50,  y:50,  w:70,  h:70,  cap:4 },
  { id:2,  shape:'square', x:160, y:50,  w:70,  h:70,  cap:4 },
  { id:3,  shape:'square', x:280, y:80,  w:70,  h:70,  cap:4 },
  { id:4,  shape:'square', x:50,  y:170, w:70,  h:70,  cap:4 },
  { id:5,  shape:'square', x:170, y:185, w:70,  h:70,  cap:4, selected:true },
  { id:6,  shape:'square', x:300, y:200, w:70,  h:70,  cap:4 },
  { id:7,  shape:'rect',   x:430, y:60,  w:130, h:60,  cap:8 },
  { id:8,  shape:'rect',   x:430, y:180, w:130, h:60,  cap:6 },
  { id:9,  shape:'circle', x:90,  y:340, r:34,         cap:2 },
  { id:10, shape:'circle', x:230, y:380, r:34,         cap:3 },
  { id:11, shape:'circle', x:380, y:380, r:38,         cap:3 },
  { id:12, shape:'square', x:480, y:330, w:80,  h:80,  cap:4 },
];

function CanvasMesa({ t, m, isLight }) {
  const fill = isLight ? '#FEF3C7' : '#2C2418';
  const stroke = isLight ? '#D6D3D1' : '#44403C';
  const labelColor = isLight ? '#9A3412' : '#FED7AA';
  const isSel = m.selected;
  const selStroke = t.accent;

  if (m.shape === 'circle') {
    return (
      <g>
        <circle cx={m.x} cy={m.y} r={m.r}
          fill={fill}
          stroke={isSel ? selStroke : stroke}
          strokeWidth={isSel ? 2.5 : 1.5}/>
        <text x={m.x} y={m.y + 5} textAnchor="middle"
          fontSize="14" fontWeight="700" fill={labelColor} fontFamily={ff}>
          {m.id}
        </text>
        {isSel && <CanvasHandles cx={m.x} cy={m.y} w={m.r * 2} h={m.r * 2} accent={selStroke}/>}
      </g>
    );
  }

  // rect / square
  const rx = m.shape === 'rect' ? 8 : 7;
  return (
    <g>
      <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={rx}
        fill={fill}
        stroke={isSel ? selStroke : stroke}
        strokeWidth={isSel ? 2.5 : 1.5}/>
      <text x={m.x + m.w / 2} y={m.y + m.h / 2 + 5} textAnchor="middle"
        fontSize="14" fontWeight="700" fill={labelColor} fontFamily={ff}>
        {m.id}
      </text>
      {isSel && <CanvasHandles cx={m.x + m.w / 2} cy={m.y + m.h / 2} w={m.w} h={m.h} accent={selStroke}/>}
    </g>
  );
}

function CanvasHandles({ cx, cy, w, h, accent }) {
  const half = 5;
  const hx = w / 2 + 2;
  const hy = h / 2 + 2;
  const corners = [
    { x: cx - hx, y: cy - hy },
    { x: cx + hx, y: cy - hy },
    { x: cx - hx, y: cy + hy },
    { x: cx + hx, y: cy + hy },
  ];
  return (
    <g>
      {corners.map((c, i) => (
        <rect key={i} x={c.x - half} y={c.y - half} width={half * 2} height={half * 2}
          rx={2} fill="#fff" stroke={accent} strokeWidth={1.8}/>
      ))}
    </g>
  );
}

function CanvasGrid({ isLight, themeKey }) {
  const stroke = isLight ? '#E4E4E7' : '#27272A';
  const strokeMajor = isLight ? '#D4D4D8' : '#3F3F46';
  const minorId = `grid-minor-${themeKey}`;
  const majorId = `grid-major-${themeKey}`;
  return (
    <defs>
      <pattern id={minorId} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.6"/>
      </pattern>
      <pattern id={majorId} width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill={`url(#${minorId})`}/>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke={strokeMajor} strokeWidth="0.7" opacity="0.7"/>
      </pattern>
    </defs>
  );
}

function ToolBtn({ t, icon, label, primary }) {
  return (
    <button style={{
      padding: label ? '7px 12px' : '7px 9px',
      borderRadius:7,
      background: primary ? t.accent : t.bg,
      border: primary ? 'none' : `1px solid ${t.border}`,
      color: primary ? '#fff' : t.text,
      cursor:'pointer', fontFamily:ff,
      display:'flex', alignItems:'center', gap:6,
      fontSize:12, fontWeight: primary ? 600 : 500,
    }}>
      {icon && <Icon name={icon} size={13} color={primary ? '#fff' : t.muted} strokeWidth={primary ? 2.2 : 1.8}/>}
      {label}
    </button>
  );
}

function ShapeRadio({ t, icon, label, active }) {
  return (
    <button style={{
      flex:1, padding:'10px 6px',
      background: active ? (t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.18)') : t.bg,
      border:`1px solid ${active ? t.accent : t.border}`,
      borderRadius:8, cursor:'pointer', fontFamily:ff,
      display:'flex', flexDirection:'column', alignItems:'center', gap:6,
      color: active ? t.accent : t.muted,
      fontSize:11, fontWeight: active ? 600 : 500,
    }}>
      <Icon name={icon} size={18} color={active ? t.accent : t.muted}/>
      {label}
    </button>
  );
}

function BOB7ConfigMesas({ t }) {
  const isLight = t === DST.light;
  return (
    <BackofficeShell t={t} active="config" breadcrumb={['Configuración', 'Salas y mesas']}>
      <div style={{ padding:'22px 24px 24px', height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Configuración</div>
          <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>Diseña la disposición de las mesas en cada sala.</div>
        </div>

        <ConfigTabs t={t} active="mesas"/>

        {/* 3 paneles */}
        <div style={{ flex:1, display:'flex', gap:14, minHeight:0 }}>
          {/* Panel izquierdo — salas */}
          <div style={{
            width:220, flexShrink:0,
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
            padding:'14px 12px', display:'flex', flexDirection:'column',
          }}>
            <div style={{
              fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em',
              textTransform:'uppercase', padding:'4px 8px 10px',
            }}>Salas</div>
            <div style={{ flex:1 }}>
              {SALAS.map(s => {
                const isActive = s.active;
                return (
                  <button key={s.id} style={{
                    width:'100%', padding:'10px 10px', borderRadius:8, border:'none', cursor:'pointer',
                    background: isActive ? (isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)') : 'transparent',
                    color: isActive ? t.text : t.muted,
                    display:'flex', alignItems:'center', gap:10, marginBottom:3,
                    fontFamily:ff, fontSize:12, fontWeight: isActive ? 600 : 500,
                    textAlign:'left',
                    position:'relative',
                  }}>
                    {isActive && <span style={{ position:'absolute', left:-12, top:'50%', transform:'translateY(-50%)', width:3, height:18, borderRadius:2, background:t.accent }}/>}
                    <Icon name={s.icon} size={15} color={isActive ? t.accent : t.muted}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight: isActive ? 600 : 500 }}>{s.label}</div>
                      <div style={{ fontSize:10, color:t.muted, marginTop:1 }}>{s.count} {s.suffix}</div>
                    </div>
                    {isActive && <Icon name="check" size={11} color={t.accent} strokeWidth={3}/>}
                  </button>
                );
              })}
            </div>
            <button style={{
              width:'100%', padding:'10px',
              background:'transparent', border:`1px dashed ${t.border}`,
              borderRadius:8, cursor:'pointer', fontFamily:ff,
              color:t.muted, fontSize:12, fontWeight:500,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>
              <Icon name="plus" size={12} color={t.muted}/>
              Nueva sala
            </button>
          </div>

          {/* Panel central — canvas */}
          <div style={{
            flex:1, background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
            display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0,
          }}>
            {/* Toolbar canvas */}
            <div style={{
              padding:'10px 14px', borderBottom:`1px solid ${t.border}`,
              display:'flex', alignItems:'center', gap:8, flexShrink:0,
              background:t.alt,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:2, padding:2, background:t.bg, border:`1px solid ${t.border}`, borderRadius:7 }}>
                <button style={{ width:28, height:26, borderRadius:5, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name="minus" size={13} color={t.muted}/>
                </button>
                <div style={{ minWidth:42, textAlign:'center', fontSize:11, fontWeight:600, color:t.text, fontVariantNumeric:'tabular-nums' }}>100%</div>
                <button style={{ width:28, height:26, borderRadius:5, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon name="plus" size={13} color={t.muted}/>
                </button>
              </div>

              <div style={{ width:1, height:22, background:t.border }}/>

              <ToolBtn t={t} icon="undo-2"/>
              <ToolBtn t={t} icon="redo-2"/>

              <div style={{ width:1, height:22, background:t.border }}/>

              <ToolBtn t={t} icon="grid-3x3" label="Cuadrícula"/>
              <ToolBtn t={t} icon="ruler" label="Guías"/>

              <div style={{ flex:1 }}/>

              <span style={{ fontSize:11, color:t.muted, fontWeight:500 }}>
                <Icon name="circle" size={7} color={DST.warning} style={{ marginRight:5 }}/>
                Cambios sin guardar
              </span>

              <ToolBtn t={t} icon="save" label="Guardar disposición" primary/>
            </div>

            {/* Canvas SVG */}
            <div style={{ flex:1, overflow:'hidden', background:isLight ? '#FAFAF9' : '#0F0E0C', position:'relative' }}>
              <svg viewBox="0 0 600 540" preserveAspectRatio="xMidYMid meet" style={{ width:'100%', height:'100%', display:'block' }}>
                <CanvasGrid isLight={isLight} themeKey={isLight ? 'l' : 'd'}/>
                <rect x="0" y="0" width="600" height="540" fill={`url(#grid-major-${isLight ? 'l' : 'd'})`}/>

                {/* Etiqueta del salón al fondo */}
                <text x="20" y="525" fontSize="10" fontWeight="600"
                  fill={isLight ? '#A8A29E' : '#57534E'}
                  fontFamily={ff}
                  letterSpacing="0.08em">
                  SALÓN PRINCIPAL · ZONA INTERIOR
                </text>

                {/* Mesas */}
                {MESAS.map(m => <CanvasMesa key={m.id} t={t} m={m} isLight={isLight}/>)}
              </svg>

              {/* Mini-mapa de leyenda */}
              <div style={{
                position:'absolute', bottom:14, right:14,
                background: isLight ? 'rgba(255,255,255,.92)' : 'rgba(24,24,27,.92)',
                backdropFilter:'blur(6px)',
                border:`1px solid ${t.border}`, borderRadius:8,
                padding:'8px 12px', display:'flex', flexDirection:'column', gap:6,
                fontSize:11, color:t.muted,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ width:11, height:11, borderRadius:2, background:'#FEF3C7', border:'1px solid #D6D3D1' }}/>
                  Mesas (12)
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ width:11, height:11, borderRadius:2, background:'transparent', border:`1.5px solid ${t.accent}`, boxShadow:`0 0 0 2px ${isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)'}` }}/>
                  Seleccionada
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho — propiedades */}
          <div style={{
            width:260, flexShrink:0,
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:11,
            display:'flex', flexDirection:'column', overflow:'hidden',
          }}>
            <div style={{
              padding:'14px 16px', borderBottom:`1px solid ${t.border}`,
              display:'flex', alignItems:'center', gap:10,
            }}>
              <div style={{
                width:32, height:32, borderRadius:7, background:t.accent,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon name="square" size={15} color="#fff" strokeWidth={2.2}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:t.text }}>Mesa 5</div>
                <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>Salón Principal · Cuadrada</div>
              </div>
            </div>

            <div style={{ flex:1, overflow:'auto', padding:'14px 16px' }}>
              {/* Propiedades */}
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:18 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:t.muted, display:'block', marginBottom:5 }}>Número / nombre</label>
                  <div style={{
                    background:t.alt, border:`1px solid ${t.border}`, borderRadius:7,
                    padding:'8px 10px', fontSize:13, color:t.text, fontWeight:500,
                  }}>5</div>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:t.muted, display:'block', marginBottom:5 }}>Capacidad</label>
                  <div style={{
                    background:t.alt, border:`1px solid ${t.border}`, borderRadius:7,
                    padding:'8px 10px', fontSize:13, color:t.text, fontWeight:500,
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                  }}>
                    <span>4 personas</span>
                    <Icon name="users" size={13} color={t.muted}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:t.muted, display:'block', marginBottom:7 }}>Forma</label>
                  <div style={{ display:'flex', gap:6 }}>
                    <ShapeRadio t={t} icon="square" label="Cuadrada" active/>
                    <ShapeRadio t={t} icon="rectangle-horizontal" label="Rectangular"/>
                    <ShapeRadio t={t} icon="circle" label="Redonda"/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:t.muted, display:'block', marginBottom:5 }}>Sala</label>
                  <div style={{
                    background: t === DST.light ? '#F4F4F5' : '#27272A',
                    border:`1px solid ${t.border}`, borderRadius:7,
                    padding:'8px 10px', fontSize:13, color:t.muted,
                    display:'flex', alignItems:'center', gap:6,
                  }}>
                    <Icon name="lock" size={11} color={t.muted}/>
                    Salón Principal
                  </div>
                </div>
              </div>

              {/* Separador con título */}
              <div style={{
                fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.08em',
                textTransform:'uppercase', marginBottom:10,
                paddingTop:14, borderTop:`1px solid ${t.border}`,
              }}>Agregar mesa al plano</div>
              <div style={{ display:'flex', gap:6, marginBottom:18 }}>
                <ShapeRadio t={t} icon="square" label="Cuadrada"/>
                <ShapeRadio t={t} icon="rectangle-horizontal" label="Rectangular"/>
                <ShapeRadio t={t} icon="circle" label="Redonda"/>
              </div>
            </div>

            {/* Footer destructivo */}
            <div style={{ padding:'12px 16px', borderTop:`1px solid ${t.border}` }}>
              <button style={{
                width:'100%', padding:'9px 12px',
                background:'transparent',
                border:`1px solid ${t === DST.light ? '#FECACA' : '#7F1D1D'}`,
                borderRadius:8, cursor:'pointer', fontFamily:ff,
                color:DST.error, fontSize:12, fontWeight:600,
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              }}>
                <Icon name="trash-2" size={13} color={DST.error}/>
                Eliminar Mesa 5
              </button>
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB7ConfigMesas, MESAS });
