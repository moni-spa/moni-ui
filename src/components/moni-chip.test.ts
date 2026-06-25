import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-chip.js';
import type { MoniChip } from './moni-chip.js';

describe('moni-chip', () => {
	let el: MoniChip;

	beforeEach(() => {
		el = document.createElement('moni-chip') as MoniChip;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders a native <button>', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.getAttribute('type')).toBe('button');
	});

	it('defaults to variant=assist and size=small (M3 spec)', async () => {
		await el.updateComplete;
		expect(el.variant).toBe('assist');
		expect(el.size).toBe('small');
		expect(el.getAttribute('variant')).toBe('assist');
	});

	it('accepts all 4 M3 variants (assist, filter, input, suggestion)', async () => {
		const variants: Array<'assist' | 'filter' | 'input' | 'suggestion'> = [
			'assist',
			'filter',
			'input',
			'suggestion'
		];
		for (const v of variants) {
			el.variant = v;
			await el.updateComplete;
			expect(el.getAttribute('variant')).toBe(v);
			const button = el.shadowRoot?.querySelector('button');
			expect(button?.classList.contains(v)).toBe(true);
		}
	});

	it('aliases outlined → assist for backward compat', async () => {
		el.variant = 'outlined';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('assist')).toBe(true);
		expect(button?.classList.contains('outlined')).toBe(false);
	});

	it('aliases fill → filter for backward compat', async () => {
		el.variant = 'fill';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('filter')).toBe(true);
		expect(button?.classList.contains('fill')).toBe(false);
	});

	it('selected chip applies the selected class', async () => {
		el.selected = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('selected')).toBe(true);
	});

	it('input variant always shows the trailing remove icon (M3 spec)', async () => {
		el.variant = 'input';
		el.textContent = 'Tag';
		await el.updateComplete;
		const remove = el.shadowRoot?.querySelector('[part="remove"]');
		expect(remove).toBeTruthy();
	});

	it('removable=true forces the trailing remove icon on any variant', async () => {
		el.variant = 'assist';
		el.removable = true;
		el.textContent = 'Tag';
		await el.updateComplete;
		const remove = el.shadowRoot?.querySelector('[part="remove"]');
		expect(remove).toBeTruthy();
	});

	it('assist and suggestion chips do NOT show remove icon by default', async () => {
		for (const v of ['assist', 'suggestion'] as const) {
			el.variant = v;
			el.removable = false;
			el.textContent = 'Tag';
			await el.updateComplete;
			const remove = el.shadowRoot?.querySelector('[part="remove"]');
			expect(remove).toBeFalsy();
		}
	});

	it('icon attribute renders a leading moni-icon', async () => {
		el.icon = 'add';
		el.textContent = 'Add';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(icon).toBeTruthy();
		expect(icon?.getAttribute('name')).toBe('add');
	});

	it('size=medium sets medium class on the button', async () => {
		el.size = 'medium';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('medium')).toBe(true);
	});

	it('size=large sets large class on the button', async () => {
		el.size = 'large';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('shape=square sets square class (M3 button morph target)', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('square')).toBe(true);
	});

	it('disabled disables the inner button', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('loading shows moni-progress and sets aria-busy', async () => {
		el.loading = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('moni-progress');
		const button = el.shadowRoot?.querySelector('button');
		expect(progress).toBeTruthy();
		expect(button?.getAttribute('aria-busy')).toBe('true');
	});

	it('renders the default slot content inside [part=label]', async () => {
		el.textContent = 'Hello chip';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
		const slot = label?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Hello chip');
	});

	it('applies has-icon class only when a leading icon is present', async () => {
		el.textContent = 'Filter';
		await el.updateComplete;
		let button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('has-icon')).toBe(false);

		el.icon = 'check';
		await el.updateComplete;
		button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('has-icon')).toBe(true);
	});
});
