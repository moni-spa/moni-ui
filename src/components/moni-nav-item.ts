/**
 * @file components/moni-nav-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Navigation Item (Elemento de Navegación).
 *
 * Un elemento de destino individual dentro de un contenedor `<moni-nav>`. Se renderiza como un
 * elemento `<a>` accesible con un icono, etiqueta y capa de estado M3.
 *
 * **Referencias a la especificación M3:**
 * - Elemento de barra de navegación: `m3-docs/components/navigation-bar/specs.md`
 * - Elemento de riel de navegación: `m3-docs/components/navigation-rail/specs.md`
 * - Elemento de cajón de navegación: `m3-docs/components/navigation-drawer/specs.md`
 *
 * **Adaptación de diseño:**
 * Las propiedades `placement`, `variant` y `layout` son retransmitidas desde
 * el padre `<moni-nav>` (típicamente a través de vinculación de atributos en el
 * método render del padre). El elemento de navegación las usa para renderizar condicionalmente:
 * - Icono + etiqueta abajo (barra de navegación).
 * - Solo icono + etiqueta horizontal (riel).
 * - Icono + etiqueta completa (cajón).
 *
 * **Comportamiento responsivo:**
 * Usa `window.matchMedia('(min-width: 601px)')` para detectar pantallas medianas
 * y almacena el resultado en `_isMediumScreen`. Esto impulsa el cambio de diseño
 * automático entre estilos de barra y riel.
 *
 * **Estado activo:**
 * El atributo `active` aplica el indicador activo M3: un fondo `secondary-container`
 * en forma de píldora detrás del icono y un color de etiqueta más oscuro.
 *
 * @example
 * ```html
 * <moni-nav placement="bottom">
 *   <moni-nav-item href="/" icon="home" label="Inicio" active></moni-nav-item>
 *   <moni-nav-item href="/search" icon="search" label="Buscar"></moni-nav-item>
 *   <moni-nav-item href="/profile" icon="person" label="Perfil">
 *     <moni-badge value="3"></moni-badge>  <!-- insignia de notificación -->
 *   </moni-nav-item>
 * </moni-nav>
 * ```
 *
 * @slot default - Contenido adicional colocado después del icono (ej. `<moni-badge>`).
 *
 * @csspart item   - El elemento exterior `<a>`.
 * @csspart icon   - El contenedor del icono.
 * @csspart label  - El elemento de texto de la etiqueta.
 */
