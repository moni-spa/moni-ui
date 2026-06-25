---
component: Tooltips
slug: tooltips
section: accessibility
category: All other components
source: "https://m3.material.io/components/tooltips/accessibility"
scraped_at: "2026-06-20T07:01:22.200Z"
tokens_count: 0
images_count: 4
---
# Tooltips

Tooltips display brief labels or messages

## Use cases

People should be able to do the following using assistive technology:

- Receive a tooltip message
- Activate a tooltip with a keyboard or switch input

## Interaction & style

Plain and rich tooltips without required actions should remain on screen long enough for people to receive the information without disrupting their existing flow or task.

check Do

Plain tooltips should remain on the screen temporarily after the cursor moves away

Tooltips can appear when an actionable element, like a button or navigation rail, is hovered or focused. However, this tooltip shouldn’t hide crucial information. Rich tooltips can also appear by selecting an element instead of hovering or focusing on it.

![A cursor hovers over a favorite button producing text about finding this item later in favorites.](../../assets/tooltips/accessibility/01-a-cursor-hovers-over-a-favorite-button-producing-text-about--851343a4.png)

Tooltips can appear on hover or focus to explain actions

![An information button in a selected state produces text about finding this item later in favorites.](../../assets/tooltips/accessibility/02-an-information-button-in-a-selected-state-produces-text-abou-177946c8.png)

Rich tooltips can appear when an element is selected

## Focus order

Tooltip containers should not block important information or prevent a person from completing an action. Focus order within the rich tooltip moves top to bottom between interactive elements. Avoid trapping screen reader and keyboard focus on rich tooltips. People should be able to move linearly through the rest of the page.

![Different elements of a rich tooltip are given a focus order, moving from parent element to inline link to text button.](../../assets/tooltips/accessibility/03-different-elements-of-a-rich-tooltip-are-given-a-focus-order-f4f104fd.png)

1. Parent element
2. Inline link
3. Text button

## Keyboard navigation

|
**Keys**

 |

**Actions**

 |
| --- | --- |
|

**Tab**

 |

Focus lands on button, if available

 |
|

**Space** or **Enter**

 |

Activates the focused element

 |

## Labeling elements

Tooltips should have the **Tooltip** role, or similar. Label all elements in the tooltip according to their own accessibility guidance.

![A rich and plain tooltip with all elements matched to accessibility labels.](../../assets/tooltips/accessibility/04-a-rich-and-plain-tooltip-with-all-elements-matched-to-access-f10bec0e.png)

The tooltip container should have the **Tooltip** role

