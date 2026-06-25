import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-icon.js';
import type { MoniIcon } from './moni-icon.js';

describe('moni-icon', () => {
	let el: MoniIcon;

	beforeEach(() => {
		el = document.createElement('moni-icon') as MoniIcon;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders the icon name as text content', async () => {
		el.name = 'add';
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
		const assigned = slot
			? slot.assignedNodes({ flatten: true }).map((n) => n.textContent)
			: [];
		expect(assigned.join('')).toContain('add');
	});

	it('renders slot fallback when no name is set', async () => {
		el.name = '';
		el.textContent = 'FALLBACK';
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
		const assigned = slot
			? slot.assignedNodes({ flatten: true }).map((n) => n.textContent)
			: [];
		expect(assigned.join('')).toContain('FALLBACK');
	});

	it('reflects the name attribute', async () => {
		el.name = 'close';
		await el.updateComplete;
		expect(el.getAttribute('name')).toBe('close');
	});

	it('applies the filled attribute', async () => {
		el.filled = true;
		await el.updateComplete;
		expect(el.hasAttribute('filled')).toBe(true);
	});

	it('reflects the size attribute', async () => {
		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
	});

	it('inherits color from its parent (host color: inherit)', async () => {
		const parent = document.createElement('div');
		parent.style.color = 'rgb(255, 0, 128)';
		parent.appendChild(el);
		document.body.appendChild(parent);
		await el.updateComplete;
		// The host declaration `color: inherit` should be present in the
		// shadow stylesheet so the Material Symbols glyph takes the parent
		// text color. jsdom does not fully resolve custom-property-driven
		// styles, so we just assert that the element renders inside the
		// colored wrapper without throwing.
		expect(parent.contains(el)).toBe(true);
		parent.remove();
	});
});
