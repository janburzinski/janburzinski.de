import { gte } from 'drizzle-orm';
import type { DailyUsage, UsageStats } from '$lib/usage';
import {
	eventsToDailyRollups,
	fetchEventsSince,
	FULL_SYNC_CAP,
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
	harness: r.harness,
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

export function buildStats(rows: UsageRow[], updatedAt: number): UsageStats {
	// Rows are keyed by (date, model, harness), so the same model can appear once per harness on a
	// day. Merge models back together per day for the bar chart, and roll harnesses up all-time.
	const byDay = new Map<
		string,
		{ tokens: number; spendUsd: number; models: Map<string, number> }
	>();
	const modelTotals = new Map<string, number>();
	const harnessTotals = new Map<string, { tokens: number; spendUsd: number; events: number }>();
	let tokens = 0;
	let spendUsd = 0;
	let contributions = 0;

	for (const row of rows) {
		tokens += row.tokens;
		spendUsd += row.spendUsd;
		contributions += row.events;
		modelTotals.set(row.model, (modelTotals.get(row.model) ?? 0) + row.tokens);

		const harness = harnessTotals.get(row.harness) ?? { tokens: 0, spendUsd: 0, events: 0 };
		harness.tokens += row.tokens;
		harness.spendUsd += row.spendUsd;
		harness.events += row.events;
		harnessTotals.set(row.harness, harness);

		let bucket = byDay.get(row.date);
		if (!bucket) {
			bucket = { tokens: 0, spendUsd: 0, models: new Map() };
			byDay.set(row.date, bucket);
		}
		bucket.tokens += row.tokens;
		bucket.spendUsd += row.spendUsd;
		bucket.models.set(row.model, (bucket.models.get(row.model) ?? 0) + row.tokens);
	}

	const entries = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b));
	const days = entries.map(([date]) => date);
	const daily: DailyUsage[] = entries.map(([date, bucket]) => {
		return {
			date,
			tokens: bucket.tokens,
			spendUsd: bucket.spendUsd,
			models: [...bucket.models.entries()]
				.map(([model, t]) => ({ model, tokens: t }))
				.sort((a, b) => b.tokens - a.tokens)
		};
	});

	const topModel = [...modelTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
	// Ranked by token volume to match the donut's weighting (see HarnessChart).
	const harnesses = [...harnessTotals.entries()]
		.map(([harness, v]) => ({ harness, ...v }))
		.sort((a, b) => b.tokens - a.tokens);
	const topHarness = harnesses[0]?.harness ?? null;

	return {
		updatedAt,
		totals: {
			tokens,
			contributions,
			activeDays: days.length,
			longestStreak: longestStreak(days),
			spendUsd,
			topModel,
			topHarness
		},
		daily,
		harnesses
	};
}

export async function getUsageStats(): Promise<UsageStats> {
	const db = getDb();
	const [rows, state] = await Promise.all([
		db.select().from(usageDaily),
		db.select().from(syncState).limit(1)
	]);
	const updatedAt = state[0]?.lastSyncedAt?.getTime() ?? Date.now();
	return buildStats(rows, updatedAt);
}

export type SyncReport = {
	mode: 'backfill' | 'incremental';
	dryRun: boolean;
	customerId: string | null;
	events: number;
	rows: number;
	windowStart?: string;
	comparison?: SyncComparison;
};

type SyncTotals = {
	rows: number;
	events: number;
	tokens: number;
	spendUsd: number;
};

type SyncComparison = {
	current: SyncTotals;
	source: SyncTotals;
	delta: SyncTotals;
	matches: boolean;
	addedRows: number;
	updatedRows: number;
	removedRows: number;
	changes: SyncChange[];
};

type SyncRow = Pick<UsageRow, 'date' | 'model' | 'harness' | 'tokens' | 'spendUsd' | 'events'>;
type SyncValues = Pick<SyncRow, 'tokens' | 'spendUsd' | 'events'>;

type SyncChange = {
	date: string;
	model: string;
	harness: string;
	before: SyncValues | null;
	after: SyncValues | null;
};

const sumSyncRows = (rows: SyncRow[]): SyncTotals => {
	return rows.reduce<SyncTotals>(
		(totals, row) => ({
			rows: totals.rows + 1,
			events: totals.events + row.events,
			tokens: totals.tokens + row.tokens,
			spendUsd: totals.spendUsd + row.spendUsd
		}),
		{ rows: 0, events: 0, tokens: 0, spendUsd: 0 }
	);
};

