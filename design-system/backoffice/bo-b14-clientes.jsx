// bo-b14-clientes.jsx — Clientes (con drawer detalle abierto)

const CLIENTES = [
  { iniciales:'JR', avBg:'#BBF7D0', avFg:'#14532D',
    nombre:'Juan Restrepo',     id:'CC 1.020.345.678', email:'juan.r@gmail.com',     tel:'315 234 5678', saldo:0,      ultima:'Hoy 19:34' },
  { iniciales:'AL', avBg:'#FCA5A5', avFg:'#7F1D1D',
    nombre:'Andrea López',      id:'CC 1.030.456.789', email:'andrea.l@gmail.com',   tel:'311 345 6789', saldo:45000,  ultima:'Ayer',       active:true },
  { iniciales:'EP', avBg:'#FED7AA', avFg:'#9A3412',
    nombre:'Café El Portal',    id:'NIT 900.234.567',  email:'compras@elportal.co',  tel:'601 345 6789', saldo:0,      ultima:'Hace 3 días' },
  { iniciales:'MR', avBg:'#DDD6FE', avFg:'#5B21B6',
    nombre:'María Rodríguez',   id:'CC 1.040.567.890', email:'maria.r@hotmail.com',  tel:'318 456 7890', saldo:120000, ultima:'Hace 1 sem.' },
];

const MOVIMIENTOS_CTA = [
  { fecha:'14 nov', concepto:'Venta Mesa 3',         cargo:45000,  abono:0,      saldo:45000 },
  { fecha:'10 nov', concepto:'Abono efectivo',       cargo:0,      abono:30000,  saldo:0 },
  { fecha:'8 nov',  concepto:'Venta Mostrador #122', cargo:30000,  abono:0,      saldo:30000 },
  { fecha:'5 nov',  concepto:'Abono transferencia',  cargo:0,      abono:65000,  saldo:0 },
  { fecha:'2 nov',  concepto:'Venta Mesa 7',         cargo:65000,  abono:0,      saldo:65000 },
];

