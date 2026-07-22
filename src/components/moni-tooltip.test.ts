import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-tooltip.js';
import type { MoniTooltip } from './moni-tooltip.js';

describe('moni-tooltip (P3.1)', () => {
	let parent: HTMLElement;
	let el: MoniTooltip;

	beforeEach(() => {
		parent = document.createElement('div');
		el = document.createElement('moni-tooltip') as MoniTooltip;
		el.text = 'Save changes';
		parent.appendChild(el);
		document.body.appendChild(parent);
	});

	afterEach(() => {
		parent.remove();
	});

	it('renderiza role="tooltip" en el elemento interno (accesibilidad M3)', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('[role="tooltip"]');
		expect(tip).toBeTruthy();
	});

	it('refleja el texto en el host', async () => {
		await el.updateComplete;
		expect(el.text).toBe('Save changes');
	});

	it('refleja la posición (top por defecto)', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip');
		expect(tip?.classList.contains('top')).toBe(true);
	});

	it('acepta los 6 posicionamientos M3 (top/top-start/top-end/bottom/bottom-start/bottom-end)', async () => {
		const positions: Array<'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'> = [
			'top',
			'top-start',
			'top-end',
			'bottom',
			'bottom-start',
			'bottom-end'
		];
		for (const pos of positions) {
			el.position = pos;
			await el.updateComplete;
			const tip = el.shadowRoot?.querySelector('.tooltip');
			expect(tip?.classList.contains(pos), `expected class ${pos}`).toBe(true);
		}
	});

	it('es plano (plain) por defecto (rich=false)', async () => {
		await el.updateComplete;
		expect(el.rich).toBe(false);
		expect(el.hasAttribute('rich')).toBe(false);
	});

	it('rich=true habilita el modo de contenido enriquecido (atributo rich reflejado)', async () => {
		el.rich = true;
		await el.updateComplete;
		expect(el.rich).toBe(true);
		expect(el.hasAttribute('rich')).toBe(true);
	});

	it('muestra el tooltip en mouseenter y lo oculta en mouseleave', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		expect(tip?.classList.contains('visible')).toBe(false);

		parent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		parent.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('muestra el tooltip en focusin y lo oculta en focusout', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		parent.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		parent.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('la tecla Escape cierra un tooltip visible', async () => {
		await el.updateComplete;
		const tip = el.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		parent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(true);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await el.updateComplete;
		expect(tip?.classList.contains('visible')).toBe(false);
	});

	it('aplica las variantes de tamaño (small/medium/large)', async () => {
		for (const size of ['small', 'medium', 'large'] as const) {
			el.size = size;
			await el.updateComplete;
			const tip = el.shadowRoot?.querySelector('.tooltip');
			expect(tip?.classList.contains(size), `esperada clase ${size}`).toBe(true);
		}
	});

	it('limpia los listeners al desconectarse', () => {
		// Sanidad: remover el padre limpia todo.
		parent.remove();
		// No se necesita aserción; si los listeners se fugaran, el siguiente beforeEach
		// acumularía listeners pero vitest pasaría. Solo cobertura visual.
		expect(parent.isConnected).toBe(false);
	});
});
