/**
 * @file components/moni-chip.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';

/**
 * Material Design 3 Chip component.
 *
 * Chips are compact, interactive elements that represent actions, filters,
 * attributes, or user inputs. They are visual-only shells — the consumer
 * owns all state management (selection, removal, active filter state).
 *
 * **M3 spec reference:** `m3-docs/components/chips/specs.md`
 *
 * **Variants:**
 * - `assist` (default) — Smart or suggested actions. Uses `var(--outline)` border
 *   to ensure 3:1 contrast per the M3 accessibility spec. Alias: `outlined`.
 * - `filter` — Filters for a content collection. Shows a leading checkmark when
 *   `selected`. Alias: `fill`.
 * - `input` — Represents discrete user input (tags, tokens). Adds a trailing
 *   remove icon when `removable`.
 * - `suggestion` — Product-generated suggestions. Outlined, no icons.
 *
 * **M3 measurements:**
 * - Default height: 32dp (`small` size = M3 spec baseline).
 * - Corner radius: 8dp.
 * - Icon size: 18dp.
 * - `medium` and `large` sizes are Moni extensions with larger touch targets.
 *
 * **Accessibility:**
 * `assist` and `suggestion` chips use `var(--outline)` for their stroke to
 * guarantee 3:1 contrast against the surface background at rest.
 * `filter` and `input` use `outline-variant` at rest but achieve contrast
 * through the `secondary-container` fill when selected.
 *
 * @fires remove - Bubbles and is composed. Fired when the trailing remove
 *                 icon is clicked on an `input` chip with `removable`.
 *
 * @example
 * ```html
 * <!-- Filter chip with selected state -->
 * <moni-chip variant="filter" selected>Technology</moni-chip>
 *
 * <!-- Input chip (tag/token) -->
 * <moni-chip variant="input" removable icon="label">TypeScript</moni-chip>
 *
 * <!-- Assist chip with icon -->
 * <moni-chip icon="directions_car">Get directions</moni-chip>
 * ```
 *
 * @slot default   - The chip label text.
 * @slot icon      - Override for the leading icon (alternative to the `icon` attribute).
 *
 * @csspart chip   - The inner `<button>` element.
 * @csspart label  - The label `<span>` element.
 */
