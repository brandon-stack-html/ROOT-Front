// bo-b17-dian.jsx — Facturación electrónica DIAN

const DIAN_TABS = [
  { id:'todos',    label:'Todas',                count:47, active:true },
  { id:'facturas', label:'Facturas al cliente',  count:12 },
  { id:'pos',      label:'Tiquetes de caja',     count:33 },
  { id:'notas',    label:'Notas crédito',        count:2 },
];

const DIAN_DOCS = [
  { num:'FEV-00123', cliente:'Juan Restrepo',     tipo:'Factura al cliente', total:134000,  estado:'enviada',   fecha:'19:34' },
  { num:'POS-00456', cliente:'Consumidor final',  tipo:'Tiquete de caja',    total:88000,   estado:'enviada',   fecha:'19:28' },
  { num:'POS-00455', cliente:'Consumidor final',  tipo:'Tiquete de caja',    total:45000,   estado:'enviando',  fecha:'19:25' },
  { num:'FEV-00122', cliente:'Andrea López',      tipo:'Factura al cliente', total:210000,  estado:'enviada',   fecha:'18:55' },
  { num:'NC-00018',  cliente:'Juan Restrepo',     tipo:'Nota crédito',       total:-30000,  estado:'enviada',   fecha:'18:40' },
  { num:'POS-00454', cliente:'Consumidor final',  tipo:'Tiquete de caja',    total:67000,   estado:'enviada',   fecha:'18:12' },
  { num:'FEV-00121', cliente:'Café El Portal',    tipo:'Factura al cliente', total:485000,  estado:'enviada',   fecha:'17:48' },
];

const REMISIONES = [
  { num:'REM-00023', cliente:'Eventos Bogotá SAS', monto:320000, dias:32 },
  { num:'REM-00024', cliente:'Café El Portal',     monto:145000, dias:22 },
  { num:'REM-00025', cliente:'Juan Restrepo',      monto:67000,  dias:8  },
];

// Estado en lenguaje humano
function EstadoDIAN({ t, estado }) {
  const isLight = t === DST.light;
  const map = {
    enviada:    { bg: isLight ? '#DCFCE7' : 'rgba(16,185,129,.18)', color: isLight ? '#14532D' : '#86EFAC', icon:'check-circle', label:'Enviada a la DIAN' },
    enviando:   { bg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)', color: isLight ? '#92400E' : '#FDE68A', icon:'loader',       label:'Enviando…' },
    error:      { bg: isLight ? '#FEE2E2' : 'rgba(239,68,68,.18)',  color: isLight ? '#7F1D1D' : '#FCA5A5', icon:'x-circle',     label:'Error — ver' },
    sin:        { bg: isLight ? '#F4F4F5' : 'rgba(161,161,170,.18)',color: isLight ? '#52525B' : '#D4D4D8', icon:'circle',       label:'Sin factura (ok)' },
  };
  const e = map[estado];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:11,
      fontSize:11, fontWeight:600,
      background:e.bg, color:e.color,
    }}>
      <Icon name={e.icon} size={11} color={e.color} strokeWidth={2.2}/>
      {e.label}
    </span>
  );
}

function TipoChip({ t, tipo }) {
  const isLight = t === DST.light;
  const map = {
    'Factura al cliente': { bg: isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)', color: isLight ? '#3730A3' : '#C7D2FE' },
    'Tiquete de caja':    { bg: isLight ? '#F4F4F5' : 'rgba(161,161,170,.18)',color: isLight ? '#3F3F46' : '#D4D4D8' },
    'Nota crédito':       { bg: isLight ? '#FCE7F3' : 'rgba(236,72,153,.18)', color: isLight ? '#9D174D' : '#FBCFE8' },
  };
  const c = map[tipo] || { bg:t.alt, color:t.muted };
  return (
    <span style={{
      padding:'2px 7px', borderRadius:7,
      background:c.bg, color:c.color,
      fontSize:10, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
    }}>{tipo}</span>
  );
}

