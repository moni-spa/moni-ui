import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-text-field.js';
import { MoniTextField } from './moni-text-field.js';

describe('moni-text-field', () => {
	let el: MoniTextField;

	beforeEach(() => {
		el = document.createElement('moni-text-field') as MoniTextField;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un contenedor de campo (field wrapper) y un input', async () => {
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		const input = el.shadowRoot?.querySelector('input');
		expect(field).toBeTruthy();
		expect(input).toBeTruthy();
	});

	it('renderiza un icono inicial (leading) cuando se establece el atributo icon', async () => {
		el.icon = 'search';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeTruthy();
	});

	it('renderiza un icono final (trailing) cuando se establece el atributo trailing-icon', async () => {
		el.setAttribute('trailing-icon', 'close');
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing).toBeTruthy();
	});

	it('renderiza un texto prefijo cuando se establece el atributo prefix', async () => {
		el.prefix = 'https://';
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading?.textContent?.trim()).toBe('https://');
	});

	it('renderiza un texto sufijo cuando se establece el atributo suffix', async () => {
		el.suffix = '.com';
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		expect(trailing?.textContent?.trim()).toBe('.com');
	});

	it('renderiza un botón suffix accesible y emite suffix-click', async () => {
		el.suffixButtonIcon = 'schedule';
		el.suffixButtonLabel = 'Elegir hora';
		await el.updateComplete;
		const button = el.shadowRoot?.querySelector('.suffix-button') as HTMLButtonElement;
		expect(button.getAttribute('aria-label')).toBe('Elegir hora');
		let fired = false;
		el.addEventListener('suffix-click', () => { fired = true; });
		button.click();
		expect(fired).toBe(true);
	});

	it('acepta una acción personalizada mediante slot suffix', async () => {
		const button = document.createElement('button');
		button.slot = 'suffix';
		el.appendChild(button);
		await el.updateComplete;
		await new Promise((resolve) => setTimeout(resolve, 0));
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.field')?.classList.contains('suffix-action-field')).toBe(true);
	});

	it('aplica la clase square en el contenedor de campo para shape=no-round', async () => {
		el.shape = 'no-round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('square')).toBe(true);
	});

	it('aplica la clase round en el contenedor de campo para shape=round', async () => {
		el.shape = 'round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('round')).toBe(true);
	});

	it('renderiza underlined sin fondo, contorno completo ni forma redondeada', async () => {
		el.variant = 'underlined';
		el.shape = 'round';
		await el.updateComplete;
		const field = el.shadowRoot?.querySelector('.field');
		expect(field?.classList.contains('fill')).toBe(false);
		expect(field?.classList.contains('border')).toBe(false);
		expect(field?.classList.contains('round')).toBe(false);
	});

	it('muestra el indicador de carga cuando loading es true', async () => {
		el.loading = true;
		await el.updateComplete;
		const trailing = el.shadowRoot?.querySelector('.trailing-icon');
		const progress = trailing?.querySelector('moni-progress');
		expect(progress).toBeTruthy();
	});

	it('no renderiza un icono inicial por defecto', async () => {
		await el.updateComplete;
		const leading = el.shadowRoot?.querySelector('.leading-icon');
		expect(leading).toBeFalsy();
	});

	it('reenvía value al input', async () => {
		el.value = 'hello world';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector(
			'input'
		) as HTMLInputElement;
		expect(input.value).toBe('hello world');
	});

	it('agrega la clase active al input cuando se establece el valor', async () => {
		el.value = 'something';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input');
		expect(input?.classList.contains('active')).toBe(true);
	});

	it('renderiza el label y alterna la clase active basándose en el valor', async () => {
		el.label = 'Email';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('label');
		expect(label?.textContent?.trim()).toBe('Email');

		el.value = 'a@b.com';
		await el.updateComplete;
		expect(label?.classList.contains('active')).toBe(true);
	});

	it('formatea el valor usando una máscara y expone el valor sin formato', async () => {
		el.mask = '99.999.999-9';
		el.value = '123456789';
		await el.updateComplete;
		expect(el.value).toBe('12.345.678-9');
		expect(el.unmaskedValue).toBe('123456789');
	});

	it('descarta caracteres que no cumplen con las reglas de la máscara', async () => {
		el.mask = '99-aa-**';
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.value = '1x2Aá7b';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await el.updateComplete;
		expect(el.value).toBe('12-Aá-7b');
	});

	it('permite borrar a través de los separadores de la máscara', async () => {
		el.mask = '99.999-9';
		el.value = '123456';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.focus();
		input.setSelectionRange(3, 3);
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
		await el.updateComplete;
		expect(el.value).not.toBe('12.345-6');
		expect(el.unmaskedValue).toBe('13456');
	});

	it('permite Delete delante de un separador de la máscara', async () => {
		el.mask = '99-99';
		el.value = '1234';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.focus();
		input.setSelectionRange(2, 2);
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));
		await el.updateComplete;
		expect(el.value).toBe('12-4');
	});

	it('acepta y normaliza K como dígito verificador de RUT', async () => {
		el.mask = '99.999.999-K';
		el.value = '12345678k';
		await el.updateComplete;
		expect(el.value).toBe('12.345.678-K');
		expect(el.unmaskedValue).toBe('12345678K');
	});

	it('acepta un dígito numérico en el token verificador K', async () => {
		el.mask = '99.999.999-K';
		el.value = '123456785';
		await el.updateComplete;
		expect(el.value).toBe('12.345.678-5');
	});

	it('admite bloques opcionales y cuantificadores de Inputmask', async () => {
		el.mask = '9{2,4}[-aa]';
		el.value = '1234CL';
		await el.updateComplete;
		expect(el.value).toBe('1234-CL');
		expect(el.unmaskedValue).toBe('1234CL');
	});

	it('admite opciones avanzadas configuradas como objeto', async () => {
		el.mask = '9999';
		el.maskOptions = { placeholder: '·', showMaskOnHover: false };
		el.value = '12';
		await el.updateComplete;
		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		input.focus();
		expect(input.value).toContain('12');
	});

	it('expone la instancia y los métodos completos de Inputmask', async () => {
		el.mask = '999-999';
		await el.updateComplete;
		expect(el.inputmaskInstance).toBeTruthy();
		expect(el.getEmptyMask()).toBe('-');
		expect(el.isMaskValid('123-456')).toBe(true);
		expect(el.formatWithMask('123456')).toBe('123-456');
		el.setMaskedValue('987654');
		expect(el.value).toBe('987-654');
		expect(el.getMaskMetadata()).toBeTruthy();
	});

	it('expone la API estática original de Inputmask', () => {
		expect(MoniTextField.Inputmask.format('123456', { mask: '999-999' })).toBe('123-456');
		expect(MoniTextField.Inputmask.isValid('123-456', { mask: '999-999' })).toBe(true);
	});
});

