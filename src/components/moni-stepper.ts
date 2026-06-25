import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import type { MoniStep } from './moni-step.js';

/**
 * Visual-only stepper. Wraps a list of <moni-step> children, propagates the
 * `current` index to each child, and styles the connectors between them.
 *
 * Attributes:
 *  - orientation: horizontal (default) | vertical
 *  - current:     zero-based index of the active step
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
