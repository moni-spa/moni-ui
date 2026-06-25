---
component: Extended FABs
slug: extended-fab
section: accessibility
category: Buttons
source: "https://m3.material.io/components/extended-fab/accessibility"
scraped_at: "2026-06-20T06:57:22.132Z"
tokens_count: 1
images_count: 6
---
# Extended FABs

Extended floating action buttons (extended FABs) help people take primary actions

## Use cases

People should be able to do the following using assistive technology:

- Navigate to and activate the extended FAB

## Interaction & style

To make it easier for users of screen readers to reach a primary action such as an extended FAB, consider placing the action in the upper left region of large web screens, like in an expanded navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview). In smaller windows, the best place for the extended FAB is the lower right corner of a screen.

![On a large screen, the Compose FAB is placed on the upper left region in an email app with the expanded window on the right.](../../assets/extended-fab/accessibility/01-on-a-large-screen-the-compose-fab-is-placed-on-the-upper-lef-540813e9.png)

Extended FABs can be placed in the expanded navigation rail

![In a compact window, the Compose FAB is placed on the lower right region in an email app.](../../assets/extended-fab/accessibility/02-in-a-compact-window-the-compose-fab-is-placed-on-the-lower-r-b9597ce3.png)

check Do

Place extended FABs in an easy-to-reach place that doesn’t obstruct other actions

![In a compact window, the Compose FAB is overlapping other buttons in an email app.](../../assets/extended-fab/accessibility/03-in-a-compact-window-the-compose-fab-is-overlapping-other-but-d801059e.png)

close Don’t

Don’t place extended FABs over another actionable element

## Initial focus

Ensure the extended FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech. On mobile, the focus order may start with the app bar [More on app bars](/m3/pages/app-bars/overview), move to the navigation bar [More on navigation bars](/m3/pages/navigation-bar/overview), and then skip past any other content on the page to land on the extended FAB. When using an extended FAB, both the visible label and icon should be treated as one focusable element. The extended FAB doesn’t need a tooltip because it already has a visible label.

![A focused extended FAB in the lower right region of a mobile screen.](../../assets/extended-fab/accessibility/04-a-focused-extended-fab-in-the-lower-right-region-of-a-mobile-2ab82618.png)

check Do

Ensure extended FABs get focus when navigating with assistive technology

![A focused extended FAB with a tooltip matching the text label.](../../assets/extended-fab/accessibility/05-a-focused-extended-fab-with-a-tooltip-matching-the-text-labe-f9e3d658.png)

close Don’t

Tooltips aren’t required since the extended FAB has label text

## Keyboard navigation

|
Keys

 |

Actions

 |
| --- | --- |
| **Tab** | Moves focus to the extended FAB |
| **Space** or **Enter**
 | Activates the extended FAB |

## Labeling elements

To ensure the action is clear, use consistent icons and text labels, such as a **Compos****e** icon with a text label. The icon and text label combination should have one distinct purpose. The accessibility label must include the same first word as the visible label. For example, if the visible button is **Create**, then the accessibility label might say **Create a new invite**. 

![Accessibility labels of an extended FAB.](../../assets/extended-fab/accessibility/06-accessibility-labels-of-an-extended-fab-c9582da5.png)

The accessibility label reads to match the extended FAB's displayed label

