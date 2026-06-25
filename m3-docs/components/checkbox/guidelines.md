---
component: Checkbox
slug: checkbox
section: guidelines
category: All other components
source: "https://m3.material.io/components/checkbox/guidelines"
scraped_at: "2026-06-20T06:56:29.840Z"
tokens_count: 0
images_count: 8
---
# Checkbox

Checkboxes let users select one or more items from a list, or turn an item on or off

![A list of burger additions represented with checkboxes.](../../assets/checkbox/guidelines/01-a-list-of-burger-additions-represented-with-checkboxes-64dfa8ee.png)

Checkboxes in a list of items

## Usage

Use checkboxes to: 

- Select one or more options from a list
- Present a list containing sub-selections
- Turn an item on or off in a desktop environment
- Visually group similar options together

![List of 80's songs indicating choice through checkbox selection.](../../assets/checkbox/guidelines/02-list-of-80-s-songs-indicating-choice-through-checkbox-select-d47c0cec.png)

Checkboxes select multiple, related options

Checkboxes should be used instead of switches [More on switches](/m3/pages/switch/overview) if multiple, related options can be selected from a list. Checkboxes visually group similar items effectively and take up less space than switches.

![List indicating choice with checkbox selection.](../../assets/checkbox/guidelines/03-list-indicating-choice-with-checkbox-selection-094d3845.png)

check Do

Checkboxes let users select one or more options from a list. A parent checkbox allows for easy selection or deselection of all items.

![A list with multiple switches selected.](../../assets/checkbox/guidelines/04-a-list-with-multiple-switches-selected-11795693.png)

close Don’t

If a list consists of multiple options, don't use switches. Instead, use checkboxes. Checkboxes imply the items are related, and take up less visual space.

### Alternate selection controls

Checkboxes, radio buttons [More on radio buttons](/m3/pages/radio-button/overview), and switches [More on switches](/m3/pages/switch/overview) are the three main selection controls. They all help people make choices, like selecting options or switching settings on or off.

- Use checkboxes to select multiple related options in a list.
- Use radio buttons to select a single option in a list.
- Use switches to select standalone or more verbose options in a list, like settings.

![Diagram of 2 radio buttons, one selected and one unselected.](../../assets/checkbox/guidelines/05-diagram-of-2-radio-buttons-one-selected-and-one-unselected-0732bc4d.png)

Radio buttons

![Diagram of 2 switches, one selected and one unselected.](../../assets/checkbox/guidelines/06-diagram-of-2-switches-one-selected-and-one-unselected-d210316b.png)

Switches

## Anatomy

![Diagram of checkbox indicating the 2 parts of its anatomy.](../../assets/checkbox/guidelines/07-diagram-of-checkbox-indicating-the-2-parts-of-its-anatomy-eff4a7e5.png)

1\. Container

2\. Icon

## Responsive layout

In expanded window sizes [More on expanded window size class](/m3/pages/applying-layout/expanded), placing checkboxes within a contained region such as a side sheet [More on side sheets](/m3/pages/side-sheets/overview) can help group related controls and available actions.

![Desktop screen showing music albums and a side sheet containing checkboxes for filtering music genres.](../../assets/checkbox/guidelines/08-desktop-screen-showing-music-albums-and-a-side-sheet-contain-36321804.png)

A side sheet can group related controls on larger screens

## Behavior

Multiple checkboxes in a list can be selected. Selecting multiple items in a list using checkboxes

Checkboxes can have a parent-child relationship with other checkboxes.

- When the parent checkbox is checked, all child checkboxes are checked
- If a parent checkbox is unchecked, all child checkboxes are unchecked
- If some, but not all, child checkboxes are checked, the parent checkbox becomes an indeterminate checkbox. Checking an indeterminate checkbox checks all child items. Use a parent checkbox to make it more efficient to select many items

When selected, a checkbox clearly and instantly communicates its selected state. If used to turn something on or off, the action should be immediately executed. Turning an item on or off using a checkbox

