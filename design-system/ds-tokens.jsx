// ds-tokens.jsx — Tokens y paneles fundacionales
// Sistema de Diseño: Inventario POS SaaS

const DST = {
  light: { bg:'#FAFAFA', alt:'#F4F4F5', text:'#0A0A0A', muted:'#71717A', accent:'#4F46E5', aHover:'#4338CA', border:'#E4E4E7' },
  dark:  { bg:'#0A0A0A', alt:'#18181B', text:'#FAFAFA', muted:'#A1A1AA', accent:'#4F46E5', aHover:'#6366F1', border:'#27272A' },
  success:'#10B981', error:'#EF4444', warning:'#F59E0B', info:'#3B82F6',
};

const ff = 'Inter, "Helvetica Neue", sans-serif';

const overline = (color) => ({
  fontSize:10, fontWeight:600, letterSpacing:'.08em',
  textTransform:'uppercase', color, marginBottom:14, fontFamily:ff, display:'block',
});

// ── Dual Panel (claro izquierda / oscuro derecha) ──────────────────────────────
function DualPanel({ left, right }) {
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:ff, overflow:'hidden' }}>
      <div style={{ flex:1, background:'#FAFAFA', padding:'24px 26px', overflow:'hidden', minWidth:0 }}>
        <div style={overline('#71717A')}>Modo claro</div>
        {left}
      </div>
      <div style={{ width:1, background:'#E4E4E7', flexShrink:0 }}/>
      <div style={{ flex:1, background:'#0A0A0A', padding:'24px 26px', overflow:'hidden', minWidth:0 }}>
        <div style={overline('#A1A1AA')}>Modo oscuro</div>
        {right}
      </div>
    </div>
  );
}

// ── Color Swatch ───────────────────────────────────────────────────────────────
function Swatch({ color, name, hex, hasBorder, textDark }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ width:76, height:48, borderRadius:8, background:color, border: hasBorder ? '1px solid #D4D4D8' : 'none', marginBottom:6 }}/>
      <div style={{ fontSize:11, fontWeight:500, color: textDark ? '#0A0A0A' : '#FAFAFA', lineHeight:1.3, maxWidth:76, marginBottom:2 }}>{name}</div>
      <div style={{ fontSize:10, color: textDark ? '#71717A' : '#A1A1AA', fontFamily:'monospace' }}>{hex}</div>
    </div>
  );
}

