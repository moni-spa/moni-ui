import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.test.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html']
		}
	}
});
