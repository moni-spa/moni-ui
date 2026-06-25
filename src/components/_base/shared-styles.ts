import { css } from 'lit';

/**
 * Shared baseline injected into every Moni Web Component shadow root.
 *
 * Provides:
 *  1. Box-sizing reset on the host and its descendants.
 *  2. CSS custom property bridge: exposes the **BeerCSS token namespace**
 *     (`--primary`, `--on-primary`, `--surface`, `--elevate1`, …) inside the
 *     shadow root, falling back to sensible Material 3 defaults if the host
 *     document has not provided the alias yet.
 *  3. The `--md-sys-color-*` and `--color-*` aliases kept for backward
 *     compatibility with the MD3 theme engine that the rest of the Moni apps
 *     (MoniAuth-Client, MoniAuth-Yo, Moni-Labs) still rely on.
 *  4. Helper utility classes (`.truncate`, `.visually-hidden`).
 *
 * The MD3 → BeerCSS mapping is intentionally *inverted* with respect to the
 * previous design: BeerCSS variables are the primary, MD3 ones are aliases.
 * Components authored against `var(--primary)` will work in any environment
 * that ships the MD3 scheme because the alias resolves upstream.
 */
export const sharedStyles = css`
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

	/* ─── BeerCSS primary tokens (with MD3 fallbacks) ─── */
	:host {
		/* ─── BeerCSS structural tokens ─── */
		--shadow: 0 0 0 0 transparent;
		--scrim: rgb(0 0 0 / 0.5);
		--active: color-mix(in srgb, currentColor 10%, transparent);
		--overlay: rgb(0 0 0 / 0.5);
		--image: linear-gradient(currentColor 0 0);

		--font: var(--moni-font-sans, 'Geist', system-ui, -apple-system, sans-serif);
		--font-title: var(
			--moni-font-title,
			'Instrument Serif',
			Georgia,
			serif
		);
		--font-mono: 'Geist Mono', 'Fira Code', monospace;
		--font-icon: var(--font-icon-override, 'Material Symbols Rounded');

		--elevate1: 0 0.125rem 0.125rem 0 rgb(0 0 0 / 0.32);
		--elevate2: 0 0.25rem 0.5rem 0 rgb(0 0 0 / 0.4);
		--elevate3: 0 0.375rem 0.75rem 0 rgb(0 0 0 / 0.48);

		--speed1: 100ms;
		--speed2: 200ms;
		--speed3: 300ms;
		--speed4: 400ms;
	}

	/* ─── MD3 aliases (kept for backward compatibility) ─── */
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

		/* Tokens previously defined in tokens.css — keep names stable so the
		   apps that import them continue to work. */
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

	/* ─── Utility classes ─── */
	.truncate {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

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
