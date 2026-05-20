// mesero-e2-sala.jsx — Selector de sala

const SALAS = [
  { id:'salon',   nombre:'Salón Principal', meta:'12 mesas · 4 a tu cargo', badge:'3 mesas ocupadas', tone:'info',     icon:'utensils-crossed', selected:true },
  { id:'terraza', nombre:'Terraza',         meta:'8 mesas · 2 a tu cargo',  badge:'Sin mesas ocupadas', tone:'muted',  icon:'umbrella' },
  { id:'barra',   nombre:'Barra',           meta:'6 puestos · 0 a tu cargo',badge:'No asignado',        tone:'muted',  icon:'wine', disabled:true },
];

function SalaCard({ t, sala }) {
  const tones = {
    info:    { bg: t === DST.light ? '#EFF6FF' : 'rgba(59,130,246,.18)', color: t === DST.light ? '#1E40AF' : '#93C5FD' },
    muted:   { bg: t.alt, color: t.muted },
  };
  const tone = tones[sala.tone];
  const isSelected = sala.selected;
  const isDisabled = sala.disabled;
  return (
    <div style={{
      padding:'16px 18px', borderRadius:13,
      background: isSelected ? (t === DST.light ? 'rgba(79,70,229,.05)' : 'rgba(79,70,229,.12)') : t.bg,
      border: isSelected ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
      opacity: isDisabled ? 0.55 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display:'flex', alignItems:'center', gap:14, position:'relative',
      boxShadow: isSelected ? `0 4px 16px ${t.accent}22` : 'none',
    }}>
      <div style={{
        width:48, height:48, borderRadius:12,
        background: isSelected ? t.accent : t.alt,
        color: isSelected ? '#fff' : t.muted,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <Icon name={sala.icon} size={22} color="currentColor" strokeWidth={1.7}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:15, fontWeight:600, color:t.text, marginBottom:3 }}>{sala.nombre}</div>
        <div style={{ fontSize:12, color:t.muted, marginBottom:6 }}>{sala.meta}</div>
        <span style={{
          fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:5,
          background: tone.bg, color: tone.color,
          letterSpacing:'.03em', textTransform:'uppercase',
          display:'inline-flex', alignItems:'center', gap:4,
        }}>
          {sala.tone === 'info' && <span style={{ width:5, height:5, borderRadius:3, background:DST.info }}/>}
          {sala.badge}
        </span>
      </div>
      {isSelected && (
        <div style={{ width:24, height:24, borderRadius:12, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon name="check" size={14} color="#fff" strokeWidth={3}/>
        </div>
      )}
    </div>
  );
}

function MeseroE2Sala({ t }) {
  return (
    <MobileShell t={t}>
      <MobileTopbar t={t}
        left={
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <MobileAvatar initials="AG"/>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:t.text, lineHeight:1.2 }}>Andrea García</div>
              <a style={{ fontSize:11, color:t.muted, cursor:'pointer' }}>Cambiar cuenta</a>
            </div>
          </div>
        }
        right={
          <button style={{ padding:'6px', borderRadius:8, background:'transparent', border:`1px solid ${t.border}`, cursor:'pointer', display:'flex' }}>
            <Icon name="log-out" size={16} color={t.muted}/>
          </button>
        }
      />

      <div style={{ flex:1, padding:'18px 18px 0', overflow:'auto', display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.02em', marginBottom:6 }}>
            ¿En qué sala trabajas hoy?
          </div>
          <div style={{ fontSize:13, color:t.muted, lineHeight:1.5 }}>
            Tus mesas asignadas aparecerán según la sala
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {SALAS.map(s => <SalaCard key={s.id} t={t} sala={s}/>)}
        </div>
      </div>

      {/* Sticky button */}
      <div style={{ padding:'12px 18px', background:t.bg, borderTop:`1px solid ${t.border}` }}>
        <MobileBtn t={t} variant="primary" iconRight="arrow-right">Continuar a mis mesas</MobileBtn>
      </div>
    </MobileShell>
  );
}

Object.assign(window, { MeseroE2Sala });
