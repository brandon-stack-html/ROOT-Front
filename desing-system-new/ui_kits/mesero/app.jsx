const { Button, Badge, Card } = window.ROOTDesignSystem_27eeaa;

function Icon({ name, style }) { return <i data-lucide={name} style={style}></i>; }

const MESAS = {
  'Salón Principal': [
    { n: 1, estado: 'libre' },
    { n: 2, estado: 'ocupada', com: 4, total: '$86.000' },
    { n: 3, estado: 'por-cobrar', com: 2, total: '$48.500' },
    { n: 4, estado: 'libre' },
    { n: 5, estado: 'ocupada', com: 3, total: '$62.000' },
    { n: 6, estado: 'reservada' },
  ],
  'Terraza': [
    { n: 11, estado: 'libre' },
    { n: 12, estado: 'ocupada', com: 2, total: '$39.000' },
  ],
};

const ESTADO_LABEL = { libre: 'Libre', ocupada: 'Ocupada', 'por-cobrar': 'Por cobrar', reservada: 'Reservada' };
const ESTADO_TONE = { ocupada: 'danger', 'por-cobrar': 'warning', reservada: 'info', libre: 'muted' };

function StatusBar() {
  return (
    <div className="mesero-statusbar">
      <span>9:41</span>
      <div className="mesero-statusbar-icons">
        <Icon name="signal" /><Icon name="wifi" /><Icon name="battery-full" />
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'mesas', icon: 'layout-grid', label: 'Mesas' },
    { id: 'comandas', icon: 'clipboard-list', label: 'Comandas', badge: 2 },
    { id: 'nomina', icon: 'wallet', label: 'Nómina' },
    { id: 'perfil', icon: 'user', label: 'Mi perfil' },
  ];
  return (
    <nav className="mesero-bottom-nav">
      {tabs.map((t) => (
        <a key={t.id} href="#" className={'mesero-bottom-nav-tab' + (tab === t.id ? ' is-active' : '')}
           onClick={(e) => { e.preventDefault(); setTab(t.id); }}>
          <span className="mesero-bottom-nav-tab-icon-wrap">
            <Icon name={t.icon} />
            {t.badge && <span className="mesero-bottom-nav-tab-badge">{t.badge}</span>}
          </span>
          <span>{t.label}</span>
        </a>
      ))}
    </nav>
  );
}

function MesasScreen() {
  return (
    <>
      <header className="mesero-topbar">
        <div className="mesero-topbar-side">
          <button className="mesero-zona-btn"><Icon name="map-pin" />Sede Norte</button>
        </div>
        <div className="mesero-topbar-center">
          <div className="mesero-topbar-title">Mesas</div>
          <div className="mesero-topbar-subtitle">Camila Rojas</div>
        </div>
        <div className="mesero-topbar-side">
          <button className="mesero-icon-btn"><Icon name="refresh-cw" /></button>
        </div>
      </header>
      <main className="mesero-content">
        {Object.entries(MESAS).map(([zona, mesas]) => (
          <div key={zona}>
            <div className="zona-label">{zona}</div>
            <div className="mesa-grid">
              {mesas.map((m) => (
                <div key={m.n} className={'mesa-card ' + m.estado}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="mesa-num">{String(m.n).padStart(2, '0')}</span>
                    <Badge tone={ESTADO_TONE[m.estado]} dot size="sm">{ESTADO_LABEL[m.estado]}</Badge>
                  </div>
                  {m.estado === 'libre' || m.estado === 'reservada'
                    ? <span className="mesa-meta">{m.estado === 'reservada' ? '19:30 · 4 pers.' : 'Tocar para abrir'}</span>
                    : <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="mesa-meta">{m.com} comensales</span>
                        <span className="mesa-total">{m.total}</span>
                      </div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

function NominaScreen() {
  return (
    <>
      <header className="mesero-topbar">
        <div className="mesero-topbar-side" style={{ width: 34 }}></div>
        <div className="mesero-topbar-center"><div className="mesero-topbar-title">Mi nómina</div></div>
        <div className="mesero-topbar-side"><button className="mesero-icon-btn"><Icon name="history" /></button></div>
      </header>
      <main className="mesero-content">
        <div className="nom-hero">
          <div className="nom-hero-label">Próximo pago</div>
          <div className="nom-hero-count">en 6 días</div>
          <div className="nom-hero-date">Quincenal · 30 de noviembre</div>
          <div className="nom-progress"><span style={{ width: '60%' }}></span></div>
          <div className="nom-progress-meta"><span>Periodo 60%</span><span>$974.100 devengado</span></div>
        </div>
        <Card>
          <div className="nom-row"><span className="k">Salario base</span><span className="v">$1.623.500</span></div>
          <div className="nom-row"><span className="k">Devengado a la fecha</span><span className="v">$974.100</span></div>
          <div className="nom-row"><span className="k">Adelantos del periodo</span><span className="v">$200.000</span></div>
          <div className="nom-row"><span className="k">Disponible para adelanto</span><span className="v" style={{ color: 'var(--accent)' }}>$287.050</span></div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <Button variant="primary" size="touch" fullWidth iconLeft={<Icon name="hand-coins" style={{ width: 16, height: 16 }} />}>Solicitar adelanto</Button>
          <Button variant="secondary" size="touch" fullWidth>Ver mis adelantos</Button>
        </div>
      </main>
    </>
  );
}

function SimpleScreen({ title, icon, note }) {
  return (
    <>
      <header className="mesero-topbar">
        <div className="mesero-topbar-side" style={{ width: 34 }}></div>
        <div className="mesero-topbar-center"><div className="mesero-topbar-title">{title}</div></div>
        <div className="mesero-topbar-side" style={{ width: 34 }}></div>
      </header>
      <main className="mesero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)', gap: 12 }}>
        <Icon name={icon} style={{ width: 30, height: 30 }} />
        <div style={{ fontSize: 13, maxWidth: 220, lineHeight: 1.5 }}>{note}</div>
      </main>
    </>
  );
}

function App() {
  const [tab, setTab] = React.useState('mesas');
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  let screen;
  if (tab === 'mesas') screen = <MesasScreen />;
  else if (tab === 'nomina') screen = <NominaScreen />;
  else if (tab === 'comandas') screen = <SimpleScreen title="Comandas" icon="clipboard-list" note="Comandas activas del mesero en cocina y barra. 2 en preparación." />;
  else screen = <SimpleScreen title="Mi perfil" icon="user" note="Camila Rojas · emp-001 · Sede Norte. Propinas, sesión y ajustes." />;
  return (
    <div className="mesero-stage">
      <div className="mesero-frame">
        <div className="mesero-app">
          <StatusBar />
          <div className="mesero-body-inner">
            {screen}
            <BottomNav tab={tab} setTab={setTab} />
          </div>
          <div className="mesero-home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
