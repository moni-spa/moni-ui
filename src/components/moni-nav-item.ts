/**
 * @file components/moni-nav-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 Navigation Item component.
 *
 * A single destination item within a `<moni-nav>` container. Renders as an
 * accessible `<a>` element with an icon, label, and M3 state layer.
 *
 * **M3 spec references:**
 * - Navigation bar item: `m3-docs/components/navigation-bar/specs.md`
 * - Navigation rail item: `m3-docs/components/navigation-rail/specs.md`
 * - Navigation drawer item: `m3-docs/components/navigation-drawer/specs.md`
 *
 * **Layout adaptation:**
 * The `placement`, `variant`, and `layout` properties are forwarded from
 * the parent `<moni-nav>` (typically via attribute binding in the parent's
 * render method). The nav item uses these to conditionally render:
 * - Icon + label below (navigation bar).
 * - Icon only + horizontal label (rail).
 * - Icon + full label (drawer).
 *
 * **Responsive behavior:**
 * Uses `window.matchMedia('(min-width: 601px)')` to detect medium screens
 * and stores the result in `_isMediumScreen`. This drives automatic layout
 * switching between bar and rail styles.
 *
 * **Active state:**
 * The `active` attribute applies the M3 active indicator: a pill-shaped
 * `secondary-container` background behind the icon and a darker label color.
 *
 * @example
 * ```html
 * <moni-nav placement="bottom">
 *   <moni-nav-item href="/" icon="home" label="Home" active></moni-nav-item>
 *   <moni-nav-item href="/search" icon="search" label="Search"></moni-nav-item>
 *   <moni-nav-item href="/profile" icon="person" label="Profile">
 *     <moni-badge value="3"></moni-badge>  <!-- notification badge -->
 *   </moni-nav-item>
 * </moni-nav>
 * ```
 *
 * @slot default - Additional content slotted after the icon (e.g. `<moni-badge>`).
 *
 * @csspart item   - The outer `<a>` element.
 * @csspart icon   - The icon container.
 * @csspart label  - The label text element.
 */
@customElement('moni-nav-item')
export class MoniNavItem extends MoniElement {
	@property({ reflect: true }) href = '#';
	@property({ reflect: true }) target = '';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true }) placement = 'top';
	@property({ reflect: true }) variant = 'rail';
	@property({ reflect: true }) layout = 'auto';

	@state()
	private _isMediumScreen = false;

	private _query = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
		? window.matchMedia('(min-width: 601px)')
		: null;

	override connectedCallback() {
		super.connectedCallback();
		if (this._query) {
			this._query.addEventListener('change', this._handleQueryChange);
			this._isMediumScreen = this._query.matches;
		}
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this._query) {
			this._query.removeEventListener('change', this._handleQueryChange);
		}
	}

	private _handleQueryChange = (e: MediaQueryListEvent) => {
		this._isMediumScreen = e.matches;
	};

	get computedLayout(): 'vertical' | 'horizontal' {
		if (this.placement === 'left' || this.placement === 'right') {
			return this.variant === 'drawer' ? 'horizontal' : 'vertical';
		}
		if (this.layout === 'auto') {
			return this._isMediumScreen ? 'horizontal' : 'vertical';
		}
		return this.layout as 'vertical' | 'horizontal';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
				inline-size: 100%;
				justify-content: center;
				box-sizing: border-box;
			}

			a {
				display: flex;
				align-items: center;
				justify-content: center;
				text-decoration: none;
				color: var(--on-surface-variant);
				cursor: pointer;
				inline-size: 100%;
				transition: background-color var(--speed2), color var(--speed2);
				outline: none;
				position: relative;
				box-sizing: border-box;
			}

			/* ─── State Layers (Hover/Focus/Active) ─── */
			a:hover:not(.active) .active-indicator {
				background-color: var(--surface-container-high, rgba(0, 0, 0, 0.08));
			}

			/* ─── Vertical Layout Styles ─── */
			a[data-layout='vertical'] {
				flex-direction: column;
				gap: 0.25rem; /* 4dp space between icon and label */
				padding: 0.5rem 0;
				min-block-size: 4rem; /* 64dp height */
			}

			a[data-layout='vertical'] .active-indicator {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-inline-size: 3.5rem; /* 56px */
				block-size: 2rem; /* 32px */
				border-radius: 1rem; /* fully rounded */
				transition: background-color var(--speed2), color var(--speed2);
			}

			a[data-layout='vertical'].active .active-indicator {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			a[data-layout='vertical'] .label {
				font-size: 0.75rem; /* 12dp label size */
				font-weight: 500;
				transition: color var(--speed2);
				color: var(--on-surface-variant);
				text-align: center;
			}

			a[data-layout='vertical'].active .label {
				color: var(--secondary);
				font-weight: 600;
			}

			/* ─── Horizontal Layout Styles ─── */
			a[data-layout='horizontal'] {
				flex-direction: row;
				padding: 0.5rem 0.75rem;
				min-block-size: 4rem; /* 64dp height */
			}

			a[data-layout='horizontal'] .active-indicator {
				display: inline-flex;
				align-items: center;
				gap: 0.5rem; /* 8dp gap between icon and label */
				padding: 0.375rem 1rem;
				border-radius: 1.25rem; /* fully rounded */
				transition: background-color var(--speed2), color var(--speed2);
				min-block-size: 2rem;
				box-sizing: border-box;
			}

			a[data-layout='horizontal'].active .active-indicator {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			a[data-layout='horizontal'] .label {
				font-size: 0.875rem; /* 14dp label size */
				font-weight: 500;
				color: var(--on-surface-variant);
				transition: color var(--speed2);
			}

			a[data-layout='horizontal'].active .label {
				color: var(--on-secondary-container);
				font-weight: 600;
			}

			/* Drawer variant specific tweaks */
			:host([variant='drawer']) a[data-layout='horizontal'] {
				justify-content: flex-start;
				padding: 0.5rem 1rem;
			}
			:host([variant='drawer']) a[data-layout='horizontal'] .active-indicator {
				width: 100%;
				background-color: transparent;
			}
			:host([variant='drawer']) a[data-layout='horizontal'].active .active-indicator {
				background-color: var(--secondary-container);
			}

			/* Icon Sizes and Helpers */
			.icon-container {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 1.5rem;
				block-size: 1.5rem;
			}

			.icon-container moni-icon,
			.icon-container ::slotted(moni-icon),
			.icon-container i {
				font-size: 1.5rem; /* 24dp */
				inline-size: 1.5rem;
				block-size: 1.5rem;
			}
		`
	];

	override render() {
		const isHorizontal = this.computedLayout === 'horizontal';

		const iconEl = html`
			<div class="icon-container" part="icon">
				${this.icon
					? html`<moni-icon name="${this.icon}"></moni-icon>`
					: html`<slot name="icon"></slot>`}
			</div>
		`;

		const labelEl = html`
			<span class="label" part="label"><slot>${this.label}</slot></span>
		`;

		return html`<a
			href=${this.href || '#'}
			target=${ifDefined(this.target || undefined)}
			class=${this.active ? 'active' : ''}
			data-layout=${this.computedLayout}
			part="item"
		>
			${isHorizontal
				? html`
					<div class="active-indicator" part="indicator">
						${iconEl}
						${labelEl}
					</div>
				`
				: html`
					<div class="active-indicator" part="indicator">
						${iconEl}
					</div>
					${labelEl}
				`}
		</a>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-nav-item': MoniNavItem;
	}
}

export default MoniNavItem;
