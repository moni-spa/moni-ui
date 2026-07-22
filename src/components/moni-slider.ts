/**
 * @file components/moni-slider.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Slider (Control deslizante).
 *
 * Los sliders permiten a los usuarios seleccionar un solo valor o un rango de valores
 * desde una escala continua o discreta.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/sliders/specs.md`
 *
 * **Modos de Slider:**
 * - **Continuo (Continuous)** (por defecto) — Arrastre suave entre `min` y `max`. Úsalo cuando
 *   no sea necesario que el usuario defina un valor exacto (ej. volumen).
 * - **Discreto (Discrete)** — Configura `step` para ajustarse a intervalos discretos. Las marcas
 *   (tick marks) aparecen a través del elemento nativo `<datalist>` en Chrome/Edge. Firefox no
 *   renderiza marcas de datalist para inputs de tipo rango.
 * - **Rango (Range)** (atributo `range`) — Dos controles (thumbs) que definen un valor mínimo y
 *   máximo dentro de la extensión del slider.
 * - **Vertical** (atributo `vertical`) — Slider rotado 90°.
 *
 * **Tooltip indicador de valor (Value label tooltip):**
 * Cuando se configura `indicator`, el valor actual se muestra en un tooltip por encima
 * (o por debajo, a través de `indicator-placement`) del control activo durante el foco/arrastre.
 *
 * **Marcas (Tick marks):**
 * - Atributo `ticks`: agrega datalist con marcas solo en `min` y `max`.
 * - Atributo `tick-interval`: genera opciones de datalist cada N unidades
 *   entre `min` y `max`, creando marcas visibles en esas posiciones.
 *
 * **Manejo del estado interno:**
 * Usa `@state()` para `_value` y `_valueHigh` de modo que el ancho de la pista de llenado y
 * la posición del tooltip se actualicen de forma reactiva en cada evento `input` de arrastre sin
 * esperar al evento `change`.
 *
 * @fires change - Burbujea y está compuesto. Se dispara cuando termina el arrastre y el
 *                 valor se confirma. Lee `element.value` para el nuevo valor.
 * @fires input  - Se dispara en cada paso del arrastre. Lee `element.value` para el
 *                 valor en vivo durante el arrastre.
 *
 * @example
 * ```html
 * <!-- Slider continuo -->
 * <moni-slider name="volume" min="0" max="100" value="60"></moni-slider>
 *
 * <!-- Slider discreto con marcas cada 10 unidades -->
 * <moni-slider step="10" tick-interval="10" indicator></moni-slider>
 *
 * <!-- Slider de rango -->
 * <moni-slider range min="0" max="100" value="20" value-high="80"></moni-slider>
 * ```
 *
 * @csspart slider    - El contenedor exterior del slider.
 * @csspart track     - El fondo de la pista.
 * @csspart fill      - La porción llena de la pista.
 * @csspart indicator - El tooltip de la etiqueta de valor.
 */
@customElement('moni-slider')
export class MoniSlider extends MoniElement {
	/**
	 * Nombre del input del slider, usado en el envío de formularios.
	 * @type {string}
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Valor mínimo del slider.
	 * @type {string}
	 * @default '0'
	 */
	@property({ reflect: true }) min = '0';

	/**
	 * Valor máximo del slider.
	 * @type {string}
	 * @default '100'
	 */
	@property({ reflect: true }) max = '100';

	/**
	 * Granularidad del slider. Debe ser un número positivo.
	 * @type {string}
	 */
	@property({ reflect: true }) step = '';

	/**
	 * Anula (overrides) el intervalo predeterminado de las marcas cuando `ticks` es verdadero.
	 * @type {number | null}
	 */
	@property({ type: Number, reflect: true, attribute: 'tick-interval' })
	tickInterval: number | null = null;

	/**
	 * Nombre del icono (Material Symbols) mostrado dentro del control (thumb) del slider.
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'inset-icon' }) insetIcon = '';

	/**
	 * Ubicación del tooltip indicador de valor.
	 * @type {'top' | 'bottom'}
	 * @default 'top'
	 */
	@property({ reflect: true, attribute: 'indicator-placement' })
	indicatorPlacement: 'top' | 'bottom' = 'top';

