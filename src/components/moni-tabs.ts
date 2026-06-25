import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only tab bar. Renders a `<nav>` styled with the BeerCSS `.tabs`
 * helper.
 *
 * Attributes:
 *  - mode:      primary (default) | secondary
 *  - scrollable: present → overflow-x: auto
 *  - align:     default (space-around) | left | center | right
 *  - indicator: default (full) | min | max
 *  - vertical:  present → icon above label
 *
 * Slots:
 *  - default: <moni-tab> children
 */
@customElement('moni-tabs')
export class MoniTabs extends MoniElement {
	@property({ reflect: true })
	mode: 'primary' | 'secondary' = 'primary';
	@property({ type: Boolean, reflect: true }) scrollable = false;
	@property({ type: Boolean, reflect: true }) vertical = false;
	@property({ reflect: true })
	align: 'default' | 'left' | 'center' | 'right' = 'default';
	@property({ reflect: true, attribute: 'indicator-size' })
	indicatorSize: 'default' | 'min' | 'max' = 'default';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			nav {
				display: flex;
				white-space: nowrap;
				border-block-end: 0.0625rem solid var(--surface-variant);
				border-radius: 0;
				overflow-x: auto;
			}

			nav.left-align {
				justify-content: flex-start;
			}
			nav.center-align {
				justify-content: center;
			}
			nav.right-align {
				justify-content: flex-end;
			}
			:host(:not([align])) nav,
			nav:not(.left-align):not(.center-align):not(.right-align) {
				justify-content: space-around;
			}

			:host([vertical]) nav {
				flex-direction: column;
				border-block-end: none;
				border-inline-end: 0.0625rem solid var(--surface-variant);
				overflow-x: visible;
				overflow-y: auto;
			}
		`
	];

	override render() {
		const classes = [
			'tabs',
			this.align === 'default' ? '' : `${this.align}-align`,
			this.indicatorSize === 'default' ? '' : this.indicatorSize,
			this.mode,
			this.vertical ? 'vertical' : ''
		]
			.filter(Boolean)
			.join(' ');
		return html`<nav class=${classes} part="tabs">
			<slot></slot>
		</nav>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tabs': MoniTabs;
	}
}

export default MoniTabs;
