import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-slider.js';
import type { MoniSlider } from './moni-slider.js';

describe('moni-slider (P3.4 — ticks)', () => {
	let el: MoniSlider;

	beforeEach(() => {
		el = document.createElement('moni-slider') as MoniSlider;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('does not render a datalist by default', async () => {
		await el.updateComplete;
		const datalist = el.shadowRoot?.querySelector('datalist');
		expect(datalist).toBeFalsy();
	});

	it('ticks=true renders a datalist with min and max options', async () => {
		el.ticks = true;
		await el.updateComplete;
		const datalist = el.shadowRoot?.querySelector('datalist');
		expect(datalist).toBeTruthy();
		const options = datalist?.querySelectorAll('option');
		expect(options?.length).toBe(2);
		expect(options?.[0].getAttribute('value')).toBe('0');
		expect(options?.[1].getAttribute('value')).toBe('100');
	});

	it('tick-interval generates datalist options at every N units', async () => {
		el.min = '0';
		el.max = '10';
		el.tickInterval = 2;
		await el.updateComplete;
		const datalist = el.shadowRoot?.querySelector('datalist');
		const options = Array.from(datalist?.querySelectorAll('option') ?? []);
		const values = options.map((o) => o.getAttribute('value'));
		// 0, 2, 4, 6, 8, 10
		expect(values).toEqual(['0', '2', '4', '6', '8', '10']);
	});

	it('tick-interval respects a non-zero min', async () => {
		el.min = '5';
		el.max = '15';
		el.tickInterval = 5;
		await el.updateComplete;
		const datalist = el.shadowRoot?.querySelector('datalist');
		const options = Array.from(datalist?.querySelectorAll('option') ?? []);
		const values = options.map((o) => o.getAttribute('value'));
		expect(values).toEqual(['5', '10', '15']);
	});

	it('tick-interval takes precedence over the ticks boolean', async () => {
		el.ticks = true;
		el.min = '0';
		el.max = '4';
		el.tickInterval = 1;
		await el.updateComplete;
		const datalist = el.shadowRoot?.querySelector('datalist');
		const options = Array.from(datalist?.querySelectorAll('option') ?? []);
		// 0, 1, 2, 3, 4
		expect(options.length).toBe(5);
	});

	it('reflects the tick-interval attribute on the host', async () => {
		el.tickInterval = 5;
		await el.updateComplete;
		expect(el.getAttribute('tick-interval')).toBe('5');
	});

	it('reflects min and max on the host', async () => {
		el.min = '10';
		el.max = '20';
		await el.updateComplete;
		expect(el.getAttribute('min')).toBe('10');
		expect(el.getAttribute('max')).toBe('20');
	});
});
