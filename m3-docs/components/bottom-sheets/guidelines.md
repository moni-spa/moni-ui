---
component: Bottom sheets
slug: bottom-sheets
section: guidelines
category: Sheets
source: "https://m3.material.io/components/bottom-sheets/guidelines"
scraped_at: "2026-06-20T06:55:34.216Z"
tokens_count: 0
images_count: 22
---
# Bottom sheets

Bottom sheets show secondary content anchored to the bottom of the screen

![Two variants of bottom sheets.](../../assets/bottom-sheets/guidelines/01-two-variants-of-bottom-sheets-b46a6a0a.png)

1. Standard bottom sheets
2. Modal bottom sheets

## Usage

Bottom sheets display supplementary content and actions on a mobile screen.

![Photo sharing bottom sheet with contact list, app icons, and action buttons.](../../assets/bottom-sheets/guidelines/02-photo-sharing-bottom-sheet-with-contact-list-app-icons-and-a-827b050b.png)

Bottom sheet containing contacts and applications

Bottom sheets are a versatile component that can contain a wide variety of information and layouts [More on layout](/m3/pages/layout-overview/overview), including Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview) items (in list [More on lists](/m3/pages/lists/overview) or grid layouts), actions, and supplemental content.

![Bottom sheet displaying 3 menu options.](../../assets/bottom-sheets/guidelines/03-bottom-sheet-displaying-3-menu-options-9fcb0926.png)

Bottom sheet with menu items in a list

## Anatomy

A container is the only required element of a bottom sheet. Bottom sheet layouts [More on layout](/m3/pages/layout-overview/overview) can vary widely to support the kinds of content they contain.

![3 elements of a bottom sheet.](../../assets/bottom-sheets/guidelines/04-3-elements-of-a-bottom-sheet-e6edd9dc.png)

1. Container
2. Drag handle (optional)
3. Scrim (modal only)

### Container

Bottom sheet containers hold all bottom sheet elements. Their size is determined by the space those elements occupy. The container is the only required element of a bottom sheet. All other elements are optional.

![Empty bottom sheet container.](../../assets/bottom-sheets/guidelines/05-empty-bottom-sheet-container-2d1835d2.png)

Bottom sheets are flexible containers that adapt to their content and available space

### List items (optional)

Lists [More on lists](/m3/pages/lists/overview) are a continuous group of text or images. List items can include label text, icons, and text buttons [More on buttons](/m3/pages/common-buttons/overview), among other elements.

![A bottom sheet displaying a list of actions for a song.](../../assets/bottom-sheets/guidelines/06-a-bottom-sheet-displaying-a-list-of-actions-for-a-song-7ae66787.png)

Bottom sheet containing a list with icons

### Dividers (optional)

Dividers [More on dividers](/m3/pages/divider/overview) can be used to separate related content in bottom sheets.

![Bottom sheet with image action buttons and contact list separated by an inset divider.](../../assets/bottom-sheets/guidelines/07-bottom-sheet-with-image-action-buttons-and-contact-list-sepa-16b1a402.png)

Bottom sheet with a divider separating kinds of actions

### Media (optional)

**Thumbnail**
Bottom sheets can include thumbnails for an avatar or logo.

**Image**
Bottom sheets can include photos, illustrations, and other graphics, such as weather icons.

**Video**
Bottom sheets can include video.

![A bottom sheet displaying various media formats, including thumbnails, images, and video.](../../assets/bottom-sheets/guidelines/08-a-bottom-sheet-displaying-various-media-formats-including-th-a6f1f688.png)

Bottom sheets can contain thumbnails, images, and video

## Standard bottom sheets

Standard bottom sheets co-exist with the screen’s main UI region and allow for simultaneously viewing and interacting with both regions, especially when the main UI region is frequently scrolled or panned. Use a standard bottom sheet to display content that complements the screen’s primary content, such as an audio player in a music app.

![Bottom sheet with music player controls visible while browsing albums.](../../assets/bottom-sheets/guidelines/09-bottom-sheet-with-music-player-controls-visible-while-browsi-58c8f8db.png)

The music player in this standard bottom sheet allows people to control their music while browsing albums

At full-screen height, standard bottom sheets contain a collapse icon in an app bar to return to their initial position. Standard bottom sheets can contain supplementary content that continues below the screen, such as location information over a map. A bottom sheet can have preset positions from full-screen height to preview

## Modal bottom sheets

Like dialogs [More on dialogs](/m3/pages/dialogs/overview), modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.

![A modal sheet with filter options to categorize files in the app.](../../assets/bottom-sheets/guidelines/10-a-modal-sheet-with-filter-options-to-categorize-files-in-the-102cb6f3.png)

A modal bottom sheet must be interacted with or dismissed. Its blocking behavior makes it suitable for a menu, such as in this files app, to help people focus on their available choices. Use a modal bottom sheet as an alternative to inline menus [More on menus](/m3/pages/menus/overview) or simple dialogs [More on dialogs](/m3/pages/dialogs/overview) on mobile, especially when offering a long list [More on lists](/m3/pages/lists/overview) of action items, or when items require longer descriptions and icons. Modal bottom sheets are used in mobile apps only.

![A modal bottom sheet displayed as an alternative to a traditional menu, presenting a list of actions.](../../assets/bottom-sheets/guidelines/11-a-modal-bottom-sheet-displayed-as-an-alternative-to-a-tradit-ffcdc72a.png)

Modal bottom sheets can be used instead of menus to present additional actions

### Visibility

