/**
 * @file components/moni-bottom-sheet.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { emitMoniEvent } from '../utils/event-emitter.js';

/**
 * Componente Material Design 3 Bottom Sheet.
 *
 * Los bottom sheets son superficies ancladas a la parte inferior de la pantalla que
 * complementan la vista principal. Muestran contenido complementario, acciones
 * contextuales, o flujos de tareas sin ocultar por completo el contenido principal.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/sheets-bottom/specs.md`
 *
 * **Nota de implementación — elemento nativo `<dialog>`:**
 * Al igual que `<moni-dialog>`, este componente envuelve el elemento nativo `<dialog>`.
 * La propiedad `open` controla `dialog.showModal()` / `dialog.close()`. Cuando
 * `modal=true` (por defecto), se renderiza automáticamente un fondo `::backdrop`.
 *
 * **Teletransportación (montaje a nivel del body):**
 * Cuando `positioning="body"` (por defecto), el componente se mueve a
 * `document.body` en `connectedCallback` para que el diálogo inferior fijo se renderice
 * por encima de todos los contextos de apilamiento. En `disconnectedCallback`, se mueve de nuevo
 * a su posición original en el DOM. Esto evita el recorte por un ancestro con `overflow: hidden`
 * o `transform`.
 *
 * **Tamaños:**
 * - `small`  — Hoja compacta; adecuada para menús de acciones simples.
 * - `medium` — Altura estándar (por defecto).
 * - `large`  — Altura expandida (`expandedHeight` controla el block-size máximo).
 * - `auto`   — Altura impulsada por el contenido.
 *
 * @example
 * ```html
 * <moni-bottom-sheet title="Compartir">
 *   <moni-list-item icon="share">Copiar enlace</moni-list-item>
 *   <moni-list-item icon="mail">Enviar por correo</moni-list-item>
 * </moni-bottom-sheet>
 *
 * <script>
 *   document.querySelector('moni-bottom-sheet').open = true;
 * </script>
 * ```
 *
 * @slot default - El contenido principal del bottom sheet.
 * @slot handle  - El área del asa de arrastre en la parte superior.
 * @slot footer  - Botones de acción en la parte inferior de la hoja.
 *
 * @csspart dialog - El elemento nativo `<dialog>`.
 * @csspart header - El contenedor del encabezado con el título y el botón de cierre.
 * @csspart body   - El área de contenido principal desplazable (scrollable).
 * @csspart footer - El área de los botones de acción en el pie.
 */
@customElement('moni-bottom-sheet')
export class MoniBottomSheet extends MoniElement {
	/**
	 * Controla el estado abierto/cerrado del bottom sheet.
	 *
	 * Cuando se establece en `true`, llama a `dialog.showModal()` o `dialog.show()`
	 * dependiendo de la propiedad `modal`. Cuando se establece en `false`, llama a `dialog.close()`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) open = false;

	/**
	 * Variante de altura del contenedor de la hoja.
	 *
	 * - `'small'`  — Compacta; adecuada para confirmaciones rápidas.
	 * - `'medium'` — Altura estándar (por defecto).
	 * - `'large'`  — Llena el `expandedHeight` de la ventana gráfica.
	 * - `'auto'`   — Depende del contenido; la altura se adapta al contenido en el slot.
	 *
	 * @default 'medium'
	 */
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'auto' = 'medium';

	/**
	 * Cuando es `true` (por defecto), la hoja se abre como un diálogo modal con un
	 * fondo translúcido (scrim). Cuando es `false`, se abre como una superposición no modal sin scrim.
	 *
	 * @default true
	 */
	@property({ type: Boolean, reflect: true }) modal = true;

	/**
	 * Texto de encabezado mostrado en el área del encabezado de la hoja.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/**
	 * Controla cómo se posiciona la hoja en el documento.
	 *
	 * - `'body'` (por defecto) — Teletransporta el elemento a `document.body` para que
	 *   la superposición fija se renderice por encima de todos los contextos de apilamiento.
	 * - `'fixed'` — Posicionamiento fijo dentro de su subárbol DOM actual.
	 * - `'absolute'` — Absoluto dentro del ancestro posicionado más cercano.
	 * - `'static'` — Flujo estático (rara vez necesario; solo para pruebas).
	 *
	 * @default 'fixed'
	 */
	@property({ reflect: true })
	positioning: 'body' | 'fixed' | 'absolute' | 'static' = 'fixed';

