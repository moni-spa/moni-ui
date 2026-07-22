/**
 * @file components/moni-button-group.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Button Group.
 *
 * Organiza múltiples componentes `<moni-button>` o `<moni-icon-button>`
 * en una sola fila.
 *
 * **Variantes:**
 * - `standard` (por defecto) — Una fila flex simple con un espacio entre botones.
 * - `connected` — El reemplazo de M3 Expressive para los botones segmentados. En este
 *   modo, los botones comparten bordes y forman una sola forma de píldora continua. El
 *   grupo gestiona el estado de selección única/múltiple de sus hijos.
 *
 * **Detalles de la variante `connected`:**
 * - **Propagación de forma:** El grupo propaga automáticamente las clases de forma M3
 *   (`left-round-flat`, `no-round`, `right-round-flat`) a sus hijos para
 *   que se entrelacen sin problemas.
 * - **Gestión del interruptor:** El grupo escucha los clics de los hijos y cambia sus
 *   atributos `active`. Cuando `multi=false` (por defecto), solo un botón puede estar
 *   activo a la vez (comportamiento de radio button). Cuando `multi=true`, múltiples botones
 *   pueden estar activos (comportamiento de checkbox).
 * - **Propagación de eventos:** Dispara un evento `'change'` cuando la selección cambia.
 *
 * **Accesibilidad:**
 * - Renderiza con `role="group"` (puede ser sobrescrito a `toolbar` o `radiogroup`).
 * - Los consumidores deben proporcionar un atributo `aria-label` o `aria-labelledby`
 *   para identificar el propósito del grupo para las tecnologías de asistencia.
 *
 * @fires change - Disparado cuando se hace clic en un botón en modo `connected` y el
 *                 estado de selección se actualiza.
 *
 * @example
 * ```html
 * <!-- Grupo conectado de selección única -->
 * <moni-button-group variant="connected" label="Alineación">
 *   <moni-button icon="format_align_left" active></moni-button>
 *   <moni-button icon="format_align_center"></moni-button>
 *   <moni-button icon="format_align_right"></moni-button>
 * </moni-button-group>
 *
 * <!-- Fila estándar de botones -->
 * <moni-button-group gap="1rem">
 *   <moni-button variant="text">Cancelar</moni-button>
 *   <moni-button>Guardar</moni-button>
 * </moni-button-group>
 * ```
 *
 * @slot default - Los elementos `<moni-button>` que conforman el grupo.
 */
@customElement('moni-button-group')
export class MoniButtonGroup extends MoniElement {
	/**
	 * Variante visual del grupo de botones.
	 * - `standard`: Los elementos se espacian normalmente.
	 * - `connected`: Los elementos se unen con bordes colapsados y radios internos aplanados.
	 * @type {'standard' | 'connected'}
	 * @default 'standard'
	 */
	@property({ reflect: true })
	variant: 'standard' | 'connected' = 'standard';

	/**
	 * Tamaño de los botones en el grupo. Si se especifica, se propaga hacia abajo a los hijos.
	 * @type {'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra'}
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'medium';

	/**
	 * Permite que múltiples botones estén activos a la vez (solo aplica a grupos seleccionables).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true })
	multi = false;

	/**
	 * Espacio CSS personalizado entre botones (ej., '1rem').
	 * Solo se aplica cuando la variante es 'standard'.
	 * @type {string}
	 */
	@property()
	gap = '';

	/**
	 * Rol ARIA del contenedor del grupo.
	 * @type {'group' | 'toolbar' | 'radiogroup'}
	 * @default 'group'
	 */
	@property({ reflect: true })
	role: 'group' | 'toolbar' | 'radiogroup' = 'group';

	/**
	 * Una etiqueta accesible para el grupo (`aria-label`).
	 * @type {string}
	 */
	@property({ reflect: true })
	label = '';

	/**
	 * ID de un elemento que etiqueta este grupo (`aria-labelledby`).
	 * @type {string}
	 */
	@property({ reflect: true, attribute: 'labelled-by' })
	labelledBy = '';

