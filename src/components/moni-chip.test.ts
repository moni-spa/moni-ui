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

	it('renderiza un <button> nativo', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.getAttribute('type')).toBe('button');
	});

	it('por defecto es variant=assist y size=small (especificación M3)', async () => {
		await el.updateComplete;
		expect(el.variant).toBe('assist');
		expect(el.size).toBe('small');
		expect(el.getAttribute('variant')).toBe('assist');
	});

	it('acepta las 4 variantes M3 (assist, filter, input, suggestion)', async () => {
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

	it('crea un alias de outlined → assist para compatibilidad con versiones anteriores', async () => {
		el.variant = 'outlined';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('assist')).toBe(true);
		expect(button?.classList.contains('outlined')).toBe(false);
	});

	it('crea un alias de fill → filter para compatibilidad con versiones anteriores', async () => {
		el.variant = 'fill';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('filter')).toBe(true);
		expect(button?.classList.contains('fill')).toBe(false);
	});

	it('el chip seleccionado aplica la clase selected', async () => {
		el.selected = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('selected')).toBe(true);
	});

	it('la variante input siempre muestra el icono trailing de eliminar (especificación M3)', async () => {
		el.variant = 'input';
		el.textContent = 'Tag';
		await el.updateComplete;
		const remove = el.shadowRoot?.querySelector('[part="remove"]');
		expect(remove).toBeTruthy();
	});

	it('removable=true fuerza el icono trailing de eliminar en cualquier variante', async () => {
		el.variant = 'assist';
		el.removable = true;
		el.textContent = 'Tag';
		await el.updateComplete;
		const remove = el.shadowRoot?.querySelector('[part="remove"]');
		expect(remove).toBeTruthy();
	});

	it('los chips assist y suggestion NO muestran el icono de eliminar por defecto', async () => {
		for (const v of ['assist', 'suggestion'] as const) {
			el.variant = v;
			el.removable = false;
			el.textContent = 'Tag';
			await el.updateComplete;
			const remove = el.shadowRoot?.querySelector('[part="remove"]');
			expect(remove).toBeFalsy();
		}
	});

	it('el atributo icon renderiza un moni-icon leading', async () => {
		el.icon = 'add';
		el.textContent = 'Add';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(icon).toBeTruthy();
		expect(icon?.getAttribute('name')).toBe('add');
	});

	it('size=medium establece la clase medium en el botón', async () => {
		el.size = 'medium';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('medium')).toBe(true);
	});

	it('size=large establece la clase large en el botón', async () => {
		el.size = 'large';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('shape=square establece la clase square (objetivo de transformación de botón M3)', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('square')).toBe(true);
	});

	it('disabled deshabilita el botón interno', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('loading muestra moni-progress y establece aria-busy', async () => {
		el.loading = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('moni-progress');
		const button = el.shadowRoot?.querySelector('button');
		expect(progress).toBeTruthy();
		expect(button?.getAttribute('aria-busy')).toBe('true');
	});

	it('renderiza el contenido del slot por defecto dentro de [part=label]', async () => {
		el.textContent = 'Hello chip';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
		const slot = label?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Hello chip');
	});

	it('aplica la clase has-icon solo cuando hay un icono leading presente', async () => {
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
