/* ============================================================================
   voice-recorder.js — Wrapper Web Speech API para Audio Orders (Sprint 14)

   Diferente de voice-input.js (Sprint 12, para observaciones mock).
   Este módulo usa Web Speech API real para transcripción de comandas.

   API pública (window.VoiceRecorder):
     isSupported()          → boolean
     start(opts)            → inicia grabación
       opts.onTranscript(text, isFinal)
       opts.onStateChange(state)  // 'recording' | 'processing' | 'error' | 'idle'
       opts.onError(msg)
     stop()                 → detiene y emite resultado final
     cancel()               → cancela sin resultado

   Estado expuesto: VoiceRecorder.state
   ============================================================================ */
(function (global) {
  'use strict';

  var SpeechRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;

  var VoiceRecorder = {};

  VoiceRecorder.state = 'idle'; // 'idle' | 'requesting-permission' | 'recording' | 'processing' | 'error'

  var _recognition = null;
  var _opts = {};
  var _finalTranscript = '';
  var _interimTranscript = '';

  // ── Soporte ──────────────────────────────────────────────────────────────
  VoiceRecorder.isSupported = function () {
    return !!(global.SpeechRecognition || global.webkitSpeechRecognition);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function setState(s) {
    VoiceRecorder.state = s;
    if (_opts.onStateChange) _opts.onStateChange(s);
  }

  function emitError(msg) {
    setState('error');
    if (_opts.onError) _opts.onError(msg);
  }

  // ── Iniciar ───────────────────────────────────────────────────────────────
  VoiceRecorder.start = function (opts) {
    _opts = opts || {};
    _finalTranscript = '';
    _interimTranscript = '';

    if (!VoiceRecorder.isSupported()) {
      emitError('Tu navegador no soporta dictado por voz. Usá Chrome o Safari.');
      return;
    }

    if (_recognition) {
      try { _recognition.abort(); } catch (e) {}
    }

    setState('requesting-permission');

    _recognition = new SpeechRecognition();
    _recognition.lang = 'es-CO';
    _recognition.continuous = true;
    _recognition.interimResults = true;
    _recognition.maxAlternatives = 3;

    _recognition.onstart = function () {
      setState('recording');
    };

    _recognition.onresult = function (e) {
      _interimTranscript = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var text = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          _finalTranscript += text + ' ';
          if (_opts.onTranscript) _opts.onTranscript(_finalTranscript.trim(), true);
        } else {
          _interimTranscript += text;
          if (_opts.onTranscript) _opts.onTranscript((_finalTranscript + _interimTranscript).trim(), false);
        }
      }
    };

    _recognition.onerror = function (e) {
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        // Guardar flag de sesión para no volver a pedir
        try { sessionStorage.setItem('root:voice:permission-denied', '1'); } catch (err) {}
        emitError('Activá el micrófono para usar esta función.');
      } else if (e.error === 'no-speech') {
        emitError('No detectamos voz. Intentá de nuevo.');
      } else if (e.error === 'aborted') {
        setState('idle');
      } else {
        emitError('Error de micrófono: ' + e.error);
      }
    };

    _recognition.onend = function () {
      if (VoiceRecorder.state === 'recording') {
        // Terminó solo (silencio prolongado) → igual tratamos como stop
        setState('processing');
        _deliver();
      }
    };

    try {
      _recognition.start();
    } catch (e) {
      emitError('No se pudo iniciar el micrófono: ' + e.message);
    }
  };

  // ── Detener y devolver transcript ─────────────────────────────────────────
  VoiceRecorder.stop = function () {
    if (!_recognition) return;
    setState('processing');
    try { _recognition.stop(); } catch (e) {}
    _deliver();
  };

  // ── Cancelar sin resultado ────────────────────────────────────────────────
  VoiceRecorder.cancel = function () {
    if (_recognition) {
      try { _recognition.abort(); } catch (e) {}
      _recognition = null;
    }
    _opts = {};
    setState('idle');
  };

  function _deliver() {
    var final = (_finalTranscript + ' ' + _interimTranscript).trim();
    _recognition = null;
    // Pequeño delay para dar sensación de "procesando"
    setTimeout(function () {
      setState('idle');
      if (_opts.onResult) _opts.onResult(final);
    }, 300);
  }

  // ── Verificar si permiso fue denegado en esta sesión ──────────────────────
  VoiceRecorder.wasPermissionDenied = function () {
    try { return sessionStorage.getItem('root:voice:permission-denied') === '1'; } catch (e) { return false; }
  };

  global.VoiceRecorder = VoiceRecorder;

})(window);
