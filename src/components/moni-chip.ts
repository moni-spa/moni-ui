/**
 * @file components/moni-chip.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Componente Material Design 3 Chip.
 *
 * Los chips (fichas) son elementos compactos e interactivos que representan acciones, filtros,
 * atributos o entradas de usuario. Son contenedores solo visuales — el consumidor
 * es dueño de todo el manejo del estado (selección, eliminación, estado de filtro activo).
 *
 * **Referencia de la especificación M3:** `m3-docs/components/chips/specs.md`
 *
 * **Variantes:**
 * - `assist` (por defecto) — Acciones inteligentes o sugeridas. Usa borde `var(--outline)`
 *   para asegurar un contraste de 3:1 según la especificación de accesibilidad de M3. Alias: `outlined`.
 * - `filter` — Filtros para una colección de contenido. Muestra una marca de verificación al principio cuando
 *   está `selected`. Alias: `fill`.
 * - `input` — Representa una entrada de usuario discreta (etiquetas, tokens). Añade un icono de
 *   eliminación al final cuando es `removable`.
 * - `suggestion` — Sugerencias generadas por el producto. Con contorno, sin iconos.
 *
 * **Medidas M3:**
 * - Altura por defecto: 32dp (tamaño `small` = línea base de la especificación M3).
 * - Radio de esquina: 8dp.
 * - Tamaño de icono: 18dp.
 * - Los tamaños `medium` y `large` son extensiones de Moni con áreas táctiles más grandes.
 *
 * **Accesibilidad:**
 * Los chips `assist` y `suggestion` usan `var(--outline)` para su trazo para
 * garantizar un contraste de 3:1 contra el fondo de la superficie en reposo.
 * `filter` e `input` usan `outline-variant` en reposo pero logran contraste
 * a través del relleno `secondary-container` cuando se seleccionan.
 *
 * @fires remove - Burbujea y está compuesto. Se dispara cuando el icono de eliminación
 *                 final se hace clic en un chip `input` con `removable`.
 *
 * @example
 * ```html
 * <!-- Chip de filtro con estado seleccionado -->
 * <moni-chip variant="filter" selected>Technology</moni-chip>
 *
 * <!-- Chip de entrada (etiqueta/token) -->
 * <moni-chip variant="input" removable icon="label">TypeScript</moni-chip>
 *
 * <!-- Chip de asistencia con icono -->
 * <moni-chip icon="directions_car">Get directions</moni-chip>
 * ```
 *
 * @slot default   - El texto de la etiqueta del chip.
 * @slot icon      - Anula el icono inicial (alternativa al atributo `icon`).
 *
 * @csspart chip   - El elemento interno `<button>`.
 * @csspart label  - El elemento `<span>` de la etiqueta.
 */
@customElement('moni-chip')
export class MoniChip extends MoniElement {
	/**
	 * Variante visual del chip.
	 * @type {'assist' | 'filter' | 'input' | 'suggestion' | 'outlined' | 'fill'}
	 * @default 'assist'
	 */
	@property({ reflect: true })
	variant:
		| 'assist'
		| 'filter'
		| 'input'
		| 'suggestion'
		| 'outlined'
		| 'fill' = 'assist';

	/**
	 * Define las dimensiones del chip.
	 * @type {'small' | 'medium' | 'large'}
	 * @default 'small'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'small';

	/**
	 * Forma del radio del borde del chip.
	 * @type {'round' | 'no-round' | 'square' | 'circle' | 'left-round' | 'right-round' | 'top-round' | 'bottom-round'}
	 * @default 'round'
	 */
	@property({ reflect: true })
	shape:
		| 'round'
		| 'no-round'
		| 'square'
		| 'circle'
		| 'left-round'
		| 'right-round'
		| 'top-round'
		| 'bottom-round' = 'round';

