import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MoniSideSheet } from './moni-side-sheet.js';

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
		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
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
		expect(eventFired).toBe(false);
		expect(dialog.open).toBe(true);
		dialog.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'transform' }));
		expect(eventFired).toBe(true);
		expect(dialog.matches(':not([open])')).toBe(true);
	});

	it('anima el cierre por Escape antes de cerrar el dialog nativo', async () => {
		el.modal = true;
		el.open = true;
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const cancel = new Event('cancel', { cancelable: true });
		dialog.dispatchEvent(cancel);
		await el.updateComplete;

		expect(cancel.defaultPrevented).toBe(true);
		expect(el.open).toBe(false);
		expect(dialog.open).toBe(true);
		expect(dialog.classList.contains('opened')).toBe(false);
	});

	it('oculta explícitamente el dialog cuando no tiene open', () => {
		const cssText = String(MoniSideSheet.styles).replace(/\s+/g, '');
		expect(cssText).toContain('dialog:not([open]){display:none;');
	});

	it('anula el límite nativo de dialog y ocupa todo el alto dinámico', () => {
		const cssText = String(MoniSideSheet.styles).replace(/\s+/g, '');
		expect(cssText).toContain('block-size:100dvh;');
		expect(cssText).toContain('max-block-size:100dvh;');
		expect(cssText).toContain('inset-block:0;');
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

	it('compensa los márgenes del modo detached sin desbordar el viewport', () => {
		const cssText = String(MoniSideSheet.styles).replace(/\s+/g, '');
		expect(cssText).toContain('inline-size:calc(100%-32px)');
		expect(cssText).toContain('calc(100%-32px)');
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
