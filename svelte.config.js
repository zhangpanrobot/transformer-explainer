import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		warningFilter: (warning) => {
			const ignoreList = [
				'a11y_click_events_have_key_events',
				'a11y_no_static_element_interactions',
				'css_unused_selector'
			]
			return !ignoreList.includes(warning.code)
		}
	},

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: false
		}),
		prerender: {
			entries: ['/']
		},
		alias: {
			'~': './src'
		},
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/transformer-explainer' : ''
		}
	}
};

export default config;
