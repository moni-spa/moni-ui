# Carousel

Componente Material Design 3 Expressive Carousel.

Los carruseles muestran una colección de elementos relacionados en una lista horizontal desplazable.
Permiten a los usuarios navegar rápidamente a través de elementos como imágenes, tarjetas, o productos.

**Referencia de la especificación M3:** `m3-docs/components/carousel/specs.md`

**Variantes de diseño:**
- `multi-browse` (por defecto) — Muestra una mezcla de elementos grandes, medianos y pequeños (asomando).
  Mejor para explorar un gran número de elementos.
- `hero` — Se enfoca en un elemento primario grande mientras muestra una fracción del
  siguiente elemento. Mejor para destacar contenido importante.
- `uncontained` — Diseño estándar donde todos los elementos tienen el mismo ancho y
  se desbordan por los bordes del contenedor.

**Animación y Gestos:**
Este componente usa GSAP para animaciones suaves de arrastre, deslizamiento y ajuste,
reflejando las especificaciones de movimiento de alta fidelidad de M3 Expressive. Maneja
gestos táctiles para móviles y arrastre del ratón para escritorio.

**Auto-tamaño (modo `auto`):**
Cuando `auto=true` (por defecto), el carrusel mide su propio ancho y
calcula dinámicamente los tamaños óptimos para los elementos grandes, medianos y pequeños
basados en el `layout` activo para asegurar que encajen perfectamente sin huecos incómodos
ni recortes en los bordes.

- Tag: `moni-carousel`
- Clase: `MoniCarousel`
- Fuente: `src/components/moni-carousel.ts`

## Cuándo usarlo

Usa `moni-carousel` cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.

## Uso básico

```html
<!-- Uso declarativo a través de propiedades DOM (recomendado) -->
<moni-carousel layout="hero"></moni-carousel>
<script>
  const carousel = document.querySelector('moni-carousel');
  carousel.items = [
    { title: 'Elemento 1', img: '/img1.jpg', href: '/link1' },
    { title: 'Elemento 2', img: '/img2.jpg' }
  ];
</script>

<!-- Uso basado en slots (para SSR o contenido estático simple) -->
<moni-carousel layout="uncontained">
  <div slot="item">
    <img src="/img1.jpg" />
    <h3>Elemento Estático</h3>
  </div>
</moni-carousel>
```

## Ejemplo práctico con Tailwind CSS v4

Tailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.

