---
component: Radio button
slug: radio-button
section: specs
category: All other components
source: "https://m3.material.io/components/radio-button/specs"
scraped_at: "2026-06-20T06:59:18.869Z"
tokens_count: 0
images_count: 5
---
# Radio button

Radio buttons let people select one option from a set of options

![Diagram of enabled radio button.](../../assets/radio-button/specs/01-diagram-of-enabled-radio-button-27085090.png)

1. Radio button icon

## Tokens & specs

[Learn more about design tokens](/m3/pages/design-tokens/overview)

Radio Button

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Pressed (ripple)

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Diagram of selected and unselected radio button colors.](../../assets/radio-button/specs/02-diagram-of-selected-and-unselected-radio-button-colors-9df6ea5e.png)

Radio button color roles used for light and dark themes:

1. Primary
2. On surface variant

### Adjacent text label color

Use the color role **on surface** for adjacent text labels. This remains the same even if interacting with the label or component.

![Radio buttons with labels. The labels are the same color for both selected and unselected radio buttons.](../../assets/radio-button/specs/03-radio-buttons-with-labels-the-labels-are-the-same-color-for--97217455.png)

The text color remains the same regardless if the button is selected or not

## States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![Diagram of radio button states including enabled, hover, focus, pressed, and disabled.](../../assets/radio-button/specs/04-diagram-of-radio-button-states-including-enabled-hover-focus-feaea795.png)

1. Enabled
2. Hover
3. Focus
4. Pressed
5. Disabled

[State specs are in the token module above](/m3/pages/radio-button/specs#3eef19a6-cdcb-4ecf-b1af-2b8095d485ac)

## Measurements

![Diagram of radio button layout values.](../../assets/radio-button/specs/05-diagram-of-radio-button-layout-values-7779d5cb.png)

Radio button size measurements

| Attribute
 | Value
 |
| --- | --- |
| Icon size
 | 20dp |
| State layer size
 | 40dp |
| Target size
 | 48dp |

