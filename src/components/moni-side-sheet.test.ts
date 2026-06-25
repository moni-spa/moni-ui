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

	it('initializes with default values', async () => {
		await el.updateComplete;
		expect(el.open).toBe(false);
		expect(el.modal).toBe(false);
		expect(el.side).toBe('right');
		expect(el.title).toBe('');
		expect(el.detached).toBe(false);
		expect(el.hideClose).toBe(false);
		expect(el.showBack).toBe(false);
	});

	it('reflects open state to underlaying dialog', async () => {
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		expect(dialog.open).toBe(false);

		el.open = true;
		await el.updateComplete;
		expect(dialog.open).toBe(true);
	});

	it('renders title and handles close click', async () => {
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

	it('fires back event when back button clicked', async () => {
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

	it('applies correct class for noBorder', async () => {
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog?.classList.contains('no-border')).toBe(false);

		el.noBorder = true;
		await el.updateComplete;
		expect(dialog?.classList.contains('no-border')).toBe(true);
	});

	it('renders handle and supports drag dismissal when withHandle is true', async () => {
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

		// Trigger pointer drag to the right on a right aligned sheet
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
