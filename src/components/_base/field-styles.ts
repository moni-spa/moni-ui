import { css } from 'lit';

/**
 * Shared visual rules for every field-like input shell.
 *
 * Direct port of `beercss-CDN/elements/fields.css`. Each consumer (text-field,
 * textarea, select, color-field, file-field) is expected to render a DOM tree
 * of the form:
 *
 *   <div class="field label fill|small|large|extra|prefix|icon|suffix|invalid">
 *     [leading <i class="leading-icon">]   ← optional
 *     <input|select|textarea>             ← input area
 *     <label>                             ← immediate next sibling (for label lift)
 *     [trailing <i class="trailing-icon">] ← optional
 *     [suffix text]                       ← optional
 *     <slot name="trailing">              ← optional slot
 *     <output>                            ← helper text or error
 *   </div>
 *
 * The selector order is rigid: input must be followed by label so the
 * `+ label` and `:focus + label` selectors in BeerCSS can lift the floating
 * label. If a component reorders the DOM, the label may not animate properly.
 */
export const fieldStyles = css`
	:host {
		display: block;
		inline-size: 100%;
	}

	.field {
		--_input: 3rem;
		--_start: 1.2rem;
		--_middle: calc(var(--_input, 0) / 2);
		border-radius: 0.25rem 0.25rem 0 0;
		min-block-size: var(--_input);
		display: flex;
		flex-direction: column;
		position: relative;
		inline-size: 100%;
	}

	/* Square overrides anything (border, round variants) via !important. */
	.field.square,
	.field.square.border,
	.field.square[class*='round'] {
		border-radius: 0 !important;
	}

	.field.square > :is(input, textarea, select) {
		border-radius: 0 !important;
	}

	.field.fill {
		--_background: var(--surface-container-highest);
		background-color: unset !important;
		color: unset !important;
	}
	.field.fill > :is(input, select, textarea) {
		background-color: var(--_background);
		z-index: 0;
	}

	.field.small {
		--_input: 2.5rem;
		--_start: 1rem;
	}
	.field.large {
		--_input: 3.5rem;
		--_start: 1.4rem;
	}
	.field.extra {
		--_input: 4rem;
		--_start: 1.6rem;
	}

	.field.border {
		border-radius: 0.25rem;
	}

	.field[class*='round'].small {
		border-radius: 1.25rem;
	}
	.field[class*='round'] {
		border-radius: 1.5rem;
	}
	.field[class*='round'].large {
		border-radius: 1.75rem;
	}
	.field[class*='round'].extra {
		border-radius: 2rem;
	}

	/* Generic icon baseline (BeerCSS: .field > :is(i, img, svg, progress.circle, a)).
	   The explicit .leading-icon / .trailing-icon classes below win over
	   the position-suffix selectors and guarantee correct placement even when
	   the icon is wrapped in a custom element (e.g. <moni-icon>). */
	.field > :is(i, img, svg) {
		position: absolute;
		inset: calc((var(--_input, 0) / 2) - 0.75rem) auto auto auto;
		cursor: pointer;
		z-index: 10;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		margin: auto 0;
		pointer-events: none;
	}
	.field > :is(i, img, svg):first-child,
	.field > .leading-icon {
		inset: calc(var(--_middle, 0) - 0.75rem) auto auto 1rem;
	}

	/* Trailing icon: BeerCSS uses :last-child:not(:first-child) which fails
	   when an output follows. The class selectors below always win and
	   guarantee correct positioning on the right edge. */
	.field > :is(i, img, svg):last-child:not(:first-child),
	.field > .trailing-icon {
		inset: calc(var(--_middle, 0) - 0.75rem) 1rem auto auto;
		inset-inline-start: auto !important;
	}

	.field.invalid > i {
		color: var(--error);
	}

	/* Input / textarea / select — native form elements get a full reset. */
	.field > :is(input, textarea, select) {
		all: unset;
		position: relative;
		display: block;
		box-sizing: border-box;
		border-radius: inherit;
		border: 0.0625rem solid transparent;
		padding: 0 0.9375rem;
		font-family: inherit;
		font-size: 1rem;
		min-block-size: var(--_input);
		outline: none;
		z-index: 1;
		background: none;
		resize: none;
		text-align: start;
		cursor: text;
		color: var(--on-surface);
	}

	input::-webkit-date-and-time-value {
		text-align: start;
	}
	:is(input, select, textarea):is(:-webkit-autofill, :autofill) {
		-webkit-background-clip: text;
		-webkit-text-fill-color: var(--on-surface);
	}

	.field > :is(input, textarea, select):focus {
		border: 0.125rem solid transparent;
		padding-inline: 0.875rem;
	}

	.field > textarea:not([rows]) {
		field-sizing: content;
		max-block-size: 12rem;
	}

	input[type='file'],
	input[type='color'],
	:not(.field) > input:is([type^='date'], [type^='time'], [type='month'], [type='week']),
	input::-webkit-calendar-picker-indicator {
		opacity: 0;
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		padding: 0;
		border: 0;
		outline: 0;
		z-index: 2 !important;
	}

	@media (pointer: fine) {
		.field > input::-webkit-calendar-picker-indicator {
			z-index: -1 !important;
		}
	}

	input::-webkit-search-decoration,
	input::-webkit-search-cancel-button,
	input::-webkit-search-results-button,
	input::-webkit-search-results-decoration,
	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		display: none;
	}

	input[type='number'] {
		appearance: textfield;
	}

	.field.border > :is(input, textarea, select) {
		border-color: var(--outline);
	}
	.field.border > :is(input, textarea, select):focus {
		border-color: var(--primary);
	}

	.field[class*='round'] > :is(input, textarea, select) {
		padding-inline: 1.4376rem;
	}
	.field[class*='round'] > :is(input, textarea, select):focus {
		padding-inline: 1.375rem;
	}

	.field.prefix > :is(input, textarea, select) {
		padding-inline-start: 2.9375rem;
	}
	.field.prefix > :is(input, textarea, select):focus {
		padding-inline-start: 2.875rem;
	}

	.field.suffix > :is(input, textarea, select) {
		padding-inline-end: 2.9375rem;
	}
	.field.suffix > :is(input, textarea, select):focus {
		padding-inline-end: 2.875rem;
	}

	.field:not(.border, [class*='round']) > :is(input, textarea, select) {
		border-block-end-color: var(--outline);
	}
	.field:not(.border, [class*='round']) > :is(input, textarea, select):focus {
		border-block-end-color: var(--primary);
	}

	.field[class*='round']:not(.border, .fill) > :is(input, textarea, select),
	.field[class*='round']:not(.border) > :is(input, textarea, select):focus {
		box-shadow: var(--elevate1);
	}
	.field[class*='round']:not(.border, .fill) > :is(input, textarea, select):focus {
		box-shadow: var(--elevate2);
	}

	.field.invalid:not(.border, [class*='round']) > :is(input, textarea, select),
	.field.invalid:not(.border, [class*='round']) > :is(input, textarea, select):focus {
		border-block-end-color: var(--error);
	}
	.field.invalid.border > :is(input, textarea, select),
	.field.invalid.border > :is(input, textarea, select):focus {
		border-color: var(--error);
	}

	.field:has(> :disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.field > :disabled {
		cursor: not-allowed;
	}

	.field > select {
		user-select: none;
		appearance: none;
		-webkit-appearance: none;
		background-image: none;
	}

	.field > :is(input, select) {
		padding-block-start: 1rem;
	}
	.field:not(.label) > :is(input, select),
	.field.border:not(.fill) > :is(input, select) {
		padding-block-start: 0;
	}
	.field > textarea {
		padding-block-start: var(--_start) !important;
	}
	.field > textarea:focus {
		padding-block-start: calc(var(--_start, 0) - 0.01rem) !important;
	}
	.field:not(.label) > textarea,
	.field.border:not(.fill) > textarea {
		padding-block-start: calc(var(--_start, 0) - 0.5rem) !important;
	}
	.field:not(.label) > textarea:focus,
	.field.border:not(.fill) > textarea:focus {
		padding-block-start: calc(var(--_start, 0) - 0.51rem) !important;
	}

	/* Floating label */
	.field.label > label {
		--_start: 1rem;
		position: absolute;
		inset: -0.5rem 0.9375rem 0 var(--_start);
		display: flex;
		block-size: calc(var(--_input, 0) + 1rem);
		line-height: calc(var(--_input, 0) + 1rem);
		font-size: 1rem;
		transition: all 0.2s;
		gap: 0.25rem;
		white-space: nowrap;
		pointer-events: none;
		color: var(--on-surface-variant);
	}

	.field.label[class*='round'] > label {
		inset: -0.5rem 1.9375rem 0 var(--_start);
	}

	/* Label lift selectors. Note the inclusion of .active + label so that
	   readonly inputs (color-field, file-field) still trigger the float when
	   the consumer sets class=active on the input. */
	.field.label.border.prefix:not(.fill)
		> :is(
			label.active,
			:focus + label,
			[placeholder]:not(:placeholder-shown) + label,
			select + label,
			input.active + label
		) {
		--_start: 1rem;
	}

	.field.label[class*='round'] > label,
	.field.label.border.prefix[class*='round']:not(.fill)
		> :is(
			label.active,
			:focus + label,
			[placeholder]:not(:placeholder-shown) + label,
			select + label,
			input.active + label
		) {
		--_start: 1.5rem;
	}

	.field.label.prefix > label {
		--_start: 3rem;
	}

	.field.label
		> :is(
			label.active,
			:focus + label,
			[placeholder]:not(:placeholder-shown) + label,
			select + label,
			input.active + label
		) {
		block-size: 2.5rem;
		line-height: 2.5rem;
		font-size: 0.75rem;
	}

	.field.label.border:not(.fill)
		> :is(
			label.active,
			:focus + label,
			[placeholder]:not(:placeholder-shown) + label,
			select + label,
			input.active + label
		) {
		block-size: 1rem;
		line-height: 1rem;
	}

	.field.label.border:not(.fill) > label::after {
		content: '';
		display: block;
		margin: 0.5rem 0 0 0;
		border-block-start: 0.0625rem solid var(--outline);
		block-size: 1rem;
		transition: none;
		flex: auto;
	}
	.field.label.border:not(.fill) > :focus + label::after,
	.field.label.border:not(.fill) > input.active + label::after {
		border-block-start: 0.125rem solid var(--primary);
	}

	.field.label.border:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border:not(.fill) > select,
	.field.label.border:not(.fill) > input.active,
	.field.label.border:not(.fill) > select.active {
		clip-path: polygon(
			-2% -2%,
			0.75rem -2%,
			0.75rem 0.5rem,
			calc(100% - 1rem) 0.5rem,
			calc(100% - 1rem) -2%,
			102% -2%,
			102% 102%,
			-2% 102%
		);
	}

	.field.label.border.prefix:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border.prefix:not(.fill) > select,
	.field.label.border.prefix:not(.fill) > input.active,
	.field.label.border.prefix:not(.fill) > select.active {
		clip-path: polygon(
			-2% -2%,
			2.5rem -2%,
			2.5rem 0.5rem,
			calc(100% - 1rem) 0.5rem,
			calc(100% - 1rem) -2%,
			102% -2%,
			102% 102%,
			-2% 102%
		);
	}

	.field.label.border[class*='round']:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border[class*='round']:not(.fill) > select,
	.field.label.border.square:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border.square:not(.fill) > select {
		clip-path: polygon(
			-2% -2%,
			1.25rem -2%,
			1.25rem 0.5rem,
			calc(100% - 2rem) 0.5rem,
			calc(100% - 2rem) -2%,
			102% -2%,
			102% 102%,
			-2% 102%
		);
	}

	.field.label.border.prefix[class*='round']:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border.prefix[class*='round']:not(.fill) > select,
	.field.label.border.prefix.square:not(.fill)
		> :is(input, textarea):is(:focus, [placeholder]:not(:placeholder-shown), .active),
	.field.label.border.prefix.square:not(.fill) > select {
		clip-path: polygon(-2% -2%, 1.25rem -2%, 1.25rem 0.5rem, calc(100% - 2rem) 0.5rem, calc(100% - 2rem) -2%, 102% -2%, 102% 102%, -2% 102%);
	}

	.field.label > :focus + label,
	.field.label > input.active + label {
		color: var(--primary);
	}

	.field.label.invalid > label,
	.field.label.invalid > label::after {
		color: var(--error) !important;
		border-color: var(--error) !important;
	}

	/* Helper / error output */
	.field > output {
		display: inline-block;
		font-size: 0.75rem;
		background: none !important;
		padding: 0.25rem 1rem;
		line-height: 1.25rem;
		align-self: start;
		color: var(--on-surface-variant);
	}
	.field > output.invalid {
		color: var(--error) !important;
	}
	.field[class*='round'] > output {
		padding: 0.25rem 1.5rem;
	}
	.field.invalid > output:not(.invalid),
	.field:not(.invalid) > output.invalid {
		display: none;
	}

	/* Footer wrapper for textarea (and other multi-line fields) that pairs
	   a helper text on the left with a character counter on the right.
	   Per M3 spec, supporting text and character counter share the footer. */
	.field > .footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0;
		min-block-size: 1.25rem;
	}
	.field > .footer > output {
		display: inline-block;
		font-size: 0.75rem;
		background: none !important;
		padding: 0.25rem 1rem;
		line-height: 1.25rem;
		align-self: center;
		color: var(--on-surface-variant);
	}
	.field > .footer > output.invalid {
		color: var(--error) !important;
	}
	.field > .footer > .counter {
		padding: 0.25rem 1rem;
		color: var(--on-surface-variant);
	}
	.field > .footer > .spacer {
		flex: 1;
	}
	.field.invalid > .footer > output:not(.invalid),
	.field:not(.invalid) > .footer > output.invalid {
		display: none;
	}
`;

export default fieldStyles;