// ProgressBar 30 días — color según rango
function ProgressBar30d({ t, dias }) {
  const isLight = t === DST.light;
  const pct = Math.min(100, (dias / 30) * 100);
  let color, dotColor;
  if (dias >= 30)      { color = DST.error;   dotColor = '🔴'; }
  else if (dias >= 26) { color = '#F97316';   dotColor = '🟠'; } // naranja
  else if (dias >= 21) { color = DST.warning; dotColor = '🟡'; }
  else                 { color = DST.success; dotColor = '🟢'; }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:ff }}>
      <div style={{
        flex:1, height:6, borderRadius:3,
        background: isLight ? '#F4F4F5' : 'rgba(255,255,255,.06)',
        overflow:'hidden',
      }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:3 }}/>
      </div>
      <span style={{ width:8, height:8, borderRadius:4, background:color, flexShrink:0 }}/>
    </div>
  );
}

function BOB17Dian({ t }) {
  const isLight = t === DST.light;

  return (
    <BackofficeShell t={t} active="facturacion" breadcrumb={['Finanzas', 'Facturación DIAN']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Facturación electrónica DIAN"
          subtitle="Resolución 18760000123 · Vigente hasta 12 jun 2027"
          actions={
            <>
              <BOGhostBtn t={t} icon="settings">Configurar resolución</BOGhostBtn>
              <BOGhostBtn t={t} icon="download">Descargar reporte</BOGhostBtn>
            </>
          }
        />

        {/* Banner verde de conexión (conservado por decisión de producto) */}
        <div style={{
          padding:'12px 16px', borderRadius:10, marginBottom:18,
          background: isLight ? '#F0FDF4' : 'rgba(16,185,129,.10)',
          border:`1px solid ${isLight ? '#BBF7D0' : 'rgba(16,185,129,.4)'}`,
          display:'flex', alignItems:'center', gap:11,
        }}>
          <div style={{ width:34, height:34, borderRadius:9, background:DST.success, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="shield-check" size={17} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Conexión con DIAN activa</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>Última sincronización: hace 1 minuto · Cola: 0 documentos</div>
          </div>
          <span style={{
            padding:'4px 10px', borderRadius:11,
            background:DST.success, color:'#fff',
            fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5,
          }}>
            <span className="dian-pulse" style={{ width:6, height:6, borderRadius:3, background:'#fff' }}/>
            En línea
          </span>
        </div>

        {/* BLOQUE 1 — Semáforo */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:18 }}>
          <KPICard t={t} tone="success" label="Enviadas a la DIAN" value="24" icon="check-circle"/>
          <KPICard t={t} tone="warning" label="Enviando…"          value="3"  icon="loader" pulse helper="En cola con la DIAN"/>
          <KPICard t={t} tone="error"   label="Con error"          value="1"  icon="alert-circle" helper="Requieren acción"/>
          <KPICard t={t} tone="muted"   label="Sin respuesta +24h" value="2"  icon="clock" helper="Límite 48h"/>
        </div>

        {/* BLOQUE 2 — Facturas con error */}
        <AlertBanner
          t={t}
          title="Estas facturas necesitan tu atención"
          icon="alert-circle"
          items={[
            {
              meta: 'Factura al cliente · $210.000 · hace 2 horas',
              title: 'El número de identidad del cliente no es válido',
              helper: '¿Qué hago? Tienes dos opciones:',
              actions: [
                { label: 'Cambiar a consumidor final', primary: true },
                { label: 'Corregir los datos del cliente' },
              ],
            },
          ]}
        />

        {/* BLOQUE 3 — Remisiones sin facturar */}
        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, marginBottom:18, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:t.text }}>Remisiones pendientes de facturar</div>
              <div style={{ fontSize:11, color:t.muted, marginTop:2 }}>La DIAN exige facturar cada remisión antes de los 30 días</div>
            </div>
            <a style={{ fontSize:11, color:t.accent, cursor:'pointer', fontWeight:500 }}>Ver todas →</a>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1.6fr 1fr 0.8fr 1.4fr 1.6fr',
            padding:'10px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Remisión</div>
            <div>Cliente</div>
            <div style={{ textAlign:'right' }}>Monto</div>
            <div>Días</div>
            <div>Progreso</div>
            <div style={{ textAlign:'right' }}>Acciones</div>
          </div>
          {REMISIONES.map((r, i) => {
            const enRiesgo = r.dias >= 30;
            return (
              <div key={i} style={{
                display:'grid',
                gridTemplateColumns:'1fr 1.6fr 1fr 0.8fr 1.4fr 1.6fr',
                padding:'13px 18px', alignItems:'center',
                borderBottom: i < REMISIONES.length - 1 ? `1px solid ${t.border}` : 'none',
                background: enRiesgo ? (isLight ? 'rgba(239,68,68,.04)' : 'rgba(239,68,68,.06)') : 'transparent',
              }}>
                <div style={{ fontSize:12, color:t.text, fontWeight:600, fontFamily:'monospace' }}>{r.num}</div>
                <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{r.cliente}</div>
                <div style={{ textAlign:'right', fontSize:13, color:t.text, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(r.monto)}</div>
                <div style={{
                  fontSize:12, fontWeight:600, fontVariantNumeric:'tabular-nums',
                  color: enRiesgo ? DST.error : (r.dias >= 26 ? '#F97316' : (r.dias >= 21 ? DST.warning : t.text)),
                }}>{r.dias} días</div>
                <ProgressBar30d t={t} dias={r.dias}/>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:6 }}>
                  <button style={{
                    padding:'5px 10px', borderRadius:6, background:t.accent, color:'#fff',
                    border:'none', cursor:'pointer', fontFamily:ff, fontSize:11, fontWeight:600,
                  }}>Facturar</button>
                  <button style={{
                    padding:'5px 10px', borderRadius:6, background:t.bg, color:t.text,
                    border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff, fontSize:11, fontWeight:500,
                  }}>Devolver</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BLOQUE 4 — Historial (tabs + tabla) */}
        <div style={{
          display:'flex', gap:2, borderBottom:`1px solid ${t.border}`,
          marginBottom:14, fontFamily:ff,
        }}>
          {DIAN_TABS.map(tab => (
            <button key={tab.id} style={{
              padding:'10px 16px', border:'none', background:'transparent', cursor:'pointer',
              fontFamily:ff, fontSize:13, fontWeight: tab.active ? 600 : 500,
              color: tab.active ? t.text : t.muted,
              borderBottom:`2px solid ${tab.active ? t.accent : 'transparent'}`,
              marginBottom:-1, display:'flex', alignItems:'center', gap:7,
            }}>
              {tab.label}
              <span style={{
                padding:'1px 7px', borderRadius:8,
                background: tab.active ? (isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)') : t.alt,
                color: tab.active ? t.accent : t.muted,
                fontSize:10, fontWeight:600,
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1.1fr 1.5fr 1.1fr 1fr 1.4fr 0.7fr 50px',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Número</div>
            <div>Cliente</div>
            <div>Tipo</div>
            <div style={{ textAlign:'right' }}>Total</div>
            <div>Estado</div>
            <div>Hora</div>
            <div></div>
          </div>
          {DIAN_DOCS.map((d, i) => (
            <div key={i} style={{
              display:'grid',
              gridTemplateColumns:'1.1fr 1.5fr 1.1fr 1fr 1.4fr 0.7fr 50px',
              padding:'13px 18px', alignItems:'center',
              borderBottom: i < DIAN_DOCS.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{ fontSize:12, color:t.text, fontWeight:600, fontFamily:'monospace' }}>{d.num}</div>
              <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{d.cliente}</div>
              <div><TipoChip t={t} tipo={d.tipo}/></div>
              <div style={{ textAlign:'right', fontSize:13, color: d.total < 0 ? DST.error : t.text, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>
                {d.total < 0 ? `−${fmtCOP(Math.abs(d.total))}` : fmtCOP(d.total)}
              </div>
              <div><EstadoDIAN t={t} estado={d.estado}/></div>
              <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{d.fecha}</div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <Icon name="more-horizontal" size={15} color={t.muted}/>
              </div>
            </div>
          ))}
          <Pagination t={t} current={1} totalPages={7} label="Mostrando 1–7 de 47 documentos del día"/>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB17Dian, EstadoDIAN, TipoChip, ProgressBar30d });
