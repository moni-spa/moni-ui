import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-menu.js';

/**
 * Context menu triggered by right-click on the parent element.
 *
 * **Usage** (`m3-docs/components/menus/guidelines.md`): the menu opens at
 * the cursor's coordinates and flips to the opposite side if there isn't
 * enough space in the viewport.
 *
 * **Wiring example**:
 *   ```html
 *   <div style="position: relative;">
 *     <moni-context-menu flip>
 *       <moni-menu-item>Cut</moni-menu-item>
 *       <moni-menu-item>Copy</moni-menu-item>
 *       <moni-menu-item>Paste</moni-menu-item>
 *     </moni-context-menu>
 *     Right-click anywhere in this div
 *   </div>
 *   ```
 *
 * Attributes:
 *  - placement: bottom (default) | top | left | right
 *  - flip:      present → auto-flip to opposite side if menu would overflow
 *               the viewport (M3 spec)
 *
 * Slots:
 *  - default: menu items
 */
@customElement('moni-context-menu')
export class MoniContextMenu extends MoniElement {
	@property({ reflect: true })
	placement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	@property({ type: Boolean, reflect: true }) flip = false;

	@state() private _x = 0;
	@state() private _y = 0;
	@state() private _open = false;
	@state() private _resolvedPlacement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';

	@query('moni-menu') private _menuEl?: HTMLElement;

	private _target: HTMLElement | null = null;
	private _docKeydown = (e: KeyboardEvent) => this._onDocKeydown(e);

	override connectedCallback() {
		super.connectedCallback();
		this._target = this.parentElement;
		if (this._target) {
			const computed = getComputedStyle(this._target);
			if (computed.position === 'static') {
				this._target.style.position = 'relative';
			}
			this._target.addEventListener('contextmenu', this._onContextMenu);
		}
		// Close on click outside
		document.addEventListener('click', this._onDocumentClick);
		document.addEventListener('keydown', this._docKeydown);
	}

	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('contextmenu', this._onContextMenu);
		}
		document.removeEventListener('click', this._onDocumentClick);
		document.removeEventListener('keydown', this._docKeydown);
		super.disconnectedCallback();
	}

	private _onContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		if (this._target) {
			const rect = this._target.getBoundingClientRect();
			this._x = e.clientX - rect.left;
			this._y = e.clientY - rect.top;
		} else {
			this._x = e.clientX;
			this._y = e.clientY;
		}
		this._resolvedPlacement = this.placement;
		this._open = true;
		// After Lit renders the menu, check viewport fit and flip if needed.
		this.updateComplete.then(() => this._maybeFlip());
	};

	private _maybeFlip() {
		if (!this.flip) return;
		const menu = this._menuEl?.shadowRoot?.querySelector('menu') as HTMLElement | null;
		if (!menu) return;
		const rect = menu.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const overflowsBottom = rect.bottom > vh;
		const overflowsRight = rect.right > vw;
		if (this.placement === 'bottom' && overflowsBottom) {
			this._resolvedPlacement = 'top';
		} else if (this.placement === 'top' && rect.top < 0) {
			this._resolvedPlacement = 'bottom';
		} else if (this.placement === 'right' && overflowsRight) {
			this._resolvedPlacement = 'left';
		} else if (this.placement === 'left' && rect.left < 0) {
			this._resolvedPlacement = 'right';
		}
	}

	private _onDocumentClick = () => {
		if (this._open) {
			this._open = false;
		}
	};

	private _onDocKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && this._open) {
			this._open = false;
		}
	};

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			.menu-host {
				/* Absolute from parent which has position:relative */
				position: absolute;
				inset-inline-start: var(--_x, 0);
				inset-block-start: var(--_y, 0);
				z-index: 200;
			}
		`
	];

	override render() {
		// When the menu is open, prefer the resolved (possibly flipped)
		// placement; otherwise just use the host's requested placement so
		// the inner element reflects the attribute synchronously.
		const effectivePlacement = this._open
			? this._resolvedPlacement
			: this.placement;
		return html`<div
			class="menu-host"
			style="--_x: ${this._x}px; --_y: ${this._y}px;"
		>
			<moni-menu
				placement=${effectivePlacement}
				?active=${this._open}
			>
				<slot></slot>
			</moni-menu>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-context-menu': MoniContextMenu;
	}
}

export default MoniContextMenu;