	/**
	 * Block-size (altura) máximo de la hoja cuando `size="large"`.
	 *
	 * Acepta cualquier valor válido de `max-block-size` en CSS (ej. `'85%'`, `'600px'`).
	 * Por defecto es `'85%'` que es el máximo recomendado por M3 para bottom sheets
	 * en pantallas compactas.
	 *
	 * @default '85%'
	 */
	@property({ reflect: true, attribute: 'expanded-height' })
	expandedHeight = '85%';

	/**
	 * Restricción opcional de inline-size (ancho) máximo para la hoja.
	 *
	 * Cuando se establece (ej. `'640px'`), la hoja no excederá este ancho incluso en
	 * pantallas anchas. Útil para puntos de interrupción de tableta/escritorio donde se prefiere
	 * un modal centrado en lugar de una hoja de ancho completo.
	 *
	 * @default '' (sin restricción)
	 */
	@property({ reflect: true, attribute: 'max-width' })
	maxWidth = '';

	/**
	 * Nodo padre original antes de la teletransportación a `document.body`.
	 * Utilizado para restaurar la posición DOM del elemento en `disconnectedCallback`.
	 */
	private _originalParent: Node | null = null;

	/**
	 * Hermano siguiente original antes de la teletransportación a `document.body`.
	 * Utilizado junto con `_originalParent` para restaurar la posición exacta en el DOM.
	 */
	private _originalSibling: Node | null = null;

	/** Referencia directa al elemento nativo `<dialog>`. */
	@query('dialog') private _dialog!: HTMLDialogElement;
	private _isDragging = false;
	private _startY = 0;
	private _currentTranslationY = 0;
	private _sheetHeight = 0;
	private _defaultHeight = 0;
	private _justDragged = false;
	private _skipRequestClose = false;

	override willUpdate(changed: Map<string, unknown>) {
		if (changed.has('open') && this.open !== changed.get('open')) {
			const isOpening = this.open;
			if (isOpening) {
				const allowed = emitMoniEvent(this, 'moni-request-open', { cancelable: true });
				if (!allowed) {
					this.open = false;
				}
			} else if (!this._skipRequestClose) {
				const allowed = emitMoniEvent(this, 'moni-request-close', { cancelable: true });
				if (!allowed) {
					this.open = true;
				}
			}
		}
	}

	private async _animateAndClose() {
		this._skipRequestClose = true;
		const allowed = emitMoniEvent(this, 'moni-request-close', { cancelable: true });
		this._skipRequestClose = false;
		if (!allowed) return false;

		emitMoniEvent(this, 'moni-close');

		this._dialog.classList.remove('expanded');
		this._dialog.style.transform = 'translateY(100%)';
		this._dialog.style.height = '';

		await new Promise(resolve => {
			const onEnd = () => {
				this._dialog.removeEventListener('transitionend', onEnd);
				resolve(null);
			};
			this._dialog.addEventListener('transitionend', onEnd);
			setTimeout(onEnd, 300);
		});

		this._dialog.style.transform = '';
		this._skipRequestClose = true;
		this.open = false;
		this._skipRequestClose = false;
		emitMoniEvent(this, 'moni-closed');
		return true;
	}

	/**
	 * Calcula la altura máxima permitida en píxeles basándose en la propiedad `expandedHeight`.
	 * Útil para la lógica de arrastre donde necesitamos valores numéricos absolutos (px) en
	 * lugar de porcentajes o unidades de viewport, asegurando que el bottom-sheet no exceda
	 * el tamaño permitido en pantalla.
	 */
	private _getMaxHeightPx(): number {
		const val = this.expandedHeight || '85%';
		if (val.endsWith('%')) {
			return window.innerHeight * (parseFloat(val) / 100);
		}
		if (val.endsWith('vh')) {
			return window.innerHeight * (parseFloat(val) / 100);
		}
		if (val.endsWith('px')) {
			return parseFloat(val);
		}
		return window.innerHeight * 0.85;
	}

