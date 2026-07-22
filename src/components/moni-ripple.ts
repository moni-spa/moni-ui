/**
 * @file components/moni-ripple.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente de decoración de onda (ripple) puramente visual.
 *
 * Proporciona una animación de onda con origen en el puntero: el círculo expansivo comienza
 * en las coordenadas exactas donde se pulsó (pointer-down) en lugar de en el centro del elemento.
 * Esta es la onda M3 de alta fidelidad; para una onda central más simple solo con CSS,
 * usa el pseudo-elemento `.interactive::after` de `interactionStyles` en su lugar.
 *
 * **Uso:**
 * Coloca `<moni-ripple>` como **hijo** de cualquier elemento interactivo. El componente
 * adjunta automáticamente un listener de `pointerdown` a su `parentElement` y
 * calcula el origen de la onda en coordenadas porcentuales relativas al padre.
 *
 * El elemento padre NO debe tener `position: static` (la onda aplica
 * `position: relative` automáticamente en `connectedCallback`).
 *
 * **Modelo de tiempo:**
 * En `pointerdown`:
 * 1. Se establece `active = false` (cancela cualquier onda en progreso).
 * 2. Un tick de `requestAnimationFrame` asegura que el navegador haya procesado el reinicio.
 * 3. `active = true` activa la animación de escala CSS.
 * 4. Un `setTimeout` de duración `duration` ms (basado en `speed`) reinicia `active = false`.
 *
 * La duración coincide con la duración de la transición CSS para que el desvanecimiento de la opacidad
 * se complete antes de que se limpie `active`.
 *
 * **Limpieza (Cleanup):**
 * `disconnectedCallback` elimina el listener de `pointerdown` y borra cualquier
 * tiempo de espera (timeout) pendiente. Llama siempre a `super.disconnectedCallback()` si usas subclases.
 *
 * @example
 * ```html
 * <!-- Onda en un elemento personalizado -->
 * <div class="my-button" style="position: relative; overflow: hidden;">
 *   Haz clic
 *   <moni-ripple color="primary"></moni-ripple>
 * </div>
 * ```
 *
 * @csspart ripple - El `<span>` interno que realiza la animación de escala.
 */
@customElement('moni-ripple')
export class MoniRipple extends MoniElement {
	/**
	 * Origen horizontal de la onda como porcentaje del ancho del padre.
	 *
	 * Se establece automáticamente por `_onPointerDown` basándose en las coordenadas del puntero.
	 * Se puede configurar manualmente para activar una onda en una ubicación específica.
	 *
	 * @default 50
	 */
	@property({ type: Number, reflect: true }) x = 50;

	/**
	 * Origen vertical de la onda como porcentaje de la altura del padre.
	 *
	 * Se establece automáticamente por `_onPointerDown` basándose en las coordenadas del puntero.
	 *
	 * @default 50
	 */
	@property({ type: Number, reflect: true }) y = 50;

	/**
	 * Cuando es `true`, la onda es visible y se está animando.
	 *
	 * Alternado automáticamente por `_onPointerDown`. Se puede configurar manualmente para
	 * efectos de onda disparados programáticamente.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Velocidad de animación de la secuencia de expansión y desvanecimiento de la onda.
	 *
	 * Se asigna a la propiedad personalizada CSS `--_dur`:
	 * - `'fast'`   — 300ms
	 * - `'normal'` — 600ms (por defecto)
	 * - `'slow'`   — 1200ms
	 *
	 * @default 'normal'
	 */
	@property({ reflect: true })
	speed: 'fast' | 'normal' | 'slow' = 'normal';

	/**
	 * Token de color para la superposición de la onda.
	 *
	 * Establece la propiedad CSS `color` en `:host`, que el span `.ripple`
	 * hereda a través de `background-color: currentColor`.
	 *
	 * - `'primary'`   — `--primary` (por defecto)
	 * - `'secondary'` — `--secondary`
	 * - `'surface'`   — `--surface-variant` (sutil, para contenedores de superficie)
	 *
	 * @default 'primary'
	 */
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'surface' = 'primary';

	/**
	 * Referencia al elemento padre al que está anclada la onda.
	 * Poblado en `connectedCallback`, borrado en `disconnectedCallback`.
	 */
	private _target: HTMLElement | null = null;

	/**
	 * ID del `setTimeout` pendiente que borra `active` después de la animación.
	 * Almacenado para que pueda cancelarse si se dispara un segundo evento de puntero antes
	 * de que termine la primera onda (prevención de doble toque rápido).
	 */
	private _timeoutId: any = null;

