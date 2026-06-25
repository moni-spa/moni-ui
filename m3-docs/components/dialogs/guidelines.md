---
component: Dialogs
slug: dialogs
section: guidelines
category: All other components
source: "https://m3.material.io/components/dialogs/guidelines"
scraped_at: "2026-06-20T06:57:01.483Z"
tokens_count: 1
images_count: 34
---
# Dialogs

Dialogs provide important prompts in a user flow

![Basic dialog in isolation](../../assets/dialogs/guidelines/01-basic-dialog-in-isolation-76a1b291.png)

A basic dialog

## Usage

A dialog is a modal window that appears in front of app content to provide critical information or ask for a decision. Dialogs disable all app functionality when they appear, and remain on screen until confirmed, dismissed, or a required action has been taken. Dialogs are purposefully interruptive, so they should be used sparingly. A less disruptive alternative is to use a dropdown Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview), which provides options without interrupting a user’s experience.

![Diagram of basic and full-screen dialogs.](../../assets/dialogs/guidelines/02-diagram-of-basic-and-full-screen-dialogs-d003a9b7.png)

There are two variants of dialogs:

1. Basic dialog
2. Full-screen dialog

![Dialog in front of app content.](../../assets/dialogs/guidelines/03-dialog-in-front-of-app-content-85af68cb.png)

check Do

Use dialogs for prompts that block an app’s normal operation, and for critical information that requires a specific user task, decision, or acknowledgement

![Low-priority dialog in front of app content.](../../assets/dialogs/guidelines/04-low-priority-dialog-in-front-of-app-content-3d0e8988.png)

close Don’t

Don’t use dialogs for low- or medium-priority information. Instead use a snackbar, which can be dismissed or disappear automatically.

### Similar components

Snackbars [More on snackbars](/m3/pages/snackbar/overview) are also designed to show important messages. Choose the right component based on the importance of the message. This component messaging strategy helps avoid overusing dialogs.

![Snackbar on a phone saying that new photos were synced to the device. No buttons exist.](../../assets/dialogs/guidelines/05-snackbar-on-a-phone-saying-that-new-photos-were-synced-to-th-0b0a3198.png)

Snackbars can disappear automatically

|
**Component**

 |

**Importance**

 |

**Action needed**

 |
| --- | --- | --- |
| Snackbar | Low importance | Optional: Snackbars may not have a button [More on buttons](/m3/pages/common-buttons/overview), and can disappear automatically |
| Dialog | High importance | Required: Dialogs block the main content until an action is confirmed |

## Anatomy

### Basic dialog

![Diagram of 7 elements of basic dialog.](../../assets/dialogs/guidelines/06-diagram-of-7-elements-of-basic-dialog-bb15c7ed.png)

1. Container
2. Icon (optional)
3. Headline (optional)
4. Supporting text
5. Divider (optional)
6. Buttons label text
7. Scrim

### Full-screen dialog

![6 elements of full-screen dialog.](../../assets/dialogs/guidelines/07-6-elements-of-full-screen-dialog-5683f32b.png)

1. Container
2. Header region
3. Icon (close affordance)
4. Headline (optional)
5. Button label text
6. Divider (optional)

### Container and scrim

Dialog containers appear above other screen elements and hold the dialog’s headline, text, buttons [More on buttons](/m3/pages/common-buttons/overview), and list [More on lists](/m3/pages/lists/overview) items. To focus attention on the dialog, surfaces behind the container are scrimmed with a temporary overlay to make them less prominent.

![Basic dialog shown above a scrim overlay that reduces the prominence of the background elements.](../../assets/dialogs/guidelines/08-basic-dialog-shown-above-a-scrim-overlay-that-reduces-the-pr-3201b0e3.png)

Basic dialogs appear over a background scrim

### Headline (optional)

A dialog’s purpose should be communicated by its headline and buttons or actionable items. Headlines should:

- Contain a brief, clear statement or question
- Avoid apologies (“Sorry for the interruption”), alarm (“Warning!”), or ambiguity (“Are you sure?”)

![Dialog title asking “Use location service?”](../../assets/dialogs/guidelines/09-dialog-title-asking-use-location-service-d43c4286.png)

check Do

