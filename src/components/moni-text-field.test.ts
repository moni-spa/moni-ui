import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-text-field.js';
import type { MoniTextField } from './moni-text-field.js';

describe('moni-text-field', () => {
	let el: MoniTextField;

	beforeEach(() => {
		el = document.createElement('moni-text-field') as MoniTextField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un contenedor de campo (field wrapper) y un input', async () => {
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		const input = el.shadowRoot?.querySelector('input');
		expect(field).toBeTruthy();
		expect(input).toBeTruthy();
	});

	it('renderiza un icono inicial (leading) cuando se establece el atributo icon', async () => {
		el.icon = 'search';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeTruthy();
	});

	it('renderiza un icono final (trailing) cuando se establece el atributo trailing-icon', async () => {
		el.setAttribute('trailing-icon', 'close');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('renderiza un texto prefijo cuando se establece el atributo prefix', async () => {
		el.prefix = 'https://';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading?.textContent?.trim()).toBe('https://');
	});

	it('renderiza un texto sufijo cuando se establece el atributo suffix', async () => {
		el.suffix = '.com';
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing?.textContent?.trim()).toBe('.com');
	});

	it('aplica la clase square en el contenedor de campo para shape=no-round', async () => {
		el.shape = 'no-round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('square')).toBe(true);
	});

	it('aplica la clase round en el contenedor de campo para shape=round', async () => {
		el.shape = 'round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('round')).toBe(true);
	});

	it('no aplica la clase de forma (shape) en el contenedor de campo para shape=square', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('square')).toBe(false);
		expect(field?.classList.contains('round')).toBe(false);
	});

	it('muestra el indicador de carga cuando loading es true', async () => {
		el.loading = true;
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		const progress = trailing?.querySelector('moni-progress');
		expect(progress).toBeTruthy();
	});

	it('no renderiza un icono inicial por defecto', async () => {
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeFalsy();
	});

	it('reenvía value al input', async () => {
		el.value = 'hello world';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('hello world');
	});

	it('agrega la clase active al input cuando se establece el valor', async () => {
		el.value = 'something';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input?.classList.contains('active')).toBe(true);
	});

	it('renderiza el label y alterna la clase active basándose en el valor', async () => {
		el.label = 'Email';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.textContent?.trim()).toBe('Email');

		el.value = 'a@b.com';
		await el.updateComplete;
		expect(label?.classList.contains('active')).toBe(true);
	});
});
