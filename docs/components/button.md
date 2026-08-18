# Button

Componente Material Design 3 Button.

Los botones permiten a los usuarios realizar acciones y hacer elecciones con un solo toque.
Este componente proporciona todas las variantes de botones de M3, tamaños y capacidades
de transformación de formas (ej. cambiar a una forma de píldora al presionar o alternar).

**Referencia de la especificación M3:** `m3-docs/components/buttons/specs.md`

**Variantes:**
- `filled` (por defecto) — Énfasis alto. Úsalo para acciones principales.
- `tonal` — Énfasis medio. Acciones secundarias que aún necesitan destacar.
- `elevated` — Énfasis medio con sombra. Úsalo al sentarse sobre fondos con patrones.
- `outlined` — Énfasis medio, sin relleno. Acciones secundarias o terciarias.
- `text` — Énfasis bajo. Acciones terciarias (ej. botón de cancelar diálogo).

**Transformación de forma (Característica M3 Expressive):**
- Al presionar (estado activo): Los botones redondos y cuadrados se transforman a una forma
  "presionada" ligeramente más cuadrada con radios de esquina específicos de M3 (ej. XS/S 8dp, M 12dp).
- Al alternar (atributo `active`): La forma de reposo se invierte (ej. redondo ↔ cuadrado).

**Renderizando como un enlace:**
Cuando se proporciona el atributo `href`, el componente se renderiza internamente como
un elemento `<a>` en lugar de un `<button>`, permitiendo enrutamiento nativo y comportamientos
de clic central (abrir en nueva pestaña) mientras mantiene los visuales del botón.

- Tag: `moni-button`
- Clase: `MoniButton`
- Fuente: `src/components/moni-button.ts`

## Cuándo usarlo

Usa `moni-button` cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.

## Uso básico

```html
<!-- Botón primario relleno -->
<moni-button icon="add">Crear nuevo</moni-button>

<!-- Botón contorneado -->
<moni-button variant="outlined">Cancelar</moni-button>

<!-- Botón de alternar (alterna estado activo al hacer clic) -->
<moni-button icon="favorite" active>Me gusta</moni-button>

<!-- Botón enlace -->
<moni-button href="/settings" icon="settings">Ajustes</moni-button>
```

## Ejemplo práctico con Tailwind CSS v4

Tailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.

```html
<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
  <moni-button>Guardar cambios</moni-button>
</div>
```

No necesitas un plugin de Tailwind. En tu CSS v4 importa ambas capas una sola vez:

