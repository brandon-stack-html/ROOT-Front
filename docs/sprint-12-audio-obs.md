# Sprint 12 — Observaciones con audio (input por voz)

> **Objetivo:** permitir al mesero dictar observaciones por voz que se convierten automáticamente en texto. El audio NO se conserva — es solo un método de input alternativo al textarea. El resultado siempre es texto plano que viaja igual a la comanda y al KDS.
> **Estimado:** 6–7 horas.
> **Pantallas tocadas:** `mesero/catalogo.html` (E6 bottom-sheet), `mesero/detalle.html` (E4). NO se toca el KDS — el texto transcrito viaja como texto normal.
> **Archivo nuevo:** `assets/js/voice-input.js`.
> **Dependencias:** Sprints 0, 7 (mesero ya funcional).

## Concepto clave

El audio es **solo un input**, no un payload. El flujo es:

```
[mesero presiona o mantiene botón 🎤]
        ↓
[animación waveform + timer simulando grabación]
        ↓
[al terminar, sistema asigna un texto mock random del array]
        ↓
[texto se APENDA al textarea de observación (no reemplaza)]
        ↓
[mesero puede editar el texto manualmente antes de confirmar]
        ↓
[al confirmar, queda como observación normal del item]
```

Resultado: el sistema, las APIs futuras, el KDS, las facturas — todos ven simplemente texto. No hay que tocar el KDS porque las observaciones ya se renderizan como texto plano.

---

## Archivos JSX de referencia

| Pantalla | Archivo | Para qué |
|---|---|---|
| Bottom-sheet modificadores | `design-system/mesero/mesero-e6-bottomsheet.jsx` | Ubicar la sección "Observación" donde inyectar el botón micrófono |
| Detalle mesa | `design-system/mesero/mesero-e4-detalle.jsx` | Ubicar cada item-row para agregar botón "editar observación" |

---

## Sección 12.1 — Módulo `voice-input.js`

### Prompt para Claude Code

