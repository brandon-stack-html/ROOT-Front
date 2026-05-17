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
    else if (top.kind === 'sheet') UI.closeBottomSheet(top.el.id);
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
  // Bottom Sheet (App Mesero — slide-up desde abajo dentro del frame)
  //   El elemento sheet tiene id="...". Su backdrop hermano debe tener
  //   la clase .bottom-sheet-backdrop con atributo data-sheet="<id>".
  //   Se abren ambos sincronizados.
  // ----------------------------------------------------------------------------
  function getSheetBackdrop(sheet) {
    if (!sheet) return null;
    const id = sheet.id;
    return document.querySelector('.bottom-sheet-backdrop[data-sheet="' + id + '"]');
  }

  function onSheetBackdropClick(e) {
    if (e.target === e.currentTarget) {
      const id = e.currentTarget.getAttribute('data-sheet');
      UI.closeBottomSheet(id);
    }
  }

  function cancelVoiceInputs() {
    if (global.VoiceInput && typeof global.VoiceInput.cancelAll === 'function') {
      global.VoiceInput.cancelAll();
    }
  }

  UI.openBottomSheet = function (id) {
    const el = getBackdropById(id);
    if (!el) return;
    cancelVoiceInputs();
    el.classList.add('is-open');
    const bd = getSheetBackdrop(el);
    if (bd) {
      bd.classList.add('is-open');
      bd.addEventListener('click', onSheetBackdropClick);
    }
    pushOverlay(el, 'sheet');
  };

  UI.closeBottomSheet = function (id) {
    const el = typeof id === 'string' ? getBackdropById(id) : id;
    if (!el) return;
    cancelVoiceInputs();
    el.classList.remove('is-open');
    const bd = getSheetBackdrop(el);
    if (bd) {
      bd.classList.remove('is-open');
      bd.removeEventListener('click', onSheetBackdropClick);
    }
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
  // Empty state helper — Sprint 10.2
  //   UI.toggleEmpty(targetSelector, hasResults)
  //   Oculta/muestra una tabla/lista y su .empty-state hermano dentro del
  //   mismo contenedor padre.
  // ----------------------------------------------------------------------------
  UI.toggleEmpty = function (targetSelector, hasResults) {
    const target = typeof targetSelector === 'string' ? $(targetSelector) : targetSelector;
    if (!target) return;
    const empty = target.parentElement
      ? target.parentElement.querySelector('.empty-state')
      : null;
    target.hidden = !hasResults;
    if (empty) empty.hidden = hasResults;
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
      const openSheetTrigger = e.target.closest('[data-open-sheet]');
      if (openSheetTrigger) {
        UI.openBottomSheet(openSheetTrigger.getAttribute('data-open-sheet'));
        return;
      }
      const closeTrigger = e.target.closest('[data-close]');
      if (closeTrigger) {
        const sheet = closeTrigger.closest('.bottom-sheet');
        if (sheet) { UI.closeBottomSheet(sheet.id); return; }
        const backdrop = closeTrigger.closest('.modal-backdrop, .drawer-backdrop');
        if (!backdrop) return;
        if (backdrop.classList.contains('drawer-backdrop')) UI.closeDrawer(backdrop.id);
        else UI.closeModal(backdrop.id);
      }
    });

    // Inicializar todos los grupos de tabs declarados con [data-tabs]
    $$('[data-tabs]').forEach(root => UI.tabs(root));

    // Backoffice: toggle del sidebar en mobile via [data-toggle-sidebar]
    document.body.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-toggle-sidebar]');
      if (trigger) {
        const sidebar = $('.bo-sidebar');
        const backdrop = $('.bo-sidebar-backdrop');
        if (sidebar) sidebar.classList.toggle('is-open');
        if (backdrop) backdrop.classList.toggle('is-open');
        return;
      }
      // Click en el backdrop del sidebar cierra
      if (e.target.classList.contains('bo-sidebar-backdrop')) {
        $('.bo-sidebar')?.classList.remove('is-open');
        e.target.classList.remove('is-open');
      }
    });

    // Si el viewport pasa a desktop, cerrar el drawer del sidebar
    const desktopMQ = window.matchMedia('(min-width: 1024px)');
    desktopMQ.addEventListener('change', function (e) {
      if (e.matches) {
        $('.bo-sidebar')?.classList.remove('is-open');
        $('.bo-sidebar-backdrop')?.classList.remove('is-open');
      }
    });
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
