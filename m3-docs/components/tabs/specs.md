---
component: Tabs
slug: tabs
section: specs
category: All other components
source: "https://m3.material.io/components/tabs/specs"
scraped_at: "2026-06-20T07:00:38.670Z"
tokens_count: 5
images_count: 10
---
# Tabs

Tabs organize content across different screens and views

## Tokens and specs

Select a component variant below to see its elements, attributes, tokens, and their values.

```
Tabs - Primary navigation
```

```
Tabs - Primary navigation
```

```
Tabs - Primary navigation
```

```
Tabs - Primary navigation
```

Tabs - Primary navigation

Token

Default, Light

Enabled

Hovered

Focused

Pressed (ripple)

## Primary tabs

![6 elements of primary tabs.](../../assets/tabs/specs/01-6-elements-of-primary-tabs-9f4c02ae.png)

1. Container
2. Badge (optional)
3. Icon (optional)
4. Label
5. Divider
6. Active indicator

### Primary tabs color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![7 color roles applied to primary tabs in light and dark themes.](../../assets/tabs/specs/02-7-color-roles-applied-to-primary-tabs-in-light-and-dark-them-8874a671.png)

Primary tab color roles used for light and dark schemes:

1. Surface
2. Primary
3. Primary
4. On surface variant
5. On surface variant
6. Outline variant
7. Primary

### Primary tabs states

![Diagram of all primary tab states in both light and dark mode](../../assets/tabs/specs/03-diagram-of-all-primary-tab-states-in-both-light-and-dark-mod-3de2377d.png)![Diagram of all primary tab states in both light and dark mode](../../assets/tabs/specs/04-diagram-of-all-primary-tab-states-in-both-light-and-dark-mod-ff3092f6.png)

1. Enabled (active destination)
2. Hover (active destination)
3. Focused (active destination)
4. Pressed (active destination)
5. Enabled (inactive destination)
6. Hover (inactive destination)
7. Focused (inactive destination)
8. Pressed (inactive destination)

## Secondary tabs

![5 elements of secondary tabs.](../../assets/tabs/specs/05-5-elements-of-secondary-tabs-9500422d.png)![5 elements of secondary tabs.](../../assets/tabs/specs/06-5-elements-of-secondary-tabs-71cd8b01.png)

1. Container
2. Badge (optional)
3. Label
4. Divider
5. Active indicator

### Secondary tabs color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![5 color roles applied to secondary tabs in light and dark themes.](../../assets/tabs/specs/07-5-color-roles-applied-to-secondary-tabs-in-light-and-dark-th-4391f4aa.png)

Secondary tab color roles used for light and dark schemes:

1. Surface
2. On surface
3. On surface variant
4. Outline variant
5. Primary

### Secondary tabs states

![Diagram of all secondary tab states in both light and dark mode](../../assets/tabs/specs/08-diagram-of-all-secondary-tab-states-in-both-light-and-dark-m-db85d478.png)

1. Enabled (active destination)
2. Hover (active destination)
3. Focused (active destination)
4. Pressed  (active destination)
5. Enabled (inactive destination)
6. Hover (inactive destination)
7. Focused (inactive destination)
8. Pressed (inactive destination)

## Measurements

![Diagram of measurements for four and two tabs per container, including icon and label placement.](../../assets/tabs/specs/09-diagram-of-measurements-for-four-and-two-tabs-per-container--ad5efe82.png)

Tabs are divided into equal sections, with labels and icons positioned vertically centered. The divider is included in the height, placed inside the container.

![Diagram of Primary tab active indicator measurements.](../../assets/tabs/specs/10-diagram-of-primary-tab-active-indicator-measurements-39eec147.png)

Primary tab active indicators are inset 2dp on each side, have a fully rounded corner radius, and a minimum length of 24dp.

| Attribute
 | Value
 |
| --- | --- |
| Container height (label text only) | 48dp |
| Container height (icon and label text) | 64dp |
| Icon size | 24dp |
| Divider height | 1dp |
| Primary active indicator height | 3dp |
| Secondary active indicator height | 2dp |
| Active indicator shape | 3, 3, 0, 0 |
| Active indicator minimum length | 24dp |
| Padding between inline icon and text | 8dp |
| Padding between inline text and badge | 4dp |
| Overlap of badge on stacked icon | 6dp |

