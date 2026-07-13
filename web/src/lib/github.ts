// Shared GitHub-contribution shapes. Kept out of $lib/server so client components can import the
// types (mirrors $lib/usage for the AI-usage section).

export type ContributionDay = {
	/** UTC day, YYYY-MM-DD. */
	date: string;
	count: number;
	/** GitHub's own quartile bucket (NONE → FOURTH_QUARTILE), mapped to 0–4. Drives the dither density. */
	level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionStats = {
	updatedAt: number;
	/** Total contributions in the trailing-year window GitHub reports. */
	total: number;
	activeDays: number;
	longestStreak: number;
	/** Trailing run of active days; an empty "today" is treated as in-progress, not a break. */
	currentStreak: number;
	busiestDay: { date: string; count: number } | null;
	/** Calendar columns, oldest → newest; each is up to 7 days, one per weekday present. */
	weeks: ContributionDay[][];
};
