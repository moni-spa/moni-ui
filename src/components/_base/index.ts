/**
 * @file components/_base/index.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * @module _base
 *
 * Re-exports the foundational building blocks shared by all Moni Web Components.
 *
 * **Exports:**
 * - {@link MoniElement}     — Abstract LitElement base class every component extends.
 * - {@link sharedStyles}    — Baseline CSS: box-sizing, token bridge, utility classes.
 * - {@link fieldStyles}     — CSS for field-like input components (text-field, select, etc.).
 *
 * `interactionStyles` is intentionally **not** re-exported from this barrel —
 * it should be imported directly by components that need state layers to avoid
 * adding its CSS to components that don't use `.interactive`.
 *
 * @example
 * ```ts
 * import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
 * ```
 */

export { MoniElement } from './moni-element.js';
export { sharedStyles } from './shared-styles.js';
export { fieldStyles } from './field-styles.js';
