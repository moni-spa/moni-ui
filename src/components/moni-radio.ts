/**
 * @file components/moni-radio.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Radio Button (Botón de Opción).
 *
 * Los botones de opción permiten a los usuarios seleccionar exactamente un elemento de un conjunto de opciones
 * mutuamente excluyentes. Comparten la misma arquitectura visual que
 * `<moni-checkbox>` pero usan `type="radio"` e implementan la deselección de grupo.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/radio/specs.md`
 *
 * **Arquitectura visual (Patrón BeerCSS):**
 * Idéntico al patrón de checkbox: el `<input type="radio">` nativo ocupa
 * espacio de diseño real a `--_size` × `--_size` pero se oculta mediante `opacity: 0`.
 * Un `<span>` hermano renderiza:
 * - `::before` — el icono de radio (`radio_button_unchecked` / `radio_button_checked`).
 * - `::after`  — el anillo de onda (ripple) de hover/foco.
 *
 * **Deselección de grupo:**
 * Cuando se marca un radio, `_onChange` consulta el `getRootNode()` del componente
 * para encontrar todos los elementos `moni-radio` que comparten el mismo atributo `name` y establece
 * su propiedad `checked` en `false`. Esto refleja el comportamiento nativo del navegador
 * para grupos de radio a través de los límites del shadow DOM, donde la agrupación por `name` no
 * funciona de forma nativa.
 *
 * @fires change - Burbujea y está compuesto. Se dispara cuando este radio es seleccionado.
 *                 Lee `element.checked` para obtener el nuevo estado.
 *
 * @example
 * ```html
 * <moni-radio name="color" value="red"   label="Rojo"></moni-radio>
 * <moni-radio name="color" value="green" label="Verde"></moni-radio>
 * <moni-radio name="color" value="blue"  label="Azul" checked></moni-radio>
 * ```
 *
 * @csspart radio - El elemento `<label>` exterior.
 */
@customElement('moni-radio')
export class MoniRadio extends MoniElement {
	static formAssociated = true;
	private _internals: ElementInternals;

	constructor() {
		super();
		this._internals = this.attachInternals();
	}

	/**
	 * Etiqueta de texto mostrada a la derecha del icono de radio.
	 *
	 * Cuando no está vacía, se renderiza como un nodo de texto. Cuando está vacía, se renderiza la ranura (slot)
	 * por defecto, permitiendo contenido HTML en la ranura como etiqueta.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Indica si este botón de opción está actualmente seleccionado.
	 *
	 * Se refleja como un atributo para que los selectores CSS puedan apuntarlo. Se sincroniza con
	 * el input nativo a través de `updated()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) checked = false;

	/**
	 * Cuando es `true`, el radio no es interactivo y se renderiza a un 50% de opacidad.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/** Material Symbol mostrado cuando el radio no está seleccionado. */
	@property({ reflect: true, attribute: 'unchecked-icon' }) uncheckedIcon = '';

	/** Material Symbol mostrado cuando el radio está seleccionado. */
	@property({ reflect: true, attribute: 'checked-icon' }) checkedIcon = '';

	/** Contenedor visual de los iconos personalizados. */
	@property({ reflect: true, attribute: 'icon-container' })
	iconContainer: 'circle' | 'none' = 'circle';

	/**
	 * Tamaño visual del icono de radio y su área de interacción (hit area) invisible.
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
	 * Nombre del grupo de radio. Los radios con el mismo `name` en el mismo nodo raíz
	 * se tratan como un grupo de exclusión mutua por `_onChange`.
	 *
	 * Nota: Los grupos nativos de `<input type="radio">` solo funcionan dentro de la misma
	 * raíz de documento. Dado que `moni-radio` usa shadow DOM, la deselección
	 * de los hermanos se maneja imperativamente en `_onChange`.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Se retransmite al atributo nativo `<input value>`.
	 * El valor enviado en un formulario cuando este radio es seleccionado.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/** Referencia directa al elemento input nativo para acceso programático. */
	@query('input') private _input!: HTMLInputElement;

	/**
	 * Sincroniza `checked` y `disabled` con el input nativo después de cada ciclo de renderizado.
	 *
	 * @param changed - Mapa de los nombres de propiedades modificadas con sus valores anteriores.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('checked')) {
				this._input.checked = this.checked;
				this._internals?.setFormValue?.(this.checked ? (this.value || 'on') : null);
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

			/* BeerCSS .radio */
			label {
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
			}

