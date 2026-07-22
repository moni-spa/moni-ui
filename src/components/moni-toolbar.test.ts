import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-toolbar.js';
import type { MoniToolbar } from './moni-toolbar.js';

describe('moni-toolbar (P5.4 — recreated)', () => {
	let el: MoniToolbar;

	beforeEach(() => {
		el = document.createElement('moni-toolbar') as MoniToolbar;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('type=standard por defecto', async () => {
		await el.updateComplete;
		expect(el.type).toBe('standard');
		expect(el.getAttribute('type')).toBe('standard');
	});

	it('renderiza un contenedor <header>', async () => {
		await el.updateComplete;
		const header = el.shadowRoot?.querySelector('header');
		expect(header).toBeTruthy();
		expect(header?.getAttribute('part')).toBe('container');
	});

	it('renderiza el atributo title en el span de título', async () => {
		el.title = 'My App';
		await el.updateComplete;
		const title = el.shadowRoot?.querySelector('[part="title"]');
		expect(title?.textContent?.trim()).toBe('My App');
	});

	it('soporta slot de respaldo (fallback) cuando el atributo title está vacío', async () => {
		const heading = document.createElement('h1');
		heading.textContent = 'Slotted Title';
		el.appendChild(heading);
		await el.updateComplete;
		const title = el.shadowRoot?.querySelector('[part="title"]');
		const slot = title?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Slotted Title');
	});

	it('renderiza los slots leading y trailing', async () => {
		const leading = document.createElement('button');
		leading.setAttribute('slot', 'leading');
		leading.textContent = 'Menu';
		const trailing = document.createElement('button');
		trailing.setAttribute('slot', 'trailing');
		trailing.textContent = 'Search';
		el.appendChild(leading);
		el.appendChild(trailing);
		await el.updateComplete;

		const leadingSlot = el.shadowRoot
			?.querySelector('[part="leading"] slot') as HTMLSlotElement | null;
		const trailingSlot = el.shadowRoot
			?.querySelector('[part="trailing"] slot') as HTMLSlotElement | null;

		expect(leadingSlot?.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
		expect(trailingSlot?.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
	});

	it('cambia al tipo floating', async () => {
		el.type = 'floating';
		await el.updateComplete;
		expect(el.getAttribute('type')).toBe('floating');
		const header = el.shadowRoot?.querySelector('header');
		expect(header).toBeTruthy();
	});

	it('refleja el atributo scroll', async () => {
		el.scrolled = true;
		await el.updateComplete;
		expect(el.hasAttribute('scroll')).toBe(true);
	});

	it('reserva un slot para el action-button', async () => {
		const fab = document.createElement('button');
		fab.setAttribute('slot', 'action-button');
		fab.textContent = '+';
		el.appendChild(fab);
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot[name="action-button"]') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		expect(assigned.length).toBeGreaterThan(0);
	});
});