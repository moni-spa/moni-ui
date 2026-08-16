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
		expect(span?.textContent).toContain('Accept terms');
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

	it('permite personalizar los iconos desmarcado y marcado', async () => {
		el.uncheckedIcon = 'radio_button_unchecked';
		el.checkedIcon = 'task_alt';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('span > i');
		expect(icon?.textContent).toBe('radio_button_unchecked');

		el.checked = true;
		await el.updateComplete;
		expect(icon?.textContent).toBe('task_alt');
	});

	it('no agrega un icono predeterminado al estado personalizado vacío', async () => {
		el.uncheckedIcon = 'close';
		el.checked = true;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('span > i')?.textContent).toBe('');

		el.checked = false;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('span > i')?.textContent).toBe('close');
	});

	it('conserva la forma exterior al usar iconos personalizados', async () => {
		el.checkedIcon = 'done';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('span')?.classList.contains('custom-icons')).toBe(true);
	});

	it('actualiza el icono personalizado al alternar mediante el input', async () => {
		el.checked = true;
		el.uncheckedIcon = 'close';
		el.checkedIcon = 'check';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.checked = false;
		input.dispatchEvent(new Event('change'));
		await el.updateComplete;
		expect(el.checked).toBe(false);
		expect(el.shadowRoot?.querySelector('span > i')?.textContent).toBe('close');
	});
});
