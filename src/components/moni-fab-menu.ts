import { css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import type { MoniFab, MoniFabColor, MoniFabPosition, MoniFabSize } from './moni-fab.js';
import './moni-fab.js';

type FabMenuDirection = 'up' | 'down' | 'left' | 'right';

/** Accessible Material 3 Expressive FAB menu / speed dial. */
@customElement('moni-fab-menu')
export class MoniFabMenu extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) icon = 'add';
	@property({ reflect: true, attribute: 'close-icon' }) closeIcon = 'close';
	@property({ reflect: true }) label = 'Abrir acciones';
	@property({ reflect: true, attribute: 'close-label' }) closeLabel = 'Cerrar acciones';
	@property({ reflect: true }) size: MoniFabSize = 'medium';
	@property({ reflect: true }) color: MoniFabColor = 'primary';
	@property({ reflect: true }) shape: 'rounded' | 'circle' = 'rounded';
	@property({ reflect: true }) direction: FabMenuDirection = 'up';
	@property({ reflect: true }) position: MoniFabPosition = '';

	@query('.trigger') private _trigger!: MoniFab;
	@query('slot') private _slot!: HTMLSlotElement;
	@query('.menu') private _menu!: HTMLElement;
	@state() private _effectiveDirection: FabMenuDirection = 'up';
	@state() private _crossAlign: 'start' | 'end' = 'end';
	private _actions: MoniFab[] = [];
	private _restoreFocus = false;

	private _onDocumentPointer = (event: PointerEvent) => {
		if (this.open && !event.composedPath().includes(this)) this.open = false;
	};
	private _onDocumentClick = (event: MouseEvent) => {
		if (this.open && !event.composedPath().includes(this)) this.open = false;
	};
	private _onDocumentKey = (event: KeyboardEvent) => {
		if (!this.open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			this._restoreFocus = true;
			this.open = false;
			return;
		}
		if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		const current = this._actions.indexOf(document.activeElement as MoniFab);
		const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
		const next = event.key === 'Home' ? 0 : event.key === 'End' ? this._actions.length - 1 : (current + (forward ? 1 : -1) + this._actions.length) % this._actions.length;
		this._actions[next]?.focus();
	};
	private _onViewportChange = () => this._placeMenu();

	override disconnectedCallback() {
		this._removeGlobalListeners();
		super.disconnectedCallback();
	}

	override updated(changed: Map<string, unknown>) {
		if (changed.has('direction') && !this.open) this._effectiveDirection = this.direction;
		if (!changed.has('open')) return;
		this.dispatchEvent(new CustomEvent('moni-toggle', { detail: { open: this.open }, bubbles: true, composed: true }));
		if (this.open) {
			document.addEventListener('pointerdown', this._onDocumentPointer, true);
			document.addEventListener('click', this._onDocumentClick, true);
			document.addEventListener('keydown', this._onDocumentKey, true);
			window.addEventListener('resize', this._onViewportChange);
			queueMicrotask(async () => {
				await this._placeMenu();
				this._actions[0]?.focus();
			});
		} else {
			this._removeGlobalListeners();
			if (this._restoreFocus) queueMicrotask(() => this._trigger?.focus());
			this._restoreFocus = false;
		}
	}

	private _removeGlobalListeners() {
		document.removeEventListener('pointerdown', this._onDocumentPointer, true);
		document.removeEventListener('click', this._onDocumentClick, true);
		document.removeEventListener('keydown', this._onDocumentKey, true);
		window.removeEventListener('resize', this._onViewportChange);
	}

	private _visibleBoundary(): DOMRect {
		let left = 0;
		let top = 0;
		let right = window.innerWidth;
		let bottom = window.innerHeight;
		let ancestor = this.parentElement;
		while (ancestor) {
			const style = getComputedStyle(ancestor);
			if (/(hidden|clip|auto|scroll)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)) {
				const rect = ancestor.getBoundingClientRect();
				left = Math.max(left, rect.left);
				top = Math.max(top, rect.top);
				right = Math.min(right, rect.right);
				bottom = Math.min(bottom, rect.bottom);
			}
			ancestor = ancestor.parentElement;
		}
		return new DOMRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
	}

	private async _placeMenu() {
		if (!this.open || !this._menu) return;
		const boundary = this._visibleBoundary();
		const opposite = { left: 'right', right: 'left', up: 'down', down: 'up' } as const;
		const trigger = this._trigger.getBoundingClientRect();
		const verticalPreference: Array<'up' | 'down'> =
			trigger.top - boundary.top >= boundary.bottom - trigger.bottom
				? ['up', 'down']
				: ['down', 'up'];
		const horizontalPreference: Array<'left' | 'right'> =
			trigger.left - boundary.left >= boundary.right - trigger.right
				? ['left', 'right']
				: ['right', 'left'];
		const perpendicular = this.direction === 'left' || this.direction === 'right'
			? verticalPreference
			: horizontalPreference;
		const candidates = [this.direction, opposite[this.direction], ...perpendicular]
			.filter((direction, index, all) => all.indexOf(direction) === index);
		let best: { direction: FabMenuDirection; align: 'start' | 'end'; overflow: number } | undefined;

		for (const direction of candidates) {
			this._effectiveDirection = direction;
			this._crossAlign = 'end';
			await this.updateComplete;
			let menu = this._menu.getBoundingClientRect();
			const vertical = direction === 'up' || direction === 'down';
			if ((vertical && menu.left < boundary.left) || (!vertical && menu.top < boundary.top)) {
				this._crossAlign = 'start';
				await this.updateComplete;
				menu = this._menu.getBoundingClientRect();
			}
			const overflow =
				Math.max(0, boundary.left - menu.left) +
				Math.max(0, menu.right - boundary.right) +
				Math.max(0, boundary.top - menu.top) +
				Math.max(0, menu.bottom - boundary.bottom);
			if (!best || overflow < best.overflow) {
				best = { direction, align: this._crossAlign, overflow };
			}
			if (overflow <= 1) return;
		}

		if (best) {
			this._effectiveDirection = best.direction;
			this._crossAlign = best.align;
		}
	}

	private _toggle = () => {
		if (this.disabled) return;
		this._restoreFocus = this.open;
		this.open = !this.open;
	};

	private _slotChanged = () => {
		this._actions.forEach(action => action.removeEventListener('click', this._selectAction));
		this._actions = this._slot.assignedElements({ flatten: true }).filter((element): element is MoniFab => element.tagName === 'MONI-FAB');
		this._actions.forEach((action, index) => {
			action.style.setProperty('--_fab-menu-index', String(index));
			action.setAttribute('role', 'menuitem');
			action.addEventListener('click', this._selectAction);
		});
		if (this.open) queueMicrotask(() => this._placeMenu());
	};

	private _selectAction = () => {
		this._restoreFocus = true;
		this.open = false;
	};

	static override styles = [sharedStyles, css`
		:host { display: inline-flex; position: relative; vertical-align: middle; }
		:host([position='bottom-trailing']), :host([position='bottom-leading']),
		:host([position='top-trailing']), :host([position='top-leading']) { position: fixed; z-index: 13; }
		:host([position='bottom-trailing']) { inset: auto max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) auto; }
		:host([position='bottom-leading']) { inset: auto auto max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left)); }
		:host([position='top-trailing']) { inset: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) auto auto; }
		:host([position='top-leading']) { inset: max(1rem, env(safe-area-inset-top)) auto auto max(1rem, env(safe-area-inset-left)); }

		.wrap { display: inline-grid; place-items: center; position: relative; }
		.menu { position: absolute; display: flex; gap: .75rem; margin: 0; padding: 0; align-items: center; pointer-events: none; visibility: hidden; }
		:host([open]) .menu { pointer-events: auto; visibility: visible; }
		.wrap[data-direction='up'] .menu { inset-block-end: calc(100% + 1rem); flex-direction: column-reverse; }
		.wrap[data-direction='down'] .menu { inset-block-start: calc(100% + 1rem); flex-direction: column; }
		.wrap:is([data-direction='up'], [data-direction='down'])[data-align='end'] .menu { inset-inline-end: 0; align-items: flex-end; }
		.wrap:is([data-direction='up'], [data-direction='down'])[data-align='start'] .menu { inset-inline-start: 0; align-items: flex-start; }
		.wrap[data-direction='left'] .menu { inset-inline-end: calc(100% + 1rem); flex-direction: row-reverse; }
		.wrap[data-direction='right'] .menu { inset-inline-start: calc(100% + 1rem); flex-direction: row; }
		.wrap:is([data-direction='left'], [data-direction='right'])[data-align='end'] .menu { inset-block-end: 0; }
		.wrap:is([data-direction='left'], [data-direction='right'])[data-align='start'] .menu { inset-block-start: 0; }

		::slotted(moni-fab) {
			opacity: 0;
			transform: translateY(.75rem) scale(.8);
			transform-origin: center;
			transition: opacity 160ms ease, transform 300ms cubic-bezier(.2,0,0,1);
			transition-delay: 0ms;
		}
		.wrap[data-direction='down'] ::slotted(moni-fab) { transform: translateY(-.75rem) scale(.8); }
		.wrap[data-direction='left'] ::slotted(moni-fab) { transform: translateX(.75rem) scale(.8); }
		.wrap[data-direction='right'] ::slotted(moni-fab) { transform: translateX(-.75rem) scale(.8); }
		:host([open]) ::slotted(moni-fab) {
			opacity: 1;
			transform: translate(0) scale(1);
			transition-delay: calc(var(--_fab-menu-index, 0) * 45ms);
		}
		.trigger::part(icon) { transition: transform 300ms cubic-bezier(.2,0,0,1); }
		:host([open]) .trigger::part(icon) { transform: rotate(90deg); }
		@media (prefers-reduced-motion: reduce) { ::slotted(moni-fab), .trigger::part(icon) { transition-duration: .01ms; transition-delay: 0ms; } }
	`];

	override render() {
		return html`<div class="wrap" data-direction=${this._effectiveDirection} data-align=${this._crossAlign}>
			<div class="menu fab-menu" part="menu" role="menu" aria-hidden=${String(!this.open)}>
				<slot @slotchange=${this._slotChanged}></slot>
			</div>
			<moni-fab
				class="trigger"
				part="trigger"
				.icon=${this.open ? this.closeIcon : this.icon}
				.size=${this.size}
				.color=${this.color}
				.shape=${this.shape}
				.disabled=${this.disabled}
				.accessibleLabel=${this.open ? this.closeLabel : this.label}
				aria-haspopup="menu"
				aria-expanded=${String(this.open)}
				@click=${this._toggle}
			></moni-fab>
		</div>`;
	}
}

declare global { interface HTMLElementTagNameMap { 'moni-fab-menu': MoniFabMenu; } }
export default MoniFabMenu;
