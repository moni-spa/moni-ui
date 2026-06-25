import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Visual-only Floating Action Button.
 *
 * Material 3 Expressive update (May 2025):
 *  - `size="small"` is **no longer recommended** by M3. Use `medium` (40dp/56dp
 *    on M3 spec) or `large`. Deprecated in v0.3.1; will be removed in v1.0.
 *  - `shape="circle"` is **not part of M3**; M3 FABs are `rounded` with a 16dp
 *    corner radius (or `full` when on hover/focus). The M3 spec does not
 *    define a perfect-circle FAB. Deprecated in v0.3.1; will be removed in v1.0.
 *  - `color="surface"` is **no longer recommended** by M3. Use `primary`,
 *    `secondary`, or `tertiary` (and their container variants).
 *
 * Attributes:
 *  - size:      medium (default) | large  (small: deprecated)
 *  - color:     primary (default) | secondary | tertiary  (surface: deprecated)
 *  - shape:     rounded (default)  (circle: deprecated)
 *  - extended:  present → wider with label always visible
 *  - expanded:  present → force expanded
 *  - disabled:  present
 *  - icon:      Material Symbols name
 *  - label:     text when extended
 *  - position:  bottom-trailing (default) | bottom-leading
 *               | top-trailing | top-leading
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
