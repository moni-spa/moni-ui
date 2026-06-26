/**
 * @file components/moni-checkbox.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Checkbox component.
 *
 * Checkboxes allow users to select one or more items from a set, or toggle
 * a single binary option. They are visual-only shells — the consumer is
 * responsible for wiring up form submission and validation logic.
 *
 * **Visual architecture (BeerCSS pattern):**
 * The native `<input type="checkbox">` occupies real layout space (16×16 minimum)
 * but is visually hidden via `opacity: 0`. A `<span>` sibling rendered after
 * the input holds two pseudo-elements:
 * - `::before` — the visible checkbox icon (Material Symbols ligature).
 * - `::after`  — the hover/focus state layer ripple ring.
 *
 * The `::before` content switches between:
 * - `'check_box_outline_blank'` (unchecked)
 * - `'check_box'` (checked)
 * - `'indeterminate_check_box'` (native indeterminate state)
 *
 * **Form integration:**
 * Setting `name` and `value` passes them to the native `<input>` element,
 * enabling participation in HTML form submissions.
 *
 * @fires change - Bubbles and is composed. Fired when the checkbox is toggled.
 *                 The consumer can read `element.checked` for the new state.
 *
 * @example
 * ```html
 * <moni-checkbox label="Accept terms" name="terms" value="yes"></moni-checkbox>
 *
 * <script>
 *   document.querySelector('moni-checkbox').addEventListener('change', (e) => {
 *     console.log('checked:', e.target.checked);
 *   });
 * </script>
 * ```
 *
 * @csspart checkbox - The outer `<label>` element.
 */
@customElement('moni-checkbox')
export class MoniCheckbox extends MoniElement {
	/**
	 * Text label displayed to the right of the checkbox icon.
	 *
	 * When non-empty, the label is rendered as a text node inside the `<span>`.
	 * When empty, the default slot is rendered instead, allowing slotted HTML.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Whether the checkbox is currently checked.
	 *
	 * Reflected as an attribute so CSS attribute selectors and external state
	 * readers can observe the checked state without accessing the JS property.
	 * Synced to the native input via `updated()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) checked = false;

	/**
	 * When `true`, the native input is disabled: the checkbox is not interactive
	 * and renders at 50% opacity.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Visual size of the checkbox icon.
	 *
	 * Maps to the `--_size` custom property which controls both the invisible
	 * input's hit area and the visible `::before` icon size.
	 *
	 * | Value      | `--_size` |
	 * |------------|-----------|
	 * | `'small'`  | 1rem      |
	 * | `'medium'` | 1.5rem    |
	 * | `'large'`  | 2rem      |
	 * | `'extra'`  | 2.5rem    |
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Forwarded to the native `<input name>` attribute.
	 * Required for grouping checkboxes within a form.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Forwarded to the native `<input value>` attribute.
	 * The value submitted in a form when this checkbox is checked.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/** Direct reference to the native input element for programmatic access. */
	@query('input') private _input!: HTMLInputElement;

	/**
	 * Syncs `checked` and `disabled` back to the native input element after
	 * Lit's render cycle, ensuring the DOM stays in sync with component state.
	 *
	 * This is necessary because Lit's `.property=${value}` binding updates the
	 * DOM property, but the `live()` directive and direct property assignment
	 * are more reliable for boolean inputs across browser implementations.
	 *
	 * @param changed - Map of changed property names to their previous values.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('checked')) this._input.checked = this.checked;
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				--_size: 1.5rem;
				display: inline-flex;
				font-family: var(--font);
			}
			:host([size='small'])  { --_size: 1rem; }
			:host([size='large'])  { --_size: 2rem; }
			:host([size='extra'])  { --_size: 2.5rem; }

			/* BeerCSS .checkbox */
			label {
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
			}

			/* BeerCSS: input has real size, opacity 0 — occupies real layout space */
			input {
				inline-size: var(--_size);
				block-size: var(--_size);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* BeerCSS: span wraps the visible indicator + label text */
			span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* BeerCSS: span::before = the checkbox icon (absolute, overlaid on input) */
			span::before {
				--_size: inherit;
				content: 'check_box_outline_blank';
				inline-size: var(--_size);
				block-size: var(--_size);
				box-sizing: border-box;
				margin: 0 auto;
				outline: none;
				color: var(--on-surface-variant);
				position: absolute;
				inset: auto auto auto calc(var(--_size) * -1);
				border-radius: 50%;
				user-select: none;
				z-index: 1;
				font-family: var(--font-icon);
				font-size: var(--_size);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			/* Checked: filled checkbox icon */
			input:checked + span::before {
				content: 'check_box';
				font-variation-settings: 'FILL' 1;
				color: var(--primary);
			}

			/* Indeterminate */
			input:indeterminate + span::before {
				content: 'indeterminate_check_box';
			}

			/* BeerCSS: span::after = ripple/hover ring */
			span::after {
				--_size: inherit;
				content: '';
				inline-size: var(--_size);
				block-size: var(--_size);
				box-sizing: border-box;
				margin: 0 auto;
				position: absolute;
				inset: auto auto auto calc(var(--_size) * -1);
				border-radius: 50%;
				user-select: none;
				transition: all var(--speed1);
				background-color: currentColor;
				box-shadow: 0 0 0 0 currentColor;
				opacity: 0;
			}

			label:hover > input:not(:disabled) + span::after,
			input:not(:disabled):focus + span::after {
				box-shadow: 0 0 0 0.5rem currentColor;
				opacity: 0.1;
			}

			/* BeerCSS: span:not(:empty) gets a small inline-start padding for the label */
			span.has-label {
				padding-inline-start: 0.25rem;
			}

			/* Disabled */
			input:disabled + span {
				opacity: 0.5;
				cursor: not-allowed;
			}

			/* Focus ring */
			input:focus-visible + span::before {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.375rem;
			}
		`
	];

	/**
	 * Handles the native input's `change` event.
	 *
	 * Reads the new checked state from the input and re-dispatches a composed
	 * `'change'` event so the signal crosses shadow DOM boundaries and can be
	 * heard by parent elements in the light DOM.
	 *
	 * @param e - The native `change` event from the hidden `<input>`.
	 */
	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	/**
	 * Renders the accessible checkbox label structure.
	 *
	 * The `<label>` wraps the hidden `<input>` and a `<span>` so that clicking
	 * anywhere on the label area (including the text) toggles the checkbox.
	 * The `has-label` class on the span adds left padding to separate the icon
	 * from the label text.
	 */
	override render() {
		return html`<label part="checkbox">
			<input
				type="checkbox"
				.checked=${live(this.checked)}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				value=${ifDefined(this.value || undefined)}
				@change=${this._onChange}
			/>
			<span class=${this.label ? 'has-label' : ''}>
				${this.label
					? html`${this.label}`
					: html`<slot></slot>`}
			</span>
		</label>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-checkbox': MoniCheckbox;
	}
}

export default MoniCheckbox;
