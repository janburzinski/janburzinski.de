import { env } from '$env/dynamic/private';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eventsToDailyRollups, fetchEventsSince } from './autumn';

const event = (id: string, timestamp: number, properties: Record<string, unknown> = {}) => ({
	id,
	timestamp,
	properties
});

function mockPages(pages: unknown[]) {
	const requests: Array<Record<string, unknown>> = [];
	const fetch = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
		requests.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
		const page = pages.shift();
		if (!page) throw new Error('Unexpected Autumn request');
		return new Response(JSON.stringify(page), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	});
	vi.stubGlobal('fetch', fetch);
	return requests;
}

beforeEach(() => {
	env.AUTUMN_SECRET_KEY = 'test-secret';
});

afterEach(() => {
	vi.unstubAllGlobals();
	delete env.AUTUMN_SECRET_KEY;
});

describe('fetchEventsSince', () => {
	it('reads every offset page before returning events', async () => {
		const requests = mockPages([
			{ list: [event('newest', 300), event('middle', 200)], has_more: true },
			{ list: [event('oldest', 100)], has_more: false }
		]);

		await expect(fetchEventsSince('customer', 0)).resolves.toHaveLength(3);
		expect(requests.map((request) => request.offset)).toEqual([0, 2]);
	});

	it('stops only after crossing the requested time boundary', async () => {
		const requests = mockPages([
			{ list: [event('inside', 300), event('outside', 99)], has_more: true }
		]);

		await expect(fetchEventsSince('customer', 100)).resolves.toEqual([event('inside', 300)]);
		expect(requests).toHaveLength(1);
	});

	it('rejects the cursor-shaped response that caused partial rollups', async () => {
		mockPages([{ list: [event('only-page', 300)], next_cursor: 'next' }]);

		await expect(fetchEventsSince('customer', 0)).rejects.toThrow('invalid pagination response');
	});

	it('retries the complete snapshot after an unstable offset window', async () => {
		const requests = mockPages([
			{ list: [event('a', 300), event('b', 200)], has_more: true },
			{ list: [event('b', 200)], has_more: false },
			{ list: [event('new', 400), event('a', 300)], has_more: true },
			{ list: [event('b', 200)], has_more: false }
		]);

		await expect(fetchEventsSince('customer', 0)).resolves.toEqual([
			event('new', 400),
			event('a', 300),
			event('b', 200)
		]);
		expect(requests.map((request) => request.offset)).toEqual([0, 2, 0, 2]);
	});

	it('still fails closed after three unstable snapshots', async () => {
		mockPages(
			Array.from({ length: 3 }).flatMap(() => [
				{ list: [event('a', 300), event('b', 200)], has_more: true },
				{ list: [event('b', 200)], has_more: false }
			])
		);

		await expect(fetchEventsSince('customer', 0)).rejects.toThrow(
			'Autumn events.list shifted while reading event b'
		);
	});

	it('rejects a partial window at the safety cap', async () => {
		mockPages([{ list: [event('a', 300), event('b', 200)], has_more: true }]);

		await expect(fetchEventsSince('customer', 0, 2)).rejects.toThrow('exceeded the 2 event cap');
	});
});

describe('eventsToDailyRollups', () => {
	it('matches Summer token fields per UTC date and model', () => {
		const rollups = eventsToDailyRollups([
			{
				...event('a', Date.parse('2026-07-11T23:59:00Z'), {
					model: 'openai/gpt',
					input_tokens: 10,
					output_tokens: 2,
					cache_read_tokens: 3,
					cache_write_tokens: 4
				}),
				value: 1.25
			},
			{
				...event('b', Date.parse('2026-07-12T00:01:00Z'), {
					model: 'openai/gpt',
					input_tokens: 5
				}),
				value: 0.5
			}
		]);

		expect(rollups).toEqual([
			{
				date: '2026-07-11',
				model: 'openai/gpt',
				tokens: 19,
				spendUsd: 1.25,
				events: 1
			},
			{
				date: '2026-07-12',
				model: 'openai/gpt',
				tokens: 5,
				spendUsd: 0.5,
				events: 1
			}
		]);
	});
});
