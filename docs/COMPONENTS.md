# Componentes Web de Moni UI 🧩

Esta guía describe en detalle la API pública, atributos, eventos y opciones avanzadas de los componentes clave incluidos en `@moni-labs/moni-ui`.

---

## 1. Botón Expresivo (`<moni-button>`)

Componente de botón interactivo basado en Material Design 3 Expressive que incluye soporte para transiciones de forma asimétricas (*morphing*) al presionar e indicador de carga indeterminado.

### Ejemplo Básico:
```html
<moni-button variant="filled" icon="bolt">
  Activar Moni
</moni-button>
```

### API del Componente

#### Atributos y Propiedades:
| Atributo | Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `variant` | `variant` | `'filled' \| 'tonal' \| 'outlined' \| 'text' \| 'fill' \| 'elevated'` | `'filled'` | Estilo visual del botón. |
| `size` | `size` | `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Tamaño físico y paddings del botón. |
| `shape` | `shape` | Ver listado de formas abajo | `'round'` | Forma del borde exterior del botón. |
| `disabled` | `disabled` | `boolean` | `false` | Deshabilita la interacción física y visual. |
| `loading` | `loading` | `boolean` | `false` | Reemplaza el icono y muestra un spinner circular. |
| `active` | `active` | `boolean` | `false` | Estado activo (toggle). Aplica morphing asimétrico de bordes. |
| `icon` | `icon` | `string` | `''` | Nombre de icono Material Symbols a mostrar al inicio. |
| `icon-trailing`| `iconTrailing` | `string` | `''` | Nombre de icono Material Symbols a mostrar al final. |
| `href` | `href` | `string` | `''` | Si está presente, renderiza una etiqueta `<a>` en vez de un `<button>`. |
| `target` | `target` | `string` | `''` | Target para la etiqueta enlace `<a>` (ej. `_blank`). |

#### Formas Disponibles (`shape`):
- **Estándar M3**: `circle` (forma de píldora), `square` (esquinas rectas), `no-round` (sin bordes redondeados).
- **Redondeado Asimétrico**: `round` (redondeado simétrico por defecto), `left-round`, `right-round`, `top-round`, `bottom-round`.
- **Moni Brand Flat (Extensiones de marca)**: `left-round-flat`, `right-round-flat`, `top-round-flat`, `bottom-round-flat`, `inner-round`.

---

## 2. Carrusel Premium (`<moni-carousel>`)

Carrusel optimizado para dispositivos móviles con soporte de arrastre inercial (drag), anclaje de tarjetas (snapping), y un efecto premium de paralaje de imágenes.

### Ejemplo Básico:
```html
<moni-carousel layout="hero" gap="16" padding="24">
  <div class="card">
    <div class="img-parallax-container">
      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" alt="Moni Labs" />
    </div>
    <h2 class="card-title">Moni Labs</h2>
  </div>
  <div class="card">
    <div class="img-parallax-container">
      <img src="https://images.unsplash.com/photo-1604871000636-074fa5117945" alt="Diseño M3" />
    </div>
    <h2 class="card-title">Material 3</h2>
  </div>
