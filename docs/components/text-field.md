# Text Field

Componente Material Design 3 Text Field (Campo de texto).

Un campo de entrada con todas las funciones que envuelve un `<input>` nativo dentro de la
estructura de campo M3 (clase `.field` de `fieldStyles`). Soporta etiquetas flotantes,
variantes llenas (filled) y contorneadas (outlined), iconos iniciales/finales (leading/trailing),
texto de ayuda y estados de error.

**Referencia a la especificación M3:** `m3-docs/components/text-fields/specs.md`

**Arquitectura visual:**
Utiliza `fieldStyles` para toda la estructura CSS del campo. El contenedor del campo
es un `<div class="field [modifiers]">` que envuelve:
1. Icono inicial (leading) opcional.
2. Elemento `<input>` nativo.
3. `<label>` flotante (cuando se establece `label`).
4. Icono final (trailing) opcional o indicador de carga (spinner).
5. `<output>` para texto de ayuda/error.

**Sincronización de eventos:**
Emite `moni-input` en cada tipeo y `moni-change` al consolidar el valor (blur/enter).
El valor interno del componente (`this.value`) se mantiene sincronizado automáticamente.

- Tag: `moni-text-field`
- Clase: `MoniTextField`
- Fuente: `src/components/moni-text-field.ts`

## Cuándo usarlo

Usa `moni-text-field` cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.

## Uso básico

```html
<moni-text-field
  label="Dirección de correo"
  type="email"
  name="email"
  icon="mail"
  variant="outlined"
  helper="Nunca compartiremos tu correo."
></moni-text-field>

<moni-text-field
  label="Monto"
  type="number"
  prefix="$"
  error
  error-text="El valor debe ser positivo"
></moni-text-field>
```

## Ejemplo práctico con Tailwind CSS v4

Tailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.

