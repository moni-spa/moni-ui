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
});
