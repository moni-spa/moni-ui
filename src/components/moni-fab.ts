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
 * Material Design 3 Floating Action Button (FAB) component.
 *
 * FABs represent the primary, or most common, action on a screen. They appear
 * in front of all screen content, typically as a circular shape with an icon in
 * its center.
 *
 * **M3 spec reference:** `m3-docs/components/floating-action-buttons/specs.md`
 *
 * **M3 Expressive Updates & Deprecations (May 2025):**
 * - `size="small"` is **no longer recommended** by M3. Use `medium` (40dp or 56dp)
 *   or `large` (96dp). Deprecated in v0.3.1; will be removed in v1.0.
 * - `shape="circle"` is **not part of M3**. M3 FABs use a `rounded` shape with a
 *   16dp corner radius (which morphs to a `full` radius on hover/focus).
 *   Deprecated in v0.3.1; will be removed in v1.0.
 * - `color="surface"` is **no longer recommended**. Use `primary`, `secondary`,
 *   or `tertiary` to ensure proper color mapping to the M3 theme.
 *
 * **Extended FABs:**
 * When `extended` is true, the FAB displays a text label next to the icon.
 * Extended FABs are wider and are typically used when the action needs explicit
 * text to be clear. The `expanded` attribute forces the FAB to its full extended
 * width, useful for animating between standard and extended states on scroll.
 *
 * **Positioning:**
 * The `position` attribute applies predefined absolute/fixed positioning
 * (e.g. `bottom-trailing`), snapping the FAB to standard screen corners.
 *
 * @example
 * ```html
 * <!-- Standard primary FAB -->
 * <moni-fab icon="edit"></moni-fab>
 *
 * <!-- Extended tertiary FAB -->
 * <moni-fab color="tertiary" extended icon="add" label="New task"></moni-fab>
 *
 * <!-- Positioned FAB -->
 * <moni-fab position="bottom-trailing" icon="navigation"></moni-fab>
 * ```
 *
 * @csspart button - The internal `<button>` element.
 * @csspart icon   - The container for the icon.
 * @csspart label  - The text label (only visible when extended).
 */
@customElement('moni-fab')
export class MoniFab extends MoniElement {
	private static _deprecationWarned = false;

	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';
	@property({ reflect: true })
	shape: 'rounded' | 'circle' = 'rounded';
	@property({ type: Boolean, reflect: true }) extended = false;
	@property({ type: Boolean, reflect: true }) expanded = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) icon = 'add';
	@property({ reflect: true }) label = '';
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
				/* Default: no padding so icon is centered; padding added when label exists */
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

			/* When no label: icon-only, remove horizontal padding so icon centers */
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

			/* Label is always rendered but empty string hides via overflow.
			   When label prop is set, it appears. */
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

			/* Circle shape: hide label completely */
			:host([shape='circle']) .label,
			:host([shape='circle']) slot {
				display: none !important;
			}
			/* Circle: remove padding, make it a perfect circle */
			:host([shape='circle']) .button {
				padding: 0 !important;
			}
		`
	];

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
