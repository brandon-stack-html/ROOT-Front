// kds-d2-config.jsx — KDS Configuración (modal sobre KDS)

function ConfigSwitch({ t, on }) {
  return (
    <div style={{
      width:38, height:22, borderRadius:11,
      background: on ? t.accent : t.border,
      position:'relative', cursor:'pointer', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:2, left: on ? 18 : 2,
        width:18, height:18, borderRadius:9, background:'#fff',
        boxShadow:'0 1px 3px rgba(0,0,0,.3)',
      }}/>
    </div>
  );
}

function ConfigSection({ t, title, icon, children }) {
  return (
    <div style={{ paddingBottom:14, borderBottom:`1px solid ${t.border}`, marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:11, color:t.muted }}>
        <Icon name={icon} size={14} color={t.muted}/>
        <span style={{ fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:t.muted }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ConfigRow({ t, label, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', gap:12 }}>
      <span style={{ fontSize:13, color:t.text, fontWeight:500 }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>{children}</div>
    </div>
  );
}

function KDSD2Config({ t }) {
  const isDark = t === DST.dark;
  const bg = isDark ? '#0A0A0A' : '#F4F4F5';

  return (
    <div style={{ width:'100%', height:'100%', background:bg, fontFamily:ff, position:'relative', overflow:'hidden' }}>
      {/* Fondo: KDS atenuado */}
      <div style={{ opacity:.35, height:'100%', display:'flex', flexDirection:'column' }}>
        <KDSTopbar t={t}/>
        <div style={{ flex:1, padding:12, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height:280, background:t.alt, borderRadius:11, border:`1px solid ${t.border}` }}/>)}
        </div>
      </div>

      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(2px)' }}/>

      {/* Modal */}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
        width:520, maxHeight:'92%', overflowY:'auto',
        background:t.bg, borderRadius:14, border:`1px solid ${t.border}`,
        boxShadow:'0 24px 80px rgba(0,0,0,.5)',
        display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{ padding:'16px 22px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Icon name="settings" size={18} color={t.accent}/>
            <span style={{ fontSize:16, fontWeight:600, color:t.text }}>Configuración KDS</span>
          </div>
          <button style={{ width:30, height:30, borderRadius:7, border:`1px solid ${t.border}`, background:'transparent', cursor:'pointer', color:t.muted, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="x" size={15} color={t.muted}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'18px 22px', overflowY:'auto' }}>
          {/* Apariencia */}
          <ConfigSection t={t} title="Apariencia" icon="paintbrush">
            <ConfigRow t={t} label="Tamaño de texto">
              <div style={{ display:'flex', gap:4, padding:3, background:t.alt, borderRadius:7 }}>
                {['S','M','L','XL'].map(s => (
                  <button key={s} style={{
                    width:32, padding:'5px 0', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:600,
                    background: s === 'M' ? t.bg : 'transparent',
                    color: s === 'M' ? t.text : t.muted,
                    boxShadow: s === 'M' ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                  }}>{s}</button>
                ))}
              </div>
            </ConfigRow>
            <ConfigRow t={t} label="Tema">
              <div style={{ display:'flex', gap:4, padding:3, background:t.alt, borderRadius:7 }}>
                {[
                  { l:'Claro',  icon:'sun',  active:false },
                  { l:'Oscuro', icon:'moon', active:true },
                ].map(s => (
                  <button key={s.l} style={{
                    padding:'5px 12px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:ff, fontSize:12, fontWeight:600,
                    background: s.active ? t.bg : 'transparent',
                    color: s.active ? t.text : t.muted,
                    display:'flex', alignItems:'center', gap:5,
                    boxShadow: s.active ? '0 1px 2px rgba(0,0,0,.05)' : 'none',
                  }}>
                    <Icon name={s.icon} size={12} color="currentColor"/>
                    {s.l}
                  </button>
                ))}
              </div>
            </ConfigRow>
          </ConfigSection>

          {/* Sonidos */}
          <ConfigSection t={t} title="Sonidos" icon="volume-2">
            <ConfigRow t={t} label="Sonido al recibir comanda"><ConfigSwitch t={t} on={true}/></ConfigRow>
            <ConfigRow t={t} label="Sonido de alerta por demora"><ConfigSwitch t={t} on={true}/></ConfigRow>
            <ConfigRow t={t} label="Tono de alerta">
              <button style={{
                padding:'5px 12px', borderRadius:7, background:t.alt, border:`1px solid ${t.border}`,
                fontSize:12, color:t.text, fontFamily:ff, fontWeight:500, cursor:'pointer',
                display:'flex', alignItems:'center', gap:6, minWidth:140,
              }}>
                Campana suave
                <Icon name="chevron-down" size={12} color={t.muted} style={{ marginLeft:'auto' }}/>
              </button>
            </ConfigRow>
            <ConfigRow t={t} label="">
              <button style={{
                padding:'6px 14px', borderRadius:7, background:'transparent', border:`1px solid ${t.border}`,
                fontSize:12, color:t.accent, fontFamily:ff, fontWeight:500, cursor:'pointer',
                display:'flex', alignItems:'center', gap:6,
              }}>
                <Icon name="play" size={11} color={t.accent}/>
                Probar sonido
              </button>
            </ConfigRow>
          </ConfigSection>

          {/* Alertas tiempo */}
          <ConfigSection t={t} title="Alertas de tiempo" icon="clock">
            <ConfigRow t={t} label="Alertar en amarillo después de">
              <input readOnly value="8" style={{
                width:50, padding:'5px 8px', fontSize:13, fontFamily:ff, textAlign:'center',
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:6, color:t.text, outline:'none',
              }}/>
              <span style={{ fontSize:12, color:t.muted }}>minutos</span>
            </ConfigRow>
            <ConfigRow t={t} label="Alertar en rojo después de">
              <input readOnly value="12" style={{
                width:50, padding:'5px 8px', fontSize:13, fontFamily:ff, textAlign:'center',
                background:t.alt, border:`1px solid ${t.border}`, borderRadius:6, color:t.text, outline:'none',
              }}/>
              <span style={{ fontSize:12, color:t.muted }}>minutos</span>
            </ConfigRow>
          </ConfigSection>

          {/* Estación */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:11 }}>
              <Icon name="chef-hat" size={14} color={t.muted}/>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:t.muted }}>Estación</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { l:'Cocina caliente', sel:true },
                { l:'Cocina fría',     sel:false },
                { l:'Barra',           sel:false },
                { l:'Todas',           sel:false },
              ].map(opt => (
                <label key={opt.l} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'4px 0' }}>
                  <span style={{
                    width:18, height:18, borderRadius:9,
                    background: opt.sel ? t.accent : 'transparent',
                    border: opt.sel ? 'none' : `1.5px solid ${t.border}`,
                    display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    {opt.sel && <span style={{ width:7, height:7, borderRadius:4, background:'#fff' }}/>}
                  </span>
                  <span style={{ fontSize:13, color:t.text, fontWeight: opt.sel ? 600 : 500 }}>{opt.l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 22px', borderTop:`1px solid ${t.border}`, display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button style={{
            padding:'8px 16px', borderRadius:8, border:`1px solid ${t.border}`,
            background:'transparent', color:t.text, cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight:500,
          }}>Cancelar</button>
          <button style={{
            padding:'8px 18px', borderRadius:8, border:'none',
            background:t.accent, color:'#fff', cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight:600,
          }}>Guardar configuración</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KDSD2Config });
