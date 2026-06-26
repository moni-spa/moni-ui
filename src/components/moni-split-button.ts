/**
 * @file components/moni-split-button.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Split Button component.
 *
 * A split button combines a primary action button with a secondary dropdown
 * button. The two buttons sit flush against each other, typically sharing
 * a background color and elevation, but separated by a distinct border.
 *
 * **Visual architecture:**
 * The component acts as a layout container (`display: inline-flex`) that
 * groups two standard buttons. It overrides the margins of the trailing
 * button to create the "connected" look (similar to connected button groups).
 *
 * **Usage:**
 * Consumers must provide exactly two buttons via the named slots:
 * - `slot="leading-button"` — The primary action (usually text or text+icon).
 * - `slot="trailing-button"` — The secondary action (usually just a dropdown icon).
 *
 * Both buttons should be standard `<moni-button>` or `<moni-icon-button>`
 * elements configured with matching variants for a cohesive appearance.
 *
 * @example
 * ```html
 * <moni-split-button variant="filled">
 *   <moni-button slot="leading-button" icon="send">Send</moni-button>
 *   <moni-button slot="trailing-button" icon="arrow_drop_down" id="schedule-trigger"></moni-button>
 * </moni-split-button>
 *
 * <moni-menu id="schedule-menu" placement="bottom">
 *   <moni-menu-item>Schedule send...</moni-menu-item>
 * </moni-menu>
 * ```
 *
 * @slot leading-button  - The primary action button on the left.
 * @slot trailing-button - The secondary action (dropdown trigger) on the right.
 */
@customElement('moni-split-button')
export class MoniSplitButton extends MoniElement {
	@property({ reflect: true })
	variant: 'filled' | 'tonal' | 'outlined' | 'elevated' = 'filled';

	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	@property()
	gap = '';

	@queryAssignedElements({ slot: 'leading-button', flatten: true })
	private leadingElements!: HTMLElement[];

	@queryAssignedElements({ slot: 'trailing-button', flatten: true })
	private trailingElements!: HTMLElement[];

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.wrapper {
				display: inline-flex;
				align-items: center;
				gap: 0;
				width: 100%;
			}

			::slotted(*:not(:first-child)) {
				margin-inline-start: var(--moni-button-group-connected-gap, -0.0625rem);
			}
		`
	];

	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('variant') || changedProperties.has('size') || changedProperties.has('gap')) {
			this.updateChildren();
		}
	}

	private handleSlotChange() {
		this.updateChildren();
	}

	private getGapValue(gap: string): string {
		if (!gap) return '';
		const preset = gap.toLowerCase();
		if (preset === 'xs' || preset === 'xsmall') return '1.125rem';
		if (preset === 's' || preset === 'small') return '0.75rem';
		if (preset === 'm' || preset === 'medium') return '0.5rem';
		if (preset === 'l' || preset === 'large') return '0.5rem';
		if (preset === 'xl' || preset === 'xlarge') return '0.5rem';
		return gap;
	}

	private updateChildren() {
		const leading = this.leadingElements.find(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		const trailing = this.trailingElements.find(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		const hasGap = !!this.gap;

		if (leading) {
			leading.setAttribute('shape', hasGap ? 'left-round' : 'left-round-flat');
			leading.setAttribute('size', this.size);
			leading.setAttribute('variant', this.variant);
		}

		if (trailing) {
			trailing.setAttribute('shape', hasGap ? 'right-round' : 'right-round-flat');
			trailing.setAttribute('size', this.size);
			trailing.setAttribute('variant', this.variant);
		}
	}

	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-group-connected-gap: 0px;`
			: '';
		return html`
			<div class="wrapper" style=${inlineStyles} part="wrapper">
				<slot name="leading-button" @slotchange=${this.handleSlotChange}></slot>
				<slot name="trailing-button" @slotchange=${this.handleSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-split-button': MoniSplitButton;
	}
}

export default MoniSplitButton;
