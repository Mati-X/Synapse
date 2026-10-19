import { describe, it, expect, vi } from 'vitest';
import { workflowQueue } from '../src/queue/workflowQueue.js';

describe('Workflow Task Queue (BullMQ)', () => {
  it('has correct queue name and exponential backoff configuration', () => {
    expect(workflowQueue.name).toBe('workflow-executions');
    expect(workflowQueue.defaultJobOptions.attempts).toBe(3);
    expect(workflowQueue.defaultJobOptions.backoff).toEqual({
      type: 'exponential',
      delay: 1000,
    });
  });
});
