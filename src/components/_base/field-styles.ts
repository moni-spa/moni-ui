/**
 * @file components/_base/field-styles.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css } from 'lit';

/**
 * Shared visual rules for all field-like input components.
 *
 * This stylesheet provides the complete CSS foundation for the Moni input
 * field pattern, ported and extended from the BeerCSS field system. It is
 * consumed by: `moni-text-field`, `moni-textarea`, `moni-select`,
 * `moni-color-field`, and `moni-file-field`.
 *
 * **Required DOM structure:**
 * Each consumer must render this exact DOM hierarchy inside its shadow root for
 * all selectors (especially the floating label) to function correctly:
 *
 * ```html
 * <div class="field [label] [fill|border] [small|large|extra] [prefix|suffix|icon] [invalid] [round*]">
 *   <i class="leading-icon">...</i>         <!-- optional leading icon -->
 *   <input | select | textarea>             <!-- native form control -->
 *   <label>Label text</label>              <!-- MUST be immediately after the control -->
 *   <i class="trailing-icon">...</i>        <!-- optional trailing icon -->
 *   <span class="suffix-text">...</span>    <!-- optional suffix text -->
 *   <slot name="trailing"></slot>           <!-- optional trailing slot -->
 *   <output>Helper or error text</output>   <!-- helper / validation message -->
 * </div>
 * ```
 *
 * **Critical ordering rule:**
 * The `<label>` element MUST be the immediate next sibling of the
 * `<input|select|textarea>`. The CSS adjacent sibling combinator (`+ label`)
 * and the `:focus + label` selector depend on this ordering to animate the
 * floating label lift. Breaking the order will prevent the label from animating.
 *
 * **Modifier classes:**
 * - `.label`  — Activates the floating label behavior.
 * - `.fill`   — Uses `surface-container-highest` as the input background (filled style).
 * - `.border` — Applies an `outline-variant` border (outlined style).
 * - `.small` / `.large` / `.extra` — Adjusts height and padding.
 * - `.prefix` / `.suffix` — Shifts input padding to make room for icons.
 * - `.invalid` — Applies error color to borders, label, and helper text.
 * - `.round` / `.round-*` — Applies pill-shaped border radius to the field.
 * - `.square` — Removes all border-radius (overrides everything via `!important`).
 *
 * **Internal CSS custom properties:**
 * | Property   | Default | Description                              |
 * |------------|---------|------------------------------------------|
 * | `--_input` | `3rem`  | Height of the input area.                |
 * | `--_start` | `1.2rem`| Block-start padding for label alignment. |
 * | `--_middle`| computed| Vertical center of the input (for icons).|
 *
 * @see {@link sharedStyles}       — Token bridge consumed by this stylesheet.
 * @see {@link interactionStyles}  — State layer (not used directly in fields).
 */
