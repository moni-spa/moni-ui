---
component: Buttons
slug: buttons
section: guidelines
category: Buttons
source: "https://m3.material.io/components/buttons/guidelines"
scraped_at: "2026-06-20T06:55:54.795Z"
tokens_count: 0
images_count: 43
---
# Buttons

Buttons prompt most actions in a UI.

![Buttons in various shapes and sizes.](../../assets/buttons/guidelines/01-buttons-in-various-shapes-and-sizes-d77c59b7.png)

Buttons and icon buttons come in many shapes, styles, and sizes

## Usage

Buttons communicate actions that people can take. They are typically placed throughout the UI, in places like:

- Dialogs [More on dialogs](/m3/pages/dialogs/overview)
- Modal windows
- Forms
- Cards [More on cards](/m3/pages/cards/overview)
- Toolbars [More on toolbars](/m3/pages/toolbars/overview)

They can also be placed within standard button groups [More on button groups](/m3/pages/button-groups/overview). Use visually-prominent filled buttons for the most important actions

Buttons are just one option for representing actions in a product and shouldn’t be overused. Too many buttons on a screen can disrupt the visual hierarchy. Consider placing additional actions in a navigation rail [More on navigation rail](/m3/pages/navigation-rail/overview), set of chips [More on chips](/m3/pages/chips/overview), text links, or icon buttons [More on icon buttons](/m3/pages/icon-buttons/overview).

![1 button placed on bottom right of screen.](../../assets/buttons/guidelines/02-1-button-placed-on-bottom-right-of-screen-a44c2fc8.png)

check Do

Use buttons for discrete actions

![3 buttons side by side on bottom of screen.](../../assets/buttons/guidelines/03-3-buttons-side-by-side-on-bottom-of-screen-316871ac.png)

close Don’t

Don’t clutter your UI with too many buttons. Consider presenting low-priority actions in overflow menus or as icon buttons.

![Filled button on menu screen.](../../assets/buttons/guidelines/04-filled-button-on-menu-screen-cd24557c.png)

check Do

A button container’s width is dynamically set to fit its label text

![Filled button as wide as layout grid.](../../assets/buttons/guidelines/05-filled-button-as-wide-as-layout-grid-c3f28b91.png)

check Do

Button container width can be responsive, which allows it to stretch horizontally

![Filled button with label text overflowing the container.](../../assets/buttons/guidelines/06-filled-button-with-label-text-overflowing-the-container-60471590.png)

close Don’t

A button container’s width shouldn’t be narrower than its label text

![Diagram of button styles and toggle behaviors.](../../assets/buttons/guidelines/07-diagram-of-button-styles-and-toggle-behaviors-858dea13.png)

A: Default button; B: Toggle (unselected); C: Toggle (selected) for five button styles, in order of emphasis:

1. Elevated button
2. Filled button
3. Filled tonal button
4. Outlined button
5. Text button

A button group [More on button groups](/m3/pages/button-groups/overview) is a collection of buttons that relate to each other and can respond to one another. Both buttons and icon buttons can be used inside a button group. In some cases, there are primary and secondary actions within a button group. Buttons with primary actions should have a higher visual emphasis through size, color, or shape.

[More on button groups](/m3/pages/button-groups/overview)

![Audio app with play, next, and back buttons.](../../assets/buttons/guidelines/08-audio-app-with-play-next-and-back-buttons-3e40ee88.png)

Different sized buttons in a button group help emphasize the main action from secondary actions

## Toggle buttons

Toggle buttons should be used for binary selections, such as **Save** or **Favorite**. When toggle buttons are pressed, they can change color, shape, and labels. Toggle buttons should use an outlined icon when unselected, and a filled version of the icon when selected. If a filled version doesn’t exist, increase the weight instead. By default, toggle buttons change from round to square when selected. Use toggle buttons for binary actions

If the label changes on selected or unselected states, be mindful of the character count. Changing the label significantly is disruptive to the user and the page layout.

