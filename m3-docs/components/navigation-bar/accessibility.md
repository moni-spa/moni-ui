---
component: Navigation bar
slug: navigation-bar
section: accessibility
category: Navigation
source: "https://m3.material.io/components/navigation-bar/accessibility"
scraped_at: "2026-06-20T06:58:38.497Z"
tokens_count: 0
images_count: 9
---
# Navigation bar

Navigation bars let people switch between UI views on smaller devices

## Use cases

People should be able to do the following using the assistive technology:

- Move between navigation destinations
- Select a particular navigation destination from a set
- Get appropriate feedback based on input type

## Interaction & style

**Touch**

- When a navigation item is tapped, the active indicator appears in place, providing feedback that it’s selected
- A touch ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color

Touch: Tap

**Cursor**

- When hovered, the active indicator appears in a reduced state providing a visual cue that the destination is interactive
- When clicked (in both active and inactive states), a ripple passes through the indicator
- The icon switches from outlined to filled
- The icon changes color, becoming darker

Cursor: Hover, Click

### Text scaling and truncation

When someone sets their device to show a larger text size, the navigation bar should grow vertically to accommodate larger labels while retaining the default padding. It’s okay for scaled text to wrap in navigation items. To remain accessible, ensure the full label is always visible on-screen at up to 2x text sizing. Beyond this size, text can truncate. 

![Nav bar with text scaled to 1.5x size. Some labels are on two lines, others are on one line.](../../assets/navigation-bar/accessibility/01-nav-bar-with-text-scaled-to-1-5x-size-some-labels-are-on-two-701b0032.png)

Text scaled to 1.5 size

![Nav bar with text scaled to 2x size. Some labels wrap to two lines.](../../assets/navigation-bar/accessibility/02-nav-bar-with-text-scaled-to-2x-size-some-labels-wrap-to-two--3b960447.png)

Text scaled to 2x size

## Initial focus

Initial focus lands directly on the first navigation item, since that is the first interactive element of the component.

![Focus order and keyboard navigation of a nav bar.](../../assets/navigation-bar/accessibility/03-focus-order-and-keyboard-navigation-of-a-nav-bar-332ffb19.png)

Focus lands on first navigation item

![Activating a nav item with space on a keyboard.](../../assets/navigation-bar/accessibility/04-activating-a-nav-item-with-space-on-a-keyboard-58c9fec1.png)

The navigation item is selected with Space/Enter

## Visual indicators

Use a filled icon with a bold label for selected destinations. For unselected destinations use an outlined icon with a medium label. If an icon doesn’t have a filled style, use a thicker or heavier version of the icon instead.

![A nav bar with a filled icon for the selected nav item.](../../assets/navigation-bar/accessibility/05-a-nav-bar-with-a-filled-icon-for-the-selected-nav-item-555ed868.png)

check Do

Use a filled icon for the selected navigation destination to differentiate from the other destinations

![A nav bar with an outlined icon for the selected nav item.](../../assets/navigation-bar/accessibility/06-a-nav-bar-with-an-outlined-icon-for-the-selected-nav-item-50034f48.png)

close Don’t

Don’t use outlined icons on selected nav items

![2 nav items, one selected, one unselected.](../../assets/navigation-bar/accessibility/07-2-nav-items-one-selected-one-unselected-ae1ef9f5.png)

When selected, the icon fills, darkens, and is backed by an active indicator shape

## Keyboard navigation

<table style="width:100%"><tbody><tr><th>Keys</th><td>Actions</td></tr><tr><th>Tab</th><td><span style="white-space:pre-wrap" id="isPasted">Move between navigation items</span></td></tr><tr><th>Space / Enter</th><td><span style="white-space:pre-wrap" id="isPasted">Selects the focused navigation item</span></td></tr></tbody></table>

## Labeling elements

The accessibility label for a navigation item is typically the same as the destination name.

![Accessibility label and role defined for a Home icon on a navigation bar.](../../assets/navigation-bar/accessibility/08-accessibility-label-and-role-defined-for-a-home-icon-on-a-na-b9b28026.png)

A navigation bar’s accessibility label can incorporate its adjacent UI text

When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation destination visibly labeled **Library** would benefit from additional information in its accessibility label to clarify the destination’s intent. Note: On Android Views (MDC-Android), a more descriptive accessibility label is not available and the role is not announced.

![Accessibility labels of a navigation bar.](../../assets/navigation-bar/accessibility/09-accessibility-labels-of-a-navigation-bar-08df7761.png)

While the visible label text reads **Library**, the accessibility label for this destination clarifies its function: **Music library**

