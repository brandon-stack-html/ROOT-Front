const { KpiCard, Card, Badge, Button, Avatar } = window.ROOTDesignSystem_27eeaa;

const NAV = [
  { group: 'Operación', items: [
    { icon: 'layout-dashboard', label: 'Dashboard', active: true },
    { icon: 'shopping-cart', label: 'POS' },
    { icon: 'chef-hat', label: 'KDS' },
    { icon: 'dollar-sign', label: 'Caja' },
  ]},
  { group: 'Gestión', items: [
    { icon: 'package', label: 'Catálogo' },
    { icon: 'archive', label: 'Inventario' },
    { icon: 'users', label: 'Clientes' },
    { icon: 'truck', label: 'Proveedores' },
    { icon: 'receipt', label: 'Gastos' },
  ]},
  { group: 'Nómina', items: [
    { icon: 'wallet', label: 'Nómina' },
    { icon: 'clock', label: 'Adelantos', count: 3 },
    { icon: 'user-check', label: 'Empleados' },
  ]},
  { group: 'Finanzas', items: [
    { icon: 'file-text', label: 'Facturación DIAN' },
    { icon: 'bar-chart-3', label: 'Reportes' },
  ]},
  { group: 'Config', items: [
    { icon: 'settings', label: 'Configuración' },
    { icon: 'user-circle', label: 'Usuarios' },
    { icon: 'shield', label: 'Roles' },
    { icon: 'plug', label: 'Integraciones' },
  ]},
];

const TOP_PRODUCTOS = [
  { n: 'Bandeja Paisa', u: 42, t: '$1.176.000' },
  { n: 'Ajiaco Bogotano', u: 31, t: '$682.000' },
  { n: 'Limonada Natural', u: 88, t: '$616.000' },
  { n: 'Sancocho de Gallina', u: 19, t: '$494.000' },
];

function Icon({ name, style }) { return <i data-lucide={name} style={style}></i>; }