	@queryAssignedElements({ flatten: true })
	private slottedButtons!: HTMLElement[];

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				align-items: center;
				vertical-align: middle;
			}

			.group-container {
				display: inline-flex;
				align-items: center;
				width: 100%;
			}

			:host([variant='standard']) .group-container {
				gap: 0.5rem;
			}
			:host([variant='standard'][size='xsmall']) .group-container {
				gap: 1.125rem; /* 18dp */
			}
			:host([variant='standard'][size='small']) .group-container {
				gap: 0.75rem; /* 12dp */
			}
			:host([variant='standard'][size='medium']) .group-container {
				gap: 0.5rem; /* 8dp */
			}
			:host([variant='standard'][size='large']) .group-container {
				gap: 0.5rem; /* 8dp */
			}
			:host([variant='standard'][size='xlarge']) .group-container,
			:host([variant='standard'][size='extra']) .group-container {
				gap: 0.5rem; /* 8dp */
			}

			:host([variant='connected']) .group-container {
				gap: 0.125rem; /* 2dp */
			}
		`
	];

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Detecta alteraciones estructurales en el propio grupo (como `variant`, `size` o `gap`)
	 * y fuerza una re-sincronización de todos los botones hijos para aplicar las físicas CSS.
	 */
	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('variant') || changedProperties.has('size') || changedProperties.has('gap')) {
			this.updateChildren();
		}
	}

	/**
	 * Manejador del slot interno (`<slot>`).
	 * Cuando el desarrollador inyecta dinámicamente o remueve botones en runtime,
	 * re-sincroniza las formas (shapes) y tamaños de todo el listado.
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
	 * Sincronizador de Propiedades (Engine interno).
	 * Itera sobre cada botón hijo para transferirle jerárquicamente las configuraciones
	 * del grupo. Si el grupo es del tipo `connected` (botones pegados), evalúa matemáticamente 
	 * la posición del índice actual (primero, en medio o último) e inyecta la propiedad `shape`
	 * correspondiente (`left-round-flat`, `inner-round`, etc.) para formar una cápsula unificada.
	 */
	private updateChildren() {
		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		buttons.forEach((btn, index) => {
			// Propagate size
			btn.setAttribute('size', this.size);

			// Propagate shape for connected variant
			if (this.variant === 'connected') {
				if (this.gap) {
					if (buttons.length === 1) {
						btn.setAttribute('shape', 'round');
					} else if (index === 0) {
						btn.setAttribute('shape', 'left-round');
					} else if (index === buttons.length - 1) {
						btn.setAttribute('shape', 'right-round');
					} else {
						btn.setAttribute('shape', 'inner-round');
					}
				} else {
					if (buttons.length === 1) {
						btn.setAttribute('shape', 'round');
					} else if (index === 0) {
						btn.setAttribute('shape', 'left-round-flat');
					} else if (index === buttons.length - 1) {
						btn.setAttribute('shape', 'right-round-flat');
					} else {
						btn.setAttribute('shape', 'no-round');
					}
				}
			} else {
				// Standard variant: buttons retain their own shapes or default round
				const currentShape = btn.getAttribute('shape');
				if (!currentShape || ['left-round-flat', 'right-round-flat', 'no-round', 'left-round', 'right-round', 'inner-round'].includes(currentShape)) {
					btn.setAttribute('shape', 'round');
				}
			}
		});
	}

	/**
	 * Maneja la interacción táctil o de mouse (Pointer Down).
	 * Genera un micro-efecto físico (Squish effect). Cuando el usuario presiona un botón
	 * dentro de un listado estándar, empuja físicamente (`scaleX` / `translateX`) a los
	 * botones adyacentes para simular presión material y desplazamiento.
	 */
	private handlePointerDown(e: PointerEvent) {
		if (this.variant !== 'standard') return;
		const target = e.target as HTMLElement;
		const button = target.closest('moni-button, moni-icon-button') as HTMLElement;
		if (!button || button.hasAttribute('disabled')) return;

		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		const index = buttons.indexOf(button);
		if (index === -1) return;

		const prev = buttons[index - 1];
		const next = buttons[index + 1];

		if (prev) {
			prev.style.transition = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
			prev.style.transform = 'translateX(-6px) scaleX(0.92)';
			prev.style.transformOrigin = 'right center';
		}
		if (next) {
			next.style.transition = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
			next.style.transform = 'translateX(6px) scaleX(0.92)';
			next.style.transformOrigin = 'left center';
		}
	}

	/**
	 * Conclusión de la interacción táctil (Pointer Up).
	 * Restaura todas las transformaciones elásticas aplicadas a los botones adyacentes
	 * a su estado nativo neutro.
	 */
	private handlePointerUp() {
		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
		buttons.forEach((btn) => {
			btn.style.transform = '';
			btn.style.transformOrigin = '';
		});
	}

	/**
	 * Interceptor de clics de delegación.
	 * En grupos de tipo 'segment', garantiza que solo un botón tenga la clase activa 
	 * o el atributo encendido de forma excluyente, actuando como un gestor de radio-buttons.
	 */
	private handleClick(e: Event) {
		const target = e.target as HTMLElement;
		const clickedButton = target.closest('moni-button, moni-icon-button');

		if (!clickedButton || clickedButton.hasAttribute('disabled')) {
			return;
		}

		const buttons = this.slottedButtons.filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);

		if (!this.multi) {
			buttons.forEach((btn) => {
				if (btn !== clickedButton) {
					btn.removeAttribute('active');
					(btn as any).active = false;
				}
			});
		}

		// Toggle clicked button active state
		const wasActive = clickedButton.hasAttribute('active');
		if (wasActive) {
			clickedButton.removeAttribute('active');
			(clickedButton as any).active = false;
		} else {
			clickedButton.setAttribute('active', '');
			(clickedButton as any).active = true;
		}

		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				composed: true,
				detail: {
					button: clickedButton,
					active: !wasActive
				}
			})
		);
	}

	/**
	 * Renders the button group container with `role="group"` semantics.
	 *
	 * The group is a flex container that distributes its slotted `<moni-button>`
	 * or `<moni-button-segment>` children in a row or column (based on `orientation`).
	 * CSS handles the shared-border collapse between adjacent segments:
	 * - Middle segments use `border-radius: 0` and `margin-inline-start: -1px`
	 *   to prevent doubled borders.
	 * - `_syncSegments()` in `firstUpdated()` injects `left-round` / `right-round`
	 *   shape attributes into the first and last children for correct pill termination.
	 */
	override render() {
		const resolvedGap = this.getGapValue(this.gap);
		const inlineStyles = resolvedGap
			? `gap: ${resolvedGap}; --moni-button-group-connected-gap: 0px;`
			: '';
		// M3 connected button group a11y: role="group" by default. Consumers
		// can override via the `role` attribute (e.g. "toolbar" for app
		// actions) and provide an aria-label or aria-labelledby.
		return html`
			<div
				class="group-container"
				style=${inlineStyles}
				part="container"
				role=${this.role}
				aria-label=${this.label || nothing}
				aria-labelledby=${this.labelledBy || nothing}
				@pointerdown=${this.handlePointerDown}
				@pointerup=${this.handlePointerUp}
				@pointercancel=${this.handlePointerUp}
				@pointerleave=${this.handlePointerUp}
			>
				<slot @slotchange=${this.handleSlotChange} @click=${this.handleClick}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-button-group': MoniButtonGroup;
	}
}

export default MoniButtonGroup;
