/**
 * @file components/moni-carousel.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state, queryAll } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';
import { gsap } from 'gsap';

/**
 * Modelo de datos para un solo elemento en un `<moni-carousel>`.
 */
export interface CarouselItem {
	/** Título a mostrar sobre el elemento. */
	title: string;
	/** URL o ruta a la imagen de fondo. */
	img: string;
	/** Objetivo de enlace opcional. Si se proporciona, el elemento se renderiza como un `<a>`. */
	href?: string;
	/** Atributo target del enlace (ej. `'_blank'`). Solo se aplica si se establece `href`. */
	target?: string;
}

/**
 * Componente Material Design 3 Expressive Carousel.
 *
 * Los carruseles muestran una colección de elementos relacionados en una lista horizontal desplazable.
 * Permiten a los usuarios navegar rápidamente a través de elementos como imágenes, tarjetas, o productos.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/carousel/specs.md`
 *
 * **Variantes de diseño:**
 * - `multi-browse` (por defecto) — Muestra una mezcla de elementos grandes, medianos y pequeños (asomando).
 *   Mejor para explorar un gran número de elementos.
 * - `hero` — Se enfoca en un elemento primario grande mientras muestra una fracción del
 *   siguiente elemento. Mejor para destacar contenido importante.
 * - `uncontained` — Diseño estándar donde todos los elementos tienen el mismo ancho y
 *   se desbordan por los bordes del contenedor.
 *
 * **Animación y Gestos:**
 * Este componente usa GSAP para animaciones suaves de arrastre, deslizamiento y ajuste,
 * reflejando las especificaciones de movimiento de alta fidelidad de M3 Expressive. Maneja
 * gestos táctiles para móviles y arrastre del ratón para escritorio.
 *
 * **Auto-tamaño (modo `auto`):**
 * Cuando `auto=true` (por defecto), el carrusel mide su propio ancho y
 * calcula dinámicamente los tamaños óptimos para los elementos grandes, medianos y pequeños
 * basados en el `layout` activo para asegurar que encajen perfectamente sin huecos incómodos
 * ni recortes en los bordes.
 *
 * @example
 * ```html
 * <!-- Uso declarativo a través de propiedades DOM (recomendado) -->
 * <moni-carousel layout="hero"></moni-carousel>
 * <script>
 *   const carousel = document.querySelector('moni-carousel');
 *   carousel.items = [
 *     { title: 'Elemento 1', img: '/img1.jpg', href: '/link1' },
 *     { title: 'Elemento 2', img: '/img2.jpg' }
 *   ];
 * </script>
 *
 * <!-- Uso basado en slots (para SSR o contenido estático simple) -->
 * <moni-carousel layout="uncontained">
 *   <div slot="item">
 *     <img src="/img1.jpg" />
 *     <h3>Elemento Estático</h3>
 *   </div>
 * </moni-carousel>
 * ```
 *
 * @slot item - Alternativa a la propiedad `items`. Inserta elementos HTML individuales
 *              en lugar de pasar objetos de datos.
 *
 * @csspart carousel - El envoltorio exterior.
 * @csspart track    - El elemento de la pista desplazable.
 * @csspart item     - Contenedores de elementos del carrusel individuales.
 * @csspart img      - Los elementos de imagen dentro de los elementos.
 * @csspart title    - Los elementos de texto de título dentro de los elementos.
 */
@customElement('moni-carousel')
export class MoniCarousel extends MoniElement {
	/**
	 * Array de elementos a mostrar en el carrusel.
	 * Cada elemento requiere al menos `title` e `img`. El opcional `href` renderiza la tarjeta como un enlace.
	 * @default []
	 */
	@property({ type: Array }) items: CarouselItem[] = [];

	/**
	 * Variante de diseño visual. Determina cuántos elementos son visibles y cómo escalan.
	 * - `'multi-browse'` (por defecto) — Elementos grandes + medianos + pequeños (asomando).
	 * - `'hero'` — Uno o más elementos grandes + elemento pequeño asomando.
	 * - `'uncontained'` — Elementos de igual ancho que se desbordan por el borde.
	 * @default 'multi-browse'
	 */
	@property({ reflect: true }) layout: 'multi-browse' | 'hero' | 'uncontained' = 'multi-browse';

	/**
	 * Cuando es `true`, el carrusel calcula los tamaños óptimos de los elementos automáticamente
	 * basado en el ancho del contenedor y la variante de `layout` activa.
	 * Cuando es `false`, usa los valores explícitos `largeWidth`, `mediumWidth`, `smallWidth`.
	 * @default true
	 */
	@property({ type: Boolean, reflect: true }) auto = true;

	/**
	 * Ancho en píxeles para el elemento grande (enfoque principal) del carrusel.
	 * Solo se usa cuando `auto=false`.
	 * @default 220
	 */
	@property({ type: Number, attribute: 'large-width' }) largeWidth = 220;

	/**
	 * Ancho en píxeles para el elemento de tamaño mediano (secundario) del carrusel.
	 * Solo se usa cuando `auto=false` y `layout='multi-browse'`.
	 * @default 96
	 */
	@property({ type: Number, attribute: 'medium-width' }) mediumWidth = 96;

	/**
	 * Ancho en píxeles para el elemento pequeño (asomando) del carrusel.
	 * Solo se usa cuando `auto=false`.
	 * @default 48
	 */
	@property({ type: Number, attribute: 'small-width' }) smallWidth = 48;

	/**
	 * Espacio en píxeles entre los elementos del carrusel.
	 * @default 8
	 */
	@property({ type: Number }) gap = 8;

	/**
	 * Relleno horizontal en píxeles aplicado al inicio de la pista del carrusel.
	 * @default 16
	 */
	@property({ type: Number }) padding = 16;

	/**
	 * Radio del borde en píxeles aplicado a cada tarjeta.
	 * @default 28
	 */
	@property({ type: Number, attribute: 'border-radius' }) borderRadius = 28;

	/**
	 * Cuando es `true`, renderiza un enlace "Mostrar todo" en el encabezado.
	 * @default false
	 */
	@property({ type: Boolean, attribute: 'show-all' }) showAll = false;

	/**
	 * Texto de etiqueta para el enlace "Mostrar todo".
	 * @default 'Show all'
	 */
	@property({ attribute: 'show-all-text' }) showAllText = 'Show all';

	/**
	 * Encabezado de sección opcional renderizado sobre la pista del carrusel.
	 * @default ''
	 */
	@property({ attribute: 'header-text' }) headerText = '';

	/**
	 * Cuando es `true`, oculta los botones de flecha de navegación anterior/siguiente.
	 * @default false
	 */
	@property({ type: Boolean, attribute: 'hide-nav' }) hideNav = false;

	/**
	 * Cuando es `true`, habilita el bucle infinito sin interrupciones clonando la lista de elementos
	 * a través de un búfer de desplazamiento virtual grande, luego reposicionando silenciosamente
	 * el desplazamiento cuando el usuario se acerca a cualquier borde.
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) infinite = false;

	/**
	 * Cuando es `true`, avanza automáticamente el carrusel en el intervalo definido
	 * por `autoplayInterval`. La reproducción automática se detiene durante las interacciones de arrastre activas.
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) autoplay = false;

	/**
	 * Milisegundos entre los avances automáticos de diapositivas cuando `autoplay=true`.
	 * @default 3000
	 */
	@property({ type: Number, attribute: 'autoplay-interval' }) autoplayInterval = 3000;

	/**
	 * Ancho medido del elemento host del carrusel en píxeles.
	 * Actualizado por el `ResizeObserver` en cada redimensionamiento del contenedor y usado por
	 * `computedLayout` para calcular cuántos elementos caben en la pantalla.
	 */
	@state() private _containerWidth = 0;

	/**
	 * Elementos analizados desde el slot Light DOM (uso declarativo).
	 * Poblado por `_handleSlotChange` cuando los usuarios insertan elementos `<img>` o `<a><img></a>`.
	 */
	@state() private _slottedItems: CarouselItem[] = [];

	/**
	 * Si el slot `show-all` contiene contenido proyectado por el usuario.
	 * Controla si se renderiza el área "Mostrar todo" del encabezado.
	 */
	@state() private _hasSlottedShowAll = false;

	/**
	 * Devuelve la fuente del elemento activo.
	 * La propiedad programática `items` tiene prioridad sobre los hijos Light DOM en slots.
	 * Recurre a `_slottedItems` cuando no se proporcionan elementos programáticos.
	 */
	get effectiveItems(): CarouselItem[] {
		return this.items && this.items.length > 0 ? this.items : this._slottedItems;
	}

