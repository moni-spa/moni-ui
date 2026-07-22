/**
 * @file components/moni-divider.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Divider (Separador).
 *
 * Una regla delgada horizontal (o vertical) utilizada para separar visualmente secciones
 * de contenido dentro de listas, diseños y tarjetas.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/divider/specs.md`
 *
 * **Medidas M3:**
 * - Grosor: 1dp (`0.0625rem`).
 * - Color: `outline-variant` — sutil en todos los fondos de superficie.
 * - Las variantes insertadas (inset) alinean la línea con el contenido de la lista:
 *   - `leading` — margen de 16dp desde el borde inicial (se alinea con el texto del icono).
 *   - `middle`  — margen de 16dp en ambos bordes.
 *   - `none`    — sangría completa (sin margen).
 *
 * **Uso vertical:**
 * Aunque todavía no se expone como un atributo, el selector de atributos CSS `[vertical]`
 * está soportado. Establezca `vertical` como un atributo HTML para renderizar un separador
 * vertical de 1dp de ancho que se estira para coincidir con el eje transversal de su contenedor flex.
 *
 * @example
 * ```html
 * <!-- Separador de sangría completa entre secciones -->
 * <moni-divider inset="none"></moni-divider>
 *
 * <!-- Separador de inserción inicial en una lista (se alinea con el texto del elemento de lista) -->
 * <moni-divider></moni-divider>
 *
 * <!-- Separador vertical dentro de un contenedor flex -->
 * <div style="display:flex; height: 3rem; align-items:center; gap: 1rem;">
 *   <span>Sección A</span>
 *   <moni-divider vertical></moni-divider>
 *   <span>Sección B</span>
 * </div>
 * ```
 */
@customElement('moni-divider')
export class MoniDivider extends MoniElement {
	/**
	 * Controla el margen horizontal en la línea del separador.
	 *
	 * - `'leading'` (por defecto) — Margen de 16dp solo desde el borde inicial (inicio).
	 *   Usar en listas para alinear el separador con el texto principal de los elementos de la lista.
	 * - `'middle'`  — Margen de 16dp tanto en el borde inicial como en el final.
	 *   Usar para separar secciones donde una sangría completa sería visualmente demasiado pesada.
	 * - `'none'`    — Sin margen; la línea abarca todo el ancho del padre.
	 *   Usar como separador de secciones o entre tarjetas.
	 *
	 * @default 'leading'
	 */
	@property({ reflect: true })
	inset: 'leading' | 'middle' | 'none' = 'leading';

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				/* Especificación M3: grosor de 1dp, on-surface-variant para una separación sutil. */
				block-size: 0.0625rem;
				min-inline-size: 0;
				background-color: var(--outline-variant);
				border: 0;
				margin: 0;
			}

			/* Variantes de inserción. Especificación M3: 16dp desde el borde inicial. */
			:host([inset='leading']) {
				margin-inline-start: 1rem;
				margin-inline-end: 0;
			}
			:host([inset='middle']) {
				margin-inline: 1rem;
			}
			:host([inset='none']) {
				margin-inline: 0;
			}

			/* Separador vertical (la especificación M3 también define el uso vertical). */
			:host([vertical]) {
				inline-size: 0.0625rem;
				block-size: auto;
				min-block-size: 100%;
				align-self: stretch;
			}
		`
	];

	/**
	 * Renderiza un paso a través de slot transparente.
	 *
	 * `moni-divider` es un componente impulsado puramente por CSS — la línea visual es
	 * renderizada por el elemento `:host` en sí (a través de `background-color` y
	 * `block-size: 0.0625rem`). No se necesitan elementos internos.
	 *
	 * El `<slot>` vacío se incluye para que los consumidores puedan insertar etiquetas de texto
	 * o iconos entre secciones (ej. `<moni-divider>O</moni-divider>`).
	 * El contenido renderizado en el slot no tiene estilo visual de este componente; el consumidor
	 * debe aplicar estilo a los elementos del slot directamente.
	 */
	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-divider': MoniDivider;
	}
}

export default MoniDivider;