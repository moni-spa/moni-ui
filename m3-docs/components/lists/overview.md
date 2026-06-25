---
component: Lists
slug: lists
section: overview
category: All other components
source: "https://m3.material.io/components/lists/overview"
scraped_at: "2026-06-20T06:57:55.872Z"
tokens_count: 1
images_count: 4
---
# Lists

Lists are continuous, vertical indexes of text and images

- Use lists to help people find a specific item and act on it
- Order list items in logical ways, like alphabetical or numerical
- Keep items short and easy to scan
- Show icons, text, and actions in a consistent format
- Choose between standard and segmented styles

![1 list contains 3 items, each with a label text, supporting text, and trailing text. A music app shows list items with leading images.](../../assets/lists/overview/01-1-list-contains-3-items-each-with-a-label-text-supporting-te-2156c706.png)

A list item's label text, supporting text, image, and trailing icon can be customized to create a variety of lists

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/ListTile-class.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/lists) | Available |
| Implementation | [Jetpack Compose: Expressive](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#ListItem%28kotlin.Function0,androidx.compose.ui.Modifier,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,androidx.compose.material3.ListItemColors,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp%29) | Available |
| Implementation | [](https://developer.android.com/develop/ui/views/layout/recyclerview) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/List.md#m3-expressive) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/list.md) | Available |

## M3 Expressive update

Lists have a new segmented visual style, improved selection treatment, and support for slots. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

**December 2025** 

Variants:

- Added **expressive** list

    - Recommended for new designs

- List (baseline [More on M3 Expressive](<https://m3.material.io/blog/building-with-m3-expressive >)) is still available

New visual styles:

- Standard or segmented
- Highlighted selection states
- Flexible slots

Supported platforms:

- [Jetpack Compose](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#ListItem%28kotlin.Function0,androidx.compose.ui.Modifier,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,androidx.compose.material3.ListItemColors,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp%29)

![2 party planning lists with 2 completed list items each. In 1 list, the selected items are highlighted.](../../assets/lists/overview/02-2-party-planning-lists-with-2-completed-list-items-each-in-1-aaf6cdd6.png)

Expressive lists feature improved selection states

## Differences from M2 to M3 baseline

- **Color:** New color mappings and compatibility with dynamic color [More on dynamic color](/m3/pages/dynamic/choosing-a-source)
- **Layout:** Padding and spacing rules are updated to be more consistent
- **Height:** The tallest element within a list item determines the list item’s height - either 56dp, 72dp, or 88dp
- **Alignment:**

    - In most cases, elements in a list item are middle-aligned
    - If a list is 88dp or larger, or contains three or more lines of text, elements are top-aligned

![3 variants of lists in M2.](../../assets/lists/overview/03-3-variants-of-lists-in-m2-66365b23.png)

M2: Non-standard heights and alignments

![3 variants of lists in M3 baseline.](../../assets/lists/overview/04-3-variants-of-lists-in-m3-baseline-cfa568ac.png)

M3 (baseline): Standardized heights and alignments

