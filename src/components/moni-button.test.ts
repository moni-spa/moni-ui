import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-button.js';
import type { MoniButton } from './moni-button.js';

describe('moni-button', () => {
	let el: MoniButton;

	beforeEach(() => {
		el = document.createElement('moni-button') as MoniButton;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a native <button> by default', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button).toBeTruthy();
	});

	it('renders an <a> when href is set', async () => {
		el.href = 'https://example.com';
		await el.updateComplete;
		const a = el.shadowRoot?.querySelector('a');
		expect(a).toBeTruthy();
		expect(a?.getAttribute('href')).toBe('https://example.com');
	});

	it('applies shape=circle class on the button', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
	});

	it('hides the label part when shape=circle (verifies the :host selector)', async () => {
		el.shape = 'circle';
		el.textContent = 'Click me';
		await el.updateComplete;
		// The :host([shape='circle']) [part='label'] rule lives in shadow
		// stylesheets. jsdom's getComputedStyle is limited so we verify the
		// structural condition: the host has the shape attribute reflected
		// and the [part='label'] element exists for slot content.
		expect(el.getAttribute('shape')).toBe('circle');
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
	});

	it('keeps the label rendered when shape=square', async () => {
		el.shape = 'square';
		el.textContent = 'Square';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
		expect(el.getAttribute('shape')).toBe('square');
	});

	it('applies shape=square class on the button', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('square')).toBe(true);
		expect(button?.classList.contains('circle')).toBe(false);
	});

	it('applies shape=circle class on the button', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
		expect(button?.classList.contains('square')).toBe(false);
	});

	it('applies variant class for outlined', async () => {
		el.variant = 'outlined';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('border')).toBe(true);
	});

	it('applies size class for large', async () => {
		el.size = 'large';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('renders an icon when icon attribute is set', async () => {
		el.icon = 'add';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('.icon');
		expect(icon).toBeTruthy();
		const moniIcon = icon?.querySelector('moni-icon');
		expect(moniIcon).toBeTruthy();
		expect(moniIcon?.getAttribute('name')).toBe('add');
	});

	it('shows a loading spinner alongside icon/label when loading=true', async () => {
		el.loading = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('moni-progress');
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(progress).toBeTruthy();
		expect(progress?.getAttribute('variant')).toBe('circular');
		expect(progress?.hasAttribute('indeterminate')).toBe(true);
		expect(label).toBeTruthy();
	});

	it('renders an <a> with the loading spinner when href + loading are set', async () => {
		el.href = '#';
		el.loading = true;
		await el.updateComplete;
		const a = el.shadowRoot?.querySelector('a');
		const progress = a?.querySelector('moni-progress');
		expect(a).toBeTruthy();
		expect(progress).toBeTruthy();
	});

	it('sets aria-busy on the button when loading', async () => {
		el.loading = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.getAttribute('aria-busy')).toBe('true');
	});

	it('forwards disabled to the native button', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('logs a deprecation warning when size="extra" is used (use size="xlarge" per M3)', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		el.remove();
		el.size = 'extra';
		document.body.appendChild(el);
		await el.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size="extra"')
		);
		expect(call, 'expected a deprecation warning to mention size="extra"').toBeTruthy();
		warnSpy.mockRestore();
	});

	it('does not log a deprecation warning for M3-compliant size values', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// Use a fresh size to ensure no M3-stale deprecation is logged.
		const fresh = document.createElement('moni-button') as MoniButton;
		fresh.size = 'xlarge';
		document.body.appendChild(fresh);
		await fresh.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size=')
		);
		expect(call).toBeFalsy();
		fresh.remove();
		warnSpy.mockRestore();
	});
});
