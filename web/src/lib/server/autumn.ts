import { env } from '$env/dynamic/private';

// Autumn (useautumn.com) is the backend Summer stores AI-coding usage in. Each token event lands on
// the `usage_in_usd` feature: `value` is the USD Autumn priced it at (via Models.dev) and the token
// counts + model live in `properties`. This module is the *raw Autumn access layer* only — fetching
// events and folding them into daily (date, model) rollups. Persistence + the homepage-facing
// `getUsageStats()` live in `$lib/server/usage`. Server-only — the secret key must never reach the
// client.

const API_URL = 'https://api.useautumn.com';
const USAGE_FEATURE = 'usage_in_usd';
const PAGE = 1000;
/** Safety cap on incremental sweeps so a runaway loop can't page forever. Backfill passes Infinity. */
const DEFAULT_CAP = 20_000;

export type RawEvent = {
	id: string;
	timestamp: number;
	value?: number;
	properties?: Record<string, unknown>;
};

/** One folded (UTC-day, model) bucket. */
export type DailyRollup = {
	date: string;
	model: string;
	tokens: number;
	spendUsd: number;
	events: number;
};

async function autumn<T>(path: string, body: unknown): Promise<T> {
	const key = env.AUTUMN_SECRET_KEY;
	if (!key) throw new Error('AUTUMN_SECRET_KEY is not set');
	const res = await fetch(new URL(path, API_URL), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json',
			'X-API-Version': '2.1.0'
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Autumn ${path} failed (${res.status}): ${text.slice(0, 200)}`);
	}
	return res.json() as Promise<T>;
}

/** The Summer-managed customer (the developer whose usage we track). */
export async function resolveCustomerId(): Promise<string | null> {
	const res = await autumn<{
		list: Array<{ id: string; metadata?: Record<string, unknown> | null }>;
	}>('/v1/customers.list', { limit: 200, offset: 0 });
	const summer = res.list.find((c) => c.metadata?.summer === true);
	return summer?.id ?? res.list[0]?.id ?? null;
}

const num = (v: unknown) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/**
 * Page through usage events (newest first). Stops once an event is older than `sinceMs` (the API
 * returns newest-first, so once we cross the boundary everything after is older too) or once `cap`
 * events have been fetched. Pass `sinceMs = 0` + `cap = Infinity` for a full backfill.
 */
export async function fetchEventsSince(
	customerId: string,
	sinceMs: number,
	cap: number = DEFAULT_CAP
): Promise<RawEvent[]> {
	const out: RawEvent[] = [];
	for (let offset = 0; offset < cap; offset += PAGE) {
		const res = await autumn<{ list: RawEvent[]; has_more?: boolean }>('/v1/events.list', {
			customer_id: customerId,
			feature_id: USAGE_FEATURE,
			limit: PAGE,
			offset
		});
		const list = res.list ?? [];
		let crossedBoundary = false;
		for (const event of list) {
			if (event.timestamp < sinceMs) {
				crossedBoundary = true;
				break;
			}
			out.push(event);
		}
		if (crossedBoundary || list.length < PAGE || !res.has_more) break;
	}
	return out;
}

/** Fold events into (date, model) rollups. Order-independent → re-running over the same events
 * yields identical rollups (the property the transactional replace relies on for idempotency). */
export function eventsToDailyRollups(events: RawEvent[]): DailyRollup[] {
	const byKey = new Map<string, DailyRollup>();
	for (const event of events) {
		const p = event.properties ?? {};
		const model = typeof p.model === 'string' ? p.model : 'unknown';
		const tokens =
			num(p.input_tokens) +
			num(p.output_tokens) +
			num(p.cache_read_tokens) +
			num(p.cache_write_tokens);
		const date = dayKey(event.timestamp);
		const key = `${date}\0${model}`;
		let bucket = byKey.get(key);
		if (!bucket) {
			bucket = { date, model, tokens: 0, spendUsd: 0, events: 0 };
			byKey.set(key, bucket);
		}
		bucket.tokens += tokens;
		bucket.spendUsd += num(event.value);
		bucket.events += 1;
	}
	return [...byKey.values()];
}
