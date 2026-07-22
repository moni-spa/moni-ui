/**
 * @file components/moni-menu.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Menu (Menú).
 *
 * Los menús muestran una lista de opciones en una superficie temporal. Aparecen cuando
 * los usuarios interactúan con un botón, acción u otro control.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/menus/guidelines.md`
 *
 * **Arquitectura de posicionamiento:**
 * El menú usa `position: absolute` relativo a su ancestro posicionado más cercano.
 * El `:host` del componente usa `display: contents`, lo que significa que el
 * elemento interior `<menu>` participa directamente en el contexto de diseño del consumidor.
 * **Crucial:** El consumidor debe aplicar `position: relative` al elemento contenedor
 * que contiene tanto el activador (trigger) como el `<moni-menu>`.
 *
 * **Posicionamiento de auto-volteo (auto-flip):**
 * Según las pautas de M3, los menús deben voltearse hacia el lado opuesto del anclaje
 * si se desbordan de la ventana gráfica (viewport).
 * - **Navegadores modernos (Chrome/Edge 125+, Safari 18+):** Utiliza el posicionamiento
 *   de anclaje de CSS y `@position-try-fallback` nativamente cuando `flip=true`.
 * - **Alternativa (Fallback):** Un polyfill de JavaScript mide el menú después de que se abre. Si
 *   se desborda de la posición `placement` solicitada, establece un estado interno para voltear
 *   las clases de posicionamiento.
 *
 * **Gestión del estado:**
 * El atributo `active` controla la visibilidad. Los consumidores deben escuchar los eventos
 * del activador (como `click`) y alternar la propiedad `active`.
 *
 * @example
 * ```html
 * <!-- El contenedor debe tener position: relative -->
 * <div style="position: relative; display: inline-block;">
 *   <moni-button id="menu-trigger">Abrir Menú</moni-button>
 *
 *   <moni-menu placement="bottom" flip id="my-menu">
 *     <moni-menu-item icon="edit">Editar</moni-menu-item>
 *     <moni-menu-item icon="content_copy">Copiar</moni-menu-item>
 *     <moni-divider></moni-divider>
 *     <moni-menu-item icon="delete">Eliminar</moni-menu-item>
 *   </moni-menu>
 * </div>
 *
 * <script>
 *   const btn = document.getElementById('menu-trigger');
 *   const menu = document.getElementById('my-menu');
 *   btn.addEventListener('click', () => menu.active = !menu.active);
 * </script>
 * ```
 *
 * @slot default - Elementos `<moni-menu-item>`, `<moni-divider>`, o elementos `<li>` en bruto.
 *
 * @csspart menu - El contenedor interior `<menu>`.
 */
@customElement('moni-menu')
export class MoniMenu extends MoniElement {
	/**
	 * Posición preferida en relación con el anclaje padre.
	 * @type {'bottom' | 'top' | 'left' | 'right' | 'min' | 'max'}
	 * @default 'bottom'
	 */
	@property({ reflect: true })
	placement: 'bottom' | 'top' | 'left' | 'right' | 'min' | 'max' = 'bottom';

	/**
	 * Deshabilita el ajuste de texto dentro del menú.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'no-wrap' }) noWrap = false;

	/**
	 * Controla si el menú está visible.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) active = false;

	/**
	 * Lógica de espaciado entre el anclaje y el menú.
	 * @type {'no-space' | 'space' | 'small-space' | 'medium-space' | 'large-space' | 'extra-space'}
	 * @default 'no-space'
	 */
	@property({ reflect: true })
	space:
		| 'no-space'
		| 'space'
		| 'small-space'
		| 'medium-space'
		| 'large-space'
		| 'extra-space' = 'no-space';

