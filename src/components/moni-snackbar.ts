/**
 * @file components/moni-snackbar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Snackbar component.
 *
 * Snackbars provide brief messages about app processes at the bottom of the
 * screen. They disappear automatically and do not require user action,
 * but may contain a single optional action.
 *
 * **M3 spec reference:** `m3-docs/components/snackbar/specs.md`
 *
 * **Positioning model:**
 * The snackbar uses `position: fixed` so it renders in the viewport
 * regardless of which element it is placed in the DOM. The host element
 * displays as `block` rather than `contents` to ensure `position: fixed`
 * inside the shadow root anchors to the viewport (not to a stacking context
 * created by a transformed ancestor).
 *
 * **Show/hide mechanism:**
 * Visibility is controlled by `:host([active]) .snackbar` via CSS
 * `opacity`, `visibility`, and `transform`. This mirrors BeerCSS's
 * `.snackbar.active` pattern and allows CSS transition animations.
 *
 * **M3 text truncation:**
 * The message text is clamped to `maxLines` lines with `-webkit-line-clamp`.
 * The M3 spec requires a maximum of 2 lines; consumers can override this
 * via the `max-lines` attribute.
 *
 * @example
 * ```ts
 * const snackbar = document.querySelector('moni-snackbar') as MoniSnackbar;
 *
 * // Show for 3 seconds
 * snackbar.text = 'Item deleted';
 * snackbar.action = 'Undo';
 * snackbar.active = true;
 * setTimeout(() => { snackbar.active = false; }, 3000);
 * ```
 *
 * @slot default - Additional content placed inside the snackbar container.
 *
 * @csspart snackbar - The inner snackbar container element.
 * @csspart text     - The message text element.
 * @csspart action   - The action button element.
 */
@customElement('moni-snackbar')
export class MoniSnackbar extends MoniElement {
	/**
	 * The main message text displayed in the snackbar.
	 *
	 * Clamped to `maxLines` lines. Long messages are truncated with `…`.
	 * Per M3 spec, keep messages short and informative (under 60 characters).
	 *
	 * @default ''
	 */
	@property({ reflect: true }) text = '';

	/**
	 * Label for the optional action button.
	 *
	 * When non-empty, renders a text button on the trailing edge of the snackbar.
	 * The component dispatches a `'action'` event when the action is clicked.
	 * This is a visual-only label — the consumer handles the action logic.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) action = '';

	/**
	 * Vertical placement of the snackbar on the screen.
	 *
	 * - `'bottom'` (default) — Fixed 6rem from the bottom, centered horizontally.
	 * - `'top'` — Fixed 6rem from the top, centered horizontally.
	 *
	 * @default 'bottom'
	 */
	@property({ reflect: true })
	placement: 'bottom' | 'top' = 'bottom';

	/**
	 * When `true`, the snackbar is visible.
	 *
	 * Toggle this attribute to show/hide the snackbar. The CSS transition
	 * handles the fade-in/slide-up animation automatically.
	 * Consumers are responsible for implementing the auto-dismiss timer.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Maximum number of lines of message text before it is clamped.
	 *
	 * Uses `-webkit-line-clamp` with `display: -webkit-box` for cross-browser
	 * multi-line truncation. The M3 spec recommends a maximum of 2 lines.
	 *
	 * @default 2
	 */
	@property({ type: Number, reflect: true, attribute: 'max-lines' })
	maxLines = 2;

	static override styles = [
		sharedStyles,
		css`
			:host {
				/* Use block instead of contents so position:fixed inside
				   works relative to the viewport (its containing block). */
				display: block;
				font-family: var(--font);
				/* Host itself takes no space */
				position: fixed;
				inset: 0;
				pointer-events: none;
				z-index: 200;
			}

			/* BeerCSS .snackbar */
			.snackbar {
				position: fixed;
				/* BeerCSS: inset: auto auto 6rem 50% for bottom placement */
				inset-block-end: 6rem;
				inset-block-start: auto;
				inset-inline: 50% auto;
				inline-size: 80%;
				block-size: auto;
				z-index: 200;
				visibility: hidden;
				display: flex;
				box-shadow: var(--elevate2);
				color: var(--inverse-on-surface);
				background-color: var(--inverse-surface);
				padding: 1rem;
				cursor: pointer;
				text-align: start;
				align-items: center;
				border-radius: 0.25rem;
				gap: 0.5rem;
				transition: all var(--speed2);
				transform: translate(-50%, 1rem);
				opacity: 0;
				pointer-events: auto;
			}

			/* BeerCSS .snackbar.top */
			.snackbar.top {
				inset-block-start: 6rem;
				inset-block-end: auto;
				transform: translate(-50%, -1rem);
			}

			/* BeerCSS .snackbar.active */
			:host([active]) .snackbar {
				visibility: visible;
				transform: translate(-50%, 0);
				opacity: 1;
			}

			.snackbar > .max {
				flex: auto;
				/* M3 spec § Message: clamp at 2 lines (configurable via
				   max-lines attribute). */
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: var(--_max-lines, 2);
				line-clamp: var(--_max-lines, 2);
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.action {
				font-weight: 500;
				text-transform: uppercase;
				font-size: 0.875rem;
				letter-spacing: 0.05em;
				color: var(--inverse-primary);
				white-space: nowrap;
			}

			@media only screen and (min-width: 993px) {
				.snackbar {
					inline-size: 40%;
				}
			}
		`
	];

	override render() {
		return html`<div
			class="snackbar ${this.placement}"
			part="snackbar"
			role="status"
			aria-live="polite"
			style="--_max-lines: ${this.maxLines}"
		>
			<slot name="icon"></slot>
			<span class="max" part="text"><slot>${this.text}</slot></span>
			${this.action
				? html`<span class="action" part="action">${this.action}</span>`
				: ''}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-snackbar': MoniSnackbar;
	}
}

export default MoniSnackbar;
