import * as React from 'react';

/**
 * Campo de texto de NOVA con label, hint y error. Focus con glow dorado.
 * El hint explica el porqué del campo (estilo NOVA). El error reemplaza al hint.
 *
 * @startingPoint section="Core" subtitle="Input con label, hint, estado de error y focus morado" viewport="700x200"
 */
export interface InputProps {
  label?: string;
  /** Texto de ayuda bajo el campo. Lo oculta `error`. */
  hint?: string;
  /** Mensaje de error; pinta el borde rojo y muestra ⚠. */
  error?: string;
  required?: boolean;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
