import { describe, it, expect } from 'vitest';
import { wouldCauseCycle } from '../src/utils/cycleDetection';

describe('In-flight Cycle Detection (DFS)', () => {
  it('detects immediate self-loops', () => {
    const isCycle = wouldCauseCycle([], { source: 'node_a', target: 'node_a' });
    expect(isCycle).toBe(true);
  });

  it('allows valid directed acyclic connections', () => {
    const edges = [
      { source: 'trigger', target: 'condition' },
      { source: 'condition', target: 'http_action' },
    ];

    const isCycle = wouldCauseCycle(edges, {
      source: 'trigger',
      target: 'http_action',
    });

    expect(isCycle).toBe(false);
  });

  it('detects direct 2-node cycle', () => {
    const edges = [{ source: 'A', target: 'B' }];

    const isCycle = wouldCauseCycle(edges, { source: 'B', target: 'A' });
    expect(isCycle).toBe(true);
  });

  it('detects indirect multi-step cycle (A -> B -> C -> D -> A)', () => {
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'D' },
    ];

    const isCycle = wouldCauseCycle(edges, { source: 'D', target: 'A' });
    expect(isCycle).toBe(true);
  });

  it('allows valid branching DAG without cycles', () => {
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
    ];

    const isCycle = wouldCauseCycle(edges, { source: 'C', target: 'D' });
    expect(isCycle).toBe(false);
  });

  it('detects cycle in diamond-like branching graph', () => {
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'C', target: 'D' },
    ];

    const isCycle = wouldCauseCycle(edges, { source: 'D', target: 'A' });
    expect(isCycle).toBe(true);
  });
});
