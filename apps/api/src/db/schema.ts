import { pgTable, varchar, boolean, timestamp, uuid, integer, jsonb, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 128 }).notNull(),
  role: varchar('role', { length: 32 }).default('developer').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  category: varchar('category', { length: 64 }).default('GENERAL'),
  status: varchar('status', { length: 32 }).default('ACTIVE'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const workflowVersions = pgTable(
  'workflow_versions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    workflow_id: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
    version_number: integer('version_number').notNull(),
    definition: jsonb('definition').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.workflow_id, t.version_number)]
);

export const executionRuns = pgTable('execution_runs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workflow_id: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  version_id: uuid('version_id').references(() => workflowVersions.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 32 }).notNull(),
  context_state: jsonb('context_state').notNull(),
  error_details: jsonb('error_details'),
  started_at: timestamp('started_at').defaultNow(),
  finished_at: timestamp('finished_at'),
});

export const executionLogs = pgTable('execution_logs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  run_id: uuid('run_id').notNull().references(() => executionRuns.id, { onDelete: 'cascade' }),
  node_id: varchar('node_id', { length: 64 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  output: jsonb('output'),
  error: jsonb('error'),
  created_at: timestamp('created_at').defaultNow(),
});
