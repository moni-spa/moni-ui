---
component: Snackbar
slug: snackbar
section: guidelines
category: All other components
source: "https://m3.material.io/components/snackbar/guidelines"
scraped_at: "2026-06-20T07:00:05.722Z"
tokens_count: 1
images_count: 34
---
# Snackbar

Snackbars show short updates about app processes at the bottom of the screen

![Snackbar at the bottom of a mobile device.](../../assets/snackbar/guidelines/01-snackbar-at-the-bottom-of-a-mobile-device-9057e1c6.png)

## Usage

Snackbars inform users of a process that an app has performed or will perform. They appear temporarily, towards the bottom of the screen. They shouldn't interrupt the user experience. People can browse the page content without being required to interact with the snackbar.

**Frequency**
Only one snackbar may be displayed at a time.

**Actions**
A snackbar can contain a single action. "Dismiss" or "cancel" actions are optional.

![Snackbar showing 'Email archived' text with an 'Undo' text button.](../../assets/snackbar/guidelines/02-snackbar-showing-email-archived-text-with-an-undo-text-butto-4aad032e.png)

### Similar components

Dialogs [More on dialogs](/m3/pages/dialogs/overview) are also designed to show important messages. Choose the right component based on the importance of the message. This component messaging strategy can help avoid overusing snackbars.

![Dialog on a phone requiring the user to sign in to continue. Dismissing prevents them from progressing.](../../assets/snackbar/guidelines/03-dialog-on-a-phone-requiring-the-user-to-sign-in-to-continue--2afaccec.png)

Dialogs require immediate action

**When to use snackbars**
Snackbars communicate messages that are minimally interruptive and don’t require user action.

| Component | Priority | User action |
| --- | --- | --- |
| Snackbar | Low priority | Optional: Snackbars disappear automatically |
| Dialog | High priority | Required: Dialogs block app usage until the user takes a dialog action or exits the dialog (if available) |

### Accessibility requirements for web

On web, auto-dismissing snackbars are inaccessible for people with low vision or who require additional time to perceive information. This can be solved in 2 ways:

#### 1\. Add inline feedback

Information in auto-dismissing snackbars must also be communicated using another accessible method inline or near the action that triggered the snackbar. For example, update the label on a "Save" button [More on buttons](/m3/pages/common-buttons/overview) to “Saved”, and trigger an auto-dismissing snackbar that communicates the same message. 

#### 2\. Make the snackbar actionable

Alternatively, add actions to the snackbar so it doesn't dismiss until acted on.

![A button labelled "Save" changes to "Saved" after a moment. A snackbar confirms all changes are saved.](../../assets/snackbar/guidelines/04-a-button-labelled-save-changes-to-saved-after-a-moment-a-sna-d7ec53d7.png)

Also communicate snackbar information near the action that triggered the snackbar

## Anatomy

![4 elements of a snackbar.](../../assets/snackbar/guidelines/05-4-elements-of-a-snackbar-0143486f.png)

1. Container
2. Supporting text
3. Action (optional)
4. Close button (optional)

### Text label

Snackbars contain a text label that directly relates to the process being performed. In compact window sizes [More on compact window size class](/m3/pages/breakpoints/compact), the text label can contain up to two lines of text.

![Snackbar on a mobile device reading: "Saved in Vacation album".](../../assets/snackbar/guidelines/06-snackbar-on-a-mobile-device-reading-saved-in-vacation-album-1794b61b.png)

Text labels are short, clear updates on processes that have been performed

![Snackbar on mobile with one line of content.](../../assets/snackbar/guidelines/07-snackbar-on-mobile-with-one-line-of-content-f2b41aa4.png)

check Do

Keep the snackbar text label to one line long when possible

![Snackbar on mobile with two lines of content.](../../assets/snackbar/guidelines/08-snackbar-on-mobile-with-two-lines-of-content-ef2352f2.png)

check Do

On mobile, the text label can be up to two lines long

![Snackbar on mobile with an icon and one line of content.](../../assets/snackbar/guidelines/09-snackbar-on-mobile-with-an-icon-and-one-line-of-content-3b576eca.png)

exclamation Caution

Avoid adding icons to snackbars. If your message needs an icon, consider using a different component such as a dialog.

![Snackbar on mobile with bolded and hyperlinked words.](../../assets/snackbar/guidelines/10-snackbar-on-mobile-with-bolded-and-hyperlinked-words-302c7167.png)

close Don’t

