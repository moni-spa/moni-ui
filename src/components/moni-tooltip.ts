/**
 * @file components/moni-tooltip.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Tooltip component.
 *
 * Tooltips provide contextual text labels or rich content that appear when
 * users hover over, focus on, or tap an element. They surface supplementary
 * information that helps users understand interface elements without
 * permanently occupying screen space.
 *
 * **M3 spec reference:** `m3-docs/components/tooltips/specs.md`
 *
 * **Types:**
 * - **Plain** (default) — Text-only label for simple descriptions (max 1 line).
 * - **Rich** (`rich` attribute) — HTML content including formatted text,
 *   links, and icons. Rich tooltips can contain multiple lines and action links.
 *
 * **Placements:**
 * - `top` (default), `top-start`, `top-end`
 * - `bottom`, `bottom-start`, `bottom-end`
 *
 * **Trigger mechanism:**
 * The tooltip uses `position: absolute` inside the parent element. The parent
 * must have `position: relative` (set automatically via `connectedCallback`).
 * Hover/focus events on the parent trigger the tooltip's CSS `:hover` and
 * `:focus-within` selectors, which drive the show/hide transition.
 *
 * **Accessibility:**
 * - The tooltip has `role="tooltip"`.
 * - For keyboard accessibility, the parent should have `aria-describedby`
 *   pointing to the tooltip's `id` attribute. The component exposes a
 *   `tooltipId` getter for this purpose.
 * - The `Escape` key closes rich tooltips.
 *
 * @example
 * ```html
 * <!-- Plain tooltip -->
 * <button aria-describedby="save-tip">
 *   Save
 *   <moni-tooltip id="save-tip" text="Ctrl+S"></moni-tooltip>
 * </button>
 *
 * <!-- Rich tooltip -->
 * <button>
 *   Filter
 *   <moni-tooltip rich position="bottom">
 *     <strong>Filter by date</strong>
 *     <p>Select a date range to filter results.</p>
 *   </moni-tooltip>
 * </button>
 * ```
 *
 * @slot default - Rich content for the tooltip body (only used when `rich=true`).
 *
 * @csspart tooltip - The tooltip container element.
 */
@customElement('moni-tooltip')
export class MoniTooltip extends MoniElement {
	@property({ reflect: true }) text = '';
	@property({ reflect: true })
	position:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end' = 'top';
	@property({ reflect: true })
	size: '' | 'small' | 'medium' | 'large' = '';
	@property({ type: Boolean, reflect: true }) rich = false;

