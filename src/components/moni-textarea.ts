/**
 * @file components/moni-textarea.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Componente Material Design 3 Textarea (Área de texto).
 *
 * Un campo de entrada de texto multilínea diseñado para recolectar cantidades mayores de texto,
 * como comentarios, descripciones o mensajes.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/text-fields/specs.md`
 *
 * **Arquitectura visual:**
 * Comparte exactamente el mismo contenedor `.field` y motor de estilos que
 * `<moni-text-field>`, pero internamente renderiza un `<textarea>` nativo en lugar
 * de un `<input>`. Esto asegura la consistencia visual en todos los elementos del formulario
 * en cuanto a etiquetas flotantes, texto de ayuda, estados de error e iconos.
 *
 * **Contador de caracteres:**
 * Si se establece el atributo `maxlength`, el área de texto muestra automáticamente
 * un contador de caracteres (`{longitud actual} / {maxlength}`) ubicado en el
 * borde final (trailing) del área de texto de soporte (abajo a la derecha). Esto puede
 * suprimirse estableciendo el atributo `no-counter`.
 *
 * **Gestión del estado:**
 * Este componente es puramente visual y representacional. Refleja los atributos
 * hacia el textarea nativo, pero NO adjunta listeners internos para `@input` o
 * `@change`. Los consumidores deben adjuntar listeners estándar del DOM directamente
 * a este elemento para capturar la entrada del usuario, tal como lo harían con un
 * textarea nativo.
 *
 * @example
 * ```html
 * <!-- Textarea llenado (filled) estándar -->
 * <moni-textarea label="Descripción" rows="4"></moni-textarea>
 *
 * <!-- Textarea contorneado (outlined) con contador de caracteres -->
 * <moni-textarea
 *   variant="outlined"
 *   label="Biografía"
 *   maxlength="160"
 * ></moni-textarea>
 * ```
 *
 * @csspart field     - El contenedor div `.field` exterior.
 * @csspart input     - El elemento `<textarea>` nativo.
 * @csspart label     - El elemento `<label>` flotante.
 * @csspart helper    - El área de texto de ayuda/error.
 * @csspart counter   - El elemento contador de caracteres.
 */
@customElement('moni-textarea')
export class MoniTextarea extends MoniElement {
	static formAssociated = true;
	private _internals: ElementInternals;

	constructor() {
		super();
		this._internals = this.attachInternals();
	}

	/**
	 * El nombre del textarea, enviado con los datos del formulario.
	 * @type {string}
	 */
	@property({ reflect: true }) name = '';

	/**
	 * El texto de la etiqueta flotante.
	 * @type {string}
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Variante visual del área de texto.
	 * @type {'filled' | 'outlined'}
	 * @default 'filled'
	 */
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'filled';

	/**
	 * Define las dimensiones del área de texto.
	 * @type {'small' | 'medium' | 'large' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Forma del radio del borde (border-radius) del campo.
	 * @type {'round' | 'square' | 'no-round'}
	 * @default 'no-round'
	 */
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';

	/**
	 * Nombre del icono inicial (leading) (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true }) icon = '';

	/**
	 * Nombre del icono final (trailing) (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon = '';

	/**
	 * Prefijo de texto corto mostrado antes del valor del input.
	 * @type {string}
	 */
	@property({ reflect: true }) prefix = '';

	/**
	 * Sufijo de texto corto mostrado después del valor del input.
	 * @type {string}
	 */
	@property({ reflect: true }) suffix = '';

	/**
	 * Número por defecto de líneas de texto visibles.
	 * @type {number}
	 * @default 3
	 */
	@property({ type: Number, reflect: true }) rows = 3;

	/**
	 * Número máximo de caracteres permitidos en el área de texto.
	 * También habilita la visualización del contador de caracteres a menos que `noCounter` sea true.
	 * @type {number | null}
	 */
	@property({ type: Number, reflect: true }) maxlength: number | null = null;

	/**
	 * Oculta la visualización del contador de caracteres cuando se establece `maxlength`.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'no-counter' })
	noCounter = false;

	/**
	 * Si es true, muestra un indicador de carga (progreso circular) al final.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) loading = false;

	/**
	 * Deshabilita el área de texto.
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
	 * El valor actual del área de texto.
	 * @type {string}
	 */
	@property({ reflect: true }) value = '';

