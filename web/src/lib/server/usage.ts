import { gte } from 'drizzle-orm';
import type { DailyUsage, UsageStats } from '$lib/usage';
import {
	eventsToDailyRollups,
	fetchEventsSince,
	resolveCustomerId,
	type DailyRollup
} from './autumn';
import { getDb } from './db';
import { syncState, usageDaily } from './db/schema';

const DAY_MS = 86_400_000;
const RECOMPUTE_DAYS = 3;

const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const rollupToRow = (r: DailyRollup) => ({
	date: r.date,
	model: r.model,
	tokens: r.tokens,
	spendUsd: r.spendUsd,
	events: r.events
});

/** Longest run of consecutive UTC days present in the (sorted, unique) day set. */
function longestStreak(days: string[]): number {
	if (!days.length) return 0;
	const ms = days.map((d) => Date.parse(`${d}T00:00:00Z`)).sort((a, b) => a - b);
	let best = 1;
	let run = 1;
	for (let i = 1; i < ms.length; i++) {
		run = ms[i] - ms[i - 1] === DAY_MS ? run + 1 : 1;
		if (run > best) best = run;
	}
	return best;
}

type UsageRow = typeof usageDaily.$inferSelect;

function buildStats(rows: UsageRow[], updatedAt: number): UsageStats {
	const byDay = new Map<string, { tokens: number; spendUsd: number; models: UsageRow[] }>();
	const modelTotals = new Map<string, number>();
	let tokens = 0;
	let spendUsd = 0;
	let contributions = 0;

	for (const row of rows) {
		tokens += row.tokens;
		spendUsd += row.spendUsd;
		contributions += row.events;
		modelTotals.set(row.model, (modelTotals.get(row.model) ?? 0) + row.tokens);

		let bucket = byDay.get(row.date);
		if (!bucket) {
			bucket = { tokens: 0, spendUsd: 0, models: [] };
			byDay.set(row.date, bucket);
		}
		bucket.tokens += row.tokens;
		bucket.spendUsd += row.spendUsd;
		bucket.models.push(row);
	}

	const entries = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
	const days = entries.map(([date]) => date);
	const daily: DailyUsage[] = entries.map(([date, bucket]) => {
		return {
			date,
			tokens: bucket.tokens,
			spendUsd: bucket.spendUsd,
			models: bucket.models
				.map((m) => ({ model: m.model, tokens: m.tokens }))
				.sort((a, b) => b.tokens - a.tokens)
		};
	});

	const topModel = [...modelTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

	return {
		updatedAt,
		totals: {
			tokens,
			contributions,
			activeDays: days.length,
			longestStreak: longestStreak(days),
			spendUsd,
			topModel
		},
		daily
	};
}

const CACHE_TTL_MS = 60_000;
let cache: { at: number; stats: UsageStats } | null = null;

export async function getUsageStats(): Promise<UsageStats> {
	if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.stats;
	const db = getDb();
	const [rows, state] = await Promise.all([
		db.select().from(usageDaily),
		db.select().from(syncState).limit(1)
	]);
	const updatedAt = state[0]?.lastSyncedAt?.getTime() ?? Date.now();
	const stats = buildStats(rows, updatedAt);
	cache = { at: Date.now(), stats };
	return stats;
}

export type SyncReport = {
	mode: 'backfill' | 'incremental';
	customerId: string | null;
	events: number;
	rows: number;
	windowStart?: string;
};

/**
 * Pull events from Autumn and replace the affected rollups in one transaction.
 *
 * - **Backfill**: only runs when explicitly forced with `full`; it pages over the entire history,
 *   then `DELETE`s every rollup and re-inserts. Keeping it off the cron path prevents a large initial
 *   history from becoming an unbounded daily retry loop.
 * - **Incremental** (including the first scheduled run): fetch only events in the trailing
 *   `RECOMPUTE_DAYS` window, then `DELETE` rows with `date >= windowStart` and re-insert the freshly
 *   computed ones. Older days are never touched.
 *
 * Both are recompute-replace (not additive), so a re-run over the same window produces identical
 * rows — idempotent, no double counting.
 */
export async function syncUsage(opts: { full?: boolean } = {}): Promise<SyncReport> {
	const db = getDb();
	const now = Date.now();
	const full = opts.full === true;

	const customerId = await resolveCustomerId();
	if (!customerId) {
		return { mode: full ? 'backfill' : 'incremental', customerId: null, events: 0, rows: 0 };
	}

	if (full) {
		const events = await fetchEventsSince(customerId, 0, Infinity);
		const rollups = eventsToDailyRollups(events);
		await db.transaction(async (tx) => {
			await tx.delete(usageDaily);
			if (rollups.length) await tx.insert(usageDaily).values(rollups.map(rollupToRow));
			await tx
				.insert(syncState)
				.values({ id: 'autumn', backfilledAt: new Date(now), lastSyncedAt: new Date(now) })
				.onConflictDoUpdate({
					target: syncState.id,
					set: { backfilledAt: new Date(now), lastSyncedAt: new Date(now) }
				});
		});
		return { mode: 'backfill', customerId, events: events.length, rows: rollups.length };
	}

	const windowStartMs = Date.parse(`${dayKey(now)}T00:00:00Z`) - RECOMPUTE_DAYS * DAY_MS;
	const windowStart = dayKey(windowStartMs);
	const events = await fetchEventsSince(customerId, windowStartMs);
	const rollups = eventsToDailyRollups(events);
	await db.transaction(async (tx) => {
		await tx.delete(usageDaily).where(gte(usageDaily.date, windowStart));
		if (rollups.length) await tx.insert(usageDaily).values(rollups.map(rollupToRow));
		await tx
			.insert(syncState)
			.values({ id: 'autumn', lastSyncedAt: new Date(now) })
			.onConflictDoUpdate({ target: syncState.id, set: { lastSyncedAt: new Date(now) } });
	});
	return {
		mode: 'incremental',
		customerId,
		events: events.length,
		rows: rollups.length,
		windowStart
	};
}
