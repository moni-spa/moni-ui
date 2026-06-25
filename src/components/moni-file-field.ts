import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Visual-only file field. Renders a hidden `<input type="file">` over a
 * read-only text input that shows the chosen file names.
 *
 * The DOM order is `input[type=text], label, input[type=file], output` so
 * that the floating label CSS selector `input + label` lifts correctly even
 * though the visible field is the read-only text input.
 *
 * Attributes:
 *  - name, label, value, variant, size, shape, disabled, helper, error,
 *    error-text, placeholder — see moni-text-field.
 *  - accept:  forwarded to input.accept
 *  - multiple: present → input.multiple
 *  - button-label: text on the picker button (visual only, default: "Choose file")
 *  - icon:           leading Material Symbols name
 *  - trailing-icon:  trailing Material Symbols name
 */
@customElement('moni-file-field')
export class MoniFileField extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'outlined';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';
	@property({ reflect: true }) accept = '';
	@property({ type: Boolean, reflect: true }) multiple = false;
	@property({ reflect: true, attribute: 'button-label' })
	buttonLabel = 'Choose file';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) helper = '';
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon =
		'folder_open';

	@query('input[type="file"]') private _fileInput!: HTMLInputElement;

	override updated(changed: Map<string, unknown>) {
		if (this._fileInput) {
			if (changed.has('disabled'))
				this._fileInput.disabled = this.disabled;
		}
	}

	static override styles = [
		sharedStyles,
		fieldStyles,
		css`
			input[type='file'] {
				position: absolute;
				inset: 0;
				opacity: 0;
				z-index: 2;
				cursor: pointer;
			}
			input[type='text'] {
				cursor: pointer;
			}
		`
	];

	override render() {
		const isActive = Boolean(this.value);
		const hasLeading = Boolean(this.icon);
		const hasTrailing = Boolean(this.trailingIcon);
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

		const leading = this.icon
			? html`<i class="leading-icon" part="leading-icon"
					><moni-icon name="${this.icon}"></moni-icon
				></i>`
			: nothing;

		const trailing = this.trailingIcon
			? html`<i class="trailing-icon" part="trailing-icon"
					><moni-icon name="${this.trailingIcon}"></moni-icon
				></i>`
			: nothing;

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<input
				type="text"
				part="display"
				readonly
				placeholder=${this.buttonLabel}
				.value=${this.value}
				?disabled=${this.disabled}
				name=${ifDefined(this.name ? `${this.name}-display` : undefined)}
				class=${isActive ? 'active' : ''}
			/>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			<input
				type="file"
				part="file"
				?disabled=${this.disabled}
				accept=${ifDefined(this.accept || undefined)}
				?multiple=${this.multiple}
				name=${ifDefined(this.name || undefined)}
			/>
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
		'moni-file-field': MoniFileField;
	}
}

export default MoniFileField;
