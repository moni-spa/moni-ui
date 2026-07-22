/**
 * @file components/moni-fab.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Floating Action Button (FAB).
 *
 * Los FABs representan la acción principal, o más común, en una pantalla. Aparecen
 * frente a todo el contenido de la pantalla, típicamente como una forma circular con un icono en
 * su centro.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/floating-action-buttons/specs.md`
 *
 * **Actualizaciones y Deprecaciones de M3 Expressive (Mayo 2025):**
 * - `size="small"` **ya no es recomendado** por M3. Use `medium` (40dp o 56dp)
 *   o `large` (96dp). Deprecado en v0.3.1; se eliminará en v1.0.
 * - `shape="circle"` **no es parte de M3**. Los FABs M3 usan una forma `rounded` (redondeada) con un
 *   radio de esquina de 16dp (que se transforma a un radio `full` al pasar el cursor/enfocar).
 *   Deprecado en v0.3.1; se eliminará en v1.0.
 * - `color="surface"` **ya no es recomendado**. Use `primary`, `secondary`,
 *   o `tertiary` para asegurar un mapeo de color adecuado al tema M3.
 *
 * **FABs Extendidos:**
 * Cuando `extended` es true, el FAB muestra una etiqueta de texto junto al icono.
 * Los FABs extendidos son más anchos y se usan típicamente cuando la acción necesita texto explícito
 * para ser clara. El atributo `expanded` fuerza al FAB a su ancho extendido completo,
 * útil para animar entre los estados estándar y extendido al desplazarse.
 *
 * **Posicionamiento:**
 * El atributo `position` aplica un posicionamiento absoluto/fijo predefinido
 * (ej. `bottom-trailing`), encajando el FAB en las esquinas estándar de la pantalla.
 *
 * @example
 * ```html
 * <!-- FAB primario estándar -->
 * <moni-fab icon="edit"></moni-fab>
 *
 * <!-- FAB terciario extendido -->
 * <moni-fab color="tertiary" extended icon="add" label="Nueva tarea"></moni-fab>
 *
 * <!-- FAB posicionado -->
 * <moni-fab position="bottom-trailing" icon="navigation"></moni-fab>
 * ```
 *
 * @csspart button - El elemento `<button>` interno.
 * @csspart icon   - El contenedor para el icono.
 * @csspart label  - La etiqueta de texto (solo visible cuando está extendido).
 */
@customElement('moni-fab')
export class MoniFab extends MoniElement {
	private static _deprecationWarned = false;

	/**
	 * Define las dimensiones del FAB.
	 * `small` está deprecado en M3 Expressive.
	 * @type {'small' | 'medium' | 'large'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Mapeo de color semántico del FAB.
	 * `surface` está deprecado en M3.
	 * @type {'primary' | 'secondary' | 'tertiary' | 'surface'}
	 * @default 'primary'
	 */
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';

	/**
	 * Forma de las esquinas del FAB.
	 * `circle` está deprecado en M3 (los FABs deben ser cuadrados redondeados).
	 * @type {'rounded' | 'circle'}
	 * @default 'rounded'
	 */
	@property({ reflect: true })
	shape: 'rounded' | 'circle' = 'rounded';

	/**
	 * Alias heredado de `expanded`. Indica si el FAB muestra una etiqueta de texto.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) extended = false;

	/**
	 * Si es true, expande el FAB para mostrar su etiqueta de texto junto al icono.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) expanded = false;

	/**
	 * Deshabilita el FAB.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Nombre del icono (Material Symbols) mostrado dentro del FAB.
	 * @type {string}
	 * @default 'add'
	 */
	@property({ reflect: true }) icon = 'add';

	/**
	 * Etiqueta de texto mostrada cuando el FAB se expande/extiende.
	 * @type {string}
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Fija la posición del FAB relativa a los bordes de la pantalla.
	 * @type {'bottom-trailing' | 'bottom-leading' | 'top-trailing' | 'top-leading'}
	 * @default 'bottom-trailing'
	 */
	@property({ reflect: true })
	position:
		| 'bottom-trailing'
		| 'bottom-leading'
		| 'top-trailing'
		| 'top-leading' = 'bottom-trailing';

