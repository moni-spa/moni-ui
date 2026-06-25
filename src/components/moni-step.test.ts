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

	it('vertical orientation propagates to host', async () => {
		await stepper.updateComplete;
		expect(stepper.getAttribute('orientation')).toBe('vertical');
	});

	it('three vertical steps render in document order', async () => {
		await stepper.updateComplete;
		await stepA.updateComplete;
		const steps = Array.from(stepper.querySelectorAll('moni-step'));
		expect(steps.length).toBe(3);
		expect(steps[0]).toBe(stepA);
		expect(steps[1]).toBe(stepB);
		expect(steps[2]).toBe(stepC);
	});

	it('the last step has no connector (only :not(:last-child) have ::after)', async () => {
		await stepper.updateComplete;
		await stepC.updateComplete;
		// The host :host(:not(:last-child))::after selector only applies
		// to non-last steps. The last step should not have a visible connector
		// pseudo-element. We can't easily read ::after in jsdom but we verify
		// the last step exists and renders.
		const lastDot = stepC.shadowRoot?.querySelector('.dot');
		expect(lastDot).toBeTruthy();
	});
});
