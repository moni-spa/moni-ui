/**
 * @file components/moni-snackbar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Snackbar (Barra de notificaciones).
 *
 * Los snackbars proporcionan mensajes breves sobre los procesos de la aplicación en la parte
 * inferior de la pantalla. Desaparecen automáticamente y no requieren acción del usuario,
 * pero pueden contener una única acción opcional.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/snackbar/specs.md`
 *
 * **Modelo de posicionamiento:**
 * El snackbar utiliza `position: fixed` para que se renderice en la ventana gráfica (viewport)
 * independientemente del elemento en el que esté ubicado en el DOM. El elemento host
 * se muestra como `block` en lugar de `contents` para asegurar que `position: fixed`
 * dentro del shadow root se ancle a la ventana gráfica (no a un contexto de apilamiento
 * creado por un ancestro transformado).
 *
 * **Mecanismo de mostrar/ocultar:**
 * La visibilidad es controlada por `:host([active]) .snackbar` a través de CSS
 * `opacity`, `visibility`, y `transform`. Esto imita el patrón `.snackbar.active`
 * de BeerCSS y permite animaciones de transición CSS.
 *
 * **Truncamiento de texto M3:**
 * El texto del mensaje se limita a `maxLines` líneas con `-webkit-line-clamp`.
 * La especificación M3 requiere un máximo de 2 líneas; los consumidores pueden
 * anular esto a través del atributo `max-lines`.
 *
 * @example
 * ```ts
 * const snackbar = document.querySelector('moni-snackbar') as MoniSnackbar;
 *
 * // Mostrar por 3 segundos
 * snackbar.text = 'Elemento eliminado';
 * snackbar.action = 'Deshacer';
 * snackbar.active = true;
 * setTimeout(() => { snackbar.active = false; }, 3000);
 * ```
 *
 * @slot default - Contenido adicional colocado dentro del contenedor del snackbar.
 *
 * @csspart snackbar - El elemento contenedor interno del snackbar.
 * @csspart text     - El elemento del texto del mensaje.
 * @csspart action   - El elemento del botón de acción.
 */
@customElement('moni-snackbar')
export class MoniSnackbar extends MoniElement {
	/**
	 * El texto del mensaje principal mostrado en el snackbar.
	 *
	 * Limitado a `maxLines` líneas. Los mensajes largos se truncan con `…`.
	 * Según la especificación M3, mantenga los mensajes cortos e informativos (menos de 60 caracteres).
	 *
	 * @default ''
	 */
	@property({ reflect: true }) text = '';

	/**
	 * Etiqueta para el botón de acción opcional.
	 *
	 * Cuando no está vacía, renderiza un botón de texto en el borde posterior (trailing) del snackbar.
	 * El componente despacha un evento `'action'` cuando se hace clic en la acción.
	 * Esta es una etiqueta puramente visual — el consumidor maneja la lógica de la acción.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) action = '';

	/**
	 * Ubicación vertical del snackbar en la pantalla.
	 *
	 * - `'bottom'` (por defecto) — Fijo a 6rem desde la parte inferior, centrado horizontalmente.
	 * - `'top'` — Fijo a 6rem desde la parte superior, centrado horizontalmente.
	 *
	 * @default 'bottom'
	 */
	@property({ reflect: true })
	placement: 'bottom' | 'top' = 'bottom';

	/**
	 * Cuando es `true`, el snackbar es visible.
	 *
	 * Alterne este atributo para mostrar/ocultar el snackbar. La transición CSS
	 * maneja la animación de desvanecimiento/deslizamiento hacia arriba (fade-in/slide-up) automáticamente.
	 * Los consumidores son responsables de implementar el temporizador de cierre automático.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Número máximo de líneas del texto del mensaje antes de que sea limitado (clamped).
	 *
	 * Utiliza `-webkit-line-clamp` con `display: -webkit-box` para truncamiento multilínea
	 * compatible en varios navegadores. La especificación M3 recomienda un máximo de 2 líneas.
	 *
	 * @default 2
	 */
	@property({ type: Number, reflect: true, attribute: 'max-lines' })
	maxLines = 2;

	static override styles = [
		sharedStyles,
		css`
			:host {
				/* Use block instead of contents so position:fixed inside
				   works relative to the viewport (its containing block). */
				display: block;
				font-family: var(--font);
				/* Host itself takes no space */
				position: fixed;
				inset: 0;
				pointer-events: none;
				z-index: 200;
			}

			/* BeerCSS .snackbar */
			.snackbar {
				position: fixed;
				/* BeerCSS: inset: auto auto 6rem 50% for bottom placement */
				inset-block-end: 6rem;
				inset-block-start: auto;
				inset-inline: 50% auto;
				inline-size: 80%;
				block-size: auto;
				z-index: 200;
				visibility: hidden;
				display: flex;
				box-shadow: var(--elevate2);
				color: var(--inverse-on-surface);
				background-color: var(--inverse-surface);
				padding: 1rem;
				cursor: pointer;
				text-align: start;
				align-items: center;
				border-radius: 0.25rem;
				gap: 0.5rem;
				transition: all var(--speed2);
				transform: translate(-50%, 1rem);
				opacity: 0;
				pointer-events: auto;
			}

			/* BeerCSS .snackbar.top */
			.snackbar.top {
				inset-block-start: 6rem;
				inset-block-end: auto;
				transform: translate(-50%, -1rem);
			}

			/* BeerCSS .snackbar.active */
			:host([active]) .snackbar {
				visibility: visible;
				transform: translate(-50%, 0);
				opacity: 1;
			}

			.snackbar > .max {
				flex: auto;
				/* M3 spec § Message: clamp at 2 lines (configurable via
				   max-lines attribute). */
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: var(--_max-lines, 2);
				line-clamp: var(--_max-lines, 2);
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.action {
				font-weight: 500;
				text-transform: uppercase;
				font-size: 0.875rem;
				letter-spacing: 0.05em;
				color: var(--inverse-primary);
				white-space: nowrap;
			}

			@media only screen and (min-width: 993px) {
				.snackbar {
					inline-size: 40%;
				}
			}
		`
	];

	/**
	 * Renderiza el snackbar con su mensaje y el botón de acción opcional.
	 *
	 * El contenedor del snackbar utiliza `aria-live="polite"` para que los lectores
	 * de pantalla anuncien el mensaje sin interrumpir el flujo de lectura actual del usuario.
	 * Cuando se establece `action`, se renderiza un `<span>` como botón de acción según
	 * la especificación del Snackbar de M3.
	 * El atributo `placement` se asigna a una clase CSS que controla `inset-block-end`
	 * (snackbar inferior) vs `inset-block-start` (snackbar superior).
	 */
	override render() {
		return html`<div
			class="snackbar ${this.placement}"
			part="snackbar"
			role="status"
			aria-live="polite"
			style="--_max-lines: ${this.maxLines}"
		>
			<slot name="icon"></slot>
			<span class="max" part="text"><slot>${this.text}</slot></span>
			${this.action
				? html`<span class="action" part="action">${this.action}</span>`
				: ''}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-snackbar': MoniSnackbar;
	}
}

export default MoniSnackbar;
