/* ============================================================================
   nomina-mock.js — Datos mock y helpers para el módulo de Nómina / Adelantos
   Sprint 13 · localStorage key: root:nomina:v1
   ============================================================================ */

(function () {
  var LS_KEY = 'root:nomina:v1';

  /* ── Datos base (solo para sembrar la primera vez) ────────────────────── */

  var SUCURSALES_BASE = [
    { id: 'suc-norte', nombre: 'Sede Norte', ciudad: 'Bogotá' },
    { id: 'suc-sur',   nombre: 'Sede Sur',   ciudad: 'Bogotá' },
  ];

  var EMPLEADOS_BASE = [
    { id: 'emp-001', nombre: 'Camila Rojas',      rol: 'mesero', sucursal_id: 'suc-norte', salario_base: 1_623_500, periodicidad: 'quincenal', tope_adelanto_pct: 50, fecha_ingreso: '2024-03-15' },
    { id: 'emp-002', nombre: 'Andrés Martínez',   rol: 'mesero', sucursal_id: 'suc-norte', salario_base: 1_800_000, periodicidad: 'quincenal', tope_adelanto_pct: 40, fecha_ingreso: '2023-11-01' },
    { id: 'emp-003', nombre: 'Valentina Torres',  rol: 'mesero', sucursal_id: 'suc-norte', salario_base: 1_623_500, periodicidad: 'mensual',   tope_adelanto_pct: 50, fecha_ingreso: '2025-01-10' },
    { id: 'emp-004', nombre: 'Carlos Pedraza',    rol: 'mesero', sucursal_id: 'suc-sur',   salario_base: 1_700_000, periodicidad: 'quincenal', tope_adelanto_pct: 50, fecha_ingreso: '2024-07-20' },
    { id: 'emp-005', nombre: 'Luisa Herrera',     rol: 'mesero', sucursal_id: 'suc-sur',   salario_base: 1_623_500, periodicidad: 'mensual',   tope_adelanto_pct: 30, fecha_ingreso: '2024-02-01' },
    { id: 'emp-006', nombre: 'Diego Suárez',      rol: 'mesero', sucursal_id: 'suc-norte', salario_base: 1_623_500, periodicidad: 'quincenal', tope_adelanto_pct: 50, fecha_ingreso: '2025-03-05' },
    { id: 'emp-007', nombre: 'Mariana Ospina',    rol: 'mesero', sucursal_id: 'suc-sur',   salario_base: 1_623_500, periodicidad: 'quincenal', tope_adelanto_pct: 50, fecha_ingreso: '2023-08-15' },
    { id: 'emp-008', nombre: 'Sebastián Castro',  rol: 'mesero', sucursal_id: 'suc-norte', salario_base: 1_900_000, periodicidad: 'mensual',   tope_adelanto_pct: 60, fecha_ingreso: '2023-06-01' },
  ];

  var PERIODOS_BASE = [
    // Quincenales
    { id: 'per-2026-05-q2', tipo: 'quincenal', inicio: '2026-05-16', fin: '2026-05-31', estado: 'en_curso' },
    { id: 'per-2026-05-q1', tipo: 'quincenal', inicio: '2026-05-01', fin: '2026-05-15', estado: 'pagado' },
    { id: 'per-2026-04-q2', tipo: 'quincenal', inicio: '2026-04-16', fin: '2026-04-30', estado: 'pagado' },
    { id: 'per-2026-04-q1', tipo: 'quincenal', inicio: '2026-04-01', fin: '2026-04-15', estado: 'pagado' },
    { id: 'per-2026-03-q2', tipo: 'quincenal', inicio: '2026-03-16', fin: '2026-03-31', estado: 'pagado' },
    { id: 'per-2026-03-q1', tipo: 'quincenal', inicio: '2026-03-01', fin: '2026-03-15', estado: 'pagado' },
    // Mensuales
    { id: 'per-2026-05-m',  tipo: 'mensual',   inicio: '2026-05-01', fin: '2026-05-31', estado: 'en_curso' },
    { id: 'per-2026-04-m',  tipo: 'mensual',   inicio: '2026-04-01', fin: '2026-04-30', estado: 'pagado' },
    { id: 'per-2026-03-m',  tipo: 'mensual',   inicio: '2026-03-01', fin: '2026-03-31', estado: 'pagado' },
  ];

  var ADELANTOS_BASE = [
    // emp-001 Camila
    { id: 'adv-001', empleado_id: 'emp-001', periodo_id: 'per-2026-05-q2', sucursal_id: 'suc-norte', monto_solicitado: 300_000, monto_aprobado: null,    motivo: 'Imprevisto médico', estado: 'pendiente',   fecha_solicitud: '2026-05-16T14:30:00Z', nota_admin: null,
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-05-16T14:20:00Z', actor: 'emp-001' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-05-16T14:30:00Z', actor: 'emp-001' },
      ]
    },
    { id: 'adv-002', empleado_id: 'emp-001', periodo_id: 'per-2026-04-q2', sucursal_id: 'suc-norte', monto_solicitado: 200_000, monto_aprobado: 200_000, motivo: 'Arriendo',         estado: 'descontada',  fecha_solicitud: '2026-04-20T10:00:00Z', nota_admin: 'Aprobado',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-20T09:50:00Z', actor: 'emp-001' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-20T10:00:00Z', actor: 'emp-001' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-21T08:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-04-21T15:00:00Z', actor: 'admin-001' },
        { de: 'pagada',    a: 'descontada',fecha: '2026-05-01T08:00:00Z', actor: 'admin-001' },
      ]
    },
    { id: 'adv-010', empleado_id: 'emp-001', periodo_id: 'per-2026-03-q2', sucursal_id: 'suc-norte', monto_solicitado: 150_000, monto_aprobado: 150_000, motivo: 'Gastos escolares', estado: 'descontada',  fecha_solicitud: '2026-03-17T11:00:00Z', nota_admin: null,
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-03-17T10:50:00Z', actor: 'emp-001' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-03-17T11:00:00Z', actor: 'emp-001' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-03-18T09:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-03-18T14:00:00Z', actor: 'admin-001' },
        { de: 'pagada',    a: 'descontada',fecha: '2026-04-01T08:00:00Z', actor: 'admin-001' },
      ]
    },
    // emp-002 Andrés
    { id: 'adv-003', empleado_id: 'emp-002', periodo_id: 'per-2026-05-q2', sucursal_id: 'suc-norte', monto_solicitado: 400_000, monto_aprobado: 400_000, motivo: 'Reparación vehículo', estado: 'aprobada',  fecha_solicitud: '2026-05-16T09:00:00Z', nota_admin: 'Aprobado sin novedad',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-05-16T08:50:00Z', actor: 'emp-002' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-05-16T09:00:00Z', actor: 'emp-002' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-05-17T08:30:00Z', actor: 'admin-001' },
      ]
    },
    { id: 'adv-011', empleado_id: 'emp-002', periodo_id: 'per-2026-04-q1', sucursal_id: 'suc-norte', monto_solicitado: 300_000, monto_aprobado: 300_000, motivo: 'Electrodoméstico', estado: 'descontada', fecha_solicitud: '2026-04-05T10:00:00Z', nota_admin: null,
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-05T09:50:00Z', actor: 'emp-002' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-05T10:00:00Z', actor: 'emp-002' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-06T08:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-04-06T16:00:00Z', actor: 'admin-001' },
        { de: 'pagada',    a: 'descontada',fecha: '2026-04-16T08:00:00Z', actor: 'admin-001' },
      ]
    },
    // emp-003 Valentina
    { id: 'adv-005', empleado_id: 'emp-003', periodo_id: 'per-2026-04-m',  sucursal_id: 'suc-norte', monto_solicitado: 350_000, monto_aprobado: 350_000, motivo: 'Urgencia familiar',  estado: 'pagada',     fecha_solicitud: '2026-04-15T13:00:00Z', nota_admin: 'Autorizado por gerencia',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-15T12:50:00Z', actor: 'emp-003' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-15T13:00:00Z', actor: 'emp-003' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-16T09:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-04-16T17:00:00Z', actor: 'admin-001' },
      ]
    },
    { id: 'adv-013', empleado_id: 'emp-003', periodo_id: 'per-2026-05-m',  sucursal_id: 'suc-norte', monto_solicitado: 250_000, monto_aprobado: null, motivo: 'Medicamentos', estado: 'pendiente', fecha_solicitud: '2026-05-12T10:00:00Z', nota_admin: null,
      transiciones: [
        { de: null,       a: 'borrador',  fecha: '2026-05-12T09:50:00Z', actor: 'emp-003' },
        { de: 'borrador', a: 'pendiente', fecha: '2026-05-12T10:00:00Z', actor: 'emp-003' },
      ]
    },
    // emp-004 Carlos
    { id: 'adv-004', empleado_id: 'emp-004', periodo_id: 'per-2026-05-q1', sucursal_id: 'suc-sur',   monto_solicitado: 250_000, monto_aprobado: null,    motivo: null,               estado: 'rechazada',  fecha_solicitud: '2026-05-05T16:00:00Z', nota_admin: 'Tope de adelantos del periodo alcanzado',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-05-05T15:50:00Z', actor: 'emp-004' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-05-05T16:00:00Z', actor: 'emp-004' },
        { de: 'pendiente', a: 'rechazada', fecha: '2026-05-06T09:00:00Z', actor: 'admin-001', nota: 'Tope de adelantos del periodo alcanzado' },
      ]
    },
    { id: 'adv-012', empleado_id: 'emp-004', periodo_id: 'per-2026-04-q2', sucursal_id: 'suc-sur',   monto_solicitado: 200_000, monto_aprobado: 200_000, motivo: 'Pasajes', estado: 'descontada', fecha_solicitud: '2026-04-18T11:00:00Z', nota_admin: null,
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-18T10:50:00Z', actor: 'emp-004' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-18T11:00:00Z', actor: 'emp-004' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-19T08:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-04-19T15:00:00Z', actor: 'admin-001' },
        { de: 'pagada',    a: 'descontada',fecha: '2026-05-01T08:00:00Z', actor: 'admin-001' },
      ]
    },
    // emp-005 Luisa
    { id: 'adv-006', empleado_id: 'emp-005', periodo_id: 'per-2026-05-m',  sucursal_id: 'suc-sur',   monto_solicitado: 180_000, monto_aprobado: null,    motivo: 'Pago deuda',       estado: 'pendiente',  fecha_solicitud: '2026-05-14T09:30:00Z', nota_admin: null,
      transiciones: [
        { de: null,       a: 'borrador',  fecha: '2026-05-14T09:20:00Z', actor: 'emp-005' },
        { de: 'borrador', a: 'pendiente', fecha: '2026-05-14T09:30:00Z', actor: 'emp-005' },
      ]
    },
    { id: 'adv-014', empleado_id: 'emp-005', periodo_id: 'per-2026-04-m',  sucursal_id: 'suc-sur',   monto_solicitado: 200_000, monto_aprobado: 200_000, motivo: 'Útiles escolares', estado: 'aprobada',  fecha_solicitud: '2026-04-10T14:00:00Z', nota_admin: 'OK',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-10T13:50:00Z', actor: 'emp-005' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-10T14:00:00Z', actor: 'emp-005' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-11T08:30:00Z', actor: 'admin-001' },
      ]
    },
    // emp-006 Diego
    { id: 'adv-007', empleado_id: 'emp-006', periodo_id: 'per-2026-05-q2', sucursal_id: 'suc-norte', monto_solicitado: 100_000, monto_aprobado: null,    motivo: null,               estado: 'borrador',   fecha_solicitud: '2026-05-17T08:00:00Z', nota_admin: null,
      transiciones: [
        { de: null, a: 'borrador', fecha: '2026-05-17T08:00:00Z', actor: 'emp-006' },
      ]
    },
    { id: 'adv-015', empleado_id: 'emp-006', periodo_id: 'per-2026-04-q1', sucursal_id: 'suc-norte', monto_solicitado: 150_000, monto_aprobado: null, motivo: 'Compra de ropa', estado: 'rechazada', fecha_solicitud: '2026-04-03T11:00:00Z', nota_admin: 'No cumple criterios del periodo',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-03T10:50:00Z', actor: 'emp-006' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-03T11:00:00Z', actor: 'emp-006' },
        { de: 'pendiente', a: 'rechazada', fecha: '2026-04-04T08:00:00Z', actor: 'admin-001', nota: 'No cumple criterios del periodo' },
      ]
    },
    // emp-007 Mariana
    { id: 'adv-008', empleado_id: 'emp-007', periodo_id: 'per-2026-05-q1', sucursal_id: 'suc-sur',   monto_solicitado: 250_000, monto_aprobado: 250_000, motivo: 'Visita médica',    estado: 'pagada',     fecha_solicitud: '2026-05-03T10:00:00Z', nota_admin: null,
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-05-03T09:50:00Z', actor: 'emp-007' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-05-03T10:00:00Z', actor: 'emp-007' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-05-04T08:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-05-04T16:00:00Z', actor: 'admin-001' },
      ]
    },
    // emp-008 Sebastián
    { id: 'adv-009', empleado_id: 'emp-008', periodo_id: 'per-2026-04-m',  sucursal_id: 'suc-norte', monto_solicitado: 500_000, monto_aprobado: 500_000, motivo: 'Compra muebles',   estado: 'descontada', fecha_solicitud: '2026-04-08T09:00:00Z', nota_admin: 'Autorizado gerente',
      transiciones: [
        { de: null,        a: 'borrador',  fecha: '2026-04-08T08:50:00Z', actor: 'emp-008' },
        { de: 'borrador',  a: 'pendiente', fecha: '2026-04-08T09:00:00Z', actor: 'emp-008' },
        { de: 'pendiente', a: 'aprobada',  fecha: '2026-04-09T08:00:00Z', actor: 'admin-001' },
        { de: 'aprobada',  a: 'pagada',    fecha: '2026-04-09T16:00:00Z', actor: 'admin-001' },
        { de: 'pagada',    a: 'descontada',fecha: '2026-05-01T08:00:00Z', actor: 'admin-001' },
      ]
    },
  ];

  var PAGOS_BASE = [
    // emp-001 Camila (quincenal) — 6 pagos
    { id: 'pay-001', empleado_id: 'emp-001', sucursal_id: 'suc-norte', periodo_id: 'per-2026-05-q1', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-05-15', metodo: 'transferencia' },
    { id: 'pay-002', empleado_id: 'emp-001', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-q2', bruto: 811_750, adelantos_descontados: 200_000, neto: 611_750, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-003', empleado_id: 'emp-001', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-q1', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-04-15', metodo: 'transferencia' },
    { id: 'pay-004', empleado_id: 'emp-001', sucursal_id: 'suc-norte', periodo_id: 'per-2026-03-q2', bruto: 811_750, adelantos_descontados: 150_000, neto: 661_750, fecha_pago: '2026-03-31', metodo: 'transferencia' },
    { id: 'pay-005', empleado_id: 'emp-001', sucursal_id: 'suc-norte', periodo_id: 'per-2026-03-q1', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-03-15', metodo: 'transferencia' },
    // emp-002 Andrés (quincenal)
    { id: 'pay-006', empleado_id: 'emp-002', sucursal_id: 'suc-norte', periodo_id: 'per-2026-05-q1', bruto: 900_000, adelantos_descontados: 0,       neto: 900_000, fecha_pago: '2026-05-15', metodo: 'transferencia' },
    { id: 'pay-007', empleado_id: 'emp-002', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-q2', bruto: 900_000, adelantos_descontados: 0,       neto: 900_000, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-008', empleado_id: 'emp-002', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-q1', bruto: 900_000, adelantos_descontados: 300_000, neto: 600_000, fecha_pago: '2026-04-15', metodo: 'transferencia' },
    // emp-003 Valentina (mensual)
    { id: 'pay-009', empleado_id: 'emp-003', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-m',  bruto: 1_623_500, adelantos_descontados: 350_000, neto: 1_273_500, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-010', empleado_id: 'emp-003', sucursal_id: 'suc-norte', periodo_id: 'per-2026-03-m',  bruto: 1_623_500, adelantos_descontados: 0,       neto: 1_623_500, fecha_pago: '2026-03-31', metodo: 'transferencia' },
    // emp-004 Carlos (quincenal)
    { id: 'pay-011', empleado_id: 'emp-004', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-05-q1', bruto: 850_000, adelantos_descontados: 0,       neto: 850_000, fecha_pago: '2026-05-15', metodo: 'transferencia' },
    { id: 'pay-012', empleado_id: 'emp-004', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-04-q2', bruto: 850_000, adelantos_descontados: 200_000, neto: 650_000, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-013', empleado_id: 'emp-004', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-04-q1', bruto: 850_000, adelantos_descontados: 0,       neto: 850_000, fecha_pago: '2026-04-15', metodo: 'transferencia' },
    // emp-005 Luisa (mensual)
    { id: 'pay-014', empleado_id: 'emp-005', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-04-m',  bruto: 1_623_500, adelantos_descontados: 0,       neto: 1_623_500, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-015', empleado_id: 'emp-005', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-03-m',  bruto: 1_623_500, adelantos_descontados: 0,       neto: 1_623_500, fecha_pago: '2026-03-31', metodo: 'transferencia' },
    // emp-007 Mariana (quincenal)
    { id: 'pay-016', empleado_id: 'emp-007', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-04-q2', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-017', empleado_id: 'emp-007', sucursal_id: 'suc-sur',   periodo_id: 'per-2026-04-q1', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-04-15', metodo: 'transferencia' },
    // emp-008 Sebastián (mensual)
    { id: 'pay-018', empleado_id: 'emp-008', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-m',  bruto: 1_900_000, adelantos_descontados: 500_000, neto: 1_400_000, fecha_pago: '2026-04-30', metodo: 'transferencia' },
    { id: 'pay-019', empleado_id: 'emp-008', sucursal_id: 'suc-norte', periodo_id: 'per-2026-03-m',  bruto: 1_900_000, adelantos_descontados: 0,       neto: 1_900_000, fecha_pago: '2026-03-31', metodo: 'transferencia' },
    // emp-006 Diego (quincenal)
    { id: 'pay-020', empleado_id: 'emp-006', sucursal_id: 'suc-norte', periodo_id: 'per-2026-04-q2', bruto: 811_750, adelantos_descontados: 0,       neto: 811_750, fecha_pago: '2026-04-30', metodo: 'transferencia' },
  ];

  /* ── localStorage ─────────────────────────────────────────────────────── */

  function loadState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      empleados: JSON.parse(JSON.stringify(EMPLEADOS_BASE)),
      adelantos:  JSON.parse(JSON.stringify(ADELANTOS_BASE)),
      pagos:      JSON.parse(JSON.stringify(PAGOS_BASE)),
      periodos:   JSON.parse(JSON.stringify(PERIODOS_BASE)),
      sucursales: JSON.parse(JSON.stringify(SUCURSALES_BASE)),
    };
  }

  function saveState(state) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function calcularDevengado(empleado, periodo) {
    var inicio = new Date(periodo.inicio);
    var fin    = new Date(periodo.fin);
    var hoy    = new Date();
    var msDay  = 86400000;
    var diasPeriodo  = Math.round((fin - inicio) / msDay) + 1;
    var diasTrabajados;
    if (periodo.estado === 'en_curso') {
      diasTrabajados = Math.min(Math.round((hoy - inicio) / msDay) + 1, diasPeriodo);
    } else {
      diasTrabajados = diasPeriodo;
    }
    return Math.round((empleado.salario_base / diasPeriodo) * diasTrabajados);
  }

  function montoMaximoAdelanto(empleado, periodo, adelantosPrevios) {
    adelantosPrevios = adelantosPrevios || [];
    var devengado = calcularDevengado(empleado, periodo);
    var tope = Math.round(devengado * (empleado.tope_adelanto_pct / 100));
    var yaUsado = adelantosPrevios
      .filter(function (a) {
        return a.empleado_id === empleado.id &&
               a.periodo_id  === periodo.id  &&
               a.estado !== 'rechazada'      &&
               a.estado !== 'borrador';
      })
      .reduce(function (sum, a) { return sum + (a.monto_aprobado || a.monto_solicitado); }, 0);
    return Math.max(0, tope - yaUsado);
  }

  function diasHastaProximoPago(empleado) {
    var hoy  = new Date();
    var dia  = hoy.getDate();
    var mes  = hoy.getMonth();
    var anio = hoy.getFullYear();
    var proxima;
    if (empleado.periodicidad === 'quincenal') {
      proxima = dia <= 15
        ? new Date(anio, mes, 15)
        : new Date(anio, mes + 1, 0);
    } else {
      proxima = new Date(anio, mes + 1, 0);
    }
    hoy.setHours(0, 0, 0, 0);
    proxima.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((proxima - hoy) / 86400000));
  }

  function fechaProximoPago(empleado) {
    var hoy  = new Date();
    var dia  = hoy.getDate();
    var mes  = hoy.getMonth();
    var anio = hoy.getFullYear();
    var proxima;
    if (empleado.periodicidad === 'quincenal') {
      proxima = dia <= 15
        ? new Date(anio, mes, 15)
        : new Date(anio, mes + 1, 0);
    } else {
      proxima = new Date(anio, mes + 1, 0);
    }
    return proxima;
  }

  function periodoCurrent(empleado, periodos) {
    var tipo = empleado.periodicidad === 'quincenal' ? 'quincenal' : 'mensual';
    return periodos.find(function (p) { return p.tipo === tipo && p.estado === 'en_curso'; }) || null;
  }

  function transicionarAdelanto(adelantoId, nuevoEstado, actorId, nota) {
    var state = loadState();
    var adv = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv) return null;
    adv.transiciones.push({
      de: adv.estado,
      a: nuevoEstado,
      fecha: new Date().toISOString(),
      actor: actorId || 'admin-001',
      nota: nota || null,
    });
    adv.estado = nuevoEstado;
    if (nota) adv.nota_admin = nota;
    saveState(state);
    return adv;
  }

  function aprobarAdelanto(adelantoId, montoAprobado, nota) {
    var state = loadState();
    var adv = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv) return null;
    adv.monto_aprobado = montoAprobado;
    adv.transiciones.push({ de: adv.estado, a: 'aprobada', fecha: new Date().toISOString(), actor: 'admin-001', nota: nota || null });
    adv.estado = 'aprobada';
    if (nota) adv.nota_admin = nota;
    saveState(state);
    return adv;
  }

  function rechazarAdelanto(adelantoId, motivo) {
    var state = loadState();
    var adv = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv) return null;
    adv.transiciones.push({ de: adv.estado, a: 'rechazada', fecha: new Date().toISOString(), actor: 'admin-001', nota: motivo || null });
    adv.estado = 'rechazada';
    adv.nota_admin = motivo || null;
    saveState(state);
    return adv;
  }

  function marcarPagada(adelantoId) {
    var state = loadState();
    var adv = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv || adv.estado !== 'aprobada') return null;
    adv.transiciones.push({ de: 'aprobada', a: 'pagada', fecha: new Date().toISOString(), actor: 'admin-001' });
    adv.estado = 'pagada';
    // Crear registro en pagos
    var emp = state.empleados.find(function (e) { return e.id === adv.empleado_id; });
    var pago = {
      id: 'pay-adv-' + adelantoId,
      empleado_id: adv.empleado_id,
      sucursal_id: adv.sucursal_id,
      periodo_id: adv.periodo_id,
      bruto: adv.monto_aprobado,
      adelantos_descontados: 0,
      neto: adv.monto_aprobado,
      fecha_pago: new Date().toISOString().slice(0, 10),
      metodo: 'adelanto',
    };
    state.pagos.push(pago);
    saveState(state);
    return adv;
  }

  function marcarDescontada(adelantoId) {
    var state = loadState();
    var adv = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv || adv.estado !== 'pagada') return null;
    adv.transiciones.push({ de: 'pagada', a: 'descontada', fecha: new Date().toISOString(), actor: 'admin-001' });
    adv.estado = 'descontada';
    saveState(state);
    return adv;
  }

  function guardarEmpleado(empleadoId, cambios) {
    var state = loadState();
    var emp = state.empleados.find(function (e) { return e.id === empleadoId; });
    if (!emp) return null;
    Object.assign(emp, cambios);
    saveState(state);
    return emp;
  }

  function resetState() {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
  }

  /* ── Inicializar si vacío ─────────────────────────────────────────────── */
  var _initialState = loadState();
  saveState(_initialState);

  /* ── Exportar al window ───────────────────────────────────────────────── */
  window.NominaMock = {
    // Datos (acceso vía loadState para tener estado más reciente)
    sucursales: SUCURSALES_BASE,
    loadState:  loadState,
    saveState:  saveState,
    resetState: resetState,
    // Helpers
    calcularDevengado:    calcularDevengado,
    montoMaximoAdelanto:  montoMaximoAdelanto,
    diasHastaProximoPago: diasHastaProximoPago,
    fechaProximoPago:     fechaProximoPago,
    periodoCurrent:       periodoCurrent,
    // Acciones
    transicionarAdelanto: transicionarAdelanto,
    aprobarAdelanto:      aprobarAdelanto,
    rechazarAdelanto:     rechazarAdelanto,
    marcarPagada:         marcarPagada,
    marcarDescontada:     marcarDescontada,
    guardarEmpleado:      guardarEmpleado,
    // ID del mesero logueado (mock fijo)
    MESERO_ACTUAL_ID: 'emp-001',
    // Labels de estado
    ESTADO_LABELS: {
      borrador:   'Borrador',
      pendiente:  'Pendiente',
      aprobada:   'Aprobada',
      rechazada:  'Rechazada',
      pagada:     'Pagada',
      descontada: 'Descontada',
    },
    ESTADO_COLORS: {
      borrador:   'var(--muted)',
      pendiente:  'var(--warning)',
      aprobada:   'var(--info)',
      rechazada:  'var(--error)',
      pagada:     'var(--success)',
      descontada: 'var(--muted)',
    },
  };
})();
