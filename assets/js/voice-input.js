/* ============================================================================
   voice-input.js — Mock voice-to-text input para observaciones
   Sprint 12 (Audio observaciones)

   El audio NO se conserva. Esto es solo un input alternativo al textarea —
   el resultado siempre es texto plano que viaja como observación normal.

   API pública (window.VoiceInput):
     - attach(buttonEl, targetTextarea)
     - startRecording(buttonEl, targetTextarea)
     - stopRecording(buttonEl, targetTextarea)
     - cancelAll()
     - bindAll()

   Para upgrade futuro a audio real: cambiar USE_REAL_AUDIO a true y conectar
   una API de transcripción en el bloque MediaRecorder.onstop.
   ============================================================================ */
(function (global) {
  'use strict';

  const MOCK_TRANSCRIPTIONS = [
    'Sin cebolla, el cliente es alérgico',
    'Sin cilantro por favor',
    'Bien cocido, nada rosado',
    'Término medio, jugoso pero no crudo',
    'Sin picante, es para un niño',
    'Doble porción de papa',
    'Arroz aparte, no encima',
    'Sin queso, intolerancia a la lactosa',
    'Aguacate maduro si tienen',
    'Limón aparte',
    'Cliente embarazada, todo bien cocido',
    'Para llevar, empacar bien caliente',
    'Sin gluten, tiene celiaquía',
    'Salsa de la casa aparte',
    'Mesa 5 cumple años, vela en el postre',
    'Sin tomate ni lechuga',
    'Cambiar las papas por ensalada',
    'Extra de chimichurri por favor',
    'Té en taza no en vaso',
    'Sin hielo en la gaseosa'
  ];

  // Feature flag: cambiar a true cuando se conecte una API real de transcripción.
  const USE_REAL_AUDIO = false;

  // Umbrales (ms)
  const TAP_HOLD_THRESHOLD = 200;   // < 200ms = tap, >= 200ms = hold
  const MIN_RECORDING_MS = 600;     // < 600ms = aborta sin transcribir
  const PROCESSING_DELAY_MS = 400;  // simula tiempo de procesamiento

  // Estado interno por botón. Map<buttonEl, sessionObject>
  const sessions = new Map();

  // ----------------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------------
  function fmtTimer(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return m + ':' + ss;
  }

  function findTimerSpan(buttonEl) {
    // Busca un .voice-input-timer hermano del botón
    const row = buttonEl.parentElement;
    if (!row) return null;
    return row.querySelector('.voice-input-timer');
  }

  function findHintSpan(buttonEl) {
    // El hint vive como hermano del .voice-input-row (no del botón directo)
    const row = buttonEl.closest('.voice-input-row');
    if (!row || !row.parentElement) return null;
    return row.parentElement.querySelector('.voice-input-hint');
  }

  function pickRandomTranscription() {
    const idx = Math.floor(Math.random() * MOCK_TRANSCRIPTIONS.length);
    return MOCK_TRANSCRIPTIONS[idx];
  }

  function appendToTextarea(textarea, text) {
    if (!textarea) return;
    const current = (textarea.value || '').trim();
    const separator = current ? '. ' : '';
    textarea.value = current + separator + text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ----------------------------------------------------------------------------
  // Estado visual del botón
  // ----------------------------------------------------------------------------
  function setRecordingUI(buttonEl, on) {
    buttonEl.classList.toggle('is-recording', on);
    if (on) {
      buttonEl.setAttribute('aria-pressed', 'true');
      buttonEl.setAttribute('aria-label', 'Detener grabación');
    } else {
      buttonEl.setAttribute('aria-pressed', 'false');
      buttonEl.setAttribute('aria-label', 'Dictar observación por voz');
    }
    const hint = findHintSpan(buttonEl);
    if (hint) hint.style.display = on ? 'block' : 'none';
  }

  function setProcessingUI(buttonEl, on) {
    buttonEl.classList.toggle('is-processing', on);
    if (on) {
      buttonEl.setAttribute('aria-busy', 'true');
    } else {
      buttonEl.removeAttribute('aria-busy');
    }
  }

  function startTimer(buttonEl, sess) {
    const timer = findTimerSpan(buttonEl);
    if (!timer) return;
    timer.textContent = '0:00';
    sess.timerInterval = setInterval(function () {
      const elapsed = Date.now() - sess.startedAt;
      timer.textContent = fmtTimer(elapsed);
    }, 100);
  }

  function stopTimer(sess) {
    if (sess && sess.timerInterval) {
      clearInterval(sess.timerInterval);
      sess.timerInterval = null;
    }
  }

  // ----------------------------------------------------------------------------
  // API pública
  // ----------------------------------------------------------------------------
  const VoiceInput = {};

  VoiceInput.startRecording = function (buttonEl, targetTextarea) {
    if (!buttonEl) return;
    // Cancelar cualquier sesión previa de este botón
    if (sessions.has(buttonEl)) {
      stopTimer(sessions.get(buttonEl));
    }
    const sess = {
      startedAt: Date.now(),
      targetTextarea: targetTextarea,
      timerInterval: null,
      mediaRecorder: null,
      mediaStream: null
    };
    sessions.set(buttonEl, sess);

    setRecordingUI(buttonEl, true);
    startTimer(buttonEl, sess);

    if (USE_REAL_AUDIO && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        sess.mediaStream = stream;
        try {
          sess.mediaRecorder = new MediaRecorder(stream);
          sess.mediaRecorder.ondataavailable = function () { /* descartamos el audio */ };
          sess.mediaRecorder.start();
        } catch (e) {
          console.warn('[VoiceInput] MediaRecorder no disponible', e);
        }
      }).catch(function (e) {
        console.warn('[VoiceInput] Permiso de micrófono denegado', e);
      });
    }
  };

  VoiceInput.stopRecording = function (buttonEl, targetTextarea) {
    if (!buttonEl) return;
    const sess = sessions.get(buttonEl);
    if (!sess) {
      setRecordingUI(buttonEl, false);
      return;
    }

    const elapsed = Date.now() - sess.startedAt;
    stopTimer(sess);

    // Cerrar MediaRecorder si estaba activo
    if (sess.mediaRecorder && sess.mediaRecorder.state !== 'inactive') {
      try { sess.mediaRecorder.stop(); } catch (e) { /* noop */ }
    }
    if (sess.mediaStream) {
      sess.mediaStream.getTracks().forEach(function (t) { t.stop(); });
    }

    setRecordingUI(buttonEl, false);

    // Grabación demasiado corta: abortar
    if (elapsed < MIN_RECORDING_MS) {
      sessions.delete(buttonEl);
      if (global.UI && typeof global.UI.toast === 'function') {
        global.UI.toast({
          type: 'info',
          title: 'Mantené presionado o tocá de nuevo para grabar',
          duration: 2200
        });
      }
      return;
    }

    // Procesamiento simulado, luego transcribir
    setProcessingUI(buttonEl, true);
    setTimeout(function () {
      setProcessingUI(buttonEl, false);
      const target = targetTextarea || sess.targetTextarea;
      const texto = pickRandomTranscription();
      appendToTextarea(target, texto);
      sessions.delete(buttonEl);
      if (global.UI && typeof global.UI.toast === 'function') {
        global.UI.toast({
          type: 'success',
          title: 'Transcripción agregada',
          duration: 2000
        });
      }
    }, PROCESSING_DELAY_MS);
  };

  VoiceInput.cancelAll = function () {
    sessions.forEach(function (sess, btn) {
      stopTimer(sess);
      if (sess.mediaRecorder && sess.mediaRecorder.state !== 'inactive') {
        try { sess.mediaRecorder.stop(); } catch (e) { /* noop */ }
      }
      if (sess.mediaStream) {
        sess.mediaStream.getTracks().forEach(function (t) { t.stop(); });
      }
      setRecordingUI(btn, false);
      setProcessingUI(btn, false);
    });
    sessions.clear();
  };

  VoiceInput.attach = function (buttonEl, targetTextarea) {
    if (!buttonEl || buttonEl.dataset.voiceBound === '1') return;
    buttonEl.dataset.voiceBound = '1';

    // Estado inicial
    setRecordingUI(buttonEl, false);
    setProcessingUI(buttonEl, false);

    let pressStart = 0;
    let isHold = false;
    let isToggleOn = false; // estado del modo tap-to-toggle

    function resolveTextarea() {
      if (targetTextarea && document.body.contains(targetTextarea)) return targetTextarea;
      const id = buttonEl.getAttribute('data-voice-input');
      if (id) return document.getElementById(id);
      return targetTextarea || null;
    }

    function onStart(e) {
      // Evitar doble disparo touch+click en iOS
      if (e.cancelable) e.preventDefault();
      // Si ya estaba grabando en modo toggle, este press inicia la cuenta para detener
      pressStart = Date.now();
      isHold = false;

      if (isToggleOn) {
        // Segundo tap: terminar (en onEnd, si dura < threshold)
        return;
      }

      // Comenzar grabación inmediatamente; si resulta ser tap corto, queda en modo toggle.
      VoiceInput.startRecording(buttonEl, resolveTextarea());
    }

    function onEnd(e) {
      if (e && e.cancelable) e.preventDefault();
      const dur = Date.now() - pressStart;

      if (isToggleOn) {
        // Estamos en modo toggle: si este press fue corto, lo tomamos como segundo tap → stop.
        if (dur < TAP_HOLD_THRESHOLD) {
          isToggleOn = false;
          VoiceInput.stopRecording(buttonEl, resolveTextarea());
        }
        // Si fue largo, ignoramos (raro) y seguimos en toggle.
        return;
      }

      if (dur >= TAP_HOLD_THRESHOLD) {
        // Hold: terminar al soltar
        isHold = true;
        VoiceInput.stopRecording(buttonEl, resolveTextarea());
      } else {
        // Tap corto: dejar grabando, próximo tap detiene
        isToggleOn = true;
      }
    }

    function onCancel() {
      // Si por alguna razón el pointer sale o se cancela el gesto, no detenemos
      // automáticamente — dejamos al usuario decidir con un siguiente tap.
    }

    const supportsPointer = 'PointerEvent' in window;
    if (supportsPointer) {
      buttonEl.addEventListener('pointerdown', onStart);
      buttonEl.addEventListener('pointerup', onEnd);
      buttonEl.addEventListener('pointercancel', onCancel);
    } else {
      buttonEl.addEventListener('mousedown', onStart);
      buttonEl.addEventListener('mouseup', onEnd);
      buttonEl.addEventListener('touchstart', onStart, { passive: false });
      buttonEl.addEventListener('touchend', onEnd, { passive: false });
    }

    // Soporte teclado: Espacio/Enter inicia tap-to-toggle
    buttonEl.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isToggleOn) {
          isToggleOn = false;
          VoiceInput.stopRecording(buttonEl, resolveTextarea());
        } else {
          VoiceInput.startRecording(buttonEl, resolveTextarea());
          isToggleOn = true;
        }
      }
    });
  };

  VoiceInput.bindAll = function () {
    document.querySelectorAll('[data-voice-input]').forEach(function (btn) {
      const id = btn.getAttribute('data-voice-input');
      const ta = id ? document.getElementById(id) : null;
      VoiceInput.attach(btn, ta);
    });
  };

  function init() {
    VoiceInput.bindAll();
    console.info('[VoiceInput] Mock mode. To enable real recording set USE_REAL_AUDIO = true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.VoiceInput = VoiceInput;
})(window);
