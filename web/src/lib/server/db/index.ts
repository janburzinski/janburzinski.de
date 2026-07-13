import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

function createDatabase() {
	const connectionString = env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL is not set');

	const pool = new pg.Pool({
		connectionString,
		ssl: { rejectUnauthorized: true }
	});

	// Drain in-flight queries on Vercel while keeping the pool portable to other hosts.
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
