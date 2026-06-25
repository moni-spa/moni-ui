---
component: Carousel
slug: carousel
section: specs
category: All other components
source: "https://m3.material.io/components/carousel/specs"
scraped_at: "2026-06-20T06:56:19.649Z"
tokens_count: 7
images_count: 17
---
# Carousel

Carousels show a collection of items that can be scrolled on and off the screen

![4 elements of a carousel.](../../assets/carousel/specs/01-4-elements-of-a-carousel-089527e2.png)

1. Container
2. Large carousel item
3. Medium carousel item
4. Small carousel item

## Tokens & specs

Browse the component elements, attributes, tokens, and their values. Carousel item

Token

Default, Light

Enabled

Hover

Focus

Pressed (ripple)

Disabled

## Color

Color values are implemented through design tokens [More on tokens](/m3/pages/design-tokens/overview). For design, this means working with color values that correspond with tokens. For implementation, a color value will be a token that references a value. [Learn more about design tokens](/m3/pages/design-tokens/overview/)

![2 color roles of a carousel.](../../assets/carousel/specs/02-2-color-roles-of-a-carousel-e5b38f91.png)

Carousel color roles used for light and dark schemes:

1. Container
2. Surface

## States [More on states](/m3/pages/interaction-states/overview) are visual representations used to communicate the status of a component or interactive element. [Learn more about interaction states](/m3/pages/interaction-states/overview)

![5 states of a carousel in light and dark schemes.](../../assets/carousel/specs/03-5-states-of-a-carousel-in-light-and-dark-schemes-11c47ef3.png)

1. Enabled
2. Hovered
3. Focused
4. Pressed
5. Disabled

## Carousel item dynamic widths

All kinds of carousel items dynamically adapt to the width of the container. Large items have a customizable maximum width that's used to optimally fit carousel items into the available space. Small carousel items have a minimum width of 40dp and a maximum width of 56dp. Items change size as they move through the carousel layout.

![Measurements for a small carousel item.](../../assets/carousel/specs/04-measurements-for-a-small-carousel-item-57e9a957.png)

Small carousel items have a minimum and maximum width

## Multi-browse

The multi-browse layout shows at least one large, medium, and small carousel item.

![4 elements of a multi-browse carousel layout.](../../assets/carousel/specs/05-4-elements-of-a-multi-browse-carousel-layout-5c08e8bb.png)![4 elements of a multi-browse carousel layout.](../../assets/carousel/specs/06-4-elements-of-a-multi-browse-carousel-layout-c0517955.png)

1. Container
2. Large carousel item
3. Medium carousel item
4. Small carousel item

### Measurements

![Measurements of a multi-browse carousel layout.](../../assets/carousel/specs/07-measurements-of-a-multi-browse-carousel-layout-372ff820.png)

Multi-browse carousels have padding on both sides of the container

| Attribute | Value |
| --- | --- |
| Alignment | Vertically centered |
| Leading/trailing padding | 16dp |
| Top/bottom padding
 | 8dp |
| Padding between elements
 | 8dp |
| Large item width | Dynamic, or user-set |
| Medium item width | Dynamic |
| Small item width | 40–56dp, dynamic |
| Item corner radius | 28dp |

## Uncontained

The uncontained layout shows items that scroll to the edge of the container.

![4 elements of an uncontained carousel layout.](../../assets/carousel/specs/08-4-elements-of-an-uncontained-carousel-layout-0ac329ea.png)

1. Container
2. Large carousel item

### Measurements

![Measurements of an uncontained carousel layout.](../../assets/carousel/specs/09-measurements-of-an-uncontained-carousel-layout-465e43e2.png)

Uncontained carousel items bleed over the padding on each side when scrolling

| Attribute | Value |
| --- | --- |
| Alignment | Vertically centered |
| Leading padding | 16dp |
| Top/bottom padding
 | 8dp |
| Padding between elements
 | 8dp |
| Item corner radius | 28dp |

## Uncontained mutli-aspect ratio

The uncontained multi-aspect ratio layout shows carousel items of various widths.

![4 elements of an uncontained carousel layout](../../assets/carousel/specs/10-4-elements-of-an-uncontained-carousel-layout-23f8edb4.png)

1. Container
2. Carousel item (16:9)
3. Carousel item (9:16)
4. Carousel item (1:1)
5. Carousel item (3:4)

### Measurements

![image-11](../../assets/carousel/specs/11-image-11-75ee8ece.png)

Uncontained multi-aspect ratio carousels only have leading padding, with 8dp of padding between items.

| Attribute | Value |
| --- | --- |
| Alignment | Vertically centered |
| Leading padding | 16dp |
| Top/bottom padding
 | 8dp |
| Padding between elements
 | 8dp |
| Item corner radius | 28dp |

## Hero

The hero layout shows at least one large item and one small item.

![3 elements of a hero carousel layout.](../../assets/carousel/specs/12-3-elements-of-a-hero-carousel-layout-a89d28d0.png)

1. Container
2. Large carousel item
3. Small carousel item

### Measurements

![Measurements of a hero carousel layout.](../../assets/carousel/specs/13-measurements-of-a-hero-carousel-layout-1d67332f.png)

Hero carousels have padding on both sides of the container

| Attribute | Value |
| --- | --- |
| Alignment | Vertically centered |
| Leading/Trailing padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Large item width | Dynamic |
| Small item width | 40-56dp, dynamic |
| Item corner radius | 28dp |

## Center-aligned hero

The center-aligned hero layout shows at least one large item and two small items.

![3 elements of a center-aligned hero carousel layout.](../../assets/carousel/specs/14-3-elements-of-a-center-aligned-hero-carousel-layout-04680122.png)

1. Container
2. Large carousel item
3. Small carousel item

### Measurements

![Measurements of a center-aligned hero carousel layout.](../../assets/carousel/specs/15-measurements-of-a-center-aligned-hero-carousel-layout-93d1d2c6.png)

Center-aligned hero carousels have padding on both sides of the container

| Attribute | Value
 |
| --- | --- |
| Alignment | Vertically centered |
| Leading/Trailing padding | 16dp |
| Top/bottom padding | 8dp |
| Padding between elements | 8dp |
| Large item width | Dynamic |
| Small item width | 40-56dp, dynamic |
| Item corner radius | 28dp |

## Full-screen

The full-screen layout shows one edge-to-edge large item.

![2 elements of a full-screen carousel layout.](../../assets/carousel/specs/16-2-elements-of-a-full-screen-carousel-layout-2cf9b634.png)

1. Container
2. Large carousel item

### Measurements

![Measurements of a full-screen carousel layout.](../../assets/carousel/specs/17-measurements-of-a-full-screen-carousel-layout-50f615b4.png)

Full-screen carousels fill the window edge-to-edge

| Attribute | Value |
| --- | --- |
| Alignment | Centered |
| Leading/Trailing padding | 0dp |
| Top/bottom padding
 | 0dp |
| Padding between elements
 | 16dp |

