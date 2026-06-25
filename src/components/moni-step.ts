import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Visual-only step. Renders an icon/number, a title, and a description.
 *
 * Attributes:
 *  - title:       step heading
 *  - description: step secondary text
 *  - active:      present → primary color highlight
 *  - completed:   present → filled circle with check
 *  - icon:        Material Symbols name (overrides the number)
 *  - index:       numeric label (auto-set by parent stepper, optional)
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
