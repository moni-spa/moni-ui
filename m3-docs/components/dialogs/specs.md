---
component: Dialogs
slug: dialogs
section: specs
category: All other components
source: "https://m3.material.io/components/dialogs/specs"
scraped_at: "2026-06-20T06:57:03.145Z"
tokens_count: 6
images_count: 6
---
# Dialogs

Dialogs provide important prompts in a user flow

## Tokens & specs

Select a component variant below to see its elements, attributes, tokens [More on tokens](/m3/pages/design-tokens/overview), and their values.

```
Dialog - Basic
```

```
Dialog - Basic
```

```
Dialog - Basic
```

```
Dialog - Basic
```

Dialog - Basic

Token

Default, Light

Enabled

Hovered

Focused

Pressed (ripple)

## Basic dialogs

![Anatomy diagram numbering dialog elements.](../../assets/dialogs/specs/01-anatomy-diagram-numbering-dialog-elements-3351a1dd.png)

1. Container
2. Icon (optional)
3. Headline (optional)
4. Supporting text
5. Divider (optional)
6. Button label text
7. Scrim

### Basic dialog color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Color mapping diagram labeling 6 color roles across the dialog and scrim.](../../assets/dialogs/specs/02-color-mapping-diagram-labeling-6-color-roles-across-the-dial-d8c40a0c.png)

Basic dialog color roles used for light and dark themes:

1. Surface container high
2. Secondary
3. On surface
4. On surface variant
5. Primary
6. Scrim

### Basic dialog measurements

![Annotated diagram showing padding values.](../../assets/dialogs/specs/03-annotated-diagram-showing-padding-values-1bf6272e.png)

Basic dialog padding and size measurements

| Attribute | Value |
| --- | --- |
| Container shape
 | 28dp corner radius |
| Container height
 | Dynamic |
| Container width
 | Min 280dp; Max 560dp |
| Divider height
 | 1dp |
| Icon size
 | 24dp |
| Minimum width
 | 280dp  |
| Maximum width
 | 560dp |
| Alignment with icon
 | Center-aligned |
| Alignment without icon
 | Start-aligned |
| Top/Left/right/bottom padding
 | 24dp |
| Padding between buttons
 | 8dp |
| Padding between title and body
 | 16dp |
| Padding between icon and title
 | 16dp |
| Padding between body and actions
 | 24dp |

## Full-screen dialogs

![Diagram numbering 6 full-screen dialog elements.](../../assets/dialogs/specs/04-diagram-numbering-6-full-screen-dialog-elements-e7df7741.png)

1. Container
2. Header
3. Icon (close affordance)
4. Headline (optional)
5. Text button
6. Divider (optional)

### Full-screen dialog color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value.

![Color mapping diagram shows 5 callout markers across the dialog.](../../assets/dialogs/specs/05-color-mapping-diagram-shows-5-callout-markers-across-the-dia-1c6f9049.png)

Full-screen dialog color roles used for light and dark themes:

1. Surface container high
2. On surface
3. On surface
4. Primary
5. On surface variant

### Full-screen dialog measurements

![Diagram noting layout measurements for padding values, title, height, and action regions.](../../assets/dialogs/specs/06-diagram-noting-layout-measurements-for-padding-values-title--e24f00e8.png)

Full-screen dialog padding and size measurements

| Attribute | Value |
| --- | --- |
| Container shape
 | 0dp corner radius |
| Container height
 | Dynamic |
| Container width
 | Container width; Max 560dp |
| Header height
 | 56dp |
| Header width
 | Container width |
| Headline text alignment
 | Start-aligned |
| Divider height
 | 1dp |
| Icon (close affordance) size
 | 24dp |
| Bottom action bar height
 | 56dp |
| Bottom action bar width
 | Container width |
| Top/left/right padding
 | 24dp |
| Padding between elements
 | 8dp |

