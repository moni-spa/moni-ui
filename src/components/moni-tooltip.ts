/**
 * @file components/moni-tooltip.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Tooltip (Información sobre herramientas).
 *
 * Los tooltips proporcionan etiquetas de texto contextual o contenido enriquecido que aparecen cuando
 * los usuarios pasan el cursor por encima, enfocan o tocan un elemento. Muestran información
 * complementaria que ayuda a los usuarios a entender los elementos de la interfaz sin
 * ocupar permanentemente espacio en la pantalla.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/tooltips/specs.md`
 *
 * **Tipos:**
 * - **Plain** (por defecto) — Etiqueta solo de texto para descripciones simples (máx. 1 línea).
 * - **Rich** (atributo `rich`) — Contenido HTML que incluye texto formateado,
 *   enlaces e iconos. Los tooltips enriquecidos pueden contener múltiples líneas y enlaces de acción.
 *
 * **Ubicaciones (Placements):**
 * - `top` (por defecto), `top-start`, `top-end`
 * - `bottom`, `bottom-start`, `bottom-end`
 *
 * **Mecanismo de activación (Trigger):**
 * El tooltip usa `position: absolute` dentro del elemento padre. El padre
 * debe tener `position: relative` (establecido automáticamente vía `connectedCallback`).
 * Los eventos hover/focus en el padre activan los selectores CSS `:hover` y
 * `:focus-within` del tooltip, los cuales impulsan la transición de mostrar/ocultar.
 *
 * **Accesibilidad:**
 * - El tooltip tiene `role="tooltip"`.
 * - Para accesibilidad por teclado, el padre debe tener `aria-describedby`
 *   apuntando al atributo `id` del tooltip. El componente expone un
 *   getter `tooltipId` para este propósito.
 * - La tecla `Escape` cierra los tooltips enriquecidos.
 *
 * @example
 * ```html
 * <!-- Tooltip simple (Plain) -->
 * <button aria-describedby="save-tip">
 *   Guardar
 *   <moni-tooltip id="save-tip" text="Ctrl+S"></moni-tooltip>
 * </button>
 *
 * <!-- Tooltip enriquecido (Rich) -->
 * <button>
 *   Filtrar
 *   <moni-tooltip rich position="bottom">
 *     <strong>Filtrar por fecha</strong>
 *     <p>Selecciona un rango de fechas para filtrar resultados.</p>
 *   </moni-tooltip>
 * </button>
 * ```
 *
 * @slot default - Contenido enriquecido para el cuerpo del tooltip (solo usado cuando `rich=true`).
 *
 * @csspart tooltip - El elemento contenedor del tooltip.
 */
@customElement('moni-tooltip')
export class MoniTooltip extends MoniElement {
	/**
	 * Contenido de texto simple para mostrar. Utilizado cuando `rich` es falso.
	 * @type {string}
	 */
	@property({ reflect: true }) text = '';

	/**
	 * Ubicación preferida relativa al ancla/activador.
	 * @type {'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'}
	 * @default 'top'
	 */
	@property({ reflect: true })
	position:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'right' = 'top';

	/** Si está activo, el tooltip conserva el ángulo visual del trigger. */
	@property({ type: Boolean, attribute: 'rotate-with-target', reflect: true })
	rotateWithTarget = false;

	/**
	 * Mapeo de tamaño opcional (usado por hojas de estilo internas para escalar fuente/relleno).
	 * @type {'' | 'small' | 'medium' | 'large'}
	 * @default ''
	 */
	@property({ reflect: true })
	size: '' | 'small' | 'medium' | 'large' = '';