```
Crear assets/js/voice-input.js — módulo compartido que maneja la simulación de grabación,
las transcripciones mock y la inyección de texto en un textarea destino.

CONSTANTES al inicio del archivo:

const MOCK_TRANSCRIPTIONS = [
  "Sin cebolla, el cliente es alérgico",
  "Sin cilantro por favor",
  "Bien cocido, nada rosado",
  "Término medio, jugoso pero no crudo",
  "Sin picante, es para un niño",
  "Doble porción de papa",
  "Arroz aparte, no encima",
  "Sin queso, intolerancia a la lactosa",
  "Aguacate maduro si tienen",
  "Limón aparte",
  "Cliente embarazada, todo bien cocido",
  "Para llevar, empacar bien caliente",
  "Sin gluten, tiene celiaquía",
  "Salsa de la casa aparte",
  "Mesa 5 cumple años, vela en el postre",
  "Sin tomate ni lechuga",
  "Cambiar las papas por ensalada",
  "Extra de chimichurri por favor",
  "Té en taza no en vaso",
  "Sin hielo en la gaseosa"
];

// Feature flag para upgrade futuro
const USE_REAL_AUDIO = false;

OBJETO GLOBAL window.VoiceInput con esta API:

VoiceInput.attach(buttonEl, targetTextarea)
  Liga un botón a un textarea destino. Soporta DOS modos:
    1. Hold-to-record: mousedown/touchstart inicia, mouseup/touchend termina.
    2. Tap-to-toggle: click corto (< 200ms) inicia, segundo click corto termina.
  Internamente detecta cuál usar: si el press dura < 200ms al soltar,
  asume que era un tap y deja la grabación corriendo hasta el próximo tap.
  Si dura > 200ms, asume hold y para al soltar.

VoiceInput.startRecording(buttonEl, targetTextarea)
  - Cambia el botón a estado "grabando":
      Agrega clase .is-recording.
      Cambia ícono mic → square (stop).
      Inicia animación waveform (clase .voice-input-bars dentro del botón anima).
  - Muestra un timer "0:00" en un span hermano del botón (lo crea si no existe).
  - Comienza un setInterval que actualiza el timer cada 100ms (mostrar formato MM:SS).
  - Si USE_REAL_AUDIO === true:
      Pide getUserMedia({audio: true}).
      Inicia MediaRecorder.
      Al stop, hace nada con el blob (lo descarta — el audio no se guarda).
  - Si USE_REAL_AUDIO === false:
      No pide micrófono. Solo anima.

VoiceInput.stopRecording(buttonEl, targetTextarea)
  - Quita .is-recording del botón.
  - Restaura ícono mic.
  - Para el timer.
  - Si la "grabación" duró < 0.6s: aborta sin transcribir (asume tap accidental,
    toast "Mantené presionado o tocá de nuevo para grabar").
  - Si duró >= 0.6s:
      Espera 400ms (simula procesamiento). Durante esa espera el botón muestra
      estado .is-processing con un spinner.
      Selecciona un texto RANDOM del array (Math.random()).
      Lo apenda al targetTextarea:
        const current = targetTextarea.value.trim();
        const separator = current ? '. ' : '';
        targetTextarea.value = current + separator + texto;
        // Disparar evento input para que listeners externos se enteren.
        targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      Toast success "Transcripción agregada" con duración 2000ms.

CSS asociado (agregar a components.css o crear voice-input.css):

.voice-input-btn (botón circular):
  width: 36; height: 36; border-radius: 50%;
  bg: var(--alt); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 150ms;
  color: var(--muted);
  position: relative;
  flex-shrink: 0;
.voice-input-btn:hover { bg: var(--bg); color: var(--text); }
.voice-input-btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

.voice-input-btn.is-recording {
  bg: var(--error);
  color: #fff;
  border-color: var(--error);
  animation: voice-pulse 1.2s infinite;
}
@keyframes voice-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.5); }
  50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
}

.voice-input-btn.is-processing {
  bg: var(--accent);
  color: #fff;
  cursor: wait;
}
.voice-input-btn.is-processing .voice-spinner {
  width: 14; height: 14;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: voice-spin 0.7s linear infinite;
}
@keyframes voice-spin { to { transform: rotate(360deg); } }

.voice-input-timer (chip al lado del botón):
  display: none;
  font-size: 12; font-variant-numeric: tabular-nums;
  color: var(--error); font-weight: 600;
  padding: 2 8; border-radius: 10;
  bg: rgba(239,68,68,.1);
.voice-input-btn.is-recording + .voice-input-timer { display: inline-flex; }

.voice-input-hint (texto pequeño debajo del botón, solo visible mientras graba):
  font-size: 11; color: var(--muted);
  display: none;
.voice-input-btn.is-recording ~ .voice-input-hint { display: block; }

INICIALIZACIÓN AUTOMÁTICA al cargar:
  Buscar todos los [data-voice-input] que apunten a un textarea por id:
    <button data-voice-input="obsTextarea">🎤</button>
    <textarea id="obsTextarea"></textarea>
  Y llamar VoiceInput.attach automáticamente.

  Hacerlo dentro de un init() que se llama en DOMContentLoaded.
  Y exponer VoiceInput.bindAll() por si elementos se agregan dinámicamente.

NO incluir en TODAS las páginas — solo en las del mesero (catalogo.html y detalle.html).
```

### Hecho cuando

- Archivo `assets/js/voice-input.js` existe y exporta `window.VoiceInput`.
- Botón con `data-voice-input="id"` ligado a textarea funciona en modo tap-to-toggle y hold.
- Grabación corta (< 0.6s) muestra toast "Mantené presionado..." sin transcribir.
- Grabación válida muestra spinner 400ms, luego apenda texto random al textarea.
- Timer corre mientras graba en formato MM:SS.

---

## Sección 12.2 — Bottom-sheet E6 con micrófono

### Prompt para Claude Code

