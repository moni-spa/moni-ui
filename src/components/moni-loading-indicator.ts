import { html, css, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { loadingIndicatorPolygons } from './loading-shapes.js';

/**
 * Shape-shifting indeterminate loading indicator based on Material 3 Expressive spec.
 *
 * Attributes:
 *  - variant: 'uncontained' (default) | 'contained'
 *
 * CSS custom properties for customization:
 *  - --moni-loading-indicator-size: Size of the active indicator (default: 2.375rem)
 *  - --moni-loading-indicator-active-color: Active indicator color in uncontained mode (default: var(--primary))
 *  - --moni-loading-indicator-contained-active-color: Active indicator color in contained mode (default: var(--on-primary-container))
 *  - --moni-loading-indicator-contained-container-color: Background color of container in contained mode (default: var(--secondary-container))
 *  - --moni-loading-indicator-container-shape: Border radius of container in contained mode (default: 9999px)
 *  - --moni-loading-indicator-container-size: Container size (default: 3rem)
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
