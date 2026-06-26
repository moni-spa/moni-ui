/**
 * @file components/moni-carousel.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state, queryAll } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { gsap } from 'gsap';

/**
 * Data model for a single item in a `<moni-carousel>`.
 */
export interface CarouselItem {
	/** Display title overlaid on the item. */
	title: string;
	/** URL or path to the background image. */
	img: string;
	/** Optional link target. If provided, the item renders as an `<a>` element. */
	href?: string;
	/** Link target attribute (e.g. `'_blank'`). Only applies if `href` is set. */
	target?: string;
}

/**
 * Material Design 3 Expressive Carousel component.
 *
 * Carousels display a collection of related items in a scrollable, horizontal list.
 * They allow users to quickly browse through items like images, cards, or products.
 *
 * **M3 spec reference:** `m3-docs/components/carousel/specs.md`
 *
 * **Layout variants:**
 * - `multi-browse` (default) — Shows a mix of large, medium, and small (peeking)
 *   items. Best for exploring a large number of items.
 * - `hero` — Focuses on one large primary item while showing a sliver of the
 *   next item. Best for featuring important content.
 * - `uncontained` — Standard layout where all items have the same width and
 *   bleed off the edges of the container.
 *
 * **Animation & Gestures:**
 * This component uses GSAP for smooth drag, flick, and snap animations,
 * mirroring the high-fidelity M3 Expressive motion specs. It handles touch
 * gestures for mobile and mouse-drag for desktop.
 *
 * **Auto-sizing (`auto` mode):**
 * When `auto=true` (default), the carousel measures its own width and
 * dynamically calculates the optimal sizes for large, medium, and small items
 * based on the active `layout` to ensure they fit perfectly without awkward gaps
 * or clipping at the edges.
 *
 * @example
 * ```html
 * <!-- Declarative usage via DOM properties (recommended) -->
 * <moni-carousel layout="hero"></moni-carousel>
 * <script>
 *   const carousel = document.querySelector('moni-carousel');
 *   carousel.items = [
 *     { title: 'Item 1', img: '/img1.jpg', href: '/link1' },
 *     { title: 'Item 2', img: '/img2.jpg' }
 *   ];
 * </script>
 *
 * <!-- Slot-based usage (for SSR or simple static content) -->
 * <moni-carousel layout="uncontained">
 *   <div slot="item">
 *     <img src="/img1.jpg" />
 *     <h3>Static Item</h3>
 *   </div>
 * </moni-carousel>
 * ```
 *
 * @slot item - Alternative to the `items` property. Slot individual HTML elements
 *              instead of passing data objects.
 *
 * @csspart carousel - The outer wrapper.
 * @csspart track    - The scrolling track element.
 * @csspart item     - Individual carousel item containers.
 * @csspart img      - The image elements inside the items.
 * @csspart title    - The title text elements inside the items.
 */
@customElement('moni-carousel')
export class MoniCarousel extends MoniElement {
	@property({ type: Array }) items: CarouselItem[] = [];
	@property({ reflect: true }) layout: 'multi-browse' | 'hero' | 'uncontained' = 'multi-browse';
	@property({ type: Boolean, reflect: true }) auto = true;
	@property({ type: Number, attribute: 'large-width' }) largeWidth = 220;
	@property({ type: Number, attribute: 'medium-width' }) mediumWidth = 96;
	@property({ type: Number, attribute: 'small-width' }) smallWidth = 48;
	@property({ type: Number }) gap = 8;
	@property({ type: Number }) padding = 16;
	@property({ type: Number, attribute: 'border-radius' }) borderRadius = 28;
	@property({ type: Boolean, attribute: 'show-all' }) showAll = false;
	@property({ attribute: 'show-all-text' }) showAllText = 'Show all';
	@property({ attribute: 'header-text' }) headerText = '';
	@property({ type: Boolean, attribute: 'hide-nav' }) hideNav = false;

	@state() private _containerWidth = 0;
	@state() private _slottedItems: CarouselItem[] = [];
	@state() private _hasSlottedShowAll = false;

	get effectiveItems(): CarouselItem[] {
		return this.items && this.items.length > 0 ? this.items : this._slottedItems;
	}

