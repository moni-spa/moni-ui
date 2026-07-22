import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-radio.js';
import type { MoniRadio } from './moni-radio.js';

describe('moni-radio', () => {
	let el: MoniRadio;

	beforeEach(() => {
		el = document.createElement('moni-radio') as MoniRadio;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un input y un span para el estilo visual', async () => {
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

	it('renderiza un span de label cuando se establece el atributo label', async () => {
		el.label = 'Option A';
		await el.updateComplete;
		const span = el.shadowRoot?.querySelector('span');
		expect(span?.textContent?.trim()).toBe('Option A');
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
	});

	it('reenvía name al input', async () => {
		el.name = 'group1';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.name).toBe('group1');
	});

	it('reenvía value al input', async () => {
		el.value = 'a';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('a');
	});
});
