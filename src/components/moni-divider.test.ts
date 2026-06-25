import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-divider.js';
import type { MoniDivider } from './moni-divider.js';

describe('moni-divider (P5.1 — recreated)', () => {
	let el: MoniDivider;

	beforeEach(() => {
		el = document.createElement('moni-divider') as MoniDivider;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('defaults to inset=leading', async () => {
		await el.updateComplete;
		expect(el.inset).toBe('leading');
		expect(el.getAttribute('inset')).toBe('leading');
	});

	it('reflects all three M3 insets: leading / middle / none', async () => {
		for (const inset of ['leading', 'middle', 'none'] as const) {
			el.inset = inset;
			await el.updateComplete;
			expect(el.getAttribute('inset')).toBe(inset);
		}
	});

	it('renders an empty default slot for inline content', async () => {
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot');
		expect(slot).toBeTruthy();
	});

	it('reflects the vertical attribute', async () => {
		el.setAttribute('vertical', '');
		await el.updateComplete;
		expect(el.hasAttribute('vertical')).toBe(true);
	});
});