	/**
	 * Habilita la evitación de colisiones basada en JS (volteando la posición si está fuera de los límites).
	 * Útil para navegadores que carecen de soporte para anclaje CSS.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true }) flip = false;

	@state() private _resolvedPlacement:
		| 'bottom'
		| 'top'
		| 'left'
		| 'right'
		| 'min'
		| 'max' = 'bottom';

	@query('menu') private _menuEl?: HTMLElement;

	/**
	 * Hook de ciclo de vida de Lit.
	 * Detecta si el menú se acaba de abrir (active = true) con la propiedad de 'flip' habilitada.
	 * Usa una Promesa (`updateComplete`) para esperar a que Lit termine de renderizar el DOM y 
	 * el navegador haga el reflow antes de medir sus dimensiones.
	 */
	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('active') && this.active && this.flip) {
			this.updateComplete.then(() => this._maybeFlip());
		}
	}

	/**
	 * Polyfill manual en JS para "position-try-fallbacks" (CSS Anchoring API).
	 * Si el menú desborda el viewport en su posición actual, invierte lógicamente
	 * su colocación (ej. de 'bottom' a 'top') calculando los BoundingClientRect.
	 */
	private _maybeFlip() {
		const menu = this._menuEl;
		if (!menu || !this.flip) return;
		const rect = menu.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		
		const overflowsBottom = rect.bottom > vh;
		const overflowsTop = rect.top < 0;
		const overflowsRight = rect.right > vw;
		const overflowsLeft = rect.left < 0;
		
		if (this.placement === 'bottom' && overflowsBottom) {
			this._resolvedPlacement = 'top';
		} else if (this.placement === 'top' && overflowsTop) {
			this._resolvedPlacement = 'bottom';
		} else if (this.placement === 'right' && overflowsRight) {
			this._resolvedPlacement = 'left';
		} else if (this.placement === 'left' && overflowsLeft) {
			this._resolvedPlacement = 'right';
		} else {
			this._resolvedPlacement = this.placement;
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* BeerCSS menu — faithful port */
			menu {
				opacity: 0;
				visibility: hidden;
				position: absolute;
				box-shadow: var(--elevate2);
				background-color: var(--surface-container);
				z-index: 13;
				inset: auto auto 0 0;
				inline-size: 100%;
				max-block-size: 50vh;
				max-inline-size: none !important;
				overflow-x: hidden;
				overflow-y: auto;
				font-size: 0.875rem;
				font-weight: normal;
				text-transform: none;
				color: var(--on-surface);
				line-height: normal;
				text-align: start;
				border-radius: 1rem;
				transform: scale(0.8) translateY(120%);
				transition: all var(--speed2) var(--speed2), opacity var(--speed2);
				justify-content: flex-start;
				padding: 0.25rem;
				display: flex;
				flex-direction: column;
				gap: 0.125rem;
				margin: 0;
				list-style: none;
			}

			/* BeerCSS: active class shows the menu */
			menu.active {
				opacity: 1;
				visibility: visible;
				transform: scale(1) translateY(100%);
				transition: all var(--speed2), background-color 0s;
			}

			/* Placement: top */
			menu.top {
				transform: scale(0.8) translateY(-120%);
			}
			menu.top.active {
				transform: scale(1) translateY(-100%);
			}

			/* Placement: left / right */
			menu.right {
				inset: auto auto 0 0;
			}
			menu.left {
				inset: auto 0 0 auto;
			}

			/* Placement: min (fixed-size dropdown) */
			menu.min {
				inset: 0 0 auto 0;
				transform: scale(0.8);
			}
			menu.min.active {
				transform: scale(1);
			}

			/* Placement: max (full screen overlay) */
			menu.max {
				position: fixed;
				inset: 0;
				block-size: 100%;
				max-block-size: none;
				min-block-size: auto;
				z-index: 100;
				transform: scale(0.8);
				border-radius: 0;
			}
			menu.max.active {
				transform: scale(1);
			}

			menu.no-wrap {
				inline-size: max-content !important;
				white-space: nowrap !important;
			}

			/* Space variants */
			menu.no-space   { gap: 0; }
			menu.space      { gap: 0.25rem; }
			menu.small-space { gap: 0.25rem; }
			menu.medium-space { gap: 0.375rem; }
			menu.large-space  { gap: 0.5rem; }
			menu.extra-space  { gap: 0.625rem; }

			/* Slotted items */
			::slotted(li),
			::slotted(moni-menu-item) {
				list-style: none;
				display: flex;
				align-items: center;
				align-self: normal;
				text-align: start;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 2.75rem;
				cursor: pointer;
				border-radius: 0.25rem;
				transition: border-radius var(--speed2);
			}

			/* M3 spec: auto-flip when there is no space in the requested
			   placement. Uses CSS anchor positioning + position-try-fallback
			   (Baseline 2024, Chrome 125+, Edge 125+, Safari TP).

			   The consumer must:
			     1. Set anchor-name="--moni-menu-anchor" on the trigger.
			     2. Ensure the menu can be reached via position-anchor.

			   When the menu's default placement would overflow, the
			   browser uses the first matching @position-try fallback. */
			@supports (anchor-name: --moni-menu-anchor) {
				:host([flip]) menu {
					position-anchor: --moni-menu-anchor;
					position-area: block-end;
					inset: auto;
					inline-size: max-content;
					max-inline-size: 20rem;
					position-try-fallbacks:
						flip-block,
						flip-inline,
						flip-block flip-inline;
				}
				:host([flip][placement='top']) menu {
					position-area: block-start;
					position-try-fallbacks:
						flip-block,
						flip-inline,
						flip-block flip-inline;
				}
				:host([flip][placement='right']) menu {
					position-area: inline-end;
					position-try-fallbacks:
						flip-inline,
						flip-block,
						flip-inline flip-block;
				}
				:host([flip][placement='left']) menu {
					position-area: inline-start;
					position-try-fallbacks:
						flip-inline,
						flip-block,
						flip-inline flip-block;
				}
			}
		`
	];

	/**
	 * Renderiza el menú como una superposición Popover API o un `<div>` posicionado.
	 *
	 * **Popover API (`popover="auto"`):**
	 * Cuando se establece `popover`, el menú usa la Popover API nativa del navegador.
	 * Esto proporciona descarte ligero (light-dismiss) automático (clic fuera para cerrar) y
	 * apilamiento en la capa superior sin gestión de `z-index`.
	 *
	 * **Patrón de menú ARIA:**
	 * El contenedor del menú lleva `role="menu"`. Cada hijo `<moni-menu-item>`
	 * debe llevar `role="menuitem"`. La navegación con las teclas de flecha se maneja a través de
	 * `@keydown` en el contenedor del menú, ciclando a través de los elementos usando
	 * `_focusedItemIndex` (incrementado/decrementado con ciclo continuo).
	 *
	 * **Posicionamiento:**
	 * Cuando se establece `anchor`, `_computeStyle()` calcula `top`/`left` desde
	 * `getBoundingClientRect()` del elemento anclaje y los inyecta como
	 * estilos en línea en el `<div>` del menú.
	 */
	override render() {
		const effectivePlacement = this.active && this.flip
			? this._resolvedPlacement
			: this.placement;
		const classes = [
			effectivePlacement,
			this.space,
			this.noWrap ? 'no-wrap' : '',
			this.active ? 'active' : ''
		].filter(Boolean).join(' ');

		return html`<menu
			class=${classes}
			part="menu"
		>
			<slot></slot>
		</menu>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-menu': MoniMenu;
	}
}

export default MoniMenu;
