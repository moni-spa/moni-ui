/**
 * @file components/moni-text-field.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import Inputmask, { type InputmaskInstance, type InputmaskOptions } from 'inputmask';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Componente Material Design 3 Text Field (Campo de texto).
 *
 * Un campo de entrada con todas las funciones que envuelve un `<input>` nativo dentro de la
 * estructura de campo M3 (clase `.field` de `fieldStyles`). Soporta etiquetas flotantes,
 * variantes llenas (filled) y contorneadas (outlined), iconos iniciales/finales (leading/trailing),
 * texto de ayuda y estados de error.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/text-fields/specs.md`
 *
 * **Arquitectura visual:**
 * Utiliza `fieldStyles` para toda la estructura CSS del campo. El contenedor del campo
 * es un `<div class="field [modifiers]">` que envuelve:
 * 1. Icono inicial (leading) opcional.
 * 2. Elemento `<input>` nativo.
 * 3. `<label>` flotante (cuando se establece `label`).
 * 4. Icono final (trailing) opcional o indicador de carga (spinner).
 * 5. `<output>` para texto de ayuda/error.
 *
 * **Sincronización de eventos:**
 * Emite `moni-input` en cada tipeo y `moni-change` al consolidar el valor (blur/enter).
 * El valor interno del componente (`this.value`) se mantiene sincronizado automáticamente.
 *
 * @example
 * ```html
 * <moni-text-field
 *   label="Dirección de correo"
 *   type="email"
 *   name="email"
 *   icon="mail"
 *   variant="outlined"
 *   helper="Nunca compartiremos tu correo."
 * ></moni-text-field>
 *
 * <moni-text-field
 *   label="Monto"
 *   type="number"
 *   prefix="$"
 *   error
 *   error-text="El valor debe ser positivo"
 * ></moni-text-field>
 * ```
 *
 * @csspart field         - El contenedor div `.field` exterior.
 * @csspart input         - El elemento `<input>` nativo.
 * @csspart label         - El elemento `<label>` flotante.
 * @csspart helper        - El elemento `<output>` de ayuda.
 * @csspart error-output  - El elemento `<output>` de error.
 */
@customElement('moni-text-field')
export class MoniTextField extends MoniElement {
	static formAssociated = true;
	/** Constructor original para acceder también a la API estática completa de Inputmask. */
	static readonly Inputmask = Inputmask;
	private _internals: ElementInternals;

	constructor() {
		super();
		this._internals = this.attachInternals();
	}

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
	 * @type {'filled' | 'outlined' | 'underlined'}
	 * @default 'filled'
	 */
	@property({ reflect: true })
	variant: 'filled' | 'outlined' | 'underlined' = 'filled';

	/**
	 * Define las dimensiones del campo de texto.
	 * @type {'small' | 'medium' | 'large' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Forma del radio del borde (border-radius) del campo.
	 * @type {'round' | 'no-round'}
	 * @default 'no-round'
	 */
	@property({ reflect: true })
	shape: 'round' | 'no-round' = 'no-round';

	/**
	 * El tipo de input HTML nativo.
	 * @type {'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color'}
	 * @default 'text'
	 */
	@property({ reflect: true })
	type:
		| 'text'
		| 'password'
		| 'email'
		| 'number'
		| 'tel'
		| 'url'
		| 'search'
		| 'date'
		| 'time'
		| 'datetime-local'
		| 'month'
		| 'week'
		| 'color' = 'text';

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

	/** Icono del botón interactivo ubicado al final del campo. */
	@property({ reflect: true, attribute: 'suffix-button-icon' }) suffixButtonIcon = '';

	/** Etiqueta accesible del botón suffix. */
	@property({ reflect: true, attribute: 'suffix-button-label' }) suffixButtonLabel = 'Acción del campo';

