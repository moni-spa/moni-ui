/**
 * Utilidades de color para generar esquemas compatibles con Material Design 3.
 * Basado en @material/material-color-utilities.
 */

import { SchemeTonalSpot, Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

export type ContrastLevel = 'standard' | 'medium' | 'high';

export interface HSL {
	h: number;
	s: number;
	l: number;
}

export interface ColorScheme {
	primary: string;
	onPrimary: string;
	primaryContainer: string;
	onPrimaryContainer: string;
	secondary: string;
	onSecondary: string;
	secondaryContainer: string;
	onSecondaryContainer: string;
	tertiary: string;
	onTertiary: string;
	tertiaryContainer: string;
	onTertiaryContainer: string;
	error: string;
	onError: string;
	errorContainer: string;
	onErrorContainer: string;
	background: string;
	onBackground: string;
	surface: string;
	onSurface: string;
	surfaceVariant: string;
	onSurfaceVariant: string;
	outline: string;
	outlineVariant: string;
	surfaceContainerLowest: string;
	surfaceContainerLow: string;
	surfaceContainer: string;
	surfaceContainerHigh: string;
	surfaceContainerHighest: string;
	inverseSurface: string;
	inverseOnSurface: string;
	inversePrimary: string;
	shadow: string;
}

export function hexToHsl(hex: string): HSL {
	const normalized = hex.replace('#', '');
	const r = parseInt(normalized.substring(0, 2), 16) / 255;
	const g = parseInt(normalized.substring(2, 4), 16) / 255;
	const b = parseInt(normalized.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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
		h /= 6;
	}

	return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: HSL): string {
	s /= 100;
	l /= 100;
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		return Math.round(color * 255)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}



export function generateScheme(
	seedHex: string,
	mode: 'light' | 'dark' = 'light',
	contrast: ContrastLevel = 'standard'
): ColorScheme {
	const seed = seedHex.startsWith('#') ? seedHex : `#${seedHex}`;
	const argb = argbFromHex(seed);
	const hct = Hct.fromInt(argb);

	let contrastLevel = 0.0;
	if (contrast === 'medium') {
		contrastLevel = 0.5;
	} else if (contrast === 'high') {
		contrastLevel = 1.0;
	}

	const scheme = new SchemeTonalSpot(hct, mode === 'dark', contrastLevel);

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

export function applySchemeToDocument(scheme: ColorScheme, mode: 'light' | 'dark', doc: Document) {
	const root = doc.documentElement;
	const prefix = '--md-sys-color-';

	for (const [key, value] of Object.entries(scheme)) {
		const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
		root.style.setProperty(`${prefix}${kebab}`, value);
		root.style.setProperty(`--${kebab}`, value);
	}

	root.setAttribute('data-theme', mode);
}

export function getDefaultSeed(): string {
	return '#4f46e5';
}
