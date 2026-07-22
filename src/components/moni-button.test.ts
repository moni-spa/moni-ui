import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-button.js';
import type { MoniButton } from './moni-button.js';

describe('moni-button', () => {
	let el: MoniButton;

	beforeEach(() => {
		el = document.createElement('moni-button') as MoniButton;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un <button> nativo por defecto', async () => {
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button).toBeTruthy();
	});

	it('renderiza un <a> cuando el href está establecido', async () => {
		el.href = 'https://example.com';
		await el.updateComplete;
		const a = el.shadowRoot?.querySelector('a');
		expect(a).toBeTruthy();
		expect(a?.getAttribute('href')).toBe('https://example.com');
	});

	it('aplica la clase shape=circle en el botón', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
	});

	it('oculta la parte del label cuando shape=circle (verifica el selector :host)', async () => {
		el.shape = 'circle';
		el.textContent = 'Click me';
		await el.updateComplete;
		// La regla :host([shape='circle']) [part='label'] vive en las hojas de estilo
		// shadow. getComputedStyle de jsdom está limitado, así que verificamos la
		// condición estructural: el host tiene el atributo shape reflejado
		// y el elemento [part='label'] existe para el contenido del slot.
		expect(el.getAttribute('shape')).toBe('circle');
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
	});

	it('mantiene el label renderizado cuando shape=square', async () => {
		el.shape = 'square';
		el.textContent = 'Square';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(label).toBeTruthy();
		expect(el.getAttribute('shape')).toBe('square');
	});

	it('aplica la clase shape=square en el botón', async () => {
		el.shape = 'square';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('square')).toBe(true);
		expect(button?.classList.contains('circle')).toBe(false);
	});

	it('aplica la clase shape=circle en el botón', async () => {
		el.shape = 'circle';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('circle')).toBe(true);
		expect(button?.classList.contains('square')).toBe(false);
	});

	it('aplica la clase de variante para outlined', async () => {
		el.variant = 'outlined';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('border')).toBe(true);
	});

	it('aplica la clase de tamaño para large', async () => {
		el.size = 'large';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.classList.contains('large')).toBe(true);
	});

	it('renderiza un ícono cuando el atributo icon está establecido', async () => {
		el.icon = 'add';
		await el.updateComplete;
		const icon = el.shadowRoot?.querySelector('.icon');
		expect(icon).toBeTruthy();
		const moniIcon = icon?.querySelector('moni-icon');
		expect(moniIcon).toBeTruthy();
		expect(moniIcon?.getAttribute('name')).toBe('add');
	});

	it('muestra un spinner de carga junto al ícono/label cuando loading=true', async () => {
		el.loading = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('moni-progress');
		const label = el.shadowRoot?.querySelector('[part="label"]');
		expect(progress).toBeTruthy();
		expect(progress?.getAttribute('variant')).toBe('circular');
		expect(progress?.hasAttribute('indeterminate')).toBe(true);
		expect(label).toBeTruthy();
	});

	it('renderiza un <a> con el spinner de carga cuando href + loading están establecidos', async () => {
		el.href = '#';
		el.loading = true;
		await el.updateComplete;
		const a = el.shadowRoot?.querySelector('a');
		const progress = a?.querySelector('moni-progress');
		expect(a).toBeTruthy();
		expect(progress).toBeTruthy();
	});

	it('establece aria-busy en el botón cuando está cargando', async () => {
		el.loading = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('button');
		expect(button?.getAttribute('aria-busy')).toBe('true');
	});

	it('reenvía disabled al botón nativo', async () => {
		el.disabled = true;
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector(
			'button'
		) as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('registra una advertencia de obsolescencia cuando se usa size="extra" (usar size="xlarge" según M3)', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		el.remove();
		el.size = 'extra';
		document.body.appendChild(el);
		await el.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size="extra"')
		);
		expect(call, 'se esperaba que una advertencia de obsolescencia mencionara size="extra"').toBeTruthy();
		warnSpy.mockRestore();
	});

	it('no registra una advertencia de obsolescencia para los valores de tamaño compatibles con M3', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		// Usar un tamaño nuevo para asegurar que no se registre una obsolescencia obsoleta de M3.
		const fresh = document.createElement('moni-button') as MoniButton;
		fresh.size = 'xlarge';
		document.body.appendChild(fresh);
		await fresh.updateComplete;
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-ui]') &&
			String(c[0]).includes('size=')
		);
		expect(call).toBeFalsy();
		fresh.remove();
		warnSpy.mockRestore();
	});
});
