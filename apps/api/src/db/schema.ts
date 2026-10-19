import { pgTable, varchar, boolean, timestamp, uuid, integer, jsonb, unique } from 'drizzle-orm/pg-core';
import {sql} from "drizzle-orm";

// --- workflows ---
// Kolumny:
//   id:         varchar(64) PRIMARY KEY
//   name:       varchar(255) NOT NULL
//   is_active:  boolean, DEFAULT true
//   created_at: timestamp with timezone, DEFAULT now()
//   updated_at: timestamp with timezone, DEFAULT now()

export const workflows = pgTable('workflows', {
     id: varchar('id', { length: 64 }).primaryKey(),
     name: varchar('name', { length: 255 }).notNull(),
     is_active: boolean('is_active').default(true),
     created_at: timestamp('created_at').defaultNow(),
     updated_at: timestamp('updated_at').defaultNow(),
});


// --- workflow_versions ---
// Kolumny:
//   id:             uuid PRIMARY KEY, DEFAULT gen_random_uuid()
//   workflow_id:    varchar(64), NOT NULL, referencja do workflows.id (ON DELETE CASCADE)
//   version_number: integer, NOT NULL
//   definition:     jsonb, NOT NULL  <-- tu przechowujemy cały JSON workflow
//   created_at:     timestamp with timezone, DEFAULT now()
// Constraint: UNIQUE(workflow_id, version_number) -- jedna wersja na numer per workflow
//
export const workflowVersions = pgTable('workflow_versions', {
     id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
     workflow_id: varchar('workflow_id', { length: 64 }).notNull().references(() => workflows.id, {onDelete: 'cascade'}),
     version_number: integer('version_number').notNull(),
     definition: jsonb('definition').notNull(),
     created_at: timestamp('created_at').defaultNow(),
}, (t) => [unique().on(t.workflow_id, t.version_number)]);


// --- execution_runs ---
// Kolumny:
//   id:            uuid PRIMARY KEY, DEFAULT gen_random_uuid()
//   workflow_id:   varchar(64), NOT NULL, referencja do workflows.id
//   version_id:    uuid, referencja do workflow_versions.id
//   status:        varchar(32), NOT NULL  -- 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
//   context_state: jsonb, NOT NULL  <-- pełny snapshot kontekstu wykonania
//   error_details: jsonb  <-- nullable, wypełniane tylko przy błędzie
//   started_at:    timestamp with timezone, DEFAULT now()
//   finished_at:   timestamp with timezone  <-- nullable
//
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