```
Modificar mesero/catalogo.html.

Leé primero design-system/mesero/mesero-e6-bottomsheet.jsx para ubicar la sección "Observación"
existente dentro del bottom-sheet (es la última sección antes del footer del sheet, suele tener
un textarea con placeholder "Ej: sin sal, sin gluten...").

CAMBIOS:

1) Asegurarte de que el textarea tenga un id estable: id="sheetObservacion".

2) Justo arriba del textarea, agregar una fila con el botón de voz:

   <div class="voice-input-row">
     <button type="button" class="voice-input-btn" data-voice-input="sheetObservacion"
             aria-label="Dictar observación por voz">
       <i data-lucide="mic" class="voice-input-icon-mic"></i>
       <i data-lucide="square" class="voice-input-icon-stop" hidden></i>
       <span class="voice-spinner" hidden></span>
     </button>
     <span class="voice-input-timer">0:00</span>
     <span class="voice-input-label">Tocá o mantené para dictar</span>
   </div>
   <span class="voice-input-hint">Soltá o tocá de nuevo para terminar</span>

   CSS .voice-input-row:
     display: flex; align-items: center; gap: 10; margin-bottom: 8;
   .voice-input-label:
     font-size: 12; color: var(--muted);
   Cuando .voice-input-btn.is-recording: la label cambia opacity 0.4 (ya no aplica).

3) Asegurar que el SCRIPT voice-input.js se carga en este HTML:
     <script src="/assets/js/voice-input.js"></script>
   Justo antes del cierre </body>, después de ui.js.

4) En el JS del bottom-sheet (función que abre el sheet con datos del producto):
   Cuando se RESETEA el sheet al abrirlo para un producto nuevo, también limpiar:
     - El textarea: document.getElementById('sheetObservacion').value = '';
     - Asegurar que el botón mic no quedó en estado is-recording de un uso anterior.

5) En el botón "Agregar — $X.XXX" del footer:
   Antes de cerrar el sheet, leer el value del textarea y guardarlo como observación del
   item que se está agregando a la comanda (debería ya estar haciéndose — solo verificar).

6) Visual del lucide icon switch:
   Cuando el botón pasa a .is-recording, mostrar el ícono stop y ocultar mic.
   CSS:
     .voice-input-btn .voice-input-icon-stop { display: none; }
     .voice-input-btn.is-recording .voice-input-icon-mic { display: none; }
     .voice-input-btn.is-recording .voice-input-icon-stop { display: inline-flex; }
   En voice-input.js, manejar esto agregando/quitando atributo hidden via clases del padre.
```

### Hecho cuando

- Al abrir bottom-sheet en E6, se ve el botón mic encima del textarea con label "Tocá o mantené para dictar".
- Tap corto: empieza a grabar, mic pasa a rojo con pulse, timer corre.
- Tap de nuevo: para, spinner 400ms, texto aparece en el textarea.
- Hold > 200ms: graba mientras se mantiene, libera al soltar.
- Si ya había texto manual, el dictado se apenda con ". " de separador.
- "Agregar" al item guarda la observación combinada (texto manual + transcripto).

---

## Sección 12.3 — Detalle de mesa E4: editar observación de items existentes

### Prompt para Claude Code

