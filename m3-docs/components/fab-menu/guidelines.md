---
component: FAB menu
slug: fab-menu
section: guidelines
category: Buttons
source: "https://m3.material.io/components/fab-menu/guidelines"
scraped_at: "2026-06-20T06:57:30.339Z"
tokens_count: 0
images_count: 20
---
# FAB menu

The floating action button (FAB) menu opens from a FAB to display multiple related actions

![On a page of music albums, a FAB menu shows options to make a new playlist, collection, or station.](../../assets/fab-menu/guidelines/01-on-a-page-of-music-albums-a-fab-menu-shows-options-to-make-a-3e8533c2.png)

Use the FAB menu to show multiple related actions in a prominent, expressive style

## Usage

A FAB menu opens from a FAB to show multiple related actions. It should always appear in the same place as the FAB that opened it. This makes actions immediately accessible, and keeps the UI clean by concealing actions when they’re not needed. Don’t open a FAB menu from an extended FAB [More on extended FABs](/m3/pages/extended-fab/overview) or any other component.

![1 mobile screen with a FAB, 1 with a FAB menu. Both are right aligned.](../../assets/fab-menu/guidelines/02-1-mobile-screen-with-a-fab-1-with-a-fab-menu-both-are-right--c968397e.png)

The FAB menu should always open from a FAB

The FAB menu should be aligned to the trailing edge of the window. In right-to-left (RTL) languages, this means the FAB and FAB menu should be aligned to the left edge, and the layout of elements should be mirrored.

![1 mobile screen with a FAB, 1 with a FAB menu. Both are left aligned and mirrored for a right-to-left language.](../../assets/fab-menu/guidelines/03-1-mobile-screen-with-a-fab-1-with-a-fab-menu-both-are-left-a-d8611f14.png)

In RTL languages, the FAB menu should be left-aligned with the icon and text placement mirrored

FAB menus can contain 2–6 items. These should be closely related under a single action, like **Share**. Avoid grouping unrelated actions in the same FAB menu.

![A FAB menu with 5 options on a photo gallery UI.](../../assets/fab-menu/guidelines/04-a-fab-menu-with-5-options-on-a-photo-gallery-ui-d7b68ac5.png)

check Do

FAB menus can have 2-6 items

![A FAB menu with 1 option on a photo gallery UI.](../../assets/fab-menu/guidelines/05-a-fab-menu-with-1-option-on-a-photo-gallery-ui-076b1181.png)

close Don’t

Don’t use a FAB menu with one item

When a FAB is paired with other components, like the floating toolbar [More on toolbars](/m3/pages/toolbars/overview) or navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview), don’t use the FAB menu. This prevents cognitive overload and interface clutter. 

![A toolbar with a FAB directly next to it.](../../assets/fab-menu/guidelines/06-a-toolbar-with-a-fab-directly-next-to-it-92e38d6c.png)

check Do

FABs can be placed next to toolbars and other components

![A toolbar with a FAB menu next to it.](../../assets/fab-menu/guidelines/07-a-toolbar-with-a-fab-menu-next-to-it-e6ec68af.png)

close Don’t

Don't use a FAB menu with a toolbar or navigation rail

### Color sets

FAB menus have three color sets: primary, secondary, and tertiary. Use the color set that best matches the FAB color style. Use the primary FAB menu color set with the **primary** or **primary container** FAB color styles. 

![A FAB menu using the primary color set.](../../assets/fab-menu/guidelines/08-a-fab-menu-using-the-primary-color-set-7fa5f290.png)

A primary FAB is paired with a primary FAB menu

Use the secondary FAB menu color set with the **secondary** or **secondary container** FAB color styles. 

![A FAB menu using the secondary color set.](../../assets/fab-menu/guidelines/09-a-fab-menu-using-the-secondary-color-set-5f53d192.png)

A secondary FAB is paired with a secondary FAB menu

Use the tertiary FAB menu color set with the **tertiary** or **tertiary container** FAB color styles. 

![A FAB menu using the tertiary color set.](../../assets/fab-menu/guidelines/10-a-fab-menu-using-the-tertiary-color-set-e86fa165.png)

A tertiary FAB is paired with a tertiary FAB menu

## Anatomy

![2 elements of a FAB menu.](../../assets/fab-menu/guidelines/11-2-elements-of-a-fab-menu-ba11f99b.png)

