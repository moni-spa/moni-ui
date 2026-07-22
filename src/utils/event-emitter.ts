import type { MoniEventDetail } from '../types/events';

export interface EventEmitterOptions<T> {
  detail?: MoniEventDetail<T>;
  bubbles?: boolean; // Default: true
  composed?: boolean; // Default: true
  cancelable?: boolean; // Default: false
}

/**
 * Helper para emitir Custom Events estandarizados en la librería moni-ui.
 * Asegura que los eventos crucen el Shadow DOM por defecto y unifican el `detail`.
 */
export function emitMoniEvent<T>(
  element: HTMLElement,
  eventName: string,
  options?: EventEmitterOptions<T>
): boolean {
  const event = new CustomEvent(eventName, {
    bubbles: options?.bubbles ?? true,
    composed: options?.composed ?? true,
    cancelable: options?.cancelable ?? false,
    detail: options?.detail ?? {},
  });
  return element.dispatchEvent(event);
}
