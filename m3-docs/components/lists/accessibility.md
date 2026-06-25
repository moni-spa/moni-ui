---
component: Lists
slug: lists
section: accessibility
category: All other components
source: "https://m3.material.io/components/lists/accessibility"
scraped_at: "2026-06-20T06:58:04.665Z"
tokens_count: 0
images_count: 15
---
# Lists

Lists are continuous, vertical indexes of text and images

## Use cases

People should be able to do the following with assistive technology:

- Navigate to a list item
- Select a list item

## Indicate selection with more than color

To make selected items clear for everyone, don't rely on color as the only visual cue. Use an additional indicator that an item is selected such as:

- Radio buttons [More on radio buttons](/m3/pages/radio-button/overview) or checkboxes [More on checkboxes](/m3/pages/checkbox/overview)
- Leading or trailing icons
- A visual style not related to color, like underlined text

![A selected list item with a colored background, and a check as the leading icon.](../../assets/lists/accessibility/01-a-selected-list-item-with-a-colored-background-and-a-check-a-3d5e2d4b.png)

Use two visual cues to show a list item is selected, like a leading checkmark and filled color

## Interaction & style

### Touch

When a person taps on a list item, a touch ripple appears, indicating interaction feedback. A ripple appears when a person taps on a list item to select it

### Cursor

When hovered, the hover [More on hover state](/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844) state provides a visual cue that a list item is interactive.

![A list with the second item visually altered while hovered over, with a cursor and darker fill.](../../assets/lists/accessibility/02-a-list-with-the-second-item-visually-altered-while-hovered-o-25020fdf.png)

Cursor: Hover

![Selected list item with cursor, colored fill, and checked box.](../../assets/lists/accessibility/03-selected-list-item-with-cursor-colored-fill-and-checked-box-5f001ce3.png)

Cursor: Selected

### Keyboard & switch

When a person tabs to a single-action list, a focus indicator appears, providing a visual cue that the first list item is now focused [More on focused state](/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f) and action can be taken. When a person interacts with the focused list item via **Space** or **Enter**, the action is performed.

**Tab** key navigates to the list. **Space** or **Enter** keys activate items.

## Focus

### Single-action lists

The first element in a list should always receive focus, unless the list has a selected element. In that case, focus should go to the selected list item instead. After an element is focused [More on focused state](/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f), a person should be able to navigate within the list using arrow keys.

![The first list item is automatically focused.](../../assets/lists/accessibility/04-the-first-list-item-is-automatically-focused-aa5c6251.png)

**Tab** key focuses on the first item or the selected item

![A second list item focused using an arrow key.](../../assets/lists/accessibility/05-a-second-list-item-focused-using-an-arrow-key-860d8099.png)

**Arrow** keys navigate up and down through list items

All list items must be able to be activated using the **Space** or **Enter** key.  