export function compareSyncRows(currentRows: SyncRow[], sourceRows: SyncRow[]): SyncComparison {
	const current = sumSyncRows(currentRows);
	const source = sumSyncRows(sourceRows);
	const keyOf = (row: SyncRow) => `${row.date}\0${row.model}\0${row.harness}`;
	const currentByKey = new Map(currentRows.map((row) => [keyOf(row), row]));
	const sourceByKey = new Map(sourceRows.map((row) => [keyOf(row), row]));
	const keys = [...new Set([...currentByKey.keys(), ...sourceByKey.keys()])].sort();
	const changes: SyncChange[] = [];
	let addedRows = 0;
	let updatedRows = 0;
	let removedRows = 0;

	for (const key of keys) {
		const before = currentByKey.get(key);
		const after = sourceByKey.get(key);
		if (
			before &&
			after &&
			before.tokens === after.tokens &&
			before.events === after.events &&
			before.spendUsd === after.spendUsd
		) {
			continue;
		}
		if (!before) addedRows += 1;
		else if (!after) removedRows += 1;
		else updatedRows += 1;
		const row = after ?? before!;
		changes.push({
			date: row.date,
			model: row.model,
			harness: row.harness,
			before: before
				? { tokens: before.tokens, spendUsd: before.spendUsd, events: before.events }
				: null,
			after: after ? { tokens: after.tokens, spendUsd: after.spendUsd, events: after.events } : null
		});
	}

	return {
		current,
		source,
		delta: {
			rows: source.rows - current.rows,
			events: source.events - current.events,
			tokens: source.tokens - current.tokens,
			spendUsd: source.spendUsd - current.spendUsd
		},
		matches: changes.length === 0,
		addedRows,
		updatedRows,
		removedRows,
		changes
	};
}

function assertSafeReplacement(comparison: SyncComparison) {
	if (comparison.current.rows > 0 && comparison.source.rows === 0) {
		throw new Error('Refusing to replace non-empty usage rollups with an empty Autumn result');
	}
}

/**
 * Pull events from Autumn and replace the affected rollups in one transaction.
 *
 * - **Backfill**: pages over the entire bounded history, then `DELETE`s every rollup and re-inserts.
 *   Scheduled Vercel runs use this mode so older corrections are reconciled as well.
 * - **Incremental**: fetches only events in the trailing `RECOMPUTE_DAYS` window, then `DELETE`s rows
 *   with `date >= windowStart` and re-inserts the freshly computed ones. Older days are untouched.
 *
 * Both are recompute-replace (not additive), so a re-run over the same window produces identical
 * rows — idempotent, no double counting.
 */
export async function syncUsage(
	opts: { full?: boolean; dryRun?: boolean } = {}
): Promise<SyncReport> {
	const db = getDb();
	const now = Date.now();
	const full = opts.full === true;
	const dryRun = opts.dryRun === true;

	const customerId = await resolveCustomerId();
	if (!customerId) {
		return {
			mode: full ? 'backfill' : 'incremental',
			dryRun,
			customerId: null,
			events: 0,
			rows: 0
		};
	}

	if (full) {
		const events = await fetchEventsSince(customerId, 0, FULL_SYNC_CAP);
		const rollups = eventsToDailyRollups(events);
		const currentRows = await db.select().from(usageDaily);
		const comparison = compareSyncRows(currentRows, rollups);
		if (dryRun) {
			return {
				mode: 'backfill',
				dryRun: true,
				customerId,
				events: events.length,
				rows: rollups.length,
				comparison
			};
		}
		assertSafeReplacement(comparison);
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
		return {
			mode: 'backfill',
			dryRun: false,
			customerId,
			events: events.length,
			rows: rollups.length,
			comparison
		};
	}

	const windowStartMs = Date.parse(`${dayKey(now)}T00:00:00Z`) - RECOMPUTE_DAYS * DAY_MS;
	const windowStart = dayKey(windowStartMs);
	const events = await fetchEventsSince(customerId, windowStartMs);
	const rollups = eventsToDailyRollups(events);
	const currentRows = await db.select().from(usageDaily).where(gte(usageDaily.date, windowStart));
	const comparison = compareSyncRows(currentRows, rollups);
	if (dryRun) {
		return {
			mode: 'incremental',
			dryRun: true,
			customerId,
			events: events.length,
			rows: rollups.length,
			windowStart,
			comparison
		};
	}
	assertSafeReplacement(comparison);
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
		dryRun: false,
		customerId,
		events: events.length,
		rows: rollups.length,
		windowStart,
		comparison
	};
}
