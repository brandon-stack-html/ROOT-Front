import * as React from 'react';

/**
 * Botón de NOVA. Acción primaria saffron gold, secundaria con borde, ghost de texto
 * y destructiva roja. Tamaño `touch` (48px) para POS y app mesero.
 *
 * @startingPoint section="Core" subtitle="Botones: primario, secundario, ghost, destructivo" viewport="700x160"
 */
export interface ButtonProps {
  /** Estilo visual del botón. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Tamaño. `touch` = 48px mínimo, para pantallas táctiles (POS, mesero). */
  size?: 'sm' | 'md' | 'lg' | 'touch';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Ocupa el 100% del contenedor. */
  fullWidth?: boolean;
  /** Nodo de ícono a la izquierda del texto (ej. <i data-lucide="plus" />). */
  iconLeft?: React.ReactNode;
  /** Nodo de ícono a la derecha del texto. */
  iconRight?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