	/**
	 * Grosor/tamaño de la pista y el control (thumb) del slider.
	 * @type {'tiny' | 'small' | 'medium' | 'large' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'tiny' | 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Habilita el modo de rango (dos controles: `value` y `valueEnd`).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) range = false;

	/**
	 * Deshabilita el slider.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Renderiza marcas (tick marks) a lo largo de la pista en cada intervalo de paso.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) ticks = false;

	/**
	 * Muestra un indicador de tooltip mostrando el(los) valor(es) actual(es) mientras se arrastra.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) indicator = false;

	/**
	 * Renderiza el slider de forma vertical en lugar de horizontal.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'vertical' }) isVertical = false;

	/** Estado reactivo interno — dispara actualizaciones de variables CSS en cada evento de input */
	@state() private _value = '50';
	@state() private _valueEnd = '75';

	/**
	 * El valor primario actual del slider (o el límite inferior en modo de rango).
	 * @type {string}
	 */
	@property({ reflect: true })
	get value() { return this._value; }
	/**
	 * Intercepta asignaciones imperativas (`element.value = "X"`) para actualizar
	 * el estado interno de Lit, garantizando reactividad instantánea del DOM.
	 */
	set value(v: string) { this._value = v; }

	/**
	 * El valor límite superior actual (solo usado cuando `range` es verdadero).
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'value-end' })
	get valueEnd() { return this._valueEnd; }
	/**
	 * Setter reactivo para el límite superior (usado exclusivamente en modo `range`).
	 */
	set valueEnd(v: string) { this._valueEnd = v; }

	/**
	 * Calcula el porcentaje de llenado de la barra (0-100) basándose en el valor actual,
	 * el mínimo y el máximo. Se utiliza intensivamente para definir variables CSS (como `--_pct`).
	 */
	private _pct(v: string) {
		const min = parseFloat(this.min) || 0;
		const max = parseFloat(this.max) || 100;
		const val = parseFloat(v) || 0;
		// Math.max/min asegura que no desborde si por alguna razón val > max o val < min
		return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
	}

	/**
	 * Maneja el evento nativo "input" de los inputs type="range" subyacentes.
	 * Se dispara contínuamente mientras el usuario arrastra el slider.
	 * Actualiza el estado reactivo inmediatamente para que la UI responda en tiempo real (60fps).
	 */
	private _onInput(e: Event, index: number) {
		const target = e.target as HTMLInputElement;
		if (index === 0) {
			this._value = target.value;
		} else {
			this._valueEnd = target.value;
		}
		// Redisparamos el evento hacia afuera para que los frameworks (React/Vue/Angular) puedan atraparlo
		this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
	}

