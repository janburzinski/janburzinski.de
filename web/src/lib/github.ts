export type ContributionDay = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionStats = {
	updatedAt: number;
	total: number;
	activeDays: number;
	longestStreak: number;
	currentStreak: number;
	busiestDay: { date: string; count: number } | null;
	weeks: ContributionDay[][];
};
