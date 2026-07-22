/**
 * @file components/moni-switch.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';

/**
 * Componente Material Design 3 Switch (Interruptor).
 *
 * Los switches alternan el estado de una configuración individual entre encendido y apagado.
 * Son el equivalente binario encendido/apagado de una casilla de verificación (checkbox),
 * pero optimizados para alternar un solo estado en lugar de seleccionar de una lista.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/switch/specs.md`
 *
 * **Medidas M3:**
 * - Pista (Track): 52dp × 32dp, borde de 2dp, forma de píldora con radio completo.
 * - Control (Thumb): 16dp no seleccionado → 24dp seleccionado → 28dp presionado.
 * - Capa de estado (State layer): ripple circular de 40dp en estados de hover/focus/pressed.
 * - Icono (opcional): icono de 16dp renderizado dentro del control (thumb) cuando `icon` está activado.
 *
 * **Arquitectura visual:**
 * Al igual que `<moni-checkbox>`, el `<input type="checkbox" role="switch">` nativo
 * ocupa espacio real en el diseño pero está oculto visualmente mediante `opacity: 0`. Dos
 * pseudo-elementos de un `<span>` renderizan la pista (`::after`) y el control (`::before`).
 * Cuando `icon=true`, los elementos `<i>` renderizan los glifos `close` y `check` dentro
 * del control, y su visibilidad se alterna mediante CSS en base al estado verificado (checked).
 *
 * @fires change - Burbujea y está compuesto. Se dispara cuando el switch se alterna.
 *                 Lee `element.checked` para obtener el nuevo estado.
 *
 * @example
 * ```html
 * <moni-switch label="Modo oscuro" name="dark-mode"></moni-switch>
 * <moni-switch icon checked label="Notificaciones"></moni-switch>
 *
 * <script>
 *   document.querySelector('moni-switch').addEventListener('change', (e) => {
 *     console.log('activado:', e.target.checked);
 *   });
 * </script>
 * ```
 *
 * @csspart switch - El elemento `<label>` exterior que contiene el switch.
 */
@customElement('moni-switch')
export class MoniSwitch extends MoniElement {
	static formAssociated = true;
	private _internals: ElementInternals;

	constructor() {
		super();
		this._internals = this.attachInternals();
	}

	/**
	 * Etiqueta de texto mostrada a la derecha del switch.
	 *
	 * Cuando no está vacía, se renderiza como un span de texto con padding después de la pista.
	 * Cuando está vacía, se renderiza el slot por defecto, permitiendo etiquetas HTML personalizadas.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) label = '';

	/**
	 * Indica si el switch está en el estado "encendido" (marcado/checked).
	 *
	 * Cuando es `true`:
	 * - La pista se llena con el color `--primary`.
	 * - El control (thumb) crece de 16dp a 24dp y se desliza hacia el borde final (trailing).
	 * - El color del control cambia a `--on-primary`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) checked = false;

	/**
	 * Cuando es `true`, el switch no es interactivo y se renderiza al 50% de opacidad.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) disabled = false;

	/**
	 * Cuando es `true`, renderiza glifos de iconos dentro del control (thumb).
	 *
	 * Utiliza ligaduras de Material Symbols:
	 * - Estado desmarcado (Unchecked): icono `close`.
	 * - Estado marcado (Checked): icono `check`.
	 *
	 * El tamaño del icono (16dp) se establece a través de la propiedad CSS `--_thumb`.
	 *
	 * @default false
	 */
	@property({ type: Boolean, reflect: true }) icon = false;

	/**
	 * Reenviado al atributo nativo `<input name>` para participar en formularios.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) name = '';

	/**
	 * Reenviado al atributo nativo `<input value>`.
	 * El valor enviado en un formulario cuando este switch está marcado.
	 *
	 * @default ''
	 */
	@property({ reflect: true }) value = '';

	/** Referencia directa al elemento input nativo para acceso programático. */
	@query('input') private _input!: HTMLInputElement;

	/**
	 * Sincroniza `checked` y `disabled` de forma imperativa en el input nativo después del renderizado.
	 *
	 * @param changed - Mapa de los nombres de las propiedades modificadas a sus valores anteriores.
	 */
	override updated(changed: Map<string, unknown>) {
		if (this._input) {
			if (changed.has('checked')) {
				this._input.checked = this.checked;
				this._internals.setFormValue(this.checked ? (this.value || 'on') : null);
			}
			if (changed.has('disabled')) this._input.disabled = this.disabled;
		}
	}

	/**
	 * Maneja el evento nativo `change` del input.
	 *
	 * Actualiza `this.checked` y vuelve a despachar un evento `'change'` compuesto
	 * para que burbujee a través de los límites del shadow DOM.
	 *
	 * @param e - El evento nativo `change` desde el `<input>` oculto.
	 */
	private _onChange(e: Event) {
		this.checked = (e.target as HTMLInputElement).checked;
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				font-family: var(--font);
			}

			.switch {
				--_thumb: 1rem; /* 16dp unselected (M3) */
				--_track-w: 3.25rem; /* 52dp */
				--_track-h: 2rem; /* 32dp */
				inline-size: auto;
				block-size: auto;
				line-height: normal;
				white-space: nowrap;
				cursor: pointer;
				display: inline-flex;
				align-items: center;
				direction: ltr;
			}

