/**
 * @file components/moni-tabs.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Tabs container component.
 *
 * A navigational container that groups multiple `<moni-tab>` elements. Tabs
 * organize content into high-level categories and allow the user to switch
 * between them.
 *
 * **M3 spec reference:** `m3-docs/components/tabs/specs.md`
 *
 * **Modes (Primary vs Secondary):**
 * - `primary` (default): Used for top-level navigation at the highest hierarchy,
 *   often placed directly below a top app bar. They span the full width and
 *   feature a prominent active indicator.
 * - `secondary`: Used for deeper content hierarchies within a specific area
 *   or page. They are typically more subtle.
 *
 * **Layout & Alignment:**
 * - `scrollable`: If the number of tabs exceeds the container width, this
 *   enables horizontal scrolling (`overflow-x: auto`) rather than squishing.
 * - `align`: Controls how the tabs are distributed (`default` space-around,
 *   `left`, `center`, or `right`).
 * - `vertical`: Stacks the icon above the text label inside the child tabs.
 *
 * **Active Indicator:**
 * The `indicator-size` attribute allows customizing the width of the active
 * underline indicator (`default` fits the tab content, `min` is narrow, `max`
 * fills the full tab width).
 *
 * @example
 * ```html
 * <!-- Primary, scrollable tabs -->
 * <moni-tabs scrollable>
 *   <moni-tab active label="Flights"></moni-tab>
 *   <moni-tab label="Trips"></moni-tab>
 *   <moni-tab label="Explore"></moni-tab>
 * </moni-tabs>
 *
 * <!-- Secondary, centered tabs with vertical layout -->
 * <moni-tabs mode="secondary" align="center" vertical>
 *   <moni-tab active icon="video_camera_front" label="Video"></moni-tab>
 *   <moni-tab icon="photo_camera" label="Photo"></moni-tab>
 * </moni-tabs>
 * ```
 *
 * @slot default - `<moni-tab>` child elements.
 */
@customElement('moni-tabs')
export class MoniTabs extends MoniElement {
	@property({ reflect: true })
	mode: 'primary' | 'secondary' = 'primary';
	@property({ type: Boolean, reflect: true }) scrollable = false;
	@property({ type: Boolean, reflect: true }) vertical = false;
	@property({ reflect: true })
	align: 'default' | 'left' | 'center' | 'right' = 'default';
	@property({ reflect: true, attribute: 'indicator-size' })
	indicatorSize: 'default' | 'min' | 'max' = 'default';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			nav {
				display: flex;
				white-space: nowrap;
				border-block-end: 0.0625rem solid var(--surface-variant);
				border-radius: 0;
				overflow-x: auto;
			}

			nav.left-align {
				justify-content: flex-start;
			}
			nav.center-align {
				justify-content: center;
			}
			nav.right-align {
				justify-content: flex-end;
			}
			:host(:not([align])) nav,
			nav:not(.left-align):not(.center-align):not(.right-align) {
				justify-content: space-around;
			}

			:host([vertical]) nav {
				flex-direction: column;
				border-block-end: none;
				border-inline-end: 0.0625rem solid var(--surface-variant);
				overflow-x: visible;
				overflow-y: auto;
			}
		`
	];

	override render() {
		const classes = [
			'tabs',
			this.align === 'default' ? '' : `${this.align}-align`,
			this.indicatorSize === 'default' ? '' : this.indicatorSize,
			this.mode,
			this.vertical ? 'vertical' : ''
		]
			.filter(Boolean)
			.join(' ');
		return html`<nav class=${classes} part="tabs">
			<slot></slot>
		</nav>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tabs': MoniTabs;
	}
}

export default MoniTabs;
