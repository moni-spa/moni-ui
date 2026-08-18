/**
 * @file components/moni-morph-modal.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import './moni-icon.js';

gsap.registerPlugin(Flip, CustomEase);

CustomEase.create('morph-open', '0.15, 0.85, 0.2, 1');
CustomEase.create('morph-close', '0.4, 0, 0.2, 1');


type Placement =
	| 'center'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'viewport-center'
	| 'viewport-top'
	| 'viewport-bottom'
	| 'viewport-left'
	| 'viewport-right'
	| 'viewport-top-left'
	| 'viewport-top-right'
	| 'viewport-bottom-left'
	| 'viewport-bottom-right';

/**
 * Estado interno de coordenadas y estilos del objetivo de morphing antes de la animación.
 *
 * @internal
 */
interface TargetState {
	rect: DOMRect;
	backgroundColor: string;
	color: string;
	borderRadius: string;
	boxShadow: string;
}

/**
 * Referencias a los elementos internos de icono y texto animados durante el morphing.
 *
 * @internal
 */
interface MorphElements {
	text: HTMLElement | null;
	icon: HTMLElement | null;
}

/**
 * Componente Material Design 3 Morph Modal.
 *
 * Un diálogo altamente interactivo que usa animaciones GSAP FLIP (First, Last, Invert, Play)
 * para "transformar" (morph) sin problemas cualquier elemento clickeado en la página en una superficie
 * modal completa, y transformarlo de vuelta cuando se cierra.
 *
 * **Coreografía de movimiento:**
 * Este componente implementa el patrón complejo de transformación de contenedor de M3. Cuando
 * se activa, el elemento origen se expande visualmente hacia el modal. El color de fondo,
 * el radio del borde y la tipografía del modal se desvanecen y se funden
 * perfectamente con el elemento de origen.
 *
 * **Mecanismo de activación:**
 * Los consumidores deben proporcionar la propiedad `triggerEvent` que contenga el `Event`
 * de puntero/clic original que inició la acción de apertura. El componente extrae
 * el `event.target` (o usa `clientX/Y` como respaldo) para determinar las coordenadas
 * de origen exactas para la animación GSAP FLIP.
 *
 * **Comportamiento del diálogo:**
 * Internamente, utiliza el elemento nativo `<dialog>`. Atrapa el foco, soporta
 * `Escape` para cerrar, y maneja clics en el fondo/scrim (que activan la
 * animación de morphing inverso antes de cerrar realmente el diálogo nativo).
 *
 * @example
 * ```html
 * <moni-morph-modal id="myModal" title="Detalles">
 *   <p>Este modal se transformó desde el botón que acabas de clickear.</p>
 * </moni-morph-modal>
 *
 * <moni-button id="openBtn">Abrir Detalles</moni-button>
 *
 * <script>
 *   const modal = document.getElementById('myModal');
 *   document.getElementById('openBtn').addEventListener('click', (e) => {
 *     modal.triggerEvent = e; // Pasa el evento para que sepa desde dónde transformarse
 *     modal.open = true;
 *   });
 * </script>
 * ```
 *
 * @slot default - El contenido del cuerpo principal del modal.
 * @slot header  - Contenido de encabezado personalizado (sobrescribe el atributo `title`).
 * @slot actions - Botones de acción mostrados en la parte inferior derecha.
 */

const litBool = {
	fromAttribute: (value: string | null) => value !== 'false' && value !== null,
	toAttribute: (value: boolean) => (value ? '' : null)
};

@customElement('moni-morph-modal')
export class MoniMorphModal extends MoniElement {
	/**
	 * Selector del elemento disparador desde el cual transformarse (ej. '#fab' o '.my-button').
	 * Si se omite, el modal aún puede activarse programáticamente estableciendo `open = true`.
	 * @type {string}
	 */
	@property({ reflect: true }) target = '';

	/**
	 * Controla el estado abierto/cerrado del modal.
	 * Puede establecerse directamente, o se gestiona internamente cuando se hace clic en el elemento `target`.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, converter: litBool }) open = false;

	/**
	 * Si es true, renderiza un fondo y atrapa el foco, actuando como un verdadero diálogo modal.
	 * @type {boolean}
	 * @default true
	 */
	@property({ type: Boolean, reflect: true, converter: litBool }) modal = true;

	/**
	 * Posición preferida del modal en relación con la ventana gráfica.
	 * @type {Placement}
	 * @default 'center'
	 */
	@property({ reflect: true }) placement: Placement = 'center';

	/**
	 * El ancho del modal cuando está completamente expandido.
	 * @type {string}
	 * @default '22rem'
	 */
	@property({ reflect: true, attribute: 'expanded-width' }) expandedWidth =
		'22rem';

	/**
	 * La altura del modal cuando está completamente expandido.
	 * @type {string}
	 * @default '18rem'
	 */
	@property({ reflect: true, attribute: 'expanded-height' }) expandedHeight =
		'18rem';

	/**
	 * Si es true, hacer clic fuera del modal lo cerrará.
	 * @type {boolean}
	 * @default true
	 */
	@property({ type: Boolean, reflect: true, attribute: 'close-on-click-outside', converter: litBool })
	closeOnClickOutside = true;

	/**
	 * Si es true, presionar la tecla Escape cerrará el modal.
	 * @type {boolean}
	 * @default true
	 */
	@property({ type: Boolean, reflect: true, attribute: 'close-on-esc', converter: litBool })
	closeOnEsc = true;

	/**
	 * Si es true, muestra un botón de icono de cierre por defecto en el encabezado.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'show-close-button', converter: litBool })
	showCloseButton = false;

	/**
	 * Si es true, intenta fundir/transformar una etiqueta del disparador hacia el encabezado del modal.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'morph-label', converter: litBool })
	morphLabel = false;

	/**
	 * Un selector CSS personalizado utilizado para encontrar el elemento de etiqueta específico dentro del target a transformar.
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'morph-label-selector' })
	morphLabelSelector = '';

	/**
	 * Si es true, renderiza un fondo atenuado detrás del modal.
	 * @type {boolean}
	 * @default true
	 */
	@property({ type: Boolean, reflect: true, attribute: 'has-backdrop', converter: litBool })
	hasBackdrop = true;

	/**
	 * Si es true, oculta el elemento disparador (target) mientras el modal está abierto.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'hide-target', converter: litBool })
	hideTarget = false;

	/**
	 * Si es true, fuerza al modal a cubrir visualmente la ubicación original del target antes de expandirse.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'cover-target', converter: litBool })
	coverTarget = false;

	/**
	 * Si es true, el modal calcula automáticamente su tamaño final basándose en el contenido interno (ignora expandedWidth y expandedHeight).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'auto-size', converter: litBool })
	autoSize = false;

	/**
	 * Si es true, aplica un efecto de desenfoque (blur) al contenido durante la animación de entrada y salida.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'blur-content', converter: litBool })
	blurContent = false;

	/** Muestra en consola el origen, geometría y estrategia usada por cada morph. */
	@property({ type: Boolean, reflect: true, converter: litBool })
	debug = false;

	@query('.panel') private _panel!: HTMLDivElement;
	@query('.panel-inner') private _inner!: HTMLDivElement;
	@query('.backdrop') private _backdrop!: HTMLDivElement;
	@query('header') private _header!: HTMLElement;

	@state() private _hasHeader = false;
	@state() private _hasFooter = false;
	@state() private _hasTriggerLabel = false;

	private _targetEl: HTMLElement | null = null;
	private _isAnimating = false;
	private _visible = false;
	private _handlingOpenChange = false;
	private _zIndex = 100;
	private _morphEls: MorphElements = { text: null, icon: null };
	private _targetSnapshot: HTMLElement | null = null;
	private _originFallbacks: HTMLElement[] = [];
	private static _openStack: MoniMorphModal[] = [];
	private _targetStylesCache = new Map<HTMLElement, { opacity: string; color: string }>();

