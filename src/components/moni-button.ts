/**
 * @file components/moni-button.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Componente Material Design 3 Button.
 *
 * Los botones permiten a los usuarios realizar acciones y hacer elecciones con un solo toque.
 * Este componente proporciona todas las variantes de botones de M3, tamaños y capacidades
 * de transformación de formas (ej. cambiar a una forma de píldora al presionar o alternar).
 *
 * **Referencia de la especificación M3:** `m3-docs/components/buttons/specs.md`
 *
 * **Variantes:**
 * - `filled` (por defecto) — Énfasis alto. Úsalo para acciones principales.
 * - `tonal` — Énfasis medio. Acciones secundarias que aún necesitan destacar.
 * - `elevated` — Énfasis medio con sombra. Úsalo al sentarse sobre fondos con patrones.
 * - `outlined` — Énfasis medio, sin relleno. Acciones secundarias o terciarias.
 * - `text` — Énfasis bajo. Acciones terciarias (ej. botón de cancelar diálogo).
 *
 * **Transformación de forma (Característica M3 Expressive):**
 * - Al presionar (estado activo): Los botones redondos y cuadrados se transforman a una forma
 *   "presionada" ligeramente más cuadrada con radios de esquina específicos de M3 (ej. XS/S 8dp, M 12dp).
 * - Al alternar (atributo `active`): La forma de reposo se invierte (ej. redondo ↔ cuadrado).
 *
 * **Renderizando como un enlace:**
 * Cuando se proporciona el atributo `href`, el componente se renderiza internamente como
 * un elemento `<a>` en lugar de un `<button>`, permitiendo enrutamiento nativo y comportamientos
 * de clic central (abrir en nueva pestaña) mientras mantiene los visuales del botón.
 *
 * @example
 * ```html
 * <!-- Botón primario relleno -->
 * <moni-button icon="add">Crear nuevo</moni-button>
 *
 * <!-- Botón contorneado -->
 * <moni-button variant="outlined">Cancelar</moni-button>
 *
 * <!-- Botón de alternar (alterna estado activo al hacer clic) -->
 * <moni-button icon="favorite" active>Me gusta</moni-button>
 *
 * <!-- Botón enlace -->
 * <moni-button href="/settings" icon="settings">Ajustes</moni-button>
 * ```
 *
 * @slot default       - El texto de la etiqueta del botón.
 * @slot icon          - Sobrescritura opcional para el icono inicial (leading).
 * @slot icon-trailing - Sobrescritura opcional para el icono final (trailing).
 *
 * @csspart button     - El elemento interno `<button>` o `<a>`.
 * @csspart icon       - El contenedor del icono inicial.
 * @csspart label      - El contenedor de la etiqueta.
 * @csspart trailing-icon - El contenedor del icono final.
 */
@customElement('moni-button')
export class MoniButton extends MoniElement {
	private static _deprecationWarned = false;

	/**
	 * Variante visual del botón.
	 * @type {'filled' | 'tonal' | 'outlined' | 'text' | 'fill' | 'elevated'}
	 * @default 'filled'
	 */
	@property({ reflect: true })
	variant:
		| 'filled'
		| 'tonal'
		| 'outlined'
		| 'text'
		| 'fill'
		| 'elevated'
		| 'error' = 'filled';

	/**
	 * Tamaños de M3 Expressive: xsmall, small, medium, large, xlarge.
	 * `extra` es un alias heredado de Moni para `xlarge`, obsoleto en v0.3.1; se
	 * eliminará en v1.0. Ver `m3-docs/components/buttons/overview.md` § Sizes.
	 * @type {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	/**
	 * Forma de las esquinas del botón.
	 * @type {'round' | 'no-round' | 'square' | 'circle' | 'left-round' | 'right-round' | 'top-round' | 'bottom-round' | 'left-round-flat' | 'right-round-flat' | 'top-round-flat' | 'bottom-round-flat' | 'inner-round'}
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
		| 'bottom-round'
		| 'left-round-flat'
		| 'right-round-flat'
		| 'top-round-flat'
		| 'bottom-round-flat'
		| 'inner-round' = 'round';

	/**
	 * Deshabilita el botón.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Si es verdadero, muestra un indicador de carga y deshabilita el botón.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) loading = false;

	/**
	 * Si es verdadero, establece el botón a un estado activo/seleccionado.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Nombre del icono inicial (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true }) icon = '';

	/**
	 * Nombre del icono final (Material Symbols).
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'icon-trailing' }) iconTrailing = '';

	/**
	 * Tipo nativo del botón (cuando se renderiza como un `<button>`).
	 * @type {'button' | 'submit' | 'reset'}
	 * @default 'button'
	 */
	@property({ reflect: true })
	type: 'button' | 'submit' | 'reset' = 'button';

