/**
 * @file components/moni-badge.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Badge component.
 *
 * Badges are small status descriptors anchored to a parent element, used to
 * convey supplementary information such as a notification count, online
 * status, or selection indicator.
 *
 * **Positioning contract:**
 * The badge uses `position: absolute` and anchors to the parent element.
 * On `connectedCallback`, if the parent's computed `position` is `'static'`,
 * the badge automatically sets `parent.style.position = 'relative'`.
 * Consumers do not need to manually add `position: relative` to the parent.
 *
 * **Rendering model:**
 * The `:host` displays as `contents`, making it transparent to layout.
 * Only the inner `.badge` span is visually rendered. This allows the badge
 * to be dropped inside any element without affecting its layout flow.
 *
 * @example
 * ```html
 * <!-- Notification badge on a button -->
 * <div style="position: relative; display: inline-flex;">
 *   <moni-button icon="notifications" variant="text"></moni-button>
 *   <moni-badge value="5"></moni-badge>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- Inline dot badge for status -->
 * <moni-badge shape="min" color="primary" inline></moni-badge>
 * Online
 * ```
 *
 * @csspart badge - The badge `<span>` element. Override `background-color`,
 *                  `color`, or `border-radius` to customize appearance.
 */
@customElement('moni-badge')
export class MoniBadge extends MoniElement {
	/**
	 * Text content of the badge label.
	 *
	 * Also accepts slotted content — the default slot inside the badge span
	 * falls back to this value when no children are slotted.
	 * Use an empty string with `shape="min"` to render a dot-only badge.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/**
	 * Anchor position relative to the parent element's edges.
	 *
	 * Uses `inset: 50% auto auto 50%` as the base and adjusts translation:
	 * - `''` (default) — top-right corner (translate: 0, -100%).
	 * - `'top'`    — same as default, explicit alias.
	 * - `'bottom'` — bottom-right corner (translate: 0, 0).
	 * - `'left'`   — top-left corner (translate: -100%, -100%).
	 * - `'right'`  — top-right corner (translate: 0, -100%).
	 * - `'none'`   — disables absolute positioning; see also the `inline` attribute.
	 *
	 * @default ''
	 */
	@property({ reflect: true })
	position: 'top' | 'bottom' | 'left' | 'right' | 'none' | '' = '';

	/**
	 * Shape of the badge container.
	 *
	 * - `''` (default) — Rounded pill shape (border-radius: 1rem).
	 * - `'circle'`     — Alias for pill; the badge is always circular when the
	 *                    content is a single character or absent.
	 * - `'square'`     — No border-radius (angular badge).
	 * - `'min'`        — Dot only; content is hidden via `display: none` and the
	 *                    shape is clipped to a small circle via `clip-path`.
	 *
	 * @default ''
	 */
	@property({ reflect: true })
	shape: 'circle' | 'square' | 'min' | '' = '';

	/**
	 * Semantic color role of the badge.
	 *
	 * Maps to the M3 color palette roles:
	 * - `'error'` (default) — Red; standard for notification counts and alerts.
	 * - `'primary'`         — Brand primary color; for selection or active states.
	 * - `'secondary'`       — Secondary accent; for supplementary indicators.
	 * - `'tertiary'`        — Tertiary accent; for decorative or informational badges.
	 *
	 * @default 'error'
	 */
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'error' = 'error';

	/**
	 * When `true`, the badge renders inline (resets `position: absolute` to
	 * `position: relative`) rather than anchoring to the parent.
	 *
	 * Equivalent to BeerCSS's `.badge.none` class. Use for inline status
	 * indicators that flow within text or flex containers.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) inline = false;

	/**
	 * When present, renders the badge with an outlined style:
	 * - Background becomes `--surface` (same as the page background).
	 * - Border and text color use the palette color token (e.g. `--error`).
	 *
	 * Equivalent to BeerCSS's `.badge.border` class.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) border = false;

	/**
	 * Ensures the parent element can contain the absolutely-positioned badge.
	 *
	 * Reads the parent's computed `position` via `getComputedStyle`. If it is
	 * `'static'` (the browser default), sets `parent.style.position = 'relative'`
	 * so the badge anchors correctly. This is a convenience that avoids requiring
	 * consumers to remember to add `position: relative` to the parent themselves.
	 */
	override connectedCallback() {
		super.connectedCallback();
		// Ensure the badge's absolutely-positioned anchor point is correct.
		const parent = this.parentElement;
		if (parent) {
			const computed = getComputedStyle(parent);
			if (computed.position === 'static') {
				parent.style.position = 'relative';
			}
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* BeerCSS .badge */
			.badge {
				--_x: 0;
				--_y: -100%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				font-size: 0.6875rem;
				z-index: 2;
				padding: 0 0.25rem;
				min-block-size: 1rem;
				min-inline-size: 1rem;
				background-color: var(--error);
				color: var(--on-error);
				line-height: normal;
				border-radius: 1rem;
				/* BeerCSS: inset:50% auto auto 50% + translate */
				inset: 50% auto auto 50%;
				transform: translate(var(--_x, 0), var(--_y, -100%));
				font-family: var(--font);
				box-sizing: border-box;
			}

			/* Position variants — BeerCSS */
			.badge.top    { --_y: -100%; }
			.badge.bottom { --_y: 0; }
			.badge.left   { --_x: -100%; }
			.badge.right  { --_x: 0; }

			/* BeerCSS .badge.none = inline positioning */
			.badge.none {
				inset: auto !important;
				transform: none;
				position: relative;
				margin: 0 0.125rem;
			}

			/* Color variants */
			:host([color='primary'])   .badge { background-color: var(--primary);   color: var(--on-primary); }
			:host([color='secondary']) .badge { background-color: var(--secondary); color: var(--on-secondary); }
			:host([color='tertiary'])  .badge { background-color: var(--tertiary);  color: var(--on-tertiary); }
			:host([color='error'])     .badge { background-color: var(--error);     color: var(--on-error); }

			/* BeerCSS .badge.border */
			:host([border]) .badge {
				border-color: var(--error);
				color: var(--error);
				background-color: var(--surface);
			}
			:host([border][color='primary'])   .badge { border-color: var(--primary);   color: var(--primary); }
			:host([border][color='secondary']) .badge { border-color: var(--secondary); color: var(--secondary); }
			:host([border][color='tertiary'])  .badge { border-color: var(--tertiary);  color: var(--tertiary); }

			/* Shape variants */
			.badge.square { border-radius: 0; }

			/* BeerCSS .badge.min — dot only, content hidden */
			.badge.min > * { display: none; }
			.badge.min { clip-path: circle(18.75% at 50% 50%); }
		`
	];

	/**
	 * Renders the badge span with the computed class list.
	 *
	 * Class composition:
	 * - `'badge'`       — always present (base styles).
	 * - `this.position` — position variant class (e.g. `'bottom'`, `'left'`).
	 * - `this.shape`    — shape variant class (e.g. `'min'`, `'square'`).
	 * - `'none'`        — added when `inline=true` to reset absolute positioning.
	 *
	 * Falsy values are filtered out so no extra spaces appear in the class string.
	 * The default slot falls back to the `value` attribute text node.
	 */
	override render() {
		const classes = [
			'badge',
			this.position || '',
			this.shape || '',
			this.inline ? 'none' : ''
		].filter(Boolean).join(' ');

		return html`<span class=${classes} part="badge">
			<slot>${this.value}</slot>
		</span>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-badge': MoniBadge;
	}
}

export default MoniBadge;
