/**
 * @file components/moni-segmented-button.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { MoniButtonSegment } from './moni-button-segment.js';

/**
 * Componente Material Design 3 Segmented Button (Botón Segmentado) (Heredado).
 *
 * Un grupo de botones segmentados seleccionables asociado a formularios.
 *
 * **Aviso de obsolescencia (Deprecation Notice):** La especificación M3 (`m3-docs/components/segmented-buttons/overview.md`)
 * ha actualizado el patrón de botones segmentados. Los segmentos a medida han sido
 * reemplazados por elementos estándar `<moni-button>` agrupados dentro de un
 * `<moni-button-group variant="connected">`.
 *
 * Este componente sigue funcionando para mantener la compatibilidad con versiones anteriores, pero será
 * eliminado en la v1.0. Se registra una advertencia de obsolescencia en la consola cuando el
 * elemento se conecta al DOM.
 *
 * @deprecated Usa `<moni-button-group variant="connected">` en su lugar.
 *
 * @example
 * ```html
 * <!-- Uso heredado (no recomendado) -->
 * <moni-segmented-button name="view" multi>
 *   <moni-button-segment value="day">Día</moni-button-segment>
 *   <moni-button-segment value="week">Semana</moni-button-segment>
 * </moni-segmented-button>
 *
 * <!-- Equivalente M3 moderno -->
 * <moni-button-group variant="connected">
 *   <moni-button>Día</moni-button>
 *   <moni-button>Semana</moni-button>
 * </moni-button-group>
 * ```
 *
 * @slot default - elementos `<moni-button-segment>`.
 */
@customElement('moni-segmented-button')
export class MoniSegmentedButton extends MoniElement {
	static formAssociated = true;

	private static _deprecationWarned = false;

	/**
	 * Nombre del botón segmentado, usado para el envío del formulario.
	 * @type {string}
	 */
	@property({ reflect: true })
	name = '';

	/**
	 * Permite seleccionar múltiples segmentos simultáneamente.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true })
	multi = false;

	/**
	 * Tamaño de los segmentos del botón.
	 * @type {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	/**
	 * Oculta el icono de marca de verificación principal (leading checkmark) cuando se selecciona un segmento.
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true, attribute: 'hide-check' })
	hideCheck = false;

	/**
	 * Define un espaciado personalizado entre segmentos.
	 * @type {string}
	 */
	@property()
	gap = '';

	@queryAssignedElements({ flatten: true })
	private slottedSegments!: HTMLElement[];

	private internals: ElementInternals;

	/**
	 * Constructor del componente.
	 * Inicializa ElementInternals (`attachInternals`) para integrar el custom element
	 * nativamente en formularios HTML, permitiéndole participar en validaciones y envíos de datos.
	 */
	constructor() {
		super();
		this.internals = this.attachInternals();
	}

	override connectedCallback(): void {
		super.connectedCallback();
		// Log a deprecation warning once per page to avoid console spam when
		// many segmented buttons are instantiated.
		if (!MoniSegmentedButton._deprecationWarned) {
			MoniSegmentedButton._deprecationWarned = true;
			console.warn(
				'[moni-ui] <moni-segmented-button> is deprecated since v0.3.0. ' +
					'Material Design 3 Expressive no longer recommends segmented buttons. ' +
					'Use <moni-button-group variant="connected"> instead. ' +
					'See m3-docs/components/segmented-buttons/overview.md § M3 Expressive update.'
			);
		}
	}

	/**
	 * Expone el formulario anfitrión al que pertenece este componente,
	 * derivado de la API de ElementInternals.
	 */
	get form() {
		return this.internals.form;
	}

	/**
	 * Define el tipo semántico del control de formulario.
	 */
	get type() {
		return 'segmented-button';
	}

	get value(): string {
		const selected = this.segments
			.filter((s) => s.checked)
			.map((s) => s.value);
		return this.multi ? selected.join(',') : (selected[0] || '');
	}

