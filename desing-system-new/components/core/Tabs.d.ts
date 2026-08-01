import * as React from 'react';

/** Item de pestaña para `Tabs`. */
export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Contador opcional (ej. cantidad por estado). */
  count?: number;
}

/**
 * Pestañas con subrayado de NOVA (activa en accent). Para bandejas por estado
 * (adelantos), detalle de empleado (Datos/Adelantos/Pagos), etc. Controlado o
 * no controlado.
 *
 * @startingPoint section="Core" subtitle="Pestañas con subrayado y contador" viewport="700x120"
 */
export interface TabsProps {
  tabs: TabItem[];
  /** Modo controlado: id de la pestaña activa. */
  value?: string;
  /** Modo no controlado: id inicial. */
  defaultValue?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
