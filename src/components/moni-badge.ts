/**
 * @file components/moni-badge.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Componente Material Design 3 Badge.
 *
 * Los badges son pequeños descriptores de estado anclados a un elemento padre, usados para
 * transmitir información suplementaria como un conteo de notificaciones, estado
 * en línea, o indicador de selección.
 *
 * **Contrato de posicionamiento:**
 * El badge usa `position: absolute` y se ancla al elemento padre.
 * En `connectedCallback`, si el `position` computado del padre es `'static'`,
 * el badge automáticamente establece `parent.style.position = 'relative'`.
 * Los consumidores no necesitan añadir manualmente `position: relative` al padre.
 *
 * **Modelo de renderizado:**
 * El `:host` se muestra como `contents`, haciéndolo transparente para el layout.
 * Solo el span interior `.badge` se renderiza visualmente. Esto permite que el badge
 * se inserte dentro de cualquier elemento sin afectar su flujo de layout.
 *
 * @example
 * ```html
 * <!-- Badge de notificación en un botón -->
 * <div style="position: relative; display: inline-flex;">
 *   <moni-button icon="notifications" variant="text"></moni-button>
 *   <moni-badge value="5"></moni-badge>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- Badge de punto en línea para estado -->
 * <moni-badge shape="min" color="primary" inline></moni-badge>
 * Conectado
 * ```
 *
 * @csspart badge - El elemento `<span>` del badge. Sobrescribe `background-color`,
 *                  `color`, o `border-radius` para personalizar la apariencia.
 */
@customElement('moni-badge')
export class MoniBadge extends MoniElement {
	/**
	 * Contenido de texto de la etiqueta del badge.
	 *
	 * También acepta contenido en el slot — el slot por defecto dentro del span del badge
	 * usa este valor cuando no hay hijos proporcionados en el slot.
	 * Usa un string vacío con `shape="min"` para renderizar un badge de solo punto.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/**
	 * Posición de anclaje relativa a los bordes del elemento padre.
	 *
	 * Usa `inset: 50% auto auto 50%` como base y ajusta la traslación:
	 * - `''` (por defecto) — esquina superior derecha (translate: 0, -100%).
	 * - `'top'`    — igual que por defecto, alias explícito.
	 * - `'bottom'` — esquina inferior derecha (translate: 0, 0).
	 * - `'left'`   — esquina superior izquierda (translate: -100%, -100%).
	 * - `'right'`  — esquina superior derecha (translate: 0, -100%).
	 * - `'none'`   — deshabilita el posicionamiento absoluto; ver también el atributo `inline`.
	 *
	 * @default ''
	 */
	@property({ reflect: true })
	position: 'top' | 'bottom' | 'left' | 'right' | 'none' | '' = '';

	/**
	 * Forma del contenedor del badge.
	 *
	 * - `''` (por defecto) — Forma de píldora redondeada (border-radius: 1rem).
	 * - `'circle'`     — Alias para píldora; el badge siempre es circular cuando el
	 *                    contenido es un solo carácter o está ausente.
	 * - `'square'`     — Sin border-radius (badge angular).
	 * - `'min'`        — Solo punto; el contenido se oculta mediante `display: none` y la
	 *                    forma se recorta a un círculo pequeño mediante `clip-path`.
	 *
	 * @default ''
	 */
	@property({ reflect: true })
	shape: 'circle' | 'square' | 'min' | '' = '';

	/**
	 * Rol de color semántico del badge.
	 *
	 * Se asigna a los roles de la paleta de colores M3:
	 * - `'error'` (por defecto) — Rojo; estándar para conteos de notificaciones y alertas.
	 * - `'primary'`         — Color primario de la marca; para estados activos o de selección.
	 * - `'secondary'`       — Acento secundario; para indicadores suplementarios.
	 * - `'tertiary'`        — Acento terciario; para badges decorativos o informativos.
	 *
	 * @default 'error'
	 */
	@property({ reflect: true })
	color: 'primary' | 'secondary' | 'tertiary' | 'error' = 'error';

