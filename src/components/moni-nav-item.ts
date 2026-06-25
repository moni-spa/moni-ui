import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Visual-only navigation item. Renders an `<a>` styled with the BeerCSS
 * nav link helper.
 *
 * Attributes:
 *  - href:     link target
 *  - target:   link target
 *  - icon:     Material Symbols name
 *  - label:    link text
 *  - active:   present → active style
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
