/* ============================================================================
   comprobante.js — Generador de comprobante PDF para adelantos salariales
   Requiere: jsPDF (cargado desde CDN), NominaMock, formatCOP
   Sprint 13
   ============================================================================ */

(function () {
  var JSPDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

  function loadJsPDF(cb) {
    if (window.jspdf && window.jspdf.jsPDF) { cb(window.jspdf.jsPDF); return; }
    if (window.jsPDF) { cb(window.jsPDF); return; }
    var script = document.createElement('script');
    script.src = JSPDF_CDN;
    script.onload = function () {
      if (window.jspdf && window.jspdf.jsPDF) cb(window.jspdf.jsPDF);
      else if (window.jsPDF) cb(window.jsPDF);
      else console.error('jsPDF no cargó correctamente');
    };
    script.onerror = function () { console.error('Error cargando jsPDF'); };
    document.head.appendChild(script);
  }

  function generarComprobante(adelantoId) {
    if (!window.NominaMock) { console.error('NominaMock no disponible'); return; }
    var NM    = window.NominaMock;
    var state = NM.loadState();
    var adv   = state.adelantos.find(function (a) { return a.id === adelantoId; });
    if (!adv) { console.error('Adelanto no encontrado:', adelantoId); return; }

    var emp = state.empleados.find(function (e) { return e.id === adv.empleado_id; }) || {};
    var per = state.periodos.find(function (p) { return p.id === adv.periodo_id; });
    var suc = state.sucursales.find(function (s) { return s.id === adv.sucursal_id; }) || {};

    var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    function fmtDate(str) {
      if (!str) return '—';
      var d = new Date(str.length === 10 ? str + 'T12:00:00' : str);
      return d.getDate() + ' de ' + ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][d.getMonth()] + ' de ' + d.getFullYear();
    }

    var compNum = 'COMP-' + adelantoId.toUpperCase();

    loadJsPDF(function (JsPDF) {
      var doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      var W = 210, margin = 20;

      // ── Header ──────────────────────────────────────────────────────────
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, W, 32, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('ROOT', margin, 16);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Gestión de Restaurantes', margin, 22);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('El Buen Sabor · ' + (suc.nombre || adv.sucursal_id), W - margin, 16, { align: 'right' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('NIT: 900.123.456-7', W - margin, 22, { align: 'right' });

      // ── Título ──────────────────────────────────────────────────────────
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPROBANTE DE ADELANTO SALARIAL', W / 2, 46, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('N.° ' + compNum, W / 2, 53, { align: 'center' });

      // ── Separador ───────────────────────────────────────────────────────
      doc.setDrawColor(220);
      doc.line(margin, 58, W - margin, 58);

      // ── Datos del empleado ───────────────────────────────────────────────
      var y = 68;
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Datos del Empleado', margin, y);

      var rows1 = [
        ['Nombre', emp.nombre || '—'],
        ['Cargo', 'Mesero'],
        ['Sucursal', suc.nombre || adv.sucursal_id],
        ['Periodicidad', emp.periodicidad === 'quincenal' ? 'Quincenal' : 'Mensual'],
        ['Salario base', window.formatCOP ? window.formatCOP(emp.salario_base) : '$' + emp.salario_base],
      ];

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      rows1.forEach(function (row) {
        doc.setTextColor(100);
        doc.text(row[0] + ':', margin + 2, y);
        doc.setTextColor(20);
        doc.text(row[1], margin + 50, y);
        y += 7;
      });

      // ── Datos del adelanto ───────────────────────────────────────────────
      y += 4;
      doc.setDrawColor(220);
      doc.line(margin, y, W - margin, y);
      y += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20);
      doc.text('Detalle del Adelanto', margin, y);

      var montoAprobado = adv.monto_aprobado != null ? adv.monto_aprobado : adv.monto_solicitado;
      var rows2 = [
        ['Monto aprobado', window.formatCOP ? window.formatCOP(montoAprobado) : '$' + montoAprobado],
        ['Motivo', adv.motivo || 'Sin especificar'],
        ['Fecha solicitud', fmtDate(adv.fecha_solicitud)],
        ['Periodo', per ? per.inicio + ' al ' + per.fin : '—'],
        ['Estado', NM.ESTADO_LABELS[adv.estado] || adv.estado],
        ['Método', 'Transferencia bancaria'],
      ];

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      rows2.forEach(function (row) {
        doc.setTextColor(100);
        doc.text(row[0] + ':', margin + 2, y);
        doc.setTextColor(20);
        doc.text(row[1], margin + 50, y);
        y += 7;
      });

      // ── Monto destacado ─────────────────────────────────────────────────
      y += 6;
      doc.setFillColor(240, 238, 255);
      doc.roundedRect(margin, y, W - margin * 2, 18, 3, 3, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80);
      doc.text('Valor neto entregado:', margin + 6, y + 7);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.text(window.formatCOP ? window.formatCOP(montoAprobado) : '$' + montoAprobado, W - margin - 6, y + 10, { align: 'right' });

      // ── Firma mock ───────────────────────────────────────────────────────
      y += 30;
      doc.setDrawColor(180);
      doc.line(margin, y, margin + 60, y);
      doc.line(W - margin - 60, y, W - margin, y);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('Empleado', margin + 18, y + 5);
      doc.text('Juan Camilo R.', W - margin - 42, y + 5);
      doc.text('Administrador', W - margin - 40, y + 10);

      // ── Footer ───────────────────────────────────────────────────────────
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Este comprobante fue generado el ' + fmtDate(new Date().toISOString()) + ' por ROOT v1.0.0', W / 2, 280, { align: 'center' });
      doc.text('Documento de carácter informativo. No tiene validez tributaria.', W / 2, 285, { align: 'center' });

      doc.save('comprobante-' + adelantoId + '.pdf');
    });
  }

  window.generarComprobante = generarComprobante;
})();
