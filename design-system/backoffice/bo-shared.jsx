// bo-shared.jsx — Backoffice shell (sidebar 240px + topbar 56px) y helpers

if (typeof window !== 'undefined' && !window.Icon) {
  window.Icon = function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.75, style = {} }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current) return;
      const lib = (window.lucide && (window.lucide.icons || window.lucide)) || {};
      const pascal = name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const ic = lib[pascal];
      if (!ic) { ref.current.innerHTML = ''; return; }
      const [tag, attrs, children] = ic;
      const NS = 'http://www.w3.org/2000/svg';
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      node.setAttribute('width', size);
      node.setAttribute('height', size);
      node.setAttribute('stroke', color);
      node.setAttribute('stroke-width', strokeWidth);
      (children || []).forEach((child) => {
        const ctag = child[0]; const cattrs = child[1] || {};
        const c = document.createElementNS(NS, ctag);
        Object.entries(cattrs).forEach(([k, v]) => c.setAttribute(k, v));
        node.appendChild(c);
      });
      ref.current.innerHTML = '';
      ref.current.appendChild(node);
    }, [name, size, color, strokeWidth]);
    return <span ref={ref} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', lineHeight:0, ...style }}/>;
  };
}

if (typeof window !== 'undefined' && !window.fmtCOP) {
  window.fmtCOP = (n) => '$' + Number(n).toLocaleString('es-CO');
}

// ── Sidebar grupos y items ────────────────────────────────────────────────────
const BO_NAV = [
  { group:'Operación', items:[
    { id:'dashboard',  label:'Dashboard',     icon:'layout-dashboard' },
    { id:'pos',        label:'POS',           icon:'shopping-bag' },
    { id:'kds',        label:'KDS',           icon:'chef-hat' },
    { id:'caja',       label:'Caja',          icon:'archive' },
  ]},
  { group:'Gestión', items:[
    { id:'catalogo',   label:'Catálogo',      icon:'package' },
    { id:'inventario', label:'Inventario',    icon:'boxes' },
    { id:'clientes',   label:'Clientes',      icon:'users' },
    { id:'proveedores',label:'Proveedores',   icon:'truck' },
    { id:'gastos',     label:'Gastos',        icon:'wallet' },
  ]},
  { group:'Finanzas', items:[
    { id:'facturacion',label:'Facturación DIAN', icon:'file-text' },
    { id:'contabilidad',label:'Contabilidad',  icon:'calculator' },
    { id:'reportes',   label:'Reportes',      icon:'bar-chart-3' },
  ]},
  { group:'Config', items:[
    { id:'config',     label:'Configuración', icon:'settings' },
    { id:'usuarios',   label:'Usuarios',      icon:'user-cog' },
    { id:'roles',      label:'Roles',         icon:'shield' },
  ]},
];

