import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Simular ResizeObserver globalmente para el entorno jsdom antes de las importaciones de componentes
globalThis.ResizeObserver = class {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
};

import './moni-carousel.js';
import type { MoniCarousel } from './moni-carousel.js';


describe('moni-carousel', () => {
	let el: MoniCarousel;

	beforeEach(async () => {
		el = document.createElement('moni-carousel') as MoniCarousel;
		el.items = [
			{ title: 'Item 1', img: 'https://picsum.photos/200' },
			{ title: 'Item 2', img: 'https://picsum.photos/200' },
			{ title: 'Item 3', img: 'https://picsum.photos/200' }
		];
		document.body.appendChild(el);
		await el.updateComplete;
	});

	afterEach(() => {
		el.remove();
	});

	it('renderiza el container, viewport y scroll-container', async () => {
		await el.updateComplete;
		const container = el.shadowRoot?.querySelector('.carousel-container');
		const viewport = el.shadowRoot?.querySelector('.carousel-viewport');
		const scrollContainer = el.shadowRoot?.querySelector('.scroll-container');

		expect(container).toBeTruthy();
		expect(viewport).toBeTruthy();
		expect(scrollContainer).toBeTruthy();
	});

	it('renderiza el número correcto de cards y snap-items', async () => {
		await el.updateComplete;
		const cards = el.shadowRoot?.querySelectorAll('.card');
		const snapItems = el.shadowRoot?.querySelectorAll('.snap-item');

		expect(cards?.length).toBe(3);
		expect(snapItems?.length).toBe(3);
	});

	it('renderiza el título del header y el botón show-all cuando se establecen', async () => {
		el.headerText = 'Recent Highlights';
		el.showAll = true;
		el.showAllText = 'View All';
		await el.updateComplete;

		const header = el.shadowRoot?.querySelector('.carousel-header');
		const title = header?.querySelector('h3');
		const showAllLink = header?.querySelector('.show-all-link');

		expect(header).toBeTruthy();
		expect(title?.textContent?.trim()).toBe('Recent Highlights');
		expect(showAllLink?.textContent?.trim()).toBe('View All');
	});

	it('renderiza enlaces en las cards cuando href está especificado en los items', async () => {
		const testEl = document.createElement('moni-carousel') as MoniCarousel;
		testEl.items = [
			{ title: 'Link Item', img: 'https://picsum.photos/200', href: 'https://moni.com', target: '_blank' }
		];
		document.body.appendChild(testEl);
		await testEl.updateComplete;

		const card = testEl.shadowRoot?.querySelector('.card');
		const anchor = card?.querySelector('a');

		expect(anchor).toBeTruthy();
		expect(anchor?.getAttribute('href')).toBe('https://moni.com');
		expect(anchor?.getAttribute('target')).toBe('_blank');

		testEl.remove();
	});

	it('despacha el evento item-click cuando se hace clic en una card', async () => {
		await el.updateComplete;
		const card = el.shadowRoot?.querySelector('.card') as HTMLElement;
		expect(card).toBeTruthy();

		const clickSpy = vi.fn();
		el.addEventListener('item-click', clickSpy);

		card.click();

		expect(clickSpy).toHaveBeenCalledOnce();
		const eventDetail = clickSpy.mock.calls[0][0].detail;
		expect(eventDetail.index).toBe(0);
		expect(eventDetail.item.title).toBe('Item 1');
	});

	it('despacha el evento show-all-click cuando se hace clic en el enlace show-all', async () => {
		el.showAll = true;
		await el.updateComplete;
		const showAllLink = el.shadowRoot?.querySelector('.show-all-link') as HTMLElement;
		expect(showAllLink).toBeTruthy();

		const clickSpy = vi.fn();
		el.addEventListener('show-all-click', clickSpy);

		showAllLink.click();

		expect(clickSpy).toHaveBeenCalledOnce();
	});

	it('actualiza el relleno de ajuste (snap padding) basándose en el tipo de diseño (layout)', async () => {
		el.layout = 'hero';
		await el.updateComplete;
		let containerStyle = el.shadowRoot?.querySelector('.carousel-container')?.getAttribute('style');
		expect(containerStyle?.includes('--carousel-right-padding')).toBe(true);

		el.layout = 'uncontained';
		await el.updateComplete;
		containerStyle = el.shadowRoot?.querySelector('.carousel-container')?.getAttribute('style');
		expect(containerStyle?.includes('--carousel-right-padding')).toBe(true);
	});

	it('renderiza las imágenes insertadas como items', async () => {
		const testEl = document.createElement('moni-carousel') as MoniCarousel;
		const img1 = document.createElement('img');
		img1.src = 'https://picsum.photos/200?1';
		img1.title = 'Slotted 1';
		const img2 = document.createElement('img');
		img2.src = 'https://picsum.photos/200?2';
		img2.title = 'Slotted 2';

		testEl.appendChild(img1);
		testEl.appendChild(img2);
		document.body.appendChild(testEl);

		const slot = testEl.shadowRoot?.querySelector('slot:not([name])');
		slot?.dispatchEvent(new Event('slotchange'));

		await new Promise(r => setTimeout(r, 50));
		await testEl.updateComplete;

		const cards = testEl.shadowRoot?.querySelectorAll('.card');
		expect(cards?.length).toBe(2);

		const title = cards?.[0]?.querySelector('.card-title');
		expect(title?.textContent?.trim()).toBe('Slotted 1');

		testEl.remove();
	});

	it('renderiza el botón show-all insertado y despacha el evento click', async () => {
		const testEl = document.createElement('moni-carousel') as MoniCarousel;
		const btn = document.createElement('button');
		btn.setAttribute('slot', 'show-all');
		btn.textContent = 'Custom Show All';

		testEl.appendChild(btn);
		document.body.appendChild(testEl);
		await testEl.updateComplete;

		const slot = testEl.shadowRoot?.querySelector('slot[name="show-all"]');
		slot?.dispatchEvent(new Event('slotchange'));
		
		await new Promise(r => setTimeout(r, 50));
		await testEl.updateComplete;

		const header = testEl.shadowRoot?.querySelector('.carousel-header');
		expect(header).toBeTruthy();

		const clickSpy = vi.fn();
		testEl.addEventListener('show-all-click', clickSpy);

		btn.click();
		expect(clickSpy).toHaveBeenCalledOnce();

		testEl.remove();
	});

	it('oculta los botones de navegación cuando hideNav es true', async () => {
		const testEl = document.createElement('moni-carousel') as MoniCarousel;
		testEl.hideNav = true;
		document.body.appendChild(testEl);
		await testEl.updateComplete;

		const prevBtn = testEl.shadowRoot?.querySelector('.nav-button.prev');
		const nextBtn = testEl.shadowRoot?.querySelector('.nav-button.next');

		expect(prevBtn).toBeNull();
		expect(nextBtn).toBeNull();

		testEl.remove();
	});

	it('proporciona suficiente ancho de desplazamiento para alcanzar el último elemento (regresión de Firefox)', async () => {
		const testEl = document.createElement('moni-carousel') as MoniCarousel;
		testEl.items = Array.from({ length: 10 }, (_, i) => ({
			title: `Item ${i}`,
			img: 'https://picsum.photos/200'
		}));
		document.body.appendChild(testEl);
		await testEl.updateComplete;

		Object.defineProperty(testEl, '_containerWidth', {
			value: 360,
			configurable: true
		});
		await testEl.updateComplete;
		await new Promise((r) => setTimeout(r, 50));

		const containerStyle =
			testEl.shadowRoot?.querySelector('.carousel-container')?.getAttribute('style') ?? '';
		const itemSize = (testEl as any).itemSize as number;
		const N = testEl.items.length;

		const trackWidthMatch = containerStyle.match(/--carousel-track-width:\s*(\d+(?:\.\d+)?)px/);
		const rightPaddingMatch = containerStyle.match(/--carousel-right-padding:\s*(\d+(?:\.\d+)?)px/);
		const paddingLeftMatch = containerStyle.match(/--carousel-padding:\s*(\d+(?:\.\d+)?)px/);

		expect(trackWidthMatch).not.toBeNull();
		expect(rightPaddingMatch).not.toBeNull();

		const trackWidth = parseFloat(trackWidthMatch![1]);
		const rightPadding = parseFloat(rightPaddingMatch![1]);
		const paddingLeft = paddingLeftMatch ? parseFloat(paddingLeftMatch[1]) : 16;

		const expectedScrollWidth = trackWidth + paddingLeft + rightPadding;
		const clientWidth = 360;
		const lastSnapPoint = (N - 1) * itemSize;

		expect(expectedScrollWidth - clientWidth).toBeGreaterThanOrEqual(lastSnapPoint);

		testEl.remove();
	});
});