[More on single-action lists](/m3/pages/lists/guidelines#3e45f939-457a-44a8-8551-a2354c521d26)

![List item with focus indicator and filled checkbox, selected using the Space or Enter key.](../../assets/lists/accessibility/06-list-item-with-focus-indicator-and-filled-checkbox-selected--16d8e10e.png)

**Space** or **Enter** keys activate an element in a list

### Multi-action lists

Multi-action list items contain a primary action and at least one supplementary action. The list item as a whole isn't selectable; only the individual actions are. A person should be able to use a keyboard to:

- **Tab** to the list item, which focuses the first element
- Move between between all focusable elements in the list using the **Up**, **Down**, **Left**, and **Right** arrow keys
- Activate a focused element using **Space** or **Enter**

[More on multi-action lists](/m3/pages/lists/guidelines#db85439b-0e67-43b0-a2dc-61395738af64)

![The first element in a multi-action list is focused automatically.](../../assets/lists/accessibility/07-the-first-element-in-a-multi-action-list-is-focused-automati-5b4a24c0.png)

**Tab** brings the focus to the first action

![The list action, a bookmark, is focused using the Down or Right arrow.](../../assets/lists/accessibility/08-the-list-action-a-bookmark-is-focused-using-the-down-or-righ-0ffd2624.png)

**Down** and **Right** arrow keys move focus to the next action of the list item, or to the first action in the next item

![A trailing bookmark icon is focused in the second list item.](../../assets/lists/accessibility/09-a-trailing-bookmark-icon-is-focused-in-the-second-list-item-285c938b.png)

**Up** and **Left** arrow keys move focus to the previous action of the list item

![Label text and supporting text of the second list item is in focus using the Up or Left arrow.](../../assets/lists/accessibility/10-label-text-and-supporting-text-of-the-second-list-item-is-in-bf622e03.png)

If the focus is on a list item’s first action, the **Up** and **Left** arrows move focus back to the last action of the previous item

![The Space or Enter key activates an overflow menu on a list item.](../../assets/lists/accessibility/11-the-space-or-enter-key-activates-an-overflow-menu-on-a-list--ef6a45f5.png)

The **Space** or **Enter** key activates a selected action in a list

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

To move focus to the first list item, last list item, or outside of the list component

 |
|

Down and right arrow keys

 |

Moves to the next element in the list; if the focused element is the last in the list, it wraps back to the top of the list

 |
|

Up and left arrow keys

 |

Moves to the previous element in the list; if the focused element is the first in the list, it wraps back to the bottom of the list

 |
|

**Space** or **Enter**

 |

To select a list item not yet selected

 |

## Labeling elements

Accessibility [More on accessibility](/m3/pages/overview/principles) labels are used with assistive devices like screen readers. The accessibility label for a list item is typically the same as the **label text** and **supporting text**. Some labels, roles, and states are [dependent on platform](/m3/pages/lists/accessibility#09e32b7d-78a1-45c1-be12-4c6646cfe1d1).

![List item selected to show label of “Bread, sourdough or wheat”.](../../assets/lists/accessibility/12-list-item-selected-to-show-label-of-bread-sourdough-or-wheat-93475de3.png)

A list item’s **label text** and **supporting text** is used for its accessibility label

### Platform-specific labels 

#### Single-select lists

|
**Trait**

 |

 |

 |

**Jetpack Compose**

 |
| --- | --- | --- | --- |
|

Aria label

 |

Container label: Should describe selection type

List item: Should match the visible label text 

 |

List item: Should match the visible label text 

 |

List item: Should match the visible label text 

 |
|

Role

 |

Container: List box  List item: Option

 |

List item: Radio button

 |

List item: Radio button

 |
|

State

 |

Selected or Not-selected

 |

Checked or Not-checked

 |

Checked or Not-checked

 |

#### Multi-select lists

|
**Trait**

 |

 |

 |

**Jetpack Compose**

 |
| --- | --- | --- | --- |
|

Aria label

 |

Container label: Should describe selection type

List item: Should match the visible label text 

 |

List item: Should match the visible label text

 |

List item: Should match the visible label text 

 |
|

Role

 |

Container: List box  List item: Option

 |

List item: Checkbox

 |

List item: Checkbox

 |
|

State

 |

Selected or Not-selected

 |

Checked or Not-checked

 |

Checked or Not-checked

 |

On web, a list container’s accessibility label describes the type of selection that can be made, and the role is **List box**.

![A list container is selected, showing a label of “Select either bread, pita, or rice” and role of “List box.”](../../assets/lists/accessibility/13-a-list-container-is-selected-showing-a-label-of-select-eithe-73b8b393.png)

On web, a list container’s role is **List box**

On Jetpack Compose, the role applies to the list item as a whole. If a list isn't selectable, the label text is read out without a role.

![A selected list item shows a label of “Bread, sourdough, or wheat” and role of “Checkbox.”](../../assets/lists/accessibility/14-a-selected-list-item-shows-a-label-of-bread-sourdough-or-whe-915b4b11.png)

When selectable, the role **Checkbox** applies to the entire list item on Jetpack Compose

On Android Views (MDC-Android), components contained within the list should be labeled according to that component’s specific guidelines:

- [Checkbox](/m3/pages/checkbox/accessibility)
- [Radio button](/m3/pages/radio-button/accessibility)

![Checkbox of a selected list item shows label of “Bread, sourdough or wheat” and role of “Checkbox.”](../../assets/lists/accessibility/15-checkbox-of-a-selected-list-item-shows-label-of-bread-sourdo-73ab248a.png)

On Android Views (MDC-Android), the accessibility label and role are applied to the interactive component by default

