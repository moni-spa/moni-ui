---
component: Switch
slug: switch
section: overview
category: All other components
source: "https://m3.material.io/components/switch/overview"
scraped_at: "2026-06-20T07:00:17.729Z"
tokens_count: 1
images_count: 3
---
# Switch

Switches toggle the selection of an item on and off

- Use switches (not radio buttons [More on radio buttons](/m3/pages/radio-button/overview)) if the items in a list [More on lists](/m3/pages/lists/overview) can be independently controlled
- Switches are the best way to let people adjust settings
- Make sure the switch’s selection [More on selection](/m3/pages/selection) (on or off) is visible at a glance

![A switch in two states, off and on.](../../assets/switch/overview/01-a-switch-in-two-states-off-and-on-9b2a1a84.png)

Switches can be toggled on and off

## Availability & resources

| Type | Resource | Status |
| --- | --- | --- |
| Design | [Design Kit (Figma)](https://www.figma.com/community/file/1035203688168086460) | Available |
| Implementation | [](https://api.flutter.dev/flutter/material/ThemeData/useMaterial3.html) | Available |
| Implementation | [Jetpack Compose](https://developer.android.com/develop/ui/compose/components/switch) | Available |
| Implementation | [](https://github.com/material-components/material-components-android/blob/master/docs/components/Switch.md) | Available |
| Implementation | [](https://github.com/material-components/material-web/blob/main/docs/components/switch.md) | Available |

## Differences from M2

- Accessibility: Visual presentation is more accessible
- Color: New color mappings meet Material's non-text-contrast requirements in addition to compatibility with dynamic color [More on dynamic color](/m3/pages/dynamic/choosing-a-source)
- Icons: Ability to have an optional icon within the switch handle
- Layout: Track is taller and wider

![M2 switches in off and on states.](../../assets/switch/overview/02-m2-switches-in-off-and-on-states-7a5937df.png)

M2: Switches have a circular handle that extends beyond the edge of the track

![M3 switch shown toggled off and toggled on. When switched on, it has a checkmark icon.](../../assets/switch/overview/03-m3-switch-shown-toggled-off-and-toggled-on-when-switched-on--89568176.png)

M3: Switches have a taller and wider track, new color mappings, and the ability to show an icon in the handle

