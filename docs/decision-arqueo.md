# Decisión: Arqueo de caja — POS vs Backoffice

**Fecha:** 2026-05-20
**Sprint:** S15 — Caja & POS
**Contexto:** plan `SPRINTS-GAPS-PANTALLAS.md`, gap B.4

## Pregunta

El sidebar del Backoffice tiene la sección **B20 Caja** y el POS tiene el flujo de
**C2 Mapa → Cerrar turno**. Ambos hablan de "arqueo" / cierre de caja. ¿Dónde se
hace efectivamente el arqueo y qué muestra cada pantalla?

## Decisión

**El arqueo se ejecuta en el POS (C2 Mapa, flujo "Cerrar turno"). B20 Caja del
Backoffice es exclusivamente consulta histórica.**

| Acción | Dónde vive | Quién |
|---|---|---|
| Contar efectivo en caja y registrar diferencia | `pos/mapa.html` → modal "Cerrar turno" (paso 1: resumen + conteo, paso 2: confirmar) | Cajero, al cierre del turno |
| Generar Z-report del turno cerrado | `pos/z-report.html` (HTML imprimible vía `window.print()`) | Cajero, al confirmar el cierre |
| Consultar turnos previos (fecha, cajero, total, diferencia) | `backoffice/caja.html` | Admin / contador |
| Ver tickets de un turno cerrado | `backoffice/caja.html` → click en fila → drawer lateral → CTA "Ver tickets" → `pos/historico.html?turno=XXX` | Admin / contador |

## Razones

1. **El arqueo es una acción operativa, no administrativa.** Sucede al cierre del
   turno, en el dispositivo físico de cobro (POS). No tiene sentido obligar al
   cajero a entrar al Backoffice para arquear.
2. **Evita duplicación.** Tener "Arqueo" como pestaña/modal en B20 obligaría a
   mantener dos UIs equivalentes y a sincronizar el estado de "turno abierto".
3. **B20 Caja se mantiene como vista de consulta y auditoría**, alineada con el
   resto del Backoffice (Nómina, Reportes, Histórico).

## Implicaciones de UI

- En `backoffice/caja.html` no existe botón "Hacer arqueo" ni modal de conteo.
- En `pos/mapa.html`, el flujo "Cerrar turno" es de 2 pasos:
  1. **Resumen + conteo** — totales por método de pago, tiempo abierto, input
     para efectivo contado, cálculo automático de diferencia.
  2. **Confirmar** — abre `pos/z-report.html?autoprint=1` en nueva pestaña +
     toast con link "Volver a imprimir" + redirect a `auth/login.html`.
- En `backoffice/caja.html`, click en una fila de turno abre drawer lateral con:
  resumen + diferencia detectada + CTA "Ver tickets" hacia `pos/historico.html`
  filtrado por ese turno.

## No hacer

- ❌ Modal de arqueo en Backoffice.
- ❌ Pestaña "Arqueo" en B20.
- ❌ Re-arqueo desde Backoffice de un turno ya cerrado (si hay error, el ajuste
  va por gasto/ingreso manual, no por re-arqueo).
