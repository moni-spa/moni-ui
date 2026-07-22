/**
 * @file components/moni-stepper.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import type { MoniStep } from './moni-step.js';

/**
 * Componente Material Design 3 Stepper (Pasos/Progresión).
 *
 * Un contenedor para una progresión lineal de elementos `<moni-step>`. Los steppers
 * transmiten el progreso a través de pasos numerados e indican la posición
 * actual del usuario dentro de un flujo.
 *
 * **Referencia a la especificación M3:** `m3-docs/components/progress-indicators/specs.md`
 *
 * **Orquestación:**
 * Este componente actúa como orquestador para sus hijos `<moni-step>` en los slots.
 * Cada vez que cambia la propiedad `current` o se añaden/eliminan hijos, el
 * stepper itera sobre todos los pasos hijos e inyecta su estado:
 * - Asigna el `index` secuencial (basado en 0) a cada paso.
 * - Establece `active=true` en el paso que coincide con el índice `current`.
 * - Establece `completed=true` en todos los pasos anteriores al índice `current`.
 *
 * **Diseño visual:**
 * El stepper maneja el diseño (flex row o column basado en `orientation`)
 * y asegura que las líneas conectoras entre los pasos se rendericen correctamente a través de
 * pseudo-elementos CSS definidos en los estilos del `<moni-step>` hijo.
 *
 * @example
 * ```html
 * <moni-stepper current="1" orientation="horizontal">
 *   <moni-step title="Paso 1"></moni-step>
 *   <moni-step title="Paso 2"></moni-step>
 *   <moni-step title="Paso 3"></moni-step>
 * </moni-stepper>
 *
 * <script>
 *   const stepper = document.querySelector('moni-stepper');
 *   // Mover al siguiente paso
 *   stepper.current = 2;
 * </script>
 * ```
 *
 * @slot default - Elementos `<moni-step>`.
 */
@customElement('moni-stepper')
export class MoniStepper extends MoniElement {
	@property({ reflect: true })
	orientation: 'horizontal' | 'vertical' = 'horizontal';
	@property({ type: Number, reflect: true }) current = 0;

	@queryAssignedElements({ selector: 'moni-step' })
	private _steps!: MoniStep[];

	/**
	 * Hook del ciclo de vida reactivo (Lit).
	 * Cuando la orientación o el índice actual cambian, sincroniza
	 * el estado hacia todos los elementos hijos (`<moni-step>`).
	 */
	override updated(changed: Map<string, unknown>) {
		if (
			changed.has('current') ||
			changed.has('orientation') ||
			changed.size === 0
		) {
			this._syncSteps();
		}
	}

	/**
	 * Propaga el índice del paso actual a cada elemento hijo `<moni-step>` en los slots,
	 * calculando e inyectando el estado de `index`, `completed` y `active`.
	 *
	 * **Diferimiento por microtarea (`Promise.resolve().then(...)`):**
	 * `@queryAssignedElements` de Lit se ejecuta sincrónicamente y no está disponible hasta
	 * después del primer renderizado conectado. Diferirlo a una microtarea asegura que los hijos
	 * en los slots hayan terminado su propio ciclo de vida `firstUpdated()` antes de que les escribamos
	 * el estado. Sin este diferimiento, escribir `step.active = true` durante el `updated()`
	 * del padre puede desencadenar renderizados hijos antes de que se apliquen sus estilos.
	 *
	 * **Respaldo de `querySelectorAll`:**
	 * `_steps` (de `@queryAssignedElements`) devuelve un array vacío antes del primer
	 * renderizado o cuando no hay elementos `<moni-step>` presentes en el slot. El respaldo
	 * a `querySelectorAll('moni-step')` maneja casos extremos donde se añaden pasos
	 * programáticamente sin pasar por el mecanismo de slots de Lit.
	 *
	 * **Bucle de inyección de estado:**
	 * Para cada `<moni-step>` en la posición `stepIndex`:
	 * - `stepElement.index = stepIndex` — proporciona el número de paso para su etiqueta.
	 * - `stepElement.completed = stepIndex < current` — verdadero para todos los pasos anteriores a `current`.
	 * - `stepElement.active = stepIndex === current` — verdadero solo para el paso en `current`.
	 */
	private _syncSteps() {
		Promise.resolve().then(() => {
			// Usa el resultado de @queryAssignedElements de Lit primero; usa una consulta DOM en vivo como respaldo.
			let stepElements = this._steps || [];
			if (stepElements.length === 0) {
				stepElements = Array.from(this.querySelectorAll('moni-step')) as MoniStep[];
			}
			stepElements.forEach((stepElement, stepIndex) => {
				stepElement.index = stepIndex;
				stepElement.completed = stepIndex < this.current;
				stepElement.active = stepIndex === this.current;
			});
		});
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
			}

			.list {
				display: flex;
				gap: 0.5rem;
				padding: 0;
				margin: 0;
				list-style: none;
			}
			:host([orientation='vertical']) .list {
				flex-direction: column;
			}

			::slotted(*) {
				flex: 1;
				min-inline-size: 0;
			}
		`
	];

	/**
	 * Renderiza el contenedor de lista ordenada (`<ol>`) que contiene los hijos `<moni-step>` en los slots.
	 *
	 * **Anatomía:**
	 * - El `<ol>` usa `list-style: none` y un diseño flex (fila o columna, basado en
	 *   `orientation`) en lugar del renderizado nativo de lista ordenada, porque la
	 *   visualización del número de paso es manejada por cada hijo `<moni-step>`.
	 * - La vinculación del evento `@slotchange` asegura que se llame a `_syncSteps()`
	 *   cada vez que el consumidor añade o elimina elementos `<moni-step>` en tiempo de ejecución,
	 *   manteniendo los estados `index`, `active` y `completed` sincronizados.
	 * - Cada `<moni-step>` en el slot está estilizado con `flex: 1` para que todos los pasos
	 *   compartan el ancho disponible equitativamente (horizontal) o la altura (vertical).
	 */
	override render() {
		return html`<ol class="list" part="stepper">
			<slot @slotchange=${this._onSlotChange}></slot>
		</ol>`;
	}

	/**
	 * Handler dinámico del slot.
	 * Detecta si el usuario añade o elimina pasos nativos (`<moni-step>`)
	 * desde el DOM en tiempo de ejecución, forzando una re-sincronización.
	 */
	private _onSlotChange = () => {
		// Steps may have been added/removed; re-sync.
		this._syncSteps();
	};
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-stepper': MoniStepper;
	}
}

export default MoniStepper;
