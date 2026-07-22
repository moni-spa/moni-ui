/**
 * @file components/moni-tab.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Tab (Pestaña).
 *
 * Un elemento interactivo de pestaña individual diseñado para ser colocado dentro de un
 * contenedor `<moni-tabs>`. Las pestañas organizan el contenido en diferentes pantallas,
 * conjuntos de datos y otras interacciones.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/tabs/specs.md`
 *
 * **Diseño visual e interacción:**
 * Internamente se renderiza como un elemento `<a>` para soportar el comportamiento nativo
 * de enlace cuando se proporciona un `href`, pero se comporta visualmente como un botón de pestaña.
 * Muestra una etiqueta de texto y un icono opcional de Material. Si el `<moni-tabs>` padre tiene el
 * atributo `vertical` configurado, el diseño se ajusta automáticamente para apilar el icono
 * encima del texto.
 *
 * **Estado:**
 * El atributo `active` resalta la pestaña, aplicando el color principal (primary) al
 * texto y renderizando la línea indicadora activa (manejado vía CSS en el contenedor
 * padre o mediante pseudo-elementos).
 *
 * @example
 * ```html
 * <moni-tabs>
 *   <moni-tab active icon="home" label="Inicio"></moni-tab>
 *   <moni-tab icon="settings" label="Ajustes" href="/settings"></moni-tab>
 * </moni-tabs>
 * ```
 *
 * @csspart tab - El elemento `<a>` interno que actúa como botón de pestaña.
 */
@customElement('moni-tab')
export class MoniTab extends MoniElement {
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ reflect: true }) icon = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) href = '#';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
			}

			:host-context(moni-tabs[vertical]) {
				display: flex;
				inline-size: 100%;
			}

			a {
				position: relative;
				display: flex;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-surface-variant);
				padding: 0.5rem 1rem;
				text-align: center;
				min-block-size: 3rem;
				inline-size: 100%;
				gap: 0.25rem;
				text-decoration: none;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: color var(--speed2);
			}

			:host-context(moni-tabs[vertical]) a {
				flex-direction: column;
				gap: 0.25rem;
				min-block-size: 4.5rem;
				border-inline-end: 0.125rem solid transparent;
				border-block-end: none;
			}

			a:hover {
				color: var(--primary);
			}

			a.active,
			a.active > * {
				color: var(--primary);
			}

			a.active::before {
				content: '';
				position: absolute;
				inset: auto 0 0 0;
				/* M3 Expressive: indicator thickness 3dp. */
				block-size: 0.1875rem;
				/* M3 Expressive default: full tab width. */
				border-radius: 0.75rem;
				background-color: var(--primary);
			}

			:host-context(moni-tabs[vertical]) a.active::before {
				inset: 0 0 0 auto;
				inline-size: 0.1875rem;
				block-size: auto;
			}

			/* M3 indicator-size='min': 24dp de altura (centrado en la pestaña) con
			   radio superior/inferior de 8dp — coincide con la especificación M3 § Indicator anatomy. */
			:host-context(moni-tabs[indicator-size='min']) a.active::before {
				margin: 0 auto;
				max-inline-size: min(100%, 4rem);
				block-size: 1.5rem;
				border-radius: 0.5rem;
			}

			:host-context(moni-tabs[vertical][indicator-size='min'])
				a.active::before {
				margin: auto 0;
				max-block-size: 4rem;
				max-inline-size: 0.1875rem;
				border-radius: 0.5rem;
			}

			/* M3 indicator-size='max': altura completa de la pestaña, sin redondeo. */
			:host-context(moni-tabs[indicator-size='max']) a.active::before {
				border-radius: 0;
			}
		`
	];

	/**
	 * Renderiza el botón de pestaña con un icono opcional y etiqueta.
	 *
	 * El botón de pestaña es un elemento `<a>` con `aria-selected` para
	 * cumplimiento WCAG. La clase `active` controla la transición de subrayado
	 * del indicador CSS (a través del pseudo-elemento `::before`). El `<moni-icon>`
	 * opcional se renderiza antes del texto de la etiqueta cuando se establece `icon`.
	 */
	override render() {
		return html`<a
			href=${this.href || '#'}
			class=${this.active ? 'active' : ''}
			part="tab"
			aria-selected=${this.active}
		>
			${this.icon
				? html`<moni-icon name="${this.icon}" part="icon"></moni-icon>`
				: html`<slot name="icon"></slot>`}
			<span part="label"><slot>${this.label}</slot></span>
		</a>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-tab': MoniTab;
	}
}

export default MoniTab;
