import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Badge that faithfully ports BeerCSS's `.badge` styles.
 *
 * BeerCSS `.badge` uses:
 *  - `position: absolute; inset: 50% auto auto 50%; transform: translate(var(--_x), var(--_y))`
 *  - Default: --_x: 0, --_y: -100% → top-right corner
 *
 * The parent element MUST have `position: relative` for the badge to anchor correctly.
 * We ensure this in connectedCallback.
 *
 * Attributes:
 *  - value:    text content (also accepts slotted content)
 *  - position: '' (top-right default) | top | bottom | left | right | none
 *  - shape:    '' (round) | circle | square | min
 *  - color:    error (default) | primary | secondary | tertiary
 *  - border:   present → outlined badge (BeerCSS .badge.border)
 *  - inline:   present → badge becomes inline (BeerCSS .badge.none)
 */
@customElement('moni-badge')
export class MoniBadge extends MoniElement {
	@property({ reflect: true }) value = '';
	@property({ reflect: true })
	position: 'top' | 'bottom' | 'left' | 'right' | 'none' | '' = '';
	@property({ reflect: true })
	shape: 'circle' | 'square' | 'min' | '' = '';
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'error' = 'error';
	@property({ type: Boolean, reflect: true }) inline = false;
	@property({ type: Boolean, reflect: true }) border = false;

	override connectedCallback() {
		super.connectedCallback();
		// BeerCSS requirement: parent must be position:relative for badge to anchor
		const parent = this.parentElement;
		if (parent) {
			const computed = getComputedStyle(parent);
			if (computed.position === 'static') {
				parent.style.position = 'relative';
			}
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* BeerCSS .badge */
			.badge {
				--_x: 0;
				--_y: -100%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				font-size: 0.6875rem;
				z-index: 2;
				padding: 0 0.25rem;
				min-block-size: 1rem;
				min-inline-size: 1rem;
				background-color: var(--error);
				color: var(--on-error);
				line-height: normal;
				border-radius: 1rem;
				/* BeerCSS: inset:50% auto auto 50% + translate */
				inset: 50% auto auto 50%;
				transform: translate(var(--_x, 0), var(--_y, -100%));
				font-family: var(--font);
				box-sizing: border-box;
			}

			/* Position variants — BeerCSS */
			.badge.top    { --_y: -100%; }
			.badge.bottom { --_y: 0; }
			.badge.left   { --_x: -100%; }
			.badge.right  { --_x: 0; }

			/* BeerCSS .badge.none = inline positioning */
			.badge.none {
				inset: auto !important;
				transform: none;
				position: relative;
				margin: 0 0.125rem;
			}

			/* Color variants */
			:host([color='primary'])   .badge { background-color: var(--primary);   color: var(--on-primary); }
			:host([color='secondary']) .badge { background-color: var(--secondary); color: var(--on-secondary); }
			:host([color='tertiary'])  .badge { background-color: var(--tertiary);  color: var(--on-tertiary); }
			:host([color='error'])     .badge { background-color: var(--error);     color: var(--on-error); }

			/* BeerCSS .badge.border */
			:host([border]) .badge {
				border-color: var(--error);
				color: var(--error);
				background-color: var(--surface);
			}
			:host([border][color='primary'])   .badge { border-color: var(--primary);   color: var(--primary); }
			:host([border][color='secondary']) .badge { border-color: var(--secondary); color: var(--secondary); }
			:host([border][color='tertiary'])  .badge { border-color: var(--tertiary);  color: var(--tertiary); }

			/* Shape variants */
			.badge.square { border-radius: 0; }

			/* BeerCSS .badge.min — dot only, content hidden */
			.badge.min > * { display: none; }
			.badge.min { clip-path: circle(18.75% at 50% 50%); }
		`
	];

	override render() {
		const classes = [
			'badge',
			this.position || '',
			this.shape || '',
			this.inline ? 'none' : ''
		].filter(Boolean).join(' ');

		return html`<span class=${classes} part="badge">
			<slot>${this.value}</slot>
		</span>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-badge': MoniBadge;
	}
}

export default MoniBadge;
