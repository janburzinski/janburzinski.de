import { defineConfig } from 'drizzle-kit';

// Migrations / push run against the DIRECT (:5432) connection — DDL over the PgBouncer pool (:6432)
// breaks. drizzle-kit loads variables from `.env` automatically.
const url = process.env.DATABASE_DIRECT_URL;
if (!url) throw new Error('DATABASE_DIRECT_URL is not set');

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dbCredentials: { url }
});
