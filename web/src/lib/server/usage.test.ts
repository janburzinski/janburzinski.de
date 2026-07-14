import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	resolveCustomerId: vi.fn(),
	fetchEventsSince: vi.fn(),
	eventsToDailyRollups: vi.fn(),
	transaction: vi.fn(),
	select: vi.fn()
}));

vi.mock('./autumn', () => ({
	FULL_SYNC_CAP: 100_000,
	resolveCustomerId: mocks.resolveCustomerId,
	fetchEventsSince: mocks.fetchEventsSince,
	eventsToDailyRollups: mocks.eventsToDailyRollups
}));

vi.mock('./db', () => ({
	getDb: () => ({ select: mocks.select, transaction: mocks.transaction })
}));

import { compareSyncRows, syncUsage } from './usage';

beforeEach(() => {
	vi.clearAllMocks();
});

describe('compareSyncRows', () => {
	it('reports source-minus-database deltas', () => {
		expect(
			compareSyncRows(
				[{ date: '2026-07-13', model: 'a', tokens: 10, spendUsd: 1.5, events: 2 }],
				[
					{ date: '2026-07-13', model: 'a', tokens: 12, spendUsd: 2, events: 3 },
					{ date: '2026-07-14', model: 'b', tokens: 5, spendUsd: 0.25, events: 1 }
				]
			)
		).toEqual({
			current: { rows: 1, tokens: 10, spendUsd: 1.5, events: 2 },
			source: { rows: 2, tokens: 17, spendUsd: 2.25, events: 4 },
			delta: { rows: 1, tokens: 7, spendUsd: 0.75, events: 2 },
			matches: false,
			addedRows: 1,
			updatedRows: 1,
			removedRows: 0,
			changes: [
				{
					date: '2026-07-13',
					model: 'a',
					before: { tokens: 10, spendUsd: 1.5, events: 2 },
					after: { tokens: 12, spendUsd: 2, events: 3 }
				},
				{
					date: '2026-07-14',
					model: 'b',
					before: null,
					after: { tokens: 5, spendUsd: 0.25, events: 1 }
				}
			]
		});
	});

	it('detects row-level drift even when aggregate totals cancel out', () => {
		const comparison = compareSyncRows(
			[
				{ date: '2026-07-13', model: 'a', tokens: 10, spendUsd: 1, events: 1 },
				{ date: '2026-07-13', model: 'b', tokens: 5, spendUsd: 1, events: 1 }
			],
			[
				{ date: '2026-07-13', model: 'a', tokens: 5, spendUsd: 1, events: 1 },
				{ date: '2026-07-13', model: 'b', tokens: 10, spendUsd: 1, events: 1 }
			]
		);

		expect(comparison.delta.tokens).toBe(0);
		expect(comparison.matches).toBe(false);
		expect(comparison.updatedRows).toBe(2);
	});
});

describe('syncUsage dry run', () => {
	it('fully validates and compares a backfill without opening a transaction', async () => {
		const current = [{ date: '2026-07-14', model: 'test', tokens: 10, spendUsd: 1, events: 1 }];
		const source = [{ date: '2026-07-14', model: 'test', tokens: 15, spendUsd: 2, events: 2 }];
		mocks.resolveCustomerId.mockResolvedValue('customer');
		mocks.fetchEventsSince.mockResolvedValue([{ id: 'one' }, { id: 'two' }]);
		mocks.eventsToDailyRollups.mockReturnValue(source);
		mocks.select.mockReturnValue({ from: () => Promise.resolve(current) });

		await expect(syncUsage({ full: true, dryRun: true })).resolves.toMatchObject({
			mode: 'backfill',
			dryRun: true,
			customerId: 'customer',
			events: 2,
			rows: 1,
			comparison: {
				current: { rows: 1, tokens: 10, spendUsd: 1, events: 1 },
				source: { rows: 1, tokens: 15, spendUsd: 2, events: 2 },
				delta: { rows: 0, tokens: 5, spendUsd: 1, events: 1 }
			}
		});
		expect(mocks.fetchEventsSince).toHaveBeenCalledWith('customer', 0, 100_000);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuses to erase existing rollups when Autumn unexpectedly returns no data', async () => {
		mocks.resolveCustomerId.mockResolvedValue('customer');
		mocks.fetchEventsSince.mockResolvedValue([]);
		mocks.eventsToDailyRollups.mockReturnValue([]);
		mocks.select.mockReturnValue({
			from: () =>
				Promise.resolve([{ date: '2026-07-14', model: 'test', tokens: 10, spendUsd: 1, events: 1 }])
		});

		await expect(syncUsage({ full: true })).rejects.toThrow(
			'Refusing to replace non-empty usage rollups with an empty Autumn result'
		);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});
});
