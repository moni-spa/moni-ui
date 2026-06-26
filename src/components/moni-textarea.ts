/**
 * @file components/moni-textarea.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Material Design 3 Textarea component.
 *
 * A multi-line text input field designed for collecting longer amounts of text,
 * such as comments, descriptions, or messages.
 *
 * **M3 spec reference:** `m3-docs/components/text-fields/specs.md`
 *
 * **Visual architecture:**
 * It shares the exact same `.field` shell and styling engine as
 * `<moni-text-field>`, but internally renders a native `<textarea>` instead
 * of an `<input>`. This ensures visual consistency across all form elements
 * regarding floating labels, helper text, error states, and icons.
 *
 * **Character Counter:**
 * If the `maxlength` attribute is set, the textarea automatically displays
 * a character counter (`{current length} / {maxlength}`) positioned at the
 * trailing edge of the supporting text area (bottom right). This can be
 * suppressed by setting the `no-counter` attribute.
 *
 * **State management:**
 * This component is purely visual and presentational. It reflects attributes
 * down to the native textarea, but it does NOT attach internal `@input` or
 * `@change` listeners. Consumers should attach standard DOM listeners directly
 * to this element to capture user input, just as they would with a native
 * textarea.
 *
 * @example
 * ```html
 * <!-- Standard filled textarea -->
 * <moni-textarea label="Description" rows="4"></moni-textarea>
 *
 * <!-- Outlined textarea with character counter -->
 * <moni-textarea
 *   variant="outlined"
 *   label="Bio"
 *   maxlength="160"
 * ></moni-textarea>
 * ```
 *
 * @csspart field     - The outer `.field` div container.
 * @csspart input     - The native `<textarea>` element.
 * @csspart label     - The floating `<label>` element.
 * @csspart helper    - The helper/error text area.
 * @csspart counter   - The character counter element.
 */
@customElement('moni-textarea')
export class MoniTextarea extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'filled';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon = '';
	@property({ reflect: true }) prefix = '';
	@property({ reflect: true }) suffix = '';
	@property({ type: Number, reflect: true }) rows = 3;
	@property({ type: Number, reflect: true }) maxlength: number | null = null;
	@property({ type: Boolean, reflect: true, attribute: 'no-counter' })
	noCounter = false;
	@property({ type: Boolean, reflect: true }) loading = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) helper = '';
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) placeholder = '';

	@query('textarea') private _input!: HTMLTextAreaElement;

	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('value')) this._input.value = this.value;
			if (changed.has('disabled')) this._input.disabled = this.disabled;
			if (changed.has('maxlength') && this.maxlength != null) {
				this._input.maxLength = this.maxlength;
			}
		}
	}

	static override styles = [sharedStyles, fieldStyles];

	override render() {
		const hasLeading = Boolean(this.icon) || Boolean(this.prefix);
		const hasTrailing =
			Boolean(this.trailingIcon) ||
			Boolean(this.suffix) ||
			this.loading;
		const isActive = Boolean(this.value) || Boolean(this.placeholder);
		const showCounter =
			!this.noCounter && this.maxlength != null && this.maxlength > 0;
		const fieldClasses = {
			field: true,
			label: Boolean(this.label),
			fill: this.variant === 'filled',
			border: this.variant === 'outlined',
			small: this.size === 'small',
			large: this.size === 'large',
			extra: this.size === 'extra',
			prefix: hasLeading,
			suffix: hasTrailing,
			invalid: this.error,
			round: this.shape === 'round',
			square: this.shape === 'no-round'
		};
		const placeholder = this.placeholder || (this.label ? ' ' : '');

		const leading = this.icon
			? html`<i class="leading-icon" part="leading-icon"
					><moni-icon name="${this.icon}"></moni-icon
				></i>`
			: this.prefix
				? html`<span class="leading-icon" part="prefix"
						>${this.prefix}</span
					>`
				: nothing;

		const trailing = this.loading
			? html`<i class="trailing-icon" part="trailing-icon"
					><moni-progress
						variant="circular"
						indeterminate
						size="small"
						style="inline-size: 1.25rem; block-size: 1.25rem; color: currentColor;"
					></moni-progress
				></i>`
			: this.trailingIcon
				? html`<i class="trailing-icon" part="trailing-icon"
						><moni-icon name="${this.trailingIcon}"></moni-icon
					></i>`
				: this.suffix
					? html`<span class="trailing-icon" part="suffix"
							>${this.suffix}</span
						>`
					: nothing;

		// M3 spec: supporting text on the left, character counter on the right.
		const counter = showCounter
			? html`<output part="counter" class="counter"
						>${this.value.length} / ${this.maxlength}</output
					>`
			: nothing;
		const helperText = this.error
			? html`<output part="helper" class="invalid"
						>${this.errorText || this.helper}</output
					>`
			: this.helper
				? html`<output part="helper">${this.helper}</output>`
				: nothing;
		const hasFooter = helperText || counter;

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<textarea
				part="input"
				rows=${this.rows}
				maxlength=${ifDefined(this.maxlength ?? undefined)}
				placeholder=${placeholder}
				?disabled=${this.disabled}
				.value=${this.value}
				name=${ifDefined(this.name || undefined)}
				class=${isActive ? 'active' : ''}
			></textarea>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${trailing}
			${hasFooter
				? html`<div class="footer" part="footer">
						${helperText}
						<div class="spacer"></div>
						${counter}
					</div>`
				: nothing}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-textarea': MoniTextarea;
	}
}

export default MoniTextarea;
