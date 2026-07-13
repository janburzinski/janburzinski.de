import type { PageServerLoad } from './$types';
import { getUsageStats } from '$lib/server/usage';
import { getContributionStats } from '$lib/server/github';
import type { UsageStats } from '$lib/usage';
import type { ContributionStats } from '$lib/github';

export const load: PageServerLoad = async () => {
	// Load both independently and never let a flaky read take down the homepage — a failed section
	// just resolves to null and hides itself.
	const [usage, contributions] = await Promise.all([
		getUsageStats().catch((error): UsageStats | null => {
			console.error('[usage] failed to load usage stats:', error);
			return null;
		}),
		getContributionStats().catch((error): ContributionStats | null => {
			console.error('[github] failed to load contribution stats:', error);
			return null;
		})
	]);

	return { usage, contributions };
};
