import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-fab.js';
import './moni-icon.js';
import type { MoniFab } from './moni-fab.js';

/**
 * Visual-only FAB menu. Combines a main `<moni-fab>` trigger with a `<menu>`
 * of secondary FABs (slotted via default slot).
 *
 * The component wires the trigger's `click` to toggle the `open` attribute.
 * Consumers can also set/unset the attribute externally for programmatic
 * control. The menu scales and fades via CSS transitions.
 *
 * **Focus management** (M3 spec § FAB menu):
 *  - When `open` becomes true, focus moves to the first focusable item in
 *    the menu (or stays on the trigger if the menu is empty).
 *  - When `open` becomes false, focus returns to the trigger.
 *  - `Tab` cycles within the menu while open; `Escape` closes the menu.
 *  - Click outside the menu closes it.
 *
 * Attributes:
 *  - open:      present → menu is shown
 *  - icon:      Material Symbols name for the trigger
 *  - size:      small | medium (default) | large
 *  - color:     primary (default) | secondary | tertiary | surface
 *  - shape:     rounded (default) | circle
 *  - direction: up (default) | down | left | right
 *  - position:  same as moni-fab
 */
@customElement('moni-fab-menu')
export class MoniFabMenu extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ reflect: true }) icon = 'add';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';
	@property({ reflect: true })
	shape: 'rounded' | 'circle' = 'rounded';
	@property({ reflect: true })
	direction: 'up' | 'down' | 'left' | 'right' = 'up';
	@property({ reflect: true })
	position:
		| 'bottom-trailing'
		| 'bottom-leading'
		| 'top-trailing'
		| 'top-leading' = 'bottom-trailing';

	@query('moni-fab') private _trigger!: MoniFab;
	@query('.fab-menu') private _menu!: HTMLElement;

	private _previouslyFocused: HTMLElement | null = null;
	private _onDocClick = (e: MouseEvent) => this._handleDocClick(e);
	private _onDocKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);

	override async firstUpdated() {
		// Wait for all children to finish rendering before wiring listeners
		await this.updateComplete;
		if (this._trigger) {
			this._trigger.addEventListener('click', this._onTriggerClick);
		}
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this._trigger?.removeEventListener('click', this._onTriggerClick);
		document.removeEventListener('click', this._onDocClick, true);
		document.removeEventListener('keydown', this._onDocKeydown, true);
	}

	override updated(changed: Map<string, unknown>): void {
		super.updated(changed);
		if (changed.has('open')) {
			this._syncOpenState();
		}
	}

	private _onTriggerClick = () => {
		this.open = !this.open;
	};

	private _syncOpenState(): void {
		if (this.open) {
			// Save current focus so we can restore it on close.
			this._previouslyFocused = (this.getRootNode() as unknown as DocumentOrShadowRoot)
				.activeElement as HTMLElement | null;
			// Move focus to the first focusable item in the menu, or the
			// trigger as a fallback (per WAI-ARIA menu pattern).
			const first = this._firstFocusableMenuItem();
			if (first) {
				first.focus();
			} else {
				this._trigger?.focus();
			}
			// Install document listeners for click-outside and Escape.
			document.addEventListener('click', this._onDocClick, true);
			document.addEventListener('keydown', this._onDocKeydown, true);
		} else {
			// Restore focus to the trigger (or the previously focused element).
			const restore = this._previouslyFocused ?? this._trigger;
			restore?.focus();
			this._previouslyFocused = null;
			document.removeEventListener('click', this._onDocClick, true);
			document.removeEventListener('keydown', this._onDocKeydown, true);
		}
	}

	private _handleDocClick(e: MouseEvent): void {
		if (!this.open) return;
		const path = e.composedPath();
		if (!path.includes(this)) {
			this.open = false;
		}
	}

	private _handleDocKeydown(e: KeyboardEvent): void {
		if (!this.open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			this.open = false;
		}
	}

	private _firstFocusableMenuItem(): HTMLElement | null {
		if (!this._menu) return null;
		const items = this._menu.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
		return items[0] ?? null;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
				position: relative;
			}

			:host([position]) {
				position: fixed;
				z-index: 13;
			}
			:host([position='bottom-trailing']) {
				inset: auto 1rem 1rem auto;
			}
			:host([position='bottom-leading']) {
				inset: auto auto 1rem 1rem;
			}
			:host([position='top-trailing']) {
				inset: 1rem 1rem auto auto;
			}
			:host([position='top-leading']) {
				inset: 1rem auto auto 1rem;
			}

			.wrap {
				display: inline-flex;
				position: relative;
				align-items: center;
				justify-content: center;
			}

			.fab-menu {
				opacity: 0;
				visibility: hidden;
				position: absolute;
				display: flex;
				gap: 0.5rem;
				padding: 0.5rem;
				margin: 0;
				list-style: none;
				z-index: 14;
				transition:
					opacity var(--speed2),
					transform var(--speed2);
				transform: scale(0.9);
			}

			:host([open]) .fab-menu {
				opacity: 1;
				visibility: visible;
				transform: scale(1);
			}

			/* Directional placement relative to the trigger */
			:host([direction='up']) .fab-menu {
				inset: auto auto calc(100% + 0.5rem) 0;
				flex-direction: column-reverse;
			}
			:host([direction='down']) .fab-menu {
				inset: calc(100% + 0.5rem) auto auto 0;
			}
			:host([direction='left']) .fab-menu {
				inset: 0 auto 0 calc(100% + 0.5rem);
				flex-direction: row-reverse;
			}
			:host([direction='right']) .fab-menu {
				inset: 0 calc(100% + 0.5rem) 0 auto;
				flex-direction: row;
			}

			.fab-menu > li,
			.fab-menu > ::slotted(*) {
				list-style: none;
				display: block;
			}
		`
	];

	override render() {
		return html`<div class="wrap">
			<!-- div role=menu allows any slotted content (not just <li>) -->
			<div class="fab-menu" role="menu" part="menu">
				<slot></slot>
			</div>
			<moni-fab
				part="trigger"
				icon=${this.icon}
				size=${this.size}
				color=${this.color}
				shape=${this.shape}
			></moni-fab>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-fab-menu': MoniFabMenu;
	}
}

export default MoniFabMenu;
