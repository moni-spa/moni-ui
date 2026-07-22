import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-switch.js';
import type { MoniSwitch } from './moni-switch.js';

describe('moni-switch', () => {
	let el: MoniSwitch;

	beforeEach(() => {
		el = document.createElement('moni-switch') as MoniSwitch;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un input y un span que contiene pseudo-elementos track/thumb', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		const span = el.shadowRoot?.querySelector('span');
		expect(input).toBeTruthy();
		expect(span).toBeTruthy();
	});

	it('el input tiene role=switch', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.getAttribute('role')).toBe('switch');
	});

	it('el input está contenido en el label (para el manejo de clics)', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.contains(input)).toBe(true);
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

	it('renderiza un span de label cuando se establece el atributo label', async () => {
		el.label = 'Wi-Fi';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent?.trim()).toBe('Wi-Fi');
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

	it('renderiza iconos de cierre y verificación cuando icon=true', async () => {
		el.icon = true;
		await el.updateComplete;
		const icons = el.shadowRoot?.querySelectorAll('span > i');
		expect(icons).toBeTruthy();
		expect(icons?.length).toBe(2);
		expect(icons?.[0].textContent).toBe('close');
		expect(icons?.[1].textContent).toBe('check');
	});

	it('no renderiza un icono de pulgar cuando icon=false', async () => {
		el.icon = false;
		await el.updateComplete;
		const icons = el.shadowRoot?.querySelectorAll('span > i');
		expect(icons?.length).toBe(0);
	});

	it('reenvía name al input', async () => {
		el.name = 'wifi';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.name).toBe('wifi');
	});

	it('reenvía value al input', async () => {
		el.value = 'on';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('on');
	});

	it('el input se renderiza dentro del label del switch', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input).toBeTruthy();
	});
});
