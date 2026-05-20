// sf-f6-confirmacion.jsx — Pedido confirmado (mobile + desktop)

const TRACKER_STEPS = [
  { id:1, icon:'check-circle', label:'Pedido recibido',   sub:'20:15 · Confirmado',          state:'done',     time:'20:15' },
  { id:2, icon:'chef-hat',     label:'En preparación',    sub:'Tiempo estimado 25 min',      state:'active',   time:'En curso' },
  { id:3, icon:'bike',         label:'En camino',         sub:'Te avisaremos cuando salga',  state:'pending',  time:'~ 20:45' },
  { id:4, icon:'home',         label:'Entregado',         sub:'¡Disfruta tu comida!',        state:'pending',  time:'~ 21:00' },
];

const F6_ITEMS = [
  { nombre:'Bandeja Paisa',    qty:1, precio:32000 },
  { nombre:'Ajiaco Bogotano',  qty:2, precio:28000 },
  { nombre:'Limonada Natural', qty:2, precio:9000 },
];

function CheckmarkBadge({ t, size = 96 }) {
  return (
    <div style={{
      position:'relative', width:size, height:size, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {/* Anillos pulsantes */}
      <span className="confirm-ring confirm-ring-1" style={{
        position:'absolute', width:'100%', height:'100%', borderRadius:'50%',
        border:`2px solid ${DST.success}`, opacity:0,
      }}/>
      <span className="confirm-ring confirm-ring-2" style={{
        position:'absolute', width:'100%', height:'100%', borderRadius:'50%',
        border:`2px solid ${DST.success}`, opacity:0,
      }}/>
      {/* Círculo central */}
      <div style={{
        width:size, height:size, borderRadius:size/2,
        background: `linear-gradient(135deg, ${DST.success}, #059669)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 8px 32px rgba(16,185,129,.4)`,
        position:'relative', zIndex:1,
      }}>
        <Icon name="check" size={Math.round(size * 0.5)} color="#fff" strokeWidth={3.2}/>
      </div>
    </div>
  );
}

function TrackerTimeline({ t, vertical = true }) {
  return (
    <div style={{ display:'flex', flexDirection: vertical ? 'column' : 'row' }}>
      {TRACKER_STEPS.map((s, i) => {
        const isLast = i === TRACKER_STEPS.length - 1;
        let dotBg, dotColor, ringClass = '';
        let textColor = t.text, subColor = t.muted;
        if (s.state === 'done') { dotBg = DST.success; dotColor = '#fff'; }
        else if (s.state === 'active') { dotBg = DST.warning; dotColor = '#fff'; ringClass = 'tracker-pulse'; }
        else { dotBg = t.alt; dotColor = t.muted; textColor = t.muted; subColor = t.muted; }

        return (
          <div key={s.id} style={{
            display:'flex',
            flexDirection: vertical ? 'row' : 'column',
            alignItems: vertical ? 'flex-start' : 'center',
            gap: vertical ? 14 : 8,
            paddingBottom: vertical && !isLast ? 16 : 0,
            position:'relative',
            flex: vertical ? 'none' : 1,
          }}>
            {/* Línea conectora */}
            {!isLast && vertical && (
              <span style={{
                position:'absolute', left:17, top:36, bottom:0,
                width:2, background: s.state === 'done' ? DST.success : t.border,
                borderRadius:1,
              }}/>
            )}

            {/* Dot */}
            <div className={ringClass} style={{
              width:36, height:36, borderRadius:18,
              background: dotBg, color: dotColor,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              position:'relative', zIndex:1,
              boxShadow: s.state === 'active' ? `0 0 0 4px rgba(245,158,11,.18)` : 'none',
            }}>
              <Icon name={s.icon} size={16} color={dotColor} strokeWidth={2.2}/>
            </div>

            {/* Label */}
            <div style={{ flex:1, paddingTop: vertical ? 7 : 0, textAlign: vertical ? 'left' : 'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ fontSize:13, fontWeight: s.state === 'pending' ? 500 : 700, color: textColor }}>{s.label}</span>
                {s.state === 'active' && (
                  <span style={{
                    padding:'1px 7px', borderRadius:5,
                    background: t === DST.light ? '#FEF3C7' : 'rgba(245,158,11,.18)',
                    color: t === DST.light ? '#92400E' : '#FDE68A',
                    fontSize:9, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
                  }}>En curso</span>
                )}
                {s.state === 'done' && <Icon name="check" size={11} color={DST.success} strokeWidth={3}/>}
              </div>
              <div style={{ fontSize:11, color: subColor, marginTop:2 }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConfirmacionBody({ t, mobile = false }) {
  const isLight = t === DST.light;
  const total = F6_ITEMS.reduce((acc, i) => acc + i.qty * i.precio, 0) + 8000;

  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      padding: mobile ? '24px 18px 90px' : '36px 36px 36px',
      gap: 22,
    }}>
      {/* Checkmark */}
      <CheckmarkBadge t={t} size={mobile ? 88 : 100}/>

      {/* Título + número */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize: mobile ? 22 : 28, fontWeight:800, color:t.text, letterSpacing:'-.02em', marginBottom:8, lineHeight:1.2 }}>
          ¡Tu pedido fue recibido!
        </div>
        <div style={{ fontSize:13, color:t.muted, marginBottom:14, lineHeight:1.5 }}>
          Estamos preparando tu comida con todo el amor.<br/>
          Te enviamos los detalles a tu correo.
        </div>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:7,
          padding:'7px 14px', borderRadius:11,
          background: isLight ? '#EEF2FF' : 'rgba(99,102,241,.18)',
          color: t.accent,
          fontSize:13, fontWeight:700, letterSpacing:'.02em',
        }}>
          <Icon name="hash" size={13} color={t.accent} strokeWidth={2.2}/>
          PED-2847
        </div>
      </div>

      {/* Tracker */}
      <div style={{
        width:'100%',
        padding:'18px 20px', borderRadius:13,
        background:t.bg, border:`1px solid ${t.border}`,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${t.border}` }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>Estado del pedido</div>
            <div style={{ fontSize:14, fontWeight:700, color:t.text, marginTop:2 }}>Llegará a tu casa en ~ 25 min</div>
          </div>
          <div style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:11,
            background: isLight ? '#FEF3C7' : 'rgba(245,158,11,.18)',
            color: isLight ? '#92400E' : '#FDE68A',
            fontSize:11, fontWeight:700,
          }}>
            <span className="tracker-pulse" style={{ width:6, height:6, borderRadius:3, background:DST.warning }}/>
            En tiempo
          </div>
        </div>
        <TrackerTimeline t={t}/>
      </div>

      {/* Resumen */}
      <div style={{
        width:'100%',
        padding:'16px 20px', borderRadius:13,
        background:t.alt, border:`1px solid ${t.border}`,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <span style={{ fontSize:12, fontWeight:700, color:t.muted, letterSpacing:'.06em', textTransform:'uppercase' }}>Resumen del pedido</span>
          <span style={{ fontSize:11, color:t.muted, fontVariantNumeric:'tabular-nums' }}>5 items</span>
        </div>
        {F6_ITEMS.map((it, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0' }}>
            <span style={{ fontSize:11, color:t.muted, fontWeight:600, fontVariantNumeric:'tabular-nums', minWidth:24 }}>×{it.qty}</span>
            <span style={{ flex:1, fontSize:12, color:t.text, fontWeight:500 }}>{it.nombre}</span>
            <span style={{ fontSize:12, color:t.muted, fontVariantNumeric:'tabular-nums' }}>{fmtCOP(it.qty * it.precio)}</span>
          </div>
        ))}
        <div style={{ height:1, background:t.border, margin:'10px 0' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, color:t.muted }}>Total pagado</div>
            <div style={{ fontSize:11, color:t.muted, marginTop:2, display:'flex', alignItems:'center', gap:5 }}>
              <Icon name="credit-card" size={11} color={t.muted}/>
              Tarjeta de crédito ···· 4242
            </div>
          </div>
          <span style={{ fontSize:20, fontWeight:800, color:t.text, fontVariantNumeric:'tabular-nums', letterSpacing:'-.02em' }}>{fmtCOP(total)}</span>
        </div>
      </div>

      {/* Info adicional */}
      <div style={{
        width:'100%',
        padding:'14px 18px', borderRadius:11,
        background: isLight ? '#EFF6FF' : 'rgba(59,130,246,.10)',
        border:`1px solid ${isLight ? '#BFDBFE' : 'rgba(59,130,246,.4)'}`,
        display:'flex', flexDirection:'column', gap:10,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Icon name="mail" size={14} color={DST.info}/>
          <span style={{ fontSize:12, color: isLight ? '#1E40AF' : '#93C5FD' }}>
            Enviamos el detalle a <span style={{ fontWeight:700 }}>juan.restrepo@gmail.com</span>
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Icon name="bell" size={14} color={DST.info}/>
          <span style={{ fontSize:12, color: isLight ? '#1E40AF' : '#93C5FD' }}>
            Te avisaremos por SMS cuando salga el repartidor.
          </span>
        </div>
      </div>

      {/* Botones */}
      <div style={{ width:'100%', display:'flex', flexDirection: mobile ? 'column' : 'row', gap:8 }}>
        <button style={{
          flex:1, padding:'12px 18px', borderRadius:10,
          background:t.text, color:t.bg, border:'none', cursor:'pointer', fontFamily:ff,
          fontSize:13, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center', gap:7,
        }}>
          <Icon name="receipt" size={13} color={t.bg} strokeWidth={2.2}/>
          Ver detalle del pedido
        </button>
        <button style={{
          flex:1, padding:'12px 18px', borderRadius:10,
          background:'transparent', border:`1px solid ${t.border}`,
          color:t.text, cursor:'pointer', fontFamily:ff,
          fontSize:13, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:7,
        }}>
          <Icon name="arrow-left" size={13} color={t.muted}/>
          Volver al inicio
        </button>
      </div>

      {/* WhatsApp */}
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:t.muted }}>
        ¿Necesitas ayuda?
        <a style={{ color:DST.success, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
          <Icon name="message-circle" size={12} color={DST.success}/>
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}

// Versión móvil
function SFF6ConfirmacionMobile({ t }) {
  return (
    <MobileShell t={t}>
      <div style={{ flex:1, overflow:'auto', background:t.alt }}>
        <ConfirmacionBody t={t} mobile/>
      </div>
    </MobileShell>
  );
}

// Versión desktop — card centrado
function SFF6ConfirmacionDesktop({ t }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', overflow:'auto', background:t.alt, fontFamily:ff }}>
      <StorefrontNavbar t={t} simplified/>

      <div style={{
        flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'36px 24px 36px',
      }}>
        <div style={{
          width:600, background:t.bg, borderRadius:16,
          border:`1px solid ${t.border}`,
          boxShadow: t === DST.light ? '0 12px 40px rgba(0,0,0,.06)' : '0 12px 40px rgba(0,0,0,.4)',
          overflow:'hidden',
        }}>
          <ConfirmacionBody t={t}/>
        </div>
      </div>

      <StorefrontFooter t={t} minimal/>
    </div>
  );
}

Object.assign(window, { SFF6ConfirmacionMobile, SFF6ConfirmacionDesktop, ConfirmacionBody, TrackerTimeline, CheckmarkBadge });
