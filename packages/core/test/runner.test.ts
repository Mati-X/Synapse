import { describe, it, expect, vi } from 'vitest';
import { WorkflowRunner } from '../src/engine/runner.js';
import { ConditionExecutor } from '../src/executors/condition.js';
import { HttpRequestExecutor } from '../src/executors/http.js';
import { ExecutionContext, NodeExecutor } from '../src/types/execution.js';
import { WorkflowDefinition } from '../src/types/workflow.js';

describe('WorkflowRunner (Execution Engine)', () => {
  const createMockContext = (initialVariables: Record<string, any> = {}): ExecutionContext => ({
    runId: 'run-test-001',
    workflowId: 'wf-test-001',
    variables: initialVariables,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  });

  const setupRegistry = (): Map<string, NodeExecutor> => {
    const registry = new Map<string, NodeExecutor>();
    registry.set('CORE_CONDITION', new ConditionExecutor());
    registry.set('HTTP_REQUEST', new HttpRequestExecutor());
    return registry;
  };

  it('executes a linear workflow and accumulates variables in ExecutionContext', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => JSON.stringify({ ticketId: 777 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const workflow: WorkflowDefinition = {
      id: 'wf_incident',
      name: 'Incident Escalation',
      nodes: [
        {
          id: 'node_condition',
          type: 'CORE_CONDITION',
          data: {
            config: {
              field: 'trigger.severity',
              operator: 'equals',
              targetValue: 'CRITICAL',
            },
          },
        },
        {
          id: 'node_notify',
          type: 'HTTP_REQUEST',
          data: {
            config: {
              url: 'https://ops.example.com/tickets',
              method: 'POST',
              body: '{"alert":"Incident {{ trigger.severity }}","evaluated":{{ node_condition.evaluated }}}',
            },
          },
        },
      ],
      edges: [
        {
          id: 'e1',
          source: 'node_condition',
          target: 'node_notify',
        },
      ],
    };

    const runner = new WorkflowRunner(setupRegistry());
    const context = createMockContext({
      trigger: { severity: 'CRITICAL' },
    });

    const finalContext = await runner.run(workflow, context);

    // 1. Condition output should be stored in context.variables.node_condition
    expect(finalContext.variables.node_condition).toBeDefined();
    expect(finalContext.variables.node_condition.evaluated).toBe(true);

    // 2. HTTP output should be stored in context.variables.node_notify
    expect(finalContext.variables.node_notify).toBeDefined();
    expect(finalContext.variables.node_notify.data).toEqual({ ticketId: 777 });

    // 3. HTTP fetch was called with interpolated values from both trigger and previous step
    expect(fetchMock).toHaveBeenCalledWith('https://ops.example.com/tickets', {
      method: 'POST',
      headers: undefined,
      body: '{"alert":"Incident CRITICAL","evaluated":true}',
    });

    vi.unstubAllGlobals();
  });

  it('respects conditional branching and skips branches that do not match the handle', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    // Condition -> (true handle) -> node_high_priority
    // Condition -> (false handle) -> node_low_priority
    const workflow: WorkflowDefinition = {
      id: 'wf_branching',
      name: 'Branching Workflow',
      nodes: [
        {
          id: 'eval_step',
          type: 'CORE_CONDITION',
          data: {
            config: {
              field: 'severity',
              operator: 'equals',
              targetValue: 'HIGH',
            },
          },
        },
        {
          id: 'node_high_priority',
          type: 'HTTP_REQUEST',
          data: {
            config: { url: 'https://api.example.com/high', method: 'POST' },
          },
        },
        {
          id: 'node_low_priority',
          type: 'HTTP_REQUEST',
          data: {
            config: { url: 'https://api.example.com/low', method: 'POST' },
          },
        },
      ],
      edges: [
        {
          id: 'e_true',
          source: 'eval_step',
          sourceHandle: 'true',
          target: 'node_high_priority',
        },
        {
          id: 'e_false',
          source: 'eval_step',
          sourceHandle: 'false',
          target: 'node_low_priority',
        },
      ],
    };

    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => JSON.stringify({ done: true }),
    });

    const runner = new WorkflowRunner(setupRegistry());

    // Scenario: severity is 'LOW', so condition evaluates to false!
    const context = createMockContext({ severity: 'LOW' });
    const finalContext = await runner.run(workflow, context);

    expect(finalContext.variables.eval_step.evaluated).toBe(false);

    // node_high_priority should be SKIPPED!
    expect(finalContext.variables.node_high_priority).toBeUndefined();

    // node_low_priority should be EXECUTED!
    expect(finalContext.variables.node_low_priority).toBeDefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/low', expect.anything());

    vi.unstubAllGlobals();
  });

  it('throws an error if a node uses an unregistered executor type', async () => {
    const workflow: WorkflowDefinition = {
      id: 'wf_unknown',
      name: 'Unknown Node',
      nodes: [
        {
          id: 'unknown_step',
          type: 'UNREGISTERED_PLUGIN',
          data: { config: {} },
        },
      ],
      edges: [],
    };

    const runner = new WorkflowRunner(setupRegistry());
    const context = createMockContext({});

    await expect(runner.run(workflow, context)).rejects.toThrow(
      'Unknown node executor for type: UNREGISTERED_PLUGIN'
    );
  });

  it('emits telemetry events (NODE_STARTED, NODE_COMPLETED, NODE_SKIPPED) via onEvent callback', async () => {
    const events: any[] = [];
    const workflow: WorkflowDefinition = {
      id: 'wf_telemetry',
      name: 'Telemetry Workflow',
      nodes: [
        {
          id: 'step_cond',
          type: 'CORE_CONDITION',
          data: {
            config: { field: 'value', operator: 'equals', targetValue: 10 },
          },
        },
        {
          id: 'step_skipped',
          type: 'CORE_CONDITION',
          data: {
            config: { field: 'value', operator: 'equals', targetValue: 99 },
          },
        },
      ],
      edges: [
        {
          id: 'e1',
          source: 'step_cond',
          sourceHandle: 'false',
          target: 'step_skipped',
        },
      ],
    };

    const runner = new WorkflowRunner(setupRegistry());
    const context = createMockContext({ value: 10 }); // Condition evaluates to true, so false handle is skipped!

    await runner.run(workflow, context, (event) => {
      events.push(event);
    });

    const eventTypes = events.map((e) => e.type);
    expect(eventTypes).toContain('NODE_STARTED');
    expect(eventTypes).toContain('NODE_COMPLETED');
    expect(eventTypes).toContain('NODE_SKIPPED');

    const startedEvent = events.find((e) => e.type === 'NODE_STARTED');
    expect(startedEvent).toMatchObject({
      type: 'NODE_STARTED',
      runId: 'run-test-001',
      nodeId: 'step_cond',
    });

    const skippedEvent = events.find((e) => e.type === 'NODE_SKIPPED');
    expect(skippedEvent).toMatchObject({
      type: 'NODE_SKIPPED',
      runId: 'run-test-001',
      nodeId: 'step_skipped',
    });
  });
});

