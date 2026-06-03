/* ============================================================================
   store-mesas.js — Store compartido de mesas (Sprint 14)

   Persiste en localStorage bajo la key root:mesas:v1.
   Si no existe, hidrata con el seed de 18 mesas (3 salas).

   API pública (window.StoreMesas):
     listMesas({ sala? })        → array de mesas (filtrado opcional por sala)
     getMesa(id)                 → objeto mesa | undefined
     addItemsAMesa(mesaId, items) → escribe ítems y emite 'comanda-creada'
     cambiarEstado(mesaId, est)  → cambia estado y emite 'mesa-actualizada'
     liberar(mesaId)             → resetea la mesa y emite 'mesa-actualizada'
     _reset()                    → borra el store y recarga el seed (dev/testing)

   Eventos emitidos en window:
     'mesa-actualizada'  → detail: { mesaId }
     'comanda-creada'    → detail: { mesaId, items }
   ============================================================================ */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'root:mesas:v1';

  // --------------------------------------------------------------------------
  // Seed — 18 mesas, 3 salas
  // --------------------------------------------------------------------------
  // Todos los abiertaEn son relativos a la hora de carga para que los tiempos
  // de ocupación se vean realistas.
  function buildSeed() {
    const now = Date.now();
    const ago = function (min) { return new Date(now - min * 60 * 1000).toISOString(); };

    return [
      // ── Principal (10 mesas) ─────────────────────────────────────────────
      {
        id: 'mesa-1', numero: 1, sala: 'principal', capacidad: 4,
        comensales: 3, estado: 'ocupada',
        meseroId: 'emp-001', meseroNombre: 'Camila Rojas',
        abiertaEn: ago(23), ultimaComanda: ago(10),
        items: [
          { sku: 'BPA-001', nombre: 'Bandeja Paisa', cantidad: 2, precio: 32000, mods: [], comanda: 'enviada' },
          { sku: 'LIM-001', nombre: 'Limonada Natural', cantidad: 2, precio: 9000, mods: [], comanda: 'enviada' },
          { sku: 'AJB-001', nombre: 'Ajiaco Bogotano', cantidad: 1, precio: 28000, mods: [], comanda: 'enviada' }
        ],
        total: 107000
      },
      {
        id: 'mesa-2', numero: 2, sala: 'principal', capacidad: 2,
        comensales: 0, estado: 'libre',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },
      {
        id: 'mesa-3', numero: 3, sala: 'principal', capacidad: 6,
        comensales: 5, estado: 'ocupada',
        meseroId: 'emp-002', meseroNombre: 'Andrés Moreno',
        abiertaEn: ago(8), ultimaComanda: ago(3),
        items: [
          { sku: 'CHN-001', nombre: 'Changua', cantidad: 2, precio: 12000, mods: [], comanda: 'enviada' },
          { sku: 'AJB-001', nombre: 'Ajiaco Bogotano', cantidad: 3, precio: 28000, mods: [], comanda: 'lista' },
          { sku: 'AGA-001', nombre: 'Agua Panela', cantidad: 4, precio: 4500, mods: [], comanda: 'enviada' }
        ],
        total: 120000
      },
      {
        id: 'mesa-4', numero: 4, sala: 'principal', capacidad: 4,
        comensales: 4, estado: 'por-cobrar',
        meseroId: 'emp-001', meseroNombre: 'Camila Rojas',
        abiertaEn: ago(67), ultimaComanda: ago(45),
        items: [
          { sku: 'BPA-001', nombre: 'Bandeja Paisa', cantidad: 4, precio: 32000, mods: [], comanda: 'lista' },
          { sku: 'GAS-001', nombre: 'Gaseosa Postobón', cantidad: 4, precio: 5000, mods: [], comanda: 'lista' }
        ],
        total: 148000
      },
      {
        id: 'mesa-5', numero: 5, sala: 'principal', capacidad: 2,
        comensales: 0, estado: 'libre',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },
      {
        id: 'mesa-6', numero: 6, sala: 'principal', capacidad: 4,
        comensales: 2, estado: 'ocupada',
        meseroId: 'emp-003', meseroNombre: 'Valentina Cruz',
        abiertaEn: ago(35), ultimaComanda: ago(20),
        items: [
          { sku: 'SOB-001', nombre: 'Sobrebarriga', cantidad: 2, precio: 34000, mods: [{ tipo: 'remover', valor: 'ají' }], comanda: 'enviada' },
          { sku: 'JUG-001', nombre: 'Jugo de Mora', cantidad: 2, precio: 8000, mods: [], comanda: 'enviada' }
        ],
        total: 84000
      },
      {
        id: 'mesa-7', numero: 7, sala: 'principal', capacidad: 8,
        comensales: 0, estado: 'reservada',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },
      {
        id: 'mesa-8', numero: 8, sala: 'principal', capacidad: 4,
        comensales: 1, estado: 'ocupada',
        meseroId: 'emp-002', meseroNombre: 'Andrés Moreno',
        abiertaEn: ago(12), ultimaComanda: ago(8),
        items: [
          { sku: 'SOP-001', nombre: 'Sopa de Mondongo', cantidad: 1, precio: 22000, mods: [], comanda: 'enviada' },
          { sku: 'POA-001', nombre: 'Postre del día', cantidad: 1, precio: 9000, mods: [], comanda: 'pendiente' }
        ],
        total: 31000
      },
      {
        id: 'mesa-9', numero: 9, sala: 'principal', capacidad: 2,
        comensales: 2, estado: 'ocupada',
        meseroId: 'emp-003', meseroNombre: 'Valentina Cruz',
        abiertaEn: ago(48), ultimaComanda: ago(30),
        items: [
          { sku: 'MEN-001', nombre: 'Menú del Día', cantidad: 2, precio: 19500, mods: [], comanda: 'lista' },
          { sku: 'CAF-001', nombre: 'Café Tinto', cantidad: 2, precio: 3500, mods: [], comanda: 'enviada' }
        ],
        total: 46000
      },
      {
        id: 'mesa-10', numero: 10, sala: 'principal', capacidad: 4,
        comensales: 0, estado: 'limpieza',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },

      // ── Terraza (6 mesas) ────────────────────────────────────────────────
      {
        id: 'mesa-11', numero: 11, sala: 'terraza', capacidad: 4,
        comensales: 0, estado: 'libre',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },
      {
        id: 'mesa-12', numero: 12, sala: 'terraza', capacidad: 4,
        comensales: 3, estado: 'ocupada',
        meseroId: 'emp-001', meseroNombre: 'Camila Rojas',
        abiertaEn: ago(23), ultimaComanda: ago(10),
        items: [
          { sku: 'AJB-001', nombre: 'Ajiaco Bogotano', cantidad: 2, precio: 28000, mods: [], comanda: 'enviada' },
          { sku: 'LIM-001', nombre: 'Limonada Natural', cantidad: 3, precio: 9000, mods: [], comanda: 'enviada' }
        ],
        total: 78500
      },
      {
        id: 'mesa-13', numero: 13, sala: 'terraza', capacidad: 6,
        comensales: 6, estado: 'por-cobrar',
        meseroId: 'emp-002', meseroNombre: 'Andrés Moreno',
        abiertaEn: ago(90), ultimaComanda: ago(60),
        items: [
          { sku: 'BPA-001', nombre: 'Bandeja Paisa', cantidad: 6, precio: 32000, mods: [], comanda: 'lista' }
        ],
        total: 192000
      },
      {
        id: 'mesa-14', numero: 14, sala: 'terraza', capacidad: 2,
        comensales: 2, estado: 'ocupada',
        meseroId: 'emp-003', meseroNombre: 'Valentina Cruz',
        abiertaEn: ago(15), ultimaComanda: ago(5),
        items: [
          { sku: 'MEN-001', nombre: 'Menú del Día', cantidad: 2, precio: 19500, mods: [], comanda: 'enviada' }
        ],
        total: 39000
      },
      {
        id: 'mesa-15', numero: 15, sala: 'terraza', capacidad: 4,
        comensales: 0, estado: 'libre',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      },
      {
        id: 'mesa-16', numero: 16, sala: 'terraza', capacidad: 4,
        comensales: 3, estado: 'ocupada',
        meseroId: 'emp-001', meseroNombre: 'Camila Rojas',
        abiertaEn: ago(55), ultimaComanda: ago(40),
        items: [
          { sku: 'SOB-001', nombre: 'Sobrebarriga', cantidad: 3, precio: 34000, mods: [], comanda: 'lista' },
          { sku: 'JUG-001', nombre: 'Jugo de Maracuyá', cantidad: 3, precio: 8000, mods: [], comanda: 'lista' }
        ],
        total: 126000
      },

      // ── VIP (2 mesas) ────────────────────────────────────────────────────
      {
        id: 'mesa-17', numero: 17, sala: 'vip', capacidad: 6,
        comensales: 4, estado: 'ocupada',
        meseroId: 'emp-003', meseroNombre: 'Valentina Cruz',
        abiertaEn: ago(40), ultimaComanda: ago(20),
        items: [
          { sku: 'COS-001', nombre: 'Costillas BBQ', cantidad: 4, precio: 45000, mods: [{ tipo: 'extra', valor: 'salsa' }], comanda: 'enviada' },
          { sku: 'VIN-001', nombre: 'Vino Tinto Copa', cantidad: 4, precio: 22000, mods: [], comanda: 'enviada' }
        ],
        total: 268000
      },
      {
        id: 'mesa-18', numero: 18, sala: 'vip', capacidad: 8,
        comensales: 0, estado: 'libre',
        meseroId: null, meseroNombre: null,
        abiertaEn: null, ultimaComanda: null,
        items: [], total: 0
      }
    ];
  }

  // --------------------------------------------------------------------------
  // Persistencia
  // --------------------------------------------------------------------------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* noop */ }
    return null;
  }

  function save(mesas) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
    } catch (e) {
      console.warn('[StoreMesas] No se pudo persistir en localStorage', e);
    }
  }

  const VALID_SALAS = ['principal', 'terraza', 'vip'];

  function isValidSchema(mesas) {
    return Array.isArray(mesas) && mesas.length > 0 &&
      mesas.some(function (m) { return VALID_SALAS.indexOf(m.sala) !== -1; });
  }

  function hydrate() {
    var mesas = load();
    if (!isValidSchema(mesas)) {
      console.info('[StoreMesas] Datos incompatibles o vacíos — reconstruyendo seed.');
      mesas = buildSeed();
      save(mesas);
    }
    return mesas;
  }

  let _mesas = hydrate();

  // --------------------------------------------------------------------------
  // Helpers internos
  // --------------------------------------------------------------------------
  function findIdx(mesaId) {
    return _mesas.findIndex(function (m) { return m.id === mesaId; });
  }

  function recalcTotal(mesa) {
    mesa.total = mesa.items.reduce(function (acc, it) {
      return acc + (it.precio || 0) * (it.cantidad || 1);
    }, 0);
  }

  function emit(eventName, detail) {
    global.dispatchEvent(new CustomEvent(eventName, { detail: detail, bubbles: false }));
  }

  // --------------------------------------------------------------------------
  // API pública
  // --------------------------------------------------------------------------
  var StoreMesas = {};

  StoreMesas.listMesas = function (opts) {
    var sala = opts && opts.sala;
    if (sala) return _mesas.filter(function (m) { return m.sala === sala; });
    return _mesas.slice();
  };

  StoreMesas.getMesa = function (mesaId) {
    return _mesas.find(function (m) { return m.id === mesaId; });
  };

  StoreMesas.addItemsAMesa = function (mesaId, items, opts) {
    var idx = findIdx(mesaId);
    if (idx === -1) {
      console.warn('[StoreMesas] Mesa no encontrada:', mesaId);
      return;
    }
    var mesa = _mesas[idx];
    var origen   = (opts && opts.origen)   ? opts.origen   : 'manual';
    var ticketId = (opts && opts.ticketId) ? opts.ticketId : ('tk-' + Date.now());
    items.forEach(function (item) {
      // Buscar si ya existe el mismo SKU para sumar cantidad
      var existing = mesa.items.find(function (it) { return it.sku === item.sku; });
      if (existing) {
        existing.cantidad += item.cantidad || 1;
        existing.comanda = 'pendiente';
      } else {
        mesa.items.push({
          sku: item.sku,
          nombre: item.nombre,
          cantidad: item.cantidad || 1,
          precio: item.precio || 0,
          mods: item.mods || [],
          comanda: 'pendiente'
        });
      }
    });
    recalcTotal(mesa);
    mesa.ultimaComanda = new Date().toISOString();
    _mesas[idx] = mesa;
    save(_mesas);
    emit('comanda-creada', { mesaId: mesaId, items: items, origen: origen, ticketId: ticketId });
    emit('mesa-actualizada', { mesaId: mesaId });
  };

  StoreMesas.cambiarEstado = function (mesaId, nuevoEstado) {
    var idx = findIdx(mesaId);
    if (idx === -1) return;
    _mesas[idx].estado = nuevoEstado;
    save(_mesas);
    emit('mesa-actualizada', { mesaId: mesaId });
  };

  StoreMesas.cambiarMesero = function (mesaId, empId, empNombre) {
    var idx = findIdx(mesaId);
    if (idx === -1) return;
    _mesas[idx].meseroId = empId;
    _mesas[idx].meseroNombre = empNombre;
    save(_mesas);
    emit('mesa-actualizada', { mesaId: mesaId });
  };

  StoreMesas.liberar = function (mesaId) {
    var idx = findIdx(mesaId);
    if (idx === -1) return;
    var mesa = _mesas[idx];
    mesa.estado = 'libre';
    mesa.comensales = 0;
    mesa.meseroId = null;
    mesa.meseroNombre = null;
    mesa.abiertaEn = null;
    mesa.ultimaComanda = null;
    mesa.items = [];
    mesa.total = 0;
    _mesas[idx] = mesa;
    save(_mesas);
    emit('mesa-actualizada', { mesaId: mesaId });
  };

  StoreMesas._reset = function () {
    localStorage.removeItem(STORAGE_KEY);
    _mesas = hydrate();
    console.info('[StoreMesas] Store reseteado con seed inicial.');
  };

  global.StoreMesas = StoreMesas;
  console.info('[StoreMesas] Listo. ' + _mesas.length + ' mesas cargadas desde ' + STORAGE_KEY);

})(window);
