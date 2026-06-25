---
component: Floating action buttons (FABs)
slug: floating-action-button
section: overview
category: Buttons
source: "https://m3.material.io/components/floating-action-button/overview"
scraped_at: "2026-06-20T06:57:37.784Z"
tokens_count: 1
images_count: 4
---
# Floating action buttons (FABs)

Floating action buttons (FABs) help people take primary actions

- Use a FAB for the most common or important action on a screen
- Make sure the icon in a FAB is clear and understandable
- FABs persist on the screen when content is scrolling
- Three variants: FAB, medium FAB, large FAB

![The 3 sizes of floating action buttons.](../../assets/floating-action-button/overview/01-the-3-sizes-of-floating-action-buttons-ac5efebb.png)

1. FAB
2. Medium FAB
3. Large FAB

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/FloatingActionButton-class.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/fab) | Available |
| Implementation | [Jetpack Compose: Expressive](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#FloatingActionButton\(kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Shape,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.material3.FloatingActionButtonElevation,androidx.compose.foundation.interaction.MutableInteractionSource,kotlin.Function0\)) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/FloatingActionButton.md) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/FloatingActionButton.md) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/fab.md) | Available |

## M3 Expressive update

**May 2025**

The FAB has new sizes to match the extended FAB and more color options. The small FAB is no longer recommended. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants and naming:

- Added **medium** FAB size
- **Small** FAB size is no longer recommended
- FAB and large FAB sizes are unchanged
- FAB variants are based on size, not color

Color:

- Added tone color styles:

    - Primary
    - Secondary
    - Tertiary
- Renamed existing tonal color styles to match their token names:

    - **Primary** to **Primary container**
    - **Secondary** to **Secondary container**
    - **Tertiary** to **Tertiary container**
    - The values haven't changed
- Surface color FABs are no longer recommended

![4 FABs showing the colors available after the expressive update.](../../assets/floating-action-button/overview/02-4-fabs-showing-the-colors-available-after-the-expressive-upd-aee2da3b.png)

FABs have updated colors and sizes

## Differences from M2

![M2 circular FAB with a plus icon.](../../assets/floating-action-button/overview/03-m2-circular-fab-with-a-plus-icon-8a978212.png)

M2: FABs are circles and always have a drop shadow

![M3 rounded corner square FAB with an artist’s palette icon.](../../assets/floating-action-button/overview/04-m3-rounded-corner-square-fab-with-an-artist-s-palette-icon-292bc470.png)

M3: FABs have a boxier shape, can use dynamic color, and include a new large FAB variation

