/**
 * @file components/moni-divider.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Divider component.
 *
 * A thin horizontal (or vertical) rule used to visually separate content
 * sections within lists, layouts, and cards.
 *
 * **M3 spec reference:** `m3-docs/components/divider/specs.md`
 *
 * **M3 measurements:**
 * - Thickness: 1dp (`0.0625rem`).
 * - Color: `outline-variant` — subtle on all surface backgrounds.
 * - Inset variants align the line with list content:
 *   - `leading` — 16dp margin from the leading edge (aligns with icon text).
 *   - `middle`  — 16dp margin on both edges.
 *   - `none`    — full-bleed (no margin).
 *
 * **Vertical usage:**
 * While not yet exposed as an attribute, the `[vertical]` CSS attribute selector
 * is supported. Set `vertical` as an HTML attribute to render a 1dp-wide
 * vertical divider that stretches to match its flex container's cross-axis.
 *
 * @example
 * ```html
 * <!-- Full-bleed divider between sections -->
 * <moni-divider inset="none"></moni-divider>
 *
 * <!-- Leading-inset divider in a list (aligns with list item text) -->
 * <moni-divider></moni-divider>
 *
 * <!-- Vertical divider inside a flex container -->
 * <div style="display:flex; height: 3rem; align-items:center; gap: 1rem;">
 *   <span>Section A</span>
 *   <moni-divider vertical></moni-divider>
 *   <span>Section B</span>
 * </div>
 * ```
 */
@customElement('moni-divider')
export class MoniDivider extends MoniElement {
	/**
	 * Controls the horizontal margin on the divider line.
	 *
	 * - `'leading'` (default) — 16dp margin from the leading (start) edge only.
	 *   Use in lists to align the divider with the primary text of list items.
	 * - `'middle'`  — 16dp margin on both the leading and trailing edges.
	 *   Use to separate sections where full-bleed would be too visually heavy.
	 * - `'none'`    — No margin; the line spans the full parent width.
	 *   Use as a section separator or between cards.
	 *
	 * @default 'leading'
	 */
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