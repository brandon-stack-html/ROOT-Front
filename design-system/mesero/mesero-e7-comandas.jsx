// mesero-e7-comandas.jsx — Mis comandas activas

const COMANDAS = [
  {
    id:1, mesa:'Mesa 4', ronda:2, estado:'listo',
    items:'Ajiaco Bogotano × 1 · Agua con gas × 1',
    tiempo:'Hace 3 minutos',
  },
  {
    id:2, mesa:'Mesa 7', ronda:1, estado:'listo',
    items:'Bandeja Paisa × 1 · Limonada × 1',
    tiempo:'Hace 6 minutos',
  },
  {
    id:3, mesa:'Mesa 2', ronda:1, estado:'preparando',
    items:'Bandeja Paisa × 2 · Limonada × 3',
    tiempo:'Hace 8 minutos',
  },
  {
    id:4, mesa:'Mesa 5', ronda:1, estado:'enviado',
    items:'Lomo al Trapo × 1 · Trucha × 1',
    tiempo:'Hace 2 minutos',
  },
];

function ComandaCard({ t, c }) {
  const isLight = t === DST.light;
  const STYLES = {
    listo: {
      bg: isLight ? '#D1FAE5' : 'rgba(16,185,129,.15)',
      border: `1.5px solid ${DST.success}`,
      badgeBg: DST.success, badgeColor:'#fff',
      badgeLabel:'¡Listo para entregar!', badgePulse:true,
    },
    preparando: {
      bg: t.bg, border: `1px solid ${t.border}`,
      badgeBg: isLight ? '#FEF3C7' : 'rgba(245,158,11,.2)', badgeColor: isLight ? '#92400E' : '#FDE68A',
      badgeLabel:'En preparación',
    },
    enviado: {
      bg: t.bg, border: `1px solid ${t.border}`,
      badgeBg: t.alt, badgeColor: t.muted,
      badgeLabel:'Enviada a cocina',
    },
  };
  const s = STYLES[c.estado];
  return (
    <div style={{
      padding:'14px', background:s.bg, border:s.border, borderRadius:12,
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
        <div style={{ fontSize:14, fontWeight:600, color:t.text }}>
          {c.mesa} <span style={{ color:t.muted, fontWeight:500 }}>· Ronda {c.ronda}</span>
        </div>
        <span className={s.badgePulse ? 'pos-pulse-ring' : ''} style={{
          fontSize:10, fontWeight:700, padding:'4px 9px', borderRadius:11,
          background: s.badgeBg, color: s.badgeColor,
          letterSpacing:'.03em', textTransform:'uppercase', whiteSpace:'nowrap',
          display:'inline-flex', alignItems:'center', gap:4,
        }}>
          {c.estado === 'listo' && <Icon name="check" size={9} color={s.badgeColor} strokeWidth={3}/>}
          {s.badgeLabel}
        </span>
      </div>

      <div style={{ fontSize:12, color: c.estado === 'listo' && isLight ? '#065F46' : t.text, lineHeight:1.5 }}>
        {c.items}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:t.muted, display:'inline-flex', alignItems:'center', gap:4 }}>
          <Icon name="clock" size={11} color={t.muted}/> {c.tiempo}
        </span>
        {c.estado === 'listo' && (
          <button style={{
            padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer',
            background:DST.success, color:'#fff', fontFamily:ff, fontSize:12, fontWeight:600,
            display:'inline-flex', alignItems:'center', gap:5,
          }}>
            <Icon name="check-check" size={13} color="#fff" strokeWidth={2.4}/>
            Marcar entregado
          </button>
        )}
      </div>
    </div>
  );
}

function MeseroE7Comandas({ t }) {
  const listas = COMANDAS.filter(c => c.estado === 'listo');
  const activas = COMANDAS.filter(c => c.estado !== 'listo');
  return (
    <MobileShell t={t}>
      <MobileTopbar t={t}
        left={<div style={{ width:34 }}/>}
        center={<div style={{ fontSize:15, fontWeight:600, color:t.text }}>Comandas</div>}
        right={
          <button style={{ width:34, height:34, borderRadius:8, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="filter" size={16} color={t.text}/>
          </button>
        }
      />

      {/* Tabs */}
      <div style={{ padding:'10px 14px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:4, padding:3, background:t.alt, borderRadius:9 }}>
          {[
            { l:'Activas',    n:5, active:false },
            { l:'Listas',     n:2, active:true },
            { l:'Entregadas', n:8, active:false },
          ].map(tab => (
            <button key={tab.l} style={{
              flex:1, padding:'8px 8px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:600,
              background: tab.active ? t.bg : 'transparent',
              color: tab.active ? t.text : t.muted,
              boxShadow: tab.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center', gap:5,
            }}>
              {tab.l}
              <span style={{ fontSize:10, opacity:.7, fontVariantNumeric:'tabular-nums' }}>({tab.n})</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'4px 14px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {listas.map(c => <ComandaCard key={c.id} t={t} c={c}/>)}

        <div style={{
          fontSize:10, fontWeight:600, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase',
          padding:'14px 0 4px', display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{ flex:1, height:1, background:t.border }}/>
          <span>Comandas activas</span>
          <span style={{ flex:1, height:1, background:t.border }}/>
        </div>

        {activas.map(c => <ComandaCard key={c.id} t={t} c={c}/>)}
      </div>

      <MobileBottomNav t={t} active="comandas" badges={{ comandas:2 }}/>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE7Comandas });
