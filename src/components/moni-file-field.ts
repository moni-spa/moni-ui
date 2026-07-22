/**
 * @file components/moni-file-field.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 File Field (Campo de Archivo).
 *
 * Un componente de campo especializado que proporciona una alternativa estilizada y accesible
 * al `<input type="file">` nativo. Envuelve un input de archivo nativo dentro de
 * la carcasa `.field` de M3 y presenta un input de texto de solo lectura que muestra los
 * nombres de archivo(s) seleccionado(s) junto a un botón de acción "Seleccionar archivo" estilizado.
 *
 * **Arquitectura visual:**
 * El componente aprovecha los patrones CSS `fieldStyles`. La estructura interna del DOM
 * está ordenada específicamente como:
 * `[text input] -> [label] -> [file input] -> [output]`
 * Este ordenamiento específico asegura que el selector CSS de hermano adyacente
 * (`input + label`) pueda flotar correctamente la etiqueta cuando el campo está poblado,
 * a pesar de que el campo visible sea realmente el input de texto de solo lectura.
 *
 * **Gestión del estado:**
 * Cuando el usuario selecciona archivos a través del input de archivo oculto, el componente escucha
 * el evento nativo `change`, lee `input.files`, y actualiza el input de texto
 * de solo lectura con una lista separada por comas de los nombres de archivo. La propiedad `value`
 * se mantiene sincronizada, y se re-despacha un evento compuesto `'change'`.
 *
 * @fires change - Burbujea y está compuesto. Se dispara cuando se seleccionan o borran
 *                 archivos. El consumidor puede leer la lista de `files` del input interno
 *                 consultando el componente.
 *
 * @example
 * ```html
 * <!-- Carga de un solo archivo -->
 * <moni-file-field
 *   label="Foto de perfil"
 *   name="avatar"
 *   accept="image/png, image/jpeg"
 *   button-label="Explorar..."
 * ></moni-file-field>
 *
 * <!-- Carga de múltiples archivos con estado de error -->
 * <moni-file-field
 *   label="Documentos"
 *   multiple
 *   error
 *   error-text="Los archivos superan el límite de tamaño máximo"
 * ></moni-file-field>
 * ```
 *
 * @csspart field       - El contenedor div exterior `.field`.
 * @csspart input-text  - El `<input type="text">` de solo lectura visible.
 * @csspart label       - El elemento `<label>` flotante.
 * @csspart input-file  - El `<input type="file">` nativo oculto.
 * @csspart button      - El elemento de botón (estilizado vía CSS `::file-selector-button`).
 */
@customElement('moni-file-field')
export class MoniFileField extends MoniElement {
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
	 * El atributo `accept` para el input de archivo (ej. `image/*, .pdf`).
	 * @type {string}
	 */
	@property({ reflect: true }) accept = '';

	/**
	 * Permite seleccionar múltiples archivos si es true.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) multiple = false;

	/**
	 * Texto para el botón de selección de archivo.
	 * @type {string}
	 * @default 'Choose file'
	 */
	@property({ reflect: true, attribute: 'button-label' })
	buttonLabel = 'Choose file';

	/**
	 * Deshabilita el campo de archivo.
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
	 * La representación en cadena de los archivos seleccionados (solo lectura para el usuario).
	 * @type {string}
	 */
	@property({ reflect: true }) value = '';

	/**
	 * Nombre del icono inicial (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true }) icon = '';

	/**
	 * Nombre del icono final (Material Symbols).
	 * @type {string}
	 * @default 'folder_open'
	 */
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon =
		'folder_open';

	@query('input[type="file"]') private _fileInput!: HTMLInputElement;

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Transfiere de manera imperativa el estado de discapacidad (disabled) de Lit
	 * hacia el nodo `<input type="file">` invisible en el Shadow DOM, asegurando
	 * que el componente nativo reaccione adecuadamente a nivel navegador.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._fileInput) {
			if (changed.has('disabled'))
				this._fileInput.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		fieldStyles,
		css`
			input[type='file'] {
				position: absolute;
				inset: 0;
				opacity: 0;
				z-index: 2;
				cursor: pointer;
			}
			input[type='text'] {
				cursor: pointer;
			}
		`
	];

	/**
	 * Renderiza el campo de archivo como un `<input type="file">` oculto + una zona de soltar visible.
	 *
	 * El `<input type="file">` está oculto (pero no con `display: none`) para
	 * aprovechar el selector de archivos nativo del navegador. Al hacer clic en la zona de soltar visible
	 * se invoca programáticamente `_input.click()` para abrir el diálogo de archivo.
	 *
	 * **Arrastrar y soltar (Drag-and-drop):**
	 * `@dragover` / `@dragleave` / `@drop` en el contenedor de la zona de soltar gestionan
	 * el estado `dragging` que aplica una clase de resaltado CSS.
	 *
	 * **Visualización del nombre del archivo:**
	 * `_fileName` (derivado del `.name` del último archivo seleccionado) se muestra
	 * como una cadena de una sola línea truncada. Cuando no hay ningún archivo seleccionado,
	 * se muestra en su lugar el atributo `label` o un marcador de posición genérico.
	 */
	override render() {
		const isActive = Boolean(this.value);
		const hasLeading = Boolean(this.icon);
		const hasTrailing = Boolean(this.trailingIcon);
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

		const leading = this.icon
			? html`<i class="leading-icon" part="leading-icon"
					><moni-icon name="${this.icon}"></moni-icon
				></i>`
			: nothing;

		const trailing = this.trailingIcon
			? html`<i class="trailing-icon" part="trailing-icon"
					><moni-icon name="${this.trailingIcon}"></moni-icon
				></i>`
			: nothing;

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<input
				type="text"
				part="display"
				readonly
				placeholder=${this.buttonLabel}
				.value=${this.value}
				?disabled=${this.disabled}
				name=${ifDefined(this.name ? `${this.name}-display` : undefined)}
				class=${isActive ? 'active' : ''}
			/>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			<input
				type="file"
				part="file"
				?disabled=${this.disabled}
				accept=${ifDefined(this.accept || undefined)}
				?multiple=${this.multiple}
				name=${ifDefined(this.name || undefined)}
			/>
			${trailing}
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
		'moni-file-field': MoniFileField;
	}
}

export default MoniFileField;
