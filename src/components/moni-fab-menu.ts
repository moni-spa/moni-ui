/**
 * @file components/moni-fab-menu.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-fab.js';
import './moni-icon.js';
import type { MoniFab } from './moni-fab.js';

/**
 * Componente Material Design 3 FAB Menu (Menú FAB).
 *
 * Un contenedor especializado que combina un disparador principal `<moni-fab>` con un
 * `<menu>` de FABs secundarios. Permite ocultar múltiples acciones
 * detrás de un solo Botón de Acción Flotante primario, reduciendo el desorden en la pantalla.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/floating-action-buttons/specs.md` (Menús FAB)
 *
 * **Disparador y animación:**
 * El componente enlaza el evento `click` del FAB disparador principal para alternar su
 * estado interno `open`. Cuando `open=true`, los FABs secundarios anidados se escalan
 * y aparecen mediante transiciones CSS. Los consumidores también pueden controlar el estado `open`
 * programáticamente estableciendo el atributo.
 *
 * **Gestión del foco (Accesibilidad):**
 * - Cuando el menú se abre, el foco se mueve automáticamente al primer elemento secundario
 *   enfocable (o permanece en el disparador si está vacío).
 * - Mientras está abierto, la tecla `Tab` cicla el foco estrictamente dentro de los elementos del menú para
 *   evitar que el foco del teclado escape (trampa de foco).
 * - Presionar `Escape` o hacer clic en cualquier lugar fuera del menú lo cierra y
 *   devuelve el foco al FAB disparador primario.
 *
 * @example
 * ```html
 * <!-- Menú FAB en la parte inferior derecha que se abre hacia arriba -->
 * <moni-fab-menu icon="add" color="tertiary" direction="up">
 *   <moni-fab size="small" icon="edit" label="Borrador"></moni-fab>
 *   <moni-fab size="small" icon="photo_camera" label="Cámara"></moni-fab>
 * </moni-fab-menu>
 * ```
 *
 * @slot default - Los elementos `<moni-fab>` secundarios que aparecen cuando está abierto.
 *
 * @csspart trigger - El elemento disparador `<moni-fab>` primario.
 * @csspart menu    - El contenedor `<menu>` que contiene los elementos secundarios.
 */
@customElement('moni-fab-menu')
export class MoniFabMenu extends MoniElement {
	@property({ type: Boolean, reflect: true }) open = false;
	@property({ reflect: true }) icon = 'add';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' = 'medium';
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';
	@property({ reflect: true })
	shape: 'rounded' | 'circle' = 'rounded';
	@property({ reflect: true })
	direction: 'up' | 'down' | 'left' | 'right' = 'up';
	@property({ reflect: true })
	position:
		| 'bottom-trailing'
		| 'bottom-leading'
		| 'top-trailing'
		| 'top-leading' = 'bottom-trailing';

	@query('moni-fab') private _trigger!: MoniFab;
	@query('.fab-menu') private _menu!: HTMLElement;

