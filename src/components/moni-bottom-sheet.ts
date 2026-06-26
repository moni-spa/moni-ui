/**
 * @file components/moni-bottom-sheet.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Bottom Sheet component.
 *
 * Bottom sheets are surfaces anchored to the bottom of the screen that
 * supplement the main view. They display supplementary content, contextual
 * actions, or task flows without fully obscuring the primary content.
 *
 * **M3 spec reference:** `m3-docs/components/sheets-bottom/specs.md`
 *
 * **Implementation note — native `<dialog>` element:**
 * Like `<moni-dialog>`, this component wraps the native `<dialog>` element.
 * The `open` property drives `dialog.showModal()` / `dialog.close()`. When
 * `modal=true` (default), a `::backdrop` scrim is rendered automatically.
 *
 * **Teleportation (body-level mounting):**
 * When `positioning="body"` (default), the component moves itself to
 * `document.body` on `connectedCallback` so the fixed-bottom dialog renders
 * above all stacking contexts. On `disconnectedCallback`, it is moved back
 * to its original DOM position. This avoids clipping by `overflow: hidden`
 * or `transform` ancestors.
 *
 * **Sizes:**
 * - `small`  — Compact sheet; suitable for simple action menus.
 * - `medium` — Standard height (default).
 * - `large`  — Expanded height (`expandedHeight` controls the max block-size).
 * - `auto`   — Content-driven height.
 *
 * @example
 * ```html
 * <moni-bottom-sheet title="Share">
 *   <moni-list-item icon="share">Copy link</moni-list-item>
 *   <moni-list-item icon="mail">Send via email</moni-list-item>
 * </moni-bottom-sheet>
 *
 * <script>
 *   document.querySelector('moni-bottom-sheet').open = true;
 * </script>
 * ```
 *
 * @slot default - The body content of the bottom sheet.
 * @slot handle  - The drag handle area at the top of the sheet.
 * @slot footer  - Action buttons at the bottom of the sheet.
 *
 * @csspart dialog - The native `<dialog>` element.
 * @csspart header - The header container with title and close button.
 * @csspart body   - The scrollable body content area.
 * @csspart footer - The footer action buttons area.
 */
@customElement('moni-bottom-sheet')
export class MoniBottomSheet extends MoniElement {
	/**
	 * Controls the open/closed state of the bottom sheet.
	 *
	 * When set to `true`, calls `dialog.showModal()` or `dialog.show()`
	 * depending on the `modal` property. When set to `false`, calls `dialog.close()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) open = false;

	/**
	 * Height variant of the sheet container.
	 *
	 * - `'small'`  — Compact; suitable for quick confirmations.
	 * - `'medium'` — Standard height (default).
	 * - `'large'`  — Fills `expandedHeight` of the viewport.
	 * - `'auto'`   — Content-driven; height adapts to the slotted content.
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'auto' = 'medium';

	/**
	 * When `true` (default), the sheet opens as a modal dialog with a backdrop
	 * scrim. When `false`, it opens as a non-modal overlay with no scrim.
	 *
	 * @default true
	 */
	@property({ type: Boolean, reflect: true }) modal = true;

	/**
	 * Heading text displayed in the sheet's header area.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/**
	 * Controls how the sheet is positioned in the document.
	 *
	 * - `'body'` (default) — Teleports the element to `document.body` so
	 *   the fixed overlay renders above all stacking contexts.
	 * - `'fixed'` — Fixed positioning within its current DOM subtree.
	 * - `'absolute'` — Absolute within the nearest positioned ancestor.
	 * - `'static'` — Static flow (rarely needed; for testing only).
	 *
	 * @default 'fixed'
	 */
	@property({ reflect: true })
	positioning: 'body' | 'fixed' | 'absolute' | 'static' = 'fixed';

	/**
	 * Maximum block-size (height) of the sheet when `size="large"`.
	 *
	 * Accepts any valid CSS `max-block-size` value (e.g. `'85%'`, `'600px'`).
	 * Defaults to `'85%'` which is the M3-recommended maximum for bottom sheets
	 * on compact screens.
	 *
	 * @default '85%'
	 */
	@property({ reflect: true, attribute: 'expanded-height' })
	expandedHeight = '85%';

	/**
	 * Optional maximum inline-size (width) constraint for the sheet.
	 *
	 * When set (e.g. `'640px'`), the sheet will not exceed this width even on
	 * wide displays. Useful for tablet/desktop breakpoints where a centered
	 * modal is preferred over a full-width sheet.
	 *
	 * @default '' (no constraint)
	 */
	@property({ reflect: true, attribute: 'max-width' })
	maxWidth = '';

	/**
	 * Original parent node before teleportation to `document.body`.
	 * Used to restore the element's DOM position in `disconnectedCallback`.
	 */
	private _originalParent: Node | null = null;

	/**
	 * Original next sibling before teleportation to `document.body`.
	 * Used alongside `_originalParent` to restore the exact DOM position.
	 */
	private _originalSibling: Node | null = null;

