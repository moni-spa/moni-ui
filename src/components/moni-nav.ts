/**
 * @file components/moni-nav.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Navigation container component.
 *
 * `<moni-nav>` is the container that wraps `<moni-nav-item>` elements and
 * controls the M3 navigation pattern: navigation bar, navigation rail, or
 * navigation drawer.
 *
 * **M3 spec references:**
 * - Navigation bar: `m3-docs/components/navigation-bar/specs.md`
 * - Navigation rail: `m3-docs/components/navigation-rail/specs.md`
 * - Navigation drawer: `m3-docs/components/navigation-drawer/specs.md`
 *
 * **Navigation patterns:**
 * - **Navigation bar** (`placement="bottom"`) — Horizontal bar of icon+label
 *   items at the bottom of the screen. Best for 3–5 top-level destinations.
 * - **Navigation rail** (`variant="rail"`) — Vertical rail of icon+label items
 *   on the side of the screen. Best for medium/expanded breakpoints.
 * - **Standard drawer** (`variant="drawer"`) — Always-visible vertical panel
 *   with full text labels. No scrim. Best for large screens.
 * - **Modal drawer** (`variant="drawer" modal`) — Overlay drawer with scrim.
 *   Opened/closed via the `open` property. Traps keyboard focus while open.
 *   Closes on `Escape` key press.
 *
 * **Keyboard handling:**
 * When `modal=true`, the component adds a global `keydown` listener in
 * `connectedCallback` that closes the drawer on `Escape`. The listener is
 * removed in `disconnectedCallback`.
 *
 * @example
 * ```html
 * <!-- Bottom navigation bar -->
 * <moni-nav placement="bottom">
 *   <moni-nav-item icon="home" label="Home" active></moni-nav-item>
 *   <moni-nav-item icon="search" label="Search"></moni-nav-item>
 *   <moni-nav-item icon="person" label="Profile"></moni-nav-item>
 * </moni-nav>
 *
 * <!-- Modal navigation drawer -->
 * <moni-nav variant="drawer" modal open placement="left">
 *   <h3 slot="header">My App</h3>
 *   <moni-nav-item icon="home" label="Home" active></moni-nav-item>
 *   <moni-nav-item icon="settings" label="Settings"></moni-nav-item>
 * </moni-nav>
 * ```
 *
 * @slot default - `<moni-nav-item>` children.
 * @slot header  - Content above the nav items (drawer variant only).
 * @slot footer  - Content below the nav items (drawer variant only).
 *
 * @csspart nav     - The inner `<nav>` element.
 * @csspart scrim   - The backdrop scrim (modal drawer only).
 */
@customElement('moni-nav')
export class MoniNav extends MoniElement {
	@property({ reflect: true })
	placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
	@property({ reflect: true })
	variant: 'rail' | 'drawer' = 'rail';
	@property({ type: Boolean, reflect: true }) modal = false;
	@property({ type: Boolean, reflect: true }) open = true;
	@property({ reflect: true })
	layout: 'vertical' | 'horizontal' | 'auto' = 'auto';

	override connectedCallback() {
		super.connectedCallback();
		this._onKeydown = this._onKeydown.bind(this);
		document.addEventListener('keydown', this._onKeydown);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('keydown', this._onKeydown);
	}

