// Minimal type declarations for Svelte 5 runes used in non-Svelte TS files.
// These allow the project to type-check without requiring the Svelte compiler in the TS pipeline.

declare const $state: <T>(initial: T) => T;
declare const $derived: <T>(fn: () => T) => T;
declare const $effect: (fn: () => void | (() => void)) => void;
declare const $props: <T = Record<string, unknown>>() => T;
