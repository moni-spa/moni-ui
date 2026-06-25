---
component: FAB menu
slug: fab-menu
section: specs
category: Buttons
source: "https://m3.material.io/components/fab-menu/specs"
scraped_at: "2026-06-20T06:57:33.908Z"
tokens_count: 7
images_count: 16
---
# FAB menu

The floating action button (FAB) menu opens from a FAB to display multiple related actions

## Variants

![The FAB menu in its single variant.](../../assets/fab-menu/specs/01-the-fab-menu-in-its-single-variant-48a9fe8b.png)

There’s one variant of FAB menu

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

FAB menu

 |

\--

 |

Available

 |

## Configurations

![3 color configurations of FAB menus.](../../assets/fab-menu/specs/02-3-color-configurations-of-fab-menus-668798a9.png)

Three color sets:

1. Primary
2. Secondary
3. Tertiary

|
Category

 |

Configuration

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- | --- |
|

Color

 |

Primary set, secondary set, tertiary set

 |

\--

 |

Available

 |

## Tokens & specs

Use the table's menu to switch token sets. The FAB menu has a common token set and six color sets, three for each element (close button and menu item). [Learn about design tokens](/m3/pages/design-tokens/overview/)

```
FAB menu - CommonTokenValueClose buttonList item
```

```
FAB menu - CommonTokenValueClose buttonList item
```

```
FAB menu - CommonTokenValueClose buttonList item
```

```
FAB menu - Common
```

```
FAB menu - Common
```

```
FAB menu - Common
```

```
FAB menu - Common
```

FAB menu - Common

Token

Value

Close button

List item

## Anatomy

![2 elements of a FAB menu.](../../assets/fab-menu/specs/03-2-elements-of-a-fab-menu-503ce72c.png)

1. Close button
2. Menu item

![5 FAB menus showing the range of 2–6 items.](../../assets/fab-menu/specs/04-5-fab-menus-showing-the-range-of-2-6-items-46b1e8cf.png)

The FAB menu can have up to six items

## Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![12 colors of the FAB menu.](../../assets/fab-menu/specs/05-12-colors-of-the-fab-menu-f12cc63e.png)

1. On primary container
2. Primary container
3. On primary
4. Primary
5. On secondary container
6. Secondary container
7. On secondary
8. Secondary
9. On tertiary container
10. Tertiary container
11. On tertiary
12. Tertiary

## States

States are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states)

### Close button

![4 states of the FAB menu close button.](../../assets/fab-menu/specs/06-4-states-of-the-fab-menu-close-button-3ed66427.png)![4 states of the FAB menu close button.](../../assets/fab-menu/specs/07-4-states-of-the-fab-menu-close-button-2aaa9be0.png)

Close button states in light and dark themes: 

1. Enabled
2. Hovered
3. Focused
4. Pressed

### Menu item

![4 states of the FAB menu items.](../../assets/fab-menu/specs/08-4-states-of-the-fab-menu-items-c6300db0.png)

Menu item states in light and dark themes:

1. Enabled
2. Hovered
3. Focused
4. Pressed

## Measurements

FAB menu items share the same measurements as the medium button [More on buttons](/m3/pages/common-buttons/overview) specs. The close button should always be 56dp.

![FAB menu size measurements.](../../assets/fab-menu/specs/09-fab-menu-size-measurements-14f83ef6.png)

FAB menu size measurements

The FAB menu animates from the top trailing edge of the FAB to ensure a smooth animation.

![FAB on a mobile screen with 16dp margins annotated.](../../assets/fab-menu/specs/10-fab-on-a-mobile-screen-with-16dp-margins-annotated-ad505281.png)

The FAB should always have 16dp margins

![FAB menu opened from a FAB has matching margins of 16dp.](../../assets/fab-menu/specs/11-fab-menu-opened-from-a-fab-has-matching-margins-of-16dp-6cd803fa.png)

The close button and FAB share the top trailing corner as an anchor and appear in the same place

Larger FABs will place the FAB menu slightly higher, with larger margins underneath.

![Medium FAB on a mobile screen with 16dp margins annotated.](../../assets/fab-menu/specs/12-medium-fab-on-a-mobile-screen-with-16dp-margins-annotated-a3c01525.png)

The medium FAB placement has 16dp margins

![FAB menu opened from the medium FAB has a 40dp margin from bottom of screen.](../../assets/fab-menu/specs/13-fab-menu-opened-from-the-medium-fab-has-a-40dp-margin-from-b-1ea6b407.png)

The close button is placed higher to align with the top of the medium FAB

![Large FAB on a mobile screen with 16dp margins annotated.](../../assets/fab-menu/specs/14-large-fab-on-a-mobile-screen-with-16dp-margins-annotated-b54e0b51.png)

The large FAB placement has 16dp margins

![FAB menu opened from the large FAB has a 56dp margin from bottom of screen.](../../assets/fab-menu/specs/15-fab-menu-opened-from-the-large-fab-has-a-56dp-margin-from-bo-f5d715a8.png)

The close button is placed higher to align with the top of the large FAB

On web, the FAB menu opens from the FAB, and inherits its states and specs from the baseline Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview/) component. The gap between the FAB and menu can vary, but 4dp is recommended.

![FAB menu on web states and specifications.](../../assets/fab-menu/specs/16-fab-menu-on-web-states-and-specifications-086e4c09.png)

Spacing and interaction on FAB menu for web:

1. Enabled
2. Hovered
3. Selected

