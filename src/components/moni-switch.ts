import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Switch styled per Material Design 3 specs.
 *
 * M3 measurements (`m3-docs/components/switch/specs.md`):
 *  - Track: 52dp × 32dp, 2dp outline, full corner radius
 *  - Handle (thumb): 16dp unselected, 24dp selected, 28dp pressed
 *  - State layer: 40dp circular ripple on hover/focus/pressed
 *  - Icon (optional): 16dp on selected and/or unselected handle
 *
 * Attributes:
 *  - label:    text label (displayed to the right of the switch)
 *  - checked:  present
 *  - disabled: present
 *  - icon:     present → renders check/close icons inside the thumb
 *  - name:     forwarded to input.name
 *  - value:    forwarded to input.value
 */
@customElement('moni-switch')
export class MoniSwitch extends MoniElement {
	@property({ reflect: true }) label = '';
	@property({ type: Boolean, reflect: true }) checked = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: Boolean, reflect: true }) icon = false;
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) value = '';

	@query('input') private _input!: HTMLInputElement;

	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('checked')) this._input.checked = this.checked;
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
	}

	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
			}

			.switch {
				--_thumb: 1rem; /* 16dp unselected (M3) */
				--_track-w: 3.25rem; /* 52dp */
				--_track-h: 2rem; /* 32dp */
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
				direction: ltr;
			}

			/* Input hit area: 52dp × 32dp track */
			.switch > input {
				inline-size: var(--_track-w);
				block-size: var(--_track-h);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* Text label span */
			.switch > span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* Track */
			.switch > span::after {
				content: "";
				position: absolute;
				inset: 50% auto auto 0;
				background-color: var(--surface-container-highest);
				border: 0.125rem solid var(--outline);
				box-sizing: border-box;
				inline-size: var(--_track-w);
				block-size: var(--_track-h);
				border-radius: var(--_track-h);
				/* Shift the track to sit behind the input (input is to the left) */
				transform: translate(calc(-1 * var(--_track-w)), -50%);
				pointer-events: none;
				transition: background-color var(--speed2), border-color var(--speed2);
			}

			/* Thumb (handle) */
			.switch > span::before,
			.switch.icon > span > i {
				position: absolute;
				inset: 50% auto auto 0;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all var(--speed2);
				font-size: calc(var(--_thumb) - 0.25rem);
				user-select: none;
				min-inline-size: var(--_thumb);
				min-block-size: var(--_thumb);
				content: "";
				color: var(--on-surface-variant);
				background-color: var(--outline);
				/* Unchecked: 16dp thumb sits 2dp from track start */
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
				z-index: 2;
				pointer-events: none;
			}

			/* Icon mode uses a 24dp thumb at rest */
			.switch.icon > span > i {
				--_thumb: 1.5rem;
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
				font-family: var(--font-icon);
			}

			/* 40dp circular state layer behind the thumb on hover/focus */
			.switch > span::before,
			.switch.icon > span > i {
				box-shadow: 0 0 0 0 transparent;
			}
			.switch > input:not(:disabled):is(:focus, :hover) + span::before,
			.switch.icon > input:not(:disabled):is(:focus, :hover) + span > i {
				box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--on-surface) 8%, transparent);
			}
			.switch > input:not(:disabled):is(:focus, :hover):checked + span::before,
			.switch.icon > input:not(:disabled):is(:focus, :hover):checked + span > i {
				box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--primary) 12%, transparent);
			}

			/* Checked: track fills with primary */
			.switch > input:checked + span::after {
				border: none;
				background-color: var(--primary);
			}

			/* Checked: thumb grows to 24dp and slides right */
			.switch > input:checked + span::before {
				--_thumb: 1.5rem;
				content: "";
				color: var(--primary);
				background-color: var(--on-primary);
				transform: translate(calc(-1.75rem), -50%);
			}

			/* Checked icon mode: show check icon */
			.switch.icon > input:checked + span > i {
				content: "check";
				color: var(--primary);
				background-color: var(--on-primary);
				transform: translate(-1.75rem, -50%);
				font-family: var(--font-icon);
			}

			/* Active (pressed) states: 28dp thumb */
			.switch > input:active:not(:disabled) + span::before,
			.switch.icon > input:active:not(:disabled) + span > i {
				--_thumb: 1.75rem;
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
			}

			.switch > input:active:checked:not(:disabled) + span::before,
			.switch.icon > input:active:checked:not(:disabled) + span > i {
				--_thumb: 1.75rem;
				transform: translate(-1.625rem, -50%);
			}

			/* Icon mode: toggle visibility of close/check icons */
			.icon > input:checked + span > i:first-child,
			.icon > span > i:last-child {
				opacity: 0;
			}

			.icon > input:checked + span > i:last-child,
			.icon > span > i:first-child {
				opacity: 1;
			}

			/* Disabled */
			.switch > input:disabled + span {
				opacity: 0.5;
				cursor: not-allowed;
			}

			/* Focus outline on the track */
			.switch > :focus-visible + span::after {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.25rem;
			}
		`
	];

	override render() {
		return html`<label class=${this.icon ? 'switch icon' : 'switch'} part="switch">
			<input
				type="checkbox"
				role="switch"
				.checked=${this.checked}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				value=${ifDefined(this.value || undefined)}
				@change=${this._onChange}
			/>
			<span>
				${this.icon ? html`<i>close</i><i>check</i>` : ''}
				${this.label
					? html`<span class="label" part="label">&nbsp;${this.label}</span>`
					: html`<slot></slot>`}
			</span>
		</label>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-switch': MoniSwitch;
	}
}

export default MoniSwitch;
