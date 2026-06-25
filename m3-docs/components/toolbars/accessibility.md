---
component: Toolbars
slug: toolbars
section: accessibility
category: All other components
source: "https://m3.material.io/components/toolbars/accessibility"
scraped_at: "2026-06-20T07:01:08.279Z"
tokens_count: 0
images_count: 3
---
# Toolbars

Toolbars display frequently used actions relevant to the current page

## Use cases

People should be able to the following with assistive technology:

- Navigate and activate any actions in the toolbar
- Select a destination from a menu
- Activate a back button
- Maintain access to toolbar controls when the content is scrolled or collapsed

## Interaction & style

The toolbar has no interactions by default. All interactions are with the elements placed inside. 

**Touch**

- When tapping on an icon button in the toolbar, a touch ripple appears, indicating interaction feedback. Touch: Tap

**Cursor**

- When hovered, the hover state provides a visual cue to the user that the element is interactive.
- When clicked (in both active and inactive states), a ripple appears, showing the user feedback. Cursor: Hover, Click

### Initial focus

Focus lands on the first interactive element. Use **Tab** to navigate through all other actions.

![Navigating the top app bar using arrow or tab on a keyboard.](../../assets/toolbars/accessibility/01-navigating-the-top-app-bar-using-arrow-or-tab-on-a-keyboard-7bec5a2e.png)

Use **Tab** to navigate through interactive elements

![Activating actions in the top app bar using space or enter on a keyboard.](../../assets/toolbars/accessibility/02-activating-actions-in-the-top-app-bar-using-space-or-enter-o-6c9be508.png)

Use **Space** or **Enter** to activate actions

## Keyboard navigation

<table style="width:100%"><tbody><tr><th>Keys</th><td>Actions</td></tr><tr><th><span style="white-space:pre-wrap" id="isPasted">Tab or Arrows</span><br></th><td><span style="white-space:pre-wrap" id="isPasted">Navigate between interactive elements</span></td></tr><tr><th><span style="white-space:pre-wrap" id="isPasted">Space or&nbsp;Enter</span><br></th><td><span style="white-space:pre-wrap" id="isPasted">Activate the focused element</span></td></tr></tbody></table>

### Labeling elements

On web, the toolbar container should have the **toolbar** role. On mobile, it can be a generic container. All actions inside the toolbar should follow their respective accessibility guidelines.

![A toolbar on web, with a “toolbar” role label.](../../assets/toolbars/accessibility/03-a-toolbar-on-web-with-a-toolbar-role-label-3725e40d.png)

On web, use the **toolbar** role

