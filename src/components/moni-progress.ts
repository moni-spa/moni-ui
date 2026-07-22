/**
 * @file components/moni-progress.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, svg, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Progress Indicator (Indicador de Progreso).
 *
 * Los indicadores de progreso expresan un tiempo de espera no especificado o muestran la duración
 * de un proceso. Informan a los usuarios sobre el estado de procesos en curso, como
 * cargar una aplicación, enviar un formulario o guardar actualizaciones.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/progress-indicators/specs.md`
 *
 * **Variantes:**
 * - `linear` (por defecto) — Una barra horizontal que se llena de izquierda a derecha.
 * - `circular` — Un indicador circular SVG de trazo (stroke).
 * - `wavy` — Una barra de ondas animada (extensión de Moni; no en la especificación M3).
 * - `circular-wavy` — Combinación de circular + ondas (extensión de Moni).
 *
 * **Nota de compatibilidad con Shadow DOM:**
 * El progreso de BeerCSS usa pseudo-elementos `<progress>` nativos (`::before`,
 * `::after`, `::webkit-progress-value`) y `mask-image`, que son bloqueados
 * por la raíz shadow del User Agent en Chrome/Firefox. Este componente usa un envoltorio
 * `<div>` simple que replica las reglas visuales exactamente, y un elemento `<svg>`
 * para la variante circular usando animación SVG stroke-dashoffset para un soporte
 * superior entre navegadores comparado con `conic-gradient`.
 *
 * **Cálculo de porcentaje:**
 * `_pct` se calcula en `willUpdate()` como `(value / max) * 100`, restringido a
 * `[0, 100]`. Cuando `indeterminate` está establecido, `_pct` se fija en `50` para impulsar
 * la animación de bucle infinito.
 *
 * @example
 * ```html
 * <!-- Progreso lineal determinado -->
 * <moni-progress value="65" max="100"></moni-progress>
 *
 * <!-- Progreso circular indeterminado (spinner de carga) -->
 * <moni-progress variant="circular" indeterminate></moni-progress>
 * ```
 *
 * @csspart bar      - El div contenedor exterior.
 * @csspart fill     - El elemento de llenado interior (variante lineal).
 * @csspart svg      - El elemento SVG (variante circular).
 */
@customElement('moni-progress')
export class MoniProgress extends MoniElement {
	/**
	 * Valor de progreso actual.
	 *
	 * Debe estar en el rango `[0, max]`. Los valores fuera de este rango se restringen
	 * durante el cálculo del porcentaje en `willUpdate()`. Se ignora cuando
	 * `indeterminate` está establecido.
	 *
	 * @default 0
	 */
	@property({ type: Number, reflect: true }) value = 0;

	/**
	 * Valor máximo del rango de progreso.
	 *
	 * Por defecto es `100` para que el `value` pueda establecerse como porcentaje directamente.
	 * Para rangos que no son porcentajes (ej. pasos), establece `max` al recuento total de pasos
	 * y `value` al paso actual.
	 *
	 * @default 100
	 */
	@property({ type: Number, reflect: true }) max = 100;

	/**
	 * Variante visual del indicador de progreso.
	 *
	 * - `'linear'` (por defecto) — Barra de llenado horizontal.
	 * - `'circular'` — Círculo SVG con animación stroke-dashoffset.
	 * - `'wavy'` — Barra de ondas animada.
	 * - `'circular-wavy'` — Combinación de circular y ondas.
	 *
	 * @default 'linear'
	 */
	@property({ reflect: true })
	variant: 'linear' | 'circular' | 'wavy' | 'circular-wavy' = 'linear';

	/**
	 * Tamaño visual del indicador de progreso.
	 *
	 * - `'small'`  — Compacto; adecuado para diseños en línea o ajustados.
	 * - `'medium'` — Tamaño estándar M3 (por defecto).
	 * - `'large'`  — Prominente; para estados de carga a pantalla completa.
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Cuando es `true`, el indicador se anima en un bucle infinito independientemente del `value`.
	 *
	 * Úsalo para operaciones donde el porcentaje de finalización es desconocido
	 * (ej. peticiones de red, procesamiento de archivos). Cuando `indeterminate` está establecido,
	 * `_pct` se fija en `50` para impulsar una animación de barrido continuo.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) indeterminate = false;

	/**
	 * Porcentaje de llenado calculado en el rango `[0, 100]`.
	 *
	 * Actualizado en `willUpdate()` cada vez que cambia `value`, `max` o `indeterminate`.
	 * Usado directamente en vinculaciones de propiedades personalizadas de CSS y atributos de trazo (stroke) SVG.
	 *
	 * @internal
	 */
	@state() private _pct = 0;

