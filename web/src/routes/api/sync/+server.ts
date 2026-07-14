import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { syncUsage } from '$lib/server/usage';

// Vercel Cron authenticates this endpoint with CRON_SECRET. Full and dry-run syncs remain explicit.
export const GET: RequestHandler = async ({ request, url }) => {
	const secret = env.CRON_SECRET;
	if (!secret) return json({ error: 'CRON_SECRET is not set' }, { status: 500 });
	if (request.headers.get('authorization') !== `Bearer ${secret}`) {
		return json({ error: 'unauthorized' }, { status: 401 });
	}

	const scheduled = request.headers.has('x-vercel-cron-schedule');
	const full = scheduled || url.searchParams.get('full') === '1';
	const dryRun = url.searchParams.get('dry') === '1';
	try {
		const report = await syncUsage({ full, dryRun });
		return json({ ok: true, ...report });
	} catch (error) {
		console.error('[sync] failed:', error);
		return json({ ok: false, error: String(error) }, { status: 500 });
	}
};