export const fieldStyles = css`
	:host {
		display: block;
		/* Fields are full-width by default; the parent layout controls sizing. */
		inline-size: 100%;
	}

	/* ─── Base field container ───────────────────────────────────────────────── */
	.field {
		/* Internal height token — overridden by size modifiers (.small, .large, .extra). */
		--_input: 3rem;
		/* Vertical start offset used for textarea padding and label positioning. */
		--_start: 1.2rem;
		/* Computed vertical center — used to position absolutely-placed icons. */
		--_middle: calc(var(--_input, 0) / 2);

		/* Default field shape: bottom border only (BeerCSS / MD3 "filled" style). */
		border-radius: 0.25rem 0.25rem 0 0;
		min-block-size: var(--_input);
		display: flex;
		flex-direction: column;
		position: relative;
		inline-size: 100%;
	}

	/* ─── Shape overrides ────────────────────────────────────────────────────── */

	/* Square: removes all border-radius regardless of other modifiers.
	   Uses !important to win specificity over .border and [class*='round']. */
	.field.square,
	.field.square.border,
	.field.square[class*='round'] {
		border-radius: 0 !important;
	}
	.field.square > :is(input, textarea, select) {
		border-radius: 0 !important;
	}

	/* ─── Fill variant ───────────────────────────────────────────────────────── */
	/* Unsets background/color on the container; the background is applied
	   directly to the <input> so that the floating label overlaps it correctly. */
	.field.fill {
		--_background: var(--surface-container-highest);
		background-color: unset !important;
		color: unset !important;
	}
	.field.fill > :is(input, select, textarea) {
		background-color: var(--_background);
		/* z-index: 0 ensures the background renders above the ::before layer. */
		z-index: 0;
	}

	/* ─── Size variants ──────────────────────────────────────────────────────── */
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

	/* ─── Border (outlined) variant ─────────────────────────────────────────── */
	/* Adds full border-radius and outline-variant stroke on all four sides. */
	.field.border {
		border-radius: 0.25rem;
	}

	/* ─── Round / pill variants ──────────────────────────────────────────────── */
	/* Applied when class matches the 'round' substring (e.g. .round, .round-sm). */
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

	/* ─── Icon positioning ───────────────────────────────────────────────────── */
	/* Generic rule: absolutely positions any icon/image/svg inside the field. */
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
	/* Leading icon: explicit class wins over :first-child heuristic. */
	.field > :is(i, img, svg):first-child,
	.field > .leading-icon {
		inset: calc(var(--_middle, 0) - 0.75rem) auto auto 1rem;
	}

	/* Trailing icon: BeerCSS uses :last-child:not(:first-child) which fails when
	   an <output> follows the icon. The explicit class always wins and places
	   the icon on the right edge regardless of sibling count. */
	.field > :is(i, img, svg):last-child:not(:first-child),
	.field > .trailing-icon {
		inset: calc(var(--_middle, 0) - 0.75rem) 1rem auto auto;
		/* Prevent the inline-start override from the generic rule above. */
		inset-inline-start: auto !important;
	}

	/* Error state: trailing icons inherit the error color. */
	.field.invalid > i {
		color: var(--error);
	}

	/* ─── Native form element reset ──────────────────────────────────────────── */
	/* 'all: unset' strips browser-default styles (appearance, border, font, etc.)
	   so the field's visual design is fully controlled by Moni's CSS. */
	.field > :is(input, textarea, select) {
		all: unset;
		position: relative;
		display: block;
		box-sizing: border-box;
		border-radius: inherit;
		/* Default border is transparent; visible only in .border and focus states. */
		border: 0.0625rem solid transparent;
		padding: 0 0.9375rem;
		font-family: inherit;
		font-size: 1rem;
		min-block-size: var(--_input);
		outline: none;
		z-index: 1;
		background: none;
		resize: none; /* Textareas use field-sizing:content instead of manual resize. */
		text-align: start;
		cursor: text;
		color: var(--on-surface);
	}

	/* Ensure date/time input values align to start (browser quirk on some platforms). */
	input::-webkit-date-and-time-value {
		text-align: start;
	}

	/* Autofill: preserve text color when the browser applies its autofill highlight.
	   -webkit-background-clip + -webkit-text-fill-color override the yellow tint. */
	:is(input, select, textarea):is(:-webkit-autofill, :autofill) {
		-webkit-background-clip: text;
		-webkit-text-fill-color: var(--on-surface);
	}

	/* On focus, increase border width by 1px — shift padding inward by 1px
	   to prevent layout shift from the border width change. */
	.field > :is(input, textarea, select):focus {
		border: 0.125rem solid transparent;
		padding-inline: 0.875rem;
	}

	/* Textareas without explicit rows grow automatically using field-sizing:content.
	   A max-height of 12rem (~8 lines) prevents uncontrolled page growth. */
	.field > textarea:not([rows]) {
		field-sizing: content;
		max-block-size: 12rem;
	}

	/* ─── Transparent native picker controls ─────────────────────────────────── */
	/* File and color inputs, and date/time picker indicators are hidden so the
	   component can render its own UI. The native controls are still active for
	   accessibility (click propagates through the transparent overlay). */
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

	/* On fine-pointer (mouse) devices, push the calendar picker indicator behind
	   the field content so it doesn't interfere with other clickable elements. */
	@media (pointer: fine) {
		.field > input::-webkit-calendar-picker-indicator {
			z-index: -1 !important;
		}
	}

	/* Remove browser-native search field decorations. */
	input::-webkit-search-decoration,
	input::-webkit-search-cancel-button,
	input::-webkit-search-results-button,
	input::-webkit-search-results-decoration,
	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		display: none;
	}

	/* Remove the browser spinner on number inputs — use explicit stepper UI instead. */
	input[type='number'] {
		appearance: textfield;
	}

	/* ─── Border variant: field-level border colors ──────────────────────────── */
	.field.border > :is(input, textarea, select) {
		border-color: var(--outline);
	}
	.field.border > :is(input, textarea, select):focus {
		border-color: var(--primary);
	}

	/* Round variants add extra inline padding to clear the curved edges. */
	.field[class*='round'] > :is(input, textarea, select) {
		padding-inline: 1.4376rem;
	}
	.field[class*='round'] > :is(input, textarea, select):focus {
		padding-inline: 1.375rem;
	}

	/* ─── Icon padding accommodation ─────────────────────────────────────────── */
	/* .prefix / .suffix shift the input's inline padding to make room for icons. */
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

	/* ─── Underline (non-border, non-round) bottom border ─────────────────────── */
	/* Default M3 filled field style: only the bottom border is visible. */
	.field:not(.border, [class*='round']) > :is(input, textarea, select) {
		border-block-end-color: var(--outline);
	}
	.field:not(.border, [class*='round']) > :is(input, textarea, select):focus {
		border-block-end-color: var(--primary);
	}

	/* Round non-bordered fields get a subtle elevation shadow instead of a border. */
	.field[class*='round']:not(.border, .fill) > :is(input, textarea, select),
	.field[class*='round']:not(.border) > :is(input, textarea, select):focus {
		box-shadow: var(--elevate1);
	}
	.field[class*='round']:not(.border, .fill) > :is(input, textarea, select):focus {
		box-shadow: var(--elevate2);
	}

	/* ─── Invalid / error state borders ─────────────────────────────────────── */
	.field.invalid:not(.border, [class*='round']) > :is(input, textarea, select),
	.field.invalid:not(.border, [class*='round']) > :is(input, textarea, select):focus {
		border-block-end-color: var(--error);
	}
	.field.invalid.border > :is(input, textarea, select),
	.field.invalid.border > :is(input, textarea, select):focus {
		border-color: var(--error);
	}

	/* ─── Disabled state ─────────────────────────────────────────────────────── */
	/* Reduces opacity on the entire field container when the native control is
	   disabled, rather than applying separate rules to each child. */
	.field:has(> :disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.field > :disabled {
		cursor: not-allowed;
	}

	/* ─── Select element ─────────────────────────────────────────────────────── */
	/* Remove browser-native select appearance; the component renders its own dropdown. */
	.field > select {
		user-select: none;
		appearance: none;
		-webkit-appearance: none;
		background-image: none;
	}

	/* ─── Block-start padding for label accommodation ────────────────────────── */
	/* Inputs with a floating label need top padding to create space for the
	   label when it lifts above the input. Selects always lift their label. */
	.field > :is(input, select) {
		padding-block-start: 1rem;
	}
	/* No-label and border+fill fields: remove the top padding offset. */
	.field:not(.label) > :is(input, select),
	.field.border:not(.fill) > :is(input, select) {
		padding-block-start: 0;
	}
	/* Textareas use the --_start token to align with the label baseline. */
	.field > textarea {
		padding-block-start: var(--_start) !important;
	}
	.field > textarea:focus {
		/* 0.01rem compensates for the border width increase on focus. */
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

	/* ─── Floating label ─────────────────────────────────────────────────────── */
	/* The label starts at full font-size (1rem) vertically centered in the field.
	   On focus or when value is present, it scales down to 0.75rem and lifts
	   to the top of the field container. */
	.field.label > label {
		--_start: 1rem;
		position: absolute;
		inset: -0.5rem 0.9375rem 0 var(--_start);
		display: flex;
		/* Full height + 1rem (for label overhang) centers the label vertically. */
		block-size: calc(var(--_input, 0) + 1rem);
		line-height: calc(var(--_input, 0) + 1rem);
		font-size: 1rem;
		transition: all 0.2s;
		gap: 0.25rem;
		white-space: nowrap;
		/* The label is purely decorative from a layout perspective; it must never
		   intercept pointer events meant for the underlying input. */
		pointer-events: none;
		color: var(--on-surface-variant);
	}

	/* Round fields: label aligns with the increased inline padding. */
	.field.label[class*='round'] > label {
		inset: -0.5rem 1.9375rem 0 var(--_start);
	}

	/* ─── Label lift selector group ──────────────────────────────────────────── */
	/* The label lifts (scales down + moves up) in four conditions:
	   1. label.active     — the component sets this class directly (readonly inputs).
	   2. :focus + label   — when the native control is focused.
	   3. [placeholder]:not(:placeholder-shown) + label — when a value is present.
	   4. select + label   — selects always show their label lifted.
	   5. input.active + label — for programmatically activated inputs. */

	/* Border + prefix + no-fill variant needs a reduced --_start offset. */
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

	/* Round field label and round border prefix field label override. */
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

	/* Prefix fields: shift the label's inline-start to clear the leading icon. */
	.field.label.prefix > label {
		--_start: 3rem;
	}

	/* Lifted label: shrinks to 0.75rem and collapses to the top of the field. */
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

	/* Border variant: label collapses to 1rem height with a notch cut effect. */
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

	/* ─── Border notch (label gap in the top border) ─────────────────────────── */
	/* The ::after pseudo creates the horizontal line to the right of the lifted
	   label, visually cutting a notch into the top border of .field.border. */
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
		/* On focus, the notch line becomes primary-colored. */
		border-block-start: 0.125rem solid var(--primary);
	}

	/* ─── Border notch clipping (clip-path) ──────────────────────────────────── */
	/* When the label is lifted, a clip-path cuts a gap in the top border of the
	   input element itself, creating the appearance of the label floating within
	   the border's top edge. The clip-path dimensions account for label width. */
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

	/* Prefix variant: clip starts further right to clear the leading icon text. */
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

	/* Round and square border fields use a wider notch to clear the curved border. */
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

	/* ─── Label color changes ─────────────────────────────────────────────────── */
	/* On focus: label turns primary-colored to draw attention. */
	.field.label > :focus + label,
	.field.label > input.active + label {
		color: var(--primary);
	}

	/* On error: label and notch line turn error-colored. */
	.field.label.invalid > label,
	.field.label.invalid > label::after {
		color: var(--error) !important;
		border-color: var(--error) !important;
	}

	/* ─── Helper / error output ──────────────────────────────────────────────── */
	/* The <output> element below the field shows helper text or validation errors. */
	.field > output {
		display: inline-block;
		font-size: 0.75rem;
		background: none !important;
		padding: 0.25rem 1rem;
		line-height: 1.25rem;
		align-self: start;
		color: var(--on-surface-variant);
	}
	/* Error output overrides the neutral helper color. */
	.field > output.invalid {
		color: var(--error) !important;
	}
	/* Round fields: increase horizontal padding to align with the curved edge. */
	.field[class*='round'] > output {
		padding: 0.25rem 1.5rem;
	}
	/* Show only one output at a time: helper OR error, never both. */
	.field.invalid > output:not(.invalid),
	.field:not(.invalid) > output.invalid {
		display: none;
	}

	/* ─── Footer wrapper (textarea & multi-line fields) ───────────────────────── */
	/* Lays out helper text (left) and character counter (right) on the same row,
	   matching the M3 spec for supporting-text + character-counter pairs. */
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
	/* Character counter — right-aligned, same typographic style as the helper. */
	.field > .footer > .counter {
		padding: 0.25rem 1rem;
		color: var(--on-surface-variant);
	}
	/* Spacer pushes counter to the right when there is no helper text. */
	.field > .footer > .spacer {
		flex: 1;
	}
	/* Same exclusive show logic as direct <output> elements. */
	.field.invalid > .footer > output:not(.invalid),
	.field:not(.invalid) > .footer > output.invalid {
		display: none;
	}
`;

export default fieldStyles;
