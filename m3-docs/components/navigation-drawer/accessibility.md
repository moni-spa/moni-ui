---
component: Navigation drawer
slug: navigation-drawer
section: accessibility
category: Navigation
source: "https://m3.material.io/components/navigation-drawer/accessibility"
scraped_at: "2026-06-20T06:58:48.325Z"
tokens_count: 1
images_count: 8
---
# Navigation drawer

Navigation drawers let people switch between UI views on larger devices

star

Note:

The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated, use an [expanded navigation rail](/m3/pages/navigation-rail/overview/), which has mostly the same functionality of the navigation drawer and adapts better across window size classes.

## Use cases

Users should be able to: 

- Move between navigation destinations with assistive technology
- Select a particular navigation destination from a set
- Get appropriate feedback based on input [More on inputs](/m3/pages/inputs) type

## Interaction & style

**Touch**

- When a navigation item is tapped, the active indicator appears in place, providing feedback to the user that it is selected
- A touch ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker

Touch: Tap

**Cursor**

- When hovered, the hover [More on hover state](/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844) indicator appears providing a visual cue that the destination is interactive
- When clicked, a ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker in light theme and lighter in dark theme, to increase the contrast

Cursor: Hover, Click

## Initial focus

Initial focus lands directly on the first navigation item, since that is the first interactive element of the component.

![1\. Tab lands on the first navigation item, Inbox. 2. Down arrow to get to the second navigation item, Outbox.](../../assets/navigation-drawer/accessibility/01-1-tab-lands-on-the-first-navigation-item-inbox-2-down-arrow--e7cc3b36.png)

Focus lands on first navigation item

## Closing

The modal navigation drawer can be dismissed by selecting the scrim that covers the rest of the screen.

![A navigation drawer with a scrim covering the body content. A touch target is selecting the scrim.](../../assets/navigation-drawer/accessibility/02-a-navigation-drawer-with-a-scrim-covering-the-body-content-a-8d0e9564.png)

Select the scrim to close the navigation drawer

## Visual indicators

Icons are the primary focus of the navigation and such give the dominant cue of its state [More on states](/m3/pages/interaction-states/overview). Use a filled icon for the selected destination to differentiate from the outlined icons of non-selected destinations.

![Space + enter is used to select the navigation item inbox.](../../assets/navigation-drawer/accessibility/03-space-enter-is-used-to-select-the-navigation-item-inbox-3562c8d9.png)

The navigation item is selected via **Space**/**Enter**

![A navigation drawer with the home destination using a filled icon.](../../assets/navigation-drawer/accessibility/04-a-navigation-drawer-with-the-home-destination-using-a-filled-afdd7e5c.png)

check Do

Use a filled icon for the selected navigation destination to differentiate from the other destinations

![A navigation drawer with the home destination using an outlined icon.](../../assets/navigation-drawer/accessibility/05-a-navigation-drawer-with-the-home-destination-using-an-outli-c07c626a.png)

close Don’t

Avoid keeping the icon style for the selected navigation destination the same as unselected destination's icons. This removes an important visual indicator of which destination is active.

![A selected home icon using a filled icon and active indicator and a unselected home icon using an outlined icon.](../../assets/navigation-drawer/accessibility/06-a-selected-home-icon-using-a-filled-icon-and-active-indicato-00947c86.png)

When selected, the icon fills, darkens in light theme (or lightens in dark theme), and is backed by an active indicator shape

## Keyboard navigation

| **Keys** | **Actions** |
| --- | --- |
| Tab | Focus lands on the first navigation destination  |
| Space or Enter | Selects the focused [More on focused state](/m3/pages/interaction-states/applying-states#bfc1624f-6bcc-4306-b0c1-425e2d8a1bf9) navigation destination, and focus moves to the newly opened section (if applicable) |
| Arrow | Navigate between destinations within the navigation drawer |

## Labeling elements

The accessibility [More on accessibility](/m3/pages/overview/principles) label for a navigation item is typically the same as the destination name. If the UI text is correctly linked, assistive tech (such as a screenreader) will read the UI text followed by the component’s role. For Android Views (MDC-Android), a more descriptive accessibility label is not available to be set and the role is not announced.

![A navigation drawer item’s label text and accessibility label both read “photos.” The role is “tab.”](../../assets/navigation-drawer/accessibility/07-a-navigation-drawer-item-s-label-text-and-accessibility-labe-9b8f3651.png)

A navigation drawer’s accessibility label can incorporate its adjacent UI text

When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled **Recents** would benefit from additional information in its accessibility label to clarify the destination’s intent.

![A navigation drawer item’s label text is “recents”, the accessibility label is “recent images.” The role is “tab.”](../../assets/navigation-drawer/accessibility/08-a-navigation-drawer-item-s-label-text-is-recents-the-accessi-7b1a429f.png)

While the visible label text reads **Recents,** the accessibility label for this destination clarifies its function: **Recent images**