```html
<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
  <moni-text-field label="Ejemplo"></moni-text-field>
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

- Usa `moni-text-field` para su propósito semántico; no lo sustituyas por un `div` estilizado.
- Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.
- Durante una operación asíncrona combina el estado `loading` —si existe— con `disabled` para evitar envíos duplicados.
- En formularios controlados, sincroniza la propiedad `value` y escucha el evento documentado; no dependas solo del atributo inicial.
- Cuando el control muestre únicamente un icono, añade siempre un `aria-label` descriptivo.
- Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.

## Propiedades y atributos

| Atributo | Propiedad | Tipo | Default | Descripción |
|---|---|---|---|---|
| `name` | `name` | `string` | `''` | El nombre del input, enviado con los datos del formulario. |
| `label` | `label` | `string` | `''` | El texto de la etiqueta flotante. |
| `variant` | `variant` | `'filled' \| 'outlined' \| 'underlined'` | `'filled'` | Variante visual del campo de texto. |
| `size` | `size` | `'small' \| 'medium' \| 'large' \| 'extra'` | `'medium'` | Define las dimensiones del campo de texto. |
| `shape` | `shape` | `'round' \| 'no-round'` | `'no-round'` | Forma del radio del borde (border-radius) del campo. |
| `type` | `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search' \| 'date' \| 'time' \| 'datetime-local' \| 'month' \| 'week' \| 'color'` | `'text'` | El tipo de input HTML nativo. |
| `icon` | `icon` | `string` | `''` | Nombre del icono inicial (leading) (Material Symbols). |
| `trailing-icon` | `trailingIcon` | `string` | `''` | Nombre del icono final (trailing) (Material Symbols). |
| `prefix` | `prefix` | `string` | `''` | Prefijo de texto corto mostrado antes del valor del input. |
| `suffix` | `suffix` | `string` | `''` | Sufijo de texto corto mostrado después del valor del input. |
| `suffix-button-icon` | `suffixButtonIcon` | `string` | `''` | Icono del botón interactivo ubicado al final del campo. |
| `suffix-button-label` | `suffixButtonLabel` | `string` | `'Acción del campo'` | Etiqueta accesible del botón suffix. |
| `helper` | `helper` | `string` | `''` | Texto de ayuda mostrado debajo del campo. |
| `error-text` | `errorText` | `string` | `''` | Texto de error mostrado debajo del campo cuando `error` es true. Sobrescribe el texto de ayuda. |
| `error` | `error` | `boolean` | `false` | Si es true, establece el campo en un estado de error. |
| `loading` | `loading` | `boolean` | `false` | Si es true, muestra un indicador de carga (progreso lineal/circular) al final. |
| `disabled` | `disabled` | `boolean` | `false` | Deshabilita el campo de texto. |
| `value` | `value` | `string` | `''` | El valor actual del input. |
| `placeholder` | `placeholder` | `string` | `''` | Texto de marcador de posición (placeholder) mostrado cuando el input está vacío y la etiqueta es flotante. |
| `required` | `required` | `boolean` | `false` | Marca el campo como obligatorio y lo integra en la validación del formulario. |
| `readonly` | `readonly` | `boolean` | `false` | Impide editar el valor sin sacarlo del envío ni atenuarlo como `disabled`. |
| `autocomplete` | `autocomplete` | `string` | `''` | Pista de autocompletado del navegador, por ejemplo `email` o `current-password`. |
| `inputmode` | `inputmode` | `string` | `''` | Teclado virtual a mostrar en móvil, por ejemplo `numeric` o `tel`. |
| `maxlength` | `maxlength` | `number \| null` | `null` | Máximo de caracteres aceptados. |
| `minlength` | `minlength` | `number \| null` | `null` | Mínimo de caracteres aceptados. |
| `min` | `min` | `string` | `''` | Valor mínimo para `number` y los tipos de fecha y hora. |
| `max` | `max` | `string` | `''` | Valor máximo para `number` y los tipos de fecha y hora. |
| `step` | `step` | `string` | `''` | Incremento para `number` y los tipos de fecha y hora. |
| `pattern` | `pattern` | `string` | `''` | Expresión regular que debe cumplir el valor. |
| `mask` | `mask` | `string` | `''` | Patrón Inputmask. Admite opcionales `[]`, grupos `()`, alternadores `\|`, cuantificadores `{n,m}` y los tokens `9`, `a`, `*` y `K` (RUT). |
| `mask-alias` | `maskAlias` | `string` | `''` | Alias integrado de Inputmask, por ejemplo `email`, `datetime`, `numeric`, `currency` o `ip`. |
| `mask-options` | `maskOptions` | `InputmaskOptions` | `{}` | Opciones avanzadas de Inputmask. También acepta JSON mediante el atributo `mask-options`. |

## Slots

Este componente no declara slots públicos.

## Eventos

- `suffix-click`: evento compuesto y burbujeante emitido por el componente.

## Métodos públicos

- `maskOption(name: string): unknown;` — Lee o actualiza opciones de la instancia activa.
- `maskOption(options: InputmaskOptions, noRemask?: boolean): InputmaskInstance | undefined;` — Método público maskOption.
- `maskOption(nameOrOptions: string | InputmaskOptions, noRemask = false): unknown` — Método público maskOption.
- `getEmptyMask(): string` — Método público getEmptyMask.
- `hasMaskedValue(): boolean` — Método público hasMaskedValue.
- `isMaskComplete(): boolean` — Método público isMaskComplete.
- `isMaskValid(value?: string): boolean` — Método público isMaskValid.
- `getMaskMetadata(): unknown` — Método público getMaskMetadata.
- `formatWithMask(value: string, metadata = false): string |` — Método público formatWithMask.
- `setMaskedValue(value: string): void` — Método público setMaskedValue.
- `removeMask(): void` — Método público removeMask.
- `checkValidity(): boolean` — Método público checkValidity.
- `reportValidity(): boolean` — Método público reportValidity.

## CSS Parts