	/**
	 * Maneja el evento nativo "change", que se dispara solo cuando el usuario SUELTA el slider
	 * (al terminar la interacción). Útil para peticiones HTTP pesadas o validaciones finales.
	 */
	private _onChange(e: Event, index: number) {
		const target = e.target as HTMLInputElement;
		if (index === 0) {
			this._value = target.value;
		} else {
			this._valueEnd = target.value;
		}
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	/**
	 * Renderiza un elemento `<datalist>` con opciones de marcas. Cuando se establece
	 * `tick-interval`, genera opciones cada N unidades entre el mínimo y el máximo.
	 * De lo contrario, si se establece `ticks`, solo mínimo y máximo.
	 * Los navegadores que soportan marcas de datalist para inputs de rango (Chrome, Edge)
	 * renderizarán marcas visuales; Firefox las ignora.
	 */
	private _renderDatalist() {
		if (this.tickInterval != null && this.tickInterval > 0) {
			const min = parseFloat(this.min) || 0;
			const max = parseFloat(this.max) || 100;
			const step = this.tickInterval;
			const options: number[] = [];
			for (let v = min; v <= max; v += step) {
				options.push(Math.round(v * 1000) / 1000);
			}
			return html`<datalist id="ticks">
				${options.map((v) => html`<option value=${v}></option>`)}
			</datalist>`;
		}
		if (this.ticks) {
			return html`<datalist id="ticks">
				<option value=${this.min}></option>
				<option value=${this.max}></option>
			</datalist>`;
		}
		return nothing;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			/* BeerCSS .slider.vertical */
			:host([vertical]) {
				display: inline-block;
				inline-size: var(--_thumb, 2.5rem);
				block-size: var(--moni-slider-height, 150px);
				vertical-align: middle;
				position: relative;
			}

			:host([vertical]) .slider {
				margin: 0.5rem auto !important;
				padding: 50% 0;
				transform: rotate(-90deg);
				inline-size: 100%;
			}

			/* BeerCSS .slider */
			.slider {
				--_start: 0%;
				--_end: 0%;
				--_track: 1rem;
				--_thumb: max(2.5rem, calc(var(--_track, 0) + 0.5rem));
				display: flex;
				align-items: center !important;
				inline-size: auto;
				block-size: var(--_thumb);
				flex: none;
				direction: ltr;
				margin: 0 1.25rem;
				color: var(--primary);
				position: relative;
			}

			.slider.tiny  { --_track: 1rem; }
			.slider.small { --_track: 1.5rem; }
			.slider.medium { --_track: 2.5rem; }
			.slider.large { --_track: 3.5rem; }
			.slider.extra { --_track: 6rem; }

			/* BeerCSS: track background via ::before */
			.slider::before {
				content: "";
				position: absolute;
				inline-size: 100%;
				block-size: var(--_track);
				border-radius: 1rem;
				background: var(--active);
				clip-path: polygon(
					calc(var(--_start, 0) - 0.5rem) 0, 0 0, 0 100%,
					calc(var(--_start, 0) - 0.5rem) 100%, calc(var(--_start, 0) - 0.5rem) 0,
					calc(100% - var(--_end, 0) + 0.5rem) 0, 100% 0, 100% 100%,
					calc(100% - var(--_end, 0) + 0.5rem) 100%, calc(100% - var(--_end, 0) + 0.5rem) 0
				);
			}

			/* BeerCSS: colored fill span */
			.slider > span:not([class]) {
				position: absolute;
				block-size: var(--_track);
				border-radius: 1rem 0 0 1rem;
				background: currentColor;
				color: currentColor;
				z-index: 0;
				inset: calc(50% - (var(--_track, 0) / 2))
					calc(var(--_end) + 0.5rem) auto var(--_start);
			}

			.slider > input[type='range'] + input[type='range'] ~ span:not([class]) {
				border-radius: 0;
				inset: calc(50% - (var(--_track, 0) / 2))
					calc(var(--_end) + 0.5rem) auto
					calc(var(--_start) + 0.5rem);
			}

			/* BeerCSS slider inputs */
			.slider > input {
				appearance: none;
				box-shadow: none;
				border: none;
				outline: none;
				pointer-events: none;
				inline-size: 100%;
				block-size: var(--_track);
				background: none;
				z-index: 1;
				padding: 0;
				margin: 0;
				touch-action: none;
			}

			.slider > input:only-of-type {
				pointer-events: all;
			}

			.slider > input ~ input {
				position: absolute;
			}

			/* BeerCSS thumb styles */
			.slider > input::-webkit-slider-thumb {
				appearance: none;
				box-shadow: none;
				border: none;
				outline: none;
				pointer-events: all;
				block-size: var(--_thumb);
				inline-size: 0.25rem;
				border-radius: 0.25rem;
				background: currentColor;
				cursor: grab;
				margin: 0;
				z-index: 1;
			}
			.slider > input::-webkit-slider-thumb:active { cursor: grabbing; }

			.slider > input::-moz-range-thumb {
				appearance: none;
				box-shadow: none;
				border: none;
				outline: none;
				pointer-events: all;
				block-size: 2.75rem;
				inline-size: 0.25rem;
				border-radius: 0.25rem;
				background: var(--primary);
				cursor: grab;
				margin: 0;
			}

			.slider > input:not(:disabled):is(:focus)::-webkit-slider-thumb {
				transform: scaleX(0.6);
			}

			.slider > input:disabled { cursor: not-allowed; }
			.slider > input:disabled::-webkit-slider-thumb { background: var(--outline); cursor: not-allowed; }
			.slider > input:disabled::-moz-range-thumb { background: var(--outline); cursor: not-allowed; }
			.slider > input:disabled ~ span:not([class]) { background: var(--outline); }

			.slider:has(> [disabled]) { opacity: 0.62; }

			/* Focus visible outline */
			.slider > input:focus-visible::-webkit-slider-thumb {
				outline: 0.1875rem solid var(--primary);
				outline-offset: 0.25rem;
			}
			.slider > input:focus-visible::-moz-range-thumb {
				outline: 0.1875rem solid var(--primary);
				outline-offset: 0.25rem;
			}

			/* Inset icon */
			.slider > span > i {
				position: absolute;
				block-size: auto;
				inset: 0 auto 0 0.5rem;
				color: var(--inverse-primary);
				z-index: 1;
			}
			.slider:not(.medium, .large, .extra) > span > i { display: none; }

			/* Value indicator tooltip */
			.slider > .tooltip {
				visibility: hidden;
				opacity: 0;
				border-radius: 2rem;
				transition: top var(--speed2) ease, opacity var(--speed2) ease;
				transform: translate(-50%, -25%);
				padding: 0.75rem 1rem;
				position: absolute;
				background-color: var(--inverse-surface);
				color: var(--inverse-on-surface);
				font-size: 0.75rem;
				font-weight: 500;
				z-index: 2;
				white-space: nowrap;
			}

			.slider > .tooltip.bottom {
				transform: translate(-50%, 25%);
			}

			/* BeerCSS: tooltip shows on :focus of the input */
			.slider > input:first-of-type:focus ~ .tooltip-1,
			.slider > input:nth-of-type(2):focus ~ .tooltip-2 {
				inset-block: -1rem auto;
				opacity: 1;
				visibility: visible;
			}

			.slider > input:first-of-type:focus ~ .tooltip-1.bottom,
			.slider > input:nth-of-type(2):focus ~ .tooltip-2.bottom {
				inset-block: auto -1rem;
			}
		`
	];

	/**
	 * Ensambla la estructura del Shadow DOM del slider.
	 *
	 * **Cálculo de la pista llena:**
	 * `pct` y `pctEnd` son valores porcentuales (0–100) derivados de
	 * `_pct(value)`. Se inyectan como propiedades CSS personalizadas `--_start` y `--_end`
	 * en el contenedor `.slider`. El pseudo-elemento CSS `::before`
	 * utiliza estos valores en un `clip-path: polygon(...)` para renderizar la parte
	 * no llena de la pista, mientras que el `<span>` renderiza la parte llena.
	 *
	 * **Modo Rango (`range=true`):**
	 * - Se renderizan dos elementos `<input type="range">` (uno para el límite inferior,
	 *   otro para el límite superior).
	 * - El CSS los superpone absolutamente para que los controles (thumbs) compartan la misma línea de pista.
	 * - `--_start` equivale al porcentaje del control inferior; `--_end` equivale a `100 - pctEnd`.
	 *
	 * **Tooltip indicador:**
	 * Los elementos tooltip `.tooltip-1` / `.tooltip-2` están posicionados absolutamente
	 * utilizando `inset-inline-start: ${pct}%` de modo que siguen al control activo
	 * por encima (o por debajo) a medida que el usuario arrastra. La visibilidad se controla
	 * puramente a través de selectores CSS `:focus` — no se requiere JavaScript.
	 *
	 * **Datalist de marcas (Tick datalist):**
	 * `_renderDatalist()` emite un `<datalist id="ticks">` solo cuando `ticks` o
	 * `tick-interval` está establecido. Chrome/Edge renderizan marcas nativas en inputs de rango
	 * que referencian un datalist a través del atributo `list`; Firefox lo ignora.
	 */
	override render() {
		const pct = this._pct(this._value);
		const pctEnd = this._pct(this._valueEnd);

		const start = this.range ? pct : 0;
		const end = this.range ? 100 - pctEnd : 100 - pct;

		const rangeInput = (i: number, val: string) => html`
			<input
				part="control"
				type="range"
				min=${this.min}
				max=${this.max}
				step=${ifDefined(this.step || undefined)}
				list=${ifDefined(this.ticks ? 'ticks' : undefined)}
				?disabled=${this.disabled}
				.value=${val}
				name=${i === 0 ? ifDefined(this.name || undefined) : nothing}
				@input=${(e: Event) => this._onInput(e, i)}
				@change=${(e: Event) => this._onChange(e, i)}
			/>
		`;

		const inset =
			this.insetIcon && ['medium', 'large', 'extra'].includes(this.size)
				? html`<i><moni-icon name="${this.insetIcon}"></moni-icon></i>`
				: '';

		const tooltip1 = this.indicator
			? html`<div class="tooltip tooltip-1 ${this.indicatorPlacement}" style="inset-inline-start: ${pct}%;">${this._value}</div>`
			: nothing;

		const tooltip2 = this.indicator && this.range
			? html`<div class="tooltip tooltip-2 ${this.indicatorPlacement}" style="inset-inline-start: ${pctEnd}%;">${this._valueEnd}</div>`
			: nothing;

		return html`<div
			class="slider ${this.size}${this.isVertical ? ' vertical' : ''}"
			part="root"
			style="--_start: ${start}%; --_end: ${end}%;"
		>
			${this._renderDatalist()}
			${this.range
				? html`${rangeInput(0, this._value)}${rangeInput(1, this._valueEnd)}`
				: rangeInput(0, this._value)}
			<span>${inset}</span>
			${tooltip1}
			${tooltip2}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-slider': MoniSlider;
	}
}

export default MoniSlider;