	/**
	 * Texto de marcador de posición (placeholder) mostrado cuando el textarea está vacío y la etiqueta es flotante.
	 * @type {string}
	 */
	@property({ reflect: true }) placeholder = '';

	@query('textarea') private _input!: HTMLTextAreaElement;

	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('value')) {
				this._input.value = this.value;
				this._internals.setFormValue(this.value);
			}
			if (changed.has('disabled')) this._input.disabled = this.disabled;
			if (changed.has('maxlength') && this.maxlength != null) {
				this._input.maxLength = this.maxlength;
			}
		}
	}

	static override styles = [sharedStyles, fieldStyles];

	/**
	 * Renderiza el campo del área de texto con etiqueta, iconos de prefijo/sufijo y contador de caracteres.
	 *
	 * **Composición de `fieldClasses`:**
	 * Sigue la convención de nomenclatura field-styles. `prefix` se añade
	 * cuando el texto de `icon` o `prefix` está presente (desplaza el inicio en línea de la etiqueta).
	 * `suffix` se añade cuando `trailingIcon`, el texto `suffix` o `loading` es true.
	 *
	 * **Contador de caracteres:**
	 * `showCounter` es true cuando `maxlength > 0` y `noCounter` no está configurado.
	 * El contador muestra `${this.value.length} / ${this.maxlength}` y puede volverse rojo
	 * (vía CSS `invalid`) dependiendo de la validación.
	 */
	override render() {
		const hasLeading = Boolean(this.icon) || Boolean(this.prefix);
		const hasTrailing =
			Boolean(this.trailingIcon) ||
			Boolean(this.suffix) ||
			this.loading;
		const isActive = Boolean(this.value) || Boolean(this.placeholder);
		const showCounter =
			!this.noCounter && this.maxlength != null && this.maxlength > 0;
		const fieldClasses = {
			field: true,
			label: Boolean(this.label),
			fill: this.variant === 'filled',
			border: this.variant === 'outlined',
			small: this.size === 'small',
			large: this.size === 'large',
			extra: this.size === 'extra',
			prefix: hasLeading,
			suffix: hasTrailing,
			invalid: this.error,
			round: this.shape === 'round',
			square: this.shape === 'no-round'
		};
		const placeholder = this.placeholder || (this.label ? ' ' : '');

		const leading = this.icon
			? html`<i class="leading-icon" part="leading-icon"
					><moni-icon name="${this.icon}"></moni-icon
				></i>`
			: this.prefix
				? html`<span class="leading-icon" part="prefix"
						>${this.prefix}</span
					>`
				: nothing;

		const trailing = this.loading
			? html`<i class="trailing-icon" part="trailing-icon"
					><moni-progress
						variant="circular"
						indeterminate
						size="small"
						style="inline-size: 1.25rem; block-size: 1.25rem; color: currentColor;"
					></moni-progress
				></i>`
			: this.trailingIcon
				? html`<i class="trailing-icon" part="trailing-icon"
						><moni-icon name="${this.trailingIcon}"></moni-icon
					></i>`
				: this.suffix
					? html`<span class="trailing-icon" part="suffix"
							>${this.suffix}</span
						>`
					: nothing;

		// Especificación M3: texto de soporte a la izquierda, contador de caracteres a la derecha.
		const counter = showCounter
			? html`<output part="counter" class="counter"
						>${this.value.length} / ${this.maxlength}</output
					>`
			: nothing;
		const helperText = this.error
			? html`<output part="helper" class="invalid"
						>${this.errorText || this.helper}</output
					>`
			: this.helper
				? html`<output part="helper">${this.helper}</output>`
				: nothing;
		const hasFooter = helperText || counter;

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<textarea
				part="input"
				rows=${this.rows}
				maxlength=${ifDefined(this.maxlength ?? undefined)}
				placeholder=${placeholder}
				?disabled=${this.disabled}
				.value=${this.value}
				name=${ifDefined(this.name || undefined)}
				class=${isActive ? 'active' : ''}
			></textarea>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${trailing}
			${hasFooter
				? html`<div class="footer" part="footer">
						${helperText}
						<div class="spacer"></div>
						${counter}
					</div>`
				: nothing}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-textarea': MoniTextarea;
	}
}

export default MoniTextarea;