Avoid using stylized text or inline links in snackbars; they can add unwanted complexity. If your message needs a link, add a button instead, or use a different component.

### Container

Snackbars are displayed in rectangular containers with a grey background. Containers should be completely opaque, so that text labels remain legible.

![Snackbar showing a light text label on a black color container.](../../assets/snackbar/guidelines/11-snackbar-showing-a-light-text-label-on-a-black-color-contain-07143f69.png)

Snackbar containers use a solid background color with a shadow to stand out against content

![A snackbar with button text the same color as supporting text.](../../assets/snackbar/guidelines/12-a-snackbar-with-button-text-the-same-color-as-supporting-tex-46021ada.png)

close Don’t

The text label shouldn’t share the same color as the text button

![A snackbar with the action in elevated style.](../../assets/snackbar/guidelines/13-a-snackbar-with-the-action-in-elevated-style-8da6eb3c.png)

close Don’t

Don’t use a filled or elevated button in a snackbar, as it draws too much attention

![An extended snackbar on tablet with a long text label.](../../assets/snackbar/guidelines/14-an-extended-snackbar-on-tablet-with-a-long-text-label-9b8f15e5.png)

check Do

In wide layouts, extend the container width to accommodate longer text labels

![Snackbar with a slightly transparent container and a clearly visible text label.](../../assets/snackbar/guidelines/15-snackbar-with-a-slightly-transparent-container-and-a-clearly-a276c18d.png)

exclamation Caution

An app can apply slight transparency to the container background, as long as text remains clearly legible

![image-16](../../assets/snackbar/guidelines/16-image-16-34b653ed.png)

close Don’t

Avoid significantly altering the shape of a snackbar container

### Action

Snackbars can display a single text button that lets users take action on a process performed by the app. Snackbars shouldn’t be the only way to access a core use case, to make an app usable.

![A snackbar container with rounded corners.](../../assets/snackbar/guidelines/17-a-snackbar-container-with-rounded-corners-c33fc8a6.png)

To distinguish the action from the text label, text buttons should display colored text

![Snackbar with a long text button displayed on a third line.](../../assets/snackbar/guidelines/18-snackbar-with-a-long-text-button-displayed-on-a-third-line-c07eac23.png)

check Do

If an action is long, it can be displayed on a third line

![Snackbar with a single text button labeled undo.](../../assets/snackbar/guidelines/19-snackbar-with-a-single-text-button-labeled-undo-92fd1df5.png)

check Do

To allow users to amend choices, display an "Undo" action

![Snackbar with a single text button labeled dismiss.](../../assets/snackbar/guidelines/20-snackbar-with-a-single-text-button-labeled-dismiss-00ddf534.png)

exclamation Caution

A dismiss action is unnecessary, as snackbar disappears on their own by default

## Placement

### At the bottom of a UI

Snackbars should be placed at the bottom of a UI, in front of the main content. In some cases, snackbars can be nudged upwards to avoid overlapping with other UI elements near the bottom, such as FABs [More on FABs](/m3/pages/fab/overview) or docked toolbars . Avoid placing a snackbar in front of frequently used touch targets or navigation.

![Snackbar appearing in front of photo content.](../../assets/snackbar/guidelines/21-snackbar-appearing-in-front-of-photo-content-da75d2a7.png)

check Do

Place a snackbar in front of the main content

![Snackbar placed in front of the navigation components.](../../assets/snackbar/guidelines/22-snackbar-placed-in-front-of-the-navigation-components-f27b1d8a.png)

close Don’t

Avoid placing snackbars in front of navigation components

To ensure accessibility for keyboard users on the web, avoid positioning the snackbar in a way that completely obscures actionable elements. Blocking elements makes it difficult to know what is being focused and selected.

![Thin snackbar in front of a focused element that is still visible.](../../assets/snackbar/guidelines/23-thin-snackbar-in-front-of-a-focused-element-that-is-still-vi-d403e39c.png)

check Do

Adjust the size of the snackbar to avoid blocking elements in focus

![Larger snackbar that is obscuring a focused element.](../../assets/snackbar/guidelines/24-larger-snackbar-that-is-obscuring-a-focused-element-2bc9f104.png)

close Don’t

Don’t let the snackbar fully cover elements in focus

Snackbars can span the entire width of the screen only when a UI does not use persistent navigation components like app bars or navigation bars [More on navigation bars](/m3/pages/navigation-bar/overview). Snackbars that span the entire width of a UI can push up FABs [More on FABs](/m3/pages/fab/overview) when they appear.

