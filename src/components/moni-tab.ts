/**
 * @file components/moni-tab.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Tab component.
 *
 * An individual interactive tab element designed to be placed inside a
 * `<moni-tabs>` container. Tabs organize content across different screens,
 * data sets, and other interactions.
 *
 * **M3 spec reference:** `m3-docs/components/tabs/specs.md`
 *
 * **Visual layout & interaction:**
 * Internally renders as an `<a>` element to support native link behavior when
 * an `href` is provided, but behaves visually as a tab button. It displays a
 * text label and an optional Material icon. If the parent `<moni-tabs>` has the
 * `vertical` attribute set, the layout automatically adjusts to stack the icon
 * above the text.
 *
 * **State:**
 * The `active` attribute highlights the tab, applying the primary color to the
 * text and rendering the active indicator line (handled via CSS in the parent
 * container or pseudo-elements).
 *
 * @example
 * ```html
 * <moni-tabs>
 *   <moni-tab active icon="home" label="Home"></moni-tab>
 *   <moni-tab icon="settings" label="Settings" href="/settings"></moni-tab>
 * </moni-tabs>
 * ```
 *
 * @csspart tab - The inner `<a>` element acting as the tab button.
 */
@customElement('moni-tab')
export class MoniTab extends MoniElement {
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) href = '#';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
			}

			:host-context(moni-tabs[vertical]) {
				display: flex;
				inline-size: 100%;
			}

			a {
				position: relative;
				display: flex;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-surface-variant);
				padding: 0.5rem 1rem;
				text-align: center;
				min-block-size: 3rem;
				inline-size: 100%;
				gap: 0.25rem;
				text-decoration: none;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: color var(--speed2);
			}

			:host-context(moni-tabs[vertical]) a {
				flex-direction: column;
				gap: 0.25rem;
				min-block-size: 4.5rem;
				border-inline-end: 0.125rem solid transparent;
				border-block-end: none;
			}

			a:hover {
				color: var(--primary);
			}

			a.active,
			a.active > * {
				color: var(--primary);
			}

			a.active::before {
				content: '';
				position: absolute;
				inset: auto 0 0 0;
				/* M3 Expressive: indicator thickness 3dp. */
				block-size: 0.1875rem;
				/* M3 Expressive default: full tab width. */
				border-radius: 0.75rem;
				background-color: var(--primary);
			}

			:host-context(moni-tabs[vertical]) a.active::before {
				inset: 0 0 0 auto;
				inline-size: 0.1875rem;
				block-size: auto;
			}

			/* M3 indicator-size='min': 24dp tall (centered on tab) with
			   8dp top/bottom radius — matches M3 spec § Indicator anatomy. */
			:host-context(moni-tabs[indicator-size='min']) a.active::before {
				margin: 0 auto;
				max-inline-size: min(100%, 4rem);
				block-size: 1.5rem;
				border-radius: 0.5rem;
			}

			:host-context(moni-tabs[vertical][indicator-size='min'])
				a.active::before {
				margin: auto 0;
				max-block-size: 4rem;
				max-inline-size: 0.1875rem;
				border-radius: 0.5rem;
			}

			/* M3 indicator-size='max': full tab height, no rounding. */
			:host-context(moni-tabs[indicator-size='max']) a.active::before {
				border-radius: 0;
			}
		`
	];

	override render() {
		return html`<a
			href=${this.href || '#'}
			class=${this.active ? 'active' : ''}
			part="tab"
			aria-selected=${this.active}
		>
			${this.icon
				? html`<moni-icon name="${this.icon}" part="icon"></moni-icon>`
				: html`<slot name="icon"></slot>`}
			<span part="label"><slot>${this.label}</slot></span>
		</a>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tab': MoniTab;
	}
}

export default MoniTab;
