import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 Card (`m3-docs/components/cards/specs.md`).
 *
 * Cards display content and actions on a single subject. Three variants:
 *  - **elevated**: surface-container-low background + elevation 1 shadow.
 *    Default for collections where the card needs separation from a
 *    patterned background.
 *  - **filled**: surface-container-highest background, no shadow.
 *    Lowest emphasis; use when cards sit directly on the background.
 *  - **outlined**: surface background + outline-variant 1dp stroke.
 *    Highest emphasis without shadow; good on solid color backgrounds.
 *
 * M3 measurements:
 *  - Container corner radius: **12dp**.
 *  - Left/right padding: **16dp**.
 *  - Padding between cards in a collection: max **8dp**.
 *  - Headline text alignment: **start**.
 *
 * Slots:
 *  - media:        image or video at the top of the card.
 *  - default:      primary content (headline, subhead, supporting text).
 *  - headline:     shortcut for the H3-equivalent title (semantic).
 *  - subhead:      secondary title slot.
 *  - supporting:   supporting text slot.
 *  - actions:      action buttons row at the bottom of the card.
 *
 * Attributes:
 *  - variant: elevated (default) | filled | outlined
 *  - clickable: present → apply hover/focus/pressed state layers
 *  - draggable:  present → apply dragged state elevation (3)
 *  - disabled:   present → reduced opacity + cursor not-allowed
 */
@customElement('moni-card')
export class MoniCard extends MoniElement {
	@property({ reflect: true })
	variant: 'elevated' | 'filled' | 'outlined' = 'elevated';
	@property({ type: Boolean, reflect: true }) clickable = false;
	@property({ type: Boolean, reflect: true }) draggable = false;
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