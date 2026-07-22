import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './moni-tabs.js';
import './moni-tab.js';
import type { MoniTabs } from './moni-tabs.js';
import type { MoniTab } from './moni-tab.js';

describe('moni-tab indicator-size', () => {
	let tabs: MoniTabs;
	let tab: MoniTab;

	beforeEach(() => {
		tabs = document.createElement('moni-tabs') as MoniTabs;
		tab = document.createElement('moni-tab') as MoniTab;
		tab.label = 'Home';
		tab.active = true;
		tabs.appendChild(tab);
		document.body.appendChild(tabs);
	});

	afterEach(() => {
		tabs.remove();
	});

	it('refleja indicatorSize en el host', async () => {
		tabs.indicatorSize = 'min';
		await tabs.updateComplete;
		expect(tabs.getAttribute('indicator-size')).toBe('min');
	});

	it('refleja indicatorSize="max" en el host', async () => {
		tabs.indicatorSize = 'max';
		await tabs.updateComplete;
		expect(tabs.getAttribute('indicator-size')).toBe('max');
	});

	it('refleja indicatorSize="default" en el host', async () => {
		tabs.indicatorSize = 'default';
		await tabs.updateComplete;
		expect(tabs.getAttribute('indicator-size')).toBe('default');
	});

	it('la orientación vertical se refleja en el host de las pestañas (tabs)', async () => {
		tabs.vertical = true;
		await tabs.updateComplete;
		expect(tabs.hasAttribute('vertical')).toBe(true);
	});

	it('el estado activo de la pestaña refleja aria-selected=true', async () => {
		tab.active = true;
		await tab.updateComplete;
		const a = tab.shadowRoot?.querySelector('a');
		expect(a?.getAttribute('aria-selected')).toBe('true');
	});
});
