/**
 * @file components/moni-button-segment.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Segmented Button component (Legacy).
 *
 * **Deprecation Notice:** The M3 spec (`m3-docs/components/segmented-buttons/overview.md`)
 * has replaced the bespoke segmented button component with standard buttons arranged
 * in a "connected" group. Please use `<moni-button-group variant="connected">`
 * containing standard `<moni-button>` elements instead of this component.
 *
 * This component remains for backwards compatibility but will be removed in a
 * future major release. It renders a single segment within a `<moni-segmented-button>`.
 *
 * @deprecated Use `<moni-button-group variant="connected">` instead.
 *
 * @example
 * ```html
 * <!-- Legacy usage (not recommended) -->
 * <moni-segmented-button>
 *   <moni-button-segment value="day" checked>Day</moni-button-segment>
 *   <moni-button-segment value="week">Week</moni-button-segment>
 * </moni-segmented-button>
 * ```
 *
 * @slot default - The segment label text.
 */
@customElement('moni-button-segment')
export class MoniButtonSegment extends MoniElement {
	@property({ reflect: true })
	value = 'on';

	@property({ type: Boolean, reflect: true })
	checked = false;

	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	@property({ type: Boolean, reflect: true })
	disabled = false;

	@property({ reflect: true })
	position: 'first' | 'middle' | 'last' | 'solo' = 'solo';

	@property({ type: Boolean, reflect: true, attribute: 'hide-check' })
	hideCheck = false;

