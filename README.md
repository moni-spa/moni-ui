# @moni/ui 🎨

> Sistema de diseño unificado y responsivo para Moni. Basado en **Material Design 3 Expressive**, diseñado para ser mobile-first, accesible y altamente personalizable.

`@moni/ui` es una biblioteca de componentes web listos para producción, construida con **Lit** y **TypeScript**. Es totalmente agnóstica de frameworks (funciona nativamente en HTML, React, Vue, Angular, Svelte, etc.) y cuenta con integraciones optimizadas para **Svelte 5** y **TailwindCSS v4**.

---

## Características principales ✨

- 📱 **Mobile-First & Responsivo**: Diseñado desde las bases para funcionar perfectamente en pantallas táctiles y móviles.
- 🎨 **Material Design 3 Expressive**: Implementación de los principios de diseño de Google M3 con extensiones expresivas de la marca Moni.
- 🧩 **Web Components Nativos**: Basados en Lit, ligeros, encapsulados en Shadow DOM y compatibles con cualquier framework.
- 🌈 **Motor de Temas Dinámico**: Generación inteligente de esquemas de color armónicos HCT utilizando las utilidades de color oficiales de Material Design (`@material/material-color-utilities`).
- 🏃‍♂️ **Animaciones de Alto Rendimiento**: Core de animaciones fluidas impulsado por **GSAP**.
- 🛠️ **Integración de Svelte 5**: Utilidades reactivas con *Runes* para controlar dinámicamente la densidad, fuentes, bordes y modos claro/oscuro.

---

## Instalación 📦

Instala `@moni/ui` y sus dependencias en tu proyecto:

```bash
npm install @moni/ui svelte tailwindcss
# O con bun
bun add @moni/ui svelte tailwindcss
```

---

## Uso Básico 🚀

### 1. Registrar los Componentes Web

Para usar los componentes en cualquier lugar de tu aplicación, importa el punto de entrada principal. Esto registrará automáticamente todos los elementos `<moni-*>` en el registro de elementos personalizados del navegador (`customElements`).

```javascript
import '@moni/ui';
```

O si solo deseas registrar los componentes web sin importar utilidades adicionales de Svelte:

```javascript
import '@moni/ui/web-components';
```

### 2. Importar los Estilos Globales

Asegúrate de importar las variables del tema y estilos base en tu archivo de estilos principal (como `index.css` o `app.css`):

```css
@import '@moni/ui/styles';
```

### 3. Usar los Componentes en tu HTML

```html
<!-- Botón Material 3 con forma morph al presionar -->
<moni-button variant="filled" size="medium" icon="bolt">
  Activar Moni
</moni-button>

<!-- Carrusel táctil con snapping fluido y paralaje -->
<moni-carousel layout="hero" gap="16">
  <div class="card">
    <img src="slide1.jpg" alt="Imagen 1" />
    <h2 class="card-title">Moni Labs</h2>
  </div>
  <div class="card">
    <img src="slide2.jpg" alt="Imagen 2" />
    <h2 class="card-title">Seguridad Móvil</h2>
  </div>
</moni-carousel>

<!-- Switch responsivo -->
<moni-switch checked></moni-switch>
```

---

## Motor de Temas Dinámico (Theme Engine) 🎨

`@moni/ui` incluye un motor de temas altamente avanzado que genera una paleta completa de Material Design 3 de 38 colores armónicos a partir de un único color semilla hexadecimal.

### Integración en Svelte 5 (Runes)

Puedes utilizar el motor de temas reactivo importando `getThemeEngine` en tu aplicación Svelte:

```svelte
<script>
  import { getThemeEngine } from '@moni/ui';

  const theme = getThemeEngine({
    seedColor: '#4f46e5', // Color semilla
    mode: 'dark',        // 'light' | 'dark'
    density: 'default',  // 'default' | 'comfortable' | 'compact'
    radius: 'medium',     // 'none' | 'small' | 'medium' | 'large' | 'full'
    font: 'sans'         // 'sans' | 'serif' | 'mono'
  });

  function toggleMode() {
    theme.mode = theme.mode === 'light' ? 'dark' : 'light';
  }
</script>

<main>
  <button on:click={toggleMode}>
    Modo actual: {theme.mode}
  </button>
  
  <moni-button>Componente Tematizado</moni-button>
</main>
```

---

## Componentes Disponibles 🧩

A continuación, una lista de los componentes más utilizados incluidos en el paquete:

- **Botones & Acción**: `<moni-button>`, `<moni-fab>`, `<moni-button-group>`, `<moni-split-button>`, `<moni-button-segment>`
- **Navegación**: `<moni-nav>`, `<moni-nav-item>`, `<moni-tabs>`, `<moni-tab>`
- **Formularios**: `<moni-text-field>`, `<moni-textarea>`, `<moni-select>`, `<moni-checkbox>`, `<moni-radio>`, `<moni-switch>`, `<moni-file-field>`, `<moni-color-field>`, `<moni-time-picker>`
- **Retroalimentación**: `<moni-progress>`, `<moni-loading-indicator>`, `<moni-badge>`, `<moni-tooltip>`, `<moni-snackbar>`
- **Estructuras & Overlays**: `<moni-card>`, `<moni-dialog>`, `<moni-bottom-sheet>`, `<moni-side-sheet>`, `<moni-expansion>`, `<moni-menu>`, `<moni-menu-item>`, `<moni-context-menu>`
- **Experiencias Especiales**: 
  - `<moni-carousel>`: Carrusel premium optimizado para móvil con gestos táctiles directos, snapping inercial y paralaje en imágenes.
  - `<moni-morph-modal>`: Modal premium que realiza una animación morph desde un botón o elemento desencadenante hasta la ventana emergente central.
  - `<moni-shape>`: Contenedor visual que aplica máscaras vectoriales expresivas (corazones, estrellas, ráfagas, galletas multi-lados) para un branding único.

---

## Desarrollo Local y Construcción 🛠️

Si deseas contribuir al desarrollo o realizar pruebas locales de `@moni/ui`, utiliza los siguientes comandos dentro del directorio:

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

## Licencia 📄

Propiedad exclusiva de **Moni Spa**. Todos los derechos reservados.
