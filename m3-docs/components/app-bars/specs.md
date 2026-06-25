---
component: App bars
slug: app-bars
section: specs
category: All other components
source: "https://m3.material.io/components/app-bars/specs"
scraped_at: "2026-06-20T06:55:16.998Z"
tokens_count: 18
images_count: 22
---
# App bars

App bars are placed at the top of the screen to help people navigate through a product.

## Variants

![4 variants of app bars.](../../assets/app-bars/specs/01-4-variants-of-app-bars-1eee45ac.png)

1. Search app bar
2. Small
3. Medium flexible
4. Large flexible

### Baseline variants

The baseline M3 **medium** and **large** app bars are no longer recommended in M3 Expressive, and should be replaced with **medium flexible** and **large flexible** app bars, which are similar visually, but have multi-line support, a shorter height, and can contain a wide variety of elements, like images. [Jump to baseline app bar specs](/m3/pages/app-bars/specs#faec9baf-140f-41dc-8b88-2792e90d9d5d)

![2 baseline app bar variants, medium and large.](../../assets/app-bars/specs/02-2-baseline-app-bar-variants-medium-and-large-f9a80e19.png)

Baseline variants

1. Medium
2. Large

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

Search app bar

 |

\--

 |

Available

 |
|

Small

 |

Available

 |

Available

 |
|

Center-aligned

 |

Available

 |

Merged into **small**. Use centered-text configuration.

 |
|

Medium (baseline)

 |

Available

 |

Not recommended. Use **medium flexible**

 |
|

Medium flexible

 |

\--

 |

Available

 |
|

Large (baseline)

 |

Available

 |

Not recommended. Use **large flexible**

 |
|

Large flexible

 |

\--

 |

Available

 |

## Configurations

### Text alignment

![4 variants of app bars with different left and center aligned text headlines.](../../assets/app-bars/specs/03-4-variants-of-app-bars-with-different-left-and-center-aligne-e571beb9.png)![4 variants of app bars with different left and center aligned text headlines.](../../assets/app-bars/specs/04-4-variants-of-app-bars-with-different-left-and-center-aligne-0d4b6efd.png)

Text labels, including supporting text, can be aligned to the leading edge or centered

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

Text alignment

 |

Leading edge (default)

 |

Available

 |

Available

 |
|

Centered

 |

\--

 |

Available

 |

## Tokens & specs

Select a token set to view in the table's menu. App bar token sets are organized into a common token set, and size-specific tokens. [Learn about design tokens](/m3/pages/design-tokens/overview)

```
App bar - CommonTokenValueColorSpacingShapeSize
```

```
App bar - CommonTokenValueColorSpacingShapeSize
```

```
App bar - CommonTokenValueColorSpacingShapeSize
```

```
App bar - Common
```

```
App bar - Common
```

```
App bar - Common
```

```
App bar - Common
```

App bar - Common

Token

Value

Color

Spacing

Shape

Size

### Search component tokens & specs

The default Search lets people enter a keyword or phrase to get relevant information. More on search [More on search](/m3/pages/search/overview) component tokens are used in the search app bar.

```
Search - View
```

```
Search - View
```

```
Search - View
```

```
Search - View
```

Search - View

Token

Default, Light

Search view container surface tint layer color

md.comp.search-view.container.surface-tint-layer.color

#6750A4

Color

Layout and Text

## Anatomy

![5 elements of the component.](../../assets/app-bars/specs/05-5-elements-of-the-component-1ca96375.png)

1. Container
2. Leading button
3. Trailing elements
4. Headline
5. Subtitle

App bars can be customized to include:

- An image or logo
- A subtitle
- A filled icon button

Avoid customizing the size of the heading and subtitle, or adding too many actions. 

![3 app bars: 1 with a newspaper logo, 1 with a subtitle, and 1 with a filled icon button.](../../assets/app-bars/specs/06-3-app-bars-1-with-a-newspaper-logo-1-with-a-subtitle-and-1-w-644d8e0e.png)

The app bar can have different layouts depending on which elements are shown

### Search

The search app bar can include trailing actions inside and outside the search bar. When the search bar is selected, it should open the search view [More on search view](/m3/pages/search/overview) component.

![5 elements of the search app bar.](../../assets/app-bars/specs/07-5-elements-of-the-search-app-bar-ac6c7792.png)

1. Container
2. Leading icon button
3. Hinted search text
4. Trailing icon or avatar
5. Search container

![3 layouts of icons in the search app bar.](../../assets/app-bars/specs/08-3-layouts-of-icons-in-the-search-app-bar-b5fa0f8a.png)

1. A leading element and a trailing element outside search
2. A leading element, a trailing element inside search, and a trailing element outside search
3. A leading element and two trailing elements outside search

### Image 

An image can be placed in the app bar. In small app bars, this can replace the label text.

![Graphic replacing text headline content.](../../assets/app-bars/specs/09-graphic-replacing-text-headline-content-e705a9c7.png)

Images can be added to app bars and can replace label text on small app bars

### Filled trailing icon button

The app bar's trailing icon buttons can be replaced with a single, primary, or tonal filled icon button in default or wide sizes. 

![App bars configured with filled trailing icons.](../../assets/app-bars/specs/10-app-bars-configured-with-filled-trailing-icons-92ca81d6.png)

The trailing icons can be configured to be a single filled icon button

### Subtitle

![App bars configured with subtitles below their headlines.](../../assets/app-bars/specs/11-app-bars-configured-with-subtitles-below-their-headlines-a9802435.png)

The medium flexible and large flexible app bars hug the text contents, so they are taller when a subtitle is visible

1. Small
2. Small with subtitle
3. Medium flexible
4. Medium flexible with subtitle
5. Large flexible
6. Large flexible with subtitle

## Color

Color values are implemented through design tokens. For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

All app bars share the same color roles. On scroll, the container changes color to **surface container**.

![4 color roles of the leading edge app bar in light and dark scheme.](../../assets/app-bars/specs/12-4-color-roles-of-the-leading-edge-app-bar-in-light-and-dark--b92249b3.png)

App bar color roles used for light and dark themes:

1. Surface
2. On surface
3. On surface variant
4. On surface
5. On surface variant
6. Surface container (on scroll)

![4 color roles of the center-aligned app bar in light and dark scheme.](../../assets/app-bars/specs/13-4-color-roles-of-the-center-aligned-app-bar-in-light-and-dar-70181fbd.png)

Search app bar color roles used for light and dark themes:

1. Surface
2. On surface variant
3. On surface variant
4. On surface variant
5. Surface container
6. Surface container
7. Surface container highest

### Scroll states

![Color roles for app bars when flat and on scroll.](../../assets/app-bars/specs/14-color-roles-for-app-bars-when-flat-and-on-scroll-26b2f8c0.png)

The app bar changes color when flat or on scroll. The search bar can also change color on scroll.

1. Flat
2. On scroll

## Measurements

### Search app bar

![Search app bar size and padding measurements.](https://lh3.googleusercontent.com/GLzA-Bs2FesMv8_iNKDnGK-rmtF4_QBlkamCvjO3g0PR4Ohvu51Whqg_8UDbMF2Be0V0fNt2yy_YIYhbkBa3RaH32GCEcE7CYs7Qk7aJDWg=s0)

Search app bar padding and size measurements

### Small app bar

![Small app bar size and padding measurements.](../../assets/app-bars/specs/16-small-app-bar-size-and-padding-measurements-393956f9.png)

Small app bar padding and size measurements

### Medium flexible app bar

![Medium flexible app bar padding and size measurements.](../../assets/app-bars/specs/17-medium-flexible-app-bar-padding-and-size-measurements-3f754754.png)

Medium flexible app bar padding and size measurements

### Large flexible app bar

![Large flexible app bar padding and size measurements](../../assets/app-bars/specs/18-large-flexible-app-bar-padding-and-size-measurements-fa4995c2.png)

Large flexible app bar padding and size measurements

* * *

## Baseline app bars

The **medium** and **large** app bars are no longer recommended in M3 Expressive. Use the **medium flexible** and **large flexible** app bars in their place.

![4 elements of medium and large app bars.](../../assets/app-bars/specs/19-4-elements-of-medium-and-large-app-bars-ad69b3db.png)

Medium and large app bars have the same elements:

1. Container
2. Leading button
3. Trailing icons
4. Headline

### Tokens & specs

Select a token set to view in the table's menu. Baseline app bar token sets are organized into medium, large, and older baseline token sets. [Learn about design tokens](/m3/pages/design-tokens/overview)

```
App bar - Size - Medium (baseline)TokenValueApp bar medium container heightmd.comp.app-bar.medium.container.height112dpApp bar medium title fontmd.comp.app-bar.medium.title.fontAaApp bar medium icon button sizemd.comp.app-bar.medium.icon.size24dpApp bar medium subtitle fontmd.comp.app-bar.medium.subtitle.fontAa
```

```
App bar - Size - Medium (baseline)TokenValueApp bar medium container heightmd.comp.app-bar.medium.container.height112dpApp bar medium title fontmd.comp.app-bar.medium.title.fontAaApp bar medium icon button sizemd.comp.app-bar.medium.icon.size24dpApp bar medium subtitle fontmd.comp.app-bar.medium.subtitle.fontAa
```

```
App bar - Size - Medium (baseline)TokenValueApp bar medium container heightmd.comp.app-bar.medium.container.height112dpApp bar medium title fontmd.comp.app-bar.medium.title.fontAaApp bar medium icon button sizemd.comp.app-bar.medium.icon.size24dpApp bar medium subtitle fontmd.comp.app-bar.medium.subtitle.fontAa
```

```
App bar - Size - Medium (baseline)
```

```
App bar - Size - Medium (baseline)
```

```
App bar - Size - Medium (baseline)
```

```
App bar - Size - Medium (baseline)
```

App bar - Size - Medium (baseline)

Token

Value

App bar medium container height

md.comp.app-bar.medium.container.height

112dp

App bar medium title font

md.comp.app-bar.medium.title.font

Aa

App bar medium icon button size

md.comp.app-bar.medium.icon.size

24dp

App bar medium subtitle font

md.comp.app-bar.medium.subtitle.font

Aa

### Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![4 color roles of the medium top app bar in light and dark scheme.](../../assets/app-bars/specs/20-4-color-roles-of-the-medium-top-app-bar-in-light-and-dark-sc-69a18e3d.png)

Medium top app bar color roles used for light and dark schemes:

1. Surface
2. On surface
3. On surface
4. On surface variant

### Measurements

#### Medium app bar

![Diagram of medium app bar padding and size measurements.](../../assets/app-bars/specs/21-diagram-of-medium-app-bar-padding-and-size-measurements-1418b34b.png)

Medium app bar padding and size measurements

#### Large app bar

![Diagram of large app bar padding and size measurements.](../../assets/app-bars/specs/22-diagram-of-large-app-bar-padding-and-size-measurements-86e28962.png)

Large app bar padding and size measurements

