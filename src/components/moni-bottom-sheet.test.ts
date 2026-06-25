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

	it('renders dialog closed by default', async () => {
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog).toBeTruthy();
		expect(dialog?.hasAttribute('open')).toBe(false);
	});

	it('renders open dialog when open attribute is set', async () => {
		el.open = true;
		await el.updateComplete;
		const dialog = el.shadowRoot?.querySelector('dialog');
		expect(dialog?.hasAttribute('open')).toBe(true);
	});

	it('emits close event and sets open to false when dragged down beyond threshold', async () => {
		el.open = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		// Mock setPointerCapture and releasePointerCapture
		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		// Mock getBoundingClientRect for height
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

		// Trigger pointerdown on handle
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Trigger pointermove downwards (200px down)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 600, // 200px difference
				pointerId: 1
			})
		);

		// Trigger pointerup
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 600,
				pointerId: 1
			})
		);

		// Simulate transition finishing
		dialog.dispatchEvent(new Event('transitionend'));

		await el.updateComplete;

		expect(closeSpy).toHaveBeenCalled();
		expect(el.open).toBe(false);
	});

	it('does not emit close event when dragged down less than threshold', async () => {
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
				clientY: 420, // 20px difference (below threshold of Math.min(150, 300*0.4=120))
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

	it('increases the dialog height when dragged upwards', async () => {
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

		// Trigger pointerdown
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Trigger pointermove upwards (by 50px)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 350, // clientY went from 400 to 350, so deltaY = -50
				pointerId: 1
			})
		);

		expect(dialog.style.height).toBe('350px'); // 300px + 50px

		// Trigger pointerup
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 350,
				pointerId: 1
			})
		);

		await el.updateComplete;

		// Height and transform style should be reset
		expect(dialog.style.height).toBe('');
		expect(dialog.style.transform).toBe('');
	});

	it('snaps to expanded class when dragged up beyond threshold', async () => {
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

		// Start drag
		handle.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 100,
				clientY: 400,
				pointerId: 1
			})
		);

		// Drag up by 100px (greater than 80px threshold)
		dialog.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 300, // deltaY = -100
				pointerId: 1
			})
		);

		// Release
		handle.dispatchEvent(
			new PointerEvent('pointerup', {
				bubbles: true,
				clientX: 100,
				clientY: 300,
				pointerId: 1
			})
		);

		await el.updateComplete;

		// Class list should now contain 'expanded'
		expect(dialog.classList.contains('expanded')).toBe(true);
	});

	it('teleports the element to document.body when positioning=body and open=true, and restores it when closed', async () => {
		const originalParent = el.parentNode;
		el.positioning = 'body';
		await el.updateComplete;

		// Set open to true
		el.open = true;
		await el.updateComplete;

		// Should be child of document.body
		expect(el.parentNode).toBe(document.body);

		// Set open to false
		el.open = false;
		await el.updateComplete;

		// Should be restored to original parent
		expect(el.parentNode).toBe(originalParent);
	});

	it('applies correct class for positioning=absolute and positioning=static', async () => {
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

	it('sets CSS custom property for expandedHeight', async () => {
		el.expandedHeight = '75%';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-expanded-height')).toBe('75%');

		el.expandedHeight = '600px';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-expanded-height')).toBe('600px');
	});

	it('closes the bottom sheet when clicking outside the dialog (backdrop click)', async () => {
		el.open = true;
		el.modal = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		// Click inside (target is handle): should not close
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));
		// Wait, MouseEvent dispatched on dialog directly has e.target === dialog.
		// To simulate click on handle, dispatch click event on handle, which bubbles to dialog:
		handle.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		await el.updateComplete;
		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.open).toBe(true);

		// Click outside (target is dialog itself): should close
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		// Simulate transition finishing
		dialog.dispatchEvent(new Event('transitionend'));

		await el.updateComplete;
		expect(closeSpy).toHaveBeenCalled();
		expect(el.open).toBe(false);
	});

	it('sets CSS custom property for maxWidth', async () => {
		el.maxWidth = '500px';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-max-width')).toBe('500px');

		el.maxWidth = '80%';
		await el.updateComplete;
		expect(el.style.getPropertyValue('--moni-bottom-sheet-max-width')).toBe('80%');
	});

	it('does not close the bottom sheet on backdrop click if it was just dragged', async () => {
		el.open = true;
		el.modal = true;
		await el.updateComplete;

		const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
		const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement;
		expect(dialog).toBeTruthy();
		expect(handle).toBeTruthy();

		// Mock pointer methods
		handle.setPointerCapture = vi.fn();
		handle.releasePointerCapture = vi.fn();

		const closeSpy = vi.fn();
		el.addEventListener('close', closeSpy);

		// Perform a drag gesture (pointerdown, pointermove, pointerup)
		handle.dispatchEvent(new PointerEvent('pointerdown', {
			bubbles: true,
			clientX: 100,
			clientY: 400,
			pointerId: 1
		}));
		dialog.dispatchEvent(new PointerEvent('pointermove', {
			bubbles: true,
			clientX: 100,
			clientY: 350, // 50px up drag
			pointerId: 1
		}));
		handle.dispatchEvent(new PointerEvent('pointerup', {
			bubbles: true,
			clientX: 100,
			clientY: 350,
			pointerId: 1
		}));

		// A click event immediately following the drag
		dialog.dispatchEvent(new MouseEvent('click', {
			bubbles: true,
			cancelable: true
		}));

		await el.updateComplete;
		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.open).toBe(true);
	});
});