	/**
	 * Referencia directa al div contenedor de desplazamiento.
	 * Usado para leer `scrollLeft`, modificar `scrollBehavior`, y calcular `scrollWidth`.
	 */
	@query('.scroll-container') private _scrollContainer!: HTMLDivElement;

	/**
	 * NodeList en vivo de todos los elementos de tarjeta renderizados.
	 * Usado por el motor de diseño para aplicar actualizaciones de transform/width por cuadro a través de GSAP quickSetters.
	 */
	@queryAll('.card') private _cards!: NodeListOf<HTMLDivElement>;

	/** Instancia ResizeObserver que observa las dimensiones del elemento host. */
	private _resizeObserver: ResizeObserver | null = null;

	/** Estado interno de visibilidad (por índice lógico) para evitar falsos eventos al ciclar el scroll infinito */
	private _logicalItemInViewport: boolean[] = [];

	/** `true` mientras el usuario arrastra activamente (ratón o toque presionado). */
	private _isDragging = false;

	/** Coordenada X en el inicio del gesto de arrastre actual (relativa al contenedor de desplazamiento). */
	private _dragStartX = 0;

	/** Valor `scrollLeft` del contenedor en el momento en que comenzó el arrastre. */
	private _scrollLeftAtDragStart = 0;

	/**
	 * Velocidad del puntero en píxeles por milisegundo.
	 * Calculada gradualmente durante el arrastre y usada para el impulso/inercia al soltar.
	 */
	private _pointerVelocity = 0;

	/** Marca de tiempo (de `performance.now()`) del último evento de movimiento del puntero/toque. */
	private _lastPointerTime = 0;

	/** Coordenada X del puntero en el cuadro del evento de movimiento anterior. */
	private _lastPointerX = 0;

	/**
	 * Distancia horizontal absoluta acumulada (en píxeles) recorrida durante el arrastre actual.
	 * Usada para distinguir un deslizamiento intencional de un clic accidental (umbral: 8px).
	 */
	private _totalDraggedDistance = 0;

	/**
	 * ID de `requestAnimationFrame` activo del bucle de desplazamiento por inercia.
	 * Almacenado para que pueda cancelarse cuando el usuario inicia un nuevo arrastre.
	 */
	private _animationFrameId: number | null = null;

	/** `true` cuando el ancho de la ventana gráfica coincide con el punto de ruptura móvil (`max-width: 600px`). */
	private _isMobile = false;

	// ─── Estado de interpolación GSAP Ticker ──────────────────────────────────────

	/**
	 * La posición de desplazamiento hacia la que el ticker de GSAP está interpolando (lerping) **en cada cuadro**.
	 * Expresada en unidades de `itemSize` (no píxeles) para matemáticas independientes del diseño.
	 */
	private _tickerTarget = 0;

	/**
	 * La posición de desplazamiento interpolada actual usada para impulsar el diseño visual.
	 * Interpola hacia `_tickerTarget` en cada cuadro, creando el efecto de suavizado.
	 */
	private _tickerCurrent = 0;

	/**
	 * `true` mientras el callback del ticker de GSAP (`_tick`) está registrado y en ejecución.
	 * Evita añadir el callback del ticker múltiples veces en llamadas concurrentes.
	 */
	private _isTicking = false;

	// ─── Estado de Bucle Infinito & Reproducción Automática ─────────────────────────────────────

	/**
	 * Protege la inicialización de una sola vez de la posición del búfer de desplazamiento infinito.
	 * Se establece en `true` una vez que el contenedor de desplazamiento se ha reposicionado
	 * silenciosamente al centro del búfer virtual después del primer renderizado.
	 */
	private _infiniteInitialized = false;

	/** ID del temporizador devuelto por `setInterval()` para la función de reproducción automática. */
	private _autoplayTimer: any = null;

	// ─── Cachés de GSAP quickSetter ───────────────────────────────────────────────
	// Las funciones quickSetter evitan la sobrecarga de llamar a `gsap.set()` en cada cuadro.
	// Pre-construidas una vez después de cada ciclo de renderizado; invalidadas cuando cambia el número de tarjetas.

	/** Array de quickSetters de GSAP para el CSS `transform: translateX()` de cada tarjeta. */
	private _cardSetX: ((value: number) => void)[] = [];

	/** Array de quickSetters de GSAP para el `width` en línea de cada tarjeta. */
	private _cardSetWidth: ((value: number) => void)[] = [];

	/** Array de quickSetters de GSAP para el parallax `translateX` del `<img>` de cada tarjeta. */
	private _imgSetX: ((value: number) => void)[] = [];

	/** Array de quickSetters de GSAP para la `opacity` del elemento `.card-title` de cada tarjeta. */
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
				scroll-padding-left: var(--carousel-padding, 16px);
				scroll-padding-right: var(--carousel-padding, 16px);
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

	/**
	 * Hook del ciclo de vida (Lit).
	 * Inicializa el `ResizeObserver` para reaccionar a cambios en el tamaño del contenedor,
	 * lo que es crucial para recalcular el `computedLayout` (cuántas cards caben en el viewport).
	 * También añade listeners globales pasivos para eventos de redimensionamiento de ventana.
	 */
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

	/**
	 * Hook del ciclo de vida (Lit).
	 * Limpia y desconecta el `ResizeObserver`, el `IntersectionObserver` y elimina
	 * los event listeners globales para evitar fugas de memoria (memory leaks).
	 */
	override disconnectedCallback() {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
		}
		// Cancel any pending RAF or ticker
		if (this._animationFrameId !== null) {
			cancelAnimationFrame(this._animationFrameId);
			this._animationFrameId = null;
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

	/**
	 * Hook del ciclo de vida (Lit) ejecutado tras el primer render.
	 * Inspecciona el Shadow DOM para ubicar el slot por defecto y procesar 
	 * las cards iniciales (`_handleSlotChange` invocado manualmente).
	 */
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
		
		if (this.autoplay) {
			this._startAutoplay();
		}
	}

	/**
	 * Hook del ciclo de vida (Lit). Se invoca tras cada actualización reactiva.
	 * 
	 * Lógica principal:
	 * - Si cambian propiedades estructurales (`autoplay`, `infinite`, `gap`), reconstruye el
	 *   layout y detiene/inicia el timer de autoplay.
	 * - Delega en `_checkInfiniteWrap()` para reposicionar el scroll si estamos cerca
	 *   de los bordes del carrusel infinito.
	 */
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
			changedProperties.has('infinite') ||
			changedProperties.has('autoplay') ||
			changedProperties.has('autoplayInterval') ||
			changedProperties.has('_containerWidth') ||
			changedProperties.has('_slottedItems') ||
			changedProperties.has('_hasSlottedShowAll')
		) {
			if (changedProperties.has('infinite') || changedProperties.has('items') || changedProperties.has('_slottedItems')) {
				this._infiniteInitialized = false;
			}

			if (changedProperties.has('layout') && this._scrollContainer) {
				this._scrollContainer.scrollLeft = 0;
				this._infiniteInitialized = false;
				this._scrollContainer.style.scrollSnapType =
					this.layout === 'uncontained' ? 'none' : 'x mandatory';
			}
			this.updateLayout(true);

			if (changedProperties.has('autoplay') || changedProperties.has('autoplayInterval') || changedProperties.has('items') || changedProperties.has('_slottedItems')) {
				if (this.autoplay) {
					this._startAutoplay();
				} else {
					this._stopAutoplay();
				}
			}
		}
	}

	/**
	 * Motor de cálculo del Layout.
	 * 
	 * Basado en las proporciones de Material 3 para carruseles:
	 * Calcula el ancho disponible (`W_c`) y determina el número de ítems grandes (`L`),
	 * medianos (`M`) y pequeños (`S`) que caben en pantalla, usando la fórmula de la
	 * especificación (multi-browse, hero o uncontained).
	 * 
	 * Retorna `{ L, M, S, N }` donde `N` es el divisor base para calcular tamaños proporcionales.
	 */