	/**
	 * Hook de ciclo de vida de Lit. Calcula la fracción de llenado antes de pintar.
	 *
	 * A diferencia de los componentes nativos, necesitamos computar explícitamente el 
	 * progreso como un número de 0 a 100 para inyectarlo en variables CSS (Lineal) 
	 * o calcular el `stroke-dashoffset` (Circular). 
	 * 
	 * Se usa `Math.max(1, this.max)` para evitar un NaN / Infinity por división entre cero.
	 * 
	 * @param changed - Mapa de propiedades reactivas que detonaron la actualización.
	 */
	override willUpdate(changed: Map<string, unknown>) {
		if (changed.has('value') || changed.has('max') || changed.has('indeterminate')) {
			this._pct = this.indeterminate
				? 50
				: Math.max(0, Math.min(100, (this.value / Math.max(1, this.max)) * 100));
		}
	}

	static override styles = [
		sharedStyles,
		css`
			/* ─── Keyframes — identical to BeerCSS ─── */
			@keyframes to-linear-progress {
				0% { inset-inline-start: -50%; inline-size: 50%; }
				25% { inset-inline-start: 30%; inline-size: 60%; }
				100% { inset-inline-start: 110%; inline-size: 10%; }
			}

			@keyframes to-rotate {
				0%   { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}

			:host {
				--_size: 0.25rem;
				--_circular-size: 2.5rem;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 100%;
				color: var(--primary);
			}

			:host([variant='circular']),
			:host([variant='circular-wavy']) {
				inline-size: var(--_circular-size);
				block-size: var(--_circular-size);
			}

			:host([size='small']) { --_size: 0.25rem; --_circular-size: 1.5rem; }
			:host([size='large']) { --_size: 0.45rem; --_circular-size: 3.5rem; }

			/* ─── Linear / Wavy wrapper ─── */
			.progress-linear {
				position: relative;
				inline-size: 100%;
				block-size: var(--_size);
				background-color: var(--active);
				border-radius: 1rem;
				overflow: hidden;
			}

			.progress-linear > .value {
				position: absolute;
				inset-block: 0;
				inset-inline-start: 0;
				inline-size: calc(var(--_p, 0) * 1%);
				background-color: currentColor;
				border-radius: inherit;
				transition: inline-size var(--speed2) ease;
			}

			/* Indeterminate linear: sliding bar via absolute animation */
			.progress-linear.indeterminate > .value {
				inline-size: 50%;
				animation: to-linear-progress 3.2s ease infinite;
				transition: none;
			}

			/* ─── Wavy ─── */
			.progress-wavy {
				position: relative;
				inline-size: 100%;
				block-size: calc(var(--_size) * 2);
				background: none;
				overflow: visible;
			}

			/* Wavy uses an SVG filter for the wave shape */
			.progress-wavy > svg {
				position: absolute;
				inset: 0;
				inline-size: 100%;
				block-size: 100%;
			}

			/* ─── Circular: SVG ─── */
			.progress-circular {
				inline-size: var(--_circular-size);
				block-size: var(--_circular-size);
				position: relative;
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}

			.progress-circular > svg {
				inline-size: 100%;
				block-size: 100%;
				transform: rotate(-90deg);
			}

			.progress-circular.indeterminate {
				animation: to-rotate 1s linear infinite;
			}

			.progress-circular .track {
				fill: none;
				stroke: var(--active);
				stroke-width: 4;
			}

			.progress-circular .value {
				fill: none;
				stroke: currentColor;
				stroke-width: 4;
				stroke-linecap: round;
				transition: stroke-dashoffset var(--speed2) ease;
			}

			/* Indeterminate circular: large visible arc that rotates */
			.progress-circular.indeterminate .value {
				stroke-dasharray: 80 100;
				transition: none;
			}

			/* ─── part exposure ─── */
			.progress-linear,
			.progress-wavy,
			.progress-circular {
				flex: none;
			}
		`
	];

