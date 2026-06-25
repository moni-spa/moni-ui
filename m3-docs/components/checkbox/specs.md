---
component: Checkbox
slug: checkbox
section: specs
category: All other components
source: "https://m3.material.io/components/checkbox/specs"
scraped_at: "2026-06-20T06:56:32.097Z"
tokens_count: 1
images_count: 7
---
# Checkbox

Checkboxes let users select one or more items from a list, or turn an item on or off

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. Checkbox

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Pressed (ripple)

## Checkbox

![Diagram of checkbox indicating the 2 parts of its anatomy.](../../assets/checkbox/specs/01-diagram-of-checkbox-indicating-the-2-parts-of-its-anatomy-cb0e1f81.png)

1. Container
2. Icon

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Checkbox color roles in light and dark themes.](../../assets/checkbox/specs/02-checkbox-color-roles-in-light-and-dark-themes-fce83c80.png)

1. Checkbox
2. State-layer
3. Icon

### Adjacent text label color

Use the color role **on surface** for adjacent text labels. This remains the same even if interacting with the label or component.

![Checkboxes with text labels. The text color is the same for checked and unchecked checkboxes.](../../assets/checkbox/specs/03-checkboxes-with-text-labels-the-text-color-is-the-same-for-c-0da52205.png)

The text color remains the same regardless if the checkbox is selected or not

## States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![Side by side view of states in light and dark themes.](../../assets/checkbox/specs/04-side-by-side-view-of-states-in-light-and-dark-themes-f626c7dc.png)![Side by side view of states in light and dark themes.](../../assets/checkbox/specs/05-side-by-side-view-of-states-in-light-and-dark-themes-a056f9ec.png)

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

## Measurements

![Diagram of a selected checkbox with a container width and height of 18dp and a state-layer width and height of 40dp.](../../assets/checkbox/specs/06-diagram-of-a-selected-checkbox-with-a-container-width-and-he-405c9c70.png)![Diagram of a selected checkbox with a container width and height of 18dp and a state-layer width and height of 40dp.](../../assets/checkbox/specs/07-diagram-of-a-selected-checkbox-with-a-container-width-and-he-b244b67e.png)

| Attribute | Value |
| --- | --- |
|
Container size

 |

18dp

 |
|

Container corner shape

 |

2dp

 |
|

Icon size

 |

18dp

 |
|

Icon alignment

 |

Center-aligned

 |
|

Target size

 |

48dp

 |
| State-layer size | 40dp |

