import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 Divider (`m3-docs/components/divider/specs.md`).
 *
 * A thin line used to group content in lists, layouts, or cards. M3 spec
 * defines three inset variants:
 *  - **full** (default): spans the full width of the parent.
 *  - **inset**: indented from the leading edge (16dp) so it lines up
 *    with text content below an icon.
 *  - **middle**: indented from both edges (16dp each).
 *
 * M3 measurements:
 *  - Thickness: 1dp (`0.0625rem`).
 *  - Color: `outline-variant` (subtle on a light background).
 *
 * Attributes:
 *  - inset:  leading (default) | middle | none
 *
 * Slots:
 *  - default: optional content rendered inline with the divider line.
 */
@customElement('moni-divider')
export class MoniDivider extends MoniElement {
	@property({ reflect: true })
	inset: 'leading' | 'middle' | 'none' = 'leading';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				/* M3 spec: 1dp thick, on-surface-variant for subtle separation. */
				block-size: 0.0625rem;
				min-inline-size: 0;
				background-color: var(--outline-variant);
				border: 0;
				margin: 0;
			}

			/* Inset variants. M3 spec: 16dp from the leading edge. */
			:host([inset='leading']) {
				margin-inline-start: 1rem;
				margin-inline-end: 0;
			}
			:host([inset='middle']) {
				margin-inline: 1rem;
			}
			:host([inset='none']) {
				margin-inline: 0;
			}

			/* Vertical divider (M3 spec also defines vertical usage). */
			:host([vertical]) {
				inline-size: 0.0625rem;
				block-size: auto;
				min-block-size: 100%;
				align-self: stretch;
			}
		`
	];

	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-divider': MoniDivider;
	}
}

export default MoniDivider;