	/**
	 * Motor de Renderizado: Linear Progress Bar.
	 * 
	 * Renderiza un contenedor horizontal clásico. Pasa el porcentaje computado
	 * como variable CSS `--_p` para que el navegador lo interpole usando `transform: scaleX`.
	 * Expone los atributos ARIA completos para lectores de pantalla.
	 */
	private _renderLinear() {
		const isIndet = this.indeterminate;
		return html`
			<div
				class="progress-linear${isIndet ? ' indeterminate' : ''}"
				part="progress"
				role="progressbar"
				aria-valuenow=${isIndet ? nothing : this.value}
				aria-valuemin="0"
				aria-valuemax=${this.max}
				style="--_p: ${this._pct};"
			>
				<div class="value"></div>
			</div>
		`;
	}

	/**
	 * Motor de Renderizado: Wavy Progress Bar (Estilo BeerCSS/Material You).
	 * 
	 * Utiliza un `<svg>` con una animación de `clip-path` y ondas sinusoidales
	 * inyectadas directamente. Ajusta matemáticamente el ancho y la posición de la onda
	 * dependiendo de si está en modo indeterminado (infinito) o con un progreso específico (`_pct`).
	 */
	private _renderWavy() {
		// BeerCSS wavy uses an SVG mask. We replicate with an SVG clipPath wave.
		const isIndet = this.indeterminate;
		const w = 200;
		const h = 8;
		const fill = this.indeterminate ? 50 : this._pct;
		const trackW = (w * 1).toFixed(1);
		const fillW = ((w * fill) / 100).toFixed(1);
		return html`
			<div
				class="progress-wavy"
				part="progress"
				role="progressbar"
				aria-valuenow=${isIndet ? nothing : this.value}
				aria-valuemin="0"
				aria-valuemax=${this.max}
				style="--_p: ${this._pct};"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 ${w} ${h}"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<!-- Track wave (background) -->
					<path
						d="M0,4 Q5,0 10,4 Q15,8 20,4 Q25,0 30,4 Q35,8 40,4 Q45,0 50,4 Q55,8 60,4 Q65,0 70,4 Q75,8 80,4 Q85,0 90,4 Q95,8 100,4 Q105,0 110,4 Q115,8 120,4 Q125,0 130,4 Q135,8 140,4 Q145,0 150,4 Q155,8 160,4 Q165,0 170,4 Q175,8 180,4 Q185,0 190,4 Q195,8 200,4"
						fill="none"
						stroke="var(--active)"
						stroke-width="3"
					/>
					<!-- Value wave (fill) — clipped to fill width -->
					<clipPath id="wavy-clip-${this._instanceId}">
						<rect x="0" y="0" width="${isIndet ? trackW : fillW}" height="${h}">
							${isIndet
								? svg`<animate
										attributeName="x"
										from="-${w}"
										to="${w}"
										dur="3.2s"
										repeatCount="indefinite"
									/>`
								: nothing}
						</rect>
					</clipPath>
					<path
						d="M0,4 Q5,0 10,4 Q15,8 20,4 Q25,0 30,4 Q35,8 40,4 Q45,0 50,4 Q55,8 60,4 Q65,0 70,4 Q75,8 80,4 Q85,0 90,4 Q95,8 100,4 Q105,0 110,4 Q115,8 120,4 Q125,0 130,4 Q135,8 140,4 Q145,0 150,4 Q155,8 160,4 Q165,0 170,4 Q175,8 180,4 Q185,0 190,4 Q195,8 200,4"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						clip-path="url(#wavy-clip-${this._instanceId})"
					/>
				</svg>
			</div>
		`;
	}

