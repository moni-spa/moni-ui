export interface MoniEventDetail<T = unknown> {
  value?: T;
  /** Índice del elemento (para listas/colecciones) */
  index?: number;
  /** Elementos múltiples (para slots o selecciones múltiples) */
  items?: any[];
  /** Nodos del DOM asociados (para slots) */
  nodes?: Node[];
  /** Evento nativo original que disparó la acción */
  originalEvent?: Event;
  /** El elemento asociado al evento */
  item?: T;
  /** Referencia física al DOM node */
  card?: HTMLElement | null;
}

export type MoniEvent<T = unknown> = CustomEvent<MoniEventDetail<T>>;
