import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Radio that faithfully ports BeerCSS's `.radio` styles.
 *
 * BeerCSS architecture:
 *  - `.radio` is inline-flex, aligns items center
 *  - `input` has width/height = --_size, opacity: 0  (real layout space, not absolute)
 *  - `span::before` shows "radio_button_unchecked" / "radio_button_checked" via Material Symbols font
 *  - `span::after` is the ripple hover effect
 *
 * Attributes:
 *  - label:    text label
 *  - checked:  present
 *  - disabled: present
 *  - size:     small | medium (default) | large | extra
 *  - name:     forwarded to input.name (group radios by name)
 *  - value:    forwarded to input.value
 */
@customElement('moni-radio')
export class MoniRadio extends MoniElement {
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
