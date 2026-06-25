---
component: Navigation rail
slug: navigation-rail
section: accessibility
category: Navigation
source: "https://m3.material.io/components/navigation-rail/accessibility"
scraped_at: "2026-06-20T06:58:58.096Z"
tokens_count: 1
images_count: 13
---
# Navigation rail

Navigation rails let people switch between UI views on mid-sized devices

## Use cases

People should be able to do the following using the assistive technology:

- Navigate between navigation destinations
- Select a particular navigation destination from a set
- Get appropriate feedback based on input type

## Interaction & style

When a navigation item is tapped, the active indicator appears, providing the following feedback to the user that it is selected:

- A ripple passes through the indicator
- The icon switches from outlined to filled
- The icon and text change color

When hovered, the hover state appears, providing a visual cue that the destination is interactive.

![Colorful, purple navigation rail shown collapsed and expanded.](../../assets/navigation-rail/accessibility/01-colorful-purple-navigation-rail-shown-collapsed-and-expanded-e2b88e05.png)

Touch: Tap

![Tap indicator on a collapsed nav rail.](../../assets/navigation-rail/accessibility/02-tap-indicator-on-a-collapsed-nav-rail-52ea18c3.png)

Cursor: Hover, Click

The target area for expanded navigation rails spans the full width of the container, even though the active indicator visually hugs the content.

![Touch indicator on a nav rail.](../../assets/navigation-rail/accessibility/03-touch-indicator-on-a-nav-rail-71d170b7.png)

Touch: Tap

Use a filled icon for the active destination and outlined icons for inactive destinations. Active and inactive icon colors need sufficient contrast against the container.

![Navigation rail with filled element.](../../assets/navigation-rail/accessibility/04-navigation-rail-with-filled-element-0c92a7aa.png)

check Do

Use the default color scheme to ensure proper contrast and emphasis on the active destination

![Nav rail with multiple navigation destinations and multi-colored contrast.](../../assets/navigation-rail/accessibility/05-nav-rail-with-multiple-navigation-destinations-and-multi-col-0d14bfff.png)

close Don’t

Don’t use more than two colors for destinations or low-contrast colors in the navigation rail. This will make distinguishing active items difficult. If an icon doesn’t have a filled style, use the semibold icon weight instead.

![Icon button with semibold weight, without filled options.](../../assets/navigation-rail/accessibility/06-icon-button-with-semibold-weight-without-filled-options-c8382760.png)

An icon with no filled option should use the semibold weight when active

### Text scaling and truncation

When someone sets their device to show a larger text size, the navigation rail items should grow vertically to accommodate larger labels while retaining the default padding. It’s okay for scaled text to wrap in navigation items. To remain accessible, ensure the full label is always visible on-screen at up to 2x text sizing. Beyond this size, text can truncate. 

![Nav rail with text scaled to 1.5x size. All labels are on one line.](../../assets/navigation-rail/accessibility/07-nav-rail-with-text-scaled-to-1-5x-size-all-labels-are-on-one-b7b37d11.png)

Text scaled to 1.5 size

![Nav rail with text scaled to 2x size. Some labels wrap to two lines.](../../assets/navigation-rail/accessibility/08-nav-rail-with-text-scaled-to-2x-size-some-labels-wrap-to-two-d4e4f9c2.png)

Text scaled to 2x size

### Initial focus

Initial focus lands directly on the first interactive item, whether it’s the menu, the FAB, or the first navigation item. From the FAB or menu, **Tab** brings the person to the navigation items. **Tab** or **Arrows** then navigate between items.

![Arrows help people move between pages.](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Fm0futkj8-07.png?alt=media&token=96c198ca-69ed-4388-81d4-76785f7c7960)

Use arrows to move between navigation items

![Space/enter help people choose a navigation destination.](../../assets/navigation-rail/accessibility/10-space-enter-help-people-choose-a-navigation-destination-4ef88402.png)

Use space/enter to activate the focused navigation item

### Visual indicators

Icons give the dominant cue of the navigation state. Use a filled icon for the selected destination to contrast with outlined icons for the non-selected destinations.

![Nav bar with an active, filled icon button.](../../assets/navigation-rail/accessibility/11-nav-bar-with-an-active-filled-icon-button-0c92a7aa.png)

check Do

Use a filled icon variant on the selected navigation item to differentiate from inactive navigation items

![Selected navigation item without filled icon style.](../../assets/navigation-rail/accessibility/12-selected-navigation-item-without-filled-icon-style-8ca321f3.png)

close Don’t

Avoid using the same unfilled icon style for both selected and unselected items because it lacks important visual feedback cue

## Keyboard navigation

| Keys | Actions |
| --- | --- |
| Tab / Arrows | Navigate between interactive elements |
| Space / Enter
 | Selects an interactive element |

## Labeling elements

The accessibility label for a navigation item is typically the same as the adjacent text label. When the visible UI text is ambiguous, accessibility labels need to be more descriptive. For example, a navigation item visibly labeled **Recent** would benefit from additional information in its accessibility label to clarify the destination's intent. Note: On Android Views (MDC-Android), a more descriptive accessibility label is not available and the role is not announced.

![“Maps” is both the icon label text and the accessibility label.](../../assets/navigation-rail/accessibility/13-maps-is-both-the-icon-label-text-and-the-accessibility-label-8db25d04.png)

While the visible label text reads **Recent**, the accessibility label for this switch clarifies its function: **Recent images**