	private get segments(): MoniButtonSegment[] {
		return this.slottedSegments.filter(
			(el): el is MoniButtonSegment => el.tagName.toLowerCase() === 'moni-button-segment'
		);
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.group {
				display: inline-flex;
				align-items: center;
				position: relative;
				width: 100%;
			}

			::slotted(moni-button-segment) {
				flex: 1;
			}
		`
	];

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Enlaza propiedades estructurales (como el gap o la visibilidad de los checks)
	 * desde el contenedor padre hacia los segmentos hijos y comunica el nuevo valor
	 * consolidado al formulario subyacente cada vez que el estado cambia.
	 */
	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('hideCheck') || changedProperties.has('size') || changedProperties.has('gap')) {
			this.updateChildren();
		}
		this.updateFormValue();
	}

	/**
	 * Manejador del Slot Change.
	 * Re-evalúa jerárquicamente a los hijos proyectados si el DOM muta, 
	 * reactualizando su topología visual (`border-radius`) y su valor en el form.
	 */
	private handleSlotChange() {
		this.updateChildren();
		this.updateFormValue();
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
	 * Patrón "Top-Down" para inyectar configuración visual y de posición a los segmentos hijos.
	 * Dado que CSS no puede pasar atributos reactivos fácilmente a hijos proyectados (<slot>),
	 * JS itera los hijos y les asigna si son 'first', 'middle' o 'last' para manejar
	 * el `border-radius` continuo.
	 */
	private updateChildren() {
		const segments = this.segments;
		const len = segments.length;

		segments.forEach((seg, index) => {
			seg.hideCheck = this.hideCheck;
			seg.size = this.size;

			if (len === 1) {
				seg.position = 'solo';
			} else if (index === 0) {
				seg.position = 'first';
			} else if (index === len - 1) {
				seg.position = 'last';
			} else {
				seg.position = 'middle';
			}
		});
	}

	/**
	 * Sincroniza el valor interno del componente (`this.value`) con
	 * la estructura nativa del formulario utilizando la API de `ElementInternals.setFormValue`.
	 * Permite que los datos viajen de forma natural al hacer submit.
	 */
	private updateFormValue() {
		if (typeof this.internals.setFormValue === 'function') {
			this.internals.setFormValue(this.value);
		}
	}

	/**
	 * Delegación de eventos (Event Delegation) capturando el click en el contenedor padre.
	 * Maneja la lógica de exclusión mutua (single selection) estilo Radio Button
	 * o la selección aditiva estilo Checkbox cuando `multi` es true.
	 */
	private handleClick(e: Event) {
		const target = e.target as HTMLElement;
		const clickedSegment = target.closest('moni-button-segment') as MoniButtonSegment | null;

		if (!clickedSegment || clickedSegment.disabled) {
			return;
		}

		const segments = this.segments;

		if (this.multi) {
			// Toggle independiente
			clickedSegment.checked = !clickedSegment.checked;
		} else {
			// Comportamiento de grupo radio: deseleccionar hermanos
			segments.forEach((seg) => {
				if (seg === clickedSegment) {
					seg.checked = !seg.checked; // Permite toggle off incluso en single mode (comportamiento M3)
				} else {
					seg.checked = false;
				}
			});
		}

		this.updateFormValue();

		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: {
					value: this.value,
					segment: clickedSegment,
					checked: clickedSegment.checked
				}
			})
		);
	}

	/**
	 * Renderiza el contenedor del botón segmentado con un `role="group"` y su superposición de indicador GSAP.
	 *
	 * **Indicador deslizante:**
	 * Un `<div>` `.indicator` se posiciona de forma absoluta dentro del contenedor del grupo.
	 * GSAP anima su `left` y `width` para deslizarse de un segmento a otro
	 * cuando la selección cambia (resaltado del segmento seleccionado del Segmented Button M3).
	 * En el primer renderizado, el indicador se posiciona instantáneamente (sin transición); los cambios
	 * posteriores usan `gsap.to()` con la curva de animación (easing) `_speed2` para un deslizamiento suave.
	 *
	 * **Sincronización `@slotchange`:**
	 * Cuando los segmentos se agregan/eliminan en tiempo de ejecución, `_syncSegments()` vuelve a leer
	 * los elementos asignados a la ranura (slot) y actualiza los atributos `first` / `last` de cada segmento
	 * para controlar el border-radius en los segmentos terminales.
	 */
	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-segment-gap: 0px;`
			: '';
		return html`
			<div class="group" style=${inlineStyles} part="group" @click=${this.handleClick}>
				<slot @slotchange=${this.handleSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-segmented-button': MoniSegmentedButton;
	}
}

export default MoniSegmentedButton;
