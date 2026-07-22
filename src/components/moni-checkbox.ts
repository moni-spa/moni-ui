/**
 * @file components/moni-checkbox.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';

/**
 * Componente Material Design 3 Checkbox.
 *
 * Los checkboxes permiten a los usuarios seleccionar uno o más elementos de un conjunto, o alternar
 * una sola opción binaria. Son envolturas solo visuales — el consumidor es
 * responsable de conectar la lógica de envío y validación del formulario.
 *
 * **Arquitectura visual (Patrón BeerCSS):**
 * El `<input type="checkbox">` nativo ocupa espacio real en el diseño (mínimo 16×16)
 * pero está oculto visualmente con `opacity: 0`. Un hermano `<span>` renderizado después
 * del input contiene dos pseudo-elementos:
 * - `::before` — el icono visible del checkbox (ligadura de Material Symbols).
 * - `::after`  — el anillo de onda (ripple) de la capa de estado hover/focus.
 *
 * El contenido de `::before` cambia entre:
 * - `'check_box_outline_blank'` (desmarcado)
 * - `'check_box'` (marcado)
 * - `'indeterminate_check_box'` (estado nativo indeterminado)
 *
 * **Integración de formulario:**
 * Establecer `name` y `value` los pasa al elemento `<input>` nativo,
 * permitiendo la participación en envíos de formularios HTML.
 *
 * @fires moni-change - Burbujea y está compuesto. Se dispara cuando se alterna el checkbox.
 *                      El consumidor puede leer `element.checked` para el nuevo estado.
 *
 * @example
 * ```html
 * <moni-checkbox label="Aceptar términos" name="terms" value="yes"></moni-checkbox>
 *
 * <script>
 *   document.querySelector('moni-checkbox').addEventListener('moni-change', (e) => {
 *     console.log('checked:', e.target.checked);
 *   });
 * </script>
 * ```
 *
 * @csspart checkbox - El elemento exterior `<label>`.
 */
@customElement('moni-checkbox')
export class MoniCheckbox extends MoniElement {
	static formAssociated = true;
	private _internals: ElementInternals;

	constructor() {
		super();
		this._internals = this.attachInternals();
	}

	/**
	 * Texto de la etiqueta mostrado a la derecha del icono del checkbox.
	 *
	 * Cuando no está vacío, la etiqueta se renderiza como un nodo de texto dentro del `<span>`.
	 * Cuando está vacío, el slot por defecto se renderiza en su lugar, permitiendo HTML en el slot.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Si el checkbox está actualmente marcado.
	 *
	 * Reflejado como un atributo para que los selectores de atributos CSS y los lectores
	 * de estado externos puedan observar el estado marcado sin acceder a la propiedad JS.
	 * Sincronizado con el input nativo a través de `updated()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) checked = false;

	/**
	 * Cuando es `true`, el input nativo se deshabilita: el checkbox no es interactivo
	 * y se renderiza con opacidad del 50%.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Tamaño visual del icono del checkbox.
	 *
	 * Se mapea a la propiedad personalizada `--_size` que controla tanto el área de impacto
	 * del input invisible como el tamaño del icono visible `::before`.
	 *
	 * | Valor      | `--_size` |
	 * |------------|-----------|
	 * | `'small'`  | 1rem      |
	 * | `'medium'` | 1.5rem    |
	 * | `'large'`  | 2rem      |
	 * | `'extra'`  | 2.5rem    |
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Reenviado al atributo `<input name>` nativo.
	 * Requerido para agrupar checkboxes dentro de un formulario.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Reenviado al atributo `<input value>` nativo.
	 * El valor enviado en un formulario cuando este checkbox está marcado.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/** Referencia directa al elemento input nativo para acceso programático. */
	@query('input') private _input!: HTMLInputElement;

