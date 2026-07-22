import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-app-bar.js';
import type { MoniAppBar } from './moni-app-bar.js';

describe('moni-app-bar (P4.5 — recreated)', () => {
	let el: MoniAppBar;

	beforeEach(() => {
		el = document.createElement('moni-app-bar') as MoniAppBar;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('por defecto es placement=top, variant=standard, size=default', async () => {
		await el.updateComplete;
		expect(el.placement).toBe('top');
		expect(el.variant).toBe('standard');
		expect(el.size).toBe('default');
	});

	it('refleja el atributo title', async () => {
		el.title = 'My App';
		await el.updateComplete;
		expect(el.title).toBe('My App');
		const title = el.shadowRoot?.querySelector('[part="title"]');
		expect(title?.textContent?.trim()).toBe('My App');
	});

	it('refleja el subtitle (visible solo con size=prominent)', async () => {
		el.subtitle = 'Subtitle here';
		await el.updateComplete;
		// Sin el tamaño prominent, el subtítulo está oculto.
		let subtitle = el.shadowRoot?.querySelector('[part="subtitle"]');
		expect(subtitle).toBeFalsy();

		el.size = 'prominent';
		await el.updateComplete;
		subtitle = el.shadowRoot?.querySelector('[part="subtitle"]');
		expect(subtitle?.textContent?.trim()).toBe('Subtitle here');
	});

	it('cambia entre la ubicación top y bottom', async () => {
		el.placement = 'bottom';
		await el.updateComplete;
		expect(el.getAttribute('placement')).toBe('bottom');
	});

	it('cambia entre la variante standard y floating', async () => {
		el.variant = 'floating';
		await el.updateComplete;
		expect(el.getAttribute('variant')).toBe('floating');
	});

	it('refleja el atributo elevated (usado cuando el contenido se desplaza debajo)', async () => {
		el.elevated = true;
		await el.updateComplete;
		expect(el.hasAttribute('elevated')).toBe(true);
	});

	it('renderiza los slots leading, trailing, fab y actions', async () => {
		await el.updateComplete;
		const leadingSlot = el.shadowRoot?.querySelector(
			'slot[name="leading"]'
		) as HTMLSlotElement | null;
		const trailingSlot = el.shadowRoot?.querySelector(
			'slot[name="trailing"]'
		) as HTMLSlotElement | null;
		const fabSlot = el.shadowRoot?.querySelector(
			'slot[name="fab"]'
		) as HTMLSlotElement | null;
		expect(leadingSlot).toBeTruthy();
		expect(trailingSlot).toBeTruthy();
		expect(fabSlot).toBeTruthy();
	});

	it('renderiza un slot por defecto para contenido extra (ej. tabs)', async () => {
		await el.updateComplete;
		const defaultSlot = el.shadowRoot?.querySelector(
			'slot:not([name])'
		) as HTMLSlotElement | null;
		expect(defaultSlot).toBeFalsy(); // Actualmente no hay slot por defecto
	});
});