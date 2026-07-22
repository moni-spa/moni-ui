/**
 * @file components/moni-menu-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Menu Item (Elemento de Menú).
 *
 * Un elemento interactivo individual dentro de un `<moni-menu>` o `<moni-context-menu>`.
 * Proporciona el estilo estándar de elemento de menú M3, estados hover, e iconos
 * iniciales opcionales.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/menus/specs.md`
 *
 * **Estados de interacción:**
 * - Hover: aplica una capa de opacidad.
 * - Activo (`active=true`): aplica un fondo resaltado `tertiary-container`,
 *   útil para indicar la opción actualmente seleccionada en una lista.
 * - Deshabilitado (`disabled=true`): reduce la opacidad y deshabilita los eventos del puntero.
 *
 * @example
 * ```html
 * <moni-menu-item icon="edit">Editar texto</moni-menu-item>
 * <moni-menu-item icon="content_copy" disabled>Copiar</moni-menu-item>
 * <moni-menu-item active>Actualmente seleccionado</moni-menu-item>
 * ```
 *
 * @slot default - La etiqueta de texto para el elemento de menú.
 *
 * @csspart item - El elemento exterior `<li>`.
 * @csspart icon - El contenedor para el icono inicial.
 */
@customElement('moni-menu-item')
export class MoniMenuItem extends MoniElement {
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			li {
				all: unset;
				box-sizing: border-box;
				position: relative;
				display: flex;
				align-items: center;
				text-align: start;
				justify-content: flex-start;
				white-space: nowrap;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 2.75rem;
				flex: 1;
				margin: 0 !important;
				cursor: pointer;
				border-radius: 0.25rem;
				color: var(--on-surface);
				font-size: 0.875rem;
				transition: border-radius var(--speed2);
			}

			li:hover {
				background-color: var(--active);
			}
			li.active {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}
			li:is(.active, :active) {
				border-radius: 0.75rem;
			}
			:host([disabled]) li {
				opacity: 0.5;
				pointer-events: none;
			}
		`
	];

	/**
	 * Renderiza el elemento de menú como un `<li>` con un icono inicial opcional y un atajo final.
	 *
	 * El `<moni-icon>` inicial solo se renderiza cuando se establece `icon` (evita nodos DOM vacíos).
	 * `shortcut` se muestra como texto silenciado alineado a la derecha (ej. `Ctrl+K`) usando el estilo
	 * de tipografía `body-small` de M3. El slot proyecta contenido personalizado junto a la etiqueta.
	 */
	override render() {
		return html`<li part="item">
			${this.icon
				? html`<moni-icon name="${this.icon}" part="icon"></moni-icon>`
				: html`<slot name="icon"></slot>`}
			<span part="label"><slot>${this.label}</slot></span>
		</li>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-menu-item': MoniMenuItem;
	}
}

export default MoniMenuItem;
