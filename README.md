# @moni-spa/moni-ui 🎨

> Sistema de diseño unificado, responsivo y de alto rendimiento para Moni. Basado en **Material Design 3 Expressive**, diseñado específicamente para ser mobile-first, accesible y con animaciones de nivel premium.

`@moni-spa/moni-ui` es una biblioteca de componentes web listos para producción, construida con **Lit** y **TypeScript**. Es totalmente agnóstica de frameworks (funciona nativamente en HTML, React, Vue, Angular, Svelte, etc.) y cuenta con integraciones optimizadas para **Svelte 5** y **TailwindCSS v4**.

---

## Características principales ✨

- 📱 **Mobile-First & Responsivo**: Diseñado desde las bases para funcionar perfectamente en pantallas táctiles y móviles, cumpliendo con las pautas de accesibilidad y objetivos de toque mínimos de 48dp.
- 🎨 **Material Design 3 Expressive**: Implementación fiel de los principios de diseño de Google M3 con extensiones expresivas de la marca Moni (esquinas asimétricas, formas combinadas, y animaciones de morphing).
- 🧩 **Web Components Nativos**: Basados en Lit, ligeros, encapsulados mediante Shadow DOM y compatibles con cualquier framework o HTML plano.
- 🌈 **Motor de Temas Dinámico**: Generación inteligente de esquemas de color armónicos HCT utilizando las utilidades de color oficiales de Material Design (`@material/material-color-utilities`).
- 🏃‍♂️ **Animaciones de Alto Rendimiento**: Core de transiciones y gestos inerciales premium impulsado por **GSAP**.
- 🛠️ **Integración de Svelte 5**: Utilidades reactivas con *Runes* para controlar dinámicamente la densidad, fuentes, bordes y modos claro/oscuro.

---

## Instalación 📦

Instala `@moni-spa/moni-ui` y sus dependencias en tu proyecto:

```bash
npm install @moni-spa/moni-ui svelte tailwindcss
# O con bun
bun add @moni-spa/moni-ui svelte tailwindcss
```

---

## Uso Básico 🚀

### 1. Registrar los Componentes Web

Para usar los componentes en tu aplicación, importa el punto de entrada principal. Esto registrará automáticamente todos los elementos `<moni-*>` en el registro de elementos personalizados del navegador (`customElements`).

```javascript
import '@moni-spa/moni-ui';
```

O si solo deseas registrar los componentes web sin importar utilidades adicionales de Svelte:

```javascript
import '@moni-spa/moni-ui/web-components';
```

### 2. Importar los Estilos Globales

Asegúrate de importar las variables del tema y estilos base en tu archivo de estilos principal (como `index.css` o `app.css`):

```css
@import '@moni-spa/moni-ui/styles';
```

---

## Guía Detallada de Componentes Clave 🧩

### 1. Botón Expresivo (`<moni-button>`)

Rinde un botón nativo con soporte para morphing al presionar y toggles activos.

```html
<!-- Botón primario con icono líder -->
<moni-button variant="filled" icon="bolt">
  Activar Moni
</moni-button>

<!-- Botón de selección con morph de bordes activo (round ↔ square) -->
<moni-button variant="tonal" shape="round" active>
  Seleccionado
</moni-button>
```

#### Atributos Clave:
- `variant`: `filled` (por defecto) | `tonal` | `elevated` | `outlined` | `text` | `fill`.
- `size`: `xsmall` | `small` | `medium` | `large` | `xlarge`.
- `shape`: `round` | `square` | `circle` | `no-round` | `left-round` | `right-round` | `left-round-flat` (variante plana de marca), etc.
- `active`: Aplica el estado de toggle y el morphing asimétrico de bordes.
- `loading`: Reemplaza el icono por un indicador de carga circular indeterminado.

---

### 2. Carrusel Premium (`<moni-carousel>`)

Carrusel táctil con scrolling inercial, snapping de tarjetas optimizado y efecto de paralaje nativo para imágenes.

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
    <h2 class="card-title">Material 3 Expressive</h2>
  </div>
</moni-carousel>
```

#### Atributos Clave:
- `layout`: `uncontained` (sin bordes) | `hero` (la primera tarjeta es grande, las siguientes pequeñas) | `multi-browse` (múltiples tarjetas visibles con gradiente de tamaño).
- `gap`: Distancia en píxeles entre tarjetas.
- `padding`: Padding del carrusel en píxeles.
- `hideNav`: Oculta las flechas de navegación en pantallas de escritorio.

---

### 3. Selector con Categorías (`<moni-select>`)

Componente de selección avanzado que soporta búsqueda difusa y categorías anidadas en cascada. En pantallas pequeñas, se adapta automáticamente como un Drawer/Sheet inferior.

```html
<moni-select label="Elige una opción" searchable clearable>
  <moni-select-option value="chile" group="Sudamérica">Chile</moni-select-option>
  <moni-select-option value="argentina" group="Sudamérica">Argentina</moni-select-option>
  <moni-select-option value="espana" group="Europa">España</moni-select-option>
  <moni-select-option value="italia" group="Europa">Italia</moni-select-option>