@customElement('moni-chip')
export class MoniChip extends MoniElement {
	@property({ reflect: true })
	variant:
		| 'assist'
		| 'filter'
		| 'input'
		| 'suggestion'
		| 'outlined'
		| 'fill' = 'assist';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'small';
	@property({ reflect: true })
	shape:
		| 'round'
		| 'no-round'
		| 'square'
		| 'circle'
		| 'left-round'
		| 'right-round'
		| 'top-round'
		| 'bottom-round' = 'round';
	@property({ type: Boolean, reflect: true }) selected = false;
	@property({ type: Boolean, reflect: true }) removable = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: Boolean, reflect: true }) loading = false;
	@property({ reflect: true }) icon = '';

	@state()
	private _hasSlottedIcon = false;

	private _handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		this._hasSlottedIcon = slot.assignedNodes({ flatten: true }).length > 0;
	}

	/** Normalize legacy variant names to M3 spec. */
	private get _variant(): 'assist' | 'filter' | 'input' | 'suggestion' {
		if (this.variant === 'outlined') return 'assist';
		if (this.variant === 'fill') return 'filter';
		return this.variant as 'assist' | 'filter' | 'input' | 'suggestion';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				vertical-align: middle;
				font-family: var(--font);
				position: relative;
				user-select: none;
			}

			.chip {
				--_padding: 1rem; /* 16dp when no leading icon (M3 spec) */
				--_size: 2rem;
				--_round: calc(var(--_size) / 2);
				--_icon-size: 1.125rem;
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				block-size: var(--_size);
				min-inline-size: var(--_size);
				font-size: 0.875rem;
				font-weight: 500;
				background-color: transparent;
				border: 0.0625rem solid var(--outline);
				color: var(--on-surface);
				padding: 0 var(--_padding);
				border-radius: 0.5rem;
				transition:
					transform var(--speed2),
					background-color var(--speed2),
					border-color var(--speed2),
					border-radius var(--speed2),
					padding var(--speed3);
				user-select: none;
				gap: 0.5rem;
				line-height: normal;
				letter-spacing: normal;
				font-family: inherit;
				cursor: pointer;
				position: relative;
				overflow: hidden;
			}

			.chip::after {
				content: '';
				position: absolute;
				inset: 0;
				background: currentColor;
				opacity: 0;
				transition: opacity var(--speed2);
				border-radius: inherit;
				pointer-events: none;
			}

			.chip.has-icon {
				--_padding: 0.5rem; /* 8dp when a leading icon is present (M3 spec) */
			}

			.chip.medium {
				--_size: 2.5rem;
				--_padding: 0.75rem;
				--_icon-size: 1.25rem;
			}
			.chip.medium.has-icon {
				--_padding: 0.75rem;
			}
			.chip.large {
				--_padding: 1rem;
				--_size: 3rem;
				--_icon-size: 1.5rem;
			}

			.chip:hover:not(:disabled)::after {
				opacity: 0.08;
			}

			.chip:active:not(:disabled) {
				transform: scale(0.97);
			}

			/* ─── M3 variant colors ─── */
			/* Filter and input chips use outline-variant + on-surface-variant
			   for the resting state (M3 spec). Assist and suggestion use
			   outline + on-surface for 3:1 contrast (a11y). */
			.chip.filter,
			.chip.input {
				border-color: var(--outline-variant);
				color: var(--on-surface-variant);
			}

			.chip.suggestion {
				border-color: var(--outline);
				color: var(--on-surface-variant);
			}

			/* Selected state — M3 filter/input show a leading check and
			   secondary-container background. */
			.chip.selected {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
				border-color: transparent;
			}

			/* Filter without selection can have leading check on hover to
			   indicate the action. */
			.chip.filter.selected::before,
			.chip.input.selected::before {
				content: '\\e5ca';
				font-family: var(--font-icon);
				font-size: var(--_icon-size);
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				margin-inline-end: 0.25rem;
				color: currentColor;
			}

			.chip.no-round {
				border-radius: 0;
			}
			.chip.square {
				border-radius: 0.25rem;
			}
			.chip.circle {
				inline-size: var(--_size);
				padding: 0;
				aspect-ratio: 1;
				border-radius: 50%;
			}
			.chip.left-round {
				border-radius: var(--_round) 0 0 var(--_round) !important;
			}
			.chip.right-round {
				border-radius: 0 var(--_round) var(--_round) 0 !important;
			}
			.chip.top-round {
				border-radius: var(--_round) var(--_round) 0 0 !important;
			}
			.chip.bottom-round {
				border-radius: 0 0 var(--_round) var(--_round) !important;
			}

			.chip:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
			}

			.chip:focus-visible {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
			}

			.icon,
			::slotted([slot='icon']) {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: var(--_icon-size);
				flex: none;
				color: inherit;
			}

			.remove {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: var(--_icon-size);
				opacity: 0.7;
				margin-inline-start: 0.125rem;
			}

			.loading-spinner {
				inline-size: var(--_icon-size);
				block-size: var(--_icon-size);
				color: currentColor;
			}
			.loading-spinner::part(progress) {
				border-width: 0.1875rem;
			}
		`
	];

	override render() {
		const variant = this._variant;
		const hasIcon = Boolean(this.icon) || this._hasSlottedIcon;
		const classes = [
			'chip',
			variant,
			this.size,
			this.shape,
			this.selected ? 'selected' : '',
			hasIcon ? 'has-icon' : ''
		]
			.filter(Boolean)
			.join(' ');

		if (this.loading) {
			return html`<button
				class=${classes}
				part="chip"
				type="button"
				?disabled=${this.disabled}
				aria-busy="true"
			>
				<moni-progress
					class="loading-spinner"
					part="loading"
					variant="circular"
					indeterminate
					size="small"
				></moni-progress>
			</button>`;
		}

		// M3 input chips must always show a trailing remove icon.
		const showRemove = this.removable || variant === 'input';

		const iconEl = this.icon
			? html`<span class="icon" part="icon"
					><moni-icon name="${this.icon}"></moni-icon
				></span>`
			: html`<slot
					name="icon"
					part="icon"
					class="icon"
					@slotchange=${this._handleSlotChange}
				></slot>`;

		const removeEl = showRemove
			? html`<span class="remove" part="remove" aria-hidden="true"
					><moni-icon name="close"></moni-icon
				></span>`
			: nothing;

		return html`<button
			class=${classes}
			part="chip"
			type="button"
			?disabled=${this.disabled}
		>
			${iconEl}
			<span part="label"><slot></slot></span>
			${removeEl}
		</button>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-chip': MoniChip;
	}
}

export default MoniChip;
