/**
 * @file components/moni-list-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 List Item component.
 *
 * A single row within a `<moni-list>`. List items display a headline and
 * optional supporting text, metadata, icons, or avatars.
 *
 * **M3 spec reference:** `m3-docs/components/lists/specs.md`
 *
 * **Line configurations:**
 * The `lines` attribute configures the layout and minimum height of the item:
 * - `lines="1"` (default) — 56dp min height. Only the headline slot is shown.
 * - `lines="2"` — 72dp min height. Shows headline and supporting text.
 * - `lines="3"` — 88dp min height. Shows headline, supporting text, and meta text.
 *
 * **Interactive behavior:**
 * By default, items render as `<button>` elements, gaining the M3 state layer
 * (hover, focus, and press ripple effects).
 * If the `href` attribute is provided, the item internally renders as an `<a>`
 * element, allowing native link routing and interactions while preserving the
 * list item styling.
 *
 * **Visual elements:**
 * - `icon` (attribute) — Material Symbol name for the leading icon (24dp).
 * - `avatar` (attribute) — URL for a leading circular image (40dp).
 * - `trailing-icon` (attribute) — Material Symbol name for the trailing icon.
 *
 * @example
 * ```html
 * <!-- 1-line item with icon -->
 * <moni-list-item icon="inbox">
 *   Inbox
 * </moni-list-item>
 *
 * <!-- 2-line item with avatar and trailing meta -->
 * <moni-list-item lines="2" avatar="/user.jpg">
 *   Ali Connors
 *   <span slot="supporting">Brunch this weekend?</span>
 *   <span slot="trailing-meta">10 min</span>
 * </moni-list-item>
 *
 * <!-- Link item -->
 * <moni-list-item href="/settings" icon="settings">
 *   Settings
 * </moni-list-item>
 * ```
 *
 * @slot default       - Headline text (Line 1).
 * @slot supporting    - Supporting text (Line 2, requires `lines>=2`).
 * @slot meta          - Additional meta text (Line 3, requires `lines=3`).
 * @slot trailing-meta - Small text displayed on the far right edge.
 *
 * @csspart item          - The outer `<button>` or `<a>` container.
 * @csspart leading-icon  - Container for the leading icon/avatar.
 * @csspart text          - Container for the multi-line text block.
 * @csspart trailing-icon - Container for the trailing icon.
 */
@customElement('moni-list-item')
export class MoniListItem extends MoniElement {
	@property({ reflect: true })
	lines: 1 | 2 | 3 = 1;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) avatar = '';
	@property({ reflect: true, attribute: 'trailing-icon' })
	trailingIcon = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) href = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: flex;
				align-items: center;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 3.5rem;
				color: var(--on-surface);
				background-color: transparent;
				text-decoration: none;
				cursor: pointer;
				position: relative;
				font-family: var(--font);
				transition: background-color var(--speed2);
			}

			:host([active]) {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			:host([disabled]) {
				opacity: 0.38;
				pointer-events: none;
				cursor: not-allowed;
			}

			:host(:not(:last-child)) {
				border-block-end: 0.0625rem solid var(--outline-variant);
			}

			:host([lines='2']) {
				min-block-size: 4.5rem;
			}
			:host([lines='3']) {
				min-block-size: 5.5rem;
			}

			.leading,
			.trailing {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: none;
			}

			.leading-icon {
				font-size: 1.5rem;
				color: var(--on-surface-variant);
			}
			:host([active]) .leading-icon {
				color: var(--on-secondary-container);
			}

			.avatar {
				inline-size: 2.5rem;
				block-size: 2.5rem;
				border-radius: 50%;
				background-color: var(--surface-container);
				background-size: cover;
				background-position: center;
			}

			.text {
				flex: auto;
				min-inline-size: 0;
				display: flex;
				flex-direction: column;
				gap: 0.125rem;
			}

			.headline {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 500;
				color: inherit;
				margin: 0;
				padding: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.supporting,
			.meta {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host([active]) .supporting,
			:host([active]) .meta {
				color: var(--on-secondary-container);
			}

			.trailing-meta {
				font-size: 0.75rem;
				color: var(--on-surface-variant);
				white-space: nowrap;
			}

			.trailing-icon {
				font-size: 1.5rem;
				color: var(--on-surface-variant);
			}
			:host([active]) .trailing-icon {
				color: var(--on-secondary-container);
			}
		`
	];

	override render() {
		const leading = this.avatar
			? html`<span
					class="avatar"
					part="avatar"
					style="background-image: url('${this.avatar}');"
				></span>`
			: this.icon
				? html`<span class="leading leading-icon" part="leading">
						<moni-icon name="${this.icon}"></moni-icon>
					</span>`
				: html`<slot name="leading"></slot>`;

		const trailing = this.trailingIcon
			? html`<span class="trailing trailing-icon" part="trailing">
					<moni-icon name="${this.trailingIcon}"></moni-icon>
				</span>`
			: html`<slot name="trailing"></slot>`;

		const supporting = this.lines >= 2
			? html`<span class="supporting" part="supporting"
					><slot name="supporting"></slot
				></span>`
			: nothing;
		const meta = this.lines >= 3
			? html`<span class="meta" part="meta"><slot name="meta"></slot></span>`
			: nothing;

		const inner = html`
			${leading}
			<div class="text" part="text">
				<span class="headline" part="headline"><slot></slot></span>
				${supporting} ${meta}
			</div>
			${trailing}
			<slot name="trailing-meta"></slot>
		`;

		return this.href
			? html`<a
					class="row"
					part="row"
					href=${this.href}
					>${inner}</a
				>`
			: inner;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-list-item': MoniListItem;
	}
}

export default MoniListItem;