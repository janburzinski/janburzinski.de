export type DailyUsage = {
	date: string;
	tokens: number;
	spendUsd: number;
	models: Array<{ model: string; tokens: number }>;
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
	};
	daily: DailyUsage[];
};
