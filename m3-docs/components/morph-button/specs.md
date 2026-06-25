---
component: Morph Button
slug: morph-button
section: specs
category: Buttons
source: "internal://moni-ui/morph-button"
---
# Morph Button — Specs

## Architecture

A single `.surface` element transitions between button visuals and
panel visuals. The host keeps the original button footprint
(`display: inline-flex`), so the surrounding layout never shifts.
The surface is `position: absolute` inside the host, fills the host
when closed, and grows into the panel size/position when open.

To avoid the layout jumps that come from changing `display` and
`flex-direction` mid-animation, the surface uses the same flex
layout in both states:

- `display: flex; flex-direction: column;` always
- Closed: `align-items: center; justify-content: center;` (label
  centered, no body/footer)
- Open: `align-items: stretch; justify-content: flex-start;` (header
  at top, body/footer below)

The visual difference comes from `align-items`, `justify-content`,
`padding` and the visibility of the `.panel-body` / `.panel-footer`
subtrees — all of which are smoothly transitioned.

## Geometry

| Property | Closed | Open |
| --- | --- | --- |
| `position` | `absolute` (fills host) | `absolute` (positions relative to host) |
| `top` / `left` | `0` / `0` | depends on `placement` |
| `width` | `100%` (fills host) | `var(--moni-morph-width, 320px)` |
| `height` | `100%` (fills host) | `var(--moni-morph-height, 240px)` |
| `display` | `flex` (always) | `flex` (always) |
| `flex-direction` | `column` (always) | `column` (always) |
| `align-items` | `center` | `stretch` |
| `justify-content` | `center` | `flex-start` |
| `padding` | `0 1rem` (or size-specific) | `var(--moni-morph-padding, 1rem)` |
| `border-radius` | size-specific pill | `var(--moni-morph-radius, 1.5rem)` |
| `background-color` | `var(--primary)` | `var(--surface-container)` |

## Placement matrix

```
placement="bottom-start"  →  top: 100%;  left: 0;        transform: none
placement="bottom"        →  top: 100%;  left: 50%;     transform: translateX(-50%)
placement="bottom-end"    →  top: 100%;  left: 100%;    transform: translateX(-100%)
placement="top-start"     →  bottom: 100%;  left: 0;   transform: none
placement="top"           →  bottom: 100%;  left: 50%;  transform: translateX(-50%)
placement="top-end"       →  bottom: 100%;  left: 100%; transform: translateX(-100%)
placement="right-start"   →  left: 100%;   top: 0;     transform: none
placement="right"         →  left: 100%;   top: 50%;  transform: translateY(-50%)
placement="right-end"     →  left: 100%;   top: 100%; transform: translateY(-100%)
placement="left-start"    →  right: 100%;  top: 0;     transform: none
placement="left"          →  right: 100%;  top: 50%;  transform: translateY(-50%)
placement="left-end"      →  right: 100%;  top: 100%; transform: translateY(-100%)
placement="center"        →  top: 50%;  left: 50%;    transform: translate(-50%, -50%)
```

The cross-axis alignment uses a `transform: translate()` so the
alignment animates as well — there are no instant jumps when the
panel grows.

## Timing

| Phase | Duration | Easing | Driver |
| --- | --- | --- | --- |
| Surface morph (top/left/width/height/border-radius/padding) | `500ms` | `cubic-bezier(0.2, 0, 0, 1)` (M3 standard) | CSS transitions |
| Surface color/box-shadow | `200ms` | `ease` | CSS transitions |
| Body / footer reveal (`max-block-size` + `opacity`) | `500ms` | M3 standard | CSS transitions, delay `200ms` |
| Body / footer collapse (on close) | same | same | `transition-delay: 0ms` |
| Slotted content fade-in | `300ms` | `ease` | CSS transitions, delay `350ms` |
| Scrim fade-in (modal) | `200ms` | linear (keyframes) | CSS keyframes |
| Label FLIP (label glides from button center to panel header) | `500ms` | `cubic-bezier(0.2, 0, 0, 1)` | Web Animations API |

The label FLIP captures the label's bounding rect before the open
attribute triggers the layout change, then animates the label from
its old position to its new natural position via the Web Animations
API. This is what makes the morph look like the label is "moving"
from the button center to the panel header rather than two
separate elements.

## Auto-flip

When `flip` is set, after the surface is laid out at its preferred
direction, the component measures the surface's rect and flips to
the opposite side if it overflows the viewport (within a 16px
margin). The flip preserves the original `*-start` / `*` / `*-end`
alignment.

## Recursion

The panel's default slot is a regular `<slot>`, so you can nest
another `<moni-morph-button>` inside it. Each level is an
independent component in the HTML — there's no internal
auto-recursion, no shared state, no magic. The inner morph-button
lives inside the outer's shadow root via slot projection and
behaves like a normal morph-button (its own open state, its own
placement, its own FLIP).

This means:
- Each level can have its own `placement`, size, variant, etc.
- Each level maintains its own open state independently
- A level can be a non-morph element (a form, a list, anything)
- The recursion is bounded by the HTML, not by any internal limit

## Reduced motion

The component honors `prefers-reduced-motion: reduce` by collapsing
the CSS transitions to `0.01ms` (effectively none). The label FLIP
is unaffected (it's a separate animation). Consumers can also set
the `reduced-motion` attribute to force the no-motion mode.