	/**
	 * Cuando es `true`, el badge se renderiza en línea (restablece `position: absolute` a
	 * `position: relative`) en lugar de anclarse al padre.
	 *
	 * Equivalente a la clase `.badge.none` de BeerCSS. Úsalo para indicadores de estado en línea
	 * que fluyen dentro de texto o contenedores flex.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) inline = false;

	/**
	 * Cuando está presente, renderiza el badge con un estilo delineado:
	 * - El fondo se convierte en `--surface` (igual que el fondo de la página).
	 * - El borde y el color del texto usan el token de color de la paleta (ej. `--error`).
	 *
	 * Equivalente a la clase `.badge.border` de BeerCSS.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) border = false;

	/**
	 * Hook de ciclo de vida de Lit.
	 * Mutación imperativa del DOM padre para garantizar el sistema de anclaje (CSS Position).
	 * Un badge por defecto usa position: absolute. Si su contenedor padre es estático,
	 * el badge "escaparía" hasta el body. Esto detecta el computed style y fuerza
	 * un contexto de apilamiento relativo para encapsularlo.
	 */
	override connectedCallback() {
		super.connectedCallback();
		const parent = this.parentElement;
		if (parent) {
			const computed = getComputedStyle(parent);
			if (computed.position === 'static') {
				parent.style.position = 'relative';
			}
		}
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
				font-family: var(--font);
			}

			/* BeerCSS .badge */
			.badge {
				--_x: 0;
				--_y: -100%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				font-size: 0.6875rem;
				z-index: 2;
				padding: 0 0.25rem;
				min-block-size: 1rem;
				min-inline-size: 1rem;
				background-color: var(--error);
				color: var(--on-error);
				line-height: normal;
				border-radius: 1rem;
				/* BeerCSS: inset:50% auto auto 50% + translate */
				inset: 50% auto auto 50%;
				transform: translate(var(--_x, 0), var(--_y, -100%));
				font-family: var(--font);
				box-sizing: border-box;
			}

			/* Position variants — BeerCSS */
			.badge.top    { --_y: -100%; }
			.badge.bottom { --_y: 0; }
			.badge.left   { --_x: -100%; }
			.badge.right  { --_x: 0; }

			/* BeerCSS .badge.none = inline positioning */
			.badge.none {
				inset: auto !important;
				transform: none;
				position: relative;
				margin: 0 0.125rem;
			}

			/* Color variants */
			:host([color='primary'])   .badge { background-color: var(--primary);   color: var(--on-primary); }
			:host([color='secondary']) .badge { background-color: var(--secondary); color: var(--on-secondary); }
			:host([color='tertiary'])  .badge { background-color: var(--tertiary);  color: var(--on-tertiary); }
			:host([color='error'])     .badge { background-color: var(--error);     color: var(--on-error); }

			/* BeerCSS .badge.border */
			:host([border]) .badge {
				border-color: var(--error);
				color: var(--error);
				background-color: var(--surface);
			}
			:host([border][color='primary'])   .badge { border-color: var(--primary);   color: var(--primary); }
			:host([border][color='secondary']) .badge { border-color: var(--secondary); color: var(--secondary); }
			:host([border][color='tertiary'])  .badge { border-color: var(--tertiary);  color: var(--tertiary); }

			/* Shape variants */
			.badge.square { border-radius: 0; }

			/* BeerCSS .badge.min — dot only, content hidden */
			.badge.min > * { display: none; }
			.badge.min { clip-path: circle(18.75% at 50% 50%); }
		`
	];

	/**
	 * Renderiza el span del badge con la lista de clases computada.
	 *
	 * Composición de clases:
	 * - `'badge'`       — siempre presente (estilos base).
	 * - `this.position` — clase de variante de posición (ej. `'bottom'`, `'left'`).
	 * - `this.shape`    — clase de variante de forma (ej. `'min'`, `'square'`).
	 * - `'none'`        — se añade cuando `inline=true` para restablecer el posicionamiento absoluto.
	 *
	 * Los valores falsos se filtran para que no aparezcan espacios extra en el string de clases.
	 * El slot por defecto usa el nodo de texto del atributo `value` como respaldo.
	 */
	override render() {
		const classes = [
			'badge',
			this.position || '',
			this.shape || '',
			this.inline ? 'none' : ''
		].filter(Boolean).join(' ');

		return html`<span class=${classes} part="badge">
			<slot>${this.value}</slot>
		</span>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-badge': MoniBadge;
	}
}

export default MoniBadge;
