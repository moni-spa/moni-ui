---
component: Segmented buttons
slug: segmented-buttons
section: guidelines
category: Buttons
source: "https://m3.material.io/components/segmented-buttons/guidelines"
scraped_at: "2026-06-20T06:59:36.564Z"
tokens_count: 0
images_count: 21
---
# Segmented buttons

Segmented buttons help people select options, switch views, or sort elements

star

Note:

Segmented buttons are no longer recommended in the Material 3 expressive update. For those who have updated, use the [connected button group](/m3/pages/button-groups/overview/) instead, which has mostly the same functionality but with an updated visual design.

![Two types of segmented buttons.](../../assets/segmented-buttons/guidelines/01-two-types-of-segmented-buttons-8e220fd7.png)

1. Single-select
2. Multi-select

## Usage

Segmented buttons help people select options, switch views, or sort elements.

![A segmented button for switching between restaurants and bar options.](../../assets/segmented-buttons/guidelines/02-a-segmented-button-for-switching-between-restaurants-and-bar-088b5750.png)

A segmented button can help switch between viewing restaurant and bar options

There are 2 variants of segmented buttons:

1. Single-select
2. Multi-select

![Side by side view of single and multi-select segmented buttons](../../assets/segmented-buttons/guidelines/03-side-by-side-view-of-single-and-multi-select-segmented-butto-68a829ec.png)

1. Single-select segmented button can only have 1 segment selected
2. Multi-select segmented button can have multiple segments selected

## Anatomy

![Diagram of segmented button indicating 5 parts of its anatomy](../../assets/segmented-buttons/guidelines/04-diagram-of-segmented-button-indicating-5-parts-of-its-anatom-19345338.png)

1. Segment
2. Container
3. Icon (optional)
4. Label text (optional)
5. Selected icon

### Segments

Segmented buttons can have 2-5 segments. Each segment is clearly divided and contains label text, an icon, or both.

![Side by side view of segmented buttons each with additional segment starting from 2 to 5](../../assets/segmented-buttons/guidelines/05-side-by-side-view-of-segmented-buttons-each-with-additional--accbd6b1.png)

There can be anywhere from 2 to 5 segments in single-select and multi-select segmented buttons

![Mobile UI of data usage screen with segmented button](../../assets/segmented-buttons/guidelines/06-mobile-ui-of-data-usage-screen-with-segmented-button-3b6bba43.png)

check Do

Segmented buttons are best used for selecting between 2 and 5 choices

![Incorrect use of segmented button with 6 segments](../../assets/segmented-buttons/guidelines/07-incorrect-use-of-segmented-button-with-6-segments-9a4e5e56.png)

close Don’t

Don’t use more than five segments in a single segmented button. Choices should be scoped. If you have more than five choices, consider using another component, such as chips.

### Container

Like common buttons , segmented buttons have fully rounded corners by default.

![Close up detail of segmented button with fully rounded corners](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flw7o7un8-8.png?alt=media&token=0ccf0509-584f-437c-8a5f-dbfb97aae0ed)

Segmented buttons have fully rounded corners

### Icons

Icons may be used as labels by themselves or alongside text. If an icon is used without label text, it must clearly communicate the option it represents. 

![Side by side view of segmented buttons with different configurations of icons and label text](../../assets/segmented-buttons/guidelines/09-side-by-side-view-of-segmented-buttons-with-different-config-1c516cf6.png)

Segmented buttons can include icons

### Label text

Labels should be short and succinct. If a label is too long to fit within its segment, consider using an icon alone.

![Mobile UI of music app showing a segmented button with options for music, albums, podcasts](../../assets/segmented-buttons/guidelines/10-mobile-ui-of-music-app-showing-a-segmented-button-with-optio-d05bcec9.png)

Use labels that are as clear and short as possible

![Segmented button with options for day, week, month](../../assets/segmented-buttons/guidelines/11-segmented-button-with-options-for-day-week-month-38eca9bf.png)

