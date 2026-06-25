import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-segmented-button.js';
import './moni-button-segment.js';
import type { MoniSegmentedButton } from './moni-segmented-button.js';
import type { MoniButtonSegment } from './moni-button-segment.js';

describe('moni-segmented-button', () => {
	let group: MoniSegmentedButton;

	beforeEach(() => {
		group = document.createElement('moni-segmented-button') as MoniSegmentedButton;
		document.body.appendChild(group);
	});

	afterEach(() => {
		group.remove();
	});

	it('sets positioning shape properties on child segments', async () => {
		const seg1 = document.createElement('moni-button-segment') as MoniButtonSegment;
		const seg2 = document.createElement('moni-button-segment') as MoniButtonSegment;
		const seg3 = document.createElement('moni-button-segment') as MoniButtonSegment;
		group.appendChild(seg1);
		group.appendChild(seg2);
		group.appendChild(seg3);

		await group.updateComplete;
		await seg1.updateComplete;
		await seg2.updateComplete;
		await seg3.updateComplete;

		expect(seg1.position).toBe('first');
		expect(seg2.position).toBe('middle');
		expect(seg3.position).toBe('last');
	});

	it('preserves positioning first/last when gap is set', async () => {
		group.gap = 'small';
		const seg1 = document.createElement('moni-button-segment') as MoniButtonSegment;
		const seg2 = document.createElement('moni-button-segment') as MoniButtonSegment;
		group.appendChild(seg1);
		group.appendChild(seg2);

		await group.updateComplete;
		await seg1.updateComplete;
		await seg2.updateComplete;

		expect(seg1.position).toBe('first');
		expect(seg2.position).toBe('last');
	});

	it('manages checked state when clicked in single select mode', async () => {
		const seg1 = document.createElement('moni-button-segment') as MoniButtonSegment;
		seg1.value = 'one';
		const seg2 = document.createElement('moni-button-segment') as MoniButtonSegment;
		seg2.value = 'two';
		group.appendChild(seg1);
		group.appendChild(seg2);

		await group.updateComplete;
		await seg1.updateComplete;
		await seg2.updateComplete;

		seg1.click();
		await seg1.updateComplete;
		expect(seg1.checked).toBe(true);
		expect(group.value).toBe('one');

		seg2.click();
		await seg1.updateComplete;
		await seg2.updateComplete;
		expect(seg1.checked).toBe(false);
		expect(seg2.checked).toBe(true);
		expect(group.value).toBe('two');
	});

	it('manages checked state when clicked in multi select mode', async () => {
		group.multi = true;
		const seg1 = document.createElement('moni-button-segment') as MoniButtonSegment;
		seg1.value = 'one';
		const seg2 = document.createElement('moni-button-segment') as MoniButtonSegment;
		seg2.value = 'two';
		group.appendChild(seg1);
		group.appendChild(seg2);

		await group.updateComplete;
		await seg1.updateComplete;
		await seg2.updateComplete;

		seg1.click();
		seg2.click();
		await seg1.updateComplete;
		await seg2.updateComplete;

		expect(seg1.checked).toBe(true);
		expect(seg2.checked).toBe(true);
		expect(group.value).toBe('one,two');
	});
});
