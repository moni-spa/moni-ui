---
component: Badges
slug: badges
section: accessibility
category: All other components
source: "https://m3.material.io/components/badges/accessibility"
scraped_at: "2026-06-20T06:55:25.413Z"
tokens_count: 0
images_count: 4
---
# Badges

Badges show notifications, counts, or status information on navigation items and icons

## Use cases

People should be able to use assistive technology to:

- Understand the dynamic information conveyed in badges, such as counts or labels
- Address badge announcements by selecting corresponding navigation destinations

## Interaction & style

Badges are most commonly used within other components, such as navigation bar [More on navigation bars](/m3/pages/navigation-bar/overview), navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview), app bars [More on app bars](/m3/pages/app-bars/overview), and tabs [More on tabs](/m3/pages/tabs/overview). When a badge is used to indicate an unread notification, the badge gets hidden once it's selected.

## Visual indicators

Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues.

![Diagram of large and small badges showing that they need to pass 3 to 1 contrast.](../../assets/badges/accessibility/01-diagram-of-large-and-small-badges-showing-that-they-need-to--856cdb25.png)

check Do

Badges must use default color with at least 3:1 contrast

![Diagram of large and small badges not passing 3 to 1 contrast.](../../assets/badges/accessibility/02-diagram-of-large-and-small-badges-not-passing-3-to-1-contras-663ddb78.png)

close Don’t

Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1.

## Labeling elements

The accessibility [More on accessibility](/m3/pages/overview/principles) label for a badge item will be read after its navigation destination. Any numerical badges will have their number read, while non-counting badges will simply announce **New notification**.

![Navigation bar highlighting numerical badge.](../../assets/badges/accessibility/03-navigation-bar-highlighting-numerical-badge-bf67476c.png)

Numerical badges will have their number read

![Navigation bar highlighting non-counting badge.](../../assets/badges/accessibility/04-navigation-bar-highlighting-non-counting-badge-ece5bb4f.png)

Non-counting badges will simply announce **New notification**

