/**
 * @file components/moni-step.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Step component.
 *
 * An individual step within a `<moni-stepper>`. Steps display progress through
 * a sequence of logical and numbered operations.
 *
 * **M3 spec reference:** `m3-docs/components/progress-indicators/specs.md` (Stepper pattern)
 *
 * **Anatomy & Visuals:**
 * A step renders a circular indicator containing either its sequence number
 * (automatically injected by the parent stepper) or a custom icon. Below or
 * beside the indicator (depending on the parent's `orientation`), it renders
 * the `title` and an optional `description`.
 *
 * **State management:**
 * The parent `<moni-stepper>` automatically calculates and injects the `index`,
 * `active`, and `completed` properties based on its current state.
 * - **Active:** Highlighted with the primary color, indicating the current step.
 * - **Completed:** Displayed with a solid primary background and a checkmark
 *   icon (`completed` state overrides the numeric index).
 *
 * @example
 * ```html
 * <!-- Typically used inside a stepper -->
 * <moni-stepper current="1">
 *   <moni-step title="Shipping" description="Enter address"></moni-step>
 *   <moni-step title="Payment" description="Credit card details"></moni-step>
 *   <moni-step title="Review" description="Confirm order"></moni-step>
 * </moni-stepper>
 *
 * <!-- Overriding the icon -->
 * <moni-step title="Done" icon="celebration"></moni-step>
 * ```
 *
 * @csspart step-indicator - The circular badge containing the number/icon.
 * @csspart title          - The main title text.
 * @csspart description    - The secondary description text.
 */
@customElement('moni-step')
export class MoniStep extends MoniElement {
	@property({ reflect: true }) title = '';
	@property({ reflect: true }) description = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) completed = false;
	@property({ reflect: true }) icon = '';
	@property({ type: Number, reflect: true }) index = 0;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				gap: 0.5rem;
				font-family: var(--font);
				color: var(--on-surface-variant);
				position: relative;
				flex: 1;
			}

			:host(:not(:last-child))::after {
				content: '';
				position: absolute;
				inset-inline-start: calc(50% + 1.25rem);
				inset-inline-end: calc(-50% + 1.25rem);
				inset-block-start: 1rem;
				block-size: 0.0625rem;
				background-color: var(--outline-variant);
				z-index: 0;
			}

			:host-context(moni-stepper[orientation='vertical']) {
				flex-direction: row;
				align-items: flex-start;
				text-align: start;
				gap: 1rem;
				min-block-size: 4rem;
			}

			/* Vertical connector. Geometry: the dot occupies y=0 to y=2rem at
			   the top of the step (host is column flex with min-block-size 4rem).
			   The connector runs from the BOTTOM of the current dot (y=2rem) to
			   the BOTTOM of the current step (y=100%). This formula stays
			   calibrated regardless of step height. */
			:host-context(moni-stepper[orientation='vertical']):host(:not(:last-child))::after {
				position: absolute;
				inset-inline-start: calc(1rem - 0.03125rem);
				inset-block-start: 2rem;
				inset-inline-end: auto;
				inline-size: 0.0625rem;
				block-size: calc(100% - 2rem);
				z-index: 0;
				margin: 0;
				background-color: var(--outline-variant);
			}

			.dot {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 2rem;
				block-size: 2rem;
				border-radius: 50%;
				background-color: var(--surface-container);
				color: var(--on-surface-variant);
				font-size: 0.875rem;
				font-weight: 500;
				flex: none;
				z-index: 1;
			}

			:host([active]) .dot {
				background-color: var(--primary);
				color: var(--on-primary);
			}

			:host([completed]) .dot {
				background-color: var(--primary);
				color: var(--on-primary);
			}

			:host([active]) .text {
				color: var(--on-surface);
			}

			.text {
				display: flex;
				flex-direction: column;
				min-inline-size: 0;
				z-index: 1;
			}
			.title {
				font-size: 0.875rem;
				font-weight: 500;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.description {
				font-size: 0.75rem;
				opacity: 0.7;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`
	];

	override render() {
		const dot = this.completed
			? html`<moni-icon name="check"></moni-icon>`
			: this.icon
				? html`<moni-icon name="${this.icon}"></moni-icon>`
				: html`${this.index + 1}`;
		return html`
			<span class="dot" part="dot">${dot}</span>
			<div class="text" part="text">
				<span class="title" part="title"
					><slot>${this.title}</slot></span
				>
				<span class="description" part="description"
					>${this.description}</span
				>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-step': MoniStep;
	}
}

export default MoniStep;
