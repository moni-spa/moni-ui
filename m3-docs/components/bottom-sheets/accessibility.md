---
component: Bottom sheets
slug: bottom-sheets
section: accessibility
category: Sheets
source: "https://m3.material.io/components/bottom-sheets/accessibility"
scraped_at: "2026-06-20T06:55:36.532Z"
tokens_count: 1
images_count: 5
---
# Bottom sheets

Bottom sheets show secondary content anchored to the bottom of the screen

## Use cases

Users should be able to:

- Resize bottom sheets without having to rely on touch gestures

## Interaction & style

### Touch target area

The top 48dp portion of the bottom sheet is interactive when user-initiated resizing is available and the drag handle is present.

![Touch target area of a bottom sheet.](../../assets/bottom-sheets/accessibility/01-touch-target-area-of-a-bottom-sheet-89c9d595.png)

To ensure touch target accessibility, the top portion of a bottom sheet can be reserved for resize interactions

### Initial focus

The optional drag handle can be focused [More on focused state](/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f) in the tab order and interacted with using non-touch inputs , such as keyboard or switch [More on switches](/m3/pages/switch/overview) controls.

![Focus on the drag handle of a bottom sheet.](../../assets/bottom-sheets/accessibility/02-focus-on-the-drag-handle-of-a-bottom-sheet-afe8442d.png)

Visible focus shown on the drag handle affordance

### Dragging

Include a single-pointer alternative for any action that can be completed by dragging. Drag handles should cycle the bottom sheet through available heights when selected. If a drag handle can’t be used, add a button to do this action.

![Bottom sheet with focused drag handle at lower preset height.](../../assets/bottom-sheets/accessibility/03-bottom-sheet-with-focused-drag-handle-at-lower-preset-height-ec7b347f.png)

Interacting with the drag handle can quickly move a bottom sheet through preset heights

![Bottom sheet with drag handle at higher preset height.](../../assets/bottom-sheets/accessibility/04-bottom-sheet-with-drag-handle-at-higher-preset-height-38d57a41.png)

A bottom sheet can automatically resize to another height after interacting with the drag handle

## Keyboard navigation

|
Keys

 |

Actions

 |
| --- | --- |
| Tab | Focus lands on drag handle |
| Space / Enter | Toggles between available heights |

## Labeling

Label only the drag handle. The accessibility [More on accessibility](/m3/pages/overview) role for the drag handle is “button.”

![Labeled drag handle with role of button.](../../assets/bottom-sheets/accessibility/05-labeled-drag-handle-with-role-of-button-e3de69aa.png)

Label the drag handle

