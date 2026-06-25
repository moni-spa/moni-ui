---
component: Carousel
slug: carousel
section: accessibility
category: All other components
source: "https://m3.material.io/components/carousel/accessibility"
scraped_at: "2026-06-20T06:56:21.517Z"
tokens_count: 1
images_count: 8
---
# Carousel

Carousels show a collection of items that can be scrolled on and off the screen

## Use cases

Users should be able to do the following with assistive technology:

- Navigate to the carousel container
- Navigate between different carousel items
- Activate a carousel item
- Skip over the carousel items

## Requirements on scrolling pages

On vertically-scrolling pages, carousels require an accessible way to view all the items without horizontally scrolling. (This requirement doesn't apply to full-screen carousels .)

Material recommends adding a **Show all** button below the carousel, which opens a dedicated vertically-scrolling page of all carousel items. Carousels without headers should use a **Show all** button to view all carousel items

![Measurements of a "show all" button added below a carousel.](../../assets/carousel/accessibility/01-measurements-of-a-show-all-button-added-below-a-carousel-4637d8ab.png)

The **Show all** button should have a padding of 4dp

If the carousel has a header, you can use an arrow icon button instead. Place the arrow icon directly next to the header or in the same row. Make sure the header is also displayed on the page of all carousel items. Carousels with headers should use an arrow to view all carousel items

![Measurements of an arrow icon button added next to a carousel header.](../../assets/carousel/accessibility/02-measurements-of-an-arrow-icon-button-added-next-to-a-carouse-2e49f4cd.png)

Headers should align with the leading edge, and the arrow icon should have a size of 48dp 

Avoid customizing the accessibility solution when possible. However, if your product needs an alternative solution, consider adding a **Show all** button in nearby navigation, or add alternative control buttons close to the carousel. Avoid adding UI elements, like arrows or other icons, within or beside the carousel.

![Arrow icons on the left and right of the carousel, reducing container width.](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwykx1vc-5a-don't.png?alt=media&token=88d824af-cca5-4743-a7f4-5dc1776d152e)

close Don’t

Avoid adding buttons into the carousel container or beside it. Place any buttons above or below the carousel.

![Arrow icons floating on top of the carousel edge, concealing items.](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgoogle-material-3%2Fimages%2Flwykxhsn-5b-don't.png?alt=media&token=7253d6f2-ad26-4cd6-854c-e5b47725c499)

close Don’t

Don't cover the carousel with buttons or other UI

## Interaction & style

### Touch

Tapping on a carousel item changes the shape slightly, and creates a touch ripple for interaction feedback. Touch: Tap

### Cursor

The hover state [More on hover state](/m3/pages/interaction-states/applying-states#71c347c2-dd75-485b-892e-04d2900bd844) provides a visual cue that the carousel item is interactive. When the carousel item is clicked (in both active and inactive states), a ripple appears for interaction feedback. Cursor: Hover, click

### Initial focus

When navigating to a carousel using assistive technology, use **Tab** to place initial focus on the first carousel item. Then, use **Tab** or the arrow keys to navigate the carousel items. Use the up and down arrow keys to leave the carousel and focus on the next element on the page, like the **Show all** button.

![Diagram of how to navigate a carousel using assistive technology.](../../assets/carousel/accessibility/05-diagram-of-how-to-navigate-a-carousel-using-assistive-techno-91a4037a.png)

check Do

Set initial focus on the first carousel item, and use arrows to navigate items

![Diagram of how not to navigate a carousel using assistive technology.](../../assets/carousel/accessibility/06-diagram-of-how-not-to-navigate-a-carousel-using-assistive-te-8e0d9bae.png)

close Don’t

Avoid focusing on the carousel container

## Keyboard navigation

| Keys | Actions |
| --- | --- |
| **Tab** or **Arrows** | Moves to the previous or next carousel item
 |
| **Space** or **Enter** | Activates the focused [More on focused state](/m3/pages/interaction-states/applying-states#bc6d6853-48ef-490e-8076-448e89e69f0f) carousel item |

## Labeling elements

The carousel container has the **container** role.

![Accessibility labels of a carousel.](../../assets/carousel/accessibility/07-accessibility-labels-of-a-carousel-e06637d6.png)

The carousel container is labelled appropriately and has the **container** role

Each carousel may have a different number of items, so the label reads out the total amount of items and the current item in focus.

![Accessibility labels of a carousel item.](../../assets/carousel/accessibility/08-accessibility-labels-of-a-carousel-item-ed631a9e.png)

The carousel item label indicates the current item in focus and the total number of items

## Reduced motion

When reduced motion settings are turned on, the parallax effect should be removed and carousel items should no longer expand as they come into view. All items are the same size. Make sure carousels with reduced motion reach the edges of the window to avoid clipping visuals.

1. Default carousel for multi-scroll
2. Carousel with reduced motion settings turned on

For hero carousels with reduced motion, the small carousel item is only partially shown on screen.

1. Default carousel for single-scroll
2. Carousel with reduced motion settings turned on

