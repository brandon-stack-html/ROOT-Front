import * as React from 'react';

/**
 * Avatar de NOVA: iniciales sobre color sólido (o imagen). Opcionalmente con
 * nombre + rol al lado (footer de sidebar, listas de usuarios/empleados).
 */
export interface AvatarProps {
  /** Nombre completo; se derivan las iniciales (máx 2). */
  name?: string;
  /** URL de imagen; si está, reemplaza las iniciales. */
  src?: string;
  /** Diámetro en px. */
  size?: number;
  /** Color de fondo (accent por defecto; usa color por-id para empleados). */
  color?: string;
  /** Si se pasa, muestra nombre + este rol al lado del avatar. */
  role?: string;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
