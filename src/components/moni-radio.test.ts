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

	it('renders an input and a span for visual styling', async () => {
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
		el.label = 'Option A';
		await el.updateComplete;
		const span = el.shadowRoot?.querySelector('span');
		expect(span?.textContent?.trim()).toBe('Option A');
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
	});

	it('forwards name to the input', async () => {
		el.name = 'group1';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.name).toBe('group1');
	});

	it('forwards value to the input', async () => {
		el.value = 'a';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('a');
	});
});