describe('moni-text-field · nombre accesible', () => {
	/*
	 * El <label> y el <input> son hermanos dentro del mismo shadow root: sin
	 * `for`/`id` no hay asociación y el lector de pantalla anuncia el campo sin
	 * nombre. La adyacencia no se puede cambiar porque `field-styles` la usa
	 * (`:focus + label`) para elevar la etiqueta, así que la unión va por id.
	 */
	it('asocia la etiqueta con el input mediante for/id', async () => {
		const el = document.createElement('moni-text-field') as HTMLElement & {
			label: string;
			updateComplete: Promise<unknown>;
		};
		el.label = 'Correo';
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

describe('moni-text-field · restricciones nativas', () => {
	/*
	 * El componente sólo reenviaba type/placeholder/disabled/value/name, así que
	 * cualquier campo con `required` o `autocomplete` tenía que renunciar a
	 * moni-ui y usar un input nativo.
	 */
	it('reenvía las restricciones al input interno', async () => {
		const el = document.createElement('moni-text-field') as HTMLElement & {
			updateComplete: Promise<unknown>;
			[key: string]: unknown;
		};
		Object.assign(el, {
			label: 'Correo',
			type: 'email',
			required: true,
			autocomplete: 'email',
			maxlength: 40,
			minlength: 5,
			pattern: '.+@.+',
			inputmode: 'email'
		});
		document.body.appendChild(el);
		await el.updateComplete;

		const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
		expect(input.required).toBe(true);
		expect(input.getAttribute('autocomplete')).toBe('email');
		expect(input.maxLength).toBe(40);
		expect(input.minLength).toBe(5);
		expect(input.getAttribute('pattern')).toBe('.+@.+');
		expect(input.getAttribute('inputmode')).toBe('email');
		el.remove();
	});

	it('acepta los tipos de fecha y hora', async () => {
		const el = document.createElement('moni-text-field') as HTMLElement & {
			type: string;
			updateComplete: Promise<unknown>;
		};
		el.type = 'date';
		document.body.appendChild(el);
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('input')?.getAttribute('type')).toBe('date');
		el.remove();
	});

	it('publica la validez en el host para que el formulario la vea', async () => {
		// jsdom no implementa checkValidity() en custom elements form-associated,
		// así que se observa la llamada a setValidity. El bloqueo real del envío
		// se verifica en navegador.
		const calls: Array<Record<string, unknown>> = [];
		const originalAttach = HTMLElement.prototype.attachInternals;
		HTMLElement.prototype.attachInternals = function spy(this: HTMLElement) {
			const internals = originalAttach.call(this);
			const setValidity = internals.setValidity.bind(internals);
			internals.setValidity = ((flags, message, anchor) => {
				// ValidityState expone sus flags como getters del prototipo, así que un
				// spread devolvería {}: hay que leerlas uña a uña.
				calls.push({ valueMissing: flags?.valueMissing === true });
				return setValidity(flags, message, anchor);
			}) as typeof internals.setValidity;
			return internals;
		};
		const el = document.createElement('moni-text-field') as HTMLElement & {
			required: boolean;
			updateComplete: Promise<unknown>;
		};
		HTMLElement.prototype.attachInternals = originalAttach;

		el.required = true;
		document.body.appendChild(el);
		await el.updateComplete;

		expect(calls.some((c) => c.valueMissing === true)).toBe(true);
		el.remove();
	});
})
