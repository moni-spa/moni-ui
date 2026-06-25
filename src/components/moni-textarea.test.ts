import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-textarea.js';
import type { MoniTextarea } from './moni-textarea.js';

describe('moni-textarea', () => {
	let el: MoniTextarea;

	beforeEach(() => {
		el = document.createElement('moni-textarea') as MoniTextarea;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a field wrapper and a textarea', async () => {
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		const textarea = el.shadowRoot?.querySelector('textarea');
		expect(field).toBeTruthy();
		expect(textarea).toBeTruthy();
	});

	it('renders a leading icon when icon attribute is set', async () => {
		el.icon = 'edit';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeTruthy();
	});

	it('renders a trailing icon when trailing-icon attribute is set', async () => {
		el.setAttribute('trailing-icon', 'send');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('renders prefix text when prefix attribute is set', async () => {
		el.prefix = '~';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading?.textContent?.trim()).toBe('~');
	});

	it('renders suffix text when suffix attribute is set', async () => {
		el.suffix = 'chars';
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing?.textContent?.trim()).toBe('chars');
	});

	it('shows the loading spinner when loading is true', async () => {
		el.loading = true;
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		const progress = trailing?.querySelector('moni-progress');
		expect(progress).toBeTruthy();
	});

	it('forwards rows attribute to the textarea', async () => {
		el.rows = 5;
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.rows).toBe(5);
	});

	it('forwards value to the textarea', async () => {
		el.value = 'multi\nline\ntext';
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.value).toBe('multi\nline\ntext');
	});

	it('adds active class to textarea when value is set', async () => {
		el.value = 'content';
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector('textarea');
		expect(textarea?.classList.contains('active')).toBe(true);
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

	// ─── P3.3: maxlength + character counter ───

	it('does not render a counter by default', async () => {
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeFalsy();
	});

	it('renders a counter when maxlength is set', async () => {
		el.maxlength = 100;
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeTruthy();
	});

	it('counter shows value.length / maxlength', async () => {
		el.maxlength = 100;
		el.value = 'Hello';
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter?.textContent?.trim()).toBe('5 / 100');
	});

	it('no-counter suppresses the counter even when maxlength is set', async () => {
		el.maxlength = 100;
		el.noCounter = true;
		await el.updateComplete;
		const counter = el.shadowRoot?.querySelector('.counter');
		expect(counter).toBeFalsy();
	});

	it('forwards maxlength to the inner textarea as maxLength', async () => {
		el.maxlength = 50;
		await el.updateComplete;
		const textarea = el.shadowRoot?.querySelector(
			'textarea'
		) as HTMLTextAreaElement;
		expect(textarea.maxLength).toBe(50);
	});
});
