/**
 * @file components/moni-button-group.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Button Group component.
 *
 * Organizes multiple `<moni-button>` or `<moni-icon-button>` components
 * into a single row.
 *
 * **Variants:**
 * - `standard` (default) — A simple flex row with a gap between buttons.
 * - `connected` — The M3 Expressive replacement for segmented buttons. In this
 *   mode, buttons share borders and form a single continuous pill shape. The
 *   group manages the single/multi-select toggle state of its children.
 *
 * **`connected` variant details:**
 * - **Shape propagation:** The group automatically propagates M3 shape classes
 *   (`left-round-flat`, `no-round`, `right-round-flat`) to its children so
 *   they interlock seamlessly.
 * - **Toggle management:** The group listens to child clicks and toggles their
 *   `active` attributes. When `multi=false` (default), only one button can be
 *   active at a time (radio button behavior). When `multi=true`, multiple buttons
 *   can be active (checkbox behavior).
 * - **Event propagation:** Fires a `'change'` event when the selection changes.
 *
 * **Accessibility:**
 * - Renders with `role="group"` (can be overridden to `toolbar` or `radiogroup`).
 * - Consumers should provide an `aria-label` or `aria-labelledby` attribute
 *   to identify the group's purpose to assistive technologies.
 *
 * @fires change - Fired when a button is clicked in `connected` mode and the
 *                 selection state updates.
 *
 * @example
 * ```html
 * <!-- Connected single-select group -->
 * <moni-button-group variant="connected" label="Alignment">
 *   <moni-button icon="format_align_left" active></moni-button>
 *   <moni-button icon="format_align_center"></moni-button>
 *   <moni-button icon="format_align_right"></moni-button>
 * </moni-button-group>
 *
 * <!-- Standard button row -->
 * <moni-button-group gap="1rem">
 *   <moni-button variant="text">Cancel</moni-button>
 *   <moni-button>Save</moni-button>
 * </moni-button-group>
 * ```
 *
 * @slot default - The `<moni-button>` elements that make up the group.
 */
@customElement('moni-button-group')
export class MoniButtonGroup extends MoniElement {
	@property({ reflect: true })
	variant: 'standard' | 'connected' = 'standard';

	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	@property({ type: Boolean, reflect: true })
	multi = false;

	@property()
	gap = '';

	@property({ reflect: true })
	role: 'group' | 'toolbar' | 'radiogroup' = 'group';

	@property({ reflect: true })
	label = '';

	@property({ reflect: true, attribute: 'labelled-by' })
	labelledBy = '';

	@queryAssignedElements({ flatten: true })
	private slottedButtons!: HTMLElement[];

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.group-container {
				display: inline-flex;
				align-items: center;
				width: 100%;
			}

			:host([variant='standard']) .group-container {
				gap: 0.5rem;
			}
			:host([variant='standard'][size='xsmall']) .group-container {
				gap: 1.125rem; /* 18dp */
			}
			:host([variant='standard'][size='small']) .group-container {
				gap: 0.75rem; /* 12dp */
			}
			:host([variant='standard'][size='medium']) .group-container {
				gap: 0.5rem; /* 8dp */
			}
			:host([variant='standard'][size='large']) .group-container {
				gap: 0.5rem; /* 8dp */
			}
			:host([variant='standard'][size='xlarge']) .group-container,
			:host([variant='standard'][size='extra']) .group-container {
				gap: 0.5rem; /* 8dp */
			}

			:host([variant='connected']) .group-container {
				gap: 0.125rem; /* 2dp */
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
		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		buttons.forEach((btn, index) => {
			// Propagate size
			btn.setAttribute('size', this.size);

			// Propagate shape for connected variant
			if (this.variant === 'connected') {
				if (this.gap) {
					if (buttons.length === 1) {
						btn.setAttribute('shape', 'round');
					} else if (index === 0) {
						btn.setAttribute('shape', 'left-round');
					} else if (index === buttons.length - 1) {
						btn.setAttribute('shape', 'right-round');
					} else {
						btn.setAttribute('shape', 'inner-round');
					}
				} else {
					if (buttons.length === 1) {
						btn.setAttribute('shape', 'round');
					} else if (index === 0) {
						btn.setAttribute('shape', 'left-round-flat');
					} else if (index === buttons.length - 1) {
						btn.setAttribute('shape', 'right-round-flat');
					} else {
						btn.setAttribute('shape', 'no-round');
					}
				}
			} else {
				// Standard variant: buttons retain their own shapes or default round
				const currentShape = btn.getAttribute('shape');
				if (!currentShape || ['left-round-flat', 'right-round-flat', 'no-round', 'left-round', 'right-round', 'inner-round'].includes(currentShape)) {
					btn.setAttribute('shape', 'round');
				}
			}
		});
	}

	private handlePointerDown(e: PointerEvent) {
		if (this.variant !== 'standard') return;
		const target = e.target as HTMLElement;
		const button = target.closest('moni-button, moni-icon-button') as HTMLElement;
		if (!button || button.hasAttribute('disabled')) return;

		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		const index = buttons.indexOf(button);
		if (index === -1) return;

		const prev = buttons[index - 1];
		const next = buttons[index + 1];

		if (prev) {
			prev.style.transition = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
			prev.style.transform = 'translateX(-6px) scaleX(0.92)';
			prev.style.transformOrigin = 'right center';
		}
		if (next) {
			next.style.transition = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
			next.style.transform = 'translateX(6px) scaleX(0.92)';
			next.style.transformOrigin = 'left center';
		}
	}

	private handlePointerUp() {
		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		buttons.forEach((btn) => {
			btn.style.transform = '';
			btn.style.transformOrigin = '';
		});
	}

	private handleClick(e: Event) {
		const target = e.target as HTMLElement;
		const clickedButton = target.closest('moni-button, moni-icon-button');

		if (!clickedButton || clickedButton.hasAttribute('disabled')) {
			return;
		}

		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		if (!this.multi) {
			buttons.forEach((btn) => {
				if (btn !== clickedButton) {
					btn.removeAttribute('active');
					(btn as any).active = false;
				}
			});
		}

		// Toggle clicked button active state
		const wasActive = clickedButton.hasAttribute('active');
		if (wasActive) {
			clickedButton.removeAttribute('active');
			(clickedButton as any).active = false;
		} else {
			clickedButton.setAttribute('active', '');
			(clickedButton as any).active = true;
		}

		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: {
					button: clickedButton,
					active: !wasActive
				}
			})
		);
	}

	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-group-connected-gap: 0px;`
			: '';
		// M3 connected button group a11y: role="group" by default. Consumers
		// can override via the `role` attribute (e.g. "toolbar" for app
		// actions) and provide an aria-label or aria-labelledby.
		return html`
			<div
				class="group-container"
				style=${inlineStyles}
				part="container"
				role=${this.role}
				aria-label=${this.label || nothing}
				aria-labelledby=${this.labelledBy || nothing}
				@pointerdown=${this.handlePointerDown}
				@pointerup=${this.handlePointerUp}
				@pointercancel=${this.handlePointerUp}
				@pointerleave=${this.handlePointerUp}
			>
				<slot @slotchange=${this.handleSlotChange} @click=${this.handleClick}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-button-group': MoniButtonGroup;
	}
}

export default MoniButtonGroup;
