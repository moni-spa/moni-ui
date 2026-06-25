import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { MoniButtonSegment } from './moni-button-segment.js';

/**
 * A form-associated group of selectable segmented buttons.
 *
 * @deprecated since v0.3.0 — `moni-segmented-button` is **no longer
 * recommended** by Material Design 3 Expressive. Use
 * `moni-button-group[variant="connected"]` instead, which has the same
 * functionality with an updated visual design. See
 * `m3-docs/components/segmented-buttons/overview.md` § M3 Expressive update.
 *
 * This component continues to work for backward compatibility but will be
 * removed in v1.0. A deprecation warning is logged to the console when the
 * element is connected to the DOM.
 *
 * Attributes:
 *  - name:       Name of the control in forms
 *  - multi:      Whether multiple options can be selected
 *  - hide-check: Hides checkmarks on all child segments
 *  - gap:        Custom gap space (e.g. "8px" or "1rem")
 */
@customElement('moni-segmented-button')
export class MoniSegmentedButton extends MoniElement {
	static formAssociated = true;

	private static _deprecationWarned = false;

	@property({ reflect: true })
	name = '';

	@property({ type: Boolean, reflect: true })
	multi = false;

	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	@property({ type: Boolean, reflect: true, attribute: 'hide-check' })
	hideCheck = false;

	@property()
	gap = '';

	@queryAssignedElements({ flatten: true })
	private slottedSegments!: HTMLElement[];

	private internals: ElementInternals;

	constructor() {
		super();
		this.internals = this.attachInternals();
	}

	override connectedCallback(): void {
		super.connectedCallback();
		// Log a deprecation warning once per page to avoid console spam when
		// many segmented buttons are instantiated.
		if (!MoniSegmentedButton._deprecationWarned) {
			MoniSegmentedButton._deprecationWarned = true;
			console.warn(
				'[moni-ui] <moni-segmented-button> is deprecated since v0.3.0. ' +
					'Material Design 3 Expressive no longer recommends segmented buttons. ' +
					'Use <moni-button-group variant="connected"> instead. ' +
					'See m3-docs/components/segmented-buttons/overview.md § M3 Expressive update.'
			);
		}
	}

	get form() {
		return this.internals.form;
	}

	get type() {
		return 'segmented-button';
	}

	get value(): string {
		const selected = this.segments
			.filter((s) => s.checked)
			.map((s) => s.value);
		return this.multi ? selected.join(',') : (selected[0] || '');
	}

	private get segments(): MoniButtonSegment[] {
		return this.slottedSegments.filter(
			(el): el is MoniButtonSegment => el.tagName.toLowerCase() === 'moni-button-segment'
		);
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.group {
				display: inline-flex;
				align-items: center;
				position: relative;
				width: 100%;
			}

			::slotted(moni-button-segment) {
				flex: 1;
			}
		`
	];

	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('hideCheck') || changedProperties.has('size') || changedProperties.has('gap')) {
			this.updateChildren();
		}
		this.updateFormValue();
	}

	private handleSlotChange() {
		this.updateChildren();
		this.updateFormValue();
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
		const segments = this.segments;
		const len = segments.length;

		segments.forEach((seg, index) => {
			seg.hideCheck = this.hideCheck;
			seg.size = this.size;

			if (len === 1) {
				seg.position = 'solo';
			} else if (index === 0) {
				seg.position = 'first';
			} else if (index === len - 1) {
				seg.position = 'last';
			} else {
				seg.position = 'middle';
			}
		});
	}

	private updateFormValue() {
		if (typeof this.internals.setFormValue === 'function') {
			this.internals.setFormValue(this.value);
		}
	}

	private handleClick(e: Event) {
		const target = e.target as HTMLElement;
		const clickedSegment = target.closest('moni-button-segment') as MoniButtonSegment | null;

		if (!clickedSegment || clickedSegment.disabled) {
			return;
		}

		const segments = this.segments;

		if (this.multi) {
			clickedSegment.checked = !clickedSegment.checked;
		} else {
			segments.forEach((seg) => {
				if (seg === clickedSegment) {
					seg.checked = !seg.checked;
				} else {
					seg.checked = false;
				}
			});
		}

		this.updateFormValue();

		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: {
					value: this.value,
					segment: clickedSegment,
					checked: clickedSegment.checked
				}
			})
		);
	}

	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-segment-gap: 0px;`
			: '';
		return html`
			<div class="group" style=${inlineStyles} part="group" @click=${this.handleClick}>
				<slot @slotchange=${this.handleSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-segmented-button': MoniSegmentedButton;
	}
}

export default MoniSegmentedButton;
