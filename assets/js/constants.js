/* Constantes globales del sistema ROOT */

window.SMMLV_2026 = 1_623_500;

/**
 * Formatea un número como moneda COP.
 * formatCOP(1623500) → "$1.623.500"
 */
window.formatCOP = function formatCOP(num) {
  if (typeof num !== 'number' || isNaN(num)) return '$0';
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
