import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env['DATABASE_URL'] || 'postgresql://synapse_user:synapse_pass@localhost:5432/synapse';

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export type Database = typeof db;
