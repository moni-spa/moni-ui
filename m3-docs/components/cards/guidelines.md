---
component: Cards
slug: cards
section: guidelines
category: All other components
source: "https://m3.material.io/components/cards/guidelines"
scraped_at: "2026-06-20T06:56:03.475Z"
tokens_count: 0
images_count: 35
---
# Cards

![3 variants of cards: elevated, filled, and outlined.](../../assets/cards/guidelines/01-3-variants-of-cards-elevated-filled-and-outlined-a07a540f.png)

## Usage

Use a card to display content and actions on a single topic. Cards should be easy to scan for relevant and actionable information. Elements like text and images should be placed on cards in a way that clearly indicates hierarchy.

![Example card containing an image, title, text, and button.](../../assets/cards/guidelines/02-example-card-containing-an-image-title-text-and-button-99c3c4bf.png)

Cards can display content and actions on a single topic

Cards can serve as entry points into deeper levels of detail or navigation, such as a music album or details on an upcoming vacation.

![Example world tour card.](../../assets/cards/guidelines/03-example-world-tour-card-74c0e066.png)

Card text and image show a clear hierarchy

![Card displaying connected details about a world tour.](../../assets/cards/guidelines/04-card-displaying-connected-details-about-a-world-tour-f6d345ca.png)

Use cards to display related information on a single subject

Cards can be displayed together in a grid, vertical list, or carousel [More on carousels](/m3/pages/carousel/overview).

![4 cards together in a grid layout.](../../assets/cards/guidelines/05-4-cards-together-in-a-grid-layout-47f1ce48.png)

check Do

Cards can be shown together

![5 albums in a vertical list of cards.](../../assets/cards/guidelines/06-5-albums-in-a-vertical-list-of-cards-80328f49.png)

close Don’t

Don't force content into cards when spacing, headlines, or dividers would create a simpler visual hierarchy

There are three card variants:

- Elevated
- Filled
- Outlined

Each provides the same legibility and functionality, so the variant you use depends on style alone.

![3 variants of cards.](../../assets/cards/guidelines/07-3-variants-of-cards-3414459e.png)

1. Elevated card
2. Filled card
3. Outlined card

![Example elevated card.](../../assets/cards/guidelines/08-example-elevated-card-1323885c.png)

Elevated cards have a drop shadow, providing more separation from the background than filled cards, but less than outlined cards

![Example filled card.](../../assets/cards/guidelines/09-example-filled-card-07f31e30.png)

Filled cards provide subtle separation from the background. This has less emphasis than elevated or outlined cards.

![Example outlined card.](../../assets/cards/guidelines/10-example-outlined-card-8a5939d5.png)

Outlined cards have a visual boundary around the container. This can provide greater emphasis than the other variants.

## Anatomy

The card container is the only required element in a card. Card layouts can vary to support the kinds of content they contain. Below is a common configuration of elements.

![Diagram labeling the 6 parts of card anatomy.](../../assets/cards/guidelines/11-diagram-labeling-the-6-parts-of-card-anatomy-86c08200.png)

1. Container
2. Image
3. Button
4. Supporting text
5. Subhead
6. Headline

### Container

Card containers hold all card elements. Their size is determined by the space those elements occupy. Card elevation is expressed by the container. The card container is the only required element of a card. All other elements are optional.

![3 card containers with various elements: 1 with all elements except a button. 1 with a container, headline, supporting text, button. 1 with a container, headline, supporting text, 2 buttons.](../../assets/cards/guidelines/12-3-card-containers-with-various-elements-1-with-all-elements--8fa245d5.png)

Card size is determined by the elements it contains

### Content blocks

Card contents are grouped into blocks. Content can have different levels of visual emphasis depending on importance. Card layouts vary to support the kinds of content they contain.

![Diagram of card content blocks.](../../assets/cards/guidelines/13-diagram-of-card-content-blocks-5bac5213.png)

