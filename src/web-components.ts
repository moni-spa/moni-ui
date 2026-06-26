/**
 * @file web-components.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * @module web-components
 *
 * Lightweight entry point that registers and exports only the Moni UI Web
 * Components, without importing any Svelte-specific utilities.
 *
 * **When to use this instead of the main `index.ts`:**
 * - In non-Svelte projects (React, Vue, vanilla JS, HTML-only) where importing
 *   `theme.svelte.ts` would introduce an unnecessary Svelte 5 dependency.
 * - When bundler tree-shaking is not sufficient to eliminate Svelte imports.
 *
 * This file has the same side-effect as the main entry: it calls
 * `customElements.define()` for every `<moni-*>` element via the
 * `./components/index.js` import.
 *
 * @example
 * ```ts
 * // In a React or Vue project:
 * import '@moni-labs/moni-ui/web-components';
 * // All <moni-*> elements are now available globally in the DOM.
 * ```
 */

// Side-effect: auto-registers every <moni-*> custom element.
import './components/index.js';

export * from './components/index.js';
