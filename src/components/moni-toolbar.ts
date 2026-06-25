import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 Toolbar (`m3-docs/components/top-app-bar/specs.md`).
 *
 * This is the larger/top-level variant. If you need the compact
 * Navigation Bar at the bottom of the screen, use `<moni-app-bar>`.
 *
 * Supported M3 types:
 *  - **standard** (default): 64dp height, flat surface color, bottom shadow.
 *  - **floating**: 4dp margin, rounded 8dp corners, elevated.
 *
 * Slots:
 *  - default:       title / center content.
 *  - leading:       navigation icon/button.
 *  - trailing:      action icons/buttons.
 *  - action-button: floating action button (moni-fab) anchored right.
 *
 * Attributes:
 *  - type:   standard (default) | floating
 *  - scroll: true | false (default). When true, elevation increases on scroll.
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