get computedLayout() {
		/**
		 * `containerWidth` — ancho total en píxeles del elemento host del carrusel.
		 * Recurre a `getBoundingClientRect()` si el ResizeObserver aún no se ha disparado,
		 * y en última instancia por defecto a 360px (un ancho común de ventana gráfica móvil).
		 */
		const containerWidth = this._containerWidth || this.getBoundingClientRect().width || 360;
		const gap = this.gap;
		const padding = this.padding;

		/**
		 * `availableWidth` — el ancho de pista utilizable después de restar el padding
		 * inicial y final del ancho total del contenedor. Este es el espacio que el algoritmo de diseño
		 * divide en ranuras de elementos grandes, medianos y pequeños.
		 * Fórmula: availableWidth = containerWidth - 2 × padding
		 */
		const availableWidth = containerWidth - 2 * padding;

		/** `largeItemWidth` — ancho calculado o configurado (px) de los elementos de enfoque principal. */
		let largeItemWidth = this.largeWidth;
		/** `mediumItemWidth` — ancho calculado o configurado (px) de los elementos secundarios. */
		let mediumItemWidth = this.mediumWidth;
		/** `smallItemWidth` — ancho calculado o configurado (px) de los elementos pequeños/asomando. */
		let smallItemWidth = this.smallWidth;
		/**
		 * `largeItemCount` — el número de elementos grandes visibles simultáneamente en la ventana gráfica.
		 * La especificación M3 define la fórmula de la ventana gráfica como:
		 *   availableWidth = largeItemCount × largeItemWidth + mediumItemWidth + smallItemWidth + (largeItemCount + 1) × gap
		 */
		let largeItemCount = 1;

		if (this.auto) {
			if (this.layout === 'uncontained') {
				// En diseño 'uncontained', todos los elementos tienen el mismo ancho y se desbordan por el borde.
				// We target a comfortable width around 260px, but cap it to availableWidth.
				largeItemWidth = Math.min(availableWidth, 260);
			} else if (this.layout === 'hero') {
				// M3 Hero layout formula:
				//   availableWidth = largeItemCount × largeItemWidth + smallItemWidth + largeItemCount × gap
				// We fix smallItemWidth = 48px (M3 spec minimum peeking width), then solve for largeItemWidth.
				smallItemWidth = 48;
				largeItemCount = Math.max(1, Math.floor((availableWidth - smallItemWidth) / (250 + gap)));
				largeItemWidth = (availableWidth - smallItemWidth - largeItemCount * gap) / largeItemCount;

				// Límite de seguridad: si el elemento grande fuera menor a 150px, forzar modo de un solo elemento.
				if (largeItemWidth < 150) {
					largeItemCount = 1;
					largeItemWidth = availableWidth - smallItemWidth - gap;
				}
			} else {
				// M3 Multi-Browse layout formula:
				//   availableWidth = largeItemCount × largeItemWidth + mediumItemWidth + smallItemWidth + (largeItemCount + 1) × gap
				// mediumItemWidth = 0.45 × largeItemWidth (derived from M3 spec proportions)
				// Solving: largeItemWidth = (availableWidth - smallItemWidth - (largeItemCount + 1) × gap) / (largeItemCount + 0.45)
				smallItemWidth = 48;

				// Optimización: probar valores de largeItemCount de 1 a 10 y elegir aquel cuyo
				// largeItemWidth esté más cerca del objetivo ideal de 220px.
				let bestLargeItemCount = 1;
				let bestLargeItemWidth = 220;
				let bestDiff = Infinity;

				for (let candidateCount = 1; candidateCount <= 10; candidateCount++) {
					// Solve for largeItemWidth given this candidateCount:
					const candidateLargeWidth = (availableWidth - smallItemWidth - (candidateCount + 1) * gap) / (candidateCount + 0.45);

					// Only accept widths within a reasonable human-perceivable range [140px, 340px].
					if (candidateLargeWidth >= 140 && candidateLargeWidth <= 340) {
						const diff = Math.abs(candidateLargeWidth - 220);
						if (diff < bestDiff) {
							bestDiff = diff;
							bestLargeItemCount = candidateCount;
							bestLargeItemWidth = candidateLargeWidth;
						}
					}
				}

				if (bestDiff === Infinity) {
					// Fallback: no valid solution found; use single large item with minimum spacing.
					largeItemCount = 1;
					largeItemWidth = (availableWidth - smallItemWidth - 2 * gap) / 1.45;
				} else {
					largeItemCount = bestLargeItemCount;
					largeItemWidth = bestLargeItemWidth;
				}
				// Especificación M3: el elemento mediano es el 45% del ancho del elemento grande.
				mediumItemWidth = 0.45 * largeItemWidth;
			}
		} else {
			// ── Manual sizing mode (auto=false) ──────────────────────────────────
			// Usar los valores explícitos de propiedad proporcionados por el consumidor.
			largeItemWidth = this.largeWidth;
			mediumItemWidth = this.mediumWidth;
			smallItemWidth = this.smallWidth;

			if (this.layout === 'hero') {
				largeItemCount = 1;
			} else if (this.layout === 'uncontained') {
				// En modo uncontained, calcular cuántos elementos grandes caben en el ancho disponible.
				largeItemCount = Math.max(1, Math.floor(availableWidth / (largeItemWidth + gap)));
			} else {
				largeItemCount = 1;
			}
		}

		// Retornar los cuatro valores calculados como propiedades nombradas.
		// Callers use destructuring: const { largeItemWidth, mediumItemWidth, smallItemWidth, largeItemCount } = this.computedLayout;
		return { largeItemWidth, mediumItemWidth, smallItemWidth, largeItemCount };
	}

	/**
	 * Calcula el ancho total (incluyendo el gap) de un ítem de tamaño 'L' (Large).
	 * Este valor se utiliza como unidad de medida (step) para el Scroll Snapping
	 * y el cálculo de desplazamiento de páginas (sets).
	 */