	/**
	 * Si está establecido, renderiza el botón como un elemento `<a>` con esta URL.
	 * @type {string}
	 */
	@property({ reflect: true }) href = '';

	/**
	 * Atributo target para los botones tipo enlace.
	 * @type {string}
	 */
	@property({ reflect: true }) target = '';

	override connectedCallback(): void {
		super.connectedCallback();
		if (MoniButton._deprecationWarned) return;
		if (this.size === 'extra') {
			MoniButton._deprecationWarned = true;
			console.warn(
				'[moni-ui] <moni-button size="extra"> is deprecated since v0.3.1. ' +
					'Material Design 3 Expressive uses "xlarge". ' +
					'See m3-docs/components/buttons/overview.md § Sizes.'
			);
		}
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

			.button {
				box-sizing: content-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				block-size: 2.5rem;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-primary);
				padding: 0 1rem;
				background-color: var(--primary);
				border: 0.0625rem solid transparent;
				border-radius: 1.25rem;
				transition:
					transform 250ms cubic-bezier(0.2, 0, 0, 1),
					border-radius 200ms cubic-bezier(0.2, 0, 0, 1),
					padding 250ms cubic-bezier(0.2, 0, 0, 1),
					background-color 200ms cubic-bezier(0.2, 0, 0, 1),
					box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
				user-select: none;
				gap: 0.5rem;
				line-height: normal;
				font-family: inherit;
				cursor: pointer;
				text-decoration: none;
				box-shadow: none;
				position: relative;
			}

