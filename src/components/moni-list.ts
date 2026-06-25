import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 List (`m3-docs/components/lists/specs.md`).
 *
 * A list is a continuous vertical index of text and images. The
 * container itself is purely structural (no padding); spacing and
 * dividers are controlled by `<moni-list-item>` children.
 *
 * Two visual variants:
 *  - **default**: 8dp top/bottom padding between items (handled by items).
 *  - **border**:  dividers drawn between items.
 *
 * Attributes:
 *  - variant: '' (default) | border
 *  - rounded: when set, items use a 4dp corner radius.
 *
 * Slots:
 *  - default: <moni-list-item> children.
 */
@customElement('moni-list')
export class MoniList extends MoniElement {
	@property({ reflect: true }) variant: '' | 'border' = '';
	@property({ type: Boolean, reflect: true }) rounded = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				color: var(--on-surface);
				padding: 0;
				margin: 0;
			}
			:host([variant='border']) {
				border-block-end: 0.0625rem solid var(--outline-variant);
			}

			::slotted(moni-list-item) {
				display: block;
			}
		`
	];

	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-list': MoniList;
	}
}

export default MoniList;