/* ============================================================================
   theme.js — Toggle de tema dark/light, persistido
   Sprint 0.5

   IMPORTANTE: cargar este script en el <head> ANTES del CSS para evitar
   el flash de tema incorrecto. La IIFE se ejecuta de forma síncrona y
   setea data-theme en <html> antes de que el navegador pinte.
   ============================================================================ */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1) Resolver tema inicial y aplicarlo INMEDIATAMENTE (síncrono)
  //    Evita el flash blanco→negro o negro→blanco al cargar la página.
  // ---------------------------------------------------------------------------
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Si localStorage falla (modo privado, etc.), default a light.
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // ---------------------------------------------------------------------------
  // 2) API pública: window.toggleTheme()
  // ---------------------------------------------------------------------------
  window.toggleTheme = function () {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* noop */ }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    return next;
  };

  // ---------------------------------------------------------------------------
  // 3) Delegación global: click en [data-toggle-theme] dispara el toggle
  // ---------------------------------------------------------------------------
  function bind() {
    document.body.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-toggle-theme]');
      if (trigger) {
        window.toggleTheme();
      }
    });

    // Si hay íconos lucide en la página, repintarlos cuando cambia el tema
    // (lucide no observa cambios en data-theme; el CSS oculta uno y muestra otro,
    // pero si quisiéramos reinyectarlos podríamos hacerlo aquí).
    document.addEventListener('themechange', function () {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
