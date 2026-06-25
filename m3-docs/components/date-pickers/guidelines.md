---
component: Date pickers
slug: date-pickers
section: guidelines
category: Date & time pickers
source: "https://m3.material.io/components/date-pickers/guidelines"
scraped_at: "2026-06-20T06:56:50.909Z"
tokens_count: 0
images_count: 21
---
# Date pickers

Date pickers let people select a date, or a range of dates

![A date picker opens in a form UI.](../../assets/date-pickers/guidelines/01-a-date-picker-opens-in-a-form-ui-3d876a4b.png)

Docked date picker on desktop

## Usage

Date pickers let people select a date or range of dates. They should be suitable for the context in which they appear. Date pickers can be embedded into:

1. Dialogs [More on dailogs](/m3/pages/dialogs/overview) on compact [window sizes](/m3/pages/breakpoints) like mobile
2. Text field [More on text fields](/m3/pages/text-fields/overview) drop-downs on medium and expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded) like tablet and desktop

![2 date picker variations: a dialog on mobile and a dropdown within a text field on desktop.](../../assets/date-pickers/guidelines/02-2-date-picker-variations-a-dialog-on-mobile-and-a-dropdown-w-266f7e10.png)

1. Date picker dialog on mobile
2. Date picker text field dropdown on desktop

There are three variants of date pickers:

1. Docked date picker
2. Modal date picker
3. Modal date input

![A docked date picker component.](../../assets/date-pickers/guidelines/03-a-docked-date-picker-component-22daae2b.png)

1\. Docked date picker

![A modal date picker component.](../../assets/date-pickers/guidelines/04-a-modal-date-picker-component-e357a283.png)

2\. Modal date picker

![A modal date input component.](../../assets/date-pickers/guidelines/05-a-modal-date-input-component-306296aa.png)

3\. Modal date input

## Anatomy

### Docked date picker

![7 elements of a docked date picker.](../../assets/date-pickers/guidelines/06-7-elements-of-a-docked-date-picker-1eb90551.png)

1. Text field
2. Menu button
3. Icon button
4. Label text
5. Menu
6. Text buttons
7. Container

![3 elements of a docked date picker.](../../assets/date-pickers/guidelines/07-3-elements-of-a-docked-date-picker-cd3551f9.png)

1\. Text field 
2\. Menu button 
3\. Menu 

### Modal date picker

![12 elements of a modal date picker.](../../assets/date-pickers/guidelines/08-12-elements-of-a-modal-date-picker-fb5f621a.png)

1. Headline
2. Supporting text
3. Container
4. Icon button
5. Previous/next month buttons
6. Day of week labels
7. Today’s date
8. Unselected date
9. Text buttons
10. Selected date
11. Menu button
12. Divider

![9 elements of a modal date picker.](../../assets/date-pickers/guidelines/09-9-elements-of-a-modal-date-picker-84e7660f.png)

1. Headline
2. Supporting text
3. Container
4. Icon button
5. Unselected year
6. Selected year
7. Text buttons
8. Divider
9. Menu button

### Modal date input

![7 elements of a modal date input.](../../assets/date-pickers/guidelines/10-7-elements-of-a-modal-date-input-91c517ed.png)

1\. Headline 
2\. Supporting text
3\. Container
4\. Icon button
5\. Date input
6\. Text buttons
7\. Divider

### Full-screen date picker

![14 elements of a full-screen date picker.](../../assets/date-pickers/guidelines/11-14-elements-of-a-full-screen-date-picker-05a72dd5.png)

1\. Headline
2\. Supporting text
3\. Icon button
4\. Container
5\. Text button
6\. Icon button
7\. Divider
8\. Day of week labels
9\. Today’s date 
10\. Selected date range 
11\. Unselected date 
12\. Text buttons
13\. Selected date range start date 
14\. Month label

## Docked date picker

### Usage

Docked date pickers allow the selection [More on selection](/m3/pages/selection) of a specific date and year. The docked date picker displays a date input field by default, and a dropdown calendar appears when the user taps on the input field. Either form of date entry can be interacted with. Docked date pickers are ideal for navigating dates in both the near future or past and the distant future or past, as they provide multiple ways to select dates.

![Docked date picker on a desktop screen.](../../assets/date-pickers/guidelines/12-docked-date-picker-on-a-desktop-screen-96c0cb60.png)

Docked date picker on desktop

### Behavior

Dates can be added by using a keyboard or by navigating the calendar UI; both options are immediately available when the docked date picker is accessed.

![Docked date picker with a text field and the UI picker showing the selected date.](../../assets/date-pickers/guidelines/13-docked-date-picker-with-a-text-field-and-the-ui-picker-showi-db8000de.png)

Docked date picker

Docked date pickers adjust size dynamically

The year selection menu replaces the calendar view

### Month selection

Month selection [More on selection](/m3/pages/selection) can be navigated with the corresponding back and next arrows or by tapping the dropdown menu.

