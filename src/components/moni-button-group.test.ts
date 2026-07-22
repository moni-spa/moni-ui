import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-button.js';
import './moni-button-group.js';
import type { MoniButtonGroup } from './moni-button-group.js';
import type { MoniButton } from './moni-button.js';

describe('moni-button-group', () => {
	let group: MoniButtonGroup;

	beforeEach(() => {
		group = document.createElement('moni-button-group') as MoniButtonGroup;
		document.body.appendChild(group);
	});

	afterEach(() => {
		group.remove();
	});

	it('propaga el tamaño a los botones hijos', async () => {
		group.size = 'large';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		expect(btn1.getAttribute('size')).toBe('large');
		expect(btn2.getAttribute('size')).toBe('large');
	});

	it('establece las formas apropiadas para la variante connected', async () => {
		group.variant = 'connected';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		const btn3 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);
		group.appendChild(btn3);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;
		await btn3.updateComplete;

		expect(btn1.getAttribute('shape')).toBe('left-round-flat');
		expect(btn2.getAttribute('shape')).toBe('no-round');
		expect(btn3.getAttribute('shape')).toBe('right-round-flat');
	});

	it('usa formas redondeadas para la variante connected cuando se establece un gap', async () => {
		group.variant = 'connected';
		group.gap = '8px';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		expect(btn1.getAttribute('shape')).toBe('left-round');
		expect(btn2.getAttribute('shape')).toBe('right-round');
	});

	it('gestiona los toggles activos en modo de selección única (multi=false)', async () => {
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		// Clic en btn1
		btn1.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(true);
		expect(btn2.active).toBe(false);

		// Clic en btn2
		btn2.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(false);
		expect(btn2.active).toBe(true);
	});

	it('gestiona los toggles activos en modo de selección múltiple (multi=true)', async () => {
		group.multi = true;
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.appendChild(btn1);
		group.appendChild(btn2);

		await group.updateComplete;
		await btn1.updateComplete;
		await btn2.updateComplete;

		btn1.click();
		btn2.click();
		await btn1.updateComplete;
		await btn2.updateComplete;
		expect(btn1.active).toBe(true);
		expect(btn2.active).toBe(true);
	});

	it('renderiza role="group" en el contenedor por defecto (accesibilidad M3)', async () => {
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('role')).toBe('group');
	});

	it('soporta la sobrescritura de role="toolbar" para grupos de acciones de la aplicación', async () => {
		group.role = 'toolbar';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('role')).toBe('toolbar');
	});

	it('reenvía aria-label al contenedor', async () => {
		group.label = 'Text formatting';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('aria-label')).toBe('Text formatting');
	});

	it('reenvía aria-labelledby al contenedor', async () => {
		group.labelledBy = 'group-title';
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		expect(container?.getAttribute('aria-labelledby')).toBe('group-title');
	});

	it('no emite aria-label cuando la etiqueta está vacía (limpieza de accesibilidad M3)', async () => {
		await group.updateComplete;
		const container = group.shadowRoot?.querySelector('[part="container"]');
		// el atributo aria-label debería estar ausente o ser una cadena vacía;
		// usar nothing en lit elimina el atributo por completo.
		const aria = container?.getAttribute('aria-label');
		expect(aria === null || aria === '').toBe(true);
	});
});
