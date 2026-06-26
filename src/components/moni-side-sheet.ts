/**
 * @file components/moni-side-sheet.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-button.js';

/**
 * Material Design 3 Side Sheet component.
 *
 * Side sheets show supplementary content that is anchored to the left or right
 * edge of the screen. They can be standard (inline with content) or modal
 * (overlaying content with a scrim).
 *
 * **M3 spec reference:** `m3-docs/components/side-sheets/specs.md`
 *
 * **Dialog behavior:**
 * Internally, this component uses the native HTML `<dialog>` element for robust
 * accessibility, focus trapping, and top-layer rendering.
 * - When `modal=true`, the sheet uses `dialog.showModal()`, rendering a scrim
 *   backdrop and trapping focus. Pressing `Escape` closes it.
 * - When `modal=false`, the sheet uses `dialog.show()` and remains interactive
 *   alongside the main page content.
 *
 * **Drag & Resize (Moni feature):**
 * Setting the `with-handle` attribute adds a draggable grab handle to the inner
 * edge of the sheet. Users can click and drag this handle to resize the sheet's
 * width up to the `max-width` limit. If the user drags the sheet towards the
 * screen edge quickly or beyond a certain threshold, it automatically closes.
 *
 * **Animations:**
 * Side sheets slide in from the specified `side` (`left` or `right`). The open
 * and close animations are handled via CSS transitions tied to the `open` property.
 *
 * @fires close - Fired when the side sheet is completely closed (after animations
 *                finish), either via the close button, scrim click, drag-to-close,
 *                or `Escape` key.
 *
 * @example
 * ```html
 * <!-- Modal side sheet on the right -->
 * <moni-side-sheet id="details-sheet" modal title="Item Details">
 *   <p>Here is more information about the selected item.</p>
 *   <div slot="footer">
 *     <moni-button>Save</moni-button>
 *   </div>
 * </moni-side-sheet>
 *
 * <!-- Resizable, detached side sheet on the left -->
 * <moni-side-sheet side="left" detached with-handle max-width="50vw">
 *   <p>Navigation options</p>
 * </moni-side-sheet>
 * ```
 *
 * @slot default - Main body content.
 * @slot header  - Custom header content (overrides `title`, close/back buttons remain).
 * @slot footer  - Bottom-anchored action area.
 */
