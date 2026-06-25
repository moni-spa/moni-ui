import { html, css, svg, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Progress indicator that faithfully ports BeerCSS's progress styles.
 *
 * BeerCSS uses the native <progress> element with `::after`, `::before` and
 * `mask-image` pseudo-elements. Those don't work inside Shadow DOM because:
 *  - `<progress>` native pseudo-elements (::webkit-progress-value, ::after)
 *    are blocked by the UA shadow root in Chrome/Firefox within a custom shadow.
 *  - `mask-image` on those pseudo-elements doesn't apply at all in shadows.
 *
 * Solution: use a plain <div> wrapper that replicates BeerCSS's visual rules
 * exactly, and an SVG for the circular variant (matching BeerCSS's conic-gradient
 * approach but with SVG stroke for better cross-browser support).
 *
 * Attributes:
 *  - value:         0..max (omit for indeterminate)
 *  - max:           upper bound (default 100)
 *  - variant:       linear (default) | circular | wavy | circular-wavy
 *  - size:          small | medium (default) | large
 *  - indeterminate: present → infinite animation
 */
@customElement('moni-progress')
export class MoniProgress extends MoniElement {
	@property({ type: Number, reflect: true }) value = 0;
	@property({ type: Number, reflect: true }) max = 100;
	@property({ reflect: true })
	variant: 'linear' | 'circular' | 'wavy' | 'circular-wavy' = 'linear';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';
	@property({ type: Boolean, reflect: true }) indeterminate = false;

	/** Computed fill percentage (0-100) used in styles/SVG */
	@state() private _pct = 0;

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

	/** Unique ID per instance for SVG clipPath IDs */
	private readonly _instanceId = Math.random().toString(36).slice(2, 8);

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
