import { afterEach, describe, expect, it } from 'vitest';
import './moni-button.js';
import './moni-split-button.js';
import type { MoniSplitButton } from './moni-split-button.js';

describe('moni-split-button', () => {
	let element: MoniSplitButton | undefined;

	afterEach(() => element?.remove());

	async function create(gap = '') {
		element = document.createElement('moni-split-button') as MoniSplitButton;
		element.gap = gap;
		const leading = document.createElement('moni-button');
		leading.slot = 'leading-button';
		leading.textContent = 'Guardar';
		const trailing = document.createElement('moni-button');
		trailing.slot = 'trailing-button';
		trailing.icon = 'arrow_drop_down';
		element.append(leading, trailing);
		document.body.append(element);
		await element.updateComplete;
		await Promise.resolve();
		await Promise.all([leading.updateComplete, trailing.updateComplete]);
		return { leading, trailing };
	}

	it('mantiene separación y radios internos por defecto', async () => {
		const { leading, trailing } = await create();
		expect(leading.shape).toBe('left-round');
		expect(trailing.shape).toBe('right-round');
	});

	it('permite conectar completamente ambos botones con gap cero', async () => {
		const { leading, trailing } = await create('0');
		expect(leading.shape).toBe('left-round-flat');
		expect(trailing.shape).toBe('right-round-flat');
	});
});
