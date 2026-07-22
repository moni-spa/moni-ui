import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-side-sheet.js';
import type { MoniSideSheet } from './moni-side-sheet.js';

describe('moni-side-sheet', () => {
	let el: MoniSideSheet;

	beforeEach(() => {
		el = document.createElement('moni-side-sheet') as MoniSideSheet;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('se inicializa con valores por defecto', async () => {
		await el.updateComplete;
		expect(el.open).toBe(false);
		expect(el.modal).toBe(false);
		expect(el.side).toBe('right');
		expect(el.title).toBe('');
		expect(el.detached).toBe(false);
		expect(el.hideClose).toBe(false);
		expect(el.showBack).toBe(false);
	});

	it('refleja el estado open al dialog subyacente', async () => {
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		expect(dialog.open).toBe(false);

		el.open = true;
		await el.updateComplete;
		expect(dialog.open).toBe(true);
	});

	it('renderiza el título y maneja el clic de cerrar', async () => {
		el.title = 'Configuración';
		el.open = true;
		await el.updateComplete;

		const headline = el.shadowRoot?.querySelector('.headline') as HTMLHeadingElement;
		expect(headline.textContent?.trim()).toBe('Configuración');

		let eventFired = false;
		el.addEventListener('close', () => {
			eventFired = true;
		});

		const closeBtn = el.shadowRoot?.querySelector('moni-button[aria-label="Cerrar"]') as HTMLElement;
		expect(closeBtn).toBeTruthy();
		closeBtn.click();

		await el.updateComplete;
		expect(el.open).toBe(false);
		expect(eventFired).toBe(true);
	});

	it('dispara el evento back cuando se hace clic en el botón de volver', async () => {
		el.showBack = true;
		await el.updateComplete;

		let backFired = false;
		el.addEventListener('back', () => {
			backFired = true;
		});

		const backBtn = el.shadowRoot?.querySelector('moni-button[aria-label="Volver"]') as HTMLElement;
		expect(backBtn).toBeTruthy();
		backBtn.click();

		expect(backFired).toBe(true);
	});

	it('aplica la clase correcta para noBorder', async () => {
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog?.classList.contains('no-border')).toBe(false);

		el.noBorder = true;
		await el.updateComplete;
		expect(dialog?.classList.contains('no-border')).toBe(true);
	});

	it('renderiza el tirador (handle) y soporta el cierre por arrastre cuando withHandle es true', async () => {
		el.withHandle = true;
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(handle).toBeTruthy();

		// Mock pointer functions
		handle.setPointerCapture = () => {};
		handle.releasePointerCapture = () => {};

		// Mock getBoundingClientRect
		dialog.getBoundingClientRect = () => ({
			width: 400,
			height: 800,
			top: 0,
			bottom: 800,
			left: 0,
			right: 400,
			x: 0,
			y: 0,
			toJSON: () => {}
		});

		let closeFired = false;
		el.addEventListener('close', () => {
			closeFired = true;
		});

		// Activar el arrastre del puntero hacia la derecha en una hoja alineada a la derecha
		handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 300, pointerId: 1 }));
		dialog.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 550, pointerId: 1 })); // 250px right (greater than 400 * 0.4 = 160px)
		handle.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 550, pointerId: 1 }));

		// Simulate transitionend
		dialog.dispatchEvent(new Event('transitionend'));

		await el.updateComplete;
		expect(closeFired).toBe(true);
		expect(el.open).toBe(false);
	});
});
