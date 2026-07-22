/**
 * @file components/moni-nav.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente contenedor de Navegación Material Design 3.
 *
 * `<moni-nav>` es el contenedor que envuelve los elementos `<moni-nav-item>` y
 * controla el patrón de navegación M3: barra de navegación, riel de navegación o
 * cajón de navegación.
 *
 * **Referencias a la especificación M3:**
 * - Barra de navegación: `m3-docs/components/navigation-bar/specs.md`
 * - Riel de navegación: `m3-docs/components/navigation-rail/specs.md`
 * - Cajón de navegación: `m3-docs/components/navigation-drawer/specs.md`
 *
 * **Patrones de navegación:**
 * - **Barra de navegación** (`placement="bottom"`) — Barra horizontal de elementos de icono+etiqueta
 *   en la parte inferior de la pantalla. Ideal para 3–5 destinos de nivel superior.
 * - **Riel de navegación** (`variant="rail"`) — Riel vertical de elementos de icono+etiqueta
 *   en el lateral de la pantalla. Ideal para puntos de interrupción medianos/expandidos.
 * - **Cajón estándar** (`variant="drawer"`) — Panel vertical siempre visible
 *   con etiquetas de texto completo. Sin atenuación (scrim). Ideal para pantallas grandes.
 * - **Cajón modal** (`variant="drawer" modal`) — Cajón superpuesto con atenuación (scrim).
 *   Se abre/cierra a través de la propiedad `open`. Atrapa el foco del teclado mientras está abierto.
 *   Se cierra al presionar la tecla `Escape`.
 *
 * **Manejo del teclado:**
 * Cuando `modal=true`, el componente añade un listener global de `keydown` en
 * `connectedCallback` que cierra el cajón con `Escape`. El listener se
 * elimina en `disconnectedCallback`.
 *
 * @example
 * ```html
 * <!-- Barra de navegación inferior -->
 * <moni-nav placement="bottom">
 *   <moni-nav-item icon="home" label="Inicio" active></moni-nav-item>
 *   <moni-nav-item icon="search" label="Buscar"></moni-nav-item>
 *   <moni-nav-item icon="person" label="Perfil"></moni-nav-item>
 * </moni-nav>
 *
 * <!-- Cajón de navegación modal -->
 * <moni-nav variant="drawer" modal open placement="left">
 *   <h3 slot="header">Mi App</h3>
 *   <moni-nav-item icon="home" label="Inicio" active></moni-nav-item>
 *   <moni-nav-item icon="settings" label="Ajustes"></moni-nav-item>
 * </moni-nav>
 * ```
 *
 * @slot default - Hijos `<moni-nav-item>`.
 * @slot header  - Contenido encima de los elementos de navegación (solo variante drawer).
 * @slot footer  - Contenido debajo de los elementos de navegación (solo variante drawer).
 *
 * @csspart nav     - El elemento `<nav>` interior.
 * @csspart scrim   - El atenuador de fondo (scrim) (solo cajón modal).
 */
@customElement('moni-nav')
export class MoniNav extends MoniElement {
	@property({ reflect: true })
	placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
	@property({ reflect: true })
	variant: 'rail' | 'drawer' = 'rail';
	@property({ type: Boolean, reflect: true }) modal = false;
	@property({ type: Boolean, reflect: true }) open = true;
	@property({ reflect: true })
	layout: 'vertical' | 'horizontal' | 'auto' = 'auto';

	/**
	 * Hook de inicialización (Lit).
	 * Vincula el listener global para teclado, asegurando que `_onKeydown` mantenga
	 * el contexto correcto de `this` al ser disparado por el documento.
	 */
	override connectedCallback() {
		super.connectedCallback();
		this._onKeydown = this._onKeydown.bind(this);
		document.addEventListener('keydown', this._onKeydown);
	}

