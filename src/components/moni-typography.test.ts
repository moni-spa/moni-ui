import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-typography.js';
import type { MoniTypography } from './moni-typography.js';

describe('moni-typography (P5.2 — recreated)', () => {
	let el: MoniTypography;

	beforeEach(() => {
		el = document.createElement('moni-typography') as MoniTypography;
		document.body.appendChild(el);
	});

	afterEach(() => {
		el.remove();
	});

	it('variant=body, size=medium por defecto', async () => {
		await el.updateComplete;
		expect(el.variant).toBe('body');
		expect(el.size).toBe('medium');
	});

	it('renderiza la etiqueta <p> por defecto para la variante body', async () => {
		el.text = 'Hello';
		await el.updateComplete;
		const el_tag = el.shadowRoot?.querySelector('p');
		expect(el_tag).toBeTruthy();
		expect(el_tag?.textContent?.trim()).toBe('Hello');
	});

	it('renderiza <h1> para la variante display', async () => {
		el.variant = 'display';
		el.text = 'Big text';
		await el.updateComplete;
		const h1 = el.shadowRoot?.querySelector('h1');
		expect(h1).toBeTruthy();
		expect(h1?.classList.contains('display')).toBe(true);
	});

	it('renderiza <h2> para la variante headline', async () => {
		el.variant = 'headline';
		el.text = 'Section';
		await el.updateComplete;
		const h2 = el.shadowRoot?.querySelector('h2');
		expect(h2).toBeTruthy();
		expect(h2?.classList.contains('headline')).toBe(true);
	});

	it('renderiza <h3> para la variante title', async () => {
		el.variant = 'title';
		await el.updateComplete;
		const h3 = el.shadowRoot?.querySelector('h3');
		expect(h3).toBeTruthy();
	});

	it('renderiza <label> para la variante label', async () => {
		el.variant = 'label';
		await el.updateComplete;
		const label = el.shadowRoot?.querySelector('label');
		expect(label).toBeTruthy();
	});

	it('sobrescribe la etiqueta mediante el atributo as', async () => {
		el.variant = 'headline';
		el.as = 'span';
		await el.updateComplete;
		const span = el.shadowRoot?.querySelector('span');
		expect(span).toBeTruthy();
		expect(span?.classList.contains('headline')).toBe(true);
	});

	it('refleja las variaciones de tamaño', async () => {
		el.variant = 'title';
		for (const size of ['large', 'medium', 'small'] as const) {
			el.size = size;
			await el.updateComplete;
			const inner = el.shadowRoot?.querySelector('h3');
			expect(inner?.classList.contains(size)).toBe(true);
		}
	});

	it('soporta las 5 variantes × 3 tamaños', async () => {
		const variants: Array<'display' | 'headline' | 'title' | 'body' | 'label'> = [
			'display',
			'headline',
			'title',
			'body',
			'label'
		];
		const sizes: Array<'large' | 'medium' | 'small'> = ['large', 'medium', 'small'];
		for (const v of variants) {
			for (const s of sizes) {
				el.variant = v;
				el.size = s;
				await el.updateComplete;
				const tagName = v === 'display' ? 'h1'
					: v === 'headline' ? 'h2'
					: v === 'title' ? 'h3'
					: v === 'body' ? 'p'
					: 'label';
				const inner = el.shadowRoot?.querySelector(tagName);
				expect(inner, `${v}/${s}`).toBeTruthy();
				expect(inner?.classList.contains(v), `${v} class`).toBe(true);
				expect(inner?.classList.contains(s), `${s} class`).toBe(true);
			}
		}
	});

	it('renderiza el contenido del slot cuando el atributo text está vacío', async () => {
		el.text = '';
		el.textContent = 'Slotted content';
		await el.updateComplete;
		const p = el.shadowRoot?.querySelector('p');
		const slot = p?.querySelector('slot') as HTMLSlotElement | null;
		const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
		const text = assigned.map((n) => n.textContent ?? '').join('').trim();
		expect(text).toBe('Slotted content');
	});
});