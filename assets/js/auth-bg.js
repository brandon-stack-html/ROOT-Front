/* ============================================================================
   auth-bg.js — Fondo constelación animada
   Soporta: .auth-page / .selector-page (paleta accent) y .e1-top (blanco)
   Vanilla JS. Sin dependencias. Cumple CLAUDE.md.
   ============================================================================ */

(function () {
  'use strict';

  // ── Targets con config propia ─────────────────────────────────────────────
  var TARGETS = [
    {
      // Sprint 15 — Login full-page: puntos blancos sobre gradiente púrpura.
      selector : '.auth-login-shell',
      color    : [255, 255, 255],
      fullPage : true,
      density  : 1 / 10000,
      minP     : 55, maxP : 150,
      linkDist : 0,
      mouseR   : 140, mousePush : 0.05,
      speed    : 0.035, damping : 0.994, minDrift : 0.008,
      pRadius  : 1.5,
      lineMax  : 0,
      dotBase  : 0.55, dotNear : 1.0,
      glow     : 18, glowNear : 36
    },
    {
      // Shell split (Sprint 14): la constelación vive dentro del panel derecho.
      selector : '.auth-shell-panel',
      color    : null,
      fullPage : false,
      density  : 1 / 16000,
      minP     : 18, maxP : 60,
      linkDist : 120,
      mouseR   : 150, mousePush : 0.06,
      speed    : 0.05, damping : 0.992, minDrift : 0.012,
      pRadius  : 1.5,
      lineMax  : 0.18, dotBase : 0.42, dotNear : 0.62,
      glow     : 5, glowNear : 9
    },
    {
      selector : '.auth-page',
      color    : null,       // null = leer --accent de CSS
      fullPage : true,       // el canvas cubre todo el viewport de la página
      density  : 1 / 8500,
      minP     : 48, maxP : 180,
      linkDist : 165,
      mouseR   : 170, mousePush : 0.085,
      speed    : 0.08, damping : 0.992, minDrift : 0.018,
      pRadius  : 2.1,
      lineMax  : 0.55, dotBase : 0.85, dotNear : 1.0,
      glow     : 14, glowNear : 22
    },
    {
      selector : '.selector-page',
      color    : null,
      fullPage : true,
      density  : 1 / 8500,
      minP     : 48, maxP : 180,
      linkDist : 165,
      mouseR   : 170, mousePush : 0.085,
      speed    : 0.08, damping : 0.992, minDrift : 0.018,
      pRadius  : 2.1,
      lineMax  : 0.55, dotBase : 0.85, dotNear : 1.0,
      glow     : 14, glowNear : 22
    },
    {
      selector : '.e1-top',
      color    : [255, 255, 255], // blanco — partículas tipo estrella sobre gradiente indigo
      fullPage : false,
      density  : 1 / 3200,
      minP     : 22, maxP : 60,
      linkDist : 95,
      mouseR   : 100, mousePush : 0.07,
      speed    : 0.06, damping : 0.993, minDrift : 0.012,
      pRadius  : 1.8,
      lineMax  : 0.42, dotBase : 0.78, dotNear : 1.0,
      glow     : 10, glowNear : 18
    }
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────
  function readAccent(varName) {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName || '--accent').trim() || '#4F46E5';
    var m = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      var hex = m[1].length === 3
        ? m[1].split('').map(function (c) { return c + c; }).join('')
        : m[1];
      var n = parseInt(hex, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return [79, 70, 229];
  }

  // ── Instancia por target ───────────────────────────────────────────────────
  function createConstellation(wrapper, cfg) {
    var canvas = document.createElement('canvas');
    canvas.className = 'auth-constellation';
    canvas.setAttribute('aria-hidden', 'true');

    // estilos inline para no depender de auth.css en todas las páginas
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'z-index:0',
      'pointer-events:none',
      'display:block'
    ].join(';');

    wrapper.insertBefore(canvas, wrapper.firstChild);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced   = reducedMQ.matches;

    var particles = [];
    var width = 0, height = 0, dpr = 1;
    var mouseX = -9999, mouseY = -9999;
    var rafId = null;
    var color = cfg.color || readAccent(cfg.colorVar);

    function seed(count) {
      particles = new Array(count);
      for (var i = 0; i < count; i++) {
        particles[i] = {
          x  : Math.random() * width,
          y  : Math.random() * height,
          vx : (Math.random() - 0.5) * cfg.speed,
          vy : (Math.random() - 0.5) * cfg.speed,
          r  : cfg.pRadius * (0.7 + Math.random() * 0.6)
        };
      }
    }

    function resize() {
      var rect = wrapper.getBoundingClientRect();
      if (cfg.fullPage) {
        width  = Math.max(rect.width,  window.innerWidth);
        height = Math.max(rect.height, window.innerHeight);
      } else {
        width  = rect.width  || window.innerWidth;
        height = rect.height || 240;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(width  * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var target = Math.round(width * height * cfg.density);
      seed(Math.max(cfg.minP, Math.min(cfg.maxP, target)));
    }

    function step() {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = mouseX - p.x, dy = mouseY - p.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < cfg.mouseR * cfg.mouseR) {
          var d = Math.sqrt(d2) || 1;
          var f = (1 - d / cfg.mouseR) * cfg.mousePush;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= cfg.damping;
        p.vy *= cfg.damping;
        if (Math.hypot(p.vx, p.vy) < cfg.minDrift) {
          p.vx += (Math.random() - 0.5) * cfg.speed * 0.6;
          p.vy += (Math.random() - 0.5) * cfg.speed * 0.6;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      var r = color[0], g = color[1], b = color[2];

      // Líneas
      ctx.shadowBlur = 0;
      for (var i = 0; i < particles.length; i++) {
        var a = particles[i];
        for (var j = i + 1; j < particles.length; j++) {
          var c = particles[j];
          var dx = a.x - c.x, dy = a.y - c.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < cfg.linkDist * cfg.linkDist) {
            var d  = Math.sqrt(d2);
            var t  = 1 - d / cfg.linkDist;
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (t * cfg.lineMax).toFixed(3) + ')';
            ctx.lineWidth = 0.5 + t * 0.85;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }

      // Puntos con glow
      ctx.shadowColor = 'rgb(' + r + ',' + g + ',' + b + ')';
      for (var k = 0; k < particles.length; k++) {
        var p  = particles[k];
        var mx = mouseX - p.x, my = mouseY - p.y;
        var near = (mx * mx + my * my) < cfg.mouseR * cfg.mouseR;
        ctx.shadowBlur = near ? cfg.glowNear : cfg.glow;
        ctx.fillStyle  = 'rgba(' + r + ',' + g + ',' + b + ',' + (near ? cfg.dotNear : cfg.dotBase) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r * 1.45 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function loop() {
      step(); draw();
      rafId = requestAnimationFrame(loop);
    }

    // Eventos
    function onMouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() { mouseX = -9999; mouseY = -9999; }

    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); if (reduced) draw(); }, 120);
    }
    function onVisibility() {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (!reduced && !rafId) {
        loop();
      }
    }
    function onThemeChange() {
      if (!cfg.color) color = readAccent(cfg.colorVar);
    }
    function onMotionPref(e) {
      reduced = e.matches;
      if (reduced) { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } draw(); }
      else if (!rafId) { loop(); }
    }

    resize();
    window.addEventListener('resize',    onResize,    { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave',       onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);
    new MutationObserver(onThemeChange).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme']
    });
    if (typeof reducedMQ.addEventListener === 'function') {
      reducedMQ.addEventListener('change', onMotionPref);
    } else if (typeof reducedMQ.addListener === 'function') {
      reducedMQ.addListener(onMotionPref);
    }

    reduced ? draw() : loop();
  }

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  function start() {
    for (var i = 0; i < TARGETS.length; i++) {
      var el = document.querySelector(TARGETS[i].selector);
      if (el) { createConstellation(el, TARGETS[i]); break; }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
