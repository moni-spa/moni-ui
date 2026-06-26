/**
 * @file components/moni-app-bar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 App Bar component.
 *
 * App bars provide navigation and action controls at the top (or bottom) of a
 * screen. They are positioned sticky by default so they remain visible as the
 * user scrolls through content.
 *
 * **M3 spec reference:** `m3-docs/components/app-bars/specs.md`
 *
 * **Placement:**
 * - `top` (default) — 64dp header fixed above page content. Uses `position: sticky`
 *   with `inset-block-start: 0` so it stays at the top of the scroll container.
 * - `bottom` — Mobile navigation footer anchored to the bottom of the viewport.
 *   Ideal for housing primary navigation icons and an optional FAB.
 *
 * **Variants:**
 * - `standard` — Flat surface (no shadow) when content is at the top. Best for most UIs.
 * - `floating` — Always elevated with `--elevate2` shadow. Use when the bar visually
 *   floats above the content regardless of scroll position.
 *
 * **Sizes:**
 * - `default` — 64dp (4rem) tall. Standard for most use cases.
 * - `prominent` — 152dp (9.5rem) tall. Use when a subtitle or expanded area is needed.
 *   The `subtitle` attribute is only rendered in this size.
 *
 * @example
 * ```html
 * <!-- Top app bar with navigation icon and action buttons -->
 * <moni-app-bar title="Settings">
 *   <moni-button slot="leading" shape="circle" variant="text" icon="menu"></moni-button>
 *   <moni-button slot="trailing" shape="circle" variant="text" icon="search"></moni-button>
 *   <moni-button slot="trailing" shape="circle" variant="text" icon="more_vert"></moni-button>
 * </moni-app-bar>
 * ```
 *
 * @example
 * ```html
 * <!-- Prominent app bar with subtitle -->
 * <moni-app-bar size="prominent" title="Inbox" subtitle="12 unread messages" elevated>
 * </moni-app-bar>
 * ```
 *
 * @slot leading   - Navigation icon(s) placed on the leading (start) edge.
 * @slot trailing  - Action icon(s) placed on the trailing (end) edge.
 * @slot fab       - FAB anchored to the trailing edge (bottom placement only).
 * @slot default   - Additional content (e.g. a tab bar below the title row).
 *
 * @csspart bar      - The inner grid container.
 * @csspart leading  - The leading slot wrapper.
 * @csspart trailing - The trailing slot wrapper.
 * @csspart title    - The title text element.
 * @csspart subtitle - The subtitle text element (prominent size only).
 * @csspart actions  - The actions slot wrapper (prominent size only).
 */
@customElement('moni-app-bar')
export class MoniAppBar extends MoniElement {
	/**
	 * Determines whether the bar is placed at the top or bottom of the viewport.
	 *
	 * - `'top'` (default) — Sticky header at the top of the scroll container.
	 * - `'bottom'` — Fixed footer; primarily used for mobile bottom navigation patterns.
	 *
	 * @default 'top'
	 */
	@property({ reflect: true })
	placement: 'top' | 'bottom' = 'top';

	/**
	 * Visual variant of the app bar.
	 *
	 * - `'standard'` (default) — Flat surface. No shadow at rest; gains shadow
	 *   programmatically via the `elevated` attribute when content scrolls beneath it.
	 * - `'floating'` — Permanently elevated with `--elevate2` box-shadow.
	 *
	 * @default 'standard'
	 */
	@property({ reflect: true })
	variant: 'standard' | 'floating' = 'standard';

	/**
	 * Height variant of the app bar.
	 *
	 * - `'default'` — 64dp (4rem). Standard M3 top app bar height.
	 * - `'prominent'` — 152dp (9.5rem). Use when showing a subtitle or when
	 *   extra vertical space is needed for a contextual action row.
	 *
	 * @default 'default'
	 */
	@property({ reflect: true })
	size: 'default' | 'prominent' = 'default';

