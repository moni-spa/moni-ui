/**
 * @file components/moni-context-menu.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-menu.js';

/**
 * Componente Material Design 3 Context Menu (Menú Contextual).
 *
 * Un menú especializado que se abre en las coordenadas exactas de un evento de puntero,
 * típicamente desencadenado por un clic derecho (evento `contextmenu`). Proporciona
 * acciones contextuales relacionadas con el elemento específico clicado.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/menus/specs.md` (Menús contextuales)
 *
 * **Mecanismo de activación:**
 * El componente no requiere activación programática a través de una propiedad `open`.
 * En su lugar, adjunta un detector de eventos `contextmenu` a su elemento padre
 * durante `connectedCallback`. Cuando se hace clic derecho en el padre, el menú
 * captura las coordenadas `clientX`/`clientY`, previene el menú contextual predeterminado
 * del navegador, y se abre en la posición del cursor usando `position: fixed`.
 *
 * **Comportamiento de auto-inversión (atributo `flip`):**
 * Según las pautas de M3, los menús deben invertirse al lado opuesto del cursor
 * si al abrirse en la `placement` solicitada causarían un desbordamiento de la
 * ventana gráfica. Cuando `flip=true`, el componente calcula dinámicamente los límites
 * de la ventana antes de abrir y anula `placement` si es necesario (ej., invirtiendo
 * de `bottom` a `top` si se hace clic cerca de la parte inferior de la pantalla).
 *
 * **Auto-descarte:**
 * Se cierra automáticamente al hacer clic en cualquier lugar fuera del menú, o al
 * presionar la tecla `Escape`.
 *
 * @example
 * ```html
 * <!-- Envuelve el área de activación y el menú en un contenedor -->
 * <div>
 *   <p>Haz clic derecho para ver las opciones</p>
 *   <moni-context-menu flip>
 *     <moni-menu-item>Copiar</moni-menu-item>
 *     <moni-menu-item>Pegar</moni-menu-item>
 *     <moni-divider></moni-divider>
 *     <moni-menu-item>Eliminar</moni-menu-item>
 *   </moni-context-menu>
 * </div>
 * ```
 *
 * @slot default - Los elementos `<moni-menu-item>` que componen el menú.
 */
@customElement('moni-context-menu')
export class MoniContextMenu extends MoniElement {
	@property({ reflect: true })
	placement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	@property({ type: Boolean, reflect: true }) flip = false;

	@state() private _x = 0;
	@state() private _y = 0;
	@state() private _open = false;
	@state() private _resolvedPlacement: 'bottom' | 'top' | 'left' | 'right' = 'bottom';

	@query('moni-menu') private _menuEl?: HTMLElement;

	private _target: HTMLElement | null = null;
	/**
	 * Wrapper estático para el manejador de teclado global.
	 * Conserva la referencia exacta para desregistrar el evento en `disconnectedCallback`.
	 */
	private _docKeydown = (e: KeyboardEvent) => this._onDocKeydown(e);

	/**
	 * Hook de inicialización (Lit).
	 * Atrapa al elemento padre directo y le inyecta `position: relative` (si era static)
	 * para que las coordenadas de despliegue del menú floten correctamente.
	 * Adjunta los eventos nativos de `contextmenu` (clic derecho) al contenedor.
	 */
	override connectedCallback() {
		super.connectedCallback();
		this._target = this.parentElement;
		if (this._target) {
			const computed = getComputedStyle(this._target);
			if (computed.position === 'static') {
				this._target.style.position = 'relative';
			}
			this._target.addEventListener('contextmenu', this._onContextMenu);
		}
		// Close on click outside
		document.addEventListener('click', this._onDocumentClick);
		document.addEventListener('keydown', this._docKeydown);
	}

	/**
	 * Hook de destrucción (Lit).
	 * Limpia los detectores de clic derecho y atajos de teclado para eludir memory leaks
	 * al desmontarse del DOM.
	 */
	override disconnectedCallback() {
		if (this._target) {
			this._target.removeEventListener('contextmenu', this._onContextMenu);
		}
		document.removeEventListener('click', this._onDocumentClick);
		document.removeEventListener('keydown', this._docKeydown);
		super.disconnectedCallback();
	}