```
Modificar mesero/detalle.html.

Leé design-system/mesero/mesero-e4-detalle.jsx para ubicar cómo se renderiza cada item
de la comanda (.comanda-item-mobile o similar).

OBJETIVO: agregar un botón "editar observación" en cada item ya en la comanda,
que abre un modal/sheet para modificar la observación con texto + voz.

CAMBIOS:

1) En cada item-row de la comanda, agregar al final un botón pequeño:
   <button type="button" class="item-row-edit-obs" data-item-id="X"
           aria-label="Editar observación">
     <i data-lucide="pencil"></i>
   </button>

   CSS .item-row-edit-obs:
     width: 28; height: 28; border-radius: 6;
     bg: transparent; border: 1px solid var(--border);
     color: var(--muted); cursor: pointer;
     display: flex; align-items: center; justify-content: center;
     flex-shrink: 0;
   :hover { bg: var(--alt); color: var(--text); }

   Layout del item-row: agregar este botón al final del flex container del item.
   No tocar los botones existentes (⋮ menú, etc.) — coexistir.

2) Crear UN bottom-sheet compartido para editar observaciones:

   <div id="sheetEditObs" class="bottom-sheet" hidden>
     <div class="bottom-sheet-handle"></div>
     <div class="bottom-sheet-header">
       <h3 class="bottom-sheet-title">Editar observación</h3>
       <p class="bottom-sheet-subtitle" id="editObsItemName">—</p>
     </div>
     <div class="bottom-sheet-body">
       <div class="voice-input-row">
         <button type="button" class="voice-input-btn" data-voice-input="editObsTextarea"
                 aria-label="Dictar observación por voz">
           <i data-lucide="mic" class="voice-input-icon-mic"></i>
           <i data-lucide="square" class="voice-input-icon-stop" hidden></i>
           <span class="voice-spinner" hidden></span>
         </button>
         <span class="voice-input-timer">0:00</span>
         <span class="voice-input-label">Tocá o mantené para dictar</span>
       </div>
       <span class="voice-input-hint">Soltá o tocá de nuevo para terminar</span>
       <textarea id="editObsTextarea" class="field-input" rows="4"
                 placeholder="Ej: sin sal, sin gluten, alergia al maní..."></textarea>
       <p class="field-hint">Podés escribir, dictar, o combinar ambos.</p>
     </div>
     <div class="bottom-sheet-footer">
       <button class="btn btn-secondary" data-close>Cancelar</button>
       <button class="btn btn-primary" id="btnSaveEditObs">Guardar</button>
     </div>
   </div>

3) JS:
   // Estado global de comanda (debería ya existir en detalle.html)
   // window.comanda = { items: [{id, name, qty, modifs, obs, price}, ...] }

   let editingItemId = null;

   document.querySelectorAll('.item-row-edit-obs').forEach(btn => {
     btn.addEventListener('click', () => {
       editingItemId = btn.dataset.itemId;
       const item = window.comanda.items.find(i => i.id == editingItemId);
       document.getElementById('editObsItemName').textContent =
         `${item.qty}× ${item.name}`;
       document.getElementById('editObsTextarea').value = item.obs || '';
       UI.openBottomSheet('sheetEditObs');
     });
   });

   document.getElementById('btnSaveEditObs').addEventListener('click', () => {
     const newObs = document.getElementById('editObsTextarea').value.trim();
     const item = window.comanda.items.find(i => i.id == editingItemId);
     item.obs = newObs;
     renderComanda();  // función existente que repinta la lista
     UI.closeBottomSheet('sheetEditObs');
     UI.toast({
       type: 'success',
       title: 'Observación actualizada',
       sub: newObs ? `"${newObs.slice(0, 40)}${newObs.length > 40 ? '...' : ''}"` : 'Observación eliminada'
     });
     editingItemId = null;
   });

4) En la función renderComanda (o como se llame), asegurar que SI un item tiene obs,
   se renderiza visible debajo del nombre/modificadores con el estilo italic warning
   que ya está en el JSX original. Si no la tiene, no se renderiza esa línea.

5) Asegurar que voice-input.js está incluido al final de detalle.html.
```

### Hecho cuando

- Cada item de la comanda tiene un botón lápiz pequeño al final.
- Click abre bottom-sheet con la observación actual pre-cargada.
- Botón mic dentro del sheet funciona igual que en E6.
- Tipear + dictar combina ambos textos.
- "Guardar" actualiza la comanda visible y muestra toast con preview de la observación.
- "Cancelar" descarta cambios.

---

## Sección 12.4 — Polish y casos borde

### Prompt para Claude Code

