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

		expect(btn1.getAttribute('shape')).toBe('left-round');
		expect(btn2.getAttribute('shape')).toBe('inner-round');
		expect(btn3.getAttribute('shape')).toBe('right-round');
	});

	it('permite un grupo completamente unido con gap cero', async () => {
		group.variant = 'connected';
		group.gap = '0';
		const btn1 = document.createElement('moni-button') as MoniButton;
		const btn2 = document.createElement('moni-button') as MoniButton;
		group.append(btn1, btn2);
		await group.updateComplete;
		await Promise.all([btn1.updateComplete, btn2.updateComplete]);
		expect(btn1.shape).toBe('left-round-flat');
		expect(btn2.shape).toBe('right-round-flat');
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

	it('expande el botón activo independientemente de su contenido', () => {
		const cssText = ((group.constructor as typeof HTMLElement & { styles: unknown[] }).styles)
			.map((style: any) => style?.cssText ?? '')
			.join(' ');
		expect(cssText).toContain("[variant='standard'][size='small']) ::slotted(moni-button[active])");
		expect(cssText).not.toContain("[variant='connected'][size='small']) ::slotted(moni-button[active])");
		expect(cssText).toContain('--moni-button-padding');
	});

	it('no permite deseleccionar el último botón cuando la selección es obligatoria', async () => {
		group.selectionRequired = true;
		const button = document.createElement('moni-button') as MoniButton;
		button.active = true;
		group.append(button);
		await group.updateComplete;
		button.click();
		await button.updateComplete;
		expect(button.active).toBe(true);
	});

	it('propaga la forma cuadrada y conserva anchos uniformes en connected', async () => {
		group.variant = 'connected';
		group.shape = 'square';
		const first = document.createElement('moni-button') as MoniButton;
		const second = document.createElement('moni-button') as MoniButton;
		group.append(first, second);
		await group.updateComplete;
		expect(first.shape).toBe('square');
		expect(second.shape).toBe('square');
		const cssText = ((group.constructor as typeof HTMLElement & { styles: unknown[] }).styles)
			.map((style: any) => style?.cssText ?? '')
			.join(' ');
		expect(cssText).toContain("[variant='connected']) ::slotted(moni-button)");
		expect(cssText).toContain('flex: var(--_moni-group-flex-grow, 1) 1 0');
		expect(cssText).toContain('--moni-button-inline-size: 100%');
	});

	it('marca temporalmente el botón presionado y sus vecinos en standard', async () => {
		const buttons = Array.from({ length: 3 }, () => document.createElement('moni-button') as MoniButton);
		group.append(...buttons);
		await group.updateComplete;
		buttons[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
		expect(buttons[1].hasAttribute('data-group-pressed')).toBe(true);
		expect(buttons[0].hasAttribute('data-group-adjacent-pressed')).toBe(true);
		expect(buttons[2].hasAttribute('data-group-adjacent-pressed')).toBe(true);
		buttons[1].dispatchEvent(new PointerEvent('pointerup', { bubbles: true, composed: true }));
		expect(buttons.every((button) => !button.hasAttribute('data-group-pressed') && !button.hasAttribute('data-group-adjacent-pressed'))).toBe(true);
	});

	it('redistribuye el ancho seleccionado hacia sus vecinos sin afectar connected', async () => {
		const buttons = Array.from({ length: 3 }, () => document.createElement('moni-button') as MoniButton);
		group.append(...buttons);
		await group.updateComplete;
		buttons[1].active = true;
		await buttons[1].updateComplete;
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(buttons[0].getAttribute('data-group-adjacent-selected')).toBe('shared');
		expect(buttons[2].getAttribute('data-group-adjacent-selected')).toBe('shared');

		group.variant = 'connected';
		await group.updateComplete;
		expect(buttons[0].hasAttribute('data-group-adjacent-selected')).toBe(false);
		expect(buttons[2].hasAttribute('data-group-adjacent-selected')).toBe(false);
	});

	it('reparte por igual la reducción cuando se selecciona un botón del extremo', async () => {
		const buttons = Array.from({ length: 3 }, () => document.createElement('moni-button') as MoniButton);
		group.append(...buttons);
		await group.updateComplete;
		buttons[2].active = true;
		await buttons[2].updateComplete;
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(buttons[0].getAttribute('data-group-adjacent-selected')).toBe('shared');
		expect(buttons[1].getAttribute('data-group-adjacent-selected')).toBe('shared');
	});

	it('expande toda la superficie del activo en modo flexible y reduce los demás por igual', async () => {
		group.resizing = 'flexible';
		const buttons = Array.from({ length: 3 }, () => document.createElement('moni-button') as MoniButton);
		group.append(...buttons);
		await group.updateComplete;
		buttons[0].active = true;
		await buttons[0].updateComplete;
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(buttons[0].style.getPropertyValue('--_moni-group-flex-grow')).toBe('1.24');
		expect(buttons[1].style.getPropertyValue('--_moni-group-flex-grow')).toBe('0.88');
		expect(buttons[2].style.getPropertyValue('--_moni-group-flex-grow')).toBe('0.88');
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
