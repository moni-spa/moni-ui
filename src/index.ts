/**
 * @file index.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * @module @moni-labs/moni-ui
 *
 * Main entry point for the Moni UI component library.
 *
 * **What this file does:**
 * 1. **Side-effect import** — `import './components/index.js'` triggers the
 *    auto-registration of every `<moni-*>` custom element with the browser's
 *    Custom Element registry. This must happen before any component is rendered
 *    in the DOM.
 * 2. **Re-exports** — All component classes, utilities, and TypeScript types
 *    are re-exported so consumers get a single import path:
 *
 * ```ts
 * import {
 *   MoniButton,
 *   getThemeEngine,
 *   generateScheme,
 *   type ColorScheme
 * } from '@moni-labs/moni-ui';
 * ```
 *
 * **Import strategies:**
 * - **Full bundle** (this file): imports and registers ALL components at once.
 *   Best for SPAs that use many components.
 * - **Tree-shaken per-component**: import individual files from
 *   `@moni-labs/moni-ui/components/moni-button.js` etc. to let bundlers
 *   include only what is used. Better for apps that use a small subset.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry Custom Element Registry}
 */

// ─────────────────────────────────────────────────────────────────────────────
// Auto-register all Moni UI Web Components
// ─────────────────────────────────────────────────────────────────────────────
// This import has side effects: it calls customElements.define() for every
// <moni-*> element. Bundlers must NOT tree-shake this import.
import './components/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Web Component class exports
// ─────────────────────────────────────────────────────────────────────────────
// Exporting the class enables TypeScript consumers to:
//  - Subclass components for customization.
//  - Use the class in type narrowing (instanceof MoniButton).
//  - Access static members and properties programmatically.
export {
	MoniBadge,
	MoniBottomSheet,
	MoniButton,
	MoniCheckbox,
	MoniChip,
	MoniColorField,
	MoniContextMenu,
	MoniDialog,
	MoniExpansion,
	MoniFileField,
	MoniMenu,
	MoniMenuItem,
	MoniNav,
	MoniNavItem,
	MoniProgress,
	MoniRadio,
	MoniRipple,
	MoniSelect,
	MoniSlider,
	MoniSnackbar,
	MoniStep,
	MoniStepper,
	MoniSwitch,
	MoniTab,
	MoniTabs,
	MoniTextarea,
	MoniTextField,
	MoniTimePicker,
	MoniSideSheet,
	MoniTooltip,
	MoniFab,
	MoniFabMenu,
	MoniButtonGroup,
	MoniSplitButton,
	MoniButtonSegment,
	MoniSegmentedButton,
	MoniLoadingIndicator,
	MoniMorphModal,
	MoniCarousel,
	MoniShape,
} from './components/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Theme engine singleton factory.
 * @see {@link getThemeEngine} for full documentation.
 */
export { getThemeEngine, resetThemeEngine } from './utils/theme.svelte.js';

/** TypeScript types for theme engine configuration. */
export type {
	ThemeSettings,
	ThemeMode,
	ThemeDensity,
	ThemeRadius,
	ThemeFont
} from './utils/theme.svelte.js';

/**
 * Color generation and application utilities.
 * @see utils/color.ts for full documentation.
 */
export {
	generateScheme,
	applySchemeToDocument,
	getDefaultSeed,
	hexToHsl,
	hslToHex
} from './utils/color.js';

/** TypeScript types for the color system. */
export type { ColorScheme, ContrastLevel } from './utils/color.js';