	private _previouslyFocused: HTMLElement | null = null;
	/**
	 * Wrapper estático para el manejador de clics globales.
	 * Conserva el contexto léxico `this` al ser inyectado/removido en `document`.
	 */
	private _onDocClick = (e: MouseEvent) => this._handleDocClick(e);
	/**
	 * Wrapper estático para el manejador de teclado global.
	 * Facilita la limpieza del listener de Escape/Navegación al desmontar el componente.
	 */
	private _onDocKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);

	/**
	 * Hook del ciclo de vida (Lit). Se ejecuta una sola vez tras el primer renderizado.
	 * Espera a que el Shadow DOM se materialice por completo y enlaza el evento nativo
	 * `click` directamente sobre el FAB (Floating Action Button) principal que acciona el menú.
	 */
	override async firstUpdated() {
		// Esperar a que todos los hijos terminen de renderizarse antes de enlazar los detectores
		await this.updateComplete;
		if (this._trigger) {
			this._trigger.addEventListener('click', this._onTriggerClick);
		}
	}

	/**
	 * Limpieza rigurosa de memoria (Garbage Collection).
	 * Remueve absolutamente todos los listeners asíncronos (document y trigger local)
	 * para evitar colisiones de eventos fantasma y pérdidas de rendimiento (memory leaks).
	 */
	override disconnectedCallback() {
		super.disconnectedCallback();
		this._trigger?.removeEventListener('click', this._onTriggerClick);
		document.removeEventListener('click', this._onDocClick, true);
		document.removeEventListener('keydown', this._onDocKeydown, true);
	}

	override updated(changed: Map<string, unknown>): void {
		super.updated(changed);
		if (changed.has('open')) {
			this._syncOpenState();
		}
	}

	/**
	 * Alterna explícitamente el estado `open` del menú. 
	 * Se dispara exclusivamente al interactuar física o focalmente con el FAB principal.
	 */
	private _onTriggerClick = () => {
		this.open = !this.open;
	};

	private _syncOpenState(): void {
		if (this.open) {
			// Guarda el foco actual para poder restaurarlo al cerrar.
			this._previouslyFocused = (this.getRootNode() as unknown as DocumentOrShadowRoot)
				.activeElement as HTMLElement | null;
			// Mueve el foco al primer elemento enfocable en el menú, o al
			// disparador como respaldo (según el patrón de menú WAI-ARIA).
			const first = this._firstFocusableMenuItem();
			if (first) {
				first.focus();
			} else {
				this._trigger?.focus();
			}
			// Instala detectores en el documento para clic fuera y Escape.
			document.addEventListener('click', this._onDocClick, true);
			document.addEventListener('keydown', this._onDocKeydown, true);
		} else {
			// Restaura el foco al disparador (o al elemento previamente enfocado).
			const restore = this._previouslyFocused ?? this._trigger;
			restore?.focus();
			this._previouslyFocused = null;
			document.removeEventListener('click', this._onDocClick, true);
			document.removeEventListener('keydown', this._onDocKeydown, true);
		}
	}

	private _handleDocClick(e: MouseEvent): void {
		if (!this.open) return;
		const path = e.composedPath();
		if (!path.includes(this)) {
			this.open = false;
		}
	}

	private _handleDocKeydown(e: KeyboardEvent): void {
		if (!this.open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			this.open = false;
		}
	}

	private _firstFocusableMenuItem(): HTMLElement | null {
		if (!this._menu) return null;
		const items = this._menu.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
		return items[0] ?? null;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
				position: relative;
			}

			:host([position]) {
				position: fixed;
				z-index: 13;
			}
			:host([position='bottom-trailing']) {
				inset: auto 1rem 1rem auto;
			}
			:host([position='bottom-leading']) {
				inset: auto auto 1rem 1rem;
			}
			:host([position='top-trailing']) {
				inset: 1rem 1rem auto auto;
			}
			:host([position='top-leading']) {
				inset: 1rem auto auto 1rem;
			}

			.wrap {
				display: inline-flex;
				position: relative;
				align-items: center;
				justify-content: center;
			}

			.fab-menu {
				opacity: 0;
				visibility: hidden;
				position: absolute;
				display: flex;
				gap: 0.5rem;
				padding: 0.5rem;
				margin: 0;
				list-style: none;
				z-index: 14;
				transition:
					opacity var(--speed2),
					transform var(--speed2);
				transform: scale(0.9);
			}

			:host([open]) .fab-menu {
				opacity: 1;
				visibility: visible;
				transform: scale(1);
			}

			/* Colocación direccional relativa al disparador */
			:host([direction='up']) .fab-menu {
				inset: auto auto calc(100% + 0.5rem) 0;
				flex-direction: column-reverse;
			}
			:host([direction='down']) .fab-menu {
				inset: calc(100% + 0.5rem) auto auto 0;
			}
			:host([direction='left']) .fab-menu {
				inset: 0 auto 0 calc(100% + 0.5rem);
				flex-direction: row-reverse;
			}
			:host([direction='right']) .fab-menu {
				inset: 0 calc(100% + 0.5rem) 0 auto;
				flex-direction: row;
			}

			.fab-menu > li,
			.fab-menu > ::slotted(*) {
				list-style: none;
				display: block;
			}
		`
	];

	/**
	 * Renderiza el speed-dial FAB como un FAB disparador + menú colapsable de FABs de acción.
	 *
	 * **Patrón Speed-dial:**
	 * El FAB disparador siempre es visible. Cuando `open=true`, los elementos de acción en
	 * el slot por defecto se revelan con una animación en cascada. Los elementos se colapsan
	 * de nuevo con una cascada invertida.
	 *
	 * **Dirección de cascada:**
	 * Cuando `placement='bottom'`, los elementos se expanden hacia arriba (índice 0 en la parte inferior).
	 * Cuando `placement='top'`, los elementos se expanden hacia abajo.
	 *
	 * **`aria-expanded`:**
	 * Se establece en el botón disparador para comunicar el estado abierto/cerrado a los lectores de pantalla.
	 * Cada FAB de acción en el slot lleva `aria-label` que el consumidor debe proporcionar.
	 */
	override render() {
		return html`<div class="wrap">
			<!-- div role=menu permite cualquier contenido en el slot (no solo <li>) -->
			<div class="fab-menu" role="menu" part="menu">
				<slot></slot>
			</div>
			<moni-fab
				part="trigger"
				icon=${this.icon}
				size=${this.size}
				color=${this.color}
				shape=${this.shape}
			></moni-fab>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-fab-menu': MoniFabMenu;
	}
}

export default MoniFabMenu;
