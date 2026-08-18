# Guía para LLM y agentes

Esta guía define cómo generar código correcto con `@moni-labs/moni-ui`.

## Fuentes de verdad

Consulta en este orden:

1. `docs/api.json`: inventario estructurado de componentes y API pública.
2. `docs/components/<nombre>.md`: semántica, ejemplos y referencia visual.
3. `custom-elements.json`: integración con IDE y tooling Web Components.
4. `src/components/<tag>.ts`: fuente solo cuando la documentación no resuelva un detalle.

No inventes atributos. Si una opción no aparece en `api.json`, no asumas que existe.

## Instalación con bundler

```bash
npm install @moni-labs/moni-ui
```

```js
import '@moni-labs/moni-ui';
import '@moni-labs/moni-ui/styles';
```

## CDN completo

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/browser/moni-ui.min.css">
<script src="https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/browser/moni-ui.iife.min.js"></script>
```

Para cargar pocos componentes, usa `dist/cdn/importmap.json` y los módulos individuales documentados en `examples/import-map.html`.

## Reglas de generación

- Usa tags `moni-*`; no recrees visualmente el componente con HTML genérico.
- Los booleanos HTML se activan por presencia: usa `disabled`, no `disabled="false"`.
- En JavaScript asigna propiedades tipadas: `element.disabled = false`.
- Usa kebab-case para atributos (`use-24-hour`) y camelCase para propiedades (`use24Hour`).
- Proyecta contenido mediante los slots documentados.
- Escucha los eventos propios en el elemento y revisa `event.detail` cuando corresponda.
- Usa CSS Custom Properties para temas y `::part()` únicamente con parts documentados.
- Incluye `aria-label` en controles icon-only.
- Respeta `prefers-reduced-motion`; no desactives el comportamiento accesible del componente.

## Tailwind CSS v4

Importa Tailwind y Moni UI una sola vez en la hoja global. El orden permite usar las utilities para el layout sin reemplazar los estilos del componente:

```css
@import "tailwindcss";
@import "@moni-labs/moni-ui/styles";

@theme {
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

Usa esta regla de decisión al generar una interfaz:

1. Para layout, responsive, separación, ancho y alineación: aplica utilities al contenedor o al tag `moni-*` (`grid`, `gap-4`, `w-full`, `md:grid-cols-2`).
2. Para color y tema coherentes en toda la aplicación: cambia los design tokens públicos de Moni UI.
3. Para una pieza interna concreta: usa `::part(nombre)` únicamente si la ficha declara ese CSS Part.
4. Si la ficha no declara un part o variable, no atravieses el Shadow DOM ni dependas de clases internas.

```html
<form class="mx-auto grid w-full max-w-xl gap-4 p-6 md:grid-cols-2">
  <moni-text-field class="md:col-span-2" label="Nombre" required></moni-text-field>
  <moni-select label="Rol">
    <moni-select-option value="designer">Diseño</moni-select-option>
    <moni-select-option value="developer">Desarrollo</moni-select-option>
  </moni-select>
  <moni-button class="justify-self-end md:col-span-2" type="submit">Guardar</moni-button>
</form>
```

No generes `tailwind.config.js` para una integración v4 básica, no uses `@apply` para clonar componentes Moni y no escribas selectores contra nodos internos del Shadow DOM.

## Ejemplo de composición

```html
<moni-text-field
  id="time-field"
  label="Hora"
  value="09:30"
  suffix-button-icon="schedule"
  suffix-button-label="Elegir hora"
></moni-text-field>

<moni-button-group variant="standard" selection-required>
  <moni-button active>Lista</moni-button>
  <moni-button>Tablero</moni-button>
</moni-button-group>
```

```js
const field = document.querySelector('#time-field');
field.addEventListener('suffix-click', () => {
  // Abrir el time picker o morph modal de la aplicación.
});
```

## Interpretación de las imágenes

Cada sección “Referencia visual por variable” mantiene todas las demás propiedades en un escenario estable y cambia únicamente la variable indicada. Las imágenes son evidencia del resultado esperado, no una API alternativa. Los valores libres muestran una captura `default`; enums y booleanos muestran cada valor documentado.
