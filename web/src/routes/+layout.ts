import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url }) => {
	const { pathname } = url;

	return {
		pathname,
		title: undefined as string | undefined,
		description: undefined as string | undefined
	};
};
