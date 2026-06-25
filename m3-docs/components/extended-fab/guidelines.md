---
component: Extended FABs
slug: extended-fab
section: guidelines
category: Buttons
source: "https://m3.material.io/components/extended-fab/guidelines"
scraped_at: "2026-06-20T06:57:20.787Z"
tokens_count: 0
images_count: 28
---
# Extended FABs

Extended floating action buttons (extended FABs) help people take primary actions

![Vibrant extended FAB on an email screen.](../../assets/extended-fab/guidelines/01-vibrant-extended-fab-on-an-email-screen-d048f5b4.png)

Extended FABs are more prominent than regular FABs

## Usage

Use an extended FAB on screens with long, scrolling views that require persistent access to an action, such as a checkout screen. Use it when label text helps understand the main action, or to add further emphasis to the button.

![A centered extended FAB is used to check out in a shopping app.](../../assets/extended-fab/guidelines/02-a-centered-extended-fab-is-used-to-check-out-in-a-shopping-a-dabeaf53.png)

Extended FABs ensure the main action is visible at all times

![Extended FAB on an article with lots of body content to publish that article.](../../assets/extended-fab/guidelines/03-extended-fab-on-an-article-with-lots-of-body-content-to-publ-3bc2c43c.png)

Use an extended FAB to provide constant access to a primary action above long-scrolling surface content

![Extended FAB on a task list to create a new task.](../../assets/extended-fab/guidelines/04-extended-fab-on-a-task-list-to-create-a-new-task-f751aea5.png)

Use an extended FAB to emphasize a page’s primary action

### Additional emphasis

The extended FAB can provide more emphasis and clarity to a product’s primary action. Since it has room for both a text label and icon, the extended FAB can be effective where an icon alone is ambiguous. However, the relationship between an extended FAB's icon and label should be clear.

![Extended FAB labeled “find flights” with an airplane icon, which would be unclear on its own.](../../assets/extended-fab/guidelines/05-extended-fab-labeled-find-flights-with-an-airplane-icon-whic-c1c1963b.png)

An extended FAB can be effective where an icon alone is too vague

Like the regular FAB, only one extended FAB should be used per screen. Multiple FABs compete for attention. If additional high-level actions are required, consider adding more buttons elsewhere on the page.

![An extended FAB used on a screen.](../../assets/extended-fab/guidelines/06-an-extended-fab-used-on-a-screen-449ab2c4.png)

check Do

Only show one prominent action at a time with the extended FAB

![2 extended FABs used on 1 screen.](../../assets/extended-fab/guidelines/07-2-extended-fabs-used-on-1-screen-81314eee.png)

close Don’t

Don’t use multiple extended FABs in one screen as it disrupts visual hierarchy

The extended FAB shouldn't be used as an option in a set of actions. Instead, use filled buttons for a similar level of emphasis.

![Filled button labeled “finish setup” next to a “back” button.](../../assets/extended-fab/guidelines/08-filled-button-labeled-finish-setup-next-to-a-back-button-a5015a0e.png)

check Do

Use a button with appropriate styling to emphasize it in a group of buttons

![Extended FAB labeled “finish setup” next to a “back” button.](../../assets/extended-fab/guidelines/09-extended-fab-labeled-finish-setup-next-to-a-back-button-28923e04.png)

close Don’t

Don’t use the extended FAB to convey an option in a set of actions

### Choosing a size

There are three variants of extended FABs: small, medium, and large. Choose an appropriately-sized extended FAB to add the right amount of emphasis for an action. In compact windows with one prominent action, the large extended FAB can be appropriate. In larger window sizes, use a medium or large extended FAB.

![1 large, 1 medium, and 1 small extended FAB on 3 different screen sizes.](../../assets/extended-fab/guidelines/10-1-large-1-medium-and-1-small-extended-fab-on-3-different-scr-c99eb47e.png)

There are three sizes of extended FABs

## Anatomy

![3 extended FAB elements.](../../assets/extended-fab/guidelines/11-3-extended-fab-elements-ba38cdce.png)

1. Container
2. Label text
3. Icon (optional)

### Container

The extended FAB container is a rounded rectangle that hugs its contents. The extended FAB grows and shrinks with text length.

![Fixed-width extended FAB, centered, ignoring layout grid.](../../assets/extended-fab/guidelines/12-fixed-width-extended-fab-centered-ignoring-layout-grid-3deb702e.png)

The extended FAB container hugs the icon and text

### Icon (optional)

An extended FAB's icon should intuitively represent its action.

![Extended FAB without an icon, labeled “Save draft”.](../../assets/extended-fab/guidelines/13-extended-fab-without-an-icon-labeled-save-draft-8a240987.png)

check Do

Unlike standard FABs, extended FABs don't require an icon

![Extended FAB with icon only, with no label text.](../../assets/extended-fab/guidelines/14-extended-fab-with-icon-only-with-no-label-text-dc5903b1.png)

close Don’t

An extended FAB can't have an icon without a text label

### Label text

The extended FAB’s label should clearly describe its action. Use 1–2 words at most. Keep in mind that localization may increase the amount of characters and width of the extended FAB.

![Extended FAB with short text “Save”.](../../assets/extended-fab/guidelines/15-extended-fab-with-short-text-save-eae48478.png)

check Do

