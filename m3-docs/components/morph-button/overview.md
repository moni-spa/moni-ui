---
component: Morph Button
slug: morph-button
section: overview
category: Buttons
source: "internal://moni-ui/morph-button"
---
# Morph Button

A button that grows into a panel or screen at its own position. On
click the button visually mutates into the panel and, on close,
reverses back into a button. The host keeps the original button
footprint (`display: inline-flex`), so the surrounding layout never
shifts.

**Recursion via slot composition** is the headline feature. The
panel's default slot is a regular `<slot>`, so you can nest another
`<moni-morph-button>` (or any other element) inside it. Each level
is an independent component in the HTML — there's no internal
auto-recursion. This makes the component composable: you can mix it
with any other content and you can recurse as deep as you want.

```html
<moni-morph-button icon="rocket_launch" label="Empezar">
  <p>Primer nivel del wizard.</p>

  <!-- Recursive nesting: another morph-button inside the panel -->
  <moni-morph-button icon="code" label="Configurar" placement="top">
    <p>Segundo nivel, anidado dentro del primero.</p>

    <moni-morph-button icon="check" label="¡Listo!" placement="top">
      <p>Tercer nivel, anidado dentro del segundo.</p>
    </moni-morph-button>
  </moni-morph-button>
</moni-morph-button>
```

## When to use

- A popover, contextual menu, or settings panel that should grow
  from the button itself
- A wizard or guided flow where each step is a separate morph-button
  nested inside the previous one
- A "share" or "more" button that reveals a compact panel at a
  known position
- A "compose" surface that morphs from a pill into an editor

## When **not** to use

- For fullscreen navigation transitions — use `<moni-side-sheet>` or
  `<moni-dialog>` instead
- For non-anchored overlays (centered modals with no source button)
  — use `<moni-dialog placement="center" modal>` directly
- For inline content that just expands in place — use
  `<moni-expansion>`

## API

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | — | Button / panel header text |
| `icon` | string | — | Material Symbols name (leading) |
| `icon-trailing` | string | — | Material Symbols name (trailing) |
| `variant` | `filled` \| `tonal` \| `outlined` \| `elevated` \| `text` | `filled` | Inherited from `<moni-button>` |
| `size` | `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` | `medium` | Inherited |
| `disabled` | boolean | `false` | Inherited |
| `placement` | `top-start` \| `top` \| `top-end` \| `bottom-start` \| `bottom` \| `bottom-end` \| `left-start` \| `left` \| `left-end` \| `right-start` \| `right` \| `right-end` \| `center` | `bottom-start` | M3-style placement |
| `panel-width` | CSS length | `320px` | Panel target width (`auto` → max-content) |
| `panel-height` | CSS length | `240px` | Panel target height |
| `panel-radius` | CSS length | `1.5rem` | Panel corner radius |
| `panel-padding` | CSS length | `1rem` | Panel inner padding |
| `panel-gap` | CSS length | `0.75rem` | Panel gap between header/body/footer |
| `flip` | boolean | `false` | Auto-flip to opposite side if panel overflows viewport |
| `modal` | boolean | `false` | Backdrop + scroll lock + focus trap |
| `show-close` | boolean | `false` | Render a default X close button in the header |
| `close-on-outside-click` | boolean | `true` | Close on click outside the host |
| `close-on-escape` | boolean | `true` | Close on `Escape` |
| `open` | boolean | `false` | Panel visible |

| Deprecated alias | New attribute |
| --- | --- |
| `expand-direction` | `placement` (e.g. `down` → `bottom`) |
| `expand-anchor` | `placement` (e.g. `start` → `*-start`) |
| `expand-width` / `expand-height` / `expand-radius` / `expand-padding` / `expand-gap` | `panel-*` |

| Slot | Purpose |
| --- | --- |
| `default` | Panel body (regular content; can contain another `<moni-morph-button>`) |
| `icon` | Override leading icon |
| `icon-trailing` | Override trailing icon |
| `header` | Override panel header text |
| `footer` | Panel footer (typically action buttons) |
| `close` | Override the close button |

| Event | When |
| --- | --- |
| `open` | Panel starts to open |
| `close` | Panel starts to close |
| `toggle` | Every state change |