check Do

Keep labels short and consistent in length

![Segmented button with 4 segments. 3 are next to each other. The 4th is wrapped on a new line.](../../assets/segmented-buttons/guidelines/12-segmented-button-with-4-segments-3-are-next-to-each-other-th-d1fa97ff.png)

close Don’t

Don’t allow segments to wrap onto a new line

![Segmented button with text labels reading day, week, month](../../assets/segmented-buttons/guidelines/13-segmented-button-with-text-labels-reading-day-week-month-b6e9c010.png)

check Do

Use consistent label types

![Segmented button with icons only labels for walking, transit, driving](../../assets/segmented-buttons/guidelines/14-segmented-button-with-icons-only-labels-for-walking-transit--e4e56940.png)

exclamation Caution

Icons can be used in place of labels, but they must clearly communicate their meaning

![Segmented button with 2 icon only options indicating favorite and bookmark and 3rd option with text label reading recent](../../assets/segmented-buttons/guidelines/15-segmented-button-with-2-icon-only-options-indicating-favorit-39bd4e06.png)

close Don’t

Avoid mixing icon-only labels with text labels. Choose one label type and use that type for all segments.

## Single-select

Use a single-select segmented button to select one option from a set, switch between views, or sort elements from up to five options. For example, use a single-select segmented button to choose one of a set of sizes, such as this beverage size selector.

![Mobile UI for ecommerce app with segmented button with 3 beverage size options](../../assets/segmented-buttons/guidelines/16-mobile-ui-for-ecommerce-app-with-segmented-button-with-3-bev-e33c3dbe.png)

A single select segmented button for choosing beverage size

## Multi-select

Use a multi-select segmented button to select or sort from two to five options. Unlike single-select, selection is not required and a user may concurrently select anywhere from all to none of the options. For example, multi-select segmented buttons can be used to filter by price range when searching for a restaurant. 

![Mobile UI for ecommerce app with multi-select segmented button with 4 price range options](../../assets/segmented-buttons/guidelines/17-mobile-ui-for-ecommerce-app-with-multi-select-segmented-butt-cb4d14ad.png)

A multi-select segmented button for filtering restaurant search options

## Placement

Segmented buttons should have adequate margins [More on margins](/m3/pages/spacing/overview) from the edge of the viewport or frame. On larger screens, set a maximum padding for all button segments so the set doesn't fill the screen.

![Mobile UI with 2-segment segmented button and 4-segment segmented button each with same margins to the viewport edge.](../../assets/segmented-buttons/guidelines/18-mobile-ui-with-2-segment-segmented-button-and-4-segment-segm-a2acd3bf.png)

check Do

Allow adequate space for margins. The button container shouldn’t reach the edge of the viewport.

![Game store UI with a segmented button the proper width](../../assets/segmented-buttons/guidelines/19-game-store-ui-with-a-segmented-button-the-proper-width-afb61e83.png)

check Do

Set a maximum padding within the segments to ensure usability on larger screens

![Game store UI with a segmented button improperly spanning the entire width of the screen](../../assets/segmented-buttons/guidelines/20-game-store-ui-with-a-segmented-button-improperly-spanning-th-87e131c6.png)

close Don’t

Don’t allow segmented buttons to span the full width of larger screens or panes. This can leave too much padding on either side of the segment label, making the button less usable. Segmented buttons can be placed on other components, such as bottom sheets [More on bottom sheets](/m3/pages/bottom-sheets/overview) or full-screen dialogs . 

![Mobile UI with segmented button in bottom sheet](../../assets/segmented-buttons/guidelines/21-mobile-ui-with-segmented-button-in-bottom-sheet-6922b6db.png)

A segmented button can be placed on a bottom sheet

## Behavior

When using both icons and label text in segmented buttons, the icon label is replaced by the checkmark icon when the segment is selected. Icons become checkmarks when selected in buttons that also use label text