	/**
	 * Title text displayed in the center of the app bar.
	 *
	 * The title is center-aligned per M3 spec. Long titles are truncated with
	 * an ellipsis. For semantic HTML, the consumer should also provide an `<h1>`
	 * in the page content that matches this title.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/**
	 * Optional subtitle displayed below the title.
	 *
	 * Only rendered when `size="prominent"`. Provides secondary context
	 * (e.g. folder name, item count, description).
	 *
	 * @default ''
	 */
	@property({ reflect: true }) subtitle = '';

	/**
	 * When present, applies `--elevate2` box-shadow to signal that content has
	 * scrolled beneath the bar.
	 *
	 * Consumers are responsible for toggling this attribute reactively based on
	 * the scroll position of the main content area:
	 * ```ts
	 * container.addEventListener('scroll', () => {
	 *   appBar.elevated = container.scrollTop > 0;
	 * });
	 * ```
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) elevated = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				background-color: var(--surface);
				color: var(--on-surface);
				position: sticky;
				inset-block-start: 0;
				z-index: 30;
				transition:
					box-shadow var(--speed2),
					block-size var(--speed2);
			}

			:host([placement='bottom']) {
				inset-block-start: auto;
				inset-block-end: 0;
			}

			:host([variant='floating']),
			:host([elevated]) {
				box-shadow: var(--elevate2);
			}

			.bar {
				display: grid;
				grid-template-columns: auto 1fr auto;
				grid-template-rows: auto auto;
				align-items: center;
				column-gap: 0.5rem;
				padding-inline: 1rem;
				block-size: 4rem;
				min-block-size: 4rem;
			}

			:host([size='prominent']) .bar {
				block-size: 9.5rem;
				min-block-size: 9.5rem;
				grid-template-rows: auto auto auto;
			}

			.leading,
			.trailing {
				display: flex;
				gap: 0.25rem;
				align-items: center;
				justify-content: center;
				min-inline-size: 3rem;
				block-size: 3rem;
			}
			.leading { justify-content: flex-start; }
			.trailing { justify-content: flex-end; }

			.title {
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
				text-align: center;
				color: var(--on-surface);
				grid-column: 2;
				grid-row: 1;
				padding: 0 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			:host([size='prominent']) .title {
				grid-row: 2;
				align-self: end;
				font-size: 1.375rem;
			}

			.subtitle {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.007em;
				text-align: center;
				color: var(--on-surface-variant);
				grid-column: 2;
				grid-row: 3;
				padding: 0 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.actions {
				grid-column: 1 / -1;
				grid-row: 3;
				display: flex;
				gap: 0.5rem;
				padding-block-start: 0.5rem;
			}

			::slotted([slot='fab']) {
				position: absolute;
				inset-block-end: 1rem;
				inset-inline-end: 1rem;
			}
		`
	];

	/**
	 * Renders the app bar grid layout.
	 *
	 * The inner `.bar` element uses a 3-column CSS grid:
	 * - Column 1: leading slot (navigation icon).
	 * - Column 2: title (center-aligned, fills remaining space).
	 * - Column 3: trailing slot (action icons).
	 *
	 * In `prominent` size, a subtitle row and an actions row are appended
	 * conditionally. The subtitle only renders when the `subtitle` attribute
	 * is non-empty; the actions slot always renders for prominent bars.
	 */
	override render() {
		const hasSubtitle = this.size === 'prominent' && Boolean(this.subtitle);
		const hasActions = Boolean(this.size === 'prominent');
		return html`
			<div class="bar" part="bar">
				<div class="leading" part="leading">
					<slot name="leading"></slot>
				</div>
				<div class="title" part="title">${this.title}</div>
				<div class="trailing" part="trailing">
					<slot name="trailing"></slot>
				</div>
				${hasSubtitle
					? html`<div class="subtitle" part="subtitle">${this.subtitle}</div>`
					: nothing}
				${hasActions
					? html`<div class="actions" part="actions">
							<slot name="actions"></slot>
						</div>`
					: nothing}
				<slot name="fab"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-app-bar': MoniAppBar;
	}
}

export default MoniAppBar;