	@state() private _hasSuffixSlot = false;

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
	 * Si es true, muestra un indicador de carga (progreso lineal/circular) al final.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) loading = false;

	/**
	 * Deshabilita el campo de texto.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * El valor actual del input.
	 * @type {string}
	 */
	@property({ reflect: true }) value = '';

	/**
	 * Texto de marcador de posición (placeholder) mostrado cuando el input está vacío y la etiqueta es flotante.
	 * @type {string}
	 */
	@property({ reflect: true }) placeholder = '';

	/*
	 * Restricciones nativas.
	 *
	 * Antes ninguna de estas llegaba al `<input>` interno: el componente sólo
	 * reenviaba `type`, `placeholder`, `disabled`, `value` y `name`. Eso dejaba
	 * fuera el autocompletado de contraseñas, el teclado correcto en móvil, el
	 * límite de caracteres y toda la validación de restricciones, así que cada
	 * consumidor que necesitaba una de ellas tenía que renunciar al componente y
	 * usar un input nativo.
	 *
	 * Se reflejan al host además de reenviarse para que `[required]` y compañía
	 * puedan usarse como selectores CSS desde fuera.
	 */

	/** Marca el campo como obligatorio y lo integra en la validación del formulario. */
	@property({ type: Boolean, reflect: true }) required = false;

	/** Impide editar el valor sin sacarlo del envío ni atenuarlo como `disabled`. */
	@property({ type: Boolean, reflect: true }) readonly = false;

	/** Pista de autocompletado del navegador, por ejemplo `email` o `current-password`. */
	@property({ reflect: true }) autocomplete = '';

	/** Teclado virtual a mostrar en móvil, por ejemplo `numeric` o `tel`. */
	@property({ reflect: true }) inputmode = '';

	/** Máximo de caracteres aceptados. */
	@property({ type: Number, reflect: true }) maxlength: number | null = null;

	/** Mínimo de caracteres aceptados. */
	@property({ type: Number, reflect: true }) minlength: number | null = null;

	/** Valor mínimo para `number` y los tipos de fecha y hora. */
	@property({ reflect: true }) min = '';

	/** Valor máximo para `number` y los tipos de fecha y hora. */
	@property({ reflect: true }) max = '';

	/** Incremento para `number` y los tipos de fecha y hora. */
	@property({ reflect: true }) step = '';

	/** Expresión regular que debe cumplir el valor. */
	@property({ reflect: true }) pattern = '';

	/**
	 * Patrón Inputmask. Admite opcionales `[]`, grupos `()`, alternadores `|`,
	 * cuantificadores `{n,m}` y los tokens `9`, `a`, `*` y `K` (RUT).
	 * @example `99.999.999-K`
	 */
	@property({ reflect: true }) mask = '';

	/** Alias integrado de Inputmask, por ejemplo `email`, `datetime`, `numeric`, `currency` o `ip`. */
	@property({ reflect: true, attribute: 'mask-alias' }) maskAlias = '';

	/** Opciones avanzadas de Inputmask. También acepta JSON mediante el atributo `mask-options`. */
	@property({
		attribute: 'mask-options',
		converter: {
			fromAttribute: (value: string | null) => {
				if (!value) return {};
				try { return JSON.parse(value) as InputmaskOptions; } catch { return {}; }
			},
			toAttribute: (value: InputmaskOptions) => JSON.stringify(value ?? {})
		}
	})
	maskOptions: InputmaskOptions = {};

	/** Valor actual sin los caracteres literales definidos por `mask`. */
	get unmaskedValue(): string {
		return this._maskInstance?.unmaskedvalue() ?? this.value;
	}

	@query('input') private _input!: HTMLInputElement;
	private _maskInstance?: InputmaskInstance;

	/** Instancia original de Inputmask aplicada al input nativo. */
	get inputmaskInstance(): InputmaskInstance | undefined {
		return this._maskInstance;
	}

	/** Lee o actualiza opciones de la instancia activa. */
	maskOption(name: string): unknown;
	maskOption(options: InputmaskOptions, noRemask?: boolean): InputmaskInstance | undefined;
	maskOption(nameOrOptions: string | InputmaskOptions, noRemask = false): unknown {
		if (!this._maskInstance) return undefined;
		return typeof nameOrOptions === 'string'
			? this._maskInstance.option(nameOrOptions)
			: this._maskInstance.option(nameOrOptions, noRemask);
	}

	getEmptyMask(): string {
		return this._maskInstance?.getemptymask() ?? '';
	}

	hasMaskedValue(): boolean {
		return this._maskInstance?.hasMaskedValue() ?? false;
	}

	isMaskComplete(): boolean {
		return this._maskInstance?.isComplete() ?? true;
	}

	isMaskValid(value?: string): boolean {
		return this._maskInstance?.isValid(value) ?? true;
	}

	getMaskMetadata(): unknown {
		return this._maskInstance?.getmetadata();
	}

	formatWithMask(value: string, metadata = false): string | { value: string; metadata: unknown } {
		return this._maskInstance?.format(value, metadata) ?? value;
	}

	setMaskedValue(value: string): void {
		if (!this._maskInstance) {
			this.value = value;
			return;
		}
		this._maskInstance.setValue(value);
		this.value = this._input.value;
		this._internals?.setFormValue?.(this.value);
	}

	removeMask(): void {
		this._maskInstance?.remove();
		this._maskInstance = undefined;
	}

	private _configureMask() {
		this._maskInstance?.remove();
		this._maskInstance = undefined;
		if (!this._input || (!this.mask && !this.maskAlias)) return;

		const options: InputmaskOptions = {
			placeholder: '',
			...this.maskOptions,
			...(this.mask ? { mask: this.mask } : {}),
			definitions: {
				...(this.maskOptions.definitions ?? {}),
				K: { validator: '[0-9Kk]', casing: 'upper' }
			}
		};
		const inputmask = this.maskAlias
			? new Inputmask(this.maskAlias, options)
			: new Inputmask(options);
		this._maskInstance = inputmask.mask(this._input);
	}

	/**
	 * Sincroniza imperativamente las propiedades DOM del `<input>` nativo después de cada actualización reactiva.
	 *
	 * Las vinculaciones `?value` y `?disabled` de Lit establecen *atributos* HTML, no *propiedades* DOM.
	 * Para un `<input>`, el atributo `value` solo establece el valor *inicial*; la propiedad DOM
	 * `input.value` refleja el valor actual tecleado por el usuario. Después de una actualización reactiva que
	 * cambia `this.value` (ej. reinicio programático), debemos escribir directamente a la propiedad
	 * DOM para sobrescribir lo que el usuario ha tecleado. Esto también es crítico para los consumidores
	 * de React y Vue que mutan la propiedad del Custom Element directamente, omitiendo el flujo
	 * de atributos de Lit.
	 *
	 * @param changed - Mapa de los nombres de propiedades a sus valores anteriores que causaron esta actualización.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('mask') || changed.has('maskAlias') || changed.has('maskOptions')) {
				this._configureMask();
			}
			if (changed.has('value')) {
				this._input.value = this.value;
				if (this._maskInstance && this.value !== this._input.value) {
					this.value = this._input.value;
				}
				this._internals?.setFormValue?.(this.value);
			}
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
		this._syncValidity();
	}

	/**
	 * Copia la validez del `<input>` interno al host.
	 *
	 * Reenviar `required` o `pattern` no basta: el navegador valida el
	 * formulario mirando los controles asociados a él, y el que aquí participa
	 * es el host, no el input del Shadow DOM. Sin este puente el campo se
	 * pintaría como obligatorio pero el envío no se detendría.
	 *
	 * El tercer argumento ancla el globo de validación al input real, para que
	 * el navegador tenga dónde mostrarlo y a dónde mover el foco.
	 */
