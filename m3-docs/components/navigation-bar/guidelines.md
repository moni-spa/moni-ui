---
component: Navigation bar
slug: navigation-bar
section: guidelines
category: Navigation
source: "https://m3.material.io/components/navigation-bar/guidelines"
scraped_at: "2026-06-20T06:58:39.356Z"
tokens_count: 0
images_count: 28
---
# Navigation bar

Navigation bars let people switch between UI views on smaller devices

![A nav bar with vertical items in a compact window, and horizontal items in a medium window.](../../assets/navigation-bar/guidelines/01-a-nav-bar-with-vertical-items-in-a-compact-window-and-horizo-b2cecadf.png)

Navigation bars adapt to different window sizes

## Usage

Navigation bars provide access to three to five destinations. The nav bar is positioned at the bottom of windows for convenient access. Each destination is represented by an icon and label text. One navigation destination is always active. When a navigation bar icon is tapped or focused, people are taken to the navigation destination associated with that icon.

![A nav bar for a music app with 4 destinations: Home, Browse, Radio, Library, It’s in a compact window.](../../assets/navigation-bar/guidelines/02-a-nav-bar-for-a-music-app-with-4-destinations-home-browse-ra-8279e0f9.png)

Navigation bars can have three to five destinations

Navigation bars should be used for:

- Three to five main pages in the product
- Mobile or tablet only

Navigation bars shouldn’t be used for accessing single tasks, such as viewing one email.

![A nav bar for a music app with 4 destinations: Home, Browse, Radio, Library. It’s in a medium window.](../../assets/navigation-bar/guidelines/03-a-nav-bar-for-a-music-app-with-4-destinations-home-browse-ra-c918010d.png)

On mobile or tablet, navigation bars should be used for top-level destinations

The navigation items can be **vertical** or **horizontal**.

- Use vertical items in compact windows [More on compact window size class](/m3/pages/breakpoints/compact), like mobile
- Use horizontal items in medium windows [More on medium window size class](/m3/pages/breakpoints/medium), like tablets

![A nav bar with vertical items in a compact window, and horizontal items in a medium window.](../../assets/navigation-bar/guidelines/04-a-nav-bar-with-vertical-items-in-a-compact-window-and-horizo-3717e3ea.png)

Vertical navigation items work best in compact windows. Horizontal items work best in medium windows. For products with more than five navigation items, don’t use a navigation bar; the elements may collide and there likely won’t be enough space for translated text. Instead, consider using tabs [More on tabs](/m3/pages/tabs/overview) to organize similar content within a page, or hide the navigation behind a menu icon using a modal expanded navigation rail [More on navigation rails](/m3/pages/navigation-rail/overview).

![A nav bar with 7 items in a compact window.](../../assets/navigation-bar/guidelines/05-a-nav-bar-with-7-items-in-a-compact-window-c45b7d18.png)

close Don’t

Avoid putting more than five navigation items in a navigation bar

![A nav bar with no labels for each page item.](../../assets/navigation-bar/guidelines/06-a-nav-bar-with-no-labels-for-each-page-item-6362dbc7.png)

close Don’t

Don’t remove the labels from navigation items

![A nav bar with 2 page items.](../../assets/navigation-bar/guidelines/07-a-nav-bar-with-2-page-items-5b0d00bb.png)

close Don’t

Don’t use a navigation bar for fewer than three destinations. Instead, use tabs.

![A nav bar is on the Library page of a music app. Tabs at the top of the page have secondary navigation for playlists, artists, albums, and songs.](../../assets/navigation-bar/guidelines/08-a-nav-bar-is-on-the-library-page-of-a-music-app-tabs-at-the--5586edaa.png)

Use navigation for distinct pages and tabs for related content within a page

![Nav bar using horizontal items in a compact window. The items are too wide and flow off screen.](../../assets/navigation-bar/guidelines/09-nav-bar-using-horizontal-items-in-a-compact-window-the-items-70fcd7b4.png)

close Don’t

Navigation bar destinations have fixed positions. Don’t scroll them or modify their positions.

## Anatomy

![6 elements of the nav bar.](../../assets/navigation-bar/guidelines/10-6-elements-of-the-nav-bar-6e0faf81.png)

1. Container
2. Icon
3. Label text
4. Active indicator
5. Large badge (optional)
6. Small badge (optional)

### Container

The container should always be placed at the bottom of the product and span the full length of the window. Navigation items are centered within the container. The container has a color fill to provide separation from other content.

![The nav bar at the bottom of a medium window has a color fill to differentiate from the background.](../../assets/navigation-bar/guidelines/11-the-nav-bar-at-the-bottom-of-a-medium-window-has-a-color-fil-ef11125d.png)

