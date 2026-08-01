import * as React from 'react';

/**
 * Badge de estado de NOVA. Firma del sistema: relleno translúcido + borde
 * translúcido + texto en el color (nunca relleno sólido). Para estados de
 * adelantos, integraciones, mesas, tickets, etc.
 *
 * @startingPoint section="Core" subtitle="Badges translúcidos de estado con dot opcional" viewport="700x140"
 */
export interface BadgeProps {
  /** Tono semántico. */
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'accent';
  /** Muestra el punto de color a la izquierda. */
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
