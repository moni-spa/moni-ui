/**
 * ThemeEngine — gestión reactiva del tema visual de Moni.
 * Soporta: modo claro/oscuro, color semilla, densidad, radio, fuente y grain.
 */

import { generateScheme, applySchemeToDocument, getDefaultSeed, type ColorScheme, type ContrastLevel } from './color.js';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeDensity = 'compact' | 'default' | 'comfortable' | 'spacious';
export type ThemeRadius = 'sharp' | 'default' | 'rounded';
export type ThemeFont = 'geist' | 'inter' | 'roboto' | 'instrument';

export interface ThemeSettings {
	mode: ThemeMode;
	seedColor: string;
	contrast: ContrastLevel;
	density: ThemeDensity;
	radius: ThemeRadius;
	font: ThemeFont;
	titleFont: ThemeFont;
	grainOpacity: number;
	reduceMotion: boolean;
}

const STORAGE_KEY = 'moni-theme-settings-v1';

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

function parseSettings(raw: string | null): ThemeSettings {
	if (!raw) return { ...defaults };
	try {
		const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
		return { ...defaults, ...parsed };
	} catch {
		return { ...defaults };
	}
}

function getSystemMode(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

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

function fontFamily(font: ThemeFont): string {
	switch (font) {
		case 'inter':
			return "'Inter', system-ui, sans-serif";
		case 'roboto':
			return "'Roboto', system-ui, sans-serif";
		case 'instrument':
			return "'Instrument Serif', Georgia, serif";
		default:
			return "'Geist', system-ui, sans-serif";
	}
}

export class ThemeEngine {
	settings = $state<ThemeSettings>({ ...defaults });
	resolvedMode = $state<'light' | 'dark'>('light');
	scheme = $state<ColorScheme>(generateScheme(defaults.seedColor, 'light', defaults.contrast));
	private mediaQuery: MediaQueryList | null = null;
	private bound = false;

	constructor() {
		if (typeof window !== 'undefined') {
			this.settings = parseSettings(localStorage.getItem(STORAGE_KEY));
			this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			this.bindSystem();
			this.apply();
		}
	}

	private bindSystem() {
		if (this.bound || !this.mediaQuery) return;
		this.bound = true;
		this.mediaQuery.addEventListener('change', () => this.apply());
	}

	private getEffectiveMode(): 'light' | 'dark' {
		if (this.settings.mode === 'system') return getSystemMode();
		return this.settings.mode;
	}

	apply() {
		if (typeof document === 'undefined') return;
		const mode = this.getEffectiveMode();
		this.resolvedMode = mode;
		this.scheme = generateScheme(this.settings.seedColor, mode, this.settings.contrast);
		applySchemeToDocument(this.scheme, mode, document);

		const root = document.documentElement;
		root.style.setProperty('--moni-spacing-density', densityValue(this.settings.density).toString());
		root.style.setProperty('--moni-radius-base', radiusValue(this.settings.radius));
		root.style.setProperty('--moni-font-sans', fontFamily(this.settings.font));
		root.style.setProperty('--moni-font-title', fontFamily(this.settings.titleFont));
		root.style.setProperty('--moni-grain-opacity', this.settings.grainOpacity.toString());

		if (this.settings.reduceMotion) {
			root.classList.add('moni-reduce-motion');
		} else {
			root.classList.remove('moni-reduce-motion');
		}
	}

	persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
		}
		this.apply();
	}

	setMode(mode: ThemeMode) {
		this.settings.mode = mode;
		this.persist();
	}

	setSeedColor(color: string) {
		this.settings.seedColor = color.startsWith('#') ? color : `#${color}`;
		this.persist();
	}

	setContrast(contrast: ContrastLevel) {
		this.settings.contrast = contrast;
		this.persist();
	}

	setDensity(density: ThemeDensity) {
		this.settings.density = density;
		this.persist();
	}

	setRadius(radius: ThemeRadius) {
		this.settings.radius = radius;
		this.persist();
	}

	setFont(font: ThemeFont) {
		this.settings.font = font;
		this.persist();
	}

	setTitleFont(font: ThemeFont) {
		this.settings.titleFont = font;
		this.persist();
	}

	setGrainOpacity(opacity: number) {
		this.settings.grainOpacity = Math.max(0, Math.min(1, opacity));
		this.persist();
	}

	setReduceMotion(reduce: boolean) {
		this.settings.reduceMotion = reduce;
		this.persist();
	}

	reset() {
		this.settings = { ...defaults };
		this.persist();
	}
}

let engine: ThemeEngine | null = null;

export function getThemeEngine(): ThemeEngine {
	if (!engine) engine = new ThemeEngine();
	return engine;
}

export function resetThemeEngine() {
	engine = null;
}
