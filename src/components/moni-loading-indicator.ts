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
 * Componente Material Design 3 Loading Indicator (Indicador de carga).
 *
 * Un indicador de carga indeterminado que representa visualmente un tiempo de espera
 * no especificado. A diferencia de los spinners circulares estándar, este componente usa una animación
 * de polígono cambiante que cambia entre formas (círculo, cuadrado redondeado, etc.)
 * de acuerdo con las especificaciones de movimiento de alta fidelidad M3 Expressive.
 *
 * **Variantes:**
 * - `uncontained` (por defecto) — Una forma cambiante independiente que hereda el color
 *   de su contexto de texto (o por defecto es `primary`).
 * - `contained` — La forma cambiante se coloca dentro de un contenedor circular
 *   con un color de fondo distinto, útil para estados de carga de alto contraste
 *   o superposición de imágenes.
 *
 * **Animación y Accesibilidad:**
 * El componente gestiona sus propias etiquetas `<animate>` SVG. La animación se
 * inicia/detiene automáticamente a través de `connectedCallback`/`disconnectedCallback`
 * para ahorrar ciclos de CPU cuando el elemento está fuera de la pantalla. Aplica los atributos de valor
 * y roles ARIA estándar (`role="progressbar"`) para asegurar que los lectores de pantalla
 * lo identifiquen correctamente como un estado de carga indeterminado.
 *
 * @example
 * ```html
 * <!-- Indicador no contenido -->
 * <moni-loading-indicator></moni-loading-indicator>
 *
 * <!-- Indicador contenido (el contenedor por defecto es secondary-container) -->
 * <moni-loading-indicator variant="contained"></moni-loading-indicator>
 * ```
 *
 * @csspart container - El envoltorio exterior `.container`.
 * @csspart svg       - El elemento `<svg>` interior.
 * @csspart shape     - El elemento `<path>` que se transforma.
 */
@customElement('moni-loading-indicator')
export class MoniLoadingIndicator extends MoniElement {
	@property({ reflect: true })
	variant: 'uncontained' | 'contained' = 'uncontained';

	@query('.container') private _container?: HTMLElement;

	/**
	 * Hook de inicialización (Lit).
	 * Configura roles ARIA (progressbar) por defecto y asegura
	 * el encendido inicial de la animación infinita en el Shadow DOM.
	 */
	override connectedCallback() {
		super.connectedCallback();
		this.ariaValueMin = this.ariaValueMin || '0';
		this.ariaValueMax = this.ariaValueMax || '100';
		this.role = this.role || 'progressbar';
		this._toggleAnimation(true);
	}

	/**
	 * Hook de destrucción (Lit).
	 * Apaga formalmente la animación CSS (`.animate`) para frenar el GPU repaint
	 * cuando el componente es destruido, reduciendo el consumo de batería.
	 */
	override disconnectedCallback() {
		super.disconnectedCallback();
		this._toggleAnimation(false);
	}

	/**
	 * Hook de primera actualización (Lit).
	 * Dispara explícitamente el estado de animación una vez que el DOM 
	 * interno (`this._container`) ha sido montado y es seleccionable.
	 */
	protected override firstUpdated() {
		this._toggleAnimation(true);
	}

	/**
	 * Controlador imperativo de las clases de animación.
	 * Permite pausar/reanudar el loader mediante CSS, muy útil cuando se integra
	 * con observadores de visibilidad (IntersectionObserver) para mejorar el rendimiento.
	 */
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

	/**
	 * Renderiza la superposición de carga de pantalla completa con un spinner centrado y una etiqueta opcional.
	 *
	 * La superposición utiliza `position: fixed; inset: 0` para cubrir toda la ventana gráfica,
	 * y `z-index` para aparecer por encima del resto del contenido. El spinner `<moni-progress>`
	 * se centra mediante CSS flexbox en el elemento `:host`.
	 *
	 * **Región ARIA en vivo:**
	 * `aria-live="polite"` y `aria-label` en el contenedor anuncian los cambios de estado
	 * de carga a los lectores de pantalla sin interrumpir el flujo de lectura del usuario.
	 * El `role="status"` da a los lectores de pantalla un punto de referencia implícito similar a una alerta.
	 */
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
