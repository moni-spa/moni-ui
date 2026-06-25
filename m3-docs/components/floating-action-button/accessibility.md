---
component: Floating action buttons (FABs)
slug: floating-action-button
section: accessibility
category: Buttons
source: "https://m3.material.io/components/floating-action-button/accessibility"
scraped_at: "2026-06-20T06:57:42.047Z"
tokens_count: 0
images_count: 8
---
# Floating action buttons (FABs)

Floating action buttons (FABs) help people take primary actions

## Use cases

People should be able to do the following using assistive technology:

- Navigate to and activate the FAB
- Perform an action with the FAB
- Expand and minimize an extended FAB [More on extended FABs](/m3/pages/extended-fab/overview)

## Interaction & style

Don't disable the FAB. If the action represented in the FAB is unavailable, the FAB shouldn't appear. Ensure the icon has a minimum 3:1 contrast ratio with the container.

![FAB with highly contrasting bright container and dark icon.](../../assets/floating-action-button/accessibility/01-fab-with-highly-contrasting-bright-container-and-dark-icon-cf933251.png)

check Do

FAB icons are above the 3:1 contrast ratio

![FAB with low-contrasting dark container and dark icon.](../../assets/floating-action-button/accessibility/02-fab-with-low-contrasting-dark-container-and-dark-icon-9577aecf.png)

close Don’t

Avoid using colors with a contrast below 3:1

## Focus

Ensure the FAB is prioritized in the overall focus order to create an efficient experience for people who navigate UIs with assistive tech. On mobile, the focus order may start with the app bar [More on app bars](/m3/pages/app-bars/overview), move to the navigation bar [More on navigation bars](/m3/pages/navigation-bar/overview), and then skip past any other content on the page to land on the FAB. Consider displaying a tooltip when the FAB is focused. This is supported on web.

![A focused FAB with a tooltip saying “Compose” appearing below it.](../../assets/floating-action-button/accessibility/03-a-focused-fab-with-a-tooltip-saying-compose-appearing-below--72f2407f.png)

Tooltips surface the FAB’s label when focused

## Layout & position

To make it easier for users of screen readers to reach a primary action such as a FAB on expanded window sizes [More on expanded window size class](/m3/pages/applying-layout/expanded), consider placing the FAB in the upper left region. However, it’s critical to test placement options with users to see if the upper left region is the best position in all browser windows. For compact [More on compact window size class](/m3/pages/applying-layout/compact) and medium window sizes [More on medium window size class](/m3/pages/applying-layout/medium), the best place for the FAB is the lower right corner of a screen.

![FAB in the lower right region of a small screen.](../../assets/floating-action-button/accessibility/04-fab-in-the-lower-right-region-of-a-small-screen-6950e53a.png)

In compact windows, place the FAB in the bottom trailing edge

![FAB in the upper left region of a large screen.](../../assets/floating-action-button/accessibility/05-fab-in-the-upper-left-region-of-a-large-screen-9a6f4197.png)

In expanded windows, place the FAB in the navigation rail

To ensure accessibility for keyboard users on the web, avoid positioning the FAB in a way that completely obscures the focus indicator of an actionable element. It’s okay to partially cover the desired element, as long as the focus indicators are still visible.

![FAB in the lower right region doesn’t obscure the focus indicator of an actionable icon.](../../assets/floating-action-button/accessibility/06-fab-in-the-lower-right-region-doesn-t-obscure-the-focus-indi-afce68b5.png)

check Do

The FAB can partially cover an actionable element, as long as the focus indicator is still clearly visible

![FAB in the lower right region obscures an actionable icon and its focus indicator.](../../assets/floating-action-button/accessibility/07-fab-in-the-lower-right-region-obscures-an-actionable-icon-an-5979e584.png)

close Don’t

Don’t completely obscure an actionable element and its focus indicator

## Keyboard navigation

|
**Keys**

 |

**Actions**

 |
| --- | --- |
|

**Tab**

 |

Focus lands on the FAB

 |
|

**Space** or **Enter**

 |

Perform the default action on an item

 |

## Labeling elements

The accessibility label should describe the action that the button is performing, such as .

![Accessibility label and accessibility role of a FAB.](../../assets/floating-action-button/accessibility/08-accessibility-label-and-accessibility-role-of-a-fab-e418357c.png)

The accessibility label of the FAB with a pencil icon describes the action of composing a new message

