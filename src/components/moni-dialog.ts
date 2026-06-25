import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only dialog. Renders a native `<dialog>` element. The consumer
 * opens/closes by calling the native `show()` / `showModal()` /
 * `close()` / `showPopover()` methods on the inner dialog via
 * `this.querySelector('dialog')` from the light DOM.
 *
 * Attributes:
 *  - open:   present → dialog[open]
 *  - side:   center (default) | top | right | bottom | left | max
 *  - size:   small | medium (default) | large
 *  - modal:  present → adds the `modal` class (used by BeerCSS)
 *  - title:  header text
 *
 * Slots:
 *  - default: body
 *  - header:  title
 *  - footer:  action buttons
 */
@customElement('moni-dialog')
export class MoniDialog extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ type: Boolean, reflect: true }) modal = false;
	@property({ reflect: true })
	side: 'center' | 'top' | 'right' | 'bottom' | 'left' | 'max' = 'center';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';
	@property({ reflect: true }) title = '';

	@query('dialog') private _dialog!: HTMLDialogElement;

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
