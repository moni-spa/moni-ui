/**
 * @file components/moni-card.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Card component.
 *
 * Cards display content and actions about a single subject. They are
 * container surfaces that group related information together, making it
 * easy for users to scan and interact with collections of related data.
 *
 * **M3 spec reference:** `m3-docs/components/cards/specs.md`
 *
 * **Variants:**
 * - `elevated` (default) — `surface-container-low` background + `--elevate1` shadow.
 *   Best for collections where the card needs visual separation from a
 *   patterned or colored background. Gains shadow on hover/drag.
 * - `filled` — `surface-container-highest` background, no shadow.
 *   Lowest emphasis; use when cards sit directly on the main background surface.
 * - `outlined` — `surface` background + 1dp `outline-variant` stroke.
 *   Highest structural emphasis without casting a shadow. Best on solid backgrounds.
 *
 * **M3 measurements:**
 * - Container corner radius: 12dp.
 * - Horizontal content padding: 16dp.
 * - Gap between cards in a collection: max 8dp.
 * - Headline text alignment: start.
 *
 * **Interactive cards:**
 * When `clickable=true`, the card renders M3 state layer overlays on hover,
 * focus, and press via the `::before` pseudo-element. The consumer must handle
 * the `click` event to implement navigation or selection logic.
 *
 * @example
 * ```html
 * <moni-card variant="outlined" clickable>
 *   <img slot="media" src="photo.jpg" alt="Card image" />
 *   <h3 slot="headline">Card Title</h3>
 *   <p slot="supporting">Supporting text that describes the card topic.</p>
 *   <div slot="actions">
 *     <moni-button variant="text">Cancel</moni-button>
 *     <moni-button>Confirm</moni-button>
 *   </div>
 * </moni-card>
 * ```
 *
 * @slot media      - An image, video, or icon at the top of the card.
 * @slot default    - Primary body content (replaces all named slots if used).
 * @slot headline   - H3-equivalent title text.
 * @slot subhead    - Secondary title below the headline.
 * @slot supporting - Descriptive supporting body text.
 * @slot actions    - Action buttons row at the bottom of the card.
 *
 * @csspart card    - The outer card container.
 * @csspart media   - The media area wrapper.
 * @csspart content - The content wrapper.
 * @csspart actions - The actions row wrapper.
 */
@customElement('moni-card')
export class MoniCard extends MoniElement {
	/**
	 * Visual variant of the card.
	 *
	 * - `'elevated'` (default) — Surface-low background + elevation shadow.
	 * - `'filled'` — Surface-highest background, no shadow.
	 * - `'outlined'` — Surface background + outline-variant stroke.
	 *
	 * @default 'elevated'
	 */
	@property({ reflect: true })
	variant: 'elevated' | 'filled' | 'outlined' = 'elevated';

	/**
	 * When `true`, applies M3 state layer overlays (hover, focus, pressed)
	 * to communicate interactivity. The card background shifts slightly on hover.
	 *
	 * Use when the card itself is a clickable navigation or selection target.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) clickable = false;

	/**
	 * When `true`, applies `--elevate3` box-shadow to simulate the M3 "dragged"
	 * state as specified in the M3 card interaction spec.
	 *
	 * Consumers should toggle this attribute based on the drag state of the card
	 * (e.g. via a drag-and-drop library callback).
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) draggable = false;

	/**
	 * When `true`, the card renders at 50% opacity with `cursor: not-allowed`,
	 * signaling that the card and its actions are unavailable.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				/* M3 spec: 12dp corner, 16dp padding, 8dp max between cards. */
				border-radius: 0.75rem;
				color: var(--on-surface);
				position: relative;
				overflow: hidden;
				transition:
					box-shadow var(--speed2),
					background-color var(--speed2),
					border-color var(--speed2);
			}

			/* Elevated variant: surface-container-low + elevation 1. */
			:host([variant='elevated']) {
				background-color: var(--surface-container-low);
				box-shadow: var(--elevate1);
			}

			/* Filled variant: surface-container-highest, no shadow. */
			:host([variant='filled']) {
				background-color: var(--surface-container-highest);
			}

			/* Outlined variant: surface + outline-variant 1dp. */
			:host([variant='outlined']) {
				background-color: var(--surface);
				border: 0.0625rem solid var(--outline-variant);
			}

			/* Clickable cards expose hover/focus/pressed state layers. */
			:host([clickable]) {
				cursor: pointer;
			}
			:host([clickable]:hover) {
				box-shadow: var(--elevate2);
			}
			:host([clickable]:focus-visible) {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
			}
			:host([clickable]:active) {
				box-shadow: var(--elevate1);
			}

			/* Draggable cards show elevation 3 when picked up. */
			:host([draggable]) {
				cursor: grab;
			}
			:host([draggable]:active) {
				cursor: grabbing;
				box-shadow: var(--elevate3);
			}

			/* Disabled state. */
			:host([disabled]) {
				opacity: 0.38;
				pointer-events: none;
				cursor: not-allowed;
			}

			/* ─── Card slots layout ─── */
			.media {
				display: block;
				margin-block-end: 1rem;
			}
			.media[hidden] {
				display: none;
			}

			.body {
				padding: 0 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.headline {
				font-size: 1.25rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
				color: var(--on-surface);
				margin: 0;
				padding: 0;
			}
			.subhead {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.007em;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
			}
			.supporting {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.014em;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
			}

			.actions {
				display: flex;
				gap: 0.5rem;
				padding: 0.75rem 1rem 1rem;
			}
			.actions[hidden] {
				display: none;
			}

			/* Ensure slotted headings inherit our typography reset
			   (margin/padding/font-size) so consumers can use semantic
			   h1..h6 without breaking the visual rhythm. */
			::slotted(:is(h1, h2, h3, h4, h5, h6)) {
				margin: 0;
				padding: 0;
				font-size: inherit;
				font-weight: inherit;
				line-height: inherit;
				letter-spacing: inherit;
				color: inherit;
			}
		`
	];

	override render() {
		return html`
			<div class="media" part="media">
				<slot name="media"></slot>
			</div>
			<div class="body" part="body">
				<slot name="headline">
					<slot></slot>
				</slot>
				<slot name="subhead"></slot>
				<slot name="supporting"></slot>
			</div>
			<div class="actions" part="actions">
				<slot name="actions"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-card': MoniCard;
	}
}

export default MoniCard;