import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Checkbox that faithfully ports BeerCSS's `.checkbox` styles.
 *
 * BeerCSS architecture:
 *  - `.checkbox` is inline-flex, aligns items center
 *  - `input` has width/height = --_size, opacity: 0  (occupies real space, no absolute!)
 *  - `span::before` is the visible checkbox box (position: absolute, inset from the input)
 *  - `span::after` is the ripple hover effect
 *  - Content is set via CSS: "check_box_outline_blank" / "check_box" (Material Symbols font)
 *
 * Attributes:
 *  - label:    text label
 *  - checked:  present → input is checked
 *  - disabled: present → input is disabled
 *  - size:     small | medium (default) | large | extra
 *  - name:     forwarded to input.name
 *  - value:    forwarded to input.value
 */
@customElement('moni-checkbox')
export class MoniCheckbox extends MoniElement {
	@property({ reflect: true }) label = '';
	@property({ type: Boolean, reflect: true }) checked = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) value = '';

	@query('input') private _input!: HTMLInputElement;

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

	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

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
