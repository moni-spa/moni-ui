---
component: Switch
slug: switch
section: guidelines
category: All other components
source: "https://m3.material.io/components/switch/guidelines"
scraped_at: "2026-06-20T07:00:25.373Z"
tokens_count: 0
images_count: 18
---
# Switch

Switches toggle the selection of an item on and off

![A switch in 2 states, off and on.](../../assets/switch/guidelines/01-a-switch-in-2-states-off-and-on-9e87bb28.png)

Switches change settings and other options immediately

## Usage

Switches are best used to adjust settings and other standalone options. They make a binary selection [More on selection](/m3/pages/selection):

- On and off
- True and false

The effects of a switch should start immediately, without needing to save. Use a switch to turn an option on and off

Use switches to:

- Toggle a single item on or off
- Immediately activate or deactivate something

![Switch used in notification settings to turn on and off the "play over notifications" function.](../../assets/switch/guidelines/02-switch-used-in-notification-settings-to-turn-on-and-off-the--662444c7.png)

Switches are commonly used on mobile to turn settings on or off

Switches control binary options, not opposing ones. A binary option represents a single selection [More on selection](/m3/pages/selection) that's either on or off. Opposing options are when only one option in a set can be selected at a time, like a list [More on lists](/m3/pages/lists/overview) or map view. Use a connected button group [More on button groups](/m3/pages/button-groups/overview) instead.

![A connected button group with options of List View and Map View.](../../assets/switch/guidelines/03-a-connected-button-group-with-options-of-list-view-and-map-v-ce323216.png)

check Do

Use a connected button group to choose between opposing options

![A switch with non-binary options of List View and Map View.](../../assets/switch/guidelines/04-a-switch-with-non-binary-options-of-list-view-and-map-view-9fc34e73.png)

close Don’t

Avoid using switches to toggle between opposing options

### Alternate selection controls

Checkboxes [More on checkboxes](/m3/pages/checkbox/overview), radio buttons [More on radio buttons](/m3/pages/radio-button/overview), and switches are the three main kinds of selection controls. They help people make choices, like selecting options or turning settings on and off. Use checkboxes to select multiple related options in a list. Use radio buttons to select a single option in a list. Use switches to select standalone or more verbose options in a list, like settings.

![2 checkboxes, 1 unchecked and 1 checked.](../../assets/switch/guidelines/05-2-checkboxes-1-unchecked-and-1-checked-c44aea49.png)

Checkboxes

![2 radio buttons, 1 in an enabled state, 1 in a disabled state.](../../assets/switch/guidelines/06-2-radio-buttons-1-in-an-enabled-state-1-in-a-disabled-state-93b5ead8.png)

Radio buttons

![Mobile screen with checkboxes to select list items and call to action button to update the list.](../../assets/switch/guidelines/07-mobile-screen-with-checkboxes-to-select-list-items-and-call--ec24fdc5.png)

check Do

Use checkboxes (not switches) to let people select one or more options from a list

![Mobile screen with checkboxes to select list items and call to action switch to update the list.](../../assets/switch/guidelines/08-mobile-screen-with-checkboxes-to-select-list-items-and-call--b16f9f2e.png)

close Don’t

A switch can't replace a button. People expect a call to action to be a button, not a switch.

![Radio buttons used to select a language for a mobile app.](../../assets/switch/guidelines/09-radio-buttons-used-to-select-a-language-for-a-mobile-app-824a6c72.png)![Radio buttons used to select a language for a mobile app.](../../assets/switch/guidelines/10-radio-buttons-used-to-select-a-language-for-a-mobile-app-25d1bb32.png)

check Do

Use radio buttons (not switches) when only one item can be selected from a list

![Mobile screen with switches to select list items and call to action button to update the list.](../../assets/switch/guidelines/11-mobile-screen-with-switches-to-select-list-items-and-call-to-32ad791a.png)![Mobile screen with switches to select list items and call to action button to update the list.](../../assets/switch/guidelines/12-mobile-screen-with-switches-to-select-list-items-and-call-to-00b88807.png)

close Don’t

Avoid using a switch to select multiple options that require people to save. Switches should be immediate. Use checkboxes instead.

## Anatomy

![3 elements of a switch.](../../assets/switch/guidelines/13-3-elements-of-a-switch-f8d15be2.png)

1. Track
2. Handle
3. Icon (optional)

### Icon (optional)

The switch handle can contain an optional icon. The icon within the handle should always communicate the switch's selection

Icons can be used to visually emphasize the switch’s selection [More on selection](/m3/pages/selection). The icon’s meaning should be clear and unambiguous to help the people understand whether switch is on or off.

![2 switches, the unselected state icon is an X, and the selected state is a checkmark.](../../assets/switch/guidelines/14-2-switches-the-unselected-state-icon-is-an-x-and-the-selecte-f686c155.png)

check Do

Use icons that clearly communicate whether the switch is on or off, such as an X and a checkmark

![A switch’s unselected handle icon is a moon and the selected state icon is a pencil.](../../assets/switch/guidelines/15-a-switch-s-unselected-handle-icon-is-a-moon-and-the-selected-69b967d4.png)

close Don’t

Avoid using more ambiguous or non-binary icons, such as a moon or edit icon

### Label text

Switches should always be paired with an inline label describing what the switch controls when selected.

![Switch label text: 1. Permission manager, App has access to your data. 2. Camera access, app has access to your camera. 3. Show password.](../../assets/switch/guidelines/16-switch-label-text-1-permission-manager-app-has-access-to-you-04885f22.png)

check Do

Keep labels short and direct. A label should describe what the control does when the switch is on.

![On a mobile screen’s privacy settings, 2 switches have “On” label text and checkmark icons. The last switch has “Off” label text and no icon.](../../assets/switch/guidelines/17-on-a-mobile-screen-s-privacy-settings-2-switches-have-on-lab-90ac3ca3.png)

close Don’t

Don't add label text into the switch; the font size would be too small to be accessible. Use an appropriate icon instead.

## Placement

Switches are often arranged in stacked layouts [More on layout](/m3/pages/understanding-layout/overview).

![Screen showing labels and stacked switches in varying on/off modes.](../../assets/switch/guidelines/18-screen-showing-labels-and-stacked-switches-in-varying-on-off-43de964f.png)

Settings screens are common places to use switches

## Behavior

A switch is successfully toggled when the handle slides to the other side of the track after an interaction. When selected, the switch handle slides to the opposite end of the track

When a person toggles a switch, its handle size changes and the corresponding action takes effect immediately. The **on** state of the switch is indicated by a larger handle size

