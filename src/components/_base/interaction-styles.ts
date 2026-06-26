/**
 * @file components/_base/interaction-styles.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css } from 'lit';

/**
 * Material Design 3 State Layer system — CSS-only implementation.
 *
 * Material Design 3 defines **state layers** as semi-transparent color overlays
 * that communicate interactive state visually to the user. They are applied on
 * top of a component's background without altering its base color, allowing
 * correct rendering across all surface and container colors.
 *
 * **M3 state layer opacity values (from the spec):**
 * | State     | Opacity |
 * |-----------|---------|
 * | Hover     | 8%      |
 * | Focus     | 12%     |
 * | Pressed   | 12%     |
 * | Dragged   | 16%     |
 *
 * **Implementation strategy:**
 * The state layer is rendered as a `::before` pseudo-element whose `opacity`
 * transitions between states. A second `::after` pseudo-element provides a
 * CSS-only center-origin ripple on press. For pointer-origin ripples
 * (where the ripple starts at the tap/click point), use `<moni-ripple>` instead.
 *
 * **Host element requirements:**
 * The element bearing the `.interactive` class MUST have:
 * - `position: relative` — so `::before` / `::after` are contained within it.
 * - `overflow: hidden` — so the expanding ripple clips to the element's shape.
 * - `isolation: isolate` — prevents the pseudo-elements from bleeding into
 *   stacking contexts created by parent elements.
 *
 * **Usage:**
 * ```ts
 * static override styles = [sharedStyles, interactionStyles, css`...`];
 * ```
 * Then in the template:
 * ```html
 * <button class="interactive">Click me</button>
 * ```
 *
 * @see {@link https://m3.material.io/foundations/interaction/states/overview M3 State overview}
 */
export const interactionStyles = css`
	/* ─── State layer opacity tokens (M3 spec values) ──────────────────────── */
	:host {
		/** Opacity applied on hover. M3 spec: 8%. */
		--_state-hover: 0.08;
		/** Opacity applied on keyboard focus. M3 spec: 12%. */
		--_state-focus: 0.12;
		/** Opacity applied on press/active. M3 spec: 12%. */
		--_state-pressed: 0.12;
		/** Opacity applied during drag. M3 spec: 16%. */
		--_state-dragged: 0.16;
		/**
		 * Color of the state layer overlay.
		 * Defaults to currentColor so it adapts to the element's text color.
		 * Override with --_state-color: var(--primary) for selected states.
		 */
		--_state-color: currentColor;
	}

	/* ─── The interactive container ─────────────────────────────────────────── */
	.interactive {
		position: relative;
		overflow: hidden;
		/* isolation: isolate prevents the pseudo-elements from mixing with
		   parent stacking contexts that use opacity or transform. */
		isolation: isolate;
	}

	/* ─── State layer pseudo-element (::before) ─────────────────────────────── */
	/* The layer sits above the element's background but below its content.      */
	.interactive::before {
		content: '';
		position: absolute;
		inset: 0;
		/* Inherit the border-radius from the host so the layer clips correctly
		   on rounded buttons, chips, and cards. */
		border-radius: inherit;
		background-color: var(--_state-color);
		opacity: 0; /* Hidden by default; transitions in on state change. */
		pointer-events: none; /* Never intercept pointer events. */
		transition: opacity var(--speed2, 200ms) ease;
		/* z-index 0 places the layer above the background (z=-1 would be behind). */
		z-index: 0;
	}

	/* Hover: slight overlay to signal interactivity. */
	.interactive:hover::before {
		opacity: var(--_state-hover);
	}

	/* Focus-visible: stronger overlay for keyboard / programmatic focus.
	   :focus-visible is preferred over :focus to avoid showing the indicator
	   on mouse clicks (which have their own press state). */
	.interactive:focus-visible::before {
		opacity: var(--_state-focus);
	}

	/* Pressed / active: same opacity as focus but instant onset — the transition
	   handles the fade-out on pointer-up via the inherited duration. */
	.interactive:active::before {
		opacity: var(--_state-pressed);
		/* transition-duration: 0s — state layer appears instantaneously on press. */
		transition-duration: 0s;
	}

	/* Disabled — no state layer rendered at all (not just hidden). */
	.interactive:disabled::before,
	.interactive[aria-disabled='true']::before,
	:host([disabled]) .interactive::before {
		display: none;
	}

	/* ─── Selected / active modifier ────────────────────────────────────────── */
	/* When a component is in a "selected" state (active nav item, checked chip,
	   current tab), the state layer color switches to the primary color so the
	   overlay is visually meaningful even on primary-container backgrounds. */
	.interactive.selected::before,
	.interactive[aria-selected='true']::before,
	.interactive[aria-current]::before {
		--_state-color: var(--primary);
		/* Always show a subtle primary overlay to reinforce the selected state. */
		opacity: var(--_state-hover);
	}
	.interactive.selected:hover::before,
	.interactive[aria-selected='true']:hover::before {
		/* Increase opacity slightly on hover within a selected element. */
		opacity: calc(var(--_state-hover) * 1.5);
	}

	/* ─── Content z-index ────────────────────────────────────────────────────── */
	/* Ensure all direct children of .interactive render above the state layer
	   (z-index: 0) and the ripple pseudo-element (z-index: 0). */
	.interactive > * {
		position: relative;
		z-index: 1;
	}

	/* ─── CSS-only center-origin ripple (::after) ───────────────────────────── */
	/* Provides a basic expanding circle animation on :active. The circle always
	   originates from the element's center. For a pointer-origin ripple (where
	   the ripple starts at the exact tap/click coordinate), use <moni-ripple>
	   with JS activation instead. */
	.interactive::after {
		content: '';
		position: absolute;
		inset: 50%; /* Collapses to a point at the center. */
		border-radius: 50%;
		background-color: var(--_state-color);
		opacity: 0;
		transform: translate(-50%, -50%) scale(0);
		pointer-events: none;
		z-index: 0;
	}

	/* Trigger the ripple keyframe animation on active/press. */
	.interactive:active::after {
		animation: to-ripple var(--speed3, 300ms) cubic-bezier(0.2, 0, 0, 1) forwards;
	}

	/* Respect the user's reduced-motion preference by disabling the ripple.
	   The ::before state layer still functions, providing a static visual cue. */
	@media (prefers-reduced-motion: reduce) {
		.interactive::after {
			display: none;
		}
	}
`;

export default interactionStyles;