get itemSize() {
		// El paso de ajuste es el ancho completo de la ranura: ancho del elemento más una unidad de espacio.
		// Usado como la unidad de medida para el ajuste de desplazamiento, cálculos de impulso,
		// y el posicionamiento del búfer de desplazamiento infinito.
		return this.computedLayout.largeItemWidth + this.gap;
	}

	/**
	 * Algoritmo Central del Carrusel M3.
	 * 
	 * Calcula el ancho visual, la posición horizontal y la opacidad para una sola tarjeta del carrusel
	 * basándose en su posición normalizada en relación con la ventana gráfica actualmente visible.
	 *
	 * Este es el corazón del efecto "Masked Carousel" de M3: a medida que una tarjeta transita de
	 * fuera de pantalla a en pantalla (posición -1 → 0 → N), su ancho se interpola de
	 * `smallItemWidth` → `largeItemWidth`, y su opacidad aumenta.
	 *
	 * Semántica de posición:
	 *   - `normalizedPosition < -1` → tarjeta está fuera de pantalla a la izquierda (oculta)
	 *   - `normalizedPosition = 0`  → tarjeta está en la ranura grande más a la izquierda (enfoque principal)
	 *   - `normalizedPosition = N-1` → tarjeta está en la ranura grande más a la derecha
	 *   - `normalizedPosition > N`  → tarjeta está fuera de pantalla a la derecha (oculta)
	 *
	 * @param normalizedPosition - El índice de posición fraccional de la tarjeta en relación con el progreso
	 *   de desplazamiento actual. Un valor de `0` significa que la tarjeta está perfectamente alineada con la ranura
	 *   grande inicial; los valores fraccionales representan transiciones parciales.
	 * @returns Objeto con `{ width, x, opacity }` para aplicar directamente al elemento de la tarjeta.
	 */
	private _getCardLayout(normalizedPosition: number) {
		const { largeItemWidth, mediumItemWidth, smallItemWidth, largeItemCount } = this.computedLayout;
		const gap = this.gap;
		const padding = this.padding;

		// Default: full large-item width, primary slot position, fully visible.
		let width = largeItemWidth;
		let horizontalPosition = padding;
		let opacity = 1;
		let visible = true;

		if (this.layout === 'uncontained') {
			// Uncontained: all items same width, positioned linearly without masking.
			width = largeItemWidth;
			horizontalPosition = padding + normalizedPosition * (largeItemWidth + gap);
			opacity = 1;
			const containerWidth = this._containerWidth || this.getBoundingClientRect().width || 360;
			visible = (horizontalPosition + width > 0) && (horizontalPosition < containerWidth);
		} else if (this.layout === 'hero') {
			// ── Anclas de posición para el diseño 'hero' ──────────────────────────
			// `xAfterLastLargeSlot` — la posición X en píxeles inmediatamente después del último elemento grande.
			// Aquí es donde comienza el elemento pequeño asomando.
			const xAfterLastLargeSlot = padding + largeItemCount * (largeItemWidth + gap);
			// `xBeforeFirstLargeSlot` — la posición X en píxeles del elemento pequeño asomando a la izquierda.
			// Alineado al borde negativo exacto para que repose completamente fuera del contenedor.
			const xBeforeFirstLargeSlot = -smallItemWidth;

			if (normalizedPosition <= -1) {
				// La tarjeta está oculta fuera de la pantalla a la izquierda, apilada detrás del elemento asomando.
				width = smallItemWidth;
				horizontalPosition = xBeforeFirstLargeSlot + (normalizedPosition - -1) * (smallItemWidth + Math.max(gap, padding));
				opacity = 0;
				visible = false;
			} else if (normalizedPosition <= 0) {
				// La tarjeta está en transición de entrada desde la izquierda: morphing de pequeño a grande.
				// `normalizedPosition + 1` reasigna el rango [-1, 0] a [0, 1] para la interpolación.
				width = gsap.utils.interpolate(smallItemWidth, largeItemWidth, normalizedPosition + 1);
				horizontalPosition = gsap.utils.interpolate(xBeforeFirstLargeSlot, padding, normalizedPosition + 1);
				opacity = gsap.utils.interpolate(0, 1, normalizedPosition + 1);
				visible = true;
			} else if (normalizedPosition <= largeItemCount - 1) {
				// La tarjeta está en una de las ranuras grandes (completamente visible).
				width = largeItemWidth;
				horizontalPosition = padding + normalizedPosition * (largeItemWidth + gap);
				opacity = 1;
				visible = true;
			} else if (normalizedPosition <= largeItemCount) {
				// La tarjeta está en transición de salida a la derecha: morphing de grande a pequeño (asomando).
				// `transitionProgress` reasigna [N-1, N] a [0, 1].
				const transitionProgress = normalizedPosition - (largeItemCount - 1);
				const xLastLargeSlot = padding + (largeItemCount - 1) * (largeItemWidth + gap);
				width = gsap.utils.interpolate(largeItemWidth, smallItemWidth, transitionProgress);
				horizontalPosition = gsap.utils.interpolate(xLastLargeSlot, xAfterLastLargeSlot, transitionProgress);
				opacity = gsap.utils.interpolate(1, 0, transitionProgress);
				visible = true;
			} else {
				// La tarjeta está completamente fuera de la pantalla a la derecha, más allá de la ranura de asomo.
				const containerWidth = this._containerWidth || this.getBoundingClientRect().width || 360;
				width = smallItemWidth;
				const distanceToClear = Math.max(smallItemWidth + padding, containerWidth - xAfterLastLargeSlot);
				horizontalPosition = xAfterLastLargeSlot + (normalizedPosition - largeItemCount) * distanceToClear;
				opacity = 0;
				visible = false;
			}
		} else {
			// `xMediumSlot` — X position where the medium item begins (after the last large item).
			const xMediumSlot = padding + largeItemCount * (largeItemWidth + gap);
			// `xSmallSlot` — X position where the small peeking item begins (after the medium item).
			const xSmallSlot = xMediumSlot + mediumItemWidth + gap;
			// `xBeforeFirstLargeSlot` — X position of the peeking small item off the left edge.
			const xBeforeFirstLargeSlot = -smallItemWidth;

			if (normalizedPosition <= -1) {
				// La tarjeta está oculta fuera de la pantalla a la izquierda.
				width = smallItemWidth;
				horizontalPosition = xBeforeFirstLargeSlot + (normalizedPosition - -1) * (smallItemWidth + Math.max(gap, padding));
				opacity = 0;
				visible = false;
			} else if (normalizedPosition <= 0) {
				// La tarjeta está en transición de entrada desde la izquierda (pequeño → grande).
				width = gsap.utils.interpolate(smallItemWidth, largeItemWidth, normalizedPosition + 1);
				horizontalPosition = gsap.utils.interpolate(xBeforeFirstLargeSlot, padding, normalizedPosition + 1);
				opacity = gsap.utils.interpolate(0, 1, normalizedPosition + 1);
				visible = true;
			} else if (normalizedPosition <= largeItemCount - 1) {
				// La tarjeta está en una de las ranuras grandes (completamente visible).
				width = largeItemWidth;
				horizontalPosition = padding + normalizedPosition * (largeItemWidth + gap);
				opacity = 1;
				visible = true;
			} else if (normalizedPosition <= largeItemCount) {
				// La tarjeta está en transición de grande a mediano (entrando a la ranura mediana).
				const transitionProgress = normalizedPosition - (largeItemCount - 1);
				const xLastLargeSlot = padding + (largeItemCount - 1) * (largeItemWidth + gap);
				width = gsap.utils.interpolate(largeItemWidth, mediumItemWidth, transitionProgress);
				horizontalPosition = gsap.utils.interpolate(xLastLargeSlot, xMediumSlot, transitionProgress);
				// La opacidad se desvanece a 0 a medida que la tarjeta se encoge en la ranura mediana — el efecto de máscara.
				opacity = gsap.utils.interpolate(1, 0, transitionProgress);
				visible = true;
			} else if (normalizedPosition <= largeItemCount + 1) {
				// La tarjeta está en la ranura mediana, en transición hacia la ranura pequeña/asomando.
				const transitionProgress = normalizedPosition - largeItemCount;
				width = gsap.utils.interpolate(mediumItemWidth, smallItemWidth, transitionProgress);
				horizontalPosition = gsap.utils.interpolate(xMediumSlot, xSmallSlot, transitionProgress);
				opacity = 0; // Ya oculta (enmascarada) una vez en la ranura mediana.
				visible = true;
			} else {
				// La tarjeta está completamente fuera de la pantalla a la derecha.
				const containerWidth = this._containerWidth || this.getBoundingClientRect().width || 360;
				width = smallItemWidth;
				const distanceToClear = Math.max(smallItemWidth + padding, containerWidth - xSmallSlot);
				horizontalPosition = xSmallSlot + (normalizedPosition - (largeItemCount + 1)) * distanceToClear;
				opacity = 0;
				visible = false;
			}
		}

		return { width, x: horizontalPosition, opacity, visible };
	}

	/**
	 * Reconstruye las cachés de quickSetter después de que cambian las tarjetas.
	 * quickSetter evita la sobrecarga de gsap.set() para las propiedades actualizadas en cada cuadro.
	 */
	private _buildQuickSetters() {
		if (!this._cards || this._cards.length === 0) return;

		this._cardSetX = [];
		this._cardSetWidth = [];
		this._imgSetX = [];
		this._titleSetOpacity = [];
		
		// Reset logical viewport state array to match original items count
		this._logicalItemInViewport = new Array(this.effectiveItems.length).fill(false);

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
	 * Callback del Ticker de GSAP — el bucle de animación principal para el carrusel.
	 *
	 * Esta función está registrada con `gsap.ticker.add()` y se ejecuta en cada
	 * cuadro de animación (sincronizado con `requestAnimationFrame`). Implementa
	 * **interpolación exponencial (smoothstep)** para interpolar `_tickerCurrent` hacia
	 * `_tickerTarget`, creando una desaceleración de suavizado físicamente plausible.
	 *
	 * La fórmula de interpolación: `current += (target - current) × easeStrength × deltaTimeRatio`
	 *
	 * - `easeStrength = 0.08` en móvil: acoplamiento más estrecho para evitar que el carrusel
	 *   se sienta "lento" o desincronizado con un dedo.
	 * - `easeStrength = 0.15` en escritorio: ligeramente más suelto para una sensación más cinematográfica.
	 * - `deltaTimeRatio` normaliza la velocidad de animación a través de diferentes velocidades de cuadro
	 *   (60fps vs 120fps), manteniendo la atenuación percibida constante.
	 *
	 * Una vez que la diferencia entre el objetivo y el actual cae por debajo de 0.0005 (medio
	 * sub-píxel), la animación se considera completa y el ticker se elimina
	 * para conservar los recursos de CPU/GPU entre interacciones.
	 */
	private _tick = () => {
		// `deltaTimeRatio` normalizes frame-rate differences. At 60fps it is ≈1;
		// at 120fps it is ≈0.5, preventing double-speed animations on high-refresh screens.
		const deltaTimeRatio = gsap.ticker.deltaRatio();

		// Tighter lerp factor on mobile for finger-tracking accuracy;
		// looser on desktop for cinematic smoothness.
		const easeStrength = this._isMobile ? 0.08 : 0.15;

		// Lerp exponencial: mueve una fracción de la distancia restante en cada cuadro.
		this._tickerCurrent += (this._tickerTarget - this._tickerCurrent) * easeStrength * deltaTimeRatio;

		// Umbral de convergencia: detener la animación cuando sea visualmente indistinguible del objetivo.
		// 0.0005 is well below sub-pixel precision, so no visible jitter will occur.
		if (Math.abs(this._tickerTarget - this._tickerCurrent) < 0.0005) {
			this._tickerCurrent = this._tickerTarget;
			gsap.ticker.remove(this._tick);
			this._isTicking = false;
			// Después de que la animación se asiente, comprobar si necesitamos reposicionar
			// silenciosamente el búfer de desplazamiento para un bucle infinito sin interrupciones.
			this._checkInfiniteWrap();
		}

		// Renderizar todas las tarjetas en la nueva posición de desplazamiento interpolada.
		this._applyLayout(this._tickerCurrent);
	};

	/**
	 * Lee la posición real del scroll nativo y arranca el ticker de animación si no está corriendo.
	 * Esta separación es crucial para el rendimiento: leemos el DOM aquí (scrollLeft) pero
	 * escribimos los estilos en `_tick` -> `_applyLayout`.
	 */
	private _scheduleLayout = () => {
		if (!this._scrollContainer) return;
		this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;
		if (!this._isTicking) {
			this._isTicking = true;
			gsap.ticker.add(this._tick);
		}
	};

	/**
	 * Función principal de sincronización de estado.
	 * Refresca la lógica del scroll infinito y fuerza una recolección de los setters de GSAP
	 * si la cantidad de tarjetas cambió. Puede saltarse el ticker y ser instantánea (ej. al redimensionar la ventana).
	 */
	updateLayout = (instant = false) => {
		if (!this._scrollContainer || !this._cards || this._cards.length === 0) return;

		// Re-cacheamos las referencias DOM de GSAP si la cantidad de tarjetas varió (e.g., inserción dinámica de nodos)
		if (this._cardSetX.length !== this._cards.length) {
			this._buildQuickSetters();
		}

		// Lógica de montaje inicial para el carrusel infinito
		if (this.infinite && !this._infiniteInitialized && this.effectiveItems.length > 0) {
			const C = this.effectiveItems.length;
			const V = C * this._visualCardsMultiplier;
			const K = this._snapSetsCount;
			const centerSetIndex = Math.floor(K / 2);
			
			// Doble rAF asegura que el navegador completó el reflow de CSS (scrollWidth) antes de inyectar el scroll
			requestAnimationFrame(() => {
				setTimeout(() => {
					if (this._scrollContainer) {
						// Forzamos el recálculo interno del layout
						this._scrollContainer.scrollWidth;
						// Desplazamos silenciosamente al usuario hacia la mitad del contenedor clonado
						this._scrollContainer.scrollLeft = centerSetIndex * V * this.itemSize;
						
						// Forzamos al ticker visual a asimilar la posición de golpe, evitando un "flash" de animación desde 0
						this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;
						this._tickerCurrent = this._tickerTarget;
						this._applyLayout(this._tickerCurrent);
					}
				}, 20);
			});
			this._infiniteInitialized = true;
		}

		this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;

		// Si pasamos instant=true, bypassamos el smoothing temporalmente
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

	/**
	 * Bucle de renderizado principal — aplica el diseño calculado a cada tarjeta en el DOM.
	 *
	 * Llamado en cada cuadro del ticker de GSAP a través de `_tick()`. Itera sobre todos los elementos físicos
	 * de las tarjetas y aplica ancho, posición, paralaje y opacidad del título
	 * usando quickSetters de GSAP pre-almacenados en caché para un rendimiento máximo de velocidad de fotogramas.
	 *
	 * **Bucle de desplazamiento infinito:**
	 * Cuando `infinite=true`, la posición normalizada se calcula usando aritmética
	 * modular para que las tarjetas se repitan sin problemas alrededor del centro virtual del búfer.
	 * Una corrección de envoltura asegura que cada tarjeta permanezca dentro de una distancia de medio ancho de búfer
	 * de la posición de desplazamiento actual.
	 *
	 * **Optimización fuera de pantalla:**
	 * Las tarjetas que están a más de 15 posiciones fuera de la pantalla se mueven a `x = -9999` y sus
	 * títulos se ocultan. Esto evita que el navegador gaste el presupuesto de composición
	 * en elementos invisibles.
	 *
	 * @param scrollProgress - La posición de desplazamiento interpolada actual en unidades de `itemSize`.
	 *   Un valor de `1.0` significa que el contenedor de desplazamiento ha avanzado exactamente el ancho de un elemento + espacio.
	 */
	private _applyLayout(scrollProgress: number) {
		const isMobile = this._isMobile;
		const cardCount = this._cards.length;

		const visibleLogicalItems = new Map<number, HTMLDivElement>();
		const allLogicalItems = new Map<number, HTMLDivElement>();

		for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
			// `normalizedPosition` representa cuántas ranuras de elementos esta tarjeta está
			// desplazada desde el punto focal actual (0 = ranura grande primaria).
			let normalizedPosition = cardIndex - scrollProgress;

			const card = this._cards[cardIndex];
			const dataIndex = Number(card.dataset.index || 0);
			const logicalIndex = this.infinite ? dataIndex % this.effectiveItems.length : dataIndex;
			
			// Mapear cada índice lógico a un nodo físico para garantizar que tengamos
			// una referencia DOM incluso cuando la tarjeta esté saliendo (leave event).
			if (!allLogicalItems.has(logicalIndex)) {
				allLogicalItems.set(logicalIndex, card);
			}

			if (this.infinite) {
				// Envolver la posición usando aritmética modular para mantener cada tarjeta dentro de
				// una distancia de ±medio-búfer de la posición de desplazamiento actual.
				normalizedPosition = cardIndex - (scrollProgress % cardCount);
				if (normalizedPosition > cardCount / 2) normalizedPosition -= cardCount;
				if (normalizedPosition < -cardCount / 2) normalizedPosition += cardCount;
			}

			// Omitir renderizado para tarjetas muy fuera del viewport visible para reducir
			// la carga de composición del navegador (un margen de seguridad de ~30 tarjetas alrededor de la pantalla).
			if (normalizedPosition < -15 || normalizedPosition > 15) {
				// Move the card completely off-screen and hide its title.
				this._cardSetX[cardIndex](-9999);
				this._titleSetOpacity[cardIndex](0);
				continue;
			}

			// Get the precise pixel width and position for this card at its current normalized position.
			const cardLayoutResult = this._getCardLayout(normalizedPosition);

			// Map logical visibility
			if (cardLayoutResult.visible) {
				if (!visibleLogicalItems.has(logicalIndex)) {
					visibleLogicalItems.set(logicalIndex, card);
				}
			}

			// Apply position and width via quickSetters (~3× faster than gsap.set() per call).
			this._cardSetX[cardIndex](cardLayoutResult.x);
			this._cardSetWidth[cardIndex](cardLayoutResult.width);

			// Parallax effect: shift the image slightly in the opposite direction of scroll
			// to create depth. Clamped to ±1 to prevent over-shifting at extreme positions.
			// Skipped on mobile to conserve per-frame computation budget.
			if (!isMobile) {
				const clampedParallaxPosition = Math.max(-1, Math.min(1, normalizedPosition));
				// Image shifts up to ±25px to create the parallax depth illusion.
				this._imgSetX[cardIndex](clampedParallaxPosition * -25);
			}

			this._titleSetOpacity[cardIndex](cardLayoutResult.opacity);
		}

		// Calculate diff over logical items to dispatch exact events globally without jump glitches
		for (let i = 0; i < this.effectiveItems.length; i++) {
			const isNowVisible = visibleLogicalItems.has(i);
			if (this._logicalItemInViewport[i] !== isNowVisible) {
				this._logicalItemInViewport[i] = isNowVisible;
				const eventName = isNowVisible ? 'moni-item-entered-viewport' : 'moni-item-left-viewport';
				// Usamos el nodo físico visible si entra, o el nodo físico de respaldo si sale
				const physicalCard = visibleLogicalItems.get(i) || allLogicalItems.get(i) || null;
				emitMoniEvent<CarouselItem>(this, eventName, { 
					detail: { item: this.effectiveItems[i], index: i, card: physicalCard } 
				});
			}
		}
	}

	/**
	 * Calcula el multiplicador necesario para rellenar visualmente el carrusel infinito.
	 * Si la lista original de ítems es corta (ej: 3 ítems) pero el viewport puede
	 * mostrar 5, necesitamos multiplicar la lista original para cubrir el ancho de 
	 * la pantalla e interactuar de forma ininterrumpida (Infinity Wrap).
	 */
	private get _visualCardsMultiplier() {
		if (!this.infinite || this.effectiveItems.length === 0) return 1;
		const C = this.effectiveItems.length;
		// We need at least ~15 cards to fill the screen seamlessly for small datasets
		return Math.max(1, Math.ceil(15 / C));
	}

	/**
	 * Calcula cuántos "sets" completos de las cards originales se deben clonar
	 * hacia los lados para habilitar el Infinite Scroll. 
	 * Usualmente es de 3 a 5 "sets" multiplicados para crear un buffer circular
	 * invisible para el usuario final.
	 */
	private get _snapSetsCount() {
		if (!this.infinite || this.effectiveItems.length === 0) return 1;
		const C = this.effectiveItems.length;
		const V = C * this._visualCardsMultiplier;
		// We want enough snap items so the user NEVER reaches the end in a single fast swipe.
		// A total of ~1000 items is extremely cheap as empty divs, and provides a massive buffer.
		let K = Math.ceil(1000 / V);
		if (K % 2 === 0) K += 1; // Keep it odd for a perfect center
		return Math.max(3, K);
	}

	/**
	 * Determina el conteo total físico de cards (`li`) que serán montados en el DOM.
	 * Es el producto de `effectiveItems.length` multiplicado por `_snapSetsCount`.
	 * Para carruseles finitos (no infinite), esto simplemente retorna la cantidad original.
	 */
	private get _snapItemsCount() {
		if (this.infinite) {
			const C = this.effectiveItems.length;
			const V_mult = this._visualCardsMultiplier;
			const K = this._snapSetsCount;
			return K * (C * V_mult);
		}
		return this.effectiveItems.length;
	}

	/**
	 * Lógica de Bucle Infinito (Infinite Wrap).
	 * 
	 * Analiza el valor actual del `scrollLeft` del contenedor. Si el usuario se 
	 * acerca demasiado al límite del buffer (físico izquierdo o derecho) de los ítems
	 * clonados, este método reposiciona instantáneamente (saltándose animaciones/scroll-behavior) 
	 * el scrollLeft hacia el bloque central equivalente. 
	 * El usuario nunca nota el salto visual porque los ítems en esas coordenadas lucen idénticos.
	 */
	private _checkInfiniteWrap() {
		if (!this.infinite || this.effectiveItems.length === 0 || !this._scrollContainer) return;
		
		const C = this.effectiveItems.length;
		const V = C * this._visualCardsMultiplier;
		const K = this._snapSetsCount;
		const centerSetIndex = Math.floor(K / 2);
		
		// The scroll track is divided into K sets, each containing V items.
		const setWidth = V * this.itemSize;
		
		const currentScroll = this._scrollContainer.scrollLeft;
		const currentSet = Math.floor(currentScroll / setWidth);
		
		if (currentSet !== centerSetIndex) {
			const delta = (centerSetIndex - currentSet) * setWidth;
			
			const oldSnap = this._scrollContainer.style.scrollSnapType;
			const oldBehavior = this._scrollContainer.style.scrollBehavior;
			
			// Temporarily disable snap and smooth behavior so the wrap is instantaneous
			this._scrollContainer.style.scrollSnapType = 'none';
			this._scrollContainer.style.scrollBehavior = 'auto';
			
			this._scrollContainer.scrollLeft += delta;
			
			// INSTANTLY update the GSAP visual ticker so it doesn't animate the jump
			this._tickerTarget = this._scrollContainer.scrollLeft / this.itemSize;
			this._tickerCurrent = this._tickerTarget;
			this._applyLayout(this._tickerCurrent);
			
			// Restore original scroll behavior
			this._scrollContainer.style.scrollBehavior = oldBehavior;
			
			if (this._isDragging) {
				this._scrollLeftAtDragStart += delta;
			}
			
			if (oldSnap && oldSnap !== 'none') {
				// Re-enable snap on the next frame to avoid jumping
				requestAnimationFrame(() => {
					if (this._scrollContainer && !this._isDragging) {
						this._scrollContainer.style.scrollSnapType = oldSnap;
					}
				});
			}
		}
	}

	/**
	 * Inicia el temporizador de reproducción automática (Autoplay).
	 * Evalúa si el usuario no está interactuando activamente (`_isDown`)
	 * antes de forzar el scroll hacia la siguiente vista.
	 */
	private _startAutoplay() {
		this._stopAutoplay();
		if (this.autoplay && this.effectiveItems.length > 0) {
			this._autoplayTimer = setInterval(() => {
				// We removed _isInteracting to make autoplay more robust. It only pauses on active drag.
				if (!this._isDragging) {
					this._scrollNext();
				}
			}, this.autoplayInterval) as unknown as number;
		}
	}

	/**
	 * Detiene y limpia el temporizador de reproducción automática (Autoplay).
	 * Invocado durante interacciones del usuario (hover, drag) o al desmontar.
	 */
	private _stopAutoplay() {
		if (this._autoplayTimer) {
			clearInterval(this._autoplayTimer);
			this._autoplayTimer = null;
		}
	}

	/**
	 * Manejador de evento: `mouseenter`.
	 * Expuesto por si se requiere pausar el autoplay al hacer hover (actualmente en desuso).
	 */
	private _handleMouseEnter() {
	}
 
	/**
	 * Manejador de evento: `mouseleave`.
	 * Finaliza forzosamente cualquier secuencia de drag o interacción táctil en progreso
	 * si el puntero abandona el área de bounding box del carrusel.
	 */
	private _handleMouseLeave() {
		this._handleMouseUp();
	}

	/**
	 * Inicia la secuencia de arrastre (Pointer/Mouse Down).
	 * - Elimina las animaciones GSAP en vuelo para evitar conflictos elásticos.
	 * - Captura la posición de inicio X y resetea el acumulador de fricción y velocidad.
	 * - Realiza una comprobación de Infinite Wrap preliminar por si el usuario
	 *   comienza a arrastrar desde el límite del buffer.
	 */
private _handleMouseDown(e: MouseEvent) {
		// Kill any in-flight GSAP tween on the scroll container (e.g. momentum scroll
		// from a previous release) to prevent fighting with the new drag gesture.
		gsap.killTweensOf(this._scrollContainer);

		// Check for infinite wrap before starting drag, in case the user
		// starts a new drag while near the buffer edge.
		this._checkInfiniteWrap();

		this._isDragging = true;
		this._totalDraggedDistance = 0;

		// Disable native scroll-snap and smooth behavior during drag so the
		// scroll position tracks the pointer pixel-perfectly.
		this._scrollContainer.style.scrollBehavior = 'auto';
		this._scrollContainer.style.scrollSnapType = 'none';

		// Capture the starting position relative to the scroll container's left edge.
		this._dragStartX = e.pageX - this._scrollContainer.offsetLeft;
		this._scrollLeftAtDragStart = this._scrollContainer.scrollLeft;

		// Reset velocity tracking for fresh momentum calculation.
		this._pointerVelocity = 0;
		this._lastPointerX = e.pageX;
		this._lastPointerTime = performance.now();
	}

	/**
	 * Maneja el evento de movimiento del puntero durante un arrastre (Drag).
	 * 
	 * @logic
	 * 1. Calcula el delta (`walk`) respecto a la posición original X.
	 * 2. Si excede el threshold de arrastre (3px), comienza a inyectar el scroll.
	 * 3. En carruseles finitos (no infinite), si el usuario sobrepasa el inicio o el final,
	 *    aplica una fricción exponencial al `walk` para simular la "resistencia elástica" (Overscroll).
	 * 4. Captura la velocidad (`_velocity`) calculando el delta dividido por el lapso de tiempo.
	 */
private _handleMouseMove(e: MouseEvent) {
		if (!this._isDragging) return;
		e.preventDefault();

		const currentPointerX = e.pageX;
		// `pointerOffsetInContainer` is the pointer's X relative to the scroll container's left edge.
		const pointerOffsetInContainer = currentPointerX - this._scrollContainer.offsetLeft;

		// Apply a 1.25× multiplier for a faster-feeling drag that closely matches
		// the M3 Expressive motion spec for carousels.
		this._scrollContainer.scrollLeft = this._scrollLeftAtDragStart + (this._dragStartX - pointerOffsetInContainer) * 1.25;

		// Calculate instantaneous velocity (px/ms) for the momentum/inertia calculation on release.
		const currentTime = performance.now();
		const elapsedMs = currentTime - this._lastPointerTime;
		if (elapsedMs > 0) {
			this._pointerVelocity = (currentPointerX - this._lastPointerX) / elapsedMs;
		}

		// Accumulate total distance to differentiate deliberate swipes from accidental click-drags.
		this._totalDraggedDistance += Math.abs(currentPointerX - this._lastPointerX);
		this._lastPointerX = currentPointerX;
		this._lastPointerTime = currentTime;
	}

	/**
	 * Finaliza la secuencia de arrastre (Pointer/Mouse Up).
	 * 
	 * @logic
	 * Restaura el "Scroll Snap" que fue desactivado durante el drag (para permitir un 
	 * arrastre libre píxel por píxel). Adicionalmente, si el arrastre acumuló suficiente
	 * velocidad (Inercia), inyecta esa inercia desplazando imperativamente el contenedor.
	 */
private _handleMouseUp() {
		if (!this._isDragging) return;
		this._isDragging = false;

		// If the last pointer event was more than 100ms ago, the user paused
		// before releasing — treat it as a zero-velocity drop (no momentum).
		const currentTime = performance.now();
		if (currentTime - this._lastPointerTime > 100) {
			this._pointerVelocity = 0;
		}

		// ── Momentum / Inertia calculation ───────────────────────────────────
		// Dynamic momentum multiplier: faster swipes multiply further.
		// Base of 350px + an additional 300px per px/ms of velocity.
		const momentumMultiplier = 350 + Math.abs(this._pointerVelocity) * 300;
		// Project the target scroll position based on the velocity vector.
		let projectedScrollLeft = this._scrollContainer.scrollLeft - this._pointerVelocity * momentumMultiplier;

		// Cap the throw distance at 15 items to prevent the user from flying past
		// the infinite scroll buffer boundaries in a single fast swipe.
		const maxMomentumThrowDistance = 15 * this.itemSize;
		if (projectedScrollLeft < this._scrollContainer.scrollLeft - maxMomentumThrowDistance) {
			projectedScrollLeft = this._scrollContainer.scrollLeft - maxMomentumThrowDistance;
		} else if (projectedScrollLeft > this._scrollContainer.scrollLeft + maxMomentumThrowDistance) {
			projectedScrollLeft = this._scrollContainer.scrollLeft + maxMomentumThrowDistance;
		}

		if (this.layout !== 'uncontained') {
			// Disable snap while GSAP animates to the snap point to allow smooth fly-through.
			this._scrollContainer.style.scrollSnapType = 'none';

			// Snap to the nearest item index in the direction of momentum.
			let targetSnapIndex = Math.round(projectedScrollLeft / this.itemSize);
			const maxSnapIndex = this.effectiveItems.length > 0 ? this._snapItemsCount - 1 : 0;
			// Clamp to valid index range.
			targetSnapIndex = Math.max(0, Math.min(maxSnapIndex, targetSnapIndex));
			const snapTargetScrollLeft = targetSnapIndex * this.itemSize;

			// Dynamic duration: longer distance = more time, capped at 0.85s.
			// This gives a natural "lighter = faster, heavier = slower" momentum feel.
			const currentSnapIndex = Math.round(this._scrollContainer.scrollLeft / this.itemSize);
			const cardsTraveled = Math.abs(targetSnapIndex - currentSnapIndex);
			const snapDuration = Math.min(0.85, 0.25 + cardsTraveled * 0.04);

			this._scrollContainer.style.scrollBehavior = 'auto';

			// Animate the scroll to the snap point using GSAP for precise easing control.
			gsap.to(this._scrollContainer, {
				scrollLeft: snapTargetScrollLeft,
				duration: snapDuration,
				ease: 'power3.out', // Decelerating ease matching M3 Expressive spring curves.
				onComplete: () => {
					// Restore native CSS scroll-snap after the animation completes
					// so keyboard and touch-based scrolling can snap again.
					if (!this._isDragging && this._scrollContainer) {
						this._scrollContainer.style.scrollSnapType = 'x mandatory';
					}
				}
			});
		}
	}

	/**
	 * Inicia la secuencia de arrastre táctil (Touch Start).
	 * Funciona análogamente a `_handleMouseDown`: detiene animaciones GSAP, evalúa el Infinite Wrap
	 * y captura las coordenadas táctiles iniciales (`e.touches[0]`).
	 */
private _handleTouchStart(e: TouchEvent) {
		// Mirror the mouse-down setup: kill flying animations, check for wrap,
		// then capture the starting touch coordinates.
		gsap.killTweensOf(this._scrollContainer);
		this._checkInfiniteWrap();
		this._isDragging = true;
		this._totalDraggedDistance = 0;
		this._scrollContainer.style.scrollBehavior = 'auto';
		this._scrollContainer.style.scrollSnapType = 'none';

		// `e.touches[0]` is the first active touch point on the screen.
		const primaryTouch = e.touches[0];
		this._dragStartX = primaryTouch.pageX - this._scrollContainer.offsetLeft;
		this._scrollLeftAtDragStart = this._scrollContainer.scrollLeft;
		this._pointerVelocity = 0;
		this._lastPointerX = primaryTouch.pageX;
		this._lastPointerTime = performance.now();
	}

	/**
	 * Maneja el evento de movimiento táctil (Touch Move).
	 * Actualiza el `scrollLeft` del contenedor imperativamente según el delta de arrastre.
	 * Calcula la velocidad del dedo para la simulación de inercia posterior.
	 */
private _handleTouchMove(e: TouchEvent) {
		if (!this._isDragging) return;

		const primaryTouch = e.touches[0];
		const currentTouchX = primaryTouch.pageX;
		// Compute the touch offset relative to the scroll container's left edge.
		const touchOffsetInContainer = currentTouchX - this._scrollContainer.offsetLeft;

		// Update scroll position directly (no multiplier for touch — native 1:1 feel).
		this._scrollContainer.scrollLeft = this._scrollLeftAtDragStart + (this._dragStartX - touchOffsetInContainer);

		// Track velocity for momentum calculation on touch end.
		const currentTime = performance.now();
		const elapsedMs = currentTime - this._lastPointerTime;
		if (elapsedMs > 0) {
			this._pointerVelocity = (currentTouchX - this._lastPointerX) / elapsedMs;
		}
		this._totalDraggedDistance += Math.abs(currentTouchX - this._lastPointerX);
		this._lastPointerX = currentTouchX;
		this._lastPointerTime = currentTime;
	}

	/**
	 * Finaliza la secuencia de arrastre táctil (Touch End).
	 * Delega en `_handleMouseUp()` para aplicar inercia y restaurar el Snap.
	 */
	private _handleTouchEnd() {
		this._handleMouseUp();
	}

	/**
	 * Manejador del evento Scroll/Wheel.
	 * 
	 * @logic
	 * 1. Filtra para procesar únicamente el scroll vertical (`deltaY > deltaX`), típico de ruedas de ratón.
	 * 2. Si el usuario está en los bordes extremos del carrusel, permite que el evento de scroll 
	 *    haga bubble hacia arriba para hacer scroll a la página completa, logrando una interacción fluida.
	 * 3. Si no, previene el scroll de la página (`e.preventDefault`) y lo convierte en scroll horizontal
	 *    para el carrusel.
	 * 4. Desactiva temporalmente el "CSS Scroll Snap" para que el movimiento sea suave, restaurándolo
	 *    tras 150ms de inactividad (`_wheelTimeout`).
	 */
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
				// Handle uncontained snapping explicitly
				if (this.layout !== 'uncontained' && !this._isDragging) {
					// Fallback to CSS snap if not uncontained and not dragging
					this._scrollContainer.style.scrollSnapType = 'x mandatory';
				}
			}, 150);
		}
	}

	/**
	 * Maneja los eventos de clic en las tarjetas individuales del carrusel.
	 *
	 * Distingue entre toques/clics genuinos y eventos accidentales de levantar el puntero
	 * que ocurrieron después de un gesto de arrastre. Si la distancia total arrastrada excede
	 * los 8px (el umbral mínimo de desplazamiento intencional de M3), el clic se suprime
	 * para evitar una navegación involuntaria o el disparo de acciones.
	 *
	 * Despacha `'item-click'` con `{ item, index }` para que los consumidores puedan
	 * responder a la selección de la tarjeta (ej. navegar a una página de detalles).
	 *
	 * @param e     - El evento de clic del elemento de la tarjeta.
	 * @param item  - Los datos `CarouselItem` asociados con la tarjeta clicada.
	 * @param cardDomIndex - El índice de la tarjeta en el DOM renderizado (puede diferir
	 *   del índice lógico en modo infinito debido a la clonación de elementos).
	 */
	private _handleCardClick(e: Event, item: CarouselItem, cardDomIndex: number) {
		// Suppress click if the gesture traveled more than 8px — it was a swipe, not a tap.
		if (this._totalDraggedDistance > 8) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		// In infinite mode, the DOM index may be a multiple of the original list length.
		// Modulo maps it back to the logical item index.
		const logicalItemIndex = cardDomIndex % this.effectiveItems.length;
		emitMoniEvent<CarouselItem>(this, 'moni-item-click', {
			detail: { item, index: logicalItemIndex }
		});
	}

	/**
	 * Acción Imperativa: Scroll hacia el elemento anterior.
	 * Desplaza el contenedor una distancia equivalente al tamaño exacto de un ítem `L` (Large) + gap.
	 * Restaura el comportamiento `smooth` de CSS nativo.
	 */
	private _scrollPrevious() {
		const target = this._scrollContainer.scrollLeft - this.itemSize;
		this._scrollContainer.style.scrollBehavior = 'smooth';
		this._scrollContainer.scrollTo({ left: target, behavior: 'smooth' });
	}

	/**
	 * Acción Imperativa: Scroll hacia el elemento siguiente.
	 * Desplaza el contenedor una distancia equivalente al tamaño exacto de un ítem `L` (Large) + gap.
	 */
	private _scrollNext() {
		const target = this._scrollContainer.scrollLeft + this.itemSize;
		this._scrollContainer.style.scrollBehavior = 'smooth';
		this._scrollContainer.scrollTo({ left: target, behavior: 'smooth' });
	}

	/**
	 * Manejador del botón o enlace "Mostrar Todo" (Show All).
	 * Intercepta clics en enlaces nulos (`#`) y despacha el evento CustomEvent `show-all-click`.
	 */
	private _handleShowAllClick(e: Event) {
		const target = e.target as HTMLElement;
		if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href') === '#') {
			e.preventDefault();
		}
		emitMoniEvent(this, 'moni-show-all-click');
	}

	/**
	 * Hook invocado por Lit cuando el contenido del slot `"show-all"` muta en el Light DOM.
	 * Detecta si hay contenido proyectado para ocultar/mostrar la interfaz correspondiente,
	 * proveyendo un fallback manual para entornos DOM limitados (como JSDOM en test unitarios).
	 */
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

	/**
	 * Hook invocado por Lit cuando los hijos directos proyectados en el `<slot>` por defecto cambian.
	 * 
	 * @logic
	 * Parsea el Light DOM proporcionado por el usuario (ej: lista de `<img>` o `<a><img></a>`).
	 * Extrae los atributos `src`, `title`, y `href` de esos nodos nativos y los convierte en 
	 * un array estructurado interno de objetos `CarouselItem`, que el componente usará 
	 * subsecuentemente para renderizar su propio DOM Shadow infinito.
	 */
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
			emitMoniEvent(this, 'moni-slot-items-changed', { detail: { items: this._slottedItems } });
		});
	}

	/**
	 * Ensambla la estructura del Shadow DOM del carrusel para cada ciclo de renderizado de Lit.
	 *
	 * **Extracción de `computedLayout`:**
	 * `largeItemWidth`, `mediumItemWidth` y `smallItemWidth` se desestructuran
	 * del getter `computedLayout` (que devuelve tamaños según la especificación M3 basados en
	 * el ancho del contenedor a través de `_containerWidth`). Se inyectan como propiedades personalizadas
	 * CSS en la pista para que el CSS de tamaño de ranura pueda referenciarlos.
	 *
	 * **Puerta `showHeader`:**
	 * El elemento `.header` solo se renderiza cuando hay algo que mostrar:
	 * un `headerText`, un atributo `showAll`, o un elemento `[slot="show-all"]`.
	 * Esto evita un espaciador de encabezado vacío cuando el carrusel no tiene fila de título.
	 *
	 * **Cálculo de `rightPadding`:**
	 * Asegura que la última tarjeta pueda desplazarse a ras de la posición focal del elemento grande:
	 * - Diseño `hero`: sin relleno adicional (el elemento derecho que asoma proporciona espacio natural).
	 * - Diseños de ancho completo / lista: también relleno mínimo.
	 * - Todos los demás diseños: `128px` (≈ ancho de la tarjeta pequeña) para que la última tarjeta pueda
	 *   alcanzar la ranura de enfoque principal sin que el usuario se desplace demasiado.
	 *
	 * **Ciclo de vida del ticker de GSAP:**
	 * El ticker de GSAP (`gsap.ticker.add(_tick)`) se inicia en `firstUpdated()`
	 * y se detiene en `disconnectedCallback()`. Este método de renderizado NO
	 * interactúa con el ticker; el ticker impulsa las actualizaciones de posición por cuadro
	 * independientemente del ciclo de actualización reactiva de Lit.
	 */