			/* BeerCSS: input has real size, opacity 0 */
			input {
				inline-size: var(--_size);
				block-size: var(--_size);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* BeerCSS: span wraps visible indicator + label */
			span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* Indicador visual del radio, superpuesto al input nativo. */
			span > i {
				--_size: inherit;
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

			/* Checked: selected radio icon */
			input:checked + span > i {
				color: var(--primary);
			}

			/* Los iconos personalizados viven dentro del círculo del radio. */
			span.custom-icons > i {
				inline-size: calc(var(--_size) * 0.75);
				block-size: calc(var(--_size) * 0.75);
				inset-inline-start: calc(var(--_size) * -0.875);
				border: 0.125rem solid var(--on-surface-variant);
				border-radius: 50%;
				font-size: calc(var(--_size) * 0.55);
				font-variation-settings: 'wght' 600;
				transition: background-color var(--speed1), border-color var(--speed1), color var(--speed1);
			}

			input:checked + span.custom-icons > i {
				border-color: var(--primary);
				background-color: var(--primary);
				color: var(--on-primary);
			}

			/* Variante de icono libre, sin círculo exterior. */
			span.custom-icons.no-icon-container > i {
				border-color: transparent;
				background-color: transparent;
				color: var(--on-surface-variant);
			}

			input:checked + span.custom-icons.no-icon-container > i {
				border-color: transparent;
				background-color: transparent;
				color: var(--primary);
			}

			/* BeerCSS: span::after = hover ripple */
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

			/* Label padding */
			span.has-label {
				padding-inline-start: 0.25rem;
			}

			span.has-label.no-icon-container {
				padding-inline-start: 0;
			}

			/* Disabled */
			input:disabled + span {
				opacity: 0.5;
				cursor: not-allowed;
			}

			/* Focus ring */
			input:focus-visible + span > i {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.375rem;
			}
		`
	];

	/**
	 * Maneja el evento nativo `change` del input.
	 *
	 * Al seleccionarse, deselecciona todos los elementos `moni-radio` hermanos con el mismo
	 * `name` en el mismo nodo raíz (documento o raíz shadow). Esto es necesario
	 * porque la exclusión de grupo de radio nativa solo funciona dentro de la misma raíz
	 * de documento y no cruza los límites del shadow DOM.
	 *
	 * Después de la deselección, despacha un evento `'change'` compuesto para que sea
	 * audible para los elementos padres en el DOM ligero (light DOM).
	 *
	 * @param e - El evento nativo `change` del `<input>` oculto.
	 */
	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		if (this.checked && this.name) {
			const root = this.getRootNode() as Document | ShadowRoot;
			if (root) {
				const siblings = root.querySelectorAll(`moni-radio[name="${this.name}"]`);
				siblings.forEach((sibling) => {
					if (sibling !== this && sibling instanceof MoniRadio) {
						sibling.checked = false;
					}
				});
			}
		}
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	/**
	 * Renderiza el radio como un `<input type="radio">` oculto + indicador visual `<span>`.
	 *
	 * El input oculto se mantiene en el DOM (opacity: 0) para participar en el envío nativo
	 * de formularios y exclusión de grupo de radios. Los navegadores aplican automáticamente
	 * exclusión mutua entre entradas de radio que comparten el mismo atributo `name`.
	 * El círculo visual es dibujado por los pseudo-elementos `::before` / `::after` en
	 * el `<span>` y animado mediante transiciones CSS de `scale`.
	 */
	override render() {
		const hasCustomIcons = Boolean(this.uncheckedIcon || this.checkedIcon);
		const uncheckedIcon = hasCustomIcons ? this.uncheckedIcon : 'radio_button_unchecked';
		const checkedIcon = hasCustomIcons ? this.checkedIcon : 'radio_button_checked';
		const currentIcon = this.checked ? checkedIcon : uncheckedIcon;
		const indicatorClasses = [
			this.label ? 'has-label' : '',
			hasCustomIcons ? 'custom-icons' : '',
			hasCustomIcons && this.iconContainer === 'none' ? 'no-icon-container' : ''
		].filter(Boolean).join(' ');

		return html`<label part="radio">
			<input
				type="radio"
				.checked=${live(this.checked)}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				value=${ifDefined(this.value || undefined)}
				@change=${this._onChange}
			/>
			<span class=${indicatorClasses}>
				<i aria-hidden="true">${currentIcon}</i>
				${this.label
					? html`${this.label}`
					: html`<slot></slot>`}
			</span>
		</label>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-radio': MoniRadio;
	}
}

export default MoniRadio;