- `field`: Parte interna personalizable.
- `input`: Parte interna personalizable.
- `label`: Parte interna personalizable.
- `helper`: Parte interna personalizable.
- `error-output`: El elemento `<output>` de error.
- `leading-icon`: Parte interna personalizable.
- `prefix`: Parte interna personalizable.
- `suffix`: Parte interna personalizable.
- `suffix-action`: Parte interna personalizable.
- `suffix-button`: Parte interna personalizable.
- `trailing-icon`: Parte interna personalizable.

## CSS Custom Properties consumidas

- `--_middle`
- `--on-surface-variant`
- `--primary`

## Referencia visual por variable

Cada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.

### `name`

El nombre del input, enviado con los datos del formulario.

![moni-text-field — name=default](../assets/moni-text-field/name--default.png)

### `label`

El texto de la etiqueta flotante.

![moni-text-field — label=default](../assets/moni-text-field/label--default.png)

### `variant`

Variante visual del campo de texto.

![moni-text-field — variant=filled](../assets/moni-text-field/variant--filled.png)

![moni-text-field — variant=outlined](../assets/moni-text-field/variant--outlined.png)

![moni-text-field — variant=underlined](../assets/moni-text-field/variant--underlined.png)

### `size`

Define las dimensiones del campo de texto.

![moni-text-field — size=small](../assets/moni-text-field/size--small.png)

![moni-text-field — size=medium](../assets/moni-text-field/size--medium.png)

![moni-text-field — size=large](../assets/moni-text-field/size--large.png)

![moni-text-field — size=extra](../assets/moni-text-field/size--extra.png)

### `shape`

Forma del radio del borde (border-radius) del campo.

![moni-text-field — shape=round](../assets/moni-text-field/shape--round.png)

![moni-text-field — shape=no-round](../assets/moni-text-field/shape--no-round.png)

### `type`

El tipo de input HTML nativo.

![moni-text-field — type=text](../assets/moni-text-field/type--text.png)

![moni-text-field — type=password](../assets/moni-text-field/type--password.png)

![moni-text-field — type=email](../assets/moni-text-field/type--email.png)

![moni-text-field — type=number](../assets/moni-text-field/type--number.png)

![moni-text-field — type=tel](../assets/moni-text-field/type--tel.png)

![moni-text-field — type=url](../assets/moni-text-field/type--url.png)

![moni-text-field — type=search](../assets/moni-text-field/type--search.png)

![moni-text-field — type=date](../assets/moni-text-field/type--date.png)

![moni-text-field — type=time](../assets/moni-text-field/type--time.png)

![moni-text-field — type=datetime-local](../assets/moni-text-field/type--datetime-local.png)

![moni-text-field — type=month](../assets/moni-text-field/type--month.png)

![moni-text-field — type=week](../assets/moni-text-field/type--week.png)

![moni-text-field — type=color](../assets/moni-text-field/type--color.png)

### `icon`

Nombre del icono inicial (leading) (Material Symbols).

![moni-text-field — icon=default](../assets/moni-text-field/icon--default.png)

### `trailing-icon`

Nombre del icono final (trailing) (Material Symbols).

![moni-text-field — trailing-icon=default](../assets/moni-text-field/trailingIcon--default.png)

### `prefix`

Prefijo de texto corto mostrado antes del valor del input.

![moni-text-field — prefix=default](../assets/moni-text-field/prefix--default.png)

### `suffix`

Sufijo de texto corto mostrado después del valor del input.

![moni-text-field — suffix=default](../assets/moni-text-field/suffix--default.png)

### `suffix-button-icon`

Icono del botón interactivo ubicado al final del campo.

![moni-text-field — suffix-button-icon=default](../assets/moni-text-field/suffixButtonIcon--default.png)

### `suffix-button-label`

Etiqueta accesible del botón suffix.

![moni-text-field — suffix-button-label=default](../assets/moni-text-field/suffixButtonLabel--default.png)

