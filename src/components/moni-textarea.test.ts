import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-textarea.js';
import type { MoniTextarea } from './moni-textarea.js';

describe('moni-textarea', () => {
	let el: MoniTextarea;

	beforeEach(() => {
		el = document.createElement('moni-textarea') as MoniTextarea;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un contenedor de campo (field wrapper) y un textarea', async () => {
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		const textarea = el.shadowRoot?.querySelector('textarea');
		expect(field).toBeTruthy();
		expect(textarea).toBeTruthy();
	});

	it('renderiza un icono inicial (leading) cuando se establece el atributo icon', async () => {
		el.icon = 'edit';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeTruthy();
	});

	it('renderiza un icono final (trailing) cuando se establece el atributo trailing-icon', async () => {
		el.setAttribute('trailing-icon', 'send');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('renderiza un texto prefijo cuando se establece el atributo prefix', async () => {
		el.prefix = '~';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading?.textContent?.trim()).toBe('~');
	});

	it('renderiza un texto sufijo cuando se establece el atributo suffix', async () => {
		el.suffix = 'chars';
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing?.textContent?.trim()).toBe('chars');
	});

	it('muestra el indicador de carga cuando loading es true', async () => {
		el.loading = true;
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		const progress = trailing?.querySelector('moni-progress');
		expect(progress).toBeTruthy();
	});

	it('reenvía el atributo rows al textarea', async () => {
		el.rows = 5;
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.rows).toBe(5);
	});

	it('reenvía value al textarea', async () => {
		el.value = 'multi\nline\ntext';
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.value).toBe('multi\nline\ntext');
	});

	it('agrega la clase active al textarea cuando se establece el valor', async () => {
		el.value = 'content';
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector('textarea');
		expect(textarea?.classList.contains('active')).toBe(true);
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

	// ─── P3.3: maxlength + character counter ───

	it('no renderiza un contador por defecto', async () => {
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeFalsy();
	});

	it('renderiza un contador cuando se establece maxlength', async () => {
		el.maxlength = 100;
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeTruthy();
	});

	it('el contador muestra value.length / maxlength', async () => {
		el.maxlength = 100;
		el.value = 'Hello';
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter?.textContent?.trim()).toBe('5 / 100');
	});

	it('no-counter suprime el contador incluso cuando maxlength está establecido', async () => {
		el.maxlength = 100;
		el.noCounter = true;
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeFalsy();
	});

	it('reenvía maxlength al textarea interno como maxLength', async () => {
		el.maxlength = 50;
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.maxLength).toBe(50);
	});
});
