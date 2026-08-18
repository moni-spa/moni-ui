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

	it('renderiza un <moni-menu> en el shadow DOM', async () => {
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu).toBeTruthy();
	});

	it('refleja placement=bottom (por defecto)', async () => {
		await el.updateComplete;
		expect(el.placement).toBe('bottom');
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.getAttribute('placement')).toBe('bottom');
	});

	it('refleja los cambios de placement en el menú interno', async () => {
		el.placement = 'top';
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.getAttribute('placement')).toBe('top');
	});

	it('refleja el atributo flip en el host', async () => {
		el.flip = true;
		await el.updateComplete;
		expect(el.hasAttribute('flip')).toBe(true);
	});

	it('abre el menú al hacer clic derecho en el padre', async () => {
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

	it('reserva ancho para la superficie y limita la coordenada al viewport', async () => {
		await el.updateComplete;
		parent.dispatchEvent(new MouseEvent('contextmenu', {
			bubbles: true,
			clientX: window.innerWidth + 500,
			clientY: 75
		}));
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('moni-menu');
		const host = el.shadowRoot?.querySelector('.menu-host') as HTMLElement;
		const x = Number(host.style.getPropertyValue('--_x').replace('px', ''));
		expect(menu?.hasAttribute('no-wrap')).toBe(true);
		expect(x).toBeLessThanOrEqual(window.innerWidth - 192 - 8);
	});

	it('cierra el menú al hacer clic en el documento', async () => {
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

	it('cierra el menú al presionar Escape', async () => {
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

	it('no llama a showPopover (solo visual; sin API Popover)', async () => {
		// Sanidad: el componente es solo visual. El moni-menu interior maneja
		// el atributo active vía visibility/opacity de CSS. No hay popover nativo
		// de cambio.
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('moni-menu');
		expect(menu?.hasAttribute('popover')).toBe(false);
	});
});
