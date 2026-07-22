import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-snackbar.js';
import type { MoniSnackbar } from './moni-snackbar.js';

describe('moni-snackbar', () => {
	let el: MoniSnackbar;

	beforeEach(() => {
		el = document.createElement('moni-snackbar') as MoniSnackbar;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un div con role=status y aria-live=polite (especificación M3)', async () => {
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack?.getAttribute('role')).toBe('status');
		expect(snack?.getAttribute('aria-live')).toBe('polite');
	});

	it('refleja el atributo active en el host', async () => {
		el.active = true;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(true);

		el.active = false;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(false);
	});

	it('refleja placement=bottom (por defecto) y placement=top', async () => {
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack?.classList.contains('bottom')).toBe(true);

		el.placement = 'top';
		await el.updateComplete;
		const snack2 = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack2?.classList.contains('top')).toBe(true);
	});

	it('renderiza el texto en el span [part=text]', async () => {
		el.text = 'File saved successfully';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('[part="text"]');
		expect(text).toBeTruthy();
		const slot = text?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const t = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(t).toBe('File saved successfully');
	});

	it('renderiza la etiqueta de acción cuando está establecida', async () => {
		el.text = 'Item deleted';
		el.action = 'Undo';
		await el.updateComplete;
		const action = el.shadowRoot?.querySelector('[part="action"]');
		expect(action?.textContent).toBe('Undo');
	});

	it('max-lines es 2 por defecto (especificación M3)', async () => {
		await el.updateComplete;
		expect(el.maxLines).toBe(2);
		expect(el.getAttribute('max-lines')).toBe('2');
	});

	it('max-lines se puede personalizar mediante atributo', async () => {
		el.maxLines = 3;
		await el.updateComplete;
		expect(el.getAttribute('max-lines')).toBe('3');
	});

	it('max-lines se reenvía al elemento interno como una propiedad personalizada de CSS', async () => {
		el.maxLines = 4;
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]') as HTMLElement;
		expect(snack.style.getPropertyValue('--_max-lines')).toBe('4');
	});
});