	/**
	 * Si es true, marca el chip como seleccionado (útil para chips de filtro).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) selected = false;

	/**
	 * Si es true, muestra un icono de cierre al final para permitir la eliminación.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) removable = false;

	/**
	 * Deshabilita el chip.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Si es true, muestra un indicador de carga dentro del chip.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) loading = false;

	/**
	 * Nombre del icono inicial (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true }) icon = '';

	@state()
	private _hasSlottedIcon = false;

	/**
	 * Manejador del slot interno de icono (Slot Change).
	 * Determina si el desarrollador proporcionó un icono dinámicamente vía Light DOM
	 * (`<moni-icon slot="icon">`), permitiendo que el componente ajuste 
	 * sus márgenes internos (`padding`) y espaciados dinámicamente.
	 */
	private _handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		this._hasSlottedIcon = slot.assignedNodes({ flatten: true }).length > 0;
	}

	/**
	 * Manejador de clics en el icono de remover.
	 * Detiene la propagación para no disparar el clic del chip y emite un evento custom 'remove'.
	 */
	private _handleRemoveClick(e: Event) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }));
	}

	/** Normaliza los nombres de variantes heredadas a la especificación M3. */
	private get _variant(): 'assist' | 'filter' | 'input' | 'suggestion' {
		if (this.variant === 'outlined') return 'assist';
		if (this.variant === 'fill') return 'filter';
		return this.variant as 'assist' | 'filter' | 'input' | 'suggestion';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				vertical-align: middle;
				font-family: var(--font);
				position: relative;
				user-select: none;
			}

			.chip {
				--_padding: 1rem; /* 16dp when no leading icon (M3 spec) */
				--_size: 2rem;
				--_round: calc(var(--_size) / 2);
				--_icon-size: 1.125rem;
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				block-size: var(--_size);
				min-inline-size: var(--_size);
				font-size: 0.875rem;
				font-weight: 500;
				background-color: transparent;
				border: 0.0625rem solid var(--outline);
				color: var(--on-surface);
				padding: 0 var(--_padding);
				border-radius: 0.5rem;
				transition:
					transform var(--speed2),
					background-color var(--speed2),
					border-color var(--speed2),
					border-radius var(--speed2),
					padding var(--speed3);
				user-select: none;
				gap: 0.5rem;
				line-height: normal;
				letter-spacing: normal;
				font-family: inherit;
				cursor: pointer;
				position: relative;
				overflow: hidden;
			}

			.chip::after {
				content: '';
				position: absolute;
				inset: 0;
				background: currentColor;
				opacity: 0;
				transition: opacity var(--speed2);
				border-radius: inherit;
				pointer-events: none;
			}

			.chip.has-icon {
				--_padding: 0.5rem; /* 8dp when a leading icon is present (M3 spec) */
			}

			.chip.medium {
				--_size: 2.5rem;
				--_padding: 0.75rem;
				--_icon-size: 1.25rem;
			}
			.chip.medium.has-icon {
				--_padding: 0.75rem;
			}
			.chip.large {
				--_padding: 1rem;
				--_size: 3rem;
				--_icon-size: 1.5rem;
			}

			.chip:hover:not(:disabled)::after {
				opacity: 0.08;
			}

			.chip:active:not(:disabled) {
				transform: scale(0.97);
			}

			/* ─── M3 variant colors ─── */
			/* Filter and input chips use outline-variant + on-surface-variant
			   for the resting state (M3 spec). Assist and suggestion use
			   outline + on-surface for 3:1 contrast (a11y). */
			.chip.filter,
			.chip.input {
				border-color: var(--outline-variant);
				color: var(--on-surface-variant);
			}

			.chip.suggestion {
				border-color: var(--outline);
				color: var(--on-surface-variant);
			}

			/* Selected state — M3 filter/input show a leading check and
			   secondary-container background. */
			.chip.selected {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
				border-color: transparent;
			}

			/* Filter without selection can have leading check on hover to
			   indicate the action. */
			.chip.filter.selected::before,
			.chip.input.selected::before {
				content: '\\e5ca';
				font-family: var(--font-icon);
				font-size: var(--_icon-size);
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				margin-inline-end: 0.25rem;
				color: currentColor;
			}

			.chip.no-round {
				border-radius: 0;
			}
			.chip.square {
				border-radius: 0.25rem;
			}
			.chip.circle {
				inline-size: var(--_size);
				padding: 0;
				aspect-ratio: 1;
				border-radius: 50%;
			}
			.chip.left-round {
				border-radius: var(--_round) 0 0 var(--_round) !important;
			}
			.chip.right-round {
				border-radius: 0 var(--_round) var(--_round) 0 !important;
			}
			.chip.top-round {
				border-radius: var(--_round) var(--_round) 0 0 !important;
			}
			.chip.bottom-round {
				border-radius: 0 0 var(--_round) var(--_round) !important;
			}

			.chip:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
			}

			.chip:focus-visible {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
			}

			.icon,
			::slotted([slot='icon']) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: var(--_icon-size);
				flex: none;
				color: inherit;
			}

			.remove {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: var(--_icon-size);
				opacity: 0.7;
				margin-inline-start: 0.125rem;
			}

			.loading-spinner {
				inline-size: var(--_icon-size);
				block-size: var(--_icon-size);
				color: currentColor;
			}
			.loading-spinner::part(progress) {
				border-width: 0.1875rem;
			}
		`
	];

	/**
	 * Renderiza el elemento `<button>` del chip con su lista de clases calculada.
	 *
	 * **Normalización de variantes:**
	 * `_variant` mapea nombres de alias heredados (`'outlined'` → `'assist'`, `'fill'` → `'filter'`)
	 * a nombres de variantes canónicas de M3 antes de inyectarlos como clases CSS.
	 *
	 * **Ruta rápida de carga:**
	 * Cuando `loading=true`, se devuelve temprano un botón mínimo con solo un indicador de carga
	 * (sin slot de icono, sin etiqueta, sin botón de eliminación) con `aria-busy="true"`.
	 *
	 * **Lógica del botón de eliminación:**
	 * `showRemove` es `true` cuando:
	 * - `variant='input'` (Especificación M3: los chips de entrada siempre tienen un icono de cierre al final), o
	 * - `removable=true` se establece explícitamente.
	 *
	 * **Resolución de icono:**
	 * Si se establece el atributo `icon`, se renderiza un `<moni-icon>`. De lo contrario, se usa el
	 * slot nombrado `icon`, con `_hasSlottedIcon` rastreando si se proyectó contenido en el slot
	 * (usado para añadir condicionalmente los ajustes de relleno `has-icon`).
	 */
	override render() {
		const variant = this._variant;
		const hasIcon = Boolean(this.icon) || this._hasSlottedIcon;
		const classes = [
			'chip',
			variant,
			this.size,
			this.shape,
			this.selected ? 'selected' : '',
			hasIcon ? 'has-icon' : ''
		]
			.filter(Boolean)
			.join(' ');

		if (this.loading) {
			return html`<button
				class=${classes}
				part="chip"
				type="button"
				?disabled=${this.disabled}
				aria-busy="true"
			>
				<moni-progress
					class="loading-spinner"
					part="loading"
					variant="circular"
					indeterminate
					size="small"
				></moni-progress>
			</button>`;
		}

		// M3 input chips must always show a trailing remove icon.
		const showRemove = this.removable || variant === 'input';

		const iconEl = this.icon
			? html`<span class="icon" part="icon"
					><moni-icon name="${this.icon}"></moni-icon
				></span>`
			: html`<slot
					name="icon"
					part="icon"
					class="icon"
					@slotchange=${this._handleSlotChange}
				></slot>`;

		const removeEl = showRemove
			? html`<span class="remove" part="remove" aria-hidden="true" @click=${this._handleRemoveClick}
					><moni-icon name="close"></moni-icon
				></span>`
			: nothing;

		return html`<button
			class=${classes}
			part="chip"
			type="button"
			?disabled=${this.disabled}
		>
			${iconEl}
			<span part="label"><slot></slot></span>
			${removeEl}
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-chip': MoniChip;
	}
}

export default MoniChip;
