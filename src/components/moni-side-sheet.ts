/**
 * @file components/moni-side-sheet.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-button.js';

/**
 * Componente Material Design 3 Side Sheet (Hoja o panel lateral).
 *
 * Los paneles laterales muestran contenido complementario que está anclado al borde
 * izquierdo o derecho de la pantalla. Pueden ser estándar (en línea con el contenido)
 * o modales (superpuestos al contenido con un fondo/scrim oscurecido).
 *
 * **Referencia a la especificación M3:** `m3-docs/components/side-sheets/specs.md`
 *
 * **Comportamiento del cuadro de diálogo (Dialog behavior):**
 * Internamente, este componente utiliza el elemento HTML nativo `<dialog>` para una
 * accesibilidad robusta, captura de foco y renderizado en la capa superior (top-layer).
 * - Cuando `modal=true`, el panel usa `dialog.showModal()`, renderizando un fondo
 *   (scrim backdrop) y capturando el foco. Al presionar `Escape` se cierra.
 * - Cuando `modal=false`, el panel usa `dialog.show()` y permanece interactivo
 *   junto al contenido de la página principal.
 *
 * **Arrastrar y redimensionar (Característica Moni):**
 * Al configurar el atributo `with-handle`, se agrega un controlador de arrastre en el borde
 * interior del panel. Los usuarios pueden hacer clic y arrastrar este controlador para 
 * redimensionar el ancho del panel hasta el límite `max-width`. Si el usuario arrastra
 * el panel hacia el borde de la pantalla rápidamente o más allá de cierto umbral, se cierra automáticamente.
 *
 * **Animaciones:**
 * Los paneles laterales se deslizan desde el `side` (lado) especificado (`left` o `right`).
 * Las animaciones de apertura y cierre se manejan a través de transiciones CSS vinculadas a la propiedad `open`.
 *
 * @fires close - Se dispara cuando el panel lateral está completamente cerrado (después de
 *                que terminan las animaciones), ya sea a través del botón de cierre, clic en el fondo (scrim),
 *                arrastrar para cerrar o la tecla `Escape`.
 *
 * @example
 * ```html
 * <!-- Panel lateral modal a la derecha -->
 * <moni-side-sheet id="details-sheet" modal title="Detalles del artículo">
 *   <p>Aquí hay más información sobre el artículo seleccionado.</p>
 *   <div slot="footer">
 *     <moni-button>Guardar</moni-button>
 *   </div>
 * </moni-side-sheet>
 *
 * <!-- Panel lateral a la izquierda, desvinculado (detached) y redimensionable -->
 * <moni-side-sheet side="left" detached with-handle max-width="50vw">
 *   <p>Opciones de navegación</p>
 * </moni-side-sheet>
 * ```
 *
 * @slot default - Contenido del cuerpo principal.
 * @slot header  - Contenido de encabezado personalizado (anula `title`, los botones de cerrar/volver permanecen).
 * @slot footer  - Área de acción anclada en la parte inferior.
 */
