/* ============================================================================
   storefront.js — Estado compartido del carrito + helpers (Sprint 9)
   Persistencia en localStorage para que el carrito sobreviva entre páginas.
   ============================================================================ */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'sf-cart-v1';

  // ----------------------------------------------------------------------------
  // Helpers de formato
  // ----------------------------------------------------------------------------
  function fmtCOP(value) {
    const n = Math.round(value || 0);
    return '$' + n.toLocaleString('es-CO');
  }

  // ----------------------------------------------------------------------------
  // Estado del carrito
  // ----------------------------------------------------------------------------
  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* noop */ }
  }

  function totalItems(cart) {
    return cart.reduce((acc, it) => acc + (it.qty || 1), 0);
  }

  function totalPrice(cart) {
    return cart.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 1), 0);
  }

  function dispatchChange() {
    window.dispatchEvent(new CustomEvent('sf-cart-change', {
      detail: { cart: SF.cart },
    }));
  }

  const SF = {
    cart: readCart(),
    fmtCOP: fmtCOP,
  };

  SF.addToCart = function (item) {
    // item: { id, nombre, precio, grad, icon, qty (opcional), modifs (opcional) }
    const qty = item.qty || 1;
    const existing = SF.cart.find(c => c.id === item.id && !c.modifs);
    if (existing && !item.modifs) {
      existing.qty = (existing.qty || 1) + qty;
    } else {
      SF.cart.push(Object.assign({}, item, { qty: qty }));
    }
    writeCart(SF.cart);
    dispatchChange();
  };

  SF.removeFromCart = function (idx) {
    SF.cart.splice(idx, 1);
    writeCart(SF.cart);
    dispatchChange();
  };

  SF.clearCart = function () {
    SF.cart = [];
    writeCart(SF.cart);
    dispatchChange();
  };

  SF.totalItems = function () { return totalItems(SF.cart); };
  SF.totalPrice = function () { return totalPrice(SF.cart); };

  // Sincronizar entre pestañas
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      SF.cart = readCart();
      dispatchChange();
    }
  });

  // ----------------------------------------------------------------------------
  // Cart bar (F1 carta QR mobile)
  //   <button class="sf-cart-bar" id="sfCartBar"> ... </button>
  // ----------------------------------------------------------------------------
  SF.renderCartBar = function () {
    const bar = document.getElementById('sfCartBar');
    if (!bar) return;
    const count = SF.totalItems();
    const total = SF.totalPrice();
    if (count === 0) {
      bar.classList.remove('is-visible');
      return;
    }
    bar.classList.add('is-visible');
    const countEl = bar.querySelector('.sf-cart-bar-count');
    const subEl   = bar.querySelector('.sf-cart-bar-sub');
    const totalEl = bar.querySelector('.sf-cart-bar-total-amount');
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = fmtCOP(total);
    if (subEl) {
      const names = SF.cart.map(c => c.nombre).slice(0, 2).join(' + ');
      const more  = SF.cart.length > 2 ? ' + ' + (SF.cart.length - 2) + ' más' : '';
      subEl.textContent = names + more;
    }
  };

  SF.bounceCartBar = function () {
    const bar = document.getElementById('sfCartBar');
    if (!bar) return;
    bar.classList.add('is-bounce');
    setTimeout(() => bar.classList.remove('is-bounce'), 450);
  };

  // ----------------------------------------------------------------------------
  // Cart button (F3/F4 desktop nav)
  //   <a class="sf-cart-btn" id="sfCartBtn">
  //     <svg> </svg> <span>Carrito</span> · <span class="sf-cart-btn-count">3</span>
  //   </a>
  // ----------------------------------------------------------------------------
  SF.renderCartBtn = function () {
    const count = SF.totalItems();
    const total = SF.totalPrice();
    const btn = document.getElementById('sfCartBtn');
    if (btn) {
      const labelEl = btn.querySelector('.sf-cart-btn-label');
      const countEl = btn.querySelector('.sf-cart-btn-count');
      if (labelEl) labelEl.textContent = count > 0 ? fmtCOP(total) : 'Carrito';
      if (countEl) {
        countEl.textContent = count;
        countEl.classList.toggle('is-visible', count > 0);
      }
    }
    // FAB carrito flotante (móvil) — sincronizar con el botón principal
    document.querySelectorAll('.sf-cart-fab-count').forEach(function (el) {
      el.textContent = count;
      el.classList.toggle('is-visible', count > 0);
    });
  };

  // ----------------------------------------------------------------------------
  // Init: re-renderizar al cargar y al cambiar el carrito
  // ----------------------------------------------------------------------------
  function rerender() {
    SF.renderCartBar();
    SF.renderCartBtn();
  }

  window.addEventListener('sf-cart-change', rerender);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rerender);
  } else {
    rerender();
  }

  global.SF = SF;
})(window);
