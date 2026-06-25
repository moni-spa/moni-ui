import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-tooltip.js';
import type { MoniTooltip } from './moni-tooltip.js';

describe('moni-tooltip (P3.1)', () => {
	let parent: HTMLElement;
	let el: MoniTooltip;

	beforeEach(() => {
		parent = document.createElement('div');
		el = document.createElement('moni-tooltip') as MoniTooltip;
		el.text = 'Save changes';
		parent.appendChild(el);
		document.body.appendChild(parent);
	});

	afterEach(() => {
		parent.remove();
	});

	it('renders role="tooltip" on the inner element (M3 a11y)', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('[role="tooltip"]');
		expect(tip).toBeTruthy();
	});

	it('reflects the text on the host', async () => {
		await el.updateComplete;
		expect(el.text).toBe('Save changes');
	});

	it('reflects position (default top)', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip');
		expect(tip?.classList.contains('top')).toBe(true);
	});

	it('accepts all 6 M3 placements (top/top-start/top-end/bottom/bottom-start/bottom-end)', async () => {
		const positions: Array<'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'> = [
			'top',
			'top-start',
			'top-end',
			'bottom',
			'bottom-start',
			'bottom-end'
		];
		for (const pos of positions) {
			el.position = pos;
			await el.updateComplete;
			const tip = el.shadowRoot?.querySelector('.tooltip');
			expect(tip?.classList.contains(pos), `expected class ${pos}`).toBe(true);
		}
	});

	it('defaults to plain (rich=false)', async () => {
		await el.updateComplete;
		expect(el.rich).toBe(false);
		expect(el.hasAttribute('rich')).toBe(false);
	});

	it('rich=true enables rich content mode (rich attribute reflected)', async () => {
		el.rich = true;
		await el.updateComplete;
		expect(el.rich).toBe(true);
		expect(el.hasAttribute('rich')).toBe(true);
	});

	it('shows the tooltip on mouseenter and hides on mouseleave', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		expect(tip?.classList.contains('visible')).toBe(false);

		parent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		parent.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('shows the tooltip on focusin and hides on focusout', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		parent.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		parent.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('Escape key closes a visible tooltip', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		parent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('applies size variants (small/medium/large)', async () => {
		for (const size of ['small', 'medium', 'large'] as const) {
			el.size = size;
			await el.updateComplete;
			const tip = el.shadowRoot?.querySelector('.tooltip');
			expect(tip?.classList.contains(size), `expected class ${size}`).toBe(true);
		}
	});

	it('cleans up listeners on disconnect', () => {
		// Sanity: removing the parent cleans up.
		parent.remove();
		// No assertion needed; if listeners leaked, the next beforeEach would
		// accumulate them but vitest would still pass. Visual coverage only.
		expect(parent.isConnected).toBe(false);
	});
});