// ── BOPageHeader (título + subtítulo + acciones) ──────────────────────────────
function BOPageHeader({ t, title, subtitle, actions }) {
  return (
    <div style={{
      display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      marginBottom: 18, fontFamily:ff,
    }}>
      <div>
        <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display:'flex', alignItems:'center', gap:8 }}>{actions}</div>}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ t, current = 1, totalPages = 3, label }) {
  return (
    <div style={{
      padding:'12px 18px', borderTop:`1px solid ${t.border}`, background:t.alt,
      display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:ff,
    }}>
      <span style={{ fontSize:11, color:t.muted }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <button style={{
          width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.bg, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="chevron-left" size={13} color={t.muted}/>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
          const active = p === current;
          return (
            <button key={p} style={{
              width:28, height:28, borderRadius:6,
              border:`1px solid ${active ? t.accent : t.border}`,
              background: active ? t.accent : t.bg,
              color: active ? '#fff' : t.text,
              fontWeight:600, fontSize:11, cursor:'pointer', fontFamily:ff,
            }}>{p}</button>
          );
        })}
        <button style={{
          width:28, height:28, borderRadius:6, border:`1px solid ${t.border}`, background:t.bg, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name="chevron-right" size={13} color={t.muted}/>
        </button>
      </div>
    </div>
  );
}

// ── BOToolbar (search + filtros + acciones) ───────────────────────────────────
function BOToolbar({ t, search, filters = [], right }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, fontFamily:ff }}>
      {search && (
        <div style={{ position:'relative', width:280 }}>
          <Icon name="search" size={14} color={t.muted} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
          <input readOnly placeholder={search} style={{
            width:'100%', padding:'8px 12px 8px 32px', fontSize:12, fontFamily:ff,
            background:t.bg, border:`1px solid ${t.border}`, borderRadius:8, color:t.text, outline:'none', boxSizing:'border-box',
          }}/>
        </div>
      )}
      {filters.map((f, i) => (
        <button key={i} style={{
          padding:'8px 12px', borderRadius:7, background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
          display:'flex', alignItems:'center', gap:7, fontFamily:ff, fontSize:12, color:t.text,
        }}>
          <span style={{ color:t.muted }}>{f.label}:</span>
          <span style={{ fontWeight:500 }}>{f.value}</span>
          <Icon name="chevron-down" size={11} color={t.muted}/>
        </button>
      ))}
      <div style={{ flex:1 }}/>
      {right}
    </div>
  );
}

// ── BOPrimaryBtn / BOGhostBtn ─────────────────────────────────────────────────
function BOPrimaryBtn({ t, icon, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'8px 14px', borderRadius:8, background:t.accent,
      color:'#fff', border:'none', cursor:'pointer', fontFamily:ff,
      fontSize:13, fontWeight:600,
      display:'flex', alignItems:'center', gap:6,
    }}>
      {icon && <Icon name={icon} size={14} color="#fff" strokeWidth={2.4}/>}
      {children}
    </button>
  );
}

function BOGhostBtn({ t, icon, children, danger }) {
  return (
    <button style={{
      padding:'8px 14px', borderRadius:8, background:t.bg,
      border:`1px solid ${danger ? (t === DST.light ? '#FECACA' : '#7F1D1D') : t.border}`,
      color: danger ? DST.error : t.text, cursor:'pointer', fontFamily:ff,
      fontSize:13, fontWeight:500,
      display:'flex', alignItems:'center', gap:6,
    }}>
      {icon && <Icon name={icon} size={13} color={danger ? DST.error : t.muted}/>}
      {children}
    </button>
  );
}

// ── ConfigTabs (B5/B6/B7 comparten esta barra) ────────────────────────────────
const CONFIG_TABS = [
  { id:'general',  label:'General' },
  { id:'fiscales', label:'Datos fiscales' },
  { id:'sucursales',label:'Sucursales' },
  { id:'mesas',    label:'Salas y mesas' },
  { id:'cajas',    label:'Cajas' },
  { id:'turnos',   label:'Turnos' },
  { id:'impresoras',label:'Impresoras' },
];

