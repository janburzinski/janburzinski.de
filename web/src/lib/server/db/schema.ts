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
		tokens: bigint('tokens', { mode: 'number' }).notNull(),
		spendUsd: doublePrecision('spend_usd').notNull(),
		events: integer('events').notNull()
	},
	(t) => [primaryKey({ columns: [t.date, t.model] })]
);

export const syncState = pgTable('sync_state', {
	id: text('id').primaryKey(),
	backfilledAt: timestamp('backfilled_at', { withTimezone: true }),
	lastSyncedAt: timestamp('last_synced_at', { withTimezone: true })
});
