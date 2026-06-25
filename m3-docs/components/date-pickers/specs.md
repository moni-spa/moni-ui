---
component: Date pickers
slug: date-pickers
section: specs
category: Date & time pickers
source: "https://m3.material.io/components/date-pickers/specs"
scraped_at: "2026-06-20T06:56:54.900Z"
tokens_count: 4
images_count: 26
---
# Date pickers

Date pickers let people select a date, or a range of dates

## Tokens & specs

Select a component variant below to see its elements, attributes, tokens [More on tokens](/m3/pages/design-tokens/overview), and their values.

```
Date picker - Docked
```

```
Date picker - Docked
```

```
Date picker - Docked
```

```
Date picker - Docked
```

Date picker - Docked

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Pressed (ripple)

## Docked date picker

![Diagram indicating the 11 elements of a docked date picker.](../../assets/date-pickers/specs/01-diagram-indicating-the-11-elements-of-a-docked-date-picker-2b7036a2.png)

1. Outlined text field
2. Menu button: Month selection
3. Menu button: Year selection
4. Icon button
5. Weekdays label text
6. Unselected date
7. Today’s date
8. Outside month date
9. Text buttons
10. Selected date
11. Container

![Diagram indicating 8 elements of a docked date picker with an open dropdown menu showing the months May to November.](../../assets/date-pickers/specs/02-diagram-indicating-8-elements-of-a-docked-date-picker-with-a-1ff6cc1c.png)

1. Outlined text field
2. Menu button: Month selection (pressed)
3. Menu button: Year selection (disabled)
4. Header
5. Menu
6. Selected list item
7. Unselected menu list item
8. Container

### Docked date picker color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview/)

![11 color roles of a docked date picker in light and dark themes.](../../assets/date-pickers/specs/03-11-color-roles-of-a-docked-date-picker-in-light-and-dark-the-cfe42290.png)

Docked date picker color roles used for light and dark themes:

1. Primary
2. On surface variant
3. On surface variant
4. On surface
5. On surface
6. Primary
7. On surface variant
8. Primary
9. Surface container high
10. Primary
11. On primary

![7 color roles of a docked date picker menu in light and dark themes.](../../assets/date-pickers/specs/04-7-color-roles-of-a-docked-date-picker-menu-in-light-and-dark-a672f63e.png)![7 color roles of a docked date picker menu in light and dark themes.](../../assets/date-pickers/specs/05-7-color-roles-of-a-docked-date-picker-menu-in-light-and-dark-4412d398.png)

Docked date picker menu color roles used for light and dark themes:

1. Primary
2. On surface variant
3. On surface
4. Outline variant
5. Surface container high
6. Surface variant
7. On surface

### Docked date picker measurements

![Diagram of padding, size, and layout measurements.](../../assets/date-pickers/specs/06-diagram-of-padding-size-and-layout-measurements-c3bc23cf.png)![Diagram of padding, size, and layout measurements.](../../assets/date-pickers/specs/07-diagram-of-padding-size-and-layout-measurements-66754dd5.png)

Docked date picker padding and size measurements

![Diagram of padding, size, and layout measurements.](../../assets/date-pickers/specs/08-diagram-of-padding-size-and-layout-measurements-13865111.png)![Diagram of padding, size, and layout measurements.](../../assets/date-pickers/specs/09-diagram-of-padding-size-and-layout-measurements-47f0a0aa.png)

Docked date picker month menu padding and size measurements

### Docked date picker configurations

![3 configurations of docked date picker.](../../assets/date-pickers/specs/10-3-configurations-of-docked-date-picker-adbf6a52.png)![3 configurations of docked date picker.](../../assets/date-pickers/specs/11-3-configurations-of-docked-date-picker-e1fdaed0.png)

1. Day selection
2. Month selection
3. Year selection

## Modal date picker

![Diagram indicating the 13 elements of a modal date picker in the day selection view.](../../assets/date-pickers/specs/12-diagram-indicating-the-13-elements-of-a-modal-date-picker-in-302f495b.png)

1. Headline
2. Supporting text
3. Header
4. Container
5. Icon button
6. Icon buttons
7. Weekdays
8. Today’s date
9. Unselected date
10. Text buttons
11. Selected date
12. Menu button
13. Divider

![10 elements of a modal date picker menu.](../../assets/date-pickers/specs/13-10-elements-of-a-modal-date-picker-menu-b0095857.png)

1. Headline
2. Supporting text
3. Header
4. Container
5. Icon button
6. Unselected year
7. Selected year
8. Text buttons
9. Divider
10. Menu button

