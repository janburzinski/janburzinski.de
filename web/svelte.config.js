import adapter from '@sveltejs/adapter-cloudflare';
import nodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isNodeBuild = process.env.BUILD_TARGET === 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: isNodeBuild
			? nodeAdapter()
			: adapter({
				// Keep Cloudflare deploys working unless we explicitly build for Node/Docker.
				routes: {
					include: ['/*'],
					exclude: ['<all>']
				}
			})
	}
};

export default config;
