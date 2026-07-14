import { env } from '$env/dynamic/private';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ syncUsage: vi.fn() }));

vi.mock('$lib/server/usage', () => ({ syncUsage: mocks.syncUsage }));

import { GET } from './+server';

const requestEvent = (url: string, headers: HeadersInit = {}) => ({
	request: new Request(url, { headers: { authorization: 'Bearer test-secret', ...headers } }),
	url: new URL(url)
});

beforeEach(() => {
	env.CRON_SECRET = 'test-secret';
	mocks.syncUsage.mockResolvedValue({ mode: 'backfill', dryRun: false });
});

afterEach(() => {
	vi.clearAllMocks();
	delete env.CRON_SECRET;
});

describe('usage sync endpoint', () => {
	it('runs scheduled Vercel cron requests as full reconciliations', async () => {
		const response = await GET(
			requestEvent('http://localhost/api/sync', {
				'x-vercel-cron-schedule': '0 4 * * *'
			}) as Parameters<typeof GET>[0]
		);

		expect(response.status).toBe(200);
		expect(mocks.syncUsage).toHaveBeenCalledWith({ full: true, dryRun: false });
	});

	it('passes explicit full dry runs through without writing itself', async () => {
		const response = await GET(
			requestEvent('http://localhost/api/sync?full=1&dry=1') as Parameters<typeof GET>[0]
		);

		expect(response.status).toBe(200);
		expect(mocks.syncUsage).toHaveBeenCalledWith({ full: true, dryRun: true });
	});

	it('rejects requests without the cron secret', async () => {
		const event = requestEvent('http://localhost/api/sync');
		event.request = new Request(event.url);
		const response = await GET(event as Parameters<typeof GET>[0]);

		expect(response.status).toBe(401);
		expect(response.headers.get('cache-control')).toBe('private, no-store');
		expect(mocks.syncUsage).not.toHaveBeenCalled();
	});

	it('fails closed without revealing whether the server secret is configured', async () => {
		delete env.CRON_SECRET;

		const response = await GET(
			requestEvent('http://localhost/api/sync') as Parameters<typeof GET>[0]
		);

		expect(response.status).toBe(401);
		expect(await response.json()).toEqual({ error: 'unauthorized' });
		expect(mocks.syncUsage).not.toHaveBeenCalled();
	});

	it('does not expose upstream or database errors', async () => {
		mocks.syncUsage.mockRejectedValue(new Error('sensitive upstream detail'));

		const response = await GET(
			requestEvent('http://localhost/api/sync') as Parameters<typeof GET>[0]
		);

		expect(response.status).toBe(500);
		expect(response.headers.get('cache-control')).toBe('private, no-store');
		expect(await response.json()).toEqual({ ok: false, error: 'sync failed' });
	});
});
