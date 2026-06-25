import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-list-item.js';
import type { MoniListItem } from './moni-list-item.js';

describe('moni-list-item (P5.3 — recreated)', () => {
	let el: MoniListItem;

	beforeEach(() => {
		el = document.createElement('moni-list-item') as MoniListItem;
		el.textContent = 'Item headline';
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('defaults to lines=1', async () => {
		await el.updateComplete;
		expect(el.lines).toBe(1);
		expect(el.getAttribute('lines')).toBe('1');
	});

	it('renders the headline slot', async () => {
		await el.updateComplete;
		const headline = el.shadowRoot?.querySelector('[part="headline"]');
		expect(headline).toBeTruthy();
		const slot = headline?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Item headline');
	});

	it('does not render supporting/meta slots when lines=1', async () => {
		await el.updateComplete;
		const supporting = el.shadowRoot?.querySelector('[part="supporting"]');
		const meta = el.shadowRoot?.querySelector('[part="meta"]');
		expect(supporting).toBeFalsy();
		expect(meta).toBeFalsy();
	});

	it('renders supporting slot when lines=2', async () => {
		el.lines = 2;
		const sup = document.createElement('span');
		sup.setAttribute('slot', 'supporting');
		sup.textContent = 'Supporting text';
		el.appendChild(sup);
		await el.updateComplete;
		const supporting = el.shadowRoot?.querySelector('[part="supporting"]');
		expect(supporting).toBeTruthy();
	});

	it('renders meta slot when lines=3', async () => {
		el.lines = 3;
		const sup = document.createElement('span');
		sup.setAttribute('slot', 'supporting');
		sup.textContent = 'Line 2';
		el.appendChild(sup);
		const meta = document.createElement('span');
		meta.setAttribute('slot', 'meta');
		meta.textContent = 'Line 3';
		el.appendChild(meta);
		await el.updateComplete;
		const supporting = el.shadowRoot?.querySelector('[part="supporting"]');
		const metaEl = el.shadowRoot?.querySelector('[part="meta"]');
		expect(supporting).toBeTruthy();
		expect(metaEl).toBeTruthy();
	});

	it('reflects active and disabled attributes', async () => {
		el.active = true;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(true);

		el.disabled = true;
		await el.updateComplete;
		expect(el.hasAttribute('disabled')).toBe(true);
	});

	it('renders an avatar when the avatar attribute is set', async () => {
		el.avatar = 'https://example.com/avatar.png';
		await el.updateComplete;
		const avatar = el.shadowRoot?.querySelector('[part="avatar"]');
		expect(avatar).toBeTruthy();
	});

	it('renders a leading icon when the icon attribute is set', async () => {
		el.icon = 'home';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('[part="leading"]');
		expect(leading).toBeTruthy();
		const moniIcon = leading?.querySelector('moni-icon');
		expect(moniIcon?.getAttribute('name')).toBe('home');
	});

	it('renders a trailing icon when the trailing-icon attribute is set', async () => {
		el.setAttribute('trailing-icon', 'more_vert');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('[part="trailing"]');
		expect(trailing).toBeTruthy();
	});

	it('renders an <a> wrapper when href is set, otherwise the row is inline', async () => {
		await el.updateComplete;
		let row = el.shadowRoot?.querySelector('a');
		expect(row).toBeFalsy();

		el.href = '/profile';
		await el.updateComplete;
		row = el.shadowRoot?.querySelector('a');
		expect(row).toBeTruthy();
		expect(row?.getAttribute('href')).toBe('/profile');
	});
});