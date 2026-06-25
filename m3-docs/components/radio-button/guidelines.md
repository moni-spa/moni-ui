---
component: Radio button
slug: radio-button
section: guidelines
category: All other components
source: "https://m3.material.io/components/radio-button/guidelines"
scraped_at: "2026-06-20T06:59:19.616Z"
tokens_count: 0
images_count: 14
---
# Radio button

Radio buttons let people select one option from a set of options

![1 radio button is selected from a list of 4 radio buttons of different ringtones.](../../assets/radio-button/guidelines/01-1-radio-button-is-selected-from-a-list-of-4-radio-buttons-of-33fac1f2.png)

Radio buttons

## Usage

Radio buttons are the recommended way to allow users to make a single selection [More on selection](/m3/pages/selection) from a list of options. Only one radio button can be selected at a time. Radio buttons should always be accompanied by clear inline labels

Use radio buttons to:

- Select a single option from a set
- Expose all available options

![2 radio buttons are used for allowing or turning off notifications. 2 checkboxes are used for microphone and location access.](../../assets/radio-button/guidelines/02-2-radio-buttons-are-used-for-allowing-or-turning-off-notific-9043f62c.png)

Radio buttons are single-select, unlike checkboxes which are multi-select

![Filter page with 4 sort by options as radio buttons. Relevance is selected.](../../assets/radio-button/guidelines/03-filter-page-with-4-sort-by-options-as-radio-buttons-relevanc-579d32af.png)

check Do

Use radio buttons when only one option can be selected from a list

![Meal options page with the Additions item selected, along with 4 nested checkboxes for selecting various toppings. All checkboxes are selected.](../../assets/radio-button/guidelines/04-meal-options-page-with-the-additions-item-selected-along-wit-6e4f2af3.png)

check Do

Use checkboxes when multiple options can be selected from a list

Avoid nesting radio buttons or using radio buttons to select multiple options.

![Selected radio button with 2 nested radio buttons.](../../assets/radio-button/guidelines/05-selected-radio-button-with-2-nested-radio-buttons-64455113.png)

close Don’t

Don’t nest radio buttons

![2 radio buttons selected at once from a list of 3 buttons.](../../assets/radio-button/guidelines/06-2-radio-buttons-selected-at-once-from-a-list-of-3-buttons-96ecbe4c.png)

close Don’t

Don’t allow radio buttons to select multiple options

### Alternate selection controls

Radio buttons are one of several selection [More on selection](/m3/pages/selection) controls, which allow people to make choices such as selecting options or switching settings on or off. Switches [More on switches](/m3/pages/switch/overview) and checkboxes [More on checkboxes](/m3/pages/checkbox/overview) are alternative selection controls that can be used to change settings or preferences.

![A selected and unselected switch.](../../assets/radio-button/guidelines/07-a-selected-and-unselected-switch-11c9fed0.png)

Switches

![An unselected and selected checkbox.](../../assets/radio-button/guidelines/08-an-unselected-and-selected-checkbox-3e480db4.png)

Checkboxes

Use radio buttons when there are five or fewer options. Consider using a drop-down Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview) instead of radio buttons when it’s important to save space on a screen. However, drop-down menus require additional steps for a person, both in the number of clicks and cognitive effort. 

![A filter UI with 1 radio button selected from a list of 3 buttons.](../../assets/radio-button/guidelines/09-a-filter-ui-with-1-radio-button-selected-from-a-list-of-3-bu-0ff52561.png)

check Do

Use radio buttons when there are five or fewer options

![A dropdown menu with a list of 4 options.](../../assets/radio-button/guidelines/10-a-dropdown-menu-with-a-list-of-4-options-57fa1075.png)

check Do

Consider using a drop-down menu instead of radio buttons when space is constrained

## Anatomy

![3 elements of a radio button.](../../assets/radio-button/guidelines/11-3-elements-of-a-radio-button-269ae65d.png)

1. Selected icon
2. Adjacent label text
3. Unselected icon

### Adjacent label text

Always pair radio buttons with an adjacent label describing what the radio button selects. Because only one radio button can be selected at a time, each choice must have its own label. Radio button always need label text

## Placement

Radio buttons are often arranged in stacked layouts [More on layout](/m3/pages/understanding-layout/overview).

![Settings page with 3 stacked radio buttons for selecting a language.](../../assets/radio-button/guidelines/12-settings-page-with-3-stacked-radio-buttons-for-selecting-a-l-9ab4d41f.png)

Radio buttons should be vertically listed and have one option always selected.

![3 radio buttons with 1 option selected.](../../assets/radio-button/guidelines/13-3-radio-buttons-with-1-option-selected-fda7fe4d.png)

check Do

Radio buttons should always have one option pre-selected

![2 radio buttons side by side with 1 option selected.](../../assets/radio-button/guidelines/14-2-radio-buttons-side-by-side-with-1-option-selected-a77f463b.png)

exclamation Caution

Avoid using horizontal radio button lists

## Behavior

A radio button is successfully selected when a person clicks or taps either the radio button icon or the label. Radio buttons should take effect immediately, unless they're in a dialog or page that needs to be saved