1. Close button
2. List item

FAB menu items should always have label text. The icons shouldn’t be removed since they make each item easy to identify. 

![A FAB menu with 3 options for selecting Food, People, or Nature. There are no icons next to the text.](../../assets/fab-menu/guidelines/12-a-fab-menu-with-3-options-for-selecting-food-people-or-natur-81cd9b66.png)

exclamation Caution

Only remove the icon if necessary. The icon provides a differentiation between items.

![A FAB menu with 3 options for selecting Food, People, or Nature. The options are only icons, no text.](../../assets/fab-menu/guidelines/13-a-fab-menu-with-3-options-for-selecting-food-people-or-natur-ac9f4632.png)

close Don’t

Don’t remove the label

The list item should always hug its contents and look consistent. Avoid truncating text or setting fixed widths. All FAB menu elements should be rounded.

![A FAB menu used out of the box with no configurations.](../../assets/fab-menu/guidelines/14-a-fab-menu-used-out-of-the-box-with-no-configurations-090b653c.png)

check Do

Keep the padding between the container and icon, icon and text, and text and container consistent

![FAB menu items are equal width despite having different lengths of text.](../../assets/fab-menu/guidelines/15-fab-menu-items-are-equal-width-despite-having-different-leng-67960e3e.png)

close Don’t

Don’t expand container sizes

![FAB menu items are square instead of round.](../../assets/fab-menu/guidelines/16-fab-menu-items-are-square-instead-of-round-a91b8b98.png)

close Don’t

Don’t change FAB menu shapes

## Adaptive layout

The FAB menu can open from any sized FAB [More on FABs](/m3/pages/fab/overview). Use with a FAB size suitable for the window size class. For example, larger FABs are recommended for larger windows. The FAB menu works in any window size. Pair it with the FAB suitable for that window size. The FAB menu should remain anchored to the same corner or edge regardless of window size. In large and extra large windows, the FAB and FAB menu margins should increase from 16dp to 24dp.

![A FAB menu with 24dp margins from the edge of the window.](../../assets/fab-menu/guidelines/17-a-fab-menu-with-24dp-margins-from-the-edge-of-the-window-5330a5fd.png)

On desktop, use larger FABs and margins

On web, the FAB menu uses a Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview) component for an experience that's consistent with other desktop apps.

![A FAB menu using menu component on web and traditional FAB menu on compact screen.](../../assets/fab-menu/guidelines/18-a-fab-menu-using-menu-component-on-web-and-traditional-fab-m-7cb09e31.png)

The same FAB menu options on both large window (left) and an Android compact window (right)

## Behavior

### Appearing

The FAB should transform into the close button of the FAB menu. The menu items should appear using the [enter and exit](/m3/pages/motion-transitions/transition-patterns#e1c2a650-d7a4-4a6d-9025-e6b7845291ed) transition. Originate the transition from one of the FAB's trailing corners, preferably the top-aligned corner. Animate FAB menus from the top-aligned corner of FABs

To ensure accessibility for keyboard users on the web, avoid positioning the FAB menu to completely obscure the focus indicator of an actionable element. Partially covering the desired element is fine, as long as the focus indicator is visible.

![FAB menu doesn’t obscure actionable element and its focus indicator.](../../assets/fab-menu/guidelines/19-fab-menu-doesn-t-obscure-actionable-element-and-its-focus-in-e4cfdbb3.png)

check Do

Ensure the actionable element and its focus indicator are visible behind the FAB menu

![FAB menu obscures both an actionable element and its focus indicator.](../../assets/fab-menu/guidelines/20-fab-menu-obscures-both-an-actionable-element-and-its-focus-i-7b37c6fe.png)

close Don’t

Don’t block an actionable element and its focus indicator completely with the FAB menu

### Scrolling

When window height is limited, like when viewing phones in horizontal orientation, FAB menu items can scroll. The items should scroll behind the close button. FAB menus can scroll if the window height is too short to contain all the options

### Expanding

Any FAB menu item can expand and adapt to any shape using a [container transform](/m3/pages/motion-transitions/transition-patterns#b67cba74-6240-4663-a423-d537b6d21187) transition pattern. This includes a surface that is part of the app structure, or a surface that spans the entire screen. FAB menu items can transition into any kind of shape when selected