			.button::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				min-width: 3rem; /* 48px minimum touch target */
				min-height: 3rem; /* 48px minimum touch target */
				width: 100%;
				height: 100%;
				transform: translate(-50%, -50%);
			}

			/* Sizes */
			.button.xsmall {
				block-size: 1.75rem;
				min-inline-size: 3rem; /* 48px */
				font-size: 0.75rem;
				padding: 0 0.75rem; /* 12dp; keeps 48dp touch target */
			}
			.button.small {
				block-size: 2rem;
				min-inline-size: 3rem; /* 48px */
				padding: 0 1rem; /* 16dp per M3 Expressive */
			}
			.button.large {
				block-size: 3rem;
				padding: 0 1.25rem;
			}
			.button.xlarge,
			.button.extra {
				block-size: 3.5rem;
				font-size: 1rem;
				padding: 0 1.5rem;
			}

			/* Shapes */
			/* Square keeps horizontal padding (like a normal button) but
			   drops border-radius. Only the circle removes all padding. */
			.button.circle {
				padding: 0 !important;
				border-radius: 50%;
				inline-size: 2.5rem;
				aspect-ratio: 1;
			}
			.button.no-round {
				border-radius: 0;
			}
			.button.square {
				border-radius: 1rem;
			}
			.button.square.xsmall,
			.button.square.small {
				border-radius: 0.75rem;
			}
			.button.square.large,
			.button.square.xlarge,
			.button.square.extra {
				border-radius: 1.75rem;
			}
			.button.circle.small {
				inline-size: 2rem;
			}
			.button.circle.large {
				inline-size: 3rem;
			}
			.button.circle.extra {
				inline-size: 3.5rem;
			}
			.button.left-round {
				border-radius: 1.25rem 0.5rem 0.5rem 1.25rem;
			}
			.button.left-round.xsmall {
				border-radius: 0.875rem 0.25rem 0.25rem 0.875rem;
			}
			.button.left-round.small {
				border-radius: 1rem 0.5rem 0.5rem 1rem;
			}
			.button.left-round.large {
				border-radius: 1.5rem 1rem 1rem 1.5rem;
			}
			.button.left-round.xlarge,
			.button.left-round.extra {
				border-radius: 1.75rem 1.25rem 1.25rem 1.75rem;
			}

			.button.right-round {
				border-radius: 0.5rem 1.25rem 1.25rem 0.5rem;
			}
			.button.right-round.xsmall {
				border-radius: 0.25rem 0.875rem 0.875rem 0.25rem;
			}
			.button.right-round.small {
				border-radius: 0.5rem 1rem 1rem 0.5rem;
			}
			.button.right-round.large {
				border-radius: 1rem 1.5rem 1.5rem 1rem;
			}
			.button.right-round.xlarge,
			.button.right-round.extra {
				border-radius: 1.25rem 1.75rem 1.75rem 1.25rem;
			}

			.button.top-round {
				border-radius: 1.25rem 1.25rem 0.5rem 0.5rem;
			}
			.button.top-round.xsmall {
				border-radius: 0.875rem 0.875rem 0.25rem 0.25rem;
			}
			.button.top-round.small {
				border-radius: 1rem 1rem 0.5rem 0.5rem;
			}
			.button.top-round.large {
				border-radius: 1.5rem 1.5rem 1rem 1rem;
			}
			.button.top-round.xlarge,
			.button.top-round.extra {
				border-radius: 1.75rem 1.75rem 1.25rem 1.25rem;
			}

			.button.bottom-round {
				border-radius: 0.5rem 0.5rem 1.25rem 1.25rem;
			}
			.button.bottom-round.xsmall {
				border-radius: 0.25rem 0.25rem 0.875rem 0.875rem;
			}
			.button.bottom-round.small {
				border-radius: 0.5rem 0.5rem 1rem 1rem;
			}
			.button.bottom-round.large {
				border-radius: 1rem 1rem 1.5rem 1.5rem;
			}
			.button.bottom-round.xlarge,
			.button.bottom-round.extra {
				border-radius: 1.25rem 1.25rem 1.75rem 1.75rem;
			}

			/* Morph active states (square-ish equivalents) */
			.button.left-square {
				border-radius: 0.75rem 0.5rem 0.5rem 0.75rem;
			}
			.button.left-square.xsmall {
				border-radius: 0.5rem 0.25rem 0.25rem 0.5rem;
			}
			.button.left-square.small {
				border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
			}
			.button.left-square.large {
				border-radius: 1rem 1rem 1rem 1rem;
			}
			.button.left-square.xlarge,
			.button.left-square.extra {
				border-radius: 1rem 1.25rem 1.25rem 1rem;
			}

			.button.right-square {
				border-radius: 0.5rem 0.75rem 0.75rem 0.5rem;
			}
			.button.right-square.xsmall {
				border-radius: 0.25rem 0.5rem 0.5rem 0.25rem;
			}
			.button.right-square.small {
				border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
			}
			.button.right-square.large {
				border-radius: 1rem 1rem 1rem 1rem;
			}
			.button.right-square.xlarge,
			.button.right-square.extra {
				border-radius: 1.25rem 1rem 1rem 1.25rem;
			}

			.button.top-square {
				border-radius: 0.75rem 0.75rem 0.5rem 0.5rem;
			}
			.button.top-square.xsmall {
				border-radius: 0.5rem 0.5rem 0.25rem 0.25rem;
			}
			.button.top-square.small {
				border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
			}
			.button.top-square.large {
				border-radius: 1rem 1rem 1rem 1rem;
			}
			.button.top-square.xlarge,
			.button.top-square.extra {
				border-radius: 1rem 1rem 1.25rem 1.25rem;
			}

			.button.bottom-square {
				border-radius: 0.5rem 0.5rem 0.75rem 0.75rem;
			}
			.button.bottom-square.xsmall {
				border-radius: 0.25rem 0.25rem 0.5rem 0.5rem;
			}
			.button.bottom-square.small {
				border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
			}
			.button.bottom-square.large {
				border-radius: 1rem 1rem 1rem 1rem;
			}
			.button.bottom-square.xlarge,
			.button.bottom-square.extra {
				border-radius: 1.25rem 1.25rem 1rem 1rem;
			}

			.button.inner-round {
				border-radius: 0.5rem;
			}
			.button.inner-round.xsmall {
				border-radius: 0.25rem;
			}
			.button.inner-round.small {
				border-radius: 0.5rem;
			}
			.button.inner-round.large {
				border-radius: 1rem;
			}
			.button.inner-round.xlarge,
			.button.inner-round.extra {
				border-radius: 1.25rem;
			}

			/* Flat variants (completely 0px on flat sides) */
			.button.left-round-flat {
				border-radius: 1.25rem 0 0 1.25rem;
			}
			.button.left-round-flat.xsmall {
				border-radius: 0.875rem 0 0 0.875rem;
			}
			.button.left-round-flat.small {
				border-radius: 1rem 0 0 1rem;
			}
			.button.left-round-flat.large {
				border-radius: 1.5rem 0 0 1.5rem;
			}
			.button.left-round-flat.xlarge,
			.button.left-round-flat.extra {
				border-radius: 1.75rem 0 0 1.75rem;
			}

			.button.right-round-flat {
				border-radius: 0 1.25rem 1.25rem 0;
			}
			.button.right-round-flat.xsmall {
				border-radius: 0 0.875rem 0.875rem 0;
			}
			.button.right-round-flat.small {
				border-radius: 0 1rem 1rem 0;
			}
			.button.right-round-flat.large {
				border-radius: 0 1.5rem 1.5rem 0;
			}
			.button.right-round-flat.xlarge,
			.button.right-round-flat.extra {
				border-radius: 0 1.75rem 1.75rem 0;
			}

			.button.top-round-flat {
				border-radius: 1.25rem 1.25rem 0 0;
			}
			.button.top-round-flat.xsmall {
				border-radius: 0.875rem 0.875rem 0 0;
			}
			.button.top-round-flat.small {
				border-radius: 1rem 1rem 0 0;
			}
			.button.top-round-flat.large {
				border-radius: 1.5rem 1.5rem 0 0;
			}
			.button.top-round-flat.xlarge,
			.button.top-round-flat.extra {
				border-radius: 1.75rem 1.75rem 0 0;
			}

			.button.bottom-round-flat {
				border-radius: 0 0 1.25rem 1.25rem;
			}
			.button.bottom-round-flat.xsmall {
				border-radius: 0 0 0.875rem 0.875rem;
			}
			.button.bottom-round-flat.small {
				border-radius: 0 0 1rem 1rem;
			}
			.button.bottom-round-flat.large {
				border-radius: 0 0 1.5rem 1.5rem;
			}
			.button.bottom-round-flat.xlarge,
			.button.bottom-round-flat.extra {
				border-radius: 0 0 1.75rem 1.75rem;
			}

			/* Morph active states for flat variants */
			.button.left-square-flat {
				border-radius: 0.75rem 0 0 0.75rem;
			}
			.button.left-square-flat.xsmall,
			.button.left-square-flat.small {
				border-radius: 0.5rem 0 0 0.5rem;
			}
			.button.left-square-flat.large,
			.button.left-square-flat.xlarge,
			.button.left-square-flat.extra {
				border-radius: 1rem 0 0 1rem;
			}

			.button.right-square-flat {
				border-radius: 0 0.75rem 0.75rem 0;
			}
			.button.right-square-flat.xsmall,
			.button.right-square-flat.small {
				border-radius: 0 0.5rem 0.5rem 0;
			}
			.button.right-square-flat.large,
			.button.right-square-flat.xlarge,
			.button.right-square-flat.extra {
				border-radius: 0 1rem 1rem 0;
			}

			.button.top-square-flat {
				border-radius: 0.75rem 0.75rem 0 0;
			}
			.button.top-square-flat.xsmall,
			.button.top-square-flat.small {
				border-radius: 0.5rem 0.5rem 0 0;
			}
			.button.top-square-flat.large,
			.button.top-square-flat.xlarge,
			.button.top-square-flat.extra {
				border-radius: 1rem 1rem 0 0;
			}

			.button.bottom-square-flat {
				border-radius: 0 0 0.75rem 0.75rem;
			}
			.button.bottom-square-flat.xsmall,
			.button.bottom-square-flat.small {
				border-radius: 0 0 0.5rem 0.5rem;
			}
			.button.bottom-square-flat.large,
			.button.bottom-square-flat.xlarge,
			.button.bottom-square-flat.extra {
				border-radius: 0 0 1rem 1rem;
			}

			/* Circle hides the label visually (slot still present for a11y
			   and SSR fallback). */
			:host([shape='circle']) [part='label'] {
				display: none;
			}

			/* Variants */
			.button.border {
				border: 0.0625rem solid var(--outline-variant);
				color: var(--primary);
				background-color: transparent;
			}
			.button.fill {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}
			.button.transparent {
				color: var(--primary);
				background-color: transparent;
				padding: 0 0.75rem;
			}
			.button.elevated {
				background-color: var(--surface-container-low, var(--surface));
				color: var(--primary);
				box-shadow: var(--elevate1);
			}
			.button.error {
				background-color: var(--error);
				color: var(--on-error);
			}
			.button.error:hover:not(:disabled) {
				background-image: linear-gradient(color-mix(in srgb, currentColor 8%, transparent), color-mix(in srgb, currentColor 8%, transparent));
			}
			.button.error:focus-visible {
				outline-color: var(--error);
			}

			/* Disabled / active */
			.button:disabled,
			.button[aria-disabled='true'] {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
			}
			.button:hover:not(:disabled) {
				transform: translateY(-0.0625rem);
				background-image: linear-gradient(color-mix(in srgb, currentColor 8%, transparent), color-mix(in srgb, currentColor 8%, transparent));
			}
			.button.elevated:hover:not(:disabled) {
				box-shadow: var(--elevate2);
			}
			.button:active:not(:disabled) {
				border-radius: 0.75rem;
				transform: translateY(0.0625rem) scale(0.97);
				background-image: linear-gradient(color-mix(in srgb, currentColor 12%, transparent), color-mix(in srgb, currentColor 12%, transparent));
			}
			.button.elevated:active:not(:disabled) {
				box-shadow: none;
			}
			.button.xsmall:active:not(:disabled) {
				border-radius: 0.5rem;
			}
			.button.small:active:not(:disabled) {
				border-radius: 0.5rem;
			}
			.button.large:active:not(:disabled) {
				border-radius: 1rem;
			}
			.button.xlarge:active:not(:disabled),
			.button.extra:active:not(:disabled) {
				border-radius: 1rem;
			}

			.button.active:not(:disabled) {
				background-color: var(--primary-container);
				color: var(--on-primary-container);
				padding-inline: 1.5rem;
			}
			.button.xsmall.active:not(:disabled) {
				padding-inline: 0.875rem;
			}
			.button.small.active:not(:disabled) {
				padding-inline: 1.125rem;
			}
			.button.large.active:not(:disabled) {
				padding-inline: 1.75rem;
			}
			.button.xlarge.active:not(:disabled),
			.button.extra.active:not(:disabled) {
				padding-inline: 2rem;
			}
			.button.fill.active:not(:disabled) {
				background-color: var(--secondary);
				color: var(--on-secondary);
			}
			.button.border.active:not(:disabled) {
				background-color: var(--inverse-surface);
				color: var(--inverse-on-surface);
				border-color: var(--inverse-surface);
			}
			.button.elevated.active:not(:disabled) {
				background-color: var(--primary-container);
				color: var(--on-primary-container);
				box-shadow: var(--elevate2);
			}

			.button:focus-visible {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
			}

			/* Icon helper */
			.icon,
			::slotted([slot='icon']),
			::slotted([slot='icon-trailing']) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 1.125rem;
				inline-size: 1.125rem;
				block-size: 1.125rem;
				flex: none;
				color: inherit;
			}

			/* Loading spinner */
			.loading-spinner {
				inline-size: 1.125rem;
				block-size: 1.125rem;
				color: currentColor;
			}
			.loading-spinner::part(progress) {
				border-width: 0.1875rem;
			}
		`
	];

	/**
	 * Intercepta los clicks en botones tipo enlace (`href="..."`).
	 * Si el botón está desactivado (`disabled`), previene agresivamente
	 * tanto la navegación por defecto del navegador como la burbuja de eventos.
	 */
	private handleLinkClick(e: Event) {
		if (this.disabled) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	/**
	 * Assembles the button's Shadow DOM structure for each Lit render cycle.
	 *
	 * **Variant → CSS class mapping:**
	 * | `variant`    | CSS class     | Visual result               |
	 * |--------------|---------------|-----------------------------|
	 * | `'filled'`   | `''` (empty)  | Primary filled button       |
	 * | `'outlined'` | `'border'`    | Outlined/stroked button     |
	 * | `'tonal'`    | `'fill'`      | Secondary container fill    |
	 * | `'text'`     | `'transparent'` | Ghost/text button         |
	 * | `'elevated'` | `'elevated'`  | Tonal surface + shadow      |
	 *
	 * **Shape morphing:**
	 * When `active=true`, the button inverts its corner-radius shape to create
	 * a micro-animation where clicking "morphs" the shape (round → square, etc.).
	 * This is used in toggle-button patterns (e.g., a nav-item that morphs to
	 * indicate the current page).
	 *
	 * **Icon resolution priority:**
	 * 1. `loading=true` → renders a `<moni-progress>` spinner (hides label at 50% opacity).
	 * 2. `icon` attribute → renders a `<moni-icon>` in the leading icon slot.
	 * 3. Otherwise → renders the `icon` named slot for slotted content.
	 *
	 * **Link vs. button:**
	 * When `href` is set, the root element is an `<a>` tag (with disabled click
	 * guard) for proper browser navigation semantics. Otherwise it's a `<button>`
	 * with `type="button"` to prevent accidental form submission.
	 */
	override render() {
		let variantClass = '';
		if (this.variant === 'outlined') variantClass = 'border';
		else if (this.variant === 'tonal' || this.variant === 'fill') variantClass = 'fill';
		else if (this.variant === 'text') variantClass = 'transparent';
		else if (this.variant === 'elevated') variantClass = 'elevated';
		else if (this.variant === 'error') variantClass = 'error';

		let activeShape: string = this.shape;
		if (this.active) {
			if (this.shape === 'round') activeShape = 'square';
			else if (this.shape === 'square') activeShape = 'round';
			else if (this.shape === 'left-round') activeShape = 'left-square';
			else if (this.shape === 'right-round') activeShape = 'right-square';
			else if (this.shape === 'top-round') activeShape = 'top-square';
			else if (this.shape === 'bottom-round') activeShape = 'bottom-square';
			else if (this.shape === 'left-round-flat') activeShape = 'left-square-flat';
			else if (this.shape === 'right-round-flat') activeShape = 'right-square-flat';
			else if (this.shape === 'top-round-flat') activeShape = 'top-square-flat';
			else if (this.shape === 'bottom-round-flat') activeShape = 'bottom-square-flat';
			else if (this.shape === 'inner-round') activeShape = 'inner-round'; // remains inner-round or standard shape morphing
		}

		const classes = [
			'button',
			variantClass,
			this.size,
			activeShape,
			this.active ? 'active' : ''
		]
			.filter(Boolean)
			.join(' ');

		const iconEl = this.loading
			? html`<moni-progress
					class="loading-spinner"
					part="loading"
					variant="circular"
					indeterminate
					size="small"
				></moni-progress>`
			: this.icon
				? html`<span class="icon" part="icon"
						><moni-icon name="${this.icon}"></moni-icon
					></span>`
				: html`<slot name="icon" part="icon"></slot>`;

		const trailingIconEl = this.iconTrailing
			? html`<span class="icon" part="icon-trailing"
					><moni-icon name="${this.iconTrailing}"></moni-icon
				></span>`
			: html`<slot name="icon-trailing" part="icon-trailing"></slot>`;

		const content = html`${iconEl}
			<span part="label" style=${this.loading ? 'opacity: 0.5;' : ''}><slot></slot></span>
			${trailingIconEl}`;

		if (this.href) {
			return html`<a
				class=${classes}
				part="button"
				href=${this.disabled ? undefined : this.href}
				target=${ifDefined(this.target || undefined)}
				aria-disabled=${this.disabled ? 'true' : 'false'}
				aria-busy=${this.loading ? 'true' : 'false'}
				@click=${this.handleLinkClick}
			>
				${content}
			</a>`;
		}

		return html`<button
			class=${classes}
			part="button"
			type=${this.type}
			?disabled=${this.disabled}
			aria-disabled=${this.disabled}
			aria-busy=${this.loading ? 'true' : 'false'}
		>
			${content}
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-button': MoniButton;
	}
}

export default MoniButton;
