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

	it('renders an input and a visual span', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		const span = el.shadowRoot?.querySelector('span');
		expect(input).toBeTruthy();
		expect(span).toBeTruthy();
	});

	it('forwards checked state to the input', async () => {
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

	it('input is contained in the label (for click handling)', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.contains(input)).toBe(true);
	});

	it('renders a label span when label attribute is set', async () => {
		el.label = 'Accept terms';
		await el.updateComplete;
		const span = el.shadowRoot?.querySelector('span');
		expect(span?.textContent?.trim()).toBe('Accept terms');
	});

	it('forwards disabled to the input', async () => {
		el.disabled = true;
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it('reflects the checked attribute', async () => {
		el.checked = true;
		await el.updateComplete;
		expect(el.hasAttribute('checked')).toBe(true);

		el.checked = false;
		await el.updateComplete;
		expect(el.hasAttribute('checked')).toBe(false);
	});

	it('reflects the disabled attribute', async () => {
		el.disabled = true;
		await el.updateComplete;
		expect(el.hasAttribute('disabled')).toBe(true);
	});
});
