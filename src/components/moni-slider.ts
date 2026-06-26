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
 * Material Design 3 Slider component.
 *
 * Sliders allow users to select a single value or a range of values from a
 * continuous or discrete scale.
 *
 * **M3 spec reference:** `m3-docs/components/sliders/specs.md`
 *
 * **Slider modes:**
 * - **Continuous** (default) — Smooth drag between `min` and `max`. Use when
 *   the exact value does not need to be defined by the user (e.g. volume).
 * - **Discrete** — Set `step` to snap to discrete intervals. Tick marks
 *   appear via the native `<datalist>` element in Chrome/Edge. Firefox does
 *   not render datalist ticks for range inputs.
 * - **Range** (`range` attribute) — Two thumbs that define a minimum and
 *   maximum value within the slider's extent.
 * - **Vertical** (`vertical` attribute) — 90° rotated slider.
 *
 * **Value label tooltip:**
 * When `indicator` is set, the current value is displayed in a tooltip above
 * (or below, via `indicator-placement`) the active thumb during focus/drag.
 *
 * **Tick marks:**
 * - `ticks` attribute: adds datalist with marks at `min` and `max` only.
 * - `tick-interval` attribute: generates datalist options at every N units
 *   between `min` and `max`, creating visible tick marks at those positions.
 *
 * **Internal state management:**
 * Uses `@state()` for `_value` and `_valueHigh` so the fill track width and
 * tooltip position update reactively on every drag `input` event without
 * waiting for the `change` event.
 *
 * @fires change - Bubbles and is composed. Fired when dragging ends and the
 *                 value is committed. Read `element.value` for the new value.
 * @fires input  - Fired on every drag step. Read `element.value` for the
 *                 live value during drag.
 *
 * @example
 * ```html
 * <!-- Continuous slider -->
 * <moni-slider name="volume" min="0" max="100" value="60"></moni-slider>
 *
 * <!-- Discrete slider with ticks every 10 units -->
 * <moni-slider step="10" tick-interval="10" indicator></moni-slider>
 *
 * <!-- Range slider -->
 * <moni-slider range min="0" max="100" value="20" value-high="80"></moni-slider>
 * ```
 *
 * @csspart slider    - The outer slider container.
 * @csspart track     - The track background.
 * @csspart fill      - The filled portion of the track.
 * @csspart indicator - The value label tooltip.
 */
@customElement('moni-slider')
export class MoniSlider extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) min = '0';
	@property({ reflect: true }) max = '100';
	@property({ reflect: true }) step = '';
	@property({ type: Number, reflect: true, attribute: 'tick-interval' })
	tickInterval: number | null = null;
	@property({ reflect: true, attribute: 'inset-icon' }) insetIcon = '';
	@property({ reflect: true, attribute: 'indicator-placement' })
	indicatorPlacement: 'top' | 'bottom' = 'top';
	@property({ reflect: true })
	size: 'tiny' | 'small' | 'medium' | 'large' | 'extra' = 'medium';

	// Boolean attributes
	@property({ type: Boolean, reflect: true }) range = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: Boolean, reflect: true }) ticks = false;
	@property({ type: Boolean, reflect: true }) indicator = false;
	@property({ type: Boolean, reflect: true, attribute: 'vertical' }) isVertical = false;

	/** Internal reactive state — triggers CSS var updates on every input event */
	@state() private _value = '50';
	@state() private _valueEnd = '75';

	@property({ reflect: true })
	get value() { return this._value; }
	set value(v: string) { this._value = v; }

	@property({ reflect: true, attribute: 'value-end' })
	get valueEnd() { return this._valueEnd; }
	set valueEnd(v: string) { this._valueEnd = v; }

	private _pct(v: string) {
		const min = parseFloat(this.min) || 0;
		const max = parseFloat(this.max) || 100;
		const val = parseFloat(v) || 0;
		return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
	}

	private _onInput(e: Event, index: number) {
		const target = e.target as HTMLInputElement;
		if (index === 0) {
			this._value = target.value;
		} else {
			this._valueEnd = target.value;
		}
		this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
	}

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
	 * Render a `<datalist>` element with tick options. When `tick-interval`
	 * is set, generates options at every N units between min and max.
	 * Otherwise, if `ticks` is set, just min and max.
	 * Browsers that support datalist ticks for range (Chrome, Edge) will
	 * render visual marks; Firefox ignores them.
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
