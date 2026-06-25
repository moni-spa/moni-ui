---
component: Toolbars
slug: toolbars
section: specs
category: All other components
source: "https://m3.material.io/components/toolbars/specs"
scraped_at: "2026-06-20T07:01:12.396Z"
tokens_count: 4
images_count: 16
---
# Toolbars

Toolbars display frequently used actions relevant to the current page

## Variants

![2 variants of toolbars.](../../assets/toolbars/specs/01-2-variants-of-toolbars-63d9ef26.png)

1. Docked toolbar
2. Floating toolbar

### Baseline variant

The baseline bottom app bar is no longer recommended. It should be replaced with the docked toolbar, which is very similar and more flexible.

![Baseline bottom app bar, which looks like the docked toolbar, but is not recommended.](../../assets/toolbars/specs/02-baseline-bottom-app-bar-which-looks-like-the-docked-toolbar--d5c91053.png)

1. Bottom app bar (not recommended)

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

Docked toolbar

 |

\--

 |

Available

 |
|

Floating toolbar

 |

\--

 |

Available

 |
|

Bottom app bar

 |

Available

 |

Not recommended. Use **docked toolbar**.

 |

star

Note:

Implementation differs per platform. On Jetpack Compose, the floating toolbar is a separate component from the docked toolbar and bottom app bar.

## Configurations

![Color configuration of toolbars.](../../assets/toolbars/specs/03-color-configuration-of-toolbars-ff33d572.png)

1. Standard and vibrant toolbars
2. Vertical floating toolbar
3. Floating toolbar with FAB

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

Standard (default)

 |

Available as bottom app bar

 |

Available

 |
|

Vibrant

 |

\--

 |

Available

 |
|

Floating toolbar layout

 |

Horizontal (default)

 |

\--

 |

Available

 |
|

Vertical

 |

\--

 |

Available

 |
|

Other elements

 |

With FAB

 |

Available as bottom app bar

 |

Available\*

 |

star

Note:

\*Implementation differs per platform. On Jetpack Compose, floating toolbar with FAB is [fully supported](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#HorizontalFloatingToolbar\(kotlin.Boolean,androidx.compose.ui.Modifier,androidx.compose.material3.FloatingToolbarColors,androidx.compose.foundation.layout.PaddingValues,androidx.compose.material3.FloatingToolbarScrollBehavior,androidx.compose.ui.graphics.Shape,kotlin.Function1,kotlin.Function1,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp,kotlin.Function1\)). On other platforms, each component needs to be added separately. 

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. [Jump to baseline bottom app bar specs](/m3/pages/toolbars/specs#ad142675-3e3b-43b8-ba53-12c1f0b7138d)

```
Toolbar - Color - Standard
```

```
Toolbar - Color - Standard
```

```
Toolbar - Color - Standard
```

```
Toolbar - Color - Standard
```

Toolbar - Color - Standard

Token

Default, Light

Enabled

Disabled

Hovered

Focused

Pressed

## Anatomy

![2 elements of a toolbar.](../../assets/toolbars/specs/04-2-elements-of-a-toolbar-e69b97ed.png)

1. Container
2. Placed components

### Flexibility & slots

When configuring a toolbar, think of it as a container with several slots. Each slot can be a different element. The most common elements are icon buttons [More on icon buttons](/m3/pages/icon-buttons/specs), buttons [More on buttons](/m3/pages/common-buttons/specs), and text fields [More on text fields](/m3/pages/text-fields/overview).

![A toolbar with 5 slots, conceptual spaces for UI elements, next to each other.](../../assets/toolbars/specs/05-a-toolbar-with-5-slots-conceptual-spaces-for-ui-elements-nex-6630f4d0.png)

A toolbar is essentially a container with configurable slots

## Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

### Standard

![4 color roles in the standard color scheme  of the floating toolbar in light and dark scheme.](../../assets/toolbars/specs/06-4-color-roles-in-the-standard-color-scheme-of-the-floating-t-13318091.png)

Standard color schemes and icon button types:

1. Surface container
2. Filled button (Primary, On primary)
3. Toggle tonal button (Secondary container, On secondary container)
4. Standard button (Primary)

### Vibrant

![4 color roles in the vibrant color scheme of the floating toolbar in light and dark scheme.](../../assets/toolbars/specs/07-4-color-roles-in-the-vibrant-color-scheme-of-the-floating-to-c4905bb7.png)

Vibrant color scheme and icon button types:

1. Primary container
2. Filled button (Primary, On primary)
3. Toggle tonal button: (Surface container, On surface)
4. Standard button (On primary container)

## Measurements

By default all toolbars are 64dp high, center-aligned, have equal padding between items, and have a minimum outside padding of 16dp.

### Docked toolbar

![Default internal padding of a docked toolbar.](../../assets/toolbars/specs/08-default-internal-padding-of-a-docked-toolbar-38d0cec7.png)

1. Default margins and padding
2. Margins and padding with leading, middle, and trailing content

![2 docked toolbars with different margins and alignment.](../../assets/toolbars/specs/09-2-docked-toolbars-with-different-margins-and-alignment-3bec1eb1.png)

Alignment and padding can be configured to create unique layouts:

1. Left and right alignment
2. Center-aligned, 8dp padding between items

### Floating toolbar

![Diagram noting margin around edge of floating toolbar.](../../assets/toolbars/specs/10-diagram-noting-margin-around-edge-of-floating-toolbar-915e21fa.png)

Default padding of floating toolbar

![Diagram noting layout measurements.](../../assets/toolbars/specs/11-diagram-noting-layout-measurements-e8bcfee3.png)

Floating toolbar size and padding measurements

![Diagram noting layout margins.](../../assets/toolbars/specs/12-diagram-noting-layout-margins-b21abbf5.png)

Floating toolbar margins

* * *

## Bottom app bar (baseline)

![Diagram of bottom app bar indicating the container.](../../assets/toolbars/specs/13-diagram-of-bottom-app-bar-indicating-the-container-1e2381bd.png)

1. Container

### Tokens & specs

Bottom app bar tokens are in one token set. Bottom app bar (baseline)

Token

Value

Enabled

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![Diagram of bottom app bar indicating its color mappings.](../../assets/toolbars/specs/14-diagram-of-bottom-app-bar-indicating-its-color-mappings-24d0942b.png)

Bottom app bar color role used for light and dark themes:

1. Surface container

### Measurements

![Diagram showing layout values and paddings for bottom app bar.](../../assets/toolbars/specs/15-diagram-showing-layout-values-and-paddings-for-bottom-app-ba-142c809a.png)

Bottom app bar padding and size measurements

### Common layouts

![Side by side view of bottom app bars in different configurations.](../../assets/toolbars/specs/16-side-by-side-view-of-bottom-app-bars-in-different-configurat-27f86c80.png)

1. Icon buttons and FAB
2. Icon buttons and no FAB

