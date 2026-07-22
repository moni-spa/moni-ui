/**
 * @file components/moni-tabs.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Tabs container (Contenedor de pestañas).
 *
 * Un contenedor de navegación que agrupa múltiples elementos `<moni-tab>`. Las pestañas
 * organizan el contenido en categorías de alto nivel y permiten al usuario alternar
 * entre ellas.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/tabs/specs.md`
 *
 * **Modos (Primario vs Secundario):**
 * - `primary` (por defecto): Usado para navegación de nivel superior en la jerarquía más alta,
 *   a menudo colocado directamente debajo de una barra de aplicación superior (top app bar).
 *   Abarcan todo el ancho y presentan un indicador activo prominente.
 * - `secondary`: Usado para jerarquías de contenido más profundas dentro de un área
 *   o página específica. Típicamente son más sutiles.
 *
 * **Diseño y alineación:**
 * - `scrollable`: Si el número de pestañas excede el ancho del contenedor, esto
 *   habilita el desplazamiento horizontal (`overflow-x: auto`) en lugar de aplastarlas.
 * - `align`: Controla cómo se distribuyen las pestañas (`default` space-around,
 *   `left`, `center`, o `right`).
 * - `vertical`: Apila el icono sobre la etiqueta de texto dentro de las pestañas hijas.
 *
 * **Indicador Activo:**
 * El atributo `indicator-size` permite personalizar el ancho del
 * indicador de subrayado activo (`default` se ajusta al contenido de la pestaña, `min` es estrecho, `max`
 * llena todo el ancho de la pestaña).
 *
 * @example
 * ```html
 * <!-- Pestañas primarias, con desplazamiento (scrollable) -->
 * <moni-tabs scrollable>
 *   <moni-tab active label="Vuelos"></moni-tab>
 *   <moni-tab label="Viajes"></moni-tab>
 *   <moni-tab label="Explorar"></moni-tab>
 * </moni-tabs>
 *
 * <!-- Pestañas secundarias, centradas con diseño vertical -->
 * <moni-tabs mode="secondary" align="center" vertical>
 *   <moni-tab active icon="video_camera_front" label="Video"></moni-tab>
 *   <moni-tab icon="photo_camera" label="Foto"></moni-tab>
 * </moni-tabs>
 * ```
 *
 * @slot default - Elementos hijos `<moni-tab>`.
 */
@customElement('moni-tabs')
export class MoniTabs extends MoniElement {
	@property({ reflect: true })
	mode: 'primary' | 'secondary' = 'primary';
	@property({ type: Boolean, reflect: true }) scrollable = false;
	@property({ type: Boolean, reflect: true }) vertical = false;
	@property({ reflect: true })
	align: 'default' | 'left' | 'center' | 'right' = 'default';
	@property({ reflect: true, attribute: 'indicator-size' })
	indicatorSize: 'default' | 'min' | 'max' = 'default';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			nav {
				display: flex;
				white-space: nowrap;
				border-block-end: 0.0625rem solid var(--surface-variant);
				border-radius: 0;
				overflow-x: auto;
			}

			nav.left-align {
				justify-content: flex-start;
			}
			nav.center-align {
				justify-content: center;
			}
			nav.right-align {
				justify-content: flex-end;
			}
			:host(:not([align])) nav,
			nav:not(.left-align):not(.center-align):not(.right-align) {
				justify-content: space-around;
			}

			:host([vertical]) nav {
				flex-direction: column;
				border-block-end: none;
				border-inline-end: 0.0625rem solid var(--surface-variant);
				overflow-x: visible;
				overflow-y: auto;
			}
		`
	];

	/**
	 * Renderiza el contenedor de navegación.
	 * Construye dinámicamente las clases CSS que habilitan los selectores estructurales
	 * (`mode`, `align`, `indicatorSize`) permitiendo que el componente hijo `moni-tab`
	 * herede estilos contextuales sin necesidad de inyectar variables complejas.
	 */
	override render() {
		const classes = [
			'tabs',
			this.align === 'default' ? '' : `${this.align}-align`,
			this.indicatorSize === 'default' ? '' : this.indicatorSize,
			this.mode,
			this.vertical ? 'vertical' : ''
		]
			.filter(Boolean)
			.join(' ');
		return html`<nav class=${classes} part="tabs">
			<slot></slot>
		</nav>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tabs': MoniTabs;
	}
}

export default MoniTabs;
