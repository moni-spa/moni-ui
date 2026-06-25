import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';

/**
 * Visual-only color field. Renders a hidden `<input type="color">` plus a
 * preview swatch and a read-only text display of the current value.
 *
 * Attributes:
 *  - name, label, value, variant, size, shape, disabled, helper, error,
 *    error-text, placeholder — see moni-text-field.
 */
@customElement('moni-color-field')
export class MoniColorField extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'outlined';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) helper = '';
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ reflect: true }) value = '#6750a4';

	@query('input[type="color"]') private _colorInput!: HTMLInputElement;
	@query('input[type="text"]') private _textInput!: HTMLInputElement;

	override updated(changed: Map<string, unknown>) {
		if (changed.has('value')) {
			if (this._colorInput) this._colorInput.value = this.value;
			if (this._textInput) this._textInput.value = this.value;
		}
		if (changed.has('disabled')) {
			if (this._colorInput) this._colorInput.disabled = this.disabled;
			if (this._textInput) this._textInput.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		fieldStyles,
		css`
			.swatch {
				inline-size: 1.5rem;
				block-size: 1.5rem;
				border-radius: 50%;
				border: 0.0625rem solid var(--outline);
				background-color: var(--_swatch, currentColor);
				position: absolute;
				inset: calc(50% - 0.75rem) auto auto 0.75rem;
				pointer-events: none;
				z-index: 1;
			}
			input[type='text'] {
				padding-inline-start: 2.5rem !important;
			}
			input[type='color'] {
				position: absolute;
				inset: 0;
				opacity: 0;
				z-index: 2;
				cursor: pointer;
			}
		`
	];

	override render() {
		const isActive = Boolean(this.value);
		const fieldClasses = {
			field: true,
			label: Boolean(this.label),
			fill: this.variant === 'filled',
			border: this.variant === 'outlined',
			small: this.size === 'small',
			large: this.size === 'large',
			extra: this.size === 'extra',
			prefix: true,
			invalid: this.error,
			round: this.shape === 'round',
			square: this.shape === 'no-round'
		};

		return html`<div class=${classMap(fieldClasses)} part="field">
			<span
				class="swatch"
				style="--_swatch: ${this.value};"
				aria-hidden="true"
			></span>
			<input
				type="color"
				part="color"
				.value=${this.value}
				?disabled=${this.disabled}
				name=${ifDefined(this.name ? `${this.name}-color` : undefined)}
				tabindex="-1"
			/>
			<input
				type="text"
				part="text"
				readonly
				.value=${this.value}
				?disabled=${this.disabled}
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
		'moni-color-field': MoniColorField;
	}
}

export default MoniColorField;
