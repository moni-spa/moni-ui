# Chip

Componente Material Design 3 Chip.

Los chips (fichas) son elementos compactos e interactivos que representan acciones, filtros,
atributos o entradas de usuario. Son contenedores solo visuales — el consumidor
es dueño de todo el manejo del estado (selección, eliminación, estado de filtro activo).

**Referencia de la especificación M3:** `m3-docs/components/chips/specs.md`

**Variantes:**
- `assist` (por defecto) — Acciones inteligentes o sugeridas. Usa borde `var(--outline)`
  para asegurar un contraste de 3:1 según la especificación de accesibilidad de M3. Alias: `outlined`.
- `filter` — Filtros para una colección de contenido. Muestra una marca de verificación al principio cuando
  está `selected`. Alias: `fill`.
- `input` — Representa una entrada de usuario discreta (etiquetas, tokens). Añade un icono de
  eliminación al final cuando es `removable`.
- `suggestion` — Sugerencias generadas por el producto. Con contorno, sin iconos.

**Medidas M3:**
- Altura por defecto: 32dp (tamaño `small` = línea base de la especificación M3).
- Radio de esquina: 8dp.
- Tamaño de icono: 18dp.
- Los tamaños `medium` y `large` son extensiones de Moni con áreas táctiles más grandes.

**Accesibilidad:**
Los chips `assist` y `suggestion` usan `var(--outline)` para su trazo para
garantizar un contraste de 3:1 contra el fondo de la superficie en reposo.
`filter` e `input` usan `outline-variant` en reposo pero logran contraste
a través del relleno `secondary-container` cuando se seleccionan.

- Tag: `moni-chip`
- Clase: `MoniChip`
- Fuente: `src/components/moni-chip.ts`

## Cuándo usarlo

Usa `moni-chip` cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.

## Uso básico

```html
<!-- Chip de filtro con estado seleccionado -->
<moni-chip variant="filter" selected>Technology</moni-chip>

<!-- Chip de entrada (etiqueta/token) -->
<moni-chip variant="input" removable icon="label">TypeScript</moni-chip>

<!-- Chip de asistencia con icono -->
<moni-chip icon="directions_car">Get directions</moni-chip>
```

## Ejemplo práctico con Tailwind CSS v4

Tailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.

```html
<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
  <moni-chip>Accesibilidad</moni-chip>
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

- Usa `moni-chip` para su propósito semántico; no lo sustituyas por un `div` estilizado.
- Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.
- Durante una operación asíncrona combina el estado `loading` —si existe— con `disabled` para evitar envíos duplicados.
- Cuando el control muestre únicamente un icono, añade siempre un `aria-label` descriptivo.
- Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.

## Propiedades y atributos

| Atributo | Propiedad | Tipo | Default | Descripción |
|---|---|---|---|---|
| `variant` | `variant` | `'assist' \| 'filter' \| 'input' \| 'suggestion' \| 'outlined' \| 'fill'` | `'assist'` | Variante visual del chip. |
| `size` | `size` | `'small' \| 'medium' \| 'large'` | `'small'` | Define las dimensiones del chip. |
| `shape` | `shape` | `'round' \| 'no-round' \| 'square' \| 'circle' \| 'left-round' \| 'right-round' \| 'top-round' \| 'bottom-round'` | `'round'` | Forma del radio del borde del chip. |
| `selected` | `selected` | `boolean` | `false` | Si es true, marca el chip como seleccionado (útil para chips de filtro). |
| `removable` | `removable` | `boolean` | `false` | Si es true, muestra un icono de cierre al final para permitir la eliminación. |
| `disabled` | `disabled` | `boolean` | `false` | Deshabilita el chip. |
| `loading` | `loading` | `boolean` | `false` | Si es true, muestra un indicador de carga dentro del chip. |
| `icon` | `icon` | `string` | `''` | Nombre del icono inicial (Material Symbols). |

## Slots

- `default`: El texto de la etiqueta del chip.
- `icon`: Anula el icono inicial (alternativa al atributo `icon`).

## Eventos

- `remove`: evento compuesto y burbujeante emitido por el componente.

## Métodos públicos

No expone métodos públicos adicionales.

## CSS Parts

- `chip`: Parte interna personalizable.
- `label`: Parte interna personalizable.
- `icon`: Parte interna personalizable.
- `loading`: Parte interna personalizable.
- `remove`: Parte interna personalizable.

## CSS Custom Properties consumidas

- `--_icon-size`
- `--_padding`
- `--_round`
- `--_size`
- `--font`
- `--font-icon`
- `--on-secondary-container`
- `--on-surface`
- `--on-surface-variant`
- `--outline`
- `--outline-variant`
- `--primary`
- `--secondary-container`
- `--speed2`
- `--speed3`

## Referencia visual por variable

Cada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.

### `variant`

Variante visual del chip.

![moni-chip — variant=assist](../assets/moni-chip/variant--assist.png)

![moni-chip — variant=filter](../assets/moni-chip/variant--filter.png)

![moni-chip — variant=input](../assets/moni-chip/variant--input.png)

![moni-chip — variant=suggestion](../assets/moni-chip/variant--suggestion.png)

![moni-chip — variant=outlined](../assets/moni-chip/variant--outlined.png)

![moni-chip — variant=fill](../assets/moni-chip/variant--fill.png)

### `size`

Define las dimensiones del chip.

![moni-chip — size=small](../assets/moni-chip/size--small.png)

![moni-chip — size=medium](../assets/moni-chip/size--medium.png)

![moni-chip — size=large](../assets/moni-chip/size--large.png)

### `shape`

Forma del radio del borde del chip.

![moni-chip — shape=round](../assets/moni-chip/shape--round.png)

![moni-chip — shape=no-round](../assets/moni-chip/shape--no-round.png)

![moni-chip — shape=square](../assets/moni-chip/shape--square.png)

![moni-chip — shape=circle](../assets/moni-chip/shape--circle.png)

![moni-chip — shape=left-round](../assets/moni-chip/shape--left-round.png)

![moni-chip — shape=right-round](../assets/moni-chip/shape--right-round.png)

![moni-chip — shape=top-round](../assets/moni-chip/shape--top-round.png)

![moni-chip — shape=bottom-round](../assets/moni-chip/shape--bottom-round.png)

### `selected`

Si es true, marca el chip como seleccionado (útil para chips de filtro).

![moni-chip — selected=false](../assets/moni-chip/selected--false.png)

![moni-chip — selected=true](../assets/moni-chip/selected--true.png)

### `removable`

Si es true, muestra un icono de cierre al final para permitir la eliminación.

![moni-chip — removable=false](../assets/moni-chip/removable--false.png)

![moni-chip — removable=true](../assets/moni-chip/removable--true.png)

### `disabled`

Deshabilita el chip.

![moni-chip — disabled=false](../assets/moni-chip/disabled--false.png)

![moni-chip — disabled=true](../assets/moni-chip/disabled--true.png)

### `loading`

Si es true, muestra un indicador de carga dentro del chip.

![moni-chip — loading=false](../assets/moni-chip/loading--false.png)

![moni-chip — loading=true](../assets/moni-chip/loading--true.png)

### `icon`

Nombre del icono inicial (Material Symbols).

![moni-chip — icon=default](../assets/moni-chip/icon--default.png)
