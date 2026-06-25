import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-file-field.js';
import type { MoniFileField } from './moni-file-field.js';

describe('moni-file-field', () => {
	let el: MoniFileField;

	beforeEach(() => {
		el = document.createElement('moni-file-field') as MoniFileField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a text input and a file input', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const file = el.shadowRoot?.querySelector('input[type="file"]');
		expect(text).toBeTruthy();
		expect(file).toBeTruthy();
	});

	it('keeps the text input readonly', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.hasAttribute('readonly')).toBe(true);
	});

	it('places the label between the text input and the file input for label-lift', async () => {
		el.label = 'Upload';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const label = el.shadowRoot?.querySelector('label');
		const file = el.shadowRoot?.querySelector('input[type="file"]');
		expect(text?.nextElementSibling).toBe(label);
		expect(label?.nextElementSibling).toBe(file);
	});

	it('adds active class to text input when value is set', async () => {
		el.value = 'report.pdf';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(text?.classList.contains('active')).toBe(true);
	});

	it('forwards accept attribute to the file input', async () => {
		el.accept = 'image/*';
		await el.updateComplete;
		const file = el.shadowRoot?.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(file.accept).toBe('image/*');
	});

	it('forwards multiple attribute to the file input', async () => {
		el.multiple = true;
		await el.updateComplete;
		const file = el.shadowRoot?.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(file.multiple).toBe(true);
	});

	it('shows a trailing folder icon by default', async () => {
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('uses button-label as placeholder when no value', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.placeholder).toBe('Choose file');
	});
});
