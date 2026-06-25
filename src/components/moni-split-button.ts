import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only split button. Combines a primary action button and a dropdown menu trigger.
 *
 * Attributes:
 *  - variant: filled (default) | tonal | outlined | elevated
 *  - size:    small | medium (default) | large | extra
 *  - gap:     custom gap space (e.g. "8px" or "1rem")
 *
 * Slots:
 *  - leading-button:  The main action button
 *  - trailing-button: The menu dropdown button
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
