/**
 * @file components/moni-typography.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Typography (Tipografía).
 *
 * Un componente de texto especializado que aplica la escala tipográfica M3. Asegura
 * que la tipografía sea consistente, accesible y correctamente estilizada en toda la
 * aplicación sin requerir clases CSS manuales.
 *
 * **Categorías de Escala Tipográfica:**
 * - `display`: El texto más grande en la pantalla, reservado para texto corto e importante
 *   o números. Funciona mejor en pantallas grandes. (Renderiza `<h1>` por defecto).
 * - `headline`: Texto de alto énfasis para encabezados primarios de página/sección.
 *   (Renderiza `<h2>` por defecto).
 * - `title`: Texto de énfasis medio utilizado para encabezados de diálogos o títulos
 *   de sección más pequeños. (Renderiza `<h3>` por defecto).
 * - `body`: Texto de párrafo estándar utilizado para contenido largo.
 *   (Renderiza `<p>` por defecto).
 * - `label`: Texto pequeño y utilitario usado para botones, leyendas y elementos
 *   de formulario. (Renderiza `<label>` por defecto).
 *
 * Cada categoría soporta tres tamaños: `large`, `medium` y `small`.
 *
 * **Etiquetas Semánticas:**
 * El componente selecciona automáticamente una etiqueta semántica HTML apropiada basada en
 * la variante. Puedes sobrescribir esto explícitamente configurando el atributo `as`
 * (ej., para renderizar un estilo `headline` pero usando una etiqueta `<span>` por razones
 * de SEO o estructurales).
 *
 * @element moni-typography
 *
 * @example
 * ```html
 * <!-- Renderiza un <h1> con estilos display-large -->
 * <moni-typography variant="display" size="large">Texto Héroe</moni-typography>
 *
 * <!-- Renderiza un <p> con estilos body-medium -->
 * <moni-typography variant="body">Texto de párrafo estándar.</moni-typography>
 *
 * <!-- Sobrescribiendo la etiqueta semántica -->
 * <moni-typography variant="title" as="span">Título en línea</moni-typography>
 * ```
 *
 * @slot default - El contenido de texto a mostrar.
 * @csspart text - El elemento semántico interno (ej., h1, p, span) que envuelve el texto.
 */
@customElement('moni-typography')
export class MoniTypography extends MoniElement {
	/**
	 * La categoría de la escala tipográfica M3 a aplicar.
	 * Dicta la lógica base de font-family, line-height, weight, y letter-spacing.
	 * @type {'display' | 'headline' | 'title' | 'body' | 'label'}
	 */
	@property({ reflect: true })
	variant: 'display' | 'headline' | 'title' | 'body' | 'label' = 'body';

	/**
	 * El tamaño dentro de la categoría de variante elegida.
	 * @type {'large' | 'medium' | 'small'}
	 */
	@property({ reflect: true })
	size: 'large' | 'medium' | 'small' = 'medium';

	/**
	 * Sobrescribe la etiqueta semántica HTML por defecto (ej. 'h1', 'p', 'span') 
	 * que se asigna automáticamente basándose en la variante (`variant`).
	 * @type {string | null}
	 */
	@property({ reflect: true })
	as: string | null = null;

	/**
	 * Contenido de texto simple opcional. Típicamente usarías el slot por defecto en su lugar.
	 * @type {string}
	 */
	@property({ reflect: true }) text = '';

	/** Etiqueta semántica por defecto para cada variante según la especificación M3. */
	private static _tagFor(
		variant: 'display' | 'headline' | 'title' | 'body' | 'label'
	): string {
		switch (variant) {
			case 'display':
				return 'h1';
			case 'headline':
				return 'h2';
			case 'title':
				return 'h3';
			case 'body':
				return 'p';
			case 'label':
				return 'label';
		}
	}

	/**
	 * Renderiza el elemento tipográfico con una etiqueta HTML seleccionada dinámicamente.
	 *
	 * **Selección dinámica de etiquetas:**
	 * `_tagFor(variant)` infiere el elemento HTML semántico de la variante de tipografía
	 * (ej. `'display-large'` → `<h1>`, `'body-medium'` → `<p>`).
	 * El atributo `as` sobrescribe esta inferencia para contextos semánticos personalizados
	 * (ej. usar `as="div"` cuando la tipografía está dentro de un `<dl>`).
	 *
	 * **¿Por qué `staticHtml` + `unsafeStatic`?**
	 * Lit 3 no permite expresiones dinámicas en posiciones de nombres de etiquetas
	 * (`<${tag}>` lanzaría un error de plantilla). `staticHtml` es un template tag
	 * provisto por Lit que sí permite la interpolación estática de etiquetas, y `unsafeStatic`
	 * envuelve el string para marcarlo como de confianza (sin riesgo XSS ya que `tag` proviene de
	 * un enum controlado vía `_tagFor()`).
	 *
	 * El string `cls` (`variant + size`) mapea directamente a clases de utilidad
	 * de tipografía (ej. `'display large'`).
	 */
	override render() {
		const cls = `${this.variant} ${this.size}`;
		const tag = this.as ?? MoniTypography._tagFor(this.variant);
		// Renderiza la etiqueta dinámica con `unsafeStatic` para evitar el error
		// "Bindings in tag names are not supported" de lit 3.
		const tagStatic = unsafeStatic(tag);
		return staticHtml`<${tagStatic}
			class=${cls}
			part="text"
		>
			<slot>${this.text || nothing}</slot>
		</${tagStatic}>`;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				color: inherit;
				margin: 0;
				padding: 0;
			}
			:host([variant='label']) {
				display: inline-block;
			}

			/* ─── M3 Display (largest) ─── */
			.display.large {
				font-size: 3.5625rem;
				line-height: 4rem;
				font-weight: 400;
				letter-spacing: -0.015625em;
			}
			.display.medium {
				font-size: 2.8125rem;
				line-height: 3.25rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.display.small {
				font-size: 2.25rem;
				line-height: 2.75rem;
				font-weight: 400;
				letter-spacing: 0;
			}

			/* ─── M3 Headline ─── */
			.headline.large {
				font-size: 2rem;
				line-height: 2.5rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.headline.medium {
				font-size: 1.75rem;
				line-height: 2.25rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.headline.small {
				font-size: 1.5rem;
				line-height: 2rem;
				font-weight: 400;
				letter-spacing: 0;
			}

			/* ─── M3 Title ─── */
			.title.large {
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.title.medium {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 500;
				letter-spacing: 0.009375em;
			}
			.title.small {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.00714em;
			}

			/* ─── M3 Body ─── */
			.body.large {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 400;
				letter-spacing: 0.03125em;
			}
			.body.medium {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.01786em;
			}
			.body.small {
				font-size: 0.75rem;
				line-height: 1rem;
				font-weight: 400;
				letter-spacing: 0.03333em;
			}

			/* ─── M3 Label ─── */
			.label.large {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.00714em;
			}
			.label.medium {
				font-size: 0.75rem;
				line-height: 1rem;
				font-weight: 500;
				letter-spacing: 0.04545em;
			}
			.label.small {
				font-size: 0.6875rem;
				line-height: 1rem;
				font-weight: 500;
				letter-spacing: 0.04545em;
			}
		`
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-typography': MoniTypography;
	}
}

export default MoniTypography;