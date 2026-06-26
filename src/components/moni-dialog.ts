/**
 * @file components/moni-dialog.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Dialog component.
 *
 * Dialogs inform users about a task and can contain critical information,
 * require decisions, or involve multiple tasks. They interrupt the user's
 * workflow and should be used sparingly.
 *
 * **M3 spec reference:** `m3-docs/components/dialogs/specs.md`
 *
 * **Implementation note — native `<dialog>` element:**
 * This component wraps the native `<dialog>` HTML element. Opening and closing
 * are controlled via the `open` attribute (and its JS property). The component
 * syncs `open` changes to the native `<dialog>` in `updated()`:
 * - `modal=true` → calls `dialog.showModal()` (blocks focus, adds backdrop).
 * - `modal=false` → calls `dialog.show()` (non-blocking, no backdrop).
 * - `open=false` → calls `dialog.close()`.
 *
 * **Placement (`side` attribute):**
 * - `center` (default) — Centered in the viewport. Standard M3 dialog.
 * - `top`, `right`, `bottom`, `left` — Edge-anchored panels (side sheet pattern).
 * - `max` — Full-screen dialog for complex flows.
 *
 * @example
 * ```html
 * <!-- Basic modal dialog -->
 * <moni-dialog open modal title="Delete item?" size="small">
 *   <p>This action cannot be undone.</p>
 *   <div slot="footer">
 *     <moni-button variant="text">Cancel</moni-button>
 *     <moni-button>Delete</moni-button>
 *   </div>
 * </moni-dialog>
 * ```
 *
 * @slot default - The dialog body content.
 * @slot header  - Custom header content (overrides `title` attribute).
 * @slot footer  - Action buttons row at the bottom of the dialog.
 *
 * @csspart dialog - The native `<dialog>` element.
 * @csspart header - The header container.
 * @csspart body   - The body content wrapper.
 * @csspart footer - The footer actions wrapper.
 */
@customElement('moni-dialog')
export class MoniDialog extends MoniElement {
	/**
	 * Controls the open/closed state of the dialog.
	 *
	 * When set to `true`, the component calls `dialog.showModal()` (if `modal`)
	 * or `dialog.show()`. When set to `false`, calls `dialog.close()`.
	 * Reflected as an HTML attribute for CSS and external state readers.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) open = false;

	/**
	 * When `true`, opens the dialog as a modal using `<dialog>.showModal()`.
	 *
	 * Modal dialogs:
	 * - Block keyboard focus from leaving the dialog.
	 * - Render a `::backdrop` scrim over the rest of the page.
	 * - Can be closed by pressing `Escape` (native browser behavior).
	 *
	 * When `false`, uses `<dialog>.show()` which is non-blocking (no focus trap
	 * and no backdrop).
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) modal = false;

	/**
	 * Placement of the dialog within the viewport.
	 *
	 * - `'center'` (default) — Centered. Standard M3 dialog placement.
	 * - `'top'`    — Anchored to the top edge (drawer from top).
	 * - `'right'`  — Anchored to the right edge (side sheet pattern).
	 * - `'bottom'` — Anchored to the bottom edge (bottom sheet alternative).
	 * - `'left'`   — Anchored to the left edge (navigation drawer pattern).
	 * - `'max'`    — Full-screen (covers the entire viewport).
	 *
	 * @default 'center'
	 */
	@property({ reflect: true })
	side: 'center' | 'top' | 'right' | 'bottom' | 'left' | 'max' = 'center';

	/**
	 * Size of the dialog container.
	 *
	 * - `'small'`  — Narrow dialog; ideal for simple confirmations.
	 * - `'medium'` — Standard dialog width (default).
	 * - `'large'`  — Wide dialog; for forms or complex content.
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Text displayed in the dialog header area.
	 *
	 * When non-empty, renders as a styled heading inside the header container.
	 * The `header` slot takes precedence over this attribute when both are present.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/** Direct reference to the native `<dialog>` element for programmatic access. */
	@query('dialog') private _dialog!: HTMLDialogElement;

