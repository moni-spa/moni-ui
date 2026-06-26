/**
 * @file components/moni-list.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 List component.
 *
 * Lists are continuous, vertical indexes of text or images. They are
 * container elements that provide structural grouping and optional
 * divider lines for `<moni-list-item>` children.
 *
 * **M3 spec reference:** `m3-docs/components/lists/specs.md`
 *
 * **Container role:**
 * The list itself does not apply padding or margins to its children. Spacing
 * and internal padding are controlled entirely by the `<moni-list-item>`
 * elements themselves to ensure proper hit targets and alignment.
 *
 * **Variants:**
 * - `default` (empty string) — A clean, borderless list container.
 * - `border` — Adds a bottom border to the list and displays horizontal
 *   dividers (`outline-variant` color) between list items.
 *
 * @example
 * ```html
 * <!-- Standard list -->
 * <moni-list>
 *   <moni-list-item headline="Item 1"></moni-list-item>
 *   <moni-list-item headline="Item 2"></moni-list-item>
 * </moni-list>
 *
 * <!-- List with dividers and rounded items -->
 * <moni-list variant="border" rounded>
 *   <moni-list-item icon="inbox" headline="Inbox"></moni-list-item>
 *   <moni-list-item icon="send" headline="Sent"></moni-list-item>
 * </moni-list>
 * ```
 *
 * @slot default - `<moni-list-item>` elements.
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