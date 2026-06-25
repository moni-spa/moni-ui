import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 App Bar (`m3-docs/components/app-bars/specs.md`).
 *
 * App bars are placed at the top of a screen to help users navigate.
 * Two main placements:
 *  - **top** (default): header above content. Standard height **64dp**.
 *  - **bottom**: footer below content (mobile pattern). Houses navigation
 *    icons and an optional FAB anchor.
 *
 * Two variants:
 *  - **standard** (default): flat surface with no shadow at rest.
 *  - **floating**: gains an elevation 2 shadow when content scrolls under it.
 *
 * Two size modes:
 *  - **default**: 64dp tall.
 *  - **prominent**: 152dp tall, used when a subtitle is shown.
 *
 * Center-aligned title (M3 spec): title is centered horizontally.
 * Navigation icons go to the leading edge; actions to the trailing edge.
 *
 * Attributes:
 *  - placement:  top (default) | bottom
 *  - variant:   standard (default) | floating
 *  - size:      default (default, 64dp) | prominent (152dp)
 *  - title:     text content of the title (centered)
 *  - subtitle:  optional subtitle shown below the title (prominent only)
 *  - elevated:  present → adds elevation 2 shadow (e.g. when scrolled)
 *
 * Slots:
 *  - leading:  navigation icon(s) on the leading edge
 *  - trailing: action icon(s) on the trailing edge
 *  - fab:      (bottom only) FAB anchored to the trailing edge
 *  - default:  any extra content (e.g. tabs)
 */
@customElement('moni-app-bar')
export class MoniAppBar extends MoniElement {
	@property({ reflect: true })
	placement: 'top' | 'bottom' = 'top';
	@property({ reflect: true })
	variant: 'standard' | 'floating' = 'standard';
	@property({ reflect: true })
	size: 'default' | 'prominent' = 'default';
	@property({ reflect: true }) title = '';
	@property({ reflect: true }) subtitle = '';
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