![Diagram indicating the 15 elements of a modal date picker when selecting a range of dates.](../../assets/date-pickers/specs/14-diagram-indicating-the-15-elements-of-a-modal-date-picker-wh-0fc8f987.png)

1. Headline
2. Supporting text
3. Icon button
4. Header
5. Text button
6. Icon button
7. Weekdays label text
8. Container
9. Today’s date
10. Unselected date
11. In-range active indicator
12. In-range date
13. Month subhead
14. Selected date
15. Divider

### Modal date picker color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview/)

![12 color roles of a modal date picker day selection view.](../../assets/date-pickers/specs/15-12-color-roles-of-a-modal-date-picker-day-selection-view-47f9c35d.png)

Modal date picker color roles used for light and dark themes in a day selection menu:

1. On surface
2. On surface variant
3. Surface container high
4. On surface variant
5. On surface variant
6. On surface
7. Primary
8. On surface
9. Primary
10. Primary
11. On surface variant
12. Outline variant

![Diagram of 9 color roles of a modal date picker year selection view.](../../assets/date-pickers/specs/16-diagram-of-9-color-roles-of-a-modal-date-picker-year-selecti-27d87064.png)

Modal date picker color roles used for light and dark themes in a year selection menu:

1. On surface
2. On surface variant
3. Surface container high
4. On surface variant
5. On surface variant
6. Primary
7. Primary
8. Outline variant
9. On surface variant

![Diagram of 14 color roles of a modal date picker when selecting a range of dates.](../../assets/date-pickers/specs/17-diagram-of-14-color-roles-of-a-modal-date-picker-when-select-aeebe68d.png)

Modal date picker range selector color roles used for light and dark themes:

1. On surface
2. On surface variant
3. On surface variant
4. Surface container high
5. Primary
6. On surface variant
7. On surface
8. Primary
9. On surface
10. Secondary container
11. On secondary container
12. Outline variant
13. On surface variant
14. Primary

### Modal date picker measurements

![Diagram of size and padding measurements in day selection view.](../../assets/date-pickers/specs/18-diagram-of-size-and-padding-measurements-in-day-selection-vi-3d5f83ea.png)

Modal date picker padding and size measurements

![Diagram of size and padding measurements in year selection view.](../../assets/date-pickers/specs/19-diagram-of-size-and-padding-measurements-in-year-selection-v-6d55e011.png)

Modal date picker year selector padding and size measurements

![Diagram of size and padding measurements when selecting a range of dates.](../../assets/date-pickers/specs/20-diagram-of-size-and-padding-measurements-when-selecting-a-ra-2cb29b3c.png)

Modal date picker date range selector padding and size measurements

### Modal date picker configurations

![3 configurations of a modal date picker shown in dark mode.](../../assets/date-pickers/specs/21-3-configurations-of-a-modal-date-picker-shown-in-dark-mode-ac74f455.png)

1. Single date selection
2. Date range selection
3. Year selection

## Modal date input

![Diagram indicating the 8 elements of a modal date input.](../../assets/date-pickers/specs/22-diagram-indicating-the-8-elements-of-a-modal-date-input-83f46013.png)

1. Headline
2. Supporting text
3. Header
4. Container
5. Icon button
6. Outlined text field
7. Text buttons
8. Divider

### Modal date input color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview/)

![Diagram indicating the 7 color roles of a modal date input.](../../assets/date-pickers/specs/23-diagram-indicating-the-7-color-roles-of-a-modal-date-input-6daf6abb.png)

Modal date input color roles used for light and dark themes:

1. On surface
2. On surface variant
3. Surface container high
4. On surface variant
5. Primary
6. Primary
7. Outline variant

### Modal date input measurements

![Diagram of the padding and size measurements of a modal date input.](../../assets/date-pickers/specs/24-diagram-of-the-padding-and-size-measurements-of-a-modal-date-cae4ee26.png)

Modal date input padding and size measurements

### Modal date input configurations

![2 configurations of modal date input.](../../assets/date-pickers/specs/25-2-configurations-of-modal-date-input-6b37b7ee.png)

1. Single date input
2. Date range input

## Element states

![Diagram of 5 various states for date and year elements within date pickers.](../../assets/date-pickers/specs/26-diagram-of-5-various-states-for-date-and-year-elements-withi-fe187174.png)

States for date and year selection: 

1. Default (enabled)
2. Disabled
3. Hovered
4. Focused
5. Pressed (ripple)