function Sidebar({ active, setActive }) {
  return (
    <aside className="bo-sidebar">
      <div className="bo-sidebar-header">
        <span className="nova-lockup" style={{ fontSize: 18 }}>
          <img className="nova-lockup-mark" src="../../assets/brand/nova-mark.svg" alt="" />
          <span className="nova-wordmark">NOVA</span>
        </span>
        <button className="bo-business-selector" type="button">
          <span className="bo-business-avatar">EB</span>
          <span className="bo-business-info">
            <span className="label">Negocio</span>
            <span className="name">El Buen Sabor</span>
          </span>
          <Icon name="chevrons-up-down" style={{ width: 14, height: 14 }} />
        </button>
      </div>
      <nav className="bo-sidebar-nav">
        {NAV.map((g) => (
          <div className="bo-sidebar-group" key={g.group}>
            <div className="bo-sidebar-group-title">{g.group}</div>
            {g.items.map((it) => (
              <a
                key={it.label}
                className={'bo-sidebar-item' + (active === it.label ? ' is-active' : '')}
                onClick={(e) => { e.preventDefault(); setActive(it.label); }}
                href="#"
              >
                <Icon name={it.icon} />
                {it.label}
                {it.count != null && <span className="badge-count">{it.count}</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="bo-sidebar-footer">
        <span className="bo-user-avatar">JC</span>
        <span className="bo-user-info">
          <span className="name">Juan Camilo</span>
          <span className="role">Administrador</span>
        </span>
        <button className="bo-logout" type="button" aria-label="Cerrar sesión"><Icon name="log-out" /></button>
      </div>
    </aside>
  );
}

function Topbar({ active, onToggleTheme }) {
  return (
    <header className="bo-topbar">
      <nav className="bo-breadcrumb">
        <span className="bo-breadcrumb-item">Inicio</span>
        <span className="bo-breadcrumb-sep"><Icon name="chevron-right" /></span>
        <span className="bo-breadcrumb-item is-active">{active}</span>
      </nav>
      <div className="bo-topbar-spacer"></div>
      <button className="bo-topbar-sucursal" type="button"><Icon name="store" /><span className="label">Sede Norte</span></button>
      <div className="bo-topbar-actions">
        <button className="bo-topbar-icon" aria-label="Buscar"><Icon name="search" /></button>
        <button className="bo-topbar-icon" aria-label="Notificaciones"><Icon name="bell" /><span className="notification-dot"></span></button>
        <button className="bo-topbar-icon" aria-label="Cambiar tema" onClick={onToggleTheme}><Icon name="sun-moon" /></button>
        <button className="bo-topbar-avatar" aria-label="Perfil">JC</button>
      </div>
    </header>
  );
}

function Dashboard() {
  const [period, setPeriod] = React.useState('Hoy');
  return (
    <main className="bo-content">
      <div className="bo-page-header">
        <div>
          <div className="bo-page-title">Buenos días, Juan Camilo</div>
          <div className="bo-page-subtitle">Lunes, 15 de noviembre · Sede Norte</div>
        </div>
        <div className="bo-page-actions">
          <div className="bo-period-toggle">
            {['Hoy', 'Semana', 'Mes'].map((p) => (
              <button key={p} className={period === p ? 'is-active' : ''} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <Button variant="secondary" size="sm" iconLeft={<Icon name="calendar" style={{ width: 13, height: 13 }} />}>15 nov 2026</Button>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Ventas hoy" value="$1.234.000" delta="12% vs ayer" deltaDir="up" icon={<Icon name="dollar-sign" style={{ width: 15, height: 15 }} />} />
        <KpiCard label="Transacciones" value="47" delta="8%" deltaDir="up" icon={<Icon name="receipt" style={{ width: 15, height: 15 }} />} />
        <KpiCard label="Ticket promedio" value="$26.255" delta="3%" deltaDir="down" icon={<Icon name="trending-up" style={{ width: 15, height: 15 }} />} />
        <div className="dian-card ok">
          <div className="dian-card-head">
            <span className="dian-card-label">Estado DIAN</span>
            <div className="dian-icon-wrap"><Icon name="shield-check" style={{ width: 15, height: 15, color: 'var(--success)' }} /></div>
          </div>
          <div className="dian-card-value"><Icon name="check-circle-2" style={{ width: 18, height: 18, color: 'var(--success)' }} />Todo enviado</div>
          <div className="dian-card-detail">24 enviadas · 0 con error</div>
        </div>
      </div>

      <div className="dash-row-2-1">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <div className="dash-card-title">Ventas últimos 7 días</div>
              <div className="dash-card-sub">Total: <strong style={{ color: 'var(--text)' }}>$7.901.000</strong> · Promedio diario: $1.128.714</div>
            </div>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="download" style={{ width: 11, height: 11 }} />}>Exportar</Button>
          </div>
          <svg width="100%" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B98521" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#B98521" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform="translate(38,12)">
              {[0, 43.5, 87, 130.5, 165].map((y, i) => (
                <line key={i} x1="0" x2="548" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,4" opacity="0.6" />
              ))}
              <text x="-8" y="4" textAnchor="end" fontSize="10" fill="var(--muted)" fontFamily="monospace">$1620K</text>
              <text x="-8" y="91" textAnchor="end" fontSize="10" fill="var(--muted)" fontFamily="monospace">$810K</text>
              <text x="-8" y="168" textAnchor="end" fontSize="10" fill="var(--muted)" fontFamily="monospace">$0K</text>
              <path d="M 0,86 C 45.67,86 45.67,72.6 91.33,72.6 C 137,72.6 137,90.2 182.67,90.2 C 228.33,90.2 228.33,53.8 274,53.8 C 319.67,53.8 319.67,25.9 365.33,25.9 C 411,25.9 411,12 456.67,12 C 502.33,12 502.33,41.5 548,41.5 L 548,165 L 0,165 Z" fill="url(#areaGrad)" />
              <path d="M 0,86 C 45.67,86 45.67,72.6 91.33,72.6 C 137,72.6 137,90.2 182.67,90.2 C 228.33,90.2 228.33,53.8 274,53.8 C 319.67,53.8 319.67,25.9 365.33,25.9 C 411,25.9 411,12 456.67,12 C 502.33,12 502.33,41.5 548,41.5" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              {['Mar','Mié','Jue','Vie','Sáb','Dom','Lun'].map((d, i) => (
                <text key={d} x={i * 91.3} y="186" textAnchor="middle" fontSize="10" fill="var(--muted)">{d}</text>
              ))}
            </g>
          </svg>
        </div>

        <Card title="Top productos" meta="Hoy">
          <div className="top-productos">
            {TOP_PRODUCTOS.map((p, i) => (
              <div className="top-producto-item" key={p.n}>
                <span className={'top-producto-rank' + (i === 0 ? ' rank-1' : '')}>{i + 1}</span>
                <span className="top-producto-info">
                  <span className="top-producto-nombre">{p.n}</span>
                  <span className="top-producto-unidades"> · {p.u} uds</span>
                </span>
                <span className="top-producto-total">{p.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function Placeholder({ active }) {
  return (
    <main className="bo-content">
      <div className="bo-page-header"><div><div className="bo-page-title">{active}</div><div className="bo-page-subtitle">Pantalla del producto · ver repo NOVA-Front</div></div></div>
      <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)' }}>
        <Icon name="layout" style={{ width: 18, height: 18 }} />
        Esta vista existe en el producto. Este UI kit demuestra el Dashboard; abre <strong style={{ color: 'var(--text)', margin: '0 4px' }}>Dashboard</strong> para verlo.
      </div>
    </main>
  );
}

function App() {
  const [active, setActive] = React.useState('Dashboard');
  const toggleTheme = () => {
    const el = document.documentElement;
    el.setAttribute('data-theme', el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    setTimeout(() => window.lucide && window.lucide.createIcons(), 0);
  };
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <div className="bo-shell">
      <Sidebar active={active} setActive={setActive} />
      <div className="bo-content-wrap">
        <Topbar active={active} onToggleTheme={toggleTheme} />
        {active === 'Dashboard' ? <Dashboard /> : <Placeholder active={active} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