	/**
	 * Hook de destrucción (Lit).
	 * Remueve el listener de teclado global para evitar fugas de memoria (memory leaks)
	 * cuando el componente de navegación es retirado del DOM.
	 */
	override disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('keydown', this._onKeydown);
	}

	/**
	 * Manejador global de eventos de teclado.
	 * Implementa el patrón de accesibilidad estándar: Si el drawer es modal y está abierto,
	 * presionar la tecla Escape forzará su cierre inmediato.
	 */
	private _onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && this.modal && this.open) {
			this.open = false;
		}
	}

	/**
	 * Función de cierre rápido invocada típicamente al hacer clic en el backdrop/scrim.
	 * Modifica directamente la propiedad `open` a false si la navegación opera en modo modal.
	 */
	private _closeModal() {
		if (this.modal) {
			this.open = false;
		}
	}

	/**
	 * Propaga los cambios estructurales a todos los hijos `<moni-nav-item>` insertados en la ranura.
	 *
	 * Cuando `placement`, `variant`, `layout`, `modal` o `open` cambian en el
	 * `<moni-nav>` padre, los elementos hijos `<moni-nav-item>` también deben actualizar su estado
	 * de diseño calculado (layout) y de apertura. Esto se hace imperativamente a través de `_propagateToItems()` en lugar
	 * de a través de la API de Contexto de Lit para evitar la sobrecarga del Proveedor de Contexto para una simple
	 * relación padre→hijo.
	 *
	 * @param changed - Mapa de los nombres de las propiedades reactivas que desencadenaron este ciclo de actualización.
	 */
	override updated(changed: Map<string, unknown>) {
		if (
			changed.has('placement') ||
			changed.has('variant') ||
			changed.has('layout') ||
			changed.has('modal') ||
			changed.has('open')
		) {
			this._propagateToItems();
		}
	}

	/**
	 * Patrón de inyección de propiedades "Top-Down" sin usar Context API.
	 * Pasa las variables arquitectónicas (`placement`, `variant`, `layout`) a los `moni-nav-item`
	 * hijos para que ellos puedan adaptar su CSS (ej: ocultar la etiqueta en la variante 'rail').
	 * Se lanza al inicializar o cada vez que cambia una prop en el contenedor.
	 */
	private _propagateToItems = () => {
		const items = this.querySelectorAll('moni-nav-item');
		items.forEach(item => {
			item.setAttribute('placement', this.placement);
			item.setAttribute('variant', this.variant);
			item.setAttribute('layout', this.layout);
		});
	};

	static override styles = [
		sharedStyles,
		css`
			:host {
				/* Block so the host establishes a layout context for fixed
				   descendants. The inner <nav> still handles all positioning. */
				display: block;
				font-family: var(--font);
				inline-size: 100%;
			}

			nav {
				display: flex;
				gap: 0.5rem;
				padding: 0 1rem;
				background-color: var(--surface-container);
				color: var(--on-surface);
				align-items: center;
				box-sizing: border-box;
			}

			:host([placement='top']) nav,
			:host([placement='bottom']) nav {
				flex-direction: row;
				justify-content: space-around;
				inline-size: 100%;
			}

			:host([placement='bottom']) nav {
				position: fixed;
				inset-block-end: 0;
				inset-inline: 0;
				z-index: 100;
				background-color: var(--surface-container);
				min-block-size: 4rem; /* 64dp flexible nav bar */
				padding-block-end: env(safe-area-inset-bottom, 0px);
			}

			:host([placement='top']) nav {
				position: sticky;
				inset-block-start: 0;
				z-index: 100;
				background-color: var(--surface-container);
				min-block-size: 4rem; /* 64dp flexible nav bar */
			}

			:host([placement='left']) nav,
			:host([placement='right']) nav {
				flex-direction: column;
				block-size: 100dvh;
				padding-block: 1rem;
			}

			:host([placement='left'][variant='rail']) nav,
			:host([placement='right'][variant='rail']) nav {
				min-inline-size: 6rem;
			}

			:host([placement='left'][variant='drawer']) nav,
			:host([placement='right'][variant='drawer']) nav {
				min-inline-size: 16rem;
			}

			:host([placement='left']) nav {
				position: fixed;
				inset-inline-start: 0;
				inset-block: 0;
				z-index: 100;
			}

			:host([placement='right']) nav {
				position: fixed;
				inset-inline-end: 0;
				inset-block: 0;
				z-index: 100;
			}

			/* Modal drawer scrim/backdrop */
			.scrim {
				display: none;
				position: fixed;
				inset: 0;
				z-index: 99;
				background-color: var(--scrim);
				opacity: 0;
				transition: opacity var(--speed2);
			}

			:host([variant='drawer'][modal]) .scrim {
				display: block;
			}

			:host([variant='drawer'][modal][open]) .scrim {
				opacity: 1;
			}

			/* Modal drawer closed state slides off-screen */
			:host([placement='left'][variant='drawer'][modal]:not([open])) nav {
				transform: translateX(-100%);
			}
			:host([placement='right'][variant='drawer'][modal]:not([open])) nav {
				transform: translateX(100%);
			}

			:host([variant='drawer'][modal]) nav {
				transition: transform var(--speed3) cubic-bezier(0.2, 0, 0, 1);
			}

			/* Nav items inside horizontal placements stretch to fill. */
			:host([placement='top']) ::slotted(moni-nav-item),
			:host([placement='bottom']) ::slotted(moni-nav-item) {
				flex: 1;
				min-inline-size: 0;
			}

			/* Slots header/footer in vertical nav */
			:host([placement='left']) ::slotted([slot='header']),
			:host([placement='right']) ::slotted([slot='header']) {
				padding-block: 1rem;
				inline-size: 100%;
			}
			:host([placement='left']) ::slotted([slot='footer']),
			:host([placement='right']) ::slotted([slot='footer']) {
				margin-block-start: auto;
				padding-block: 1rem;
				inline-size: 100%;
			}

			@media only screen and (max-width: 600px) {
				nav {
					position: fixed !important;
					inset-block-end: 0 !important;
					inset-inline: 0 !important;
					z-index: 100 !important;
					background-color: var(--surface-container) !important;
					min-block-size: 4rem !important;
					padding-block-end: env(safe-area-inset-bottom, 0px) !important;
					flex-direction: row !important;
					justify-content: space-around !important;
					block-size: auto !important;
					inline-size: 100% !important;
				}
				::slotted(moni-nav-item) {
					flex: 1 !important;
					min-inline-size: 0 !important;
				}
			}
		`,
	];

	/**
	 * Renderiza el contenedor de navegación con su superposición opcional de atenuación (scrim).
	 *
	 * **Composición de clases:**
	 * - `this.placement` (`'left'`, `'right'`, `'bottom'`) — posiciona el cajón
	 *   o la barra de navegación inferior contra el borde correcto de la ventana gráfica.
	 * - `'max'` — agregado cuando `variant='drawer'`; expande la navegación a toda altura
	 *   y ancho según la especificación M3 Navigation Drawer.
	 *
	 * **Atenuación de cajón modal (Modal drawer scrim):**
	 * `isModalDrawer` es `true` cuando `variant='drawer'` Y `modal=true`. En este
	 * caso, se renderiza un div `.scrim` detrás del cajón como una superposición
	 * de hacer-clic-para-descartar. La atenuación tiene `aria-hidden="true"` ya que es puramente visual.
	 *
	 * **Atributo `[open]`:**
	 * La vinculación `?open=${this.open}` agrega/elimina el atributo `open` en el
	 * elemento `<nav>`. Los selectores de atributo CSS `[open]` impulsan la transición
	 * de deslizamiento hacia adentro/afuera, manteniendo la animación completamente en CSS (no se requiere GSAP para este componente).
	 *
	 * **Punto de referencia ARIA (ARIA landmark):**
	 * El elemento `<nav>` se usa directamente (no un `<div role="navigation">`) para
	 * proporcionar un punto de referencia ARIA implícito al que pueden saltar los lectores de pantalla.
	 */
	override render() {
		const isModalDrawer = this.variant === 'drawer' && this.modal;
		const classes = [this.placement, this.variant === 'drawer' ? 'max' : '']
			.filter(Boolean)
			.join(' ');
		const scrim = isModalDrawer
			? html`<div
					class="scrim"
					part="scrim"
					@click=${this._closeModal}
					aria-hidden="true"
				></div>`
			: '';
		return html`${scrim}<nav
				class=${classes}
				part="nav"
				role=${isModalDrawer ? 'dialog' : undefined}
				aria-modal=${isModalDrawer ? 'true' : undefined}
				aria-expanded=${isModalDrawer ? (this.open ? 'true' : 'false') : undefined}
			>
				<slot name="header"></slot>
				<slot @slotchange=${this._propagateToItems}></slot>
				<slot name="footer"></slot>
			</nav>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-nav': MoniNav;
	}
}

export default MoniNav;
