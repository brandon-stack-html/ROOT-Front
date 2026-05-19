/* ============================================================================
   store-comandas.js — Cola de comandas marcadas como listas por KDS (S16)

   Persiste en localStorage: 'root:comandas-listas:v1'
   API pública (window.StoreComandas):
     marcarLista(ticketId, mesaId, mesaNum) → añade a la cola + emite 'comanda-lista'
     listListas({ visto? })                → array filtrado
     marcarVistas()                        → marca todas visto:true + emite 'comanda-lista-vista'
     countNoVistas()                       → entero sin ver
   ============================================================================ */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'root:comandas-listas:v1';

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function save(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function emit(name, detail) {
    global.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: false }));
  }

  var StoreComandas = {};

  StoreComandas.marcarLista = function (ticketId, mesaId, mesaNum) {
    var arr = load();
    arr.push({
      ticketId:  ticketId,
      mesaId:    mesaId  || '',
      mesaNum:   mesaNum || String(mesaId || '').replace('mesa-', ''),
      marcadaEn: new Date().toISOString(),
      visto:     false
    });
    save(arr);
    emit('comanda-lista', { ticketId: ticketId, mesaId: mesaId, mesaNum: mesaNum });
  };

  StoreComandas.listListas = function (opts) {
    var arr = load();
    if (opts && opts.visto !== undefined) {
      return arr.filter(function (x) { return x.visto === opts.visto; });
    }
    return arr;
  };

  StoreComandas.marcarVistas = function () {
    var arr = load();
    arr.forEach(function (x) { x.visto = true; });
    save(arr);
    emit('comanda-lista-vista', {});
  };

  StoreComandas.countNoVistas = function () {
    return load().filter(function (x) { return !x.visto; }).length;
  };

  global.StoreComandas = StoreComandas;
  console.info('[StoreComandas] listo.');
})(window);