	static override styles = [
		sharedStyles,
		css`
			.label {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-family: inherit;
				font-size: inherit;
				font-weight: inherit;
				color: inherit;
				text-align: center;
			}
			:host {
				display: inline-flex;
				vertical-align: middle;
				position: relative;
				z-index: 1;
			}

			/* Collapsing margins on host */
			:host(:not([position='first'])) {
				margin-inline-start: var(--moni-button-segment-gap, -0.0625rem);
			}

			:host([disabled]) {
				pointer-events: none;
			}

			.button {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				height: 2.5rem;
				width: 100%;
				padding: 0 1rem;
				font-size: 0.875rem;
				font-weight: 500;
				font-family: inherit;
				color: var(--on-surface);
				background-color: transparent;
				border: 0.0625rem solid var(--outline-variant, var(--outline, #79747e));
				cursor: pointer;
				user-select: none;
				transition:
					background-color var(--speed2),
					color var(--speed2),
					border-radius var(--speed2),
					transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
					box-shadow 250ms ease;
				position: relative;
				gap: 0.5rem;
			}

			.button::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				min-width: 100%;
				min-height: 3rem; /* 48px minimum touch target */
				transform: translate(-50%, -50%);
			}

			/* Sizes */
			.button.xsmall {
				height: 1.75rem;
				min-width: 3rem; /* 48px */
				font-size: 0.75rem;
				padding: 0 0.5rem;
			}
			.button.small {
				height: 2rem;
				min-width: 3rem; /* 48px */
				padding: 0 0.75rem;
			}
			.button.large {
				height: 3rem;
				padding: 0 1.25rem;
			}
			.button.xlarge,
			.button.extra {
				height: 3.5rem;
				font-size: 1rem;
				padding: 0 1.5rem;
			}

			:host([disabled]) .button {
				opacity: 0.38;
				cursor: not-allowed;
			}

			/* Border Radius positioning */
			:host([position='first']) .button {
				border-radius: var(--moni-button-segment-radius-left, 1.25rem 0.5rem 0.5rem 1.25rem);
			}
			:host([position='first']) .button.xsmall {
				border-radius: var(--moni-button-segment-radius-left, 0.875rem 0.25rem 0.25rem 0.875rem);
			}
			:host([position='first']) .button.small {
				border-radius: var(--moni-button-segment-radius-left, 1rem 0.5rem 0.5rem 1rem);
			}
			:host([position='first']) .button.large {
				border-radius: var(--moni-button-segment-radius-left, 1.5rem 1rem 1rem 1.5rem);
			}
			:host([position='first']) .button.xlarge,
			:host([position='first']) .button.extra {
				border-radius: var(--moni-button-segment-radius-left, 1.75rem 1.25rem 1.25rem 1.75rem);
			}

			:host([position='last']) .button {
				border-radius: var(--moni-button-segment-radius-right, 0.5rem 1.25rem 1.25rem 0.5rem);
			}
			:host([position='last']) .button.xsmall {
				border-radius: var(--moni-button-segment-radius-right, 0.25rem 0.875rem 0.875rem 0.25rem);
			}
			:host([position='last']) .button.small {
				border-radius: var(--moni-button-segment-radius-right, 0.5rem 1rem 1rem 0.5rem);
			}
			:host([position='last']) .button.large {
				border-radius: var(--moni-button-segment-radius-right, 1rem 1.5rem 1.5rem 1rem);
			}
			:host([position='last']) .button.xlarge,
			:host([position='last']) .button.extra {
				border-radius: var(--moni-button-segment-radius-right, 1.25rem 1.75rem 1.75rem 1.25rem);
			}

			:host([position='middle']) .button {
				border-radius: var(--moni-button-segment-radius-middle, 0.5rem);
			}
			:host([position='middle']) .button.xsmall {
				border-radius: var(--moni-button-segment-radius-middle, 0.25rem);
			}
			:host([position='middle']) .button.small {
				border-radius: var(--moni-button-segment-radius-middle, 0.5rem);
			}
			:host([position='middle']) .button.large {
				border-radius: var(--moni-button-segment-radius-middle, 1rem);
			}
			:host([position='middle']) .button.xlarge,
			:host([position='middle']) .button.extra {
				border-radius: var(--moni-button-segment-radius-middle, 1.25rem);
			}

			:host([position='solo']) .button {
				border-radius: 1.25rem;
			}
			:host([position='solo']) .button.xsmall {
				border-radius: 0.875rem;
			}
			:host([position='solo']) .button.small {
				border-radius: 1rem;
			}
			:host([position='solo']) .button.large {
				border-radius: 1.5rem;
			}
			:host([position='solo']) .button.xlarge,
			:host([position='solo']) .button.extra {
				border-radius: 1.75rem;
			}

			/* Hover and Active states */
			:host(:hover:not([disabled])) {
				z-index: 2;
			}
			:host(:hover:not([disabled])) .button {
				transform: translateY(-0.0625rem);
			}
			:host(:hover:not([disabled]):not([checked])) .button {
				background-color: var(--surface-container-high, rgba(0, 0, 0, 0.04));
			}

			:host(:active:not([disabled])) .button {
				transform: translateY(0.0625rem) scale(0.97);
			}

			/* Checked state */
			:host([checked]) {
				z-index: 3;
			}
			:host([checked]) .button {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			:host([checked]:hover:not([disabled])) {
				z-index: 3;
			}
			:host([checked]:hover:not([disabled])) .button {
				background-color: var(--secondary-container);
				opacity: 0.92;
			}

			/* Checkmark Animation */
			.checkmark {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 1.125rem;
				inline-size: 0;
				block-size: 1.125rem;
				opacity: 0;
				transform: scale(0);
				margin-inline-end: -0.5rem; /* Cancels host gap when collapsed */
				transition:
					inline-size var(--speed2) var(--ease-standard),
					margin-inline-end var(--speed2) var(--ease-standard),
					opacity var(--speed2) var(--ease-standard),
					transform var(--speed2) var(--ease-standard);
				overflow: hidden;
				color: inherit;
				flex: none;
			}

			:host([checked]:not([hide-check])) .checkmark {
				inline-size: 1.125rem;
				margin-inline-end: 0;
				opacity: 1;
				transform: scale(1);
			}

			/* Icon slot */
			::slotted([slot='icon']) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 1.125rem;
				inline-size: 1.125rem;
				block-size: 1.125rem;
				color: inherit;
				flex: none;
			}
		`
	];

	override render() {
		return html`
			<button class="button ${this.size}" type="button" ?disabled=${this.disabled}>
				<span class="checkmark" part="checkmark">
					<moni-icon name="check"></moni-icon>
				</span>
				<slot name="icon"></slot>
				<span class="label" part="label"><slot></slot></span>
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-button-segment': MoniButtonSegment;
	}
}

export default MoniButtonSegment;
