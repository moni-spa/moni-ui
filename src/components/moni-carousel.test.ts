import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock ResizeObserver globally for jsdom environment before component imports
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

	it('renders container, viewport and scroll-container', async () => {
		await el.updateComplete;
		const container = el.shadowRoot?.querySelector('.carousel-container');
		const viewport = el.shadowRoot?.querySelector('.carousel-viewport');
		const scrollContainer = el.shadowRoot?.querySelector('.scroll-container');

		expect(container).toBeTruthy();
		expect(viewport).toBeTruthy();
		expect(scrollContainer).toBeTruthy();
	});

	it('renders the correct number of cards and snap-items', async () => {
		await el.updateComplete;
		const cards = el.shadowRoot?.querySelectorAll('.card');
		const snapItems = el.shadowRoot?.querySelectorAll('.snap-item');

		expect(cards?.length).toBe(3);
		expect(snapItems?.length).toBe(3);
	});

	it('renders the header title and show-all button when set', async () => {
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

	it('renders card links when href is specified in items', async () => {
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

	it('dispatches item-click event when card is clicked', async () => {
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

	it('dispatches show-all-click event when show-all link is clicked', async () => {
		el.showAll = true;
		await el.updateComplete;
		const showAllLink = el.shadowRoot?.querySelector('.show-all-link') as HTMLElement;
		expect(showAllLink).toBeTruthy();

		const clickSpy = vi.fn();
		el.addEventListener('show-all-click', clickSpy);

		showAllLink.click();

		expect(clickSpy).toHaveBeenCalledOnce();
	});

	it('updates snap padding based on layout type', async () => {
		el.layout = 'hero';
		await el.updateComplete;
		let containerStyle = el.shadowRoot?.querySelector('.carousel-container')?.getAttribute('style');
		expect(containerStyle?.includes('--carousel-right-padding')).toBe(true);

		el.layout = 'uncontained';
		await el.updateComplete;
		containerStyle = el.shadowRoot?.querySelector('.carousel-container')?.getAttribute('style');
		expect(containerStyle?.includes('--carousel-right-padding')).toBe(true);
	});

	it('renders slotted images as items', async () => {
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

	it('renders slotted show-all button and dispatches click event', async () => {
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

	it('hides navigation buttons when hideNav is true', async () => {
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

	it('provides enough scroll width to reach the last item (Firefox regression)', async () => {
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