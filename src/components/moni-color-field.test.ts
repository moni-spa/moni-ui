import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-color-field.js';
import type { MoniColorField } from './moni-color-field.js';

describe('moni-color-field', () => {
	let el: MoniColorField;

	beforeEach(() => {
		el = document.createElement('moni-color-field') as MoniColorField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a swatch and a text input', async () => {
		await el.updateComplete;
		const swatch = el.shadowRoot?.querySelector('.swatch');
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(swatch).toBeTruthy();
		expect(text).toBeTruthy();
	});

	it('adds active class to the text input when value is set', async () => {
		el.value = '#ff00aa';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(text?.classList.contains('active')).toBe(true);
	});

	it('forwards value to the text input', async () => {
		el.value = '#123456';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.value).toBe('#123456');
	});

	it('keeps the text input readonly (so the label can be lifted via .active)', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.hasAttribute('readonly')).toBe(true);
	});

	it('renders label element adjacent to the text input for BeerCSS selector matching', async () => {
		el.label = 'Pick a color';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const label = el.shadowRoot?.querySelector('label');
		expect(text?.nextElementSibling).toBe(label);
	});
});
