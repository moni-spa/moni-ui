/**
 * @file components/moni-split-button.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Split Button (Botón dividido).
 *
 * Un botón dividido combina un botón de acción principal con un botón secundario desplegable.
 * Los dos botones se asientan a ras uno del otro, típicamente compartiendo
 * un color de fondo y elevación, pero separados por un borde distinto.
 *
 * **Arquitectura visual:**
 * El componente actúa como un contenedor de diseño (`display: inline-flex`) que
 * agrupa dos botones estándar. Anula (overrides) los márgenes del botón posterior (trailing)
 * para crear el aspecto "conectado" (similar a los grupos de botones conectados).
 *
 * **Uso:**
 * Los consumidores deben proporcionar exactamente dos botones a través de los slots con nombre:
 * - `slot="leading-button"` — La acción principal (usualmente texto o texto+icono).
 * - `slot="trailing-button"` — La acción secundaria (usualmente solo un icono desplegable).
 *
 * Ambos botones deben ser elementos `<moni-button>` o `<moni-icon-button>` estándar
 * configurados con variantes coincidentes para una apariencia cohesiva.
 *
 * @example
 * ```html
 * <moni-split-button variant="filled">
 *   <moni-button slot="leading-button" icon="send">Enviar</moni-button>
 *   <moni-button slot="trailing-button" icon="arrow_drop_down" id="schedule-trigger"></moni-button>
 * </moni-split-button>
 *
 * <moni-menu id="schedule-menu" placement="bottom">
 *   <moni-menu-item>Programar envío...</moni-menu-item>
 * </moni-menu>
 * ```
 *
 * @slot leading-button  - El botón de acción principal a la izquierda.
 * @slot trailing-button - La acción secundaria (disparador desplegable) a la derecha.
 */
@customElement('moni-split-button')
export class MoniSplitButton extends MoniElement {
	/**
	 * Variante visual del contenedor del botón dividido.
	 * Pasa las sugerencias de estilo apropiadas a sus hijos.
	 * @type {'filled' | 'tonal' | 'outlined' | 'elevated'}
	 * @default 'filled'
	 */
	@property({ reflect: true })
	variant: 'filled' | 'tonal' | 'outlined' | 'elevated' = 'filled';

	/**
	 * Tamaño global aplicado a ambos botones en los slots.
	 * @type {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	/**
	 * El espacio (gap) CSS entre los botones líder y posterior.
	 * Normalmente 1px o 0 según la especificación M3.
	 * @type {string}
	 */
	@property()
	gap = '';

	@queryAssignedElements({ slot: 'leading-button', flatten: true })
	private leadingElements!: HTMLElement[];

	@queryAssignedElements({ slot: 'trailing-button', flatten: true })
	private trailingElements!: HTMLElement[];

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.wrapper {
				display: inline-flex;
				align-items: center;
				gap: 0;
				width: 100%;
			}

			::slotted(*:not(:first-child)) {
				margin-inline-start: var(--moni-button-group-connected-gap, -0.0625rem);
			}
		`
	];

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Responde a cualquier cambio en `variant`, `size` o `gap`
	 * forzando una actualización hacia todos los botones anidados.
	 */
	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('variant') || changedProperties.has('size') || changedProperties.has('gap')) {
			this.updateChildren();
		}
	}

	/**
	 * Manejador del slot change.
	 * Cuando los botones líder o cola se inyectan en el DOM,
	 * propaga las configuraciones físicas.
	 */
	private handleSlotChange() {
		this.updateChildren();
	}

	private getGapValue(gap: string): string {
		if (!gap) return '';
		const preset = gap.toLowerCase();
		if (preset === 'xs' || preset === 'xsmall') return '1.125rem';
		if (preset === 's' || preset === 'small') return '0.75rem';
		if (preset === 'm' || preset === 'medium') return '0.5rem';
		if (preset === 'l' || preset === 'large') return '0.5rem';
		if (preset === 'xl' || preset === 'xlarge') return '0.5rem';
		return gap;
	}

	/**
	 * Sincronizador de Propiedades.
	 * Distingue explícitamente entre el botón primario (leading) y el secundario (trailing)
	 * que usualmente alberga un ícono de dropdown. A cada uno se le inyecta un `shape` 
	 * distinto (`left-round-flat` vs `right-round-flat`) para que juntos formen una cápsula pill uniforme.
	 */
	private updateChildren() {
		const leading = this.leadingElements.find(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		const trailing = this.trailingElements.find(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		const hasGap = !!this.gap;

		if (leading) {
			leading.setAttribute('shape', hasGap ? 'left-round' : 'left-round-flat');
			leading.setAttribute('size', this.size);
			leading.setAttribute('variant', this.variant);
		}

		if (trailing) {
			trailing.setAttribute('shape', hasGap ? 'right-round' : 'right-round-flat');
			trailing.setAttribute('size', this.size);
			trailing.setAttribute('variant', this.variant);
		}
	}

	/**
	 * Renderiza el botón dividido como un control compuesto: botón de acción principal + disparador desplegable.
	 *
	 * **Diseño de dos zonas:**
	 * - Botón principal (zona líder) — la acción principal; lleva el `icon` y
	 *   la etiqueta del slot por defecto. Al hacer clic se dispara el evento principal `click`.
	 * - Disparador desplegable (zona posterior) — un botón de icono secundario (icono `expand_more`)
	 *   que abre el menú desplegable. Ambas zonas comparten el mismo `variant` y `size`.
	 *
	 * **Borde compartido:**
	 * Los dos botones usan los atributos de forma (shape) `left-round` / `right-round` para
	 * crear una sola píldora (pill) conectada con un borde interior compartido.
	 */
	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-group-connected-gap: 0px;`
			: '';
		return html`
			<div class="wrapper" style=${inlineStyles} part="wrapper">
				<slot name="leading-button" @slotchange=${this.handleSlotChange}></slot>
				<slot name="trailing-button" @slotchange=${this.handleSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-split-button': MoniSplitButton;
	}
}

export default MoniSplitButton;
