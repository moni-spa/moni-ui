---
component: Badges
slug: badges
section: guidelines
category: All other components
source: "https://m3.material.io/components/badges/guidelines"
scraped_at: "2026-06-20T06:55:21.650Z"
tokens_count: 0
images_count: 19
---
# Badges

Badges show notifications, counts, or status information on navigation items and icons

![Diagram of 4 badges in different configurations on a navigation bar's destination icons.](../../assets/badges/guidelines/01-diagram-of-4-badges-in-different-configurations-on-a-navigat-46c4fb40.png)

Large badges and a small badge in a navigation bar

## Usage

Badges are used to indicate a notification, item count, or other information relating to a navigation destination. They are placed on the ending edge of icons, typically within other components. There are two variants:

1. Small badge
2. Large badge

![Diagram of 4 badges in different configurations on a navigation bar's destination icons.](../../assets/badges/guidelines/02-diagram-of-4-badges-in-different-configurations-on-a-navigat-ccf831d2.png)

Navigation bar with four badges

A **small badge** is a simple circle, used to indicate an unread notification. A **large badge** contains label text communicating item count information.

![A small badge is a circle with no characters.](../../assets/badges/guidelines/03-a-small-badge-is-a-circle-with-no-characters-0956e9e5.png)

Small badge

![A large badge holds 4 characters and expands its container's width but not height.](../../assets/badges/guidelines/04-a-large-badge-holds-4-characters-and-expands-its-container-s-02533933.png)

Large badge

### With other components

Badges are most commonly used within other components, such as navigation bar [More on navigation bars](/m3/pages/navigation-bar/overview), navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview), app bars [More on app bars](/m3/pages/app-bars/overview), and tabs [More on tabs](/m3/pages/tabs/overview).

![Navigation bar with 3 icon buttons. 2 icons buttons have badges and 1 doesn't.](../../assets/badges/guidelines/05-navigation-bar-with-3-icon-buttons-2-icons-buttons-have-badg-d8920545.png)

In navigation bars, hide the badge once the destination has been selected

## Anatomy

![Small and large badges on 2 icon buttons.](../../assets/badges/guidelines/06-small-and-large-badges-on-2-icon-buttons-bfd49220.png)

1. Small badge
2. Large badge container
3. Large badge label

## Container

There are two container options for the badge: 

- Small badge with no text
- Large badge with text

![A small badge on a navigation item.](../../assets/badges/guidelines/07-a-small-badge-on-a-navigation-item-93e03bc6.png)

A small badge uses only shape to indicate a status change or new notification

![Number 10 displayed within large badge on a navigation item.](../../assets/badges/guidelines/08-number-10-displayed-within-large-badge-on-a-navigation-item-4114f4e8.png)

A large badge displays a number within a container to indicate a quantifiable status change related to a destination

Badge containers are anchored inside the icon bounding box. As the number count increases for large badges , their width expands, but keeps the same placement. Badges use a color intended to stand out against labels, icons, and navigation elements. Use the default color mapping to avoid color conflict issues.

![Small and large badges on the left side of 2 navigation items in a right-to-left language.](../../assets/badges/guidelines/09-small-and-large-badges-on-the-left-side-of-2-navigation-item-b8e12dcb.png)

check Do

Change the position of the badge for right-to-left languages

![Small and large badges at random positions on 3 icon buttons on a navigation rail.](../../assets/badges/guidelines/10-small-and-large-badges-at-random-positions-on-3-icon-buttons-227248f6.png)

close Don’t

Badges have fixed positions. Don’t change the position of the badge arbitrarily or place the badge over the icon.

![Small and large badges in default red color on 3 navigation items.](../../assets/badges/guidelines/11-small-and-large-badges-in-default-red-color-on-3-navigation--f5c2b1ca.png)

check Do

Use the default badge color

![Small and large badges in custom colors on 3 navigation items.](../../assets/badges/guidelines/12-small-and-large-badges-in-custom-colors-on-3-navigation-item-6ee5d5de.png)

close Don’t

Avoid using custom color roles for the badge container and label text. If custom roles are necessary, make sure they have contrast of at least 3:1.

### Label text

Label large badges with counts or a status. The maximum number of characters within large badge label text is four, including a + to indicate more.

![4 icons with increasing number badges. The badges represent quantities, using a "+" symbol for quantities over 999.](../../assets/badges/guidelines/13-4-icons-with-increasing-number-badges-the-badges-represent-q-fb41c462.png)

Large badges with one to four characters

Use the recommended maximum character count to ensure labels don’t extend beyond the badge container.

![4-digit numbers condensed to a 3-digit badge with "+" to fit the badge container's width.](../../assets/badges/guidelines/14-4-digit-numbers-condensed-to-a-3-digit-badge-with-to-fit-the-fe779092.png)

check Do

Truncate badge labels as needed

![4-digit and 5-digit number badges on navigation items exceed the badge container's width and get cut off at the edge.](../../assets/badges/guidelines/15-4-digit-and-5-digit-number-badges-on-navigation-items-exceed-a1e56f9e.png)

close Don’t

Don’t let the badge get cut off or collide with another element

## Placement

![Large badge to the right of a navigation rail item.](../../assets/badges/guidelines/16-large-badge-to-the-right-of-a-navigation-rail-item-6fb338a2.png)

check Do

Use a large badge to show count information when visual collisions aren’t an issue, such as in a navigation rail

![Small badge on an icon button in an app bar.](../../assets/badges/guidelines/17-small-badge-on-an-icon-button-in-an-app-bar-ae71e62a.png)

exclamation Caution

Use a small badge when spaces are tightly constrained, such as app bars. Small badges won’t run into the edge of the screen.

![Large badge placed at the end of a tab.](../../assets/badges/guidelines/18-large-badge-placed-at-the-end-of-a-tab-5929c51e.png)

check Do

When an icon with a badge is followed by text or another element, place a large badge at the trailing edge

![Large badge overlapping the icon and text in a tab.](../../assets/badges/guidelines/19-large-badge-overlapping-the-icon-and-text-in-a-tab-b1fb98b4.png)

close Don’t

Avoid using a large badge when it might overlap with a trailing element. Either place it at the trailing edge or use a small badge instead.

