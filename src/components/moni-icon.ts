/**
 * @file components/moni-icon.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only icon component using Material Symbols variable font.
 *
 * Renders a Material Symbols glyph by its ligature name. The icon font
 * must be loaded globally by the host document — it is not bundled with
 * the component. Add the font via the `@moni-labs/moni-ui/styles` stylesheet
 * or by including the Google Fonts CDN link.
 *
 * **Font rendering:**
 * The icon uses `font-family: var(--font-icon)` which defaults to
 * `'Material Symbols Rounded'`. Override `--font-icon-override` in the
 * host document's `:root` to switch to a different icon set variant
 * (e.g. `'Material Symbols Outlined'` or `'Material Symbols Sharp'`).
 *
 * **Variable font settings:**
 * The default `font-variation-settings` is `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`.
 * Setting the `filled` attribute switches to `'FILL' 1` for the solid icon variant.
 *
 * **Color inheritance:**
 * The icon always inherits color from its parent via `color: inherit`, making it
 * automatically adapt to button variants, chip selected states, list item active
 * states, and other color-context containers.
 *
 * @example
 * ```html
 * <!-- Basic icon -->
 * <moni-icon name="home"></moni-icon>
 *
 * <!-- Filled large icon -->
 * <moni-icon name="favorite" size="large" filled></moni-icon>
 *
 * <!-- Custom SVG override via slot -->
 * <moni-icon>
 *   <svg slot="default" viewBox="0 0 24 24">...</svg>
 * </moni-icon>
 * ```
 *
 * @slot default - Fallback content when `name` is empty. Accepts `<svg>` or `<img>`
 *                 elements which are sized to 100% of the icon box.
 *
 * @cssproperty --font-icon-override - Overrides the icon font family at the
 *                                     document level. Set on `:root`.
 */
@customElement('moni-icon')
export class MoniIcon extends MoniElement {
	/**
	 * Material Symbols ligature name for the icon to render.
	 *
	 * Use the name exactly as shown on https://fonts.google.com/icons
	 * (e.g. `'home'`, `'settings'`, `'arrow_forward'`).
	 * When empty, the default slot is rendered instead.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Size of the icon bounding box.
	 *
	 * Maps to the `--_size` custom property:
	 * | Value      | Size     |
	 * |------------|----------|
	 * | `'tiny'`   | 1rem     |
	 * | `'small'`  | 1.25rem  |
	 * | `'medium'` | 1.5rem   |
	 * | `'large'`  | 1.75rem  |
	 * | `'extra'`  | 2rem     |
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'tiny' | 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * When `true`, switches to the filled variant of the icon by setting
	 * `font-variation-settings: 'FILL' 1`.
	 *
	 * This works only with variable icon fonts that include the `FILL` axis
	 * (all Material Symbols variants do). It has no effect if a different
	 * icon font is loaded that does not support `FILL`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) filled = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				--_size: 1.5rem;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				vertical-align: middle;
				font-family: var(--font-icon);
				font-weight: normal;
				font-style: normal;
				font-size: var(--_size);
				letter-spacing: normal;
				text-transform: none;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				font-feature-settings: 'liga';
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				-webkit-font-smoothing: antialiased;
				line-height: 1;
				inline-size: var(--_size);
				block-size: var(--_size);
				/* Explicit inherit so the icon glyph picks up color from
				   whatever consumer wraps it (button variants, chip selected
				   state, list-item active, etc.). */
				color: inherit;
			}

			:host([size='tiny']) {
				--_size: 1rem;
			}
			:host([size='small']) {
				--_size: 1.25rem;
			}
			:host([size='medium']) {
				--_size: 1.5rem;
			}
			:host([size='large']) {
				--_size: 1.75rem;
			}
			:host([size='extra']) {
				--_size: 2rem;
			}

			:host([filled]) {
				font-variation-settings: 'FILL' 1;
			}

			::slotted(svg),
			::slotted(img) {
				inline-size: 100%;
				block-size: 100%;
				object-fit: contain;
			}
		`
	];

	override render() {
		return html`<slot>${this.name}</slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-icon': MoniIcon;
	}
}

export default MoniIcon;
