import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-menu.js';
import type { MoniMenu } from './moni-menu.js';

describe('moni-menu (P3.2 — flip attribute)', () => {
	let el: MoniMenu;

	beforeEach(() => {
		el = document.createElement('moni-menu') as MoniMenu;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('por defecto es placement=bottom y flip=false', async () => {
		await el.updateComplete;
		expect(el.placement).toBe('bottom');
		expect(el.flip).toBe(false);
	});

	it('refleja el atributo flip en el host', async () => {
		el.flip = true;
		await el.updateComplete;
		expect(el.hasAttribute('flip')).toBe(true);
	});

	it('renderiza la clase de placement en el <menu> interno', async () => {
		el.placement = 'top';
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('menu');
		expect(menu?.classList.contains('top')).toBe(true);
	});

	it('refleja active como una clase en el <menu>', async () => {
		el.active = true;
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('menu');
		expect(menu?.classList.contains('active')).toBe(true);

		el.active = false;
		await el.updateComplete;
		expect(menu?.classList.contains('active')).toBe(false);
	});

	it('refleja todos los 6 placements (bottom/top/left/right/min/max)', async () => {
		const placements: Array<'bottom' | 'top' | 'left' | 'right' | 'min' | 'max'> = [
			'bottom',
			'top',
			'left',
			'right',
			'min',
			'max'
		];
		for (const p of placements) {
			el.placement = p;
			await el.updateComplete;
			const menu = el.shadowRoot?.querySelector('menu');
			expect(menu?.classList.contains(p)).toBe(true);
		}
	});

	it('las variantes de espacio (no-space/space/small-space/medium-space/large-space/extra-space) aplican una clase de gap', async () => {
		const spaces = [
			'no-space',
			'space',
			'small-space',
			'medium-space',
			'large-space',
			'extra-space'
		] as const;
		for (const sp of spaces) {
			el.space = sp;
			await el.updateComplete;
			const menu = el.shadowRoot?.querySelector('menu');
			expect(menu?.classList.contains(sp)).toBe(true);
		}
	});

	it('el atributo no-wrap se reenvía a una clase no-wrap', async () => {
		el.noWrap = true;
		await el.updateComplete;
		const menu = el.shadowRoot?.querySelector('menu');
		expect(menu?.classList.contains('no-wrap')).toBe(true);
	});
});