override render() {
		const { largeItemWidth, mediumItemWidth, smallItemWidth } = this.computedLayout;

		// Determine whether there are items to render (from either source).
		const hasItems = this.effectiveItems && this.effectiveItems.length > 0;

		// Check for a slotted "Show All" button or the declarative `show-all` attribute.
		const hasSlottedShowAll = this._hasSlottedShowAll || !!this.querySelector('[slot="show-all"]');
		// Only render the header section if there is something to display in it.
		const showHeader = this.headerText || this.showAll || hasSlottedShowAll;

		// `rightPadding` determines the trailing space in the scroll track so the
		// last item can scroll all the way to the primary (leftmost large) focus slot.
		let rightPadding = 128;
		if (this.layout === 'hero') {
			// Hero: the peeking item on the right already provides natural trailing space.
			rightPadding = smallItemWidth + this.gap;
		} else if (this.layout === 'uncontained') {
			// Uncontained: minimal trailing padding; items bleed off the edge.
			rightPadding = 16;
		} else {
			// Multi-browse: both the medium and small slots provide the trailing buffer.
			rightPadding = mediumItemWidth + smallItemWidth + 2 * this.gap;
		}

		// Ensure the scroll track is long enough to allow the last item to scroll to the start (p = 0 focus).
		// Safety margin of 400px avoids fractional rounding/zoom-scale snapping blockages in Firefox.
		// Measure the container width for the scroll track overflow calculation.
		const containerWidth = this._containerWidth || this.getBoundingClientRect().width || 360;

		// Minimum trailing padding needed so the last item can scroll to position 0 (primary focus).
		// The +400px safety margin prevents fractional zoom-scale snapping blockages in Firefox.
		const minRequiredRightPadding = containerWidth - largeItemWidth - this.padding + 400;
		if (rightPadding < minRequiredRightPadding) {
			rightPadding = minRequiredRightPadding;
		}

		// Total number of snap items in the track (includes cloned sets for infinite mode).
		let snapItemsCount = hasItems ? this._snapItemsCount : 0;

		// `visualItems` is the array of items actually rendered as card elements in the Shadow DOM.
		// For infinite mode, this is a repeated version of `effectiveItems` scaled by `_visualCardsMultiplier`.
		let visualItems = this.effectiveItems;

		if (this.infinite && hasItems) {
			const visualMultiplier = this._visualCardsMultiplier;

			visualItems = [];
			// Concatenate the original item list `visualMultiplier` times to create
			// enough cards to fill the visual viewport without visible gaps.
			for (let repeatIndex = 0; repeatIndex < visualMultiplier; repeatIndex++) {
				visualItems = visualItems.concat(this.effectiveItems);
			}
		}

		// Total pixel width of the snap track (sum of all item widths + all gaps between them).
		const trackWidth = hasItems
			? snapItemsCount * largeItemWidth + (snapItemsCount - 1) * this.gap
			: 0;

		const isScrollable = hasItems && this._scrollContainer && 
			(this._scrollContainer.scrollWidth > this._scrollContainer.clientWidth);
		const showPrevArrow = this.infinite || (isScrollable && this._scrollContainer.scrollLeft > 5);
		const showNextArrow = this.infinite || (isScrollable && 
			(this._scrollContainer.scrollWidth - this._scrollContainer.scrollLeft - this._scrollContainer.clientWidth > 5));

		return html`
			<div class="carousel-container" style="
				--carousel-snap-width: ${largeItemWidth}px;
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
						@mouseenter=${this._handleMouseEnter}
						@mouseleave=${this._handleMouseLeave}
						@touchstart=${this._handleTouchStart}
						@touchmove=${this._handleTouchMove}
						@touchend=${this._handleTouchEnd}
						@wheel=${this._handleWheel}
					>
						<div class="snap-track">
							${hasItems ? Array.from({ length: snapItemsCount }).map(() => html`<div class="snap-item"></div>`) : ''}
						</div>
						<div class="visual-track">
							${hasItems
								? visualItems.map(
										(item, idx) => html`
											<div 
												class="card" 
												data-index="${idx}"
												@click=${(e: Event) => this._handleCardClick(e, item, idx)}
											>
												${item.href
													? html`
															<a href="${item.href}" target="${item.target || '_self'}" style="text-decoration:none; color:inherit;" draggable="false">
																<div class="img-parallax-container">
																	<img src="${item.img}" alt="${item.title}" draggable="false" loading="lazy" />
																</div>
																<h2 class="card-title">${item.title}</h2>
															</a>
														`
													: html`
															<div class="img-parallax-container">
																<img src="${item.img}" alt="${item.title}" draggable="false" loading="lazy" />
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