// ── Panel: Paleta de Colores ───────────────────────────────────────────────────
function ColorTokensPanel() {
  const lightRows = [
    { label:'Fondos', swatches:[
      { color:'#FAFAFA', name:'Fondo principal', hex:'#FAFAFA', hasBorder:true, textDark:true },
      { color:'#F4F4F5', name:'Fondo secundario', hex:'#F4F4F5', hasBorder:true, textDark:true },
    ]},
    { label:'Texto', swatches:[
      { color:'#0A0A0A', name:'Texto principal', hex:'#0A0A0A', textDark:true },
      { color:'#71717A', name:'Texto secundario', hex:'#71717A', textDark:true },
    ]},
    { label:'Acento', swatches:[
      { color:'#4F46E5', name:'Primario', hex:'#4F46E5', textDark:true },
      { color:'#4338CA', name:'Hover', hex:'#4338CA', textDark:true },
      { color:'#E4E4E7', name:'Borde', hex:'#E4E4E7', hasBorder:true, textDark:true },
    ]},
  ];
  const darkRows = [
    { label:'Fondos', swatches:[
      { color:'#0A0A0A', name:'Fondo principal', hex:'#0A0A0A' },
      { color:'#18181B', name:'Fondo secundario', hex:'#18181B' },
    ]},
    { label:'Texto', swatches:[
      { color:'#FAFAFA', name:'Texto principal', hex:'#FAFAFA' },
      { color:'#A1A1AA', name:'Texto secundario', hex:'#A1A1AA' },
    ]},
    { label:'Acento', swatches:[
      { color:'#4F46E5', name:'Primario', hex:'#4F46E5' },
      { color:'#6366F1', name:'Hover', hex:'#6366F1' },
      { color:'#27272A', name:'Borde', hex:'#27272A' },
    ]},
  ];
  const states = [
    { color:'#10B981', name:'Éxito', hex:'#10B981', textDark:true },
    { color:'#EF4444', name:'Error', hex:'#EF4444', textDark:true },
    { color:'#F59E0B', name:'Alerta', hex:'#F59E0B', textDark:true },
    { color:'#3B82F6', name:'Info', hex:'#3B82F6', textDark:true },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', fontFamily:ff }}>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Modo claro */}
        <div style={{ flex:1, padding:'28px 32px', background:'#FAFAFA', borderRight:'1px solid #E4E4E7' }}>
          <div style={overline('#71717A')}>Modo claro</div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {lightRows.map(row => (
              <div key={row.label}>
                <div style={{ fontSize:10, color:'#71717A', fontWeight:500, marginBottom:10 }}>{row.label}</div>
                <div style={{ display:'flex', gap:12 }}>{row.swatches.map(s => <Swatch key={s.hex} {...s}/>)}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Modo oscuro */}
        <div style={{ flex:1, padding:'28px 32px', background:'#18181B' }}>
          <div style={overline('#A1A1AA')}>Modo oscuro</div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {darkRows.map(row => (
              <div key={row.label}>
                <div style={{ fontSize:10, color:'#A1A1AA', fontWeight:500, marginBottom:10 }}>{row.label}</div>
                <div style={{ display:'flex', gap:12 }}>{row.swatches.map(s => <Swatch key={s.hex} {...s}/>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Estados — fila completa */}
      <div style={{ padding:'20px 32px', background:'#F4F4F5', borderTop:'1px solid #E4E4E7', flexShrink:0 }}>
        <div style={overline('#71717A')}>Estados del sistema</div>
        <div style={{ display:'flex', gap:28 }}>
          {states.map(s => <Swatch key={s.hex} {...s}/>)}
        </div>
      </div>
    </div>
  );
}

// ── Panel: Tipografía ──────────────────────────────────────────────────────────
function TypographyPanel() {
  const scale = [
    { label:'Display',  size:46, weight:700, lh:'1.1', ls:'-.03em', sample:'Ventas del día' },
    { label:'H1',       size:32, weight:700, lh:'1.2', ls:'-.02em', sample:'Panel de control' },
    { label:'H2',       size:24, weight:600, lh:'1.25',ls:'-.01em', sample:'Resumen de ventas' },
    { label:'H3',       size:20, weight:600, lh:'1.35',ls:'0',      sample:'Categorías de productos' },
    { label:'Body L',   size:18, weight:400, lh:'1.55',ls:'0',      sample:'Gestión de inventario y proveedores del sistema' },
    { label:'Body',     size:16, weight:400, lh:'1.6', ls:'0',      sample:'Texto de cuerpo regular para descripciones y contenido.' },
    { label:'Body S',   size:14, weight:400, lh:'1.55',ls:'0',      sample:'Texto pequeño para detalles, listas y metadatos secundarios.' },
    { label:'Caption',  size:12, weight:400, lh:'1.45',ls:'0',      sample:'Notas, marcas de tiempo, etiquetas de pie de tabla' },
    { label:'Overline', size:11, weight:600, lh:'1.3', ls:'.08em',  sample:'ENCABEZADOS DE TABLA / OVERLINE / LABEL', upper:true },
  ];
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:ff, background:'#FAFAFA' }}>
      <div style={{ flex:1, padding:'28px 36px', borderRight:'1px solid #E4E4E7', overflow:'hidden' }}>
        <div style={overline('#71717A')}>Escala tipográfica — Inter</div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {scale.map((row, i) => (
            <div key={i} style={{
              paddingBottom: i < scale.length-1 ? Math.max(5,13-i*1.2)+'px' : 0,
              marginBottom:  i < scale.length-1 ? Math.max(5,13-i*1.2)+'px' : 0,
              borderBottom:  i < scale.length-1 ? '1px solid #F4F4F5' : 'none',
              overflow:'hidden',
            }}>
              <div style={{
                fontSize: row.size, fontWeight: row.weight, lineHeight: row.lh,
                letterSpacing: row.ls, color:'#0A0A0A',
                textTransform: row.upper ? 'uppercase' : 'none',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>{row.sample}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width:200, padding:'28px 24px', background:'#F4F4F5', flexShrink:0 }}>
        <div style={overline('#71717A')}>Especificaciones</div>
        {scale.map((row, i) => (
          <div key={i} style={{
            paddingBottom: i < scale.length-1 ? Math.max(5,12-i)+'px' : 0,
            marginBottom:  i < scale.length-1 ? Math.max(5,12-i)+'px' : 0,
            borderBottom:  i < scale.length-1 ? '1px solid #E4E4E7' : 'none',
          }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#0A0A0A' }}>{row.label}</div>
            <div style={{ fontSize:10, color:'#71717A', fontFamily:'monospace' }}>{row.size}px · {row.weight} · lh {row.lh}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { DST, ff, overline, DualPanel, ColorTokensPanel, TypographyPanel });
