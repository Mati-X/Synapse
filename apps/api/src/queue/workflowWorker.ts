import { Worker, Job } from 'bullmq';
import { WORKFLOW_QUEUE_NAME, WorkflowJobData } from './workflowQueue.js';
import { redisConnectionOptions } from './connection.js';
import {
  ConditionExecutor,
  HttpRequestExecutor,
  WorkflowRunner,
  ExecutionContext,
} from '@synapse/core';
import { db } from '../db/index.js';
import { executionRuns } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { telemetryBroker } from '../telemetry/telemetryBroker.js';

export function createWorkflowWorker() {
  const worker = new Worker<WorkflowJobData>(
    WORKFLOW_QUEUE_NAME,
    async (job: Job<WorkflowJobData>) => {
      const { runId, workflowId, definition, initialVariables } = job.data;

      await db
        .update(executionRuns)
        .set({
          status: 'RUNNING',
          started_at: new Date(),
        })
        .where(eq(executionRuns.id, runId));

      const registry = new Map();
      registry.set('CORE_CONDITION', new ConditionExecutor());
      registry.set('HTTP_REQUEST', new HttpRequestExecutor());
      const runner = new WorkflowRunner(registry);

      const context: ExecutionContext = {
        runId,
        workflowId,
        variables: initialVariables || {},
        logger: {
          info: (msg, meta) => console.log(`[Worker][Run ${runId}] INFO: ${msg}`, meta ?? ''),
          error: (msg, meta) => console.error(`[Worker][Run ${runId}] ERROR: ${msg}`, meta ?? ''),
        },
      };

      try {
        const finalContext = await runner.run(definition, context, (event) => telemetryBroker.emit(event));

        await db
          .update(executionRuns)
          .set({
            status: 'COMPLETED',
            context_state: finalContext.variables,
            finished_at: new Date(),
          })
          .where(eq(executionRuns.id, runId));

        return { runId, status: 'COMPLETED' };
      } catch (err: any) {
        await db
          .update(executionRuns)
          .set({
            status: 'FAILED',
            error_details: { message: err.message },
            finished_at: new Date(),
          })
          .where(eq(executionRuns.id, runId));

        throw err;
      }
    },
    {
      connection: redisConnectionOptions,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ [BullMQ] Job ${job.id} (Run ${job.data.runId}) completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ [BullMQ] Job ${job?.id} (Run ${job?.data.runId}) failed: ${err.message}`);
  });

  return worker;
}