This dialog title poses a specific question, concisely explains what’s involved in the request, and provides clear actions

![Dialog title asking “Are you sure?”](../../assets/dialogs/guidelines/10-dialog-title-asking-are-you-sure-99545811.png)

close Don’t

Don’t use dialog titles that pose an ambiguous question

Headlines should always be succinct. They can wrap to a second line if necessary, and be truncated. In full-screen dialogs, long headlines or headlines of variable lengths (such as translations), can be placed in the content area instead of the app bar.

![Example full-screen dialog with truncated long headline.](../../assets/dialogs/guidelines/11-example-full-screen-dialog-with-truncated-long-headline-c9281bb7.png)

exclamation Caution

Avoid placing long headlines in a full-screen dialog’s app bar (1), as the truncated text may lead to misunderstanding

![Example full-screen dialog with short headline, and longer text in content area.](../../assets/dialogs/guidelines/12-example-full-screen-dialog-with-short-headline-and-longer-te-2fe3c2ad.png)

check Do

Find ways to shorten app bar text, and place longer headlines into the content area (1) of a full-screen dialog

### Buttons 

Dialog actions are most often represented as buttons [More on buttons](/m3/pages/common-buttons/overview) and allow users to confirm, dismiss, or acknowledge something. Buttons are aligned to the trailing edge of the dialog for easier interaction. The confirmation button is always closest to the edge. Button alignment responds automatically for right-to-left languages, where the confirmation button is aligned to the left edge.

![Dialog with the confirmation button disabled because a required radio selection is missing.](../../assets/dialogs/guidelines/13-dialog-with-the-confirmation-button-disabled-because-a-requi-8165f6bf.png)

check Do

Disable confirming actions (1) until a choice is made. Dismissive actions are never disabled.

![Dialog with the dismissing action "Cancel" on the right of the 2 buttons.](../../assets/dialogs/guidelines/14-dialog-with-the-dismissing-action-cancel-on-the-right-of-the-b68a389b.png)

close Don’t

Don’t place dismissive actions (1) to the right of confirming actions. Instead, place them to the left of confirming actions.

![Dialog with a single-action button: “OK”.](../../assets/dialogs/guidelines/15-dialog-with-a-single-action-button-ok-8f107f06.png)

check Do

A single action may be provided only if it’s an acknowledgement

![Dialog with 2 button choices: “Cancel”, “Got it”.](../../assets/dialogs/guidelines/16-dialog-with-2-button-choices-cancel-got-it-8705b363.png)

close Don’t

Avoid presenting people with unclear choices. **Cancel** doesn't make sense here because no clear action is proposed. Dialogs should contain a maximum of two actions.

- If a single action is provided, it must be an acknowledgement action
- If two actions are provided, one must be a confirming action, and the other a dismissing action

![Dialog with 2 buttons side-by-side: “Disagree”, “Agree”.](../../assets/dialogs/guidelines/17-dialog-with-2-buttons-side-by-side-disagree-agree-ceea923c.png)

check Do

Display two text buttons next to one another

![Dialog with 2 stacked buttons: “Turn on speed boost”, “No thanks”.](../../assets/dialogs/guidelines/18-dialog-with-2-stacked-buttons-turn-on-speed-boost-no-thanks-5fd7d126.png)

exclamation Caution

Stacked buttons accommodate longer button text, but take up more room. Confirming actions appear above dismissive actions. Providing a third action, such as **Learn more**, is not recommended as it navigates the user away from the dialog, leaving the dialog task unfinished. Rather than adding a third action, an inline expansion can display more information. If more extensive information is needed, provide it prior to entering the dialog.

![Dialog with 3 text buttons: Learn more, Disagree, Agree.](../../assets/dialogs/guidelines/19-dialog-with-3-text-buttons-learn-more-disagree-agree-52fe2aea.png)

exclamation Caution

The **Learn more** action (1) navigates away from this dialog, potentially leaving it in an indeterminate state

## Basic dialog

Basic dialogs interrupt users with urgent information, details, or actions. Common use cases for basic dialogs include alerts, quick selection [More on selection](/m3/pages/selection), and confirmation.

![Example of basic dialog action request.](../../assets/dialogs/guidelines/20-example-of-basic-dialog-action-request-baf09fc4.png)

