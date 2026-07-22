/**
 * @file components/moni-dialog.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';

/**
 * Componente Material Design 3 Dialog (Diálogo).
 *
 * Los diálogos informan a los usuarios sobre una tarea y pueden contener información crítica,
 * requerir decisiones o implicar múltiples tareas. Interrumpen el flujo de trabajo del
 * usuario y deben usarse con moderación.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/dialogs/specs.md`
 *
 * **Nota de implementación — elemento nativo `<dialog>`:**
 * Este componente envuelve el elemento HTML nativo `<dialog>`. La apertura y cierre
 * se controlan mediante el atributo `open` (y su propiedad JS). El componente
 * sincroniza los cambios de `open` al `<dialog>` nativo en `updated()`:
 * - `modal=true` → llama a `dialog.showModal()` (bloquea el foco, añade fondo oscuro).
 * - `modal=false` → llama a `dialog.show()` (no bloquea, sin fondo oscuro).
 * - `open=false` → llama a `dialog.close()`.
 *
 * **Colocación (atributo `side`):**
 * - `center` (por defecto) — Centrado en la ventana gráfica. Diálogo M3 estándar.
 * - `top`, `right`, `bottom`, `left` — Paneles anclados a los bordes (patrón side sheet).
 * - `max` — Diálogo a pantalla completa para flujos complejos.
 *
 * @example
 * ```html
 * <!-- Diálogo modal básico -->
 * <moni-dialog open modal title="Eliminar elemento?" size="small">
 *   <p>Esta acción no se puede deshacer.</p>
 *   <div slot="footer">
 *     <moni-button variant="text">Cancelar</moni-button>
 *     <moni-button>Eliminar</moni-button>
 *   </div>
 * </moni-dialog>
 * ```
 *
 * @slot default - El contenido del cuerpo del diálogo.
 * @slot header  - Contenido personalizado del encabezado (sobrescribe el atributo `title`).
 * @slot footer  - Fila de botones de acción en la parte inferior del diálogo.
 *
 * @csspart dialog - El elemento `<dialog>` nativo.
 * @csspart header - El contenedor del encabezado.
 * @csspart body   - El envoltorio del contenido del cuerpo.
 * @csspart footer - El envoltorio de acciones del pie de página.
 */
@customElement('moni-dialog')
export class MoniDialog extends MoniElement {
	/**
	 * Controla el estado abierto/cerrado del diálogo.
	 *
	 * Cuando se establece en `true`, el componente llama a `dialog.showModal()` (si `modal`)
	 * o `dialog.show()`. Cuando se establece en `false`, llama a `dialog.close()`.
	 * Reflejado como un atributo HTML para CSS y lectores de estado externos.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) open = false;

	/**
	 * Cuando es `true`, abre el diálogo como un modal usando `<dialog>.showModal()`.
	 *
	 * Diálogos modales:
	 * - Bloquean que el foco del teclado salga del diálogo.
	 * - Renderizan una capa `::backdrop` sobre el resto de la página.
	 * - Se pueden cerrar presionando `Escape` (comportamiento nativo del navegador).
	 *
	 * Cuando es `false`, usa `<dialog>.show()` que no es bloqueante (sin trampa de foco
	 * y sin capa de fondo).
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) modal = false;

	/**
	 * Colocación del diálogo dentro de la ventana gráfica.
	 *
	 * - `'center'` (por defecto) — Centrado. Colocación de diálogo M3 estándar.
	 * - `'top'`    — Anclado al borde superior (cajón desde arriba).
	 * - `'right'`  — Anclado al borde derecho (patrón de hoja lateral).
	 * - `'bottom'` — Anclado al borde inferior (alternativa de hoja inferior).
	 * - `'left'`   — Anclado al borde izquierdo (patrón de cajón de navegación).
	 * - `'max'`    — Pantalla completa (cubre toda la ventana gráfica).
	 *
	 * @default 'center'
	 */
	@property({ reflect: true })
	side: 'center' | 'top' | 'right' | 'bottom' | 'left' | 'max' = 'center';

