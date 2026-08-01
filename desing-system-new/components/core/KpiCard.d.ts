import * as React from 'react';

/**
 * Tarjeta de KPI para dashboards (Backoffice, nómina). Label en overline,
 * valor grande con tabular-nums, delta opcional con color por dirección, e
 * ícono opcional. `tone` tinta toda la card para alertas.
 *
 * @startingPoint section="Core" subtitle="KPI card con valor, delta e ícono" viewport="700x170"
 */
export interface KpiCardProps {
  label: string;
  /** Valor principal (ej. "$2.4M", "68", "04:12"). */
  value: React.ReactNode;
  /** Texto del delta (ej. "+12% vs ayer"). */
  delta?: string;
  deltaDir?: 'up' | 'down' | 'flat';
  /** Nodo de ícono (Lucide). */
  icon?: React.ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'error' | 'muted';
  style?: React.CSSProperties;
}

export function KpiCard(props: KpiCardProps): JSX.Element;
