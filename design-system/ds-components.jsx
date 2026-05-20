// ds-components.jsx — Paneles de componentes UI
// Requiere: ds-tokens.jsx cargado antes

// ── Ícono de navegación minimal ────────────────────────────────────────────────
function NavIcon({ type, size = 15, color = 'currentColor' }) {
  const p = { strokeLinecap:'round', strokeLinejoin:'round', stroke:color, strokeWidth:'1.5', fill:'none' };
  const icons = {
    dashboard: <><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill={color} opacity=".9"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill={color} opacity=".9"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill={color} opacity=".9"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill={color} opacity=".9"/></>,
    pos:       <><rect x="1.5" y="2.5" width="13" height="9" rx="1.5" {...p}/><path d="M5.5 13.5h5M8 11.5v2" {...p}/></>,
    sales:     <path d="M2 13l3-5 3 3 3-5 3 3" {...p}/>,
    products:  <><rect x="2.5" y="4" width="11" height="10" rx="1.5" {...p}/><path d="M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1" {...p}/></>,
    inventory: <path d="M2.5 4.5h11M2.5 8h8M2.5 11.5h9.5" {...p}/>,
    suppliers: <><rect x="1.5" y="4.5" width="8.5" height="7.5" rx="1" {...p}/><path d="M10 7.5h2l2.5 3v1.5H10V7.5z" {...p}/><circle cx="4" cy="13" r="1" fill={color}/><circle cx="12.5" cy="13" r="1" fill={color}/></>,
    reports:   <path d="M2 13h12M4 13V9m4 4V5m4 4V1" {...p}/>,
    settings:  <><circle cx="8" cy="8" r="2.5" {...p}/><path d="M8 1.5V3m0 10v1.5M1.5 8H3m10 0h1.5M3.4 3.4l1 1m7.2 7.2 1 1M12.6 3.4l-1 1m-7.2 7.2-1 1" {...p}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display:'block', flexShrink:0 }}>{icons[type]}</svg>;
}

