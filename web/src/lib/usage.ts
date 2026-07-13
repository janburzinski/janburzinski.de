// Shared usage-stats shapes. Kept out of $lib/server so client components can import the types.

export type DailyUsage = {
	/** UTC day, YYYY-MM-DD. */
	date: string;
	tokens: number;
	spendUsd: number;
	/** Token totals per model, biggest first. */
	models: Array<{ model: string; tokens: number }>;
};

export type UsageStats = {
	updatedAt: number;
	totals: {
		tokens: number;
		/** Number of tracked requests. */
		contributions: number;
		activeDays: number;
		longestStreak: number;
		spendUsd: number;
		/** Model id with the most tokens overall (e.g. "anthropic/claude-opus-4-8"). */
		topModel: string | null;
	};
	/** Ascending by date, one entry per day that had usage. */
	daily: DailyUsage[];
};
