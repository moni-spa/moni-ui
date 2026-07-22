/**
 * @file components/moni-toolbar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Top App Bar (Barra de herramientas superior).
 *
 * Las barras de aplicación superiores muestran información y acciones en la parte superior de una pantalla.
 * Se utilizan para identidad de marca, títulos de pantalla, navegación y acciones.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/top-app-bar/specs.md`
 *
 * **Nota:** Esta es la barra de herramientas estándar de nivel superior. Para barras de navegación
 * inferiores (a menudo usadas en móviles), usa `<moni-app-bar>`.
 *
 * **Variantes:**
 * - `standard` (por defecto): Una barra de ancho completo (altura de 64dp) que se asienta al ras
 *   contra la parte superior de la pantalla.
 * - `floating`: Una barra separada con un margen de 4dp y esquinas redondeadas de 8dp,
 *   que parece flotar sobre el contenido.
 *
 * **Comportamiento de desplazamiento (scroll):**
 * Cuando el atributo `scroll` está presente, la barra de herramientas responde visualmente al
 * desplazamiento aumentando su elevación (sombra) y cambiando dinámicamente
 * su color de superficie para indicar profundidad sobre el contenido desplazado.
 *
 * @example
 * ```html
 * <!-- Barra de herramientas estándar con navegación y acciones -->
 * <moni-toolbar title="Bandeja de entrada">
 *   <moni-icon-button slot="leading" icon="menu"></moni-icon-button>
 *   <moni-icon-button slot="trailing" icon="search"></moni-icon-button>
 *   <moni-icon-button slot="trailing" icon="more_vert"></moni-icon-button>
 * </moni-toolbar>
 *
 * <!-- Barra de herramientas flotante con un FAB adjunto -->
 * <moni-toolbar type="floating" title="Notas">
 *   <moni-fab slot="action-button" icon="add"></moni-fab>
 * </moni-toolbar>
 * ```
 *
 * @slot default       - El texto del título o contenido central.
 * @slot leading       - Icono/botón de navegación colocado en el extremo izquierdo.
 * @slot trailing      - Iconos/botones de acción colocados en el extremo derecho.
 * @slot action-button - Un botón de acción flotante (FAB) anclado al lado derecho.
 */
@customElement('moni-toolbar')
export class MoniToolbar extends MoniElement {
	@property({ reflect: true })
	type: 'standard' | 'floating' = 'standard';
	@property({ type: Boolean, reflect: true, attribute: 'scroll' })
	scrolled = false;
	@property({ reflect: true }) title = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				position: relative;
				z-index: var(--z-index-toolbar, 1000);
			}

			.container {
				display: flex;
				align-items: center;
				gap: 1rem;
				block-size: 4rem;
				padding-inline: 0.25rem;
				padding-block: 0.5rem;
				background-color: var(--surface-container);
				color: var(--on-surface);
				font-family: var(--font);
				transition: box-shadow var(--speed2), background-color var(--speed2);
			}

			:host([type='standard']) .container {
				box-shadow: var(--shadow1);
			}

			:host([type='floating']) .container {
				margin: 0.25rem;
				border-radius: 0.5rem;
				box-shadow: var(--shadow2);
			}

			:host([type='standard'][scroll]) .container {
				box-shadow: var(--shadow3);
			}

			.leading,
			.trailing {
				display: inline-flex;
				align-items: center;
				gap: 0.25rem;
				flex: none;
			}

			.title {
				flex: auto;
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding-inline-start: 0.75rem;
			}

			::slotted([slot='action-button']) {
				position: absolute;
				inset-block-end: -1.75rem;
				inset-inline-end: 1rem;
				z-index: 1;
			}
		`
	];

	/**
	 * Renderiza el diseño `<header>` de 3 zonas de la barra de herramientas.
	 *
	 * **Zonas:**
	 * - `.leading` — slot inicial para iconos de navegación o controles de migas de pan (breadcrumb).
	 * - `.title` — zona del título central; renderiza `this.title` como texto si el atributo
	 *   está configurado, de lo contrario recurre al slot por defecto para contenido rico.
	 * - `.trailing` — slot final para iconos de acción (buscar, más, etc.).
	 *
	 * **Slot `action-button`:**
	 * Un slot nombrado separado, fuera del `<header>`, para un botón de acción flotante
	 * (FAB) o disparador de menú contextual que no debe participar en el diseño
	 * flex de la fila del título.
	 */
	override render() {
		return html`
			<header class="container" part="container">
				<span class="leading" part="leading"><slot name="leading"></slot></span>
				<span class="title" part="title">
					${this.title || html`<slot></slot>`}
				</span>
				<span class="trailing" part="trailing">
					<slot name="trailing"></slot>
				</span>
			</header>
			<slot name="action-button"></slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-toolbar': MoniToolbar;
	}
}

export default MoniToolbar;