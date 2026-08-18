# Moni UI 🎨

> Sistema de diseño unificado, responsivo y de alto rendimiento para la plataforma Moni. Basado en **Material Design 3 Expressive**, optimizado para móviles (mobile-first) y con micro-animaciones premium.

`@moni-labs/moni-ui` es una biblioteca de componentes web construida con **Lit** y **TypeScript**. Es totalmente agnóstica de frameworks (funciona nativamente en HTML, React, Vue, Angular, Svelte, etc.) y cuenta con integraciones optimizadas para **Svelte 5** y **TailwindCSS v4** que no interfieren con otros frameworks de estilos.

---

## Características principales ✨

- 📱 **Mobile-First & Responsivo**: Cumple con pautas de accesibilidad y objetivos de toque mínimos de 48dp.
- 🧩 **Web Components Nativos**: Encapsulados mediante Shadow DOM e independientes del framework.
- 🎨 **Aislamiento de CSS Estricto**: Custom properties bajo el espacio de nombres `--moni-*` para evitar conflictos visuales con DaisyUI, Bootstrap, etc.
- 🌈 **Motor de Temas HCT**: Generación reactiva de color dinámico y contrastes WCAG AA basados en el color semilla.
- 🏃‍♂️ **Animaciones Premium**: Transiciones de forma fluida y arrastre inercial optimizado con **GSAP**.
- 📘 **Ecosistema Documentado**: Estándar de contribución profesional y API documentada por separado.

---

## Instalación 📦

Instala el paquete y sus dependencias de desarrollo recomendadas:

```bash
npm install @moni-labs/moni-ui
# O con bun
bun add @moni-labs/moni-ui
```

---

## Configuración Inicial 🚀

### 1. Registrar los Componentes Web
Importa el punto de entrada principal en tu código para registrar todos los elementos `<moni-*>` en el navegador:

```javascript
import '@moni-labs/moni-ui';
```

### 2. Cargar los Estilos y Variables
Importa el tema de variables base en tu archivo CSS global:

```css
@import '@moni-labs/moni-ui/styles';
```

### Uso directo en el navegador (CDN)

Sin bundler, carga la distribución minificada completa:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/browser/moni-ui.min.css"
>
<script src="https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/browser/moni-ui.iife.min.js"></script>

<moni-button variant="filled">Comenzar</moni-button>
```

También existe una distribución ESM:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/browser/moni-ui.min.js';
</script>
```

Los archivos `.gz` y `.br` se publican junto al JavaScript y CSS para servidores que gestionen `Content-Encoding` explícitamente.

### CDN modular con import map

Para descargar únicamente los componentes utilizados, declara sus rutas en un import map:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/cdn/moni-ui.min.css"
>
<script type="importmap">
{
  "imports": {
    "@moni-ui/button": "https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/cdn/components/moni-button.js",
    "@moni-ui/text-field": "https://cdn.jsdelivr.net/npm/@moni-labs/moni-ui@0.4.4/dist/cdn/components/moni-text-field.js"
  }
}
</script>
<script type="module">
  import '@moni-ui/button';
  import '@moni-ui/text-field';
</script>
```

El mapa completo se publica en `dist/cdn/importmap.json`. Los módulos comparten chunks internos, por lo que Lit y las utilidades comunes se descargan una sola vez.

---

## Guía del Componente Core: Botón Expresivo (`<moni-button>`) 🧩

Moni UI incluye documentación completa, API estructurada y referencias visuales en la [documentación de componentes](docs/README.md). Para agentes y LLM también están disponibles [llms.txt](docs/llms.txt) y [api.json](docs/api.json). A continuación se detalla el uso del componente base:

### Ejemplo de Uso:
```html
<!-- Botón primario con icono y morphing activo al hacer click/toggle -->
<moni-button variant="filled" shape="round" icon="bolt" active>
  Activar Moni
</moni-button>

<!-- Botónoutlined de tamaño pequeño y estado de carga -->
<moni-button variant="outlined" size="small" loading>
  Cargando
</moni-button>
```

### Atributos Clave:
- **`variant`**: Estilo del botón (`filled` | `tonal` | `outlined` | `text` | `fill` | `elevated`).
- **`size`**: Escala física (`xsmall` | `small` | `medium` | `large` | `xlarge`).
- **`shape`**: Variación de bordes asimétricos (`round` | `square` | `circle` | `left-round` | `right-round` | `left-round-flat` | `inner-round`).
- **`active`**: Habilita la transición de forma activa (morphing de bordes redondeados).
- **`loading`**: Reemplaza el icono por un spinner indeterminado interactivo.

> [!NOTE]
> Para ver propiedades, slots, eventos, métodos, CSS Parts y capturas por variable, consulta la [ficha de Button](docs/components/button.md).

---

## Integraciones Avanzadas 🎨

### A. Integración con TailwindCSS v4
El sistema de tokens de `@moni-labs/moni-ui` se inyecta como variables CSS seguras `--moni-*` en el `:root`. Para utilizarlos de manera fluida en tus clases utilitarias de TailwindCSS v4, importa nuestro mapeo de tema específico:

```css
/* En tu archivo global app.css / index.css */
@import '@moni-labs/moni-ui/styles/tailwind.css';
```

Esto te permitirá usar de inmediato clases de color y bordes como:
```html
<div class="bg-primary text-on-primary rounded-md p-4">
  ¡Estilo unificado con Tailwind CSS v4!
</div>
```

### B. Motor de Temas Dinámico (Svelte 5 Runes)
Puedes controlar el tema de color, densidad, fuentes y esquinas de forma reactiva importando el motor de temas:

```svelte
<script>
  import { getThemeEngine } from '@moni-labs/moni-ui';
  
  const theme = getThemeEngine();
  theme.seedColor = '#4f46e5'; // Actualiza dinámicamente toda la paleta de colores HCT
</script>

<button on:click={() => theme.mode = theme.mode === 'light' ? 'dark' : 'light'}>
  Modo: {theme.mode}
</button>
```

---

## Contribuir al Proyecto 🛠️

¿Deseas agregar nuevos componentes web, ajustar estilos o reportar bugs? Lee nuestra [Guía de Contribución y Estándar de Código](CONTRIBUTING.md) para comprender el flujo de desarrollo, estándares Lit/TypeScript y convenciones Git.

## Publicación 📦

Los pull requests y pushes se validan automáticamente. Un push a `main` publica en npm únicamente cuando la versión de `package.json` todavía no existe en el registro. Consulta la [guía de publicación automática](docs/PUBLISHING.md) para configurar npm Trusted Publishing y versionar releases.

---

## Licencia 📄

Publicado bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más información.