	/**
	 * Inicia el proceso de arrastre (drag) cuando el usuario presiona sobre el `handle` o el `header`.
	 * Captura el puntero para asegurar que los eventos de movimiento se sigan recibiendo incluso si
	 * el cursor se sale de los límites físicos del elemento.
	 */
	private _onPointerDown(e: PointerEvent) {
		const target = e.target as HTMLElement;
		// Solo iniciamos el arrastre si el click provino del asa superior (handle) o del encabezado.
		if (!target.closest('.handle') && !target.closest('header')) return;

		this._isDragging = true;
		this._startY = e.clientY; // Almacenamos la coordenada inicial Y para calcular el delta luego
		this._sheetHeight = this._dialog.getBoundingClientRect().height; // Capturamos la altura actual
		this._currentTranslationY = 0;

		const isExpanded = this._dialog.classList.contains('expanded');
		// Si no estaba expandido previamente, guardamos su altura por defecto para usarla como punto de retorno.
		if (!isExpanded) {
			this._defaultHeight = this._sheetHeight;
		}

		// setPointerCapture enruta todos los eventos subsecuentes a este target
		target.setPointerCapture(e.pointerId);
		this._dialog.classList.add('dragging'); // Desactiva las transiciones CSS para un seguimiento suave 1:1
	}

