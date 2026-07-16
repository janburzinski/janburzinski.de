export type DailyUsage = {
	date: string;
	tokens: number;
	spendUsd: number;
	models: Array<{ model: string; tokens: number }>;
};

export type HarnessUsage = {
	harness: string;
	tokens: number;
	spendUsd: number;
	events: number;
};

export type UsageStats = {
	updatedAt: number;
	totals: {
		tokens: number;
		contributions: number;
		activeDays: number;
		longestStreak: number;
		spendUsd: number;
		topModel: string | null;
		topHarness: string | null;
	};
	daily: DailyUsage[];
	harnesses: HarnessUsage[];
};
