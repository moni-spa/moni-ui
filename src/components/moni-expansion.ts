/**
 * @file components/moni-expansion.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Expansion panel component.
 *
 * A lightweight wrapper around the native HTML `<details>` and `<summary>`
 * elements, styled according to M3 surface and elevation guidelines.
 * Expansion panels contain creation flows and allow lightweight editing of an element.
 *
 * **Visual architecture:**
 * The component renders a `<details>` element with a `<summary>` that acts
 * as the expandable header. The default slot content is placed inside the
 * `<details>` tag (but outside the `<summary>`), naturally hiding and showing
 * based on the native behavior. An M3 `expand_more` icon is added via a CSS
 * `::after` pseudo-element and rotates when the panel is open.
 *
 * **Usage:**
 * Set the `title` attribute for a simple text header, or use the `summary`
 * slot to project custom rich content (like icons or secondary text) into the
 * header area.
 *
 * @example
 * ```html
 * <!-- Simple text title -->
 * <moni-expansion title="Advanced Settings">
 *   <p>Enable developer mode features here.</p>
 * </moni-expansion>
 *
 * <!-- Rich summary content via slot -->
 * <moni-expansion open>
 *   <div slot="summary" style="display: flex; gap: 8px;">
 *     <moni-icon>person</moni-icon>
 *     <span>Personal Information</span>
 *   </div>
 *   <form>
 *     <moni-text-field label="Name"></moni-text-field>
 *   </form>
 * </moni-expansion>
 * ```
 *
 * @slot default - The content of the expansion panel body.
 * @slot summary - Custom header content (overrides the `title` attribute).
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
