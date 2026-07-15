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

export const usageDaily = pgTable(
	'usage_daily',
	{
		date: date('date', { mode: 'string' }).notNull(),
		model: text('model').notNull(),
		// Which agent/CLI drove the request (claude-code, codex, opencode, …). Default lets the
		// column land on top of existing rows during `db:push`; a full backfill then fills real values.
		harness: text('harness').notNull().default('unknown'),
		tokens: bigint('tokens', { mode: 'number' }).notNull(),
		spendUsd: doublePrecision('spend_usd').notNull(),
		events: integer('events').notNull()
	},
	(t) => [primaryKey({ columns: [t.date, t.model, t.harness] })]
);

export const syncState = pgTable('sync_state', {
	id: text('id').primaryKey(),
	backfilledAt: timestamp('backfilled_at', { withTimezone: true }),
	lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
});
