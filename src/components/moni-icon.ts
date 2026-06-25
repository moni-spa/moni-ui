import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only icon.
 *
 * Renders a Material Symbols glyph by name. The font must be loaded
 * globally in the host document (see `@moni-spa/moni-ui/styles`).
 *
 * Attributes:
 *  - name:   icon name from https://fonts.google.com/icons
 *  - size:   tiny | small | medium (default) | large | extra
 *  - filled: present → switches to the filled variant (font-variation-settings)
 *
 * Slots:
 *  - default: fallback text if no name is given
 *  - (also accepts slotted <svg> or <img> as override)
 */
@customElement('moni-icon')
export class MoniIcon extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true })
	size: 'tiny' | 'small' | 'medium' | 'large' | 'extra' = 'medium';
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
