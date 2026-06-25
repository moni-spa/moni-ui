import { html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Visual-only text field. Renders the `.field` family of BeerCSS helpers
 * with a native `<input>`.
 *
 * This component is **visual-only**: it does NOT listen to `@input` to
 * sync the `value` attribute back from the underlying input. Consumers
 * either use form submission or wire their own change handling.
 *
 * Attributes:
 *  - name, label, value, variant, size, shape, type, icon, trailing-icon,
 *    prefix, suffix, helper, error, error-text, disabled, placeholder — see below.
 *  - loading:   present → shows indeterminate circular progress
 */
@customElement('moni-text-field')
export class MoniTextField extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'filled';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';
	@property({ reflect: true })
	type:
		| 'text'
		| 'password'
		| 'email'
		| 'number'
		| 'tel'
		| 'url'
		| 'search' = 'text';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon = '';
	@property({ reflect: true }) prefix = '';
	@property({ reflect: true }) suffix = '';
	@property({ reflect: true }) helper = '';
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ type: Boolean, reflect: true }) loading = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) placeholder = '';

	@query('input') private _input!: HTMLInputElement;

	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('value')) this._input.value = this.value;
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
	}

	static override styles = [sharedStyles, fieldStyles];

	override render() {
		const hasLeading = Boolean(this.icon) || Boolean(this.prefix);
		const hasTrailing =
			Boolean(this.trailingIcon) || Boolean(this.suffix);
		const isActive = Boolean(this.value) || Boolean(this.placeholder);
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

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<input
				part="input"
				type=${this.type}
				placeholder=${placeholder}
				?disabled=${this.disabled}
				.value=${this.value}
				name=${ifDefined(this.name || undefined)}
				class=${isActive ? 'active' : ''}
			/>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${trailing}
			${this.error
				? html`<output part="helper" class="invalid"
						>${this.errorText || this.helper}</output
					>`
				: this.helper
					? html`<output part="helper">${this.helper}</output>`
					: nothing}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-text-field': MoniTextField;
	}
}

export default MoniTextField;
