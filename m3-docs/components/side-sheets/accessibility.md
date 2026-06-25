---
component: Side sheets
slug: side-sheets
section: accessibility
category: Sheets
source: "https://m3.material.io/components/side-sheets/accessibility"
scraped_at: "2026-06-20T06:59:48.462Z"
tokens_count: 0
images_count: 4
---
# Side sheets

Side sheets show secondary content anchored to the side of the screen

## Use cases

People should be able to dismiss the side sheet using assistive technology.

## Interaction & style

Material requires that a close affordance, such as a close icon button [More on icon buttons](/m3/pages/icon-buttons/overview), is always present within a side sheet.

![Side sheet correctly designed with close icon in upper right corner.](../../assets/side-sheets/accessibility/01-side-sheet-correctly-designed-with-close-icon-in-upper-right-8c08dab2.png)

check DoA close icon button makes the side sheet easy to dismiss 

![Side sheet incorrectly designed with no close icon button.](../../assets/side-sheets/accessibility/02-side-sheet-incorrectly-designed-with-no-close-icon-button-db7115c3.png)

close Don’t

Without a close icon button, people can’t predict the opening and closing flow of side sheets, or know if the sheet is transient or permanent

## Initial focus

Actions within a side sheet can be focused [More on focused state](/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f) by tab order using a keyboard or switch control.

![Side sheet diagram showing the focus order of headline, close, save, cancel.](../../assets/side-sheets/accessibility/03-side-sheet-diagram-showing-the-focus-order-of-headline-close-2e120e56.png)

Visible focus shown on the available actions within a side sheet:

1. Headline
2. Cancel
3. Save

## Keyboard navigation

|
Keys

 |

Actions

 |
| --- | --- |
|

**Tab**

 |

Focus lands on (non-disabled) icon button

 |
|

**Space** or **Enter**

 |

Activates the (non-disabled) icon button

 |

## Labeling

The accessibility role for a side sheet is **Dialog**.

![Side sheet showing the accessibility role as dialog.](../../assets/side-sheets/accessibility/04-side-sheet-showing-the-accessibility-role-as-dialog-e5820172.png)

The role for side sheets is **Dialog**

