import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-divider.js';
import type { MoniDivider } from './moni-divider.js';

describe('moni-divider (P5.1 — recreated)', () => {
	let el: MoniDivider;

	beforeEach(() => {
		el = document.createElement('moni-divider') as MoniDivider;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('por defecto es inset=leading', async () => {
		await el.updateComplete;
		expect(el.inset).toBe('leading');
		expect(el.getAttribute('inset')).toBe('leading');
	});

	it('refleja las tres inserciones M3: leading / middle / none', async () => {
		for (const inset of ['leading', 'middle', 'none'] as const) {
			el.inset = inset;
			await el.updateComplete;
			expect(el.getAttribute('inset')).toBe(inset);
		}
	});

	it('renderiza un slot por defecto vacío para contenido en línea', async () => {
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot');
		expect(slot).toBeTruthy();
	});

	it('refleja el atributo vertical', async () => {
		el.setAttribute('vertical', '');
		await el.updateComplete;
		expect(el.hasAttribute('vertical')).toBe(true);
	});
});