// bo-b5-config-general.jsx — Configuración del negocio (tab General)

function ConfigField({ t, label, value, placeholder, prefix, suffix, isSelect }) {
  return (
    <div>
      <label style={{ fontSize:12, fontWeight:600, color:t.text, display:'block', marginBottom:6 }}>{label}</label>
      <div style={{
        display:'flex', alignItems:'center',
        background:t.bg, border:`1px solid ${t.border}`, borderRadius:8,
        padding:'0 12px', height:38, gap:8,
      }}>
        {prefix && <span style={{ fontSize:13, color:t.muted, fontWeight:500 }}>{prefix}</span>}
        <input readOnly value={value || ''} placeholder={placeholder || ''} style={{
          flex:1, border:'none', outline:'none', background:'transparent',
          fontSize:13, fontFamily:ff, color: value ? t.text : t.muted,
        }}/>
        {(isSelect || suffix) && (
          suffix || <Icon name="chevron-down" size={12} color={t.muted}/>
        )}
      </div>
    </div>
  );
}

function BOB5ConfigGeneral({ t }) {
  return (
    <BackofficeShell t={t} active="config" breadcrumb={['Configuración', 'General']}>
      <div style={{ padding:'22px 24px 90px', position:'relative' }}>
        {/* Header */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:22, fontWeight:700, color:t.text, letterSpacing:'-.01em' }}>Configuración</div>
          <div style={{ fontSize:12, color:t.muted, marginTop:3 }}>Ajustes generales del negocio y preferencias regionales</div>
        </div>

        <ConfigTabs t={t} active="general"/>

        {/* Layout 8/4 */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:22, alignItems:'flex-start' }}>
          {/* Columna izquierda — formulario */}
          <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
            {/* Identidad */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'20px 22px' }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:4 }}>Identidad del negocio</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:18 }}>Información que aparece en facturas, recibos y la app del cliente.</div>

              {/* Logo uploader */}
              <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:22, paddingBottom:22, borderBottom:`1px solid ${t.border}` }}>
                <div style={{
                  width:72, height:72, borderRadius:36,
                  background:'#FED7AA', color:'#9A3412',
                  fontWeight:700, fontSize:24, letterSpacing:'-.01em',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>BS</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:4 }}>Logo del negocio</div>
                  <div style={{ fontSize:11, color:t.muted, marginBottom:10 }}>PNG o JPG · cuadrado · mínimo 256×256px</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button style={{
                      padding:'7px 14px', borderRadius:7, background:t.bg,
                      border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff,
                      fontSize:12, color:t.text, fontWeight:500,
                      display:'flex', alignItems:'center', gap:6,
                    }}>
                      <Icon name="upload" size={12} color={t.muted}/>
                      Cambiar logo
                    </button>
                    <button style={{
                      padding:'7px 14px', borderRadius:7, background:'transparent',
                      border:`1px solid ${t.border}`, cursor:'pointer', fontFamily:ff,
                      fontSize:12, color:DST.error, fontWeight:500,
                    }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Datos generales */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <ConfigField t={t} label="Nombre comercial" value="El Buen Sabor"/>
                <ConfigField t={t} label="Razón social" value="Restaurante El Buen Sabor SAS"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <ConfigField t={t} label="NIT" value="900.123.456-7"/>
                <ConfigField t={t} label="Teléfono" value="601 234 5678" prefix="+57"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14, marginBottom:14 }}>
                <ConfigField t={t} label="Email de contacto" value="contacto@buen-sabor.co"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
                <ConfigField t={t} label="Dirección principal" value="Cra. 15 #80-32, Bogotá"
                  suffix={<Icon name="map-pin" size={13} color={t.muted}/>}/>
              </div>
            </div>

            {/* Regional */}
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'20px 22px' }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:4 }}>Regional</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:18 }}>Formato de fechas, moneda y zona horaria.</div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <ConfigField t={t} label="Zona horaria" value="América/Bogotá (UTC-5)" isSelect/>
                <ConfigField t={t} label="Moneda" value="COP — Peso colombiano ($)" isSelect/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <ConfigField t={t} label="Formato de fecha" value="DD/MM/YYYY" isSelect/>
                <ConfigField t={t} label="Separador decimal" value="Punto (1.000,00)" isSelect/>
              </div>
            </div>
          </div>

          {/* Columna derecha — preview sticky */}
          <div style={{ position:'sticky', top:22 }}>
            <div style={{
              background:t.bg, border:`1px solid ${t.border}`, borderRadius:11, padding:'18px 20px',
            }}>
              <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:4 }}>Vista previa en facturas</div>
              <div style={{ fontSize:11, color:t.muted, marginBottom:14 }}>Así se verá el encabezado de tus documentos.</div>

              {/* Mock preview de factura */}
              <div style={{
                background: t === DST.light ? '#FFFFFF' : '#0F0F11',
                border:`1px solid ${t.border}`, borderRadius:9, padding:'18px 16px',
                fontFamily:ff,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:12 }}>
                  <div style={{
                    width:42, height:42, borderRadius:21,
                    background:'#FED7AA', color:'#9A3412',
                    fontWeight:700, fontSize:14,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0,
                  }}>BS</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:t.text, lineHeight:1.2 }}>El Buen Sabor</div>
                    <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>Restaurante El Buen Sabor SAS</div>
                  </div>
                </div>
                <div style={{
                  fontSize:10, color:t.muted, lineHeight:1.6,
                  paddingTop:10, borderTop:`1px dashed ${t.border}`,
                }}>
                  <div>NIT: 900.123.456-7</div>
                  <div>contacto@buen-sabor.co</div>
                  <div>Cra. 15 #80-32, Bogotá</div>
                </div>
                <div style={{
                  marginTop:14, paddingTop:10, borderTop:`1px dashed ${t.border}`,
                  fontSize:10, color:t.muted, fontFamily:'monospace',
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>FACTURA ELECTRÓNICA</span>
                    <span>FE-001234</span>
                  </div>
                  <div style={{ marginTop:3 }}>15 noviembre 2026 · 13:42</div>
                </div>
              </div>

              <a style={{
                display:'flex', alignItems:'center', gap:6, marginTop:14,
                fontSize:12, color:t.accent, cursor:'pointer', fontWeight:600,
              }}>
                Configurar datos DIAN y resolución
                <Icon name="arrow-right" size={12} color={t.accent}/>
              </a>
            </div>
          </div>
        </div>

        {/* Botón Guardar sticky */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'14px 24px', background:t.bg, borderTop:`1px solid ${t.border}`,
          display:'flex', justifyContent:'flex-end', gap:8,
        }}>
          <button style={{
            padding:'9px 16px', borderRadius:8, background:'transparent',
            border:`1px solid ${t.border}`, color:t.text, cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight:500,
          }}>Descartar</button>
          <button style={{
            padding:'9px 18px', borderRadius:8, background:t.accent,
            border:'none', color:'#fff', cursor:'pointer',
            fontFamily:ff, fontSize:13, fontWeight:600,
            display:'flex', alignItems:'center', gap:6,
          }}>
            <Icon name="save" size={13} color="#fff" strokeWidth={2.2}/>
            Guardar cambios
          </button>
        </div>
      </div>
    </BackofficeShell>
  );
}

Object.assign(window, { BOB5ConfigGeneral, ConfigField });
