import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-fab.js';
import type { MoniFab } from './moni-fab.js';

describe('moni-fab', () => {
	let el: MoniFab;

	beforeEach(() => {
		el = document.createElement('moni-fab') as MoniFab;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un <button> con el icono por defecto "add"', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(button).toBeTruthy();
		expect(icon?.getAttribute('name')).toBe('add');
	});

	it('usa el nombre del icono proporcionado', async () => {
		el.icon = 'edit';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('moni-icon');
		expect(icon?.getAttribute('name')).toBe('edit');
	});

	it('renderiza el texto del label cuando se establece (visible por defecto, no requiere extended)', async () => {
		el.label = 'Create';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('Create');
	});

	it('no requiere extended/expanded para que el label sea visible', async () => {
		el.label = 'Send';
		await el.updateComplete;
		expect(el.hasAttribute('extended')).toBe(false);
		expect(el.hasAttribute('expanded')).toBe(false);
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('Send');
	});

	it('oculta el label visualmente cuando no se establece (span vacío + display:none)', async () => {
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label?.textContent).toBe('');
	});

	it('aplica la clase shape=circle', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
	});

	it('aplica las clases de color (secondary/tertiary/surface)', async () => {
		el.color = 'secondary';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('secondary')).toBe(true);

		el.color = 'tertiary';
		await el.updateComplete;
		expect(button?.classList.contains('tertiary')).toBe(true);

		el.color = 'surface';
		await el.updateComplete;
		expect(button?.classList.contains('surface')).toBe(true);
	});

	it('aplica las clases de tamaño (small/large)', async () => {
		el.size = 'small';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('small')).toBe(true);

		el.size = 'large';
		await el.updateComplete;
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('refleja el atributo position', async () => {
		el.position = 'top-leading';
		await el.updateComplete;
		expect(el.getAttribute('position')).toBe('top-leading');
	});

	it('refleja los atributos extended y expanded', async () => {
		el.extended = true;
		await el.updateComplete;
		expect(el.hasAttribute('extended')).toBe(true);

		el.expanded = true;
		await el.updateComplete;
		expect(el.hasAttribute('expanded')).toBe(true);
	});

	it('reenvía disabled al botón', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('registra una advertencia de obsolescencia cuando se usa size="small" (M3 Expressive deprecia el FAB pequeño)', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// Desmontar y volver a montar para ejecutar de nuevo connectedCallback con el
		// tamaño obsoleto ya establecido. El componente lee el atributo
		// del elemento durante la conexión.
		el.remove();
		el.size = 'small';
		document.body.appendChild(el);
		await el.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size="small"')
		);
		expect(call, 'se esperaba que una advertencia de obsolescencia mencionara size="small"').toBeTruthy();
		warnSpy.mockRestore();
	});
});
