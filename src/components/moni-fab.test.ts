import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

	it('no renderiza el label cuando no se establece', async () => {
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('.label');
		expect(label).toBeNull();
	});

	it('aplica la clase shape=circle', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		expect(el.getAttribute('shape')).toBe('circle');
	});

	it('aplica las clases de color (secondary/tertiary/surface)', async () => {
		el.color = 'secondary';
		await el.updateComplete;
		expect(el.getAttribute('color')).toBe('secondary');

		el.color = 'tertiary';
		await el.updateComplete;
		expect(el.getAttribute('color')).toBe('tertiary');

		el.color = 'surface';
		await el.updateComplete;
		expect(el.getAttribute('color')).toBe('surface');
	});

	it('aplica las clases de tamaño (small/large)', async () => {
		el.size = 'small';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('small');

		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
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

	it('permanece inline cuando no se configura position', async () => {
		await el.updateComplete;
		expect(el.getAttribute('position')).toBe('');
	});

	it('expone una etiqueta accesible en modo icon-only', async () => {
		el.accessibleLabel = 'Editar documento';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('Editar documento');
	});

	it('oculta la etiqueta visual en shape=circle', async () => {
		el.label = 'Crear';
		el.shape = 'circle';
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.label')).toBeNull();
	});
});
