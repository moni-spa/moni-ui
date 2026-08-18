# Divider

Componente Material Design 3 Divider (Separador).

Una regla delgada horizontal (o vertical) utilizada para separar visualmente secciones
de contenido dentro de listas, diseños y tarjetas.

**Referencia de la especificación M3:** `m3-docs/components/divider/specs.md`

**Medidas M3:**
- Grosor: 1dp (`0.0625rem`).
- Color: `outline-variant` — sutil en todos los fondos de superficie.
- Las variantes insertadas (inset) alinean la línea con el contenido de la lista:
  - `leading` — margen de 16dp desde el borde inicial (se alinea con el texto del icono).
  - `middle`  — margen de 16dp en ambos bordes.
  - `none`    — sangría completa (sin margen).

**Uso vertical:**
Aunque todavía no se expone como un atributo, el selector de atributos CSS `[vertical]`
está soportado. Establezca `vertical` como un atributo HTML para renderizar un separador
vertical de 1dp de ancho que se estira para coincidir con el eje transversal de su contenedor flex.

- Tag: `moni-divider`
- Clase: `MoniDivider`
- Fuente: `src/components/moni-divider.ts`

## Cuándo usarlo

Usa `moni-divider` cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.

## Uso básico

```html
<!-- Separador de sangría completa entre secciones -->
<moni-divider inset="none"></moni-divider>

<!-- Separador de inserción inicial en una lista (se alinea con el texto del elemento de lista) -->
<moni-divider></moni-divider>

<!-- Separador vertical dentro de un contenedor flex -->
<div style="display:flex; height: 3rem; align-items:center; gap: 1rem;">
  <span>Sección A</span>
  <moni-divider vertical></moni-divider>
  <span>Sección B</span>
</div>
```

## Ejemplo práctico con Tailwind CSS v4

Tailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.

```html
<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
  <moni-divider></moni-divider>
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

- Usa `moni-divider` para su propósito semántico; no lo sustituyas por un `div` estilizado.
- Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.
- Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.

## Propiedades y atributos

| Atributo | Propiedad | Tipo | Default | Descripción |
|---|---|---|---|---|
| `inset` | `inset` | `'leading' \| 'middle' \| 'none'` | `'leading'` | Controla el margen horizontal en la línea del separador.  - `'leading'` (por defecto) — Margen de 16dp solo desde el borde inicial (inicio).   Usar en listas para alinear el separador con el texto principal de los elementos de la lista. - `'middle'`  — Margen de 16dp tanto en el borde inicial como en el final.   Usar para separar secciones donde una sangría completa sería visualmente demasiado pesada. - `'none'`    — Sin margen; la línea abarca todo el ancho del padre.   Usar como separador de secciones o entre tarjetas. |

## Slots

Este componente no declara slots públicos.

## Eventos

No declara eventos propios.

## Métodos públicos

No expone métodos públicos adicionales.

## CSS Parts

No declara CSS Parts.

## CSS Custom Properties consumidas

- `--font`
- `--outline-variant`

## Referencia visual por variable

Cada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.

### `inset`

Controla el margen horizontal en la línea del separador.

- `'leading'` (por defecto) — Margen de 16dp solo desde el borde inicial (inicio).
  Usar en listas para alinear el separador con el texto principal de los elementos de la lista.
- `'middle'`  — Margen de 16dp tanto en el borde inicial como en el final.
  Usar para separar secciones donde una sangría completa sería visualmente demasiado pesada.
- `'none'`    — Sin margen; la línea abarca todo el ancho del padre.
  Usar como separador de secciones o entre tarjetas.

![moni-divider — inset=leading](../assets/moni-divider/inset--leading.png)

![moni-divider — inset=middle](../assets/moni-divider/inset--middle.png)

![moni-divider — inset=none](../assets/moni-divider/inset--none.png)
