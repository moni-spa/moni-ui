import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only expansion panel. Renders a `<details>` element.
 *
 * Attributes:
 *  - open: present → panel expanded
 *  - title: heading text for the summary
 *
 * Slots:
 *  - default:  panel body
 *  - summary:  custom summary content (overrides title)
 */
@customElement('moni-expansion')
export class MoniExpansion extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ reflect: true }) title = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			details {
				border-radius: 0.5rem;
				overflow: hidden;
			}

			summary {
				list-style-type: none;
				cursor: pointer;
				padding: 0.75rem 1rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.5rem;
				font-weight: 500;
				color: var(--on-surface);
				background-color: var(--surface-container);
			}
			summary::-webkit-details-marker {
				display: none;
			}
			summary::after {
				content: 'expand_more';
				font-family: var(--font-icon);
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				font-size: 1.25rem;
				transition: transform var(--speed2);
			}
			details[open] > summary::after {
				transform: rotate(180deg);
			}

			.body {
				padding: 1rem;
				background-color: var(--surface-container-low);
				color: var(--on-surface);
			}
		`
	];

	override render() {
		return html`<details ?open=${this.open} part="expansion">
			<summary part="summary">
				<slot name="summary">${this.title}</slot>
			</summary>
			<div class="body" part="body">
				<slot></slot>
			</div>
		</details>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-expansion': MoniExpansion;
	}
}

export default MoniExpansion;
