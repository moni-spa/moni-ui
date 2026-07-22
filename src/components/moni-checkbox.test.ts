import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-checkbox.js';
import type { MoniCheckbox } from './moni-checkbox.js';

describe('moni-checkbox', () => {
	let el: MoniCheckbox;

	beforeEach(() => {
		el = document.createElement('moni-checkbox') as MoniCheckbox;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un input y un span visual', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		const span = el.shadowRoot?.querySelector('span');
		expect(input).toBeTruthy();
		expect(span).toBeTruthy();
	});

	it('reenvía el estado checked al input', async () => {
		el.checked = true;
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.checked).toBe(true);

		el.checked = false;
		await el.updateComplete;
		expect(input.checked).toBe(false);
	});

	it('el input está contenido en el label (para el manejo de clics)', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.contains(input)).toBe(true);
	});

	it('renderiza un label span cuando se establece el atributo label', async () => {
		el.label = 'Accept terms';
		await el.updateComplete;
		const span = el.shadowRoot?.querySelector('span');
		expect(span?.textContent?.trim()).toBe('Accept terms');
	});

	it('reenvía disabled al input', async () => {
		el.disabled = true;
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it('refleja el atributo checked', async () => {
		el.checked = true;
		await el.updateComplete;
		expect(el.hasAttribute('checked')).toBe(true);

		el.checked = false;
		await el.updateComplete;
		expect(el.hasAttribute('checked')).toBe(false);
	});

	it('refleja el atributo disabled', async () => {
		el.disabled = true;
		await el.updateComplete;
		expect(el.hasAttribute('disabled')).toBe(true);
	});
});
