---
component: Menus
slug: menus
section: specs
category: All other components
source: "https://m3.material.io/components/menus/specs"
scraped_at: "2026-06-20T06:58:30.548Z"
tokens_count: 5
images_count: 18
---
# Menus

Menus display a list of choices on a temporary surface

## Variants

### Vertical menus

Use vertical menus for a more expressive look and feel, including rounded corners, standard and vibrant color styles, more selection states, and submenu motion.

![2 vertical menus use shape and color to indicate selected state.](../../assets/menus/specs/01-2-vertical-menus-use-shape-and-color-to-indicate-selected-st-4b148b57.png)

1. Vertical menu with gap
2. Vertical menu with divider

### Baseline variant

In M3 Expressive, baseline [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) menu is still available to use, but doesn’t have the latest shapes, color styles, selection states, and motion. [See baseline menu specs](/m3/pages/menus/specs#a80df2f9-8610-4ce0-b3a3-b9ee749d5c98)

![A baseline menu variant with square corners and standard colors.](../../assets/menus/specs/02-a-baseline-menu-variant-with-square-corners-and-standard-col-7be88462.png)

A baseline has square corners, as compared to a **vertical menu’s** round corners and expressive styling

|
**Variant**

 |

**M3**

 |

**M3 Expressive**

 |
| --- | --- | --- |
|

Vertical menus

 |

\--

 |

Available

 |
|

Menu (baseline [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive))

 |

Available

 |

Available

 |

## Configurations

### Vertical menus layout

![2 menus: 1 standard, and 1 with a gap, creating groups.](../../assets/menus/specs/03-2-menus-1-standard-and-1-with-a-gap-creating-groups-d353506a.png)

1. Standard
2. Grouped

| **Category
** | **Configuration
** | **M3** |
**M3 Expressiv****e**

 |
| --- | --- | --- | --- |
| Color | Standard | Available | Available |
| Vibrant | \-- | Available |
| Layout | Standard | Available | Available |
| Grouped | \-- | Available |

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](/m3/pages/design-tokens/overview)

```
Menus - Common
```

```
Menus - Common
```

```
Menus - Common
```

```
Menus - Common
```

Menus - Common

Token

Default, Light

Typography

Shape

Layout

Focus ring

## Anatomy

### Vertical menus

![A diagram of a vertical menu.](../../assets/menus/specs/04-a-diagram-of-a-vertical-menu-cdea637d.png)

1. Menu item
2. Leading icon (optional)
3. Menu item text
4. Trailing icon (optional)
5. Badge (optional)
6. Trailing text (optional)
7. Container
8. Supporting text (optional)
9. Label text (optional)
10. Gap (optional)
11. Divider (optional)

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

Menus have two color mappings:

- Standard: Surface-based
- Vibrant: Tertiary-based

These mappings provide options for lower or higher visual emphasis. Vibrant menus are more prominent so should be used sparingly.

![2 vertical menus: 1 with lower visual emphasis, and 1 vibrant menu with bold shades.](../../assets/menus/specs/05-2-vertical-menus-1-with-lower-visual-emphasis-and-1-vibrant--9eb2a360.png)

1. Standard color scheme
2. Vibrant color scheme

### Standard colors

![2 vertical menus with standard color roles mapped to 11 elements.](../../assets/menus/specs/06-2-vertical-menus-with-standard-color-roles-mapped-to-11-elem-582cba4d.png)

Vertical menus color roles used for light and dark themes:

1. On surface variant
2. On surface
3. On surface (state layer)
4. Surface container low
5. On surface variant
6. On surface variant
7. Tertiary container (selected)
8. On tertiary container (selected)
9. On surface variant
10. On surface variant
11. On tertiary container (selected)

### Vibrant colors

![2 vertical menus with vibrant color roles mapped to 11 elements.](../../assets/menus/specs/07-2-vertical-menus-with-vibrant-color-roles-mapped-to-11-eleme-1e551add.png)

Vertical menus color roles used for light and dark themes:

1. On tertiary container
2. On tertiary container
3. On tertiary container (state layer)
4. Tertiary container
5. On tertiary container
6. On tertiary container
7. Tertiary (selected)
8. On tertiary (selected)
9. On tertiary container
10. On tertiary container
11. On tertiary (selected)

## States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or an interactive element. [More on interaction states](/m3/pages/interaction-states/overview)

