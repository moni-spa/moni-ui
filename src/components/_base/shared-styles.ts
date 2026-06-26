/**
 * @file components/_base/shared-styles.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css } from 'lit';

/**
 * Baseline CSS injected into the shadow root of **every** Moni Web Component.
 *
 * This stylesheet is the foundational layer of the Moni design system. It serves
 * four distinct responsibilities:
 *
 * **1. Box-sizing reset**
 * Applies `box-sizing: border-box` to `:host`, all descendants, and slotted
 * elements so every component has predictable sizing without override surprises.
 *
 * **2. CSS custom property bridge (Token namespace)**
 * The component library uses short "bare" variable names internally (e.g.
 * `var(--primary)`) for concise CSS. Because shadow DOM isolates custom
 * properties by default, this sheet creates a bridge that resolves these
 * internal names from the global token namespaces in the following priority:
 *
 *   `--moni-*` (Moni namespace) → `--md-sys-color-*` (MD3 spec) → hardcoded M3 default
 *
 * This lets a host document use any of the three namespaces to theme components.
 *
 * **3. MD3 `--color-*` aliases**
 * A second `:host` block maps the older `--color-<role>` prefix to the primary
 * bare tokens. These aliases ensure backward compatibility with Moni apps
 * (MoniAuth-Client, MoniAuth-Yo) that still reference `--color-primary`, etc.
 *
 * **4. Utility classes**
 * Provides `.truncate` (single-line text clipping) and `.visually-hidden`
 * (screen-reader-only content) for use inside component shadow trees.
 *
 * **Usage:**
 * ```ts
 * static override styles = [sharedStyles, css`/* component-specific styles *\/`];
 * ```
 *
 * @see {@link fieldStyles}       — Additional styles for input field components.
 * @see {@link interactionStyles} — M3 state layer system for interactive elements.
 */
