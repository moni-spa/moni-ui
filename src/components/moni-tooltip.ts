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
	 * @type {'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'}
	 * @default 'top'
	 */
	@property({ reflect: true })
	position:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end' = 'top';

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
	/**
	 * Nombre de anclaje CSS (`anchor-name`) registrado en el activador padre para que el tooltip
	 * pueda usar `position-anchor` para vincularse a él. Generado por instancia vía
	 * `crypto.randomUUID()` cuando el posicionamiento de anclaje CSS está soportado.
	 */
	private _anchorName: string | null = null;

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
			this._tooltipEl.classList.add('visible');
		}
	};

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
				transition: all var(--speed2);
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
			this.position,
			this.size
		].filter(Boolean).join(' ');
		return html`<div
			class=${classes}
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
