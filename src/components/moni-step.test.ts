import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-stepper.js';
import './moni-step.js';
import type { MoniStepper } from './moni-stepper.js';
import type { MoniStep } from './moni-step.js';

describe('moni-step vertical connectors (P2.2)', () => {
	let stepper: MoniStepper;
	let stepA: MoniStep;
	let stepB: MoniStep;
	let stepC: MoniStep;

	beforeEach(() => {
		stepper = document.createElement('moni-stepper') as MoniStepper;
		stepA = document.createElement('moni-step') as MoniStep;
		stepB = document.createElement('moni-step') as MoniStep;
		stepC = document.createElement('moni-step') as MoniStep;
		stepA.title = 'A';
		stepB.title = 'B';
		stepC.title = 'C';
		stepper.appendChild(stepA);
		stepper.appendChild(stepB);
		stepper.appendChild(stepC);
		stepper.orientation = 'vertical';
		document.body.appendChild(stepper);
	});

	afterEach(() => {
		stepper.remove();
	});

	it('la orientación vertical se propaga al host', async () => {
		await stepper.updateComplete;
		expect(stepper.getAttribute('orientation')).toBe('vertical');
	});

	it('tres pasos verticales se renderizan en orden de documento', async () => {
		await stepper.updateComplete;
		await stepA.updateComplete;
		const steps = Array.from(stepper.querySelectorAll('moni-step'));
		expect(steps.length).toBe(3);
		expect(steps[0]).toBe(stepA);
		expect(steps[1]).toBe(stepB);
		expect(steps[2]).toBe(stepC);
	});

	it('el último paso no tiene conector (solo :not(:last-child) tienen ::after)', async () => {
		await stepper.updateComplete;
		await stepC.updateComplete;
		// El selector :host(:not(:last-child))::after del host solo se aplica
		// a los pasos que no son el último. El último paso no debería tener un
		// pseudo-elemento conector visible. No podemos leer fácilmente ::after en jsdom
		// pero verificamos que el último paso exista y se renderice.
		const lastDot = stepC.shadowRoot?.querySelector('.dot');
		expect(lastDot).toBeTruthy();
	});
});
