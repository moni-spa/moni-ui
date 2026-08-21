import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-select.js';
import './moni-select-option.js';
import type { MoniSelect } from './moni-select.js';

describe('moni-select', () => {
	let el: MoniSelect;

	beforeEach(() => {
		el = document.createElement('moni-select') as MoniSelect;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
		vi.restoreAllMocks();
	});

	it('renderiza el input activador (trigger)', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('readonly')).toBe('');
	});

	it('analiza las opciones insertadas en slots (slotted)', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.textContent = 'Option 1';
		const opt2 = document.createElement('option');
		opt2.setAttribute('value', 'v2');
		opt2.textContent = 'Option 2';

		el.appendChild(opt1);
		el.appendChild(opt2);

		// Esperar a slotchange y actualización
		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const items = el.shadowRoot?.querySelectorAll('.option-item');
		expect(items?.length).toBe(2);
		expect(items?.[0].textContent?.trim()).toBe('Option 1');
		expect(items?.[1].textContent?.trim()).toBe('Option 2');
	});

	it('alterna abrir/cerrar el dropdown al hacer clic', async () => {
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		const menu = el.shadowRoot?.querySelector('.dropdown-menu');
		
		expect(menu?.classList.contains('open')).toBe(false);
		
		input.click();
		await el.updateComplete;
		expect(menu?.classList.contains('open')).toBe(true);

		input.click();
		await el.updateComplete;
		expect(menu?.classList.contains('open')).toBe(false);
	});

	it('dispara el evento input/change y actualiza el valor al seleccionar', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.textContent = 'Option 1';
		el.appendChild(opt1);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		let eventFired = false;
		el.addEventListener('change', () => {
			eventFired = true;
		});

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const item = el.shadowRoot?.querySelector('.option-item') as HTMLElement;
		item.click();
		await el.updateComplete;

		expect(el.value).toBe('v1');
		expect(eventFired).toBe(true);
	});

	it('filtra opciones al buscar y escribir (searchable)', async () => {
		el.searchable = true;
		
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'banana');
		opt2.textContent = 'Banana';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = 'ap';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		const items = el.shadowRoot?.querySelectorAll('.option-item');
		expect(items?.length).toBe(1);
		expect(items?.[0].textContent?.trim()).toBe('Apple');
	});

	it('autoselecciona la opción cuando se escribe una coincidencia exacta', async () => {
		el.searchable = true;
		
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'banana');
		opt2.textContent = 'Banana';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = 'banana';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		expect(el.value).toBe('banana');
	});

	it('renderiza encabezados de subcategoría de grupo', async () => {
		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'v1');
		opt1.setAttribute('group', 'Fruits');
		opt1.textContent = 'Apple';

		const opt2 = document.createElement('moni-select-option');
		opt2.setAttribute('value', 'v2');
		opt2.setAttribute('group', 'Vegetables');
		opt2.textContent = 'Carrot';

		el.appendChild(opt1);
		el.appendChild(opt2);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const headers = el.shadowRoot?.querySelectorAll('.group-header');
		expect(headers?.length).toBe(2);
		expect(headers?.[0].querySelector('span')?.textContent?.trim()).toBe('Fruits');
		expect(headers?.[1].querySelector('span')?.textContent?.trim()).toBe('Vegetables');
	});

	it('mantiene flyouts anidados cuando todos los niveles caben en pantalla', async () => {
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900);
		vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1600);
		vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
			top: 80,
			bottom: 136,
			left: 100,
			right: 300,
			width: 200,
			height: 56,
			x: 100,
			y: 80,
			toJSON: () => ({})
		} as DOMRect);

		const option = document.createElement('moni-select-option');
		option.setAttribute('value', 'nested');
		option.setAttribute('group', 'Nivel 1/Nivel 2');
		option.textContent = 'Opción anidada';
		el.appendChild(option);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.classList.contains('inline-categories')).toBe(false);
		expect(menu.querySelectorAll('.submenu').length).toBe(2);
		expect(menu.querySelector('.submenu .submenu')).toBeTruthy();
	});

	it('convierte subcategorías profundas en un drilldown navegable sin recortarlas', async () => {
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
		vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(900);
		vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
			top: 80,
			bottom: 136,
			left: 350,
			right: 550,
			width: 200,
			height: 56,
			x: 350,
			y: 80,
			toJSON: () => ({})
		} as DOMRect);

		const option = document.createElement('moni-select-option');
		option.setAttribute('value', 'deep');
		option.setAttribute('group', 'Nivel 1/Nivel 2/Nivel 3/Nivel 4/Nivel 5');
		option.textContent = 'Opción profunda';
		el.appendChild(option);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.classList.contains('inline-categories')).toBe(true);
		expect(menu.classList.contains('scrollable')).toBe(true);
		expect(menu.querySelector('.drilldown-wrapper')).toBeTruthy();
		expect(menu.querySelector('.submenu')).toBeNull();

		const firstGroup = menu.querySelector('.group-header') as HTMLElement;
		firstGroup.click();
		await el.updateComplete;
		expect(menu.textContent).toContain('Regresar');
		expect(menu.textContent).toContain('Nivel 2');
	});

	it('limpia la selección cuando el input se vacía y clearable es true', async () => {
		el.searchable = true;
		el.clearable = true;
		el.value = 'apple';

		const opt1 = document.createElement('moni-select-option');
		opt1.setAttribute('value', 'apple');
		opt1.textContent = 'Apple';
		el.appendChild(opt1);

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		input.value = '';
		input.dispatchEvent(new Event('input'));
		await el.updateComplete;

		expect(el.value).toBe('');
	});

	it('renderiza el cajón bottom sheet cuando sheet es true', async () => {
		el.sheet = true;
		await el.updateComplete;

		const drawer = el.shadowRoot?.querySelector('.sheet-drawer');
		expect(drawer).toBeTruthy();
	});

	it('aplica estilos de posicionamiento fijo cuando positioning es fixed', async () => {
		el.positioning = 'fixed';
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu?.style.position).toBe('fixed');
	});

	it('cierra cualquier otro select antes de abrir uno nuevo', async () => {
		const other = document.createElement('moni-select') as MoniSelect;
		document.body.appendChild(other);

		try {
			await Promise.all([el.updateComplete, other.updateComplete]);
			const firstInput = el.shadowRoot?.querySelector('input') as HTMLInputElement;
			const secondInput = other.shadowRoot?.querySelector('input') as HTMLInputElement;

			firstInput.click();
			await el.updateComplete;
			expect(el.shadowRoot?.querySelector('.dropdown-menu')?.classList.contains('open')).toBe(true);

			secondInput.click();
			await Promise.all([el.updateComplete, other.updateComplete]);
			expect(el.shadowRoot?.querySelector('.dropdown-menu')?.classList.contains('open')).toBe(false);
			expect(other.shadowRoot?.querySelector('.dropdown-menu')?.classList.contains('open')).toBe(true);
		} finally {
			other.remove();
		}
	});

	it('reinicia la búsqueda al abrir aunque exista una opción seleccionada', async () => {
		el.searchable = true;
		el.value = 'banana';

		for (const [value, label] of [['apple', 'Apple'], ['banana', 'Banana']]) {
			const option = document.createElement('moni-select-option');
			option.setAttribute('value', value);
			option.textContent = label;
			el.appendChild(option);
		}

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		expect(input.value).toBe('Banana');

		input.click();
		await el.updateComplete;
		expect(input.value).toBe('');
		expect(el.shadowRoot?.querySelectorAll('.option-item').length).toBe(2);
	});

	it('limita la altura según el viewport, permite un máximo manual y habilita scroll', async () => {
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
		vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);
		vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			bottom: 156,
			left: 100,
			right: 300,
			width: 200,
			height: 56,
			x: 100,
			y: 100,
			toJSON: () => ({})
		} as DOMRect);

		for (let index = 1; index <= 30; index += 1) {
			const option = document.createElement('moni-select-option');
			option.setAttribute('value', String(index));
			option.textContent = `Option ${index}`;
			el.appendChild(option);
		}

		await new Promise(resolve => setTimeout(resolve, 50));
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		let menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.style.maxHeight).toBe('436px');
		expect(menu.classList.contains('scrollable')).toBe(true);

		input.click();
		el.dropdownMaxHeight = '120px';
		await el.updateComplete;
		input.click();
		await el.updateComplete;
		menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.style.maxHeight).toContain('120px');
	});

	it('cambia hacia arriba y recalcula el alto cuando no hay espacio debajo', async () => {
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
		vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);
		vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
			top: 650,
			bottom: 706,
			left: 100,
			right: 300,
			width: 200,
			height: 56,
			x: 100,
			y: 650,
			toJSON: () => ({})
		} as DOMRect);

		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.classList.contains('placement-top')).toBe(true);
		expect(menu.style.maxHeight).toBe('442px');
	});

	it('usa la capa superior cuando positioning=body', async () => {
		el.positioning = 'body';
		await el.updateComplete;

		const menu = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLElement;
		expect(menu.getAttribute('popover')).toBe('manual');

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.click();
		await el.updateComplete;
		expect(menu.style.position).toBe('fixed');
		expect(menu.classList.contains('open')).toBe(true);
	});
});

describe('moni-select · nombre accesible', () => {
	it('asocia la etiqueta con el input mediante for/id', async () => {
		const el = document.createElement('moni-select') as MoniSelect;
		el.label = 'Estado';
		document.body.appendChild(el);
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input');
		const label = el.shadowRoot?.querySelector('label');
		expect(input?.id).toBe('input');
		expect(label?.getAttribute('for')).toBe('input');
		expect(input?.nextElementSibling).toBe(label);
		el.remove();
	});
})
