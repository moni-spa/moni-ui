import { css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

export type MoniFabSize = 'small' | 'medium' | 'large';
export type MoniFabColor = 'primary' | 'secondary' | 'tertiary' | 'surface';
export type MoniFabPosition = '' | 'bottom-trailing' | 'bottom-leading' | 'top-trailing' | 'top-leading';

/** Material 3 Expressive floating action button. */
@customElement('moni-fab')
export class MoniFab extends MoniElement {
	@property({ reflect: true }) size: MoniFabSize = 'medium';
	@property({ reflect: true }) color: MoniFabColor = 'primary';
	@property({ reflect: true }) shape: 'rounded' | 'circle' = 'rounded';
	@property({ type: Boolean, reflect: true }) extended = false;
	@property({ type: Boolean, reflect: true }) expanded = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) icon = 'add';
	@property({ reflect: true }) label = '';
	@property({ reflect: true, attribute: 'aria-label' }) accessibleLabel = '';
	@property({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) position: MoniFabPosition = '';

	@query('button') private _button!: HTMLButtonElement;

	override focus(options?: FocusOptions) {
		this._button?.focus(options);
	}

	static override styles = [sharedStyles, css`
		:host {
			--_size: 3.5rem;
			--_radius: 1rem;
			--_pressed-radius: 1.75rem;
			--_icon-size: 1.5rem;
			--_padding: 1rem;
			--_container: var(--primary-container);
			--_content: var(--on-primary-container);
			display: inline-flex;
			position: relative;
			vertical-align: middle;
		}
		:host([size='small']) {
			--_size: 2.5rem;
			--_radius: .75rem;
			--_pressed-radius: 1.25rem;
			--_icon-size: 1.25rem;
			--_padding: .75rem;
		}
		:host([size='large']) {
			--_size: 6rem;
			--_radius: 1.75rem;
			--_pressed-radius: 3rem;
			--_icon-size: 2.25rem;
			--_padding: 1.875rem;
		}
		:host([color='secondary']) { --_container: var(--secondary-container); --_content: var(--on-secondary-container); }
		:host([color='tertiary']) { --_container: var(--tertiary-container); --_content: var(--on-tertiary-container); }
		:host([color='surface']) { --_container: var(--surface-container-high); --_content: var(--primary); }

		:host([position='bottom-trailing']), :host([position='bottom-leading']),
		:host([position='top-trailing']), :host([position='top-leading']) {
			position: fixed;
			z-index: 13;
		}
		:host([position='bottom-trailing']) { inset: auto max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) auto; }
		:host([position='bottom-leading']) { inset: auto auto max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left)); }
		:host([position='top-trailing']) { inset: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) auto auto; }
		:host([position='top-leading']) { inset: max(1rem, env(safe-area-inset-top)) auto auto max(1rem, env(safe-area-inset-left)); }

		button {
			all: unset;
			box-sizing: border-box;
			isolation: isolate;
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: .75rem;
			block-size: var(--_size);
			min-inline-size: var(--_size);
			padding-inline: var(--_padding);
			border-radius: var(--_radius);
			background: var(--_container);
			color: var(--_content);
			box-shadow: var(--elevate2);
			cursor: pointer;
			font: 500 .875rem/1.25rem var(--font);
			letter-spacing: .00625rem;
			transition: border-radius 300ms cubic-bezier(.2,0,0,1), box-shadow 200ms ease, transform 200ms cubic-bezier(.2,0,0,1);
			overflow: hidden;
		}
		button::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background: currentColor;
			opacity: 0;
			transition: opacity 150ms ease;
		}
		button:hover::before { opacity: .08; }
		button:focus-visible::before { opacity: .1; }
		button:active::before { opacity: .12; }
		button:hover { box-shadow: var(--elevate3); }
		button:active { border-radius: var(--_pressed-radius); transform: scale(.96); box-shadow: var(--elevate1); }
		button:focus-visible { outline: .1875rem solid var(--_content); outline-offset: .1875rem; }
		button:disabled { opacity: .38; cursor: default; box-shadow: none; }
		button:disabled::before { display: none; }

		button.icon-only { inline-size: var(--_size); padding: 0; }
		:host([shape='circle']) button { border-radius: 50%; }
		:host([shape='circle']) button:active { border-radius: 35%; }
		.icon { inline-size: var(--_icon-size); block-size: var(--_icon-size); flex: none; display: grid; place-items: center; }
		moni-icon { --moni-icon-size: var(--_icon-size); font-size: var(--_icon-size); }
		.label { white-space: nowrap; overflow: hidden; }
		::slotted(*) { color: inherit; }

		@media (prefers-reduced-motion: reduce) { button { transition-duration: .01ms; } }
	`];

	override render() {
		const showLabel = Boolean(this.label) && this.shape !== 'circle';
		const ariaLabel = this.accessibleLabel || this.label || this.icon || 'Acción';
		return html`<button
			part="button fab"
			class=${showLabel ? 'extended' : 'icon-only'}
			type=${this.type}
			name=${ifDefined(this.name || undefined)}
			value=${ifDefined(this.value || undefined)}
			aria-label=${ariaLabel}
			?disabled=${this.disabled}
		>
			${this.icon ? html`<span class="icon" part="icon"><moni-icon name=${this.icon}></moni-icon></span>` : nothing}
			${showLabel ? html`<span class="label" part="label">${this.label}</span>` : nothing}
			<slot></slot>
		</button>`;
	}
}

declare global { interface HTMLElementTagNameMap { 'moni-fab': MoniFab; } }
export default MoniFab;
