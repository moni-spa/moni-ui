import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-bottom-sheet.js';
import type { MoniBottomSheet } from './moni-bottom-sheet.js';

describe('moni-bottom-sheet', () => {
	let el: MoniBottomSheet;

	beforeEach(() => {
		el = document.createElement('moni-bottom-sheet') as MoniBottomSheet;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza el diálogo cerrado por defecto', async () => {
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog).toBeTruthy();
		expect(dialog?.hasAttribute('open')).toBe(false);
	});

	it('renderiza el diálogo abierto cuando el atributo open está establecido', async () => {
		el.open = true;
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog?.hasAttribute('open')).toBe(true);
	});

	it('emite el evento close y establece open en false cuando se arrastra hacia abajo más allá del umbral', async () => {
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		// Simular setPointerCapture y releasePointerCapture
		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		// Simular getBoundingClientRect para la altura
		vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
			height: 300,
			width: 375,
			x: 0,
			y: 300,
			top: 300,
			bottom: 600,
			left: 0,
			right: 375,
			toJSON: () => {}
		});

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		// Desencadenar pointerdown en el handle
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Desencadenar pointermove hacia abajo (200px)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 600, // 200px difference
				pointerId: 1
			})
		);

		// Desencadenar pointerup
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 600,
				pointerId: 1
			})
		);

		// Simular la finalización de la transición
		dialog.dispatchEvent(new Event('transitionend'));

		await el.updateComplete;

		expect(closeSpy).toHaveBeenCalled();
		expect(el.open).toBe(false);
	});

	it('no emite el evento close cuando se arrastra hacia abajo menos del umbral', async () => {
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;

		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
			height: 300,
			width: 375,
			x: 0,
			y: 300,
			top: 300,
			bottom: 600,
			left: 0,
			right: 375,
			toJSON: () => {}
		});

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 420, // 20px de diferencia (por debajo del umbral de Math.min(150, 300*0.4=120))
				pointerId: 1
			})
		);

		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 420,
				pointerId: 1
			})
		);

		await el.updateComplete;

		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.open).toBe(true);
	});

	it('aumenta la altura del diálogo cuando se arrastra hacia arriba', async () => {
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;

		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
			height: 300,
			width: 375,
			x: 0,
			y: 300,
			top: 300,
			bottom: 600,
			left: 0,
			right: 375,
			toJSON: () => {}
		});

		// Desencadenar pointerdown
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Desencadenar pointermove hacia arriba (por 50px)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 350, // clientY pasó de 400 a 350, así que deltaY = -50
				pointerId: 1
			})
		);

		expect(dialog.style.height).toBe('350px'); // 300px + 50px

		// Desencadenar pointerup
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 350,
				pointerId: 1
			})
		);

		await el.updateComplete;

		// La altura y el estilo de transformación deben restablecerse
		expect(dialog.style.height).toBe('');
		expect(dialog.style.transform).toBe('');
	});

	it('se ajusta a la clase expanded cuando se arrastra hacia arriba más allá del umbral', async () => {
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;

		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
			height: 300,
			width: 375,
			x: 0,
			y: 300,
			top: 300,
			bottom: 600,
			left: 0,
			right: 375,
			toJSON: () => {}
		});

		// Iniciar arrastre
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Arrastrar hacia arriba 100px (mayor al umbral de 80px)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 300, // deltaY = -100
				pointerId: 1
			})
		);

		// Soltar
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 300,
				pointerId: 1
			})
		);

		await el.updateComplete;

		// La lista de clases ahora debería contener 'expanded'
		expect(dialog.classList.contains('expanded')).toBe(true);
	});

	it('teletransporta el elemento a document.body cuando positioning=body y open=true, y lo restaura al cerrarse', async () => {
		const originalParent = el.parentNode;
		el.positioning = 'body';
		await el.updateComplete;

		// Establecer open en true
		el.open = true;
		await el.updateComplete;

		// Debería ser hijo de document.body
		expect(el.parentNode).toBe(document.body);

		// Establecer open en false
		el.open = false;
		await el.updateComplete;

		// Debería restaurarse al padre original
		expect(el.parentNode).toBe(originalParent);
	});

	it('aplica la clase correcta para positioning=absolute y positioning=static', async () => {
		const dialog = el.shadowRoot?.querySelector('dialog');
		
		el.positioning = 'absolute';
		await el.updateComplete;
		expect(dialog?.classList.contains('absolute')).toBe(true);
		expect(dialog?.classList.contains('fixed')).toBe(false);

		el.positioning = 'static';
		await el.updateComplete;
		expect(dialog?.classList.contains('static')).toBe(true);
		expect(dialog?.classList.contains('absolute')).toBe(false);
	});

	it('establece la propiedad personalizada CSS para expandedHeight', async () => {
		el.expandedHeight = '75%';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-expanded-height')).toBe('75%');

		el.expandedHeight = '600px';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-expanded-height')).toBe('600px');
	});

	it('cierra el bottom sheet al hacer clic fuera del diálogo (clic en el backdrop)', async () => {
		el.open = true;
		el.modal = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		// Clic adentro (el objetivo es handle): no debería cerrarse
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));
		// Espera, MouseEvent despachado directamente en dialog tiene e.target === dialog.
		// Para simular el clic en el handle, despachar el evento click en el handle, que burbujea hasta el diálogo:
		handle.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		await el.updateComplete;
		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.open).toBe(true);

		// Clic afuera (el objetivo es el propio diálogo): debería cerrarse
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		// Simular la finalización de la transición
		dialog.dispatchEvent(new Event('transitionend'));

		await el.updateComplete;
		expect(closeSpy).toHaveBeenCalled();
		expect(el.open).toBe(false);
	});

	it('establece la propiedad personalizada CSS para maxWidth', async () => {
		el.maxWidth = '500px';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-max-width')).toBe('500px');

		el.maxWidth = '80%';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-max-width')).toBe('80%');
	});

	it('no cierra el bottom sheet al hacer clic en el backdrop si acaba de ser arrastrado', async () => {
		el.open = true;
		el.modal = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		// Simular métodos de puntero
		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		// Realizar un gesto de arrastre (pointerdown, pointermove, pointerup)
		handle.dispatchEvent(new PointerEvent('pointerdown', {
			bubbles: true,
			clientX: 100,
			clientY: 400,
			pointerId: 1
		}));
		dialog.dispatchEvent(new PointerEvent('pointermove', {
			bubbles: true,
			clientX: 100,
			clientY: 350, // arrastre hacia arriba de 50px
			pointerId: 1
		}));
		handle.dispatchEvent(new PointerEvent('pointerup', {
			bubbles: true,
			clientX: 100,
			clientY: 350,
			pointerId: 1
		}));

		// Un evento click inmediatamente después del arrastre
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		await el.updateComplete;
		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.open).toBe(true);
	});
});