// ── Botones ────────────────────────────────────────────────────────────────────
function ButtonsPanel({ t }) {
  const base = { fontFamily:ff, fontSize:13, fontWeight:500, borderRadius:8, padding:'7px 14px', cursor:'pointer', border:'none', display:'inline-block', textAlign:'center', whiteSpace:'nowrap' };
  const types = [
    { label:'Primario',
      normal:    { ...base, background:t.accent,   color:'#fff' },
      hover:     { ...base, background:t.aHover,   color:'#fff' },
      disabled:  { ...base, background:t.alt,      color:t.muted, cursor:'not-allowed' },
    },
    { label:'Secundario',
      normal:    { ...base, background:'transparent', color:t.text,   border:`1px solid ${t.border}`, padding:'6px 14px' },
      hover:     { ...base, background:t.alt,         color:t.text,   border:`1px solid ${t.border}`, padding:'6px 14px' },
      disabled:  { ...base, background:'transparent', color:t.muted,  border:`1px solid ${t.border}`, padding:'6px 14px', cursor:'not-allowed' },
    },
    { label:'Ghost',
      normal:    { ...base, background:'transparent', color:t.accent },
      hover:     { ...base, background: t === DST.light ? 'rgba(79,70,229,.08)' : 'rgba(79,70,229,.15)', color:t.accent },
      disabled:  { ...base, background:'transparent', color:t.muted, cursor:'not-allowed' },
    },
    { label:'Destructivo',
      normal:    { ...base, background:'#EF4444', color:'#fff' },
      hover:     { ...base, background:'#DC2626', color:'#fff' },
      disabled:  { ...base, background:t.alt,    color:t.muted, cursor:'not-allowed' },
    },
  ];
  const stateLabels = ['Normal','Hover','Deshabilitado'];
  const btnLabels   = ['Confirmar','Confirmar','Confirmar'];
  return (
    <div>
      {/* Column headers */}
      <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 1fr 1fr', gap:8, marginBottom:12, alignItems:'center' }}>
        <div/>
        {stateLabels.map(s => (
          <div key={s} style={{ fontSize:10, color:t.muted, fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', textAlign:'center' }}>{s}</div>
        ))}
      </div>
      {/* Button rows */}
      {types.map(({ label, normal, hover, disabled }) => (
        <div key={label} style={{ display:'grid', gridTemplateColumns:'80px 1fr 1fr 1fr', gap:8, marginBottom:10, alignItems:'center' }}>
          <div style={{ fontSize:12, color:t.muted, fontWeight:500 }}>{label}</div>
          {[normal, hover, disabled].map((s, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <span style={s}>{btnLabels[i]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Inputs ─────────────────────────────────────────────────────────────────────
function InputsPanel({ t }) {
  const inputBase = {
    width:'100%', padding:'8px 12px', borderRadius:8, fontSize:13,
    background:t.bg, color:t.text, fontFamily:ff, boxSizing:'border-box', display:'block',
  };
  const label = { fontSize:12, fontWeight:500, color:t.text, marginBottom:5, display:'block' };
  const hint  = { fontSize:11, color:t.muted, marginTop:4, display:'block' };
  const items = [
    { lbl:'Nombre del producto', ph:'Ej: Arepa de maíz', val:'', state:'vacío', border:`1px solid ${t.border}` },
    { lbl:'Precio unitario',     ph:'',                  val:'$ 2.500',         state:'con valor', border:`1px solid ${t.border}` },
    { lbl:'Código SKU',          ph:'Ej: P-001',         val:'P-00X',           state:'con error', border:'1px solid #EF4444', error:'El código ya existe en el sistema' },
    { lbl:'Categoría',           ph:'Sin categoría',     val:'Alimentos',       state:'deshabilitado', border:`1px solid ${t.border}`, disabled:true },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {items.map(it => (
        <div key={it.lbl}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
            <span style={label}>{it.lbl}</span>
            <span style={{ fontSize:10, color:it.state==='con error'?'#EF4444':t.muted, fontWeight:500, textTransform:'uppercase', letterSpacing:'.04em' }}>{it.state}</span>
          </div>
          <input
            readOnly
            value={it.val}
            placeholder={it.ph}
            disabled={it.disabled}
            style={{ ...inputBase, border:it.border, opacity:it.disabled?0.5:1, cursor:it.disabled?'not-allowed':'text', outline:'none' }}
          />
          {it.error && <span style={{ ...hint, color:'#EF4444' }}>⚠ {it.error}</span>}
          {!it.error && it.state==='con valor' && <span style={hint}>Campo requerido</span>}
        </div>
      ))}
    </div>
  );
}

// ── Badges ─────────────────────────────────────────────────────────────────────
function BadgesPanel({ t, mode }) {
  const dk = mode === 'dark';
  const badges = [
    { label:'Pagado',     bg: dk?'rgba(16,185,129,.15)':'#ECFDF5', color: dk?'#34D399':'#059669', dot:'#10B981' },
    { label:'Cancelado',  bg: dk?'rgba(239,68,68,.15)':'#FEF2F2',  color: dk?'#F87171':'#DC2626', dot:'#EF4444' },
    { label:'Pendiente',  bg: dk?'rgba(245,158,11,.15)':'#FFFBEB', color: dk?'#FBBF24':'#D97706', dot:'#F59E0B' },
    { label:'Borrador',   bg: dk?t.alt:'#F4F4F5',                  color: t.muted,                dot:t.muted  },
    { label:'En revisión',bg: dk?'rgba(59,130,246,.15)':'#EFF6FF', color: dk?'#60A5FA':'#2563EB', dot:'#3B82F6' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {badges.map(b => (
          <div key={b.label} style={{ display:'inline-flex', alignItems:'center', gap:6, background:b.bg, color:b.color, borderRadius:20, padding:'4px 10px', fontSize:12, fontWeight:500, fontFamily:ff }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:b.dot, flexShrink:0 }}/>
            {b.label}
          </div>
        ))}
      </div>
      {/* Size variants */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {['sm','md','lg'].map((sz,i) => (
          <div key={sz} style={{ display:'inline-flex', alignItems:'center', gap:5, background: dk?'rgba(79,70,229,.15)':'rgba(79,70,229,.1)', color: dk?'#818CF8':'#4F46E5', borderRadius:20, padding:`${2+i*2}px ${8+i*2}px`, fontSize:10+i*2, fontWeight:500, fontFamily:ff }}>
            <div style={{ width:5+i, height:5+i, borderRadius:'50%', background: dk?'#818CF8':'#4F46E5', flexShrink:0 }}/>
            Activo · {sz}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cards ──────────────────────────────────────────────────────────────────────
function CardsPanel({ t }) {
  const card = { background:t.bg, border:`1px solid ${t.border}`, borderRadius:12, overflow:'hidden', fontFamily:ff };
  const shadow = '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)';
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* Simple — stat card */}
      <div style={{ ...card, padding:'18px 20px', boxShadow:shadow }}>
        <div style={{ fontSize:11, color:t.muted, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:8 }}>Ventas de hoy</div>
        <div style={{ fontSize:28, fontWeight:700, color:t.text, letterSpacing:'-.02em', marginBottom:4 }}>$342.500</div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12, color:'#10B981', fontWeight:500 }}>↑ 12%</span>
          <span style={{ fontSize:12, color:t.muted }}>vs. ayer</span>
        </div>
      </div>
      {/* Con header */}
      <div style={{ ...card, boxShadow:shadow }}>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:600, color:t.text }}>Productos recientes</span>
          <span style={{ fontSize:12, color:t.accent, cursor:'pointer' }}>Ver todos →</span>
        </div>
        <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
          {[['Arepa de maíz','Alimentos','$2.500'],['Gaseosa 2L','Bebidas','$5.800']].map(([n,c,p]) => (
            <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{n}</div>
                <div style={{ fontSize:11, color:t.muted }}>{c}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{p}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Con borde izquierdo */}
      <div style={{ ...card, padding:'14px 16px', borderLeft:`3px solid ${t.accent}`, boxShadow:shadow, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:4 }}>Sucursal Norte</div>
          <div style={{ fontSize:12, color:t.muted }}>24 empleados · Abierta</div>
        </div>
        <div style={{ fontSize:11, fontWeight:500, background:t.alt, color:'#10B981', borderRadius:20, padding:'3px 10px' }}>Activa</div>
      </div>
    </div>
  );
}

// ── Tabla ──────────────────────────────────────────────────────────────────────
function TablePanel({ t }) {
  const rows = [
    { name:'Arepa de maíz',       code:'P-001', cat:'Alimentos',  stock:145, price:'$2.500',  status:'Activo',   ok:true },
    { name:'Gaseosa 2L',          code:'P-002', cat:'Bebidas',    stock:32,  price:'$5.800',  status:'Activo',   ok:true, hover:true },
    { name:'Paracetamol 500mg',   code:'P-003', cat:'Farmacia',   stock:0,   price:'$1.200',  status:'Agotado',  ok:false },
  ];
  const th = { fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.05em', textTransform:'uppercase', padding:'10px 12px', textAlign:'left', borderBottom:`1px solid ${t.border}`, background:t.alt, fontFamily:ff };
  const td = (hover) => ({ fontSize:13, color:t.text, padding:'10px 12px', borderBottom:`1px solid ${t.border}`, background: hover ? (t === DST.light ? '#F0F0FF' : '#1a1a2e') : t.bg, fontFamily:ff });
  return (
    <div style={{ borderRadius:10, border:`1px solid ${t.border}`, overflow:'hidden', fontSize:13, fontFamily:ff }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            {['Producto','Código','Categoría','Stock','Precio','Estado'].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.code}>
              <td style={{ ...td(r.hover), fontWeight:500 }}>{r.name}</td>
              <td style={{ ...td(r.hover), color:t.muted, fontFamily:'monospace', fontSize:12 }}>{r.code}</td>
              <td style={td(r.hover)}>{r.cat}</td>
              <td style={{ ...td(r.hover), color: r.stock === 0 ? '#EF4444' : t.text }}>{r.stock}</td>
              <td style={{ ...td(r.hover), fontWeight:500 }}>{r.price}</td>
              <td style={td(r.hover)}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:20, background: r.ok ? (t===DST.light?'#ECFDF5':'rgba(16,185,129,.15)') : (t===DST.light?'#FEF2F2':'rgba(239,68,68,.15)'), color: r.ok ? (t===DST.light?'#059669':'#34D399') : (t===DST.light?'#DC2626':'#F87171') }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', display:'inline-block' }}/>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Navegación — Sidebar + Topbar ──────────────────────────────────────────────
function NavPanel({ t }) {
  const groups = [
    { label:'Principal', items:[
      { icon:'dashboard', label:'Dashboard', active:false },
      { icon:'pos',       label:'Punto de venta', active:true },
      { icon:'sales',     label:'Ventas', active:false },
    ]},
    { label:'Gestión', items:[
      { icon:'products',  label:'Productos', active:false },
      { icon:'inventory', label:'Inventario', active:false },
      { icon:'suppliers', label:'Proveedores', active:false },
    ]},
    { label:'Reportes', items:[
      { icon:'reports',   label:'Análisis', active:false },
      { icon:'settings',  label:'Configuración', active:false },
    ]},
  ];
  return (
    <div style={{ display:'flex', height:'100%', borderRadius:10, overflow:'hidden', border:`1px solid ${t.border}`, fontFamily:ff }}>
      {/* Sidebar */}
      <div style={{ width:188, background:t.alt, borderRight:`1px solid ${t.border}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
        {/* Logo en sidebar */}
        <div style={{ padding:'16px 16px 12px', borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:7, background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="8" width="3" height="4" rx="1" fill="white"/>
                <rect x="5.5" y="5.5" width="3" height="6.5" rx="1" fill="white" opacity=".7"/>
                <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize:13, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>inventario</span>
          </div>
        </div>
        {/* Nav items */}
        <div style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          {groups.map(g => (
            <div key={g.label} style={{ marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.07em', textTransform:'uppercase', padding:'0 8px', marginBottom:4 }}>{g.label}</div>
              {g.items.map(item => (
                <div key={item.label} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'7px 8px',
                  borderRadius:7, marginBottom:1,
                  background: item.active ? t.accent : 'transparent',
                  color: item.active ? '#fff' : t.muted,
                  cursor:'pointer',
                }}>
                  <NavIcon type={item.icon} size={14} color={item.active ? '#fff' : t.muted}/>
                  <span style={{ fontSize:12, fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Contenido principal */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', background:t.bg, minWidth:0 }}>
        {/* Topbar */}
        <div style={{ height:48, borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:12, color:t.muted }}>Inventario</span>
            <span style={{ color:t.muted, fontSize:12 }}>/</span>
            <span style={{ fontSize:12, fontWeight:500, color:t.text }}>Punto de venta</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, background:t.alt, border:`1px solid ${t.border}`, borderRadius:7, padding:'4px 10px', cursor:'pointer' }}>
              <span style={{ fontSize:11, fontWeight:500, color:t.text }}>Sucursal Centro</span>
              <span style={{ fontSize:9, color:t.muted }}>▾</span>
            </div>
            <div style={{ width:30, height:30, borderRadius:7, background:t.alt, border:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <NavIcon type="reports" size={13} color={t.muted}/>
            </div>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>JS</span>
            </div>
          </div>
        </div>
        {/* Content placeholder */}
        <div style={{ flex:1, padding:'16px', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', gap:8 }}>
            {['$342.500','128 tx','94%'].map((v,i) => (
              <div key={i} style={{ flex:1, background:t.alt, border:`1px solid ${t.border}`, borderRadius:8, padding:'10px 12px' }}>
                <div style={{ fontSize:9, color:t.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>{['Ventas hoy','Transacciones','Satisfacción'][i]}</div>
                <div style={{ fontSize:16, fontWeight:700, color:t.text }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ flex:1, background:t.alt, border:`1px solid ${t.border}`, borderRadius:8 }}/>
        </div>
      </div>
    </div>
  );
}

// ── Toasts ─────────────────────────────────────────────────────────────────────
function ToastsPanel({ t, mode }) {
  const dk = mode === 'dark';
  const toasts = [
    { icon:'✓', label:'Venta registrada exitosamente', sub:'Transacción #4821 · $87.000', bg: dk?'#0a2218':'#ECFDF5', border:'#10B981', tc:'#10B981' },
    { icon:'✕', label:'Error al procesar el pago',     sub:'Intenta de nuevo o cambia el método', bg: dk?'#2c0a0a':'#FEF2F2', border:'#EF4444', tc:'#EF4444' },
    { icon:'!', label:'Stock bajo: Gaseosa 2L',         sub:'Solo 3 unidades disponibles',    bg: dk?'#271a00':'#FFFBEB', border:'#F59E0B', tc:'#F59E0B' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {toasts.map(toast => (
        <div key={toast.label} style={{ display:'flex', alignItems:'flex-start', gap:10, background:toast.bg, border:`1px solid ${toast.border}`, borderRadius:10, padding:'11px 14px', fontFamily:ff }}>
          <div style={{ width:20, height:20, borderRadius:'50%', background:toast.border, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>{toast.icon}</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:2 }}>{toast.label}</div>
            <div style={{ fontSize:11, color:t.muted }}>{toast.sub}</div>
          </div>
          <span style={{ fontSize:16, color:t.muted, cursor:'pointer', flexShrink:0, lineHeight:1 }}>×</span>
        </div>
      ))}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function ModalPanel({ t }) {
  return (
    <div style={{ position:'relative', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:ff }}>
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background: t === DST.light ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.6)', borderRadius:8 }}/>
      {/* Modal */}
      <div style={{ position:'relative', width:320, background:t.bg, borderRadius:14, border:`1px solid ${t.border}`, boxShadow:'0 20px 60px rgba(0,0,0,.25)', overflow:'hidden', zIndex:1 }}>
        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:15, fontWeight:700, color:t.text }}>Confirmar venta</span>
          <span style={{ fontSize:18, color:t.muted, cursor:'pointer', lineHeight:1 }}>×</span>
        </div>
        {/* Body */}
        <div style={{ padding:'16px 20px' }}>
          <div style={{ background:t.alt, borderRadius:8, padding:'12px 14px', marginBottom:14 }}>
            {[['Arepa de maíz x2','$5.000'],['Gaseosa 2L x1','$5.800'],['Paracetamol x3','$3.600']].map(([n,p]) => (
              <div key={n} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:t.text }}>
                <span>{n}</span><span style={{ fontWeight:500 }}>{p}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:8, marginTop:2, display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700, color:t.text }}>
              <span>Total</span><span>$14.400</span>
            </div>
          </div>
          <div style={{ fontSize:12, color:t.muted }}>Método de pago: <strong style={{ color:t.text }}>Efectivo</strong></div>
        </div>
        {/* Footer */}
        <div style={{ padding:'12px 20px', borderTop:`1px solid ${t.border}`, display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button style={{ padding:'7px 16px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.text, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:ff }}>Cancelar</button>
          <button style={{ padding:'7px 16px', borderRadius:8, border:'none', background:'#4F46E5', color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:ff }}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ── Drawer Lateral ─────────────────────────────────────────────────────────────
function DrawerPanel({ t }) {
  const inputSt = { width:'100%', padding:'7px 10px', borderRadius:8, border:`1px solid ${t.border}`, background:t.bg, color:t.text, fontSize:12, fontFamily:ff, boxSizing:'border-box', display:'block', outline:'none' };
  return (
    <div style={{ position:'relative', height:'100%', display:'flex', fontFamily:ff }}>
      {/* Contenido de fondo */}
      <div style={{ flex:1, background: t === DST.light ? 'rgba(0,0,0,.3)' : 'rgba(0,0,0,.6)', borderRadius:8 }}/>
      {/* Drawer */}
      <div style={{ width:230, background:t.bg, border:`1px solid ${t.border}`, display:'flex', flexDirection:'column', flexShrink:0, height:'100%' }}>
        {/* Header */}
        <div style={{ padding:'14px 16px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:14, fontWeight:700, color:t.text }}>Editar producto</span>
          <span style={{ fontSize:18, color:t.muted, cursor:'pointer' }}>×</span>
        </div>
        {/* Form */}
        <div style={{ flex:1, padding:'14px 16px', display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>
          {[
            { label:'Nombre', val:'Arepa de maíz', type:'text' },
            { label:'Precio', val:'$2.500', type:'text' },
            { label:'Stock', val:'145', type:'number' },
            { label:'Categoría', val:'Alimentos', type:'text' },
            { label:'Código SKU', val:'P-001', type:'text' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize:11, fontWeight:500, color:t.muted, display:'block', marginBottom:4 }}>{f.label}</label>
              <input readOnly value={f.val} type={f.type} style={inputSt}/>
            </div>
          ))}
          <div>
            <label style={{ fontSize:11, fontWeight:500, color:t.muted, display:'block', marginBottom:4 }}>Estado</label>
            <div style={{ display:'flex', gap:6 }}>
              {['Activo','Inactivo'].map((s,i) => (
                <div key={s} style={{ flex:1, padding:'6px 0', textAlign:'center', borderRadius:7, border:`1px solid ${i===0?t.accent:t.border}`, background:i===0?t.accent:'transparent', color:i===0?'#fff':t.muted, fontSize:12, fontWeight:500, cursor:'pointer' }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${t.border}`, display:'flex', gap:8 }}>
          <button style={{ flex:1, padding:'8px', borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', color:t.text, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:ff }}>Descartar</button>
          <button style={{ flex:1, padding:'8px', borderRadius:8, border:'none', background:'#4F46E5', color:'#fff', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:ff }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  NavIcon, ButtonsPanel, InputsPanel, BadgesPanel,
  CardsPanel, TablePanel, NavPanel,
  ToastsPanel, ModalPanel, DrawerPanel,
});
