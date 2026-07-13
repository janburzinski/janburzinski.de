import type { PageServerLoad } from './$types';
import { getUsageStats } from '$lib/server/usage';
import { getContributionStats } from '$lib/server/github';
import type { UsageStats } from '$lib/usage';
import type { ContributionStats } from '$lib/github';

// Cache rendered pages at the edge and ignore tracking parameters when selecting a cache entry.
export const config = {
	isr: { expiration: 3600, allowQuery: [] }
};

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