### `helper`

Texto de ayuda mostrado debajo del campo.

![moni-text-field — helper=default](../assets/moni-text-field/helper--default.png)

### `error-text`

Texto de error mostrado debajo del campo cuando `error` es true.
Sobrescribe el texto de ayuda.

![moni-text-field — error-text=default](../assets/moni-text-field/errorText--default.png)

### `error`

Si es true, establece el campo en un estado de error.

![moni-text-field — error=false](../assets/moni-text-field/error--false.png)

![moni-text-field — error=true](../assets/moni-text-field/error--true.png)

### `loading`

Si es true, muestra un indicador de carga (progreso lineal/circular) al final.

![moni-text-field — loading=false](../assets/moni-text-field/loading--false.png)

![moni-text-field — loading=true](../assets/moni-text-field/loading--true.png)

### `disabled`

Deshabilita el campo de texto.

![moni-text-field — disabled=false](../assets/moni-text-field/disabled--false.png)

![moni-text-field — disabled=true](../assets/moni-text-field/disabled--true.png)

### `value`

El valor actual del input.

![moni-text-field — value=default](../assets/moni-text-field/value--default.png)

### `placeholder`

Texto de marcador de posición (placeholder) mostrado cuando el input está vacío y la etiqueta es flotante.

![moni-text-field — placeholder=default](../assets/moni-text-field/placeholder--default.png)

### `required`

Marca el campo como obligatorio y lo integra en la validación del formulario.

![moni-text-field — required=false](../assets/moni-text-field/required--false.png)

![moni-text-field — required=true](../assets/moni-text-field/required--true.png)

### `readonly`

Impide editar el valor sin sacarlo del envío ni atenuarlo como `disabled`.

![moni-text-field — readonly=false](../assets/moni-text-field/readonly--false.png)

![moni-text-field — readonly=true](../assets/moni-text-field/readonly--true.png)

### `autocomplete`

Pista de autocompletado del navegador, por ejemplo `email` o `current-password`.

![moni-text-field — autocomplete=default](../assets/moni-text-field/autocomplete--default.png)

### `inputmode`

Teclado virtual a mostrar en móvil, por ejemplo `numeric` o `tel`.

![moni-text-field — inputmode=default](../assets/moni-text-field/inputmode--default.png)

### `maxlength`

Máximo de caracteres aceptados.

![moni-text-field — maxlength=default](../assets/moni-text-field/maxlength--default.png)

### `minlength`

Mínimo de caracteres aceptados.

![moni-text-field — minlength=default](../assets/moni-text-field/minlength--default.png)

### `min`

Valor mínimo para `number` y los tipos de fecha y hora.

![moni-text-field — min=default](../assets/moni-text-field/min--default.png)

### `max`

Valor máximo para `number` y los tipos de fecha y hora.

![moni-text-field — max=default](../assets/moni-text-field/max--default.png)

### `step`

Incremento para `number` y los tipos de fecha y hora.

![moni-text-field — step=default](../assets/moni-text-field/step--default.png)

### `pattern`

Expresión regular que debe cumplir el valor.

![moni-text-field — pattern=default](../assets/moni-text-field/pattern--default.png)

### `mask`

Patrón Inputmask. Admite opcionales `[]`, grupos `()`, alternadores `|`,
cuantificadores `{n,m}` y los tokens `9`, `a`, `*` y `K` (RUT).

![moni-text-field — mask=default](../assets/moni-text-field/mask--default.png)

### `mask-alias`

Alias integrado de Inputmask, por ejemplo `email`, `datetime`, `numeric`, `currency` o `ip`.

![moni-text-field — mask-alias=default](../assets/moni-text-field/maskAlias--default.png)

### `mask-options`

Opciones avanzadas de Inputmask. También acepta JSON mediante el atributo `mask-options`.

![moni-text-field — mask-options=default](../assets/moni-text-field/maskOptions--default.png)
