---
component: Floating action buttons (FABs)
slug: floating-action-button
section: specs
category: Buttons
source: "https://m3.material.io/components/floating-action-button/specs"
scraped_at: "2026-06-20T06:57:46.170Z"
tokens_count: 7
images_count: 12
---
# Floating action buttons (FABs)

Floating action buttons (FABs) help people take primary actions

## Variants

![An icon on the container of a FAB, medium FAB, and large FAB.](../../assets/floating-action-button/specs/01-an-icon-on-the-container-of-a-fab-medium-fab-and-large-fab-91cf9ef5.png)

1. FAB
2. Medium FAB
3. Large FAB

### Baseline variants

The small FAB is still available, but no longer recommended. [Jump to baseline specs](/m3/pages/fab/specs#cd336045-e97d-4a6d-ac23-f778fa695e3c)

![An icon on the container of a small FAB.](../../assets/floating-action-button/specs/02-an-icon-on-the-container-of-a-small-fab-df37f571.png)

1\. Small FAB

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

FAB

 |

Available

 |

Available

 |
|

Medium FAB

 |

\--

 |

Available

 |
|

Large FAB

 |

Available

 |

Available

 |
|

Small FAB

 |

Available

 |

Not recommended. Use a larger size.

 |

## Configurations

In the expressive update, the **primary**, **secondary**, and **tertiary** set colors were renamed to **primary container**, **secondary container**, and **tertiary container** to match the actual color roles used. New primary, secondary, and tertiary color styles were created to match the corresponding color roles. [View details in the color styles section](/m3/pages/fab/specs#67e71ec7-b520-405a-aa06-2decfa0b92a3)

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

Primary container, secondary container, tertiary container

 |

Available as primary, secondary, tertiary

 |

Available

 |
|

Primary. secondary, tertiary

 |

\--

 |

Available

 |

## Tokens & specs

Use the table's menu to select a token set. FAB tokens are organized by size and color. [Learn more about design tokens](/m3/pages/design-tokens/overview/)

```
FAB - Size - RegularTokenValueFAB container heightmd.comp.fab.container.height56dpFAB container widthmd.comp.fab.container.width56dpFAB icon sizemd.comp.fab.icon.size24dpFAB container shapemd.comp.fab.container.shape
```

```
FAB - Size - RegularTokenValueFAB container heightmd.comp.fab.container.height56dpFAB container widthmd.comp.fab.container.width56dpFAB icon sizemd.comp.fab.icon.size24dpFAB container shapemd.comp.fab.container.shape
```

```
FAB - Size - RegularTokenValueFAB container heightmd.comp.fab.container.height56dpFAB container widthmd.comp.fab.container.width56dpFAB icon sizemd.comp.fab.icon.size24dpFAB container shapemd.comp.fab.container.shape
```

```
FAB - Size - Regular
```

```
FAB - Size - Regular
```

```
FAB - Size - Regular
```

```
FAB - Size - Regular
```

FAB - Size - Regular

Token

Value

FAB container height

md.comp.fab.container.height

56dp

FAB container width

md.comp.fab.container.width

56dp

FAB icon size

md.comp.fab.icon.size

24dp

FAB container shape

md.comp.fab.container.shape

## Anatomy

![2 elements of the FAB.](../../assets/floating-action-button/specs/03-2-elements-of-the-fab-7d0b1eab.png)

1\. Container

2\. Icon

## Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens)

### Color styles

FABs can use several combinations of **color** and **on-color** styles, such as **primary** and **on-primary**. The following color mappings provide the same legibility and functionality, so the color mapping you use depends on style alone.

![6 FAB color styles in light and dark themes. Each style has 2 color roles, 1 for the container and icon.](../../assets/floating-action-button/specs/04-6-fab-color-styles-in-light-and-dark-themes-each-style-has-2-8c4ca233.png)

1. Primary container & On primary container (default)
2. Secondary container & On secondary container
3. Tertiary container & On tertiary container
4. Primary & On primary
5. Secondary & On secondary
6. Tertiary & On tertiary

### Baseline color styles

Surface FAB color styles are still available, but no longer recommended.

![Baseline FAB style in all 3 sizes.](../../assets/floating-action-button/specs/05-baseline-fab-style-in-all-3-sizes-d84aab58.png)

1. Surface FABs

## States

States are visual representations used to communicate the status of a component or interactive element. When using a non-default color mapping for FABs, make sure the state layer color is the same as the icon color. For example, the state layer color for the **primary** color style should be md.sys.color.primary.

![4 states of a FAB shown in light and dark themes.](../../assets/floating-action-button/specs/06-4-states-of-a-fab-shown-in-light-and-dark-themes-0d4c1b4c.png)

1. Enabled
2. Hovered (8% state layer) - elevation 4
3. Focused (10% state layer)
4. Pressed (10% state layer)

## Measurements

### FAB

![FAB size measurements.](../../assets/floating-action-button/specs/07-fab-size-measurements-f501a9a8.png)

FAB size measurements

![FAB padding measurements.](../../assets/floating-action-button/specs/08-fab-padding-measurements-02b9fdc8.png)

FAB padding measurements

### Medium FAB

![Medium FAB size measurements.](../../assets/floating-action-button/specs/09-medium-fab-size-measurements-b68429b6.png)

Medium FAB size measurements

![Medium FAB padding measurements.](../../assets/floating-action-button/specs/10-medium-fab-padding-measurements-10695fc5.png)

Medium FAB padding measurements

### Large FAB

![Large FAB size measurements.](../../assets/floating-action-button/specs/11-large-fab-size-measurements-be189abe.png)

Large FAB size measurements

![Large FAB padding measurements.](../../assets/floating-action-button/specs/12-large-fab-padding-measurements-325bfc64.png)

Large FAB padding measurements

## Baseline tokens & specs

Use the table's menu to select a token set. This only includes tokens for small and surface FABs, which are both no longer recommended. It doesn't include other colors, or large or regular FABs, since those are still currently used.

\[Deprecated\] FAB - Size - Small

Token

Value

FAB small container height

md.comp.fab.small.container.height

40dp

FAB small container width

md.comp.fab.small.container.width

40dp

FAB small icon size

md.comp.fab.small.icon.size

24dp

FAB small container shape

md.comp.fab.small.container.shape

