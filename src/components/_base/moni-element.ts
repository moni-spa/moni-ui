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
 * **Extension contract:**
 * Every subclass must:
 *  1. Be decorated with `@customElement('moni-<name>')`.
 *  2. Define `static override styles = [sharedStyles, css`...`]`.
 *  3. Implement `override render(): TemplateResult`.
 *
 * Subclasses MUST NOT add behavior (event handling, timers, fetch calls) that
 * is not directly related to rendering the shadow DOM. See CONTRIBUTING.md
 * for the full component authoring guide.
 *
 * @see {@link https://lit.dev/docs/components/overview/ Lit component overview}
 */
export class MoniElement extends LitElement {
	/**
	 * Returns the component's render root.
	 *
	 * Delegates to `LitElement.createRenderRoot()` which attaches an **open**
	 * shadow root (`{ mode: 'open' }`). Open mode allows external tools (browser
	 * devtools, testing frameworks) to traverse the shadow tree.
	 *
	 * This override exists explicitly to document the shadow root mode and to
	 * provide a hook for subclasses that may need to change the root in the future
	 * (e.g. to support `adoptedStyleSheets` in a specific environment).
	 *
	 * @returns The shadow root that Lit will render templates into.
	 */
	protected override createRenderRoot() {
		return super.createRenderRoot();
	}
}

export default MoniElement;
