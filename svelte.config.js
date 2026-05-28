import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		warningFilter: (warning) => {
			const ignoreList = [
				'a11y_click_events_have_key_events',
				'css_unused_selector'
			]
			return !ignoreList.includes(warning.code)
		}
	},

	// 忽略未使用 CSS 选择器的警告（构建时会自动移除）
	// onwarn: (warning, handler) => {
	// 	if (warning.code === 'css-unused-selector') return;
	// 	handler(warning);
	// },

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
