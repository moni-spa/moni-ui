---
component: Navigation bar
slug: navigation-bar
section: specs
category: Navigation
source: "https://m3.material.io/components/navigation-bar/specs"
scraped_at: "2026-06-20T06:58:38.132Z"
tokens_count: 4
images_count: 15
---
# Navigation bar

Navigation bars let people switch between UI views on smaller devices

## Variants

![The recommended flexible navigation bar.](../../assets/navigation-bar/specs/01-the-recommended-flexible-navigation-bar-acb90497.png)

1. Flexible navigation bar

### Baseline variants

The baseline nav bar is no longer recommended, and should be replaced by the flexible nav bar, which is shorter and supports horizontal navigation items in medium windows. [View baseline nav bar specs](/m3/pages/navigation-bar/specs#46dc2521-acf0-44e3-bbc0-78dc225b9749)

![1 baseline navigation bar.](../../assets/navigation-bar/specs/02-1-baseline-navigation-bar-fe11f5b1.png)

1. Navigation bar (not recommended)

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

Flexible navigation bar

 |

\--

 |

Available

 |
|

Navigation bar

 |

Available

 |

Not recommended. Use **flexible navigation bar**.

 |

## Configurations

In compact windows, navigation bars use vertical items. In medium windows, navigation bars should use horizontal items.

![Two size configurations for navigation bar and items.](../../assets/navigation-bar/specs/03-two-size-configurations-for-navigation-bar-and-items-66d036e9.png)

1. Vertical navigation items
2. Horizontal navigation items

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

Navigation item layout

 |

Vertical (default)

 |

Available

 |

Available

 |
|

Horizontal

 |

\--

 |

Available

 |

## Tokens & specs

Use the table's menu to switch between token sets for the navigation bar and the nav items. [](/m3/pages/navigation-bar/specs#3425f33a-0b11-492a-ae5a-40d63f939384)[Learn about design tokens](/m3/pages/design-tokens/overview/)

```
Nav bar - Common
```

```
Nav bar - Common
```

```
Nav bar - Common
```

```
Nav bar - Common
```

Nav bar - Common

Token

Default, Light

Color

Nav item

Container

## Anatomy

![Seven elements of the navigation bar.](../../assets/navigation-bar/specs/04-seven-elements-of-the-navigation-bar-1b7201f6.png)

1. Container
2. Icon
3. Label text
4. Active indicator
5. Small badge (optional)
6. Large badge (optional)
7. Large badge label

## Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Six color roles of the navigation bar.](../../assets/navigation-bar/specs/05-six-color-roles-of-the-navigation-bar-d2ebfb6a.png)

Navigation bar color roles used for light and dark schemes:

1. Surface container
2. On-secondary container
3. Secondary
4. Secondary container
5. On-surface variant
6. On-surface variant

For badge color roles, go to [badge specs](/m3/pages/badges/specs).

## States

States are visual representations used to communicate the status of a component or an interactive element.

![Four states of the navigation bar items.](../../assets/navigation-bar/specs/06-four-states-of-the-navigation-bar-items-6a64c172.png)

1. Enabled
2. Hovered (8% state layer)
3. Focused (10% state layer)
4. Pressed (10% state layer)

## Measurements

The navigation bar stretches the full window width.

![Navigation bar padding and size measurements.](../../assets/navigation-bar/specs/07-navigation-bar-padding-and-size-measurements-d185fad5.png)

Navigation bar padding and size measurements

Vertical navigation items dynamically change width to equally fit the container. Horizontal navigation items have a fixed width, so extra space is added to the ends of the navigation bar instead.

![Navigation bar and item widths.](../../assets/navigation-bar/specs/08-navigation-bar-and-item-widths-58f25eef.png)

Navigation bar width and margins for compact and medium windows.

1. Vertical navigation item
2. Margin from window edge
3. Horizontal navigation item
*. * *

## Baseline navigation bar

![7 elements of baseline navigation bar.](../../assets/navigation-bar/specs/09-7-elements-of-baseline-navigation-bar-52134f4a.png)

1. Container
2. Icon
3. Label text
4. Active indicator
5. Small badge
6. Large badge
7. Large badge label

### Tokens & specs

These tokens are for the baseline navigation bar. Navigation bar (baseline)

Token

Default, Light

Enabled

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens; in implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![6 color roles of baseline navigation bar.](../../assets/navigation-bar/specs/10-6-color-roles-of-baseline-navigation-bar-5f4083d9.png)

Navigation bar color roles used for light and dark schemes:

1. Surface
2. On secondary container
3. On surface
4. Secondary container
5. On surface variant
6. On surface variant

For badge color roles, go to [badge specs](/m3/pages/badges/specs).

### States

States are visual representations used to communicate the status of a component or an interactive element.

![4 states of baseline navigation bar.](../../assets/navigation-bar/specs/11-4-states-of-baseline-navigation-bar-aa029bf7.png)

Navigation bar states: 

1. Enabled
2. Hovered
3. Focused
4. Pressed

## Measurements

![Baseline navigation bar padding and size measurements.](../../assets/navigation-bar/specs/12-baseline-navigation-bar-padding-and-size-measurements-984a35b7.png)

Navigation bar padding and size measurements

![Baseline navigation bar target size and margins.](../../assets/navigation-bar/specs/13-baseline-navigation-bar-target-size-and-margins-1a9a0b20.png)

Navigation bar target size and margins

## Configurations

![3 configurations of the baseline navigation bar.](../../assets/navigation-bar/specs/14-3-configurations-of-the-baseline-navigation-bar-747b38b2.png)![3 configurations of the baseline navigation bar.](../../assets/navigation-bar/specs/15-3-configurations-of-the-baseline-navigation-bar-d592b37c.png)

1. 3 destinations
2. 4 destinations
3. 5 destinations