@customElement('moni-side-sheet')
export class MoniSideSheet extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ type: Boolean, reflect: true }) modal = false;
	@property({ reflect: true }) side: 'right' | 'left' = 'right';
	@property({ reflect: true }) title = '';
	@property({ type: Boolean, reflect: true }) detached = false;
	@property({ type: Boolean, reflect: true, attribute: 'show-back' }) showBack = false;
	@property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder = false;
	@property({ type: Boolean, reflect: true, attribute: 'with-handle' }) withHandle = false;
	@property({ type: Boolean, reflect: true, attribute: 'hide-close' }) hideClose = false;
	@property({ reflect: true, attribute: 'expanded-width' }) expandedWidth = '600px';
	@property({ reflect: true, attribute: 'max-width' }) maxWidth = '';

	@query('dialog') private _dialog!: HTMLDialogElement;

	private _isDragging = false;
	private _startX = 0;
	private _currentTranslationX = 0;
	private _sheetWidth = 0;
	private _defaultWidth = 0;
	private _justDragged = false;

	private _getMaxWidthPx(): number {
		const val = this.expandedWidth || '600px';
		if (val.endsWith('%')) {
			return window.innerWidth * (parseFloat(val) / 100);
		}
		if (val.endsWith('vw')) {
			return window.innerWidth * (parseFloat(val) / 100);
		}
		if (val.endsWith('px')) {
			return parseFloat(val);
		}
		return 600;
	}

	override updated(changedProperties: PropertyValues) {
		super.updated(changedProperties);

		if (changedProperties.has('expandedWidth')) {
			this.style.setProperty('--moni-side-sheet-expanded-width', this.expandedWidth);
		}
		if (changedProperties.has('maxWidth')) {
			this.style.setProperty('--moni-side-sheet-max-width', this.maxWidth || '400px');
		}

		if (changedProperties.has('open') && this._dialog) {
			if (this.open) {
				if (this.modal) {
					if (!this._dialog.open) {
						if (typeof this._dialog.showModal === 'function') {
							this._dialog.showModal();
						} else {
							this._dialog.open = true;
						}
					}
				} else {
					if (!this._dialog.open) {
						if (typeof this._dialog.show === 'function') {
							this._dialog.show();
						} else {
							this._dialog.open = true;
						}
					}
				}
				// Force layout reflow before adding class
				this._dialog.getBoundingClientRect();
				this._dialog.classList.add('opened');
			} else {
				if (this._dialog.open) {
					this._dialog.classList.remove('opened');
					const onTransitionEnd = (e: TransitionEvent) => {
						if (e.target === this._dialog && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
							this._dialog.removeEventListener('transitionend', onTransitionEnd);
							if (!this.open && this._dialog.open) {
								this._dialog.classList.remove('expanded');
								this._dialog.close();
							}
						}
					};
					this._dialog.addEventListener('transitionend', onTransitionEnd);
					// Fallback safety
					setTimeout(() => {
						if (!this.open && this._dialog.open) {
							this._dialog.classList.remove('expanded');
							this._dialog.close();
						}
					}, 350);
				}
			}
		}
	}

	private _onPointerDown(e: PointerEvent) {
		if (!this.withHandle) return;
		const target = e.target as HTMLElement;
		if (!target.closest('.handle') && !target.closest('header')) return;

		this._isDragging = true;
		this._startX = e.clientX;
		this._sheetWidth = this._dialog.getBoundingClientRect().width;
		this._currentTranslationX = 0;

		const isExpanded = this._dialog.classList.contains('expanded');
		if (!isExpanded) {
			this._defaultWidth = this._sheetWidth;
		}

		target.setPointerCapture(e.pointerId);
		this._dialog.classList.add('dragging');
	}

	private _onPointerMove(e: PointerEvent) {
		if (!this._isDragging) return;

		const deltaX = e.clientX - this._startX;
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxWidthPx = this._getMaxWidthPx();
		const shrinkDelta = this.side === 'right' ? deltaX : -deltaX;

		if (isExpanded) {
			if (shrinkDelta > 0) {
				// Dragging to shrink width
				const newWidth = this._sheetWidth - shrinkDelta;
				this._dialog.style.transform = '';
				this._dialog.style.width = `${Math.max(0, newWidth)}px`;
			} else {
				// Pulling to expand beyond limit (resistance)
				const newWidth = this._sheetWidth - shrinkDelta * 0.2;
				this._dialog.style.width = `${Math.min(maxWidthPx, newWidth)}px`;
			}
		} else {
			if (shrinkDelta > 0) {
				// Dragging to close: translate
				this._currentTranslationX = shrinkDelta;
				this._dialog.style.transform = `translateX(${this.side === 'right' ? shrinkDelta : -shrinkDelta}px)`;
				this._dialog.style.width = '';
			} else {
				// Dragging to grow width
				const newWidth = this._sheetWidth - shrinkDelta;
				this._dialog.style.transform = '';
				this._dialog.style.width = `${Math.min(maxWidthPx, newWidth)}px`;
			}
		}
	}

	private _onPointerUp(e: PointerEvent) {
		if (!this._isDragging) return;

		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');

		const deltaX = e.clientX - this._startX;
		if (Math.abs(deltaX) > 5) {
			this._justDragged = true;
			setTimeout(() => {
				this._justDragged = false;
			}, 50);
		}

		const isExpanded = this._dialog.classList.contains('expanded');
		const maxWidthPx = this._getMaxWidthPx();
		const shrinkDelta = this.side === 'right' ? deltaX : -deltaX;

		if (isExpanded) {
			const finalWidth = this._sheetWidth - shrinkDelta;
			if (finalWidth < this._defaultWidth - 80) {
				this._dialog.classList.remove('expanded');
				this._dialog.classList.remove('opened');
				this._dialog.style.transform = this.side === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
				this._dialog.style.width = '';
				
				const onTransitionEnd = () => {
					this._dialog.removeEventListener('transitionend', onTransitionEnd);
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
					this.open = false;
					this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
				};
				this._dialog.addEventListener('transitionend', onTransitionEnd);
				setTimeout(() => { if (this.open) onTransitionEnd(); }, 300);
			} else if (finalWidth < (maxWidthPx + this._defaultWidth) / 2) {
				this._dialog.classList.remove('expanded');
				this._dialog.style.transform = '';
				this._dialog.style.width = '';
			} else {
				this._dialog.style.transform = '';
				this._dialog.style.width = '';
			}
		} else {
			if (shrinkDelta < 0) {
				const finalWidth = this._sheetWidth - shrinkDelta;
				const threshold = (maxWidthPx + this._sheetWidth) / 2;
				if (finalWidth > threshold || -shrinkDelta > 80) {
					this._dialog.classList.add('expanded');
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				} else {
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				}
			} else {
				const threshold = Math.min(150, this._sheetWidth * 0.4);
				if (Math.abs(this._currentTranslationX) > threshold) {
					this._dialog.classList.remove('opened');
					this._dialog.style.transform = this.side === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
					this._dialog.style.width = '';
					
					const onTransitionEnd = () => {
						this._dialog.removeEventListener('transitionend', onTransitionEnd);
						this._dialog.style.transform = '';
						this._dialog.style.width = '';
						this.open = false;
						this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
					};
					this._dialog.addEventListener('transitionend', onTransitionEnd);
					setTimeout(() => { if (this.open) onTransitionEnd(); }, 300);
				} else {
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				}
			}
		}
	}

	private _onPointerCancel(e: PointerEvent) {
		if (!this._isDragging) return;
		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');
		this._dialog.style.transform = '';
		this._dialog.style.width = '';
	}

	private _onCloseClick() {
		this.open = false;
		this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
	}

	private _onBackClick() {
		this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
	}

	private _onDialogClick(e: MouseEvent) {
		if (this._justDragged) {
			this._justDragged = false;
			return;
		}
		if (this.modal && e.target === this._dialog) {
			this._onCloseClick();
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				display: flex;
				flex-direction: column;
				border: none;
				position: fixed;
				top: 0;
				bottom: 0;
				block-size: 100vh;
				inline-size: 100%;
				max-inline-size: var(--moni-side-sheet-max-width, 400px);
				background-color: var(--surface);
				color: var(--on-surface);
				box-sizing: border-box;
				padding: 0;
				margin: 0;
				z-index: 90;
				outline: none;
				overflow: hidden;
				transition:
					transform var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					width var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					max-width var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					opacity var(--speed3),
					visibility var(--speed3);
				opacity: 0;
				visibility: hidden;
			}

			dialog.dragging {
				transition: none !important;
			}

			dialog.expanded {
				max-inline-size: var(--moni-side-sheet-expanded-width, 600px) !important;
			}

			/* Alignments */
			dialog.right {
				right: 0;
				left: auto;
				transform: translateX(100%);
				border-left: 1px solid var(--outline-variant);
				border-radius: 1.75rem 0 0 1.75rem;
			}

			dialog.left {
				left: 0;
				right: auto;
				transform: translateX(-100%);
				border-right: 1px solid var(--outline-variant);
				border-radius: 0 1.75rem 1.75rem 0;
			}

			/* Detached alignment */
			dialog.detached {
				top: 16px;
				bottom: 16px;
				block-size: calc(100vh - 32px);
				border-radius: 1.75rem !important;
				border: 1px solid var(--outline-variant);
				box-shadow: var(--elevate1);
			}

			dialog.detached.right {
				right: 16px;
			}

			dialog.detached.left {
				left: 16px;
			}

			/* Borders overrides */
			dialog.no-border {
				border: none !important;
			}

			/* Modal Styles */
			dialog.modal {
				background-color: var(--surface-container-low);
				box-shadow: var(--elevate3);
				z-index: 100;
			}

			/* Backdrop for Modal */
			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.4);
				opacity: 0;
				transition: opacity var(--speed3);
			}

			/* Opened State */
			dialog.opened {
				opacity: 1;
				visibility: visible;
				transform: translateX(0);
			}

			dialog.opened::backdrop {
				opacity: 1;
			}

			/* Drag handle */
			.handle {
				position: absolute;
				top: 50%;
				width: 4px;
				height: 48px;
				background: var(--outline-variant);
				border-radius: 999px;
				cursor: grab;
				transform: translateY(-50%);
				touch-action: none;
				z-index: 10;
				opacity: 0.8;
				transition: background-color var(--speed1);
			}
			.handle:hover {
				background: var(--on-surface-variant);
			}
			.handle:active {
				background: var(--on-surface-variant);
				cursor: grabbing;
			}

			dialog.right .handle {
				left: 6px;
			}

			dialog.left .handle {
				right: 6px;
			}

			/* Header & Spacing */
			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 1.25rem 1.5rem 0.75rem;
				gap: 0.5rem;
				cursor: grab;
				touch-action: none;
				user-select: none;
			}
			header:active {
				cursor: grabbing;
			}

			.header-start {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				flex: 1;
			}

			.headline {
				font-size: 1.5rem;
				font-weight: 400;
				margin: 0;
				color: var(--on-surface);
			}

			.content {
				flex: 1;
				overflow-y: auto;
				padding: 0 1.5rem 1.5rem;
			}

			footer {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 1rem 1.5rem 1.5rem;
				gap: 0.5rem;
				border-top: 1px solid var(--outline-variant);
			}

			footer.no-border {
				border-top: none !important;
			}

			/* If no footer slot is passed, hide it */
			footer:not(:has(slot[name="footer"])) {
				display: none;
			}
		`
	];

	override render() {
		const classes = [
			this.side,
			this.modal ? 'modal' : 'standard',
			this.detached ? 'detached' : '',
			this.noBorder ? 'no-border' : ''
		].filter(Boolean).join(' ');

		return html`
			<dialog
				part="dialog"
				?open=${this.open}
				class=${classes}
				@click=${this._onDialogClick}
				@pointerdown=${this._onPointerDown}
				@pointermove=${this._onPointerMove}
				@pointerup=${this._onPointerUp}
				@pointercancel=${this._onPointerCancel}
			>
				${this.withHandle ? html`<div class="handle" aria-hidden="true"></div>` : ''}
				<header part="header">
					<div class="header-start">
						${this.showBack
							? html`
									<moni-button
										variant="icon"
										@click=${this._onBackClick}
										aria-label="Volver"
									>
										<moni-icon>arrow_back</moni-icon>
									</moni-button>
							  `
							: ''}
						<slot name="header">
							<h2 class="headline">${this.title}</h2>
						</slot>
					</div>
					${!this.hideClose
						? html`
								<moni-button
									variant="icon"
									@click=${this._onCloseClick}
									aria-label="Cerrar"
								>
									<moni-icon>close</moni-icon>
								</moni-button>
						  `
						: ''}
				</header>
				<div class="content" part="content">
					<slot></slot>
				</div>
				<footer class=${this.noBorder ? 'no-border' : ''} part="footer">
					<slot name="footer"></slot>
				</footer>
			</dialog>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-side-sheet': MoniSideSheet;
	}
}

export default MoniSideSheet;
