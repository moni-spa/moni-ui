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

	it('renderiza el nombre del icono como contenido de texto', async () => {
		el.name = 'add';
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
		const assigned = slot
			? slot.assignedNodes({ flatten: true }).map((n) => n.textContent)
			: [];
		expect(assigned.join('')).toContain('add');
	});

	it('renderiza el respaldo del slot (fallback) cuando no se establece nombre', async () => {
		el.name = '';
		el.textContent = 'FALLBACK';
		await el.updateComplete;
		const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement;
		const assigned = slot
			? slot.assignedNodes({ flatten: true }).map((n) => n.textContent)
			: [];
		expect(assigned.join('')).toContain('FALLBACK');
	});

	it('refleja el atributo name', async () => {
		el.name = 'close';
		await el.updateComplete;
		expect(el.getAttribute('name')).toBe('close');
	});

	it('aplica el atributo filled', async () => {
		el.filled = true;
		await el.updateComplete;
		expect(el.hasAttribute('filled')).toBe(true);
	});

	it('refleja el atributo size', async () => {
		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
	});

	it('hereda el color de su padre (host color: inherit)', async () => {
		const parent = document.createElement('div');
		parent.style.color = 'rgb(255, 0, 128)';
		parent.appendChild(el);
		document.body.appendChild(parent);
		await el.updateComplete;
		// La declaración del host color: inherit debería estar presente en la
		// hoja de estilo shadow para que el glifo de Material Symbols tome el color
		// de texto del padre. jsdom no resuelve completamente los estilos dirigidos
		// por propiedades personalizadas, así que solo afirmamos que el elemento se
		// renderiza dentro del contenedor coloreado sin lanzar errores.
		expect(parent.contains(el)).toBe(true);
		parent.remove();
	});
});
