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
	private readonly _activeObserver = new MutationObserver(() => this.updateSelectionNeighbors());

	override connectedCallback() {
		super.connectedCallback();
		this._activeObserver.observe(this, { subtree: true, attributes: true, attributeFilter: ['active'] });
	}

	override disconnectedCallback() {
		this._activeObserver.disconnect();
		super.disconnectedCallback();
	}
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
	size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'extra' = 'small';

	/**
	 * Permite que múltiples botones estén activos a la vez (solo aplica a grupos seleccionables).
	 * @type {boolean}
	 */
	@property({ type: Boolean, reflect: true })
	multi = false;

	/** Impide que el grupo quede sin selección. */
	@property({ type: Boolean, reflect: true, attribute: 'selection-required' })
	selectionRequired = false;

	/** Forma base común de los botones. La selección invierte round ↔ square. */
	@property({ reflect: true })
	shape: 'round' | 'square' = 'round';

	/** Controla si los botones conservan su ancho intrínseco o llenan la superficie. */
	@property({ reflect: true })
	resizing: 'fixed' | 'flexible' = 'fixed';

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
				max-inline-size: 100%;
			}
			:host([variant='connected']),
			:host([resizing='flexible']) {
				inline-size: 100%;
			}

			.group-container {
				display: inline-flex;
				align-items: center;
				width: 100%;
				flex-wrap: nowrap;
			}

			slot {
				display: contents;
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
			:host([variant='connected']) ::slotted(moni-button),
			:host([variant='connected']) ::slotted(moni-icon-button),
			:host([resizing='flexible']) ::slotted(moni-button) {
				flex: var(--_moni-group-flex-grow, 1) 1 0;
				transition: flex-grow 450ms cubic-bezier(0.2, 0, 0, 1);
			}
			:host([variant='connected']) ::slotted(moni-button),
			:host([variant='standard'][resizing='flexible']) ::slotted(moni-button) {
				--moni-button-inline-size: 100%;
				min-inline-size: 0;
			}
			:host([variant='connected'][size='xsmall']) ::slotted(moni-button),
			:host([variant='connected'][size='xsmall']) ::slotted(moni-icon-button),
			:host([variant='connected'][size='small']) ::slotted(moni-button),
			:host([variant='connected'][size='small']) ::slotted(moni-icon-button) {
				min-inline-size: 3rem;
			}

			/* M3 Expressive selection emphasis. Increasing the button's internal
			 * space (instead of scaling the host) keeps labels and icons crisp and
			 * lets the existing padding transition transfer width smoothly. */
			:host([variant='standard'][size='xsmall']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='xsmall']) ::slotted(moni-button[data-group-pressed]) {
				--moni-button-padding: 0 1.25rem;
			}
			:host([variant='standard'][size='small']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='small']) ::slotted(moni-button[data-group-pressed]) {
				--moni-button-padding: 0 1.75rem;
			}
			:host([variant='standard'][size='medium']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='medium']) ::slotted(moni-button[data-group-pressed]) {
				--moni-button-padding: 0 2.375rem;
			}
			:host([variant='standard'][size='large']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='large']) ::slotted(moni-button[data-group-pressed]) {
				--moni-button-padding: 0 4rem;
			}
			:host([variant='standard'][size='xlarge']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='extra']) ::slotted(moni-button[active]),
			:host([variant='standard'][size='xlarge']) ::slotted(moni-button[data-group-pressed]),
			:host([variant='standard'][size='extra']) ::slotted(moni-button[data-group-pressed]) {
				--moni-button-padding: 0 5.25rem;
			}

			:host([variant='standard'][size='xsmall']) ::slotted(moni-button[data-group-adjacent-pressed]) { --moni-button-padding: 0 .5rem; }
			:host([variant='standard'][size='small']) ::slotted(moni-button[data-group-adjacent-pressed]) { --moni-button-padding: 0 .75rem; }
			:host([variant='standard'][size='medium']) ::slotted(moni-button[data-group-adjacent-pressed]) { --moni-button-padding: 0 1.25rem; }
			:host([variant='standard'][size='large']) ::slotted(moni-button[data-group-adjacent-pressed]) { --moni-button-padding: 0 2.75rem; }
			:host([variant='standard'][size='xlarge']) ::slotted(moni-button[data-group-adjacent-pressed]),
			:host([variant='standard'][size='extra']) ::slotted(moni-button[data-group-adjacent-pressed]) { --moni-button-padding: 0 3.75rem; }

			/* A selected standard button borrows space from its immediate
			 * neighbours, keeping the group's outside footprint stable. */
			:host([variant='standard'][size='xsmall']) ::slotted(moni-button[data-group-adjacent-selected='shared']) { --moni-button-padding: 0 .5rem; }
			:host([variant='standard'][size='xsmall']) ::slotted(moni-button[data-group-adjacent-selected='sole']) { --moni-button-padding: 0 .25rem; }
			:host([variant='standard'][size='small']) ::slotted(moni-button[data-group-adjacent-selected='shared']) { --moni-button-padding: 0 .625rem; }
			:host([variant='standard'][size='small']) ::slotted(moni-button[data-group-adjacent-selected='sole']) { --moni-button-padding: 0 .25rem; }
			:host([variant='standard'][size='medium']) ::slotted(moni-button[data-group-adjacent-selected='shared']) { --moni-button-padding: 0 1.0625rem; }
			:host([variant='standard'][size='medium']) ::slotted(moni-button[data-group-adjacent-selected='sole']) { --moni-button-padding: 0 .625rem; }
			:host([variant='standard'][size='large']) ::slotted(moni-button[data-group-adjacent-selected='shared']) { --moni-button-padding: 0 2.5rem; }
			:host([variant='standard'][size='large']) ::slotted(moni-button[data-group-adjacent-selected='sole']) { --moni-button-padding: 0 2rem; }
			:host([variant='standard'][size='xlarge']) ::slotted(moni-button[data-group-adjacent-selected='shared']),
			:host([variant='standard'][size='extra']) ::slotted(moni-button[data-group-adjacent-selected='shared']) { --moni-button-padding: 0 3.375rem; }
			:host([variant='standard'][size='xlarge']) ::slotted(moni-button[data-group-adjacent-selected='sole']),
			:host([variant='standard'][size='extra']) ::slotted(moni-button[data-group-adjacent-selected='sole']) { --moni-button-padding: 0 2.75rem; }
		`
	];

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Detecta alteraciones estructurales en el propio grupo (como `variant`, `size` o `gap`)
	 * y fuerza una re-sincronización de todos los botones hijos para aplicar las físicas CSS.
	 */
	protected override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has('variant') || changedProperties.has('size') || changedProperties.has('gap') || changedProperties.has('shape') || changedProperties.has('resizing')) {
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

	private getButtons() {
		return (this.slottedButtons ?? []).filter(
			(el) => el.tagName.toLowerCase() === 'moni-button' || el.tagName.toLowerCase() === 'moni-icon-button'
		);
	}

	/** Keeps selection emphasis inside the group's original visual footprint.
	 * The selected width is funded evenly by every unselected button so edge
	 * selections remain visually balanced instead of collapsing one neighbour. */
	private updateSelectionNeighbors() {
		const buttons = this.getButtons();
		buttons.forEach((button) => {
			button.removeAttribute('data-group-adjacent-selected');
			button.style.removeProperty('--_moni-group-flex-grow');
		});
		if (this.variant !== 'standard') return;

		const selected = buttons.filter((button) => button.hasAttribute('active'));
		if (selected.length === 0) return;
		const unselected = buttons.filter((button) => !button.hasAttribute('active'));
		const weight = unselected.length === 1 ? 'sole' : 'shared';
		unselected.forEach((button) => button.setAttribute('data-group-adjacent-selected', weight));

		if (this.resizing === 'flexible' && unselected.length > 0) {
			const activeWeight = 1.24;
			const inactiveWeight = Math.max(
				0.6,
				(buttons.length - selected.length * activeWeight) / unselected.length
			);
			selected.forEach((button) => button.style.setProperty('--_moni-group-flex-grow', String(activeWeight)));
			unselected.forEach((button) => button.style.setProperty('--_moni-group-flex-grow', String(inactiveWeight)));
		}
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
		const buttons = this.getButtons();

		const normalizedGap = this.gap.trim().toLowerCase();
		const hasConnectedGap = !['0', '0px', '0rem', '0em'].includes(normalizedGap);

		buttons.forEach((btn, index) => {
			// Propagate size
			btn.setAttribute('size', this.size);

			// Propagate shape for connected variant
			if (this.variant === 'connected' && this.shape === 'square') {
				btn.setAttribute('shape', 'square');
			} else if (this.variant === 'connected') {
				if (hasConnectedGap) {
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
				btn.setAttribute('shape', this.shape);
			}
		});
		this.updateSelectionNeighbors();
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

		const buttons = this.getButtons();
		const index = buttons.indexOf(button);
		if (index === -1) return;

		button.setAttribute('data-group-pressed', '');
		buttons[index - 1]?.setAttribute('data-group-adjacent-pressed', '');
		buttons[index + 1]?.setAttribute('data-group-adjacent-pressed', '');
	}

	/**
	 * Conclusión de la interacción táctil (Pointer Up).
	 * Restaura todas las transformaciones elásticas aplicadas a los botones adyacentes
	 * a su estado nativo neutro.
	 */
	private handlePointerUp() {
		const buttons = this.getButtons();
		buttons.forEach((btn) => {
			btn.removeAttribute('data-group-pressed');
			btn.removeAttribute('data-group-adjacent-pressed');
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

		const buttons = this.getButtons();

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
		const activeCount = buttons.filter((btn) => btn.hasAttribute('active')).length;
		if (wasActive && this.selectionRequired && activeCount <= 1) return;
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
		const normalizedGap = this.gap.trim().toLowerCase();
		const isConnected = ['0', '0px', '0rem', '0em'].includes(normalizedGap);
		const inlineStyles = resolvedGap ? `gap: ${resolvedGap};` : isConnected ? 'gap: 0;' : '';
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
