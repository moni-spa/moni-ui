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

	it('renderiza un .fab-menu y un <moni-fab> como activador', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu');
		const trigger = el.shadowRoot?.querySelector('moni-fab');
		expect(menu).toBeTruthy();
		expect(trigger).toBeTruthy();
	});

	it('pasa icon, size, color, shape, position al activador', async () => {
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

	it('refleja el atributo open', async () => {
		el.open = true;
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBe(true);

		el.open = false;
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBe(false);
	});

	it('refleja el atributo direction', async () => {
		el.direction = 'down';
		await el.updateComplete;
		expect(el.getAttribute('direction')).toBe('down');
	});

	it('cambia el estado open cuando se hace clic en el activador', async () => {
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

	it('el menú tiene role="menu" para la semántica del lector de pantalla', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu');
		expect(menu?.getAttribute('role')).toBe('menu');
	});

	it('la tecla Escape cierra un menú abierto', async () => {
		el.open = true;
		await el.updateComplete;
		expect(el.open).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('presionar Escape en un menú cerrado no hace nada', async () => {
		await el.updateComplete;
		expect(el.open).toBe(false);
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('hacer clic fuera del menú lo cierra', async () => {
		el.open = true;
		await el.updateComplete;

		// Despachar un clic en el body del documento (fuera del menú).
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await el.updateComplete;
		expect(el.open).toBe(false);
	});

	it('hacer clic dentro del menú no lo cierra', async () => {
		el.open = true;
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('.fab-menu') as HTMLElement;
		menu.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await el.updateComplete;
		expect(el.open).toBe(true);
	});
});
