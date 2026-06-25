import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	root: '.',
	plugins: [tailwindcss()],
	server: {
		port: 5176,
		host: '0.0.0.0'
	},
	build: {
		rollupOptions: {
			input: {
				demo: './demo.html'
			}
		}
	}
});
