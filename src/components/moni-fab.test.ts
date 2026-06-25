import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-fab.js';
import type { MoniFab } from './moni-fab.js';

describe('moni-fab', () => {
	let el: MoniFab;

	beforeEach(() => {
		el = document.createElement('moni-fab') as MoniFab;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a <button> with default icon "add"', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(button).toBeTruthy();
		expect(icon?.getAttribute('name')).toBe('add');
	});

	it('uses the provided icon name', async () => {
		el.icon = 'edit';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(icon?.getAttribute('name')).toBe('edit');
	});

	it('renders the label text when label is set (visible by default, no extended required)', async () => {
		el.label = 'Create';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('Create');
	});

	it('does not require extended/expanded for the label to be visible', async () => {
		el.label = 'Send';
		await el.updateComplete;
		expect(el.hasAttribute('extended')).toBe(false);
		expect(el.hasAttribute('expanded')).toBe(false);
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('Send');
	});

	it('hides the label visually when no label is set (empty span + display:none)', async () => {
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('');
	});

	it('applies shape=circle class', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
	});

	it('applies color classes (secondary/tertiary/surface)', async () => {
		el.color = 'secondary';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('secondary')).toBe(true);

		el.color = 'tertiary';
		await el.updateComplete;
		expect(button?.classList.contains('tertiary')).toBe(true);

		el.color = 'surface';
		await el.updateComplete;
		expect(button?.classList.contains('surface')).toBe(true);
	});

	it('applies size classes (small/large)', async () => {
		el.size = 'small';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('small')).toBe(true);

		el.size = 'large';
		await el.updateComplete;
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('reflects the position attribute', async () => {
		el.position = 'top-leading';
		await el.updateComplete;
		expect(el.getAttribute('position')).toBe('top-leading');
	});

	it('reflects extended and expanded attributes', async () => {
		el.extended = true;
		await el.updateComplete;
		expect(el.hasAttribute('extended')).toBe(true);

		el.expanded = true;
		await el.updateComplete;
		expect(el.hasAttribute('expanded')).toBe(true);
	});

	it('forwards disabled to the button', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('logs a deprecation warning when size="small" is used (M3 Expressive deprecates FAB small)', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// Detach and re-attach to re-run connectedCallback with the
		// deprecated size already set. The component reads the attribute
		// from the element during connect.
		el.remove();
		el.size = 'small';
		document.body.appendChild(el);
		await el.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size="small"')
		);
		expect(call, 'expected a deprecation warning to mention size="small"').toBeTruthy();
		warnSpy.mockRestore();
	});
});
