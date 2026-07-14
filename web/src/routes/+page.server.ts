import type { PageServerLoad } from './$types';
import { getUsageStats } from '$lib/server/usage';
import { getContributionStats } from '$lib/server/github';
import type { UsageStats } from '$lib/usage';
import type { ContributionStats } from '$lib/github';

export const load: PageServerLoad = () => {
	// Returning promises lets both optional sections stream independently.
	return {
		usage: getUsageStats().catch((error): UsageStats | null => {
			console.error('[usage] failed to load usage stats:', error);
			return null;
		}),
		contributions: getContributionStats().catch((error): ContributionStats | null => {
			console.error('[github] failed to load contribution stats:', error);
			return null;
		})
	};
};
