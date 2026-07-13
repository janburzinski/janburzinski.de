import { env } from '$env/dynamic/private';
import type { ContributionDay, ContributionStats } from '$lib/github';

// GitHub's contribution calendar for the trailing year, pulled live from the GraphQL API. Unlike the
// Autumn usage feed (paged, capped, DB-backed), the whole calendar comes back in a single cheap query,
// so there's no cron/DB here — just a short in-memory cache so page views share one round trip.
// Server-only: the token must never reach the client. Auth: any GitHub token (a scopeless classic PAT
// or a fine-grained token with read access) can read a public user's contribution calendar.

const GRAPHQL_URL = 'https://api.github.com/graphql';
const DEFAULT_USERNAME = 'janburzinski';
const CACHE_TTL_MS = 30 * 60_000;

const LEVELS: Record<string, ContributionDay['level']> = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4
};

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

type GqlDay = { date: string; contributionCount: number; contributionLevel: string };
type GqlCalendar = { totalContributions: number; weeks: Array<{ contributionDays: GqlDay[] }> };
type GqlResponse = {
	data?: { user?: { contributionsCollection?: { contributionCalendar?: GqlCalendar } } };
	errors?: Array<{ message: string }>;
};

/** Fold GitHub's calendar into the homepage's ContributionStats shape. */
function buildStats(calendar: GqlCalendar): ContributionStats {
	const weeks: ContributionDay[][] = calendar.weeks.map((w) =>
		w.contributionDays.map((d) => ({
			date: d.date,
			count: d.contributionCount,
			level: LEVELS[d.contributionLevel] ?? 0
		}))
	);

	// weeks come oldest → newest and each day is in weekday order, so the flat list is chronological.
	const days = weeks.flat();
	let activeDays = 0;
	let longest = 0;
	let run = 0;
	let busiest: { date: string; count: number } | null = null;
	for (const d of days) {
		if (d.count > 0) {
			activeDays++;
			run++;
			if (run > longest) longest = run;
		} else {
			run = 0;
		}
		if (!busiest || d.count > busiest.count) busiest = { date: d.date, count: d.count };
	}

	// Current streak walks back from the newest day. If today (the last cell) is still empty, skip it
	// rather than reporting a broken streak — it's an in-progress day, exactly how GitHub reads it.
	let current = 0;
	let i = days.length - 1;
	if (i >= 0 && days[i].count === 0) i--;
	for (; i >= 0 && days[i].count > 0; i--) current++;

	return {
		updatedAt: Date.now(),
		total: calendar.totalContributions,
		activeDays,
		longestStreak: longest,
		currentStreak: current,
		busiestDay: busiest && busiest.count > 0 ? busiest : null,
		weeks
	};
}

// Short in-memory cache — same rationale as the usage stats: bursts of page views on a warm instance
// share one GitHub call, and a cold start just refetches (the calendar changes at most once a day).
let cache: { at: number; stats: ContributionStats } | null = null;

export async function getContributionStats(): Promise<ContributionStats> {
	if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.stats;

	const token = env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN is not set');
	const login = env.GITHUB_USERNAME || DEFAULT_USERNAME;

	const res = await fetch(GRAPHQL_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			'User-Agent': 'janburzinski.de'
		},
		body: JSON.stringify({ query: QUERY, variables: { login } })
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub GraphQL failed (${res.status}): ${text.slice(0, 200)}`);
	}

	const payload = (await res.json()) as GqlResponse;
	if (payload.errors?.length) {
		throw new Error(`GitHub GraphQL error: ${payload.errors.map((e) => e.message).join('; ')}`);
	}
	const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
	if (!calendar) throw new Error('GitHub returned no contribution calendar');

	const stats = buildStats(calendar);
	cache = { at: Date.now(), stats };
	return stats;
}
