declare module 'inputmask' {
	export interface InputmaskDefinition {
		validator: string | RegExp | ((character: string) => boolean);
		casing?: 'upper' | 'lower' | ((character: string) => string);
	}

	export interface InputmaskOptions {
		mask?: string | string[];
		alias?: string;
		definitions?: Record<string, InputmaskDefinition>;
		placeholder?: string;
		greedy?: boolean;
		clearIncomplete?: boolean;
		clearMaskOnLostFocus?: boolean;
		showMaskOnFocus?: boolean;
		showMaskOnHover?: boolean;
		removeMaskOnSubmit?: boolean;
		keepStatic?: boolean | null;
		repeat?: number | string;
		[key: string]: unknown;
	}

	export interface InputmaskInstance {
		mask(element: HTMLInputElement): InputmaskInstance;
		option(name: string): unknown;
		option(options: InputmaskOptions, noRemask?: boolean): InputmaskInstance;
		unmaskedvalue(value?: string): string;
		remove(): void;
		getemptymask(): string;
		hasMaskedValue(): boolean;
		isComplete(): boolean;
		getmetadata(): unknown;
		isValid(value?: string): boolean;
		format(value: string, metadata?: boolean): string | { value: string; metadata: unknown };
		setValue(value: string): void;
	}

	export default class Inputmask implements InputmaskInstance {
		constructor(options?: InputmaskOptions);
		constructor(alias: string, options?: InputmaskOptions);
		mask(element: HTMLInputElement): InputmaskInstance;
		remove(): void;
		unmaskedvalue(): string;
		option(name: string): unknown;
		option(options: InputmaskOptions, noRemask?: boolean): InputmaskInstance;
		getemptymask(): string;
		hasMaskedValue(): boolean;
		isComplete(): boolean;
		getmetadata(): unknown;
		isValid(value?: string): boolean;
		format(value: string, metadata?: boolean): string | { value: string; metadata: unknown };
		setValue(value: string): void;
		static extendDefaults(options: InputmaskOptions): void;
		static extendDefinitions(definitions: Record<string, InputmaskDefinition>): void;
		static extendAliases(aliases: Record<string, InputmaskOptions>): void;
		static format(value: string, options?: InputmaskOptions, metadata?: boolean): string | { value: string; metadata: unknown };
		static unmask(value: string, options?: InputmaskOptions): string;
		static isValid(value: string, options?: InputmaskOptions): boolean;
		static remove(elements: string | Element | NodeListOf<Element>): void;
		static setValue(elements: string | Element | NodeListOf<Element>, value: string): void;
	}
}