![Toggleable “start” and “reset” buttons.](../../assets/buttons/guidelines/09-toggleable-start-and-reset-buttons-aff2ecd0.png)

check Do

When using toggleable buttons, keep the label character count a similar length for both states

![Toggleable “start” and “reset back to beginning” buttons.](../../assets/buttons/guidelines/10-toggleable-start-and-reset-back-to-beginning-buttons-d457c5da.png)

close Don’t

The label length shouldn’t change dramatically to be longer or shorter

## Anatomy

![3 parts of a button.](../../assets/buttons/guidelines/11-3-parts-of-a-button-011d4111.png)

1. Label text
2. Container
3. Icon (optional)

### Label text

Label text is the most important element of a button. It describes the action that will occur if someone taps a button. It should be very brief, ideally 1–3 words. Use sentence case, which only capitalizes the first word and proper nouns. This allows the text to distinguish proper nouns, for example: **Book with Flights**, not **BOOK WITH FLIGHTS**. Don’t truncate or wrap label text. It should always be fully visible on a single line.

![Button with label text “See all recipes.”](../../assets/buttons/guidelines/12-button-with-label-text-see-all-recipes-dbf7d5f0.png)

check Do

Use sentence case for button label text, capitalizing the first word and proper nouns

![Button with wrapped label.](../../assets/buttons/guidelines/13-button-with-wrapped-label-379e627c.png)

close Don’t

Don’t wrap text. For maximum legibility, label text should remain on a single line. Buttons with the **outlined** and **text** color style depend on the colors to be recognizable from other text and elements. Use caution when putting these buttons next to visually similar elements, such as chips or large text.

![Chips next to an outlined button, highlighting their similarities.](../../assets/buttons/guidelines/14-chips-next-to-an-outlined-button-highlighting-their-similari-bd6eef06.png)

exclamation Caution

The outlined button style is very similar to chips. Consider using a filled or tonal button instead.

### Container

Button containers hold the label text and optional icon. Buttons with the **text** color style have a visible container only when hovered, focused, or pressed. Buttons with a round shape have containers with fully rounded corners.

![Round button.](../../assets/buttons/guidelines/15-round-button-9fe2dc20.png)

Round buttons have containers with fully rounded corners

Buttons with a square shape have containers with more subtle rounding that changes based on button size.

![Square buttons with different radii.](../../assets/buttons/guidelines/16-square-buttons-with-different-radii-6fe27649.png)

Square buttons have square containers and change radius as the button size changes

![Button with the label text “Edit playlist” within the container.](../../assets/buttons/guidelines/17-button-with-the-label-text-edit-playlist-within-the-containe-9eb2bf6a.png)

check Do

A button’s width dynamically adjusts to the label text

![Button with text larger than its container.](../../assets/buttons/guidelines/18-button-with-text-larger-than-its-container-f362c078.png)

close Don’t

Avoid setting a fixed width smaller than the label text

### Icon (optional)

Icons visually communicate the button’s action and help draw attention. They should be placed on the leading side of the button, before the label text.

![Filled button with the icon to the left of the label in a left-to-right language.](../../assets/buttons/guidelines/19-filled-button-with-the-icon-to-the-left-of-the-label-in-a-le-132dbbb9.png)

check Do

Place the icon to the left of the label in buttons with text in left-to-right languages

![Filled button with the icon to the right of the label in a right-to-left language.](../../assets/buttons/guidelines/20-filled-button-with-the-icon-to-the-right-of-the-label-in-a-r-a7f1de74.png)

check Do

Place the icon to the right of the label in buttons with text in right-to-left languages

![Button with shopping cart icon and text label “Add to cart”.](../../assets/buttons/guidelines/21-button-with-shopping-cart-icon-and-text-label-add-to-cart-d8d6426b.png)

check Do

Use icons that clearly communicate their meaning

![Button with Plus icon vertically above the text label “Add to watch list”.](../../assets/buttons/guidelines/22-button-with-plus-icon-vertically-above-the-text-label-add-to-35080fea.png)