Cards can contain a headline, subhead, supporting text, media, and actions

### Dividers

[Dividers](/m3/pages/divider/specs) can separate regions in cards or indicate areas of a card that can expand.

![A divider running the entire width of the card.](../../assets/cards/guidelines/14-a-divider-running-the-entire-width-of-the-card-4085209b.png)

1\. Use full-width dividers for content that can be expanded

![An inset divider indented from the edge of card.](../../assets/cards/guidelines/15-an-inset-divider-indented-from-the-edge-of-card-b6ad826e.png)

1\. Use inset dividers, which don’t run the full width of a card, to separate related content

### Media

**Thumbnail**
Cards can include thumbnails for an avatar or logo.

**Image**
Cards can include photos, illustrations, and other graphics, such as weather icons.

**Video**
Cards can include video.

![A mobile chat app with: 5 cards with images, 1 card with a thumbnail avatar, and 1 card with a video.](../../assets/cards/guidelines/16-a-mobile-chat-app-with-5-cards-with-images-1-card-with-a-thu-9019b229.png)

Cards can contain thumbnails, images, and video

### Text

**Headline**
Headline text often communicates the subject of the card, such as the name of a photo album or article.

**Subhead**
Subheads are smaller text elements, such as an article byline or a tagged location.

**Supporting text**
Supporting text includes body content, such as an article summary or a restaurant description.

![card container with several elementsA tablet email app with an email summary card with multiple text elements.](../../assets/cards/guidelines/17-card-container-with-several-elementsa-tablet-email-app-with--e9e4cd40.png)

Headline, subhead, and supporting text in a card

#### Layering text, icons, and images

It isn’t recommended to place text or icons on images. If it’s necessary, ensure the background image provides sufficient contrast for the text to meet accessibility [More on accessibility](/m3/pages/cards/accessibility) standards. Add a translucent scrim or bounding shape beneath the text or icon to help ensure proper contrast.

![Layered text contrasts with the background image.](../../assets/cards/guidelines/18-layered-text-contrasts-with-the-background-image-25b5a470.png)

exclamation Caution

Ensure that text on images meets accessible contrast standards

![Icon within a bounding shape, placed on an image.](../../assets/cards/guidelines/19-icon-within-a-bounding-shape-placed-on-an-image-b964dca9.png)

exclamation Caution

When placing text or icons on images, consider using a bounding shape to ensure proper contrast

### Actions

#### **Primary action area**

Cards can be one large touch target triggering an expanded detail screen.

![The action area of a card contains rich media and supporting text.](../../assets/cards/guidelines/20-the-action-area-of-a-card-contains-rich-media-and-supporting-730cae8a.png)

Cards can include a primary action area that expands into a full-screen view

**Buttons**
Cards can include buttons [More on buttons](/m3/pages/common-buttons/overview) for actions such as **Learn more** or **Add to cart**.

**Icon buttons**
Cards can include icon buttons [More on icon buttons](/m3/pages/icon-buttons/overview) for actions such as **Save**, **Heart**, or **Leave a 4-star review**.

**Selection controls**
Cards can also include chips [More on chips](/m3/pages/chips/overview), sliders [More on sliders](/m3/pages/sliders/overview), checkboxes [More on checkboxes](/m3/pages/checkbox/overview), and other selection controls.

**Linked text**
There can be a link in the supporting text on a card.

![Supplemental text and actions at the top and bottom of the card.](../../assets/cards/guidelines/21-supplemental-text-and-actions-at-the-top-and-bottom-of-the-c-b34beaf2.png)

Cards can include multiple action areas containing buttons, links, and other controls

![Album card with an option to give a star rating.](../../assets/cards/guidelines/22-album-card-with-an-option-to-give-a-star-rating-4f6571ac.png)

Cards can contain icon buttons like stars to rate content

![Card to purchase tickets with choice chips for 3 event times.](../../assets/cards/guidelines/23-card-to-purchase-tickets-with-choice-chips-for-3-event-times-8e920e11.png)

