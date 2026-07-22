/**
 * @file components/moni-select-option.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Select Option (Opción de Selección).
 *
 * Un elemento individual seleccionable diseñado para colocarse dentro de un
 * menú desplegable `<moni-select>`.
 *
 * **Interacción y diseño (layout):**
 * Las opciones se renderizan como elementos `<li>` accesibles estilizados de forma idéntica a
 * `<moni-menu-item>`. Cuando se insertan en un `<moni-select>`, el componente
 * padre extrae sus atributos `value`, `label` y `group` para construir
 * su modelo de datos interno y maneja la lógica de selección real, la navegación
 * por teclado y el renderizado dentro del popup desplegable.
 *
 * **Agrupación:**
 * Las opciones se pueden clasificar en subcategorías proporcionando un atributo
 * `group`. El `<moni-select>` padre usa esto para generar automáticamente
 * encabezados de grupo (`<moni-select-group>`) en la lista desplegable.
 *
 * @example
 * ```html
 * <moni-select label="Framework favorito">
 *   <!-- Opción estándar -->
 *   <moni-select-option value="lit">Lit Element</moni-select-option>
 *
 *   <!-- Opción deshabilitada -->
 *   <moni-select-option value="react" disabled>React (no permitido)</moni-select-option>
 *
 *   <!-- Opción agrupada -->
 *   <moni-select-option value="vue" group="Otros">Vue.js</moni-select-option>
 * </moni-select>
 * ```
 *
 * @slot default - La etiqueta de texto para la opción. Si se omite el atributo `label`,
 *                 el `<moni-select>` padre leerá el `textContent` de esta ranura (slot).
 *
 * @csspart item - El elemento `<li>` exterior.
 */
@customElement('moni-select-option')
export class MoniSelectOption extends MoniElement {
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) group = '';
	@property({ type: Boolean, reflect: true }) selected = false;
	@property({ type: Boolean, reflect: true }) disabled = false;

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
				min-block-size: 2.5rem;
				flex: 1;
				margin: 0 !important;
				cursor: pointer;
				border-radius: 0.25rem;
				color: var(--on-surface);
				font-size: 0.875rem;
				transition: background-color var(--speed2), border-radius var(--speed2);
			}

			li:hover {
				background-color: var(--active);
			}
			li.selected {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}
			li:is(.selected, :active) {
				border-radius: 0.75rem;
			}
			:host([disabled]) li {
				opacity: 0.5;
				pointer-events: none;
			}
		`
	];

	/**
	 * Renderiza la fila de la opción como un elemento de lista accesible con `role="option"`.
	 *
	 * `aria-selected=${this.selected}` permite a los lectores de pantalla anunciar el estado
	 * de selección actual cuando el usuario navega por el cuadro de lista con las teclas de flecha.
	 * Cuando `selected=true`, se renderiza un icono de marca de verificación principal (leading checkmark) a través de `<moni-icon name="check">`
	 * en lugar del slot del icono principal, según la especificación de opciones de Select de M3.
	 */
	override render() {
		return html`<li
			part="option"
			class="${this.selected ? 'selected' : ''}"
		>
			<span part="label"><slot>${this.label || this.value}</slot></span>
		</li>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-select-option': MoniSelectOption;
	}
}

export default MoniSelectOption;
