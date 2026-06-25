import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-button.js';
import './moni-button-group.js';
import type { MoniButtonGroup } from './moni-button-group.js';
import type { MoniButton } from './moni-button.js';

describe('moni-button-group', () => {
	let group: MoniButtonGroup;

	beforeEach(() => {
		group = document.createElement('moni-button-group') as MoniButtonGroup;
		document.body.appendChild(group);
	});

	afterEach(() => {
		group.remove();
	});

	it('propagates size to children buttons', async () => {
		group.size = 'large';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		expect(btn1.getAttribute('size')).toBe('large');
		expect(btn2.getAttribute('size')).toBe('large');
	});

	it('sets appropriate shapes for connected variant', async () => {
		group.variant = 'connected';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		const btn3 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);
		group.appendChild(btn3);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;
		await btn3.updateComplete;

		expect(btn1.getAttribute('shape')).toBe('left-round-flat');
		expect(btn2.getAttribute('shape')).toBe('no-round');
		expect(btn3.getAttribute('shape')).toBe('right-round-flat');
	});

	it('uses round shapes for connected variant when gap is set', async () => {
		group.variant = 'connected';
		group.gap = '8px';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		expect(btn1.getAttribute('shape')).toBe('left-round');
		expect(btn2.getAttribute('shape')).toBe('right-round');
	});

	it('manages active toggles in single-select mode (multi=false)', async () => {
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		// Click btn1
		btn1.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(true);
		expect(btn2.active).toBe(false);

		// Click btn2
		btn2.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(false);
		expect(btn2.active).toBe(true);
	});

	it('manages active toggles in multi-select mode (multi=true)', async () => {
		group.multi = true;
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		btn1.click();
		btn2.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(true);
		expect(btn2.active).toBe(true);
	});

	it('renders role="group" on the container by default (M3 a11y)', async () => {
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('role')).toBe('group');
	});

	it('supports role="toolbar" override for app-action groups', async () => {
		group.role = 'toolbar';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('role')).toBe('toolbar');
	});

	it('forwards aria-label to the container', async () => {
		group.label = 'Text formatting';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('aria-label')).toBe('Text formatting');
	});

	it('forwards aria-labelledby to the container', async () => {
		group.labelledBy = 'group-title';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('aria-labelledby')).toBe('group-title');
	});

	it('does not emit aria-label when label is empty (M3 a11y cleanliness)', async () => {
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		// aria-label attribute should be either absent or empty string;
		// using `nothing` in lit removes the attribute entirely.
		const aria = container?.getAttribute('aria-label');
		expect(aria === null || aria === '').toBe(true);
	});
});