Cards can contain choice chips in the action area

![Card with slider to control a song’s volume.](../../assets/cards/guidelines/24-card-with-slider-to-control-a-song-s-volume-2ecbd246.png)

Cards can contain a slider control in the action area

**Overflow menu**
Overflow menus contain related actions. They are typically placed in the upper-right or lower-right corner of a card.

![2 cards: 1 with an overflow menu in the upper-right corner, the other with it in the lower right.](../../assets/cards/guidelines/25-2-cards-1-with-an-overflow-menu-in-the-upper-right-corner-th-b113c0e5.png)

Overflow menus are usually located in the upper-right or lower-right corner of a card

## Cards in a collection

Multiple cards can be grouped together into collections displayed in a grid, list [More on lists](/m3/pages/lists/overview), or carousel [More on carousels](/m3/pages/carousel/overview). By default, cards in a collection are coplanar. They share the same resting elevation unless they're picked up or dragged [More on dragged state](/m3/pages/interaction-states/applying-states#198c29c7-771e-4264-91e9-70c32b8902ec).

![9 cards in a grid layout.](../../assets/cards/guidelines/26-9-cards-in-a-grid-layout-de873049.png)

Multiple cards can be grouped into collections with a shared resting elevation

#### Filtering and sorting

Card collections can be filtered in a variety of ways, including by date or alphabetical order. If a collection can be filtered, the filter must apply to each card in the collection. Filter or sorting options should be placed outside of the card collection.

![A sort-by-date option placed above a card collection.](../../assets/cards/guidelines/27-a-sort-by-date-option-placed-above-a-card-collection-a5625d0a.png)

Card collections can be filtered in a variety of ways, including by date:
1\. A sort-by-date option is placed outside of the card collection 

Organize card collections so that they'e easy to use. Their layout [More on layout](/m3/pages/understanding-layout/overview) affects how they are perceived.

![A template for an 8-card collection layout.](../../assets/cards/guidelines/28-a-template-for-an-8-card-collection-layout-c541f8b1.png)

Place cards in a collection in a straightforward, easy-to-use manner

### Grid

Cards can be displayed together in a grid. Cards displayed in a grid

The default grid can be customized in code to show cards in staggered or mosaic grids.

![5 menu item cards in a mosaic grid.](../../assets/cards/guidelines/29-5-menu-item-cards-in-a-mosaic-grid-1a8ad145.png)

Custom mosaic grid

![4 menu item cards in a staggered grid.](../../assets/cards/guidelines/30-4-menu-item-cards-in-a-staggered-grid-eb93ee8a.png)

Custom staggered grid

### Vertical list

Cards can be displayed together in a vertical list. Cards can be shown in a vertical list

### Carousel

Cards can be displayed together in a horizontal row or carousel [More on carousels](/m3/pages/carousel/overview). Cards displayed together in a horizontal row or carousel

## Adaptive design

As cards scale to adapt to different [window size classes](/m3/pages/breakpoints), their position and alignment can also change. Cards and their elements can align left, right, or center as the layout scales.

![2 cards on a mobile screen row expand to 4 cards on a tablet screen row.](../../assets/cards/guidelines/31-2-cards-on-a-mobile-screen-row-expand-to-4-cards-on-a-tablet-c04347cf.png)

Card position and alignment changes as the screen size changes

### Ergonomics

Adjust the layout [More on layout](/m3/pages/understanding-layout/overview) of cards to meet the ergonomic needs of large screens. For example, a horizontally-oriented card in a compact window size [More on compact window size class](/m3/pages/breakpoints/compact) may become a larger, vertically-oriented card in an expanded window size [More on expanded window size class](/m3/pages/breakpoints/expanded), with more space for images and text on the larger screen.

![Card sizes change from mobile to tablet, with larger images in the tablet layout.](../../assets/cards/guidelines/32-card-sizes-change-from-mobile-to-tablet-with-larger-images-i-6c8438e5.png)

