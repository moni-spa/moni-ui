---
component: Morph Button
slug: morph-button
section: guidelines
category: Buttons
source: "internal://moni-ui/morph-button"
---
# Morph Button — Guidelines

## Picking a placement

Choose the placement that keeps the panel **on screen** with the
least amount of viewport clamping. Rule of thumb:

- Triggers in the **top half** of the viewport → `bottom-start`
  (default) or `bottom` / `bottom-end`
- Triggers in the **bottom half** → `top-start` or `top` / `top-end`
- Triggers on the **left edge** → `right-start` or `right` / `right-end`
- Triggers on the **right edge** → `left-start` or `left` / `left-end`
- For top-right corner buttons: `bottom-end` so the panel hangs
  off the right edge of the trigger instead of overflowing the
  viewport
- For dialog-like panels that don't relate to a specific trigger
  position: `center` (use `modal` for backdrop + scroll lock)

The component auto-flips to the opposite side when `flip` is set,
so a wrong placement won't break the layout — it just looks less
intentional.

## Sizing the panel

- **Compact menu / picker**: `panel-width="18rem"`, `panel-height="14rem"`
- **Standard popover**: `panel-width="20rem"`, `panel-height="16rem"`
- **Settings panel**: `panel-width="22rem"`, `panel-height="auto"`
- **Wizard step**: `panel-width="24rem"`, `panel-height="20rem"`
- **Fullscreen**: `placement="center"`, `panel-width="100%"`, `panel-height="100%"`, `modal`

Use `auto` for `panel-width` or `panel-height` to size the panel
to its content. The morph then grows to fit the content rather than
to a fixed target.

## Recursion patterns

The component supports recursion through slot composition. The
canonical pattern is a wizard:

```html
<moni-morph-button
  icon="rocket_launch"
  label="Empezar"
  placement="bottom-start"
  panel-width="22rem"
  panel-height="11rem"
>
  <p>Primer nivel.</p>

  <moni-morph-button
    icon="code"
    label="Configurar"
    placement="top-end"
    panel-width="22rem"
    panel-height="11rem"
  >
    <p>Segundo nivel, anidado dentro del primero.</p>
  </moni-morph-button>
</moni-morph-button>
```

Each level is an independent morph-button. The inner one lives
inside the outer's shadow root via slot projection. When the outer
opens, the inner becomes visible inside its panel.

Tips for nested wizards:
- Use `placement="top-*"` for inner levels so the back button
  visually points to the parent
- Keep each level short — one paragraph + one CTA per level is
  the sweet spot
- Don't nest more than 3 levels deep without testing — the z-index
  stacking gets visually busy

## Slots vs `label` attribute

- The `label` attribute sets the text shown on the button (and in
  the panel header when no `header` slot is provided).
- The `header` slot overrides the panel header text. This is
  useful when you want a different header from the button label.
- The default slot is the panel body. Anything you put inside the
  element without a `slot` attribute goes into the panel body.
- The `icon` and `icon-trailing` slots override the icons from
  the `icon` / `icon-trailing` attributes when set.

```html
<moni-morph-button icon="settings" label="Settings">
  <span slot="header">Configuración avanzada</span>
  <p>Body content.</p>
  <moni-button slot="footer" variant="text">Cancelar</moni-button>
  <moni-button slot="footer" variant="filled">Guardar</moni-button>
</moni-morph-button>
```

## When to use `modal`

Use `modal` when the panel:
- **Blocks** the rest of the app
- **Requires** an explicit decision (confirm, cancel, accept)
- Is large enough to cover most of the viewport

Don't use `modal` when the panel:
- Is a contextual **menu** or **picker** — the user should be able
  to dismiss by clicking elsewhere
- Is **small** (under half the viewport) — non-modal reads as a
  lighter surface; modal reads as a heavy interruption

## Backwards compatibility

The previous `expand-direction` + `expand-anchor` API is still
supported as a deprecated alias. The mapping is:

| Legacy | New |
| --- | --- |
| `expand-direction="down"` | `placement="bottom"` (or `bottom-start`) |
| `expand-direction="up"` | `placement="top"` (or `top-start`) |
| `expand-direction="left"` | `placement="left"` (or `left-start`) |
| `expand-direction="right"` | `placement="right"` (or `right-start`) |
| `expand-direction="center"` | `placement="center"` |
| `expand-anchor="start"` | `placement="*-start"` |
| `expand-anchor="center"` | `placement="*"` |
| `expand-anchor="end"` | `placement="*-end"` |
| `expand-width` | `panel-width` |
| `expand-height` | `panel-height` |
| `expand-radius` | `panel-radius` |
| `expand-padding` | `panel-padding` |
| `expand-gap` | `panel-gap` |

## Things to avoid

- **Don't** set `panel-width` larger than the viewport. The
  component clamps to `calc(100vw - 2rem)`, but the animation
  looks odd when the clamp kicks in.
- **Don't** put interactive content that relies on hover (tooltips,
  hover-only menus) inside the panel — the panel is a separate
  focus context, and hover state is lost on focus changes.
- **Don't** rely on `position: fixed` to escape a `transform`ed
  ancestor — the panel uses `position: absolute` inside the host,
  so a transformed ancestor will affect the panel's position.