export const sharedStyles = css`
	/* ─── 1. Box-sizing reset ─────────────────────────────────────────────── */
	:host {
		box-sizing: border-box;
		font-family: var(--font);
		font-style: normal;
		position: relative;
		color: var(--on-surface);
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
		font-style: normal;
	}

	::slotted(*) {
		font-style: normal;
	}

	/* ─── 2. CSS custom property bridge ──────────────────────────────────── */
	/* Each token resolves in order: Moni namespace → MD3 spec → M3 default.   */
	:host {
		/* ─── Primary palette ─── */
		--primary: var(--moni-primary, var(--md-sys-color-primary, #6750A4));
		--on-primary: var(--moni-on-primary, var(--md-sys-color-on-primary, #ffffff));
		--primary-container: var(--moni-primary-container, var(--md-sys-color-primary-container, #eaddff));
		--on-primary-container: var(--moni-on-primary-container, var(--md-sys-color-on-primary-container, #21005d));

		/* ─── Secondary palette ─── */
		--secondary: var(--moni-secondary, var(--md-sys-color-secondary, #625b71));
		--on-secondary: var(--moni-on-secondary, var(--md-sys-color-on-secondary, #ffffff));
		--secondary-container: var(--moni-secondary-container, var(--md-sys-color-secondary-container, #e8def8));
		--on-secondary-container: var(--moni-on-secondary-container, var(--md-sys-color-on-secondary-container, #1d192b));

		/* ─── Tertiary palette ─── */
		--tertiary: var(--moni-tertiary, var(--md-sys-color-tertiary, #7d5260));
		--on-tertiary: var(--moni-on-tertiary, var(--md-sys-color-on-tertiary, #ffffff));
		--tertiary-container: var(--moni-tertiary-container, var(--md-sys-color-tertiary-container, #ffd8e4));
		--on-tertiary-container: var(--moni-on-tertiary-container, var(--md-sys-color-on-tertiary-container, #31111d));

		/* ─── Error palette ─── */
		--error: var(--moni-error, var(--md-sys-color-error, #b3261e));
		--on-error: var(--moni-on-error, var(--md-sys-color-on-error, #ffffff));
		--error-container: var(--moni-error-container, var(--md-sys-color-error-container, #f9dedc));
		--on-error-container: var(--moni-on-error-container, var(--md-sys-color-on-error-container, #410e0b));

		/* ─── Background & surface ─── */
		--background: var(--moni-background, var(--md-sys-color-background, #fef7ff));
		--on-background: var(--moni-on-background, var(--md-sys-color-on-background, #1d1b20));
		--surface: var(--moni-surface, var(--md-sys-color-surface, #fef7ff));
		--on-surface: var(--moni-on-surface, var(--md-sys-color-on-surface, #1d1b20));
		--surface-variant: var(--moni-surface-variant, var(--md-sys-color-surface-variant, #e7e0ec));
		--on-surface-variant: var(--moni-on-surface-variant, var(--md-sys-color-on-surface-variant, #49454f));

		/* ─── Outline ─── */
		--outline: var(--moni-outline, var(--md-sys-color-outline, #79747e));
		--outline-variant: var(--moni-outline-variant, var(--md-sys-color-outline-variant, #cac4d0));

		/* ─── Surface container hierarchy (5-level elevation tones) ─── */
		--surface-container-lowest: var(--moni-surface-container-lowest, var(--md-sys-color-surface-container-lowest, #ffffff));
		--surface-container-low: var(--moni-surface-container-low, var(--md-sys-color-surface-container-low, #f7f2fa));
		--surface-container: var(--moni-surface-container, var(--md-sys-color-surface-container, #f3edf7));
		--surface-container-high: var(--moni-surface-container-high, var(--md-sys-color-surface-container-high, #ece6f0));
		--surface-container-highest: var(--moni-surface-container-highest, var(--md-sys-color-surface-container-highest, #e6e1e5));

		/* ─── Inverse surfaces (snackbar, tooltip) ─── */
		--inverse-surface: var(--moni-inverse-surface, var(--md-sys-color-inverse-surface, #313033));
		--inverse-on-surface: var(--moni-inverse-on-surface, var(--md-sys-color-inverse-on-surface, #f4f0f4));
		--inverse-primary: var(--moni-inverse-primary, var(--md-sys-color-inverse-primary, #d0bcff));

		/* ─── Structural / non-color tokens ─── */
		/* Scrim overlay used in modals, bottom sheets, dialogs. */
		--shadow: 0 0 0 0 transparent;
		--scrim: rgb(0 0 0 / 0.5);
		/* State layer color for hover/pressed overlays. */
		--active: color-mix(in srgb, currentColor 10%, transparent);
		--overlay: rgb(0 0 0 / 0.5);
		--image: linear-gradient(currentColor 0 0);

		/* ─── Typography tokens ─── */
		--font: var(--moni-font-sans, 'Geist', system-ui, -apple-system, sans-serif);
		--font-title: var(
			--moni-font-title,
			'Instrument Serif',
			Georgia,
			serif
		);
		--font-mono: 'Geist Mono', 'Fira Code', monospace;
		/* Icon font: override via --font-icon-override to use a different icon set. */
		--font-icon: var(--font-icon-override, 'Material Symbols Rounded');

		/* ─── Elevation shadows (MD3 tonal levels 1–3) ─── */
		--elevate1: 0 0.125rem 0.125rem 0 rgb(0 0 0 / 0.32);
		--elevate2: 0 0.25rem 0.5rem 0 rgb(0 0 0 / 0.4);
		--elevate3: 0 0.375rem 0.75rem 0 rgb(0 0 0 / 0.48);

		/* ─── Transition speed scale ─── */
		/* speed1 = fastest micro-interactions; speed4 = slowest page transitions. */
		--speed1: 100ms;
		--speed2: 200ms;
		--speed3: 300ms;
		--speed4: 400ms;
	}

	/* ─── 3. MD3 --color-* backward-compatibility aliases ─────────────── */
	/* These map the older --color-<role> naming convention used in legacy     */
	/* Moni apps to the primary bare tokens above. Do not remove.              */
	:host {
		--color-primary: var(--primary);
		--color-on-primary: var(--on-primary);
		--color-primary-container: var(--primary-container);
		--color-on-primary-container: var(--on-primary-container);

		--color-secondary: var(--secondary);
		--color-on-secondary: var(--on-secondary);
		--color-secondary-container: var(--secondary-container);
		--color-on-secondary-container: var(--on-secondary-container);

		--color-tertiary: var(--tertiary);
		--color-on-tertiary: var(--on-tertiary);
		--color-tertiary-container: var(--tertiary-container);
		--color-on-tertiary-container: var(--on-tertiary-container);

		--color-error: var(--error);
		--color-on-error: var(--on-error);
		--color-error-container: var(--error-container);
		--color-on-error-container: var(--on-error-container);

		--color-background: var(--background);
		--color-on-background: var(--on-background);
		--color-surface: var(--surface);
		--color-on-surface: var(--on-surface);
		--color-surface-variant: var(--surface-variant);
		--color-on-surface-variant: var(--on-surface-variant);

		--color-outline: var(--outline);
		--color-outline-variant: var(--outline-variant);

		--color-surface-container-lowest: var(--surface-container-lowest);
		--color-surface-container-low: var(--surface-container-low);
		--color-surface-container: var(--surface-container);
		--color-surface-container-high: var(--surface-container-high);
		--color-surface-container-highest: var(--surface-container-highest);

		--color-inverse-surface: var(--inverse-surface);
		--color-inverse-on-surface: var(--inverse-on-surface);
		--color-inverse-primary: var(--inverse-primary);

		/* Named aliases for tokens defined in the legacy tokens.css stylesheet. */
		--font-sans: var(--font);
		--shadow-1: var(--elevate1);
		--shadow-2: var(--elevate2);
		--shadow-3: var(--elevate3);
		--radius-sm: 0.5rem;
		--radius-md: 0.75rem;
		--radius-lg: 1.5rem;
		--ease-standard: cubic-bezier(0.2, 0, 0, 1);
		--ease-emphasized: cubic-bezier(0.3, 0, 0, 1);
		--duration-fast: 150ms;
		--duration-normal: 250ms;
	}

	/* ─── 4. Utility classes ─────────────────────────────────────────────── */

	/**
	 * Clamps text to a single line with an ellipsis when overflow occurs.
	 * Apply to any element inside a shadow root where text needs to be truncated.
	 */
	.truncate {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/**
	 * Visually hides an element while keeping it accessible to screen readers
	 * and maintaining its position in the DOM and tab order.
	 * Use for labeling icon-only buttons, skip links, etc.
	 */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
`;

export default sharedStyles;