@customElement('moni-side-sheet')
export class MoniSideSheet extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ type: Boolean, reflect: true }) modal = false;
	@property({ reflect: true }) side: 'right' | 'left' = 'right';
	@property({ reflect: true }) title = '';
	@property({ type: Boolean, reflect: true }) detached = false;
	@property({ type: Boolean, reflect: true, attribute: 'show-back' }) showBack = false;
	@property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder = false;
	@property({ type: Boolean, reflect: true, attribute: 'with-handle' }) withHandle = false;
	@property({ type: Boolean, reflect: true, attribute: 'hide-close' }) hideClose = false;
	@property({ reflect: true, attribute: 'expanded-width' }) expandedWidth = '600px';
	@property({ reflect: true, attribute: 'max-width' }) maxWidth = '';

	@query('dialog') private _dialog!: HTMLDialogElement;

	private _isDragging = false;
	private _startX = 0;
	private _currentTranslationX = 0;
	private _sheetWidth = 0;
	private _defaultWidth = 0;
	private _justDragged = false;

	private _getMaxWidthPx(): number {
		const val = this.expandedWidth || '600px';
		if (val.endsWith('%')) {
			return window.innerWidth * (parseFloat(val) / 100);
		}
		if (val.endsWith('vw')) {
			return window.innerWidth * (parseFloat(val) / 100);
		}
		if (val.endsWith('px')) {
			return parseFloat(val);
		}
		return 600;
	}

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Coordina la transición del elemento `<dialog>` nativo.
	 * Utiliza `showModal()` para Side Sheets modales (con backdrop) y `show()` 
	 * para Side Sheets estándar. Administra manualmente la clase `.opened` y escucha
	 * eventos `transitionend` para cerrar limpiamente el `<dialog>` sólo cuando 
	 * las animaciones CSS terminan.
	 */
	override updated(changedProperties: PropertyValues) {
		super.updated(changedProperties);

		if (changedProperties.has('expandedWidth')) {
			this.style.setProperty('--moni-side-sheet-expanded-width', this.expandedWidth);
		}
		if (changedProperties.has('maxWidth')) {
			this.style.setProperty('--moni-side-sheet-max-width', this.maxWidth || '400px');
		}

		if (changedProperties.has('open') && this._dialog) {
			if (this.open) {
				if (this.modal) {
					if (!this._dialog.open) {
						if (typeof this._dialog.showModal === 'function') {
							this._dialog.showModal();
						} else {
							this._dialog.open = true;
						}
					}
				} else {
					if (!this._dialog.open) {
						if (typeof this._dialog.show === 'function') {
							this._dialog.show();
						} else {
							this._dialog.open = true;
						}
					}
				}
				// Force layout reflow before adding class
				this._dialog.getBoundingClientRect();
				this._dialog.classList.add('opened');
			} else {
				if (this._dialog.open) {
					this._dialog.classList.remove('opened');
					const onTransitionEnd = (e: TransitionEvent) => {
						if (e.target === this._dialog && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
							this._dialog.removeEventListener('transitionend', onTransitionEnd);
							if (!this.open && this._dialog.open) {
								this._dialog.classList.remove('expanded');
								this._dialog.close();
							}
						}
					};
					this._dialog.addEventListener('transitionend', onTransitionEnd);
					// Fallback safety
					setTimeout(() => {
						if (!this.open && this._dialog.open) {
							this._dialog.classList.remove('expanded');
							this._dialog.close();
						}
					}, 350);
				}
			}
		}
	}

	/**
	 * Inicia la interacción de arrastre (Drag) del Side Sheet.
	 * Verifica si el usuario agarró el componente desde el "handle" o la cabecera.
	 * Captura el ancho actual para determinar si el usuario pretende expandir o contraer
	 * el panel lateral mediante gestos.
	 */
	private _onPointerDown(e: PointerEvent) {
		if (!this.withHandle) return;
		const target = e.target as HTMLElement;
		if (!target.closest('.handle') && !target.closest('header')) return;

		this._isDragging = true;
		this._startX = e.clientX;
		this._sheetWidth = this._dialog.getBoundingClientRect().width;
		this._currentTranslationX = 0;

		const isExpanded = this._dialog.classList.contains('expanded');
		if (!isExpanded) {
			this._defaultWidth = this._sheetWidth;
		}

		target.setPointerCapture(e.pointerId);
		this._dialog.classList.add('dragging');
	}

	/**
	 * Procesa el movimiento del arrastre y aplica transformaciones CSS inline
	 * imperativamente a 60FPS. Diferencia la lógica dependiendo de la posición 
	 * de anclaje (izquierdo vs derecho) y del estado actual (expandido vs contraído).
	 * Introduce una "resistencia elástica" si el usuario intenta expandir el panel
	 * más allá de su ancho máximo permitido (`maxWidth`).
	 */
	private _onPointerMove(e: PointerEvent) {
		if (!this._isDragging) return;

		const deltaX = e.clientX - this._startX;
		const isExpanded = this._dialog.classList.contains('expanded');
		const maxWidthPx = this._getMaxWidthPx();
		const shrinkDelta = this.side === 'right' ? deltaX : -deltaX;

		if (isExpanded) {
			if (shrinkDelta > 0) {
				// Dragging to shrink width
				const newWidth = this._sheetWidth - shrinkDelta;
				this._dialog.style.transform = '';
				this._dialog.style.width = `${Math.max(0, newWidth)}px`;
			} else {
				// Pulling to expand beyond limit (resistance)
				const newWidth = this._sheetWidth - shrinkDelta * 0.2;
				this._dialog.style.width = `${Math.min(maxWidthPx, newWidth)}px`;
			}
		} else {
			if (shrinkDelta > 0) {
				// Dragging to close: translate
				this._currentTranslationX = shrinkDelta;
				this._dialog.style.transform = `translateX(${this.side === 'right' ? shrinkDelta : -shrinkDelta}px)`;
				this._dialog.style.width = '';
			} else {
				// Dragging to grow width
				const newWidth = this._sheetWidth - shrinkDelta;
				this._dialog.style.transform = '';
				this._dialog.style.width = `${Math.min(maxWidthPx, newWidth)}px`;
			}
		}
	}

	/**
	 * Evalúa el resultado de la interacción de arrastre (Pointer Up).
	 * 
	 * Basado en umbrales de distancia física (`threshold`) y el estado actual, decide:
	 * 1. Expandir el panel por completo (modo "expanded").
	 * 2. Contraer el panel de vuelta a su tamaño estándar.
	 * 3. Cerrar el Side Sheet totalmente y disparar el evento `close`.
	 * Utiliza transiciones CSS nativas en vez de animar por frame para la resolución final.
	 */
	private _onPointerUp(e: PointerEvent) {
		if (!this._isDragging) return;

		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');

		const deltaX = e.clientX - this._startX;
		if (Math.abs(deltaX) > 5) {
			this._justDragged = true;
			setTimeout(() => {
				this._justDragged = false;
			}, 50);
		}

		const isExpanded = this._dialog.classList.contains('expanded');
		const maxWidthPx = this._getMaxWidthPx();
		const shrinkDelta = this.side === 'right' ? deltaX : -deltaX;

		if (isExpanded) {
			const finalWidth = this._sheetWidth - shrinkDelta;
			if (finalWidth < this._defaultWidth - 80) {
				this._dialog.classList.remove('expanded');
				this._dialog.classList.remove('opened');
				this._dialog.style.transform = this.side === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
				this._dialog.style.width = '';
				
				const onTransitionEnd = () => {
					this._dialog.removeEventListener('transitionend', onTransitionEnd);
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
					this.open = false;
					this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
				};
				this._dialog.addEventListener('transitionend', onTransitionEnd);
				setTimeout(() => { if (this.open) onTransitionEnd(); }, 300);
			} else if (finalWidth < (maxWidthPx + this._defaultWidth) / 2) {
				this._dialog.classList.remove('expanded');
				this._dialog.style.transform = '';
				this._dialog.style.width = '';
			} else {
				this._dialog.style.transform = '';
				this._dialog.style.width = '';
			}
		} else {
			if (shrinkDelta < 0) {
				const finalWidth = this._sheetWidth - shrinkDelta;
				const threshold = (maxWidthPx + this._sheetWidth) / 2;
				if (finalWidth > threshold || -shrinkDelta > 80) {
					this._dialog.classList.add('expanded');
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				} else {
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				}
			} else {
				const threshold = Math.min(150, this._sheetWidth * 0.4);
				if (Math.abs(this._currentTranslationX) > threshold) {
					this._dialog.classList.remove('opened');
					this._dialog.style.transform = this.side === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
					this._dialog.style.width = '';
					
					const onTransitionEnd = () => {
						this._dialog.removeEventListener('transitionend', onTransitionEnd);
						this._dialog.style.transform = '';
						this._dialog.style.width = '';
						this.open = false;
						this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
					};
					this._dialog.addEventListener('transitionend', onTransitionEnd);
					setTimeout(() => { if (this.open) onTransitionEnd(); }, 300);
				} else {
					this._dialog.style.transform = '';
					this._dialog.style.width = '';
				}
			}
		}
	}

	/**
	 * Aborta limpiamente la interacción de arrastre (Pointer Cancel).
	 * Remueve estilos imperativos y clases de estado (`dragging`) si el navegador
	 * toma el control o la interacción se interrumpe prematuramente.
	 */
	private _onPointerCancel(e: PointerEvent) {
		if (!this._isDragging) return;
		const target = e.target as HTMLElement;
		target.releasePointerCapture(e.pointerId);
		this._isDragging = false;
		this._dialog.classList.remove('dragging');
		this._dialog.style.transform = '';
		this._dialog.style.width = '';
	}

	/**
	 * Manejador del botón "Cerrar" explícito (X).
	 * Modifica la propiedad `open` a false y despacha el evento de cierre.
	 */
	private _onCloseClick() {
		this.open = false;
		this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
	}

	/**
	 * Manejador del botón "Atrás".
	 * Emite un evento especializado `back` útil para Side Sheets de navegación anidada,
	 * permitiendo a los controladores padres reaccionar cambiando la vista interna.
	 */
	private _onBackClick() {
		this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
	}

	/**
	 * Intercepta clics en el backdrop nativo del `<dialog>`.
	 * Si el componente es `modal`, hacer clic fuera del panel cierra la interfaz.
	 * Verifica `_justDragged` para evitar cerrar si el usuario hizo un click
	 * "accidental" derivado del final de un arrastre.
	 */
	private _onDialogClick(e: MouseEvent) {
		if (this._justDragged) {
			this._justDragged = false;
			return;
		}
		if (this.modal && e.target === this._dialog) {
			this._onCloseClick();
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			dialog {
				display: flex;
				flex-direction: column;
				border: none;
				position: fixed;
				top: 0;
				bottom: 0;
				block-size: 100vh;
				inline-size: 100%;
				max-inline-size: var(--moni-side-sheet-max-width, 400px);
				background-color: var(--surface);
				color: var(--on-surface);
				box-sizing: border-box;
				padding: 0;
				margin: 0;
				z-index: 90;
				outline: none;
				overflow: hidden;
				transition:
					transform var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					width var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					max-width var(--speed3) cubic-bezier(0.2, 0, 0, 1),
					opacity var(--speed3),
					visibility var(--speed3);
				opacity: 0;
				visibility: hidden;
			}

			dialog.dragging {
				transition: none !important;
			}

			dialog.expanded {
				max-inline-size: var(--moni-side-sheet-expanded-width, 600px) !important;
			}

			/* Alignments */
			dialog.right {
				right: 0;
				left: auto;
				transform: translateX(100%);
				border-left: 1px solid var(--outline-variant);
				border-radius: 1.75rem 0 0 1.75rem;
			}

			dialog.left {
				left: 0;
				right: auto;
				transform: translateX(-100%);
				border-right: 1px solid var(--outline-variant);
				border-radius: 0 1.75rem 1.75rem 0;
			}

			/* Detached alignment */
			dialog.detached {
				top: 16px;
				bottom: 16px;
				block-size: calc(100vh - 32px);
				border-radius: 1.75rem !important;
				border: 1px solid var(--outline-variant);
				box-shadow: var(--elevate1);
			}

			dialog.detached.right {
				right: 16px;
			}

			dialog.detached.left {
				left: 16px;
			}

			/* Borders overrides */
			dialog.no-border {
				border: none !important;
			}

			/* Modal Styles */
			dialog.modal {
				background-color: var(--surface-container-low);
				box-shadow: var(--elevate3);
				z-index: 100;
			}

			/* Backdrop for Modal */
			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.4);
				opacity: 0;
				transition: opacity var(--speed3);
			}

			/* Opened State */
			dialog.opened {
				opacity: 1;
				visibility: visible;
				transform: translateX(0);
			}

			dialog.opened::backdrop {
				opacity: 1;
			}

			/* Drag handle */
			.handle {
				position: absolute;
				top: 50%;
				width: 4px;
				height: 48px;
				background: var(--outline-variant);
				border-radius: 999px;
				cursor: grab;
				transform: translateY(-50%);
				touch-action: none;
				z-index: 10;
				opacity: 0.8;
				transition: background-color var(--speed1);
			}
			.handle:hover {
				background: var(--on-surface-variant);
			}
			.handle:active {
				background: var(--on-surface-variant);
				cursor: grabbing;
			}

			dialog.right .handle {
				left: 6px;
			}

			dialog.left .handle {
				right: 6px;
			}

			/* Header & Spacing */
			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 1.25rem 1.5rem 0.75rem;
				gap: 0.5rem;
				cursor: grab;
				touch-action: none;
				user-select: none;
			}
			header:active {
				cursor: grabbing;
			}

			.header-start {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				flex: 1;
			}

			.headline {
				font-size: 1.5rem;
				font-weight: 400;
				margin: 0;
				color: var(--on-surface);
			}

			.content {
				flex: 1;
				overflow-y: auto;
				padding: 0 1.5rem 1.5rem;
			}

			footer {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 1rem 1.5rem 1.5rem;
				gap: 0.5rem;
				border-top: 1px solid var(--outline-variant);
			}

			footer.no-border {
				border-top: none !important;
			}

			/* If no footer slot is passed, hide it */
			footer:not(:has(slot[name="footer"])) {
				display: none;
			}
		`
	];

	/**
	 * Renderiza el panel lateral usando un elemento `<dialog>` nativo.
	 *
	 * **Manejo de estados:**
	 * Utiliza clases dinámicas para controlar el lado (`left`/`right`), el modo (`modal`/`standard`),
	 * y el estilo desvinculado (`detached`).
	 *
	 * **Atributo `[open]`:**
	 * La vinculación `?open=${this.open}` añade o remueve el atributo `open` nativo de HTML.
	 * Las transiciones visuales (slide-in/slide-out) son manejadas por el evento `transitionend` 
	 * en el método `updated()` usando la clase `.opened`.
	 */
	override render() {
		const classes = [
			this.side,
			this.modal ? 'modal' : 'standard',
			this.detached ? 'detached' : '',
			this.noBorder ? 'no-border' : ''
		].filter(Boolean).join(' ');

		return html`
			<dialog
				part="dialog"
				?open=${this.open}
				class=${classes}
				@click=${this._onDialogClick}
				@pointerdown=${this._onPointerDown}
				@pointermove=${this._onPointerMove}
				@pointerup=${this._onPointerUp}
				@pointercancel=${this._onPointerCancel}
			>
				${this.withHandle ? html`<div class="handle" aria-hidden="true"></div>` : ''}
				<header part="header">
					<div class="header-start">
						${this.showBack
							? html`
									<moni-button
										variant="icon"
										@click=${this._onBackClick}
										aria-label="Volver"
									>
										<moni-icon>arrow_back</moni-icon>
									</moni-button>
							  `
							: ''}
						<slot name="header">
							<h2 class="headline">${this.title}</h2>
						</slot>
					</div>
					${!this.hideClose
						? html`
								<moni-button
									variant="icon"
									@click=${this._onCloseClick}
									aria-label="Cerrar"
								>
									<moni-icon>close</moni-icon>
								</moni-button>
						  `
						: ''}
				</header>
				<div class="content" part="content">
					<slot></slot>
				</div>
				<footer class=${this.noBorder ? 'no-border' : ''} part="footer">
					<slot name="footer"></slot>
				</footer>
			</dialog>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-side-sheet': MoniSideSheet;
	}
}

export default MoniSideSheet;