	/**
	 * Intercepta el clic derecho (`contextmenu`) del navegador de forma nativa.
	 * Previene el menú por defecto del SO y captura las coordenadas X/Y del ratón
	 * relativas al elemento anfitrión para ubicar milimétricamente el popup personalizado.
	 */
	private _onContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		if (this._target) {
			const rect = this._target.getBoundingClientRect();
			this._x = e.clientX - rect.left;
			this._y = e.clientY - rect.top;
		} else {
			this._x = e.clientX;
			this._y = e.clientY;
		}
		this._resolvedPlacement = this.placement;
		this._open = true;
		// Después de que Lit renderice el menú, verificar el ajuste al viewport y voltear si es necesario.
		this.updateComplete.then(() => this._maybeFlip());
	};

	/**
	 * Sistema de Colisión/Desbordamiento de Ventana.
	 * Si la directiva `flip` está habilitada, examina los límites (BoundingClientRect)
	 * del menú tras su renderizado y altera su `placement` sobre la marcha si éste
	 * colisiona con el borde del Viewport, invirtiendo top/bottom o left/right.
	 */
	private _maybeFlip() {
		if (!this.flip) return;
		const menu = this._menuEl?.shadowRoot?.querySelector('menu') as HTMLElement | null;
		if (!menu) return;
		const rect = menu.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const overflowsBottom = rect.bottom > vh;
		const overflowsRight = rect.right > vw;
		if (this.placement === 'bottom' && overflowsBottom) {
			this._resolvedPlacement = 'top';
		} else if (this.placement === 'top' && rect.top < 0) {
			this._resolvedPlacement = 'bottom';
		} else if (this.placement === 'right' && overflowsRight) {
			this._resolvedPlacement = 'left';
		} else if (this.placement === 'left' && rect.left < 0) {
			this._resolvedPlacement = 'right';
		}
	}

	/**
	 * Cierra instintivamente el menú contextual si el usuario hace clic en 
	 * cualquier zona exterior al mismo.
	 */
	private _onDocumentClick = () => {
		if (this._open) {
			this._open = false;
		}
	};

	/**
	 * Escucha la tecla Escape a nivel documento para cerrar el menú si se
	 * encuentra desplegado, cumpliendo con los estándares de accesibilidad (WAI-ARIA).
	 */
	private _onDocKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && this._open) {
			this._open = false;
		}
	};

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			.menu-host {
				/* Absolute from parent which has position:relative */
				position: absolute;
				inset-inline-start: var(--_x, 0);
				inset-block-start: var(--_y, 0);
				z-index: 200;
			}
		`
	];

	/**
	 * Renderiza el menú contextual como una superposición de Popover API posicionada en las coordenadas del puntero.
	 *
	 * El `<div>` del menú usa `popover="manual"` para que aparezca en la capa superior
	 * por encima de todo el otro contenido. Sus `top` y `left` se establecen mediante propiedades personalizadas CSS
	 * `--_x` / `--_y` (inyectadas como estilo en línea) que se calculan
	 * a partir de `clientX` / `clientY` del evento `contextmenu`.
	 *
	 * El `@click` en el fondo (fuera de los límites del menú) llama a `hidePopover()`
	 * para descartar ligeramente el menú contextual. Los elementos dentro del menú deben llamar a
	 * `event.stopPropagation()` para evitar el cierre accidental al hacer clic en un elemento.
	 */
	override render() {
		// Cuando el menú está abierto, preferir la ubicación resuelta (posiblemente volteada);
		// de lo contrario, simplemente usar la ubicación solicitada por el host para que
		// el elemento interno refleje el atributo sincrónicamente.
		const effectivePlacement = this._open
			? this._resolvedPlacement
			: this.placement;
		return html`<div
			class="menu-host"
			style="--_x: ${this._x}px; --_y: ${this._y}px;"
		>
			<moni-menu
				placement=${effectivePlacement}
				?active=${this._open}
			>
				<slot></slot>
			</moni-menu>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-context-menu': MoniContextMenu;
	}
}

export default MoniContextMenu;