	/**
	 * Sincroniza `checked` y `disabled` de vuelta al elemento input nativo después
	 * del ciclo de renderizado de Lit, asegurando que el DOM se mantenga sincronizado con el estado del componente.
	 *
	 * Esto es necesario porque el enlace `.property=${value}` de Lit actualiza la
	 * propiedad DOM, pero la directiva `live()` y la asignación directa de propiedad
	 * son más fiables para entradas booleanas en diferentes implementaciones de navegadores.
	 *
	 * @param changed - Mapa de nombres de propiedades cambiadas a sus valores anteriores.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('checked')) {
				this._input.checked = this.checked;
				this._internals.setFormValue(this.checked ? (this.value || 'on') : null);
			}
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				--_size: 1.5rem;
				display: inline-flex;
				font-family: var(--font);
			}
			:host([size='small'])  { --_size: 1rem; }
			:host([size='large'])  { --_size: 2rem; }
			:host([size='extra'])  { --_size: 2.5rem; }

			/* BeerCSS .checkbox */
			label {
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
			}

			/* BeerCSS: input has real size, opacity 0 — occupies real layout space */
			input {
				inline-size: var(--_size);
				block-size: var(--_size);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* BeerCSS: span wraps the visible indicator + label text */
			span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* BeerCSS: span::before = the checkbox icon (absolute, overlaid on input) */
			span::before {
				--_size: inherit;
				content: 'check_box_outline_blank';
				inline-size: var(--_size);
				block-size: var(--_size);
				box-sizing: border-box;
				margin: 0 auto;
				outline: none;
				color: var(--on-surface-variant);
				position: absolute;
				inset: auto auto auto calc(var(--_size) * -1);
				border-radius: 50%;
				user-select: none;
				z-index: 1;
				font-family: var(--font-icon);
				font-size: var(--_size);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			/* Checked: filled checkbox icon */
			input:checked + span::before {
				content: 'check_box';
				font-variation-settings: 'FILL' 1;
				color: var(--primary);
			}

			/* Indeterminate */
			input:indeterminate + span::before {
				content: 'indeterminate_check_box';
			}

			/* BeerCSS: span::after = ripple/hover ring */
			span::after {
				--_size: inherit;
				content: '';
				inline-size: var(--_size);
				block-size: var(--_size);
				box-sizing: border-box;
				margin: 0 auto;
				position: absolute;
				inset: auto auto auto calc(var(--_size) * -1);
				border-radius: 50%;
				user-select: none;
				transition: all var(--speed1);
				background-color: currentColor;
				box-shadow: 0 0 0 0 currentColor;
				opacity: 0;
			}

			label:hover > input:not(:disabled) + span::after,
			input:not(:disabled):focus + span::after {
				box-shadow: 0 0 0 0.5rem currentColor;
				opacity: 0.1;
			}

			/* BeerCSS: span:not(:empty) gets a small inline-start padding for the label */
			span.has-label {
				padding-inline-start: 0.25rem;
			}

			/* Disabled */
			input:disabled + span {
				opacity: 0.5;
				cursor: not-allowed;
			}

			/* Focus ring */
			input:focus-visible + span::before {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.375rem;
			}
		`
	];

	/**
	 * Handles the native input's `change` event.
	 *
	 * Reads the new checked state from the input and re-dispatches a composed
	 * `'change'` event so the signal crosses shadow DOM boundaries and can be
	 * heard by parent elements in the light DOM.
	 *
	 * @param e - The native `change` event from the hidden `<input>`.
	 */
	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		emitMoniEvent(this, 'moni-change', {
			detail: { value: this.checked, originalEvent: e }
		});
	}

	/**
	 * Renders the accessible checkbox label structure.
	 *
	 * The `<label>` wraps the hidden `<input>` and a `<span>` so that clicking
	 * anywhere on the label area (including the text) toggles the checkbox.
	 * The `has-label` class on the span adds left padding to separate the icon
	 * from the label text.
	 */
	override render() {
		return html`<label part="checkbox">
			<input
				type="checkbox"
				.checked=${live(this.checked)}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				value=${ifDefined(this.value || undefined)}
				@change=${this._onChange}
			/>
			<span class=${this.label ? 'has-label' : ''}>
				${this.label
					? html`${this.label}`
					: html`<slot></slot>`}
			</span>
		</label>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-checkbox': MoniCheckbox;
	}
}

export default MoniCheckbox;
