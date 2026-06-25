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

	it('renders an input and a span containing track/thumb pseudo-elements', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		const span = el.shadowRoot?.querySelector('span');
		expect(input).toBeTruthy();
		expect(span).toBeTruthy();
	});

	it('input has role=switch', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.getAttribute('role')).toBe('switch');
	});

	it('input is contained in the label (for click handling)', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.contains(input)).toBe(true);
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

	it('renders a label span when label attribute is set', async () => {
		el.label = 'Wi-Fi';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent?.trim()).toBe('Wi-Fi');
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

	it('renders close and check icons when icon=true', async () => {
		el.icon = true;
		await el.updateComplete;
		const icons = el.shadowRoot?.querySelectorAll('span > i');
		expect(icons).toBeTruthy();
		expect(icons?.length).toBe(2);
		expect(icons?.[0].textContent).toBe('close');
		expect(icons?.[1].textContent).toBe('check');
	});

	it('does not render a thumb icon when icon=false', async () => {
		el.icon = false;
		await el.updateComplete;
		const icons = el.shadowRoot?.querySelectorAll('span > i');
		expect(icons?.length).toBe(0);
	});

	it('forwards name to the input', async () => {
		el.name = 'wifi';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.name).toBe('wifi');
	});

	it('forwards value to the input', async () => {
		el.value = 'on';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('on');
	});

	it('input is rendered inside the switch label', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input).toBeTruthy();
	});
});