	/** Direct reference to the native `<dialog>` element. */
	@query('dialog') private _dialog!: HTMLDialogElement;
	private _isDragging = false;
	private _startY = 0;
	private _currentTranslationY = 0;
	private _sheetHeight = 0;
	private _defaultHeight = 0;
	private _justDragged = false;

	private _getMaxHeightPx(): number {
		const val = this.expandedHeight || '85%';
		if (val.endsWith('%')) {
			return window.innerHeight * (parseFloat(val) / 100);
		}
		if (val.endsWith('vh')) {
			return window.innerHeight * (parseFloat(val) / 100);
		}
		if (val.endsWith('px')) {
			return parseFloat(val);
		}
		return window.innerHeight * 0.85;
	}

	private _onPointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.handle') && !target.closest('header')) return;

		this._isDragging = true;
		this._startY = e.clientY;
		this._sheetHeight = this._dialog.getBoundingClientRect().height;
		this._currentTranslationY = 0;

		const isExpanded = this._dialog.classList.contains('expanded');
		if (!isExpanded) {
			this._defaultHeight = this._sheetHeight;
		}

		target.setPointerCapture(e.pointerId);
		this._dialog.classList.add('dragging');
	}

	private _onPointerMove(e: PointerEvent) {
		if (!this._isDragging) return;

		const deltaY = e.clientY - this._startY;
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxHeight = this._getMaxHeightPx();

		if (isExpanded) {
			if (deltaY > 0) {
				// Dragging down from expanded: shrink height
				const newHeight = this._sheetHeight - deltaY;
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.max(0, newHeight)}px`;
			} else {
				// Pulling up from expanded: resistance
				const newHeight = this._sheetHeight - deltaY * 0.2;
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.min(maxHeight, newHeight)}px`;
			}
		} else {
			if (deltaY > 0) {
				// Dragging down from normal: translate down
				this._currentTranslationY = deltaY;
				this._dialog.style.transform = `translateY(${deltaY}px)`;
				this._dialog.style.height = '';
			} else {
				// Dragging up from normal: grow height
				const newHeight = this._sheetHeight - deltaY;
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.min(maxHeight, newHeight)}px`;
			}
		}
	}

	private _onPointerUp(e: PointerEvent) {
		if (!this._isDragging) return;

		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');

		const deltaY = e.clientY - this._startY;
		if (Math.abs(deltaY) > 5) {
			this._justDragged = true;
			setTimeout(() => {
				this._justDragged = false;
			}, 50);
		}
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxHeight = this._getMaxHeightPx();

		if (isExpanded) {
			const finalHeight = this._sheetHeight - deltaY;
			if (finalHeight < this._defaultHeight - 80) {
				// Close completely
				this._dialog.classList.remove('expanded');
				this._dialog.style.transform = 'translateY(100%)';
				this._dialog.style.height = '';
				
				const onTransitionEnd = () => {
					this._dialog.removeEventListener('transitionend', onTransitionEnd);
					this._dialog.style.transform = '';
					this._dialog.style.height = '';
					this.open = false;
					this.dispatchEvent(new CustomEvent('close'));
				};
				this._dialog.addEventListener('transitionend', onTransitionEnd);
				setTimeout(() => {
					if (this.open) onTransitionEnd();
				}, 300);
			} else if (finalHeight < (maxHeight + this._defaultHeight) / 2) {
				// Collapse back to normal height
				this._dialog.classList.remove('expanded');
				this._dialog.style.transform = '';
				this._dialog.style.height = '';
			} else {
				// Snap back to expanded
				this._dialog.style.transform = '';
				this._dialog.style.height = '';
			}
		} else {
			if (deltaY < 0) {
				// Dragged up
				const finalHeight = this._sheetHeight - deltaY;
				const threshold = (maxHeight + this._sheetHeight) / 2;
				if (finalHeight > threshold || -deltaY > 80) {
					// Snap to expanded
					this._dialog.classList.add('expanded');
					this._dialog.style.transform = '';
					this._dialog.style.height = '';
				} else {
					// Revert to normal
					this._dialog.style.transform = '';
					this._dialog.style.height = '';
				}
			} else {
				// Dragged down
				const threshold = Math.min(150, this._sheetHeight * 0.4);
				if (this._currentTranslationY > threshold) {
					this._dialog.style.transform = 'translateY(100%)';
					this._dialog.style.height = '';
					
					const onTransitionEnd = () => {
						this._dialog.removeEventListener('transitionend', onTransitionEnd);
						this._dialog.style.transform = '';
						this._dialog.style.height = '';
						this.open = false;
						this.dispatchEvent(new CustomEvent('close'));
					};
					this._dialog.addEventListener('transitionend', onTransitionEnd);
					setTimeout(() => {
						if (this.open) onTransitionEnd();
					}, 300);
				} else {
					this._dialog.style.transform = '';
					this._dialog.style.height = '';
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
		this._dialog.style.height = '';
	}

	private _onDialogClick(e: MouseEvent) {
		if (this._justDragged) {
			this._justDragged = false;
			return;
		}
		if (!this.modal) return;
		// Click on backdrop targets the dialog element itself. Clicks on children target the children.
		if (e.target !== this._dialog) return;

		this._dialog.style.transform = 'translateY(100%)';
		this._dialog.style.height = '';

		const onTransitionEnd = () => {
			this._dialog.removeEventListener('transitionend', onTransitionEnd);
			this._dialog.style.transform = '';
			this._dialog.style.height = '';
			this.open = false;
			this.dispatchEvent(new CustomEvent('close'));
		};
		this._dialog.addEventListener('transitionend', onTransitionEnd);
		setTimeout(() => {
			if (this.open) onTransitionEnd();
		}, 300);
	}

	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('expandedHeight')) {
			this.style.setProperty('--moni-bottom-sheet-expanded-height', this.expandedHeight);
		}
		if (changed.has('maxWidth')) {
			this.style.setProperty('--moni-bottom-sheet-max-width', this.maxWidth || '100%');
		}
		if (changed.has('open')) {
			if (this.open) {
				if (this.positioning === 'body' && this.parentNode !== document.body) {
					this._originalParent = this.parentNode;
					this._originalSibling = this.nextSibling;
					document.body.appendChild(this);
				}
			} else {
				if (this._dialog) {
					this._dialog.classList.remove('expanded');
				}
				if (this.positioning === 'body' && this._originalParent && this.parentNode === document.body) {
					this._originalParent.insertBefore(this, this._originalSibling);
					this._originalParent = null;
					this._originalSibling = null;
				}
			}
		}
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this.parentNode === document.body && this.positioning === 'body' && this._originalParent) {
			this._originalParent.insertBefore(this, this._originalSibling);
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				--_padding: 1rem;
				display: block;
				visibility: hidden;
				border: none;
				opacity: 0;
				box-shadow: var(--elevate3);
				color: var(--on-surface);
				background-color: var(--surface);
				padding: var(--_padding);
				z-index: 100;
				inline-size: 100%;
				max-inline-size: var(--moni-bottom-sheet-max-width, 100%);
				margin-inline: auto;
				block-size: auto;
				max-block-size: var(--moni-bottom-sheet-expanded-height, 85%);
				min-inline-size: auto;
				border-radius: 1.75rem 1.75rem 0 0;
				overflow-y: auto;
				transition:
					transform var(--speed3),
					height var(--speed3),
					opacity var(--speed3);
				transform: translateY(100%);
				outline: none;
			}

			dialog[open] {
				visibility: visible;
				opacity: 1;
				transform: translateY(0);
			}

			dialog.fixed {
				position: fixed;
				inset: auto 0 0 0;
			}

			dialog.absolute {
				position: absolute;
				inset: auto 0 0 0;
			}

			dialog.static {
				position: relative;
				inset: auto;
				transform: none !important;
				opacity: 1 !important;
				visibility: visible !important;
				display: none;
			}
			dialog.static[open] {
				display: block;
			}

			dialog.dragging {
				transition: none !important;
			}

			dialog.small {
				block-size: 16rem;
			}
			dialog.medium {
				block-size: 24rem;
			}
			dialog.large {
				block-size: 32rem;
			}
			dialog.auto {
				block-size: auto;
			}

			dialog.expanded {
				block-size: var(--moni-bottom-sheet-expanded-height, 85%) !important;
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
				padding-block-start: 0.5rem;
				cursor: grab;
				touch-action: none;
				user-select: none;
			}
			header:active {
				cursor: grabbing;
			}
			footer {
				min-block-size: 3.5rem;
			}

			/* M3 spec: the drag handle is a 4dp tall x 32dp wide pill at
			   the top center of the sheet. Color is on-surface-variant with
			   40% opacity for reduced emphasis. */
			.handle {
				inline-size: 2rem;
				block-size: 0.25rem;
				background: var(--on-surface-variant);
				opacity: 0.4;
				border-radius: 999px;
				margin: 0.5rem auto 1rem;
				cursor: grab;
				touch-action: none;
			}
			.handle:active {
				cursor: grabbing;
			}
		`
	];

	override render() {
		const posClass = this.positioning === 'body' ? 'fixed' : this.positioning;
		const dialogClasses = `${this.size} ${posClass}`;

		return html`<dialog
			part="dialog"
			?open=${this.open}
			class=${dialogClasses}
			@click=${this._onDialogClick}
			@pointerdown=${this._onPointerDown}
			@pointermove=${this._onPointerMove}
			@pointerup=${this._onPointerUp}
			@pointercancel=${this._onPointerCancel}
		>
			<div class="handle" aria-hidden="true"></div>
			<header part="header">
				<slot name="handle">${this.title}</slot>
			</header>
			<div part="content"><slot></slot></div>
			<footer part="footer"><slot name="footer"></slot></footer>
		</dialog>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-bottom-sheet': MoniBottomSheet;
	}
}

export default MoniBottomSheet;
