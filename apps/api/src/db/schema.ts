import { pgTable, varchar, boolean, timestamp, uuid, integer, jsonb, unique } from 'drizzle-orm/pg-core';
import {sql} from "drizzle-orm";

export const workflows = pgTable('workflows', {
     id: varchar('id', { length: 64 }).primaryKey(),
     name: varchar('name', { length: 255 }).notNull(),
     is_active: boolean('is_active').default(true),
     created_at: timestamp('created_at').defaultNow(),
     updated_at: timestamp('updated_at').defaultNow(),
});

export const workflowVersions = pgTable('workflow_versions', {
     id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
     workflow_id: varchar('workflow_id', { length: 64 }).notNull().references(() => workflows.id, {onDelete: 'cascade'}),
     version_number: integer('version_number').notNull(),
     definition: jsonb('definition').notNull(),
     created_at: timestamp('created_at').defaultNow(),
}, (t) => [unique().on(t.workflow_id, t.version_number)]);

export const executionRuns = pgTable('execution_runs', {
     id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
     workflow_id: varchar('workflow_id', { length: 64 }).notNull().references(() => workflows.id,  {onDelete: 'cascade'}),
     version_id: uuid('version_id').references(() => workflowVersions.id, {onDelete: 'cascade'}),
     status: varchar('status', { length: 32 }).notNull(),
     context_state: jsonb('context_state').notNull(),
     error_details: jsonb('error_details'),
     started_at: timestamp('started_at').defaultNow(),
     finished_at: timestamp('finished_at'),
});
