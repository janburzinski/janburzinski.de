import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const adapter =
	process.env.BUILD_TARGET === 'node' ? nodeAdapter() : vercelAdapter({ runtime: 'nodejs22.x' });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: { adapter }
};

export default config;
