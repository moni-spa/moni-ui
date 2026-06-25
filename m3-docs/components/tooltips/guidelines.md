---
component: Tooltips
slug: tooltips
section: guidelines
category: All other components
source: "https://m3.material.io/components/tooltips/guidelines"
scraped_at: "2026-06-20T07:01:16.823Z"
tokens_count: 0
images_count: 17
---
# Tooltips

Tooltips display brief labels or messages

![A plain tooltip labeling a button, and a rich tooltip announcing new settings available.](../../assets/tooltips/guidelines/01-a-plain-tooltip-labeling-a-button-and-a-rich-tooltip-announc-435a5589.png)

Plain and rich tooltips serve different purposes

## Usage

A tooltip provides additional context for a UI element. 

**Plain tooltips**
Plain tooltips briefly describe a UI element. They're best used for labelling UI elements with no text, like icon-only buttons [More on buttons](/m3/pages/common-buttons/overview) and fields.

**Rich tooltips**
Rich tooltips provide additional context about a UI element. They can optionally contain a subhead, buttons, and hyperlinks. Rich tooltips are best used for longer text like definitions or explanations.

![2 variants of tooltips.](../../assets/tooltips/guidelines/02-2-variants-of-tooltips-8c7bf04c.png)

1. Plain tooltip
2. Rich tooltip

![Plain tooltip labeling an icon-only button in Google Meet as "Present now".](../../assets/tooltips/guidelines/03-plain-tooltip-labeling-an-icon-only-button-in-google-meet-as-6304c600.png)

check Do

Use plain tooltips to label icon-only buttons

![Button with an icon and label text saying "Edit". It has a plain tooltip on hover that also says "Edit".](../../assets/tooltips/guidelines/04-button-with-an-icon-and-label-text-saying-edit-it-has-a-plai-13121441.png)

close Don’t

Plain tooltips aren't needed when the UI element already has label text

![Rich tooltip describing a new button for adding people. It has a subhead, description, and a button to learn more.](../../assets/tooltips/guidelines/05-rich-tooltip-describing-a-new-button-for-adding-people-it-ha-3c7f13c2.png)

check Do

Use rich tooltips to provide extra information and actions about a UI element or new feature

![Rich tooltip explaining that an action is destructive and permanently deletes files.](../../assets/tooltips/guidelines/06-rich-tooltip-explaining-that-an-action-is-destructive-and-pe-8285937f.png)

close Don’t

Don't hide critical information within tooltips as it’s easy to miss. Use an interruptive dialog instead.

## Anatomy

### Plain tooltip

![2 elements of a plain tooltip.](../../assets/tooltips/guidelines/07-2-elements-of-a-plain-tooltip-af9d8176.png)

1. Container
2. Supporting text

### Supporting text

![Plain tooltip for an icon-only button shaped like a gear. The tooltip text is "Settings".](../../assets/tooltips/guidelines/08-plain-tooltip-for-an-icon-only-button-shaped-like-a-gear-the-76f1b850.png)

check Do

Briefly describe a UI element

![Plain tooltip for the account switcher. The supporting text includes the user's name and email address on new lines.](../../assets/tooltips/guidelines/09-plain-tooltip-for-the-account-switcher-the-supporting-text-i-22816dc6.png)

exclamation Caution

Avoid wrapping text to multiple lines or including many pieces of information

### Rich tooltip

![4 elements of a rich tooltip.](../../assets/tooltips/guidelines/10-4-elements-of-a-rich-tooltip-62fe637e.png)

1. Subhead (optional)
2. Container
3. Supporting text
4. Text button (optional)

### Subhead (optional)

Keep subheads brief, ideally to one line. They should summarize or describe the message of the rich tooltip . Subheads are important to include when the rich tooltip appears automatically, like when the page loads.

![Rich tooltip with a brief subhead, supporting text, and a text button.](../../assets/tooltips/guidelines/11-rich-tooltip-with-a-brief-subhead-supporting-text-and-a-text-b150f85d.png)

check Do

Summarize the message in a few words

![Rich tooltip with a subhead wrapping to multiple lines.](../../assets/tooltips/guidelines/12-rich-tooltip-with-a-subhead-wrapping-to-multiple-lines-64db2a6d.png)

close Don’t

Avoid wrapping to more than one line

### Text buttons (optional)

Rich tooltips can have up to two text buttons [More on buttons](/m3/pages/common-buttons/overview). These should be brief and relevant to the message in the supporting text. Keep buttons short so they can be side by side. Avoid stacking them when possible.

![Rich tooltip with 2 buttons stacked on each other.](../../assets/tooltips/guidelines/13-rich-tooltip-with-2-buttons-stacked-on-each-other-de396559.png)

exclamation Caution

Avoid stacking buttons

## Placement

### Plain tooltips

By default, plain tooltips are positioned directly above the parent element. 

- If there's a visual boundary, like a button, the distance is 4dp
- If there's no visual boundary, like with text baselines, the distance is 8dp

If the element is in an app bar [More on app bars](/m3/pages/app-bars/overview), the plain tooltip appears below the element at the same distance.

![Plain tooltip appearing 4dp below a button with a clear visual boundary.](../../assets/tooltips/guidelines/14-plain-tooltip-appearing-4dp-below-a-button-with-a-clear-visu-5e7e574a.png)

Plain tooltip with a 4dp distance between the target and tooltip

### Rich tooltips

By default, rich tooltips are positioned to the bottom right of the parent element. They adjust position to avoid going off screen. Tooltips shouldn't cover the parent element. 

**Dynamic positioning**
The position of the tooltip adjusts in increments of 8dp to avoid going off-screen.

**Desktop placement**
On desktop, tooltips may appear centered below the parent element and remain visible while moving within the target region.

![A rich tooltip in 4 different corners. It   changes position to remain fully on screen.](../../assets/tooltips/guidelines/15-a-rich-tooltip-in-4-different-corners-it-changes-position-to-28532371.png)

Four different rich tooltip locations based on dynamic positioning

## Behavior

To show a tooltip, hover [More on hover state](/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844) on the parent element on desktop, or tap and hold the element on mobile. Persistent rich tooltips only appear when clicked or tapped.

### Transient by default

Both plain and rich tooltips disappear 1.5 seconds after navigating away from the target region. Triggering a new tooltip immediately closes any other open tooltip. Tooltips disappear after a 1.5 second delay when no other element is hovered

![2 buttons both showing plain tooltips at once.](../../assets/tooltips/guidelines/16-2-buttons-both-showing-plain-tooltips-at-once-0ece63f8.png)

close Don’t

Only display one tooltip at a time

### Persistent rich tooltips

Persistent rich tooltips appear when either:

- The parent element is clicked
- The page loads and a new feature is being explained

Persistent rich tooltips remain active even when leaving the target region. They only disappear once a person interacts with another UI element. Hovering doesn't trigger the tooltip. When appearing on page load, the tooltip can introduce and explain new features on various parent elements. Avoid using persistent rich tooltips on icon buttons.

![Persistent rich tooltip about a new sharing feature in the Photos app. The button says  "Learn more.”](../../assets/tooltips/guidelines/17-persistent-rich-tooltip-about-a-new-sharing-feature-in-the-p-9ddf9a93.png)

close Don’t

Don’t use a persistent rich tooltip on icon buttons

