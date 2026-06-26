/**
 * @file utils/theme.svelte.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * @module theme
 *
 * Reactive theme engine for the Moni design system.
 *
 * `ThemeEngine` is the single source of truth for all visual customization
 * options exposed to users: color seed, light/dark mode, contrast, density,
 * border radius, typography, and motion reduction.
 *
 * **Architecture:**
 * - The engine is a **singleton** accessed via {@link getThemeEngine}. This
 *   ensures that all app-level components share the same reactive state.
 * - Settings are persisted to `localStorage` under {@link STORAGE_KEY} so
 *   they survive page reloads.
 * - The class uses Svelte 5 `$state` runes for reactivity. Consumers in
 *   Svelte components can read `engine.resolvedMode` or `engine.scheme`
 *   reactively without any additional subscription setup.
 * - In SSR or non-browser environments, all DOM-side effects are skipped
 *   gracefully via `typeof window === 'undefined'` / `typeof document === 'undefined'` guards.
 *
 * **CSS custom properties set by {@link ThemeEngine.apply}:**
 * - `--moni-spacing-density` — numeric multiplier (e.g. 0.75, 1.0, 1.25, 1.6)
 * - `--moni-radius-base`     — border-radius base value (e.g. `'0px'`, `'12px'`, `'20px'`)
 * - `--moni-font-sans`       — font-family stack for body text
 * - `--moni-font-title`      — font-family stack for headings
 * - `--moni-grain-opacity`   — CSS opacity for the texture overlay (0–1)
 * - `moni-reduce-motion`     — class toggled on `<html>` when reduce-motion is active
 *
 * @example
 * ```ts
 * // In a Svelte component or framework-agnostic module:
 * import { getThemeEngine } from '@moni-labs/moni-ui';
 *
 * const theme = getThemeEngine();
 * theme.setSeedColor('#4f46e5');
 * theme.setMode('dark');
 * ```
 */

import { generateScheme, applySchemeToDocument, getDefaultSeed, type ColorScheme, type ContrastLevel } from './color.js';

// ─────────────────────────────────────────────────────────────────────────────
// Public type aliases
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Color scheme polarity / light-dark preference.
 *
 * - `'light'`  — Always apply the light palette regardless of OS setting.
 * - `'dark'`   — Always apply the dark palette regardless of OS setting.
 * - `'system'` — Follow `prefers-color-scheme` media query. Updates
 *                automatically when the user changes their OS preference.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Spacing density scale.
 *
 * Controls the `--moni-spacing-density` custom property, which scales padding,
 * gap, and height values throughout the component library.
 *
 * | Value         | Multiplier | Use case                               |
 * |---------------|------------|----------------------------------------|
 * | `'compact'`   | 0.75       | Dense data tables, admin dashboards    |
 * | `'default'`   | 1.0        | Standard consumer UIs                  |
 * | `'comfortable'`| 1.25      | Touch-friendly interfaces              |
 * | `'spacious'`  | 1.6        | Large-display / presentation screens   |
 */
export type ThemeDensity = 'compact' | 'default' | 'comfortable' | 'spacious';

/**
 * Global border-radius style.
 *
 * Sets the `--moni-radius-base` custom property used as the base radius for
 * cards, dialogs, sheets, and other container elements.
 *
 * - `'sharp'`   → `0px`  — No rounding; geometric aesthetic.
 * - `'default'` → `12px` — Moderate rounding per M3 spec (medium shape).
 * - `'rounded'` → `20px` — Expressive full-curve shapes; default for Moni brand.
 */
export type ThemeRadius = 'sharp' | 'default' | 'rounded';

/**
 * Available typeface families for body and title text.
 *
 * Each value maps to a specific font-family stack in {@link fontFamily}.
 *
 * - `'geist'`      — Geist (Vercel), system-ui fallback. Default body font.
 * - `'inter'`      — Inter, system-ui fallback. Classic UI sans-serif.
 * - `'roboto'`     — Roboto, system-ui fallback. Material Design reference font.
 * - `'instrument'` — Instrument Serif, Georgia fallback. Editorial serif for titles.
 */
export type ThemeFont = 'geist' | 'inter' | 'roboto' | 'instrument';