function ClienteRow({ t, c }) {
  const tieneDeuda = c.saldo > 0;
  const isActive = c.active;
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'1.6fr 1.4fr 1.5fr 1fr 1fr 1fr 50px',
      padding:'13px 18px', alignItems:'center',
      borderBottom:`1px solid ${t.border}`,
      background: isActive ? (t === DST.light ? '#EEF2FF' : 'rgba(99,102,241,.10)') : 'transparent',
      cursor:'pointer',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <div style={{
          width:32, height:32, borderRadius:16,
          background:c.avBg, color:c.avFg,
          fontWeight:600, fontSize:12,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>{c.iniciales}</div>
        <span style={{ fontSize:13, fontWeight:600, color:t.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.nombre}</span>
      </div>
      <div style={{ fontSize:12, color:t.muted, fontFamily:'monospace' }}>{c.id}</div>
      <div style={{ fontSize:12, color:t.muted, fontFamily:'monospace', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.email}</div>
      <div style={{ fontSize:12, color:t.text, fontVariantNumeric:'tabular-nums' }}>{c.tel}</div>
      <div style={{
        fontSize:13, fontWeight: tieneDeuda ? 700 : 500,
        color: tieneDeuda ? DST.error : t.muted,
        fontVariantNumeric:'tabular-nums',
        display:'flex', alignItems:'center', gap:6,
      }}>
        {tieneDeuda && <span style={{ width:7, height:7, borderRadius:4, background:DST.error }}/>}
        {fmtCOP(c.saldo)}
      </div>
      <div style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{c.ultima}</div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <Icon name="more-horizontal" size={15} color={t.muted}/>
      </div>
    </div>
  );
}

function BOB14Clientes({ t }) {
  const isLight = t === DST.light;
  const drawerContent = (
    <DrawerOverlay
      t={t}
      title="Andrea López"
      subtitle="Cliente desde marzo 2024"
      width={520}
      footer={[
        <button key="cancel" style={{
          padding:'9px 16px', borderRadius:8, background:'transparent',
          border:`1px solid ${t.border}`, color:t.text, cursor:'pointer',
          fontFamily:ff, fontSize:13, fontWeight:500,
        }}>Cerrar</button>,
        <button key="abono" style={{
          padding:'9px 18px', borderRadius:8, background:DST.success,
          border:'none', color:'#fff', cursor:'pointer',
          fontFamily:ff, fontSize:13, fontWeight:600,
          display:'flex', alignItems:'center', gap:6,
        }}>
          <Icon name="plus" size={13} color="#fff" strokeWidth={2.4}/>
          Registrar abono
        </button>,
      ]}
    >
      {/* Info cliente */}
      <div style={{
        padding:'14px 16px', borderRadius:10,
        background:t.alt, border:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', gap:14, marginBottom:18,
      }}>
        <div style={{
          width:54, height:54, borderRadius:27,
          background:'#FCA5A5', color:'#7F1D1D',
          fontWeight:700, fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>AL</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:3 }}>Andrea López</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{
              padding:'2px 8px', borderRadius:11,
              background: isLight ? '#DBEAFE' : 'rgba(59,130,246,.18)',
              color: isLight ? '#1E40AF' : '#93C5FD',
              fontSize:10, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
            }}>Cuenta corriente</span>
            <span style={{
              padding:'2px 8px', borderRadius:11,
              background: isLight ? '#FCE7F3' : 'rgba(236,72,153,.18)',
              color: isLight ? '#9D174D' : '#FBCFE8',
              fontSize:10, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
            }}>VIP · 32 visitas</span>
          </div>
        </div>
      </div>

      {/* Datos contacto */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {[
          { icon:'mail',         label:'Email',     value:'andrea.l@gmail.com' },
          { icon:'phone',        label:'Teléfono',  value:'311 345 6789' },
          { icon:'credit-card',  label:'Cédula',    value:'CC 1.030.456.789' },
          { icon:'map-pin',      label:'Dirección', value:'Cl. 72 #11-34, Bogotá' },
        ].map(d => (
          <div key={d.label} style={{ display:'flex', alignItems:'center', gap:11 }}>
            <div style={{
              width:30, height:30, borderRadius:7, background:t.alt,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <Icon name={d.icon} size={14} color={t.muted}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase', fontWeight:600 }}>{d.label}</div>
              <div style={{ fontSize:13, color:t.text, fontWeight:500 }}>{d.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Saldo destacado */}
      <div style={{
        padding:'16px 18px', borderRadius:11,
        background: isLight ? '#FEF2F2' : 'rgba(239,68,68,.10)',
        border:`1px solid ${isLight ? '#FECACA' : 'rgba(239,68,68,.4)'}`,
        display:'flex', alignItems:'center', gap:14, marginBottom:18,
      }}>
        <Icon name="alert-circle" size={22} color={DST.error}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color: isLight ? '#7F1D1D' : '#FCA5A5', fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>Saldo cuenta corriente</div>
          <div style={{ fontSize:24, fontWeight:700, color:DST.error, fontVariantNumeric:'tabular-nums', letterSpacing:'-.01em', marginTop:2 }}>{fmtCOP(45000)}</div>
        </div>
        <div style={{ fontSize:11, color:t.muted, textAlign:'right' }}>
          Cupo total<br/>
          <span style={{ color:t.text, fontWeight:600, fontSize:12 }}>{fmtCOP(200000)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:'flex', gap:2, borderBottom:`1px solid ${t.border}`, marginBottom:14,
      }}>
        {[
          { l:'Historial de compras', active:false, count:32 },
          { l:'Movimientos cta. corriente', active:true, count:5 },
        ].map(tab => (
          <button key={tab.l} style={{
            padding:'10px 14px', border:'none', background:'transparent', cursor:'pointer',
            fontFamily:ff, fontSize:12, fontWeight: tab.active ? 600 : 500,
            color: tab.active ? t.text : t.muted,
            borderBottom:`2px solid ${tab.active ? t.accent : 'transparent'}`,
            marginBottom:-1, display:'flex', alignItems:'center', gap:6,
          }}>
            {tab.l}
            <span style={{
              padding:'1px 6px', borderRadius:7,
              background: tab.active ? (isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)') : t.alt,
              color: tab.active ? t.accent : t.muted,
              fontSize:10, fontWeight:600,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tabla movimientos */}
      <div style={{
        background:t.bg, border:`1px solid ${t.border}`, borderRadius:9, overflow:'hidden',
      }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'0.6fr 1.4fr 0.9fr 0.9fr 0.9fr',
          padding:'9px 14px', background:t.alt, borderBottom:`1px solid ${t.border}`,
          fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
        }}>
          <div>Fecha</div>
          <div>Concepto</div>
          <div style={{ textAlign:'right' }}>Cargo</div>
          <div style={{ textAlign:'right' }}>Abono</div>
          <div style={{ textAlign:'right' }}>Saldo</div>
        </div>
        {MOVIMIENTOS_CTA.map((m, i) => (
          <div key={i} style={{
            display:'grid',
            gridTemplateColumns:'0.6fr 1.4fr 0.9fr 0.9fr 0.9fr',
            padding:'10px 14px', alignItems:'center',
            borderBottom: i < MOVIMIENTOS_CTA.length - 1 ? `1px solid ${t.border}` : 'none',
            fontSize:12,
          }}>
            <div style={{ color:t.muted, fontVariantNumeric:'tabular-nums' }}>{m.fecha}</div>
            <div style={{ color:t.text, fontWeight:500 }}>{m.concepto}</div>
            <div style={{ textAlign:'right', color: m.cargo ? DST.error : t.muted, fontVariantNumeric:'tabular-nums', fontWeight: m.cargo ? 600 : 400 }}>
              {m.cargo ? fmtCOP(m.cargo) : '—'}
            </div>
            <div style={{ textAlign:'right', color: m.abono ? DST.success : t.muted, fontVariantNumeric:'tabular-nums', fontWeight: m.abono ? 600 : 400 }}>
              {m.abono ? fmtCOP(m.abono) : '—'}
            </div>
            <div style={{ textAlign:'right', color: m.saldo > 0 ? t.text : t.muted, fontVariantNumeric:'tabular-nums', fontWeight:600 }}>
              {fmtCOP(m.saldo)}
            </div>
          </div>
        ))}
      </div>
    </DrawerOverlay>
  );

  return (
    <BackofficeShell t={t} active="clientes" breadcrumb={['Gestión', 'Clientes']} overlay={drawerContent}>
      <div style={{ padding:'22px 24px 28px' }}>
        <BOPageHeader t={t}
          title="Clientes"
          subtitle="38 clientes registrados · 7 con cuenta corriente activa"
          actions={
            <>
              <BOGhostBtn t={t} icon="upload">Importar CSV</BOGhostBtn>
              <BOPrimaryBtn t={t} icon="plus">Nuevo cliente</BOPrimaryBtn>
            </>
          }
        />

        <BOToolbar t={t}
          search="Buscar por nombre, cédula o teléfono..."
          filters={[
            { label:'Cuenta corriente', value:'Todos' },
            { label:'Etiqueta',         value:'Todas' },
          ]}
        />

        <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, overflow:'hidden' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'1.6fr 1.4fr 1.5fr 1fr 1fr 1fr 50px',
            padding:'12px 18px', background:t.alt, borderBottom:`1px solid ${t.border}`,
            fontSize:11, fontWeight:600, color:t.muted, letterSpacing:'.04em', textTransform:'uppercase',
          }}>
            <div>Cliente</div>
            <div>Identificación</div>
            <div>Email</div>
            <div>Teléfono</div>
            <div>Saldo cta.</div>
            <div>Última compra</div>
            <div></div>
          </div>
          {CLIENTES.map((c, i) => <ClienteRow key={i} t={t} c={c}/>)}
          <Pagination t={t} current={1} totalPages={10} label="Mostrando 1–4 de 38 clientes"/>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB14Clientes });
