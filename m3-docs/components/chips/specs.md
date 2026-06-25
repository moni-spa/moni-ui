---
component: Chips
slug: chips
section: specs
category: All other components
source: "https://m3.material.io/components/chips/specs"
scraped_at: "2026-06-20T06:56:45.657Z"
tokens_count: 4
images_count: 17
---
# Chips

Chips help people enter information, make selections, filter content, or trigger actions

## Tokens & specs

Select a component variant below to see its elements, attributes, tokens, and values.

```
Chip - Assist
```

```
Chip - Assist
```

```
Chip - Assist
```

```
Chip - Assist
```

Chip - Assist

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Pressed (ripple)

Dragged

## Assist chip

![Assist chip diagram numbering 3 elements.](../../assets/chips/specs/01-assist-chip-diagram-numbering-3-elements-760c7919.png)

1. Container
2. Label text
3. Leading icon

### Assist chip color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Assist chip diagram numbering 4 color elements.](../../assets/chips/specs/02-assist-chip-diagram-numbering-4-color-elements-935066b4.png)

Assist chip color roles used for light and dark themes:

1. Surface container low (optional)
2. On surface
3. Outline
4. Primary

### Assist chip states

States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![36 assist chips illustrating combinations of styles, selection and non-selection, and 6 interaction states.](../../assets/chips/specs/03-36-assist-chips-illustrating-combinations-of-styles-selectio-0002c0b2.png)

Selected and unselected assist chip states:

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Dragged

### Assist chip measurements

![3 assist chips with measurements shown for variants with and without a leading icon.](../../assets/chips/specs/04-3-assist-chips-with-measurements-shown-for-variants-with-and-e7978344.png)![3 assist chips with measurements shown for variants with and without a leading icon.](../../assets/chips/specs/05-3-assist-chips-with-measurements-shown-for-variants-with-and-e7978344.png)

Assist chip padding and size measurements

| Attribute
 | Value
 |
| --- | --- |
| Height
 | 32dp |
| Shape
 | 8dp corner radius |
| Icon size
 | 18dp |
| Vertical label text alignment
 | Center-aligned |
| Horizontal label text alignment
 | Start-aligned |
| Left/right padding
 | 16dp |
| Left/right padding with icon
 | 8dp |
| Padding between elements
 | 8dp |

## Filter chip

![Filter chip diagram numbering 4 elements.](../../assets/chips/specs/06-filter-chip-diagram-numbering-4-elements-b3bcdd0e.png)

1. Container
2. Label text
3. Leading icon
4. Trailing icon

### Filter chip color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Filter chip diagram numbering 4 color elements.](../../assets/chips/specs/07-filter-chip-diagram-numbering-4-color-elements-b150e482.png)

Filter chip color roles used for light and dark themes:

1. On surface variant
2. On secondary container
3. Secondary container
4. Outline variant
5. Surface container low (optional)

### Filter chip states

States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![24 filter chips showing combinations of elevated, non-elevated, selected, and non-selected styles, and 6 interaction states.](../../assets/chips/specs/08-24-filter-chips-showing-combinations-of-elevated-non-elevate-557a60fd.png)

Selected and unselected filter chip states:

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Dragged

### Filter chip measurements

![3 filter chips with measurements shown for types with and without a leading icon and trailing icon.](../../assets/chips/specs/09-3-filter-chips-with-measurements-shown-for-types-with-and-wi-10b5d5d3.png)

Filter chip padding and size measurements

| Attribute
 | Value
 |
| --- | --- |
| Container height
 | 32dp |
| Container shape
 | 8dp corner radius |
| Icon size
 | 18dp |
| Vertical label text alignment
 | Center-aligned |
| Horizontal label text alignment
 | Start-aligned |
| Left/right padding
 | 16dp |
| Left/right padding with icon
 | 8dp |
| Padding between elements
 | 8dp |

## Input chip

![Input chip diagram numbering 4 elements.](../../assets/chips/specs/10-input-chip-diagram-numbering-4-elements-c9887ae9.png)

1. Container
2. Label text
3. Trailing icon
4. Leading icon

### Input chip color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Input chip diagram numbering 5 color elements.](../../assets/chips/specs/11-input-chip-diagram-numbering-5-color-elements-edf7bde1.png)

Input chip color roles used for light and dark themes:

1. On surface variant
2. Surface container low (optional)
3. On surface variant
4. On surface variant
5. Outline variant
6. Primary
7. Secondary container
8. On secondary container
9. On secondary container

### Input chip states

States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![33 input chips illustrating combinations of styles, selection and non-selection, and 6 interaction states.](../../assets/chips/specs/12-33-input-chips-illustrating-combinations-of-styles-selection-b6e31d76.png)

Selected and unselected input chip states:

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Dragged

### Input chip measurements

![2 input chips with measurements: 1 with a trailing icon only; 1 with an avatar as a leading icon and a trailing icon.](../../assets/chips/specs/13-2-input-chips-with-measurements-1-with-a-trailing-icon-only--9a0cac63.png)

Input chip padding and size measurements

| Attribute
 | Value
 |
| --- | --- |
| Container height
 | 32dp |
| Container shape
 | 8dp corner radius |
| Icon size
 | 18dp |
| Avatar shape
 | 12dp corner radius |
| Avatar size
 | 24dp |
| Vertical label text alignment
 | Center-aligned |
| Horizontal label text alignment
 | Start-aligned |
| Left padding for avatar
 | 4dp |
| Right padding for avatar
 | 8dp |
| Left/right padding for icon
 | 8dp |
| Padding between elements
 | 8dp |
| Target size for close icon
 | Min 48dp |

## Suggestion chip

![Suggestion chip diagram numbering 2 elements.](../../assets/chips/specs/14-suggestion-chip-diagram-numbering-2-elements-b9643bd1.png)

1. Container
2. Label text

### Suggestion chip color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Suggestion chip diagram numbering 3 color elements.](../../assets/chips/specs/15-suggestion-chip-diagram-numbering-3-color-elements-e7e0a3a3.png)

Suggestion chip color roles used for light and dark themes:

1. Outline
2. Surface container low (optional)
3. On surface variant

### Suggestion chip states

States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![24 suggestion chips illustrating combinations of styles across 6 interaction states.](../../assets/chips/specs/16-24-suggestion-chips-illustrating-combinations-of-styles-acro-13b3de38.png)

Selected and unselected suggestion chip states:

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Dragged

### Suggestion chip measurements

![2 suggestion chips with measurements shown for variants with and without a leading icon.](../../assets/chips/specs/17-2-suggestion-chips-with-measurements-shown-for-variants-with-ca0b6e9e.png)

Suggestion chip padding and size measurements

| Attribute
 | Value
 |
| --- | --- |
| Container height
 | 32dp |
| Container shape
 | 8dp corner radius |
| Icon size
 | 18dp |
| Vertical label text alignment
 | Center-aligned |
| Horizontal label text alignment
 | Start-aligned |
| Left/right padding without icon
 | 16dp |
| Left/right padding with icon
 | 8dp |
| Padding between elements
 | 8dp |

