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
 * Visual-only ripple decoration component.
 *
 * Provides a pointer-origin ripple animation — the expanding circle starts
 * at the exact pointer-down coordinates rather than the element's center.
 * This is the full-fidelity M3 ripple; for a simpler CSS-only center-ripple,
 * use the `interactionStyles` `.interactive::after` pseudo-element instead.
 *
 * **Usage:**
 * Drop `<moni-ripple>` as a **child** of any interactive element. The component
 * automatically attaches a `pointerdown` listener to its `parentElement` and
 * calculates the ripple origin in percentage coordinates relative to the parent.
 *
 * The parent element must NOT have `position: static` (the ripple applies
 * `position: relative` automatically in `connectedCallback`).
 *
 * **Timing model:**
 * On `pointerdown`:
 * 1. `active = false` is set (cancels any in-progress ripple).
 * 2. A `requestAnimationFrame` tick ensures the browser has processed the reset.
 * 3. `active = true` triggers the CSS scale animation.
 * 4. A `setTimeout` of `duration` ms (based on `speed`) resets `active = false`.
 *
 * The duration matches the CSS transition duration so the opacity fade-out
 * completes before `active` is cleared.
 *
 * **Cleanup:**
 * `disconnectedCallback` removes the `pointerdown` listener and clears any
 * pending timeout. Always call `super.disconnectedCallback()` if subclassing.
 *
 * @example
 * ```html
 * <!-- Ripple on a custom element -->
 * <div class="my-button" style="position: relative; overflow: hidden;">
 *   Click me
 *   <moni-ripple color="primary"></moni-ripple>
 * </div>
 * ```
 *
 * @csspart ripple - The inner `<span>` that performs the scale animation.
 */
@customElement('moni-ripple')
export class MoniRipple extends MoniElement {
	/**
	 * Horizontal origin of the ripple as a percentage of the parent's width.
	 *
	 * Set automatically by `_onPointerDown` based on the pointer coordinates.
	 * Can be set manually to trigger a ripple at a specific location.
	 *
	 * @default 50
	 */
	@property({ type: Number, reflect: true }) x = 50;

	/**
	 * Vertical origin of the ripple as a percentage of the parent's height.
	 *
	 * Set automatically by `_onPointerDown` based on the pointer coordinates.
	 *
	 * @default 50
	 */
	@property({ type: Number, reflect: true }) y = 50;

	/**
	 * When `true`, the ripple is visible and animating.
	 *
	 * Toggled automatically by `_onPointerDown`. Can be set manually for
	 * programmatically-triggered ripple effects.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Animation speed of the ripple expand-and-fade sequence.
	 *
	 * Maps to the `--_dur` CSS custom property:
	 * - `'fast'`   — 300ms
	 * - `'normal'` — 600ms (default)
	 * - `'slow'`   — 1200ms
	 *
	 * @default 'normal'
	 */
	@property({ reflect: true })
	speed: 'fast' | 'normal' | 'slow' = 'normal';

	/**
	 * Color token for the ripple overlay.
	 *
	 * Sets the `color` CSS property on `:host`, which the `.ripple` span
	 * inherits via `background-color: currentColor`.
	 *
	 * - `'primary'`   — `--primary` (default)
	 * - `'secondary'` — `--secondary`
	 * - `'surface'`   — `--surface-variant` (subtle, for surface containers)
	 *
	 * @default 'primary'
	 */
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'surface' = 'primary';

	/**
	 * Reference to the parent element that the ripple is anchored to.
	 * Populated in `connectedCallback`, cleared in `disconnectedCallback`.
	 */
	private _target: HTMLElement | null = null;

	/**
	 * ID of the pending `setTimeout` that clears `active` after the animation.
	 * Stored so it can be cancelled if a second pointer event fires before the
	 * first ripple finishes (rapid double-tap prevention).
	 */
	private _timeoutId: any = null;

	/**
	 * Attaches the ripple to its parent element.
	 *
	 * - Stores a reference to `parentElement` for pointer event listening.
	 * - Ensures the parent has `position: relative` so the ripple's `position: absolute`
	 *   stays within bounds.
	 * - Registers the `_onPointerDown` event listener.
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
	 * Detaches the ripple from its parent element.
	 *
	 * Removes the `pointerdown` listener and clears any pending timeout to
	 * prevent the `active` flag from being set after the element is removed.
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
	 * Handles pointer-down events on the parent element.
	 *
	 * Computes the ripple origin as a percentage of the parent's bounding rect,
	 * cancels any in-progress ripple, then triggers a new one after one
	 * animation frame to guarantee the CSS transition fires from the new position.
	 *
	 * @param e - The `PointerEvent` from the parent's `pointerdown` listener.
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
