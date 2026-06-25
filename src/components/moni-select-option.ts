import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Option item for custom moni-select dropdown.
 *
 * Attributes:
 *  - value:    string value of the option
 *  - label:    text label (uses textContent or slot if empty)
 *  - group:    subcategory group/category name
 *  - selected: present -> active highlight state
 *  - disabled: present -> disabled
 */
@customElement('moni-select-option')
export class MoniSelectOption extends MoniElement {
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) group = '';
	@property({ type: Boolean, reflect: true }) selected = false;
	@property({ type: Boolean, reflect: true }) disabled = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			li {
				all: unset;
				box-sizing: border-box;
				position: relative;
				display: flex;
				align-items: center;
				text-align: start;
				justify-content: flex-start;
				white-space: nowrap;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 2.5rem;
				flex: 1;
				margin: 0 !important;
				cursor: pointer;
				border-radius: 0.25rem;
				color: var(--on-surface);
				font-size: 0.875rem;
				transition: background-color var(--speed2), border-radius var(--speed2);
			}

			li:hover {
				background-color: var(--active);
			}
			li.selected {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}
			li:is(.selected, :active) {
				border-radius: 0.75rem;
			}
			:host([disabled]) li {
				opacity: 0.5;
				pointer-events: none;
			}
		`
	];

	override render() {
		return html`<li
			part="option"
			class="${this.selected ? 'selected' : ''}"
		>
			<span part="label"><slot>${this.label || this.value}</slot></span>
		</li>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-select-option': MoniSelectOption;
	}
}

export default MoniSelectOption;