	/**
	 * Tamaño del contenedor del diálogo.
	 *
	 * - `'small'`  — Diálogo estrecho; ideal para confirmaciones simples.
	 * - `'medium'` — Ancho de diálogo estándar (por defecto).
	 * - `'large'`  — Diálogo ancho; para formularios o contenido complejo.
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';

	/**
	 * Texto mostrado en el área del encabezado del diálogo.
	 *
	 * Cuando no está vacío, se renderiza como un encabezado estilizado dentro del contenedor del encabezado.
	 * El slot `header` tiene prioridad sobre este atributo cuando ambos están presentes.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/** Referencia directa al elemento `<dialog>` nativo para acceso programático. */
	@query('dialog') private _dialog!: HTMLDialogElement;

	override willUpdate(changed: Map<string, unknown>) {
		if (changed.has('open') && this.open !== changed.get('open')) {
			const isOpening = this.open;
			const eventName = isOpening ? 'moni-request-open' : 'moni-request-close';
			const allowed = emitMoniEvent(this, eventName, { cancelable: true });
			
			if (!allowed) {
				this.open = !isOpening;
			}
		}
	}

	/**
	 * Hook de ciclo de vida de Lit. Sincroniza el estado declarativo (`open`, `modal`)
	 * con la API imperativa del elemento `<dialog>` nativo de HTML5.
	 *
	 * - `showModal()`: Bloquea el resto del DOM (Inert), atrapa el foco del teclado (Focus Trap)
	 *   y renderiza el seudoelemento `::backdrop`.
	 * - `show()`: Permite interacción con el fondo (Non-modal).
	 *
	 * IMPORTANTE: Previene la excepción `InvalidStateError` validando si el
	 * diálogo ya está abierto antes de llamar a `show()` o `showModal()`.
	 *
	 * @param changed - Mapa de propiedades reactivas modificadas.
	 */
	override updated(changed: Map<string, unknown>) {
		if (changed.has('open') && this._dialog) {
			if (this.open) {
				emitMoniEvent(this, 'moni-open');
				if (this.modal) {
					if (!this._dialog.open) {
						this._dialog.showModal();
					}
				} else {
					if (!this._dialog.open) {
						this._dialog.show();
					}
				}
			} else {
				emitMoniEvent(this, 'moni-close');
				if (this._dialog.open) {
					this._dialog.close();
				}
			}
		}
	}