![Snackbar spanning the width of a mobile device is placed in front of the navigation components and FAB.](../../assets/snackbar/guidelines/25-snackbar-spanning-the-width-of-a-mobile-device-is-placed-in--8f1d1eee.png)

exclamation Caution Snackbars can span the entire width of a UI. However, they should not appear in front of navigation or other important UI elements like floating action buttons.

**Snackbars and floating action buttons (FABs)**

Snackbars should appear above FABs [More on FABs](/m3/pages/fab/overview).

![Snackbar placed above a FAB on a mobile device.](../../assets/snackbar/guidelines/26-snackbar-placed-above-a-fab-on-a-mobile-device-97985c2e.png)

Snackbar above a FAB

![Snackbar placed in front of a FAB on a mobile device.](../../assets/snackbar/guidelines/27-snackbar-placed-in-front-of-a-fab-on-a-mobile-device-ec7bcf50.png)

close Don’t

Don’t place a snackbar in front of a FAB

![Snackbar placed behind a FAB on a mobile device.](../../assets/snackbar/guidelines/28-snackbar-placed-behind-a-fab-on-a-mobile-device-ca31b52f.png)

close Don’t

Don’t place a snackbar behind a FAB

## Responsive layout

### Compact window size

In compact window sizes [More on compact window size class](/m3/pages/breakpoints/compact), snackbars should expand vertically from 48dp to 64dp to accommodate one or two lines of text, while maintaining a  fixed distance from the leading, trailing, and bottom edges of the screen.

![Snackbar with its label text extending to the second line and maintaining fixed distance from the edges of a mobile device.](../../assets/snackbar/guidelines/29-snackbar-with-its-label-text-extending-to-the-second-line-an-5703644a.png)

### Medium & expanded window sizes

On medium [More on medium window size class](/m3/pages/breakpoints/medium) and expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded), like tablet and desktop, snackbars should scale horizontally to accommodate longer text strings, keeping in mind that the ideal line length for text is typically between 40-60 characters. Snackbars use a flexible distance from the trailing edge of the screen. Whenever possible, snackbars on medium and large displays should aim for a single line of text with an  optional button [More on buttons](/m3/pages/common-buttons/overview).

![A horizontally expanded snackbar placed at the bottom of screen on a medium-size device.](../../assets/snackbar/guidelines/30-a-horizontally-expanded-snackbar-placed-at-the-bottom-of-scr-75a30d9c.png)

In wider layouts [More on layout](/m3/pages/understanding-layout/overview), snackbars can be left-aligned or center-aligned if they are consistently placed on the same spot at the bottom of the screen.

![A left-aligned snackbar placed at the bottom of screen on a medium-size device.](../../assets/snackbar/guidelines/31-a-left-aligned-snackbar-placed-at-the-bottom-of-screen-on-a--1e53369d.png)

Left-aligned snackbar

![A center-aligned snackbar placed at the bottom of screen on a medium-size device.](../../assets/snackbar/guidelines/32-a-center-aligned-snackbar-placed-at-the-bottom-of-screen-on--c75e0704.png)

Center-aligned snackbar

![Snackbar displayed at the left edge of the screen, near the bottom, on a medium-sized device.](../../assets/snackbar/guidelines/33-snackbar-displayed-at-the-left-edge-of-the-screen-near-the-b-492f6027.png)

close Don’t

Don’t place snackbars flush to one edge of the layout

![2 snackbars placed side-by-side at the bottom of the screen on a medium-size device.](../../assets/snackbar/guidelines/34-2-snackbars-placed-side-by-side-at-the-bottom-of-the-screen--0a1e30f9.png)

close Don’t

Don’t place consecutive snackbars side by side or next to one another

## Behavior

### Appearing and disappearing

Snackbars appear without warning, but they don’t block users from interacting with page content. Snackbars without actions can auto-dismiss after 4–10 seconds, depending on platform. Avoid using auto-dismissing snackbars on web unless there's also inline feedback. Snackbars with actions should remain on the screen until the user takes an action on the snackbar, or dismisses it.

### Consecutive snackbars

Consecutive snackbars must appear one at a time. Snackbars without actions appear and disappear automatically, while those with actions remain on screen until dismissed. However, a snackbar with updated information can immediately replace an outdated snackbar.

close Don’t

Don’t stack snackbars on top of one another

close Don’t

Don’t animate other components along with snackbar animations, such as the floating action button

