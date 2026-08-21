import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-color-field.js';
import type { MoniColorField } from './moni-color-field.js';

describe('moni-color-field', () => {
	let el: MoniColorField;

	beforeEach(() => {
		el = document.createElement('moni-color-field') as MoniColorField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza una muestra (swatch) y un input de texto', async () => {
		await el.updateComplete;
		const swatch = el.shadowRoot?.querySelector('.swatch');
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(swatch).toBeTruthy();
		expect(text).toBeTruthy();
	});

	it('agrega la clase active al input de texto cuando se establece el valor', async () => {
		el.value = '#ff00aa';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(text?.classList.contains('active')).toBe(true);
	});

	it('reenvía el valor al input de texto', async () => {
		el.value = '#123456';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.value).toBe('#123456');
	});

	it('mantiene el input de texto en readonly (para que la etiqueta pueda elevarse vía .active)', async () => {
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector(
			'input[type="text"]'
		) as HTMLInputElement;
		expect(text.hasAttribute('readonly')).toBe(true);
	});

	it('renderiza el elemento label adyacente al input de texto para el selector de BeerCSS', async () => {
		el.label = 'Pick a color';
		await el.updateComplete;
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		const label = el.shadowRoot?.querySelector('label');
		expect(text?.nextElementSibling).toBe(label);
	});
});

describe('moni-color-field · asociación de etiqueta y formulario', () => {
	it('asocia la etiqueta con el input mediante for/id', async () => {
		const el = document.createElement('moni-color-field') as MoniColorField;
		el.label = 'Color principal';
		document.body.appendChild(el);
		await el.updateComplete;

		const label = el.shadowRoot?.querySelector('label');
		const text = el.shadowRoot?.querySelector('input[type="text"]');
		expect(label?.getAttribute('for')).toBe('input');
		expect(text?.id).toBe('input');
		el.remove();
	});

	/*
	 * jsdom expone `setFormValue` pero no lo conecta a `FormData`, así que aquí
	 * sólo se comprueba que el elemento participa del formulario y que publica su
	 * valor. El envío real se verifica en navegador.
	 */
	it('se declara form-associated y publica su valor', async () => {
		const ctor = customElements.get('moni-color-field') as unknown as {
			formAssociated?: boolean;
		};
		expect(ctor.formAssociated).toBe(true);

		const published: unknown[] = [];
		const originalAttach = HTMLElement.prototype.attachInternals;
		HTMLElement.prototype.attachInternals = function attachInternalsSpy(this: HTMLElement) {
			const internals = originalAttach.call(this);
			const setFormValue = internals.setFormValue.bind(internals);
			internals.setFormValue = (value) => {
				published.push(value);
				setFormValue(value);
			};
			return internals;
		};
		const spied = document.createElement('moni-color-field') as MoniColorField;
		HTMLElement.prototype.attachInternals = originalAttach;

		spied.value = '#765a1f';
		document.body.appendChild(spied);
		await spied.updateComplete;

		expect(published).toContain('#765a1f');
		spied.remove();
	});

	it('propaga la elección del selector nativo y emite moni-change', async () => {
		const el = document.createElement('moni-color-field') as MoniColorField;
		el.name = 'c';
		document.body.appendChild(el);
		await el.updateComplete;

		let emitted: string | undefined;
		el.addEventListener('moni-change', (event) => {
			emitted = (event as CustomEvent<{ value: string }>).detail.value;
		});

		const colorInput = el.shadowRoot?.querySelector(
			'input[type="color"]'
		) as HTMLInputElement;
		colorInput.value = '#00ff88';
		colorInput.dispatchEvent(new Event('change', { bubbles: true }));
		await el.updateComplete;

		expect(el.value).toBe('#00ff88');
		expect(emitted).toBe('#00ff88');
		el.remove();
	});
});
