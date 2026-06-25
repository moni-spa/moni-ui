import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Visual-only menu item. Renders an `<li>` styled with the BeerCSS
 * `menu > li` rule.
 *
 * Attributes:
 *  - active:    present → tertiary-container highlight
 *  - disabled:  present
 *  - icon:      Material Symbols name
 *  - label:     item text
 */
@customElement('moni-menu-item')
export class MoniMenuItem extends MoniElement {
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';

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
				min-block-size: 2.75rem;
				flex: 1;
				margin: 0 !important;
				cursor: pointer;
				border-radius: 0.25rem;
				color: var(--on-surface);
				font-size: 0.875rem;
				transition: border-radius var(--speed2);
			}

			li:hover {
				background-color: var(--active);
			}
			li.active {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}
			li:is(.active, :active) {
				border-radius: 0.75rem;
			}
			:host([disabled]) li {
				opacity: 0.5;
				pointer-events: none;
			}
		`
	];

	override render() {
		return html`<li part="item">
			${this.icon
				? html`<moni-icon name="${this.icon}" part="icon"></moni-icon>`
				: html`<slot name="icon"></slot>`}
			<span part="label"><slot>${this.label}</slot></span>
		</li>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-menu-item': MoniMenuItem;
	}
}

export default MoniMenuItem;
