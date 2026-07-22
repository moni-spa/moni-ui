/**
 * @file components/moni-color-field.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Color Field (Campo de Color).
 *
 * Un campo de texto especializado para la entrada de color que combina un
 * `<input type="color">` nativo con una visualización de texto de solo lectura del
 * valor hexadecimal seleccionado, envuelto en la carcasa estándar de campo M3.
 *
 * **Arquitectura visual:**
 * Extiende el patrón de estilo de campo usado por `<moni-text-field>`. El
 * slot de icono inicial se reemplaza por una muestra de color circular (`.swatch`)
 * que se posiciona absolutamente sobre una entrada de color nativa invisible.
 * Al hacer clic en la muestra se abre el selector de color del sistema. La parte de entrada de texto
 * muestra el código hexadecimal seleccionado y es estrictamente `readOnly`.
 *
 * **Sincronización de estado:**
 * El componente escucha el evento nativo `change` en la entrada de color,
 * actualiza la propiedad `value`, y re-despacha un evento compuesto `'change'`.
 * No escucha `input` (arrastre continuo en el selector de color) para evitar
 * el disparo excesivo de eventos, pero los consumidores pueden adjuntar sus propios
 * escuchas de `input` directamente al elemento si se necesita una vista previa en vivo.
 *
 * @fires change - Burbujea y está compuesto. Se dispara cuando el selector de color se cierra
 *                 y el valor se confirma. Leer `element.value`.
 *
 * @example
 * ```html
 * <moni-color-field
 *   label="Color del Tema"
 *   name="primaryColor"
 *   value="#6750a4"
 *   variant="outlined"
 * ></moni-color-field>
 * ```
 *
 * @csspart field       - El contenedor div exterior `.field`.
 * @csspart swatch      - El elemento de vista previa de color circular.
 * @csspart input-color - El `<input type="color">` nativo, visualmente oculto.
 * @csspart input-text  - El `<input type="text">` nativo que muestra el código hexadecimal.
 * @csspart label       - El elemento flotante `<label>`.
 */
@customElement('moni-color-field')
export class MoniColorField extends MoniElement {
	/**
	 * El nombre del input, enviado con los datos del formulario.
	 * @type {string}
	 */
	@property({ reflect: true }) name = '';

	/**
	 * El texto de la etiqueta flotante.
	 * @type {string}
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Variante visual del campo de texto.
	 * @type {'filled' | 'outlined'}
	 * @default 'outlined'
	 */
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'outlined';

	/**
	 * Define las dimensiones del campo de texto.
	 * @type {'small' | 'medium' | 'large' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Forma del radio del borde del campo.
	 * @type {'round' | 'square' | 'no-round'}
	 * @default 'no-round'
	 */
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';

	/**
	 * Deshabilita el campo de color.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Texto de ayuda mostrado debajo del campo.
	 * @type {string}
	 */
	@property({ reflect: true }) helper = '';

	/**
	 * Texto de error mostrado debajo del campo cuando `error` es true.
	 * Sobrescribe el texto de ayuda.
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';

	/**
	 * Si es true, establece el campo en un estado de error.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) error = false;

	/**
	 * El valor actual del color hexadecimal.
	 * @type {string}
	 * @default '#6750a4'
	 */
	@property({ reflect: true }) value = '#6750a4';

	@query('input[type="color"]') private _colorInput!: HTMLInputElement;
	@query('input[type="text"]') private _textInput!: HTMLInputElement;

	/**
	 * Hook de ciclo de vida de Lit.
	 * Sincroniza manualmente el estado reactivo (`value`, `disabled`) con los
	 * elementos nativos del DOM subyacente. Se hace manualmente porque el input
	 * de tipo color no despacha eventos de forma natural si mutamos sus atributos.
	 */
	override updated(changed: Map<string, unknown>) {
		if (changed.has('value')) {
			if (this._colorInput) this._colorInput.value = this.value;
			if (this._textInput) this._textInput.value = this.value;
		}
		if (changed.has('disabled')) {
			if (this._colorInput) this._colorInput.disabled = this.disabled;
			if (this._textInput) this._textInput.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		fieldStyles,
		css`
			.swatch {
				inline-size: 1.5rem;
				block-size: 1.5rem;
				border-radius: 50%;
				border: 0.0625rem solid var(--outline);
				background-color: var(--_swatch, currentColor);
				position: absolute;
				inset: calc(50% - 0.75rem) auto auto 0.75rem;
				pointer-events: none;
				z-index: 1;
			}
			input[type='text'] {
				padding-inline-start: 2.5rem !important;
			}
			input[type='color'] {
				position: absolute;
				inset: 0;
				opacity: 0;
				z-index: 2;
				cursor: pointer;
			}
		`
	];

	/**
	 * Ensambla la estructura del Shadow DOM del campo de color.
	 *
	 * **Estrategia de input en capas:**
	 * Dos elementos `<input>` se apilan absolutamente:
	 * 1. `<input type="color">` (z-index: 2, opacidad: 0) — invisible pero
	 *    clicable, abre el selector de color nativo del sistema operativo.
	 * 2. `<input type="text" readonly>` (z-index: 0) — visible, muestra el
	 *    valor hexadecimal. `tabindex="-1"` en el input de color significa que
	 *    solo el input de texto es alcanzable por teclado.
	 *
	 * El círculo `.swatch` (z-index: 1) está posicionado absolutamente en el
	 * borde inicial del input de texto y estilizado a través de `--_swatch: ${this.value}`,
	 * lo cual establece su `background-color` mediante CSS `var(--_swatch)`.
	 *
	 * **Composición de `fieldClasses`:**
	 * El mapa de clases sigue la convención de nomenclatura field-styles de BeerCSS:
	 * `field`, `label`, `fill`/`border` (variante), `small`/`large`/`extra` (tamaño),
	 * `prefix` (activa el cambio de padding inicial para la muestra), `invalid`, forma.
	 *
	 * **Renderizado condicional de etiqueta / ayuda:**
	 * Usa el centinela `nothing` de Lit para evitar renderizar nodos DOM vacíos cuando
	 * `label` o `helper` son cadenas vacías, previniendo saltos de diseño.
	 */
	override render() {
		const isActive = Boolean(this.value);
		const fieldClasses = {
			field: true,
			label: Boolean(this.label),
			fill: this.variant === 'filled',
			border: this.variant === 'outlined',
			small: this.size === 'small',
			large: this.size === 'large',
			extra: this.size === 'extra',
			prefix: true,
			invalid: this.error,
			round: this.shape === 'round',
			square: this.shape === 'no-round'
		};

		return html`<div class=${classMap(fieldClasses)} part="field">
			<span
				class="swatch"
				style="--_swatch: ${this.value};"
				aria-hidden="true"
			></span>
			<input
				type="color"
				part="color"
				.value=${this.value}
				?disabled=${this.disabled}
				name=${ifDefined(this.name ? `${this.name}-color` : undefined)}
				tabindex="-1"
			/>
			<input
				type="text"
				part="text"
				readonly
				.value=${this.value}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				class=${isActive ? 'active' : ''}
			/>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${this.error
				? html`<output part="helper" class="invalid"
						>${this.errorText || this.helper}</output
					>`
				: this.helper
					? html`<output part="helper">${this.helper}</output>`
					: nothing}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-color-field': MoniColorField;
	}
}

export default MoniColorField;
