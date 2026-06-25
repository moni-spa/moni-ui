---
component: Progress indicators
slug: progress-indicators
section: overview
category: Loading & progress
source: "https://m3.material.io/components/progress-indicators/overview"
scraped_at: "2026-06-20T06:58:59.855Z"
tokens_count: 1
images_count: 4
---
# Progress indicators

Progress indicators show the status of a process in real time

- Two variants: linear and circular
- Use the same configuration for all instances of a process (like loading)
- They capture attention through motion
- Option to apply a wave to the active track for use cases that would benefit from increased expressiveness

![8 progress indicators configured to show different thickness and shape.](../../assets/progress-indicators/overview/01-8-progress-indicators-configured-to-show-different-thickness-9a8377de.png)

Linear and circular progress indicators have visual configurations for shape and thickness

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/ThemeData/useMaterial3.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/progress) | Available |
| Implementation | [Jetpack Compose: Expressive](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#LinearWavyProgressIndicator\(androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.drawscope.Stroke,androidx.compose.ui.graphics.drawscope.Stroke,androidx.compose.ui.unit.Dp,kotlin.Float,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp\)) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/ProgressIndicator.md) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/ProgressIndicator.md) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/progress.md) | Available |

## M3 Expressive update

**Aug 2024**

The progress indicators have configurations for height and wavy shape. Choose the visual style that best fits your product. [More on M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)

- Track height: Configurable
- Shape: Wavy

Progress indicators have a new rounded, colorful style, and more configurations to choose from, including a wavy shape and variable track height

## Previous updates

**Dec 2023: Non-text contrast (NTC)**

- Anatomy: Added an end stop indicator to improve accessibility
- Contrast: Higher contrast between track and active indicator to enhance the perception of progress
- Motion: New motion behavior
- Shape: Rounded corners

![GM3 linear and circular progress indicators](../../assets/progress-indicators/overview/02-gm3-linear-and-circular-progress-indicators-dd822f0d.png)

Progress indicators have a new rounded, colorful style

## Differences from M2

**July 2022: Added to Material 3**

- **Color:** New color mappings and compatibility with dynamic color

![M2 linear and circular progress indicators.](../../assets/progress-indicators/overview/03-m2-linear-and-circular-progress-indicators-4a3c1fc4.png)

M2: Progress indicators have a boxier, neutral style

![M3 linear and circular progress indicators.](../../assets/progress-indicators/overview/04-m3-linear-and-circular-progress-indicators-dd08069a.png)

M3: Progress indicators are compatible with dynamic color

