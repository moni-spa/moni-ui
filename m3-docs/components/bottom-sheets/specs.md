---
component: Bottom sheets
slug: bottom-sheets
section: specs
category: Sheets
source: "https://m3.material.io/components/bottom-sheets/specs"
scraped_at: "2026-06-20T06:55:35.229Z"
tokens_count: 5
images_count: 3
---
# Bottom sheets

Bottom sheets show secondary content anchored to the bottom of the screen

Modal bottom sheets are above a scrim while standard bottom sheets don't have a scrim. Besides this, both variants of bottom sheets have the same specs.

![Diagram of container, drag handle, scrim](../../assets/bottom-sheets/specs/01-diagram-of-container-drag-handle-scrim-c254baf3.png)

1. Container
2. Drag handle (optional)
3. Scrim

## Tokens and specs

Browse the component elements, attributes, tokens, and their values. [Learn more about design tokens](/m3/pages/design-tokens/overview)

```
Sheets - Bottom
```

```
Sheets - Bottom
```

```
Sheets - Bottom
```

```
Sheets - Bottom
```

Sheets - Bottom

Token

Default, Light

Enabled

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Two diagrams featuring color opposites of scrim, container, drag handle](../../assets/bottom-sheets/specs/02-two-diagrams-featuring-color-opposites-of-scrim-container-dr-7f487ec0.png)

Bottom sheet color roles used for both light and dark schemes:

1. Scrim\*
2. On surface variant
3. Surface container low

\*On Android platforms, the scrim color and opacity is automatically handled by the system UI.

## Measurements

![Bottom sheet on larger device with 56dp top and 56dp side margins](../../assets/bottom-sheets/specs/03-bottom-sheet-on-larger-device-with-56dp-top-and-56dp-side-ma-ab902890.png)

Bottom sheet padding and size measurements

Bottom sheets span the full window width up to 640dp. When the window width exceeds 640dp, bottom sheets adjust to have a top margin of 56dp and side margins of 56dp. 

| Attribute | Value |
| --- | --- |
|
Drag handle alignment (horizontal)

 |

Center

 |
|

Drag handle padding top/bottom

 |

22dp

 |
|

Top margin

 |

72dp

 |
| Top margin (window width > 640dp) | 56dp |
|

Start/end margin (window width > 640dp)

 |

56dp

 |
|

Width

 |

Full width, up to max-width 640dp

 |
| Height | Variable |

