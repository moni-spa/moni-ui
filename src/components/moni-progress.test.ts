import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-progress.js';
import type { MoniProgress } from './moni-progress.js';

describe('moni-progress', () => {
	let el: MoniProgress;

	beforeEach(() => {
		el = document.createElement('moni-progress') as MoniProgress;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un contenedor de barra de progreso', async () => {
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress).toBeTruthy();
	});

	it('aplica la clase indeterminate al contenedor de la barra de progreso', async () => {
		el.indeterminate = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('indeterminate')).toBe(true);
	});

	it('no aplica la clase indeterminate por defecto', async () => {
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('indeterminate')).toBe(false);
	});

	it('reenvía value y max a través de los atributos aria en el progressbar', async () => {
		el.value = 42;
		el.max = 100;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector(
			'[role="progressbar"]'
		) as HTMLElement;
		expect(progress.getAttribute('aria-valuenow')).toBe('42');
		expect(progress.getAttribute('aria-valuemax')).toBe('100');
	});

	it('limita el porcentaje renderizado entre 0 y 100', async () => {
		el.value = 150;
		el.max = 100;
		await el.updateComplete;
		const style = el.shadowRoot
			?.querySelector('[role="progressbar"]')
			?.getAttribute('style');
		expect(style).toContain('--_p: 100');

		el.value = -10;
		await el.updateComplete;
		const style2 = el.shadowRoot
			?.querySelector('[role="progressbar"]')
			?.getAttribute('style');
		expect(style2).toContain('--_p: 0');
	});

	it('renderiza el contenedor progress-circular para la variante circular', async () => {
		el.variant = 'circular';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-circular')).toBe(true);
	});

	it('renderiza circle wavy para la variante circular-wavy', async () => {
		el.variant = 'circular-wavy';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-circular')).toBe(true);
	});

	it('renderiza el contenedor progress-wavy para la variante wavy', async () => {
		el.variant = 'wavy';
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.classList.contains('progress-wavy')).toBe(true);
	});

	it('refleja el atributo size', async () => {
		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
	});
});
