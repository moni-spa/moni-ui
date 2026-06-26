/**
 * @file components/moni-menu.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Menu component.
 *
 * Menus display a list of choices on a temporary surface. They appear when
 * users interact with a button, action, or other control.
 *
 * **M3 spec reference:** `m3-docs/components/menus/guidelines.md`
 *
 * **Positioning architecture:**
 * The menu uses `position: absolute` relative to its nearest positioned
 * ancestor. The component's `:host` uses `display: contents`, meaning the
 * inner `<menu>` element directly participates in the consumer's layout context.
 * **Crucial:** The consumer must apply `position: relative` to the wrapper
 * element that contains both the trigger and the `<moni-menu>`.
 *
 * **Auto-flip positioning:**
 * Per M3 guidelines, menus should flip to the opposite side of the anchor
 * if they overflow the viewport.
 * - **Modern browsers (Chrome/Edge 125+, Safari 18+):** Uses CSS anchor
 *   positioning and `@position-try-fallback` natively when `flip=true`.
 * - **Fallback:** A JavaScript polyfill measures the menu after it opens. If
 *   it overflows the requested `placement`, it sets an internal state to flip
 *   the placement classes.
 *
 * **State management:**
 * The `active` attribute controls visibility. Consumers must listen to trigger
 * events (like `click`) and toggle the `active` property.
 *
 * @example
 * ```html
 * <!-- Wrapper must have position: relative -->
 * <div style="position: relative; display: inline-block;">
 *   <moni-button id="menu-trigger">Open Menu</moni-button>
 *
 *   <moni-menu placement="bottom" flip id="my-menu">
 *     <moni-menu-item icon="edit">Edit</moni-menu-item>
 *     <moni-menu-item icon="content_copy">Copy</moni-menu-item>
 *     <moni-divider></moni-divider>
 *     <moni-menu-item icon="delete">Delete</moni-menu-item>
 *   </moni-menu>
 * </div>
 *
 * <script>
 *   const btn = document.getElementById('menu-trigger');
 *   const menu = document.getElementById('my-menu');
 *   btn.addEventListener('click', () => menu.active = !menu.active);
 * </script>
 * ```
 *
 * @slot default - `<moni-menu-item>`, `<moni-divider>`, or raw `<li>` elements.
 *
 * @csspart menu - The inner `<menu>` container.
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
