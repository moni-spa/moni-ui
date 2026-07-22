import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-time-picker.js';
import type { MoniTimePicker } from './moni-time-picker.js';

describe('moni-time-picker', () => {
	let el: MoniTimePicker;

	beforeEach(() => {
		el = document.createElement('moni-time-picker') as MoniTimePicker;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('se inicializa con valores por defecto', async () => {
		await el.updateComplete;
		expect(el.value).toBe('00:00');
		expect(el.mode).toBe('dial');
		expect(el.use24Hour).toBe(false);
	});

	it('analiza el valor de entrada correctamente', async () => {
		el.value = '14:45';
		await el.updateComplete;
		// Como use24Hour es false, PM está establecido
		expect(el.value).toBe('14:45');
	});

	it('alterna el modo', async () => {
		await el.updateComplete;
		const toggleBtn = el.shadowRoot?.querySelector('.mode-toggle-btn') as HTMLButtonElement;
		expect(toggleBtn).toBeTruthy();

		toggleBtn.click();
		await el.updateComplete;
		expect(el.mode).toBe('input');

		toggleBtn.click();
		await el.updateComplete;
		expect(el.mode).toBe('dial');
	});

	it('permite escribir la hora en modo input', async () => {
		el.mode = 'input';
		el.use24Hour = true;
		await el.updateComplete;

		const inputs = el.shadowRoot?.querySelectorAll('.display-box input') as NodeListOf<HTMLInputElement>;
		expect(inputs.length).toBe(2);

		inputs[0].value = '10';
		inputs[0].dispatchEvent(new Event('change'));
		inputs[1].value = '15';
		inputs[1].dispatchEvent(new Event('change'));

		await el.updateComplete;
		expect(el.value).toBe('10:15');
	});
});
