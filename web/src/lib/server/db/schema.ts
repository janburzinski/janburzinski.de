import {
	bigint,
	date,
	doublePrecision,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

/**
 * Pre-computed daily usage rollups — one row per (UTC day, model). The homepage stats are all
 * derivable from these rows, so a page view never has to touch Autumn. The daily Vercel cron
 * recomputes recent days and replaces them (see `syncUsage` in `$lib/server/usage`).
 */
export const usageDaily = pgTable(
	'usage_daily',
	{
		/** UTC day, "YYYY-MM-DD". */
		date: date('date', { mode: 'string' }).notNull(),
		/** Model id, e.g. "anthropic/claude-opus-4-8". */
		model: text('model').notNull(),
		/** input + output + cache_read + cache_write tokens summed over the day's events. */
		tokens: bigint('tokens', { mode: 'number' }).notNull(),
		/** Summed Autumn `value` (USD). */
		spendUsd: doublePrecision('spend_usd').notNull(),
		/** Number of contributing events. */
		events: integer('events').notNull()
	},
	(t) => [primaryKey({ columns: [t.date, t.model] })]
);

/** Single-row sync cursor for the Autumn → DB rollup job. */
export const syncState = pgTable('sync_state', {
	/** Constant `'autumn'`. */
	id: text('id').primaryKey(),
	/** Null until the first full backfill has run. */
	backfilledAt: timestamp('backfilled_at', { withTimezone: true }),
	lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
});
