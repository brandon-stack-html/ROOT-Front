/* ============================================================================
   ui.js — API global de UI: modal, drawer, toast, tabs
   Sprint 0.4 (overlays + tabs) — Sprint 0.6 agregará el hamburguer del backoffice
   ============================================================================ */
(function (global) {
  'use strict';

  const UI = {};

  // ----------------------------------------------------------------------------
  // Helpers internos
  // ----------------------------------------------------------------------------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function getBackdropById(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn('[UI] No se encontró el overlay con id "' + id + '"');
      return null;
    }
    return el;
  }

  // Pila de overlays abiertos para que ESC cierre el último primero
  const overlayStack = [];

  function pushOverlay(el, kind) {
    overlayStack.push({ el, kind });
  }
  function popOverlay(el) {
    const idx = overlayStack.findIndex(o => o.el === el);
    if (idx >= 0) overlayStack.splice(idx, 1);
  }

  // Listener global de ESC (una vez)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (overlayStack.length === 0) return;
    const top = overlayStack[overlayStack.length - 1];
    if (top.kind === 'modal') UI.closeModal(top.el.id);
    else if (top.kind === 'drawer') UI.closeDrawer(top.el.id);
  });

  // ----------------------------------------------------------------------------
  // Modal
  // ----------------------------------------------------------------------------
  UI.openModal = function (id) {
    const el = getBackdropById(id);
    if (!el) return;
    el.classList.add('is-open');
    pushOverlay(el, 'modal');
    // Click en backdrop cierra (solo si el target es el backdrop mismo)
    el.addEventListener('click', onBackdropClick);
  };

  UI.closeModal = function (id) {
    const el = typeof id === 'string' ? getBackdropById(id) : id;
    if (!el) return;
    el.classList.remove('is-open');
    el.removeEventListener('click', onBackdropClick);
    popOverlay(el);
  };

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) {
      const kind = e.currentTarget.classList.contains('drawer-backdrop') ? 'drawer' : 'modal';
      if (kind === 'modal') UI.closeModal(e.currentTarget.id);
      else UI.closeDrawer(e.currentTarget.id);
    }
  }

  // ----------------------------------------------------------------------------
  // Drawer
  // ----------------------------------------------------------------------------
  UI.openDrawer = function (id) {
    const el = getBackdropById(id);
    if (!el) return;
    el.classList.add('is-open');
    pushOverlay(el, 'drawer');
    el.addEventListener('click', onBackdropClick);
  };

  UI.closeDrawer = function (id) {
    const el = typeof id === 'string' ? getBackdropById(id) : id;
    if (!el) return;
    el.classList.remove('is-open');
    el.removeEventListener('click', onBackdropClick);
    popOverlay(el);
  };

  // ----------------------------------------------------------------------------
  // Toast
  // ----------------------------------------------------------------------------
  function ensureToastContainer() {
    let c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  const TOAST_ICONS = { success: '✓', error: '✕', warning: '!', info: 'i' };

  UI.toast = function (opts) {
    opts = opts || {};
    const type = opts.type || 'info';
    const title = opts.title || '';
    const sub = opts.sub || '';
    const duration = typeof opts.duration === 'number' ? opts.duration : 4000;

    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    toast.innerHTML =
      '<span class="toast-icon">' + (TOAST_ICONS[type] || '') + '</span>' +
      '<div class="toast-content">' +
        '<div class="toast-title"></div>' +
        (sub ? '<div class="toast-sub"></div>' : '') +
      '</div>' +
      '<button class="toast-close" aria-label="Cerrar">×</button>';

    // Setear texto vía textContent para evitar HTML injection
    toast.querySelector('.toast-title').textContent = title;
    if (sub) toast.querySelector('.toast-sub').textContent = sub;

    const close = function () {
      toast.classList.add('is-leaving');
      setTimeout(function () { toast.remove(); }, 220);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(close, duration);
    }

    return { close: close, el: toast };
  };

  // ----------------------------------------------------------------------------
  // Tabs
  // ----------------------------------------------------------------------------
  UI.tabs = function (containerSelector) {
    const root = typeof containerSelector === 'string' ? $(containerSelector) : containerSelector;
    if (!root) return;
    const tabs = $$('[data-tab]', root);
    const panels = $$('[data-panel]', root);

    function activate(name) {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
    }

    tabs.forEach(t => {
      t.addEventListener('click', () => activate(t.dataset.tab));
    });

    // Activar el primero por defecto si ninguno está activo
    if (tabs.length && !tabs.some(t => t.classList.contains('is-active'))) {
      activate(tabs[0].dataset.tab);
    }
  };

  // ----------------------------------------------------------------------------
  // Auto-triggers via data-attributes
  //   [data-open-modal="id"]  → click abre modal
  //   [data-open-drawer="id"] → click abre drawer
  //   [data-close]            → click cierra el overlay padre
  // ----------------------------------------------------------------------------
  UI.bindAutoTriggers = function () {
    document.body.addEventListener('click', function (e) {
      const openModalTrigger = e.target.closest('[data-open-modal]');
      if (openModalTrigger) {
        UI.openModal(openModalTrigger.getAttribute('data-open-modal'));
        return;
      }
      const openDrawerTrigger = e.target.closest('[data-open-drawer]');
      if (openDrawerTrigger) {
        UI.openDrawer(openDrawerTrigger.getAttribute('data-open-drawer'));
        return;
      }
      const closeTrigger = e.target.closest('[data-close]');
      if (closeTrigger) {
        const backdrop = closeTrigger.closest('.modal-backdrop, .drawer-backdrop');
        if (!backdrop) return;
        if (backdrop.classList.contains('drawer-backdrop')) UI.closeDrawer(backdrop.id);
        else UI.closeModal(backdrop.id);
      }
    });

    // Inicializar todos los grupos de tabs declarados con [data-tabs]
    $$('[data-tabs]').forEach(root => UI.tabs(root));
  };

  // ----------------------------------------------------------------------------
  // Bootstrap
  // ----------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UI.bindAutoTriggers);
  } else {
    UI.bindAutoTriggers();
  }

  global.UI = UI;
})(window);
