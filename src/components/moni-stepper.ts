/**
 * @file components/moni-stepper.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import type { MoniStep } from './moni-step.js';

/**
 * Material Design 3 Stepper component.
 *
 * A container for a linear progression of `<moni-step>` elements. Steppers
 * convey progress through numbered steps and indicate the user's current
 * position within a flow.
 *
 * **M3 spec reference:** `m3-docs/components/progress-indicators/specs.md`
 *
 * **Orchestration:**
 * This component acts as the orchestrator for its slotted `<moni-step>` children.
 * Whenever the `current` property changes, or children are added/removed, the
 * stepper iterates over all child steps and injects their state:
 * - Assigns the sequential `index` (0-based) to each step.
 * - Sets `active=true` on the step matching the `current` index.
 * - Sets `completed=true` on all steps prior to the `current` index.
 *
 * **Visual layout:**
 * The stepper manages the layout (flex row or column based on `orientation`)
 * and ensures the connector lines between steps are rendered correctly via
 * CSS pseudo-elements defined in the child `<moni-step>` styling.
 *
 * @example
 * ```html
 * <moni-stepper current="1" orientation="horizontal">
 *   <moni-step title="Step 1"></moni-step>
 *   <moni-step title="Step 2"></moni-step>
 *   <moni-step title="Step 3"></moni-step>
 * </moni-stepper>
 *
 * <script>
 *   const stepper = document.querySelector('moni-stepper');
 *   // Move to next step
 *   stepper.current = 2;
 * </script>
 * ```
 *
 * @slot default - `<moni-step>` elements.
 */
@customElement('moni-stepper')
export class MoniStepper extends MoniElement {
	@property({ reflect: true })
	orientation: 'horizontal' | 'vertical' = 'horizontal';
	@property({ type: Number, reflect: true }) current = 0;

	@queryAssignedElements({ selector: 'moni-step' })
	private _steps!: MoniStep[];

	override updated(changed: Map<string, unknown>) {
		if (
			changed.has('current') ||
			changed.has('orientation') ||
			changed.size === 0
		) {
			this._syncSteps();
		}
	}

	/**
	 * Propagate the `current` index to each child <moni-step>:
	 *  - sets `index` from the child's position
	 *  - sets `completed` on every step before `current`
	 *  - sets `active` on the step at `current`
	 *
	 * Deferred to a microtask so that slotted children are guaranteed
	 * to have finished their first update cycle before we write to them.
	 */
	private _syncSteps() {
		Promise.resolve().then(() => {
			let steps = this._steps || [];
			if (steps.length === 0) {
				steps = Array.from(this.querySelectorAll('moni-step')) as MoniStep[];
			}
			steps.forEach((step, i) => {
				step.index = i;
				step.completed = i < this.current;
				step.active = i === this.current;
			});
		});
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			.list {
				display: flex;
				gap: 0.5rem;
				padding: 0;
				margin: 0;
				list-style: none;
			}
			:host([orientation='vertical']) .list {
				flex-direction: column;
			}

			::slotted(*) {
				flex: 1;
				min-inline-size: 0;
			}
		`
	];

	override render() {
		return html`<ol class="list" part="stepper">
			<slot @slotchange=${this._onSlotChange}></slot>
		</ol>`;
	}

	private _onSlotChange = () => {
		// Steps may have been added/removed; re-sync.
		this._syncSteps();
	};
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-stepper': MoniStepper;
	}
}

export default MoniStepper;