To provide access to its top actions, the initial vertical position of modal bottom sheets is capped at 50% of the screen height. Modal bottom sheets whose contents exceed 50% of the screen height can then be pulled across the full screen and scrolled internally to access their remaining items.

![A modal bottom sheet covering half of the screen, so both images and actions are accessible.](../../assets/bottom-sheets/guidelines/12-a-modal-bottom-sheet-covering-half-of-the-screen-so-both-ima-7a87309f.png)

The initial vertical position of modal bottom sheets can't exceed 50% of the screen height

Modal bottom sheets appear when triggered by a user action, such as tapping a button [More on buttons](/m3/pages/common-buttons/overview) or an overflow icon. They can be dismissed by:

- Tapping a Menus display a list of choices on a temporary surface. More on menus [More on menus](/m3/pages/menus/overview) item or action within the bottom sheet
- Tapping the scrim
- Swiping the sheet down
- Using a close affordance within the bottom sheet’s app bar [More on app bars](/m3/pages/app-bars/overview), if available

Display a close affordance in a full-screen modal bottom sheet.

![A modal bottom sheet disappearing by tapping the scrim.](../../assets/bottom-sheets/guidelines/13-a-modal-bottom-sheet-disappearing-by-tapping-the-scrim-186d91ef.png)

Tapping the scrim dismisses a modal bottom sheet

![A modal bottom sheet disappearing by swiping the sheet down.](../../assets/bottom-sheets/guidelines/14-a-modal-bottom-sheet-disappearing-by-swiping-the-sheet-down-4ecb4999.png)

A modal bottom sheet can be dismissed by swiping the sheet down

## Responsive layout

### Compact window size

In compact window sizes [More on compact window size class](/m3/pages/breakpoints/compact), like mobile devices, bottom sheets extend across the width of a screen and are elevated above the primary content.

![A bottom sheet extended to the width of a mobile screen.](../../assets/bottom-sheets/guidelines/15-a-bottom-sheet-extended-to-the-width-of-a-mobile-screen-964e4876.png)

Bottom sheets should extend to the width of the screen on mobile

### Medium and expanded window sizes

For larger screens with medium [More on medium window size class](/m3/pages/breakpoints/medium) and expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded), bottom sheets have a default max-width to prevent undesired layouts [More on layout](/m3/pages/layout-overview/overview) and awkward spacing. However, this can be overridden if needed. For more complex tasks and flows, consider using a non-transient surface such as a floating sheet .

![A bottom sheet extended to its max-width on a large screen device, not spanning the full screen.](../../assets/bottom-sheets/guidelines/16-a-bottom-sheet-extended-to-its-max-width-on-a-large-screen-d-ffa26fa9.png)

Bottom sheets on larger screens like tablet have a max width that can be overridden

On larger expanded window sizes [More on expanded window size class](/m3/pages/breakpoints/expanded), like desktop, a bottom sheet can be swapped for a side sheet [More on side sheets](/m3/pages/side-sheets/overview) that shows similar content.

![A side sheet on desktop.](../../assets/bottom-sheets/guidelines/17-a-side-sheet-on-desktop-4a0942f2.png)

Side sheets can contain the same content as bottom sheets and may be more suitable for desktop

## Behavior

Bottom sheets can offer an expansion option where the sheet is fully raised and toggled between a collapsed and expanded state [More on states](/m3/pages/interaction-states/overview). This provides a more predictable footprint of the sheet, and can be set by the system or toggled by the user.

![Bottom sheet fully raised, showing photo actions, sharing options, and albums to add the photo to.](../../assets/bottom-sheets/guidelines/18-bottom-sheet-fully-raised-showing-photo-actions-sharing-opti-40d7eb04.png)

A bottom sheet for sharing can appear fully raised if needed

![Collapsed bottom sheet, showing focused set of options.](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flvp8870t-19.png?alt=media&token=3f9b36b6-7621-48f9-bec4-8260503c7e75)

Alternately, a bottom sheet for sharing can appear collapsed for a more focused set of actions

### Custom positioning

The drag handle can be dragged or selected to change the bottom sheet height. Sheets should be able to cycle through preset heights and close completely without dragging. Selecting the drag handle should toggle through preset heights or close the sheet, while selecting the scrim should always close the bottom sheet. If the bottom sheet has multiple preset heights but can’t use a drag handle, Material requires the inclusion of a single-pointer alternative to change height.

![Bottom sheet with a visible drag handle that can be used to adjust its height.](../../assets/bottom-sheets/guidelines/20-bottom-sheet-with-a-visible-drag-handle-that-can-be-used-to--9f280ad6.png)

Interacting with the drag handle can quickly move a bottom sheet through preset heights

![Bottom sheet resized using the visible drag handle.](../../assets/bottom-sheets/guidelines/21-bottom-sheet-resized-using-the-visible-drag-handle-43608305.png)

A bottom sheet can automatically resize to another height after interacting with the drag handle

### Scrolling

Bottom sheets can be horizontally scrolled, independent of the rest of the screen’s content.

![Bottom sheet that can be scrolled horizontally.](../../assets/bottom-sheets/guidelines/22-bottom-sheet-that-can-be-scrolled-horizontally-9172e2a0.png)

Bottom sheets should be scrollable when their content exceeds the initial viewable height

### Back

On Android, a gesture [More on gestures](/m3/pages/gestures) called predictive back allows a user to swipe left or right on the bottom sheet. 

- Bottom sheet detaches from the left and right edges of the screen to signal it will close
- Previous screen is revealed in a preview

A list of compatible components is available in the [gestures article](/m3/pages/gestures). Preview of the result of the gesture, **release** to commit, **fling** to commit, and **cancel**

