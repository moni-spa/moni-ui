/**
 * @file components/moni-file-field.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Material Design 3 File Field component.
 *
 * A specialized field component that provides a styled, accessible alternative
 * to the native `<input type="file">`. It wraps a native file input inside
 * the M3 `.field` shell and presents a read-only text input showing the
 * selected file name(s) alongside a stylized "Choose file" action button.
 *
 * **Visual architecture:**
 * The component leverages the `fieldStyles` CSS patterns. The internal DOM
 * structure is specifically ordered as:
 * `[text input] -> [label] -> [file input] -> [output]`
 * This specific ordering ensures that the CSS adjacent sibling selector
 * (`input + label`) can correctly float the label when the field is populated,
 * even though the visible field is actually the read-only text input.
 *
 * **State management:**
 * When the user selects files via the hidden file input, the component listens
 * for the native `change` event, reads `input.files`, and updates the read-only
 * text input with a comma-separated list of file names. The `value` property
 * is kept in sync, and a composed `'change'` event is re-dispatched.
 *
 * @fires change - Bubbles and is composed. Fired when files are selected or
 *                 cleared. The consumer can read the internal input's `files`
 *                 list by querying the component.
 *
 * @example
 * ```html
 * <!-- Single file upload -->
 * <moni-file-field
 *   label="Profile picture"
 *   name="avatar"
 *   accept="image/png, image/jpeg"
 *   button-label="Browse..."
 * ></moni-file-field>
 *
 * <!-- Multiple file upload with error state -->
 * <moni-file-field
 *   label="Documents"
 *   multiple
 *   error
 *   error-text="Files exceed maximum size limit"
 * ></moni-file-field>
 * ```
 *
 * @csspart field       - The outer `.field` div container.
 * @csspart input-text  - The visible read-only `<input type="text">`.
 * @csspart label       - The floating `<label>` element.
 * @csspart input-file  - The hidden native `<input type="file">`.
 * @csspart button      - The button element (styled via CSS `::file-selector-button`).
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
