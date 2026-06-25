---
component: Navigation drawer
slug: navigation-drawer
section: overview
category: Navigation
source: "https://m3.material.io/components/navigation-drawer/overview"
scraped_at: "2026-06-20T06:58:40.312Z"
tokens_count: 1
images_count: 3
---
# Navigation drawer

Navigation drawers let people switch between UI views on larger devices

star

Note:

The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](/m3/pages/navigation-rail/overview/), which has mostly the same functionality of the navigation drawer and adapts better across window size classes.

- Use standard navigation drawers in expanded [More on expanded window size class](/m3/pages/breakpoints/expanded), large [More on large window size class](/m3/pages/breakpoints/large-extra-large), and extra-large window sizes [More on extra-large window size class](/m3/pages/breakpoints/large-extra-large)
- Use modal navigation drawers in compact [More on compact window size class](/m3/pages/breakpoints/medium) and medium [More on medium window size class](/m3/pages/breakpoints/medium) window sizes
- Can be open or closed by default
- Two variants: standard and modal
- Put the most frequent destinations at the top and group related destinations together

![2 variants of navigation drawers: standard and modal.](../../assets/navigation-drawer/overview/01-2-variants-of-navigation-drawers-standard-and-modal-3f7b9cff.png)

1. Standard navigation drawer
2. Modal navigation drawer

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/NavigationDrawer-class.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/drawer) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationDrawer.md) | Available |

## M3 Expressive update

**May 2025**

The navigation drawer is no longer recommended. Use the expanded navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview) instead. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

## Differences from M2

- Color: New color mappings and compatibility with dynamic color [More on dynamic color](/m3/pages/dynamic/choosing-a-source)
- Variants: Distinguishes two separate variants of navigation drawer: Standard and modal
- Shape: Rounded corners at the ending edge of the drawer
- States [More on states](/m3/pages/interaction-states/overview): Updated color and shape for indicating selected state

![M2 navigation drawer with 4 destinations in a mail app. The active destination “Inbox” is rectangular.](../../assets/navigation-drawer/overview/02-m2-navigation-drawer-with-4-destinations-in-a-mail-app-the-a-f5e9c9c4.png)

M2: Navigation drawer had square corners and a rectangular shape indicating the active destination

![M3 navigation drawer with 4 destinations in a mail app. The active destination “Inbox” has rounded corners.](../../assets/navigation-drawer/overview/03-m3-navigation-drawer-with-4-destinations-in-a-mail-app-the-a-12269210.png)

M3: Navigation drawer has rounded corners, new color mappings, and an updated style for indicating the active destination

