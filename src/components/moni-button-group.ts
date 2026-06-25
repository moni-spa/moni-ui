import { html, css, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only button group. Organizes `moni-button` or `moni-icon-button`
 * components in a row.
 *
 * **`variant="connected"`** is the Material Design 3 Expressive replacement
 * for the deprecated `moni-segmented-button` (see
 * `m3-docs/components/segmented-buttons/overview.md` § M3 Expressive update).
 * In connected mode, segments share borders via propagated `shape` values
 * (`left-round-flat`, `no-round`, `right-round-flat` for a gap-less row), and
 * the group manages single/multi-select toggle state. This is the
 * **only Moni component that intentionally uses `@click` listeners** —
 * toggle behavior is essential to the M3 connected button group semantics.
 *
 * Accessibility:
 *  - The host renders `role="group"` (configurable via `role` attribute).
 *  - `aria-label` / `aria-labelledby` should be set by the consumer to
 *    identify the group to assistive technology.
 *
 * Attributes:
 *  - variant:    standard (default) | connected
 *  - size:       small | medium (default) | large | extra
 *  - multi:      boolean (default false) — multiple toggles allowed
 *  - gap:        custom gap space (e.g. "8px" or "1rem"); in `connected`
 *                variant the default is 0.125rem (2dp) per M3 spec
 *  - role:       ARIA role override (default "group")
 *  - label:      aria-label for the group
 *  - labelled-by: aria-labelledby reference
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
