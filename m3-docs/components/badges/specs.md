---
component: Badges
slug: badges
section: specs
category: All other components
source: "https://m3.material.io/components/badges/specs"
scraped_at: "2026-06-20T06:55:27.058Z"
tokens_count: 0
images_count: 7
---
# Badges

Badges show notifications, counts, or status information on navigation items and icons

![5 aspects of badge anatomy on a navigation bar.](../../assets/badges/specs/01-5-aspects-of-badge-anatomy-on-a-navigation-bar-1b1209ca.png)

Navigation bar

1. Small badge
2. Large badge container
3. Large badge label
4. Large badge maximum character count container
5. Large badge maximum character count label

![5 aspects of badge anatomy on a navigation rail.](../../assets/badges/specs/02-5-aspects-of-badge-anatomy-on-a-navigation-rail-0e80ce1d.png)

Navigation rail

1. Small badge
2. Large badge container
3. Large badge label
4. Large badge maximum character count container
5. Large badge maximum character count label

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. Badges

Token

Default, Light

Enabled

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview)

![5 applications of badge color on light and dark theme navigation bars.](../../assets/badges/specs/03-5-applications-of-badge-color-on-light-and-dark-theme-naviga-ee3bf18e.png)

Badge color roles used for light and dark schemes in navigation bar:

1. Error
2. Error
3. On error
4. On error
5. Error

![5 applications of badge color on light and dark theme navigation rails.](../../assets/badges/specs/04-5-applications-of-badge-color-on-light-and-dark-theme-naviga-18d568b1.png)

Badge color roles used for light and dark schemes in navigation rail:

1. Error
2. On error
3. Error
4. On error
5. Error

## Measurements

![Annotation of badge sizes, padding, and measurements from the corner of the icon to the badge opposite corner.](../../assets/badges/specs/05-annotation-of-badge-sizes-padding-and-measurements-from-the--4784cddb.png)

Badge padding and size measurements

|
Attribute

 |

Value

 |
| --- | --- |
|

Small badge shape

 |

3dp corner radius

 |
|

Small badge size (HxW)

 |

6dp

 |
|

Large badge shape

 |

8dp corner radius

 |
|

Large badge one digit size (HxW)

 |

16dp

 |
|

Large badge max character count size (HxW)

 |

16x34dp

 |
|

Small badge: distance from top trailing icon corner to bottom leading badge corner (HxW)

 |

6x6dp

 |
|

Large badge: distance from top trailing icon corner to bottom leading badge corner (HxW)

 |

14x12dp

 |
|

Large badge padding between badge and text container

 |

4dp

 |

## Configuration

Different badges are shown on navigation destinations in various states. [More on states](/m3/pages/interaction-states/overview)

![Diagram of 3 badge variations shown on navigation destinations in various states.](../../assets/badges/specs/06-diagram-of-3-badge-variations-shown-on-navigation-destinatio-e60a055a.png)![Diagram of 3 badge variations shown on navigation destinations in various states.](../../assets/badges/specs/07-diagram-of-3-badge-variations-shown-on-navigation-destinatio-bc5649c6.png)

1. Inactive with label - small badge
2. Inactive with label - large badge
3. Inactive with label - large badge max character count
4. Inactive - small badge
5. Inactive - large badge
6. Inactive - large badge max character count
7. Active with label - small badge
8. Active with label - large badge
9. Active with label - large badge max character count
10. Active nav bar no label - small badge
11. Active nav bar no label - large badge
12. Active nav bar no label - large badge max character count
13. Active nav rail no label - small badge
14. Active nav rail no label - large badge
15. Active nav rail no label - large badge max character count

