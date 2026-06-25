import { LitElement } from 'lit';

/**
 * Base class for every Moni UI Web Component.
 *
 * This class intentionally adds **no behavior**: components are visual-only
 * shells. All styling, slots, and attribute-to-DOM mapping are owned by each
 * individual element. Consumers wire up interaction, validation, async logic,
 * and state management themselves.
 *
 * The default LitElement `createRenderRoot` returns a standard open shadow
 * root, which is what we want — BeerCSS class names like `.button`, `.field`,
 * `.slider`, etc. live inside the shadow root and stay encapsulated.
 */
export class MoniElement extends LitElement {
	protected override createRenderRoot() {
		return super.createRenderRoot();
	}
}

export default MoniElement;
