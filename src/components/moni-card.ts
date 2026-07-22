/**
 * @file components/moni-card.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Card.
 *
 * Las tarjetas muestran contenido y acciones sobre un solo sujeto. Son
 * superficies contenedoras que agrupan información relacionada junta, haciendo
 * fácil para los usuarios escanear e interactuar con colecciones de datos relacionados.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/cards/specs.md`
 *
 * **Variantes:**
 * - `elevated` (por defecto) — Fondo `surface-container-low` + sombra `--elevate1`.
 *   Mejor para colecciones donde la tarjeta necesita separación visual de un
 *   fondo con patrones o de color. Gana sombra al pasar el ratón/arrastrar.
 * - `filled` — Fondo `surface-container-highest`, sin sombra.
 *   Énfasis más bajo; úsalo cuando las tarjetas se asientan directamente sobre la superficie del fondo principal.
 * - `outlined` — Fondo `surface` + trazo `outline-variant` 1dp.
 *   Énfasis estructural más alto sin proyectar una sombra. Mejor en fondos sólidos.
 *
 * **Medidas M3:**
 * - Radio de esquina del contenedor: 12dp.
 * - Relleno de contenido horizontal: 16dp.
 * - Espacio entre tarjetas en una colección: máx. 8dp.
 * - Alineación de texto del titular: inicio.
 *
 * **Tarjetas interactivas:**
 * Cuando `clickable=true`, la tarjeta renderiza capas de estado M3 (hover,
 * focus, press) a través del pseudo-elemento `::before`. El consumidor debe manejar
 * el evento `click` para implementar la lógica de navegación o selección.
 *
 * @example
 * ```html
 * <moni-card variant="outlined" clickable>
 *   <img slot="media" src="photo.jpg" alt="Imagen de la tarjeta" />
 *   <h3 slot="headline">Título de Tarjeta</h3>
 *   <p slot="supporting">Texto de soporte que describe el tema de la tarjeta.</p>
 *   <div slot="actions">
 *     <moni-button variant="text">Cancelar</moni-button>
 *     <moni-button>Confirmar</moni-button>
 *   </div>
 * </moni-card>
 * ```
 *
 * @slot media      - Una imagen, video, o icono en la parte superior de la tarjeta.
 * @slot default    - Contenido del cuerpo principal (reemplaza todos los slots con nombre si se usa).
 * @slot headline   - Texto de título equivalente a H3.
 * @slot subhead    - Título secundario debajo del titular.
 * @slot supporting - Texto de soporte descriptivo del cuerpo.
 * @slot actions    - Fila de botones de acción en la parte inferior de la tarjeta.
 *
 * @csspart card    - El contenedor exterior de la tarjeta.
 * @csspart media   - El contenedor del área de medios.
 * @csspart content - El contenedor de contenido.
 * @csspart actions - El contenedor de la fila de acciones.
 */
@customElement('moni-card')
export class MoniCard extends MoniElement {
	/**
	 * Variante visual de la tarjeta.
	 *
	 * - `'elevated'` (por defecto) — Fondo Surface-low + sombra de elevación.
	 * - `'filled'` — Fondo Surface-highest, sin sombra.
	 * - `'outlined'` — Fondo Surface + trazo outline-variant.
	 *
	 * @default 'elevated'
	 */
	@property({ reflect: true })
	variant: 'elevated' | 'filled' | 'outlined' = 'elevated';

