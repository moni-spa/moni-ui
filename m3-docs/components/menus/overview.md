---
component: Menus
slug: menus
section: overview
category: All other components
source: "https://m3.material.io/components/menus/overview"
scraped_at: "2026-06-20T06:58:18.441Z"
tokens_count: 1
images_count: 4
---
# Menus

Menus display a list of choices on a temporary surface

- Use a to show a temporary set of actions. To show actions on screen at all times, use a **toolbar [More on toolbars](/m3/pages/toolbars/overview)** instead
- Menus can open from many components, including icon buttons [More on icon buttons](/m3/pages/icon-buttons/overview), split buttons [More on split buttons](/m3/pages/split-buttons/overview), and text fields [More on text fields](/m3/pages/text-fields/overview)
- **Context menus** provide actions for a specific element, like an image or highlighted text, and usually open with a secondary click

![1 vertical menu with vibrant colors opens from a split button, and 1 vertical menu with a submenu.](../../assets/menus/overview/01-1-vertical-menu-with-vibrant-colors-opens-from-a-split-butto-7b9f6f1f.png)

Vertical menus can include vibrant colors, gaps, dividers, and submenus to organize a list of choices

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/ThemeData/useMaterial3.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/menu) | Available |
| Implementation | [Jetpack Compose: Expressive](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#DropdownMenuGroup%28androidx.compose.material3.MenuGroupShapes,androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Color,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp,androidx.compose.foundation.BorderStroke,androidx.compose.foundation.layout.PaddingValues,androidx.compose.foundation.interaction.MutableInteractionSource,kotlin.Function1%29) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/Menu.md) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/menu.md) | Available |

## M3 Expressive update

**November 2025**

**Vertical menus** were introduced with new shapes, color styles, selection states, and refined submenu motion. Gaps can be used for a more flexible layout on Android. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

Variants:

- Added **vertical menus**, recommended for new designs
- Baseline [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) is still available

Color styles: 

- Standard
- Vibrant

![A vertical menu using shape and vibrant color to show a selected state.](../../assets/menus/overview/02-a-vertical-menu-using-shape-and-vibrant-color-to-show-a-sele-2ffa7903.png)

Vibrant colors help selected menu items stand out

## Differences from M2

- **Color**: New color mappings and compatibility with dynamic color [More on dynamic color](/m3/pages/dynamic/choosing-a-source)
- **Variants**: Dropdown menu and exposed dropdown menu are now both referred to as menu, since they differ only in the element which opens the menu surface

![Menu with gray color.](https://lh3.googleusercontent.com/lRkDtzZzv1cQwgvOMTY_hxx5v6LvsZjXrAo_zSvv-cqgB6vH92PvSw1XJMN925XPqGDdMB1OgVKZcud6-w4b9LZg709o_yEZGMjqyhsgs6Wz=s0)

M2: Former menu colors don’t contrast with the background 

![Menu with purple background and outline.](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fmhlt7xid-04.png?alt=media&token=10f6b199-9664-4a24-b811-2980270f499c)

M3: Menus feature new color mappings and dynamic color

