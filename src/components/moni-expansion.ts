/**
 * @file components/moni-expansion.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Expansion panel (Panel de expansión).
 *
 * Un envoltorio ligero alrededor de los elementos HTML nativos `<details>` y `<summary>`,
 * estilizado de acuerdo con las pautas de superficie y elevación de M3.
 * Los paneles de expansión contienen flujos de creación y permiten la edición ligera de un elemento.
 *
 * **Arquitectura visual:**
 * El componente renderiza un elemento `<details>` con un `<summary>` que actúa
 * como el encabezado expandible. El contenido del slot por defecto se coloca dentro de la
 * etiqueta `<details>` (pero fuera del `<summary>`), ocultándose y mostrándose naturalmente
 * según el comportamiento nativo. Se añade un icono `expand_more` de M3 mediante un
 * pseudo-elemento CSS `::after` que rota cuando el panel está abierto.
 *
 * **Uso:**
 * Establezca el atributo `title` para un encabezado de texto simple, o use el slot `summary`
 * para proyectar contenido enriquecido personalizado (como iconos o texto secundario) en el
 * área del encabezado.
 *
 * @example
 * ```html
 * <!-- Título de texto simple -->
 * <moni-expansion title="Configuración Avanzada">
 *   <p>Habilite las características del modo de desarrollador aquí.</p>
 * </moni-expansion>
 *
 * <!-- Contenido de resumen enriquecido a través de slot -->
 * <moni-expansion open>
 *   <div slot="summary" style="display: flex; gap: 8px;">
 *     <moni-icon>person</moni-icon>
 *     <span>Información Personal</span>
 *   </div>
 *   <form>
 *     <moni-text-field label="Nombre"></moni-text-field>
 *   </form>
 * </moni-expansion>
 * ```
 *
 * @slot default - El contenido del cuerpo del panel de expansión.
 * @slot summary - Contenido personalizado del encabezado (sobrescribe el atributo `title`).
 */
@customElement('moni-expansion')
export class MoniExpansion extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ reflect: true }) title = '';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			details {
				border-radius: 0.5rem;
				overflow: hidden;
			}

			summary {
				list-style-type: none;
				cursor: pointer;
				padding: 0.75rem 1rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.5rem;
				font-weight: 500;
				color: var(--on-surface);
				background-color: var(--surface-container);
			}
			summary::-webkit-details-marker {
				display: none;
			}
			summary::after {
				content: 'expand_more';
				font-family: var(--font-icon);
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				font-size: 1.25rem;
				transition: transform var(--speed2);
			}
			details[open] > summary::after {
				transform: rotate(180deg);
			}

			.body {
				padding: 1rem;
				background-color: var(--surface-container-low);
				color: var(--on-surface);
			}
		`
	];

	/**
	 * Renderiza el panel de expansión utilizando el elemento nativo `<details>`.
	 *
	 * El atributo `open` en
	 * `:host` impulsa la rotación de la flecha indicadora CSS (`::after` en `summary`).
	 *
	 * **Estructura de slots:**
	 * - `[slot="summary"]` — la fila de encabezado siempre visible (título, iconos).
	 * - Slot por defecto — la región de contenido colapsable.
	 */
	override render() {
		return html`<details ?open=${this.open} part="expansion">
			<summary part="summary">
				<slot name="summary">${this.title}</slot>
			</summary>
			<div class="body" part="body">
				<slot></slot>
			</div>
		</details>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-expansion': MoniExpansion;
	}
}

export default MoniExpansion;
