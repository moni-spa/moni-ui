/**
 * @file components/moni-icon.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente de icono solo visual que utiliza la fuente variable Material Symbols.
 *
 * Renderiza un glifo de Material Symbols por el nombre de su ligadura. La fuente de iconos
 * debe cargarse globalmente en el documento host — no viene empaquetada con
 * el componente. Añada la fuente a través de la hoja de estilos `@moni-labs/moni-ui/styles`
 * o incluyendo el enlace CDN de Google Fonts.
 *
 * **Renderizado de fuentes:**
 * El icono usa `font-family: var(--font-icon)` que por defecto es
 * `'Material Symbols Rounded'`. Sobrescriba `--font-icon-override` en el
 * `:root` del documento host para cambiar a una variante diferente del conjunto de iconos
 * (ej. `'Material Symbols Outlined'` o `'Material Symbols Sharp'`).
 *
 * **Ajustes de fuente variable:**
 * El valor por defecto de `font-variation-settings` es `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`.
 * Establecer el atributo `filled` cambia a `'FILL' 1` para la variante de icono sólido.
 *
 * **Herencia de color:**
 * El icono siempre hereda el color de su padre a través de `color: inherit`, haciéndolo
 * adaptarse automáticamente a las variantes de botones, estados seleccionados de chips, estados
 * activos de elementos de lista y otros contenedores de contexto de color.
 *
 * @example
 * ```html
 * <!-- Icono básico -->
 * <moni-icon name="home"></moni-icon>
 *
 * <!-- Icono grande rellenado -->
 * <moni-icon name="favorite" size="large" filled></moni-icon>
 *
 * <!-- Sobrescritura de SVG personalizado a través de slot -->
 * <moni-icon>
 *   <svg slot="default" viewBox="0 0 24 24">...</svg>
 * </moni-icon>
 * ```
 *
 * @slot default - Contenido de respaldo cuando `name` está vacío. Acepta elementos `<svg>` o `<img>`
 *                 que se dimensionan al 100% de la caja del icono.
 *
 * @cssproperty --font-icon-override - Sobrescribe la familia de fuentes de iconos a
 *                                     nivel del documento. Establecer en `:root`.
 */
@customElement('moni-icon')
export class MoniIcon extends MoniElement {
	/**
	 * Nombre de la ligadura de Material Symbols para el icono a renderizar.
	 *
	 * Utilice el nombre exactamente como se muestra en https://fonts.google.com/icons
	 * (ej. `'home'`, `'settings'`, `'arrow_forward'`).
	 * Cuando está vacío, se renderiza el slot por defecto en su lugar.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Tamaño de la caja delimitadora del icono.
	 *
	 * Se mapea a la propiedad personalizada `--_size`:
	 * | Valor      | Tamaño   |
	 * |------------|----------|
	 * | `'tiny'`   | 1rem     |
	 * | `'small'`  | 1.25rem  |
	 * | `'medium'` | 1.5rem   |
	 * | `'large'`  | 1.75rem  |
	 * | `'extra'`  | 2rem     |
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'tiny' | 'small' | 'medium' | 'large' | 'extra' = 'medium';

	/**
	 * Cuando es `true`, cambia a la variante rellenada (filled) del icono estableciendo
	 * `font-variation-settings: 'FILL' 1`.
	 *
	 * Esto funciona solo con fuentes de iconos variables que incluyen el eje `FILL`
	 * (todas las variantes de Material Symbols lo hacen). No tiene efecto si se carga
	 * una fuente de iconos diferente que no soporte `FILL`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) filled = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				--_size: 1.5rem;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				vertical-align: middle;
				font-family: var(--font-icon);
				font-weight: normal;
				font-style: normal;
				font-size: var(--_size);
				letter-spacing: normal;
				text-transform: none;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				font-feature-settings: 'liga';
				font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
				-webkit-font-smoothing: antialiased;
				line-height: 1;
				inline-size: var(--_size);
				block-size: var(--_size);
				/* Herencia explícita para que el glifo del icono tome el color de
				   cualquier consumidor que lo envuelva (variantes de botones, estado
				   seleccionado de chip, activo de list-item, etc.). */
				color: inherit;
			}

			:host([size='tiny']) {
				--_size: 1rem;
			}
			:host([size='small']) {
				--_size: 1.25rem;
			}
			:host([size='medium']) {
				--_size: 1.5rem;
			}
			:host([size='large']) {
				--_size: 1.75rem;
			}
			:host([size='extra']) {
				--_size: 2rem;
			}

			:host([filled]) {
				font-variation-settings: 'FILL' 1;
			}

			::slotted(svg),
			::slotted(img) {
				inline-size: 100%;
				block-size: 100%;
				object-fit: contain;
			}
		`
	];

	/**
	 * Renderiza el ícono utilizando la fuente de variables Material Symbols.
	 * Si no se provee un `name`, el `<slot>` actúa como fallback permitiendo
	 * inyectar un SVG personalizado directamente.
	 */
	override render() {
		return html`<slot>${this.name}</slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-icon': MoniIcon;
	}
}

export default MoniIcon;