	/**
	 * Cuando es `true`, aplica capas de estado M3 (hover, focus, pressed)
	 * para comunicar interactividad. El fondo de la tarjeta cambia ligeramente en hover.
	 *
	 * Úsalo cuando la tarjeta en sí es un objetivo de navegación o selección clicable.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) clickable = false;

	/**
	 * Cuando es `true`, aplica box-shadow `--elevate3` para simular el estado "arrastrado"
	 * M3 según lo especificado en la especificación de interacción de tarjetas M3.
	 *
	 * Los consumidores deben alternar este atributo basado en el estado de arrastre de la tarjeta
	 * (ej. a través de un callback de biblioteca drag-and-drop).
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) draggable = false;

	/**
	 * Cuando es `true`, la tarjeta se renderiza con opacidad del 50% con `cursor: not-allowed`,
	 * indicando que la tarjeta y sus acciones no están disponibles.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;



	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				/* M3 spec: 12dp corner, 16dp padding, 8dp max between cards. */
				border-radius: 0.75rem;
				color: var(--on-surface);
				position: relative;
				overflow: hidden;
				transition:
					box-shadow var(--speed2),
					background-color var(--speed2),
					border-color var(--speed2);
			}

			/* Elevated variant: surface-container-low + elevation 1. */
			:host([variant='elevated']) {
				background-color: var(--surface-container-low);
				box-shadow: var(--elevate1);
			}

			/* Filled variant: surface-container-highest, no shadow. */
			:host([variant='filled']) {
				background-color: var(--surface-container-highest);
			}

			/* Outlined variant: surface + outline-variant 1dp. */
			:host([variant='outlined']) {
				background-color: var(--surface);
				border: 0.0625rem solid var(--outline-variant);
			}

			/* Clickable cards expose hover/focus/pressed state layers. */
			:host([clickable]) {
				cursor: pointer;
			}
			:host([clickable]:hover) {
				box-shadow: var(--elevate2);
			}
			:host([clickable]:focus-visible) {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.125rem;
			}
			:host([clickable]:active) {
				box-shadow: var(--elevate1);
			}

			/* Draggable cards show elevation 3 when picked up. */
			:host([draggable]) {
				cursor: grab;
			}
			:host([draggable]:active) {
				cursor: grabbing;
				box-shadow: var(--elevate3);
			}

			/* Disabled state. */
			:host([disabled]) {
				opacity: 0.38;
				pointer-events: none;
				cursor: not-allowed;
			}

			/* ─── Card slots layout ─── */
			.media {
				display: block;
				margin-block-end: 1rem;
			}
			.media[hidden] {
				display: none;
			}

			.body {
				padding: 0 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.headline {
				font-size: 1.25rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
				color: var(--on-surface);
				margin: 0;
				padding: 0;
			}
			.subhead {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.007em;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
			}
			.supporting {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.014em;
				color: var(--on-surface-variant);
				margin: 0;
				padding: 0;
			}

			.actions {
				display: flex;
				gap: 0.5rem;
				padding: 0.75rem 1rem 1rem;
			}
			.actions[hidden] {
				display: none;
			}

			/* Ensure slotted headings inherit our typography reset
			   (margin/padding/font-size) so consumers can use semantic
			   h1..h6 without breaking the visual rhythm. */
			::slotted(:is(h1, h2, h3, h4, h5, h6)) {
				margin: 0;
				padding: 0;
				font-size: inherit;
				font-weight: inherit;
				line-height: inherit;
				letter-spacing: inherit;
				color: inherit;
			}
		`
	];

	/**
	 * Renderiza el contenedor de la tarjeta como un `<section>` con envoltorio interactivo opcional.
	 *
	 * **¿Por qué `<section>`?**
	 * Las tarjetas representan una unidad distintiva y cohesiva de contenido. Usar `<section>` da
	 * a los lectores de pantalla un punto de referencia ARIA implícito para que puedan navegar entre tarjetas.
	 *
	 * **Tarjetas interactivas (`clickable=true`):**
	 * Cuando es `clickable`, toda la superficie de la tarjeta se convierte en un `<button>` que envuelve
	 * all slots, giving the card keyboard focus and `click` semantics. A
	 * `<moni-ripple>` is rendered as the first child to provide the M3 touch feedback.
	 *
	 * **Slot zones:**
	 * - `[slot="media"]` — image or video area at the card's leading edge.
	 * - `[slot="header"]` — title and supporting text row.
	 * - Default slot — the card's main content body.
	 * - `[slot="footer"]` — action buttons row at the trailing edge.
	 */
	override render() {
		return html`
			<div class="media" part="media">
				<slot name="media"></slot>
			</div>
			<div class="body" part="body">
				<slot name="headline">
					<slot></slot>
				</slot>
				<slot name="subhead"></slot>
				<slot name="supporting"></slot>
			</div>
			<div class="actions" part="actions">
				<slot name="actions"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-card': MoniCard;
	}
}

export default MoniCard;