	private _onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && this.modal && this.open) {
			this.open = false;
		}
	}

	private _closeModal() {
		if (this.modal) {
			this.open = false;
		}
	}

	override updated(changed: Map<string, unknown>) {
		if (
			changed.has('placement') ||
			changed.has('variant') ||
			changed.has('layout') ||
			changed.has('modal') ||
			changed.has('open')
		) {
			this._propagateToItems();
		}
	}

	private _propagateToItems = () => {
		const items = this.querySelectorAll('moni-nav-item');
		items.forEach(item => {
			item.setAttribute('placement', this.placement);
			item.setAttribute('variant', this.variant);
			item.setAttribute('layout', this.layout);
		});
	};

	static override styles = [
		sharedStyles,
		css`
			:host {
				/* Block so the host establishes a layout context for fixed
				   descendants. The inner <nav> still handles all positioning. */
				display: block;
				font-family: var(--font);
				inline-size: 100%;
			}

			nav {
				display: flex;
				gap: 0.5rem;
				padding: 0 1rem;
				background-color: var(--surface-container);
				color: var(--on-surface);
				align-items: center;
				box-sizing: border-box;
			}

			:host([placement='top']) nav,
			:host([placement='bottom']) nav {
				flex-direction: row;
				justify-content: space-around;
				inline-size: 100%;
			}

			:host([placement='bottom']) nav {
				position: fixed;
				inset-block-end: 0;
				inset-inline: 0;
				z-index: 100;
				background-color: var(--surface-container);
				min-block-size: 4rem; /* 64dp flexible nav bar */
				padding-block-end: env(safe-area-inset-bottom, 0px);
			}

			:host([placement='top']) nav {
				position: sticky;
				inset-block-start: 0;
				z-index: 100;
				background-color: var(--surface-container);
				min-block-size: 4rem; /* 64dp flexible nav bar */
			}

			:host([placement='left']) nav,
			:host([placement='right']) nav {
				flex-direction: column;
				block-size: 100dvh;
				padding-block: 1rem;
			}

			:host([placement='left'][variant='rail']) nav,
			:host([placement='right'][variant='rail']) nav {
				min-inline-size: 6rem;
			}

			:host([placement='left'][variant='drawer']) nav,
			:host([placement='right'][variant='drawer']) nav {
				min-inline-size: 16rem;
			}

			:host([placement='left']) nav {
				position: fixed;
				inset-inline-start: 0;
				inset-block: 0;
				z-index: 100;
			}

			:host([placement='right']) nav {
				position: fixed;
				inset-inline-end: 0;
				inset-block: 0;
				z-index: 100;
			}

			/* Modal drawer scrim/backdrop */
			.scrim {
				display: none;
				position: fixed;
				inset: 0;
				z-index: 99;
				background-color: var(--scrim);
				opacity: 0;
				transition: opacity var(--speed2);
			}

			:host([variant='drawer'][modal]) .scrim {
				display: block;
			}

			:host([variant='drawer'][modal][open]) .scrim {
				opacity: 1;
			}

			/* Modal drawer closed state slides off-screen */
			:host([placement='left'][variant='drawer'][modal]:not([open])) nav {
				transform: translateX(-100%);
			}
			:host([placement='right'][variant='drawer'][modal]:not([open])) nav {
				transform: translateX(100%);
			}

			:host([variant='drawer'][modal]) nav {
				transition: transform var(--speed3) cubic-bezier(0.2, 0, 0, 1);
			}

			/* Nav items inside horizontal placements stretch to fill. */
			:host([placement='top']) ::slotted(moni-nav-item),
			:host([placement='bottom']) ::slotted(moni-nav-item) {
				flex: 1;
				min-inline-size: 0;
			}

			/* Slots header/footer in vertical nav */
			:host([placement='left']) ::slotted([slot='header']),
			:host([placement='right']) ::slotted([slot='header']) {
				padding-block: 1rem;
				inline-size: 100%;
			}
			:host([placement='left']) ::slotted([slot='footer']),
			:host([placement='right']) ::slotted([slot='footer']) {
				margin-block-start: auto;
				padding-block: 1rem;
				inline-size: 100%;
			}

			@media only screen and (max-width: 600px) {
				nav {
					position: fixed !important;
					inset-block-end: 0 !important;
					inset-inline: 0 !important;
					z-index: 100 !important;
					background-color: var(--surface-container) !important;
					min-block-size: 4rem !important;
					padding-block-end: env(safe-area-inset-bottom, 0px) !important;
					flex-direction: row !important;
					justify-content: space-around !important;
					block-size: auto !important;
					inline-size: 100% !important;
				}
				::slotted(moni-nav-item) {
					flex: 1 !important;
					min-inline-size: 0 !important;
				}
			}
		`,
	];

	override render() {
		const isModalDrawer = this.variant === 'drawer' && this.modal;
		const classes = [this.placement, this.variant === 'drawer' ? 'max' : '']
			.filter(Boolean)
			.join(' ');
		const scrim = isModalDrawer
			? html`<div
					class="scrim"
					part="scrim"
					@click=${this._closeModal}
					aria-hidden="true"
				></div>`
			: '';
		return html`${scrim}<nav
				class=${classes}
				part="nav"
				role=${isModalDrawer ? 'dialog' : undefined}
				aria-modal=${isModalDrawer ? 'true' : undefined}
				aria-expanded=${isModalDrawer ? (this.open ? 'true' : 'false') : undefined}
			>
				<slot name="header"></slot>
				<slot @slotchange=${this._propagateToItems}></slot>
				<slot name="footer"></slot>
			</nav>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-nav': MoniNav;
	}
}

export default MoniNav;
