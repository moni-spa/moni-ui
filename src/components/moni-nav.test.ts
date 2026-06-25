import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-nav.js';
import './moni-nav-item.js';
import type { MoniNav } from './moni-nav.js';
import type { MoniNavItem } from './moni-nav-item.js';

describe('moni-nav / moni-nav-item', () => {
	let el: MoniNav;

	beforeEach(() => {
		el = document.createElement('moni-nav') as MoniNav;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a <nav> with a slot', async () => {
		await el.updateComplete;
		const nav = el.shadowRoot?.querySelector('nav');
		const slot = el.shadowRoot?.querySelector('slot');
		expect(nav).toBeTruthy();
		expect(slot).toBeTruthy();
	});

	it('applies the placement class to the nav', async () => {
		el.placement = 'bottom';
		await el.updateComplete;
		const nav = el.shadowRoot?.querySelector('nav');
		expect(nav?.classList.contains('bottom')).toBe(true);
	});

	it('applies the variant class (rail/drawer)', async () => {
		el.placement = 'left';
		el.variant = 'drawer';
		await el.updateComplete;
		const nav = el.shadowRoot?.querySelector('nav');
		expect(nav?.classList.contains('left')).toBe(true);
		expect(nav?.classList.contains('max')).toBe(true);
	});

	it('reflects the placement attribute', async () => {
		el.placement = 'right';
		await el.updateComplete;
		expect(el.getAttribute('placement')).toBe('right');
	});

	it('reflects the variant attribute', async () => {
		el.variant = 'rail';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('rail');
	});

	it('forwards icon, label and active to nav-item', async () => {
		const item = document.createElement('moni-nav-item') as MoniNavItem;
		item.icon = 'home';
		item.label = 'Home';
		item.active = true;
		el.appendChild(item);
		await item.updateComplete;
		expect(item.getAttribute('icon')).toBe('home');
		expect(item.getAttribute('label')).toBe('Home');
		expect(item.hasAttribute('active')).toBe(true);

		const a = item.shadowRoot?.querySelector('a');
		expect(a?.classList.contains('active')).toBe(true);
		expect(a?.querySelector('moni-icon')).toBeTruthy();
	});

	it('forwards href and target to the inner <a>', async () => {
		const item = document.createElement('moni-nav-item') as MoniNavItem;
		item.href = '/home';
		item.target = '_blank';
		el.appendChild(item);
		await item.updateComplete;
		const a = item.shadowRoot?.querySelector('a');
		expect(a?.getAttribute('href')).toBe('/home');
		expect(a?.getAttribute('target')).toBe('_blank');
	});

	it('propagates layout property to items and sets computed layout', async () => {
		const item = document.createElement('moni-nav-item') as MoniNavItem;
		el.appendChild(item);
		el.layout = 'horizontal';
		await el.updateComplete;
		await item.updateComplete;

		expect(item.getAttribute('layout')).toBe('horizontal');
		expect(item.computedLayout).toBe('horizontal');

		const a = item.shadowRoot?.querySelector('a');
		expect(a?.getAttribute('data-layout')).toBe('horizontal');
	});

	it('modal drawer renders a scrim and dialog semantics', async () => {
		el.placement = 'left';
		el.variant = 'drawer';
		el.modal = true;
		await el.updateComplete;

		const scrim = el.shadowRoot?.querySelector('[part="scrim"]');
		expect(scrim).toBeTruthy();

		const nav = el.shadowRoot?.querySelector('nav');
		expect(nav?.getAttribute('role')).toBe('dialog');
		expect(nav?.getAttribute('aria-modal')).toBe('true');
		expect(nav?.getAttribute('aria-expanded')).toBe('true');
	});

	it('modal drawer closes when the scrim is clicked', async () => {
		el.placement = 'left';
		el.variant = 'drawer';
		el.modal = true;
		el.open = true;
		await el.updateComplete;

		const scrim = el.shadowRoot?.querySelector('[part="scrim"]') as HTMLElement;
		scrim.click();
		await el.updateComplete;

		expect(el.open).toBe(false);
		const nav = el.shadowRoot?.querySelector('nav');
		expect(nav?.getAttribute('aria-expanded')).toBe('false');
	});

	it('modal drawer closes on Escape key', async () => {
		el.placement = 'left';
		el.variant = 'drawer';
		el.modal = true;
		el.open = true;
		await el.updateComplete;

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await el.updateComplete;

		expect(el.open).toBe(false);
	});
});
