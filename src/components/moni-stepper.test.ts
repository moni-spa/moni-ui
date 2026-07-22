import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-stepper.js';
import './moni-step.js';
import type { MoniStepper } from './moni-stepper.js';
import type { MoniStep } from './moni-step.js';

describe('moni-stepper / moni-step', () => {
	let el: MoniStepper;

	beforeEach(() => {
		el = document.createElement('moni-stepper') as MoniStepper;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza un <ol> con un slot', async () => {
		await el.updateComplete;
		const ol = el.shadowRoot?.querySelector('ol');
		const slot = el.shadowRoot?.querySelector('slot');
		expect(ol).toBeTruthy();
		expect(slot).toBeTruthy();
	});

	it('refleja el atributo orientation', async () => {
		el.orientation = 'vertical';
		await el.updateComplete;
		expect(el.getAttribute('orientation')).toBe('vertical');
	});

	it('refleja el atributo current como un número', async () => {
		el.current = 2;
		await el.updateComplete;
		expect(el.getAttribute('current')).toBe('2');
	});

	it('propaga current a los hijos: establece active en el paso coincidente', async () => {
		const step1 = document.createElement('moni-step') as MoniStep;
		step1.title = 'One';
		const step2 = document.createElement('moni-step') as MoniStep;
		step2.title = 'Two';
		const step3 = document.createElement('moni-step') as MoniStep;
		step3.title = 'Three';
		el.appendChild(step1);
		el.appendChild(step2);
		el.appendChild(step3);

		el.current = 1;
		await el.updateComplete;
		await step1.updateComplete;
		await step2.updateComplete;
		await step3.updateComplete;

		expect(step1.completed).toBe(true);
		expect(step1.active).toBe(false);
		expect(step2.active).toBe(true);
		expect(step2.completed).toBe(false);
		expect(step3.active).toBe(false);
		expect(step3.completed).toBe(false);
	});

	it('establece el índice en cada hijo según su posición', async () => {
		const s1 = document.createElement('moni-step') as MoniStep;
		const s2 = document.createElement('moni-step') as MoniStep;
		const s3 = document.createElement('moni-step') as MoniStep;
		el.appendChild(s1);
		el.appendChild(s2);
		el.appendChild(s3);
		el.current = 0;
		await el.updateComplete;
		await Promise.all([s1.updateComplete, s2.updateComplete, s3.updateComplete]);

		expect(s1.index).toBe(0);
		expect(s2.index).toBe(1);
		expect(s3.index).toBe(2);
	});

	it('marca todos los pasos anteriores como completados (completed)', async () => {
		const s1 = document.createElement('moni-step') as MoniStep;
		const s2 = document.createElement('moni-step') as MoniStep;
		const s3 = document.createElement('moni-step') as MoniStep;
		const s4 = document.createElement('moni-step') as MoniStep;
		el.appendChild(s1);
		el.appendChild(s2);
		el.appendChild(s3);
		el.appendChild(s4);
		el.current = 2;
		await el.updateComplete;
		await Promise.all([
			s1.updateComplete,
			s2.updateComplete,
			s3.updateComplete,
			s4.updateComplete
		]);

		expect(s1.completed).toBe(true);
		expect(s2.completed).toBe(true);
		expect(s3.completed).toBe(false);
		expect(s3.active).toBe(true);
		expect(s4.completed).toBe(false);
		expect(s4.active).toBe(false);
	});

	it('se resincroniza cuando se agrega un paso dinámicamente (slotchange)', async () => {
		el.current = 0;
		await el.updateComplete;
		const s1 = document.createElement('moni-step') as MoniStep;
		el.appendChild(s1);
		await el.updateComplete;
		await s1.updateComplete;
		expect(s1.index).toBe(0);
		expect(s1.active).toBe(true);
	});
});
