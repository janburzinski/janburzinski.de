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

// Server-side orchestration for the homepage usage stats. Reads are served entirely from the
// `usage_daily` rollups (no Autumn call on a page view); the daily cron calls `syncUsage` to pull
// fresh events from Autumn and replace recent rollups. See the flow in `.context/attachments`.

const DAY_MS = 86_400_000;
/**
 * Incremental sync recomputes the trailing N UTC days on every run — catches the in-progress day
 * plus any late-arriving events, while everything older is treated as settled and never re-fetched.
 */
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

/** Fold the flat (date, model) rows back into the homepage's UsageStats shape. */
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

	const days = [...byDay.keys()].sort();
	const daily: DailyUsage[] = days.map((date) => {
		const bucket = byDay.get(date)!;
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

// Short in-memory cache so bursts of page views on a warm instance share one DB round trip. It
// doesn't survive cold starts (that's fine — the data only changes once a day via the cron).
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
	/** Present on incremental runs — the inclusive UTC start date of the recomputed window. */
	windowStart?: string;
};

/**
 * Pull events from Autumn and replace the affected rollups in one transaction.
 *
 * - **Backfill** (forced with `full`, or automatic until the first backfill has run): page over the
 *   entire history uncapped, then `DELETE` every rollup and re-insert. Sets `backfilled_at`.
 * - **Incremental**: fetch only events in the trailing `RECOMPUTE_DAYS` window, then `DELETE` rows
 *   with `date >= windowStart` and re-insert the freshly computed ones. Older days are never touched.
 *
 * Both are recompute-replace (not additive), so a re-run over the same window produces identical
 * rows — idempotent, no double counting.
 */
export async function syncUsage(opts: { full?: boolean } = {}): Promise<SyncReport> {
	const db = getDb();
	const now = Date.now();
	const existing = await db.select().from(syncState).limit(1);
	const backfilled = existing[0]?.backfilledAt != null;
	const full = opts.full === true || !backfilled;

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
