import * as React from 'react';

/**
 * Toggle on/off de NOVA (accent cuando activo). Para integraciones, settings,
 * feature flags. Controlado o no controlado; con label opcional.
 */
export interface SwitchProps {
  /** Modo controlado. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** Texto a la derecha del switch (todo el conjunto es clickeable). */
  label?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

export function Switch(props: SwitchProps): JSX.Element;
