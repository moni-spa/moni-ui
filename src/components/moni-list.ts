/**
 * @file components/moni-list.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';

/**
 * Componente Material Design 3 List (Lista).
 *
 * Las listas son índices continuos y verticales de texto o imágenes. Son
 * elementos contenedores que proporcionan agrupación estructural y opcionalmente
 * líneas divisorias para los hijos `<moni-list-item>`.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/lists/specs.md`
 *
 * **Rol de contenedor:**
 * La lista en sí no aplica relleno (padding) ni márgenes a sus hijos. El espaciado
 * y el relleno interno están controlados enteramente por los propios elementos `<moni-list-item>`
 * para asegurar áreas táctiles (hit targets) y alineación correctas.
 *
 * **Variantes:**
 * - `default` (cadena vacía) — Un contenedor de lista limpio y sin bordes.
 * - `border` — Añade un borde inferior a la lista y muestra divisores
 *   horizontales (color `outline-variant`) entre los elementos de la lista.
 *
 * @example
 * ```html
 * <!-- Lista estándar -->
 * <moni-list>
 *   <moni-list-item headline="Elemento 1"></moni-list-item>
 *   <moni-list-item headline="Elemento 2"></moni-list-item>
 * </moni-list>
 *
 * <!-- Lista con divisores y elementos redondeados -->
 * <moni-list variant="border" rounded>
 *   <moni-list-item icon="inbox" headline="Bandeja de entrada"></moni-list-item>
 *   <moni-list-item icon="send" headline="Enviados"></moni-list-item>
 * </moni-list>
 * ```
 *
 * @slot default - Elementos `<moni-list-item>`.
 */
@customElement('moni-list')
export class MoniList extends MoniElement {
	@property({ reflect: true }) variant: '' | 'border' = '';
	@property({ type: Boolean, reflect: true }) rounded = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				color: var(--on-surface);
				padding: 0;
				margin: 0;
			}
			:host([variant='border']) {
				border-block-end: 0.0625rem solid var(--outline-variant);
			}

			::slotted(moni-list-item) {
				display: block;
			}
		`
	];

	/**
	 * Renderiza el contenedor de la lista como un elemento semánticamente apropiado.
	 *
	 * El elemento raíz por defecto es `<ul>` (lista desordenada). Cuando `ordered=true`,
	 * cambia a `<ol>` para secuencias numeradas. Para listas de navegación, el
	 * consumidor debe usar `role="navigation"` en el elemento host o establecer `as="nav"`.
	 * Los hijos `<moni-list-item>` en el slot reciben su `tabindex` y rol ARIA
	 * de la implementación de su propio componente.
	 */
	private _handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		const nodes = slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === Node.ELEMENT_NODE);
		emitMoniEvent(this, 'moni-slot-items-changed', { detail: { nodes } });
	}

	override render() {
		return html`<slot @slotchange=${this._handleSlotChange}></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-list': MoniList;
	}
}

export default MoniList;