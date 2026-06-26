# Guía de Contribución para Moni UI 🎨

Esta guía define los estándares técnicos, de estilo de código y flujos de trabajo para contribuir a `@moni-labs/moni-ui`. Como una biblioteca de componentes web premium basada en **Material Design 3 Expressive**, es fundamental mantener la consistencia, el rendimiento y la compatibilidad con cualquier framework web.

---

## 1. Principios de Diseño y Arquitectura 🧩

- **Mobile-First**: Todos los componentes deben estar diseñados principalmente para pantallas táctiles y móviles, asegurando áreas de toque mínimas de `48px x 48px` (:host o áreas internas del Shadow DOM).
- **Lit Web Components**: Utilizamos **Lit** para crear componentes nativos ligeros y encapsulados mediante **Shadow DOM**.
- **Agnósticos**: No asumas que el componente corre en un framework específico. Deben funcionar nativamente en HTML plano, React, Vue, Angular, Svelte, etc.
- **Visuales y sin Estado (Shells)**: Los componentes web actúan principalmente como capas de presentación visual e interacción micro-animada. La validación compleja, lógica de negocio u operaciones asíncronas deben delegarse al consumidor del componente.

---

## 2. Estándares de Código y TypeScript 🛠️

- **Tipado Estricto**: Todo el código debe tener tipos TypeScript explícitos. Evita el uso de `any`.
- **Estructura de Componentes**:
  - Usa el decorador `@customElement('moni-component')` para el registro automático.
  - Declara propiedades reactivas con `@property({ reflect: true })` si se deben reflejar como atributos HTML.
  - Usa `@state()` para variables internas que disparan el renderizado del componente pero que no deben exponerse al DOM público.

### Ejemplo de Estructura de Archivo:
```typescript
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

@customElement('moni-my-component')
export class MoniMyComponent extends MoniElement {
  @property({ reflect: true })
  variant: 'filled' | 'outlined' = 'filled';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private _isActive = false;

  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }
      .my-element {
        color: var(--primary);
      }
    `
  ];

  override render() {
    return html`
      <div class="my-element" ?disabled=${this.disabled}>
        <slot></slot>
      </div>
    `;
  }
}
```

---

## 3. Guía de Estilos y Tokens de CSS 🎨

Para garantizar que nuestros componentes no entren en conflicto con otros frameworks de CSS globales (como Bootstrap, Tailwind o Bulma), seguimos estas pautas de encapsulación:

### A. Regla de Prefijo `--moni-`
- Todos los tokens globales expuestos en el documento deben declararse con el prefijo `--moni-` (ej. `--moni-primary`, `--moni-background`).
- Evita declarar variables directas como `--primary` o `--surface` en el `:root` global.

### B. Puente de Variables en Shadow DOM (`shared-styles.ts`)
- Dentro del Shadow DOM de cada componente, las clases usan nombres cortos estándar como `var(--primary)` o `var(--surface)`.
- El mapeo de estas variables internas se realiza en el bloque `:host` del archivo `shared-styles.ts` de la siguiente manera:
```css
:host {
  --primary: var(--moni-primary, var(--md-sys-color-primary, #6750A4));
  --on-primary: var(--moni-on-primary, var(--md-sys-color-on-primary, #FFFFFF));
}
```
Esto crea una barrera de aislamiento: si un sitio web tiene una variable global `--primary` en `:root` que choca con la nuestra, no afectará a los componentes de Moni UI porque el Shadow DOM prioriza el mapeo local `:host`.

### C. Unidades de Medida y Transiciones
- Utiliza unidades relativas (`rem` o `em`) para fuentes, paddings, márgenes y alturas.
- Define duraciones en milisegundos (`ms`) y utiliza las curvas de aceleración estándar de Material Design 3 Expressive expuestas en `shared-styles.ts` (ej. `var(--ease-emphasized)`).

---

## 4. Estilo de Commits y Flujo de Trabajo (Git Flow) 🚀

Utilizamos **Conventional Commits** para generar cambios ordenados y facilitar la generación automática de versiones con Semantic Release.

### Formato de Commit:
```
<tipo>(<ámbito>): <descripción corta en imperativo y minúsculas>

[cuerpo opcional detallado]

[pie de página opcional para tareas cerradas o breaking changes]
```

### Tipos Permitidos (`type`):
- `feat`: Nueva funcionalidad para el usuario final.
- `fix`: Corrección de un bug.
- `docs`: Cambios exclusivamente en documentación.
- `style`: Formateo de código, comillas, punto y coma (sin cambios funcionales).
- `refactor`: Cambios de código que no corrigen bugs ni agregan características.
- `perf`: Mejoras de rendimiento del componente.
- `test`: Añadir o corregir pruebas unitarias.
- `chore`: Tareas de compilación, scripts, dependencias u otras tareas de mantenimiento.

### Nombres de Rama:
- Nuevas características: `feat/nombre-componente`
- Corrección de bugs: `fix/nombre-bug`
- Mantenimiento o docs: `chore/nombre-tarea`

---

## 5. Pruebas Unitarias y Verificación 🧪

Todos los componentes deben incluir un archivo de prueba con extensión `.test.ts` en el mismo directorio.
- Las pruebas se ejecutan con **Vitest** en un entorno **jsdom**.
- Debes verificar al menos:
  1. Renderizado correcto por defecto.
  2. Aplicación correcta de atributos reactivos (como `variant`, `disabled`, `loading`).
  3. Despacho de eventos esperados en interacción.

### Ejecución de Pruebas:
```bash
# Correr pruebas una sola vez
bun run test

# Correr pruebas en modo watch
bun run test:watch
```

¡Gracias por ayudar a hacer que Moni UI sea un sistema de diseño premium, sólido y escalable! 🚀
