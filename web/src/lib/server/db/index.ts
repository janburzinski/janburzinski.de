import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

function createDatabase() {
	// PlanetScale Postgres. DATABASE_URL is the pooled (PgBouncer / :6432) connection — right for the
	// short read/write bursts the page and cron do. Validate it here so callers can handle missing
	// configuration without failing while their route module is being imported.
	const connectionString = env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL is not set');

	const pool = new pg.Pool({
		connectionString,
		ssl: { rejectUnauthorized: true }
	});

	// On Vercel Fluid Compute, drain in-flight queries before the instance is frozen/shut down. Loaded
	// lazily so the pool still works outside Vercel (local dev, other hosts) where the module is absent.
	import('@vercel/functions')
		.then(({ attachDatabasePool }) => attachDatabasePool(pool))
		.catch(() => {});

	return drizzle(pool, { schema });
}

let database: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
	database ??= createDatabase();
	return database;
}
