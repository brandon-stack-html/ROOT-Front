function Icon({ name, style }) { return <i data-lucide={name} style={style}></i>; }

const CATS = ['Todo', 'Bandejas', 'Sopas', 'Bebidas', 'Postres'];

const PRODS = [
  { n: 'Bandeja Paisa', d: 'Frijoles, arroz, carne molida, chicharrón, huevo, plátano y arepa.', p: 28000, c: 'Bandejas', img: '#B96B3A', badge: 'Top ventas', ic: 'utensils' },
  { n: 'Ajiaco Bogotano', d: 'Tres papas, pollo, mazorca, alcaparras y crema. Con aguacate.', p: 22000, c: 'Sopas', img: '#B98521', ic: 'soup' },
  { n: 'Sancocho de Gallina', d: 'Gallina criolla, yuca, plátano y mazorca. Servido con arroz.', p: 26000, c: 'Sopas', img: '#9A6E15', ic: 'soup' },
  { n: 'Limonada Natural', d: 'Limón exprimido al momento. Endulzada al gusto.', p: 7000, c: 'Bebidas', img: '#1E40AF', ic: 'cup-soda' },
  { n: 'Jugo de Lulo', d: 'Pulpa de lulo fresca en agua o leche.', p: 8000, c: 'Bebidas', img: '#22C55E', ic: 'cup-soda' },
  { n: 'Postre de Natas', d: 'Postre tradicional bogotano con uvas pasas y canela.', p: 9500, c: 'Postres', img: '#F59E0B', ic: 'cake-slice' },
];

const fmt = (n) => '$' + n.toLocaleString('es-CO');

function App() {
  const [cat, setCat] = React.useState('Todo');
  const [count, setCount] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const add = (p) => { setCount((c) => c + 1); setTotal((t) => t + p.p); };
  const shown = PRODS.filter((p) => cat === 'Todo' || p.c === cat);

  return (
    <div className="sf">
      <header className="sf-header">
        <div className="sf-wrap sf-header-row">
          <a className="sf-brand" href="#">
            <span className="sf-bs-logo">BS</span>
            <span><span className="sf-brand-name">El Buen Sabor</span><br /><span className="sf-brand-sub">Restaurante · Bogotá</span></span>
          </a>
          <nav className="sf-nav">
            <a href="#" className="is-active">Inicio</a>
            <a href="#">Carta</a>
            <a href="#">Sucursales</a>
            <a href="#">Nosotros</a>
            <a href="#">Contacto</a>
          </nav>
          <div className="sf-actions">
            <button className="sf-icon-btn" aria-label="Buscar"><Icon name="search" /></button>
            <a className="sf-login" href="#">Iniciar sesión</a>
            <button className="sf-cart-btn"><Icon name="shopping-cart" />Carrito<span className="sf-cart-count">{count}</span></button>
          </div>
        </div>
      </header>

      <div className="sf-wrap">
        <section className="sf-hero">
          <div className="sf-hero-pattern" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => <Icon key={i} name={['utensils', 'soup', 'cup-soda', 'cake-slice', 'coffee'][i % 5]} />)}
          </div>
          <div className="sf-hero-content">
            <span className="sf-hero-eyebrow"><Icon name="map-pin" style={{ width: 12, height: 12 }} />Bogotá · Domicilios y para llevar</span>
            <h1 className="sf-hero-title">El sabor de Colombia<br />en tu puerta</h1>
            <p className="sf-hero-sub">Pedidos a domicilio sin comisiones, hechos directamente por nosotros. Fresco y caliente en 30–45 minutos.</p>
            <a className="sf-hero-cta" href="#productos">Pedir ahora<Icon name="arrow-right" /></a>
          </div>
          <div className="sf-hero-chips">
            <span className="sf-hero-chip"><Icon name="truck" />Envío gratis desde $30.000</span>
            <span className="sf-hero-chip"><Icon name="clock" />Promedio 35 min</span>
            <span className="sf-hero-chip"><Icon name="star" />4.8 · 240 reseñas</span>
          </div>
        </section>

        <div className="sf-section-head" id="productos">
          <span className="sf-section-title">Nuestra carta</span>
          <a className="sf-section-link" href="#">Ver todo →</a>
        </div>
        <div className="sf-cats">
          {CATS.map((c) => (
            <button key={c} className={'sf-cat' + (cat === c ? ' is-active' : '')} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="sf-grid">
          {shown.map((p) => (
            <article className="sf-prod" key={p.n}>
              <div className="sf-prod-img" style={{ background: `linear-gradient(135deg, ${p.img}, ${p.img}99)` }}>
                <Icon name={p.ic} />
                {p.badge && <span className="sf-prod-badge">{p.badge}</span>}
              </div>
              <div className="sf-prod-body">
                <div className="sf-prod-name">{p.n}</div>
                <div className="sf-prod-desc">{p.d}</div>
                <div className="sf-prod-foot">
                  <span className="sf-prod-price">{fmt(p.p)}</span>
                  <button className="sf-add" aria-label={'Agregar ' + p.n} onClick={() => add(p)}><Icon name="plus" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="sf-footer">
          <div className="sf-footer-row">
            <span>© 2026 El Buen Sabor · Cra. 15 #80-32, Bogotá · NIT 900.123.456-7</span>
            <span className="sf-pay">Pagos: <span>Visa</span><span>Mastercard</span><span>PSE</span><span>Wompi</span></span>
          </div>
        </footer>
      </div>

      <div className={'sf-cartbar' + (count === 0 ? ' is-hidden' : '')}>
        <span className="sf-cartbar-info">{count} {count === 1 ? 'producto' : 'productos'} · <b>{fmt(total)}</b></span>
        <button className="sf-cartbar-cta"><Icon name="shopping-bag" />Ir al checkout</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
