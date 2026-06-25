---
component: Text fields
slug: text-fields
section: specs
category: All other components
source: "https://m3.material.io/components/text-fields/specs"
scraped_at: "2026-06-20T07:00:54.367Z"
tokens_count: 6
images_count: 17
---
# Text fields

Text fields let users enter text into a UI

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](/m3/pages/design-tokens/overview)

```
Text field - Filled
```

```
Text field - Filled
```

```
Text field - Filled
```

```
Text field - Filled
```

Text field - Filled

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Error

## Filled text field

![Diagram of a filled text field indicating the 10 parts of its anatomy.](../../assets/text-fields/specs/01-diagram-of-a-filled-text-field-indicating-the-10-parts-of-it-8a49ffa3.png)

1. Container
2. Leading icon (optional)
3. Label text in empty field
4. Label text in populated field
5. Trailing icon (optional)
6. Focused active Indicator
7. Caret
8. Input text
9. Supporting text (optional)
10. Enabled active indicator

### Filled text field color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Diagram of a filled text field indicating its color mappings.](../../assets/text-fields/specs/02-diagram-of-a-filled-text-field-indicating-its-color-mappings-1d4f0ab5.png)

Filled text field color roles used for light and dark schemes:

1. Surface container highest
2. On surface variant
3. On surface variant
4. Primary
5. On surface variant
6. Primary
7. Primary
8. On surface
9. On surface variant
10. On surface

### Filled text field states

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![Side by side view of empty and populated filled text fields across different states, showing the differences between enabled, focused, hovered, and disabled.](../../assets/text-fields/specs/03-side-by-side-view-of-empty-and-populated-filled-text-fields--51e217fa.png)![Side by side view of empty and populated filled text fields across different states, showing the differences between enabled, focused, hovered, and disabled.](../../assets/text-fields/specs/04-side-by-side-view-of-empty-and-populated-filled-text-fields--5813d975.png)

1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Disabled (empty)
5. Enabled (populated)
6. Focused (populated)
7. Hovered (populated)
8. Disabled (populated)

### Filled text field error states

Error states [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed.

![Side by side view of empty and populated filled text fields across different error states, showing the differences between enabled, focused, hovered.](../../assets/text-fields/specs/05-side-by-side-view-of-empty-and-populated-filled-text-fields--e0691f7c.png)

1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Enabled (populated)
5. Focused (populated)
6. Hovered (populated)

### Filled text field measurements

![Diagram showing layout values and paddings for filled text fields without icons.](../../assets/text-fields/specs/06-diagram-showing-layout-values-and-paddings-for-filled-text-f-50faf7f2.png)

Padding and size measurements without icons

![Diagram showing layout values and paddings for outlined text fields with leading and trailing icons.](../../assets/text-fields/specs/07-diagram-showing-layout-values-and-paddings-for-outlined-text-5a31eed1.png)

Padding and size measurements with icons

![A diagram showing layout values and paddings for supporting text, and supporting text in combination with a character count.](../../assets/text-fields/specs/08-a-diagram-showing-layout-values-and-paddings-for-supporting--c57845ec.png)

Padding and size measurements with supporting text and character count

| Attribute | Value |
| --- | --- |
| Default container height
 | 56dp |
| Label alignment (unpopulated)
 | Vertically centered |
| Top/bottom padding
 | 8dp |
| Left/right padding without icons
 | 16dp |
| Left/right padding with icons
 | 12dp |
| Icon alignment
 | Vertically centered |
| Padding between icons and text
 | 16dp |
| Supporting text and character counter top padding
 | 4dp |
| Padding between supporting text and character counter
 | 16dp |
| Target size | 56dp |

### Filled text field configurations

![Side by side view of filled text fields in different configurations.](../../assets/text-fields/specs/09-side-by-side-view-of-filled-text-fields-in-different-configu-508da573.png)

Empty and populated filled text fields with:

1. Supporting text
2. Trailing icon
3. Leading icon
4. Leading and trailing icons
5. Prefix
6. Suffix
7. Multi-line text field

## Outlined text field

![Diagram of an outlined text field indicating the 9 parts of its anatomy](../../assets/text-fields/specs/10-diagram-of-an-outlined-text-field-indicating-the-9-parts-of--ef3faa76.png)

1. Enabled container outline
2. Leading icon (optional)
3. Label text in empty field
4. Label text in populated field
5. Trailing icon (optional)
6. Focused container outline
7. Caret
8. Input text
9. Supporting text (optional)

### Outlined text field color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Diagram of an outlined text field indicating its color mappings](../../assets/text-fields/specs/11-diagram-of-an-outlined-text-field-indicating-its-color-mappi-bd947457.png)

Outlined text field color roles used for light and dark schemes:

1. Outline
2. On surface variant
3. On surface variant
4. Primary
5. On surface variant
6. Primary
7. Primary
8. On surface
9. On surface variant

### Outlined text field states

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![Side by side view of empty and populated outlined text fields across different states, showing the differences between enabled, focused, hovered, and disabled.](../../assets/text-fields/specs/12-side-by-side-view-of-empty-and-populated-outlined-text-field-6d3317d6.png)

1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Disabled (empty)
5. Enabled (populated)
6. Focused (populated)
7. Hovered (populated)
8. Disabled (populated)

### Outlined text field error states

Error states [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. An error message can display instructions on how to fix it. Error messages are displayed below the text field as supporting text until fixed.

![Side by side view of empty and populated filled text fields across different error states, showing the differences between enabled, focused, hovered.](../../assets/text-fields/specs/13-side-by-side-view-of-empty-and-populated-filled-text-fields--5775c90f.png)

1. Enabled (empty)
2. Focused (empty)
3. Hovered (empty)
4. Enabled (populated)
5. Focused (populated)
6. Hovered (populated)

### Outlined text field measurements

![A diagram showing layout values and paddings for outlined text fields without icons.](../../assets/text-fields/specs/14-a-diagram-showing-layout-values-and-paddings-for-outlined-te-246b84fb.png)

Padding and size measurements without icons

![A diagram showing layout values and paddings for outlined text fields with leading and trailing icons.](../../assets/text-fields/specs/15-a-diagram-showing-layout-values-and-paddings-for-outlined-te-ffb65ccd.png)

Padding and size measurements with icons

![A diagram showing layout values and paddings for supporting text, and supporting text in combination with a character count.](../../assets/text-fields/specs/16-a-diagram-showing-layout-values-and-paddings-for-supporting--561594c9.png)

Padding and size measurements with supporting text and character count

| Attribute | Value |
| --- | --- |
| Container height
 | 56dp |
| Left/right padding without icons
 | 16dp |
| Left/right padding with icons
 | 12dp |
| Padding between icons and text
 | 16dp |
| Icon alignment
 | Vertically centered |
| Supporting text and character counter top padding
 | 4dp |
| Padding between supporting text and character counter
 | 16dp |
| Label alignment
 | Vertically centered |
| Left/right padding populated label text
 | 4dp |
| Target size | 56dp |

### Outlined text field configurations

![A side by side view of outlined text fields in different configurations.](../../assets/text-fields/specs/17-a-side-by-side-view-of-outlined-text-fields-in-different-con-940e26d4.png)

Empty and populated outlined text fields with:

1. Supporting text
2. Trailing icon
3. Leading icon
4. Leading and trailing icons
5. Prefix
6. Suffix
7. Multi-line text field

