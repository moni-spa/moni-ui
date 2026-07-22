/**
 * @file components/moni-app-bar.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 App Bar.
 *
 * Las barras de aplicación proporcionan navegación y controles de acción en la parte superior (o inferior) de una
 * pantalla. Se posicionan fijas (sticky) por defecto para que permanezcan visibles mientras el
 * usuario hace scroll a través del contenido.
 *
 * **Referencia de la especificación M3:** `m3-docs/components/app-bars/specs.md`
 *
 * **Posicionamiento:**
 * - `top` (por defecto) — Encabezado de 64dp fijo arriba del contenido de la página. Usa `position: sticky`
 *   con `inset-block-start: 0` para que se mantenga en la parte superior del contenedor.
 * - `bottom` — Pie de navegación móvil anclado a la parte inferior de la ventana.
 *   Ideal para albergar iconos de navegación primarios y un botón FAB opcional.
 *
 * **Variantes:**
 * - `standard` — Superficie plana (sin sombra) cuando el contenido está arriba. Ideal para la mayoría de UIs.
 * - `floating` — Siempre elevada con sombra `--elevate2`. Úsalo cuando la barra visualmente
 *   flota sobre el contenido independientemente de la posición del scroll.
 *
 * **Tamaños:**
 * - `default` — 64dp (4rem) de alto. Estándar para la mayoría de casos de uso.
 * - `prominent` — 152dp (9.5rem) de alto. Úsalo cuando se necesita un subtítulo o un área expandida.
 *   El atributo `subtitle` solo se renderiza en este tamaño.
 *
 * @example
 * ```html
 * <!-- Top app bar con icono de navegación y botones de acción -->
 * <moni-app-bar title="Ajustes">
 *   <moni-button slot="leading" shape="circle" variant="text" icon="menu"></moni-button>
 *   <moni-button slot="trailing" shape="circle" variant="text" icon="search"></moni-button>
 *   <moni-button slot="trailing" shape="circle" variant="text" icon="more_vert"></moni-button>
 * </moni-app-bar>
 * ```
 *
 * @example
 * ```html
 * <!-- App bar prominente con subtítulo -->
 * <moni-app-bar size="prominent" title="Bandeja de entrada" subtitle="12 mensajes no leídos" elevated>
 * </moni-app-bar>
 * ```
 *
 * @slot leading   - Icono(s) de navegación colocados en el borde inicial (start).
 * @slot trailing  - Icono(s) de acción colocados en el borde final (end).
 * @slot fab       - FAB anclado al borde final (solo con posición inferior).
 * @slot default   - Contenido adicional (ej. una barra de pestañas debajo de la fila del título).
 *
 * @csspart bar      - El contenedor grid interno.
 * @csspart leading  - El envoltorio del slot leading.
 * @csspart trailing - El envoltorio del slot trailing.
 * @csspart title    - El elemento de texto del título.
 * @csspart subtitle - El elemento de texto del subtítulo (solo tamaño prominente).
 * @csspart actions  - El envoltorio de las acciones (solo tamaño prominente).
 */
@customElement('moni-app-bar')
export class MoniAppBar extends MoniElement {
	/**
	 * Determina si la barra se coloca en la parte superior o inferior de la pantalla.
	 *
	 * - `'top'` (por defecto) — Encabezado pegajoso (sticky) en la parte superior del contenedor de scroll.
	 * - `'bottom'` — Pie fijo; usado principalmente para patrones de navegación inferior móvil.
	 *
	 * @default 'top'
	 */
	@property({ reflect: true })
	placement: 'top' | 'bottom' = 'top';

	/**
	 * Variante visual de la app bar.
	 *
	 * - `'standard'` (por defecto) — Superficie plana. Sin sombra en reposo; gana sombra
	 *   programáticamente a través del atributo `elevated` cuando el contenido se desplaza por debajo de ella.
	 * - `'floating'` — Permanentemente elevada con sombra `--elevate2`.
	 *
	 * @default 'standard'
	 */
	@property({ reflect: true })
	variant: 'standard' | 'floating' = 'standard';

	/**
	 * Variante de altura de la app bar.
	 *
	 * - `'default'` — 64dp (4rem). Altura estándar de la top app bar de M3.
	 * - `'prominent'` — 152dp (9.5rem). Úsalo cuando se muestra un subtítulo o cuando
	 *   se necesita espacio vertical adicional para una fila de acciones contextuales.
	 *
	 * @default 'default'
	 */
	@property({ reflect: true })
	size: 'default' | 'prominent' = 'default';

