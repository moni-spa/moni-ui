/**
 * @file components/moni-time-picker.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-button.js';

/**
 * Componente Material Design 3 Time Picker (Selector de hora).
 *
 * Un control altamente interactivo que permite a los usuarios seleccionar una hora específica.
 * Proporciona dos modos de entrada distintos:
 * 1. **Modo dial (analógico):** Una carátula de reloj interactiva donde los usuarios pueden arrastrar o hacer clic
 *    para seleccionar horas y minutos.
 * 2. **Modo input (texto):** Entradas de texto estándar para una introducción precisa por teclado.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/time-pickers/specs.md`
 *
 * **Formatos de hora y modos:**
 * - La propiedad `value` espera y siempre emite un string en formato de 24 horas
 *   (`HH:MM`, ej. `"14:30"`).
 * - Establecer `use-24-hour` configura la presentación visual para usar un
 *   reloj de 24 horas (anillos interior y exterior) y elimina el selector AM/PM. De lo contrario,
 *   utiliza un dial estándar de 12 horas con un selector AM/PM.
 *
 * **Diseño responsivo:**
 * El atributo `orientation` configura el diseño. `vertical` apila la
 * visualización de la hora sobre la carátula del reloj, `horizontal` los coloca lado a lado,
 * y `auto` responde automáticamente al ancho del contenedor/viewport.
 *
 * @fires change - Se dispara cuando la hora seleccionada cambia interactivamente. El
 *                 `detail.value` contiene la nueva hora en formato `HH:MM`.
 * @fires cancel - Se dispara cuando se hace clic en el botón 'Cancelar'.
 * @fires ok     - Se dispara cuando se hace clic en el botón 'OK'. El `detail.value`
 *                 contiene la hora final confirmada.
 *
 * @example
 * ```html
 * <!-- Formato 12 horas (AM/PM) -->
 * <moni-time-picker value="14:30"></moni-time-picker>
 *
 * <!-- Formato 24 horas -->
 * <moni-time-picker use-24-hour value="14:30"></moni-time-picker>
 * ```
 */
@customElement('moni-time-picker')
export class MoniTimePicker extends MoniElement {
	@property({ reflect: true }) value = '00:00';
	@property({ type: Boolean, reflect: true, attribute: 'use-24-hour' }) use24Hour = false;
	@property({ reflect: true }) mode: 'dial' | 'input' = 'dial';
	@property({ reflect: true }) orientation: 'vertical' | 'horizontal' | 'auto' = 'auto';

	@state() private activeSelection: 'hour' | 'minute' = 'hour';
	@state() private period: 'AM' | 'PM' = 'AM';

	@state() private currentHour = 0; // 0-23
	@state() private currentMinute = 0; // 0-59

	@query('.clock-face') private clockFaceEl?: HTMLDivElement;

	private isDragging = false;

	/**
	 * Hook del ciclo de vida (Lit) previo al renderizado.
	 * 
	 * Si la propiedad externa `value` o el modo `use24Hour` cambian (vía binding o atributo HTML),
	 * dispara el `parseValue()` de inmediato para mantener sincronizado el estado interno de 
	 * horas y minutos (y recalcular AM/PM) antes de mutar el DOM real.
	 */
	protected override willUpdate(changedProperties: PropertyValues) {
		if (changedProperties.has('value') || changedProperties.has('use24Hour')) {
			this.parseValue();
		}
	}

	/**
	 * Interpreta el string `value` (formato "HH:MM") y lo descompone en enteros para
	 * el estado interno. Automáticamente corrige valores fuera de rango y determina
	 * si estamos en AM o PM (cuando no se usa formato de 24 horas).
	 */
	private parseValue() {
		const parts = this.value.split(':');
		let h = parseInt(parts[0], 10);
		let m = parseInt(parts[1], 10);

		if (isNaN(h) || h < 0 || h > 23) h = 0;
		if (isNaN(m) || m < 0 || m > 59) m = 0;

		this.currentHour = h;
		this.currentMinute = m;

		if (!this.use24Hour) {
			if (h >= 12) {
				this.period = 'PM';
			} else {
				this.period = 'AM';
			}
		}
	}