			/* Input hit area: 52dp × 32dp track */
			.switch > input {
				inline-size: var(--_track-w);
				block-size: var(--_track-h);
				opacity: 0;
				cursor: pointer;
				flex: none;
			}

			/* Text label span */
			.switch > span {
				display: inline-flex;
				align-items: center;
				color: var(--on-surface);
				font-size: 0.875rem;
				position: relative;
			}

			/* Track */
			.switch > span::after {
				content: "";
				position: absolute;
				inset: 50% auto auto 0;
				background-color: var(--surface-container-highest);
				border: 0.125rem solid var(--outline);
				box-sizing: border-box;
				inline-size: var(--_track-w);
				block-size: var(--_track-h);
				border-radius: var(--_track-h);
				/* Shift the track to sit behind the input (input is to the left) */
				transform: translate(calc(-1 * var(--_track-w)), -50%);
				pointer-events: none;
				transition: background-color var(--speed2), border-color var(--speed2);
			}

			/* Thumb (handle) */
			.switch > span::before,
			.switch.icon > span > i {
				position: absolute;
				inset: 50% auto auto 0;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all var(--speed2);
				font-size: calc(var(--_thumb) - 0.25rem);
				user-select: none;
				min-inline-size: var(--_thumb);
				min-block-size: var(--_thumb);
				content: "";
				color: var(--on-surface-variant);
				background-color: var(--outline);
				/* Unchecked: 16dp thumb sits 2dp from track start */
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
				z-index: 2;
				pointer-events: none;
			}

			/* Icon mode uses a 24dp thumb at rest */
			.switch.icon > span > i {
				--_thumb: 1.5rem;
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
				font-family: var(--font-icon);
			}

			/* 40dp circular state layer behind the thumb on hover/focus */
			.switch > span::before,
			.switch.icon > span > i {
				box-shadow: 0 0 0 0 transparent;
			}
			.switch > input:not(:disabled):is(:focus, :hover) + span::before,
			.switch.icon > input:not(:disabled):is(:focus, :hover) + span > i {
				box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--on-surface) 8%, transparent);
			}
			.switch > input:not(:disabled):is(:focus, :hover):checked + span::before,
			.switch.icon > input:not(:disabled):is(:focus, :hover):checked + span > i {
				box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--primary) 12%, transparent);
			}

			/* Checked: track fills with primary */
			.switch > input:checked + span::after {
				border: none;
				background-color: var(--primary);
			}

			/* Checked: thumb grows to 24dp and slides right */
			.switch > input:checked + span::before {
				--_thumb: 1.5rem;
				content: "";
				color: var(--primary);
				background-color: var(--on-primary);
				transform: translate(calc(-1.75rem), -50%);
			}

			/* Checked icon mode: show check icon */
			.switch.icon > input:checked + span > i {
				content: "check";
				color: var(--primary);
				background-color: var(--on-primary);
				transform: translate(-1.75rem, -50%);
				font-family: var(--font-icon);
			}

			/* Active (pressed) states: 28dp thumb */
			.switch > input:active:not(:disabled) + span::before,
			.switch.icon > input:active:not(:disabled) + span > i {
				--_thumb: 1.75rem;
				transform: translate(calc(-1 * var(--_track-w) + 0.25rem), -50%);
			}

			.switch > input:active:checked:not(:disabled) + span::before,
			.switch.icon > input:active:checked:not(:disabled) + span > i {
				--_thumb: 1.75rem;
				transform: translate(-1.625rem, -50%);
			}

			/* Icon mode: toggle visibility of close/check icons */
			.icon > input:checked + span > i:first-child,
			.icon > span > i:last-child {
				opacity: 0;
			}

			.icon > input:checked + span > i:last-child,
			.icon > span > i:first-child {
				opacity: 1;
			}

			/* Disabled */
			.switch > input:disabled + span {
				opacity: 0.5;
				cursor: not-allowed;
			}

			/* Focus outline on the track */
			.switch > :focus-visible + span::after {
				outline: 0.125rem solid var(--primary);
				outline-offset: 0.25rem;
			}
		`
	];

	/**
	 * Renderiza el switch como un `<input type="checkbox">` oculto + pista visual mediante `<span>`.
	 *
	 * El input oculto ocupa espacio de diseño real (para el área de clic/hit area) pero tiene opacidad 0;
	 * el `<span>` proporciona la píldora visual y el control (thumb) (vía `::before`/`::after`).
	 * La vinculación `.checked` asegura que el estado del input en el DOM se mantenga sincronizado con
	 * `this.checked`.
	 */
	override render() {
		return html`<label class=${this.icon ? 'switch icon' : 'switch'} part="switch">
			<input
				type="checkbox"
				role="switch"
				.checked=${this.checked}
				?disabled=${this.disabled}
				name=${ifDefined(this.name || undefined)}
				value=${ifDefined(this.value || undefined)}
				@change=${this._onChange}
			/>
			<span>
				${this.icon ? html`<i>close</i><i>check</i>` : ''}
				${this.label
					? html`<span class="label" part="label">&nbsp;${this.label}</span>`
					: html`<slot></slot>`}
			</span>
		</label>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-switch': MoniSwitch;
	}
}

export default MoniSwitch;