	/**
	 * Texto del título mostrado en el centro de la app bar.
	 *
	 * El título está alineado al centro según la especificación de M3. Los títulos largos se truncan con
	 * puntos suspensivos. Para un HTML semántico, el consumidor también debería proporcionar un `<h1>`
	 * en el contenido de la página que coincida con este título.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) title = '';

	/**
	 * Subtítulo opcional mostrado debajo del título.
	 *
	 * Solo se renderiza cuando `size="prominent"`. Proporciona contexto secundario
	 * (ej. nombre de carpeta, recuento de elementos, descripción).
	 *
	 * @default ''
	 */
	@property({ reflect: true }) subtitle = '';

	/**
	 * Cuando está presente, aplica una sombra `--elevate2` para señalar que el contenido se
	 * ha desplazado por debajo de la barra.
	 *
	 * Los consumidores son responsables de alternar este atributo reactivamente basándose en
	 * la posición de desplazamiento (scroll) del área de contenido principal:
	 * ```ts
	 * container.addEventListener('scroll', () => {
	 *   appBar.elevated = container.scrollTop > 0;
	 * });
	 * ```
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) elevated = false;

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				background-color: var(--surface);
				color: var(--on-surface);
				position: sticky;
				inset-block-start: 0;
				z-index: 30;
				transition:
					box-shadow var(--speed2),
					block-size var(--speed2);
			}

			:host([placement='bottom']) {
				inset-block-start: auto;
				inset-block-end: 0;
			}

			:host([variant='floating']),
			:host([elevated]) {
				box-shadow: var(--elevate2);
			}

			.bar {
				display: grid;
				grid-template-columns: auto 1fr auto;
				grid-template-rows: auto auto;
				align-items: center;
				column-gap: 0.5rem;
				padding-inline: 1rem;
				block-size: 4rem;
				min-block-size: 4rem;
			}

			:host([size='prominent']) .bar {
				block-size: 9.5rem;
				min-block-size: 9.5rem;
				grid-template-rows: auto auto auto;
			}

			.leading,
			.trailing {
				display: flex;
				gap: 0.25rem;
				align-items: center;
				justify-content: center;
				min-inline-size: 3rem;
				block-size: 3rem;
			}
			.leading { justify-content: flex-start; }
			.trailing { justify-content: flex-end; }

			.title {
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
				text-align: center;
				color: var(--on-surface);
				grid-column: 2;
				grid-row: 1;
				padding: 0 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			:host([size='prominent']) .title {
				grid-row: 2;
				align-self: end;
				font-size: 1.375rem;
			}

			.subtitle {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.007em;
				text-align: center;
				color: var(--on-surface-variant);
				grid-column: 2;
				grid-row: 3;
				padding: 0 1rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.actions {
				grid-column: 1 / -1;
				grid-row: 3;
				display: flex;
				gap: 0.5rem;
				padding-block-start: 0.5rem;
			}

			::slotted([slot='fab']) {
				position: absolute;
				inset-block-end: 1rem;
				inset-inline-end: 1rem;
			}
		`
	];

	/**
	 * Renderiza el diseño de CSS Grid de 3 columnas de la app bar.
	 *
	 * **Anatomía del Grid (`grid-template-columns: auto 1fr auto`):**
	 * - Column 1 (`.leading`) — auto-width; contains the navigation icon slot.
	 * - Column 2 (`.title`) — `1fr` flex-growing center column; the title is
	 *   center-aligned via `text-align: center`.
	 * - Column 3 (`.trailing`) — auto-width; contains action icon slots.
	 *
	 * **Prominent mode extensions (`size='prominent'`):**
	 * - A subtitle element is conditionally rendered in grid row 3 below the title.
	 * - An `actions` slot (grid-column: 1 / -1) spans the full width of row 3,
	 *   allowing a contextual action row (e.g., a tab bar or search field) below
	 *   the title/subtitle pair.
	 * - `hasSubtitle` gates the subtitle element to avoid an empty DOM node.
	 * - `hasActions` is always true in `prominent` mode (the slot itself is empty
	 *   unless content is slotted by the consumer).
	 *
	 * **FAB slot:**
	 * The `fab` named slot is absolutely positioned via CSS (see `::slotted([slot='fab'])`)
	 * to the bottom-end of the bar, supporting the M3 bottom app bar + FAB pattern.
	 */
	override render() {
		const hasSubtitle = this.size === 'prominent' && Boolean(this.subtitle);
		const hasActions = Boolean(this.size === 'prominent');
		return html`
			<div class="bar" part="bar">
				<div class="leading" part="leading">
					<slot name="leading"></slot>
				</div>
				<div class="title" part="title">${this.title}</div>
				<div class="trailing" part="trailing">
					<slot name="trailing"></slot>
				</div>
				${hasSubtitle
					? html`<div class="subtitle" part="subtitle">${this.subtitle}</div>`
					: nothing}
				${hasActions
					? html`<div class="actions" part="actions">
							<slot name="actions"></slot>
						</div>`
					: nothing}
				<slot name="fab"></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-app-bar': MoniAppBar;
	}
}

export default MoniAppBar;