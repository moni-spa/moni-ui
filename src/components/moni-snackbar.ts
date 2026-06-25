import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Snackbar that faithfully ports BeerCSS's `.snackbar` styles.
 *
 * BeerCSS uses `.snackbar` with `position: fixed; inset: auto auto 6rem 50%;`
 * and `.snackbar.active` / `.snackbar:popover-open` to show it.
 *
 * We use :host([active]) .snackbar with visibility/opacity/transform — same as BeerCSS.
 * The host is display:block so the fixed snackbar inside is part of the stacking context
 * of the document body (not clipped by any shadow root overflow).
 *
 * Material 3 spec (`m3-docs/components/snackbar/specs.md`): the message text
 * must truncate at **2 lines** with ellipsis when too long. The container
 * width adapts to the screen size (full width on compact, 40% on expanded).
 *
 * Attributes:
 *  - text:      message
 *  - action:    action label (visual only)
 *  - placement: bottom (default) | top
 *  - active:    present → visible
 *  - max-lines: 2 (default) | number — clamp text to N lines with ellipsis
 */
@customElement('moni-snackbar')
export class MoniSnackbar extends MoniElement {
	@property({ reflect: true }) text = '';
	@property({ reflect: true }) action = '';
	@property({ reflect: true })
	placement: 'bottom' | 'top' = 'bottom';
	@property({ type: Boolean, reflect: true }) active = false;
	/** M3 spec: clamp the message text to N lines (default 2). */
	@property({ type: Number, reflect: true, attribute: 'max-lines' })
	maxLines = 2;

	static override styles = [
		sharedStyles,
		css`
			:host {
				/* Use block instead of contents so position:fixed inside
				   works relative to the viewport (its containing block). */
				display: block;
				font-family: var(--font);
				/* Host itself takes no space */
				position: fixed;
				inset: 0;
				pointer-events: none;
				z-index: 200;
			}

			/* BeerCSS .snackbar */
			.snackbar {
				position: fixed;
				/* BeerCSS: inset: auto auto 6rem 50% for bottom placement */
				inset-block-end: 6rem;
				inset-block-start: auto;
				inset-inline: 50% auto;
				inline-size: 80%;
				block-size: auto;
				z-index: 200;
				visibility: hidden;
				display: flex;
				box-shadow: var(--elevate2);
				color: var(--inverse-on-surface);
				background-color: var(--inverse-surface);
				padding: 1rem;
				cursor: pointer;
				text-align: start;
				align-items: center;
				border-radius: 0.25rem;
				gap: 0.5rem;
				transition: all var(--speed2);
				transform: translate(-50%, 1rem);
				opacity: 0;
				pointer-events: auto;
			}

			/* BeerCSS .snackbar.top */
			.snackbar.top {
				inset-block-start: 6rem;
				inset-block-end: auto;
				transform: translate(-50%, -1rem);
			}

			/* BeerCSS .snackbar.active */
			:host([active]) .snackbar {
				visibility: visible;
				transform: translate(-50%, 0);
				opacity: 1;
			}

			.snackbar > .max {
				flex: auto;
				/* M3 spec § Message: clamp at 2 lines (configurable via
				   max-lines attribute). */
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: var(--_max-lines, 2);
				line-clamp: var(--_max-lines, 2);
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.action {
				font-weight: 500;
				text-transform: uppercase;
				font-size: 0.875rem;
				letter-spacing: 0.05em;
				color: var(--inverse-primary);
				white-space: nowrap;
			}

			@media only screen and (min-width: 993px) {
				.snackbar {
					inline-size: 40%;
				}
			}
		`
	];

	override render() {
		return html`<div
			class="snackbar ${this.placement}"
			part="snackbar"
			role="status"
			aria-live="polite"
			style="--_max-lines: ${this.maxLines}"
		>
			<slot name="icon"></slot>
			<span class="max" part="text"><slot>${this.text}</slot></span>
			${this.action
				? html`<span class="action" part="action">${this.action}</span>`
				: ''}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-snackbar': MoniSnackbar;
	}
}

export default MoniSnackbar;
