import * as React from 'react';

/**
 * Contenedor de superficie de NOVA. `surface` por defecto, borde translúcido,
 * radius-lg. Slots opcionales de header (title + meta + headerRight) y footer.
 * `interactive` añade hover elevado (sube 2px + shadow + borde strong).
 */
export interface CardProps {
  title?: React.ReactNode;
  /** Overline en mayúsculas sobre el título. */
  meta?: React.ReactNode;
  /** Nodo alineado a la derecha del header (badge, menú, botón). */
  headerRight?: React.ReactNode;
  /** Nodo del footer; se alinea a la derecha con gap. */
  footer?: React.ReactNode;
  /** Card clickeable con hover elevado. */
  interactive?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
