/**
 * @file components/moni-step.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Step (Paso).
 *
 * Un paso individual dentro de un `<moni-stepper>`. Los pasos muestran el progreso a través
 * de una secuencia de operaciones lógicas y numeradas.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/progress-indicators/specs.md` (Patrón Stepper)
 *
 * **Anatomía y aspecto visual:**
 * Un paso renderiza un indicador circular que contiene ya sea su número de secuencia
 * (inyectado automáticamente por el stepper padre) o un icono personalizado. Debajo o
 * al lado del indicador (dependiendo de la `orientation` del padre), renderiza
 * el `title` (título) y un `description` (descripción) opcional.
 *
 * **Gestión del estado:**
 * El `<moni-stepper>` padre calcula e inyecta automáticamente las propiedades `index`,
 * `active` y `completed` basándose en su estado actual.
 * - **Activo (Active):** Resaltado con el color primario, indicando el paso actual.
 * - **Completado (Completed):** Se muestra con un fondo primario sólido y un icono de
 *   marca de verificación (el estado `completed` anula el índice numérico).
 *
 * @example
 * ```html
 * <!-- Típicamente usado dentro de un stepper -->
 * <moni-stepper current="1">
 *   <moni-step title="Envío" description="Ingresar dirección"></moni-step>
 *   <moni-step title="Pago" description="Detalles de tarjeta de crédito"></moni-step>
 *   <moni-step title="Revisión" description="Confirmar pedido"></moni-step>
 * </moni-stepper>
 *
 * <!-- Anulando el icono -->
 * <moni-step title="Hecho" icon="celebration"></moni-step>
 * ```
 *
 * @csspart step-indicator - La insignia circular que contiene el número/icono.
 * @csspart title          - El texto principal del título.
 * @csspart description    - El texto secundario de la descripción.
 */
@customElement('moni-step')
export class MoniStep extends MoniElement {
	@property({ reflect: true }) title = '';
	@property({ reflect: true }) description = '';
	@property({ type: Boolean, reflect: true }) active = false;
	@property({ type: Boolean, reflect: true }) completed = false;
	@property({ reflect: true }) icon = '';
	@property({ type: Number, reflect: true }) index = 0;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				gap: 0.5rem;
				font-family: var(--font);
				color: var(--on-surface-variant);
				position: relative;
				flex: 1;
			}

			:host(:not(:last-child))::after {
				content: '';
				position: absolute;
				inset-inline-start: calc(50% + 1.25rem);
				inset-inline-end: calc(-50% + 1.25rem);
				inset-block-start: 1rem;
				block-size: 0.0625rem;
				background-color: var(--outline-variant);
				z-index: 0;
			}

			:host-context(moni-stepper[orientation='vertical']) {
				flex-direction: row;
				align-items: flex-start;
				text-align: start;
				gap: 1rem;
				min-block-size: 4rem;
			}

			/* Conector vertical. Geometría: el punto (dot) ocupa y=0 a y=2rem en
			   la parte superior del paso (el host es flex de columna con min-block-size 4rem).
			   El conector va desde la parte INFERIOR del punto actual (y=2rem) hasta
			   la parte INFERIOR del paso actual (y=100%). Esta fórmula se mantiene
			   calibrada independientemente de la altura del paso. */
			:host-context(moni-stepper[orientation='vertical']):host(:not(:last-child))::after {
				position: absolute;
				inset-inline-start: calc(1rem - 0.03125rem);
				inset-block-start: 2rem;
				inset-inline-end: auto;
				inline-size: 0.0625rem;
				block-size: calc(100% - 2rem);
				z-index: 0;
				margin: 0;
				background-color: var(--outline-variant);
			}

			.dot {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 2rem;
				block-size: 2rem;
				border-radius: 50%;
				background-color: var(--surface-container);
				color: var(--on-surface-variant);
				font-size: 0.875rem;
				font-weight: 500;
				flex: none;
				z-index: 1;
			}

			:host([active]) .dot {
				background-color: var(--primary);
				color: var(--on-primary);
			}

			:host([completed]) .dot {
				background-color: var(--primary);
				color: var(--on-primary);
			}

			:host([active]) .text {
				color: var(--on-surface);
			}

			.text {
				display: flex;
				flex-direction: column;
				min-inline-size: 0;
				z-index: 1;
			}
			.title {
				font-size: 0.875rem;
				font-weight: 500;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.description {
				font-size: 0.75rem;
				opacity: 0.7;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`
	];

	/**
	 * Renderiza el indicador del paso y la etiqueta (el conector se hace vía CSS ::after).
	 *
	 * **Indicador de paso (Step indicator):**
	 * - `completed=true` — muestra un icono de marca de verificación.
	 * - `active=true` — muestra el número de paso en un contenedor resaltado (vía CSS).
	 * - De lo contrario — muestra el número de paso en un estilo tenue.
	 *
	 * **Contenido del Slot:**
	 * El slot por defecto permite a los consumidores proyectar contenido personalizado
	 * dentro del cuerpo del paso.
	 */
	override render() {
		const dot = this.completed
			? html`<moni-icon name="check"></moni-icon>`
			: this.icon
				? html`<moni-icon name="${this.icon}"></moni-icon>`
				: html`${this.index + 1}`;
		return html`
			<span class="dot" part="dot">${dot}</span>
			<div class="text" part="text">
				<span class="title" part="title"
					><slot>${this.title}</slot></span
				>
				<span class="description" part="description"
					>${this.description}</span
				>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-step': MoniStep;
	}
}

export default MoniStep;