	override connectedCallback(): void {
		super.connectedCallback();
		if (MoniFab._deprecationWarned) return;
		const hasDeprecated = this.size === 'small'
			|| this.shape === 'circle'
			|| this.color === 'surface';
		if (hasDeprecated) {
			MoniFab._deprecationWarned = true;
			const reasons: string[] = [];
			if (this.size === 'small') reasons.push('size="small"');
			if (this.shape === 'circle') reasons.push('shape="circle"');
			if (this.color === 'surface') reasons.push('color="surface"');
			console.warn(
				`[moni-ui] <moni-fab> uses ${reasons.join(', ')}, deprecated since v0.3.1 per Material Design 3 Expressive (May 2025). See m3-docs/components/floating-action-button/overview.md § M3 Expressive update.`
			);
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-block;
				font-family: var(--font);
				position: relative;
			}

			:host([position]) {
				position: fixed;
				z-index: 13;
			}
			:host([position='bottom-trailing']) {
				inset: auto 1rem 1rem auto;
			}
			:host([position='bottom-leading']) {
				inset: auto auto 1rem 1rem;
			}
			:host([position='top-trailing']) {
				inset: 1rem 1rem auto auto;
			}
			:host([position='top-leading']) {
				inset: 1rem auto auto 1rem;
			}

			.button {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				block-size: 3.5rem;
				font-size: 1rem;
				font-weight: 500;
				color: var(--on-primary);
				/* Por defecto: sin relleno para que el icono se centre; el relleno se añade cuando existe etiqueta */
				padding: 0 1.5rem;
				background-color: var(--primary);
				border: 0.0625rem solid transparent;
				border-radius: 1rem;
				gap: 0.5rem;
				line-height: normal;
				font-family: inherit;
				cursor: pointer;
				box-shadow: var(--elevate2);
				transition:
					transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
					border-radius 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
					padding 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
					background-color 200ms ease,
					box-shadow 250ms ease;
				user-select: none;
				text-decoration: none;
			}

			.button:hover:not(:disabled) {
				transform: translateY(-0.125rem) scale(1.02);
				box-shadow: var(--elevate3);
			}

			.button:active:not(:disabled) {
				transform: translateY(0.0625rem) scale(0.97);
				box-shadow: var(--elevate1);
			}

			/* Cuando no hay etiqueta: solo icono, eliminar relleno horizontal para que el icono se centre */
			.button:not(:has(> .label:not(:empty))) {
				padding-inline: 0;
			}

			.button.small {
				block-size: 2.5rem;
				font-size: 0.875rem;
				padding: 0 1rem;
			}
			.button.large {
				block-size: 4rem;
				padding: 0 2rem;
			}

			.button.circle {
				padding: 0;
				inline-size: 3.5rem;
				aspect-ratio: 1;
				border-radius: 50%;
			}
			.button.circle.small {
				inline-size: 2.5rem;
			}
			.button.circle.large {
				inline-size: 4rem;
			}

			.button.rounded {
				border-radius: 1rem;
			}
			.button.rounded:is(:hover, :focus-visible) {
				border-radius: 2rem;
			}

			.button.secondary {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}
			.button.tertiary {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}
			.button.surface {
				background-color: var(--surface);
				color: var(--primary);
			}

			.button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
			}
			.button:focus-visible {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
				transform: translateY(-0.125rem) scale(1.02);
				box-shadow: var(--elevate3);
			}

			.icon,
			::slotted([slot='icon']) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: none;
				color: inherit;
			}

			/* La etiqueta siempre se renderiza pero la cadena vacía se oculta mediante overflow.
			   Cuando se establece la propiedad label, aparece. */
			.label {
				white-space: nowrap;
				max-inline-size: 16rem;
				overflow: hidden;
				transition: max-inline-size var(--speed3);
				font-size: 1rem;
				font-weight: 500;
			}
			.label:empty {
				display: none;
			}

			/* Forma circular: ocultar etiqueta completamente */
			:host([shape='circle']) .label,
			:host([shape='circle']) slot {
				display: none !important;
			}
			/* Círculo: eliminar relleno, hacerlo un círculo perfecto */
			:host([shape='circle']) .button {
				padding: 0 !important;
			}
		`
	];

	/**
	 * Renderiza el botón FAB con su icono, etiqueta extendida opcional, y estado de carga.
	 *
	 * **Composición de clases:**
	 * - `'fab'` — estilos base del FAB (redondo, 56dp, elevado).
	 * - `this.size` (`'small'` = 40dp, `'large'` = 96dp, por defecto = 56dp).
	 * - `this.variant` — esquema de color (`'primary'`, `'secondary'`, `'tertiary'`, `'surface'`).
	 * - `'extended'` — se añade cuando se establece `label`; ensancha el FAB en forma de píldora
	 *   y revela el texto de la etiqueta con una transición CSS `max-width`.
	 *
	 * **Estado de carga:**
	 * Cuando `loading=true`, un spinner `<moni-progress>` reemplaza el icono. La etiqueta
	 * permanece visible para mantener el ancho del FAB extendido y prevenir saltos de diseño.
	 */
	override render() {
		const classes = [
			'button',
			this.size,
			this.shape,
			this.color === 'primary' ? '' : this.color
		]
			.filter(Boolean)
			.join(' ');

		return html`<button
			class=${classes}
			part="fab"
			type="button"
			?disabled=${this.disabled}
		>
			${this.icon
				? html`<span part="icon" class="icon"
						><moni-icon name="${this.icon}"></moni-icon
					></span>`
				: nothing}
			<span class="label" part="label">${this.label}</span>
			<slot></slot>
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-fab': MoniFab;
	}
}

export default MoniFab;