	/**
	 * Maneja el movimiento del puntero mientras se arrastra el componente.
	 * Interpola la altura o la transformación Y dependiendo de si se está expandiendo o colapsando,
	 * y de su estado actual (expandido o normal).
	 */
	private _onPointerMove(e: PointerEvent) {
		if (!this._isDragging) return;

		// Diferencia en píxeles desde donde se inició el click
		const deltaY = e.clientY - this._startY;
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxHeight = this._getMaxHeightPx();

		if (isExpanded) {
			if (deltaY > 0) {
				// Arrastrando hacia abajo desde el estado expandido: reducimos su altura
				const newHeight = this._sheetHeight - deltaY;
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.max(0, newHeight)}px`;
			} else {
				// Tirando hacia arriba cuando ya está expandido: aplicamos resistencia friccional
				const newHeight = this._sheetHeight - deltaY * 0.2; // 0.2 simula tensión (rubber-band)
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.min(maxHeight, newHeight)}px`;
			}
		} else {
			if (deltaY > 0) {
				// Arrastrando hacia abajo desde su estado inicial: lo empujamos visualmente hacia abajo (translate)
				this._currentTranslationY = deltaY;
				this._dialog.style.transform = `translateY(${deltaY}px)`;
				this._dialog.style.height = '';
			} else {
				// Arrastrando hacia arriba desde su estado inicial: hacemos que crezca su altura
				const newHeight = this._sheetHeight - deltaY;
				this._dialog.style.transform = '';
				this._dialog.style.height = `${Math.min(maxHeight, newHeight)}px`;
			}
		}
	}

	/**
	 * Finaliza la interacción de arrastre, evaluando si el bottom-sheet debe
	 * expandirse, regresar a su estado original o cerrarse completamente según la
	 * inercia o la distancia arrastrada.
	 */
	private _onPointerUp(e: PointerEvent) {
		if (!this._isDragging) return;

		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId); // Liberamos el control del puntero
		this._isDragging = false;
		this._dialog.classList.remove('dragging'); // Reactivamos las transiciones CSS

		const deltaY = e.clientY - this._startY;
		// Si se movió más de 5px, bloqueamos clics accidentales para evitar disparar eventos subyacentes
		if (Math.abs(deltaY) > 5) {
			this._justDragged = true;
			setTimeout(() => {
				this._justDragged = false;
			}, 50);
		}
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxHeight = this._getMaxHeightPx();

		if (isExpanded) {
			// Evaluamos la altura final tras soltar el ratón/dedo
			const finalHeight = this._sheetHeight - deltaY;
			if (finalHeight < this._defaultHeight - 80) {
				// Si se arrastró significativamente por debajo de la altura por defecto, lo cerramos
				this._animateAndClose().then((closed) => {
					if (!closed) {
						// Si se canceló el evento, regresamos a su lugar
						this._dialog.style.transform = '';
						this._dialog.style.height = '';
					}
				});
			} else if (finalHeight < (maxHeight + this._defaultHeight) / 2) {
				// Si se soltó a medio camino, lo colapsamos a su altura normal
				this._dialog.classList.remove('expanded');
				this._dialog.style.transform = '';
				this._dialog.style.height = '';
			} else {
				// Si no se arrastró lo suficiente hacia abajo, retorna a estado expandido (snap back)
				this._dialog.style.transform = '';
				this._dialog.style.height = '';
			}
		} else {
			if (deltaY < 0) {
				// Evaluamos el arrastre hacia arriba desde el estado colapsado
				const finalHeight = this._sheetHeight - deltaY;
				if (finalHeight > this._sheetHeight + 80) {
					// Expandimos el bottom-sheet hasta la altura máxima
					this._dialog.classList.add('expanded');
				}
				this._dialog.style.transform = '';
				this._dialog.style.height = '';
			} else {
				// Evaluamos el arrastre hacia abajo para cerrar el componente
				if (this._currentTranslationY > 80) {
					this._animateAndClose().then((closed) => {
						if (!closed) {
							this._dialog.style.transform = '';
						}
					});
				} else {
					// Regresa a su estado colapsado (snap back al inicio)
					this._dialog.style.transform = '';
				}
			}
		}
	}

	/**
	 * Aborta limpiamente la interacción de arrastre (Pointer Cancel).
	 * Se dispara cuando el SO interrumpe el touch (ej: entrada de una llamada)
	 * o si el navegador toma el control para un scroll nativo imprevisto.
	 */
	private _onPointerCancel(e: PointerEvent) {
		if (!this._isDragging) return;

		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');
		this._dialog.style.transform = '';
		this._dialog.style.height = '';
	}

	/**
	 * Handler de clicks en la superficie del modal (Backdrop).
	 * Si el clic cae exactamente en el fondo (`this._dialog`) y no en el contenedor de 
	 * contenido interno (`this._sheetContent`), y si el sheet acaba de ser arrastrado 
	 * sin soltar, ignora el click. De lo contrario, cierra fluidamente el modal deslizando hacia abajo.
	 */
	private _onDialogClick(e: MouseEvent) {
		if (this._justDragged) {
			this._justDragged = false;
			return;
		}
		if (!this.modal) return;
		// Click on backdrop targets the dialog element itself. Clicks on children target the children.
		if (e.target !== this._dialog) return;

		this._animateAndClose();
	}

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Gestiona inyecciones de variables CSS dinámicas para anchos y alturas máximas.
	 * 
	 * Fundamental: Resuelve problemas de `z-index` y `overflow: hidden` en ancestros 
	 * mediante el Portal Pattern (moviendo físicamente el DOM element al `document.body`)
	 * si `positioning === 'body'` cuando se abre, y devolviéndolo a su DOM originario al cerrar.
	 */
	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('expandedHeight')) {
			this.style.setProperty('--moni-bottom-sheet-expanded-height', this.expandedHeight);
		}
		if (changed.has('maxWidth')) {
			this.style.setProperty('--moni-bottom-sheet-max-width', this.maxWidth || '100%');
		}
		if (changed.has('open')) {
			if (this.open) {
				if (changed.get('open') !== undefined) {
					emitMoniEvent(this, 'moni-open');
				}
				if (this.positioning === 'body' && this.parentNode !== document.body) {
					this._originalParent = this.parentNode;
					this._originalSibling = this.nextSibling;
					document.body.appendChild(this);
				}
				if (changed.get('open') !== undefined) {
					// Simulamos el final de la transición de apertura
					setTimeout(() => emitMoniEvent(this, 'moni-opened'), 300);
				}
			} else {
				if (this._dialog) {
					this._dialog.classList.remove('expanded');
				}
				if (this.positioning === 'body' && this._originalParent && this.parentNode === document.body) {
					this._originalParent.insertBefore(this, this._originalSibling);
					this._originalParent = null;
					this._originalSibling = null;
				}
			}
		}
	}

	/**
	 * Limpieza (Garbage Collection).
	 * Si el Bottom Sheet fue destruido mientras estaba inyectado en el `document.body`
	 * (Portal Pattern), lo retorna a su padre original para evitar orfandad de nodos.
	 */
	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this.parentNode === document.body && this.positioning === 'body' && this._originalParent) {
			this._originalParent.insertBefore(this, this._originalSibling);
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				--_padding: 1rem;
				display: block;
				visibility: hidden;
				border: none;
				opacity: 0;
				box-shadow: var(--elevate3);
				color: var(--on-surface);
				background-color: var(--surface);
				padding: var(--_padding);
				z-index: 100;
				inline-size: 100%;
				max-inline-size: var(--moni-bottom-sheet-max-width, 100%);
				margin-inline: auto;
				block-size: auto;
				max-block-size: var(--moni-bottom-sheet-expanded-height, 85%);
				min-inline-size: auto;
				border-radius: 1.75rem 1.75rem 0 0;
				overflow-y: auto;
				transition:
					transform var(--speed3),
					height var(--speed3),
					opacity var(--speed3);
				transform: translateY(100%);
				outline: none;
			}

			dialog[open] {
				visibility: visible;
				opacity: 1;
				transform: translateY(0);
			}

			dialog.fixed {
				position: fixed;
				inset: auto 0 0 0;
			}

			dialog.absolute {
				position: absolute;
				inset: auto 0 0 0;
			}

			dialog.static {
				position: relative;
				inset: auto;
				transform: none !important;
				opacity: 1 !important;
				visibility: visible !important;
				display: none;
			}
			dialog.static[open] {
				display: block;
			}

			dialog.dragging {
				transition: none !important;
			}

			dialog.small {
				block-size: 16rem;
			}
			dialog.medium {
				block-size: 24rem;
			}
			dialog.large {
				block-size: 32rem;
			}
			dialog.auto {
				block-size: auto;
			}

			dialog.expanded {
				block-size: var(--moni-bottom-sheet-expanded-height, 85%) !important;
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
				padding-block-start: 0.5rem;
				cursor: grab;
				touch-action: none;
				user-select: none;
			}
			header:active {
				cursor: grabbing;
			}
			footer {
				min-block-size: 3.5rem;
			}

			/* M3 spec: the drag handle is a 4dp tall x 32dp wide pill at
			   the top center of the sheet. Color is on-surface-variant with
			   40% opacity for reduced emphasis. */
			.handle {
				inline-size: 2rem;
				block-size: 0.25rem;
				background: var(--on-surface-variant);
				opacity: 0.4;
				border-radius: 999px;
				margin: 0.5rem auto 1rem;
				cursor: grab;
				touch-action: none;
			}
			.handle:active {
				cursor: grabbing;
			}
		`
	];

	/**
	 * Renders the native `<dialog>` element that serves as the bottom sheet container.
	 *
	 * **Why `<dialog>` instead of `<div>`?**
	 * Using the native `<dialog>` element provides:
	 * - Built-in focus trapping via the `open` attribute (browser handles `inert`).
	 * - The `::backdrop` pseudo-element for the translucent overlay (styled via CSS).
	 * - Screen reader accessibility (`role="dialog"` / `aria-modal`) for free.
	 *
	 * **Positioning class mapping:**
	 * `posClass` maps `positioning='body'` to `'fixed'` (the CSS class name), while
	 * other positioning values pass through unchanged. `'body'` positioning anchors
	 * the sheet to the viewport; `'parent'` keeps it within the nearest `position: relative` ancestor.
	 *
	 * **Touch-to-dismiss via pointer events:**
	 * `@pointerdown`, `@pointermove`, and `@pointerup` on the `<dialog>` element
	 * power the swipe-down-to-dismiss gesture. `_onPointerDown` records the start Y;
	 * `_onPointerMove` applies a CSS `translateY` to provide live drag feedback;
	 * `_onPointerUp` determines if the drag exceeded the dismiss threshold.
	 */
	override render() {
		const posClass = this.positioning === 'body' ? 'fixed' : this.positioning;
		const dialogClasses = `${this.size} ${posClass}`;

		return html`<dialog
			part="dialog"
			?open=${this.open}
			class=${dialogClasses}
			@click=${this._onDialogClick}
			@pointerdown=${this._onPointerDown}
			@pointermove=${this._onPointerMove}
			@pointerup=${this._onPointerUp}
			@pointercancel=${this._onPointerCancel}
		>
			<div class="handle" aria-hidden="true"></div>
			<header part="header">
				<slot name="handle">${this.title}</slot>
			</header>
			<div part="content"><slot></slot></div>
			<footer part="footer"><slot name="footer"></slot></footer>
		</dialog>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-bottom-sheet': MoniBottomSheet;
	}
}

export default MoniBottomSheet;
