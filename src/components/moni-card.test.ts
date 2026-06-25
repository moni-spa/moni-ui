import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-card.js';
import type { MoniCard } from './moni-card.js';

describe('moni-card (P4.4 — recreated)', () => {
	let el: MoniCard;

	beforeEach(() => {
		el = document.createElement('moni-card') as MoniCard;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renders the three M3 variants: elevated (default), filled, outlined', async () => {
		expect(el.variant).toBe('elevated');
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('elevated');

		el.variant = 'filled';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('filled');

		el.variant = 'outlined';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('outlined');
	});

	it('renders media, body, and actions slots', async () => {
		await el.updateComplete;
		const media = el.shadowRoot?.querySelector('[part="media"]');
		const body = el.shadowRoot?.querySelector('[part="body"]');
		const actions = el.shadowRoot?.querySelector('[part="actions"]');
		expect(media).toBeTruthy();
		expect(body).toBeTruthy();
		expect(actions).toBeTruthy();
	});

	it('reflects clickable, draggable, and disabled attributes', async () => {
		el.clickable = true;
		await el.updateComplete;
		expect(el.hasAttribute('clickable')).toBe(true);

		el.draggable = true;
		await el.updateComplete;
		expect(el.hasAttribute('draggable')).toBe(true);

		el.disabled = true;
		await el.updateComplete;
		expect(el.hasAttribute('disabled')).toBe(true);
	});

	it('supports slotted headings via the headline slot', async () => {
		const heading = document.createElement('h3');
		heading.setAttribute('slot', 'headline');
		heading.textContent = 'Card title';
		el.appendChild(heading);
		await el.updateComplete;

		const headlineSlot = el.shadowRoot?.querySelector(
			'slot[name="headline"]'
		) as HTMLSlotElement | null;
		expect(headlineSlot).toBeTruthy();
		const assigned = headlineSlot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Card title');
	});

	it('supports the default slot for primary content', async () => {
		el.textContent = 'Body content';
		await el.updateComplete;
		// The default slot is inside the headline slot wrapper.
		const defaultSlot = el.shadowRoot?.querySelector(
			'slot:not([name])'
		) as HTMLSlotElement | null;
		expect(defaultSlot).toBeTruthy();
		const assigned = defaultSlot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Body content');
	});
});