</moni-select>
```

---

### 4. Formas de Marca (`<moni-shape>`)

Aplica máscaras vectoriales (SVG Clip-Paths/Masks) predefinidas y expresivas a cualquier contenido.

```html
<!-- Aplica una máscara en forma de corazón al elemento -->
<moni-shape type="heart" size="large" border shadow>
  <img src="user-profile.jpg" alt="Foto perfil" />
</moni-shape>

<!-- Máscara de estrella con fondo del contenedor secundario -->
<moni-shape type="star" size="medium" color="secondary"></moni-shape>
```

#### Tipos de Forma Disponibles (`type`):
- **Genéricos**: `square`, `rounded`, `circle`, `top-round`, `bottom-round`, `left-round`, `right-round`.
- **Expresivos (Moni)**: `heart`, `star`, `boom`, `burst`, `sunny`, `very-sunny`, `flower`, `leaf-clover4`, `sided-cookie12`, `sided-cookie7`, `clamshell`, `gem`, `wavy`, `puffy`.

---

## Motor de Temas Dinámico (Theme Engine) 🌈

`@moni-spa/moni-ui` cuenta con un potente motor de generación de color basado en la API **HCT** de Material Design 3, el cual ajusta automáticamente los contrastes para cumplir con la norma **WCAG AA**.

### Integración en Svelte 5 (Runes)

Puedes utilizar el motor de temas reactivo importando `getThemeEngine` en tu aplicación Svelte:

```svelte
<script>
  import { getThemeEngine } from '@moni-spa/moni-ui';

  // Inicializa el tema reactivo (usando Runes de Svelte 5)
  const theme = getThemeEngine({
    seedColor: '#4f46e5', // Color semilla base
    mode: 'dark',        // 'light' | 'dark'
    density: 'default',  // 'default' | 'comfortable' | 'compact'
    radius: 'medium',     // 'none' | 'small' | 'medium' | 'large' | 'full'
    font: 'sans'         // 'sans' | 'serif' | 'mono'
  });

  function toggleMode() {
    theme.mode = theme.mode === 'light' ? 'dark' : 'light';
  }
</script>

<main class="app">
  <button on:click={toggleMode}>
    Modo actual: {theme.mode}
  </button>
  
  <moni-button>Componente Tematizado</moni-button>
</main>
```

---

## Integración con TailwindCSS v4 🎨

El sistema de tokens de `@moni-spa/moni-ui` se inyecta como variables CSS nativas en el `:root`. Para utilizarlos en tus clases de TailwindCSS v4, simplemente usa las variables directamente o configúralas en tu archivo CSS:

```css
@theme {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-background-custom: var(--color-background);
  --radius-custom: var(--radius-medium);
}
```

Ahora puedes escribir clases como:
```html
<div class="bg-primary text-on-primary rounded-custom p-4">
  Contenido tematizado con Tailwind
</div>
```

---

## Desarrollo Local y Construcción 🛠_

Si deseas contribuir al desarrollo o realizar pruebas locales de `@moni-spa/moni-ui`, utiliza los siguientes comandos dentro del directorio del paquete:

```bash
# Instalar dependencias
bun install

# Ejecutar el Sandbox interactivo (Moni-Labs)
bun run dev --filter moni-labs

# Compilar el paquete para producción (genera dist/)
bun run build

# Ejecutar pruebas unitarias de Vitest (JSDOM)
bun run test

# Ejecutar pruebas en modo observador
bun run test:watch
```

---

## Guía de Publicación a NPM y GitHub 🚀

### 1. Confirmar Cambios en GitHub

Asegúrate de tener un repositorio limpio e independiente:

```bash
git add .
git commit -m "release: v0.2.0 - setup standalone package"
git push -u origin main
```

### 2. Publicación en NPM

Para publicar el paquete de forma pública bajo el ámbito `@moni-spa`:

1. Inicia sesión en tu cuenta de NPM en la terminal:
   ```bash
   npm login
   ```
2. Asegúrate de compilar los archivos finales:
   ```bash
   npm run build
   ```
3. Ejecuta la publicación (el acceso público es obligatorio para ámbitos de organización nuevos):
   ```bash
   npm publish --access public
   ```

---

## Licencia 📄

Publicado bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más información.