close Don’t

Don’t vertically align an icon and text in the center of a button

![Button with two icons.](../../assets/buttons/guidelines/23-button-with-two-icons-c8f393f0.png)

close Don’t

Don’t use two icons in the same button

## Color styles

### Elevated style

The **elevated** button style is the same as the tonal button, but with a shadow. To avoid overusing shadows, use the elevated style only when absolutely necessary, such as when the button requires visual separation from a visually prominent background.

![Elevated button on a scrim background.](../../assets/buttons/guidelines/24-elevated-button-on-a-scrim-background-2466e0e4.png)

Elevated buttons provide separation from a visually prominent background

Buttons at higher elevations typically have more emphasis in a design, and should be used sparingly. For high emphasis, consider the filled style instead.

![Elevated button in a shopping experience.](../../assets/buttons/guidelines/25-elevated-button-in-a-shopping-experience-9b1fee0e.png)

exclamation Caution

Higher elevation increases the emphasis of a button

### Filled style

The **filled** button style has the most visual impact after the FAB [More on FABs](/m3/pages/fab/overview), and should be used for important, final actions that complete a flow, like **Save**, **Join now**, or **Confirm**.

![Filled button reading “Make payment.”](../../assets/buttons/guidelines/26-filled-button-reading-make-payment-69360668.png)

Filled buttons have high visual impact when used for important actions

Since they have such strong emphasis, the filled style should be used sparingly, ideally for only one action on a page. In some cases, filled buttons can use tertiary colors.

![Filled “pause” button in a music app.](../../assets/buttons/guidelines/27-filled-pause-button-in-a-music-app-7d0753f8.png)

Filled buttons can be responsive to the layout grid and help emphasize main actions

### Tonal style

The **tonal** button style is useful in contexts where a lower-priority button requires slightly more emphasis than an outline would give, such as **Next** in an onboarding flow. Tonal buttons use the secondary color mapping.

![Shopping app with 2 tonal-style filled buttons.](../../assets/buttons/guidelines/28-shopping-app-with-2-tonal-style-filled-buttons-2bbfa50b.png)

The tonal style has less emphasis than filled or emphasis

### Outlined style

The **outlined** style is ideal for medium-emphasis buttons which contain actions that are important, but aren’t the primary action in a product. Outlined buttons pair well with filled buttons to indicate alternative, secondary actions.

![Outlined buttons for less important actions, including a back button and a button that reads “Next movie.”](../../assets/buttons/guidelines/29-outlined-buttons-for-less-important-actions-including-a-back-e5cebfb6.png)

Outlined buttons contain less important supporting actions

Outlined buttons display a stroke around the button container, and have no fill by default. They should be placed on simple backgrounds, not visually prominent backgrounds such as images or videos. 

![Outlined button for “add to cart” in shopping app.](../../assets/buttons/guidelines/30-outlined-button-for-add-to-cart-in-shopping-app-f0a718c1.png)

Outlined buttons display a stroke around the button container

![Outlined button labeled Add to calendar on a pink/purple background.](../../assets/buttons/guidelines/31-outlined-button-labeled-add-to-calendar-on-a-pink-purple-bac-ad4cf27c.png)

check Do

Outlined buttons can be used on backgrounds with a color gradient

![2 photos, each with an outlined button with a custom fill.](../../assets/buttons/guidelines/32-2-photos-each-with-an-outlined-button-with-a-custom-fill-e15cfa7a.png)

exclamation Caution Use caution when placing outlined buttons on top of images. Customizing the button to have a contrasting container fill can help ensure legibility of label text. Or, use a filled button instead.

### Text style

