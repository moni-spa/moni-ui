import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only ripple decoration.
 *
 * To trigger a ripple at a specific point, set the `x` and `y` attributes
 * and toggle the `active` attribute. The visual scale-in animation will
 * run for `duration` ms and then the element becomes hidden.
 *
 * Attributes:
 *  - x, y:        origin in px (0..100, %)
 *  - active:      present → visible
 *  - speed:       fast | normal (default) | slow
 *  - color:       primary (default) | secondary | surface
 */
@customElement('moni-ripple')
export class MoniRipple extends MoniElement {
	@property({ type: Number, reflect: true }) x = 50;
	@property({ type: Number, reflect: true }) y = 50;
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true })
	speed: 'fast' | 'normal' | 'slow' = 'normal';
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'surface' = 'primary';

	private _target: HTMLElement | null = null;
	private _timeoutId: any = null;

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

	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('pointerdown', this._onPointerDown);
		}
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		super.disconnectedCallback();
	}

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
