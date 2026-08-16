/**
 * @file components/moni-progress.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 */

import { css, html, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

export type MoniProgressVariant = 'linear' | 'circular' | 'wavy' | 'circular-wavy';
export type MoniProgressSize = 'small' | 'medium' | 'large' | 'xlarge';
export type MoniProgressMode = 'determinate' | 'buffer';

/** Material 3 Expressive progress indicator. */
@customElement('moni-progress')
export class MoniProgress extends MoniElement {
	/** Current progress value. */
	@property({ type: Number, reflect: true }) value = 0;

	/** Maximum progress value. */
	@property({ type: Number, reflect: true }) max = 100;

	/** Visual indicator family. */
	@property({ reflect: true }) variant: MoniProgressVariant = 'linear';

	/** Current M3 size token. */
	@property({ reflect: true }) size: MoniProgressSize = 'medium';

	/** Shows the animated state used when progress cannot be measured. */
	@property({ type: Boolean, reflect: true }) indeterminate = false;

	/** Linear progress behavior. Buffer adds loaded and pending regions. */
	@property({ reflect: true }) mode: MoniProgressMode = 'determinate';

	/** Buffered progress value used when mode is buffer. */
	@property({ type: Number, reflect: true, attribute: 'buffer-value' }) bufferValue = 0;

	/** Shows the optional 4px M3 stop indicator at the end of a linear track. */
	@property({ type: Boolean, reflect: true, attribute: 'stop-indicator' }) stopIndicator = false;

	/** Smoothly morphs wavy indicators to flat and back without changing progress. */
	@property({ type: Boolean, reflect: true, attribute: 'wave-transition' }) waveTransition = false;

	/** Accessible name announced by assistive technology. */
	@property({ attribute: 'aria-label' }) label = 'Progress';

	@state() private _percentage = 0;
	@state() private _reduceMotion = false;
	private _motionQuery?: MediaQueryList;
	private readonly _handleMotionPreference = (event: MediaQueryListEvent) => {
		this._reduceMotion = event.matches;
	};

	override connectedCallback() {
		super.connectedCallback();
		if (typeof window === 'undefined' || !window.matchMedia) return;
		this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this._reduceMotion = this._motionQuery.matches;
		this._motionQuery.addEventListener('change', this._handleMotionPreference);
	}

	override disconnectedCallback() {
		this._motionQuery?.removeEventListener('change', this._handleMotionPreference);
		this._motionQuery = undefined;
		super.disconnectedCallback();
	}

	override willUpdate(changed: Map<string, unknown>) {
		if (changed.has('value') || changed.has('max')) {
			const maximum = Number.isFinite(this.max) && this.max > 0 ? this.max : 100;
			const value = Number.isFinite(this.value) ? this.value : 0;
			this._percentage = Math.min(100, Math.max(0, (value / maximum) * 100));
		}

		if (changed.has('variant') && !['linear', 'circular', 'wavy', 'circular-wavy'].includes(this.variant)) {
			this.variant = 'linear';
		}

		if (changed.has('mode') && !['determinate', 'buffer'].includes(this.mode)) {
			this.mode = 'determinate';
		}
	}

	private get _isCircular() {
		return this.variant === 'circular' || this.variant === 'circular-wavy';
	}

	private get _isWavy() {
		return this.variant === 'wavy' || this.variant === 'circular-wavy';
	}

	private get _isBuffer() {
		return !this.indeterminate && this.mode === 'buffer';
	}

	private get _bufferPercentage() {
		const maximum = Number.isFinite(this.max) && this.max > 0 ? this.max : 100;
		const value = Number.isFinite(this.bufferValue) ? this.bufferValue : 0;
		return Math.max(this._percentage, Math.min(100, Math.max(0, (value / maximum) * 100)));
	}

	private _aria() {
		return {
			role: 'progressbar',
			label: this.label,
			valueNow: this.indeterminate ? nothing : this.value,
			valueText: this.indeterminate ? 'Loading' : `${Math.round(this._percentage)}%`
		};
	}

	private _renderLinear() {
		const aria = this._aria();
		const hasStarted = this._percentage > 0;
		const isInitialProgress = hasStarted && this._percentage <= 2;
		const bufferStart = hasStarted ? this._percentage : 0;
		const hasBuffer = this._isBuffer && this._bufferPercentage > bufferStart;
		const wavePath = 'M-40 7 C-35 7 -35 4 -30 4 S-25 7 -20 7 S-15 10 -10 10 S-5 7 0 7 C5 7 5 4 10 4 S15 7 20 7 S25 10 30 10 S35 7 40 7 C45 7 45 4 50 4 S55 7 60 7 S65 10 70 10 S75 7 80 7';
		const flatWavePath = 'M-40 7 C-35 7 -35 7 -30 7 S-25 7 -20 7 S-15 7 -10 7 S-5 7 0 7 C5 7 5 7 10 7 S15 7 20 7 S25 7 30 7 S35 7 40 7 C45 7 45 7 50 7 S55 7 60 7 S65 7 70 7 S75 7 80 7';
		return html`
			<div
				class="linear progress-linear ${this._isWavy ? 'wavy progress-wavy' : 'flat'} ${this.indeterminate ? 'indeterminate' : this._isBuffer ? 'buffer' : 'determinate'}"
				part="progress"
				role=${aria.role}
				aria-label=${aria.label}
				aria-valuemin="0"
				aria-valuemax=${this.max}
				aria-valuenow=${aria.valueNow}
				aria-valuetext=${aria.valueText}
				style="--_progress: ${this._percentage}%; --_p: ${this._percentage}; --_active-end: ${hasStarted ? `max(var(--_thickness), ${this._percentage}%)` : '0px'}; --_buffer-start: ${bufferStart}%; --_buffer-end: ${this._bufferPercentage}%; --_buffer-gap-start: ${hasStarted ? 'var(--_gap)' : '0px'};"
			>
				${this._isWavy
					? html`<svg class="wave-svg" aria-hidden="true">
						<defs>
							<pattern id="progress-wave" width="40" height="14" patternUnits="userSpaceOnUse">
								<path d=${wavePath}>
									${this.waveTransition && !this._reduceMotion ? svg`<animate attributeName="d" values="${wavePath};${flatWavePath};${flatWavePath};${wavePath};${wavePath}" keyTimes="0;0.25;0.5;0.75;1" dur="2s" calcMode="spline" keySplines="0.2 0 0 1;0 0 1 1;0.2 0 0 1;0 0 1 1" repeatCount="indefinite"></animate>` : nothing}
								</path>
							</pattern>
							${this.indeterminate ? svg`
								<mask id="wave-active-mask">
									<rect width="100%" height="14" fill="black"></rect>
									<rect class="mask-window primary-window" width="8%" height="14" rx="7" fill="white"></rect>
									<rect class="mask-window secondary-window" width="8%" height="14" rx="7" fill="white"></rect>
								</mask>
								<mask id="wave-track-mask">
									<rect width="100%" height="14" fill="white"></rect>
									<rect class="mask-window inverse-window primary-window" width="8%" height="14" rx="7" fill="black"></rect>
									<rect class="mask-window inverse-window secondary-window" width="8%" height="14" rx="7" fill="black"></rect>
								</mask>` : nothing}
						</defs>
						${this.indeterminate
							? svg`<rect class="indeterminate-track" x="0" y="5" width="100%" height="4" rx="2" mask="url(#wave-track-mask)"></rect>
								<rect class="wave-surface" x="0" y="0" width="100%" height="14" mask="url(#wave-active-mask)" part="indicator"></rect>`
							: svg`<rect class="wave-window active ${isInitialProgress ? 'initial' : ''}" part="indicator" x="0" y="0" width="${this._percentage}%" height="14" rx="7" ry="7"></rect>
								${isInitialProgress ? svg`<circle class="initial-dot" cx="7" cy="7" r="2"></circle>` : nothing}`}
					</svg>`
					: this.indeterminate
						? html`<svg class="flat-indeterminate-svg" aria-hidden="true">
							<defs>
								<mask id="flat-active-mask">
									<rect width="100%" height="100%" fill="black"></rect>
									<rect class="mask-window primary-window" width="8%" height="100%" rx="7" fill="white"></rect>
									<rect class="mask-window secondary-window" width="8%" height="100%" rx="7" fill="white"></rect>
								</mask>
								<mask id="flat-track-mask">
									<rect width="100%" height="100%" fill="white"></rect>
									<rect class="mask-window inverse-window primary-window" width="8%" height="100%" rx="7" fill="black"></rect>
									<rect class="mask-window inverse-window secondary-window" width="8%" height="100%" rx="7" fill="black"></rect>
								</mask>
							</defs>
							<rect class="flat-track-surface" width="100%" height="100%" rx="7" mask="url(#flat-track-mask)"></rect>
							<rect class="flat-active-surface" width="100%" height="100%" mask="url(#flat-active-mask)" part="indicator"></rect>
						</svg>`
						: html`<span class="active" part="indicator"></span>`}
				${hasBuffer ? html`<span class="buffer-segment" part="buffer"></span>` : nothing}
				<span class="track track-before" part="track"></span>
				<span class="track track-after" part="track"></span>
				${this.stopIndicator ? html`<span class="stop" part="stop-indicator"></span>` : nothing}
			</div>
		`;
	}

	private _circularPath(startPercentage = 0, endPercentage = 100, amplitude = 1.6, phase = 0) {
		const span = Math.max(0, endPercentage - startPercentage);
		const points = Math.max(2, Math.ceil(120 * (span / 100)));
		const center = 26;
		const radius = 19;
		const waves = 8;
		const commands: string[] = [];
		for (let index = 0; index <= points; index++) {
			const percentage = startPercentage + (index / points) * span;
			const angle = (percentage / 100) * Math.PI * 2 - Math.PI / 2;
			// Keep the wave phase tied to the absolute angle. Otherwise every partial
			// segment draws all eight waves again and its geometry changes with value.
			const r = radius + Math.sin(((percentage / 100) * waves + phase) * Math.PI * 2) * amplitude;
			const x = center + Math.cos(angle) * r;
			const y = center + Math.sin(angle) * r;
			commands.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
		}
		return commands.join(' ');
	}

	private _circularWaveFrames(endPercentage: number) {
		const amplitudes = this.waveTransition ? [1.6, 0, 0, 1.6, 1.6] : [1.6, 1.6, 1.6, 1.6, 1.6];
		return [0, 0.25, 0.5, 0.75, 1]
			.map((phase, index) => this._circularPath(0, endPercentage, amplitudes[index], phase))
			.join(';');
	}

	private _circularGapPercentage() {
		const metrics = {
			small: { size: 40, thickness: 4 },
			medium: { size: 44, thickness: 8 },
			large: { size: 48, thickness: 4 },
			xlarge: { size: 52, thickness: 8 }
		} as const;
		const { size, thickness } = metrics[this.size];
		const radiusInPixels = (19 / 52) * size;
		const circumference = Math.PI * 2 * radiusInPixels;

		// The center lines need the requested 4px gap plus one complete stroke
		// width, because the two round caps extend half a stroke at each end.
		return ((4 + thickness) / circumference) * 100;
	}

	private _renderCircular() {
		const aria = this._aria();
		const gap = this._circularGapPercentage();
		const halfGap = gap / 2;
		const isEmpty = this._percentage <= 0;
		const isComplete = this._percentage >= 100;
		const bufferPercentage = this._isBuffer ? this._bufferPercentage : this._percentage;
		const bufferIsComplete = bufferPercentage >= 100;
		const activeEnd = isComplete ? 100 : Math.max(0, this._percentage - halfGap);
		const bufferStart = isEmpty ? 0 : Math.min(100, this._percentage + halfGap);
		const bufferEnd = bufferIsComplete ? 100 - gap : Math.max(bufferStart, bufferPercentage - halfGap);
		const hasBuffer = this._isBuffer && bufferPercentage > this._percentage && bufferEnd > bufferStart;
		const contentEnd = hasBuffer ? bufferPercentage : this._percentage;
		const contentIsEmpty = contentEnd <= 0;
		const trackStart = contentIsEmpty ? 0 : Math.min(100, contentEnd + halfGap);
		const trackEnd = contentIsEmpty ? 100 : Math.max(trackStart, 100 - gap);
		const trackSpace = contentIsEmpty ? 100 : Math.max(0, 100 - gap - trackStart);
		const trackOpacity = contentIsEmpty ? 1 : Math.min(1, trackSpace / gap);
		const hasTrack = contentEnd < 100;
		const fullWavyPath = this._circularPath();
		const fullWaveFrames = this._circularWaveFrames(100);
		const activePath = this._circularPath(0, activeEnd);
		const flatActivePath = this._circularPath(0, Math.max(0.01, activeEnd), 0);
		const activeWaveFrames = this._circularWaveFrames(isComplete ? 100 : activeEnd);
		const bufferPath = hasBuffer ? this._circularPath(bufferStart, bufferEnd, 0) : '';
		const trackPath = hasTrack ? this._circularPath(trackStart, trackEnd, 0) : '';
		return html`
			<div
				class="circular progress-circular ${this._isWavy ? 'wavy' : 'flat'} ${this.indeterminate ? 'indeterminate' : this._isBuffer ? 'buffer' : 'determinate'}"
				part="progress"
				role=${aria.role}
				aria-label=${aria.label}
				aria-valuemin="0"
				aria-valuemax=${this.max}
				aria-valuenow=${aria.valueNow}
				aria-valuetext=${aria.valueText}
				style="--_progress: ${this._percentage}; --_p: ${this._percentage};"
			>
				<svg part="svg" viewBox="0 0 52 52" aria-hidden="true">
					${this.indeterminate && this._isWavy ? svg`<defs>
						<mask id="circular-wavy-track-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="52" height="52">
							<circle class="window-mask" cx="26" cy="26" r="19" pathLength="100" transform="rotate(-90 26 26)" stroke="white" stroke-dasharray="56 44" stroke-dashoffset="-28">
								${!this._reduceMotion ? svg`
									<animate attributeName="stroke-dasharray" values="56 44;0 100;56 44" keyTimes="0;0.5;1" dur="3.2s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1" repeatCount="indefinite"></animate>
									<animate attributeName="stroke-dashoffset" values="-28;-102;-128" keyTimes="0;0.5;1" dur="3.2s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1" repeatCount="indefinite"></animate>
								` : nothing}
							</circle>
						</mask>
						<mask id="circular-wavy-active-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="52" height="52">
							<circle class="window-mask" cx="26" cy="26" r="19" pathLength="100" transform="rotate(-90 26 26)" stroke="white" stroke-dasharray="12 88" stroke-dashoffset="0">
								${!this._reduceMotion ? svg`
									<animate attributeName="stroke-dasharray" values="12 88;68 32;12 88" keyTimes="0;0.5;1" dur="3.2s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1" repeatCount="indefinite"></animate>
									<animate attributeName="stroke-dashoffset" values="0;-18;-100" keyTimes="0;0.5;1" dur="3.2s" calcMode="spline" keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1" repeatCount="indefinite"></animate>
								` : nothing}
							</circle>
						</mask>
					</defs>` : nothing}
					${this.indeterminate
						? svg`<circle class="track" part="track" cx="26" cy="26" r="19" pathLength="100" mask=${this._isWavy ? 'url(#circular-wavy-track-mask)' : nothing}></circle>`
						: hasTrack
							? svg`<path class="track" part="track" d=${trackPath} style="opacity: ${trackOpacity}"></path>`
							: nothing}
					${hasBuffer ? svg`<path class="buffer-segment" part="buffer" d=${bufferPath}></path>` : nothing}
					${this._isWavy
						? this.indeterminate
							? svg`<path class="active" part="indicator" d=${fullWavyPath} pathLength="100" mask="url(#circular-wavy-active-mask)">
								${!this._reduceMotion ? svg`<animate
									attributeName="d"
									values=${fullWaveFrames}
									keyTimes="0;0.25;0.5;0.75;1"
									dur="1s"
									calcMode="linear"
									repeatCount="indefinite"
								></animate>` : nothing}
							</path>`
							: !isEmpty
								? svg`<path class="active" part="indicator" d=${isComplete ? fullWavyPath : activePath}>
									${!this._reduceMotion ? svg`<animate
										attributeName="d"
										values=${activeWaveFrames}
										keyTimes="0;0.25;0.5;0.75;1"
										dur="1s"
										calcMode="linear"
										repeatCount="indefinite"
									></animate>` : nothing}
								</path>`
								: nothing
						: isComplete
							? svg`<circle class="active" part="indicator" cx="26" cy="26" r="19"></circle>`
							: !isEmpty
								? svg`<path class="active" part="indicator" d=${flatActivePath}></path>`
								: nothing}
				</svg>
			</div>
		`;
	}

	override render() {
		return this._isCircular ? this._renderCircular() : this._renderLinear();
	}

	static override styles = [
		sharedStyles,
		css`
			@keyframes linear-indeterminate-primary {
				0% { inset-inline-start: -145.167%; inline-size: 8%; }
				20% { inset-inline-start: -113.333%; inline-size: 48%; }
				60% { inset-inline-start: 56.333%; inline-size: 78%; }
				100% { inset-inline-start: 100%; inline-size: 8%; }
			}

			@keyframes linear-indeterminate-secondary {
				0% { inset-inline-start: -54.888%; inline-size: 8%; }
				20% { inset-inline-start: -20%; inline-size: 48%; }
				60% { inset-inline-start: 60%; inline-size: 78%; }
				100% { inset-inline-start: 160%; inline-size: 8%; }
			}

			@keyframes circular-rotate { to { transform: rotate(360deg); } }
			@keyframes circular-grow {
				0% { stroke-dasharray: 12 88; stroke-dashoffset: 0; }
				50% { stroke-dasharray: 68 32; stroke-dashoffset: -18; }
				100% { stroke-dasharray: 12 88; stroke-dashoffset: -100; }
			}
			@keyframes circular-track-grow {
				0% {
					stroke-dasharray: 60 40;
					stroke-dashoffset: -26;
				}
				50% {
					stroke-dasharray: 4 96;
					stroke-dashoffset: -100;
				}
				100% {
					stroke-dasharray: 60 40;
					stroke-dashoffset: -126;
				}
			}

			@keyframes wave-phase {
				to { transform: translateX(40px); }
			}

			@keyframes buffer-dots {
				to { mask-position: calc(var(--_thickness) * -2) 0; }
			}

			@keyframes circular-buffer-dots {
				to { stroke-dashoffset: calc(var(--_thickness) * 2); }
			}

			@keyframes wavy-indeterminate-primary {
				0% { transform: translateX(-145.167%); width: 8%; }
				20% { transform: translateX(-113.333%); width: 48%; }
				60% { transform: translateX(56.333%); width: 78%; }
				100% { transform: translateX(100%); width: 8%; }
			}

			@keyframes wavy-indeterminate-secondary {
				0% { transform: translateX(-54.888%); width: 8%; }
				20% { transform: translateX(-20%); width: 48%; }
				60% { transform: translateX(60%); width: 78%; }
				100% { transform: translateX(160%); width: 8%; }
			}

			:host {
				--_active-color: var(--moni-progress-active, var(--primary));
				--_track-color: var(--moni-progress-track, var(--secondary-container, var(--active)));
				--_gap: 4px;
				--_stop: 4px;
				--_thickness: 4px;
				--_linear-height: 4px;
				--_circular-size: 40px;
				display: inline-flex;
				inline-size: 100%;
				color: var(--_active-color);
				contain: layout style;
			}

			:host([size='medium']) {
				--_thickness: 8px;
				--_linear-height: 8px;
				--_circular-size: 44px;
			}

			:host([size='large']) {
				--_thickness: 4px;
				--_linear-height: 10px;
				--_circular-size: 48px;
			}

			:host([size='xlarge']) {
				--_thickness: 8px;
				--_linear-height: 14px;
				--_circular-size: 52px;
			}

			:host([variant='circular']),
			:host([variant='circular-wavy']) {
				inline-size: var(--_circular-size);
				block-size: var(--_circular-size);
			}

			.linear {
				position: relative;
				inline-size: 100%;
				block-size: var(--_linear-height);
				overflow: hidden;
			}

			.linear > span {
				position: absolute;
				inset-block-start: 50%;
				transform: translateY(-50%);
			}

			.linear > .active {
				inset-inline-start: 0;
				inline-size: var(--_active-end);
				block-size: var(--_thickness);
				background: var(--_active-color);
				border-radius: 999px;
				transition: inline-size 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.linear .track {
				inset-inline-start: min(100%, calc(var(--_active-end) + var(--_gap)));
				inset-inline-end: 0;
				block-size: 4px;
				background: var(--_track-color);
				border-radius: 999px;
				transition: inset-inline-start 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.linear .buffer-segment {
				inset-inline-start: min(100%, calc(var(--_buffer-start) + var(--_buffer-gap-start)));
				inset-inline-end: max(0%, calc(100% - var(--_buffer-end)));
				block-size: var(--_thickness);
				background: var(--_track-color);
				border-radius: 999px;
				transition: inset-inline-start 300ms cubic-bezier(0.2, 0, 0, 1), inset-inline-end 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.linear.buffer .track-after {
				inset-inline-start: min(100%, calc(var(--_buffer-end) + var(--_gap)));
				background-color: var(--_track-color);
				mask-image: radial-gradient(circle, #000 0, #000 calc(var(--_thickness) / 2), transparent calc(var(--_thickness) / 2));
				mask-size: calc(var(--_thickness) * 2) 100%;
				mask-repeat: repeat;
				animation: buffer-dots 250ms linear infinite;
			}

			.linear .track-before {
				display: none;
				inset-inline-start: 0;
			}

			.linear .stop {
				inset-inline-end: 0;
				inline-size: var(--_stop);
				block-size: var(--_stop);
				background: var(--_active-color);
				border-radius: 50%;
			}

			.linear.wavy {
				block-size: calc(var(--_thickness) + 6px);
			}

			.wave-svg {
				position: absolute;
				inset-inline: 0;
				inset-block-start: 50%;
				inline-size: 100%;
				block-size: 14px;
				transform: translateY(-50%);
				overflow: hidden;
				z-index: 1;
			}

			.wave-svg pattern path {
				fill: none;
				stroke: var(--_active-color);
				stroke-width: var(--_thickness);
				stroke-linecap: round;
				/* BeerCSS uses a one-second translation embedded in wavy.svg. */
				animation: wave-phase 1s linear infinite;
			}

			.wave-window {
				fill: url(#progress-wave);
				width: var(--_active-end);
				transition: width 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.wave-window.initial { visibility: hidden; }
			.initial-dot {
				fill: var(--_active-color);
				r: calc(var(--_thickness) / 2);
			}

			.wave-surface { fill: url(#progress-wave); }
			.indeterminate-track {
				fill: var(--_track-color);
				y: calc(7px - var(--_thickness) / 2);
				height: var(--_thickness);
			}
			.mask-window { transform-box: view-box; }
			.inverse-window {
				stroke: black;
				stroke-width: calc(var(--_gap) * 2);
			}
			.primary-window {
				animation: wavy-indeterminate-primary 2.1s linear infinite;
			}
			.secondary-window {
				animation: wavy-indeterminate-secondary 2.1s linear 1.15s infinite backwards;
			}

			.flat-indeterminate-svg {
				position: absolute;
				inset: 0;
				inline-size: 100%;
				block-size: 100%;
				overflow: hidden;
				z-index: 1;
			}
			.flat-track-surface { fill: var(--_track-color); }
			.flat-active-surface { fill: var(--_active-color); }

			.linear.flat.indeterminate > .track { display: none; }
			.linear.wavy.indeterminate > .track { display: none; }
			.linear.indeterminate .stop { display: none; }

			.linear.indeterminate::after { display: none; }

			.circular,
			.circular svg {
				inline-size: var(--_circular-size);
				block-size: var(--_circular-size);
			}

			.circular svg { overflow: visible; }
			.circular :is(circle, path) {
				fill: none;
				stroke-linecap: round;
				stroke-width: var(--_thickness);
				vector-effect: non-scaling-stroke;
			}

			.circular .window-mask {
				stroke-width: 12;
				stroke-linecap: round;
				vector-effect: none;
			}

			.circular .track {
				stroke: var(--_track-color);
				transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.circular .buffer-segment {
				stroke: var(--_track-color);
			}

			.circular.buffer .track {
				stroke-dasharray: 0.01px calc(var(--_thickness) * 2);
				animation: circular-buffer-dots 250ms linear infinite;
			}

			.circular .active {
				stroke: var(--_active-color);
				stroke-dashoffset: 0;
				transition: stroke-dasharray 300ms cubic-bezier(0.2, 0, 0, 1);
			}

			.circular.indeterminate .track { display: none; }
			.circular.indeterminate svg { animation: circular-rotate 1s linear infinite; }
			.circular.indeterminate .active {
				animation: circular-grow 3.2s ease infinite;
				transition: none;
			}
			.circular.wavy.indeterminate .active {
				animation: none;
			}
			.circular.wavy.indeterminate .track {
				display: block;
				animation: none;
			}

			@media (prefers-reduced-motion: reduce) {
				.linear .active,
				.linear .track,
				.circular .active { transition: none; }
				.linear.flat.indeterminate > .active {
					animation: none;
					inset-inline-start: 0;
					inline-size: 40%;
				}
				.linear.indeterminate::after { display: none; }
				.mask-window { animation: none; }
				.primary-window { transform: translateX(0); width: 40%; }
				.secondary-window { visibility: hidden; }
				.wave-svg pattern path { animation: none; }
				.circular.indeterminate svg,
				.circular.indeterminate .active { animation: none; }
				.circular.wavy.indeterminate .track { animation: none; }
				.circular.indeterminate .active { stroke-dasharray: 28 72 !important; }
				.circular.wavy.indeterminate .track {
					stroke-dasharray: 44 56 !important;
					stroke-dashoffset: -42 !important;
				}
			}
		`
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-progress': MoniProgress;
	}
}

export default MoniProgress;