Adjust the card layout so content remains the main focus on large screens

### Visual presentation

To adjust the presentation of content-focused components, begin with spacing. Allow components like lists [More on lists](/m3/pages/lists/overview), cards, and images to optimize space while filling the region of a screen that suits a device breakpoint’s ergonomic needs.

![2 cards with optimized space: 1 narrow rectangle, 1 wide square.](../../assets/cards/guidelines/33-2-cards-with-optimized-space-1-narrow-rectangle-1-wide-squar-d121972e.png)

Spacing adjusts for components such as cards, lists, and images

![2 examples of the same card: 1 vertical with an image at the top, 1 horizontal with an image on the left.](../../assets/cards/guidelines/34-2-examples-of-the-same-card-1-vertical-with-an-image-at-the--a75f4d14.png)

Example of the same card with two different orientations and element positioning

### Column-based layouts

In mobile layouts, components such as lists [More on lists](/m3/pages/lists/overview) or cards are stretched to fit the full width of the screen without compromising visual quality or user experience. When designing for large screens with an expanded window size [More on expanded window size class](/m3/pages/applying-layout/expanded), use multiple columns to display content. Avoid extending UI elements across the screen when possible. On larger screens, rearrange groups of related cards into horizontal rows or carousels [More on carousels](/m3/pages/carousel/overview), to allow for better content organization.

![3 related cards in a carousel.](../../assets/cards/guidelines/35-3-related-cards-in-a-carousel-4752a390.png)

When designing for large screens, use multiple columns to display content

### Small screens

On smaller screens with the compact window size [More on compact window size class](/m3/pages/applying-layout/compact), consider swapping cards for lists [More on lists](/m3/pages/lists/overview), which can display images and text in a more compact form. Make sure that controls, actions, and other component-specific elements are maintained. Certain devices or user contexts require different components to meet platform expectations

## Behavior

### Expanding

Cards can use a [container transform](/m3/pages/motion-transitions/transition-patterns#b67cba74-6240-4663-a423-d537b6d21187) transition pattern to reveal additional content. Reserve this pattern for hero moments that are meant to be expressive. A card expands to fill the full screen using a parent-child transition

check Do

Expand a card to reveal information

close Don’t

Don’t scroll within a card to reveal information

### Navigation

Cards can use a [forward and backward](/m3/pages/motion-transitions/transition-patterns#df9c7d76-1454-47f3-ad1c-268a31f58bad) transition pattern to navigate between screens at consecutive levels of hierarchy. This pattern has a simpler motion style compared to container transform, which makes it suitable for common navigation transitions. Cards can use a forward and backward transition pattern to navigate between screens

### Gestures

#### Swipe

A swipe gesture [More on gestures](/m3/pages/gestures) can be performed on a single card at a time, anywhere on that card. It can be used to:

- Dismiss a card
- Change the state [More on states](/m3/pages/interaction-states/overview) of a card, such as flagging or archiving it

check Do

A card should only have one swipe action assigned to it

close Don’t

Cards shouldn’t contain content that can be swiped, such as an image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping.

#### Pick up & move

The pick-up-and-move gesture [More on gestures](/m3/pages/gestures) allows users to move and reorder cards in a collection.

check Do

When moving a card, increase its elevation

close Don’t

Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation.

#### Scrolling

Card content that’s taller than the maximum card height is truncated and doesn’t scroll, but can be displayed by expanding the height of a card. A card can expand beyond the maximum height of the screen, in which case the card scrolls within the screen.

check Do On a mobile device, cards can expand to reveal more content, scrolling within the screen. Content within cards doesn’t scroll.

close Don’t

On a mobile device, cards can't internally scroll, as it could cause two scroll bars to be displayed

#### Scrolling on desktop

On a desktop device, card content can expand and scroll within a card. On a desktop, content can expand and scroll within a card