	/**
	 * Algoritmo de renderizado para el spinner circular.
	 * Utiliza la técnica de SVG `stroke-dasharray` y `stroke-dashoffset` para animar o
	 * fijar el arco de progreso sin utilizar gradientes CSS cónicos (mejor compatibilidad).
	 *
	 * Matemáticas del círculo:
	 * Perímetro = 2 * π * radio.
	 * Para r=20, Perímetro ≈ 125.66. El porcentaje vacío se resta para desplazar (offset) el trazo.
	 */
	private _renderCircular(withWavy = false) {
		const isIndet = this.indeterminate;
		// SVG circle math: r=20, circumference = 2π*20 ≈ 125.66
		const r = 20;
		const circ = 2 * Math.PI * r;
		const dashOffset = isIndet
			? circ * 0.5  // show ~50% arc for indeterminate
			: circ * (1 - this._pct / 100);

		return html`
			<div
				class="progress-circular${isIndet ? ' indeterminate' : ''}"
				part="progress"
				role="progressbar"
				aria-valuenow=${isIndet ? nothing : this.value}
				aria-valuemin="0"
				aria-valuemax=${this.max}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 48 48"
					aria-hidden="true"
				>
					${withWavy
						? svg`
							<!-- Circular wavy uses a scalloped clip path to emulate BeerCSS wavy-circle mask -->
							<defs>
								<clipPath id="wavy-circle-clip-${this._instanceId}">
									<path d="M24,4 Q28,2 32,4 Q36,2 40,4 Q44,6 44,10 Q46,14 44,18 Q46,22 44,26 Q46,30 44,34 Q44,38 40,40 Q36,44 32,44 Q28,46 24,44 Q20,46 16,44 Q12,44 8,40 Q4,38 4,34 Q2,30 4,26 Q2,22 4,18 Q2,14 4,10 Q4,6 8,4 Q12,2 16,4 Q20,2 24,4Z"/>
								</clipPath>
							</defs>
							<circle class="track" cx="24" cy="24" r="${r}" clip-path="url(#wavy-circle-clip-${this._instanceId})"/>
							<circle
								class="value"
								cx="24" cy="24" r="${r}"
								stroke-dasharray="${isIndet ? `${circ * 0.5} ${circ * 0.5}` : `${circ - dashOffset} ${dashOffset}`}"
								stroke-dashoffset="0"
								clip-path="url(#wavy-circle-clip-${this._instanceId})"
							/>`
						: svg`
							<circle class="track" cx="24" cy="24" r="${r}"/>
							<circle
								class="value"
								cx="24" cy="24" r="${r}"
								stroke-dasharray="${isIndet ? `${circ * 0.5} ${circ * 0.5}` : `${circ - dashOffset} ${dashOffset}`}"
								stroke-dashoffset="0"
							/>`}
				</svg>
			</div>
		`;
	}

	/** ID único por instancia para los IDs de SVG clipPath */
	private readonly _instanceId = Math.random().toString(36).slice(2, 8);

	/**
	 * Despacha el renderizado al sub-renderizador privado apropiado basado en `variant`.
	 *
	 * **¿Por qué sub-renderizadores separados?**
	 * Cada variante de progreso tiene una estructura DOM fundamentalmente diferente:
	 * - Lineal: un `<div>` con un `<div>` de llenado escalado por una propiedad personalizada CSS.
	 * - Wavy (Ondulado): un `<svg>` con un `<clipPath>` animado para la máscara de onda sinusoidal.
	 * - Circular: un `<svg>` con `stroke-dasharray`/`stroke-dashoffset` para el arco.
	 *
	 * Fusionar los tres en una sola plantilla crearía un marcado profundamente condicional;
	 * dividir en `_renderLinear()`, `_renderWavy()` y `_renderCircular()` mantiene
	 * cada variante auto-contenida y permite una exposición específica de `@csspart` por variante.
	 *
	 * **`_instanceId`:**
	 * Los IDs de `<clipPath>` SVG deben ser únicos por documento; `_instanceId` es un
	 * sufijo aleatorio generado una vez en el momento de la instanciación para evitar colisiones de IDs cuando
	 * hay múltiples elementos `<moni-progress>` en la misma página.
	 */
	override render() {
		switch (this.variant) {
			case 'circular':
				return this._renderCircular(false);
			case 'circular-wavy':
				return this._renderCircular(true);
			case 'wavy':
				return this._renderWavy();
			default:
				return this._renderLinear();
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-progress': MoniProgress;
	}
}

export default MoniProgress;