	private _onTransitionEnd(e: TransitionEvent) {
		if (e.target === this._dialog && e.propertyName === 'transform') {
			if (this.open) {
				emitMoniEvent(this, 'moni-opened');
			} else {
				emitMoniEvent(this, 'moni-closed');
			}
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				--_padding: 1.5rem;
				--_top: calc(var(--_padding) + env(safe-area-inset-top, 0));
				--_bottom: calc(var(--_padding) + env(safe-area-inset-bottom, 0));
				display: block;
				visibility: hidden;
				border: none;
				opacity: 0;
				position: fixed;
				box-shadow: var(--elevate2);
				color: var(--on-surface);
				background-color: var(--surface-container-high);
				padding: var(--_padding);
				z-index: 100;
				inset: 10% auto auto 50%;
				min-inline-size: 20rem;
				max-inline-size: 100%;
				max-block-size: 80%;
				overflow-x: hidden;
				overflow-y: auto;
				transition: all var(--speed3), 0s background-color;
				border-radius: 1.75rem;
				transform: translate(-50%, -4rem);
				outline: none;
			}

			dialog[open] {
				visibility: visible;
				opacity: 1;
				transform: translate(-50%, 0);
			}

			dialog::backdrop {
				display: block !important;
				opacity: 0;
				visibility: hidden;
				position: fixed;
				inset: 0;
				color: var(--on-surface);
				background-color: rgb(0 0 0 / 0.5);
				z-index: 100;
				transition: all var(--speed3), 0s background-color;
				border-radius: 0;
			}

			dialog[open]::backdrop {
				opacity: 1;
				visibility: visible;
			}

			dialog:is(.top, .right, .bottom, .left, .max) {
				--_padding: 1rem;
			}

			dialog.top,
			dialog.bottom {
				opacity: 1;
				block-size: auto;
				inline-size: 100%;
				min-inline-size: auto;
				max-block-size: 100%;
			}
			dialog.top {
				inset: 0 auto auto 0;
				transform: translateY(-100%);
				border-radius: 0 0 1rem 1rem;
				padding-block-start: var(--_top);
			}
			dialog.bottom {
				inset: auto auto 0 0;
				transform: translateY(100%);
				border-radius: 1rem 1rem 0 0;
				padding-block-end: var(--_bottom);
			}

			dialog:is(.left, .right) {
				opacity: 1;
				inset: 0 auto auto 0;
				inline-size: auto;
				block-size: 100%;
				max-block-size: 100%;
				background-color: var(--surface);
				padding-block: var(--_top) var(--_bottom);
			}
			dialog.left {
				inset: 0 auto auto 0;
				border-radius: 0 1rem 1rem 0;
				transform: translateX(-100%);
			}
			dialog.right {
				inset: 0 0 auto auto;
				border-radius: 1rem 0 0 1rem;
				transform: translateX(100%);
			}

			dialog.max {
				inset: 0 auto auto 0;
				inline-size: 100%;
				block-size: 100%;
				max-inline-size: 100%;
				max-block-size: 100%;
				transform: translateY(4rem);
				background-color: var(--surface);
				border-radius: 0;
				padding-block: var(--_top) var(--_bottom);
			}

			dialog[open]:is(.left, .right, .top, .bottom, .max) {
				transform: translate(0, 0);
			}

			dialog.small {
				inline-size: 25%;
			}
			dialog.medium {
				inline-size: 50%;
			}
			dialog.large {
				inline-size: 75%;
			}
			dialog.small:is(.left, .right) {
				inline-size: 20rem;
			}
			dialog.medium:is(.left, .right) {
				inline-size: 32rem;
			}
			dialog.large:is(.left, .right) {
				inline-size: 44rem;
			}
			dialog.small:is(.top, .bottom) {
				block-size: 16rem;
			}
			dialog.medium:is(.top, .bottom) {
				block-size: 24rem;
			}
			dialog.large:is(.top, .bottom) {
				block-size: 32rem;
			}

			header,
			footer {
				display: grid;
				align-content: center;
				border-radius: 0;
				padding: 0;
			}
			header {
				min-block-size: 3rem;
			}
			footer {
				min-block-size: 3.5rem;
			}
		`
	];

	/**
	 * Renderiza el elemento `<dialog>` nativo con la estructura semántica de slots del diálogo.
	 *
	 * **¿Por qué `<dialog>`?**
	 * El elemento nativo `<dialog>` proporciona captura de foco, renderizado de fondo (backdrop)
	 * y semántica modal accesible sin JavaScript. El enlace `?open` de Lit
	 * alterna el atributo de forma imperativa, mientras que `updated()` llama a `.show()` /
	 * `.showModal()` / `.close()` para conducir la pila de abrir/cerrar nativa del navegador.
	 *
	 * **Estructura de slots:**
	 * - `[slot="header"]` — se repliega al valor del atributo `title`.
	 * - Slot por defecto — la región de contenido principal del diálogo.
	 * - `[slot="footer"]` — botones de acción (típicamente elementos `<moni-button>`).
	 *
	 * **Composición de `classes`:**
	 * `side`, `size`, y `modal` (si `modal=true`) se unen como clases CSS.
	 * `side` posiciona el diálogo en `start`, `end`, `top`, o `bottom`; usado
	 * para diálogos de panel lateral. `size` controla max-width/height.
	 */
	override render() {
		const classes = [this.side, this.size, this.modal ? 'modal' : '']
			.filter(Boolean)
			.join(' ');
		return html`<dialog
			part="dialog"
			class=${classes}
			@transitionend=${this._onTransitionEnd}
		>
			<header part="header">
				<slot name="header">${this.title}</slot>
			</header>
			<div part="content"><slot></slot></div>
			<footer part="footer"><slot name="footer"></slot></footer>
		</dialog>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-dialog': MoniDialog;
	}
}

export default MoniDialog;