function ConfigTabs({ t, active = 'general' }) {
  return (
    <div style={{
      display:'flex', gap:2, borderBottom:`1px solid ${t.border}`,
      marginBottom:22, overflowX:'auto', fontFamily:ff,
    }}>
      {CONFIG_TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} style={{
            padding:'10px 16px', border:'none', background:'transparent', cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight: isActive ? 600 : 500,
            color: isActive ? t.text : t.muted,
            borderBottom:`2px solid ${isActive ? t.accent : 'transparent'}`,
            marginBottom:-1, whiteSpace:'nowrap',
          }}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Drawer (panel lateral derecho 480px sobre overlay) ────────────────────────
function DrawerOverlay({ t, title, subtitle, onClose, children, footer, width = 480 }) {
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:50,
      background:'rgba(0,0,0,.42)',
      display:'flex', justifyContent:'flex-end',
      fontFamily:ff,
    }}>
      <div style={{
        width, height:'100%', background:t.bg,
        borderLeft:`1px solid ${t.border}`,
        display:'flex', flexDirection:'column',
        boxShadow:'0 12px 40px rgba(0,0,0,.25)',
      }}>
        {/* Header */}
        <div style={{
          padding:'16px 22px', borderBottom:`1px solid ${t.border}`,
          display:'flex', alignItems:'center', gap:12, flexShrink:0,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:600, color:t.text }}>{title}</div>
            {subtitle && <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>{subtitle}</div>}
          </div>
          <button style={{
            width:30, height:30, borderRadius:7, border:`1px solid ${t.border}`,
            background:t.alt, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="x" size={14} color={t.muted}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflow:'auto', padding:'18px 22px' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding:'14px 22px', borderTop:`1px solid ${t.border}`, flexShrink:0,
            display:'flex', justifyContent:'flex-end', gap:8,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── BackofficeSidebar ─────────────────────────────────────────────────────────
function BackofficeSidebar({ t, active = 'dashboard' }) {
  return (
    <div style={{
      width:240, flexShrink:0, height:'100%',
      background:t.alt, borderRight:`1px solid ${t.border}`,
      display:'flex', flexDirection:'column', overflow:'hidden',
      fontFamily:ff,
    }}>
      {/* Logo + selector negocio */}
      <div style={{ padding:'14px 14px 12px', borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10 }}>
          <div style={{ width:30, height:30, borderRadius:7, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>I</div>
          <span style={{ fontSize:14, fontWeight:600, color:t.text }}>Inventario</span>
        </div>
        <button style={{
          width:'100%', padding:'8px 10px', borderRadius:7,
          background:t.bg, border:`1px solid ${t.border}`, cursor:'pointer',
          display:'flex', alignItems:'center', gap:8, fontFamily:ff,
        }}>
          <div style={{ width:24, height:24, borderRadius:6, background:'#FED7AA', display:'flex', alignItems:'center', justifyContent:'center', color:'#9A3412', fontSize:11, fontWeight:700, flexShrink:0 }}>EB</div>
          <div style={{ flex:1, textAlign:'left', minWidth:0 }}>
            <div style={{ fontSize:11, color:t.muted, lineHeight:1.2 }}>Negocio</div>
            <div style={{ fontSize:12, fontWeight:600, color:t.text, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>El Buen Sabor</div>
          </div>
          <Icon name="chevrons-up-down" size={13} color={t.muted}/>
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex:1, overflow:'auto', padding:'12px 8px' }}>
        {BO_NAV.map(g => (
          <div key={g.group} style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase', padding:'4px 8px 6px' }}>
              {g.group}
            </div>
            {g.items.map(item => {
              const isActive = item.id === active;
              return (
                <button key={item.id} style={{
                  width:'100%', padding:'7px 10px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:ff,
                  background: isActive ? t.bg : 'transparent',
                  color: isActive ? t.text : t.muted,
                  display:'flex', alignItems:'center', gap:10, marginBottom:1,
                  fontSize:12, fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,.04)' : 'none',
                  position:'relative',
                }}>
                  {isActive && <span style={{ position:'absolute', left:-8, top:'50%', transform:'translateY(-50%)', width:3, height:18, borderRadius:2, background:t.accent }}/>}
                  <Icon name={item.icon} size={15} color={isActive ? t.accent : t.muted} strokeWidth={isActive ? 2 : 1.7}/>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer: avatar */}
      <div style={{ padding:'10px 12px', borderTop:`1px solid ${t.border}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        <div style={{ width:30, height:30, borderRadius:15, background:'#FCA5A5', color:'#7F1D1D', fontWeight:600, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>JC</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:t.text, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Juan Camilo</div>
          <div style={{ fontSize:10, color:t.muted, lineHeight:1.2 }}>Administrador</div>
        </div>
        <button style={{ width:26, height:26, borderRadius:6, background:'transparent', border:'none', cursor:'pointer', color:t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="log-out" size={13} color={t.muted}/>
        </button>
      </div>
    </div>
  );
}

// ── BackofficeTopbar ──────────────────────────────────────────────────────────
function BackofficeTopbar({ t, breadcrumb = ['Dashboard'], showSucursal = true }) {
  return (
    <div style={{
      height:56, flexShrink:0,
      background:t.bg, borderBottom:`1px solid ${t.border}`,
      display:'flex', alignItems:'center', padding:'0 22px', gap:18, fontFamily:ff,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:t.muted, flex:'0 0 auto' }}>
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevron-right" size={11} color={t.muted}/>}
            <span style={{ color: i === breadcrumb.length - 1 ? t.text : t.muted, fontWeight: i === breadcrumb.length - 1 ? 600 : 500 }}>{b}</span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex:1 }}/>

      {showSucursal && (
        <button style={{
          padding:'7px 12px', borderRadius:7, background:t.alt, border:`1px solid ${t.border}`, cursor:'pointer',
          display:'flex', alignItems:'center', gap:8, fontFamily:ff,
        }}>
          <Icon name="store" size={14} color={t.muted}/>
          <span style={{ fontSize:12, color:t.text, fontWeight:500 }}>Sede Norte</span>
          <Icon name="chevron-down" size={12} color={t.muted}/>
        </button>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <button style={{
          width:34, height:34, borderRadius:8, background:t.alt, border:`1px solid ${t.border}`, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
        }}>
          <Icon name="search" size={15} color={t.muted}/>
        </button>
        <button style={{
          width:34, height:34, borderRadius:8, background:t.alt, border:`1px solid ${t.border}`, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
        }}>
          <Icon name="bell" size={15} color={t.muted}/>
          <span style={{ position:'absolute', top:6, right:6, width:6, height:6, borderRadius:3, background:DST.error }}/>
        </button>
        <div style={{ width:34, height:34, borderRadius:17, background:'#FCA5A5', color:'#7F1D1D', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>JC</div>
      </div>
    </div>
  );
}

// ── BackofficeShell ───────────────────────────────────────────────────────────
function BackofficeShell({ t, active, breadcrumb, children, overlay }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', background:t.bg, fontFamily:ff, overflow:'hidden', position:'relative' }}>
      <BackofficeSidebar t={t} active={active}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <BackofficeTopbar t={t} breadcrumb={breadcrumb}/>
        <div style={{ flex:1, overflow:'auto' }}>
          {children}
        </div>
      </div>
      {overlay}
    </div>
  );
}

// ── AlertBanner (alertas críticas con borde izquierdo rojo) ──────────────────
// Usado por B1 (alertas críticas en dashboard) y B17 (facturas con error).
// items: [{ meta?, title, detail?, helper?, actions:[{label, primary?}] }]
function AlertBanner({ t, title = 'Requiere tu atención', icon = 'alert-triangle', items = [], moreLabel }) {
  const isLight = t === DST.light;
  return (
    <div style={{
      marginBottom: 18,
      background: isLight ? '#FEF2F2' : 'rgba(239,68,68,.08)',
      border: `1px solid ${isLight ? '#FECACA' : 'rgba(239,68,68,.3)'}`,
      borderLeft: `4px solid ${DST.error}`,
      borderRadius: 10,
      padding: '14px 18px',
      fontFamily: ff,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:12 }}>
        <div style={{
          width:26, height:26, borderRadius:7,
          background: isLight ? '#FEE2E2' : 'rgba(239,68,68,.18)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <Icon name={icon} size={14} color={DST.error} strokeWidth={2.2}/>
        </div>
        <div style={{ fontSize:13, fontWeight:600, color: isLight ? '#7F1D1D' : '#FCA5A5' }}>{title}</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            paddingTop: i > 0 ? 14 : 0,
            borderTop: i > 0 ? `1px solid ${isLight ? '#FECACA' : 'rgba(239,68,68,.2)'}` : 'none',
          }}>
            {it.meta && (
              <div style={{ fontSize:11, color:t.muted, marginBottom:4, fontWeight:500 }}>{it.meta}</div>
            )}
            <div style={{ fontSize:13, color:t.text, fontWeight:600, marginBottom: it.detail || it.helper ? 4 : 10 }}>
              {it.title}
            </div>
            {it.detail && (
              <div style={{ fontSize:12, color:t.muted, marginBottom:10, lineHeight:1.5 }}>{it.detail}</div>
            )}
            {it.helper && (
              <div style={{ fontSize:12, color:t.text, marginBottom:9, fontWeight:500 }}>{it.helper}</div>
            )}
            {it.actions && it.actions.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {it.actions.map((a, j) => (
                  <button key={j} style={{
                    padding:'6px 12px', borderRadius:7, cursor:'pointer', fontFamily:ff,
                    fontSize:12, fontWeight:600,
                    background: a.primary ? DST.error : t.bg,
                    color: a.primary ? '#fff' : t.text,
                    border: a.primary ? 'none' : `1px solid ${t.border}`,
                  }}>{a.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {moreLabel && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${isLight ? '#FECACA' : 'rgba(239,68,68,.2)'}` }}>
          <a style={{ fontSize:12, color:DST.error, fontWeight:500, cursor:'pointer' }}>{moreLabel} →</a>
        </div>
      )}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
// tone (opcional): 'success' | 'warning' | 'error' | 'muted' tinta el fondo y borde
// helper (opcional): texto secundario en color muted bajo el valor (alternativa a delta)
// pulse (opcional): añade clase css de pulso al ícono (para estados "procesando")
function KPICard({ t, label, value, delta, deltaTone = 'up', icon, iconColor, tone, helper, pulse }) {
  const isLight = t === DST.light;
  const deltaColors = {
    up:   { color: DST.success, icon:'trending-up' },
    down: { color: DST.error,   icon:'trending-down' },
    flat: { color: t.muted,     icon:'minus' },
  };
  const dc = deltaColors[deltaTone];

  const toneMap = {
    success: { bg: isLight ? '#F0FDF4' : 'rgba(16,185,129,.10)',  border: isLight ? '#BBF7D0' : 'rgba(16,185,129,.4)',  iconBg: isLight ? '#DCFCE7' : 'rgba(16,185,129,.20)', iconColor: DST.success },
    warning: { bg: isLight ? '#FFFBEB' : 'rgba(245,158,11,.10)',  border: isLight ? '#FDE68A' : 'rgba(245,158,11,.4)',  iconBg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.20)', iconColor: DST.warning },
    error:   { bg: isLight ? '#FEF2F2' : 'rgba(239,68,68,.10)',   border: isLight ? '#FECACA' : 'rgba(239,68,68,.4)',   iconBg: isLight ? '#FEE2E2' : 'rgba(239,68,68,.20)',  iconColor: DST.error },
    muted:   { bg: isLight ? '#F9FAFB' : 'rgba(161,161,170,.08)', border: isLight ? '#E5E7EB' : 'rgba(161,161,170,.3)', iconBg: isLight ? '#F4F4F5' : 'rgba(161,161,170,.18)',iconColor: t.muted },
  };
  const ts = tone ? toneMap[tone] : null;

  return (
    <div style={{
      padding:'16px 18px',
      background: ts ? ts.bg : t.bg,
      border:`1px solid ${ts ? ts.border : t.border}`,
      borderRadius:11,
      display:'flex', flexDirection:'column', gap:8,
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, fontWeight:500, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase' }}>{label}</span>
        {icon && (
          <div className={pulse ? 'dian-pulse' : undefined} style={{
            width:30, height:30, borderRadius:8,
            background: ts ? ts.iconBg : t.alt,
            color: iconColor || (ts ? ts.iconColor : t.muted),
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name={icon} size={15} color={iconColor || (ts ? ts.iconColor : t.muted)}/>
          </div>
        )}
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:t.text, fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em', lineHeight:1.1 }}>{value}</div>
      {delta && (
        <div style={{ fontSize:11, color: dc.color, display:'flex', alignItems:'center', gap:4, fontWeight:500 }}>
          <Icon name={dc.icon} size={12} color={dc.color}/>
          {delta}
        </div>
      )}
      {!delta && helper && (
        <div style={{ fontSize:11, color:t.muted, fontWeight:500 }}>{helper}</div>
      )}
    </div>
  );
}

// ── AreaChart SVG ─────────────────────────────────────────────────────────────
function AreaChart({ t, width = 600, height = 220, data }) {
  const padding = { top:12, right:14, bottom:24, left:38 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const max = Math.max(...data.map(d => d.v));
  const min = 0;
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map(d => h - ((d.v - min) / (max - min)) * h);

  // Curva Catmull-Rom -> Bezier para suavidad
  const path = xs.map((x, i) => {
    if (i === 0) return `M ${x},${ys[i]}`;
    const x0 = xs[Math.max(0, i-1)], y0 = ys[Math.max(0, i-1)];
    const x1 = xs[i], y1 = ys[i];
    const cx1 = x0 + (x1 - x0) / 2;
    return `C ${cx1},${y0} ${cx1},${y1} ${x1},${y1}`;
  }).join(' ');

  const area = path + ` L ${xs[xs.length-1]},${h} L ${xs[0]},${h} Z`;
  const accent = t.accent;
  const isLight = t === DST.light;

  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={`area-grad-${isLight ? 'l' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={accent} stopOpacity={isLight ? 0.25 : 0.4}/>
          <stop offset="100%" stopColor={accent} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Grid lines horizontales */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <line key={p} x1={0} x2={w} y1={h * p} y2={h * p}
            stroke={t.border} strokeWidth="1" strokeDasharray="3,4" opacity="0.6"/>
        ))}
        {/* Y axis labels */}
        {[1, 0.5, 0].map(p => (
          <text key={p} x={-8} y={h * (1 - p) + 4} textAnchor="end" fontSize="10" fill={t.muted} fontFamily="monospace">
            ${Math.round(max * p / 1000)}K
          </text>
        ))}
        {/* Área */}
        <path d={area} fill={`url(#area-grad-${isLight ? 'l' : 'd'})`}/>
        {/* Línea */}
        <path d={path} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Puntos */}
        {data.map((d, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]} r={i === data.length - 1 ? 5 : 3.5}
            fill={isLight ? '#fff' : '#0A0A0A'} stroke={accent} strokeWidth={i === data.length - 1 ? 2.5 : 2}/>
        ))}
        {/* Tooltip en el último punto */}
        <g transform={`translate(${xs[xs.length-1]}, ${ys[ys.length-1] - 14})`}>
          <rect x={-30} y={-22} width={60} height={20} rx={4} fill={accent}/>
          <text x={0} y={-8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff" fontFamily={ff}>
            ${Math.round(data[data.length-1].v / 1000)}K
          </text>
        </g>
        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={xs[i]} y={h + 16} textAnchor="middle" fontSize="11" fill={t.muted} fontFamily={ff}>
            {d.l}
          </text>
        ))}
      </g>
    </svg>
  );
}

// ── DonutChart SVG ────────────────────────────────────────────────────────────
function DonutChart({ t, size = 160, data, label, sublabel }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 12;
  const stroke = 22;
  const total = data.reduce((acc, d) => acc + d.v, 0);
  let offset = 0;
  const segments = data.map((d, i) => {
    const len = (d.v / total) * 2 * Math.PI * r;
    const seg = { d, dasharray: `${len} ${2 * Math.PI * r - len}`, offset, color:d.color };
    offset -= len;
    return seg;
  });

  return (
    <svg width={size} height={size} style={{ overflow:'visible' }}>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={s.dasharray} strokeDashoffset={s.offset}/>
        ))}
      </g>
      {/* Label central */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill={t.text} fontFamily={ff}>{label}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill={t.muted} fontFamily={ff}>{sublabel}</text>
    </svg>
  );
}

Object.assign(window, { BO_NAV, BackofficeSidebar, BackofficeTopbar, BackofficeShell, KPICard, AlertBanner, AreaChart, DonutChart, CONFIG_TABS, ConfigTabs, DrawerOverlay, BOPageHeader, Pagination, BOToolbar, BOPrimaryBtn, BOGhostBtn });