	/**
	 * Si es true, cambia al modo de Tooltip Enriquecido (permite HTML/componentes en el slot por defecto).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) rich = false;

	private _target: HTMLElement | null = null;
	private _tooltipEl: HTMLElement | null = null;
	/**
	 * Wrapper estático para el evento de teclado global.
	 * Mantiene fijo el contexto léxico para registrar/desregistrar limpiamente.
	 */
	private _docKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);
	private _reposition = () => {
		if (this._tooltipEl?.classList.contains('visible')) this._positionTooltip();
	};
	private _trackingFrame = 0;
	private _popoverCloseTimer = 0;
	private _trackTarget = () => {
		if (!this._tooltipEl?.classList.contains('visible')) {
			this._trackingFrame = 0;
			return;
		}
		this._positionTooltip();
		this._trackingFrame = requestAnimationFrame(this._trackTarget);
	};
	/**
	 * Nombre de anclaje CSS (`anchor-name`) registrado en el activador padre para que el tooltip
	 * pueda usar `position-anchor` para vincularse a él. Generado por instancia vía
	 * `crypto.randomUUID()` cuando el posicionamiento de anclaje CSS está soportado.
	 */
	private _anchorName: string | null = null;

	override firstUpdated(): void {
		this._tooltipEl = this.shadowRoot?.querySelector('.tooltip') as HTMLElement | null;
		// Prepara posición, vector de origen y escala antes de que pueda ocurrir
		// la primera interacción. Así el primer hover comparte exactamente el
		// mismo estado inicial que todos los siguientes.
		this._positionTooltip();
	}

	/**
	 * Hook de inicialización (Lit).
	 * Resuelve la asociación nativa con su elemento padre (trigger), forzando un contexto
	 * de posicionamiento relativo (`position: relative`) si es necesario. Vincula dinámicamente
	 * listeners de `mouseenter/leave` y `focusin/out` para controlar la visibilidad del globo.
	 * También auto-registra la revolucionaria CSS Anchor Positioning API si el navegador la soporta.
	 */
	override connectedCallback() {
		super.connectedCallback();
		this._target = this.parentElement;
		if (this._target) {
			// Asegura que el padre tenga position: relative para anclar el tooltip absoluto
			const style = getComputedStyle(this._target);
			if (style.position === 'static') {
				this._target.style.position = 'relative';
			}
			this._target.addEventListener('mouseenter', this._show);
			this._target.addEventListener('focusin', this._show);
			this._target.addEventListener('mouseleave', this._hide);
			this._target.addEventListener('focusout', this._hide);

			// Auto-registra un nombre de ancla CSS en el activador padre cuando el
			// navegador soporta posicionamiento de ancla. Los consumidores pueden excluirse
			// estableciendo `data-no-anchor` en el activador.
			const cssSupports = (globalThis as unknown as {
				CSS?: { supports?: (k: string) => boolean };
			}).CSS?.supports;
			const supportsAnchor = cssSupports
				? cssSupports.call(window.CSS, 'anchor-name: --x')
				: false;
			if (supportsAnchor && !this._target.hasAttribute('data-no-anchor')) {
				const cryptoApi = (globalThis as unknown as {
					crypto?: { randomUUID?: () => string };
				}).crypto;
				const id = cryptoApi?.randomUUID?.()
					?? `tt-${Math.random().toString(36).slice(2, 10)}`;
				this._anchorName = `--moni-tooltip-anchor-${id}`;
				this._target.style.setProperty('anchor-name', this._anchorName);
			}
		}
		document.addEventListener('keydown', this._docKeydown);
		window.addEventListener('resize', this._reposition);
		document.addEventListener('scroll', this._reposition, true);
	}

	/**
	 * Hook de destrucción (Lit).
	 * Remueve diligentemente todos los detectores de eventos del padre (trigger)
	 * y limpia las declaraciones generadas dinámicamente en estilos inline (`anchor-name`).
	 */
	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('mouseenter', this._show);
			this._target.removeEventListener('focusin', this._show);
			this._target.removeEventListener('mouseleave', this._hide);
			this._target.removeEventListener('focusout', this._hide);
			if (this._anchorName) {
				this._target.style.removeProperty('anchor-name');
				this._anchorName = null;
			}
		}
		document.removeEventListener('keydown', this._docKeydown);
		window.removeEventListener('resize', this._reposition);
		document.removeEventListener('scroll', this._reposition, true);
		if (this._trackingFrame) cancelAnimationFrame(this._trackingFrame);
		this._trackingFrame = 0;
		if (this._popoverCloseTimer) window.clearTimeout(this._popoverCloseTimer);
		this._popoverCloseTimer = 0;
		super.disconnectedCallback();
	}

	/**
	 * Inyecta la clase activa (`.visible`) desencadenando la animación de opacidad/escalado.
	 * Cached-query: Recupera asíncronamente el tooltip del Shadow DOM si no lo había hecho.
	 */
	private _show = () => {
		if (!this._tooltipEl) {
			this._tooltipEl = this.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		}
		if (this._tooltipEl) {
			if (this._popoverCloseTimer) window.clearTimeout(this._popoverCloseTimer);
			this._popoverCloseTimer = 0;
			try {
				if (!this._tooltipEl.matches(':popover-open')) this._tooltipEl.showPopover?.();
			} catch {
				// Fallback para navegadores sin Popover API o árboles aún desconectados.
			}
			this._tooltipEl.classList.remove('visible');
			this._positionTooltip();
			// Materializa el estado inicial ya posicionado antes de activar la
			// transición. Sin este frame, el navegador puede interpolar desde las
			// coordenadas antiguas del fallback/anchor.
			void this._tooltipEl.offsetWidth;
			this._tooltipEl.classList.add('visible');
			if (!this._trackingFrame) {
				this._trackingFrame = requestAnimationFrame(this._trackTarget);
			}
		}
	};

	private _positionTooltip(): void {
		if (!this._target || !this._tooltipEl) return;
		const target = this._target.getBoundingClientRect();
		const width = this._tooltipEl.offsetWidth;
		const height = this._tooltipEl.offsetHeight;
		const gap = 8;
		const edge = 8;
		let left = target.left + (target.width - width) / 2;
		let top = target.top - height - gap;

		switch (this.position) {
			case 'top-start':
				left = target.left;
				break;
			case 'top-end':
				left = target.right - width;
				break;
			case 'bottom':
				top = target.bottom + gap;
				break;
			case 'bottom-start':
				left = target.left;
				top = target.bottom + gap;
				break;
			case 'bottom-end':
				left = target.right - width;
				top = target.bottom + gap;
				break;
			case 'left':
				left = target.left - width - gap;
				top = target.top + (target.height - height) / 2;
				break;
			case 'right':
				left = target.right + gap;
				top = target.top + (target.height - height) / 2;
				break;
		}

		left = Math.min(window.innerWidth - width - edge, Math.max(edge, left));
		top = Math.min(window.innerHeight - height - edge, Math.max(edge, top));
		this._tooltipEl.style.left = `${left}px`;
		this._tooltipEl.style.top = `${top}px`;
		const originX = target.left + target.width / 2 - (left + width / 2);
		const originY = target.top + target.height / 2 - (top + height / 2);
		this._tooltipEl.style.setProperty('--_tooltip-origin-x', `${originX}px`);
		this._tooltipEl.style.setProperty('--_tooltip-origin-y', `${originY}px`);
		this._tooltipEl.style.setProperty(
			'--_tooltip-target-rotation',
			`${this.rotateWithTarget ? this._readTargetRotation() : 0}deg`
		);
		this._tooltipEl.style.transformOrigin = 'center';
	}

	private _readTargetRotation(): number {
		if (!this._target) return 0;
		const quadTarget = this._target as HTMLElement & {
			getBoxQuads?: () => Array<{ p1: DOMPoint; p2: DOMPoint }>;
		};
		const quad = quadTarget.getBoxQuads?.()[0];
		if (quad) {
			return Math.atan2(quad.p2.y - quad.p1.y, quad.p2.x - quad.p1.x) * (180 / Math.PI);
		}
		const transform = window.getComputedStyle(this._target).transform;
		const values = transform.match(/matrix(?:3d)?\(([^)]+)\)/)?.[1]
			.split(',')
			.map((value) => Number.parseFloat(value.trim()));
		if (values?.length === 6) return Math.atan2(values[1], values[0]) * (180 / Math.PI);
		if (values?.length === 16) return Math.atan2(values[1], values[0]) * (180 / Math.PI);
		return 0;
	}

	/**
	 * Retira la clase activa (`.visible`), desvaneciendo el globo con gracia.
	 */
	private _hide = () => {
		if (!this._tooltipEl) {
			this._tooltipEl = this.shadowRoot?.querySelector('.tooltip') as HTMLElement;
		}
		if (this._tooltipEl) {
			this._tooltipEl.classList.remove('visible');
		}
		if (this._trackingFrame) cancelAnimationFrame(this._trackingFrame);
		this._trackingFrame = 0;
		if (this._tooltipEl?.hidePopover) {
			this._popoverCloseTimer = window.setTimeout(() => {
				try {
					if (this._tooltipEl?.matches(':popover-open')) this._tooltipEl.hidePopover();
				} catch {
					// El tooltip pudo desconectarse durante el cierre.
				}
				this._popoverCloseTimer = 0;
			}, 180);
		}
	};

	/**
	 * Manejador global del teclado (a11y).
	 * Permite disipar instantáneamente el tooltip presionando `Escape`
	 * sin necesidad de mover el ratón o perder el foco.
	 */
	private _handleDocKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (!this._tooltipEl?.classList.contains('visible')) return;
		this._hide();
	}

	/**
	 * ID público del elemento tooltip, adecuado para `aria-describedby` en
	 * el padre activador. Generado automáticamente si el consumidor no estableció un `id`.
	 */
	get tooltipId(): string {
		return this._tooltipEl?.id || '';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* M3 CSS anchor positioning (Baseline 2024, Chrome 125+, Edge 125+).
			   When the parent has a registered anchor-name and this tooltip
			   uses position-anchor, the browser positions the tooltip relative
			   to the trigger natively — no JS needed for placement.
			   Fallbacks to absolute positioning for older browsers. */
			.tooltip {
				position-anchor: var(--_anchor-name);
			}
			.tooltip.top,
			.tooltip.top-start,
			.tooltip.top-end {
				position-area: block-start;
			}
			.tooltip.bottom,
			.tooltip.bottom-start,
			.tooltip.bottom-end {
				position-area: block-end;
			}
			.tooltip.left {
				position-area: inline-start;
			}
			.tooltip.right {
				position-area: inline-end;
			}
			.tooltip.top-start,
			.tooltip.bottom-start {
				position-try-fallbacks: start;
			}
			.tooltip.top-end,
			.tooltip.bottom-end {
				position-try-fallbacks: end;
			}

			/* BeerCSS .tooltip — faithful port */
			.tooltip {
				--_space: -0.5rem;
				visibility: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
				background-color: var(--inverse-surface);
				color: var(--inverse-on-surface);
				font-size: 0.75rem;
				text-align: center;
				border-radius: 0.25rem;
				padding: 0.5rem;
				position: absolute;
				z-index: 200;
				/* BeerCSS default: top center */
				inset: 0 auto auto 50%;
				inline-size: auto;
				white-space: nowrap;
				font-weight: 500;
				opacity: 0;
				transition:
					opacity var(--speed2) cubic-bezier(0.2, 0, 0, 1),
					transform var(--speed2) cubic-bezier(0.2, 0, 0, 1);
				line-height: normal;
				transform: translate(-50%, -100%) scale(0.9);
				margin-block-start: var(--_space);
				pointer-events: none;
				max-inline-size: 20rem;
			}

			/* M3 6 placements — derived from BeerCSS's 4 + start/end variants. */
			.tooltip.top,
			.tooltip.top-start,
			.tooltip.top-end {
				inset: 0 auto auto 50%;
				transform: translate(-50%, -100%) scale(0.9);
				margin-block-start: var(--_space);
			}
			.tooltip.top-start {
				inset-inline-start: 0;
				transform: translate(0, -100%) scale(0.9);
			}
			.tooltip.top-end {
				inset-inline-start: auto;
				inset-inline-end: 0;
				transform: translate(0, -100%) scale(0.9);
			}

			.tooltip.bottom,
			.tooltip.bottom-start,
			.tooltip.bottom-end {
				inset: auto auto 0 50%;
				transform: translate(-50%, 100%) scale(0.9);
				margin-block-end: var(--_space);
				margin-block-start: 0;
			}
			.tooltip.bottom-start {
				inset-inline-start: 0;
				transform: translate(0, 100%) scale(0.9);
			}
			.tooltip.bottom-end {
				inset-inline-start: auto;
				inset-inline-end: 0;
				transform: translate(0, 100%) scale(0.9);
			}

			/* Legacy positions (left/right) — preserved for backward compat. */
			.tooltip.left {
				inset: 50% auto auto 0;
				transform: translate(-100%, -50%) scale(0.9);
				margin-inline: var(--_space);
				margin-block-start: 0;
			}
			.tooltip.right {
				inset: 50% 0 auto auto;
				transform: translate(100%, -50%) scale(0.9);
				margin-inline: var(--_space);
				margin-block-start: 0;
			}

			/* Size variants */
			.tooltip.small  { inline-size: 8rem;  white-space: normal; }
			.tooltip.medium { inline-size: 12rem; white-space: normal; }
			.tooltip.large  { inline-size: 16rem; white-space: normal; }

			/* Rich content — allow flex column for stacked content. */
			:host([rich]) .tooltip {
				flex-direction: column;
				align-items: flex-start;
				white-space: normal;
				text-align: start;
				padding: 0.75rem;
			}
			:host([rich]) .tooltip ::slotted(*) {
				display: block;
			}

			/* Show state (triggered by JS class toggle) */
			.tooltip.visible {
				visibility: visible;
				opacity: 1;
			}
			.tooltip.visible.top,
			.tooltip.visible:not(.left, .right, .bottom, [class*='start'], [class*='end']) {
				transform: translate(-50%, -100%) scale(1);
			}
			.tooltip.visible.top-start { transform: translate(0, -100%) scale(1); }
			.tooltip.visible.top-end { transform: translate(0, -100%) scale(1); }
			.tooltip.visible.bottom { transform: translate(-50%, 100%) scale(1); }
			.tooltip.visible.bottom-start { transform: translate(0, 100%) scale(1); }
			.tooltip.visible.bottom-end { transform: translate(0, 100%) scale(1); }
			.tooltip.visible.left { transform: translate(-100%, -50%) scale(1); }
			.tooltip.visible.right { transform: translate(100%, -50%) scale(1); }

			/* CSS Anchor Positioning ya resuelve la alineación respecto al centro
			   del trigger. Los translate del fallback absoluto no deben acumularse,
			   pues desplazarían el tooltip media anchura hacia un costado. */
			@supports (anchor-name: --moni-tooltip-test) {
				.tooltip {
					inset: auto;
					margin: 0;
					transform: scale(0.9);
				}
				.tooltip.top,
				.tooltip.top-start,
				.tooltip.top-end { margin-block-end: 0.5rem; }
				.tooltip.bottom,
				.tooltip.bottom-start,
				.tooltip.bottom-end { margin-block-start: 0.5rem; }
				.tooltip.left { margin-inline-end: 0.5rem; }
				.tooltip.right { margin-inline-start: 0.5rem; }
				.tooltip.visible,
				.tooltip.visible.top,
				.tooltip.visible.top-start,
				.tooltip.visible.top-end,
				.tooltip.visible.bottom,
				.tooltip.visible.bottom-start,
				.tooltip.visible.bottom-end,
				.tooltip.visible.left,
				.tooltip.visible.right { transform: scale(1); }
			}

			.tooltip.js-positioned {
				position: fixed;
				inset: auto;
				margin: 0;
				border: 0;
				transform:
					translate(var(--_tooltip-origin-x, 0), var(--_tooltip-origin-y, 0))
					rotate(var(--_tooltip-target-rotation, 0deg))
					scale(0.05);
			}
			.tooltip.js-positioned.visible,
			.tooltip.js-positioned.visible.top,
			.tooltip.js-positioned.visible.top-start,
			.tooltip.js-positioned.visible.top-end,
			.tooltip.js-positioned.visible.bottom,
			.tooltip.js-positioned.visible.bottom-start,
			.tooltip.js-positioned.visible.bottom-end,
			.tooltip.js-positioned.visible.left,
			.tooltip.js-positioned.visible.right {
				transform:
					translate(0, 0)
					rotate(var(--_tooltip-target-rotation, 0deg))
					scale(1);
			}
		`
	];

	/**
	 * Renderiza el `<div>` del tooltip con su lista de clases calculada y atributos ARIA.
	 *
	 * **Composición de clases:**
	 * - `'tooltip'` — siempre presente; estilos base.
	 * - `this.position` — variante de ubicación (ej. `'top'`, `'bottom-start'`).
	 * - `this.size` — modificador de tamaño (`'small'`, `'medium'`, `'large'`).
	 *
	 * **CSS Anchor Positioning:**
	 * Si `_anchorName` está poblado, lo inyecta como la propiedad personalizada `--_anchor-name`. 
	 * La declaración CSS `@anchor-name` conecta este tooltip a su elemento activador
	 * a través de la API CSS Anchor Positioning (Chrome 125+).
	 * En navegadores no compatibles, se utiliza un posicionamiento absoluto clásico como respaldo.
	 *
	 * **Respaldo de contenido:**
	 * El slot por defecto renderiza el contenido distribuido (slotted); si no hay hijos,
	 * el valor del atributo `text` se muestra como la etiqueta del tooltip.
	 */
	override render() {
		const classes = [
			'tooltip',
			'js-positioned',
			this.position,
			this.size
		].filter(Boolean).join(' ');
		return html`<div
			class=${classes}
			popover="manual"
			role="tooltip"
			id=${this.id || ''}
			part="tooltip"
			style=${this._anchorName ? `--_anchor-name: ${this._anchorName}` : ''}
		>
			<slot>${this.text}</slot>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tooltip': MoniTooltip;
	}
}

export default MoniTooltip;
