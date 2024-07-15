/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createAppleSplashScreens,
	defineConfig,
	type Preset
} from '@vite-pwa/assets-generator/config';

const minimal2023Preset: Preset = {
	transparent: {
		sizes: [64, 192, 512],
		favicons: [[48, 'favicon.ico']]
	},
	maskable: {
		sizes: [512],
		padding: 0.2,
		resizeOptions: { background: '#262626', fit: 'contain' }
	},
	apple: {
		sizes: [180],
		padding: 0.0,
		resizeOptions: { background: '#262626', fit: 'contain' }
	}
};

const basePath = '%sveltekit.assets%/';

const splashScreenConfig = createAppleSplashScreens({
	resizeOptions: { background: '#262626', fit: 'contain' }
});

export default defineConfig({
	headLinkOptions: {
		basePath: basePath
	},
	preset: {
		...minimal2023Preset
		// appleSplashScreens: splashScreenConfig
	},
	images: [
		'static/g.svg'
		// 'static/g-kod.xyz.svg'
	]
});
