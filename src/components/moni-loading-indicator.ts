/**
 * @file components/moni-loading-indicator.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { loadingIndicatorPolygons } from './loading-shapes.js';

/**
 * Material Design 3 Loading Indicator component.
 *
 * An indeterminate loading indicator that visually represents an unspecified
 * wait time. Unlike standard circular spinners, this component uses a morphing
 * polygon animation that shifts between shapes (circle, rounded square, etc.)
 * in accordance with the high-fidelity M3 Expressive motion specifications.
 *
 * **Variants:**
 * - `uncontained` (default) — A standalone morphing shape that inherits color
 *   from its text context (or defaults to `primary`).
 * - `contained` — The morphing shape is placed inside a circular container
 *   with a distinct background color, useful for high-contrast loading states
 *   or overlaying imagery.
 *
 * **Animation & Accessibility:**
 * The component manages its own SVG `<animate>` tags. The animation is
 * automatically started/stopped via `connectedCallback`/`disconnectedCallback`
 * to save CPU cycles when the element is off-screen. It applies standard ARIA
 * roles (`role="progressbar"`) and value attributes to ensure screen readers
 * identify it correctly as an indeterminate loading state.
 *
 * @example
 * ```html
 * <!-- Uncontained indicator -->
 * <moni-loading-indicator></moni-loading-indicator>
 *
 * <!-- Contained indicator (default container is secondary-container) -->
 * <moni-loading-indicator variant="contained"></moni-loading-indicator>
 * ```
 *
 * @csspart container - The outer `.container` wrapper.
 * @csspart svg       - The inner `<svg>` element.
 * @csspart shape     - The `<path>` element that morphs.
 */
@customElement('moni-loading-indicator')
export class MoniLoadingIndicator extends MoniElement {
	@property({ reflect: true })
	variant: 'uncontained' | 'contained' = 'uncontained';

	@query('.container') private _container?: HTMLElement;

	override connectedCallback() {
		super.connectedCallback();
		this.ariaValueMin = this.ariaValueMin || '0';
		this.ariaValueMax = this.ariaValueMax || '100';
		this.role = this.role || 'progressbar';
		this._toggleAnimation(true);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this._toggleAnimation(false);
	}

	protected override firstUpdated() {
		this._toggleAnimation(true);
	}

	private _toggleAnimation(enable: boolean) {
		if (this._container) {
			this._container.classList.toggle('animate', enable);
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-block;
				aspect-ratio: 1 / 1;
				contain: strict;
				vertical-align: middle;
			}

			:host([variant='uncontained']) {
				width: var(--moni-loading-indicator-size, 2.375rem);
			}

			:host([variant='contained']) {
				width: var(--moni-loading-indicator-container-size, 3rem);
			}

			:host([variant='uncontained']) .active-indicator {
				background-color: var(--moni-loading-indicator-active-color, var(--primary));
			}

			:host([variant='contained']) .active-indicator {
				background-color: var(--moni-loading-indicator-contained-active-color, var(--on-primary-container));
			}

			:host([variant='contained']) .container {
				background-color: var(--moni-loading-indicator-contained-container-color, var(--secondary-container));
			}

			.container {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: var(--moni-loading-indicator-container-shape, 9999px);
				box-sizing: border-box;
			}

			.active-indicator {
				margin: auto;
				aspect-ratio: 1 / 1;
				width: calc(var(--moni-loading-indicator-size, 2.375rem) * 0.842);
				transform-origin: center;
				transition: clip-path 500ms cubic-bezier(0.2, 0, 0, 1);
				will-change: transform, clip-path;
				--_polygon-soft-burst: polygon(${unsafeCSS(loadingIndicatorPolygons['soft-burst'])});
				--_polygon-9-sided-cookie: polygon(${unsafeCSS(loadingIndicatorPolygons['9-sided-cookie'])});
				--_polygon-pentagon: polygon(${unsafeCSS(loadingIndicatorPolygons['pentagon'])});
				--_polygon-pill: polygon(${unsafeCSS(loadingIndicatorPolygons['pill'])});
				--_polygon-sunny: polygon(${unsafeCSS(loadingIndicatorPolygons['sunny'])});
				--_polygon-4-sided-cookie: polygon(${unsafeCSS(loadingIndicatorPolygons['4-sided-cookie'])});
				--_polygon-oval: polygon(${unsafeCSS(loadingIndicatorPolygons['oval'])});
			}

			.container.animate .active-indicator-wrapper {
				animation: rotate-outer 4666ms linear infinite;
				transform-origin: center;
				display: flex;
				align-items: center;
				justify-content: center;
				will-change: transform;
			}

			@keyframes rotate-outer {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}

			.container.animate .active-indicator {
				animation: rotate-inner 4666ms cubic-bezier(0.34, 0.88, 0.34, 1) infinite;
			}

			@keyframes rotate-inner {
				0% {
					clip-path: var(--_polygon-soft-burst);
					transform: rotate(0deg);
				}
				14% {
					clip-path: var(--_polygon-9-sided-cookie);
					transform: rotate(154deg) scale(1);
				}
				29% {
					clip-path: var(--_polygon-pentagon);
					transform: rotate(309deg) scale(1);
				}
				43% {
					clip-path: var(--_polygon-pill);
					transform: rotate(463deg) scale(1);
				}
				57% {
					clip-path: var(--_polygon-sunny);
					transform: rotate(617deg) scale(1);
				}
				71% {
					clip-path: var(--_polygon-4-sided-cookie);
					transform: rotate(771deg) scale(1);
				}
				83% {
					clip-path: var(--_polygon-oval);
					transform: rotate(926deg) scale(1);
				}
				100% {
					clip-path: var(--_polygon-soft-burst);
					transform: rotate(1080deg) scale(1);
				}
			}

			@media (forced-colors: active) {
				.active-indicator {
					background-color: CanvasText !important;
				}
			}
		`
	];

	override render() {
		return html`
			<div class="container animate" aria-hidden="true">
				<div class="active-indicator-wrapper">
					<div class="active-indicator"></div>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-loading-indicator': MoniLoadingIndicator;
	}
}

export default MoniLoadingIndicator;