Shape morphing in vertical menus creates an expressive active state. As focus moves between submenus, the corner shape changes to highlight the active menu. [More on menu focus](/m3/pages/menus/guidelines#7cc1d01b-a454-48c7-8306-e60347ffd17f)

![6 vertical menu states in light and dark themes.](../../assets/menus/specs/08-6-vertical-menu-states-in-light-and-dark-themes-04240f4f.png)

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed
6. Active (main menu reveals submenu)

## Measurements

![Vertical menu marked with spacing and padding measurements.](../../assets/menus/specs/09-vertical-menu-marked-with-spacing-and-padding-measurements-76243f6a.png)

Vertical menu padding and size measurements

## Menu (baseline)

The baseline [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) menu variant is available and continues to work in existing products. However, M3 expressive vertical menus are recommended for new designs. 

### Baseline tokens & specs

Browse the component elements, attributes, tokens, and their values. [Learn about design tokens](/m3/pages/design-tokens/overview)

Menu (baseline)

Token

Default, Light

Enabled

Disabled

Hover

Focus

Pressed

Focus indicator

### Anatomy

![Diagram of 6 elements of a baseline menu.](../../assets/menus/specs/10-diagram-of-6-elements-of-a-baseline-menu-b6eb4297.png)

1. List item
2. List item leading icon
3. List item trailing icon
4. Container
5. List item trailing text
6. Divider

### Color

![9 color roles of a baseline menu in light and dark themes.](../../assets/menus/specs/11-9-color-roles-of-a-baseline-menu-in-light-and-dark-themes-e1ca1c88.png)

Baseline menu color roles used for light and dark themes:

1. On surface variant
2. On surface
3. On surface - opacity: 0.08
4. Surface container
5. On surface variant
6. On surface variant
7. On surface variant
8. Surface container highest
9. Outline variant

### States

#### Default menu items

![Diagram numbering the 5 default states of a baseline menu.](../../assets/menus/specs/12-diagram-numbering-the-5-default-states-of-a-baseline-menu-3a1b1a19.png)![Diagram numbering the 5 default states of a baseline menu.](../../assets/menus/specs/13-diagram-numbering-the-5-default-states-of-a-baseline-menu-3a1b1a19.png)

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

#### Selected menu items

![5 states of a selected baseline menu item.](../../assets/menus/specs/14-5-states-of-a-selected-baseline-menu-item-e59891f8.png)![5 states of a selected baseline menu item.](../../assets/menus/specs/15-5-states-of-a-selected-baseline-menu-item-e59891f8.png)

1. Enabled
2. Disabled
3. Hovered
4. Focused
5. Pressed

[State specs are in the token module above](/m3/pages/menus/specs#c811d2fa-469a-4e4e-9d9f-0f535c5c9b4c)

### Measurements

![Diagram of a baseline menu’s padding, text alignment, height, and width.](../../assets/menus/specs/16-diagram-of-a-baseline-menu-s-padding-text-alignment-height-a-05349ad8.png)![Diagram of a baseline menu’s padding, text alignment, height, and width.](../../assets/menus/specs/17-diagram-of-a-baseline-menu-s-padding-text-alignment-height-a-05349ad8.png)

Baseline menu padding and size measurements

| Attribute
 | Value
 |
| --- | --- |
| Container width
 | 112dp min, 280dp max |
| Corner radius
 | 4dp |
| Vertical label text alignment
 | Center-aligned |
| Horizontal label text alignment
 | Start-aligned |
| Left/right padding
 | 12dp |
| Left/right padding with-icon
 | 12dp |
| List item height
 | 48dp |
| Padding between elements within a list item
 | 12dp |
| Divider top/bottom padding
 | 8dp |
| Divider height
 | 1dp |
| Divider width
 | Dynamic |
| Leading/trailing icon size
 | 24dp |

### Configurations

A baseline menu appears when a person interacts with a button, action, or other control. A few examples:

1. Button [More on buttons](/m3/pages/common-buttons/overview)
2. Text field [More on text fields](/m3/pages/text-fields/overview)
3. Icon button [More on icon buttons](/m3/pages/icon-buttons/overview)
4. Selected text

![Examples of 4 baseline menu inputs.](../../assets/menus/specs/18-examples-of-4-baseline-menu-inputs-db71f653.png)

