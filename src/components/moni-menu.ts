import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Menu that faithfully ports BeerCSS's `menu` styles.
 *
 * BeerCSS uses a plain `<menu>` with class `.active` toggled by JS —
 * NO Popover API. The menu positions itself as `position: absolute`
 * relative to the nearest positioned ancestor.
 *
 * Shadow DOM note: we keep :host as `display: contents` so the inner
 * `<menu>` can position relative to the consumer's layout context.
 * The consumer must have `position: relative` on the trigger's wrapper.
 *
 * **M3 spec** (`m3-docs/components/menus/guidelines.md`): menus should
 * auto-flip to the opposite side when there isn't enough viewport space
 * in the requested placement.
 *
 * **Flip implementation** (P4.3):
 *  - Modern browsers (Chrome 125+, Edge 125+, Safari 18+): uses CSS
 *    `@position-try-fallback` (Baseline 2024) when `flip` is set.
 *  - Older browsers (Firefox, Safari < 18): JS polyfill. After the menu
 *    becomes active, we measure the inner `<menu>` rect; if it overflows
 *    the viewport on the requested side, we set `_resolvedPlacement`
 *    to the opposite side and the CSS picks up the change.
 *
 * Attributes:
 *  - placement:  bottom (default) | top | left | right | min | max
 *  - no-wrap:    present
 *  - space:      no-space | space | small-space | medium-space | large-space | extra-space
 *  - active:     present → menu is visible
 *  - flip:       present → enable auto-flip when there is no viewport space
 *                (works on all browsers; CSS-native when supported)
 *
 * Slots:
 *  - default: menu items (moni-menu-item or li elements)
 */
