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

	it('renders a div with role=status and aria-live=polite (M3 spec)', async () => {
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack?.getAttribute('role')).toBe('status');
		expect(snack?.getAttribute('aria-live')).toBe('polite');
	});

	it('reflects the active attribute on the host', async () => {
		el.active = true;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(true);

		el.active = false;
		await el.updateComplete;
		expect(el.hasAttribute('active')).toBe(false);
	});

	it('reflects placement=bottom (default) and placement=top', async () => {
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack?.classList.contains('bottom')).toBe(true);

		el.placement = 'top';
		await el.updateComplete;
		const snack2 = el.shadowRoot?.querySelector('[part="snackbar"]');
		expect(snack2?.classList.contains('top')).toBe(true);
	});

	it('renders the text in the [part=text] span', async () => {
		el.text = 'File saved successfully';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('[part="text"]');
		expect(text).toBeTruthy();
		const slot = text?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const t = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(t).toBe('File saved successfully');
	});

	it('renders the action label when set', async () => {
		el.text = 'Item deleted';
		el.action = 'Undo';
		await el.updateComplete;
		const action = el.shadowRoot?.querySelector('[part="action"]');
		expect(action?.textContent).toBe('Undo');
	});

	it('max-lines defaults to 2 (M3 spec)', async () => {
		await el.updateComplete;
		expect(el.maxLines).toBe(2);
		expect(el.getAttribute('max-lines')).toBe('2');
	});

	it('max-lines can be customized via attribute', async () => {
		el.maxLines = 3;
		await el.updateComplete;
		expect(el.getAttribute('max-lines')).toBe('3');
	});

	it('max-lines is forwarded to the inner element as a CSS custom property', async () => {
		el.maxLines = 4;
		await el.updateComplete;
		const snack = el.shadowRoot?.querySelector('[part="snackbar"]') as HTMLElement;
		expect(snack.style.getPropertyValue('--_max-lines')).toBe('4');
	});
});