Shorten the text as much as needed. Include an icon for additional context.

![Extended FAB with wrapping text “Save draft in folder”.](../../assets/extended-fab/guidelines/16-extended-fab-with-wrapping-text-save-draft-in-folder-f6e1deca.png)

close Don’t

Avoid wrapping or truncating text

## Placement

![Extended FAB placed above navigation bar.](../../assets/extended-fab/guidelines/17-extended-fab-placed-above-navigation-bar-fdbf89c1.png)

check Do

Place the extended FAB above the rest of the UI, off of elements like app bars

![Extended FAB overlaid on a docked toolbar.](../../assets/extended-fab/guidelines/18-extended-fab-overlaid-on-a-docked-toolbar-0ea86152.png)

close Don’t

Don’t place the extended FAB on top of toolbars. It disrupts the consistency of the elevation and surface layers.

![Extended FAB below an app bar at the top of a mobile screen.](../../assets/extended-fab/guidelines/19-extended-fab-below-an-app-bar-at-the-top-of-a-mobile-screen-b309f525.png)

close Don’t

Don’t place the extended FAB in the upper half of a mobile screen, as it disrupts the reading of the UI

![An extended FAB labeled "Confirm" on a dialog to "Confirm your location".](../../assets/extended-fab/guidelines/20-an-extended-fab-labeled-confirm-on-a-dialog-to-confirm-your--6cbf34ef.png)

close Don’t

Don’t place extended FABs on cards or inside other containers

Avoid putting other floating components, like the floating toolbar [More on toolbars](/m3/pages/toolbars/overview), on screen with the extended FAB.

![The extended FAB is next to a floating toolbar.](../../assets/extended-fab/guidelines/21-the-extended-fab-is-next-to-a-floating-toolbar-f5bbaa2a.png)

close Don’t

Floating toolbars can be paired with FABs, but not extended FABs

## Responsive layout

The FAB and extended FAB can transform into each other depending on available space and layout. In a collapsed navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview), a FAB would be used. When the rail is expanded, the FAB can transform into an extended FAB. 

![Example of extended FAB transforming into standard FAB.](../../assets/extended-fab/guidelines/22-example-of-extended-fab-transforming-into-standard-fab-c302dcc5.png)

When space is limited, an extended FAB can transform into a FAB

### Right-to-left languages

Extended FABs should mirror their elements in right-to-left (RTL) languages.

![Extended FAB in a left-to-right language placed at the bottom right of a screen. The icon is to the left of the text.](../../assets/extended-fab/guidelines/23-extended-fab-in-a-left-to-right-language-placed-at-the-botto-a0034857.png)

Icons should be placed to the left of labels for left-to-right (LTR) languages

![Extended FAB in a right-to-left language placed at the bottom left of a screen. The icon is to the right of the text.](../../assets/extended-fab/guidelines/24-extended-fab-in-a-right-to-left-language-placed-at-the-botto-20ccc09f.png)

Icons should be placed to the right of labels for RTL languages

### Window sizes

In compact [More on compact window size class](/m3/pages/applying-layout/compact) and medium window sizes [More on medium window size class](/m3/pages/applying-layout/medium), the extended FAB should be placed at the bottom of the screen, either center-aligned or aligned to the trailing edge of the window.

![Extended FAB center-aligned on a mobile screen.](../../assets/extended-fab/guidelines/25-extended-fab-center-aligned-on-a-mobile-screen-afb93d61.png)

The extended FAB can be center-aligned

![Extended FAB right-aligned on a mobile screen.](../../assets/extended-fab/guidelines/26-extended-fab-right-aligned-on-a-mobile-screen-26d16600.png)

The extended FAB can be aligned to the trailing edge of the window

In expanded [More on expanded window size class](/m3/pages/applying-layout/expanded) and larger window sizes, the extended FAB should appear either:

- At the bottom right edge of the window, in both LTR and RTL languages
- Within the navigation rail

![Extended FAB at bottom right of screen.](../../assets/extended-fab/guidelines/27-extended-fab-at-bottom-right-of-screen-3557927c.png)

The extended FAB can be right-aligned in both LTR and RTL languages

![Extended FAB in navigation drawer.](../../assets/extended-fab/guidelines/28-extended-fab-in-navigation-drawer-ed826899.png)

The extended FAB can be at the top of the expanded navigation rail

## Behavior

### Appearing

The extended FAB surface expands when appearing on screen using an [enter and exit](/m3/pages/motion-transitions/transition-patterns#e1c2a650-d7a4-4a6d-9025-e6b7845291ed) transition pattern. An extended FAB expands when appearing on screen

### Expanding

The extended FAB can expand and adapt to any shape using a [container transform](/m3/pages/motion-transitions/transition-patterns) transition pattern. This includes a surface that is part of the app structure, or a surface that spans the entire screen. An extended FAB can expand and adapt to any shape

### Transforming

The extended FAB can transform into a FAB on scroll to temporarily take up less space on screen. An extended FAB can transform into a FAB

### Scrolling

The extended FAB can transform into a FAB when scrolling down, and back to an extended FAB when scrolling up. An extended FAB collapses and expands when scrolling

When the FAB switches to an extended FAB, the following transitions occur:

- The FAB shape changes
- FAB icon moves to the left
- FAB text label fades in

FAB switches to an extended FAB