	/**
	 * Handler encapsulado para el evento click en el trigger.
	 * Dispara la animación de apertura.
	 */
	private _onTargetClick = () => this.show();
	/**
	 * Handler encapsulado para interceptar teclas a nivel global (ej: Escape).
	 */
	private _onDocKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);
	/**
	 * Handler de clics globales para detectar interacciones fuera del modal (Click outside).
	 * Sólo cierra el modal si `closeOnClickOutside` es true y el usuario no hizo clic
	 * dentro de las dimensiones del panel animado ni del botón original.
	 */
	private _onDocClick = (e: MouseEvent) => {
		if (!this.open || !this._visible || !this.closeOnClickOutside) return;
		if (e.composedPath().includes(this._panel)) return;
		if (this._targetEl && e.composedPath().includes(this._targetEl)) return;
		this.hide();
	};

	override connectedCallback(): void {
		super.connectedCallback();
		this._resolveTarget();
		document.addEventListener('keydown', this._onDocKeydown);
		document.addEventListener('click', this._onDocClick);
	}

	override disconnectedCallback(): void {
		document.removeEventListener('keydown', this._onDocKeydown);
		document.removeEventListener('click', this._onDocClick);
		if (this._targetEl) {
			this._targetEl.removeEventListener('click', this._onTargetClick);
		}
		const idx = MoniMorphModal._openStack.indexOf(this);
		if (idx > -1) MoniMorphModal._openStack.splice(idx, 1);
		this.style.removeProperty('z-index');
		this.style.removeProperty('--_z-index');
		this.style.removeProperty('--_backdrop-duration');
		this.style.removeProperty('--_backdrop-ease');
		this._cleanupMorphElements();
		this._restoreTargetContent();
		super.disconnectedCallback();
	}

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Observa cambios asíncronos en el atributo `target` para re-bindear el disparador,
	 * y reacciona a cambios programáticos de la propiedad `open` para ejecutar
	 * imperativamente la animación de apertura (`show`) o cierre (`hide`).
	 */
	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('target')) {
			this._resolveTarget();
		}
		if (changed.has('open') && !this._handlingOpenChange) {
			if (this.open) this.show();
			else this.hide();
		}
	}

	/**
	 * Busca en el DOM el elemento que dispara el modal (el trigger) basándose en la propiedad `target`.
	 * Establece el listener de click que iniciará la animación de morphing.
	 */
	private _resolveTarget(): void {
		if (!this.target) return;

		const el = document.querySelector<HTMLElement>(this.target);
		if (!el) {
			// Es normal que no se encuentre el target si está condicionado por un #if en Svelte
			// Se intentará resolver nuevamente al llamar a show()
			return;
		}

		// Si el target cambió dinámicamente, limpiamos el listener anterior para evitar memory leaks
		if (this._targetEl && this._targetEl !== el) {
			this._targetEl.removeEventListener('click', this._onTargetClick);
		}
		this._targetEl = el;
		this._targetEl.addEventListener('click', this._onTargetClick);
	}

	/**
	 * Dispara la apertura del modal y coordina la animación de FLIP (First, Last, Invert, Play) / Morphing.
	 * 1. Oculta visualmente el target original.
	 * 2. Posiciona el modal colapsado exactamente sobre el target original (mismas dimensiones, color, y radios).
	 * 3. Expande fluidamente el modal a sus dimensiones finales mediante transformaciones CSS.
	 */
	show(): void {
		// Prevenimos ejecuciones concurrentes si ya se está animando o está visible
		if (this._isAnimating || this._visible) return;
		
		if (!this._targetEl) this._resolveTarget();
		if (!this._targetEl) {
			console.warn('[moni-morph-modal] cannot show: target not found');
			return;
		}
		this._captureOriginFallbacks(this._targetEl);

		this._isAnimating = true;
		
		// Flag interno para evitar loops infinitos en el hook `updated()`
		this._handlingOpenChange = true;
		this.open = true;
		this._handlingOpenChange = false;

		// Apilamos el modal globalmente para manejar correctamente el z-index en modales anidados
		MoniMorphModal._openStack.push(this);
		this._zIndex = 1000 + MoniMorphModal._openStack.length;
		
		// Aplicamos variables CSS inline para gestionar las transiciones del backdrop y el modal
		this.style.zIndex = String(this._zIndex);
		this.style.setProperty('--_z-index', String(this._zIndex));
		this.style.setProperty('--_backdrop-duration', '0.38s');
		this.style.setProperty('--_backdrop-ease', 'cubic-bezier(0.15, 0.85, 0.2, 1)');
		if (this._backdrop) gsap.set(this._backdrop, { clearProps: 'opacity,transition' });

		// Fase "First": Ocultamos o cubrimos el trigger original según la configuración del desarrollador
		this._hideTargetContent();

		void this.updateComplete.then(async () => {
			if (!this._targetEl || !this._panel || !this._inner) {
				this._isAnimating = false;
				return;
			}
			
			// Añadimos clase para prevenir interacciones durante la animación
			this._panel.classList.add('is-animating');

			// Esperamos un frame para asegurar que el navegador aplicó el `display: block`
			// necesario antes de poder leer las dimensiones.
			await new Promise((resolve) => requestAnimationFrame(resolve));

			// 1. "First": Calculamos el estado visual actual del trigger
			const targetState = this._getTargetState(this._targetEl);
			this._debugMorph('open', this._targetEl, 'target', [this._targetEl]);
			const panel = this._panel;

			// 2. "Invert": Posicionamos el modal como un clon visual exacto del trigger.
			// Desactivamos la sombra y forzamos el color/borde para coincidir con el botón/FAB.
			this._applyRect(panel, this._toPanelCoordinateRect(targetState.rect));
			panel.style.backgroundColor = targetState.backgroundColor;
			panel.style.color = targetState.color;
			panel.style.borderRadius = targetState.borderRadius;
			panel.style.boxShadow = targetState.boxShadow;
			panel.style.zIndex = String(this._zIndex);
			panel.style.visibility = 'visible';
			panel.style.opacity = '1';
			panel.style.pointerEvents = 'auto';

			if (this._backdrop) {
				this._backdrop.style.zIndex = String(this._zIndex - 1);
			}

			// Limpiamos elementos fantasma previos si el usuario interactuó muy rápido
			this._cleanupMorphElements();
			
			// Respetamos la preferencia de sistema de animaciones reducidas por accesibilidad (a11y)
			const prefersReducedMotion = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches;
			
			// 3. Verificamos si debemos orquestar la animación compleja del label flotante cruzado
			let shouldMorph = this._shouldMorphLabel() && !prefersReducedMotion;
			const morphTargets: HTMLElement[] = [];
			let source: any = null;
			const headerWrapper = this.shadowRoot!.querySelector('.header-morph-wrapper') as HTMLElement;

			if (shouldMorph) {
				// Preparamos la estructura del header para que el texto real entre con un fade in
				this._animateLabelOpen();
				
				// Buscamos el ícono y el texto dentro del botón de origen (trigger)
				source = this._resolveMorphSource();
				
				// Si existe un nodo de texto, creamos un elemento flotante (fantasma) en el modal
				if (source.text) {
					const el = this._createMorphText(source.text.content, source.text.sourceEl);
					this._positionElement(el, source.text.rect);
					morphTargets.push(el);
				}
				
				// Hacemos lo mismo si el botón original contenía un icono
				if (source.icon) {
					const el = this._createMorphIcon(source.icon.element);
					this._positionElement(el, source.icon.rect);
					morphTargets.push(el);
				}
				if (morphTargets.length === 0) shouldMorph = false;
			}

			if (shouldMorph && headerWrapper) {
				// Ocultamos temporalmente el contenido final del header mientras animamos los elementos flotantes
				headerWrapper.style.opacity = '0';
			}

			// Capturamos el estado "First" del panel (tamaño pequeño de botón) y de los elementos flotantes
			const state = Flip.getState(panel, {
				props: 'backgroundColor,borderRadius,color,boxShadow'
			});
			const morphState = Flip.getState(morphTargets, {
				props: 'color,fontSize,fontWeight,lineHeight'
			});

			// Fase "Last": Calculamos las dimensiones expandidas del modal basándonos en la configuración
			let naturalSize: { width: number; height: number } | undefined;
			if (this.autoSize) {
				const prevW = panel.style.getPropertyValue('--_panel-width');
				const prevH = panel.style.getPropertyValue('--_panel-height');
				const prevPanelW = panel.style.width;
				const prevPanelH = panel.style.height;
				
				panel.style.width = 'auto';
				panel.style.height = 'auto';
				panel.style.setProperty('--_panel-width', 'max-content');
				panel.style.setProperty('--_panel-height', 'max-content');
				
				const bodyEl = this.shadowRoot!.querySelector('.body') as HTMLElement;
				const prevOverflow = bodyEl ? bodyEl.style.overflow : '';
				if (bodyEl) bodyEl.style.overflow = 'visible';

				// Forzamos al panel-inner a expandirse para medir su contenido real
				naturalSize = { width: this._inner.scrollWidth, height: this._inner.scrollHeight };
				
				panel.style.setProperty('--_panel-width', prevW);
				panel.style.setProperty('--_panel-height', prevH);
				panel.style.width = prevPanelW;
				panel.style.height = prevPanelH;
				
				if (bodyEl) bodyEl.style.overflow = prevOverflow;
			}

			const finalRect = this._computeFinalRect(targetState.rect, naturalSize);
			panel.style.setProperty('--_panel-width', `${finalRect.width}px`);
			panel.style.setProperty('--_panel-height', `${finalRect.height}px`);
			this._applyRect(panel, finalRect);
			
			// Removemos las forzadas de estilo del trigger para que herede las propias del modal
			panel.style.backgroundColor = '';
			panel.style.color = '';
			panel.style.borderRadius = '';
			panel.style.boxShadow = '';

			if (shouldMorph && source) {
				// Medimos dónde van a terminar el icono y el texto dentro del modal ya expandido
				const textRect = this._measureHeaderTextRect();
				const iconRect = this._measureHeaderIconRect();
				const headerComputed = window.getComputedStyle(this._header);

				if (this._morphEls.text && textRect) {
					// Movemos el texto flotante a su destino y le pedimos que adopte los estilos del header
					this._positionElement(this._morphEls.text, textRect);
					this._morphEls.text.style.color = headerComputed.color || 'var(--on-surface)';
					this._morphEls.text.style.fontSize = headerComputed.fontSize || 'inherit';
					this._morphEls.text.style.fontWeight = headerComputed.fontWeight || 'inherit';
					this._morphEls.text.style.lineHeight = headerComputed.lineHeight || 'inherit';
				}

				if (this._morphEls.icon && iconRect) {
					// Hacemos lo mismo con el icono
					this._positionElement(this._morphEls.icon, iconRect);
					this._morphEls.icon.style.color = headerComputed.color || 'var(--on-surface)';
				}
			}

			Flip.from(state, {
				targets: panel,
				duration: 0.38,
				ease: 'morph-open',
				zIndex: this._zIndex,
				onComplete: () => {
					this._isAnimating = false;
					this._visible = true;
					this._cleanupMorphElements();
					if (headerWrapper) headerWrapper.style.opacity = '1';
				}
			});

			if (morphTargets.length > 0) {
				if (this.blurContent) {
					gsap.set(morphTargets, { filter: 'blur(16px)' });
				}
				const flipConfig: any = {
					targets: morphTargets,
					duration: 0.38,
					ease: 'morph-open',
					zIndex: this._zIndex + 10
				};
				if (this.blurContent) {
					flipConfig.filter = 'blur(0px)';
					flipConfig.clearProps = 'filter';
				}
				Flip.from(morphState, flipConfig);
			}

			const body = this.shadowRoot!.querySelector('.body');
			const footer = this.shadowRoot!.querySelector('footer');
			const closeBtn = this.shadowRoot!.querySelector('.close-btn');
			const fadeTargets = [body, footer, closeBtn].filter(Boolean) as HTMLElement[];

			const initialBlur = this.blurContent ? 'blur(16px)' : 'blur(0px)';
			gsap.set(fadeTargets, { opacity: 0, y: 8, filter: initialBlur });
			gsap.fromTo(
				fadeTargets,
				{ opacity: 0, y: 8, filter: initialBlur },
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: 0.32,
					delay: 0.08,
					stagger: 0.04,
					ease: 'power2.out',
					onComplete: () => {
						gsap.set(fadeTargets, { clearProps: 'opacity,transform,filter' });
						this._panel.classList.remove('is-animating');
					}
				}
			);
		});
	}

	/**
	 * Abre el modal realizando el morph desde un elemento proporcionado directamente.
	 * Útil cuando el trigger vive dentro de un Shadow DOM y no puede resolverse con `target`.
	 */
	showFrom(target: HTMLElement): void {
		if (!target) return;
		this._targetEl = target;
		this.show();
	}

	/** Redimensiona y reposiciona suavemente un modal que ya está abierto. */
	resizeTo(width: string, height: string, anchor: 'center' | 'top-left' = 'center'): void {
		this.expandedWidth = width;
		this.expandedHeight = height;
		if (!this._visible || !this._panel || !this._targetEl) return;

		let finalRect = this._computeFinalRect(this._targetEl.getBoundingClientRect());
		const transformedAncestor = this.parentElement?.closest<HTMLElement>('.lab-canvas, [data-morph-coordinate-space]');
		const transform = transformedAncestor ? getComputedStyle(transformedAncestor).transform : 'none';
		let scaleX = 1;
		let scaleY = 1;
		let ancestorRect: DOMRect | undefined;
		if (transformedAncestor && transform !== 'none') {
			const matrix = new DOMMatrix(transform);
			scaleX = Math.hypot(matrix.a, matrix.b) || 1;
			scaleY = Math.hypot(matrix.c, matrix.d) || 1;
			ancestorRect = transformedAncestor.getBoundingClientRect();
		}
		if (anchor === 'top-left') {
			const current = this._panel.getBoundingClientRect();
			let left = current.left;
			let top = current.top;
			if (ancestorRect) {
				left = (current.left - ancestorRect.left) / scaleX;
				top = (current.top - ancestorRect.top) / scaleY;
			}
			finalRect = new DOMRect(left, top, finalRect.width, finalRect.height);
		} else if (anchor === 'center' && ancestorRect) {
			const visualLeft = window.innerWidth / 2 - (finalRect.width * scaleX) / 2;
			const visualTop = window.innerHeight / 2 - (finalRect.height * scaleY) / 2;
			finalRect = new DOMRect(
				(visualLeft - ancestorRect.left) / scaleX,
				(visualTop - ancestorRect.top) / scaleY,
				finalRect.width,
				finalRect.height
			);
		}
		this._panel.classList.add('is-animating');
		gsap.to(this._panel, {
			top: finalRect.top,
			left: finalRect.left,
			width: finalRect.width,
			height: finalRect.height,
			'--_panel-width': `${finalRect.width}px`,
			'--_panel-height': `${finalRect.height}px`,
			duration: 0.32,
			ease: 'morph-open',
			overwrite: true,
			onComplete: () => this._panel?.classList.remove('is-animating'),
			onInterrupt: () => this._panel?.classList.remove('is-animating')
		});
	}

	/**
	 * Solución a un caso borde de FLIP Animations:
	 * Si el `.panel` original carece de un color de fondo sólido, la interpolación
	 * de GSAP puede comportarse erráticamente. Este método "asciende" el árbol del DOM
	 * hasta encontrar un padre con un color de fondo sólido y lo aplica, garantizando
	 * que el modal no colapse de forma transparente de regreso hacia el gatillo.
	 */
	private _ensureSolidPanelBackground() {
		if (!this._panel) return;
		let bg = window.getComputedStyle(this._panel).backgroundColor;
		if (this._isColorTransparent(bg)) {
			const solidBg = this._findSolidBackground(this._panel);
			if (solidBg) {
				this._panel.style.backgroundColor = solidBg;
			} else {
				// Aseguramos un color sólido para evitar bugs de animación FLIP hacia rgba(0,0,0,0).
				// NOTA: GSAP falla si el color inline es un string con var(). Usamos un fallback seguro.
				const fallback = getComputedStyle(document.body).getPropertyValue('--surface-container-high').trim();
				this._panel.style.backgroundColor = fallback || '#2d2d2d';
			}
		}
	}

	hide(): void {
		if (this._isAnimating || !this._visible) return;

		this._isAnimating = true;
		this._panel.classList.add('is-animating');

		// Soluciona el caso donde el usuario no definió un fondo para .panel y lo aplicó en .body
		this._ensureSolidPanelBackground();

		this.style.setProperty('--_backdrop-duration', '0.3s');
		this.style.setProperty('--_backdrop-ease', 'cubic-bezier(0.4, 0, 0.2, 1)');

		const body = this.shadowRoot!.querySelector('.body');
		const footer = this.shadowRoot!.querySelector('footer');
		const closeBtn = this.shadowRoot!.querySelector('.close-btn');
		const headerWrapper = this.shadowRoot!.querySelector('.header-morph-wrapper') as HTMLElement;
		const fadeTargets = [body, footer, closeBtn, headerWrapper].filter(Boolean) as HTMLElement[];

		// El contenido pierde definición al retirarse, evitando un corte plano
		// antes de que la superficie comience su recorrido. `blurContent`
		// conserva la variante más expresiva para quienes desean mayor intensidad.
		const targetBlur = this.blurContent ? 'blur(12px)' : 'blur(6px)';
		gsap.fromTo(
			fadeTargets,
			{ opacity: 1, filter: 'blur(0px)' },
			{
				opacity: 0,
				filter: targetBlur,
				duration: 0.12,
				ease: 'power2.in',
				onComplete: () => {
					const panel = this._panel;
					const closingTarget = this._resolveClosingTarget();

					this._cleanupMorphElements();
					const prefersReducedMotion = window.matchMedia(
						'(prefers-reduced-motion: reduce)'
					).matches;
					// El cierre usa un único snapshot compuesto. La ruta histórica que
					// creaba `morph-text` y `morph-icon` por separado podía ejecutarse a
					// la vez que el snapshot y dejar etiquetas flotando sobre el modal.
					let shouldMorph = false;
					const morphTargets: HTMLElement[] = [];
					let source: any = null;
					let destinationMorph: { element: HTMLElement; rect: DOMRect; source: HTMLElement } | null = null;

					if (shouldMorph) {
						this._animateLabelClose();
						source = this._resolveMorphSource();
						const textRect = this._measureHeaderTextRect();
						const iconRect = this._measureHeaderIconRect();
						const headerComputed = window.getComputedStyle(this._header);

						if (source.text && textRect) {
							const el = this._createMorphText(source.text.content, source.text.sourceEl);
							this._positionElement(el, textRect);
							el.style.color = headerComputed.color || 'var(--on-surface)';
							el.style.fontSize = headerComputed.fontSize || 'inherit';
							el.style.fontWeight = headerComputed.fontWeight || 'inherit';
							el.style.lineHeight = headerComputed.lineHeight || 'inherit';
							morphTargets.push(el);
						}

						if (source.icon && iconRect) {
							const el = this._createMorphIcon(source.icon.element);
							this._positionElement(el, iconRect);
							el.style.color = headerComputed.color || 'var(--on-surface)';
							morphTargets.push(el);
						}

						if (morphTargets.length === 0) shouldMorph = false;
					}

					// Si el destino de cierre cambió, el contenido final debe ser una
					// representación completa del target (no solamente su icono). Esto
					// permite hacer morph hacia rich buttons, cards, imágenes y cualquier
					// otra superficie compuesta.
					if (closingTarget && !shouldMorph && !prefersReducedMotion) {
						const visualTarget = this._resolveVisualTarget(closingTarget);
						const destinationRect = visualTarget.getBoundingClientRect();
						if (destinationRect.width > 0 && destinationRect.height > 0) {
							// El contenido del trigger permanece oculto mientras el modal está
							// abierto. Lo restauramos únicamente durante la captura para que el
							// snapshot no herede opacity:0/color:transparent.
							if (closingTarget === this._targetEl) this._restoreTargetContent();
							const element = this._createTargetSnapshot(visualTarget, destinationRect);
							if (closingTarget === this._targetEl) this._hideTargetContent();
							element.style.opacity = '0';
							destinationMorph = { element, rect: destinationRect, source: visualTarget };
						}
					}

					if (shouldMorph && headerWrapper) {
						headerWrapper.style.opacity = '0';
					}

					const state = Flip.getState(panel, {
						props: 'backgroundColor,borderRadius,color,boxShadow'
					});
					const morphState = Flip.getState(morphTargets, {
						props: 'color,fontSize,fontWeight,lineHeight,opacity'
					});

					if (!closingTarget) {
						gsap.to(this._backdrop, {
							opacity: 0,
							duration: prefersReducedMotion ? 0.01 : 0.22,
							ease: 'power2.in'
						});
						gsap.to(panel, {
							autoAlpha: 0,
							scale: 0.92,
							duration: prefersReducedMotion ? 0.01 : 0.22,
							ease: 'power2.in',
							overwrite: true,
							onComplete: () => {
								gsap.set(panel, { clearProps: 'transform' });
								this._finishHide(fadeTargets, headerWrapper);
							}
						});
						return;
					}

					const targetState = this._getTargetState(closingTarget);
					if (destinationMorph) {
						this._runTargetMorphTimeline(
							panel,
							targetState,
							destinationMorph,
							fadeTargets,
							headerWrapper,
							prefersReducedMotion
						);
						return;
					}
					
					let naturalSize: { width: number; height: number } | undefined;
					if (this.autoSize) {
						const prevW = panel.style.getPropertyValue('--_panel-width');
						const prevH = panel.style.getPropertyValue('--_panel-height');
						const prevPanelW = panel.style.width;
						const prevPanelH = panel.style.height;

						panel.style.width = 'auto';
						panel.style.height = 'auto';
						panel.style.setProperty('--_panel-width', 'max-content');
						panel.style.setProperty('--_panel-height', 'max-content');
						
						const bodyEl = this.shadowRoot!.querySelector('.body') as HTMLElement;
						const prevOverflow = bodyEl ? bodyEl.style.overflow : '';
						if (bodyEl) bodyEl.style.overflow = 'visible';

						naturalSize = { width: this._inner.scrollWidth, height: this._inner.scrollHeight };
						
						panel.style.setProperty('--_panel-width', prevW);
						panel.style.setProperty('--_panel-height', prevH);
						panel.style.width = prevPanelW;
						panel.style.height = prevPanelH;
						
						if (bodyEl) bodyEl.style.overflow = prevOverflow;
					}

					const finalRect = this._computeFinalRect(targetState.rect, naturalSize);
					panel.style.setProperty('--_panel-width', `${finalRect.width}px`);
					panel.style.setProperty('--_panel-height', `${finalRect.height}px`);

					this._applyRect(panel, this._toPanelCoordinateRect(targetState.rect));
					panel.style.backgroundColor = targetState.backgroundColor;
					panel.style.color = targetState.color;
					panel.style.borderRadius = targetState.borderRadius;
					panel.style.boxShadow = targetState.boxShadow;

					if (shouldMorph && source) {
						if (this._morphEls.text && source.text) {
							this._positionElement(this._morphEls.text, source.text.rect);
							this._morphEls.text.style.color =
								window.getComputedStyle(source.text.sourceEl).color || 'inherit';
							this._morphEls.text.style.fontSize =
								window.getComputedStyle(source.text.sourceEl).fontSize || 'inherit';
							this._morphEls.text.style.fontWeight =
								window.getComputedStyle(source.text.sourceEl).fontWeight || 'inherit';
							this._morphEls.text.style.lineHeight =
								window.getComputedStyle(source.text.sourceEl).lineHeight || 'inherit';
						}
						if (this._morphEls.icon && source.icon) {
							this._positionElement(this._morphEls.icon, source.icon.rect);
							this._morphEls.icon.style.color =
								window.getComputedStyle(source.icon.element).color || 'inherit';
						}
					}
					Flip.from(state, {
						targets: panel,
						duration: 0.3,
						ease: 'morph-close',
						zIndex: this._zIndex,
						onComplete: () => this._finishHide(fadeTargets, headerWrapper)
					});
					gsap.to(this._backdrop, {
						opacity: 0,
						duration: 0.3,
						ease: 'power2.inOut'
					});

					if (morphTargets.length > 0) {
						if (this.blurContent) {
							gsap.set(morphTargets, { filter: 'blur(0px)' });
						}
						const flipConfig: any = {
							targets: morphTargets,
							duration: 0.3,
							ease: 'morph-close',
							zIndex: this._zIndex + 10
						};
						if (this.blurContent) {
							flipConfig.filter = 'blur(12px)';
						}
						Flip.from(morphState, flipConfig);
					}
				}
			}
		);
	}

	private _runTargetMorphTimeline(
		panel: HTMLElement,
		target: TargetState,
		destination: { element: HTMLElement; rect: DOMRect; source: HTMLElement },
		fadeTargets: HTMLElement[],
		headerWrapper: HTMLElement | null,
		prefersReducedMotion: boolean
	): void {
		const current = this._toPanelCoordinateRect(panel.getBoundingClientRect());
		const targetRect = this._toPanelCoordinateRect(target.rect);
		const destinationRect = this._toPanelCoordinateRect(destination.rect);
		const destinationContent = destination.element;
		const activeTargetAnimations = destination.source.getAnimations?.({ subtree: true }) ?? [];
		const remainingTargetMotion = activeTargetAnimations.reduce((remaining, animation) => {
			const timing = animation.effect?.getComputedTiming();
			const endTime = typeof timing?.endTime === 'number' ? timing.endTime : 0;
			const currentTime = typeof animation.currentTime === 'number' ? animation.currentTime : 0;
			return Math.max(remaining, Math.max(0, endTime - currentTime) / 1000);
		}, 0);
		const morphDuration = Math.min(1.2, Math.max(0.46, remainingTargetMotion));
		const start = {
			x: current.left + current.width / 2,
			y: current.top + current.height / 2
		};
		const end = {
			x: targetRect.left + targetRect.width / 2,
			y: targetRect.top + targetRect.height / 2
		};
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const distance = Math.hypot(dx, dy) || 1;
		// En una Bézier cuadrática el desplazamiento máximo visible equivale
		// aproximadamente a la mitad del offset del control. 0.72 produce una
		// curva expresiva visible (~36% de la distancia) sin formar un bucle.
		const arc = Math.min(360, Math.max(48, distance * 0.72));
		const perpendicular = { x: -dy / distance, y: dx / distance };
		const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
		const viewportCenter = this._toPanelCoordinateRect(
			new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0)
		);
		const candidates = [1, -1].map((direction) => ({
			x: midpoint.x + perpendicular.x * arc * direction,
			y: midpoint.y + perpendicular.y * arc * direction
		}));
		const centerDistance = (point: { x: number; y: number }) =>
			Math.abs(
				Math.abs(dy) >= Math.abs(dx)
					? point.x - viewportCenter.x
					: point.y - viewportCenter.y
			);
		const control = centerDistance(candidates[0]) <= centerDistance(candidates[1])
			? candidates[0]
			: candidates[1];

		Object.assign(destinationContent.style, {
			position: 'absolute',
			inset: '50% auto auto 50%',
			width: `${destinationRect.width}px`,
			height: `${destinationRect.height}px`,
			transform: 'translate(-50%, -50%) scale(.78)',
			color: window.getComputedStyle(destination.source).color || target.color,
			opacity: '0'
		});

		if (prefersReducedMotion) {
			panel.appendChild(destinationContent);
			this._applyRect(panel, targetRect);
			panel.style.backgroundColor = target.backgroundColor;
			panel.style.color = target.color;
			panel.style.borderRadius = target.borderRadius;
			panel.style.boxShadow = target.boxShadow;
			this._backdrop.style.opacity = '0';
			destinationContent.style.opacity = '1';
			this._finishHide(fadeTargets, headerWrapper);
			return;
		}

		const timeline = gsap.timeline({
			onComplete: () => {
				gsap.set(panel, { clearProps: 'transform' });
				this._finishHide(fadeTargets, headerWrapper);
			}
		});
		panel.style.left = `${current.left}px`;
		panel.style.top = `${current.top}px`;
		panel.style.width = `${current.width}px`;
		panel.style.height = `${current.height}px`;
		const panelStartStyle = window.getComputedStyle(panel);
		const panelStartVisual = {
			backgroundColor: panelStartStyle.backgroundColor,
			color: panelStartStyle.color,
			borderRadius: panelStartStyle.borderRadius,
			boxShadow: panelStartStyle.boxShadow
		};
		// GSAP es el único propietario de la opacidad durante el recorrido.
		// La transición CSS del estado `.open` produciría un segundo easing y
		// haría que el scrim pareciera desaparecer al final de golpe.
		this._backdrop.style.transition = 'none';
		this._backdrop.style.opacity = '1';
		const motion = { progress: 0 };
		let contentAttached = false;
		if (this.debug) {
			console.log('[moni-morph-modal] arc', { start, control, end, distance, arc, morphDuration });
		}
		timeline
			.addLabel('morph', 0)
			.to(motion, {
				progress: 1,
				duration: morphDuration,
				ease: 'power2.inOut',
				onUpdate: () => {
					const progress = motion.progress;
					const liveState = this._getTargetState(destination.source);
					const liveRect = this._toPanelCoordinateRect(liveState.rect);
					const liveTransform = this._readTransformState(destination.source);
					const liveEnd = {
						x: liveRect.left + liveRect.width / 2,
						y: liveRect.top + liveRect.height / 2
					};
					const liveDx = liveEnd.x - start.x;
					const liveDy = liveEnd.y - start.y;
					const liveDistance = Math.hypot(liveDx, liveDy) || 1;
					const liveArc = Math.min(360, Math.max(48, liveDistance * 0.72));
					const livePerpendicular = { x: -liveDy / liveDistance, y: liveDx / liveDistance };
					const liveMidpoint = {
						x: (start.x + liveEnd.x) / 2,
						y: (start.y + liveEnd.y) / 2
					};
					const liveCandidates = [1, -1].map((direction) => ({
						x: liveMidpoint.x + livePerpendicular.x * liveArc * direction,
						y: liveMidpoint.y + livePerpendicular.y * liveArc * direction
					}));
					const liveControl = centerDistance(liveCandidates[0]) <= centerDistance(liveCandidates[1])
						? liveCandidates[0]
						: liveCandidates[1];
					// El backdrop comparte exactamente el playhead del arco. Se mantiene
					// algo más presente al comienzo y luego se retira progresivamente.
					this._backdrop.style.opacity = String(Math.max(0, 1 - progress));
					const inverse = 1 - progress;
					const centerX =
						inverse * inverse * start.x +
						2 * inverse * progress * liveControl.x +
						progress * progress * liveEnd.x;
					const centerY =
						inverse * inverse * start.y +
						2 * inverse * progress * liveControl.y +
						progress * progress * liveEnd.y;
					// La contracción modal mantiene su easing, pero cualquier mutación
					// adicional del target se suma completa para seguirla en tiempo real.
					const liveVisualWidth = destination.source.offsetWidth || liveRect.width;
					const liveVisualHeight = destination.source.offsetHeight || liveRect.height;
					const initialVisualWidth = destination.source.offsetWidth || targetRect.width;
					const initialVisualHeight = destination.source.offsetHeight || targetRect.height;
					const width =
						current.width + (initialVisualWidth - current.width) * progress +
						(liveVisualWidth - initialVisualWidth);
					const height =
						current.height + (initialVisualHeight - current.height) * progress +
						(liveVisualHeight - initialVisualHeight);
					panel.style.width = `${width}px`;
					panel.style.height = `${height}px`;
					gsap.set(panel, {
						x: centerX - width / 2 - current.left,
						y: centerY - height / 2 - current.top,
						rotation: liveTransform.rotation * progress,
						skewX: liveTransform.skewX * progress,
						scaleX: 1 + (liveTransform.scaleX - 1) * progress,
						scaleY: 1 + (liveTransform.scaleY - 1) * progress,
						backgroundColor: gsap.utils.interpolate(
							panelStartVisual.backgroundColor,
							liveState.backgroundColor,
							progress
						),
						color: gsap.utils.interpolate(panelStartVisual.color, liveState.color, progress),
						borderRadius: gsap.utils.interpolate(
							panelStartVisual.borderRadius,
							liveState.borderRadius,
							progress
						),
						boxShadow: gsap.utils.interpolate(
							panelStartVisual.boxShadow,
							liveState.boxShadow,
							progress
						)
					});
					// El contenido del target no debe flotar sobre el modal grande. Solo
					// comienza a materializarse cuando posición y relación de aspecto ya
					// se aproximan al destino, pero continúa viajando con la superficie.
					const contentProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
					if (!contentAttached && contentProgress > 0) {
						panel.appendChild(destinationContent);
						contentAttached = true;
					}
					// Conservamos el layout nativo del target y escalamos toda su
					// composición. Redimensionar el wrapper convertiría porcentajes
					// computados en píxeles fijos y dejaría la imagen arriba a la izquierda.
					destinationContent.style.width = `${liveVisualWidth}px`;
					destinationContent.style.height = `${liveVisualHeight}px`;
					const revealScale = 0.82 + contentProgress * 0.18;
					gsap.set(destinationContent, {
						opacity: contentProgress,
						scaleX: (width / Math.max(1, liveVisualWidth)) * revealScale,
						scaleY: (height / Math.max(1, liveVisualHeight)) * revealScale
					});
				}
			}, 'morph')
			.addLabel('target-fade')
			.to(panel, {
				autoAlpha: 0,
				duration: 0.08,
				ease: 'power1.out',
				onStart: () => {
					// Handoff atómico: el contenido real ocupa el lugar del snapshot
					// antes de retirar la última superficie. Evita un frame vacío o una
					// duplicación perceptible al finalizar el morph.
					destinationContent.style.visibility = 'hidden';
					this._restoreTargetContent();
					panel.style.backgroundColor = 'transparent';
					panel.style.boxShadow = 'none';
					panel.style.borderColor = 'transparent';
				}
			}, `morph+=${morphDuration}`);
	}

	private _finishHide(fadeTargets: HTMLElement[], headerWrapper: HTMLElement | null): void {
		const panel = this._panel;
		panel.style.visibility = 'hidden';
		panel.style.opacity = '0';
		panel.style.pointerEvents = 'none';
		this._visible = false;
		this._handlingOpenChange = true;
		this.open = false;
		this._handlingOpenChange = false;
		this._isAnimating = false;
		panel.classList.remove('is-animating');
		panel.style.removeProperty('--_panel-width');
		panel.style.removeProperty('--_panel-height');
		this._cleanupMorphElements();
		this._restoreTargetContent();
		gsap.set(fadeTargets, { clearProps: 'opacity,transform,filter' });
		if (headerWrapper) headerWrapper.style.opacity = '1';
		this.style.removeProperty('z-index');
		this.style.removeProperty('--_z-index');
		this.style.removeProperty('--_backdrop-duration');
		this.style.removeProperty('--_backdrop-ease');
		// Conservamos opacity:0 hasta la próxima apertura. Limpiarla aquí puede
		// producir un flash de scrim antes de que Lit retire la clase `.open`.
		const idx = MoniMorphModal._openStack.indexOf(this);
		if (idx > -1) MoniMorphModal._openStack.splice(idx, 1);
	}

	private _captureOriginFallbacks(origin: HTMLElement): void {
		this._originFallbacks = [];
		let current: HTMLElement | null = this._getComposedParent(origin);
		while (current && current !== document.body && current !== document.documentElement) {
			this._originFallbacks.push(current);
			current = this._getComposedParent(current);
		}
	}

	private _getComposedParent(el: HTMLElement): HTMLElement | null {
		if (el.parentElement) return el.parentElement;
		const root = el.getRootNode();
		return root instanceof ShadowRoot ? (root.host as HTMLElement) : null;
	}

	private _resolveClosingTarget(): HTMLElement | null {
		if (this.target) this._resolveTarget();
		const candidates = [this._targetEl, ...this._originFallbacks].filter(
			(candidate, index, all): candidate is HTMLElement => !!candidate && all.indexOf(candidate) === index
		);
		const resolved = candidates.find((candidate) => this._isUsableClosingTarget(candidate)) ?? null;
		const strategy = !resolved ? 'fade' : resolved === this._targetEl ? 'target' : 'ancestor';
		this._debugMorph('close', resolved, strategy, candidates);
		return resolved;
	}

	private _debugMorph(
		phase: 'open' | 'close',
		resolved: HTMLElement | null,
		strategy: 'target' | 'ancestor' | 'fade',
		candidates: HTMLElement[]
	): void {
		if (!this.debug) return;
		const rows = candidates.map((element, index) => {
			const rect = element.getBoundingClientRect();
			return {
				index,
				element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}`,
				connected: element.isConnected,
				usable: this._isUsableClosingTarget(element),
				x: Math.round(rect.x),
				y: Math.round(rect.y),
				width: Math.round(rect.width),
				height: Math.round(rect.height)
			};
		});
		console.groupCollapsed(`[moni-morph-modal] ${phase} → ${strategy}`);
		console.log('Origin:', this._targetEl);
		console.log('Resolved morph target:', resolved);
		console.table(rows);
		console.groupEnd();
	}

	private _isUsableClosingTarget(el: HTMLElement | null): el is HTMLElement {
		if (!el?.isConnected) return false;
		const rect = el.getBoundingClientRect();
		if (rect.width < 2 || rect.height < 2) return false;
		if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.top >= window.innerHeight) return false;
		let current: HTMLElement | null = el;
		while (current && current !== document.body) {
			const style = getComputedStyle(current);
			if (style.display === 'none' || style.visibility === 'hidden' || style.contentVisibility === 'hidden') return false;
			if (Number.parseFloat(style.opacity || '1') === 0 && !this._targetStylesCache.has(current)) return false;
			current = this._getComposedParent(current);
		}
		return true;
	}

	toggle(): void {
		if (this._visible || this.open) this.hide();
		else this.show();
	}

	private _handleDocKeydown(e: KeyboardEvent): void {
		if (e.key !== 'Escape' || !this.closeOnEsc) return;
		const top = MoniMorphModal._openStack[MoniMorphModal._openStack.length - 1];
		if (top !== this) return;
		e.stopPropagation();
		this.hide();
	}

	/**
	 * Fase "First" de la animación (Cierre del Trigger):
	 * Determina cómo desaparecer u ocultar el botón original mientras el modal ocupa su lugar.
	 * Mantiene el cache de opacidades y colores originales para poder restaurarlos 
	 * idénticamente al cerrar el modal (evitando saltos visuales).
	 */
	private _hideTargetContent() {
		if (!this._targetEl) return;
		
		const saveAndHide = (el: HTMLElement, prop: 'opacity' | 'color') => {
			if (!this._targetStylesCache.has(el)) {
				this._targetStylesCache.set(el, { opacity: el.style.opacity, color: el.style.color });
			}
			if (prop === 'opacity') el.style.opacity = '0';
			if (prop === 'color') el.style.color = 'transparent';
		};

		if (this.hideTarget) {
			saveAndHide(this._targetEl, 'opacity');
			return;
		}

		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) saveAndHide(parts.label as HTMLElement, 'opacity');
			if (parts.icon) saveAndHide(parts.icon as HTMLElement, 'opacity');
			if (parts.iconTrailing) saveAndHide(parts.iconTrailing as HTMLElement, 'opacity');
		} else if (this._targetEl.tagName === 'MONI-FAB') {
			const icon = this._targetEl.shadowRoot?.querySelector('.icon') as HTMLElement | null;
			const label = this._targetEl.shadowRoot?.querySelector('.label') as HTMLElement | null;
			if (icon) saveAndHide(icon, 'opacity');
			if (label) saveAndHide(label, 'opacity');
		} else {
			saveAndHide(this._targetEl, 'color');
			const icon = this._targetEl.querySelector('moni-icon, svg, [class*="icon"]');
			if (icon) saveAndHide(icon as HTMLElement, 'opacity');
		}
	}

	/**
	 * Restaura puramente los estilos originales del botón Trigger tras terminar
	 * la animación de cierre, leyendo las opacidades/colores almacenados en caché.
	 */
	private _restoreTargetContent() {
		if (!this._targetEl) return;
		
		const restore = (el: HTMLElement) => {
			if (this._targetStylesCache.has(el)) {
				const cache = this._targetStylesCache.get(el)!;
				el.style.opacity = cache.opacity;
				el.style.color = cache.color;
				this._targetStylesCache.delete(el);
			}
		};

		if (this.hideTarget) {
			restore(this._targetEl);
			return;
		}

		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) restore(parts.label as HTMLElement);
			if (parts.icon) restore(parts.icon as HTMLElement);
			if (parts.iconTrailing) restore(parts.iconTrailing as HTMLElement);
		} else if (this._targetEl.tagName === 'MONI-FAB') {
			const icon = this._targetEl.shadowRoot?.querySelector('.icon') as HTMLElement | null;
			const label = this._targetEl.shadowRoot?.querySelector('.label') as HTMLElement | null;
			if (icon) restore(icon);
			if (label) restore(label);
		} else {
			restore(this._targetEl);
			const icon = this._targetEl.querySelector('moni-icon, svg, [class*="icon"]');
			if (icon) restore(icon as HTMLElement);
		}
	}

	private _onHeaderSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _onFooterSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _onTriggerLabelSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasTriggerLabel = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _getTriggerLabelNodes(): Node[] {
		const slot = this.shadowRoot?.querySelector(
			'slot[name="trigger-label"]'
		) as HTMLSlotElement | undefined;
		return slot?.assignedNodes({ flatten: true }) ?? [];
	}

	private _shouldMorphLabel(): boolean {
		return (
			this.morphLabel && !!this._targetEl && (this._hasHeader || this._hasTriggerLabel)
		);
	}

	// =========================================================================
	// LABEL FLIP HELPERS
	// =========================================================================

	private _cleanupMorphElements(): void {
		if (this._targetSnapshot) {
			this._targetSnapshot.remove();
			this._targetSnapshot = null;
		}
		if (this._morphEls.text) {
			this._morphEls.text.remove();
			this._morphEls.text = null;
		}
		if (this._morphEls.icon) {
			this._morphEls.icon.remove();
			this._morphEls.icon = null;
		}
	}

	private _animateLabelOpen(): void {
		// No-op: el morphing de la etiqueta es manejado por el timeline unificado FLIP en show()
	}

	private _animateLabelClose(): void {
		// No-op: el morphing de la etiqueta es manejado por el timeline unificado FLIP en hide()
	}

	private _createMorphText(sourceText: string, sourceEl: Element): HTMLElement {
		const el = document.createElement('div');
		el.className = 'morph-text';
		el.setAttribute('data-flip-id', `morph-text-${this.target}`);
		el.setAttribute('aria-hidden', 'true');
		el.textContent = sourceText;

		const computed = window.getComputedStyle(sourceEl);
		el.style.position = 'fixed';
		el.style.pointerEvents = 'none';
		el.style.zIndex = String(this._zIndex + 10);
		el.style.display = 'inline-flex';
		el.style.alignItems = computed.alignItems !== 'normal' ? computed.alignItems : 'center';
		el.style.justifyContent = computed.justifyContent !== 'normal' ? computed.justifyContent : 'flex-start';
		el.style.whiteSpace = 'nowrap';
		el.style.color = computed.color || 'inherit';
		el.style.fontFamily = computed.fontFamily || 'inherit';
		el.style.fontSize = computed.fontSize || 'inherit';
		el.style.fontWeight = computed.fontWeight || 'inherit';
		el.style.lineHeight = computed.lineHeight || 'inherit';
		el.style.letterSpacing = computed.letterSpacing || 'inherit';

		this.shadowRoot!.appendChild(el);
		this._morphEls.text = el;
		return el;
	}

	private _createMorphIcon(sourceIcon: Element): HTMLElement {
		const el = document.createElement('div');
		el.className = 'morph-icon';
		el.setAttribute('data-flip-id', `morph-icon-${this.target}`);
		el.setAttribute('aria-hidden', 'true');

		// Para <moni-icon> renderizamos el glifo directamente para evitar
		// esperar a que hidrate su shadow DOM.
		if (sourceIcon.tagName === 'MONI-ICON') {
			const span = document.createElement('span');
			span.textContent = sourceIcon.getAttribute('name') || '';
			const computed = window.getComputedStyle(sourceIcon);
			span.style.display = 'inline-flex';
			span.style.alignItems = 'center';
			span.style.justifyContent = 'center';
			span.style.fontFamily = computed.fontFamily || 'var(--font-icon)';
			span.style.fontSize = computed.fontSize || '1.125rem';
			span.style.inlineSize = computed.inlineSize || '1.125rem';
			span.style.blockSize = computed.blockSize || '1.125rem';
			span.style.lineHeight = '1';
			span.style.color = 'inherit';
			span.style.fontWeight = 'normal';
			span.style.fontStyle = 'normal';
			span.style.letterSpacing = 'normal';
			span.style.textTransform = 'none';
			span.style.whiteSpace = 'nowrap';
			span.style.wordWrap = 'normal';
			span.style.direction = 'ltr';
			span.style.fontFeatureSettings = "'liga'";
			span.style.fontVariationSettings =
				"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
			span.style.setProperty('-webkit-font-smoothing', 'antialiased');
			el.appendChild(span);
		} else {
			el.appendChild(sourceIcon.cloneNode(true) as HTMLElement);
		}

		const computed = window.getComputedStyle(sourceIcon);
		el.style.position = 'fixed';
		el.style.pointerEvents = 'none';
		el.style.zIndex = String(this._zIndex + 10);
		el.style.display = 'inline-flex';
		el.style.alignItems = 'center';
		el.style.justifyContent = 'center';
		el.style.color = computed.color || 'inherit';
		el.style.inlineSize = computed.inlineSize || '1.125rem';
		el.style.blockSize = computed.blockSize || '1.125rem';

		this.shadowRoot!.appendChild(el);
		this._morphEls.icon = el;
		return el;
	}

	private _positionElement(el: HTMLElement, rect: DOMRect): void {
		const localRect = this._toPanelCoordinateRect(rect);
		el.style.top = `${localRect.top}px`;
		el.style.left = `${localRect.left}px`;
		el.style.width = `${localRect.width}px`;
		el.style.height = `${localRect.height}px`;
	}

	private _toPanelCoordinateRect(rect: DOMRect): DOMRect {
		const ancestor = this.parentElement?.closest<HTMLElement>(
			'.lab-canvas, [data-morph-coordinate-space]'
		);
		if (!ancestor) return rect;
		const transform = getComputedStyle(ancestor).transform;
		if (!transform || transform === 'none') return rect;
		let scaleX = 1;
		let scaleY = 1;
		if (typeof DOMMatrix !== 'undefined') {
			const matrix = new DOMMatrix(transform);
			scaleX = Math.hypot(matrix.a, matrix.b) || 1;
			scaleY = Math.hypot(matrix.c, matrix.d) || 1;
		} else {
			const matrixMatch = transform.match(/^matrix\(([^)]+)\)$/);
			const scaleMatch = transform.match(/^scale\(([^)]+)\)$/);
			if (matrixMatch) {
				const values = matrixMatch[1].split(',').map(Number);
				scaleX = Math.hypot(values[0], values[1]) || 1;
				scaleY = Math.hypot(values[2], values[3]) || 1;
			} else if (scaleMatch) {
				const values = scaleMatch[1].split(/[,\s]+/).map(Number);
				scaleX = values[0] || 1;
				scaleY = values[1] || scaleX;
			}
		}
		const ancestorRect = ancestor.getBoundingClientRect();
		return new DOMRect(
			(rect.left - ancestorRect.left) / scaleX,
			(rect.top - ancestorRect.top) / scaleY,
			rect.width / scaleX,
			rect.height / scaleY
		);
	}

	private _getMoniButtonParts(): {
		label: Element | null;
		icon: Element | null;
		iconTrailing: Element | null;
	} {
		const sr = this._targetEl?.shadowRoot;
		return {
			label: sr?.querySelector('[part="label"]') ?? null,
			icon: sr?.querySelector('[part="icon"]') ?? null,
			iconTrailing: sr?.querySelector('[part="icon-trailing"]') ?? null
		};
	}

	private _resolveMorphSource(): {
		text: { content: string; rect: DOMRect; sourceEl: Element } | null;
		icon: { element: Element; rect: DOMRect } | null;
	} {
		const result: {
			text: { content: string; rect: DOMRect; sourceEl: Element } | null;
			icon: { element: Element; rect: DOMRect } | null;
		} = { text: null, icon: null };

		if (!this._targetEl) return result;

		// Slot trigger-label tiene prioridad.
		if (this._hasTriggerLabel) {
			const nodes = this._getTriggerLabelNodes();
			if (nodes.length > 0) {
				const wrapper = document.createElement('div');
				for (const node of nodes) {
					wrapper.appendChild(node.cloneNode(true));
				}
				// Posicionamos el wrapper sobre el target para la medición inicial.
				wrapper.style.position = 'fixed';
				wrapper.style.visibility = 'hidden';
				wrapper.style.pointerEvents = 'none';
				this.shadowRoot!.appendChild(wrapper);
				const rect = this._targetEl.getBoundingClientRect();
				wrapper.remove();

				result.text = {
					content: wrapper.textContent?.trim() || '',
					rect,
					sourceEl: this._targetEl
				};
			}
			return result;
		}

		// <moni-button>: extraemos label e icono desde su shadow DOM.
		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) {
				result.text = {
					content: this._targetEl.textContent?.trim() || '',
					rect: parts.label.getBoundingClientRect(),
					sourceEl: parts.label
				};
			}
			if (parts.icon) {
				const innerIcon = parts.icon.querySelector('moni-icon, svg') || parts.icon;
				result.icon = {
					element: innerIcon,
					rect: innerIcon.getBoundingClientRect()
				};
			}
			return result;
		}

		// Target arbitrario.
		let sourceEl: Element = this._targetEl;
		if (this.morphLabelSelector) {
			const selected = this._targetEl.querySelector(this.morphLabelSelector);
			if (selected) sourceEl = selected;
		}

		const text = sourceEl.textContent?.trim() || '';
		if (text) {
			result.text = {
				content: text,
				rect: sourceEl.getBoundingClientRect(),
				sourceEl
			};
		}

		// Buscamos un icono dentro del target.
		const iconEl = sourceEl.querySelector('moni-icon, svg, [class*="icon"]');
		if (iconEl) {
			result.icon = {
				element: iconEl,
				rect: iconEl.getBoundingClientRect()
			};
		}

		return result;
	}

	private _measureHeaderTextRect(): DOMRect | null {
		if (!this._header) return null;

		const slot = this.shadowRoot?.querySelector(
			'slot[name="header"]'
		) as HTMLSlotElement | undefined;
		const nodes = slot?.assignedNodes({ flatten: true }) ?? [];

		// Buscamos el primer nodo con texto visible.
		for (const node of nodes) {
			if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
				const range = document.createRange();
				range.selectNode(node);
				return range.getBoundingClientRect();
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as Element;
				if (el.tagName === 'MONI-ICON' || el.tagName === 'SVG') {
					continue;
				}
				const childNodes = Array.from(el.childNodes);
				for (const child of childNodes) {
					if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
						const range = document.createRange();
						range.selectNode(child);
						return range.getBoundingClientRect();
					}
					if (child.nodeType === Node.ELEMENT_NODE) {
						const cel = child as Element;
						if (cel.tagName !== 'MONI-ICON' && cel.tagName !== 'SVG' && cel.textContent?.trim()) {
							return cel.getBoundingClientRect();
						}
					}
				}
				if (el.textContent?.trim()) {
					return el.getBoundingClientRect();
				}
			}
		}

		return this._header.getBoundingClientRect();
	}

	private _measureHeaderIconRect(): DOMRect | null {
		const textRect = this._measureHeaderTextRect();
		if (!textRect) return null;

		const slot = this.shadowRoot?.querySelector(
			'slot[name="header"]'
		) as HTMLSlotElement | undefined;
		const nodes = slot?.assignedNodes({ flatten: true }) ?? [];

		// Si el header ya tiene un icono, lo usamos como destino.
		for (const node of nodes) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as Element;
				if (el.tagName === 'MONI-ICON' || el.tagName === 'SVG') {
					return el.getBoundingClientRect();
				}
				const nestedIcon = el.querySelector('moni-icon, svg');
				if (nestedIcon) {
					return nestedIcon.getBoundingClientRect();
				}
			}
		}

		// Si no hay icono en el header, calculamos una posición a la
		// izquierda del texto, alineada verticalmente.
		const iconSize = 24;
		const gap = 12;
		return new DOMRect(
			textRect.left - iconSize - gap,
			textRect.top + textRect.height / 2 - iconSize / 2,
			iconSize,
			iconSize
		);
	}

	private _findSolidBackground(el: Element): string | null {
		const elements = [el, ...Array.from(el.querySelectorAll('*'))];
		for (const e of elements) {
			const bg = window.getComputedStyle(e).backgroundColor;
			if (!this._isColorTransparent(bg)) {
				return bg;
			}
		}
		// Si es un Web Component, revisamos su shadowRoot de forma superficial
		if (el.shadowRoot) {
			const shadowElements = Array.from(el.shadowRoot.querySelectorAll('*'));
			for (const e of shadowElements) {
				const bg = window.getComputedStyle(e).backgroundColor;
				if (!this._isColorTransparent(bg)) {
					return bg;
				}
			}
		}
		return null;
	}

	private _getTargetState(el: HTMLElement): TargetState {
		// Los Web Components interactivos exponen un host transparente. El morph
		// debe usar la superficie pintada real dentro de su Shadow DOM.
		const visualEl = this._resolveVisualTarget(el);
		const rect = visualEl.getBoundingClientRect();

		let bg = window.getComputedStyle(visualEl).backgroundColor;

		// Si es transparente, intentamos buscar en pseudo-elementos (usado en botones Material 3)
		if (this._isColorTransparent(bg)) {
			const beforeBg = window.getComputedStyle(visualEl, '::before').backgroundColor;
			if (!this._isColorTransparent(beforeBg)) {
				bg = beforeBg;
			} else {
				const afterBg = window.getComputedStyle(visualEl, '::after').backgroundColor;
				if (!this._isColorTransparent(afterBg)) {
					bg = afterBg;
				} else {
					// Buscamos el primer elemento con fondo sólido en el árbol del objetivo
					const solidBg = this._findSolidBackground(visualEl);
					if (solidBg) bg = solidBg;
				}
			}
		}

		// Si sigue siendo transparente, evitamos que el modal se vuelva transparente
		// leyendo su propio color computado actual para que mantenga su opacidad.
		if (this._isColorTransparent(bg) && this._panel) {
			bg = window.getComputedStyle(this._panel).backgroundColor;
		}

		const computed = window.getComputedStyle(visualEl);

		return {
			rect,
			backgroundColor: bg,
			color: computed.color || 'var(--on-surface)',
			borderRadius: computed.borderRadius || '1.25rem',
			boxShadow: computed.boxShadow || 'none'
		};
	}

	private _resolveVisualTarget(el: HTMLElement): HTMLElement {
		if (el.tagName === 'MONI-BUTTON') {
			return (el.shadowRoot?.querySelector('.button') as HTMLElement | null) ?? el;
		}
		if (el.tagName === 'MONI-FAB') {
			return (el.shadowRoot?.querySelector('button') as HTMLElement | null) ?? el;
		}
		if (el.tagName === 'MONI-FAB-MENU') {
			const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLElement | null;
			return (trigger?.shadowRoot?.querySelector('button') as HTMLElement | null) ?? trigger ?? el;
		}
		return el;
	}

	/**
	 * Crea una copia visual inerte del árbol compuesto del target. Los `<slot>`
	 * se sustituyen por sus nodos asignados, por lo que la captura incluye tanto
	 * contenido light DOM como superficies internas de Web Components.
	 */
	private _createTargetSnapshot(source: HTMLElement, rect: DOMRect): HTMLElement {
		this._targetSnapshot?.remove();
		const snapshot = document.createElement('div');
		snapshot.className = 'morph-target-snapshot';
		snapshot.setAttribute('aria-hidden', 'true');
		const clone = this._cloneComposedNode(source);
		if (clone) {
			snapshot.appendChild(clone);
			// La geometría, el color y la elevación pertenecen al panel animado.
			// Repetirlos en el snapshot crea una segunda píldora encima del morph.
			// En medios visuales, en cambio, la propia superficie sí es contenido.
			if (
				clone instanceof HTMLElement &&
				!['IMG', 'VIDEO', 'CANVAS', 'SVG', 'PICTURE'].includes(source.tagName)
			) {
				Object.assign(clone.style, {
					background: 'transparent',
					backgroundColor: 'transparent',
					boxShadow: 'none',
					borderColor: 'transparent',
					outline: 'none',
					position: 'relative',
					inset: 'auto',
					transform: 'none',
					opacity: '1',
					visibility: 'visible',
					width: '100%',
					height: '100%'
				});
				if (source.tagName === 'BUTTON') {
					clone.style.whiteSpace = 'nowrap';
					clone.querySelectorAll<HTMLElement>('span, [part~="label"]').forEach((child) => {
						child.style.whiteSpace = 'nowrap';
					});
				}
			}
		}
		Object.assign(snapshot.style, {
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			overflow: 'hidden',
			pointerEvents: 'none'
		});
		this._targetSnapshot = snapshot;
		return snapshot;
	}

	private _cloneComposedNode(source: Node): Node | null {
		if (source.nodeType === Node.TEXT_NODE) return source.cloneNode(false);
		if (!(source instanceof Element)) return null;

		if (source instanceof HTMLSlotElement) {
			const fragment = document.createDocumentFragment();
			const nodes = source.assignedNodes({ flatten: true });
			for (const node of nodes.length ? nodes : Array.from(source.childNodes)) {
				const child = this._cloneComposedNode(node);
				if (child) fragment.appendChild(child);
			}
			return fragment;
		}

		// No clonamos directamente un Custom Element con Shadow DOM: su
		// constructor crearía una segunda sombra y duplicaría el render. Una
		// superficie neutra recibe en cambio el árbol visual ya compuesto.
		const clone = (source.shadowRoot
			? document.createElement('div')
			: source.cloneNode(false)) as HTMLElement;
		if (source instanceof HTMLImageElement && clone instanceof HTMLImageElement) {
			// El snapshot vive menos de medio segundo: no puede depender de que el
			// lazy-loader observe nuevamente una imagen que ya estaba renderizada.
			clone.loading = 'eager';
			clone.decoding = 'sync';
			if (source.currentSrc) clone.src = source.currentSrc;
		}
		clone.removeAttribute('id');
		clone.removeAttribute('name');
		clone.setAttribute('aria-hidden', 'true');
		const computed = window.getComputedStyle(source);
		for (let index = 0; index < computed.length; index += 1) {
			const property = computed.item(index);
			clone.style.setProperty(property, computed.getPropertyValue(property), computed.getPropertyPriority(property));
		}

		const children = source.shadowRoot
			? Array.from(source.shadowRoot.childNodes).filter(
				(node) => !(node instanceof HTMLStyleElement)
			)
			: Array.from(source.childNodes);
		for (const node of children) {
			const child = this._cloneComposedNode(node);
			if (child) clone.appendChild(child);
		}
		return clone;
	}

	private _isColorTransparent(color: string | null | undefined): boolean {
		if (!color) return true;
		const c = color.replace(/\s/g, '').toLowerCase();
		return (
			c === 'rgba(0,0,0,0)' ||
			c === 'transparent' ||
			c === '' ||
			c.includes(',0)') ||
			c.includes('/0)')
		);
	}

	private _readTransformState(el: HTMLElement): {
		rotation: number;
		skewX: number;
		scaleX: number;
		scaleY: number;
	} {
		const transform = window.getComputedStyle(el).transform;
		if (!transform || transform === 'none') {
			return { rotation: 0, skewX: 0, scaleX: 1, scaleY: 1 };
		}
		try {
			const values = transform.match(/matrix(?:3d)?\(([^)]+)\)/)?.[1]
				.split(',')
				.map((value) => Number.parseFloat(value.trim()));
			let a: number;
			let b: number;
			let c: number;
			let d: number;
			if (values?.length === 6) {
				[a, b, c, d] = values;
			} else if (values?.length === 16) {
				a = values[0];
				b = values[1];
				c = values[4];
				d = values[5];
			} else {
				const matrix = new DOMMatrix(transform);
				({ a, b, c, d } = matrix);
			}
			const scaleX = Math.hypot(a, b) || 1;
			const determinant = a * d - b * c;
			const scaleY = determinant / scaleX || 1;
			return {
				rotation: Math.atan2(b, a) * (180 / Math.PI),
				skewX:
					Math.atan2(a * c + b * d, scaleX * scaleX) *
					(180 / Math.PI),
				scaleX,
				scaleY
			};
		} catch {
			return { rotation: 0, skewX: 0, scaleX: 1, scaleY: 1 };
		}
	}

	private _applyRect(el: HTMLElement, rect: DOMRect): void {
		el.style.top = `${rect.top}px`;
		el.style.left = `${rect.left}px`;
		el.style.width = `${rect.width}px`;
		el.style.height = `${rect.height}px`;
	}

	private _computeFinalRect(targetRect: DOMRect, naturalSize?: { width: number; height: number }): DOMRect {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const padding = 16;

		let width = this.autoSize && naturalSize ? naturalSize.width : this._parseSize(this.expandedWidth, vw);
		let height = this.autoSize && naturalSize ? naturalSize.height : this._parseSize(this.expandedHeight, vh);

		width = Math.min(width, vw - padding * 2);
		height = Math.min(height, vh - padding * 2);

		let top = targetRect.top;
		let left = targetRect.left;

		switch (this.placement) {
			case 'viewport-center':
				left = vw / 2 - width / 2;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-top':
				left = vw / 2 - width / 2;
				top = padding;
				break;
			case 'viewport-bottom':
				left = vw / 2 - width / 2;
				top = vh - height - padding;
				break;
			case 'viewport-left':
				left = padding;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-right':
				left = vw - width - padding;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-top-left':
				left = padding;
				top = padding;
				break;
			case 'viewport-top-right':
				left = vw - width - padding;
				top = padding;
				break;
			case 'viewport-bottom-left':
				left = padding;
				top = vh - height - padding;
				break;
			case 'viewport-bottom-right':
				left = vw - width - padding;
				top = vh - height - padding;
				break;
			case 'center':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'top':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'top-start':
				left = targetRect.left + targetRect.width - width;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'top-end':
				left = targetRect.left;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'bottom':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'bottom-start':
				left = targetRect.left + targetRect.width - width;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'bottom-end':
				left = targetRect.left;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'left':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'left-start':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top + targetRect.height - height;
				break;
			case 'left-end':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top;
				break;
			case 'right':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'right-start':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top + targetRect.height - height;
				break;
			case 'right-end':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top;
				break;
		}

		left = Math.max(padding, Math.min(left, vw - width - padding));
		top = Math.max(padding, Math.min(top, vh - height - padding));

		return new DOMRect(left, top, width, height);
	}

	private _parseSize(value: string, ref: number): number {
		const num = parseFloat(value);
		if (Number.isNaN(num)) return 352;
		if (value.endsWith('px')) return num;
		if (value.endsWith('rem')) return num * 16;
		if (value.endsWith('em')) return num * 16;
		if (value.endsWith('%')) return (num / 100) * ref;
		if (value.endsWith('vw')) return (num / 100) * window.innerWidth;
		if (value.endsWith('vh')) return (num / 100) * window.innerHeight;
		return num;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			.backdrop {
				position: fixed;
				inset: 0;
				background-color: var(--scrim);
				opacity: 0;
				visibility: hidden;
				transition:
					opacity var(--_backdrop-duration, 0.35s) var(--_backdrop-ease, cubic-bezier(0.2, 0, 0, 1)),
					visibility var(--_backdrop-duration, 0.35s) var(--_backdrop-ease, cubic-bezier(0.2, 0, 0, 1));
				z-index: calc(var(--_z-index, 100) - 1);
			}

			.backdrop.open {
				opacity: 1;
				visibility: visible;
			}

			.panel {
				position: fixed;
				visibility: hidden;
				opacity: 0;
				pointer-events: none;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				background-color: var(--surface-container-high);
				color: var(--on-surface);
				border-radius: var(--moni-morph-panel-radius, 1.75rem);
				box-shadow: var(--elevate2);
				z-index: var(--_z-index, 100);
			}

			.panel-inner {
				display: flex;
				flex-direction: column;
				width: var(--_panel-width, 100%);
				height: var(--_panel-height, 100%);
				flex-shrink: 0;
				overflow: hidden;
			}

			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.75rem;
				padding: 1.25rem 1.5rem 0.75rem;
				min-block-size: 3.5rem;
			}

			header.is-empty {
				display: none;
			}

			.body {
				flex: 1;
				overflow-y: var(--moni-morph-body-overflow-y, auto);
				overflow-x: var(--moni-morph-body-overflow-x, hidden);
				padding: var(--moni-morph-body-padding, 0 1.5rem);
				scrollbar-gutter: var(--moni-morph-body-scrollbar-gutter, stable);
			}

			.panel.is-animating .body {
				overflow: hidden !important;
			}
			
			.panel.is-animating .body::-webkit-scrollbar {
				display: none;
			}

			footer {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 0.5rem;
				padding: 1rem 1.5rem 1.5rem;
				border-top: 0.0625rem solid var(--outline-variant);
			}

			footer.is-empty {
				display: none;
			}

			.close-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 2.5rem;
				block-size: 2.5rem;
				padding: 0;
				border: none;
				border-radius: 50%;
				background: transparent;
				color: var(--on-surface-variant);
				cursor: pointer;
				font-size: 1.25rem;
			}

			.close-btn:hover {
				background-color: var(--active);
			}

			.morph-text,
			.morph-icon {
				position: fixed;
				pointer-events: none;
				box-sizing: border-box;
				overflow: hidden;
				will-change: transform, width, height, color, font-size;
			}

			.trigger-label-slot {
				display: none;
			}
		`
	];

	/**
	 * Renderiza el caparazón del modal morph: fondo opcional + contenedor de panel.
	 *
	 * **Bandera `_visible`:**
	 * `visible = this._visible || this.open` mantiene vivo el DOM mientras se reproduce
	 * la animación de cierre de GSAP. `_visible` se establece en `true` al inicio de la apertura y
	 * en `false` solo después de que se dispara el `onComplete` de la animación de cierre. Sin esto,
	 * Lit eliminaría el panel del DOM antes de que la animación termine.
	 *
	 * **Condicional del fondo (backdrop):**
	 * El div `.backdrop` solo se renderiza cuando `hasBackdrop=true`. Cuando `modal=false`,
	 * el `background-color` del fondo se establece en `transparent` para que el fondo superpuesto
	 * (scrim) sea invisible, pero los eventos del puntero aún se consumen (clic para cerrar).
	 *
	 * **Objetivo de morphing de GSAP:**
	 * `.panel` es el objetivo de la animación GSAP. Al abrir: se anima desde el
	 * `getBoundingClientRect()` del elemento anclaje (posición + tamaño) a su tamaño CSS natural
	 * mediante `gsap.fromTo()`. Al cerrar: a la inversa. `.panel-inner` recibe una
	 * contra-escala para evitar que el contenido interno se escale junto con el panel,
	 * creando una ilusión física de "expandirse desde el origen".
	 */
	override render() {
		const visible = this._visible || this.open;
		const headerEmpty = !this._hasHeader && !this.showCloseButton;
		return html`
			${this.hasBackdrop ? html`
				<div
					class="backdrop ${visible ? 'open' : ''}"
					part="backdrop"
					style="${!this.modal ? 'background-color: transparent;' : ''}"
				></div>
			` : ''}
			<div class="panel" part="panel">
				<div class="panel-inner" part="panel-inner">
					<header
						class="${headerEmpty ? 'is-empty' : ''}"
						part="header"
					>
						<div class="header-morph-wrapper"><slot name="header" @slotchange=${this._onHeaderSlotChange}></slot></div>
						${this.showCloseButton
							? html`
									<button
										class="close-btn"
										@click=${this.hide}
										aria-label="Cerrar"
									>
										<moni-icon name="close"></moni-icon>
									</button>
							  `
							: ''}
					</header>
					<div class="body" part="body"><slot></slot></div>
					<footer
						class="${this._hasFooter ? '' : 'is-empty'}"
						part="footer"
					>
						<slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>
					</footer>
				</div>
			</div>
			<div class="trigger-label-slot">
				<slot name="trigger-label" @slotchange=${this._onTriggerLabelSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-morph-modal': MoniMorphModal;
	}
}

export default MoniMorphModal;
