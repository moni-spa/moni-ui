---
component: Loading indicator
slug: loading-indicator
section: guidelines
category: Loading & progress
source: "https://m3.material.io/components/loading-indicator/guidelines"
scraped_at: "2026-06-20T06:58:14.954Z"
tokens_count: 1
images_count: 4
---
# Loading indicator

Loading indicators show the progress of a process for a short wait time

Loading indicators are best for indicating a short, indeterminate wait time

## Usage

Loading indicators use animation to grab attention, mitigate perceived latency, and indicate that an activity is in progress. They should be used when progress isn’t detectable, or when it’s not necessary to indicate how long an activity will take. While similar in function to circular progress indicators, loading indicators are a better alternative for short processes between 200ms and 5s. Use a loading indicator when a background process is running

Choose a loading or progress indicator [More on progress indicators](/m3/pages/progress-indicators/overview) that corresponds to the expected wait time and type of process. If the wait is very long, consider allowing users to navigate away from the page while the process finishes up.

| Expected wait time
 | Recommendation
 |
| --- | --- |
| Instant (under 200ms) | No indicator |
| Short (between 200ms and 5s) | Loading indicator |
| Long (Over 5s) | Progress indicator |

**Instant (under 200ms):** Display the content immediately

**Short (between 200ms and 5s):** Use a loading indicator

**Long (over 5s):** Use a progress indicator

When a process can transition from indeterminate (unknown progress) to determinate (known remaining progress), transition between the corresponding progress indicators. Don’t transition a loading indicator into a progress indicator.

check Do

Transition from an indeterminate progress indicator to a determinate progress indicator

close Don’t

Avoid transitioning from a loading indicator to a determinate progress indicator

## Anatomy

![2 parts of an active indicator.](../../assets/loading-indicator/guidelines/01-2-parts-of-an-active-indicator-cea0508d.png)

1. Active indicator
2. Container (optional)

### Active indicator

The active indicator is a looping shape morph sequence composed of seven unique Material 3 shapes.

[More about the Material shape library](/m3/pages/shape/overview-principles#579dd4ba-39f3-4e60-bd9b-1d97ed6ef1bf)

![Active indicator with shape morph.](../../assets/loading-indicator/guidelines/02-active-indicator-with-shape-morph-3291cf44.png)

The active indicator morphs shape to capture attention

### Container (optional)

When the container is visible, the active indicator should change color from **primary** to **on-primary-container**. The container should be visible when the loading indicator is placed over other content. This helps it stand out better by giving it a stronger contrast. It’s not needed when the loading indicator is placed directly on a surface. The container should be used with pull-to-refresh behavior.

![Active indicator with container.](../../assets/loading-indicator/guidelines/03-active-indicator-with-container-7b1e9349.png)

The container is a circle that provides extra contrast from body content

## Placement

While loading a page or container, the loading indicator should be centered on the element. Center the loading indicator in the middle of the page or container

When loading more items on a page with existing content, place the loading indicator in the empty space where the new content will appear. Avoid overlapping existing content. Center the loading indicator in the empty space where content will appear

Loading indicators can be placed within other components, such as buttons [More on buttons](/m3/pages/common-buttons/overview), to indicate that the action is ongoing, such as validating a form or checking for updates. Loading indicators can be placed in buttons that take a few seconds to take effect

Use loading indicators to show progress without taking up much space

## Responsive layout

Loading indicators default to 48dp, but the size is flexible. It should be between 24dp to 240dp, depending on the placement and the window size. Avoid exceeding the minimum and maximum sizes. The ratio between the container and the active indicator stays the same when resizing the loading indicator. Reserve very large progress indicators for large and extra-large windows, like desktop.

![Loading indicators can range from 24dps to 240dps.](../../assets/loading-indicator/guidelines/04-loading-indicators-can-range-from-24dps-to-240dps-e99fb8f1.png)

Loading indicators can range in size from 24–240dp

### Larger windows

As the pane or window size grows, consider scaling the loading indicator as well, so it remains proportional in size to the empty space around it. The loading indicator shouldn’t exceed 240dp. The loading indicator’s default size is ideal for mobile and other compact windows. The loading indicator should scale up in larger windows.

## Behavior

### Pull-to-refresh

The loading indicator is used in [pull-to-refresh](https://developer.android.com/develop/ui/compose/components/pull-to-refresh) on Jetpack Compose only. Pull-to-refresh is an Android system feature that manually refreshes screen content with an action or gesture. It’s used at the beginning of lists, grid lists, and card collections where the most recent content appears. It’s best to use pull-to-refresh with dynamic content that can have frequent updates, where people have a high chance of seeing new content after refreshing. The loading indicator for pull-to-refresh can appear on top of the content or adjacent to it

### Threshold requirements

To ensure intentional usage of the pull-to-refresh gesture, the loading indicator must pass a threshold before the app will refresh. After passing the threshold, completing the gesture initiates a refresh

Reversing the gesture past the threshold will cancel the refresh action

The loading indicator remains visible until the refresh activity completes and any new content is visible, or someone navigates away from the refreshing content.

check Do

Keep the loading indicator in view until the activity is completed to provide status of the refresh activity

close Don’t

Don’t scroll the loading indicator off-screen, as it hides the status of the refresh activity. It could imply that the refresh activity is associated with a specific component, such as a card, instead of the entire screen.

