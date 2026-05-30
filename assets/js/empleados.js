/* ============================================================================
   empleados.js — Store unificado de empleados (Sprint 14)
   Fuente de verdad: root:employees:v1
   Deriva: root:users:v1 (acceso al sistema)
   Sincroniza: root:nomina:v1 (la sección "empleados" del store de nómina)
   ============================================================================ */
(function () {
  'use strict';

  var EMP_KEY = 'root:employees:v1';
  var USERS_KEY = 'root:users:v1';
  var NOM_KEY = 'root:nomina:v1';
  var SMMLV = 1623500;

  /* Catálogo de sucursales (mismas IDs que NominaMock para interoperar) */
  var SUCURSALES = [
    { id: 'suc-norte', nombre: 'Sede Norte' },
    { id: 'suc-sur',   nombre: 'Sede Sur' },
  ];

  var ROLES = ['admin', 'gerente', 'cajero', 'mesero', 'cocina'];

  /* ── Seed ───────────────────────────────────────────────────────────── */
  function seed() {
    return [
      { id:'emp-001', nombre:'Camila Velásquez', email:'camila@buen-sabor.co',    telefono:'+57 312 000 0001', documento:'1.234.567', fechaIngreso:'2023-03-15', rol:'mesero',  pin:'1234', sucursales:['suc-norte'],            estado:'activo', nomina:{ salarioBase:1623500, periodicidad:'quincenal', metodoPago:'transferencia', topesAdelanto:50, banco:'Bancolombia', numeroCuenta:'xxxx-1234' } },
      { id:'emp-002', nombre:'Andrés Martínez',  email:'andres@buen-sabor.co',    telefono:'+57 312 000 0002', documento:'2.345.678', fechaIngreso:'2022-07-01', rol:'mesero',  pin:'2345', sucursales:['suc-norte'],            estado:'activo', nomina:{ salarioBase:1800000, periodicidad:'mensual',   metodoPago:'nequi',         topesAdelanto:40, banco:'', numeroCuenta:'' } },
      { id:'emp-003', nombre:'Valentina Torres', email:'valentina@buen-sabor.co', telefono:'+57 312 000 0003', documento:'3.456.789', fechaIngreso:'2023-10-01', rol:'mesero',  pin:'3456', sucursales:['suc-sur'],              estado:'activo', nomina:{ salarioBase:1623500, periodicidad:'quincenal', metodoPago:'efectivo',      topesAdelanto:50, banco:'', numeroCuenta:'' } },
      { id:'emp-004', nombre:'Carlos Pedraza',   email:'carlos@buen-sabor.co',    telefono:'+57 312 000 0004', documento:'4.567.890', fechaIngreso:'2021-05-15', rol:'cajero',  pin:null,   sucursales:['suc-norte','suc-sur'],  estado:'activo', nomina:{ salarioBase:2200000, periodicidad:'mensual',   metodoPago:'transferencia', topesAdelanto:30, banco:'Davivienda', numeroCuenta:'xxxx-5678' } },
      { id:'emp-005', nombre:'Luisa Herrera',    email:'luisa@buen-sabor.co',     telefono:'+57 312 000 0005', documento:'5.678.901', fechaIngreso:'2023-01-10', rol:'cocina',  pin:'5678', sucursales:['suc-norte'],            estado:'activo', nomina:{ salarioBase:1700000, periodicidad:'quincenal', metodoPago:'transferencia', topesAdelanto:50, banco:'Nequi', numeroCuenta:'' } },
      { id:'emp-006', nombre:'Diego Suárez',     email:'diego@buen-sabor.co',     telefono:'+57 312 000 0006', documento:'6.789.012', fechaIngreso:'2022-09-20', rol:'cocina',  pin:'6789', sucursales:['suc-sur'],              estado:'activo', nomina:{ salarioBase:1750000, periodicidad:'mensual',   metodoPago:'efectivo',      topesAdelanto:45, banco:'', numeroCuenta:'' } },
      { id:'emp-007', nombre:'Mariana Ospina',   email:'mariana@buen-sabor.co',   telefono:'+57 312 000 0007', documento:'7.890.123', fechaIngreso:'2024-02-01', rol:'mesero',  pin:'7890', sucursales:['suc-sur'],              estado:'activo', nomina:{ salarioBase:1623500, periodicidad:'quincenal', metodoPago:'nequi',         topesAdelanto:50, banco:'', numeroCuenta:'' } },
      { id:'emp-008', nombre:'Sebastián Castro', email:'sebastian@buen-sabor.co', telefono:'+57 312 000 0008', documento:'8.901.234', fechaIngreso:'2020-11-03', rol:'gerente', pin:null,   sucursales:['suc-norte','suc-sur'],  estado:'activo', nomina:{ salarioBase:3500000, periodicidad:'mensual',   metodoPago:'transferencia', topesAdelanto:20, banco:'BBVA', numeroCuenta:'xxxx-9012' } },
    ].map(function (e) { e.creadoEn = '2024-01-10T10:00:00Z'; e.actualizadoEn = '2025-11-01T09:30:00Z'; return e; });
  }

  function save(arr) {
    localStorage.setItem(EMP_KEY, JSON.stringify(arr));
  }

  function tieneHistorial(id) {
    try {
      var raw = localStorage.getItem(NOM_KEY);
      if (!raw) return false;
      var st = JSON.parse(raw);
      var pagos = (st.pagos || []).some(function (p) { return p.empleado_id === id; });
      var adv   = (st.adelantos || []).some(function (a) { return a.empleado_id === id; });
      return pagos || adv;
    } catch (e) { return false; }
  }

  function adelantosPendientes(id) {
    try {
      var raw = localStorage.getItem(NOM_KEY);
      if (!raw) return [];
      var st = JSON.parse(raw);
      return (st.adelantos || []).filter(function (a) {
        return a.empleado_id === id && (a.estado === 'pendiente' || a.estado === 'aprobada');
      });
    } catch (e) { return []; }
  }

  /* ── API ─────────────────────────────────────────────────────────────── */
  var Empleados = {

    SMMLV: SMMLV,
    ROLES: ROLES,
    SUCURSALES: SUCURSALES,

    getAll: function () {
      var raw = localStorage.getItem(EMP_KEY);
      if (!raw) { save(seed()); Empleados._syncUsers(); Empleados._syncNomina(); raw = localStorage.getItem(EMP_KEY); }
      try { return JSON.parse(raw) || []; } catch (e) { return []; }
    },

    getById: function (id) {
      return Empleados.getAll().find(function (e) { return e.id === id; }) || null;
    },

    getActivos: function () {
      return Empleados.getAll().filter(function (e) { return e.estado === 'activo'; });
    },

    getInactivos: function () {
      return Empleados.getAll().filter(function (e) { return e.estado === 'inactivo'; });
    },

    sucursalNombre: function (id) {
      var s = SUCURSALES.find(function (x) { return x.id === id; });
      return s ? s.nombre : id;
    },

    crear: function (datos) {
      var lista = Empleados.getAll();
      if (datos.email && lista.some(function (e) { return e.email.toLowerCase() === datos.email.toLowerCase(); })) {
        throw new Error('Ya existe un empleado con ese email');
      }
      if (!datos.nomina || datos.nomina.salarioBase < SMMLV) {
        throw new Error('El salario mínimo es $' + SMMLV.toLocaleString('es-CO'));
      }
      var nuevo = Object.assign({
        id: 'emp-' + Date.now(),
        estado: 'activo',
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      }, datos);
      lista.push(nuevo);
      save(lista);
      Empleados._syncUsers();
      Empleados._syncNomina();
      return nuevo;
    },

    actualizar: function (id, cambios) {
      var lista = Empleados.getAll();
      var idx = lista.findIndex(function (e) { return e.id === id; });
      if (idx === -1) throw new Error('Empleado no encontrado');
      if (cambios.email && lista.some(function (e, i) { return i !== idx && e.email.toLowerCase() === cambios.email.toLowerCase(); })) {
        throw new Error('Ya existe un empleado con ese email');
      }
      if (cambios.nomina && cambios.nomina.salarioBase != null && cambios.nomina.salarioBase < SMMLV) {
        throw new Error('El salario mínimo es $' + SMMLV.toLocaleString('es-CO'));
      }
      var merged = Object.assign({}, lista[idx], cambios, {
        nomina: Object.assign({}, lista[idx].nomina, cambios.nomina || {}),
        actualizadoEn: new Date().toISOString(),
      });
      lista[idx] = merged;
      save(lista);
      Empleados._syncUsers();
      Empleados._syncNomina();
      return merged;
    },

    desactivar: function (id) {
      return Empleados.actualizar(id, { estado: 'inactivo' });
    },

    activar: function (id) {
      return Empleados.actualizar(id, { estado: 'activo' });
    },

    puedeEliminar: function (id) {
      return !tieneHistorial(id);
    },

    eliminarPermanente: function (id) {
      if (tieneHistorial(id)) {
        throw new Error('Este empleado tiene historial de pagos. Usa "Desactivar" en su lugar.');
      }
      var lista = Empleados.getAll().filter(function (e) { return e.id !== id; });
      save(lista);
      Empleados._syncUsers();
      Empleados._syncNomina();
    },

    adelantosPendientes: adelantosPendientes,

    /* ── Sincronización con root:users:v1 ───────────────────────────── */
    _syncUsers: function () {
      var users = Empleados.getAll().map(function (e, i) {
        return {
          userId: 'usr-' + String(i + 1).padStart(3, '0'),
          empleadoId: e.id,
          nombre: e.nombre,
          email: e.email,
          rol: e.rol,
          pin: e.pin || null,
          sucursales: e.sucursales || [],
          estado: e.estado,
        };
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    /* ── Sincronización con root:nomina:v1 ──────────────────────────── */
    _syncNomina: function () {
      var raw = localStorage.getItem(NOM_KEY);
      var state;
      try { state = raw ? JSON.parse(raw) : null; } catch (e) { state = null; }
      if (!state) return; /* nomina-mock todavía no se inicializó; se sincroniza al primer load */
      state.empleados = Empleados.getActivos().map(Empleados.toNomina);
      localStorage.setItem(NOM_KEY, JSON.stringify(state));
    },

    /* Convierte formato unificado → formato esperado por NominaMock */
    toNomina: function (e) {
      return {
        id: e.id,
        nombre: e.nombre,
        rol: e.rol,
        sucursal_id: (e.sucursales && e.sucursales[0]) || 'suc-norte',
        salario_base: e.nomina.salarioBase,
        periodicidad: e.nomina.periodicidad,
        tope_adelanto_pct: e.nomina.topesAdelanto,
        fecha_ingreso: e.fechaIngreso,
      };
    },

    /* Fuerza un sync (se llama desde nomina.html después de que nomina-mock cargó) */
    forceSyncNomina: function () {
      Empleados._syncNomina();
    },

    /* ── Utilidades ─────────────────────────────────────────────────── */
    iniciales: function (nombre) {
      return (nombre || '?').split(' ').filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
    },

    avatarColor: function (id) {
      var palette = [
        { bg: '#FCA5A5', fg: '#7F1D1D' }, { bg: '#FDE68A', fg: '#78350F' },
        { bg: '#86EFAC', fg: '#14532D' }, { bg: '#93C5FD', fg: '#1E3A8A' },
        { bg: '#DDD6FE', fg: '#4C1D95' }, { bg: '#FBCFE8', fg: '#9D174D' },
        { bg: '#A5F3FC', fg: '#155E75' }, { bg: '#FED7AA', fg: '#7C2D12' },
      ];
      var hash = 0;
      for (var i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % palette.length;
      return palette[hash];
    },

    /* Reset: vuelve al seed inicial (útil en dev) */
    reset: function () {
      localStorage.removeItem(EMP_KEY);
      localStorage.removeItem(USERS_KEY);
      Empleados.getAll();
    },
  };

  window.Empleados = Empleados;

  /* Inicialización inmediata: si todavía no existe seed, créalo */
  Empleados.getAll();
})();
