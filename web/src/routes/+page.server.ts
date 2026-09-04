import type { PageServerLoad } from './$types';
import { getContributionStats } from '$lib/server/github';
import type { ContributionStats } from '$lib/github';

export const load: PageServerLoad = () => {
	return {
		contributions: getContributionStats().catch((error): ContributionStats | null => {
			console.error('[github] failed to load contribution stats:', error);
			return null;
		})
	};
};
