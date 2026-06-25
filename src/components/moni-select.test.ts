import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-select.js';
import './moni-select-option.js';
import type { MoniSelect } from './moni-select.js';

describe('moni-select', () => {
	let el: MoniSelect;

	beforeEach(() => {
		el = document.createElement('moni-select') as MoniSelect;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders trigger input', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('readonly')).toBe('');
	});

	it('parses slotted options', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.textContent = 'Option 1';
		const opt2 = document.createElement('option');
		opt2.setAttribute('value', 'v2');
		opt2.textContent = 'Option 2';

		el.appendChild(opt1);
		el.appendChild(opt2);

		// Wait for slotchange and update
		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const items = el.shadowRoot?.querySelectorAll('.option-item');
		expect(items?.length).toBe(2);
		expect(items?.[0].textContent?.trim()).toBe('Option 1');
		expect(items?.[1].textContent?.trim()).toBe('Option 2');
	});

	it('toggles dropdown open/close on click', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		const menu = el.shadowRoot?.querySelector('.dropdown-menu');
		
		expect(menu?.classList.contains('open')).toBe(false);
		
		input.click();
		await el.updateComplete;
		expect(menu?.classList.contains('open')).toBe(true);

		input.click();
		await el.updateComplete;
		expect(menu?.classList.contains('open')).toBe(false);
	});

	it('fires input/change event and updates value on selection', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.textContent = 'Option 1';
		el.appendChild(opt1);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		let eventFired = false;
		el.addEventListener('change', () => {
			eventFired = true;
		});

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const item = el.shadowRoot?.querySelector('.option-item') as HTMLElement;
		item.click();
		await el.updateComplete;

		expect(el.value).toBe('v1');
		expect(eventFired).toBe(true);
	});

	it('filters options when searchable and typing', async () => {
		el.searchable = true;
		
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'banana');
		opt2.textContent = 'Banana';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = 'ap';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		const items = el.shadowRoot?.querySelectorAll('.option-item');
		expect(items?.length).toBe(1);
		expect(items?.[0].textContent?.trim()).toBe('Apple');
	});

	it('auto-selects option when exact match is typed', async () => {
		el.searchable = true;
		
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'banana');
		opt2.textContent = 'Banana';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = 'banana';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		expect(el.value).toBe('banana');
	});

	it('renders group subcategory headers', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.setAttribute('group', 'Fruits');
		opt1.textContent = 'Apple';

		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'v2');
		opt2.setAttribute('group', 'Vegetables');
		opt2.textContent = 'Carrot';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const headers = el.shadowRoot?.querySelectorAll('.group-header');
		expect(headers?.length).toBe(2);
		expect(headers?.[0].querySelector('span')?.textContent?.trim()).toBe('Fruits');
		expect(headers?.[1].querySelector('span')?.textContent?.trim()).toBe('Vegetables');
	});

	it('clears selection when input is emptied and clearable is true', async () => {
		el.searchable = true;
		el.clearable = true;
		el.value = 'apple';

		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		el.appendChild(opt1);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = '';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		expect(el.value).toBe('');
	});

	it('renders bottom sheet drawer when sheet is true', async () => {
		el.sheet = true;
		await el.updateComplete;

		const drawer = el.shadowRoot?.querySelector('.sheet-drawer');
		expect(drawer).toBeTruthy();
	});

	it('applies fixed positioning styles when positioning is fixed', async () => {
		el.positioning = 'fixed';
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu?.style.position).toBe('fixed');
	});
});