	/**
	 * Adjunta la onda a su elemento padre.
	 *
	 * - Almacena una referencia a `parentElement` para la escucha de eventos del puntero.
	 * - Asegura que el padre tenga `position: relative` para que el `position: absolute`
	 *   de la onda se mantenga dentro de los límites.
	 * - Registra el listener de eventos `_onPointerDown`.
	 */
	override connectedCallback() {
		super.connectedCallback();
		this._target = this.parentElement;
		if (this._target) {
			const style = getComputedStyle(this._target);
			if (style.position === 'static') {
				this._target.style.position = 'relative';
			}
			this._target.addEventListener('pointerdown', this._onPointerDown);
		}
	}

	/**
	 * Desvincula la onda de su elemento padre.
	 *
	 * Elimina el listener de `pointerdown` y borra cualquier timeout pendiente para
	 * evitar que la bandera `active` se establezca después de que se elimine el elemento.
	 */
	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('pointerdown', this._onPointerDown);
		}
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		super.disconnectedCallback();
	}

	/**
	 * Maneja los eventos de puntero (pointer-down) en el elemento padre.
	 *
	 * Calcula el origen de la onda como un porcentaje del rectángulo delimitador (bounding rect) del padre,
	 * cancela cualquier onda en curso y luego activa una nueva después de un
	 * frame de animación para garantizar que la transición CSS se dispare desde la nueva posición.
	 *
	 * @param e - El `PointerEvent` del listener `pointerdown` del padre.
	 */
	private _onPointerDown = (e: PointerEvent) => {
		if (!this._target) return;
		const rect = this._target.getBoundingClientRect();
		const xPx = e.clientX - rect.left;
		const yPx = e.clientY - rect.top;
		this.x = (xPx / rect.width) * 100;
		this.y = (yPx / rect.height) * 100;

		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
			this.active = false;
		}

		requestAnimationFrame(() => {
			this.active = true;
			const duration = this.speed === 'fast' ? 300 : this.speed === 'slow' ? 1200 : 600;
			this._timeoutId = setTimeout(() => {
				this.active = false;
				this._timeoutId = null;
			}, duration);
		});
	};

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				position: absolute;
				inset: 0;
				border-radius: inherit;
				pointer-events: none;
				overflow: hidden;
				--_dur: 600ms;
				color: var(--primary);
				z-index: 1;
			}
			:host([speed='fast']) {
				--_dur: 300ms;
			}
			:host([speed='slow']) {
				--_dur: 1200ms;
			}

			.ripple {
				position: absolute;
				inline-size: 200%;
				aspect-ratio: 1;
				border-radius: 50%;
				translate: -50% -50%;
				opacity: 0;
				pointer-events: none;
				background-color: currentColor;
				inset-block-start: var(--_y, 50%);
				inset-inline-start: var(--_x, 50%);
				scale: 0;
				transition: opacity var(--_dur) ease, scale 0s var(--_dur);
			}

			:host([color='primary']) {
				color: var(--primary);
			}
			:host([color='secondary']) {
				color: var(--secondary);
			}
			:host([color='surface']) {
				color: var(--surface-variant);
			}

			:host([active]) .ripple {
				opacity: 0.25;
				scale: 1;
				transition: scale var(--_dur) cubic-bezier(0.2, 0, 0, 1),
					opacity var(--_dur) ease;
			}
		`
	];

	/**
	 * Renderiza el elemento `<span>` de la onda con las coordenadas de origen actuales.
	 *
	 * Este método de renderizado intencionalmente hace muy poco: la onda es fundamentalmente
	 * una animación CSS (`scale`, `opacity`) impulsada por la clase `.active` que es
	 * alternada por la API de activación de JavaScript (`MoniRipple.activate()`).
	 *
	 * `--_x` y `--_y` inyectan el origen del toque/clic como valores porcentuales:
	 * - `x=0%, y=0%` — la onda se origina desde la esquina superior izquierda.
	 * - `x=50%, y=50%` — origen central (por defecto para activación por teclado).
	 * - `x=clientX%, y=clientY%` — onda con origen en el puntero para una sensación táctil natural.
	 *
	 * La clase CSS `.ripple` maneja la animación de expansión `scale(0)` → `scale(1)`
	 * y el desvanecimiento `opacity 1` → `opacity 0` a través de transiciones CSS en `.active`.
	 */
	override render() {
		return html`<span
			class="ripple"
			part="ripple"
			style="--_x: ${this.x}%; --_y: ${this.y}%;"
		></span>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-ripple': MoniRipple;
	}
}

export default MoniRipple;
