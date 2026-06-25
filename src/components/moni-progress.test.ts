import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-progress.js';
import type { MoniProgress } from './moni-progress.js';

describe('moni-progress', () => {
	let el: MoniProgress;

	beforeEach(() => {
		el = document.createElement('moni-progress') as MoniProgress;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a progress bar container', async () => {
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress).toBeTruthy();
	});

	it('applies the indeterminate class to the progress bar container', async () => {
		el.indeterminate = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('indeterminate')).toBe(true);
	});

	it('does not apply the indeterminate class by default', async () => {
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('indeterminate')).toBe(false);
	});

	it('forwards value and max via aria attributes on progressbar', async () => {
		el.value = 42;
		el.max = 100;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector(
			'[role="progressbar"]'
		) as HTMLElement;
		expect(progress.getAttribute('aria-valuenow')).toBe('42');
		expect(progress.getAttribute('aria-valuemax')).toBe('100');
	});

	it('clamps the rendered percentage between 0 and 100', async () => {
		el.value = 150;
		el.max = 100;
		await el.updateComplete;
		const style = el.shadowRoot
			?.querySelector('[role="progressbar"]')
			?.getAttribute('style');
		expect(style).toContain('--_p: 100');

		el.value = -10;
		await el.updateComplete;
		const style2 = el.shadowRoot
			?.querySelector('[role="progressbar"]')
			?.getAttribute('style');
		expect(style2).toContain('--_p: 0');
	});

	it('renders the progress-circular container for circular variant', async () => {
		el.variant = 'circular';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-circular')).toBe(true);
	});

	it('renders circle wavy for circular-wavy variant', async () => {
		el.variant = 'circular-wavy';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-circular')).toBe(true);
	});

	it('renders progress-wavy container for wavy variant', async () => {
		el.variant = 'wavy';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-wavy')).toBe(true);
	});

	it('reflects the size attribute', async () => {
		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
	});
});