</moni-carousel>
```

### API del Componente

#### Atributos y Propiedades:
| Atributo | Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `layout` | `layout` | `'multi-browse' \| 'hero' \| 'uncontained'` | `'multi-browse'` | Define cómo se calculan y visualizan las tarjetas. |
| `auto` | `auto` | `boolean` | `true` | Calcula el tamaño de tarjetas automáticamente según el contenedor. |
| `large-width` | `largeWidth` | `number` | `220` | Ancho de tarjeta grande en píxeles (si `auto` es `false`). |
| `medium-width`| `mediumWidth`| `number` | `96` | Ancho de tarjeta mediana en píxeles. |
| `small-width` | `smallWidth` | `number` | `48` | Ancho de tarjeta pequeña en píxeles. |
| `gap` | `gap` | `number` | `8` | Separación entre tarjetas en píxeles. |
| `padding` | `padding` | `number` | `16` | Padding de inicio y fin del carrusel en píxeles. |
| `border-radius`| `borderRadius`| `number` | `28` | Radio de esquinas de las tarjetas del carrusel. |
| `header-text` | `headerText` | `string` | `''` | Título del encabezado del carrusel. |
| `show-all` | `showAll` | `boolean` | `false` | Muestra un botón de acción "Ver todo". |
| `show-all-text`| `showAllText`| `string` | `'Show all'`| Personalizar el texto de la acción "Ver todo". |
| `hide-nav` | `hideNav` | `boolean` | `false` | Oculta los botones de navegación izquierdo/derecho. |

---

## 3. Selector con Categorías (`<moni-select>`)

Componente dropdown selectivo avanzado que soporta agrupaciones jerárquicas en cascada, búsqueda difusa integrada y conversión automática a Drawer inferior en pantallas pequeñas (mobile).

### Ejemplo Básico:
```html
<moni-select label="Elige una opción" searchable clearable>
  <moni-select-option value="chile" group="Sudamérica">Chile</moni-select-option>
  <moni-select-option value="argentina" group="Sudamérica">Argentina</moni-select-option>
  <moni-select-option value="espana" group="Europa">España</moni-select-option>
</moni-select>
```

### API del Componente

#### Atributos y Propiedades:
| Atributo | Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `name` | `string` | `''` | Nombre para integración con formularios HTML estándar. |
| `label` | `label` | `string` | `''` | Etiqueta del input select. |
| `variant` | `variant` | `'filled' \| 'outlined'` | `'filled'` | Variante de campo de texto (Material 3). |
| `value` | `value` | `string` | `''` | Valor seleccionado actualmente. |
| `disabled` | `disabled` | `boolean` | `false` | Deshabilita la interacción del control. |
| `loading` | `loading` | `boolean` | `false` | Muestra indicador de carga lineal sobre la base. |
| `searchable` | `searchable` | `boolean` | `false` | Muestra input de texto para filtrado en tiempo real. |
| `clearable` | `clearable` | `boolean` | `false` | Muestra botón de icono cruz para borrar selección. |
| `sheet` | `sheet` | `boolean` | `false` | Fuerza comportamiento de Bottom Sheet / Cajón inferior. |
| `placeholder` | `placeholder` | `string` | `''` | Texto placeholder en el input de búsqueda. |

#### Eventos Despachados:
- `change`: Se despacha cuando el usuario selecciona una opción diferente. Contiene en `event.target.value` el nuevo valor seleccionado.

---

## 4. Formas de Marca (`<moni-shape>`)

Aplica máscaras vectoriales SVG dinámicas a imágenes, avatares o cualquier contenedor HTML.

### Ejemplo Básico:
```html
<!-- Máscara expresiva de flor con fondo primario y sombra -->
<moni-shape type="flower" size="large" border shadow>
  <img src="profile.jpg" alt="Perfil" />
</moni-shape>
```

### API del Componente

#### Atributos y Propiedades:
| Atributo | Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `type` | `type` | Ver listado de formas abajo | `'rounded'` | El identificador de máscara de forma SVG. |
| `size` | `size` | `'small' \| 'medium' \| 'large' \| 'extra'` | `'medium'` | Dimensiones físicas predefinidas (2rem a 8rem). |
| `border` | `border` | `boolean` | `false` | Añade un borde delgado alrededor de la máscara. |
| `shadow` | `shadow` | `boolean` | `false` | Aplica una sombra suave de elevación. |
| `color` | `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'surface'` | `'primary'`| Color de fondo si no contiene slots o elementos. |
| `shape-radius` | `shapeRadius` | `string` | `''` | Override de CSS `border-radius` (solo para formas genéricas). |

#### Tipos de Forma Disponibles (`type`):
- **Genéricos**: `square`, `rounded`, `circle`, `top-round`, `bottom-round`, `left-round`, `right-round`.
- **Expresivos (Moni)**: `heart` (corazón), `star` (estrella), `boom` (explosión), `burst` (destello), `sunny` (sol), `very-sunny`, `flower` (flor), `leaf-clover4` (trébol de 4 hojas), `sided-cookie12` (galleta), `sided-cookie7`, `clamshell` (concha), `gem` (gema), `wavy` (onda), `puffy`.
