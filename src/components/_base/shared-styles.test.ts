import { describe, expect, it } from 'vitest';
import { sharedStyles } from './shared-styles.js';

describe('sharedStyles Material scrollbar', () => {
	it('styles scroll containers inside every component shadow root', () => {
		const styles = sharedStyles.cssText;

		expect(styles).toContain('--moni-scrollbar-size');
		expect(styles).toContain('scrollbar-width: thin');
		expect(styles).toContain('*::-webkit-scrollbar-thumb');
		expect(styles).toContain('*::-webkit-scrollbar-thumb:hover');
		expect(styles).toContain('*::-webkit-scrollbar-thumb:active');
		expect(styles).toContain('border-radius: 999px');
	});
});
