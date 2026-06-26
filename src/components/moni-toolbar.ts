/**
 * @file components/moni-toolbar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Top App Bar (Toolbar) component.
 *
 * Top app bars display information and actions at the top of a screen.
 * They are used for branding, screen titles, navigation, and actions.
 *
 * **M3 spec reference:** `m3-docs/components/top-app-bar/specs.md`
 *
 * **Note:** This is the standard top-level toolbar. For bottom navigation
 * bars (often used on mobile), use `<moni-app-bar>`.
 *
 * **Variants:**
 * - `standard` (default): A full-width bar (64dp height) that sits flush
 *   against the top of the screen.
 * - `floating`: A detached bar with a 4dp margin and rounded 8dp corners,
 *   appearing to float above the content.
 *
 * **Scroll behavior:**
 * When the `scroll` attribute is present, the toolbar visually responds to
 * scrolling by increasing its elevation (shadow) and dynamically shifting
 * its surface color to indicate depth over the scrolling content.
 *
 * @example
 * ```html
 * <!-- Standard toolbar with navigation and actions -->
 * <moni-toolbar title="Inbox">
 *   <moni-icon-button slot="leading" icon="menu"></moni-icon-button>
 *   <moni-icon-button slot="trailing" icon="search"></moni-icon-button>
 *   <moni-icon-button slot="trailing" icon="more_vert"></moni-icon-button>
 * </moni-toolbar>
 *
 * <!-- Floating toolbar with an attached FAB -->
 * <moni-toolbar type="floating" title="Notes">
 *   <moni-fab slot="action-button" icon="add"></moni-fab>
 * </moni-toolbar>
 * ```
 *
 * @slot default       - The title text or center content.
 * @slot leading       - Navigation icon/button placed on the far left.
 * @slot trailing      - Action icons/buttons placed on the far right.
 * @slot action-button - A floating action button (FAB) anchored to the right side.
 */
@customElement('moni-toolbar')
export class MoniToolbar extends MoniElement {
	@property({ reflect: true })
	type: 'standard' | 'floating' = 'standard';
	@property({ type: Boolean, reflect: true, attribute: 'scroll' })
	scrolled = false;
	@property({ reflect: true }) title = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				position: relative;
				z-index: var(--z-index-toolbar, 1000);
			}

			.container {
				display: flex;
				align-items: center;
				gap: 1rem;
				block-size: 4rem;
				padding-inline: 0.25rem;
				padding-block: 0.5rem;
				background-color: var(--surface-container);
				color: var(--on-surface);
				font-family: var(--font);
				transition: box-shadow var(--speed2), background-color var(--speed2);
			}

			:host([type='standard']) .container {
				box-shadow: var(--shadow1);
			}

			:host([type='floating']) .container {
				margin: 0.25rem;
				border-radius: 0.5rem;
				box-shadow: var(--shadow2);
			}

			:host([type='standard'][scroll]) .container {
				box-shadow: var(--shadow3);
			}

			.leading,
			.trailing {
				display: inline-flex;
				align-items: center;
				gap: 0.25rem;
				flex: none;
			}

			.title {
				flex: auto;
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding-inline-start: 0.75rem;
			}

			::slotted([slot='action-button']) {
				position: absolute;
				inset-block-end: -1.75rem;
				inset-inline-end: 1rem;
				z-index: 1;
			}
		`
	];

	override render() {
		return html`
			<header class="container" part="container">
				<span class="leading" part="leading"><slot name="leading"></slot></span>
				<span class="title" part="title">
					${this.title || html`<slot></slot>`}
				</span>
				<span class="trailing" part="trailing">
					<slot name="trailing"></slot>
				</span>
			</header>
			<slot name="action-button"></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-toolbar': MoniToolbar;
	}
}

export default MoniToolbar;