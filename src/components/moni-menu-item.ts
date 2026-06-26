/**
 * @file components/moni-menu-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Menu Item component.
 *
 * A single interactive item within a `<moni-menu>` or `<moni-context-menu>`.
 * It provides standard M3 menu item styling, hover states, and optional
 * leading icons.
 *
 * **M3 spec reference:** `m3-docs/components/menus/specs.md`
 *
 * **Interaction states:**
 * - Hover: applies an opacity layer.
 * - Active (`active=true`): applies a `tertiary-container` background highlight,
 *   useful for indicating the currently selected option in a list.
 * - Disabled (`disabled=true`): reduces opacity and disables pointer events.
 *
 * @example
 * ```html
 * <moni-menu-item icon="edit">Edit text</moni-menu-item>
 * <moni-menu-item icon="content_copy" disabled>Copy</moni-menu-item>
 * <moni-menu-item active>Currently selected</moni-menu-item>
 * ```
 *
 * @slot default - The text label for the menu item.
 *
 * @csspart item - The outer `<li>` element.
 * @csspart icon - The container for the leading icon.
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
