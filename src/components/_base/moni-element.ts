/**
 * @file components/_base/moni-element.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { LitElement } from 'lit';

/**
 * Abstract base class for every Moni UI Web Component.
 *
 * **Design philosophy — visual shells, no behavior:**
 * All Moni components are intentionally "dumb" — they encapsulate only
 * visual structure, styling, and attribute-to-DOM mapping. Consumers own
 * interaction logic, validation, async data fetching, and state management.
 * This keeps components framework-agnostic and composable with any
 * state management solution (Svelte stores, Vue reactive, vanilla JS, etc.).
 *
 * **Shadow DOM:**
 * The default `LitElement.createRenderRoot()` returns an open shadow root,
 * which is preserved here unchanged. Shadow DOM encapsulation ensures that
 * internal CSS class names (`.button`, `.field`, `.slider`, etc.) do not leak
 * into or collide with the consumer's global stylesheet.
 *
 * **Global Events Architecture:**
 * Provides base events to all components automatically:
 * - \`moni-enter-viewport\` / \`moni-leave-viewport\` via IntersectionObserver
 * - \`moni-resize\` via ResizeObserver
 * - \`slot-click\` via delegated event listener on the host
 *
 * **Extension contract:**
 * Every subclass must:
 *  1. Be decorated with `@customElement('moni-<name>')`.
 *  2. Define `static override styles = [sharedStyles, css\`...\`]`.
 *  3. Implement `override render(): TemplateResult`.
 *
 * @see {@link https://lit.dev/docs/components/overview/ Lit component overview}
 */
export class MoniElement extends LitElement {
	private _globalIntersectionObserver?: IntersectionObserver;
	private _globalResizeObserver?: ResizeObserver;
	private _isBaseInViewport = false;

	/**
	 * Returns the component's render root.
	 *
	 * Delegates to `LitElement.createRenderRoot()` which attaches an **open**
	 * shadow root (`{ mode: 'open' }`). Open mode allows external tools (browser
	 * devtools, testing frameworks) to traverse the shadow tree.
	 *
	 * @returns The shadow root that Lit will render templates into.
	 */
	protected override createRenderRoot() {
		return super.createRenderRoot();
	}

	override connectedCallback() {
		super.connectedCallback();
		
		// 1. Intersection Observer for all components (Visibility Events)
		this._globalIntersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting !== this._isBaseInViewport) {
					this._isBaseInViewport = entry.isIntersecting;
					this.dispatchEvent(new CustomEvent(
						this._isBaseInViewport ? 'moni-enter-viewport' : 'moni-leave-viewport',
						{ bubbles: true, composed: true, detail: { element: this } }
					));
				}
			});
		}, { threshold: [0, 1] });
		this._globalIntersectionObserver.observe(this);

		// 2. Resize Observer for all components (Layout Events)
		this._globalResizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				this.dispatchEvent(new CustomEvent('moni-resize', {
					bubbles: true,
					composed: true,
					detail: { contentRect: entry.contentRect, element: this }
				}));
			});
		});
		this._globalResizeObserver.observe(this);

		// 3. Global Slot Click Delegation
		this.addEventListener('click', this._handleGlobalSlotClick);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		// Rigorous memory leak prevention
		this._globalIntersectionObserver?.disconnect();
		this._globalResizeObserver?.disconnect();
		this.removeEventListener('click', this._handleGlobalSlotClick);
	}

	/**
	 * Manejador global para detectar clicks provenientes de cualquier slot de la librería
	 */
	private _handleGlobalSlotClick = (e: Event) => {
		const path = e.composedPath();
		const slotEl = path.find(node => node instanceof HTMLSlotElement) as HTMLSlotElement | undefined;
		
		if (slotEl) {
			const slotName = slotEl.name || 'default';
			this.dispatchEvent(new CustomEvent('slot-click', {
				bubbles: true,
				composed: true,
				detail: { originalEvent: e, slotName, originalTarget: e.target }
			}));
		}
	}
}

export default MoniElement;
