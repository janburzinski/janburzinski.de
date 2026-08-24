import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import type { LayoutLoad } from './$types';

injectAnalytics({ mode: dev ? 'development' : 'production' });

export const load: LayoutLoad = ({ url }) => {
	const { pathname } = url;

	return {
		pathname,
		title: undefined as string | undefined,
		description: undefined as string | undefined
	};
};