/**
	 * API de validación equivalente a la de un control nativo.
	 *
	 * Los elementos form-associated participan en la validación del formulario,
	 * pero no reciben estos miembros automáticamente: hay que exponerlos para que
	 * un `moni-text-field` se pueda interrogar igual que un `<input>`.
	 */
	get validity(): ValidityState {
		return this._internals.validity;
	}

	get validationMessage(): string {
		return this._internals.validationMessage;
	}

	checkValidity(): boolean {
		return this._internals.checkValidity();
	}

	reportValidity(): boolean {
		return this._internals.reportValidity();
	}

	private _syncValidity() {
		if (!this._input || !this._internals?.setValidity) return;
		this._internals.setValidity(
			this._input.validity,
			this._input.validationMessage,
			this._input
		);
	}

	private _handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		this.value = target.value;
		// Al teclear, `value` no siempre cambia de referencia (máscaras), así que
		// la validez se refresca aquí y no sólo desde `updated()`.
		this._syncValidity();
		emitMoniEvent(this, 'moni-input', {
			detail: { value: this.value, unmaskedValue: this.unmaskedValue, originalEvent: e }
		});
	}

	private _handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		this.value = target.value;
		emitMoniEvent(this, 'moni-change', {
			detail: { value: this.value, unmaskedValue: this.unmaskedValue, originalEvent: e }
		});
	}

	override disconnectedCallback() {
		this._maskInstance?.remove();
		this._maskInstance = undefined;
		super.disconnectedCallback();
	}

	private _handleSuffixClick(event: Event) {
		if (this.disabled) return;
		this.dispatchEvent(new CustomEvent('suffix-click', {
			detail: { originalEvent: event },
			bubbles: true,
			composed: true
		}));
	}

	private _handleSuffixSlotChange(event: Event) {
		const slot = event.currentTarget as HTMLSlotElement;
		this._hasSuffixSlot = slot.assignedElements({ flatten: true }).length > 0;
	}

	static override styles = [sharedStyles, fieldStyles, css`
		.suffix-action {
			position: absolute;
			inset-inline-end: .5rem;
			inset-block-start: calc(var(--_middle) - 1.25rem);
			z-index: 3;
			display: grid;
			place-items: center;
			inline-size: 2.5rem;
			block-size: 2.5rem;
			pointer-events: auto;
		}
		.suffix-action[hidden] { display: none; }
		.suffix-button {
			all: unset;
			box-sizing: border-box;
			display: grid;
			place-items: center;
			inline-size: 2.5rem;
			block-size: 2.5rem;
			border-radius: 50%;
			color: var(--on-surface-variant);
			cursor: pointer;
			transition: background-color 150ms ease, transform 150ms ease;
		}
		.suffix-button:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
		.suffix-button:active { background: color-mix(in srgb, currentColor 12%, transparent); transform: scale(.92); }
		.suffix-button:focus-visible { outline: .125rem solid var(--primary); outline-offset: .125rem; }
		.suffix-button:disabled { opacity: .38; cursor: default; }
		.suffix-button moni-icon { --moni-icon-size: 1.5rem; }
		::slotted([slot='suffix']) { pointer-events: auto; }
		.field.suffix-action-field > input { padding-inline-end: 3.5rem; }
		.field.suffix-action-field > input:focus { padding-inline-end: 3.4375rem; }
	`];

	/**
	 * Renderiza el campo de texto con animación de etiqueta flotante, iconos iniciales/finales, y texto de ayuda.
	 *
	 * **Composición de `fieldClasses`:**
	 * - `field` — siempre presente; diseño base del campo.
	 * - `label` — habilita el comportamiento de la etiqueta flotante vía CSS.
	 * - `fill` / `border` — variantes filled y outlined; underlined no agrega ninguna.
	 * - `small` / `large` / `extra` — modificador de tamaño.
	 * - `prefix` — desplaza la etiqueta cuando hay un icono inicial (leading) presente.
	 * - `suffix` — reserva espacio final (trailing) para el icono/texto de sufijo.
	 * - `invalid` — aplica colores de error cuando `error=true` o falla la validación nativa.
	 *
	 * **Flotación de la etiqueta (Label float):**
	 * `isActive` es true cuando `value` no está vacío o se establece un `placeholder`.
	 * Los selectores CSS `.field.label input:focus ~ label`, `.field.label.active label`
	 * flotan la etiqueta a la parte superior del borde del campo. Este componente
	 * establece `isActive` para evitar que la etiqueta colapse cuando un valor está preestablecido.
	 *
	 * **Zonas inicial / final (Leading / trailing):**
	 * `hasLeading` y `hasTrailing` añaden condicionalmente las clases CSS `prefix`/`suffix`
	 * y renderizan el icono o los elementos de texto de prefijo/sufijo.
	 */
	override render() {
		const hasLeading = Boolean(this.icon) || Boolean(this.prefix);
		const hasTrailing =
			Boolean(this.trailingIcon) || Boolean(this.suffix) || Boolean(this.suffixButtonIcon) || this._hasSuffixSlot;
		const isActive = Boolean(this.value) || Boolean(this.placeholder);
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
			'suffix-action-field': Boolean(this.suffixButtonIcon) || this._hasSuffixSlot,
			invalid: this.error,
			round: this.shape === 'round' && this.variant !== 'underlined',
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
			: this.suffixButtonIcon
				? html`<span class="suffix-action" part="suffix-action">
						<button
							type="button"
							class="suffix-button"
							part="suffix-button"
							aria-label=${this.suffixButtonLabel}
							?disabled=${this.disabled}
							@click=${this._handleSuffixClick}
						><moni-icon name=${this.suffixButtonIcon}></moni-icon></button>
					</span>`
			: this.trailingIcon
				? html`<i class="trailing-icon" part="trailing-icon"
						><moni-icon name="${this.trailingIcon}"></moni-icon
					></i>`
				: this.suffix
					? html`<span class="trailing-icon" part="suffix"
							>${this.suffix}</span
						>`
					: nothing;

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<input
				id="input"
				part="input"
				type=${this.type}
				placeholder=${placeholder}
				?disabled=${this.disabled}
				?required=${this.required}
				?readonly=${this.readonly}
				autocomplete=${ifDefined(this.autocomplete || undefined)}
				inputmode=${ifDefined(this.inputmode || undefined)}
				maxlength=${ifDefined(this.maxlength ?? undefined)}
				minlength=${ifDefined(this.minlength ?? undefined)}
				min=${ifDefined(this.min || undefined)}
				max=${ifDefined(this.max || undefined)}
				step=${ifDefined(this.step || undefined)}
				pattern=${ifDefined(this.pattern || undefined)}
				.value=${this.value}
				name=${ifDefined(this.name || undefined)}
				class=${isActive ? 'active' : ''}
				@input=${this._handleInput}
				@change=${this._handleChange}
			/>
			${this.label
				? html`<label
						for="input"
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${trailing}
			<span class="suffix-action" part="suffix-action" ?hidden=${Boolean(this.suffixButtonIcon) || !this._hasSuffixSlot}>
				<slot name="suffix" @slotchange=${this._handleSuffixSlotChange}></slot>
			</span>
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
		'moni-text-field': MoniTextField;
	}
}

export default MoniTextField;