The navigation bar container holds all elements

### Navigation items

Navigation items hold all elements for each destination: the icon, label text, and active indicator. They can be **vertical**, with the text below the icon and indicator, or **horizontal**, with the icon and text beside each other inside the indicator. Vertical items are best in compact windows [More on compact window size class](/m3/pages/breakpoints/compact), and horizontal items are best in medium windows [More on medium window size class](/m3/pages/breakpoints/medium). Horizontal items are centered in the nav bar with outer margins.

![The nav bar in a medium window with padding on each side.](../../assets/navigation-bar/guidelines/12-the-nav-bar-in-a-medium-window-with-padding-on-each-side-d71f2ef9.png)

The navigation bar is divided into equal-width segments with padding from the window edge

### Icons

Navigation rail items must use icons that symbolize the content of their page. Browse [popular icon](https://fonts.google.com/icons). Use a filled icon for the active destination and outlined icons for inactive destinations. If an icon doesn’t have a filled version, apply **semibold** weight to the icon instead.

![An active nav item with a filled icon compared to inactive items with outlined icons.](../../assets/navigation-bar/guidelines/13-an-active-nav-item-with-a-filled-icon-compared-to-inactive-i-d41acd0b.png)

check Do

Use filled icons when the navigation item is active

![An active nav item with a semibold icon compared to inactive items with outlined icons.](../../assets/navigation-bar/guidelines/14-an-active-nav-item-with-a-semibold-icon-compared-to-inactive-dbe9dcd1.png)

exclamation Caution

If a filled version of an icon is unavailable, the icon’s weight must increase

Active and inactive icons must have a minimum 3:1 contrast ratio with the container.

![4 nav items that are each different colors with low contrast with the background.](../../assets/navigation-bar/guidelines/15-4-nav-items-that-are-each-different-colors-with-low-contrast-f8a8bc69.png)

close Don’t

Don’t use multiple or low-contrast colors in a navigation bar, as they make it harder for people to distinguish the active item and navigate to other destinations

### Active indicator

The active indicator shows which page from the nav bar is currently being displayed.

![The current page in a nav bar has an active indicator.](../../assets/navigation-bar/guidelines/16-the-current-page-in-a-nav-bar-has-an-active-indicator-45ae75ea.png)

check Do

Use the active indicator only for the active destination

![All items in a nav bar have active indicators.](../../assets/navigation-bar/guidelines/17-all-items-in-a-nav-bar-have-active-indicators-2c9539d0.png)

close Don’t

Don’t use the active indicator for more than one destination at a time

### Label text

The label text should be a short, meaningful description of each navigation destination and another way for people to understand an icon’s meaning. All navigation items require a label text. It should be 1-2 words.

![A nav bar on a music app with clearly labelled destinations: home, browse, radio, library.](../../assets/navigation-bar/guidelines/18-a-nav-bar-on-a-music-app-with-clearly-labelled-destinations--acdbdd55.png)

Label text must be brief and clear

![A nav bar with 1-word labels for each page.](../../assets/navigation-bar/guidelines/19-a-nav-bar-with-1-word-labels-for-each-page-c128d52c.png)

check Do

Use brief text labels to identify the purpose of a destination

![A nav bar with “Music catalog” for a label. The label is truncated.](../../assets/navigation-bar/guidelines/20-a-nav-bar-with-music-catalog-for-a-label-the-label-is-trunca-1076b1d1.png)

close Don’t

Don’t wrap or truncate text as it can make the label hard to understand

![A nav bar with “Music catalog” for a label. The label is a smaller size to make the text fit.](../../assets/navigation-bar/guidelines/21-a-nav-bar-with-music-catalog-for-a-label-the-label-is-a-smal-4ce7e0f5.png)

close Don’t

Don’t shrink longer text to fit on a single line

### Badges (optional)

Navigation bars can display badges in the upper right corners of the destination icon. Badges can contain dynamic information, such as the number of new messages.

![A nav bar with a destination called “Go” with a small badge and one called “Saved” with a large badge saying “3.”](../../assets/navigation-bar/guidelines/22-a-nav-bar-with-a-destination-called-go-with-a-small-badge-an-3f9d68e4.png)

Use a small badge to indicate an update, and a large badge to show the amount of updates

![Horizontal nav items with the badges in the same place of the icon as vertical nav items.](../../assets/navigation-bar/guidelines/23-horizontal-nav-items-with-the-badges-in-the-same-place-of-th-676f5d76.png)

Badges overlap the icon in both vertical and horizontal navigation items

## Placement

The floating action button (FAB) is placed above the navigation bar. Nav bars are always placed at the bottom of the window.

![The FAB should be right-aligned above the navigation bar](../../assets/navigation-bar/guidelines/24-the-fab-should-be-right-aligned-above-the-navigation-bar-d96d6abd.png)

check Do

The FAB should be right-aligned above the navigation bar

![A mobile page with a FAB overlapping a nav bar.](../../assets/navigation-bar/guidelines/25-a-mobile-page-with-a-fab-overlapping-a-nav-bar-7397a079.png)

close Don’t

Don’t cover the navigation bar with a FAB

Navigation bars can be temporarily covered by dialogs, bottom sheets, navigation drawers, the on-screen keyboard, or other elements needed to complete a flow. They should not be permanently obstructed on any screen. The search feature of the screen triggers the on-screen keyboard, temporarily covering the bottom navigation bar until the search flow is completed

## Adaptive design

Adaptive design allows an interface to respond or change based on context, such as the user, device, and usage. More on [adaptive design](/m3/pages/layout-overview/adaptive-design)

### Resizing

Only use navigation bars for compact [More on compact window size class](/m3/pages/applying-layout/compact) and medium [More on medium window size class](/m3/pages/applying-layout/medium) window size classes. 

**Compact**: For narrow windows, use a navigation bar or modal navigation rail.

**Medium**: Use a navigation bar or navigation rail. Decide based on whether horizontal or vertical space is more important.

**Expanded and extra-large**: Use a navigation rail instead. Decide based on available window space and the number of navigation destinations. Navigation bars are best suited for compact and medium window sizes

The navigation bar container spans 100% of the window width.

![Navigation bar spanning the full width of a compact window.](../../assets/navigation-bar/guidelines/26-navigation-bar-spanning-the-full-width-of-a-compact-window-6e55ce7e.png)

Navigation bars use 100% of the screen width

The navigation bar is used on smaller devices. It’s not intended for desktop.

![Navigation bar spanning the full width of an expanded window size.](../../assets/navigation-bar/guidelines/27-navigation-bar-spanning-the-full-width-of-an-expanded-window-7def9215.png)

close Don’t

Don’t use navigation bars for desktop layouts. Instead, use a navigation rail or tabs.

### Presentation

In medium window sizes, use horizontal nav items to better use available space. Horizontal nav items should remain centered with the same padding at each window size.

![Horizontal nav items have the same width in medium and expanded windows. Only the padding changes.](../../assets/navigation-bar/guidelines/28-horizontal-nav-items-have-the-same-width-in-medium-and-expan-bd6ecd45.png)

A navigation bar in horizontal orientation keeps the same spacing between destinations

## Behavior

### Navigation

When selecting a navigation bar item not currently selected, the product navigates to that destination’s screen using a [top level](/m3/pages/motion-transitions/transition-patterns#f852afd2-396f-49fd-a265-5f6d96680e16) transition pattern. It can either remember where you left off, or reset to the default view.

1. **Preserve state**: If someone has interacted with this destination, it returns to their scroll position, current tab, and in-line search status.
2. **Reset state**: Any prior user interactions are reset, including scroll position, tab selection, and in-line search. Choose the behavior that best suits the product and user needs. For example, an app that requires frequent switching between sections should preserve each section’s state. After selecting an item on the bottom navigation bar, the app navigates to that destination’s screen

Re-selecting the currently active destination should reset the scroll position to the top of the page.

**Don't swipe between destinations**
Swiping across the screen does not navigate between destinations, and is not supported by the navigation bar. Swipe behavior should be reserved for related items, such as cards in a carousel, or actions such as archiving a list item. Selecting the already selected navigation item scrolls to the top of the screen

### Scrolling

Upon scroll, the navigation bar can appear or disappear. Don’t hide the navigation bar on scroll when a [screen reader](https://m3.material.io/foundations/overview/assistive-technology#ec6f3e84-a51c-4dc0-a353-6844f5bde698) is active. Scrolling downward can hide the navigation bar; scrolling upward reveals it

### Selection

The icon becomes filled and the active indicator expands from the center of the icon when switching between destinations. The active indicator animation should only apply on one axis to better represent a flat, shared plane. An active indicator appears when the item is selected. When a destination is tapped, the destination screens use a [top level](/m3/pages/motion-transitions/transition-patterns#f852afd2-396f-49fd-a265-5f6d96680e16) transition pattern. In addition, the icon becomes filled and the active indicator expands from the center of the icon. Tapping a destination uses a top level transition pattern

