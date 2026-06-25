---
component: Morph Button
slug: morph-button
section: accessibility
category: Buttons
source: "internal://moni-ui/morph-button"
---
# Morph Button — Accessibility

## Roles & states

| Element | Role | Key attributes |
| --- | --- | --- |
| `.surface` (closed) | `button` | `aria-expanded="false"`, `aria-disabled`, `aria-label` |
| `.surface` (open) | `dialog` | `aria-expanded="true"`, `aria-modal` |
| `.panel-body` | — | `role="dialog"` body (inherited) |
| `slot="close"` | `button` | `aria-label="Close"` (default) |

The surface is a single element that transitions between `button`
and `dialog` roles. This avoids the accessibility confusion of
having a separate button + panel pair.

## Keyboard

| Key | Action |
| --- | --- |
| `Tab` / `Shift+Tab` | Navigate focusable elements |
| `Enter` / `Space` (when closed) | Toggle open |
| `Escape` | Close (when `close-on-escape` is enabled) |
| `Enter` / `Space` (when open, on a button inside the panel) | Activate the focused control |

When the panel is open and `modal` is set, focus is trapped inside
the panel via the standard `Tab` cycle. When `modal` is false,
focus can escape via `Tab` to elements outside the host — this is
intentional, as the panel is a non-modal surface.

## Focus

- On **open**: focus stays on the trigger (the surface). Consumers
  can move focus into the panel by interacting with a control
  inside it.
- On **close**: focus stays on the surface (which is now a button
  again). Pressing `Enter` or `Space` re-opens the panel.
- The component does not implement a focus trap by default. Add
  one externally if `modal` is set and you need stricter focus
  management.

## Live regions

The component does not emit `aria-live` announcements for the
morph itself. Screen readers will read the panel's accessible name
when it becomes visible (because the surface's role changes from
`button` to `dialog`).

If your panel's content changes asynchronously, add an `aria-live`
region inside the default slot.

## Reduced motion

The component honors `prefers-reduced-motion: reduce` by collapsing
the CSS transitions to `0.01ms`. The label FLIP is unaffected
(it's a separate animation, but with the label position barely
changing in reduced motion, the visual effect is minimal).

You can also set the `reduced-motion` attribute to force the
no-motion mode regardless of OS preference.

## Color contrast

- **Button text**: depends on the variant. `filled` uses white on
  `var(--primary)`, which is typically AA-compliant. `outlined`
  and `text` use `var(--primary)` on the surface background.
- **Panel text**: `var(--on-surface)` on `var(--surface-container)`,
  which is always AA-compliant.
- **Icons**: inherit color from the surface.

## Testing tips

- Navigate to the button with `Tab`. Press `Enter` or `Space` —
  the panel should open and `aria-expanded` should flip to `true`.
- Press `Escape` — the panel should close and focus should remain
  on the trigger.
- With a screen reader, the trigger should announce as "button,
  expanded" or "button, collapsed".
- Open the panel and navigate into it with `Tab`. Each control
  should be reachable.
- Resize the window while the panel is open — the panel's target
  rect should recompute to stay within the viewport.
- Toggle `prefers-reduced-motion` — the morph should still work but
  the visual tween should be gone.
