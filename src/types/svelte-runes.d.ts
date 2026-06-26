/**
 * @file types/svelte-runes.d.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

/**
 * Minimal ambient type declarations for Svelte 5 compiler runes.
 *
 * Svelte 5 introduces "runes" — special compiler-recognized global functions
 * (`$state`, `$derived`, `$effect`, `$props`) that are transformed at build
 * time by the Svelte compiler. Outside the Svelte compiler pipeline (e.g.
 * when TypeScript checks `.ts` files that use runes, like `theme.svelte.ts`),
 * these globals are not declared, causing `tsc` to emit "Cannot find name '$state'"
 * errors.
 *
 * This file declares them as simple pass-through generics so TypeScript is
 * satisfied without requiring the Svelte compiler to be part of the `tsc`
 * type-check pipeline.
 *
 * **Important:** These declarations reflect the type signatures of the runes,
 * not their full runtime behavior. They are intentionally minimal — just enough
 * to pass `tsc --noEmit`. The real reactive behavior is provided by the Svelte
 * compiler at build time.
 *
 * @see {@link https://svelte.dev/docs/svelte/what-are-runes Svelte 5 Runes}
 */

/**
 * Declares a reactive state variable.
 * At runtime, reading or writing `value` triggers Svelte's fine-grained reactivity.
 * For TypeScript checking outside the compiler, typed as a plain value.
 *
 * @template T - The type of the state value.
 * @param initial - The initial value of the state.
 * @returns A reactive reference to the value (typed as `T` for TS purposes).
 */
declare const $state: <T>(initial: T) => T;

/**
 * Declares a derived (computed) value that updates whenever its dependencies change.
 * The function `fn` is re-run automatically by Svelte when any reactive state
 * it reads changes.
 *
 * @template T - The type of the derived value.
 * @param fn - A function that computes the derived value.
 * @returns The computed value (typed as `T` for TS purposes).
 */
declare const $derived: <T>(fn: () => T) => T;

/**
 * Declares a reactive side effect that re-runs when its reactive dependencies change.
 * The returned cleanup function (if any) is called before the effect re-runs and
 * when the component is destroyed.
 *
 * @param fn - The effect function. May return a cleanup function.
 */
declare const $effect: (fn: () => void | (() => void)) => void;

/**
 * Declares the props of a Svelte 5 component as a reactive object.
 * Used inside `<script>` blocks to destructure incoming properties with
 * full TypeScript type support.
 *
 * @template T - The shape of the component's props. Defaults to `Record<string, unknown>`.
 * @returns The component's props object.
 */
declare const $props: <T = Record<string, unknown>>() => T;
