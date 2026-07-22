import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-file-field.js';
import type { MoniFileField } from './moni-file-field.js';

describe('moni-file-field', () => {
	let el: MoniFileField;

	beforeEach(() => {
		el = document.createElement('moni-file-field') as MoniFileField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un input de texto y un input de archivo', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const file = el.shadowRoot?.querySelector('input[type="file"]');
		expect(text).toBeTruthy();
		expect(file).toBeTruthy();
	});

	it('mantiene el input de texto en solo lectura (readonly)', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.hasAttribute('readonly')).toBe(true);
	});

	it('coloca el label entre el input de texto y el input de archivo para la elevación del label', async () => {
		el.label = 'Upload';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const label = el.shadowRoot?.querySelector('label');
		const file = el.shadowRoot?.querySelector('input[type="file"]');
		expect(text?.nextElementSibling).toBe(label);
		expect(label?.nextElementSibling).toBe(file);
	});

	it('agrega la clase active al input de texto cuando se establece el valor', async () => {
		el.value = 'report.pdf';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(text?.classList.contains('active')).toBe(true);
	});

	it('reenvía el atributo accept al input de archivo', async () => {
		el.accept = 'image/*';
		await el.updateComplete;
		const file = el.shadowRoot?.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(file.accept).toBe('image/*');
	});

	it('reenvía el atributo multiple al input de archivo', async () => {
		el.multiple = true;
		await el.updateComplete;
		const file = el.shadowRoot?.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(file.multiple).toBe(true);
	});

	it('muestra un icono de carpeta (trailing folder icon) por defecto', async () => {
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('usa button-label como placeholder cuando no hay valor', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.placeholder).toBe('Choose file');
	});
});