	/**
	 * Reconstruye el string `value` a partir del estado interno (`currentHour`, `currentMinute`).
	 * Formatea con ceros a la izquierda e incluye la lógica de conversión AM/PM a 24hrs
	 * para garantizar que el valor expuesto hacia afuera sea siempre un estándar ISO ("14:30").
	 */
	private updateValue() {
		let h = this.currentHour;
		const m = this.currentMinute;

		if (!this.use24Hour) {
			if (this.period === 'PM') {
				if (h < 12) h += 12;
			} else {
				if (h === 12) h = 0;
				else if (h > 12) h -= 12; // Ajuste por si quedó fuera de límites
			}
		}

		const formattedHour = String(h).padStart(2, '0');
		const formattedMinute = String(m).padStart(2, '0');
		this.value = `${formattedHour}:${formattedMinute}`;

		this.dispatchEvent(new CustomEvent('change', {
			detail: { value: this.value },
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Alterna el modo de interacción visual entre el Reloj Analógico (dial) 
	 * y el modo de Entrada de Texto manual (input).
	 */
	private toggleMode() {
		this.mode = this.mode === 'dial' ? 'input' : 'dial';
	}

	/**
	 * Define el nivel de selección activo ('hour' o 'minute').
	 * Cambia dinámicamente qué anillo o qué matemáticas (12 vs 60 items)
	 * utilizará el componente principal y el reloj.
	 */
	private setSelection(type: 'hour' | 'minute') {
		this.activeSelection = type;
	}

	/**
	 * Cambia forzosamente el periodo del día ('AM' o 'PM') cuando el usuario 
	 * presiona los conmutadores laterales (sólo visible en formato 12h).
	 * Inmediatamente propaga el cambio hacia `updateValue()` para recalcular
	 * y despachar la hora formateada.
	 */
	private setPeriod(p: 'AM' | 'PM') {
		this.period = p;
		this.updateValue();
	}

	// Clock Math and Interaction
	/**
	 * Inicia el proceso de arrastre en la carátula del reloj (Pointer Down).
	 * Utiliza `setPointerCapture` nativo para asegurar que el movimiento (drag) siga
	 * siendo rastreado aunque el puntero del usuario salga físicamente del contenedor,
	 * garantizando una interacción "Touch" a prueba de errores.
	 */
	private handleClockPointerDown(e: PointerEvent) {
		if (!this.clockFaceEl) return;
		this.isDragging = true;
		this.clockFaceEl.classList.add('dragging');
		this.clockFaceEl.setPointerCapture(e.pointerId);
		this.handleClockPointerMove(e);
	}

	/**
	 * Corazón matemático del reloj radial (Time Picker analógico).
	 * Convierte las coordenadas cartesianas del ratón/dedo en un ángulo polar (0-360º),
	 * y dependiendo si medimos horas o minutos, lo mapea al número correspondiente.
	 */
	private handleClockPointerMove(e: PointerEvent) {
		if (!this.isDragging || !this.clockFaceEl) return;
		
		const rect = this.clockFaceEl.getBoundingClientRect();
		// Encontramos el centro geométrico absoluto del reloj
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const dx = e.clientX - centerX;
		const dy = e.clientY - centerY;
		// Teorema de Pitágoras para saber a qué distancia del centro está apuntando el usuario
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Calculamos el ángulo en grados partiendo desde las 12 (sentido horario).
		// Math.atan2 devuelve de -PI a PI, sumamos 90º para desfasar el origen arriba (eje Y).
		let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
		if (angle < 0) angle += 360;

		if (this.activeSelection === 'hour') {
			if (this.use24Hour) {
				// Reloj de 24 horas M3: Un círculo externo (13-00) y uno interno (1-12)
				// El umbral (0.32) fue medido visualmente para coincidir con el diseño radial interno.
				const isInner = distance < rect.width * 0.32;
				let hour = Math.round(angle / 30) % 12; // 360 / 12 horas = 30 grados por hora
				if (hour === 0) hour = 12;

				if (isInner) {
					// Círculo interno: 1 a 12 (AM/PM)
					this.currentHour = hour;
				} else {
					// Círculo externo: 13 a 24 (donde las 24 = 0)
					this.currentHour = hour === 12 ? 0 : hour + 12;
				}
			} else {
				// Reloj estándar de 12 horas: solo 1 a 12
				let hour = Math.round(angle / 30) % 12;
				if (hour === 0) hour = 12;
				this.currentHour = hour;
			}
		} else {
			// Modo minutos: 360 / 60 minutos = 6 grados por minuto
			const minute = Math.round(angle / 6) % 60;
			this.currentMinute = minute;
		}

		this.updateValue();
	}

	/**
	 * Finaliza la interacción de arrastre en la carátula del reloj (Pointer Up).
	 * 
	 * Como heurística de usabilidad, si el usuario acaba de seleccionar la Hora,
	 * el componente espera 300ms y automáticamente transiciona a la vista de Minutos.
	 * Esto reduce los clics necesarios en interacciones de Time Pickers de un solo toque.
	 */
	private handleClockPointerUp() {
		if (this.isDragging) {
			this.isDragging = false;
			this.clockFaceEl?.classList.remove('dragging');
			if (this.activeSelection === 'hour') {
				// Cambiar automáticamente a la selección de minutos después de elegir la hora
				setTimeout(() => {
					this.activeSelection = 'minute';
				}, 300);
			}
		}
	}

	/**
	 * Handler para entradas directas desde el `<input>` de horas (Modo 'input' texto).
	 * Implementa clamping (límites mínimos y máximos) para asegurar que el usuario
	 * nunca pueda introducir valores erróneos mayores a 23h o menores a 0h.
	 */
	private handleHourInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = parseInt(target.value, 10);
		if (isNaN(val)) val = 0;

		if (this.use24Hour) {
			if (val < 0) val = 0;
			if (val > 23) val = 23;
			this.currentHour = val;
		} else {
			if (val < 1) val = 1;
			if (val > 12) val = 12;
			this.currentHour = val;
		}
		this.updateValue();
	}

	/**
	 * Handler para entradas directas desde el `<input>` de minutos (Modo 'input' texto).
	 * Trunca cualquier input alfanumérico a enteros y realiza un clamp a 0-59.
	 */
	private handleMinuteInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = parseInt(target.value, 10);
		if (isNaN(val)) val = 0;
		if (val < 0) val = 0;
		if (val > 59) val = 59;
		this.currentMinute = val;
		this.updateValue();
	}



	static override styles = [
		sharedStyles,
		css`
			:host {
				display: inline-flex;
				flex-direction: column;
				background-color: transparent;
				inline-size: 20.5rem;
				color: var(--on-surface);
				font-family: var(--font);
				user-select: none;
			}

			/* Forced orientations */
			:host([orientation="vertical"]) {
				inline-size: 20.5rem;
			}
			:host([orientation="vertical"]) .main-content {
				flex-direction: column;
			}

			:host([orientation="horizontal"]) {
				inline-size: auto;
			}
			:host([orientation="horizontal"]) .main-content {
				flex-direction: row;
				align-items: center;
				gap: 2rem;
			}
			:host([orientation="horizontal"]) .left-pane {
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			/* Main Content (Default vertical) */
			.main-content {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}

			/* Auto Responsive Layout */
			@media (min-width: 32rem) {
				:host([orientation="auto"]) .main-content,
				:host(:not([orientation])) .main-content {
					flex-direction: row;
					align-items: center;
					gap: 2rem;
				}
				:host([orientation="auto"]),
				:host(:not([orientation])) {
					inline-size: auto;
				}
				:host([orientation="auto"]) .left-pane,
				:host(:not([orientation])) .left-pane {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}

			@keyframes fadeInScale {
				from {
					opacity: 0;
					transform: scale(0.92);
				}
				to {
					opacity: 1;
					transform: scale(1);
				}
			}

			.clock-container,
			.time-display-container,
			.input-labels,
			.display-box {
				animation: fadeInScale var(--speed3) var(--ease-standard) forwards;
			}

			.picker-header {
				font-size: 0.75rem;
				font-weight: 500;
				margin-bottom: 1.25rem;
				color: var(--on-surface-variant);
				text-transform: uppercase;
				letter-spacing: 0.1em;
			}

			/* Display Panel (Time box inputs/views) */
			.time-display-container {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 1.5rem;
				gap: 0.75rem;
			}

			.time-display {
				display: flex;
				align-items: center;
				flex: 1;
				background-color: transparent;
			}

			.display-box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 6rem;
				height: 5rem;
				border-radius: 0.5rem;
				background-color: var(--surface-container-highest);
				font-size: 3.5rem;
				font-weight: 400;
				color: var(--on-surface);
				cursor: pointer;
				transition: background-color var(--speed2);
				border: 0.125rem solid transparent;
				text-align: center;
			}

			:host([use-24-hour]) .display-box {
				width: 7.125rem;
			}

			.display-box:hover:not(.active) {
				background-color: var(--active);
			}

			.display-box.active {
				background-color: var(--primary-container);
				color: var(--on-primary-container);
				border-color: var(--primary);
			}

			.display-box input {
				width: 100%;
				height: 100%;
				border: none;
				background: transparent;
				text-align: center;
				font-size: inherit;
				font-family: inherit;
				color: inherit;
				outline: none;
				padding: 0;
			}

			/* Remove input spinners */
			.display-box input::-webkit-outer-spin-button,
			.display-box input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
			.display-box input[type=number] {
				-moz-appearance: textfield;
			}

			.separator {
				font-size: 3rem;
				font-weight: 400;
				color: var(--on-surface);
				width: 1.5rem;
				text-align: center;
				line-height: 5rem;
			}

			/* AM/PM Toggle */
			.ampm-toggle {
				display: flex;
				flex-direction: column;
				border: 0.0625rem solid var(--outline);
				border-radius: 0.5rem;
				overflow: hidden;
				height: 5rem;
				width: 3.25rem;
			}

			.ampm-btn {
				flex: 1;
				background-color: transparent;
				border: none;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-surface-variant);
				cursor: pointer;
				transition: background-color var(--speed1), color var(--speed1);
			}

			.ampm-btn.active {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
			}

			.ampm-btn:first-child {
				border-bottom: 0.0625rem solid var(--outline);
			}

			/* Clock Face */
			.clock-container {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-block: 0.5rem 1.5rem;
			}

			.clock-face {
				position: relative;
				width: 16rem;
				height: 16rem;
				border-radius: 50%;
				background-color: var(--surface-container-highest);
				touch-action: none;
				cursor: pointer;
			}

			/* Center dot */
			.clock-center {
				position: absolute;
				left: calc(50% - 0.25rem);
				top: calc(50% - 0.25rem);
				width: 0.5rem;
				height: 0.5rem;
				border-radius: 50%;
				background-color: var(--primary);
			}

			/* Clock hand line */
			.clock-hand {
				position: absolute;
				left: calc(50% - 0.0625rem);
				bottom: 50%;
				width: 0.125rem;
				background-color: var(--primary);
				transform-origin: bottom center;
				z-index: 1;
				pointer-events: none;
				transition: transform var(--speed3) var(--ease-standard), height var(--speed3) var(--ease-standard);
			}

			/* Hand tip circle selection inside the hand */
			.clock-hand-selector {
				position: absolute;
				top: 0;
				left: 50%;
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				background-color: var(--primary);
				opacity: 0.3;
				transform: translate(-50%, -50%) scale(1);
				z-index: 1;
				pointer-events: none;
				transition: transform var(--speed2) var(--ease-standard);
			}

			/* Disable transition during active drag but keep scale transform animation */
			.clock-face.dragging .clock-hand,
			.clock-face:active .clock-hand {
				transition: none !important;
			}

			/* Selector handle expands/grows when pressed or dragging */
			.clock-face.dragging .clock-hand-selector,
			.clock-face:active .clock-hand-selector {
				transform: translate(-50%, -50%) scale(1.2);
			}

			.clock-hand-dot {
				position: absolute;
				left: calc(50% - 0.25rem);
				top: -2rem;
				width: 0.5rem;
				height: 0.5rem;
				border-radius: 50%;
				background-color: var(--on-primary);
				z-index: 2;
				pointer-events: none;
			}

			@keyframes numberEntrance {
				from {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.85);
				}
				to {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
			}

			/* Clock dial numbers */
			.clock-number {
				position: absolute;
				width: 2.25rem;
				height: 2.25rem;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-surface);
				border-radius: 50%;
				transform: translate(-50%, -50%);
				transition: background-color var(--speed2), color var(--speed2);
				z-index: 2;
				pointer-events: auto;
				cursor: pointer;
				animation: numberEntrance var(--speed3) var(--ease-standard) forwards;
			}

			.clock-number:hover {
				background-color: var(--active);
			}

			.clock-number.selected {
				background-color: var(--primary);
				color: var(--on-primary);
				font-weight: bold;
			}

			.clock-number.selected:hover {
				background-color: var(--primary);
			}

			/* Manual Input Mode specific styling */
			.input-labels {
				display: flex;
				justify-content: space-between;
				gap: 0.75rem;
				margin-top: -1rem;
				margin-bottom: 1.5rem;
				color: var(--on-surface-variant);
				font-size: 0.75rem;
				font-weight: 400;
				padding-inline-end: 4rem; /* Leave room for AM/PM offset */
			}

			.input-labels > span {
				flex: 1;
				text-align: center;
			}

			/* Bottom bar */
			.bottom-actions {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.mode-toggle-btn {
				background: none;
				border: none;
				color: var(--primary);
				cursor: pointer;
				padding: 0.5rem;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: background-color var(--speed1);
			}

			.mode-toggle-btn:hover {
				background-color: var(--active);
			}

			.action-buttons {
				display: flex;
				gap: 0.5rem;
			}
		`
	];

	/**
	 * Renderizador de la carátula circular (Dial Face).
	 * 
	 * Utiliza trigonometría básica (`sin` y `cos`) para distribuir los números equitativamente
	 * a lo largo del perímetro del círculo en CSS absoluto. En formato 24h, renderiza
	 * dos anillos concéntricos manipulando el radio relativo (`50%` vs `32%`).
	 */
	private renderDialClockFace() {
		const isHour = this.activeSelection === 'hour';
		let degrees = 0;
		let handLength = '6.25rem';

		if (isHour) {
			let h = this.currentHour;
			if (!this.use24Hour) {
				if (h > 12) h -= 12;
				if (h === 0) h = 12;
				degrees = h * 30;
			} else {
				// 24 hour mode
				if (h > 12 || h === 0) {
					// Outer circle: 13-00
					const outerHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
					degrees = outerHour * 30;
					handLength = '6.5rem';
				} else {
					// Inner circle: 1-12
					degrees = h * 30;
					handLength = '4.5rem';
				}
			}
		} else {
			degrees = this.currentMinute * 6;
		}

		// Calculate numbers placement
		const numbers: { val: number; label: string; x: string; y: string; selected: boolean }[] = [];
		const r = 16 * 16; // 16rem = 256px
		const center = r / 2;

		if (isHour) {
			if (this.use24Hour) {
				// Outer circle: 13-00
				const outerRadius = center - 24;
				for (let i = 1; i <= 12; i++) {
					const hVal = i === 12 ? 0 : i + 12;
					const angle = (i * 30 - 90) * (Math.PI / 180);
					const x = center + outerRadius * Math.cos(angle);
					const y = center + outerRadius * Math.sin(angle);
					numbers.push({
						val: hVal,
						label: String(hVal === 0 ? '00' : hVal),
						x: `${x / 16}rem`,
						y: `${y / 16}rem`,
						selected: this.currentHour === hVal
					});
				}

				// Inner circle: 1-12
				const innerRadius = center - 56;
				for (let i = 1; i <= 12; i++) {
					const angle = (i * 30 - 90) * (Math.PI / 180);
					const x = center + innerRadius * Math.cos(angle);
					const y = center + innerRadius * Math.sin(angle);
					numbers.push({
						val: i,
						label: String(i),
						x: `${x / 16}rem`,
						y: `${y / 16}rem`,
						selected: this.currentHour === i
					});
				}
			} else {
				// 12-hour: 1-12
				const radius = center - 28;
				for (let i = 1; i <= 12; i++) {
					const angle = (i * 30 - 90) * (Math.PI / 180);
					const x = center + radius * Math.cos(angle);
					const y = center + radius * Math.sin(angle);
					let hVal = this.currentHour;
					if (hVal > 12) hVal -= 12;
					if (hVal === 0) hVal = 12;
					numbers.push({
						val: i,
						label: String(i),
						x: `${x / 16}rem`,
						y: `${y / 16}rem`,
						selected: hVal === i
					});
				}
			}
		} else {
			// Minutes: 0, 5, 10... 55
			const radius = center - 28;
			for (let i = 0; i < 12; i++) {
				const mVal = i * 5;
				const angle = (i * 30 - 90) * (Math.PI / 180);
				const x = center + radius * Math.cos(angle);
				const y = center + radius * Math.sin(angle);
				numbers.push({
					val: mVal,
					label: String(mVal).padStart(2, '0'),
					x: `${x / 16}rem`,
					y: `${y / 16}rem`,
					selected: this.currentMinute === mVal
				});
			}
		}

		return html`
			<div class="clock-container">
				<div
					class="clock-face"
					@pointerdown=${this.handleClockPointerDown}
					@pointermove=${this.handleClockPointerMove}
					@pointerup=${this.handleClockPointerUp}
					@pointercancel=${this.handleClockPointerUp}
				>
					<div class="clock-center"></div>
					<div
						class="clock-hand"
						style="transform: rotate(${degrees}deg); height: ${handLength};"
					>
						<div class="clock-hand-selector"></div>
						${isHour && this.use24Hour && this.currentHour <= 12 && this.currentHour > 0
							? html`<div class="clock-hand-dot"></div>`
							: ''}
					</div>
					${numbers.map(
						(n) => html`
							<div
								class="clock-number ${n.selected ? 'selected' : ''}"
								style="left: ${n.x}; top: ${n.y};"
							>
								${n.label}
							</div>
						`
					)}
				</div>
			</div>
		`;
	}

	/**
	 * Renderiza el selector de hora (time picker) en modo `dial` o `input`.
	 *
	 * **Visualización 12 vs 24 horas:**
	 * `hourVal` convierte `currentHour` (0–23) al formato de visualización:
	 * - Modo 24 horas: string con ceros a la izquierda (ej. `'09'`, `'14'`).
	 * - Modo 12 horas: `0` → `12`, `13` → `1`, preservando la visualización AM/PM.
	 * `minuteVal` siempre tiene ceros a la izquierda para tener 2 dígitos.
	 *
	 * **Modo dial:**
	 * Renderiza una carátula de reloj DOM (HTML/CSS) con números distribuidos
	 * circularmente para cada hora/minuto. El sub-método `renderDialClockFace()` 
	 * maneja la geometría y estilos que mueven la manecilla selectora mientras
	 * el usuario arrastra.
	 *
	 * **Modo input:**
	 * Renderiza dos elementos `<input type="number">` para la hora y el minuto con
	 * un selector AM/PM. El modo input es la alternativa (fallback) para accesibilidad
	 * y entornos no táctiles.
	 *
	 * **Alternador de modo:**
	 * Un icono de teclado cambia de modo `dial` a `input`; un icono de reloj
	 * cambia de vuelta.
	 */
	override render() {
		const hourVal = !this.use24Hour
			? String(this.currentHour > 12 ? this.currentHour - 12 : this.currentHour === 0 ? 12 : this.currentHour).padStart(2, '0')
			: String(this.currentHour).padStart(2, '0');
		const minuteVal = String(this.currentMinute).padStart(2, '0');

		return html`
			<div class="main-content">
				<div class="left-pane">
					<div class="picker-header">
						${this.mode === 'dial' ? 'Select time' : 'Enter time'}
					</div>

					<div class="time-display-container">
						<div class="time-display">
							<div
								class="display-box ${this.activeSelection === 'hour' ? 'active' : ''}"
								@click=${() => this.setSelection('hour')}
							>
								${this.mode === 'input'
									? html`<input
											type="number"
											.value=${hourVal}
											@change=${this.handleHourInputChange}
											min=${this.use24Hour ? 0 : 1}
											max=${this.use24Hour ? 23 : 12}
										/>`
									: hourVal}
							</div>
							<div class="separator">:</div>
							<div
								class="display-box ${this.activeSelection === 'minute' ? 'active' : ''}"
								@click=${() => this.setSelection('minute')}
							>
								${this.mode === 'input'
									? html`<input
											type="number"
											.value=${minuteVal}
											@change=${this.handleMinuteInputChange}
											min="0"
											max="59"
										/>`
									: minuteVal}
							</div>
						</div>

						${!this.use24Hour
							? html`
									<div class="ampm-toggle">
										<button
											class="ampm-btn ${this.period === 'AM' ? 'active' : ''}"
											@click=${() => this.setPeriod('AM')}
										>
											AM
										</button>
										<button
											class="ampm-btn ${this.period === 'PM' ? 'active' : ''}"
											@click=${() => this.setPeriod('PM')}
										>
											PM
										</button>
									</div>
								`
							: ''}
					</div>

					${this.mode === 'input'
						? html`
								<div class="input-labels">
									<span>Hour</span>
									<span>Minute</span>
								</div>
							`
						: ''}
				</div>

				${this.mode === 'dial' ? this.renderDialClockFace() : ''}
			</div>

			<div class="bottom-actions">
				<button class="mode-toggle-btn" @click=${this.toggleMode} aria-label="Toggle input mode">
					<moni-icon name=${this.mode === 'dial' ? 'keyboard' : 'schedule'}></moni-icon>
				</button>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-time-picker': MoniTimePicker;
	}
}

export default MoniTimePicker;
