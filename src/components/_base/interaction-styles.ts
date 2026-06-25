import { css } from 'lit';

/**
 * M3 State Layer system — CSS-only implementation.
 *
 * Material Design 3 defines "state layers" as semi-transparent overlays that
 * communicate interactive state: hover, focus, pressed, dragged. These are
 * applied via a `::before` pseudo-element so they compose with any background.
 *
 * The host element MUST have:
 *   position: relative   (so the pseudo-element positions inside it)
 *   overflow: hidden     (so the layer clips to the element's shape)
 *
 * Usage — include in any interactive component's `static styles`:
 *   static override styles = [sharedStyles, interactionStyles, css`...`];
 *
 * The `.interactive` class activates the state layer. Apply it to the inner
 * element (button, anchor, div) that the user interacts with.
 *
 * Reference: https://m3.material.io/foundations/interaction/states/overview
 */
export const interactionStyles = css`
	/* ─── State layer opacity tokens (M3 spec) ─── */
	:host {
		--_state-hover: 0.08;
		--_state-focus: 0.12;
		--_state-pressed: 0.12;
		--_state-dragged: 0.16;
		--_state-color: currentColor;
	}

	/* ─── The pseudo-element overlay ─── */
	.interactive {
		position: relative;
		overflow: hidden;
		/* Needed for ripple containment */
		isolation: isolate;
	}

	.interactive::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background-color: var(--_state-color);
		opacity: 0;
		pointer-events: none;
		/* Use the same transition speed as other properties on the element */
		transition: opacity var(--speed2, 200ms) ease;
		/* Ensure the layer sits above background but below content */
		z-index: 0;
	}

	/* Hover */
	.interactive:hover::before {
		opacity: var(--_state-hover);
	}

	/* Focus-visible (keyboard / programmatic) */
	.interactive:focus-visible::before {
		opacity: var(--_state-focus);
	}

	/* Pressed / active */
	.interactive:active::before {
		opacity: var(--_state-pressed);
		/* Instant on press — fade out on release handled by transition */
		transition-duration: 0s;
	}

	/* Disabled — no state layer at all */
	.interactive:disabled::before,
	.interactive[aria-disabled='true']::before,
	:host([disabled]) .interactive::before {
		display: none;
	}

	/* ─── Selected/active modifier ─── */
	/* When an element is in a "selected" state (e.g. active nav item, checked
	   chip) the state layer color shifts to match the container color. */
	.interactive.selected::before,
	.interactive[aria-selected='true']::before,
	.interactive[aria-current]::before {
		--_state-color: var(--primary);
		opacity: var(--_state-hover);
	}
	.interactive.selected:hover::before,
	.interactive[aria-selected='true']:hover::before {
		opacity: calc(var(--_state-hover) * 1.5);
	}

	/* ─── Ensure content renders above the state layer ─── */
	.interactive > * {
		position: relative;
		z-index: 1;
	}

	/* ─── Ripple (CSS-only expanding circle) ─── */
	/* This provides a basic CSS ripple from center on :active.
	   For a pointer-origin ripple, use <moni-ripple> with JS activation. */
	.interactive::after {
		content: '';
		position: absolute;
		inset: 50%;
		border-radius: 50%;
		background-color: var(--_state-color);
		opacity: 0;
		transform: translate(-50%, -50%) scale(0);
		pointer-events: none;
		z-index: 0;
	}

	.interactive:active::after {
		animation: to-ripple var(--speed3, 300ms) cubic-bezier(0.2, 0, 0, 1) forwards;
	}

	/* Disable ripple animation when motion is reduced */
	@media (prefers-reduced-motion: reduce) {
		.interactive::after {
			display: none;
		}
	}
`;

export default interactionStyles;
