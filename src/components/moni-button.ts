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
 * Material Design 3 Button component.
 *
 * Buttons allow users to take actions and make choices with a single tap.
 * This component provides all M3 button variants, sizes, and shape morphing
 * capabilities (e.g. morphing to a pill shape on press or toggle).
 *
 * **M3 spec reference:** `m3-docs/components/buttons/specs.md`
 *
 * **Variants:**
 * - `filled` (default) — High emphasis. Use for primary actions.
 * - `tonal` — Medium emphasis. Secondary actions that still need to stand out.
 * - `elevated` — Medium emphasis with shadow. Used when sitting on patterned backgrounds.
 * - `outlined` — Medium emphasis, no fill. Secondary or tertiary actions.
 * - `text` — Low emphasis. Tertiary actions (e.g. dialog cancel button).
 *
 * **Shape morphing (M3 Expressive feature):**
 * - On press (active state): Round and square buttons morph to a slightly squarer
 *   "pressed" shape with specific M3 corner radii (e.g. XS/S 8dp, M 12dp).
 * - On toggle (`active` attribute): The resting shape flips (e.g. round ↔ square).
 *
 * **Rendering as a link:**
 * When the `href` attribute is provided, the component internally renders as
 * an `<a>` element instead of a `<button>`, allowing native routing and
 * middle-click (open in new tab) behaviors while maintaining button visuals.
 *
 * @example
 * ```html
 * <!-- Primary filled button -->
 * <moni-button icon="add">Create new</moni-button>
 *
 * <!-- Outlined button -->
 * <moni-button variant="outlined">Cancel</moni-button>
 *
 * <!-- Toggle button (toggles active state on click) -->
 * <moni-button icon="favorite" active>Like</moni-button>
 *
 * <!-- Link button -->
 * <moni-button href="/settings" icon="settings">Settings</moni-button>
 * ```
 *
 * @slot default       - The button label text.
 * @slot icon          - Optional override for the leading icon.
 * @slot icon-trailing - Optional override for the trailing icon.
 *
 * @csspart button     - The inner `<button>` or `<a>` element.
 * @csspart icon       - The leading icon container.
 * @csspart label      - The label container.
 * @csspart trailing-icon - The trailing icon container.
 */
@customElement('moni-button')
export class MoniButton extends MoniElement {
	private static _deprecationWarned = false;

	@property({ reflect: true })
	variant:
		| 'filled'
		| 'tonal'
		| 'outlined'
		| 'text'
		| 'fill'
		| 'elevated' = 'filled';
	/**
	 * M3 Expressive sizes: xsmall, small, medium, large, xlarge.
	 * `extra` is a Moni legacy alias for `xlarge`, deprecated in v0.3.1; will
	 * be removed in v1.0. See `m3-docs/components/buttons/overview.md` § Sizes.
	 */
	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';
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
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: Boolean, reflect: true }) loading = false;
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true, attribute: 'icon-trailing' }) iconTrailing = '';
	@property({ reflect: true })
	type: 'button' | 'submit' | 'reset' = 'button';
	@property({ reflect: true }) href = '';
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
				padding: 0;
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

	private handleLinkClick(e: Event) {
		if (this.disabled) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	override render() {
		let variantClass = '';
		if (this.variant === 'outlined') variantClass = 'border';
		else if (this.variant === 'tonal' || this.variant === 'fill') variantClass = 'fill';
		else if (this.variant === 'text') variantClass = 'transparent';
		else if (this.variant === 'elevated') variantClass = 'elevated';

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