@customElement('moni-menu')
export class MoniMenu extends MoniElement {
	@property({ reflect: true })
	placement: 'bottom' | 'top' | 'left' | 'right' | 'min' | 'max' = 'bottom';
	@property({ type: Boolean, reflect: true, attribute: 'no-wrap' }) noWrap = false;
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true })
	space:
		| 'no-space'
		| 'space'
		| 'small-space'
		| 'medium-space'
		| 'large-space'
		| 'extra-space' = 'no-space';
	@property({ type: Boolean, reflect: true }) flip = false;

	@state() private _resolvedPlacement:
		| 'bottom'
		| 'top'
		| 'left'
		| 'right'
		| 'min'
		| 'max' = 'bottom';

	@query('menu') private _menuEl?: HTMLElement;

	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('active') && this.active && this.flip) {
			// JS polyfill for browsers without @position-try-fallback.
			// Wait one frame so the menu is laid out, then measure.
			this.updateComplete.then(() => this._maybeFlip());
		}
	}

	private _maybeFlip() {
		const menu = this._menuEl;
		if (!menu || !this.flip) return;
		const rect = menu.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const overflowsBottom = rect.bottom > vh;
		const overflowsTop = rect.top < 0;
		const overflowsRight = rect.right > vw;
		const overflowsLeft = rect.left < 0;
		if (this.placement === 'bottom' && overflowsBottom) {
			this._resolvedPlacement = 'top';
		} else if (this.placement === 'top' && overflowsTop) {
			this._resolvedPlacement = 'bottom';
		} else if (this.placement === 'right' && overflowsRight) {
			this._resolvedPlacement = 'left';
		} else if (this.placement === 'left' && overflowsLeft) {
			this._resolvedPlacement = 'right';
		} else {
			this._resolvedPlacement = this.placement;
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* BeerCSS menu — faithful port */
			menu {
				opacity: 0;
				visibility: hidden;
				position: absolute;
				box-shadow: var(--elevate2);
				background-color: var(--surface-container);
				z-index: 13;
				inset: auto auto 0 0;
				inline-size: 100%;
				max-block-size: 50vh;
				max-inline-size: none !important;
				overflow-x: hidden;
				overflow-y: auto;
				font-size: 0.875rem;
				font-weight: normal;
				text-transform: none;
				color: var(--on-surface);
				line-height: normal;
				text-align: start;
				border-radius: 1rem;
				transform: scale(0.8) translateY(120%);
				transition: all var(--speed2) var(--speed2), opacity var(--speed2);
				justify-content: flex-start;
				padding: 0.25rem;
				display: flex;
				flex-direction: column;
				gap: 0.125rem;
				margin: 0;
				list-style: none;
			}

			/* BeerCSS: active class shows the menu */
			menu.active {
				opacity: 1;
				visibility: visible;
				transform: scale(1) translateY(100%);
				transition: all var(--speed2), background-color 0s;
			}

			/* Placement: top */
			menu.top {
				transform: scale(0.8) translateY(-120%);
			}
			menu.top.active {
				transform: scale(1) translateY(-100%);
			}

			/* Placement: left / right */
			menu.right {
				inset: auto auto 0 0;
			}
			menu.left {
				inset: auto 0 0 auto;
			}

			/* Placement: min (fixed-size dropdown) */
			menu.min {
				inset: 0 0 auto 0;
				transform: scale(0.8);
			}
			menu.min.active {
				transform: scale(1);
			}

			/* Placement: max (full screen overlay) */
			menu.max {
				position: fixed;
				inset: 0;
				block-size: 100%;
				max-block-size: none;
				min-block-size: auto;
				z-index: 100;
				transform: scale(0.8);
				border-radius: 0;
			}
			menu.max.active {
				transform: scale(1);
			}

			menu.no-wrap {
				inline-size: max-content !important;
				white-space: nowrap !important;
			}

			/* Space variants */
			menu.no-space   { gap: 0; }
			menu.space      { gap: 0.25rem; }
			menu.small-space { gap: 0.25rem; }
			menu.medium-space { gap: 0.375rem; }
			menu.large-space  { gap: 0.5rem; }
			menu.extra-space  { gap: 0.625rem; }

			/* Slotted items */
			::slotted(li),
			::slotted(moni-menu-item) {
				list-style: none;
				display: flex;
				align-items: center;
				align-self: normal;
				text-align: start;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 2.75rem;
				cursor: pointer;
				border-radius: 0.25rem;
				transition: border-radius var(--speed2);
			}

			/* M3 spec: auto-flip when there is no space in the requested
			   placement. Uses CSS anchor positioning + position-try-fallback
			   (Baseline 2024, Chrome 125+, Edge 125+, Safari TP).

			   The consumer must:
			     1. Set anchor-name="--moni-menu-anchor" on the trigger.
			     2. Ensure the menu can be reached via position-anchor.

			   When the menu's default placement would overflow, the
			   browser uses the first matching @position-try fallback. */
			@supports (anchor-name: --moni-menu-anchor) {
				:host([flip]) menu {
					position-anchor: --moni-menu-anchor;
					position-area: block-end;
					inset: auto;
					inline-size: max-content;
					max-inline-size: 20rem;
					position-try-fallbacks:
						flip-block,
						flip-inline,
						flip-block flip-inline;
				}
				:host([flip][placement='top']) menu {
					position-area: block-start;
					position-try-fallbacks:
						flip-block,
						flip-inline,
						flip-block flip-inline;
				}
				:host([flip][placement='right']) menu {
					position-area: inline-end;
					position-try-fallbacks:
						flip-inline,
						flip-block,
						flip-inline flip-block;
				}
				:host([flip][placement='left']) menu {
					position-area: inline-start;
					position-try-fallbacks:
						flip-inline,
						flip-block,
						flip-inline flip-block;
				}
			}
		`
	];

	override render() {
		const effectivePlacement = this.active && this.flip
			? this._resolvedPlacement
			: this.placement;
		const classes = [
			effectivePlacement,
			this.space,
			this.noWrap ? 'no-wrap' : '',
			this.active ? 'active' : ''
		].filter(Boolean).join(' ');

		return html`<menu
			class=${classes}
			part="menu"
		>
			<slot></slot>
		</menu>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-menu': MoniMenu;
	}
}

export default MoniMenu;
