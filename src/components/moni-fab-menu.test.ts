import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-fab-menu.js';
import type { MoniFabMenu } from './moni-fab-menu.js';
import type { MoniFab } from './moni-fab.js';

describe('moni-fab-menu', () => {
	let el: MoniFabMenu;

	beforeEach(() => {
		el = document.createElement('moni-fab-menu') as MoniFabMenu;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a .fab-menu and a <moni-fab> trigger', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu');
		const trigger = el.shadowRoot?.querySelector('moni-fab');
		expect(menu).toBeTruthy();
		expect(trigger).toBeTruthy();
	});

	it('passes icon, size, color, shape, position to the trigger', async () => {
		el.icon = 'menu';
		el.size = 'large';
		el.color = 'secondary';
		el.shape = 'circle';
		await el.updateComplete;
		const trigger = el.shadowRoot?.querySelector('moni-fab');
		expect(trigger?.getAttribute('icon')).toBe('menu');
		expect(trigger?.getAttribute('size')).toBe('large');
		expect(trigger?.getAttribute('color')).toBe('secondary');
		expect(trigger?.getAttribute('shape')).toBe('circle');
	});

	it('reflects the open attribute', async () => {
		el.open = true;
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBe(true);

		el.open = false;
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBe(false);
	});

	it('reflects the direction attribute', async () => {
		el.direction = 'down';
		await el.updateComplete;
		expect(el.getAttribute('direction')).toBe('down');
	});

	it('toggles open when the trigger is clicked', async () => {
		await el.updateComplete;
		expect(el.open).toBe(false);

		const trigger = el.shadowRoot?.querySelector(
			'moni-fab'
		) as MoniFab | null;
		await trigger?.updateComplete;

		const button = trigger?.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement | null;
		button?.click();
		await el.updateComplete;
		expect(el.open).toBe(true);

		button?.click();
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('menu has role="menu" for screen reader semantics', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu');
		expect(menu?.getAttribute('role')).toBe('menu');
	});

	it('Escape key closes an open menu', async () => {
		el.open = true;
		await el.updateComplete;
		expect(el.open).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('Escape on a closed menu is a no-op', async () => {
		await el.updateComplete;
		expect(el.open).toBe(false);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('click outside the menu closes it', async () => {
		el.open = true;
		await el.updateComplete;

		// Dispatch a click on the document body (outside the menu).
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('click inside the menu does not close it', async () => {
		el.open = true;
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu') as HTMLElement;
		menu.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await el.updateComplete;
		expect(el.open).toBe(true);
	});
});
