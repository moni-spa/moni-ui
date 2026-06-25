# m3-docs — Material Design 3 component reference

Generated from https://m3.material.io/components on **2026-06-20T07:01:22.202Z**.

Each component has 4 sections: `overview.md`, `specs.md`, `guidelines.md`, `accessibility.md`.
All images are downloaded locally under `assets/<slug>/<section>/` and referenced as relative paths.

**No AI tokens were spent producing this content** — pages were DOM-scraped with Playwright and converted to Markdown with Turndown (HTML→MD lossless-ish).

Total: **36 components**, **144 markdown files**.

## Components

### All other components

- [`app-bars`](components/app-bars/overview.md) — App bars are placed at the top of the screen to help people navigate through a product.  _(~33 KB, 60 images)_
- [`badges`](components/badges/overview.md) — Badges show notifications, counts, or status information on navigation items and icons  _(~15 KB, 32 images)_
- [`cards`](components/cards/overview.md) — Cards display content and actions about a single subject  _(~28 KB, 54 images)_
- [`carousel`](components/carousel/overview.md) — Carousels show a collection of items that can be scrolled on and off the screen  _(~27 KB, 39 images)_
- [`checkbox`](components/checkbox/overview.md) — Checkboxes let users select one or more items from a list, or turn an item on or off  _(~12 KB, 21 images)_
- [`chips`](components/chips/overview.md) — Chips help people enter information, make selections, filter content, or trigger actions  _(~39 KB, 79 images)_
- [`dialogs`](components/dialogs/overview.md) — Dialogs provide important prompts in a user flow  _(~29 KB, 50 images)_
- [`divider`](components/divider/overview.md) — Dividers are thin lines that group content in lists or other containers  _(~9 KB, 23 images)_
- [`lists`](components/lists/overview.md) — Lists are continuous, vertical indexes of text and images  _(~43 KB, 80 images)_
- [`menus`](components/menus/overview.md) — Menus display a list of choices on a temporary surface  _(~30 KB, 43 images)_
- [`radio-button`](components/radio-button/overview.md) — Radio buttons let people select one option from a set of options  _(~13 KB, 25 images)_
- [`search`](components/search/overview.md) — Search lets people enter a keyword or phrase to get relevant information  _(~29 KB, 45 images)_
- [`sliders`](components/sliders/overview.md) — Sliders allow users to make selections from a range of values  _(~21 KB, 41 images)_
- [`snackbar`](components/snackbar/overview.md) — Snackbars show short updates about app processes at the bottom of the screen  _(~21 KB, 44 images)_
- [`switch`](components/switch/overview.md) — Switches toggle the selection of an item on and off  _(~18 KB, 38 images)_
- [`tabs`](components/tabs/overview.md) — Tabs organize content across different screens and views  _(~21 KB, 30 images)_
- [`text-fields`](components/text-fields/overview.md) — Text fields let users enter text into a UI  _(~33 KB, 59 images)_
- [`toolbars`](components/toolbars/overview.md) — Toolbars display frequently used actions relevant to the current page  _(~31 KB, 62 images)_
- [`tooltips`](components/tooltips/overview.md) — Tooltips display brief labels or messages  _(~15 KB, 32 images)_

### Buttons

- [`button-groups`](components/button-groups/overview.md) — Button groups organize buttons and add interactions between them  _(~21 KB, 30 images)_
- [`buttons`](components/buttons/overview.md) — Buttons prompt most actions in a UI.  _(~31 KB, 68 images)_
- [`extended-fab`](components/extended-fab/overview.md) — Extended floating action buttons (extended FABs) help people take primary actions  _(~27 KB, 54 images)_
- [`fab-menu`](components/fab-menu/overview.md) — The floating action button (FAB) menu opens from a FAB to display multiple related actions  _(~20 KB, 46 images)_
- [`floating-action-button`](components/floating-action-button/overview.md) — Floating action buttons (FABs) help people take primary actions  _(~24 KB, 44 images)_
- [`icon-buttons`](components/icon-buttons/overview.md) — Icon buttons help people take actions with a single tap  _(~24 KB, 40 images)_
- [`segmented-buttons`](components/segmented-buttons/overview.md) — Segmented buttons help people select options, switch views, or sort elements  _(~20 KB, 36 images)_
- [`split-button`](components/split-button/overview.md) — Split buttons open a menu to give people more options related to an action  _(~21 KB, 27 images)_

### Date & time pickers

- [`date-pickers`](components/date-pickers/overview.md) — Date pickers let people select a date, or a range of dates  _(~31 KB, 60 images)_
- [`time-pickers`](components/time-pickers/overview.md) — Time pickers help people select and set a specific time  _(~21 KB, 34 images)_

### Loading & progress

- [`loading-indicator`](components/loading-indicator/overview.md) — Loading indicators show the progress of a process for a short wait time  _(~13 KB, 14 images)_
- [`progress-indicators`](components/progress-indicators/overview.md) — Progress indicators show the status of a process in real time  _(~20 KB, 27 images)_

### Navigation

- [`navigation-bar`](components/navigation-bar/overview.md) — Navigation bars let people switch between UI views on smaller devices  _(~29 KB, 56 images)_
- [`navigation-drawer`](components/navigation-drawer/overview.md) — Navigation drawers let people switch between UI views on larger devices  _(~31 KB, 48 images)_
- [`navigation-rail`](components/navigation-rail/overview.md) — Navigation rails let people switch between UI views on mid-sized devices  _(~32 KB, 57 images)_

### Sheets

- [`bottom-sheets`](components/bottom-sheets/overview.md) — Bottom sheets show secondary content anchored to the bottom of the screen  _(~19 KB, 31 images)_
- [`side-sheets`](components/side-sheets/overview.md) — Side sheets show secondary content anchored to the side of the screen  _(~16 KB, 26 images)_

## Layout

```
m3-docs/
├── README.md
├── _manifest.json
├── assets/<slug>/<section>/*.png
└── components/<slug>/{overview,specs,guidelines,accessibility}.md
```

## Regenerate

```bash
cd scripts/scrape-m3
node scrape.mjs                       # full 36 x 4 = 144 pages
node scrape.mjs --only=buttons        # single component
node scrape.mjs --sections=accessibility   # one section across all
node lib/check.mjs                    # verify integrity
```

## Section semantics

- **overview** — what the component is, when to use it, key behaviours.
- **specs** — visual specs as published on m3.material.io (variants, anatomy, configurations, measurements, color tables). The deep `design-system-data` JSON token dump is intentionally **not** emitted; visible page content is captured as-is.
- **guidelines** — implementation guidance: placement, sizing, behaviour, do/don'ts.
- **accessibility** — keyboard, screen reader, contrast, touch-target guidance.
