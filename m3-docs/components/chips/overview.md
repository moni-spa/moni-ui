---
component: Chips
slug: chips
section: overview
category: All other components
source: "https://m3.material.io/components/chips/overview"
scraped_at: "2026-06-20T06:56:32.954Z"
tokens_count: 1
images_count: 4
---
# Chips

Chips help people enter information, make selections, filter content, or trigger actions

- Use chips to show options for a specific context
- Four variants: assist , filter , input , and suggestion
- Chip elevation [More on elevation](/m3/pages/elevation/overview) defaults to 0 but can be elevated if they need more visual separation

![4 chip variants.](../../assets/chips/overview/01-4-chip-variants-1ea3fa42.png)

1. Assist chip
2. Filter chip
3. Input chip
4. Suggestion chip

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/ThemeData/useMaterial3.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/chip) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/Chip.md) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/chip.md) | Available |

## Updates

**Aug 2024**

Updated stroke color from **outline** to **outline variant**.

![A chip with a clear outline is now a chip with a subtle outline.](../../assets/chips/overview/02-a-chip-with-a-clear-outline-is-now-a-chip-with-a-subtle-outl-3c4a5cad.png)

The stroke color was softened to improve visual hierarchy between chips and buttons

## Differences from M2

- Color: New color mappings and compatibility with dynamic color [More on dynamic color](/m3/pages/dynamic/choosing-a-source)
- Shape: Rounded rectangle
- Variants: Action chips have been separated into assist chips and suggestion chips . Choice chips are now a subset of filter chips

![M2 chip variants.](../../assets/chips/overview/03-m2-chip-variants-72814c9a.png)

M2: Variants of chips are input, choice, filter, and action chips

![M3 chip variants.](../../assets/chips/overview/04-m3-chip-variants-4f6e2f84.png)

M3: Variants of chips updated to assist, filter, input, and suggestion chips