```html
<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
  <moni-carousel></moni-carousel>
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

- Usa `moni-carousel` para su propósito semántico; no lo sustituyas por un `div` estilizado.
- Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.
- Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.

## Propiedades y atributos

| Atributo | Propiedad | Tipo | Default | Descripción |
|---|---|---|---|---|
| `items` | `items` | `CarouselItem[]` | `[]` | Array de elementos a mostrar en el carrusel. Cada elemento requiere al menos `title` e `img`. El opcional `href` renderiza la tarjeta como un enlace. |
| `layout` | `layout` | `'multi-browse' \| 'hero' \| 'uncontained'` | `'multi-browse'` | Variante de diseño visual. Determina cuántos elementos son visibles y cómo escalan. - `'multi-browse'` (por defecto) — Elementos grandes + medianos + pequeños (asomando). - `'hero'` — Uno o más elementos grandes + elemento pequeño asomando. - `'uncontained'` — Elementos de igual ancho que se desbordan por el borde. |
| `auto` | `auto` | `boolean` | `true` | Cuando es `true`, el carrusel calcula los tamaños óptimos de los elementos automáticamente basado en el ancho del contenedor y la variante de `layout` activa. Cuando es `false`, usa los valores explícitos `largeWidth`, `mediumWidth`, `smallWidth`. |
| `large-width` | `largeWidth` | `number` | `220` | Ancho en píxeles para el elemento grande (enfoque principal) del carrusel. Solo se usa cuando `auto=false`. |
| `medium-width` | `mediumWidth` | `number` | `96` | Ancho en píxeles para el elemento de tamaño mediano (secundario) del carrusel. Solo se usa cuando `auto=false` y `layout='multi-browse'`. |
| `small-width` | `smallWidth` | `number` | `48` | Ancho en píxeles para el elemento pequeño (asomando) del carrusel. Solo se usa cuando `auto=false`. |
| `gap` | `gap` | `number` | `8` | Espacio en píxeles entre los elementos del carrusel. |
| `padding` | `padding` | `number` | `16` | Relleno horizontal en píxeles aplicado al inicio de la pista del carrusel. |
| `border-radius` | `borderRadius` | `number` | `28` | Radio del borde en píxeles aplicado a cada tarjeta. |
| `show-all` | `showAll` | `boolean` | `false` | Cuando es `true`, renderiza un enlace "Mostrar todo" en el encabezado. |
| `show-all-text` | `showAllText` | `string` | `'Show all'` | Texto de etiqueta para el enlace "Mostrar todo". |
| `header-text` | `headerText` | `string` | `''` | Encabezado de sección opcional renderizado sobre la pista del carrusel. |
| `hide-nav` | `hideNav` | `boolean` | `false` | Cuando es `true`, oculta los botones de flecha de navegación anterior/siguiente. |
| `infinite` | `infinite` | `boolean` | `false` | Cuando es `true`, habilita el bucle infinito sin interrupciones clonando la lista de elementos a través de un búfer de desplazamiento virtual grande, luego reposicionando silenciosamente el desplazamiento cuando el usuario se acerca a cualquier borde. |
| `autoplay` | `autoplay` | `boolean` | `false` | Cuando es `true`, avanza automáticamente el carrusel en el intervalo definido por `autoplayInterval`. La reproducción automática se detiene durante las interacciones de arrastre activas. |
| `autoplay-interval` | `autoplayInterval` | `number` | `3000` | Milisegundos entre los avances automáticos de diapositivas cuando `autoplay=true`. |

## Slots

- `item`: Alternativa a la propiedad `items`. Inserta elementos HTML individuales
       en lugar de pasar objetos de datos.

## Eventos

- `item-click`: evento compuesto y burbujeante emitido por el componente.
- `show-all-click`: evento compuesto y burbujeante emitido por el componente.

## Métodos públicos

No expone métodos públicos adicionales.

## CSS Parts

- `carousel`: El envoltorio exterior.
- `track`: El elemento de la pista desplazable.
- `item`: Contenedores de elementos del carrusel individuales.
- `img`: Los elementos de imagen dentro de los elementos.
- `title`: Los elementos de texto de título dentro de los elementos.

## CSS Custom Properties consumidas

- `--carousel-border-radius`
- `--carousel-gap`
- `--carousel-padding`
- `--carousel-right-padding`
- `--carousel-snap-width`
- `--carousel-track-width`
- `--elevate1`
- `--elevate2`
- `--font-icon`
- `--font-title`
- `--on-primary-container`
- `--on-surface`
- `--primary`
- `--primary-container`
- `--speed2`
- `--surface-container-high`
- `--surface-container-highest`

## Referencia visual por variable

Cada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.

### `items`

Array de elementos a mostrar en el carrusel.
Cada elemento requiere al menos `title` e `img`. El opcional `href` renderiza la tarjeta como un enlace.

![moni-carousel — items=default](../assets/moni-carousel/items--default.png)

### `layout`

Variante de diseño visual. Determina cuántos elementos son visibles y cómo escalan.
- `'multi-browse'` (por defecto) — Elementos grandes + medianos + pequeños (asomando).
- `'hero'` — Uno o más elementos grandes + elemento pequeño asomando.
- `'uncontained'` — Elementos de igual ancho que se desbordan por el borde.

![moni-carousel — layout=multi-browse](../assets/moni-carousel/layout--multi-browse.png)

![moni-carousel — layout=hero](../assets/moni-carousel/layout--hero.png)

![moni-carousel — layout=uncontained](../assets/moni-carousel/layout--uncontained.png)

### `auto`

Cuando es `true`, el carrusel calcula los tamaños óptimos de los elementos automáticamente
basado en el ancho del contenedor y la variante de `layout` activa.
Cuando es `false`, usa los valores explícitos `largeWidth`, `mediumWidth`, `smallWidth`.

![moni-carousel — auto=false](../assets/moni-carousel/auto--false.png)

![moni-carousel — auto=true](../assets/moni-carousel/auto--true.png)

### `large-width`

Ancho en píxeles para el elemento grande (enfoque principal) del carrusel.
Solo se usa cuando `auto=false`.

![moni-carousel — large-width=default](../assets/moni-carousel/largeWidth--default.png)

### `medium-width`

Ancho en píxeles para el elemento de tamaño mediano (secundario) del carrusel.
Solo se usa cuando `auto=false` y `layout='multi-browse'`.

![moni-carousel — medium-width=default](../assets/moni-carousel/mediumWidth--default.png)

### `small-width`

Ancho en píxeles para el elemento pequeño (asomando) del carrusel.
Solo se usa cuando `auto=false`.

![moni-carousel — small-width=default](../assets/moni-carousel/smallWidth--default.png)

### `gap`

Espacio en píxeles entre los elementos del carrusel.

![moni-carousel — gap=default](../assets/moni-carousel/gap--default.png)

### `padding`

Relleno horizontal en píxeles aplicado al inicio de la pista del carrusel.

![moni-carousel — padding=default](../assets/moni-carousel/padding--default.png)

### `border-radius`

Radio del borde en píxeles aplicado a cada tarjeta.

![moni-carousel — border-radius=default](../assets/moni-carousel/borderRadius--default.png)

### `show-all`

Cuando es `true`, renderiza un enlace "Mostrar todo" en el encabezado.

![moni-carousel — show-all=false](../assets/moni-carousel/showAll--false.png)

![moni-carousel — show-all=true](../assets/moni-carousel/showAll--true.png)

### `show-all-text`

Texto de etiqueta para el enlace "Mostrar todo".

![moni-carousel — show-all-text=default](../assets/moni-carousel/showAllText--default.png)

### `header-text`

Encabezado de sección opcional renderizado sobre la pista del carrusel.

![moni-carousel — header-text=default](../assets/moni-carousel/headerText--default.png)

### `hide-nav`

Cuando es `true`, oculta los botones de flecha de navegación anterior/siguiente.

![moni-carousel — hide-nav=false](../assets/moni-carousel/hideNav--false.png)

![moni-carousel — hide-nav=true](../assets/moni-carousel/hideNav--true.png)

### `infinite`

Cuando es `true`, habilita el bucle infinito sin interrupciones clonando la lista de elementos
a través de un búfer de desplazamiento virtual grande, luego reposicionando silenciosamente
el desplazamiento cuando el usuario se acerca a cualquier borde.

![moni-carousel — infinite=false](../assets/moni-carousel/infinite--false.png)

![moni-carousel — infinite=true](../assets/moni-carousel/infinite--true.png)

### `autoplay`

Cuando es `true`, avanza automáticamente el carrusel en el intervalo definido
por `autoplayInterval`. La reproducción automática se detiene durante las interacciones de arrastre activas.

![moni-carousel — autoplay=false](../assets/moni-carousel/autoplay--false.png)

![moni-carousel — autoplay=true](../assets/moni-carousel/autoplay--true.png)

### `autoplay-interval`

Milisegundos entre los avances automáticos de diapositivas cuando `autoplay=true`.

![moni-carousel — autoplay-interval=default](../assets/moni-carousel/autoplayInterval--default.png)