@customElement('moni-nav-item')
export class MoniNavItem extends MoniElement {
	@property({ reflect: true }) href = '#';
	@property({ reflect: true }) target = '';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true }) placement = 'top';
	@property({ reflect: true }) variant = 'rail';
	@property({ reflect: true }) layout = 'auto';

	@state()
	private _isMediumScreen = false;

	private _query = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
		? window.matchMedia('(min-width: 601px)')
		: null;

	/**
	 * Hook de inicialización (Lit).
	 * Vincula un listener de `MediaQueryList` nativo para poder reaccionar en tiempo real
	 * cuando la pantalla cruza el breakpoint de 600px, adaptando la disposición
	 * (horizontal vs vertical) del ícono y la etiqueta automáticamente.
	 */
	override connectedCallback() {
		super.connectedCallback();
		if (this._query) {
			this._query.addEventListener('change', this._handleQueryChange);
			this._isMediumScreen = this._query.matches;
		}
	}

	/**
	 * Hook de destrucción (Lit).
	 * Desvincula rigurosamente el listener del `matchMedia` para
	 * prevenir fugas de memoria (memory leaks).
	 */
	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this._query) {
			this._query.removeEventListener('change', this._handleQueryChange);
		}
	}

	/**
	 * Callback asíncrono disparado nativamente por el navegador cuando
	 * cambian las condiciones del Media Query. 
	 * Actualiza el estado reactivo `_isMediumScreen` lo que fuerza a Lit a re-renderizar.
	 */
	private _handleQueryChange = (e: MediaQueryListEvent) => {
		this._isMediumScreen = e.matches;
	};

	get computedLayout(): 'vertical' | 'horizontal' {
		if (this.placement === 'left' || this.placement === 'right') {
			return this.variant === 'drawer' ? 'horizontal' : 'vertical';
		}
		if (this.layout === 'auto') {
			return this._isMediumScreen ? 'horizontal' : 'vertical';
		}
		return this.layout as 'vertical' | 'horizontal';
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
				inline-size: 100%;
				justify-content: center;
				box-sizing: border-box;
			}

			a {
				display: flex;
				align-items: center;
				justify-content: center;
				text-decoration: none;
				color: var(--on-surface-variant);
				cursor: pointer;
				inline-size: 100%;
				transition: background-color var(--speed2), color var(--speed2);
				outline: none;
				position: relative;
				box-sizing: border-box;
			}

			/* ─── State Layers (Hover/Focus/Active) ─── */
			a:hover:not(.active) .active-indicator {
				background-color: var(--surface-container-high, rgba(0, 0, 0, 0.08));
			}

			/* ─── Vertical Layout Styles ─── */
			a[data-layout='vertical'] {
				flex-direction: column;
				gap: 0.25rem; /* 4dp space between icon and label */
				padding: 0.5rem 0;
				min-block-size: 4rem; /* 64dp height */
			}

			a[data-layout='vertical'] .active-indicator {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-inline-size: 3.5rem; /* 56px */
				block-size: 2rem; /* 32px */
				border-radius: 1rem; /* fully rounded */
				transition: background-color var(--speed2), color var(--speed2);
			}

			a[data-layout='vertical'].active .active-indicator {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			a[data-layout='vertical'] .label {
				font-size: 0.75rem; /* 12dp label size */
				font-weight: 500;
				transition: color var(--speed2);
				color: var(--on-surface-variant);
				text-align: center;
			}

			a[data-layout='vertical'].active .label {
				color: var(--secondary);
				font-weight: 600;
			}

			/* ─── Horizontal Layout Styles ─── */
			a[data-layout='horizontal'] {
				flex-direction: row;
				padding: 0.5rem 0.75rem;
				min-block-size: 4rem; /* 64dp height */
			}

			a[data-layout='horizontal'] .active-indicator {
				display: inline-flex;
				align-items: center;
				gap: 0.5rem; /* 8dp gap between icon and label */
				padding: 0.375rem 1rem;
				border-radius: 1.25rem; /* fully rounded */
				transition: background-color var(--speed2), color var(--speed2);
				min-block-size: 2rem;
				box-sizing: border-box;
			}

			a[data-layout='horizontal'].active .active-indicator {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			a[data-layout='horizontal'] .label {
				font-size: 0.875rem; /* 14dp label size */
				font-weight: 500;
				color: var(--on-surface-variant);
				transition: color var(--speed2);
			}

			a[data-layout='horizontal'].active .label {
				color: var(--on-secondary-container);
				font-weight: 600;
			}

			/* Drawer variant specific tweaks */
			:host([variant='drawer']) a[data-layout='horizontal'] {
				justify-content: flex-start;
				padding: 0.5rem 1rem;
			}
			:host([variant='drawer']) a[data-layout='horizontal'] .active-indicator {
				width: 100%;
				background-color: transparent;
			}
			:host([variant='drawer']) a[data-layout='horizontal'].active .active-indicator {
				background-color: var(--secondary-container);
			}

			/* Icon Sizes and Helpers */
			.icon-container {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 1.5rem;
				block-size: 1.5rem;
			}

			.icon-container moni-icon,
			.icon-container ::slotted(moni-icon),
			.icon-container i {
				font-size: 1.5rem; /* 24dp */
				inline-size: 1.5rem;
				block-size: 1.5rem;
			}
		`
	];

	/**
	 * Renderiza el elemento de navegación como un `<a>` o `<button>` con ranura de icono, etiqueta y badge (insignia).
	 *
	 * **Indicador activo:**
	 * La barra de navegación M3 usa un indicador en forma de píldora detrás del icono del
	 * elemento activo. Esto se implementa como el pseudo-elemento `::before` en
	 * `.item` que crece de `0` a `64px` de ancho usando una transición CSS.
	 * La clase `active` en `.item` activa la transición y también establece
	 * `aria-current="page"` para lectores de pantalla.
	 *
	 * **Ranura para badge (insignia):**
	 * `[slot="badge"]` se renderiza posicionado absolutamente sobre la esquina superior final del icono.
	 * Los consumidores colocan un `<moni-badge>` aquí para cuentas de notificaciones.
	 */
	override render() {
		const isHorizontal = this.computedLayout === 'horizontal';

		const iconEl = html`
			<div class="icon-container" part="icon">
				${this.icon
					? html`<moni-icon name="${this.icon}"></moni-icon>`
					: html`<slot name="icon"></slot>`}
			</div>
		`;

		const labelEl = html`
			<span class="label" part="label"><slot>${this.label}</slot></span>
		`;

		return html`<a
			href=${this.href || '#'}
			target=${ifDefined(this.target || undefined)}
			class=${this.active ? 'active' : ''}
			data-layout=${this.computedLayout}
			part="item"
		>
			${isHorizontal
				? html`
					<div class="active-indicator" part="indicator">
						${iconEl}
						${labelEl}
					</div>
				`
				: html`
					<div class="active-indicator" part="indicator">
						${iconEl}
					</div>
					${labelEl}
				`}
		</a>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-nav-item': MoniNavItem;
	}
}

export default MoniNavItem;
