// bo-b22-integraciones.jsx — Integraciones externas

const INTEGRACIONES = [
  { grupo:'Pagos', icon:'credit-card', servicios:[
    { id:'wompi',  nombre:'Wompi',           initials:'W',  brandColor:'#2C2A4A',
      desc:'Pagos con tarjeta, Nequi y PSE',                                  estado:'conectado',  homologado:false },
    { id:'epayco', nombre:'ePayco',          initials:'eP', brandColor:'#1FA3FF',
      desc:'Pagos online en tu tienda',                                       estado:'desconectado', homologado:false },
  ]},
  { grupo:'Delivery', icon:'bike', servicios:[
    { id:'rappi',     nombre:'Rappi',     initials:'R',  brandColor:'#FF441F',
      desc:'Recibe pedidos de Rappi automáticamente',                         estado:'conectado',  homologado:false },
    { id:'ubereats',  nombre:'Uber Eats', initials:'UE', brandColor:'#06C167',
      desc:'Sincroniza tu menú y pedidos',                                    estado:'desconectado', homologado:false },
    { id:'didifood',  nombre:'Didi Food', initials:'D',  brandColor:'#FF7E29',
      desc:'Gestiona pedidos Didi desde aquí',                                estado:'desconectado', homologado:false },
    { id:'pedidosya', nombre:'PedidosYa', initials:'PY', brandColor:'#FA0050',
      desc:'Integración de pedidos y menú',                                   estado:'desconectado', homologado:false },
  ]},
  { grupo:'Fiscal', icon:'shield-check', servicios:[
    { id:'matias', nombre:'MATIAS API',  initials:'M',  brandColor:'#7C3AED',
      desc:'Facturación electrónica DIAN',                                    estado:'conectado',  homologado:true },
  ]},
  { grupo:'Comunicación', icon:'message-circle', servicios:[
    { id:'whatsapp', nombre:'WhatsApp Business', initials:'W', brandColor:'#25D366',
      desc:'Notificaciones y pedidos por WhatsApp',                           estado:'desconectado', homologado:false },
    { id:'mailgun',  nombre:'Mailgun',           initials:'Mg',brandColor:'#F06B66',
      desc:'Envío masivo de emails transaccionales',                          estado:'desconectado', homologado:false },
  ]},
];

function ServicioCard({ t, s }) {
  const isLight = t === DST.light;
  const isConectado = s.estado === 'conectado';

  return (
    <div style={{
      padding:'16px 18px',
      background:t.bg,
      border: isConectado
        ? `1px solid ${isLight ? '#86EFAC' : 'rgba(16,185,129,.5)'}`
        : `1px solid ${t.border}`,
      borderRadius:11,
      display:'flex', alignItems:'center', gap:14,
      position:'relative',
    }}>
      {/* Logo */}
      <div style={{
        width:46, height:46, borderRadius:11,
        background: s.brandColor, color:'#fff',
        fontWeight:700, fontSize: s.initials.length > 1 ? 13 : 18,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        boxShadow: `0 1px 3px ${s.brandColor}55`,
      }}>{s.initials}</div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
          <span style={{ fontSize:14, fontWeight:600, color:t.text }}>{s.nombre}</span>
          {s.homologado && (
            <span style={{
              padding:'1px 7px', borderRadius:5,
              background: isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)',
              color: isLight ? '#3730A3' : '#C7D2FE',
              fontSize:9, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
              display:'inline-flex', alignItems:'center', gap:3,
            }}>
              <Icon name="badge-check" size={9} color={isLight ? '#3730A3' : '#C7D2FE'}/>
              Homologado
            </span>
          )}
        </div>
        <div style={{ fontSize:11, color:t.muted, lineHeight:1.4 }}>{s.desc}</div>
      </div>

      {/* Estado + acción */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {isConectado ? (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:11,
            background: isLight ? '#DCFCE7' : 'rgba(16,185,129,.18)',
            color: isLight ? '#14532D' : '#86EFAC',
            fontSize:11, fontWeight:600,
          }}>
            <Icon name="check-circle" size={11} color={isLight ? '#14532D' : '#86EFAC'} strokeWidth={2.4}/>
            Conectado
          </span>
        ) : (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:11,
            background: t.alt,
            color: t.muted,
            fontSize:11, fontWeight:500,
          }}>
            <span style={{ width:6, height:6, borderRadius:3, background:t.muted }}/>
            Desconectado
          </span>
        )}
        <button style={{
          padding:'7px 14px', borderRadius:7,
          background: isConectado ? t.bg : t.accent,
          border: isConectado ? `1px solid ${t.border}` : 'none',
          color: isConectado ? t.text : '#fff',
          cursor:'pointer', fontFamily:ff,
          fontSize:12, fontWeight:600,
          display:'flex', alignItems:'center', gap:5,
        }}>
          {isConectado ? (
            <>
              <Icon name="settings" size={11} color={t.muted}/>
              Configurar
            </>
          ) : (
            <>
              <Icon name="plug" size={11} color="#fff" strokeWidth={2.4}/>
              Conectar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function BOB22Integraciones({ t }) {
  const totalConectados = INTEGRACIONES.reduce((acc, g) => acc + g.servicios.filter(s => s.estado === 'conectado').length, 0);
  const totalServicios = INTEGRACIONES.reduce((acc, g) => acc + g.servicios.length, 0);

  return (
    <BackofficeShell t={t} active="config" breadcrumb={['Configuración', 'Integraciones']}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Integraciones"
          subtitle={`${totalConectados} de ${totalServicios} servicios conectados`}
          actions={<BOGhostBtn t={t} icon="book-open">Ver documentación</BOGhostBtn>}
        />

        {/* Intro */}
        <div style={{
          padding:'16px 20px', borderRadius:11, marginBottom:24,
          background: t === DST.light ? 'linear-gradient(90deg, #EEF2FF, #FAFAFA)' : 'linear-gradient(90deg, rgba(99,102,241,.16), transparent)',
          border:`1px solid ${t === DST.light ? '#E0E7FF' : 'rgba(99,102,241,.3)'}`,
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{
            width:42, height:42, borderRadius:10, background:t.accent,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <Icon name="puzzle" size={20} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Conecta Inventario con los servicios que ya usas</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:3 }}>Recibe pedidos de delivery, factura electrónicamente y procesa pagos sin salir de aquí.</div>
          </div>
        </div>

        {/* Grupos */}
        {INTEGRACIONES.map(g => (
          <div key={g.grupo} style={{ marginBottom:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <Icon name={g.icon} size={14} color={t.muted}/>
              <div style={{ fontSize:11, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>
                {g.grupo}
              </div>
              <div style={{ flex:1, height:1, background:t.border }}/>
              <span style={{ fontSize:10, color:t.muted, fontVariantNumeric:'tabular-nums' }}>
                {g.servicios.filter(s => s.estado === 'conectado').length} / {g.servicios.length} conectados
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {g.servicios.map(s => <ServicioCard key={s.id} t={t} s={s}/>)}
            </div>
          </div>
        ))}
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB22Integraciones });
