/**
 * @file utils/color.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * @module color
 *
 * Color utilities for generating and applying Material Design 3–compliant
 * dynamic color schemes.
 *
 * This module wraps `@material/material-color-utilities` to expose a
 * simplified, opinionated API that covers the full Moni theming pipeline:
 *
 *  1. Convert a user-supplied "seed" hex color to the HCT color space.
 *  2. Generate a complete 27-role `ColorScheme` via `SchemeTonalSpot`.
 *  3. Apply the scheme to the document root as CSS custom properties under
 *     three namespaces (`--md-sys-color-*`, `--moni-*`, and bare `--*`)
 *     so any component or stylesheet can consume the tokens.
 *
 * **Contrast levels** map to the MD3 contrast spec:
 *  - `standard` → 0.0 (WCAG AA baseline)
 *  - `medium`   → 0.5 (enhanced readability)
 *  - `high`     → 1.0 (WCAG AAA, maximum legibility)
 *
 * @see https://m3.material.io/styles/color/dynamic-color/overview
 * @see https://github.com/material-foundation/material-color-utilities
 */

import { SchemeTonalSpot, Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WCAG contrast enhancement level for a generated color scheme.
 *
 * Maps to the `contrastLevel` argument of `SchemeTonalSpot`:
 * - `'standard'` → 0.0  — WCAG AA minimum contrast. Best for everyday UIs.
 * - `'medium'`   → 0.5  — Raised contrast. Useful for users with mild low-vision.
 * - `'high'`     → 1.0  — WCAG AAA maximum contrast. Required for accessibility-first apps.
 */
export type ContrastLevel = 'standard' | 'medium' | 'high';

/**
 * Hue–Saturation–Lightness color representation.
 *
 * All values use the CSS `hsl()` convention:
 *  - `h` — hue angle in **degrees**, range [0, 360).
 *  - `s` — saturation as a **percentage**, range [0, 100].
 *  - `l` — lightness as a **percentage**, range [0, 100].
 */
export interface HSL {
	/** Hue angle in degrees [0, 360). */
	h: number;
	/** Saturation percentage [0, 100]. */
	s: number;
	/** Lightness percentage [0, 100]. */
	l: number;
}

/**
 * A complete Material Design 3 color scheme with 27 semantic color roles.
 *
 * Every role is expressed as a 7-character hex string (e.g. `'#6750a4'`).
 * The naming convention follows the MD3 spec directly:
 *  - `primary` / `onPrimary`                — main brand color and its contrast pair.
 *  - `primaryContainer` / `onPrimaryContainer` — lower-emphasis filled containers.
 *  - `secondary`, `tertiary`, `error`       — supporting accent palettes.
 *  - `surface*`                             — background hierarchy (5 tones).
 *  - `inverse*`                             — used in snackbars and tooltips.
 *  - `shadow`                               — drop-shadow tint.
 *
 * @see https://m3.material.io/styles/color/roles
 */
export interface ColorScheme {
	// ── Primary ────────────────────────────────────────────────────────────
	/** High-emphasis brand color. Used for filled buttons, FABs, active indicators. */
	primary: string;
	/** Text/icon color that guarantees contrast on top of `primary`. */
	onPrimary: string;
	/** Lower-emphasis container using the primary palette (tone 90 light / tone 30 dark). */
	primaryContainer: string;
	/** Text/icon color that guarantees contrast on top of `primaryContainer`. */
	onPrimaryContainer: string;

	// ── Secondary ──────────────────────────────────────────────────────────
	/** Complementary accent color, less prominent than primary. */
	secondary: string;
	/** Text/icon color that guarantees contrast on top of `secondary`. */
	onSecondary: string;
	/** Lower-emphasis container using the secondary palette. */
	secondaryContainer: string;
	/** Text/icon color that guarantees contrast on top of `secondaryContainer`. */
	onSecondaryContainer: string;

	// ── Tertiary ───────────────────────────────────────────────────────────
	/** Optional third accent color for decorative elements. */
	tertiary: string;
	/** Text/icon color that guarantees contrast on top of `tertiary`. */
	onTertiary: string;
	/** Lower-emphasis container using the tertiary palette. */
	tertiaryContainer: string;
	/** Text/icon color that guarantees contrast on top of `tertiaryContainer`. */
	onTertiaryContainer: string;

	// ── Error ──────────────────────────────────────────────────────────────
	/** Standard error/destructive color (red family by design). */
	error: string;
	/** Text/icon color that guarantees contrast on top of `error`. */
	onError: string;
	/** Lower-emphasis container for error states. */
	errorContainer: string;
	/** Text/icon color that guarantees contrast on top of `errorContainer`. */
	onErrorContainer: string;

	// ── Background & Surface ───────────────────────────────────────────────
	/** Page-level background (typically equivalent to `surface` in M3). */
	background: string;
	/** Default text/icon color on top of `background`. */
	onBackground: string;
	/** Base surface color used for sheets, cards, and dialogs. */
	surface: string;
	/** Default text/icon color on top of `surface`. */
	onSurface: string;
	/** Subtle variant of surface used for chips, text field backgrounds, etc. */
	surfaceVariant: string;
	/** Text/icon color that guarantees contrast on top of `surfaceVariant`. */
	onSurfaceVariant: string;

	// ── Outline ────────────────────────────────────────────────────────────
	/** Border color for fields, dividers, and outlined components. */
	outline: string;
	/** Lower-emphasis border color; used for decorative separators. */
	outlineVariant: string;

	// ── Surface Container Hierarchy (tone scale) ───────────────────────────
	/** Lightest container tone (lowest elevation). */
	surfaceContainerLowest: string;
	/** Second lightest container tone. */
	surfaceContainerLow: string;
	/** Mid-range container tone (default cards, sheets). */
	surfaceContainer: string;
	/** Second darkest container tone. */
	surfaceContainerHigh: string;
	/** Darkest container tone (highest elevation equivalent). */
	surfaceContainerHighest: string;

	// ── Inverse ────────────────────────────────────────────────────────────
	/** Inverse of `surface`; used for snackbar and tooltip backgrounds. */
	inverseSurface: string;
	/** Text/icon color that guarantees contrast on top of `inverseSurface`. */
	inverseOnSurface: string;
	/** Used for action elements (links, buttons) inside inverse surfaces. */
	inversePrimary: string;

	// ── Shadow ─────────────────────────────────────────────────────────────
	/** Color tint used as the drop-shadow color for elevation. */
	shadow: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color conversion utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a 6-digit hex color string to the HSL color model.
 *
 * Normalizes the input (strips optional `#`), parses each 8-bit RGB channel
 * into a [0, 1] float, then applies the standard RGB→HSL algorithm:
 *
 *  - Lightness  = (max + min) / 2
 *  - Saturation = delta / (2 − max − min)  if L > 0.5
 *               = delta / (max + min)       otherwise
 *  - Hue        = derived from which channel is the maximum
 *
 * When the color is achromatic (r = g = b), hue and saturation are both 0.
 *
 * @param hex - A 6-digit hex color, with or without the `#` prefix.
 *              Examples: `'#4f46e5'`, `'4f46e5'`.
 * @returns An {@link HSL} object where `h` ∈ [0, 360), `s` ∈ [0, 100], `l` ∈ [0, 100].
 *
 * @example
 * hexToHsl('#ff0000') // { h: 0,   s: 100, l: 50 }
 * hexToHsl('#ffffff') // { h: 0,   s: 0,   l: 100 }
 * hexToHsl('#4f46e5') // { h: 243, s: 73,  l: 59 }  (approx)
 */
export function hexToHsl(hex: string): HSL {
	const normalized = hex.replace('#', '');

	// Parse each 8-bit channel and normalize to [0, 1].
	const r = parseInt(normalized.substring(0, 2), 16) / 255;
	const g = parseInt(normalized.substring(2, 4), 16) / 255;
	const b = parseInt(normalized.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	// Initialize hue and saturation; they stay 0 for achromatic colors.
	let h = 0;
	let s = 0;

	// Lightness is always the midpoint between brightest and darkest channel.
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;

		// Saturation formula differs above and below the 50% lightness threshold.
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		// Hue is determined by which channel dominates.
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		// Normalize hue from a 0–6 sector index to degrees [0, 360).
		h /= 6;
	}

	return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts an HSL color to a 6-digit hex string.
 *
 * Uses the CSS Color Level 4 reference algorithm. Internally computes R, G,
 * and B via a piecewise function `f(n)` that maps chroma sector offsets to
 * individual channel values.
 *
 * @param hsl - An {@link HSL} object where `h` ∈ [0, 360), `s` ∈ [0, 100], `l` ∈ [0, 100].
 * @returns A lowercase 7-character hex string including the `#` prefix (e.g. `'#4f46e5'`).
 *
 * @example
 * hslToHex({ h: 0, s: 100, l: 50 })   // '#ff0000'
 * hslToHex({ h: 0, s: 0,   l: 100 }) // '#ffffff'
 */
export function hslToHex({ h, s, l }: HSL): string {
	// Normalize percentages to [0, 1] for the algorithm.
	s /= 100;
	l /= 100;

	/**
	 * Sector index helper. Maps the offset `n` (0, 4, 8) to a position within
	 * the 12-sector hue wheel (each sector = 30°).
	 */
	const k = (n: number) => (n + h / 30) % 12;

	/** Chroma magnitude: 0 at lightness extremes, max at L=0.5. */
	const a = s * Math.min(l, 1 - l);

	/**
	 * Per-channel computation. Returns a 2-character hex string for the
	 * channel corresponding to sector offset `n` (0=R, 8=G, 4=B).
	 */
	const f = (n: number) => {
		const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return Math.round(color * 255)
			.toString(16)
			.padStart(2, '0');
	};

	return `#${f(0)}${f(8)}${f(4)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scheme generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a complete Material Design 3 color scheme from a seed hex color.
 *
 * Uses `SchemeTonalSpot` — the standard M3 dynamic color algorithm — which
 * derives all 27 color roles from a single source hue while respecting the
 * target lightness/contrast requirements for each role.
 *
 * **Algorithm pipeline:**
 * 1. Parse `seedHex` → ARGB integer via `argbFromHex`.
 * 2. Convert ARGB → HCT (Hue–Chroma–Tone) color space.
 * 3. Construct a `SchemeTonalSpot` with the requested mode and contrast level.
 * 4. Extract each scheme role via `hexFromArgb` and build the {@link ColorScheme}.
 *
 * @param seedHex   - The source/brand color as a hex string. The `#` prefix
 *                    is optional (e.g. `'#4f46e5'` or `'4f46e5'`).
 * @param mode      - Color scheme polarity. `'light'` produces light backgrounds
 *                    with dark text; `'dark'` inverts the tone mapping.
 *                    Defaults to `'light'`.
 * @param contrast  - WCAG contrast enhancement level. Defaults to `'standard'`.
 *
 * @returns A fully populated {@link ColorScheme} where every value is a
 *          lowercase 7-character hex string (e.g. `'#6750a4'`).
 *
 * @example
 * // Generate a standard light scheme from an indigo seed.
 * const scheme = generateScheme('#4f46e5');
 * console.log(scheme.primary);           // e.g. '#5046e4'
 * console.log(scheme.primaryContainer);  // e.g. '#e9e7ff'
 *
 * @example
 * // High-contrast dark scheme.
 * const darkHC = generateScheme('#4f46e5', 'dark', 'high');
 */
export function generateScheme(
	seedHex: string,
	mode: 'light' | 'dark' = 'light',
	contrast: ContrastLevel = 'standard'
): ColorScheme {
	// Ensure the seed always has a leading '#' for argbFromHex.
	const seed = seedHex.startsWith('#') ? seedHex : `#${seedHex}`;

	// Step 1: Convert hex → ARGB integer.
	const argb = argbFromHex(seed);

	// Step 2: Convert ARGB → HCT. HCT is the perceptual color space used
	// internally by the MD3 algorithm; it preserves human color perception
	// better than RGB or HSL for palette generation.
	const hct = Hct.fromInt(argb);

	// Step 3: Map the ContrastLevel union to a numeric value expected by the SDK.
	let contrastLevel = 0.0;
	if (contrast === 'medium') {
		contrastLevel = 0.5;
	} else if (contrast === 'high') {
		contrastLevel = 1.0;
	}

	// Step 4: Build the tonal-spot scheme. isDark=true shifts every tone value
	// to keep roles readable on dark backgrounds.
	const scheme = new SchemeTonalSpot(hct, mode === 'dark', contrastLevel);

	// Step 5: Extract every color role from the scheme and convert back to hex.
	return {
		primary: hexFromArgb(scheme.primary),
		onPrimary: hexFromArgb(scheme.onPrimary),
		primaryContainer: hexFromArgb(scheme.primaryContainer),
		onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
		secondary: hexFromArgb(scheme.secondary),
		onSecondary: hexFromArgb(scheme.onSecondary),
		secondaryContainer: hexFromArgb(scheme.secondaryContainer),
		onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
		tertiary: hexFromArgb(scheme.tertiary),
		onTertiary: hexFromArgb(scheme.onTertiary),
		tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
		onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
		error: hexFromArgb(scheme.error),
		onError: hexFromArgb(scheme.onError),
		errorContainer: hexFromArgb(scheme.errorContainer),
		onErrorContainer: hexFromArgb(scheme.onErrorContainer),
		background: hexFromArgb(scheme.background),
		onBackground: hexFromArgb(scheme.onBackground),
		surface: hexFromArgb(scheme.surface),
		onSurface: hexFromArgb(scheme.onSurface),
		surfaceVariant: hexFromArgb(scheme.surfaceVariant),
		onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
		outline: hexFromArgb(scheme.outline),
		outlineVariant: hexFromArgb(scheme.outlineVariant),
		surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
		surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
		surfaceContainer: hexFromArgb(scheme.surfaceContainer),
		surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
		surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
		inverseSurface: hexFromArgb(scheme.inverseSurface),
		inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
		inversePrimary: hexFromArgb(scheme.inversePrimary),
		shadow: hexFromArgb(scheme.shadow)
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Writes a {@link ColorScheme} to the document root as CSS custom properties.
 *
 * For each color role in the scheme, **three aliases** are set on
 * `document.documentElement` so every context can consume the tokens:
 *
 * | Namespace prefix     | Example                          | Consumer              |
 * |----------------------|----------------------------------|-----------------------|
 * | `--md-sys-color-`    | `--md-sys-color-primary`         | MD3 spec / third-party|
 * | `--moni-`            | `--moni-primary`                 | Moni components       |
 * | `--` (bare)          | `--primary`                      | BeerCSS / legacy      |
 *
 * camelCase role names are converted to kebab-case automatically
 * (e.g. `primaryContainer` → `primary-container`).
 *
 * Additionally sets `data-theme="light|dark"` on `<html>` so CSS can use
 * `:root[data-theme='dark']` selectors for any additional overrides.
 *
 * **Side effects:** Mutates `doc.documentElement.style` and attributes.
 * This function should only be called in browser environments.
 *
 * @param scheme - The color scheme to apply, as produced by {@link generateScheme}.
 * @param mode   - The resolved mode (`'light'` or `'dark'`); written to `data-theme`.
 * @param doc    - The `Document` to target. Pass `document` in normal usage;
 *                 accepts a custom document for iframe or SSR scenarios.
 *
 * @example
 * const scheme = generateScheme('#4f46e5', 'dark');
 * applySchemeToDocument(scheme, 'dark', document);
 * // <html data-theme="dark" style="--md-sys-color-primary: #...; --moni-primary: #...; --primary: #...">
 */
export function applySchemeToDocument(scheme: ColorScheme, mode: 'light' | 'dark', doc: Document) {
	const root = doc.documentElement;

	// MD3 canonical namespace prefix.
	const prefix = '--md-sys-color-';

	for (const [key, value] of Object.entries(scheme)) {
		// Convert camelCase → kebab-case (e.g. 'onPrimary' → 'on-primary').
		const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

		// Set all three namespace aliases simultaneously.
		root.style.setProperty(`${prefix}${kebab}`, value); // MD3 spec namespace
		root.style.setProperty(`--moni-${kebab}`, value);  // Moni namespace
		root.style.setProperty(`--${kebab}`, value);       // Bare/BeerCSS namespace
	}

	// Mark the document with the resolved mode for CSS `[data-theme]` selectors.
	root.setAttribute('data-theme', mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the default seed color used by the Moni design system.
 *
 * The default seed is a deep indigo (`#4f46e5`) that maps to a material-spec
 * primary hue of roughly 243°. It was chosen because it:
 *  - Generates accessible contrast ratios in both light and dark modes.
 *  - Feels brand-neutral enough to serve as a placeholder before users
 *    customize their color.
 *
 * @returns The default seed hex string `'#4f46e5'`.
 */
export function getDefaultSeed(): string {
	return '#4f46e5';
}
