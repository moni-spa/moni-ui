---
component: Progress indicators
slug: progress-indicators
section: specs
category: Loading & progress
source: "https://m3.material.io/components/progress-indicators/specs"
scraped_at: "2026-06-20T06:59:08.869Z"
tokens_count: 4
images_count: 9
---
# Progress indicators

Progress indicators show the status of a process in real time

## Variants

![2 variant of progress indicators.](../../assets/progress-indicators/specs/01-2-variant-of-progress-indicators-d85b3821.png)

1. Linear progress indicator
2. Circular progress indicator

|
Variant

 |

M3

 |

M3 Expressive

 |
| --- | --- | --- |
|

Linear progress indicator

 |

Available

 |

Available

 |
|

Circular progress indicator

 |

Available

 |

Available

 |

## Configurations

![4 configurations of the linear determinate progress indicator.](../../assets/progress-indicators/specs/02-4-configurations-of-the-linear-determinate-progress-indicato-ea2c90da.png)

1. Behavior: Determinate and indeterminate
2. Thickness: Default (4dp) and variable
3. Shape: Flat and wavy

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

Behavior

 |

Determinate (default), Indeterminate

 |

Available

 |

Available

 |
|

Track thickness

 |

Fixed (4dp) 

 |

Available

 |

Available

 |
|

Configurable

 |

\--

 |

Available

 |
|

Shape

 |

Flat (default)

 |

Available

 |

Available

 |
|

Wavy

 |

\--

 |

Available

 |

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. [View baseline tokens](/m3/pages/progress-indicators/specs#c6f484b0-2bc6-4d37-bd75-f859a35a3594)

```
Progress Indicator - Common
```

```
Progress Indicator - Common
```

```
Progress Indicator - Common
```

```
Progress Indicator - Common
```

Progress Indicator - Common

Token

Default, Light

Color

Shape

\[Deprecated\] Enabled

## Anatomy

![3 elements of a progress indicator.](../../assets/progress-indicators/specs/03-3-elements-of-a-progress-indicator-0727c5bd.png)

1. Active indicator
2. Track
3. Stop indicator

## Color

![2 color roles of a linear progress indicator in light and dark themes: the active indicator and stop indicator are primary and the track is secondary container.](../../assets/progress-indicators/specs/04-2-color-roles-of-a-linear-progress-indicator-in-light-and-da-1967b545.png)

Progress indicator color roles used for light and dark schemes:

1. Primary
2. Secondary container

## Measurements

Wavy indicators use **amplitude** and **wavelength** to determine the shape of the wave. The height is the overall container height.

![Definitions of wave measurements for height and amplitude.](../../assets/progress-indicators/specs/05-definitions-of-wave-measurements-for-height-and-amplitude-1a48dcab.png)

**Amplitude** measures from the center of the resting position to the center of the peak

![Definitions of wave measurements for wavelength.](../../assets/progress-indicators/specs/06-definitions-of-wave-measurements-for-wavelength-d64525d8.png)

**Wavelength** measures the distance between two adjacent peaks

![Linear progress indicator measurements.](../../assets/progress-indicators/specs/07-linear-progress-indicator-measurements-f2cd0edf.png)

Size measurements for linear progress indicators. The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases. 

![Circular progress indicator measurements.](../../assets/progress-indicators/specs/08-circular-progress-indicator-measurements-e5b334be.png)

Size measurements for circular progress indicators. The thicker variants are provided as sample measurement for makers to adjust the default version based on their use cases. 

![4dp padding on the left and right of the linear progress indicator.](../../assets/progress-indicators/specs/09-4dp-padding-on-the-left-and-right-of-the-linear-progress-ind-a3ed13ae.png)

The linear progress indicator is inset from the edge of the screen by 4dp

## Baseline tokens

The circular and linear progress indicator had separate token sets. These are no longer recommended.

\[Deprecated\] Progress indicator - Circular

Token

Default, Light

\[Deprecated\] Enabled

