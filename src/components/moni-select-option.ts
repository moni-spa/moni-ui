/**
 * @file components/moni-select-option.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Select Option component.
 *
 * An individual selectable item designed to be placed inside a
 * `<moni-select>` dropdown.
 *
 * **Interaction and layout:**
 * Options are rendered as accessible `<li>` elements styled identically to
 * `<moni-menu-item>`. When slotted into a `<moni-select>`, the parent
 * component extracts their `value`, `label`, and `group` attributes to build
 * its internal data model and handles the actual selection logic, keyboard
 * navigation, and rendering within the dropdown popup.
 *
 * **Grouping:**
 * Options can be categorized into subcategories by providing a `group`
 * attribute. The parent `<moni-select>` uses this to automatically generate
 * group headers (`<moni-select-group>`) in the dropdown list.
 *
 * @example
 * ```html
 * <moni-select label="Favorite framework">
 *   <!-- Standard option -->
 *   <moni-select-option value="lit">Lit Element</moni-select-option>
 *
 *   <!-- Disabled option -->
 *   <moni-select-option value="react" disabled>React (not allowed)</moni-select-option>
 *
 *   <!-- Grouped option -->
 *   <moni-select-option value="vue" group="Other">Vue.js</moni-select-option>
 * </moni-select>
 * ```
 *
 * @slot default - The text label for the option. If the `label` attribute is
 *                omitted, the parent `<moni-select>` will read this slot's
 *                `textContent`.
 *
 * @csspart item - The outer `<li>` element.
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
