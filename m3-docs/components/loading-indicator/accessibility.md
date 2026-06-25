---
component: Loading indicator
slug: loading-indicator
section: accessibility
category: Loading & progress
source: "https://m3.material.io/components/loading-indicator/accessibility"
scraped_at: "2026-06-20T06:58:17.013Z"
tokens_count: 0
images_count: 4
---
# Loading indicator

Loading indicators show the progress of a process for a short wait time

## Use cases

People should be able to do the following with assistive technology:

- Navigate to the loading indicator
- Understand what progress the indicator is communicating
- Initiate a content refresh without relying on a gesture

## Interaction & style

The active indicator, which displays progress, provides visual contrast of at least 3:1 against most container and surface colors. The indicator itself must have 3:1 contrast with the background, but the container does not.

![Loading indicator with 3:1 color contrast.](../../assets/loading-indicator/accessibility/01-loading-indicator-with-3-1-color-contrast-9a2203bc.png)

The loading indicator provides visual contrast of at least 3:1 against most background colors

When integrated into another component, such as a button, make sure that the active indicator provides a visual contrast of at least 3:1 against the other component.

![Loading indicator with correct color contrast.](../../assets/loading-indicator/accessibility/02-loading-indicator-with-correct-color-contrast-68517af0.png)

check Do

Ensure at least 3:1 contrast between the indicator and the surface it's on

![Loading indicator with incorrect color contrast.](../../assets/loading-indicator/accessibility/03-loading-indicator-with-incorrect-color-contrast-0a6b654d.png)

close Don’t

Avoid using when the contrast is under 3:1

Pull-to-refresh interactions can’t be accessible by just swiping. Provide an alternate way to refresh the content with a single pointer, such as placing a refresh button in a menu or directly alongside the content. The refresh action can be in an app bar

## Labeling elements

Since the loading indicator is a visual cue, it needs an accessibility label to assist people who can't rely on visuals. It should use the **progress bar** accessibility role. Write a label describing the purpose of the loading indicator, such as **loading news article** or **refreshing page**.

![Loading indicator accessibility label and role.](../../assets/loading-indicator/accessibility/04-loading-indicator-accessibility-label-and-role-11fda48a.png)

Loading indicator labels should explain which items are loading