	private _target: HTMLElement | null = null;
	private _tooltipEl: HTMLElement | null = null;
	private _docKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);
	/**
	 * CSS `anchor-name` registered on the parent trigger so the tooltip
	 * can use `position-anchor` to bind to it. Generated per-instance via
	 * `crypto.randomUUID()` when CSS anchor positioning is supported.
	 */
	private _anchorName: string | null = null;

	override connectedCallback() {
		super.connectedCallback();
		this._target = this.parentElement;
		if (this._target) {
			// Ensure parent has position: relative so absolute tooltip is anchored
			const style = getComputedStyle(this._target);
			if (style.position === 'static') {
				this._target.style.position = 'relative';
			}
			this._target.addEventListener('mouseenter', this._show);
			this._target.addEventListener('focusin', this._show);
			this._target.addEventListener('mouseleave', this._hide);
			this._target.addEventListener('focusout', this._hide);

			// Auto-register a CSS anchor name on the parent trigger when the
			// browser supports anchor positioning. Consumers can opt out by
			// setting `data-no-anchor` on the trigger.
			const cssSupports = (globalThis as unknown as {
				CSS?: { supports?: (k: string) => boolean };
			}).CSS?.supports;
			const supportsAnchor = cssSupports
				? cssSupports.call(window.CSS, 'anchor-name: --x')
				: false;
			if (supportsAnchor && !this._target.hasAttribute('data-no-anchor')) {
				const cryptoApi = (globalThis as unknown as {
					crypto?: { randomUUID?: () => string };
				}).crypto;
				const id = cryptoApi?.randomUUID?.()
					?? `tt-${Math.random().toString(36).slice(2, 10)}`;
				this._anchorName = `--moni-tooltip-anchor-${id}`;
				this._target.style.setProperty('anchor-name', this._anchorName);
			}
		}
		document.addEventListener('keydown', this._docKeydown);
	}

	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('mouseenter', this._show);
			this._target.removeEventListener('focusin', this._show);
			this._target.removeEventListener('mouseleave', this._hide);
			this._target.removeEventListener('focusout', this._hide);
			if (this._anchorName) {
				this._target.style.removeProperty('anchor-name');
				this._anchorName = null;
			}
		}
		document.removeEventListener('keydown', this._docKeydown);
		super.disconnectedCallback();
	}

	private _show = () => {
		if (!this._tooltipEl) {
			this._tooltipEl = this.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		}
		if (this._tooltipEl) {
			this._tooltipEl.classList.add('visible');
		}
	};

	private _hide = () => {
		if (!this._tooltipEl) {
			this._tooltipEl = this.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		}
		if (this._tooltipEl) {
			this._tooltipEl.classList.remove('visible');
		}
	};

	private _handleDocKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (!this._tooltipEl?.classList.contains('visible')) return;
		this._hide();
	}

	/**
	 * Public ID of the tooltip element, suitable for `aria-describedby` on
	 * the trigger parent. Auto-generated if the consumer did not set `id`.
	 */
	get tooltipId(): string {
		return this._tooltipEl?.id || '';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* M3 CSS anchor positioning (Baseline 2024, Chrome 125+, Edge 125+).
			   When the parent has a registered anchor-name and this tooltip
			   uses position-anchor, the browser positions the tooltip relative
			   to the trigger natively — no JS needed for placement.
			   Fallbacks to absolute positioning for older browsers. */
			.tooltip {
				position-anchor: var(--_anchor-name);
			}
			.tooltip.top,
			.tooltip.top-start,
			.tooltip.top-end {
				position-area: block-start;
			}
			.tooltip.bottom,
			.tooltip.bottom-start,
			.tooltip.bottom-end {
				position-area: block-end;
			}
			.tooltip.left {
				position-area: inline-start;
			}
			.tooltip.right {
				position-area: inline-end;
			}
			.tooltip.top-start,
			.tooltip.bottom-start {
				position-try-fallbacks: start;
			}
			.tooltip.top-end,
			.tooltip.bottom-end {
				position-try-fallbacks: end;
			}

			/* BeerCSS .tooltip — faithful port */
			.tooltip {
				--_space: -0.5rem;
				visibility: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
				background-color: var(--inverse-surface);
				color: var(--inverse-on-surface);
				font-size: 0.75rem;
				text-align: center;
				border-radius: 0.25rem;
				padding: 0.5rem;
				position: absolute;
				z-index: 200;
				/* BeerCSS default: top center */
				inset: 0 auto auto 50%;
				inline-size: auto;
				white-space: nowrap;
				font-weight: 500;
				opacity: 0;
				transition: all var(--speed2);
				line-height: normal;
				transform: translate(-50%, -100%) scale(0.9);
				margin-block-start: var(--_space);
				pointer-events: none;
				max-inline-size: 20rem;
			}

			/* M3 6 placements — derived from BeerCSS's 4 + start/end variants. */
			.tooltip.top,
			.tooltip.top-start,
			.tooltip.top-end {
				inset: 0 auto auto 50%;
				transform: translate(-50%, -100%) scale(0.9);
				margin-block-start: var(--_space);
			}
			.tooltip.top-start {
				inset-inline-start: 0;
				transform: translate(0, -100%) scale(0.9);
			}
			.tooltip.top-end {
				inset-inline-start: auto;
				inset-inline-end: 0;
				transform: translate(0, -100%) scale(0.9);
			}

			.tooltip.bottom,
			.tooltip.bottom-start,
			.tooltip.bottom-end {
				inset: auto auto 0 50%;
				transform: translate(-50%, 100%) scale(0.9);
				margin-block-end: var(--_space);
				margin-block-start: 0;
			}
			.tooltip.bottom-start {
				inset-inline-start: 0;
				transform: translate(0, 100%) scale(0.9);
			}
			.tooltip.bottom-end {
				inset-inline-start: auto;
				inset-inline-end: 0;
				transform: translate(0, 100%) scale(0.9);
			}

			/* Legacy positions (left/right) — preserved for backward compat. */
			.tooltip.left {
				inset: 50% auto auto 0;
				transform: translate(-100%, -50%) scale(0.9);
				margin-inline: var(--_space);
				margin-block-start: 0;
			}
			.tooltip.right {
				inset: 50% 0 auto auto;
				transform: translate(100%, -50%) scale(0.9);
				margin-inline: var(--_space);
				margin-block-start: 0;
			}

			/* Size variants */
			.tooltip.small  { inline-size: 8rem;  white-space: normal; }
			.tooltip.medium { inline-size: 12rem; white-space: normal; }
			.tooltip.large  { inline-size: 16rem; white-space: normal; }

			/* Rich content — allow flex column for stacked content. */
			:host([rich]) .tooltip {
				flex-direction: column;
				align-items: flex-start;
				white-space: normal;
				text-align: start;
				padding: 0.75rem;
			}
			:host([rich]) .tooltip ::slotted(*) {
				display: block;
			}

			/* Show state (triggered by JS class toggle) */
			.tooltip.visible {
				visibility: visible;
				opacity: 1;
			}
			.tooltip.visible.top,
			.tooltip.visible:not(.left, .right, .bottom, [class*='start'], [class*='end']) {
				transform: translate(-50%, -100%) scale(1);
			}
			.tooltip.visible.top-start { transform: translate(0, -100%) scale(1); }
			.tooltip.visible.top-end { transform: translate(0, -100%) scale(1); }
			.tooltip.visible.bottom { transform: translate(-50%, 100%) scale(1); }
			.tooltip.visible.bottom-start { transform: translate(0, 100%) scale(1); }
			.tooltip.visible.bottom-end { transform: translate(0, 100%) scale(1); }
			.tooltip.visible.left { transform: translate(-100%, -50%) scale(1); }
			.tooltip.visible.right { transform: translate(100%, -50%) scale(1); }
		`
	];

	override render() {
		const classes = [
			'tooltip',
			this.position,
			this.size
		].filter(Boolean).join(' ');
		return html`<div
			class=${classes}
			role="tooltip"
			id=${this.id || ''}
			part="tooltip"
			style=${this._anchorName ? `--_anchor-name: ${this._anchorName}` : ''}
		>
			<slot>${this.text}</slot>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tooltip': MoniTooltip;
	}
}

export default MoniTooltip;
