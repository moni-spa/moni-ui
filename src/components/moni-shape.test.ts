import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './moni-shape.js';
import type { MoniShape } from './moni-shape.js';

describe('moni-shape', () => {
	let el: MoniShape;

	beforeEach(() => {
		el = document.createElement('moni-shape') as MoniShape;
		document.body.appendChild(el);
	});

	afterEach(() => el.remove());

	it('renderiza las shapes Material como un polígono normalizado', async () => {
		el.name = 'sunny';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.shape')).toBeTruthy();
		expect(el.getAttribute('name')).toBe('sunny');
	});

	it('cambia el mismo elemento al hacer morph', async () => {
		el.name = 'sunny';
		await el.updateComplete;
		const shape = el.shadowRoot?.querySelector('.shape');
		el.name = 'heart';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.shape')).toBe(shape);
		expect(el.getAttribute('name')).toBe('heart');
	});

	it('admite los nombres históricos mediante type', async () => {
		el.type = 'leaf-clover4';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.shape')).toBeTruthy();
		expect(el.getAttribute('type')).toBe('leaf-clover4');
	});

	it('expone duración y easing del morph', async () => {
		el.duration = '240ms';
		el.easing = 'linear';
		el.name = 'circle';
		await el.updateComplete;
		const style = el.shadowRoot?.querySelector('.shape')?.getAttribute('style');
		expect(style).toContain('--_morph-duration:240ms');
		expect(style).toContain('--_morph-easing:linear');
	});

	it('conserva las shapes decorativas heredadas', async () => {
		el.type = 'star';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.shape')).toBeTruthy();
	});
});