The text button style should be used for the lowest priority actions, especially when presenting multiple options. They should be placed on simple backgrounds, not visually prominent backgrounds such as images or videos. The container isn’t visible until someone interacts with the button. Don’t underline the text button. Use hyperlinked body text instead to emphasize links. [More on hyperlinks](/m3/pages/typography/applying-type#24856f70-f759-45df-a06c-92018f286083)

![Example calendar screen with 2 text buttons and 1 split button.](../../assets/buttons/guidelines/33-example-calendar-screen-with-2-text-buttons-and-1-split-butt-001f3d9a.png)

Use text buttons for the lowest priority actions

Text buttons are often placed within components such as cards [More on cards](/m3/pages/cards/overview), dialogs [More on dialogs](/m3/pages/dialogs/overview), and snackbars [More on snackbars](/m3/pages/snackbar/overview). Since text buttons don’t have a visible container in their default state [More on states](/m3/pages/interaction-states/overview), they don’t distract from nearby content. However, since there’s no container, the label text color must always be recognizable from non-button text and elements.

![Text button labeled “Retry” in a snackbar.](../../assets/buttons/guidelines/34-text-button-labeled-retry-in-a-snackbar-7cace7e6.png)

Text button in a snackbar

![Text button labeled “View album” on an album cover background.](../../assets/buttons/guidelines/35-text-button-labeled-view-album-on-an-album-cover-background-a21559ec.png)

Text button against an image background

In cards, text buttons help maintain an emphasis on card content.

![Text button labeled “Learn more” in an information card about sourdough bread.](../../assets/buttons/guidelines/36-text-button-labeled-learn-more-in-an-information-card-about--713792be.png)

Text button in a card

Dialogs use text buttons because the absence of a container helps unify the action with the dialog text. Align text buttons to the trailing edge of dialogs, on the right for left-to-right languages and on the left for right-to-left languages.

![Modal dialog with the title “Subscribe to our newsletter?” and trailing buttons “Cancel” and “Subscribe”.](../../assets/buttons/guidelines/37-modal-dialog-with-the-title-subscribe-to-our-newsletter-and--70d94658.png)

Text buttons in a dialog

## Adaptive design

### Resizing

When scaling layouts for large screen devices, buttons can adapt their visual presentation, size, alignment, and arrangement to fit different contexts and user needs. Choose the best button position based on screen size.

![Flights app in compact screen with buttons below flight information.](../../assets/buttons/guidelines/38-flights-app-in-compact-screen-with-buttons-below-flight-info-e90ac53f.png)

Filled buttons are end-aligned below flight information in a compact window

![Flights app in large screen with buttons to the left of flight information.](../../assets/buttons/guidelines/39-flights-app-in-large-screen-with-buttons-to-the-left-of-flig-24a04c68.png)

Filled buttons are start-aligned beside flight information in a large window

The icon and label text in a button stay centered and grouped as the button's width changes.

![2 buttons with horizontally centered text labels.](../../assets/buttons/guidelines/40-2-buttons-with-horizontally-centered-text-labels-27f1fe15.png)

check Do

Keep the icon and label text grouped and centered

![1 button with centered text label, 1 button with icon and label aligned to opposite edges.](../../assets/buttons/guidelines/41-1-button-with-centered-text-label-1-button-with-icon-and-lab-252b90c5.png)

close Don’t

Don't ungroup the icon and label text or let them anchor to opposite sides of the button

Buttons can be customized to change size and scaling behavior across different window sizes [More on window size classes](/m3/pages/breakpoints). To avoid creating very long buttons in large windows, constrain button width or place buttons beside other elements.

![Button width is over-stretched with screen width.](../../assets/buttons/guidelines/42-button-width-is-over-stretched-with-screen-width-7632d2f2.png)

close Don’t

Don’t allow the button to stretch in a way that creates long, flat buttons with very little content inside

### Presentation

The size and placement of buttons can change as parent containers, such as cards, adapt for larger screens. Keep items, including buttons, in the same order between large and small screens to provide a consistent experience for screen readers and keyboard navigation.

![2 buttons scaling to accommodate different device sizes.](../../assets/buttons/guidelines/43-2-buttons-scaling-to-accommodate-different-device-sizes-e586ff1e.png)

Buttons can move in the layout, but elements should remain in the same order

