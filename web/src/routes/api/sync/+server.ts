import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { syncUsage } from '$lib/server/usage';

// Daily Autumn → DB sync, driven by Vercel Cron (see vercel.json). Vercel automatically attaches
// `Authorization: Bearer <CRON_SECRET>` to scheduled invocations when CRON_SECRET is set, which is
// what we check here so the endpoint isn't publicly triggerable. `?full=1` forces a full backfill.
export const GET: RequestHandler = async ({ request, url }) => {
	const secret = env.CRON_SECRET;
	if (!secret) return json({ error: 'CRON_SECRET is not set' }, { status: 500 });
	if (request.headers.get('authorization') !== `Bearer ${secret}`) {
		return json({ error: 'unauthorized' }, { status: 401 });
	}

	const full = url.searchParams.get('full') === '1';
	try {
		const report = await syncUsage({ full });
		return json({ ok: true, ...report });
	} catch (error) {
		console.error('[sync] failed:', error);
		return json({ ok: false, error: String(error) }, { status: 500 });
	}
};
