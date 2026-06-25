---
component: Button groups
slug: button-groups
section: accessibility
category: Buttons
source: "https://m3.material.io/components/button-groups/accessibility"
scraped_at: "2026-06-20T06:55:45.758Z"
tokens_count: 1
images_count: 4
---
# Button groups

Button groups organize buttons and add interactions between them

## Use cases

People should be able to do the following with assistive technology:

- Navigate to and interact with each button in the group
- Identify when buttons are selected

## Interaction & style

Each button in a group should have a minimum 48x48dp target. Extra small and small button groups have larger inner padding to ensure accessible targets. Avoid reducing the padding in these sizes.

![Extra small and small button groups with 48x48dp target areas annotated over top. The area is larger than the buttons.](../../assets/button-groups/accessibility/01-extra-small-and-small-button-groups-with-48x48dp-target-area-3ec15eff.png)

1. Extra small button group
2. Small button group

### Initial focus

The button group container is not a focusable element. Initial focus should land on the first button in the group and then move to each button.

![Focus order lands on the first button, then the next buttons.](../../assets/button-groups/accessibility/02-focus-order-lands-on-the-first-button-then-the-next-buttons-a66afe7a.png)

Initial focus should land on the first button, not on the container

Use **Tab** to navigate through each item in the group, and **Space** or **Enter** to select buttons.

![Button group with annotations for navigation with Tab and selecting with Space or Enter.](../../assets/button-groups/accessibility/03-button-group-with-annotations-for-navigation-with-tab-and-se-074c908b.png)

1. Initial focus
2. Selected button

## Keyboard navigation

|
Keys

 |

Actions

 |
| --- | --- |
| Tab | Navigates to the next button |
| Space or Enter | Activates the focused button |

## Labeling elements

The button group container does not need to be labeled. Label each button according to the button [More on buttons](/m3/pages/common-buttons/overview) and icon button [More on icon buttons](/m3/pages/icon-buttons/overview) accessibility guidance.

![In a messaging products, an email icon is labelled “email” with the role “button”.](../../assets/button-groups/accessibility/04-in-a-messaging-products-an-email-icon-is-labelled-email-with-e6302920.png)

Label each button within the button group