// ─────────────────────────────────────────────────────────────────────────────
// Settings interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Complete snapshot of all user-configurable theme preferences.
 *
 * This interface is serialized to JSON and stored in `localStorage`. Adding
 * new optional fields is backward-compatible; the {@link parseSettings}
 * function merges with {@link defaults} to fill any missing keys.
 */
export interface ThemeSettings {
	/** Light/dark/system color scheme preference. */
	mode: ThemeMode;
	/** Seed hex color used to generate the full color scheme. */
	seedColor: string;
	/** WCAG contrast enhancement level for generated colors. */
	contrast: ContrastLevel;
	/** Component spacing density multiplier. */
	density: ThemeDensity;
	/** Global border-radius style for containers. */
	radius: ThemeRadius;
	/** Typeface for body and UI text. */
	font: ThemeFont;
	/** Typeface for display, headline, and title text. */
	titleFont: ThemeFont;
	/** Opacity of the film-grain texture overlay (0–1). `0` disables the grain. */
	grainOpacity: number;
	/** When `true`, disables non-essential CSS transitions and animations. */
	reduceMotion: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `localStorage` key under which theme settings are persisted.
 *
 * The `v1` suffix allows future breaking changes to use a new key (e.g.
 * `moni-theme-settings-v2`) without conflicting with stale stored values.
 */
const STORAGE_KEY = 'moni-theme-settings-v1';

/**
 * Factory default values for all {@link ThemeSettings} fields.
 *
 * Applied when no stored settings exist or when {@link ThemeEngine.reset} is called.
 */
const defaults: ThemeSettings = {
	mode: 'system',
	seedColor: getDefaultSeed(),
	contrast: 'standard',
	density: 'default',
	radius: 'rounded',
	font: 'geist',
	titleFont: 'instrument',
	grainOpacity: 0.03,
	reduceMotion: false
};

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a raw JSON string from `localStorage` into a {@link ThemeSettings} object.
 *
 * Unknown or missing keys are filled in from {@link defaults}, making this
 * function safe to call after schema additions (forward-compatible reads).
 * Malformed JSON falls back to defaults silently rather than throwing.
 *
 * @param raw - The raw string from `localStorage.getItem(STORAGE_KEY)`,
 *              or `null` if the key was not present.
 * @returns A fully populated `ThemeSettings` object.
 */
function parseSettings(raw: string | null): ThemeSettings {
	if (!raw) return { ...defaults };
	try {
		const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
		// Merge: stored values override defaults; missing keys fall back to defaults.
		return { ...defaults, ...parsed };
	} catch {
		// JSON.parse failed (corrupted storage). Fall back to defaults.
		return { ...defaults };
	}
}

/**
 * Resolves the effective light/dark mode based on the OS media query.
 *
 * Safe to call in SSR — returns `'light'` when `window` is not available,
 * which is the least disruptive default for server-rendered HTML.
 *
 * @returns `'dark'` if the user's OS prefers dark mode, otherwise `'light'`.
 */
function getSystemMode(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Maps a {@link ThemeDensity} token to its numeric multiplier.
 *
 * The returned value is written to `--moni-spacing-density`. Components that
 * support density scaling multiply their base spacing by this factor.
 *
 * @param density - The density label to resolve.
 * @returns A numeric multiplier: `0.75` | `1.0` | `1.25` | `1.6`.
 */
function densityValue(density: ThemeDensity): number {
	switch (density) {
		case 'compact':
			return 0.75;
		case 'comfortable':
			return 1.25;
		case 'spacious':
			return 1.6;
		default:
			return 1;
	}
}

/**
 * Maps a {@link ThemeRadius} token to a CSS length value.
 *
 * The returned string is written to `--moni-radius-base` and is consumed by
 * component styles that derive their border-radius from this token.
 *
 * @param radius - The radius label to resolve.
 * @returns A CSS length string: `'0px'` | `'12px'` | `'20px'`.
 */
function radiusValue(radius: ThemeRadius): string {
	switch (radius) {
		case 'sharp':
			return '0px';
		case 'rounded':
			return '20px';
		default:
			return '12px';
	}
}

/**
 * Maps a {@link ThemeFont} token to a CSS `font-family` stack string.
 *
 * The stacks follow the pattern `'Primary Font', system-ui fallback` to
 * ensure graceful degradation when the primary font is not loaded.
 *
 * @param font - The font label to resolve.
 * @returns A CSS `font-family` value string ready to pass to `setProperty`.
 */
function fontFamily(font: ThemeFont): string {
	switch (font) {
		case 'inter':
			return "'Inter', system-ui, sans-serif";
		case 'roboto':
			return "'Roboto', system-ui, sans-serif";
		case 'instrument':
			return "'Instrument Serif', Georgia, serif";
		default:
			// 'geist' is the Moni brand default.
			return "'Geist', system-ui, sans-serif";
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// ThemeEngine class
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reactive singleton that orchestrates the full Moni visual theme.
 *
 * `ThemeEngine` is responsible for:
 *  1. Loading persisted settings from `localStorage` on construction.
 *  2. Listening to OS `prefers-color-scheme` changes when mode is `'system'`.
 *  3. Generating the full 27-role `ColorScheme` from the current seed color.
 *  4. Writing all CSS custom properties to the document root.
 *  5. Persisting settings to `localStorage` on every user-initiated change.
 *
 * **Reactivity:** Public fields `settings`, `resolvedMode`, and `scheme` are
 * Svelte 5 `$state` runes. Any Svelte template reading these fields will
 * automatically re-render when they change.
 *
 * **Singleton pattern:** Do not instantiate this class directly. Always use
 * {@link getThemeEngine}, which returns a module-level singleton and ensures
 * exactly one engine exists per page lifecycle.
 *
 * **SSR compatibility:** The constructor is safe to call in a server context —
 * all DOM/window access is guarded and skipped when unavailable.
 *
 * @example
 * ```ts
 * import { getThemeEngine } from '@moni-labs/moni-ui';
 *
 * const theme = getThemeEngine();
 *
 * // Change the seed color — triggers scheme regeneration and DOM update.
 * theme.setSeedColor('#e91e63');
 *
 * // Read the current resolved scheme in a framework-agnostic way.
 * console.log(theme.scheme.primary);
 *
 * // Reset to factory defaults.
 * theme.reset();
 * ```
 */
export class ThemeEngine {
	/**
	 * The complete set of current user preferences.
	 *
	 * Mutate via the setter methods (e.g. `setMode`, `setSeedColor`) rather
	 * than directly, to ensure DOM updates and persistence are triggered.
	 */
	settings = $state<ThemeSettings>({ ...defaults });

	/**
	 * The resolved light/dark mode after applying the `'system'` logic.
	 *
	 * Always either `'light'` or `'dark'` — never `'system'`. Use this value
	 * for icon toggling, conditional rendering, and `aria-*` attributes.
	 */
	resolvedMode = $state<'light' | 'dark'>('light');

	/**
	 * The currently active 27-role color scheme, derived from `settings.seedColor`,
	 * `resolvedMode`, and `settings.contrast`.
	 *
	 * Reactive: re-assigned every time {@link apply} runs.
	 */
	scheme = $state<ColorScheme>(generateScheme(defaults.seedColor, 'light', defaults.contrast));

	/**
	 * The OS `prefers-color-scheme` media query list.
	 * Used to listen for system-level dark mode changes when mode is `'system'`.
	 * `null` in SSR or when `window` is unavailable.
	 */
	private mediaQuery: MediaQueryList | null = null;

	/**
	 * Guard flag to prevent attaching duplicate `'change'` listeners to
	 * {@link mediaQuery} if `bindSystem` is called more than once.
	 */
	private bound = false;

	/**
	 * Initializes the engine.
	 *
	 * In browser environments:
	 *  1. Loads and merges stored settings from `localStorage`.
	 *  2. Captures the `prefers-color-scheme` media query.
	 *  3. Attaches a `'change'` listener to react to OS preference updates.
	 *  4. Runs the first {@link apply} pass to paint the document immediately.
	 *
	 * In SSR environments, the constructor is a no-op.
	 */
	constructor() {
		if (typeof window !== 'undefined') {
			this.settings = parseSettings(localStorage.getItem(STORAGE_KEY));
			this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			this.bindSystem();
			this.apply();
		}
	}

	/**
	 * Attaches a listener to the OS color-scheme media query.
	 *
	 * Calls {@link apply} whenever the OS switches between light and dark mode,
	 * but only when `settings.mode === 'system'` — the effective mode check
	 * inside `apply` handles the conditional logic.
	 *
	 * Idempotent: calling this method multiple times is safe; the `bound` flag
	 * ensures only one listener is ever attached.
	 */
	private bindSystem() {
		if (this.bound || !this.mediaQuery) return;
		this.bound = true;
		this.mediaQuery.addEventListener('change', () => this.apply());
	}

	/**
	 * Resolves the effective polarity (`'light'` or `'dark'`) from `settings.mode`.
	 *
	 * When mode is `'system'`, defers to {@link getSystemMode} which reads the
	 * OS media query. Otherwise returns the explicit mode directly.
	 *
	 * @returns `'light'` or `'dark'`.
	 */
	private getEffectiveMode(): 'light' | 'dark' {
		if (this.settings.mode === 'system') return getSystemMode();
		return this.settings.mode;
	}

	/**
	 * Regenerates the color scheme and applies all theme tokens to the document.
	 *
	 * This is the central "render" method of the engine. It:
	 *  1. Resolves the effective mode (`'light'` | `'dark'`).
	 *  2. Generates a fresh {@link ColorScheme} from the current seed and contrast.
	 *  3. Writes all 81 CSS custom properties (3 namespaces × 27 roles) to `<html>`.
	 *  4. Sets `--moni-spacing-density`, `--moni-radius-base`, `--moni-font-sans`,
	 *     `--moni-font-title`, and `--moni-grain-opacity`.
	 *  5. Toggles the `moni-reduce-motion` class on `<html>`.
	 *
	 * **Side effects:** Mutates `document.documentElement.style` and `classList`.
	 * No-op in SSR (`typeof document === 'undefined'`).
	 */
	apply() {
		if (typeof document === 'undefined') return;

		const mode = this.getEffectiveMode();
		this.resolvedMode = mode;
		this.scheme = generateScheme(this.settings.seedColor, mode, this.settings.contrast);
		applySchemeToDocument(this.scheme, mode, document);

		const root = document.documentElement;

		// Write non-color theme tokens.
		root.style.setProperty('--moni-spacing-density', densityValue(this.settings.density).toString());
		root.style.setProperty('--moni-radius-base', radiusValue(this.settings.radius));
		root.style.setProperty('--moni-font-sans', fontFamily(this.settings.font));
		root.style.setProperty('--moni-font-title', fontFamily(this.settings.titleFont));
		root.style.setProperty('--moni-grain-opacity', this.settings.grainOpacity.toString());

		// Toggle motion reduction class. CSS `@media (prefers-reduced-motion)`
		// handles native OS preference; this class covers user-initiated opt-in.
		if (this.settings.reduceMotion) {
			root.classList.add('moni-reduce-motion');
		} else {
			root.classList.remove('moni-reduce-motion');
		}
	}

	/**
	 * Persists the current {@link settings} to `localStorage` and re-applies the theme.
	 *
	 * Called internally by all setter methods after mutating `settings`.
	 * No-op when `localStorage` is unavailable (SSR, private browsing, quota exceeded).
	 */
	persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
		}
		this.apply();
	}

	// ── Public setters ──────────────────────────────────────────────────────

	/**
	 * Updates the color scheme polarity.
	 *
	 * @param mode - `'light'`, `'dark'`, or `'system'` (follows OS preference).
	 */
	setMode(mode: ThemeMode) {
		this.settings.mode = mode;
		this.persist();
	}

	/**
	 * Updates the seed color used to generate the full color scheme.
	 *
	 * Automatically prepends `#` if the value doesn't already have one,
	 * ensuring the stored value is always a valid 7-character hex string.
	 *
	 * @param color - A hex color string, with or without the `#` prefix
	 *                (e.g. `'#4f46e5'` or `'4f46e5'`).
	 */
	setSeedColor(color: string) {
		this.settings.seedColor = color.startsWith('#') ? color : `#${color}`;
		this.persist();
	}

	/**
	 * Updates the WCAG contrast enhancement level for the generated palette.
	 *
	 * @param contrast - `'standard'` (AA), `'medium'` (enhanced), or `'high'` (AAA).
	 */
	setContrast(contrast: ContrastLevel) {
		this.settings.contrast = contrast;
		this.persist();
	}

	/**
	 * Updates the spacing density multiplier.
	 *
	 * @param density - `'compact'`, `'default'`, `'comfortable'`, or `'spacious'`.
	 */
	setDensity(density: ThemeDensity) {
		this.settings.density = density;
		this.persist();
	}

	/**
	 * Updates the global border-radius style.
	 *
	 * @param radius - `'sharp'` (0px), `'default'` (12px), or `'rounded'` (20px).
	 */
	setRadius(radius: ThemeRadius) {
		this.settings.radius = radius;
		this.persist();
	}

	/**
	 * Updates the body/UI typeface.
	 *
	 * @param font - One of `'geist'` | `'inter'` | `'roboto'` | `'instrument'`.
	 */
	setFont(font: ThemeFont) {
		this.settings.font = font;
		this.persist();
	}

	/**
	 * Updates the display/title typeface.
	 *
	 * @param font - One of `'geist'` | `'inter'` | `'roboto'` | `'instrument'`.
	 */
	setTitleFont(font: ThemeFont) {
		this.settings.titleFont = font;
		this.persist();
	}

	/**
	 * Updates the grain texture opacity.
	 *
	 * The value is clamped to [0, 1] before storing. Setting to `0` effectively
	 * disables the grain overlay without removing the element from the DOM.
	 *
	 * @param opacity - A number in the range [0, 1].
	 */
	setGrainOpacity(opacity: number) {
		this.settings.grainOpacity = Math.max(0, Math.min(1, opacity));
		this.persist();
	}

	/**
	 * Enables or disables user-initiated motion reduction.
	 *
	 * When `true`, the `moni-reduce-motion` class is added to `<html>`, which
	 * CSS components use to disable non-essential transitions and animations.
	 * This is separate from `prefers-reduced-motion` (OS-level) and allows
	 * users to opt in without changing their OS settings.
	 *
	 * @param reduce - `true` to disable motion, `false` to restore it.
	 */
	setReduceMotion(reduce: boolean) {
		this.settings.reduceMotion = reduce;
		this.persist();
	}

	/**
	 * Resets all settings to factory defaults and re-applies the theme.
	 *
	 * The reset is also persisted to `localStorage` so subsequent page loads
	 * start from defaults rather than the old stored values.
	 */
	reset() {
		this.settings = { ...defaults };
		this.persist();
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Module-level singleton
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Module-level singleton instance.
 *
 * `null` until the first call to {@link getThemeEngine}. Using `null` (rather
 * than eagerly constructing) ensures the engine is only created in browser
 * contexts where DOM and `localStorage` are actually available.
 */
let engine: ThemeEngine | null = null;

/**
 * Returns the module-level {@link ThemeEngine} singleton, creating it on first call.
 *
 * This is the **recommended** entry point for all consumers. Calling this
 * function multiple times always returns the same instance.
 *
 * @returns The shared `ThemeEngine` instance.
 *
 * @example
 * ```ts
 * import { getThemeEngine } from '@moni-labs/moni-ui';
 *
 * const theme = getThemeEngine();
 * theme.setMode('dark');
 * ```
 */
export function getThemeEngine(): ThemeEngine {
	if (!engine) engine = new ThemeEngine();
	return engine;
}

/**
 * Destroys the module-level singleton, forcing the next call to
 * {@link getThemeEngine} to create a fresh instance.
 *
 * **Intended for test isolation only.** Do not call this in application code,
 * as it will cause components sharing the singleton to lose their reference.
 *
 * @example
 * ```ts
 * afterEach(() => {
 *   resetThemeEngine(); // Start each test with a clean engine.
 * });
 * ```
 */
export function resetThemeEngine() {
	engine = null;
}