```css
@import "tailwindcss";
@import "@moni-labs/moni-ui/styles";

@theme {
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

Las utilities aplicadas directamente al tag afectan su caja anfitriona. No uses selectores Tailwind para asumir acceso al DOM interno; personaliza únicamente con los CSS Parts y Custom Properties públicos enumerados más abajo.

## Recomendaciones

- Usa `moni-button` para su propósito semántico; no lo sustituyas por un `div` estilizado.
- Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.
- Durante una operación asíncrona combina el estado `loading` —si existe— con `disabled` para evitar envíos duplicados.
- Cuando el control muestre únicamente un icono, añade siempre un `aria-label` descriptivo.
- Mantén el estado de apertura en una única fuente de verdad y devuelve el foco al disparador al cerrar.
- Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.

## Propiedades y atributos

| Atributo | Propiedad | Tipo | Default | Descripción |
|---|---|---|---|---|
| `variant` | `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'fill' \| 'elevated' \| 'error'` | `'filled'` | Variante visual del botón. |
| `size` | `size` | `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge' \| 'extra'` | `'small'` | Tamaños de M3 Expressive: xsmall, small, medium, large, xlarge. `extra` es un alias heredado de Moni para `xlarge`, obsoleto en v0.3.1; se eliminará en v1.0. Ver `m3-docs/components/buttons/overview.md` § Sizes. |
| `shape` | `shape` | `'round' \| 'no-round' \| 'square' \| 'circle' \| 'left-round' \| 'right-round' \| 'top-round' \| 'bottom-round' \| 'left-round-flat' \| 'right-round-flat' \| 'top-round-flat' \| 'bottom-round-flat' \| 'inner-round'` | `'round'` | Forma de las esquinas del botón. |
| `disabled` | `disabled` | `boolean` | `false` | Deshabilita el botón. |
| `loading` | `loading` | `boolean` | `false` | Si es verdadero, muestra un indicador de carga y deshabilita el botón. |
| `active` | `active` | `boolean` | `false` | Si es verdadero, establece el botón a un estado activo/seleccionado. |
| `icon` | `icon` | `string` | `''` | Nombre del icono inicial (Material Symbols). |
| `icon-trailing` | `iconTrailing` | `string` | `''` | Nombre del icono final (Material Symbols). |
| `type` | `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo nativo del botón (cuando se renderiza como un `<button>`). |
| `href` | `href` | `string` | `''` | Si está establecido, renderiza el botón como un elemento `<a>` con esta URL. |
| `target` | `target` | `string` | `''` | Atributo target para los botones tipo enlace. |

## Slots

- `default`: El texto de la etiqueta del botón.
- `icon`: Sobrescritura opcional para el icono inicial (leading).
- `icon-trailing`: Sobrescritura opcional para el icono final (trailing).

## Eventos

No declara eventos propios.

## Métodos públicos

No expone métodos públicos adicionales.

## CSS Parts

- `button`: Parte interna personalizable.
- `icon`: Parte interna personalizable.
- `label`: Parte interna personalizable.
- `trailing-icon`: El contenedor del icono final.
- `icon-trailing`: Parte interna personalizable.
- `loading`: Parte interna personalizable.

## CSS Custom Properties consumidas

- `--_button-icon-size`
- `--_button-square-radius`
- `--_button-visual-height`
- `--elevate1`
- `--elevate2`
- `--error`
- `--font`
- `--inverse-on-surface`
- `--inverse-surface`
- `--moni-button-border-radius`
- `--moni-button-box-sizing`
- `--moni-button-font-size`
- `--moni-button-gap`
- `--moni-button-height`
- `--moni-button-icon-offset`
- `--moni-button-icon-size`
- `--moni-button-inline-size`
- `--moni-button-min-inline-size`
- `--moni-button-padding`
- `--on-error`
- `--on-primary`
- `--on-primary-container`
- `--on-secondary`
- `--on-secondary-container`
- `--outline-variant`
- `--primary`
- `--primary-container`
- `--secondary`
- `--secondary-container`
- `--surface`
- `--surface-container-low`

## Referencia visual por variable

Cada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.

### `variant`

Variante visual del botón.

![moni-button — variant=filled](../assets/moni-button/variant--filled.png)

![moni-button — variant=tonal](../assets/moni-button/variant--tonal.png)

![moni-button — variant=outlined](../assets/moni-button/variant--outlined.png)

![moni-button — variant=text](../assets/moni-button/variant--text.png)

![moni-button — variant=fill](../assets/moni-button/variant--fill.png)

![moni-button — variant=elevated](../assets/moni-button/variant--elevated.png)

![moni-button — variant=error](../assets/moni-button/variant--error.png)

### `size`

Tamaños de M3 Expressive: xsmall, small, medium, large, xlarge.
`extra` es un alias heredado de Moni para `xlarge`, obsoleto en v0.3.1; se
eliminará en v1.0. Ver `m3-docs/components/buttons/overview.md` § Sizes.

![moni-button — size=xsmall](../assets/moni-button/size--xsmall.png)

![moni-button — size=small](../assets/moni-button/size--small.png)

![moni-button — size=medium](../assets/moni-button/size--medium.png)

![moni-button — size=large](../assets/moni-button/size--large.png)

![moni-button — size=xlarge](../assets/moni-button/size--xlarge.png)

![moni-button — size=extra](../assets/moni-button/size--extra.png)

### `shape`

Forma de las esquinas del botón.

![moni-button — shape=round](../assets/moni-button/shape--round.png)

![moni-button — shape=no-round](../assets/moni-button/shape--no-round.png)

![moni-button — shape=square](../assets/moni-button/shape--square.png)

![moni-button — shape=circle](../assets/moni-button/shape--circle.png)

![moni-button — shape=left-round](../assets/moni-button/shape--left-round.png)

![moni-button — shape=right-round](../assets/moni-button/shape--right-round.png)

![moni-button — shape=top-round](../assets/moni-button/shape--top-round.png)

![moni-button — shape=bottom-round](../assets/moni-button/shape--bottom-round.png)

![moni-button — shape=left-round-flat](../assets/moni-button/shape--left-round-flat.png)

![moni-button — shape=right-round-flat](../assets/moni-button/shape--right-round-flat.png)

![moni-button — shape=top-round-flat](../assets/moni-button/shape--top-round-flat.png)

![moni-button — shape=bottom-round-flat](../assets/moni-button/shape--bottom-round-flat.png)

![moni-button — shape=inner-round](../assets/moni-button/shape--inner-round.png)

### `disabled`

Deshabilita el botón.

![moni-button — disabled=false](../assets/moni-button/disabled--false.png)

![moni-button — disabled=true](../assets/moni-button/disabled--true.png)

### `loading`

Si es verdadero, muestra un indicador de carga y deshabilita el botón.

![moni-button — loading=false](../assets/moni-button/loading--false.png)

![moni-button — loading=true](../assets/moni-button/loading--true.png)

### `active`

Si es verdadero, establece el botón a un estado activo/seleccionado.

![moni-button — active=false](../assets/moni-button/active--false.png)

![moni-button — active=true](../assets/moni-button/active--true.png)

### `icon`

Nombre del icono inicial (Material Symbols).

![moni-button — icon=default](../assets/moni-button/icon--default.png)

### `icon-trailing`

Nombre del icono final (Material Symbols).

![moni-button — icon-trailing=default](../assets/moni-button/iconTrailing--default.png)

### `type`

Tipo nativo del botón (cuando se renderiza como un `<button>`).

![moni-button — type=button](../assets/moni-button/type--button.png)

![moni-button — type=submit](../assets/moni-button/type--submit.png)

![moni-button — type=reset](../assets/moni-button/type--reset.png)

### `href`

Si está establecido, renderiza el botón como un elemento `<a>` con esta URL.

![moni-button — href=default](../assets/moni-button/href--default.png)

### `target`

Atributo target para los botones tipo enlace.

![moni-button — target=default](../assets/moni-button/target--default.png)
