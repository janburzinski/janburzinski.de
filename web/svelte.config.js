import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const buildTarget = process.env.BUILD_TARGET ?? 'cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: buildTarget === 'node'
			? nodeAdapter()
			: buildTarget === 'vercel'
				? vercelAdapter()
				: cloudflareAdapter({
					routes: {
						include: ['/*'],
						exclude: ['<all>']
					}
				})
	}
};

export default config;
