/**
 * @file components/moni-radio.ts
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
 * Material Design 3 Radio Button component.
 *
 * Radio buttons allow users to select exactly one item from a set of mutually
 * exclusive options. They share the same visual architecture as
 * `<moni-checkbox>` but use `type="radio"` and implement group deselection.
 *
 * **M3 spec reference:** `m3-docs/components/radio/specs.md`
 *
 * **Visual architecture (BeerCSS pattern):**
 * Identical to the checkbox pattern: the native `<input type="radio">` occupies
 * real layout space at `--_size` × `--_size` but is hidden via `opacity: 0`.
 * A sibling `<span>` renders:
 * - `::before` — the radio icon (`radio_button_unchecked` / `radio_button_checked`).
 * - `::after`  — the hover/focus ripple ring.
 *
 * **Group deselection:**
 * When a radio is checked, `_onChange` queries the component's `getRootNode()`
 * for all `moni-radio` elements sharing the same `name` attribute and sets
 * their `checked` property to `false`. This mirrors native browser behavior
 * for radio groups across shadow DOM boundaries where `name` grouping does
 * not work natively.
 *
 * @fires change - Bubbles and is composed. Fired when this radio is selected.
 *                 Read `element.checked` for the new state.
 *
 * @example
 * ```html
 * <moni-radio name="color" value="red"   label="Red"></moni-radio>
 * <moni-radio name="color" value="green" label="Green"></moni-radio>
 * <moni-radio name="color" value="blue"  label="Blue" checked></moni-radio>
 * ```
 *
 * @csspart radio - The outer `<label>` element.
 */
@customElement('moni-radio')
export class MoniRadio extends MoniElement {
	/**
	 * Text label displayed to the right of the radio icon.
	 *
	 * When non-empty, renders as a text node. When empty, the default slot
	 * is rendered, allowing slotted HTML content as the label.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Whether this radio button is currently selected.
	 *
	 * Reflected as an attribute so CSS selectors can target it. Synced to
	 * the native input via `updated()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) checked = false;

	/**
	 * When `true`, the radio is non-interactive and renders at 50% opacity.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Visual size of the radio icon and its invisible hit area.
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
	 * Radio group name. Radios with the same `name` in the same root node
	 * are treated as a mutual-exclusion group by `_onChange`.
	 *
	 * Note: Native `<input type="radio">` groups only work within the same
	 * document root. Since `moni-radio` uses shadow DOM, the deselection
	 * of siblings is handled imperatively in `_onChange`.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Forwarded to the native `<input value>` attribute.
	 * The value submitted in a form when this radio is selected.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/** Direct reference to the native input element for programmatic access. */
	@query('input') private _input!: HTMLInputElement;

	/**
	 * Syncs `checked` and `disabled` to the native input after each render cycle.
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

			/* BeerCSS .radio */
			label {
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
			}

			/* BeerCSS: input has real size, opacity 0 */
			input {
				inline-size: var(--_size);
				block-size: var(--_size);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* BeerCSS: span wraps visible indicator + label */
			span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* BeerCSS: span::before = radio icon (overlaid on input via negative inset) */
			span::before {
				--_size: inherit;
				content: 'radio_button_unchecked';
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

			/* Checked: filled radio icon */
			input:checked + span::before {
				content: 'radio_button_checked';
				color: var(--primary);
			}

			/* BeerCSS: span::after = hover ripple */
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

			/* Label padding */
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
	 * Handles the native input `change` event.
	 *
	 * On selection, deselects all sibling `moni-radio` elements with the same
	 * `name` in the same root node (document or shadow root). This is necessary
	 * because native radio group exclusion only works within the same document
	 * root and does not cross shadow DOM boundaries.
	 *
	 * After deselection, dispatches a composed `'change'` event so it is
	 * audible to parent elements in the light DOM.
	 *
	 * @param e - The native `change` event from the hidden `<input>`.
	 */
	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		if (this.checked && this.name) {
			const root = this.getRootNode() as Document | ShadowRoot;
			if (root) {
				const siblings = root.querySelectorAll(`moni-radio[name="${this.name}"]`);
				siblings.forEach((sibling) => {
					if (sibling !== this && sibling instanceof MoniRadio) {
						sibling.checked = false;
					}
				});
			}
		}
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	override render() {
		return html`<label part="radio">
			<input
				type="radio"
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
		'moni-radio': MoniRadio;
	}
}

export default MoniRadio;
