import { describe, it, expect } from 'vitest';
import { ConditionExecutor } from '../src/executors/condition.js';
import { ExecutionContext } from '../src/types/execution.js';

describe('ConditionExecutor (CORE_CONDITION)', () => {
  const executor = new ConditionExecutor();

  const createMockContext = (variables: Record<string, any>): ExecutionContext => ({
    runId: 'test-run-123',
    workflowId: 'test-wf-456',
    variables,
    logger: {
      info: () => {},
      error: () => {},
    },
  });

  describe('operator: equals & not_equals', () => {
    it('returns nextHandle "true" when strings or numbers match', async () => {
      const context = createMockContext({
        trigger: { body: { severity: 'CRITICAL', code: 500 } },
      });

      const resString = await executor.execute(
        { field: 'trigger.body.severity', operator: 'equals', targetValue: 'CRITICAL' },
        context
      );
      expect(resString.nextHandle).toBe('true');
      expect(resString.output.evaluated).toBe(true);

      const resNum = await executor.execute(
        { field: 'trigger.body.code', operator: 'equals', targetValue: 500 },
        context
      );
      expect(resNum.nextHandle).toBe('true');
      expect(resNum.output.evaluated).toBe(true);
    });

    it('returns nextHandle "false" when values do not match', async () => {
      const context = createMockContext({
        trigger: { body: { severity: 'LOW' } },
      });

      const res = await executor.execute(
        { field: 'trigger.body.severity', operator: 'equals', targetValue: 'CRITICAL' },
        context
      );
      expect(res.nextHandle).toBe('false');
      expect(res.output.evaluated).toBe(false);
    });

    it('handles not_equals operator correctly', async () => {
      const context = createMockContext({
        trigger: { body: { status: 'PENDING' } },
      });

      const resTrue = await executor.execute(
        { field: 'trigger.body.status', operator: 'not_equals', targetValue: 'COMPLETED' },
        context
      );
      expect(resTrue.nextHandle).toBe('true');

      const resFalse = await executor.execute(
        { field: 'trigger.body.status', operator: 'not_equals', targetValue: 'PENDING' },
        context
      );
      expect(resFalse.nextHandle).toBe('false');
    });
  });

  describe('operator: contains', () => {
    it('checks for substring match inside text', async () => {
      const context = createMockContext({
        trigger: { body: { message: 'Database connection failed: pool timeout' } },
      });

      const resTrue = await executor.execute(
        { field: 'trigger.body.message', operator: 'contains', targetValue: 'pool timeout' },
        context
      );
      expect(resTrue.nextHandle).toBe('true');

      const resFalse = await executor.execute(
        { field: 'trigger.body.message', operator: 'contains', targetValue: 'success' },
        context
      );
      expect(resFalse.nextHandle).toBe('false');
    });
  });

  describe('operator: gt & lt (greater than / less than)', () => {
    it('compares numeric values properly', async () => {
      const context = createMockContext({
        trigger: { body: { latency: 350, retries: 2 } },
      });

      const resGtTrue = await executor.execute(
        { field: 'trigger.body.latency', operator: 'gt', targetValue: 200 },
        context
      );
      expect(resGtTrue.nextHandle).toBe('true');

      const resGtFalse = await executor.execute(
        { field: 'trigger.body.latency', operator: 'gt', targetValue: 500 },
        context
      );
      expect(resGtFalse.nextHandle).toBe('false');

      const resLtTrue = await executor.execute(
        { field: 'trigger.body.retries', operator: 'lt', targetValue: 5 },
        context
      );
      expect(resLtTrue.nextHandle).toBe('true');
    });
  });

  describe('metadata & safety', () => {
    it('has type CORE_CONDITION and category LOGIC', () => {
      expect(executor.type).toBe('CORE_CONDITION');
      expect(executor.category).toBe('LOGIC');
    });

    it('returns false gracefully when the field does not exist', async () => {
      const context = createMockContext({});
      const res = await executor.execute(
        { field: 'missing.deep.path', operator: 'equals', targetValue: 'anything' },
        context
      );
      expect(res.nextHandle).toBe('false');
      expect(res.output.evaluated).toBe(false);
    });
  });
});
