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

	it('alinea progress y track circular desde las doce en sentido horario', async () => {
		el.variant = 'circular';
		el.value = 40;
		await el.updateComplete;
		const active = el.shadowRoot?.querySelector('path.active');
		const track = el.shadowRoot?.querySelector('path.track');
		expect(active?.getAttribute('d')).toMatch(/^M26\.00 7\.00 L/);
		expect(track?.getAttribute('d')).toMatch(/^M/);
		expect(el.shadowRoot?.querySelector('circle.active')).toBeFalsy();
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
		expect(el.shadowRoot?.querySelector('.wave-window')?.getAttribute('rx')).toBe('7');
	});

	it('refleja el atributo size', async () => {
		el.size = 'large';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('large');
	});

	it('incluye track, indicador activo y stop indicator en la barra lineal', async () => {
		el.stopIndicator = true;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('[part="track"]')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('[part="indicator"]')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('[part="stop-indicator"]')).toBeTruthy();
	});

	it('permite ocultar el stop indicator', async () => {
		el.stopIndicator = false;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('[part="stop-indicator"]')).toBeFalsy();
	});

	it('oculta el stop indicator por defecto', async () => {
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('[part="stop-indicator"]')).toBeFalsy();
	});

	it('representa el progreso inicial wavy como un punto', async () => {
		el.variant = 'wavy';
		el.value = 1;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.initial-dot')).toBeTruthy();

		el.value = 10;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.initial-dot')).toBeFalsy();
	});

	it('renderiza una ruta ondulada real para circular-wavy', async () => {
		el.variant = 'circular-wavy';
		el.value = 50;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('path[part="indicator"]')).toBeTruthy();
	});

	it('renderiza circular-wavy determinado con track complementario normalizado', async () => {
		el.variant = 'circular-wavy';
		el.value = 60;
		await el.updateComplete;
		const active = el.shadowRoot?.querySelector('path.active');
		const track = el.shadowRoot?.querySelector('path.track');
		expect(active?.getAttribute('d')).toMatch(/^M.+L/);
		expect(track?.getAttribute('d')).toMatch(/^M.+L/);
		expect(active?.hasAttribute('stroke-dasharray')).toBe(false);
		expect(track?.hasAttribute('stroke-dasharray')).toBe(false);
		expect(active?.querySelector('animate[attributeName="d"]')).toBeTruthy();
	});

	it('muestra el círculo wavy completo y sin track al 100%', async () => {
		el.variant = 'circular-wavy';
		el.value = 100;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('path.active')?.getAttribute('d')).toMatch(/^M.+L/);
		expect(el.shadowRoot?.querySelector('.track')).toBeFalsy();
	});

	it('desvanece el track sin invertirlo cuando ya no cabe cerca del 100%', async () => {
		el.variant = 'circular-wavy';
		el.size = 'xlarge';
		el.value = 95;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.track')?.getAttribute('style')).toContain('opacity: 0');
		expect(el.shadowRoot?.querySelector('path.active')).toBeTruthy();
	});

	it('omite aria-valuenow en modo indeterminado', async () => {
		el.indeterminate = true;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('[role="progressbar"]');
		expect(progress?.hasAttribute('aria-valuenow')).toBe(false);
		expect(progress?.getAttribute('aria-valuetext')).toBe('Loading');
	});

	it('anima la fase wavy sin rotar el arco activo indeterminado', async () => {
		el.variant = 'circular-wavy';
		el.indeterminate = true;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('path.active animate[attributeName="d"]')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('circle.track')?.hasAttribute('transform')).toBe(false);
		expect(el.shadowRoot?.querySelector('#circular-wavy-active-mask')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('#circular-wavy-track-mask')).toBeTruthy();
		expect(el.shadowRoot?.querySelectorAll('animate[attributeName="stroke-dasharray"]')).toHaveLength(2);
		expect(el.shadowRoot?.querySelectorAll('animate[attributeName="stroke-dashoffset"]')).toHaveLength(2);
	});

	it('permite transformar suavemente entre wavy y normal', async () => {
		el.variant = 'circular-wavy';
		el.value = 60;
		el.waveTransition = true;
		await el.updateComplete;
		const morph = el.shadowRoot?.querySelector('path.active animate[attributeName="d"]');
		expect(el.getAttribute('wave-transition')).toBe('');
		expect(morph?.getAttribute('dur')).toBe('1s');
		expect(morph?.getAttribute('values')?.split(';')).toHaveLength(5);
	});

	it('renderiza el modo buffer lineal con valor cargado y resto punteado', async () => {
		el.variant = 'linear';
		el.mode = 'buffer';
		el.value = 40;
		el.bufferValue = 70;
		await el.updateComplete;
		const progress = el.shadowRoot?.querySelector('.linear.buffer');
		expect(el.getAttribute('buffer-value')).toBe('70');
		expect(progress?.getAttribute('style')).toContain('--_buffer-end: 70%');
		expect(el.shadowRoot?.querySelector('[part="buffer"]')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('.track-after')).toBeTruthy();
	});

	it('limita el buffer para que nunca quede detrás del progreso activo', async () => {
		el.mode = 'buffer';
		el.value = 80;
		el.bufferValue = 20;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.linear')?.getAttribute('style')).toContain('--_buffer-end: 80%');
	});

	it.each(['circular', 'circular-wavy'] as const)('extiende el modo buffer a la variante %s', async (variant) => {
		el.variant = variant;
		el.mode = 'buffer';
		el.value = 40;
		el.bufferValue = 70;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('.circular.buffer')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('path.active')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('path.buffer-segment')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('path.track')).toBeTruthy();
	});

	it('renderiza ventanas primaria y secundaria para el timeline wavy indeterminado', async () => {
		el.variant = 'wavy';
		el.indeterminate = true;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelectorAll('.primary-window')).toHaveLength(2);
		expect(el.shadowRoot?.querySelectorAll('.secondary-window')).toHaveLength(2);
		expect(el.shadowRoot?.querySelector('#wave-active-mask')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('#wave-track-mask')).toBeTruthy();
	});

	it('recorta el track alrededor de los segmentos linear indeterminados', async () => {
		el.variant = 'linear';
		el.indeterminate = true;
		await el.updateComplete;
		expect(el.shadowRoot?.querySelector('#flat-active-mask')).toBeTruthy();
		expect(el.shadowRoot?.querySelector('#flat-track-mask')).toBeTruthy();
		expect(el.shadowRoot?.querySelectorAll('#flat-track-mask .inverse-window')).toHaveLength(2);
	});

	it('admite el tamaño xlarge del diseño actual', async () => {
		el.size = 'xlarge';
		await el.updateComplete;
		expect(el.getAttribute('size')).toBe('xlarge');
	});
});
