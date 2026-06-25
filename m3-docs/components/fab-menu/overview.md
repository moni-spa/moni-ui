---
component: FAB menu
slug: fab-menu
section: overview
category: Buttons
source: "https://m3.material.io/components/fab-menu/overview"
scraped_at: "2026-06-20T06:57:23.714Z"
tokens_count: 1
images_count: 4
---
# FAB menu

The floating action button (FAB) menu opens from a FAB to display multiple related actions

- Opens from a FAB [More on FABs](/m3/pages/fab/overview) to show 2–6 related actions floating on screen
- One FAB menu size for all sizes of FABs
- Not used with extended FABs [More on extended FABs](/m3/pages/extended-fab/overview)
- Available in primary, secondary, and tertiary color sets

![3 FAB menus in different color schemes.](../../assets/fab-menu/overview/01-3-fab-menus-in-different-color-schemes-782e697a.png)

The FAB menu comes in three color sets: primary, secondary, tertiary

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [Jetpack Compose: Expressive](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#FloatingActionButtonMenu\(kotlin.Boolean,kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.Alignment.Horizontal,kotlin.Function1\)) | Available |

## M3 Expressive update

**May 2025**

The FAB menu adds more options to the FAB. It should replace the speed dial and any usage of stacked small FABs. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

New component added to catalog:

- One menu size that pairs with any FAB
- Replaces any usage of stacked small FABs

Color:

- Contrasting close button and item colors
- Supports dynamic color
- Compatible with any FAB color style

![4 screens. The FAB menu is on the first, and 3 FABs of different sizes are on the others.](../../assets/fab-menu/overview/02-4-screens-the-fab-menu-is-on-the-first-and-3-fabs-of-differe-1ff6e071.png)

The FAB menu uses contrasting color and large items to focus attention. It can open from any size FAB.

## Differences from M2

![M2 speed dial.](../../assets/fab-menu/overview/03-m2-speed-dial-3988f327.png)

M2: The speed dial used small round FABs

![GM3 FAB menu.](../../assets/fab-menu/overview/04-gm3-fab-menu-b860aa85.png)

M3: The FAB menu uses dynamic color and a larger item size

