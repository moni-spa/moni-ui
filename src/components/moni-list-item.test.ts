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

	it('por defecto es lines=1', async () => {
		await el.updateComplete;
		expect(el.lines).toBe(1);
		expect(el.getAttribute('lines')).toBe('1');
	});

	it('renderiza el slot de headline', async () => {
		await el.updateComplete;
		const headline = el.shadowRoot?.querySelector('[part="headline"]');
		expect(headline).toBeTruthy();
		const slot = headline?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Item headline');
	});

	it('no renderiza los slots supporting/meta cuando lines=1', async () => {
		await el.updateComplete;
		const supporting = el.shadowRoot?.querySelector('[part="supporting"]');
		const meta = el.shadowRoot?.querySelector('[part="meta"]');
		expect(supporting).toBeFalsy();
		expect(meta).toBeFalsy();
	});

	it('renderiza el slot supporting cuando lines=2', async () => {
		el.lines = 2;
		const sup = document.createElement('span');
		sup.setAttribute('slot', 'supporting');
		sup.textContent = 'Supporting text';
		el.appendChild(sup);
		await el.updateComplete;
		const supporting = el.shadowRoot?.querySelector('[part="supporting"]');
		expect(supporting).toBeTruthy();
	});

	it('renderiza el slot meta cuando lines=3', async () => {
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

	it('refleja los atributos active y disabled', async () => {
		el.active = true;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(true);

		el.disabled = true;
		await el.updateComplete;
		expect(el.hasAttribute('disabled')).toBe(true);
	});

	it('renderiza un avatar cuando el atributo avatar está establecido', async () => {
		el.avatar = 'https://example.com/avatar.png';
		await el.updateComplete;
		const avatar = el.shadowRoot?.querySelector('[part="avatar"]');
		expect(avatar).toBeTruthy();
	});

	it('renderiza un icono leading cuando el atributo icon está establecido', async () => {
		el.icon = 'home';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('[part="leading"]');
		expect(leading).toBeTruthy();
		const moniIcon = leading?.querySelector('moni-icon');
		expect(moniIcon?.getAttribute('name')).toBe('home');
	});

	it('renderiza un icono trailing cuando el atributo trailing-icon está establecido', async () => {
		el.setAttribute('trailing-icon', 'more_vert');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('[part="trailing"]');
		expect(trailing).toBeTruthy();
	});

	it('renderiza un contenedor <a> cuando href está establecido, de lo contrario la fila es inline', async () => {
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