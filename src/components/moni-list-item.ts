import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material 3 List Item (`m3-docs/components/lists/specs.md`).
 *
 * One row in a `<moni-list>`. Supports up to 3 lines of text:
 *  - line 1: headline (required).
 *  - line 2: supporting text (optional).
 *  - line 3: trailing meta text (optional).
 *
 * Plus optional leading/trailing icons or avatars.
 *
 * M3 measurements:
 *  - Min height: 56dp (1-line), 72dp (2-line), 88dp (3-line).
 *  - Horizontal padding: 16dp.
 *  - Vertical padding: 8dp top/bottom (so 1-line is 56dp tall).
 *  - Leading icon/avatar size: 24dp.
 *
 * Attributes:
 *  - lines: 1 (default) | 2 | 3
 *  - icon:   Material Symbols name (leading icon)
 *  - avatar: URL for a leading image
 *  - trailing-icon: Material Symbols name (trailing icon)
 *  - active:   present → background uses secondary-container
 *  - disabled: present → opacity 38%, cursor not-allowed
 *  - href:     present → renders as <a>; otherwise <button>
 *
 * Slots:
 *  - default:   headline (line 1)
 *  - supporting:line 2 text
 *  - meta:      line 3 text
 *  - trailing-meta: trailing small text (right side)
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