	@query('.scroll-container') private _scrollContainer!: HTMLDivElement;
	@queryAll('.card') private _cards!: NodeListOf<HTMLDivElement>;

	private _resizeObserver: ResizeObserver | null = null;
	private _isDown = false;
	private _startX = 0;
	private _scrollLeftStart = 0;
	private _velocity = 0;
	private _lastTime = 0;
	private _lastX = 0;
	private _draggedDistance = 0;
	private _rafId: number | null = null;
	private _isMobile = false;

	// Scroll interpolation state
	private _tickerTarget = 0;
	private _tickerCurrent = 0;
	private _isTicking = false;

	// quickSetter caches — avoid gsap.set() overhead per frame
	private _cardSetX: ((value: number) => void)[] = [];
	private _cardSetWidth: ((value: number) => void)[] = [];
	private _imgSetX: ((value: number) => void)[] = [];
	private _titleSetOpacity: ((value: number) => void)[] = [];

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				width: 100%;
				user-select: none;
				-webkit-user-select: none;
			}

			.carousel-container {
				position: relative;
				width: 100%;
				display: flex;
				flex-direction: column;
				gap: 12px;
			}

			.carousel-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding: 0 var(--carousel-padding, 16px);
			}

			.carousel-header h3 {
				margin: 0;
				font-family: var(--font-title, serif);
				font-size: 1.5rem;
				font-weight: 500;
				color: var(--on-surface);
			}

			.show-all-link {
				color: var(--primary);
				font-weight: 500;
				font-size: 0.875rem;
				text-decoration: none;
				cursor: pointer;
				transition: opacity var(--speed2);
			}

			.show-all-link:hover {
				opacity: 0.8;
				text-decoration: underline;
			}

			.carousel-viewport {
				position: relative;
				width: 100%;
				overflow: hidden;
			}

			.scroll-container {
				width: 100%;
				height: 296px;
				overflow-x: auto;
				overflow-y: hidden;
				scroll-snap-type: x mandatory;
				scrollbar-width: none;
				-webkit-overflow-scrolling: touch;
				cursor: grab;
			}

			.scroll-container:active {
				cursor: grabbing;
			}

			.scroll-container::-webkit-scrollbar {
				display: none;
			}

			.snap-track {
				display: flex;
				width: calc(var(--carousel-track-width, 0px) + var(--carousel-right-padding, 128px));
				gap: var(--carousel-gap, 8px);
				padding: 8px 0 8px var(--carousel-padding, 16px);
				height: 100%;
				pointer-events: none;
			}

			.snap-item {
				flex: 0 0 var(--carousel-snap-width, 220px);
				height: 100%;
				scroll-snap-align: start;
				pointer-events: none;
			}

			.visual-track {
				position: absolute;
				left: 0;
				top: 8px;
				width: 0;
				height: 280px;
				overflow: visible;
				pointer-events: none;
			}

			.card {
				position: absolute;
				top: 0;
				height: 280px;
				border-radius: var(--carousel-border-radius, 28px);
				overflow: hidden;
				background-color: var(--surface-container-high);
				pointer-events: auto;
				box-shadow: var(--elevate1);
				will-change: transform;
				cursor: pointer;
				transition: box-shadow var(--speed2);
			}

			.card:hover {
				box-shadow: var(--elevate2);
			}

			.card::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
				pointer-events: none;
				z-index: 1;
			}

			.img-parallax-container {
				width: 100%;
				height: 100%;
				position: relative;
				overflow: hidden;
			}

			.card img {
				width: calc(100% + 50px);
				height: 100%;
				object-fit: cover;
				position: absolute;
				left: -25px;
				pointer-events: none;
				user-select: none;
				-webkit-user-drag: none;
				will-change: transform;
			}

			.card-title {
				position: absolute;
				bottom: 20px;
				left: 20px;
				right: 20px;
				color: #ffffff;
				margin: 0;
				font-size: 1.1rem;
				font-weight: 500;
				pointer-events: none;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				z-index: 2;
			}

			/* Arrow navigation overlays */
			.nav-button {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				z-index: 10;
				width: 48px;
				height: 48px;
				border-radius: 50%;
				background-color: var(--surface-container-highest);
				color: var(--on-surface);
				border: none;
				box-shadow: var(--elevate2);
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				opacity: 0;
				pointer-events: none;
				transition: opacity var(--speed2), background-color var(--speed2);
			}

			.nav-button:hover {
				background-color: var(--primary-container);
				color: var(--on-primary-container);
			}

			.nav-button.prev {
				left: 24px;
			}

			.nav-button.next {
				right: 24px;
			}

			.carousel-viewport:hover .nav-button.visible {
				opacity: 1;
				pointer-events: auto;
			}

			@media (max-width: 600px) {
				.nav-button {
					display: none !important;
				}
			}

			/* Utility icon style inside shadow dom */
			.material-symbols {
				font-family: var(--font-icon);
				font-weight: normal;
				font-style: normal;
				font-size: 24px;
				line-height: 1;
				letter-spacing: normal;
				text-transform: none;
				display: inline-block;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				-webkit-font-smoothing: antialiased;
			}
		`
	];

	override connectedCallback() {
		super.connectedCallback();
		if (typeof ResizeObserver !== 'undefined') {
			this._resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					this._containerWidth = entry.contentRect.width;
					this.updateLayout(true); // Synchronous update for instant resizing!
					this.requestUpdate();
				}
			});
			this._resizeObserver.observe(this);
		}

		// Detect mobile for parallax toggle
		if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
			const mql = window.matchMedia('(max-width: 600px)');
			this._isMobile = mql.matches;
			const handler = (e: MediaQueryListEvent) => { this._isMobile = e.matches; };
			mql.addEventListener('change', handler);
			// Store for cleanup
			(this as any).__mqlCleanup = () => mql.removeEventListener('change', handler);
		}
	}

	override disconnectedCallback() {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
		}
		// Cancel any pending RAF or ticker
		if (this._rafId !== null) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}
		gsap.ticker.remove(this._tick);
		this._isTicking = false;

		// Clean up matchMedia listener
		if ((this as any).__mqlCleanup) {
			(this as any).__mqlCleanup();
			delete (this as any).__mqlCleanup;
		}
		super.disconnectedCallback();
	}

	override firstUpdated() {
		const defaultSlot = this.shadowRoot?.querySelector('slot:not([name])');
		if (defaultSlot) {
			this._handleSlotChange({ target: defaultSlot } as any);
		}
		const showAllSlot = this.shadowRoot?.querySelector('slot[name="show-all"]');
		if (showAllSlot) {
			this._handleShowAllSlotChange({ target: showAllSlot } as any);
		}
		this._buildQuickSetters();
		this.updateLayout(true);
	}

	override updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties);
		if (
			changedProperties.has('layout') ||
			changedProperties.has('largeWidth') ||
			changedProperties.has('mediumWidth') ||
			changedProperties.has('smallWidth') ||
			changedProperties.has('gap') ||
			changedProperties.has('padding') ||
			changedProperties.has('items') ||
			changedProperties.has('hideNav') ||
			changedProperties.has('_containerWidth') ||
			changedProperties.has('_slottedItems') ||
			changedProperties.has('_hasSlottedShowAll')
		) {
			if (changedProperties.has('layout') && this._scrollContainer) {
				this._scrollContainer.scrollLeft = 0;
				this._scrollContainer.style.scrollSnapType =
					this.layout === 'uncontained' ? 'none' : 'x mandatory';
			}
			this.updateLayout(true);
		}
	}

	get computedLayout() {
		const W_c = this._containerWidth || this.getBoundingClientRect().width || 360;
		const gap = this.gap;
		const padding = this.padding;
		const W_a = W_c - 2 * padding;

		let L = this.largeWidth;
		let M = this.mediumWidth;
		let S = this.smallWidth;
		let N = 1;

		if (this.auto) {
			if (this.layout === 'uncontained') {
				// Fits as many L items as possible, letting them bleed off the right edge.
				// We target large width around 260px.
				L = Math.min(W_a, 260);
			} else if (this.layout === 'hero') {
				// Hero has N large items and 1 small peeking item.
				// W_a = N * L + S + N * gap
				S = 48;
				N = Math.max(1, Math.floor((W_a - S) / (250 + gap)));
				L = (W_a - S - N * gap) / N;

				if (L < 150) {
					N = 1;
					L = W_a - S - gap;
				}
			} else {
				// multi-browse: N large items, 1 medium, 1 small
				// W_a = N * L + M + S + (N + 1) * gap
				S = 48;
				let bestN = 1;
				let bestL = 220;
				let bestDiff = Infinity;

				for (let n = 1; n <= 10; n++) {
					const l = (W_a - S - (n + 1) * gap) / (n + 0.45);
					if (l >= 140 && l <= 340) {
						const diff = Math.abs(l - 220);
						if (diff < bestDiff) {
							bestDiff = diff;
							bestN = n;
							bestL = l;
						}
					}
				}

				if (bestDiff === Infinity) {
					N = 1;
					L = (W_a - S - 2 * gap) / 1.45;
				} else {
					N = bestN;
					L = bestL;
				}
				M = 0.45 * L;
			}
		} else {
			// Non-auto/manual sizing mode
			L = this.largeWidth;
			M = this.mediumWidth;
			S = this.smallWidth;

			if (this.layout === 'hero') {
				N = 1;
			} else if (this.layout === 'uncontained') {
				N = Math.max(1, Math.floor(W_a / (L + gap)));
			} else {
				N = 1;
			}
		}

		return { L, M, S, N };
	}

	get itemSize() {
		return this.computedLayout.L + this.gap;
	}

	private _getCardLayout(p: number) {
		const { L, M, S, N } = this.computedLayout;
		const gap = this.gap;
		const padding = this.padding;

		let width = L;
		let x = padding;
		let opacity = 1;

		if (this.layout === 'uncontained') {
			width = L;
			x = padding + p * (L + gap);
			opacity = 1;
		} else if (this.layout === 'hero') {
			const X_N = padding + N * (L + gap);
			const X_M1 = padding - gap - S;

			if (p <= -1) {
				width = S;
				x = X_M1 + (p - -1) * (S + gap);
				opacity = 0;
			} else if (p <= 0) {
				width = gsap.utils.interpolate(S, L, p + 1);
				x = gsap.utils.interpolate(X_M1, padding, p + 1);
				opacity = gsap.utils.interpolate(0, 1, p + 1);
			} else if (p <= N - 1) {
				width = L;
				x = padding + p * (L + gap);
				opacity = 1;
			} else if (p <= N) {
				const u = p - (N - 1);
				const X_last = padding + (N - 1) * (L + gap);
				width = gsap.utils.interpolate(L, S, u);
				x = gsap.utils.interpolate(X_last, X_N, u);
				opacity = gsap.utils.interpolate(1, 0, u);
			} else {
				width = S;
				x = X_N + (p - N) * (S + gap);
				opacity = 0;
			}
		} else {
			// multi-browse
			const X_N = padding + N * (L + gap);
			const X_N1 = X_N + M + gap;
			const X_M1 = padding - gap - S;

			if (p <= -1) {
				width = S;
				x = X_M1 + (p - -1) * (S + gap);
				opacity = 0;
			} else if (p <= 0) {
				width = gsap.utils.interpolate(S, L, p + 1);
				x = gsap.utils.interpolate(X_M1, padding, p + 1);
				opacity = gsap.utils.interpolate(0, 1, p + 1);
			} else if (p <= N - 1) {
				width = L;
				x = padding + p * (L + gap);
				opacity = 1;
			} else if (p <= N) {
				const u = p - (N - 1);
				const X_last = padding + (N - 1) * (L + gap);
				width = gsap.utils.interpolate(L, M, u);
				x = gsap.utils.interpolate(X_last, X_N, u);
				opacity = gsap.utils.interpolate(1, 0, u);
			} else if (p <= N + 1) {
				const u = p - N;
				width = gsap.utils.interpolate(M, S, u);
				x = gsap.utils.interpolate(X_N, X_N1, u);
				opacity = 0;
			} else {
				width = S;
				x = X_N1 + (p - (N + 1)) * (S + gap);
				opacity = 0;
			}
		}

		return { width, x, opacity };
	}

	/**
	 * Rebuild quickSetter caches after cards change.
	 * quickSetter avoids gsap.set() overhead for properties updated every frame.
	 */
	private _buildQuickSetters() {
		if (!this._cards || this._cards.length === 0) return;

		this._cardSetX = [];
		this._cardSetWidth = [];
		this._imgSetX = [];
		this._titleSetOpacity = [];

		this._cards.forEach((card) => {
			this._cardSetX.push(gsap.quickSetter(card, 'x', 'px') as (v: number) => void);
			this._cardSetWidth.push(gsap.quickSetter(card, 'width', 'px') as (v: number) => void);

			const img = card.querySelector('img');
			this._imgSetX.push(
				img ? (gsap.quickSetter(img, 'x', 'px') as (v: number) => void) : (() => {})
			);

			const title = card.querySelector('.card-title');
			this._titleSetOpacity.push(
				title ? (gsap.quickSetter(title, 'opacity') as (v: number) => void) : (() => {})
			);
		});
	}

	/**
	 * RAF-gated version of updateLayout for scroll events.
	 * Prevents multiple layout recalculations per frame.
	 */
	private _tick = () => {
		const dt = gsap.ticker.deltaRatio();
		// Smoother lerp on mobile to avoid abrupt changes ("brusco")
		const ease = this._isMobile ? 0.08 : 0.15;
		this._tickerCurrent += (this._tickerTarget - this._tickerCurrent) * ease * dt;

		if (Math.abs(this._tickerTarget - this._tickerCurrent) < 0.0005) {
			this._tickerCurrent = this._tickerTarget;
			gsap.ticker.remove(this._tick);
			this._isTicking = false;
		}

		this._applyLayout(this._tickerCurrent);
	};

	private _scheduleLayout = () => {
		if (!this._scrollContainer) return;
		this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;
		if (!this._isTicking) {
			this._isTicking = true;
			gsap.ticker.add(this._tick);
		}
	};

	updateLayout = (instant = false) => {
		if (!this._scrollContainer || !this._cards || this._cards.length === 0) return;

		// Rebuild quickSetters if card count changed (e.g. after items update)
		if (this._cardSetX.length !== this._cards.length) {
			this._buildQuickSetters();
		}

		this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;

		if (instant || (!this._isTicking && this._tickerCurrent === 0)) {
			this._tickerCurrent = this._tickerTarget;
			this._applyLayout(this._tickerCurrent);
		} else {
			if (!this._isTicking) {
				this._isTicking = true;
				gsap.ticker.add(this._tick);
			}
		}
	};

	private _applyLayout(t: number) {
		const isMobile = this._isMobile;
		const cardCount = this._cards.length;
		for (let i = 0; i < cardCount; i++) {
			const p = i - t;
			const layout = this._getCardLayout(p);

			// Use quickSetters — ~3x faster than gsap.set() per call
			this._cardSetX[i](layout.x);
			this._cardSetWidth[i](layout.width);

			// Skip parallax on mobile to save per-frame work
			if (!isMobile) {
				const clampedP = Math.max(-1, Math.min(1, p));
				this._imgSetX[i](clampedP * -25);
			}

			this._titleSetOpacity[i](layout.opacity);
		}
	}

	private _handleMouseDown(e: MouseEvent) {
		gsap.killTweensOf(this._scrollContainer);
		this._isDown = true;
		this._draggedDistance = 0;
		this._scrollContainer.style.scrollBehavior = 'auto';
		this._scrollContainer.style.scrollSnapType = 'none';

		this._startX = e.pageX - this._scrollContainer.offsetLeft;
		this._scrollLeftStart = this._scrollContainer.scrollLeft;
		this._velocity = 0;
		this._lastX = e.pageX;
		this._lastTime = performance.now();
	}

	private _handleMouseMove(e: MouseEvent) {
		if (!this._isDown) return;
		e.preventDefault();

		const currentX = e.pageX;
		const x = currentX - this._scrollContainer.offsetLeft;
		this._scrollContainer.scrollLeft = this._scrollLeftStart + (this._startX - x) * 1.25;

		const currentTime = performance.now();
		const dt = currentTime - this._lastTime;
		if (dt > 0) {
			this._velocity = (currentX - this._lastX) / dt;
		}
		this._draggedDistance += Math.abs(currentX - this._lastX);
		this._lastX = currentX;
		this._lastTime = currentTime;
	}

	private _handleMouseUp() {
		if (!this._isDown) return;
		this._isDown = false;

		const currentTime = performance.now();
		if (currentTime - this._lastTime > 100) {
			this._velocity = 0;
		}

		// Dynamic momentum: stronger swipes have a much higher multiplier
		const momentumMultiplier = 350 + Math.abs(this._velocity) * 300;
		const projectedScrollLeft = this._scrollContainer.scrollLeft - this._velocity * momentumMultiplier;

		if (this.layout !== 'uncontained') {
			this._scrollContainer.style.scrollSnapType = 'none';

			let targetIndex = Math.round(projectedScrollLeft / this.itemSize);
			targetIndex = Math.max(0, Math.min(this.effectiveItems.length - 1, targetIndex));
			const snapPoint = targetIndex * this.itemSize;

			// Dynamic duration: longer distance = more time, max 0.85s for faster feeling
			const currentIndex = Math.round(this._scrollContainer.scrollLeft / this.itemSize);
			const cardsSkipped = Math.abs(targetIndex - currentIndex);
			const duration = Math.min(0.85, 0.25 + cardsSkipped * 0.04);

			this._scrollContainer.style.scrollBehavior = 'auto';
			
			gsap.to(this._scrollContainer, {
				scrollLeft: snapPoint,
				duration: duration,
				ease: 'power3.out',
				onComplete: () => {
					if (!this._isDown && this._scrollContainer) {
						this._scrollContainer.style.scrollSnapType = 'x mandatory';
					}
				}
			});
		}
	}

	private _handleTouchStart(e: TouchEvent) {
		gsap.killTweensOf(this._scrollContainer);
		this._isDown = true;
		this._draggedDistance = 0;
		this._scrollContainer.style.scrollBehavior = 'auto';
		this._scrollContainer.style.scrollSnapType = 'none';

		const touch = e.touches[0];
		this._startX = touch.pageX - this._scrollContainer.offsetLeft;
		this._scrollLeftStart = this._scrollContainer.scrollLeft;
		this._velocity = 0;
		this._lastX = touch.pageX;
		this._lastTime = performance.now();
	}

	private _handleTouchMove(e: TouchEvent) {
		if (!this._isDown) return;

		const touch = e.touches[0];
		const currentX = touch.pageX;
		const x = currentX - this._scrollContainer.offsetLeft;
		this._scrollContainer.scrollLeft = this._scrollLeftStart + (this._startX - x);

		const currentTime = performance.now();
		const dt = currentTime - this._lastTime;
		if (dt > 0) {
			this._velocity = (currentX - this._lastX) / dt;
		}
		this._draggedDistance += Math.abs(currentX - this._lastX);
		this._lastX = currentX;
		this._lastTime = currentTime;
	}

	private _handleTouchEnd() {
		this._handleMouseUp();
	}

	private _handleWheel(e: WheelEvent) {
		// Solo interceptar scroll vertical puro (rueda de mouse típica)
		if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
			const maxScroll = this._scrollContainer.scrollWidth - this._scrollContainer.clientWidth;
			const currentScroll = this._scrollContainer.scrollLeft;
			
			// Comprobar si estamos en los bordes para permitir el scroll natural de la página
			const isAtStart = currentScroll <= 0;
			const isAtEnd = currentScroll >= maxScroll - 1; // Margen de 1px por redondeos decimales

			if ((e.deltaY < 0 && isAtStart) || (e.deltaY > 0 && isAtEnd)) {
				return; // Dejar que la página haga scroll vertical
			}

			e.preventDefault(); // Prevenir el scroll de la página

			// Desactivar el snap momentáneamente para que el movimiento de rueda sea fluido
			this._scrollContainer.style.scrollSnapType = 'none';

			// Multiplicador si el deltaMode no es pixel (0)
			let delta = e.deltaY;
			if (e.deltaMode === 1) delta *= 40; // Líneas
			else if (e.deltaMode === 2) delta *= 800; // Páginas

			this._scrollContainer.scrollLeft += delta;

			// Restablecer el snap después de un pequeño retraso
			if ((this as any)._wheelTimeout) clearTimeout((this as any)._wheelTimeout);
			(this as any)._wheelTimeout = setTimeout(() => {
				if (this.layout !== 'uncontained') {
					this._scrollContainer.style.scrollSnapType = 'x mandatory';
				}
			}, 150);
		}
	}

	private _handleCardClick(e: Event, item: CarouselItem, index: number) {
		if (this._draggedDistance > 8) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		this.dispatchEvent(
			new CustomEvent('item-click', {
				detail: { item, index },
				bubbles: true,
				composed: true
			})
		);
	}

	private _scrollPrevious() {
		const target = Math.max(0, this._scrollContainer.scrollLeft - this.itemSize);
		this._scrollContainer.style.scrollBehavior = 'smooth';
		this._scrollContainer.scrollTo({ left: target, behavior: 'smooth' });
	}

	private _scrollNext() {
		const maxScroll = this._scrollContainer.scrollWidth - this._scrollContainer.clientWidth;
		const target = Math.min(maxScroll, this._scrollContainer.scrollLeft + this.itemSize);
		this._scrollContainer.style.scrollBehavior = 'smooth';
		this._scrollContainer.scrollTo({ left: target, behavior: 'smooth' });
	}

	private _handleShowAllClick(e: Event) {
		const target = e.target as HTMLElement;
		if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href') === '#') {
			e.preventDefault();
		}
		this.dispatchEvent(
			new CustomEvent('show-all-click', {
				bubbles: true,
				composed: true
			})
		);
	}

	private _handleShowAllSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		let nodes = typeof slot.assignedElements === 'function' ? slot.assignedElements({ flatten: true }) : [];
		if (nodes.length === 0) {
			nodes = slot.assignedNodes().filter(n => n.nodeType === 1) as Element[];
		}
		if (nodes.length === 0) {
			nodes = Array.from(this.querySelectorAll('[slot="show-all"]')); // Fallback for JSDOM
		}
		this._hasSlottedShowAll = nodes.length > 0;
	}

	private _handleSlotChange(e: Event) {
		const slot = e.target as HTMLSlotElement;
		let nodes = typeof slot.assignedElements === 'function' ? slot.assignedElements({ flatten: true }) : [];
		if (nodes.length === 0) {
			nodes = slot.assignedNodes().filter(n => n.nodeType === 1) as Element[];
		}
		if (nodes.length === 0) {
			nodes = Array.from(this.children).filter(child => child.getAttribute('slot') !== 'show-all'); // Fallback for JSDOM, ignore show-all slot
		}
		const items: CarouselItem[] = [];

		for (const node of nodes) {
			if (node.tagName.toLowerCase() === 'img') {
				const img = node as HTMLImageElement;
				items.push({
					title: img.getAttribute('title') || img.getAttribute('alt') || '',
					img: img.src
				});
			} else if (node.tagName.toLowerCase() === 'a') {
				const anchor = node as HTMLAnchorElement;
				const img = anchor.querySelector('img');
				if (img) {
					items.push({
						title: img.getAttribute('title') || img.getAttribute('alt') || anchor.getAttribute('title') || '',
						img: img.src,
						href: anchor.href,
						target: anchor.target
					});
				}
			}
		}
		this._slottedItems = items;

		// Check if slotted show-all button presence changed
		const hasSlottedShowAll = !!this.querySelector('[slot="show-all"]');
		if (hasSlottedShowAll !== this._hasSlottedShowAll) {
			this._hasSlottedShowAll = hasSlottedShowAll;
		}

		void this.updateComplete.then(() => {
			this.updateLayout(true);
		});
	}

	override render() {
		const { L, M, S } = this.computedLayout;
		const hasItems = this.effectiveItems && this.effectiveItems.length > 0;
		const hasSlottedShowAll = this._hasSlottedShowAll || !!this.querySelector('[slot="show-all"]');
		const showHeader = this.headerText || this.showAll || hasSlottedShowAll;

		let rightPadding = 128;
		if (this.layout === 'hero') {
			rightPadding = S + this.gap;
		} else if (this.layout === 'uncontained') {
			rightPadding = 16;
		} else {
			rightPadding = M + S + 2 * this.gap;
		}

		// Ensure the scroll track is long enough to allow the last item to scroll to the start (p = 0 focus).
		// Safety margin of 400px avoids fractional rounding/zoom-scale snapping blockages in Firefox.
		const W_c = this._containerWidth || this.getBoundingClientRect().width || 360;
		const minRightPaddingNeeded = W_c - L - this.padding + 400;
		if (rightPadding < minRightPaddingNeeded) {
			rightPadding = minRightPaddingNeeded;
		}

		const trackWidth = hasItems
			? this.effectiveItems.length * L + (this.effectiveItems.length - 1) * this.gap
			: 0;

		const isScrollable = hasItems && this._scrollContainer && 
			(this._scrollContainer.scrollWidth > this._scrollContainer.clientWidth);
		const showPrevArrow = isScrollable && this._scrollContainer.scrollLeft > 5;
		const showNextArrow = isScrollable && 
			(this._scrollContainer.scrollWidth - this._scrollContainer.scrollLeft - this._scrollContainer.clientWidth > 5);

		return html`
			<div class="carousel-container" style="
				--carousel-snap-width: ${L}px;
				--carousel-gap: ${this.gap}px;
				--carousel-padding: ${this.padding}px;
				--carousel-right-padding: ${rightPadding}px;
				--carousel-border-radius: ${this.borderRadius}px;
				--carousel-track-width: ${trackWidth}px;
			">
				<slot @slotchange=${this._handleSlotChange} style="display: none;"></slot>
				${showHeader
					? html`
							<div class="carousel-header">
								${this.headerText ? html`<h3>${this.headerText}</h3>` : ''}
								<slot name="show-all" @slotchange=${this._handleShowAllSlotChange} @click=${this._handleShowAllClick}>
									${this.showAll
										? html`
												<a href="#" class="show-all-link">
													${this.showAllText}
												</a>
											`
										: ''}
								</slot>
							</div>
						`
					: ''}

				<div class="carousel-viewport">
					${!this.hideNav
						? html`
								<button 
									class="nav-button prev ${showPrevArrow ? 'visible' : ''}" 
									@click=${this._scrollPrevious}
									aria-label="Previous items"
								>
									<span class="material-symbols">chevron_left</span>
								</button>
							`
						: ''}

					<div
						class="scroll-container"
						@scroll=${this._scheduleLayout}
						@mousedown=${this._handleMouseDown}
						@mousemove=${this._handleMouseMove}
						@mouseup=${this._handleMouseUp}
						@mouseleave=${this._handleMouseUp}
						@touchstart=${this._handleTouchStart}
						@touchmove=${this._handleTouchMove}
						@touchend=${this._handleTouchEnd}
						@wheel=${this._handleWheel}
					>
						<div class="snap-track">
							${hasItems ? this.effectiveItems.map(() => html`<div class="snap-item"></div>`) : ''}
						</div>
						<div class="visual-track">
							${hasItems
								? this.effectiveItems.map(
										(item, idx) => html`
											<div 
												class="card" 
												@click=${(e: Event) => this._handleCardClick(e, item, idx)}
											>
												${item.href
													? html`
															<a href="${item.href}" target="${item.target || '_self'}" style="text-decoration:none; color:inherit;">
																<div class="img-parallax-container">
																	<img src="${item.img}" alt="${item.title}" draggable="false" />
																</div>
																<h2 class="card-title">${item.title}</h2>
															</a>
														`
													: html`
															<div class="img-parallax-container">
																<img src="${item.img}" alt="${item.title}" draggable="false" />
															</div>
															<h2 class="card-title">${item.title}</h2>
														`}
											</div>
										`
									)
								: ''}
						</div>
					</div>

					${!this.hideNav
						? html`
								<button 
									class="nav-button next ${showNextArrow ? 'visible' : ''}" 
									@click=${this._scrollNext}
									aria-label="Next items"
								>
									<span class="material-symbols">chevron_right</span>
								</button>
							`
						: ''}
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-carousel': MoniCarousel;
	}
}