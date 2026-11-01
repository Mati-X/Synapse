import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env['DATABASE_URL'] || 'postgresql://synapse_user:synapse_pass@localhost:5432/synapse',
  },
  verbose: true,
  strict: true,
});