Basic dialogs require a person to take action before it will close

![Example of basic dialog confirmation.](../../assets/dialogs/guidelines/21-example-of-basic-dialog-confirmation-e41e89a5.png)

Basic dialogs can give people the ability to provide confirmation of a choice before committing to it

Basic dialogs most often appear as alerts or lists [More on lists](/m3/pages/lists/overview), but can have a variety of layouts [More on layout](/m3/pages/understanding-layout/overview) and component combinations, including lists, date pickers [More on date pickers](/m3/pages/date-pickers/overview), and time pickers [More on time pickers](/m3/pages/time-pickers/overview).

![Date picker dialog.](../../assets/dialogs/guidelines/22-date-picker-dialog-d39bb45b.png)

Date picker dialogs allow people to tap a date, then confirm it by tapping **OK**

![Time picker dialog.](../../assets/dialogs/guidelines/23-time-picker-dialog-a6308b2b.png)

Time picker dialogs allow people to move the clock hand and then confirm by tapping **OK**

## Full-screen dialog

Full-screen dialogs fill the entire screen, containing actions that require a series of tasks to complete. One example is creating a calendar entry with the event title, date, location, and time. Because they take up the entire screen, full-screen dialogs are the only dialogs over which other dialogs can appear. Use a [container transform](/m3/pages/motion-transitions/transition-patterns#b67cba74-6240-4663-a423-d537b6d21187) pattern to transition a FAB [More on FABs](/m3/pages/fab/overview) into a full-screen dialog. Full-screen dialogs contain actions that require a series of tasks to complete

When a full-screen dialog is closed without being saved, a basic dialog appears in front of it to confirm selections [More on selection](/m3/pages/selection) should be discarded without saving changes. A basic modal dialog appears when a full-screen dialog is closed without being saved

Full-screen dialogs may be used for content or tasks that meet any of these criteria:

- Dialogs that include components which require keyboard input , such as form fields
- When changes aren’t saved instantly
- When components within the dialog open additional dialogs

Full-screen dialogs are for compact window sizes [More on compact window size class](/m3/pages/breakpoints/compact) only, like mobile devices. For medium and expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded), use a basic dialog.

### Saving selections

To save a selection in a full-screen dialog, use **Save**. The close icon or dismissive action, such as **Cancel** or **Back**, should close the dialog.

### Confirmation

