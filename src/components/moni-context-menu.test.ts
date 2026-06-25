import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-context-menu.js';
import type { MoniContextMenu } from './moni-context-menu.js';

describe('moni-context-menu (P3.5 — flip)', () => {
	let parent: HTMLElement;
	let el: MoniContextMenu;

	beforeEach(() => {
		parent = document.createElement('div');
		el = document.createElement('moni-context-menu') as MoniContextMenu;
		parent.appendChild(el);
		document.body.appendChild(parent);
	});

	afterEach(() => {
		parent.remove();
	});

	it('renders a <moni-menu> in the shadow DOM', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu).toBeTruthy();
	});

	it('reflects placement=bottom (default)', async () => {
		await el.updateComplete;
		expect(el.placement).toBe('bottom');
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.getAttribute('placement')).toBe('bottom');
	});

	it('reflects placement changes on the inner menu', async () => {
		el.placement = 'top';
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.getAttribute('placement')).toBe('top');
	});

	it('reflects the flip attribute on the host', async () => {
		el.flip = true;
		await el.updateComplete;
		expect(el.hasAttribute('flip')).toBe(true);
	});

	it('opens the menu on right-click on the parent', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector(
			'moni-menu'
		) as HTMLElement | null;
		expect(menu?.hasAttribute('active')).toBe(false);

		const evt = new MouseEvent('contextmenu', {
			bubbles: true,
			clientX: 50,
			clientY: 75
		});
		parent.dispatchEvent(evt);
		await el.updateComplete;
		expect(menu?.hasAttribute('active')).toBe(true);
	});

	it('closes the menu on document click', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector(
			'moni-menu'
		) as HTMLElement | null;
		parent.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 10, clientY: 10 }));
		await el.updateComplete;
		expect(menu?.hasAttribute('active')).toBe(true);

		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await el.updateComplete;
		expect(menu?.hasAttribute('active')).toBe(false);
	});

	it('closes the menu on Escape', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector(
			'moni-menu'
		) as HTMLElement | null;
		parent.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 10, clientY: 10 }));
		await el.updateComplete;
		expect(menu?.hasAttribute('active')).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(menu?.hasAttribute('active')).toBe(false);
	});

	it('does not call showPopover (visual-only; no Popover API)', async () => {
		// Sanity: the component is visual-only. The moni-menu inside handles
		// the active attribute via CSS visibility/opacity. No native popover
		// toggling.
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.hasAttribute('popover')).toBe(false);
	});
});
