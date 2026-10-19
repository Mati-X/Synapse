import { Queue } from 'bullmq';
import { WorkflowDefinition } from '@synapse/core';
import { redisConnectionOptions } from './connection.js';

export const WORKFLOW_QUEUE_NAME = 'workflow-executions';

export interface WorkflowJobData {
  runId: string;
  workflowId: string;
  versionId: string;
  definition: WorkflowDefinition;
  initialVariables: Record<string, any>;
}

export const workflowQueue = new Queue<WorkflowJobData>(WORKFLOW_QUEUE_NAME, {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});
