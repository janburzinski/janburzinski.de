import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { syncUsage } from '$lib/server/usage';

const jsonNoStore = (data: unknown, status = 200) =>
	json(data, {
		status,
		headers: { 'cache-control': 'private, no-store' }
	});

// Vercel Cron authenticates this endpoint with CRON_SECRET and always requests a full reconciliation.
export const GET: RequestHandler = async ({ request, url }) => {
	const secret = env.CRON_SECRET;
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return jsonNoStore({ error: 'unauthorized' }, 401);
	}

	const scheduled = request.headers.has('x-vercel-cron-schedule');
	const full = scheduled || url.searchParams.get('full') === '1';
	const dryRun = url.searchParams.get('dry') === '1';
	try {
		const report = await syncUsage({ full, dryRun });
		return jsonNoStore({ ok: true, ...report });
	} catch (error) {
		console.error('[sync] failed:', error);
		return jsonNoStore({ ok: false, error: 'sync failed' }, 500);
	}
};
