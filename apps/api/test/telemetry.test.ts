import { describe, it, expect, vi } from 'vitest';
import { telemetryBroker } from '../src/telemetry/telemetryBroker.js';
import { WorkflowTelemetryEvent } from '@synapse/core';

describe('Server-Sent Events (SSE) Telemetry Broker', () => {
  it('delivers events strictly to subscribers of the matching runId', () => {
    const run1Events: WorkflowTelemetryEvent[] = [];
    const run2Events: WorkflowTelemetryEvent[] = [];

    const unsub1 = telemetryBroker.subscribe('run_1', (event) => {
      run1Events.push(event);
    });

    const unsub2 = telemetryBroker.subscribe('run_2', (event) => {
      run2Events.push(event);
    });

    telemetryBroker.emit({
      type: 'NODE_STARTED',
      runId: 'run_1',
      nodeId: 'webhook_in',
      timestamp: new Date().toISOString(),
    });

    telemetryBroker.emit({
      type: 'NODE_COMPLETED',
      runId: 'run_2',
      nodeId: 'condition_step',
      output: { evaluated: true },
      nextHandle: 'true',
      timestamp: new Date().toISOString(),
    });

    expect(run1Events).toHaveLength(1);
    expect(run1Events[0].nodeId).toBe('webhook_in');
    expect(run1Events[0].type).toBe('NODE_STARTED');

    expect(run2Events).toHaveLength(1);
    expect(run2Events[0].nodeId).toBe('condition_step');
    expect(run2Events[0].type).toBe('NODE_COMPLETED');

    unsub1();
    telemetryBroker.emit({
      type: 'NODE_COMPLETED',
      runId: 'run_1',
      nodeId: 'webhook_in',
      output: {},
      timestamp: new Date().toISOString(),
    });

    expect(run1Events).toHaveLength(1);

    unsub2();
  });
});
