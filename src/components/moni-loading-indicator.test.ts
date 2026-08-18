import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-loading-indicator.js';
import type { MoniLoadingIndicator } from './moni-loading-indicator.js';

describe('moni-loading-indicator', () => {
	let el: MoniLoadingIndicator;

	beforeEach(() => {
		el = document.createElement('moni-loading-indicator') as MoniLoadingIndicator;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un contenedor con indicador activo', async () => {
		await el.updateComplete;
		const container = el.shadowRoot?.querySelector('.container');
		const activeIndicator = el.shadowRoot?.querySelector('.active-indicator');
		expect(container).toBeTruthy();
		expect(activeIndicator).toBeTruthy();
	});

	it('refleja y respeta el atributo variant', async () => {
		expect(el.variant).toBe('uncontained');
		el.variant = 'contained';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('contained');

		el.variant = 'uncontained';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('uncontained');
	});

	it('tiene el rol progressbar y valores min/max establecidos', () => {
		expect(el.getAttribute('role')).toBe('progressbar');
		expect(el.ariaValueMin).toBe('0');
		expect(el.ariaValueMax).toBe('100');
	});

	it('incluye la secuencia completa de morph y rotación', () => {
		const cssText = ((el.constructor as typeof HTMLElement & { styles: unknown[] }).styles)
			.map((style: any) => style?.cssText ?? '')
			.join(' ');
		expect(cssText).toContain('@keyframes rotate-outer');
		expect(cssText).toContain('@keyframes rotate-inner');
		for (const shape of ['soft-burst', '9-sided-cookie', 'pentagon', 'pill', 'sunny', '4-sided-cookie', 'oval']) {
			expect(cssText).toContain(`--_polygon-${shape}`);
		}
	});

	it('desactiva ambas rotaciones con movimiento reducido', () => {
		const cssText = ((el.constructor as typeof HTMLElement & { styles: unknown[] }).styles)
			.map((style: any) => style?.cssText ?? '')
			.join(' ');
		expect(cssText).toContain('prefers-reduced-motion: reduce');
		expect(cssText).toContain('animation: none');
	});

	it('permite que el indicador contained crezca fuera de su superficie', () => {
		const cssText = ((el.constructor as typeof HTMLElement & { styles: unknown[] }).styles)
			.map((style: any) => style?.cssText ?? '')
			.join(' ');
		expect(cssText).not.toContain('contain: strict');
		expect(cssText).toContain('contain: layout style');
		expect(cssText).toContain('overflow: visible');
	});
});
