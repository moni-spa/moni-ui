import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-text-field.js';
import type { MoniTextField } from './moni-text-field.js';

describe('moni-text-field', () => {
	let el: MoniTextField;

	beforeEach(() => {
		el = document.createElement('moni-text-field') as MoniTextField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a field wrapper and an input', async () => {
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		const input = el.shadowRoot?.querySelector('input');
		expect(field).toBeTruthy();
		expect(input).toBeTruthy();
	});

	it('renders a leading icon when icon attribute is set', async () => {
		el.icon = 'search';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeTruthy();
	});

	it('renders a trailing icon when trailing-icon attribute is set', async () => {
		el.setAttribute('trailing-icon', 'close');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('renders prefix text when prefix attribute is set', async () => {
		el.prefix = 'https://';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading?.textContent?.trim()).toBe('https://');
	});

	it('renders suffix text when suffix attribute is set', async () => {
		el.suffix = '.com';
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing?.textContent?.trim()).toBe('.com');
	});

	it('applies square class on the field wrapper for shape=no-round', async () => {
		el.shape = 'no-round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('square')).toBe(true);
	});

	it('applies round class on the field wrapper for shape=round', async () => {
		el.shape = 'round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('round')).toBe(true);
	});

	it('does not apply shape class on the field wrapper for shape=square', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('square')).toBe(false);
		expect(field?.classList.contains('round')).toBe(false);
	});

	it('shows the loading spinner when loading is true', async () => {
		el.loading = true;
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		const progress = trailing?.querySelector('moni-progress');
		expect(progress).toBeTruthy();
	});

	it('does not render a leading icon by default', async () => {
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeFalsy();
	});

	it('forwards value to the input', async () => {
		el.value = 'hello world';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('hello world');
	});

	it('adds active class to input when value is set', async () => {
		el.value = 'something';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input?.classList.contains('active')).toBe(true);
	});

	it('renders label and toggles active class based on value', async () => {
		el.label = 'Email';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.textContent?.trim()).toBe('Email');

		el.value = 'a@b.com';
		await el.updateComplete;
		expect(label?.classList.contains('active')).toBe(true);
	});
});