	/**
	 * Syncs the `open` and `modal` state to the native `<dialog>` element.
	 *
	 * Called by Lit after every render cycle where tracked properties change.
	 * Avoids calling `showModal()` or `show()` if the dialog is already open
	 * (prevents the `InvalidStateError` DOMException).
	 *
	 * @param changed - Map of changed property names to their previous values.
	 */
	override updated(changed: Map<string, unknown>) {
		if (changed.has('open') && this._dialog) {
			if (this.open) {
				if (this.modal) {
					if (!this._dialog.open) {
						this._dialog.showModal();
					}
				} else {
					if (!this._dialog.open) {
						this._dialog.show();
					}
				}
			} else {
				if (this._dialog.open) {
					this._dialog.close();
				}
			}
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				--_padding: 1.5rem;
				--_top: calc(var(--_padding) + env(safe-area-inset-top, 0));
				--_bottom: calc(var(--_padding) + env(safe-area-inset-bottom, 0));
				display: block;
				visibility: hidden;
				border: none;
				opacity: 0;
				position: fixed;
				box-shadow: var(--elevate2);
				color: var(--on-surface);
				background-color: var(--surface-container-high);
				padding: var(--_padding);
				z-index: 100;
				inset: 10% auto auto 50%;
				min-inline-size: 20rem;
				max-inline-size: 100%;
				max-block-size: 80%;
				overflow-x: hidden;
				overflow-y: auto;
				transition: all var(--speed3), 0s background-color;
				border-radius: 1.75rem;
				transform: translate(-50%, -4rem);
				outline: none;
			}

			dialog[open] {
				visibility: visible;
				opacity: 1;
				transform: translate(-50%, 0);
			}

			dialog::backdrop {
				display: block !important;
				opacity: 0;
				visibility: hidden;
				position: fixed;
				inset: 0;
				color: var(--on-surface);
				background-color: rgb(0 0 0 / 0.5);
				z-index: 100;
				transition: all var(--speed3), 0s background-color;
				border-radius: 0;
			}

			dialog[open]::backdrop {
				opacity: 1;
				visibility: visible;
			}

			dialog:is(.top, .right, .bottom, .left, .max) {
				--_padding: 1rem;
			}

			dialog.top,
			dialog.bottom {
				opacity: 1;
				block-size: auto;
				inline-size: 100%;
				min-inline-size: auto;
				max-block-size: 100%;
			}
			dialog.top {
				inset: 0 auto auto 0;
				transform: translateY(-100%);
				border-radius: 0 0 1rem 1rem;
				padding-block-start: var(--_top);
			}
			dialog.bottom {
				inset: auto auto 0 0;
				transform: translateY(100%);
				border-radius: 1rem 1rem 0 0;
				padding-block-end: var(--_bottom);
			}

			dialog:is(.left, .right) {
				opacity: 1;
				inset: 0 auto auto 0;
				inline-size: auto;
				block-size: 100%;
				max-block-size: 100%;
				background-color: var(--surface);
				padding-block: var(--_top) var(--_bottom);
			}
			dialog.left {
				inset: 0 auto auto 0;
				border-radius: 0 1rem 1rem 0;
				transform: translateX(-100%);
			}
			dialog.right {
				inset: 0 0 auto auto;
				border-radius: 1rem 0 0 1rem;
				transform: translateX(100%);
			}

			dialog.max {
				inset: 0 auto auto 0;
				inline-size: 100%;
				block-size: 100%;
				max-inline-size: 100%;
				max-block-size: 100%;
				transform: translateY(4rem);
				background-color: var(--surface);
				border-radius: 0;
				padding-block: var(--_top) var(--_bottom);
			}

			dialog[open]:is(.left, .right, .top, .bottom, .max) {
				transform: translate(0, 0);
			}

			dialog.small {
				inline-size: 25%;
			}
			dialog.medium {
				inline-size: 50%;
			}
			dialog.large {
				inline-size: 75%;
			}
			dialog.small:is(.left, .right) {
				inline-size: 20rem;
			}
			dialog.medium:is(.left, .right) {
				inline-size: 32rem;
			}
			dialog.large:is(.left, .right) {
				inline-size: 44rem;
			}
			dialog.small:is(.top, .bottom) {
				block-size: 16rem;
			}
			dialog.medium:is(.top, .bottom) {
				block-size: 24rem;
			}
			dialog.large:is(.top, .bottom) {
				block-size: 32rem;
			}

			header,
			footer {
				display: grid;
				align-content: center;
				border-radius: 0;
				padding: 0;
			}
			header {
				min-block-size: 3rem;
			}
			footer {
				min-block-size: 3.5rem;
			}
		`
	];

	override render() {
		const classes = [this.side, this.size, this.modal ? 'modal' : '']
			.filter(Boolean)
			.join(' ');
		return html`<dialog
			part="dialog"
			class=${classes}
		>
			<header part="header">
				<slot name="header">${this.title}</slot>
			</header>
			<div part="content"><slot></slot></div>
			<footer part="footer"><slot name="footer"></slot></footer>
		</dialog>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-dialog': MoniDialog;
	}
}

export default MoniDialog;
