/**
 * @file components/moni-list-item.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 List Item (Elemento de Lista).
 *
 * Una sola fila dentro de un `<moni-list>`. Los elementos de lista muestran un titular y
 * opcionalmente texto de soporte, metadatos, iconos o avatares.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/lists/specs.md`
 *
 * **Configuraciones de línea:**
 * El atributo `lines` configura el diseño y la altura mínima del elemento:
 * - `lines="1"` (por defecto) — altura mínima de 56dp. Solo se muestra el slot del titular.
 * - `lines="2"` — altura mínima de 72dp. Muestra el titular y el texto de soporte.
 * - `lines="3"` — altura mínima de 88dp. Muestra el titular, el texto de soporte y el texto meta.
 *
 * **Comportamiento interactivo:**
 * Por defecto, los elementos se renderizan como elementos `<button>`, adquiriendo la capa de estado de M3
 * (efectos de ondulación de hover, focus y press).
 * Si se proporciona el atributo `href`, el elemento se renderiza internamente como un elemento `<a>`,
 * permitiendo enrutamiento de enlaces nativos e interacciones mientras se preserva el
 * estilo del elemento de lista.
 *
 * **Elementos visuales:**
 * - `icon` (atributo) — Nombre de Material Symbol para el icono inicial (24dp).
 * - `avatar` (atributo) — URL para una imagen circular inicial (40dp).
 * - `trailing-icon` (atributo) — Nombre de Material Symbol para el icono final.
 *
 * @example
 * ```html
 * <!-- Elemento de 1 línea con icono -->
 * <moni-list-item icon="inbox">
 *   Bandeja de entrada
 * </moni-list-item>
 *
 * <!-- Elemento de 2 líneas con avatar y meta final -->
 * <moni-list-item lines="2" avatar="/user.jpg">
 *   Ali Connors
 *   <span slot="supporting">¿Brunch este fin de semana?</span>
 *   <span slot="trailing-meta">10 min</span>
 * </moni-list-item>
 *
 * <!-- Elemento de enlace -->
 * <moni-list-item href="/settings" icon="settings">
 *   Ajustes
 * </moni-list-item>
 * ```
 *
 * @slot default       - Texto del titular (Línea 1).
 * @slot supporting    - Texto de soporte (Línea 2, requiere `lines>=2`).
 * @slot meta          - Texto meta adicional (Línea 3, requiere `lines=3`).
 * @slot trailing-meta - Texto pequeño mostrado en el borde derecho lejano.
 *
 * @csspart item          - El contenedor externo `<button>` o `<a>`.
 * @csspart leading-icon  - Contenedor para el icono/avatar inicial.
 * @csspart text          - Contenedor para el bloque de texto multilínea.
 * @csspart trailing-icon - Contenedor para el icono final.
 */
@customElement('moni-list-item')
export class MoniListItem extends MoniElement {
	@property({ reflect: true })
	lines: 1 | 2 | 3 = 1;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) avatar = '';
	@property({ reflect: true, attribute: 'trailing-icon' })
	trailingIcon = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ reflect: true }) href = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				color: var(--on-surface);
				background-color: transparent;
				position: relative;
				font-family: var(--font);
				transition: background-color var(--speed2);
			}

			.row {
				display: flex;
				align-items: center;
				gap: 1rem;
				padding: 0.5rem 1rem;
				min-block-size: 3.5rem;
				box-sizing: border-box;
				color: inherit;
				text-decoration: none;
				cursor: pointer;
				width: 100%;
			}

			:host([active]) {
				background-color: var(--secondary-container);
				color: var(--on-secondary-container);
			}

			:host([disabled]) {
				opacity: 0.38;
				pointer-events: none;
				cursor: not-allowed;
			}

			:host(:not(:last-child)) {
				border-block-end: 0.0625rem solid var(--outline-variant);
			}

			:host([lines='2']) .row {
				min-block-size: 4.5rem;
			}
			:host([lines='3']) .row {
				min-block-size: 5.5rem;
			}

			.leading,
			.trailing {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: none;
			}

			.leading-icon {
				font-size: 1.5rem;
				color: var(--on-surface-variant);
			}
			:host([active]) .leading-icon {
				color: var(--on-secondary-container);
			}

			.avatar {
				inline-size: 2.5rem;
				block-size: 2.5rem;
				border-radius: 50%;
				background-color: var(--surface-container);
				background-size: cover;
				background-position: center;
			}

			.text {
				flex: auto;
				min-inline-size: 0;
				display: flex;
				flex-direction: column;
				gap: 0.125rem;
			}

			.headline {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 500;
				color: inherit;
				margin: 0;
				padding: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.supporting,
			.meta {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host([active]) .supporting,
			:host([active]) .meta {
				color: var(--on-secondary-container);
			}

			.trailing-meta {
				font-size: 0.75rem;
				color: var(--on-surface-variant);
				white-space: nowrap;
			}

			.trailing-icon {
				font-size: 1.5rem;
				color: var(--on-surface-variant);
			}
			:host([active]) .trailing-icon {
				color: var(--on-secondary-container);
			}
		`
	];

	/**
	 * Renderiza el diseño de 3 zonas del elemento de lista: medios iniciales, contenido y elemento final.
	 *
	 * **Anatomía del elemento de lista M3:**
	 * - Zona inicial: avatar, icono o miniatura (`[slot="leading"]`).
	 * - Zona de contenido: `overline` opcional (etiqueta pequeña en mayúsculas), `title` (texto primario),
	 *   y `description` (texto secundario/de soporte). Cada uno se renderiza condicionalmente
	 *   solo cuando el atributo correspondiente no está vacío para evitar nodos DOM vacíos.
	 * - Zona final: metadatos, botón de icono, o radio/checkbox (`[slot="trailing"]`).
	 *
	 * Un `<slot>` vacío se renderiza en la zona de contenido como respaldo para que los consumidores
	 * puedan proyectar texto sin formato o marcado complejo directamente en el elemento.
	 */
	override render() {
		const leading = this.avatar
			? html`<span
					class="avatar"
					part="avatar"
					style="background-image: url('${this.avatar}');"
				></span>`
			: this.icon
				? html`<span class="leading leading-icon" part="leading">
						<moni-icon name="${this.icon}"></moni-icon>
					</span>`
				: html`<slot name="leading"></slot>`;

		const trailing = this.trailingIcon
			? html`<span class="trailing trailing-icon" part="trailing">
					<moni-icon name="${this.trailingIcon}"></moni-icon>
				</span>`
			: html`<slot name="trailing"></slot>`;

		const supporting = this.lines >= 2
			? html`<span class="supporting" part="supporting"
					><slot name="supporting"></slot
				></span>`
			: nothing;
		const meta = this.lines >= 3
			? html`<span class="meta" part="meta"><slot name="meta"></slot></span>`
			: nothing;

		const inner = html`
			${leading}
			<div class="text" part="text">
				<span class="headline" part="headline"><slot></slot></span>
				${supporting} ${meta}
			</div>
			${trailing}
			<slot name="trailing-meta"></slot>
		`;

		return this.href
			? html`<a
					class="row"
					part="row"
					href=${this.href}
					>${inner}</a
				>`
			: html`<div class="row" part="row">${inner}</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-list-item': MoniListItem;
	}
}

export default MoniListItem;