![Docked date picker with a list of months May through September. August is selected.](../../assets/date-pickers/guidelines/14-docked-date-picker-with-a-list-of-months-may-through-septemb-b0114126.png)

Docked date picker month selection

### Year selection

Year selection can be navigated with the corresponding back and next arrows or by tapping the dropdown menu.

![Docked date picker with a list of years 2025 to 2029. 2025 is selected.](../../assets/date-pickers/guidelines/15-docked-date-picker-with-a-list-of-years-2025-to-2029-2025-is-8f1fc41a.png)

Docked date picker year selection

## Modal date picker

### Behavior

Modal date pickers navigate across dates in several ways:

- To navigate across months, swipe horizontally
- To navigate across years, scroll vertically
- To access the year picker, tap the year

Don’t use a modal date picker to prompt for dates in the distant past or future, such as a date of birth. In these cases, use a modal input picker or a docked date picker instead. To navigate across months, swipe horizontally

To navigate across years, tap the year picker and scroll vertically 

### Date range selection

Date range selection provides a start and end date. Common use cases include:

- Booking a flight
- Reserving a hotel

Modal date pickers navigate across date ranges in several ways:

- To select a range of dates, tap the start and end dates on the calendar
- To navigate across months, scroll vertically

Modal date range picker

Modal date range picker with vertical scroll

## Modal date input

### Usage

Modal date inputs allow the manual entry of dates using the numbers on a keyboard. People can input a date or a range of dates in a dialog.

![A modal date input component.](../../assets/date-pickers/guidelines/16-a-modal-date-input-component-f075c9ee.png)

Modal date with manual input

![A modal date input component showing a day in 1979, which would be difficult to choose using UI.](../../assets/date-pickers/guidelines/17-a-modal-date-input-component-showing-a-day-in-1979-which-wou-b7c410b3.png)

check Do

For dates that don’t require a calendar view, the modal date input can be the default view

![A modal date input with hint text for entering the date.](../../assets/date-pickers/guidelines/18-a-modal-date-input-with-hint-text-for-entering-the-date-bb391e5a.png)

check Do

Alternatively, a text field with appropriate hint text can prompt for dates, such as in a form

### Behavior

You can swap between the modal date picker [More on modal date pickers](/m3/pages/date-pickers/guidelines#ced55f72-28b5-4f5d-a347-fa38214ef2d4) and modal date input [More on modal date inputs](/m3/pages/date-pickers/guidelines#d91ce7bc-dbc7-43e3-a802-152f2f9c892a) using the edit or calendar icon. Switching from a modal date picker to a mobile date input for selecting ranges

Switching from a modal date picker to a modal date input for selecting a single date

### Compact window size

On compact [window sizes](/m3/pages/applying-layout/window-size-classes#2bb70e22-d09b-4b73-9c9f-9ef60311ccc8), such as mobile, a full-screen modal date picker [More on modal date picker](https://m3.material.io/m3/pages/date-pickers/guidelines#ced55f72-28b5-4f5d-a347-fa38214ef2d4) is recommended to increase readability and touch target size. It can cover the entire screen.

![A full-screen view of modal date picker on a mobile device.](../../assets/date-pickers/guidelines/19-a-full-screen-view-of-modal-date-picker-on-a-mobile-device-ed786fb1.png)

A full-screen modal date picker on mobile

### Medium and expanded window sizes

The docked date picker works best for medium and expanded window sizes. It displays a date input field by default, and a dropdown calendar appears when a person taps on the input field. A person can interact with either form of date entry. Docked date pickers are ideal for navigating dates in both the near future or past, and in the distant future or past, as they provide multiple ways to select dates.

![A docked date picker displaying a full calendar view on a large screen device.](../../assets/date-pickers/guidelines/20-a-docked-date-picker-displaying-a-full-calendar-view-on-a-la-e889b3ef.png)

A docked date picker with a full calendar view is best used on larger devices

### Selection

Selection is indicated through color, drawing visual attention. In date ranges, start and end dates are selected, while dates in-between appear connected with a subtle highlight. Differences between selected the selected date range (August 17–23) and today's date (August 5) are shown through color and fill

### Appearing and disappearing

Like other kinds of dialogs, modal date pickers use an enter and exit transition pattern to appear on the screen. To exit a date picker, the input can either be confirmed (**OK**) or dismissed (**Cancel**). Interacting outside of the dialog will also dismiss the time picker . Unless one of these actions is taken, a time picker will continue to retain focus. Mobile full-screen pickers also have an additional close affordance (x) icon button and **Save** confirmation. Docked date pickers appear just below the input field. Modal date pickers can be dismissed through interacting with content outside the dialog, or with the action buttons in the lower right

Interacting with the input for a docked date picker makes the calendar view appear below

### Responsive layout

The sizing of the docked and modal date picker components don’t scale responsively to different window sizes.

![Docked date picker enlarged on a large screen responsively.](../../assets/date-pickers/guidelines/21-docked-date-picker-enlarged-on-a-large-screen-responsively-655eca22.png)

close Don’t

Don’t scale the date picker responsively to a larger size

