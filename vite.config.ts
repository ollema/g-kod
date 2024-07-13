import gleam from 'vite-gleam';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// @ts-expect-error - upstream error
	plugins: [sveltekit(), gleam()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			allow: ['./build/dev/javascript']
		}
	}
});