The confirmation action should be clear about what happens next, like **Send** or **Create**. Avoid using vague terms like **Done**, **OK**, or . Only trigger an additional basic dialog if the action fails. Don’t disable [More on disabled state](/m3/pages/interaction-states/applying-states#4aff9c51-d20f-4580-a510-862d2e25e931) the confirmation button.

![Full-screen dialog with create button as confirmation action.](../../assets/dialogs/guidelines/24-full-screen-dialog-with-create-button-as-confirmation-action-70f9927f.png)

check Do

A **Create** button is clear that the event will be created

![Full-screen dialog with an additional basic dialog asking if you want to create this event.](../../assets/dialogs/guidelines/25-full-screen-dialog-with-an-additional-basic-dialog-asking-if-f103fa08.png)

close Don’t

Don’t trigger a basic dialog when the confirming action is selected

### Dismissing

When someone dismisses a full-screen dialog, a basic dialog should appear to confirm that they want to discard the unsaved changes.

![A basic dialog with options to either keep editing or discard unsaved changes.](../../assets/dialogs/guidelines/26-a-basic-dialog-with-options-to-either-keep-editing-or-discar-7ea82f5f.png)

check Do

Use a basic dialog to confirm that the user wants to discard unsaved changes

![A full-screen dialog with a Close button as the confirming action.](../../assets/dialogs/guidelines/27-a-full-screen-dialog-with-a-close-button-as-the-confirming-a-38245ca6.png)

close Don’t

Don’t use the confirming action to dismiss the full-screen dialog

### Error messages

Errors about the dialog fields should always appear inline where they occur. Some components like text fields [More on text fields](/m3/pages/text-fields/overview) have built-in error messaging, while others like checkboxes [More on checkboxes](/m3/pages/checkbox/overview) and radio buttons [More on radio buttons](/m3/pages/radio-button/overview) need error messages to be added next to the fields. General errors such as network issues preventing saving or submitting should appear in a basic dialog when the confirming action fails. Error messages should clearly but briefly explain the source of the error and how to fix it. Show all errors on the page at once so people can fix everything before trying again.

![A full-screen dialog with inline error messages for text fields.](../../assets/dialogs/guidelines/28-a-full-screen-dialog-with-inline-error-messages-for-text-fie-ab7ae387.png)

check Do

Error messages related to the fields should be displayed inline

![A basic dialog mentioning that entries were not saved due to a connection issue.](../../assets/dialogs/guidelines/29-a-basic-dialog-mentioning-that-entries-were-not-saved-due-to-c9007dcc.png)

exclamation Caution

Errors unrelated to the fields can be displayed in a basic dialog

### Dialog windows

Launching a full-screen dialog temporarily resets the app’s perceived elevation, allowing simple menus [More on menus](/m3/pages/menus/overview) or dialogs to appear above the full-screen dialog. They cover the screen and don’t appear as a floating modal window.

### Navigation

Because full-screen dialogs can only be completed, dismissed, or closed, the close “X” icon button should be the only navigation option in the app bar [More on app bars](/m3/pages/app-bars/overview).

## Adaptive design

Dialogs can swap variants as the window size class [More on window size classes](/m3/pages/breakpoints) changes. For example, a full-screen dialog [More on full-screen dialogs](/m3/pages/dialogs/guidelines#007536b9-76b1-474a-a152-2f340caaff6f) can change into a basic dialog [More on basic dialogs](/m3/pages/dialogs/guidelines#97ac3858-3932-4084-ae8e-73e42b7cb752) at larger breakpoints.

![Example of full-screen dialog on left, simple dialog on right](../../assets/dialogs/guidelines/30-example-of-full-screen-dialog-on-left-simple-dialog-on-right-edc23c6e.png)

1. Full-screen dialog on mobile
2. Dialog on a tablet

### Medium window size

Basic dialogs appear in a center position by default. Their position can be overridden to provide a more ergonomic experience.

![Basic dialog on tablet photos app.](../../assets/dialogs/guidelines/31-basic-dialog-on-tablet-photos-app-aa26e97f.png)

Dialog custom positioned on the right side of the screen

### Expanded window size

Dialogs on expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded), like desktop, are modal windows above a scrim. This puts the dialog at the forefront of a person's view, calling attention to the action prompted in the dialog.

![Example of desktop dialog.](../../assets/dialogs/guidelines/32-example-of-desktop-dialog-02ca6e01.png)

Desktop dialogs call attention to the required action

Basic dialogs can be custom-positioned anywhere on larger screens, respecting margins [More on margins](/m3/pages/understanding-layout/spacing#38a538d7-991f-4c39-8449-195d32caf397) to prevent edge collision.

![Basic dialog position diagram.](../../assets/dialogs/guidelines/33-basic-dialog-position-diagram-7c9a281c.png)

Custom placement area for basic dialogs that respects a 56dp margin from the edges of the screen

## Behavior

### Appearing

Dialogs appear without warning, requiring users to stop their current task. They should be used sparingly, as not every choice or setting warrants interruption. Dialogs use an [enter and exit](/m3/pages/motion-transitions/transition-patterns#e1c2a650-d7a4-4a6d-9025-e6b7845291ed) transition pattern to appear on screen. A dialog appears with an enter and exit transition

### Position

Dialogs retain focus until dismissed or an action has been taken, such as choosing a setting. They shouldn’t be obscured by other elements or appear partially on screen, with the exception of full-screen dialogs.

![A basic dialog covering a full-screen dialog.](../../assets/dialogs/guidelines/34-a-basic-dialog-covering-a-full-screen-dialog-cf897682.png)

Dialogs shouldn’t be obscured by other elements except for full-screen dialogs

### Scrolling

Most dialog content should avoid scrolling. Even when scrolling is required, the dialog title is pinned at the top, with buttons [More on buttons](/m3/pages/common-buttons/overview) pinned at the bottom. This ensures selected content remains visible alongside the title and buttons, even upon scroll. Dialogs don’t scroll with elements outside of the dialog, such as the background. When viewing a scrollable list of options, the dialog title and buttons remain fixed