```
Repasar los casos borde y la accesibilidad.

1) ACCESIBILIDAD:
   - Botón mic tiene aria-label correcto ("Dictar observación por voz").
   - Mientras está grabando, el botón debería tener aria-pressed="true" y
     aria-label dinámico cambiando a "Detener grabación".
   - Timer tiene role="timer" aria-live="off" (no queremos que screen reader
     lea el tiempo cada décima de segundo).
   - El toast al terminar SÍ debe ser aria-live="polite" (que ya viene del Sprint 0).

   Agregar lógica en voice-input.js:
   startRecording:
     btn.setAttribute('aria-pressed', 'true');
     btn.setAttribute('aria-label', 'Detener grabación');
   stopRecording:
     btn.setAttribute('aria-pressed', 'false');
     btn.setAttribute('aria-label', 'Dictar observación por voz');

2) PREVENIR DOBLE GRABACIÓN:
   Si el usuario abre el bottom-sheet de edición mientras una grabación del sheet E6
   sigue activa (caso raro pero posible), cancelar la grabación previa:
   VoiceInput.cancelAll() — método que recorre todos los botones .is-recording
   y los para sin transcribir.
   Llamar VoiceInput.cancelAll() cuando se abre/cierra cualquier bottom-sheet
   (agregar al UI.openBottomSheet y UI.closeBottomSheet del Sprint 0).

3) PREFERS-REDUCED-MOTION:
   Si está activo, no animar el pulse del botón rojo — solo mostrar el color sólido.
   CSS:
     @media (prefers-reduced-motion: reduce) {
       .voice-input-btn.is-recording { animation: none; }
       .voice-spinner { animation: none; border: 2px solid #fff; }
     }

4) MOBILE TOUCH:
   En iOS Safari, el touchstart a veces dispara también un click 300ms después.
   En voice-input.js, en el handler:
     - touchstart: e.preventDefault() para evitar el click duplicado.
     - Usar pointerdown/pointerup si están disponibles (mejor cross-device),
       fallback a touchstart/mousedown.

   Pseudocódigo:
     const supportsPointer = 'PointerEvent' in window;
     const startEvt = supportsPointer ? 'pointerdown' : (isTouch ? 'touchstart' : 'mousedown');
     const endEvt = supportsPointer ? 'pointerup' : (isTouch ? 'touchend' : 'mouseup');

5) ESTADO INICIAL DEL BOTÓN:
   Verificar que al cargar la página y al abrir cualquier sheet, el botón mic
   está SIEMPRE en estado idle (no recording, no processing). Si quedó atascado
   por un error previo, llamar VoiceInput.cancelAll().

6) FEATURE FLAG VISIBLE:
   En la consola del navegador al cargar voice-input.js, hacer:
     console.info('[VoiceInput] Mock mode. To enable real recording set USE_REAL_AUDIO = true');
   Esto ayuda al dev que herede el código a saber que existe el upgrade path.
```

### Hecho cuando

- Aria-pressed y aria-label cambian correctamente durante la grabación.
- Cerrar un sheet con grabación activa la cancela sin transcribir basura.
- En iOS no hay doble disparo touchstart/click.
- prefers-reduced-motion respetado.
- Mensaje informativo en consola al cargar el módulo.

---

## Checklist final del Sprint 12

- [ ] `assets/js/voice-input.js` creado y exporta `window.VoiceInput`.
- [ ] `mesero/catalogo.html` (E6): botón mic encima del textarea de observación funciona.
- [ ] `mesero/detalle.html` (E4): cada item tiene botón lápiz, abre sheet de editar observación.
- [ ] Sheet de editar observación reusa el mismo componente de voice input.
- [ ] Tap-to-toggle y hold-to-record ambos funcionan.
- [ ] Grabación < 0.6s muestra toast sin transcribir.
- [ ] Transcripciones random del array de 20 frases.
- [ ] Texto se apenda al textarea, no reemplaza.
- [ ] Aria-pressed y aria-label dinámicos.
- [ ] Cancelar grabación al cerrar sheet.
- [ ] prefers-reduced-motion desactiva animaciones.
- [ ] Console info mencionando el feature flag USE_REAL_AUDIO.
- [ ] Sin errores en consola en ninguno de los dos archivos modificados.
- [ ] Toggle de tema mantiene legibilidad del botón mic en ambos modos.

Commit: `feat: sprint 12 observaciones con audio (input por voz mock)`.

## Notas para el futuro (no implementar ahora)

- **Upgrade a audio real:** poner USE_REAL_AUDIO = true. El código de MediaRecorder ya está
  preparado en startRecording/stopRecording. Falta agregar el llamado a una API de
  transcripción real (OpenAI Whisper, Google Speech, AWS Transcribe). El array
  MOCK_TRANSCRIPTIONS quedaría como fallback si la API falla.

- **Multilenguaje:** las frases mock están en español colombiano. Si la demo se presenta a
  stakeholders internacionales, agregar arrays MOCK_TRANSCRIPTIONS_EN, _PT, etc. y seleccionar
  según `navigator.language`.

- **Edición de observación desde el bottom-sheet inicial:** actualmente E6 solo permite
  agregar observación al crear el item. Si el mesero quiere editarla después, debe ir a E4.
  Esto es intencional — E6 es para creación, E4 para gestión. No mezclar.
