import { env } from '$env/dynamic/private';

const API_URL = 'https://api.useautumn.com';
const USAGE_FEATURE = 'usage_in_usd';
const PAGE = 1000;
const DEFAULT_CAP = 20_000;
export const FULL_SYNC_CAP = 100_000;
const SNAPSHOT_ATTEMPTS = 3;

export type RawEvent = {
	id: string;
	timestamp: number;
	value?: number;
	properties?: Record<string, unknown>;
};

export type DailyRollup = {
	date: string;
	model: string;
	harness: string;
	tokens: number;
	spendUsd: number;
	events: number;
};

type OffsetPage<T> = {
	list: T[];
	has_more?: boolean;
	limit?: number;
	offset?: number;
	total?: number;
};

type CursorPage<T> = {
	list: T[];
	next_cursor?: string | null;
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

export async function resolveCustomerId(): Promise<string | null> {
	type Customer = { id: string; metadata?: Record<string, unknown> | null };
	let cursor: string | undefined;
	let foundAny = false;

	do {
		const res = await autumn<CursorPage<Customer>>('/v1/customers.list', {
			limit: 200,
			...(cursor ? { start_cursor: cursor } : {})
		});
		foundAny ||= res.list.length > 0;
		const summer = res.list.find((customer) => customer.metadata?.summer === true);
		if (summer) return summer.id;
		cursor = res.next_cursor ?? undefined;
	} while (cursor);

	if (foundAny) throw new Error('No Autumn customer with metadata.summer=true found');
	return null;
}

const num = (v: unknown) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

class UnstablePaginationError extends Error {}

/**
 * Page through usage events (newest first). Stops once an event is older than `sinceMs` (the API
 * returns newest-first, so once we cross the boundary everything after is older too) or once `cap`
 * events have been fetched. The legacy POST endpoint uses offset pagination. Any malformed,
 * duplicate, out-of-order, or capped result throws so the caller never replaces complete rollups
 * with a partial event window.
 */
async function fetchEventsSinceAttempt(
	customerId: string,
	sinceMs: number,
	cap: number
): Promise<RawEvent[]> {
	const out: RawEvent[] = [];
	const seenIds = new Set<string>();
	let offset = 0;
	let previousTimestamp = Number.POSITIVE_INFINITY;

	for (;;) {
		const remaining = cap - out.length;
		if (remaining <= 0) {
			throw new Error(`Autumn event sync exceeded the ${cap.toLocaleString('en-US')} event cap`);
		}
		const limit = Math.min(PAGE, remaining);
		const res = await autumn<OffsetPage<RawEvent>>('/v1/events.list', {
			customer_id: customerId,
			feature_id: USAGE_FEATURE,
			limit,
			offset
		});
		if (!Array.isArray(res.list) || typeof res.has_more !== 'boolean') {
			throw new Error('Autumn events.list returned an invalid pagination response');
		}
		const list = res.list;
		let crossedBoundary = false;
		for (const event of list) {
			if (!event.id || !Number.isFinite(event.timestamp)) {
				throw new Error('Autumn events.list returned an invalid event');
			}
			if (event.timestamp > previousTimestamp) {
				throw new UnstablePaginationError(
					'Autumn events.list changed order while reading the snapshot'
				);
			}
			previousTimestamp = event.timestamp;
			if (seenIds.has(event.id)) {
				throw new UnstablePaginationError(
					`Autumn events.list shifted while reading event ${event.id}`
				);
			}
			seenIds.add(event.id);
			if (event.timestamp < sinceMs) {
				crossedBoundary = true;
				break;
			}
			out.push(event);
		}
		if (crossedBoundary) break;
		if (!res.has_more) break;
		if (list.length === 0) {
			throw new Error(`Autumn events.list pagination did not advance at offset ${offset}`);
		}
		if (out.length >= cap) {
			throw new Error(`Autumn event sync exceeded the ${cap.toLocaleString('en-US')} event cap`);
		}
		offset += list.length;
	}

	return out;
}

export async function fetchEventsSince(
	customerId: string,
	sinceMs: number,
	cap: number = DEFAULT_CAP
): Promise<RawEvent[]> {
	for (let attempt = 1; attempt <= SNAPSHOT_ATTEMPTS; attempt += 1) {
		try {
			return await fetchEventsSinceAttempt(customerId, sinceMs, cap);
		} catch (error) {
			if (!(error instanceof UnstablePaginationError) || attempt === SNAPSHOT_ATTEMPTS) throw error;
		}
	}
	throw new Error('Autumn event sync exhausted its snapshot attempts');
}

export function eventsToDailyRollups(events: RawEvent[]): DailyRollup[] {
	const byKey = new Map<string, DailyRollup>();
	for (const event of events) {
		const p = event.properties ?? {};
		const model = typeof p.model === 'string' ? p.model : 'unknown';
		const harness = typeof p.harness === 'string' && p.harness ? p.harness : 'unknown';
		const tokens =
			num(p.input_tokens) +
			num(p.output_tokens) +
			num(p.cache_read_tokens) +
			num(p.cache_write_tokens);
		const date = dayKey(event.timestamp);
		const key = `${date}\0${model}\0${harness}`;
		let bucket = byKey.get(key);
		if (!bucket) {
			bucket = { date, model, harness, tokens: 0, spendUsd: 0, events: 0 };
			byKey.set(key, bucket);
		}
		bucket.tokens += tokens;
		bucket.spendUsd += num(event.value);
		bucket.events += 1;
	}
	return [...byKey.values()];
}
