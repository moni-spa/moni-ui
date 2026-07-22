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

	it('renderiza una muestra (swatch) y un input de texto', async () => {
		await el.updateComplete;
		const swatch = el.shadowRoot?.querySelector('.swatch');
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(swatch).toBeTruthy();
		expect(text).toBeTruthy();
	});

	it('agrega la clase active al input de texto cuando se establece el valor', async () => {
		el.value = '#ff00aa';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(text?.classList.contains('active')).toBe(true);
	});

	it('reenvía el valor al input de texto', async () => {
		el.value = '#123456';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.value).toBe('#123456');
	});

	it('mantiene el input de texto en readonly (para que la etiqueta pueda elevarse vía .active)', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.hasAttribute('readonly')).toBe(true);
	});

	it('renderiza el elemento label adyacente al input de texto para el selector de BeerCSS', async () => {
		el.label = 'Pick a color';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const label = el.shadowRoot?.querySelector('label');
		expect(text?.nextElementSibling).toBe(label);
	});
});
